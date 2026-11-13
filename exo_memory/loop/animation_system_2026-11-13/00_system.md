# The animation system for every body (system design, 2026-11-13)

1. One pipeline draws every body: the simulation's state, then a per-body picture clock on the 240 Hz tick, then a pose
   generator, a whole-body lean by physics, the chain, transitions, contacts, picture physics, and the skin. It reads
   the simulation and writes nothing back.
2. Most layers exist on main for the hunter alone. The system makes them per body, adds four sourced pieces (one
   picture clock, feet held where they land, the lean about the feet by atan(a/g), inertialized changes of state) and
   retires two home-made ones (the frame-time stride, the player's own lean).
3. One small data file per kind, about five knobs his eye tunes, on top of shared laws that carry their sources.
4. His method: a human baseline scored by the yardstick plus physics checks, then ONE capability raised per kind (the
   hunter's is grip); every law row stays green and every human row but one. Above 4.5 m/s that check is only partial.
5. CPU pose work is tens of microseconds a body and unmeasured; GPU skinning and picture physics are the real cost and
   are not measured per body. Two measurements are owed before a third posed body lands.

Writer of the system design, read-only. Marks: [read] I opened it; [summary] a secondary account; [inferred] mine;
[ours] a proposal of this file. Every cite is a file in this folder unless a path is given, and every cite of a scout
file uses the form AFTER its second reader's corrections. Short names:
GW `ground_his_words.md`, GS `ground_sources_read.md`, GC `ground_code.md`, GP `ground_physics_and_fp_body.md`,
GL `ground_locomotion_and_yardstick.md`, GR `ground_constraints_and_roster.md`; scouts S-run (runtimes), S-og
(overgrowth_method), S-mm (motion_matching), S-data (motion_data), S-ik (ik_and_feet), S-phys (secondary_and_physics),
S-gait (gaits_any_body), S-turn (turning_and_transients), S-head (upper_body_and_gaze), S-unc (uncanny_by_physics),
S-fp (player_first_person), S-trav (traversal), S-auth (authoring_and_tuning), S-eval (evaluation), S-perf
(performance_and_determinism), S-model (models_and_skeletons), S-state (states_and_transitions), S-ship
(shipped_systems). Game code is dreamzone-3 main 31d1c6d as the files read it. One primary opened by me: the brief at
`exo_memory/briefs/dreamzone2_the_game.md:1585-1615`, to quote item 218 by its line (rule 7), not to settle a dispute.

His words this design answers, verbatim:
- item 218: "I have a better idea, spend the last of our usage on an all out swarm to create not just an animation
  system for the hunter, but a system that will helps us make very elegant animations for the rest of the entities and
  even the player character. We can do all the research of real open source shit and real techniques. you got the
  planning better than I do" [read: brief:1612].
- item 156: "kinetic linking, making the whole body work as one. We need to make that but better for all entities and
  even the player character" [read: GW:338-339].
- item 217: "we get the a good metric for a really human looking sprint which we had, and then we tweak it from there
  to look uncanny in a realistic way that obeys physics" [read: GW:545-546].
- item 153: "well why the fk did we do all the research just to ignore it and do our own thing????????????????"
  [read: GW:322]. The rule this file keeps from it: a mechanism with no source is marked [ours] and kept small.

## 1. The system in one page

**What it is.** Every frame, each body is drawn in nine steps. The simulation has already decided where each body is,
which way it faces and how fast it goes. The animation only draws that; it never moves anything the simulation owns,
so a recorded run replays the same [read: GR:33-54]. The steps:

- **L0, read.** Takes each chaser's place, heading, speed, turn, gait (run, ladder, drop, recover) and mode, and the
  player's state. Gives a read-only copy per body. Exists: `WorldApp::gather_poses` and `Body::tick` [read: GC:24,
  :46]. A waiting or off-stage chaser is skipped and not drawn [read: S-state:221-226].
- **L1, the picture clock and each body's memory, stepped on the 240 Hz tick.** Takes L0. Gives, per body: where it is
  in its stride, its eased lean and facing, where it looks, which drawn state it is in, and its springs. Exists in part:
  `DrawnChaser` steps every chaser on the tick [read: GC:25-26]. Missing: the hunter's stride is summed from the drawn
  frame's time, in the stage, for one body only [read: GC:34-38], so it differs by frame rate and keeps cycling while
  paused [read: S-perf:62-68].
- **L2, the pose generator.** Takes the model's own rest skeleton, the feet's place, heading, speed and stride. Gives
  21 joint positions. Exists: `gait_pose` for the upright run, built from recorded runners' curves [read: GC:29;
  GL:90-97]; `Body::pose` for the player, hung from the camera's eye [read: GC:47, :59]. Later: a four-limb stalk and a
  climb pose [read: S-gait:237-242; S-trav:209-220].
- **L3, the whole-body lean by physics.** Takes the body's sideways and forward acceleration and the kind's grip. Gives
  one roll and one pitch of the whole body about its feet: a body on a bend leans by atan(a/g), and grip caps it at
  atan(mu) [read: S-turn:195-200; S-unc:190-193]. New. Today the feet stay under the hips and only the hips and trunk
  tilt about the pelvis, at about a sixth of what physics asks [read: S-turn:64-76].
- **L4, the chain ("kinetic linking").** Takes L3's lean, the look and the stride. Gives how pelvis, trunk, neck, head
  and arms share the lean, the counter-twist and the look, with springs so one part trails another. Exists for the
  hunter [read: GC:114-139]; the player has none [read: GC:64].
- **L5, transitions.** Takes a change of drawn state, or a speed the chase snaps in one tick. Gives an offset that
  decays to nothing, so no joint jumps. New for chasers [read: S-mm:153-177]; the player has a first-order form
  [read: S-mm:32-35].
- **L6, contacts.** Takes the pose and read-only probes of the world. Gives feet held where they landed, hips lowered
  for the lower foot, later hands on holds and walls. Exists in part: the hunter's floor probe and hip sink, and a
  world-held foot for the player only [read: S-ik:37-49].
- **L7, picture physics.** Takes the finished pose as a target. Gives an upper body that follows with its own momentum
  and goes loose at a catch. Built green on E's local clone only [read: GP:4-5, :75-80].
- **L8, frames and skin.** Takes the 21 positions. Gives one transform per bone of the 53-bone model. Exists, shared by
  any model on the MPFB `game_engine` rig: `Rig::palette` [read: GC:73-93].

**One picture, in text** [ours]:

```
 SIM (240 Hz, owns everything)          PICTURE (reads only)
 ChaserPose / PlayerState --L0--> per-body memory, stepped each tick (L1):
                                  stride phase | lean & bank | facing | look | drawn state | springs
                                        |  drawn at alpha between the last two ticks
                                        v
 per drawn frame:  L2 generator --> L3 lean about feet --> L4 chain --> L5 transition offset
                   (gait_pose /      (atan(a/g),            (twist,       (decays, so
                    Body::pose)       capped by grip)        look, arms)   nothing pops)
                                        --> L6 contacts --> L7 physics --> L8 Rig --> GPU skin
                                            (feet held,      (upper body    (bone frames,
                                             floor, hands)    soft-keyed)    palette)
```

**Why L5 sits before L6** [ours]: a decaying offset on a planted foot makes it glide over the floor after a dead stop
[read: S-mm:362-363]; contacts after the offset hold the foot where it stands. What would change it: a row showing the
lock and the offset fight at the lock's edges.

**How the three kinds of body differ, and only this** [ours, from S-fp:169-190]:
- The hunter and every lesser chaser are anchored at the feet and driven by `DrawnChaser`. A lesser kind uses the same
  path with its own model, its own rest skeleton and its one cue [read: GC:189-195].
- The player is anchored at the eye. The camera is untouched and the aim never moves [read: S-fp:50-51]; the head IS the
  view, the chest follows it, the hips follow the travel; the legs keep their plants under the pinned eye.
- A body on four limbs uses the same 21 joints, the wrists and hands standing as fore feet [read: S-gait:237-241, ours
  there].

**States, in one rule** [read: S-state:176-180]: the chase sets WHEN and HOW LONG (its own `drop_s`, `wall_hit_s`,
`reaction_s` and so on [read: S-state:61-64]); the picture sets HOW. Four ways to change state: switch and inertialize
(default), morph one generator's posture, carry the stride phase between two cyclic gaits, or pass through a buffer
state where a direct change would put a limb through the body [read: S-state:193-199, with its second reader's
downgrades at :201-207]. Continuous things (speed, the lean, the swing, the look) are never states [read:
S-state:209-212].

**The rules that keep it picture-only** [read: S-perf:171-196]: everything that integrates over time steps on the sim
tick and is drawn at alpha; everything per frame is a pure function of those; smoothing per frame is for the view
only; picture randomness is seeded by body id and tick; level-of-detail is chosen per tick. The world may be read only
by closest-hit queries such as `floor_below`, never by anything that depends on Jolt's body order [read: S-perf:190-192].
No reduced-rate posing: a skinned mesh posed less than every frame loses its pixel history [read: S-perf:88-94].

## 2. One data file per kind of entity

### 2a. The file and its reader [ours, on the game's own pattern]

- A table `DZ_BODY_STYLE(X)` with `X(name, def, lo, hi, source, desc)` in a new `game/body_style.h`; its defaults are
  the sourced constants now in `game/model_rig.h` [read: S-auth:163-165]. The SOURCE of each default lives in that
  code table, where review sees it.
- `content/bodies/<kind>.txt` holds only the lines that differ from the default, in the `params.txt` text form
  [read: S-auth:158-162]. The shared reader cuts everything after `#`, so a comment can never carry a mark [read:
  S-auth:165-170]. So each override carries a pair, `name.mark = ours by eye 2026-11-14` or `name.mark = <source>`, and
  the reader refuses an override without its mark, naming the line [ours, small]. ~~That makes item 153 a parse error.~~
  [2nd reader: DOWNGRADED to [inferred], unmarked here and so marked by S-auth:431. The reader checks that a mark is
  present, not what it names; S-auth:178-179 has the editor write "ours (by eye, <date>)" on every slider save, so any
  eye-tuned value passes. It makes an unsourced value visible line by line; it does not stop one.]
