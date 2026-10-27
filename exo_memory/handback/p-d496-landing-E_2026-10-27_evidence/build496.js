// build496.js (D496, pane E): target/release from the merged main (f84864f7, the landing tree), as O built d476p4: cargo tauri build --no-bundle,
// under a heavy-run hold, run through belownormal.js. Output to out/release-build.out.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/lh-d496-e', T = path.join(W, 'consonance', 'src-tauri'), OUT = path.join(__dirname, 'out');
const h = require(path.join(W, 'consonance', 'tools', 'heavy-run.js')).hold({ cmd: 'E D496 lighthouse f84864f7 cargo tauri build --no-bundle (BelowNormal)', tree: W });
try {
  const t0 = Date.now();
  const r = spawnSync('C:/Users/nname/.cargo/bin/cargo.exe', ['tauri', 'build', '--no-bundle'], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 30, env: { ...process.env, CARGO_TERM_COLOR: 'never' } });
  fs.writeFileSync(path.join(OUT, 'release-build.out'), `$ cargo tauri build --no-bundle\n# cwd ${T}\n# head ${spawnSync('git', ['rev-parse', 'HEAD'], { cwd: W, encoding: 'utf8' }).stdout.trim()}\n# exit ${r.status} in ${Math.round((Date.now() - t0) / 1000)} s\n${r.stdout || ''}\n${r.stderr || ''}`);
  console.log(`build exit ${r.status} in ${Math.round((Date.now() - t0) / 1000)} s`);
} finally { if (h && typeof h.release === 'function') h.release(); }
