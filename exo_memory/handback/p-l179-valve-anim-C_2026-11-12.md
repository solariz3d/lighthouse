# p-l179-valve-anim-C — L179 half 1: how Valve animated Left 4 Dead's chasers, from source, mapped onto our rig (learn from, never copy). Pane C, on L, 2026-11-12

**Packet:** the chair's L179 (09:12:25Z, delivered 09:21Z). Plan: `loop/plan_l179_how_l4d_animated_2026-11-12.md` (ae634b41), half 1. His items 154, 153, 129–130.
- **The hand-back path is the plan's** (`p-l179-valve-anim-C`). The chair's message said `p-l179-l4d-anim-C`; I follow the plan, as in L176, and name both in the ring.
- **First, the WIP (item 1 of the message):** my L177 work was already committed on its own branch: `l177-lean-lead` at **`f33783f`**, in `C:\Users\zackn\Downloads\dreamzone-3-c-l170`.
  - checked: `git status --short` → 0 lines; nothing else is uncommitted.
  - Nothing of L177b was started.
  - main = origin/main = `c83f8dc`, untouched since the L173 landing.

**Marks:**
- **source:** the file and line I read, with its licence.
- **inferred:** my reading.
- **ours:** a step with no source, to be put to him before it is built.
- Our code is cited at dreamzone-3 `c83f8dc`.

**How it was read:** sources were fetched raw into `scratchpad/l179/src/` (read only).
- **Booth's slides:** `booth_l4d.pdf`, sha256 `6ae1af1f…`, the librarian's copy, the same as A's. Text was taken from its streams with A's extractor (`scratchpad/l179/booth_paged.txt`). Slide numbers below are stream counts and approximate.

## Licences: what "learn from" allows here
| Source | Licence (checked where) | For us |
|---|---|---|
| **Source SDK 2013** (`ValveSoftware/source-sdk-2013`, NextBot, `multiplayer_animstate`, `BaseAnimatingOverlay`) | **SOURCE 1 SDK LICENSE** (`LICENSE` :1-12): "use, copy, and modify the SDK to develop a modified Valve game running on Valve's Source 1 engine" | **Study only.** Our game is not a Source 1 game, so no line of it may be copied. Every idea below is restated in my words. |
| **Booth, "The AI Systems of Left 4 Dead"**, GDC 2009 | © Valve; a conference talk with no open licence | Cite, never copy. |
| **Valve Developer Community wiki** (authoring docs) | Not determined: the copyright page returned 403 to my fetch | Cited through search results only. |

## 1. What Valve's code does, read from source (Source 1 SDK licence: study only)
**The body is told, not animated by hand (source).**
- NextBot's `IBody` (`src/game/server/NextBot/NextBotBodyInterface.h`) is how behaviour asks for animation: `StartActivity` and `SelectAnimationSequence` (`:80-85`). An activity carries flags (`:68-74`):
  - `MOTION_CONTROLLED_XY` / `_Z`: the animation drives position.
  - `ACTIVITY_UNINTERRUPTIBLE`.
  - `ACTIVITY_TRANSITORY`: "a short animation that takes over from the underlying animation momentarily".
  - `ENTINDEX_PLAYBACK_RATE`: "played back at different rates based on entindex". So each bot runs a little faster or slower, and a crowd doesn't step in unison.
- **Posture:** stand, crouch, sit, lie (`:87-104`).
- **Arousal:** `NEUTRAL`, `ALERT`, `INTENSE`, "the level of excitedness/arousal/anxiety of the body" (`:106-119`).
- Booth's slides say the same (streams 40, 47; © Valve): "Body: Owns animation state". Behaviours hear `OnAnimationActivityComplete` and `OnAnimationEvent`.

**The head aims at a capped speed, with eased ends (source):** `src/game/server/NextBot/Player/NextBotPlayerBody.cpp`.
- **The speed:** the head turns toward its target at up to `nb_saccade_speed`, **1000°/s** (`:17`, used at `:298`).
  - Inside about 45° of the target (`dot > 0.7`), the rate is scaled by a sine to ease out, "first derivative continuity of rate as our aim hits to avoid pop" (`:296-307`).
  - For the first 0.25 s of a new look it eases in linearly (`:309-312`).
  - Pitch turns at half the yaw rate (`:314-315`).
- **The target:** a moving subject is aimed at a lead time ahead (`:221`). Its velocity is re-estimated only every tracking interval, randomised ×0.8–1.2 "to allow realistic slop in tracking" (`:209-236`), and the look point moves at that velocity between samples (`:239`).
- **Steadiness:** the head counts as steady below 100°/s (`:18`, `:133-147`). After turning through 100° it pauses 0.3 s to "recenter its virtual mouse" (`:20-21`).

