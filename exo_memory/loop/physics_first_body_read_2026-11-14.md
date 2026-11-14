# Keep the drawn-after hunter, or restart it physics-first: the evidence and three options (reader's file, 2026-11-14)

Research only. Nothing built, run or committed; no decision is made here. Marks: [read] I opened it and saw it
(path:line, or URL and place); [summary] a summarising fetch, a secondary account, or another file's claim; [inferred]
mine; [ours] a proposal. Game code is dreamzone-3 `main` 99b6045 (clean tree); the swarm files cite 31d1c6d and
d002b65, so their line numbers differ. Short names: SYS = `loop/animation_system_2026-11-13/00_system.md` (scouts and
ground files sit beside it); H183 = `handback/p-l183-physics-anim-E_2026-11-12.md`; GR =
ground_constraints_and_roster.md; brief = `briefs/dreamzone2_the_game.md`. The packet named
`p-l185-skeleton-E_2026-11-13.md`; that file is dated 2026-11-12.

## Main findings

1. [read] "The body is drawn from the simulation and writes nothing back" is CONFIRMED. The hunter itself is a point
   on the navigation mesh, no physics body (chase/chaser.h:1-6).
2. [read] The speed loss at an overshoot comes from the chase's own laws (rate-limited heading, a cap while facing
   away, 20% of speed lost per radian, a wall that takes speed), and chase/chaser.h:8-12 says it is meant.
3. [inferred] My port of that law: a 7.6 m/s hunter falls to 3.5 m/s (46%) in 0.24 s and is back at 90% by 0.80 s, for
   one aim point 4 m aside, 2 m behind. A stall, not zero. Nobody measured it on his run (brief:1637).
4. [read] The let-off before the touch has NO traced cause on main; two commit messages on unmerged branches trace
   bots whose path ended behind or away from the player.
5. [read] The drawn lean comes from filtered drawn-position differences at 1 deg per m/s/s (gravity asks 5.84); the
   sim's same-tick lean (world_app.cpp:561) is overwritten (:609).
6. [read] The room's research: physics pays for reactions, shipped sources keep running kinematic, motors stopped red;
   "picture only" was the packet's default plus a replay rule, not a finding that physics-first fails.
7. [read, press] Public RAGE/Euphoria text is press: Rockstar North's technology director places Euphoria at
   physics-based reactions; NaturalMotion's CEO says two systems run, Euphoria on top.
8. [inferred] The room already built Option B's root ingredients inside the point model, all off by default: carried
   velocity on main (`slip_rate`), a grip law on a branch. The sharper fork: do contacts push the root, and does a
   physics step run inside the 240 Hz tick.

## 1. How the hunter moves and is drawn today (main 99b6045)

1. [read] Chase tick: `chase::step` (chase/chaser.cpp:215) moves a POINT on the nav mesh, "no physics character"
   (chaser.h:3), at 240 Hz (core/time.h:9-10), snapped to the mesh's nearest point within 0.3 m (chaser.cpp:404,
   chaser.h:132).
2. [read] Aim: in Pursue it re-plans to `lead_point(obs)` every `hunter_replan_s` (0.5 s falling to 0.15) from an
   observation `react` ticks old (0.4 s to 0.15) (run.cpp:809-815, :717-726, dials.h:30-31); lead is off
   (chase/speed.h:38).
3. [read] Speed: `want = min(cap, allow)`; `allow` from the corner ahead and the path end (chaser.cpp:285-312), then a
   second cap when the aim is more than 0.05 rad off the heading (:331-343); accel and brake move speed toward `want`
   (:365-366).
4. [read] Turn: rate = lerp(turn_slow, turn_fast, speed/top) (:169-172), hunter 360 deg/s standing, 150 at top, rising
   to 260 (dials.h:27-28), eased over 0.08 s (:351-358); each radian turned costs 20% of speed (:369-372, speed.h:29).
5. [read] Motion: the point travels along its heading only (`slip_rate` 0, speed.h:37; chaser.cpp:385-397); a wall
   takes speed in proportion to the share of the step it took (:413-435, :21).
