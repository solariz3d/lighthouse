# L139 registration: the second change on every field. Pane E, on L, 2026-11-05, before any code

**What this file is:** the pass bar and degenerating signature for L139, registered before B and C write code, against t180
`0df08db6f8b5162805df599c66151743ee4274f0` (`l135-second-bank`).
- **Plan (master):** `exo_memory/loop/plan_l139_second_change_every_field_2026-11-05.md`, with its section "AMENDED 2026-11-05
  00:4x" (one mark per field).
- **His words and pictures:** `exo_memory/briefs/t180_second_bank.md`. I opened `t180_second_bank_red_marks_2026-11-05.png`: a −90°
  corner ending straight, bank +66.14°, cup 15.5, with the red marks across the road near the piece's end.

**Verdict on the plan: AMENDED, three ways (A–C below).**
- **(A)** The bank's way of finding a minimum finds none for turn, climb, width or cup. The road as built follows their document at
  every length, so the bar for them comes from the room's existing ride rule (D637), not from a new scan.
- **(B)** The bank's own minimum, 15·√Δ, sits below its own roll bar for every change. So the L136 M5 check fails at the minimum by
  construction, and his new picture's piece is 4.1× over the bar.
- **(C)** The joint-feel measures cannot see a second ramp that is too short, because the ramp is inside the piece.

**The one-mark-per-field amendment changes nothing measured here.** Every scan case put a second change on one field only, so every
minimum below is already per field. The three-mark piece the amendment asks for is M3.

## How it was measured (read-only)

- **Worktree:** `git -C C:\Users\zackn\Downloads\t180-track-builder worktree add --detach <scratch>/l139-E 0df08db`.
  - `find -type l` → 0. Nothing was built or pushed, and AC was not launched. The installed builder was not touched.
- **`<scratch>`** is `C:\Users\zackn\AppData\Local\Temp\claude\8e9709f509cfea85\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad`.
- The scripts are committed beside this file in `l139_registration_scripts/`, so the scorer re-runs the same code. Each holds the
  heavy-run lock and runs at BelowNormal priority under `--max-old-space-size=4096`.
  - `node l139scan.js <tree> 0df08db` → `l139scan-0df08db.json`: the per-field scan, corner minimums, the S, the sketch's bytes.
  - `node l139marks.js <tree>` → `l139marks.txt`: the three-mark piece and his picture's piece.
  - `node l139red.js <tree>`: what the validator's extra reds on the 1/150 turn are.

### The emulator (0df08db has a second change for the bank only)

- The other fields' second ramp is laid by the bank's own recipe, generalised by channel:
  - 8 knots are inserted over [from, L];
  - that channel alone is refitted with the exported `fitWithHold`, holding every control point whose support ends at or before
    `from`;
  - `endC2` is applied to the C2 channels (`extend.js` `secondRamp` :301).
- **Control, checked:** on the bank, the emulator's channel equals the real `extend(…, second)` exactly. Three cases (30→0 from
  637.5, 60→0 from 600, 20→−40 from 500): `equal: true`, maxDiff 0, 49 points each (`l139scan-0df08db.json` `.control`).
- **inferred:** B's build behaves as the emulator does. The scorer re-runs the measures on B's real code, not on this emulator.

### The measures (B's method, `p-l135-B` §ROW-6)

The case WITH the second change is compared against the same piece WITHOUT it, over [0, from]. Setup: a 1,000 m flat, the 1,000 m
piece (first ramp 120 m), then a 200 m straight. Width and cup cases have a 200 m piece before it that sets 30 m / 15°.

| measure | what it reads |
|---|---|
| docLeak | max \|channel with − without\| over [0, from], `channelAt` every 0.25 m |
| builtLeak | the same on the built road: turn = path curvature along L, climb = along U, width = profile span |
| endPeak | the built quantity's 2 m second difference within 20 m of the end joint |
| joints | `test/core_joint_feel.test.js` `joints()` (copied verbatim) at the end joint |
| redNew | validator reds with the second change minus without |

## M1 · Rate mode, per field: the shortest second ramp

