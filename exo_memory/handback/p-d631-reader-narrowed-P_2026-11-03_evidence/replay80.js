// replay80.js <evidence-dir> <hook.js>: each sampled ring's text through the narrowed trigger (classify), against the D627 verdicts in table.md
'use strict';
const fs = require('fs'), path = require('path');
const [ev, hook] = process.argv.slice(2);
const { classify } = require(path.resolve(hook));
const verdict = {};
for (const l of fs.readFileSync(path.join(ev, 'table.md'), 'utf8').split('\n')) { const m = l.match(/^\| (\d{4}) \| [^|]+ \| (ERROR-MISSED|ERROR-CAUGHT-ANYWAY|NO-ERROR|UNDECIDABLE) \|/); if (m) verdict[m[1]] = m[2]; }
const out = [];
for (const f of fs.readdirSync(path.join(ev, 'rows')).sort()) {
  const s = fs.readFileSync(path.join(ev, 'rows', f), 'utf8'), id = f.slice(0, 4);
  const tool = (s.match(/· (mcp__consonance__call_\w+)/) || [])[1], seat = (s.match(/^# row \d+ · \S+ · (\S+)/) || [])[1];
  const at = s.indexOf('## the message as sent'); const text = s.slice(s.indexOf('\n\n', at) + 2);
  const c = classify(text, tool); out.push({ id, seat, tool: tool && tool.replace('mcp__consonance__', ''), verdict: verdict[id], inClass: c.inClass, why: c.why });
}
const err = out.filter((r) => /^ERROR/.test(r.verdict));
const n = (p) => out.filter(p).length;
console.log(JSON.stringify({ rows: out.length, verdicts: Object.keys(verdict).length, inClass: n((r) => r.inClass), skipped: n((r) => !r.inClass),
  errors: err.length, errorsInClass: err.filter((r) => r.inClass).length, noErrorInClass: n((r) => r.verdict === 'NO-ERROR' && r.inClass), noErrorSkipped: n((r) => r.verdict === 'NO-ERROR' && !r.inClass),
  byTool: ['call_chair', 'call_librarian'].map((t) => ({ t, rows: n((r) => r.tool === t), inClass: n((r) => r.tool === t && r.inClass) })),
  byWhy: { status: n((r) => r.why === 'status'), relayed: n((r) => r.why === 'relayed-figure') } }));
for (const r of err) console.log('error', r.id, r.seat, r.tool, r.verdict, r.inClass, r.why);
fs.writeFileSync('replay80.out.jsonl', out.map((r) => JSON.stringify(r)).join('\n') + '\n');
