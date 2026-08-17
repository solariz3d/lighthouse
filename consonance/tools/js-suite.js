#!/usr/bin/env node
// js-suite.js - run every JS test in the repo, because nothing did.
//
// WHY THIS EXISTS, and it is a measured hole rather than a convenience.
//
// On 2026-08-17 a "lets double check" pass found two red tests on main that nobody was watching:
//   dream-gate.test.js   red for a DAY. sourced-stop.js shipped 2026-08-15; the suite's hook
//                        roster is auto-discovered from install.ps1's manifest while its ENTRY
//                        marker table is hand-maintained, so the new hook was discovered, had no
//                        marker, and the suite THREW rather than skipping. Working as designed -
//                        and unread, because nothing ran it.
//   guard-census.test.js dead longer than that, dying ENOENT on load against
//                        C:/Users/nname/Desktop/... - another machine's absolute paths.
//
// The asymmetry is the whole finding: the Rust suite gets run constantly, so a 261-vs-267
// discrepancy was caught within minutes. The JS suites got run by nobody, so a red sat for a day.
// Both defects that week were found by a human noticing, not by an instrument.
//
// TWO DESIGN RULES, both taken from what failed:
//   1. DISCOVER, never enumerate. dream-gate's own comment says it best: a hand-kept list can only
//      check what someone remembered to add, and the file added next month is by definition not on
//      it. This walks the tree.
//   2. A GREEN RUN OVER ZERO TESTS IS THE BUG. If discovery returns nothing, this exits non-zero
//      and says so, rather than printing a clean summary of an empty set.
//
// It reports more than pass/fail, because the states are genuinely different:
//
//   FAILED   reached its summary line; assertions ran and some did not hold.
//   CRASHED  died before its summary. guard-census prints four ok lines and THEN throws ENOENT,
//            so "it printed some assertions" is not evidence they completed - the summary line is.
//            Calling this "1 failed" would imply the rest passed, when they never ran.
//   SILENT   exit 0 and no summary at all: indistinguishable from a file that tests nothing.
//   CANARY   declared expected-red by the test file itself (see below).
//
// THE CANARY, and why it is declared in the TEST rather than in a list here. actors.test.js has
// been red on purpose for weeks - it stays red until the 15-item alias worklist is curated with
// board evidence only the keeper has. That fact lived in a journal, so nothing running the file
// could tell a deliberate red from a broken one, and a permanently-red channel is the one A
// warned about: fire constantly and you train the reader to skip it.
//
// A file declares itself by containing the marker `JS-SUITE: EXPECTED-RED`. Keeping it in the file
// means the declaration travels with the artifact and dies when someone fixes the test, instead of
// rotting in a roster here - the same reason discovery walks the tree.
//
// AND AN EXPECTED-RED THAT GOES GREEN IS ITSELF A FAILURE. The canary singing means the condition
// it was waiting on has been met and someone owes the file an edit; letting that pass silently
// would leave a stale exemption suppressing a real red later.
//
// Usage:
//   node js-suite.js              run everything, exit non-zero if anything is not green
//   node js-suite.js --list       show what would run, run nothing
//   node js-suite.js --quiet      summary only

'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// JS_SUITE_ROOT exists so this runner can be pointed at a fixture tree and tested like anything
// else. A test runner that is itself untested is the oldest version of the vacuity problem here.
const ROOT = process.env.JS_SUITE_ROOT || path.resolve(__dirname, '..', '..');
const SKIP_DIRS = new Set(['node_modules', '.git', 'target', 'gen', '__pycache__', 'attic']);
const TIMEOUT_MS = Number(process.env.JS_SUITE_TIMEOUT_MS || 120000);

function discover(dir, out = []) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      discover(p, out);
    } else if (e.isFile() && e.name.endsWith('.test.js')) {
      out.push(p);
    }
  }
  return out;
}

const files = discover(ROOT).sort();

if (process.argv.includes('--list')) {
  files.forEach((f) => console.log(path.relative(ROOT, f)));
  console.log(`\n${files.length} test files`);
  process.exit(files.length ? 0 : 1);
}

