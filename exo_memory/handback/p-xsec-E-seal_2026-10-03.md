# p-xsec-E-seal · CROSS-SECTION lap (D225), step 1: the SEAL (edge curve + tube + spiral) · pane E · 2026-10-03, on D

**Packet:** the chair's D225 step 1, GEOMETRY tier, docs only. **Nothing was built, committed or pushed, and no AC was launched.**
**Lock:** every probe that touched the core or reads/ ran under the heavy-run lock, one at a time; my jobs released it.

## The seal

| file | sha256 |
|---|---|
| `exo_memory/loop/cross_section_seal_registration_2026-10-03.md` (whole file, trailer included; untracked) | **`9dec2e80e8c9228024ad3a749e2f9223607c3f502e41269f6c06b3933d640391`** |
| the same, trailer removed (the value its trailer records) | **`3077ff16ce6be489bccba9d5725cfbbf58549c18f056266bf05735eea1add7e2`** |

- checked: `head -n -2 <seal> | sha256sum` → `3077ff16…`, equal to the trailer.
- **Base:** t180 `b3364df` (a clean `git archive`); the plan at lighthouse `d86aac20`, sha256 `bc2c0b67…2cdb`.
- **Rows** (each with a FAIL condition and planted controls; B scores all but G):
  - edge curve E1–E7;
  - tube T1–T3;
  - spiral S1–S4;
  - export X1, camera/labels X2;
  - the keeper's G1–G5, with G5 the falsifier.

## The rulings asked for

- **G is named:** the cubic smoothstep, G(t) = 3t² − 2t³ (ref 02 §4, IFC-BLOSS via `docs/math/04a`), not t².
  - It has G(0) = 0, G′(0) = 0, G(1) = 1, is monotone, and adds G′(1) = 0, so the band holds its angle at the edge, as C's test-track read shows.
  - checked: the slope jump at the slice is 3·10⁻⁶ of what G = t gives.
  - Seal §4 lists what goes on the shelf (a new ref 09 section) before use.
- **Schema: `t180b.core/4`, ruled on a measured reason.** checked:
  - today's reader ACCEPTS a /3 file carrying `e`/`s`;
  - it **silently drops both on the next save**;
  - it refuses /4 by name.
  - An additive field would let the keeper's installed builder, or L, destroy an edge without a word.

## Parts of the plan refused or corrected, each with its measurement

1. **"Bank unwrapping in the core" is already there** (V5).
   - checked: Extend to 360° of bank is accepted, the channel is continuous to 360, the readout says 360, and the roll steps 0 at joints.
   - It stays as a regression row (S1), not new work.
2. **The heartline's REASON is corrected** (V6). Nothing "jumps" with heartline 0; the TUBE corkscrews round a straight driving line instead, its axis swinging 9.87 m = 2R (checked). What jumps is a heartline STEP: 4.46 m measured. Heartline R for a closed tube is kept, for the right reason.
3. **The roll-rate bar** (V7):
   - RED above 1.2144°/m at a 20 m chord, the whole Centrifuge lap's maximum (8,585 windows);
   - AMBER above 0.9338°/m, the inverted-only maximum (175 windows);
   - "inverted only" and "°/s at design speed" are refused as the sealed form. Centrifuge's speed at those sections is not measured.
4. **s default 0.64** (C's collation and the chair's packet), not the plan's earlier 0.70.

## Unwelcome outcomes, named in advance

- **The keeper's own example, 360° over 300 m, REDS the roll-rate bar:** 1.797°/m at the 20 m chord. It takes about 450 m to pass (1.199) and 600 m to stay out of amber (0.900). checked (`chordprobe.txt`).
- **The spiral's floor is not smooth on today's geometry.** path.js's per-segment roll smoothstep, about a heartline R, gives the floor a curvature of 0.417/m (2 m segments) against the helix's 0.0048. It gets WORSE with shorter segments. checked (`hlprobe.txt`).
  - A must change the roll interpolation for heartline segments ONLY, or the e = 0 fixture identity breaks (S2 iii).
- **The validator's loads miss the spiral entirely:** the samples' kvec is 0 where the floor needs 2.01 g at 460 km/h. checked (`kvecprobe.txt`, S4).
- **A tube that closes along the road reds `downforce-ray-gap`** over the slot zone: 4.2–21.7 m of a 40 m transition, w 31. checked.
  - Today's raygap means a closing tube does not export green. That is the keeper's and the librarian's call; the seal does not exempt it.
- **The e = 0 identity has a trap in the plan's own formula.** Re-evaluating ψ_mid at its own knots changes the last bit: 7 of 9 fixtures differ (checked, plant KE3-2). The slice's knots inserted at e = 0 make it 8 of 9; a pure `+ 0` makes it 0 of 9.

## Checked against what was asked

- **Edge grid and slice continuity:** E1 (with the n-interval table for the rendered profile).
- **e = 0 identity:** E3, against D222's effective baseline. checked: 0 of 9 at b3364df; effective manifest sha256 `05c789a8…`.
- **Mesh at the extremes:** E5. **The cap:** E2, where the walls never meet on the grid and the smallest tip gap at 150° stays the plain bowl's 0.0578.
- **Seams:** E4, T2. **Tube arc and closure:** T1 (gap ≤ 2.3e-15 m on the profile; a 360° lap exports green).
- **Cup ↔ tube C1 and ≤ 1 mm:** T2. **Bank across ±180:** S1. **Heartline:** S2. **Roll-rate bar:** S3.
- **Export, offline:** X1. With csp on, a closed tube exports green. With csp off it reds `steep-without-raycast`. Every one of the 590 meshes taller than 9 m (the ceiling) is a drivable `1ROAD_` mesh.
- **Camera and labels:** X2. Inferred from the code, not run.

## What I did NOT verify

- Any AC launch or in-game drive (forbidden). All AC statements are inferred.
- X2's camera, marker and label behaviour; KS3-3's climbing-turn case; machine L's reader.
- That the Centrifuge read's 20 m chord catches its true peaks. It smooths them, so if anything the bar is strict.

## Corrections I made to myself

- **The export's csp option was in the wrong argument** (meta, not options). The first "csp false: green" was void; re-run, it reds.
- **I first wrote "565 of 568 meshes" from a truncated view.** The full count is all 590 meshes over 9 m are `1ROAD_` (p2–p5: 566 of 571, p6: 24 of 31). Fixed in the seal before hashing.
- **The wall-touch scan** first tested e = 400° (past 360° the tip swings back). Re-scanned for the first sign change; the result is the same, now for the right reason.
- **The first export runs refused at the grid.** I had tubed segments the grid reads as straight; fixed.
- **I expected KE3-2 to be bit-neutral.** It is not, and it is now a plant.
- **One case-sensitive hygiene hit was the camera mode's name at a sentence start.** Reworded; strict scan 0.

**Hygiene:** strict scan of the seal → key bodies 0, private and excluded-content terms 0. Centrifuge's read stays in git-ignored reads/; only derived numbers are sealed.

**Instruments:** `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-07b8a48f\a2122153-a37e-41a6-a86f-534267ec0565\scratchpad\xsec\`. The table is in seal §6.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_edge_curve_2026-10-03.md · C:\Users\nname\Desktop\lighthouse\exo_memory\loop\cross_section_seal_registration_2026-10-03.md · C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-d222-B_2026-10-03.md
