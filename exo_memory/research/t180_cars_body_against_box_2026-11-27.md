What was measured: the 14 installed T-180 car bodies (main .kn5) against their own wheels and against the shared physics floor box.
Date: 2026-11-27.
Written by a researcher subagent (Opus) for the librarian (L).

## Answer first

1. Yes, on the measure that includes the per-car GRAPHICS_OFFSET: the Type A's drawn body bottom sits 0.421 m below the CoG (raw), 0.398 m (1st percentile), second-lowest of 14 behind only the Talon (0.431 / 0.422); the Mach 6 sits at 0.323 / 0.255. [inferred placement]
2. On the offset-free model-frame clearance (measured) the Type A is NOT the worst: 0.079 m raw, 7th lowest of 14; the Mach 6 is 0.077 m. Its body was drawn no lower than the Mach 6's; it is drawn 0.100 m lower by GRAPHICS_OFFSET "0, -0.5, 0" against the Mach 6's "0, -0.4, 0".
3. The Type A is the longest body of the 14 by 0.67 m (6.671 m): the most reach past the axles (1.650 front, 1.591 rear) and outside the box (1.865 front, 1.806 rear), so the same pitch angle drops its ends furthest. [measured / inferred]
4. The Type A and the Fumee main models are byte-identical (sha256 86eaf3a6…) and have the same offset, so every figure here is the same for both. The Talon uses the same -0.5 offset.
5. collider.kn5 (one file, all 14) is shaped from the Mach 6 (its top, 1.475 m, equals the Mach 6 body top exactly). The Type A body reaches 0.594 m past it at the rear.
6. The study's prediction (Type A clips less) holds only if the offset is left out. With the offset in, the Type A, Fumee and Talon are the three lowest-drawn bodies.

## Table (Mach 6 first; m; "M" = measured by script, "I" = inferred)

Clearance columns: lowest body point minus model ground (mean wheel-centre y minus 0.395), in the model's own rest pose, no offset applied. Robust = 1st percentile of centroid heights of near-horizontal triangles (|n_y| > 0.5). Box column: body reach below / beside / ahead of / behind the floor box placed with CoG = minus GRAPHICS_OFFSET in model frame.

| car | L x W (M) | clear raw / robust (M), lowest band | past tyre side (M) | past axles F / R (M) | outside box below / side / front / rear (I) | kn5 bytes |
|---|---|---|---|---|---|---|
| mach6 | 5.998 x 2.650 | 0.077 / 0.145, mid centre | 0.200 | 1.585 / 0.983 | 0.273 / 0.325 / 1.800 / 1.198 | 108,998,456 |
| typea | 6.671 x 2.263 | 0.079 / 0.102, mid centre | 0.007 | 1.650 / 1.591 | 0.371 / 0.132 / 1.865 / 1.806 | 2,487,191 |
| fumee | 6.671 x 2.263 | 0.079 / 0.102, mid centre | 0.007 | 1.650 / 1.591 | 0.371 / 0.132 / 1.865 / 1.806 | 2,487,191 |
| talon | 5.749 x 2.317 | 0.069 / 0.078, mid+rear centre | 0.034 | 1.320 / 0.999 | 0.381 / 0.159 / 1.535 / 1.214 | 531,145 |
| corsair | 5.826 x 2.469 | 0.060 / 0.065, all bands (static SuspensionHingeFront) | 0.110 | 1.203 / 1.194 | 0.290 / 0.235 / 1.418 / 1.409 | 909,567 |
| demo | 5.608 x 2.600 | 0.100 / 0.100, centre, all thirds | 0.175 | 0.879 / 1.299 | 0.250 / 0.300 / 1.094 / 1.514 | 824,422 |
| gladiator | 5.956 x 2.153 | 0.074 / 0.135, centre, all thirds | -0.048 | 1.629 / 0.897 | 0.276 / 0.077 / 1.844 / 1.112 | 7,308,082 |
| augury | 5.676 x 2.367 | 0.132 / 0.185, mid outer | -0.043 | 1.357 / 1.235 | 0.270 / 0.184 / 1.395 / 1.281 | 72,955,008 |
| gigerbon | 5.520 x 2.328 | 0.070 / 0.073, mid | -0.040 | 1.220 / 1.302 | 0.311 / 0.164 / 1.189 / 1.331 | 23,504,586 |
| grx | 5.503 x 2.203 | 0.136 / 0.163, front | 0.109 | 1.153 / 1.258 | 0.251 / 0.101 / 1.209 / 1.294 | 30,426,062 |
| hangul | 5.402 x 2.116 | 0.144 / 0.146, even | 0.004 | 1.214 / 1.049 | 0.284 / 0.058 / 1.364 / 1.038 | 9,786,825 |
| krysha | 5.603 x 2.502 | 0.198 / 0.221, front outer | 0.321 | 1.568 / 1.101 | 0.210 / 0.251 / 1.518 / 1.084 | 72,638,392 |
| typee | 5.520 x 2.328 | 0.070 / 0.073, mid | -0.040 | 1.220 / 1.302 | 0.311 / 0.164 / 1.189 / 1.331 | 25,364,623 |
| typef | 5.287 x 2.438 | 0.075 / 0.150, front centre | 0.235 | 1.225 / 1.010 | 0.291 / 0.219 / 1.258 / 1.029 | 78,933,163 |

