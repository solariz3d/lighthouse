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

### A branch can arrive green on its own checks and still turn a guard on main red: D424's new test rows carry 3 drive-letter fixtures portable-paths does not baseline
2026-10-22, D424 landing — merge 3fc78c67 (local): cargo whole green (1,099/0); the brief-reading JS tests 619/622, both reds in portable-paths.test.js, red at
413b938c and green at ddfb4e4c. Push held. Could be wrong that baselining is the right fix: the guard's policy for BENIGN-TEST sites was not found stated.
General form: a landing runs the guards the branch's author did not, and a red one is the landing's to stop on, not to route around.
→ `exo_memory/handback/p-d424-landing-O_2026-10-22.md`

### The closer's bump was the windowed close's metric: least-norm in control points loads the change onto joints, whose points shape two pieces; measured on the road instead, the joints go smooth
2026-10-22, D431 Part 1 — close.js:254/284-286 with the joint links at :98-100; gramMetric (∫Δ² + (50 m·Δ')², windowed closes only) on t180 d431-o a519bb9:
TEST TRACK 10's p42|p43 kh -0.15, -11.81 | -23.54 → -8.71, -8.59 | -8.48; whole-lap close byte-identical. Could be wrong for windows of the user's own road:
ELYSIUM's bend moves 4.40 m, was 3.99 (a ruling owed). General form: a bar on three points let two smoother-looking variants through; measure the road too.
→ `exo_memory/handback/p-d431-O_2026-10-22.md`

### A closer banked to the balance bank at the design speed leans 72-81° into its curves and keeps the lap closed; the plan's "gentle curves get none" needs a flat limit the code does not have
2026-10-22, D434 — measured, not built: −atan(v²·kh/g) on the laid route's new pieces (sign found in both frames), 460 km/h: TEST TRACK 10 lateral 10.68 → 5.32 g,
TEST 10 10.96 → 0.48 g, normal ≤ 11 g, roll under amber; 0.75 × balance = 53.8°, the keeper's own 53.2°. Could be wrong about the size the keeper wants (his eye).
General form: a capture that keeps the FIRST call of a retried step measures a thrown-away attempt; key it to the result returned.
→ `exo_memory/handback/p-d434-O_2026-10-22.md`

### Finish now banks the curves it lays (0.75 of balance at 460 km/h, from the closed route, pinned at every joint, rate-limited under the roll amber): TEST TRACK 10's side load 10.68 → 4.66 g, 0 stations leaning out
2026-10-22, D434 Part 2 — d434-o 15e4e81: rows red at b6969da, 7/7 mutants, harnesses NOT APPLIED 0. Could be wrong for laps where a crest on the user's own road
fails the checker: core_finish row 13 now closes into such a lap (ruling owed). No kn5: both his tracks export RED on their own road. General form: a limiter that pins
values must skip the pins in every pass, or a later pass silently undoes them.
→ `exo_memory/handback/p-d434-build-O_2026-10-22.md`

### My D434 bank steps under the outer wheels at the closer's first joint (95.9 °/100 m, 11.9 g at 300 km/h) far past his own worst joint (24.3): a roll rate capped is not a roll rate eased
2026-10-22, D438 Part 2 — kstep436.js on three copies of TEST TRACK 10: centre line smoothest on mine, p41|p42 worst on mine; the cup pulled from 37.3° to 10° in the last
30-40 m before the seam on all three (his own road: 0.021 °/m). Fix planned, not built. Could be wrong about the cause split at p41|p42 (bank onset vs the laid roll's own
roll): inferred from where the step sits, not separated by a run. General form: bound the derivative the rider feels, not the one the checker reads.
→ `exo_memory/handback/p-d438-O_2026-10-22.md`

### A rate limit on a bank does not ease its start: bound the roll's acceleration too, and lay a roll straight long enough to start and stop inside it
2026-10-22, D438 build — d438-o 63bb388: BANK_ACCEL 2e-4 rad/m² on the bank polygon's slope change took TEST TRACK 10's p41|p42 from 95.9 to 14.5 °/100 m under the
outer wheels and the seam from 75.6 to 9.5 (kstep436 never saw that seam: it does not wrap s = 0); the 87 m roll straight could not fit the bound, the bank's
backstop silently dropped every bank, so the roll is now laid ≥ 1.5·2√(θ/A) (route changes, 3,864 → 3,990 m). Could be wrong that 1.5 generalises: fitted on one lap.
General form: a backstop that falls back silently can turn a new limit into the loss of the whole feature; check the feature is still there, not only the bar.
→ `exo_memory/handback/p-d438-build-O_2026-10-22.md`

### Choosing a closer by side load fixes the order it is laid in, not the route inside an order: a lap can leave both orders bad
2026-10-23, D439 — d439-o cd3dc42: "roll first, always" broke core_finish row 12 (that end, banked the way the turns go, is better rolled last, 5.55 g against 8.08), so both
orders are searched and the lower side load wins; P's laps went 10.89 / 9.16 g → 4.68 / 4.65. But on a lap with a tight own turn the roll-first order takes a one-turn
route at R 126 m (~9.5 g) and roll-last leans out at 1,171 of 1,172 stations (9.22 g). Could be wrong that ranking routes inside an order is the cure: not built.
Also: an ease pinned at both ends needs its parameter to start AND end where the pins do; fixing one end moved the 1.5 × span to the other (σ, D439 (d)).
→ `exo_memory/handback/p-d439-O_2026-10-23.md`

### A load rank cannot see bank: |v²κ + g·ŷ| depends only on the path, so ranking closers by whole load undoes banking; by lateral load it moves routes for 0.02 g
2026-10-23, D440 — d440-o c422e8e: never-lean-out built (the tight lap 1,171/1,172 out → 0); the rank of (e)/(f) measured seven ways (rank-probe.js) and NOT built:
every version moved his TEST 10 route, lost core_finish row 6's one-turn finish, row 12's compact road, or D439 (c)'s banked closers (whole load: unbanked 8.12/9.16 g back).
Could be wrong that no bound exists between 1.0 and 1.25 × that keeps all: only 0, 1.25, 1.5 and ∞ were measured.
→ `exo_memory/handback/p-d440-O_2026-10-23.md`

### The seam dips are a crest read as lean: at every station rule 1 counts out, the road leans INTO its horizontal turn (+10.6° to +24.7°)
2026-10-23, D443 — no commit: on P's five pitched laps (cd3dc42) the 3-D κ̂ tilts down where a crest of R 735–1,850 m meets a bend; four of five are at turn joints, not the
seam. The ruled seam fix mended 1 of 5; reading the lean against the horizontal turn mends 5 of 5 back to the short roads with his tracks and the tight family identical.
Could be wrong that a crest under a bend is not "leaning out": that is the ruling's, not mine.
General form: before fixing where a measure fires, check what the measure reads there.
→ `exo_memory/handback/p-d443-O_2026-10-23.md`

### FINISH_LEANS_OUT is reachable and now has a row: P's steep lap (kv −0.003, 431 m below the start) refuses with "219 of its 971"; N5 and N6 caught
2026-10-23, D444 — d444-o 9fa000a: N5/N6 survived at da76067 without the row, caught with it. My D440 "not reached in 114 laps" was true of my families only.
Could be wrong that the lap stays a refusal: a change to roadHold or the roll laid first could let a road close there.
→ `exo_memory/handback/p-d444-O_2026-10-23.md`

### Closing a loop banks every upright LEVEL curve; on his copies only TEST 10's flat closer changes, because every other curve is his own bank
2026-10-23, D447 — d447-o 2be3b8e: bankLap in the Close press; the first build banked TEST TRACK 10's loop exit by 54° (bank 0 stored at pitch −90°) until a level rule.
General form: "upright" read from a stored channel is frame-dependent; check the road's own up vector before acting on it. Could be wrong that 30° is the right level bound.
→ `exo_memory/handback/p-d447-O_2026-10-23.md`

### A flip bound read from a stretch's PEAK share pins a curve that unwinds slowly into the next; the bank the roll can still hold does not, and kept his copies byte-identical
2026-10-24, D447 §9 — at f2459fe his saved TEST 10 closed with p21 moved 23° (pinned at 9,776–9,816 m, where nothing leaned out: worst +0.8°); held = max(share − fall from rest at
BANK_ACCEL to the rate cap) fixed it, row 16 red at f2459fe; copies-bytes-r5.out five sha256-identical to 2c13316. Could be wrong for a run-out shorter than the acceleration's reach.
General form: a measurement script that compares against the INPUT cannot see a change between two trees; compare the outputs byte for byte.
→ `exo_memory/handback/p-d447-O_2026-10-23.md` §9

### A curvature threshold below the guard's own reads the builder's fit ringing as flips; count a run only if the guard would read a station in it
2026-10-24, D447 §10 — at 05cdb9d "turning = banked over 5°" (R < 14.2 km) made the Bloss fit's rings after a 20 m transition into 2–8 m flips, every short corner's exit −0.4° (P §8.3);
P's variant 2 plus bankLap reading its own banked road at each unpinned gap: 54 of 68 rows red at 05cdb9d, green at 28eb328, five copies sha256-identical, W1-off sweep identical on 76 laps.
General form: a bar that can only see a wrong-way value cannot see a missing one; add a row that reads the value against a known-good table.
→ `exo_memory/handback/p-d447-O_2026-10-23.md` §10

### No lap reaches W1 while the descent check stands: the check reads the lean-out bar's own number at the same station
2026-10-24, D451 — with the check off, the bank at the gap's far side and the worst lean agree to 0.01° (x79–x79.75: 4.57/−4.57 … 4.98/−4.98°), and x80 withholds p8; 61 laps with it on reach W1 0 times. Could be wrong for a lap that climbs or crests through the gap (not searched).
Also: Q8 has a row (19: the roll amber on Sharp ramp 40, 0.9036 clean vs 0.9657 with Q8), and d447-mutants.js now keeps each mutant's raw TAP beside its verdict.
→ `exo_memory/handback/p-d451-O_2026-10-24.md`

### A close-by-adding-road reuse gated on an unchanged PREFIX loses every placed segment once Close changes any; count and flag per segment
2026-10-24, D453 — 7717b81 kept 0 of 11,958 placed segments on a 24 km rectangle (rebuild 1,065–1,114 ms) because D447 banks its 3 corners; keptFrom + reuseMesh's per-piece flags keep 11,250 (196–373 ms; ff88d85 231–281). His hand-banked laps never lost it. Could be wrong for a close that also cuts pieces (unseen).
General form: an all-or-nothing gate in front of a per-item reuse turns one changed item into a full rebuild.
→ `exo_memory/handback/p-d453-O_2026-10-24.md`

### A seat with no MCP mount cannot use an address row; and its letter's mount would give it a pane's verbs. The Third Place's return leg is its own mount carrying one verb
2026-10-26, D476 part 2 — the Third Place was mute by design (spawn_claude_pane); /mcp/third-place resolves to seat third_place and its server keeps call_librarian only (remove_route); row 3 to LIB, no row in; 7/7 mutants caught; cargo 1,113/0. Could be wrong that the station exemption is wanted (the chair's call, §3).
General form: before adding a route to a table, check that the caller can reach the table at all, and with what else.
→ `exo_memory/handback/p-d476-return-O_2026-10-26.md`
