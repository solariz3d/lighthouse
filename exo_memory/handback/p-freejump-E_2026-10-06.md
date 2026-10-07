# p-freejump-E · D258 CORE, the free jump · pane E · 2026-10-06, on D · FINISHED (the core; A's UI lands with it)

**Commit `1e76d35`.**
- Branch `d258-freejump`, worktree `C:/Users/nname/Desktop/worktrees/e-freejump-wt`, ONE commit on main `5caf5c6`.
- 29 files, +640/−309. Not pushed.
- Plan: `exo_memory/loop/plan_t180_free_jump_2026-10-06.md`. GEOMETRY + EXPORT tier.

## For A: the API your UI builds on (stable; I will say here if it changes)
- **`src/core/jump.js`:**
  - `jumpHere(doc, extendOpts, { landing, landingM })` is the Jump button: the current piece placed exactly as `extend(doc, extendOpts)` would (`extendOpts` null takes off from the end as it is), then a free flight to `landing`, then a straight landing of `landingM` m.
    - Defaults: `D.LANDING_DEFAULT` `{ forward: 40, left: 0, up: 0, heading: 0, pitch: 0, bank: 0 }` and 60 m.
    - The landing has the take-off's family and its family's own width and rate.
  - `jump(doc, pose)` appends only the flight. A partial pose takes LANDING_DEFAULT for the rest.
  - `landingOf(doc)` → `{ flight, index, pose }` while the landing is the HEAD, else null. The head is the last piece right after its flight, or a flight still waiting at the end.
  - `setLanding(doc, pose)` moves the head landing. A partial pose keeps the rest; the landing's bank follows the flight's. One commit = one undo step.
    - Refused by name, `LANDING_NOT_HEAD`, once road is extended from the landing. Deleting back (`piece.js deleteRun`) makes it movable again.
- **The pose:**
  - `forward`, `left`, `up` in metres, in the take-off's HEADING frame: horizontal forward, horizontal left, world up. So "the same height" is up 0 whatever the climb.
  - `heading` is a TURN from the take-off's, + = left, within ±180°.
  - `pitch` and `bank` are the landing's own, in radians.