- The reader refuses any name the simulation or the dials define [read: S-auth:171-173]: grip, speeds and the turn law
  stay the simulation's, so reloading a body file can never change a replay. [2nd reader: S-auth:171-173 marks this
  refusal [ours] and the replay claim [inferred]. Two gaps: the refused set must be built from the X-macro tables
  themselves (`sim/params.h`, `chase/speed.h`, `chase/dials.h`), or a sim name added later passes; and the reader
  refuses only sim and dial names, so two knobs in 2c (`landing_dip`, `step_clock`) duplicate the CAMERA's own settings
  (`game/settings.h:45-48`, `:52`, main 31d1c6d) and would pass, giving one value two homes.]
- F5 reloads it with `params.txt`; a bad file keeps the old values and says "(nothing was changed)" [read:
  S-auth:64-66]. The live editor is the overlay's existing table editor [read: S-auth:68-70].

### 2b. Shared laws: in code, the same for every body, not per kind

| law | value | source | on screen |
|---|---|---|---|
| step length | 1.15 h (v^2/gh)^0.3, h = hip over the lowest foot joint | Alexander 1976 via Mazzetta & Blanco [read: GL:69-74] | longer strides for longer legs and higher speed |
| running legs to 4.5 m/s | fitted to Fukuchi 2017 means | [read: GL:90-95] | knee, hip, ankle shape |
| legs past 4.5 m/s; hips by two laws | Dorn's SimTK runner (MIT as recorded) [2nd reader: DOWNGRADED for the hips. Dorn gives the leg fits and the pelvis travel table; the spring-and-throw law names Blickhan 1989 and McMahon & Cheng 1990 in a code comment; the 4.5-5.5 m/s blend and the hold past 9.47 m/s are ours, GL:101-108] | [read: GL:99-116]; branch l205-stomp-c, not landed | no stomp; sprint shape |
| arm swing and elbow ranges | Bruening 2020 S1 Table A3, Froude-scaled; flare Otsuka 2016 [2nd reader: DOWNGRADED at the hunter's speeds. Everything past Froude 1.36 is ours and the hunter runs near 3.4 (GL:141-142); elbow mean 90, abduction 15 and hand-to-midline 25 are ours too] | [read: GL:137-147] | arms by speed and limb length |
| pelvis / thorax counter-twist | 6.5 / 14.28 deg | Perpiñá-Martínez 2023; Ford 2013 abstract only [read: GS:208-209] | hips and shoulders turn against each other |
| look spread | head 1, upper spine 0.65, chest 0.4225 | ozz sample, a UI default [read: GS:57-59; S-head:328] | how much the chest joins a look |
| facing and head rates | 720 deg/s yaw, eased; head up to 1000 deg/s, 0.25 s ease-in | Valve SDK, study only [read: GS:103-108] | no snap in facing or look |
| acceleration tilt timing | half-lives 0.1126 s and 0.0548 s; 0 off the feet | Overgrowth [read: GS:34-38] | the lean's ease |
| follow springs | trunk 0.13 s, head 0.22 s | first game [read: GC:119] | trunk and head trail the pelvis |
| foot lock | lock on strike, release at lift-off or past 0.20 m; release decays by half-life | Holden controller.cpp (MIT) [read: S-ik:134-148]; Holden's floor is y = 0, so stairs rules are ours [read: S-ik:145-147] | feet stay where they land |
| reach buffer | full leg less 0.015 m | Holden [read: S-ik:144] | no knee snap at full reach |
| transition offset half-life | 0.1 s | Holden's demo, mocap to mocap at 60 Hz [read: S-mm:170, DOWNGRADED there] [2nd reader: two unmarked mechanisms ride in this row. Holden decays bone ROTATIONS; decaying joint POSITIONS in the pelvis frame is [ours] (S-mm:159-161). The trigger "a change of gait is a transition" has no source (S-mm:365). The room's own player settles in 0.06 s (body.cpp:30, S-mm:170)] | how long a stop or switch takes to settle |
| landing depth | knee 51.3 deg at 0.22 m, 72.5 deg per m, cap 87.7 | Verniba 2017 Table 2, CC BY 4.0 [read: S-trav:180-188, :272-286]; past 0.44 m and the cap are not sourced [read: S-trav:277] | how deep a body sinks on landing |
| landing return | spring omega^2 120 s^-2, decay 13.98 s^-1, zeta 0.638 | Overgrowth's crouch [read: S-og:89-92]; a second-order exact form at 240 Hz is a small gap [read: S-og:313-317] | rise back to standing |
| climb limb timing | hands 0-0.4 and 0.5-0.9 of a cycle, feet 0.1 behind; arcs 0.1 x distance x sin | Overgrowth ledgegrab.as, a ledge shimmy [read: S-trav:115-128, its downgrades] [2nd reader: DOWNGRADED as a shared law. The source is a sideways shimmy along a ledge, which section 8 leaves out ("A hang or shimmy on ledges"); using its timing for the crawler's vertical Climb or a ladder is [inferred] (S-ik:238, species DOWNGRADED), and the ladder has no rungs to grip (S-ik:241). The foot arcs are added to the HANDS in the source (S-trav:121-123)] | hand and foot order on a hold |

### 2c. The per-kind file: the knobs, each with its default and what it changes on screen

Five knobs are for his eye (marked EYE); the rest are set once per kind.

| knob | default and source | what it changes on screen |
|---|---|---|
| `model` | the kind's GLB on the MPFB `game_engine` rig [read: GR:58-66] | which body is drawn |
| `anchor` | `feet` for chasers, `eye` for the player [ours, from S-fp:169-179] | what stays fixed: the ground point or the camera |
| `gait` | `biped_run` (main's stance law) [read: S-gait:247]; `stalk` (Spoor & Belterman hyena walk: limb phase 0.14, hind duty 0.59, fore 0.66) [read: S-gait:248, with its second reader's notes :253-258]; `rhythm` (step rate held, speed from length; Full & Tu abstract) [read: S-gait:251, :283-285] [2nd reader: DOWNGRADED. S-gait:283-284 marks the rule itself [ours]; Full & Tu (an insect abstract) gives only its shape] | the footfall pattern |
| `cue` | exactly one of none, T1, T2, T3, T4, his picks [read: GW:413-418] | the one non-human thing |
| `trunk_bank` EYE | trunk lean in space 0.89 of the body's lean, Churchill 2011 S1 [read: S-turn:111-114], DOWNGRADED: radius unstated, 0.75 of gravity's lean [read: S-turn:1-6]; variant `rt`: the first game's 1.0 / 0.35 / -0.30 about the pelvis with no roll at the feet [read: GC:117] | how far the torso goes into a bank (his 214) |
| `head_bank` | the landed -0.30 (first game) [read: GC:117]; the only study read (Imai 2001, walking) gives up to 8 deg of head roll and does not state its side [read: S-turn:6-8] | whether the head tips into or out of a turn |
| `head_yaw_share` EYE | landed 0.55 of the thorax's twist (first game, no study) [read: S-head:43-44]; Pontzer 2009: 0.26 running at 3.0 m/s, 0.64 walking at 1.5 m/s [read: S-head:74-75], nothing above 3.0 m/s [read: S-head:14-16] | how much the head wobbles with the stride |
| `head_hold` | 0; 1 = the head's ROTATION held on its target, re-fixed by one eased turn at the landed look rate when it passes 0.91 rad (Overgrowth's head clamp) [read: S-head:199, :219] [2nd reader: the re-fix composition is [ours] at S-head:219, unmarked here; marked in 2d]; pigeons hold rotation, not translation, standing on a perch [read: S-head:106-112] | T2: the head stays on you while the body turns under it |
| `arm_style` | V1, his pick (item 186) [read: GW:468-470] | elbow flare and bend |
| `take_off_knee` EYE | 15 deg (Dorn's runner) or 25 (the sprint papers); no bar tells them apart [read: GL:111-112] | the knee as the foot leaves the ground |
| `soft_tau` EYE | trunk 0.005 s, arms 0.01 s (E's, ours, measured at frame dt) [read: GP:90]; hands 13 cm past on a hard stop [read: GP:192] | how far the arms carry on after a stop |
| `landing_dip` (player) EYE | today's camera dip cap 0.10 m [read: S-trav:108-109] [2nd reader: value OK (`game/settings.h:47`, main 31d1c6d, read). NEEDS A CHANGE as a body-file knob: it is the camera's own setting (settings.h:45-48), so a copy here moves the view, against 1's "the camera is untouched", and gives one value two homes. Leave it in the camera settings; the body's own landing is the knee law in 2b] | how a landing reads in first person |
| `step_clock` (player) | landed 1.12 x sqrt(v), 3.54 steps/s at 10 m/s; Alexander's law gives 4.39 [read: S-fp:273-274] [2nd reader: numbers OK (4.40 by hand at h 0.978). NEEDS A CHANGE as a body-file knob: it is the camera's `stride_rate` (`game/settings.h:52`) and drives the view's bob; S-fp:273 puts it in `gym.txt`, not a body file] | the stride rate felt in the view |
| `tier` | A (all layers, full mesh) for the hunter and the player; lesser kinds by rank [read: S-perf:198-221] [2nd reader: DOWNGRADED where 6 reads it as two lesser in full: his pick is two or three bodies in full in all, "hunter full detail, the rest can be lower quality" (S-perf:203)] | detail at distance |

The grip `mu` that caps the bank is NOT in this file: it is the simulation's ~~per-kind~~ turn law (`turn_law`, on the l182
branches, off by default) [read: GL:127-130]. The picture draws whatever grip the simulation used [read: S-unc:271-273].
[2nd reader: WRONG on "per-kind", and a gap. On `origin/l182-hawk` the grip is ONE dial, `grip_mu` 1.0
(`chase/speed.h:41`), used by H2 only; at `turn_law` 3 the hunter takes H2 and every lesser kind takes H1, which has no mu
(`chase/run.cpp:309`, same branch, read by `git grep`). On main neither exists (`git grep turn_law main -- chase`: none).
So for every lesser kind, and for every body on main, L3's cap has no simulation value to read. Either the chase exposes
a mu per kind (a change in the chase's lane, to add to section 3's `sim/`, `chase/` row) or the picture holds one, which
this file and S-unc:383-384 rule out. Until that is decided, L3's cap can be read for the hunter only, and only on the
l182 branch.]

### 2d. Worked rows

**The hunter.**
- Body: `hunter.glb`, 2.15 m, 53 bones, 127,116 vertices [read: GR:62, :86-87]; from its skin, thigh 0.621, shin 0.501,
  hip height 1.196 m, upper arm 0.490, forearm 0.461 [read: S-gait:182-191]. The record's 0.984 m was the test skeleton,
  not the hunter [read: S-gait:187-191].
