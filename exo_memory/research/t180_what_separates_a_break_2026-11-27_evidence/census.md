# Census of box-under-the-road passes in the replays on D (2026-11-27, the census builder)

Scripts: `census.js` (one replay to `out/<id>.json`), `merge.js` (to `passes.csv`, `summary.txt`, `heads.json`), `cov.js` (to `coverage.txt`, `t1_event_table.md`), all in `G:/consonance-scratch/fable-break/`. Run log: `run.log`.

## 1. The definition (from H563, `handback/p-d563-wheel-under-O_2026-10-30.md`)

**Order, said plainly:** the numbers below were fixed in `census.js` from H563 before any replay was run, but this file was written after the five H563 replays had been opened to validate the reader. Two reader faults were corrected against those five (a sign, and a second mesh layer; section 2), and four columns were added after seeing them (`after_break`, `air_before_s`, `kind`, `own_driving`). The thresholds for a pass and for broke/held were not changed after any replay was opened.

- **The box.** The car's floor collision box: `CENTRE=0, 0.2, 0`, `SIZE=2.0, 0.5, 3.0`, relative to the CoG, the same on all 14 cars (`research/t180_cars_clipping_potential_2026-11-27.md:41`, `:210`). Its bottom face is 0.05 m below the CoG, 2.0 m wide, 3.0 m long. The replay's position is taken as the CoG (H563's own frames have "body over the top" 0.00 m where the box reads -5.1 cm). **Box height here = the signed distance, along the road surface's normal, from the surface to the centre of the box's bottom face (position minus 0.05 m along the car's up axis). Positive is above. The four corners are not measured.**
- **A pass.** A stretch where the box is at or under the surface (height <= 0), entered from above, at more than 80 km/h. Gaps of under 0.15 s above the surface are bridged. It counts only if the box reaches 2 cm under and it lasts 3 frames or more (or goes through). It ends when the box comes out, the surface is lost, or the box is more than 0.5 m under.
- **The reference depth.** 11 cm under (H563:393, 409-423). `sink_rate_at_11cm` is the rate at the first frame at or past -11 cm: the height two frames before minus the height one frame after, over 0.045 s. `sink_rate_1frame` is the single-frame figure at the same crossing. `max_sink_rate_5_to_16cm` is the largest two-frame rate while the box is between 5 and 16 cm under (H563's band).
- **Through.** The box more than 40 cm under at any frame from the pass start to 0.3 s after its end, or any wheel centre more than 5 cm under the surface in that time.
- **BROKE.** Through, AND one of: the car left the road (no surface within 3 m, or the box more than 1 m from it, for 0.3 s unbroken inside 1 s after the pass), or a one-frame speed loss of 20 km/h or more (H563's held passes lost at most 6.7 km/h in a frame; its broken ones 68.5). A reset inside 4 s is noted in `how_broke` but does not by itself make a break.
- **HELD.** Everything else: the box came back out with no such event.
- **`kind`** (so the modellers can separate what H563 studied from what it did not): `aftermath` = starts within 6 s of a broken pass in the same replay with no reset between; `landing` = the car was off the surface (none found, or box more than 0.5 m above) for 0.1 s or more of the second before; `edge` = the box centre was within 1.0 m of the road's edge at the reference frame (half the box's width); `road` = none of these. H563's seven passes are all `road`.
- **Split.** By rule: `test` if the replay_id's first hex digit is 8-f, else `train`.

## 2. How the surface and the fit were done

- **Surface.** For a track folder starting `t180b_`: every mesh named `1ROAD*` except `1ROAD_CATCH*`. Other tracks: every mesh whose name starts with a digit, in the kn5 files of the layout's `models_<layout>.ini` (or `models.ini`, or the folder's kn5 files where there is no ini). Triangles go into a 4 m grid; a query is a ray through the point along the road normal of the previous frame (the car's up axis when there is none), 3 m either way, taking the hit nearest the point; the height is the perpendicular distance to that triangle's plane. Only triangles wound the way the road under the wheels is wound are taken (decided once per track from the fit sample), so an underside cannot be taken for the top.
- **Fault 1, corrected (checked, `run.log` before and after):** the first run had the height's sign inverted (every wheel 0.35 m under). H563 records the same fault in its own first run (H563:162).
- **Fault 2, corrected (checked, by listing the meshes near a frame):** `t180b_elysium_gates` holds a `1ROAD_CATCH_*` layer (29,208 triangles) about 0.30 m under the road top. With it in, the box read +13.8 cm where H563 has -16.1. It is left out of the surface. **Whether that layer was in the road the cars drove on 2026-10-30 is not checked.** The cars that broke went 2 to 3 m under, so it did not hold them if it was.
- **The fit.** On up to 1,500 frames above 100 km/h: the share where all four wheels find a surface, and the wheel centres' height. Accepted when the share is over 0.5, the median wheel-centre height is 0.12 to 0.50 m, and the 10th-to-90th-percentile spread is under 0.15 m. Accepted fits read 0.33 to 0.39 m at the median and 0.24 to 0.31 m at the 10th percentile (the wheel's lowest ride, see `coverage.txt`).
- **Elysium's older replays.** For `t180b_elysium` replays saved before 2026-10-31T22:56Z the surface tried first is `t180b_elysium_gates` (H563:445: the gates and stiff copies' models were byte-equal and differed from his export only in two time-gate matrices); all of them fit (share 0.91 to 1.00, median 0.35 to 0.38 m). Their `cfm` is written 0.0002 from H563 (the folder's file today says 0.00005, re-exported after). inferred for the file as it then was; checked only that the gates copy's `surfaces.ini` says 0.0002 today.
- **`cfm` on other tracks** is the first `SOFT_CFM` line of the track's `surfaces.ini`; blank where there is none. Not checked that it applies to the mesh the car was on.
- **Cross-section columns.** At the reference frame and 14 frames either side, the surface is walked sideways from the point under the car in 1 m steps (the last step bisected to 6 cm) to each edge, following the surface. `u_m` = half the difference of the two edge distances (the car's offset from the middle of the mesh, signed toward the side `cross(normal, travel)` points away from), `half_width_m`, `near_edge_m`. The section's chord gives `road_roll_deg` (against level; past 90 when the road is inverted). The roll's change along the path is the twist of the chord's normal about the travel direction, fitted with a quadratic over the frames within 20 m: its slope is `roll_rate_deg_per_m`, twice its curvature `roll_acc_deg_per_m2`. `roll_load_g` = |u| x |roll acc in rad/m2| x (speed in m/s) squared / 9.81.
- **Load.** The second difference of the position over +-4 frames (+-0.06 s) along the road normal, plus gravity's part along it, in g. It is H563's smoothing, so a sharp change shows up to 4 frames early. `peak_load_g` is its largest value from 0.5 s before the pass to its end. It is the car's acceleration, so it does not hold aerodynamic downforce or thrust.

## 3. Coverage (checked: `coverage.txt`, `run.log`)

106 entries in the replay folder; 7 do not parse; 96 distinct files by sha256 among the rest; 95 run (the second save of the [T1] typea session left out by hand); 71 covered, 24 left out. All four coverage steps (a) to (e) were finished at 14:12, before the 14:45 stop.

Left out, by reason: 9 mach6 replays on [T1] from 2025-12-31 to 2026-03-14 fail the fit on all three layouts (wheels find a surface on 0.29 to 0.56 of frames; inferred: the model on disk is later than those laps); 4 on [other-1082f1], 2 on [other-3e953b], 1 on [other-5a5c6e], 1 on [other-ddb139] fail the fit; 3 on [other-453318] and 1 on t180b_test_track_10_banked have no track folder of that name on disk; 3 on [other-47fa5a] loaded no surface (not looked into). The 7 that do not parse include the 10-17 Elysium reference lap and the active Mach 6 on soft_b.

| replay_id | track | car | saved | frames | km | fit: share / wheel p10 / p50 / p90 (m) | cfm | result | note |
|---|---|---|---|---|---|---|---|---|---|
| 1873db2d636f | [T1] | mach6 | 2026-08-24 | 8169 | 12.9 | 0.98 / 0.250 / 0.348 / 0.381 | 0.0002 | passes 0 |  |
| 2137db6c02fc | [T1] | mach6 | 2026-08-24 | 6754 | 10.2 | 1.00 / 0.261 / 0.357 / 0.383 | 0.0002 | passes 0 |  |
| 282fab7a333a | [T1] | mach6 | 2026-08-27 | 7318 | 11.5 | 0.98 / 0.250 / 0.348 / 0.380 | 0.0002 | passes 0 |  |
| 56fc01ac928d | [T1] | mach6 | 2026-08-24 | 7497 | 11.5 | 0.97 / 0.250 / 0.350 / 0.381 | 0.0002 | passes 0 |  |
| 85de7fb7aad1 | [T1] | mach6 | 2026-09-14 | 7438 | 11.7 | 0.98 / 0.250 / 0.348 / 0.381 | 0.0002 | passes 0 |  |
| b84d885d1457 | [T1] | mach6 | 2026-08-24 | 8169 | 12.9 | 0.98 / 0.250 / 0.348 / 0.381 | 0.0002 | passes 0 |  |
| c4632e4efc5b | [T1] | typea | 2026-11-27 | 4511 | 6.0 | 0.95 / 0.251 / 0.340 / 0.379 | 0.0002 | passes 0 |  |
| e41538a85062 | [T1] | mach6 | 2026-08-22 | 13367 | 20.2 | 0.98 / 0.251 / 0.352 / 0.382 | 0.0002 | passes 0 |  |
| 0fb64acd1c62 | [other-0e0103] | mach6 | 2026-07-12 | 8721 | 40.3 | 0.99 / 0.245 / 0.314 / 0.376 | 0.0002 | passes 2 |  |
| 2d5c955b9545 | [other-0e0103] | mach6 | 2026-07-13 | 923 | 3.4 | 1.00 / 0.257 / 0.362 / 0.386 | 0.0002 | passes 0 |  |
| 64ac1f991be9 | [other-0e0103] | mach6 | 2026-07-19 | 16577 | 39.8 | 0.98 / 0.245 / 0.297 / 0.374 | 0.0002 | passes 3 |  |
| 9093d9d244fa | [other-0e0103] | mach6 | 2026-08-12 | 7156 | 16.7 | 1.00 / 0.255 / 0.361 / 0.391 | 0.0002 | passes 4 |  |
| 9767919a1c39 | [other-0e0103] | mach6 | 2026-08-16 | 18193 | 39.9 | 1.00 / 0.244 / 0.299 / 0.375 | 0.0002 | passes 3 |  |
| 11e44ed94f7d | [other-19b45d] | nsx (a road car) | 2026-07-22 | 10469 | 4.3 | 1.00 / 0.278 / 0.291 / 0.309 |  | passes 0 | not his driving |
| 47a8a51f1b56 | [other-1d556d] | mach6 | 2026-11-25 | 2877 | 3.2 | 1.00 / 0.359 / 0.373 / 0.393 | 0.0002 | passes 0 |  |
| abbaaced66ec | [other-1d556d] | mach6 | 2026-11-25 | 8657 | 13.1 | 1.00 / 0.355 / 0.374 / 0.392 | 0.0002 | passes 0 |  |
| e21cd30114e4 | [other-23c075] | mach6 | 2026-04-17 | 3079 | 9.9 | 0.95 / 0.305 / 0.362 / 0.391 | 0.0002 | passes 0 |  |
| 012dd371ff12 | [other-3e953b] | mach6 | 2026-05-01 | 4500 | 22.6 | 1.00 / 0.246 / 0.333 / 0.374 | 0.0002 | passes 4 |  |
| 0f6c0b85f6f7 | [other-3e953b] | mach6 | 2026-04-30 | 4544 | 22.6 | 1.00 / 0.246 / 0.333 / 0.375 | 0.0002 | passes 1 |  |
| 239667d0adfd | [other-3e953b] | mach6 | 2026-05-07 | 4405 | 22.3 | 0.98 / 0.246 / 0.331 / 0.375 | 0.0002 | passes 4 |  |
| 2cdbef980eb5 | [other-3e953b] | mach6 | 2026-05-22 | 4364 | 22.6 | 1.00 / 0.246 / 0.313 / 0.371 | 0.0002 | passes 2 |  |
| 428718cba194 | [other-3e953b] | mach6 | 2026-05-11 | 4553 | 22.7 | 1.00 / 0.246 / 0.329 / 0.375 | 0.0002 | passes 3 |  |
| 9693d8655cdd | [other-3e953b] | mach6 | 2026-04-23 | 2671 | 12.9 | 1.00 / 0.316 / 0.373 / 0.388 | 0.0002 | passes 1 |  |
| a9ddc2351ad7 | [other-3e953b] | mach6 | 2026-07-05 | 5008 | 24.9 | 1.00 / 0.246 / 0.327 / 0.373 | 0.0002 | passes 0 |  |
| d3a654d5889e | [other-3e953b] | mach6 | 2026-05-13 | 4433 | 22.7 | 1.00 / 0.246 / 0.320 / 0.373 | 0.0002 | passes 3 |  |
| e662bc9700dd | [other-3e953b] | mach6 | 2026-05-12 | 4379 | 22.5 | 1.00 / 0.246 / 0.324 / 0.373 | 0.0002 | passes 3 |  |
| fd50a9d8b1c5 | [other-3e953b] | mach6 | 2026-05-31 | 1514 | 6.5 | 1.00 / 0.300 / 0.371 / 0.393 | 0.0002 | passes 0 |  |
| fe55a68fc84b | [other-3e953b] | mach6 | 2026-04-23 | 4511 | 22.4 | 1.00 / 0.247 / 0.331 / 0.373 | 0.0002 | passes 2 |  |
| ab976a67c2ae | [other-4e0aa3] | mach6 | 2026-02-17 | 16665 | 44.4 | 0.92 / 0.249 / 0.349 / 0.383 |  | passes 11 |  |
| 53028b32f8ba | [other-5a5c6e] | mach6 | 2026-01-18 | 10415 | 41.6 | 0.96 / 0.252 / 0.356 / 0.381 | 0.0002 | passes 6 |  |
| 6eee6c19cb18 | [other-5a5c6e] | talon | 2026-01-18 | 10415 | 30.9 | 0.96 / 0.255 / 0.355 / 0.385 | 0.0002 | passes 3 |  |
| 8140953e0a5b | [other-75db4f] | mach6 | 2025-12-30 | 17856 | 57.7 | 0.98 / 0.263 / 0.356 / 0.383 | 0.0002 | passes 2 |  |
| 8acf73723cc0 | [other-75db4f] | gladiator | 2026-07-25 | 2596 | 6.3 | 0.98 / 0.332 / 0.377 / 0.391 | 0.0002 | passes 0 | not his driving |
| ae0ee1365bf3 | [other-75db4f] | mach6 | 2026-05-24 | 11362 | 29.5 | 0.97 / 0.296 / 0.359 / 0.385 | 0.0002 | passes 1 |  |
| 480905fbac85 | [other-7fa3a2] | mach6 | 2026-03-18 | 5598 | 14.6 | 0.94 / 0.247 / 0.345 / 0.390 | 0.0002 | passes 6 |  |
| e529e4cda30b | [other-7fa3a2] | mach6 | 2026-06-20 | 4419 | 11.5 | 0.94 / 0.256 / 0.351 / 0.384 | 0.0002 | passes 0 |  |
| 09f4542ebf60 | [other-83cd9b] | mach6 | 2026-07-24 | 8426 | 12.2 | 0.99 / 0.255 / 0.353 / 0.383 | 0.0002 | passes 0 |  |
| 185bddc8f705 | [other-83cd9b] | mach6 | 2026-07-23 | 7482 | 10.4 | 0.98 / 0.254 / 0.353 / 0.385 | 0.0002 | passes 0 |  |
| 4b3acff96fc6 | [other-83cd9b] | mach6 | 2025-10-26 | 155095 | 404.4 | 0.97 / 0.250 / 0.348 / 0.383 | 0.0002 | passes 5 |  |
| 6dc2a8c4079a | [other-83cd9b] | mach6 | 2026-07-22 | 8678 | 12.3 | 0.99 / 0.264 / 0.359 / 0.385 | 0.0002 | passes 0 |  |
| 7ae50a68c466 | [other-83cd9b] | mach6 | 2026-07-22 | 7532 | 10.3 | 0.97 / 0.256 / 0.353 / 0.382 | 0.0002 | passes 0 |  |
| 7ea7d0efb7f0 | [other-83cd9b] | mach6 | 2026-07-24 | 7730 | 11.3 | 0.99 / 0.254 / 0.354 / 0.384 | 0.0002 | passes 0 |  |
| b41dbdb6122b | [other-83cd9b] | mach6 | 2026-07-23 | 7482 | 10.4 | 0.98 / 0.254 / 0.353 / 0.385 | 0.0002 | passes 0 |  |
| e5587147f9fc | [other-83cd9b] | mach6 | 2026-07-24 | 8426 | 12.2 | 0.99 / 0.255 / 0.353 / 0.383 | 0.0002 | passes 0 |  |
| c98a874cbe3b | [other-8bfad1] | mach6 | 2025-06-16 | 34229 | 49.9 | 0.87 / 0.247 / 0.363 / 0.395 | 0.0002 | passes 6 |  |
| 4d4d1ef708c4 | [other-b54796] | ks_audi_r8_plus | 2024-08-29 | 18481 | 23.1 | 1.00 / 0.312 / 0.322 / 0.328 |  | passes 0 |  |
| 31c294cf7b0a | [other-c8720e] | mach6 | 2025-08-09 | 9732 | 15.1 | 0.99 / 0.331 / 0.373 / 0.395 |  | passes 0 |  |
| f4c886197965 | [other-c8720e] | mach6 | 2026-07-22 | 9732 | 15.1 | 0.99 / 0.331 / 0.373 / 0.395 |  | passes 0 |  |
| cf60407c3a3e | [other-e00d16] | mach6 | 2026-03-27 | 6260 | 25.5 | 0.99 / 0.246 / 0.337 / 0.372 | 0.0002 | passes 8 |  |
| 3fa528271eb5 | [other-e1f9f0] | mach6 | 2026-07-22 | 184860 | 341.9 | 0.99 / 0.287 / 0.343 / 0.376 | 0.0002 | passes 5 | not his driving |
| 168d45c76583 | t180b_crazy_test_test | mach6 | 2026-10-28 | 7095 | 19.7 | 0.99 / 0.240 / 0.277 / 0.365 | 0.0002 | passes 1 |  |
| 2e77f2282379 | t180b_crazy_test_test_soft_a | mach6_active | 2026-10-30 | 6810 | 19.7 | 1.00 / 0.236 / 0.256 / 0.355 | 0.0002 | passes 0 |  |
| 6eecebc537c1 | t180b_crazy_test_test_soft_b | grx | 2026-10-31 | 6558 | 19.7 | 1.00 / 0.240 / 0.295 / 0.371 | 0.00005 | passes 0 |  |
| 065789823b52 | t180b_elysium | krysha | 2026-10-31 | 4369 | 9.6 | 0.91 / 0.289 / 0.361 / 0.384 | 0.0002 | passes 2 |  |
| 0805d953319d | t180b_elysium | grx | 2026-10-31 | 4377 | 9.8 | 1.00 / 0.362 / 0.377 / 0.388 | 0.0002 | passes 1 |  |
| 1ca5e0b40e3c | t180b_elysium | mach6 | 2026-10-16 | 58553 | 122.5 | 0.97 / 0.248 / 0.357 / 0.384 | 0.0002 | passes 11 |  |
| 46d2f6dc86a2 | t180b_elysium | augury | 2026-10-30 | 11310 | 28.0 | 1.00 / 0.245 / 0.345 / 0.382 | 0.0002 | passes 1 |  |
| 8a80290e99fd | t180b_elysium | typea | 2026-11-27 | 12706 | 27.0 | 1.00 / 0.246 / 0.353 / 0.385 | 0.00005 | passes 0 |  |
| 9a01897cbe0b | t180b_elysium | grx | 2026-10-31 | 4377 | 9.8 | 1.00 / 0.362 / 0.377 / 0.388 | 0.0002 | passes 1 |  |
| b03f9cd489e9 | t180b_elysium | mach6 | 2026-10-31 | 11527 | 29.6 | 0.99 / 0.245 / 0.327 / 0.372 | 0.00005 | passes 0 |  |
| c74e4fd35558 | t180b_elysium | mach6 | 2026-10-31 | 4780 | 11.3 | 1.00 / 0.245 / 0.352 / 0.383 | 0.0002 | passes 1 |  |
| e5a192566716 | t180b_elysium | demo | 2026-10-30 | 5179 | 11.7 | 1.00 / 0.369 / 0.378 / 0.391 | 0.0002 | passes 1 |  |
| e5c0fd082282 | t180b_elysium | hangul | 2026-10-31 | 4740 | 10.0 | 1.00 / 0.364 / 0.375 / 0.388 | 0.0002 | passes 3 |  |
| f449f0bb1c96 | t180b_elysium | gigerbon | 2026-10-31 | 11598 | 27.6 | 1.00 / 0.247 / 0.348 / 0.381 | 0.0002 | passes 1 |  |
| 263aaf1bf2aa | t180b_elysium_gates_stiff | mach6 | 2026-10-31 | 13905 | 35.9 | 0.98 / 0.245 / 0.344 / 0.380 | 0.00005 | passes 1 |  |
| bea03b3c90a0 | t180b_elysium_gates_stiff | krysha | 2026-10-31 | 8057 | 18.9 | 0.96 / 0.245 / 0.346 / 0.385 | 0.00005 | passes 0 |  |
| ff1dfc70990c | t180b_elysium_gates_stiff | grx | 2026-10-31 | 5851 | 13.3 | 1.00 / 0.360 / 0.373 / 0.387 | 0.00005 | passes 0 |  |
| 1175cae87d76 | t180b_elysium_new | mach6 | 2026-11-02 | 10990 | 27.4 | 1.00 / 0.245 / 0.344 / 0.380 | 0.00005 | passes 0 |  |
| d4fcf3ce2ea4 | t180b_laniakea | mach6 | 2026-11-01 | 10624 | 21.8 | 1.00 / 0.246 / 0.363 / 0.388 | 0.00005 | passes 0 |  |
| bc5e902231df | t180b_ribbon_corkscrew_test_test | mach6 | 2026-11-03 | 3536 | 6.2 | 0.89 / 0.251 / 0.369 / 0.390 | 0.00005 | passes 0 |  |
| cbc6dd5aeee3 | t180b_test_10_0438 | mach6 | 2026-11-02 | 589 | 0.1 | 1.00 / 0.380 / 0.386 / 0.392 | 0.00005 | passes 0 |  |
| 1bd792942b5f | [T1] | mach6 | 2026-03-14 | 2344 |  | 0.56 / -0.681 / 0.254 / 1.455 |  | LEFT OUT: surface fit failed |  |
| 458e89f72ae0 | [T1] | mach6 | 2026-01-21 | 10415 |  | 0.37 / -0.272 / 0.317 / 1.854 |  | LEFT OUT: surface fit failed |  |
| 4919c8cd5240 | [T1] | mach6 | 2026-01-21 | 10415 |  | 0.51 / 0.109 / 0.320 / 1.243 |  | LEFT OUT: surface fit failed |  |
| 5ca4e9a0a882 | [T1] | mach6 | 2026-01-23 | 3597 |  | 0.33 / -0.339 / 0.352 / 1.762 |  | LEFT OUT: surface fit failed |  |
| ca3fe76ba743 | [T1] | mach6 | 2025-12-31 | 16710 |  | 0.30 / -0.833 / 0.337 / 1.915 |  | LEFT OUT: surface fit failed |  |
| e2da3d9a4493 | [T1] | mach6 | 2026-01-22 | 3325 |  | 0.36 / -0.595 / 0.254 / 1.662 |  | LEFT OUT: surface fit failed |  |
| f2e15c1014e4 | [T1] | mach6 | 2026-01-19 | 4160 |  | 0.40 / -0.153 / 0.333 / 1.763 |  | LEFT OUT: surface fit failed |  |
| f86629369053 | [T1] | mach6 | 2026-01-21 | 10415 |  | 0.29 / -0.555 / 0.332 / 2.244 |  | LEFT OUT: surface fit failed |  |
| fec4f70a9990 | [T1] | mach6 | 2026-01-21 | 10415 |  | 0.46 / -0.133 / 0.319 / 1.628 |  | LEFT OUT: surface fit failed |  |
| 66e344452b74 | [other-1082f1] | mach6 | 2025-10-23 | 20833 |  | 0.01 / 2.146 / 2.210 / 2.443 |  | LEFT OUT: surface fit failed |  |
| c69678902ed8 | [other-1082f1] | mach6 | 2025-12-31 | 39328 |  | 0.03 / -1.502 / -0.012 / 1.484 |  | LEFT OUT: surface fit failed |  |
| d98210044e8a | [other-1082f1] | talon | 2026-01-04 | 13794 |  | 0.03 / -1.265 / -0.195 / 1.153 |  | LEFT OUT: surface fit failed |  |
| f1829250c129 | [other-1082f1] | mach6 | 2026-02-10 | 6470 |  | 0.02 / -1.635 / -0.498 / 1.027 |  | LEFT OUT: surface fit failed |  |
| 33394be53bac | [other-3e953b] | mach6 | 2026-02-28 | 4396 |  | 0.71 / -1.259 / -0.160 / 1.073 |  | LEFT OUT: surface fit failed |  |
| 9060e4f855d5 | [other-3e953b] | mach6 | 2026-04-04 | 4350 |  | 0.70 / -1.241 / -0.152 / 1.096 |  | LEFT OUT: surface fit failed |  |
| 9ef86c391a4f | [other-453318] | mach6 | 2026-01-09 | 4454 |  | - |  | LEFT OUT: no surface loaded (track folder not on disk) |  |
| b920399d34b1 | [other-453318] | mach6 | 2026-01-11 | 4572 |  | - |  | LEFT OUT: no surface loaded (track folder not on disk) |  |
| ef415d9b1813 | [other-453318] | mach6 | 2026-01-10 | 4824 |  | - |  | LEFT OUT: no surface loaded (track folder not on disk) |  |
| 685581fe5cc5 | [other-47fa5a] | mach6 | 2026-10-01 | 8111 |  | - |  | LEFT OUT: no surface loaded |  |
| 7904c14423ea | [other-47fa5a] | mach6 | 2026-08-22 | 13362 |  | - |  | LEFT OUT: no surface loaded |  |
| d40586c75385 | [other-47fa5a] | mach6 | 2026-08-21 | 23115 |  | - |  | LEFT OUT: no surface loaded |  |
| 7167e58fdc3e | [other-5a5c6e] | mach6 | 2026-01-08 | 10415 |  | 0.00 / -1.896 / -0.599 / 1.759 |  | LEFT OUT: surface fit failed |  |
| f0e512d87cfd | [other-ddb139] | mach6 | 2026-11-06 | 3871 |  | 0.00 / - / - / - |  | LEFT OUT: surface fit failed |  |
| 872eb23b0daf | t180b_test_track_10_banked | mach6 | 2026-10-23 | 12449 |  | - |  | LEFT OUT: no surface loaded (track folder not on disk) |  |

## 4. Counts (checked: `summary.txt`, from `passes.csv`)

```
rows 111 held 96 broke 15
by split {"train":{"held":52,"broke":9},"test":{"held":44,"broke":6}}
by kind {"road":{"held":65,"broke":6},"landing":{"held":24,"broke":6},"aftermath":{"held":0,"broke":2},"edge":{"held":7,"broke":1}}
by car {"mach6":{"held":90,"broke":9},"krysha":{"held":0,"broke":2},"grx":{"held":0,"broke":1},"augury":{"held":1,"broke":0},"talon":{"held":2,"broke":1},"demo":{"held":1,"broke":0},"hangul":{"held":1,"broke":2},"gigerbon":{"held":1,"broke":0}}
by track {"[other-3e953b]":{"held":23,"broke":0},"t180b_elysium":{"held":15,"broke":6},"[other-0e0103]":{"held":12,"broke":0},"t180b_crazy_test_test":{"held":1,"broke":0},"t180b_elysium_gates_stiff":{"held":0,"broke":1},"[other-e1f9f0]":{"held":5,"broke":0},"[other-7fa3a2]":{"held":4,"broke":2},"[other-83cd9b]":{"held":4,"broke":1},"[other-5a5c6e]":{"held":8,"broke":1},"[other-75db4f]":{"held":3,"broke":0},"[other-4e0aa3]":{"held":10,"broke":1},"[other-8bfad1]":{"held":3,"broke":3},"[other-e00d16]":{"held":8,"broke":0}}
by own_track {"0":{"held":80,"broke":8},"1":{"held":16,"broke":7}}
by cfm {"0.0002":{"held":86,"broke":13},"0.00005":{"held":0,"broke":1},"":{"held":10,"broke":1}}
by own_driving {"0":{"held":5,"broke":0},"1":{"held":91,"broke":15}}
crossers of 11 cm, all kinds {"train":{"held":16,"broke":9},"test":{"held":17,"broke":5}}
road-kind {"train":{"held":32,"broke":4},"test":{"held":33,"broke":2}}
road-kind by car {"mach6":{"held":61,"broke":3},"krysha":{"held":0,"broke":1},"grx":{"held":0,"broke":1},"augury":{"held":1,"broke":0},"demo":{"held":1,"broke":0},"hangul":{"held":1,"broke":1},"gigerbon":{"held":1,"broke":0}}
road-kind by track {"[other-3e953b]":{"held":14,"broke":0},"t180b_elysium":{"held":14,"broke":4},"[other-0e0103]":{"held":12,"broke":0},"t180b_crazy_test_test":{"held":1,"broke":0},"[other-7fa3a2]":{"held":3,"broke":1},"[other-83cd9b]":{"held":1,"broke":0},"[other-5a5c6e]":{"held":4,"broke":0},"[other-4e0aa3]":{"held":8,"broke":0},"[other-8bfad1]":{"held":2,"broke":1},"[other-e00d16]":{"held":6,"broke":0}}
road-kind crossers of 11 cm {"train":{"held":6,"broke":4},"test":{"held":9,"broke":1}}
road-kind crossers: rate at 11 cm, outcome, replay, car, track, cfm, peak g, near edge
  0.11  (1-frame 0.17)  held  c74e4fd35558  mach6  t180b_elysium  0.0002  65.3 g  edge 3.31  roll_load 3.68  test
  0.16  (1-frame 0.29)  held  168d45c76583  mach6  t180b_crazy_test_test  0.0002  63.7 g  edge 11.69  roll_load 0.28  train
  0.40  (1-frame 1.06)  held  e5c0fd082282  hangul  t180b_elysium  0.0002  63.3 g  edge 3.44  roll_load 3.61  test
  0.41  (1-frame 1.17)  held  9093d9d244fa  mach6  [other-0e0103]  0.0002  77.3 g  edge 7.31  roll_load 4.89  test
  0.60  (1-frame 0.81)  held  9767919a1c39  mach6  [other-0e0103]  0.0002  88.0 g  edge 7.44  roll_load 5.20  test
  0.69  (1-frame 0.43)  held  ab976a67c2ae  mach6  [other-4e0aa3]    23.8 g  edge 7.75  roll_load 1.41  test
  0.73  (1-frame 0.65)  held  cf60407c3a3e  mach6  [other-e00d16]  0.0002  41.3 g  edge 13.25  roll_load 0.19  test
  1.20  (1-frame 1.06)  held  9093d9d244fa  mach6  [other-0e0103]  0.0002  86.7 g  edge 11.50  roll_load 0.72  test
  1.21  (1-frame 1.37)  held  cf60407c3a3e  mach6  [other-e00d16]  0.0002  51.1 g  edge 9.75  roll_load 6.20  test
  1.35  (1-frame 1.44)  held  480905fbac85  mach6  [other-7fa3a2]  0.0002  2.7 g  edge 2.81  roll_load 0.15  train
  1.50  (1-frame 1.34)  held  0fb64acd1c62  mach6  [other-0e0103]  0.0002  84.0 g  edge 4.06  roll_load 7.02  train
  1.56  (1-frame 1.33)  broke  480905fbac85  mach6  [other-7fa3a2]  0.0002  3.6 g  edge 8.13  roll_load 0.34  train
  1.57  (1-frame 2.69)  held  64ac1f991be9  mach6  [other-0e0103]  0.0002  90.5 g  edge 6.44  roll_load 4.63  train
  1.69  (1-frame 8.12)  held  480905fbac85  mach6  [other-7fa3a2]  0.0002  4.1 g  edge 5.19  roll_load 0.22  train
  1.82  (1-frame 1.91)  broke  0805d953319d  grx  t180b_elysium  0.0002  64.2 g  edge 2.38  roll_load 6.46  train
  2.14  (1-frame 2.09)  broke  065789823b52  krysha  t180b_elysium  0.0002  57.7 g  edge 3.13  roll_load 12.06  train
  2.30  (1-frame 1.61)  broke  1ca5e0b40e3c  mach6  t180b_elysium  0.0002  62.8 g  edge 4.00  roll_load 3.35  train
  10.28  (1-frame 20.99)  held  c98a874cbe3b  mach6  [other-8bfad1]  0.0002  33.2 g  edge 4.00  roll_load 2.97  test
  10.78  (1-frame 14.13)  broke  c98a874cbe3b  mach6  [other-8bfad1]  0.0002  35.5 g  edge 4.00  roll_load 1.59  test
  17.64  (1-frame 62.18)  held  480905fbac85  mach6  [other-7fa3a2]  0.0002  5.3 g  edge 6.63  roll_load 2.67  train
replays covered 71 left out 24; km 2162; seconds on a road above 80 km/h 17224
km, keeper driving a T-180, covered replays 1786
```

`passes.csv` columns, in order: replay_id,track_tag,own_track,car,cfm,t_start,t_end,speed_kmh,deepest_cm,crosses_11cm,sink_rate_at_11cm,max_sink_rate_5_to_16cm,peak_load_g,u_m,road_roll_deg,roll_rate_deg_per_m,roll_acc_deg_per_m2,roll_load_g,wheel_under,near_edge_m,outcome,how_broke,split,sink_rate_1frame,half_width_m,min_wheel_cm,closed_section,up_dot_normal,dur_s,max_1frame_speed_loss_kmh,air_before_s,after_break,own_driving,kind

The first 23 are the columns asked for; the rest are extras (`sink_rate_1frame`, `half_width_m`, `min_wheel_cm`, `closed_section`, `up_dot_normal`, `dur_s`, `max_1frame_speed_loss_kmh`, `air_before_s`, `after_break`, `own_driving`, `kind`).

**The typea on t180b_elysium (8a80290e99fd, today, firm road 0.00005):** 0 passes in 190 s; the box's least height above 80 km/h is -0.1 cm (`typea_elysium_min.txt`).

## 5. Validation against H563 (checked: `passes.csv`, `summary.txt`)

**Five of H563's seven passes are found; the other two are in a replay the parser does not open.** H563's labels are car codes, and its "reference" is a 10-17 lap; matched here by the sha256 prefixes H563 gives.

| H563 pass | H563 outcome, rate at -11 cm, deepest | here: replay, car | here: outcome, rate (3-frame / 1-frame), deepest, peak load |
|---|---|---|---|
| C00 19:04 | held, 0.15 m/s, -14.9 cm, 64.61 g | c74e4fd35558, mach6 | held, 0.11 / 0.17 m/s, -14.9 cm, 65.3 g |
| C09 | held, 0.63 m/s, -15.9 cm | e5c0fd082282, hangul | held, 0.40 / 1.06 m/s, -15.9 cm, 63.3 g |
| C05 | held, never crosses, -3.0 cm | f449f0bb1c96, gigerbon | held, never crosses, -3.0 cm, 52.6 g |
| C07 | broke, 1.66 m/s, -16.1 cm at the onset | 0805d953319d (and its second save 9a01897cbe0b, dropped as the same event), grx | broke, 1.82 / 1.91 m/s; deepest reading above -40 cm is -21.5 cm |
| C11 | broke, 1.96 m/s, -13.1 cm | 065789823b52, krysha | broke, 2.14 / 2.09 m/s; deepest reading above -40 cm is -29.4 cm |
| reference 1 | held, 0.28 m/s, -11.3 cm | not found | the 10-17 replay does not parse ("could not locate car motion data"); H560 read it with its own wrapper, which is no longer on disk |
| reference 2 | held, never crosses, -6.9 cm | not found | the same replay |

- The frame heights agree with H563's to the millimetre where both are printed (C07: -5.1 cm at t 59.820, -9.6 at 59.850; C00: -14.9 at 60.810).
- **The rates differ from H563's by 0.04 to 0.23 m/s** (0.11 against 0.15; 0.40 against 0.63; 1.82 against 1.66; 2.14 against 1.96). The order is the same and no pass changes side of the 0.63 / 1.66 gap. H563 does not give its differencing formula; mine is in section 1. **C09 shows the size of the doubt by itself: 0.40 over three frames, 1.06 over one.**
- `deepest_cm` for a broken pass is the deepest reading above -40 cm, which can be a frame already inside the break. H563's "deepest" for C07 and C11 is the depth at the onset. Do not compare that column across outcomes.
- **So H563's seven are five cars' passes, not seven of the Mach 6:** mach6 (C00, and the reference), gigerbon, hangul held; grx and krysha broke.
- **One pass H563 did not have:** 1ca5e0b40e3c (mach6, `t180b_elysium`, saved 2026-10-16) breaks at t 868.3 s, 62.8 g, 755 km/h, 4.0 m inside the edge, rate 2.30 / 1.61 m/s. The same replay holds nine held helix passes that never reach 11 cm (deepest -2.1 to -7.6 cm at 54 to 62 g).

## 6. The [T1] typea event (checked: `t1_typea_event_frames.tsv`, `near.js`)

Replay c4632e4efc5b (the named save; the auto-save 0b71d79bb799 of the same session was not run).

**By this census's definition there is no pass there: the box never went under the surface.** Over the whole replay the box's least height above 80 km/h is +1.2 cm (`typea_elysium_min.txt`).

What the frames show:
- **Before (t 64.20 to 64.56):** the car is on the inverted part coming down (its up axis's world y goes -0.88 to -0.01), 379 to 405 km/h, 15 to 21 g. All four wheel centres sit at 0.245 to 0.27 m over the surface, which is the lowest any accepted replay's wheels ride (the 10th percentile of every fit is 0.24 to 0.31 m): the suspension is at its stop. The box is 10 to 13 cm ABOVE the surface. The car is 9.6 to 11.9 m from the edge on its right and 13.2 to 15.6 m from the edge on its left, and is already moving toward its right at about 6 m/s (11.88 m to 9.63 m in 0.36 s).
- **The loss (t 64.560 to 64.650):** 397.6 to 343.4 km/h, 54 km/h in 0.09 s. In those frames the right-side wheels rise (FR 0.247 to 0.318 m, RR 0.249 to 0.362 m), the left-side wheels stay at 0.245 to 0.27 m, and the box rises from 13 to 21 cm above the surface. **Nothing measured is under the surface in any of these frames.** The road's chord flips from 132 to 48 degrees between t 64.560 and 64.590 as read by the section walk; that is the kerb meshes entering the walk, not a step in the road (inferred).
- **After (t 64.65 to 64.98):** it settles back onto all four wheels (t 64.71 to 64.80, box +7 to +11 cm, 20 to 23 g) while sliding to its right at about 22 m/s (9.63 m from the right edge at t 64.56, 0.31 m at t 64.98). The box's closest approach is +1.6 cm at t 64.920 (28 g). The front-right wheel loses the surface at t 64.950, and the whole car at t 64.995. The meshes nearest it then are the right-hand kerb (0.7 to 1.0 m) and nothing beyond.
- **So the last contact is t 64.98, not 64.6, and the car left over the road's right-hand edge.** It was 9.6 m inside that edge when it lost the 54 km/h.
- **What took the 54 km/h is not in the replay.** No wheel and no box centre is under the surface at 66.7 Hz. A sub-frame contact (the box's right-hand corners, which are not measured; the car's collision mesh, which reaches past the box) is not ruled out. inferred: a right-side contact that lifted that side and threw the car sideways; unchecked.
- **For P2:** this event carries no row in `passes.csv`, because it is not a pass. The modellers and the scorer should know the registered "Type A break on a fast roll" is, as measured, an edge departure after an unexplained hit.

Frames (every frame from t 64.41 to 64.76, then t 64.86 to the last frame with a surface):

| t (s) | km/h | box over surface (cm) | wheels FL / FR / RL / RR centre over surface (m) | load (g) | car up . road normal | car up, world y | to the edge on its left (m) | to the edge on its right (m) | road roll (deg) |
|---|---|---|---|---|---|---|---|---|---|
| 64.410 | 398.5 | 11.4 | 0.263 / 0.250 / 0.247 / 0.259 | 14.6 | 0.999 | -0.47 | 14.00 | 11.13 | 139.3 |
| 64.425 | 400.1 | 11.6 | 0.268 / 0.252 / 0.251 / 0.259 | 14.7 | 0.999 | -0.43 | 14.06 | 11.06 | 137.9 |
| 64.440 | 401.6 | 11.9 | 0.265 / 0.250 / 0.254 / 0.263 | 15.1 | 1.000 | -0.39 | 14.19 | 10.94 | 136.9 |
| 64.455 | 403.1 | 12.3 | 0.255 / 0.249 / 0.249 / 0.266 | 16.1 | 1.000 | -0.35 | 14.31 | 10.81 | 136.0 |
| 64.470 | 404.4 | 12.3 | 0.254 / 0.246 / 0.250 / 0.270 | 17.3 | 1.000 | -0.31 | 14.50 | 10.69 | 135.1 |
| 64.485 | 404.9 | 12.1 | 0.253 / 0.246 / 0.248 / 0.266 | 18.7 | 1.000 | -0.26 | 14.63 | 10.50 | 134.3 |
| 64.500 | 405.1 | 11.8 | 0.254 / 0.249 / 0.246 / 0.259 | 19.8 | 1.000 | -0.21 | 14.81 | 10.38 | 133.6 |
| 64.515 | 404.4 | 12.2 | 0.259 / 0.246 / 0.247 / 0.261 | 20.1 | 1.000 | -0.17 | 15.00 | 10.19 | 133.2 |
| 64.530 | 403.5 | 12.5 | 0.264 / 0.247 / 0.246 / 0.257 | 20.2 | 1.000 | -0.12 | 15.19 | 10.00 | 132.7 |
| 64.545 | 401.9 | 13.1 | 0.269 / 0.245 / 0.250 / 0.252 | 20.2 | 1.000 | -0.07 | 15.38 | 9.81 | 132.4 |
| 64.560 | 397.6 | 13.2 | 0.272 / 0.247 / 0.246 / 0.249 | 20.9 | 1.000 | -0.01 | 15.56 | 9.63 | 132.2 |
| 64.575 | 388.8 | 12.5 | 0.266 / 0.245 / 0.246 / 0.249 | 21.8 | 1.000 | 0.04 | 15.75 | 9.44 | 132.3 |
| 64.590 | 376.9 | 11.9 | 0.248 / 0.245 / 0.246 / 0.262 | 22.1 | 1.000 | 0.09 | 16.00 | 9.25 | 47.7 |
| 64.605 | 365.1 | 13.7 | 0.250 / 0.251 / 0.247 / 0.283 | 20.5 | 1.000 | 0.14 | 16.19 | 9.06 | 47.2 |
| 64.620 | 354.1 | 17.4 | 0.268 / 0.278 / 0.261 / 0.328 | 17.6 | 1.000 | 0.18 | 16.38 | 8.88 | 46.5 |
| 64.635 | 346.5 | 20.1 | 0.272 / 0.311 / 0.252 / 0.352 | 14.8 | 0.999 | 0.23 | 16.63 | 8.69 | 45.6 |
| 64.650 | 343.4 | 21.1 | 0.253 / 0.318 / 0.248 / 0.362 | 12.9 | 0.999 | 0.27 | 16.81 | 8.50 | 44.7 |
| 64.665 | 344.2 | 20.1 | 0.246 / 0.308 / 0.246 / 0.350 | 13.6 | 0.999 | 0.31 | 17.13 | 8.25 | 43.5 |
| 64.680 | 344.8 | 17.8 | 0.247 / 0.288 / 0.247 / 0.328 | 15.4 | 1.000 | 0.34 | 17.38 | 8.00 | 42.4 |
| 64.695 | 345.4 | 14.8 | 0.250 / 0.246 / 0.248 / 0.295 | 17.7 | 1.000 | 0.38 | 17.69 | 7.75 | 41.3 |
| 64.710 | 345.8 | 11.3 | 0.251 / 0.247 / 0.247 / 0.245 | 19.6 | 0.999 | 0.42 | 18.00 | 7.50 | 39.8 |
| 64.725 | 346.2 | 7.6 | 0.242 / 0.247 / 0.247 / 0.244 | 21.3 | 1.000 | 0.45 | 18.31 | 7.19 | 38.4 |
| 64.740 | 346.6 | 6.9 | 0.245 / 0.246 / 0.247 / 0.244 | 22.8 | 1.000 | 0.49 | 18.69 | 6.88 | 37.0 |
| 64.755 | 347.0 | 7.1 | 0.249 / 0.254 / 0.245 / 0.250 | 22.7 | 1.000 | 0.52 | 19.06 | 6.56 | 35.4 |
| 64.860 | 348.8 | 14.1 | 0.256 / 0.253 / 0.244 / 0.261 | 21.7 | 1.000 | 0.77 | 21.81 | 3.94 | 25.8 |
| 64.875 | 349.2 | 10.4 | 0.248 / 0.252 / 0.240 / 0.242 | 24.2 | 0.998 | 0.80 | 22.19 | 3.50 | 24.6 |
| 64.890 | 348.7 | 7.1 | 0.250 / 0.245 / 0.251 / 0.245 | 27.1 | 0.997 | 0.82 | 22.63 | 3.06 | 22.9 |
| 64.905 | 347.1 | 2.5 | 0.246 / 0.241 / 0.242 / 0.247 | 29.4 | 1.000 | 0.85 | 23.13 | 2.69 | 20.8 |
| 64.920 | 345.4 | 1.6 | 0.248 / 0.253 / 0.238 / 0.243 | 28.1 | 1.000 | 0.88 | 23.63 | 2.25 | 19.2 |
| 64.935 | 343.6 | 3.2 | 0.262 / 0.249 / 0.245 / 0.260 | 24.1 | 1.000 | 0.90 | 24.38 | 1.81 | 16.6 |
| 64.950 | 341.1 | 3.9 | 0.270 / NaN / 0.252 / 0.250 | 19.4 | 1.000 | 0.91 | 24.94 | 1.38 | 15.0 |
| 64.965 | 339.2 | 4.2 | 0.269 / NaN / 0.263 / 0.248 | 14.7 | 0.997 | 0.90 | 25.50 | 0.88 | 13.8 |
| 64.980 | 338.1 | 3.2 | 0.241 / NaN / 0.293 / 0.248 | 10.7 | 0.992 | 0.89 | 26.19 | 0.31 | 12.2 |
| 64.995 | 336.7 | NaN | NaN / NaN / NaN / NaN | 6.8 | NaN | 0.88 |  |  |  |

## 7. Doubts about this table

- **66.7 Hz against 333 Hz physics, above all.** A replay frame is every fifth physics step. At 750 km/h the car moves 3.1 m between frames. A sink rate here is a difference of heights 0.015 to 0.045 s apart: at 2 m/s the box moves 3 cm per frame, so the crossing of 11 cm is located to within about 3 cm of depth and the rate is an average over 3 to 9 cm of travel. The contact's own period on the soft road is 0.079 s (`research/t180_why_a_car_goes_through_a_road_2026-11-27.md:66`), about 5 frames, so a rate can be read; on the firm road it is 0.040 s, under 3 frames, and it cannot be read well. A break develops in 2 to 4 frames (C07: -16 cm to -269 cm in 4), so for a broken pass the rate at -11 cm may already be the break and not what preceded it. **The replay cannot say whether a fast sink causes a break or is the break's first frame.** The two rate columns disagree by up to 0.7 m/s on a held pass (C09: 0.40 against 1.06).
- **The triangle noise.** The height is taken against one triangle's plane. On a curved road the plane changes from triangle to triangle; frame-to-frame jitter of 1 to 3 cm is visible on steady stretches (the wheels read 0.228 to 0.239 m on C00's plateau), which is 0.7 to 2 m/s of false rate in a single-frame difference. The three-frame rate cuts that to about a third.
- **The box centre only.** The corners (1.0 m out, 1.5 m fore and aft) are not measured. On a concave road of 75 m radius they sit about 1.5 cm nearer the surface; on a rolling road one side sits lower by 1.0 m x the roll difference. P2's mechanism is about exactly that, and this table does not see it directly.
- **Passes other than `road`.** Of 15 broken rows, 6 are `road`, 6 are `landing` (the car came down from the air; sink rates of 9 to 64 m/s; a different event from H563's), 2 `aftermath`, 1 `edge`. **Using all 15 as "breaks" would mix three things.**
- **Other authors' tracks.** Every digit-named mesh is taken as the road, with no check that the game collides with it softly, that it is one-sided, or that the model on disk is the one driven (the fit only checks wheel heights on the sample). The two `road` breaks there are at 3.6 g and 35.5 g, 200 and 413 km/h: I did not look at their frames. They may be seams, overlapping meshes or a wall, not H563's event.
- **`cfm`.** For other tracks it is a line in a file, not a measurement; three tracks have none.
- **The 80 km/h floor, the 2 cm floor and the 0.15 s bridge** decide how many held rows there are. A helix lap with the box grazing 1 cm under is no row; one long ride with two dips is one row.
- **`roll_acc_deg_per_m2` and `roll_load_g`** come from a quadratic over about 40 m of path with edges located to 6 cm on a mesh 25 to 35 m wide; where a kerb or pit mesh joins the walk the chord jumps (seen on [T1], section 6). On Elysium's helix the values are 0.002 to 0.011 deg/m2, 3 to 12 g of roll load; treat differences under about 2 g as noise. Not validated against the track's own equation.
- **`u_m`'s sign** is relative to the direction of travel, not to the track's left and right, and the middle is the middle of the physical mesh (pit and kerb meshes included where they touch), not the AI line H563 measured from. H563's "14.1 m left of the AI line" reads 14.0 to 15.1 here on a 17.47 m half-width, which is agreement by luck of the mesh being symmetric there.
- **Two saves of one session** are caught only when the event's speed, depth and load are identical (one caught: `dropped_duplicates.txt`). The [T1] typea auto-save was left out by hand.
- **Not his driving:** three replays have another driver's name (a gladiator, a mach6 on [other-e1f9f0], and a road car); their rows carry `own_driving` 0 (5 held rows, 0 broke). Two replays are road cars, not T-180s (0 rows).
- **The count is small.** 6 `road` breaks in 1,786 km of his own T-180 driving in the covered replays (`summary.txt`), 4 of them on Elysium's soft road: three helix pass-throughs (grx, krysha, and the mach6 of 2026-10-16) and the hangul's wheel-under at t 66.39 s, which H563 reads as an edge event after its held helix pass (H563:245). The other two are on other authors' tracks and unread. That is under the registration's "about ten".