**Facing and travel are separate (source):** `src/game/server/NextBot/NextBotGroundLocomotion.cpp`.
- **The facing:** `FaceTowards` turns the facing toward a target at a fixed maximum yaw rate, a plain clamp (`:1413-1438`).
- **The travel:** movement is a separately accumulated approach, limited to run speed (`:331-360`).
- **On the ground:** the velocity keeps its momentum. Lateral friction acts on the sideways part ("always apply lateral friction to counteract sideslip"), and forward friction only when sliding backwards (`:157-181`).
- **When the animation drives motion:** with `MOTION_CONTROLLED_XY` the velocity is taken from the animation (`:192-196`).

**The run is a directional blend by velocity, with no lean (source):** `src/game/shared/Multiplayer/multiplayer_animstate.cpp`.
- **The blend:** `move_x` / `move_y` are the velocity's direction relative to the eyes' yaw, "the view vs. movement yaw", pushed out to the square's edge, then scaled by speed over the clip's own ground speed (`ComputePoseParam_MoveYaw`, `:1566-1620`). The movement yaw is taken from the velocity's direction each frame (`EstimateYaw`, `:1649-1683`).
- **Playback rate** = speed over the clip's ground speed (`:1070-1092`). The ground speed it divides by is re-sampled 10 times a second and interpolated (`:1221-1246`).
- **The feet and torso:** while moving, the feet face where the eyes face, and the directional blend covers the difference (`:1716-1720`). Standing, the feet stay within 45° of the eyes (`:1733-1741`). They turn at 720°/s through `ConvergeYawAngles`, which scales the step by the remaining angle over 60° (so it slows inside 60° and never overshoots, `:1793-1823`). The torso's aim (`body_yaw`) is the eyes less the feet (`:1768-1771`).
- **No lean:** checked, `grep -iE "lean|tilt|roll" multiplayer_animstate.cpp` → no code hit. This shared animation state has no procedural lean.

**Gestures over the base (source):** `src/game/server/BaseAnimatingOverlay.cpp`.
- **The layers:** each has a priority and order (`AllocateLayer`, `:682`; `SetLayerPriority`, `:758`).
- **The weight:** it ramps in over the first `blendIn` fraction of the layer's cycle and out over the last `blendOut`, then through a smoothstep `3w² − 2w³` (`:162-188`).
- **Use:** the multiplayer animstate plays flinches this way (`PlayFlinchGesture`, `multiplayer_animstate.cpp:371`).

