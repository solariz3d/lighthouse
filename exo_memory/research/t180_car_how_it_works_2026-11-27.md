commit read: 4262dedf78a1c8f2aba556410f5b7161003db066 (main, committed 2026-11-26; `Source/info.toml:2` says `version = "0.13.0"`, unreleased)
date: 2026-11-27
written by a researcher subagent for the librarian (L)

# How the T-180 car works, for people who build tracks for it

Source: `https://github.com/ohyeah2389/Assetto-T-180`, cloned read-only; nothing from it was run. Paths are
relative to the repository at the sha above. `@v0.12.0` means the same path at tag v0.12.0
(`0cba88bdc4de8e50759f13d9a75a9c7354e4b09c`, 2025-12-24), which is what is installed on this machine.
**Every statement is checked (I read the cited line) unless it carries [inferred].**

## Answer first

- **The installed car is v0.12.0, 119 commits behind the head.** The head changes downforce, thrust, engine
  torque, jump jacks and the AI. A plan must say which of the two it is built against. Numbers below give both.
- **Wheels and tyres are stock Assetto Corsa physics; almost everything that makes it a T-180 is a Lua physics
  script** run by the shader patch at 333 Hz (`Source/base/data/script.lua:183`).
- **Downforce is a scripted force, linear in speed (not squared), applied along the car's own down axis, and it
  switches off when no track surface is found under the car** within about 0.9 m (installed) or 2.0 m (head).
- **The car is built to corner sideways.** A rear turbojet pushes along the car's forward axis, and it spools up
  by itself as the drift angle grows. The four wheels are steered independently by servo code, up to a full turn.
- **The source asks nothing of a track by name.** No surface names, no track ids, no trigger objects, no companion
  track, and no document for track makers. It only raycasts the track's physics mesh and, at the head, reads the
  AI spline.

## The systems the source carries

| System | Stock or scripted | Where |
|---|---|---|
| Piston engine, 6-speed gearbox, AWD with three diffs, brakes | stock ini data | `Source/base/data/engine.ini`, `drivetrain.ini`, `brakes.ini` |
| Tyres (one compound, "WRL Spec") | stock ini data, with `EXTENDED_RAYTRACING=1` | `Source/base/data/tyres.ini:8`, `:17` |
| Suspension | shader-patch `TYPE=COSMIC` (custom joints), stock coilover | `Source/base/data/suspensions.ini:20`, `:57-69` |
| Two aero "wings": body, and a rear horizontal stabilizer | stock ini data | `Source/base/data/aero.ini:4-46` |
| Synthetic downforce with ride-height sensor | scripted | `script.lua:426-456` |
| Turbojet thruster with afterburner, heat and thermal derate | scripted | `Source/base/data/script_turbojet.lua` |
| Turbine bleed air as engine boost (overrides the stock turbo) | scripted | `script_turbojet.lua:150-156` |
| Four jump jacks (charge while held, fire on release) | scripted | `Source/base/data/script_jumpjack.lua`, `script.lua:49-72` |
| Four-wheel independent steering, three controller models (Classic, Modern, Active), and the force feedback each one computes | scripted | `script.lua:22-26`, `:207-210`, `Source/base/data/steer_ctrlr_models.lut` |
| "Corner Control" on the clutch pedal (turbine and afterburner on clutch) | scripted | `script.lua:223-241`, `setup.ini:1022-1038` |
| Active suspension (head only) | scripted | `Source/base/data/script_activesusp.lua` |
| Roll control in the air (head only) | scripted | `script.lua:482-491` |
| Custom AI driver (head only) | scripted | `Source/base/data/script_opponent.lua` |
| Other engines for sibling cars: turboshaft with custom drivetrain, turbocharger thruster | scripted | `script.lua:98-128`, `script_turboshaft.lua`, `script_turbothruster.lua` |

Not present: ABS and traction control (`electronics.ini:4`, `:11` `PRESENT=0`), handbrake
(`brakes.ini:7` `HANDBRAKE_TORQUE=0`), DRS (`drs.ini` is 0 lines), wing animations (0 lines).

