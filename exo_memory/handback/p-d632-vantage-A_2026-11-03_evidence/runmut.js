// lower this process to BelowNormal (children inherit), then run the mutant harness over mutants.js
const cp = require('child_process');
cp.spawnSync('powershell', ['-NoProfile', '-Command', `(Get-Process -Id ${process.pid}).PriorityClass='BelowNormal'`], { windowsHide: true });
const r = cp.spawnSync(process.execPath, ['consonance/tools/mutant-harness.js', __dirname + '/mutants.js'],
  { cwd: 'C:/Users/nname/Desktop/worktrees/a-d632-wt', encoding: 'utf8', windowsHide: true, maxBuffer: 1 << 28 });
require('fs').writeFileSync(__dirname + '/mutants.out', (r.stdout || '') + (r.stderr || '') + `\nexit ${r.status}\n`);