**The climb (source, Booth's slides, streams 32–37; © Valve):**
- It is found by hull traces: the obstacle, then the space above, then the first clear trace from lowest to highest (the ledge), then a trace down for its height, then traces stepping back for its forward edge.
- It is performed by: "Pick closest match animation from dozens of motion captured climb animations of various height increments" (stream 37).
- inferred: with `MOTION_CONTROLLED_XY/Z` above, the climb animation itself moves the bot through the climb.

**The authoring docs (L4D's own model, sequences, activities):** not reached.
- The Valve Developer Community refused my fetch (403).
- A search found only a stub for the infected entity, and the general 9-way (`move_x`/`move_y`) and 8-way (`move_yaw`) blend convention L169 already cited.
- **inferred:** the infected used the same directional pose-parameter blend. Not confirmed for their models.

## 2. His reports → what Valve did → source → what it means for our rig
| His report | What Valve did (source, Source 1 SDK licence unless noted) | What it means for us |
|---|---|---|
| **Item 146 / 151: the lean jitters, then lags the turn** | **No lean in the shared animation state** (`multiplayer_animstate.cpp`, grep). Momentum reads from **facing and travel kept apart**: the facing turns at a capped yaw rate (`NextBotGroundLocomotion.cpp:1413-1438`), the velocity keeps its momentum against sideways friction (`:157-181`), and the legs run along the velocity relative to the facing (`move_x/move_y`, `multiplayer_animstate.cpp:1566-1620`). | inferred: Valve's "lean" is the legs running diagonally under a body still facing the old way: a slide, not a tilt. **The sources disagree on this.** Overgrowth (L176, Apache-2.0) tilts the body by its acceleration. Both draw from the body's real motion, not from an estimate of the turn. |
| **Items 129–130: chasers slosh round corners behind him** | The velocity carries through the corner (lateral friction, `:157-181`) while the facing turns at its own capped rate (`:1413-1438`). | Our chase moves along its heading (`chase/chaser.cpp`, the step is heading × speed), so velocity and facing are one, and **there is nothing to draw a slide from.** That half is A's (SLIP, L170). Once velocity and heading differ, `gait_pose` can run the legs along the velocity under a body facing the heading, the procedural form of the 9-way blend. **Ours** until then. |
| **L173's look at 619°/s; the head whips** | The head turns at up to **1000°/s**, eased out by a sine inside about 45° and in over 0.25 s, pitch at half rate, the target tracked with lead and randomised slop (`NextBotPlayerBody.cpp:17`, `:209-239`, `:296-315`). | inferred: **our 619°/s is not too fast by Valve's measure:** their cap is higher. What we lack is the **eased ends**. A head that starts and stops with continuous rate doesn't read as whipping. |
| **L173's un-eased body yaw** | Facing: a fixed maximum yaw rate (`:1413-1438`). Feet: `ConvergeYawAngles`, slowing in proportion inside 60°, never overshooting, 720°/s (`multiplayer_animstate.cpp:1759`, `:1793-1823`). | A capped-rate yaw that slows in proportion near its goal is the simplest sourced form. It is the same family as Holden's damper (L176, MIT). |
| **Speed tied to the gait** | Playback rate = speed / the clip's ground speed (`:1070-1092`). The blend's length is scaled by speed / max (`:1611-1616`). Per-bot playback-rate variation (`NextBotBodyInterface.h:73`). | Our gait advances its phase by distance (`stage.cpp:269`), which is the procedural equivalent. **New:** a small per-chaser rate variation, so a group doesn't step in unison. |
| **Stumbles, flinches, overshoot recovery** | Gestures on overlay layers, weight blended in and out with a smoothstep (`BaseAnimatingOverlay.cpp:162-188`); flinches played as gestures (`multiplayer_animstate.cpp:371`); `ACTIVITY_TRANSITORY` (`NextBotBodyInterface.h:72`). | A stumble or flinch is a short additive pose over the gait, faded in and out by a smoothstep over its own clock, not a new state. It fits `gait_pose` as an offset with a weight. |
| **The climb reads poorly (L161)** | Pick the nearest of dozens of captured climbs by height (Booth stream 37, © Valve). The animation can drive position (`MOTION_CONTROLLED_XY/_Z`, `NextBotBodyInterface.h:70-71`; `NextBotGroundLocomotion.cpp:192-196`). | Our chase already knows a climb's height and progress (`chase/chaser.h:88-89`). The Valve way needs clips (L169 option C). The procedural way is Overgrowth's grips (L176). They disagree on means; both key the climb to the ledge's measured height. |
| **Item 147: the first-person body, look-back clipping** | The torso's aim follows the eyes through a pose parameter (`body_yaw` = eyes − feet, `multiplayer_animstate.cpp:1768-1771`). The feet hold within 45° when standing (`:1733-1741`). | inferred: a split of eyes, torso and feet like Valve's is what our `glanced()` (`game/body.cpp:145-153`) does in two parts. Valve's sources don't address a first-person camera inside its own body. **Ours.** |
| **Arousal (not reported, but the lesser chasers' arc)** | `NEUTRAL / ALERT / INTENSE` body states pick the animation set (`NextBotBodyInterface.h:106-119`). | Our chase modes could pick gait parameters (idle shuffle, alert walk, intense run). **Ours** to apply. |

## 3. The first build step the sources agree on
**The head and the facing: a capped turn rate with eased ends.**
- Valve's head: 1000°/s, a sine ease-out inside ~45°, a 0.25 s ease-in, pitch at half (`NextBotPlayerBody.cpp:296-315`).
- Valve's feet: a proportional slow-down inside 60° (`multiplayer_animstate.cpp:1793-1823`).
- Holden's damper (L176, MIT) is the same idea as a spring.
- Every source here does this. It answers L173's open look and yaw directly, and it touches no lean.
- **Its bar, registered before building:** the look's turn rate is continuous at the start and end of each look (no step in rate above, say, 200°/s within a frame), and the head reaches a held target. Both are measured on his run as L173's rows were.

**Where the sources disagree, for him to choose:**
1. **The lean:**
   - **Valve:** no tilt at all; momentum shows as the legs running along the velocity under a body still facing its old way. This needs velocity ≠ heading from A's SLIP first.
   - **Overgrowth:** a tilt from the body's eased acceleration.
   - inferred: they can stack. Valve's comes free once SLIP lands; Overgrowth's is the one that can be built now in `game/` alone.
2. **The climb:**
   - **Valve:** pick the nearest captured climb by height (needs clips).
   - **Overgrowth:** grips procedurally (L176).

## NOT verified
- **Left 4 Dead's own infected:** their models, sequences and activities were not read. The VDC refused the fetch, and no L4D model or QC was available. The 9-way blend for the infected is inferred from the shared multiplayer code and the general convention.
- **SDK 2013 is the Source 2013 multiplayer code,** not Left 4 Dead's own branch. NextBot came from L4D (the plan), but its L4D-specific body (`InfectedBody` or similar) isn't in this SDK; not checked further.
- **Booth's slide numbers** are text-stream counts and may be off by one or two from the slide numbers.
- No build, no run.

## Corrections
None this lap.
