// usage: node cases.js <deference-unit.out> <board.jsonl> <out.txt> [since=2026-11-01]
// The member rows C's D629 run printed from `since` on, each case's CLAIM, LEVER and FOLD board rows with their text, read by the
// SAME line counter deference-unit.js readBoard uses (one per non-empty line, 1-based). Prints the board row's pane and ts beside the
// case's, so a board that moved under the numbering shows as a mismatch rather than a wrong text. Read-only.
'use strict';
const fs = require('fs');
const [OUT, BOARD, DEST, SINCE = '2026-11-01'] = process.argv.slice(2);
const want = new Map(), cases = [];
for (const l of fs.readFileSync(OUT, 'utf8').split(/\r?\n/)) {
  const m = l.match(/^— (\w+)\s+CLAIM (\S+ \S+) line (\d+)\s+LEVER (\S+ \S+) line (\d+)\s+FOLD (\S+ \S+) line (\d+)/);
  if (!m || m[4] < SINCE) continue;
  const c = { pane: m[1], claim: { ts: m[2], line: +m[3] }, lever: { ts: m[4], line: +m[5] }, fold: { ts: m[6], line: +m[7] } };
  cases.push(c); for (const k of ['claim', 'lever', 'fold']) want.set(c[k].line, null);
}
let line = 0;
require('C:/Users/nname/Desktop/worktrees/lh-d630-e/consonance/tools/sourced.js').eachLine(BOARD, (l) => {
  if (!l) return; line++;
  if (!want.has(line)) return;
  let r; try { r = JSON.parse(l); } catch (_) { want.set(line, { torn: true }); return; }
  const ts = typeof r.ts === 'number' ? r.ts : Date.parse(r.ts || 0);
  want.set(line, { pane: r.pane, role: r.role, ts: Number.isFinite(ts) ? new Date(ts).toISOString().slice(0, 19).replace('T', ' ') : '?', text: String(r.text || '') });
});
const out = []; let mism = 0;
cases.forEach((c, i) => {
  out.push(`### case ${i + 1}  pane ${c.pane}`);
  for (const k of ['claim', 'lever', 'fold']) {
    const r = want.get(c[k].line) || {};
    const ok = r.pane === c.pane && r.ts === c[k].ts; if (!ok) mism++;
    out.push(`-- ${k.toUpperCase()} line ${c[k].line} ${c[k].ts} [board: ${r.pane} ${r.role} ${r.ts}${ok ? '' : ' MISMATCH'}] (${(r.text || '').length} chars)`);
    out.push((r.text || '').slice(0, k === 'lever' ? 700 : 1400).replace(/\s+\n/g, '\n'));
  }
  out.push('');
});
fs.writeFileSync(DEST, out.join('\n'));
console.log(`cases ${cases.length}, rows read ${want.size}, board lines ${line}, mismatches ${mism}`);
