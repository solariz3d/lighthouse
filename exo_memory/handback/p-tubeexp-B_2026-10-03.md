# D226 tube export fix, B's quick non-author look (export tier, no full suite)

Pane B, D, 2026-10-03. A's `c37bcc3` + `09f3fcc` on `90c1a3e` (`a-expdir-wt`, read only). I re-applied them in my own worktree
`C:\Users\nname\Desktop\worktrees\b-tubeexp-wt` (detached, `90c1a3e` → `fedfe2e` → `29466dc`, no conflicts, 0 links, `reads/` copied).
No AC launch. Temp folders only. Nothing committed beyond the cherry-picks in my worktree. Nothing pushed.

## VERDICT: **GREEN.** Land `c37bcc3` + `09f3fcc`.

Nothing blocks. Three nits for A (below), none in the keeper's path.

## 1. The sealed row: core_cup_export row 4 (iii). **Ruled: an intended requirement change, not a weakened test.**

- **What the D190 seal row protected** was "refused by name at the grid, **not by a crash**". The refusal was the only
  named outcome the grid had then, so a refusal was not the point in itself. The keeper's tube cannot export unless a
  floor that fits one slot gets a grid, which is exactly ruling (b). So the expectation moves with the requirement.
- **The refusal by name is not lost, it moved:** a floor that fits no slot still throws `NO_START_STRAIGHT` "too narrow for even
  one grid slot", pinned by `export_tube_grid` row 2 (a 20 m tube, a 1.67 m floor).
- **It is still a real assertion. Checked by planting, in temp copies of my tree, each edit applied exactly once
  (`scratchpad/tubeexp/plants.js`), with the control clean:**

| plant | row 4 (iii) |
|---|---|
| P1: the fallback removed (the old refusal comes back) | **caught** (fail 1) |
| P2: the fallback made silent (no amber note) | **caught** |
| P3: the single column put 6 m off the centreline | **NOT caught by this row** |
| P4: the floor read too narrow everywhere (the M34 shape), against `core_cup_readers` "marker layout" | **caught** |

- **P3, said plainly.** On a 4.45 m floor, u = 6 m puts the column on the 150° cup wall. Row 4 (iii) still passes, because
  its "every marker check ok" assertion does not test where a slot stands. Run against the other grid tests, P3 IS caught
  (`plants3.js`: export_tube_grid, markers, markers_export, markers_track, export-layouts, app export, markers-panel → 2 fail,
  control 84/84). So the defect is guarded, but **"every marker check ok" carries less weight than it reads: the marker
  checks do not flag a grid slot standing on a wall.** inferred: that gap predates D226 (the checks are not in this diff).
  Owner A, if a slot-on-floor check is wanted. Not a blocker.

## 2. 09f3fcc (M34): **stronger, not weaker.**

It only ADDS one assertion (`[pattern, colGapM]` = `['2-staggered', 6]`) after the existing `doesNotThrow` and "a layout came
out". Nothing was removed. It restores what the fallback had taken from "does not throw": a layout that read the turn's 150°
floor now comes out `1-column`, and this line fails on it (my P4 caught).
**Cup harness on my tree: control ✔ + 50 mutants, 50 caught, 0 NOT APPLIED, M34 "applied, and caught by marker layout"**
(51 tests, 51 pass). A's hand-back says "59 tests, 59 pass, the control plus 50 mutants". Those two numbers do not agree
(control + 50 = 51), so A's 59 is a count slip. What it describes is what I measured.

## 3. (a) The folder: **the path logic cannot reach anything deeper, or a sibling.** By reading, then pinned by A's tests

