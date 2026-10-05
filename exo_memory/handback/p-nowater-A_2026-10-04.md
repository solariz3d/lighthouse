# p-nowater-A — D238: the water sim removed from the builder. Written by pane C, finishing pane A's work after A's runtime crashed. 2026-10-04, on D

**Commit `8ff414be3f0d40edffcee21ed29726b613e53779`** in `C:\Users\nname\Desktop\worktrees\a-nowater-wt`:
- on t180 main `fa5fd937`; not pushed;
- 12 named paths, all A's lines; the commit body names A and C;
- `src/` and `test/` untouched.

| file | sha256 (first 16, `git show HEAD:<path> \| sha256sum`) |
|---|---|
| `CHANGELOG.md` | `88157bbc2ced2db5` |
| `app/README.md` | `975a6408735021ef` |
| `app/core/coreshell.js` | `24e22b979dcdde11` |
| `app/core/panel.js` | `aaa54d795f253432` |
| `app/index.html` | `ffa8d6a590ba4e16` |
| `app/preview/index.js` | `2696bc784710cd9d` |
| `app/preview/preview.js` | `f2897d79b74f2eb2` |
| `app/preview/renderer.js` | `4e16a9a620a62edf` |
| `app/test/core-mutation.test.js` | `2c290fa378b9dc17` |
| `app/test/core-readout-display.test.js` | `1df8ee261fd6d521` |
| `app/test/core-shell.test.js` | `94c8d84c1697941d` |
| `app/test/guides.test.js` | `6134cf4560f3bdf7` |

## Whose is what

- **A's: every line of the diff, and every test run before the crash.** C changed no line of A's.
- **C's:**
  - the read of the diff against the plan;
  - the read of A's finished runs;
  - the stuck-lock check;
  - a real-window check of this tree's own build;
  - the base comparison for the one page error;
  - the commit;
  - this hand-back.

## 1 · The lock: pid 26340 was NOT hung

