# p-tubefromcup-E · D274: a tube projected off a cup road "bugs the track, then turns into a tube" · pane E, on D, 2026-10-08

## REGISTERED BAR (written 14:5x, BEFORE any fix; the cause is below)
On a COPY of FIRST TRACK (head: the cup road, c 33.4°, w 35), extending a tube (sweep 360, width 35) at 125, 250, 500 and 1000 m:
1. **Nothing placed moves:** every segment of the placed track is byte-identical with and without the tube ghost. Today 5 segments (the cup's last 10 m) change, by up to 17.9° of surface angle.
2. **The handover is seamless:** the tube's first mesh row is the cup's last mesh row (≤ 1 mm). The centre stays on the drawn curve (≤ 1 cm), with no self-intersection or stacking in the piece and no red in it.
3. **Everything else is unchanged:**
   - the fixtures (0 of 9);
   - a cup followed by a LEGACY road still fades as before, byte for byte (that is the tail rule's purpose);
   - extensions that are not a cup → tube or cup → edge handover give the same segments as today.

## THE CAUSE, named with numbers: none of (a), (b) or (c). It is the TRACK: the cup's tail fade took the tube for a legacy road
- **The rule:** `src/core/adapter.js toSegments` fades a cup piece's last 10 m into the NEXT piece's first profile when that piece `!nextP.cup` (the D190 R3 tail rule, written for a cup followed by a legacy road). A tube is not a cup, so it got the fade.
- **What that did:** `legacyFirst(nextP)` renders the tube piece as a LEGACY bowl. So, measured on the copy (scratch `tubecup/placed.js` → `placed.txt` sha256 `a9f7b700…`):
  - **adding the tube CHANGED the PLACED track:** 5 segments, the cup's last 10 m (s −10 … 0 from the head), by up to **17.9° of surface angle**;
  - the 33.4° cup ended at the bowl's **15.5°** edge, and the tube's own morph (`xsecSegments`, `MORPH_M`) then grew out of that bowl (`tubecup/dbg_base.txt`: the tube's first segment blends from a 15.50° bowl).
  - That is "bugs the track, and then eventually turns into a tube".
- **The controls:** extending with a plain road, or cup 0, changes 0 placed segments.
- **Ruled out, with numbers** (scratch `tubecup/repro.js` → `repro.txt` sha256 `ed2029f1…`, base `85fafff`, sweep 360, w 35):

| length | sweep t | centre off the curve | self-check (inter/stacked/folds) | cheap ghost (inter/stacked/folds) | reds in the piece |
|---|---|---|---|---|---|
| 125 | 66.8 → 360.000 (max at the end, no overshoot) | 0.0000 m | 0/0/0 | 0/0/0 | none |
| 250 | same | 0.0000 m | 0/0/0 | 0/0/0 | none |
| 500 | same | 0.0000 m | 0/0/0 | 0/0/0 | none |
| 1000 | same | 0.0000 m | 0/0/0 | 0/0/0 | none |

  - **(a) the cheap ghost:** it only thins the tube's row grid (every 12th column of the full ghost's, `app/preview/coarse.js`), so its vertices are a subset of the full ghost's. Its self-check is clean at every length. Not the cause.
  - **(b) a cup → tube fold or jump:** none at any length. And every sweep value on the way to 360 (0, 4, … 360, as a scrub or typing passes through them) is clean at 125 m and at 250 m (`scan.txt`, `scan250.txt`). Not the cause.
  - **(c) D268's heartline from a cup:** the centre is on the curve, 0 mm. Not the cause.
- A note on my probe: the first scan's 250 m pass died with exit 0xC0000005, at ~3.6 GB RSS, holding both lengths in one process. Run alone it finished clean, with the heap level at ~2.2 GB after warming, so no leak. That was my probe, not the app.

## THE FIX (`src/core/adapter.js`, one condition)
- The tail fades only into a next piece the LEGACY path builds: a road that is not a cup, not a tube, and has no edge.
- A tube or an edge piece is built by `xsecSegments`, which morphs out of the previous piece's OWN last profile itself.
- The closed-lap seam case (`seam && pi === lastRoad`, a cup at one end and a non-cup start) is UNCHANGED. A lap starting with a tube and ending in a cup may have the same misreading at its seam, but that is not reproduced or measured here; named as a risk, not fixed.

## AGAINST THE REGISTERED BAR (on the copy, after the fix; `repro2.txt` sha256 `5dfcea48…`, `placed2.txt` sha256 `81cdaa97…`)
1. **Nothing placed moves: MET.** With the tube ghost, **0 placed segments change** (was 5, 17.9°). Plain road and cup 0 still 0.
2. **The handover is seamless: MET.**
   - the tube's first profile is the cup's own end shape (33.40° against the cup's 33.4°, `dbg_new.txt`; row 2 checks ψ to 1e-6 rad at 41 points);
   - the validator's 1 mm `joint-step` is not red;
   - at 125, 250, 500 and 1000 m the self-check is 0/0/0, the centre is on the curve (0.0000 m), there are no reds, and the cheap ghost is 0/0/0.
3. **Everything else unchanged: MET.**
   - fixtures 0 of 9 (`core_cup_fixtures` in the targeted run);
   - a cup → legacy road still fades, pinned by the existing `core_cup_seam.test.js` "R3 (a) mirror" (green in the targeted run) and `core_cup_mutation` M41/M42 (their anchors untouched; that harness runs at landing);
   - an edge piece after a cup is ITSELF a cup piece (Extend keeps the kind), so it never had the fade: row 3 is a guard, green on both trees.

**Commit `707a863`** on t180 main `85fafff`, branch `d274-tubefromcup`, worktree `C:/Users/nname/Desktop/worktrees/e-tubecup-wt`. 3 files, +65/−1. Not pushed. **`coreshell.js` is not touched.**
- **Tests:**
  - `test/core_tube_from_cup.test.js`, 3 rows:
    1. adding a tube after a cup leaves every placed segment byte-identical at 125/250/1000 m;
    2. the handover is seamless: the tube starts from the cup's own end shape, with no self-intersection, stacking or red (joint-step included) and the centre on the curve, at 125 and 1000 m;
    3. an edge piece after a cup (a guard).
  - **Red first on `85fafff`:** rows 1–2 fail ("the placed cup's segments moved"; "the tube starts from the cup's own last profile"), row 3 passes. `tubecup/base.tap` sha256 `d6c1ed99…`; branch 3/3, `new.tap` `1d78eef1…`.
  - **My own fixes on the way:**
    - rows 2–3 first compared knot arrays (a weight-0 blend carries extra knots), then a cup segment's `profile`, which is one end of a blend PAIR, not the cup's end. The reference is now `cupProfile` at the piece's end values;
    - a row 4 that hand-built a legacy road after a cup was refused by the document's joint rule (Extend never makes that pair), so it was replaced by the existing seam rows.
  - **Targeted:** every `test/core_*` but the harnesses, every `validate_*`, export_tube_grid / merge, underskin, geom_mesh, and app **core-xsec**, cheap-ghost, preview-async, preview-speed, core-shell, core-readout-display. 48 files: **692 tests, 690 pass, 0 fail, 2 old skips**. `tubecup/build.tap` sha256 `9617447d…`.
  - **Not run:** the full suite, the xsec and cup harnesses (the librarian's at landing), and the real window.
- **The keeper's file and his `.t180undo` were never written:** copy only, sha256 `f3db94ab…`.

## Follow-up (the chair's 15:4x packet, test-only, on t180 main ddea381)
**Commit `d1bf901`** on `ddea381`, branch `followup-d274`, worktree `C:/Users/nname/Desktop/worktrees/e-fu274-wt`. 2 files, +4/−1. Not pushed. No row touched, no meaning changed.

**(1) core_cup M50 (R3), re-anchored:**
- D274 renamed the fade's condition to `nextLegacy` (a next piece the legacy path builds).
- The new anchor is `nextLegacy ? legacyFirst(nextP) : seam` (it occurs once in `src/core/adapter.js`), with the same edit, `false ? 0 : seam`: "a cup followed by a legacy piece inside the track is not faded (only the lap seam is)".
- **`test/core_cup_mutation` ONCE: 51/51, M50 "applied, and caught", nothing NOT APPLIED.** Scratch `fu274/cup.tap` sha256 `7ee01a50…`, 113 s.

**(2) core_jump's harness control, the missing file found:**
- Row 6 ("an OLD document jump opens as the free flight…") reads `test/fixtures/F7-hill-then-jump.core2.json` beside itself (`test/core_jump.test.js:215`).
- The harness made the copy's `test/` with the test file alone, so in the copy the read failed and the control reported that one row (1 !== 0), while the tree passed 22/22. That's pre-existing, as the librarian found on `4acbf4d`.
- The harness now copies `test/fixtures` into the copy (98 KB, 19 files, copied as the raw bytes the fixtures are kept as). Row 6 is untouched.
- **`test/core_jump_mutation` ONCE: 20/20, control green, nothing NOT APPLIED.** Scratch `fu274/jump.tap` sha256 `4524298b…`, 38 s.

Both were run serially under the lock.
