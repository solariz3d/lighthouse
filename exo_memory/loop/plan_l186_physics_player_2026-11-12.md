# L186 (research only): physics that drives the player's camera and controls, "done right" (his item 161). Librarian, on L, 2026-11-12 04:1x local

**His words** (161): "physics could control the camera and controls, it would make sense to me if it is done right"
**What it overturns:** L185's line "the player's camera and controller are never driven by physics". That was E's inference from Geijtenbeek l.83 ("physics-based characters are less reactive during direct control tasks"), which the librarian made a rule. It is struck in L185, and the question is open.

## Already true (the pane checks each)
- **The player's movement is already physics**, inside the deterministic 240 Hz sim: Jolt `CharacterVirtual::ExtendedUpdate` (`sim/physics.cpp:476`), with Jolt built `CROSS_PLATFORM_DETERMINISTIC` (`third_party/CMakeLists.txt:7-9`). So the question is not whether physics, but **how much of the body and the camera** the physics owns.
- **A player body on physics must live inside the sim,** not in a picture-only system, because it would change what the player does. Replays must then stay byte-identical: E's L183 §3 lists Jolt's determinism conditions and caveats (`Architecture.md:787-807`).

## What "done right" has to mean, as things to measure (registered before any build)
1. **Responsiveness:** the time from input to visible motion, and to the camera turning, must not grow against today's build. **Aim is never delayed:** the mouse turns the view at once (ours, to be confirmed by sources).
2. **Determinism:** every kept run replays byte-identical; the bot's 150-seed blocks give the same fingerprints twice.
3. **Movement tech kept:** the slide, the surge and the wall run (L171) still work at their registered numbers.
4. **His eye and hands:** a build he plays. The bars above only guard.

## Read (mark source / press / inferred / ours)
- **Shipped games where physics owns the player's body or camera**, with developer text where it exists:
  - *Exanima* (a fully simulated player body);
  - *Human: Fall Flat* and *Gang Beasts* (deliberately loose);
  - *Escape from Tarkov*'s inertia change (and the player response to it);
  - *Arma*'s movement inertia;
  - *Mirror's Edge*'s camera;
  - any true-first-person game whose camera rides a simulated head.
  - **What each did to keep control responsive,** and where players said it was not.
- **The research line:** Geijtenbeek 2012 (E read it: l.83, the direct-control limit), and any paper on physics-based characters under real-time user control.
- **Camera from a simulated head:** how much of the head's motion reaches the eye (bob, impacts, stumble) while the aim stays the mouse's.
- **Jolt:** `CharacterVirtual` against a `Character` (rigid body) controller, and how a ragdoll's upper body could ride a `CharacterVirtual` inside the sim tick, in a fixed order.

## Hand-back `p-l186-physics-player-<pane>`
- Options from fully kinematic to fully physical, each with its source, its cost to responsiveness and its determinism risk.
- The first build step the sources agree on.
- Where they disagree, both, for him.
