// D677 M-line: the read of the ring for item 2 (items 1 and 4): the gate by grip and the whole suite at the tip (3112032), then pane E's staging at
// 3112032 with the keep off, today and grips 1.0 to 2.0, with the wide read at the 90.
const fs = require('fs');
const S = 'C:/Users/nname/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d676';
const W = 'G:/consonance-scratch/a-m1-dz3', E = 'G:/consonance-scratch/a-m3c-e22';
const base = JSON.parse(fs.readFileSync(S + '/steps_m3c.json', 'utf8'));
const by = (n) => base.find((x) => x.name === n);
const bat = (t) => '"C:\\Users\\nname\\AppData\\Local\\Temp\\claude\\4589df4838997b56\\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\\scratchpad\\d676\\cbuild.bat" G:\\consonance-scratch\\' + t + ' ';
const st = (cwd, name, cmd, out, mayFail) => ({ name, cwd, ...(mayFail ? { mayFail: true } : {}), cmd, out: S + '/' + out });
const steps = [
  st(W, 'the gate-by-grip row added', 'node ' + S + '/gate_grip.js', 'wd_add.txt'),
  st(W, 'build (3112032 with the row)', bat('a-m1-dz3') + 'chase_tests nav_tests', 'wd_build.log'),
  st(W, 'the gate by grip', '"' + W + '/build/bin/chase_tests.exe" diag_gate_by_grip', 'wd_gate.txt', true),
  st(W, 'tests back', 'node ' + S + '/put_tests_back.js', 'wd_back.txt'),
  st(W, 'build (3112032)', bat('a-m1-dz3') + 'chase_tests nav_tests', 'wd_build2.log'),
  { ...by('chase_tests whole'), out: S + '/wd_chase_tests.txt', mayFail: true },
  { ...by('nav_tests whole'), out: S + '/wd_nav_tests.txt', mayFail: true },
  st(E, 'the wide hook in the E tree', 'node ' + S + '/e_wide_hook.js', 'wd_ehook.txt'),
  st(E, 'the law copied to E (3112032)', 'node ' + S + '/put_e3.js', 'wd_eput.txt'),
  st(E, 'build E tree dz-world', bat('a-m3c-e22') + 'dz-world', 'wd_ebuild.log'),
];
for (const corner of ['22', '45', '90']) {
  const env = 'set DZ_TICKREAD_ONLY=1&& set DZ_TRACE_APEX=1&& set DZ_WIDE_READ=1&& ' + (corner === '90' ? 'set DZ_PLAN_READ=1&& ' : '');
  steps.push(st(E, 'E ' + corner + ', today', env + '"' + E + '/build/bin/dz-world.exe" --film-corner G:\\consonance-scratch\\a-m3c-e22-out\\wd --corner ' + corner, 'wd_e' + corner + '_today.txt', true));
  for (const g of ['1.0', '1.3', '1.6', '2.0'])
    steps.push(st(E, 'E ' + corner + ', grip ' + g, env + '"' + E + '/build/bin/dz-world.exe" --film-corner G:\\consonance-scratch\\a-m3c-e22-out\\wd --corner ' + corner + ' --chase-speed "root_law=1;line_arcs=1;grip_mu=' + g + '"', 'wd_e' + corner + '_g' + g + '.txt', true));
}
fs.writeFileSync(S + '/steps_wide.json', JSON.stringify(steps, null, 1));
console.log(steps.length + ' steps');
