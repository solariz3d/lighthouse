// run264.js (pane E, L264 read): the rows, run under heavy-run by the caller. (1) the tip's touched rows at the tip; (2) the SAME two files (the tip's) on the base tree,
// as scratch copies zz-e264-*.test.js that this script writes and deletes; (3) the new mutation harness at the tip. TAP to <out dir>.
// usage: node run264.js <tipTree> <baseTree> <out dir>
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const [TIP, BASE, OUT] = process.argv.slice(2).map((p) => path.resolve(p));
const run = (cwd, args, file) => { const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-reporter=tap', ...args], { cwd, encoding: 'utf8', maxBuffer: 1 << 28 }); fs.writeFileSync(path.join(OUT, file), r.stdout + (r.stderr ? `\n# STDERR\n${r.stderr}` : '')); return r.status; };
const s1 = run(TIP, ['app/test/core-width-hold.test.js', 'app/test/drag-ghost.test.js'], 'rows_tip.tap');
const copies = [['app/test/core-width-hold.test.js', 'app/test/zz-e264-width-hold.test.js'], ['app/test/drag-ghost.test.js', 'app/test/zz-e264-drag-ghost.test.js']];
for (const [a, b] of copies) fs.copyFileSync(path.join(TIP, a), path.join(BASE, b));
let s2; try { s2 = run(BASE, copies.map(([, b]) => b), 'rows_base_with_tip_files.tap'); } finally { for (const [, b] of copies) fs.rmSync(path.join(BASE, b), { force: true }); }
const s3 = run(TIP, ['test/core_width_hold_mutation.test.js'], 'harness_tip.tap');
fs.writeFileSync(path.join(OUT, 'run264.status'), JSON.stringify({ rowsTip: s1, rowsBase: s2, harness: s3, at: new Date().toISOString() }) + '\n');