6. [read] Picture input: `WorldApp::gather_poses` is a const read: pos, heading, speed, mode, gait, look and `lean =
   atan(speed*turn/9.81)` (game/world/world_app.cpp:555-563). `ease_poses` steps a `DrawnChaser` per tick (:594-615)
   that RE-DERIVES velocity and acceleration from positions (game/model_rig.cpp:504-516), eases yaw at 12.57 rad/s
   (:518-525) and overwrites lean and pitch (world_app.cpp:609-610).
7. [read] Frame: stage.cpp:256-283 poses the hunter with `gait_pose(rest, pos, heading, speed, hunter_phase_, motion)`
   (:279); the phase is summed from the FRAME's dt (:270). `apply_motion` (model_rig.cpp:415-476): outside foot 10 cm
   wider, feet to the floor probe, kinetic chain about the PELVIS (:620-641), hips sink up to 0.30 m, legs re-reached.
8. [read] A Jolt ragdoll exists (game/ragdoll.cpp: 22 kinematic bodies, hard-keyed, :99, :138-140, own PhysicsSystem);
   nothing in game/ outside tests includes it. The soft-keyed upper body is on a local clone, not this repository
   [summary: ground_physics:3-5].
9. [read] The sim never steps a Jolt PhysicsSystem: `grep 'Update(' sim/physics.cpp` finds only `ExtendedUpdate` (the
   player's CharacterVirtual, :386, :479). Jolt is built CROSS_PLATFORM_DETERMINISTIC
   (third_party/CMakeLists.txt:7-9).
10. [read] The run record stores `sim_hash` and `chase_hash`; replay checks both (game/world/run_record.cpp:117-118,
    :367-369). The chase fingerprint reads pos, heading, speed, turn, gait, path (chaser.cpp:482-496).

**Confirm or refute** [read]: CONFIRMED. `chase/`, `sim/`, `nav/` include nothing from `game/` (grep: 0 lines). The
game writes into the chase only through `before_tick`, `after_step` and `set_difficulty` (world_app.cpp:751, :761,
:534, :540), none fed by a drawn value. Not write-backs: the frame-summed stride phase (stage.cpp:270) and the
read-only closest-hit `floor_below`. The standing rule, docs/ARCHITECTURE.md:55-56: deterministic, "so replays, ghosts
and headless chase tests work".

**Fault 1: no bank into a sharp turn; "loses all speed, repoints itself then goes, instead of flowing through"**
- [read] chaser.cpp:331-343: an aim more than 0.05 rad off the heading caps speed to the turning circle of radius
  dist/(2 sin off), radius 0 past 90 deg, which is `kCreep` 1.2 m/s (:16, :47-58). With the hunter's care 0.9
  (dials.h:29, chaser.cpp:340) that is cap - 0.9(cap - 1.2): 2.0 m/s at a 9.2 m/s top [inferred]. Then :351-358
  rate-limited heading, :369-372 drag, :385-397 no sideways velocity, :413-435 wall scrape. Stated intent: a chaser
  "that comes into a corner too fast swings wide, meets the far wall, and loses its speed against it" (chaser.h:8-12).
- [inferred] My port of :331-372 (30 lines of node arithmetic, not the game's code; one aim point, no walls): minimum
  3.5 of 7.6 m/s at 0.24 s, 90% again at 0.80 s; at brutal-start dials (9.2 m/s) 4.5, 0.23 s, 0.75 s. No hand-back
  measures it on his run (brief:1637).

**Fault 2: "lets off for a second and stops before touching"**
- NOT FOUND as a trace. Candidate [inferred]: at the last point of a path `going` is false, `want` 0, braking 14+
  m/s/s (chaser.cpp:235-236, :365-366); that point is an observation `react` old, or a knowledge point up to 6 m off
  (run.cpp:775-785, :811-813). A catch is a distance (0.9 to 1.3 m) plus sight, no touch (run.cpp:558-561).
- [read] Commit bodies: a-d673-close 010c9f3: the dark one's path, re-planned every few tenths of a second, "ended a
  metre or two behind a player who juked away" (a bot, 6 minutes circling); a-kit-told dcbfd3c: the hunter stood 3 to
  5 m from a standing player 9 to 12 s (a bot). Neither is on main (`git merge-base --is-ancestor`, both false);
  brief:1637: not shown whether either is his fault.

**Fault 3: the torso does not orient into the turn**
- [read] Lean = `dot(tilt, right_of_drawn_yaw)` (model_rig.cpp:546-549); tilt target = 0.5*v + filtered accel in
  degrees (:510), half-lives 0.1126 and 0.0548 s (model_rig.h:337-338): 1 deg per m/s/s. The row pins 9.8 deg at 1 g
  (game/tests/model_rig_tests.cpp:510-517); atan(1) is 45. Shares 1.0 / 0.35 / -0.30 about the pelvis
  (model_rig.h:134-136, model_rig.cpp:626-637); feet only 10 cm wider (:428-436). Trunk twist is from the stride and
  the look only (:611-615), never from where the path goes. The lean-timing row's bar is 0.51 s (bot), 0.55 s (his
  run) (game/tests/world_app_tests.cpp:1161-1181).
- Two accounts of the drawn lean disagree; I ran neither: about a sixth of physics in a steady bend
  (scout_turning_and_transients.md:9-10) against pane C's trace of his run, about 0 while 15-48 deg is asked, then
  63-75 where 51 is asked (`handback/p-d675-corner-C_2026-11-13.md:25-36`).

**Envelope of what the dials ask** [inferred, my node arithmetic from dials.h:27-28, speed.h:22]: v x turn rate at top
speed is 20.5 m/s/s (2.1 g) at level 0 start, 30.5 (3.1 g) at brutal start, 54.5 (5.6 g) at 600 s of brutal; an upper
envelope, since `corner_speed` brakes first. His bend: 9.7-10.8 m/s on R 8.5-10.8 m, about 1 g (p-d675-corner-C:25-29
[read]). Grip radius v^2/(mu g) at 9.2 m/s: 8.6 m at mu 1.0, 6.6 at 1.3, 4.3 at 2.0; the chase assumes 0.9 m of corner
room, "about a third of a corridor" (chaser.cpp:15): no mu lets 9 m/s round a corridor corner without braking.

## 2. What the room's research says about a physically simulated body

- H183 (pane E, research only) [read]: one shape in every source: an animation makes a target pose and per-joint
  controllers pull a simulated body to it (:28-33). Balance is the hard part: Jolt's motors drive joints relative to
  the parent, nothing keeps a powered ragdoll upright (:37-38); SIMBICON's torso is "always reacting ... rather than
  anticipating" (:39); DeepMimic is learned, about 2 days on 8 cores per skill (:40). Physics pays for reactions
  (:46). Options (a) reactions only, (b) physics-balanced locomotion, research; lean (a) (:84-87). Cost read, not
  timed: Jolt Human ragdoll about 23 constraints; own guess 10-12 ragdolls of about 14 bodies (:69-75). Determinism
  (:48-56): same call order and binary; CROSS_PLATFORM_DETERMINISTIC about 8% slower, already on; stepping a
  PhysicsSystem in the tick is "possible" per the docs, unshown, "not recommended".
- ground_physics_and_fp_body.md [read]: motors (step 4) STOPPED RED, forearm and hand never followed, 3x stiffness
  unstable (:73-74); soft-keyed upper body green on a local clone, pelvis, spine and legs keyed (:75-80); cost row
  R4.7 never run (:195, :259); SIMBICON feet (step 3) registered, never built (:205).
- scout_secondary_and_physics.md [read]: one picture-only physics world holding the level's walls, stepped on the
  tick. Not to build: physics-balanced running (the open active ragdoll stays up by a kinematic hand on the torso,
  :285-290), physics for the lean (:294), in-sim stepping ("no gain and a determinism risk", :298). Its "tens of
  microseconds" a character is [inferred] (:232-242); scout_performance's second reader marks it unsupported (:387).
- scout_overgrowth_method.md [read]: keyed cycles on one phase, procedural layers, underdamped springs; physics only
  as a per-bone strength in the ragdoll state (:4, :83). A source for "physics-based interpolation between key poses"
  is NOT in the file; Rosen's GDC 2014 talk is video only, unread (:56-57).
- scout_performance_and_determinism.md [read]: picture rules P1-P5 [ours] (:171-196); Jolt broadphase, listener and
  `GetActiveBodies` order are not deterministic (:104-106; I read Architecture.md:787-807 myself); no per-ragdoll time
  exists, the 76 us derived from Jolt's piles benchmark is marked downgraded (:113-124).
- 00_critic.md [read]: E3, SYS's lean composition is inconsistent (the chain pivots at the pelvis, so a new tilt
  target cannot give a lean about the feet); Q1, whether the grip law is on decides how far the lean may go; with it
  on, `std::pow` kinds are not bit-identical across libms (:112-113). No red row in the swarm files was ever run.
