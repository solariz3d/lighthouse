'use strict';
// D477 edit 1: finish.js (the lap plan relative to the bank the lap carries; the still quantum; the level words) and coreshell.js (pre-bank backup).
const fs = require('fs');
const T = 'C:/Users/nname/Downloads/t180-wt-p477';
function patch(file, pairs) {
  let x = fs.readFileSync(file, 'utf8');
  const crlf = x.includes('\r\n'), nl = (s) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s);   // the t180 sources are CRLF
  for (const [from0, to0] of pairs) {
    const from = nl(from0), to = nl(to0);
    const n = x.split(from).length - 1;
    if (n !== 1) throw new Error(`${file}: expected once, found ${n}: ${from.slice(0, 80)}`);
    x = x.replace(from, to);
  }
  fs.writeFileSync(file, x);
  console.log(`${file}: ${pairs.length} edits`);
}
const F = `${T}/src/core/finish.js`, S = `${T}/app/core/coreshell.js`;
patch(F, [
  // 1. the signature and its doc
  [` */
function bankPlan(kFrom, window, share, uprightSet, relax = () => false, { flips = false, rollScale = 1 } = {}) {`,
   ` * D477 (C's D474 review, finding 1: a second Track ▸ Bank the lap re-banked a piece its first press had banked by under ROLL_FREE, +0.86° a press on p3 of the
 * looped lap, because the piece still read as upright and the plan's targets were the whole share bank ADDED to what it carried). \`carried\` (bankLap only): per
 * window piece, the bank each control point already carries over \`upright\`. The plan is then the DIFFERENCE between the total the bounds allow and that: the
 * targets, the rate and acceleration bounds and the box are on the TOTAL bank (the road's roll is the total), a pinned point's total is what it carries (its
 * added bank 0, as before), and the curvature rows are on the ADDED bank as before (the window's edges meet road whose added bank is 0; a straight's third point
 * keeps the roll-off tail an earlier press left it). On a lap whose upright pieces carry no bank, carried is 0 everywhere and the plan is byte for byte the one
 * without it (closejob's single press after Close); on a lap a press has banked, the bounds are already met by what it carries and the plan is 0 to the quantum.
 */
function bankPlan(kFrom, window, share, uprightSet, relax = () => false, { flips = false, rollScale = 1, carried = null } = {}) {`],
  // 2. seq: the target, the carried bank, the total
  [`const t = up && !pinned ? bankOf(P.channels.kh[i], share) : 0; seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t, share: t, pinned, kh: P.channels.kh[i] }); }`,
   `const t = up && !pinned ? bankOf(P.channels.kh[i], share) : 0, e = carried ? carried.get(p)[i] : 0; seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t: up && !pinned ? t : e, e, share: t, pinned, kh: P.channels.kh[i] }); }`],
  // 3. a flip's pins hold the carried bank
  [`if (seq[k].t !== 0) eased.add(seq[k].p); seq[k].t = 0; seq[k].share = 0; seq[k].pinned = true; }`,
   `if (seq[k].t !== seq[k].e) eased.add(seq[k].p); seq[k].t = seq[k].e; seq[k].share = 0; seq[k].pinned = true; }`],
  // 4. the box on the total never forces a change on what the point carries
  [`    x.lo = Math.min(0, x.share); x.hi = Math.max(0, x.share);
  }`,
   `    x.lo = Math.min(0, x.share, x.e); x.hi = Math.max(0, x.share, x.e);   // D477: the box holds the TOTAL, and never pulls a point off the bank it carries
  }`],
  // 5. the rows on the added bank
  [`let res = 0, nn = 0; for (const [x, w] of r.terms) { res += w * x.t; if (!x.pinned) nn += w * w; }`,
   `let res = 0, nn = 0; for (const [x, w] of r.terms) { res += w * (x.t - x.e); if (!x.pinned) nn += w * w; }   // D477: on the ADDED bank, t − e`],
  // 6. the plan is the difference
  [`  for (const x of seq) plan.get(x.p)[x.i] = x.t;
`, `  for (const x of seq) plan.get(x.p)[x.i] = x.t - x.e;   // D477: the total less what the point carries
`],
  // 7. banked(): a piece whose plan is still to the quantum keeps its object (bankLap only; closeBanked applies every plan as before)
  [`/** doc with plan added to each planned piece's bank, less (when given) the plan \`minus\` added before. */
function banked(doc, plan, minus = null) {
  return D.checkDoc({ ...doc, pieces: doc.pieces.map((P, p) => (!plan.has(p) ? P : {`,
   `/** doc with plan added to each planned piece's bank, less (when given) the plan \`minus\` added before. \`still\` ≥ 0 (D477, bankLap): a piece whose plan is within
 *  \`still\` of 0 at every point is kept as it is, the same object (a second press then changes nothing, and the shell sees the doc it was given). */
function banked(doc, plan, minus = null, still = -1) {
  return D.checkDoc({ ...doc, pieces: doc.pieces.map((P, p) => (!plan.has(p) || (still >= 0 && plan.get(p).every((x) => Math.abs(x) <= still)) ? P : {`],
  // 8. constants: the still quantum
  [`const CURVED_KH = 1 / 600, LEVEL_DEG = 30, WITHHOLD_ROUNDS = 3, FLIP_STEP_M = 2;`,
   `const CURVED_KH = 1 / 600, LEVEL_DEG = 30, WITHHOLD_ROUNDS = 3, FLIP_STEP_M = 2, BANK_STILL = 10 ** -D.DEC.phi;   // BANK_STILL (D477): a plan under the bank's quantum is none`],
  // 9. the level words by the plan-bank test
  [`  const upright = D.valuesAt(doc.pieces[0], 0).phi, lane = pitPieces(doc), curved = (p) => doc.pieces[p].channels.kh.some((k) => Math.abs(k) > CURVED_KH);
  const flat = [];`,
   `  const upright = D.valuesAt(doc.pieces[0], 0).phi, lane = pitPieces(doc), curved = (p) => doc.pieces[p].channels.kh.some((k) => Math.abs(k) > CURVED_KH);
  // D477 (C's D474 review, finding 2): the pieces the level rule holds back are named by the PLAN-BANK test, not by \`curved\`: his TEST 10 loop's stored kh peaks
  // just under CURVED_KH, and the plan would have banked it about 52° had it been level, but the press said nothing. A piece is named when the share bank of
  // its stored turn is over ROLL_FREE at some point (a bank under ROLL_FREE is what this file reads as upright, so one withheld is nothing to say)
  const planned = (p) => doc.pieces[p].channels.kh.some((k) => Math.abs(bankOf(k, BANK_SHARE)) > ROLL_FREE);
  const flat = [];`],
  [`  info.level = flat.filter((p) => curved(p) && !level(doc.pieces[p])).map((p) => doc.pieces[p].id);   // D473: said by Track ▸ Bank the lap
  if (!lap.length) return { doc };`,
   `  info.level = flat.filter((p) => planned(p) && !level(doc.pieces[p])).map((p) => doc.pieces[p].id);   // D473: said by Track ▸ Bank the lap; D477: by the plan-bank test
  if (!lap.length) return { doc };
  // D477: the bank each lap piece already carries over the start's, per control point; the plan is what the bounds still allow on top of it (bankPlan \`carried\`)
  const carried = new Map(lap.map((p) => [p, doc.pieces[p].channels.phi.map((ph) => ph - upright)]));`],
  // 10. the plan with the carried bank, and the still quantum
  [`plan = bankPlan(doc, set, share, uprightSet, relax, { flips: pins, rollScale }); cand = D.checkDoc(banked(doc, plan));`,
   `plan = bankPlan(doc, set, share, uprightSet, relax, { flips: pins, rollScale, carried }); cand = D.checkDoc(banked(doc, plan, null, BANK_STILL));`],
  [`      if ([...plan.values()].every((a) => a.every((x) => x === 0))) return { doc, withheld };`,
   `      if ([...plan.values()].every((a) => a.every((x) => Math.abs(x) <= BANK_STILL))) return { doc, withheld };   // D477: nothing to add (a lap already banked)`],
]);
patch(S, [
  [`//   await shell.bankLap()       (D473: Track ▸ Bank the lap: a closed lap banked as Close banks the lap it closes, the route kept; one undo step)`,
   `//   await shell.bankLap()       (D473: Track ▸ Bank the lap: a closed lap banked as Close banks the lap it closes, the route kept; a backup first, one undo step)`],
  [`     * whose kh, kv or lengths differ is refused by name. ONE undo step. An open lap, or one with nothing to bank, is left as it is, and the message says so; what
     * the bank held back (the level rule's loops and steep ramps, a piece that would lean out, a flip) is said in plain words.
     */`,
   `     * whose kh, kv or lengths differ is refused by name. The track AS IT IS NOW goes to track-backups first ('pre-bank', D477: it changes every curve on the lap and
     * Undo lasts the session), and a copy that fails refuses by name with nothing changed; then ONE undo step. An open lap, or one with nothing to bank, is left as
     * it is, and the message says so; what the bank held back (the level rule's loops and steep ramps, a piece that would lean out, a flip) is said in plain words.
     */`],
  [`        return set({ message: 'not banked: the bank would have moved the route; nothing changed' });
      }
      const banked = `,
   `        return set({ message: 'not banked: the bank would have moved the route; nothing changed' });
      }
      try { await api.backupNow('pre-bank'); } catch (e) { return set({ message: \`not banked: the copy from before could not be written (\${e && e.message || e}); nothing changed\` }); }
      if (doc() !== d) return set({ message: 'the track changed while its copy was being written: bank the lap again' });
      const banked = `],
]);
