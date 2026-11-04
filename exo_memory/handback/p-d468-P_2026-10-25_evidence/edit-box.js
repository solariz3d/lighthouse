'use strict';
const fs = require('fs'); const W = 'C:/Users/nname/Downloads/t180-wt-p468/';
function edit(file, oldS, newS) { const p = W + file; let s = fs.readFileSync(p, 'utf8'); const EOL = s.includes('\r\n') ? '\r\n' : '\n'; oldS = oldS.split('\n').join(EOL); newS = newS.split('\n').join(EOL); const n = s.split(oldS).length - 1; if (n !== 1) throw new Error(`${file}: anchor ${n}: ${oldS.slice(0, 50)}`); fs.writeFileSync(p, s.replace(oldS, newS)); console.log('edited', file); }
// 1. the share is kept on each point, and no projection may carry a point past it (or the other way past 0)
edit('src/core/finish.js',
`seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t: up && !pinned ? bankOf(P.channels.kh[i], share) : 0, pinned, kh: P.channels.kh[i] }); }`,
`const t = up && !pinned ? bankOf(P.channels.kh[i], share) : 0; seq.push({ p, i, s: startOf.get(p) + (U[i + 1] + U[i + 2] + U[i + 3]) / 3, t, share: t, pinned, kh: P.channels.kh[i] }); }`);
edit('src/core/finish.js',
`    for (let k = Math.max(0, lo); k <= (hi < 0 ? seq.length - 1 : hi); k++) { if (seq[k].t !== 0) eased.add(seq[k].p); seq[k].t = 0; seq[k].pinned = true; }`,
`    for (let k = Math.max(0, lo); k <= (hi < 0 ? seq.length - 1 : hi); k++) { if (seq[k].t !== 0) eased.add(seq[k].p); seq[k].t = 0; seq[k].share = 0; seq[k].pinned = true; }`);
edit('src/core/finish.js',
`      worst = Math.max(worst, Math.abs(res)); for (const [x, w] of r.terms) if (!x.pinned) x.t -= (res * w) / nn;
    }
    if (worst < 1e-9) break;`,
`      worst = Math.max(worst, Math.abs(res)); for (const [x, w] of r.terms) if (!x.pinned) x.t -= (res * w) / nn;
    }
    // D468: and no point past its share, nor the other way past none (a convex box, the last projection of the sweep): the limits above only ever HOLD a bank
    // back from its share, but a projection onto a triple's acceleration bound moves the two neighbours the other way, and with the curvature rows that recoil
    // carried a point past its share (TEST 10's p22 point 4: 6.43° against a share of 6.13°) and put a bank on a straight's last free point (share 0)
    for (const x of seq) { if (x.pinned) continue; const lo = Math.min(0, x.share), hi = Math.max(0, x.share); if (x.t < lo) { worst = Math.max(worst, lo - x.t); x.t = lo; } else if (x.t > hi) { worst = Math.max(worst, x.t - hi); x.t = hi; } }
    if (worst < 1e-9) break;`);
// 2. the bank test's share reader: a joint holds three points now, not two
edit('test/core_finish_bank.test.js',
`    for (let i = 2; i < ph.length - 2; i++) {
      const t = (j) => ph[j] - ph[0];`,
`    // AMENDED by D468 (P; the bank plan is C2, finish.js bankPlan's curvature rows): a joint of the plan now holds THREE points on each side (value, slope and
    // curvature of the added bank continue across it; the third is 0 where the plan meets road outside it), so the share is read from the fourth point in
    for (let i = 3; i < ph.length - 3; i++) {
      const t = (j) => ph[j] - ph[0];`);