checked: `l139scan-0df08db.json` `.rate`, L2 ∈ {0.5, 1, 2, 3, 5, 8, 10 … 300} m.

| field, case | docLeak, every L2 ≥ 1 m | as a share of the change | end value, slope | joint-feel at the end |
|---|---|---|---|---|
| turn 1/300 → straight | ≤ 1.97e-5 /m | 0.59% | 0, 0 | `a L` fails at L2 ≤ 3 m |
| turn 1/300 → −1/300 (S) | ≤ 3.94e-5 /m | 0.59% | −1/300, 0 | `a L` fails at L2 ≤ 3 m |
| turn 1/150 → straight | ≤ 3.94e-5 /m | 0.59% | 0, 0 | `a L` fails at L2 ≤ 3 m |
| turn 1/600 → 1/200 | ≤ 1.97e-5 /m | 0.59% | 1/200, 0 | `a L` fails at L2 ≤ 3 m |
| climb 4°/100 m → 0 | ≤ 4.12e-6 /m | 0.59% | 0, 0 | `a U` fails at L2 ≤ 3 m |
| climb +8 → −8°/100 m | ≤ 1.65e-5 /m | 0.59% | −8°/100 m, 0 | `a U` fails at L2 ≤ 3 m |
| width 30 → 40 → 30 | ≤ 0.059 m | 0.59% | 30, 0 | clean |
| width 30 → 50 → 30 | ≤ 0.118 m | 0.59% | 30, 0 | clean |
| cup 15 → 30 → 15 | ≤ 0.0056° | 0.04% | 15, 0 | clean |
| cup 15 → 60 → 15 | ≤ 0.017° | 0.04% | 15, 0 | clean |

- **The document's leak into the hold is about 0.6% of the change, at every length from 1 m to 300 m.** It barely shrinks before
  50 m. It is the fit ringing on the inserted knots, not a property of the ramp's length.
- **At L2 = 0.5 m the emulator could not lay the ramp:** every inserted knot fell to the `k < L − 0.5` filter. This is L135 §2c (the
  knot filter), and real code would drop the hold early there.
- **The built road follows the document for these fields.** checked: `adapter.js` `bankPlan` re-rounds the bank only, and
  `toSegments` reads every other channel with `D.valuesAt` (:548). builtLeak equals docLeak at every L2 except the 2 m chord that
  straddles `from` at L2 ∈ {1, 3, 5, 15, 25}. That is chord resolution, not a leak.
- **The built cup column is VOID.** My reader (max |psi| of the profile) is not the cup angle: it flickers 15/30 on a plain 30° piece
  (checked by a direct dump). Cup is judged on the document alone.
- **The validator:** a second change adds no red in any turn, climb, width or cup case except turn 1/150. There, 2 to 23 extra reds
  are all `self-intersection` (`l139red.js`): a 1/150 turn over 1,000 m loops past 360° and the road crosses itself. The test case is
  at fault, not the ramp. VOID as evidence.

### Amendment A: the bank's way of finding a minimum finds none here

- The bank's minimum came from the adapter re-rounding the bank, which spreads a short second ramp back over the hold. **No other
  field has that re-rounding**, so on the "built road follows the document" criterion the only floor is the knot filter (~0.6 m).
- The joint-feel `a` fires only at L2 ≤ 3 m, and that is weak evidence (Amendment C).
- **A 5 m second turn is laid and read clean, yet it is a lateral jerk no driver wants.** The minimum has to come from a ride rule,
  and the room already has a measured one for these channels.
- **Registered minimum per field:**
  - **turn, climb (rate mode):** `max(20 m, 3·|Δκ| / ROUTE_BAR)`, with ROUTE_BAR = 29.4/(10·170²) /m². This is the panel's
    `routeStartM` (`app/core/panel.js:104-113`, D637), measured for the same two channels with ROUTE_SPREAD 3
    (`test/core_early_turn_climb.test.js`).
    - Examples: 1/300 → 0: 98.3 m. The S, 1/300 → −1/300: 196.7 m. Climb 4°/100 m → 0: 20.6 m.
    - That rule's "at most half the piece" cap does not apply to a second ramp; its room is [from, L].
  - **width, cup:** `AT_START_M` = 20 m, the panel's floor for the same channels at the start (`panel.js:53`, :91). No roll bar
    applies to a width. inferred: the cup's should follow the cross-section rule beside it (`panel.js:66-100`); not measured here.
  - **bank:** unchanged, 15·√Δ° (L135), but see Amendment B.
  - **Every field:** the knot-filter floor stays covered by these minimums (all ≥ 20 m).
