// mut4.js <repo> <tap> <pattern>: a heavy-run slot, then finalscene_mutation.test.js filtered by the name pattern, hidden, BelowNormal
'use strict';
require('./winhide.js');
const cp = require('child_process'), [, , REPO, TAP, PAT] = process.argv;
process.chdir(REPO);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `A D617 finalscene mutants ${PAT} (t180 d617-a), hidden, BelowNormal; not a timing session` });
try { cp.execFileSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${process.pid}).PriorityClass = 'BelowNormal'`], { windowsHide: true }); } catch {}
if (/acs\.exe/i.test(cp.execFileSync('tasklist', ['/FI', 'IMAGENAME eq acs.exe', '/NH'], { encoding: 'utf8', windowsHide: true }))) { console.log('acs.exe up: not started'); process.exit(2); }
const r = cp.spawnSync(process.execPath, ['--test', '--test-reporter=tap', `--test-reporter-destination=${TAP}`, '--test-concurrency=1', `--test-name-pattern=${PAT}`, 'test/finalscene_mutation.test.js'], { windowsHide: true, stdio: 'ignore' });
console.log('exit', r.status);