- `anchor feet`, `gait biped_run`, `cue T1` (greyhound cornering, "its head stays humanlike") [read: GW:413-416].
  [2nd reader: the quoted words are the brief's filed record of his picks, not his words (GL:62-63, rule 7).]
- Stride at 9 m/s by the shared law: 2.46 m a step, 3.67 steps a second [read: S-model:222, checked at :431].
- Bank: under grip mu the lean at the limit is atan(mu): 45 deg at 1.0, 53 at 1.33 (a press figure for a cheetah),
  63 at 2.0 (ours) [read: S-turn:228-232]. The greyhound abstract's 65% limb-force rise at unchanged contact time
  implies a/g of 1.31, about 53 deg [read: S-turn:135-136, the second reader's inference].
  [2nd reader: what such a lean costs in space is not carried here. By S-turn:233-235's own geometry (L sin, L(1-cos))
  at this file's hip height 1.196 m, the feet sit about 0.85 m (45 deg) to 0.96 m (53 deg) outside the path and the hips
  drop 0.35-0.48 m [inferred, arithmetic]; S-turn's 0.70/0.79 m used the test skeleton's 0.984. In a 1.5 m corridor the
  outside foot can reach the wall (S-turn:235), where L6 would hold it [inferred]. No row or clip in 5 looks at it.]
- `trunk_bank` sourced 0.89 against the variant `rt`; `head_bank` -0.30; `head_yaw_share` 0.55 until his clip;
  `head_hold 0`; `arm_style V1`; `take_off_knee 15`; `soft_tau 0.005/0.01`; `tier A`.
- Speed range it is drawn at: 9.0 to 13.4 m/s by level and time [read: GL:179]; no human was measured above 10.97 m/s
  [read: GL:76].

**A lesser kind: the interceptor (his pick T2, "bird head hold")** [read: GW:416].
- Body: none yet; it draws as a box [read: GR:111-114]. E's sheet: about 1.70 m, broad, low centre, legs wide [read:
  S-model:228-229]. Until a model exists it is judged on the hunter's model, labelled as a stand-in [read: S-head:282-283].
- Speed: 0.90 x the 8 m/s reference, about 7.2 m/s [read: GL:178]. Grip: human, mu 1.0 [read: S-turn:267].
  [2nd reader: UNSUPPORTED as a simulation value. S-turn:267 is a picture-side `mu_draw` marked inferred there; the
  chase gives a lesser kind H1, which has no mu (see the note under 2c). The cap for this kind has no home yet.]
- `anchor feet`, `gait biped_run`, `cue T2`, `head_hold 1`: the head's yaw, pitch and roll held on the player while the
  trunk banks, twists and bobs under it; re-fixed in one eased turn when the target passes the reach or jumps [read:
  S-head:219, the saccade composition is ours there]. No positional hold: at a run a neck cannot cover a 7-16 cm bob
  [read: S-head:222-223].
- Everything else is the human base at its own leg length: `trunk_bank 0.89`, `head_bank -0.30`, `arm_style` by its own
  limbs, `soft_tau` when it is in the active set, `tier` by rank.
- Its own row is the T2 channel: head angular velocity in the world against the trunk's [read: S-unc:313-314]. No human
  band for that channel was read [read: S-unc:315].

**The player (the kid).**
- Body: `kid.glb`, 54 joints (the 53 and `eye`), 139,125 vertices [read: GR:63]; thigh 0.460, shin 0.450, hip 0.978 m
  [read: S-model:140]. The game's own build is a 1.8 m figure with the eye at 1.65 [read: GC:180].
- `anchor eye`: the body hangs from the camera's eye [read: GC:59]; the camera rows stay exact
  (`the_camera_moves_exactly_as_it_did_without_a_body_over_the_whole_gym_run`) [read: GC:292].
- Look chain from the head down (his 163): head = view at once; chest follows on the 0.13 s trunk spring, capped at
  50 deg off the view [ours: the cap is the glance's held end pose, not a lag law, read: S-fp:394]; hips within 45 deg
  and 720 deg/s of the eyes and turned to the travel when moving [read: S-fp:204-205, Valve via the WIP, not opened].
- Feet: today's crossover, shuffle and toe-first backwards, seven dials all ours [read: GP:119-121]; held in the world
  while running straight [read: S-ik:45-49]; L6's lock adds turns, crossovers and stairs.
- Lean: today `3 + 9 x pace` degrees, unsourced [read: GC:175]; replaced by L3 as the feet set outward of the eye's
  plumb line on a bend [read: S-turn:256-258, unmarked there, so ours]. [2nd reader: a gap, [inferred]. The player's
  world does not fall at 9.81: a full jump of 1.2 m in 0.32 s rises under 23.4 m/s^2 and falls at 1.6 times that, 37.5
  (`sim/params.h:59-61`, main 31d1c6d, read; S-trav:268 uses 37.5). Which g the player's lean (and P4's flight row) uses
  is unstated and unsourced; atan(a/9.81) on a body whose world pulls 2.4-3.8 g is not "obeys physics" in that world.]
- `step_clock` landed 3.54 steps/s at 10 m/s against Alexander's 4.39 [read: S-fp:273-274]; he plays both, not watches
  [read: S-fp:275-276]. `arm_style` his own tuning (`player_body-4`) [read: GW:582-583].
- Physics: none during play; the catch and the flip only, later (K1) [read: S-fp:189-190].
- His sprint for reference: "8ms is max speed sprint, then the tac sprint equilivent makes you go 10ms" [read:
  GW:593-594].

**The other kinds, one line each.** Sprinter and charger T3, the back flex: the drawn spine cannot pitch apart from
the hips today, and framing bones differently does not give it; it needs a pitch channel or the new joint the brief
names [read: S-model:247-251]. Pack and crawler T4, `rhythm`: one clock shared by the pack's three bodies [read:
S-gait:284-285] [2nd reader: keying the clock by pack is [ours] at S-gait:285, unmarked here]; E warned T4 "is close to human sprinting" and may read as ordinary [read: GL:161]. Stalker T2. The
dark one: his pick "it wears the hunter's shape as a stand-in" [read: GW:554]; today it has 0 figure slots and is not
drawn [read: GC:212-214].

## 3. What is reused from today's code, and what changes

By file and function, from the code map [read: GC:18-71]. "Keep" means unchanged in purpose.

| file, function | today | in the system |
|---|---|---|
| `game/world/world_app.cpp` `gather_poses` | builds ChaserPose per tick, computes lean = atan(speed x turn / 9.81) and then lets it be overwritten [read: GC:24; S-turn:60-63] | keep; L3 reads the sim's own lateral acceleration from here, since it leads the drawn estimate [read: S-turn:446-449]; add link progress, `scraped`, `wall_recover` as read-only fields [read: S-phys:182-183; S-trav:214] |
| `world_app.cpp` `ease_poses`, `PoseEase` | per-id `DrawnChaser` each tick [read: GC:25-26] | keep the per-id table; add `DrawnState` [read: S-state:185-186]; the stride clock goes BESIDE it in its own table, because `ease_poses` returns early when easing is off and runs on in the Frozen branch [read: S-perf:280-283] |
| `world_app.cpp` `chaser_poses` | lerps the drawn values at alpha [read: GC:27] | keep; lerps the new fields too (phase unwrapped) [read: S-perf:275-277] |
| `game/model_rig.cpp` `DrawnChaser::step` | Overgrowth tilt, Valve yaw and look, chain springs [read: GC:26] | keep the half-lives; L3's lateral target becomes atan(min(|a|, mu g)/g) behind a switch, off until his clip (his 157 "Keep source, fix sway" kept Overgrowth's tilt [read: GW:344-346]) [2nd reader: two gaps against the row above. `step(pos, heading, look_yaw, on_feet, dt)` takes no acceleration and no mu (`game/model_rig.h:321`, main 31d1c6d); it derives its acceleration from drawn positions (`model_rig.cpp:504-509`). So "L3 reads the sim's own lateral acceleration" needs a new argument or a target made outside `step`, and mu has no source (see 2c). Unstated which] |
| `gait_pose` | legs from Fukuchi curves by FK, pelvis, trunk, arms; model-agnostic [read: GC:29, :191-194] | keep as the upright generator; later takes each leg's stance share from the clock [read: S-gait:230-231] |
| `apply_motion` | outside foot 10 cm wider (ours), feet onto the floor probe, chain, hips sink to 0.30 m, legs re-reached [read: GC:30] | gains L3's roll about the feet; the 10 cm "ours" offset is replaced by the roll's own [read: S-unc:262-263]; the feet lock (L6) goes after the chain and L5 [2nd reader: an ordering gap, [inferred]. `apply_motion` runs chain, floor, hip sink and re-reach in one call (`model_rig.cpp:438-475`), and S-mm:165-167 puts L5 in `place_figures` after `gait_pose` returns. For L5 to sit between the chain and L6, either L5 moves inside `apply_motion` or the floor and re-reach move out of it. S-ik:207-209 adds: the sink only lowers the hips, so a locked foot up to 0.20 m off can lie out of reach and `reach_leg` pulls it off its lock] |
| `chain_pose`, `kinetic_chain` | shares about the pelvis, springs [read: GC:114-124] | shares become angles IN SPACE once L3 rolls the whole body, so the trunk is not counted twice (1.89 x theta) [read: S-turn:442-444]; `head_hold` and `head_yaw_share` read from the body file |
| `reach_leg` | two bones, clamp 0.9999 [read: S-ik:36-37] | keep; clamp at full length less 0.015 m [read: S-ik:206] |
| `arm_swing_solved` | 80 bisection steps a frame [read: GC:231-232] | keep; it needs no phase, so it could move to the tick later [read: S-perf:241-242] |
| `Rig::palette` | 18 aims, 4 region frames; pelvis aimed Pelvis-to-Chest with the trunk [read: GC:73-93; S-model:169-173] | pelvis framed by its hips' line, as `game/skeleton.cpp:75-78` already does [read: S-model:181-183]; caller-owned buffers for its three allocations [read: S-run:216-220] |
| `game/world/stage.cpp` `place_figures` | first Hunter gets the model; others are boxes; one `hunter_phase_` summed from frame time [read: GC:34-39] | per-id figures and phases read from the app; the dark one drawn in the hunter's shape [read: S-ship:293-296]; `hunter_phase_` retired |
| `stage.cpp` `take`, `add_model` | load hunter.glb and kid [read: GC:216-221] | one ModelFigure per kind (and LOD) |
| `game/world/figures.h` `kFigureSlots` | 7 values for 8 kinds, so Dark has 0 [read: GC:212-214] | an entry for Dark [2nd reader: no source and not marked [ours]. S-ship:293-296 draws the dark one as the hunter's MODEL figure when no hunter is posed, which needs no box slot; a box slot would draw a 0.5 x 1.8 m box (GR:113)] |
| `game/body.cpp` `Body::pose` | 9 moves blended, inertialized, one yaw for pelvis, chest and head [read: GC:47; S-fp:38-40] | head-first look (the look part of `origin/l188-wip-look` a60944d) [read: S-fp:59-63, :237-243]; later through `kinetic_chain` with the eye pinned [read: S-fp:260-262]; `HandOverride` finally called [read: GP:122-123] |
| `game/ragdoll.{h,cpp}` | 22 kinematic bodies, keyed, drawn by nothing [read: GP:3, :69-71] | one picture world (PictureWorld) holding the active bodies and the level's static shapes, stepped on the tick [read: S-phys:150-157]; E's soft key from his clone [read: GP:75-80] |
| `game/skeleton.{h,cpp}` | rotation tree, 22 joints [read: GC:197-199] | keep; its pelvis rule is the source for the Rig's |
| `model::palette_from_local` | composes local transforms parents-first; used only by tests [read: S-run:42-44] | available when a layer needs local rotations; not in the first laps |
| `game/world/offscreen_models.cpp` `--capture-lean` | 12 frames a second, no manifest, writes look-behind passes that show walls [read: S-auth:82-84] | every tick, a manifest and a pose trace, a refusal to write a pass that hides the subject [read: S-auth:282-312] |
| `tools/yardstick` | legs and arms against recorded runners [read: GL:188-201] | gains `--checks` (the physics checks) and `--trace` (score what the game drew) [read: S-eval:194-195; S-auth:256-257] |
| new `game/motion_checks.{h,cpp}` | none | pure checks over a pose sequence [read: S-eval:189-191] |
| new `game/pose_trace.{h,cpp}` | none | per-frame joints, for clips and the yardstick [read: S-auth:286-288] |
| new `game/body_style.h`, `content/bodies/*.txt` | none | section 2a |
| `art/tools/` | `textures.py` only [read: GR:92-93] | the body pipeline scripts, now only in a temporary folder [read: S-model:42-46; S-auth:93-104]; `bl.js` names a room path and needs it removed first [read: S-auth:436-437] |
| `sim/`, `chase/` | the simulation | nothing, except two read-only additions asked of their owner: the static pieces' shapes for the picture world [read: S-phys:169-172], and a probe that returns the surface normal [read: S-ik:189] [2nd reader: a third is owed if L3 is to be capped for any body but the hunter on l182: a grip per kind, which the chase does not hold (see 2c). That one is not read-only plumbing; it is a value the chase's lane must own] |
| audio mixer | chasers' steps on their own clock from speed [read: S-state:74-76] | read the drawn stride phase (the l192 branch does this from `hunter_phase_`) [read: S-perf:50-54] |

