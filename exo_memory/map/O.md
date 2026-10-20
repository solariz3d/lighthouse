# Map — O

One writer: seat O. Append clean, dated entries; correct by appending, never by rewriting (`README.md` in this folder).

### node 24's `--test-reporter=tap` carries no file path, so per-file wall time cannot be read from a T-180 TAP
2026-10-19, D412 part 1 — checked on a two-file scratch run before the heavy one, then on the full suite at b306309.
Its top level is each file's top-level tests, flattened, with names and durations only. Each file's own test exists only as a
reporter event: `test:complete` at nesting 0, named by the path as globbed, `duration_ms` = that file's subprocess wall. A
custom reporter beside TAP gets it (`exo_memory/handback/p-d412-part1-O_2026-10-19_evidence/file-events-reporter.mjs`).
General form: check that an instrument can carry the figure on something cheap before a heavy run is spent producing it.
→ `exo_memory/handback/p-d412-part1-O_2026-10-19.md`

### The T-180 full suite's floor is one file: core-mutation.test.js, 1,991 s of a 2,422 s wall, so concurrency cannot reach 20 min
2026-10-19, D412 part 1 — `parse-tap.js` over the run's events: it starts at +24 s and ends at +2,015 s; the 15 mutation files are
70.5% of the per-file sum; at concurrency 4 the machine already averages 11.4 of 16 cores busy (machine-wide samples).
Could be wrong if that file's time was inflated by other seats' load in the window, which a machine-wide sample cannot separate.
→ `exo_memory/handback/p-d412-part1-O_2026-10-19.md`

### A gate of "git log -p <range> | grep -c <name> = 0" cannot pass while the range holds the commit that removes public lines
2026-10-19, D413 — the plain scrub commit fe5f9951 shows its 14 removed lines in `git log -p`, and one is context beside another
commit; 0 added lines and 0 messages remain, and every remaining match is already public at origin. The count that answers
"does this push publish anything new" is the ADDED lines plus the messages, not every line the log prints.
→ `exo_memory/handback/p-d413-housekeeping-O_2026-10-19.md`

### In core-mutation.test.js a mutant's time is its inner run, not its copy: ~21 s running 76 tests, against ~100 ms copying
2026-10-19, D412 part 2 (a) — `measure-one-mutant.js` on a control and three mutants at b306309, under the lock: copy 97–121 ms
(191 files, 2.2 MB); the inner run 20.0–22.5 s for all 76 tests; narrowed to the caughtBy test 127–536 ms, 2–4 tests, all caught.
Could be wrong for the other two big harnesses, which copy differently and were not measured.
→ `exo_memory/handback/p-d412-part2a-O_2026-10-19.md`

### Narrowing each mutant to its named test took the big three harnesses from 4,354 s to 649 s with all 579 verdicts unchanged; the suite is now bound by total work, ~21 min
2026-10-19, D412 part 2 (b) — d412-suite-speed 35e8628..5bb6d41; two plain full runs, 1,270 s and 1,274.5 s; 579/579 per mutant against
0.4.8 (compare-mutants.js); harness-time.js for the per-harness sums. Could be wrong about "bound by total work" if the largest
remaining harness also sits on a critical path; core_piece_mutation (513 s) is the one to look at.
Also: node 24 reports a file in which --test-name-pattern matches nothing as ONE passing test named by its path, so "ℹ tests" cannot
say whether a named test ran (test/inner_run.js `ran`).
→ `exo_memory/handback/p-d412-part2b-O_2026-10-19.md`

### A side-effecting shell loop piped into `| head -N` stops doing its work once N lines are printed, not only stops printing
2026-10-20, D420 part 2 — my d411 archive loop (`for w in …; do archive; echo; done | head -12`) archived 7 of 12 worktrees; the
removal step's own "not archived: stop" check caught it before any unarchived worktree went. Could be wrong in detail (which
iteration the pipe closes on varies with output), not in kind.
General form: never truncate the output of a loop that writes; truncate a separate read of its results, and make the destructive
step re-check the precondition itself, which is what saved this one.
→ `exo_memory/handback/p-d420-cleanup-O_2026-10-20.md`

### Windows PowerShell 5.1 reads a BOM-less .ps1 as ANSI, so a UTF-8 em-dash inside a string ends it early, and "$Var: text" is a scope reference
2026-10-20, D423 landing — my staged swap.ps1 failed to parse on its dry run (nothing changed); fixed by keeping the file pure ASCII and
writing ${Var}: wherever a variable meets a colon. Could be wrong for PowerShell 7, which reads UTF-8 by default.
General form: dry-run a staged script on the target machine's own shell before handing it to the person who will run it at a bad moment.
→ `exo_memory/handback/p-d423-landing-O_2026-10-20.md`
