'use strict';
const os = require('os'), fs = require('fs'), path = require('path'), { spawnSync } = require('child_process'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const T = 'C:/Users/nname/Downloads/t180-wt-p466', S = __dirname;
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'P d466: core_xsec_mutation and core_piece_mutation whole, core_xsec and core_piece whole (BelowNormal; not a timing session)', tree: T });
for (const f of ['test/core_piece.test.js', 'test/core_xsec.test.js', 'test/core_piece_mutation.test.js', 'test/core_xsec_mutation.test.js']) {
  const tap = path.join(S, 'd466-' + path.basename(f, '.test.js') + '.tap'), t0 = Date.now();
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=1', '--test-reporter=spec', '--test-reporter-destination=stdout', '--test-reporter=tap', `--test-reporter-destination=${tap}`, f], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 90 * 60 * 1000 });
  fs.writeFileSync(path.join(S, 'd466-' + path.basename(f, '.test.js') + '.spec.txt'), (r.stdout || '') + '\n# stderr\n' + (r.stderr || '') + `\n# exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
  console.log(f, 'exit', r.status, ((Date.now() - t0) / 1000).toFixed(1), 's');
}
console.log('d466 runs done');
