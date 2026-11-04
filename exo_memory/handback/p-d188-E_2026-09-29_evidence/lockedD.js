// lockedD.js (pane E, on D): one node run under the heavy-run lock, --max-old-space-size=4096, and a CARGO_TARGET_DIR of its own.
//   node lockedD.js "<label>" <cwd> <out file> <node args…>
const { spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const [label, cwd, out, ...args] = process.argv.slice(2);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: label });
const t0 = Date.now();
const r = spawnSync(process.execPath, ['--max-old-space-size=4096', ...args], { cwd, encoding: 'utf8', maxBuffer: 1 << 30,
  env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096', CARGO_TARGET_DIR: path.join(__dirname, 'cargo-target-E') } });
fs.writeFileSync(out, (r.stdout || '') + (r.stderr ? '\n--stderr--\n' + r.stderr : '') + `\n[lockedD.js] exit ${r.status} in ${Math.round((Date.now() - t0) / 1000)} s\n`);
process.exit(r.status === null ? 1 : r.status);