### How it moves
- Engine torque goes to all four wheels: `TYPE=AWD`, `FRONT_SHARE=45` (`drivetrain.ini:6`, `:28`).
- The turbojet adds thrust at a point behind the car: `vec3(0.0, 0.77, -2)` (`script_turbojet.lua:67`), force
  `shaft.angularSpeed * thrustMultiplier * throttle * speedThrustMultiplier` along local +Z (`:128-129`).
- Thrust rises with speed up to Mach 1 and is derated above it; the script takes Mach 1 as 1225 km/h
  (`script_turbojet.lua:105-116`).
- Turbine throttle is automatic: it follows the gas pedal times a drift-angle ramp between
  `helperStartAngle = 30` and `helperEndAngle = 60` degrees (`ohyeah2389_t180_mach6/data/car_config.lua:12-13`,
  `script.lua:221-222`); installed: 20 to 60 (`car_config.lua:17-18 @v0.12.0`).
- Head only: with no wheel load the turbine throttle is halved, "otherwise car will pitch down too much in
  flight" (`script.lua:214-215`, `:242`).

### How it turns
- Each wheel hub hangs from a swivel body turned by two script-driven distance joints
  (`suspensions.ini:28-49`; `ctrl_steer_lf_one.ini:3` `INPUT=SCRIPT_0`).
- The servo model allows -180 to +180 degrees per wheel and slews at 200 degrees per second
  (`script_threesixtyctrlr.lua:18-22`).
- Installed Classic controller: steering input sets a target yaw rate, `steerNormalizedInput * -12` rad/s, and
  wheels are held at an offset from their own slip angle (`script_wheelsteerctrlr.lua:222-242 @v0.12.0`).
- Wiki: "Holding the wheel straight instructs the system to hold the current heading" (wiki repo
  `e48c31f`, `System-Overview.md:15`).
- Driver switches: lock fronts, lock rears, spin left and right, auto-centre
  (`Source/base/extension/ext_car_controls.ini:85-127`).

### How it sticks
- Tyre grip from stock curves (table below) plus the scripted downforce.
- Installed downforce (`script.lua:377-386 @v0.12.0`):
  - sensor: `physics.raycastTrack(car.position + (car.up * 0.4) + (car.look * 1.0), -car.up, 1.0)`;
  - `suctionMult = clamp(remap(rideHeightSensor, 0.5, 0.9, 1, 0), 0, 1)`, and 0 when the ray hits nothing;
  - `aeroForce = aeroForceBase * velocityMagnitude * cosineDropoff * suctionMult`, base `-200` for T-180s,
    with `directionalDropoff = 1.0` (no loss when sideways).
- Head downforce (`script.lua:429-456`): ray from 0.4 m above the car origin, length 2.0; fades from full at
  0.5 to zero at 2.0; `aeroForceBase = -150`; and a new "stalling" term,
  `clamp(remap(rideHeightSensor, 0.4, 0.5, 0, 1), -1, 1)`, that removes the force when the surface is closer
  than 0.5 and turns it negative below 0.4.
- The force is added in the car's local frame (`ac.addForce(vec3(0, 0, 0), true, vec3(0, aeroForce, 0), true)`,
  `script.lua:456`), so it follows the car onto banking or a wall. [inferred] from the two `true` flags.
- Release note v0.11.0: "the car's downforce now is constant irrespective of chassis attack angle, simply scaling
  up with speed ... the downforce is greatly lessened when the car leaves the ground".

### How it stops
- Stock brakes only: `MAX_TORQUE=5500`, `FRONT_SHARE=0.64` (`brakes.ini:5-6`). No air brake found.
- Installed only: brakes auto-hold below 10 km/h with 200 Nm (`script.lua:56-66 @v0.12.0`); removed at the head.

### Jump jacks
- Four jacks at `(±0.8, 0.18, ±0.77)`, each `length = 1.2`, `baseForce = 60000` (`script.lua:49-72`; same at
  `script.lua:30-53 @v0.12.0`).
- Charge time 2 s; charge drains at 10 per second after release, so the push lasts about 0.1 s
  (`script_jumpjack.lua:39-40`, `:293`).
- Head: force is `baseForce * chargeState` (`:288`). Installed: `baseForce * (chargeState ^ 0.001)`, which is
  close to full force for any charge (`script_jumpjack.lua:110 @v0.12.0`).
