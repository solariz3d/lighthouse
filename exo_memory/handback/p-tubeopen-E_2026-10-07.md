# p-tubeopen-E · D268: opening a full tube back to a road makes a hump · pane E, on D, 2026-10-07 · FIXED; two bar items are wrong as worded (numbers below)

**Commit `090f114`** on t180 main `e850c45`, branch `d268-tubeopen`, worktree `C:/Users/nname/Desktop/worktrees/e-tubeopen-wt`.
- 3 files, +121/−1. Not pushed.
- **Shared file named:** `src/geom/path.js`, ONE line (the road's centre). The adapter, the profiles and the xsec core are not touched. None of A's D267 files are touched.

## 1. Reproduced headless, both ways
- **The plan's rebuild:** straight 300 m (w 44), a piece closing a full tube, 254.1 m opening it (t 360 → 0).
  - The road's centre drops 6.996 m under the drawn curve in the closing piece and rises back inside the first ~64 m of the opening piece.
  - The wall tips go from the ceiling at +7.0 to +15.9 m.
  - Scratch `tubeopen/repro.js`, `rise.js`.
- **The keeper's exact case (amendment):**
  - A COPY of `eq-HUMP BUG` (sha256 `8dc7b717…`, read only, his file never written): 3 closed-tube pieces at w 45, the last still turning.
  - Extended through the panel's own `extendOptions` with his fields: 254.1, turn 0 and climb 0 at start, bank 0, edge 0, edge start 0.64, tube 0. The cup field is disabled for a tube, so it sends nothing.
  - **Width 44 and width 30: the opening floor rises 7.162 m above the head inside the first ~80 m and stays up for the rest of the piece.** Scratch `tubeopen/hump.js`, `hump_base_44.txt` / `hump_base_30.txt`.

## 2. The cause, checked against the plan's three candidates
- **(c) tube and cup on different curves: NO.** A tube piece's profile is `tubeProfile(w, t)` alone (`adapter.js baseProfileOf`), and the cup channel is not read for a tube. The sweep does not overshoot: its maximum is 360.000 at s 0.
- **(b) an edge anchor moving u = 0 off the path: NO, as stated.** The mesh's u = 0 vertex sits on the path sample to 0.0000 m, and the edge angle is 0 (no edge profile).
  - But the path SAMPLE itself is off the drawn curve by the heartline. That is the cause, next item.
- **THE CAUSE: the heartline offset** (`src/geom/path.js:118`, `pos = x − hl·U`).
  - A closed tube's roll axis is its heartline, w/2π, eased in from sweep 300° to 360° (`adapter.js heartlineOf`).
  - The path integrated the AXIS as the user's curve, so the road's centre sat hl below the curve the user drew: 6.996 m at w 44, 7.162 at w 45.
  - Closing a tube dropped the floor that far; opening it lifted it back, which is the hump.
- **(a) radius from width-held-as-round: PARTLY, and it is not a fault.** A fixed-width arc must rise above the closed ceiling while it opens (§4). With the floor lifting 7 m at the same time, the tips rose 8.9 m over the ceiling: the two lobes and the spike seen from inside.

## 3. The fix
- **For core tube segments only** (they carry `heartline1`; `adapter.js xsecSegments`), the road's centre is **`x + hl·(U0 − U)`**:
  - ON the drawn curve while the tube is not rolled (U = U0);
  - turned about the axis, hl above the curve, when it is rolled (the spiral, seal S2 ii).
- **A word's constant heartline** (no `heartline1`, INTERFACES §1, the rider's heart above the track) keeps `x − hl·U`, bit for bit.

## 4. Against the registered bar
| registered | base `e850c45` | `090f114` |
|---|---|---|
| u = 0 on the path at every station, ≤ 1 cm (path = the curve the user drew) | **6.996 m** off (rebuild), **7.162 m** (HUMP BUG, w 44 and 30) | **0.000** at every station, all three cases |
| no floor point rises above the path more than at either end, \|u\| ≤ the end's half-width | the floor's centre +7.0 m; tips 8.9 m over the ceiling | floor centre 0.000 everywhere. **Tips: up to 1.93 m over the closed ceiling** (15.92 vs 13.99) at s ≈ 85 m. **THE BAR IS WRONG HERE** (below) |
| no self-fold (the self-check is clean) | clean | clean (0 intersections, 0 stacked), all cases |
| closed-tube and flat-road ends byte-identical | — | **cross-sections byte-identical** (no segment changes) and the **flat-road end is in the same world place**. **The closed-tube end moves up by hl**: that move IS the fix, so the bar's "byte-identical" holds for the shape, not the position |

**Why item 2 cannot be met by any fixed-width circular opening:**
- An arc of width w and sweep θ rises (w/θ)(1 − cos θ/2) above its centre. That peaks at **0.3627·w** near θ ≈ 263°. The closed tube's ceiling is w/π = **0.3183·w**.
- So the tips must pass the ceiling by about **0.044·w (1.95 m at 44 m)** somewhere while it opens.
- Measured: 1.93 m. The closing piece does the same today, mirrored.
- The honest form of item 2 is "the walls rise no more than the arc of their own sweep must". That is test row 3, green, and it holds on the base too.
- Meeting the literal item would need a different opening SHAPE (not circular, or a width that changes while opening). That's the keeper's design call; not done.

