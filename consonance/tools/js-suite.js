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
// ── THE MACHINE-BOUND CLASS (2026-08-25) ────────────────────────────────────────────────────────
//
// The mirror of the canary, and it arrived measured. On 2026-08-25 the desktop pulled 683d468 and
// ran this suite: actors.test.js came back a HARD RED. Nothing was broken. The file reads the real
// board at C:/Consonance/data/board.jsonl and greps it for rows posted by seven specific panes; the
// desktop HAS that path and it holds the desktop's own board, so every evidence quote failed to
// grep back. A TRUE CHECK OVER THE WRONG UNIVERSE, REPORTING RED — the exact opposite sign of the
// guard that was green over a surface it could not see.
//
// An existsSync guard cannot catch this, and actors.test.js had four of them. The corpus was
// present. It was the wrong corpus. So the gate has to be a CONTENT question — "is this the
// universe these assertions are about" — and only the file knows how to ask it.
//
// A file declares itself in its header, with two required parameters:
//
//   // JS-SUITE: MACHINE-BOUND home=L root=CONSONANCE_DATA
//
//   root=  the ENV VAR that names the corpus root. The runner denies the universe by pointing this
//          at a fresh empty directory — see (d).
//   home=  the `machine_tag` of the machine that OWNS this corpus, read from ~/.consonance.json and
//          from nowhere else. On that machine a decline is a defect — see (f).
//
// and then owes the runner three things:
//   1. print `JS-SUITE: UNIVERSE <text>` on EVERY run — seen / missing / the rule that decided.
//      Registered 2026-08-25: an instrument that sweeps a corpus prints its universe or is not
//      believed. A MACHINE-BOUND file is nothing but a corpus sweep, so this is not optional.
//   2. where its universe is absent, print `JS-SUITE: NOT-RUN — <reason>`, run no assertions, exit 0
//   3. honour JS_SUITE_UNIVERSE=force by running its assertions regardless of its own gate
//
// AND THE CLASS EXEMPTS FROM FAILING, NEVER FROM CLASSIFICATION — the canary's own lesson, which
// this runner learned by shipping v1 of that bucket broken. Seven ways a MACHINE-BOUND file still
// fails the run, none of which the declaration can suppress:
//   a. NON-ZERO EXIT is classified FAILED/CRASHED exactly as for any other file. The class buys a
//      NOT-RUN, never a red.
//   b. NO UNIVERSE LINE          -> CLASS ERROR. Silence about the corpus is the thing being fixed.
//   c. NOT-RUN + a completed run -> CLASS ERROR. You may not run half your assertions and then
//      claim the corpus was missing; that is where a real red would hide.
//   d. GATE INERT: the runner re-runs every file that claims to have RUN with its declared `root=`
//      pointed at a fresh EMPTY DIRECTORY, and requires it to flip to NOT-RUN.
//   e. GATE TOO STRICT: the runner re-runs every NOT-RUN with JS_SUITE_UNIVERSE=force. If the
//      assertions PASS here, the universe was present and the file skipped a run it could have
//      done. That is the chair's bar: a MACHINE-BOUND file must not read NOT-RUN where it CAN run.
//   f. DECLINED AT HOME: a NOT-RUN on the machine whose `machine_tag` equals the file's `home=`
//      -> CLASS ERROR.
//   g. NO root= / NO home= -> CLASS ERROR. An unprobeable declaration is not a declaration.
//
// (d), (f) AND (g) ARE PANE E'S, 2026-08-25, and each closed a hole v1 shipped with. E attacked the
// class before it was committed and two of its three landing attacks were structural:
//
//   E-2, and it is the sharper one. v1 denied the universe by setting JS_SUITE_UNIVERSE=deny and
//   asking the FILE to honour it. That probes the file's handling of the runner's own knob, not its
//   gate — the abuse condition the chair named, a planted positive drawn from the instrument's own
//   unit. E built a fifteen-line file with NO corpus question anywhere in it, asserting 1+1===2,
//   which honoured the knob and sailed through (d) as an ordinary green. It is not sabotage; it is
//   the most natural way to satisfy the requirement. So the runner now takes the corpus away for
//   real, by redirecting the file's own declared root, and a knob-only gate simply runs and fails.
//
//   E-1: under v1 there was NO MACHINE ANYWHERE on which the gate's own decline could be a failure.
//   (d) proved the gate responds and (e) proved it was not too strict WHERE FORCING SUCCEEDS —
//   and nothing checked it where forcing fails, which is the only place a real defect lives. E
//   proved it live: delete twelve rows from THIS laptop's own board and the file reports NOT-RUN,
//   suite exit 0, with the assertion's own failure message printed as the excuse. `home=` is the
//   answer: on the machine that owns the corpus the file must RUN, and a decline there is a class
//   error. It is the CANARY SANG rule turned the other way up.
//
// WHERE THE LIMIT IS, stated rather than left for the next reader to find. Away from home, (e)
// proves a NOT-RUN was not hiding a GREEN and cannot prove it was not hiding a RED: on a foreign
// corpus the forced run is red too, and "wrong universe" and "real bug" are indistinguishable from
// here. That is why (f) matters — it moves the question to the one machine where it IS decidable.
// So the runner never reports a NOT-RUN as health: it prints the forced outcome beside it and says
// what it does not establish. A file that deliberately lies about its own gate defeats all of this,
// and no runner catches that; the defence there is that the gate is a few lines under review.
//
// Usage:
//   node js-suite.js              run everything, exit non-zero if anything is not green
//   node js-suite.js --list       show what would run, run nothing
//   node js-suite.js --quiet      summary only

