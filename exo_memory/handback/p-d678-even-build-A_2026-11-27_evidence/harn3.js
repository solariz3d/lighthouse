// harn3.js <tree> <out dir>: the nine mutation harnesses that name app/core/panel.js (besides the Even harness), one after the other, each its own node --test
// run from the tree's root; writes <out dir>/harn3_<name>.out and prints one line per harness (tests, pass, fail, exit).
'use strict';
const { spawnSync } = require('child_process'), fs = require('fs'), path = require('path');
const T = path.resolve(process.argv[2]), O = path.resolve(process.argv[3]);
const LIST = ['test/core_sharp_mutation.test.js', 'test/core_right_width_mutation.test.js', 'test/core_ramp_mutation.test.js', 'test/core_landing_xsec_mutation.test.js',
  'test/core_early_turn_climb_mutation.test.js', 'app/test/core-xsec-mutation.test.js', 'app/test/core-mutation.test.js', 'app/test/core-close-mutation.test.js',
  'app/test/core-bank-carry-mutation.test.js'];
for (const f of LIST) {
  const t0 = Date.now(), r = spawnSync(process.execPath, ['--max-old-space-size=4096', '--test', f], { cwd: T, encoding: 'utf8', maxBuffer: 1 << 28 });
  const out = (r.stdout || '') + (r.stderr || ''), clean = out.replace(/\x1b\[[0-9;]*m/g, '');
  fs.writeFileSync(path.join(O, `harn3_${path.basename(f, '.test.js')}.out`), clean);
  const n = (k) => { const m = clean.match(new RegExp(`^ℹ ${k} (\\d+)`, 'm')); return m ? +m[1] : null; };
  const na = (clean.match(/not applied/gi) || []).length, nt = (clean.match(/: NOT TESTED/g) || []).length;
  console.log(JSON.stringify({ harness: f, tests: n('tests'), pass: n('pass'), fail: n('fail'), notAppliedMentions: na, notTested: nt, exit: r.status, s: Math.round((Date.now() - t0) / 1000) }));
}
