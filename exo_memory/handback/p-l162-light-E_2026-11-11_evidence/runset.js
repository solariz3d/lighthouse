// runset.js <worktree> <tag>: pane E, L162. Under the heavy-run lock, BelowNormal: the three sweeps and the walk captures of
// seeds 1, 2, 3, written to <scratch>/l162/<tag>/. Nothing timed. dz-world --capture-walk opens no window and exits.
'use strict';
const path = require('path'), fs = require('fs'), cp = require('child_process');
const W = process.argv[2], TAG = process.argv[3], OUT = path.join(__dirname, TAG);
require('C:/Consonance/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: `pane E L162: ${TAG} sweeps + capture-walk seeds 1-3 (offscreen, no timing)` });
try { require('os').setPriority(require('os').constants.priority.PRIORITY_BELOW_NORMAL); } catch (e) {}
fs.mkdirSync(OUT, { recursive: true });
const bin = (n) => path.join(W, 'build', 'bin', n);
const run = (exe, args, file) => { const r = cp.spawnSync(bin(exe), args, { cwd: W, encoding: 'utf8', maxBuffer: 64 << 20 }); fs.writeFileSync(path.join(OUT, file), `$ ${exe} ${args.join(' ')}\nexit ${r.status}\n${r.stdout}${r.stderr}`); console.log(exe, args.join(' '), '->', r.status); };
run('dz-gen.exe', ['--sweep', '20', '--biome', 'apartment'], 'sweep-apartment.txt');
run('dz-gen.exe', ['--sweep', '20', '--biome', 'hotel'], 'sweep-hotel.txt');
run('dz-gen.exe', ['--sweep', '20'], 'sweep-world.txt');
for (const s of [1, 2, 3]) { const d = path.join(OUT, `walk-seed${s}`); fs.mkdirSync(d, { recursive: true }); run('dz-world.exe', ['--capture-walk', d, '--seed', String(s)], `walk-seed${s}.txt`); }
