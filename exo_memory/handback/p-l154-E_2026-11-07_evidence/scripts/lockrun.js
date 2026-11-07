// lockrun.js <cwd> -- <cmd...>: hold the heavy-run lock, run one command at BelowNormal, release on exit
'use strict';
const [cwd, , ...cmd] = process.argv.slice(2);
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E L154: ' + cmd.join(' ').slice(0, 120) + ' (no timing)' });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const r = require('child_process').spawnSync(cmd[0], cmd.slice(1), { cwd, stdio: 'inherit', shell: false });
process.exit(r.status === null ? 1 : r.status);
