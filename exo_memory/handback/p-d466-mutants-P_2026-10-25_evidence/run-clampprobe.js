'use strict';
const os = require('os'); os.setPriority(os.constants.priority.PRIORITY_BELOW_NORMAL);
const S = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-372c8abc/fbf98f8e-29da-4fb2-8610-c038d6372249/scratchpad/d466';
const { spawnSync } = require('child_process');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'P d466 clampprobe (extend domain sweep, not a timing session)', tree: 'C:/Users/nname/Downloads/t180-wt-p466' });
const t0 = Date.now();
const r = spawnSync(process.execPath, [S + '/clampprobe.js', 'C:/Users/nname/Downloads/t180-wt-p466', S + '/mut-ke26', S + '/clampprobe.json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 });
require('fs').writeFileSync(S + '/clampprobe.out', r.stdout + '\n--- stderr\n' + r.stderr);
console.log('done', r.status, ((Date.now() - t0) / 1000).toFixed(0) + ' s');
