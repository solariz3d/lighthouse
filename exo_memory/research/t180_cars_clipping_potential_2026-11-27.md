source read: repository at head 4262dedf, cars as installed at tag v0.12.0
2026-11-27
written by researcher subagents (Opus) for the librarian (L); joined by a writer; a checker's section follows

# The 14 T-180 cars against the Mach 6: what changes when and how they clip

Four readers each compared all 14 cars on one quantity: C1 ground contact and ride height, C2 load and
stops, C3 speed, C4 what is installed. Paths without a prefix are in the mod's repository under
`Source/base/data/` or `Source/<car>/data/` at v0.12.0, as each reader gave them. The Mach 6's measured
limits are in the track editor's `src/validate/limits.js` at c522ea6, cited as `limits.js:<line>`.

## Answer first

1. What touches the road is the same on all 14 cars: one bottom box (`colliders.ini:7-8`), one
   collision mesh (sha256 095f4568…, byte-identical in all 14 installed folders), one tyre radius 0.395,
   one spring, one set of stops, one mass of 850 kg, one scripted downforce of -200. (checked, C1 and C2)
2. So in a straight vertical squash every car reaches its stops and its chassis at the same load as the
   Mach 6: about 25 g to the stops (`limits.js:13`) and about 40 g to the chassis (`limits.js:18`). (inferred)
3. What differs is where the wheels are. Seven cars have shorter wheelbases or narrower tracks, so the
   same 2.0 × 3.0 m box reaches further past the wheels, and in a turn a box corner should reach the
   road at a lower load. Krysha is the extreme: track 1.41 against 1.8. (inferred, C1 and C2)
4. Speed sets how much load a car meets on a given track. Talon is far faster (core-thrust ceiling about
   4.7 times the Mach 6's); most others are slower or about the same. (inferred, C3)
5. All 14 are installed as the v0.12.0 build: 70 of 70 extension files match the tag. The packed physics
   (`data.acd`) is inferred to be the tag, not checked. (C4)
6. The update (0.13.0) lowers downforce for every car and roughly doubles jet thrust; it does not touch
   the box, mesh, mass, springs or stops. (C2, C3)

## How per-car files combine with the base (all four readers agree, checked, `builder.py@v0.12.0`)

- `Source/base` is copied into each car first (`:642`, `:652`); the car folder is merged over it (`:671`).
- A full file with the same name replaces the base file (`:320-322`).
- `X.addon.ini` is merged into `X.ini` key by key (`:222-263`); a section holding only `DELETE=1` is
  removed (`:227`, `:245-253`); with no base file the add-on becomes the whole file (`:339-345`).
- The README states none of this. The head rewrites `builder.py` (C4), so the rule is for the installed build.
- None of the 14 has a `colliders`, `tyres` or `setup` file of its own. Seven have `suspensions.addon.ini`,
  which changes only `WHEELBASE`, `TRACK` and `CG_LOCATION` (C1, C2, checked).

## The shared base (checked @v0.12.0)

- Bottom box: `colliders.ini:7-8` "CENTRE=0, 0.2, 0" "SIZE=2.0, 0.5, 3.0". Its bottom face is 0.05 m below
  the car's origin: 0.2 − 0.5/2 = −0.05 (C1, inferred arithmetic).
- Tyres: `tyres.ini:19-20`, `:68-69` "WIDTH=0.45" "RADIUS=0.395", front and rear (C1).
- Suspension: `suspensions.ini:20,81` "BASEY=-0.06"; coilover design length 1.0 (`:61-62`), "MIN_LENGTH=0.9"
  "MAX_LENGTH=1.4" "BUMPSTOP_GAP=0.05" (`:63-68`); "RATE=80000" (`:58`), "END_RATE=250000" (`:65`); dampers
  `:69-74`; rear identical `:119-135` (C1, C2). About 0.10 m to the hard stop from the design pose, less the
  0.05 bump-stop gap (C1, inferred).
- Mass: `car.ini:14` "TOTALMASS=850", `:15` "INERTIA=1.5, 0.8, 3.8"; no car overrides the mass (C2, C3).
- Speed-driven spring preload: `ctrl_susp_lf.ini:3-4` "INPUT=SPEED_KMH" "LUT=(| 0=0 | 100=80 | 200=300 |
  400=800 | 600=1800 | 1000=4500 |)", wired by `setup.ini:95` (C1). Same on all 14.
