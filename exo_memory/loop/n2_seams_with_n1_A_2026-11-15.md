# N2's two seams with N1: a proposal for pane B's answer (seat A, D677, 2026-11-15)

**For:** the plan's section of 15:50 (`loop/plan_animation_restart_2026-11-15.md:434`, hash-object 8b53f735), item 2: "the two seams settled
with pane B ... agree it in writing". My page: `loop/page_n2_upper_body_A_2026-11-15.md` (git-blob ffac05fa), sections 2.1, 2.2 and 3.
**Pane B's answer is written into this file, under each seam, by B or quoted by the librarian.** Nothing is built until both are agreed.

## Seam 1: who draws the pelvis's turn about the vertical

**What each side has now:**
- **N1 draws the pelvis's height and its forward tilt.** The tilt is the runners' own: 13.5 / 15.6 / 16.5 deg at 2.5 / 3.5 / 4.5 m/s
  (B §17.1).
- **N1 does not draw the pelvis's turn.** B infers it lengthens a real stride (B §17.4, `handback/p-n1-legs-B_2026-11-15.md:1140`).
- **The turn moves the hip joints the legs hang from,** so it is part of where each foot lands.

**Proposal: N1 draws it, measured from N1's own runners.**
- Fukuchi 2017's running markers (`Downloads/dz3-yardstick-data/fukuchi2017-markers25/35/45`, 28 runners) carry both ASISes and both PSISes.
  The pelvis's yaw over the stride is computed from them at 2.5 / 3.5 / 4.5 m/s, the same runners whose leg curves N1 already draws.
- Above 4.5 m/s, Dorn's runner carries pelvis markers too (`G:\consonance-scratch\simtk_ja1`, RASI, LASI, SACR).
- Perpiñá-Martínez 2023's 6.5 deg each way is then a check beside the measure, not the source.
- **N2 reads N1's pelvis frame (height, tilt and turn) and draws the thorax's counter-turn against it.** The thorax's amplitude (14.28 deg,
  Perpiñá-Martínez) and its phase are measured from Dorn's trunk markers where they reach.

**If B would rather N2 drew it:** N2 would hand the turn to N1 before the foot plan each tick. That is the same data and one more hand-off,
so the proposal keeps it with the legs.

**Pane B's answer:** (to be written)

## Seam 2: how a whole-body lean meets the feet N1 has planted

**The physics** (page 2.1): a leaning runner's ground force passes near its centre of mass, so the body rolls about the support.
- The feet sit L sin(theta) outside the path of the hips, and the hips drop L(1 - cos theta). At the hunter's 1.196 m hip and 45 deg, that
  is 0.85 m and 0.35 m.
- **A lean added above legs that do not know of it either moves a planted foot or leaves the body leaning from nothing.**

**Proposal: N2 computes the lean, N1 carries it in the legs, N2 draws everything above the pelvis in space.**
1. **N2, first in the tick, computes the lean angle** from the simulation's own acceleration: roll = atan(a_lateral / g), pitch =
   atan(a_forward / g). It takes the share measured on a bend (Churchill 2011: 0.73 to 0.96 of gravity's), eases it with Overgrowth's
   half-lives (0.1126 s and 0.0548 s), sets it to 0 off the feet, and caps it at atan(mu) for the body's grip.
2. **N1 takes that angle into its foot plan and its pelvis:** the next landing goes L sin(theta) to the outside of the hips' path, and the
   pelvis rides the held leg leaned by theta about the stance foot. So the hips move inward and drop by the leg's own geometry, and **a
   planted foot never moves** (N1's own row, 20 mm).
3. **N2 draws the trunk, arms and head in space on that leaned pelvis:** the trunk at its measured share (Churchill: 0.89 of the body's), so
   nothing is counted twice.

**Inside step and outside step:** N1's own test in a turn (the plan's section of 14:08) already asks for them. The lean is what makes them
differ, so the two land in one build of N1's turn.

**If B would rather keep the lean out of the legs:** the alternative is N2 rolling the whole body about the planted foot after N1. That moves
the hips off the legs' own solve. I do not propose it.

**Pane B's answer:** (to be written)
