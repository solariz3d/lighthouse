# D616: ELYSIUM's helix clearance, old against new (seat A, 2026-11-02)

Read-only. Nothing was written to the tracks or AC folders; no t180 code was touched. Tier PROVE IT: no fix, so no test yet.
Evidence: `exo_memory/handback/p-d616-helix-clearance-A_2026-11-02_evidence/` (EV): scripts/ and runs/.
Page: https://claude.ai/artifact/FMfqYNxMHrwVQd8p9JuuCT (private to the keeper until shared).

- old: `t180b_elysium\t180b_elysium.kn5`, 0.4.34, sha256 `a7c986de…2802`
- new: `t180b_elysium_new\t180b_elysium_new.kn5`, 0.4.38, sha256 `384b44ae…87f6` (`EV/runs/kn5-sha256.txt`)

## 1. The answer

**The one place on the track where a mesh came closer to the car is NOT the helix. It is the crossing where p38 passes over the end of p39's
loop and the start of p41, near x 35, z −474.**
- **What changed:** p38's DRAWN hull (`UNDERSKIN_p38_chunk_59` in the new export) cuts through p41's edge apron:
  - **33 intersecting triangle pairs over x 35.2–41.8 (about 6.6 m)**, down to 1.0 m through the surface;
  - in the old export it is 3 pairs over 0.13 m (`APRONSIDE_p38`).
- **Cause: the hull's depth (0.4.37, D604).** On the same ray up from the apron, the hull's underside is 0.58 m under p38's road in the old export and **1.51 m** in the new.
- **Not the re-lean, not the chords:** p38's road and apron are identical in both exports (moved 0.0000 m). Chords can't account for a metre.
- **Physics: nothing changed here.** The hull has no physics. p38's road and apron (0.85 m above the lower apron at the closest) are the same in both exports. So this is visual clipping (geometry showing through a surface beside the car), not a hit.
- **inferred:** whether this crossing is the "helix part" he meant. p38→p39 is a descending loop of about 257° that passes over its own exit, which could read as a helix. The telemetry and screenshot will settle it.

## 2. The helix (p29) itself: nothing near the car, in either export

p29 is 5,000 m and turns about 1,960° (5.4 laps). It climbs y −300 → +800 (`EV/runs/list-new.txt`, bounding boxes), so its laps are about 200 m apart.
- checked: front-face rays from every drivable road triangle, 25 m out, in cells where road lies above road (`clear616f.js` → `clearf-*.txt`, `clearf-sum-*.txt`):
  - old: 7 rays hit anything, all p8 under p15 at 24.7 m;
  - new: 10 rays, p8 under p16 at 24.6 m;
  - no p29 ray hits anything.
- p29's physics is byte-identical: road equal (`phys.txt`), aprons moved 0.0000 m (`apron.txt`). Only its drawn hull differs.

## 3. Whole-track passes, and the clearance table

