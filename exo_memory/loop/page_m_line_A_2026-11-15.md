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

## Before the fixed-line test runs (2026-11-15 ~08:25 local): what the map of the 22 degree bend shows
checked: `page_m_line_A_2026-11-15_evidence/l_map.txt` (the walkable mesh in 0.25 m cells around the bend, a scratch row; today's string path
printed beside it). **The bend is not a 5.1 m corridor.** It is an L-shaped wall stub (the "post"), and there are two near-equal ways round it:
- **south** (today's string): through a doorway in the wall at x -75 (free mesh only about z 40.4 to 40.6) and 2.2 m on a doorway in the wall
  at z 42 (free only about x -76.75 to -76.5). A line through both needs about a 2 m radius.
- **north:** from the doorway at x -72 (free about z 40.4 to 40.6), up through a gap about 2 m wide (x -74.5 to -72.5 at z 42) into the open
  room (z 42.5 to 47.5), then straight to the target. As strings: north about 15.7 m, south about 15.8 m, which is why replans flip.
**Correction to section 3:** the 22 degree arc (218 m) used E's "corridor across 5.1 m", which does not see the doors. It is withdrawn as
arithmetic. The registered prediction (no more than 0.60 s, never under 6.0 m/s) stands as registered.
**The line the test lays (by hand, chosen now):** north of the post. The string from the door to the doorway at x -72, then an arc through the
doorway and the gap of radius about 5 m (inferred from the map: grip speed about 7 m/s), then a left arc in the open room toward the target,
then straight to it. Every sample is checked on the mesh by the test itself; the radii are set by hand from the map until every sample is on
it, and are printed. The test runs in the chase's arena at gen seed 1 (the scripted bends row's stand-in for E's staging), no replans, both ways.

## The fixed-line test (ruling item 1): THE READING HOLDS
checked: `page_m_line_A_2026-11-15_evidence/ln_test.txt`, dreamzone-3 branch `a-mline` 6f7279a (the test committed before it ran; off e040a87),
`chase_tests mline_a_fixed_line_north_of_the_post_takes_e_22_degree_bend_within_the_plans_bar`, 1 test, 0 failed:
- the line: 127 samples every 0.25 m (R1 4.6 m, LB 0.8 m, R2 8.0 m), **0 off the mesh**.
- **way (b) and way (a) alike: 0.321 s between the gates (the plan's bar 0.889 s), lowest 5.76 m/s (bar 1.2), 0 contacts, 0 head-on ticks,
  peak sideways 9.81 m/s^2 (its grip)**, walked to the end, passing 1.60 m from the bend's point.
- **My prediction, half met:** time no more than 0.60 s is met; never under 6.0 m/s is **not met** (5.76). inferred: the root's speed plan
  reads the 4.6 m arc as tighter than it is (grip on 4.6 m is 6.72 m/s); not read yet.
- In the chase's arena at gen seed 1 (the scripted bends row's stand-in for E's staging), not in E's staging itself.

## Ruling item 3: the sources opened, and whether single-bend arcs meet the bars (2026-11-15 ~08:45 local)
- **Heilmeier et al., "Minimum curvature trajectory planning and control for an autonomous race car", Vehicle System Dynamics 58(10), DOI
  10.1080/00423114.2019.1631455.** The article's own text was not reachable (TUM's repository answered with a bot check). Read instead: the
  arXiv paper 2309.09186 (sections I-B and III-D: "Heilmeier et al. extend the idea to a quadratic programming (QP) formulation with
  improvements to the curvature calculation"; its decision variables are "the lateral movements of individual discretization points"; the
  objective a sum of squared curvatures), and TUM's implementation (github TUMFTM/global_racetrajectory_optimization, LGPL-3.0: the track is
  a reference line with widths to the right and left along normals; "Minimum curvature (with or without iterative call)"). **Theirs:** a QP on
  lateral offsets along the reference line's normals, minimising squared curvature within the track's widths. **Ours:** applying it to a nav
  corridor, and the room (0.35 m radius + 0.2 m) taken off the widths. Its code is LGPL: the idea only, nothing copied.
- **Braghin et al., "Race driver model", Computers and Structures 86 (2008) 1503-1516.** Full text restricted; the abstract and citing papers
  only: the racing line is a compromise between the shortest path and the least-curvature path. **Theirs:** that compromise. Nothing else
  from it is used.
