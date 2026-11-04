// Run a cargo command under the tree's heavy-run lock (consonance/tools/heavy-run.js hold()), from consonance/src-tauri.
//   node heavy-cargo.js test --bin consonance [filter]
const path = require('path');
const { spawnSync } = require('child_process');
const REPO = 'C:/Users/nname/Desktop/lighthouse';
require(path.join(REPO, 'consonance/tools/heavy-run.js')).hold({ cmd: 'cargo ' + process.argv.slice(2).join(' ') });
const r = spawnSync(process.env.CARGO_BIN || path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe'), process.argv.slice(2), { cwd: path.join(REPO, 'consonance/src-tauri'), stdio: 'inherit', shell: false });
if (r.error) { console.error('heavy-cargo: could not run cargo: ' + r.error.message); process.exit(1); }
process.exit(r.status == null ? 1 : r.status);
