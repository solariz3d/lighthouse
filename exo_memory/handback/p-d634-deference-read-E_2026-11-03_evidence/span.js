// usage: node span.js <board.jsonl> <from-to>[,<from-to>...]  — the board rows in each line range (deference-unit's counter: one per
// non-empty line), pane 0c0c0c0b only, role, ts and the first 260 characters. Read-only.
'use strict';
const [BOARD, SPANS] = process.argv.slice(2);
const spans = SPANS.split(',').map((s) => s.split('-').map(Number));
const lo = Math.min(...spans.map((s) => s[0])), hi = Math.max(...spans.map((s) => s[1]));
let line = 0; const out = [];
require('C:/Users/nname/Desktop/worktrees/lh-d630-e/consonance/tools/sourced.js').eachLine(BOARD, (l) => {
  if (!l) return; line++;
  if (line < lo || line > hi || !spans.some(([a, b]) => line >= a && line <= b)) return;
  let r; try { r = JSON.parse(l); } catch (_) { return; }
  if (!String(r.pane || '').startsWith('0c0c0c0b')) return;
  const ts = new Date(typeof r.ts === 'number' ? r.ts : Date.parse(r.ts)).toISOString().slice(11, 19);
  out.push(`${line} ${r.role} ${ts} | ${String(r.text || '').replace(/\s+/g, ' ').slice(0, 260)}`);
});
console.log(out.join('\n'));