- **JS `directChild`:** it matches only when the LAST three components are `content`, `tracks`, `<name>` (`parts.length === i + 3`),
  so anything deeper is null, and so is `content\tracks` itself. `resolveTarget` acts only on an `AC_INSTALL` refusal, only when
  `folderIsEmpty` answers exactly `true`, and only when the parent passes the same `checkTarget`. That refuses
  `…\content\tracks\content\tracks\Foo`, because the parent sits inside the track folder "content" (A's N4 case).
- **Native:** `direct_foreign_track` applies the same rule, case-insensitive, `t180b_` excluded. `is_empty_foreign_folder` also needs
  a real directory (`symlink_metadata`, not a link) and `read_dir` empty. Removal is `fs::remove_dir`, which never deletes
  contents, so a sibling or a parent is never named. The target is the picked path itself, and only once all three checks pass.
  Native re-checks right before the rmdir, so a folder filled between the check and the removal is refused (and rmdir would
  refuse it anyway).
- **Removal only after a successful write** (both shells call `removeEmptyNote` after `out.result`). A red leaves the empty folder.
  A disclosed this and I agree with the choice.
- **Nit (owner A), inferred, not run:** a hand-typed name of `.` or `..` passes both path checks (`content\tracks\.` is
  "directly in content\tracks"). `..` can never be empty (it contains `tracks`). `.` would resolve to `content\tracks` itself, and
  only an EMPTY `content\tracks` could then be removed. That's an AC install with no tracks at all, and rmdir loses no data. The
  folder picker never returns those spellings. Still, refusing `.` and `..` by name on both sides is one line each.
- **The two native commands:** `src-tauri/build.rs` defines no app manifest, so app commands are not individually permitted, and
  `write_export` already works under the same `capabilities/default.json`. inferred: `folder_is_empty` / `remove_empty_folder` are
  callable in the window. I did not run the window.

## 4. (b) The grid: **the existing two-column cases are identical.** By construction and by the fixtures

- **By construction:** when `colGapM / 2 > SLOT_HALF_WIDTH`, the grid object is built with the same fields in the same order as
  before. `gridSlots`' two- and three-column branch is unchanged. The new amber note fires only for `1-column`.
- **Byte check, run:** `core_cup_fixtures` on my tree → **row 5a "0 of 9 differ"** against D196 and the D222-amended seal manifest,
  with the teeth control ("1 of 9 differ" on a planted digest). The nine fixture exports, kn5 for F1 and F2 included, are byte
  for byte as before.

**Targeted (11 files, under the lock, `--test-concurrency=1`): 136 tests · 136 pass · 0 fail · 0 skipped**:

    node --max-old-space-size=4096 --test --test-concurrency=1 test/core_cup_fixtures.test.js test/core_cup_export.test.js test/core_cup_readers.test.js test/export_tube_grid.test.js test/export-layouts.test.js test/markers.test.js test/markers_export.test.js test/markers_track.test.js app/test/export.test.js app/test/core-shell.test.js app/test/markers-panel.test.js
    NODE_OPTIONS=--require serial-shim.js node --max-old-space-size=4096 --test --test-concurrency=1 test/core_cup_mutation.test.js

## 5. A's "Not verified": **no blocker.**

- The window callability of the two commands: inferred fine (3). The librarian's real export of T-180 TUBE OVAL is the plan's
  next step and will exercise them, so a failure there shows at once and costs nothing.
- The full suite and the other harnesses: not re-run, per the packet. But the diff touches files other harnesses anchor in,
  checked by grep: `core_cup_mutation` (layout.js, run, green), `core_chord_mutation` K13 (coreshell.js), app `core-mutation`
  (21 anchors in coreshell.js, 1 in export.js) and app `core-xsec-mutation` (coreshell.js). A moved anchor would read NOT
  APPLIED, so I counted them on my tree (`scratchpad/tubeexp/anchors.js`, under the lock). **Every anchor parsed occurs exactly
  once:** K13 1; core-xsec 30 of 30; app core-mutation **31 of its 64 entries** (the single-edit form my parser reads). The other
  33 were not counted, and those harnesses were not run.
- How a single column of cars looks at the AC start: the keeper's, row-G-like.
- **The one behaviour the keeper may still meet:** if his export reds, the empty folder stays, and Content Manager still lists it
  as damaged. That is A's disclosed choice, not a defect.

## Nits for A (none blocking)

1. Refuse `.` / `..` as the folder name on both sides (3).
2. `src/markers/layout.js`: the comment in `defaultLayout` says "the floor clears a slot's half width by the same 0.5 m margin",
   but the code uses `ONE_SLOT_MARGIN_M` = 0.1 (and that constant's own comment says 0.1). The comment is stale.
3. The cup-harness count in A's hand-back: 51, not 59 (2).

## Corrections, mine

- My first targeted run and plants run **gave up after 30 min on the lock** (E's D226 suite profile held it). Per heavy-run's rule
  they did not run anyway. I re-ran both once the lock was free. The cup harness waited and then ran normally.

## What I did NOT verify

The full suite and the harnesses other than cup; Rust (`cargo test` not re-run, so A's 16/16 stands unchecked by me); the real
window; any real export into an AC install (temp folders only, no AC); the `.` case (inferred, not run); a release build;
machine L.

Outputs: my scratchpad `tubeexp/` (targeted.out, plants.out, plants3.out, cupmut.out, plants.js, plants3.js).
