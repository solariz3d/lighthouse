// cut-runs.js: the D424 cut's touched cargo target (the consonance bin, whole) and both mutation runs, in turn; each step takes its own slot.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const WT = 'C:/Users/nname/Downloads/lh-d424-a', HERE = __dirname;
const CARGO = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const log = (...a) => console.log(new Date().toISOString(), ...a);
const steps = [
  ['cut-cargo-bin', process.execPath, ['-e', `process.chdir(${JSON.stringify(WT)}); require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'D424-A cut cargo test --bin consonance' }); const r = require('child_process').spawnSync(${JSON.stringify(CARGO)}, ['test', '--bin', 'consonance'], { cwd: ${JSON.stringify(WT + '/consonance/src-tauri')}, stdio: 'inherit' }); process.exitCode = r.status;`]],
  ['cut-mut-pane_exit', process.execPath, [path.join(WT, 'consonance/tools/mutant-harness.js'), path.join(HERE, 'rows-pane_exit.js')]],
  ['cut-mut-main', process.execPath, [path.join(WT, 'consonance/tools/mutant-harness.js'), path.join(HERE, 'rows-main.js')]],
];
for (const [tag, cmd, args] of steps) {
  const t0 = Date.now();
  const r = spawnSync(cmd, args, { cwd: WT, encoding: 'utf8', maxBuffer: 512 << 20, timeout: 4 * 3600 * 1000 });
  const out = (r.stdout || '') + (r.stderr || '');
  fs.writeFileSync(path.join(HERE, `${tag}.log`), out);
  const tail = out.split('\n').filter((l) => /test result|mutants:|SURVIVED|NO RESULT|NOT APPLIED|pre-flight|live .* unchanged|FAILED|^error/.test(l)).slice(-30).join('\n');
  log(`${tag}: exit ${r.status} in ${((Date.now() - t0) / 60000).toFixed(1)} min\n${tail}`);
}
