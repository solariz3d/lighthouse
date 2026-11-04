// usage: node d220_run.js <script> [args...]   holds the heavy-run lock, runs the script with --max-old-space-size=4096
const { spawnSync } = require('child_process');
const [script, ...rest] = process.argv.slice(2);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'd220 reply-slot replay' });
const r = spawnSync(process.execPath, ['--max-old-space-size=4096', script, ...rest], { encoding: 'utf8', timeout: 900000, maxBuffer: 1 << 26 });
console.log((r.stdout || '').slice(0, 4000)); console.log((r.stderr || '').slice(0, 2000)); console.log('exit', r.status);
