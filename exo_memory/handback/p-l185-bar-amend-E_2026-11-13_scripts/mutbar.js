// D675 speed-bar amendment (pane E): the clean ragdoll_tests run, then hand mutants on game/tests/ragdoll_tests.cpp, each
// anchor exactly once, restored and confirmed equal after. node mutbar.js <worktree>
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const wt = process.argv[2];
const file = path.join(wt, 'game', 'tests', 'ragdoll_tests.cpp');
const original = fs.readFileSync(file);
const vc = '"C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Auxiliary\\Build\\vcvars64.bat"';
const run = () => {
  try {
    return execSync(`cmd.exe /d /c "call ${vc} >nul 2>nul & cd /d ${wt} && cmake --build build --target ragdoll_tests >nul && build\\bin\\ragdoll_tests.exe"`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    return (e.stdout || '') + (e.stderr || '');
  }
};
const clean0 = run();
console.log('=== clean\n' + clean0.split(/\r?\n/).filter(l => /r4_5|r5_|60 s:|through it|tests, \d+ failed|^FAIL/.test(l)).join('\n'));
// Each mutant must be RED: the bar is what makes the row fail.
const mutants = [
  // R4.5 with the filter gone: every body against 30, the keyed toes (30.67) break it.
  { name: 'r45_all_bodies', from: 'if (soft_keyed(j) && read_v[ji] > fastest_soft)', to: 'if (read_v[ji] > fastest_soft)' },
  // R5 with the filter gone: the keyed toes (30.41) break it.
  { name: 'r5_all_bodies', from: '    if (soft_keyed(j)) fastest_soft = std::max(fastest_soft, read_v[ji]);', to: '    fastest_soft = std::max(fastest_soft, read_v[ji]);' },
  // R4.5's bar at 28: the soft-keyed hand (28.60) breaks it.
  { name: 'r45_bar_28', from: '  DZ_CHECK(fastest_soft <= 30.0f);', to: '  DZ_CHECK(fastest_soft <= 28.0f);' },
];
let applied = 0, caught = 0, notApplied = 0;
for (const m of mutants) {
  const s0 = original.toString('utf8');
  if (s0.split(m.from).length - 1 !== 1) { ++notApplied; console.log(`${m.name}: NOT APPLIED`); continue; }
  fs.writeFileSync(file, s0.replace(m.from, () => m.to));
  ++applied;
  const out = run();
  fs.writeFileSync(file, original);
  if (!fs.readFileSync(file).equals(original)) throw new Error('restore failed for ' + m.name);
  const fails = out.split(/\r?\n/).filter(l => l.startsWith('FAIL')).map(l => l.slice(6));
  const ran = /tests, \d+ failed/.test(out);
  if (fails.length && ran) ++caught;
  console.log(`${m.name}: ${ran ? (fails.length ? 'CAUGHT by ' + fails.join(', ') : 'SURVIVED') : 'DID NOT BUILD OR RUN\n' + out.slice(-1500)}`);
}
const clean = run();
console.log('clean rebuild: ' + (clean.match(/\d+ tests, \d+ failed/) || ['no summary'])[0]);
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}`);