Gigerbon and Type E are different files (sha256 2fb6b619… / 26863513…) with identical figures on every measure.
Per-band minima (front/mid/rear thirds of body length x centre |x| < 0.45 / outer) are in results.jsonl, field `bands`.

## Rankings

A. Model-frame clearance at rest, raw (M), lowest first: corsair 0.060, talon 0.069, gigerbon 0.070, typee 0.070, gladiator 0.074, typef 0.075, mach6 0.077, typea 0.079, fumee 0.079, demo 0.100, augury 0.132, grx 0.136, hangul 0.144, krysha 0.198.
B. Same, robust (M): corsair 0.065, gigerbon 0.073, typee 0.073, talon 0.078, demo 0.100, typea 0.102, fumee 0.102, gladiator 0.135, mach6 0.145, hangul 0.146, typef 0.150, grx 0.163, augury 0.185, krysha 0.221.
C. Drawn body bottom relative to CoG = body min y + GRAPHICS_OFFSET y (I), lowest first, raw / robust: talon -0.431 / -0.422; typea -0.421 / -0.398; fumee -0.421 / -0.398; gigerbon -0.361 / -0.358; typee -0.361 / -0.358; typef -0.341 / -0.266; corsair -0.340 / -0.335; hangul -0.334 / -0.332; gladiator -0.326 / -0.265; mach6 -0.323 / -0.255; augury -0.320 / -0.267; grx -0.301 / -0.274; demo -0.300 / -0.300; krysha -0.260 / -0.237.
   C needs no CoG height: the physics (springs, mass, BASEY -0.06, tyre) is common to all 14, so differences in C are differences in drawn clearance. Type A minus Mach 6: -0.098 raw, -0.143 robust.
D. Absolute drawn clearance at rest under the assumption that the Mach 6 model's wheels coincide with the physics wheels (I): C + 0.400. Type A -0.021 raw / +0.002 robust; Talon -0.031 / -0.022; Mach 6 +0.077 / +0.145. Using BASEY -0.06 literally (CoG 0.335 above ground) instead subtracts a further 0.065 from every car. Static sag under COSMIC suspension is not modelled; the absolute level is the weakest number here, the ordering in C is not.
E. Length (M): typea/fumee 6.671, mach6 5.998, gladiator 5.956, corsair 5.826, talon 5.749, augury 5.676, demo 5.608, krysha 5.603, gigerbon/typee 5.520, grx 5.503, hangul 5.402, typef 5.287.

## How nodes were classed (rule on the mesh's node path)

- wheel: path contains `/WHEEL_LF|RF|LR|RR` (rims, tyres, driveshafts parented to the wheel).
- susp: path contains `/SUSP_xx` or `/HUB_xx` (moving hubs/uprights).
- steer: path contains `/STEER_` (steering wheel and its children).
- helper: path matches shadow|collider|collision|driver: none found in any model.
- body: everything else, including STATIC suspension pieces parented to the root (e.g. FumeeSuspension, Corsair SuspensionHingeFront, grx/hangul ArmLF.., typef SuspLF..), exhausts, wings, lights. These are drawn rigid with the body, so they can clip like it. The Corsair's lowest point is such a piece.
- Dummies seen: COCKPIT_HR, STEER_HR(_Default), DIR_* driveshaft dummies, HUB_xx, SUSP_xx, WHEEL_xx in every model; JumpJack_* on the Mach 6. Every model has all four WHEEL_ nodes. Frame: +y up, +z forward (headlights at +z), +x left (WHEEL_LF at +x).
- Wheel centres (M): seven ohyeah2389 models at x ±0.900, y 0.395, z ±1.715 exactly (model ground y = 0). The ma_ models differ: augury y 0.395/0.391, gigerbon & typee 0.356 F / 0.372 R, grx 0.383, hangul 0.387 F / 0.447 R, krysha 0.387, typef 0.379; their x/z match each car's TRACK/WHEELBASE in suspensions.addon.ini to within about 0.02.

