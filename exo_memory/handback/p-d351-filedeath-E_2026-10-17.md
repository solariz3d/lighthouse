# Hand-back, pane E (machine D): D351, what kills a test file at about 44 s, and why the test count moves

Packet: D351 from the chair. Subject: the two full-suite runs at `218c661` (72c3446 + d349-c), `t180_d349_suite.log` and `t180_d349b_suite.log` in the chair's scratchpad. Uncommitted. **No code was changed and nothing was committed: no code fault was found to fix.**

## The answer

- **The file death is a native crash of `node.exe`: child exit code `3221225477` = `0xC0000005` (STATUS_ACCESS_VIOLATION).** It is not a timeout, not a kill, not out of memory, and not a temp-dir or shared-file race.
- **Reproduced:** 3 of 180 file runs, under load (12 test files at once). Two came in `core_close_best`, one in `underskin`, and each child reads `exitCode: 3221225477`.
- **"About 44 s" is a coincidence of two draws, not a constant.** Today's deaths came at 100.0 s, 107.8 s and 7.4 s, and one in stress run 1 at 24.7 s.
- **It is the same crash that pane C traced on 2026-10-06** (`p-flake-C_2026-10-06.md`), and B before that on 09-27, in different files each time. Pure JavaScript cannot raise an access violation, so the faulting process is `node.exe` itself. C's evidence points at this machine's memory stability rather than at node or our code.
- **The test count moves because a dead file counts 1, not its subtests.** `underskin.test.js` has 8 tests. Dead, it is reported as 1 failing file-level test: 2,966 − 8 + 1 = **2,959**, run 1's count exactly.
  - checked: `grep -c "^test(" test/underskin.test.js` → 8 (rows 1–8, `underskin.test.js:72-162`); run 2 and my full run → `ℹ tests 2966`; run 1 → `ℹ tests 2959`.
  - In run 2 the death was inside the mutation harness (the inner run of `core_close_best` for mutant B1). The outer count is unchanged there, and B1 reads "NOT CAUGHT" instead (below).

## Evidence, each with its source

1. **How a native crash looks under `npm test`.** `fmt/` in my scratchpad holds three tiny test files: one that exits 3, one that kills itself, and one that exits `3221225477`. Each prints, under the spec reporter, exactly what run 1 printed for underskin:
   - `✖ <file> (N ms)` with no subtest lines, then `test at <file>:1:1`, `'test failed'`, and no exit code.
   - Only the TAP reporter shows the code: `exitCode: 3221225477` for the crash, `exitCode: 1` for the self-kill.
   - **So the chair's spec-reporter logs cannot tell these apart.** C proposed TAP or exit-code logging on 10-06 (proposal 2a); the D349 runner (`t180_d349_suite.js`: `npm test`, spec) does not have it yet.
