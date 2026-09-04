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

// ── THE MACHINE-BOUND CLASS ──────────────────────────────────────────────────────────────────
// Added 2026-08-25 with the class. The canary's history is the reason every one of these exists:
// v1 of that bucket routed every declared file into it, so a canary that CRASHED read identically
// to the red it was declared for, and the exemption became a suppression bucket. So the tests
// below are weighted the same way actors.test.js is weighted — most of them are about the class
// FAILING to excuse something, not about it excusing correctly.

// Concatenated for the same reason MARK is: this file must be able to quote the marker without
// declaring itself, and the anchoring that makes that true is a regex with a record here.
//
// FIXTURE_ROOT is the env var these fixtures declare as `root=`. It is NOT CONSONANCE_DATA, on
// purpose: the runner must deny a file's OWN declared root, and a fixture that borrowed the real
// one would pass whether the runner read the declaration or hardcoded the repo's variable.
// HOME_TAG is a tag no machine has, so (f) does not fire in these fixtures unless a test asks it to
// by declaring the tag this machine actually carries.
const MB = '// JS-SUITE:' + ' MACHINE-BOUND';
const BOUND = MB + ' home=NOBODY root=FIXTURE_ROOT — one corpus\n';
const UNIV = 'console.log("JS-SUITE: UNIVERSE 3/3 ids present · rule: a fixture");';
// A REAL gate: it reads its declared root and declines when the corpus is not there. `force` runs
// it regardless. This is the shape the class asks every declarer for.
const REAL_GATE = 'const fs=require("fs"),p=require("path");'
  + 'const root=process.env.FIXTURE_ROOT||"";'
  + 'const ok=root&&fs.existsSync(p.join(root,"corpus.txt"));'
  + 'if(!ok&&process.env.JS_SUITE_UNIVERSE!=="force"){console.log("JS-SUITE: NOT-RUN — a foreign board: no corpus.txt under "+(root||"(unset)"));process.exit(0)}';
// A corpus the REAL_GATE accepts, so a fixture can be "at home" for the duration of one test.
function corpus() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'jssuite-corpus-'));
  fs.writeFileSync(path.join(d, 'corpus.txt'), 'here');
  return d;
}
function runWith(root, env, args = []) {
  try {
    const out = execFileSync(process.execPath, [TOOL, ...args], {
      env: { ...process.env, JS_SUITE_ROOT: root, ...env }, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
    });
    return { code: 0, out, err: '' };
  } catch (e) {
    return { code: e.status, out: e.stdout || '', err: e.stderr || '' };
  }
}
// This machine's tag, read the same way the runner reads it — used only by the (f) test, which is
// skipped rather than faked where no tag is declared. A test that invented a tag would be testing
// its own fixture.
let THIS_TAG = null;
try {
  const v = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8'));
  THIS_TAG = v && v.machine_tag ? String(v.machine_tag).trim() : null;
} catch { /* no config, no home */ }

test('a MACHINE-BOUND file whose universe is present runs and is an ordinary green', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + REAL_GATE + GREEN });
  const r = runWith(root, { FIXTURE_ROOT: corpus() });
  assert.strictEqual(r.code, 0, r.out + r.err);
  assert.ok(/1 green/.test(r.out), r.out);
  assert.ok(/0 not-run/.test(r.out), 'a file that ran is not a NOT-RUN');
  assert.ok(/0 class-error/.test(r.out), r.out);
});

test('a MACHINE-BOUND file whose universe is absent is NOT-RUN and does not fail the run', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + REAL_GATE + FAILING, 'b.test.js': GREEN });
  const r = run(root);                                  // FIXTURE_ROOT unset: the corpus is gone
  assert.strictEqual(r.code, 0, `a foreign corpus is not a defect:\n${r.out}${r.err}`);
  assert.ok(/1 not-run/.test(r.out), r.out);
  assert.ok(/0 failed/.test(r.out), 'the desktop red was never a failure — that is the whole fix');
  assert.ok(/a foreign board/.test(r.out), 'the reason must reach the reader, not just the bucket');
});

