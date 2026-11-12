# L181: the kinetic chain. The whole body moves as one, for every body with a model and for the player (his item 156). Librarian, on L, 2026-11-12 03:4x local

**His words** (brief 156): "kinetic linking, making the whole body work as one. We need to make that but better for all entities and even the player character".
**The first game's version (his design, ours):** `C:\Users\zackn\Downloads\dreamzone-rt\src\main.cpp` (2e04aa5), :6350-6800. Read it whole before building.
- [KINETICS] :6605;
- the twist and counter-twist and the spring-lag follow-through, :6615-6624;
- [TURNLEAN] :6637-6650;
- [COUNTERLEAN] :6660-6670;
- [STEER] gaze, :6595-6604;
- the legs aimed at planted feet;
- the arms opposite the legs.

## Where it goes in the order
- **L180 lap 1 continues** (the tilt from acceleration, the head and facing with eased ends). Those are the **signals**.
- **L181 is the frame that distributes them through the body.** It becomes L180's lap 2, ahead of variation and feet.
- **Lap 1 should not hard-wire a rigid whole-body roll** that the chain must undo. Its tilt and look are outputs a pose function reads.

## "Better" than the first game: each point sourced, or marked ours
1. **On the real skeleton.**
   - The first game was 13 boxes. dreamzone-3 has the MPFB `game_engine` skeleton, whose palette follows parents (`game/model_rig.cpp:344-349`).
   - `gait_pose` today places the chest, neck and head rigidly on one lean (`:510-512`). The chain mounts each segment on its parent: pelvis → spine_01..03 → neck → head, and pelvis → thighs → shins → feet.
2. **The signal is physical,** not the turn rate. The first game's [TURNLEAN] used the smoothed turn rate (:6637-6650), the same flaw as L173. The bank is lap 1's acceleration tilt (Overgrowth `aschar.as:7921-7940`; Rosen step 3).
3. **The bank is shared down the chain:**
   - the first game: hips commit, torso 0.35, head counters by −0.30 (:6660-6670);
   - Overgrowth's balancing shares: hips 0.7, chest 0.5, head 0.4, arms 1.0 (`movementobject.cpp:2680-2685`, Apache-2.0).
   - The pane registers the shares from those two, never invented.
4. **The look is shared up the chain:**
   - the first game: the head leads, the torso goes halfway, the hips follow the velocity (:6595-6604);
   - ozz: weights per joint, the last joint 1 (`sample_look_at.cc:106-160`, MIT);
   - Valve: the torso aim = eyes − feet (`multiplayer_animstate.cpp:1768-1771`).
5. **The gait's counter-rotation:**
   - pelvis twist against thorax counter-twist, the arms opposite the same-side leg (the first game :6615-6618);
   - **a biomechanics source for the amplitudes is required** (a published gait study of pelvis–thorax transverse rotation). The first game's numbers are "biomechanics ranges from research" (:6352) with no citation. The pane finds the study and cites it.
6. **Follow-through:**
   - the torso and head lag the pelvis on a spring (the first game, `SpringStepF` at :6621-6622);
   - Rosen step 10, "spring damper interpolation";
   - Holden's half-life springs (`spring.h`, MIT).
7. **The feet carry the weight:** the legs are aimed at planted feet, and the hips rock over them (the first game, legs, :6689-6700). This joins L180 step 5 (Overgrowth foot ground-height memory; ozz `soften`).
8. **One function for every body:** the hunter now; the player's first-person body (B, `game/body.cpp`) from the same chain. **The lesser chasers draw boxes today** (no model). They get the chain when they get models. **Ours:** the sharing across bodies is a code-structure call, no source.

## His call, before it is built
- **The hunter's wrongness.** The first game's figure was "Human silhouette, non-human motion": 1.22× limb overspeed, asymmetric leg phase, the head pinned down (:6352-6356). Keep that detuning for the hunter, with the player human? Put to him with the captures, not decided here.

## Tests (registered, red on the base first)
- **Propagation:** a scripted pelvis bank of X° moves the chest, neck and head by their registered shares (± 1°), on the posed skeleton.
- **Counter-rotation:** over a gait cycle, pelvis and thorax yaw run in opposite phase (correlation < −0.5), with amplitudes inside the cited study's range.
- **Follow-through:** after a step change in the pelvis, the head's lag peaks later than the chest's.
- L180 lap 1's rows stay green: the timing, straights, rate and look.
- **Fingerprints unchanged** (picture only). **His eye last:** captures of the hunter from behind and from his look-back, and of his own body looking down.

## Who
- **C:** the chain in `game/model_rig.cpp`, the hunter first. L180 lap 2.
- **B:** the first-person body on the same chain, after L174. It joins L180's B part.