- A jack only acts when a track raycast along the car's down axis finds a surface within its extension
  (`script_jumpjack.lua:134-139`). Buttons: all, left, right, front, rear (`script_controls.lua:8-14`).

## Numbers

| What | Value | File:line |
|---|---|---|
| Mass | `TOTALMASS=850` | `Source/base/data/car.ini:14` (same at v0.12.0) |
| Mass shown in the menu | `"weight": "775 kg"` | `Source/ohyeah2389_t180_mach6/ui/ui_car.json:16` |
| Menu power, torque, top speed | `"1797 bhp"`, `"1510 Nm"`, `">700 km/h"`, `"2.1 s 0-100"` | `ui_car.json:14-18` |
| Mach 6 engine torque before boost, head | peak `7200 \| 432` | `ohyeah2389_t180_mach6/data/power.lut:7` |
| Mach 6 engine torque before boost, installed | peak `7200 \| 820` | `power.lut:7 @v0.12.0` |
| Turbine thrust multiplier, Mach 6 | `3.15` (installed `1.5`) | `car_config.lua:19`; `:25 @v0.12.0` |
| Afterburner thrust | 0 to `6000` N (installed `2500`) | `script_turbojet.lua:136`; `:109 @v0.12.0` |
| Tyre size | `WIDTH=0.45`, `RADIUS=0.395` | `tyres.ini:19-20` |
| Lateral grip curve (load N \| mu) | `1000 \| 2.000`, `3000 \| 1.835`, floor `1.200` from 35000 | `tire_lat_curve.lut:11`, `:15`, `:79` |
| Body lift coefficient at 0 degrees | `0.000\|0.6790`, `CL_GAIN=1.0`, `ANGLE=0` | `wing_body_AOA_CL.lut:33`, `aero.ini:11-15` |
| Rear stabilizer | `ANGLE=6`, setup range -10 to 30 | `aero.ini:37`, `setup.ini:1103-1104` |
| Scripted downforce | 150 N per m/s (installed 200 N per m/s) | `script.lua:439`; `:379 @v0.12.0` |
| Steering lock (wheel in hand) | `STEER_LOCK=180`, `STEER_RATIO=15` | `car.ini:36-37` |
| Road wheel angle | ±180 degrees, 200 degrees/s | `script_threesixtyctrlr.lua:18-22` |
| Wheelbase | `WHEELBASE=3.43`, `CG_LOCATION=0.5` | `suspensions.ini:10-11` |
| Track width | `TRACK=1.8` front and rear | `suspensions.ini:23`, `:83` |
| Spring | `RATE=80000`, setup 40000 to 160000 | `suspensions.ini:59`, `setup.ini:293-294` |
| Coilover length range | `MIN_LENGTH=0.9`, `MAX_LENGTH=1.4`, `BUMPSTOP_GAP=0.05` | `suspensions.ini:64-69` |
| Underbody collider box | `CENTRE=0, 0.2, 0`, `SIZE=2.0, 0.5, 3.0` | `colliders.ini:7-8` |

- [inferred] Downforce at 100 m/s (360 km/h) is about 20 kN installed and 15 kN at the head, against a weight
  of about 8.3 kN: roughly 2.4 and 1.8 times the car's weight. At 200 m/s it doubles.
- [inferred] Core thrust tops out near 3 to 4 kN installed and 7 to 8 kN at the head: the shaft's drive torque
  fades to zero at 2000 rad/s (`script_turbojet.lua:133`) and the debug scale is 0 to 8000 (`:178`; 0 to 4000
  at `:151 @v0.12.0`).
- **Ride height:** no static ride-height figure is stated anywhere. What exists: `BASEY=-0.06`
  (`suspensions.ini:21`), the tyre radius, and the downforce sensor thresholds above.
- **Suspension travel:** no travel figure is stated; the coilover length range above spans 0.5 m.
- **g loads:** no limit or target is stated. The only uses are force feedback clamps of lateral g to ±5
  (`script_wheelsteerctrlr.lua:115`) and the head AI's grip, scaled by `clamp(Data.gForces.y, 1, 4)`
  (`script_opponent.lua:55`).
