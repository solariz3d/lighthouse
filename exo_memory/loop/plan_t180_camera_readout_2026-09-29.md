# T-180: camera feel + the degrees/metres readout. Librarian, on L, 2026-09-29 01:4x.

Repo: `C:\Users\zackn\Downloads\t180-track-builder` (L's clone, at `1d68a86` + uncommitted camera work). Push target: t180 `main`.
The keeper's words (01:27–01:29): the camera "will keep moving forward by itself"; "zoom in and out from all camera views with
scroll wheel"; "see the degrees of change when adjusting the banking, pitch, and roll and even turns"; "there shouldnt be a
ground net its just the track for now"; "mouse look to be inverted ... left and right"; "move and mouse look simultaneously";
"shift to speed camera too, like its sprint"; "DISTANCE OF EACH PIECE IN METERS SO YOU CAN SEE WITH THE DEGREE UI".
Order he set: camera first ("lets do this first. getting the camera movement good"), then the readout.

**WRONG, the librarian's (the keeper caught it, 01:37): part 1 was BUILT by this seat instead of dispatched.** It stays as
written, but it lands only after a non-author review, like any pane's work.

## Part 1 — the camera (BUILT, uncommitted; needs review + landing)

Files changed (working tree): `app/camera/cameras.js`, `app/preview/preview.js`, `app/camera/index.js`,
`app/test/camera.test.js`, `app/test/preview.test.js`, `app/test/look.test.js`.

- Drift: held keys were keyed by `e.key` and only released on key-up; a key-up lost to a focus change left the key held.
  Now keyed by `e.code`, and all held keys clear on window `blur` and `visibilitychange`.
- Yaw was mirrored: `look(+)` turned LEFT on screen (math.js lookAt: +x is screen left). Fixed at the source
  (`free.yaw -= dYaw`), so arrows and mouse both turn the right way.
- Shift sprint never worked (`held.has('Shift')` could not be true: Shift is not an action key). Now a tracked `boost`, ×4.
- Scroll wheel zooms every view: follow views scale their distance, per view, clamped [0.05, 50]; free mode dollies 4 m/notch.
- Right-drag looks from any view (takes it over into free); first WASD from a follow view also takes over into free.
- Ground grid off by default (`createPreview({ ground: true })` brings it back).
- Checked so far: `node --test app/test/camera.test.js app/test/preview.test.js app/test/look.test.js` → 54/54.
  Mutation + render-proof run started 01:3x (background), result owed.

**Review (B, non-author):** vary, don't repeat — drive `createPreview` with events the author did not script (Shift released
before W; blur mid-drag; wheel in overhead on a closed track; right-drag then C). Full suite + `app/test/mutation.test.js`
(its from/to strings pin `keyAction(e.key, e)` and the A2/A7/A8 lines in cameras.js; the author kept them verbatim).
Then the chair commits the six named paths and pushes t180 main; the keeper's desktop shortcut rebuilds from main.

## Part 2 — the readout (NEW; split across the panes)

What the keeper wants to see while shaping: per piece, its **length (m)** and the **change** it makes in **turn (°)**, **climb /
pitch (°)**, **bank (°)**; live while typing Extend's fields (on the ghost) and for the pieces already placed.

- **A — the numbers (pure, headless, `src/core/`):** `pieceReadout(doc, i)` → `{ lengthM, turnDeg (∫κh ds), climbDeg (∫κv ds),
  bankFromDeg, bankToDeg, pitchFromDeg, pitchToDeg }`, and the same for an extend candidate. Tests from integrals of known
  channels (a constant-κ piece turns κ·L exactly; a Bloss 0→T piece turns T·L/2).
