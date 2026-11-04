# TEST 1 won't export: the downforce-ray-gap reds diagnosed (D241, pane E, 2026-10-04, D)

**The doc:** a COPY of `%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-TEST 1.t180track` (sha256 `9e6f7be8…`, the same as the original), read only. 46 pieces, closed, 15,260 m of lap.
- The plan's "about 11 km" is low. checked: the built path's `lengthM`.

**Code:** t180 main **`fa5fd937`** (the installed `lib-mirror-build`), in a fresh worktree `C:/Users/nname/Desktop/worktrees/e-test1-wt`. Not `8ff414b`.

**Runs:** every run alone under the heavy-run lock. No AC, no fix. The export went into a SCRATCH folder only.

## VERDICT: every downforce-ray-gap red is REAL, and none is a hole. The track runs into ITSELF.

- **No crack, no seam gap, no cell non-overlap anywhere.** Each red is the OUTER EDGE of one piece's road lying within about 1 m of ANOTHER piece's road surface.
- **The two pieces are 528–4,602 m apart along the lap.**
- **The validator's ray is aimed correctly.** It sees another road under the car's ray just past that edge, which is what it exists to catch. Its name ("gap") is what misleads.
- **The same places carry `self-intersection` and `stacked-within-2m` reds.** Those are the underlying fault; the ray reds are their symptom.
- **The geometry:**
  - The rolled section turns at about 0.68°/m (a radius of about 84 m), and 360/0.68 = 529 m.
  - The pairs that collide are **528–530 m apart along the track**.
  - **So after one full circle the road comes back onto itself.** The coils of the turn are stacked with as little as **0.93 m** between their centrelines. The same circle also cuts through the lap's early pieces (p3, near s 1,400) and through p14.

## 1 · Every red (`exportSegments` refused it with RED; the full list from `e.red`, not the cut-off message)

| reason | count | where (s, m) |
|---|---|---|
| **downforce-ray-gap** | 6 | 4510; 5814–5818; 5856–5858; 5946–5948; 5984; 6022 (u 4.8, 4.12, −14.42, −6.96, 1.92, 9.39) |
| **self-intersection** | 13 | 1404–1428, 1478–1506, 1720–1730, 2246–2248, **4508–4518, 5816–5856, 5910–5944, 5984–6020**, 6348–6382, 6442–6446, 6498–6516, 6524–6556, 6576–6578 |
| **stacked-within-2m** | 13 | the same 13 places (1404–1434 … 6576–6580); closest stacking 1.44–1.85 m |
| **roll-rate** | 1 | 2482–2492, 1.219°/m against the bar's 1.2144 (just over) |
| **lap-proof** | 1 | 1376–11224 (the lap proof fails because of the above) |

- So even with every ray-gap red gone, the export would still be refused by **28 other reds**: 13 self-intersection, 13 stacked, 1 roll-rate and 1 lap-proof.
- The keeper's message showed only the first.

## 2 · At each red: what the mesh actually is (`diag.js`, an instrumented copy of `src/validate/raygap.js`: the same weld, edges, probes and ray)

**11 red edges** behind the 6 red ranges. For each one: which mesh the boundary edge belongs to, which mesh the ray hit, and where the edge's OWN piece sits (`overlap.js`).

| red s | the edge is on | at its own s | its bank | its u (half-width 15.5) | the ray hits | at s | apart along the lap | centrelines apart |
|---|---|---|---|---|---|---|---|---|
| 4510 | p21 | 6498 | −306° | +15.08 (its outer edge) | p14 | 4520 | 1,978 m | 9.76 m |
| 5814 | p20 | 6348 | −306° | +15.07 | p17 | 5820 | 528 m | 10.77 m |
| 5816 | p20 | 6350 | −306° | +15.07 | p17 | 5822 | 528 m | 10.00 m |
| 5818 | p20 | 6352 | −306° | +15.07 | p17 | 5824 | 528 m | 9.26 m |
| 5856 | p20 | 6382 | −306° | −15.08 | p17 | 5852 | 530 m | **0.93 m** |
| 5858 | p20 | 6384 | −306° | −15.08 | p17 | 5854 | 530 m | 1.46 m |
| 5946 | p3 | 1480 | +35.9° | −15.25 | p18 | 5936 | 4,456 m | 15.62 m |
| 5948 | p3 | 1478 | +35.2° | −15.25 | p18 | 5938 | 4,460 m | 16.79 m |
| 5984 | p3 | 1428 | +13.1° | −15.28 | p18 | 5996 | 4,568 m | 10.34 m |
| 5984 | p3 | 1430 | +14.1° | −15.28 | p18 | 5994 | 4,564 m | 11.64 m |
| 6022 | p3 | 1406 | +2.1° | +15.26 | p18 | 6008 | 4,602 m | 10.17 m |

