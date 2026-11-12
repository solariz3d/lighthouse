# L184 (research, then B builds): the player's own body, seen looking down, moving as a real person's (his item 159). Librarian, on L, 2026-11-12 03:5x local

**His words (159, verbatim):** "the player animation needs to look smooth from first person perspective, when the player looks down at their legs and body/arms, they should move how a real person would, looking down at the side, the legs and feet criss crossing eachother, walking backwards, when the charater rubs up against a wall you see their arms and hands touch up against it as you move, the character must interact with the world dynamically too"

## His list, as the registered behaviours (each needs a source before it is built)
1. Smooth from first person: no pops in the body as the view moves.
2. Looking down: legs, body and arms move as a real person's do.
3. **Sideways:** the legs and feet cross over each other (crossover steps).
4. **Backwards:** a real backward walk and run, not a forward cycle reversed.
5. **Against a wall:** arms and hands reach out and touch it, sliding along as you move.
6. The body meets the world dynamically: steps, ledges, doors, other bodies.

## Read (research only; mark source / press / inferred / ours)
- **First-person full-body games, developer texts and talks first:**
  - DICE on *Mirror's Edge*'s first-person body;
  - Techland's GDC 2018 parkour talk (Kulon, named in L179 half 2) and any *Dying Light* text on the player's body;
  - Naughty Dog on hand-on-wall contact (*Uncharted*, *The Last of Us*);
  - any readable *Escape from Tarkov*, *Arma* or *Star Citizen* text on the true-first-person body.
  - Video-only talks are "not readable", as in L179.
- **Crossover steps and strafing in procedural or blend locomotion:**
  - Rosen's stride wheel (L179 half 2);
  - Valve's move_x/move_y blend (L179 half 1, `multiplayer_animstate.cpp:1566-1620`);
  - Holden on direction changes;
  - a gait source for how real feet cross when stepping sideways.
- **Hand contact with walls:**
  - IK reach to a surface probe (Overgrowth's `ledgegrab.as` grip probe; ozz two-bone IK);
  - how shipped games fade a hand onto a wall and slide it.
- **The camera inside the body:** how first-person games keep the eye on the head without clipping the neck or shoulders. B's L174 is the ground truth here; read its hand-back first.
- **Physics:** how L183's powered ragdoll would let the body meet the world (6). Join L183's findings; don't duplicate them.

## Ground already on disk (read first)
- B's L174 hand-back (pending), and L161's body (`handback/p-l161-body-C_2026-11-11.md`).
- L176 (Overgrowth grips, ozz IK), L179 both halves, L180's B part and L181 (the kinetic chain for the player too).

## Hand-back `p-l184-fpbody-<pane>`
- His six behaviours → what the sources did → source line → what it means for `game/body.cpp`.
- The first build step the sources agree on; where they disagree, both, for him.
- Then B builds on the L181 chain, with tests registered red first (feet crossing on a scripted strafe; a hand in contact within N cm of a wall the body brushes; no camera ray meets the body) and first-person captures for his eye.