- **The unwelcome outcome, said now:** for these fields the minimum is a design rule carried over from the start ramp, not a
  built-road measurement. If the keeper finds a 98 m second turn too long, nothing here says a shorter one builds wrong. It only rides
  harder than the start ramp's rule allows.

## M2 · Corner mode (turn and climb as exact corners)

- Emulated as two Turn-by / Climb-by pieces. In B's build it is one piece.
- **checked:** `shortestTurnBy` from the state after a 90° corner returns **21 m** for a second corner of every size tried (5° to
  270° turn, 5° to 45° climb). The solve converges on two knot spans, whatever the angle.
- **So the corner's existing minimum has no angle in it.** The second corner's minimum is the same rule as the first's: `TURN_TOO_SHORT` /
  `CLIMB_TOO_SHORT` from the state at `from`. And the first corner must fit in [0, from], by its own `shortestTurnBy` ≤ from.
- **inferred:** a 270° corner in 21 m is a validator red on its own; a ride minimum for corners is the same open question as A, for
  corners. It is not registered as a bar, only named.
- **The S (corner +90 then −90 over 600 m, 300 + 300), checked:** it starts at heading 90.000000° and ends at 90.000000°, with kh 0
  and slope 0 at the end. B's one-piece version must match this.

## M3 · The amendment's three-mark piece

**The piece:** 1,000 m, first ramps over 120 m of bank 30°, turn 1/300 and climb 4°/100 m. The second changes:

| field | mark | then |
|---|---|---|
| bank | 700 (70%) | 0 |
| turn | 550 (55%) | −1/300 |
| climb | 800 (80%) | 0 |

All six orders of laying them were tried (`l139marks.txt`); checked:

| field | docLeak to its own mark (worst order) | built | end, slope |
|---|---|---|---|
| bank | 6.3e-6 rad (0.00036°) | 0.00036° | 0, 0 |
| turn | 5.7e-7 /m | 4.6e-7 /m | −1/300, 0 |
| climb | 5.8e-7 /m | VOID (below) | 0, 0 |

- **Each field holds its first value to its own mark,** whatever the order.
- **The order moves the document by at most 2.9e-6 rad on the bank and 3e-7 /m on the climb.** That is the re-quantisation around the
  other fields' inserted knots.
- **The built climb leak is VOID:** 1.68e-3 /m is my reader's error. It reads curvature along the road's own U, and the bank's second
  ramp (from 700) rotates that frame before the climb's mark (800). A world-frame reader is owed.

## M4 · His 11-05 picture's piece, and the L136 M5 carry

**The piece:** turn −90° as a corner, bank +66.14°, cup 15.5, then bank 0 at the panel's default `from`.
- **The length is ASSUMED 750 m.** The picture does not show it.
- checked: the default from is 628.01, which is 750 − 15·√66.14.
- **Peak roll acceleration: 0.02398 °/m² at 652 m, 4.1× BANK_BAR** (0.00583). The built bank is 0 at the end.

### Amendment B: the bank's minimum is below its own bar for EVERY change

- A rest-to-rest quintic peaks at (10/√3)·Δ/L². Holding that under BANK_BAR needs L ≥ 31.5·√Δ° m, and even the bang-bang floor is
  26.2·√Δ°.
- **15·√Δ is under both for every Δ.** So the M5 check ("a second ramp near its minimum peaks over the bar") is not field-specific:
  every second bank laid between 15√Δ and 31.5√Δ is over the bar by construction. That covers his sketch (L136, 2.1×) and his new
  picture (4.1×).
