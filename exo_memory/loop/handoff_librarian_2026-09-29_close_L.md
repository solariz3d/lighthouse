# Handoff — the librarian seat, on L, 2026-09-29 07:3x, at the keeper's "can we end the laps when it is done? We have to go in 30 mins"

Master for tonight: `loop/plan_t180_camera_readout_2026-09-29.md` (every collation, WRONG and queue item is there). This file
is the pointer set.

## t180 (github.com/solariz3d/t180-track-builder)
- main is unchanged at `1d68a86`.
- **Branch `l130-camera-readout` at `e4b0889`** (pushed 07:3x by the librarian): A's assembled tree
  (`C:\Users\zackn\AppData\Local\Temp\a-l130r-wt`). Camera feel + the readout + the DPI fix. Full suite 1,589/0, both mutation suites
  green. **Not on main**, because two non-author checks are still owed:
  - E's review of A's repair (it was mid-run at close);
  - B's M1–M6 score of the readout against E's seal `loop/readout_check_registration_2026-09-29.md` (sha256 57448e2a…).
  - When both are green, fast-forward main to it (or cherry-pick) and push. The keeper's desktop shortcut runs the rebuilder,
    which builds main.
- **L132** (the keeper's first-use feedback: Shift ramp ×4→×20; Enter/Esc/canvas-click blur, and number fields pass the camera
  keys; Ctrl+wheel = lens zoom, middle-click resets): A was mid-run at close, in its own scratch copy. Its state at close is in
  A's hand-back, if one was filed; otherwise in A's scratchpad `l132/`. It lands AFTER L130, as its own small landing.
- **The adapter roll fix** (B `p-l131-water-B`, C GREEN in `p-l131r-review-C`): queued, not landing. It is invisible in the app
  and costs +73 ms/extend; it comes back with C's guard (skip the re-roll when step divides segM).
- **Queued for the keeper's go, in order:**
  1. L133, the helpers: total-turn entry, snapping with 90°/180° stops, a heading guide, Mirror.
  2. The Blender-style UI refactor (E's sealed inventory and check `loop/ui_refactor_registration_2026-09-29.md`, de72c13a…).
  3. The inversion geometry: roll about a heartline above the road, and a bank-rate limit tied to speed.
  4. The flowing joints.
  5. Direct manipulation in the viewport.
  6. Roll. The old pieces-close bug.
- **Water is OUT**, as a UI feature AND as a check (the keeper, 06:27). If a drivability check is ever wanted, it is a car, not water.

## The Sonnet trial (`loop/sonnet_pane_A_trial_registration_2026-09-29.md`)
- A on Sonnet 5.5 since 03:45.
- Trial hand-back #1 is `p-l130r-assemble-A`. Its caught-wrong count waits on E's review.
- #2 is L132.
- The baseline (A's last 10 Opus hand-backs) has NOT been counted yet. Count it before scoring #1.

## Standing fixes from tonight
- **Stall:** reviewers and scorers run targeted tests; the full suite runs ONCE, at landing; small landings. It is still owed: a
  stall_trace file copy.
- **Every packet builds with its own CARGO_TARGET_DIR** (the shared one lets builds clobber each other).
- **Memory saved:** `look-it-up-then-say` (the keeper: look a knowable fact up in the same turn).

## Lighthouse on L
- 8+ hand-backs and tonight's loop files are uncommitted here.
- L is out of sync with origin (27 local unpushed; D's head is 79e3c01).
- They travel by the stick, or by a careful merge on the next D session. Do not push L blind.