- Downforce: `script.lua:379` gives -200 to every car not named `ohyeah2389_proto_mach4` or
  `ma_proto_uniron`; neither is among the 14. Ray at `:377`, fade `:378` (C2). The editor's ray agrees in
  shape: up 0.4, ahead 1.0, length 1.0, full within 0.5, none at 0.9 (`limits.js:42`), and -200 N per m/s on
  850 kg (`limits.js:49`).
- `jumpJackSize = 1` in every `car_config.lua:12`, read by no script (C1).

## The table

Load-at-contact columns describe the car's geometry; "speed" describes how much load it meets on the
same track. Overall: where geometry and speed point the same way (or one is neutral) that direction is
given; where they point opposite ways it is "unknown". Every overall verdict is [inferred].

| car | sits | reaches its stops at | speed | installed as tagged? | overall vs Mach 6 | the one fact it rests on |
|---|---|---|---|---|---|---|
| mach6 (reference) | reference | ~25 g stops, ~40 g chassis | reference, gearing 612 km/h | yes (data inferred) | reference | `limits.js:13`, `:18`; WB 3.43, track 1.8/1.8 (C1) |
| demo | same | same | slower | yes | less | no `data/` folder, all base; gearing 570 (C2, C3) |
| corsair | same | same | slower | yes | less | `car.addon.ini:5` sets only DRIVEREYES; FINAL 1.834, gearing 560 (C1, C3) |
| gladiator | same | same | about the same | yes | same | jet `1.65` `car_config.lua:26`, gearing 570 (C3) |
| fumee | same (mesh 0.10 m lower if the offset moves it: unknown) | same | unknown | yes | unknown | turbojet `present = false`, turboshaft "dual" `car_config.lua:33-34` (C3); `car.addon.ini:5` offset -0.5 (C1) |
| talon | same (mesh: unknown) | same vertically; rolls and pitches more easily | faster | yes | more | "dual", `3.5` each `car_config.lua:16,27` (C3); `car.addon.ini:6` INERTIA 1.4, 0.8, 3.5 (C1, C2) |
| typea | same (mesh: unknown) | same | slower | yes | less | jet `1.15` `car_config.lua:25` (C3) |
| augury | same | same vertically; rear track wider, box reaches further fore and aft | slightly slower | yes | same | `suspensions.addon.ini:3,8` WB 3.10, rear TRACK 2.0 (C1, C2) |
| gigerbon | same | same vertically; lower in roll (front track 0.93) | slower | yes | unknown | `suspensions.addon.ini:3,6,9` WB 2.998, track 1.678/1.957 (C1, C2); gearing 514 (C3) |
| typee | same | as gigerbon | slower | yes | unknown | `suspensions.addon.ini:3,6,9`, same as gigerbon (C1, C2) |
| grx | same | same vertically; lower in roll (track 0.85) | slower on thrust; afterburner pushes down | yes | unknown | `suspensions.addon.ini:3,6,9` track 1.535 (C2); `thrustAngle = 45` `car_config.lua:18` (C3) |
| typef | same | same vertically; lower in roll (track 0.84) | about the same | yes | more | `suspensions.addon.ini:3,6,9` WB 3.052, track 1.518 (C1, C2) |
| hangul | same (mesh: unknown) | same vertically; lower in roll (front track 0.82) | slower | yes | unknown | `suspensions.addon.ini:3-10` WB 3.14, track 1.48/1.66, CG 0.495 (C1, C2) |
| krysha | same | same vertically; lowest in roll (track 0.78) | slightly slower | yes | more | `suspensions.addon.ini:3-10` WB 2.934, track 1.41/1.41 (C1, C2) |

"Installed as tagged" is checked for the readable files (all 14 `ui_car.json` say "0.12.0"; 5 of 5
extension files match the tag on every car) and inferred for `data.acd` (C4).