'use strict';
const fs = require('fs');
const os = require('os');
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
// The MACHINE-BOUND buckets. notRunFiles is the ONLY non-failing addition: classErr exists so that
// misuse of the exemption is louder than the thing it exempts, not quieter.
const notRunFiles = [], classErr = [];

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
// Same anchoring, and deliberately the same shape: one declaration syntax, one place to fix it if
// the regex is wrong a third time. The trailing capture carries `home=` and `root=`.
const MACHINE_BOUND = /^\s*(?:\/\/|#)\s*JS-SUITE:\s*MACHINE-BOUND\b(.*)$/m;
const HEADER_LINES = 40;
function header(file) {
  try {
    return fs.readFileSync(file, 'utf8').split('\n').slice(0, HEADER_LINES).join('\n');
  } catch { return ''; }      // unreadable is not a declaration
}
function declares(file, re) { return re.test(header(file)); }

// Returns null when undeclared, else { home, root } — either may be null, and a missing one is a
// class error rather than a default. A default here would be the exemption granting itself the
// terms of its own audit.
function machineBoundDecl(file) {
  const m = MACHINE_BOUND.exec(header(file));
  if (!m) return null;
  const rest = m[1] || '';
  return {
    home: (/\bhome=([A-Za-z0-9_-]+)/.exec(rest) || [])[1] || null,
    root: (/\broot=([A-Za-z_][A-Za-z0-9_]*)/.exec(rest) || [])[1] || null,
  };
}

// CONFIG ONLY, and that is load-bearing (pane E). A hostname-derived tag would collide — lap-row.js
// derives `L` from any host whose name starts with an L — and a collision would turn (f) into a red
// suite on an innocent machine. A machine that has not declared a tag is nobody's home.
function machineTag() {
  try {
    const v = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.consonance.json'), 'utf8').replace(/^﻿/, ''));
    const t = v && v.machine_tag != null ? String(v.machine_tag).trim() : '';
    return t || null;
  } catch { return null; }
}
const THIS_MACHINE = machineTag();

// A fresh empty directory per probe, so the deny is a real absence rather than a flag the file is
// trusted to honour.
function emptyDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'js-suite-deny-'));
}

