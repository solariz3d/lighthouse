'use strict';
// D477 edit 2: bankLapRun finds the first press's set again (a piece banked past ROLL_FREE is the press's own when re-planning with it changes it by nothing).
const fs = require('fs');
const F = 'C:/Users/nname/Downloads/t180-wt-p477/src/core/finish.js';
let x = fs.readFileSync(F, 'utf8');
const crlf = x.includes('\r\n'), nl = (s) => (crlf ? s.replace(/\r?\n/g, '\r\n') : s);
const a = x.indexOf(nl('  if (!lap.length) return { doc };\n  // D477: the bank each lap piece already carries'));
const b = x.indexOf(nl('/** D434: the laid route banked and closed'), a);
if (a < 0 || b < 0) throw new Error('anchors');
const body = `  if (!lap.length) return { doc };
  // a joint is relaxed (D447 (d)) between two pieces that both curve; a flip at or near it is pinned by bankPlan's flip rule (\`flips\`), not by the joint
  const outBefore = reads.out;
  /** The press over the lap's pieces and \`mine\` (D477), as D447 built it: PER PIECE, never the whole lap (P's review finding 1 (c)): a piece that would still
   *  lean out where the closed lap did not is left as closed and the rest is banked again without it, up to WITHHOLD_ROUNDS times. (Before, one leaning station
   *  left the whole lap flat, and the press said nothing.) Returns the result and the last plan (the fixed point below reads it). */
  const press = (mine) => {
    const withheld = [], pool = [...lap, ...mine].sort((p, q) => p - q);
    // D477: the bank each piece already carries over the start's, per control point; the plan is what the bounds still allow on top of it (bankPlan \`carried\`)
    const carried = new Map(pool.map((p) => [p, doc.pieces[p].channels.phi.map((ph) => ph - upright)]));
    let plan = null;
    for (let round = 0; round <= WITHHOLD_ROUNDS; round++) {
      const set = pool.filter((p) => !withheld.includes(doc.pieces[p].id)); if (!set.length) return { out: { doc, withheld, none: 'every curve it could bank would lean out of its turn' }, plan };
      const uprightSet = new Set(set), relax = (p) => p > 0 && uprightSet.has(p - 1) && uprightSet.has(p) && curved(p - 1) && curved(p);
      const flatPeak = reads.peak(new Set(set.map((p) => doc.pieces[p].id)));
      // the share is scaled down while the lap rolls past the amber, as ruled; AND the roll's own rate (P's re-read, Sharp ramp 40 m: the bank's rate is capped at
      // 0.84 °/m in its own channel, but on a tight turn the checker reads the road's roll at 0.966 °/m where it rolls up after a flip, and a smaller share does
      // not slow a ramp that rides the cap: 0.966 → 0.959 → 0.948 over the three tries, and the WHOLE lap came back flat and silent)
      let share = BANK_SHARE, rollScale = 1, res = null, outAfter = null;
      for (let t = 0; t < BANK_TRIES; t++) {
        // D447 §10 (P's third re-read, item 2): THE PLAN'S OWN DESCENT. A gap the bound leaves unpinned is pinned too when the banked road at the far run's first
        // curved sample still leans out of it by more than LEAN_OUT_DEG, and planned again: across a straight whose control points ring, the plan's targets there
        // slow its descent below the cap (about 0.5 °/m against 0.84; x80 and the R 10 km link leaned out 5.1° and 6.1° with W1 off on close()'s lap)
        const fl = flipsOf(doc, { rollScale }), pins = [...fl]; let cand;
        for (;;) {
          plan = bankPlan(doc, set, share, uprightSet, relax, { flips: pins, rollScale, carried }); cand = D.checkDoc(banked(doc, plan, null, BANK_STILL));
          const late = fl.gaps.filter((g) => !pins.includes(g) && (bankAtS(cand, g[1]) - upright) * g[2] > LEAN_OUT_DEG * DEG); if (!late.length) break; pins.push(...late);
        }
        if ([...plan.values()].every((a) => a.every((x) => Math.abs(x) <= BANK_STILL))) return { out: { doc, withheld }, plan };   // D477: nothing to add (a lap already banked)
        const candReads = lapReads(cand), peak = candReads.peak(new Set(set.map((p) => doc.pieces[p].id))), allowed = Math.max(ROLL_AMBER_DEG_M, flatPeak + 1e-6);
        if (peak <= allowed) { res = cand; outAfter = candReads.out; break; }
        share *= (Math.max(ROLL_AMBER_DEG_M, flatPeak) / peak) * 0.97; rollScale *= (allowed / peak) * 0.97;
      }
      if (!res) return { out: { doc, withheld, none: 'its roll would pass the amber' }, plan };   // the bank could not be kept under the amber: the lap as closed
      const worse = set.filter((p) => (outAfter.get(doc.pieces[p].id) || 0) > (outBefore.get(doc.pieces[p].id) || 0)).map((p) => doc.pieces[p].id);
      if (!worse.length) return { out: { doc: freeze(res), eased: [...plan.eased].map((p) => doc.pieces[p].id), withheld, budget: plan.budget }, plan };
      withheld.push(...worse);
    }
    return { out: { doc, withheld, none: 'every curve it could bank would lean out of its turn' }, plan };
  };
  // D477 (C's D474 review, finding 1): A SECOND PRESS CHANGES NOTHING. A piece the first press banked past ROLL_FREE reads as his own bank on the next, so the
  // next press planned the pieces it had banked by less than ROLL_FREE against different pins (the joint into a piece now outside the plan) and moved them again
  // (p3 of the looped lap: 1.06 → 1.92 → 2.78 → 3.65° over four presses). With \`carried\` (bankPlan) the plan is what the bounds still allow on top of the bank a
  // piece carries, but the sweeps find a different point of a different system, so the plan is not 0 to the quantum unless the SYSTEM is the first press's. It is
  // found again from the lap itself: every curved, level road piece carrying a bank past ROLL_FREE is tried as the press's own (\`mine\`), and the plan is run with
  // it in the set; a piece the plan would still change is his own bank after all and is dropped, and the plan is run again without it, until none is dropped. On
  // a lap this press banked, the first run is the first press's system on the same inputs (the rows' and the box's constants differ by the first press's own
  // residual, under 1e-12), so the plan is 0 at every point of \`mine\` and of the rest, and the lap is handed back as it is. On a lap of his own banks, every
  // candidate is dropped on the first run and the press is D473's, one plan dearer. A press that scaled its share (its roll would have passed the amber)
  // or withheld a piece is not found again this way (the share and the withheld set are not on the lap), and its second press is still as D473's; Dykstra's
  // projection, which lands on the ONE nearest point of the bounds, would make the second press exact on those too (noted for after 0.4.21).
  let mine = doc.pieces.map((P, p) => p).filter((p) => !flat.includes(p) && doc.pieces[p].type === 'road' && !doc.pieces[p].tube && !lane.has(p) && curved(p) && level(doc.pieces[p]));
  for (;;) {
    const r = press(mine);
    if (!mine.length) return r.out;
    const still = (p) => r.plan && r.plan.has(p) && r.plan.get(p).every((x) => Math.abs(x) <= BANK_STILL);
    const drop = r.out.none ? mine : mine.filter((p) => !still(p));
    if (!drop.length) return r.out;
    mine = mine.filter((p) => !drop.includes(p));
  }
}
`;
x = x.slice(0, a) + nl(body) + x.slice(b);
// the doc comment of bankLap, a D477 line
const anchor = nl(` */
const CURVED_KH = 1 / 600,`);
if (x.split(anchor).length !== 2) throw new Error('doc anchor');
x = x.replace(anchor, nl(` * D477: pressed again on a lap it has banked, it changes nothing: the pieces it banked past ROLL_FREE are found again as its own (bankLapRun, the fixed point),
 * and the plan on top of the bank a piece carries (bankPlan \`carried\`) is 0 to the bank's quantum everywhere.
 */
const CURVED_KH = 1 / 600,`));
fs.writeFileSync(F, x); console.log('bankLapRun rewritten');
