// A L170 landing: BelowNormal, the EXCLUSIVE heavy-run hold (long wait); writes how it ended.
const os = require('os');
const fs = require('fs');
const { spawnSync } = require('child_process');
try { os.setPriority(process.pid, os.constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) { console.error(e.message); }
const r = spawnSync(process.execPath, ['C:/Consonance/lighthouse/consonance/tools/heavy-run.js', '--run', '--exclusive', '--cmd', 'A L170 landing: rebase and merge l170-chase onto main, build.bat test -j4 + both selftests', '--', process.env.ComSpec || 'C:/Windows/System32/cmd.exe', '/d', '/c', process.argv[2]], { stdio: 'inherit', env: { ...process.env, CONSONANCE_HEAVY_WAIT_MS: '21600000' } });
fs.writeFileSync(process.argv[3], JSON.stringify({ ended: new Date().toISOString(), status: r.status }));
process.exit(r.status == null ? 1 : r.status);