- **Why SYS chose "reads the simulation and writes nothing back"** [read]: (1) "so a recorded run replays the same"
  (SYS:3-5, :43; GR:33-54); (2) H183 made picture-only "the default, kept" from the chair's packet and called in-tick
  stepping possible but unshown (:53-55); (3) shipped games keep running kinematic and the motors stopped red
  (SYS:539-540); (4) drawing the body off the sim's place "risks walls and a catch that looks wrong"
  (scout_shipped_systems.md:334). SYS:1-8 itself says its layers extend the code that exists.

## 3. What is public about RAGE with NaturalMotion's Euphoria

Eight outside requests, public technical topics only: 3 searches ([summary]) and 5 curl downloads read as text.
- [read] Wikipedia wikitext (en.wikipedia.org/w/index.php?title=Euphoria_(software)&action=raw), secondary:
  NaturalMotion's wording, "a full simulation of the 3D character, including body, muscles and motor nervous system";
  "limp ragdolls" are the common case, Euphoria "employed a more complex method"; GTA IV first, Red Dead Redemption
  second; licensing ended 2017. Its source for the quote is a dead FAQ link.
- [read] Gamasutra interview with NaturalMotion's CEO
  (gamedeveloper.com/game-platforms/tooling-around-naturalmotion-s-reil-on-morpheme), trade press: Dynamic Motion
  Synthesis "uses the processing power of Xbox 360 and PS3 to simulate 3D characters at run-time"; morpheme, its blend
  and state-machine runtime, is "a great basis for euphoria integration".
