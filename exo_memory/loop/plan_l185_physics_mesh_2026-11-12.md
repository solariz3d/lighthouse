# L185: meshing both: a kinematic target that steps like a balancing body, followed by a body whose weight is real (his item 160). Librarian, on L, 2026-11-12 04:1x local

**His words** (160): "would there be a way to sort of mesh both techniques in a unique and cool way? if not do 1"
**Ground:** `handback/p-l183-physics-anim-E_2026-11-12.md` (96135025). Mark source / inferred / ours, as E did.

## The mesh: three layers, each from a source
1. **Where the feet land comes from SIMBICON's balance law, inside the kinematic target.**
   - Source: SIMBICON §3.1-3.3, l.138-176. The swing foot's target is `θd = θd0 + cd·d + cv·v`, from the body's offset and velocity over the stance foot.
   - SIMBICON uses it to keep a simulated body upright. **Here it chooses where the procedural gait puts each foot.** A body moving fast or sideways steps wider, crosses over, or takes a catching step, as a balancing person does. That serves his item 159 (feet crossing, walking backwards).
   - **inferred / ours:** using the law kinematically, without simulating the balance, is our step. No source does exactly this. Its test is his eye plus a registered row (the stance width grows with lateral velocity; a crossover appears on a scripted strafe).
   - **The lean stays in the target** (L180's sourced tilt, L181's chain), so it can still lead the turn (item 151). SIMBICON's own warning, "reacting … rather than anticipating" (l.194-197), is why the lean is not left to physics.
2. **Per-bone physics strength: the legs keyed, the upper body on motors.**
   - Source: Overgrowth `riggedobject.cpp:1276-1293`, per-bone physics weights × `ragdoll_strength`; Jolt `DriveToPoseUsingMotors` (`Ragdoll.cpp:647-724`) with `MotorSettings` (`MotorSettings.h:48-63`).
   - The pelvis and legs hold the target hard, so the steps and the catch stay exact.
   - The spine, arms and head follow on softer motors, so momentum carries through the chain for real: arms swing on after a stop, the torso sways into a corner and settles, and the follow-through the first game faked with springs (item 156's [KINETICS]) comes from the bodies.
3. **Reactions drop the strength for a moment.**
   - Source: Overgrowth's ragdoll state and `WakeUp` (`aschar.as:4850-5110`); Techland (via C's L179 half 2, "react to momentum even after being struck"); Jolt's soft-keyframe sample (`SoftKeyframedRigTest.cpp:40-91`).
   - A wall brushed (hands meet and slide: item 159), a chaser's overshoot into a wall, the catch, a fall: strength falls, physics takes more of the body, then it ramps back.

**So the dial between E's (a) and (b) is per bone and per moment, not one switch.** It is (a) where the game needs exactness and lead, and nearer (b) where it needs weight.

## Kept from L183 §3 (not up for change)
- **Picture only:** a separate `PhysicsSystem` in `game/`, reading the sim and writing nothing back. Replays stay byte-identical.
- ~~**The player's camera and controller are never driven by physics.**~~ **Overturned by his item 161** ("physics could control the camera and controls, it would make sense to me if it is done right"). Now open: see `loop/plan_l186_physics_player_2026-11-12.md`.

## Order (after L181, since the chain is the target)
1. **The rotation skeleton** for the 21-joint body (E's §6.1), round-trip tested. Pure `game/`. **It can start now.**
2. **A hard-keyed ragdoll for the hunter** in its own `PhysicsSystem`. The picture is identical to today, tested pose-equal (E's §6.2).
3. **SIMBICON foot placement in the target** (layer 1), on the hunter, then on the player's gait (with L184).
4. **Per-bone strength** (layer 2): the upper body on motors. Test: replays byte-identical, and the follow-through visible in captures.
5. **One reaction** (layer 3): a wall brush with the hands (item 159) for the player, and the catch for the hunter.
- Each step is its own lap with tests red first, captures, and his eye.
- Cost is read, not timed on L. A timed run on the desktop before more than the hunter and the player get ragdolls.

## His pick for the player (brief 162), after L186 (`handback/p-l186-physics-player-E_2026-11-12.md`)
- **K1:** the eye rides the head body of the player's ragdoll, filtered toward `camera.h`'s springs, with `camera_effects` still taking it to nothing (the Mirror's Edge guard).
- **K2:** the player's arms, torso and head react physically: hands meet walls and slide (item 159), and landings and hits show in the body.
- **Picture only,** in the L185 system. The aim's yaw and pitch pass through untouched.
- **K3 dial (experimental):** inertia on direction reversals only, **off by default**. It is in the sim, so replays must stay byte-identical with the dial at 0. The bots measure input-to-motion and the juke (A's paired method) before his hands.
- **Order:** after L185 steps 1–2, E's L186 §3 steps 2–4. Then the K3 dial as its own lap.
- **Tests (E §3):**
  - (a) replays byte-identical;
  - (b) with `camera_effects` 0 the eye equals today's to the millimetre;
  - (c) the aim equals the input every tick;
  - (d) the K3 dial at 0 changes nothing.
