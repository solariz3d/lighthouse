# L188 (B builds): the player's body, from L184's research and his picks (his items 147, 159, 163, 173). Librarian, on L, 2026-11-12 05:4x local

**Ground:**
- `handback/p-l184-fpbody-research-B_2026-11-12.md` (1f938809), the research;
- `handback/p-l174-fpbody-B_2026-11-12.md` (41ae3c87), the landed look-back and arm fixes;
- `loop/plan_l181_kinetic_chain_2026-11-12.md`, amendment §3 (the head-first look);
- brief 173 (his picks).

**Base:** dreamzone-3 main 0389b0a (L174 and L181 landed).
**Rule (brief 165):** every step names the source it was read from; a step with no source is marked ours and shown to him with pictures.

## Order (each its own landing, rows red first)
1. **Feet when strafing and backing** (L184's first step, the best sourced):
   - **Strafe:** the trailing foot crosses the midline, in front of or behind the leading one, instead of passing through it (`body.cpp:283` today). Source: Kuntze, Sellers & Mansfield 2009 (CC BY-NC-ND 4.0), crossover against sidestep.
   - **The switch speed** from shuffle to crossover: **no source found** (L184). It is a named dial, marked ours, set by his eye on a capture. Default: the crossover at a jog and above, the shuffle below (ours).
   - **Backward:** toe first, shorter steps, less hip and knee travel, and the knee and foot no longer laid out as if going forward (Balasukumaran et al. 2020; PMC7664179; Donno et al. 2023 abstract).
   - **Rows:** L184 rows 1 and 2.
2. **His picks (brief 173):**
   - **A shoulder sliver on the look-back:** Rust's tuck (Newman, "Rusty legs"), combined with L174's neck pivot, as L184 says they can be. A shoulder edge stays at the picture's edge. Row: the shoulder covers a small band at the edge and never the centre (the band's size ours, set from captures).
   - **A loose fist** at the top of the sprint swing (the hand's finger curl, ours, in the rig).
   - **The leading leg shown in a slide** (Rust's view pull and bone moves; Catalyst's "staged to be read", Odeldahl).
3. **The head-first look** (163; plan_l181 amendment §3):
   - The head leads, the chest follows with a lag, and the hips follow the travel. Sources: the first game's [STEER], Valve's eyes/torso/feet split, ozz's weights, Holden's springs.
   - It replaces `glanced()`'s fixed 50° chest split.
   - Row: the peaks come in the order head, chest, pelvis.
4. **The slide-blend hitch** B found (2 frames, `Body::tick` blend weights). Row: no wrist step above 3.5× its mean across the run-to-slide blend.
5. **The hand on a wall** (159):
   - `HandOverride` with a probe: Overgrowth's grips (`ledgegrab.as:197-215`, Apache-2.0) and ozz's two-bone `soften` (MIT).
   - No shipped first-person text was found, so the technique is ours, composed from code sources. His eye is the test.
   - Row: L184 row 3.

**Captures for each step:** first-person bursts on his runs (`--capture-fpburst`), plus a scripted strafe, backward walk and wall run. Brightened copies are made beside the stills.
**Physics (L185 layers; K1/K2 from brief 162)** comes after these. It is not in this lap.
