const { hold } = require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js');
const { spawnSync } = require('child_process');
const [cmd, ...args] = process.argv.slice(2);
hold({ cmd: 'B D218 ' + [cmd, ...args].join(' ').slice(0, 110) });
const r = spawnSync(cmd, args, { stdio: 'inherit', shell: false, env: process.env });
process.exit(r.status == null ? 1 : r.status);
