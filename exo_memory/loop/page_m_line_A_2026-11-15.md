# A line the new body can follow: one page before any code (seat A, D677, 2026-11-15 ~08:10 local)

Packet: `exo_memory/loop/packet_m_line_A_2026-11-15.md` (git-blob b1e63316). No code written for it. Line numbers are dreamzone-3 `a-m1-root`
e040a87 (pushed), checked by grep at 08:05.

## 1. What the hunter is given to follow today
- **The path:** `plan_to` (`chase/chaser.cpp:520`) calls `Query::find_path` (`nav/world.cpp:536`): Detour's A* over the nav mesh's polygons,
  then `findStraightPath` (`nav/world.cpp:372`), the string-pulled line. Its corners are polygon vertices of a mesh eroded by the body's radius
  (`walkableRadius = agent_radius`, `nav/build.cpp:529`; 0.35 m by default, `nav/nav.h:62`). **So every corner sits exactly on the mesh's
  edge, a body's radius from the wall's corner, and every bend is a point turn.** `widen_corners` (`chaser.cpp:144`) can push corners out, but
  only when `line_clearance > 0`, and it is 0 by default.
- **How the root follows it:** it aims at the point `max(1 m, 0.36 s x speed)` along that line (`root_aim_distance`, `:361`), and its speed is
  planned from the point turns (`root_plan_speed`, `corner_rooms`, `grip_point_speed`, M2).
- **When it is replanned:** every `hunter_replan_s` = 0.5 s (`chase/dials.h:30`), from scratch, from wherever the body is, to wherever the goal
  is now (a lead point, the player, a mouth: `chase/run.cpp:724` and its callers). Nothing of the old line is kept. If the goal moves, or the
  body has drifted, the new line can pass the other side of a post (E's 22 degree bend, the hunter's tick 691, read by hand).
- **A drop link:** an edge of the generator's walk graph between two cell nodes (`gen/src/emit.cpp:597-606`), made a nav link as a straight
  segment node to node (`nav/build.cpp:290`). The generator's own words: "downward only, off an edge **or over a rail**" (`core/scene.h:120`).
  Rails are built `kSurfaceRail | kSurfaceVault` (`gen/src/emit.cpp:390`): the world already marks them as something to vault. At his drop,
  the rail is 1.0 to 1.2 m tall with about 2.1 m open above it (`e_ledge.txt`).

## 2. A line made for a body with grip, from the same mesh (what is sourced, what is ours)
- **The line:** the same polygon corridor Detour returns, but the line through it is a smooth curve, not a string. It keeps a room `m` (ours:
  0.2 m) beyond the body's radius from every edge, and it takes each bend on the widest arc the corridor allows. For one bend of deflection θ
  in free width `w`, that arc's radius is `R = w / (1 - cos(θ/2))` (sourced: textbook geometry of the racing line through a corner). Through
  a run of bends, a minimum-curvature curve within the corridor, solved as offsets along its normals (sourced, from memory and not opened:
  Braghin et al. 2008; Heilmeier et al. 2019, TUM; ours until read). This is his own subject: a centreline fitted as piecewise curves, which
  the room's `track-equations` work already does for tracks.
- **The speed along it:** `v(s) = min(top, sqrt(mu g / kappa(s)))`, then a backward pass for braking and a forward pass for acceleration
  within the kind's limits (sourced: the friction circle; Lipp and Boyd 2014's minimum-time speed over a fixed path, from memory).
- **Following it:** the body pursues a point on the line ahead of it (the M2c aim, unchanged), not the string's corners.
- **Replanning without flipping:** the line within the body's braking distance is kept, and only the part beyond it is replanned. A new
  plan that passes the other side of a solid within that distance is taken only if the old side is no longer a way to the goal (ours).
- **Drops:** a drop link is put in a root body's plan only if its take-off clears: the swept fall from the foot at the take-off speed meets no
  solid. Or, if what it meets is marked `kSurfaceVault` and is under the kind's vault height, the drop is a vault then a fall (ours: a
  speed cost for the vault, to be set). A drop it cannot make is never planned, so it is never stood at.

