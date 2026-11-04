// Measure the L062 sniffer's marker set against FULL chair dispatch texts in this seat's own transcripts on D.
// Read-only. Only user turns that begin "[chair:MAIN]" are read — the chair's output, not any seat's work.
const fs = require('fs'), path = require('path');
const DIR = 'C:/Users/nname/.claude/projects/C--Consonance-instances-sibling-3d57124e';
const MARK = /\b(sealed|answer key|planted|N PLANTED|sha256|CEILING|FLOOR|scored against the key)\b/;
const seen = new Map();
for (const f of fs.readdirSync(DIR).filter((x) => x.endsWith('.jsonl'))) {
  for (const line of fs.readFileSync(path.join(DIR, f), 'utf8').split('\n')) {
    let o; try { o = JSON.parse(line); } catch (_) { continue; }
    if (o.type !== 'user' || !o.message) continue;
    const c = o.message.content;
    const text = typeof c === 'string' ? c : Array.isArray(c) ? c.filter((b) => b.type === 'text').map((b) => b.text).join('\n') : '';
    const i = text.indexOf('[chair:MAIN]');
    if (i < 0) continue;
    const d = text.slice(i);
    const key = d.slice(0, 160);
    if (!seen.has(key)) seen.set(key, d);
  }
}
const rows = [...seen.values()];
const keyedTask = (d) => /A draft note is sitting unlanded|A copy of a tool is sitting in a scratch directory|Is the code bloated, or is the corpus bloated/.test(d);
let hits = 0;
console.log(`distinct chair dispatches found: ${rows.length}`);
for (const d of rows) {
  const m = d.match(MARK);
  if (m) hits++;
  if (m || keyedTask(d)) console.log(`  ${keyedTask(d) ? 'KEYED TASK ' : '           '} ${m ? 'HIT "' + m[0] + '"' : 'no hit    '}  ${d.slice(13, 110).replace(/\s+/g, ' ')}`);
}
console.log(`marker hits: ${hits} of ${rows.length}; keyed tasks found: ${rows.filter(keyedTask).length}, of which hit: ${rows.filter((d) => keyedTask(d) && MARK.test(d)).length}`);
