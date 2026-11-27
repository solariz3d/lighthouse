# simA: the floor box pressed into a soft ODE road sheet (builder A, 2026-11-27)

`node sim.js` (0.2 s) prints the tables and writes `results.json`. Built alone, blind to recorded outcomes.
ODE source read: `bitbucket.org/odedevs/ode` at 0e0e94b5 (cloned read-only, nothing built or run from it).
Paths below named `ode/...` are in that clone; `car:` is `Source/base/data/` at tag v0.12.0.

## State and tick

One degree of freedom along the road normal: `z` = height of the box's bottom face above the sheet, `v = dz/dt`.
Tick `h = 1/333 s`, one solver step per tick, semi-implicit (velocity first, then `z += h*v`), as ODE steps.
No pitch: `car: suspensions.ini` `CG_LOCATION=0.5` and `colliders.ini` `CENTRE=0, 0.2, 0` put the box and the
axles symmetric about the centre of gravity, and the load is applied at it (`script.lua:384`
`ac.addForce(vec3(0, 0, 0), true, ...)`).

## The contact row (what SOFT_ERP and SOFT_CFM do)

- `ode/src/joints/contact.cpp:141-148`: `dReal erp = (surface_mode & dContactSoftERP) != 0 ? contact.surface.soft_erp : worldERP;`
  `dReal k = worldFPS * erp;` ... `const dReal pushout = k * depth + motionN;` so the row's target velocity is
  `c = erp*depth/h`.
- `contact.cpp:155`: `dReal c = pushout > maxvel ? maxvel : pushout;` and `ode/src/objects.cpp:94` `max_vel(dInfinity)`
  (default: no cap; the game's value is unknown).
- `contact.cpp:196-200`: bounce: `newc = contact.surface.bounce * negated_outgoing + motionN; if (newc > c) { c = newc; }`
  (BOUNCE=0.1; `bounce_vel` taken as 0).
- `contact.cpp:207-208`: `pairRhsCfm[... GI2_CFM] = contact.surface.soft_cfm;`, then
  `ode/src/quickstep.cpp:1584-1585` `JCurr[JME_RHS] *= stepsizeRecip; JCurr[JME_CFM] *= stepsizeRecip;` and
  `quickstep.cpp:2982` `delta = J_ptr[JME_RHS] - old_lambda * J_ptr[JME_CFM];`. Converged, each row satisfies
  `s*v_new = c - cfm*lambda` with `lambda` a force in newtons, `lambda >= 0` (`contact.cpp:212` lower limit 0).
- With `n` identical rows on one body: `lambda = max(0, (c - s*v_free) / (cfm + h*n/m))`, `v_new = v_free + s*h*n*lambda/m`.
  So `n` rows act exactly like one row with `cfm/n`.
- In spring terms per row: `lambda = kp*depth - v_new/cfm`, `kp = erp/(h*cfm)`; the velocity coefficient `1/cfm`
  equals `h*kp + kd` with `kd = (1-erp)/cfm`.
  - SOFT_CFM 0.0002: `kp = 0.8*333/0.0002 = 1.332e6 N/m`, `1/cfm = 5000 N s/m` (`kd = 1000`).
  - SOFT_CFM 0.00005: `kp = 0.8*333/0.00005 = 5.328e6 N/m`, `1/cfm = 20000 N s/m` (`kd = 4000`).
- The ODE manual page was not retrievable (404); the equivalence above is derived from the solver lines, not quoted.

## The collider (box against triangle sheet)

- Contact normal convention, `ode/include/ode/contact.h:83-86`: "if body 1 is moved along the normal vector by a
  distance depth ... then the contact depth will be reduced to zero"; the mesh is g1 (`collision_trimesh_box.cpp`
  `m_Geom1=TriMesh; m_Geom2=BoxGeom;`).
- Triangle-normal axis is one-sided, `collision_trimesh_box.cpp:138-143`: `dReal fDepth = fR+fp0; if ( fDepth<0 ) { return false; }`.
  Depth along the road normal = (half height) - (box centre height) = penetration `p` of the bottom face; it never
  separates from below. Normal `-N` (line 157): box pushed up.
