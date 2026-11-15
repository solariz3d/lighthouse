'use strict';
// D673: per-run CSV rows for given cells (juke only), to find the runs that reach the stop. One lock.
const os = require('os'); os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);
const { spawnSync } = require('child_process'), path = require('path');
const W = 'G:/consonance-scratch/a-d673b-dz3';
const H = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const h = H.hold({ cmd: 'A D673 per-run rows for two overtime cells (dz-chase sweep, hidden, BelowNormal)' });
try {
  for (const cell of process.argv.slice(2)) {           // S,R,policy
    const [s, r, pol] = cell.split(',');
    const args = ['sweep', '--run-length', '30', '--levels', '3', '--max', '400', '--policies', pol, '--seeds', '20', '--first', '1', '--threads', '2',
      '--dial', `head_start_s=1000 lesser_max=0 dark_speed_start=${s} dark_speed_rise=${r}`, '--csv', path.join(__dirname, `csv_${s}_${r}_${pol}`)];
    const res = spawnSync(path.join(W, 'build/bin/dz-chase.exe'), args, { cwd: path.join(W, 'chase'), encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 });
    console.log(cell, 'exit', res.status);
  }
} finally { h.release(); }
