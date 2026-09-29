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

## Added at 07:4x: E's review came in NOT GREEN
- File: `handback/p-l130r-review-E_2026-09-29.md`.
- **Two camera faults are on branch `l130-camera-readout` (e4b0889):**
  - P3 fails under real key-repeat;
  - Shift/trackpad sideways swipe zooms ×16.
- E proposes a 3-line fix, proven on a copy, plus one mutant string to move (its §3). One check was NOT RUN at close (§1a).
- **So the branch must take E's fix before main.**
- Everything else A delivered holds: the newest-key rule 7/7; E's full suite 1,594 / 0.

## The keeper, 07:3x: the GENERATIVE half, which the librarian did not understand the first time
His words: "take a fully done track, couldnt the track as an object, be modeled by a singular equation, once we do that equation we
can then make more tracks from the pattern ... an auto generated track that flows within the constraints of the equations".
- **WRONG (the librarian's, 09-28):** M4 (one periodic series per layout) was judged only as a FIT, on accuracy (7/13 layouts at
  N≤200; Sakura needs 2,000), and dropped for the piecewise method. But his ask was GENERATION, and for generation fidelity is the
  wrong test. The piecewise core serves EDITING. The generative half was never built.
- **The idea, thought through:**
  - A closed lap's κh, κv and φ as Fourier series in s is periodic by construction, so closure is nearly free (the residual is a
    small projection, like close.js) and the result is smooth.
  - The low harmonics carry the character (corner count, rhythm, sweep); the high ones carry detail.
  - The STYLE is the per-harmonic amplitude spectrum, measured over the 13 corpus layouts (tools/fourier.cjs, reads/ on D).
  - Generate = sample coefficients from a style's spectrum, then project onto the constraints: closure, bank matched to speed,
    g-limits, width/rim bounds.
  - The design doc's style dial (Thunderhead ↔ Centrifuge) = which spectrum to sample.
  - The output is split into pieces (the D184 method) so the keeper edits it in the equation mode.
- **Needs D** (the reads/ corpus is local to D). A registration before any build: what counts as "flows like the style" (a blind
  keeper judgement vs the real track, plus spectrum distance), and the degenerating signature, stated first.
- Its place in the queue is the keeper's call; he framed it as the other half of the equation idea.
- **The keeper's framing, verbatim (07:41), which settles the scope:** "we keep the equation mode too as is tweaking the values, but also
  a system that can one shot generate GOOD tracks from the data and EQUATION derived from already complete tracks".
- **TWO systems, both kept:**
  1. Equation mode (editing, as built; it keeps getting the QoL work).
  2. A ONE-SHOT GENERATOR: complete, good tracks in one go, from the equations and patterns derived from the real, finished tracks.
  - A generated track opens in equation mode for tweaking.
  - Do not let a future plan merge these into one, or replace either with the other.

## Added 07:4x: L132 parked on its own branch
- **Branch `l132-camera-feel` at `d26ef85`** (pushed by the librarian; privacy scan 0 hits). A's L132 tree:
  Shift ramp ×4→×20; the focus rules; Ctrl+wheel lens.
  - It is ONE commit off 1d68a86 carrying the whole tree (L130's 19 paths + L132's changes), NOT stacked on e4b0889.
  - So `l132-camera-feel` ⊇ `l130-camera-readout`, in content.
- It inherits E's W1/W2. **Next session:** apply E's 3-line fix (`handback/p-l130r-review-E_2026-09-29.md` §3, with its mutant
  string) onto l132-camera-feel; a non-author reviews L132 (targeted tests only); ONE full suite; then land on main and push.
  The keeper's shortcut rebuilds main.
- A's trial hand-back #2 is `handback/p-l132-camera-A_2026-09-29.md`. It discloses the inherited W1/W2/W3 up front; its own
  caught-wrong count is for its reviewer.
- B's readout score (`handback/p-l130r-score-B_2026-09-29.md`) was being filed at close; read it at the next wake.

## Double-check at 07:5x (the keeper: "double check before")
Checked:
- **t180 origin:** `ls-remote` → main 1d68a86 (unchanged), l130-camera-readout e4b0889, l132-camera-feel d26ef85.
- A's a-l132-wt equals origin/l132-camera-feel (`diff --stat` empty).
- l130 → l132 differs in exactly L132's 5 files.
- The heavy-run lock is free; 0 node test processes running.
- **Lighthouse on L:** everything committed except B's score file (untracked). 30 commits ahead of origin/main; not pushed, by design.

**B's readout score (`handback/p-l130r-score-B_2026-09-29.md`, 07:42) is PARTIAL, and the readout is NOT green:**
- M1 match VOID (control K2 did not fire; measured 12/12 + 43/43).
- M2 live VOID (control K1 did not fire; 0/30 failing).
- M3 ghost = placed: PASS.
- M4 head never hidden: PASS.
- **M5 legible: FAIL.** The head's own label is missing in 6 of 15 states; contrast is below 4.5:1 over bright road.
- **M6 left as the placeholder `M6_VERDICT`, i.e. NOT RUN** (the close-out came mid-run).

**So next session, before main:**
1. E's 3-line camera fix.
2. C fixes M5: the head label always drawn, and contrast on bright road.
3. Re-arm the K1/K2 controls so M1/M2 can score (B or E).
4. Run M6.
5. One full suite.
6. Land.
- **UPDATED 07:5x: B's score is now FINAL** (run 2 finished inside the window).
  - M1 PASS (12/12 + 43/43, K2 caught).
  - M2 PASS (0/30, K1 caught).
  - M3 PASS; M4 PASS.
  - **M5 FAIL** (the head label is missing in 6/15 states; contrast below 4.5:1 over bright road).
  - M6 NOT RUN (partial: 0 page exceptions; the empty doc draws 0 labels; the full suite and mutation not run).
  - **So the "re-arm K1/K2" step above is DONE.** What remains before main: E's camera fix, C's M5 fix, M6, one full suite, land.
