'use strict';
const os = require('os'); os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);
const { spawnSync } = require('child_process'), path = require('path'), fs = require('fs');
const W = 'G:/consonance-scratch/a-d673b-dz3';
const H = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const h = H.hold({ cmd: 'A D673 one overtime run with its events (dz-chase run, hidden, BelowNormal)' });
try {
  const [seed, pol, s, r, out] = process.argv.slice(2);
  const args = ['run', '--seed', seed, '--policy', pol, '--level', '3', '--max', '400', '--run-length', '30', '--events', '--trace',
    '--dial', `head_start_s=1000 lesser_max=0 dark_speed_start=${s} dark_speed_rise=${r}`];
  const res = spawnSync(path.join(W, 'build/bin/dz-chase.exe'), args, { cwd: path.join(W, 'chase'), encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 });
  fs.writeFileSync(path.join(__dirname, out), (res.stdout || '') + (res.stderr || ''));
  console.log('exit', res.status);
} finally { h.release(); }
