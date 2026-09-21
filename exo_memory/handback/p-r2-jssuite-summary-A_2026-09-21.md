# P-R2-JSSUITE-SUMMARY · ALPHA — the runner reads the middle-dot summary; l2-overseer-worker.test.js is GREEN in the suite

**Pane A, machine L, 2026-09-21 02:0x–02:3x.** Lap L058 R2. Plan: `loop/plan_repo_fixes_2026-09-21.md` @eb1b121, §0 and
the R2 row, read at source. **Two files: `consonance/tools/js-suite.js` (+7 −2) and `consonance/tools/js-suite.test.js`
(+49)** (`git diff --stat`). Not committed. **No existing test was weakened, removed or modified**: every assertion in
the file before this lap is unchanged, and the five tests added are new.

**Registered BEFORE running, with the range checked first:**
- **The null:** the runner already reads this summary, and SILENT for `l2-overseer-worker.test.js` is the file's own
  vacuity — the runner's own warning says "check before editing".
- **Its falsifier:** a fixture printing exactly the form that file prints, with real passes, classified SILENT.
- **The quantity can take more than one value on this object:** the classification is not a constant here — the
  plan's own run shows 103 green, 5 failed and 1 silent on one tree, and my before-run below shows 102 / 6 / 1. So
  "SILENT" is a reading, not the only value the classifier can return.

**The null is FALSIFIED.** Run alone, the file ends `18 tests · 18 pass · 0 fail` (U+00B7 separators;
`dev/shell/hooks/l2-overseer-worker.test.js:160`). The runner's `SUMMARY` regex knew four shapes and not that one.
It is the only file in the repo that prints it (`grep -rln "tests · \|pass · " --include=*.test.js`).

---

## 1 · THE FIX

`SUMMARY` gains a fifth alternative, and `VACUOUS` gains the matching vacuity rule:

    SUMMARY  … |(\d+\s+tests\s*·\s*\d+\s+pass\s*·\s*\d+\s+fail)
    VACUOUS  … |(\b\d+\s+tests\s*·\s*0\s+pass\s*·\s*0\s+fail)

- **It widens what is recognised and does not narrow what counts as silence.** A file printing no summary is still
  SILENT (the existing `exit 0 with no summary is SILENT` test, untouched and green). `0 tests · 0 pass · 0 fail` is
  still SILENT. And the widening stops at the MEASURED shape: the same words with a comma separator are still SILENT.
- **The vacuity rule is this file's own lesson carried forward** (`js-suite.js:211-213`): zero passes WITH a failure
  is a run that completed and failed, so `1 tests · 0 pass · 1 fail` is FAILED, not silent. Only zero-and-zero is
  vacuous.
- The comment beside the regex records it as v3 and names the file it was read off, in the same form as v1 and v2.

