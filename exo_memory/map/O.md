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

### The keep-warm visit is letters relayed by the keep-warm actuator itself: the same pings, the same requests, a guarded line each way, and no new way into the Third Place
2026-10-26, D476 part 4 — d476-o-p4 13c69597: a seat's ping becomes a visit carrying ITS answer; the Third Place's ping becomes the hour; replies read only from the turn's last text; guard = pointers/ids/shas/commands/uptake/private/400 chars, "stays here" gives nothing; 28/28 mutants, cargo 1,126/0; staged, never swapped. Could be wrong that a phrase list holds uptake out: prose can paraphrase it.
General form: a string a test parses must stay simple; an escaped quote in new code can put another test's parser out of step and fail far from the change.
→ `exo_memory/handback/p-d476-visit-build-O_2026-10-26.md`

### A props catalogue plugs into the markers' placement as it stands, but the first paid pack is not worth building yet: the export has no ground, no LODs, no compressed textures, no prop merge class, and the preview draws the track only
2026-10-27, D493 part 2 (research, t180 82afc11) — placement is place.js surfaceAt/placeMarker plus a piece/word anchor like the spawns block; the edge is the profile's span, which on a T-180 wall is the wall's top (up rules needed); kn5write.js:99 writes lodIn/lodOut 0; dds.js is uncompressed (1024² = 5,592,532 bytes by formula); MERGE_CLASSES (acready.js:233) has no props. Could be wrong if A's part 1 finds AC instances repeated models.ini entries cheaply: then props ride as their own kn5 and most of the export cost goes.
→ `exo_memory/handback/p-d493-builder-O_2026-10-27.md`

