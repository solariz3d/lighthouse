'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/src/core/finish.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
function edit(oldS, newS) { oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`anchor ${n}: ${oldS.slice(0, 60)}`); s = s.replace(oldS, newS); }
// 1. a point whose share is 0 is pinned: a straight's, a rolling piece's (the ruling: a straight gets none; a rolling piece is never banked)
edit(`const t = up && !pinned ? bankOf(P.channels.kh[i], share) : 0; seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t, share: t, pinned, kh: P.channels.kh[i] }); }`,
`const t = up && !pinned ? bankOf(P.channels.kh[i], share) : 0; seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t, share: t, pinned: pinned || t === 0, kh: P.channels.kh[i] }); }   // D468: a point with no share (a straight's, a rolling piece's) is pinned at none, as the ruling says, instead of free for the sweeps to lean on`);
// 2. the box: tight where the share keeps one sign over the point and its neighbours, the hull of the three where it rings (the fitted kh of a transition to 0 rings about 0, so the share there alternates in sign; a tight box at those points forced the plan through 0 at every other one and crushed the roll-off out of a turn: the 20 m flip's second corner left its turn at 1.7° instead of 50.9°)
edit(`    for (const x of seq) { if (x.pinned || x.share === 0) continue; const lo = Math.min(0, x.share), hi = Math.max(0, x.share); if (x.t < lo) { worst = Math.max(worst, lo - x.t); x.t = lo; } else if (x.t > hi) { worst = Math.max(worst, x.t - hi); x.t = hi; } }`,
`    for (const x of seq) { if (x.pinned) continue; if (x.t < x.lo) { worst = Math.max(worst, x.lo - x.t); x.t = x.lo; } else if (x.t > x.hi) { worst = Math.max(worst, x.t - x.hi); x.t = x.hi; } }`);
// the boxes, computed once after the pins (before the sweeps)
edit(`  for (const r of rows) r.terms = r.terms.filter(([x]) => x);   // a slot not in seq is a pinned 0 (a linked piece's first point) and adds nothing`,
`  for (const r of rows) r.terms = r.terms.filter(([x]) => x);   // a slot not in seq is a pinned 0 (a linked piece's first point) and adds nothing
  // D468: each free point's box. Tight, [0, its share], where the share keeps one sign over the point and its two neighbours in the window; where it rings (the fitted
  // kh of a transition to 0 rings about 0, so the share alternates in sign along a turn's tail) the hull of the three, so the rate and acceleration bounds govern
  // the roll-off there as before (a tight box at ringing points forced the plan through 0 at every other one: a corner left its turn at 1.7° instead of 50.9°)
  for (let k = 0; k < seq.length; k++) {
    const x = seq[k], a = k > 0 && seq[k - 1].p === x.p ? seq[k - 1].share : x.share, c = k + 1 < seq.length && seq[k + 1].p === x.p ? seq[k + 1].share : x.share;
    const oneSign = Math.sign(a) * Math.sign(x.share) >= 0 && Math.sign(c) * Math.sign(x.share) >= 0;
    x.lo = oneSign ? Math.min(0, x.share) : Math.min(0, a, x.share, c); x.hi = oneSign ? Math.max(0, x.share) : Math.max(0, a, x.share, c);
  }`);
fs.writeFileSync(p, s); console.log('box2 edited');
