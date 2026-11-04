// cargo test for src-tauri under the heavy-run lock, 4 jobs (the chair's load rule, 2026-09-27 16:59)
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 't180 cargo test (D176 A), -j 4' });
const cargo = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const target = 'C:/Users/nname/AppData/Local/Temp/claude/C--Consonance-instances-sibling-3d57124e/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d165/t180_target';
const r = spawnSync(cargo, ['test', '-j', '4', '--manifest-path', 'src-tauri/Cargo.toml', '--target-dir', target, ...process.argv.slice(2)],
  { cwd: 'C:/Users/nname/Desktop/t180-track-builder', encoding: 'utf8', maxBuffer: 1 << 28 });
fs.writeFileSync(path.join(__dirname, 'cargo.txt'), (r.stdout || '') + (r.stderr || ''));
console.log('exit', r.status);