## 2 · BARS — the command beside every number

    RED FIRST (the four middle-dot tests added, the runner unchanged):
      node consonance/tools/js-suite.test.js          js-suite-self: 39 passed, 3 failed
        FAIL the middle-dot summary with passes is GREEN, not silent (L058 R2)
        FAIL the middle-dot summary with a failure is FAILED, not crashed
        FAIL the middle-dot summary with ZERO passes but a failure is FAILED, not silent
        green at red ON PURPOSE: "the middle-dot summary counting ZERO of everything is still SILENT" — a control;
        it must hold on both sides of the change.
        the 38 tests that existed before this lap: all pass at red.

    GREEN:
      node consonance/tools/js-suite.test.js          js-suite-self: 42 passed, 0 failed
      after the fifth test (§3):                      js-suite-self: 43 passed, 0 failed

    THE FULL SUITE, BEFORE AND AFTER — one variable changed. Both runs are in the SAME detached worktree of HEAD
    eb1b121 (so neither sees an untracked file, which is the plan's own control), the second with only my two files
    copied in:
      cd <worktree@eb1b121> && node consonance/tools/js-suite.js
        BEFORE  102 green · 6 failed · 0 crashed · 1 silent · 1 canary · 0 sang · 0 not-run · 0 class-error (of 110) · exit 1
                universe: 110 discovered · 109 ran assertions to a summary · 1 neither
                SILENT  dev\shell\hooks\l2-overseer-worker.test.js
        AFTER   103 green · 6 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 0 not-run · 0 class-error (of 110) · exit 1
                universe: 110 discovered · 110 ran assertions to a summary · 0 neither
                 ok    dev\shell\hooks\l2-overseer-worker.test.js
      EXACTLY ONE FILE MOVED, silent -> green. The six reds are the same six files before and after:
        actors.evidence, ask, carrier-drift, forget-rate, gen-consumer, portable-paths (all consonance/tools/).

    AND ON THE LIVE TREE, after (untracked files present, other seats' in-flight fixes present):
      cd C:/Consonance/lighthouse && node consonance/tools/js-suite.js
        105 green · 4 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 0 not-run · 0 class-error (of 110) · exit 1
         ok    dev\shell\hooks\l2-overseer-worker.test.js
      The two reds the live tree does not have — ask.test.js and gen-consumer.test.js — are not this packet's: ask is
      B's R3 fix in the working tree, and gen-consumer is red only in the worktree, which is the untracked-file
      asymmetry the plan's §0 names. I did not investigate either.

    MUTANTS — consonance/tools/mutant-harness.js on a COPY (worktree of HEAD, the live js-suite.js copied in, the
    live file hashed before and after), scored by <scratchpad>/r2_score.js, which copies the LIVE test file into the
    worktree (the harness carries one file — my D081 limit, disclosed at D083) and translates its summary:
      node consonance/tools/mutant-harness.js <scratchpad>/r2_rows.js
      FIRST RUN (42 tests):  6 listed · 5 killed · 1 SURVIVED · 0 no result · 0 not applied
      FINAL RUN (43 tests):  pre-flight green 43/0 · 6 listed · 6 killed · 0 survived · 0 no result · 0 NOT APPLIED ·
                             live js-suite.js unchanged: true
        #1 ANY output reads as a completed run          killed by 16 tests, including "exit 0 with no summary is SILENT"
        #2 the middle-dot shape not recognised (v2)     the three middle-dot tests
        #3 the middle-dot vacuity rule dropped           "…counting ZERO of everything is still SILENT"
        #4 vacuity matches ANY middle-dot counts         the three middle-dot tests
        #5 vacuity needs only zero PASSES                "…ZERO passes but a failure is FAILED, not silent"
        #6 the separator loosened to any character       "the same words with an UNMEASURED separator … still SILENT"
      #1 is the mutant the packet asked for by name.

## 3 · CORRECTIONS, INCLUDING TO MYSELF

- **My first before-run was contaminated, and I discarded it.** I started the full suite, then edited the runner
  while it ran. It had loaded the OLD runner, but when it reached `js-suite.test.js` that file spawns a FRESH runner —
  the edited one. Its figures would have mixed two versions, so I stopped it and ran the clean worktree pair in §2
  instead. No figure in this hand-back comes from it.
- **Mutant #6 survived the first run, and it was a real gap.** Nothing stopped the separator loosening to any
  character, which would let an unmeasured shape count as a completed run — against the runner's own doctrine that
  every shape is "read off actual output". A fifth test now pins it, and #6 dies.
- **My first mutant rows could not find their anchors.** The Edit tool wrote the regex with the literal `·`
  character; I typed the anchors as the escape `\u00b7`. The harness's anchor gate refused before mutating anything
  (reported as a possible leftover, the diagnosis D081 chose for a missing anchor). A shell substitution to fix it was
  then mangled by quoting; I rewrote the rows file with the editor.

## 4 · WHAT I DID NOT VERIFY

- **Machine D was not run.** Everything here is L's.
- **The four live-tree reds were not investigated** (actors.evidence, carrier-drift, forget-rate, portable-paths); they
  are the plan's §0 reds and not this packet's.
- **Only the one middle-dot shape was added.** I did not survey the other 109 files for summary forms the runner
  reads by accident rather than by design; the runner's four earlier shapes were taken as they stood.
- **HEAD moved during the lap** (eb1b121 → 74aeb25, four Third Place commits). My worktree pair is at eb1b121; the
  live run is at 74aeb25 with the working tree on top. None of those commits touched `consonance/tools/`
  (`git log eb1b121..HEAD` is the Third Place's own notes).
- **One stray worktree is on the list that is not mine** —
  `…/Temp/mutant-harness-branch-specific-vs-head-tests/wt` at a4e3607, a label I did not create. I left it alone.

NEXT: librarian re-derive §2's worktree pair and the live-tree figure when the file is read; l2-overseer-worker.test.js reads GREEN in the suite
