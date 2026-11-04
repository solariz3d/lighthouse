// D277 step 6 (B, verifier): render each claim's TURN (prompt, tool calls and results before the claim, the message) into
// one text file per message, so kinds and verdicts are judged from the turn as the registration §3 asks. Read-only.
'use strict';
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, 'turns'); fs.mkdirSync(OUT, { recursive: true });
const { claims } = require('C:/Consonance/retrieval/remeasure1003/verify/B/claims.json');
const RES = +(process.env.RES || 2500), INP = +(process.env.INP || 900);

const msgs = new Map();
for (const c of claims) { if (!msgs.has(c.messageId)) msgs.set(c.messageId, { ...c, claims: [] }); msgs.get(c.messageId).claims.push(c); }
const order = [...msgs.values()].sort((a, b) => a.ts.localeCompare(b.ts));
order.forEach((m, i) => { m.idx = String(i + 1).padStart(2, '0'); });

const cut = (s, n) => (s.length <= n ? s : s.slice(0, Math.ceil(n * 0.7)) + `\n…[${s.length - n} chars cut]…\n` + s.slice(s.length - Math.floor(n * 0.3)));
function render(o, no, mine) {
  const t = o.type, ts = o.timestamp || '', msg = o.message || {};
  const parts = [], content = typeof msg.content === 'string' ? [{ type: 'text', text: msg.content }] : (msg.content || []);
  for (const b of content) {
    if (b.type === 'text') parts.push(`${t === 'user' ? 'USER' : 'TEXT'}: ${mine ? b.text : cut(b.text, t === 'user' ? 3000 : 2500)}`);
    else if (b.type === 'tool_use') parts.push(`TOOL_USE ${b.name} [${b.id}]: ${mine ? JSON.stringify(b.input) : cut(JSON.stringify(b.input), INP)}`);
    else if (b.type === 'tool_result') {
      const c = typeof b.content === 'string' ? b.content : (b.content || []).map((x) => (x.type === 'text' ? x.text : `[${x.type}]`)).join('\n');
      parts.push(`RESULT [${b.tool_use_id}]${b.is_error ? ' ERROR' : ''}: ${cut(c, RES)}`);
    } else if (b.type === 'thinking') { /* not shown: not part of what the seat said or saw */ }
  }
  if (!parts.length) return null;
  return `--- L${no} ${t} ${ts}${mine ? '  <<< THE CLAIM\'S MESSAGE' : ''}\n${parts.join('\n')}`;
}

const byFile = new Map();
for (const m of order) { if (!byFile.has(m.transcript)) byFile.set(m.transcript, []); byFile.get(m.transcript).push(m); }
for (const [file, ms] of byFile) {
  const want = new Map(); // line -> [messages]
  for (const m of ms) { m.buf = []; const end = Math.max(...m.lines); for (let l = m.turnStartLine; l <= end; l++) { if (!want.has(l)) want.set(l, []); want.get(l).push(m); } }
  const maxLine = Math.max(...want.keys());
  const fd = fs.openSync(file, 'r'), CH = 8 << 20, buf = Buffer.alloc(CH); let carry = Buffer.alloc(0), no = 0, pos = 0, done = false;
  while (!done) {
    const n = fs.readSync(fd, buf, 0, CH, pos); if (!n) break; pos += n;
    let data = Buffer.concat([carry, buf.subarray(0, n)]), start = 0, i;
    while ((i = data.indexOf(0x0a, start)) !== -1) {
      no++;
      if (want.has(no)) {
        let o; try { o = JSON.parse(data.toString('utf8', start, i)); } catch (_) { o = null; }
        for (const m of want.get(no)) { const r = o && render(o, no, m.lines.includes(no)); if (r) m.buf.push(r); }
      }
      start = i + 1; if (no >= maxLine) { done = true; break; }
    }
    carry = data.subarray(start);
  }
  fs.closeSync(fd);
  for (const m of ms) {
    const head = `MESSAGE ${m.idx}  ${m.messageId}  seat ${m.seat}  ts ${m.ts}  turn L${m.turnStartLine}..L${Math.max(...m.lines)} (next prompt L${m.nextPromptLine})\nCLAIMS:\n` +
      m.claims.map((c) => `  [${c.claimId}] ${c.statement}`).join('\n') + '\n\n';
    fs.writeFileSync(path.join(OUT, `${m.idx}.txt`), head + m.buf.join('\n') + '\n');
    console.log(m.idx, m.seat, m.ts, m.claims.length, 'claims', fs.statSync(path.join(OUT, `${m.idx}.txt`)).size, 'B');
  }
}
