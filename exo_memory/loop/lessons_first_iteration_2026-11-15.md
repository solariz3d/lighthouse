# Lessons of the first iteration of the animation system (pane E, D677, 2026-11-15)

**What this is for.** His word, 15:10 (game brief item 242, `briefs/dreamzone2_the_game.md:1979`): "but it is good to still use
everything we learnt from the first iteration of the animation system we tried". It fences his 15:03 order ("well stop working on the
old one completely for now wtf", item 241, brief:1964).

**The line between the two**, from the plan's last section (`loop/plan_animation_restart_2026-11-15.md:377-393`, hash-object
23030c10):
- **Not done:** the first iteration is not built on, not filmed, not set beside the new one, and not the judge.
- **Done:** what it TAUGHT is used.
- **A number of the first iteration set by eye and marked "ours" comes over only with the reason it was right,** cited to that
  reason.

**From the shelf only:**
- the 11-13 research folder `loop/animation_system_2026-11-13/` (paths below without that folder are in it);
- pane B's hand-back `handback/p-n1-legs-B_2026-11-15.md`, sections 6 to 16 (lines 211-1047, read whole; git-blob 249c275c);
- my four source sheets' lists of what is not carried over;
- his items named in the plan's section, read in the brief.

No film, build or run of the old body was made for this sheet. Tier: just do it.

**The kinds:**
- **RIGHT:** what it got right, and why.
- **WRONG:** what it got wrong, and why.
- **HIS:** his own verdict on it.
- **NEW-N1:** a lesson from the new system's first build of the legs (pane B's sections 6-16). The chair named those sections, so they
  are here, kept apart.

---

## 1. His verdicts on the first iteration (kind HIS)

| item | his words | what it bears on | where |
|---|---|---|---|
| 153 | "well why the fk did we do all the research just to ignore it and do our own thing????????????????", then "get rid of it" | every stage: a law the room made up in place of a sourced one | brief:1109 |
| 168 | "I like 1, but believe it should still be humanoid in a way, all entities must be humanoid in nature with their own unique uncanniness" | N1-N2 per kind: a humanoid base, one cue per kind | brief:1150 |
| 180 | "the elbows should be flared out more, looks like someone with a suboptimal running technique with how they swing their arms, like there needs to be more bend in the elbow when swinging" | N2 arms | brief:1205 |
| 186 | "v1 sourced flare looks the best" | N2 arms: the flare from Otsuka 2016 was RIGHT for him | brief:1485 |
| 218 | "spend the last of our usage on an all out swarm to create not just an animation system for the hunter, but a system that will helps us make very elegant animations for the rest of the entities and even the player character. We can do all the research of real open source shit and real techniques" | the method: one system for every body, from open research | brief:1612 |
| 220 | "the run is defintelly better, however ... its physics still look unrealistic with how it does sharp turns, the body should orient itself where it is trying go, like a bird or a space ship banking into a turn" | N1 RIGHT on the straight; N2 lean WRONG in turns (the banking) | brief:1635 |
| 231 | "the runner just doesnt look like a natural body moving, its buggy and glitchy" | N1 the runner's body (`Body::pose`) | brief:1847 |
| 233 | "the hunters head always clips through doorways like the top of it" | N3 the room over the head | brief:1865 |
| 235 | "all those options are super bad, i think we need to scrap the old system completely and rework it from scratch with the new proc gen"; "i meant like thje f6 f7 etc" | every stage: laws laid over old pose functions behind switches | brief:1874 |
| 236, 237 | "are you doing it from scratch instead if referencing research new and old?"; "always take relevant research and use it" | the method | brief:1922, :1934 |
| 238 | "It looked alright, but always looked like it was running in a straight line with the mechanics of how the legs land, even when turning" | N1 legs in a turn | brief:1944 |
| 239 | "also i swear the elbows dont swing lol" | N2 arms | brief:1950 |

## 2. The legs (N1)

