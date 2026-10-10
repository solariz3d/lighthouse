// turns.js (pane B, D201 verifier): for each claim assigned to B, render its TURN (transcript rows turnStart..nextPrompt) to a
// text file per message, with EVERY LABEL_RE match masked to [·] BEFORE anything is written, so the verifier never reads a
// self-label. Read-only on transcripts. node turns.js <packet.json> <outdir>
'use strict';
const fs = require('fs'), path = require('path'), os = require('os');
const LABEL_RE_G = /\b(checked|inferred):/g;
const mask = (s) => String(s).replace(LABEL_RE_G, '[·]');
const [pkt, out] = process.argv.slice(2);
const P = JSON.parse(fs.readFileSync(pkt, 'utf8'));
const mine = P.claims.filter((c) => c.assign.includes('B'));
fs.mkdirSync(out, { recursive: true });
const root = path.join(os.homedir(), '.claude', 'projects');
const byMsg = new Map();
for (const c of mine) { if (!byMsg.has(c.messageId)) byMsg.set(c.messageId, []); byMsg.get(c.messageId).push(c); }
const cut = (s, n) => (s.length > n ? s.slice(0, n) + ` …[+${s.length - n} chars]` : s);
const index = [];
const cache = new Map();
for (const [mid, cs] of byMsg) {
  const c0 = cs[0], tf = path.join(root, c0.transcript);
  let status = 'ok', body = '';
  if (!fs.existsSync(tf)) status = 'TRANSCRIPT NOT ON D';
  else {
    if (!cache.has(tf)) cache.set(tf, fs.readFileSync(tf, 'utf8').split('\n'));
    const lines = cache.get(tf), rows = new Set(c0.rowLines);
    const lo = c0.turnStart, hi = c0.nextPrompt;
    const parts = [];
    for (let i = lo; i <= Math.min(hi, lines.length); i++) {
      const raw = lines[i - 1]; if (!raw) continue;
      let o; try { o = JSON.parse(raw); } catch (_) { continue; }
      const m = o.message; if (!m) continue;
      const tag = `${rows.has(i) ? '>>>' : '   '} L${i} ${o.timestamp || ''} ${o.type}`;
      const blocks = typeof m.content === 'string' ? [{ type: 'text', text: m.content }] : (m.content || []);
      for (const b of blocks) {
        if (b.type === 'text') parts.push(`${tag} TEXT: ${rows.has(i) || o.type === 'user' ? mask(b.text) : cut(mask(b.text), 1500)}`);
        else if (b.type === 'tool_use') parts.push(`${tag} TOOL_USE ${b.name}: ${cut(mask(JSON.stringify(b.input)), 700)}`);
        else if (b.type === 'tool_result') { const t = typeof b.content === 'string' ? b.content : (b.content || []).map((x) => x.text || '').join('\n'); parts.push(`${tag} RESULT: ${cut(mask(t), 1800)}`); }
      }
    }
    body = parts.join('\n');
  }
  const head = cs.map((c) => `CLAIM ${c.claimId}${c.assign.length > 1 ? ' (shared)' : ''} [${c.seat} ${c.machine} ${c.ts}]\n  ${c.statement}`).join('\n');
  const file = path.join(out, mid + '.txt');
  fs.writeFileSync(file, `${head}\n\nSTATUS: ${status}\n${'='.repeat(60)}\n${body}\n`);
  index.push({ mid, n: cs.length, status, chars: body.length, ts: c0.ts, seat: c0.seat, machine: c0.machine });
}
index.sort((a, b) => a.ts.localeCompare(b.ts));
fs.writeFileSync(path.join(out, 'index.json'), JSON.stringify(index, null, 1));
const tot = index.reduce((a, x) => a + x.chars, 0);
console.log(JSON.stringify({ messages: index.length, claims: mine.length, missing: index.filter((x) => x.status !== 'ok').map((x) => x.mid + ' ' + x.machine), totalChars: tot, max: Math.max(...index.map((x) => x.chars)) }));
