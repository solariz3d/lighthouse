// red.js <tag>: D424's rows (pane_exit, and the inbox rows) on lh-d424-a, one heavy-run slot held from that tree; output kept whole.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const WT = 'C:/Users/nname/Downloads/lh-d424-a';
process.chdir(WT);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'D424-A red/green rows (cargo test filtered)' });
const CARGO = path.join(process.env.USERPROFILE, '.cargo', 'bin', 'cargo.exe');
const t0 = Date.now();
const r = spawnSync(CARGO, ['test', '--bin', 'consonance', '--', 'pane_exit', 'the_2237_case', 'a_refusal_takes_every', 'a_message_held_across', 'take_withdrawn_pops', 'a_waiting_message_carries', 'pane_exit_wiring_tests'],
  { cwd: path.join(WT, 'consonance/src-tauri'), encoding: 'utf8', maxBuffer: 256 << 20, timeout: 3600000 });
const out = (r.stdout || '') + (r.stderr || '');
fs.writeFileSync(path.join(__dirname, `cargo-${process.argv[2] || 'run'}.log`), out);
console.log(`exit ${r.status} in ${((Date.now() - t0) / 1000).toFixed(0)} s`);
console.log(out.split('\n').filter((l) => /^test |test result|^error|panicked|FAILED/.test(l)).join('\n'));
