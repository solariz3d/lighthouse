// D677 M3d: the count's chain (registration_m3d_count.md). Scratch trees only.
const fs = require('fs');
const S = 'C:/Users/nname/AppData/Local/Temp/claude/4589df4838997b56/6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f/scratchpad/d676';
const bat = (tree) => '"C:\\Users\\nname\\AppData\\Local\\Temp\\claude\\4589df4838997b56\\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\\scratchpad\\d676\\cbuild.bat" G:\\consonance-scratch\\' + tree + ' ';
const D = 'G:/consonance-scratch/a-m3d', E = 'G:/consonance-scratch/a-m3c-e22';
const st = (cwd, name, cmd, out, mayFail) => ({ name, cwd, ...(mayFail ? { mayFail: true } : {}), cmd, out: S + '/' + out });
const arms = [['today', ''], ['wayb', 'root_law=1'], ['waya', 'root_law=1;corner_feel=1']];
const steps = [st(D, 'build a-m3d chase_tests dz-chase', bat('a-m3d') + 'chase_tests dz-chase', 'd_build.log')];
steps.push(st(D, 'routes count, every arm', '"' + D + '/build/bin/chase_tests.exe" m3d_scratch', 'd_routes.txt', true));
for (const [n, sp] of arms)
  steps.push(st(D, 'sweep count, ' + n, '"' + D + '/build/bin/dz-chase.exe" sweep --seeds 12 --first 1 --levels 1 --policies line,flee,cutback --max 300 --threads 1' + (sp ? ' --speed "' + sp + '"' : ''), 'd_sweep_' + n + '.txt', true));
steps.push(st(E, 'build E tree dz-world (chase and nav from a-m3d)', bat('a-m3c-e22') + 'dz-world', 'd_ebuild.log'));
for (const corner of ['22', '45', '90'])
  for (const [n, sp] of arms)
    steps.push(st(E, 'E bend ' + corner + ', ' + n, 'set DZ_TICKREAD_ONLY=1&& "' + E + '/build/bin/dz-world.exe" --film-corner G:\\consonance-scratch\\a-m3c-e22-out\\m3d --corner ' + corner + (sp ? ' --chase-speed "' + sp + '"' : ''), 'd_e' + corner + '_' + n + '.txt', true));
fs.writeFileSync(S + '/steps_m3d.json', JSON.stringify(steps, null, 1));
console.log(steps.length + ' steps: ' + steps.map((s) => s.name).join(' | '));
