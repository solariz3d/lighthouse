// js-suite.test.js - run with: node js-suite.test.js
//
// A test runner that is itself untested is the oldest version of the vacuity problem this repo
// keeps finding. Each test below builds a fixture tree of throwaway .test.js files and points the
// runner at it with JS_SUITE_ROOT, so the classification is exercised on real subprocess exits
// rather than on a mocked idea of one.
//
// The load-bearing cases are the ones where a WRONG classification would be invisible:
//   - zero discovered must REFUSE, never print a clean summary of an empty set
//   - crashed-vs-failed, because guard-census prints four ok lines and then dies, and calling that
//     "1 failed" implies the rest passed when they never ran
//   - a declared canary that goes GREEN must fail the run, or the exemption outlives its reason

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

let pass = 0, fail = 0;
function test(name, fn) {
  try { fn(); console.log(`  ok   ${name}`); pass++; }
  catch (e) { console.log(`  FAIL ${name}\n       ${e.message}`); fail++; }
}

const TOOL = path.join(__dirname, 'js-suite.js');

function tree(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'jssuite-'));
  for (const [rel, body] of Object.entries(files)) {
    const p = path.join(dir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, body);
  }
  return dir;
}
function run(root, args = []) {
  try {
    const out = execFileSync(process.execPath, [TOOL, ...args], {
      env: { ...process.env, JS_SUITE_ROOT: root }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out, err: '' };
  } catch (e) {
    return { code: e.status, out: e.stdout || '', err: e.stderr || '' };
  }
}

const GREEN = 'console.log("  ok  a thing");console.log("1 passed, 0 failed");';
const FAILING = 'console.log("  FAIL a thing");console.log("0 passed, 1 failed");process.exit(1);';
const CRASHING = 'console.log("  ok  a thing");throw new Error("ENOENT: no such file");';
const NOSUMMARY = 'console.log("did some work quietly");';
const VACUOUS = 'console.log("0 passed, 0 failed");';

// BUILT BY CONCATENATION ON PURPOSE. Writing the marker as one literal is what broke the runner:
// v1 matched it anywhere in a file's bytes, so this very file declared ITSELF expected-red, went
// green, and tripped CANARY SANG at the commit that shipped it. The runner is now anchored, so
// this is belt-and-braces — but the anchoring is a regex and regexes here have a record.
const MARK = '// JS-SUITE:' + ' EXPECTED-RED — waiting on the keeper\n';

test('a tree with NO test files is refused, not reported green', () => {
  const root = tree({ 'readme.md': 'nothing here' });
  const r = run(root);
  assert.strictEqual(r.code, 2, 'must exit 2, not 0');
  assert.ok(/ZERO test files/i.test(r.err), 'must say it found none');
  assert.ok(/Refusing/i.test(r.err), 'must refuse rather than summarise an empty set');
});

test('a passing file is green and the run exits 0', () => {
  const root = tree({ 'a.test.js': GREEN });
  const r = run(root);
  assert.strictEqual(r.code, 0, `expected exit 0, got ${r.code}:\n${r.out}${r.err}`);
  assert.ok(/1 green/.test(r.out), r.out);
});

test('a file that reaches its summary and fails is FAILED, not crashed', () => {
  const root = tree({ 'a.test.js': FAILING });
  const r = run(root);
  assert.strictEqual(r.code, 1);
  assert.ok(/1 failed/.test(r.out), r.out);
  assert.ok(/0 crashed/.test(r.out), 'reaching the summary means it is not a crash');
});

test('a file that prints assertions then DIES is CRASHED, not failed', () => {
  const root = tree({ 'a.test.js': CRASHING });
  const r = run(root);
  assert.strictEqual(r.code, 1);
  assert.ok(/1 crashed/.test(r.out), `printing "ok" before dying must not read as a completed run:\n${r.out}`);
  assert.ok(/0 failed/.test(r.out), 'an unknown number of assertions never ran — do not imply the rest passed');
});

test('exit 0 with no summary is SILENT — indistinguishable from testing nothing', () => {
  const root = tree({ 'a.test.js': NOSUMMARY });
  const r = run(root);
  assert.ok(/1 silent/.test(r.out), r.out);
  assert.strictEqual(r.code, 1, "SILENT must fail the run");
});

test('a declared EXPECTED-RED file that is red does not fail the run', () => {
  const root = tree({ 'a.test.js': MARK + FAILING });
  const r = run(root);
  assert.strictEqual(r.code, 0, 'a declared canary must not break the build');
  assert.ok(/1 canary/.test(r.out), r.out);
  assert.ok(/0 failed/.test(r.out), 'it must not also be counted as a failure');
});

test('a declared EXPECTED-RED file that goes GREEN fails the run', () => {
  const root = tree({ 'a.test.js': MARK + GREEN });
  const r = run(root);
  assert.strictEqual(r.code, 1, 'the canary singing is a finding, not a pass');
  assert.ok(/CANARY SANG/.test(r.out), r.out);
  assert.ok(/suppress a real failure/.test(r.out), 'must say why a stale exemption is dangerous');
});

// REGRESSION for the defect that shipped: v1 matched the marker anywhere in a file's bytes, so a
// file that merely QUOTES it — every test of this feature must — declared itself.
test('a file that only QUOTES the marker mid-line does not declare itself', () => {
  const root = tree({
    'a.test.js': 'const fixture = "' + '// JS-SUITE:' + ' EXPECTED-RED";\n' + GREEN,
  });
  const r = run(root);
  assert.strictEqual(r.code, 0, `a quoting file is an ordinary green:\n${r.out}`);
  assert.ok(/1 green/.test(r.out), r.out);
  assert.ok(/0 canary/.test(r.out), 'quoting the marker must not declare the file');
  assert.ok(!/SANG/.test(r.out), 'and must not trip the singing-canary failure');
});

// The declaration is a HEADER declaration. Buried far down a file it is neither visible to a
// reader nor distinguishable from a passing mention.
test('the marker below the header window does not declare the file', () => {
  const root = tree({ 'a.test.js': '//\n'.repeat(60) + MARK + FAILING });
  const r = run(root);
  assert.strictEqual(r.code, 1, 'an undeclared failure must fail the run');
  assert.ok(/1 failed/.test(r.out), r.out);
  assert.ok(/0 canary/.test(r.out), 'a marker 60 lines down is not a header declaration');
});

// A canary is an exemption from FAILING, never from being classified.
test('a declared canary that CRASHES is reported as crashed, not excused', () => {
  const root = tree({ 'a.test.js': MARK + CRASHING });
  const r = run(root);
  assert.strictEqual(r.code, 1, 'a canary that died on load is not the red it was declared for');
  assert.ok(/1 crashed/.test(r.out), `expected crashed, got:\n${r.out}`);
  assert.ok(/0 canary/.test(r.out), 'it must not be filed in the suppression bucket');
});

test('a summary counting ZERO passes is SILENT, not green', () => {
  const root = tree({ 'a.test.js': VACUOUS });
  const r = run(root);
  assert.ok(/1 silent/.test(r.out), `"0 passed, 0 failed" is the right format and proves nothing:\n${r.out}`);
  assert.ok(/0 green/.test(r.out), 'vacuity in the correct format is still vacuity');
});

test('a SILENT file fails the run — rule 2 holds per file, not just per tree', () => {
  const root = tree({ 'good.test.js': GREEN, 'quiet.test.js': NOSUMMARY });
  const r = run(root);
  assert.strictEqual(r.code, 1, 'one untested file inside a green tree is the same bug at smaller scale');
});

test('node_modules is not walked', () => {
  const root = tree({ 'a.test.js': GREEN, 'node_modules/dep/b.test.js': FAILING });
  const r = run(root, ['--list']);
  assert.ok(/a\.test\.js/.test(r.out), r.out);
  assert.ok(!/b\.test\.js/.test(r.out), 'a dependency\'s tests are not this repo\'s tests');
  assert.ok(/1 test files/.test(r.out), r.out);
});

test('all three real summary shapes count as completed', () => {
  const root = tree({
    'hand.test.js': 'console.log("x: 3 passed, 0 failed");',
    'nodetest.test.js': 'console.log("\\u2139 pass 3");console.log("\\u2139 fail 0");',
    'bare.test.js': 'console.log("16 passed");',
  });
  const r = run(root);
  assert.strictEqual(r.code, 0, r.out + r.err);
  assert.ok(/3 green/.test(r.out), `all three shapes must be recognised:\n${r.out}`);
  assert.ok(/0 silent/.test(r.out), 'none of these tests nothing — a SILENT here is the regex being wrong');
});

console.log(`\njs-suite-self: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
