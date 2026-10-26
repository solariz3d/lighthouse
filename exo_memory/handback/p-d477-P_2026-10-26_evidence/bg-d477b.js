'use strict';
// D477: app/test/core-close-mutation.test.js whole, second run (R3 removed), in a heavy-run slot at BelowNormal.
const os = require('os'), fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const T = 'C:/Users/nname/Downloads/t180-wt-p477', S = __dirname;
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'P d477: core-close-mutation whole, second run without R3 (BelowNormal; not a timing session)', tree: T });
const f = 'app/test/core-close-mutation.test.js', base = path.basename(f, '.test.js'), tap = path.join(S, 'd477b-' + base + '.tap'), t0 = Date.now();
const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', '--test-reporter=spec', '--test-reporter-destination=stdout', '--test-reporter=tap', `--test-reporter-destination=${tap}`, f], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 2 * 60 * 60 * 1000 });
fs.writeFileSync(path.join(S, 'd477b-' + base + '.spec.txt'), (r.stdout || '') + '\n# stderr\n' + (r.stderr || '') + `\n# exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
const m = ((r.stdout || '') + (r.stderr || '')).match(/ℹ (tests|pass|fail|skipped|todo) \d+/g);
console.log(f.padEnd(44), 'exit', r.status, ((Date.now() - t0) / 1000).toFixed(1), 's', m ? m.join(' ') : '');
console.log('d477b run done');
