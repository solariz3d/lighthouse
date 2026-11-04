# D282 part 2 (pane B): the Sharp turn's bar, registered, then checked blind against E's branch

## 1. Registration: committed before E's hand-back
- **File:** `exo_memory/loop/sharp_turn_registration_2026-10-09.md`.
- **Commit:** `e45ed2e7` on lighthouse branch `b-sharp-reg` (worktree `C:\Users\nname\Desktop\worktrees\b-sharp-reg`, from main `ca8c69df`, not
  pushed), committed 2026-10-10T02:46:51Z. An identical copy is in the shared checkout.
- **Digest:** sha256 `f513d4fc1d9b67d8401c97dac31afbcf1cd9d83458fe279d0213ac3dfb5a30ce`.
- **Rows S1–S7,** each with its measurement method, from plan lines 29–39 and my §3:
  - S1, S2: R 22 / width 24 and R 24.25 / width 45. Heading within 0.05°; the last 50 m within 0.01°; entry and exit 10–90% each ≤ 8 m; no red
    or amber at 970 km/h.
  - S3: angles 45°, 90°, 135° and 180°.
  - S4: the minimum-radius refusals. Width 45 R 24.0 refused, naming a radius within 0.25 m of 24.25; width 24 R 14 refused, within 0.5 m of 15;
    the track unchanged.
  - S5: every saved track (copies) rebuilds identical to `bf0f333`, and the suite is green.
  - S6: save, reopen and Undo (D272).
  - S7: the AC export has no ray gaps, and the `cmcheck.js` read-back reports `BAD = []`.
- **Two falsifiers** are registered beside the rows:
  - the bar must fail today's broad turn;
  - my harness must reproduce §3's knots rows on `bf0f333`, or the check is void.

## 2. Blind check: E's Sharp, t180 `8639987` on `3025a5e` (branch `d282-sharp`), scored against the registration as written
**How:**
- **Source:** a read-only `git archive` of `8639987` in pane B's scratchpad.
- **Interface read:** only `shell.extendSharp(opts, { deg, R, ramp })` (the `app/core/coreshell.js` diff), `src/core/sharp.js`'s header and
  `tightestSharp`, and the panel's three new fields. **E's tests were not read.**
- **Harness:** B's own, `d280/knots.js`'s method, now `blind.js`. Every row runs through the app's core shell and validation controller at full
  speed (970 km/h), on the registered track: a 200 m straight, Sharp with ramp 4, then the app's Straight.
- **Falsifier 2 holds:** on `bf0f333` the harness reproduces §3's knots rows exactly (`tr` 4 / `knotM` 2: −89.99° to −90.00°, 1.9–2 m, 0.000°, no
  red or amber).
- **Evidence:** the scripts, the raw outputs and the S1 track are in `exo_memory/handback/p-sharp-check-B_2026-10-09_evidence/`.

| row | result | numbers |
|---|---|---|
| **S1** (R 22, W 24, 90°) | **PASS** | H −90.0000° (error 0.0000°); E50 0.0000°; entry 0 m, exit 2 m; R built 22.00; no red, no amber |
| **S2** (R 24.25, W 45, 90°) | **PASS** | H −89.9998° (error 0.0002°); E50 0.0000°; entry 0 m, exit 2 m; R built 24.25; no red, no amber |
| **S3** (R 22, W 24) | **PASS ×4** | 45° → 44.9998°; 90° → 90.0000°; 135° → 135.0000°; 180° → 179.9998°. E50 0.0000° on each; red and amber (reported) none |
| **S4a** (W 45, R 24.0) | **PASS** | refused: "SHARP_TOO_TIGHT: R 24 m is too tight for this width (stacked-within-2m): tightest at this width: 24.2 m". 24.2 is within 0.25 of 24.25 (0.05); the track is unchanged (canonical text identical) |
| **S4b** (W 24, R 14) | **FAIL, as registered** | R 14 was **accepted**, not refused. Per the librarian's ruling, the anchor "within 0.5 m of 15" was the librarian's error, carried over from my broad-build figure; it is not E's |
| S4 reported, not scored | | R 24.25 at W 45 accepted; R 15 at W 24 accepted |
| **S5** (today's curve unchanged) | **PASS** | All 12 saved-track COPIES rebuild identical on `8639987` and `bf0f333`: segment JSON sha256 equal and station positions equal (≤ 1e-9 m), 12 of 12 (`s5_compare.json`). Full suite on `8639987`: **2,673 tests, 2,658 pass, 0 fail**, 8 skipped, 7 todo (the known round-trip reader finding and the preview paint list; `suite_summary.txt`; 1,570 s under the lock) |
| **S6** (save, reopen, Undo) | **PASS** | after save and a fresh shell's open: the document is identical and the path is identical. One Undo returns the pre-Sharp document (both Sharp pieces go in one step) |
| **S7** (AC export) | **PASS** | S1 track as a TEST export (it is open, as Install does): the exporter's own validation with the exported road mesh lists **0 red findings**, so no `downforce-ray-gap` (`s7warn.json`). `cmcheck.js` read-back **`BAD = []`**: 10 meshes, max 19,266 vertices, 2 pits = `ui_track` pitboxes, 4 starts, the ROAD key drivable. Note: 1 physics-named mesh matches no surfaces.ini key (`1WALL_T180_END`) |

**Score as registered: 6 of 7 rows PASS; S4b FAILS** (the librarian's anchor, per the ruling).

**Beside S4, its own line: Sharp's real limit at W 24.**
- **E reports about 13.4 m, and that holds, within 0.1 m:**
  - the core's `tightestSharp` at W 24 returns **13.4**;
  - R 13.4 is green (H −89.9997°, E50 0.0000°, 1.8 / 2 m);
  - R 13.2 and R 13.0 are refused: "SHARP_TOO_TIGHT … (load-above-proven): tightest at this width: 13.4 m". The track is unchanged.
- **One detail:** R **13.3** is also accepted, and green (H −89.9999°). So the edge the refusal applies lies between 13.2 and 13.3, while the radius
  it names is 13.4. A person told "13.4" could go 0.1 m tighter. This is consistent with `R_RES` 0.05 and a name rounded to 0.1 m. Not scored; for
  E to judge.

**Ruling 3, the readout-vs-drawn-path gap, by my own measure (`gap2.json`):**
- the panel readout (`src/core/readout.js` `pieceReadout` turnDeg, the two Sharp pieces) runs **0.086–0.105°** past the drawn path, at 90°, 45°,
  135° and 180°;
- the drawn path is within **0.0002°** of the typed angle.

That is within E's reported 0.07–0.14°. Accepted, as ruled: Sharp solves on the path.

## Corrections (mine)
- **W1:** my harness's S4 parse took the first "N m" in the refusal message, which is the R typed ("R 24 m"), not the tightest named ("24.2 m"). S4a's
  pass does not change (|24.2 − 24.25| = 0.05), and the table above scores from the named value read from the message. S4b is unaffected (nothing
  was refused).
- The saved tracks used were COPIES. Their sha256 is identical before and after the run (checked); the keeper's files were not touched.

NEXT: chair land d282-sharp (8639987) when the librarian has read this; S4b's anchor is the librarian's to amend
