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
const EXPECTED_RED = /JS-SUITE:\s*EXPECTED-RED/;

for (const f of files) {
  const rel = path.relative(ROOT, f);
  let declaredRed = false;
  try { declaredRed = EXPECTED_RED.test(fs.readFileSync(f, 'utf8')); } catch { /* unreadable is not red */ }
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
  const completed = SUMMARY.test(stripAnsi(out));
  const entry = { rel, code, out, err };
  let tag;
  if (declaredRed) {
    if (code === 0) { canarySang.push(entry); tag = 'SANG '; }
    else { canary.push(entry); tag = 'canary'; }
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
  console.log(`\nSILENT (exit 0, never reached a summary — indistinguishable from a file that tests nothing):`);
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

process.exit(failed.length || crashed.length || canarySang.length ? 1 : 0);
