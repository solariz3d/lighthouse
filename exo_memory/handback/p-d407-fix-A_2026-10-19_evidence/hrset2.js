const { spawnSync } = require('child_process'); process.chdir(process.argv[2]);
const FILES = ['app/test/mutation.test.js', 'test/geom_mutation.test.js', 'app/test/look.test.js', 'app/test/release-ghost.test.js'];
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 A D407 re-run of the two harnesses' });
console.log('lock held', new Date().toISOString());
const r = spawnSync(process.execPath, ['--test', '--test-concurrency=2', '--test-timeout=900000', ...FILES], { stdio: 'inherit' });
console.log('set exit', r.status, new Date().toISOString()); process.exit(r.status);
