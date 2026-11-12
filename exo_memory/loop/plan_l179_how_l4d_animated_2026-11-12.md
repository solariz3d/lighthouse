# L179: how Left 4 Dead (and the games that do this best) animated their chasers. Research first, then build (his item 154). Librarian, on L, 2026-11-12 03:1x local

**His words:**
- (154) "cant we learn how they did animations too? we need to get them right first"
- (153) "why the fk did we do all the research just to ignore it and do our own thing"
- (129–130) the infected's momentum and inertia, "looking back and seeing them behind you slosh around corners is scary"

**Rule for this lap and what follows:** the research is the spec. L177b (C's lean) and L178 (the rework) **wait** until L179 lands. They are then re-planned from L176 plus L179, with every step citing a source. A step with no source is marked as ours and put to him before it is built.
**Learn from, never copy.** Valve's code and slides are cited, not copied.

## Half 1 (C, now): Valve's own animation, from source and docs
1. **The Source SDK 2013** (`ValveSoftware/source-sdk-2013`; NextBot came from L4D):
   - `NextBot/NextBotBodyInterface.h`, `Player/NextBotPlayerBody.cpp` (head aim, posture, how the body is told what to do);
   - `NextBotLocomotionInterface` (how speed and turning feed animation);
   - `game/shared/multiplayer/multiplayer_animstate.cpp` (move_x / move_y pose parameters, the body-yaw lag and turn in place, how a run blends by velocity, how lean or leaning is or is not done);
   - `baseanimatingoverlay` (layers and gestures).
2. **The L4D / L4D2 authoring docs** (Valve Developer Community: the common infected's model, sequences, activities, pose parameters; the L4D2 SDK).
   - What the infected's runs actually were: how many clips, how they blend, and whether any lean is procedural.
3. **Booth's GDC 2009 slides** (the copy in the librarian's scratch, `booth_l4d.pdf`, sha256 6ae1af1f…, as A cited): every slide about animation, climbing (motion-captured climbs at set heights) and locomotion.
4. **What, in their system, makes a chaser read as alive on a look-back**, sourced line by line. Then map it onto our procedural rig (`game/model_rig.cpp` gait_pose, `game/world/world_app.cpp`).

## Half 2 (the next free pane): the talks
- **David Rosen, "Animation Bootcamp: An Indie Approach to Procedural Animation"**, GDC 2014 (Overgrowth): the talk itself. L176 read the code, not the talk.
- **Horde games' animation talks** (for example Days Gone's Freakers, World War Z's swarm, Dying Light's infected), only those with a readable source. How a crowd's bodies show momentum cheaply.
- **Motion matching and inertialization talks** already cited (Holden, Bollo GDC 2018), read for the parts about a turn's lean and foot plant.

## Hand-back (each half): one table, his report → what they did → source line → what it means for our rig
- Mark sourced / inferred / ours, as L176 does.
- Name the **first build step the sources agree on**. If they disagree, give both, for him to choose.
- Hand-backs: `p-l179-valve-anim-C`, `p-l179-talks-<pane>`.
