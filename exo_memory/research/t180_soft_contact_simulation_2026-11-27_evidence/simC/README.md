# simC: the floor box pressed into a soft ODE contact

Builder C, 2026-11-27. Built alone. `node sim.js` runs in under one second, prints the tables and writes
`results.json` (3,520 runs, fields named in its `fields` key). No recorded outcome of any real car was read.
One thing seen by accident: the grep for the patch's surface documentation listed installed tracks whose
`surfaces.ini` carry the same commented block; only the comments were read.

ODE source: `https://bitbucket.org/odedevs/ode.git` at `0e0e94b59d4336be322a1f654eda0da711d28d3a`, cloned
read-only into the scratch folder `ode_C/src`. Paths below are relative to it.

## The model

State: body height `zb` (box bottom above the road, m) and hub height `zh` (wheel centre above the road),
both along the road normal; four corners lumped. Tick `h = 1/333 s`, velocities first, then positions (ODE's order).

1. Masses. 850 kg total (`car.ini:14 TOTALMASS=850`); 30 kg unsprung per corner
   (`suspensions.ini:22 HUB_MASS=20`, `:28 BODY_0_MASS=10`), so 730 kg body, 120 kg hubs.
2. Tyres. Ray casts with a linear rate: `tyres.ini:24 RATE=270000`, `:23 DAMP=700`, `:20 RADIUS=0.395`.
   Force `4*270000*(0.395 - zh) - 4*700*vh`, never negative. Baseline: the rate carries on however deep the hub
   goes. Reading `tyreLoss`: the force is zero once the wheel centre is under the one-sided sheet.
3. Springs. `suspensions.ini:58 RATE=80000`, `:63 MIN_LENGTH=0.9`, `:64 MAX_LENGTH=1.4`, `:65 END_RATE=250000`,
   `:68 BUMPSTOP_GAP=0.05`. Read as: free at 1.4, 0.5 m of travel, the last 0.05 m adds 250,000 N/m, and at 0.9
   the coilover is solid (hub and body locked together, joined inelastically, released when the stop force
   would turn to tension). Dampers `:69-74` (4000 then 1000 N s/m above 0.2 m/s in bump; 3000 then 1000 in rebound).
   Preload from `ctrl_susp_lf.ini:4 LUT=(| 0=0 | 100=80 | 200=300 | 400=800 | 600=1800 | 1000=4500 |)`, added as a force.
   `END_VTAPER`, `END_VMAX` and the anti-roll bars are not modelled.
4. Downforce. `script.lua:377-384`: `rideHeightSensor = physics.raycastTrack(car.position + (car.up * 0.4) ..., -car.up, 1.0)`,
   `suctionMult = math.clamp(math.remap(rideHeightSensor, 0.5, 0.9, 1, 0), 0, 1) * (rideHeightSensor == -1 and 0 or 1)`,
   `aeroForceBase ... -200`. So `200 * v * mult` N on the body; zero when the ray starts under the sheet.
   Baseline speed 800 km/h (44,444 N); 600 and 970 run as sensitivities.
5. Load. A pseudo-gravity along the road normal on all masses: 20 g for a 3 s settle, a straight ramp to the
   peak, then 2 s held.
6. Calibration against the two given facts.
   - Stops at about 25 g: not fitted. The files alone give it: solid force per corner `80000*0.5 + 250000*0.05 + preload`,
     so the body reaches its stops at `(4*(52500 + preload) - downforce) / (730 * 9.81)` = 25.68 g at 600 km/h,
     24.88 g at 800, 24.20 g at 970 (printed by `sim.js`). That agreement is the check on choices 1 to 4.
   - Box at the road at 40 g: fitted. With the suspension solid, the tyres carry `850*40*9.81 + 44444 = 377,984 N`,
     a deflection of 0.350 m, so the wheel centre is 0.045 m above the road when the box bottom is at it. That
     fixes the one free length (`sDroop = -0.455`). From the files alone (`suspensions.ini:20 BASEY=-0.06` and a
     1.0 m design length) the box would touch at about 34 g; the measured 40 g is used.
   - Sharing past 40 g: the tyres keep adding 1,080,000 N/m and the box contact carries the rest.
7. The contact row, `ode/src/joints/contact.cpp`:
   - `:141-142` `dReal erp = (surface_mode & dContactSoftERP) != 0 ? contact.surface.soft_erp : worldERP;` `dReal k = worldFPS * erp;`
   - `:148` `const dReal pushout = k * depth + motionN;` `:155` `dReal c = pushout > maxvel ? maxvel : pushout;`
   - `:200-201` `const dReal newc = contact.surface.bounce * negated_outgoing + motionN;` `if (newc > c) { c = newc; }`
   - `:207-208` `pairRhsCfm[... GI2_CFM] = contact.surface.soft_cfm;`  lower bound 0, upper infinity (`:212-213`).
   - `ode/src/quickstep.cpp:1585` `JCurr[JME_CFM] *= stepsizeRecip;` and `:2335` `dReal Ad_i = sor_w / (sum + cfm_i);`
   So each row solves `(1/m + cfm/h) * lambda = c/h - (v/h + F/m)`, i.e.
   `lambda = max(0, (erp*depth/h - v*) / (h/m + cfm))` with `v*` the velocity after the other forces.
   `n` rows with the same normal and depth act as one row with `cfm/n` (solved exactly, not by SOR sweeps).
   `maxvel` is infinite and the surface layer zero, ODE's defaults (`ode/src/objects.cpp:94-95`
   `max_vel(dInfinity)`, `min_depth(REAL(0.0))`); the game's values are unknown. Bounce threshold 0.1 m/s is assumed.