- **C — the display (`app/core/panel.js` + a canvas label via the preview's overlay or HUD):** the numbers beside Extend's
  fields as they change (ghost), and a small label at each piece (length · Δturn · Δbank) in the view, readable at every zoom.
- **E — the check, registered BEFORE C builds:** what "matches" means (the label equals A's numbers to 0.1° / 0.1 m; a label
  never hides the head; legible at zoom 0.05 and 50), and the falsifier: if the keeper still cannot tell a piece's degrees
  while adjusting, the display failed whatever the tests say.

## Queued, NOT dispatched (waits for the keeper's word)
- The flowing joint (turn/bank rates carry through joints instead of stopping; `loop` note in this seat's reply 01:1x).
- Roll (randomised pieces within real-track constraints); the upward inverted banked turn as an element; the old
  pieces-close bug (`Test V1.t180track`: a 13.7 km, wrong-way-banked closing sweep).

NEXT: chair dispatch part 1 review to B and part 2 to A/C/E when this file is read

## Part 1 — the author's own mutation run came back RED (librarian, 01:4x)
`node --test app/test/mutation.test.js app/test/render_proof.test.js app/test/shell-keys.test.js test/prove_render.test.js`
→ **91 tests, 88 pass, 3 fail**:
- `control: the unmutated temp copy passes every test the mutants are run against` — cause NOT yet traced (the run's detail
  was filtered away by the author's grep; re-run unfiltered). Likely suspect, inferred: one of the new tests does not run in
  the mutation harness's temp copy (APP_DIR), e.g. a `require('../../src/...')` or a fake window without what the harness needs.
- `A4 chase ignores its lag` and `A5 chase lifts along world up` — the author rewrote the chase lines (`o.lag * z`, `hgt`), so the
  mutants' `from` strings in `app/test/mutation.test.js` no longer match. The mutants must be re-pointed at the new lines,
  not dropped.
Part 1 is NOT landable until these three are green. The repair goes to a pane at collation, not to this seat.

## Collation, part 1 (librarian, 02:4x) — B's review read at the file
Source: `exo_memory/handback/p-l130-camera-read-B_2026-09-29.md`.
- **B's verdict: NOT GREEN as built; GREEN with B's two-line fix.** As built, the full suite gives 1,488 tests, 1,471 pass, 4 fail:
  A4 and A5 NOT APPLIED (the chase rewrite broke their pins); aclook "L toggles the look" (the added capture `onShift` listener
  overwrote onKey in that test's one-listener fake); and the control, which fails on the same test.
- **This corrects my own 01:4x note.** I guessed the control's cause was a `require` path in the temp copy. **WRONG.** The cause
  is `onShift`, measured by B (aclook L-toggle: HEAD 1/0, the change 0/1).
- **B's fix, run in `<scratch>/l130/wtfix`:**
  - Shift is read in onKey's first line, and `onShift` is deleted.
  - The chase scales a copy of its options, so A4/A5's pinned lines survive verbatim.
  - Result: full suite 1,475 pass / 0 fail; mutation 61/61 caught with the control PASSING; B's own 15 varied events 15/15.
  - sha256 preview.js `cf986b00…`, cameras.js `ca3b9215…`.
- **My test "pressed as w, released as W" is VACUOUS.** B: it passes on HEAD, because the old code already lowercased both ends.
  The real drift cause is the lost key-up on blur (B's V11: 4.5 m drift at HEAD, 0 after the change). My plan's "w/W" cause was
  WRONG for letters.
- **Non-blocking, for the keeper or next lap:**
  - P2: AZERTY keys regress (the action comes from e.key, but is held under e.code).
  - P3: C or B pressed while W is held snaps back to free.
  - P4: a sticky drag if the button is released outside the window (inferred rare).
  - P5: Shift+wheel ×4 is probably dead on Windows (it arrives as deltaX; inferred).

**Landing decision (to ring when C is in, per wait-for-all-outputs):**
- The chair commits the six paths, taking preview.js and cameras.js from B's `wtfix` bytes (sha256 as above; the other four as
  built), and pushes t180 main.
- In the same lap, a pane replaces my vacuous test with B's V11 (blur while already in free), so the test goes red at HEAD.
- P3 and P5 are one-liners, worth folding into that same repair, since both touch keys the keeper uses.
- P2 and P4 are queued.
- Part 2 (A's readout, C's display) lands after C's hand-back and a non-author score against E's seal.

## The keeper, 03:0x — on the OLD installed build (his screenshot shows the old key hint and the grid; nothing from L130 is built yet)
- "shift doesnt do anything, but the move is good" and "invert the left and right mouse movement": both are in part 1 already
  (Shift sprint, yaw fix). They reach him when part 1 lands and the rebuilder builds main.
- **NEW: "always use the newest inputed movement key if the user holds down multiple at once."** Read literally: only the
  most recently pressed held movement key moves the camera (no diagonals). When it is released, the next newest held key takes
  over. Folded into the part-1 repair pane with B's fix, the V11 test and P3/P5. The alternative (per-axis, diagonals kept) is
  offered to the keeper; he has not chosen it.
- The old pieces builder's inversion is "too tight of a ribbon, needs to be stretched out with more room for the car to actually
  drive on" (his screenshot's filename). Queued with the paused pieces bugs. In the core, the inversion element gets length and
  width on purpose.
- The readout UI he asked for is part 2, in flight with C.
- **CORRECTED (the keeper, 03:10: "it doesnt matter the same inversion will happen").** My 03:0x line put the tight ribbon on
  the paused pieces builder. **WRONG.** It is shared geometry: both builders roll the road about its CENTRELINE
  (`src/core/adapter.js` toSegments emits `heartline: 0`; so do the old words), and nothing limits how fast bank can change.
  So a fast 360° twists the road about its middle.
  - Fix candidates, for a lap after L130: roll about a heartline above the road (~ the car's centre of mass); a bank-rate
    limit tied to the design speed, so the builder gives a roll the length it needs; water reds on any roll that throws the car.
  - The same shape fits his "upward inverted banked turn" element (01:1x).

## Found 04:1x while reading the keeper's hairpin (queued, not dispatched): the water check flags LIFT-OFF at any bank onset
Headless, extend-built at 250 km/h, poured from 100 m (the method of app/core/coreshell.js pour): "straight only" 4 shock reds;
"flat turn -57°/100m" spill 7 + shock 4; **"bank 0→55°, NO turn" liftoff 7 at 205–294 m**; "turn + bank" liftoff 7 at
205–269 m. A road that only rolls, on a straight, cannot lift water off: this is inferred to be a bug in src/core/water.js
(normal force / frame sign when φ changes) or in the adapter's roll about the centreline. Until it is fixed, water verdicts on
banked pieces are not evidence. The keeper's `eq-HAIR PIN` gets the same 7 lift-offs at its bank onset (1,000–1,070 m) at
250, 380 and 460 km/h.

## NEXT LAP (queued behind L130; the keeper, 04:10): water out of the UI, and a whole UI refactor, Blender-style
His words: "remove the water feature for now", "a whole UI refactor, i want the preview to be the center of attention almost
full screen, AIM for blender ui style but with our own taste".
- The viewport takes almost the whole window. There is a thin header (menus, builder picker, track name, camera buttons); a
  narrow LEFT tool strip (Extend / Brush / Close as tools; T toggles it); a RIGHT properties panel (N toggles it) holding the
  selected piece's readout, the active tool's fields, and collapsible sections (the piece list, validation, textures, export);
  and a bottom status bar (camera mode + its keys, track length, piece count, open/closed). Both panels collapse, for full screen.
- Water is removed from the UI, not deleted: src/core/water.js stays, paused like the pieces builder, until the bank-onset
  bug (above) is fixed.
- L130's readout moves into the right panel; its per-piece labels stay in the viewport.
- Needs, before anyone builds: a sealed layout check (E); a keeper's-eye sketch (the librarian's ASCII of 04:1x is the
  starting point); and a split of the panes by region (header / left tools / right panel / status bar + key routing).
- Its governing check is the keeper's first use, as with the readout.

## Queued (the keeper's idea, 04:11): MIRROR — the exit as the entry run backwards
"take the first turn inputted data, and then subtract it to create the exit back into the straight."
- Exact, not approximate: extend's blend S(u) = 3u² − 2u³ satisfies S(1−u) = 1 − S(u). So a piece of the SAME length whose
  targets are the previous piece's START values (turn, climb, bank, width, rim) is the previous piece reversed; both halves
  turn rate·L/2.
- For a hairpin of angle θ from two halves of length L: entry rate = θ/L (180° over 330 m halves → 54.5°/100m).
- His eq-HAIR PIN already mirrors in bank. It breaks the mirror in turn (exit target +5°/100m, not 0; halves 94.05° vs 85.80°)
  and in width (31→30, never back).
- A one-click "Mirror" tool, with the readout showing both halves side by side. It goes in the UI refactor lap's left tool strip.

## The keeper's order, 04:12: "we just need to make the system work, then continue to make the process ... more intuitive"
Input bars stay for now. LATER (after the UI refactor): direct manipulation at the build head. Drag forward = length,
sideways = turn, up/down = climb, a ring or twist = bank. Snapping (5° steps; mirror-snap to the exact exit). Blender-style
modal keys: press T, move to turn, type 54.5 mid-drag, Enter. The ghost and the readout update live, and the boxes show the
same numbers as the precise fallback.

## L131, opened at the keeper's word (04:14: "B and E are idle, if it doesnt interlap over domains get them to work on something")
Checked first: C's worktree `C:\Users\zackn\AppData\Local\Temp\c-l130-wt` changes app/camera/*, app/core/{coreshell,panel}.js,
app/preview/{index,preview}.js and their tests, and adds app/core/labels.js, src/core/readout.js. So the camera repair WAITS
(it would collide in preview.js). The two packets below touch none of C's paths.

**L131-B — trace the water check's bank-onset lift-off (src/core/water.js, src/core/adapter.js; READ + scratch only).**
- Repro, from the 04:1x note above: a straight that only rolls 0→55° lifts all 7 streams off at 250 km/h; a plain straight and a
  flat turn do not.
- Find the cause (the normal-force sign or frame when φ changes? rolling about the centreline? the surface's U vs the adapter's?)
  with a measurement, not a reading.
- Hand back: the cause, a test that is RED at 1d68a86 and would go green with the fix, and the fix as a proposed diff (not
  applied; water is leaving the UI and comes back only after this).
- Heavy-run lock on every node run; its own worktree at 1d68a86; no links.

**L131-E — the UI refactor: the inventory and the sealed layout check (docs only, no code).**
- Inventory every control and panel the app shows today (app/index.html, app/*/index.js mounts, both builders), each with
  where it goes in the Blender-style layout: the header / the left tool strip / the right properties panel (which collapsible
  section) / the status bar / removed (water) / pieces-mode only.
- Register the check BEFORE any refactor code: the viewport's share of the window (the keeper: "almost full screen"); both
  side panels collapse (T / N); every control from the inventory is reachable, or deliberately removed; the keys; the readout
  lands in the right panel; legibility. Governing check: the keeper's first use.
- Start from the librarian's ASCII sketch (the reply at 04:1x, copied into this plan's "NEXT LAP" block).

## The ASCII sketch (04:1x), pasted now. **WRONG, the librarian's:** L131-E's packet said it was "copied into NEXT LAP"; it was not. E found the block holds prose only.
```
┌──────────────────────────────────────────────────────────────────────┐
│ T-180  File▾ Edit▾ View▾ │ Equation ▾ │ Test V1 •        Build Overhead Side Chase Free │  ← thin header
├───┬──────────────────────────────────────────────────────┬───────────┤
│ ⤳ │                                                      │ PIECE p2  │
│ ✎ │                                                      │ length 330│
│ ⟲ │                  3D VIEWPORT                         │ turn −94° │
│   │            (almost the whole window)                 │ bank 0→55°│
│   │                                                      │───────────│
│   │   labels on each piece: 330 m · −94° · bank 55°      │ EXTEND    │
│   │                                                      │ len  turn │
│   │                                                      │ climb bank│
│   │                                  [axis gizmo]        │ ▸ Pieces  │
├───┴──────────────────────────────────────────────────────┴───────────┤
│ free view · WASD move · Shift sprint · RMB look · scroll zoom │ 1,660 m · 3 pieces · open │ ← status bar
└──────────────────────────────────────────────────────────────────────┘
```
E's sealed inventory (`loop/ui_refactor_registration_2026-09-29.md`, sha256 de72c13a…) is the master for placements; this
sketch is the picture only.

## L130 COLLATION (librarian, 04:4x): all four hand-backs read at the file
- **A** `p-l130-readout-A`: `src/core/readout.js` plus 13 tests; A's full suite 1,537 pass / 0 fail. Ran on OPUS (the switch was
  03:45), so it counts as baseline.
- **E** `p-l130-readout-reg-E`: the seal, sha256 57448e2a… (re-checked by the librarian).
- **B** `p-l130-camera-read-B`: the camera is GREEN only with B's two-line fix (wtfix: preview.js cf986b00…, cameras.js
  ca3b9215…).
- **C** `p-l130-readout-display-C`: the patch `scratchpad/l130/c-l130-readout.patch` (sha256 86b6131f…; 6 files; needs A's
  readout.js). Its mutation run 44/44. Its suites 592/597, and the 1 fail is aclook "L toggles", which is B-reported and
  fixed in wtfix. The window captures of shots9 are C's, and C marks them UNSCORED.
- **C's findings, routed:**
  - overhead zoom-in shows a BLACK preview (a camera fault) → the repair below.
  - `scripts/prove_render.ps1` crops captures on a scaled display (no DPI awareness; C's scratch fix prove_render_dpi.ps1
    04d9997d…) → the repair below, since the scoring needs it.
  - The machine-wide CARGO_TARGET_DIR lets worktree builds clobber each other → every packet builds with its own target dir.
  - The panel reads "+90.0°" for fields "45 °/100m × 400 m": the fields are rates and the readout is the piece's total. That is
    for G (the keeper) to judge. Candidate wording, if G fails on it: "turn +90.0° (rate 0→45°/100m over 400 m)".

**OUTPUT → NEXT: changed.** The camera needs a repair before landing, and the readout needs a non-author score. B is busy (L131),
so:
1. **L130-R, to A (its FIRST Sonnet trial packet; `loop/sonnet_pane_A_trial_registration_2026-09-29.md`):** assemble ONE tree in a
   fresh worktree at 1d68a86, with its own CARGO_TARGET_DIR:
   - A's readout.js and its test;
   - C's patch;
   - the camera from B's wtfix bytes (sha-checked);
   - then the repair:
     (a) the newest-key rule (the keeper, 03:0x: only the most recently pressed held movement key moves; on release, the next
         newest);
     (b) replace the librarian's vacuous test "pressed as w, released as W" with B's V11 (blur while already in free: RED at
         HEAD, 4.5 m drift);
     (c) P3: C or B while a move key is held must not snap back to free;
     (d) P5: Shift+wheel ×4 via `e.deltaY || e.deltaX`;
     (e) the overhead zoom-in BLACK preview, cause found and fixed;
     (f) C's DPI fix into `scripts/prove_render.ps1`.
   - Full suite plus app mutation plus core mutation, all green. The landing list with sha256.
2. **Then, in parallel:**
   - **E** reviews A's repair (non-author; vary the events);
   - **B**, after L131-B, scores the readout M1–M6 against E's seal on A's assembled tree (non-author of A/C/E; B took no part
     in the readout).
3. **The chair commits the landing list and pushes t180 main.** The keeper's shortcut rebuilds. G is recorded from his first
   words.

## L131-B COLLATION (librarian, 05:1x): `handback/p-l131-water-B_2026-09-29.md` read at the file
- **The cause is the GEOMETRY, not water.js.** `src/core/adapter.js` toSegments hands φ over as 2 m chords, and `src/geom/path.js:103`
  rolls each chord by its own smoothstep, so the roll rate falls to zero every 2 m. B's measurements:
  - the path's roll is off the channel by up to 0.15°;
  - the edge-line curvature at u ±12.9 m is ±0.254 /m as built against ±0.0074 /m exact (~34×; ~125× the crest limit at 250 km/h);
  - as built, the water lifts off 7 at EVERY transition length up to 800 m; with the exact roll, 0 from 200 m on.
- **inferred (B):** the same ripple is in the mesh and the export road, about 3 cm at the edge. It may be part of the keeper's
  "not a smooth flow"; not measured.
- **Two librarian claims are WRONG, and B corrected both:**
  (1) "the water check has a bug": water.js is right; its normal force matches the closed form to ≤0.1 m/s².
  (2) "a road that only rolls, on a straight, cannot lift water off": wrong for streams off the centreline. v²·u·φ'' > g·cosφ is a
      real crest, and at 55° over 100 m those lift-offs are real and must survive.
- **B's fix (proposed):** offsetPath re-rolls each sample to the channel's exact φ(s) about src/geom's own unrolled left.
  - Diff sha256 9e8382df…; test `test/core_water_roll.test.js` da5bd81e… (RED at 1d68a86 1/2, green with the fix).
  - Full suite on the fixed tree: 1,469 pass / 0 fail.
  - Not measured by B: the trackmodel `_lift` mesh, the re-mesh cost now that every rolling piece lifts, and C's core-mutation
    lift mutants.
- **The keeper's eq-HAIR PIN, re-poured by the librarian on B's fixed tree** (from s 900; the apex is at 1,330 m):
  - 250 km/h: spill 4 over the OUTSIDE edge (u +15.2) at 1,179–1,191 m; lift-off 3 at the edges (u −8.7, +14.1, +12.8); shock 3.
  - 380 km/h: lift-off 5 at the edges, spill 2 over the outside.
  - That is the underbanking the librarian estimated from geometry (55° against ~78° balanced at 250), now shown by water on a
    correct road.

**OUTPUT → NEXT: changed.** A geometry fix belongs in the landing even though water leaves the UI: it corrects the road itself.
- **L131-R, to C** (idle; not the author): review B's adapter fix as a non-author.
  - Vary: the mesh through trackmodel `_lift`; re-mesh timing on a 40 km track (the T6 budget); C's own core-mutation lift mutants;
    a loop that rolls.
  - Then it lands in the same commit as L130's list, after A's assembly and E's review.
- **Offered to the keeper, not dispatched:** B's alternative, fixing it at the source in src/geom (roll rates per segment),
  which would also fix the paused pieces builder's roll.

## L130-R collated (librarian, 05:5x): `handback/p-l130r-assemble-A_2026-09-29.md`, A's FIRST Sonnet 5.5 packet
- One tree, `C:\Users\zackn\AppData\Local\Temp\a-l130r-wt` at 1d68a86: A's readout + C's patch + B's wtfix bytes (all four
  inputs sha-checked) + the repair (a)–(f).
  - The newest-key rule: `held` is a Map in the order pressed; only the newest fly key moves.
  - V11 replaces the vacuous test; it is RED on HEAD's camera files.
  - P3: a one-shot takeover flag. P5: `deltaY || deltaX`.
  - The black overhead: the fit centres on the box centre, which lies off the road on curved or closed tracks. Measured: 0/201
    road samples in view from zoom 0.247 on a 400 m arc. Fix: the centre slides to the head as it zooms in; zoom ≥ 1 is unchanged.
  - C's DPI fix, into prove_render.ps1.
- **Full suite 1,602 / 1,589 pass / 0 fail**, including the app mutation (182 + control) and the core mutation (43). A's new
  mutants N1–N10 are all caught. A disclosed 2 misses of its own from its first run (N9 survived, N7 was equivalent) and fixed both.
- Beyond the list, disclosed: P2 (non-QWERTY). Left out: P4 and the "+90.0°" wording (G's).
- For the trial record (`loop/sonnet_pane_A_trial_registration_2026-09-29.md`): trial hand-back #1. Its caught-wrong count is
  set by E's review, not by the librarian.

**OUTPUT → NEXT: unchanged**, as planned:
- **E** reviews A's repair (non-author; vary the events; check the files A took beyond the list: app/camera/index.js and the
  three tests).
- **B** scores the readout M1–M6 against E's seal `57448e2a…` on this tree. B builds with its own CARGO_TARGET_DIR, captures
  with the DPI-fixed prove_render.ps1, and reads the zoom back from the camera.
- **C** continues L131-R (B's adapter fix).
- Landing = A's list + B's adapter fix after C's review, in one commit.

## STALL, traced (the keeper, 06:14: "isnt this taking too long for something that should be a simple fix?")
- **Source:** every reviewer re-runs the FULL suite (~20 min on L) under the one heavy-run lock, so B, E and C queue in series.
  At 06:14 E and C were both "queued behind the lock". Scope also grew (camera + readout + road fix in one landing), and the
  librarian's self-built part 1 added a round.
- **Fix, for every lap from here:** reviewers and scorers run only the tests for what they check (minutes). The FULL suite runs
  ONCE, on the assembled tree at landing. Keep landings small: one feature, one landing.
- **Proving check:** the next lap's review wall-time vs this one's (dispatch 05:5x → hand-backs), and the lock's queue length at
  each review. Filed here; copy to a stall_trace file at the next sync.
- **Meanwhile:** a preview built from A's green tree `a-l130r-wt` was launched for the keeper at 06:15 (pid 3140); it is
  unreviewed and changes nothing that lands.

## L132 — the keeper's first-use feedback on the preview (06:22), to A (Sonnet trial #2). Small, targeted tests only (the stall fix above)
His words: "the shift speed increase is too slow should go faster the longer you hold it down"; "when i was entering into the
input bar ... it stopped me from being able to move around"; "there needs to be a distinction from zooming in and traversing
in, there isnt".
Base: A's own `a-l130r-wt` state, in a NEW worktree or branch copy, so E's review of a-l130r-wt stays valid. Land after L130 as
its own small landing.
1. **Shift ramps:** ×4 at press, rising smoothly to ~×20 over ~2.5 s held; back to ×1 on release. (Optional, same curve: plain
   movement ramps from a slow start.) Tests: the speed at 0, 1 and 2.5 s held; the reset on release; blur resets.
2. **Focus:** Enter or Esc in a panel field blurs it; a mousedown on the canvas (either button) blurs the active element. NUMBER
   inputs let the camera keys (W A S D Q E, Shift, arrows) through, since they cannot take letters; TEXT inputs (the track name)
   still swallow them. Tests for each, including "typing a name never moves the camera".
3. **Zoom ≠ travel:** in FREE mode the wheel zooms the LENS (fov, e.g. 60° → 10°…100°, stepwise), and the camera does not move;
   W/S travel. Middle-click resets the fov. Follow views keep distance-zoom. The HUD/status shows the fov. Tests: the wheel in
   free changes fov and not eye; W changes eye and not fov; the reset; pickAt still hits under a changed fov.
Hand back with targeted test runs and the landing list; a non-author reviews (E or B, whichever is free).
- **L132 item 3 AMENDED (the keeper, 06:23: "or maybe the zoom is good"):** plain wheel stays exactly as it is now (free mode
  dollies; follow views change distance). LENS zoom (fov) moves to **Ctrl + wheel** in every view; middle-click resets the fov.
  Tests: plain wheel unchanged; Ctrl+wheel changes fov and not eye; the reset.

## L133 QUEUED — the helpers (the keeper, 06:23: "a help guide essentially for the tracks, even snapping to 90 degrees")
The readout (degrees + metres) is in L130 and in his preview now. Not built yet, for this lap:
1. Total-turn entry: type the piece's total angle; the builder sets the rate (θ/L for a from-zero piece; general: rate_end =
   2θ/L − rate_start, from turn = L·(rate_start + rate_end)/2).
2. Snapping (toggle): totals and bank snap to 5°/15° steps, with hard stops at 90° and 180°.
3. A heading guide at the head: the heading turned since the start (e.g. "heading 180.0°").
4. Mirror (see the queued block above).
Dispatch when L130 lands and L132 is in; split across the free panes; E seals the check first.

## L131-R COLLATED (librarian, 06:3x): `handback/p-l131r-review-C_2026-09-29.md`
- **C: GREEN for correctness**, with findings that change the landing call:
  - **In the app it changes nothing visible.** The preview mesh, the export road and the app's water all sample every 2 m = segM,
    so every sample sits on a chord end, where the roll is already exact. The ripple lives only on `toPath`'s default 0.5 m path.
  - **B's inferred "~3 cm in the mesh and export" is REFUTED**, and so is my collation's "may be part of the keeper's 'not a smooth
    flow'". **WRONG (the librarian's).**
  - **Cost:** +73 ms per extend on a 40 km rolling track (282 → 355 ms median), against a T6 bar of 50 ms that is already red.
  - **The app's way** (step 2), base = fixed: 100 m roll → lift-off 6 + spill 1; 400 m roll → spill 7, no lift-off.
- **WRONG (the librarian's), found by reading C's table:** both of my eq-HAIR PIN pours (04:0x and 05:1x) used `toPath({ step: 0.5 })`,
  which is B's way, not the app's.
  - The first pour's "7 lift-offs at 1,000–1,070 m" was therefore the ripple artifact of my script. The app would not have shown it.
  - The re-pour on B's fixed tree reads as the app would (base = fixed on the app's path). So "it spills over the outside edge,
    underbanked" stands, but it should be re-poured the app's way before it is quoted again.
- **C's open item:** on the fixed tree at 380/200, water.js lifts off two streams (u +4.83, +7.82) where the closed form says N = +5.4
  and +6.9 (pressed down). This persists at steps 2/1/0.5/0.25. Either water.js or the closed form is too simple. It is water's, and
  water is leaving the UI; queued.

**OUTPUT → NEXT: changed.** The adapter fix does NOT join L130's landing.
- It is invisible in the app and costs +26% per extend, while the keeper's order is "make the system work" and extend is already slow.
- Keep L130 small (the stall fix).
- Queued: the fix plus C's cheap guard (skip the re-roll when path.step divides segM, so it costs 0 in the app), for B to write,
  measured against T6, as its own small landing.
- L130 lands on A's list alone, after E's review and B's score.

## The keeper, 06:27 — WATER IS OUT, as a check too: "the water idea is dumb, its more to be taken as an analogy than literally, the water is at the mercy of the turns, while a t-180 can turn as well with the flow"
- **WRONG (the librarian's, going back to 09-28):** "BE like water" was the keeper's analogy for flow. The librarian took it
  literally as a passive-particle simulation (spec_t180_equation_core §5, D185 test 5), and it has been judging tracks by the
  wrong kind of thing. A driven car steers and holds a line; water only follows gravity and the turns.
- **Dropped from the queue:** the water.js anomaly (C, L131-R §5) and any water fixes. The adapter roll fix stays queued on its
  own merit (it makes toPath's geometry exact), with C's guard.
- **The analogy's real content lives in the geometry:** smooth rates, flowing joints (queued), bank matched to speed.
- **If a literal drivability check is ever wanted, it is a CAR, not water:** a point-mass that steers along the track at the design
  speed, with the measured tyre grip (Thunderhead FRICTION 0.82), checking that the grip needed stays inside the grip available
  and that g stays inside T-180 limits. Not queued; the keeper's order is "make the system work" first.
