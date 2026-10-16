# T-180 back to the panes: lap D330 (librarian, 2026-10-15 17:3x)

The keeper, verbatim: "we are moving track building work back to the panes, third place got you a catchup md".
The source is `C:\Users\nname\Downloads\t180-handoff\CATCH-UP.md` (141 lines, written ~17:00 by the Third Place), read
in full by the librarian. Beside it are `row8-finish-roll.test.patch` and `harness/`. Every number below is the Third
Place's, named with its run; panes re-run before they quote one.

## Where things are (from CATCH-UP.md, checked where marked)

- **Repo:** `C:\Users\nname\Downloads\t180-track-builder`, branch `feature/denser-asphalt`. Pushes go to `origin main`.
  - **`Desktop\t180-track-builder` is a stale clone. Never touch it.** checked by the librarian: 22 commits behind
    origin.
- **Released:** v0.3.6, main `5aa226d`, tag `v0.3.6`.
- **Unpushed since:** 13 commits, all described in CHANGELOG `[Unreleased]`.
- **Installed:** `%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe` is `6c37902`, with `.exe.before-<name>`
  backups beside it.
- **Full suite:** `npm test`.
  - The librarian ran it twice this afternoon: 2800 of 2814, about 37 min.
  - The one fail is the pre-existing BANK_RATE test, which reads a gitignored `reads/rainbow_rd.read.json` that this
    clone lacks.
  - `test/core_water_mutation.test.js` failed once under the full load, and passes 20/20 alone.

## The keeper's firm rules for this work (CATCH-UP.md:27-44), binding on every pane

1. **Never steal focus.** He races while the builder runs.
   - Every browser and harness runs headless (`--headless=new`).
   - No `bringToFront`. No GUI window unless he asks.
   - Even `chrome.exe --version` without headless hands off to his Chrome.
2. **No push without his word, every time.** The credential scan runs before any push.
3. **Public text in our own words:** no quotes of him and no "the keeper" in the changelog or release notes.
4. **Obvious, measured, reversible builder fixes:** do them, then report. Ask before deleting or overwriting his data.
5. **Test first:**
   - reproduce a bug in a failing test;
   - change a test only when it is wrong, and say so;
   - run the full suite for core maths;
   - keep CHANGELOG.md current.
6. **Prove a fix with a measurement before calling it fixed.**
7. **Install only while the builder is closed** (`Get-Process t180-track-builder`):
   - back up the current exe;
   - compare hashes;
   - build with `cd src-tauri && ~/.cargo/bin/cargo build --release`.
   For this lap, installs wait for the librarian's collation.

## How the panes share one clone

Each pane works in its own git worktree off `feature/denser-asphalt`, at `C:\Users\nname\Downloads\t180-wt-<letter>`, and
commits there by named paths. The chair lands the worktree branches into `feature/denser-asphalt` after the librarian's
read. Nothing is pushed.

## Lap D330, wave 1, all four in parallel

1. **A, FIRST, Finish lays its roll too short** (CATCH-UP.md:46-66).
   - Apply `row8-finish-roll.test.patch` and see it fail on 6c37902 ("worst roll rate 1.131°/m, amber 0.9338").
   - Fix `src/core/finish.js:117`: size the roll by its measured peak, not its average. The way the catch-up prefers:
     lay it, measure it with the validator's own `rollRates` (`_internal`), and lengthen it until it is under amber.
   - Then ELYSIUM's fixture (`harness/fx/eq-ELYSIUM.t180track`) closes with 0 roll reds, measured with
     `harness/node/rollprobe.js`.
   - This is core maths: the full suite, plus a mutant of the sizing.
   - CHANGELOG entry.
2. **B, the two test faults found in the librarian's audit.**
   - The BANK_RATE test depends on gitignored data. It skips with a stated reason when its `reads/` file is absent, and
     the README or test header says how to get the reads. This changes a test because the test is wrong for any clone
     without the data; say so in the commit.
   - `core_water_mutation.test.js`, load-sensitive: find what times out under load, and make it robust without
     weakening any caught mutant.
