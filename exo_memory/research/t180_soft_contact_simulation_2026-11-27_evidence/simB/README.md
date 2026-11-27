# simB: the floor box pressed into a soft road sheet (builder B, 2026-11-27)

Run: `node sim.js` (under one second; prints the base tables and a one-line summary per case, writes `results.json`).
`node sim.js --tables` prints every case's table. Built alone; no recorded outcome was read.

## What is simulated

One degree of freedom: `z`, the height of the centre of gravity above the road sheet, along the road normal.
Mass 850 kg, tick 1/333 s, semi-implicit Euler as ODE does it (velocity first, then position).
`d = 0.05 - z` is how far the box's bottom face is under the sheet (negative = gap).
Pitch is left out: it changes how many corners touch (see N below), not the mechanism.

Each run: settle at 20 g, hold 0.2 s, ramp linearly to the peak over the rise time, hold 2 s.

## Modelling choices and their sources

ODE source: https://bitbucket.org/odedevs/ode at commit 0e0e94b59d4336be322a1f654eda0da711d28d3a (read only).

1. **Contact row.** `ode/src/joints/contact.cpp:141-155`: `dReal k = worldFPS * erp;` ...
   `const dReal pushout = k * depth + motionN;` ... `dReal c = pushout > maxvel ? maxvel : pushout;`
   and `:208` `pairRhsCfm[...GI2_CFM] = contact.surface.soft_cfm;`. `ode/src/objects.cpp:94-95`:
   `max_vel(dInfinity), min_depth(REAL(0.0))` (whether the game changes these is not known).
2. **Solver.** `ode/src/quickstep.cpp:1584-1585`: `JCurr[JME_RHS] *= stepsizeRecip; JCurr[JME_CFM] *= stepsizeRecip;`
   `:1723` right-hand side `-(facc*invMass + lvel*stepsizeRecip)`, `:2335` `Ad_i = sor_w / (sum + cfm_i)`,
   `:2982` `delta = J_ptr[JME_RHS] - old_lambda * J_ptr[JME_CFM]`. Converged, for N identical rows on one body:
   `(N/m + cfm/h) * lambda = c/h - v_n/h - a_n`, `lambda >= 0` (`contact.cpp` LO limit 0), `c = erp*depth/h`.
   The sim uses this closed form each tick. Equivalent spring per contact point:
   `kp = erp/(cfm*h)`, damping on the incoming speed about `1/cfm`
   (ODE manual's form, quoted from memory because the manual page returned 404 today:
   `ERP = h kp/(h kp + kd)`, `CFM = 1/(h kp + kd)`, giving `kd = (1-erp)/cfm`).
3. **Bounce.** `contact.cpp:193-203`: `const dReal newc = contact.surface.bounce * negated_outgoing + motionN; if (newc > c) { c = newc; }`
   BOUNCE=0.1; the threshold `bounce_vel` is the game's and unknown, taken as 0.
