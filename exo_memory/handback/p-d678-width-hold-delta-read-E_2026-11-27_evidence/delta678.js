// delta678.js (pane E, D678 Track 2): d678.js's rows on two trees joined by (case, caller), scored against ruling 3's bar: the width columns the same for every
// caller but Sharp R40 ramp 8 and Sharp R150 ramp 4; those within 1.1 mm of swing, ending at the head's width level, joint null. Level-head rows: the same bytes.
// Finish: closed, plan, placed, the first piece's width figures, the pieces' lengths. usage: node delta678.js <older.json> <newer.json>
'use strict';
const [O, N] = process.argv.slice(2).map((f) => require(require('path').resolve(f)));
const key = (r) => `${r.case} | ${r.caller}`, mapO = new Map(O.rows.map((r) => [key(r), r]));
const held = (r) => !r.refused && r.head && r.head.m !== 0;
const COLS = ['swing', 'swingAt', 'factor', 'over1mmUntil', 'over1e9Until', 'end', 'joint', 'w2B', 'w2fine', 'w2fineAt', 'placedSame'];
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const SHARP_BAR = new Set(['sharp -60 R40 ramp8', 'sharp 90 R150 ramp4']);
const per = {}, out = [], fails = [];
const bump = (c, k) => { per[c] = per[c] || {}; per[c][k] = (per[c][k] || 0) + 1; };
for (const n of N.rows) {
  const o = mapO.get(key(n)); if (!o) { fails.push(`${key(n)}: not in older`); continue; }
  const c = n.caller;
  if (n.refused || o.refused) { const same = n.refused === o.refused; bump(c, same ? 'refused both, same text' : 'REFUSAL DIFFERS'); if (!same) fails.push(`${key(n)}: refusal ${o.refused} -> ${n.refused}`); continue; }
  if (!held(n)) { const same = n.piece === o.piece; bump(c, same ? 'level head, bytes same' : 'LEVEL HEAD BYTES DIFFER'); if (!same) fails.push(`${key(n)}: level-head bytes differ`); continue; }
  const diff = COLS.filter((k) => !eq(n[k], o[k]));
  if (!diff.length) { bump(c, 'held, width columns same'); continue; }
  bump(c, 'held, width columns DIFFER');
  const dSw = Math.abs(n.swing - o.swing) * 1000, endLevel = n.end.v === n.head.v && n.end.m === 0;
  if (SHARP_BAR.has(c)) {
    const ok = dSw <= 1.1 && endLevel && n.joint === null && n.placedSame;
    bump(c, ok ? 'sharp within the bar' : 'SHARP OUTSIDE THE BAR');
    if (!ok) fails.push(`${key(n)}: dswing ${dSw.toFixed(3)} mm, end ${JSON.stringify(n.end)}, joint ${n.joint}`);
    per[c].maxDswingMm = Math.max(per[c].maxDswingMm || 0, +dSw.toFixed(3));
    per[c].maxRelDswing = Math.max(per[c].maxRelDswing || 0, +(dSw / Math.abs(1000 * o.swing)).toFixed(5));
    per[c].lengths = per[c].lengths || new Set(); per[c].lengths.add(`${o.length} -> ${n.length}`);
    per[c].w2B = per[c].w2B || [Infinity, -Infinity, Infinity, -Infinity]; const W = per[c].w2B; W[0] = Math.min(W[0], o.w2B); W[1] = Math.max(W[1], o.w2B); W[2] = Math.min(W[2], n.w2B); W[3] = Math.max(W[3], n.w2B);
    per[c].over1mm = per[c].over1mm || [0, 0]; per[c].over1mm[0] = Math.max(per[c].over1mm[0], o.over1mmUntil); per[c].over1mm[1] = Math.max(per[c].over1mm[1], n.over1mmUntil);
  } else fails.push(`${key(n)}: columns differ ${diff.join(',')} (swing ${o.swing} -> ${n.swing})`);
}
for (const c of Object.keys(per)) if (per[c].lengths) per[c].lengths = [...per[c].lengths];
console.log('== per caller'); for (const [c, v] of Object.entries(per)) console.log(c, JSON.stringify(v));
console.log('\n== Finish');
for (const fn of N.finish) {
  const fo = O.finish.find((x) => x.head === fn.head);
  if (fn.refused || fo.refused) { console.log(`${fn.head}: refused ${fo.refused} -> ${fn.refused}`); continue; }
  const firstSame = COLS.filter((k) => k !== 'placedSame').filter((k) => !eq(fn.first[k], fo.first[k]));
  console.log(`${fn.head}: closed ${fo.closed} -> ${fn.closed}, plan ${fo.plan} -> ${fn.plan}, window ${JSON.stringify(fo.window)} -> ${JSON.stringify(fn.window)}, placed ${fn.placedSame ? 'same' : 'MOVED'}, lengths ${fo.pieces.map((p) => p.length).join('/')} -> ${fn.pieces.map((p) => p.length).join('/')}, first piece's width columns ${firstSame.length ? 'DIFFER ' + firstSame.join(',') : 'same'}, bytes ${fn.first.piece === fo.first.piece ? 'same' : 'differ'}`);
  if (!fn.closed || !fn.placedSame || firstSame.length) fails.push(`finish ${fn.head}`);
}
console.log('\n== against the bar:', fails.length ? `${fails.length} FAIL\n` + fails.slice(0, 40).join('\n') : '0 fail');