### V6 (an update that changes only a stale lowP/clipP tag is dropped) is result-equivalent; and a landing's rebase can turn a branch's own new row red when the base deletes what the row counts
2026-10-28, D503 landing — 0 of 265 validate → revalidate → revalidate chains differ under V6 though its branch fires 76,545 times: a stale clipP is the first clipping partner, so any extra carry it allows has an unchanged partner that still clips (validate/index.js:291, :694-698); ruled (a), no row. Then chrome-mute row 3 (E's, ≥10 starters) went red on 0.4.25, which deleted sky-aurora-look.test.js; floor 9 in e905420; pushed t180 main 7dc5917..e905420. Could be wrong if a revalidate ever changes stations before `from`.
General form: check that a mutant the plan calls reachable changes a RESULT before writing a row to catch it; a row never red proves nothing.
→ `exo_memory/handback/p-d503-landing-O_2026-10-27.md`

### A lighthouse landing can merge in the shared checkout itself when the merge's paths miss every dirty file and the index is empty; then main and origin stay one commit
2026-10-28, D505 — t180 0.4.26 released (main 1526a59, tag v0.4.26, installer 4ff5cb59… 8,017,420 B, installed 6a79b59b… = built + stamp, backup 2e187f8b… = 0.4.25); suite 4,019/1 fail (drag-frame row 8, 8/8 alone). lighthouse d504-e merged on main as dfa2464e (2 paths, 0 of 54 dirty, 0 staged) and pushed 74951dac..dfa2464e, so the shared main did not diverge as D496's worktree push left it. Could be wrong if another seat commits between the check and the merge (the window was seconds).
Also: a fresh t180 tree has no src-tauri/dist, so release.cjs needs a cargo check first.
→ `exo_memory/handback/p-d505-landing-O_2026-10-28.md`

### A visit guard that refuses on a rule the invitation never names loses the line silently; name the limit from the guard's own constant, and tell only the refused seat, by the rule's name
2026-10-28, D507 — d507-o 1785df01: visit_text names "under 400 characters" (VISIT_MAX_CHARS); VisitBook.refused carries the rule (a &'static str, never the line) to that pane's next visit, cleared on delivery; 20/20 visit tests; staged d507-1785df01 (sha256 8c9e82bd…6f1e), not swapped. Could be wrong that a named limit is enough: seats may still answer "ok" from the old rule (the record's reading 1), which this does not touch.
→ `exo_memory/handback/p-d507-visit-O_2026-10-28.md`

### A landing scan must cover the scanning pane's own unpushed commits: my D505 hand-back carried 4 private-term lines that its own scan, run before it existed, could not see
2026-10-28, D507 landing — lhpriv.js over origin/main..main: term 8 added 4, all in 655dd422 readers.tap (menu-row names quoting the export game). Origin already holds that term in 441 files, so likely benign; push stopped for a ruling. Could be wrong that the stop was needed: (a) is recommended.
General form: a hand-back committed after its own scan is unscanned until the next landing scans it; scan the hand-back too, before committing it.
→ `exo_memory/handback/p-d507-landing-O_2026-10-28.md`

### A T-180 track can hold 56-63 g for 6 s where Centrifuge spikes 77-90 g for under half a second: the Mach 6 runs out of travel at ~25 g, its box meets the road at ~47 g, and the soft road then holds it ~28 cm deep
2026-10-28, D515 — CRAZY TEST replay against its 15:22Z export (kn5 bfde4dc6, AI 0cb82e6b): piece 13, a descending helix at bank 85°, R 63-76 m, 707-753 km/h; >= 55 g unbroken 7.13 s vs 0.39-0.43 s on four Centrifuge replays; the line-curvature load matches measured (r 0.988) but runs ~8 g low once the box is on the road. Could be wrong that the steadiness is why it held: driver and car not separated.
General form: a load peak and a held load are different limits; measure both before calling a track the hardest.
→ `exo_memory/handback/p-d515-crazytest-O_2026-10-28.md`

### A zone grab on the road must ask the piece what it has: cup and edge channels exist only on flagged pieces, the edge zone starts at the piece's own s (default 0.64), and the pick gives no across offset at all
2026-10-28, D519 Part 1 — t180 ff1d624: pickAt (preview.js:576-585) returns the nearest CENTRELINE sample within 40 px, so no u and often no hit on a rim; sculpt.js:111-112 refuses c and e/er/s on unflagged pieces; document.js:34-43 s in 0.5-0.95. Design: zones 0.2 / s / 0.9 by piece type, direction decides U vs L, a pickAcross in the preview, dots thinned to max(100 m, radius) and 24 px, cap 40 a row. Could be wrong that the keeper wants symmetric width at a rim (the registered falsifier).
→ `exo_memory/handback/p-d519-design-O_2026-10-28.md`

### In a shared checkout, push the scanned sha, not the branch: a librarian commit landed one second after my scan and went out unscanned
2026-10-28, landing — scanned origin/main..3f2959ed (41 commits, all scans 0), pushed main = 310077dd; the extra commit, scanned after, was 2 clean lines. Could be wrong that the gate alone would have caught a hit (it scans keys and words, not the 13 private terms).
General form: git push origin <scanned sha>:main.
→ `exo_memory/handback/p-landing-O_2026-10-28.md`

### A bank that starts at the joint needs its rate eased, not its value: the C2 quintic banked 0.3° in the first 10 m of his piece; a linear ramp with its rate eased over min(10 m, L/4) banks 3.0° there, peaks 0.60 against 1.02 °/m, and stays C2
2026-10-28, D521 — t180 d521-o 866157f; the shape needs knots at l/2 and l from each end (20 m knots make the first span a·s³: 1.41° at 10 m), INSERTED (Boehm) so every other channel keeps its curve; opt-in from the panel only, so Close/Finish and all 17 saved tracks keep their bytes; installed 5e4271ba over E's D524. Could be wrong that the 3× sharper roll onset feels better: the keeper judges.
General form: before installing on a shared exe, read the installed hash; the brief's base can be two installs old.
→ `exo_memory/handback/p-d521-bank-ramp-O_2026-10-28.md`

### CSP documents the direction of only one soft-road key: SOFT_CFM ("the higher it is, the softer"); SOFT_ERP is just "Error reduction parameter", INTENSITY is damage/audio/visuals, and the RIGID flags are rigid only "if set to 1"
2026-10-28, D525 Part 1 — the CSP wiki "Tracks – Collision parameters" (raw markdown kept) and the server-options page; so B/C vary CFM alone (×1/4, ×4), ERP is left, and D (1/0/0) is staged though CSP's words say it should change nothing physical. Could be wrong that RIGID_WITH_BOXES defaults to soft: no default is documented; D515's sinking box is the only evidence.
→ `exo_memory/handback/p-d525-soft-O_2026-10-28.md`

### A banked bend in the reference sections is one symmetric dish (each side ~15° by 10 m out, sides within 1.6°) tilted by the bank, with a 0.33 m lip at each edge; "one side more banked" is the bank tilting the dish, not a per-side edge
2026-10-28, D527 Part 1 — eight bends, every 4 m; figures in our terms only, everything else in the private store. Bank swings up to 81° within 264 m, p90 rates 0.31-1.11 °/m. Could be wrong that it is what the keeper sees: inferred, not asked.
General form: an edge read at a side's very end reads its trim; read the shape inside it.
→ `exo_memory/handback/p-d527-sections-O_2026-10-28.md`

### Inside the lip, the builder's one-s cross-section family already fits the reference sections (median 0.64-1.14 cm RMS, 1.71-2.85 cm max; 178 of 183 stations within 2 cm and 5 cm); per-side s or c gain at most 0.3 cm; the misfit is a 0.33 m stepped lip at each edge
2026-10-28, D527 Part 2 — C's xsecfit.cjs at 6a3f496 on 183 stations of eight bends, every misfit refit from the other families' answers; the falsifier fires: the lesson is along the bend. Could be wrong that the lip is not wanted: the keeper's call.
→ `exo_memory/handback/p-d527-fit-O_2026-10-28.md`

### 0.4.30 reads release-clean on its diff; Bank the bend reads a flight's length as a road's, so a run ending on a jump (or an open track whose head is a flight) is refused with "NaN m"
2026-10-29, D539 review (read only, t180-fresh 9e6a249..dbe69b4) — coreshell.js:1237-1238 against document.js:354 (a flight has no length); the sliced open cannot publish a superseded build (preview.js:184). Could be wrong that it is only a worded refusal: inferred from swingBank's BAD_RANGE guard, not run.
→ `exo_memory/handback/p-d539-review-O_2026-10-29.md`

### The active Mach 6 needs its own checker profile: on the same road it never reaches the mesh (min +1.0 cm at 72 g) where the regular falls 28 cm into it past 47 g
2026-10-29, D544 Part 1 — one run each, same road (AI line byte-equal, road mesh within 0.0005 mm; only the texture differs); the cars differ in coilover end stop (250k → 750k N/m) and travel, not aero, tyres or controllers; h at 55-60 g −18.5 against −40.7 cm. Could be wrong for the active car on another line or driver: one run, no run-to-run scatter.
→ `exo_memory/handback/p-d544-active-O_2026-10-29.md`

### His camera for the at-start ramp looks forward from just before the joint, at the Extend ghost, not back from past it; and the preview draws no cross lines from above at a height that holds 500 m
2026-10-29, D550 renders — matched by eye over nine calibration shots; the ghost read back through t180:ghost-request equals E's bank figures to 0.01° for all six candidates, the candidate set by a serve-time shim of the panel's extendOptions only. Could be wrong about his exact pose: matched by eye, not measured.
→ `exo_memory/handback/p-d550-renders-O_2026-10-29.md`

### Rendered from E's tool documents in Sigil, the six at-start candidates read back E's banks exactly; the tool must run in a clean tree at the tip, because E's worktree held an in-flight extend.js
2026-10-29, D550 update — t180-wt-o550 at a8419d8, documents opened through File > Open against a stubbed native side; |bank| at 10-200 m equals figures.json to 0.01° for A-F. Could be wrong that Sigil reads well enough: the plain road is near-black there; a Glass ghost set is kept beside it.
→ `exo_memory/handback/p-d550-renders-O_2026-10-29.md`

### At E's FIT commit the six at-start candidates render as laid, and B now leans in at the joint (3.2° at 10 m, was 0.6°); a render set made before a HOLD arrived was voided by moving it out of its delivered paths
2026-10-29, D550 FIT renders — t180-wt-o550 at 2ca43d2, Sigil, |bank| at 10-200 m equal to figures.json (5a64f745) to 0.01° for A-F. Could be wrong that Sigil reads well enough for his eye: the plain road is near-black.
→ `exo_memory/handback/p-d550-renders-O_2026-10-29.md`

### On his piece (cup 15.5 on piece 1) the six candidates keep E's bank figures exactly, and the cross lines draw only from about 120 m down, so a 500 m overhead is three stitched tiles
2026-10-29, D550 details of 04:21 — lay-his.js on E's tool at 2ca43d2: sameBankAsE for A-F, piece 1 c 15.5/15.5, w 31/31; overhead tiles from 120 m at 10.07 px/m, seams at 170 and 340 m. Could be wrong that the strip's scale is exact off the road: each tile is its own perspective.
→ `exo_memory/handback/p-d550-renders-O_2026-10-29.md`

### For his pick the at-start candidates must be shown as the Extend ghost in Glass: a placed road draws dark brown in Glass and near-black in Sigil, and only the ghost carries the white cross lines his screenshots show
2026-10-29, D550 camera spec — eighteen renders at 2ca43d2, three cameras each; the ghost's bank equals E's figures for A-F. Could be wrong that the ghost and a placed piece lay the same bank: checked for the bank figures only, not the cup.
→ `exo_memory/handback/p-d550-renders-O_2026-10-29.md`

### The checker's one car profile does not cover the installed T-180 fleet: 3 cars have weaker or no ray downforce, 9 actives run out of coilover range sooner; 6 cars are the reference's physics byte for byte
2026-10-30, D551 — 27 cars' own data (labels C00-C26, key in my scratchpad): colliders.ini equal in all 27; ray downforce -200 in 24, -160 in one, none in two; the actives' coilover min length 0.95 against 0.9. Could be wrong about how much sooner the actives run out: the rest length is not readable, so it is a direction, not a figure.
→ `exo_memory/handback/p-d551-cars-O_2026-10-30.md`

### A seat's CLAUDE.md reads the briefs from the running build's bundled copies, not the repo: a brief edit reaches the seats only after the next build and a respawn
2026-10-30, D556 — room_brief_at reads ~/.consonance, then the bundle beside the exe (target/release, equal to brief/ today), then the repo; five pointer skills on d556-o 0ca3eccd point at masters and commands only. Could be wrong for an installed (not dev) app: there the bundle is the installer's resources folder, refreshed only by a reinstall.
→ `exo_memory/handback/p-d556-skills-O_2026-10-30.md`

### On ELYSIUM the reference replay (10-17 09:30) parses only with a later probe, and checks against today's export by wheel height; the first fleet car measured (C03, group B) holds every MACH6 line it reached
2026-10-30, D560 v1 — wheel-centre height over today's mesh within 4.2 cm per 500 m between the two laps; C03 stop plateau equal, box over the mesh +0.5 cm at 45-50 g (reference -0.9), longest >= 55 g 0.44 s, peak 58.7 g. Could be wrong that the road is unchanged at a finer scale than 5 cm per 500 m.
→ `exo_memory/handback/p-d560-fleet-elysium-O_2026-10-30.md`

### A wheel that goes past a road edge at the edge row's height and comes back can end up under the single-sided road, hanging at full droop with nothing under it (the underskin is scenery), until a lift frees it
2026-10-30, D563 Part 1 — C19 rear-right 6.57 s under (0.23-0.31 m), at full droop the whole time (the airborne droop value), freed by the jump jack, then the car left the road 0.45 s later; the reference car did the same for 0.5 s at s 1,926. Could be wrong that AC's tyre contact cannot see a road above the wheel centre: inferred from the 6.6 s hang, not from AC's source.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md`

### The wheel that ends up under the road got there over the edge: 0.86 m (±0.03) past the mesh edge for 0.20 s, dropping 0.68 m against the edge row, then back in 0.32 m below it
2026-10-30, D563 final aim — entry.js against the mesh's own edge (u -17.10 m; the AI footprint sits 0.40 m outside it); then 27.6 m inward under the road over 1,236 m, freed by the jack. Could be wrong by the wheel-centre term: blackbox's recorded wheel position is taken as the physics centre, inferred.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md`

### On ELYSIUM the recorded lap misses the 3.45 m top-down sector-2 segment too (by 3.85 m), so that miss does not explain the unrecorded lap; and no markers rule checks a gate's top-down width
2026-10-30, D565 — gates.js on three laps: TIME_2 top-down misses of 3.85 m (recorded) and 4.27 m (not recorded), both through the plane within 3.5 m; TIME_2 passes every checks.js rule; the Oct-22 document opens through D.parse (corrects D563). Could be wrong if AC tests the gates in a way none of these reproduce.
→ `exo_memory/handback/p-d565-gates-O_2026-10-30.md`

### On ELYSIUM the plan's 15° bar puts sector 2 on a 14.8° cupped stretch (28.94 m wide, laps 4.6-5.0 m off the line); a 2° bar finds level road at s 12,958 (31.73 m), but the sectors stop being thirds
2026-10-30, D567 — t180 d567-o acc9280: tools/kn5-move-gate.cjs rewrites only the two gate matrices (88 bytes; 182 meshes, 29 other dummies, 8 other files identical); 8 tests, mutants 13/13/0; both laps cross the new gate inside it at 2.2-2.8 m. Could be wrong that the gate is why laps do not count: the keeper's lap on ELYSIUM GATES decides.
→ `exo_memory/handback/p-d567-gate-patch-O_2026-10-30.md`

### A car can go through the soft road with all four wheels on top, 1.5 m from the edge: C07's box sank steadily (~1.6 m/s) past the reference's -11 cm plateau and broke at -16 cm, then was thrown ~54 m/s out the underside
2026-10-30, the chair's 00:39Z re-aim — helixtrace.js on raw frames, the station frame held at t 59.82: 4 frames, ~125 g, after a 62.87 g peak; the reference held at 55-60 g, C05 peaked at 52 g. Not the D563 edge mechanism; the apron does not touch it. Could be wrong that sinking rate, not load, separates the cases: two held passes and one break.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md` (C07 through the helix)

### Box depth does not separate a held helix from a pass-through: C09 held a -15.9 cm plateau at 60 g where C07 broke at -16 cm still sinking ~1.6 m/s; C09 then went off the left edge and was launched out the top by the wheel trapped under
2026-10-30, the 18:45 replay — helixtrace.js / entry.js on C09; four held passes, one broken; C09's excursion 0.595 m past the edge (inside the apron's 2.0 m), w2 0.78-1.44 m under for 0.77 s, +24.7 m/s along the normal. Could be wrong that sinking rate is the separator: one broken case.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md` (C09)

### C09's helix is a third shape, the box-under ride: box 13-16 cm under for 0.58 s at 58-63 g, all wheels on top, then a 17° yaw as the box came out
2026-10-30, the chair's 00:48Z ring — table.csv runs below depth (C09 0.58 s under -10 cm; reference 0.30, 0; C05 0) and helixtrace yaw/vel-dir: -21 -> -39° while the path turned 3°, as the box rose -13 -> -3 cm. Could be wrong that the box leaving caused the spin: no driver inputs in the replay.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md` (C09 again)

### The second broken helix pass confirms the separator: the box's sinking rate at −11 cm, held ≤ 0.63 m/s (4 passes), broke ≥ 1.66 m/s (C07, C11); speed, load, depth and bank position do not separate them
2026-10-30, the chair's 00:58Z ring — sinkrate.js (raw box, 3-frame rate, read to the raw break) and helixtrace.js on C11: box at the surface at its 57.67 g peak, sinking 1.75–2.5 m/s, broke at −13 cm, thrown −54 m/s along n and −48 along T, as C07. Could be wrong with more passes: 6 in all.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md` (C11)

### The Mach 6 at C07's pace held the hardest pass yet (64.61 g, 1.18 s ≥ 55 g, box −14.9 cm) because its box crossed −11 cm at 0.15 m/s; now 5 held ≤ 0.63 m/s, 2 broke ≥ 1.66 m/s
2026-10-30, the chair's 01:05Z ring — sinkrate.js and helixtrace.js on the 19:04 replay; no wheel under anywhere in it; exit yaw against path −16.3° (C09 −33.7°, reference −15.6°). Could be wrong with more passes: 7 in all.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md` (C00 at 19:04)

### On STIFF (SOFT_CFM ×¼) C07 held the helix at 64.9 g for 1.54 s with its box +4.5 cm OVER the mesh (soft: −16 cm and through); both falsifiers stayed silent; its run then ended on the edge mechanism before reaching the moved gate
2026-10-30, the chair's 01:31Z ring — helixtrace/sinkrate/wheel.js/entry.js on the 19:30 save; race_out.json laps 0; gates.js: TIME_0 and TIME_1 crossed inside, TIME_2 never reached. Could be wrong for other cars or passes: one pass of one car.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md` (STIFF); `p-d567-gate-patch-O_2026-10-30.md` (validity)

### Four measured edge excursions now size the apron: 0.31, 0.54, 0.595 and 0.86 m past the mesh edge (all inside 2.0 m), centre 0.19-0.59 m below the edge row at the peak
2026-10-30, the chair's 01:32Z addendum — entry.js on C07 on STIFF (rear left at s 9,176, rear right at s 11,303; 0.195 s and 0.270 s outside), beside D563 and C09. Could be wrong for a faster or steeper exit: four events, 640-740 km/h.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md` (STIFF (2b))

### Both cars that went through on the soft road held the helix on STIFF (box +4-5 cm over the mesh at 65 g); C11 on STIFF took two one-sided hops at new places on piece 29 that no soft pass took, confounded by car; and it crossed the moved TIME_2 inside
2026-10-30, the chair's 01:44Z ring — hoplap.js (the hop signature recurs at the same places on every lap; only s 17,026 and 17,458 are new, and only in C11s), seam.js and profile.js (no seam or kink there), gates.js on C11s. Could be wrong that the hops are the car's and not STIFF's: no same-car soft pass exists there.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md` (STIFF, the second car); `p-d567-gate-patch-O_2026-10-30.md`

### A complete lap on GATES STIFF counted (2:24.509, three splits, cuts 0), but the game's split 2 ends at s ~17,512, not at the moved gate, so the lap does not prove the gate was the fix; and the Mach 6 on STIFF took no hop on piece 29
2026-10-30, the chair's 02:01Z ring — race_out.json and laps.ini copies; gates.js / gates-far.js; the installed kn5 hashed d41a9f41. The gate test is C03 on a GATES folder. Could be wrong about the split if AC times sectors by something these reads do not model.
→ `exo_memory/handback/p-d567-gate-patch-O_2026-10-30.md`; `p-d563-wheel-under-O_2026-10-30.md` (STIFF, the third car)

### On CRAZY TEST soft_b (CFM 0.00005) C07 held the helix at 71.23 g / 842 km/h for 6.34 s with its box +2 cm clear at every load, riding like the active car on the soft road (the soft road's Mach 6: -25 cm)
2026-10-30, the chair's 02:25Z ring — crazy.js / sinkrate2.js on the variants' own export; both falsifiers silent; also found: the wheel readers cast along the AI centre normal and are invalid on cup walls past ~60 degrees (pieces 4-5), where table.js has the box 7-43 cm over. Could be wrong for C11 or at a still higher load.
→ `exo_memory/handback/p-d563-wheel-under-O_2026-10-30.md` (CRAZY TEST, soft_b, C07)

### CI for t180 is one script and one workflow: the fast subset (277 of 302 files, 20.8 min here, clean profile) on every push, the 22 mutation harnesses weekly; and land-0431 is already red on menubar-page row 17, so the first CI run will be too
2026-10-30, D579 — d579-o 94b5092; test-fast.cjs excludes by name (mutation, 3 frame-timing pages); Node pinned 24.14.1 from the repo's own Node-24 dependence; actions v7 from the releases API (my first draft said v4). Could be wrong that no test needs this machine: the clean-profile run is a stand-in, not a runner.
→ `exo_memory/handback/p-d579-ci-O_2026-10-30.md`

### Extend's boxes read "early" with a tooltip per row read from extendOptions: F (~235 m) for bank, cup, edges and (once d574-c lands) width; 20 m for turn and climb rates, edge start, tube; and nothing for a turn or climb read as a corner
2026-10-31, D581 — t180 d581-o 93d6fe7 + 0e75289; 116/116 touched tests; render with the bank tooltip drawn from the box's own title (an OS tooltip cannot be captured headless). Could be wrong for width until d574-c lands: on d576-a width is still 20 m.
→ `exo_memory/handback/p-d581-early-O_2026-10-31.md`

### The drag tick is capped at 35 ms (about 28 a second; a row red at 4), and every title in t180 now shows in a hover card drawn by each look's own menu rule, 4.5:1 or better in all six looks
2026-10-31, D581 additions — d581-o 5e90523 (tick: sound tests 44/44 + 14/14) and e94cc90 (hovertip.js: one document listener, the title moved to data-tip only while hovered; hovertip.test.js 6/6, texture-page row 10 worst 5.82 in aqua). Could be wrong that no page test reads a hovered element's title: the full suite at landing is the check.
→ `exo_memory/handback/p-d581-early-O_2026-10-31.md` (§tick, §hovercard)

### A pane now wakes holding the code map of each repository its newest packet names, found from the packet's own paths (t180 with no path is said, not guessed), seated ahead of the deck; it is the wake, not the delivery
2026-10-31, D585 — lighthouse d585-o 83b7d1af: latest_packet / packet_repo_maps / repo_map_section in assemble_intake_for; BUILDING.md dispatch item 9; cargo repo_map_tests+intake+fork_note 48/0/2. Could be wrong that the lighthouse map in most wakes is worth the deck it displaces: the D4 instrument can say.
→ `exo_memory/handback/p-d585-map-intake-O_2026-10-31.md`

### The checker's retained heap was its per-segment memos, not its findings: packed into Float64Arrays it fell 1,016 → 506 MB on ELYSIUM and 476 → 295 MB on a 100 km lap, every finding byte-equal
2026-10-31, D587 — t180 d587-o b6fa925: heapstage.js dropping each holder then each memo (heap + ArrayBuffers); raw.pts's 809,883 findings were ~99 MB, the cup blends' one-object-per-u constants 483 MB, the stacked points 205-248 MB; 11/11 documents' checker and validate() JSON sha256-equal; validate_heap.test.js red at acaa2a0. Could be wrong for a track whose memos are mostly normMemo (165 MB, not cut).
General form: a heap gauge must count ArrayBuffers, or a cut to typed arrays scores memory moved out of sight as memory saved.
→ `exo_memory/handback/p-d587-validator-heap-O_2026-10-31.md`

### The apron's flat flap was a plank off the frame's lateral; drawn instead as a lip off the edge's own segment, the crease went from 53,070 of 53,070 rows over 5° to 0, the driven physics byte-identical and hidden, and the pit lane one outline
2026-10-31, D593 — t180 d593-o 97ab62e: on his ELYSIUM the base plank met the edge at a median 55° (rim 30-60°: 69°, max 82.4°), the lip at 2.08°; the 57 physics apron meshes are byte-identical in his own kn5, the base and the cut (kn5cmp.js), +1 new 1ROAD_APRON_PIT_R; rows red at a93ae51 2/13/14/15/16, 17/17 after; harness 11/11/0. Could be wrong that AC still collides with a non-renderable 1ROAD_ mesh (inferred from catch.js, not run in the game).
General form: where two strips meet along a line at different vertices, the downforce-ray check reads the line as a gap; share the vertices (a fan from one point), do not just make the lines coincide.
→ `exo_memory/handback/p-d593-apron-shape-O_2026-10-31.md`

### A pit lane that starts square at full width cannot be edged like the road; tapered from 5 cm over its diverge it has one open edge, and with every join's skin hung along the road frame's up nothing clips
2026-10-31, D593 pit — t180 d593-o ae6d262: on his ELYSIUM, clips round the lane 0 drawn / 0 physics (intersect.js), open surface edges round the ends 0/0 (his kn5: 20/20), main physics 57/57 byte-identical; skins on each surface's own normal clipped 49 times, a mean at shared points 53. Could be wrong for a lane whose diverge is short against its width (the taper's slope grows).
General form: offset sheets hung from one crease along different normals cross on the crease's convex side; hang them all along one normal there.
→ `exo_memory/handback/p-d593-apron-shape-O_2026-10-31.md`

### Correction (2026-10-31, D593): the pit-lane construction above (ae6d262) is not on d593-o; A owns the pit lane, and 43539d0 reverts it there. It stays in history as A's reference.
→ `exo_memory/handback/p-d593-apron-shape-O_2026-10-31.md`, section "A owns the pit lane"

### Correction to my 2026-10-31 line "ae6d262 is not on d593-o": it is again, via 9cb2adf (the revert of the revert), tree identical to 18b1774
2026-10-31, D593 — `git diff --stat 18b1774 9cb2adf` empty. Also wrong that day: "fixtures 0 of 9" — the seal's row reads F1 F2 kn5 changed since 97ab62e; my instrument never compared that digest.
→ `exo_memory/handback/p-d593-apron-shape-O_2026-10-31.md` §"The rulings of 00:54Z and 00:55Z"

### "Stripes" and "a notch" on a road surface can be uvs, not geometry: one u per piece from a blended profile stretched the pit merge 80×, and a lip stepping between two uv spaces in one row squeezed 82 repeats into 2 m
2026-10-31, D593 — overlap count 0 at both spots, a mip bias left the stripes unchanged, the picked mesh's |∇u| was 0.00125 a metre against the road's 0.1; t180 d593-o 6a0e6f7, b1e95a8, rows 19 and 21 red first. Could be wrong for other blended pieces (mesh.js:263 lays every blend this way; only the lane was fixed).
General form: before calling a visual defect geometry, pick the pixel and read what lies there; my own renderer culled by normals where AC culls by winding, and drew cracks that were not there.
→ `exo_memory/handback/p-d593-apron-shape-O_2026-10-31.md`

### A seal amendment can hold its bound live: record each kept mesh node's own bytes from the base, rebuild now, and compare by name
2026-10-31, D593 seal — t180 d593-o 708f2fa: kn5nodes.js digests each mesh node's record (and again with its four flags zeroed, for a node only hidden); the row caught a 1 cm skin move and an un-hidden apron. Could be wrong for a change that moves a node between chunks (the names would shift; F2's mesh-cap split shows they can).
General form: an amendment that only checks its own recorded measure guards nothing after it lands; one that rebuilds and compares keeps guarding.
→ `exo_memory/handback/p-d593-apron-shape-O_2026-10-31.md` §"The seal ruling, 01:32Z"

