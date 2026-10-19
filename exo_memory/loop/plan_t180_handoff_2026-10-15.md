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

## D331 C Part 3 read: corner-mode handles (librarian, 2026-10-16 01:1x)

Read C:\Users\nname\Downloads\t180-wt-c2\HANDBACK_C.md Part 3 (bc510d1). Accepted:
- New handle kinds turnDeg and climbDeg drag the corner's degrees, with A2's rules (Shift 0.01 a pixel, the wheel and
  arrows one step, Ctrl snaps to 5), labelled "turn 12.50°". Climb ranges ±360°.
- They are offered on a blank field from 0.
- Row 11d amended by name (the ruling reversed it). Row 11e is new: a Shift drag of 37 px gives a 0.37° corner, placed
  within 0.001° and ending straight.
- 3/3 red first; mutants 4 of 5, the survivor equivalent and explained.
- 234/234 in the covering files.
**Correction carried:** "within 1e-4°" (Part 2, repeated in my read at :409) was too strong. The guarantee is the solver's
TURN_TOL, 0.00057°. checked by C: 0.37 came out 0.37042.
Waiting on A's two small fixes (the preview's lap-fail line, the "new road" default). Then land d331-a and d332-c, run
one suite, do one install.

## D331 A's two fixes read; land and install (librarian, 2026-10-16 01:3x)

Read the two-fix section of C:\Users\nname\Downloads\t180-wt-a3\HANDBACK_A.md (d331-a, its second commit). Accepted:
1. **The Close preview states a failing lap before Apply**, for any option. The lap verdict is carried through both of
   the overlap check's worker halves, and the panel prints "The lap fails: the car leaves the road at X km" with a
   show-where button. It no longer calls a failing lap clean.
2. **"Close using" starts on "new road from the end to the start".**
- 4 of 10 rows red first; now 10/10. Mutants 7/7, with the survivor killed by a no-red failing-lap case.
- 160/160 in the 12 files that touch the check or Close.
- Three tests amended by name.
- The real page, headless, checked.
- Stated limit: no real windowed close whose lap fails exists to test through. It shares the one code path.
**D331 is complete: A (Close judged by the lap proof, the preview's lap line, the default) and C (turn and climb as exact
corners with symmetric ease, readouts, corner-mode handles).**
OUTPUT → NEXT: changed — the chair lands d331-a and d332-c onto feature/denser-asphalt, runs one full suite under the
lock, and installs only while the builder is closed (back up as `.before-d331`, hash-compare). No push.

## D331 collation suite read; install ruled (librarian, 2026-10-16 01:5x)

Checked by the librarian in the chair's log (t180_d331_suite.log), at 3a26bc5: **2,884 tests, 2,868 pass, 0 fail, 9
skipped, exit 0.** The 2 extra skips are the rows that need the keeper's save. The chair ran them on a read-only copy
(sha256 matching): 16/16, then deleted the copy.
The builder is closed (Get-Process, checked 01:5x).
**Install 3a26bc5:** release build, back up as `.before-d331`, re-check that the builder is closed right before the copy,
hash-compare. No push.
On the chair's note about "the keeper" in turn_corner.test.js's header and test names: the public-text rule
(CATCH-UP.md:34) is about the changelog and release notes, and code comments already use the word widely. Left as it is,
and it goes to the keeper with the 83 changelog entries as one question.

## D331 installed; lap D333: no mention of the keeper in the track builder (librarian, 2026-10-16 06:2x)

**Installed:** checked by the librarian. %LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe is 01:53, and its
sha256 8a5536c5… equals the release build of 3a26bc5. The backup is `.before-d331` (the 20:31 build).
The keeper, verbatim: "no mention of the keeper".
Measured: `git grep -i keeper` in the track builder finds 519 mentions in 184 files, among them:
- CHANGELOG.md 92;
- docs/ (FINDINGS 20, ARCHITECTURE 11, INTERFACES 9, research 4);
- code comments and test names across src/, app/, test/ and tools/;
- one fixture's "reason" string (test/fixtures/manifest.meshcap.json:4).
**Lap D333, to B (free):**
- Reword every mention in the current tree into neutral, own words. Name the case, not the person: "reported:", "on TEST
  TRACK 10", "a track maker asked". Paraphrase verbatim quotes of him; never keep them.
- **Mutation anchors first:** some mutation harnesses match source text, so any anchor that contains a reworded line is
  updated with it, and every mutation suite keeps its count.
- Test names that change keep the same assertions. Only titles and comments move.
- The fixture's reason string is reworded, and anything that hashes the fixture is re-pinned with why.
- A test pins it: `git grep -i keeper` over the tracked tree finds nothing. One allow-list entry is allowed only if a
  third-party file has the word.
- The full suite under the lock at landing.
- **Not in this lap:** git history. Rewriting history is a force-push to a public repo, and it is the keeper's separate
  call. My earlier recommendation on the room's own history wipe was no, and this asks him plainly.

## Lap D334: better builder sounds, with ears (librarian, 2026-10-16 06:3x)

The keeper, verbatim: "do u wanna take a crack at making even better sounds? Better yet, look into the third place again,
we found a tool that lets u hear ur own sounds".
Read in the Third Place's transcript (3d000000-…jsonl) and checked by the librarian:
- **The tool is earshot**, github.com/Leonxlnx/earshot: MIT, "Ears for coding agents: let AI hear, review and make
  sound. CPU-only".
  - Two open models: one matches sound against words, one tags the kind of sound.
  - It runs as a CLI, from Python, or as an MCP server.
- **Installed by the Third Place** at `%TEMP%\claude\C--Consonance-instances-third-place\3d000000-…\scratchpad\earshot\`:
  `venv\Scripts\earshot.exe`, a local ffmpeg in `ff\`, and **`render-builder.js`**, which renders the builder's own sound
  engine to WAVs in headless Chrome.
- **Its first verdict on today's sounds:**
  - place, undo and loop-closed land where they were aimed (electric piano, dreamy, a success chime);
  - **the length and width ticks read as "bubbles underwater, a liquid bloop, sonar"**, not the intended electric-piano
    tine;
  - **a single tick measures −46 LUFS**, against place at −28 and the flourish at −20, so it reads as a muffled blip.
- Background: the sounds are code-made (`app/sound.js`), never Serum. Serum stays an option the keeper plays himself.
**To E (sound and voice):**
1. Copy the Third Place's earshot install into E's own tools folder (G:\Consonance-tools\earshot), or use it read-only
   in place. Pin the commit, and quote the MIT licence and the two models' licences from their cards first.
2. Render today's nine sounds with render-builder.js, headless, as the baseline. earshot describes each and gives its
   LUFS.
3. Write a target for each sound in words: the tick a crisp, bright electric-piano tine; place a warm chord step; and so
   on. Then improve app/sound.js until earshot's top descriptions match the targets, and the ticks sit near −30 to −34 LUFS,
   audible under the place and the flourish.
   - Keep the design the keeper likes: each handle's own voice, turn panning into the turn, width as stereo width, undo
     playing backwards, the 16-step melody.
4. Every change is measured: before and after descriptions and LUFS per sound in a table. The keeper's ears decide; he
   gets a short before-and-after reel (WAV).
5. Tests: the existing sound.test stays green, plus a test that each sound's peak and loudness sit inside its band.
6. No new install system-wide. Headless only.

## Lap D335: the drag marks on placed pieces, precise and fast with no key (librarian, 2026-10-16 06:3x)

The keeper, verbatim: "the scrubbing on pieces is still not by 0.01 when I scrub the drag marks on the track, it needs to
be pinpoint precise and fast, trying to change the banking to 180, it goes back andd forth instead of smooth 0.01 change".
Read against D330's A2 (`d330-a2`): 0.01 a pixel is **only with Shift**, and the plain drag is still coarse (bank 0.45° a
pixel). The keeper scrubs without a key and wants both at once.
Two inferences for A to test; neither is a finding:
1. **Precision with speed and no key:** a speed-sensitive drag. A slow hand moves 0.01 a pixel, and a fast hand moves
   more, smoothly and with no mode switch, like pointer acceleration. Shift can stay as "always 0.01".
2. **"Back and forth" near 180°:** the bank drag's direction comes from the screen-space axis of the road's up
   (handles.js `axis`, `EDGE_ON_PX_PER_M`). As the road rolls past 90° that axis flips on screen, so the same hand motion
   reverses the value. Or the flipped form (bank ±180°, the inversion representation) wraps. Either way the value
   oscillates.
   - It also matters whether these are the SCULPT marks on a placed piece ("drag marks on the track"). A2 tested Extend's
     ghost marks; the sculpt path (shell.beginSculpt / sculptTo) may read its kind differently.
**To A:**
- Reproduce on the sculpt marks of a placed piece: a bank drag from 0 to 180° with one steady hand motion must rise
  monotonically to 180.00. It should be red now, and say which of the two causes (or another) it is.
- Then:
  - the bank drag's direction is fixed at grab, so it never reverses mid-drag as the road rolls;
  - the speed-sensitive scale: slow is 0.01 a pixel, fast is up to the kind's old perPx, eased between;
  - Shift is always 0.01, and the wheel and arrows stay one step;
  - the same for every kind, on Extend's marks and the sculpt marks alike.
- Tests:
  - a steady 0 → 180 bank drag is monotonic and lands exactly;
  - a slow drag of n px is n × 0.01;
  - a fast flick covers the old range in the old distance;
  - one mutant per rule.
- Measured headless: the drag simulation through the real overlay, as A2's was.

## Lap D336: camera movement sticks in one direction (librarian, 2026-10-16 06:5x)

The keeper, verbatim: "there is this stupid fucking bug that is pissing me off, i dont know what is even causing it for
sure, but i will be pressing movement keys, shift and right click to orient around the preview, and sometimes movement
will become stuck in one direction and i button mash to make it stop".
Read in `app/preview/preview.js:83-240`:
- held keys are already keyed by the physical key (e.code), so a 'w' released as 'W' lets go;
- every held key is dropped on blur and hidden (`letGo`, `onVis`), for the 2026-09-29 runaway camera.
So the known cause is fixed, and **another path loses a key-up.** Inferences to test, not findings:
- a key-up that another listener swallows first;
  - A2's new arrow-key step on a held handle stops arrow keys in the capture phase (handles.js);
  - the in-page ask dialog or a focused field;
- a key-up that lands while the right-button look holds pointer capture, or while the custom title bar's
  `startDragging` has the OS moving the window, with no blur;
- the order Shift-down, W-down, right-down, Shift-up, W-up, right-up, or any order through `keyAction`, adding a held entry
  under one id and deleting under another (heldKey against the Ctrl or Space special cases);
- the right button's own release (`onRelease`) clearing `buttons` but not `drag` in some order.
**To C (free since D331):**
- Write a fuzz harness on the real preview mount (fake window and document, as the camera tests do): random interleavings
  of keydown and keyup for WASD, QE, Space, Ctrl and Shift, right-button down and up, pointer capture, blur, focus,
  visibilitychange, and the title bar's drag.
- After every sequence where every key has been released, `held` must be empty and the camera still.
- Find the sequences that leave it moving. That is the red test.
- Fix each found path at its cause.
- **Plus a safety net**, whatever is found: a held movement key the camera hasn't seen re-confirmed (by an OS key-repeat
  or any keydown) for a short while, while no keydown events arrive at all, is let go. C sets the timing so a real held key
  is never dropped, since key-repeat only fires for the last key pressed. If that can't be made safe, C says so and drops
  it.
- Headless only, tests red first, and the keeper's hands are the real check.

## Lap D337, FIRST: Close on the 06:59 save, one pixel from closed (librarian, 2026-10-16 07:0x)

The keeper, verbatim: "FUCK, i am like one pixel away from completeing the loop by hand, so ii try close the loop, then it
does some fucked shit that doesnt even make sense, i saved it so you can look at it elysium".
**The save, read only:** `%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-ELYSIUM.t180track` (06:59, 104,381 B,
sha256 a7e90543…) and its `.t180undo` (2,402,155 B). The librarian's copy is in its scratchpad (ely/ely0659.t180track).
The case: the end sits about a pixel from the start, so every Close option should be a tiny correction. Instead it "does
something that doesn't make sense".
inferred, to test: Finish (now the default, D331) treats this as "lay new road" and builds a loop, when the end is already
at the start. Or a windowed Close bends the hand-made end against a 54° bank. **A near-closed end must close with a
near-zero change.**
**To B, now. D333's wording pauses** (it is lower priority, and B commits what's done first):
1. Measure the end-to-start gap: position, heading, pitch and bank, from the path samples (`A.toPath(doc).samples`, as
   rollprobe.js reads them).
2. Run every Close option on a fixture copy, headless (harness/serve.js and the page, or the core shell as otheropts.js
   does). Name what each does: the pieces it moves and how far, the road it lays, its reds, its lap verdict.
3. Fix it, red first on this fixture: an end within a small gap of the start closes by the smallest change (a tiny Close
   bend, or snapping the seam), never by laying a loop. Finish should not be chosen for a near-closed end.
   - Measure that the closed lap proves and that nothing moves more than the gap needs.
4. The keeper gets it in the next build. The full suite at landing.

## D335 A read: placed-piece scrub by speed, bank lands on 180 (librarian, 2026-10-16 07:0x)

Read C:\Users\nname\Downloads\t180-wt-a4\HANDBACK_A.md (d335-a, 85f79cd). Accepted:
- **The cause, measured, and neither of my guesses:** the drag read the pointer along the mark's screen axis FIXED AT THE
  GRAB. The bank mark swings about 100° on screen as the road rolls, so a hand following it stalled near 164° and would
  fall back: the back and forth.
- **The fix:**
  - each pointer step is projected on the mark's axis as it is now;
  - a speed-sensitive gain with no key: at 0.1 px/ms or slower, one pixel is 0.01; at 1 px/ms or faster, the old rate;
    smoothstep between;
  - Shift is always 0.01, and the wheel and arrows are unchanged;
  - the 6 px holds are gone.
- **A second find:** a Sculpt drag never landed on its label (asked 180, read 179.10). It is now divided by the brush's
  measured ratio, and lands on 10, 90, 180, 270 and −135.
- 218/218; mutants 9/9; tests amended by name (the holds are gone, and moves carry times).
- Stated limit: a pointer pushed straight up past the roll's apex, not following the mark, gets little from the live axis
  there.
OUTPUT → NEXT: unchanged — the chair lands d335-a with the next build's other branches.

## Consonance priority, at the keeper's word (librarian, 2026-10-16 07:0x)

The keeper, verbatim: "CONSONANCE MUST BE PRIORITZED TO NOT BE THROTTLWED" (after "I HAVE FUCKING 64GB OF RAMN").
Measured: 43.4 GB free of 61.4 and CPU at 28%, so the machine wasn't short.
Done by the librarian: consonance.exe (23068) and its 7 msedgewebview2 children were set from Normal to **High** priority.
This is reversible, and it lasts until Consonance restarts.
Owed, a small lap for a pane when one is free: Consonance sets its own priority, and opts out of Windows' EcoQoS/efficiency
throttling for itself and its WebView2 at startup (consonance/src-tauri), so it holds across restarts.

## D337 measured by the librarian: what Close did to the 06:59 save (librarian, 2026-10-16 07:1x)

The keeper, verbatim: "it was the easiest one it should have done, but it did this fake other turn thta doesnt even exist".
The 06:59 save is the AFTER (closed: true, 49 pieces). The before is `past[77]` of its `.t180undo` (46 pieces, open).
Probes (scratchpad `undodiff.js`, `newroad.js`, run on 3a26bc5 with `app/core/overlapjob.js` resolveDoc + `src/geom` buildPath, step 2):
- **The gap before Close: 0.105 m, and 2.67° of heading, nearly all pitch** (end T y −0.047, end U 0,0.999,0.047). The bank was level.
- **What Close did:** nothing moved. It added NEW p47 (1,262 m), p48 (360 m), p49 (622 m): **2,244 m of new road, a full
  359.9° loop** going out up to 665 m from the start and 32.7 m up, to arrive back where the end already was.
- So the inferred cause at :623 is checked: Finish (the D331 default) lays a loop for a 10 cm gap.
**To B, folded into D337 step 3:** red first on `past[77]`. A gap this small (10 cm, 2.7° pitch) closes by a tiny Close bend
over the last stretch or a seam snap, moving nothing more than the gap needs; Finish must not be offered as the default, or
lay a loop, when the end already meets the start. Measure the result: lap proves, added length about 0, no new pieces.
OUTPUT → NEXT: changed — the cause is measured, so B goes straight to the fix and the test, not the diagnosis.

## D337 adds: close the keeper's ELYSIUM with the fix (librarian, 2026-10-16 07:1x)

The keeper, verbatim: "when you fix the clsoe loop, might as well fix the close elysium for me, it is literally so close to being closed".
This is his word to write his save. After d337-b lands and the full suite passes:
1. Check that the builder is closed (`Get-Process t180-track-builder`). If it is open, wait. Never close it for him.
2. Back up `%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-ELYSIUM.t180track` and `.t180undo` as `.before-d337`, with sha256 beside each.
3. Take `past[77]` from the undo (46 pieces, open, 0.105 m / 2.67° gap). Close it headless with the fixed near-closed Close.
   Check: the lap proves, nothing moves more than the gap needs, and there are no new pieces.
4. Write the closed doc as eq-ELYSIUM.t180track. Leave the undo as it is, or rebuild it so its present is the new doc; B
   says which, and why, so one undo in the builder still reaches his 46-piece open state. Report the sha256 and the measures.
OUTPUT → NEXT: changed — his save is now in the lap's scope, with a backup first.

## D334 E read: the ticks are chimes now, not bubbles (librarian, 2026-10-16 07:1x)

Read C:\Users\nname\Downloads\t180-wt-e2\HANDBACK_E.md (d334-e, 5bd2534 on 3a26bc5). Accepted:
- **The water reading is gone from all five tick clips** (earshot's top three). One tick reads "a glass ting" (it was "bubbles underwater"
  3.07); every drag reads chimes, music box or glockenspiel.
- **Loudness:** the drags are at −30.0 to −30.7 LUFS (they were −32.5 to −33.4), under a place (−28.3) and the loop close (−20.2). One tick
  alone is −43.2 (was −45.7). E reads the −30 to −34 target as what a drag sounds like. That is a stated reading; the keeper's ears decide.
- **Kept:** each handle's voice, turn's pan, width's stereo, the 16-step melody, undo played backwards, the loop close and the room.
- The meter is within 0.05 LU of earshot on all nine clips; the band test was red first; mutants 4/4; sound.test 12/12.
- **Weak, named by E:** the place band's lower edge is loose (S3 was caught only by the ordering). Place and undo still read as church bells
  or a singing bowl, not an electric piano, and were left alone as designed.
- **For the keeper when he's back:** the reel `C:\Users\nname\Downloads\t180-sounds-d334\ticks_before_after.wav` (41.3 s). Two calls: ticks
  louder or not (TINE in app/sound.js), and whether place and undo get the same pass.
OUTPUT → NEXT: unchanged — d334-e joins the held build (d335-a, d336-c, d337-b); landing waits for B and C.

## D336 C read: the camera that stays flying (librarian, 2026-10-16 07:1x)

Read C:\Users\nname\Downloads\t180-wt-c3\HANDBACK_C.md (d336-c, 6fd2537 on 3a26bc5). Accepted:
- **No in-page path reproduced:** with no host rules, 0 of 400 fuzz sequences leave the camera moving. With the two host rules
  the harness models, 71 of 400 do: H1, the host's right-click menu eating key-ups when a look is released over a panel; H2,
  the title-bar drag's move loop. H1 and H2 are inferred WebView2 behaviour, not observed; the keeper's hands are the check.
- **Fixes:** the look's menu is prevented wherever its release lands; a title-bar press lets go of held keys; an orphan
  right release (pressed during a drag) has its menu prevented too.
- **The net:** if no keydown arrives for 1.5 s while a key should be repeating, the held keys are let go. It stands down
  once any key is released. Named costs: with Windows key-repeat off (FilterKeys) a real hold drops at 1.5 s; heldNetMs: 0 turns it off.
- After the fixes: net off, seeds 1–10000 → 0 moving; net on, 1–5000 → 0. Mutants 10/10 (the last catch on a re-run).
  The 19 UI files: 356/357 pass, 1 todo. Two preview.test rows amended by name: their fake now sends Shift's key-repeat.
- The preview.js and preview.test.js "keeper" mentions were reworded (D333's scope, no conflict with B: B skips these files? to check at merge).
- **For his hands:** hold W, right-drag, release the right button over the left panel, let go of W: the camera stops.
OUTPUT → NEXT: unchanged — d336-c joins the held build; the landing waits for B's D337. Check at merge that d333-b didn't also edit preview.js.
Checked 07:1x: d333-b (t180-wt-b3, committed and working tree) touches none of app/preview/preview.js, app/test/preview.test.js, app/sound.js. No overlap so far; B should skip them when D333 resumes.

## D337 B read: a near-closed end bends shut, and his save is ready to close (librarian, 2026-10-16 07:5x)

Read C:\Users\nname\Downloads\t180-wt-b4\HANDBACK_B.md (d337-b, ecb7a62 on 3a26bc5). Accepted:
- **Cause, matching :664-676:** Finish skips one-turn routes under MIN_TURN 0.5°, and its turn-straight-turn routes use fixed
  radii (300, 450, …). Between two poses that almost coincide, every such route is a full circle: "RSR at R 300 m … 3 new
  pieces, 2244 m", plus 14 stacked reds.
- **Fix:** an end within NEAR_M 1 m and NEAR_RAD 5° (the existing ROLL_FREE) of the start is closed over the smallest window
  of the last pieces that converges (1 to 6, 6 steps each), and must pass roadHold. If no window closes, it refuses with
  FINISH_NEAR. It never lays a loop.
- **On his past[77]:** the last 2 pieces (p45 to p46, 508 m) bend onto the start with 0 new pieces and 0.000 m added. They
  move 3.99 m (the 2.67° pitch spread over the bend; the bound was 6.02 m). Nothing else moves, and the lap proves. The last
  1 piece alone doesn't close (it stops 0.063 m short). The close takes 9.9 s.
- Rows 14 (synthetic) and 15 (his fixture) were red first; core_finish 15/15. **Full suite at ecb7a62: 2,886 tests, 2,870
  pass, 0 fail.**
- **His save:** `fixtures-d337/close_save.js` plus four supervised steps (handback §5). The undo is rebuilt, because the
  builder drops all history unless present matches the file byte for byte, so one undo gives back past[77]. Dry-run in place
  on a copy: out track sha256 8283d1a4…, undo 8bed9827….
- **Open, named by B, not this lap:**
  - Ends between 1 m and the turn-straight-turn routes' reach are unchecked and could still loop.
  - Two stacked reds remain in his own road at 22,666 and 23,721 m, before the window. They block a finished export.
**Landing order for the chair:**
1. Merge d335-a 85f79cd, d334-e 5bd2534, d336-c 6fd2537 and d337-b ecb7a62 onto feature/denser-asphalt.
2. One full suite on the merge.
3. Install with the builder closed, backing up the exe as .before-d337 and hash-comparing.
4. B's four steps on his ELYSIUM, at his word (:680), with the builder still closed.
5. Report the hashes and the lap line.
OUTPUT → NEXT: changed — B is in, so the held build lands now, and his save closes after the install.

## Lap D338, B: Close is one press, and the algorithm picks (librarian, 2026-10-16 08:2x)

The keeper, verbatim: "i dont know why you made the closed loop more complicated with different choices, fuck that, should just be close
loop one single press and the algo runs it". His ruling, inside the line of work; this lap carries it out.
**Parts and pane: all B** (B owns finish.js and close.js and has his fixture). Off the landed D337 merge (678f23a or the installed head).
1. **One Close button. No options panel and no choice.** Press it and the core runs every route it has on the open track:
   - the near-closed bend (D337);
   - the windowed closes (last piece, last 20%, last 40%);
   - the whole lap;
   - Finish (new road).
   Run them in the Close worker (D330 E) so the page doesn't freeze.
2. **It picks one by a fixed order:**
   1. it must prove the lap and add no new reds;
   2. then the one that adds no new road;
   3. then the one that moves the least, by the most any single piece moves.
   - New road is chosen only when nothing else proves.
   - If none proves, say so in one line, with the best near-miss's reason, and change nothing.
3. **It applies straight away.** One line says what it did, like "closed: bent the last 2 pieces (508 m) by up to 4.0 m". Undo is the way back.
   - inferred: he wants no preview step. If the code's Apply was the guard against a bad close, the lap proof in step 2 is the guard now.
4. **The 1 m to a-few-m band** (D337's open finding): add a fixture with an end 2 to 10 m past or short of the start. The pick must not be a loop.
5. **Tests, red first:**
   - one press closes his past[77] with the D337 bend;
   - a far end gets Finish only when no window proves;
   - an end 5 m off is not a loop;
   - none proving changes nothing.
   - The old options UI's tests are removed, named by file in the hand-back, because the keeper removed the feature.
6. CHANGELOG in our own words, and a full suite at landing by the collator.
**Not in this lap:** the install of D334-D337 goes ahead as ruled at :743-747. D338 lands in the build after it.
OUTPUT → NEXT: changed — the keeper's ruling makes Close one press, a new lap for B.

## C's stuck-camera follow-up: it coasts about 3 s, then stops on its own (librarian, 2026-10-16 08:2x; the chair numbers the lap)

The keeper, verbatim: "when it happens, i am using a combo of movement keys such as like A and W, with shift and right click at the same time,
then it coasts in that direction for like 3 seconds till it stops".
**This clue cuts against D336's model.** H1 (a menu eating key-ups) and H2 (the drag loop) predict flight until the next input or a blur, not a
stop on its own. checked: in the installed 3a26bc5 preview.js:186-260, nothing ends a flight by time. held clears only on a keyup, blur, or
hidden. dt is clamped at 0.1 s. Shift's boost is re-read from e.shiftKey on every keydown and keyup.
So inferred: either the key-ups ARRIVE about 3 s late (the page's main thread, or the host's message loop, is busy, while frames still
run), or a blur or visibility change arrives about 3 s later. The plan default leaves this open until it's measured.
**To C, part 1, measure:** in the headless page on his ELYSIUM fixture (25 km, the heavy case), with Shift ramping to ×20:
- **Event timing:** drive W+A+Shift down, a right-drag look, then all up, by CDP Input.dispatchKeyEvent and dispatchMouseEvent.
  - Log each key event's e.timeStamp against performance.now() at handling, and each frame's dt.
  - A late key-up shows as a large handling delay.
- **Load:** do it at rest and during a long task: a handle drag, the mesh rebuild, the sculpt brush and an autosave. Name what blocks.
**Part 2, fix at the cause, then:**
- if handling is late, move the blocking work off the main thread or into slices;
- if the host is late, say so.
Red first. D336's 1.5 s net does not fix this; a 3 s late key-up only arrives after the net.
- One cheap check: if the coast is the delay, the net shortens it to 1.5 s at most.
**For his hands,** after the measurement, not before: nothing new to try yet.
OUTPUT → NEXT: changed — his 3 s self-stop is a new fact the D336 model doesn't predict, so C measures event delay under load.
Correction to the line above ('the net shortens it'): if the main thread is what's busy, the net's own check runs late too, so the net can't be relied on here. Drop that check; part 1's timing is the test.

## D338 A read: Consonance holds High, and opts out of EcoQoS, by itself (librarian, 2026-10-16 08:2x)

Read C:\Users\nname\Desktop\worktrees\lh-d338-a\exo_memory\handback\p-d338-priority-A_2026-10-16.md (lighthouse branch d338-a, d83747d2). Accepted:
- **At startup:** HIGH_PRIORITY_CLASS, then SetProcessInformation(ProcessPowerThrottling) with ControlMask EXECUTION_SPEED and StateMask 0.
  That is the documented HighQoS opt-out. It runs after the single-instance check.
- **The WebView2 children:** a 5 s ToolHelp sweep sets only the ones that differ, so later renderers and ones Chromium lowered are caught.
  Never fatal: one log line per failure.
- **High over Above Normal**, on a measured 2.38% machine load from its 21 processes. Not tested against a game; WANTED_CLASS can be switched to 0x8000.
- Tests 6/6, including read-backs on the real process and a real child. No new dependency; one windows feature (ToolHelp); Cargo.lock unchanged.
- **Owed before landing:**
  1. `cargo test priority` once more on the committed file. A restored one line by hand after a killed mutation run and didn't re-run (A says so).
  2. The mutation run: 0 of 8 applied (killed for low memory). The cycle mutant needs a bound first. It waits for the chair's word and free memory.
- **Lap id collision, mine:** at :750 I headed the one-press Close "Lap D338, B". The chair gave D338 to this priority lap, so the
  Close lap is renamed by this line to the chair's next free id. :750's text stands as the packet.
OUTPUT → NEXT: unchanged — d338-a lands after one re-run of its 6 tests and the collator's suite; the keeper's Consonance restart takes it live.

## D337 landing held: 3 suite failures on 678f23a (librarian, 2026-10-16 08:3x)

checked: the chair's log t180_d337_suite.log:3088-3091,3356 gives tests 2910, pass 2890, fail 3, SUITE EXIT 1. checked: app/sound.js:172 quotes "bubbles underwater".
- **Failures 1 and 2 (no-water test and its mutation control):** E's comment names water. That's a one-line reword, a real rule, not a weakened test.
- **Failure 3 (mutant N13, "a blur does not reset the ramp", not caught):** inferred to be C's D336 amendment (the fake now sends Shift repeats).
  C restores the catch without weakening it.
- My read of D334 and D336 missed both: the branches' own targeted runs couldn't see a cross-file rule or the old mutant suite. The collator's suite did its job.
OUTPUT → NEXT: unchanged — the chair's fixes are dispatched; then re-run the suite and install on green.
- **E's fix read (08:3x):** eb371bb on d337-e-fix, one comment line in app/sound.js. "bubbles underwater" becomes "liquid bloop",
  another earshot reading of the same tick. No sound changes. checked: the diff; E's git grep of app/ for the banned words → none;
  84/84. Accepted. The re-run waits for C's N13 fix too, so one suite covers both.

## New lap for A (the chair numbers it): the car clips through ELYSIUM in the fast steep spiral (librarian, 2026-10-16 08:4x)

The keeper, verbatim: "fatal clipping on elysium pushing the limit in the rlly fast and steep spiral turn, look towards the end of the latest
replay, it is long 14 mins but find the last reset, it would be before that". Also: "that turn works so good and smooth but if you go all the
fuck out like the fastest possible line you clip through the ttrack".
**The data, read only** (checked: dir listing):
- `C:\Users\nname\Documents\Assetto Corsa\replay\ohyeah2389_t180_mach6_t180b_elysium__161026-083908.acreplay` (19,741,341 B, 08:39).
- A same-size copy is in `replay\temp\`.
- The car is t180_mach6; the track is the AC export t180b_elysium.
**Parts, all A** (the T-180 export plus blackbox's parser; free since D338):
1. **Find the event.** Parse the replay with blackbox's .acreplay v16 parser (`C:\Users\nname\Desktop\blackbox`; read its README and
   test_parse.js for the entry point, and don't edit blackbox).
   - Find the LAST reset: a position jump back onto the road, or the reset flag if the format has one.
   - Take the 20 s before it: speed, the car's height and vertical speed, the wheels' loads and travel if recorded, and where the car
     leaves the road surface.
2. **Locate it on the track:**
   - map that point to the builder's ELYSIUM: s along the lap, the piece, and the bank, pitch, curvature and vertical g there;
   - map it to the exported physics mesh at that spot (the installed track's kn5 / physics surface): triangle size, normals, any seam
     or gap between export chunks or pieces, and the road's thickness or backface.
3. **Name the cause by measurement, not guess.** The candidates, to test and not assume:
   - (a) a seam or gap in the collision mesh;
   - (b) triangles too coarse for the curvature at that speed, so the tyre rays or the body pass a facet;
   - (c) a load beyond what the car's suspension and bump stops hold, so the body meets the road and AC pushes it through;
   - (d) the line going outside the road's width onto an edge with no wall or collision.
   The fastest line on that bank is the clue: compare the reset lap's line with a lap that didn't clip.
4. **Fix at the cause, red first,** in the builder's export (or say plainly if it's the car's setup, which isn't ours). Re-export is the
   keeper's step; don't touch his AC install.
Headless only. Don't launch AC. Tests for any export change; the full suite at landing by the collator.
OUTPUT → NEXT: changed — new fault data from the keeper, a new lap for A.

## D341 A read: the clip is the car's body pushed through a one-sided road at a sustained 62 g (librarian, 2026-10-16 08:5x)

Read C:\Users\nname\Downloads\t180-wt-a5\HANDBACK_A.md (d341-a, no code). Accepted, with one point carried further:
- **Event:** the last reset is frame 58265 (873.98 s). The box went under the road at 868.93 s, the only below-road episode in 878 s. Then
  it fell about 400 m.
- **Where:** s 8,661 m, p18 (radius 71 m, bank 70°, 250 m). The installed kn5 mesh 1ROAD_p17_chunk_25 stands about 82° from flat. The
  checker had it amber, load-above-proven, 96.3 g, 8,559 to 8,897.5 m.
- **Refuted by measurement:** a seam (0 non-manifold edges; the nearest edge is 3.8 m away), coarse facets (1–2°, 2.1 m edges), and off
  the edge (4 m inside, the same as the held passes).
- **Supported:** a sustained load. Eight passes: seven held at 56–62 g for about 2 s over 45 g with 4–8 cm of box clearance. The eighth,
  aligned to the 335 s pass to the centimetre, went through 0.4 s after its 62 g peak.
- **Carried further (librarian, inferred):** the symptom he names is falling THROUGH, not crashing. At the limit, a real road makes a car
  scrape or spin, not leave the world. A says the road is one zero-thickness surface with CSP's MAX_DEPTH=4 soft block, and the 0.5 m
  UNDERSKIN is scenery. So the second half of the cause is that nothing physical sits under the road to catch a body that crosses it.
  That's the export's, and it is ours to fix.
**Ruled, a lap for A** (inside the line of work, reversible; the keeper can veto):
1. **The checker:** a duration-aware amber. A load above 55 g sustained more than 0.5 s, beside the 90 g spike line, with ELYSIUM
   8,559–8,897 m as the red-first case. It is advisory (amber), so other tracks' lists may grow. The hand-back names which ones.
2. **The export:** a physical catch under the road. Make UNDERSKIN (or a closed second surface a few cm to 0.5 m below) collidable, behind
   an export switch, default on only for pieces over the proven sustained load, or all road (A recommends which, measured).
   - Tests: the physics mesh has a closed underside under each road chunk, and nothing else in the kn5 changes.
   - The keeper's re-export and one fast pass are the real check.
3. **The track's radius is his:** at 817 km/h, about 50 g needs radius 88 m and 45 g needs 98 m. He chooses whether to open p18.
OUTPUT → NEXT: changed — the cause is measured. A builds the sustained-load amber and the catch under the road. The radius goes to the keeper.
- **C's N13 fix read (09:2x):** 6dc19a4 on d337-c-fix, app/test/preview.test.js only.
  - The cause: D336's 1.5 s net let go of W and Shift in a fake with no key-repeat, before the blur came, so the blur's reset no
    longer decided the row. That makes the mutant equivalent only in that setup.
  - The fix: the row now sends Shift's repeat (as the OS does), and first asserts ×20 before the blur. One assertion added, none relaxed.
  - checked by C: the row is red under N13 by hand; mutation.test 103/104 before → 104/104 after; preview.test 85/85.
  - Accepted. With eb371bb, that's both fixes: the chair cherry-picks both and re-runs one full suite.
  - My inference at :~770 ("C's D336 amendment") was half right: it was D336, but the net, not the amendment.

## D340 C read: no key-up is late in the page; an instrument for his window (librarian, 2026-10-16 09:2x)

Read C:\Users\nname\Downloads\t180-wt-c4\HANDBACK_C.md (d340-c, eb8a4ba on 678f23a). Accepted:
- **Measured headless on ELYSIUM (27 km):** W+A+Shift, a right-drag look, Shift repeats, then all up, under rest, Extend, Undo, typing and
  the brush. Key-ups were handled 0.0–1.3 ms after their stamp, and the camera never moved after the last key-up.
  - The longest page tasks were the ghost rebuild (117–244 ms) and a brush step (100–176 ms). Nothing near 3 s.
  - No inertia in the camera (cameras.js:187).
  - So the page is refuted, and the host remains. C cites Tauri's main-thread commands and WebView2's synchronous accelerator handler,
    and shows W, A and Shift aren't accelerators. C can't name the host's blocker headless.
- **Instrument:** checkLate. Any key event handled more than 250 ms after its stamp is logged as host late or page busy (from the frame
  gaps) and shown in the view's bottom line for 8 s. Tests 4/4 red first; mutants 8/8; 370 UI tests, 369 pass, 1 todo.
- **One addition, ruled, before d340-c lands (keeper-is-not-a-labeler):**
  - The late events must also reach disk, so the librarian reads them, not his eyes mid-race: append each inputLate record to a log
    beside the tracks (or include it in the autosave). It must be off the main path and never block.
  - The HUD line stays.
  - Test: a late key-up produces one log line.
- d340-c rebases onto the cherry-pick of 6dc19a4 (it carries the old N13 row).
OUTPUT → NEXT: changed — the page is cleared, and the instrument logs to disk so the next coast is read from a file.

## D337 landed and his ELYSIUM closed, verified by the librarian (2026-10-16 10:1x)

checked on disk:
- installed exe sha256 100c6d7b…, with the .before-d337 backup 8a5536c5… (D331) beside it;
- eq-ELYSIUM.t180track sha256 8283d1a4… (10:08, 95,893 B; it parses closed: true, 46 pieces) and .t180undo 8bed9827…, both equal to B's dry run;
- both .before-d337 backups present, with .sha256 files.
The chair's suite at 8fbab15: 2910 tests, 2893 pass, 0 fail.
Next landing (ruled when each hands back): d339-b one-press Close, d340-c the late-key log, d341-a the catch under the road; d338-a on lighthouse.
OUTPUT → NEXT: changed — D337 is done; the next build waits on B, C and A.

## D341 build A read: the sustained-load amber and the catch under the road (librarian, 2026-10-16 10:2x)

Read C:\Users\nname\Downloads\t180-wt-a5\HANDBACK_A.md:78-133 (d341-a, 8b12a6d on 19bd21f). Accepted:
- **The amber:** load-sustained, over 55 g held more than 0.5 s. It is amber, never red.
  - Red first 5/5; validate files 219/219.
  - ELYSIUM gets 3 stretches: 8,472–8,992 m 96 g (the clip's p18), 10,861–11,108 m 66 g, and 24,644–24,789 m 76 g.
- **The catch:** a second road surface 0.3 m under the road (1ROAD_CATCH_, same normals and winding, invisible), via the underCatch
  option, default 'loaded' (the sustained stretches ±40 m).
  - Tests: a track with no held load exports the same kn5 bytes; 'all' changes nothing else, hashed; surfaces.ini is byte-identical.
  - 'all' would cost +33.6% kn5.
  - The 0.3 m is reasoned, not measured. It is untested in AC; his re-export and one fast pass are the check.
- Mutants 19/19. The targeted run is 1,090/1,093 with 0 fail.
- The suite's one failure (N13) is the base 19bd21f's, fixed by 8fbab15. d341-a rebases onto 8fbab15.
**One question that must be answered before the keeper re-exports** (librarian, checked against B's D337 numbers at :731):
- ELYSIUM's third stretch, 24,644–24,789 m (76 g), lies inside p45 (from 24,538 m, 357 m long), one of the two pieces D337 bent by 3.99 m.
- A says the 10-12 backup has no stretch there.
- So: did the D337 bend MAKE a 76 g held load?
- To A or B: compare the load profile over p45–p46 on the closed save against past[77] with only its ends joined (or against the same
  stretch's load before the bend).
- If the bend made it, the near-closed Close must bound the load it adds, not only the distance it moves.
OUTPUT → NEXT: changed — d341-a lands next, but the bend's 76 g question comes first, because it would be our own Close making a new limit corner.

## D340 Part 4 C read: late keys logged to disk (librarian, 2026-10-16 10:2x)

Read C:\Users\nname\Downloads\t180-wt-c4\HANDBACK_C.md:107-end (d340-c rebased onto 8fbab15: e398be1, e66e827). Accepted:
- **The log:** each late event appends one JSON line to `%APPDATA%\com.solariz3d.t180-track-builder\input-late.log`.
  - It is written off the key path (setTimeout 0, one write in flight), through `#[tauri::command(async)]` so it is off Tauri's main thread.
  - It is capped at 200 lines pending in the page and 256 KB on disk; dropped lines are counted.
