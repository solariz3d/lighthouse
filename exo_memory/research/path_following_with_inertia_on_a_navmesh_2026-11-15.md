# Following a path with inertia on a navigation mesh: published and open-source methods (a research agent's report, 2026-11-15)

Filed by the librarian on D at his words of 13:29 and 13:37 ("should be everything open source we can access ...", "always take relevant research and use it"). **This is an agent's report, filed whole. The librarian has opened none of its sources.** The agent's marks stand: [read] it opened the source; [snippet] / [not opened] otherwise. The request carried nothing of the game.

## Summary (the agent's)

For this exact problem the best foundation is Detour's own `dtPathCorridor`. It keeps a list of polygons between re-plans, moves the start and the end of that list in small steps, and repairs it locally. So re-planning twice a second does not need to replace the line the pursuer is following. A full replan is a sliced A* query whose partial result is spliced in only where it shares polygons with the current corridor. DetourCrowd's steering on top of that is simple: "anticipate turns" bends the aim direction using the next two corners; velocity changes are capped at `maxAcceleration*dt` (in effect an isotropic acceleration circle); there is no slowing before corners, only near the goal. So the mass-and-grip behaviour has to come from one's own layer.

The published material for that layer is mature but comes from racing and robotics, not games:
- a minimum-curvature line inside the corridor's width limits (Heilmeier/TUM; Kapania et al.);
- a forward-backward speed pass under a friction circle (TUM `calc_vel_profile`; Kapania eqs. 4-6);
- a follower such as pure pursuit or Stanley.

Clearance-aware corridors (Geraerts' ECM and IRM, Kallmann's LCT) supply the width limits these need. The cleanest published rule for keeping a re-plan from flipping the line is Apollo's trajectory stitching: keep the prefix of the old trajectory and replan from its end, unless the vehicle has drifted past fixed thresholds. **No game-AI source was found that joins these pieces for a navmesh pursuer.**

Limits: the agent's environment could not render PDFs, so every Game AI Pro chapter, Booth's original slides, the IRM and ECM papers, Demyen's thesis, Lipp & Boyd and Braghin are [snippet] or [not opened].

## 1. Recast/Detour

