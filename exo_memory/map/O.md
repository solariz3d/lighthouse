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

### A route tool's own window rarely re-closes a lap: on a test lap only a 5-piece window did; narrower ones fall back to the whole-lap close
2026-10-20, D421 Part 2 — the real close on a closed 6-piece lap, Bend at s0/r 450/80, 700/300, 900/500, 1100/700: windows [1], [1-3], [1-4] refused, [1-5] closed.
So the design's "only the window's pieces move" holds for wide windows; a small route edit usually gets the whole-lap fallback. Could be wrong on a lap shaped
differently (the window close's freedom grows with the turns inside it). Also: the shell's share of a Bend step on 10 km is ~4.5 ms; the page frame's ~155 ms is the preview's.
→ `exo_memory/handback/p-d421-shell-O_2026-10-20.md`

### A sculpt step on a tube or a long road was mostly re-deriving two pure functions; kept exactly, rows 2/4a/4b p50 fell 10.3→2.4, 54.3→6.3, 18.4→5.6 ms, bit-identical
2026-10-20, D421 shell cut — the hill's peak ratio (redone per step on the same base) and commonFractions (per tube piece); `shellprof.js` + `profsum.js` profile,
`shellrun.js` both slots, docs/lifted sha256 equal on all four rows; d421-o 937f5d4; 7/7 cache mutants, harnesses 178/178/0. Could be wrong for the browser preview
path, which was not timed. Also found: brush() on an unfrozen document freezes its knots arrays in place (so it did at 969ecac).
→ `exo_memory/handback/p-d421-shellcut-O_2026-10-20.md`

### local-0.4.11 lands D421 green except three sculpt-frame p95 rows, which miss 6.0 ms even in a quiet window (8.3–12.3 ms) though the shell step alone is now 2–6 ms
2026-10-20, D421 landing — 57b41f8 (ea54ac3 + d421-b, -a, b-c, -e); full suite 3,390 / 5 fail, all timing rows under load; harnesses 596/596/0; cargo 44/0;
quiet frames 12/15 (release-frame row 4, the D407b red, passed at p95 5.5). Could be wrong that the remaining cost is the page's: inferred from node shell timings,
not profiled in the page.
→ `exo_memory/handback/p-d421-landing-O_2026-10-20.md`

### A Grab step rebuilt the pieces it lifted for nothing: the segment cache keyed a piece by its object, and no segment reads h or l
2026-10-20, D421c part 4 — liftonly.js: grab-up/grab-side change only h/l and leave every segment identical; reusing the last segments for the same id when
only h/l differ (inputs compared as before) cut row 2's step p50 2.36→1.23 ms and 4a's 1.83→0.26, bit-identical; d421c-o 0aa9690. Also: my 4a "6.3 ms in node"
was a pre-C-cut tree (937f5d4: 6.76; 57b41f8: 1.83 = the page). Could be wrong if some reader of segments I did not find reads h or l through valuesAt.
General form: an instrument that wraps a cache must keep one wrapper per cache, or it hides per-cache state and reports no change.
→ `exo_memory/handback/p-d421c-step-O_2026-10-20.md`

### On a closed lap, a route brush's re-close window closes only if it holds a piece beside the start line; width alone (+1..+8 each side) never does
2026-10-20, D421c window measure — row 3 (Bend at 2100 m, pieces 9-11): +0..+8 all CLOSE_SINGULAR (~80-110 ms each); +9 closes as the first to reach piece 0;
brushed + piece 49 closes changing 5 pieces against the whole lap's 47; a brush at 9800 m (pieces 48-49) closes in its own window. Could be wrong about WHY (the
seam's C1 rows): inferred from close.js:8-9, not from the solver; pieces 0-19 hold the seam piece and still stall at 2 mm.
→ `exo_memory/handback/p-d421c-window-O_2026-10-20.md`

### A route release on a closed lap now lands on the seam try: 3-5 pieces change instead of 47-49, though it is no faster
2026-10-20, D421c seam tries — d421c-o d3be0cb: the window, + the last road piece, + the last and first, then the whole lap; on row 3's lap the second try lands
for a Bend at 2100 and 6000, a Climb and a Stretch (599-707 ms, gap 0.03-0.16 mm). No item-5 case (seam fails, whole closes) in 150 positions on three laps.
Could be wrong for laps not swept: jumps, a mixed seam, a window already holding a seam piece. Also: the tube oval and a legacy lap with the same centreline
close identically, to the 4th decimal, because the close solves the centreline only.
→ `exo_memory/handback/p-d421c-seam-O_2026-10-20.md`
