// A L161: hold the heavy-run lock, BelowNormal, run one command line in a directory, print the wall time.
const { spawnSync } = require('child_process'); const os = require('os');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [label, cwd, ...cmd] = process.argv.slice(2);
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A L161 ' + label });
const t0 = Date.now();
const r = spawnSync(cmd.join(' '), { cwd, stdio: 'inherit', shell: true });
console.log(`lockrun: ${label} WALL ${((Date.now() - t0) / 1000).toFixed(0)} s, exit ${r.status}`);
process.exit(r.status == null ? 1 : r.status);
