// compare.js (pane E, D, 2026-11-13): my hip and knee (angles.js, definition C3) against simtk_dorn_running.md section 4,
// cell by cell (0..100 % of the stride, mean of the strides), and the peaks. Flags every difference beyond the reader's
// stated error: hip 4 deg, knee 6 deg. The reader's numbers are typed in below from section 4 of that file
// (lighthouse exo_memory/loop/sprint_reference_2026-11-13/simtk_dorn_running.md, lines 157-223), and not read by code.
// node compare.js <angles json at 15 Hz> [<json at 10 Hz> <json at 25 Hz>]
'use strict';
const fs = require('fs');
const READER = {
  '5.20': {
    hip: [37.3, 27.6, 4.8, -9.6, -8.8, 3.1, 30.6, 59.2, 62.9, 43.0, 37.1],
    knee: [19.2, 45.7, 34.2, 16.1, 50.8, 96.3, 126.5, 110.3, 63.8, 8.3, 17.4],
    hipMax: [64.7, 77], hipMin: [-10.1, 33], kneeMax: [127.8, 62], kneeMin: [2.6, 94],
  },
  '7.00': {
    hip: [42.1, 27.3, -0.8, -12.6, -10.6, 5.0, 40.0, 70.4, 76.6, 52.9, 43.5],
    knee: [21.7, 44.6, 28.5, 20.8, 69.0, 122.3, 147.5, 120.5, 70.3, 11.9, 22.1],
    hipMax: [78.1, 77], hipMin: [-12.6, 30], kneeMax: [147.5, 60], kneeMin: [6.8, 94],
  },
  '9.49': {
    hip: [46.1, 32.5, 0.3, -18.2, -14.2, 1.1, 33.6, 68.0, 85.9, 65.7, 45.7],
    knee: [25.8, 42.6, 26.9, 16.2, 70.4, 123.0, 147.5, 129.7, 91.0, 33.0, 23.1],
    hipMax: [85.9, 80], hipMin: [-18.4, 31], kneeMax: [147.5, 60], kneeMin: [9.3, 26],
  },
};
const TOL = { hip: 4, knee: 6 };
const runs = process.argv.slice(2).map((p) => JSON.parse(fs.readFileSync(p, 'utf8')));
const meanOf = (tr, key, get) => tr.strides.reduce((a, s) => a + get(s[key]), 0) / tr.strides.length;
let flagged = 0, cells = 0;
const main = runs[0];
console.log(`cut-off ${main.cutoff} Hz${runs.length > 1 ? '; range over ' + runs.map((r) => r.cutoff + ' Hz').join(', ') : ''}`);
for (const tr of main.trials) {
  const R = READER[tr.speed];
  for (const [joint, key] of [['hip', 'hipC3'], ['knee', 'kneeC3']]) {
    const mine = R[joint].map((_, i) => meanOf(tr, key, (x) => x.grid[i]));
    const span = R[joint].map((_, i) => {
      const v = runs.map((r) => meanOf(r.trials.find((t) => t.speed === tr.speed), key, (x) => x.grid[i]));
      return Math.max(...v) - Math.min(...v);
    });
    const row = mine.map((m, i) => {
      const d = m - R[joint][i];
      ++cells;
      const off = Math.abs(d) > TOL[joint];
      flagged += off;
      return `${(i * 10).toString().padStart(3)}%: mine ${m.toFixed(1)} reader ${R[joint][i].toFixed(1)} (${d >= 0 ? '+' : ''}${d.toFixed(1)})${runs.length > 1 ? ' [cut-off spread ' + span[i].toFixed(1) + ']' : ''}${off ? ' BEYOND ' + TOL[joint] : ''}`;
    });
    console.log(`\n${tr.speed} m/s ${joint} (${tr.strides.length} stride${tr.strides.length > 1 ? 's' : ''}):`);
    for (const r of row) console.log('  ' + r);
    const peak = (which, rd) => {
      const v = meanOf(tr, key, (x) => (which === 'Max' ? x.swingMax : x.min));
      const pct = meanOf(tr, key, (x) => (which === 'Max' ? x.swingMaxPct : x.minPct));
      const d = v - rd[0];
      ++cells;
      const off = Math.abs(d) > TOL[joint];
      flagged += off;
      console.log(`  ${joint} ${which === 'Max' ? 'max (swing)' : 'min'}: mine ${v.toFixed(1)} at ${pct.toFixed(0)} %, reader ${rd[0]} at ${rd[1]} % (${d >= 0 ? '+' : ''}${d.toFixed(1)})${off ? ' BEYOND ' + TOL[joint] : ''}`);
    };
    peak('Max', R[joint + 'Max']);
    peak('Min', R[joint + 'Min']);
  }
}
console.log(`\n${cells} values compared; ${flagged} beyond the reader's stated error (hip 4, knee 6 deg)`);