// THE UNIVERSE RULE APPLIED TO THE RUNNER'S OWN OUTPUT. "61 green" and "61 green of 62 discovered,
// one declined" are different claims and the old summary could not tell them apart.
test('the run prints how many files ran, how many were NOT-RUN, and the rule that decided', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + REAL_GATE + FAILING, 'b.test.js': GREEN });
  const r = run(root);
  assert.ok(/2 test files discovered · 1 ran assertions to a summary · 1 declared NOT-RUN · 0 neither/.test(r.out),
    `universe line missing or miscounted:\n${r.out}`);
  assert.ok(/rule:/.test(r.out), 'a count with no rule is a number nobody can check');
  assert.ok(/MACHINE-BOUND/.test(r.out), 'the rule must name the thing that decided');
});

// E-4: `ran` was `discovered - notRun`, so anything that died still reported as having run — the
// direction that claims more coverage than exists, in the print built to stop exactly that.
test('a file that CRASHED is not counted among the files that ran', () => {
  const root = tree({ 'a.test.js': CRASHING, 'b.test.js': GREEN });
  const r = run(root);
  assert.ok(/2 test files discovered · 1 ran assertions to a summary · 0 declared NOT-RUN · 1 neither/.test(r.out),
    `a crash is not a run:\n${r.out}`);
});

// E-4: the counting line omitted canarySang entirely, so the buckets did not sum to the total and
// two of three files could vanish from a summary that still read as complete.
test('every discovered file appears in exactly one bucket on the counting line', () => {
  const root = tree({
    'sang.test.js': MARK + GREEN,                        // canary that went green
    'inert.test.js': BOUND + UNIV + GREEN,               // MACHINE-BOUND with no gate
    'plain.test.js': GREEN,
  });
  const r = run(root);
  const m = /js-suite: (\d+) green · (\d+) failed · (\d+) crashed · (\d+) silent · (\d+) canary · (\d+) sang · (\d+) not-run · (\d+) class-error  \(of (\d+)\)/.exec(r.out);
  assert.ok(m, `counting line not in the expected shape:\n${r.out}`);
  const n = m.slice(1).map(Number);
  const total = n.pop();
  assert.strictEqual(n.reduce((a, b) => a + b, 0), total,
    `buckets must sum to the discovered count, got ${n.join('+')} of ${total}:\n${r.out}`);
  assert.ok(!/BUCKETS DO NOT RECONCILE/.test(r.out + r.err), r.out + r.err);
});

// (a) THE CLASS BUYS A NOT-RUN, NEVER A RED. This is the canary lesson transplanted: a declared
// file that actually fails still fails.
test('a MACHINE-BOUND file that RUNS and fails is FAILED, not excused', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + REAL_GATE + FAILING });
  const r = runWith(root, { FIXTURE_ROOT: corpus() });
  assert.strictEqual(r.code, 1, 'the declaration is not a licence to be red where it can run');
  assert.ok(/1 failed/.test(r.out), r.out);
  assert.ok(/0 not-run/.test(r.out), 'it must not land in the exemption bucket');
});

test('a MACHINE-BOUND file that CRASHES is CRASHED, not excused', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + REAL_GATE + CRASHING });
  const r = runWith(root, { FIXTURE_ROOT: corpus() });
  assert.strictEqual(r.code, 1);
  assert.ok(/1 crashed/.test(r.out), `expected crashed, got:\n${r.out}`);
  assert.ok(/0 not-run/.test(r.out), 'dying on load is not the same as a foreign corpus');
});

// (d) GATE INERT — the mirror of the guard that is green over a surface it cannot see. A universe
// gate that never says no has measured nothing.
test('a MACHINE-BOUND file with no gate at all fails as GATE INERT', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + GREEN });
  const r = runWith(root, { FIXTURE_ROOT: corpus() });
  assert.strictEqual(r.code, 1, 'an unprobeable gate must not pass as a green');
  assert.ok(/GATE INERT/.test(r.out), r.out);
  assert.ok(/1 class-error/.test(r.out), r.out);
  assert.ok(/0 green/.test(r.out), 'its green is exactly what is not believed');
});