- **Every edge is a road's OWN outer edge** (|u| 15.07–15.28 of 15.5). Of the 15,260 boundary edges after the 5 mm weld, none of the red ones is inside a road.
- **The ray met another piece 0.22–0.99 m along its 1 m reach.** The nearest other boundary edge is 0.74–1.10 m away: that is the OTHER road's edge, not the far side of a crack.
- **The pictures** (`handback/p-test1-E_2026-10-04_evidence/`), the mesh around the red edge in its own plane (red: boundary edges; blue: the ray's four probes; grey: every triangle within ±0.5 m of the plane):
  - `gap2_s5814_wide.png` (6 × 6 m): below the red line is p20's own grid, ending at its outer edge. Above it, **p17's grid crosses it at an angle in the same plane**, and the probes land on p17.
  - `gap1_s4510_wide.png`: the same at p21 against p14.
  - **No hole in either.**
  - Two zoomed pictures (0.3 m) were drawn and came out identical and empty (there is nothing within 0.15 m of the edge but the edge). They are dropped.
- **The `self-intersection` and `stacked-within-2m` reds** come from separate checks (the mesh self-check, and the stacking check) and fire at the same s. They need no ray, so they confirm this independently of raygap.

## 3 · Classification

| red | class | the geometry behind it |
|---|---|---|
| 5814–5818, 5856–5858 (p20 ↔ p17) | **REAL: the layout overlaps itself** | the rolled turn (bank −306°, about 0.68°/m, radius about 84 m) closes a full circle in about 529 m and lands on its own previous coil: p20 at s 6348–6384 over p17 at s 5820–5854, with centrelines **0.93–10.8 m** apart. Not enough climb between coils. |
| 5946–5948, 5984, 6022 (p3 ↔ p18) | **REAL: the layout overlaps itself** | the same circle (p18, s 5936–6008) passes through the lap's early piece p3 (s 1406–1480, bank +2° to +36°), 10–17 m between centrelines, with the 31 m-wide roads crossing |
| 4510 (p21 ↔ p14) | **REAL: the layout overlaps itself** | p21 (s 6498, bank −306°) against p14 (s 4520, bank −178°), 9.8 m between centrelines |
| — | **VALIDATOR ARTEFACT** | **none found.** The ray's direction (the edge triangle's normal), its reach (1.0 m) and the probes behave as written. No red comes from a sign under inversion: the hits are within reach on both sides, with normal dot U from −0.66 to +0.95. |

## What would fix it (the keeper's layout, not the code; for the fix packet to word)
- **The spiral's coils must not stack:** add climb (or drop) through the turning section so each coil clears the last by more than the stacking bar (2 m) plus the road's own wall. Or open the radius so successive turns land elsewhere.
- **The circle must not pass through p3/p14:** move it, or lift it over them.
- inferred, not run: the ray-gap reds should vanish with the self-intersections, since they are where one road's edge sits on another.

## What this does NOT establish
- **Nothing was fixed, and no altered layout was tried.** "Add climb" is inferred from the measured coil spacing, not tested.
- **The roll-rate red** (1.219 against 1.2144) is a separate, marginal finding, not diagnosed further.
- **No AC launch.**

## Instruments (scratchpad `…\scratchpad\test1\`)

| file | sha256 |
|---|---|
| `diag.js` | `a80a6cd4…` |
| `overlap.js` | `af3977e9…` |
| `out/diag.json` | `7d700b82…` |
| `out/gaps.json` | `a30ff3fc…` |
| `out/overlap.json` | `07011df2…` |
| `gap1_s4510_wide.png` | `0cd84167…` |
| `gap2_s5814_wide.png` | `8453186a…` |

Commands, each under the lock: `node diag.js <tree> out`, then `node overlap.js <tree> out`.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_test1_raygap_2026-10-04.md · scratchpad test1/out/diag.json, gaps.json, overlap.json
