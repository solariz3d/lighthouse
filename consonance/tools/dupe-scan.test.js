'use strict';
// dupe-scan.test.js — node --test consonance/tools/dupe-scan.test.js. dupe-scan.js finds blocks of code written twice: an exact copy is one cluster at the
// right lines in each place; a copy with its names changed is found only by the renamed pass; a run of closing braces is not a duplicate; test files are
// reported apart (a test/ folder, a .test.js or .mutants.js name); comments are dropped and literals normalised; a bad argument is refused.
// Every row runs on a sandbox under scratch.js (removed at exit).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const DS = require('./dupe-scan.js');
const scratch = require('./scratch.js');

const TOOL = path.join(__dirname, 'dupe-scan.js');
/** Twelve lines of real-looking code whose names start with `n`. */
const block = (n) => Array.from({ length: 12 }, (_, k) => `  const ${n}${k} = compute('${k}', value${k} * 2 + offset, { mode: ${k} }); total += ${n}${k};`).join('\n');
function sandbox(files) {
  const root = scratch.mkdtemp('dupe-scan-test-');
  for (const [rel, text] of Object.entries(files)) { const p = path.join(root, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); }
  return root;
}
const run = (trees, opts = {}) => {
  const res = { lit: DS.scan(trees, { lines: 8, renamed: false, testRe: /(^|[\\/])test[\\/]|\.(test|mutants)\.(c|m)?js$/, ...opts }), ren: DS.scan(trees, { lines: 8, renamed: true, testRe: /(^|[\\/])test[\\/]|\.(test|mutants)\.(c|m)?js$/, ...opts }) };
  return { ...res, shares: DS.shares(res.lit.files), renamed: DS.shares(res.ren.files) };
};

test('an exact copy, shifted by comments and blank lines, is one cluster at the right lines in each place', () => {
  const root = sandbox({ 'a/one.js': `// head\nfunction a() {\n${block('x')}\n}\n`, 'b/two.js': `// other\n\n\nlet q = 1;\n// a comment\nfunction b() {\n${block('x')}\n}\n` });
  const r = run([{ label: 'A', dirs: [path.join(root, 'a')] }, { label: 'B', dirs: [path.join(root, 'b')] }]);
  assert.equal(r.lit.clusters.length, 1);
  assert.deepEqual(r.lit.clusters[0].members.map((m) => [m.file, m.from, m.to]).sort(), [['a/one.js', 3, 15], ['b/two.js', 7, 19]]);
  assert.deepEqual([r.shares.overall.all.codeLines, r.shares.overall.all.dupLines], [29, 26]);
});

test('a copy with its names changed is not counted as written, and the renamed pass finds it in all three places', () => {
  const root = sandbox({ 'a/one.js': `function a() {\n${block('x')}\n}\n`, 'a/two.js': `function b() {\n${block('x')}\n}\n`, 'a/three.js': `function c() {\n${block('zz')}\n}\n` });
  const r = run([{ label: 'A', dirs: [path.join(root, 'a')] }]);
  assert.equal(r.lit.clusters.length, 1); assert.equal(r.lit.clusters[0].places, 2, 'as written: the two exact copies');
  assert.ok(!r.lit.clusters[0].members.some((m) => m.file === 'a/three.js'));
  assert.equal(r.ren.clusters[0].places, 3, 'renamed: all three');
  assert.ok(r.renamed.overall.all.dupLines > r.shares.overall.all.dupLines);
});

test('a run of closing braces and other low-information lines is not a duplicate', () => {
  const braces = Array.from({ length: 30 }, () => '}').join('\n'), calls = Array.from({ length: 30 }, (_, k) => `f(${k});`).join('\n');
  const root = sandbox({ 'a/one.js': `${braces}\n${calls}\n`, 'a/two.js': `${braces}\n${calls}\n` });
  const r = run([{ label: 'A', dirs: [path.join(root, 'a')] }]);
  assert.equal(r.lit.clusters.length, 0); assert.equal(r.shares.overall.all.dupLines, 0);
});

test('test code is reported apart: a test/ folder, a .test.js name and a .mutants.js name, beside code that is not', () => {
  const root = sandbox({ 'tools/x.js': `function a() {\n${block('x')}\n}\n`, 'tools/x.test.js': `function b() {\n${block('x')}\n}\n`, 'tools/x.mutants.js': `function c() {\n${block('x')}\n}\n`, 'tools/test/y.js': `function d() {\n${block('x')}\n}\n` });
  // through the command line with no --test, so it is the tool's own default that decides
  const out = spawnSync(process.execPath, [TOOL, 'T=' + path.join(root, 'tools'), '--json'], { encoding: 'utf8' });
  assert.equal(out.status, 0, out.stderr);
  const r = JSON.parse(out.stdout);
  assert.deepEqual([r.shares.T.code.files, r.shares.T.test.files], [1, 3], 'one code file, three test files');
  const tagged = Object.fromEntries(r.clusters.flatMap((c) => c.members).map((m) => [m.file, m.test]));
  assert.deepEqual(tagged, { 'tools/x.js': false, 'tools/x.test.js': true, 'tools/x.mutants.js': true, 'tools/test/y.js': true });
});

test('lineTokens drops comments, reads a string or number as one token, and keeps a line for every source line', () => {
  const t = DS.lineTokens('a = "x" + 12; // gone\n/* gone\n still */ b(`t\nu`, 0x1f);\n', false);
  assert.deepEqual(t, ['a = S + N ;', '', 'b (', 'S , N ) ;', '']);   // a literal over two lines is one token, on the line where it closes
  assert.deepEqual(DS.lineTokens('const total = count + 1;', true), ['const I = I + N ;'], 'renamed: names are I, keywords stay');
});

test('the command line refuses a folder that is not there and an argument that is not label=dir', () => {
  for (const args of [['A=' + path.join(scratch.mkdtemp('dupe-scan-test-'), 'nope')], ['just-a-word'], []]) {
    const r = spawnSync(process.execPath, [TOOL, ...args], { encoding: 'utf8' });
    assert.equal(r.status, 1, `${args.join(' ')}: ${r.stderr}`); assert.match(r.stderr, /^dupe-scan: /);
  }
});

test('a pattern that repeats every few lines is not a copy of itself where its two places overlap', () => {
  const five = ['alpha.one(first, second, third);', 'beta.two(first, second, third);', 'gamma.three(first, second, third);', 'delta.four(first, second, third);', 'eps.five(first, second, third);'];
  const root = sandbox({ 'a/one.js': Array.from({ length: 14 }, (_, k) => five[k % 5]).join('\n') + '\n' });   // 7 windows; those 5 apart are the same (0 and 5, 1 and 6), and each such pair overlaps (5 < 8)
  const r = run([{ label: 'A', dirs: [path.join(root, 'a')] }]);
  assert.equal(r.shares.overall.all.dupLines, 0); assert.equal(r.lit.clusters.length, 0);
});
