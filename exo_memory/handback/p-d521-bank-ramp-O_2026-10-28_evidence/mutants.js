// mutants.js (D521, O): the rounded bank's own mutants. Each changes ONE exact string (applied only if it occurs exactly once) in a COPY of the tree's src/, app/,
// tools/ and test/, then runs test/core_extend.test.js and app/test/core-shell.test.js there. Caught = at least one test failed; a crashed run counts as NOT TESTED.
// A control run on the unmutated copy must pass first. BelowNormal, inside a heavy-run slot.   node mutants.js <tree> <out>
const os = require('os'), fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
os.setPriority(0, os.constants.priority.PRIORITY_BELOW_NORMAL);
const [tree, out] = process.argv.slice(2);
require('C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js').hold({ cmd: 'd521 O rounded-bank mutants (BelowNormal)' });
const X = 'src/core/extend.js', PN = 'app/core/panel.js';
const MUTANTS = [
  ['M1 the rounded shape is never used', X, `const S0 = a !== null ? (u) => roundedLinear(u, a) : blend;`, `const S0 = blend;`],
  ['M2 the knots where the rate turns are not added', X, `if (shape && given(targets.phi) && !shortRamps.includes('phi')) {`, `if (false) {`],
  ['M3 only the knots at l, not at l/2', X, `ts = [r / 2, r, Lt - r, Lt - r / 2]`, `ts = [r, Lt - r]`],
  ['M11 the bank is not refitted on the inserted knots', X, `fitWithHold(refined, 'phi', channels.phi, Lt, targets.phi); c2Ends(refined, 'phi');`, ``],
  ['M12 the bank is refitted but not pinned C2 at its ends', X, `fitWithHold(refined, 'phi', channels.phi, Lt, targets.phi); c2Ends(refined, 'phi');`, `fitWithHold(refined, 'phi', channels.phi, Lt, targets.phi);`],
  ['M4 the rounding is a quarter of every ramp', X, `const roundOf = (Lt) => Math.min(BANK_ROUND_M, Lt / 4);`, `const roundOf = (Lt) => Lt / 4;`],
  ['M5 the rounding is 10 m even on a short ramp', X, `const roundOf = (Lt) => Math.min(BANK_ROUND_M, Lt / 4);`, `const roundOf = (Lt) => BANK_ROUND_M;`],
  ["M6 the rate rises linearly (the bank's curvature steps at the joint)", X, `const ROUND_I = (t) => t * t * t - (t * t * t * t) / 2;`, `const ROUND_I = (t) => (t * t) / 2;`],
  ['M7 every cross-section channel is rounded, not only the bank', X, `const a = ch === 'phi' && shape === 'rounded' ?`, `const a = C2_CHANNELS.has(ch) && shape === 'rounded' ?`],
  ['M8 an unknown shape is not refused', X, `if (bankShape !== undefined && bankShape !== null && bankShape !== 'rounded') throw`, `if (false) throw`],
  ['M9 the rounded shape is the default for every caller', X, `const shape = bankShape === 'rounded' ? 'rounded' : null;`, `const shape = 'rounded';`],
  ['M10 the panel never asks for it', PN, `if (b !== null) out.bankShape = 'rounded';`, `if (false) out.bankShape = 'rounded';`],
];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'd521-mut-'));
const copy = () => { fs.rmSync(path.join(tmp, 't'), { recursive: true, force: true }); for (const d of ['src', 'app', 'tools', 'test']) fs.cpSync(path.join(tree, d), path.join(tmp, 't', d), { recursive: true, filter: (p) => !/node_modules|[\\/]\.git[\\/]/.test(p) }); return path.join(tmp, 't'); };
const runIn = (dir) => spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'test/core_extend.test.js', 'app/test/core-shell.test.js'], { cwd: dir, encoding: 'utf8', maxBuffer: 1 << 26 });
const count = (r, k) => +((r.stdout.match(new RegExp(`^# ${k} (\\d+)`, 'm')) || [])[1] || NaN);
const lines = [];
const ctl = runIn(copy()); lines.push(`CONTROL: tests ${count(ctl, 'tests')} pass ${count(ctl, 'pass')} fail ${count(ctl, 'fail')}`);
let applied = 0, caught = 0, notApplied = 0, notTested = 0;
if (count(ctl, 'fail') === 0 && count(ctl, 'pass') > 0) for (const [id, file, a, b] of MUTANTS) {
  const dir = copy(), p = path.join(dir, file), src = fs.readFileSync(p, 'utf8'), n = src.split(a).length - 1;
  if (n !== 1) { notApplied++; lines.push(`${id}: NOT APPLIED (${n} matches)`); continue; }
  fs.writeFileSync(p, src.replace(a, () => b)); applied++;
  const r = runIn(dir), fail = count(r, 'fail');
  if (!Number.isFinite(fail)) { notTested++; lines.push(`${id}: NOT TESTED (the run crashed: exit ${r.status})`); continue; }
  if (fail > 0) { caught++; lines.push(`${id}: caught (${fail} failed)`); } else lines.push(`${id}: SURVIVED`);
} else lines.push('the control failed: no mutant run');
lines.push(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} / NOT TESTED ${notTested}`);
fs.rmSync(tmp, { recursive: true, force: true });
fs.writeFileSync(out, lines.join('\n') + '\n'); console.log(lines.join('\n'));
