// bn.js <cwd> <out> <args...>: node <args> in <cwd> at BelowNormal, hidden, output to <out>
const os = require('os'), fs = require('fs'), { spawnSync } = require('child_process');
os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL);
const fd = fs.openSync(process.argv[3], 'w'); const t0 = Date.now();
const r = spawnSync('node', process.argv.slice(4), { cwd: process.argv[2], windowsHide: true, stdio: ['ignore', fd, fd] });
fs.appendFileSync(process.argv[3], `\n# bn: exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(0)} s\n`);