Arithmetic behind the ratios and overhangs [inferred]:
- Track ratio = car track / 1.8: 1.678/1.8 = 0.93, 1.535/1.8 = 0.85, 1.518/1.8 = 0.84, 1.48/1.8 = 0.82,
  1.41/1.8 = 0.78 (C2; assumes lateral load transfer scales with 1/track at equal CG height, which no file states).
- Box overhang past the wheels sideways = 1.0 − track/2: Mach 6 1.0 − 0.9 = 0.10 m; Krysha 1.0 − 0.705 =
  0.295 m (C1).
- Box overhang lengthwise = 1.5 − wheelbase/2: Mach 6 1.5 − 1.715 = −0.215 (inside the wheelbase);
  Krysha 1.5 − 1.467 = +0.033 m, the only car whose box reaches past its axles (writer's arithmetic on C1's figures).
- GRX afterburner down-push: 2500 × sin 45° ≈ 1,770 N (C3); against 850 × 9.81 = 8,339 N that is about
  0.21 g, small beside 40 g (writer's arithmetic). The sign assumes AC's local y points up (C3, inferred).
- Talon core ceiling: 2000 × 3.5 × 1.3 = 9.1 kN per jet, two jets ≈ 18 kN, against 2000 × 1.5 × 1.3 = 3.9 kN
  for the Mach 6 (C3, from `script_turbojet.lua:101,106,94`).

### Where the readers disagree, or differ in count

- `GRAPHICS_OFFSET`: C1 counts 8 cars that differ; C2 says 7 move it. Both are right on the lines they
  quote: 8 cars change the vector, but Type F's is "0, -0.4, 0.025" (`car.addon.ini:5`), the same height
  as base. So 7 cars sit their visual body 0.025 to 0.10 m lower (fumee, typea, talon, hangul -0.5;
  augury, krysha -0.45; grx -0.425). Whether that offset also moves `collider.kn5` is unknown (C1);
  C2 reads it as visual only (inferred). Neither checked it.
- C2 counts "small CG shifts (three cars)": augury 0.503, hangul 0.495, krysha 0.503. No reader gives the
  base `CG_LOCATION`, so the direction of the shift is not stated here.
- The editor reads the downforce from the installed car's `mach6_active/data/script.lua:424-433`
  (`limits.js:38-39`); C2 reads it at `script.lua:377-379` at the tag. Different files or a different
  build; the two were not reconciled.

## Registered predictions, before any lap

The finding first: in what touches the road (box, mesh, tyres, springs, stops, mass, downforce), the
cars do not differ. Under a straight vertical load they should all clip where the Mach 6 does. The
predictions below are about turns, rolls and how often a car meets the load. Every one is [inferred].

- On a track where the Mach 6 reaches its chassis at about 40 g, Demo, Corsair, Type A and Gladiator
  should reach it at the same load, because their suspension, box and mass are all base
  (`colliders.ini:7-8`, `car.ini:14`, no per-car add-on for either). [inferred]
- On a track where the Mach 6 reaches its chassis at about 40 g, Krysha should reach it at a lower load in
  a sustained turn, because its track is 1.41 m against 1.8 (`suspensions.addon.ini:3-10`), leaving 0.295 m
  of box past each wheel against 0.10. [inferred]
- On a track where the Mach 6 reaches its chassis at about 40 g, Hangul should reach it at a lower load in
  a turn, because its front track is 1.48 m (`suspensions.addon.ini:3-10`). [inferred]
- On a track where the Mach 6 reaches its chassis at about 40 g, GRX should reach it at a lower load in a
  turn, because its track is 1.535 m both ends (`suspensions.addon.ini:3,6,9`). [inferred]
- On a track where the Mach 6 reaches its chassis at about 40 g, Type F should reach it at a lower load in
  a turn, because its track is 1.518 m both ends (`suspensions.addon.ini:3,6,9`). [inferred]
- On a track where the Mach 6 reaches its chassis at about 40 g, Gigerbon and Type E should reach it at a
  slightly lower load in a turn, because their front track is 1.678 m (`suspensions.addon.ini:3,6,9`). [inferred]
- On a track where the Mach 6 reaches its chassis at about 40 g, Augury should reach it at the same load
  in a turn, because its front track is the Mach 6's 1.8 and its rear is wider at 2.0
  (`suspensions.addon.ini:3,8`). [inferred]
- On a track where the Mach 6 reaches its chassis at about 40 g, Talon should reach it at the same load,
  because its box and springs are base and only its inertia differs (`car.addon.ini:6`); being faster
  (`car_config.lua:16,27`), it should reach that load at more places on the lap. [inferred]
- On a track where the Mach 6 reaches its chassis at about 40 g, Fumee should reach it at the same load,
  because its suspension and box are base; whether its body mesh shows through earlier depends on
  whether `GRAPHICS_OFFSET` -0.5 (`car.addon.ini:5`) moves `collider.kn5`. [inferred]

What would prove the whole set wrong: a lap in a straight dip (no turn) where any car reaches its
chassis at a clearly different load from the Mach 6.

## What the update (0.13.0) changes for clipping

- Downforce falls to -150 N per m/s for every car, with no per-car case (`script.lua:438` at head, C2).
  At 970 km/h = 269.4 m/s: 200 × 269.4 = 53.9 kN = 6.46 g (matches `limits.js:44`); 150 × 269.4 = 40.4 kN
  = 4.85 g on 850 kg. About 1.6 g less pressing the car down at top speed. [inferred]
- Jet thrust multipliers roughly double (Mach 6 1.5 → 3.15; Talon stays 3.5) and the afterburner rises to
  0-6000 N (`script_turbojet.lua:136` at head, C3). Faster cars meet more load on the same track, so this
  works against the downforce cut. The net is unknown without a lap. If GRX keeps `thrustAngle = 45` at the
  head (not read), its down-push would be 6000 × sin 45° ≈ 4,240 N, about 0.51 g. [inferred]
- Piston peaks fall by about half (Mach 6 `7200|432`) and some finals move (Mach 6 2.625) (C3).
- Dampers become LUT-driven: `DAMP_*` keys commented out, `DAMPER_LUTS=1` (diff of `suspensions.ini`, C1, C2).
  How fast the car sinks onto its stops may change; the travel and stops do not.
- The speed-driven preload moves from `ctrl_susp_lf.ini` into `script_activesusp.lua:49`, feeding
  `controllerInputs[23..26]` (`:59-62`); enabled unless `traditionalSteering` is set (`script.lua:37`), and
  none of the 14 sets it (C1).
- Unchanged at head: the bottom box, mass, springs, stops, and every car's suspension and aero add-on (C1, C2).
- The editor's Mach 6 limits (25, 40, 55, 90 g) were measured on the installed v0.12.0 car; on 0.13.0 they
  are unmeasured.

## Not found, and not read

- No static ride height, CG height, or base `CG_LOCATION` anywhere; so no absolute contact angle in roll
  or pitch, only ratios (C1, C2).
- No per-car `colliders.ini`, `tyres`, `setup` add-on, or any `BASEY`, `MIN_LENGTH`, `MAX_LENGTH`, `RATE`,
  `END_RATE`, `BUMPSTOP_GAP`, damper, packer or `TOTALMASS` override, at the tag or the head (C1, C2).
- `collider.kn5` is gitignored (`.gitignore:11-12`); its contents were not read, only its sha256 (C1).
- Whether `GRAPHICS_OFFSET` moves the collider: nothing in the repo settles it (C1).
- `[FIN_0]` on gladiator, fumee, typea, gigerbon, typee, typef (`aero.addon.ini`) is read as a vertical
  surface with no downforce from the AC section name, not from a line in the repo; `fin_AOA_CL.lut` not
  read (C2).
- Fumee's speed: turboshaft power comes from mass flow and temperature (`script_turboshaft.lua:217-222`),
  not readable without running it (C3).
- How the bleed-air boost override scales piston torque is inside AC, not read (C3).
- No checksum or manifest ties a `data.acd` to a commit; the packed physics is inferred to be the tag (C4).
- Speeds and thrust ceilings are arithmetic on quoted lines; nothing was driven or run (C3).
- The `_d1` and `proto` folders, skins, sfx and car `.kn5` files were not opened (C4).

## Checker's section

(left for the checker)

## Checker (a second subagent that wrote none of the above)

Read only: `git show` against the clone (v0.12.0 and HEAD 4262ded), `sha256sum`/`diff` on the installed folders, and
`git show c522ea6:src/validate/limits.js`. Nothing was run from the clone and no `data.acd` was unpacked.

**Reopened: 61 citations. All 61 lines exist and say what the note quotes them as saying.** That covers every number in
the main table and the "Registered predictions" (limits.js :13 :18 :29 :33 :38-39 :42 :44 :49; colliders.ini:7-8;
tyres.ini:19-20, :68-69; suspensions.ini :20/81, :58, :61-62, :63-68, :65, :69-74, :119-135; car.ini:14-15;
ctrl_susp_lf.ini:3-4; setup.ini:95; script.lua:377-379; all 7 `suspensions.addon.ini`; car.addon.ini of corsair,
fumee, talon, typef and the other GRAPHICS_OFFSET cars; car_config.lua of gladiator, fumee, talon, typea, grx and the
`:12` jumpJackSize in all 16; builder.py :222-263 :227 :245-253 :320-322 :339-345 :642 :652 :671; script_turbojet.lua
:94 :101 :106 and head :136; head script.lua :37 :438; head script_activesusp.lua :49 :59-62; .gitignore:11-12;
script_turboshaft.lua:217-222), plus the collider sha256 (095f45686687… in all 14), the 14 `ui_car.json` "0.12.0"
and the 70 extension files. Arithmetic re-done: track ratios, box overhangs, 612/570/560/514 km/h gearing
(rpm ÷ (0.870 × FINAL) × 2π × 0.395), 6.46 g and 4.85 g, 1,768 N and 0.21 g, 9.1 kN / 3.9 kN ≈ 4.67: all correct.

**Where a claim does not hold, or is overstated (7 that matter, 4 minor):**

| claim in the note | what the line really says | corrected statement |
|---|---|---|
| "No reader gives the base `CG_LOCATION`" (:102-103); "No … base `CG_LOCATION` anywhere" (:162) | `suspensions.ini:10` @v0.12.0 "CG_LOCATION=0.5" | Base is 0.5. Augury and Krysha 0.503 move the CoG 0.3 % of wheelbase forward (about 9 mm on Krysha), Hangul 0.495 about 16 mm rearward (if AC reads CG_LOCATION as the front weight share, inferred). Since `colliders.ini:7` places the box relative to the CoG, the box moves with it. |
| Krysha is "the only car whose box reaches past its axles" (:89) | `suspensions.addon.ini:3` of gigerbon and typee: "WHEELBASE=2.998" | 1.5 − 1.499 = +0.001 m: Gigerbon and Type E are flush with their axles too. Krysha (+0.033 m, or about +0.042 front / +0.024 rear with its CG shift) is the furthest, not the only one. |
| Afterburner "rises to 0-6000 N"; GRX down-push "6000 × sin 45° ≈ 4,240 N, about 0.51 g" if thrustAngle is kept (:146-149) | head `script_turbojet.lua:136` multiplies by `cosineDropoff`, and `:122,:125` set it to 0.6 at zero drift; head `ma_t180_grx/data/car_config.lua:13` "thrustAngle = 45" (checked, no longer an "if") | Straight ahead the afterburner gives 0-3,600 N; GRX down-push ≈ 2,550 N ≈ 0.31 g, rising toward 0.51 g only at 90° drift. |
| The update "lowers downforce for every car" and nothing else in the aero bears on clipping (Answer 6; :143-145) | head `script.lua:429` ray has no 1.0 m look-ahead and is 2.0 m long; `:432` fades to none at 2.0 (was 0.9); `:435` new `suctionStalling` "Decrease downforce if the ride height is TOO low (stalling, combats "clipping")", remap 0.4→0, 0.5→1, clamped to −1; `:453` multiplies it in | The most clipping-relevant change in 0.13.0 is missed: when the ray reads under 0.5 m (car origin within 0.1 m of the road, box bottom within 0.05 m) downforce fades, reaches zero at 0.4 and turns into an upward push down to 0.3. The 6.46 → 4.85 g comparison holds only with the ray at or above 0.5 m. |
| Answer 6: "roughly doubles jet thrust; it does not touch the box, mesh, mass, springs or stops" (no checked/inferred mark) | Mach 6 1.5 → 3.15 (head car_config.lua:19); Talon 3.5 → 3.5 (:26); `collider.kn5` is gitignored (`.gitignore:12` "*.kn5") | Not every car's thrust doubles (Talon's is unchanged). The mesh cannot be checked at head from the repo. Box, mass, springs and stops unchanged is checked (`git diff v0.12.0 HEAD` touches none for the 14). Answer 6 should carry "(partly inferred)". |
| "Different files or a different build; the two were not reconciled" (:104-106) | `limits.js:42` up 0.4, ahead 1.0, length 1.0, 0.5→0.9; tag `script.lua:377-378` gives the same four; head `:429,:432` gives no ahead, 2.0, 0.5→2.0 | Reconcilable on values: the editor's ray is the v0.12.0 ray, not the 0.13.0 one. No `mach6_active` folder is installed now (only the 14 `*t180*` folders). |
| "70 of 70 extension files match the tag" (:24, :80-81) | `cmp` against the git blobs: 42 byte-identical, 28 differ only by CRLF line endings (e.g. demo `car_coordinates.lua` ends lines with `^M`) | 70 of 70 match in content; 28 differ in line endings only. |
| Type F speed "about the same" (table) | `ma_t180_typef/data/car_config.lua` thrustMultiplier = 1.8 (Mach 6 1.5, Gladiator 1.65); no drivetrain/engine files, so base gearing 570 | Type F has 20 % more core thrust than the Mach 6; "faster" is at least as likely as "about the same" (inferred). Its overall verdict "more" is unchanged. |
| minor: box bottom "0.05 m below the car's origin" (:41-42) | `colliders.ini:7` comment: "0,0,0 XYZ reference is the CoG" | 0.05 m below the CoG. |
| minor: corsair "sets only DRIVEREYES" | `car.addon.ini:2` also sets SCREEN_NAME | Harmless; physics-wise true. |
| minor: Talon prediction "only its inertia differs" | `car.addon.ini:5` also GRAPHICS_OFFSET -0.5 | Physics-wise true; the visual offset also differs. |
| minor: Hangul offset "-0.5" | `car.addon.ini:5` "0, -0.5, 0.2" | Also moved 0.2 m lengthwise. |