- **Top speed:** only the menu's `">700 km/h"`. The head AI aims for `baseSpeed = 600.0`, clamped 100 to 1000
  (`script_opponent.lua:279-285`).

## What it asks of a track

- **A physics surface under the car.** Downforce, jacks and the head AI's hover all use
  `physics.raycastTrack` along the car's down axis (`script.lua:429`, `script_jumpjack.lua:134`,
  `script_opponent.lua:33`). No hit means no downforce and no jack.
- **Surface names: none.** A search of every `.lua`, `.ini`, `.py`, `.md` file for surface, grass, sand, kerb and
  track-id calls found no script that reads a surface type or a track name. Grip on a surface is whatever stock
  tyre physics gives it. [inferred]
- **Width, banking, walls, tubes, jumps: nothing is stated.** No file gives a required width, radius or bank
  angle. [inferred] A car that corners at 30 to 60 degrees of drift with a 3.43 m wheelbase sweeps a wider
  path than its 1.8 m track.
- **Flight:** the rear stabilizer angle is the driver's pitch trim in the air (`setup.ini:1108`). Release note
  v0.11.0: "many tracks will need a different value anyway".
- **AI at the head:** cars other than the player (`car.index ~= 0`, `script.lua:188`) are driven by
  `script_opponent.lua`. It turns tyre forces off (`:321` `ForcelessTyres`), holds each wheel 0.4 m off the
  surface with a force (`:33-36`), and steers at points 30 to 150 m ahead taken from
  `ac.trackProgressToWorldCoordinate` (`:119-132`). It reads the spline's position only; no speed hint or side
  line is read. A track with no AI spline gives it nothing to follow. [inferred]
- **AI as installed:** `script_opponent.lua` does not exist at v0.12.0; only the stock `ai.ini`
  (`Source/base/data/ai.ini:5-26`). How the installed script behaves on AI cars was not traced.
- **Collider and custom tracks:** release note v0.10.0, "Decreased collider height for compatibility with custom
  physics tracks"; v0.10.1, "Raised collider to pre-v0.10 position (0.2m from 0.1m)".
- **Companion tracks in the repository: none.** No track folder, AI file or surfaces file is tracked. Release
  screenshots carry the id of a test track by the car's author (name left out here, as other authors' track names are in this repo) in their file names; it is not in this repository.
- **Addressed to track makers: nothing**, in the README, the wiki (8 pages, one empty) or the release notes.

## Shader patch, scripts and apps

- `car.ini:5` `REQUIRED_VERSION=3435`; `car.ini:2` `VERSION=extended-2`.
- README: "Custom Shaders Patch public version v0.2.8 or preview version v0.2.9p1 or higher" (`README.md:35`).
  Release note v0.10.0 disagrees: "CSP version v0.2.9public or v0.2.10preview1 is now mandatory and forced as a
  minimum via the version number lockout system". The reason given (`README.md:9`): the cars "rely on" the
  patch's "physics extensions ... to a high level".
- README also requires "Extended Controls, an app available from the in-game app \"App Shelf\"" (`README.md:36`).
- This machine has patch `SHADERS_PATCH=0.2.11`, `SHADERS_PATCH_BUILD=3465`
  (`C:\Program Files (x86)\Steam\steamapps\common\assettocorsa\extension\config\data_manifest.ini`).
- Car scripts: `data/script.lua` and its modules (physics); `extension/graphics.lua` (loaded by
  `ext_config.ini:124-125`), `physics_object.lua`, `car_coordinates.lua`, `ext_car_controls.ini`. Head adds
  `afterburner_plume.lua`, `vapor_cone.lua`, `display.lua` (an empty scaffold) and
  `data_override/telemetrick_connection.lua`.