// E-2, AND IT IS THE REASON (d) NO LONGER USES A FLAG. v1 denied the universe with
// JS_SUITE_UNIVERSE=deny and asked the file to honour it, which probes the file's handling of the
// runner's own knob. Pane E's fifteen-line file honoured the knob perfectly, asked no corpus
// question anywhere, and passed. It is the HONEST way to satisfy such a requirement, which is worse
// than the malicious one. The runner now takes the corpus away instead.
test("a gate that only honours the runner's flag, and reads no corpus, fails as GATE INERT", () => {
  const KNOB_ONLY = 'if(process.env.JS_SUITE_UNIVERSE==="deny"){console.log("JS-SUITE: NOT-RUN — denied");process.exit(0)}';
  const root = tree({ 'a.test.js': BOUND + UNIV + KNOB_ONLY + GREEN });
  const r = runWith(root, { FIXTURE_ROOT: corpus() });
  assert.strictEqual(r.code, 1, 'honouring the knob is not having a gate');
  assert.ok(/GATE INERT/.test(r.out), r.out);
  assert.ok(/FIXTURE_ROOT/.test(r.out), 'the error must name the root it redirected, so the author can see the probe');
});

// (e) GATE TOO STRICT — a MACHINE-BOUND file must not read NOT-RUN where it CAN run. The reachable
// half of that is proved here; the other half is (f).
test('a NOT-RUN whose assertions PASS under force fails as GATE TOO STRICT', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + REAL_GATE + GREEN });
  const r = run(root);                                  // corpus absent, but the assertions do not need it
  assert.strictEqual(r.code, 1, 'if it passes here, it could have run here');
  assert.ok(/GATE TOO STRICT/.test(r.out), r.out);
  assert.ok(/0 not-run/.test(r.out), 'a skip that was hiding a runnable green is not an exemption');
});

test('a NOT-RUN whose forced run is RED is still NOT-RUN, and the forced result is printed', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + REAL_GATE + FAILING });
  const r = run(root);
  assert.strictEqual(r.code, 0);
  assert.ok(/1 not-run/.test(r.out), r.out);
  assert.ok(/forced:\s+with JS_SUITE_UNIVERSE=force it exits 1/.test(r.out),
    `the forced outcome must be shown, not swallowed:\n${r.out}`);
  assert.ok(/nothing about its health is claimed/.test(r.out),
    'a NOT-RUN must never be readable as a pass — that is the false-green this class exists to avoid');
});

// (f) DECLINED AT HOME — E-1, and the only place the runner can tell a foreign corpus from a
// damaged one. Away from home a red under force is ambiguous; at home there is nothing to be
// ambiguous about, so declining is a defect. This is the CANARY SANG rule turned the other way up.
test('a NOT-RUN on the machine the file calls home is a class error', () => {
  if (!THIS_TAG) { console.log('  ---- (f) not exercised: this machine declares no machine_tag'); return; }
  const root = tree({ 'a.test.js': MB + ` home=${THIS_TAG} root=FIXTURE_ROOT\n` + UNIV + REAL_GATE + GREEN });
  const r = run(root);                                  // corpus absent ON THE MACHINE THAT OWNS IT
  assert.strictEqual(r.code, 1, 'at home there is no foreign-corpus reading available');
  assert.ok(/DECLINED AT HOME/.test(r.out), r.out);
  assert.ok(/0 not-run/.test(r.out), 'the exemption is not available on the owning machine');
});

test('the same file away from home is an ordinary NOT-RUN', () => {
  const root = tree({ 'a.test.js': MB + ' home=NOBODY root=FIXTURE_ROOT\n' + UNIV + REAL_GATE + FAILING });
  const r = run(root);
  assert.strictEqual(r.code, 0, 'the home rule must fire on ONE machine, not everywhere');
  assert.ok(/1 not-run/.test(r.out), r.out);
});

// (g) An unprobeable declaration is not a declaration.
test('a MACHINE-BOUND declaration missing root= or home= is a class error', () => {
  for (const [why, head] of [
    ['neither', MB + '\n'],
    ['no root', MB + ' home=NOBODY\n'],
    ['no home', MB + ' root=FIXTURE_ROOT\n'],
  ]) {
    const root = tree({ 'a.test.js': head + UNIV + REAL_GATE + GREEN });
    const r = run(root);
    assert.strictEqual(r.code, 1, `${why}: an unprobeable declaration must not be honoured\n${r.out}`);
    assert.ok(/declares MACHINE-BOUND without/.test(r.out), `${why}:\n${r.out}`);
  }
});

