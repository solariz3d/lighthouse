// mutmain.js (D454, B): break the intake test's fork set-aside one way at a time in a SCRATCH CLONE of the generated tree (the fork note exists only
// in a consumer), and require light_the_pane_intake to go red. Restores main.rs byte for byte after each. node mutmain.js <clone root> <cargo target>
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const [root, target] = process.argv.slice(2);
const F = path.join(root, 'consonance/src-tauri/src/main.rs'), orig = fs.readFileSync(F), src = orig.toString('utf8'), sha = (b) => crypto.createHash('sha256').update(b).digest('hex'), H0 = sha(orig);
const ALL = [
  ['R0 control: unmutated', (s) => s, true],
  ['R1 the fork note is not set aside', (s) => s.replace('assert!(rest.len() - fork <= LIGHT_PANE_REST_MAX,', 'assert!(rest.len() <= LIGHT_PANE_REST_MAX,')],
  ['R2 the fork ceiling below the measured note', (s) => s.replace('const FORK_SECTION_MAX: usize = 4_500;', 'const FORK_SECTION_MAX: usize = 3_000;')],
  ['F1 the floor-row fork span inflated (only the floor row reads it)', (s) => s.replace('let fork_floor = fork_span(&light_floor_rest);', 'let fork_floor = fork_span(&light_floor_rest) + 5_000;')],
  ['F2 the floor-row fork span is the whole floor rest', (s) => s.replace('let fork_floor = fork_span(&light_floor_rest);', 'let fork_floor = light_floor_rest.len() - 70_000;')],
  ['R3 fork_span measures nothing', (s) => s.replace('let Some(at) = s.find(FORK_MARKER) else { return 0 };', 'let Some(at) = s.find(FORK_MARKER) else { return 0 }; if at < usize::MAX { return 0; }')],
];
const M = ALL.filter(([n, , c]) => c || (process.env.MUT_ONLY || '').split(',').includes(n.split(' ')[0]));
let a = 0, c = 0, na = 0;
const run = () => spawnSync('C:/Users/nname/.cargo/bin/cargo.exe', ['test', '--bin', 'consonance', 'light_the_pane_intake', '--', '--nocapture'], { cwd: path.join(root, 'consonance/src-tauri'), env: { ...process.env, CARGO_TARGET_DIR: target }, encoding: 'utf8', maxBuffer: 1 << 28 });
try {
  for (const [name, f, control] of M) {
    const m = f(src);
    if (!control && m === src) { na++; console.log('NOT APPLIED  ' + name); continue; }
    fs.writeFileSync(F, m);
    const r = run(), out = (r.stdout || '') + (r.stderr || ''), fork = (out.match(/PANE INTAKE fork note (\d+) B/) || [])[1];
    if (control) { console.log(`control      ${name}: exit ${r.status}, fork note ${fork} B`); if (r.status !== 0) throw new Error('the control is red'); continue; }
    a++; const red = r.status !== 0; if (red) c++;
    console.log((red ? 'caught       ' : 'NOT CAUGHT   ') + name + (fork ? ` (fork note ${fork} B)` : ''));
    fs.writeFileSync(F, orig);
  }
} finally { fs.writeFileSync(F, orig); }
console.log(`applied ${a} / caught ${c} / NOT APPLIED ${na}; restored sha256 ${sha(fs.readFileSync(F)) === H0 ? 'equal' : 'DIFFERS'}`);