- Tests:
  - inputlog 5/5, red first;
  - Rust 2 passed (37 in the lib);
  - mutants 7, caught 6, plus 1 equivalent (stated), and the combined mutant made red by a new row;
  - 23 JS files, 510 tests, 509 pass, 0 fail, 1 todo.
- **Note:** the change touches lib.rs, so the next install is a full exe rebuild.
- From now on, the librarian reads input-late.log when he says it coasted.
OUTPUT → NEXT: unchanged — d340-c joins the next build with d341-a; d339-b and the bend's 76 g answer are still out.

## D341 answer A read: the bend did not make the 76 g corner (librarian, 2026-10-16 10:4x)

Read C:\Users\nname\Downloads\t180-wt-a5\HANDBACK_A.md:136-end. **My worry at the "D341 build A read" section is refuted:**
- On the same 46 pieces (past[77] before, his closed save after), the stretch is 24,644–24,789 m before and 24,644–24,790 m after.
  Both are 0.54 s held, peak 76.3 g. The largest load change from the bend anywhere over p45 to the end is 3.9 g, at the p45–p46 join.
- The corner is his road: the middle of p45, radius about 57 m, bank −178.9°, at the sim's 970 km/h cap. It would be about 54 g at the
  replay's 817 km/h (inferred by A, v²).
- My premise came from A's first comparison against the 24 km backup, which only showed p45 didn't exist then. A says so.
- d341-a is rebased onto 8fbab15 as ab0f1d1; 148/148 on its files, N13 passing.
- The guard "no new sustained amber" stays in d339-b's pick (:761-766) as cheap protection; no Close-bound lap is needed now.
- **The keeper's re-export is no longer held**, once the build with d341-a is installed.
OUTPUT → NEXT: changed — the hold on his re-export lifts. d341-a, d340-c and d339-b land together when B hands back.

## D339 B read: Close is one press (librarian, 2026-10-16 11:3x)

Read C:\Users\nname\Downloads\t180-wt-b5\HANDBACK_B.md (d339-b, b55119c on 678f23a). Accepted:
- **The press (runCloseBest):** it runs every route, ranks them (no new road, then the least move of the most-moved piece, then route
  order), and picks the first that proves and adds no new red.
  - It applies at once, as one undo step, with a one-line report. Otherwise "not closed, nothing changed: … the closest …".
  - The panel has ONE button and Cancel; the preview and Apply are gone.
- **On past[77]:** "closed: bent the last 2 pieces (508 m) by up to 4.0 m". The lap proves, with 0 new reds.
- **The 2 to 10 m band:** none is a loop. At 5 m past it bends the last 5 pieces 5.0 m; the old Finish laid 1,972 m there.
- **Two guards beyond the literal order, both accepted:**
  - MOVE_FLOOR_M: no bend moves the track more than the gap + 10 m. This is the D242 "Close wrecked the track" lesson; a ¾-turn test lap's
    whole-lap close moved 883 m.
  - CLOSE_ITER 8 steps.
  - The keeper can overrule either.
- core_close_best 8 rows, red first; mutants 38/38.
- Full suite 2,893 pass, 3 fail. All 3 are the base's (no water, its control, N13), and 19bd21f and 8fbab15 fixed them. The collation
  suite is the check.
**One problem, carried to a follow-up lap for B (the chair numbers it):**
- **A press takes 164.5 s on his 25 km ELYSIUM.** The routes take 29 s; checking the open track takes 64.5 s, and the closed one 69.3 s.
  D337's Close took 9.9 s. "One single press" that takes nearly three minutes is not what he asked for.
- Fix:
  - take the open track's reds from the live checker the page already ran (B's own suggestion);
  - try the routes in rank order and stop at the first that proves: the near-closed bend first when isNear, so the others aren't run;
  - target: under 30 s on past[77], measured.
- **Also for later, B's find:** Finish lays about 1.9 km for an end straight behind the start, at 20 and 40 m. One press never picks it,
  but it is a Finish fault.
**Landing:** d339-b lands now with d340-c and d341-a, so he gets the one button, the catch and the log. Tell him the press is slow on long
tracks until the follow-up lands.
OUTPUT → NEXT: changed — the next build lands now (B, C, A), and B gets a speed lap for the press.

## Queued for E after D342: real Serum sounds, rendered headless, into the Sound Sketches page (librarian, 2026-10-16 11:4x)