### A kn5 node can change bytes without changing: inserting a material ahead of others renumbers every later node's material index
2026-11-01, D593 re-pin — the three 1ROAD_CATCH_ nodes differed only in material index 5 -> 6 (same name, same geometry, same material) after the lip shade was inserted before t180b_catch; t180 d593-o 02081e4. Could be wrong if a reader keys by index rather than name.
General form: a byte digest per node reports a renumbering as a change; read the field before calling it one.
→ `exo_memory/handback/p-d593-apron-shape-O_2026-10-31.md` §"The re-pin, 03:17Z"

### A cap fanned from one point inside a thin wedge is at most spacing x sin(wedge) thick, whatever the third point; the sliver floor sets the spacing
2026-11-01, D593 overnight: t180 d593-o 8dd5029, the pit lane's end caps. The plank's wedge is 25 deg, the join's 12 deg, so the lane's 8 end-row spaces need 4.8 cm, a 0.39 m start; at 0.1 m they were 0.5 cm, and a single long triangle instead cracked as a T-junction my hole count had credited as closed (now strict). Could be wrong if a different cap topology (graded rows) avoids it: not tried.
General form: a hole count that credits T-junctions hides the cracks a renderer shows; count strict, and pick the pixel before calling a mark geometry or renderer.
→ `exo_memory/handback/p-d593-apron-shape-O_2026-10-31.md` §overnight

