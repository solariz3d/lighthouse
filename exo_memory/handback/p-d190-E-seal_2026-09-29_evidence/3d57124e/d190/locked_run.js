const { spawnSync } = require('child_process');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'A D190: ' + process.argv.slice(2).join(' ').slice(0, 80) });
const r = spawnSync(process.execPath, ['--max-old-space-size=4096', ...process.argv.slice(2)], { encoding: 'utf8', stdio: 'inherit', timeout: 40 * 60 * 1000 });
process.exit(r.status == null ? 1 : r.status);
