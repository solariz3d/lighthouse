# D222 — T-180: bring the Third Place's work and the parked ramp/chord fix together on main. Librarian, on D, 2026-10-03 07:2x.

The keeper, 07:15: "t-180 builder is good, but catch up on third places work with it".

## What the Third Place did (read in its transcript, 10-02 15:26 → 10-03 13:14Z; checked against git)
- **Clone:** `C:\Users\nname\Downloads\t180-track-builder`, branch `fix/ac-export-in-game` = main `dbb92b6` + 5 commits, 1 dirty file, NOT pushed:
  - `5debee8`: exported tracks work in AC. The car stays on the road (road flattened into world space, unique mesh names) and the road is
    lit (a grey `txDiffuse`).
  - `8c4eca3`: export welds piece joins (the sliver triangles at joins; the sharpest edge on the driven line went 167° → 0.34° by its
    measure).
  - `99e5205`: lap sim and speed picker capped at 970 km/h.
  - `bba2372`: layout. The right column is gone, validation sits under the controls, and the preview is wider.
  - `527ed0e`: X asks Save / Don't save / Cancel when there are unsaved changes.
- **It built and installed that branch** to `%LOCALAPPDATA%\T-180 Track Builder` (the keeper's shortcut). The keeper is driving the Third
  Place's build now, not the loop's.
- **Its suite was NOT green:** in its words, "everything's green apart from the four known failures: `BANK_RATE`, and the three row 5
  fingerprints". The export changes moved the seal's fixture fingerprints, and they were left red.
- **Not pushed** because of an open question about the keeper's email in public commits ("the no-email-before-push rule").
- **Its open items:** the loop CLOSE does not match start position + cross-section on its own; the ghost lap after a reset (the grid
  sits on a curve, about 42 m before the line); a second bump spot 127 m from any join; the keeper's FULL-PIPE cup idea.

## The loop's parked fix
`2f0883f` in `C:\Users\nname\Desktop\worktrees\b-d195-wt` (exists, checked: `git cat-file -t` → commit) = `dbb92b6` + D195 ramp (A) + D196
chords (A) + the "at start" UI (C). SUITE_PENDING since the 09-30 crash.

**Overlap, checked by diffing the two branches against `dbb92b6`:** the only shared file is `CHANGELOG.md`. The FIXTURES overlap in
substance, though: D196 re-baselined F4/F6/F8 via `test/fixtures/manifest.d196.json`, and the Third Place's export changes move the
fingerprints too.

## The lap (GEOMETRY tier: one serialized full suite at the end, `--test-concurrency=1`, mutation serialized, heavy-run lock)
1. **B** (built the combine; not an author of the Third Place's commits): a worktree `C:\Users\nname\Desktop\worktrees\b-d222-wt` off
   `527ed0e`, then merge `2f0883f`. Resolve CHANGELOG.
2. **B, the non-author review of the Third Place's 5 commits.** They had no second reader. Diff, tests, and the export claims
   re-measured where cheap (unique names, world-space road, a texture present, the weld).
3. **The four failures, resolved, not tolerated:**
   - `BANK_RATE`: is it red at `dbb92b6` too? If yes, it is pre-existing and recorded with its owner. If no, it is a regression and fixed.
   - Row-5 fingerprints: the export changes are intended, so re-baseline the way D196 did. Write a new manifest record
     (`manifest.d222.json`) with, per fixture, what changed and why. The PATH stays identical, and the before/after is measured.
     Never edit the sealed kit.
4. **ONE full suite**, serialized. All green, or the red goes back to its owner as one packet.
5. **The chair lands it on t180 main** (local). The push waits on the keeper's email answer.
6. **The librarian builds from a fresh worktree of main and installs** to `%LOCALAPPDATA%\T-180 Track Builder`. The keeper's shortcut
   then runs the Third Place's fixes plus the ramp, the chords and the "at start" boxes.

## Next laps, queued (the Third Place's open items), one at a time after D222
- **D223 loop close:** auto-close matches the start's position AND cross-section (the bump at spot A).
- **D224 ghost / grid:** the grid on a straight, and a reset lap that cannot set the best time.
- **D225 spot B:** the bump 127 m from any join, investigated from a replay.
- **The full-pipe cup:** a design for the keeper's read (the cross-section keeps curving until it closes; inverted driving).

NEXT: chair dispatch D222 steps 1–4 to B when this plan is read
