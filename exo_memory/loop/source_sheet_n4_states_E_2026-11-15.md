# Source sheet for N4: the states and the changes between them (pane E, D677, 2026-11-15)

**What this is for.** The new animation system's fourth stage (N4, `loop/plan_animation_restart_2026-11-15.md:77`), step 6:
"Changes of state (stop, crouch, slide, jump, ladder, climb) come from the same plan with other numbers, joined by the one
spring layer. No hand-made pose per state unless a source calls for a key pose" (:53-54). It is written in the same form as
`loop/source_sheet_n2_upper_body_E_2026-11-15.md`.

**What the sheet holds.** Research only: published work or open-source code, each line with its source and whether it was
read at source. The old build appears only under "not carried over". Tier: just do it.

**"Read at source" says who opened what:**
- **reader, whole**: the room's scout read the primary whole. Its second reader's verdict follows (DOWNGRADED, WRONG,
  UNSUPPORTED) where there is one.
- **reader, abstract**: the scout read only the abstract.
- **agent, opened / snippet**: the librarian's research agent opened the page, or saw a search result only. Its reports say
  the librarian opened none of their sources. Its code "[read]" is a summarising fetch.

I re-opened no primary myself.

**Read whole:**
- `loop/animation_system_2026-11-13/scout_states_and_transitions.md` (S-st)
- `loop/animation_system_2026-11-13/scout_overgrowth_method.md` (S-og)
- `research/procedural_animation_techniques_open_materials_2026-11-15.md` (R-tech)
- `research/open_locomotion_data_and_numbers_2026-11-15.md` (R-data)
- `research/open_source_procedural_animation_code_census_2026-11-15.md` (R-code)

**Read in part:**
- `scout_motion_matching.md` (S-mm): :1-12, :100-200
- `scout_gaits_any_body.md` (S-gait): :34-40, :108-140, a grep for the stalk and the rise
- `scout_turning_and_transients.md` (S-turn), for stops and starts

**His words that govern N4** (brief = `exo_memory/briefs/dreamzone2_the_game.md`):

| item | his words | where |
|---|---|---|
| 205 | "when you dont see it, it can use a stealth mode to sneak up on you, eliminating footsteps or making them so quiet [...] But eventually the player will see the hunter, then the real chase begins, with the loud footsteps and chase etc" | brief:1546; the line also asks for a return to stealth once out of sight, "but it shouldnt exploit this right away" (S-st:452-454) |
| 206 | "i just dont want an OP undetectable hunter abusing the runner, they should know where it is most of the time or that is the goal" | brief:1550 |
| 207 | "there should be a stealth mode of animation, moving like an alien hyena or some shit" | brief:1554 |
| 208 | "and then in that split second you see it, it turns up right and starts running like a human" | brief:1558 |
| 151 | "it will turn, and then lean, not lean into the turn": a state for a continuous quantity brings back that lag | ground_his_words.md:296-314 |

---