8. Stiffness and damping. ODE manual, "How To Use ERP and CFM" (`https://ode.org/wiki/index.php/Manual.html`):
   `ERP = h kp / (h kp + kd)`, `CFM = 1 / (h kp + kd)`; and "The ERP specifies what proportion of the joint error
   will be fixed during the next simulation step." So `kp = ERP / (h * CFM)`, `kd = (1 - ERP) / CFM`, per row:
   - SOFT_CFM 0.0002: `kp = 0.8 * 333 / 0.0002 = 1,332,000 N/m`, `kd = 0.2 / 0.0002 = 1,000 N s/m`.
   - SOFT_CFM 0.00005: `kp = 0.8 * 333 / 0.00005 = 5,328,000 N/m`, `kd = 4,000 N s/m`.
9. The collider, `ode/src/collision_trimesh_box.cpp`, for a box lying flat on a flat sheet:
   - Triangle normal (axis 1) is one-sided: `:138` `dReal fDepth = fR+fp0;` `:141` `if ( fDepth<0 ) {` ... `return false;`.
     It only separates when the box is above the sheet; its depth is the bottom face's penetration and grows without limit.
   - Box faces (axes 2 to 4) are two-sided: `:209-210` `dReal fDepthMin = fR - fMin;` `dReal fDepthMax = fMax + fR;`
     `:213` `if ( fDepthMin < 0 || fDepthMax < 0 ) {` ... `return false;`. So once the whole box is under the sheet
     there is no contact at all.
   - The smaller depth wins: `:236` `if (fDepth < m_fBestDepth) {`. Up to half the box height the triangle normal
     holds (equal depth, tested first). Past half height the box's own vertical axis is the shallower one, taken
     unflipped (`:221-232`), so the normal reverses and the depth becomes the distance left to the box's TOP face
     (`:989` `dReal fTempDepth = dCalcVectorDot3(vNormal2,avTempArray1[i])-m_vBoxHalfSize[iA0];`). The contact then
     pushes the box on through. Edge axes are handicapped (`:318` `if (fDepth*1.5f < m_fBestDepth) {`) and never win here.
   - Contact count: one point per vertex of each clipped polygon (`:889`, `:1000` `GenerateContact(...)`), duplicates
     merged (`:1036-1056`), capped by the caller's flags (`:1067`). A 2 x 3 m box over 2 m rows covers about six
     triangles and gives roughly ten distinct points; the game's cap is unknown. Run with `n = 1` (the softest the
     contact can be) and `n = 10`, plus a sweep of `n`.
10. Two readings of "past half height": `flip` (ODE as written, item 9) and `oneSided` (the normal stays the
    road's, depth keeps growing, contact lost only when the whole box is under the sheet).
11. Outcome. THROUGH: the bottom passes the limit (half the box height in `flip`, the whole height in `oneSided`);
    the time is measured from the moment the load reached its peak (negative = during the rise). `back` marks
    runs that the linear tyre springs later threw back up from under the road, an artefact of choice 2.
    HOLDS: never past the limit and the bottom moves less than 2 mm over the last 0.5 s. OSCILLATES: bounded, not still.
12. Variants. Patch wording (`surfaces.ini` template shipped with tracks): "MAX_DEPTH = 4 ; If set and collision
    depth is above that parameter, collision becomes hard"; "RIGID_WITH_BOXES = 0 ; If set to 1, collisions with
    boxes (usually used for car bottoms) would be fully rigid"; `extension/config/general.ini:110`
    "EXTEND_COLLIDER_BOXES=1 ; Extend car box colliders (prevents cars from falling through the ground in when falling fast)".
    - "hard" / "rigid" is run two ways: `a` = ODE's world defaults (`objects.cpp:37` `REAL(0.2)`, `:40` `REAL(1e-5)`),
      `b` = ERP 0.8 kept with CFM 0.
    - `extDn`: bottom face lowered by 0.25 / 0.5 m (as the task states; the box then touches earlier and depths are
      measured from the lowered face). `extUp`: same bottom, box taller by the same amounts (my alternative reading).
13. Pitch is left out: at 800 km/h and 60 g the road's radius is 84 m, so over the 3 m box the ends sit 13 mm
    nearer the road than the middle. That is small against the depths here, but it would cut the number of deep points.

## Files
- `sim.js` the simulation. `results.json` every run (thinned), the variant summary and the sensitivities.
