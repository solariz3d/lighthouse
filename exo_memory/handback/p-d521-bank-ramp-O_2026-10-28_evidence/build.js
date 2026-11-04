// build.js (D521, O): the install build of d521-install, BelowNormal, inside a heavy-run slot: cargo check --locked (it writes src-tauri/dist), then release.cjs.
// Output to <log>.   node build.js <tree> <log>
const os = require('os'), fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [tree, log] = process.argv.slice(2);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'd521 O t180 install build (cargo check + release.cjs, BelowNormal)' });
const env = { ...process.env, PATH: `C:\\Users\\nname\\.cargo\\bin;${process.env.PATH}`, CARGO_TERM_COLOR: 'never' };
const out = [];
const run = (label, cmd, args, cwd) => { const t0 = Date.now(), r = spawnSync(cmd, args, { cwd, env, encoding: 'utf8', maxBuffer: 1 << 28, shell: false }); out.push(`$ ${label}\n# exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(0)} s\n${r.stdout || ''}\n${r.stderr || ''}${r.error ? '\nspawn error ' + r.error.message : ''}`); return r.status; };
let ok = run('cargo check --locked', 'C:\\Users\\nname\\.cargo\\bin\\cargo.exe', ['check', '--locked'], path.join(tree, 'src-tauri')) === 0;
if (ok) ok = run('node src-tauri/release.cjs', process.execPath, ['src-tauri/release.cjs'], tree) === 0;
fs.writeFileSync(log, out.join('\n\n')); console.log(ok ? 'build ok' : 'build FAILED (see the log)');