At 22:57, 33 minutes into the hold, pid 26340 ("A D238 anchored harnesses", A's `sp_harn3.js`) was alive. Its process tree showed the
second harness running mutants: a mutant child started at 22:57:14 with 14.6 s of CPU. **I did not stop it.** It finished on its own
(gone at 23:15), and the lock passed to my queued build.

## 2 · A's diff against the plan: complete, nothing missing

- **Nothing about water is left in the app.**
  - Removed: the Water section (on, km/h, streams), `shell.pour`, `clearWater`, `state.water`, the `water: null` resets, the 120 ms pour
    debounce, `overlayOf`, the `t180:overlay` event and its listener, `setOverlay`, `waterRun`, `redText`, the water's red list, and the
    `require('../../src/core/water.js')` in coreshell; the page tooltip and the README rows were updated.
  - A's new test walks every non-test file of `app/` for `water|pour|setOverlay|t180:overlay`, and finds none.
  - `.reds` in `app/index.html` stays: the export's refusal list uses it (`index.html:189`, `:272`). It is not the water's.
  - The renderer's overlay pass stays: D237's mirror ghost draws through it.
- **`src/core/water.js` and its tests are kept, dormant:** no file under `src/` or `test/` is in the diff.
- **The app's water tests were removed by name** (`app/test/core-shell.test.js`):
  - "water: poured over a window of the preview's path, every stream drawn and every red in plain words";
  - "a successful edit retires the water (it was poured on the old track)";
  - "water stops at a jump's flight and says so (the flight is not modelled)";
  - "redText: each red in plain words, with where it is";
  - and the water half of "landed core: a 1 m hill brushed in the app…" (its pour assertions; the hill half stays).
  - In `app/test/guides.test.js` row 11b, the assertion that a water overlay draws beside the mirror ghost is gone with `setOverlay`.
    The mirror ghost's own drawing is still asserted in row 11 (`guides.test.js:163-164`), so no non-water property lost its guard.
- **Harness anchors retired by name** (`app/test/core-mutation.test.js`):
  - C6 "an edit keeps the old water";
  - C9 "the water runs on across a jump's flight";
  - C10 "a spill names the wrong edge";
  - C11 "a shock is drawn nowhere";
  - C13 "the overlay draws points, not line pairs".
- **The new no-water test** (`app/test/core-readout-display.test.js`):
  - the panel's sections are exactly Equation track / Extend at the head / Brush / Close / Local example;
  - no control, label or tooltip names water, streams, pour or design speed;
  - no `pour`, no `clearWater` and no `water` in the state;
  - an edit sends no `t180:overlay`, and nothing listens for `t180:track`;
  - no `overlayOf`, `waterRun` or `redText` exports;
  - the app-wide file walk.
  - It has a real control: it dispatches its own event and checks the spy saw it.
  - An earlier draft's control was always true (`… || sent.length >= 0`, A's `t_nowater.txt`, 22:07:10). The committed file (22:07:34)
    has the real one, and every run below is from after 22:08:33, when all 12 files were final (file mtimes).
  - **Red first:** on the base it fails on the Water heading (A's `nowater_on_base.txt`).
- **Fixtures 0 of 9:** "row 5a (amended D196): against the D196 baseline every fixture renders identically: "0 of 9 differ"" passes in
  A's full suite.

## 3 · A's finished runs (read from A's scratchpad, not re-run)

Paths: `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\`.

- **Full non-mutation suite** (`sp_full_nowater.txt`, 22:23:59, A's `sp_full.js`, serial under the lock): **1,757 tests · 1,743 pass ·
  0 fail · 7 skipped · 7 todo.**
- **The seven anchored harnesses** (`sp_harn3_out.txt`, 22:23 → 23:15, A's `sp_harn3.js`); all exit 0, with 0 NOT APPLIED and 0 NOT
  CAUGHT / SURVIVED:

| harness | tests (control + mutants) |
|---|---|
| `app/test/mutation.test.js` | 99 |
| `app/test/core-mutation.test.js` | 60 (my D225 count was 65; minus the 5 retired) |
| `app/test/core-xsec-mutation.test.js` | 31 |
| `test/core_chord_mutation.test.js` | 16 |
| `test/core_cup_mutation.test.js` | 51 |
| `test/core_xsec_mutation.test.js` | 60 |
| `test/core_water_mutation.test.js` | 20 (the dormant module still holds) |

## 4 · The real-page check (mine)

- **This tree's own build:** `cargo tauri build --debug --no-bundle`, with `CARGO_TARGET_DIR=…\Temp\c-nowater-target`, under the lock.
  It finished in 1 m 04 s. `build.rs` copies this tree's `app/` and `src/` into `src-tauri/dist`.
- **The window**, driven by my `nowater_window.js` (A's `d224_window.js` pattern, my scratchpad `nowater/`):
  - launched with our own DevTools port, checked to be ours, and the keeper's autosave guarded and restored ("restored");
  - **headings, before and after:** Equation track · Extend at the head · Brush (drag on the track) · Close · Local example. **No Water.**
  - **no visible text, aria-label or title anywhere on the page** matches `water|pour|streams?`, before or after;
  - Extend pressed twice (real mouse events): "2 pieces · 200 m · open";
  - **page exceptions: one, on Close the loop:** `denseSolve: singular constraint system` (`tools/piecewise.cjs:216` ← `close.js:224`).
    No console errors.
  - Report: `nowater/win/window_report.json`.
- **That exception is PRE-EXISTING, not A's.** My `closeprobe.js` runs the same sequence headless: two default 100 m Extends, then
  Close. On this tree and on a fresh worktree at the base `fa5fd937` (`c-nowater-base-wt`), both give the same result:
  `threw "Error: denseSolve: singular constraint system"`, message null, still open.
  - **FINDING, for the core's owner:** `close()` throws a plain Error on a lap of two straights. The shell's `attempt()` passes on only
    CoreErrors, so the user sees nothing at all. It needs a CoreError (a named refusal such as "nothing to close yet") or the shell
    catching it.
  - A's removal did narrow `attempt()` (the water's `WaterError` and `^water:` cases went with the water), but this error matched none
    of those before either.
- **The build rewrote `src-tauri/Cargo.toml` with LF endings, as A's D224 hand-back recorded.** The content is identical (CRs stripped,
  both sha256 `49a88626e7dbdd5d`), so I restored it with `git checkout --`. It is not in the commit.

## 5 · What deleting `src/core/water.js` would take (the keeper's call; nothing done)

`git grep -n "core/water\|water\.js"` over the tree, CHANGELOG aside:
- **Delete:**
  - `src/core/water.js`;
  - `test/core_water.test.js`;
  - `test/core_water_adapter.test.js`;
  - `test/core_water_mutation.test.js`.
- **Edit:**
  - `test/validate_xsec.test.js`: the `require` at `:13`, and the test "S2 (iv): water over a heartline offset is refused BY NAME
    (WATER_HEARTLINE)" at `:123`. **That retires a sealed row of the cross-section seal (S2 iv)**, so it needs a dated seal amendment,
    not a silent deletion.
  - `test/core_xsec_mutation.test.js:67`: row KS2-5 "water over a heartline is an anonymous throw", which anchors in water.js.
  - `src/core/README.md:14`: the `water.js` row.
- **Optional:** `.claude/skills/track-equations/references/06_surfaces.md` §8 "The water's laws" is documentation of maths with sources,
  and can stay.
- **Not affected:** `test/core_chord.test.js` row 4 and `test/core_cup_readers.test.js` name "the water" but test the shell's
  `profilerOf`, which stays in `app/core/coreshell.js`. At most their names would change.

## What I did NOT verify

- **I re-ran none of A's suites or harnesses.** The figures above are A's logs, read whole. They were made after A's last edit (mtimes).
- **The real window was one sequence:** load, two Extends, Close. It did not cover a brush drag, export, or the pieces mode.
- **No AC launch, no push.**
- **Three worktrees for the chair to remove after landing:** `a-nowater-wt` (the commit) and my scratch `c-nowater-base-wt`. The build
  target is at `…\Temp\c-nowater-target`.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_remove_water_2026-10-04.md · C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\sp_harn3_out.txt

NEXT: librarian call_librarian with the pointer when the hand-back is written — plan default after it: B's quick look, then D239, unless the output says otherwise