- Box-axis test is two-sided, `:209-233`: `fDepthMin = fR - fMin; fDepthMax = fMax + fR; if ( fDepthMin < 0 || fDepthMax < 0 ) return false;`
  `if ( fDepthMin > fDepthMax ) { fDepth = fDepthMax; // flip normal direction ... } else { fDepth = fDepthMin; }`.
  For a level box: centre above the sheet gives depth `p` (a tie; the strict `<` at `:236` keeps the triangle
  normal). Centre BELOW the sheet (`p > H/2`) gives depth `H - p` with the normal un-flipped, which is smaller than
  the triangle-normal depth, so it wins: the normal reverses and the row pushes the box DOWN, out through the
  underside. Box top under the sheet (`p >= H`): `fDepthMin < 0`, no contact.
- Edge axes need `fDepth*1.5f < m_fBestDepth` (`:318`) and do not win for a level box.
- Contact count: each overlapped triangle yields the clipped polygon's vertices (`:880-893` or `:985-1004`), all at the
  same depth for a level box; duplicates merge in `GenerateContact`. The number kept depends on the caller's
  contact limit (`m_iFlags & NUMC_MASK`), which the game does not publish. BASELINE `n = 4`; `n = 1, 2, 8` swept.

Two readings past half height are both simulated: `flip` (ODE as written) and `noflip` (normal stays the road's,
depth `p`, until the top passes).

## Wheels and load sharing (calibration)

- Given: suspension solid at 25 g, box touches at 40 g. Between them only the tyres give: `car: tyres.ini`
  `RATE=270000`, four tyres `KT = 1.08e6 N/m`. So clearance at the stops `Z_STOP = 15 g * 850 * 9.81 / 1.08e6 = 0.1158 m`,
  and below it `F_wheels = 25 g*m + KT*(Z_STOP - z)`, which is 40 g at `z = 0` by construction.
- Above the stops: bump stop zone, `suspensions.ini` `RATE=80000`, `END_RATE=250000`, `BUMPSTOP_GAP=0.05`: coilover
  330000 in series with the tyre, body rate 594000 N/m over 0.111 m; above that 80000 in series, 246857 N/m.
  Motion ratio taken as 1. Dampers `DAMP_BUMP=4000`, `DAMP_FAST_BUMP=1000` past 0.2 m/s, `DAMP_REBOUND=3000`, tyre `DAMP=700`.
- The speed preload (`ctrl_susp_lf.ini` LUT, about 3150 N a corner at 800 km/h) is inside the measured 25 g point.
- Two readings of the tyre rays once deep: `wheels-kept` (linear tyre spring for ever) and `wheels-lost` (no wheel
  force once the hub centre is under the one-sided sheet; by the linear tyre the hub is `0.395 - 40 g*m/KT = 0.086 m`
  above the road when the box touches). Neither is confirmed by a source.
- Load: `m*g*G(t)`, 20 g for 1.5 s, linear to the peak over the rise time, held 2 s. `G` is the total into the road with
  full downforce; `script.lua:377-383` (`-200`, `math.remap(rideHeightSensor, 0.5, 0.9, 1, 0)`, zero on `-1`) removes
  the missing share (5.33 g at 800 km/h) when the sensor reads more than 0.5 m or its origin is under the sheet.

## Variants

- v1 MAX_DEPTH: surfaces documentation (comment block in an installed track's `data/surfaces.ini`): "If set and
  collision depth is above that parameter, collision becomes hard". Hard = no soft flags: cfm 0, world ERP 0.2
  (`objects.cpp:37` `dWORLD_DEFAULT_GLOBAL_ERP REAL(0.2)`; the game's world ERP is unknown).
- v2 RIGID_WITH_BOXES: "If set to 1, collisions with boxes (usually used for car bottoms) would be fully rigid". Same hard row at every depth.
- v3 EXTEND_COLLIDER_BOXES (`general.ini:110` "Extend car box colliders (prevents cars from falling through the
  ground in when falling fast)"): bottom face lowered 0.25 or 0.5 m, top unchanged. Depths are then of the extended face.

## Outcome definitions

THROUGH: the box's top face passes under the sheet (`p >= H`), time given relative to the load reaching its peak
(negative = during the rise). HOLDS: never through; `settled` if `z` moves under 5 mm in the last 0.5 s.
`sink011`: sink rate at the first crossing of 0.11 m under the road. `gapAt65_1p5`: `z` 1.5 s into a 65 g hold.

## Not determined from the sources

The game's contact limit per box (n), its world ERP/CFM and max correcting velocity, bounce threshold, solver and
iteration count, whether the game's collider shares the half-height reversal, the tyre ray's origin and length, the
tyre's rate at these loads, and the amount of EXTEND_COLLIDER_BOXES.
