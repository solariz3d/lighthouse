'use strict';
// D412 part 2 (b) (O): each mutation harness's in-test time inside a full-suite TAP: the sum of the top-level row durations in its block, a
// block being found as B's tapmut.js finds it (its control row's title, C:\Users\nname\Downloads\t180-d408\tapmut.js), up to the next
// control. A file's rows run one after another, so the sum is close to the file's wall, minus its process start and load.
//   node harness-time.js <suite.tap> [<suite.tap> ...]
const fs = require('fs');
const CONTROLS = [
  ['every test file the mutants use', 'app/test/core-close-mutation.test.js'], ['every core-shell test', 'app/test/core-mutation.test.js'],
  ['every cross-section test', 'app/test/core-xsec-mutation.test.js'], ['every test the mutants are run against', 'app/test/mutation.test.js'],
  ['passes theme.test.js', 'app/test/theme-mutation.test.js'], ['passes sky.test.js', 'app/test/theme-mutation.test.js'],
  ['core_chord.test.js passes', 'test/core_chord_mutation.test.js'], ['core_cup.test.js and', 'test/core_cup_mutation.test.js'],
  ['every row of core_jump', 'test/core_jump_mutation.test.js'], ['core_piece.test.js passes', 'test/core_piece_mutation.test.js'],
  ['core_ramp.test.js passes', 'test/core_ramp_mutation.test.js'], ['every water check', 'test/core_water_mutation.test.js'],
  ['core_xsec, core_xsec_math', 'test/core_xsec_mutation.test.js'], ['every geometry test', 'test/geom_mutation.test.js'],
  ['every look-match test', 'test/lookmatch_mutation.test.js'], ['every texmaker test', 'test/texmaker_mutation.test.js'],
];
for (const file of process.argv.slice(2)) {
  const L = fs.readFileSync(file, 'utf8').split(/\r?\n/), per = {};
  let cur = null;
  for (let i = 0; i < L.length; i++) {
    const m = /^(not ok|ok) \d+ - (.*)$/.exec(L[i]); if (!m) continue;
    const ctl = /control/i.test(m[2]) && CONTROLS.find(([t]) => m[2].includes(t));
    if (ctl) cur = ctl[1];
    const mutRow = /applied, and caught/i.test(m[2]);
    if (!cur || !(ctl || mutRow)) continue;   // only the control and mutant rows count toward a harness
    for (let j = i + 1; j < L.length && !/^(not ok|ok) \d+ - /.test(L[j]); j++) { const d = /^\s{2}duration_ms: ([\d.]+)/.exec(L[j]); if (d) { per[cur] = (per[cur] || 0) + Number(d[1]); break; } }
  }
  const rows = Object.entries(per).sort((a, b) => b[1] - a[1]);
  console.log(`== ${file}\n| harness | control + mutant rows, s |\n|---|---|`);
  for (const [f, ms] of rows) console.log(`| ${f} | ${(ms / 1000).toFixed(1)} |`);
  console.log(`| **15 files** | **${(rows.reduce((s, r) => s + r[1], 0) / 1000).toFixed(1)}** |`);
}
