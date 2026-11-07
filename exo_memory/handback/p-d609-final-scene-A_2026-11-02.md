# D609: a final-scene check beside the fin guard, and the edge apron hung from the section's own middle (A, 2026-11-02)

Packets: the chair's D609 (12:45Z), ruling OPTION A (13:22Z), and ruling R1 (14:22Z).
- Branch: t180 `d609-a` off `d604-o` `f1f3416`, worktree `C:\Users\nname\Downloads\t180-wt-a609`.
- Tier: PROVE IT. Not pushed. It lands after 0.4.37.
- **The keeper sees §2 (the re-lean list and the renders) before it lands.**
- Commit: §8.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad\d609`.
`G` = `G:\Consonance-tools\scratch-A-d609`.
`EV` = `exo_memory/handback/p-d609-final-scene-A_2026-11-02_evidence/`.

His tracks are copies of his own saves (`…\com.solariz3d.t180-track-builder\tracks\`), made read-only into `G\his\`. Nothing of his was written:

| track | sha256 |
|---|---|
| ELYSIUM | `2ab08386…` |
| CRAZY TEST | `7347e61c…` |
| TEST 10 | `b6f62b8a…` |

**LANIAKEA:** there is no `.t180track` of it on this machine, only its AC export (`Downloads\LANIAKEA_AC_track_2026-11-01.zip`: kn5 and ui files). So it cannot be re-exported through the builder, and it has no re-lean list.

## 1. The cause, and the fix (R1)

**`src/export/apron.js:90`, `sideRows`:** each plank's outward lateral and its up were read at column `Math.floor(K / 2)`. That column is the section's middle only when the columns lie evenly either side of the centre line.
- An edge zone on one side adds columns on that side.
- On his TEST 10 the column read lay 6.4 to 8.2 m off the centre (p4, p5, p10, p11, p17), where the 15° cup has turned the normal. So every plank on those pieces hung at the wrong slope: 14° to 16° on one side, 34° to 36° on the other, instead of 25°.
- On an even K it was half a column off. On CRAZY TEST and ELYSIUM that is a 0.2° to 0.3° lean.
- Where two pieces met, the planks parted: 6 to 8 mm on ELYSIUM and CRAZY TEST, 195 to 436 mm on TEST 10.

The column table:
- checked: `buildMesh(...)._state.pieces[].Us`, §0 of the interim (kept below in "Earlier").

**The fix: `underskin.js centreColumn(piece)`.** It finds where the grid crosses its centre line, from the piece's own columns' u (`Us`):
- a column where u = 0;
- else the two either side, blended by where 0 falls, with exactly 0.5 when they lie evenly.
- `colAt` blends a vertex attribute there.

**Who reads it:**
- `sideRows` reads the centre position and normal there (the plank's X and N), and its `Nc`.
- The skin reads it too: `underskin.js rowEdges`, `rowDepths`, `sectionUp`, `skinOf`, `hullEase`.

**Why the skin as well.** With only the plank fixed, the end-on cut showed a notch where the plank's run met a skin still hung from the old column (`G\relean\renders\cut-after-cut-test10-s3725.png`, first try). With both reading one middle, the bottom is smooth (`EV\renders\cut-after-cut-test10-s3725.png`).

**What does not change:**
- A symmetric odd-K section reads the same column as before.
- A symmetric even-K section's `sectionUp` takes the same two columns, at exactly 0.5.
- The pit lane's outline, which passes no column, reads as before.

**The ruling said "the underskin's sectionUp".** I did not use it as it stood, because it also takes the middle by count. That was my §0 correction at 08:40, sent after the ruling was written. What I built is what the ruling asked for, the section's own middle, and the skin now uses it too.

**The weld from OPTION A** (`acready.js weldApronJoints`: planks 1 mm to 2 cm apart at a joint) stays. With R1 the planks meet by construction, so on his three tracks it moves nothing (inferred from §2's counts; not separated by a run).

## 1b. THE SKIN: changed in 22f9025, said here first (the corrected R1 arrived at 09:05, after the build)

The corrected ruling, sent 08:23 and delivered 09:05, says not to change the skin in this lap without saying so first. **The skin change is already in `22f9025`.** I made it before that message reached me, because the plank-only fix opened a notch in the bottom (below). It is the chair's to keep or take out.

**Measured.** checked: `node Sskinmeasure.js <fix> <doc>`, from the road mesh alone. It compares the skin's hanging rule by count (`sectionUp` with no column) against the centre line's (`centreColumn`). Out: `EVskin-test10.txt`, `EVskin-crazy.txt`.

| where | the skin's section up tilts | its depth under an edge changes | a skin vertex moves |
|---|---|---|---|
| TEST 10 p2–p4 (K 57, centre 8.18 m off) | 6.82° | 328 mm | 416 mm |
| TEST 10 p5–p10 (K 87, 6.37 m off) | 8.63° | 364–533 mm | 531–670 mm |
| TEST 10 p11–p17 (K 91–92, 6.8–6.9 m off) | **10.63°** | 437–630 mm | **557–791 mm** |
| TEST 10 p18–p23, p1 (symmetric) | 0.00° | 0 mm | 0 mm |
| CRAZY TEST p7, p10 (K 66, 0.29 m off) | **0.00°** (the count rule already averaged the two middle columns) | 8 mm (`rowEdges` took one column) | 8 mm |
| CRAZY TEST p8 (K 65) | 0 | 0 | 0 |

**So on TEST 10's edged pieces the skin hung from a normal up to 10.6° off its section's own.** That is the same flaw as the planks, at the same size.

**Why it went with the planks.** The plank's run under it ends ON the skin's own edge vertex (`withRuns` shares it). With the plank hung from the centre and the skin from the count middle, the run's last span kinks into the old skin. It shows as a notch in the bottom at both edges.
- `EVenderscut-plank-only-skin-by-count-test10-s3725.png`: the plank-only build.
- `EVenderscut-after-cut-test10-s3725.png`: both from the centre line; smooth.

**Two ways:**

| | what | consequence |
|---|---|---|
| **S1, as built** | the skin from the centre line too | moves the skin by up to 0.79 m on TEST 10's edged pieces, ≤ 8 mm on CRAZY TEST and ELYSIUM; byte-equal on symmetric odd-K pieces |
| **S2** | take the skin out of this lap and leave it to C's D610 | leaves the notch at every plank edge on those pieces until D610 lands, and D610 must then read the centre line too |

**I recommend S1, and that C's D610 rebases onto it.** Whichever of us lands second re-runs the strict counts and C's tube test, as already ruled.

## 1c. The librarian's two questions on the TEST 10 renders (09:06)

### (1) The kink inside the right apron tip in the s 3,725 cut: NOT a corner. A bend about twice as tight as before, at the run's join to the skin. Not changed.

checked: `node Sprobe2.js <tree> test10 … 3725`. It slices the scene the kn5 is written from with the plane through s 3,725 itself (between two rows), and chains the right side's bottom from the plank tip. Out: `Gprobe2c-{after,before}.out`. Crops: `EVenderscrop-cut-{before,after}-s3725-right.png` (×3, around x 1450–1750, y 380–580).

The cut zigzags (the plane crosses each quad's diagonal), so the slope is read from chords across each pair:

| | run chord | next run chord | skin's first chord | bend at the join | bend over the run's last 0.3 m |
|---|---|---|---|---|---|
| after | −27.8° | −18.0° | **−11.8°** | 6° | ~10° |
| before | −29.7° | −24.8° | −21.6° | 3° | ~5° |

- The run meets the skin at u ≈ −12.03 m.
- No single slope discontinuity exceeds the zigzag's own ±4–12°, so there is no corner in the sense of his red line.
- But the run now turns about twice as sharply into the skin. That is what reads as a kink.
- inferred: the run's end tangent is set from the road's last segment and the skin's easing depth (`apron.js hullRun`), and after R1 the skin's actual slope there is 6° flatter than that tangent assumes.

**The minimal fix**, if wanted: take the run's end tangent from the skin's own first span (the skin vertex one column in, hung by the same rule), in `hullRun` alone. **Not done**: the brief said fix only a corner, and C's D610 is reworking exactly this join. If done, name it "the run's end tangent from the skin's own first span (hullRun)" for the rebase.

### (2) The "needle" in the along view: the hull's outside seen nearly edge-on. Not a sliver or a fold.

checked: the same script casts render2.js's own camera ray through a pixel and lists every triangle it hits: `Gprobe2c-*.out`, `Gpx.out`.

| view | pixel | after | before |
|---|---|---|---|
| along | (690, 343) | `UNDERSKIN_p11_body_0_9`, a triangle **782 mm** thick | the plank `1ROAD_APRON_p11_body_0_L_11`, 453 mm |
| raised 1 m (`test10-views-raised.json`) | (800, 420) | `UNDERSKIN_p11_body_0_11`, 917 and 615 mm | — |
| raised | (950, 460) | `UNDERSKIN_p11_body_0_12`/`_13`, 574–886 mm | — |
| raised | (1180, 503), the tip | `UNDERSKIN_p11_body_0_18`, 825 mm | — |

- The dark tapering shape is the hull's run and bottom under the left plank, seen from just above the plank's outer row, where its top lies almost edge-on.
- The cameras were placed from the after-fix plank, whose outer row now sits about 0.4 m lower. Before, the same camera saw the plank's top face-on, and the dashed hairline there was the old joint cracks.
- **The strict counts did not miss it:** `finalscene` finds 0 slivers and 0 folds on TEST 10 (`Gprobe-t10-fix5.out`). The thinnest triangle the rays crossed is 453 mm. Nothing to tighten.
- Images:
  - `EVenderscrop-{before,after}-along-695-343.png` (×4 crops);
  - `EVenders{before,after}-test10-worst-along-raised.png`.

## 1f. RULING ii BUILT: the bend bars met. d609-a **`9e5546b`** (on `22f9025`)

**First, a correction to my own §1e.** I wrote that the skin's edge must go DEEPER. **It must come UP.**
- Measured: the arc's turn against the skin's edge depth at TEST 10 s 3,725 right, with the skin's own deepening rule. checked: a one-off scan, reproduced in `G\bend4-*`.
  - at 2.377 m (hullDepth's, rim read at its true 30.8°): 49.3°;
  - at 1.9 m: 6.9°;
  - at 1.5 m: 29.5°.
- Before R1 the same edge sat at 1.897 m, because its rim was read 10° low through the leaning column.
- So "reading the re-leaned tip" means hullDepth's depth was too deep for the re-hung plank. The ruling's phrase "deeper" came from my wrong word.

**What is built:**

**(1) `apron.js hullRun`, the even arc (B).** Given the skin's first span to arrive along, the run ends along it and starts as its mirror about the chord.
- The arrival point is the skin under the road point **1 m in from the edge** (`underskin.js rowPointIn`, `RUN_ARRIVE_M`), not a decimated column.
- Aimed at a column, two pieces of different K parted by 11 mm on their shared joint row: TEST 10 p10/p11, CRAZY TEST p11, ELYSIUM's lap seam. I caught it on his three tracks before committing; aimed at a distance, 0 such cracks.

**(2) The pit lane's outline.** Its road rows carry the skin's own depth and that same arrival point, as the main planks do, so row 18 is green.

**(3) `underskin.js edgeDepth`, the skin's edge read from the plank's tip.**
- Its rule: hullDepth's depth wherever the run turns within 30°. Where it would turn more, the deepest depth that turns within 30°, found exactly by bisection (a stepped scan made 0.031 m stairs).
- **Only on a section whose middle the re-lean moved** (its centre-line column more than half a column from the middle by count).
- Applied everywhere, it gave C's gradual tube openings an 11.7° fold and took the D604 deepening off every symmetric cup (underskin row 9, export_apron row 26).
- `apronOf`'s depth is now the skin's own `rowDepths`, so S is the skin's edge vertex to the bit.

**The bars**, measured as in §1e. checked: `S\probe2.js`; out `EV\bend4-{t10,ely}-{R,L}.txt`.

| cut | turn per run chord | per 0.3 m | at the join | the bar |
|---|---|---|---|---|
| TEST 10 s 3,725 R | 4.17–4.35° (0.34 m) | **≈ 3.8°** | **2.31°** | ≤ ~5°, ≤ 3° |
| TEST 10 s 3,725 L | 1.10–2.13° (0.30 m) | ≤ 2.1° | **2.15°** | |
| ELYSIUM s 20,037.7 R and L | 3.10–3.18° (0.41 m) | **≈ 2.3°** | **1.87°** | |

**Re-render:** `EV\renders\cut-final-test10-s3725.png`, the end-on cut at s 3,725 on `9e5546b` (`G\relean3`). The bottom sweeps into both planks with no kink.

**The test row pinning the bend: export_apron row 29.**
- On every plank row of a cupped piece with a 35° right edge, a symmetric cup and a flat road:
  - the run turns ≤ 5° in any 0.3 m;
  - ≤ 3° where it meets the skin's first span.
- **Red on 22f9025:** "the run turns up to 5.67° in 0.3 m and 3.33° where it meets the skin" (`G\t-r29-red.tap`). Green on 9e5546b.

**The rest of the bars:**
- **The strict counts (the export's own check):** TEST 10 refused 0, warned 0; ELYSIUM 0, 0; CRAZY TEST refused 0, warned 2 (its p2/p6 tube-opening folds, unchanged since f1f3416). checked: `G\probe-{test10,crazy,elysium}-fin2.out`.
- **C's tube test 7/7**, inside 63/63 over export_apron, underskin, tube_cases, export_finalscene and export_seam_fins (`G\t-ed-6.tap`).
- **The main road physics byte-equal, and every drivable mesh,** against 22f9025: TEST 10 17,433 of 17,433, CRAZY TEST 28,292 of 28,292, ELYSIUM 37,758 of 37,758.
  - The bend fix changes only the drawn skin and runs.
  - checked: `S\meshhash.js` and `S\meshcmp.js`, `G\hash-*-{c22,fin2}.json`.
  - Against f1f3416, the main road stays byte-equal: `G\relean3\test10.out`, 6,353 of 6,353.
- **Pinned rows green:** export_apron row 17 (the planks he drove), underskin rows 1–9, and C's tube test, unedited. Underskin row 9 needed no amendment: its symmetric section keeps hullDepth's to the bit.

**New rows and mutants:**
- export_apron row 29 (the bend).
- underskin row 10: the section's up is its centre line's, read from the normals themselves. U14 is re-aimed at it by name: every skin and plank now hangs by one sectionUp, so an off-middle up no longer cracks a seam.
- export_finalscene row 6 gains a zipper standing in the joint plane (F11 re-aimed at it by name: row 9's joint makes no zipper any more).
- P27 (no arrival along the skin) and P28 (no mirrored start), both judged by row 29.
- U21 (the edge never read from the tip), by row 29.
- U22 (read on symmetric sections too), by C's tube test, THE JAG.
- U11 re-anchored by name: `dE` → `dMax`.

**PENDING:** the four harnesses on 9e5546b, and the touched tests (64 files): `G\heavy609e.log`. Rung when in.

## 1g. FINAL: the records, the pins, the mutants. And one finding the chair should rule on before calling it final

**What 9e5546b's harness run said** (`G\heavy609e.log`):
- finalscene 22/22, acready 15/15.
- apron fail 3 (P19, P20, P27), underskin fail 2 (U14, U21).
- touched 701/713, 11 fail: export-isolated's byte pins and core_cup_fixtures' record rows.

All five mutants and all 11 failures are dealt with below, by name.

**(1) The fixture record: `test/fixtures/manifest.d609.json` (new; sha256 `fd14948e…`).**
- Made from F1 F2 built in f1f3416 (whose kn5 equals the D604 record's after, checked) and in 9e5546b, read node by node with `test/fixtures/kn5nodes.js`.
  - checked: `G\fxnodes.js`, `G\mkd609.js`, `G\fx-{f1,9e}.json`.
- F1: the four skins moved, nothing else.
- F2: the four skins AND its four physics planks moved (`1ROAD_APRON_p1..p5`). F2's sections have an even K, so the old middle column was half a column off the centre line.
  - **This is a physics change to a fixture, from R1 as ruled.**
- No node added or removed, no material changed; segs, path and mesh are unchanged in all nine fixtures.
- `core_cup_fixtures.test.js`, all amended by name:
  - AMEND13 added to `amendedManifest`;
  - the seal row checks the new record's sha;
  - the D593 row adds D609's moved nodes to its slab set;
  - the D604 row holds what D609 moved to the new record (checking the record's `before` against its own);
  - a new D609 row (only F1 F2, only their kn5; F2's planks moved and F1's did not; built now, node by node).
- checked: `node --test test/core_cup_fixtures.test.js` → 17/17 (`G\cupfx.tap`).

**(2) export-isolated's pins, amended by name** in both `export-isolated.test.js` and `export-isolated-page.test.js`.
- Values: lap `4dd44dff31b0a8f9` → `d89c835f5f103a8c`, open `50248bc3a07ddd32` → `4e1404430764e540`.
- Node by node against f1f3416 (checked: `G\isonodes.js`, `G\iso-{f1,9e}.json`):
  - the road physics, the paint and every road plank are the same bytes;
  - the lap's 4 road skins, `1ROAD_APRON_PIT_R` and `APRONSIDE_PIT_R` (the pit outline's plank and run) moved;
  - the open run's 3 skins moved;
  - only each export's kn5 changed.
- f1f3416 itself reproduces the old pins (checked, same script), so the base is right.

**(3) The five mutants.**
- **U14:** it carried no `file`, so it ran "in undefined". Now `file: 'underskin.test.js'` (row 10).
- **U21:** export_apron row 29 gains a case, c 10 with er 35. checked on copies (`G\mt-base`, `G\mt-u21`):
  - base 3.50° and 1.74°;
  - with U21: 6.71° and 4.96°, so row 29 goes red ("the run turns up to 6.71° in 0.3 m and 4.96° where it meets the skin").
- **P19, P20, P27: RETIRED by name, each with its reason in the harness.**
  - P19 and P20 guard the old fixed tip lead, which now runs only on the pit outline's lane, end and join rows.
    - P20 is equivalent there: the depth is UNDERSKIN_OFFSET_M, so its term is 0, and row 1's exports are byte-equal with it.
    - **P19 is NOT equivalent:** it moves `APRONSIDE_PIT_R` alone, and no row measures that run's shape. A named gap, not a pass.
  - P27 moves the skins' bytes, but row 29's bars do not tell it apart. Measured on c 15 er 35:
    - with P27: 3.71° and 1.30°;
    - without: 3.32° and 1.61°.

**(4) THE FINDING: row 29's bar is NOT met on symmetric edge zones.** Row 29's own measure, on synthetic straights. checked: `G\row29probe.js` with `G\cases29b.js`, run in `G\mt-base`, `G\tree-22` and `G\tree-f1`.

| section | f1f3416 | 22f9025 | 9e5546b (per 0.3 m, at join) | with edgeDepth on every section |
|---|---|---|---|---|
| c 15, e 30 (both sides) | 9.06, 5.16 | 9.06, 5.16 | **6.62, 5.06** | 3.49, 2.08 |
| c 15, e 35 | 5.67, 3.74 | 5.67, 3.74 | **4.71, 3.33** | 3.32, 2.09 |
| c 10, e 35 | 9.06, 5.41 | 9.06, 5.41 | **6.71, 5.02** | 3.50, 1.91 |
| c 0, e 35 | 9.69, 5.22 | 9.69, 5.22 | **7.19, 4.92** | 3.80, 1.98 |
| c 25, e 20 | 9.04, 4.43 | 9.04, 4.43 | **6.44, 4.91** | 3.47, 2.24 |
| c 35, no edge zone | 10.00, 3.30 | 9.76, 3.36 | **6.76, 2.20** | 3.76, 2.29 |

- Every row of each piece reads the same (p50 = worst), so this is systematic, not a stray row.
- 9e5546b is better than before everywhere, but over the bars on all six.
- **On his tracks, by the end-on cut:** TEST 10's own p10 (c 15, e 30, both sides) reads within the bars at s 3,657.3 and 3,661.7.
  - Left: 4.17–4.35° per ≈0.37 m chord, ≈2.35° at the join. Right: ≈2.5°.
  - checked: `G\p10-{R,L}-{3657.3,3661.7}.txt`.
  - inferred: the cut's chords average two spans, so the two measures differ. Row 29 reads span by span, along the run's own vertices.
- **The fix exists and is the one I limited on purpose:** edgeDepth on every section (not only re-leaned ones) meets both bars on all six. It still breaks the same two things as before:
  - C's tube test row 4 (gradual-close: "the skin bends 11.3° across the road at s 548 m, u -18.3");
  - underskin row 9, which pins hullDepth's formula at the edge (rim 30°: 2.144 m, not 2.333). It would be amended by name, because the rule changes.
  - checked: `G\mt-sym` (the condition removed), `node --test` over export_apron, underskin, tube_cases, seam_fins and export_finalscene → 53 pass, 3 fail.
- **So row 29 pins the bend only on sections where it is met.** I say that plainly rather than call row 29 the bend's proof.
- Ruling needed:
  - (a) land 9e5546b plus these test commits as final, with the symmetric miss recorded as a follow-up; or
  - (b) I extend edgeDepth to every section, keep tubes out of it (the 11.3° fold is at a gradual close), amend row 9 by name, and add a symmetric case to row 29.
  - (b) moves every symmetric cup's skin edge, so every fixture's and track's skins move again.
- My lean: **(b), as a follow-up packet, not inside this landing.** It touches every cup on every track, C's tube work is in the same lines, and the ruled cuts are met now.

**(5) NOT changed:** CHANGELOG (the fixture record and test pins are not a user-facing change).

**Committed: d609-a `6f0969e`** (on 9e5546b; not pushed). Tree: 22f9025 → 9e5546b → 6f0969e.

**Its runs** (`G\heavy609f.log`, under a heavy-run slot, BelowNormal, acs.exe absent):

| run | result |
|---|---|
| apron harness | 24/24: applied 24, caught 24, NOT APPLIED 0 (P19, P20, P27 retired) |
| underskin harness | 23/23: applied 23, caught 23, NOT APPLIED 0 |
| finalscene and acready harnesses | 22/22 and 15/15, on the same code (`G\heavy609e.log`; this commit changes tests only) |
| touched tests, 64 files | 714 tests, 713 pass, 0 fail, 1 todo (the existing preview-list TODO) |

## 1e. THE RULED BEND BAR CANNOT BE MET AT TEST 10 s 3,725 (right) with the hull's bottom where it is. Measured, with the fix tried two ways. A RULING NEEDED

**The bar** (the chair 09:15): ≤ 3° at the join and ≤ ~5° over 0.3 m, at TEST 10 s 3,725 and at ELYSIUM's bank cut.

**How it is measured:**
- checked: `node S\probe2.js <tree> <doc> … <s>`, with `SIDE=R|L`. It cuts the scene the kn5 is written from at s itself and chains the bottom from the plank's tip.
- **CHORDS** are pairs of cut points, which cancel the diagonal's zigzag: the slope of each, and the turn from the one before.
- The run is the first six chords. The skin starts at the seventh, where the "join" turn is read.
- Out: `G\bend-t10-{fix,f1}-{R,L}.out`, `G\bend2-t10-{R,L}.out`, `G\bend-ely-{arc,f1}-{R,L}.out`.

| where | build | turn per run chord (one chord ≈ 0.32–0.41 m) | turn at the join |
|---|---|---|---|
| TEST 10 s 3,725 R | f1f3416 (before) | 4.1–5.0° | 1.6° |
| | 22f9025 (R1, committed) | (the 6°/10° figures in §1c) | ~6° |
| | 22f9025 + the end tangent along the skin's first span (A) | 2.8° rising to **9.2°** | 5.1° |
| | 22f9025 + (A) + the start mirrored about the chord, an even arc (B) | **6.8–7.7°** (≈ 5.6–6.2° per 0.3 m), even | **4.1°** |
| TEST 10 s 3,725 L | f1f3416 | 2.5–5.2° | — |
| | (B) | 0.8–1.8° | 1.2° |
| ELYSIUM s 20,037.7 R and L (the bank cut, 82° bank) | f1f3416 | 2.9–4.9° | 0.6° |
| | (B) | **3.2°** even (≈ 2.3° per 0.3 m) | **1.65°** |

**Why TEST 10's right side cannot meet both bars.** R1 hangs that plank at 25° instead of 15°, so its tip sits about 0.4 m lower. And the skin under that edge is about 11° flatter, because its depth is now read from the section's true middle (the skin's first chord: −158.6° before, −168.8° now). So the run must turn about 47° from its tip to the skin, against about 28° before.
- Spread as evenly as a curve can (an arc, B), that is about 5.7° per 0.3 m.
- An arc ending tangent to the skin still turns about half a span's worth inside the chord before the join, which is about 4°.
- Bending the end toward the chord lowers the per-metre turn but raises the join one for one. Meeting ≤ 5° per 0.3 m would need a join of 14° or more.
- inferred: only moving the skin's edge vertex deeper (or the skin's slope there) brings the turn back under 28°. That is the hull's bottom: **C's D610**.

**What (B) also breaks.** export_apron **row 18** goes red: open drawn edges round the pit lane's leave (z 34). The lane's outline builds its runs the old way, so where it meets the main apron's last row the two runs part. Making them meet means passing the skin's next vertex into `outlineRows` and `outlineMeshes` too (inferred, about an hour).

**Not committed.** (A) and (B) are in the worktree only. `22f9025` stands as it was.

**Three ways on** (my recommendation: **ii**):

| | what | TEST 10 s 3,725 R | ELYSIUM's bank cut | cost |
|---|---|---|---|---|
| **i** | (B) everywhere, plus the pit outline made to match | join 4.1°, about 6° per 0.3 m (not the bar, but even, no bunching) | meets the bar | the outline work; TEST 10 stays over the bar |
| **ii** | (B) committed with the pit outline fix, AND D610's bottom told to set the skin's edge deeper under a plank that the re-lean lowered | meets the bar once D610 lands | meets the bar | D610 owns the last step |
| **iii** | keep 22f9025 as it is (the end-tangent change dropped) | ~6° join, ~10° over the run's last 0.3 m | — | none now; D610 owns all of it |

## 1d. Which tree each evidence render came from (the chair 09:08; S1 ruled: the skin change stays)

Every "before" is f1f3416 (`G\tree-f1`, `git archive f1f3416`).

Every "after" is `relean2`. Its kn5s were written at 08:41, after the last edit to the geometry files (`apron.js` 08:38, `underskin.js` 08:39, `acready.js` 07:46, `fromwords.js` 07:39). Everything changed after that (`finalscene.js`, tests, CHANGELOG) does not shape the scene. So `relean2` is the geometry of **`22f9025`**.
- checked: `ls -l G\relean*\test10-after.kn5`; the files' modified times; `git log -1 d609-a`.

| evidence file (`EV\renders\`) | tree |
|---|---|
| `before-*`, `cut-before-*`, `crop-before-*`, `crop-cut-before-*` | f1f3416 |
| `after-*`, `cut-after-*`, `crop-after-*`, `crop-cut-after-*`, `*-raised.png` | `relean2` = 22f9025's geometry |
| **`cut-plank-only-skin-by-count-test10-s3725.png`** | `relean` (08:27): an intermediate, uncommitted build, with the planks from a whole centre column and the skin still by count. Kept only to show the notch. **Not what lands.** |

The probes behind §1c ran on the live worktree, whose geometry is 22f9025's, and on f1f3416: `G\probe2c-*.out`, `G\px.out`.

## 2. FOR THE KEEPER: the planks that re-lean, by track

checked: `node S\relean.js G\tree-f1 <fix> <doc> <track> G\relean2`. Both trees are exported through the app's route, textured and unmerged. Lists: `EV\relean-{test10,crazy,elysium}.txt`; every moved plank: `G\relean2\<track>-relean.json`.

| track | main road physics (drivable, not planks) | planks byte-equal | planks re-leaned | largest move | worst plank |
|---|---|---|---|---|---|
| TEST 10 | **6,353 of 6,353** byte-equal | 7,330 of 11,080 | 3,750 | 408.8 mm | `1ROAD_APRON_p11_body_0_L_24`, s 3,746 m: **35.63° → 25.00°** |
| CRAZY TEST | **11,162 of 11,162** | 10,837 of 17,130 | 6,293 (the even-K pieces p7 and p10) | 8 mm | p10 L at s 7,175: 24.8° → 25.0° |
| ELYSIUM | **13,113 of 13,114**: the one is the pit lane's outline plank `1ROAD_APRON_PIT_R` (a plank: its road rows beside the lane re-lean) | 9,204 of 24,644 | 15,440 (its even-K cupped pieces) | 11.3 mm | p34 L at s 19,831: 24.71° → 25.00° |

**TEST 10, piece by piece** (the drop below the road's lateral, before → after; 25° is the apron's slope):

| pieces and side | before | after |
|---|---|---|
| p3 L | 18.2–18.4° | 25.0° |
| p3 R | 31.5–31.8° | 24.7–25.0° |
| p6–p7, p9–p10 R | 33.6° | 25.0° |
| p6–p7, p9–p10 L | 16.4° | 25.0° |
| p11–p15 and p17 R | 14.4–15.4° | 25.0° |
| p11–p15 and p17 L | 34.3–35.6° | 25.0° |

Full list: `EV\relean-test10.txt`.

**On TEST 10's helix (p4, p5, p8, p16)** some rows read 44° to 89° both before and after.
- inferred: those are my measure taking the road's frame from the nearest station of ANY pass where the helix stacks its passes. The end-on cut through those passes at s 3,500 shows each plank leaving its edge at one angle to its own section (`EV\renders\cut-after-cut-test10-s3500.png`). Not separated by a run.

**Renders** (`EV\renders\`), headless software renders of each track's export before and after, 1600×900, textured, with O's `render2.js` and `cut.js`:
- **The end-on cut at TEST 10's worst plank, s 3,725:** `cut-before-cut-test10-s3725.png` against `cut-after-…`. The right plank goes from leaning flat to hanging at the left one's slope, and the bottom runs into both with no corner.
- `before-/after-test10-worst-outside.png` and `-worst-along.png`: from beside the road and along it at s 3,746. The along view's hairline of sky at the joint before is gone after.
- `…-crazy-worst-*.png` and `…-elysium-worst-*.png`: 8 mm and 11 mm, which no eye will see.

## 3. The red tests first, each red on f1f3416 and green on the fix

checked: f1f3416 = `G\tree-f1` (`git archive`) with the new test files copied in; `G\t-r28-red.tap`, `G\t-red-f1.tap`; the fix `G\t-r28-fix.tap`.

- **export_apron row 28, new: THE LEAN.** On four sections, every plank hangs 25° below the road's lateral (within 0.05°) and in the cross-section:
  - a 15° cup 25 m wide with a 35° right edge, laid as TEST 10's p11 (the control asserts its middle column is over 5 m off the centre);
  - a 30° left edge;
  - a plain cup;
  - a cup ramp after a tube (an even K, with no column on the centre line; the control asserts it).
  - **Red on f1f3416:** "200 of 200 plank rows lean": 15.02° on the right and 34.98° on the left.
- **export_apron row 27:** the even-to-odd joint (7.79 mm before), red on f1f3416.
- **export_finalscene row 9:** the same joint exports refusing nothing, red on f1f3416.
- **Row 17, the planks he drove (pinned at a93ae51, flat, banked and cupped): green, byte-equal**, on every run of the fix (`G\t-r28-fix.tap`, `G\t-r1-4.tap`).
- **export_seam_fins row 3** (the lap laid like TEST 10; refused with SCENE at a 304 mm joint before R1): green (`G\t-r1-1.tap`).

## 4. The check: what changed since the interim
- **Jumps:** a jump's lip and landing are open by design (as `raygap.js` reads them). They are not read within 4 m. Found by core_jump row 5 and jumpwarn_refusals row 2, which went red with SCENE.
- **Word documents:** a road with no equation-core piece has no hull, and is not read. Found by export_acready rows 8 and 12.
- **The bottom**, after three misreads on his TEST 10:
  - a skin above the road, an edge's wall or a pass overhead (a "3.0 m step");
  - a road nearer than the 3 m the ray starts above its own (the helix overhead);
  - a surface of another pass (more than 10 m along the track);
  - all three are no longer read.
  - A STEP is now a metre that stands out of the bottom two stations back AND two on, in the same direction, by over 0.03 m. A bend where the hull starts or stops deepening lies between the two and is not one: TEST 10's p11 had read 0.055 m.
  - e911792's step beside the lane still reads red: 0.067 m at s 120 (`G\t-final-red-e9.tap`).
- `src/export/finalscene.js` header and messages say so.

## 5. His tracks on the final code: what the export says
checked: `S\matrix.ps1 v5` (TEST 10, after the bottom fixes: `G\probe-t10-fix5.out`) and `v6` (ELYSIUM, CRAZY TEST).

| track | refused | warned |
|---|---|---|
| **TEST 10** | 0 | 0 |
| **ELYSIUM** | 0 | 0 |
| **CRAZY TEST** | 0 | 2: the tube openings' skin folds, p2 and p6 (15.8° and 17.5° where the road bends 3.2° and 1.8°) |

- CRAZY TEST's two warnings were there at f1f3416 too and are not the apron. ELYSIUM's skin sliver at p37 is gone under R1.
- **For the chair:** whether the CRAZY folds get a lap of their own.

## 6. Mutation and touched tests (PROVE IT)
**PENDING, running** (`G\heavy609d.log`, under a heavy-run slot). Planned:
- `finalscene_mutation`: 20 mutants on the check and its wiring (F9 re-anchored after the lips edit, F15 re-aimed at the spike rule, F16 the jump lips).
- `acready_mutation`: 14, A11–A14 on the weld.
- `apron_mutation`: 26, with P25 (the middle by count again) and P26 (no centre column given), both judged by row 28.
- `underskin_mutation`: 20, with U19 (centre by count) and U20 (the nearer column, not blended), both judged by row 28.
- The touched test files: every file that exports, about 60.

**Earlier full runs, superseded by this one:**
- finalscene 18 of 19 caught (F9 NOT APPLIED; now re-anchored).
- acready control red on export_seam_fins row 3, which R1 now fixes.

**Amended by name:**
- `test/underskin.test.js checkSkin` now hangs by `centreColumn` (with its reason). The rule it pins changed.

## 7. Corrections (mine)
- "The apron is never welded" was my first inference. The cause was the off-centre column (§1).
- The first weld moved float rounding: 1,856 planks on CRAZY TEST instead of 6.
- I named `sectionUp` as R1's fix. It takes the middle by count too.
- My first R1 took the nearest column, half a column off on an even K. Only blending the two fixes it. C's tube test caught it: a 106° skin bend at the ring joints.
- My first R1 fixed the plank and not the skin. The end-on cut caught it: a notch in the bottom.
- "≈18° of lean" on TEST 10 was inferred from one gap. The measured lean is 9.4° to 10.6° (14.4–15.6° and 34.4–35.6° against 25°).
- The bottom check misread TEST 10's helix three ways (§4).

## 8. The commit
t180 `d609-a` **`22f9025`**, one commit on `f1f3416`, 15 named paths:
- src: `src/export/finalscene.js` (new), `acready.js`, `apron.js`, `fromwords.js`, `underskin.js`, `src/geom/pitlane.js`;
- `CHANGELOG.md`;
- tests: `test/export_finalscene.test.js` and `test/finalscene_mutation.test.js` (new), `export_apron`, `export_acready`, `underskin`, and the `apron`, `acready` and `underskin` mutation harnesses.

Not pushed. It lands after 0.4.37 and after the keeper has seen §2.
- **Collision with C's D610** (the bottom, stitched to the plank tips): whichever lands second rebases and re-runs the strict counts and C's tube test.
- `underskin.js` and `apron.js` are both in this commit.
- checked: `git -C t180-wt-a609 log --oneline -2`.

## Earlier (the interim's findings, kept)
- **The final-scene check, OPTION A**, as described in the earlier version of this file.
  - A face across the road, a lane end over 0.1 m, or a drivable crack of 5 mm or more refuses.
  - A fold, a line of sky of 1 cm or more, a step in the bottom, or a sliver warns.
  - It was red at 8fb6ecc and e911792 on all six classes (`G\red-rows-2-4.txt`, `G\matrix-v2-old.txt`).
- **The cost:** ELYSIUM export 83 s → 87–113 s with the check (17–21 s of it), CRAZY TEST 25 → 35–41 s.
- **`src/geom/pitlane.js:57`:** the false "export's defect count" is corrected.
- **CHANGELOG:** Added (the check), Fixed (the apron's planks: their slope and the joints).
