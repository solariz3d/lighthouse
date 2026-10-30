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
| chassis, `chassisG` 40: box over the mesh, p50 at 40–45 / 45–50 / 50–55 g (cm) | 3.2 / **−0.9** / −4.3 | 0.9 / **0.5** / −9.2 | **holds**: the mesh is reached at about 47–50 g in both, above the predicted 40 |
| sustained, `sustainedG` 55 for 0.5 s: longest unbroken at ≥ 55 g | 0.77 s (total 1.48 s) | 0.44 s (total 0.43 s) | **holds** (not held past 0.5 s) |
| proven, `provenG` 90: peak load | 60.19 g (s 8,603, 765 km/h) | 58.74 g (s 8,585, 761 km/h) | **not reached** |
| the line-predicted load at the ten highest peaks, measured − predicted (median) | 6.5 g | 4.2 g | **holds**: the ~7 g margin covers it |
| downforce ray, 200 N per m/s: lift-off frames above 300 km/h with load < 0 | 731 of 26,078 (2.8%), worst −18.3 g | 189 of 11,128 (1.7%), worst −10.8 g | **holds** (the same law, by D551; fewer lift-off frames) |

**The reference's extremes are off-road moments.** It has 235 frames "under the mesh", down to −256 cm and from −18.3 g, but its band medians are those of D515's car: the mesh at about 47 g. Moments when the car was off the road surface make the min and the from-load column meaningless for it. The band medians are the measure.

**Speed on the same stretches** (median within ±50 m, every 1,000 m: `S\d560\elys.txt`): C03 is within about 55 km/h of the reference on most of the lap. It is slower at s 1,000–2,000 (682 against 785 and 554 against 750 km/h) and at 25,000, and faster at 3,000 and 17,000. So the loads compare at similar speeds on the hard stretches; the two peaks are 18 m and 4 km/h apart.

## Verdict so far

**C03 (D551 group B: same springs and stops, a shorter wheelbase): every line it reached holds,** and the 90 g line was not reached. D551 inferred that group B's box ends sit 3–5 mm nearer the road. That does not show here: C03's box over the mesh stays at +0.5 cm at 45–50 g, where the reference is already at −0.9.

**The falsifier** is about the cars D551 marked unsafe: groups C (the actives), E and F. **None of them is in yet**, so it has not been tested.

## Appended

(Each new ELYSIUM replay he saves gets a row here, by its label, with the same table.)

## Process

- **Copies** (`S\d560\bgcopy.ps1`, Windows background mode): two replays, `t180b_elysium.kn5` (203,816,893 bytes, sha256 `21a13bf81a0c4eca…`), the AI line, `surfaces.ini`, `models.ini` and `.t180b-builder.json`.
- **Runs:** `S\d560\hold.js` (heavy-run slot) → `run560.ps1` (each tool at BelowNormal). `elys.js` → `elys.txt`.
- **First run, corrected:** a first pass through D544's run script read the CRAZY TEST kn5 name and the unpatched parser. Both outputs were discarded and the runs redone with `run560.ps1`.
- **Teleport frames:** C03 has one replay reset at t 169.54 s (loads.cjs prints 33,446 g there). loads.cjs and sustained.js do not filter it, so their max is not used; the figures above are `elys.js`'s, after the reset filter.