// A green run over an empty set is strictly worse than no runner at all: it reports confidence
// that was never measured. This is the same vacuity lesson arch_test and dream-gate both record.
if (!files.length) {
  console.error('js-suite: discovered ZERO test files under ' + ROOT);
  console.error('That is a broken walker, not a clean repo. Refusing to report a passing suite.');
  process.exit(2);
}

const quiet = process.argv.includes('--quiet');
const green = [], failed = [], crashed = [], silent = [], canary = [], canarySang = [];

// The summary line, in the shapes this repo actually emits - MEASURED, not assumed. The first
// version of this regex knew only the hand-rolled "N passed, M failed" form and filed fifteen
// healthy node:test suites as SILENT, which would have been a runner reporting a hole that was
// really its own ignorance. node:test ends with "ℹ pass N / ℹ fail N"; the hand-rolled harnesses
// end with "name: N passed, M failed". Reaching either is the evidence a run COMPLETED; assertion
// lines above it prove only that it started.
// ANSI is stripped before matching rather than matched around: node:test colours its summary, so
// the escape sits BEFORE the marker and any regex clever enough to step over it is a regex nobody
// will be able to fix later.
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
// THREE shapes, all found by measuring rather than assuming — twice this regex was the defect and
// the tests were fine. v1 knew only "N passed, M failed" and filed fifteen healthy node:test
// suites as SILENT. v2 still missed prompt-events.test.js, which runs 16 real assertions and ends
// with a bare "16 passed". A runner reporting a hole that is really its own ignorance is worse
// than no runner, so each shape here was read off actual output.
const SUMMARY = /(\d+\s+passed,\s*\d+\s+failed)|(test result:)|(^\s*[ℹ#]\s*fail\s+\d+)|(^\s*\d+\s+passed\s*$)/im;

// A SUMMARY THAT COUNTS ZERO PASSES IS NOT A COMPLETED RUN (pane A, 2026-08-17). "0 passed",
// "0 passed, 0 failed" and "ℹ pass 0" all satisfy SUMMARY while proving nothing ran - which is the
// definition of SILENT, not of green. Vacuity that reports itself in the right format is still
// vacuity, and this repo has caught it three times in other instruments.
// BOTH counts must be zero. The first version of this matched "0 passed" anywhere and therefore
// swallowed "0 passed, 1 failed" — a genuinely completed run in which one test ran and failed —
// reclassifying real failures as vacuous. Caught by this file's own canary test within a minute of
// being written. Zero passes with a nonzero failure count is a RESULT; zero of both is a no-op.
const VACUOUS = /(^\s*0\s+passed\s*$)|(\b0\s+passed,\s*0\s+failed)|(^\s*[ℹ#]\s*pass\s+0\s*$)/im;
const VACUOUS_NODETEST = /^\s*[ℹ#]\s*fail\s+0\s*$/im;

// ANCHORED, and this is a defect repair rather than a tidy-up. v1 matched the marker ANYWHERE in a
// file's bytes, so js-suite.test.js - which necessarily quotes the marker inside its fixture
// strings - declared ITSELF expected-red, went green, and tripped CANARY SANG. The runner failed
// on itself at the very commit that shipped it. Two independent narrowings, because one was not
// enough to have caught this: the marker must open a comment at line start, AND appear in the
// file's header rather than deep in its body.
//
// CORRECTED 2026-08-17 by pane A, who wrote the finding: "one was not enough" is FALSE for the
// demonstrated instance. The fixtures quote the marker mid-line inside strings (the line-start
// anchor alone catches that) AND at lines past 40 (the header window alone catches that). Either
// narrowing would have caught THIS case. Two is defence in depth against the next quoting site,
// not a necessity for the one that shipped — and overstating it made the repair sound more forced
// than the evidence supports.
const EXPECTED_RED = /^\s*(\/\/|#)\s*JS-SUITE:\s*EXPECTED-RED/m;
const HEADER_LINES = 40;
function declaresExpectedRed(file) {
  try {
    const head = fs.readFileSync(file, 'utf8').split('\n').slice(0, HEADER_LINES).join('\n');
    return EXPECTED_RED.test(head);
  } catch { return false; }   // unreadable is not red
}

for (const f of files) {
  const rel = path.relative(ROOT, f);
  const declaredRed = declaresExpectedRed(f);
  let code = 0, out = '', err = '';
  try {
    out = execFileSync(process.execPath, [f], {
      cwd: path.dirname(f), encoding: 'utf8', timeout: TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e) {
    code = e.status === undefined || e.status === null ? 'timeout/signal' : e.status;
    out = e.stdout || '';
    err = e.stderr || '';
  }
  const clean = stripAnsi(out);
  // node:test prints pass and fail on separate lines, so "nothing ran" there is pass 0 AND fail 0.
  const vacuous = /^\s*[ℹ#]\s*pass\s+0\s*$/im.test(clean)
    ? VACUOUS_NODETEST.test(clean)
    : VACUOUS.test(clean);
  const completed = SUMMARY.test(clean) && !vacuous;
  const entry = { rel, code, out, err };
  let tag;
  if (declaredRed) {
    // A CANARY IS NOT AN EXEMPTION FROM CLASSIFICATION (pane A). v1 routed every declared file
    // straight to the canary bucket, so a canary that started CRASHING on load - guard-census-style
    // ENOENT, or a syntax error - read identically to the deliberate red it was declared for. That
    // is the suppression bucket the declaration was supposed to avoid being, and it contradicts the
    // room's own ratified principle that red is not one thing: only a failing NAMED assertion
    // counts. So a declared file still has to reach its summary to be excused.
    if (code === 0) { canarySang.push(entry); tag = 'SANG '; }
    else if (completed) { canary.push(entry); tag = 'canary'; }
    else { crashed.push(entry); tag = 'CRASH'; }
  } else if (code === 0) {
    if (completed) { green.push(entry); tag = ' ok  '; }
    else { silent.push(entry); tag = 'SILENT'; }
  } else if (completed) {
    failed.push(entry); tag = 'FAIL ';
  } else {
    crashed.push(entry); tag = 'CRASH';
  }
  if (!quiet) console.log(`${tag}  ${rel}${code === 0 ? '' : '  (exit ' + code + ')'}`);
}

console.log(`\njs-suite: ${green.length} green · ${failed.length} failed · ${crashed.length} crashed · ` +
            `${silent.length} silent · ${canary.length} canary  (of ${files.length})`);

for (const e of crashed) {
  console.log(`\nCRASHED — died before its summary, so an unknown number of assertions never ran: ${e.rel}`);
  console.log('  ' + (e.err || e.out).trim().split('\n').slice(-3).join('\n  '));
}
for (const e of failed) {
  console.log(`\nFAILED: ${e.rel}`);
  console.log('  ' + (e.out || e.err).trim().split('\n').slice(-4).join('\n  '));
}
if (silent.length) {
  console.log(`\nSILENT — exit 0 but no completed summary, or a summary counting ZERO passes.`);
  console.log(`Indistinguishable from a file that tests nothing, so it FAILS the run: rule 2 says a`);
  console.log(`green over an empty set is the bug, and that has to hold per file, not just per tree.`);
  console.log(`(This runner's summary regex has already been wrong twice, so a SILENT is at least as`);
  console.log(` likely to be the classifier's ignorance as the test's vacuity — check before editing.)`);
  silent.forEach((e) => console.log('  ' + e.rel));
}
for (const e of canary) {
  console.log(`\ncanary (declared EXPECTED-RED, still red — not counted as a failure): ${e.rel}`);
}
for (const e of canarySang) {
  console.log(`\nCANARY SANG — ${e.rel} is declared EXPECTED-RED and is now GREEN.`);
  console.log('  The condition it was waiting on has been met. Remove the declaration, or it will');
  console.log('  suppress a real failure here later. This counts as a failure until someone does.');
}

// SILENT counts as a failure (pane A). v1 exited 0 over a silent file, which contradicted rule 2
// at file granularity: a green run over an empty set is the bug, and one untested file inside a
// green tree is the same bug at smaller scale. It also meant the NEXT summary-regex miss — and the
// history says one is coming — would file a healthy suite SILENT while the run stayed green,
// hiding the classifier's own defect behind a pass.
process.exit(failed.length || crashed.length || canarySang.length || silent.length ? 1 : 0);
