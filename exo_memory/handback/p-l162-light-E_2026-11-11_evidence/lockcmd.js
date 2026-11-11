// lockcmd.js <cwd> <label> -- <cmd...>: hold the heavy-run lock, BelowNormal (inherited by children), run one command
'use strict';
const [cwd, label, , ...cmd] = process.argv.slice(2);
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane E L162: ' + label });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
const r = require('child_process').spawnSync(cmd[0], cmd.slice(1), { cwd, stdio: 'inherit', env: { ...process.env, CMAKE_BUILD_PARALLEL_LEVEL: '4' } });
process.exit(r.status === null ? 1 : r.status);
