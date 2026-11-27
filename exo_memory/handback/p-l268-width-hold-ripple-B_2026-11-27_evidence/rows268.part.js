
// L268 (E's read of L264, handback/p-l264-read-E_2026-11-27.md §2 and §3): FITTED by least squares the hold rang. After a steep head the width swung about 3.7 × the
// head's slope past the head's and was over 1 mm off until 88 to 96 m of a 100 m piece. The hold is now laid as a typed width's short ramp is (extend.js rampControl).
// The heads of E's table, built as E built them: the app's brush (createCoreShell's default brushFn), Sculpt's grab (beginFollow), and a width ramp given to the core
// as one number transition, which the fit ends off level (drag-ghost row 5's head).
const sumOf = (s) => s.getState().history.present.pieces.reduce((a, P) => a + P.length, 0);
async function appShell() { const s = await createCoreShell({ autosaveMs: 0 }); s.commitDoc(ROADS.plain()); return s; }
const brushAt = (d, r, delta) => async () => { const s = await appShell(); s.beginBrush({ mode: 'rate', channel: 'w', s0: sumOf(s) - d, r }); s.brushTo(delta); s.endBrush(); return s; };
const grabAt = (d, r, dw) => async () => { const s = await appShell(); s.setSculpt(true); s.beginFollow({ s0: sumOf(s) - d, r }); s.brushTo({ w: dw }); s.endBrush(); return s; };
async function numberTransition() {
  const s = await createCoreShell({ brushFn: null, autosaveMs: 0 }); s.extend({ length: 300 });
  s.extend({ length: 1000, targets: { kh: 1 / 700, kv: 0.0004, phi: 0.2, w: 40, c: 20 } }); s.extend({ length: 75, transition: 30, targets: { w: 25 } });
  return s;
}
const E_HEADS = [
  ['the brush, +1.37 at end-5, r 20', brushAt(5, 20, 1.37)], ['the brush, +1.37 at end-10, r 20', brushAt(10, 20, 1.37)],
  ['the brush, +5 at end-19, r 20', brushAt(19, 20, 5)], ['the brush, +5 at end-30, r 40', brushAt(30, 40, 5)],
  ['grab, w +1.37 at end-5, r 20', grabAt(5, 20, 1.37)], ['grab, w +2 at end-10, r 20', grabAt(10, 20, 2)], ['grab, w -2 at end-20, r 30', grabAt(20, 30, -2)],
  ['a width ramp ended off level by a number transition', numberTransition],
];
/** One Extend of 100 m as shown from the head `make` leaves: the head, the new piece, and E's measure (the largest w − head, and the last station, every 0.1 m,
 *  where |w − head| is over 1 mm). */
async function heldAfter(make) {
  const s = await make(), prev = lastOf(s), head = D.pieceEnd(prev).w;
  extendAsShown(s); const P = lastOf(s);
  let swing = 0, off = 0; for (let k = 0; k <= 1000; k++) { const x = (P.length * k) / 1000, dv = D.channelValue(P, 'w', x) - head.v; if (Math.abs(dv) > Math.abs(swing)) swing = dv; if (Math.abs(dv) > 1e-3) off = x; }
  return { prev, head, P, swing, off };
}

test('L268: after every head of E\'s table the held width is within 1 mm of the head\'s from the end of its ramp (the first knot span, 20 m) on', async () => {
  for (const [name, make] of E_HEADS) {
    const { head, off } = await heldAfter(make);
    assert.ok(off <= 20, `${name} (head slope ${head.m.toExponential(2)} per m): the held width is more than 1 mm off the head's until ${off} m, past the ramp's end at 20 m`);
  }
});

test('L268: after every head of E\'s table the hold keeps a smooth joint, ends exactly at the head\'s width, level, and still goes past it the way the head was heading', async () => {
  for (const [name, make] of E_HEADS) {
    const { prev, head, P, swing } = await heldAfter(make);
    assert.equal(D.jointProblem(D.pieceEnd(prev), P, D.kindOf(prev)), null, `${name}: the joint is smooth`);
    assert.deepEqual(D.pieceEnd(P).w, { v: head.v, m: 0 }, `${name}: the piece ends at the head's width, level`);
    assert.ok(swing !== 0 && Math.sign(swing) === Math.sign(head.m), `${name}: the width goes past the head's the way it was heading (${swing} m, head slope ${head.m})`);
  }
});

test('L268: a held width beside a typed bank, cup or edge on a short piece keeps the knots the bank piece has, so the ramp lays within a few tenths of its quintic', () => {
  const DEG = Math.PI / 180, smoother = (u) => (u >= 1 ? 1 : u * u * u * (10 + u * (-15 + 6 * u)));
  const headDoc = () => extend(extend(D.createDoc('hold'), { length: 120, first: { w: 19.1 } }), { length: 60, transition: 30, targets: { w: 25 } });   // its width ends off level
  for (const L of [30, 40, 60]) for (const [ch, target, most] of [['phi', 20 * DEG, 0.5 * DEG], ['c', 25, 0.25], ['e', 15, 0.35]]) {
    const d0 = headDoc(), from = D.endState(d0); assert.ok(Math.abs(from.w.m) > 0.01, 'the head is still widening, so the width is held');
    const P = extend(d0, { length: L, targets: { [ch]: target } }).pieces.slice(-1)[0];
    let worst = 0; for (let k = 0; k <= 200; k++) { const s = (L * k) / 200; worst = Math.max(worst, Math.abs(D.channelValue(P, ch, s) - (from[ch].v + (target - from[ch].v) * smoother(s / L)))); }
    assert.ok(worst <= most, `${ch} to ${ch === 'phi' ? '20°' : target} over ${L} m beside a held width: ${worst.toFixed(4)} from its quintic, over ${most.toFixed(4)}`);
  }
});
