// D675 the Dark's hand mutants (pane E; lighthouse loop/registration_dark_figure_E_2026-11-13.md, Checks and Addition 1).
// Each applied to game/world/stage.cpp by exact text (each anchor exactly once), dz-world rebuilt, the world self-test run;
// the source restored and confirmed byte-equal. node mutdark.js <worktree>
//   expect 'red': the named row must FAIL.  expect 'false-green': the named row must PASS (the control on the red state).
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const wt = process.argv[2];
const file = path.join(wt, 'game/world/stage.cpp');
const original = fs.readFileSync(file);
const vc = '"C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Auxiliary\\Build\\vcvars64.bat"';
const sh = (cmd) => spawnSync('cmd.exe', ['/d', '/s', '/c', `"${cmd}"`], { encoding: 'utf8', windowsVerbatimArguments: true, maxBuffer: 1 << 27 });
const ROW_OT = 'in overtime, every chaser pose has a drawn figure';
const ROW_AWAY = 'while no Dark is out, the stage neither poses nor draws';
const NO_DARK = ['  if (hunter_.on) take("hunter", kHunterKit, false, dark_);\n', ''];
const mutants = [
  { name: 'dark_matched_as_hunter', row: ROW_OT, expect: 'red',
    pairs: [['    if (dark_.on && !dark_out && p.kind == dz::chase::Kind::Dark) {\n', '    if (dark_.on && !dark_out && p.kind == dz::chase::Kind::Hunter) {\n']] },
  { name: 'dark_never_loaded (the red state)', row: ROW_OT, expect: 'red', pairs: [NO_DARK] },
  { name: 'red state + the undrawn count not incremented', row: ROW_OT, expect: 'false-green',
    pairs: [NO_DARK, ['      if (k < undrawn_.size()) ++undrawn_[k];   // D675: the stage\'s own count of a pose drawn by nothing\n', '']] },
  { name: 'dark posed every frame, out or not (Addition 1)', row: ROW_AWAY, expect: 'red',
    pairs: [['  if (dark_.on && !dark_out && !dark_.away) {\n    pose_model(dark_, away_palette(dark_.rig.joints()));\n    dark_.away = true;\n    ++dark_palettes_;\n',
             '  if (dark_.on && !dark_out) {\n    pose_model(dark_, away_palette(dark_.rig.joints()));\n    dark_.away = true;\n    ++dark_palettes_;\n    ++dark_posed_;\n']] },
];
let applied = 0, asExpected = 0, notApplied = 0;
for (const m of mutants) {
  const crlf = original.toString('utf8').includes('\r\n');
  let s = original.toString('utf8').replace(/\r\n/g, '\n');
  let ok = true;
  for (const [a, b] of m.pairs) {
    if (s.split(a).length - 1 !== 1) { ok = false; break; }
    s = s.replace(a, () => b);
  }
  const mutated = Buffer.from(crlf ? s.replace(/\n/g, '\r\n') : s, 'utf8');
  if (!ok || mutated.equals(original)) { ++notApplied; console.log(`${m.name}: NOT APPLIED`); continue; }
  fs.writeFileSync(file, mutated);
  ++applied;
  const b = sh(`call ${vc} >nul 2>nul & cd /d ${wt} && cmake --build build --target dz-world`);
  const t = b.status === 0 ? sh(`cd /d ${wt} && build\\bin\\dz-world.exe --config game/config --selftest`) : null;
  fs.writeFileSync(file, original);
  if (!fs.readFileSync(file).equals(original)) throw new Error('restore failed for ' + m.name);
  if (!t) { console.log(`${m.name}: DID NOT BUILD\n${((b.stdout || '') + (b.stderr || '')).slice(-1500)}`); continue; }
  const line = (t.stdout || '').split(/\r?\n/).find((l) => l.includes(m.row)) || '(row not printed)';
  const passed = /^\s*ok\s/.test(line), failed = /^\s*FAIL\s/.test(line);
  const good = m.expect === 'red' ? failed : passed;
  if (good) ++asExpected;
  console.log(`${m.name}: expected ${m.expect}, got ${failed ? 'FAIL' : passed ? 'ok' : '?'} ${good ? '(as expected)' : '(NOT as expected)'}\n    ${line.trim()}`);
}
const b = sh(`call ${vc} >nul 2>nul & cd /d ${wt} && cmake --build build --target dz-world`);
console.log('clean rebuild: ' + (b.status === 0 ? 'built' : 'FAILED'));
console.log(`applied ${applied} / as expected ${asExpected} / NOT APPLIED ${notApplied}`);
