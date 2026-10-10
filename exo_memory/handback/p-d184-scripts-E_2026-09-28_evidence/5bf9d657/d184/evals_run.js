// D184, B: the skill's evals on b-d184-wt, one hold of the lock, each run on its own (the regressions ALONE), 4096 MB.
'use strict';
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const WT = 'C:/Users/nname/AppData/Local/Temp/b-d184-wt', OUT = __dirname;
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'pane B: D184 skill evals (known-answer+mutation, regressions alone, piecewise + m2m3 tests)' });
const E = '.claude/skills/track-equations/evals/';
const runs = [
  ['known', [E + 'known_answers.test.js', E + 'mutation.test.js']],
  ['regressions', [E + 'regressions.test.js']],
  ['piecewise', ['test/piecewise.test.js']],
  ['m2m3', ['test/m2m3_tools.test.js']],
];
for (const [label, files] of runs) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', '--test-concurrency=4', ...files], { cwd: WT, env: { ...process.env, NO_COLOR: '1', NODE_OPTIONS: '--max-old-space-size=4096' }, encoding: 'utf8', maxBuffer: 1 << 28, timeout: 40 * 60 * 1000 });
  const out = ((r.stdout || '') + (r.stderr || '')).replace(/\x1b\[[0-9;]*m/g, '');
  fs.writeFileSync(path.join(OUT, `eval_${label}.txt`), out + `\n--exit ${r.status} ${r.error ? r.error.code : ''} ${((Date.now() - t0) / 60000).toFixed(1)} min\n`);
}
fs.writeFileSync(path.join(OUT, 'evals.done'), new Date().toISOString());
