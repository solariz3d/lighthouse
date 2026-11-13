# Build path: the player's own body, the camera, and physics on the player (key: player_body)

Swarm worker, read-only, 2026-11-13. Game repo read at main `04f3882` (checked: `git log -1`). Marks: [read] opened and read; [code] file:line in the game repo; [inferred] mine; [ours] a proposal with no source. Items are cited [his N] from `briefs/dreamzone2_the_game.md`.

## 1. His words

| item | what he asked | short quote |
|---|---|---|
| 12, 13, 15 | fluid animation; a sprinter's ramp; arms and legs seen in first person, camera attached | "it is expensive but worth it, then we sort of attach the camera to the player" |
| 27 | procedural hands on walls; look-behind back | "the animation is aware to not clip the gun into the wall, like that but with the players body" |
| 73 | needs a way to bring art in | "more refined animations and quality of style" |
| 79 | each playable character gets a face, rarely seen | "something detailed and distinct for the art style" |
| 82 | the kid is the persona; camera on the model's face | "attached to the face of the real model that is animated" |
| 86, 87 | base outfit, no buff; four slots | "a base outfit and clothing that give no buff"; "shoes, pants, shirt/jacket, accesories" |
| 109, 114 | own clothes at the start; the late unlock is the father's watch | "he starts the run with his regular clothing"; "his fathers watch, not hoodie" |
| 111 | wardrobe later, parody mid-2000s style now | "haircuts still change underneath the hat"; "this is later" |
| 130 | the look-back must show pursuers | "looking back and seeing them behind you slosh around corners is scary" |
| 147, 152 | look-back clips the shoulder; looking down needs rework | "look back clips into the characters neck and shoulder area" |
| 150, 156 | learn from open animation, not use it; whole body as one | "not to use, but to learn from"; "making the whole body work as one" |
| 158, 160 | physics drives animation; mesh both ways | "a physics engine itself that drives the procedural animations" |
| 159 | the standard: smooth looking down, crossing feet, backwards, hands on walls | "the legs and feet criss crossing eachother, walking backwards" |
| 161, 162 | physics may own the camera and controls | "it would make sense to me if it is done right" |
| 163 | head first, then body | "perhaps the head moves first when you look, then it moves the rest of the body underneath" |
| 173 | his picks: a shoulder sliver on the look-back, a loose fist, the leading leg shown in a slide | recorded picks |

**Supersedes:** [his 109] and [his 114] replace the father's-hoodie base outfit of item 108 and E's first two sheets. [his 161] overturns L185's "never driven by physics"; [his 162] picks "(a) plus the inertia dial" (physics owns the picture and reactions; aim and root stay; K3 off by default). [his 173] replaces L174's clean look-back with a sliver. [his 163] answers 156: no detuned stride.

## 2. What exists today

- **Body.** [code] `game/body.h:55-82`: 21 joints, `BodyBuild`. `Body::pose` `game/body.cpp:222-510`: nine moves blended (`:15`, 45 ms), feet from the rig's stride phase (`:260-287`; the foot sweeps along one line through the hips at `:283`), hands as a pendulum (`:294-303`), two-bone IK (`:53`).
- **The camera is the sim's eye.** [code] `game/camera.h:20-22` (aim never changed; the nod is beside it); `Shell::view` `game/shell.cpp:178-197`. The body hangs from the eye (`body.h:4-6`). The body does not drive the camera.
- **Look-back (V).** [code] eased in `shell.cpp:158-166`; 2.9 rad; the eye goes round the neck (`glance_eye_offset`, `body.cpp:167`); `glanced` turns the chest a fixed 50 degrees (`:153`). Body in the picture is 0.0 percent at every stage ([read] `handback/p-l174-fpbody-B_2026-11-12.md:17-19`).
- **The kid's model.** [code] `game/world/stage.cpp:141` hides `kid_hood`; `:302` poses the kid from `glanced(body.at(alpha))`; the model's eye is locked to the camera (`game/model_rig.cpp:359`). [read] `kid.glb` holds meshes body, hair, hood, hoodie, jeans, shoes, key, keycord, and finger bones (grep of the file). The rig aims only 18 bones (`model_rig.cpp:244-253`); fingers ride the hand (`model_rig.h:12`), so a fist is new work.
- **Hands on walls: a hook only.** [code] `HandOverride` `body.h:93`, `set_hand_overrides` `:113`, applied `body.cpp:400-402`. Nothing calls it (grep). Vault and climb grips are guesses (`body.cpp:199-202`). A floor probe exists (`body.h:87`, set at `game/world/world_app.cpp:116`).
- **Physics.** [code] the player moves through Jolt `CharacterVirtual`, kinematically (`sim/physics.cpp:465-477`). No ragdoll on main.
- **Tests.** [code] `game/tests/body_tests.cpp`: look-back rows `:456`, `:478`; camera-equality row `:108`.
- **Branches in flight** (none landed):