- **The two choices are the keeper's:**
  - raise the bank's minimum to 31.5·√Δ (the sketch's 28.47° would need 168 m against its 112.5 m);
  - or keep 15·√Δ and accept the over-bar peak, which the checker's roll amber already polices.
- Registered as **reported, not a pass condition**. Pinning K = 15 against the bar would fail his own sketch.

### Amendment C: the joint-feel measures cannot see a too-short second ramp

- `joints()` measure `a` compares the step at the joint with the largest step inside the two pieces. A second ramp IS inside the
  piece, so its own step raises the yardstick it is measured against.
- L135 added `ramps` to `allowedAt` for the bank's measure `b` for the same reason. Measure `a` has no counterpart.
- So "joint-feel clean" is **necessary, not sufficient**, for a second turn or climb. The minimum in A is what bounds it.

## THE PASS BAR (scored on B's and C's tips, re-running these scripts against B's real `second` instead of the emulator)

1. **Holds to its own mark:** every field's docLeak over [0, its from] is ≤ 1% of |Δ| (measured 0.59% route, 0.04% cup). The bank
   additionally stays within 0.5° as built (L135).
2. **Minimums, refused by name, each naming its field and its minimum:**
   - turn and climb (rate) `max(20, 3·|Δκ|/ROUTE_BAR)`;
   - width and cup 20 m;
   - bank 15·√Δ;
   - a corner below `shortestTurnBy` at its `from` state, and a first corner that does not fit in [0, from];
   - each scored at minimum − 0.1 m (refused) and at the minimum (laid).
3. **Ends:** every field ends at its second target with slope 0. The C2 channels end with curvature 0.
4. **The three-mark piece (M3):** each field within (1) to its own mark, in every order of the fields; the six orders give the same
   document within 1e-5 of each channel's step.
5. **The S as one piece:** corner +90 then −90 over 600 m ends at the start heading within 0.01°, with kh 0 and slope 0.
6. **No `second`:** byte-identical. Test `L135 7` (`test/core_extend.test.js:159`) stays green and unamended. His sketch's document is
   `sha256 a33c039fa8ccab78cbc3f87d8c4759cedc0ba74baf5eabcd6f26f1a05d9ce39a` (5,248 bytes, `D.serialize`) and stays so.
7. **Mirror on insert** negates the turn's and bank's second targets, not width or cup (the plan's row). Save and open round-trip it.
8. **One mutation row per channel family** (route, cross-section, corner), as `applied N / caught N / NOT APPLIED N`.
9. **M5 carry, reported:** the bank's endPeak against BANK_BAR on the sketch and the picture's piece. Not a pass condition (B).

## THE DEGENERATING SIGNATURE

**The plan's, verbatim:** "an S-turn piece (corner +90 then −90 over a 600 m piece) that does not end straight on the map heading it
started on; any change to a piece with no `second` (byte-identical); his sketch piece changing."

**Added by this measurement:**
- A field's second change moving the document by more than 1% of |Δ| before its own mark.
- The order of fields in `second` changing the document beyond (4).
- Any non-bank minimum set by copying 15·√Δ (the plan's own warning), or set below 20 m.
- A test loosened rather than added to get to green.

## This registration's own falsifier

- If re-running `l139scan.js` on 0df08db does not reproduce `.control` equal:true and the docLeak shares above, the figures are void.
- If B's real build leaks more than the emulator by a factor over 2 in any field, then the emulator was not the bank's recipe, and A's
  "no built-road minimum" must be re-measured on B's code before scoring.

## NOT verified

- **The cup's built road:** my reader was wrong (M1). The built climb in M3 is wrong for the same kind of reason (frame).
- **Edges (e, er):** not scanned. inferred: they ride the same C2 recipe as the cup.
- **Corner mode as one piece:** emulated as two pieces only.
- **His picture's piece:** its length is assumed.
- **The cross-section start-rule sizing for the cup:** not measured.
- **The full suite:** not run (measurement only).

## Corrections

- My first scan run crashed: a climb corner over 45° was evaluated with a NaN aim (my script). Fixed and re-run whole.
- Two readers in my own scan are wrong: the built cup and the M3 built climb. Both are marked VOID above rather than dropped.