- Replay data: 14 script channels (`car.ini:6` `SCRIPT_INPUTS_REPLAY`); installed has 12.
- App: `Apps/OneEightyDash` (wheel angles and turbine heat; `manifest.ini` `VERSION = 0.1.0`). It is not under
  `assettocorsa\apps\lua\` on this machine.
- No camera script was found; `cameras.ini` is plain data.

## Installed car against the repository head

- Installed `ui\ui_car.json` says `"version": "0.12.0"`, and so do the 13 sibling folders (list below).
- Installed `extension\` holds five files dated 2026-03-02. `ext_car_controls.ini`, `ext_config.ini`,
  `graphics.lua`, `physics_object.lua` and `car_coordinates.lua` all match tag v0.12.0 (git-blob ids equal,
  for example `graphics.lua` git-blob `846130d7`).
- `data.acd` was not unpacked, so the installed physics data is taken to be the v0.12.0 tree. [inferred]
- Head against v0.12.0 in `Source/base/data`, `Source/base/extension` and the Mach 6 data: 70 files changed
  (`git diff --stat v0.12.0 HEAD`). The ones a track plan feels are in the table and sections above:
  downforce base and fade range, thrust doubled, engine torque about halved, jack force law, the new AI,
  active suspension, air roll control, adjustable springs, dampers and bump stops.
- Sibling folders present, list only: `ohyeah2389_t180_corsair`, `_demo`, `_fumee`, `_gladiator`, `_mach6`,
  `_talon`, `_typea`; `ma_t180_augury`, `_gigerbon`, `_grx`, `_hangul`, `_krysha`, `_typee`, `_typef`.
  Also `ohyeah2389_proto_mach4`, `ma_proto_uniron` and a `_d1` copy of each.

## Licence

`LICENSE.txt:1`: "The physics assets of this work are licensed under the Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 International License."

`LICENSE.txt:3`: "The art assets of this work are licensed under the Creative Commons
Attribution-NonCommercial-NoDerivatives 4.0 International License."

Release note v0.11.0: "Clarified license included with the release (art assets are and have always been
BY-NC-ND, physics assets are and have always been BY-NC-SA)". No other terms about derived work or
redistribution were found. Neither file says anything about tracks.

## What a track builder should not assume

- **That downforce grows with speed squared.** The scripted part is linear in speed and zero at rest. The stock
  wings add a squared part on top, which was not sized here.
- **That the car sticks to any surface at any distance.** The sensor ray is short and points along the car's
  down axis. Past 0.9 m (installed) there is no scripted downforce at all.
- **That the installed car and the public head drive alike.** They differ in thrust, torque, downforce and jacks.
- **That jacks are a tuned jump height.** No height or airtime is stated; only force, stroke and charge time.
- **That there is air control.** Installed: none beyond the stabilizer angle and the jacks. Head: a roll force of
  at most 100 N at ±10 m arms, only when the downforce sensor reads far from the ground (`script.lua:485-491`).
- **That there is a boost the track can trigger.** Afterburner is a driver button and the clutch pedal. No pad,
  zone or trigger object is read from the track.
- **That surfaces need special names.** None are read.
- **That the AI drives the car the player drives.** At the head it is a separate hovering force model.
- **That a top speed, g limit, minimum width, bank angle or loop radius is documented.** None is.
- Looked for and not found: a track in the repository, a manual in the repository or in the installed Mach 6
  folder (the v0.12.0 release note says one ships in the zip), a static ride height, a camera script, a
  changelog file (release notes live on the hosting site only), and the wiki's "Driver Info" and "Tuning Info"
  pages (the sidebar lists the headings with no pages under them).
- Not read in full: `script_wheelsteerctrlr_v2.lua`, `script_wheelsteerctrlr_active.lua`,
  `script_turboshaft.lua`, `graphics.lua`, `setup.ini` beyond its ranges, and the sibling cars' overrides.

---
**Librarian's check, 2026-11-27 05:22 (L):** four claims re-read against the clone and the installed car, 4 of 4 hold: the head sha and the tag (119 commits apart, `git rev-list --count v0.12.0..HEAD`); the installed downforce lines (`script.lua:377-386` at v0.12.0: base -200, the 0.5 to 0.9 fade, the 1.0 m ray); the head's lines (`script.lua:429-439`: base -150, the 2.0 m ray, the stalling term); `LICENSE.txt:1` and `:3`; the installed `ui_car.json` version 0.12.0. One track name of another author was bracketed by the librarian before the commit (1 place). The rest of the note is the researcher's and not re-read against the source.
