# p-freejump-E · D258 CORE, the free jump · pane E · 2026-10-06, on D · STATE: PAUSED (WIP saved), NOT a hand-back of finished work

The chair paused D258 twice, first for the D256 suite reds, then for the keeper's Windows update ("save D258's state … so it resumes cleanly"). This file is that saved state.

**WIP commit `76ce9d9`.**
- Branch `d258-freejump`, worktree `C:/Users/nname/Desktop/worktrees/e-freejump-wt`, on `1ff9963`. Not pushed.
- **The commit message is labelled "WIP … NOT TESTED, NOT FOR LANDING".**
- Plan: `exo_memory/loop/plan_t180_free_jump_2026-10-06.md`.

## Decided, with reasons
1. **The geometry:** a free flight is ONE path segment whose end pose is exact.
   - `src/geom/path.js` gives a segment with `to = { x: [left, up, forward], theta, p }` a Hermite curve across the air; `flightLength()` gives its arc length.
   - Everything after the flight is placed by the existing chain, so the landing and the rest of the track follow from the pose alone.
2. **The pose:**
   - forward, left and up are in the take-off's HEADING frame (horizontal forward, horizontal left, world up), so "at the same height" is up 0 whatever the take-off's climb;
   - heading is a turn relative to the take-off; pitch and bank are the landing's own, absolute.
3. **The landing** is ordinary road, NOT C1 with the take-off.
   - It must start level (κh = κv = 0, h = l = 0, value and slope) and at the flight's bank (code `LANDING`).
   - Its width and cross-section are its own; nothing morphs across the air.
4. **OLD `{gap, drop, land}` flights convert on parse** to the pose at the END of their old generated ramp, so every road keeps its place and a closed lap still closes; the ramp becomes air. The take-off pitch is reckoned by the adapter's own 2 m chord rule.
   - **Checked:** no keeper track, saved piece, backup or autosave holds a flight (grep over `%APPDATA%\com.solariz3d.t180-track-builder`: 0 files).
   - F7 does hold one: its intended change is the ramp becoming air.
   - **Old flights in SAVED PIECES are refused by name, `OLD_FLIGHT`:** their ramp depended on the pitch they were added at, so it cannot be converted.
5. **Ops (`src/core/jump.js`):**
   - `jumpHere(doc, extendOpts, { landing, landingM })` is the Jump button: the current piece placed as Extend would, a flight to 40 m ahead at the same height, level, then a 60 m straight landing.
   - `jump(doc, pose)`, `landingOf(doc)`, and `setLanding(doc, pose)`.
   - `setLanding` takes a partial pose; the landing's bank follows the flight's. It is refused by name, `LANDING_NOT_HEAD`, once road is extended from the landing; deleting back makes it movable again.
6. **Validation:**
   - a free flight's gap is intended;
   - no arcs, no landing zone, no reach;
   - a landing behind the take-off is AMBER `jump-gap-not-forward`;
   - the lap proof skips free jumps;
   - a flight still waiting for its landing stays red, `head-in-the-air`.
7. **Close:**
   - the landing's first two control points are held in every channel;
   - the flight's offset Jacobian is in the heading frame;
   - the net heading adds the turn and the pitch restarts at the landing;
   - `FLIGHT_AT_END` stays.
8. **Sculpt:** a flight breaks the link in every channel.
9. **Readout:** a flight gives `landing: { forwardM, leftM, upM, headingDeg, pitchDeg, bankDeg }` for A's number boxes.
10. **Saved pieces:** the flight's bank is kept relative to the run's start bank, and mirror flips left, heading and bank.

## Checked by hand only (no suite yet), run on D
- jumpHere places the landing 40 m ahead at the same height, lined up.
- setLanding moves it exactly (5 left, −3 up, 50 forward, heading 0.2, pitch −0.05).
- It is refused after an extend.
- A save → insert → mirror round trip works, and an old flight in a piece is refused.

## Still to do, in order, when D258 resumes
1. Rebase `76ce9d9` onto the then-current main.
2. Run the drafted rows `test/core_freejump.test.js` red on the base, green on the branch.
3. Run the existing suites that build old flights, then restate or convert each BY NAME: core_jump, core_close, core_piece, core_adapter, core_doc, core_readout, core_knots, core_offset, core_cup, core_xsec, join, doc-e2e, validate_head/validate_jumps (word builder: may be untouched), export_test_unfinished (F7), jumpwarn_refusals.
4. **F7:** a fixtures amendment manifest (the `manifest.d196/d222/d230.json` pattern), F7's digests before and after with the reason; the other 8 fixtures must stay 0 of 9.
5. **The app:** `app/core/coreshell.js` `addJump`/`candidateJump` still call the OLD `{gap, drop, land}` shape, and `jumpplan.js` reads the gone `land` segment. A replaces them in the UI half.
   - Until then either keep a thin legacy path in `jump()` (convert like parse), or let A land first. **Decide with the chair.**
   - App rows to expect red: jump-ui, core-pieces-ui row 14, validate-ui-jumpdefault, preview-async 3b, core-shell's jump rows.
6. **Not yet looked at:**
   - the export AI line and markers across a Hermite gap (an export row is drafted);
   - the overlap check with a free jump;
   - `deleteRun` of a landing (read: it should re-join a landing to the flight's start).

**Not established:** any test, the harnesses, a real window, AC.
