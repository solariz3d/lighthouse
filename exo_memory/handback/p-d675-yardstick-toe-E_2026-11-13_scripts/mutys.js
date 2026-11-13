// D675 yardstick toe-speed hand mutants (pane E): the six registered in lighthouse
// loop/registration_yardstick_toe_speed_E_2026-11-13.md section 5. Each applied by exact text (each anchor exactly once,
// the file confirmed changed), yardstick_tests and dz-yardstick rebuilt, the suite run and `dz-yardstick --simtk` run
// (its exit is row 6); the source restored and confirmed byte-equal. CAUGHT when the suite has a FAIL or --simtk exits
// non-zero. node mutys.js <worktree> <simtk dir>
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const [wt, simtk] = process.argv.slice(2);
const vc = '"C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Auxiliary\\Build\\vcvars64.bat"';
const sh = (cmd) => spawnSync('cmd.exe', ['/d', '/s', '/c', `"${cmd}"`], { encoding: 'utf8', windowsVerbatimArguments: true, maxBuffer: 1 << 26 });
const run = () => {
  const b = sh(`call ${vc} >nul 2>nul & cd /d ${wt} && cmake --build build --target yardstick_tests dz-yardstick`);
  if (b.status !== 0) return { built: false, out: (b.stdout || '') + (b.stderr || '') };
  const t = sh(`${wt}\\build\\bin\\yardstick_tests.exe`);
  const s = sh(`${wt}\\build\\bin\\dz-yardstick.exe --simtk ${simtk}`);
  return { built: true, tests: t.stdout || '', simtk: s.stdout || '', simtk_exit: s.status };
};
const mutants = [
  { name: 'c3d_scale_ignored', file: 'tools/yardstick/c3d.cpp',
    from: 'x = s16(b, at) * out.scale, y = s16(b, at + 2) * out.scale, z = s16(b, at + 4) * out.scale, w = s16(b, at + 6);',
    to: 'x = s16(b, at), y = s16(b, at + 2), z = s16(b, at + 4), w = s16(b, at + 6);' },
  { name: 'rate_240_not_250', file: 'tools/yardstick/c3d.cpp', from: '  out.rate = f32(b, 20);', to: '  out.rate = 240.0;' },
  { name: 'named_speed_not_pelvis', file: 'tools/yardstick/end_speed.cpp',
    from: '  out.pelvis_speed = h_dist(a, b, true) / (static_cast<double>(last - first) / f.rate);',
    to: '  out.pelvis_speed = c3d_path.find("Gait21") != std::string::npos ? 3.56 : c3d_path.find("Gait27") != std::string::npos ? 5.20 : c3d_path.find("Gait33") != std::string::npos ? 7.00 : 9.49;' },
  { name: 'filter_forward_only', file: 'tools/yardstick/end_speed.cpp',
    from: '  std::reverse(y.begin(), y.end());\n  y = butter2_pass(y, fc, fs);\n  std::reverse(y.begin(), y.end());\n', to: '' },
  { name: 'phase_fixed_rate', file: 'tools/yardstick/end_speed.cpp',
    from: 'static_cast<float>(std::fmod(turn * t, 2.0 * kPi));', to: 'static_cast<float>(std::fmod(9.42477796 * t, 2.0 * kPi));' },
  { name: 'feet_not_carried', file: 'tools/yardstick/end_speed.cpp',
    from: 'const double t = static_cast<double>(i) / kOursRate, along = speed * t;', to: 'const double t = static_cast<double>(i) / kOursRate, along = 0.0 * t;' },
];
let applied = 0, caught = 0, notApplied = 0;
for (const m of mutants) {
  const p = path.join(wt, m.file);
  const original = fs.readFileSync(p);
  const crlf = original.toString('utf8').includes('\r\n');
  let s = original.toString('utf8').replace(/\r\n/g, '\n');
  if (s.split(m.from).length - 1 !== 1) { ++notApplied; console.log(`${m.name}: NOT APPLIED (anchor x${s.split(m.from).length - 1})`); continue; }
  s = s.replace(m.from, () => m.to);
  const mutated = Buffer.from(crlf ? s.replace(/\n/g, '\r\n') : s, 'utf8');
  if (mutated.equals(original)) { ++notApplied; console.log(`${m.name}: NOT APPLIED (no change)`); continue; }
  fs.writeFileSync(p, mutated);
  ++applied;
  const r = run();
  fs.writeFileSync(p, original);
  if (!fs.readFileSync(p).equals(original)) throw new Error('restore failed for ' + m.name);
  if (!r.built) { console.log(`${m.name}: DID NOT BUILD\n${r.out.slice(-1200)}`); continue; }
  const fails = r.tests.split(/\r?\n/).filter((l) => l.startsWith('FAIL')).map((l) => l.slice(6));
  const row6 = r.simtk_exit !== 0;
  if (fails.length || row6) ++caught;
  console.log(`${m.name}: ${fails.length || row6 ? 'CAUGHT by ' + fails.concat(row6 ? ['--simtk row 6 (exit ' + r.simtk_exit + ')'] : []).join(', ') : 'SURVIVED'}`);
}
const clean = run();
console.log('clean rebuild: ' + ((clean.tests || '').match(/\d+ tests, \d+ failed/) || ['no summary'])[0] + '; --simtk exit ' + clean.simtk_exit);
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