### The road as a solid slab costs his ELYSIUM no physics byte and no seam: skin at the plank's drop (0.93 m), 89/89 road physics same, strict drawn open edges 0, clips 0 except the one overpass (14 → 36, ruled kept)
2026-11-01, D604 — t180 d604-o 66b04aa; isocmp, defects, openedges STRICT, slabcheck over his ELYSIUM's export; harnesses apron 17, underskin 9 (new), acready 10, NOT APPLIED 0. At slab depth a flat lane's end points go collinear: a fan
replaces the zero-area cells (thinnest 0.0609 m against the 0.01 m floor). Could be wrong for a track with a convex edge under 0.93 m radius: row 24 covers the core's floor (e −30, s 0.9), not his saves.
General form: a camera kept from a previous lap can be blind to the new change; compare before/after bytes before calling a render pair evidence.
→ `exo_memory/handback/p-d604-slab-O_2026-11-01.md`

### A hull bottom hung at one depth cannot leave a plank tip and run smoothly under a rising edge: both ends are steeper than the chord, so it must make an S; deepen the skin under the edge
2026-11-01, D604 hull — the keeper's red line (1.68 m under the centre, ~2.1 m under the road edge). At 1.5 m all across, the Hermite run from the tip showed a shoulder (hull1). hullDepth = drop + 2 m·tan(rim + 5°), capped 3 m, eased over 4 m, made it only flatten (hull3/5/6). Its end tangent must be the deepened skin's, not the road's, or a corner sits under the edge (hull2). t180 d604-o e911792; 211/211, harnesses 12/20/10 caught, NOT APPLIED 0; physics 89/89; overpass 14 → 80, all within 6.2 m.
Could be wrong for steep cups past the 3 m cap (rim ≥ 44°): there the chord can be shallower than the skin and a slight S returns (his 57° cup read smooth).
General form: read a drawing's depth at more than one point before choosing the depth rule; a sketch's shape lives in how its depth changes, not in its centre value.
→ `exo_memory/handback/p-d604-slab-O_2026-11-01.md`

