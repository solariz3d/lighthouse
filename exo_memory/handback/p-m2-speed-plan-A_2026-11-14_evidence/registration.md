# M2, the speed plan ahead of the grip root: registered before code

Pane A on D, ledger D676, packet `loop/packet_m2_speed_plan_A_2026-11-14.md` (git-blob `4caefc2f`, 92 lines, read whole). Written
2026-11-14 ~12:1x local, before any line of M2. Base: dreamzone-3 `a-m1-root` `96d0336` (pushed to the game's remote by name, read back).
Everything below acts on the hunter with `root_law = 1` only; with it at 0 nothing new runs.

## 1. R1 re-registered, as ruled: the bar in the quantity the law limits
The law (`root_tick`): `ω_new` is `ω_old` moved by at most `ease = ω_max(s_new)·dt/kTurnEase` toward what it wants, then held to
`±ω_max(s_new)`, with `ω_max(s) = min(turn_slow, μg/max(s, 0.5))`; `acc_lat = ω·s`. So, per tick,

    Δacc_lat = s_new·(ω_new − ω_old) + ω_old·(s_new − s_old)

- the first part is at most `s_new·ω_max(s_new)·dt/kTurnEase`, and `s·ω_max(s) ≤ μg` at every speed, so **at most μg·dt/kTurnEase**
  (9.81 / 0.08 / 240 = **0.5109 m/s² a tick** at μ 1);
- the second is at most **`ω_max(s_old)·|Δs|`**, with `|Δs|` the tick's own change of speed (never more than `brake·dt`).

**The bar: on every tick, `|Δacc_lat| ≤ (μg·dt/kTurnEase + ω_max(s_old)·|Δs|)·1.001 + 1e-4`.** Its worst case at 9 m/s (μ 1, the
hunter's braking 14): 0.5109 + 1.09·0.0583 = **0.5745 m/s² a tick**, against the old bar's 0.9 there (0.1 rad/s × 9 m/s): no looser.
**Where the body turns on its feet** (`s < μg/turn_slow`, 1.56 m/s at μ 1 and 360°/s), the row also reads the turn rate against that
limit's own ease: **`|Δω| ≤ turn_slow·dt/kTurnEase·1.001`** (6.283/0.08/240 = 0.3272 rad/s a tick).
**Red on the stub of today's rule:** it steps 0.18 rad/s a tick at 9 m/s, a Δacc_lat of about 1.6 m/s², and exceeds grip.
The old bar (0.1 rad/s a tick) and M1's 0.1043 stay in the row's comment. Unchanged in the row: sideways never above grip, no re-point,
through, the arc within 0.5 m at 5.42 m/s, and "too fast, it swings wide". No cap on angular acceleration is added.

## 2. The speed plan (the root's `want`)
Each tick, for a body with the root on and going on the mesh:
- **The stretch ahead** is the path from the body as far as `s²/(2·0.8·brake) + 3 m` along it (`s` its speed now; the 3 m is D665's
  corner span), stopping at the foot of a link. **Margin, registered: the plan brakes at 0.8 of the body's braking**, leaving a fifth
  of it for the forward controller's lag and for a corner it meets turning.
- **Every path point k in the stretch** gets the speed grip allows there: its turn θ_k is the summed turn of the path's points within
  3 m from it (D665's reading, which today is made for the next point only); its room is read from the mesh (section 3); its radius is
  `R_k = room_k·cos(θ_k/2)/sin(θ_k/2)` (the 11-13 registration's form); `v_k = min(top, max(kCreep, sqrt(μ g R_k)))`, and `top` when
  θ_k < 0.2 rad. A link's foot asks 1 m/s, as today; the path's end asks nothing new (today's arrival).
- **The speed now** is `min(cap, min_k sqrt(v_k² + 2·0.8·brake·max(D_k − kArrive, 0)))`, `D_k` the path distance to point k. That is
  the one backwards pass over the stretch in closed form: braking within 0.8 of its own limit reaches every corner of the stretch at
  no more than its speed. Plain arithmetic and `sqrt`.
- It replaces, for the root only, the next-point corner reading (`through`) and `allow`. Today's rule for every other body is untouched.

## 3. The room a corner leaves, read from the mesh
- **`nav::Query::open_along(Vec3 p, Vec3 dir, float max, const Profile&) const`**, in a commit that touches nothing else in `nav/`, with
  its own nav row: the free distance along `flat(dir)` from the mesh point nearest `p` (reach 0.5/1.0/0.5) to the mesh's edge, by a
  Detour raycast (`dtNavMeshQuery::raycast`, deterministic for one mesh, as `find_path` is); `max` if the ray reaches it; **0 when `p`
  is off the mesh or `dir` has no flat length.**
- **Its nav row:** on a `Built` apartment block, at standing places chosen by rule, the same answer twice; never below 0 or above `max`;
  and the answer is the edge: the point 0.05 m short of it along the ray is on the mesh, and, where the answer is under `max`, the point
  0.3 m beyond it is not on the same storey's mesh (reach 0.3/0.3/0.3). Red against a stub that returns 0.
- **The room at path point k** is `open_along(p_k, outward_k, 6)` clamped to `[0.9, 6]` m, `outward_k` the outer bisector of the chords
  of the 3 m of path before and after k (as `widen_corners` reads a corner). Read **once per path, when it is planned**, and kept with
  the body; a body whose path was set by anyone else reads 0.9 for every point. **It feeds the root's plan only.**

## 4. The offscreen chase modes take `--chase-speed`
Red first: an offscreen chase run given `--chase-speed "root_law=1"` is refused today (L211). After: it runs, and the record it
writes (or the model it reports) has `root_law = 1` in its `[speed]` section. The exact mode and check are named in the hand-back once
`game/world/main.cpp` is read; if the offscreen modes write no record, the row reads the app's model instead and says so.

## 5. The rows (red first where marked; contacts printed beside ticks)
- **W1, red first:** head-on wall ticks on the ten L170 routes with the root on are at most 1.25 times today's (the M1 row, kept by
  name). Red today: 9 against 6.
- **W2, red first, route 0's corner by name** (the one contact M1 traced, around (−36.49, −63.02)): no head-on tick within 3 m of that
  point; and the speed with which the body enters the 3 m circle round it is at most 1.05 times the lowest planned grip speed of the
  path's points inside that circle.
- **W3, red first where it is red ("loses all speed"):** at each corner of the ten routes (the walk's corners: 70° or more), the lowest
  speed within a second of it is at least 0.8 of the grip speed the mesh's room allows there (section 2's `v_k` at that point, never
  more than the body's top). Printed at every corner, root off and on; where today's body already meets it, said so.
- **M1's rows stay green:** R1 as re-registered, R2 (12-seed md5 `fa938de45995bd2d13b98ba28fae0c34` with the switch off; the kept runs
  the same on the branch as on main), R3, R4.
- **R5, reported:** the four sweeps of M1, beside M1's table and his 52 and 62.
- **The lap is wrong if** W1 holds only because the hunter crawls: the ten routes' total time with the root on above 1.25 times today's
  (today's sum is printed by the row; M1 read 82.0 against 77.3 s by the librarian's sum).
- **"The planner is not the cause"** is the answer if W2 still makes contact with the plan seeing the corner in time (its planned speed
  at entry at or under the grip speed and the contact still there).
