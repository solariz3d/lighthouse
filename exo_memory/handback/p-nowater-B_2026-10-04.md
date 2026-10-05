# D238 the water sim removed from the builder: B's quick non-author look (FEEL tier)

Pane B, D, 2026-10-04. `8ff414b` (A's diff, committed by C after A's crash; parent `fa5fd93`, 12 files, +57/−164), checked out in my own
fresh worktree `C:\Users\nname\Desktop\worktrees\b-nowater-wt` (detached at `8ff414b`, 0 links). Nothing written in `a-nowater-wt`.
Every node run under the heavy-run lock, `--test-concurrency=1`, in short turns (C on D239). No AC launch. Nothing committed. Nothing
pushed.

## VERDICT: **GREEN. Land `8ff414b`.**

## 1. No water left in app/, and src/core/water.js dormant with its harness green: **confirmed.**

- A's no-water test (`app/test/core-readout-display.test.js`: the panel's sections, the shell's state and exports, no `t180:overlay`, and
  the file walk of every non-test file of `app/` for `water|pour|setOverlay|t180:overlay`) **passes**.
- **It has teeth:** in a temp copy, one planted line, `const waterOn = null;`, in `app/core/panel.js` makes it fail (pass 32, fail 1).
- **`src/core/water.js` dormant and green:** no file under `src/` or `test/` is in the diff. `test/core_water.test.js`,
  `core_water_adapter.test.js` and the cross-section seal's **S2 (iv)** row ("water over a heartline offset is refused BY NAME") pass. **The
  water harness `test/core_water_mutation.test.js`: 20 tests, 20 pass, 0 fail** (the control + 19).
- What was kept is right: `profilerOf` stays in `coreshell.js` (the chord and cup reader tests use it, and pass); `.reds` stays in
  `index.html` (the export's refusal list); and the renderer's overlay pass stays, now fed only by the D237 mirror ghost
  (`overlay: plan.over`). Guides row 11 still asserts the axes and the ghost are drawn on top (`lm >= l3 + 4`).

## 2. The retirements are honest: **no surviving non-water code lost its guard.**

**The 5 core-mutation anchors** (`app/test/core-mutation.test.js`): each anchored a line that no longer exists, in code that was removed
with the feature:

| anchor | the line it planted in | after the diff |
|---|---|---|
| C6 "an edit keeps the old water" | the `water: null` field of the commit's `set(...)` | the field is gone. The rest of that `set(...)` (`dirty`, `message`, `lastStep`) is unchanged and was never this mutant's to guard. |
| C9 "the water runs on across a jump's flight" | `waterRun` | the function is removed |
| C10 "a spill names the wrong edge" | `redText` | removed |
| C11 "a shock is drawn nowhere" | `pour`'s shock placement | removed |
| C13 "the overlay draws points, not line pairs" | `panel.js` `overlayOf` | removed (the panel's overlay with it) |

Every anchor I parse in the trimmed harness still occurs exactly once (`anchors.js`: core-mutation 31 parsed single-edit entries,
core-xsec 30, chord K13 1). A's log has the full harness at control + 59 (60), 0 NOT APPLIED; I did not re-run the 60.

**The 4 retired app tests plus the halves** (`app/test/core-shell.test.js`, `guides.test.js`): "water: poured over a window…", "a successful
edit retires the water", "water stops at a jump's flight", "redText…", the pour half of "landed core: a 1 m hill…" (its hill half stays
and passes), and guides row 11b's water-overlay assertion. Each one asserted the water, and nothing in them guarded remaining code. The
one shared mechanism, the overlay pass, is still asserted by row 11 through the mirror ghost.

**One narrowing to know, not a defect:** `attempt()` now passes on only `CoreError` (it also passed `WaterError` and messages starting
`water:`). Nothing left in `app/` can raise those, because `water.js` is no longer required there. C's finding still stands: `close()`
on a lap of two straights throws a plain `Error` (`denseSolve: singular constraint system`), and `attempt()` re-throws it, so the user
sees nothing. It was pre-existing at `fa5fd93` too (C showed both trees); owner: the core.

## 3. Fixtures and protected paths: **clean.**

`git diff --stat fa5fd937 8ff414b -- src app/export test/fixtures src-tauri` prints nothing. **Row 5a "0 of 9 differ"** in my targeted
run.

## 4. Re-run (targeted only, as asked), under the lock

    node --max-old-space-size=4096 --test --test-concurrency=1 app/test/core-readout-display.test.js app/test/core-shell.test.js app/test/guides.test.js app/test/preview.test.js app/test/core-xsec.test.js test/core_water.test.js test/core_water_adapter.test.js test/core_chord.test.js test/core_cup_readers.test.js test/validate_xsec.test.js test/core_cup_fixtures.test.js
    NODE_OPTIONS=--require serial-shim.js node --max-old-space-size=4096 --test --test-concurrency=1 test/core_water_mutation.test.js

**238 tests · 238 pass · 0 fail · 0 skipped · 0 todo**, and **20/20** for the water harness. A's full-suite figure (1,757 / 1,743 / 0 fail)
is A's log; I did not re-run it.

## What I did NOT verify

The full suite and the other anchored harnesses (A's log), the real window (C's), the pieces mode, AC, and machine L.

Outputs: my scratchpad `nowater/` (targeted.out, watermut.out).