### The pit notch was the lane's 0.5 m end (8fb6ecc's TAPER_MIN_W) under a plank that walked across it; a tube's skin cracked at every joint from decimated chords and a centre normal half a column off
2026-11-02, D604 follow-up — t180 d604-o a48e41e (the notch), f1f3416 (the tube).
- The taper alone, back at 0.1 m, removed the notch on e911792.
- C's tube test is 7/7 on f1f3416 (red on e911792 in rows 2–4).
- His ELYSIUM changes exactly the four drivable meshes; his CRAZY TEST changes 2 of 39 planks (the taper at its wall sides).
Could be wrong about the margin: the joint rows meet within 1.87 mm, against the test's 2 mm cover.
General form: a mutant that blanks a result can be undone by the next step, which rebuilds it; check a "not caught" against the output before trusting it.
→ `exo_memory/handback/p-d604-slab-O_2026-11-01.md` §notch part 2, §tube

### The Pieces "mirror on insert" box sat in a slider's grid column (.picker), so it stretched to 329 px; as the menus' own .menu-check it is a 13 px box beside its words
2026-11-02, D612 — t180 d612-o c2d3880: six looks headless, box contrast 1.09-1.7 → 4.2-19.6, toggling and the saved key unchanged. Could be wrong for a look added later with its own checkbox styling.
General form: a control inherits the layout of the wrapper it sits in; check what the wrapper's columns were made for.
→ `exo_memory/handback/p-d612-mirror-checkbox-O_2026-11-02.md`

