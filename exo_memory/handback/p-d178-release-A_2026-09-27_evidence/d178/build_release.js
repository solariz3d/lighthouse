// The release build: `cargo tauri build` to the NSIS installer, under the heavy-run lock, in its OWN target dir, with a
// hard timeout (40 min) after which only the process tree it started is killed. Writes nothing into the repo but
// src-tauri/dist (build.rs, gitignored).
const { spawn, spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 D180 A release build via src-tauri/release.cjs (path remap + scan), own target dir, -j 4' });
const HERE = __dirname, TARGET = path.join(HERE, 'target'), LOG = path.join(HERE, 'build.log');
const cargo = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const out = fs.openSync(LOG, 'w'), t0 = Date.now();
const child = spawn(process.execPath, ['src-tauri/release.cjs'], { cwd: 'C:/Users/nname/Desktop/t180-track-builder', env: { ...process.env, CARGO_TARGET_DIR: TARGET, CARGO_BUILD_JOBS: '4' }, stdio: ['ignore', out, out], windowsHide: true });
const kill = setTimeout(() => { fs.appendFileSync(LOG, '\nHARD TIMEOUT: killing the build tree\n'); spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F']); }, 40 * 60 * 1000);
child.on('exit', (code) => { clearTimeout(kill); console.log(`exit ${code} after ${Math.round((Date.now() - t0) / 1000)} s`); process.exit(code === null ? 1 : code); });