**What the note should have said and did not:**
- Overhang past the wheels was measured from wheel centrelines. With `WIDTH=0.45` (`tyres.ini:19`) the Mach 6's tyre
  outer edge sits at 0.9 + 0.225 = 1.125 m, outside the box's 1.0 m half-width, so its box is inside the tyres; Krysha's
  outer edge is at 0.705 + 0.225 = 0.93 m, so its box sticks 0.07 m past the tyre. That sign change is a sharper reason
  for the Krysha prediction than 0.295 vs 0.10 (inferred arithmetic).
- The base `aero.ini` has `[WING_0]` (body, `wing_body_AOA_CL.lut`) and `[WING_1]` with CL gains of 1.0, shared by all
  14 (not read for sign); "one scripted downforce" is not the only vertical aero term, though it does not differ by car.
- Answer 5 and the "installed" column rest on the installed files being v0.12.0; the head's downforce stall (above) is
  the one 0.13.0 change that most directly changes where a car clips, so a 0.13.0 install would need the editor's
  limits re-measured for that reason above all.

Checked by: `git show`/`git diff`/`git grep` on the clone, `sha256sum` and `diff --strip-trailing-cr` on the installed
folders. Nothing committed.

---
**Librarian's check, 2026-11-27 05:38 (L):** the note was read whole by me. Four facts re-read, 4 of 4 hold: Krysha's
`suspensions.addon.ini` at the tag (wheelbase 2.934, track 1.41 front and rear, CG 0.503); the base's 3.43, 1.8 and
`CG_LOCATION=0.5` (so the checker's first correction stands, and the body's "no base CG_LOCATION" is wrong); Talon's
"dual" and 3.5; and one sha256 prefix 095f45686687 over all 14 installed `collider.kn5`. **Where the body and the checker
disagree, read the checker.** Every "more / less / same" verdict in the table is inferred from source; no lap of any
car but the Mach 6 has been measured.