## 5. What changes for saved tracks (scratch `tubeopen/effect.js`: base vs branch, 8 copies of the keeper's tracks)
- **Tracks with no closed tube:** 0 samples moved (T-180 OVAL, TEST OVAL, TEST, TEST 1, TEST 1 recovered).
- **All-tube tracks:** move up as a whole by hl.
  - T-180 TUBE OVAL: 6.366 m, every sample.
  - TUBE V2 and FINAL TEST: 7.162 m.
  - A mixed track loses its dips into and out of the tube.
- **The overlap check's answer is identical on all 8** (TUBE V2: 4 overlaps before and after).
- **Downstream:**
  - Sculpt's route guard (`app/core/centreline.js`) still refuses width and bank edits on a closed tube. It compares segment fields, so it is conservative and still correct.
  - Its comment (":8 the road's centre is then the heartline minus heartline * U") is now true only for words. That's C's/A's file, so I left it alone and name it here.
  - Water still refuses a heartline by name.

## 6. Tests (under the lock, serial shim)
- **`test/core_tube_open.test.js`, 6 rows:**
  - 1: on the curve, ≤ 1 cm;
  - 2: the floor level through closing and opening;
  - 2b: the keeper's case through `extendOptions` at widths 44 and 30, on a track that starts as a closed 45 m tube, still turning;
  - 3: the walls within their own arc, and the self-check clean;
  - 4: the cross-sections untouched and the open end on the curve;
  - 5: a ROLLED closed tube is hl from its axis (x + hl·U0), and a word's heartline is unchanged.
- **Red first on `e850c45`:** rows 1, 2, 2b and 5 fail with the registered numbers (6.996 m; 6.996 m; "width 44: … 7.162 m"; "14.2794 m from the axis, the heartline is 7.1397"). Rows 3 and 4 are guards. `tubeopen/base.tap` sha256 `34417bf8…`; branch 6/6, `new.tap` `fbf20d42…`.
  - **My own fixes on the way:** row 3 first judged the straight's bowl-shaped end row, which is no arc; row 4 read a field segments do not carry. Both were fixed before the run counted.
- **Targeted:** every `test/core_*` (fixtures included: `core_cup_fixtures`), geom_*, validate_*, export_tube_grid / merge / cup_export, underskin, texture_flow, and app `core-xsec`, core-sculpt, core-shell, core-close-preview, preview-async, preview-speed, cheap-ghost, look, aclook, validate-ui and the other heartline/tube readers. 69 files: **1,038 tests, 1,034 pass, 0 fail, 3 skipped, 1 todo**. `tubeopen/build.tap` sha256 `4082ace7…`.
- **No existing test pinned the old 7 m offset.**
- **Not run:** the full suite and both xsec mutation harnesses (the librarian's at landing), and AC.

**For the keeper:** his tube tracks will sit up to 7 m higher, with the floor now where he drew it. That is the fix showing, not a new move.

Scratch base worktree `tubeopen/base-wt` (detached `e850c45`) is mine to remove.

## Landing hold (the chair's 11:4x packet): test/core_xsec_mutation 57/60 → **60/60**
**Commit `0014555`** (test-only) on `ed97512` (0.3.2), branch `d268-xsec-mutants`, worktree `C:/Users/nname/Desktop/worktrees/e-xsecmut-wt`. 2 files, +26/−3. Not pushed. No row weakened; no survivor showed a real bug.
- **KS2-2 (heartline constant per segment) and KS2-4 (`HEARTLINE_FROM` 180) are NOT equivalent: the rows lost their reach.**
  - My fix keeps an UNROLLED tube's centre on the curve whatever hl is, and the tubes of "S2 (i, ii)" and "X1 and T2" close unrolled, so there they cannot show.
  - A ROLLED tube still turns about its axis (x + hl·(U0 − U)), so the heartline's easing shows there. Two new rows in `test/validate_xsec.test.js`:
    - **S2 (vi):** a tube that closes while banked 60°: the road centre steps ≤ 1 mm at every segment joint. KS2-2 would step it by Δhl·|U0 − U| per segment.
    - **S2 (vii):** an open tube at 270° rolled 90° keeps its centre on the drawn curve within 1 mm, since it has no axis of its own below 300°. KS2-4 would put it ~R/2 off.
  - The two mutants select these rows BESIDES their old ones: `S2 \(i, ii\)|S2 \(vi\)` and `X1 and T2|S2 \(vii\)`.
  - The new rows were named (vi)/(vii) because "S2 (iv)" is already the water row; my first naming would have selected it too.
- **KE4-2 re-anchored, the same mutant:** e reset after a flight, like the heading rate.
  - Its anchor left `document.js` with D258 (`1e76d35`); the state after a flight is now `afterFlight`.
  - The new anchor is `h: { v: 0, m: 0 }, l: { v: 0, m: 0 }, phi: { v: F.bank, m: 0 } });`, which occurs exactly once. It is still judged by E4 (ii).
- **Runs, under the lock:**
  - `validate_xsec` + `core_xsec` on the unmutated tree: 38/38.
  - **`test/core_xsec_mutation.test.js` ONCE: 60 tests, 60 pass, 0 fail** (control included; KE4-2, KS2-2 and KS2-4 each "applied, and caught"). Scratch `tubeopen/xsecmut.tap` sha256 `da5d4b4d…`, 306 s.
- **My own slip, fixed before the commit:** a `sed -i` turned both test files' CRLF to LF, so I restored CRLF; the diff is the 26 lines only.
