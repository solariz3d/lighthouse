'use strict';
// D477 read: a piece whose PINNED points carry a bank is his; the plan never takes his bank away (start and box from what each point carries); row 7 allows the roll-off tail.
const fs = require('fs');
const T = 'C:/Users/nname/Downloads/t180-wt-p477';
function patch(file, pairs) {
  let x = fs.readFileSync(file, 'utf8');
  const crlf = x.includes('\r\n'), nl = (s) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s);
  if (crlf) x = nl(x);
  for (const [from0, to0] of pairs) {
    const from = nl(from0), to = nl(to0), n = x.split(from).length - 1;
    if (n !== 1) throw new Error(`${file}: expected once, found ${n}: ${from0.slice(0, 80)}`);
    x = x.replace(from, to);
  }
  fs.writeFileSync(file, x); console.log(`${file}: ${pairs.length} edits`);
}
patch(`${T}/src/core/finish.js`, [
  [`  // D477 (the chair's row, "D477 read"): THE PLAN NEVER TAKES AWAY A BANK HE LAID. A piece's FLOOR is the bank its PINNED points carry the piece's way (the
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
  }`,
   `  // D477 (the chair's row, "D477 read"): THE PLAN NEVER TAKES AWAY A BANK HE LAID. A piece is HIS when a PINNED point of it carries a bank (a straight he banked
  // 3° has 3° at both pinned ends, a gentle curve carried at 3° the same, his roll to 3° has 3° at its far end); a piece this press laid has its pins at upright,
  // or at a relaxed joint none. The pins decide because THE PRESS NEVER MOVES A PIN: a second press reads the same answer and solves the first press's system.
  // On a piece of his a free point starts at the larger of its share and the bank it carries the piece's way (the sign of its shares, else of its pins), its box
  // runs from the floor (the least his pins carry that way; 0 across a roll from upright) to that, and a ringing or tail point keeps its open far side but not
  // its open near one: the straight at 3° starts and stays there, the curve at 3° with a 7° share starts at 7° and is never taken under 3°, the roll keeps its
  // shape; a bank carried the other way is replaced. On a piece that is not his every box and start is as before
  const q = 10 ** -D.DEC.phi, hisOf = new Map();
  for (const p of road) {
    const pts = seq.filter((x) => x.p === p), pins = pts.filter((x) => x.pinned), d = Math.sign(pts.reduce((a, x) => a + x.share, 0)) || Math.sign(pins.reduce((a, x) => a + x.e, 0)) || 1;
    hisOf.set(p, { d, his: pins.some((x) => Math.abs(x.e) > q), f: pins.length ? Math.max(0, Math.min(...pins.map((x) => d * x.e))) : 0 });
  }
  const RING = 3;
  for (let k = 0; k < seq.length; k++) {
    const x = seq[k], { d, his, f } = hisOf.get(x.p), sd = d * x.share, ed = d * x.e; let ring = false;
    for (let j = Math.max(0, k - RING); j <= Math.min(seq.length - 1, k + RING); j++) if (seq[j].p === x.p && seq[j].share * x.share < 0) ring = true;
    const n = kFrom.pieces[x.p].channels.kh.length, prevLinked = road.includes(x.p - 1), nextL = road.includes(x.p + 1);
    const tail = (prevLinked && x.i <= 2) || (nextL && x.i >= n - 3);   // the three points nearest a joint to another planned piece: the joint's pins, row and bounds govern them
    // in the piece's direction, [lo, hi] and the start; then back to the signed bank
    let lo, hi;
    if (ring || tail) { lo = his ? f : -Infinity; hi = Infinity; } else { lo = his ? f : Math.min(0, sd); hi = his ? Math.max(sd, ed, f) : Math.max(sd, 0); }
    if (his && !x.pinned) x.t = d * Math.max(sd, ed, f);
    x.lo = d > 0 ? lo : -hi; x.hi = d > 0 ? hi : -lo;
  }`],
]);
patch(`${T}/app/test/core-bank-lap.test.js`, [
  [`//   7  a bank he laid on purpose under 5° is kept: a straight at 3° is unchanged, and a gentle curve at 3° is never taken below 3° (the chair's row, D477 read)`,
   `//   7  a bank he laid on purpose under 5° is kept: a straight at 3° is unchanged but for the roll-off tail of the curve after it (D468's tail, one point, raised
//      and never lowered; a4bfe52 raises it too), and a gentle curve at 3° is never taken below 3° (the chair's row, D477 read)`],
  [`test('row 7: a bank he laid on purpose under 5° is kept: a straight at 3° is unchanged, a gentle curve at 3° is never taken below 3°', async () => {`,
   `test('row 7: a bank he laid on purpose under 5° is kept: a straight at 3° is unchanged but for the roll-off tail into the curve, a gentle curve at 3° is never taken below 3°', async () => {`],
  [`  assert.deepEqual(after.pieces[2].channels.phi, STRAIGHT.channels.phi, \`the straight at 3° is unchanged (\${msg})\`);`,
   `  const n = STRAIGHT.channels.phi.length;
  assert.deepEqual(after.pieces[2].channels.phi.slice(0, n - 3), STRAIGHT.channels.phi.slice(0, n - 3), \`the straight at 3° is unchanged up to the curve's roll-off tail (\${msg})\`);
  assert.ok(after.pieces[2].channels.phi.every((x) => x >= 3 * DEG - 1e-9), 'the straight is never taken below its 3°, its tail included');`],
]);
