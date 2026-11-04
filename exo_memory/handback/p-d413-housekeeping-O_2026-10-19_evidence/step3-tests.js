'use strict';
// D413 step 3 (O): D390's tests on the new main, under the heavy-run lock. Run from the lighthouse root.
const { spawnSync } = require('child_process'), path = require('path');
require(path.resolve('consonance/tools/heavy-run.js')).hold({ cmd: 'lighthouse O D413 step 3 (js-suite, gen-consumer, portable-paths tests)', maxWaitMs: 2 * 60 * 60 * 1000 });
const head = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
console.log(`HEAD ${head} · ${new Date().toISOString()}`);
let worst = 0;
for (const args of [
  ['--test', 'consonance/tools/js-suite.test.js', 'consonance/tools/gen-consumer.test.js', 'consonance/tools/portable-paths.test.js'],
  ['consonance/tools/portable-paths.js'],
]) {
  const t = Date.now();
  const r = spawnSync(process.execPath, args, { stdio: 'inherit', windowsHide: true });
  console.log(`== node ${args.join(' ')} -> exit ${r.status} in ${((Date.now() - t) / 1000).toFixed(1)} s`);
  worst = Math.max(worst, r.status ?? 1);
}
process.exitCode = worst;
