// run-exp.js (D459, P): export the keeper's save copy at a tree, headlessly, in a heavy-run slot at BelowNormal.  node run-exp.js <tree> <save> <outdir>
'use strict';
const os = require('os'), path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const [T, F, OUT] = process.argv.slice(2);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'P d459: headless export of the TEST 10 copy at ' + path.basename(T) + ' (BelowNormal; not a timing session)', tree: T });
fs.mkdirSync(OUT, { recursive: true });
const t0 = Date.now();
const r = spawnSync(process.execPath, [path.join(__dirname, 'exp.js'), T, F, OUT, 'force'], { encoding: 'utf8', maxBuffer: 1 << 28, timeout: 40 * 60 * 1000 });
fs.writeFileSync(path.join(OUT, 'exp.log'), (r.stdout || '') + '\n# stderr\n' + (r.stderr || '') + `\n# exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
console.log('exit', r.status, ((Date.now() - t0) / 1000).toFixed(1), 's');
