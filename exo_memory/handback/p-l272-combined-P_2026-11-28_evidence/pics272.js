// pics272.js <merge worktree> <evidence dir>: pane P, L272 item 5 (scratch). The three pictures on the built page of the merge, one after another:
//   1. C's picnp.js (the ghost on the head after a width grab; handback/p-l270-n4a-files-C_2026-11-28_evidence/), on the merge only;
//   2. my evenpage272.js (an Even with the right edge kept, its sentence read off the page and checked against the shell's);
//   3. B's page271c.js (the slope grab on a banked turn, today's zonegrab.js from c522ea6 against the merge's; handback/p-l271-grab-slope-B_2026-11-28_evidence/).
// leftovers.js --json before and after (the tab-proxy count). Each script makes its own headless Chrome (--headless=new, --mute-audio, never focused) and titles it
// zz-headless-test before the page's script.
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs'), path = require('path');
const [, , WT, EV] = process.argv;
const SCR = __dirname, ROOM = 'C:/Consonance/lighthouse/exo_memory/handback';
fs.mkdirSync(EV, { recursive: true });
const left = (tag) => { const r = spawnSync(process.execPath, ['C:/Consonance/lighthouse/consonance/tools/leftovers.js', '--json'], { encoding: 'utf8' }); fs.writeFileSync(path.join(SCR, `pics-leftovers-${tag}.json`), r.stdout + r.stderr); };
const run = (name, args) => { const t0 = Date.now(); const r = spawnSync(process.execPath, args, { cwd: WT, encoding: 'utf8', maxBuffer: 64 << 20, timeout: 15 * 60000 }); fs.writeFileSync(path.join(SCR, `pics-${name}.out`), (r.stdout || '') + (r.stderr || '')); console.log(`${new Date().toISOString()} ${name}: exit ${r.status}, ${Math.round((Date.now() - t0) / 1000)} s`); };
left('before');
run('ghost', [path.join(ROOM, 'p-l270-n4a-files-C_2026-11-28_evidence/picnp.js'), WT, '0ba1da9', path.join(EV, 'ghost')]);
run('even', [path.join(SCR, 'evenpage272.js'), WT, path.join(EV, 'even')]);
run('slope', [path.join(ROOM, 'p-l271-grab-slope-B_2026-11-28_evidence/page271c.js'), WT, 'c522ea635285acf02379e5293cef08e02c0fbd50', path.join(EV, 'slope')]);
left('after');