// (b) and (c) — the two ways a declaration could be used to go quiet.
test('a MACHINE-BOUND file that prints no UNIVERSE line is a class error', () => {
  const root = tree({ 'a.test.js': BOUND + 'console.log("JS-SUITE: NOT-RUN — a foreign board");' });
  const r = run(root);
  assert.strictEqual(r.code, 1, 'silence about the corpus is the defect being fixed');
  assert.ok(/no `JS-SUITE: UNIVERSE` line/.test(r.out), r.out);
});

test('a NOT-RUN with an empty reason is a class error', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + 'console.log("JS-SUITE: NOT-RUN");' });
  const r = run(root);
  assert.strictEqual(r.code, 1, '"it did not run" without "because" is an unaccountable skip');
  assert.ok(/EMPTY reason/.test(r.out), r.out);
});

test('claiming NOT-RUN while ALSO completing a run is a class error', () => {
  const root = tree({ 'a.test.js': BOUND + UNIV + 'console.log("JS-SUITE: NOT-RUN — partly");' + GREEN });
  const r = run(root);
  assert.strictEqual(r.code, 1, 'half a run under a whole exemption is where a red would hide');
  assert.ok(/claims NOT-RUN and ALSO completed a run/.test(r.out), r.out);
});

test('declaring BOTH classes is refused rather than resolved by precedence', () => {
  const root = tree({ 'a.test.js': BOUND + MARK + UNIV + GREEN });
  const r = run(root);
  assert.strictEqual(r.code, 1);
  assert.ok(/declares BOTH/.test(r.out), r.out);
});

// The same regression the canary already carries, for the new marker: a file that merely QUOTES
// the declaration — every test of this feature must — is an ordinary file.
test('a file that only QUOTES the MACHINE-BOUND marker does not declare itself', () => {
  const root = tree({ 'a.test.js': 'const fixture = "' + MB + '";\n' + GREEN });
  const r = run(root);
  assert.strictEqual(r.code, 0, `a quoting file is an ordinary green:\n${r.out}`);
  assert.ok(/1 green/.test(r.out), r.out);
  assert.ok(/0 not-run/.test(r.out), 'quoting the marker must not declare the file');
});

test('the MACHINE-BOUND marker below the header window does not declare the file', () => {
  const root = tree({ 'a.test.js': '//\n'.repeat(60) + BOUND + UNIV + REAL_GATE + FAILING });
  const r = run(root);
  assert.strictEqual(r.code, 1, 'an undeclared file that exits 1 is a plain failure');
  assert.ok(/0 not-run/.test(r.out), 'a marker 60 lines down is not a header declaration');
});

// The runtime markers are LINE-START markers, for the same reason the header markers are anchored:
// a file that mentions the phrase inside a sentence it prints — a test name, a doc line, an error
// message quoting this contract — must not thereby declare its own run void. Found by mutation:
// unanchoring NOT_RUN_LINE left every test green, so this case was untested until it wasn't.
test('a NOT-RUN mentioned mid-line in output is prose, not a declaration', () => {
  const root = tree({
    'a.test.js': BOUND + UNIV + REAL_GATE
      + 'console.log("the contract says JS-SUITE: NOT-RUN — with a reason");' + GREEN,
  });
  const r = runWith(root, { FIXTURE_ROOT: corpus() });
  assert.strictEqual(r.code, 0, `mentioning the marker must not void the run:\n${r.out}${r.err}`);
  assert.ok(/1 green/.test(r.out), r.out);
  assert.ok(/0 not-run/.test(r.out), 'the file ran; it merely talked about not running');
  assert.ok(/0 class-error/.test(r.out), r.out);
});

// An undeclared file printing the runtime lines must gain nothing from them: the class is a
// HEADER declaration, and the output markers are what a declared file owes, not a way in.
test('an UNDECLARED file printing NOT-RUN gets no exemption from it', () => {
  const root = tree({ 'a.test.js': UNIV + 'console.log("JS-SUITE: NOT-RUN — nice try");' + FAILING });
  const r = run(root);
  assert.strictEqual(r.code, 1, 'the runtime marker is not a back door into the class');
  assert.ok(/1 failed/.test(r.out), r.out);
  assert.ok(/0 not-run/.test(r.out), r.out);
});

