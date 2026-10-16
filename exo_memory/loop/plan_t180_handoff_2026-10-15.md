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