- **Lipp and Boyd, "Minimum-time speed optimisation over a fixed path", International Journal of Control 87(6) (2014) 1297-1311.** Its text
  was not reachable (Stanford's pages refused the certificate). **Ours until read:** the speed along a fixed line from the friction circle with
  a backward pass for braking and a forward pass for acceleration (the root already does this over its path, M2).
- **Do single-bend arcs already meet the bars?** On E's 22 degree bend, yes: the fixed line is two single-bend arcs (4.6 m and 8 m) and is
  through in 0.321 s at no less than 5.76 m/s. So, as ruled, **the solver for a run of bends waits**; the line from the corridor is built as
  one widest arc at each bend first, and the 45 and 90 degree bends say whether that is enough.

## The line from the corridor (ruling item 2, first step): built, red first, and it makes the bends SLOWER. Not kept.
dreamzone-3 `a-mline` pushed and read back at eb577fce46a915311be3ff2f0e4bcd6cc67704ad (red first 4d0105b, the line eb577fc). checked:
`n_rows_red.txt` (the stub: the string) and `n_rows.txt` (the line), both ways alike within a few hundredths:

| | 22 degrees | 45 degrees | 90 degrees | route contacts (b / a) |
|---|---|---|---|---|
| the string (red) | 1.029 s, lowest 1.78 | 2.179 s, 0.22 | 1.079 s, 1.80 | 383 / 412 |
| **the line from the corridor** | **1.708 s, 0.00** | 1.892 s, 1.20 | 1.325 s, 1.39 (way (a) 0.983 s, 2.26) | 422 / 381 |
| my predictions | 0.60 s, 6.0 | 0.60 s, 8.0 | 0.70 s, 7.5 | at most 10 |
| the hand-fitted line (north) | **0.321 s, 5.76** | | | |

The line is drawn and dense (126 to 140 points, no leg over 0.3 m), but 16, 35 and 3 of its points have under 0.18 m of room. **The plan's
bar fails at 22 degrees and every prediction fails.** The packet's registered sign of degeneration (the next thing built makes the 22 degree
bend slower and is kept) is met by the build. So it is **not kept**, and I stop here rather than tune it after reading.
- **One fix before any drawn-line figure was read:** pairs of close corners with no common tangent made whole stretches fall back to the
  string (the first run printed the string's figures exactly); the failing pair's radii are now halved until the line can be drawn.
- **What the two runs say, inferred and not checked:** (1) the side is the planner's: at 22 degrees Detour takes the south way through two
  doorways too narrow to keep 0.2 m of room either side (named before the run); the hand line, north, is 5 times faster; (2) my fitter judges a
  corner's radius over its neighbours' tangents too, so beside a narrow doorway no radius passes and the corner collapses to a point, which
  the root takes at a crawl.
- **The reading is not touched by this:** the hand-fitted line through the same bend stands (0.321 s). What failed is the way I made a line
  from the string.
- Whole suite 115, 9 failed (the three line rows among them); nav 34, 0; off means off md5 fa938de4..., 18 SAME.

**For the ruling, not built:** (a) the side chosen by the line's time, not the string's length (both sides' lines costed where a replan
could flip); (b) a corner's radius judged over its own arc and half of each tangent, with the room asked of it no more than the corridor
leaves there. Or the solver for a run of bends (Heilmeier's form, ruling item 3), which handles (b) by construction but not (a).

## The side by the line's time and the least-bending line (the ruling at the stop): built, red first, NOT KEPT, the second in a row: a ring before a third
dreamzone-3 `a-mline` pushed and read back at cb9049c732a90534d3f3a36fc672adbcf5f8f6a2 (red c118f37 / 9d23d02, the law cb9049c). checked
`s_rows_red.txt` (the string) and `s_rows.txt`:

| | string (way b / a) | least-bending line (way b / a) | the plan's bar | my prediction | the hand line |
|---|---|---|---|---|---|
| 22 degrees | 1.029 s, 1.78 | **0.792 s, 3.87** (both) | **met** (0.889, 1.2) | 0.60, 6.0: not met | 0.321 s, 5.76 |
| 45 degrees | 2.179 / 2.183 s, 0.22 / 0.00 | 1.908 / 1.846 s, **0.00** | **1.2 m/s FAILED** | 0.60, 8.0: not met | |
| 90 degrees | 1.079 / 1.042 s, 1.80 / 1.60 | **1.183** / 0.967 s, 1.48 / 2.40 | (no time bar) | 0.70, 7.5: not met | |
| route contacts | 383 / 412 | 31 / 12 | | at most 10: not met | |

- **The 90 degree bend way (b) is slower than the string (1.183 against 1.079 s): the registered sign of degeneration if kept. So it is not
  kept**, and with the arc fitter before it, this is twice not kept in a row (the ruling's item 5): **I ring before a third.**
- **The side is not chosen at the 22 degree bend:** the body still goes through the doorway at x -75 (26 ticks within 0.3 m of it; 0
  crossings of the open gap), so the side row is red. inferred, not checked: the narrowest throat within 25 m is a doorway both ways share (the
  one at x -72, about 0.2 m of free mesh), so avoiding it leaves no way round and no second line is made.
- **What it did do:** the line is dense and keeps its room almost everywhere (1, 1, 0 points short); the 22 degree bend is under the bar for
  the first time from a planner (0.792 s); wall contacts on the ten routes fall from about 400 an arm to 31 and 12.
- **The cost (ruling item 4):** one plan_to for one root chaser, mean 1929 us, largest 4976 us (the string's: 13 us). For every chaser every
  0.5 s, that is about 4 ms of every 500 ms per root chaser at the mean. inferred: the 600 relaxation passes and two searches are most of it.
- nav: `find_path` unchanged (nav_tests 34, 0 failed). Whole suite 117, 9 failed. Off means off md5 fa938de4..., 18 SAME.

**For the ruling, not built:** the side's throat taken as the narrowest place on the string that the two ways do NOT share (where the
string first leaves the corridor the hand line takes), not the narrowest overall; and the 45 degree bend's stop read tick by tick before
anything else is changed.

## The third try (the ruling at the ring before a third try, git-blob 7a82accd): the 45 degree read, the unshared throat, the cost
dreamzone-3 `a-mline` pushed and read back at **1cdce2076e0d781d64191ab10631ed0b23bc0470** (the tip; the base cb9049c; red first e2b7fb4, the
cost row made a gate by name). Registered before code: `registration_third_try.md`. checked `t_rows_red.txt` (the base) and `t_rows.txt`.

**1. The 45 degree read (no change, `r45.txt`):** the body stops by the brake's reversal. It is sliding with its velocity pointing away from
the aim (heading -86 swinging to -176 while the aim is +44 to +20); the brake from tick 841 brings it to rest at tick 871 (`slide_brake` 2)
and it creeps off the other way at 0.04 to 1.14 m/s, moving about 0.2 m in 60 ticks. It is 0.66 m off a line whose bend there has a
0.84 m radius at the minimum room (0.20 m), where the plan asks the creep speed. inferred: the contact that set the slide is before the
printed window, at a narrow, sharp place the line is pinned through.

**2. The side by the unshared throat: NOT achieved.** The body still goes through the doorway at x -75 (26 ticks within 0.3 m of it, 0
crossings of the open gap). inferred, not checked: a polygon under the doorway at x -75 also spans part of the room the open side crosses,
so the avoiding search's way round still passes one of the avoided polygons and the throat is skipped as shared; polygons are too coarse a
unit for "the place the two ways do not share".

**3. The cost (levers: over-relaxation 1.8 with a stop at 1 mm, at most 200 passes; the line over the first 30 m only):** one plan_to for one
root chaser, **mean 932 us, largest 1767 us** (base 1946 / 4418). **The gate (1000 us) FAILS at the largest.** Where it went before
(`tp.txt`): the relaxation about 1200 us of a line's 1400 to 1500, the widths 160 to 240, the search 5 to 11.

| | the base cb9049c | the tip 1cdce20 | the string | the hand line |
|---|---|---|---|---|
| 22 degrees (way b) | 0.792 s, 3.87 | **0.792 s, 3.92** | 1.029 s, 1.78 | 0.321 s, 5.76 |
| 45 degrees (b / a) | 1.908 / 1.846 s, 0.00 | 1.837 / 1.842 s, **0.00** | 2.179 / 2.183 s | |
| 90 degrees (b / a) | 1.183 / 0.967 s | 1.108 / 0.942 s | 1.079 / 1.042 s | |
| route contacts (b / a) | 31 / 12 | **82 / 44** | 383 / 412 | |
| plan cost, mean / largest | 1946 / 4418 us | **932 / 1767 us** | 13 us | |

- No bend is slower than the base (my registered 5 per cent bar holds). The 22 degree bend stays inside the plan's bar.
- **Worse than the base:** route contacts (82 and 44 against 31 and 12), the brake row (2 aim-behind ticks not braking against 0), the new
  kind (9 of 10 routes on the root against 10). inferred: the line converges less with fewer passes, and a line that ends at 30 m turns to
  the string there, which is where these come from.
- Whole suite 117, 12 failed (the base's 9, plus the new kind, the brake row and the cost gate); nav 34, 0 failed; off means off md5
  fa938de4..., 18 SAME and the same 2 cab3530 runs DIFFERENT.

**For pane E's films beside today's law:** the tip 1cdce20 at the three bends (it is the faster of the two there). If the films are to show
the fewest wall touches between the bends, the base cb9049c instead. Both are on `a-mline`.

## After the third try's ruling (git-blob 121179e1): the correction taken, the 45 degree cause, and the side in five lines before code

**The correction, taken:** in the stand-in today's law takes the 22 degree bend in 0.642 s (lowest 3.94); the line's 0.792 s is 0.15 s slower,
not inside the bar. My table's "bar met" is withdrawn with the librarian's sentence. The base is cb9049c (dreamzone-3 a-mline 3f0cf4f puts
its law back; the third try's two levers are out).

**The 45 degree cause, named (no change; `r45b.txt`, the base law):** a wall contact at ticks 773 to 774 set the slide along the wall at
-128.7 degrees while the aim was +58: about 187 degrees off, almost exactly behind. The corrected slide law turns the velocity the short way
toward the aim at its allowed rate, and every tick the short way is "decreasing" (the velocity is nearly opposite the aim and the aim drifts
from +58 to +44), so the velocity sweeps -129 to -180 to +166, **away from** the wall (its outward side about +141 degrees). The brake fires
only when the turn points into a wall, so for about 70 ticks the body turns nearly 180 degrees at the creep speed instead of braking; it brakes
from tick 841 (when the turn at last points into the wall), rests at tick 871 and reverses. The heading eases after the velocity, which is why
against the aim it looks like the long way round. **A fault of the slide law, not of the line:** with the aim more than 90 degrees behind the
velocity, a turn at grip is the slow way and braking to rest and leaving toward the aim is the fast one. Mine to fix, red first, after the side.

**The side, five lines (the ruling's reading taken: price the squeeze in the one search; the old law's search untouched):**
1. **How:** a root body's own search prices each opening it crosses: crossing from one polygon to the next through a shared edge narrower than
   1.0 m adds the time a body with grip loses there, written as metres at its top speed, so the one search returns the open side whenever the
   squeezes on the other cost more than the extra length. No second search and no comparison; the throat and avoid-list code of cb9049c goes.
2. **The unit:** the portal, the edge two polygons of the eroded mesh share, its length the opening's free width. Detour's header documents
   `getCost` as the cost across the current polygon to its portal into `nextRef` (`DetourNavMeshQuery.h:62-79`), and the current polygon's
   link to `nextRef` names that edge, so the filter can read the width there (scaled by the link's part of the edge at a tile's border).
3. **The price (ours):** `(v - v_w)^2 (1/(2b) + 1/(2a)) / v` seconds, times `v` for metres, with `v` the top speed, `b = min(brake, mu g)`, `a` the
   acceleration, and `v_w = min(v, sqrt(mu g max(w, 0.1)))` (a body cannot swing wider than the opening where the way turns there). It is carried
   by a new `nav::Profile` field that is zero (off) for today's law; only `profile_of` for a body on the root sets it.
4. **What it costs a plan:** a link walk for each polygon the search expands, in the one search; the string's 13 us stays about the same, and the
   line's relaxation remains the cost the gate is about.
5. **What would show it wrong:** with the open side taken, the 22 degree bend in the stand-in is still over today's 0.642 s (registered by the
   ruling: then the line-maker is the cause); or the price sends a root body round straight doorways it could pass at speed (the ten routes'
   bend times worse than the base cb9049c's by more than 5 per cent).

**The bends row (ruling item 2), by name before it runs:** today's law runs through the same three bends in the same arena beside the line; the
bar at each bend is today's time there; the 0.889 s constant leaves the row.

## The side priced in the one search: built, red first, and the open side taken. The one ring for items 1 to 3, with the staging numbers of 5
dreamzone-3 `a-mline` pushed and read back at **4b039851e8ea8c3507cc2a7d723a871787179e4e** (red first 8143c0d: the base law cb9049c, the
bends row carrying today's law as its control; the base's law restored at 3f0cf4f). checked `q_rows_red.txt` and `q_rows.txt`.

**1. The side (the five lines above):** the open gap taken at the 22 degree bend and kept over 8 replans (crossings of the gap 1, ticks near
the doorway 0): **the side row green** (red at 8143c0d: 0 and 26).

**2. The bends, today's law beside the line in the same arena (the stand-in):**

| bend | today's law (the control) | the line, way (b) / (a) | the base cb9049c | my prediction |
|---|---|---|---|---|
| 22 degrees | 0.637 s, lowest 3.94 | **0.321 s, 6.12** (both) | 0.792 s, 3.87 | 0.60 s, 6.0: **met** |
| 45 degrees | 1.296 s, lowest 0.71 | **0.492 / 0.500 s, 6.33 / 5.94** | 1.908 / 1.846 s, 0.00 | 0.60 s, 8.0: time met, lowest not |
| 90 degrees | 0.846 s, lowest 3.46 | **1.183 / 0.967 s, 1.48 / 2.40** | the same | 0.70 s, 7.5: not met; **slower than today: red** |

The ruling's registered bar for the side (with the open side taken, the 22 degree bend in no more than today's 0.642 s in the stand-in): met,
0.321 s, which is the hand line's own figure. The five lines' falsifier (the ten routes worse than the base by 5 per cent): not fired; the ten
routes' total time 81.02 / 77.74 s (base 82.63 / 79.98; today 77.11). Route contacts 31 / 6 (base 31 / 12).

**3. The 45 degree cause** is named above (the slide law turns a velocity nearly opposite the aim instead of braking; not changed yet). With
the side priced, the 45 degree bend in the stand-in no longer stops (lowest 6.33 / 5.94), so the fault's own fix is still owed, red first,
on a place that shows it.

**4. The cost: the gate FAILS.** One plan_to for one root chaser: mean 1647 us, largest 1878 us (gate 1000). The side costs almost nothing
(one search); the relaxation is the cost, as `tp.txt` measured. The lever the ruling names (keeping the line between plans) is not built yet.

**5. Pane E's staging, numbers only (my copy of E's tree, ff6151c's film tool, with a-mline 4b03985's chase and nav; `g_e*.txt`):**

| bend in E's staging | today's law | the line, way (b) / (a) |
|---|---|---|
| 22 degrees (the plan's bar: 0.889 s, 1.2 m/s) | 0.889 s, lowest **0.038** | **0.486 s, lowest 5.47** (both): inside the bar, and faster than today |
| 45 degrees | 0.903 s, lowest 2.83 | **not comparable:** at E's bend the root hunter "never came through the entry gate in 5760 frames" (inferred, not checked: the squeeze price sent it another way round), so the tool took another 45 degree bend (apex (-63.19, -6.96, 5.51)): 0.778 / 0.819 s, lowest 1.90 / 2.54 there, where today's law was not run |
| 90 degrees | 0.819 s, lowest 3.86 | **1.319 / 0.972 s, lowest 1.41 / 2.30: slower than today** |

Whole suite 117, 8 failed (base 9: green now H2, the scripted bends row, the side; red now the cost gate, and the brake row, which sees no
aim-behind slide way (a) and is red by its own rule that a row seeing nothing is red); nav 34, 0 failed; off means off md5 fa938de4..., 18 SAME.

**What is open, named:** the 90 degree bend (slower than today in both arenas); the cost gate; the slide law's fault at a velocity nearly
opposite the aim; the 45 degree staging comparison (where does the root hunter go at E's 45 degree bend). **No film:** the 90 degree bend would
show him a hunter slower than today's.

## The ring for the side's ruling (git-blob 4742072e): the two reads and the slide law's red row

**Read 1, the 90 degree bend (no change; `r90.txt`, `h90.txt`, scratch rows):**
- **The place:** a crossroads. An east-west corridor with about 2 m of free mesh (z -26.5 to -24.5) crosses a north-south one with about 2 m
  (x -11.5 to -9.5); south of it the way widens into a small room (z -30.5 to -32.5) and jogs west into a corridor at x -14.5 to -12.5 to the
  target. Today's string turns at a point on the inner corner, (-11.75, -26.75).
- **The line (4b03985) hugs the inner side:** it runs at z about -26.42 with 0.20 to 0.40 m of room, and at the corner its radius is about
  0.9 m (the line's points within 8 m and the radius at the body, tick by tick). The plan asks 2.0 to 2.5 m/s there and the body falls from
  8.6 to 1.48 m/s at about tick 820, beside the inner corner, untouched. inferred, not checked: the relaxation moves each point only along its
  normal from the string, and at the string's corner those normals fan, so the line cannot swing wide into the crossroads.
- **A hand line, the judge of the place:** the corridor's north side, a right arc tangent to it and to the south corridor's east side (room 0.2 m),
  then straights through the small room to the target, every sample on the mesh, the root following it with no replans:
  R 5.0 m: 0.679 s, lowest 4.94; **R 6.0 m: 0.575 s, lowest 5.52, no contact**; R 6.5 m: 0.588 s, lowest 5.61, 1 contact. Today's law here
  0.846 s. **The registered line does not fire: a hand line beats today's time, so the place allows it and the line-maker is the gap**, at the
  corner, where it keeps a 0.9 m radius on the inner side and the hand line swings 6 m wide through the crossroads.

**Read 2, where the root hunter goes at pane E's 45 degree bend (`t45_trace.txt`, E's staging, `--chase-speed "root_law=1"`):** from the door
(-3.54, 77.51) it goes **north** (z 77 to 91), then west along a northern corridor (z about 89 to 88) at up to 9.35 m/s, and reaches the
player at (-31.86, 86.42) at tick 3669, where the run ends. It is never nearer the 45 degree apex than about 11 m. inferred, not checked: the
squeeze price sent it round the north way; E's 45 degree bend is not on its route at all.

**The slide law's red row (`sr_rows.txt`, dreamzone-3 a-mline 1851018, on the tip's law 4b03985):** check 2 and the brake row restated by
name to the ruling's wording (the acceleration along wanted minus current, no less than 0.9 of what grip allows, less what the wall refuses;
the 03:28 turning check withdrawn by name), and a row from the base's 45 degree bend at tick 773 (the body set as it stood):
- check 2: way (b) 54 of 118 sliding ticks under 0.9 (least -0.156); way (a) 15 of 15: **red**.
- the brake row: way (b) 1 of 53 under; way (a) no aim-behind tick at all: **red** (by the row's own rule).
- from tick 773's state: 58 of 90 ticks under (least 0.625): **red**.

**Next, without waiting, as ruled:** the slide's steering as one law (accelerate along wanted minus current, no larger than grip, less what the
wall refuses; the brake case goes into it), then the cost (keep the line between plans; a cold line spread over ticks by a count), with the bends
row printing the exit gate's tick from the common start. The 90 degree line-maker gap is named and not built in this lap.

## The ring for the two reads' ruling (git-blob 4cc57b7f): the slide's one law, the passes check, and E's 45 squared

**The slide's steering as one law** (dreamzone-3 `a-mline` 6b4c015; registered `registration_slide_one_law.md`; red first 1851018 / 3a904ac).
checked `o_m3.txt`, `o_rows.txt`, `o_chase_tests.txt`:
- **from the 45 degree bend's tick 773 (the base's state): 0 of 72 ticks under 0.9 of grip along (wanted - current), least 1.000** (red: 58 of
  90): green.
- check 2 restated: way (a) 0 of 78; **way (b) 1 of 254 (least -1.632): red by one tick**, not read yet.
- the brake row: way (b) 0 of 49; way (a) has no aim-behind tick at all (red by its own rule).
- the grip falsifier, its measure restated by name: 1.000. Turned about by hand: 0.
- **route contacts 9 and 4** (were 31 and 6): the routes row green. The ten routes 82.17 / 78.41 s (were 81.02 / 77.74; today 77.11): the line is
  still slower over whole routes, by 6.6 and 1.7 per cent.
- bends, with the exit gate's tick from the common start: 22 degrees 0.321 s, exit tick **697 against today's 724**; 45 degrees 0.492 / 0.500 s,
  **789 / 791 against 1103**; 90 degrees 1.183 / 0.967 s, **954 / 903 against 871**.
- whole suite 118, 8 failed; nav 34, 0 failed; off means off md5 fa938de4..., 18 SAME.

**The passes check (no change; `pc.txt`, a scratch row: bend_least at 1, 100 and 1000 times its passes on the 90 degree bend, way (b)):**

| passes | the line made in | the corner's least radius (within 3 m) | the greatest offset from the string | the bend | exit tick |
|---|---|---|---|---|---|
| 600 (as built) | 1,392 us | 0.90 m | 0.34 m | 1.183 s, lowest 1.48 | 954 |
| 60,000 | 120,004 us | 1.19 m | 0.91 m | **0.867 s**, lowest 3.14 | 890 |
| 600,000 | 1,225,014 us | 1.21 m | 1.02 m | 0.908 s, lowest 2.74 | 902 |

**The line moves with the passes: the librarian's reading holds and mine (the normals fan) is not what limits it here.** The line was never at
its minimum: 600 passes leave it 0.34 m off the string, 600,000 leave it 1.02 m off and still moving. Even then its corner is about 1.2 m and its
time 0.87 to 0.91 s, against today's 0.846 and the hand line's 0.575. **So, as ruled, the 90 degree gap and the cost are one cause, the solver**,
and the cost's lever becomes a direct banded solve with the widths as bounds. Note for the solver's registration: at 600,000 passes the corner
is 1.2 m where the hand line's is 6 m, so whether the least-bending line under these widths reaches the hand line is not shown by this; the
solver will say.

**E's 45 degree staging, squared:**
- the like-for-like figure, the tick each law reaches the player from the same start (`t45_today_trace.txt`, `t45_trace.txt`): **today's law
  3116, the root 3669**: the root reaches him 553 ticks (2.3 s) later there.
- `t45_trace.txt` prints one "nearest to the apex" line for each candidate bend the tool tried: **11.08 m is pane E's 45 degree apex
  (-25.04, 77.51)**, which the root hunter never comes near; **0.05 m is the substitute bend the tool took next (-63.19, 5.51)**. The section's
  "about 11 m" is the first; the file's last line is the second.

## The ring for the passes check's ruling (git-blob d6f36223): the direct solve, its two prints, the red tick, the brake row withdrawn
dreamzone-3 `a-mline` pushed and read back at **b2fc99dad4eba5b42048fec067a56c0baa3f5ee0** (red first aa518ec; the routes' brake row withdrawn
c86d5ab; the solve b2fc99d). Registered: `registration_banded_solve.md`. checked `b2_rows_red.txt`, `b2_rows.txt`, `b2_chase_tests.txt`.

**1. The solve:**
- **the line at its least:** ten times the effort moves it **0.0000 m** on all three bends (red on the passes: 0.23 to 0.33 m): green.
- **the gate:** one plan_to **mean 372 us, largest 596 us** (was 1618 / 1770): green.
- bends, today's law beside, exit tick from the common start:

| bend | today's law | the solve, way (b) / (a) | the one law 6b4c015 |
|---|---|---|---|
| 22 degrees | 0.637 s, exit 724 | **0.271 s, lowest 6.51 / 6.38, exit 669** | 0.321 s, exit 697 |
| 45 degrees | 1.296 s, exit 1103 | **0.458 / 0.467 s, lowest 7.81 / 7.23, exit 787 / 789** | 0.492 / 0.500 s, exit 789 / 791 |
| 90 degrees | 0.846 s, exit 871 | **1.108 / 0.917 s, lowest 1.65 / 2.43, exit 955 / 909: slower than today** | 1.183 / 0.967 s, exit 954 / 903 |

- **Registered and not met:** the 90 degree bend no slower than today's 0.846 s. The unwelcome case I named holds: the least-bending line is
  not the hand line (0.575 s).
- **Worse than the one law:** route contacts 12 / 5 (were 9 / 4; the routes row red again); the ten routes 85.62 / 80.70 s (were 82.17 /
  78.41; today 77.11); the 22 degree line has 2 legs over 0.3 m and 3 points short of room (the room row).
- the side row green. Whole suite 119, 8 failed; nav 34, 0 failed; off means off md5 fa938de4..., 18 SAME.

**The two prints (`ds_prints.txt`, the solve's law):**

| bend | the line's least radius over the whole path | where | the slowest tick within 6 m: the body / the plan |
|---|---|---|---|
| 22 degrees | 0.80 m | 1.95 m from the bend's point | 3.74 / 3.61 m/s |
| 45 degrees | 1.21 m | 2.38 m from it | 2.77 / 3.07 m/s |
| 90 degrees | **0.74 m** | **0.12 m from it** | **1.65 / 2.38 m/s** |

**What they say about 60,000 against 600,000 passes (inferred, not checked):** nearer the energy's least, the line is slower at the 90 because
the least of the summed squared curvature is not the least time. Speed is set by the tightest place, and the least-squares line spreads its
bending but keeps a 0.74 m radius 0.12 m from the 90's point, where the bounds pin it at the inner corner. Braghin's compromise (shortest
against least curvature) names this. The following loses some as well: at the slowest tick the body is 0.73 m/s under the plan.

**2. The red tick of check 2, read (`ds_red_solve.txt`, the solve's run; the slide law is the same at 6b4c015, whose own build could not be made
with the current header):** at the red tick (wanted - current) is tiny, (-0.005, 0.007) m/s, while the velocity changed by 0.033 m/s in the
tick, **7.9 m/s^2, under grip**, about 120 degrees from that dv; touched 0, a clean step. **Neither of the ruling's two cases:** the wall's
refusal is not in it and the law did not break grip. inferred, not checked (the print lacks the slide after the tick): it is the slide's last
tick. The heading met the velocity within 3 degrees, the slide cleared, and the plain root law stepped the body. The measure requires a slide
only before the tick, so it read a step the slide law did not govern, against a dv too small to have a direction.

**3. The routes' brake row** is withdrawn by name (c86d5ab); the row from tick 773's state is the brake's row.

**Next, as ruled:** the price, its own ring: a read of both laws' routes at pane E's 45 degree staging, then five lines, then code.

## The price (the ruling at the ring for the passes check, item 4): the read, then five lines before code

**The read (no change; `rt_today.txt`, `rt_root.txt`: pane E's 45 degree staging, the hunter's first three plans, the search's string with every
place on it narrower than 1 m, the way's turn there 1 m either side, and the squeeze price as built):**
- **today's law's search:** 31.3 m through pane E's 45 degree bend: (-3.5, 77.5) to (-25.0, 77.5), up through (-26.5, 82.0) and (-28.1, 83.6)
  to the player. Three narrow places on it: **free width 0.56 m where the way turns 43 degrees** (the bend's doorway), **0.65 m and 0.61 m where
  it turns 10 degrees**. The squeeze price would charge a root body **4.7, 4.5 and 4.6 m**: 13.8 m.
- **the root's search:** 32.3 m round the north, (-6.4, 77.7) to (-11.5, 87.2) and along z 87.5 to (-25.0, 87.5), then to the player: **no place
  under 1 m on it**. One metre longer as a string, 13.8 m cheaper to the search.
- **The librarian's reading holds:** the price charges an opening as if the way turned inside it. About 9 of the 13.8 m are charged at openings
  passed almost straight (10 degrees), where a body loses nothing.

**The price for the turn, five lines (the ruling's measure; the old law's search untouched as before):**
1. **How:** a root body's search prices the crossing of a portal under 1.0 m by the turn the way makes there. The widest arc a turn of `t` can take
   in a width `w` is `R = w / (1 - cos(t/2))` (the page's section 2), and the loss is that of slowing to `sqrt(mu g R)` and gaining back, in
   metres at the top speed. A straight passage costs nothing; a sharp turn in a narrow opening costs what it costs.
2. **The unit and the turn:** the portal as now (its width from the current polygon's link to `next`). The turn at it: the angle between the way
   across the current polygon (`pa` to `pb`, which Detour hands `getCost`) and the way on into the next polygon (`pb` to the next polygon's centre,
   from its vertices in `nextTile`). Ours, and crude: the search does not yet know where the way goes after the next polygon.
3. **The price:** `(v - v_R)^2 (1/(2b) + 1/(2a))` with `v_R = min(v, sqrt(mu g R))`, `R = max(w, 0.1) / max(1 - cos(t/2), 1e-4)`; it replaces the
   price by width alone (`v_w = sqrt(mu g w)`).
4. **What it costs a plan:** a centroid of the next polygon per expanded portal under 1 m; the plan's 372 us stays about the same.
5. **What would show it wrong (registered in the ruling):** with it the root passes pane E's 45 degree bend or reaches the player there sooner than
   tick 3669; and the side row at the 22 stays green, since the south way turns at both its doorways. **If the 22 goes back through the doorways,
   the turn's measure is wrong.** Also printed: the ten routes' total time beside the solve's (85.62 / 80.70 s) and today's (77.11).

## The release and the energy check (the ruling at the ring for the solve, git-blob 366fb4cd, items 1, 2 and 4): built, and the fork read

**Built:** dreamzone-3 `a-mline` `3845cd8` (pushed, read back), red first at `e8de106`. After each solve with nothing past a bound, the held
offset whose slope `(A a - b)_i` points most steeply back inside its bounds is released, one at a time (the active set's own guard against
flipping; no pair flipped), and the solve runs again; the rounds are capped at 400 times the effort and the cap was not reached.
`registration_release.md` beside this page.

**1. The energy check (registered by the ruling: the solve's is higher): CONFIRMED.**
checked: `r3_rows_red.txt` (e8de106) and `r3_rows.txt` (3845cd8), the energy row → the figures below.

| bend | b2fc99d's solve (red, e8de106) | the release | the passes' at 600,000 | held asking to be let go (red / release) | rounds |
|---|---|---|---|---|---|
| 22 | 0.141053 | **0.017395** | 0.017703 | 21 / **0** | 50 |
| 45 | 0.034271 | **0.020689** | 0.022620 | 2 / **0** | 65 |
| 90 | 0.059555 | **0.042586** | 0.043459 | 5 / **0** | 8 |

The solve stopped well short (on the 22, eight times the passes' energy); with the release it is under the passes' on all three. Both rows green.

**2. The release's other rows** (`r3_rows.txt`, `r3_m3.txt`, `r3_chase_tests.txt`):
- the gate: one plan_to, 15 plans, mean 526 us, largest 766 us: green (bar 1,000).
- check 2 restated (item 4: the slide holds before and after the tick, |wanted - current| at least 0.1 m/s): way (b) 0 of 159 under 0.9,
  way (a) 0 of 195: green. On e8de106 also 0 under (598 / 135 ticks), so the restatement alone turned it, not the release; inferred from
  the two runs, the tick read on the solve was the slide's last.
- the tick-773 row: 72 sliding ticks, 0 under: green.
- the 22's side row: 10 replans, 1 crossing of z 42 in the open gap, 0 ticks within 0.3 m of the doorway: green.
- whole suite: chase 118, 5 failed (the routes' contact row, 11 / 11 against 10; the 22-or-less row; the drop row; the corridor line's bar
  row; the dense row: all red at b2fc99d too, and m2_h1 and both m3c rows red there are green now); nav 34, 0 failed; off means off: 12-seed
  md5 `fa938de45995bd2d13b98ba28fae0c34`, 18 of D's 20 kept runs SAME (the same two cab3530 runs DIFFERENT).

**The bends** (stand-in, exit tick from the start; today's law the control):

| bend | today | the solve b2fc99d, way (b) / (a) | the release, way (b) / (a) |
|---|---|---|---|
| 22 | 0.637 s, 724 | 0.271 s, 669 | **0.296 / 0.300 s, 686 / 687**, lowest 6.87 / 6.85 |
| 45 | 1.296 s, 1103 | 0.458 / 0.467 s, 787 / 789 | **0.446 / 0.450 s, 801 / 802**, lowest 8.11 / 7.56 (way (a) 1 contact) |
| 90 | 0.846 s, 871 | 1.108 / 0.917 s, 955 / 909 | **0.933 / 0.804 s, 915 / 884**, lowest 2.10 / 3.48 |

**The 90's radius** (`dr_prints.txt`, the scratch print on 3845cd8, removed after): least radius over the whole path **1.27 m** (the solve's
0.74 m), 0.23 m from the bend's point; slowest tick within 6 m, tick 838: the body 2.10 m/s, the plan 2.49 m/s (the solve's 1.65 / 2.38). The 22's
least radius 1.67 m (was 0.80), the 45's 1.22 m (was 1.21).

**The routes:** the ten routes' total time way (b) **78.72 s**, way (a) **77.87 s** (today 77.11; the one law 82.17 / 78.41; the solve
85.62 / 80.70). checked: `r3_chase_tests.txt`, "the ten routes' total time".

**3. The fork, as registered:** "if the 90 is taken in no more than today's 0.846 s and the ten routes are no slower than the one law's 82.17 and
78.41 s, the least-bending line stays." The routes: met on both ways. **The 90: met on way (a), 0.804 s; NOT met on way (b), the root's own arm,
0.933 s, 0.087 s over.** I read the condition as not met (way (b) is the arm the line was built for), so as registered **the least-bending line on
the string's normals is not the line-maker for this world, and the next build is straights and the widest arc at each bend, the side chosen by
the price.** What would change that reading: a ruling that way (a) (corner_feel) is the arm judged. The degeneration stop does not fire (the 22
is 0.296 s, under 0.642, and the side is shut).

**What it shows:** at the true least, the line stays least-squares, and the 90's tightest place still sits 0.23 m from the point. The radius
grew from 0.74 to 1.27 m and the time fell 1.108 to 0.933 s, but way (b) still lowers to 2.10 m/s there, while the 6 m hand line of `h90.txt`
took 0.575 s at 5.52. Braghin's compromise, measured a second time.

**Next, in the ruling's order:** the price's code (the turn price, the five lines above; set aside at the scratch, not committed), its own ring;
then the build the fork names.

## The price's code (the ruling at the ring for the release, git-blob 4fdfe2bb, item 1): built, and ITS REGISTERED FALSIFIER FIRED. Stopped.

**Built, not committed:** the five lines above as written (`turn_price.js`, nav/world.cpp only), on a-mline 3845cd8; the tree is back at
3845cd8 and the price is kept aside at the scratch (`tp3_law/world.cpp`). Rows: `page_m_line_A_2026-11-15_evidence/tp3_rows.txt`; E's staging
with the route read: `tp3_e45_root.txt`, `tp3_e22_root.txt` (pane E's tool, a-m3c-e22, with 3845cd8's chaser and the price copied in).

**The registered lines:**
- **"the root passes pane E's 45 degree bend": MET.** checked: `tp3_e45_root.txt` → its route is now today's (31.3 m through the bend's
  doorway, three plans alike), and it crosses both gates: through 0.979 s, lowest 1.94 m/s (before the price it never reached the bend: its
  route went round the north, `rt_root.txt`). Today's law in E's staging: 0.903 s (section 3's table).
- **"the side row at the 22 stays green": FAILED. The falsifier fires: "If the 22 goes back through the doorways, the turn's measure is
  wrong."** checked: `tp3_rows.txt` → replans 9; crossings of z 42 within the open gap **0**; ticks within 0.3 m of the doorway at x -75
  **26** (with the width price: 10 replans, 1 crossing, 0 ticks). The stand-in's 22 is through in 0.792 s (exit tick 772; without the price
  0.296 s, 686; today 0.637 s, 724), passing 0.01 m from the point.
- **In E's own staging the 22 keeps the open side:** checked: `tp3_e22_root.txt` → three plans through (-72.0 40.7) then (-74.8 42.5), the
  doorway at x -72 and the gap; through 0.493 s, lowest 5.50 m/s. So the stand-in and E's staging disagree on which way the price sends the
  root at the 22; the row that was registered is the stand-in's.

**Also printed:**
- the gate: one plan_to, 15 plans, mean 605 us / largest **1090 us** in the rows' run (red), mean 583 / largest 901 us in the whole suite's
  run (green): over the bar once in two.
- the bends (stand-in, way (b) / (a), exit tick): 22 0.792 / 0.792 s (772 / 772); 45 **1.163 / 1.133 s (970 / 963, today 1103)**, lowest
  1.20 / 1.24; 90 0.933 / 0.804 s (915 / 884, unchanged).
- the ten routes' total: way (b) **79.37 s**, way (a) 79.14 s (today 77.11; without the price 78.72 / 77.87).
- route contacts: 13 / 16 (bar 10).
- whole suite: chase 118, **8 failed**: the five red at 3845cd8, the side row, and m2_h1 and m2_h2, both red on way (a) only (way (a) route
  lowest 0.98 m/s under 1.2; one contact over the bar, 6.18 of it); nav 34, 0 failed; off means off md5 `fa938de45995bd2d13b98ba28fae0c34`,
  18 SAME.

**What I do not know yet, inferred and not read:** why the stand-in's search goes south. The route printer's price column is the old width
price, not the turn price, so it cannot say what the turn price charged at x -75 and z 42. My guess is the crude turn (the way across the
polygon against the way to the next polygon's centre) reads the south doorways as nearly straight, because their polygons are long along the
way. The next read, if ruled, prints the turn price per portal on both ways at the 22 in the stand-in.

**Stopped here by the night's rule ("a registered falsifier fires → stop and ring").** The arcs' five lines are not started.
