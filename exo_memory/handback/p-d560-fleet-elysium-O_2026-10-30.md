# D560: the fleet on ELYSIUM, measured from his replays (pane O, check it, measurement only), version 1

**Brief:** the chair's ring of 2026-10-30T23:22:50Z. **Plan:** `exo_memory/loop/plan_d559_fleet_on_elysium_measured_2026-10-30.md` (c7f2f3a1).

**Labels:** D551's (`p-d551-cars-O_2026-10-30.md`). Car names stay in my scratchpad's key (`S\d551\key.txt`) and on the private page.

**Version 1 covers** the reference and **C03**, the first replay he saved after 16:54. A watch on the replay folder (listing only) picks up each new ELYSIUM replay. Rows are appended in "Appended" below, and the verdict is re-stated when he says he is done.

**He is racing and streaming, so:**
- Every replay and the track export were COPIED to my scratchpad in Windows background mode (low CPU and low I/O priority), then read there.
- Nothing was opened in the game, and nothing was written in the game or replay folders.
- Every tool ran at BelowNormal under a heavy-run slot. No window.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad\`.

## 0. The road: both laps measure against today's export

- **The export is newer than the reference lap.** ELYSIUM's live export was written 2026-10-17T15:51:08Z (09:51 local; checked: its `.t180b-builder.json`, and the kn5 and AI line stamped 09:51). The reference replay is 09:30 the same morning, 21 minutes earlier.
- **No copy of the earlier export exists:** the `.zip` beside it holds the same 09:51 files, and nothing else was found. So the D544 §0 diff of two exports cannot be done.
- **So the replays test the road themselves.** On the road a lap was driven on, the four wheel centres sit about a tyre radius (less squash) over the mesh. Where the road changed, a lap driven on the old one floats or sinks against today's mesh there.
- checked (`elys.js`): wheel-centre height over today's mesh, per 500 m of s:
  - reference p5/p50/p95 0.263 / 0.351 / 0.417 m; C03 0.261 / 0.364 / 0.407 m;
  - **worst difference in any 500 m between the two medians, 4.2 cm; none over 5 cm.**
- inferred: the reference was driven on a road equal to today's within that resolution (5 cm per 500 m). A change smaller than that, or shorter than 500 m, would not show.
- **CORRECTION, with the instrument's own noise floor** (found when C19 came in; both C03 and C19 were driven on today's export, so on the identical road):
  - C03 against C19, per 500 m: under 5 cm everywhere except s 9,500–10,500, where the medians differ by **11.8 cm** (C03 0.259 / 0.258 m, C19 0.141 / 0.140 m).
  - That stretch is inverted (median tilt 113°), where the ray along the car's normal can read another surface.
  - So on the same road the check's noise reaches about 12 cm in inverted stretches, and stays under 5 cm elsewhere.
  - The reference against C03 (4.2 cm at most, everywhere, including that stretch: 0.257 against 0.259 m) is consistent with the same road, but the check rules out only changes larger than its noise: about 12 cm in inverted stretches, 5 cm elsewhere.

## 1. The reference: what the MACH6 lines rest on, on ELYSIUM

**The replay** (sha256 `692fa6de1b886278…`, 44,753 frames): 26,110 rows measured; 26,078 after the reset filter (a frame over 200 g or 1,200 km/h is a replay reset, not a load).
- **blackbox's parser refused this file** ("could not locate car motion data"). Its single probe, 220 frames at a third of the way in, found the car standing.
- My scratchpad wrapper `S\d560\acreplay-probe.js` loads blackbox's `acreplay.js` unchanged and retries the same probe further in. It found the motion at the halfway point, with stride 284, the same as C03's.
- inferred: the parse is right, because the lap's figures below land where D341 and D515 put this car (58–62 g peaks, the stop near 25 g, the mesh near 47 g).

**The C03 replay:** sha256 `46d2f6dc86a2f648…`, 11,310 frames; 11,129 rows, 11,128 after the filter.

**The tools:** the D515 set, unchanged except two things. The parser goes through the shim, and `table.js` reads the ELYSIUM kn5 by name. Every line below is from `elys.js` over each run's `table.csv`.

| line (limits.js MACH6) | reference | C03 | C03 |
|---|---|---|---|
| suspension stop, `suspensionStopG` 25: h p50 at 25–30 / 30–35 / 35–40 / 40–45 g (cm) | −18.6 / −19.4 / −20.0 / −19.8 | −18.6 / −19.7 / −20.1 / −20.2 | **holds** (the same plateau) |
| chassis, `chassisG` 40: box over the mesh, p50 at 40–45 / 45–50 / 50–55 g (cm) | 3.2 / **−0.9** / −4.3 | 0.9 / **0.5** / −9.2 | **holds at the threshold, deeper past it**: the mesh is reached at about 47–50 g in both, above the predicted 40; past it, see the helix stretch |
| sustained, `sustainedG` 55 for 0.5 s: longest unbroken at ≥ 55 g | 0.77 s (total 1.48 s) | 0.44 s (total 0.43 s) | **holds** (not held past 0.5 s) |
| proven, `provenG` 90: peak load | 60.19 g (s 8,603, 765 km/h) | 58.74 g (s 8,585, 761 km/h) | **not reached** |
| the line-predicted load at the ten highest peaks, measured − predicted (median) | 6.5 g | 4.2 g | **holds**: the ~7 g margin covers it |
| downforce ray, 200 N per m/s: lift-off frames above 300 km/h with load < 0 | 731 of 26,078 (2.8%), worst −18.3 g | 189 of 11,128 (1.7%), worst −10.8 g | **holds** (the same law, by D551; fewer lift-off frames) |

**The reference's extremes are off-road moments.** It has 235 frames "under the mesh", down to −256 cm and from −18.3 g, but its band medians are those of D515's car: the mesh at about 47 g. Moments when the car was off the road surface make the min and the from-load column meaningless for it. The band medians are the measure.

**Speed on the same stretches** (median within ±50 m, every 1,000 m: `S\d560\elys.txt`): C03 is within about 55 km/h of the reference on most of the lap. It is slower at s 1,000–2,000 (682 against 785 and 554 against 750 km/h) and at 25,000, and faster at 3,000 and 17,000. So the loads compare at similar speeds on the hard stretches; the two peaks are 18 m and 4 km/h apart.

## The helix stretch, his g test zone (the librarian's 17:30 addition)

**The window: s 8,400–8,900,** piece 17's high-load run.
- checked (`S\d560\helix.js`, from the same `table.csv` files, no new run): the load's 100 m median passes 30 g at 8,400 (8,300–8,400: 11–12 g) and falls under 33 g after 8,900, in both laps.
- That is narrower at the start than the suggested 8,300–8,900, because 8,300–8,400 is still at 11–12 g.
- The reference passes through it twice; C03 once.

| helix, s 8,400–8,900 | reference pass 1 | reference pass 2 | reference pooled | C03 (one pass) |
|---|---|---|---|---|
| frames | 167 | 167 | 334 | 171 |
| deepest 50 m median of the box over the mesh | **−10.8 cm** (s 8,650–8,700) | **−6.4 cm** (8,650–8,700) | −7.7 cm (8,600–8,650) | **−10.2 cm** (8,600–8,650) |
| share of frames with the box under the mesh | 60.5% | 69.5% | 65.0% | 38.0% |
| box median at matched load, 50–55 g | −8.7 cm (26 frames) | −4.2 cm (67) | −4.3 cm (93) | **−9.2 cm (24)** |
| box median at matched load, 55–60 g | −10.0 cm (46) | −5.4 cm (48) | −5.8 cm (94) | −7.6 cm (29) |
| h median (body over the wheel centres) | −24.1 cm | −27.9 cm | −26.4 cm | −20.4 cm |
| peak load and its speed | 60.19 g, s 8,603, 765 km/h | 58.24 g, s 8,585, 753 km/h | 60.19 g | 58.74 g, s 8,585, 761 km/h |
| load and speed medians | 49.3 g, 748 km/h | 53.4 g, 738 km/h | 52.2 g, 740 km/h | 45.2 g, 717 km/h |

**What his "pulled under the track a bit" is, in these numbers:**
- **Both cars go into the mesh in the helix.** The reference's box is under it for 60–70% of its helix frames, and up to −10.8 cm deep at the 50 m median. C03 is under it for 38%, and up to −10.2 cm.
- **The reference's two passes differ by 4.4 cm** (−10.8 against −6.4, deepest bin) and by 4.5 cm at matched load (50–55 g: −8.7 against −4.2).
- **C03 sits inside that pass-to-pass spread** on the deepest bin and at 55–60 g. At 50–55 g it is 0.5 cm past the reference's deeper pass (−9.2 against −8.7), on 24 frames.
- The −4.3 cm the 17:30 ring compared against is the reference's POOLED figure, which its shallower second pass dominates (67 of its 93 frames there).
- inferred: what he feels is real and is the same in kind as the reference's. On this evidence C03 is not deeper beyond the reference's own run-to-run variation, except that one 0.5 cm cell.

## Verdict so far

**C03 (D551 group B: same springs and stops, a shorter wheelbase):**
- **The chassis line holds at the threshold, deeper past it.** The box reaches the mesh at about 47–50 g, as the reference does; in the helix at 50–55 g its box median is −9.2 cm, against the reference's −4.2 and −8.7 on its two passes. Past the threshold it is within the reference's pass-to-pass spread, except 0.5 cm at 50–55 g.
- **The other lines it reached hold:** the stop, the sustained line and the line-prediction margin.
- **The 90 g line was not reached.** D551 inferred that group B's box ends sit 3–5 mm nearer the road. That does not show here: C03's box over the mesh stays at +0.5 cm at 45–50 g, where the reference is already at −0.9.

**The falsifier** is about the cars D551 marked unsafe: groups C (the actives), E and F. **None of them is in yet**, so it has not been tested.

## Appended

(Each new ELYSIUM replay he saves gets a row here, by its label, with the same table.)

### C19, saved 17:48 (D551 group A: the reference's own physics, byte for byte)

- **The replay:** sha256 `e5a1925667166c92…`, 1,761,804 bytes, 5,179 frames.
  - 4,830 rows, none dropped by the reset filter. `loads.cjs` alone prints a 19,470 g reset frame, which `table.js` already drops.
  - One pass through the helix.
- **Same road:** see the correction in §0. C19 against C03 is under 5 cm everywhere outside the inverted s 9,500–10,500.

| line | C19 | verdict |
|---|---|---|
| suspension stop, 25 g: h p50 at 25–30 / 30–35 / 35–40 / 40–45 g | −17.2 / −17.6 / −19.4 / −19.9 cm (20, 20, 17, 24 frames) | **holds** (the plateau reached by 35–40 g, on few frames) |
| chassis, 40 g: box over the mesh p50 at 40–45 / 45–50 / 50–55 g | 4.7 / **0.1** / −6.2 cm | **holds at the threshold** (the mesh at about 47–50 g). Past it, it is inside the reference's pass-to-pass spread. |
| sustained, ≥ 55 g over 0.5 s | longest 0.14 s | **holds** |
| proven, 90 g | peak 55.44 g, s 8,585, 733 km/h | **not reached** |
| line-predicted margin, top-10 peaks | median +5.7 g | **holds** |
| lift-off above 300 km/h | 79 of 4,830 (1.6%), worst −5.25 g | **holds** |

**Helix, s 8,400–8,900** (174 frames):
- deepest 50 m median of the box over the mesh: −7.4 cm (s 8,700–8,750);
- under the mesh: 48.3% of frames;
- box median at 50–55 g: −6.2 cm (57 frames); at 55–60 g: −4.1 cm (9 frames);
- h median −23.4 cm;
- peak 55.44 g at 733 km/h; load median 47.0 g, speed median 721 km/h.

**Why this row matters beyond itself:** C19 IS the reference's physics, so its distance from the reference is the size of run-to-run (and driver) scatter on this track.
- Its helix figures (−7.4 deepest, −6.2 at 50–55 g) fall between the reference's two passes (−10.8 / −6.4 and −8.7 / −4.2).
- C03's (−10.2, −9.2) fall at the deep edge of the same spread.
- inferred: on this evidence, the spread between two passes of one car on this track is about 4–5 cm at the helix. A car has to differ by more than that before its row says anything about its physics.

### C07, saved 18:36 (D551 group B: a "ma_" regular, wheelbase 3.09 m)

- **The replay:** sha256 `9a01897cbe0b21ff…`, 30,068,352 bytes; `table.js` 3,917 rows (t 2.13–65.01), 3,912 after the reset filter.
- **It is not a lap: it ends at the helix.**
  - The car runs s 24,890 → the line → s 8,640.
  - At t 59.895–59.970 (s 8,627–8,639, 14.9 → 14.1 m left of the AI line), its load falls −5.6 → −46.0 g, the box goes to −2.69 m under the mesh, and h goes to −2.02 m.
  - The table then has no rows until t 61.04, then a reset at t 64.95.
  - checked: `out/C07/table.csv`, filtered on box < −0.2 m, load < −10 g or a reset.
  - inferred: the car left the road there. The cause is not separated (driver, car, or the group-B box clearance D551 inferred at R 75 m).
- **Same road:** worst |Δ| to the reference 0.041 m per 500 m, none marked (`elys-C07.txt`).

| line | C07 (s 24,890 → 8,640) | verdict |
|---|---|---|
| suspension stop, 25 g: h p50 at 25–30 / 30–35 / 35–40 / 40–45 g | −16.4 / −17.8 / −18.1 / −18.8 cm (5, 5, 6, 4 frames) | **too few frames to read**: one helix entry |
| chassis, 40 g: box over the mesh p50 at 40–45 / 45–50 / 50–55 / 55–60 / 60–70 g | 4.0 / 4.0 / 1.9 / **−0.1** / −1.3 cm (4, 5, 7, 15, 13 frames) | **holds at the threshold, on few frames**: the mesh at about 55–60 g, later than the others' 47–50 g |
| sustained, ≥ 55 g over 0.5 s | longest 0.42 s | **holds** |
| proven, 90 g | peak **62.87 g**, s 8,579, 779 km/h (the highest of the four cars) | **not reached** |
| line-predicted margin, top-10 peaks | median +2.1 g | **holds** |
| lift-off above 300 km/h | 64 frames, worst −46.00 g | **not read**: the worst frames are the departure at s 8,627–8,639, not aero |

**Helix, s 8,400–8,900** (one pass, t 58.9–60.3, 100 frames):
- deepest 50 m median of the box: −12.5 cm (s 8,600–8,650, which holds the departure frames);
- under the mesh: 26.0%;
- box median at 50–55 g: 1.9 cm (7 frames); at 55–60 g: −0.1 cm (15);
- h median −23.3 cm;
- peak 62.87 g at 779 km/h; load median 34.3 g, speed median 785 km/h (`helix-C07.txt`).

## Process

- **Copies** (`S\d560\bgcopy.ps1`, Windows background mode): two replays, `t180b_elysium.kn5` (203,816,893 bytes, sha256 `21a13bf81a0c4eca…`), the AI line, `surfaces.ini`, `models.ini` and `.t180b-builder.json`.
- **Runs:** `S\d560\hold.js` (heavy-run slot) → `run560.ps1` (each tool at BelowNormal). `elys.js` → `elys.txt`.
- **First run, corrected:** a first pass through D544's run script read the CRAZY TEST kn5 name and the unpatched parser. Both outputs were discarded and the runs redone with `run560.ps1`.
- **Teleport frames:** C03 has one replay reset at t 169.54 s (loads.cjs prints 33,446 g there). loads.cjs and sustained.js do not filter it, so their max is not used; the figures above are `elys.js`'s, after the reset filter.

### C05, the 18:34 auto-save (D551 group B, the keeper's "fine" lap)

- **The replay:** sha256 `f449f0bb1c96a4e6…`, 30,186,339 bytes, 11,598 frames; `table.js` 11,369 rows, 11,368 after the reset filter, s 0–25,039.
- **No lap clock:** blackbox's lap clock records no completed lap inside this replay (`laps` empty). This auto-save's window does not hold a lap-clock reset. So the row is not tied to a recorded time.
- **Same road:** worst |Δ| 0.081 m per 500 m. Two cells are marked, 8,000–8,500 (0.298 vs 0.366) and 21,500–22,000 (0.283 vs 0.364). Both are inside the C19 spread (0.118 m), so they are not read as a road change.
- **Wheels:** `wheel.js` finds 0 events on any wheel. No wheel centre is under the top surface, or more than 0.5 m below an edge row, anywhere on the lap.

| line | C05 | verdict |
|---|---|---|
| suspension stop, 25 g: h p50 at 25–30 / 30–35 / 35–40 / 40–45 g | −18.8 / −19.8 / −19.5 / −20.1 cm (86, 87, 19, 21 frames) | **holds** (the plateau) |
| chassis, 40 g: box over the mesh p50 at 40–45 / 45–50 / 50–55 g | 3.0 / **0.8** / −1.8 cm (21, 32, 93 frames) | **holds at the threshold** (the mesh at about 50 g); never past 52 g |
| sustained, ≥ 55 g over 0.5 s | 0 s at ≥ 55 g | **holds** (not reached) |
| proven, 90 g | peak 52.24 g, s 8,597, 713 km/h | **not reached** |
| line-predicted margin, top-10 peaks | median +4.5 g | **holds** |
| lift-off above 300 km/h | 233 frames, worst −8.45 g | **holds** |

**Helix, s 8,400–8,900** (one pass, t 62.5–65.1, 175 frames):
- deepest 50 m median of the box: −2.4 cm (s 8,700–8,750); the deepest frame −3.0 cm at 52.0 g;
- under the mesh: 54.3%;
- box median at 50–55 g: −1.8 cm (93 frames);
- h median −23.7 cm;
- peak 52.24 g at 713 km/h; load median 50.3 g, speed median 709 km/h (`helix-C05.txt`).
- C05 was about 50 km/h slower through it than the reference, and about 10 g lower.

### Correction to C07's row, 2026-10-30

- "inferred: the car left the road there" is WRONG in kind. The keeper (18:38) and the frames say it went through the road, not off it.
- All four wheels were on top, the outer pair 1.5 m inside the mesh edge, until the box broke through at about −16 cm, 0.22 s after a 62.87 g peak.
- C07's lift-off and deep-box figures are that pass-through.
- See `p-d563-wheel-under-O_2026-10-30.md`, "C07 through the helix".

### C09, saved 18:45 (D551 group B, a "ma_" regular, wheelbase 3.14 m)

- **The replay:** sha256 `e5c0fd08228288a5…`, 27,611,553 bytes; `table.js` 4,237 rows, 4,236 after the reset filter.
- **It is not a lap.** The car holds the helix, then leaves the road. In order:
  - the D563 edge shape on the left at s 8,937–8,987;
  - a launch at s 9,065–9,083;
  - off the right edge at s 9,370–9,410.
  - See `p-d563-wheel-under-O_2026-10-30.md`, "C09: the helix held, then the edge".
  - The lift-off and deep-box figures below s 9,000 are clean. Those after it are that event.
- **Same road:** worst |Δ| 0.211 m, at 9,000–9,500 only (0.307 vs 0.096). That cell is the excursion itself, not the road.

| line | C09 (up to s 8,930) | verdict |
|---|---|---|
| suspension stop, 25 g: h p50 at 35–40 / 40–45 g | −18.2 / −19.7 cm (13, 15 frames) | **holds** (the plateau; the lower bands are the event's frames) |
| chassis, 40 g: box over the mesh p50 at 40–45 / 45–50 / 50–55 / 55–60 / 60–70 g | 4.0 / **0.3** / −11.3 / −14.8 / −12.0 cm | **holds at the threshold, deeper past it** (the mesh at about 47–50 g; −15.3 to −15.9 cm at 58–62 g, held, see p-d563) |
| sustained, ≥ 55 g over 0.5 s | **longest 0.71 s** (total 0.72 s) | **does not hold**: past 0.5 s at ≥ 55 g, and it held the road through it |
| proven, 90 g | peak 62.82 g, s 8,585, 787 km/h | **not reached** |
| line-predicted margin, top-10 peaks | median +4.4 g | **holds** |

**Helix** (t 63.6–66.1, 167 frames):
- deepest 50 m median of the box: −15.3 cm;
- box median at 55–60 g: −14.8 cm (23 frames);
- deepest frame −15.9 cm at 60.2 g;
- peak 62.82 g at 787 km/h;
- every wheel centre ≥ +0.230 m (`hx-C09.txt`, `helix-C09.txt`).

### C11 ("Matryoshka"), the 18:55 auto-save (D551 group B, wheelbase 2.93 m)

- **The replay:** sha256 `065789823b52c45b…`, 30,292,928 bytes; `table.js` 4,208 rows, none dropped.
- **It is not a lap:** it goes through the road in the helix at t 60.06, s 8,585. See p-d563, "C11".
- **Same road:** two cells are marked (9,000–9,500 and 10,500–11,000), and both are the post-departure frames, not the road.

| line | C11 (to s 8,585) | verdict |
|---|---|---|
| suspension stop, 25 g: h p50 at 25–30 / 30–35 / 35–40 / 40–45 g | −17.0 / −17.2 / −17.5 / −17.9 cm (8, 6, 5, 5 frames) | **too few frames to read** |
| chassis, 40 g: box over the mesh p50 at 45–50 / 50–55 / 55–60 g | 3.8 / 1.6 / **0.4** cm (7, 6, 11 frames) | **holds at the threshold, on few frames**: the box is at the mesh at its peak, and went through after it, sinking (p-d563) |
| sustained, ≥ 55 g over 0.5 s | longest 0.17 s | **holds** |
| proven, 90 g | peak 57.67 g, s 8,561, 776 km/h | **not reached** |
| line-predicted margin, top-10 peaks | median +2.4 g | **holds** |
| lift-off above 300 km/h | 110 frames, worst −64.43 g | **not read**: the worst frames are the pass-through |

**Helix** (t 59.3–60.6, 90 frames): the box under the mesh on 14.4% of frames; the deepest 50 m median −9.9 cm (s 8,550–8,600, which holds the break); h median −22.0 cm; peak 57.67 g at 776 km/h; speed median 783 km/h.

**"Lightning"** (the chair's note): group A, no replay saved, so no row.