| branch | state | holds |
|---|---|---|
| `l188-fpbody` b963780 | WIP, "unrun" ([read] `loop/plan_13h_run_2026-11-13.md:40`) | step 1: crossover, shuffle, backward toe-first (dials marked ours in `body.h`), 3 rows, `--capture-fpbody` feet pictures |
| `l188-wip-look` a60944d | "NOT TO LAND" | head-first look (`look_back_chest` spring), double-spring blend, slide leg; temporary prints |
| `l185-skeleton` b226b95 | green; mutants owed | `game/skeleton.*` (22 joints), `game/ragdoll.*` in its own Jolt system |

## 3. What the room already knows

- **Camera pivot.** The eye about the neck took body coverage from 11-12 percent to 0.0 (`p-l174-fpbody-B:16-19`). Rust keeps the eye still and tucks the torso (`p-l184-fpbody-research-B:100-113`). They can combine.
- **A 2-frame wrist hitch** at the run-to-slide blend is left (`p-l174-fpbody-B:102-110`).
- **Feet.** Strafing: Kuntze 2009, crossover beyond the midline (CC BY-NC-ND); no source for the switch speed (`p-l184-fpbody-research-B:58-69`). Backward: toe first, shorter steps (CC BY papers, `:71-82`). Today's cycle is the forward one laid behind.
- **Walls.** No shipped first-person text found; composed from Overgrowth `ledgegrab.as:197-215` (Apache-2.0) and ozz two-bone `soften` (MIT) (`:84-91`). The technique is ours; his eye is the test.
- **Physics.** Options K0 to K4 with costs; K3 fails responsiveness by design; K4 fails by DReCon's own 1.5 s reversal (`p-l186-physics-player-E:185-208`). His pick is K1 plus K2, with Mirror's Edge's guard: filter the head toward today's springs, and `camera_effects` 0 gives today's eye (`:210-225`).
- **Skeleton.** A ragdoll cannot follow the stretching trunk (up to 0.109 m) (`p-l185-skeleton-E:48-54`).
- **The kid.** Face reads, hair as opaque clumps, outfit slots: `p-d659-kid-E_2026-11-11.md:22-67`. Three base outfits, none picked ([read] `p-d659-kid-redesign2-E:18-22`). The loaded model still wears the open hoodie ([read] `p-d672-fp-C:43`).
- **Yardstick.** Recorded human motion (Fukuchi 2017, CMU) as a test reference, with sidestep, backward and an eye view (`plan_l193_motion_yardstick_2026-11-13.md:21-30`).

**Unread or unresearched:** Rosen's and Kulon's talks (video only); Valve's blend page (403); the crossover switch speed; any shipped text on hand contact; the kid's face and hair in `kid.glb`; faces for other characters.

## 4. Contradictions and calls that are his

