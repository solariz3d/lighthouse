// mut271.js <branch tree> <out.json>: pane C, L271. Each mutant is one exact string replacement in the branch tree's app/core/zonegrab.js (follow's slope line),
// then core-pieces-ui row 25 alone (--test-name-pattern "row 25") and the whole zonegrab file are run, then the file is restored byte for byte (checked by sha256).
// A mutant whose search string is not found is NOT APPLIED and runs nothing. Then the touched rows whole on the unmutated tree (C7): zonegrab, core-pieces-ui, handles.
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const [T, OUT] = process.argv.slice(2), F = path.join(T, 'app/core/zonegrab.js');
const orig = fs.readFileSync(F, 'utf8'), sha = (t) => crypto.createHash('sha256').update(t).digest('hex');
const LINE = 'const v1 = [v0[0] + e * cx * cx, v0[1] + e * cx * cy + v]';
const MUT = [
  ['BASE c522ea6 (the drag whole, as today)', LINE, 'const v1 = [v0[0] + e, v0[1] + v]'],
  ['M1 no rise along the slope', LINE, 'const v1 = [v0[0] + e * cx * cx, v0[1] + v]'],
  ['M2 the pull whole across', LINE, 'const v1 = [v0[0] + e, v0[1] + e * cx * cy + v]'],
  ['M5 the share not squared', LINE, 'const v1 = [v0[0] + e * cx, v0[1] + e * cy + v]'],
  ['M6 half the slope move', LINE, 'const v1 = [v0[0] + 0.5 * e * cx * cx, v0[1] + 0.5 * e * cx * cy + v]'],
  ['M7 down the slope instead of up', LINE, 'const v1 = [v0[0] + e * cx * cx, v0[1] - e * cx * cy + v]'],
  ['M8 the slope move 10% long', LINE, 'const v1 = [v0[0] + 1.1 * e * cx * cx, v0[1] + 1.1 * e * cx * cy + v]'],
  ["LIT D's literal (the whole drag onto the chord)", LINE, 'const tt = e * cx + v * cy, v1 = [v0[0] + tt * cx, v0[1] + tt * cy]'],
];
const run = (files, pattern) => {
  const args = ['--test', '--test-reporter=tap', ...(pattern ? ['--test-name-pattern', pattern] : []), ...files];
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_TEST_CONTEXT'));
  const r = spawnSync(process.execPath, args, { cwd: T, env, encoding: 'utf8', timeout: 15 * 60 * 1000 });
  const o = r.stdout || '', n = (k) => Number((o.match(new RegExp(`^# ${k} (\\d+)`, 'm')) || [])[1]);
  const fails = [...o.matchAll(/^not ok \d+ - (.*)$/gm)].map((m) => m[1].slice(0, 90));
  const msgs = [...o.matchAll(/error: '([^']*)'/g)].map((m) => m[1].slice(0, 200));
  return { status: r.status, tests: n('tests'), pass: n('pass'), fail: n('fail'), cancelled: n('cancelled'), skipped: n('skipped'), fails, msgs: msgs.slice(0, 6), tap: o };
};
const out = { mutants: [], touched: null };
try {
  for (const [id, from, to] of MUT) {
    const c = orig.split(from).length - 1;
    if (c !== 1) { out.mutants.push({ id, applied: false, matches: c }); continue; }
    fs.writeFileSync(F, orig.replace(from, to));
    const r25 = run(['app/test/core-pieces-ui.test.js'], 'row 25'), zg = run(['app/test/zonegrab.test.js']);
    fs.writeFileSync(F, orig);
    out.mutants.push({ id, applied: true, row25: { pass: r25.pass, fail: r25.fail, msgs: r25.msgs }, zonegrab: { tests: zg.tests, fail: zg.fail, fails: zg.fails } });
    console.log(id, '| row 25 fail', r25.fail, '| zonegrab fails', zg.fail, zg.fails.map((f) => f.slice(0, 12)).join(', '));
  }
} finally { fs.writeFileSync(F, orig); }
out.restored = sha(fs.readFileSync(F, 'utf8')) === sha(orig);
// row 25 unmutated, then the touched files whole
const r25 = run(['app/test/core-pieces-ui.test.js'], 'row 25'); out.row25Clean = { pass: r25.pass, fail: r25.fail };
const t = run(['app/test/zonegrab.test.js', 'app/test/core-pieces-ui.test.js', 'app/test/handles.test.js']);
out.touched = { tests: t.tests, pass: t.pass, fail: t.fail, cancelled: t.cancelled, skipped: t.skipped, fails: t.fails };
fs.writeFileSync(path.join(path.dirname(OUT), 'touched.tap'), t.tap);
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('restored', out.restored, '| row 25 clean', JSON.stringify(out.row25Clean), '| touched', JSON.stringify({ ...out.touched, fails: out.touched.fails.length }));
