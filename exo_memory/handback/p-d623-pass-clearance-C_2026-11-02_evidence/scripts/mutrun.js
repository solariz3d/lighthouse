// mutrun.js <tree>: mutants of src/validate/passclear.js, each run against test/passclear.test.js, app/test/core-pass-clearance.test.js and app/test/core-readout-display.test.js in a copy of the two files' folders (the tree's own file is
// never touched): applied / caught / NOT APPLIED, and the survivors by name. Every child hidden.
'use strict';
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const T = process.argv[2], SRC = path.join(T, 'src/validate/passclear.js'), orig = fs.readFileSync(SRC, 'utf8');
const M = [
  ['P1 the car margin 1 m less', 'const CAR_MARGIN_M = 3.1;', 'const CAR_MARGIN_M = 2.1;'],
  ['P2 a level crossing not touching (the coplanar miss)', 'hi > -TOUCH_M', 'hi > 0'],
  ['P3 no hull under the road', 'b: add(q, d, p.depth)', 'b: add(q, d, 0)'],
  ['P4 every road a closed ring: no aprons (the sealed() bug)', 'closedRing(segments[j])', 'true'],
  ['P5 beside counted as over', 'if (!(bd <= 0.5 * ACROSS_M + EPS)) continue;', 'if (!(bd <= 5 * ACROSS_M + EPS)) continue;'],
  ['P7 the plank sloping up', 'Y = EY - w * Math.sin(sl)', 'Y = EY + w * Math.sin(sl)'],
  ['P8 the hull hung toward the car', 'dX: -h[0], dY: -h[1]', 'dX: h[0], dY: h[1]'],
  ['P9 from ignored', 'for (let i = from; i < n; i++) {', 'for (let i = 0; i < n; i++) {'],
  ['P10 the edge depth eased linearly', 'd += (dE - UNDERSKIN_OFFSET_M) * x * x;', 'd += (dE - UNDERSKIN_OFFSET_M) * x;'],
  ['P11 the along-road window ten times wide', 'if (Math.abs(t) > A.hs) continue;', 'if (Math.abs(t) > 10 * A.hs) continue;'],
  ['P12 the car room as deep as the margin twice', 'if (!(lo < margin && hi > -TOUCH_M)) continue;', 'if (!(lo < 2 * margin && hi > -TOUCH_M)) continue;'],
  ['P13 the edge depth at the flat offset only', 'depth: ring ? UNDERSKIN_OFFSET_M : hullDepth(rim)', 'depth: UNDERSKIN_OFFSET_M'],
  ['P14 the apron box floor at the plank', 'depth: Math.max(0, Y - bottomY)', 'depth: 0'],
  ['P15 no seam at an open track\'s ends', 'if (!path.closed && ((Math.min(S[i].s, S[j].s) - S[0].s < sep && S[n - 1].s - Math.max(S[i].s, S[j].s) < sep) || seamPair(i, j))) continue;', 'if (false) continue;'],
  ['P19 the seam piece only, not the 25 m ends', '(Math.min(S[i].s, S[j].s) - S[0].s < sep && S[n - 1].s - Math.max(S[i].s, S[j].s) < sep) || seamPair(i, j)', 'seamPair(i, j)'],
  ['P16 the last piece on the first, any way it runs', '&& dot(S[i].T, S[j].T) > Math.cos(SEAM_DEG * DEG)', ''],
  ['P17 the same pass by 25 m only (no lateral reach)', 'if (ds < Math.max(sep, secOf(S[i].seg).w + secOf(S[j].seg).w)) continue;', 'if (ds < sep) continue;'],
  ['P18 no clip from surfaces on both sides', 'if ((above && below) || on) {', 'if (false) {'],
];
let applied = 0, caught = 0, notApplied = 0; const survivors = [];
// the CONTROL first: the unmutated copy must pass, or every "caught" below means nothing
{
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcmut-'));
  for (const d of ['src', 'test', 'app', 'tools']) fs.cpSync(path.join(T, d), path.join(dir, d), { recursive: true });
  const r = cp.spawnSync(process.execPath, ['--test', '--test-concurrency=3', 'test/passclear.test.js', 'app/test/core-pass-clearance.test.js', 'app/test/core-readout-display.test.js', 'app/test/sculpt-tools.test.js'], { cwd: dir, encoding: 'utf8', windowsHide: true, timeout: 600000 });
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`control (unmutated): exit ${r.status}`); if (r.status !== 0) { console.log(((r.stdout || '') + (r.stderr || '')).slice(-2000)); process.exit(1); }
}
for (const [name, a, b] of M) {
  if (orig.split(a).length - 1 !== 1) { notApplied++; console.log(`NOT APPLIED ${name}: anchor found ${orig.split(a).length - 1} times`); continue; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pcmut-'));
  // a copy of the tree's src and test folders the test reads (src/, test/), with the mutant in the copy
  for (const d of ['src', 'test', 'app', 'tools']) fs.cpSync(path.join(T, d), path.join(dir, d), { recursive: true });
  fs.writeFileSync(path.join(dir, 'src/validate/passclear.js'), orig.replace(a, () => b));
  applied++;
  const r = cp.spawnSync(process.execPath, ['--test', '--test-concurrency=3', 'test/passclear.test.js', 'app/test/core-pass-clearance.test.js', 'app/test/core-readout-display.test.js', 'app/test/sculpt-tools.test.js'], { cwd: dir, encoding: 'utf8', windowsHide: true, timeout: 600000 });
  const out = (r.stdout || '') + (r.stderr || ''), fail = (out.match(/^ℹ fail (\d+)/m) || out.match(/^# fail (\d+)/m) || [])[1];
  const isCaught = r.status !== 0;
  if (isCaught) caught++; else survivors.push(name);
  console.log(`${isCaught ? 'CAUGHT  ' : 'SURVIVED'} ${name} (fail ${fail === undefined ? '?' : fail}, exit ${r.status})`);
  fs.rmSync(dir, { recursive: true, force: true });
}
console.log(`applied ${applied} / caught ${caught} / NOT APPLIED ${notApplied}${survivors.length ? '; survivors: ' + survivors.join('; ') : ''}`);