- [read] TechRadar on Max Payne 3, undated in my copy, page 1
  (techradar.com/news/gaming/the-technology-of-max-payne-3-1082751), press quoting a vendor, the nearest to a
  technical statement found: "we are really running two systems because a huge part is played by Rockstar's Rage
  system ... and the physics engine. But Euphoria runs on top of that and essentially controls the physical characters
  that, at a base level, are dealt with by the physics engine."
- [read] Wccftech, 2018-10-24, quoting a VG247 interview I did not open: Rockstar North's director of technology: "We
  use Euphoria specifically to enhance the physics-based reactions of both humans and animals" (shot horse, stirrups,
  lasso, stunt falls); "Euphoria is just a part of how we simulate and animate characters and, outside of it, we have
  radically overhauled our entire animation system".
- [summary] Snippets not opened: Euphoria "layered over" animation; characters return to motion capture when balance
  returns (a forum post and an analysis page, one flagged unreliable).

Plainly: PRESS, not technical. Two systems run, RAGE's animation and physics engine, and Euphoria on top controlling
the physical characters the physics engine handles. Euphoria's stated job at Rockstar is physics-based REACTIONS; the
rest is the animation system. No source I opened lists which motions are which, says how a behaviour is built, or says
walking or running is simulated. The technique as NaturalMotion words it: a simulated body (body, muscles, motor
nervous system), controllers, behaviours; proprietary.

## 4. Three options (evidence, not a decision)

Facts that bear on all three:
- [read] Root ingredients exist inside the point model, off by default. On main: SLIP, velocity carried toward the
  facing (`slip_rate`, speed.h:37, chaser.cpp:383-395): 36 deg sideslip at rate 3 against 2.6, no catch effect, wall
  hits 0.35-0.59 times, one route in ten stops 30 m short at a mesh gap (`handback/p-l170-chase-A_2026-11-12.md:11-15,
  :74`). On `l182-lines` c357bbd: `turn_law` 2/3, H2 = min(V_o, sqrt(mu g R)), `grip_mu` (chaser.cpp:217-232 there); 3
  commits, +251 lines in 7 chase files; main is 133 commits ahead of its base and changed run.cpp and speed.h too.
