# Scout: Overgrowth's procedural method, complete (key poses, curves, springs, physics)

1. Overgrowth's whole run is a speed-sorted set of looping keyed cycles, sampled on one shared phase by Catmull-Rom,
   played at a rate that scales with ground speed, lifted by a gravity arc; procedural layers sit on top. [2nd reader: DOWNGRADED: the machinery is read (sort syncedanimation.cpp:75-76, mix :194, rate :286-299); which cycles the run holds, their coords, loop flags and bounce are closed XML (no Data/Animations in the 245fe48 tree), so "the whole run" is [inferred].]
2. The "spring between additive poses" the room never found ~~IS in the code~~ [2nd reader: a spring on the crouch weight IS in the code (aschar.as:9225-9232; zeta 0.638 reproduced), but it feeds `SetBlendCoord("tall_coord", 1 - duck_amount)` (aschar.as:11845), a blend coordinate; "additive" is in none of aschar.as, syncedanimation.cpp, animation.cpp, animationclient.cpp (grep, 0 hits), so that this is Rosen's step 10 is [inferred]. DOWNGRADED]: the crouch weight rides an underdamped
   spring (zeta 0.64), kicked on landing (aschar.as:8429-8431, :9225-9232). That corrects the room's C5.
3. Of the method's steps, main already has 1-8 in its own sourced form. It lacks the spring-weighted additive poses,
   the keyed-cycle sampler, keeping the centre of mass in place under a look, and any landing pose.
4. Design: one layer of a few additive key poses plus keyed cycles, with weights stepped per 240 Hz tick in DrawnChaser.
   It is picture only and costs well under 1 microsecond per character. First lap: a chaser's landing crouch out of a Drop.
5. The owner's eye decides one clip with three columns: main, Overgrowth's exact snap, and our start from the fall speed.

Scout, 2026-11-13. Read-only; nothing built or run except a 10-line node arithmetic check (named where used).
Marks: [read] I opened it; [summary] secondary or a swarm/ground file; [inferred] mine; [ours] a proposal.
Overgrowth is read at github.com/WolfireGames/overgrowth commit **245fe48** (main, fetched 2026-11-13); paths below
starting `aschar.as`, `aircontrols.as` are under `Data/Scripts/`, the `.cpp` files under `Source/` (Asset/Asset,
Graphics, Objects). Game code: dreamzone-3 main **31d1c6d** [read: `git log -1 main`]. Ground files are cited as
`G-sources`, `G-code`, `G-loco`, `G-phys`, `G-cons`, `G-words` (the six files in this folder).

## 1. What the room already has for this aspect

- Overgrowth code is Apache-2.0, art and animations closed [summary: G-sources:26-28]. Read before: `aschar.as`
  HandleAccelTilt/UpdateTilt, HandleFootStance, `movementobject.cpp:2540-2686` foot IK, `ledgegrab.as`,
  `interpdirection.as` [summary: G-sources:29-33].
- Landed on main: the acceleration tilt in `DrawnChaser`, as half-lives at 240 Hz [summary: G-sources:34-38; read:
  game/model_rig.cpp:503-516, game/model_rig.h:325-326]. Built, not landed: feet with memory [summary: G-sources:39-41].
- Not taken: the 0.7/0.5/0.4/1.0 balance shares, interpdirection, the climb grips, the closed animations
  [summary: G-sources:42-48].
- Rosen's GDC 2014 talk: never watched; known only through techarthub's ten-step list [summary: G-sources:133-145].
  The ten steps are at `handback/p-l179-talks-C_2026-11-12.md:26-35` [read].
- Correction C5: "the code ... uses exponential `pow(k, frames)` easing, and the additive-pose spring was not found"
  [summary: G-sources:254-255]. Owed: the talk itself, the keyed run poses, the timer rate [summary: G-sources:277-286].
- In the game: hunter phase per metre from Alexander's law, advanced per drawn FRAME (stage.cpp:269) [summary:
  G-code:28, :34-36; read: game/world/stage.cpp:269]; the flight rise `0.5 g t^2 x(1-x)` [read:
  game/model_rig.cpp:776-781]; chasers posed only for run/stand, Drop/Recover not posed [summary: G-code:63].
- Only the first hunter draws as a model; the other kinds are boxes [summary: G-code:38-39, G-cons:107-121].
  DrawnChaser already steps every chaser of every kind each tick [read: game/world/world_app.cpp:567-588].
- Picture only is enforced by the world self-test's part 7 and by replaying his 16 kept runs [summary: G-cons:33-54].
- The upper-body physics layer (soft keyframe) is green but on a local clone only [summary: G-phys:3-5, :75-80].
- Thin: no ground file covers how Overgrowth makes a pose from its keys, how fast it plays them, its bounce, its crouch,
  its look springs, its arms or its balance terms. That is §2.

## 2. What I read at source that is NEW

### Licence (rule 5)
- Overgrowth code: **Apache License 2.0**. [2nd reader: RE-DERIVED in substance with G-sources:26-28 (Apache-2.0, assets purchase-only, keep LICENSE and notices); new is the section-4 text and the file-header check.] I read the LICENSE file at 245fe48 (201 lines; section 4 "Redistribution",
  LICENSE:89-128) and README.md:1-53 [read: raw.githubusercontent.com/WolfireGames/overgrowth/245fe48.../LICENSE].
  Commercial game: **allowed**. Attribution: **yes**: ship a copy of the licence (4a) and keep notices (4c); mark
  ~~changed files if source is distributed (4b)~~ [2nd reader: LICENSE:97-98, 4(b), says "cause any modified files to carry prominent notices" with no source-only condition; "If you distribute the code itself" is README.md:35, its own gloss ("not legal advice"). README.md:23 adds "Unless otherwise noted"; the 8 files I opened all carry the Apache-2.0 header.]. No share-alike. Redistribution: allowed under 4. No NOTICE file exists in
  the tree [read: the git tree listing, `grep NOTICE` → none]. Assets: "can only be legally obtained by purchasing" and
  need "explicit written permission" to distribute [read: README.md:2, :12].
