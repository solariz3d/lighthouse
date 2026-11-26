// d642_runs.js (pane C, L242 read): D642's timing row (app/test/core-extra-bank-drag-cost.test.js) run N rounds on two trees, in ABBA order
// (odd rounds base then tip, even rounds tip then base), one node --test process per run, sequential. Prints one line per run and a tally.
// Run: node d642_runs.js <base tree> <tip tree> <rounds>
'use strict';
const { spawnSync } = require('child_process');
const [base, tip, rounds = '10'] = process.argv.slice(2);
const tally = { base: { pass: 0, fail: 0 }, tip: { pass: 0, fail: 0 } };
for (let r = 1; r <= Number(rounds); r++) {
  const order = r % 2 ? [['base', base], ['tip', tip]] : [['tip', tip], ['base', base]];
  for (const [name, dir] of order) {
    const t0 = Date.now();
    const out = spawnSync(process.execPath, ['--test', 'app/test/core-extra-bank-drag-cost.test.js'], { cwd: dir, encoding: 'utf8' });
    const text = (out.stdout || '') + (out.stderr || ''), ok = out.status === 0;
    const nums = [...text.matchAll(/rolling \(first drag\) p95[^\n]*/g)].map((m) => m[0].replace(/\s+/g, ' ')).slice(0, 3).join(' | ');
    tally[name][ok ? 'pass' : 'fail']++;
    console.log(`round ${r} ${name} ${ok ? 'PASS' : 'FAIL'} exit=${out.status} ${Date.now() - t0}ms ${nums}`);
  }
}
console.log(`TALLY base ${tally.base.fail} red of ${tally.base.pass + tally.base.fail}; tip ${tally.tip.fail} red of ${tally.tip.pass + tally.tip.fail}`);
