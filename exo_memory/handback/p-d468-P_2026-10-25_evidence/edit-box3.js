'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/src/core/finish.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
function edit(oldS, newS) { oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`anchor ${n}: ${oldS.slice(0, 60)}`); s = s.replace(oldS, newS); }
// zero-share points are free again (the C2 tail of a neighbouring bank may land on a straight's end)
edit(`pinned: pinned || t === 0, kh: P.channels.kh[i] }); }   // D468: a point with no share (a straight's, a rolling piece's) is pinned at none, as the ruling says, instead of free for the sweeps to lean on`,
`pinned, kh: P.channels.kh[i] }); }`);
// the boxes
edit(`  // D468: each free point's box. Tight, [0, its share], where the share keeps one sign over the point and its two neighbours in the window; where it rings (the fitted
  // kh of a transition to 0 rings about 0, so the share alternates in sign along a turn's tail) the hull of the three, so the rate and acceleration bounds govern
  // the roll-off there as before (a tight box at ringing points forced the plan through 0 at every other one: a corner left its turn at 1.7° instead of 50.9°)
  for (let k = 0; k < seq.length; k++) {
    const x = seq[k], a = k > 0 && seq[k - 1].p === x.p ? seq[k - 1].share : x.share, c = k + 1 < seq.length && seq[k + 1].p === x.p ? seq[k + 1].share : x.share;
    const oneSign = Math.sign(a) * Math.sign(x.share) >= 0 && Math.sign(c) * Math.sign(x.share) >= 0;
    x.lo = oneSign ? Math.min(0, x.share) : Math.min(0, a, x.share, c); x.hi = oneSign ? Math.max(0, x.share) : Math.max(0, a, x.share, c);
  }`,
`  // D468: each free point's box, so that no projection carries a point PAST its share (the limits only ever hold a bank back; a projection onto a triple's
  // acceleration bound moves the two neighbours the other way, and that recoil put TEST 10's p22 point 4 at 6.43° against a share of 6.13°). Three cases:
  // · a steady share (one sign over the point and the three on either side of it in its piece): [0, the share];
  // · a ringing share (the fitted kh of a transition to 0 rings about 0, so the share alternates in sign along a turn's tail): no box, the rate and acceleration
  //   bounds govern the roll-off there as before (a box at those points forced the plan through 0 at every other one: a corner left its turn at 1.7° instead of 50.9°);
  // · no share (a straight's): [0, 0], none of its own, except its three points nearest a joint to another planned piece, which are free: THE TAIL OF A ROLL-OFF
  //   MAY COMPLETE ON THE STRAIGHT. A turn's bank ramps from its third control point (its first two are pinned at the joint), so for the joint to be C2 either the
  //   straight's third point carries that curvature (about 1.5° at one control point, the bank's smooth end over the straight's first span) or the turn's third
  //   point must be 0 too and every corner reaches its exit a knot later: 24.4° at the last curved station against 32.5° (D447 §10's table, 5° allowed), and the
  //   20 m flip's second corner leaving at 38.5° against 50.9°. The tail on the straight is the smaller change and the better road; "a straight gets none" reads
  //   "none of its own" now (core_finish_bank row 4, core_close_banks_lap row 9, amended by name).
  const RING = 3;
  for (let k = 0; k < seq.length; k++) {
    const x = seq[k]; let ring = false, lo = -RING, hi = RING;
    for (let j = Math.max(0, k - RING); j <= Math.min(seq.length - 1, k + RING); j++) if (seq[j].p === x.p && seq[j].share * x.share < 0) ring = true;
    if (ring) { x.lo = -Infinity; x.hi = Infinity; continue; }
    if (x.share !== 0) { x.lo = Math.min(0, x.share); x.hi = Math.max(0, x.share); continue; }
    const n = kFrom.pieces[x.p].channels.kh.length, prevLinked = road.includes(x.p - 1), nextL = road.includes(x.p + 1);
    const tail = (prevLinked && x.i <= 2) || (nextL && x.i >= n - 3);
    x.lo = tail ? -Infinity : 0; x.hi = tail ? Infinity : 0; void lo; void hi;
  }`);
fs.writeFileSync(p, s); console.log('box3 edited');
