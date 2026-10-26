'use strict';
// D477 read (the chair's row): the plan never takes away a bank he laid: a piece's floor from its PINNED points; row 7's lap rebuilt as a rectangle closed on its last two pieces.
const fs = require('fs');
const T = 'C:/Users/nname/Downloads/t180-wt-p477';
function patch(file, pairs) {
  let x = fs.readFileSync(file, 'utf8');
  const crlf = x.includes('\r\n'), nl = (s) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s);
  if (crlf) x = nl(x);   // an earlier heredoc edit left LF lines inside the CRLF file
  for (const [from0, to0] of pairs) {
    const from = nl(from0), to = nl(to0), n = x.split(from).length - 1;
    if (n !== 1) throw new Error(`${file}: expected once, found ${n}: ${from0.slice(0, 80)}`);
    x = x.replace(from, to);
  }
  fs.writeFileSync(file, x); console.log(`${file}: ${pairs.length} edits`);
}
patch(`${T}/src/core/finish.js`, [
  [`const t = up && !pinned ? bankOf(P.channels.kh[i], share) : 0, e = carried ? carried.get(p)[i] : 0;
      // D477 (the chair's row, "D477 read"): THE PLAN NEVER TAKES A BANK AWAY. A free point starts at the larger of its share and the bank it carries when they
      // lean the same way (a 3° bank he laid on a straight, whose share is 0, starts and stays at 3°; a gentle curve carried at 3° with a 7° share starts at 7°
      // and its box below holds it at 3° or more); a bank carried the other way is replaced, as before. With no carried bank this is the share, as before
      const t0 = !up || pinned ? e : (t * e >= 0 && Math.abs(e) > Math.abs(t) ? e : t);
      seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t: t0, e, share: t, pinned, kh: P.channels.kh[i] }); }`,
   `const t = up && !pinned ? bankOf(P.channels.kh[i], share) : 0, e = carried ? carried.get(p)[i] : 0; seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t: up && !pinned ? t : e, e, share: t, pinned, kh: P.channels.kh[i] }); }`],
  [`  const RING = 3;
  for (let k = 0; k < seq.length; k++) {
    const x = seq[k]; let ring = false;
    for (let j = Math.max(0, k - RING); j <= Math.min(seq.length - 1, k + RING); j++) if (seq[j].p === x.p && seq[j].share * x.share < 0) ring = true;
    if (ring) { x.lo = -Infinity; x.hi = Infinity; continue; }
    const n = kFrom.pieces[x.p].channels.kh.length, prevLinked = road.includes(x.p - 1), nextL = road.includes(x.p + 1);
    const tail = (prevLinked && x.i <= 2) || (nextL && x.i >= n - 3);   // the three points nearest a joint to another planned piece: the joint's pins, row and bounds govern them
    if (tail) { x.lo = -Infinity; x.hi = Infinity; continue; }
    // D477: on the TOTAL bank (t), as the rate and acceleration bounds are; its far side is the larger of the share and the bank the point carries the share's
    // way (the chair's row: a straight at 3° keeps it, a gentle curve at 3° is never taken under 3°), so with no carried bank it is [0, the share] as before,
    // and on a lap this press banked (what a point carries is within its box) it is the first press's box: the second press is the first press's system
    const far = x.share * x.e >= 0 ? (Math.sign(x.share) || Math.sign(x.e) || 1) * Math.max(Math.abs(x.share), Math.abs(x.e)) : x.share;
    x.lo = Math.min(0, far); x.hi = Math.max(0, far);
  }`,
   `  // D477 (the chair's row, "D477 read"): THE PLAN NEVER TAKES AWAY A BANK HE LAID. A piece's FLOOR is the bank its PINNED points carry the piece's way (the
  // sign of its shares, else of what its pins carry): a straight he banked 3° has 3° at both pinned ends, a gentle curve carried at 3° the same, and the floor is
  // 3°; a piece this press laid has its pins at upright, or at a relaxed joint none, and the floor is 0. The floor is read from the pins alone because THE PRESS
  // NEVER MOVES A PIN: a second press reads the same floor and solves the first press's system. A bank carried the other way floors nothing and is replaced.
  // Where the floor is 0 every box and start is as before; where it is not, a free point starts at the larger of its share and the floor (the straight at 3°
  // starts and stays there; the curve at 3° with a 7° share starts at 7°), the box runs from the floor to that, and a ringing or tail point keeps its open far
  // side but not its open near one
  const floorOf = new Map();
  for (const p of road) {
    const pts = seq.filter((x) => x.p === p), pins = pts.filter((x) => x.pinned), d = Math.sign(pts.reduce((q, x) => q + x.share, 0)) || Math.sign(pins.reduce((q, x) => q + x.e, 0)) || 1;
    floorOf.set(p, { d, f: pins.length ? Math.max(0, Math.min(...pins.map((x) => d * x.e))) : 0 });
  }
  const RING = 3;
  for (let k = 0; k < seq.length; k++) {
    const x = seq[k], { d, f } = floorOf.get(x.p), sd = d * x.share; let ring = false;
    for (let j = Math.max(0, k - RING); j <= Math.min(seq.length - 1, k + RING); j++) if (seq[j].p === x.p && seq[j].share * x.share < 0) ring = true;
    const n = kFrom.pieces[x.p].channels.kh.length, prevLinked = road.includes(x.p - 1), nextL = road.includes(x.p + 1);
    const tail = (prevLinked && x.i <= 2) || (nextL && x.i >= n - 3);   // the three points nearest a joint to another planned piece: the joint's pins, row and bounds govern them
    // in the piece's direction, [lo, hi] and the start; then back to the signed bank
    let lo, hi;
    if (ring || tail) { lo = f > 0 ? f : -Infinity; hi = Infinity; } else { lo = f > 0 ? f : Math.min(0, sd); hi = Math.max(sd, f); }
    if (f > 0 && !x.pinned) x.t = d * Math.max(sd, f);
    x.lo = d > 0 ? lo : -hi; x.hi = d > 0 ? hi : -lo;
  }`],
]);
patch(`${T}/app/test/core-bank-lap.test.js`, [
  [`/** A lap with a deliberate 3° bank under ROLL_FREE: a roll to 3°, a 300 m straight carried at 3°, a gentle right-hand curve (R 10 km) carried at 3° (its share
 *  bank is about 7°, the same way), a roll back to 0, then upright corners the same way; closed by close() on its last piece. */`,
   `/** A lap with a deliberate 3° bank under ROLL_FREE: a roll to 3°, a 300 m straight carried at 3°, a gentle right-hand curve (R 10 km) carried at 3° (its share
 *  bank is about 7°, the same way), a roll back to 0, then a rectangle of upright corners the same way, closed by close() on its last two pieces only (a close
 *  on \`edited\` bends a fifth of the lap and would have bent the straight into a curve). */`],
  [`  d = extendTurnBy(d, { length: QQ }, -90 * DEG); d = extend(d, { length: 200 }); d = extendTurnBy(d, { length: QQ }, -90 * DEG); d = extend(d, { length: 200 });
  d = extendTurnBy(d, { length: QQ }, -90 * DEG); d = extend(d, { length: 100 }); d = extendTurnBy(d, { length: QQ }, -90 * DEG);
  const c = close(d, { edited: [d.pieces.length - 1] }); assert.equal(c.converged, true, c.report);
  return c.doc;
}

test('row 7:`,
   `  d = extendTurnBy(d, { length: QQ }, -90 * DEG); d = extend(d, { length: 400 }); d = extendTurnBy(d, { length: QQ }, -90 * DEG); d = extend(d, { length: 1200 });
  d = extendTurnBy(d, { length: QQ }, -90 * DEG); d = extend(d, { length: 400 }); d = extendTurnBy(d, { length: QQ }, -90 * DEG);
  const c = close(d, { window: [d.pieces.length - 2, d.pieces.length - 1] }); assert.equal(c.converged, true, c.report);
  return c.doc;
}

test('row 7:`],
  [`  assert.ok(STRAIGHT.channels.phi.every((x) => Math.abs(x - 3 * DEG) <= q), 'control: the straight carries 3° at every point');`,
   `  assert.ok(STRAIGHT.channels.phi.every((x) => Math.abs(x - 3 * DEG) <= q), 'control: the straight carries 3° at every point');
  assert.ok(STRAIGHT.channels.kh.every((k) => k === 0), 'control: the straight is straight (the close did not bend it)');`],
]);
