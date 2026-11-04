// hrmany.js <worktree> <glob-ish prefixes...>: node --test --test-concurrency=4 of the files, under the heavy-run lock; one line per file
const { spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const wt = process.argv[2], pats = process.argv.slice(3); process.chdir(wt);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 A D404 whole: ' + pats.join(' ').slice(0, 80) });
const files = []; for (const p of pats) { const [dir, re] = p.split('::'); for (const f of fs.readdirSync(dir)) if (new RegExp(re).test(f) && f.endsWith('.test.js')) files.push(path.join(dir, f)); }
console.log('files', files.length);
const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', '--test-timeout=900000', ...files], { stdio: 'inherit', maxBuffer: 1 << 28 });
process.exit(r.status);
