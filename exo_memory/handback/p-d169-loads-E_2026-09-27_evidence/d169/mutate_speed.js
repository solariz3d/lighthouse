'use strict';
// D169 (pane E): mutation pass over the NEW code (the speed model in src/validate, the picker and its wiring in
// app/validate-ui) ON A COPY of the repo. One exact-string replacement per mutant (exactly one match, else NOT APPLIED),
// each copied file restored in a finally; the live checkout is only read. One progress line per mutant.
const fs = require('fs'), path = require('path'), { spawnSync } = require('child_process');
const LIVE = 'C:/Users/nname/Desktop/t180-track-builder', COPY = path.join(__dirname, 'copy');
fs.rmSync(COPY, { recursive: true, force: true });
for (const d of ['src', 'tools', 'app', 'test']) fs.cpSync(path.join(LIVE, d), path.join(COPY, d), { recursive: true });
const F = { limits: 'src/validate/limits.js', index: 'src/validate/index.js', speed: 'app/validate-ui/speed.js', vpanel: 'app/validate-ui/panel.js' };
const TESTS = ['test/validate_speed.test.js', 'test/validate.test.js', 'test/validate_incremental.test.js', 'test/validate_jumps.test.js', 'app/test/validate-ui-speed.test.js', 'app/test/validate-ui-panel.test.js', 'app/test/validate-ui.test.js'];
const M = [
  ['limits', 'vmax back to 745', 'vmaxKmh: 764,', 'vmaxKmh: 745,'],
  ['limits', 'design default off by one row (p90 645)', 'designSpeedKmh: 460,', 'designSpeedKmh: 645,'],
  ['limits', 'table: one value off', '[450, 20.07]', '[450, 21.07]'],
  ['limits', 'table: one band dropped', ', [650, 14.75]', ''],
  ['limits', 'accelAt: below the table is 0', 'if (k <= a[0][0]) return a[0][1];', 'if (k <= a[0][0]) return 0;'],
  ['limits', 'accelAt: no interpolation (step)', 'return a[i - 1][1] + (a[i][1] - a[i - 1][1]) * t; }', 'return a[i][1]; }'],
  ['limits', 'accelAt: beyond the table is 0', "  return a[a.length - 1][1];\n}", "  return 0;\n}"],
  ['limits', 'accelAt: km/h taken as m/s', 'const k = v * 3.6;', 'const k = v;'],
  ['limits', 'accelAt: a number ignored', "if (typeof a === 'number') return a;", ''],
  ['index', 'picker ignored', "const fill = Number.isFinite(opts.designSpeed) && opts.designSpeed > 0 ? opts.designSpeed : null;", 'const fill = null;'],
  ['index', 'picker overrides the word\'s own speed', '(Number.isFinite(g.speed) && g.speed > 0 ? g.speed : fill)', '(fill != null ? fill : Number.isFinite(g.speed) && g.speed > 0 ? g.speed : null)'],
  ['index', 'a speed of 0 accepted', 'opts.designSpeed > 0 ? opts.designSpeed : null', 'opts.designSpeed >= 0 ? opts.designSpeed : null'],
  ['index', 'ghost on any open path', '!(path.closed || asked)', 'false'],
  ['index', 'ghost never on closed (default car)', '!(path.closed || asked)', '!asked'],
  ['index', 'an asked-for ghost refused on open paths', 'const asked = !!(opts.car && opts.car.accel != null);', 'const asked = false;'],
  ['index', 'lap sim at the table\'s first value only', 'const along = accelAt(car, cur) - G', 'const along = accelAt(car, 0) - G'],
  ['index', 'picker change carried incrementally', ' || opts.designSpeed !== prev._raw.designSpeed) return validate', ') return validate'],
  ['speed', 'picker default not from the car', 'function createSpeedPicker({ kmh = MACH6.designSpeedKmh,', 'function createSpeedPicker({ kmh = 300,'],
  ['speed', 'no lower bound', 'Math.min(MAX_KMH, Math.max(MIN_KMH, k))', 'Math.min(MAX_KMH, k)'],
  ['speed', 'no upper bound', 'Math.min(MAX_KMH, Math.max(MIN_KMH, k))', 'Math.max(MIN_KMH, k)'],
  ['speed', 'NaN accepted', "if (k != null && !Number.isFinite(k)) throw", 'if (false) throw'],
  ['speed', 'onChange on every set', 'if (next === cur) return cur;', ''],
  ['speed', 'ms in km/h', 'ms: () => (cur == null ? null : cur / 3.6),', 'ms: () => cur,'],
  ['vpanel', 'picker speed not passed to validation', '...(design == null ? {} : { designSpeed: design / 3.6 })', ''],
  ['vpanel', 'picker speed passed in km/h', '{ designSpeed: design / 3.6 }', '{ designSpeed: design }'],
  ['vpanel', 'setDesignSpeed does not re-validate', 'setDesignSpeed(kmh) { design = kmh == null ? null : kmh; live = createLive({ validate: vo() }); update(shell.getState(), true); },', 'setDesignSpeed(kmh) { design = kmh == null ? null : kmh; },'],
  ['vpanel', 'controller default not the car\'s', 'designSpeedKmh = MACH6.designSpeedKmh,', 'designSpeedKmh = null,'],
];
const orig = Object.fromEntries(Object.entries(F).map(([k, f]) => [k, fs.readFileSync(path.join(COPY, f), 'utf8')]));
let applied = 0, caught = 0, notApplied = 0; const rows = [];
for (const [which, name, from, to] of M) {
  const text = orig[which], n = text.split(from).length - 1;
  if (n !== 1) { notApplied++; rows.push(`NOT APPLIED (${n} matches)  ${which}: ${name}`); console.log(`[${applied + notApplied}/${M.length}] ${rows[rows.length - 1]}`); continue; }
  try {
    fs.writeFileSync(path.join(COPY, F[which]), text.replace(from, to));
    const r = spawnSync(process.execPath, ['--test', '--test-concurrency=4', ...TESTS], { cwd: COPY, encoding: 'utf8', timeout: 600000 });
    applied++; const failed = r.status !== 0; if (failed) caught++;
    rows.push(`${failed ? 'caught  ' : 'SURVIVED'}  ${which}: ${name}`); console.log(`[${applied + notApplied}/${M.length}] ${rows[rows.length - 1]}`);
  } finally { fs.writeFileSync(path.join(COPY, F[which]), orig[which]); }
}
let same = true; for (const f of Object.values(F)) if (fs.readFileSync(path.join(COPY, f), 'utf8') !== fs.readFileSync(path.join(LIVE, f), 'utf8')) same = false;
console.log(`\napplied ${applied} / caught ${caught} / NOT APPLIED ${notApplied} (of ${M.length}); copy restored equal to the live files: ${same ? 'yes' : 'NO'}`);