- **The corridor.** `dtPathCorridor` "Represents a dynamic polygon corridor used to plan agent movement." Usage: init, findPath, setCorridor, then findCorners / movePosition / moveTargetPosition. Each move can make the path non-optimal, so `optimizePathTopology` and `optimizePathVisibility` should be called periodically; "the most accurate use case is to move the position and target in small increments." [read] (https://raw.githubusercontent.com/recastnavigation/recastnavigation/main/DetourCrowd/Include/DetourPathCorridor.h , https://raw.githubusercontent.com/recastnavigation/recastnavigation/main/DetourCrowd/Source/DetourPathCorridor.cpp)
- **Moving the start and the end.** `movePosition` calls `moveAlongSurface` (MAX_VISITED = 16) and merges the visited polygons into the front of the corridor (`dtMergeCorridorStartMoved`); `moveTargetPosition` does the same at the end (`dtMergeCorridorEndMoved`). A target that moves a few metres per tick extends or trims the corridor tail rather than triggering a new search. [read]
- **`optimizePathVisibility`.** Raycasts toward a point, clamped to `pathOptimizationRange` (MAX_RES = 32); splices a shortcut in only if `nres > 1 && t > 0.99`. "This function is not suitable for long distance searches." [read]
- **`optimizePathTopology`** ("Partial replanning"): a local sliced search with MAX_ITER = 32, merged with `dtMergeCorridorStartShortcut`; skipped when the corridor has fewer than 3 polygons. [read]
- **`findCorners`.** Returns the string-pulled corners, at most `maxCorners-1`; prunes corners closer than MIN_TARGET_DIST = 0.01; drops every corner after the first off-mesh connection. [read]
- **DetourCrowd, `update` and `integrate`** [read] (https://raw.githubusercontent.com/recastnavigation/recastnavigation/main/DetourCrowd/Source/DetourCrowd.cpp , .../Include/DetourCrowd.h):
  - Anticipate turns (`calcSmoothSteerDirection`): `dir = dir0 - normalize(dir1)*len0*0.5`, using corners 0 and 1, then normalised. It changes direction only, never speed.
  - Corner lookahead: DT_CROWDAGENT_MAX_CORNERS = 4, "the actual number of useful corners will be one less."
  - Arrival: `slowDownRadius = radius*2` ("TODO: make less hacky"), `speedScale = distToGoal/slowDownRadius`. The only slowdown is at the path's end.
  - Integrate: `maxDelta = maxAcceleration*dt`, Δv clamped to that length (one isotropic bound; no separate lateral grip and no pre-braking: the agent's inference).
  - Visibility optimisation every update toward corner 1; topology optimisation at most 1 agent per update, each at most every 0.5 s (OPT_TIME_THR).
  - Replanning: when `isValid(CHECK_LOOKAHEAD = 10)` fails, or the corridor is shorter than 10 polygons, does not end at the target, and TARGET_REPLAN_DELAY = 1.0 s has passed; uses `finalizeSlicedFindPathPartial` (MAX_ITER = 20).
  - No defaults in the library for `pathOptimizationRange`; the RecastDemo CrowdTool could not be opened (404).
- **Off-mesh connections** (drops, vaults) [read]: trigger at `triggerRadius = radius*2.25`; traversal time `tmax = dist2D(start,end)/maxSpeed*0.5`; the agent is lerped `initPos→startPos` over the first 15% of `tmax`, then `startPos→endPos`. Corners after an off-mesh link are hidden from steering, so the agent cannot anticipate the exit.
- **Area costs and their pitfall.** The default `getCost` is `dtVdist(pa,pb) * m_areaCost[area]`, heuristic scale H_SCALE = 0.999. "Implementing a cost modifier less than 1.0 is likely to lead to problems during pathfinding." Custom costs need `DT_VIRTUAL_QUERYFILTER`, and `getCost` receives the previous, current and next polygons, so a cost based on turn angle is possible. [read] (https://raw.githubusercontent.com/recastnavigation/recastnavigation/main/Detour/Include/DetourNavMeshQuery.h , .../Source/DetourNavMeshQuery.cpp)
- **Any-angle find-path option.** Undocumented in the header; the source comment says "limiting to several times the character radius yields nice results" for the raycast limit. [read]
- **Clearance in Recast is one global erosion.** `walkableRadius` is "The distance to erode/shrink the walkable area… away from obstructions." No per-polygon clearance; narrow regions would be marked with `rcMarkConvexPolyArea` or `rcMarkCylinderArea` area IDs. [read] (https://raw.githubusercontent.com/recastnavigation/recastnavigation/main/Recast/Include/Recast.h)

## 2. Clearance-aware and smooth paths

- **Mononen's funnel** "assumes that the portals are already adjusted so that they contain the agent radius." No arcs at corners; near a corner it switches to the next corner and lets steering absorb the slack. [read] (http://digestingduck.blogspot.com/2010/03/simple-stupid-funnel-algorithm.html)
- **Explicit Corridor Map (Geraerts, ICRA'10).** A generalised Voronoi diagram whose edges are annotated with their closest obstacle points; gives the shortest path with a chosen, even variable, minimum clearance by shrinking the corridor, triangulating it, and running a shortest-path step; those paths are then control paths for smoothing. Timings: 3.56 ms for the minimum-clearance path, 4.14 ms with smoothing (average over 1,000 corridors). [read, project page] (https://webspace.science.uu.nl/~gerae101/UU_crowd_simulation_publications_ecm.html)
- **Indicative Route Method (Karamouzas, Geraerts, Overmars, FDG'09).** The next attraction point: the closest point on the corridor boundary, retracted to the medial axis at r, then the last intersection of the indicative route with the maximum empty disk centred on r. The agent steers toward it while the boundary pushes back. A follow-up (MIRAN) notes the IRM "may skip arbitrarily large parts of the indicative route." [read, project page] (https://webspace.science.uu.nl/~gerae101/UU_crowd_simulation_publications_indicative_routes.html)
- **Demyen & Buro (AAAI'06), modified funnel.** Handles circular units by attaching circles of the agent radius at the channel vertices; the thesis has pseudocode. [snippet] (https://era.library.ualberta.ca/items/3075ea07-5eb5-44e9-b863-ae898bf00fe1/view/0b3f3ece-223f-4006-aeab-c497f5f8aa59/MR22249.pdf)
- **Kallmann, Local Clearance Triangulations (SCA 2010).** Tests correctly whether a disc of any radius fits through narrow passages. [snippet] (https://diglib.eg.org/items/e786d320-db4c-408e-9f44-f0fa81e80a6d/full)
- **Curvature-bounded (Dubins-style) paths.** Shortest unit-curvature paths among polygons are NP-hard (Reif & Wang, WAFR 1998) [snippet]. Bereg & Kirkpatrick (SoCG 2005): every corridor of width ≥ τ ≈ 1.50515 turning radii admits a unit-curvature traversal, and narrower corridors may admit none [snippet] (https://unpaywall.org/10.1145%2F1064092.1064135). A direct check on whether a doorway or corridor is traversable at a given speed, since r = v²/(μg).

## 3. Racing lines and speed profiles

- **TUM repository.** Shortest path, minimum curvature (optionally iterated), minimum time. "The minimum curvature line is quite near to a minimum time line in corners" but "will differ as soon as the car's acceleration limits are not exploited". [read] (https://github.com/TUMFTM/global_racetrajectory_optimization)
- **Heilmeier et al.** A QP minimising summed discrete squared curvature, called iteratively to cut linearisation error, followed by a forward-backward speed solver; about 18 s for a Roborace track. [snippet]
- **`calc_vel_profile` (TUM)** [read] (https://raw.githubusercontent.com/TUMFTM/trajectory_planning_helpers/master/trajectory_planning_helpers/calc_vel_profile.py): speed cap from curvature `v = sqrt(ay_max*r)`; forward pass `ax_avail = ax_max*(1-(ay_used/ay_max)^e)^(1/e)` (a friction ellipse at e = 2); `v_next = sqrt(v² + 2·ax·ds)`, keeping the minimum; backward pass the same on reversed arrays.
- **Kapania, Subosits & Gerdes (arXiv 1902.00606)** [read] (https://ar5iv.labs.arxiv.org/abs/1902.00606): speed cap `Ux = sqrt(μg/|κ|)`; forward and backward passes; path step a convex problem minimising Σ(Δψ/Δs)² + λ(Δδ)² with the lateral offset bounded by the track edges; "minimizing curvature is not the same as minimizing lap time"; converges in 4-5 iterations; their nonlinear baseline "trades off between a minimum curvature path and the path with shortest total distance."
- **Braghin et al. 2008:** not opened. **Lipp & Boyd 2014:** minimum-time speed along a fixed path is convex after a change of variables. [snippet]

## 4. Following a path with inertia

- **Reynolds (GDC'99)** [read] (https://www.red3d.com/cwr/steer/gdc99/): path following predicts the future position and projects it onto the spine; inside the path radius "no corrective steering is required"; arrival `ramped_speed = max_speed*(distance/slowing_distance)`; `steering_force = truncate(dir, max_force)`, `a = F/m`.
- **Pure pursuit (MathWorks docs).** A small lookahead converges fast but overshoots and oscillates; a large one reduces oscillation but cuts corners. [read] (https://www.mathworks.com/help/nav/ug/pure-pursuit-controller.html) Speed-proportional lookahead is standard [snippet].
- **Stanley controller.** δ = heading error + arctan(k·e/v) [snippet]; the kinematic form is "mainly suitable for low-speed environments" [read] (https://www.mathworks.com/help/driving/ug/lateral-control-tutorial.html).
- **Braking before corners.** No game source found stating v_corner = sqrt(μgr) with braking distance (v²−v_c²)/2a. The racing forward-backward pass above is that rule applied along the whole path.

## 5. Re-planning without flipping

- **Apollo trajectory stitching** [read] (https://raw.githubusercontent.com/ApolloAuto/apollo/master/modules/planning/planning_base/common/trajectory_stitcher.cc , .../gflags/planning_gflags.cc): each cycle keeps the old trajectory from the matched point minus `trajectory_stitching_preserved_length = 20` points, up to current time + one planning cycle, and replans from that point's end. It replans from the vehicle's actual state only if lateral deviation > 0.5 m, longitudinal > 2.5 m, or time > 7.0 s. Planning loop 10 Hz. A committed prefix with a hysteresis gate.
- **Detour's own answer** is corridor merging: partial results replace only the part that differs, and topology repair is throttled to every 0.5 s per agent. [read]
- **Left 4 Dead (Booth, 2009).** Bots steer toward a "look ahead" point with local avoidance; "(Re)pathing is cheap", "Resultant motion is fluid"; the drawback is it "can avoid off path too much, requiring repath." Directly optimised paths "look robotic." [read, text transcription of the slides] (https://www.readkong.com/page/the-ai-systems-of-left-4-dead-michael-booth-valve-9664541)
- **D* Lite, Field D*, Lazy Theta*:** not opened.

## 6. Choosing between near-equal routes

- **In Detour:** per-area cost multipliers (only ≥ 1 is safe), or a custom virtual `getCost` that sees the previous, current and next polygons. [read]
- **Elsewhere:** HAA* (Harabor & Botea, CIG'08) annotates clearance for agents of several sizes [snippet]. Game AI Pro ch. 27 ("Tactical Pathfinding on a NavMesh") [not opened].

## 7. Shipped games

- **Horizon Zero Dawn.** Berteling's GDC 2018 slides reportedly say Bezier smoothing "didn't make it", and describe an Euler/Cornu-style curve with a maximum-curvature parameter setting the default turn circle [snippet].
- Driver San Francisco, the Game AI Pro racing chapters, Alien: Isolation and Titanfall: not opened or not researched.

## Tradeoffs and disagreements (the agent's)

- Minimum curvature approximates minimum time in corners only.
- Pure pursuit lookahead trades oscillation against corner-cutting; with mass, cutting a corner can mean clipping a door jamb.
- Two ways to keep a stable line: Detour's corridor keeps the polygon list stable but the corner string is recomputed every frame; Apollo keeps the geometric trajectory stable. For a line that should not move under the body, Apollo's model is the closer match.
- Area-cost multipliers below 1 break A* in Detour.
- The IRM attraction point can skip large parts of the route.

## No established method found for

- a curvature- and grip-bounded line combined with a navmesh corridor in branching open rooms (racing-line methods assume one track with left and right edges);
- a route cost that prices corner speed (v²/r) on a navmesh to choose between two near-equal routes;
- interception of a moving target combined with a committed corridor line;
- hysteresis thresholds on route choice between topologically different corridors;
- exact curvature-bounded shortest paths (NP-hard in general).

## Read these first, in the agent's order

1. DetourPathCorridor.cpp and DetourCrowd.cpp: the exact corridor merge and replan machinery the library already has.
2. Kapania, Subosits & Gerdes, arXiv 1902.00606: the full two-step loop (speed profile, then a convex minimum-curvature path step) with equations and timings.
3. TUM `calc_vel_profile.py`: a forward-backward pass with a friction-ellipse limit.
4. Apollo `trajectory_stitcher.cc`: a concrete committed-prefix and hysteresis rule.
5. Geraerts ICRA'10 (ECM) and Karamouzas FDG'09 (IRM): a corridor with explicit clearance, plus an attraction point to follow.
6. Bereg & Kirkpatrick SoCG'05: the width threshold for curvature-bounded traversal of a corridor.
7. Game AI Pro 3 ch. 20 (Optimization for Smooth Paths) and GAP Online 2021 ch. 9 (HZD): unread by the agent.
8. Booth, "AI Systems of Left 4 Dead": shipped reactive look-ahead following, with its failure mode.

## URLs the agent opened

The seven recastnavigation raw files named above; http://digestingduck.blogspot.com/2010/03/simple-stupid-funnel-algorithm.html ; the two Utrecht project pages; https://github.com/TUMFTM/global_racetrajectory_optimization ; the TUM calc_vel_profile.py ; https://ar5iv.labs.arxiv.org/abs/1902.00606 ; https://www.red3d.com/cwr/steer/gdc99/ ; the two MathWorks pages; the two Apollo raw files; the readkong transcription of Booth's slides; http://www.gameaipro.com/ (index only); https://www.guerrilla-games.com/read/the-ai-of-horizon-zero-dawn (abstract only).

**Fetched but unreadable:** fdg09.pdf, ecm.pdf, the GAP3 ch. 20 and GAP ch. 27 PDFs, mediatum.ub.tum.de, stanford.edu/~boyd (TLS certificate refused). The RecastDemo CrowdTool.cpp path returned 404.