## collider.kn5 (M)

sha256 095f4568… identical in all 14 folders. One mesh, CollisionBox_Mach6 (269 vertices, source file named t_180_v0.9_mach6_collision.fbx). Bbox in its own frame: x -1.336..1.336, y 0.485..1.475, z -2.712..3.236.
One modding guide says the collider does not move with GRAPHICS_OFFSET; I could not confirm which frame the game reads it in, so it is not used in the box figures. [I]

## Placement assumption for the box (I)

Model origin = CoG + GRAPHICS_OFFSET, so CoG in model frame = -offset. Check: base "0, -0.4, 0" puts the CoG at model y 0.400; the ohyeah2389 models' wheel centres are at 0.395 = tyre radius over model ground y 0, so the tyres rest on the ground: consistent. The opposite sign would put the CoG 0.4 below ground. Wheel x/z for AC are taken from physics, not the model, so a model drawn with offset -0.5 has its body drawn 0.100 lower relative to its tyres than its author placed it. Box in model frame: x ±1.0, y (-offY - 0.05)..(-offY + 0.45), z (-offZ ± 1.5). Sources: base data/car.ini:12 and colliders.ini at tag v0.12.0 (colliders.ini comment: "0,0,0 XYZ reference is the CoG"); community pages overtake.gg/threads/swapping-car-3d-models.231529 and cimmerian.gitbook.io/assetto-corsa-conversion/the-basics/adjusting-the-car-to-the-physics. No official Kunos documentation found.

## What could not be measured

- Nothing failed to parse: all 14 read to the last byte, no skinned meshes (node class 3) present; support for it was added to the reader but not exercised. No LOD files exist for these cars.
- The real CoG height at rest (spring sag, COSMIC suspension), so D's absolute level is inferred; C's ordering is not affected.
- Clipping in motion (pitch, roll, compression) was not simulated; only overhang lengths are given as its proxy.
- Which frame collider.kn5 is read in (see above).

## Reproduce

Scripts (scratch, not committed): C:\Users\zackn\AppData\Local\Temp\claude\0d67fc0e125090b2\0c0c0c0b-0000-4000-8000-00000000115b\scratchpad\bodybox\ (kn5car.cjs: reader adapted from t180-track-builder c522ea6:tools/kn5.cjs, plus node class 3 and node records; tree.cjs; measure.cjs; results.jsonl).
```
C="/c/Program Files (x86)/Steam/steamapps/common/assettocorsa/content/cars"
sha256sum "$C"/*t180*/collider.kn5 "$C"/*t180*/*.kn5
node tree.cjs "$C/ohyeah2389_t180_typea/ohyeah2389_t180_typea.kn5" 3   # node tree + per-branch bbox
node tree.cjs "$C/ohyeah2389_t180_typea/collider.kn5" 3                 # collider bbox
node measure.cjs "$C/<folder>/<folder>.kn5" <offY> <offZ>                # one JSON line per car
#   offsets used: mach6 corsair demo gladiator gigerbon typee -0.4 0; typea fumee talon -0.5 0; augury krysha -0.45 0;
#   grx -0.425 0; hangul -0.5 0.2; typef -0.4 0.025
git -C <car_repo clone> show v0.12.0:Source/<car>/data/car.addon.ini     # offsets
```
Fields: clearRaw, clearP1, bands, reachSide, reachAxle, body.length/width (M); box, outBox, bodyBottomRelCoG(p1) (I).

---
**Librarian's check, 2026-11-27 05:45 (L):** read whole. Re-checked by me: the Type A's and the Fumee's main models have one
sha256 (86eaf3a6a26dcd02…); the offsets "0, -0.5, 0" (Type A, Fumee, Talon) against the base's "0, -0.4, 0" were read at
the tag before this note was ordered. Not re-run: the mesh figures (the scripts are in the researcher's scratch folder,
not in the repo). **What this does and does not show:** it shows the Type A's body is drawn 0.10 m lower than the Mach 6's
by its offset, is the longest of the 14 by 0.67 m, and reaches 0.594 m behind a collision mesh shaped for the Mach 6. It
does not show clipping: nothing was driven. It registers one thing a driver can score: the Fumee has the same model file
and offset, so it should clip as the Type A does, and the Talon should be near them.
