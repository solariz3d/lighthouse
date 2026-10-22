// after-b.js: D424's whole cargo and its mutation runs (seat A), started only once B's T-180 0.4.12 landing (its full suite and its
// quiet timing stage) has held no heavy-run slot for 10 minutes running: the chair's rule, two full runs never share the machine.
// Each step takes its own slot from lh-d424-a (a git tree); this waiter holds none. Every step's whole output is kept beside this file.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const WT = 'C:/Users/nname/Downloads/lh-d424-a', DATA = 'C:/Consonance/data', HERE = __dirname;
const CARGO = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const log = (...a) => console.log(new Date().toISOString(), ...a);
const holders = () => ['heavy-run.lock', 'heavy-run.2.lock'].map((f) => { try { return JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')); } catch { return null; } }).filter(Boolean);
const isB = (h) => /t180-wt-land412/i.test(h.tree || '') || /t180 B /.test(h.cmd || '');
(async () => {
  let clearSince = null;
  for (;;) {
    const hs = holders(), b = hs.filter(isB);
    if (b.length) { if (clearSince) log('B holds a slot again:', b.map((h) => h.cmd).join(' | ')); clearSince = null; }
    else if (!clearSince) { clearSince = Date.now(); log('no B holder; others:', hs.map((h) => h.cmd).join(' | ') || 'none'); }
    if (clearSince && Date.now() - clearSince >= 10 * 60 * 1000) break;
    await new Promise((r) => setTimeout(r, 30 * 1000));
  }
  log('B has held no slot for 10 minutes: starting');
  const steps = [
    ['cargo-whole', process.execPath, ['-e', `process.chdir(${JSON.stringify(WT)}); require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'D424-A cargo test whole' }); const r = require('child_process').spawnSync(${JSON.stringify(CARGO)}, ['test'], { cwd: ${JSON.stringify(WT + '/consonance/src-tauri')}, stdio: 'inherit' }); process.exitCode = r.status;`]],
    ['mut-pane_exit', process.execPath, [path.join(WT, 'consonance/tools/mutant-harness.js'), path.join(HERE, 'rows-pane_exit.js')]],
    ['mut-main', process.execPath, [path.join(WT, 'consonance/tools/mutant-harness.js'), path.join(HERE, 'rows-main.js')]],
    ['js-chain-status', process.execPath, ['--test', path.join(WT, 'consonance/tools/chain-status.test.js')]],
  ];
  for (const [tag, cmd, args] of steps) {
    const t0 = Date.now();
    const r = spawnSync(cmd, args, { cwd: WT, encoding: 'utf8', maxBuffer: 512 << 20, timeout: 4 * 3600 * 1000 });
    const out = (r.stdout || '') + (r.stderr || '');
    fs.writeFileSync(path.join(HERE, `${tag}.log`), out);
    const tail = out.split('\n').filter((l) => /test result|mutants:|SURVIVED|NO RESULT|NOT APPLIED|pre-flight|live .* unchanged|^ℹ (tests|pass|fail)|FAILED|^error/.test(l)).slice(-40).join('\n');
    log(`${tag}: exit ${r.status} in ${((Date.now() - t0) / 60000).toFixed(1)} min\n${tail}`);
  }
})();