## 3. Predictions, written before any code (the plan's bars are the judge and are not moved)
Arc radius from section 2 with `w` = the corridor across (E's manifests) less 2 x (0.35 + 0.2) m, hunter grip 1.0 (9.81 m/s^2), top 9.2 m/s:
| bend (E's) | free width | widest arc | grip speed on it | predicted time between the gates | predicted lowest |
|---|---|---|---|---|---|
| 22 degrees (corridor 5.1 m) | 4.0 m | 218 m | above top | **<= 0.60 s** | **>= 6.0 m/s** |
| 45 degrees (3.0 m) | 1.9 m | 25 m | 15.6 m/s, above top | **<= 0.60 s** | **>= 8.0 m/s** |
| 90 degrees (4.4 m; 8.1 m of path after it) | 3.3 m, arc capped by the 8.1 m after | ~8.3 m | 9.0 m/s | **<= 0.70 s** | **>= 7.5 m/s** |
Today's law: 0.889, 0.903 and 0.819 s. The 22 degree figure assumes the line keeps one side of the post (section 2's replan rule). The door
post narrows the 22 degree bend's corridor by an amount not yet read, so 6.0 m/s is the prediction and the arc is an upper bound.
- **Drops:** with the take-off check and the vault, **0 of 735 drops stood at**. Of the 166 the body does not take today, **at least 150 are
  rails** a vault clears (registered: the generator says "over a rail"), so **at least 719 of 735 are taken** and the rest are never planned.
- **Wall touches on the ten routes:** contacts above 0.3 m/s from 822 and 659 (M3c's fix, the snapped steps) to **at most 10 per arm**, and
  head-on ticks 0.

## 4. What of the root's contact laws stays, and what goes
- **Stays, as what happens when it does touch:** the body (M1's mass under grip); a refused or snapped step as a contact that keeps the
  speed along the wall less scrape (M3a, M3c); the slide's turn at grip and the brake (corrected law, e040a87; expected to fire rarely); the
  fall swept through the world (M3b).
- **Goes, replaced by the line:** the speed plan over the string's point turns (`root_plan_speed`, `grip_point_speed`, `corner_rooms`), the
  two ways (`corner_feel`) and the turn-to-aim cap, which all exist because the path turns at a point. The full replan every 0.5 s goes, and
  replanning beyond the braking distance replaces it.
- **Left as it is and not landed:** a-m1-root e040a87, with its open items (the slide's end, the drop stood at, M3d's count), stopped by ruling.

## 5. What would show the reading wrong
- **The packet's test, and the first thing to build, before the planner:** a fixed line hand-fitted through E's 22 degree bend from its
  corridor (arcs, one side of the post, no replans), the root following it in the seed-1 arena as the scripted-bends row walks it, and in E's
  staging. **If the root takes it in more than 0.889 s, or under 1.2 m/s at its lowest, the reading is wrong:** then the body's law is the
  cause, and M1's row was the wrong row. Unwelcome and possible, because I have not seen the post's width.
- **Also wrong if** the line itself cannot be laid: the post leaves no arc wider than a point turn on either side (then the corridor, not the
  line, is the limit and the bar asks for a different world).
- **My own stake and bias:** I built the four laws whose times rise. I want the reading to be right, because it says they were not wasted.
  The fixed-line test is cheap and cuts both ways, which is why it goes first.

## Read after the page was written (chair 13:57Z: "the count of the 166 untaken drops by kind ... run it, for the page")
checked: `page_m_line_A_2026-11-15_evidence/e_kinds.txt` (a scratch row in a throwaway tree at e040a87, `m3e_kinds.js`; the ledge reader's flat
casts from 0.5 m behind each untaken drop's foot toward its landing, through the arena's collision, 12 worlds): **all 166 are low walls**.
The lowest clear height is 1.10 m for 19 and 1.20 m for 147. None is a higher wall with an opening, none has no opening by 2.5 m, and none
is clear at the feet. Section 3's prediction ("at least 150 are rails", committed in 742e346a before this read) is met at 166. inferred: they
are the generator's rails (`kSurfaceRail | kSurfaceVault`); the casts read heights, not surface flags.
