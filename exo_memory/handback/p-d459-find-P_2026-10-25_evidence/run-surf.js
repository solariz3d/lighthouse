'use strict';
const os = require('os'), path = require('path'), fs = require('fs'), { spawnSync } = require('child_process');
os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const [T, F, K, J, OUT] = process.argv.slice(2);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'P d459: kn5 surface probe at every joint (surf436.js; BelowNormal; not a timing session)', tree: T });
const t0 = Date.now();
const r = spawnSync(process.execPath, ['C:/Users/nname/Desktop/lighthouse/exo_memory/handback/p-d436-P_2026-10-22_evidence/surf436.js', T, F, K, J, '60'], { encoding: 'utf8', maxBuffer: 1 << 28, timeout: 60 * 60 * 1000 });
fs.writeFileSync(OUT, (r.stdout || '') + '\n# stderr\n' + (r.stderr || '') + `\n# exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
console.log('exit', r.status, ((Date.now() - t0) / 1000).toFixed(1), 's');
