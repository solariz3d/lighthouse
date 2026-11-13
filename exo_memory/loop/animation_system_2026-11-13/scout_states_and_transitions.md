# Scout: states and transitions (which pose functions run, how they blend, what the player can read), 2026-11-13

1. No state layer exists: the picture reads only `gait == Mesh`. ~~Drops, ladders, wall stops and landings are drawn as a
   standing figure sliding~~ [2nd reader: DOWNGRADED. Only drops and ladders move the body while speed is 0
   (chaser.cpp:66, :93, :102). A wall stop and a landing are Recover: speed 0 and no motion (chaser.cpp:226-227), so a
   standing figure that STANDS, not slides. Also G-code:63, :223, :341 already hold "Ladder/Drop/Climb/Recover are not
   posed": the no-state-layer finding is RE-DERIVED; the speed-0 mechanism is the new part.], because the chase sets
   speed 0 at each and the stage poses the hunter by speed alone.
2. New at source: Godot's state machine (MIT; fade, phase sync, blocks changes mid-fade), Perlin's Improv (layered groups,
   phase-aligned tempo morph, buffer states), the cartoon filter, Lasseter, and three studies of how chasing is seen.
3. Design [ours]: a per-chaser `DrawnState` at 240 Hz beside `DrawnChaser`. The chase sets when and how long; the picture
   sets how. Inertialize by default, morph posture, carry the phase; anticipate only in windows the sim already has.
4. First lap: the drop. Today the hunter is drawn standing in the air for the whole drop; after, it keeps its stride shape
   until it lands. Red row: ankles apart in flight. The drops in his kept runs must be counted first.
5. His eye decides the drop clip, the stalk's facing (head on you or along its path), and the rise with or without a
   gather. Not built: a graph editor, cartoon exaggeration, any delay of the picture, behaviour in the picture.

Marks: [read] I opened it; [summary] a ground file or another swarm file; [inferred] mine; [ours] a proposal.
Game code is dreamzone-3 main **31d1c6d** (`git log -1`: "Merge a-d673-overtime") unless a branch is named. `G-x` means
`loop/animation_system_2026-11-13/ground_x.md`; `S-x` means `.../scout_x.md`. Downloads sit in my scratchpad
(`.../scratchpad/states_dl/`), outside every repo. No game, tool or build was run.

## 1. What the room already has for this aspect

The pieces, by ground file:
- The two pose paths and where they sit: the hunter's `gait_pose` per frame in `WorldStage::place_figures`, the player's
  `Body::pose` per tick with 9 blended moves [summary] G-code:20-51. `DrawnChaser` runs for every chaser every tick in
  `ease_poses` [summary] G-code:24-26, :195.
- The player already HAS a state layer: `BodyMove` Run, Air, Slide, Vault, Climb, WallRun, Ladder, Dive, Roll, eased by
  weight over `kBlendTime` 0.045 s and inertialized on targets and mid joints [summary] G-code:47, :63-65, :165.
- The hunter has none: "run/stand only; `Gait` Ladder/Drop/Climb/Recover are not posed (only on_feet in DrawnChaser)", and
  "no inertialization" [summary] G-code:63, :65. No row covers the non-Mesh gaits [summary] G-code:340-341.
- Sourced transition parts already read: Holden's damper by half-life (landed in the tilt) and his inertialization
  (read, not taken) [summary] G-sources:65-75; Valve's overlay weight `3w² − 2w³` for stumbles, planned not started
  [summary] G-sources:109-110; Valve's head eased in over 0.25 s and out with a sine (landed) [summary] G-sources:105-106;
  the chain springs 0.13 s and 0.22 s, the room's follow-through (landed) [summary] G-sources:219-221.
- E's soft-key upper body and its catch reaction (strength 0.15, back to 1 over 1.0 s) are green on a local clone only
  [summary] G-physics:2-3, :91. That is the catch's follow-through, already designed.
- The sibling scouts already cover three layers this one sits on: spring inertialization as one transition layer, with a
  wall-stop first lap [summary] S-motion_matching:5-6, :153-180, :213-240; a per-chaser footfall clock, a `stalk` row on four
  limbs and the rise driven by forward acceleration through a 0.25 s spring [summary] S-gaits_any_body:7-9, :247-263.
  I do not repeat them. This file is the layer that DECIDES which of those runs, when, and what the player is told.

His words that govern it [read] `exo_memory/briefs/dreamzone2_the_game.md`:
- :1546 (205): "when you dont see it, it can use a stealth mode to sneak up on you, eliminating footsteps or making them so
  quiet [...] But eventually the player will see the hunter, then the real chase begins, with the loud footsteps and chase etc"
- :1550 (206): "i just dont want an OP undetectable hunter abusing the runner, they should know where it is most of the time
  or that is the goal"
- :1554 (207): "there should be a stealth mode of animation, moving like an alien hyena or some shit"
- :1558 (208): "and then in that split second you see it, it turns up right and starts running like a human"
- The rest I use through G-his_words, which gives each line: 129-130 sloshing round corners [summary] G-his_words:252-259;
  178 mirror then cut off, footsteps heard [summary] :445-454; `entity_bodies-3` the catch [summary] :572-578; 92 lesser
  kinds approach by sound and commit on sight [summary] :234-239; 153 build what the sources found [summary] :321-325.

What the chase already exposes, read today (none of it is in a ground file):
- `ChaserPose` carries `mode` and `gait` for every chaser [read] game/world/world_app.h:85-86. The picture uses `gait` once:
  `p.gait == chase::Gait::Mesh` as `on_feet` [read] game/world/world_app.cpp:578.
- Gaits: Mesh, Ladder, Drop, Recover, Climb, Off [read] chase/chaser.h:59-67. Modes: Waiting, Investigate, Pursue, Leaving,
  ToMouth, AtMouth, GoingRound, Guarding, Inside, OffStage [read] chase/run.h:106-118. Events include HunterReleased,
  Sighted, Heard, Lost, HunterAtMouth ("a: how long it will stand there"), Caught [read] chase/run.h:63-93.
- **Every link starts at speed 0.** `start_link` sets `c.speed = 0` [read] chase/chaser.cpp:66; a drop then takes
  `drop_s` and lands into `Recover` for `drop_recover_s` [read] chase/chaser.cpp:81-84, :117-120; Recover holds speed 0
  [read] :226-227; a head-on wall does the same for `wall_hit_s` [read] :416-425. Defaults: drop 0.9 s, recover 0.7 s,
  wall 0.2 s, ladder mount 0.8 s, climb 1.4 s [read] chase/archetype.h:50-55. The hunter may take ladders and drops
  [read] chase/archetype.cpp:20.
- The stage poses the hunter from `p.speed` alone and advances its phase by it [read] game/world/stage.cpp:269, :278.
  [inferred] So at the tick a drop starts, the drawn hunter goes from mid-stride to the stand-in's standing pose, and is
  carried down the drop's curve standing; on a ladder it stands and slides up. This is the state layer's first bug.
- **The chase already has anticipation windows.** The hunter re-plans from what it knew `react` ticks ago, 0.40 s by dial
  [read] chase/run.cpp:788, :810-812; chase/dials.h:31. A lesser chaser acts on observations `reaction_s` old (0.25-0.3 s)
  [read] chase/run.cpp:1196; chase/archetype.cpp:44, :69. Meanwhile the head turns to you at once: "D664: the head turns to
  you before the body does" [read] chase/run.cpp:864 (hunter), :1233 (lesser). [inferred] So head-first is already a sourced
  tell by construction, and the body's change always lags what the chaser knows by a known time.
- Sound: a lesser chaser's Sighted or Heard plays `Cue::Sighted` at its position [read] game/world/sound.cpp:200-202. The
  chasers' footsteps run on the mixer's own clock from speed [read] audio/mixer.cpp:1276, not from the drawn stride.
  [inferred] The heard footfall and the drawn footfall are two clocks today.

Missing in the record: any source on transitions between procedural gaits, on anticipation in a real-time game, or on how
a pursuer's intent is read. G-sources has none of these; its owed list names Bollo's talk only for inertialization
[summary] G-sources:277-280. So section 2 is new.

## 2. What I read at source that is NEW

### 2.1 Godot `AnimationNodeStateMachine`, tag 4.3-stable [read, whole transition code]
URL: https://github.com/godotengine/godot/blob/4.3-stable/scene/animation/animation_node_state_machine.cpp (and `.h`),
fetched raw with curl. Licence: MIT, read at https://raw.githubusercontent.com/godotengine/godot/4.3-stable/LICENSE.txt:
commercial use allowed; the copyright and permission notice must be kept in copies; no share-alike; redistribution allowed.
Use: **the idea only**; no line of it is proposed for copying.
- Three switch modes: `SWITCH_MODE_IMMEDIATE`, `SWITCH_MODE_SYNC`, `SWITCH_MODE_AT_END` [read] `.h`:42-44. Defaults: a
  cross-fade of 0 s and priority 1 [read] `.h`:58, :62.
- The cross-fade is a weight `fade_blend = MIN(1.0, fading_pos / fading_time)` [read] `.cpp`:834, optionally shaped by a
  curve [read] :838; BOTH states are evaluated through the fade, with weights w and 1 − w [read] :849-875.
- SYNC starts the new state at the old state's position: `pi.time = current_nti.position;` [read] :964. That is phase carry.
- While a fade runs, no automatic transition may start: `if (fading_from != StringName())` returns false [read] :1014.
  AT_END waits until the old state has `xfade` time left [read] :1019. Among several open transitions the lowest priority
  number wins [read] :1069-1080.
- What this teaches us [inferred]: a cross-fade machine pays two poses during every fade and must either block or pop when
  the chase interrupts a fade. The chase interrupts often (a wall stop mid-turn, a drop link right after a corner).
  [2nd reader: DOWNGRADED. The `:1014` refusal sits AFTER the `next_request` branch of `_can_transition_to_next`
  (sm.cpp:987-1010), which returns before it; so only AUTOMATIC (condition-driven) transitions are blocked mid-fade, while
  a manual `next()` request is processed through a fade. I did not read `_travel` (:499) or `start()` (:267). "Godot
  refuses" is true of auto-advance only. Line numbers :834, :838, :849-875, :964, :1014, :1019, :1069-1080 and .h:42-44,
  :58, :62 all check at tag 4.3-stable.]

### 2.2 Perlin & Goldberg, "Improv: A System for Scripting Interactive Actors in Virtual Worlds", SIGGRAPH 1996 [read, whole]
URL: https://mrl.cs.nyu.edu/publications/sig96-improv/sig96-improv.pdf (linked from https://mrl.cs.nyu.edu/projects/improv/).
Rights: ACM paper; idea only. The project page links an "Improv Patent", US 6,115,053 [read, the link]; I did not read the
patent or its dates. The 1995 IEEE paper it generalises was not readable (the page's `.ps` link returned an HTML page).
- Procedural actions are layered like image compositing. In one group, actions compete: "When an action is selected, its
  weight transitions smoothly from zero to one" while the others fall to zero; groups further forward obscure those behind
  [read] section "Action Compositing". Global actions (walking) sit at the back, local and fleeting ones in front [read] same.
- Two actions with different tempos change by "a morphing approach": the master clock's speed is varied from one tempo to
  the other "so that the phases of the two actions are always aligned" [read] section "Applying Actions To The Model".
- "Action Buffering": where a direct blend would pass the hands through the body, the author names a buffering action, and
  a finite state machine forces the actor through it on the way in and out [read] section "Action Buffering".
- Behaviour (scripts, probabilities) is a separate engine from the actions [read] section "Behavior Engine". [inferred] Our
  split is the same: the chase decides, the picture composes.

### 2.3 Wang, Drucker, Agrawala & Cohen, "The Cartoon Animation Filter", SIGGRAPH 2006 [read, whole]
URL: https://grail.cs.washington.edu/wp-content/uploads/2015/08/wang-2006-tca.pdf. Rights: ACM paper; idea only.
- x*(t) = x(t) − x''~(t): subtract a Gaussian-smoothed (possibly time-shifted) acceleration; equivalently convolve with an
  inverted Laplacian of a Gaussian. "Anticipation and follow-through are a natural byproduct of the negative lobes" [read]
  section 1, eq. 1-3. One user parameter, the amplitude A; the width σ follows the motion's dominant frequency, σ = 2π/ω
  over a 32-frame window [read] sections 3.1-3.2. On mocap: A = 3, every degree of freedom except the root's ground-plane
  translation; feet held by moving the root [read] section 4.3.
- [inferred] The kernel is symmetric: the anticipation lobe comes from the signal's FUTURE. Live, it needs either a delay of
  the picture by about σ or a known future. Only its trailing half (follow-through) is causal.

### 2.4 Lasseter, "Principles of Traditional Animation Applied to 3D Computer Animation", SIGGRAPH 1987 [read, whole]
URL: https://www.ics.uci.edu/~fowlkes/class/ics162/exercises/lasseter.pdf. Rights: ACM paper; idea only.
- "An action occurs in three parts: the preparation for the action, the action proper, and the termination" [read] 2.3.
- Anticipation "is often used to explain what the following action is going to be"; and "If the audience expects something
  to happen, then it can be much faster without losing them"; Wally B.'s zip is "only 3 or 4 frames long" after a longer
  anticipation [read] 2.3. [inferred] At film's 24 frames a second, 3-4 frames is 0.125-0.17 s.
- Timing defines weight: "A heavy body is slower to accelerate and decelerate than a light one" [read] 2.2.
- Follow-through: loose parts of different masses drag by different amounts; "An action should never be brought to a
  complete stop before starting another action, and the second action should overlap the first" [read] 2.5.

### 2.5 Holden, "Dead Blending" (article) [read, whole page by curl]
URL: https://theorangeduck.com/page/dead-blending. Rights: an article; idea only (its code repository not read).
- Instead of decaying an offset, extrapolate the source pose forward by its velocity and cross-fade from that into the
  destination; the extrapolated velocity is decayed by half-life so long blends do not run away [read] the page's sections on
  the basic idea and on decay. It can "switch sides" on rotations near 180° [read]. A small network extrapolator costs
  ~30 µs a frame [read]. [inferred] Every generator we have can be evaluated on the switch tick, so offset inertialization
  (S-motion_matching's Layer T) is enough; dead blending stays the fallback, as that scout said [summary] S-motion_matching:155.

### 2.6 What is published on reading a pursuer's intent from its motion [read, whole texts]
Rights for all three: journal copyright (Elsevier; APA; SAGE); findings used as design knowledge only. All are 2D shapes on
a screen, not bodies in first person; the transfer to our game is [inferred].
- Gao, Newman & Scholl 2009, *Cognitive Psychology* 59:154-179, https://taogao.comm.ucla.edu/static/pdf/The%20psychophysics%20of%20chasing_Gao%20Newman%20Scholl_2009.pdf.
  "Chasing subtlety" is the most a pursuer's heading strays from heat-seeking. Detection fell "from more than 85%-correct to
  chance"; above 60% only at 0° and 30°; at chance for 120° and 150° [read] section 2.3. A pursuer drawn FACING the way it
  moves was escaped more often than ~~discs or~~ darts facing elsewhere, a 14% spread [read] Experiment 5, Fig. 12.
  [2nd reader: DOWNGRADED. The paper's own Table 3 gives Oriented Darts against Discs p = 0.060 (not reliable), the
  omnibus F(3,33) p = 0.051 ("marginally"), 12 participants; against Misoriented p = 0.035 and Perpendicular p = 0.004
  only. The text's "significantly better than each of the other conditions" (section 6.2) contradicts its own table.
  Section 7.4 ("Advice for assassins") says the opposite use: heading straight at prey and facing it gives the chase away,
  which is the owner's item 206 goal for the run, not the stalk.]
- Gao & Scholl 2011, *JEP:HPP* 37(3):669-684, https://taogao.comm.ucla.edu/static/pdf/Chasing%20vs.%20Stalking_Gao%20Scholl_2011.pdf.
  Pursuit interrupted by random motion hides it; pauses ("static rest") and jiggling in place do not: "static rest did not
  impair performance" [read] Experiment 2 results. The best hidden pursuer, "super stalker", strays in "relatively brief
  bursts (e.g. 1/3 of the time) and via a moderate angle (e.g. 60°)" [read] General Discussion.
- Gao, McCarthy & Scholl 2010, *Psychological Science* 21(12):1845-1853, https://taogao.comm.ucla.edu/static/pdf/The%20wolfpack%20effect_Gao%20McCarthy%20Scholl_2010.pdf.
  Shapes that move at random but keep FACING you read as pursuing you: people spent 7.99 s in such quadrants against 9.01 s
  in perpendicular ones (chance 8.5 s); two dots as "eyes" gave the same, 7.97 against 9.03 [read] Experiments 3a, 3b.
- [inferred] For us: heading at you with the body facing its motion = most readable; facing you while the path strays =
  "it is after me" even when it is not closing; a path that strays a third of the time at about 60° with the body facing
  its path = hard to see. A pause ~~never~~ hides it [2nd reader: DOWNGRADED. "static rest did not impair performance" is
  for 2D discs resting 20-80% of the time (gao2011 Exp. 2); footnote 3 adds that rest "impairs the actual efficacy of
  chasing", i.e. it made the wolf easier to escape. Wolfpack numbers (7.99/9.01 s, 7.97/9.03 s) check, but those are many
  darts or eyed discs in 2D, avoided in a task scored by position, not one body's head; the stalk-facing claim is
  [inferred], not [read]].

## 3. The design [ours unless marked]

### 3.1 The rule in one line
**The chase sets WHEN and HOW LONG; the picture sets HOW.** Every duration below is the chase's own number or a sourced
default; the layer adds no clock that can disagree with the simulation. It reads the chase and writes nothing back, so the
picture-only test (part 7 of the self-test, and his kept runs byte for byte) holds unchanged [summary] G-constraints:46-53.

### 3.2 Inputs and outputs
- In (read only, per chaser, per 240 Hz tick, in `WorldApp::ease_poses` [read] world_app.cpp:567-588): `mode`, `gait`,
  `speed`, `look`, `heading` from `ChaserPose` [read] world_app.h:79-95; the run's events (already read per frame by the
  sound code [read] sound.cpp:190-212); the archetype's durations [read] chase/archetype.h:50-55.
- State kept: `DrawnState { state, from, t_in, carry_speed, carry_phase_hold, w }` per id, beside `DrawnChaser` in the same
  `PoseEase` record [ours; the per-id pattern is the room's, G-code:225-226].
- Out, added to `ChaserPose` and lerped like the rest [read] world_app.cpp:539-560: the drawn state, the state it came from,
  its weight, and the inputs each generator should take (speed to pose with, whether the phase advances, posture share).
- `place_figures` then calls the generator the state names: `gait_pose` today, `quad_pose` when the gaits scout's lap lands
  [summary] S-gaits_any_body:205-217, a ladder or ledge generator when one exists. Then Layer T [summary]
  S-motion_matching:153-160, then the palette.

### 3.3 How a change is made: four methods, one per kind of change
| method | when | source |
|---|---|---|
| switch + inertialize (default) | the generator changes, or the chase changes speed in one tick (link start, wall, landing) | Bollo via Holden; half-life 0.1 s [summary] S-motion_matching:157-160 |
| posture morph | the two poses are one generator at two parameter values (stalk crouch 0.70 → upright 1.0) | spring, ω = 2/duration [summary] G-code:124; S-gaits_any_body:255-258 |
| phase carry | between two cyclic gaits | Improv's tempo morph [read] 2.2; Godot SYNC [read] 2.1 :964 |
| buffer state | a direct blend would pass limbs through the body or the wall (ladder top to run) | Improv's buffering [read] 2.2 |

- Why inertialize by default [inferred from 2.1 and 2.5]: one generator a frame instead of two, and an interruption mid-way
  simply adds to the offset, where Godot's machine refuses the change (:1014).
- A cross-fade of two different generators is NOT used: ~~positions of two unrelated poses averaged pass limbs through each
  other (Improv's own warning)~~ [2nd reader: DOWNGRADED. Improv's warning is one worked case (hands behind the back, then a
  clap) and Improv blends joint-angle DOFs "combined linearly"; its answer is to KEEP the weighted blend and add a buffer
  action, not to drop the blend (improv.pdf, "Action Buffering"). The limb-through-body risk is real for two unrelated
  generators but is [inferred], not Improv's finding] and cost two poses a frame.
- Weight curves where a weight is needed (an overlay such as a stumble): Valve's `3w² − 2w³` [summary] G-sources:110.
- Continuous things are NOT states: speed, the lean into a corner, the arm swing, the look. They are parameters of the run
  generator already (the bank, the chain, the stride law) [summary] G-code:99-153. His "slosh around corners" (129-130) is
  momentum in the chase and the tilt in the picture, never a "corner state". [inferred] A corner state would bring back
  the lag his 151 rejected.

### 3.4 The states, per kind of entity
Hunter (the only posed body today):
| drawn state | from the chase (read only) | generator | change in | tell |
|---|---|---|---|---|
| Wait | ~~Mode Waiting~~ | stand (`gait_pose`, speed 0) + look | at release: inertialize | release is known ahead: HunterReleased a = the head start [read] run.h:64 |
| Run | Gait Mesh, Mode Pursue/ToMouth/GoingRound/Inside/~~OffStage~~ | `gait_pose` + lean, chain, look | phase carry from Stalk | head on you (exists, run.cpp:864) |

[2nd reader: WRONG for both struck spans. `gather_poses` skips them: `if (a.mode == chase::Mode::Waiting || a.mode ==
chase::Mode::OffStage) continue;` world_app.cpp:532 (main 31d1c6d). A waiting or off-stage hunter has no `ChaserPose`, so
nothing is drawn and `DrawnState` never sees it; at release `ease_poses` finds a new id and calls `drawn.reset`
(world_app.cpp:574-575). Wait has no picture and no transition to inertialize; the first drawn tick IS the entry. Also
`look` at run.cpp:864 turns toward `player_pos_`, the true position, on every Pursue tick, not on sighting: head-first is
constant, not a tell that fires at a change. Not in any ground file.]
| Stand | Mesh at speed ~0; AtMouth, Guarding | stand + look | inertialize | none needed: a pause still reads as chasing [read] 2.6 |
| Stagger | Recover after Mesh (wall, 0.2 s) | stand + T; the chain springs give the follow-through | inertialize, 0.1 s | visible stop; his window to run |
| Air | Gait Drop (0.9 s) | stride held: last Mesh speed, phase frozen (lap 1) | inertialize | none |
| Land | Recover after Drop (0.7 s) | stand + T; a landing crouch later, from a source not yet read | inertialize | the landing's footfall sound (E's lane) |
| Ladder, Ledge | Gait Ladder (mount 0.8 s), ~~Climb~~ | none yet: stand (today); later grips (Overgrowth ledgegrab, planned) [summary] G-sources:46-47 | buffer: Stand | none |

[2nd reader: DOWNGRADED for the hunter. Its `may` is Walk | Ladder | Drop (archetype.cpp:20); Climb is "for the crawler alone"
(archetype.h:58) and set at archetype.cpp:157. A hunter Ledge state never occurs; it belongs in a crawler table.]
| Stalk | NOT in the chase yet (A's lane, items 205-206) | `quad_pose` row `stalk` [summary] S-gaits_any_body:221-224 | — | facing: his call (3.6) |
| Rise | Stalk → Pursue at the "seen" tick | posture morph 0.25 s + phase carry; arms hand to the run's arm laws | inside the 0.40 s reaction | head turns first, then rise, then the loud footsteps (205) |
| Catch | event Caught | E's catch reaction (soft key) [summary] G-physics:79, :91 | strength drop | the catch sequence (entity_bodies-3), not this layer |

Lesser chaser (boxes today; the same layer when they get `gait_pose` [summary] G-code:210-226):
| drawn state | from the chase | tell |
|---|---|---|
| Approach | Mode Investigate (slow toward the sound, item 92) | body faces its path; head may sweep |
| Notice | event Sighted or Heard, for `reaction_s` 0.25-0.3 s [read] archetype.cpp:44, :69 | head snaps at once (exists, run.cpp:1233), ~~body holds~~; `Cue::Sighted` sound exists [read] sound.cpp:200-202 |
| Run | Mode Pursue ~~after the window~~ | facing its motion |

[2nd reader: WRONG. Mode flips to Pursue AT the sighting tick (run.cpp:1162-1163: `a.mode = Mode::Pursue ... next_plan_tick
= now`), not after a window. `reaction_s` only gates `replan` (run.cpp:1196: `k.at_or_before(now - reaction)`); until it is
met no new plan is made and `chase::step` (:1232) keeps walking the old Investigate path, so the body does not hold, it
carries on. The head turns only `if (a.contact)` (:1233). A "Notice" window is not a state the chase has; drawing one
needs the picture to time it itself, which the scout forbids (section 6, "New durations of the picture's own"). Also
"Approach ... head may sweep" has no code behind it (look_toward is called only at :864 and :1233): UNSUPPORTED.]
| Leave | Mode Leaving; event Lost | sound exists (`Cue::Lost`) [read] sound.cpp:204-205 |
The pack's three bodies share one footfall clock (his T4 pick) [summary] S-gaits_any_body:236-238; their Notice is per body.

The player: the `Body` blend of 9 moves IS its state layer, ticked with the sim and checked against the camera
[summary] G-code:47; G-physics:207. It keeps it. What it shares: the method table (3.3), Layer T when that moves it from
first-order to the velocity-carrying spring [summary] S-motion_matching:170-172, and the rule that a transition never moves
the camera (row `the_camera_moves_exactly_as_it_did_without_a_body_over_the_whole_gym_run`) [summary] G-code:292. It needs
no tells: no one watches the player's body but the player.

### 3.5 Anticipation and follow-through, within physics and picture-only
- Anticipation needs the future (2.3, 2.4). Delaying the picture is out: the catch and the walls are judged on the sim's
  positions, and the player's own body hangs from the camera [inferred]. So anticipation is drawn only inside windows where
  the sim already knows what comes next [ours, on the code read in section 1]:
  - the reaction window: the chaser KNOWS at t and ~~ACTS~~ RE-PLANS at t + 0.40 s (hunter) or 0.25-0.3 s (lesser) [read] run.cpp:788,
    :810-812, :1196 [2nd reader: DOWNGRADED. The delay is on the plan only; `react` is 0 when `dark` (run.cpp:788), and the
    hunter has no sighting event or mode change to anchor "t" (Stalk is not in the chase, as row Stalk says). The window
    exists for a lesser chaser's first plan after Investigate; for the hunter's Rise the trigger is unbuilt, so "inside the
    0.40 s reaction" is [ours], not [read]]. The head turn fills it today. The rise's gather goes here, and Lasseter's rule says a prepared action
    may then be fast [read] 2.4;
  - scheduled ends: HunterReleased's head start, HunterAtMouth's "how long it will stand there" [read] run.h:64, :72;
  - links on the path: the next link and its distance are in the chaser's path before `start_link` [read] chaser.cpp:61-62.
    A gather before a drop or a ladder can start from that distance [ours; later than lap 1].
- Follow-through is causal and already sourced: the chain springs (0.13 s, 0.22 s) and, on E's branch, the soft-key upper
  body [summary] G-sources:219-221; G-physics:75-79. Layer T adds the whole body's carry through a stop. No new filter.
- "Obeys physics" (his 217) [summary] G-his_words:544-547: no anticipation that moves the root against the sim. A gather
  lowers the pelvis and pitches the trunk over planted feet; the feet and the root stay where the chase put them.

### 3.6 Which changes carry a tell the player can read or hear
- **Must:** the Rise (205: "then the real chase begins, with the loud footsteps"): head first, rise, footsteps on. A lesser
  chaser's Notice: head first, a hold for the reaction window, then the burst; its sound exists.
- **Must stay readable (his 206):** the whole Run. The studies give the mechanism [read] 2.6: facing its motion and heading
  at you is what people detect. The body already faces its travel by Valve's yaw [summary] G-sources:103-104.
- **His call, with one lever:** the Stalk. The chase decides the path (A's lane). The picture decides the facing. Head
  toward the player while the path strays is the wolfpack cue: felt as pursuit and avoided [read] 2.6. Head along the path
  hides it. One number, `stalk_look_share` 0..1, the share of the look that goes to the player; default 1 [ours: chosen so
  item 206's "they should know where it is most of the time" is the starting point].
- **Never:** speed changes, corners. They are momentum, already shown by the tilt.
- **One clock for sound and picture [inferred, for E's lane]:** today the mixer steps the chasers' feet from speed
  (mixer.cpp:1276). When the footfall clock lands, the step sound should be fired by the same footfall the picture draws,
  so the Rise's first loud step lands on the first upright foot.

### 3.7 Parameters (few, each sourced or the chase's own)
| parameter | default | source |
|---|---|---|
| inertialization half-life | 0.1 s | Holden's controller [summary] S-motion_matching:159 [2nd reader: DOWNGRADED, carried from the sibling's own second reader: 0.1 s is the demo's mocap-to-mocap value at 60 Hz, not a stop from 9 m/s; the room's player body uses 0.06 s, body.cpp:30] |
| overlay weight curve | 3w² − 2w³ | Valve BaseAnimatingOverlay [summary] G-sources:110 |
| durations of Stagger, Air, Land, Ladder, Ledge, Notice | the chase's `wall_hit_s`, `drop_s`, `drop_recover_s`, `ladder_mount_s`, `climb_s`, `reaction_s` | [read] archetype.h:50-56 |
| rise posture spring | 0.25 s, inside the 0.40 s reaction | [summary] S-gaits_any_body:255-258 (ours there) [2nd reader: its mechanism, the forward-acceleration rise from lizards, was DOWNGRADED by that scout's own second reader (rear centre of mass; the hyena's is forward); the cited lines have drifted to :313-317] |
| `stalk_look_share` | 1 | [ours] (3.6) |
Two numbers are new; the rest exist.

### 3.8 Cost per character per frame [inferred; nothing timed]
- The state step: a switch on two enums and a few compares at 240 Hz: well under 1 µs per chaser.
- Methods: inertialization under 1 µs per figure [summary] S-motion_matching:165-167; a posture morph adds nothing (one
  generator, one parameter); phase carry is a float. No method evaluates two generators.
- So the layer adds well under 2 µs per character per frame against about 1.2 ms of room at p99 [summary]
  G-constraints:31. The generators it chooses cost what they cost already (single-digit µs for `gait_pose`, untimed)
  [summary] G-code:239-240.

## 4. The first lap: the drop

- **Case.** When the hunter takes a drop link, the chase sets its speed to 0 [read] chaser.cpp:66 and moves it along the
  drop's curve for 0.9 s [read] :81-84, :100-104, then stands it 0.7 s [read] :117-120. The stage poses by speed
  [read] stage.cpp:269, :278. [inferred] The hunter is drawn standing, feet together, carried down through the air.
- **The smallest piece.** `DrawnState` with three states only: Run (Mesh), Air (Drop), Land (Recover entered from Drop).
  In Air the stage poses `gait_pose` with the speed the body had on its last Mesh tick and does not advance the phase; in
  Land it poses the stand (speed 0), as today. Air holding the stride is [ours], kept small: the legs keep the shape they
  left the floor with; Overgrowth's off-feet tilt target of 0 already applies [summary] G-sources:36-37.
- **Files.** game/model_rig.h and .cpp (`DrawnState`, its step); game/world/world_app.h and .cpp (`PoseEase` holds it,
  `ChaserPose` carries its out); game/world/stage.cpp (`place_figures`: speed and phase per state); game/tests/
  model_rig_tests.cpp (scripted rows); game/tests/world_app_tests.cpp (the recorded row). Nothing in chase/ or sim/.
- **Before code:** replay his 16 kept runs headless and count the hunter's Mesh → Drop ticks. If there are any, the first
  one found is the recorded case. If there are none, say so; the scripted case then stands alone. I could not count them:
  running anything was outside this task.
- **Row 1, red today, green after:** "while the chase carries the hunter down a drop, its drawn ankles stay apart along its
  heading by at least half the step it had when it left the floor". [2nd reader: the stage also passes `motion.floor`
  (stage.cpp:277), and `apply_motion` moves each ankle by the floor offset below it, clamped to +-0.45 m and sinks the hips
  up to 0.30 m (model_rig.cpp:438-468). In a one-storey fall that offset saturates, so the legs are re-reached downward
  whatever Air poses. The lap does not say whether Air turns `floor` off. Unaddressed in the scout.] Today: at speed 0 the stand-in stands still
  (row `the_stand_in_gait_keeps_every_limb_its_own_length_and_stands_still_at_rest`) [summary] G-code:263, so the ankles
  are level: red. After: green. Bar half a step [ours]; the step is `stride_step` at the carried speed.
- **Row 2:** "a drawn state is Air on every Drop tick and Land on every Recover tick that follows one" on the recorded case.
- **Row 3 (guard):** on a run with no link, the drawn pose is bit-identical to today's (every landed gait row stays).
- **Row 4 (picture only):** his 16 kept runs replay byte-identical, as L185 did [summary] G-constraints:51.
- **Not in lap 1:** the joint jump at the drop's first tick and at landing. That is Layer T's row; if T has landed first it
  covers both, if not, lap 1 still makes the in-air body right and T follows [summary] S-motion_matching:213-240.
- **Tier:** "check it" (a visible change; the drawn state is behaviour nobody can see in a test name alone, so rows 1-2).
  The replay row is the existing harness. No bench while he plays.

## 5. What only the owner's eye can decide, and the fewest clips

1. **The drop, now.** One clip, two columns: current main and lap 1, from 4 m behind, at full frame rate and lit, the
   "before" being today's main (his 216 ruling) [summary] G-constraints:159-161. `--capture-lean` is fixed at 12 fps
   [summary] G-constraints:143, so the builder states the rate used.
2. **The stalk's facing, when the stalk exists.** Two clips of one stalk path through the look-behind: `stalk_look_share`
   1 (head on you) and 0 (head along its path). His 206 is the bar; no table decides it.
3. **The rise, when it exists.** Two clips: rise with a gather in the reaction window, and rise without one. Lasseter says
   the prepared one may be faster; only his eye says whether it reads as "it turns up right" or as a cartoon.
The half-life of T is S-motion_matching's clip, not one of these.

## 6. What I would NOT build, and why

- **A data-driven graph** (Godot-style nodes, expressions, priorities, an editor): we have about ten states per kind, no
  clips, and one programmer reading a table in code. The graph's main gift, cross-fading clips, is the one method we avoid.
  [2nd reader: RE-DERIVED. G-sources:84-88 (A5): Godot's blend space "fits only once clips exist ... clips are out by his
  pick"; also scout_authoring_and_tuning.md:338. Godot MIT is already in G-constraints:177.]
- **Cross-fades between different generators:** two poses a frame and limbs through limbs (2.1, 2.2). Inertialize instead.
- **The cartoon filter as exaggeration:** its anticipation needs the future (2.3) and A = 3 is cartoon, against "uncanny in
  a realistic way that obeys physics" (217). Its idea survives only as "anticipate inside known windows".
- **Delaying the picture** to buy foresight: the catch and walls are judged on the sim's positions; a picture behind them
  lies about where the hunter is, which is the opposite of his 206.
- **Behaviour in the picture** (Improv's probabilistic engine, a search pattern chosen by the animation): when to stalk, to
  rise, to cut off, to search is the chase's (A's lane). The picture only reads `mode`.
- **A corner state, or any state for a continuous quantity:** the lean, the swing and the stride are parameters; a state
  would add a lag his 151 already rejected.
- **New durations of the picture's own:** every state length is the chase's; a second clock would let the picture and the
  simulation disagree about what the hunter is doing.

## What I did not open

- Bollo's GDC 2018 talk; Perlin's 1995 IEEE paper (the link failed); the Improv patent; Thomas & Johnston's book.
- Godot's `animation_tree.cpp`, its blend spaces and its `Curve`; any other engine's state machine (Unreal, O3DE, ozz).
- Holden's dead-blending code repository; his springs article (S-motion_matching read it).
- Gao et al.'s other experiments beyond those cited; any study of reading intent from 3D human bodies or in first person;
  any published game-design text on telegraphing.
- In dreamzone-3: `cross()` beyond :89-104; `Body::pose` and `body.cpp`; the mixer beyond :1276; `sound.cpp` beyond
  :150-212; the test files; every branch; the kept runs themselves (not counted).
- The hand-backs behind the ground files beyond the lines they cite; `scout_evaluation.md`, `scout_ik_and_feet.md`,
  `scout_motion_data.md`, `scout_secondary_and_physics.md` beyond their first lines.

## Second reader

Marks as in the file. Game code read at dreamzone-3 main 31d1c6d with `git show main:<path>`. Outside sources downloaded with curl
into my scratchpad (`.../scratchpad/s2dl/`), PDFs converted with pdftotext, read in whole lines. Nothing was run or built.

| # | line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|---|
| 1 | 57 | every link starts at speed 0 | chaser.cpp:60-68 | OK | `c.speed = 0;` at :66 |
| 2 | 58-61 | drop 0.9, recover 0.7, wall 0.2, ladder 0.8, climb 1.4 s | archetype.h:51-55, archetype.cpp:20-21 | OK | defaults match; lesser wall_hit_s is 0.5 (.cpp:43), not named |
| 3 | 55-56 | Gait, Mode, EventKind lists | chaser.h:59-67, run.h:63-118 | OK | enums as listed |
| 4 | 52-53 | ChaserPose has mode and gait | world_app.h:85-86 | OK | fields on those lines |
| 5 | 53-54 | picture uses `gait` once, as on_feet | world_app.cpp:578 | OK | only `Gait::Mesh` test in the file |
| 6 | 62 | stage poses hunter from speed alone | stage.cpp:269, :278 | OK | phase and `gait_pose` both take `p.speed` |
| 7 | 65-67 | react 0.40 s hunter, 0.25-0.3 s lesser | run.cpp:788, dials.h:31, archetype.cpp:44, :69 | OK | numbers match |
| 8 | 227-228 | chaser knows at t, ACTS at t+0.40 | run.cpp:788, :810-813, :1196 | DOWNGRADED | delay gates replan only; 0 when `dark`; no hunter trigger |
| 9 | 70-71 | Sighted/Heard/Lost cues | sound.cpp:197-206 | OK | lesser only, as stated |
| 10 | 71-72 | footsteps on mixer clock from speed | mixer.cpp:1276, :54 | OK | `rate_to = kind.rate + rate_per_ms * s.speed`, steps a second |
| 11 | 82-84 | Godot MIT, notice kept, no share-alike | godot 4.3-stable LICENSE.txt:1-20 | OK | standard MIT permission text |
| 12 | 87-88 | fade_blend, both states at w and 1-w | animation_node_state_machine.cpp:834, :838, :849-875 | OK | `pi.weight = fade_blend` then `fade_blend_inv` |
| 13 | 89 | SYNC copies position | .cpp:964 | OK | `pi.time = current_nti.position;` |
| 14 | 90-92, 183-184 | no change starts mid-fade; Godot refuses | .cpp:987-1022 | DOWNGRADED | `next_request` branch returns before :1014; auto-advance only |
| 15 | 91, 90 | AT_END at xfade; lowest priority wins | .cpp:1019, :1062-1084 | OK | `<= priority_best`, ties go to the later |
| 16 | 100-104 | Improv weights ramp 0 to 1; tempo morph | improv.pdf "Action Compositing", "Applying Actions" | OK | "smoothly from zero to one"; master clock varied |
| 17 | 105-106, 185 | buffering; limbs through limbs as warning against cross-fade | improv.pdf "Action Buffering" | DOWNGRADED | one case; Improv keeps the blend, adds a buffer |
| 18 | 98-99 | project page links an Improv patent, 6,115,053 | mrl.cs.nyu.edu/projects/improv/ | OK | link text "Improv Patent", id in URL |
| 19 | 112-117 | filter eq, A=3, 32 frames, sigma=2pi/w, root xy skipped | wang-2006-tca.pdf s.1, 3.2, 4.3 | OK | all quoted values present; paper also says "real-time" |
| 20 | 122-128 | Lasseter 2.2, 2.3, 2.5 quotes | lasseter.pdf | OK | "3 or 4 frames long"; same para says an unprepared fast action is missed |
| 21 | 132-136 | dead blending, ~30 us, side switch | theorangeduck.com/page/dead-blending | OK | 30 us is a 2x128 network on his laptop, "ad-hoc" |
| 22 | 141-144 | 85% to chance; >60% at 0/30; chance 120/150 | gao2009 s.2.3 (lines 378-385) | OK | verbatim |
| 23 | 144 | facing pursuer escaped more than discs, 14% | gao2009 s.6.2, Table 3, s.6.3 | DOWNGRADED | vs Discs p = 0.060; omnibus p = 0.051; n = 12 |
| 24 | 145-148 | static rest harmless; super stalker 1/3, 60 deg | gao2011 Exp.2 results, Gen. Disc. | OK | verbatim |
| 25 | 154 | a pause never hides it | gao2011 Exp.2, footnote 3 | DOWNGRADED | discs, 20-80% rest; rest made the wolf easier to escape |
| 26 | 150-151 | 7.99/9.01 s darts; 7.97/9.03 s eyes | wolf.pdf Exp.3a, 3b | OK | chance 8.5 s as stated |
| 27 | 40-46 | owner quotes 205-208 | briefs/dreamzone2_the_game.md:1546-1558 | OK | text matches; :1546 also asks for a return to stealth |
| 28 | 197-198 | rows Wait (Mode Waiting) and OffStage drawn | world_app.cpp:532 | WRONG | `gather_poses` skips Waiting and OffStage |
| 29 | 212-213 | Notice holds body; Pursue after the window | run.cpp:1162-1163, :1196, :1232-1233 | WRONG | mode is Pursue at the sighting tick; body walks on |
| 30 | 203 | hunter has Climb/Ledge | archetype.cpp:20, :157; archetype.h:58 | DOWNGRADED | Climb is the crawler's alone |
| 31 | 3-4 | wall stops, landings drawn "sliding" | chaser.cpp:226-227, :421-425 | DOWNGRADED | Recover stands still; only drops and ladders slide |
| 32 | 211 | Approach: "head may sweep" | run.cpp:864, :1233 | UNSUPPORTED | no sweep code; head set only to the player |
| 33 | 21-38 | G-code cites (63-65, 124, 165, 195, 225-226, 263, 292, 340-341) | ground_code.md | OK | each line says what is cited |
| 34 | 28-34, 187, 233, 266 | G-sources 36-37, 65-75, 105-110, 219-221; G-physics 79, 91, 207; G-constraints 31, 46-53, 143, 159-161 | ground files | OK | all match; "local clone only" is at G-physics:4-5 |
| 35 | 178, 255 | half-life 0.1 s | S-motion_matching (its own second reader) | DOWNGRADED | demo mocap value; room's body uses 0.06 s per that file; carried, body.cpp not opened |
| 36 | 36-37, 258 | rise spring from S-gaits:247-263 | scout_gaits_any_body.md:248, :313-317, :484 | DOWNGRADED | lizard mechanism downgraded there; scout's line numbers have drifted |
| 37 | 285-288 | row 1 red today: stand-in ankles level | model_rig_tests.cpp:194-207, model_rig.cpp:703, :438-468 | DOWNGRADED | test checks phase 0 only; `running_leg` g blends to a stand (:703); floor snap unmentioned |

Tally of 37 rows: OK 24, WRONG 2, UNSUPPORTED 1, DOWNGRADED 10.

RE-DERIVED: 3 against the ground files. (a) "the hunter has no state layer; Ladder/Drop/Climb/Recover not posed": scout :3, :27-28 against
G-code:63, :223, :341 (the scout cites :63 itself, but its summary line 1 reads as a finding). (b) rejecting a clip graph because it needs
clips: scout :310-311 against G-sources:84-88. (c) Godot is MIT: scout :82-84 against G-constraints:177. One more against a sibling, not
ground: dead blending read whole in scout_motion_matching.md:114, :154 and again at scout :130-136 (disclosed there at :136).

### The simplest build that passes row 1 without doing what it is for

Row 1 asks only that the drawn ankles stay apart along the heading by half a step on every Drop tick. It passes if Air sets the phase to a
fixed value where the stride is widest (a quarter turn puts the left knee 0.1 m ahead, model_rig_tests.cpp:220-221) and the speed to any value
above `kLegSlowest`: a figure frozen in one max-stride pose, whatever it left the floor in. No row checks that the pose is the one the hunter had
at takeoff, that it moves, or that it reads as a fall, and the joint jump at takeoff and landing is moved out of lap 1. A better red row also
compares the Air pose with the last Mesh pose within a tolerance, and checks the legs AFTER `apply_motion`'s floor snap, which is where lap 1
can fail silently (correction at row 1).

### Mechanisms with no source and no [ours]

- "Notice ... body holds" and "Approach ... head may sweep" (rows 29, 32): no source and no code.
- "Never: speed changes, corners" as tell-free (section 3.6): stated flat, unmarked; it is [inferred] from his 129-130 and 151, not read.
- "Rise ... inside the 0.40 s reaction": needs a sighting trigger the hunter does not have; [ours] on code that is unbuilt.
- Phase carry "from Stalk" needs the unbuilt per-chaser footfall clock; it is [summary] only.

### What the scout left out

- Item 205's second half (brief:1546): the hunter goes BACK into stealth once the player runs out of its sight, "but it shouldnt exploit this
  right away". G-his_words:502-505 elides it, and the scout used the ground file. There is no Run -> Stalk edge and no tell for it, and the
  silent-footsteps case is absent from the tell table. This is the other half of the signal he wants ("know where it is most of the time").
- The hunter's head always looks at the true player position in Pursue (run.cpp:864), so "head first" does not mark a change of state.
- Gao 2009 section 7.4 is on point and unused: facing the prey and heading at it gives a chase away.

### What I could not check

- Perlin's 1995 IEEE paper and the Improv patent text (the scout did not read them either; I read only that the link exists).
- Whether the 16 kept runs contain any hunter drop: counting needs a replay, which the rules forbid.
- Godot `_travel` (.cpp:499) and `start()`: whether a travel request is also blocked mid-fade.
- body.cpp:30 (the 0.06 s) and the sibling second reader's claims: taken from that file, not opened in the game.
- The cost figures in 3.8: nothing was timed, by either of us.
- Terms of the three journal papers (not proposed for use, so not required).