What waits on unlanded branches [read]: `l205-stomp-c` (tip ccc65ab, 900e3c4 an ancestor) edits `gait_pose`'s motion
block [read: S-ik:17-18; GC:345-349], so L3 and L6 build on it after it lands [read: S-ik:299-301]; E's soft key is on a
local clone, not in this repository [read: GP:50-54]; `origin/l192-footsteps` d8f77ba edits the same stage lines as the
stride clock [read: S-perf:287-288]; feet with memory, 55d1451, parked [read: GS:39-41]; the turn law on the l182
branches [read: GL:127-130].

Landed rows that must stay green through every change [read: GC:254-341]: the rig rows (rest identity, posed bones),
the stride and leg rows, the arm rows, the kinetic-chain rows, the DrawnChaser rows, body_tests' camera, glance and feet
rows, the skeleton and ragdoll rows, and the replay checks (self-test part 7; his kept runs byte for byte) [read:
GR:46-53]. One landed row is amended BY NAME, not weakened: the tilt row that pins 1 deg per m/s^2
(`in_a_steady_turn_the_drawn_body_leans_into_it_by_its_centripetal_acceleration`) [read: S-turn:289-290], and only if
he picks L3 on the clip. [2nd reader: the list leaves out the bars S-turn:306-308 names as at risk at the new gain,
rocking (sign flips) and lean rate (300 deg/s), both in
`the_hunters_drawn_lean_eases_into_a_turn_and_does_not_rock_on_a_straight` (`game/tests/world_app_tests.cpp:1028`,
bar at `:1061`, main 31d1c6d, read); and, [inferred], the timing row `the_hunters_lean_peaks_at_or_before_its_turn_does`
(`:1160`), which reads the same drawn lean. Name them here. Also: with the switch off by default every row above stays
green without L3 being exercised at all.]

## 4. How the owner's method is built in

His method: "we get the a good metric for a really human looking sprint which we had, and then we tweak it from there
to look uncanny in a realistic way that obeys physics" [read: GW:545-546]. Built in four steps.

**Step 1, the human baseline, scored.** Every kind first runs as a human at its own leg length, and passes three sets
of rows:
- Human rows, the yardstick's: leg joints rms/sd at most 1 against Fukuchi's runners at 2.5, 3.5, 4.5 m/s; elbow mean
  within 12.4 deg and shoulder ends within 3.7 / 7.0 against 25 CMU clips [read: GL:193-204]. Past 4.5 m/s the legs are
  held by game rows against Dorn's one runner, on the branch only [read: GL:205-206].
