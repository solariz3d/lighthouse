'use strict';
const fs = require('fs'); const W = 'C:/Users/nname/Downloads/t180-wt-p468/';
function edit(file, oldS, newS, re = false) { const p = W + file; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n'; if (re) { if (!oldS.test(s)) throw new Error(`${file}: regex`); s = s.replace(oldS, newS.split('\n').join(EOL)); } else { oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`${file}: anchor ${n}: ${String(oldS).slice(0, 50)}`); s = s.replace(oldS, newS); } fs.writeFileSync(p, s); console.log('edited', file); }
// A §5.2, §5.3
edit('src/core/finish.js', `    const x = seq[k]; let ring = false, lo = -RING, hi = RING;`, `    const x = seq[k]; let ring = false;`);
edit('src/core/finish.js', `    x.lo = Math.min(0, x.share); x.hi = Math.max(0, x.share); void lo; void hi;`, `    x.lo = Math.min(0, x.share); x.hi = Math.max(0, x.share);`);
edit('src/core/document.js', `DEC, KNOT_M, CUP_MAX, CUP_JOINT_DEG, CUP_EPS,`, `DEC, KNOT_M, CUP_MAX, CUP_JOINT_DEG,`);
// the budget: bankPlan says when it reached BANK_SWEEPS, and by how much the bounds are still missed
edit('src/core/finish.js', `  for (let sweep = 0; sweep < BANK_SWEEPS; sweep++) {
    let worst = 0;`, `  let reached = true, lastWorst = 0;   // D468 follow-up (A's review §2b): reaching the budget is said, never silent
  for (let sweep = 0; sweep < BANK_SWEEPS; sweep++) {
    let worst = 0;`);
edit('src/core/finish.js', `    if (worst < 1e-9) break;
  }
  const plan = new Map(road.map((p) => [p, new Array(kFrom.pieces[p].channels.kh.length).fill(0)]));`, `    lastWorst = worst; if (worst < 1e-9) { reached = false; break; }
  }
  const plan = new Map(road.map((p) => [p, new Array(kFrom.pieces[p].channels.kh.length).fill(0)]));
  // D468 follow-up (A's review §2b: on core_close_banks_lap's lap at R 200 the sweeps stop at the budget with the acceleration 5% past BANK_ACCEL at one triple,
  // and nothing said so). When the budget is reached the plan carries it: the sweeps, the last sweep's largest move, and how far past its bound (the acceleration's
  // or the rate's, whichever is worse) the plan still is, and where; finishToStart's and the press's reports name it in user words (budgetNote)
  plan.budget = null;
  if (reached) {
    let over = 0, at = null;
    for (let k = 1; k + 1 < seq.length; k++) { const a = seq[k - 1], m = seq[k], c = seq[k + 1], d0 = m.s - a.s, d1 = c.s - m.s; if (!(d0 > 0 && d1 > 0)) continue; const g = Math.abs((c.t - m.t) / d1 - (m.t - a.t) / d0) / ((BANK_ACCEL * (d0 + d1)) / 2); if (g > over) { over = g; at = m; } }
    for (let k = 1; k < seq.length; k++) { const a = seq[k - 1], c = seq[k], g = Math.abs(c.t - a.t) / (rate * (c.s - a.s)); if (g > over) { over = g; at = c; } }
    plan.budget = { sweeps: BANK_SWEEPS, worst: lastWorst, overPct: Math.max(0, over - 1) * 100, at: at ? kFrom.pieces[at.p].id : null };
  }`);
edit('src/core/finish.js', `/** doc with plan added to each planned piece's bank, less (when given) the plan \`minus\` added before. */`, `/** The budget in user words: what the plan could not finish smoothing, and where (\`what\`: "closer" or "lap"). */
function budgetNote(budget, what) { const pct = budget.overPct < 1 ? 'under 1' : String(Math.round(budget.overPct)); return \`the bank on the \${what} stopped about \${pct}% past its smoothness limit at one point\${budget.at ? \` (\${budget.at})\` : ''}\`; }
/** doc with plan added to each planned piece's bank, less (when given) the plan \`minus\` added before. */`);
// closeBanked: the final plan's budget rides the result
edit('src/core/finish.js', `    res = close(banked({ ...first.doc, closed: false }, bankPlan(first.doc, window, share, uprightSet), plan1), { window, c2Channels: FINISH_C2 });
    if (!res.converged) return res;
    const peak = bankRollPeak(res.doc, window);
    if (peak <= Math.max(ROLL_AMBER_DEG_M, flatPeak + 1e-6)) return res;`, `    const plan2 = bankPlan(first.doc, window, share, uprightSet);
    res = close(banked({ ...first.doc, closed: false }, plan2, plan1), { window, c2Channels: FINISH_C2 });
    if (!res.converged) return res;
    const peak = bankRollPeak(res.doc, window);
    if (peak <= Math.max(ROLL_AMBER_DEG_M, flatPeak + 1e-6)) return { ...res, bankBudget: plan2.budget };   // D468 follow-up: the plan's budget, for the report`);
edit('src/core/finish.js', `; \${window.length} new piece\${window.length === 1 ? '' : 's'}, \${Math.round(added)} m; \${res.repo`, `\${res.bankBudget ? \`; \${budgetNote(res.bankBudget, 'closer')}\` : ''}; \${window.length} new piece\${window.length === 1 ? '' : 's'}, \${Math.round(added)} m; \${res.repo`);
// bankLap: the budget rides out through bankLapWith
edit('src/core/finish.js', `    if (!worse.length) return { doc: freeze(res), eased: [...plan.eased].map((p) => doc.pieces[p].id), withheld };`, `    if (!worse.length) return { doc: freeze(res), eased: [...plan.eased].map((p) => doc.pieces[p].id), withheld, budget: plan.budget };`);
edit('src/core/finish.js', `function bankLapWith(doc) { const r = bankLapRun(doc); return { doc: r.doc, eased: r.eased || [], withheld: r.withheld || [], none: r.none || null }; }`, `function bankLapWith(doc) { const r = bankLapRun(doc); return { doc: r.doc, eased: r.eased || [], withheld: r.withheld || [], none: r.none || null, budget: r.budget || null }; }`);
edit('src/core/finish.js', `module.exports = { finishToStart, bankLap, bankLapWith,`, `module.exports = { finishToStart, bankLap, bankLapWith, budgetNote,`);
// the press's report
edit('app/core/closejob.js', `const { finishToStart, isNear, bankLapWith } = require('../../src/core/finish.js');`, `const { finishToStart, isNear, bankLapWith, budgetNote } = require('../../src/core/finish.js');`);
edit('app/core/closejob.js', `      B.none ? \`no curve on the lap was banked: \${B.none}\` : null].filter(Boolean).join('; ');`, `      B.none ? \`no curve on the lap was banked: \${B.none}\` : null,
      B.budget ? budgetNote(B.budget, 'lap') : null].filter(Boolean).join('; ');   // D468 follow-up (A's review §2b): a plan that reached its sweep budget says so`);