2. **The two files alone pass:** `underskin` exit 0 in 57.1 s (8/8), `core_close_best` exit 0 in 56.8 s (10 pass, 2 skipped), at `218c661` in `C:\Users\nname\Downloads\t180-wt-e5`.
3. **Not memory.**
   - Monitored alone (`monitor.js`, loaded with `--require` into every node process): peak heap 98 MB (underskin) and 75 MB (core_close_best) against a 4,288 MB limit, and peak RSS 588 and 543 MB.
   - No `FATAL ERROR` or heap message in either chair log. A V8 heap death prints one and exits 134 (my `fmt2` check, and C's `fl/alone.js`).
   - 42.0 GB of RAM free, 94.9 GB of commit free (`Win32_OperatingSystem`, during my runs).
4. **Not a timeout.**
   - node's runner has no file timeout set (`--test-timeout` is not passed; `package.json:3`).
   - The mutation harness's `spawnSync` timeout is 900,000 ms (`app/test/core-close-mutation.test.js:80`), and its inner run died at 44.2 s.
   - The deaths land at scattered times: 7.4, 24.7, 44.1, 44.2, 100.0 and 107.8 s.
5. **Not a kill.**
   - The heavy-run lock only probes with `kill(pid, 0)` (`consonance/tools/heavy-run.js:112-114`), and so do `head-watch.js:166,205`, `jev-shadow-runner.js:129` and `second-reader.js:52`. The other tools the grep listed (for example `close.mutants.js`, `mistake-bench.js`) I did not read: inferred, not checked, that none of them kills a test process.
   - A kill reads child `exitCode: 1` (the `fmt` self-kill); the crashes read `3221225477`.
   - No test or source file calls `process.exit`, `abort` or `kill` (`grep -rnE "process\.(exit|abort|reallyExit|kill)" src app test`: only two script entry points, `app/test/soundrender.js:127,133`, and `test/fixtures/fixtures.js:77`, none of them run by the suite).
6. **Not a temp-dir or shared-file race.**
   - The stress runs ran the two files directly in one clean worktree (`git status --porcelain` → 0 before and after), with no mutation harness and no `t180b-close-mut-*` directory, and they crashed anyway.
   - There are no dependencies, no native addons and no worker threads in the code under test (`package.json` has scripts only; no `.node` files; no `worker_threads` in `src`, `app/core` or either file).
7. **The machine.**
   - System log since C's note: no bugcheck (1001), no unexpected shutdown (41, 6008), no WHEA error, and no `Application Error` events. The last Kernel-Power 41 was 2026-10-06 19:59. The logs reach back to April, so this is not a wrapped log.
   - WMI still reads both DIMMs (`CMH64GX5M2B6000Z40`) at **6000 MT/s configured** (inferred, as C said: the EXPO profile, not JEDEC 4800).
   - So the kernel has been quiet since 10-06, and node's access violations go on. Node itself writes no event: WER is disabled machine-wide, per C.
8. **What load it needs.**
   - 0 deaths in 1,472 node processes of one full suite run (`--test-concurrency=4`, monitored), and 0 in 2 alone runs of each file.
   - 5 deaths in 432 stress file runs at 12 at once. C had 0 in 50 alone runs on 10-06.
   - The rate rises with concurrent load (inferred from those counts; not a controlled comparison).

## Reproduction attempts, counted (each under the heavy-run lock, one at a time, all at `218c661` in `t180-wt-e5`)

| run | shape | file runs | deaths | child code |
|---|---|---|---|---|
| alone ×2 | each file by itself (one timed, one monitored) | 4 | 0 | none |
| full run 1 | `node --test --test-concurrency=4` as `npm test`, plus a TAP copy, monitored | 1 suite, 1,472 processes, 2,966 tests (2,947 pass, 0 fail, 12 skipped, 7 todo), 31.7 min | 0 | TAP: 0 `exitCode:` lines |
| stress 1 | 6 of each file at once, 3 rounds | 36 | 1 (underskin, 24.7 s) | **not recorded** (spec) |
| stress 2 | 6 of each, 6 rounds | 72 | 0 | not recorded |
| stress 3 | 6 of each, 12 rounds | 144 | 1 (core_close_best, 4.3 s) | **not recorded** |
| stress 4 | 6 of each, 15 rounds, TAP parsed | 180 | **3** | **3221225477 ×3** |

Other seats' work during these runs was whatever runs outside the lock; I did not measure it.

## Corrections (mine)

- **stress2.js never recorded the child code.** The in-place edit that made it from stress.js silently failed to apply (a string escape), so stress 2 and 3 printed `undefined` and their one death has no code. I found this when stress 3's death read `undefined` in every field. I rewrote the script whole as `stress4.js`, checked it on the three known cases (`fmt/`: 3221225477, 1, none), and only then ran stress 4. The stress 1 and 3 deaths are therefore *inferred* to be the same crash, not checked.

## What the harness does with a crash (a finding, not fixed)

`runMutant` (`app/test/core-close-mutation.test.js:79-85`) reads only the `✖` lines of its inner run, never `r.status` or a child's exit code.
- **The effect:** an inner run that crashes reads as `NOT CAUGHT; failing tests on the mutant: <file> (N ms)`. That is run 2's B1 exactly (`t180_d349b_suite.log:3234`).
- **That message is false.** The mutant was not tested at all. Under B1 the file normally fails at row 4, and B1 was caught in run 1, in D343 and in my full run.
- **13 files share the inner-run shape** (`grep -ln "spawnSync(process.execPath" app/test/*mutation*.test.js test/*mutation*.test.js` → 13), so the same misreport is likely in each (inferred; I read only this one).
- **I did not change it.** It is a test harness's reporting, not the crash's cause, and changing a test needs a ruling.
- **A proposal that does not retry or skip:** have the harness use `--test-reporter=tap` (or parse the child's `exitCode`), and when a child file's exit code is non-zero with no failing subtest, fail with `native crash <code> in <file>: the mutant was NOT TESTED`, not `NOT CAUGHT`. That still fails loudly, so the run stays red and nothing is passed silently.

## Proposals (nothing built)

1. **Runners (C's 2a, again, now with today's cost):** the chair's suite runner should write a TAP copy beside the spec log (`--test-reporter=spec --test-reporter-destination=stdout --test-reporter=tap --test-reporter-destination=<file>`, as my `fullrun.sh` did), so each death carries its code. Today's two deaths cost two full runs and this packet, and neither log could name its own cause.
2. **The harness message:** as in the section above, for a ruling.
3. **The machine is the keeper's call** (C's proposal 1 still stands): check the BIOS memory profile (EXPO at 6000), or run a memory test. If the crash rate here moves with it, that settles the cause; nothing in the repository can.

## Left on disk

- **Worktree `C:\Users\nname\Downloads\t180-wt-e5`:** detached at `218c661`, clean, with no links (nothing was linked in). It can go with a plain `git worktree remove` after the read.
- **Scripts and outputs** are in my scratchpad, `d351\`:
  - scripts: `monitor.js`, `monsum.js`, `fullrun.sh`, `stress.js`, `stress2.js` (the broken one, kept as the record) and `stress4.js`;
  - outputs: `run1\` (spec.log, tap.txt, mon\) and `stress1.out` to `stress4.out` (stress4.out is sha256 `e928bdd72c24789d…`);
  - `s4\fail-*.txt`: the three crashing runs' full TAP;
  - `fmt\`, `fmt2\`: the reporter checks.

NEXT: librarian, rule on proposal 1 (TAP beside the chair's spec log) and on the harness message (proposal 2), and bring the keeper the memory-profile question (proposal 3). There is no code fix to land.