| lesson | kind | where |
|---|---|---|
| **The measured shape draws a believable straight run.** The old generator's straight run scored inside the runners' spread at hip, knee and ankle, 2.5-4.5 m/s (2.4/3.1/2.0, 2.6/2.6/1.3, 3.2/3.7/2.7 rms against sd 5.2-9.4), because the leg is the runners' fitted curves (Fukuchi 2017; Dorn's runner past 4.5 m/s). His "the run is defintelly better" (220) agrees | RIGHT | B §7.2 :350-354; `ground_locomotion_and_yardstick.md:90-116`; brief:1635 |
| **But the angle score hid a sliding foot.** The old generator's stance foot slides 12-22 cm on the straight at steady speed; it scores within the spread BECAUSE the yardstick reads angles and a leg posed from curves alone is free to slide. So joint angles alone must never be the judge | WRONG | B §11.2 :669-691; `scout_evaluation.md:9-10` (0.17-0.45 m a step, an estimate) |
| **The pelvis rode the deeper leg, so the ANKLE stood at its standing height while the runners' ankle pitched the foot toe-down: the toe went 11-13 cm under the floor in late stance.** The point held to the floor must be the heel and then the ball, the ankle rising as the heel lifts | WRONG | B §12 :756-786; `scout_evaluation.md:253-255, :380-384` (the 105-108 mm toe sink, H205:275) |
| **A straight-line stride turned as a whole.** "Its feet stay under the hips and only the hip line and trunk roll about the pelvis"; the stance foot was rebuilt from curves in the heading frame each frame, so a turn carried it. A foot must land on the curve the body is about to travel and stay where it landed while the body turns over it | WRONG; HIS 238 | `scout_turning_and_transients.md:9`; `scout_ik_and_feet.md:5-8`; plan :340-349 |
| **The hunter's stride phase was advanced by the frame's time, not the simulation's tick,** so the picture was not replayable alike on two machines. A clock for the picture steps on the sim tick | WRONG | `scout_traversal.md:45`; `ground_code.md:34-36` (as cited there) |
| **The measured curves are angles FROM STANDING.** Read as bends from a straight leg, every knee comes out short by the rest skeleton's own bend; the drawn leg is the rest's plus the curve | NEW-N1 (found by the print) | B §8.1 :424-425 |
| **The old generator's knee zero matched the runners' (offset about 0); the new legs' knee is about 10 degrees straighter at every speed.** A zero that differs in one of three places (the runners' standing trial, our rest pose, the yardstick's reading) is the first candidate; hips riding high over the held point is the other | RIGHT (old), NEW-N1 (new) | B §16.1 :1025-1037; plan :338 |
| **Holding the foot costs the knee.** The trade is measured: the held foot runs up to 13-14.5 cm off the shape's own foot in mid-stance. The one study on file that compared found "a simple approach of lengthening limbs was preferred to a more complex approach using IK fixes and trajectory smoothing" (Pražák 2011) | NEW-N1; research | B §11.2 :669-691; `scout_evaluation.md:259-263` |
| **Alexander's stride law is shorter than the runners' own steps** (1.156/1.415/1.645 m against 1.224/1.619/1.968 m scaled to our leg, at 2.5/3.5/4.5 m/s). Donelan & Kram reject that law for stride ("differed by as much as 67 %") | NEW-N1; research | B §14.1 :872-876; `scout_gaits_any_body.md:39` |
| **The curves on our skeleton cover only 0.71-0.82 of the ground the runners' stance covers;** our proportions (thigh, shin, foot against hip height) are a candidate | NEW-N1 | B §14.1 :885-890 |
| **The hips' rise and fall grew to 1.24-1.92 times the measured runner's,** growing with speed while the runner's shrinks: the heel strikes with the hips low and the take-off stands on the ball with the heel up | NEW-N1 | B §13.1 :814-818; §14.4 :921-929 |
| **Numbers the room set by eye pulled the leg the wrong way:** run_land_lead moved the strike the wrong way; the fold peaking at 0.35 of the swing made the fold early; a held leg drawn straight to its foot never bent in stance; a foot turned only by its yaw was never pitched | NEW-N1; the 153 lesson again | B §7.2 :361-378 |
| **A swing drawn in the world's frame left the hunter's leg held straight out behind** when the hips sped up; drawn from the hip's place AT the landing, it folds | NEW-N1 | B §6.3 :268-279; §7.1 :311-320 |
| **Five builds, each adding a part, and no score better:** parts found again by print were on the shelf already (the toe under the floor, the sliding foot, the ankle held down, the trade). Search the shelf before a finding | NEW-N1; HIS 236 | B §15 :951-998; plan :310 |
| **Holden's lock: lock the BALL at the contact's rising edge where it is drawn; unlock when the contact ends or past 0.2 m from where the animation has it; both edges inertialized (half-life 0.1 s); never below the floor.** Its floor is the plane y = 0 (no slope or stair) | research (the lock's edges) | `scout_ik_and_feet.md:134-148`; B §15 :968-978 |
| **The yardstick scores only straight running, 2.5-4.5 m/s, joint angles.** A foot that stays put (at most 20 mm over a contact) and a foot not under the floor (at most 5 mm) are the measures the research uses most; "numbers catch defects, his eye judges" | WRONG (the judge); research | `scout_evaluation.md:1-5, :136-146`; plan :312-332 |

## 3. The trunk, the arms, the head and the lean (N2)

| lesson | kind | where |
|---|---|---|
| **The arm's swing range from Bruening 2020** (shoulder 43.72 F^0.671, elbow 21.68 F^0.718) and **the flare from Otsuka 2016 (his V1 pick)** were sourced and he chose them | RIGHT; HIS 186 | `ground_locomotion_and_yardstick.md:139-147`; brief:1485 |
| **But the drawn elbow moves 26.5 degrees (73.5 to 100.0) where a sprinter's moves 83 (38.2 to 121.2 at 9.49 m/s, Dorn's runner).** The cause on file: Bruening's law is measured only to Froude 1.36, and the hunter runs near 3.4; past it the numbers were ours (elbow mean 90 and the rest) | WRONG; HIS 239 | plan :355-361; `sprint_reference_2026-11-13/00_reference.md:158-164`; `ground_code.md:126-138` |
| **Arms that turn with the chest as one piece** are the opposite of a passive swing (Pontzer 2009: arms are passive mass dampers, powered from below). B names it the likeliest cause of an arm standing out level | WRONG | `b8_gaze_sources_B_2026-11-15.md:51-53, :66-67` |
| **The head took 0.55 of the thorax's twist,** the first game's figure with no study; Pontzer measured 0.26 running at 3.0 m/s | WRONG (unsourced) | `scout_upper_body_and_gaze.md:43-44, :74-75` |
| **The pelvis's turn with the stride was a misread number:** 6.5 deg from Perpiñá-Martínez 2023 is pelvic TILT, and that paper has no thorax figure; the thorax's 14.28 is Ford 2013's abstract. Read a figure's definition at source before it becomes a constant | WRONG (corrected by pane A at source, PMC9961938) | `loop/source_sheet_n2_upper_body_E_2026-11-15.md` (the trunk table); `ground_sources_read.md:208-209` |
| **The thorax was drawn in exact antiphase with the pelvis,** pinned by a row; the measured phase (Pontzer's 93.9) is unsigned and cannot say who lags | WRONG (a shape with no source) | `scout_upper_body_and_gaze.md:45-46, :77-80` |
| **The look spread down the spine (chest 0.4225) came from a sample's slider default,** not a measurement | WRONG (a code constant read as data) | `scout_upper_body_and_gaze.md:35-36, :165-166` |
| **The head turns to the player before the body** (the chase's own look, at least 7 rad/s, at most 1.6 rad off the heading) | RIGHT (his 163 asks the head first); kept in the chase | `scout_upper_body_and_gaze.md:39-40` |
| **The lean: the simulation computes the true lean, atan(speed x turn / 9.81), each tick, and the picture discards it** for a drawn tilt of 1 deg per m/s^2, 1/5.8 of gravity's (a 1 g bend draws 9.8 deg where physics asks 45). No whole-body lean: the feet stayed under the hips and only the hips and trunk rolled about the pelvis | WRONG; HIS 220 (banking), 214 | `loop/handoff_dreamzone3_2026-11-14-L.md:37-39`; `scout_turning_and_transients.md:9-10, :60-76` |
| **The lean's ease (Overgrowth's half-lives 0.1126 s and 0.0548 s, 0 off the feet) was sourced and smooth;** its gain was the fault, not its timing | RIGHT (the timing) | `ground_code.md:102-105`; `scout_turning_and_transients.md:243-244` |
| **Rolling the whole body about its feet and keeping a trunk share about the pelvis counts the trunk twice (1.89 theta).** The shares are angles in space | research (the second reader's catch) | `scout_turning_and_transients.md:442-444` |
| **The spine bowed forward when looking down,** by a pitch share of 0.25 that was ours; the research B reached does not say the upper back bends | WRONG | `b8_gaze_sources_B_2026-11-15.md:63-65` |
| **First person hung the body from the camera** (the eye fixed, one yaw for pelvis, chest and head). No shipped game keeps a raw camera on a head bone; each steadies the camera apart from the head | WRONG | `b8_gaze_sources_B_2026-11-15.md:114-120`; plan :115-117 |

## 4. The world (N3)

| lesson | kind | where |
|---|---|---|
| **The hunter's head clips doorway tops.** A doorway is 2.05 m clear and the hunter's drawn head is 2.12 m over its feet, so the top of its head is 7 cm into the frame at every door. Nothing in the first iteration read the room over the head | WRONG; HIS 233 | `loop/packet_head_room_E_2026-11-15.md:7-10` (citing `gen/src/gen.h:44-45` and `handback/p-b1b-lean-limits-C_2026-11-14.md:78`) |
| **The player's climb grip was guessed at the eye + 0.12 m,** 0.23-0.43 m off every gym ledge, because the state has no ledge height; the sim's own ledge finder computes the top and the face and drops them | WRONG | `scout_traversal.md:37-39, :66-68, :387-391` |
| **The ladder hands rode the neck on a phase,** never still on the ladder; the ladder itself is one flat board with no rungs | WRONG | `scout_traversal.md:76-81`; `scout_ik_and_feet.md:241-242` |
| **The hunter was drawn standing through every drop and ladder,** carried down the drop's curve and slid up the ladder, because the chase sets speed 0 on a link and the picture posed by speed alone | WRONG | `scout_states_and_transitions.md:61-68`; `scout_traversal.md:92-94` |
| **The floor probe read height only and clamped to +-0.45 m;** the hips sank up to 0.30 m for the lower foot. Feet with memory (Overgrowth's lag) were registered with a falsifier, "look worse on his stairs", never shown to him | WRONG / untested | `scout_ik_and_feet.md:38-44, :63-66` |
| **Each foot on its own floor, the hips sinking for the lower one,** held on a still stand (an 18 cm step up, 15 cm down) | RIGHT as far as measured (standing only) | `scout_ik_and_feet.md:54-55` |

## 5. The states (N4)

| lesson | kind | where |
|---|---|---|
| **The picture read only "on the feet or not";** Drop, Recover, Ladder and Climb had no pose | WRONG | `scout_states_and_transitions.md:3-8, :56-57` |
| **The player's body blended nine moves over 0.045 s with a first-order decay;** a state change carried no velocity | WRONG (unsourced timing) | `scout_states_and_transitions.md:29-30`; `scout_motion_matching.md:181` |
| **Continuous things (speed, the lean, the swing, the look) are never states;** a corner state would add the lag his 151 rejected | RIGHT (as a rule) | `scout_states_and_transitions.md:209-212` |
| **The chase sets when and how long; the picture sets how.** The picture adds no clock of its own | RIGHT (as a rule) | `scout_states_and_transitions.md:177-179` |

## 6. The picture's physics (N5)

| lesson | kind | where |
|---|---|---|
| **Motors following a run stopped red:** forearm and hand could not follow a 10 m/s swing at any stable setting (wrists 0.21-0.32 m, hands 0.45-0.61 m at p95); three times the stiffness went unstable | WRONG (measured) | `ground_physics_and_fp_body.md:72-73`; `scout_secondary_and_physics.md:50-51` |
| **The soft-keyed upper body followed:** p95 0.0069 m and 1.88 deg against a bar of 5 cm; hands carried 13 cm past on a hard stop. The legs and pelvis stayed keyed | RIGHT (measured), though its time constants were ours and its dt the frame's | `ground_physics_and_fp_body.md:90, :186-191`; `scout_secondary_and_physics.md:41-50` |
| **The picture's ragdoll had no level geometry,** so arms could not meet walls (his 159) | WRONG | `scout_secondary_and_physics.md:37-40` |
| **Physics follows; it does not lead.** A lean or a lead in physics arrives late (his 151) | RIGHT (as a rule) | `scout_secondary_and_physics.md:294` |

## 7. The method (every stage)

| lesson | kind | where |
|---|---|---|
| **Laws laid over an old pose function, each behind its own switch, were judged bad as a set,** and nothing he saw was a new system | WRONG; HIS 235 | plan :20-24; brief:1874 |
| **The room's own numbers stood in where research existed** | WRONG; HIS 153, 236, 237 | brief:1109, :1922, :1934 |
| **A finding filed as new was often on the shelf already;** search the 11-13 folder first and cite it | WRONG; HIS 236 | B §15 :951-998 |
| **A summary of a number can be wrong where the file is right:** "no elbow range above 4.15 m/s is on file" counted only the yardstick's arm reference, not the sprint reference | WRONG (a lesson about reading the shelf) | plan :360-361 |

## 8. The lists of what is not carried over (my four sheets)

The old-build constants named there are lessons of kind WRONG (unsourced) unless a row above gives their reason:
- `loop/source_sheet_n2_upper_body_E_2026-11-15.md`: sections 1 to 4, each under "What not to carry over";
- `loop/source_sheet_n3_world_E_2026-11-15.md`: section 7;
- `loop/source_sheet_n4_states_E_2026-11-15.md`: section 7;
- `loop/source_sheet_n5_physics_E_2026-11-15.md`: section 7.

## 9. Not on file

- **Whether feet with memory looked worse on his stairs.** The registration's falsifier was never shown to him.
- **His word on any first-iteration stair, ladder, drop or landing.** None is on file.
- **How the first iteration's hunter looked in a stop or a start, by measure.** Only "no joint jumps" rows exist; no stop or start
  is scored.
- **A measured reason for the first iteration's knee zero matching the runners'.** B's §16 names candidates, not a cause.
- **The first iteration's player body scored on the yardstick beyond "every leg joint fails"** (`ground_locomotion_and_yardstick.md:199`).
- **Any frame cost of any first-iteration layer.** None was measured.