## 1. How a change is made (the one spring layer)

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| Inertialization: cut straight to the target and stop evaluating the source; at the cut record the source's velocity and the source-to-target offset; a quintic matches offset and velocity at t = 0 and reaches zero at the end; controlling its starting acceleration rules out overshoot; 12 us against 30 us for a blended change | Bollo, SIGGRAPH 2017 Talks (Gears of War 4) | R-tech:20; S-phys (see N5) | agent, opened; the quintic's coefficients are in the GDC 2018 talk, not opened |
| Spring form: at the switch, offset = (source + offset) - target for position and velocity; then decay the offset each step and add it back. One animation evaluated; "does not provide a fixed blend time and can easily overshoot" | Holden, "Spring-It-On" (Spring-It-On repository, MIT) | S-mm:115-117 | reader, whole |
| The exact damper: x x (1 - exp(-ln2 dt / halflife)); halflife_to_damping(h) = 4 ln2 / h | Holden, articles and code (MIT) | R-tech:23 | agent, opened |
| Demo defaults: transition half-life 0.1 s; the character pulled to the simulation with half-lives 0.1 s position and 0.2 s rotation, capped at 0.5 x speed x dt a frame, clamped at 0.15 m and 90 deg; simulation velocity and rotation half-lives 0.27 s | Holden, Motion-Matching `controller.cpp` (MIT) | R-tech:22, :42 | agent, opened; DOWNGRADED (S-mm second reader): 0.1 s is a mocap-to-mocap value at 60 Hz, not a stop from 9 m/s |
| Dead blending: store the source pose and its velocity, extrapolate (e_x += e_v dt, velocity decayed by 2^(-dt / halflife)), cross-fade from the extrapolation with alpha = smoothstep(t / blendtime), blend 0.2 s; keep a direction quaternion so it never flips. It needs only the current pose and velocity | Holden, "Dead Blending" | R-tech:24; S-st:139-145 | agent, opened; reader, whole |
| The cost of a transition: the spring offset's area (2xy + v) / y^2, with y half the damping | Holden, "Inertialization transition cost" | R-tech:25 | agent, opened |
| An implicit-Euler damped spring with half-life and critically damped wrappers, exact at any time step; a quaternion spring that flips its target into the same hemisphere | unity-cj-lib `NumericSpring.cs` (MIT) | R-code:76 | agent, fetched (summarised) |
| Inertialization code: offset = (source + offset) - target, decayed by an implicit spring damper with a half-life | JLPM22 MotionMatching `Inertialization.cs` (MIT) | R-code:77 | agent, fetched (summarised) |
| An open C++ animation graph's transition node uses a plain blend; no inertialization was found in it | Esoterica (MIT) | R-code:29 | agent, fetched (summarised) |
| A state machine: switch IMMEDIATE, SYNC (the new state starts at the old one's position: phase carry) or AT_END; a cross-fade weight fading_pos / fading_time with both states evaluated; automatic transitions are refused mid-fade, a manual request is not | Godot `AnimationNodeStateMachine`, 4.3-stable (MIT) | S-st:84-103 | reader, whole (code); DOWNGRADED: only automatic transitions are blocked |
| Actions are layered like image compositing; in one group an action's weight goes "smoothly from zero to one" as the others fall; two tempos change by varying the master clock "so that the phases of the two actions are always aligned"; a buffering action where a direct blend would pass limbs through the body | Perlin & Goldberg 1996, Improv (SIGGRAPH) | S-st:105-117 | reader, whole; DOWNGRADED: Improv keeps the blend and adds a buffer |
| An overlay's weight curve 3w^2 - 2w^3 | Valve Source SDK, BaseAnimatingOverlay (study only) | S-st:33-34 | the room's reader |
| Phase matching on re-entry to a run: a phase quotient (left foot minus right foot, on the velocity) tabulated per frame and inverted into a map; the cycle starts at the mapped frame | Bollo 2017 | R-tech:21 | agent, opened |

## 2. Anticipation and follow-through

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| "An action occurs in three parts: the preparation for the action, the action proper, and the termination"; "If the audience expects something to happen, then it can be much faster without losing them"; a zip "only 3 or 4 frames long" (0.125-0.17 s at 24 fps); "A heavy body is slower to accelerate and decelerate than a light one"; "An action should never be brought to a complete stop before starting another" | Lasseter 1987, SIGGRAPH | S-st:129-137 | reader, whole |
| The cartoon filter: x*(t) = x(t) - x''~(t), a smoothed acceleration subtracted; anticipation and follow-through come from the kernel's negative lobes; A = 3 on mocap; sigma = 2 pi / omega over 32 frames. Its anticipation half needs the signal's future, so live only its follow-through is causal | Wang, Drucker, Agrawala & Cohen 2006, SIGGRAPH | S-st:119-127 | reader, whole |

## 3. The states themselves

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| **Crouch and landing:** a crouch weight on an underdamped spring (omega^2 120 s^-2, decay 13.98 s^-1, zeta 0.638), kicked on landing; settles within 2% by 0.58 s | Overgrowth `aschar.as:8429-8431, :9225-9232` (Apache-2.0) | S-og:70-71, :90-92 | reader, whole; it feeds a blend coordinate (the word "additive" is not in the code) |
| **Air:** the air pose follows the vertical speed (velocity.y over the jump speed), not time; the pose shifted back to the centre of mass | Overgrowth `aircontrols.as:120-141`, `aschar.as:14513-14523` | S-og:78-79 | reader, whole |
| **Landing depth by height:** natural knee flexion 51.3 deg at 22 cm, 67.3 deg at 44 cm | Verniba et al. 2017 (CC BY 4.0) | see the N3 sheet, section 4 | reader, whole |
| **Key poses on a wheel:** about 13 keyframes "in total for everything"; walk and run from 2 pass and 2 reach frames each, slerped in local space, blended by speed between walk and run; the wheel turned by distance (angle += distance / circumference x 360) | Rosen, GDC 2014 (Overgrowth), via a forum post and a student's replication | R-tech:9-12 | the talk not opened (video only); student page read; forum secondary |
| **A physics walk's states:** SIMBICON walks with a 4-state pose machine (lift 0.3 s, then hold until foot contact); running uses 2 | Yin, Loken & van de Panne 2007 | R-tech:15 | agent, opened |
| **Gait timing for any legs:** per foot a duty factor and a step trigger (an offset into the cycle); speed interpolates between parameter sets | Spore, Hecker et al. 2008 | R-tech:16 | agent, opened |
| **Starts, stops and pivots** driven by a root-distance curve, not by time | Unreal Engine, Distance Matching | R-tech:41 | agent, opened (no play-rate clamps or stop prediction on the page) |
| **Walk and run:** walk to run near 2.0 m/s, at a Froude number of about 0.5 across leg lengths and in reduced gravity; backward walk-run 1.63 m/s against 1.85 forwards; stance share 62% walking, 31% running, 22% sprinting | Kram, Domingo & Ferris 1997; JSSM; Mann & Hagy 1980 | S-gait:116-118; R-data:58-60 | Kram: reader, abstract; the rest: agent, snippet |
| **Backwards:** stride time 8 to 14% shorter than forwards at the same speed, similar stance share; backward running about 29% slower at its maximum, shorter strides, higher frequency, more time in stance | Thorstensson 1986; a JSSM study | R-data:97-98 | agent, snippet |
| **Stopping:** hard stops after a 20 m sprint average -4.24 and -4.99 m/s^2 (approach 7.37-7.80 m/s); braking is multi-step; the penultimate step 0.92 to 1.26 m long, contact 0.35 to 0.40 s; decelerations run ~17% above maximal accelerations | Harper et al. 2020 (Sports); Harper et al. 2022 (Sports Med, CC BY 4.0) | R-data:88; S-turn:167-179 | agent, opened; reader, whole |
| **Starting:** the largest forward acceleration is in the first stance; a sprint splits into three phases with breaks near steps 4 and 14; from blocks the body leans 2 deg at touchdown and 43 at toe-off over the first four steps | snippet; Nagahara 2014; King et al. 2022 (CC BY 4.0) | R-data:70, :90; S-turn:143-159 | snippet; reader, whole |
| **The stalk (207):** spotted hyena walk, limb phase 13-18% of the stride (striped 9-11), hind duty 59, fore 66, back and neck kept straight through the gallop | Spoor & Belterman 1986, Bijdragen tot de Dierkunde | S-gait:70-86, :248 | reader, whole |
| **The crouch of a stalk:** cats under a low ceiling lowered the whole body with the trunk level, the head in line with the back, hip height down 30%; cycle 766 +-30 ms with 30% swing and 70% stance as in normal walking; knee and ankle 41-45 deg more flexed; "Crouched walking requires a postural change that typically occurs when cats stalk prey" | Trank et al. (PMID 8899606) | S-gait:108-114 | reader, abstract |
| **The rise (208):** lizards with the centre of mass toward the rear lift the front of the body when they accelerate; there is an acceleration threshold between bipedal and quadrupedal runs; the trunk's angular acceleration about the hip predicts extended bipedal running | Aerts et al. 2003; Clemente 2014; Clemente & Wu 2018 | S-gait:125-135 | abstracts; DOWNGRADED: every lizard here has its mass REARWARD, a hyena's is forward |
| **A get-up:** below a speed threshold drive the ragdoll toward the nearest get-up start pose, then blend to the animation | Just Cause 2, Fuller & Nilsson, CEDEC 2010 | R-tech:59 | agent, opened |
| **Strength back after a hit:** it drops at 1 a second on contact and comes back at 0.05 a second | ActiveRagdoll `SlaveController.cs` (MIT) | R-code:63 | agent, fetched (summarised) |
| **Start and stop data:** accelerating from rest at 0.2 or 0.5 m/s^2 and decelerating, and walk-run transitions to 2.2 m/s (Reznick 2021, data licence unconfirmed); 31 tasks including cutting, jumps and lunges (Scherpereel 2023); idles and transitions in 100 styles (100STYLE, CC BY 4.0) | Reznick; Scherpereel; Mason | R-data:18, :23-24 | agent, opened (Scherpereel's licence: snippet) |

## 4. What the player is told by a change

| rule and numbers | source | on file | read at source |
|---|---|---|---|
| "Chasing subtlety" (how far a pursuer's heading strays from heat-seeking): detection fell "from more than 85%-correct to chance"; above 60% only at 0 and 30 deg. A pursuer drawn facing its motion was escaped more often | Gao, Newman & Scholl 2009, Cognitive Psychology | S-st:150-158 | reader, whole; DOWNGRADED: against discs p = 0.060, n = 12; section 7.4 says facing and heading at the prey gives the chase away |
| Random motion hides a pursuit, pauses do not; the best hidden pursuer strays "in relatively brief bursts (e.g. 1/3 of the time) and via a moderate angle (e.g. 60 deg)" | Gao & Scholl 2011, JEP:HPP | S-st:159-162 | reader, whole; DOWNGRADED: pausing made the wolf easier to escape |
| Shapes moving at random but FACING you read as pursuing you: 7.99 s against 9.01 s in perpendicular quadrants (chance 8.5); two dots as eyes gave 7.97 against 9.03 | Gao, McCarthy & Scholl 2010, Psychological Science (the wolfpack effect) | S-st:163-165 | reader, whole; 2D shapes, not bodies in first person |

## 5. What the simulation gives the picture (read only; not research, not the old build)

These are the chase's own numbers at dreamzone-3 main `31d1c6d` (S-st:56-76). The rule is that the chase sets WHEN and HOW LONG
(S-st:177-179).
- **Gaits:** Mesh, Ladder, Drop, Recover, Climb, Off.
- **Modes:** Waiting, Investigate, Pursue, Leaving, ToMouth, AtMouth, GoingRound, Guarding, Inside, OffStage. Waiting and
  OffStage are not drawn at all (S-st:221-224).
- **Every link starts at speed 0.** Drop 0.9 s, recover 0.7 s, a head-on wall 0.2 s (0.5 s for the lesser kinds), ladder
  mount 0.8 s, climb 1.4 s (climb is the crawler's alone).
- **The hunter re-plans from what it knew 0.40 s ago, a lesser kind 0.25 to 0.3 s ago.** A lesser kind's mode flips to Pursue
  at the sighting tick (S-st:246-251).
- **No stalk mode exists in the chase.** Items 205 and 206 are pane A's lane.

## 6. Not on file

- **A source for transitions between procedural gaits,** for anticipation in a real-time game, or for reading a pursuer's
  intent from a 3D body in first person (S-st:78-80, :374-376).
- **The quintic's coefficients and its overshoot clamp** (Bollo's GDC 2018 talk, not opened).
- **A sourced half-life for a stop from speed.** 0.1 s is the demo's mocap-to-mocap value.
- **A source for the hunter's rise** with a forward centre of mass.
- **Any hyena or stalk data at more than a walk.**
- **A slide or a crouch-walk for a human,** with numbers.
- **Data on stops and starts with kinematics above 2.2 m/s.** No open dataset of sprint starts was found (R-data:19).

## 7. Not carried over (the old build)

- The player's nine-move blend with `kBlendTime` 0.045 s and its first-order decay (S-st:29-30; S-mm:181).
- The joint-jump guard `kJumpBase` 0.025 m (S-mm:153-155, the room's own constant).
- The stand-in pose the hunter takes at speed 0, which draws it standing through every drop and up every ladder
  (S-st:66-68).
- The hunter's stride phase advanced by frame time (S-st:66).
- E's soft-key catch reaction (0.15, back over 1.0 s): its numbers were ours; the idea of a strength envelope is in the N5
  sheet.