1. **The camera and the face ([his 82] against the code).** The camera is the sim's eye and the model hangs from it. Options: (a) keep it (K0: free, aim stays instant); (b) K1 per [his 162]: the eye rides a simulated head, filtered toward the springs (costs the L185 ragdoll first; raw it was "not very good" in Mirror's Edge); (c) the raw head camera (cheapest, sickening by that source). The room leans to (b).
2. **Crossover switch speed.** The default 2.7 m/s is ours (`body.h` on `l188-fpbody`). Options: keep and tune by eye; make it a setting; measure it from CMU sidestep clips through L193 (needs the yardstick first).
3. **Which base outfit.** [his 109] says his own clothes; the model still wears the hoodie; none of three sheets is picked ([his 111]). Options: pick one of the three; ask E for a fourth; ship a plain placeholder until he picks. Each outfit is Blender work on D, and first-person sleeves are what he sees most (`p-d659-kid-redesign-E:33`).
4. **Staged or true.** Catalyst stages limbs to read; [his 159] asks for "how a real person would". Options: score against mocap first (L193), stage only where he asks; or stage from the start (changes what the yardstick compares).
5. **Does item 177 (arms too close to the sides) bind the player?** He said it of the hunter (L191). The player's hand sits 4 cm off the shoulder line (`body.cpp:300`). [inferred] yes. Options: share one sourced arm-shape function (L181's idea, ours) or tune the player's own.
6. **How to make a fist.** `Joint` has no fingers. Options: a rig-only finger curl (no change to 21 or 22 joints); or new joints (touches `skeleton`, `ragdoll`, the hunter). The room should take the rig-only one.

## 5. The build path

**Rule kept ([his 150]):** each step names its source or is marked ours.

**Lap 1 (the smallest step he can see): land L188 step 1, the feet.** Branch `l188-fpbody`. Touches `game/body.cpp`, `game/body.h`, `game/tests/body_tests.cpp`, `game/world/offscreen_fpbody.cpp`.
- Red before, green after: `strafing_at_a_jog_the_trailing_foot_crosses_over_and_never_through_the_other`; `strafing_slowly_the_feet_shuffle_and_the_trailing_foot_never_passes_the_leading_one` (may already be green; it guards); `walking_backwards_each_foot_comes_down_toe_first`. Registered red at `1157754` (commit message; I did not see the red run).
- He looks first: `dz-world --capture-fpbody DIR` stills looking down at a jog strafe, a walk strafe and a backward walk.

**Lap 2: his picks ([his 173]).** Touches `game/body.cpp` (`glanced`), `game/model_rig.{h,cpp}`, `game/world/stage.cpp`, tests.
- Shoulder sliver at the picture's edge: amend by name `at_the_full_glance_the_neck_the_chest_and_the_shoulders_are_out_of_the_picture` (`body_tests.cpp:456`, 60-degree bar). New row: at the full glance a shoulder covers a small edge band and never the centre; band size ours, from the capture.
- Loose fist at the sprint's top: finger curl in the rig (call 6). Row: at the forward swing the finger bones are curled past a set angle; red today (no finger aims).
- Leading leg in a slide: row, in a slide looking level the leading ankle projects inside the view; red today (`body.cpp:327` puts it 0.95 m ahead, low; [read] `p-l174:87`).

**Lap 3: head first, then body ([his 163]).** Read `l188-wip-look` a60944d first (not to land as is; its prints are temporary), then rebuild its rows red on main. Replaces `glanced()`'s fixed 50 degrees (`body.cpp:153`). Row: on a scripted sideways look the peaks come in the order head, chest, pelvis. Sources: `plan_l181_kinetic_chain_2026-11-12.md:213-215` (first game [STEER], Valve split, ozz weights, Holden springs).

**Lap 4: the slide-blend hitch.** `Body::tick` blend weights (`body.cpp:206-212`). Row: no wrist step above 3.5 times its mean across the run-to-slide blend. Fold into lap 3 if its double-spring blend already clears it.

**Lap 5: the hand on the wall ([his 27], [his 159]).** Add a wall probe beside the floor probe (`body.h:87`) through `sim::World::raycast`, which is not in the fingerprint (`body.h:84-86`); drive `set_hand_overrides`; replace the vault and climb grip guesses (`body.cpp:199-202`). Row: running beside a wall 0.4 m from the body's centre, the near hand is within 5 cm of the wall's plane in at least half the in-reach ticks (L184 row 3); red today. A second row: no hand goes through a wall.

**Lap 6 and after: yardstick and physics.**
1. E's L193 scores the player's body (sidestep, backward, eye-projected) against CMU and Fukuchi; B iterates worst joint first.
2. L185 steps 3 to 5 (foot-placement law in the target, per-bone strength, the wall brush as the first reaction), then K1 and K2 per [his 162]. Rows: replays byte-identical; `camera_effects` 0 gives today's eye to the millimetre; aim yaw and pitch equal input every tick (`p-l186-physics-player-E:217-220`).
3. The K3 inertia dial, off by default; the bots measure it before his hands.