- Law rows, new, with no reference needed (`motion_checks`) [read: S-eval:137-146, corrected]:
  - P1 contact: a foot is down when its ankle is within a set height of the probed floor, decided independently of any
    lock (the player's row uses 1 mm and needs at least 6 contacts) [read: S-eval:141; S-ik:468-471]. The band is ours.
  - P2 skate: a foot's horizontal travel over one contact, worst contact, in the world frame; bar 20 mm, from viewers
    seeing slides under about 21 mm (Pražák 2011, abstract only) [read: S-eval:79-85, :142].
  - P3 sink and float: 5 mm (PhysDiff) [read: S-eval:96-99, :143].
  - P4 flight: with no foot down, the pelvis's vertical acceleration is -g within 10% [read: S-eval:144]; it holds by
    construction today, so it guards regressions only [read: S-eval:144].
  - P5 grip: with a foot down, the pelvis's horizontal acceleration over (g + vertical) is at most the kind's mu; this
    inequality is Coulomb and ours, not EDGE's [read: S-eval:145].
  - P6 lengths, P7 joint jumps: the room's landed rows [read: S-eval:146].
  - L1 bank: the drawn foot-to-pelvis line, AND the trunk, within a band of atan(min(a, mu g)/g) on bends above
    3 m/s^2 (band ours) [read: S-unc:303; its second reader's fix at :341].
  - L3 cadence: steps a second within 15% of Alexander's law for the body's own hip height [read: S-unc:307-308].
- What the base cannot be scored on [read: GL:208-221]: above 4.5 m/s, a bend, a stop, a walk, a climb, a sidestep.
  Bands for some exist in open data and can be added as test references, never shipped: Fukuchi 2018 walking (CC BY
  4.0), Reznick 2021 starts and stops (CC0), CMU turns and stops (terms as read) [read: S-eval:115-121; S-data:76].

**Step 2, raise ONE capability per kind; the same laws make the motion** [read: S-unc:185-232; the reading that a
tweak should change what a body can do is the Third Place's, marked by that seat as its own, read: S-unc:61-64]:
- Hunter, T1: grip above human ("Grip above human", his pick) [read: GW:555-556]. The capability lives in the
  simulation's turn law, `min(V_o, sqrt(mu g R))` [read: GL:122]; the picture then MUST draw a lean of atan(a/g), past
  45 deg once mu passes 1, with the stride timing unchanged on the bend, as greyhounds keep theirs [read: S-turn:224-227].
  The lean is the cue made visible, not a second cue [read: S-unc:215-217]. `gait_pose` already keeps the timing by
  construction [read: S-turn:81-82].
- Interceptor and stalker, T2: the head's rotation held (2c). Rotation only, because at speed a translational hold
  lasts about 17 ms in a 0.15 m neck [read: S-unc:218-222, the "50 Hz" corrected there].
- Pack and crawler, T4: step rate held, speed from length. Physics then asks a longer flight: at a jog's 2.8 steps a
  second and 7.4 m/s, about 6.8 cm of rise a step and 2.9 body weights in contact [read: S-unc:223-227; the human
  comparison there is unsourced]. He rejected the bob for the hunter (195), not for the pack; that is his eye's.
- Sprinter and charger, T3: blocked on a pitch channel in the pose (2d).

**Step 3, the check that everything else still scores human** [ours, from S-unc:299-322 and S-eval:171-185]:
- A kind passes when every law row is green, every human row is green, and EXACTLY ONE cue channel is out of the human
  band. Zero out reads human (his 214); two out is two cues, against his "one clear cue" pick [read: S-unc:316-318].
- The mask is checked: it has exactly one entry and never names a law row, so a failing channel cannot be declared the
  cue [read: S-eval:402-405].
- The cue channels: C1 speed held on a bend against the human law at the same radius; C2 head angular velocity in the
  world against the trunk's; C3 trunk sagittal flex per stride; C4 slope of cadence against speed [read: S-unc:313-314].
- Said plainly: the human rows stop at 4.5 m/s and cannot score a bend, while the hunter runs 9-13 m/s, so for the
  hunter "everything else is human" is PARTIAL until Dorn's rows land and run at its own speeds [read: S-unc:315]. C2,
  C3 and C4 have no sourced human band [read: S-unc:315].

**Step 4, his eye.** For each kind, one clip: the human base beside the cue at its sourced default and one more
amount. No table decides elegant or creepy [read: GW:456-461].

**Two cautions the files raise, kept in view.**
- L3 is a law for EVERY body. With it on, the human base also leans further, and the hunter at mu 1.0 may read more
  human, not less; the cue only shows once the simulation's grip passes 1 [read: S-unc:475-479]. So the bend clip shows
  mu 1.0 beside 1.33 and 2.0 at one corner.
- The simulation today turns faster than any grip allows: up to about 2.1 g at 6.5 m/s on main's dials [read:
  S-turn:17-21]. Drawn honestly, the capped lean will lag the path; the row reports the share of frames where the
  simulation asks more than mu g, for the chase's owner. Capping the picture to hide it would draw the "turn way too
  fast keeping speed" he rejected (164) as a lie [read: S-turn:328-329].

## 5. How motion is judged

**The viewer** [read: S-auth:212-227, ours there]: `dz-world --anim-view <case> [--subject <kind>]`, windowed, at the
display's rate. Freeze, single step, quarter speed (ozz's sample framework); step back by re-running the case to the
frame on the same build, the run's own re-run being the reference since 14 of his 16 older kept runs miss their stored
fingerprints [read: S-auth:215-219]. Toggles: skin, the 21 joints as lines, the simulation's root and heading drawn
apart from the body (Holden's debug view), planted feet marked, the physics lean atan(a/g) as a line beside the drawn
hips and trunk, and faint ghosts of the pose before the chain, before the floor and before physics, so a fault shows
which layer made it.

**The standard clip sheet** [read: S-auth:181-245, with its second reader's fixes at :412-422]:
- Cases: a stretch of his newest kept run (a straight and a corner); treadmill at 2.5 / 3.5 / 4.5, 5.20 / 7.00 / 9.49,
  9.0 and 13.4 m/s; a bend of R = 4 m at the kind's law; a stop from 9 m/s; a staircase; a drop. Scripted cases are fed
  through `DrawnChaser::step` at 240 Hz so the easing he sees in play is in the case [read: S-auth:197-198].
- Cameras: SIDE (4 m off, hip height), BEHIND (4 m back, 1.9 m up, FOV 55, today's numbers), FRONT, and LOOK-BEHIND.
  The first three move with the subject's travel and do not turn to track it [read: S-auth:202-206; the Rewind Debugger
  quote there was not readable, so the idea is the scout's].
- Every saved frame at the 1/240 s step, real time and a quarter speed, lit by the game's own light, no grading [read:
  S-auth:242-245]. The engine burns each column's label: commit, body file, case, speed, camera, tick.
- Gates before a sheet is made, each printed: same run and camera and step in every column; the subject's chest in
  view in at least 90% of frames AND at least the follow passes and one look-behind written AND the chest's screen
  height and lit share printed, so "written nothing" or "a dot 30 m off" cannot pass [read: S-auth:413-417]; no dark
  start; the "before" column's commit is main's tip or it reads OLDER BASE. This is his ruling after item 216 made
  mechanical [read: GR:159-161].

**The measures a seat prints without watching** [read: S-auth:249-259]: pelvis rise and fall per stride in mm (his
195); hips, trunk and head bank against atan(a/g) (his 214, 217); worst joint move in one frame; a planted foot's slide
in mm; steps a second against the law; the largest joint distance between base and change columns (near 0 means the
change never reached the picture).

**Why numbers do not decide the look** [read: S-eval:60-69]: in a study of generated motion, the best hand-made
measure picked the viewers' choice in about 72% of pairs on average (chance 50%), better for walking on some measures;
the clips were text-to-motion, not game locomotion. Numbers catch defects; his eye judges.

**The rows, by layer** (each red first on a case of his, per the room's rule; red values are inferred, not run):

| layer | row | bar | red today because | guards against the cheap pass |
|---|---|---|---|---|
| L1 | `the_drawn_stride_is_the_same_at_144_240_and_360_frames_a_second` and `paused_the_drawn_legs_stand_still` [read: S-perf:289-296] | 1e-6 of a tick at shared instants | phase summed from frame time [read: GC:34-36] | sample mid-tick too (1/48 s offsets); check the palette reads the new phase; phase moves at least 1 rad; frame times by cumulative rounding [read: S-perf:394-404] |
| L6 | `a_planted_foot_of_the_drawn_hunter_stays_where_it_landed` [read: S-ik:311-316; S-eval:221-226] | P2 20 mm, P3 5 mm | the stance foot is rebuilt from curves each frame; by arithmetic it slides about 0.12-0.50 m a step on guessed limb lengths [read: S-eval:245-251] | contact decided by height, not by the lock's flag; at least N contacts, some at a turn rate; ankle and ball; world frame; a flat-floor height bar [read: S-ik:468-480; S-eval:376-388] |
| L3 | `on_a_bend_the_hunters_whole_body_leans_as_far_as_its_turn_asks` [read: S-turn:293-305] | median ratio 0.75-1.05 (ours) | feet under the hips; ratio under 0.2 by arithmetic [read: S-turn:301-302] | gate the trunk-to-body ratio and the lean's lead too, so a sideways shift or splayed feet cannot pass [read: S-turn:426-438] |
| L8 | `the_pelvis_bone_banks_with_its_hips_line_not_with_the_trunk` [read: S-model:332-334] | 20 +-1 deg on a 20 deg bank | pelvis bone rides the trunk's 0.35 [read: S-model:169-173] | measure skinned waist vertices against the hips, since a ratio of the bone to its own frame is true by construction [read: S-model:339-342] |
| L5 | `when_the_chase_stops_the_hunter_dead_at_a_wall_no_joint_jumps` [read: S-mm:225-230] | ours: 3 x speed x dt + 0.025 m a tick [read: S-mm:228] | the stage poses from speed with no memory [read: S-mm:216-220] | add per-joint velocity across the switch and a planted foot's slide, so a slew limiter or a low-passed speed cannot pass [read: S-mm:356-363] |
| L5 | drawn state Air holds the stride on a drop [read: S-state:326-332] | ankles apart by half a step | the hunter is drawn standing through a drop [read: S-state:313-315] | compare with the last Mesh pose; check after the floor snap [read: S-state:436-441] |
| L4 | `at_a_run_the_head_turns_about_a_quarter_as_far_as_the_shoulders` [read: S-head:256-258] | 0.12-0.39 at 3.0 m/s | 0.55 by construction | one speed at half amplitude: only his eye decides 9 m/s [read: S-head:394-396] |
| L7 | no elbow, wrist, hand or head more than 1 cm inside the level's static shapes, his kept runs [read: S-phys:262-266] | 1 cm | arms meet no walls; premise unmeasured | segment samples, a near-wall frame count, a check the static set matches the simulation's [read: S-phys:386-398] |
| player | `on_a_sideways_look_the_head_turns_first_then_the_chest_then_the_hips` [read: S-fp:246-251] | peak order, chest at most 50 deg off | one yaw drives all three [read: S-fp:38-40] | render-side check of the shoulders against the picture; only his eye on 163 and 147 [read: S-fp:385-390] |

## 6. Cost: per character and per scene against a 3.33 ms frame

**The budget** [read: GR:12-31]: 360 frames a second the aim, a solid 300 the floor, so a 3.33 ms frame; the default
frame's p99 is 1.99-2.09 ms; about 1.2 ms of p99 room is the ground's inference. That room may already be net of the
two models' cost if the bench that measured it drew them [read: S-perf:31-34]; not checked.

**CPU, one body, counted by reading; nothing here was ever timed** [read: GP:259; S-perf:226-242]:

| layer | runs | estimate [inferred] |
|---|---|---|
| L1 `DrawnChaser` + chain springs + clock + `DrawnState` | per tick | under 1.5 us a tick [read: S-perf:231-232; S-state:304] |
| L2 `gait_pose` legs and FK | per frame | 2-5 us [read: S-perf:234] |
| `arm_swing_solved`, 80 bisection steps | per frame | 3-8 us [read: S-perf:233] |
| L3 roll about the feet | per frame | under 1 us [read: S-turn:276-279] |
| L4 chain, head layer | per frame | under 2 us [read: S-head:246-249] |
| L5 offset decay, 24 points | per frame | under 1 us [read: S-mm:171-172] |
| L6 lock bookkeeping; floor probes | per frame | under 1 us; 2-4 Jolt rays, 1-3 us each assumed [read: S-ik:257-263] |
| L8 `Rig::palette` | per frame | 1-3 us [read: S-perf:236] |
| player `Body::pose` | per tick | 5-15 us [read: S-perf:238] |

So a full-detail chaser without physics is about 10-25 us a frame [read: S-perf:240]. Against 3.33 ms that is under
1% a body.

**Picture physics (L7)** is not known. The only figure is a lower bound from Jolt's own pile benchmark, at least about
76 us per ragdoll per step in piles of touching motor-driven ragdolls, from a chart mixed with another [read:
S-perf:113-122, DOWNGRADED there]. One world stepped on the tick is 0.67 steps a frame at 360 and 1.67 at 144 [read:
S-perf:184]. By that bound four active bodies cost at least about 0.2 ms a frame [read: S-perf:257]. The solver
iterations (30/10, carried over from the motors) are the main lever and are unmeasured for the soft key [read:
S-phys:205-206]. [2nd reader: DOWNGRADED twice. (1) "Lower bound" is the wrong word for this game: the 76 us comes from
piles of 160 touching, motor-driven ragdolls on 2017-21 CPUs (S-perf:118-122); soft-keyed bodies with few contacts may
cost less, and 30/10 iterations against the benchmark's settings may cost more. It is a figure from another scene,
neither floor nor ceiling, so "at least 0.2 ms" is unsupported. (2) "The main lever" is [inferred], unmarked. Not
priced: 1.67 steps a frame at 144 and up to 12 after a 50 ms hitch, with no catch-up cap named (S-phys:418-419), and one
single-threaded job system for the whole world (S-phys:424).]

**GPU.** Two full models measured +0.39 ms average and +0.48 ms p99 [read: GR:24-27]. A cost per skinned vertex from
that one measure is not shown: the vertex count was inferred and the 0.32 ms top-level pass also holds refits and one
rebuild in turn [read: S-perf:3-7]. Using it anyway as a guide [inferred]: about 1.2-1.5 ns a skinned vertex.

**One scene** (hunter + player + 2 nearest lesser in full + 4 lesser light) [read: S-perf:249-257, with its second
reader's units fixed]: [2nd reader: DOWNGRADED as the case to plan for. His pick is two or three bodies in full in all
(S-perf:203), and the slots allow "the director's most (eight lesser bodies)" (`game/world/figures.h:27`, main 31d1c6d,
read), so six lesser is not the worst case: two more light bodies add about 30k vertices and 20 us [inferred].]

| | CPU a frame | GPU a frame |
|---|---|---|
| poses, all 8 bodies | about 0.13 ms [inferred] | — |
| picture physics, 4 active | at least about 0.2 ms, unknown above [inferred] | — |
| skinning and refit, 446k vertices if lesser bodies are 60k full and 15k light | — | about 0.54 ms average, about 0.8 ms p99 [inferred] |

That is roughly 1.1 ms of the ~1.2 ms room before any other feature he turns on, and it rests on two guesses. [2nd
reader: DOWNGRADED, [inferred]. The sum adds CPU milliseconds to GPU p99 milliseconds against one frame-time room; they
add only if the two serialize, which nobody checked. And 266k of the 446k vertices are the hunter and the kid, likely
already inside the 1.99-2.09 ms default frame (this section's own caveat), so the GPU line may count them twice.] So
[ours]: lesser models are built near 60k skinned vertices in full and 15k light [read: S-perf:259-261]; and two
measurements are taken by a landing seat with `--bench` on a quiet machine before a third posed body lands: E's R4.7
(the picture physics per key and read) [read: GP:195], and one GPU bench with three or more posed models [read:
S-perf:327-328]. If either is over, physics drops first, then probes, then mesh detail; the clocks never drop [read:
S-perf:218-221].

## 7. Licences: what the system would USE as code or data

I read no licence text myself for this file. Each line is the scout's read of the licence text, checked by that scout's
second reader where the cite says so; none of this is legal advice.

**Used as code or as shipped content:**

| thing | use | licence, as read | commercial | attribution / notices | share-alike | redistribution |
|---|---|---|---|---|---|---|
| Jolt Physics v5.6.0 | already linked and shipped; the picture world | MIT, `third_party/JoltPhysics/LICENSE` [read: S-phys:64-66; S-perf:101-102] | yes | keep the notice; CREDITS.md names it | no | yes |
| Dear ImGui 1.92.9 | already vendored; the viewer and editor (development only) [2nd reader: ImGui itself is not development only: `world/hud.cpp` is built into the game (`game/CMakeLists.txt:101`, main 31d1c6d, read), so it ships. `CREDITS.md` does not name it (grep, 0 hits), so "keep the notice" is unmet today; a gap before this design, not made by it] | MIT [read: S-auth:131-132] | yes | keep the notice | no | yes |
| MakeHuman / MPFB core assets (base mesh, `game_engine` rig, weights, targets) baked into every GLB | shipped inside the models | CC0 1.0 (MPFB `LICENSE.md` and `LICENSE.ASSETS.md`; makehumancommunity.org licence page) [read: S-model:52-64] | yes | none required | no | yes; the "output" line is the team's opinion, CC0 does not waive patents or trademarks, and clothes or hair not bundled with MPFB are not covered [read: S-model:61-64] |
| MPFB code | Blender add-on, a tool | GPL-3.0-or-later [read: S-model:65-66] | tool only, never shipped | if the scripts that import it are published, GPL terms apply [read: S-model:65-66] | — | — |
| Blender 5.2.3 | offline tool, his yes for Python in Blender | GPL; "The GPL only applies to the Blender application and not the artwork you create with it" [read: S-auth:123, :133-134] | tool only | — | — | — |
| ffmpeg (`ffmpeg-static`) | offline clip encoding | GPL-3.0-or-later by its npm metadata, licence text unread [read: S-auth:138-140] | never shipped | — | — | — |

**Used as data, but only as numbers fitted into code, never shipped as recordings** (the room's rule: "Learn from, never
use" [read: GR:182-184]):

| source | in the system | licence, as read |
|---|---|---|
| Fukuchi 2017 running | the leg curves (landed) and the yardstick's bands | CC BY 4.0, figshare field [read: GL:229] |
| Dorn, Schache & Pandy 2012, SimTK runningspeeds | legs past 4.5 m/s, hips (branch) | MIT, "Copyright (c) 2012, Stanford University" [read: GL:232] |
| Verniba 2017 | landing knee law | CC BY 4.0, the article's licence line [read: S-trav:187] |
| Churchill 2011 (ISBS) | trunk bank share 0.89 | authors keep copyright, no open licence: cite the numbers [read: S-turn:95-97] |
| Pontzer 2009 (Harvard DASH) | head yaw share | "Other Posted Material (LAA)", not open [read: S-head:72-73] |
| Spoor & Belterman 1986 | the `stalk` row | no licence stated in the PDF [read: S-gait:71-72] |
| Bruening 2020, Otsuka 2016, Perpiñá-Martínez 2023, Ford 2013 | arms, twist (landed) | none recorded [read: GS:199] |
| CMU Graphics Lab mocap | test reference only (yardstick arms; turns and stops later) | "free for all uses"; "may be copied, modified, or redistributed without permission"; "you may not resell this data directly, even in converted form"; credit asked [read: S-data:51-59, live pages per its second reader] |
| Fukuchi 2018 walking; Reznick 2021 | test references, later | CC BY 4.0; CC0 1.0 [read: S-eval:117-118] |
| 100STYLE | test reference only if a BVH reader is built; shipping it would need his ruling | CC BY 4.0, credit "The 100STYLE Dataset - Ian Mason" [read: S-data:74] |

[inferred] Fitted constants carry facts, not text; ~~the room's practice is a source comment and a CREDITS.md line for
CC BY sources, which this design keeps.~~ [2nd reader: WRONG as a description of practice. `CREDITS.md` (85 lines, main
31d1c6d) names no animation source: grep for Fukuchi, Dorn, Bruening, Alexander, Overgrowth, ozz, Holden and "CC BY"
finds 0 hits, though Fukuchi 2017 (CC BY 4.0) is fitted into main's legs. The practice is a source comment only. A
CREDITS line for each CC BY source is a step to ADD, [ours].]

**Ideas only, no code copied** (restated in the game's own C++ with a source comment, as the tilt was [read: S-og:52-53]):
Overgrowth (Apache-2.0; its animations are not open) [read: S-og:46-51]; ozz-animation, Godot, Bevy (MIT; MIT or
Apache-2.0) [read: S-run:50-52, :86-87, :115-118]; Holden's Motion-Matching and Spring-It-On (MIT; their bundled LAFAN1
data is CC BY-NC-ND and never usable) [read: S-mm:85-88] [2nd reader: DOWNGRADED. S-mm:85-88 reads Motion-Matching's
LICENSE and README only; Spring-It-On's MIT is the record's (GR:177), and the LAFAN1 line is Motion-Matching's README]; ALS-Community (MIT) [read: S-ik:150-156]; Google Cardboard's
neck model (Apache-2.0) [read: S-fp:105-108]; Godot XR Tools (MIT) [read: S-fp:119-121]; Valve's Source SDK 2013 (study
only: its licence covers modified Valve games) [read: GS:94-96]; the papers and talks (Clavet, LMM, Bollo, Wang, Lasseter,
Perlin, Gao and Scholl, Kalisiak, Hecker, Trico, TLOU2) as ideas [read: S-mm:50-53; S-state:84-172; S-ship:52-57].

**Look only, never measured into a number:** LAFAN1, Bandai Namco (CC BY-NC 4.0), AMASS, SFU, the MANN dog data, 3DDogs,
PFERD, KIT [read: S-data:112-117, with its second reader's corrections].

## 8. What the system does not do, and what was left out

**It does not:** move the simulation; decide when a chaser stalks, rises, cuts off or searches (the chase's lane)
[read: S-state:363-364]; draw a picture behind the simulation to buy foresight [read: S-state:361-362]; add a duration
the chase does not own [read: S-state:367-368]; give any kind a second cue; ship any recording.

**Left out, with the reason:**
- Runtime motion matching or Learned Motion Matching: no lawful data at the hunter's speeds for whole bodies, it cannot
  make motion its data lacks, its patches give churn or foot slide [read: S-mm:135-149], and LMM costs 197 us a body a
  frame [read: S-mm:74-76]. Its matching cost is kept as a possible offline instrument only [read: S-mm:179-198].
- Clips, blend trees, a state-machine graph or a pose editor: clips are out by his pick, and a graph's gift is
  cross-fading clips [read: GS:187; S-state:354-357; S-auth:336-339].
- Physics-balanced running, swing-twist motors to follow a run: shipped games keep running kinematic; the motors
  stopped red [read: S-phys:287-290].
- ozz, Godot or Bevy linked as a library; SoA or SIMD poses: item 150, no clips, 22 joints [read: S-run:309-315].
- A hard angular-speed cap (Godot's): the room removed its caps [read: S-run:316-317].
- Reduced-rate posing or a dynamic budget allocator: world-space palettes lose pixel history, and a throttle that reads
  machine load makes two machines draw one replay differently [read: S-perf:312-315].
- The cartoon filter as exaggeration: its anticipation needs the future, and A = 3 is cartoon [read: S-state:359-360].
- Uniform "slightly off" motion, a reaction-time cue, limbs that change length, a per-kind uncanny dial in the
  picture, a "creepy" score [read: S-unc:376-385].
- Whole-body style deltas from 100STYLE (Zombie, Cat) on lesser kinds: they run against the one-clear-cue finding and
  his one-cue picks, and the delta method is unsourced [read: S-data:329-335].
- A translational head hold at speed [read: S-head:289-290]; Overgrowth's unseeded random shake [read: S-head:291-292].
- Learned critics, FID, a jerk or SPARC gate over a whole gait [read: S-eval:286-295].
- Unreal's first-person scale trick and a second shadow-only body: the scaled body leaves the ray-traced world, and the
  game's ray masks already give one mesh both jobs [read: S-fp:282-285]. The camera parented to the head during play
  [read: S-fp:289-290].
- Jacobian or CCD IK; warm-started iterative IK; foot pitch from the hit normal on stairs; a swept-sphere probe in the
  simulation for now [read: S-ik:344-352].
- A hang or shimmy on ledges, collision rungs, door animation: the simulation has none of them; the ladder is one flat
  board with no rungs [read: S-trav:424-429; S-ik:239-243].
- A spine flex for the hunter; more than four limbs; a mass input to the gait [read: S-gait:406-409].
- A root allowance (drawing the body off the simulation's place): off; TLOU2's 0.3-0.6 m bounds an animation-driven body,
  which this game does not have [read: S-ship:461-462].
- Proportions that change at run time; more than four bone influences [read: S-model:368-370].

**Considered and kept small, marked [ours], for his eye or a later row:** the 50 deg chest-lag cap; the bank switch off
by default; the trunk and head shares in space; `head_hold`'s re-fix; the stride clock's own table; the body file's mark
pairs; the 0.8 and 90% clip gates; the landing law above 0.44 m (faded in, never a flat cap from a 0.02 m stair) [read:
S-trav:282-284]; the stalk's switch point and crouched hip height, both unsourced [read: S-gait:270-281]; the rise from
the stalk, whose one read mechanism describes lizards with their mass behind the hips, the opposite of the hunter's
[read: S-gait:306-312].

**Open, for him or another seat, not decided here:** whether L3 replaces Overgrowth's tilt gain at all (157); the grip
amount (1.0, 1.33, 2.0) and the turn law itself (the chase's lane) [read: GL:127-135]; whether the pack climbs (his
pick "Only crawler and pack" against the code, which lets only the crawler climb) [read: S-trav:86-89]; item 205's
return to stealth once the player runs out of sight, which has no drawn state yet [read: S-state:452-454].

## What I did not open

- Every primary source behind the swarm files (papers, code, licence texts, pages): this file rests on the ground and
  scout files as their second readers left them. The one exception is the brief at lines 1585-1615, opened to quote
  item 218 by its line.
- The game's code on any branch, the GLBs, the kept runs, E's clone, the worktrees: every code claim here is a file in
  this folder's reading of it.
- `animation-system.workflow.js` beyond its first 40 lines and the lines naming the output files;
  `loop/plan_animation_system_swarm_2026-11-13.md`; the build-path file being written beside this one.
- The hand-backs and plans the ground files cite; `third_place/`.
- Nothing was built, run or timed. Every cost is a count or a guess, and is marked so.

## Second reader

1. 135 checks over sections 2, 3, 6 and 7: OK 110, WRONG 2, UNSUPPORTED 2, DOWNGRADED 21. Corrections are in place above.
2. WRONG: "the simulation's per-kind turn law" holds the grip (one `grip_mu`, H2 only, branch only); and "the room's
   practice is a CREDITS.md line for CC BY sources" (CREDITS.md names no animation source).
3. The one gap that blocks a lap: L3's cap needs a mu the chase does not hold for any lesser kind, nor for anyone on main.
4. Two body-file knobs (`landing_dip`, `step_clock`) are the camera's own settings; they break 1's "camera untouched".
5. Nothing in the design writes the simulation; three items touch the sim's code or lane, named below. Cost 6 sums CPU
   and GPU and quotes a "lower bound" taken from another scene.

Second reader, 2026-11-13, read-only. Marks as the file's. Game code opened at dreamzone-3 main 31d1c6d with `awk`,
`grep` and `git grep`/`git show` on `origin/l182-hawk`, `origin/l192-footsteps`, `l205-stomp-c` (tip ccc65ab, 900e3c4 an
ancestor: `git merge-base --is-ancestor`). Every scout line was read in its file as its own second reader left it.
Nothing built or run; no outside request was made.

### What I checked

OK rows are grouped; every non-OK row stands alone. "Code" means I opened the game file at the line.

| # | section, claim | opened | verdict | evidence |
|---|---|---|---|---|
| 1-3, 6 | 2a: table and defaults; overrides only; `#` cut; F5 keeps old values; overlay editor | S-auth:64-70, :158-170; code `textfile.h:25`, `world_app.cpp:247-249`, `hud.cpp:525-541`, `params_table.cpp:30-43` | OK x4 | as stated; the hud editor edits the world table (S-auth:377) |
| 4 | 2a: "makes item 153 a parse error" | S-auth:178-179, :431 | DOWNGRADED | unmarked inference; any "by eye" mark passes |
| 5 | 2a: refuses sim and dial names | S-auth:171-173 | OK | proposal as cited; gaps noted in place |
| 7-8, 11-17, 19-20 | 2b: stride law; legs to 4.5; twist 6.5/14.28; look spread; Valve rates; tilt half-lives and 0 off feet; springs 0.13/0.22; Holden lock and y = 0; buffer 0.015; landing knee law; Overgrowth crouch | GL:69-74, :90-95; GS:34-38, :57-59, :103-108, :208-209; GC:119; S-head:328; S-ik:134-148; S-trav:180-188, :272-286; S-og:89-92, :313-317; code `model_rig.h:140-143`, `:293-295`, `:325-329`, `model_rig.cpp:507-514` | OK x11 | values match code and files |
| 9 | 2b: hips "by two laws" sourced to Dorn | GL:101-108 | DOWNGRADED | Blickhan, McMahon & Cheng in a comment; blend and hold ours |
| 10 | 2b: arms Bruening, Froude-scaled | GL:141-142 | DOWNGRADED | ours past F 1.36; hunter near F 3.4 |
| 18 | 2b: transition half-life, Holden | S-mm:159-161, :170, :365 | DOWNGRADED | position decay and gait trigger are ours, unmarked |
| 21 | 2b: climb timing as a shared law | S-trav:121-123; S-ik:238, :241; this file's 8 | DOWNGRADED | a ledge shimmy, which 8 leaves out; no rungs |
| 22-24, 26-29, 31-33 | 2c: model, anchor, `biped_run`/`stalk`, cue, `trunk_bank`, `head_bank`, `head_yaw_share`, `arm_style`, `take_off_knee`, `soft_tau` | GR:58-66; S-fp:169-179; S-gait:247-258; GW:413-418, :468-470; S-turn:1-8, :111-114; GC:117; S-head:14-16, :43-44, :74-75; GL:111-112; GP:90, :192 | OK x10 | as stated, downgrades carried |
| 25 | 2c: `rhythm` from Full & Tu | S-gait:251, :283-285 | DOWNGRADED | the rule is ours there |
| 30 | 2c: `head_hold` re-fix | S-head:199, :219 | DOWNGRADED | composition ours, unmarked in 2c |
| 34 | 2c: `landing_dip` knob | S-trav:108-109; code `settings.h:45-48` | DOWNGRADED | value OK; a camera setting, not a body knob |
| 35 | 2c: `step_clock` knob | S-fp:273-276; code `settings.h:52` | DOWNGRADED | numbers OK (4.40 by hand); the camera's `stride_rate` |
| 36 | 2c: `tier`, lesser by rank | S-perf:198-221, :203 | DOWNGRADED | his pick is two or three in full, in all |
| 37 | 2c: mu is "the simulation's per-kind turn law" | GL:127-130; S-unc:271-273; `git grep` origin/l182-hawk `chase/speed.h:40-41`, `chase/run.cpp:309`; main none | WRONG | one `grip_mu`, H2 only; lesser kinds H1 |
| 38-39, 41-46, 48-54, 56-59, 61-62 | 2d: hunter body and limbs; stride 2.46 m, 3.67/s; bank 45/53/63 and 1.31; speeds; interceptor box, sheet, stand-in, 7.2 m/s; T2 rotation only; no T2 band; kid body; eye anchor and camera row; look chain; feet; lean `3 + 9 x pace`; arms; physics none; his sprint words; T3 pitch; E's T4 warning; dark one | GR:62-63, :86-87, :111-114; S-gait:182-191; S-model:140, :222, :228-229, :247-251, :431; S-turn:135-136, :228-232; GL:76, :161, :178-179; S-head:219-223, :282-283; S-unc:313-315; GC:59, :175, :180, :212-214, :292; S-fp:189-190, :204-205, :394; GP:119-121; S-ik:45-49; GW:554, :582-583, :593-594; code `body.cpp:338`; stride by hand | OK x21 | as stated |
| 40 | 2d: "its head stays humanlike" in quotes | GL:62-63 | DOWNGRADED | the brief's record, not his words |
| 47 | 2d: interceptor grip mu 1.0 | S-turn:267; the 2c finding | UNSUPPORTED | a picture `mu_draw`, inferred; the chase has none |
| 60 | 2d: one clock for the pack | S-gait:284-285 | DOWNGRADED | ours there, unmarked here |
| 63-67, 69, 71-76, 78-88, 90 | 3: `gather_poses` lean and overwrite; new read-only fields; `ease_poses` early return and Frozen run; `chaser_poses`; `gait_pose`; chain 1.89 theta; `reach_leg` 0.9999; arm solve 80 steps; Rig aims, pelvis aim, skeleton rule, three allocations; `place_figures` and one `hunter_phase_`; `take`/`add_model`; `Body::pose` one yaw, WIP look a60944d, `HandOverride` unset; ragdoll 22 kinematic, picture world; skeleton; `palette_from_local` test-only; capture-lean 12 a second; yardstick flags; new modules; art/tools; sim row; mixer seeded by id and l192 phase; branch tips; tilt row at :510 | GC:24-47, :73-93, :114-124, :191-199, :212-221, :231-232, :254-349; S-turn:60-63, :289-290, :442-449; S-phys:150-157, :169-172, :182-183; S-trav:214; S-perf:50-54, :241-242, :275-288; S-state:74-76, :185-186; S-gait:230-231; S-ik:17-18, :36-37, :189, :206, :299-301; S-model:42-46, :169-183; S-run:42-44, :216-220; S-ship:293-296; S-fp:38-40, :59-63, :237-243, :260-262; GP:3, :50-54, :69-80, :122-123; GS:39-41; GL:127-130, :188-201; S-auth:82-84, :93-104, :256-257, :282-312, :436-437; S-eval:189-195; code `world_app.cpp:528-588`, `:733-745`, `model_rig.cpp:242-250`, `:322-376`, `:394-409`, `:601-642`, `skeleton.cpp:75-78`, `stage.cpp:256-317`, `figures.h:28`, `body.cpp:225-230`, `body.h:93-113`, `model.h:92-94`, `offscreen_models.cpp:29`, `:466`, `yardstick/main.cpp:330-335`, `mixer.cpp:280-281`, `ls art/tools`, `git rev-parse` of the branches, `git grep hunter_phase_ origin/l192-footsteps` | OK x24 | each file and function exists and does what is said |
| 68 | 3: `DrawnChaser::step` takes L3's target | code `model_rig.h:321`, `model_rig.cpp:504-509` | DOWNGRADED | no accel or mu argument; conflicts with the row above |
| 70 | 3: L6 "after the chain and L5" inside `apply_motion` | code `model_rig.cpp:438-475`; S-mm:165-167; S-ik:207-209 | DOWNGRADED | L5 sits outside `apply_motion` as planned |
| 77 | 3: "an entry for Dark" in `kFigureSlots` | S-ship:293-296; GR:113 | UNSUPPORTED | no source; S-ship uses the model figure |
| 89 | 3: landed rows that must stay green | S-turn:306-308; code `world_app_tests.cpp:1028`, `:1061`, `:1160` | DOWNGRADED | at-risk rocking and rate rows not named |
| 91-102, 105-106, 108, 110 | 6: budget and room; room net of models; CPU rows L1-L8 and player; 10-25 us; GPU +0.39/+0.48; per-vertex not shown; scene arithmetic; 60k/15k, two measurements, drop order | GR:12-31; S-perf:3-7, :31-34, :218-221, :226-242, :249-261, :327-328; S-state:304; S-turn:276-279; S-head:246-249; S-mm:171-172; S-ik:257-263; GP:195, :259; arithmetic | OK x16 | as stated |
| 103 | 6: physics "at least" 76 us a ragdoll, 0.2 ms | S-perf:113-122, :257 | DOWNGRADED | another scene; not a bound either way |
| 104 | 6: solver iterations "the main lever" | S-phys:205-206 | DOWNGRADED | unmarked inference; catch-up steps unpriced |
| 107 | 6: the one scene (2 lesser full + 4 light) | S-perf:203; code `figures.h:27` | DOWNGRADED | his pick 2-3 full in all; up to 8 lesser |
| 109 | 6: "1.1 ms of the ~1.2 ms room" | S-perf:31-34, :257 | DOWNGRADED | CPU plus GPU summed; models maybe counted twice |
| 111, 113-127, 129-130, 132-136 | 7: Jolt; MPFB assets CC0 and code GPL; Blender; ffmpeg-static; learn-from rule; Fukuchi 2017; Dorn; Verniba; Churchill; Pontzer; Spoor; Bruening group; CMU; Fukuchi 2018 and Reznick; 100STYLE; Overgrowth; ozz, Godot, Bevy; ALS; Cardboard; Godot XR; Valve; papers as ideas; look-only list | S-phys:64-66; S-perf:101-102; S-model:52-66; S-auth:123, :131-140; GR:182-184; GL:229, :232; S-trav:187; S-turn:95-97; S-head:72-73; S-gait:71-72; GS:94-96, :199; S-data:51-59, :74, :112-117; S-eval:117-118; S-og:46-53; S-run:50-52, :86-87, :115-118; S-ik:150-156; S-fp:105-108, :119-121; S-mm:50-53; S-ship:52-57; code `third_party/JoltPhysics/LICENSE:1`, `CREDITS.md:7-8`, `:29` | OK x23 | as each scout read the licence text |
| 112 | 7: Dear ImGui "development only" | code `game/CMakeLists.txt:101`, `render/third_party/imgui/LICENSE.txt:1-3`, `imgui.h:32`; grep `CREDITS.md` | DOWNGRADED | ships in the game; CREDITS.md lacks it |
| 128 | 7: "the room's practice is ... a CREDITS.md line" | grep `CREDITS.md` (85 lines) | WRONG | 0 animation sources; Fukuchi on main uncredited |
| 131 | 7: Holden MM and Spring-It-On, "their" LAFAN1 | S-mm:85-88; GR:177 | DOWNGRADED | Spring-It-On read only by the record |

**Tally: 135 checks. OK 110, WRONG 2, UNSUPPORTED 2, DOWNGRADED 21.** (Row 55, the player's `step_clock`, is folded into
row 35.)

### Mechanisms with no source that are not marked [ours]

1. L3 turns the WHOLE body about the feet, so the pelvis takes 1.0 of the lean. Physics fixes only the foot-to-centre-
   of-mass line; the pelvis share has no measured source (S-turn:116-118, :222). Section 1, L3.
2. L5's trigger ("a change of drawn state, or a speed the chase snaps in one tick") and its decay of joint POSITIONS in
   the pelvis frame (S-mm:159-161, :365). Sections 1 and 2b.
3. `head_hold`'s re-fix by one eased turn, in 2c (marked only in 2d).
4. The `rhythm` rule, step rate held and speed from length (S-gait:283-284), cited to Full & Tu as if sourced.
5. One stride clock shared by the pack's three bodies (S-gait:285).
6. Overgrowth's ledge-shimmy timing used for vertical climbs and ladders (2b).
7. A box slot for the dark one in `kFigureSlots` (3).
8. "That makes item 153 a parse error" (2a).
9. g = 9.81 for the player's lean and flight rows, in a world whose own gravity is 23.4 rising and 37.5 falling
   (`sim/params.h:59-61`); the choice is unmade and unsourced (2d, section 4 P4).
10. "The solver iterations ... are the main lever" (6).

### Where the design asks animation to change the simulation

No line asks the picture to write simulation state. `chase/` and `sim/` reference no audio (a case-blind `git grep -l`
for "audio/" or "mixer" over them on main: no file), so footfalls from the drawn phase cannot reach the chase. Three
items touch the simulation's code or lane, and should be named as such:
- A read-only accessor in `sim/physics` for the static pieces' shapes, shared into the picture world (3). [inferred]
  Sharing a Jolt Shape bumps its reference count, a write to a sim-owned object; harmless while the shapes are immutable.
- A floor probe that also returns the surface normal, a `sim/` addition (3).
- A grip per kind for L3's cap, which no simulation code holds (2c note). This is not plumbing: it is a value the chase
  must own, and on main it would be new chase state.
Also [inferred]: the stride clock, `DrawnState` and the picture world step inside `WorldApp`'s tick function; they hold
no sim state, but a throw or a slow step there stalls the simulation's own tick.

### The simplest way a builder could satisfy each stated check without doing what it is for

- 2a, "the reader refuses an override without its mark": the editor writes "ours by eye <date>" on every save (S-auth:179
  plans exactly that), and any text passes. Fix: a mark must be "ours ..." or name a key in the code table's `source`.
- 2a, "refuses any name the simulation or the dials define": a hand-typed list of a few names. Fix: build it from the
  X-macro tables and test that every `sim/params.h` and dial name is refused.
- 2b, "the SOURCE of each default lives in that code table": any non-empty string passes. Fix: review reads it; a test
  that each `source` is "ours" or names a file in the room's research.
- 3, "landed rows must stay green": L3 is behind a switch, off by default, so every row is green with L3 never run. Fix:
  the lap also runs the named rows with the switch on and prints them.
- 3, "the tilt row is amended BY NAME, not weakened": amend its bar to whatever L3 draws. Fix: register the new value
  first (45 +- 2 deg at 7 m/s on 5 m with mu 1.0, S-turn:289-290).
- 6, "two measurements before a third posed body lands": time R4.7 as E built it, one ragdoll in its own world, per
  `key()` and `read()` (GP:265), not N bodies in one world on the tick; and bench "three posed models" with the third off
  screen or light. Fix: name the case: hunter, player and one lesser in view at full detail, his card, p99 against the
  same build without the third; R4.7 on the picture world with the active set at four.
- 6, "physics drops first, then probes, then mesh detail": nothing measures the budget at run time, so the order never
  fires. Fix: it is a build-time rule; say so, and tie it to the two measurements.
- 7, licences: a CREDITS line with a name only. Fix: the existing Jolt line's form (name, licence, URL).
- Section 5's rows carry their own guards; I add one for L3: rolling only the joint positions while leaving the chain's
  shares relative draws the trunk at 1.89 theta and still passes a "foot-to-pelvis AND trunk within a band" row if the
  band is wide. Fix: the trunk's bar is 0.89 +- a stated amount of the body's lean, in space.

### Parts a builder can start from as written

- The one picture clock for the stride, in its own per-id table beside `PoseEase`, with the rows and guards of 5 (L1).
- The pelvis framed by its hips' line in `Rig::palette`, with the skinned-vertex row of 5 (L8); caller-owned palette
  buffers.
- `reach_leg` clamped at full length less 0.015 m.
- The capture fixes: every tick, a manifest, a pose trace, and the refusal with its companion row (5).
- `motion_checks` P1-P3 and P6-P7 as a pure test module, with 5's guards.
- The read-only `ChaserPose` fields (`scraped`, `wall_recover`, link progress).
- The player's head-first look from a60944d's look part, with 5's render-side check.
- The hunter's foot lock on flat floors, after l205-stomp-c lands, with S-ik:207-209's reach note in its row.
- Copying the art pipeline scripts into `art/tools/`, `bl.js`'s room path removed first.
- Section 7's data and idea tables, plus the CREDITS step this reader adds.

### Parts that need a change first

- L3, the whole-body lean: decide where mu lives (a chase value per kind, or none for lesser kinds); give
  `DrawnChaser::step` the sim's acceleration or move the target out of it; make the chain shares relative or in space,
  not both; name the at-risk rows; look at the outside foot against corridor walls; choose g for the player.
- The body file: what a mark must say; the refused-name set from the X-macros; take `landing_dip` and `step_clock` out
  (they stay camera settings).
- L5, transitions: mark the position decay and the trigger [ours]; place L5 relative to `apply_motion` and L6; 0.1 s
  against the room's own 0.06 s is his eye's.
- L7, the picture world: step count at 144 frames a second and after a hitch, with a cap; collision groups between
  bodies (S-phys:415-417); E's rows re-run at the tick's dt (S-phys:421-423); R4.7 on the shared world before any figure
  is believed.
- The scene budget in 6: recount with his two or three full bodies, up to eight lesser, the two models counted once,
  and CPU and GPU kept apart.
- The climb timing law (a shimmy, no rungs) before any climb lap; the dark one by S-ship's model route, not a box slot;
  `rhythm` and the pack clock marked [ours]; 2b's arms and hips marked ours where they are.

### What I did not open (second reader)

- Every primary outside source (papers, licence texts, pages): I checked the system file against the scouts as their
  second readers left them, and licences against the scouts' reads; I made no outside request.
- Sections 1, 4, 5 and 8 line by line: opened only where a cite or mechanism bore on 2, 3, 6 or 7.
- E's clone, the worktrees, the GLBs, the kept runs, `00_build_path.md`, the workflow script, any hand-back.
- Game code beyond the lines named above; `chase/` beyond `git grep` hits; the brief beyond lines 1610-1614, which I
  read only to see item 218 is there.
- Nothing built, run or timed.