4. **Collider, normal and depth.** `ode/src/collision_trimesh_box.cpp:135-143` (triangle normal axis):
   `dReal fDepth = fR+fp0; if ( fDepth<0 ) { return false; }` : one-sided, depth only grows as the box goes down.
   `:209-232` (box face axes): `dReal fDepthMin = fR - fMin; dReal fDepthMax = fMax + fR;`
   `if ( fDepthMin < 0 || fDepthMax < 0 ) { return false; }` then the smaller is used and the normal flipped to that side.
   `:236` `if (fDepth < m_fBestDepth)` : the smaller depth wins. For a level box over a flat sheet the box's
   own vertical axis reports `boxH - d`, so once `d > boxH/2` it wins, the normal points DOWN, depth shrinks,
   and past `d = boxH` there is no contact. Edge axes need `fDepth*1.5f < m_fBestDepth` (`:318`) and do not win here.
   **Two readings simulated:** `flip=1` (as written) and `flip=0` (normal stays the road's, depth = d).
5. **Number of contact points N.** `:882-889`: the box face is clipped to each triangle and every clipped corner
   becomes a contact with its own depth; `:1011-1016` merges only same position and normal; the cap is the caller's.
   Each point is its own soft row, so stiffness scales with N. The game's cap is unknown.
   **Base N=4** (four bottom corners); N=1, 2, 8 are swept.
6. **Load sharing (calibration).** Past the stops only the tyres give: `tyres.ini` `RATE=270000` x4 = 1.08 MN/m,
   `DAMP=700` x4. The line through (box touches, 40 g) with that slope puts the stops (25 g) at box-bottom
   0.123 m above the road. Before the stops: `suspensions.ini` `RATE=80000`, `END_RATE=250000`, `BUMPSTOP_GAP=0.05`
   in series with the tyre (motion ratio taken as 1), dampers `DAMP_BUMP=4000`, `DAMP_FAST_BUMP=1000`,
   `DAMP_REBOUND=3000`, threshold 0.2. MIN_LENGTH is taken as a hard stop.
   The speed-driven preload (`ctrl_susp_lf.ini` LUT) is absorbed by the calibration, not modelled.
7. **Tyres under the road.** Tyres are ray casts. Tyre deflection at 40 g is 0.309 m of a 0.395 m radius; at
   box depth **0.086 m** the deflection equals the radius, i.e. the hub centre is at the sheet.
   **Two readings:** tyre `B` (base): tyre force is zero once the hub centre is under the one-sided sheet;
   tyre `A`: the tyre spring goes on linearly. Which the game does could not be determined from the sources.
8. **Downforce.** `script.lua:377-383` at v0.12.0: ray from `car.position + car.up*0.4 + car.look*1.0`, length 1.0;
   `suctionMult = clamp(remap(sensor, 0.5, 0.9, 1, 0))`, `-200 * speed`. At 800 km/h it is 44.4 kN (5.3 g).
   The stated load in g is taken as the total at full suction; the part lost when the car is higher is subtracted.
9. **Rigid** (v1 past MAX_DEPTH, v2 always): ERP 0.2 and CFM 1e-10 (ODE world defaults; the game's are unknown).
   Patch doc, https://cup.acstuff.club/docs/csp/tracks/collision-parameters :
   "MAX_DEPTH = 0.2 ; If set and collision depth is above that parameter, collision becomes" hard;
   "RIGID_WITH_BOXES = 0 ; If set to 1, collisions with boxes (usually used for car bottoms)" fully rigid;
   "SOFT_CFM = 0.0001 ; Constrain force mixing, the higher it is, the softer is the collision". No defaults stated.
   `general.ini:110`: "EXTEND_COLLIDER_BOXES=1 ; Extend car box colliders (prevents cars from falling through the
   ground in when falling fast)". The amount is not documented; v3 lowers the bottom face by 0.25 / 0.5 m.
   No file on this machine's `extension/config` documents SOFT_ERP / SOFT_CFM (grep found none).

## Outcomes

- HOLDS: never past half the box height; slower than 0.1 m/s through the last 0.5 s.
- BOUNCES: never through, but still moving faster than 0.1 m/s in the last 0.5 s.
- THROUGH (`flip=1`): the bottom passes half the box height (the normal turns over) and the box leaves the sheet
  (`d >= boxH`). `tThrough` = time of the half-height crossing minus the time the load reached its peak.
- INVERTED (`flip=1`): ends between half and full height, held by the tyre-A spring.
- DEEP / BURIED (`flip=0`): deepest past half / past full box height; the contact still pushes up.

## results.json fields

`case, cfm, peak, rise, out, tThrough, rate011` (sink rate m/s when the bottom first crosses 0.11 m under; null = never),
`deepest` (m, negative = never touched), `minGap` (only if never touched), `d15` (depth 1.5 s after the peak),
`dEnd`, `vLate` (largest speed in the last 0.5 s).
