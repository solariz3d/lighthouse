// run447i.js (P, D447 re-read 2): the finer sweep around FLIP_STRAIGHT_M and the gentle links on wider laps (so the press proves), on the clean 2c13316 tree and
// on the W1-off copy, under one heavy-run slot.
const path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
const S = __dirname, NEW = 'C:/Users/nname/Downloads/t180-wt-p447g', W1 = path.join(S, 'mutw1g');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'P d447 re-read 2: straight-gap and gentle-link sweep at 2c13316 (no timing session)', tree: NEW });
const run = (args, log, cwd) => { const t0 = Date.now(); const r = spawnSync(process.execPath, args, { cwd, encoding: 'utf8', maxBuffer: 1 << 26, timeout: 40 * 60 * 1000 }); fs.writeFileSync(path.join(S, log), (r.stdout || '') + (r.stderr || '') + '\nexit ' + r.status + ' in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s\n'); console.log(log, 'exit', r.status, ((Date.now() - t0) / 1000).toFixed(1), 's'); };
const CASES = ['x54', 'x56', 'x58', 'x60', 'x62', 'x64', 'x66', 'x68', 'x70', 'x72', 'x76', 'x90', 'x120', 'g650-100w300', 'g900-100w300', 'g650-200w320', 'g620-100w300', 'g1200-100w300', 'g650-40w300', 'g650-60w300', 'g650-100w280'].join(',');
run([path.join(S, 'probe447g.js'), NEW, CASES], 'probe-i-2c13316.log', S);
run([path.join(S, 'probe447g.js'), W1, CASES], 'probe-i-w1off.log', S);
console.log('all done');