3. **C, memory headroom, the catch-up's first lever** (CATCH-UP.md:105-110).
   - The preview mesh's boundary rows (`vertex()` `{p,n,q}` objects, about 433 MB on ELYSIUM) move into typed arrays, out
     of V8's 4 GB pointer cage.
   - It touches `rowWith`, `rowsOf`, `meshSeam` and the reuse paths, so the mutation suites must stay at their counts.
   - Measure with `harness/livesites.js` and `isoheap.js`, headless, before and after.
4. **E, the window-thread pause** (CATCH-UP.md:114-117). `proposeClose` (finish) takes about 4.5 s on the window thread.
   - Move it to a Web Worker, as the checker went in `7512f84`.
   - Measure the window's longest frame gap through Close with `harness/closefreeze.js`, headless, before and after. Its
     summary regex has a bug; fix it or read the marks.

**Not in this lap, held for the keeper:**
- the "export anyway (I drove it)" button (he hasn't answered);
- release 0.3.7 (on his word);
- ELYSIUM's stacked-within-2m reds;
- To floor from a down-sloping end.

Then the librarian reads all four, the chair lands them, the full suite runs on the landed branch, and an install waits
until the builder is closed.

## D330 addendum: the keeper on the reds (librarian, 2026-10-15 17:4x)

The keeper, verbatim: "those reds shouldnt be real, the whole track works perfect at max speed, except for the part obv
that is at the end not being connected, which means the part that tells us what is too much or detrimental was based on
the track geometry made by hand from other creators, dogeish was the best, and we measured our surface to be 7x as
smooth, meaning we can take more Gs than the system says we could since the tracks are made better than where the
telemetry came from where we based our assumptions upon".
Read, and two separate things:
1. **The load and roll limits are calibrated on hand-made tracks.** That is true: FINDINGS.md §4–5 sets the ~20 g and the
   proven ~90 g from laps on the learning library, which is ohyeah2389's, Dogeish's and Onuris (FINDINGS.md:280). On a
   smoother surface the same car sees lower peak loads, so those bars are conservative for builder-made roads. **The
   librarian could not find the "7x as smooth" measurement on disk** (searched docs/, CHANGELOG and the room's corpus).
   The keeper is asked where it lives, so the recalibration stands on it.
2. **ELYSIUM's two remaining reds are a different check:** `stacked-within-2m` at about 22.7 and 23.7 km
   (ARCHITECTURE.md:85, "drivable surfaces stacked within about 2 m", under "red, for known breakage"). It is geometric,
   not a G limit. The keeper drove the whole track at max speed, so at those two places either the clearance is enough for
   the T-180 and the 2 m is too strict, or the check is pairing surfaces that don't really overlap.
**To B, added to its wave 1 part:**
- Find what pairs the stacked check makes at 22.7 and 23.7 km on harness/fx/eq-ELYSIUM.t180track: the two stations, their
  vertical and lateral gap, and which surfaces they are.
- Measure the T-180's actual clearance need from its open config (car height plus a margin), and set the check against
  it.
- If the reds are false at those places, fix the check, red first on a fixture, and keep the true case red (a road laid
  through another).
**The limits recalibration** is the next lap, once the smoothness figure's source is named. It will draw on ELYSIUM's own
max-speed laps as telemetry.

## D330 queued: every scrub and scroll lands on 0.01 (librarian, 2026-10-15 17:4x)

The keeper, verbatim: "also big bug to queue. when scrubbing a turn from say a 1000m straight, it jumps to 0.08 instead of
0.01, and isnt a completely precise scrub or scroll. I need every one to be."
Read in `app/core/handles.js:37-57`: every handle's `step` is 0.01, but its `perPx` (the value one pixel of drag moves) is
bigger:
- turn 0.083 and climb 0.082 °/100 m per px, so one pixel is about 8 steps: **the 0.08 jump the keeper sees**;
- bank 0.45° and cup 0.24° per px;
- length 0.42 m and width 0.068 m per px;
- the landing handles 0.05–0.15.
inferred: no drag can land on every 0.01, because the mouse moves in whole pixels.
**The fix, to the first pane free in D330 (the chair picks):**
1. **A precise mode for every handle:** each pixel of drag moves exactly one step (0.01) while held fine, so every value is
   reachable. The keeper picks the gesture; the default proposed is Shift, or a slow drag reading as fine.
2. **The scroll wheel over a handle**, and the arrow keys while it's held: exactly ±0.01 per notch or press.
   - Ctrl keeps its round-number snap.
3. The coarse drag stays for big moves.
4. **Tests, red first:**
   - on a 1000 m straight, a fine drag of n px moves turn by exactly n × 0.01;
   - one wheel notch is 0.01 on every handle kind;
   - the value after any sequence reads to two decimals with no skipped step.
   A mutant goes back to perPx.
5. It is UI, so targeted tests (no mutation run beyond the one above), measured, then reported.

## D330 queued, same pane: a long length drag gets interrupted (librarian, 2026-10-15 17:5x)

The keeper, verbatim: "and then when I continue to lengthen the track, sometimes my mouse move gets interrupted by
something and ruins the smooth flow making the track longer, i have to let go of click, and click the drag again to continue
making it longer instead of doing it in one smooth motion".
Read in `app/core/handles.js:260-269`, "a drag never runs out of screen": when the hidden cursor has travelled WARP_PX, it is
put back at the grab point through the native window, and the travel is kept in `acc`. **Moves are ignored until the
cursor is seen back at the grab.** If it isn't seen within WARP_WAIT_MS, or the native call fails, the travel is given back
(`giveBack`) and **the drag stops warping for the rest of the grab** (`noWarp`). Then it stalls at the screen edge, which
matches "I have to let go and click again".
- inferred, the librarian's hypothesis to test, not a finding: on a long piece the window thread is busy rebuilding the
  preview, so the "back at the grab" move arrives after WARP_WAIT_MS, and one late frame switches warping off for the whole
  drag. It also takes back the travel, which reads as a hitch.
**To the same pane as the precise-scrub fix** (both live in handles.js, so one pane avoids a conflict):
- Reproduce with a test that delays the cursor's return past WARP_WAIT_MS on a long drag; it should fail now. The drag
  must keep going.
- Then the fix: a late return keeps the travel and keeps warping (retry, never a permanent noWarp from one miss), and moves
  in the gap are not lost.
- Measure it headless on a long piece with harness/closefreeze.js-style frame gaps: one continuous drag of several km.
- If the hypothesis is wrong, the pane says so and finds the real interrupt.

## D330 A read: the Finish roll (librarian, 2026-10-15 18:1x)

Read C:\Users\nname\Downloads\t180-wt-a\HANDBACK_A.md (d330-a, 977fba7). Accepted:
- The roll is sized by its measured peak: a first guess at 1.5× the mean, then the laid roll is read with the validator's own
  rollRates and lengthened until under amber, with a named FINISH_ROLL refusal after 6 tries.
- The supplied row 8 failed on 6c37902 to the digit (1.131°/m) and passes now; row 9 added.
- **ELYSIUM: before, a 64 m roll with 3 red and 12 amber, worst 1.224°/m. After, an 87 m roll with 0 red and 0 amber,
  worst 0.914°/m (bar 0.9338).**
- Mutants 5/5 after row 9 was strengthened.
- The full suite on 977fba7: 2824 tests, 2810 pass, 0 fail, 7 skipped, 7 todo.
- No install, no push, no browser.
Two notes:
- **BANK_RATE skipped in A's worktree and failed in the main clone. The librarian read why**
  (test/vocab-corpus.test.js:124-125): it skips only when `reads/` is absent. A worktree has no reads/ at all, while the
  main clone has a partial reads/ without rainbow_rd. So the skip must test for the file it reads, not the folder. Added to
  B's part.
- **CHANGELOG.md already carries "the keeper" in 83 older entries**, against the public-text rule. They are pushed. Whether
  to reword them is the keeper's call.
OUTPUT → NEXT: changed — A is free, so A takes the queued handle bugs (precise scrub, interrupted drag; :112-155). The chair
lands d330-a.

## D330 B read: the test faults and ELYSIUM's stacked reds (librarian, 2026-10-15 19:1x)

Read C:\Users\nname\Downloads\t180-wt-b\HANDBACK_B.md (d330-b, 593a9a8). Accepted:
- **BANK_RATE:** `inputDiff(dir, manifest)`. The test runs only on the exact 16 read files, by sha256, that its constant
  was measured from, and otherwise skips naming what is missing or changed.
  - Red first: a changed set expected 0.849 and got 0.85.
  - Note: the main clone's own 3 matching names have different bytes, so it skips rather than check the wrong data.
- **The water mutation test:** no change, with the evidence:
  - no wall clock anywhere;
  - 4 copies under 16 CPU burners passed 20/20, about 15× slower;
  - peak RSS 342 MB;
  - it passed inside a full suite (2,810 pass, 0 fail).
  The one failure kept no output, so changing the test would be a guess. The catch count stays 19/19.
- **ELYSIUM's stacked reds were real, and they were on the closing road.**
  - They exist only on the route Close laid before 7c433a6: 6.3, 22.7, 23.7 and 24.3 km, and every pair involves the
    closing road, which the keeper never drove because his track was open at the end.
  - Measured against the T-180's own collider (colliders.ini, and collider.kn5 parsed: the body reaches about 1.48 m above
    the road):
    - at 6.3 km the closing road's lip passes 1.16 m over the main floor, inside the body;
    - at 22.7↔23.7 km two cup lips come within 0.70 m along one normal.
  - The 2 m rule is the body plus about 0.5 m, so it is not loose. The check is unchanged, and rightly.
  - **At HEAD (6c37902) Close lays a different closing road with no stacked red.**
- B's own corrections (a priority slip in a stress script, caught in a minute; a CHANGELOG edit lost to CRLF, then added).
For the keeper, plainly: his drive proves the track he drove. The stacked reds were on the joining road that didn't exist
when he drove, and the current Close lays a different one with none.
Watch, as B names: A's roll fix moves the closing route again, so B re-runs probe2.js on ELYSIUM once d330-a and d330-b
land.
The memory stop: four seats' heavy runs at once (A's suite, B's suite, C's isoheap, E's closefreeze). The heavy-run lock
held slots, but RAM ran low. One full suite at a time from here; B's second run isn't needed, since the first passed.
OUTPUT → NEXT: changed — the chair lands d330-b; then B re-runs probe2 on the landed branch for a returning stack.

## D330 E partial read, and the word to re-run (librarian, 2026-10-15 19:1x)

Read C:\Users\nname\Downloads\t180-wt-e\HANDBACK_E.md (d330-e, 58cd1b2), status PARTIAL. Accepted so far:
- closejob, closeworker and closerunner: every Close option runs in one warm worker, with a serial guard and Cancel, and
  falls back to the page on failure.
- The panel's "the window stays free; Cancel stops it".
- close-worker.test, 6 rows, red first on a snapshot (2 of 6 green, the runner-only rows).
- The amended mutant anchor, said so.
- **Before: a 5.70 s freeze right after Close was pressed** (closefreeze, headless, with E's regex fix in a copy).
- E's prediction, filed before the run: the after gap is about 1 s, and the prediction is refuted over 2.5 s.
**The word:** memory is back (37.6 GB free of 61.4, measured at 19:1x by the librarian). E re-runs the two stopped runs (§5:
the after gap, then its mutants and the two mutation tests), one at a time under the heavy-run lock, with no other pane's
full suite alongside. Then the CHANGELOG's after figure and the re-ring.

## D330 C read: the mesh rows packed (librarian, 2026-10-15 19:2x)

Read C:\Users\nname\Downloads\t180-wt-c\HANDBACK_C.md (d330-c, 138c383). Accepted:
- The boundary rows are packed into a Float64Array (p and n). The seams read only those; q stays transient. rowVertices
  is exported.
- **The whole 24 km mesh is byte-identical:** sha256 ac711306…0bed04670 before and after, and pinned in a new test on
  five cases; row 2 is red first.
- **ELYSIUM, headless:**
  - page at rest 784 → 354 MB, and `vertex`'s 426 MB is gone;
  - mesh heap 958 → 269 MB;
  - through Close, the page peaked at 2,150 MB and then stopped answering before; after, 1,084 MB, answering throughout;
  - buildMesh 12.2 → 11.6 s.
- Four test files read the rows through rowVertices. They are said plainly as test changes, because each reached into an
  internal whose form changed; no check was loosened.
- The 7 load-only fails (roundtrip, aclook) pass alone on both the change and the base.
**Owed:** the full suite with the final code (run 2 was stopped by the memory reaper), and the mesh mutation counts.
**Ruling, to save a run:** the chair lands d330-c after d330-a and d330-b. Then **one** full suite runs on the landed
`feature/denser-asphalt` under the lock, once E's after-measurement is done and with no other heavy run alongside. That
serves as C's owed run and as the lap's collation run, mutation counts included. If it reads red on C's files, d330-c is
reverted, not patched in place.

## D330 A2 read: the handle bugs (librarian, 2026-10-15 19:3x)

Read the D330 handle section of C:\Users\nname\Downloads\t180-wt-a\HANDBACK_A.md (d330-a2, dac5ee0). Accepted:
1. **Exact scrub:**
   - Shift (`PRECISE_MOD`, one constant) is one pixel = one 0.01 step, with no hold, for every handle kind.
   - The wheel over a handle is one step a notch, and the camera doesn't also zoom.
   - The arrow keys while a handle is held are one step a press.
   - Ctrl's snap and the coarse drag are unchanged.
   - The reported case: turn from a 1000 m straight, a Shift drag of 37 px is 0.37 exactly.
   - 7 tests red first, now 34/34; mutants 12/12, the chair's back-to-perPx among them.
   - Five Shift tests amended by name, because the rule itself changed (a tenth of the speed, now one step a pixel).
2. **The long drag:** my hypothesis reproduced (a late return turned warping off at the second warp, and a 3 km drag sat
   at 258 m). A found more:
   - **A plain fast hand does the same.** The return was only recognised within 2 px of the grab, so a hand faster than
     2 px an event never matched, then gave up. That fits "sometimes" better than a busy thread.
   - The fix recognises the return by distance, counts the moves in the gap, asks again when late, and stops warping only
     after 3 misses in a row.
   - Every simulated scenario (fast hand, busy thread, both) now follows the hand exactly with no stall.
   - Stated limit: it's a simulation through the real overlay code, not the real window on a long track.
- No core maths was touched. Targeted runs: 161/161, and 132 with 0 fail.
- The app tests under the lock didn't run (the slots were held 30+ min); they are covered by the collation suite.
OUTPUT → NEXT: unchanged — the chair lands d330-a2 with the others. It's in the one collation suite; the keeper's hands
are the real-window check.

## D330 B re-check read: ELYSIUM closes clean (librarian, 2026-10-15 19:3x)

Read C:\Users\nname\Downloads\t180-wt-b\HANDBACK_B.md §4. On the landed branch 7d4236a (A's roll fix plus B's), probe2.js
on ELYSIUM, under the lock:
- Close lays "CS at R 76 m: turn 90°, 305 m straight, turn 0°, then 87 m rolling 54° upright onto the start; 3 new pieces,
  511 m";
- the closed lap is 24,199 m, validated at full speed with CSP on;
- **0 stacked, and no red of any kind.**
**ELYSIUM, the keeper's 24 km track, now closes with no red.** The export no longer refuses.

## D330 E complete; all four in (librarian, 2026-10-15 19:4x)

Read C:\Users\nname\Downloads\t180-wt-e\HANDBACK_E.md §6 (d330-e: 58cd1b2, c2644c3, 6bee312). Accepted:
- **The freeze after Close: 5.70 s → 0.46 s.** E's filed prediction (about 1 s, refuted over 2.5 s) holds. Apply's own
  0.8 s is unchanged and outside this packet.
- The measurement found a fault: Apply was hidden but enabled while a close was pending. Fixed test first (c2644c3).
- E's mutants 10/10, with its own named gap M8 closed in row 3. core-close-mutation plus close-worker 43/43, so A1's
  re-point is proven caught.
- The CHANGELOG carries the after figure, and the scan of the added text is clean.
**D330 wave 1 is complete: A (roll), A2 (handles), B (tests, stacked reds), C (mesh memory), E (Close off the thread).**
OUTPUT → NEXT: changed — the chair lands d330-c, d330-a2 and d330-e onto feature/denser-asphalt (d330-a and d330-b are in).
Then ONE full suite under the lock with nothing heavy alongside, as the collation run. Then the librarian reads it and
the build is installed only while the builder is closed: back up the exe, hash it.

## D330 collation suite read; install ruled (librarian, 2026-10-15 20:3x)

Checked by the librarian in the chair's log (t180_d330_suite.log): **2,843 tests, 2,829 pass, 0 fail, 7 skipped, 7 todo,
3,187 s, exit 0**, on feature/denser-asphalt at cb3a7ff (a, b, c, a2 and e landed).
- B's probe2 is already in: §4 of B's hand-back, on 7d4236a. ELYSIUM closes with 0 stacked and no red.
- inferred, not re-run: the later landings don't move Close's route geometry. C's mesh is byte-identical by its pinned
  sha256; A2 is the handles; E's worker returns the page's own proposal (close-worker row 1).
- **The builder is closed** (Get-Process, checked 20:3x).
**Ruling: install cb3a7ff now:**
- build with cargo --release;
- back up the current exe as `.before-d330`;
- copy the new exe in and compare hashes;
- check again that the builder is still closed right before the copy.
No push; pushing waits for the keeper's word.

## Lap D331: ELYSIUM's newest save, Close and the crooked 90° (librarian, 2026-10-15 22:1x)

The keeper, verbatim: "check out the newest save of elysium, the close loop didnt work, and then I tried to make the 90
degree turn into the straight by hand, but the 90 degree comes out not 90 degrees and crooked, you can see from the new save
how the turn looks, so it is interesting to me how banked turns dont always come out to 90 degrees even when the ui says it
is".
**The save, read only:**
`%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-ELYSIUM.t180track` (22:08, 91,354 B, sha256 2e3642f7…) and its
`.t180undo` (1,911,673 B). Panes copy it into their own fixture folder, never write the original, and record the sha256.
Read by the librarian:
- 42 pieces, not closed.
- The last three (p40 85 m, p41 105.05 m, p42 105.05 m) are bowl pieces with `phi` (bank) −4.084 rad (−234°, which is
  +126°: past vertical).
- p41 ramps `kh` up to 0.0299 rad/m, and p42 holds it and ramps it down: the hand-made turn.
- inferred, a hypothesis to test: `kh` is curvature about the road's own up. On a road banked 126° that axis is tilted far
  from vertical, so a turn the UI calls 90° turns the world heading by much less and pitches the road. That would be the
  crooked look.
**Parts, in parallel:**
1. **A, Close on this save:**
   - reproduce headless (harness/serve.js and isoheap or closefreeze style) with every Close option, and name what
     "didn't work" means here (a refusal and its words, a red, a crash or white window, or no answer);
   - then fix it, red first on a fixture made from this save.
   A knows finish.js and D330's roll fix, so check first whether the route or the roll is the cause.
2. **C, the crooked 90°:**
   - measure the world heading and pitch change across p41 and p42 against what the UI reports for the turn;
   - read which frame `kh` integrates in (src/core, the frame code, turnby.js and gridturn.js);
   - explain the gap in numbers on this save;
   - propose the fix the keeper would expect: a "turn" that means the world heading change, so 90° is 90° on any bank, or a
     UI readout that shows both. The proposal comes to the librarian before code changes the core.
   Core maths: red first; the full suite at landing.
Same rules as D330: headless, no push, no install without the read, his data never written.

## D331 C read: the crooked 90°, measured (librarian, 2026-10-15 22:2x)

Read C:\Users\nname\Downloads\t180-wt-c2\HANDBACK_C.md (d332-c, uncommitted; the fixture's sha256 matches the original).
**My hypothesis is refuted, by citation and test:** kh turns about WORLD up (src/geom/path.js:9-14, "a 'turn left' word
turns left on the map, whatever the pitch"). Bank is applied afterwards about T and never enters the heading. The readout
is that heading (readout.js:12, :95). test/turn_corner.test.js row 1 pins bank-independence.
What the save measures:
- **"Not 90":** the corner turned **101.6°**. p41 read 90.00° but ends still turning at 171°/100 m (the turn channel is a
  rate). p42's "turn 0 at start" ramps that out and adds 9.64°, and p40 adds 1.99°. Nothing on screen sums the corner.
  Row 2 reproduces it from scratch (99.65°, red).
- **"Crooked":** the curvature builds over 105 m and collapses in about 13 m, eight times faster, with the apex at the
  joint (R 33 m). On a 53.5° bank only cos 53.5° = 0.59 of a turn lies in the road's plane, and the rest bends through its
  up. So the abrupt let-go shows as a twist-and-dip.
- The doc's bank −234° and pitch 186° are the flipped form. The road is a 53.5° bank on a 6° descent, upright.
**Ruling:**
- **Now, UI only, no core maths:**
  - **A:** the readout shows the corner's turn since the road was last straight, "ends turning at …", and what the next
    piece's ease-out will add;
  - **D:** a "gravity bank" readout (path.js bankG), so a steep banked turn reads 53.5°, not −234°.
  To C, test first.
- **For the keeper's word:**
  - **B,** "end straight" on Extend's turn, so a hand-made turn comes out exact. He built this corner by hand with Extend's
    fields, so B may be the one he'd use.
  - **C,** a symmetric ease in and out for Turn by and Turn to grid, which fixes "crooked". It changes an existing tool.
  C waits for his choice on B and C.

## D331, the keeper's word on B and C (librarian, 2026-10-15 22:3x)

The keeper, verbatim: "i guess it the turn angle should take into account the banking to make the turns more intuitive for
the user to manage, but then turns that have less banking or no banking also just work how it should to convey the proper
degrees to line up with the grid".
Read against C's measurement: the map heading is already bank-independent, so a number that lines up with the grid has
to stay the map heading. What a bank changes is how an abrupt turn feels and looks: the twist-and-dip. So "takes the
banking into account" and "proper degrees to line up with the grid" are met together by:
- **B, as the default:** Extend's turn number means the corner's exact heading change on the map, ending straight. 90
  is 90 on the grid, banked or flat. The rate meaning stays one switch away, so nothing the keeper built changes.
- **C:** the corner eases in and out symmetrically, so on a steep bank the bend through the road's up spreads evenly
  instead of collapsing in 13 m. The steeper the bank, the more that matters, and on a flat road it is just a clean corner.
  It applies to Extend with B, Turn by and Turn to grid.
- **Plus A and D** (already ruled): the corner's total and the gravity bank in the readout.
To C, core maths:
- red first: row 2 of turn_corner.test.js (a "90°" corner comes out 90.00°, ending straight), and the symmetry row (the
  peak within 10% of the middle, the exit no faster than the entry), on a flat road and on a 53.5° bank;
- a mutant per rule;
- the full suite at landing.
Existing Turn by tests and readout figures that move are amended by name, with why. Old documents open unchanged, because
the stored channels are not reinterpreted. Only new placements use the new meaning.

## D331, climb too (librarian, 2026-10-15 22:4x)

The keeper, verbatim: "i wonder, the climb might need to do the same?"
Read: yes, it has the same structure. src/geom/path.js:10 makes pitch a ramped curvature kp(s), a rate, exactly like
heading, and readout.js:12 reads climbDeg = ∫κv ds. So a climb piece eased to a rate ends still climbing, and the next
piece's ease-out adds pitch the readout didn't show. The fix is the same.
To C, folded into the same build:
- **B for climb:** Extend's climb number is the exact pitch change, ending level-rate.
- **C:** a symmetric ease in and out for climb too.
- **A:** the readout's corner total for climb as well.
- Tests mirrored: a "10°" climb comes out 10.00° and ends at rate 0, and the symmetry row.
- One check that heading and pitch still compose past an inversion (path.js:14, θ keeps its meaning past ±90°), so a
  loop's climb isn't broken by the new ending rule.

## D331 C Part 2 read: turn and climb as corners (librarian, 2026-10-16 00:5x)

Read C:\Users\nname\Downloads\t180-wt-c2\HANDBACK_C.md Part 2 (d332-c, b60166d). Accepted:
- **A:** "corner" and "climb corner" readout rows, with "ends turning at" and what the next piece adds.
- **D:** bank to gravity.
- **B:** "turn & climb as: corner °, ends straight", as the default. The rate meaning is byte-identical behind the switch.
- **C:** a symmetric ease for corners, Turn by, Turn to grid and the new extendClimbBy. The peak goes from 73.9% to 50.0%,
  with the build-up equal to the let-go, flat and banked. Every corner lands within 1e-4° of the angle asked.
- The inversion check passes (180° plus 180° of climb, θ composing exactly).
- **Old documents byte-identical**, by hashes pinned before B and C (the save's own segments and path).
- A real bug found by the suite: A + D's panel would not load in the webview. Fixed, so the panel reads through the shell.
- Amended tests named with why (B6; the panel helpers set to rate).
- Mutants 33/33.
- **The full suite on b60166d: 2,874 tests, 2,860 pass, 0 fail.**
**Correction carried:** the keeper's hand corner is p41 + p42 = **99.64°**, not the 101.6° I relayed (that was part 1's
sum over p40–p42, which C withdraws here). p40's 1.99° belongs to the corner before.
**One thing before it lands, ruled:** in corner mode, the default, the turn and climb DRAG HANDLES are not offered (§B,
"the handles drag a rate"). The keeper scrubs turns with those handles: his 0.01 bug this evening was exactly that. Hiding
them by default takes away his main gesture.
- **To C, before landing:** in corner mode the turn and climb handles drag the corner's degrees, with A2's rules (Shift is
  0.01 a pixel, the wheel and arrows one step, Ctrl snaps), labelled in degrees.
- Tests: a corner-mode drag of n px with Shift is n × 0.01° of corner, and the placed piece turns exactly that and ends
  straight.
Then the chair lands d332-c, the full suite runs, and the install waits for A's Close fix on the same save, so the keeper
gets one build.

## D331 A read: Close on the newest save (librarian, 2026-10-16 01:0x)

Read C:\Users\nname\Downloads\t180-wt-a3\HANDBACK_A.md (d331-a, 55 lines). Accepted, measured in the real page headless:
- **What "didn't work" was:**
  - the three windowed options refuse with their words;
  - "whole lap" closes onto 8 overlaps;
  - **"new road" closed and then the checker said "lap FAILS"**: the car leaves the surface on the new road.
- **The cause:** Finish judged a route only by Close converging. The laid road ended 20 m or more off, Close bent it into
  −55 g, and on a 54° bank that lifts the car off. It is not D330's roll fix (it fails the same at the same station before
  it).
- **The fix:** re-aim each route by where its road really ends, judge it by the lap proof's own centreline test, skip
  failing routes, lay the roll first as the fallback, otherwise refuse by name. Row 10 is red on the installed build; 13/13
  now; mutants 8/8.
- A sweep of 72 tracks: banked ends that left the road went from 48 of 48 to 0, with 6 refused by name.
- The full suite: 2,847, 0 fail. The real page on the newest save now reads **"lap proved"**.
For the keeper, plainly:
- the road that proves is a 2.4 km loop, because the compact one leaves the surface: his end is pitched down 6.2°, 8.4 m
  below the start, on a 54° bank;
- levelling the last pieces first would give a short closing road;
- **the 2 stacked reds that remain are his own track's:** the hand-made turn p41 passes 0.43 m from p38's road a kilometre
  earlier. That's a real crossing, not Close's.
Rulings, small and reversible (obvious builder fixes, then reported), to A before landing:
1. The Close preview says when the lap fails ("the lap fails: the car leaves the road at X km"), from overlapjob's v.lap,
   so he knows before Apply. It applies to every option.
2. The "close using" box defaults to "new road from the end to the start". It starts on "the last ~20%" today, which
   refuses on a long track.
Then d331-a and d332-c (with its corner-mode handles) land together, one full suite runs, and one install.
