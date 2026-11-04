// hr.js <worktree> <file...>: node --test of the named test files in the worktree, under the heavy-run lock
const { spawnSync } = require('child_process');
const wt = process.argv[2], files = process.argv.slice(3);
process.chdir(wt);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 A D403 ' + files.join(' ') });
const r = spawnSync(process.execPath, ['--test', '--test-timeout=300000', ...files], { stdio: 'inherit' });
process.exit(r.status);
