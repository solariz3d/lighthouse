// LAP 3: the panel mutants, then panel.js's tests, one after the other (run under heavy-run --exclusive)
const { spawnSync } = require('child_process');
for (const s of ['mut_panel.js', 'run_touched.js']) { const r = spawnSync(process.execPath, [__dirname + '/' + s], { stdio: 'inherit', windowsHide: true }); if (r.status) process.exitCode = r.status; }