- [read] L182 at NORMAL: the law alone halves wall hits (x0.38 to x0.45) and costs catch (never-caught +14.7 to +18.0
  points); grip arms g13/g16/g20 at brutal NOT RUN; mu 1.3 is a derived bound for cheetahs, nothing supports a hunter
  value (`p-l182-lines-A_2026-11-12.md:44, :52, :8, :81`).
- [inferred] A point moving along its heading already has exactly v x omega of centripetal acceleration, so `lean` at
  world_app.cpp:561 is the right per-tick number for the path it draws. It lacks a grip cap, sideways velocity and any
  contact that pushes the root. The rest of B is that.

### Option A. Continue: drawn after the simulation; land the grip law; fix the lean's timing
- Kept / thrown: everything kept. Added: `l182-lines` rebased behind its dials; the lean from the sim's per-tick
  value, capped atan(min(a, mu g)/g); a roll about the feet, chain on top (critic E3). Retired per SYS: the frame-time
  stride clock.
- Determinism, replays, sweeps: dials off, byte-identical (12-seed md5 599ab239..., L182:20-24 [read]); picture-only
  changes keep his 16 kept runs identical (`p-l185-steps4-5-E_2026-11-13.md:106` [read]). Grip law ON: older runs'
  `chase_hash` stop matching, as 14 recorded fingerprints already miss on both builds (same file :108 [read]); H1 uses
  `std::pow`, not bit-identical across libms (l182-lines chaser.cpp:220, :225), H2 does not.