### A saved track's own name field can be "untitled": the page exports under the Save field's name, so a headless export must give the shell that name, and its slug is the folder
2026-11-02, D613 — TEST 10 from 6f0969e installed as content	racks	180b_test_10_0438 (10 files, sha256 equal staged and installed, 0 refusals). The edge fit was read from his own installed kn5's texture name (off). Could be wrong for a track whose saved Save-name differs from its slug.
→ `exo_memory/handback/p-d613-test10-preview-O_2026-11-02.md`

### Of 85 open laps, 68 were done and only never filed; a "retake" baton row is written to every lap in working, which keeps them from ever reading stale
2026-11-02, D620 — chain-status openLaps over lap.jsonl: 85 open (44 stale); 36 of the filed ones in a release tag (matched by subject: landings re-commit). All 32 "delivery-unconfirmed" dispatches were received: the chair writes its row seconds after the pane's, past a 1800 ms window. Could be wrong for dispatches before the 10-30 anchor (not read).
General form: a count of "unconfirmed" is only as good as the signal it waits for; check the receiver's own record before believing a sender's timeout.
→ `exo_memory/handback/p-d620-stale-laps-O_2026-11-02.md`

### A station gate that cannot name the lap a call serves forces the caller to hold every lap; give the call its lap and gate on that one
2026-11-02, D621 — lighthouse d621-o 5c1aa36e: chair_inject reads its lap (arg, "Ledger Dnnn", first id) and is refused only when that lap is open and another station holds it; the inject receipt reads the pane's own user row on the board first. cargo test 1175/0. Could be wrong for a packet that names two laps without a Ledger line (the first wins).
→ `exo_memory/handback/p-d621-bookkeeping-O_2026-11-02.md`