// ── THE DOCSTRING IS A CARRIER, AND IT HAD DRIFTED FROM THE CODE (2026-09-04) ────────────────────
//
// Found by pane B on 2026-09-03 while landing `gen-consumer.fixture-scope.test.js`
// (`handback/P-GEN-RED-FIRST_2026-09-03.md`): it declared the canary inside a block comment as
// ` * JS-SUITE:' + ' EXPECTED-RED`, the runner read the file as FAILED with `0 canary`, and B only
// found out by running the suite. The header says a file declares itself "by CONTAINING the
// marker". The code requires more, in TWO ways, and the header named neither:
//
//     EXPECTED_RED   the LINE must start with // or #
//     HEADER_LINES   only the first N lines are read
//
// Both are already tested behaviourally two tests up. The gap was never the code; it was that the
// sentence a seat READS before writing a declaration described a looser rule than the one enforced.
// B correctly did not take it — not B's file.
//
// A TEST RATHER THAN JUST AN EDIT, because an edited comment drifts again the moment either
// constant moves. This reads both values out of the source and requires the prose to carry them —
// the same coupling `lap-row.test.js` uses on the documents that quote its `--entry` vocabulary.
// Widen the window to 60 or drop the line anchor, and the SENTENCE goes red.

test('CARRIER: the header describes the marker rule the code actually enforces', () => {
  const src = fs.readFileSync(TOOL, 'utf8');

  const win = src.match(/^const HEADER_LINES = (\d+);/m);
  assert.ok(win, 'HEADER_LINES is no longer a top-level const; this test cannot read the code it guards');
  // Checked as a literal substring rather than a regex-about-a-regex: the first draft of this line
  // WAS a regex about a regex, it was wrong, and it failed claiming the CODE had changed when the
  // only thing broken was the test's escaping. A guard that misreports its subject is worse than no
  // guard — which is the finding this whole packet is landing, one level up.
  const anchor = src.match(/^const EXPECTED_RED = (\S+);/m);
  assert.ok(anchor, 'EXPECTED_RED is no longer a top-level const');
  assert.ok(anchor[1].startsWith('/^\\s*(') && anchor[1].includes('#'),
    `EXPECTED_RED is no longer anchored to a line starting // or #  (${anchor[1]}); the prose this test demands may now be the wrong prose`);

  const para = src.split('\n').filter((l) => /^\/\/ /.test(l)).join('\n')
    .match(/^\/\/ A file declares itself[\s\S]*?(?=\n\/\/ *$|\n\/\/ [A-Z]{2,})/m);
  assert.ok(para, 'the "A file declares itself" paragraph is gone; find where the rule is stated now');
  const t = para[0];

  assert.ok(/own line|starts? with|beginning of the line/i.test(t),
    'the paragraph must say the marker needs its OWN LINE beginning // or #. It said only "by ' +
    'containing the marker", and a block-comment declaration was read as a plain FAILED on ' +
    '2026-09-03. A docstring looser than its code is a trap laid for the next seat.');
  assert.ok(t.includes(win[1]),
    `the paragraph must name the header window (${win[1]} lines) — a marker below it does not declare ` +
    'the file and nothing in the prose said so. Update the sentence when HEADER_LINES changes.');
});

test('CARRIER: the two narrowings the paragraph names are the two the runner applies', () => {
  // Prose is only worth trusting when it is checked against BEHAVIOUR, not against itself. Both
  // cases have behavioural tests above; this pins them to the paragraph's two claims, so a third
  // narrowing cannot be added without the sentence going red.
  // Marker built by concatenation, for the reason MARK is: a literal here declares THIS file.
  const M = 'JS-SUITE:' + ' EXPECTED-RED';
  const block = tree({ 'a.test.js': `/*\n * ${M}\n */\n${FAILING}` });
  assert.match(run(block).out, /0 canary/,
    'a marker inside a block comment must not declare the file — the 2026-09-03 case');

  const below = tree({ 'b.test.js': '// pad\n'.repeat(Number(fs.readFileSync(TOOL, 'utf8')
    .match(/^const HEADER_LINES = (\d+);/m)[1]) + 5) + `// ${M}\n${FAILING}` });
  assert.match(run(below).out, /0 canary/,
    'a marker below the header window must not declare the file');
});

console.log(`\njs-suite-self: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