- First proving check [ours], red today: on his run of 2026-11-12 20:29 and the flee bot's 60 s, median lag from the
  turn rate's peak to the drawn lean's peak at most 0.05 s (L177's withdrawn bar, world_app_tests.cpp:1166-1168);
  today's row passes under 0.51-0.55 s, I did not run it. Companion: 7 m/s on 5 m draws 45 +- 2 deg where the row
  asserts 9.8 +- 1 (model_rig_tests.cpp:517), amended by name.
- Size [ours]: 4 build laps (lean, grip landing, roll about the feet, clip at three grips); 6 with faults 1 and 2.
- Main risk: the point model stays, so faults 1 and 2 are untouched by the grip law, which lowers catch power; the
  rebase over 133 landings; two accounts of the lean disagree.
- Faults: 1 needs another patch (dials exist, off: `corner_floor_speed`, `slip_rate`, `lead_range`, speed.h:36-38;
  L170 found no catch effect). 2 needs another patch (those branches' ideas, not shown to be his). 3 mostly the lean
  pieces; torso turning toward where the path goes needs one more.

### Option B. Physics-first root: a mass with grip-limited acceleration; lean from that acceleration; hands and feet touch
- Kept: nav mesh and planner, senses, director, catch, `Chaser` fields, `gait_pose`, `apply_motion`, chain,
  `Rig::palette`, stage. Thrown or rewritten: chaser.cpp:331-372 (heading law, facing-away cap, drag), `corner_speed`
  and `speed_for_radius` (:47-58, :174-180), the planner's corner braking, `DrawnChaser`'s estimator
  (model_rig.cpp:498-516), and the L170/L182 sweep baselines.
- Two flavours [inferred]: contacts as picture only (hands and feet read walls and floor, root unaffected), or
  contacts that push the root, which needs the hunter in the collision world as the player is (`CharacterVirtual`,
  physics.cpp:386, :479). The first is a picture lap; the second is the sim.
- Determinism, replays, sweeps: a root law in plain float arithmetic with `det_sin/det_cos` (chaser.cpp:177, :382)
  stays deterministic. `chase_hash` changes for every hunter, so all kept runs (40 files in game/runs, unopened)
  replay the player but not the hunter; fresh baselines needed; `sim_hash` plausibly stays [inferred]. Sweeps stay
  Jolt-free if the root is arithmetic. A 600 s run is 144,000 ticks: each microsecond per tick is 0.144 s per run,
  about 65 s CPU per 150-seed, 3-policy block.
- First proving check [ours], red today: a scripted 90 deg corner of 3 m radius at 9 m/s: root lateral acceleration at
  most mu g every tick, heading rate continuous, drawn roll each tick equal to atan(a/g) of that tick's acceleration
  within 1 deg. Red: `Chaser` holds no acceleration, the turn is rate-limited kinematics, the drawn lean reads 9.8 deg
  at 1 g.
- Size [ours]: 8 to 12 laps: root law 2-3, brutal re-baselining 1-2, replay baselines 1, lean and roll about the feet
  2, picture-world walls and hand/foot contacts 2-3, planner arrival 1, clip 1.
- Main risk: radius v^2/(mu g) is 4-9 m at 9.2 m/s in corridors of about 3 m, so it must still brake before bends and
  fault 1 may persist smoothed; momentum can leave the mesh (SLIP stalled 1 route in 10); calibration is lost.
- Faults: 1 fixed by construction for the SHAPE (an arc under a force limit, no pivot), speed lost still set by the
  planner's braking and the sweeps. 2 needs another patch (planner arrival, knowledge). 3 lean by construction; torso
  orientation toward intent needs a patch, or the bank is the command and the turn its consequence, as for a bird [ours].

### Option C. A full active ragdoll that walks and runs by itself
- Kept: planner and nav as intent, `skeleton.{h,cpp}`, `ragdoll.{h,cpp}`, Jolt. Demoted to a reference target:
  `gait_pose`'s leg and pelvis authorship, the stride clock, hip sink, leg reach, the point stepper, `DrawnChaser`.
- Determinism, replays, sweeps: needs `PhysicsSystem::Update` inside the 240 Hz tick, in fixed order, no logic on
  listener order, broadphase queries or `GetActiveBodies` (Architecture.md:787-807 [read]); the cross-platform flag is
  already on. Jolt permits it; no source shows a shipped game doing it for locomotion (H183:55 [summary]). Any gain
  change alters every hash and every kept run goes stale; sweeps step Jolt per run.
- First proving check [ours], red today: with pelvis and legs NOT keyed, driven only by joint targets from
  `gait_pose`, the body runs 10 s at 6 m/s on a straight and a 5 m bend, never falls (pelvis height at least 0.6 of
  standing hip height each tick), stays within 0.5 m of the planner's path. Red: the ragdoll is hard-keyed
  (ragdoll.cpp:99).
- Size [ours]: 20 laps or more, not knowable until a controller stands; the first 2-3 laps are the gate.
- Main risk: nothing on file stands. Motors stopped red on forearm and hand; SIMBICON's torso reacts after the force,
  the same lag as the lean fault; DeepMimic needs days of training per skill; Rockstar's own words (section 3) place
  Euphoria at reactions. A hunter that can fall also stalls the chase.
- Faults: 1 and 3 are as good as the controller (unproven); 2 needs a planner patch; a tripping hunter is new.

## 5. What I could not establish

- Which code produced the let-off in his run, and the size of the speed loss and of the drawn lean on it (my port is
  one law, one aim point, no walls; a wall hit can zero speed, chaser.cpp:441-446; I ran no test or capture).
- Any cost of a second Jolt body per chaser or of E's soft-key layer (R4.7 never ran): no frame-time number exists.
- Whether Rockstar's walking and running are simulated or keyed in any shipped title; Euphoria's internals and
  behaviour list.
- The soft-key code (local clone), `origin/l182-hawk`, and the code of `a-d673-close` and `a-kit-told`.
- Whether the "flow through" wish survives the beatability design (chaser.h:8-12) under any option: his call.

## What I did not open

- Jolt source beyond `Docs/Architecture.md:785-810`; the VG247 interview; page 2 of the TechRadar piece; NaturalMotion
  FAQ and white paper; Reil and Husbands; GDC Vault; Rockstar talks; search pages beyond snippets.
- The game's tests beyond the rows cited; every kept run in game/runs; benches, clips, captures; E's clone;
  `chase/archetype.cpp`, `streamed.cpp`, `bots.cpp`, `arena.cpp`, `nav/`, `game/body.cpp`.
- `loop/animation_system_2026-11-13/` beyond section 2; `00_system.md` outside lines 1-116, 254-303, 527-586, 640-700;
  `00_critic.md` outside 1-60, 196-262; the L170 and L182 hand-backs beyond the lines cited.
- No game, test or sweep was run; the one computation is a node-arithmetic port of chaser.cpp:331-372.
