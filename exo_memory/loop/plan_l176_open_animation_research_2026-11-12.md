# L176: what open-source animation systems and free motion data can teach us (learn from, not use). Librarian, 2026-11-12 02:2x (L)

His words: `briefs/dreamzone2_the_game.md` item 150. **Research only, nothing built.** It goes to the first pane that frees up; C is
the best fit, since it owns the body and rig. It builds on C's L169 (`handback/p-l169-anim-C_2026-11-12.md`: no clips, a procedural
rig, options A–D), which is not repeated.

**Read and report, each with its licence, so "learn from" is clear:**
1. **Overgrowth** (Wolfire Games). Its engine was open-sourced. Its procedural animation is David Rosen's GDC 2014 "An Indie Approach
   to Procedural Animation": few keyframes plus procedural blending, foot placement and lean. Read the relevant source (the character
   and animation code): how it blends, how it leans into turns, how it avoids jitter. It is the closest match to our rig.
2. **ozz-animation** (runtime blending, IK, two-bone and aim; read its samples for blending and for foot IK).
3. **Daniel Holden's (orangeduck) public code and articles**: inertialization, spring-damper smoothing ("spring-it-on"), motion
   matching, and "code vs data driven displacement". These bear directly on the hunter's lean jitter (item 146) and on L173's spring.
4. **Godot's or O3DE's animation trees**, briefly: how blend spaces are structured.
5. **Free motion data, licences first:**
   - the CMU Motion Capture Database;
   - Mixamo's terms (free use in projects, no raw redistribution: check);
   - Ubisoft's LAFAN1 (licence: check, likely non-commercial);
   - CC0 animated characters (e.g. Quaternius).
   - Say which could ever ship, and which are study-only.

**Return:**
- for each source, the one or two ideas that fit our procedural rig (`game/body.cpp`, `game/model_rig.cpp`, the GLB skeleton
  named like Unreal's mannequin);
- what each would fix in what he reported: the hunter's jittery lean (item 146), the first-person body (item 147), the climb that
  reads poorly (L161);
- file and line in the source, licence beside every claim.
- **Never copy code from a source whose licence does not allow it.**

Hand-back: `handback/p-l176-openanim-<pane>_2026-11-12.md`.