- What I propose to USE is the IDEA and its constants restated as half-lives, with a source comment. I copy no code.
  That matches how the tilt landed [read: game/model_rig.h:298-304]. If a builder ever copies a function, 4a-4c apply.
- Rosen's blog post "Angular and linear keyframe blending" (2010-04-24): © Wolfire, no licence shown. Cite only
  [read: https://www.wolfire.com/blog/2010/04/Angular-and-linear-keyframe-blending, whole text].
- Rosen's talk: video only. The captions track exists, but YouTube returned 404 to a plain fetch. So the talk is
  still unread; what it says stays [summary] from techarthub (ground) and one student page (below). [2nd reader: OK, reproduced: the video is on the GDC channel (id LNidsMesxSE, 1573 s; description: "very few key frames, with examples from ... Overgrowth, Receiver and Black Shades") and the signed captions URL gives 404 to curl. RE-DERIVED with G-sources:135-136 ("Read: NO. Video only").]

### The whole method, in the order a pose is made (has / lacks / does not fit)

| # | step | Overgrowth at source | main 31d1c6d |
|---|---|---|---|
| 1 | The controller moves the body; animation reads it | `UpdateGroundMovementControls` vs `UpdateAnimation` [summary: p-l179-talks:44] | HAS: picture only [summary: G-cons:33-54] |
| 2 | Face the velocity at a capped rate | turn toward velocity at `ts.step()*10` rad, look kept within 0.6 pi [read: aschar.as:11931, :11954-11962] | HAS in Valve's form, 12.566 rad/s [read: model_rig.h:327] |
| 3 | Acceleration tilt | about the frame's CENTRE OF MASS, whole skeleton [read: aschar.as:13922-13934] | HAS, about the pelvis [summary: G-code:269] [2nd reader: DOWNGRADED: G-code:269 is a list of test names; "about the pelvis" is true at game/model_rig.cpp:620-640 (kinetic_chain pivots on p[Pelvis], lean split pelvis/trunk/head by shares :601-607, main 31d1c6d), not one rigid turn of the whole skeleton] |
| 4 | Stride wheel | rate = cycle freq x (ground speed / the cycle's ground speed) [read: syncedanimation.cpp:286-299]; phase += dt x rate [read: animationreader.cpp:76] | HAS: phase per metre from Alexander [read: stage.cpp:269] |
| 5-6 | Speeds, blended | cycles sorted by a coord; the two nearest mixed linearly [read: syncedanimation.cpp:82-124, :194]; optional extrapolation past the ends [read: :206-222] | HAS as continuous fitted curves (Fukuchi, Dorn on a branch) [summary: G-loco:90-113] |
| 7 | Bounce gravity | centre offset += `(v0 t + g t^2) x run_bounce`, `v0 = -T g`, t inside each half cycle [read: syncedanimation.cpp:141-165] | HAS: flight rise from Newton [read: model_rig.cpp:776-781] [2nd reader: PARTIAL: Overgrowth's arc covers every half cycle (syncedanimation.cpp:157-163, amplitude from closed XML run_bounce); main's rises only in the flight share] |
| 8 | Phase blending | both cycles sampled at the same normalized time [read: syncedanimation.cpp:176-178] | HAS: one phase drives both legs [read: model_rig.cpp:758-762] |
| 9 | ~~Additive~~ [2nd reader: :11845 sets a blend coordinate; "additive" is not in the code] crouch pose | `tall_coord = 1 - duck_amount` into the blend tree [read: aschar.as:11845] | LACKS for chasers |
| 10 | Spring between additive poses | duck spring: `duck_vel += (target-duck) x step x 120; duck_vel *= 0.89^frames` [read: aschar.as:9225-9232]; landing sets duck 1, target 1, vel `10 x 0.3` [read: :8429-8431] [2nd reader: OK; but only inside `if(dot(this_mo.velocity * -1.0f, ground_normal)>0.3f)` (aschar.as:8401), and the target is reset every frame at :7453-7461] | LACKS |
| K | Key poses to a pose | four keys around the time, Catmull-Rom weights [read: animation.cpp:1285-1316, :827-834]; rotations blended by nested mixes [read: :836-851], parent-relative ("angular") when parents are known [read: :1345-1350] | LACKS: no keyed pose anywhere |
| L1 | Look: chest then head | two underdamped springs, chest softer [read: movementobject.cpp:2242-2248, :2426-2441; script twins aschar.as:14928-14934, :15059-15074]; tiny random shake 0.005 / 0.001 rad [read: :14928-14930, :15059-15061] | HAS another sourced form: Valve ease + ozz spread [read: model_rig.cpp:528-541] [2nd reader: :528-541 is the Valve ease only; the ozz spread is at model_rig.cpp:333-337] |
| L2 | Keep the centre of mass under a look | upper keys shifted so the COM estimate is unchanged, on the ground (horizontal only) [read: aschar.as:14213-14223] | LACKS |
| L3 | Foot IK with memory | [summary: G-sources:39-41] | built, not landed |
| L4 | Hip IK: legs keep their keyed length | two passes, hip roll capped at `max(0, 0.2 - 0.2 x speed)` rad, offset eased 0.95 a frame [read: movementobject.cpp:2754-2766, :2776-2779, :2799] | PART: hips sink up to 0.30 m, legs re-reached [read: model_rig.cpp:459-475] |
| L5 | Arms as particles | elbow and wrist carried by body velocity with drag 0.92 a frame, pulled to the keyed arm by `mix(0.9, 0.97, loose)`, `loose = 1 - speed/max - threat` [read: movementobject.cpp:1769-1788; script aschar.as:12622-12697] [2nd reader: DOWNGRADED: loose is also 0 in combat idle, 0.7 in the air, 0 while flipping (movementobject.cpp:1772-1785); drag 0.92 and 0.9/0.97 reproduce] | LACKS (the soft-key physics on a clone plays this role [summary: G-phys:75-80]) |
| L6 | In the air, keep the COM | whole pose shifted back to the COM before the procedural edits [read: aschar.as:14513-14523] | LACKS (Drop not posed) |
| L7 | Air pose from vertical speed, not time | `up_coord` from `velocity.y / jump speed`; flail from speed [read: aircontrols.as:120-141] | LACKS for chasers; the player has an Air move [summary: G-code:63] |
| L8 | Breath with memory of effort | rate `0.9 + 4 x speed_ratio`, inertia `mix(0.999, 0.99, speed_ratio)` a frame [read: aschar.as:2334-2339]; chest, collar and shoulder offsets [read: :2086-2113] | LACKS |
| L9 | Idle weight shifts | random COM target every 0.7-4 s, spring 5 with 0.97 drag [read: aschar.as:14412-14442] | LACKS (no idle in a chase) |
| L10 | Overshooting fade out | `sin(opac x 3pi/2 + pi) x opac`, negative part x 0.3 [read: animationclient.cpp:314-318, :167] | LACKS |
| L11 | Per-bone physics strength keyed in the poses | blended like any channel [read: animation.cpp:1389-1397]; max of a joint's two bones x ragdoll strength [read: riggedobject.cpp:1280-1289] | the L185 idea, on a clone [summary: G-phys:94] |

Two things found in passing [read]: `syncedanimation.cpp:289-294` tests `prev_anim.ground_speed` twice, so the second
cycle's "no ground speed" flag is never honoured (a copy slip). And `aschar.as:8398` lands every fall with a fixed
`land_speed = 10.0f`; the real speed is commented out on the same line.

### What the numbers are in seconds (Overgrowth's 120 frames a second; conversion [inferred])
- Crouch spring: `omega^2 = 120 s^-2` (omega 10.95 rad/s); decay `-ln 0.89 x 120 = 13.98 s^-1`; **zeta 0.638**.
  My node check, at 120 Hz and at 240 Hz, from Overgrowth's landing state (weight 1, velocity 3/s, target 0): 2.5%
  deeper at 21 ms, about 7% past standing at 0.40 s, within 2% by 0.58 s. ~~Both rates agree to 0.004.~~ [2nd reader: not reproduced (script not kept): same constants give 0.007 apart at 21 ms (120 Hz peak 1.0205 at 17 ms; 240 Hz 1.025), 0.005 at 0.40 s, 0.012 at most (0.267 s). The 7% and 0.58 s do reproduce. 120 Hz itself is read: engine.cpp:6097 SetStepFrequency(120). UNSUPPORTED]
- Head spring: stiffness 0.8 a frame gives omega 9.80 rad/s; damping 0.9 a frame gives **zeta 0.645**. Its speed is capped at 15 rad/s.
  Chest: omega 7.75 rad/s, **zeta 0.562**. The chest is the softer, slower spring, so the head leads and the trunk
  follows. [2nd reader: omegas and zetas reproduce, but only with idle_look_amount = 0 (aschar.as:14166-14184); an AI neither controlled nor in combat gets chest stiffness 0.03 and damping 0.99, and a third-order head (accel inertia 0.99, damping 0.95). DOWNGRADED] Head range 1.3 x 0.7 = 0.91 rad for a non-rabbit [read: aschar.as:15039-15043]; chest 1.0 [read: :14913].
- Arms: pull half-life 0.055 s at full speed, 0.19 s standing; velocity drag 10.0 s^-1.
- Hip offset ease: half-life 0.113 s. Breath: rises with half-life 0.58 s at full speed, falls with 5.8 s at rest.
- Run bounce: `g t (T - t) x run_bounce`, so `run_bounce = 0.5` is a ballistic arc over each half cycle. The values
  live in the closed XML data (`run_bounce`, `ground_speed`, `coord` attributes [read: syncedanimation.cpp:336-350]).

### Secondary, for the talk only
- Student re-implementation of the talk: walk and run "composed of just four keyframes each: a pass and reach pose for
  the left and right sides", one crouch key, one idle key [summary: people.engr.tamu.edu/sueda/courses/CSC474/2016W/
  demos/ismithgr/index.html, read whole; a student's account, not Rosen's].
- Rosen's blog: angular blending propagates local rotations out from a root bone (the pelvis); linear blending makes a
  hand pass through a thigh; the roll is "more complicated than just blending between five keyframes" [read: the
  Wolfire post above]. The code agrees: parent-relative blending [read: animation.cpp:1345-1350].

### What the method says about WEIGHT [inferred from the code above; Rosen's own words unread]
Weight is never a keyed property. It comes from the procedural layers, each tied to a physical quantity:
1. the feet are not dragged: the phase follows ground speed (step 4);
2. vertical motion is a gravity arc, not a sine (step 7);
3. the body leans by its acceleration, an object being pushed (step 3);
4. ~~every add-on lags through an UNDERdamped spring (zeta 0.56-0.65), the heavier part softer~~ [2nd reader: only the crouch, chest and head are second-order springs (aschar.as:9225-9232, :14932-14934, :15063-15074); tilt, arms, hips, breath are first-order eases (aschar.as:7925; :12624-12636; movementobject.cpp:2799; aschar.as:2336); "heavier part softer" is [inferred], the code carries no mass] (chest under head, L1);
5. an impact is a velocity kick into a spring, not a keyed squash (step 10);
6. the centre of mass stays where physics puts it: under a look on the ground, on its arc in the air (L2, L6);
7. limbs carry the body's momentum and lose it to drag (L5); and effort is remembered, as in breath (L8).

## 3. The design for this aspect [ours, built on §2]

**One layer: a few key poses plus curves, all additive on the procedural base, all picture only.**

- **Inputs:** what DrawnChaser already reads each tick (position, heading, look, gait) plus the gait's transitions
  [read: world_app.cpp:578-581]. For the player, Body's move weights and PlayerState [summary: G-code:46-47].
- **Outputs:** per-entity floats carried in ChaserPose like `lean` and `pitch` (a crouch weight first), read in
  `apply_motion` [read: model_rig.cpp:415-476]; later, keyed-cycle angles read by `gait_pose`.
- **Parts:**
  1. *State poses* (Overgrowth steps 9-10): one key pose each (crouch first), weight `w` on a spring. The constants
     are Overgrowth's as rates: `omega^2 = 120 s^-2`, `c = 13.98 s^-1`, integrated per 240 Hz tick inside
     `DrawnChaser::step` [read: model_rig.cpp:498-544], as the tilt is. An event is a velocity kick.
  2. *Keyed cycles* (the "K" row) for gaits with NO recorded data: the crawler, the stalk, the climb, the rise to upright.
     Four keys (pass/reach, left/right) on the phase, Catmull-Rom between them. The clock is Alexander's phase per
     metre [read: model_rig.h:335], or a fixed rate for T4: Overgrowth plays a cycle with no ground speed at its own
     frequency (freq_mult 1) [read: syncedanimation.cpp:289-294] [2nd reader: DOWNGRADED: honoured for the FIRST cycle of a pair only (the second test reads prev_anim again, :292); a missing XML ground_speed falls back to the asset's own ground speed (:274-283), not to "own frequency"], and that is T4's "stride rate nearly fixed"
     [summary: G-loco:158]. Two keyed cycles mixed by speed (steps 5-6) keep the feet from sliding. [2nd reader: UNSUPPORTED as a claim about sliding: Overgrowth mixes by coord and scales rate to ground speed (syncedanimation.cpp:286-299); nothing read shows this stops a slide; it is [ours] and unmarked]
  3. *Order*, as Overgrowth's final update: base pose, tilt, look, COM kept, feet, hips [read: aschar.as:13920-14402].
     Main's order is base, chain, feet re-reached [read: model_rig.cpp:415-476]; the state pose slots before the legs
     re-reach, so the existing IK bends the knees.
- **Parameters, few:** the spring (2 numbers, Overgrowth's); the kick (Overgrowth's is 3 a second, fixed); one depth
  per key pose [ours, no source: Overgrowth's crouch key is closed data]. I'd set the crouch depth as a share of hip
  height, so it scales per body, and let his eye pick it.
- **Where it sits:** `game/model_rig.{h,cpp}` (DrawnChaser fields, `GaitMotion.crouch`, `apply_motion`),
  `game/world/world_app.{h,cpp}` (`ChaserPose.crouch`, the transition in `ease_poses`, the lerp in `chaser_poses`
  :539-560), `game/world/stage.cpp:271-278` (`motion.crouch = p.crouch`) [read: each file at the lines named].
- **Cost per character per frame [inferred, not timed]:** the spring is about 10 flops a tick (two exp constants are
  precomputed). The frame adds one lerp, and the crouch ~~reuses the sink loop that already runs~~ [2nd reader: WRONG as stated: with no lean, no tilt and a flat floor `legs` stays false and apply_motion returns at game/model_rig.cpp:453 before the sink loop (:459-475, main 31d1c6d); with no floor probe it returns at :422. The crouch must set `legs` itself, as section 4 says]. A 4-key Catmull-Rom
  cycle costs 4 multiply-adds per channel; 20 channels and 2 speeds come to about 200 flops. All of it is far under 1
  microsecond; G-code:239-240 puts gait_pose itself at single-digit microseconds [2nd reader: DOWNGRADED: that line is [inferred] and says "Not measured"]. Nine chasers cost under 10 us of the
  3.33 ms frame.
- **Hunter:** the landing crouch and the wall-hit stop, through the existing model path [read: stage.cpp:267-281].
- **A lesser chaser:** DrawnChaser already steps every kind [read: world_app.cpp:569-586], so the weight exists for all.
  With a model, it is the same path with its own rest joints [summary: G-code:191-194]. Its own gait, if no human data
  fits, is a keyed cycle (part 2). Example, the crawler on all fours (T4 [2nd reader: DOWNGRADED: T4 rests on an insect abstract, Full & Tu 1991, G-loco:158]): four keys and a fixed cycle rate; speed
  comes from two keyed stride lengths. [2nd reader: no source and no [ours] mark; Overgrowth gets speed by scaling rate to ground speed, not by fixed rate plus stride length] The key values are [ours] until a source is read. Item 169 picks T4 for the
  crawler [summary: G-loco:166].
- **The player:** Body hangs from the eye [summary: G-code:59], and the camera rows must stay exact [summary:
  G-code:292]. So the crouch cannot lower the eye. The layer serves the player's parts the eye does not carry: arm and
  hand state poses (a brace, a fist) on spring weights instead of the 0.045 s blend [summary: G-code:165]. That is a
  later lap.
- **Determinism:** the weight is stepped per sim tick from the sim's own ChaserPose stream, so a replay draws the
  same weights. Unlike `hunter_phase_`, it does not depend on frame rate [read: stage.cpp:269].

## 4. The first lap: a chaser's landing crouch out of a Drop

- **Why this piece:** the chase has a real landing. At the end of a Drop link a chaser goes Mesh, then Recover for
  `drop_recover_s` 0.7 s at speed 0 [read: chase/chaser.cpp:106-121, chase/archetype.h:53]. Today Recover counts as not
  on its feet, so the tilt decays to zero [read: world_app.cpp:578; model_rig.cpp:513-515]. The hunter lands in a stand
  with no impact.
  Overgrowth's spring settles in 0.58 s [inferred, node check above], inside that 0.7 s Recover.
- **Smallest build:** DrawnChaser gains `crouch, crouch_vel`. `ease_poses` keeps last tick's gait per id and kicks on
  Drop → anything. The spring runs per tick toward 0. `apply_motion` takes `max(sink, crouch x depth)` (still under the
  0.30 m cap) and sets `legs = true`, so `reach_leg` bends the knees [read: model_rig.cpp:459-475].
- **Start condition, the one [ours] line:** Overgrowth snaps the weight to 1 at landing [read: aschar.as:8429]. A snap
  is a one-tick pelvis jump, and item 195 rejected the hunter's "up down up down" [read: briefs/dreamzone2_the_game.md:
  1514]. So the default I'd take starts at weight 0 with velocity = landing fall speed / depth (the hips keep falling
  and the spring stops them, Newton). Overgrowth's snap stays the sourced alternative in the clip. What would change my
  mind: his eye preferring the snap.
- **Files:** game/model_rig.h, game/model_rig.cpp, game/world/world_app.h, game/world/world_app.cpp,
  game/world/stage.cpp, game/tests/model_rig_tests.cpp, game/tests/world_app_tests.cpp.
- **Rows:**
  - red then green, scripted: `landing_from_a_drop_the_drawn_hips_sink_and_rise_back_inside_the_recover` on a
    DrawnChaser fed a Drop then Recover stream. Red today: dip < 1 cm. [2nd reader: UNSUPPORTED: not run, and no such row exists on main] Green: the dip reaches at least 0.8 x depth,
    there is one rise past standing of 3-12% of depth (Overgrowth's is 7%) [2nd reader: DOWNGRADED: 7% is the spring's value; it is drawn only if the closed group XML sets <Overshoot>true (syncedanimation.cpp:324-326, default false :380, clamped otherwise :206-222), which no open file shows], and the hips are within 2% of depth by 0.6 s.
  - The same row on a RECORDED case: on the first of his 16 kept runs whose hunter makes a Drop → Recover. The builder
    finds it with a count of those transitions per run. I did not check that one exists. If none does, say so; the
    scripted row then stands alone.
  - Kept green: replays byte-identical (part 7, his 16 runs) [summary: G-cons:46-53]. No joint moves more than the
    ~~existing per-tick jump bound at landing~~ [2nd reader: UNSUPPORTED for chasers: the only such bound on main is the player Body's, game/tests/body_tests.cpp:294-295; model_rig_tests.cpp has none].
  - The tier is "check it": a person would notice, and it does no lasting harm.

## 5. What only the owner's eye decides, and the fewest clips

- **One clip, three columns, at full frame rate and lit** (the 216 ruling [summary: G-cons:159-161]): the hunter
  landing from a drop: (a) main, (b) Overgrowth exact (snap to 1, kick 3/s), (c) Overgrowth's spring, started from the
  fall speed. It decides three things: whether the 7% rise past standing reads as weight or as the bob he rejected
  (195), snap or continuity, and the depth (shown at one value; a second depth only if he asks).
- **Not this lap, his eye later:** the keyed crawler or stalk cycle (no source for the stalk [read: briefs/
  dreamzone2_the_game.md:1556]); and the uncanny tweaks. His method is "we get the a good metric for a really human
  looking sprint which we had, and then we tweak it from there to look uncanny in a realistic way that obeys physics"
  [read: briefs/dreamzone2_the_game.md:1607]. Additive key poses on the sourced run are the place such a tweak lives.
  Which tweak reads as creepy is his to judge.

## 6. What I would NOT build, and why

- **Keyed pass/reach poses in place of the sourced run curves.** The hunter's legs are fitted to recorded runners
  [summary: G-loco:90-95]; keys are for gaits with no data. Item 153 says build what the sources found
  [read: briefs/dreamzone2_the_game.md:1109].
- **Overgrowth's look springs in place of Valve's ease.** It is a swap with no red row; he ruled "Keep source"
  [summary: G-words:344-346] [2nd reader: DOWNGRADED: that ruling (item 157, G-words:344-346) was on "the sourced lean", not on the look]. Reported only: a sourced head-first chain with the trunk softer, if item 163's look
  ever needs it.
- **The arm particles.** Not with the soft-key physics already green for the same job [summary: G-phys:75-80]. Two
  layers for one limb would fight.
- **Tilt about the COM instead of the pelvis.** A small difference, with no report against it. Noted only.
- **Overgrowth's unseeded random shake and idle drift.** They break reproducible captures. If ever wanted: seeded by
  entity id and tick, and [ours].
- **Anything that couples back:** Overgrowth's crouch changes its collision sphere [read: aschar.as:8456-8460], and
  its keys can carry a mobility matrix (`use_mobility` [read: animation.cpp:209-216]) and some animations are played
  `_ANM_MOBILE` [read: aschar.as:12015]; that these move the character is my reading [inferred]. Here animation never
  moves the sim.
- **Clips or blend trees from outside data:** Overgrowth's are closed [read: README.md:2], and no data is cleared
  [summary: G-sources:187-197].
- **Breath, idle stepping and the stance planner for chasers:** there is no idle in a chase. They are worth reading
  again for the waking room.

## What I did not open
- Rosen's talk (video; captions 404 to a plain fetch); the techarthub page itself (ground's account used).
- Overgrowth's `riggedobject.cpp` beyond :1262-1300; `movementobject.cpp` beyond the functions cited; `fliproll.as`,
  `ledgegrab.as`, `interpdirection.as` (ground has them); `CDrawFinalBoneIK`, `CDrawLeg`, ear and tail code; any XML or
  `.anm` data (not in the repository).
- The game's kept runs (so whether any holds a hunter Drop is unchecked); `chase/run.cpp` beyond grep hits;
  `game/body.cpp`; the l205-stomp-c and l185 branches; any worktree.
- The record's hand-backs beyond p-l176 and p-l179-talks (whole) and the grep hits named; the other swarm scouts' files.
- The moddb, handmade.network, Unity, Urho and reddit pages the search returned (secondary; moddb answered 403).

## Second reader

2nd reader, 2026-11-13. Opened at primary: Overgrowth at 245fe4828631c84c0023d29d1525f5716ccb6106 (every cited file downloaded with
curl and read by line), LICENSE and README.md of that commit, the Wolfire blog post, the student page, the YouTube watch page,
dreamzone-3 main 31d1c6d via `git show`, the brief and hand-back lines. Computation: one 12-line node run of the crouch spring.
Numbers below reproduce unless stated. Scout line numbers are the scout file's own (before my inserts).

| Scout line | Claim | Primary opened | Verdict | Evidence |
|---|---|---|---|---|
| 3-4 | Whole run is a sorted set of looping cycles on one phase | syncedanimation.cpp, tree listing | DOWNGRADED | sort :75-76 read; cycles are closed XML, no Data/Animations in tree |
| 5-6 | Crouch spring is Rosen's "spring between additive poses" | aschar.as:9225-9232, :11845; grep | DOWNGRADED | spring read, zeta 0.638; it feeds a blend coord; "additive" 0 hits |
| 46-47 | LICENSE 201 lines, section 4 at :89-128 | LICENSE | OK | 201 lines; "4. Redistribution" :89; paragraph ends :128 |
| 48 | Commercial use allowed, attribute, no share-alike | LICENSE, README:22-33 | OK | 4(a)-(c); README:23 Apache-2.0; no share-alike clause |
| 48-49 | Mark changed files only if source distributed (4b) | LICENSE:97-98, README:35 | DOWNGRADED | 4(b) has no such condition; that is README's gloss |
| 49-50 | No NOTICE file in the tree | git trees API, not truncated | OK | only Libraries/.../THIRD_PARTY_NOTICES.txt |
| 50-51 | Assets purchase-only; written permission to distribute | README.md:2, :12 | OK | both quotes match |
| 54-55 | Rosen blog (c) Wolfire, no licence; quotes | blog page, whole text | OK | footer "(c) 2026 Wolfire Games"; three quotes match |
| 56-57 | Talk captions 404 to a plain fetch | YouTube watch page, timedtext URL | OK | reproduced; video id LNidsMesxSE found |
| 64 | Turn 10 rad/s, look within 0.6 pi | aschar.as:11931, :11954-11962 | OK | `ts.step()*10`; 120 steps/s from engine.cpp:6097 |
| 64 | main yaw rate 12.566 rad/s | model_rig.h:327 @31d1c6d | OK | `kYawRate = 12.566f` |
| 65 | Tilt about the frame COM, whole skeleton | aschar.as:13922-13934 | OK | `frame_com`, `TransformAllFrameMats` |
| 65 | main tilts about the pelvis (G-code:269) | ground_code.md:269; model_rig.cpp:620 | DOWNGRADED | cited line lists tests; true at kinetic_chain |
| 66 | Stride rate and phase advance | syncedanimation.cpp:286-299, animationreader.cpp:76 | OK | `timestep * GetSpeedNormalized` at :76 |
| 66 | main phase advanced per drawn frame | stage.cpp:269 | OK | `last_dt_` |
| 67 | Two nearest cycles mixed, extrapolation optional | syncedanimation.cpp:82-124, :194, :206-222 | OK | `mix(prev, next, weight)` :194 |
| 68 | Bounce `(v0 t + g t^2) x run_bounce` | syncedanimation.cpp:141-165 | OK | equals b g t (T-t); b 0.5 is ballistic |
| 68 | main HAS the bounce | model_rig.cpp:776-781 | DOWNGRADED | main rises in flight share only; Overgrowth every half cycle |
| 69 | Both cycles sampled at one normalized time | syncedanimation.cpp:176-178 | OK | same `normalized_time` |
| 70 | Step 9 "Additive crouch pose" | aschar.as:11845 | DOWNGRADED | blend coordinate only |
| 71 | Duck spring and landing kick | aschar.as:8429-8431, :9225-9232 | OK | within `if(dot(...)>0.3f)` :8401; target reset :7453-7461 |
| 72 | Catmull-Rom of four keys, parent-relative | animation.cpp:827-834, :836-851, :1285-1316, :1345-1350 | OK | standard weights; nested mixes |
| 73 | Look springs and shake 0.005 / 0.001 | movementobject.cpp:2242-2248, :2426-2441; aschar.as twins | OK | lines match |
| 73 | main look is "Valve ease + ozz spread" at :528-541 | model_rig.cpp:333, :528-541 | DOWNGRADED | :528-541 is Valve only; ozz at :333 |
| 74 | Keep COM under a look, horizontal | aschar.as:14213-14223 | OK | `balance_offset.y = 0` |
| 76 | Hip IK cap and 0.95 ease | movementobject.cpp:2754-2799 | OK | :2777, :2799 |
| 76 | main hips sink up to 0.30 m | model_rig.cpp:459-475 | OK | `clampf(sink, 0, 0.30f)` :466 |
| 77 | Arm particles, loose = 1 - speed/max - threat | movementobject.cpp:1769-1788; aschar.as:12622-12697 | DOWNGRADED | loose also 0 combat, 0.7 air, 0 flipping |
| 78 | In the air, pose shifted back to COM | aschar.as:14513-14523 | OK | all seven keys, no y zeroing |
| 79 | Air pose from vertical speed | aircontrols.as:120-141 | OK | `velocity.y / p_jump_initial_velocity` |
| 80 | Breath rate and inertia | aschar.as:2334-2339, :2086-2113 | OK | half-lives 0.575 s, 5.77 s recomputed |
| 81 | Idle COM drift 0.7-4 s | aschar.as:14412-14442 | OK | spring 5, drag 0.97 |
| 82 | Overshooting fade | animationclient.cpp:167, :314-318 | OK | 0.3 and `sinf(...)` |
| 83 | Physics strength keyed, max of two bones | animation.cpp:1389-1397, riggedobject.cpp:1280-1289 | OK | `max(w[id0], w[id1])` |
| 85-87 | Copy slip at :289-294; fixed land_speed 10 | syncedanimation.cpp, aschar.as:8398 | OK | both confirmed |
| 90 | Crouch omega^2 120, c 13.98, zeta 0.638 | recomputed | OK | 0.6383 |
| 90-92 | 2.5% at 21 ms, 7% at 0.40 s, 0.58 s, agree to 0.004 | node re-run | UNSUPPORTED | 7%, 0.58 s hold; 0.004 not: 0.007 / 0.012 |
| 93-95 | Head zeta 0.645, chest 0.562, cap 15 rad/s | aschar.as:14162-14184, :15063-15074 | DOWNGRADED | hold only when idle_look_amount = 0 |
| 96-97 | Arm, hip, breath half-lives | recomputed from 0.9/0.97/0.92/0.95/0.99 | OK | 0.055, 0.19 s; 0.113; 0.58, 5.8 s |
| 98-99 | `run_bounce`, `ground_speed`, `coord` live in XML | syncedanimation.cpp:336-350 | OK | `QueryFloatAttribute` |
| 102-104 | Student page: four keyframes per gait | student page | OK | "just four keyframes each" |
| 109-117 | Weight item 4: every add-on is an underdamped spring | aschar.as, movementobject.cpp | DOWNGRADED | only crouch, chest, head are 2nd order; mass is [inferred] |
| 22-48 | Section 1 ground cites (G-sources 26-48, 133-145, 254-255) | ground_sources_read.md | OK | text matches |
| 30 | Ten steps at p-l179-talks:26-35 | handback file | OK | :26 and :35 |
| 37 | DrawnChaser steps every chaser each tick | world_app.cpp:567-588, world_app.h:270 | OK | `ease_on_ = true` default |
| 145-149 | Cost per character, G-code:239-240 cited as support | ground_code.md:239-240 | DOWNGRADED | that line is [inferred], "Not measured" |
| 145-146 | Crouch reuses the sink loop that already runs | model_rig.cpp:422, :453, :459-475 | WRONG | `if (!legs) return;` at :453 on a flat stand |
| 165-169 | Drop to Recover 0.7 s, speed 0; tilt decays | chaser.cpp:106-121, archetype.h:53, world_app.cpp:578 | OK | `p.gait == Mesh` is on_feet |
| 168-169 | Spring settles in 0.58 s, inside 0.7 s | node re-run | OK | last |x| > 0.02 at 0.58 s |
| 174-175 | Item 195 rejected "up down up down" | briefs:1514 | OK | line is item 195 |
| 183 | Overgrowth's rise past standing is 7% | syncedanimation.cpp:206-222, :324-326, :380 | DOWNGRADED | drawn only if closed XML sets Overshoot |
| 187-188 | "Existing per-tick jump bound" at landing | game/tests/body_tests.cpp:294, model_rig_tests.cpp | UNSUPPORTED | player Body only; none for a chaser |
| 197 | No source for the stalk | briefs:1556 | OK | "No source on a hyena's ... has been read" |
| 199-200 | His method quote | briefs:1607 | OK | verbatim |
| 206-207 | Item 153: build what the sources found | briefs:1109 | OK | his words at :1109, gloss :1110 |
| 208-209 | He ruled "Keep source" on look springs | ground_his_words.md:344-346 | DOWNGRADED | item 157, on the lean |
| 216-218 | Crouch changes collision sphere; use_mobility; _ANM_MOBILE | aschar.as:8456-8460, :12015, animation.cpp:209-216 | OK | :209-216 is the file writer; "moves the character" stays [inferred] |
| 131-135 | Two keyed cycles mixed keep feet from sliding | syncedanimation.cpp:286-299 | UNSUPPORTED | nothing shows a slide is prevented; unmarked [ours] |
| 153-155 | Crawler: fixed rate, speed from two stride lengths | G-loco:158 | UNSUPPORTED | no source, no [ours] mark; T4 is insects |

Tally of 59 rows: OK 41, DOWNGRADED 13, UNSUPPORTED 4, WRONG 1.
RE-DERIVED: 3. Scout:46-51 (licence, assets) with G-sources:26-28; scout:56-58 (talk unread, video only) with G-sources:135-136;
scout:220 (their animations closed) with G-sources:26-28 and :187-197. Everything else in section 2 is new to the record
(a grep of the ground files and hand-backs finds no duck, crouch, syncedanimation, Catmull-Rom, student-page or blog hit).

### The method, with what does not fit (the scout's table has no such column)
Does not fit a 240 Hz, picture-only, replayable game as written (all [read] in 245fe48):
- Unseeded `RangedRandomFloat` in the look shake (aschar.as:14928-14930, :15059-15061) and the idle drift (:14414-14416).
- `sin(time)` in the idle look mix (:14172) and `sin(time*2)` in the air flail (aircontrols.as:131): wall-clock phase.
- Every constant is "per frame at 120 Hz" with `pow(k, frames)` and `* ts.frames()` catch-up (:7925, :9229, :15063). The
  first-order ones convert exactly to half-lives (the room does this for the tilt). The second-order crouch, chest and
  head do not convert by changing dt: my 120 versus 240 Hz run differs by up to 0.012. The room cites Holden's spring.h for the
  first-order exact form (model_rig.h:303); a second-order exact form was not opened by me; the scout says "integrated per 240 Hz tick" and
  names no exact form. That is a gap, small and cheap.
- Crouch changes the collision sphere (aschar.as:8456-8460): couples back.
Steps 5-6 and 8 (two cycles, one phase) fit as they are; steps 2, 3, 4, 7 are already in main in other sourced forms.

### What a "key pose plus curves" layer is, for an entity that is not the hunter (my reading of the scout's design)
A short list of keyed bone angles per gait, sampled on the phase by Catmull-Rom (animation.cpp:827-834), with the clock
from ground speed (steps 4) and a bounce arc `b g t (T-t)` per half cycle. The keys and the bounce amplitude are DATA in
Overgrowth and closed; so every key value here is [ours], to be tuned by his eye. The scout says so for the keys. It does
not say so for "speed from two keyed stride lengths" (see table).

### What the author's method says about weight
Not in the code as a keyed property; the scout is right. The code ties it to: rate follows ground speed, a gravity arc
(b = 0.5 is ballistic), tilt from acceleration, a crouch spring kicked at landing, and the COM kept in place. Corrections:
only three channels are underdamped second-order (crouch, chest, head); the rest are first-order eases; and the head and
chest numbers change when the AI is idle. Rosen's own words on weight were not read by either of us (video).

### Simplest way to pass the first row without doing what it is for
The row (scout:181-183) reads the drawn hips of a DrawnChaser fed a scripted Drop then Recover stream. It passes if the
builder, on entering Recover, plays a fixed cosine pulse of the hips' height (dip to 0.9 x depth, rise 7%, settle by 0.6 s):
no spring, no dependence on the fall speed, no knee bend, feet and floor unchecked. It also passes if the whole model,
ankles included, is lowered by `p[j].y -= x` for every joint. The row names no check that (a) the dip changes with the
landing speed, (b) the ankles stay on the floor probe, (c) the knees bend (knee angle changes), (d) a Drop with a longer
fall dips deeper up to the 0.30 m cap. The recorded-run twin of the row is itself unverified (scout:184-186).

### Mechanisms with no source and no [ours] mark
1. "Two keyed cycles mixed by speed keep the feet from sliding" (scout:135).
2. "Speed comes from two keyed stride lengths" for a fixed-rate crawler (scout:153-155).
3. "Weight is never a keyed property ... the heavier part softer": mass is not in the code (scout:114).

### What I could not check
- Rosen's talk itself: captions 404 to curl; the techarthub page; the "13 keyed poses" figure (ground only).
- Overgrowth's XML and `.anm` data (not in the repository): cycle count, coords, run_bounce values, Overshoot flags.
- The `Timestep` class: `ts.step() = 1/120` is inferred from engine.cpp:6097 and aschar.as:7925 (`* 120.0f`), not read.
- Ground lines I did not open: G-code:34-39, G-loco:90-113 beyond :95, G-cons:107-121, G-phys:3-5, G-sources:39-48, :187-197.
- The kept runs (whether any holds a hunter Drop), the l205-stomp-c and l185 branches, any timing (all costs are the scout's
  [inferred] and mine are none).
- That the scout's own node script gives 0.004: it was not kept; mine does not reproduce it.

## What I did not open
Rosen's talk; the techarthub page; any Overgrowth XML or `.anm`; `fliproll.as`, `ledgegrab.as`, `interpdirection.as`;
the other swarm scouts' files; the worktrees; the game's kept runs; any session transcript.
