# M2c, the aim ahead: registered before code

Pane A on D, ledger D677, packet `loop/packet_m2c_m2b_A_2026-11-14.md` (git-blob `50c4dc9f`, 119 lines, read whole). Written 2026-11-14
~19:0x local, after R0 printed (below) and before any line of M2c. Base: dreamzone-3 `a-m1-root` `0ba17ea` (pushed). Root only; switches off.

## R0, printed on the present tip (`0ba17ea` + the print), checked: `…_evidence/r0.txt`
At the scripted 15 degree bend (way b, entry 9.20 m/s) the aim (the next path point) is **0.34 to 1.11 m ahead at 13 to 37 degrees** off the
heading, and the pull to turn onto it at the speed held (`v² · 2 sin|α| / d`) reads **31 to 205 m/s²** against grip's 9.81, so the plan asks
**1.67 to 4.86 m/s**. At 90 degrees the aim swings to 83 to 110 degrees and the plan sits at the creep speed. **The cause M2 marked inferred is
now checked.**

## The law (M2c)
- **The aim** is the point on the path `d = max(d_min, T · speed)` ahead of the body along the path (from the body to the next point, then
  point to point; never past the foot of a link, nor past the path's end), with the D664 sway applied to it as to today's aim.
- **Derivation of T and d_min.** Pure pursuit (curvature `2 sin α / d`, R. C. Coulter, "Implementation of the Pure Pursuit Path Tracking
  Algorithm", CMU-RI-TR-92-01, 1992; **from memory, not opened: marked ours until a source is read**). Approaching a bend of θ on the line, the
  largest angle to an aim d ahead is about θ/2 (half the aim on each leg), so the pull is about `v² · 2 sin(θ/2) / d`. For a bend of **22 degrees,
  his free bend, to need no more than grip** at the chase's top at brutal (9.2 m/s, μ 1): `d ≥ 2 v² sin(11°) / (μ g) = 3.29 m`. As `T · v` at
  9.2 m/s: **T = 0.36 s** (3.31 m). Below the top, `T · v` is longer than `v²`'s need, so the bend stays free. **d_min = 1.0 m**: the spacing of
  the path's points, so the aim is never nearer than today's.
- **Pulled in at walls:** while the mesh is not open along the straight line from the body to the aim (`open_along` short of the distance by
  more than 0.05 m), `d` is cut to 0.7 of itself, at most five times, and never below the distance to the next path point (today's aim).
- **The cap and the plan** read the same aim: the cap on the turn is computed to it (`sqrt(μ g d / (2 sin|α|))`), and the steering error is
  the angle to it.

## The two limits of a corner's radius (the packet's)
My `room` is **neither**: it is the free distance along the corner's outer bisector from the path's inside point to the mesh's edge. My formula
`room · cos(h) / sin(h)` has the form of the LEG limit (an arc tangent to both legs at `room` from the corner), with the bisector's clearance put
where the leg's length goes. The row prints, for the four scripted bends (3 m of room taken as the width; legs of 30 m) and for route 0's
corner (the mesh's room and the path's own leg lengths), the width limit `w / (1 − cos h)`, the leg limit `L · cos h / sin h` with the shorter
leg, my formula's value, and grip's speed on the lesser. **The plan's formula is not changed in M2c.**

## Rows (red first on the present tip where they can be)
- **G1, unchanged** (routes 5–22°, scripted 15° and 22°): no wall; lowest ≥ 0.8 × min(entry, grip). **Red today** (`am_chase_tests.txt`).
- **G2, unchanged:** the order never rises.
- **W2, amended by name** (the librarian's ruling 3): no head-on within 3 m of route 0's corner; the entry speed at most 1.05 times the least
  grip speed of the path's points inside the 3 m, **computed for the body as it arrives (its top with its run-up)**.
- **W1, report by bend**, beside M2's 2 and 0. **The unwelcome outcome, named now:** G1 goes green and the head-on ticks on the ten routes rise
  above M1's 9; then the aim is too long, and it is rung before more is built on it.
- **H2, registered again** (ruling 2): from the tick it leaves a wall (the contact's last head-on tick) to back at half its top, at most
  **1.5 × max(0, 0.5·top − s_left) / accel + one tick**, `s_left` its speed on that tick, `accel` its body's. Red on a stub that stands two
  seconds after a wall (`wall_stand=10`: the hunter's 0.2 s times 10), run through the same row.
- **Crawl guard ≤ 1.25; R1–R4; off means off** (md5 `fa938de45995bd2d13b98ba28fae0c34`, D's kept runs as on main).
- **This step is wrong if** G1 goes green by a bar moved, a row dropped, or a bend removed from its list.