| check (whole track, old / new) | old | new |
|---|---|---|
| physics meshes position-equal (`phys616.js` → `phys.txt`) | — | 113 equal; 44 differ (every apron that moved, plus the pit's in/out/fill); 1 new (`1ROAD_APRON_PIT_R`) |
| apron movement (`apron616.js` → `apron.txt`) | — | ≤ 5.6 mm on p1–p28, ≤ 11.3 mm on p33–p36 and p41–p45, **0 on p29–p31 and p37–p39** |
| front-face rays from every road AND apron triangle, 3 m (`near616.js` → `near-sum-*.txt`) | 11 hits, all from p41's apron: p38 hull ≥ 0.921 m | 13 hits, all from p41's apron: p38 hull ≥ **0.303 m** |
| hull vertices > 2 cm above any road or apron (`poke616.js`, `pokesum.js` → `poke-sum-*.txt`) | 10, all at this crossing | 4, all at this crossing |
| triangle intersections near the crossing, R 40 m (`int616.js` → `int-*.txt`) | 3 pairs (`APRONSIDE_p38` × p41's apron) | **33 pairs** (`UNDERSKIN_p38` × p41's apron) |

The crossing cut by cut: sections across the lower pass every 1 m (`cut616.js`, `band616.js` → `band-*.txt`). The lowest point of each p38 mesh over the lower apron, measured straight up (the apron is tilted 25°), in metres:

| offset | hull old | hull new | p38 physics (both) |
|---|---|---|---|
| −3 | 1.785 | 0.844 | 2.335 |
| −1 | 1.050 | 0.222 | 1.563 |
| 0 | 0.791 | **−0.038** | 1.280 |
| 2 | 0.435 | **−0.577** | 0.943 |
| 4 | 0.384 | **−0.920** | 0.873 |
| 6 | 0.647 | **−1.009** | 1.146 |
| 7 | −0.882 (`APRONSIDE`) | −0.945 | **−0.882**, in both |

At offset 7, p38's own physics apron already crosses p41's apron by 0.88 m in BOTH exports. That predates all three changes.

**The car on the lower ROAD.** The road there is banked about 105° from level (`1ROAD_p39_chunk_81`, which also carries p40's 85 m). Rays along its own normal from every triangle find nothing within 3 m, in both exports. So a car on the road at this point has nothing in its 1.2 m envelope. The new hull appears at the apron, the strip over the road's top edge, which a wheel reaches when it leaves the road.

## 4. Corrections

1. **The first ray pass flipped every road normal to point up.** On roads banked past 90° (p21, p29's down-facing stretch, p30, p31, p34–p39), rays went back through the road into its own hull. Those results ("p21 ← its own UNDERSKIN at 0.49 / 1.46 m") are each piece's own underside, not a pass above, and are withdrawn. The rerun uses the road's front face, which is up on every flat piece (p1: 96,900 up, 0 down).
2. **My first section clearances took p41's road as the lower surface.** Near the crossing, the lower road is `1ROAD_p39_chunk_81`, so I rebuilt the lower surface from every road and apron except p38's. The first version also skipped negative heights and showed the cut-through as "1 cm above".
3. **The "at the road's top edge" columns are vertical heights next to a road banked about 105°.** They are not a car's clearance. I had them as the headline for one draft of the page; the published page labels them for what they are. The figure for a car is §3's normal rays: nothing within 3 m in either export.

## 5. What a fix would need (not done; the order says measure first)

- **inferred:** the hull's depth should keep clear of any other pass's road and apron. That means a test that exports ELYSIUM, or a small two-pass crossing, and asserts no drawn mesh intersects another piece's physics surface. Run it red on 0.4.38's generator, where the crossing gives 33 pairs.
- The generator's own final-scene check reads the hull. Whether it should refuse or warn here is a ruling for the chair and the keeper, not mine.
- p38's apron crossing p41's apron by 0.88 m (offset 7) is older than D604 and physical. It is out of this packet's scope, but it is the same crossing.

SOURCES: the order D616; both kn5 files read in place (sha256 above); the scripts and runs in EV.

---

# D616 revised (the chair, 17:06): a check, and his telemetry

## 6. (1) The check: 0.4.38 changed nothing in the helix

checked: p29's road and aprons are byte-identical in the two exports (`EV/runs/phys.txt`; `apron.txt` gives 0.0000 m for p29 chunks 29–38).
Rays from every p29 road triangle along its front face meet nothing within 25 m in either export (`clearf-sum-*.txt`). Only p29's drawn
underside differs, and it is under the road. **No change near the car in the helix.** §1's crossing (p38/p41) stands as a separate
geometric fact; the lap below never brings the car near that apron.

## 7. (2) His lap, read from the replay

Inputs, copied to scratch first and never moved (`EV/telemetry/inputs-sha256.txt`):
- the replay `AC_021126-164903_…_t180b_elysium_new_.acreplay`, sha256 `1175cae8…9819`, 31,122,453 B;
- the ghost `GHOST_CAR_sol_ohyeah2389_t180_mach6.ghost`, sha256 `f7a031f1…68b1`. It was under `Documents\Assetto Corsa\GhostCar\`, not under `replay\` as the order said. It was not needed.

Reader: `C:\Users\nname\Desktop\blackbox\ui\acreplay.js` (`parseReplay`, `extractCar`, `parseTelemetry`, `alignTelemetry`), as the librarian's lanibump.js uses it.
- **frames:** 10,990 at 15 ms; one full lap, frames 1076 → 10808, 145.977 s.
- **telemetry tail:** schema 5, 456,146 samples, aligned by time.
- **boost:** the channel (field 10) reads 1.42–1.95 on every frame. It is a level (boost pressure, inferred), not an on/off state.
- **What is NOT readable:** "boosting" in his sense, the thrust or afterburner, which only schema 6 carries. Gas is readable: 1.000 at every low point below.

The car: `content\cars\ohyeah2389_t180_mach6`.
- **Model:** ground at y 0, hubs at y 0.395 (x ±0.900, z ±1.715), tyres 0.006–0.784.
- **Collision box** (`collider.kn5`): y 0.485–1.475.
- **Drawn underside** (`Mach6BodyNonPaint`): lowest point y 0.077, 0.318 m under the hubs.

Method (`body616.js` → `body-new.csv.gz`, `bsum.js` → `bsum.txt`, `vis616.js` → `vis.txt`):
- Every frame, fit the model's four hubs to the replay's four recorded wheel centres to get the car's frame.
- Place the collision box in that frame.
- Ray from each box vertex and each wheel centre along the car's up: down to the physics road surfaces (1ROAD*), up 40 m to ANY mesh.

| | whole lap | p29 helix (2,257 frames) |
|---|---|---|
| top speed | 971 km/h | 855 km/h |
| anything above the roof within 40 m | nearest **24.10 m** (p32 under p29's hull) | **none** |
| collision box above its road, lowest | **+0.059 m** rigid to the wheels; **−0.001 m** with body travel (f4983, 615 km/h, gas 0) | **+0.236 m**; +0.103 m with body travel (f7308, lap 93.48 s, 795 km/h, gas 1, boost 1.943) |
| tyre sunk into the road (0.395 − hub height), largest | **0.192 m** (f4389, lap 49.70 s, p20, 845 km/h, gas 1) | **0.160 m** (f7871, lap 101.93 s, 839 km/h, gas 1) |
| mean tyre squash, above 750 km/h / below 500 km/h | 0.100 / 0.061 m | **0.146 / 0.070 m** |
| frames where the drawn underside is below the road | 5,552 of 10,987 | 1,662 of 2,257; lowest −0.244 m (f7749, 737 km/h) |

**Reading it.** In the helix the car never comes within 40 m of the pass above, so there is no frame where the body reaches an upper underside.

The clipping he saw fits the car pressed into its OWN road:
- At speed the tyres squash by 0.15–0.19 m, twice as much above 750 km/h as below 500.
- The drawn tyres and underside then show through the road surface.
- The collision box never goes through. Its lowest point is +0.059 m over the lap and +0.236 m in the helix.

That matches his words: transient, and from speed with the car pressed down. It isn't a geometry change.

**inferred, and the limits:**
- "Body travel" is the replay's body point over the wheel plane minus its lap median, with the median taken as the static ride.
- The drawn underside's lowest point (0.077) may be one small part, such as a splitter, not the whole floor. So the underside frame counts are an upper bound on how often something drawn clips.
- The box has only 3 top vertices, so its top was taken as bottom + 0.99 m.
- My first two runs had the height sign reversed and are withdrawn (§8).

## 8. Corrections (revision)

4. **body616.js first computed height as 3 − t.** The ray starts 3 m above the point, so the height is t − 3. That run's table (every wheel "0.39 m under the road", body "−0.7 m") had the sign reversed, and its per-frame minimum picked the highest point. It is withdrawn. Before finding the sign bug I also signed the car's up by extractCar's normal; that changed no frame, and it stays.

## 9. (3) For the pass-clearance rule: the first data point

- **The car rides LOWER under load, not higher.** Squash takes up to 0.19 m off its height above the road. For a pass ABOVE, the number that matters is how high the car rides:
  - its collision-box top over its road: median **1.33 m**, highest **2.42 m** (f8377, 955 km/h; inferred, from bottom + 0.99, at a crest);
  - in the helix: median 1.25 m, highest 1.64 m.
- **Nearest overhead approach this lap: 24.10 m.** No pass above came near the car.
- **For the surfaces UNDER the road** (the hull, the catch), the low ride is what counts. The drawn tyres sink 0.192 m and the drawn underside goes to about 0.27 m below the road. The collision box stays above it.
- **inferred:** a pass-clearance rule would sit on the roof figure plus a margin, so on this lap about 2.4 m along the lower road's normal. One lap is one data point; a jump or a crest sets the top.

SOURCES (revision): the chair's D616 revision; the replay and ghost (sha256 above); acreplay.js; collider.kn5 and the car kn5; the runs in EV/telemetry.
