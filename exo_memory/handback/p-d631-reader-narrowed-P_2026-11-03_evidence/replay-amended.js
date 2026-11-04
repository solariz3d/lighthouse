// replay-amended.js <D627 evidence dir> <oos replay jsonl> <hook.js>: the AMENDED trigger (READ_TOOLS, call_chair only) over both 80-ring samples.
// The in-sample 80 carry D627's verdicts (table.md); the out-of-sample 80 carry the tool and whether the ledger flagged the ring.
'use strict';
const fs = require('fs'), path = require('path');
const [ev, oos, hook] = process.argv.slice(2);
const { READ_TOOLS } = require(path.resolve(hook));
const verdict = {};
for (const l of fs.readFileSync(path.join(ev, 'table.md'), 'utf8').split('\n')) { const m = l.match(/^\| (\d{4}) \| [^|]+ \| (ERROR-MISSED|ERROR-CAUGHT-ANYWAY|NO-ERROR|UNDECIDABLE) \|/); if (m) verdict[m[1]] = m[2]; }
const ins = fs.readdirSync(path.join(ev, 'rows')).sort().map((f) => ({ id: f.slice(0, 4), tool: (fs.readFileSync(path.join(ev, 'rows', f), 'utf8').match(/· (mcp__consonance__call_\w+)/) || [])[1] }));
const read = (t) => READ_TOOLS.has(t.startsWith('mcp__') ? t : 'mcp__consonance__' + t);
const inRead = ins.filter((r) => read(r.tool)), err = ins.filter((r) => /^ERROR/.test(verdict[r.id]));
const o = fs.readFileSync(oos, 'utf8').split('\n').filter(Boolean).map(JSON.parse), oRead = o.filter((r) => read(r.tool));
console.log(JSON.stringify({ readTools: [...READ_TOOLS],
  inSample: { rows: ins.length, calls: inRead.length, saved: ins.length - inRead.length, errors: err.length, errorsKept: err.filter((r) => read(r.tool)).length, notesOnNoError: inRead.filter((r) => verdict[r.id] === 'NO-ERROR').length },
  outOfSample: { rows: o.length, calls: oRead.length, saved: o.length - oRead.length, notes: oRead.filter((r) => r.flagged).length } }));
