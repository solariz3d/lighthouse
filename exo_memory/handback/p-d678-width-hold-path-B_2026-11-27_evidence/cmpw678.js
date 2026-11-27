// cmpw678.js (pane B, D678 Track 1): the comparisons hand-back 1.3 and 1.7 quote, from the runs' own outputs (no core is loaded).
// (1) ROW 2: ripple268w.js on c2591bf against the repair, per row: the hash of the width (knots + w) and the printed line's fields. Prints every row's two
//     hashes, so the table stands in for the two 1 MB JSONs.
// (2) TRACK 2, ahead: E's d678.js on c2591bf against the repair, the width columns per held row, by caller; the Sharp rows' size; Finish's first piece.
// usage: node cmpw678.js <r268 c2591bf.json> <r268 repair.json> <d678 c2591bf.json> <d678 repair.json>
'use strict';
const [ra, rb, da, db] = process.argv.slice(2).map((f) => require(require('path').resolve(f)));
const LINE = ['maxDev', 'maxDevAt', 'off1mmUntil', 'maxW2', 'knots'];
let n = 0, w = 0, l = 0;
console.log('== row 2: ripple268w, c2591bf | repair (width hash = knots + w)');
for (const k of ['table', 'lengths', 'sweep', 'extra']) ra[k].forEach((x, i) => {
  const y = rb[k][i]; n++; const sw = x.wHash === y.wHash; if (sw) w++;
  const sl = LINE.every((q) => x[q] === y[q]) && JSON.stringify(x.end) === JSON.stringify(y.end) && JSON.stringify(x.joint) === JSON.stringify(y.joint); if (sl) l++;
  console.log(`${k} ${i}: ${x.wHash} | ${y.wHash} ${sw ? 'same' : 'DIFFER'}; printed line ${sl ? 'same' : 'DIFFER'}`);
});
console.log(`ROW 2: width the same ${w} of ${n}; printed line the same ${l} of ${n}; the bar (table): ${ra.table.filter((x, i) => x.wHash === rb.table[i].wHash).length} of ${ra.table.length}`);
console.log('\n== Track 2 ahead: d678 width columns, c2591bf | repair, held rows by caller');
const COLS = ['swing', 'swingAt', 'factor', 'over1mmUntil', 'over1e9Until', 'end', 'joint', 'w2B', 'w2fine'], by = {}, size = {};
da.rows.forEach((x, i) => {
  const y = db.rows[i]; if (x.case !== y.case || x.caller !== y.caller) throw new Error(`row ${i}: the two runs are not in the same order`);
  if (!x.head || x.head.m === 0 || !x.added) return;
  const o = (by[x.caller] ||= { same: 0, differ: 0 }), same = COLS.every((c) => JSON.stringify(x[c]) === JSON.stringify(y[c])); same ? o.same++ : o.differ++;
  if (same) return;
  const s = (size[x.caller] ||= { mm: 0, pct: 0, w2: [0, 0], u1: [[1e9, 0], [1e9, 0]], len: new Set(), bad: 0 }), d = Math.abs(x.swing - y.swing);
  s.mm = Math.max(s.mm, 1000 * d); if (x.swing) s.pct = Math.max(s.pct, (100 * d) / Math.abs(x.swing));
  s.w2 = [Math.max(s.w2[0], x.w2B), Math.max(s.w2[1], y.w2B)];
  s.u1 = [[Math.min(s.u1[0][0], x.over1mmUntil), Math.max(s.u1[0][1], x.over1mmUntil)], [Math.min(s.u1[1][0], y.over1mmUntil), Math.max(s.u1[1][1], y.over1mmUntil)]];
  s.len.add(`${x.length} -> ${y.length}`); if (y.joint !== null || y.end.m !== 0 || y.end.v !== y.head.v) s.bad++;
});
for (const [c, o] of Object.entries(by)) console.log(`${c}: the same ${o.same}, differ ${o.differ}`);
for (const [c, s] of Object.entries(size)) console.log(`${c}: swing moved at most ${s.mm.toFixed(3)} mm (at most ${s.pct.toFixed(2)}% of a row's swing); largest |w''| ${s.w2[0]} -> ${s.w2[1]}; over 1 mm until ${s.u1[0].join('-')} -> ${s.u1[1].join('-')}; lengths ${[...s.len].join(', ')}; rows not ending at the head, level, joint null: ${s.bad}`);
console.log('\n== Finish: the first new piece\'s hold figures (all but its hashes and knots), c2591bf | repair');
db.finish.forEach((y, i) => {
  const x = da.finish[i], f = (o) => { const c = { ...o.first }; delete c.firstKnots; delete c.piece; delete c.pieceNoW; return JSON.stringify(c); };
  console.log(`${y.head}: hold figures ${f(x) === f(y) ? 'same' : 'DIFFER'}; pieces ${x.pieces.map((p) => p.length).join('/')} -> ${y.pieces.map((p) => p.length).join('/')}`);
});
