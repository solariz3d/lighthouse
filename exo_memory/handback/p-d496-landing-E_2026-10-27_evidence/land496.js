// land496.js (D496, pane E): on the landing tree, in order: (1) the JS suite whole (js-suite.js takes the heavy-run lock itself); (2) cargo test
// --no-fail-fast for the whole package, under a heavy-run hold; (3) the visit files' mutation harness whole (O's d476p4-mutants.js, copied unedited
// beside this file, which holds the lock itself). Run under belownormal.js, so every child is BelowNormal. Each run's output goes to out/<name>.out.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const W = 'C:/Users/nname/Desktop/worktrees/lh-d496-e', T = path.join(W, 'consonance', 'src-tauri'), OUT = path.join(__dirname, 'out');
fs.mkdirSync(OUT, { recursive: true });
const stamp = () => new Date().toISOString().slice(11, 19) + 'Z';
const say = (s) => { fs.appendFileSync(path.join(OUT, 'land496.log'), `${stamp()} ${s}\n`); };
const run = (name, cmd, args, cwd, env) => {
  say(`start ${name}`); const t0 = Date.now();
  const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', maxBuffer: 1 << 30, env: { ...process.env, ...(env || {}) } });
  fs.writeFileSync(path.join(OUT, `${name}.out`), `$ ${cmd} ${args.join(' ')}\n# cwd ${cwd}\n# exit ${r.status} in ${Math.round((Date.now() - t0) / 1000)} s\n${r.stdout || ''}\n${r.stderr || ''}`);
  say(`end ${name}: exit ${r.status} in ${Math.round((Date.now() - t0) / 1000)} s`);
  return r.status;
};
say(`head ${spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: W, encoding: 'utf8' }).stdout.trim()} changed=[${spawnSync('git', ['status', '--short'], { cwd: W, encoding: 'utf8' }).stdout.split('\n').filter(Boolean).length}]`);
run('js-suite', process.execPath, [path.join(W, 'consonance', 'tools', 'js-suite.js')], W, { CONSONANCE_HEAVY_WAIT_MS: '14400000' });
{
  const hr = require(path.join(W, 'consonance', 'tools', 'heavy-run.js'));
  const h = hr.hold({ cmd: 'E D496 lighthouse land-d496 cargo test --no-fail-fast (BelowNormal)', tree: W });
  try { run('cargo-test', 'C:/Users/nname/.cargo/bin/cargo.exe', ['test', '--no-fail-fast'], T, { CARGO_TERM_COLOR: 'never' }); }
  finally { if (h && typeof h.release === 'function') h.release(); }
}
run('mutants', process.execPath, [path.join(__dirname, 'd476p4-mutants.js'), T], W, { CONSONANCE_HEAVY_WAIT_MS: '14400000' });
say(`after: changed=[${spawnSync('git', ['status', '--short'], { cwd: W, encoding: 'utf8' }).stdout.split('\n').filter(Boolean).length}]`);
say('done');