### A lap read from free text must not open a gate the way a named lap does: "D615 is done; also" names a lap it does not serve
2026-11-02, D621 bounce — lighthouse d621-o 846df413: LapSource Named (lap argument, "Ledger Dnnn") keeps the filed/new allowance; Inferred (first id in the text) counts only if open, else the old any-lap rule. Two rows red at 5c1aa36e; cargo 1181/0. Could be wrong for a packet whose Ledger line itself names the wrong lap (Named is trusted as stated).
General form: an allowance keyed to a value is only as safe as the way the value was found; carry the provenance into the decision.
→ `exo_memory/handback/p-d621-bookkeeping-O_2026-11-02.md` §Gate fallback

### A scan that only prints its count does not stop a push chained after it: my landing note went out naming a private term the scan had just counted
2026-11-03, D621 landing — lighthouse main 5c64caf1 pushed clean; the hand-back note 0352f872 quoted a term from the dispatch, lhpriv read total 1 and the four-term grep 1 0 0 0, and the `&&` chain pushed anyway; fixed forward at a6d2c6da, history not rewritten (the keeper's call). Could be wrong that it matters much: origin already held the term in 1 file.
General form: a scan in a chain must exit nonzero on a hit; and the hand-back is part of the range, so do not quote a private term while reporting its count.
→ `exo_memory/handback/p-d621-bookkeeping-O_2026-11-02.md` §Landing

### From a wheel on p41's apron the new hull cut looks almost like the old export: the cut shows from beside the road and in a slice, not at wheel height
2026-11-02, D622 — textured renders of ELYSIUM old (a7c986de) and new (384fdb1f, still 33 pairs by A's int616) from identical cameras; the x-ray of the 26 crossing hull triangles shows ~6 m through the apron beside the road against one small old patch; the cut at x 38 shows the hull through the apron. Could be wrong for a driver whose eye sits higher than 0.4 m, or on another part of the apron.
→ `exo_memory/handback/p-d622-crossing-renders-O_2026-11-02.md`

### What runs every turn mostly fires without changing anything: of 10 pulse item classes only QUEUED moved a seat, and the owed lines are unactionable because idle seats get only "not work" keep-warms
2026-11-03, D627 part 3 — 5,241 prompts since 10-20 (scan.js/analyze.js); STALE 4,577 fires, 1 indirect use; trailer note 935, 0 changes, compliance fell 45%→3%; sources-gate 1,783 silent warns; UNRECEIVED false 15 h; digests (167 librarian cites) and QUEUED earn. Could be wrong where a seat acted on the pulse without naming it.
→ `exo_memory/handback/p-d627-p3-everyturn-O_2026-11-03.md`

### A continuity test keyed only to files cannot measure what only the carried conversation holds: every key in my 34 questions is in a room file the ROOM arm may read
2026-11-03, D627 part 4b — 34 questions (state 7, his words 12, judgment 9, lesson 6), keys path:line in the librarian notebook 1628-1776, where_we_are and plan_room_value, pinned at d0ee92de; questions sha256 6a599d28…9584. Could be wrong if the ROOM arm cannot find the notebook lines in practice, which is what the test measures.
→ `exo_memory/handback/p-d627-p4b-questions-O_2026-11-03.md`

### An owed seat now gets a work turn at its keep-warm, read from the pulse's own collation; every other visit is byte-identical, and nothing on the path can compact or restart a seat
2026-11-03, D628 — lighthouse d628-o 82da03fc: chain-status --owed-json (owedVisit) agrees with the live pulse (4 of 5, owing O); cargo 1186/0, chain-status 155/155, mutants 13/13 after J4 (pre-anchor pointer) survived the first run and got a row; staged exe ff9fa00a…59f8, not installed. Could be wrong that 50 min of idle is soon enough: timing is unchanged.
→ `exo_memory/handback/p-d628-owed-visit-O_2026-11-03.md`

### The pulse prints only what moved a seat (QUEUED, the hand-back counts, HANDBACKS IN, and the unnamed faults); the trailer note now reaches the sender, who can fix it
2026-11-03, D633 — lighthouse d633-o 37c82dbd on d628-o: chain-status CLI default trimmed (live 522 → 75 chars), --full keeps the whole line; trailer note in the sender's tool result, receiver gets the message unchanged; cargo 1189/0, chain-status 161/161, consumers green, mutants 13/13. Could be wrong to keep delivery-unconfirmed: named neither way, D627 found it harmful.
→ `exo_memory/handback/p-d633-pulse-trim-O_2026-11-03.md`

### The run's frame is on screen (late timer line, LOST and SAVED cards, "The Absolute", F to tighten the beam); and I killed P's exclusive timing session with a taskkill /T on a reused PID
2026-11-13, D675 — dreamzone-3 o-run-frame 7500a26 on 31d1c6d: world_app_tests 61/0, self-test 52/52, mutants 17/17, three stills on G:; the timer row found the HUD clock's "0:60.0". The kill: /T walked a stale parent id into 5824 (P's bench), and the output was cut with head. Could be wrong that the PID was reused: inferred, the processes are gone.
General form: stop your own job by the handle or the exact PIDs you started; never a tree kill by a bare PID, and never cut a kill's output.
→ `exo_memory/handback/p-d675-run-frame-O_2026-11-13.md`

**2026-11-13: five-branch landing held on two reds; and a portable-paths red must be classified by its PATHS, not its rows.** The suite on da225e0d gave 195 green, 1 failed, 1 crashed of 199. universe-print breaks at lap-i-p's multi-line install.ps1 row: 16/0 at 92647969, crash from dc89ba50. portable-paths names only heavy-run.js:404, from the guard I landed at 0fedf4d3; I had called its rows base-red at the guard landing, and the guard merge actually carried 4 paths, one of them its own. Could be wrong if the 404 text is meant to be baselined, but it was red, and I called it base.
→ `exo_memory/handback/p-land-five-O_2026-11-13.md`

**2026-11-13: six branches landed and pushed as fab53587. A credential-prefix count in a range scan is a NAME until a token run follows it.** Suite on 4cca2ee3: 197 green, 0 failed of 199. The range scan counted sk-or- and the other prefixes 8-12x; every hit sat in a landing hand-back, followed by a token run of 0. Could be wrong if a key were split across lines, but credwhere.js checks the run on the matched line only.
→ `exo_memory/handback/p-land-six-O_2026-11-13.md`