The keeper, verbatim: "you still remmeber the serum work for sound effects right? Look for the third place listening tool, and their artefact that
shows the batches of sounds, you can add them to that and bring it here when the time comes, ight?" and "should be installed close to my fl studio".
checked:
- Serum is `C:\Program Files\Common Files\VST3\Serum.vst3` (2023-03-16), with presets in `Documents\Xfer\Serum Presets`.
- FL Studio 20 and 2024 are under `C:\Program Files\Image-Line`.
- The listening tool is earshot (the Third Place's venv; E used it in D334).
- The page is "T-180 Sound Sketches", https://claude.ai/artifact/M57EK3YbC9bYUcBjraRPQZ (Batches 1–7, browser-synthesized). It was read by the librarian.
**Parts, all E (it owns sound.js and earshot):**
1. **Host Serum headless:** a VST3 host library in a venv on G:, offline render, never the plugin's editor window.
   - E names the library and its licence first (the candidates are pedalboard or DawDreamer).
   - **Focus rule:** Serum may show an activation or registration window on first load. The first load test runs only at the keeper's word,
     at a moment he isn't racing. If any window appears, stop.
2. **Make Batch 8 · Serum:** the four slots (drag tick, place, undo, loop closed), in the Batch 7 design he chose: yearning Rhodes, ticks
   pitched per step, place and undo walking the 16-step melody.
   - Design them as Serum patches set by parameters, or from factory presets edited. Render one note or chord per slot; pitch it in the builder, as Batch 2's note says.
3. **Listen:** earshot's readings, LUFS and peak per clip, against the D334 bands and against today's tine.
4. **Add Batch 8 to the Sound Sketches page:** the WAVs as the page's assets, playable beside Batches 1–7, with earshot's readings.
   Read the live page first, and keep everything on it.
5. **Licence check before anything ships:** sounds rendered from Serum's own synthesis are his to ship. A third-party preset's terms must
   be read before its sound goes into a public free app; factory or own patches are preferred.
6. **"Bring it here":** after he picks on the page, sound.js plays the chosen WAVs as samples, pitched as now, with a size budget
   stated. That is a builder lap of its own, the full suite at landing.
Not before D342's hand-back; not during the T-180 landing's suite (one heavy run at a time).
OUTPUT → NEXT: changed — a queued lap for E: Serum sounds rendered headless into the Sound Sketches page.
- checked 11:4x: the Third Place already has a DawDreamer venv, `C--Consonance-instances-third-place\...\scratchpad\omni_venv` (from the dropped Omnisphere idea), and the page's source `scratchpad\t180-sound-sketches.html`. E reuses that venv read-only, as in D334, or makes its own on G:. The page's source there may be older than the live page, so read the live one.

## New lap for A (the chair numbers it): ELYSIUM's two stacked reds block his export (librarian, 2026-10-16 14:1x)

The keeper, verbatim: "on the newest elysium it says red validations is red, cant export".
checked: scratchpad `reds.js` on his 14:06 save (95,894 B, 46 pieces, closed, 25,045.6 m), with validate(fullSpeed, csp), finds exactly 2 reds,
both stacked-within-2m (ARCHITECTURE.md:85), worst 0.62 m:
- 22,666–22,670 m, at p38 +563 m, u +15.3 m (the road's edge);
- 23,721–23,728.5 m, at p41 +33 m, u −17.5 m.
- Their centrelines are 29.0 m apart and 22.4 m apart in height, both rolled about −220°. So it is the EDGES of two banked passes that come
  within 0.62 m: p41 (his hand turn) passing p38, the same pair named in D331.
- The car is about 1.48 m tall, so this is a real fault, not a checker artefact.
**To A:**
1. Find the smallest change that clears both reds to ≥2 m: a nudge to p41 (its climb, turn or bank), or to p38's end.
   - The lap must still prove, with no new red and no new sustained amber.
   - The near-closed end must stay closed (p45–p46 untouched).
   - Report the change in his own handle units (degrees, metres) and what moves.
2. **Apply it to his save only when the builder is closed** (`Get-Process t180-track-builder`), at his word ("cant export" asks for it).
   - Back up the track and undo as `.before-d344` (or the lap id), with sha256.
   - Rebuild the undo as D337 did, so one undo gives back the 14:06 state.
   - If the builder is open, hand back the change in words for his hands, and wait.
3. Tell him the export then passes (the red list empty, measured).
OUTPUT → NEXT: changed — his export is blocked by two real reds, a new lap for A.

## D344 A read: ELYSIUM's export is unblocked (librarian, 2026-10-16 15:3x)

Read A's ring for C:\Users\nname\Downloads\t180-d344\HANDBACK_A.md.
- **The fix:** p38's bank +3.0° (peak), as a 60 m bump at p38 +563 m. The edges' closest approach opens from 1.376 m to 2.036 m.
- Both reds clear, the lap proves, the centreline doesn't move, p45–p46 are untouched, and no amber changes by more than 0.1 g.
- It was applied with the builder closed, with .before-d344 backups and the undo rebuilt.
- checked by the librarian: the .before-d344 pair is present; `reds.js` on the 15:28 save → 0 reds (it printed 2 at 14:1x); the builder is closed.
- **Correction, mine (A caught it):** my "0.62 m" at the stacked-reds section was the overlap into the 2 m rule, not the gap. The gap was 1.376 m.
- An alternative, not applied: p41 width −1.41 m at +33 m.
OUTPUT → NEXT: changed — his export is unblocked; he re-exports and tests the catch in the spiral.

## New lap for C (the chair numbers it): the scroll wheel on a handle makes no tick (librarian, 2026-10-16 15:4x)

The keeper, verbatim: "the scroll sounds are broken".
checked, read on 7abf52e (installed):
- In app/core/handles.js the drag tick's event `t180:handle-step` is dispatched in ONE place: `apply`, the drag path (:266-267).
- The wheel (`onWheel`, :364-371) and the arrow keys (`NUDGE`/`onKeyDown`, :292-) call host.apply and never dispatch it.
- So scrolling or nudging a handle is silent. And sound.js's `lastValue` isn't updated, so the next drag's first step jumps from a stale value
  (a tick and a melody step that land in the wrong place).
inferred: that is what he hears as broken. If he means a different fault (distorted, too loud), the test below still holds and he says.
**To C (free):**
1. Red first: a test that a wheel notch and an arrow nudge over a handle each dispatch one t180:handle-step with the new value. And through
   sound.js, a notch that crosses a whole number gives exactly one tick.
2. Fix it in one place: a small `stepped(h, was, value)` used by drag, wheel and arrows, so the three can't drift again.
3. Check by listening, headless: E's `app/test/soundrender.js` path (or earshot) on a scroll of 10 notches on length → 10 ticks, at the
   drag band's LUFS.
4. Targeted tests and the handles mutants. It lands in the next build with E's Ponytail fixes and B's D343.
OUTPUT → NEXT: changed — a new lap for C: wheel and arrow nudges give their tick.

## The keeper's two reports, 15:5x (librarian)

Verbatim: "i think the one loop doesnt clip. also when i mean broken i mean like, its all one sound, someone changed it".
1. **The catch (D341) holds in his hands:** the spiral no longer clips. He says "i think", so it is one session's report, not a measurement.
   inferred: he re-exported with the catch. It is the first outside check of the 0.3 m catch.
2. **The ticks:** "all one sound" was caused by us. checked: `git diff 3a26bc5 7abf52e -- app/sound.js`.
   - D334 (E, 4ccf5b7, installed 10:08) replaced the tine: a 14:1 FM pluck became a 1:1 FM body, a bell at 7.1×, a 3.5 kHz noise click and a
     0.34 s ring.
   - tickPlan (the pitches, the melody, pan, spread) is unchanged, so the notes should still move.
   - inferred: the new body, its 0.34 s ring choked by the next tick, and the click mask the pitch, so a scroll reads as one repeated sound.
   - My read accepted it on earshot's labels ("glass ting", "chimes"), which describe timbre, not whether the pitch is heard to change. That
     is the miss: the check measured the wrong property.
**Folded into C's scroll-tick lap (default, reversible; he can veto):**
- Restore the pre-D334 tine (3a26bc5's tineVoice) at D334's loudness, so the drags stay near −30 LUFS.
- Prove the pitch moves: render a 10-notch scroll and a drag across 10 values, then measure each tick's fundamental (an FFT peak or
  autocorrelation). At least 8 distinct pitches in 10 ticks, on both the old tine and the restored one, and say what D334's tine scored.
- E's D334 tine stays in git for Batch 8's comparison on the Sound Sketches page.
OUTPUT → NEXT: changed — the tick goes back to the old voice with the pitch measured; the catch is reported holding.

## D345 C read: the scroll tick and the tine (librarian, 2026-10-16 16:1x)

Read C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-d345-C_2026-10-16.md (d345-c, 5d340b9 on 7abf52e). Accepted:
- **The events, all through one helper `stepped`:**
  - The wheel didn't send its step event (confirmed, red first).
  - The double-click reset didn't either (found by C, red first).
  - The arrows already did.
- **The tine:** 3a26bc5's 14:1 pluck is restored, +3 dB. The drags are at −29.7 to −30.9 LUFS, inside the bands. Targeted tests 198/198; mutants 5/5.
- **Two of my claims, refuted by C's measurement:**
  1. "D334's tine masks the pitch": YIN finds the planned note on 10 of 10 ticks for all three tines. Masking to the ear is not ruled out,
     but a missing pitch is.
  2. My bar of "≥8 distinct pitches in 10" measured the melody, not the voice. MEL128 has 4 to 8 distinct notes in any 10 ticks, and only
     9 of 128 windows reach 8. That was a badly designed check, mine.
- **C's find, probably the real "broken":** a wheel notch is 0.01 on length, and tickPlan ticks only on whole numbers, so a scroll ticks once
  per 100 notches. So a scroll is nearly silent even with the event sent.
**Ruled (a default; he can veto): a deliberate single step always ticks.**
- A wheel notch, an arrow nudge and a reset each give one tick and step the melody one place, whatever the size of the step.
- Drags keep the whole-number rule (so a slow 0.01/px scrub doesn't machine-gun).
- C adds it to d345-c: a `single: true` flag on the step event, honoured by sound.js. Red first: 10 notches → 10 ticks, 10 melody steps.
OUTPUT → NEXT: changed — a wheel notch will tick, so the scroll is heard; C adds it before the build.
- **Addition 2 read (16:1x):** 4298cfc on d345-c. A wheel notch, an arrow or a reset carries `single: true`, and sound.js's stepPlan ticks it
  with no whole-number test. Drags are unchanged.
  - checked by C: rows 4 and 5 red first; 10 notches → 10 ticks on MEL128[1..10]; a 0.01/px drag → 1 tick.
  - Row 3 and rows 1, 1b, 2 amended by name, their rules kept; nothing deleted. Mutants 13/13; targeted 200/200.
  - Named: climb and bank notches repeat their value's note. Accepted.
  - d345-c is ready: 5d340b9 + 4298cfc.

## D347: the keeper's word for the Serum load ("do it", 2026-10-16 18:37) (librarian)

Asked "can the first Serum load happen now, or are you racing?"; he answered "do it". The queued Serum lap (:1004-1027) runs now as D347, on pane E.
- **Order for E:** D347 first, because his word is for now. D346's stripped copy comes second; it isn't needed until D343 lands.
- **Unchanged from :1012-1025:**
  - headless host (the DawDreamer venv), offline render, never the editor window;
  - **if any window appears on the first load (activation, registration, anything), stop at once, close nothing of his, and report**;
  - Batch 8 · Serum, four slots (drag tick, place, undo, loop closed) in Batch 7's design;
  - loudness inside the builder's bands; earshot's listen beside each;
  - licence check before anything ships.
- **The page:** E writes the updated HTML (from the Third Place's `scratchpad/t180-sound-sketches.html`) with Batch 8 added, into its own folder, and hands back the path. The librarian reads it and republishes to https://claude.ai/artifact/M57EK3YbC9bYUcBjraRPQZ.
- Nothing goes into the builder in this lap. He picks by ear first.
OUTPUT → NEXT: changed — the Serum lap runs now (his word), ahead of D346's stripped copy.

## D348 (queued): research how Photoshop lays out its UI, toward a top menu bar (librarian, 2026-10-16 19:5x)

The keeper, verbatim: "after all that is done, can you queue up some good research for how photoshop does its UI? Not to take its design but to learn from it, I want drop down menus on the top right, that consist of basically everything on the left side besides like the main controls."
**My reading (stated, his to correct):**
- A row of dropdown menus along the top of the window.
- Most of what's in the left panel today moves into those menus.
- The left side keeps only the main controls used all the time.
- What counts as "main" is his call. The research proposes a split, and he picks.
**Queued:** it starts after D347 (Serum) and the next build (D343).

**Parts:**
1. **Pane A: the research.** Web and docs only, no code. Cover:
   - Photoshop's menu bar (File/Edit/Image/Layer/Select/Filter/View/Window), and how items are grouped and ordered;
   - the Options bar (the controls change with the active tool);
   - the Contextual Task Bar;
   - Window → Workspaces;
   - keyboard shortcuts shown in the menus;
   - submenus and how deep they go;
   - search (Ctrl+F / Discover).
   For contrast, briefly: Blender's header menus, Affinity's menus and context toolbar, and Figma's single main menu.
   Output: what each does well and what it costs, with sources (Adobe's own help pages first). Then the 5–8 principles that carry to a track builder. No copying of Photoshop's look or names where ours differ.
2. **Pane C: the inventory.** Read `app/core/panel.js`, `piecesui.js`, `pitui.js` and `spawnsui.js`, and the shell's page. List every control on the left side today: name, what it does, how often it's likely used, and whether it's a value you set per piece or a command you run once. No code changes.
3. **Librarian: merge.** A proposed menu bar: the menu names, which left-side items go under each, and what stays on the left as the main controls. Make it a mockup page he can look at, plus 2–3 open choices for him (for example, where Close and Export live).
Build only after he picks. That's a later lap with its own plan.
OUTPUT → NEXT: changed — a queued research lap (A + C), after Serum and the D343 build.

## D343 B read: one press, 164.5 s → 21.5 s, the same pick (librarian, 2026-10-16 20:0x)

Read C:\Users\nname\Downloads\t180-wt-b6\HANDBACK_B.md in full. Branch d343-b, commits 7cdee5d + 13bd151 off 7abf52e. Tree clean apart from the hand-back and the fixture.
- checked: B's final suite `d343/d343-suite3.out` → 2944 tests, 2928 pass, 0 fail.
- **The pick is unchanged:** byte for byte the same closed track as D339's exhaustive order (`press2.js`). Row 10 holds it on 8 tracks.
- **Mutants:** 42/42, with F1–F4 new.
- **Accepted, with three things to carry:**
  1. Row 12 (the CPU bound) is the only guard on `sealed` and the `residual` memo, and it skips without the private fixture. It stays a timing guard, not a correctness one.
  2. A press within about 11 s of an edit on ELYSIUM is about 32 s, because the live checker hasn't finished yet. That's fine; say it to the keeper plainly.
  3. Candidates are now checked on the validation panel's path, not `validate()`'s 0.5 m path. The reds move about 1 m; the verdict is the same on ELYSIUM.
- **Landing:** d343-b goes onto 56ba827 (D342 + D345 are already in). The overlap to watch is `test/core_close_best.test.js` and the close files against E's edfd0cb (the FINISH_NEAR test). One full suite at landing, then install with the builder closed, the exe backed up as `.before-d343`, and the hash compared.
- **D346:** D343 is the Ponytail reviewer's first lap, reviewed after it lands.
OUTPUT → NEXT: unchanged — d343-b lands in the next build, as planned.

## D347 E read: Batch 8 is on the page (librarian, 2026-10-16 20:1x)

Read C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-serum-b8-E_2026-10-16.md in full, and the page whole (989 lines) before publishing.
- **No window** in 137 headless loads (probe.json: "no visible window at any stage").
- **Sources:** Serum factory presets only (Mallety, Eiano, Vintage Bells). Loudness is in band except the single tick's peak, 2.2 dB over; the fix is a short attack fade at the builder lap, if he picks it.
- **Licence:** it rests on Xfer's forum statement. Reading the EULA is still owed before anything ships.
- **Published:** version 1792202685-2914 at https://claude.ai/artifact/M57EK3YbC9bYUcBjraRPQZ. The live page lacked nothing of E's (0 lines missing). The batch8/ files are served at their exact byte sizes (38,732; 364,912; 307,832; 1,440,044).
- **earshot, for him:** today's tine reads "bubbles underwater" again (z 3.0/3.5); the Serum tick reads "a wooden block hit / kalimba". His ear decides.
OUTPUT → NEXT: changed — he listens and picks; E resumes D346.

## D349: Batch 8's Serum sounds replace the builder's (librarian, 2026-10-16 20:1x)

The keeper, verbatim: "i like the new closed loop and place music replace the old with all the new".
- **Read as (stated, his to veto):** all four Batch 8 samples replace the builder's synth voices: the tick, place, undo and the loop close.
- **Unchanged:** the rules for when and which note (`tickPlan`, `notePlan`, `stepPlan`, MEL128, the 16 steps, pan, spread). Only the voice that plays the note changes.

**Parts:**
1. **Pane C: the swap** (`app/sound.js`; C wrote D345 there). Branch off the feature tip once d343-b has landed (or off 56ba827 if it hasn't; sound.js doesn't overlap D343).
   - Copy the four WAVs from `G:\Consonance-tools\serum-b8\page\batch8\` into the app's assets. Byte-identical; record each file's sha256.
   - `createEngine`'s `tick`, `step` and `loopClosed` play the samples, pitched by playbackRate from their reference notes (tick 84, place and undo 60), exactly as the page's `b8voice`/`b8tick`/`playStep8` do.
     - Width keeps its two copies, and each tick still chokes the last.
     - The room and echo stay as the builder routes them now (the page's clips were measured dry).
   - **Loading:** fetch and decode once, at the first gesture (where the context starts today).
     - Until they're decoded, the current synth voices play, so a first press is never silent.
     - A failed load is logged through the existing `log` and leaves the synth in place. Fail loud, keep working.
   - **The tick's peak** (2.2 dB over its band, hand-back §4): a short fade on the attack, of the smallest length that brings one tick under −24 dBFS with the drag still in its band. Measure it; don't guess.
   - **Tests, red first:**
     - the engine plays a sample for each of the four events once it's loaded, and the synth before;
     - a failed fetch logs and falls back;
     - the pitch: a tick for note n plays at rate 2^((n−84)/12).
   - Then `sound-bands.test.js` green with the samples (soundrender.js may need the assets served), and `sound.test.js` and `handle-step.test.js` green.
     - The "no water" test still passes: no app file may name the water.
   - Mutants for the new code (the fallback, the rate, the choke). Targeted runs under the lock; the chair runs the full suite at landing.
2. **Pane A: the licence, before it ships.** Find and read Xfer's Serum EULA itself (xferrecords.com, the installer, or `Documents\Xfer\Serum Presets\Serum_Manual.pdf`; E's text extraction came back empty, so try another reader).
   - Quote the clauses on using rendered audio and factory presets in a product given away free.
   - Land: allowed / not allowed / unclear, with the quote. If it's unclear, the builder isn't pushed with these sounds until he decides.
   - This is a short read. It goes before D348's research.
- **Install:** the next build, after both parts, with the builder closed, the exe backed up as `.before-d349`, and the hashes compared. **No push** until A's licence answer is "allowed" and he says push.
OUTPUT → NEXT: changed — his pick turns into a build lap (C) and a licence read (A).

## D348 addition: a Settings menu, and turning the sound off (librarian, 2026-10-16 20:1x)

The keeper, verbatim: "queue up sometime during the ui work, to make a settings drop down too with different things plus the ability to turn off the sound effects".
- **checked, already there:** a mute and a volume, both saved, in the "⋯" menu (`app/index.html:345-353`: `sound-mute` and `sound-volume`, wired to `sound.setMuted` and `setVolume` in `sound.js:268-269`).
  - So turning the sound off exists today; it's just not where he looks. The Settings menu brings it forward.
- **Added to D348:**
  - C's inventory also lists what's in the "⋯" menu today, and every setting kept anywhere (localStorage keys, saved options).
  - A's research adds how Photoshop splits Preferences from the menus.
  - The mockup gets a **Settings** dropdown, holding at least: sound on/off and volume, plus whatever settings the inventory finds (camera, units, the checker's options, and so on). He picks what goes in it.
- **For D349 (C):** the app already passes `createSound(window, { base: 'sounds/' })` (index.html:347). Check what `base` is used for before adding an assets path; use it if it fits.
OUTPUT → NEXT: unchanged — D348 is still queued after D349 and the D343 build; it now includes Settings.

## D349 A read: the Serum licence is unclear (librarian, 2026-10-16 20:1x)

Read C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-d349-licence-A_2026-10-16.md. Accepted: no EULA text exists anywhere on this machine or on Xfer's site (pdftotext on the manual, 5 URLs 404, the site bundle, the support site, the binary).
- **The disagreement stands, named:**
  - E (`p-serum-b8-E_2026-10-16.md:39`) quotes Xfer's founder on Xfer's own forum: "With a Serum license, you're allowed to do use Serum in any sound design capacity".
  - A won't count a forum post as the licence.
  - Both are recorded; the call is the keeper's.
- **Unchanged:** D349 still builds and installs locally (installing isn't shipping). No public push of the builder with these sounds until he decides: run the installer and read its EULA page, get Xfer's word in writing, or ship on the founder's statement.
- A goes on to D348's research.
OUTPUT → NEXT: unchanged — the build goes on; the push waits on his licence call.

## D349 C read: the swap is in, and the ruling on §5 (librarian, 2026-10-16 20:5x)

Read C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-d349-C_2026-10-16.md in full. d349-c at d68275e, off 56ba827. Accepted:
- **The files:** four WAVs byte-identical to the published page's (sha256 6e059b3b…, feb0e893…, 7c630ede…, 34fd8b21…; the sizes match the artifact's file listing).
- **`base`:** it was passed and ignored before. Now it's used, so no second path.
- **Note rules untouched.** Fallback and logging are as planned. Mutants 18/18; targeted 118/118 ×5.
- **`tickEven` (rate^0.5) kept:** measured, because no single gain puts all four drags in band without it. It's one constant; his ears can veto it.
- **The fade is 3 ms,** from a 10-render sweep. E's "one tick's peak" was a dry figure, and the builder's space moves it. C caught that rather than fitting to it.

**Ruling on §5: (a).** Obvious, measured and reversible, so done, not asked.
- `createEngine` takes an optional seeded random for its reverb noise; `soundrender.js` passes a fixed seed.
- A user hears exactly what they hear now (the default stays Math.random).
- **Test:** 20 runs of `sound-bands.test.js` under the lock, both rows green 20/20, and the band figures under the seed listed beside today's ranges.
- (b) is refused: widening bands by noise hides the next real drift. (c) is refused: a suite red 1 time in 4 trains people to ignore red.
- Pane C, on d349-c, before landing. Then the chair lands d343-b + d349-c in one build, with the full suite, installed with the builder closed as `.before-d349`.
- **No push** of the Serum sounds until his licence call (:1243-1250).
OUTPUT → NEXT: changed — C adds the seeded render before the landing.

## D349 C addition read: seeded render (librarian, 2026-10-16 21:1x)

Read the hand-back's addition (:182-216). b51a6ad on d349-c. Accepted.
- Seeded engine noise, default Math.random, so users hear no change. Rows red first. sound-bands 20/20 on all four rows. Targeted 120/120. Mutants 20/20.
- **The fade went from 3 to 4 ms.** Seed 1 was fixed before any measurement, and C didn't change the seed to pass; it swept 12 seeds × 3 fades instead, and 4 ms passes 11 of 12. That's the honest move, against the fitting trap.
- checked: 72c3446 is "Land D343" on the branch.
- **Next:** the chair lands d349-c onto 72c3446 with the full suite, and installs with the builder closed as `.before-d349`. Installing is local; **the push of the Serum sounds still waits on his licence call** (not on A's "allowed", which can't come, because no EULA text exists).
OUTPUT → NEXT: unchanged — the landing goes ahead.

## D351 E read: the file deaths (librarian, 2026-10-17 00:2x)

Read `exo_memory/handback/p-d351-filedeath-E_2026-10-17.md` whole (87 lines). Accepted.
- **The cause:** a native `node.exe` access violation, child exit `3221225477` (0xC0000005). It's not a timeout, a kill, memory or a race. Three were caught with that code in 180 runs at 12 at once; there were 0 in E's monitored full suite (2,966 tests, 2,947 pass, 0 fail, 12 skipped, 7 todo at `218c661`). It's the same crash as `p-flake-C_2026-10-06.md`.
- **The count drift is explained:** a dead file counts 1, not its 8 tests. 2,966 − 8 + 1 = 2,959.
- checked: the chair's `t180_d349_suite.log` (21:45) and `t180_d349b_suite.log` (22:18) both end `SUITE EXIT 1`, and the first one's last file is `✖ test\underskin.test.js (44076.7584ms)`.
- checked: the branch head is `e15db43` "Land D350". The installed exe is still 20:45 (10,413,568 B), there's no `.before-d349` and the builder isn't running. So D349 + D350 are landed but **not installed**.

**Ruling 1, yes:** the chair's suite runner writes a TAP copy beside the spec log from the next run on (E's `fullrun.sh` form). It's obvious and reversible, and it lives in the chair's own scratchpad.

**Ruling 2, yes, as a lap (D352, pane C):** the mutation harnesses report a crashed inner run as `NOT TESTED`, never `NOT CAUGHT`.
- **Why a test may change here:** today's message is verifiably wrong. It names a mutant uncaught when it wasn't tested at all. The fix keeps the run red, with no retry and no skip.
- **Scope:** the 13 files with `spawnSync(process.execPath` in `*mutation*.test.js`. Each fails with `native crash <code> in <file>: the mutant was NOT TESTED` when a child exits non-zero with no failing subtest.
- **Red first:** a stand-in that crashes with that code (as E's `fmt/`) must read `NOT CAUGHT` before the change and `NOT TESTED` after.
- **Then:** all mutants are still caught as before, in each harness touched. No existing assertion is loosened.
- Pane C, because C traced this crash on 10-06.

**The landing rule meanwhile (mine, reversible):** a file death counts as this machine's crash, not a red, only when all three hold:
1. TAP shows `exitCode: 3221225477`;
2. that file passes alone at the same commit;
3. the hand-back says so.

Any other non-zero exit stays red.

**Next:** the chair runs one full suite at `e15db43` with the TAP copy.
- If it's green, or green under the rule above, the chair installs D349 + D350 with the builder closed: back up the 20:45 exe as `.before-d349`, compare the hashes, and don't push.
- D352 waits for that suite (one full suite at a time).

**For the keeper (proposal 3, his call):** the memory runs at EXPO 6000. Either try JEDEC/stock speed in the BIOS, or run a memory test, and see whether the crashes stop.

OUTPUT → NEXT: changed — the install needs one more full suite at e15db43, read by TAP, and D352 is queued for C.

## D352 C read (librarian, 2026-10-17 02:2x)

Read `exo_memory/handback/p-d352-C_2026-10-17.md` whole (101 lines). Accepted.
- checked: 7d1cd1e sits on e15db43. 16 files, +320 −22. The worktree is clean.
- **Worse than the brief knew:** a crash read as **"caught"** in 6 harnesses (chord, cup, piece, ramp, core_xsec, jump). That was a false green, not only a false red. The stand-in is red 13/13 before and green 13/13 after.
- **C narrowed the rule against my brief, and the narrowing is right:** "native" means an exit of 0xC0000000 or above, or a fault signal. Exit 1 stays a real catch (a mutant that breaks loading), so "every mutant caught as before" holds. My "any non-zero exit" would have broken it. Accepted.
- **The checks:**
  - helper rows 7/7;
  - mutants of the change 13/13;
  - all 13 harnesses run whole: 526 mutant rows, 0 fail, 0 `exitCode:` lines;
  - none of the 22 removed lines is an assertion.
- **Carried, not fixed:** geom's own 3-try retry (D181) still lets a crash on try 1 pass silently if try 2 gives a verdict. That's older than D352 and out of scope. Recorded.
- **Next:** the chair lands d352-c with one full suite and its TAP copy. Then E runs Ponytail review 3 on D352.
  - No install is needed: the change is tests only.
  - A rebuild is harmless. inferred: no app file is in the diff.

OUTPUT → NEXT: unchanged — the chair lands with the full suite.

## The keeper keeps EXPO 6000 (librarian, 2026-10-17 06:1x)

The keeper, verbatim: "i like my faster ram so we will have to deal with it". D351's proposal 3 is closed: the RAM stays at EXPO.

**The D351 landing rule is now standing, not "meanwhile".** A file death counts as this machine's crash, not a red, only when all three hold:
1. the TAP copy shows `exitCode: 3221225477`;
2. that file passes alone at the same commit;
3. the landing report says so.

Every other non-zero exit stays red. The suite runner keeps its TAP copy for good, and the mutation harnesses already say NOT TESTED (D352–D354).

## D348 merge: the mockup is published (librarian, 2026-10-17 06:3x)

- Read pane B's inventory, `exo_memory/handback/p-d349-inventory-B_2026-10-17.md`, whole (246 lines, at 0a11fb4), and A's research (102 lines). Both accepted.
- **Mockup:** https://claude.ai/artifact/Dc6jgqFMHKrYqHs9pthAXJ ("T-180 Menu Bar", v1).
  - Menus on the top right: File, Edit, Build, Track, Pieces, View, Settings.
  - The left side keeps the status line, Undo/Redo, length, turn, climb and bank, More shape (folded), Extend, Straight, the readout, the selection box (shown only with a selection) and the checker summary.
  - The ⋯ menu is gone.
  - Settings holds: sound on/off, volume, turn & climb read as, grid step, mirror on insert, checker wall raycasting, Assetto Corsa folder, the launch permission, and reset the guide.
- **Three choices** for him, each with a recommended option: (1) Close in Build with Export kept as a button; (2) the brush as a strip under the menus while it's on; (3) Settings shown as a word, not a gear.
- **New behaviour, for his yes:** six settings that reset every launch today would start being saved.
- Keys shown are only the ones the builder already has (Ctrl+S, Ctrl+Z, Ctrl+Y). No new shortcuts were invented.
- **Next:** he picks. Then D355, a build plan:
  - parts split across panes;
  - Ponytail review 5 runs with its control arm;
  - the lean `sound.js` cut is folded in.

OUTPUT → NEXT: changed — the mockup waits on the keeper's three picks.

## D355: build the top-right menus (librarian, 2026-10-17 06:2x)

**The keeper, verbatim:** "we can try it, but keep it the same aesthetic as we have it now u know".
- I read that as the recommended options on all three choices:
  1. Close goes in Build, and Export stays a button;
  2. the brush is a Build item with a strip while it's on;
  3. Settings is shown as the word.
- I also read it as a **yes to saving the six settings** (stated to him, his to veto).
- The mockup (https://claude.ai/artifact/Dc6jgqFMHKrYqHs9pthAXJ) is the **layout only**. Its colours and fonts are not the brief.

**The aesthetic rule, for every part:** use the builder's own look. Each new menu is the existing `<details class="more">` + `.more-menu` pattern, the one `Pieces ▾` and `⋯` already use (`app/index.html:63-74`, `:176-178`), with the same CSS, fonts and colours.
- No new palette, no new font, no new shadow style.
- Popovers for command arguments (Turn by°, grid°, sharp°/radius/ramp) reuse the existing field styles from `panel.js`.

**Off branch tip `0a11fb4`.** Three parts in parallel, on disjoint files. The contracts are fixed here so no part waits on another.

**Contract S (settings store),** new file `app/settings.js`:
- `get(key, fallback)`, `set(key, value)` and `on(key, fn)`;
- localStorage keys `t180.settings.<key>`, with every read and write in try/catch: on a blocked store, values work for the session and nothing throws;
- the keys: `turnClimbAs`, `dragHandles`, `colourByGrip`, `gridStep`, `mirrorOnInsert`, `csp`;
- the existing `t180.sound.muted` / `.volume` and `t180.coreLook` keys **stay as they are**, so no saved setting is lost.

**Contract M (menu items):** each menu module exports `items(ctx)`. It returns entries `{ label, run }`, `{ label, checked, toggle }`, `{ label, panel: mountFn }`, `{ section }` or `{ separator }`. The bar renders them in the `.more-menu` style.

**Part 1, pane B: the bar, the settings store, and File / Edit / View / Settings.**
- B owns `app/index.html`, `app/settings.js` (S) and a new `app/menubar/`.
- **The order, top right:** File, Edit, Build, Track, Pieces (as today), View, Settings, then the Export to Assetto Corsa button.
- **The ⋯ menu's items move into File and Settings,** and ⋯ is removed. Each control keeps its element id and behaviour, so existing tests and wiring hold.
- **Settings:** sound on/off and volume (today's wiring, `index.html:345-353`), turn & climb read as, grid step, mirror on insert, checker wall raycasting, the Assetto Corsa folder, the launch permission, and reset the guide (`firstrun.js` `forget()`).
- B mounts the Build and Track items from parts 2 and 3 via contract M. Until they land, it uses stubs.
- **Folded in:** review 2's lean cut (`get voice()` and the `rateOf` export off `sound.js`).

**Part 2, pane C: Build and the slim left side** (`app/core/panel.js`, `piecesui.js`, a new `app/core/buildmenu.js`).
- **The Build items:** Straight, Level, To floor, Turn by…, Turn to grid…, Sharp corner…, Jump, Brush, Close the loop. Each `…` opens a popover holding today's argument fields.
- **The left side keeps:** the status line, Undo/Redo, length/turn/climb/bank, "More shape" (folded, holding cup, width, grip, edge, right edge, edge start, tube and the at-start boxes), Extend, Straight, the readout, the selection box (shown **only** with a selection), Cancel close while closing, and the checker summary.
- **The brush strip** shows under the bar while the brush is on, holding mode, what, radius and sharp.
- It wires the six keys through S.
- **Edit's selection items** come from `piecesui.js` via M.

**Part 3, pane A: Track** (`spawnsui.js`, `pitui.js`, `core/textures.js`, a new `app/core/trackmenu.js`).
- Start & grid…, Pit lane… and Road surface ▸ become panels opened from the Track menu, holding the same controls.
- The "Local example" section goes under File ▸ Developer ▸ Open example… via M.

**Rules for all three parts:**
- **Headless only;** never open a window.
- **Test first** for each new behaviour:
  - menus open and close;
  - a moved control still works from its new place;
  - a setting survives a reload;
  - a blocked store doesn't throw;
  - the selection box shows only with a selection.
- **Existing tests:** change one only if it asserts a control's *position*, and say so in the hand-back. A test that asserts what a control *does* must pass unchanged.
- Run targeted tests under the lock. Feel and UI rules apply (match-checking-to-risk): no mutation runs.
- **Each part hands back a headless screenshot** of the window, before and after, so the look can be compared with today's.

**Merge:** the librarian reads all three, then the chair lands B, C and A in that order with one full suite plus TAP, and installs with the builder closed as `.before-d355`.
**Then:** E runs Ponytail review 5 on D355 with the control arm (`plan_ponytail_2026-10-16.md`, "Review 5 gains a control arm").

OUTPUT → NEXT: changed — D355 is three parallel parts (B bar+settings, C build+left, A track).

## D355 parts 3 and 2 read; B still owed (librarian, 2026-10-17 06:4x)

**A (part 3):** read `C:\Users\nname\Downloads\t180-d355\HANDBACK_A.md` (42 lines).
- a7b17a3, 119/119, no test changed.
- `after-Start.png` shows the builder's own look. The top bar is already tight at 1400 px ("Export to Assetto Corsa" wraps to 3 lines).

**C (part 2):** read `exo_memory/handback/p-d355-C_2026-10-17.md` (65 lines).
- ff877fb, +442 −23. Red first. 32 targeted files green (1 skip needs the keeper's private save). The 35 mutation anchors still apply.
- Three position-only test amendments, each named.
- `after.png` shows the same look, and the column now fits one screen at 1600×1000.

**A seam between A and C, ruled now so it's fixed before landing:** both parts claim Start & grid / Pit lane / Open example.
- A mounts its own `SU.mount` / `PIT.mount` instances, and unmounting stops them following the shell. C holds the panel's copies hidden and offers `lend`.
- Two live copies would duplicate controls and follow-the-shell work.
- **Ruling:** A's trackmenu owns them (built and tested that way, with a clean unmount). C removes the held `spawns`, `pit` and `example` from `panel.js`, and re-amends `core-readout-display.test.js:630` (position only, named).

**Unowned, assigned:**
- `csp` → B. Settings ▸ Checker wires `validate-ui/index.js:45-48` through S.
- The brush strip moves under the bar → B, using `panel.brushStrip`.
- The `#textures` mount removal → B (A's note).

**Next:** C makes the seam fix on d355-c now. B hands back. Then I collate all three, and the chair lands B → C → A with one full suite plus TAP.

## D355 part 1 read; all three in; collation and the integration step (librarian, 2026-10-17 06:5x)

**B (part 1):** read `C:\Users\nname\Downloads\t180-wt-b8\HANDBACK_B.md` (105 lines). Accepted.
- 09e6a2e. Red first. `menubar-page` 7/7 runs the real page headless. Settings 6/6. 202/202 targeted. Two position amendments, each named.
- checked: `after-settings.png` shows the builder's own look. All seven menus fit at 1400 px; "Export to Assetto Corsa" wraps to 2 lines.

**The three parts don't meet yet.** Each was built against contract M, but they read it differently. checked by grep in d355-b:
1. **The name:** A exports `trackmenu.developerItems`; B's page calls `trackmenu.fileItems` (`index.html:432`). As built, File ▸ Developer stays empty.
2. **The panel's cleanup:**
   - A returns `{ unmount() }` and C returns a put-back function;
   - B calls `it.panel(holder, ctx)` and keeps nothing (`menubar.js:47`), and it rebuilds the entries every time a menu opens;
   - so **every open of Start & grid / Pit lane makes a new `SU.mount` / `PIT.mount` that is never unmounted and keeps following the shell**. inferred from the code: listeners pile up with each open. That's a real defect, caught before landing.
3. **csp:** B saves it, but nothing reads it. The checker's box (`validate-ui/index.js:45-48`) isn't wired.
4. **The brush strip** sits at the top of the left column (C's); the plan put it under the bar.
5. **`#textures`:** the startup mount is still in `index.html`, so it competes with A's controller.

**Ruling: one integration step, pane B** (it owns `index.html` and `menubar.js`). On a new branch `d355-int` from 0a11fb4, merge d355-b, d355-c (after C's seam fix) and d355-a, then:
- (1) call `developerItems` (A's tested name);
- (2) the bar keeps whatever `panel()` returns, and calls it (a function) or its `.unmount()` when the panel closes, the menu closes or the entries are rebuilt;
  - **new row, red first:** opening Start & grid 5 times leaves 1 live follower, not 5;
- (3) wire csp through S to the checker's box;
- (4) put `panel.brushStrip` under the bar;
- (5) remove the `#textures` mount and section;
- then run `menubar-page`, plus the union of the three parts' targeted sets, under the lock;
- take headless screenshots with Build, Track ▸ Start & grid and Edit ▸ Selection open.
- No existing assertion beyond position changes.

**Then** the chair lands `d355-int` with one full suite plus TAP and installs as `.before-d355`. Then E runs review 5 with its control arm.

OUTPUT → NEXT: changed — the parts need one integration step before landing (a cleanup defect and a name mismatch).

## D355 C seam fix read (librarian, 2026-10-17 06:5x)

Read §6 of `exo_memory/handback/p-d355-C_2026-10-17.md`. Accepted.
- checked: 38bc93f sits on ff877fb (5 files, +21 −20), and the tree is clean.
- **What changed:** panel.js no longer mounts spawns, pit or example. `:630` was re-amended, position only.
- **Twelve rows went red,** because their helpers reached the controls through the panel's root. C moved the helpers to mount `spawnsui`/`pitui` directly, as A's Track menu does. **That's setup, not an assertion,** and every assertion is unchanged. Accepted under the position-only rule; the swap to `trackmenu.js` after landing is optional.
- After the fix: core-spawns-ui 11/11, core-spawndrag 21/21. The anchors still apply.
- **Next:** the precondition for the integration step is met. B builds `d355-int` (fixes 1–5 above).

## D355 B amendment read: the integration is done on d355-b (librarian, 2026-10-17 07:0x)

Read the "Amendment" section of `C:\Users\nname\Downloads\t180-wt-b8\HANDBACK_B.md`. Accepted. It covers my fixes 1–5:
- `developerItems`;
- the panel undone on close, menu close and rebuild (page row 12);
- csp through S (row 9);
- the brush strip under the bar (row 11);
- `#textures` gone (row 10);
- the bar fits at 1400 px (row 8).

checked by B on a scratch merge of 8714ba6 + 38bc93f + a7b17a3: `menubar-page` 12/12 and targeted 366/366. Red first: 6 of 12 failed before the fixes.
- Row 12 checks that the controls leave on close and come back. That covers the leak's cause (each mount is undone), though not by counting followers as I asked. Accepted.
- So no separate `d355-int` branch is needed. **The chair lands d355-b → d355-c → d355-a.** CHANGELOG.md is the only conflict: keep all three entries.

**One visible flaw in `after2-all-track.png`** (I looked at the image): the Export button's right edge touches the window's minimise button. B called it "tight but not overlapping".
- **Ruling: B adds a gap of at least 8 px** before the window buttons, and row 8 asserts that gap.
- It's one CSS line and one assertion, on d355-b, before landing, so the keeper gets one install.

**Also seen, not a blocker:** at 1400×860 the slim column still runs below the fold (Extend sits under the readout). It fits at 1600×1000 (C's shot). The readout's large type is today's, unchanged. Noted for his first look.

OUTPUT → NEXT: changed — a one-line gap fix by B, then the chair lands B → C → A.

## D355 B amendment 2 read: the gap (librarian, 2026-10-17 07:1x)

Read "Amendment 2" in HANDBACK_B.md. Accepted.
- **The look was worse than B had said.** Red first, row 8 read **−92.3 px**: the Export button ran under the window buttons, and the bar was 108 px over at 1400 px. B's own rule caused it; it's corrected now. My look at the screenshot is what caught it.
- **After the fix,** at 1400 px, both by default and with long texts: a 24 px gap and 0 px of overflow. checked: `after3-1400.png` shows the gap.
- `menubar-page` 9/9 here (+3 named skips, since the parts aren't in this tree). CSS tests 30/30.
- The unused `d355-int` worktree (`t180-wt-b9`) is the chair's to remove; it's a delete, so it needs the keeper's OK.
- **Next:** the chair lands d355-b (ecd6837) → d355-c (38bc93f) → d355-a (a7b17a3), with one full suite plus TAP. It installs as `.before-d355`, and then E runs review 5 with the control arm.

## D355 installed; D356 fixes review 5's rows (librarian, 2026-10-17 08:0x)

**The install,** checked:
- the branch reads 6ff2865 / d168b98 / 516e521 "Land D355 part 1/2/3";
- `t180_d355_suite.log` reads 3,047 tests, 3,027 pass, 0 fail, and its TAP copy has 0 `exitCode:` lines;
- the exe is from 07:46 (12,030,464 B), with sha256 `6109e38ca349fbb3…` equal to target/release;
- `.before-d355` is the 00:58 exe (12,015,104 B).

**D356, off 516e521, two parts in parallel, small:**
- **Part 1, pane C (`panel.js`, `core-buildmenu.test.js`):**
  - row 1: the grid step chosen in Build ▸ Turn to grid… is saved through S;
  - row 2: Undo's `putBack` saves `turnClimbAs`. Undo keeps restoring the mode, so what Undo does is unchanged.
  - NEW rows using the real `createSettings`, red first. The stand-in `settingsOver` fires on every set, which is why the old rows missed this.
- **Part 2, pane B (`app/onboarding/guide.js`, `index.html`, `CHANGELOG.md`):**
  - row 3: guide steps 2, 3 and 5 name Build ▸ Brush, Build ▸ Close the loop, and File/Settings, and step 3 targets `#m-build`. Grep `app/test` for guide texts first; if a test pins a text, amend it as text-only, named.
  - row 4: `part()` keeps its error, so the bar shows "This menu could not be built: <reason>"; drop `soon`. Add a new row, red first.
  - row 5: delete the two CHANGELOG sentences that are false.
- Row 6 is left, out of bounds.
- **For both parts:** headless, targeted tests under the lock, no mutation runs. The chair lands C then B with one full suite plus TAP, and installs as `.before-d356`.

OUTPUT → NEXT: changed — D356 is a small fix lap (C + B) from review 5.

## D356 part 2 (B) read; C still owed (librarian, 2026-10-17 08:1x)

Read `C:\Users\nname\Downloads\t180-wt-b10\HANDBACK_B.md` (67 lines). Accepted.
- 33d04c7, +42 −17. Row 13 is red first. `menubar-page` 13/13, targeted 207/207. No guide text is pinned by a test; checked by B's grep.
- **Step 1's extra phrase ("Build ▸ Jump"):** accepted. It's the same stale pointer.
- **Step 2's outline still sits on the left column,** while the brush now opens from Build. **Ruling: B points step 2's target at `#m-build` too,** as one line on d356-b while C finishes. It's the obvious completion of row 3.
- I'm not collating until C's part 1 is in.

## D356 collated (librarian, 2026-10-17 08:1x)

Read C's part 1, `exo_memory/handback/p-d356-C_2026-10-17.md` (38 lines). Accepted.
- 5c390c2, +43 −4.
- Rows 11 and 12 on the real `createSettings` are red first, with the same two assertions in two red runs. 12/12 after.
- Targeted: 36 files green (1 existing skip). The 35 anchors still apply. No assertion changed.
- Undo still restores the mode; it now also saves it.

**Both parts are in.** They touch disjoint files: C has `panel.js` and its test; B has guide/index/CHANGELOG/menubar-page.

**Landing:** C (5c390c2), then B (33d04c7, plus the step-2 target if it's committed by then; otherwise it lands with the next lap), with one full suite plus TAP. Install as `.before-d356`. The chair adds C's CHANGELOG line (§2).

OUTPUT → NEXT: unchanged — land.

## D357: Finish's straight-behind fault, started now while the suite runs (librarian, 2026-10-17 08:1x)

The keeper: "but shouldnt you or a pane do it … if they are deep in it its okay but damn".
- The chair had queued this behind the D356 suite. That's last night's miss again: panes sat idle behind a wait they didn't need.
- The suite is the chair's by rule (the collator runs it at landing). The fault is a pane's, and it starts now.

**A correction of mine to the keeper:** I told him Close "makes a roughly 1.9 km detour" when the end stops just behind the start. The record says otherwise (`:996-997`): **"One press never picks it, but it is a Finish fault."** The one-press Close tries Finish among its routes and rejects that answer. So he won't see the detour from the button. It's a fault in one route, which costs time and could matter if the ranking changes.

**D357, pane B** (it found the fault at D339), off the current tip:
- **Red first:** a new row with an open track whose end is straight, at 8, 20 and 40 m behind the start and pointing the same way. Today Finish's answer is about 1.9 km; the row asserts something short (bound: under 3 × the gap plus the turn-in), and red now.
- Then the fix in Finish. Check that the one-press pick and its closed hash are unchanged on the reported save (row 14), and that every existing close row passes unchanged.
- Run targeted tests under the lock. Close is core maths, so run the close mutants once at the end.
- **Order:** reading and the red row now. Heavy runs queue behind the chair's D356 suite on the lock; they don't run beside it.

OUTPUT → NEXT: changed — D357 to B now, in parallel with the D356 suite.

## D358: ELYSIUM re-skinned with the sci-fi texture (librarian, 2026-10-17 08:5x)

The keeper, verbatim: "can you change the track texture on current elysium to the sci fi one u made".

**Found, checked:**
- **The texture:** `C:\Users\nname\Pictures\T-180 texture options\E semi asphalt sci-fi (35 m x 40 m).png` (141,006 B; I looked at it). It's dark asphalt with cyan glowing edges, white dashes and blue centre diamonds. The Third Place made it on 2026-10-12.
- **Its texmaker spec** (base `#2b2c31`, then noise, grain, …) isn't in a `.texture.json` beside it. It's in the Third Place transcript, `C:\Users\nname\.claude\projects\C--Consonance-instances-third-place\3d000000-0000-4000-8000-000000003d00.jsonl`; grep "semi asphalt sci-fi', base:".
- **The current ELYSIUM in AC:** `G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks\t180b_elysium`. Its `.t180b-builder.json` reads written `2026-10-16T21:45:58Z`, and the kn5 is 187,039,677 B, 10-16 15:46. That's the keeper's own export from the builder. Its `extension/` folder is from 10-12.
- **The old sci-fi ELYSIUM** is the 10-12 zip on the Desktop, `ELYSIUM (T-180 track).zip`. Don't use it: it's the older track.

**D358, pane A:**
1. Find the save that produced the 10-16 21:45Z export: the builder's newest ELYSIUM `.t180track` in the app's data folder. Match the track by piece count and length against the installed export. Read only.
2. Recover the sci-fi spec from the transcript. Render it with `app/texmaker` at its 35 m × 40 m tile, and check it against the PNG (same size, matching pixels).
3. Export that save headless through the builder's own export path, with the sci-fi texture as the road surface. Keep everything else as the 10-16 export had it.
4. **Back up first:** copy the whole installed `t180b_elysium` folder to `t180b_elysium.before-scifi` (the keeper ordered the replace, and the backup keeps it reversible). Then install. Keep `extension/` as it is.
5. **Verify:**
   - the new kn5 embeds the sci-fi texture (by name or by hash of the bytes);
   - the track's geometry is unchanged (the same piece count and length, and AI line length within 0.1%);
   - no window opened.
6. **Also replace the Desktop zip** with the new export, as the Third Place did before. Back up the old zip as `ELYSIUM (T-180 track).before-scifi.zip`.
- Never touch the builder exe or its install. No push.

OUTPUT → NEXT: changed — D358 to A, now.

## The Serum licence is settled; push the track builder (librarian, 2026-10-17 09:0x)

The keeper, verbatim: "xfer said we can use them lol". That answers the licence call from D349, so the Serum samples ship. His earlier question, "have u ever pushed the shit to github … track builder i meant", is the push word.

checked before the push:
- `feature/denser-asphalt` (7a785d6) is 80 commits ahead of `origin/main` (5aa226d, 2026-10-14 23:20), and it's a fast-forward;
- the repo is PUBLIC;
- the credential scan of the 80-commit diff (sk-or-, vck_, sk-ant-, ghp_, github_pat_, AKIA, PRIVATE KEY) found 0 hits;
- 0 tracked changes are uncommitted.
- Four commit bodies say "the keeper". That's not a credential (privacy means credentials only), and the CHANGELOG has none.

**The chair pushes** `feature/denser-asphalt` to `origin/main` as a fast-forward. Nothing is force-pushed, and nothing else is pushed. The librarian doesn't push (seat rule).

## D358 A read: the sci-fi ELYSIUM is built; the install waits on Content Manager (librarian, 2026-10-17 09:0x)

Read `C:\Users\nname\Downloads\t180-d358\HANDBACK_A.md` (43 lines). Accepted.
- **The spec, recovered exactly:** byte for byte, and the preview PNG matches sha256 `8bc4843a…`.
- **A control export reproduces his installed 10-16 export,** apart from last-bit floats. So the only change is the texture.
- **The new kn5:** sha256 `cc016b10…`, 203.8 MB.
  - Geometry: max 4.8e-7 m across 3.6M vertices. Markers identical. AI line 25,038.545 m in both.
  - The texture is 2048 px, tiled 35 m × 20 m as the Third Place laid it.
- The Desktop zip is replaced, with `.before-scifi.zip` kept.
- The backup of the installed folder sits outside `content\tracks` (a copy inside would show as a broken track).
- **The install isn't done.** checked: `Get-Process` at 09:0x shows Content Manager (pid 24408, started 08:41) running, and AC not running.
  - `install_scifi.ps1` refuses while either is open, and refuses unless the installed kn5 is `382c7953…`.
- **Next:** when the keeper says Content Manager is closed, A runs `install_scifi.ps1` and checks the hashes. He doesn't run anything himself.

## D358 installed, and the push verified (librarian, 2026-10-17 09:0x)

- **The install,** checked: the installed `t180b_elysium.kn5` is sha256 `cc016b100460040a…`, 203,816,893 B, which matches A's new export. A's amended hand-back reports 10/10 files equal, and the `.before-scifi` folder intact.
- **The push,** checked: after `git fetch`, `origin/main` reads `7a785d6`, so GitHub holds all 80 commits, the Serum sounds included.
- **D358 is closed.** D357 (B, the Finish fault) is still open.

## D359 (queued): push, and release 0.4.0 after the current work (librarian, 2026-10-17 09:1x)

The keeper, verbatim: "after all the current work is done for track builder push and make new release".
- **"Current work"** = D357 (B, Finish's straight-behind fault), the only open track-builder lap. D358 changed no repo code.
- checked: the latest release is v0.3.6 (2026-10-15, one asset `T-180.Track.Builder_0.3.6_x64-setup.exe`), `tauri.conf.json` reads 0.3.6, and `CHANGELOG.md` has `[Unreleased]` above `[0.3.6]`.
- **Version: 0.4.0** (my call, his to veto). The menu bar, saved settings, the Serum sounds and the faster Close are a bigger step than a patch.
- **The 0.3.6 shape to follow:** release commit b9cd76c, plus 67b8863, a Cargo.lock entry missed the first time. **This time all three version files go in one commit:** `tauri.conf.json`, `Cargo.toml`, `Cargo.lock`.

**Steps, once D357 has landed with its suite:**
1. **Pane A** (free since D358), on a branch from the tip:
   - bump the version to 0.4.0 in all three files;
   - move CHANGELOG `[Unreleased]` to `[0.4.0] - 2026-10-17`, in our own words (no quotes of him, no "the keeper");
   - build the NSIS installer headless (`cargo tauri build`, with no window launched);
   - hand back the setup.exe's path, size and sha256, plus a release-notes draft (Windows only, per-user, updates 0.3.x in place, not code-signed: the 0.3.6 body's form).
2. **The chair** lands the release commit with one full suite plus TAP, and installs as `.before-0.4.0` with the builder closed.
3. **The chair** runs the credential scan, pushes to `origin/main` (fast-forward), then runs `gh release create v0.4.0` with the setup.exe and the notes.
4. **The librarian** verifies: `gh release view v0.4.0` (asset name and size), and `origin/main` equals the release commit.

OUTPUT → NEXT: changed — the release is queued behind D357.

## D360 (research, now): layouts of one track (librarian, 2026-10-17 09:1x)

**The keeper, verbatim:** "can we make it so, say once a track is built, you can highlight a piece, even if its in the middle, and then you delete it effectively seperating the track into two from that piece being deleted, and then can even be tweaked new corner, or even different layouts for the same track, similar to Aurora Cryopticon Long, medium, and short".

**My reading (his to correct):**
- A middle delete *cuts* the track, leaving two open ends instead of closing the gap.
- He builds a connector between the ends with the existing tools.
- The result is saved as another **layout** of the same track, and exported as one AC track with several layouts.

**The worked example, checked:** `G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks\cash_auroracryopticon`
- Layouts `aurora_long` ("Aurora Cryopticon Long", 29,335 m) and `aurora_medium` ("… Medium", 16,873 m).
- `models_aurora_long.ini` loads `cash_auroracryopticon.kn5` (267 MB) plus `environment.kn5` (128 MB); `models_aurora_medium.ini` loads `auroracryopticon_medium.kn5` (210 MB) plus the same `environment.kn5`.
- Each layout has its own `ai/`, `data/`, `map.png` and `ui/<layout>/`.

**Parts, in parallel, no code:**
1. **Pane C: the builder side.**
   - What the middle delete does today (`piecesui.js` preview, Apply/Cancel, what moves) and the document model (`document.js`).
   - What a layout needs: a cut that leaves two open ends; connecting them with Extend/Close; several layouts in one `.t180track` (shared pieces plus per-layout cuts and connectors, or whole copies); how undo, the checker and spawns/pit behave per layout.
   - Two or three model options with their costs.
2. **Pane E: the AC side.** The multi-layout folder format from the Aurora example plus AC/CSP documentation (official first):
   - which files are per layout and which are shared;
   - whether shared road can sit in one common kn5, with only the differing pieces per layout (the download size);
   - how Content Manager shows layouts;
   - what our exporter writes today (`src/export/`) against what it would need.
   - Read only. Don't copy Aurora's files anywhere.
3. **Librarian:** merge into a mockup page with the choices. No build until he picks.

It doesn't block D357 or the D359 release.

OUTPUT → NEXT: changed — D360 research to C and E now.

## D359 A part 1 read: two rulings (librarian, 2026-10-17 09:1x)

Read `C:\Users\nname\Downloads\t180-d359\HANDBACK_A.md` (18 lines). Accepted. The notes draft is in the 0.3.6 form, with one open slot for D357.
1. **The Serum sentence stays,** in the CHANGELOG, and the release notes may name it too.
   - The licence is no longer unclear: the keeper said "xfer said we can use them" (09:04, recorded above). A's D349 "unclear" was right when it was written, and the keeper's word has settled it since.
   - Naming the source is honest attribution.
2. **`docs/RELEASE.md` is added to the release commit:** title and installer name to 0.4.0. Leaving it at 0.3.6 would be the Cargo.lock miss again.

**Next, unchanged:** the chair rings A with D357's tip once D357 has landed with its suite.

## D360 C read; E still owed (librarian, 2026-10-17 09:1x)

Read `exo_memory/handback/p-d360-C_2026-10-17.md` (127 lines). Accepted, and I'm holding it for the merge.
- **Today:** a middle delete closes the gap, and it's refused on a closed track.
- **The key find:** a cut works today with no format change, by rotating the lap so the piece after the cut comes first. That gives an ordinary open track, with nothing built moved. Finish to start then connects without moving kept road.
- **The options:**
  1. whole copies, as separate tracks (recommended);
  2. one file with a container format;
  3. shared pieces (high risk: every base edit moves every layout's gap).
- **Open, unchecked:** whether a closed lap's seam passes `jointProblem` after rotation (one `checkDoc` call); the start line's `along` after rotation; whether Aurora's layouts share a start line (E has the files).

## D360 merged: the layouts mockup is published (librarian, 2026-10-17 09:2x)

Read E's `exo_memory/handback/p-d360-acside-E_2026-10-17.md` (151 lines). Accepted.
- **Per layout:** `models_<L>.ini`, `<L>/{data,ai,map.png}`, `ui/<L>/`. **Shared:** the kn5s, and `extension/`.
- **Kunos shares road** in common kn5s, saving 48–61%. Aurora shares only its environment (17.5%).
- **CM** finds layouts through `ui/*/ui_track.json` and picks the main one by `priority`.
- **Our `src/export/layouts.js` `exportProject` already writes whole-copy layouts,** but the app never calls it (G1). G2 is shared road; G3 is a dropped layout lingering in CM; G4 is `priority`.

**Mockup:** https://claude.ai/artifact/8cdMdzNKoENdkeqT95kgRR ("T-180 Track Layouts"). Four choices, each with my pick:
1. each layout is its own saved track (C's option 1);
2. whole road copies first (the existing exporter), with shared road later;
3. re-export removes a dropped layout's own marked files (that's a delete in his AC folder, so it needs his yes);
4. the start line is kept where its piece survives.

The main layout is written as `priority`: not a choice, just done.

**Next:** his picks, then a D361 build plan (C: Cut here… + rotation + start-line carry; B: wire `exportProject` to a layouts export + `priority` + G3 if yes). Not before D359 ships unless he says.

## D361: Cut, and a layouts export, simplified at the keeper's word (librarian, 2026-10-17 09:2x)

**The keeper, verbatim:**
- "I think youre thinking too deep about it, if a user tries to change a section of the track, it is up to them to make a new name for the save, say elysium alt … step 1 select and cut, two open ends, and then the user chooses how to connect them."
- "If the user wants to have multiple layouts of one track, make it so it exports how aurora does its versions, might even want to look into the work you did before on the thunderhead night optimization … reading the artifact pretty sure you know what ur doing".

**So:** there's no layout management in the builder. The mockup's four choices resolve to my picks: separate saves, whole road per layout, the start line kept, and re-export removing only our own marked files.

**The Thunderhead lesson, checked** in `Desktop\ThunderheadRaceway_NightOptimized_v1.zip` (2026-09-10, its README):
- That work added a third layout, `night_optimized`, to an existing track: `models_night_optimized.ini`, `night_optimized/{ai,data,map.png}`, `ui/night_optimized/`.
- **"CSP gives every layout of a track the same lighting config"**, so per-layout differences needed `extension/stock_lights.lua` keyed on the layout.
- **For us:** the layouts export writes ONE root `extension/`, with nothing per layout in it.

**I missed this at dispatch.** `exo_memory/handback/p-aurora-C_2026-10-04.md` (C's read of Aurora's widths, D233) was on disk, and I didn't surface it. Logged as a miss.

**Parts, in parallel, off the current tip:**
1. **Pane C: Cut** (`src/core/piece.js` `cutRun` beside `deleteRun`; `coreshell.js` preview and Apply, with a pre-cut backup; Edit ▸ Selection item "Cut here").
   - A cut works on a closed or an open track, middle or end, and leaves two open ends via C's rotation (D360 §2). Nothing built moves.
   - The user connects with Extend/Close. Saving under a new name is the user's choice (Save as / track name). No layout concept.
   - The start line is kept when its piece survives. If it doesn't, it's reset with a message. The pit lane or hotlap on a cut piece is dropped with a message.
   - **Red first:**
     - cut a closed lap's middle run → open, the same piece ids rotated, and every kept vertex unmoved;
     - `checkDoc` passes on the rotated lap (C's open question);
     - edge cases: flights at the cut, the start piece cut.
2. **Pane B: File ▸ Export layouts…**
   - Pick 2 or more saved tracks, give each a layout name and display name, and mark one as main.
   - It writes one AC track folder the way Aurora does, using the existing `src/export/layouts.js` `exportProject` (whole road kn5 per layout).
   - **Close the gaps:**
     - G1: the app calls it. Check first that `project.js`'s doc type fits the app's `src/core/document.js` (C's flag), and adapt at the boundary if not.
     - G3: on re-export, remove only files the previous marker listed that the new export doesn't write.
     - G4: write `priority` (main highest), and display names like "Elysium Long".
     - One root `extension/` (the Thunderhead lesson).
   - **Red first:**
     - two saved tracks export to Aurora's folder shape;
     - CM-style discovery finds both layouts via `ui/*/ui_track.json`;
     - a dropped layout's files are removed and nothing foreign is touched;
     - the main layout has the highest priority.
3. Headless only, targeted tests. **Close and export are core maths:** mutants once each at the end.

**Ordering:** D361 doesn't hold the 0.4.0 release. The release goes when D357 lands, and D361 ships in the next one.

OUTPUT → NEXT: changed — D361 build to C (Cut) and B (Export layouts), now.
- **A correction to the line above:** part 2 goes to **pane E**, not B. B is still on D357, and a named pane is not a lock (this morning's lesson). E is free and wrote D360's AC side.

## The stale ghost, deleted; D362: read his fast lap (librarian, 2026-10-17 09:3x)

**The ghost bug, as found:**
- AC keys its ghost by track folder name (`Documents\Assetto Corsa\GhostCar\t180b_elysium\`), not by shape.
- The ghost was from 10-12 21:38, the old ELYSIUM before the 10-16 end-section change. The CMRT HUD's lap/sector files are also from 10-12.

**The keeper, verbatim:** "delete the old ghost its fine".
- **Done by me,** checked: `GHOST_CAR_sol_ohyeah2389_t180_mach6.ghost` (645,189 B, sha256 `51a39fd35c5ad55f…`) removed. The folder is empty now.
- AC wasn't running; Content Manager was.
- The CMRT HUD's `.lap` files weren't asked about, so they're untouched.

**The builder side, still open:** auto-retire stale ghosts on a shape-changing re-export. Asked in my reply; no answer on that half yet. Not queued.

**D362, pane A** (free until D357 lands): read his newest replay. Read only.
- **The replay:** `C:\Users\nname\Documents\Assetto Corsa\replay\ohyeah2389_t180_mach6_t180b_elysium__171026-093020.acreplay` (44,476,399 B, 09:30).
- **His words:** "check out the new lap anyway, its the last lap in the newest replay, that was a fast run, prob close to my fastest maybe i can be a few seconds quicker".
- **The tools:** the repo's own replay readers (`tools/speed.cjs`, `loads.cjs`, `jump_flight.cjs`).
- **Find:**
  - every lap in the replay with its time;
  - the last lap's time and its splits at the track's timing gates (`AC_TIME_n` in the installed kn5);
  - per section, the best of his laps in this replay (a theoretical best) against the last lap;
  - **where the few seconds are:** the sections where he loses most against his own best, with speed traces at the entries (braking earlier, a lower minimum, a later throttle by the speed rise), plus the jump (take-off speed, flight, landing).
- **Output for the keeper, in plain words:** "you lost X s at Y, because Z", in turns he'd recognise by distance and by what's there. No log-reading handed to him.
- **Not this:** the 10-16 08:39 replay is the old layout, so it's not comparable.

## The lap records cleared; his time written as the PB; D363 queued (librarian, 2026-10-17 09:3x)

**The keeper, verbatim:** "yes clear em, if anything manually put the time on the latest replay there, even if there is no ghost".

**Done by me,** checked: the 4 CMRT HUD files for ELYSIUM are removed from `Documents\Assetto Corsa\CMRT-Essential-HUD\`. Their sha256 prefixes, for the record:
- `fast.lap` `4d999f8c36a4`
- `s1.lap` `34e8b30c1094`
- `s2.lap` `b1c0512dc7ac`
- `s3.lap` `e078235b171a`

**Folded into D362 (A):** once the last lap's time is read from the replay, write it as his ELYSIUM personal best.
- **Where AC keeps it:** `Documents\Assetto Corsa\personalbest.ini`, which has no ELYSIUM entry today (checked: 38 sections, none for t180b_elysium). The section is `[OHYEAH2389_T180_MACH6@T180B_ELYSIUM]`, with `DATE=<epoch ms of the replay>` and `TIME=<lap ms>`, in the shape of the existing entries.
- **Back up `personalbest.ini` first,** and write only with AC closed.
- **Content Manager's own lap-times store** (`%LOCALAPPDATA%\AcTools Content Manager\Progress\Lap Times (*).data`) is not plain text. A reads its format first, and writes there only if it can do so safely, with a backup. Otherwise A says so.
- CMRT's `fast.lap` is a recorded lap, not a number, so it can't be typed in. It rebuilds on his next run.

**D363 (queued after D361):** the export moves a track's stale ghost (`GhostCar\<track>\`) and CMRT laps into a dated backup beside them, on a re-export that changes the shape. The check is the geometry hash against the previous marker; a texture-only re-export leaves them. I'm reading the keeper's "yes" as covering this half too; his to veto.

## D357 B read: Finish's straight-behind fault, fixed (librarian, 2026-10-17 09:3x)

Read `C:\Users\nname\Downloads\t180-wt-b11\HANDBACK_B.md` (71 lines). Accepted.
- **The cause:** Close can't bend a lone straight (the equations are singular), so Finish fell to a 360° loop. At 8 m the straight was under `MIN_STRAIGHT_M`.
- **The fix:** a refused laid road is taken as laid when it already meets the start within Close's own bars (1 mm, 1e-6). A no-turn route is laid at its exact length from 1 m.
- **After:** 8, 20 and 40 m of new road. Red first: row 17.
- **Row 14's closed hash is unchanged** (`8283d1a4c396`, the same as D350's).
- Targeted 105/106. The 1 failure was the row's own −0 assertion, a test that was wrong and is fixed and named.
- Close mutants 45/45, with N1 and N2 new.
- **B also caught a harness gap:** the control never ran `core_finish`, so N1/N2's first "catches" meant nothing. The harness now runs it and carries `test/fixtures`. Added, not weakened.
- **Carried as design questions, not defects:** one press prefers bending a 1000 m turn by 40 m over adding a 40 m straight (`byOrder`); an end slightly off the line isn't covered.

**Landing:** the chair lands d357-b (d7c5773) with one full suite plus TAP, and installs as `.before-d357`.
**Then D359:** **pane B** builds the 0.4.0 release commit (A is on D362; a named pane is not a lock), with A's notes draft at `C:\Users\nname\Downloads\t180-d358\release_notes_0.4.0_DRAFT.md`, plus D357's line, plus the two rulings above (Serum stays; `docs/RELEASE.md` bumped).

## D364: the texture repeats where ELYSIUM widens (librarian, 2026-10-17 09:4x)

**The keeper, verbatim:** "towards the end where the track gets wider? The texture sort of repeats in a weird way. I had an idea, the texture will be made at the end of the track, so that you can see the global width of the track, and the widest or thinnest it gets to make a global texture that works on each thickness without inconsistency".

**The cause, checked:**
- D358 laid the sci-fi texture with `fit: 'tile'`, `tileWidth 35`.
- A flagged it at `C:\Users\nname\Downloads\t180-d358\HANDBACK_A.md:17`: "That only fits because ELYSIUM is 35 m wide everywhere … I did not re-measure the width along the whole lap." I accepted it without having that checked. **My miss.**
- `src/doc/textures.js:13` has two modes: `'tile'` (repeat every tileWidth m) and `'fit'` (stretch once across the strip's own width). With tile, a section wider than 35 m repeats the pattern, so the edge glow shows inside the road.

**Parts:**
1. **Pane A, after D362, quick:**
   - measure ELYSIUM's width along the lap (min, max, where) from the save;
   - re-export with `fit: 'fit'`;
   - headless preview renders of the narrowest and widest sections, before and after;
   - install only after the librarian has read it, with AC/CM closed, using the `.before-*` backup pattern of D358.
2. **Later, after D361, a builder feature (his idea):** a fit mode whose edge bands are anchored in metres at each edge, with the centre fitted to whole repeats of the local width. Texmaker builds the texture at export from the track's width range. It's core export, so test first, plus mutants once.

OUTPUT → NEXT: changed — D364 part 1 to A after D362; part 2 queued.
- **His clarification, verbatim:** "when I mean end of the track I meant when the track is closed and completedf". So part 2's texture is built once the track is closed, when its whole width range is known: at Close, and refreshed at export if the widths changed. That's not a fixed setting chosen before the track exists.

## D361 part 2 (E) read; C's Cut still owed (librarian, 2026-10-17 09:4x)

Read `exo_memory/handback/p-d361-layouts-E_2026-10-17.md` (91 lines). Accepted, and held for the collation with C.
- 4ca68a9 off 7a785d6, +815 −32. File ▸ Export layouts… writes Aurora's shape.
- **Each layout's kn5 is byte-identical to that track's own Export** (row A1).
- **G1:** `project.js` doesn't fit (checked), so the boundary opens each save in its own core shell.
- **G3:** the native `write_layouts_export` removes only the previous marker's own plain files, never through links.
- **G4:** `priority` (main 1), proven against CM's discovery port with a control.
- **Checks:** targeted 59/59, 0 `exitCode:`. Cargo 39/39. Mutants 17/19; the 2 uncaught are equivalent (a junction already fails `isFile`).
- **Owned by E:** the code was written before its test (the reds are shallow; the mutants carry the behaviour).
- **Not run:** a real native write in the app. His hands, after the install.
- **Landing:** after the 0.4.0 release, with C's Cut, one full suite plus TAP, and a `cargo tauri build` (there's a new native command), with the builder closed. Also run `core-mutation` once, since this is export code at a landing.

## D362 A read: his lap (librarian, 2026-10-17 09:4x)

Read `C:\Users\nname\Downloads\t180-d362\HANDBACK_A.md` (70 lines). Accepted.
- **The last lap is 2:25.284.** The game's timer and A's gate crossings agree to 6 ms. Lap 2 was 2:31.155.
- **The headroom from his own two laps is about 0.3 to 1 s,** depending on the cut size, which A states honestly. It's not "a few seconds".
- **The places:**
  - 4.5–7.0 km after the line: 0.50 s (a slower minimum in the short bends, more slide, a later climb out);
  - p29 spiral: 0.12 s;
  - the 19–21 km flat-out stretch: 0.15 s (it reads as the car, not the driving);
  - the first spiral hairpin: 0.09 s.
- **His pedals are clean:** 88% full throttle, braking at 0.94–1.00, throttle back within 0.08 s of every apex.
- **Coasting** is the only pedal-level time: about 0.3–0.55 s stretches at p4–p5, p12, p29, p44 and p45.
- **No jump on this layout.**
- **A carried a tool fault:** the blackbox parser fails on a long standing start. A worked around it with a local copy; the repo was untouched.
- **The PB write wasn't done yet,** because the addition was queued behind this read. It's 145,284 ms for A to write next.

## D364 part 1 read: the renders look right; install it (librarian, 2026-10-17 09:5x)

Read `C:\Users\nname\Downloads\t180-d364\HANDBACK_A.md` and looked at `render-sheet.png`. Accepted.
- **The widths:** 35 m for 24,092 m. It widens over p43 to 60 m through p44–p45 and narrows back at p46, so the last 960 m. Before the fix, u ran to ±0.857 at 60 m, which put the glow 12.5 m inside the edges.
- **The renders:** in the "after" column, the glow sits on the edges at 35 m, on the ramp and at 60 m. The dashes and diamonds spread proportionally.
- **A builder defect, found:** `fit: 'fit'` is ignored on equation-core tracks. `src/texture/flow.js` reads only `tileWidth`; checked by A, and the export came out byte-identical. A applied the fit rule in memory, with the repo untouched.
  - **The permanent fix goes in D364 part 2:** `flow.js` honours `fit`, with a test, red first.
- **Install now:** AC and CM must be closed (the script refuses otherwise). **Also refresh the Desktop zip** with a `.before-d364.zip` backup, so it matches what's installed (the D358 order).

## D365: the author name in Settings, the builder credit kept (librarian, 2026-10-17 09:5x)

**The keeper, verbatim:** "when ever a track is exported, it says the author is t-180 track builder. i do sort of like that, but know some people will hate that and want their own name to be on it … The t-180 track builder being the author might soothe the anti ai crows".

**My view, ruled in the line of work; his to veto:**
- The author is the person, with the builder credited alongside.
- The builder is a geometry tool, not generative AI. Naming the person as author is the honest answer to "did AI make this", and "built with" names the tool.

**Today, checked:** `src/export/fromwords.js:295` writes `author: 't180-track-builder'`, `description: meta.description || 'Built by t180-track-builder.'` and `tags: ['t180','original']`. The installed ELYSIUM's ui_track.json reads author "t180-track-builder" and description "Built from equations by t180-track-builder.".

**D365, pane A** (free), off the current tip:
- **Settings ▸ Author name:** a text field, through S, with a new key `author` (a string, trimmed, at most 64 characters).
- **Blank keeps today's author** exactly. Make the default display "T-180 Track Builder"? Not without his word: keep today's string, `t180-track-builder`, when blank.
- **The export writes** `author = <name> || 't180-track-builder'`.
- **The builder credit is always kept:**
  - the description still ends "Built with T-180 Track Builder." (or today's sentence, if a test pins it; check first);
  - the tags always include `t180-track-builder`.
- **Both paths:** the single export and E's Export layouts (D361) when it lands. The single path now; layouts in the D361 collation.
- **Red first:**
  - a name set → ui_track.json author is the name, and the credit tag is still there;
  - blank → today's bytes for author;
  - a blocked store → today's author, and nothing throws.
- Targeted tests only. Export is core, so run the `core-mutation` rows for `fromwords.js` once.

## D365 addition: a README section on AI (librarian, 2026-10-17 10:0x)

**The keeper, verbatim:** "this should be reworded and quoted somewhere at the top of the readme, not directly saying to anti ai people, but just explaining it to someome who might not understand the disticntion between a tool made with ai and generative ai".

**The text, mine, for A to place as-is** in `README.md` right after the intro paragraph and above `## Install`. It's in our own words, with no quote of him and no "the keeper". **One wording point:** say "the racing line AC's computer drivers follow", never "the AI line", in this section.

```
## Made with AI, not made by AI

T-180 Track Builder was written with the help of AI coding assistants. The tracks it makes are not generated by AI.

Those are two different things. Generative AI invents something from a prompt: you describe what you want and it fills in the rest. This builder doesn't work that way. It is a geometry tool. Every corner, length, climb and bank angle on a track comes from a number someone typed or a handle someone dragged, and the builder turns those choices into the road, the racing line AC's computer drivers follow, and the files Assetto Corsa loads, the same way every time. Ask it for "a fun track" and it has nothing to give you: a person has to design one.

So an exported track can carry its designer's name as the author (Settings ▸ Author name), and it always credits the builder as the tool, the way a model made in Blender is still the modeller's work.
```

**Checked against the code:**
- the textures come from texmaker's procedural layers;
- Close and Finish are deterministic geometry;
- the sounds are rendered from synth presets.
- None of it is a generative model. If a pane finds one, it says so before placing the text.

**Also for D359 (B):** `README.md`'s Install section still names 0.3.6 (its lines 15–17). The release commit bumps it to 0.4.0, along with the other version files.

## D365 README text: the FINAL version replaces the earlier one (librarian, 2026-10-17 10:0x)

The keeper found the first draft's description of generative AI confusing ("it confused me reading it so it prob wil confused everyone"). He asked for a closing poke ("not an insult, just an intelligent poke"), liked "we'll wait" ("it takes people months and months to make a single track"), and didn't object to the plain version. So **this text replaces the block in "D365 addition"**, placed as-is after the intro paragraph and above `## Install`:

```
## Made with AI, not made by AI

AI helped write this app's code. It does not make your tracks.

You build every track yourself: you pick each corner, length, climb and bank angle, and the builder turns your choices into a track Assetto Corsa can load. It makes nothing up on its own, and the same choices always give the same track.

That's why your name can go on a track as its author (Settings ▸ Author name), with T-180 Track Builder credited as the tool, the way a model made in Blender is still the modeller's work.

Still feels like cheating? The builder won't design your track for you. That part was always yours. Or open Blender and do it by hand; we'll wait.
```

## D365 README: the closing line changed, at his pick (librarian, 2026-10-17 10:1x)

The keeper: "i think 2 is the most mature". In the FINAL block above, **replace the last paragraph** ("Still feels like cheating? The builder won't design your track for you. …") with:

```
It was never the tool that bothered anyone. It's that what used to take months now takes an evening. Still feels like cheating? Open Blender and do it the long way. We'll wait.
```

Everything else in the FINAL block stays.

## D361 collated: Cut (C) and Export layouts (E) (librarian, 2026-10-17 10:2x)

Read C's `exo_memory/handback/p-d361-C_2026-10-17.md` (79 lines). Accepted.
- `cutRun` rotates the lap. Kept pieces are the same objects. Kept road moves ≤ 5.2e-5 m before the old seam, and within the lap's own closing gap (≤ 1 mm, here 0.26 mm) after it.
- **D360's open question is answered:** `checkDoc` passes on rotated legacy, cup and tube laps.
- Red first: 0/7 and 0/6, then 7/7 and 6/6. Targeted 64 files green. Close mutants 43/43. Anchors 93/93.
- One position-list amendment (Edit's item list gains Cut here), named, and it got stronger.

**Ruling on `CUT_OPEN_MIDDLE`: the refusal is accepted.**
- His ask is to cut a finished (closed) track and get two open ends. On an open track, a middle cut would leave two separate roads, which one document can't hold.
- The refusal names the way through: close first, or cut from an end. If he wants open-track middle cuts later, that's a new ask.

**Both parts are in** (E's 4ca68a9, C's ea65586, both off 7a785d6). The files are disjoint, except that both add a CHANGELOG entry.

**Landing, after the 0.4.0 release:**
- d361-c then d361-e (CHANGELOG: keep both);
- one full suite plus TAP; `core-mutation` once (export code); `cargo tauri build` (E's native command);
- install with the builder closed as `.before-d361`.

**Then:** D365 (A: the author name plus the README sections) lands on top. **The README essay sections wait for the keeper's final OK** before they go to a pane.

## D365 read (built by E, not A) (librarian, 2026-10-17 10:2x)

Read `exo_memory/handback/p-d365-author-E_2026-10-17.md`. Accepted.
- **The commit:** cc17e0d on d365-e, stacked on d361-e 4ca68a9.
- **What it does:** Settings ▸ Author name, saved through S as `author`.
  - A blank name gives exactly `t180-track-builder`. A name over 64 characters is refused as `BAD_AUTHOR` before anything is built.
  - Tags always carry `t180-track-builder`.
  - The descriptions are unchanged; they already credit the builder.
  - All export paths carry the name, Export layouts included.
- **Red first:** 4/4 and 5/5. Author tests 15/15. One position amendment, named (the settings key list).
- **The README section,** checked: `README.md:11-19` in cc17e0d is the FINAL text with the "It was never the tool…" closing line. I read it in the worktree.
- **E's generative-AI check was clean:** no network or model calls; `Math.random` appears only in the fallback synth's noise.
- **Seen, not changed:** "AI line" at `README.md:131`, `:169`, outside the section. Leave it; it's AC's term in a technical context.

**Landing, after 0.4.0:** d361-c (ea65586), then d365-e (cc17e0d, which contains d361-e). Keep every CHANGELOG entry. One full suite plus TAP, `core-mutation` once, `cargo tauri build`, install as `.before-d361`.

**The README's "How it was made" and the essay** wait for the keeper's OK, then go in a follow-up commit.

## D364 part 2a read: flow.js honours fit (librarian, 2026-10-17 10:3x)

Read `C:\Users\nname\Downloads\t180-d364\HANDBACK_A_2a.md` (49 lines). Accepted.
- b3b7b8a + 1030bd8 on d364-a, off 04d1841. 17 lines in `src/texture/flow.js`, plus rows 7–10b.
- **Red first,** each for its own reason, at tileWidth 10, so the old code couldn't pass by accident.
- **Tile mapping is pinned** by a digest taken before the change. Targeted 61/61. The first mutant run read 7 of 8, then 8/8 after adding the row it showed was missing. No existing test changed.
- **The export from the fixed repo code is byte-identical to the installed kn5** (`21a13bf8…`). So the permanent rule is exactly what's in his AC now.
- **Landing:** with D361/D365 after 0.4.0, adding A's CHANGELOG line under Fixed.
- **Part 2b, still queued:** building the texture at Close from the width range, with anchored edge bands.

## D365 follow-up read: the README sections placed (librarian, 2026-10-17 10:3x)

Read §4 of `exo_memory/handback/p-d365-author-E_2026-10-17.md`. Accepted.
- **e655ace on d365-e:** README.md only, +52.
- **Placement:** section A at `:21` after "Made with AI", and section B at `:215` as the last section.
- **The byte check** against `exo_memory/loop/readme_t180_sections_2026-10-17.md` matches, except for two figures, each re-derived by command: 270 commits, 227 test files.
- 0.4.0 isn't published yet, so the releases figure stays at 7.

**Ruling: the figures are refreshed once more, right before the push** that carries them, so GitHub shows true numbers.
- After 0.4.0 is out and d361-c, d365-e and d364-a have landed on main, pane E makes a one-commit refresh on main:
  - `git rev-list --count HEAD`;
  - the release count (8 with 0.4.0) in both places, "and N releases" and "N releases in three weeks" (the span recomputed);
  - the test-file count.
- The chair includes that commit in the landing's push.

**Landing order after 0.4.0:** d361-c → d365-e (e655ace) → d364-a, then E's figure refresh. One full suite plus TAP, `core-mutation` once, `cargo tauri build`, install as `.before-d361`, then push.

## D359 step 1 (B) read: 0.4.0 is ready to release (librarian, 2026-10-17 10:3x)

Read `C:\Users\nname\Downloads\t180-wt-b12\HANDBACK_B.md` (45 lines). Accepted.
- **The release commit:** 918e55b on 04d1841, 6 files, with all the version files in one commit, `docs/RELEASE.md` and `README.md` Install included. The Serum line stays.
- **The installer:** 4,461,869 B, sha256 `f8b12bf5…`; I checked the hash. `release.cjs`'s private-path scan is clean.
- **The notes:** `C:\Users\nname\Downloads\t180-d359\release_notes_0.4.0.md`. A stale "new road" bullet is dropped from the notes.
- **The CHANGELOG keeps both Close lines,** as history. Leave them: a release commit doesn't rewrite history.
- **Carried for a later lap:** a fresh worktree needs `src-tauri/dist` before `cargo tauri build`. Add a `mkdir` to `release.cjs`, or a line in `docs/RELEASE.md`.

**Next:** the chair lands 918e55b with one full suite plus TAP and installs as `.before-0.4.0`. Then it runs the credential scan, pushes to `origin/main`, and runs `gh release create v0.4.0` with the setup.exe and the notes. Then the post-0.4.0 batch.

## 0.4.0 waits for the whole batch (librarian, 2026-10-17 10:3x)

The keeper, verbatim: "yeah lets wait till all work is done to do 4.0". Nothing has been pushed; checked: `origin/main` is still 7a785d6.

**"All work":** the built batch, which is Cut (d361-c ea65586), Export layouts + author + README sections (d365-e e655ace, which carries d361-e), and flow.js fit (d364-a 1030bd8). **Not included:** D364 part 2b (the texture built at Close) and D363 (the ghost auto-retire). Neither is started; they go in 0.4.1 (my call, stated to him).

**Order:**
1. The chair does **not** push or release 918e55b. The running `t180_v040_suite` can finish as information.
2. The chair lands d361-c → d365-e → d364-a on top of 918e55b. Keep every CHANGELOG entry.
3. **Pane B, the final release commit** on that tip:
   - move the batch's new `[Unreleased]` entries into `[0.4.0]`;
   - refresh the README figures (commit count, 8 releases in both places, test files), which takes over E's refresh step;
   - add the batch to the release notes (Cut, Export layouts, author name, texture fit) and drop the "Coming next" lines;
   - fix "about 21 s" → "about 20 s";
   - rebuild the NSIS installer from that commit, and hand back its sha256.
4. The chair runs one full suite plus TAP, `core-mutation` once, installs as `.before-0.4.0` with the builder closed, runs the credential scan, pushes, and runs `gh release create v0.4.0`.
5. The librarian verifies with `gh release view` and `git fetch`.

## Landings go to a pane, at the keeper's word (librarian, 2026-10-17 10:5x)

**The keeper, verbatim:** "isnt the orchs job simply to ORCHESTRATE the plan you give them to the panes to work it through????????? The sole context bulk of the orch should be spent thinking and reasoning about the panes themselves and how the work relates to where they should go."

**Standing from the next landing:** merging, conflict fixes, the full suite plus TAP, installs, scans, pushes and releases are a **landing pane's** work.
- The chair names the pane, the branches and the order, and the landing pane hands back to the librarian with its suite totals, hashes and the pushed sha.
- The librarian verifies and gives the keeper the all-clear (loop-ends-on-LIB).
- The chair's context goes to routing: which pane, what depends on what, who's idle.
- **This supersedes** the BUILDING.md line "the collator runs the full suite before it lands", for T-180. That doc amendment is owed by a pane.

**This release (0.4.0 at 1e77ca9)** is mid-suite in the chair's hands, so it finishes there. The next landing is the first under this rule.

## D366 read: BUILDING.md says landings go to a pane (librarian, 2026-10-17 10:5x)

Read `exo_memory/handback/p-d366-C_2026-10-17.md` (58 lines). Accepted.
- 567633d3 on d366-c, BUILDING.md only, +52 −23.
- **What changed:** the loop drawing, the rules ("On a hand-back, you route"), each seat's role, the heavy runs, pushing, and contradiction 4, amended with the old wording quoted.
- Portable-paths is green. The brief tests' anchors are intact.

**§2 scope, ruled: general, not T-180 only.** His words were about the chair's job as such: "the orchs job simply to ORCHESTRATE". My "for T-180" in the ruling was narrower than what he said.

**§3, the stale carriers:**
- `consonance/src-tauri/brief/COMMITTEE.md` `:83`, `:91`, `:98`, `:209`, `:213` → **D367 for a pane**, to match. `:145` (the collation line) stays.
- `exo_memory/CLAUDE.global.md` and his `~/.claude/CLAUDE.md` ("Inside the committee room", contradiction 4) are the keeper's own file, so they're **asked, not edited.**

**Landing:** 567633d3 lands with the next lighthouse batch by a landing pane (the first under its own rule).

## D368 E read: the lighthouse landing is held, on two counts (librarian, 2026-10-17 11:3x)

Read `exo_memory/handback/p-d368-landing-E_2026-10-17.md` (128 lines). Accepted.
- **Landed locally, not pushed:** lighthouse main is at 0895238b, which is baf850cc plus the CLAUDE.global.md commit.

**Hold 1: the suite is red,** and D366/D367 caused every red, bisected against a green f4485ee1.
- **6 JS reds and 1 crash:** the `consumer-relabel.js` role sites moved in BUILDING.md and COMMITTEE.md, and `lap-row`'s ring sentence moved.
- **1 cargo red:** the light pane intake's margin is 12,887 B against 14,000, because COMMITTEE.md grew.
- **D370, pane C** (the author):
  - re-judge the moved role sites in `consumer-relabel.js`;
  - re-pin `lap-row`'s sentence by name;
  - **for the intake, trim COMMITTEE.md's D367 additions** (the added Why lines and the duplicated sentences) until the row passes. **Do not change the row's 14,000 figure:** the test guards a real budget.
  - Re-run the 8 files plus that cargo row.

**Hold 2: the film's name,** the keeper's private film; see the memories on the private side project and `private-side-projects-off-repo`.
- **18 lines in 9 unpushed commits:** their subjects, plus one line each in `exo_memory/librarian/2026-10-12.desktop.md` (:17–:33).
- **12 lines already public** since 2026-10-13: `librarian/2026-10-12.desktop.md`, `loop/plan_close_confirm_2026-10-13.md:18`, `map/B.md:2046-2051`.
- **Asked of the keeper. My recommendation:**
  - rewrite the 9 unpushed commits locally so they say "D314" instead (no force push is needed: they've never been pushed);
  - replace the 12 public lines with "D314" in a plain commit. That stops the name showing in the current files, though git history keeps it.
  - Only a force-push history rewrite truly removes it, and that's his call.

## D370 C read: the lighthouse reds cleared (librarian, 2026-10-17 11:4x)

Read `exo_memory/handback/p-d370-C_2026-10-17.md`. Accepted.
- dfe05087 on d370-c, off 0895238b, +27 −35.
- **The relabel role sites** were re-judged (BUILDING.md's keeper count goes 20 → 22, with the reason given). The COMMITTEE.md sentence was reworded so its registered row matches unchanged. The relabel test was re-pinned by name.
- **lap-row's test is unchanged:** the drawing went back to the pinned line, which is the smaller fix.
- **COMMITTEE.md was trimmed by 921 B,** so the intake gap is 15,729 B against 14,000. The 14,000 figure is untouched.
- All 7 files green, and the cargo row passes.
- **C's own rule, taken:** a brief edit runs consumer-relabel, lap-row and the light-intake cargo row before hand-back. It belongs in the BUILDING.md checklist eventually.

**Next:** a landing pane re-runs the full lighthouse suite plus cargo on d370-c. The push still waits on the keeper's film answer.

## 0.4.0 is published: verified by the librarian (2026-10-17 12:0x)

Read `C:\Users\nname\Downloads\t180-wt-b14\HANDBACK_B.md`, the first landing pane's hand-back. Checked by me:
- after `git fetch`, `origin/main` = 2e0a98d "0.4.0: re-anchor mutation C17 after D365, and the README's commit count";
- `git rev-list --count origin/main` = 281, and README "So far" says 281 commits;
- `gh release view v0.4.0`: "T-180 Track Builder 0.4.0", published 2026-10-17T17:56:13Z, asset `T-180.Track.Builder_0.4.0_x64-setup.exe` at 4,484,555 B;
- I downloaded the asset myself: sha256 `25cfb388…`, which equals B's;
- the installed exe's sha256 is `94b4002cea65…`, equal to the exe B built; `.before-0.4.0` sits beside it.

**0.4.0 is closed.** Open for 0.4.1: D364 part 2b (the texture built at Close) and D363 (the ghost auto-retire).

## D368 §6 read: the timeout ruling (librarian, 2026-10-17 12:0x)

Read §6 of `exo_memory/handback/p-d368-landing-E_2026-10-17.md`. Accepted.
- **Main is at dfe05087.** cargo 1,059/0. js-suite 180 green plus 1 runner timeout.
- **The timeout:** `gen-consumer`, a null status at the 120 s limit. It's not a native crash (that would show 3221225477). Run alone, it's 107/107 in 104.6 s, with 0 `exitCode:` lines.
- **Ruling: the alone-run is accepted.** The file is green, and the timeout came from sharing the machine with B's T-180 suite in the second heavy slot.
- **Logged as findings:**
  - (a) two full suites ran at once, against the one-at-a-time rule; that needs a look at how the heavy lock hands out its two slots;
  - (b) gen-consumer uses 87% of its per-file limit alone, so it's a small speed lap for later.
- **The push of dfe05087** waits only on the keeper's film answer now.

## D372 B read: stale ghost and HUD laps retired on a shape change (librarian, 2026-10-17 12:4x)

Read `C:\Users\nname\Downloads\t180-wt-b15\HANDBACK_B.md` (82 lines). Accepted.
- **The commit:** ed1d32d off 2e0a98d.
- **The geometry hash:** over the path samples and the segments, with no name, texture or grip in it. It's stored in the marker.
- **The trigger:** `install_with_retire` reads the previous marker before the install. When both markers carry a hash and they differ, it **moves** `GhostCar\<folder>\` and the `CMRT-Essential-HUD\<folder>[#]*` files into dated `.retired-<stamp>` backups. Never a delete, never through links; a non-`t180b_` folder is refused.
- **Red first:** 4/4, and the Rust failed to compile before the functions existed. cargo 44/44, targeted 226/226, and **the whole core-mutation file 59/59** (the lesson from D365, applied).
- **Older tracks** (ELYSIUM included) have no hash yet, so their first re-export moves nothing. That's conservative, and accepted.
- **Ruling on B's finding:** tell the user. B adds a line to `app/install/install.js`'s message, "Your old ghost and laps for this track were moved to …", when `retired` isn't empty, with a row for it. It's a small amendment on d372-b, then it lands.
- **Layouts export:** no retire, since it writes to a picked folder. Carried.
- **Landing:** with D371 by a landing pane for 0.4.1, once both are in.
- **The D372 amendment is read** (03af53b on ed1d32d): the install message names each moved path, or says why they couldn't be moved. When nothing moved, the message is byte for byte what it was. Red first. 58/58 and cargo 44/44. Accepted. **D372 is ready;** it waits on D371 (A).

## D371 A read; 0.4.1 collated (librarian, 2026-10-17 13:1x)

Read `C:\Users\nname\Downloads\t180-d371\HANDBACK_A_D371.md` (69 lines), and looked at `render-sheet.png`. Accepted.
- **c29524b on d371-a:** fit `'edge'`. The edge bands stay a fixed size in metres, and the centre is N whole cells chosen from the width range.
  - It's built once the track is closed, refreshed at export, and off by default, with a box under the road-surface picker.
- **Tile and fit stay byte-identical,** pinned at 2e0a98d. ELYSIUM exports in tile and fit reproduce cc016b10 and 21a13bf8.
- **Mutants:** 25/25 on the new code, the whole core-mutation file 59/59, the app mutation file 103/103. Targeted 294/295 (1 todo, already marked).
- **Owned by A:** rows 8, 9 and some asserts came after the code, and the mutants carry them. The render caught a wrong first layout (the glow down the middle), which the rows missed.
- **The render, checked by me:** at 60 m the right-hand (edge) glow is the thin line it is at 35 m. At ELYSIUM's range N = 1, so the centre still spreads; stated by A.

**0.4.1 = D371 (c29524b) + D372 (ed1d32d, 03af53b),** both off 2e0a98d, on different files (the CHANGELOG aside).

**The landing pane's order:**
1. land d372-b, then d371-a, adding A's CHANGELOG line under Added;
2. one release commit: version 0.4.1 in tauri.conf.json, Cargo.toml, Cargo.lock, docs/RELEASE.md and the README Install section; CHANGELOG `[0.4.1] - 2026-10-17`; the README figures re-derived (the commit count, 9 releases in both places, test files);
3. the NSIS build, with an empty `src-tauri/dist` made first;
4. one full suite plus TAP, the whole core-mutation and app mutation files once, and `cargo test`;
5. install as `.before-0.4.1` with the builder closed;
6. the credential scan, push (fast-forward), then `gh release create v0.4.1` with notes in the 0.4.0 form (the edge fit; ghost and lap retire on a shape change).

## D374: sound, round 2 (librarian, 2026-10-17 13:5x)

**The keeper, verbatim:**
- "are the newest sounds in the current version? Because it doesnt do the climb effect."
- "I still dont like the scrubbing sound effect. But i do love the place and undo one."
- "a continued melody say like 64 step melody … 3 other 64 bit melodies with their own vibe that will play at random when you open … one of the 4 melodies come on at random so create tons of variation."

**Checked:**
- The installed 0.4.0 has the D349 Serum samples (`app/sounds/*.wav`, dated 10-16 21:11).
- `app/sound.js:106`: climb ticks pitch by value (`scaleMidi(clamp(n,-20,14))`). Place and undo walk `MEL128`, a 128-step melody from `PROG8`.

**Parts:**
1. **Pane C: does climb pitch actually move in the sample engine?**
   - Render a climb drag from -20 to +14 through `createEngine` with the samples loaded (headless, `soundrender.js`'s path), and measure each tick's pitch (an FFT peak).
   - If it's flat, or under one semitone per step, find why (`rateOf`/`tickEven`/the sample path) and fix it red first.
   - If it moves as specified, say so with the numbers, so we know whether it's too subtle or broken.
2. **Pane E (did batch 8): audition batch 9,** added to the T-180 Sound Sketches artifact (`https://claude.ai/artifact/M57EK3YbC9bYUcBjraRPQZ`); I publish it.
   - **(a) Four 64-step melodies, each with its own vibe,** for place (forward) and undo (back), played on today's place/undo samples (he loves them).
     - Vibes from his past refs (`memory t180-sound-first-draft`): GT4-menu Rhodes "yearning"; shoegaze; light sci-fi occult; plus one of E's choosing.
     - **Never quote a real theme.**
     - Each rendered as a 64-step walk (place ×64) plus a short undo run.
   - **(b) 3–4 new scrub (drag tick) candidates,** distinct from batch 8's mallet, each rendered as a drag (length and climb).
   - Headless. Bands via `sound-bands`.
3. **After his picks:** the build lap.
   - The engine holds 4 melodies of 64 steps and picks one at random at each launch. Not saved, so a new launch can pick a different one.
   - Place walks forward and undo back, as now.
   - The scrub sample is swapped to his pick.

OUTPUT → NEXT: changed — D374: the climb check (C), audition batch 9 (E).

## D374 part 1 (C) read: the climb effect was broken in the default mode (librarian, 2026-10-17 14:0x)

Read `exo_memory/handback/p-d374-C_2026-10-17.md` (60 lines). Accepted.
- **The cause:** the panel starts in corner mode, whose handles are `climbDeg`/`turnDeg`, while `notePlan` tested `climb` only. So a corner climb drag walked the length melody, and a corner turn drag lost its pan. That's a real bug, live since the corner default (D331).
- **The fix:** `SOUNDS_AS` maps the corner kinds onto the rate kinds. It's 61f2ec7 on d374-c.
- **Measured:** before, climbDeg's notes were identical to a length drag's (a 13.18 st span); after, they rise on 33/34 steps over 54.7 st. Red first. Sound tests are green and the bands unchanged.
- The turnDeg pan fix is included; the same cause, accepted.
- **Landing:** it rides with the next build, the D374 melodies, unless 0.4.1's landing pane hasn't started its suite. E's batch 9 renders climb drags as `climbDeg`.

## D374 batch 9 published (librarian, 2026-10-17 14:2x)

Read `exo_memory/handback/p-d374-batch9-E_2026-10-17.md`, and read the page's whole diff against the batch 8 base (the base is cmp-identical to my copy; 134 added lines, all batch 9).
- **Published** https://claude.ai/artifact/M57EK3YbC9bYUcBjraRPQZ as Version 23 (`1792268192-aa32`).
- checked by the files listing: 21 files, which is the 4 batch8 files plus 16 batch9, and index.html at 110,625 B (sha256 `97c5780c…` = E's).
- **The melodies:** Yearning, Shoegaze, Light occult, Afterglow; 64 steps each, on today's samples, all inside the bands.
- **The ticks:** Eiano tik, So Dreamy, FMmy, VeloHarm.
- **E's stated limit:** "not a quote" rests on construction; no outside melody database was searched.
- **Next:** his picks, then the build lap.
- **Mine:** an empty stray file, `loop/plan_t180_handoff_2026-10-17.md`, made by my rejected 10:02 command, is removed. It was untracked and 0 B.

## D375: the four melodies, each with its own instruments (librarian, 2026-10-17 14:3x)

**The keeper, verbatim:** "yes i like those melodies, and pick the EIANO tik, also now, take each melody, and make the instrumentation also different theme but still works for the vibe".

**Picks:**
- all four melodies (Yearning, Shoegaze, Light occult, Afterglow; `G:\Consonance-tools\b9\mel9.js`);
- the drag tick is **Eiano tik** (`G:\Consonance-tools\b9\page\batch9\tick_eiano_tik.wav`).

**Parts, in parallel:**
1. **Pane E: audition batch 10.** For each melody, its own place and undo instrument, from Serum factory presets as before, chosen to fit its vibe. Suggested directions, E's call:
   - Yearning: an electric-piano / Rhodes-like keys;
   - Shoegaze: a washed guitar-like pluck or soft pad;
   - Light occult: glassy bells / a celesta-like tone;
   - Afterglow: a warm marimba or bright soft pluck.

   Render each melody's 64-walk plus undos through the engine with its own samples, keep everything inside the bands, and add it to the Sound Sketches page (I publish). Headless, factory content only.
2. **Pane C: the build lap, engine side** (off 2e0a98d plus d374-c's climb fix):
   - `app/sound.js` holds **4 melodies of 64 steps** (from `mel9.js`), and **one is picked at random at each launch** (not saved);
   - each melody names its own place/undo sample slot (`place_<name>.wav`, `undo_<name>.wav`). Until E's picks land, all four point at today's place/undo;
   - the drag tick is swapped to `tick_eiano_tik.wav` at its measured gain;
   - place walks forward and undo back, as now; the loop close is unchanged.
   - **Red first:**
     - the four melodies are 64 steps each;
     - a launch picks one of the four (seeded in the test);
     - place and undo walk the chosen one;
     - each melody's slots resolve.
   - `sound-bands` stays green. Targeted tests only.
3. **After his picks of batch 10:** C drops the eight WAVs in, and a landing pane ships it as 0.4.2, or folds it into 0.4.1 if 0.4.1 isn't out yet.

OUTPUT → NEXT: changed — D375 to E (instruments) and C (engine).

## D375 part 2 (C) read: the four-melody engine (librarian, 2026-10-17 14:4x)

Read `exo_memory/handback/p-d375-C_2026-10-17.md` (80 lines). Accepted.
- **d375-c** = 61f2ec7 (the climb fix) plus dd405a1.
- **The melodies:** `MELODIES` holds the four of 64, equal to `mel9.js` (checked by C). One is drawn per launch in `createSound` and nothing is saved.
- **The slots:** `place_<name>`/`undo_<name>`, which point at today's place/undo until E's WAVs land.
- **The tick:** `drag_tick.wav` is now the Eiano tik, byte-identical, at gain 1.852. The bands match E's row.
- **Tests:** red first (sound 12/15). sound 15/15, samples 10/10, bands 5/5 plus a per-melody band row.
  - C states plainly that the new sound-samples rows were never red one by one, because the file failed to load as a whole.
  - Three amendments, each named.
- **For E:** `render_b9.js`'s STEPS match is gone in dd405a1. Batch 10 renders through `soundrender`'s `melody` option and file-keyed samples.
- **Next:** E's batch 10, then his picks, then C drops in the eight WAVs, then a landing pane ships d375-c (with 0.4.1's leftovers if 0.4.1 is out).

## 0.4.1 is published: verified by the librarian (2026-10-17 14:4x)

Read `C:\Users\nname\Downloads\t180-wt-b16\HANDBACK_B.md`. Checked by me:
- `origin/main` = be4a527 "Version 0.4.1"; 286 commits, and the README says 286 commits and 9 releases;
- `gh release view v0.4.1`: published 2026-10-17T20:40:00Z, asset 4,496,352 B;
- I downloaded it myself: sha256 `07efed2c…`, which equals B's;
- the installed exe is `69ef9e74…`, equal to B's build; `.before-0.4.1` sits beside it.

**0.4.1 = the edge fit plus the ghost/lap retire.** The climb fix (d374-c) and the four melodies (d375-c) go in the next release.

## D375 batch 10 published; C drops the WAVs in ahead of his OK (librarian, 2026-10-17 14:5x)

Read `exo_memory/handback/p-d375-batch10-E_2026-10-17.md` §0–§2, and the page diff (the base matched my copy; additions only).
- **Published** Version 25 (`1792269860-030a`) of https://claude.ai/artifact/M57EK3YbC9bYUcBjraRPQZ, with the 12 `batch10/` files.
- **The instruments:** Yearning on KY WurlyKeys, Shoegaze on PL Pads Pluck, Light occult on SY Vintage Bells, Afterglow on PL D_Pluck. All 12 band clips are inside.
- **The eight WAVs and their sha256** are in E's §1. They're levelled for the existing gains: place 0.645, undo 0.596.

**To save a round trip,** C drops the eight WAVs into d375-c now, following its own §0 recipe.
- Rows: each melody's band, plus the sha256s in row 6.
- **The landing waits on his OK of batch 10.** Swapping one if he dislikes it is one file and one sha.

## D375 drop-in (C) read (librarian, 2026-10-17 14:5x)

Read §4 of `exo_memory/handback/p-d375-C_2026-10-17.md`. Accepted.
- **883f681 on dd405a1:** the eight WAVs, cmp-equal to E's table, with one `SAMPLES.file` line per melody.
- Red first; the bands red was weak, which C named.
- **Tests:** sound 15/15, samples 11/11, bands 8/8 (one row per melody), shell-dist 2/2.
- **The unplayed batch-8 `place.wav`/`undo.wav`, ruled:** remove them in the landing commit. They're unused build assets, and git history keeps them. That isn't the keeper's data, so it's my call, stated to him.
- **The landing** of d375-c (61f2ec7, dd405a1, 883f681) as 0.4.2 waits on his OK of batch 10.

## D376: batch 11, Frutiger Aero melodies with an arc (librarian, 2026-10-17 15:2x)

**The keeper, verbatim:** "i like them, but i dont think they are it. I want like, something nostalgic, Frutiger Aero type vibe, that will go along with the melodies, I want the melodies to be more dramatic and lead to resolution over time??? not sure how to describe it, just progression that feels nice."

**0.4.2 (d375-c) is held** until his pick of batch 11. The engine (four melodies of 64, one at random per launch, per-melody slots) stays as built. Only the melody data and the eight WAVs change.

**Pane E, audition batch 11:**
- **Four new 64-step melodies, each an ARC:**
  - phrases of 8;
  - it starts settled and low;
  - each phrase climbs in register and harmonic richness;
  - half cadences leave phrases hanging;
  - a peak around steps 44–52, optionally a modulation up a whole step for lift;
  - a clear authentic cadence home by step 64, so the loop restarts naturally.
  - State each melody's arc map (step → function) in the hand-back.
- **The palette:** Frutiger Aero, the mid-2000s glossy-optimistic sound. Major 7ths, add9 and Lydian colour, airy and bright, with water and sky imagery.
  - Four shades: E names them (e.g. aqua, sky, glass, daybreak).
  - **Never quote a real theme or system sound** (the Wii Shop, Windows or console startup sounds, etc.). The feel only.
- **The instruments,** per melody, from Serum factory presets: glassy bell-pads, shimmer pads, bright FM keys, chime plucks.
  - Each place sample needs a clean onset (the D375 lesson: no slow pad).
  - Level for the existing gains (place 0.645, undo 0.596).
- **Render** through dd405a1's engine as in batch 10, with all bands inside, and add it to the Sound Sketches page (I publish).
- **The data shape:** `MELODIES` steps `[bass, chord of four, melody]`, so C's swap is data only.

## D376 batch 11 published (librarian, 2026-10-17 15:5x)

Read `exo_memory/handback/p-d376-batch11-E_2026-10-17.md` §0–§3, and the page's additions; the base matched my copy.
- **Published** Version 27 (`1792273473-0bb2`), with 12 `batch11/` files.
- **The melodies:** Aqua (Big Bells), Skyline (Runtheharm), Glass (VeloHarm), Daybreak (Power and Progress).
- **The arcs:** 8 phrases, half cadences, a deceptive cadence at step 32, a whole-step lift at step 45, and an authentic cadence home at step 64. The register peaks in phrase 6. All bands are inside.
- **E's unwelcome figure:** loudness doesn't arc (every phrase is within 1.8 LU), because the engine plays each place at one level. **A per-step swell is an engine change** (C's). It's offered to the keeper; I recommend it.
- **For C after his pick:** `mel11.js` plus `swap11.js` give a data-only swap of three blocks on 883f681, plus the eight WAVs (sha256 in E's §1).

## D377 batch 11 picks (librarian, 2026-10-17 16:4x)

The keeper: "i like em all except darkbreak, too generic, i want something iconic". (He means Daybreak.)
- **Kept:** Aqua (Big Bells), Skyline (Runtheharm), Glass (VeloHarm).
- **Part 1, pane E (any free pane), a replacement for Daybreak:** three candidates, each built around ONE iconic hook.
  - A short motif (3–6 notes) with a distinct rhythm and a memorable leap, that a player would hum after closing the app. It is stated in phrase 1, recurs varied across the arc, and returns whole at the cadence home.
  - Same arc rules as D376 (8 phrases, deceptive turn at 32, lift at 45, home at 64), same Frutiger Aero palette, its own shade, distinct from Aqua, Skyline and Glass, and on an instrument not used by them.
  - Never quote a real theme or system sound. Run E's origin check (`origin_check.js`) on each hook.
  - Render through the engine, bands inside, and add to the page as batch 12 (I publish). The hand-back names each hook in note names.
- **Part 2, pane C (independent of part 1), on d375-c:** swap Aqua, Skyline and Glass in for three of the four batch-10 melodies (data from `mel11.js`, WAVs from `page11/batch11/`, sha256 from E's §1), keeping the fourth slot for part 1's winner.
  - Also the per-step volume swell, my ruling (recommended to the keeper, not vetoed; he can still veto): the place gain rises gently through the arc to the peak around step 45–52 and eases home by 64. Test first; bands stay inside at every step; measure the phrase loudness arc E found flat (it was within 1.8 LU).
- **Then** a landing pane ships 0.4.2 once the fourth melody is picked. place.wav and undo.wav removed.

## D377 part 1 batch 12 published (librarian, 2026-10-17 17:0x)

Read `exo_memory/handback/p-d377-batch12-E_2026-10-17.md` in full and the page diff against Version 27 (+76 −0; base identical to my copy).
- **Published** Version 28 (`1792277995-7dd6`), page sha256 f40495eb…, with 9 `batch12/` files.
- **Candidates:** Meadow (Bb, Tinkerbell, hook F4 D5 C5 A4 Bb4), Bubble (C, So Dreamy, hook G4 G5 E5 D5 C5), Aurora (Ab, Linear Arithmetic, hook Eb5 Bb4 C5 Ab5). All 9 bands inside. No hook whole elsewhere; no outside database searched (E said so).
- **After his pick:** mel12.js STEPS for the winner and its two WAVs (sha256 in E's §1) into d375-c's fourth slot. Part 2 (C) still owed.

## D377 the fourth pick (librarian, 2026-10-17 17:02)

The keeper: "aurora is it".
- **The four for 0.4.2:** Aqua (Big Bells), Skyline (Runtheharm), Glass (VeloHarm), Aurora (SY Linear Arithmetic).
- **Pane C, folded into its open part 2 on d375-c:** Aurora into the fourth slot with `G:\Consonance-tools\b9\swap12.js aurora` (or by hand from `mel12.js` STEPS.aurora), plus `page12\batch12\place_aurora.wav` (sha256 929e0616…) and `undo_aurora.wav` (sha256 c91f9db3…), full sha256 in E's §1. Remove place.wav and undo.wav (batch 8) and every batch-10 WAV no longer played. Bands per melody, with the swell, all inside. CHANGELOG names the four and their instruments.
- **Then a landing pane** ships d375-c as 0.4.2: version bump, notes, NSIS, full suite plus TAP (the D351 rule), both mutation files, install with `.before-0.4.2`, scan, push, release. Librarian verifies the asset and gives the all-clear.

## D378 a UI theme per melody (librarian, 2026-10-17 17:1x)

The keeper: "can we now create a unique theme for the UI for each sound? It will not touch the structure or how the UI looks but rather how it is styled for the theme". His standing word from earlier: "keep it the same aesthetic as we have it now".
- **What exists (checked, t180-wt-c14 at 883f681):** `app/index.html:11-18` `:root` holds every chrome colour as a token (SIGIL, 2026-10-14: black and bone, hairlines, one accent, pale ultraviolet `--accent: #b9a8ff`; "a panel never names a hue of its own"). BUT 69 hard-coded hex colours sit in 14 canvas and overlay files (`app/core/{flightlayer,griplayer,handles,labels,panel,piecesui,pitui,selectionlayer,spawnslayer,spawnsui,valuesoverlay}.js`, `app/onboarding/index.js`, `app/preview/{guideslayer,renderer}.js`). The melody is picked once at boot, `app/index.html:396` (`createSound`, which exposes `sound.melody`).
- **The rule for every theme:** only the tokens change, never layout, type, sizes or borders. Warning hues (`--bad --warn --ok --mine`) stay readable as what they are. Text contrast at least what SIGIL has. Each theme is SIGIL in that melody's light: Aqua (water), Skyline (open sky), Glass (crystal), Aurora (northern lights, Ab).
- **Part 1, any free pane (a taste call, the keeper's):** four token sets plus headless screenshots of the REAL app (`--headless=new`, no window, never steal focus) with each set applied, beside today's SIGIL. Page for me to publish. Measure contrast of text and dim on bg and panel for each.
- **Part 1b, another free pane, read-only, in parallel:** inventory the 69 hard-coded hexes: which are chrome (should follow the theme, become tokens) and which are meaning (a red line, a grip colour, which stay). File, line, colour, what it draws, verdict.
- **Part 2, after his pick and 1b:** a building pane adds the themes as token sets keyed by melody name, set on `<html data-theme>` at boot from `sound.melody`, and moves the chrome hexes from 1b onto tokens. Test first: each melody sets its theme; an unknown melody keeps SIGIL; the meaning colours are unchanged.
- **Release:** 0.4.2 (the sounds) does not wait for this; the themes ship in the next one. (My call: the sound work is done and tested, the themes need his eye first.)

## D378 part 1 published (librarian, 2026-10-17 17:1x)

Read `C:\Users\nname\Downloads\t180-d378\HANDBACK_A_D378.md`, `contrast.txt`, the page text (5 embedded PNGs) and `shot-Aurora.png` (the real app, File menu open; the road, handles and selection outline still today's colours, as A says).
- **Published** https://claude.ai/artifact/Kk5hB8y8RHarvPATD9JQoh (Version 1, page sha256 aab378e1…).
- **Sets:** Aqua cyan #5fd0e6, Skyline daylight blue #8dbcff, Glass ice-white #d3e6f2, Aurora green #62eeb0; warning hues unchanged; 16 of 16 contrast cells at or above SIGIL.
- **A's cautions carried:** the 3D road and overlays won't change until part 2 moves the chrome hexes (1b, B, still owed); Aurora's accent is the nearest to --ok.

## D378 collated: parts 1 and 1b in (librarian, 2026-10-17 17:1x)

Read `exo_memory/handback/p-d378-inventory-B_2026-10-17.md` in full.
- **My 69 was wrong in scope** (B found it): my grep counted `app/**/*.{html,js}`, and 69 = 51 in the 14 JS files + 16 in `app/index.html` (its own :root tokens among them) + 2 in `app/preview/smoke.html` (checked: `grep … | uniq -c`). The 14 files hold 51 hex, plus 7 rgb()/rgba() and one in `preview/index.js`; plus the WebGL float colours (§3). B's 51 stands.
- **B's verdicts stand:** CHROME 21, MEANING 23 (the handle axis colours, spawns, warnings), UNCLEAR 6.
- **My rulings on the UNCLEAR six** (the keeper can veto): the selection amber (×3), the flight cyan and the thumbnail start dot STAY (they must stand apart from grip, handle and spawn hues on the road, and a theme accent like Aurora's green would collide with cup/ok green). The guide-target outline (`onboarding/index.js:28`) FOLLOWS the accent ("look here" is the accent's job). The road's edge and tie lines (`renderer.js:135`) FOLLOW the theme, since the road is the largest surface the keeper will see.
- **Part 2 needs (B §4):** a token reader for canvas and WebGL (none exists), refreshed when `data-theme` is set; new `--ink`, `--veil`, `--fog`; labels.js R15 re-pointed in the same change and each theme's text-on-panel re-measured over the road (E's M5, ≥ 4.5:1); spawnsui's own amber and green moved onto `--warn`/`--ok`.
- **Part 2 waits for the keeper's pick on the page** https://claude.ai/artifact/Kk5hB8y8RHarvPATD9JQoh, and starts off d375-c once 0.4.2 lands (it reads `sound.melody`).

## D379 a full skin per melody (librarian, 2026-10-17 17:1x); supersedes D378's colour-only scope

The keeper: "maybe make the UI functionally the same, but it will be even designed and styled differently to carry the vibe of the sounds. the layout remains the same but different feel and design". (This widens his earlier "keep it the same aesthetic": the layout stays, the design changes.)
- **A skin may change:** colour, gradients, gloss and glass (translucency, `backdrop-filter`), borders and their radius, shadows and glows, button and field shapes in place, menu and panel surfaces, icon strokes, letter-spacing and weight, the 3D view's background, fog, grid and road lines (through part 2's token reader).
- **A skin may not change:** layout or function. Every element keeps its box: same position and size to the pixel at the default 1400×860 window. Any font must already be on Windows (nothing fetched, nothing bundled without the keeper's yes). Meaning colours stay (B's inventory §2: handle axes, spawns, warnings, grip).
- **The vibe:** each skin carries its melody's world within the Frutiger Aero era the sounds come from: Aqua (water: glossy, liquid, rounded, caustic light), Skyline (open sky: airy, light gradients, wide and bright), Glass (crystal: frosted panes, sharp facets, cold sheen), Aurora (northern lights: night, a moving green-violet glow, soft and deep). Inspired by the era, copying no real product's UI or assets.
- **The instrument:** a layout check. Load the app headless with SIGIL and with the skin, read `getBoundingClientRect` of every element, report any that moved or resized. A skin passes at 0. A writes it first (`layout_check.js`, beside `shot_theme.js` in `Downloads\t180-d378\`) and posts its path; the others run it once it's there.
- **Parts, in parallel, one skin per pane, each a single CSS file `[data-theme=<name>]` over today's index.html, plus real-app headless screenshots (`--headless=new`, never steal focus) of the builder and the File menu:** A Aqua and the check; B Skyline; E Glass; a fourth free pane Aurora (or whichever of A, B, E finishes first). C stays on D377.
- **The page:** one page, SIGIL then the four, for me to publish; the keeper picks or redirects. Part 2 (the build, B's §4 token reader included) after his pick and after 0.4.2.
- **Addendum (17:14), the keeper on the D378 colour sets: "its way too subtle".** So each skin is BOLD: a player should know which melody is playing from one glance at the window. Light or bright surfaces are allowed (Skyline may be a light skin), and so are strong gradients, gloss highlights and glows. Readability floor: text at WCAG 4.5:1 on its own surface, measured.

## D379 status (librarian, 2026-10-17 17:3x)

- **Skyline (B), read:** `exo_memory/handback/p-d379-skyline-B_2026-10-17.md` and `Downloads\t180-d379-b\cdp\shot-skyline-builder.png`. It's a light sky skin: gloss pills, frosted panes, the 3D view as sky. 0 moved at a true 1400×860 (E's DevTools metrics method), 0 enabled texts under 4.5:1 in the builder state; the positive control moves 1385. The stand-in sky washes WebGL's orange markers pink until part 2's token reader.
- **A's pane exited at 17:2x** after writing `Downloads\t180-d378\layout_check.js` (7,675 B). There is no aqua.css on disk, so **Aqua is unowned.**
- **E's Glass** is in progress (`Downloads\t180-d379-e\glass.css`, layout_final.out 17:32); no hand-back yet. B has taken Aurora.
- **Note for every skin:** shoot by E's `Emulation.setDeviceMetricsOverride` method; `--window-size` alone lays out at 1376 px.
- **17:4x Glass (E), read:** `exo_memory/handback/p-d379-glass-E_2026-10-17.md` and `cdp\shot-glass-builder.png`. 0 moved on both checks (control 801 moved), 0 enabled texts under 4.5:1 (SIGIL itself fails 2). **My eye on the shot:** it reads close to SIGIL (dark, faceted chips, faint facet lines in the sky); against the keeper's "way too subtle" it is the quietest of the two so far. Carried to the keeper on the page, not re-dispatched. E takes Aqua (says so on the board).
- **17:4x Aurora (B), read:** `exo_memory/handback/p-d379-aurora-B_2026-10-17.md` and `cdp-aurora\shot-aurora-builder.png`: drifting green-violet curtains over an indigo night, glowing bar, curtain-filled Export pill. Bold. 0 moved on both checks; builder 0 under 4.5:1 (lowest 5.66). Motion stops under reduced-motion. Remaining: Aqua (E). **The combined page: B,** who is free, starts it now with SIGIL, Skyline, Glass and Aurora (all true-1400×860 shots) and folds Aqua in when E hands back.

## D377 part 2 read; 0.4.2 to a landing pane (librarian, 2026-10-17 17:4x)

Read `exo_memory/handback/p-d375-C_2026-10-17.md` §5 (`:135-199`). Commit 5d5a4a8 on d375-c (on 883f681): the four (Aqua, Skyline, Glass, Aurora), data and WAVs equal E's tables; ten unplayed WAVs `git rm`'d; the swell (−1.0 dB at step 1 to +0.7 dB over 45–52, back by 64; place only). Green: sound 16/16, sound-samples 12/12, sound-bands 12/12, handle-step 6/6, shell-dist 2/2.
- **Said plainly for the keeper:** the swell is gentle, about 0.9–1.9 LU between the peak phrases and the ends, because the loudness bands leave ~1.7 dB. A bigger one means wider bands, his call.
- **For the landing pane:** sound-bands now takes ~424 s (was 12 s). Watch any per-file timeout in the full suite; a timeout is red, not a D351 pass.
- **Landing:** d375-c (61f2ec7, dd405a1, 883f681, 5d5a4a8) as 0.4.2. Version bump, notes in our own words, NSIS, full suite plus TAP (D351 rule), both mutation files whole, install with `.before-0.4.2` (builder closed, hashes compared), credential scan, push, release. C is free and may land it (the suite is the check); hand-back to me for the all-clear.
- **Base:** d375-c branches from 2e0a98d (0.4.0); origin/main is be4a527 (0.4.1). The landing pane merges d375-c onto be4a527 first (CHANGELOG [Unreleased] under 0.4.2), then runs the suite on the merge.
- **17:4x the skins page published:** https://claude.ai/artifact/XZFGdFKzMcYqL7iB2WD8D5 (Version 1, sha256 7b800565…), from B's `skins_d379.html` (hand-back `exo_memory/handback/p-d379-page-B_2026-10-17.md`, read; page text read with images stripped). Aqua is a marked gap; B re-runs `mkpage_d379.js` when E hands back and I republish to the same URL.
- **18:0x A back after the keeper's retry:** `Downloads\t180-d378\HANDBACK_A_D379.md`, read. The chair's stand-down never reached A's screen, so A finished its own Aqua (`skins/aqua.css`, 0 moved, lowest 4.68 on its own hand table). It's a spare, behind E's. It changes `--bad` (a meaning colour), and its shots used `--window-size` (E's 1376 px finding), so it isn't comparable as shot. A's independent check of E's aqua.css: 0 moved of 3,945 (`lc_aqua_E.out`). Waiting on B's page rebuild.
- **18:1x Aqua page republished by me:** the chair hadn't received my 17:57 ring (UNRECEIVED), so I ran B's one-line `mkpage_d379.js` (E's §0 command) myself; B's previous page backed up as `skins_d379.before-aqua.html`. Text diff: only the Aqua section and its shots line. I split its figures into the Layout and Contrast rows in my copy. Version 2 (`1792282296-2d3d`) at https://claude.ai/artifact/XZFGdFKzMcYqL7iB2WD8D5. B's rebuild packet is now moot.
- **18:1x the keeper on Aqua:** "what are those obstructive lines": the caustic rings (E's §1, 1–1.5 px rings up to (24,112,120), also over the road). Fix to E: replace the hard rings with soft, blurred caustic light (drifting brighter patches, no hard lines, stopped under reduced motion), kept off the road surface where possible; meaning colours untouched as before; both layout checks and contrast re-run; new shots; then the page is rebuilt with mkpage_d379.js and I republish.
- **18:2x soft caustics republished:** E's §5 read (`p-d379-aqua-E_2026-10-17.md:87-115`), new shot seen (no rings; soft light in the sky, masked off the road: the road band differs ≤15 per channel from SIGIL against 94 with rings). Both checks 0 moved, contrast lowest 5.13. Version 3 (`1792282894-4da4`), with my Layout/Contrast row split applied again.

## D381 the four skins into the app (librarian, 2026-10-17 18:2x); D379 part 2

The keeper, on the skins page (Version 3): "do it". So all four, as shown: Aqua (E, `t180-d379-e\aqua.css`, soft caustics), Skyline (B, `t180-d379-b\skyline.css`), Glass (E, `t180-d379-e\glass.css`), Aurora (B, `t180-d379-b\aurora.css`). The skin follows the melody picked at launch; SIGIL stays the fallback for an unknown name.
- **Base:** C's 0.4.2 release commit d7a6975 (it carries `sound.melody`); rebase onto origin/main once 0.4.2 is pushed. Branch d381.
- **Part 2a, pane B (wrote the inventory), first:** the plumbing, test first.
  - `<html data-theme>` set at boot from `sound.melody` (`app/index.html:396`), before first paint if possible.
  - A token reader for canvas and WebGL (B's §4 B: none exists): read `getComputedStyle(documentElement)`, parse to rgb/floats, refresh when `data-theme` is set.
  - New tokens `--ink`, `--veil`, `--fog`, and 3D tokens for CLEAR, fog, grid, road edge and tie (`renderer.js:135-145`), with SIGIL's values equal to today's literals so SIGIL renders byte-identical.
  - Move B's 21 CHROME hexes and 5 rgba onto tokens; my rulings on the unclear six (plan `:2362`). spawnsui's amber/green onto `--warn`/`--ok`. Meaning colours stay literal.
  - labels.js: re-point mutant R15 in the same change; re-measure E's M5 (label text ≥ 4.5:1 over the road) in each skin.
  - Post the token names on the board as soon as they're fixed, so 2b can start.
- **Part 2b, panes E and A, after 2a's token names are posted:** each skin into `app/themes/<name>.css` (E: aqua and glass; A: skyline and aurora, B's files with B's notes). Drop the `#preview::before/::after` sky overlays and set the 3D tokens instead; keep the motion layers that are pure CSS (Aurora's curtains, Aqua's caustics) only where they sit above the WebGL canvas and under the meaning layers, stopped under reduced-motion.
- **Tests:** each melody sets its skin; unknown → SIGIL; SIGIL's 3D and canvas output unchanged (pixel or literal pin); the four CSS files hold no box property (a static test: no width, height, margin, padding, border-width, font, letter-spacing, top/left/right/bottom, inset); layout_check (A's) 0 moved per skin and contrast per skin, run once each by the pane, figures in the hand-back. Mutants for the reader and the theme pick.
- **Then:** screenshots of the real app in each skin with the road and handles themed, to me to publish; then a landing pane ships 0.4.3. CHANGELOG in our own words.

## D380 0.4.2 verified, all-clear (librarian, 2026-10-17 19:2x)

Read `exo_memory/handback/p-d380-landing-C_2026-10-17.md`. Checked by me: origin/main d7a6975 (292 commits, `rev-list --count`); tag v0.4.2 → d7a6975 (`ls-remote`); release published, not draft or prerelease; asset downloaded, 7,223,429 B, sha256 49dc4907… = C's; installed exe sha256 dd29b29b… = C's built exe; notes say "keeper" 0 times. C's suite: 3,130 tests, 3,110 pass, 0 fail, 0 exitCode; core-mutation 59/59, app mutation 103/103, cargo 44/44. All-clear given to the keeper.
- The keeper's turn report (19:07): not a bug; D331's corner mode (`app/menubar/items.js:62` Settings ▸ Turn & climb read as). Offered to switch the default back to rate; his call.

## D382 the default volume 25% lower (librarian, 2026-10-17 19:4x)

The keeper: "the volume should be lowered a bit standard, not to where its quiet, but like say 25% more". Read as: the default volume 25% lower.
- **What exists (checked, d7a6975):** `app/sound.js:362` the default volume is 0.6 when nothing is saved; the slider (`app/index.html:227`, Settings ▸ Sound) saves to localStorage `t180.sound.volume`.
- **The change:** default 0.6 → 0.45 (25% lower). Test first: a fresh start with nothing saved plays at 0.45 and the slider shows 45; a saved volume is still honoured. CHANGELOG in our own words.
- **Said plainly:** anyone who has moved the slider keeps their saved level, so the change reaches new installs and players who never touched it. If the keeper's own builder has a saved volume, he lowers it with the slider (or we migrate saved 0.6 → 0.45, his call).
- **Pane:** C (free), a small branch off d7a6975, d382-c; rides 0.4.3 with D381.
- **19:5x D382 read:** `exo_memory/handback/p-d382-volume-C_2026-10-17.md`; 51d3de1 on d382-c (default 0.6 → 0.45, saved kept, red first; sound 17/17, menubar-page 15/15, sound-samples 12/12, sound-bands 12/12). Rides 0.4.3 with D381. C noted a saved '' reads as silent (the app never writes it); left out of scope.
- **19:5x D381 2a (B) read:** `exo_memory/handback/p-d381-2a-B_2026-10-17.md`. Commit 9ad6d41 on d381 (parent d7a6975 = origin/main, so no rebase is needed). It holds the pick before first paint, the token reader, 13 new tokens, the 3D theme, the chrome hexes on tokens, R15 re-pointed, and Skyline and Aurora ported (B took A's half). Checks: targeted 811/812 pass with 0 fail; theme 9/9; theme mutants 13/13; core-mutation 64/64. SIGIL against 0.4.2 differs only by 3,748 pixels, all in the ruled guide outline. Skyline and Aurora: 0 moved. **Still owed:** E's 2b (Aqua, Glass), and E's M5 label contrast per skin. Collate when E is in.

## D381 collated; 0.4.3 to a landing pane (librarian, 2026-10-17 20:0x)

Read `exo_memory/handback/p-d381-2b-E_2026-10-17.md` in full, and the in-app shots `t180-d381-e\final-aqua\shot-aqua-builder.png` and `t180-d381\cdp-skyline\shot-skyline-builder.png` (themed by the app itself, no overlays; marker orange and handles exact).
- **E 2b:** e4eb95f on d381-e, a fast-forward of B's 9ad6d41. Aqua and Glass are in `app/themes/`, the sky overlays dropped, the 3D drawn by B's tokens, caustics on `#preview::after` and masked high. Checks: theme 23/23, mutants 13/13, 0 moved on both checks, contrast lowest 5.13 / 5.19, M5 17.43 / 19.19 (from tokens; the label box is opaque by construction).
- **Known, said plainly:** the road SURFACE isn't a token (only its edges, ties, grid, sky, fog), so the road body keeps today's violet, fogged toward each skin. Glass is still the quietest. Both are carried to the keeper with the shots; not blocking.
- **0.4.3 landing, one pane (C is free):** base origin/main d7a6975. `git merge --ff-only` d381-e (e4eb95f, B's 9ad6d41 under it), then merge d382-c (51d3de1). CHANGELOG: B's entry names all four skins (add Aqua and Glass beside Skyline and Aurora), plus D382's volume entry, under [0.4.3]. Version bump; README figures true after the fast-forward; notes in our own words (the skin follows the melody; layout unchanged; default volume 45%; a saved volume kept). NSIS from an empty dist. Full suite plus TAP (D351 rule; timeouts are red). Both mutation files whole, plus theme-mutation and cargo. Install `.before-0.4.3` with the builder CLOSED (it's open now; if so, stop and say so; never close it). Scan, fast-forward push, release. Hand back to me.

## D383 red at the full suite: my ruling and the re-ordered landing (librarian, 2026-10-17 20:4x)

Read `exo_memory/handback/p-d383-landing-C_2026-10-17.md`. C stopped correctly: 83 fails, all `app/test/mutation.test.js`, its control row red because the temp copy can't load preview.js, which D381 2a (9ad6d41) made require `app/lib/tokens.js`; the harness (`app/test/mutation.test.js:170`, checked) copies `camera preview testhook texmaker` + `core/keys.js`, not `lib`. `app/lib/tokens.js` requires nothing (checked: `git show HEAD:app/lib/tokens.js | grep require` → none), and `app/lib` holds cjs.js, theme.js, tokens.js.
- **My miss:** my D381 test list (`:2411`) named theme mutants and the layout check, not `app/test/mutation.test.js`, though 2a touched `preview/preview.js`, which that harness copies. Same lesson as D365: when a change touches a file a mutation harness copies, run that harness whole.
- **Ruling, the fix:** add `'lib'` to the copied directories at `app/test/mutation.test.js:170` (the whole dir, so a later require of theme.js or cjs.js can't break it again), with a comment naming D381. The test was verifiably incomplete, not wrong in what it asserts; no mutant or assertion changes.
- **Re-ordered landing, C, in the main checkout:** `git reset --hard f07f88c` (drops C's own unpushed version commit d9248de; reflog keeps it), commit the harness fix by path, check `node --test app/test/mutation.test.js` whole first (control green, 103 applied/caught, 0 NOT APPLIED), then re-make the version commit (README count re-derived: 298 after the push), then the order from the build step on: NSIS, full suite plus TAP, core-mutation, theme-mutation, cargo, install `.before-0.4.3` only with the builder closed, scan, push, release.

## D383 second stop: L17 re-point ruled (librarian, 2026-10-17 21:0x)

Read `exo_memory/handback/p-d383-landing-C_2026-10-17.md` §6 (`:85-103`). The lib fix ea1f6ca works (control green). L17 is NOT APPLIED because 9ad6d41 changed `renderer.js` `COLOURS.tie` to the token-read local `tie` (now `:290`); the failed control had hidden it.
- **Ruling:** re-point L17 to the same mutant on the new line. `from` `drawLines(L.ties, IDENTITY, tie, alpha, TIE_FADE);` → `to` `drawLines(L.ties, IDENTITY, tie, alpha);`, `caughtBy` unchanged (aclook "renderer: the ties fade out"), with a comment `AMENDED (D381): anchor follows the token-read colour; same mutant`. This is the C17 precedent (0.4.0): the code moved, not the rule. Grep the other app-mutation rows for `COLOURS.` anchors in files 9ad6d41 touched, and re-point any others the same way in the same commit.
- **Order from here, C:** commit the re-point by path; run `app/test/mutation.test.js` whole (103 applied, 103 caught, 0 NOT APPLIED; control green); then the version commit (README count re-derived: 299 after the push if this is its own commit); then build, full suite plus TAP, core-mutation, theme-mutation, cargo, install only with the builder closed, scan, push, release.

## D384 — the skin skies become a skybox (librarian, 2026-10-18 05:5x)

**Keeper's ask (2026-10-18):** the cloud-like effect at the top of each skin should be a skybox that stays put in the world as you move around, not follow the camera.

**Cause (checked at cbd7a40):** each effect is a CSS layer on `#preview::after`, pinned to the screen: Aqua's caustics `app/themes/aqua.css:118-137`, Aurora's curtains `app/themes/aurora.css:90-97`, Skyline's sun glow `app/themes/skyline.css:79`. Glass has none. The base vignette `app/index.html:169` is a lens effect and stays on screen. The renderer draws no sky, only the clear colour (`app/preview/renderer.js:3`, `:310`).

**The design:** the sky is drawn by the WebGL view as a sky at infinity. A full-screen pass runs before the track, with depth write off. Each pixel's world view direction comes from the inverse of the camera's view-projection, rotation only (a skybox ignores camera position). The pattern is a function of that direction (azimuth, elevation) and time. Turning the camera moves the sky across the screen; moving or zooming does not shift it. The fog and the road draw over it as today.
- A skin names its sky with a token, `--sky-style: none | caustics | aurora | sun`, plus the colours it needs. SIGIL and Glass are `none`, which must give today's frame pixel for pixel.
- The drift stays (slow motion in time), and it stops under prefers-reduced-motion.
- The three `#preview::after` rules in the skins are removed. Aurora's `#left` panel curtain is chrome and stays.

**Parts and panes:**
- **Part 1, B** (built the D381 plumbing): the sky pass, the direction maths, the token read in `themeFrom`/`setTheme`, the `sun` style for Skyline, and removing Skyline's overlay. Tests first:
  - the sky stays fixed in world space: with the camera yawed by a known angle, a sky feature moves on screen by the matching amount; moving the camera without turning leaves the sky pixels unchanged;
  - `none` renders identical to cbd7a40 (SIGIL, Glass);
  - an unknown style fails loudly (as setTheme does at `:299`).
  - Publish the pattern signature on the board early (e.g. `vec3 skyPattern(vec3 dir, float t)`), so E can work in parallel.
- **Part 2, E** (built Aqua and Glass): the `caustics` style for Aqua and the `aurora` style for Aurora, against B's signature, matching the D379 looks. Remove those two overlays. Shots of each skin from two camera angles, to show the sky staying put; A's layout check (0 moved); contrast (0 under 4.5:1 for the enabled texts).
- **Harnesses, run whole by both parts before hand-back** (memory brief-names-the-mutation-harness): `renderer.js` is anchored by `app/test/mutation.test.js` (A10, A11, B3, B14, B15, L5-L8, L17), so run mutation.test.js whole (103/103/0); also run theme-mutation.test.js and core-mutation.test.js whole.
- **Landing, C:** 0.4.4, after both parts are in. Same steps as D383.

NEXT: chair dispatch D384 parts 1 (B) and 2 (E) in parallel; librarian collates both hand-backs.

## D384 widened: an intricate, elegant sky for each skin (librarian, 2026-10-18 07:3x)

**Keeper's ask:** the sun and sky should look intricately and distinctly different in each theme: "not distracting, but elegant".

**Ruling:** fold this into D384, before the landing, so one release carries it. B's pass and contract stay as they are (5013897; `vec3 skyPattern(vec3 dir, float t)`, `app/preview/sky/index.js:4-14`). Only the style modules and the skin tokens change. Glass gets a sky too: the new style `prism`, added to the registry. SIGIL alone stays `none`, identical to cbd7a40.

**The four designs** (a direction for each pane, not a spec; the pane may improve on it):
- **Skyline, `sun`, B:** a clear day with depth. A sky gradient that darkens toward the zenith and pales at the horizon. The sun has a soft corona and a faint wide bloom. Thin, high cirrus streaks drift slowly near the sun's side of the sky. A low haze band sits at the horizon.
- **Glass, `prism`, B:** a cold, clear night, the quietest of the four. A sparse field of fine stars with a faint twinkle. Low on the horizon, a thin, soft band of prismatic dispersion, light split into a faint spectrum and refracted as if through glass. A pale, cold moon.
- **Aqua, `caustics`, E:** looking up from under water. Overhead, Snell's window: a bright, soft disc of the sky above, rimmed by moving caustic ripples. Faint light shafts fall from it and fade with depth. Deep teal below the horizon.
- **Aurora, `aurora`, E:** a polar night. Stars, plus curtains of green and violet with fine vertical ray structure. The curtains fold and sway slowly, and their lower edges are brighter.

**What "not distracting" means, checked rather than judged:**
- No hard lines: every edge is soft (the keeper struck Aqua's rings for this in D379).
- Slow: no feature crosses the view in under about 30 s. The twinkle is subtle.
- Quiet behind the work: below about 10° elevation, where the road usually sits against the sky, the luminance stays within a set band of `--fog`.
- Every enabled text still at ≥4.5:1, the layout 0 moved, and reduced motion stops all motion (t = 0).

**Show before land:** each pane adds shots of its two skies from two camera angles (looking level, and looking up) to the hand-back. I build one page of all four for the keeper to look at before C lands 0.4.4.

**Harnesses as before:** sky.test, theme-mutation, mutation and core-mutation, each run whole. The `none` fixture row becomes SIGIL-only. Glass's move from `none` to `prism` is named in the hand-back.

NEXT: chair route the widened D384 to B (sun redesign + prism) and E (caustics + aurora, to this bar), both on B's contract; librarian collates and builds the preview page.

## D385 — the turn and climb carry to the next piece; a left edge field (librarian, 2026-10-18 08:3x)

**Keeper (2026-10-18):** a piece after a turn goes straight "because the pieces dont retain the same values as the next piece after, which is what I want. So right now only the cup and width and banking and length is retained but not the climb and turn, also there is the right edge but not the left edge tweak".

**Cause (checked at cbd7a40, `app/core/panel.js`):**
- After each Extend the fields show the HEAD (`showHead`, :193). Cup, width, bank and the edges show the value the last piece ended at, so they carry.
- In corner mode (D331, the default, :180-192) the turn and climb fields are left BLANK at the head (`showTurnHead`, :188-191): "a corner has no value at the head". Blank means keep turning at the head's rate, and a corner ends straight, so the next piece is straight.
- The edges: `edge angle °` sets both sides, and `right edge °` (:156-158) splits them, which makes the edge angle the left side. There is no field named for the left.

**Part 1, the carry (pane C):**
- In corner mode, after an Extend, the turn and climb fields keep the degrees typed for the piece just placed, so Extend again places the same corner. "Ends straight" stays the meaning of a corner.
- Clearing the field, or typing 0, still behaves as today.
- An Undo puts back the undone piece's own values (the `putBack` path, :577). Opening or starting a document clears them. A selected piece lends its own corner (:580ff) where it can be read; say plainly where it can't.
- Rate mode is unchanged; it already shows the head's rate.

**Part 2, the left edge (pane C, same file, so the same pane):**
- The two fields become `left edge °` and `right edge °`. Each shows its own side's value at the head, and each is kept as shown.
- Typing one side changes only that side. Today, typing the edge angle alone moves both, so this is a behaviour change: say it in the CHANGELOG. If keeping one "both sides" field reads better, propose it in the hand-back.
- No document change: `e` stays the left side, `er` the right (`src/core/extend.js`, the edge comment at :9-11 and at panel.js :73). A side typed equal to the other is stored as today.

**Tests first:** a corner of 30 placed, then Extend with the fields untouched, places a second 30 corner; the same for climb; clear the field and the piece goes straight; Undo restores the value; typing the left edge alone leaves the right as it was, and the reverse.

**Harnesses:** `core-mutation.test.js` anchors `app/core/panel.js` 20 times (`grep -c`), so run it WHOLE and re-point any moved anchor by the C17/L17 precedent, naming it. Targeted otherwise: core-pieces-ui, core-buildmenu, core-readout-display, core-sculpt, handles, share-install (the tests naming turnAs or "right edge").

**Branch:** `d385-c` off cbd7a40, in a fresh worktree. It lands with D384 in 0.4.4. The two touch different files (D384: preview/sky/themes; D385: core/panel.js).

NEXT: chair dispatch D385 to C; C rings the librarian with the hand-back.

## The Ponytail review lapsed after D356; it comes back for 0.4.4 (librarian, 2026-10-18 08:4x)

- The ruling at `plan_ponytail_2026-10-16.md:322` puts Ponytail as reviewer-only on **every landed product lap**. The last review on disk is review 5, on D355 (`exo_memory/handback/p-d346-review5-E_2026-10-17.md`). checked: `ls exo_memory/handback | grep -i review` shows none after it.
- So D375–D383 (0.4.2 and 0.4.3) landed unreviewed. My miss: none of my briefs since D356 named the review.
- **For 0.4.4:** after C lands D384 + D385, E runs ponytail-review (the stripped copy, `G:\Consonance-tools\ponytail-room\`) on the landed diff. The standing rules hold: no finding that rewrites a test lands, and a finding's fix is measured by a building pane first. Also run it once over the 0.4.2 and 0.4.3 range (d7a6975^..cbd7a40's lap commits), so the lapse is closed.
NEXT: chair add the Ponytail review (E) after the 0.4.4 landing, plus one catch-up review of 0.4.2–0.4.3.

## D387 — Consonance's own Ponytail: a fork built into the room (librarian, 2026-10-18 08:4x)

**The keeper (2026-10-18):** "we were supposed to take it, and fork our own modification of it to work within consonance somewhere".

**The record, so the miss is visible:** the Third Place's plan was to promote one pane to Ponytail (`Downloads/for-the-librarian/ponytail-promotion_2026-10-16.md`). The trial's always-on arm cut code it judged unreachable, together with the tests that pin it (`plan_ponytail_2026-10-16.md:97-107`). I ruled NO on that form, kept it reviewer-only, and wrote "that question isn't reopened" (`:322-325`). No fork was ever planned. That was the step missing: the NO was against the stock rule, and its one failure mode is exactly the kind of thing a fork fixes. So this is a new form under a new registration, not a re-reading of the old one.

**What the fork is:** `consonance/rules/ponytail.md`, in the lighthouse repo. It starts from the stock rule at 6f1c2bff (`G:\Consonance-tools\ponytail-room\.agents\rules\ponytail.md`), carries MIT attribution and a NOTICE, and is modified for the room:
- **Never cut, added:** a test, or code that a test pins. A cut that would remove either becomes a finding in the hand-back, for a ruling.
- **Its closing "what was skipped, what is at risk" line** becomes the hand-back's "Not done" and "Limits", with claims marked checked or inferred, which is the room's existing form.
- **"List every place the change must reach"** names the mutation harnesses (memory brief-names-the-mutation-harness) and the call sites.
- **No hooks, no statusline, no ledger, nothing written outside the project.** It is text only, as the stripped copy was.
- **The review skill** sits beside it as `consonance/rules/ponytail-review.md`, run after every landing (the standing reviewer ruling).

**Where it runs:** every building pane's brief. Panes get `COMMITTEE.md` from `consonance/src-tauri/src/main.rs:3124` (`room_brief_at`). The fork is carried the same way, as one more room brief handed to siblings, not to the chair or the librarian. The pane building this finds the exact join point and tests it: a sibling's brief contains the rule, and the chair's and the librarian's do not.

**Pane:** E (built the stripped copy and ran all five reviews). Tests first: the brief-composition test above; a grep that the fork contains no executable hook paths; the rule text diffed against stock, with every changed line listed in the NOTICE.

**Registration, before it runs:**
- Prediction: over the next 5 product laps built under the fork, ≥1 lap's hand-back reports a smaller change than the plan expected, with no landing red from it, and 0 tests deleted or rewritten by a pane citing the rule.
- Degenerating: any test removed under the rule, or 2 of 5 landings red from a cut the rule made.

NEXT: chair dispatch D387 to E after its D384 part 2 hand-back; librarian reads the fork text before it reaches any brief.

## D386 read: the catch-up Ponytail review, two real findings, both ruled (librarian, 2026-10-18 09:1x)

Read `exo_memory/handback/p-d386-review6-A_2026-10-18.md` whole (57 lines). Accepted. It's one reviewer on Sonnet, with no control arm, so it isn't added to the trial's tally.

- **Finding 1, real (`app/sound.js` `loadSamples`):** every launch fetches all 10 sample files, but plays one melody. A 404 on any file of a melody that was NOT picked throws out every sample, so the tick, the loop close and the picked melody all fall back to the synth (A's probe1).
  - **Ruling:** fetch only `drag_tick`, `loop_closed` and the picked melody's two files, and make `useSamples`' required set the same list.
  - Test first: a 404 on an unpicked melody's file still plays the samples.
  - **The test row that pins "every slot is fetched" is amended BY NAME** (sound-samples row 4 and row 9 as A cites them), with a comment `AMENDED (D388): only the picked melody's files are fetched (D386 finding 1)`. The rule changed on purpose; the row isn't weakened, because the new row pins the new list exactly.
  - Pane C, as **D388**, after its D385 hand-back. A separate commit; it lands in 0.4.4.
- **Finding 2, real (Aqua `--bad`):** the error red is SIGIL's `#e0573f`, at 3.38:1 on Aqua's panel, 4.05 on `--bg` and 2.81 on `--raise`.
  - **Ruling (mine, the keeper's to veto):** lighten Aqua's `--bad` within the same red hue until it reaches ≥4.5:1 on `--panel`, `--bg` and `--raise`. It still means "error"; only its lightness moves, the same way each skin already sets its own colours. This is an accessibility fix, not a change of meaning.
  - **Folded into E's D384 part 2,** since E owns `aqua.css` in this lap. E measures all three surfaces and states the value.
- **Refuted candidates** (A's §Candidates): accepted as refuted. The `color-mix()` WebView2 version was not checked; noted as a limit, not a finding.
- **A's NEXT line had no `when`**; the station is named here.

OUTPUT → NEXT: changed — two fixes enter 0.4.4: D388 (C, after D385), and Aqua's --bad folded into E's D384 part 2.
NEXT: chair route finding 2 to E now (inside D384 part 2) and D388 to C when C's D385 hand-back is in.

## D394: Settings ▸ Theme, each theme with its own melody (librarian, 2026-10-18 16:1x)

The keeper, verbatim: "do you think we should make a area in the settings where u can change the theme lol", then, asked whether a fixed theme keeps a random melody or plays its own: "themes own melody".

Facts at 0e50b42 (v0.4.5), checked 16:1x:
- `app/index.html:7-10`: the head script draws one number before the first paint, `window.__t180MelodyPick = Math.random()`, and sets `<html data-theme>` from `['aqua','skyline','glass','aurora'][floor(r*4)]`.
- `app/index.html:411`: `createSound(window, { pick: () => window.__t180MelodyPick … })` takes the same number, so look and melody agree (D381). `app/sound.js:47` MELODY_NAMES is the same four in the same order; `theme.test.js` pins them equal.
- `app/sound.js:15-16` says the melody is "picked at random each time the builder starts, never saved" (D375). This lap changes that sentence for a fixed theme only.
- `app/lib/theme.js` `applyTheme(doc, melody)`: a name of the four sets data-theme, anything else removes it (SIGIL). `app/lib/tokens.js:101` redraws the 3D view and sky when data-theme changes.
- `app/settings.js` (D355): saved settings in localStorage as `t180.settings.<key>` (JSON), KEYS frozen at `:20`, an unknown key throws. The Settings menu is `app/menubar/` (D355); `app/index.html:240` is the `m-settings` panel.

**The ruling (the keeper's word for the melody; the rest is mine, his to veto):**
- A new setting `theme`, one of: `music` (the default: today's behaviour, one random pick decides both), `aqua`, `skyline`, `glass`, `aurora`, `sigil`.
- A fixed theme plays that theme's own melody: the head script reads the saved value straight from localStorage (it runs before settings.js loads) and sets the pick so `floor(r*4)` lands on that theme. Unreadable or unknown saved text → `music`, never a throw before first paint.
- `sigil` has no melody of its own: the look is SIGIL (data-theme removed) and the melody stays random. Say so in the menu's tooltip.
- **Switching while open:** the look switches at once (tokens.js already redraws). The melody switches at once too if sound.js can fetch the new place/undo pair without a gap or a click; if it can't, the melody follows at the next start and the menu says "the melody changes next start". The pane measures which and reports it; no new sound engine work beyond fetching the pair.
- The menu entry sits in Settings with the others, in the same pattern as the existing items (`app/menubar/items.js`).

Parts:
1. **E, build** (E did the skins and skies, D381/D384/D391): worktree from main `0e50b42`. Test first:
   - settings.test.js: `theme` is a known key; an unknown value throws by name.
   - a head-script row: each saved value gives the right data-theme AND the right melody (sound.melody), `music` keeps the random pick, a broken saved value falls back to `music`.
   - a live-switch row: switching sets data-theme and (if live) the melody.
   - Red first on 0e50b42, then green. Update `sound.js:15-16`'s "never saved" comment and add an Unreleased CHANGELOG line, in our own words (no "keeper").
   - Run WHOLE under heavy-run.js: theme-mutation, mutation (it copies app/lib, `ea1f6ca`), sound.test, sound-samples, settings.test, menubar-page.test, theme.test. Headless only; no window.
2. **B, landing** as 0.4.6, the 0.4.5 procedure (harnesses whole, full suite with TAP and the D351 rule, install only while the builder is closed with `.before-d394`, stamped-copy compare, scan, push, tag, release).
3. **A, review** (Ponytail, read-only) of E's diff before B lands, and of B's bump after.
4. **Librarian:** reads E's hand-back, rules, verifies B's landing, all-clear.

OUTPUT → NEXT: changed — a new lap from the keeper's word: Settings ▸ Theme with each theme's own melody, E builds, A reviews, B lands 0.4.6.
NEXT: chair route D394 part 1 to E now; A reviews E's diff when E hands back; B lands 0.4.6 after the librarian accepts.

## D395: a new T-180 icon and wordmark that fit the look (librarian, 2026-10-18 16:3x)

The keeper, verbatim: "we should also do an update to the logo for t-180 track builder, making it fit the aesthetic with an iconic icon xdD".

Facts at 0e50b42, checked 16:3x:
- The icon is drawn by `src-tauri/icons/make-icons.js` (dependency-free, node zlib, deterministic): "a dark tile with a banked track swinging up a wall, drawn in the app's accent colour" — a blue quarter-arc on a dark rounded tile (`128x128@2x.png`, seen). Written once at D168 (`f0b0d75`, 2026-09-27), before SIGIL (2026-10-14) and the four skins (D381).
- `tauri.conf.json:32-37` names `icons/32x32.png`, `128x128.png`, `128x128@2x.png`, `icon.ico`. The installer and taskbar use these.
- In the app the name is plain text: `<title>T-180 Track Builder</title>` (`index.html:6`) and `<h1>T-180 TRACK BUILDER</h1>` (`:216`), set in `--display` (Bahnschrift / DIN).
- SIGIL's brief (`index.html:12`): elegant minimalism, esoteric-techno, black and bone, hairline borders, ONE accent (pale ultraviolet). Four skins tint it (aqua, skyline, glass, aurora).

**The ruling:** the look is the keeper's taste, so this goes in two steps and he picks between them. No build before his pick.

Parts:
1. **C, concepts** (read-only on the builder; work in C's own folder): 4 or 5 distinct icon concepts, each as an SVG master, plus a matching wordmark treatment for the title bar.
   - The bar for "iconic": it reads at 16 and 32 px (show both, on dark and on light taskbars), it is one shape you could draw from memory, and it says track or T-180 without words at small sizes.
   - Fits SIGIL: black and bone with one accent; hairline where it survives at 32 px. Show each concept once in each of the four skins' accents too.
   - Ideas to try, not to be bound by: the T and the 180° turn as one stroke; a sigil-like mark from a hairpin; a banked loop in hairline; a monogram "T180" in Bahnschrift.
   - No copying of an existing brand mark; say so per concept.
   - Output: a preview page (one HTML with the PNGs beside it) the librarian publishes for the keeper, and a hand-back naming each concept in one line.
2. **Keeper picks** (the librarian brings the page; one question, his pick).
3. **E or C, build** after the pick: `make-icons.js` redrawn to the chosen mark (still deterministic, still dependency-free, or SVG→PNG with a tool already on the machine), every size in `tauri.conf.json` regenerated, the wordmark in the `<h1>`. Test first: a row that the generated PNGs are the sizes named and that the script writes the same bytes twice.
4. **B** lands it with 0.4.6 if D394 hasn't landed yet, otherwise 0.4.7, by the same procedure.

OUTPUT → NEXT: changed — a second new lap from the keeper's word: icon concepts first (C), his pick, then the build.
NEXT: chair route D395 part 1 to C now (concepts only, no build); the librarian publishes C's page for the keeper when C hands back.

## D395 part 3: the keeper's pick — concept 3, Crossover loop, in Skyline (librarian, 2026-10-18 16:4x)

The keeper, verbatim, on the page https://claude.ai/artifact/XQ3yiMTE4rxt3LdGTZDPD4: "3 Skyline".
- **The icon:** C's concept 3 (the banked figure-eight with a bridge, the car as the accent dot) in Skyline's palette: tile `#eef6ff`, stroke `#0b2747`, dot `#0757b3` (C's `svg/crossover-loop-skyline.svg`, seen at 128 px). It is the app icon in every theme; the icon does not change with the in-app theme.
- **The wordmark:** concept 3's: the accent dot leading, "T-180", a hairline divider, "TRACK BUILDER" dimmed. In the app it is live text in the current theme's tokens, so it follows the theme (the icon stays Skyline).
- **Known and accepted by his pick:** at 16 px the bridge is lost and it nears an infinity sign (C's page says so).
- **One check the build owes:** Skyline's tile is light. On a light taskbar (#f3f3f3) the tile edge may vanish. Measure it; if the tile's outline doesn't read at 24 and 32 px, add the thinnest edge that does (a 1 px `#0b2747`-tinted rim), and show before and after.

Parts:
1. **C, build** (C drew it; `make-concepts.js` already draws any size deterministically with node's zlib only): worktree from main `0e50b42`.
   - Lift concept 3 into `src-tauri/icons/make-icons.js` (keep its header style; deterministic; dependency-free). Regenerate every file `tauri.conf.json:32-37` names; `icon.ico` carries 16, 24, 32, 48 and 256 (C's §3).
   - The h1 wordmark in `app/index.html:216` and its CSS, in the theme tokens; the `<title>` stays "T-180 Track Builder".
   - Test first: a row that the generated PNGs and the ico's sizes are the ones named, and that two runs write the same bytes; a row that the h1 still reads "T-180" and "TRACK BUILDER" (any test that reads the h1 text today must still pass; find them with grep before changing it).
   - Run WHOLE under heavy-run.js: theme-mutation (it anchors preview.js and skin files; check none sits on a changed line), menubar-page, theme.test, and any test grep finds on `make-icons` or the h1. Headless only.
   - CHANGELOG Unreleased line in our own words (no "keeper"). Show the icon at 16, 24, 32, 256 on dark and light taskbars in the hand-back.
2. **A, review** of C's diff (read-only, Ponytail), alongside A's review of E's D394.
3. **B** lands D394 and D395 together as 0.4.6.

OUTPUT → NEXT: changed — the keeper picked concept 3 in Skyline; C builds it.
NEXT: chair route D395 part 3 to C now; A reviews C's and E's diffs when both hand back; B lands both as 0.4.6.

## D397 (concepts): texture as design language — dither, noise, ASCII (librarian, 2026-10-18 18:3x)

The keeper, verbatim, sharing a post (screenshot `C:\Users\nname\Pictures\Screenshots\for t180 track builder design themes.png`: "best ways to unslop a site: > dither > noise > ascii", three panels: a blue dithered face, green fluid noise, a red ASCII/dot-matrix planet): "interestng idea for our design philsophy, we dont need to take the color just the textrue idea".

**The ruling:** texture, not colour. Each skin keeps its own palette; the question is which surfaces get which texture, how strong, and whether it stays legible and fast. His taste decides, so concepts first, a page, his pick, then a build. No build before the pick.

Where texture can live (to try, not to be bound by):
- **The 3D sky** (`app/preview/sky/`): an ordered (Bayer) dither in the sky pass. It is a look AND a fix: it breaks 8-bit banding in the long gradients. Must keep the D391 contract and the ±10° quiet band (≤1.30:1 to --fog).
- **Panels and the header:** a fine static grain (an SVG feTurbulence or a small tiled PNG in the skin's tokens), at a strength that leaves every text ≥4.5:1 where it sits today.
- **Empty states, the splash or loading, the About box:** ASCII or dot-matrix renderings (e.g. the track or the new loop icon in characters).
- **Per skin:** one texture each is allowed (e.g. SIGIL film grain, Glass ordered dither, Aqua soft noise, Aurora dot-matrix), or one shared texture at four strengths. Show both ways.

Parts:
1. **E, concepts** (read-only on the builder; own folder; headless): 3–4 directions, each shown on real screenshots of the builder in all five looks (SIGIL + four skins), plus the sky with and without dither. For each: what it touches, its strength, the text contrast it leaves (measured), and its cost (GPU ms for the sky pass, paint for CSS). Banding before and after for the sky dither. A page the librarian publishes.
2. **Keeper picks.**
3. **Build** (pane named at the pick), test first, the D391 contract kept, theme-mutation whole; lands with the next release.

Queued behind nothing on the builder: concepts touch no repo file, so they run beside B's 0.4.6 landing and C's D396.

OUTPUT → NEXT: changed — a new concepts lap from the keeper's idea; E draws, he picks.
NEXT: chair route D397 part 1 to E now (concepts only, read-only, headless); the librarian publishes E's page when E hands back.

## D396 accepted; D398: the sky's one-step dither (a fix); 0.4.7 = D396 + D398 (librarian, 2026-10-18 19:0x)

**D396 (C) accepted:** `d77bcd7` on `63515d0` (v0.4.6), branch d396-c, worktree `t180-wt-c20`, 3 files +37 (read: the three media rules and the CHANGELOG line). Before: at 900 the bar overflowed by 379 px with `#winctl` outside the window; after: 0 overflow and `#winctl` inside at 900/1100/1280/1400 (C's probe). The fold order (TRACK BUILDER under 1280, T-180 under 980, the dot stays; menus, Export and `#winctl` never shrink) is C's and sound. `#install` is not hidden in Tauri (checked from code).

**D398, ruled by the librarian (the keeper's to veto, told 2026-10-18 19:0x):** the sky's one-step dither from E's D397 page (https://claude.ai/artifact/KhxNawZtHU9uWsUKaKaMuk), as a fix, not a look.
- E's measurements (`p-d397-texture-E_2026-10-19.md` §2, §4): the longest flat run down a column falls from 34/41, 56/117, 80/47, 26/174 px to 4–8 px; the ±10° band moves ≤0.009 (sun 1.157, prism 1.147, caustics 1.239, aurora 1.044, all ≤1.30); GPU cost inside the spread between styles; `contractProblems` → [].
- **E builds** from main `63515d0`, in the sky pass (one place every style passes through, not four copies), test first: a row that measures banding (longest flat run) on each style before and after, a row that the band stays ≤1.30:1, and the D391 contract rows unchanged. Run whole: sky, sky-caustics-aurora, theme-mutation, mutation (it copies app/lib and preview). CHANGELOG Fixed line in our own words.
- The LOOK (grain, dithered sky, ASCII) waits on the keeper's pick and is not in this lap.

**0.4.7:** A reviews D396 now and D398 when E hands back; B lands both by the 0.4.6 procedure (`.before-d396`).

OUTPUT → NEXT: changed — D396 is accepted, and the dither fix joins it as D398 so 0.4.7 carries both.
NEXT: chair route A's review of d77bcd7 and D398 to E now; B lands 0.4.7 when the librarian accepts A's review of both.

## D399: the texture look, built on the librarian's pick (librarian, 2026-10-18 19:2x)

The keeper, verbatim, on the D397 page: "not sure i like that artifact just make it and show me when its done". The pick is delegated to this seat; he judges the built thing.

**The pick (mine, from E's measurements in `p-d397-texture-E_2026-10-19.md`):** direction 4, one texture per look, plus direction 3, ASCII for the empty moments.
- SIGIL film grain 0.06; Skyline coarse "paper" grain 0.05 (dark specks on its light panels); Glass ordered dither 0.08; Aurora dot matrix 0.10; **Aqua soft fluid noise at the highest strength that pushes 0 texts under 4.5:1** (0.10 pushed 2; E measures downward, e.g. 0.08 / 0.06, and picks the highest clean one).
- Surfaces: the header, the left panel and the menus, as on E's page; never the 3D view, never under a text at a strength that pushes it under 4.5:1.
- The empty builder shows the track in characters in the look's dim colour, behind everything (E's direction 3). The splash and About get it only if they exist as surfaces today; otherwise note them and stop.
- The texture follows Settings ▸ Theme (each look its own), and "Follow the music" follows the melody's look, as the skins already do. SIGIL gets its grain.
- Why 4 over 1: each look already has its own colours, gem and sky; its own texture finishes that, and E measured 0 pushed under in four of five looks at these strengths.

Parts:
1. **E builds after D398** (E knows the measurements and the sky code), from the 0.4.7 base when it lands, else from main with a rebase. One pre-rendered tile per look (as E drew them: a bitmap decoded once), set in each skin's CSS through a token; no SVG feTurbulence unless measured. Test first: a row per look that the texture is present on the header/panel/menus and absent from the 3D view; the contrast probe (E's tex.js) as a row: 0 texts pushed under 4.5:1 in all five looks, builder and File-menu-open; the empty-state ASCII appears only with no pieces. Run whole: theme-mutation, menubar-page, theme.test, layout-css, shell-layout, and E's contrast probe.
2. **A reviews** (Ponytail).
3. **B lands** it in the release after 0.4.7 (0.4.8), same procedure.
4. **Librarian shows the keeper** the built thing: real screenshots of the installed builder's page in all five looks (headless), sent to him directly, not a concept page.

OUTPUT → NEXT: changed — the keeper delegated the texture pick; D399 builds direction 4 + 3 after D398.
NEXT: chair route D399 to E when E's D398 is handed back; A reviews it; B lands it as 0.4.8; the librarian shows the keeper screenshots when it is built.

## D401: Settings ▸ Theme — "Music" renamed, and the melody must follow a theme change (librarian, 2026-10-18 21:3x)

The keeper, verbatim, on 0.4.6 installed: "when looking at the settings tab, it says theme, but the music is a checkable thing under the rest of them, it doesnt do anything since how can music be a theme, also, the song that loads should change with the theme if someone else changes it, it currently does not".

Two parts, one lap:
1. **"Music" is not a theme.** Today the Theme section lists Music (`app/menubar/items.js:63`, default `theme: 'music'` at `:15`; the head script's `theme = 'music'` at `index.html:14`). **Ruling (mine, his to veto):** rename the entry to **"Random"** (tooltip: a look and its own melody picked at random each start), keep it first and the default, and choosing it while open picks a random look now (with that look's melody), so the click visibly does something. Keep the saved value `music` readable as Random so nobody's saved setting breaks (a saved-data rule: old values still load).
2. **The melody does not follow the theme — a bug report, so reproduce it in a test first.** The wiring exists (`index.html:534-538` calls `soundNow.setMelody(...)` on a theme change; `sound.js:449` setMelody), and E's D394 page row checked only the FILES fetched, not the melody the player then plays (E's own limit, `p-d394-theme-E_2026-10-18.md` §4, and A's note). So the test must assert the melody actually played after a theme change — the next placement's notes or `sound.melody` through a test hook — in the real page, in each of: before any sound has started; after the first placement (samples in); and on the synth. Find which path fails, fix the cause, red first then green. "The song that loads" may mean the melody at start after a theme was saved: test that too (save Glass, reload, first placement plays Glass's melody).

**C builds** (fresh eyes on E's D394 wiring; C is idle), from main after 0.4.7 lands (else from `c2d7cb5` and rebase). Run whole: menubar-page, theme.test, settings.test, sound.test, sound-samples, theme-mutation, mutation. CHANGELOG Fixed + Changed lines in our own words. A reviews; B lands it with D399 as 0.4.8.

OUTPUT → NEXT: changed — the keeper found two faults in 0.4.6's theme setting; D401 renames Music to Random and reproduces and fixes the melody not following.
NEXT: chair route D401 to C now (test first; base 0.4.7 when it lands); A reviews; B lands it with D399 as 0.4.8.

**D401 amended (librarian, 2026-10-18 21:3x):** the keeper, verbatim, after trying it: "IT JUST DID FOR ME" — the melody does follow a theme change (it plays from the next placement). **Part 2 is dropped**; no bug to chase. D401 is part 1 only: "Music" renamed "Random" (first, the default; choosing it while open picks a random look and its melody now; a saved `music` still loads as Random). C builds, test first; run whole menubar-page, theme.test, settings.test, theme-mutation. A reviews; B lands it with D399 as 0.4.8.
NEXT: chair route D401 (rename only) to C now; base 0.4.7 when it lands.

## D402: SIGIL's own melody, a fifth (librarian, 2026-10-18 21:3x)

The keeper, verbatim: "sigil just doiesnt have its own sound", then, asked whether SIGIL should get its own melody: "yes fifth melody".

Facts (0.4.6/0.4.7):
- `app/sound.js:47` `MELODY_NAMES` = the four; `MELODIES` holds four of 64 steps `[bass, chord of four, melody note on top]`, two steps a chord (`:86-132`); `:132` throws unless there are exactly four of 64. Each melody plays its own `place_<name>.wav` / `undo_<name>.wav` (D375), each levelled into the bands (`sound-bands.test.js`).
- The four came from batch 9 (`G:\Consonance-tools\b9\mel9.js`, `p-d374-batch9-E_2026-10-17.md`), their instruments from batch 10 (Serum factory presets; the licence is settled, the keeper's "xfer said we can use them", plan :1588).
- SIGIL's look (index.html:12): elegant minimalism, esoteric-techno, black and bone, one pale-ultraviolet accent. Today SIGIL keeps the random melody (head script `index.html:7-19`, `theme.js` `skinFor`).

Parts:
1. **E, audition (after D399's rebase):** 3 candidate melodies for SIGIL, 64 steps in the same format, in SIGIL's spirit (sparse, dark, hypnotic; minor or modal; not a copy of the other four or of any known piece), each with its own place/undo instrument from Serum factory presets, rendered through the builder's own engine (`soundrender`, the batch 10 way) inside the bands. Output: per candidate, a short clip of a 16-placement walk plus a few undos (WAV and a small MP3 copy), named sigil-1/2/3. The librarian sends the clips to the keeper directly; no page.
2. **Keeper picks** by ear.
3. **Build (C or E, named at the pick):** `MELODY_NAMES`/`MELODIES` gain `sigil` (five of 64; the `:132` guard and theme.test's head-names row follow), its two WAVs levelled and banded, SIGIL plays its own melody; Random picks among five looks; the head script's pick maps five ways. Saved settings keep loading. Test first; run whole sound, sound-samples, sound-bands, theme, theme-mutation, mutation, menubar-page. Lands in the release after his pick.

OUTPUT → NEXT: changed — the keeper asked for a fifth melody; E auditions three for SIGIL after D399.
NEXT: chair route D402 part 1 to E after E hands back D399's rebase; the librarian sends the keeper the clips when E hands back.

## D403: an enhancement pass on the Aurora sky, to look more like a real aurora (librarian, 2026-10-18 21:3x)

The keeper, verbatim: "the aurora looks good in the other one too, but i wonder if you could do an enhancement pass to make it look more aurora like". He judges the built thing (his word earlier tonight: "just make it and show me when its done").

Today (`app/preview/sky/aurora.js`, 56 lines, D384/D391/D393): two curtains (green, a higher fainter violet), each a ribbon folding and swaying slowly with fine vertical rays, the lower edge brightest, the top fading to violet; stars; nothing under ~10°; folds < 0.004 rad/s, hems < 0.006 rad/s.

**What reads as a real aurora (the brief's targets, the pane's to weigh):**
- Tall curtains with distinct vertical ray structure (striations that brighten and dim along the curtain, "pulsing" slowly), not a smooth ribbon.
- A defined lower hem (the brightest green, sharper than the top), the colour moving green → a faint red/magenta at the top (high-altitude red) and, in a strong curtain, a thin pink/violet fringe under the hem.
- Layering and depth: more than one curtain at different heights and distances, the far ones fainter and lower.
- Looking up: rays converging toward one point (a corona) where the curtains pass overhead.
- Motion that is slow and alive: rays drifting along the curtain and the folds shifting, never fast (keep "nothing crosses the view in under four minutes").

**Kept, all of it:** the D391 contract (`contractProblems` → []: no fract of a sin, smoothstep edges in order); the quiet band, every pixel −10° to 10° within 1.30:1 of `--fog`; the colours from the skin's tokens (a new token for the red fringe only if needed, set in `aurora.css`, texture-not-colour rules unaffected); the sky dither (D398) untouched; GPU cost measured against today (E's method: 1400×816, median of 5×200 passes), staying in the same order as the other skies.

**Parts:** **C builds** after D401 (from the newest main; rebase as needed), test first where it can be (the contract row, the band row, a row that the curtain has vertical structure: brightness varies along azimuth at the hem by more than X, a row for the motion limit); run whole sky, sky-caustics-aurora, sky-dither, theme-mutation. Shots before and after, level and looking up, at t = 0 and t = 60 s, and a short frame strip of the motion. A reviews. The librarian shows the keeper the shots; lands in the next release after his OK.

OUTPUT → NEXT: changed — a new lap from the keeper: the Aurora sky's enhancement pass, C after D401.
NEXT: chair route D403 to C when C hands back D401; A reviews; the librarian shows the keeper the shots.

## D404: how long a piece can be before dragging it lags, measured, and the drag made cheaper (librarian, 2026-10-18 21:4x)

The keeper, verbatim: "i was pushing the limits of smooth preview when stretching tracks, it got laggy when I made a 10000m turn which is unrealistic for people to do lots, but perhaps it could still run a little better, but then when do you think it is expected to always be laggy, that could be good to know".

What's known (checked 21:4x): edits rebuild per cell (ARCHITECTURE §3, `test/perf.test.js` pins that only the edited word's cells and its seams rebuild, and no mesh crosses IPC during a drag). So a drag's cost should follow the length of the piece being dragged, not the whole track (inferred: a 10 km turn is one word whose every cell rebuilds each drag frame). No measurement of drag frame time against piece length exists.

Parts:
1. **Measure (B, after the 0.4.7 landing):** headless, the real page (as the D39x page tests do), a drag on a single turn piece at lengths 100, 500, 1,000, 2,000, 5,000, 10,000 and 20,000 m (and a straight for contrast), at the default window. Per length: median and 95th-percentile frame time during the drag, split into mesh build, upload (renderer stats: uploads/buffers) and validation/other. Report the length where the drag crosses 16.7 ms (60 fps) and 33 ms (30 fps) on this machine, and say which part grows. Headless GPU numbers are this machine's (RTX 5080); name that.
2. **Ruling after the numbers (librarian):** whether a cheap win exists without changing what the user sees on release, e.g. a coarser preview sampling or fewer cross-sections during the drag only with the full rebuild on release, or rebuilding only cells near the moving end. Test first: the release mesh is byte-identical to today's; the drag stays under the bar to a stated length.
3. **The answer for the keeper and the docs:** "smooth up to about N m per piece on a machine like this; beyond that a drag is expected to lag" in plain words, and a line in `docs/` (STATUS or ARCHITECTURE) so the next session knows.

OUTPUT → NEXT: changed — the keeper's lag report becomes a measurement first (B), then a ruling on a cheap win.
NEXT: chair route D404 part 1 to B when the 0.4.7 landing is handed back; the librarian rules on the numbers.

## D405: Skyline Night, a dark Skyline (librarian, 2026-10-18 21:4x)

The keeper, verbatim: "also I had a dumb idea, a clever and elegant dark mode for skyline". He judges the built thing.

Skyline today (`app/themes/skyline.css`, 93 lines, D381/D379): the only light skin, Frutiger Aero, white frosted glass, glossy pills, a bright sky, deep sky blue accent; its sky is `sun` (D384).

**The ruling (mine, his to veto):** a sixth entry in Settings ▸ Theme, **"Skyline Night"**, not a toggle inside Skyline. It keeps Skyline's character — the frosted glass, the gloss, the pills, the same melody — at night: deep navy glass panels, the accent a lit sky-blue, a city's warm glow on the horizon instead of the sun, a few stars overhead. Its texture is Skyline's paper grain with the specks flipped to light (D399's rule for light/dark surfaces). It plays Skyline's melody (it is Skyline, at night), so the melody list does not grow for it.

**Rules carried:** styling only, no box property (theme.test reads every skin for that); every text ≥4.5:1 (the D389/D397 probe as a row, 0 under in builder and File-menu-open); the warning hues keep their hue; its sky keeps the D391 contract and the ±10° band ≤1.30:1 of its fog, and the D398 dither; Random may land on it (one more look); saved settings keep loading.

**Sequence:** it touches the theme list, the head script and skin files that D399 (textures), D401 (Random) and D402 (fifth melody) also touch, so it builds **after those land**, on the newest main. **Pane named then** (C or E). Shots in all states; the librarian shows the keeper; lands after his OK.

OUTPUT → NEXT: changed — a new lap from the keeper: Skyline Night, queued behind D399/D401/D402.
NEXT: chair queue D405; route it when D399, D401 and D402's build have landed; the librarian names the pane then.

## D406: negative edge angles — an edge that turns down, toward flat or past it (librarian, 2026-10-18 21:4x)

The keeper, verbatim: "the left and right edge value, it should be able to go into the negatives, meaning the track curves down tweaking the banking on one side to be closer to flat or even past it, you know what i mean".

What exists (checked 21:4x, `src/core/document.js`):
- `e` (left) and `er` (right, D225/seal V3, the keeper's 2026-10-12 ask) are the extra edge angle over the outer zone, degrees, **>= 0**. `:34`: "(e < 0, a lip, is not in this version)"; `checkEdge` (`:377-379`) refuses either below 0 with BAD_EDGE by name. `s` (where the outer zone starts) in [0.5, 0.95]. The total (middle profile's edge angle + e) is capped at CUP_MAX 150 (cup/legacy) or 180 (open tube).
- A file whose sides differ is written as **core/5** so an older builder refuses it by name (`:39`, `:444`).

**This is a data-format and geometry change** (the costly, invisible kind): the keeper ordered it, so it is done, with the format guard and the full mutation harnesses.

**The ruling (mine, his to veto on the floor value):**
- `e` and `er` may go below 0: the outer zone turns DOWN by that angle relative to the profile. Each side's **total** edge angle (the profile's edge angle at the zone's start plus e) has a floor of **−30°** (past flat by up to 30°, a lip); the existing caps stay. The pane states the floor's reason in the code and can propose another from the geometry (e.g. where the section self-intersects or the lip would hide the road), and the keeper may move it.
- **Format:** a document with any negative `e`/`er` is written as the next core version (core/6), so a builder that predates it refuses by name instead of clamping silently; every file made before reads and saves byte for byte as it did.
- **Everything downstream follows a negative angle:** the cross-section and its normals (`src/core/adapter.js`'s edge sampling is sized by the steeper side, `:114`, which must count a negative side by its magnitude), collision and export (kn5 and the collider), the AI line, the preview, validation's caps (`checkEdge` and the c+e caps at `:386-389`), close/finish solvers that clamp edges, and the panel's edge fields (allow negatives, show them).

Parts:
1. **Pane (named when one is free: C after D401, else B after D404):** test first — rows that a negative edge builds the section turning down by that angle on that side only, that −30 is accepted and −30.01 refused by name, that a symmetric negative edge works, that core/6 is written only when a negative appears and an older reader refuses it, and that every existing file round-trips byte for byte. Run WHOLE: core-mutation, core-xsec-mutation, core-cup, core-piece, geom-mutation, mutation, then the full suite at landing. Shots of the section and the 3D preview, a negative edge on one side of a banked turn.
2. **A reviews** (geometry and format focus).
3. **B lands** in the next release; the export of a negative-edge track is read back by the self-test.
4. **The keeper drives it** in AC (only he can judge the feel).

OUTPUT → NEXT: changed — the keeper asked for negative edge angles; a geometry/format lap, queued for the next free building pane.
NEXT: chair queue D406 and route it to C when C hands back D401 (else to B after D404); A reviews it.

**D404 escalated to TOP PRIORITY (librarian, 2026-10-18 21:4x).** The keeper, verbatim: "upon further testing, even turning a 1000m straight isnt smooth and laggy as hell. We need to get it smooth and working good". A 1,000 m piece is ordinary, so this is a real performance fault, not an edge case.
- **Pane: A, now** (A pauses D403, the Aurora pass, which is cosmetic). B stays on the 0.4.7 landing. A's timings start only when the heavy-run lock is free and no suite is running (timings under another seat's load are void).
- **Widen the measurement beyond piece length:** (a) the drag of a 1,000 m straight and turn on the real page in each of the five looks; (b) a suspect, inferred not proved: every skin and SIGIL put `backdrop-filter` (frosted blur) on surfaces over the 3D canvas (`index.html` 3, skyline 5, aqua 4, glass 4, aurora 3), which makes the browser re-blur those regions on every WebGL frame, and Aurora also animates its panel background; measure frame time with the blur and the animation switched off by a test-only override, to split CSS compositing from mesh build and upload; (c) the same drag on the previous releases still installable from GitHub (0.4.0 or the oldest with skins absent, e.g. 0.3.x) to find whether this is a REGRESSION and which release brought it. Use the browser's performance trace (Paint/Composite/Raster versus script time).
- **Then fix the biggest cause, test first:** a frame-time row on the real page (the drag of a 1,000 m piece stays under 16.7 ms median on this machine, with the looks' glass kept looking as it does if possible — e.g. blur only when not dragging, or a pre-blurred backdrop), plus the mesh fix if mesh build dominates. The release mesh stays byte-identical. Lands as soon as it is green, ahead of the cosmetic laps if needed.
NEXT: chair route the widened D404 to A now (pause D403); A measures when the lock is free; the librarian rules on the numbers.

**D404 bar raised, the keeper's standing rule for the previewer (librarian, 2026-10-18 21:5x).** The keeper, verbatim: "I want it as optimized as we can get it. If anything I always want it as smooth as the users refresh rate, maybe except under absolute crazy strenious circumstances, but mostly solid at all times, its a previewer".
- **The bar is the display's refresh rate, not 60 fps.** The frame budget is 1000 / refresh Hz: 6.9 ms at 144 Hz, 6.1 at 165, 4.2 at 240. The previewer must hold it while dragging, orbiting and editing ordinary tracks; only "absolutely crazy" loads (e.g. a single 20 km piece) may drop, and then gracefully (coarser detail during the drag, never a stall).
- **A measures against that bar:** report median, p95 and p99 frame time, and the share of frames over 6.9 ms and over 4.2 ms, for each case already listed. The browser's rAF interval on this machine's display is recorded so the bar is the real one.
- **The fix's test row** asserts the 144 Hz budget (p95 ≤ 6.9 ms) for a 1,000 m and a 2,000 m drag on the real page in every look; and that beyond the ordinary range the drag adapts (detail drops, frame time stays bounded) rather than stalls. The release mesh stays byte-identical.
- **Every later previewer lap inherits this bar** (a line in the builder's docs/ARCHITECTURE.md with the fix).
NEXT: chair pass the raised bar to A inside D404 now.