// The two lines a MACHINE-BOUND file speaks to the runner. Matched on OUTPUT, not on source, so
// they are runtime facts rather than declarations — a file can declare its class statically and
// still have to say, every single run, which universe it found.
// The separator is permissive because an em-dash inside a generated file has already cost this repo
// eight silent hours once (the .vbs encoding failure, 2026-07-15). A reason is a reason whether it
// arrives after an em-dash, a hyphen or a colon; what it may NOT be is empty.
const NOT_RUN_LINE = /^[ \t]*JS-SUITE:[ \t]*NOT-RUN\b[ \t]*(?:[-–—:]+[ \t]*)?(.*)$/m;
const UNIVERSE_LINE = /^[ \t]*JS-SUITE:[ \t]*UNIVERSE\b[ \t]*(?:[-–—:]+[ \t]*)?(.*)$/m;

function runFile(f, extraEnv) {
  let code = 0, out = '', err = '';
  try {
    out = execFileSync(process.execPath, [f], {
      cwd: path.dirname(f), encoding: 'utf8', timeout: TIMEOUT_MS,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: extraEnv ? { ...process.env, ...extraEnv } : process.env,
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
  return { code, out, err, clean, completed: SUMMARY.test(clean) && !vacuous };
}

for (const f of files) {
  const rel = path.relative(ROOT, f);
  const declaredRed = declares(f, EXPECTED_RED);
  const decl = machineBoundDecl(f);
  const declaredBound = !!decl;
  const r = runFile(f);
  const { code, out, err, clean, completed } = r;
  const entry = { rel, code, out, err, completed };
  let tag;
  if (declaredRed && declaredBound) {
    // Two classes is not a stronger exemption, it is an unreadable one: which bucket does a red
    // land in, and which rule decided? Refuse rather than pick.
    classErr.push({ ...entry, why: 'declares BOTH EXPECTED-RED and MACHINE-BOUND — pick one; ' +
      'a file with two exemptions has no legible classification' });
    tag = 'CLASS';
  } else if (declaredBound) {
    const notRun = NOT_RUN_LINE.exec(clean);
    const reason = notRun ? notRun[1].trim() : '';
    const universe = UNIVERSE_LINE.exec(clean);
    if (code !== 0) {
      // (a) NO EXEMPTION FROM FAILING. This branch is first on purpose: it is the one the class
      // would be abused to skip, and putting it after any NOT-RUN handling would let a file print
      // the marker on its way out of a genuine crash and be excused for it.
      if (completed) { failed.push(entry); tag = 'FAIL '; }
      else { crashed.push(entry); tag = 'CRASH'; }
    } else if (!decl.root || !decl.home) {
      // (g) An unprobeable declaration is not a declaration. Without root= the runner cannot take
      // the corpus away; without home= there is no machine on which a decline can be wrong, which
      // is the unfalsifiable coat wearing a class system.
      classErr.push({ ...entry, why: 'declares MACHINE-BOUND without ' +
        (!decl.root && !decl.home ? '`root=` or `home=`' : !decl.root ? '`root=`' : '`home=`') +
        '. The form is `// JS-SUITE: MACHINE-BOUND home=<machine_tag> root=<ENV_VAR>`: root names ' +
        'the variable the runner redirects to deny the universe, home names the machine on which ' +
        'declining is a defect. A declaration with neither cannot be checked anywhere' });
      tag = 'CLASS';
    } else if (!universe || !universe[1].trim()) {
      classErr.push({ ...entry, why: 'declares MACHINE-BOUND but printed no `JS-SUITE: UNIVERSE` ' +
        'line — a corpus sweep that will not say which corpus it swept is the defect being fixed' });
      tag = 'CLASS';
    } else if (notRun && !reason) {
      classErr.push({ ...entry, why: 'printed NOT-RUN with an EMPTY reason — "it did not run" ' +
        'without "because" is the skip that hides the next bug' });
      tag = 'CLASS';
    } else if (notRun && completed) {
      classErr.push({ ...entry, why: '(c) claims NOT-RUN and ALSO completed a run with passes. ' +
        'Half a run under a whole exemption is exactly where a red would hide' });
      tag = 'CLASS';
    } else if (notRun && decl.home && THIS_MACHINE && decl.home === THIS_MACHINE) {
      // (f) DECLINED AT HOME (pane E). This is the machine that owns the corpus. A gate that says
      // "not my universe" HERE has either lost its corpus or is eating a real red — E deleted twelve
      // rows from this laptop's own board and watched the file report NOT-RUN with the assertion's
      // own failure message as the excuse, suite exit 0. Both readings are defects, so both fail.
      classErr.push({ ...entry, why: `(f) DECLINED AT HOME — this machine's machine_tag is ` +
        `'${THIS_MACHINE}' and the file declares home=${decl.home}, so this is the machine that ` +
        'OWNS this corpus and the file must run here. It reported NOT-RUN instead: ' + reason });
      tag = 'CLASS';
    } else if (notRun) {
      // (e) GATE TOO STRICT. Force the gate open. If the assertions pass here, the universe was
      // present and the NOT-RUN was a skip, not a fact.
      const forced = runFile(f, { JS_SUITE_UNIVERSE: 'force' });
      if (forced.code === 0 && forced.completed && !NOT_RUN_LINE.test(forced.clean)) {
        classErr.push({ ...entry, why: '(e) GATE TOO STRICT — it reported NOT-RUN, but with ' +
          'JS_SUITE_UNIVERSE=force its assertions RUN AND PASS on this machine. It can run here; ' +
          'the universe gate is wrong, not the corpus' });
        tag = 'CLASS';
      } else if (forced.code === 0 && !forced.completed && !NOT_RUN_LINE.test(forced.clean)) {
        classErr.push({ ...entry, why: '(4) it ignores JS_SUITE_UNIVERSE=force — forced, it ' +
          'neither ran assertions nor reported NOT-RUN, so its gate cannot be probed at all' });
        tag = 'CLASS';
      } else {
        notRunFiles.push({ ...entry, reason, universe: universe[1].trim(), forced });
        tag = 'NOTRUN';
      }
    } else if (!completed) {
      silent.push(entry); tag = 'SILENT';
    } else {
      // (d) GATE INERT. It ran; prove the gate is load-bearing by TAKING THE CORPUS AWAY — its own
      // declared root, redirected at a fresh empty directory — and requiring the answer to change.
      // Not a knob it is asked to honour: pane E's knob-only file honoured the knob perfectly and
      // asked the corpus nothing at all.
      const denied = runFile(f, { [decl.root]: emptyDir() });
      if (denied.code !== 0 || !NOT_RUN_LINE.test(denied.clean)) {
        classErr.push({ ...entry, why: `(d) GATE INERT — with its own declared root (${decl.root}) ` +
          'pointed at an EMPTY directory it did not report NOT-RUN' +
          (denied.code !== 0 ? ` (exit ${denied.code})` : '') + '. Either the gate does not read ' +
          `${decl.root}, or it asks no corpus question at all; either way its green here says ` +
          'nothing about any other machine' });
        tag = 'CLASS';
      } else { green.push({ ...entry, universe: universe[1].trim() }); tag = ' ok  '; }
    }
  } else if (declaredRed) {
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

// canarySang IS ON THE LINE (pane E, E-4). It never was, so the buckets did not sum to the total and
// a run could read "1 green ... (of 3)" with the missing two in no printed column at all.
console.log(`\njs-suite: ${green.length} green · ${failed.length} failed · ${crashed.length} crashed · ` +
            `${silent.length} silent · ${canary.length} canary · ${canarySang.length} sang · ` +
            `${notRunFiles.length} not-run · ${classErr.length} class-error  (of ${files.length})`);

// AND THE BUCKETS MUST SUM. Rule 2's own shape applied to this runner's arithmetic: a summary that
// does not reconcile is a summary reporting a coverage nobody measured, which is the vacuity
// problem one level up and exactly what this file exists to refuse.
const buckets = green.length + failed.length + crashed.length + silent.length
              + canary.length + canarySang.length + notRunFiles.length + classErr.length;
if (buckets !== files.length) {
  console.error(`\njs-suite: BUCKETS DO NOT RECONCILE — ${buckets} classified, ${files.length} discovered.`);
  console.error('Some file is in no column or in two. Refusing to report a summary that does not add up.');
  process.exit(2);
}

// THE UNIVERSE PRINT, applied to this runner's own output (registered 2026-08-25; the rule is that
// an instrument sweeping a corpus prints N seen / M skipped / the rule that decided). A suite that
// silently declines to run one of its files is the same shape as a scanner that silently skips a
// site, and the desktop had no way to tell "61 of 61 ran" from "61 of 62 ran" off the old line.
//
// COUNTED FROM WHAT EACH FILE DID, not from bucket membership (pane E, E-4). v1 computed
// `ran = discovered - notRunFiles.length`, so a file that crashed on load, and a file that printed
// NOT-RUN badly enough to land in classErr, BOTH reported as having run — the direction that claims
// more coverage than exists, in the very print added so the desktop could tell 61-of-61 from
// 61-of-62. `completed` is the same evidence the classifier itself uses: a real summary line.
const ranCount = [...green, ...failed, ...canary, ...canarySang, ...classErr, ...silent, ...crashed]
  .filter((e) => e.completed).length;
const neither = files.length - ranCount - notRunFiles.length;
console.log(`\nuniverse: ${files.length} test files discovered · ${ranCount} ran assertions to a summary · ` +
            `${notRunFiles.length} declared NOT-RUN · ${neither} neither`);
console.log('  rule: every discovered file runs unconditionally, EXCEPT a file whose header declares');
console.log('        `JS-SUITE: MACHINE-BOUND` — that file runs only where its own corpus gate says its');
console.log('        universe is present, and must print NOT-RUN with a reason everywhere else.');
console.log('        `neither` is crashed-before-its-summary or silent: those did NOT run, and are');
console.log('        counted apart from NOT-RUN because declining is a decision and dying is not.');
if (!notRunFiles.length) {
  console.log('        0 NOT-RUN here, which is a claim about THIS machine and not about the files.');
}

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
for (const e of notRunFiles) {
  console.log(`\nNOT-RUN (declared MACHINE-BOUND, universe absent here): ${e.rel}`);
  console.log(`  reason:   ${e.reason}`);
  console.log(`  universe: ${e.universe}`);
  // NEVER REPORTED AS HEALTH. The forced result is printed because a NOT-RUN that reads like a pass
  // is the false-green this whole class was built to stop being.
  console.log(`  forced:   with JS_SUITE_UNIVERSE=force it exits ${e.forced.code}` +
              `${e.forced.completed ? ' and reaches a summary' : ' without reaching a summary'} — ` +
              'checked, so a NOT-RUN cannot be hiding a green.');
  console.log('  This file was NOT verified on this machine. A red under force here would be');
  console.log('  indistinguishable from a foreign corpus, so nothing about its health is claimed.');
}
for (const e of classErr) {
  console.log(`\nCLASS ERROR — ${e.rel} misuses a js-suite declaration. This FAILS the run.`);
  console.log(`  ${e.why}`);
  console.log('  A class is an exemption from FAILING, never from CLASSIFICATION. A declaration that');
  console.log('  cannot be checked is a suppression bucket, which is what the canary bug already was.');
}

// SILENT counts as a failure (pane A). v1 exited 0 over a silent file, which contradicted rule 2
// at file granularity: a green run over an empty set is the bug, and one untested file inside a
// green tree is the same bug at smaller scale. It also meant the NEXT summary-regex miss — and the
// history says one is coming — would file a healthy suite SILENT while the run stayed green,
// hiding the classifier's own defect behind a pass.
// classErr joins them, and notRunFiles deliberately does NOT. That asymmetry is the class: a
// MACHINE-BOUND file on a foreign corpus is not a failure, and every way of MISUSING the
// declaration is.
process.exit(failed.length || crashed.length || canarySang.length || silent.length || classErr.length ? 1 : 0);