## 6. Connections

| key | needs from it | gives to it |
|---|---|---|
| movement | sprint ramp numbers; slide, vault, climb, wall-run states | poses for any new move |
| abilities | which moves exist | a `BodyMove` entry per ability |
| chase_entities, entity_bodies | one chain (`model_rig`, L181), skeleton and ragdoll (L185), the yardstick | the player as a second user of that code |
| look_fear | dynamic FOV (`camera.h` `fov_add`), effects | hands and view as the surface for calcifying hands |
| run_frame | catch and rescue moments | a body that resets cleanly (`Body::reset`) |
| waking_room | first-person bed, out-of-body camera | the kid, the face, the watch |
| meta_loop | clothing slots, trinkets (the watch on the left wrist) | where outfit meshes are drawn |
| sound | footfall and wall-touch events | contact times from `leg_cycle` (not exposed today) |
| story_lore | the watch, the patched knee, the key cord | the base outfit |
| frontdoor_onboarding | the pick screen | the model and face |
| tech_foundation | LFS models, landing train, memory limits | pure `game/` code, no timing on L |
| stress, world_gen | stress effects; surface material [inferred] | none yet |

## 7. Where it is going

Outfit slots and hair under hats ([his 87], [his 111]); rub-off buffs; a face per playable character ([his 79]); the chair's third-person view; K1 and K2, then the K3 dial; all bodies on one chain; the yardstick as a standing check; the look-back seen by chase bots ([his 130]).

## 8. Not verified

- No build, test or capture was run. The `l188-fpbody` rows are not seen red or green by me.
- `l188-wip-look` was read by diff stat and a partial diff only.
- The 13-hour plan was read as of 02:38 on 2026-11-13; branches may have moved since.
- `kid.glb` was read by names only; the face, shape keys and hair were not opened.
- The default field of view (for the slide-leg row) and the sliver's size are not measured.
- Items skipped: none (items 15 and 73 are answered only briefly).

## Verification (second reader, 2026-11-13)

Checked against game repo main 04f3882 and the room files. Quotes were matched after joining wrapped lines and ignoring case.