- **The readout:** `readout.js pieceReadout(doc, i)` on a flight gives `landing: { forwardM, leftM, upM, headingDeg, pitchDeg, bankDeg }` for the number boxes, plus `turnDeg`, `climbDeg`, `bankToDeg`.
- **Refusals by name**, all CoreErrors with plain messages:
  - `NO_TAKEOFF`, `CLOSED`, `JUMP_AFTER_JUMP`, `FLIGHT_OFFSET`;
  - `BAD_FLIGHT` (not a number, pitch to vertical, turn past 180°);
  - `FLIGHT_TOO_SHORT` (landing under 1 m away);
  - `LANDING` (a landing that does not start level at the flight's bank);
  - `LANDING_NOT_HEAD`, and `OLD_FLIGHT` (gap/drop/land given).
- **No legacy path** (the librarian's ruling): `app/core/coreshell.js` `addJump`/`candidateJump` and `jumpplan.js` are UNCHANGED and now refuse by name (`OLD_FLIGHT`).
  - **6 app rows are red until your UI replaces them** (below). The `segments` still carry `part: 'gap'` for the flight, with its pose in `to`; there is no `part: 'land'` any more.

## What the core does (decided, with reasons)
1. **The geometry:** a free flight is ONE gap segment whose end pose is EXACT (`src/geom/path.js` `to`).
   - Across the air it is a cubic Hermite curve from the take-off tangent to the landing tangent, with stations spread by ARC LENGTH, as s is everywhere else.
   - Everything after the flight is placed by the existing chain.
2. **The landing** is ordinary road NOT C1 with the take-off. It must start level (κh = κv = h = l = 0, value and slope) at the flight's bank; its width and cross-section are its own. Nothing morphs across the air.
3. **Validation:**
   - a core gap is a flight only if it carries its pose (`to`), so a planted hole in the core's road stays red;
   - the free jump has no arcs, no landing zone and no reach check;
   - a landing behind its take-off WARNS (`jump-gap-not-forward`, amber);
   - the lap proof skips free jumps;
   - a flight still waiting for its landing is red (`head-in-the-air`);
   - the word builder's jump keeps its own-ramp landing search (I had removed it, and `validate_jumps` caught that; restored).
4. **Close:**
   - the flight is never changed;
   - the landing's first two control points are held in every channel;
   - the model carries the offset in the heading frame (∂/∂θ = forward·Lh − left·F), adds the heading turn and restarts the pitch;
   - `FLIGHT_AT_END` stays.
5. **Sculpt:** a flight breaks the link in every channel.
6. **Saved pieces:** a flight is its pose; its bank is stored relative to the run's start bank; mirror flips left, heading and bank.
   - A run that starts with a jump goes in AS SAVED: the landing keeps its own width, since it is no longer joined to the head.
   - An old saved jump is `OLD_FLIGHT`.
7. **Old documents:** a `{gap, drop, land}` flight opens as the free flight landing at the END of its old generated ramp (pitch reckoned by the adapter's 2 m rule).
   - Every road keeps its place. F7's landing road start moved 0.045 mm vertically and 0.021 mm horizontally, and its end 0.045 mm: the pose's 0.1 mm quantum (scratch `freejump/f7land.js`, both trees).
   - The ramp becomes air.
   - **Checked:** no keeper track, saved piece, backup or autosave holds a flight (0 files).

## Tests
**Red first on `5caf5c6`:** the restated `core_jump.test.js` and the fixture rows copied onto the base gave 30 tests, **26 FAIL**.
- The 4 that pass are the fixture kit's record rows (seal and the D196/D222/D230 records), which must pass on both.
- Evidence: `freejump/base.tap` sha256 `81e69d3f…`.

**The WHOLE non-mutation suite on `1e76d35`** (148 files, under the lock, serial shim, 1322 s):
- **1965 tests: 1946 pass, 6 fail, 6 skipped, 7 todo** (the long-standing ones). Evidence: `freejump/whole2.tap` sha256 `6ed33fb1…`.
- **The 6 fails are exactly the OLD Add-jump UI that A's Jump UI replaces:**
  - `app/test/core-pieces-ui.test.js` row 14 (the Jump block) and row 15 (`candidateJump` with gap/drop: now `OLD_FLIGHT`);
  - `app/test/jump-ui.test.js` rows 1, 1b, 2, 3 (`jumpplan`'s ballistic arcs read the gone landing ramp).
- **Nothing else is red.**

**Restated BY NAME, each with a CHANGED D258 comment:**
- `test/core_jump.test.js`: rewritten for the free jump.
  - Rows 1, 2, 4, 5, 6, 7.
  - The D243 ramp rows (row 3 the landing zone, row 5b the zone warning) are REMOVED with the ramp, since nothing is computed about where the car lands.
  - New rows:
    - the Jump button's default;
    - the exact pose;
    - the landing not C1;
    - move / `LANDING_NOT_HEAD` / delete frees it;
    - deleting the landing itself;
    - refusals;
    - the landing behind the take-off warns;
    - a closed export with no jump warning;
    - a saved run and its mirror;
    - `OLD_FLIGHT`;
    - the old document's conversion;
    - the readout pose.
- `test/core_jump_mutation.test.js`: re-anchored, 19 mutants, every anchor occurs once (checked by evaluating the array, NOT by loading the file).
  - The D243 ramp mutants J8b, J8c(old) and J12/J13(old) went with the ramp.
  - New: J2b (behind → red), J8c (the side offset), J12 (landing joint), J15 (`LANDING_NOT_HEAD`), J16 (the pose), J17 (old jump at its lip), J18 (mirror).
  - **Not run:** the librarian's at install.
- `test/core_cup_fixtures.test.js` + NEW `test/fixtures/manifest.d258.json` (sha256 `5b5b38e6…`), the d196/d222/d230 pattern:
  - F7 differs in segs, path and mesh; the other 8 are 0 of 9.
  - "before" is the seal's F7, checked equal.
  - Every digest is computed by the SEALED `fixtures.js digests()` itself (sha256 `d24dcf49…`, run unchanged in a VM: scratch `freejump/f7digests.js`).
- The other restated rows:
  - `test/core_adapter.test.js`: a flight is one gap segment with its pose;
  - `test/core_doc.test.js`: the landing starts at the flight's bank;
  - `test/core_piece.test.js`: rows 6, 6b, 8;
  - `test/core_readout.test.js`: `pitch` for `land`;
  - `test/export_test_unfinished.test.js` and `test/jumpwarn_refusals.test.js`: the hole goes in the landing road;
  - `app/test/preview-async.test.js` row 3b: its amber control is now the free jump's own warning, a landing placed behind;
  - flight constructions only, restated to the pose at the old lip: core_close, core_cup, core_offset, core_xsec, core-pieces-ui row 8, core-readout-display, core-sculpt.

**Docs:** `src/core/README.md` (the flight, the ops, the readout's `landing`) and `CHANGELOG.md` (Added).
- The app README and guide are A's, with the UI.

## Corrections and process errors this lap
- **My own errors, caught by my own runs:**
  - The crest-like adapter row expected an unquantised pitch.
  - A heading of exactly 180° was refused (the quantum pushed it past π; the tolerance is now 1e-9).
  - The flight's stations were spread by the curve's parameter instead of arc length (fixed in `path.js`; F7's digests re-taken after it).
  - I removed the word jump's own-ramp landing search (restored).
- **Not explained:** my first F7 "after" record (before the arc-length fix) also showed a different segs digest from the final one. I did not pin why. The final record is re-derived from the final code and the fixture rows pass against it.
- **Process:**
  - Earlier today a `require()` of the mutation file ran its control outside the lock (reported in p-maxspeed-E §Suite reds).
  - This lap the anchors were checked by evaluating the array only.

## Not done / not established
- The harnesses (core_jump, core-close, core_piece, core_cup, export): the librarian's at install.
- A real window, the Jump UI (A), and AC: how a free landing drives, which is the keeper's own test.
