'use strict';
const fs = require('fs'); const p = 'C:/Users/nname/Downloads/t180-wt-p468/src/core/finish.js'; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n';
function edit(oldS, newS) { oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`anchor ${n}: ${oldS.slice(0, 60)}`); s = s.replace(oldS, newS); }
// 1. the rows, built after the flip pins and before the sweeps
edit(`  // the pinned points stay where they are in both passes (a pass that moved them would undo the pin: the close would then meet the seam's bank row in one knot)
  for (let k = 1; k < seq.length; k++) { if (seq[k].pinned) continue;`,
`  // D468 (P; D459's class of fault, plan_test10_bump § "3b in"): THE PLAN IS C2 AT EVERY JOINT. BANK_ACCEL bounds how fast the polygon's slope may change, so at a
  // pinned joint (two points at no added bank on each side) the plan's curvature went from 0 to its bound in one knot: a step of exactly BANK_ACCEL (0.0115 °/m²,
  // 2 × 8.4 m × that under the outer wheels) read by continuity.js at the closer's first joint and the seam of every Finish and at every relaxed joint of a banked
  // lap. A channel's end curvature is linear in its last three control points and its start curvature in its first three (continuity.js's closed forms, the same
  // weights as close.js curvRow), so "the added bank's curvature does not step across this joint" is one linear equality on six points: a convex set like the rate
  // and acceleration bounds, projected onto in the same sweeps (the pins never moved). At a joint the plan leaves to a piece outside the window (the window's two
  // ends; on a lap, the seam and the joints into his own banked curves) the other side's added bank is 0 everywhere, so the row reads "0 curvature here": with
  // the two pinned points that is the third point at 0 too. At a relaxed joint (D447 (d)) the later piece's first two points follow the earlier piece (the slope
  // rule below), so their weights fold into the earlier piece's last two. The ease itself is not a quintic: the plan is not a ramp between two levels but the
  // curvature's share under rate and acceleration limits, and the equality keeps its shape while the limits still bound it (an ease laid over the limited plan
  // afterwards would have to be re-limited, and would move the share).
  const rows = []; const at = new Map(); for (const x of seq) at.set(\`\${x.p}:\${x.i}\`, x);
  const slots = (p, idx) => idx.map((i) => at.get(\`\${p}:\${i}\`) || null);   // null: not in seq (a later piece's first two at a linked joint), folded or 0
  road.forEach((p, j) => {
    const P = kFrom.pieces[p], U = D.knotVector(P), n = P.channels.kh.length, L = P.length, linked = j > 0 && road[j - 1] === p - 1, nextLinked = road[j + 1] === p + 1;
    const g1 = U[4], g2 = U[5], wB = [-6 / (g1 * g1), 6 / (g1 * g2) + 6 / (g1 * g1), -6 / (g1 * g2)];   // on B[0], B[1], B[2]: −(the start curvature)
    if (!linked) rows.push({ terms: slots(p, [0, 1, 2]).map((x, k) => [x, wB[k]]) });   // the window's start: the plan's curvature is 0 where it begins
    else {
      const A = kFrom.pieces[p - 1], UA = D.knotVector(A), nA = A.channels.kh.length, LA = A.length, h1 = LA - UA[nA - 1], h2 = LA - UA[nA - 2];
      const wA = [6 / (h1 * h2), -6 / (h1 * h1) - 6 / (h1 * h2), 6 / (h1 * h1)];   // on A[n−3], A[n−2], A[n−1]: the end curvature
      // B[0] = A[n−1] and B[1] = A[n−1] + (g1/h1)(A[n−1] − A[n−2]) by the slope rule, so their weights fold into A's last two
      wA[2] += wB[0] + wB[1] * (1 + g1 / h1); wA[1] -= wB[1] * (g1 / h1);
      rows.push({ terms: [...slots(p - 1, [nA - 3, nA - 2, nA - 1]).map((x, k) => [x, wA[k]]), [at.get(\`\${p}:2\`), wB[2]]] });
    }
    if (!nextLinked) rows.push({ terms: slots(p, [n - 3, n - 2, n - 1]).map((x, k) => [x, [6 / ((L - U[n - 1]) * (L - U[n - 2])), -6 / ((L - U[n - 1]) * (L - U[n - 1])) - 6 / ((L - U[n - 1]) * (L - U[n - 2])), 6 / ((L - U[n - 1]) * (L - U[n - 1]))][k]]) });   // the window's end: 0 curvature where it ends
  });
  for (const r of rows) r.terms = r.terms.filter(([x]) => x);   // a slot not in seq is a pinned 0 (a linked piece's first point) and adds nothing
  // the pinned points stay where they are in both passes (a pass that moved them would undo the pin: the close would then meet the seam's bank row in one knot)
  for (let k = 1; k < seq.length; k++) { if (seq[k].pinned) continue;`);
// 2. the projection in the sweeps, after the rate pass
edit(`      if (free.length === 2) { a.t += (sg * over) / 2; c.t -= (sg * over) / 2; } else if (free[0] === c) c.t -= sg * over; else a.t += sg * over;
    }
    if (worst < 1e-9) break;
  }`,
`      if (free.length === 2) { a.t += (sg * over) / 2; c.t -= (sg * over) / 2; } else if (free[0] === c) c.t -= sg * over; else a.t += sg * over;
    }
    // D468: the curvature rows (above): each is a hyperplane in its free points; the step is the least one that meets it
    for (const r of rows) {
      let res = 0, nn = 0; for (const [x, w] of r.terms) { res += w * x.t; if (!x.pinned) nn += w * w; }
      if (!nn || Math.abs(res) <= 1e-12) continue;
      worst = Math.max(worst, Math.abs(res)); for (const [x, w] of r.terms) if (!x.pinned) x.t -= (res * w) / nn;
    }
    if (worst < 1e-9) break;
  }`);
fs.writeFileSync(p, s); console.log('finish.js edited');
