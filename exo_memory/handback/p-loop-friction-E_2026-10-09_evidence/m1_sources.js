// D276 item 1+2, the SOURCES gate: every deny in sources-gate.jsonl, paired with the next ALLOW from the same session and tool, and both message
// texts recovered EXACTLY from the sender's transcript: the ledger's ringSha is sha256(text) (sources-gate.js:319), so a transcript tool_use whose
// text hashes to it IS that message. CONTENT = the text minus its SOURCES/Sources/NEXT/OUTPUT lines (the plan's definition), trailing space trimmed.
// Read-only on every input. Writes only to this scratch folder.
'use strict';
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');
const OUT = __dirname;
const LEDGER = 'C:\\Consonance\\data\\sources-gate.jsonl';
const PROJECTS = path.join(process.env.USERPROFILE, '.claude', 'projects');
const sha = (s) => crypto.createHash('sha256').update(s).digest('hex');

const rows = fs.readFileSync(LEDGER, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const sids = [...new Set(rows.map((r) => r.sessionId))];

// every transcript file named <sid>.jsonl, in any project folder (a seat may have more than one, e.g. a retired copy)
const files = {};
for (const d of fs.readdirSync(PROJECTS)) {
  for (const sid of sids) { const f = path.join(PROJECTS, d, sid + '.jsonl'); if (fs.existsSync(f)) (files[sid] = files[sid] || []).push(f); }
}

async function index(file, want) {
  const rl = readline.createInterface({ input: fs.createReadStream(file, { encoding: 'utf8' }), crlfDelay: Infinity });
  for await (const line of rl) {
    if (!line.includes('"name":"mcp__consonance__')) continue;
    let o; try { o = JSON.parse(line); } catch (_) { continue; }
    const content = o && o.message && Array.isArray(o.message.content) ? o.message.content : [];
    for (const c of content) {
      if (c.type !== 'tool_use' || !c.input) continue;
      for (const k of ['text', 'message', 'prompt']) {
        const t = c.input[k];
        if (typeof t === 'string') { const h = sha(t); if (want.has(h)) want.set(h, { text: t, ts: o.timestamp, file }); }
      }
    }
  }
}
const strip = (t) => t.split(/\r?\n/).filter((l) => !/^\s*(SOURCES|Sources)\s*:/.test(l) && !/^\s*NEXT\s*:/.test(l) && !/^\s*OUTPUT\s*(→|->)/.test(l))
  .map((l) => l.replace(/\s+$/, '')).join('\n').trim();
const gateLines = (t) => t.split(/\r?\n/).filter((l) => /^\s*(SOURCES|Sources)\s*:/.test(l) || /^\s*NEXT\s*:/.test(l) || /^\s*OUTPUT\s*(→|->)/.test(l)).join('\n');

(async () => {
  // pairs: deny -> the next allow, same session and tool, after it
  const pairs = [];
  rows.forEach((r, i) => {
    if (r.decision !== 'deny') return;
    // same session, same tool, and for chair_inject the same TARGET seat (a dispatch to another seat is not a re-send)
    const same = (x) => x.sessionId === r.sessionId && x.tool === r.tool && (x.target || null) === (r.target || null);
    const next = rows.slice(i + 1).find((x) => same(x) && (x.decision === 'allow' || x.decision === 'deny'));
    const allow = rows.slice(i + 1).find((x) => same(x) && x.decision === 'allow');
    pairs.push({ deny: r, nextIsDeny: next && next.decision === 'deny', allow });
  });
  const want = new Map();
  for (const p of pairs) { want.set(p.deny.ringSha, null); if (p.allow) want.set(p.allow.ringSha, null); }
  for (const sid of Object.keys(files)) for (const f of files[sid]) await index(f, want);

  const out = [];
  for (const p of pairs) {
    const d = want.get(p.deny.ringSha), a = p.allow ? want.get(p.allow.ringSha) : null;
    const row = {
      ts: p.deny.ts, tool: p.deny.tool.replace('mcp__consonance__', ''), seat: p.deny.sessionId.slice(0, 8), target: p.deny.target || null, unmatched: p.deny.unmatched,
      allowTs: p.allow ? p.allow.ts : null, gapS: p.allow ? (Date.parse(p.allow.ts) - Date.parse(p.deny.ts)) / 1000 : null,
      foundDeny: !!d, foundAllow: !!a, nextIsDeny: !!p.nextIsDeny,
    };
    if (d && a) {
      row.contentSame = strip(d.text) === strip(a.text);
      row.wholeSame = d.text === a.text;
      row.gateLinesSame = gateLines(d.text) === gateLines(a.text);
      if (!row.contentSame) {
        const dl = new Set(strip(d.text).split('\n')), al = new Set(strip(a.text).split('\n'));
        row.removed = [...dl].filter((l) => !al.has(l)); row.added = [...al].filter((l) => !dl.has(l));
      }
    }
    out.push(row);
  }
  fs.writeFileSync(path.join(OUT, 'm1_pairs.json'), JSON.stringify(out, null, 1));
  const by = {};
  for (const r of out) {
    const k = r.tool; const b = (by[k] = by[k] || { denies: 0, paired: 0, recovered: 0, contentSame: 0, contentChanged: 0, chainedDeny: 0, gaps: [] });
    b.denies++; if (r.allowTs) b.paired++; if (r.nextIsDeny) b.chainedDeny++;
    if (r.foundDeny && r.foundAllow) { b.recovered++; if (r.contentSame) b.contentSame++; else b.contentChanged++; }
    if (r.gapS != null) b.gaps.push(r.gapS);
  }
  const q = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor((s.length - 1) * p)] : null; };
  for (const [k, b] of Object.entries(by)) { b.gapMedianS = q(b.gaps, 0.5); b.gapP90S = q(b.gaps, 0.9); b.gapMaxS = Math.max(...b.gaps); b.gapSumS = b.gaps.reduce((x, y) => x + y, 0); delete b.gaps; }
  console.log(JSON.stringify({ files, by }, null, 1));
})();
