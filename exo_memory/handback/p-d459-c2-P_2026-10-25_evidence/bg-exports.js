'use strict';
const os = require('os'), path = require('path'), fs = require('fs'), { spawnSync } = require('child_process'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const T = 'C:/Users/nname/Downloads/t180-wt-p459', S = __dirname;
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'P d459 3b: two headless exports of TEST 10 copies (as saved, re-eased) for the ambers diff (BelowNormal; not a timing session)', tree: T });
for (const [save, out] of [['eq-TEST10.t180track', 'out459-base'], ['eq-TEST10-quintic.t180track', 'out459-quintic']]) {
  fs.rmSync(path.join(S, out), { recursive: true, force: true }); fs.mkdirSync(path.join(S, out), { recursive: true });
  const t0 = Date.now(), r = spawnSync(process.execPath, [path.join(S, 'exp.js'), T, path.join(S, 'save', save), path.join(S, out), 'force'], { encoding: 'utf8', maxBuffer: 1 << 28, timeout: 30 * 60 * 1000 });
  fs.writeFileSync(path.join(S, out, 'exp.log'), (r.stdout || '') + '\n# stderr\n' + (r.stderr || '') + `\n# exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
}
console.log('done');
