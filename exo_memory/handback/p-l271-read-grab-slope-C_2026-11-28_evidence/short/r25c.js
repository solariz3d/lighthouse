// r25c.js <tree at 16a93d1> <out.json>: pane C, L271 short re-read (section 8). Row 25 alone, under exact replacements of follow's line in app/core/zonegrab.js,
// with a 0 m control (M0). Then readout runs: the test copy gets one console.log line after the banked press (the row's own r: across, slopeMiss, miss, far,
// and the two rims at that station), on the branch and under M2 and M0. Every file is restored byte for byte (sha256 checked). A replacement whose search
// string is not found exactly once is NOT APPLIED and runs nothing. Then the touched rows whole on the unmutated tree.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const [T, OUT] = process.argv.slice(2), ZF = path.join(T, 'app/core/zonegrab.js'), TF = path.join(T, 'app/test/core-pieces-ui.test.js');
const zOrig = fs.readFileSync(ZF, 'utf8'), tOrig = fs.readFileSync(TF, 'utf8'), sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const LINE = 'const v1 = [v0[0] + e * cx * cx, v0[1] + e * cx * cy + v]';
const Z = {
  BRANCH: null,
  'M0 the 0 m control (+ 0 * e)': 'const v1 = [v0[0] + e * cx * cx + 0 * e, v0[1] + e * cx * cy + v]',
  'BASE c522ea6': 'const v1 = [v0[0] + e, v0[1] + v]',
  'M1 no rise along the slope': 'const v1 = [v0[0] + e * cx * cx, v0[1] + v]',
  'M2 the pull whole across (rise kept)': 'const v1 = [v0[0] + e, v0[1] + e * cx * cy + v]',
  'M2 at 10% of its difference across': 'const v1 = [v0[0] + e * cx * cx + 0.1 * e * (1 - cx * cx), v0[1] + e * cx * cy + v]',
  'M5 the share not squared': 'const v1 = [v0[0] + e * cx, v0[1] + e * cy + v]',
  'M6 half the slope move': 'const v1 = [v0[0] + 0.5 * e * cx * cx, v0[1] + 0.5 * e * cx * cy + v]',
  'M7 down the slope instead of up': 'const v1 = [v0[0] + e * cx * cx, v0[1] - e * cx * cy + v]',
  'M8 the slope move 10% long': 'const v1 = [v0[0] + 1.1 * e * cx * cx, v0[1] + 1.1 * e * cx * cy + v]',
  "LIT D's literal": 'const tt = e * cx + v * cy, v1 = [v0[0] + tt * cx, v0[1] + tt * cy]',
};
const ANCHOR = 'r = press(-1, 40 * out, 0, { s: mb.s });';
const READ = ANCHOR + " console.log('C-READ ' + JSON.stringify({ s: mb.s, Lb, rimL: ZG.acrossAt(tb.path, tb.segments, mb, -1).pos, rimR: ZG.acrossAt(tb.path, tb.segments, mb, 1).pos, across: r.across, slopeMiss: r.slopeMiss, miss: r.miss, far: r.far, d: r.d }));";
const PATTERN = '^row 25 \\(';
const run = (files, pattern) => {
  const args = ['--test', '--test-reporter=tap', ...(pattern ? ['--test-name-pattern', pattern] : []), ...files];
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT'));
  const r = spawnSync(process.execPath, args, { cwd: T, env, encoding: 'utf8', timeout: 15 * 60 * 1000 });
  const o = r.stdout || '', n = (k) => Number((o.match(new RegExp(`^# ${k} (\\d+)`, 'm')) || [])[1]);
  const fails = [...o.matchAll(/^not ok \d+ - (.*)$/gm)].map((m) => m[1].slice(0, 90));
  const msgs = [...o.matchAll(/error: ([\s\S]*?)\n\s*code:/g)].map((m) => m[1].replace(/\s+/g, ' ').slice(0, 300));
  const reads = [...o.matchAll(/C-READ (\{.*\})/g)].map((m) => { try { return JSON.parse(m[1]); } catch (e) { return m[1]; } });
  const names = [...o.matchAll(/^(?:not )?ok \d+ - (.*)$/gm)].map((m) => m[1].slice(0, 40));
  return { status: r.status, tests: n('tests'), pass: n('pass'), fail: n('fail'), cancelled: n('cancelled'), skipped: n('skipped'), names, fails, msgs, reads, tap: o };
};
const once = (text, from) => text.split(from).length - 1;
const out = { rows: [], reads: [], touched: null };
const chord = (rd) => { if (!rd || !rd.rimL) return null; const c = rd.rimL.map((x, k) => x - rd.rimR[k]); return Math.asin(c[1] / Math.hypot(...c)) * 180 / Math.PI; };
try {
  for (const [id, to] of Object.entries(Z)) {
    if (to !== null && once(zOrig, LINE) !== 1) { out.rows.push({ id, applied: false }); continue; }
    if (to !== null) fs.writeFileSync(ZF, zOrig.replace(LINE, to));
    const r = run(['app/test/core-pieces-ui.test.js'], PATTERN);
    fs.writeFileSync(ZF, zOrig);
    out.rows.push({ id, applied: true, tests: r.tests, pass: r.pass, fail: r.fail, cancelled: r.cancelled, names: r.names, msgs: r.msgs.slice(0, 3) });
    console.log(`${id} | row 25: tests ${r.tests} pass ${r.pass} fail ${r.fail} | ${r.names.join(' ; ')} | first: ${(r.msgs[0] || '').slice(0, 200)}`);
  }
  // readouts: the test copy prints the row's own figures after the banked press
  if (once(tOrig, ANCHOR) !== 1) { out.reads.push({ applied: false, why: 'anchor not found once' }); console.log('READOUT NOT APPLIED'); }
  else for (const id of ['BRANCH', 'M2 the pull whole across (rise kept)', 'M0 the 0 m control (+ 0 * e)']) {
    fs.writeFileSync(TF, tOrig.replace(ANCHOR, READ));
    if (Z[id] !== null) fs.writeFileSync(ZF, zOrig.replace(LINE, Z[id]));
    const r = run(['app/test/core-pieces-ui.test.js'], PATTERN);
    fs.writeFileSync(ZF, zOrig); fs.writeFileSync(TF, tOrig);
    const rd = r.reads[0] || null;
    out.reads.push({ id, pass: r.pass, fail: r.fail, read: rd, chordDeg: chord(rd), msgs: r.msgs.slice(0, 2) });
    console.log(`READ ${id} | pass ${r.pass} fail ${r.fail} | ${rd ? `s ${rd.s} of ${rd.Lb}; rim-to-rim slope ${chord(rd).toFixed(3)} deg; across ${rd.across}; slopeMiss ${rd.slopeMiss}; miss ${rd.miss}; far ${rd.far}` : 'no read'}`);
  }
} finally { fs.writeFileSync(ZF, zOrig); fs.writeFileSync(TF, tOrig); }
out.restored = sha(fs.readFileSync(ZF, 'utf8')) === sha(zOrig) && sha(fs.readFileSync(TF, 'utf8')) === sha(tOrig);
const t = run(['app/test/zonegrab.test.js', 'app/test/core-pieces-ui.test.js', 'app/test/handles.test.js']);
out.touched = { tests: t.tests, pass: t.pass, fail: t.fail, cancelled: t.cancelled, skipped: t.skipped, fails: t.fails };
fs.writeFileSync(path.join(path.dirname(OUT), 'touched8.tap'), t.tap);
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('restored', out.restored, '| touched', JSON.stringify({ ...out.touched, fails: out.touched.fails.length }));
