# L183 (research only): physics that drives the procedural animation (his item 158). Librarian, on L, 2026-11-12 03:5x local

**His words** (brief 158): "wouldnt be ideal for what we want to make a physics engine itself that drives the procedural animations".
**Rule:** research first, the research is the spec (his 153, 154).

## Already true (checked by the librarian)
- **We need not write a physics engine.** dreamzone-3 builds Jolt v5.6.0. Its `Ragdoll` can be driven toward a target pose by motors, `DriveToPoseUsingMotors` (`third_party/JoltPhysics/Jolt/Physics/Ragdoll/Ragdoll.h:187`, `:193`), or kinematically (`:181`). Jolt is MIT.
- **No ragdoll is used anywhere in the game today.**

## The question
Can the kinetic chain (L181) and the sourced signals (L180) become the **target pose**, with a powered ragdoll **following it under physics**, so that weight, momentum, impacts and stumbles come from the bodies themselves?

## Read, with the source line for each finding (mark: source / press / inferred / ours)
1. **Jolt's ragdoll and motors:** `Ragdoll.h` and `.cpp`, `SkeletonMapper`, the motor settings on `SwingTwistConstraint`. Jolt's own samples (`Samples/Tests/Rag doll/`, the "powered rag doll" test).
   - How a pose is followed, at what cost per body, and **whether it is deterministic** at our 240 Hz tick. The sim and the run replays depend on determinism.
2. **Physics-based locomotion research:**
   - SIMBICON (Yin, Loken, van de Panne, SIGGRAPH 2007): a simple biped controller with balance feedback;
   - DeepMimic (Peng et al., 2018): learned, likely out of reach, read for what it says about the target-pose-plus-physics structure;
   - Geijtenbeek's survey of physics-based character animation (2012).
   - Read the papers; cite the lines.
3. **Shipped games:**
   - NaturalMotion's Euphoria (GTA IV, Red Dead): press, and any developer text;
   - Techland's active ragdolls ("All about zombies", 2025, read in L179 half 2);
   - Overgrowth's ragdoll blending (its code: grep `ragdoll` in `movementobject.cpp` and `aschar.as`, Apache-2.0).
4. **The split that keeps the game fair:**
   - the chase and the catch stay in the deterministic sim;
   - the powered ragdoll is **picture only**, unless a source shows a deterministic way to let it touch the game.
   - The pane says which, with evidence.

## Hand-back: `p-l183-physics-anim-<pane>`
- A table: his reports (146, 147, 151, 152, 156) → what a physics-driven body would change → source.
- The cost per chaser and for the player's body, read from Jolt (not timed: no timing runs on L).
- The **first build step the sources agree on.** Where they disagree, both, for him.