- (a) Quotes, items 12/13/15: ok. "it is expensive but worth it, then we sort of attach the camera to the player" is in item 13 (briefs/dreamzone2_the_game.md:73-78, continues "in a way to make it work"). Item 15 is a one-line question; it has no quote in the table (fine).
- (a) Quote item 27 ("the animation is aware to not clip the gun into the wall, like that but with the players body"): ok, brief :193-200.
- (a) Quotes items 73, 79, 82, 86, 87, 109, 111, 114: ok, each present under its own item number (note 87 keeps his spelling "accesories"; 111 "this is later" is "But this is later" in the brief).
- (a) Quotes items 130, 147, 150, 156, 158, 159, 161, 163: ok, each verbatim under its item.
- (a) Item 160 quote ("a physics engine itself that drives the procedural animations") is actually in item 158 (brief :1118), not 160. The table row groups "158, 160", so tolerable, but item 160's own words ("mesh both techniques") are not quoted. WRONG attribution if read as 160.
- (a) Item 162 "(a) plus the inertia dial" and item 173 picks: ok, brief :1127, :1175.
- (b) body.h:55-82 BodyPose/BodyBuild, kJointCount = 21 joints (body.h:46 counts Joint::Count; not independently counted): ok.
- (b) body.cpp:15 (kBlendTime 0.045 s), :53 two_bone, :153 (0.87 rad, "50 degrees"), :167 glance_eye_offset, :199-202 vault/climb grip guesses, :206-212 blend weights, :283 foot sweep, :294-303 hand pendulum, :400-402 hand-override hook: ok.
- (b) body.cpp:327 "puts [the leading ankle] 0.95 m ahead, low": line shows s.foot_r = base + ahead*0.95 + up*0.06; the claim is about the slide's foot, plausible, ok.
- (b) body.h:4-6, :84-93 (FloorProbe :87, HandOverride :93), :113 set_hand_overrides; no caller anywhere in game/ (grep): ok.
- (b) camera.h:20-22, shell.cpp:158-166 and :178, stage.cpp:141 (kid_hood hidden) and :302, model_rig.cpp:359 (eye lock) and :244-253 (18 bones, counted), model_rig.h:12, sim/physics.cpp:465-477 (CharacterVirtual), world_app.cpp:116, body_tests.cpp:108 and :456: ok.
- (b) body_tests.cpp:478 is cited as a "look-back row"; it is `at_a_sprint_the_hands_swing_evenly_and_never_snap`. WRONG. The look-back rows are :390, :436 and :456.
- (b) No ragdoll in game/, chase/, sim/ on main (grep -ril): ok.
- (b) Branches l188-fpbody b963780, l188-wip-look a60944d, l185-skeleton b226b95 exist at those hashes; the three row names exist at l188-fpbody body_tests.cpp:537/558/577; kCrossoverSpeed = 2.7 at body.h:177 on that branch; --capture-fpbody exists; skeleton has kJointCount+1 = 22 joints: ok. Registered-red commit 1157754 message confirmed, and it cites Kuntze CC BY-NC-ND 4.0 and CC BY 4.0 papers: ok.
- (b) kid.glb: contains kid_body, kid_hair, kid_hood, kid_hoodie, kid_jeans, kid_shoes, kid_key, kid_keycord and finger bones (index/middle/ring/pinky 01-03). It also holds a `kid_tshirt` mesh that section 2 omits from its list. Minor omission, WRONG as a complete list.
- Room citations ok: p-l174-fpbody-B:17-19 (0.0 %), :102-110 (wrist hitch), :87 (no leg in slide); p-l184-fpbody-research-B:58-69, :71-82, :84-91, :100-113; p-l185-skeleton-E:48-54 (0.109 m); p-d672-fp-C:43; p-d659-kid-redesign-E:33; plan_13h_run:40; plan_l193:21-30.
- Room citation `p-l186-physics-player-E:185-208`, `:210-225`, `:217-220`: WRONG. That file has 87 lines. The K0-K4 table, the K3/K4 failures and the K1 plus Mirror's Edge guard are at lines 38-50 and 62-75 (`camera_effects` 0 equals today's eye at :69).
- Room citation `plan_l181_kinetic_chain_2026-11-12.md:213-215`: WRONG. That file has 70 lines. The [STEER], Valve split, ozz and Holden sources are at lines 29-37 and 68-69.
- Room citation `p-d659-kid-redesign2-E:18-22` ("three base outfits, none picked"): off by a few lines. The three outfits are at :15-17 and the pick is stated waiting at :11; :18-22 is "what all three keep". Content true, range wrong.
- (c) Outside source Balasukumaran/backward walking (CC BY): fetched PMC7664179 (Gottlieb, Balasukumaran, Hoffman, Springer 2020, Sensors 20(21):6331, CC BY 4.0). It confirms toe-strike initial contact in backward walking and CC BY 4.0, but it does not discuss step length, and it reports backward speed 0.54 m/s against 1.34 m/s forward, not "slightly slower". The doc only says "CC BY papers"; the "shorter steps" claim needs another paper (Balasukumaran 2020 itself, not opened). Partly could not check.
- (c) Outside source Kuntze 2009 (CC BY-NC-ND): could not check. A search for the paper found no page I could open, so neither the midline wording nor the licence was confirmed.
- (c) Overgrowth ledgegrab.as and ozz ik_two_bone_job.h (Apache-2.0, MIT): could not check; relayed from the room handback, not re-opened.
- (d) The document has no direct outside URLs and marks outside material only through room handbacks; one item marked [read] ("kid.glb ... grep of the file") is a path, and holds up. Nothing marked [read] is plainly from memory. The claim "Rosen's and Kulon's talks (video only); Valve's blend page (403)" is relayed, not checked.
- (e) Coverage: items 12, 13, 15, 27, 73, 79, 82, 86, 87, 109, 111, 114, 130, 147, 150, 152, 156, 158, 159, 160, 161, 162, 163, 173 all appear in the table or build path; none skipped. Items 15 and 73 are thin, as the document says. Item 12's "higher top speed" is not addressed.

Totals: 33 checks, 24 ok, 7 WRONG (item 160 attribution, body_tests.cpp:478, kid.glb list, l186 lines, l181 lines, kid-redesign2 lines, Balasukumaran step-length detail), 3 could not check (Kuntze, Overgrowth/ozz, Rosen/Kulon/Valve relayed).
