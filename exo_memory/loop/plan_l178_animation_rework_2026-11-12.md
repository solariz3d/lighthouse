# L178 (queued, after L177 and L174 land): the animation's hard rework toward real procedural movement (his item 152). Librarian, on L, 2026-11-12 03:1x local

**His words:** `briefs/dreamzone2_the_game.md` 146, 147, 150, 151, 152 ("the overall animation as well needs a hard rework, same with the player animation looking down, it needs to be more accurate to real procedural movement").
**Ground:** `handback/p-l176-openanim-C_2026-11-12.md` (c4c9e313), §5's table of what each source fixes; `handback/p-l169-anim-C_2026-11-12.md` (options A–D).
**Learn from, never copy:**
- **Code:** Overgrowth is Apache-2.0; ozz, Holden and Godot are MIT. Ideas are written in our own code; if a line is ever copied, its notice comes with it.
- **Data:** none this lap. LAFAN1 can never ship.

## Split (disjoint files, per the split rule)
- **C, the hunter's body** (`game/model_rig.cpp`, `game/world/world_app.cpp`, `game/world/stage.cpp`):
  1. feet with memory: a per-foot ground height clamped ±0.1 m per frame and eased, the foot tilted to the ground's normal (Overgrowth `movementobject.cpp:2619-2660`, ozz `sample_foot_ik.cc:207-255`);
  2. `soften` in `reach_leg` near full reach (ozz `ik_two_bone_job.h:93-96`);
  3. the look spread over 3–4 spine joints by weight (ozz `sample_look_at.cc:106-160`);
  4. body yaw eased as a direction with a shortest-path slerp and a perpendicular pass near 180° (Holden `spring.h`, Overgrowth `interpdirection.as:25-41`);
  5. a braking and starting lean from the same acceleration signal as L177 (L169 items 129–130).
- **B, the player's body seen looking down** (`game/body.cpp`, `game/body.h`, first-person draw), after L174:
  1. the feet as above, under the camera;
  2. the glance as a weighted spine chain that carries the shoulders with the view (item 147's clip);
  3. the climb with grips: staggered hand and foot phases, sine arcs, weight-bearing valleys, the body at the grips' weighted mean, and a surface probe per hand with a remembered grip (Overgrowth `ledgegrab.as`; our `HandOverride`, `game/body.h:93`).

## Registered before any code (each red on the base first)
- **Feet:** no drawn foot moves vertically more than 0.1 m in one frame on stairs. The hunter's feet are scored over his kept run and the bot's run; the player's over a stair walk.
- **Look:** the head's worst rate falls by at least half from L173's 619°/s, and the head ends on target within 0.2 s.
- **Yaw:** no drawn yaw takes the long way round a 180° turn (a scripted reversal row).
- **The player's glance:** in B's first-person captures, no camera ray meets the kid's shoulder or collar during a look-back (B's L174 method).
- **Fingerprints:** every replay matches both fingerprints. The rework is picture only.
- **His eye is the last bar.** Captures and a build, then he plays it.
