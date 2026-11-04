# D515: what the CRAZY TEST Mach 6 replay teaches about T-180 geometry (pane O, check it, read only)

Brief: the chair's ring, 2026-10-28T15:42:07Z (the librarian's 15:41Z order).
Evidence: `exo_memory/handback/p-d515-crazytest-O_2026-10-28_evidence/`. It holds:
- `table.csv`, one row per frame, 6,530 rows;
- `table-geometry.csv`, one cross-section about every 120 m;
- three PNGs;
- every tool's output;
- the scripts.

Nothing was written to the AC folder, and nothing in t180 was changed. No game and no window were started; every run was at BelowNormal and ended on its own.

## 0. The inputs, secured before D514's re-export

```
checked: the target folder's files are stamped 2026-10-28 09:22:41 local (15:22:41Z); .t180b-builder.json "written": 2026-10-28T15:22:35.056Z, geometry sha256:d5aa4fb3…4e31
checked: my copies (scratchpad d515-track\) against E's backup manifest (E scratchpad d514\d514-before\manifest.sha256.json) → equal:
  t180b_crazy_test_test.kn5  sha256 bfde4dc61db5a2bc516b517f74bee971c69ba4fcdf76a529febf27132e0cc185
  ai/fast_lane.ai            sha256 0cb82e6bf9e0281e5cbeda59c26e41ea59bc021cd3cb6e78316e8e076e9833f9
checked: replay copied: 2,395,488 B, sha256 168d45c76583d1b13896bad88746d1e5308b4d65a25bef0c98eaae5bdaec1ad8, car ohyeah2389_t180_mach6, 7,095 frames at 0.015 s
checked: E's staged re-export from the saved eq-CRAZY TEST.t180track (saved 09:22:00) carries geometry sha256:a632de95…e462, not d5aa4fb3…
```

The saved document is not what he drove. Its geometry hash differs from the export's, which confirms D514. So **the 13 pieces' words, as exported, are not available**. The geometry here is the export's own:
- **From the AI line's extras, per point** (`src/export/ailine.js:21-29`): camber = bank, grade = climb, horizontal radius, surface normal, and edge distances.
- **The 3-D curvature of the line**, split into its part INTO the road (κn) and its part in the road's plane (κg).
- **From the kn5 road mesh:** the piece (mesh name `_p<k>`) and the cross-section.

The cup readings are **not usable on piece 13**. The helix's other passes lie within the 40 m the cross-section ray reaches, so the measured width jumps between 31 and 80 m there. I build no rule on cup.

## 1. The three tools (plus speed.cjs), at BelowNormal

```
checked: node tools/loads.cjs → loads.txt: 6,530 of 7,095 frames; load p50 6.13, p90 45.78, p99 61.85, p99.9 62.90, max 63.28 g (t 93.96 s, 720 km/h, tilt 90°, R 64 m)
checked: node tools/bottoming.cjs → bottoming.txt: h median +6.2 cm at 0-1.5 g … -19.4 cm at 25-30 g, -19.9 at 30-40 g; then -26.1 at 40-60 g and -47.8 at 60-100 g
checked: node tools/boxdepth.cjs → boxdepth.txt: box below the road (rigid tyres) in 420 frames, 4 episodes; deepest 14.6 cm at t 94.35 s; longest 417 frames = 6.25 s (t 91.75-97.99)
checked: node tools/speed.cjs → speed.txt: p50 761, p99 821, max 838 km/h
```

## 2-3. The table and its mapping (table.js → table.csv)

Per frame, the measures are the tools' own, line for line: load, h and the rigid-tyre box depth. Added per frame:
- the lateral g, across the road;
- s on the AI line (nearest point) and the distance d from it;
- the car's offset across the road;
- the body's distance to the **mesh** surface along the car's own normal, minus 0.05 m (the box over the mesh);
- the station's bank, climb, horizontal R, κn, κg and piece.

```
checked: peaks.txt: the line's own curvature predicts the measured load, (v²·κn + g·n_y)/g against measured above 600 km/h: 5,911 frames, r 0.988, measured - predicted p50 +0.20 g
checked: peaks.txt: distance from the AI line p50 4.48 m, p99 18.52 m; one run, t 8.38-106.32 s, s 48-19,622 m (open line, 19,652 m)
checked: bands.txt: the mesh measure agrees with the rigid-tyre one at rest: box over the mesh 37.3 cm and rigid-tyre clearance 40.7 cm at 0-1.5 g (3.5 cm of tyre squash)
```

So the mapping holds. Every peak lies on **piece 13**: a descending helix on a near-vertical wall.
- bank 85.0° (constant);
- horizontal R 63–76 m;
- κn 11.6–13.3 /km, which is the road's normal radius, 75–86 m;
- climb −4° to −11°;
- 707–753 km/h.

The load built from 22 g at s 15,500 to 61 g at s 16,600, held 56–63 g to s 17,850, then fell (plot `load-vs-s-piece13.png`).

**One replay artefact:** at s 12,729–12,747 (t 74.46–74.55) the speed reads 664 km/h for three frames, between 731 and 728. The line-predicted load dips with it. That is a stutter in the replay, not the road.

## 4. The peaks

**The ten hardest load frames** (peaks.txt; at least 0.6 s apart). Every one is on p13, bank 85°.
- **63.28 g:** t 93.96, s 17,025, 720 km/h. The line asks 54.1 g. R 64 m, κn 13.3/km, climb −6.6°. Box 14.2 cm under the road (rigid tyres) and 26.9 cm into the mesh.
- **61.97 g:** t 93.34, s 16,905, 716 km/h. Box 7.2 cm under / 20.4 cm into the mesh.
- **61.72 g:** t 92.03, s 16,635, 748 km/h. 4.8 / 17.8 cm.
- **61.32 g:** t 95.56, s 17,336, 708 km/h. 13.3 / 26.9 cm.
- **61.27 g:** t 94.56, s 17,145, 707 km/h. 14.0 / 27.7 cm.
- **61.18 g:** t 96.53, s 17,528, 730 km/h. 13.6 / 27.5 cm.
- **59.82 g:** t 92.64, s 16,761, 722 km/h. 6.2 / 19.3 cm.
- **58.45 g:** t 91.41, s 16,509, 753 km/h. 4.1 cm OVER the road (rigid tyres) / 8.3 cm into the mesh.
- **57.22 g:** t 97.14, s 17,654, 725 km/h. 13.3 / 27.3 cm.
- **56.24 g:** t 97.83, s 17,798, 733 km/h. 2.1 / 15.6 cm.

**Closest to clipping:**
- t 94.35, s 17,103, 715 km/h, 62.31 g. Box 14.6 cm under (rigid tyres) and **28.1 cm into the mesh**, the deepest frame. R 63 m, κn 13.3/km, climb −7.0°.
- t 95.88, s 17,402, 60.94 g: 14.6 / 27.4 cm.
- t 96.57, s 17,540, 60.73 g: 14.5 / 28.0 cm.

The rest are in peaks.txt. All 420 rigid-tyre box-under frames are on p13, at s 16,581–17,846 and 56.0–63.3 g (p10–max).

**Against FINDINGS' maximum: higher in time, not in peak.** sustained.js uses loads.cjs's measure, on this replay and on the four Centrifuge replays FINDINGS §3b/§3c measured (their maxima reproduce: 89.79, 85.84, 83.71, 77.31 g).

| | peak | longest unbroken ≥ 50 g | ≥ 55 g | ≥ 60 g | box under the road (rigid tyres), longest |
|---|---|---|---|---|---|
| CRAZY TEST 28-10 | 63.28 g | **8.22 s** | **7.13 s** | 1.83 s | **6.25 s**, 14.6 cm max |
| Centrifuge 19-07 | 89.79 g | 0.49 s | 0.43 s | 0.36 s | 0.40 s (§4b: 20.1 cm) |
| Centrifuge 16-08 | 85.84 g | 0.93 s | 0.40 s | 0.33 s | 0.22 s |
| Centrifuge 11-08 | 83.71 g | 0.90 s | 0.39 s | 0.32 s | 0.18 s |
| Centrifuge 12-07 | 77.31 g | 0.48 s | 0.42 s | 0.36 s | 0.42 s |

- The peak is **26.5 g below** Centrifuge's 89.8 g.
- Time held at 55 g or more is **16.6× Centrifuge's longest** (7.13 s against 0.43 s).
- Time with the box under the road is **15×** (6.25 s against 0.42 s), at shallower depth than Centrifuge's deepest (14.6 cm against 20.1 cm).

So the keeper's "most Gs I've ever stably seen" holds as **load held**, not as peak load.

**Margins** (bands.txt; plot `height-vs-load.png`). Each stage is checked from the 1 g bins unless marked.

| stage | where it starts | at the deepest frame (62.3 g) |
|---|---|---|
| tyres stop compressing | ~10 g: implied squash 13.1–13.7 cm in every band from 10 g up | — |
| **suspension out of travel** | **~25 g**: h -19.4 cm at 25–30 g, -20.9 at 45–50 g (a plateau) | 28.7 cm past the plateau (h -49.1 against -20.4); 37 g past it |
| **box touches the road mesh** | **~47 g**: box over the mesh 0.7 cm at 40–45 g, 0.2 at 45–50 g; at least half the frames under from the 47 g bin | **28.1 cm into the mesh; 15 g past it** |
| rigid-tyre box under the road (FINDINGS' clipping measure) | **~55 g**: 78% of the 55 g bin, 99–100% from 60 g | **14.6 cm under; 7 g past it** |
| fall-through (the soft block's MAX_DEPTH = 4 m, surfaces.ini) | not reached | **3.72 m of depth left**; in g, unknown |

- Between 25 and 47 g the box rode **0.2–1.4 cm** over the mesh. So past 25 g the real clearance is about 1 cm, not the ~14 cm the rigid-tyre measure shows.
- Above about 58 g the depth stopped growing: 26.4–28.1 cm into the mesh across the 58–60, 60–62 and 62–64 g bands. The soft road held the box at about 28 cm.
- inferred: no frame says at what load that depth would start to grow again, so the margin to fall-through cannot be put in g.

## 5. What the geometry did, and what the builder could carry

**What p13 did right.**
- **checked:** the high-load stretch had one shape: bank held at 85.0°, and κn rose and fell smoothly over about 4 km (s 15,000–19,600; `load-vs-s.png`, "κ into road").
- **checked:** there is no step in bank, and no grade kink, inside the 56–63 g stretch. The climb runs smoothly from 0 to −14.6°.
- **checked:** the load followed the line's curvature; the box depth followed the load.
- **inferred:** that one smooth shape is why it was "stable": a long, steady load the soft road can hold, where Centrifuge's peaks are short spikes. Nothing here separates that from the driver.

**Rules or thresholds.** Five; the first two are the strongest.

1. **Above 25 g the car has no travel left.**
   - checked (bands.txt): the h plateau is -19.4 to -20.9 cm from 25 to 50 g, and tyre squash is flat at about 13.5 cm from 10 g. This agrees with FINDINGS §4's ~20 g.
   - Builder: where the design load is over 25 g, a step or a gap in the surface reaches the chassis directly, so mark it RED there.
   - inferred: this export's two downforce-ray gaps (s 1,090 and 3,100) sit where this replay ran under 25 g (p2–p6: 10.7–23.1 g max). That is why they did no harm here.
2. **Keep the design load at or under 45 g to ride on the tyres.**
   - checked: the box reaches the mesh at about 47 g (bands above).
   - As a curvature limit: κn ≤ (45 − cos bank)·g / v².
     - At 720 km/h that is κn ≤ 11.0 /km, a normal radius of at least 91 m.
     - At 820 km/h it is ≤ 8.5 /km, at least 118 m.
   - p13's peak was κn 13.3 /km at 720 km/h (t 93.96).
3. **The line-predicted load runs about 8 g low exactly when the box is on the road, so carry a margin.**
   - checked: measured minus predicted is +0.20 g (p50) over all frames above 600 km/h, but +6.2 to +9.2 g at the ten peaks (peaks.txt).
   - For rule 2's 45 g, cap the builder's predicted load at about 37–40 g.
   - inferred, cause not separated: the car ran 0.7–5.2 m to the right of the AI line at the peaks ("off"), on a tighter path than the line.
4. **Past 47 g, only on a continuous soft road, and not beyond what was survived.**
   - checked: 6.25 s at 56–63 g with the box 26–28 cm into the mesh. The depth did not grow across 58–64 g, under surfaces.ini's block (SOFT_ERP 0.8, SOFT_CFM 0.0002, MAX_DEPTH 4; as FINDINGS §4c).
   - Builder: allow 47–63 g only where that block is written and the surface has no gap.
   - inferred: 63 g held for about 7 s is the highest sustained load measured survived. It is a limit known to hold, not a ceiling the data has found.
5. **On a near-vertical wall, a climb change is a sideways swerve, and it can unload the road.**
   - checked (t 82.5–83.6, s 14,500–14,760; p11, bank 85°, 819 km/h): the climb went from −5.05° to 0° over s 14,560–14,660.
   - Lateral g reached −3.16 g (t 83.01). The line's in-plane curvature κg (−0.7 /km) predicts 3.7 g.
   - The load into the road fell from about +0.2 to **−1.67 g**, with the car 8.5 m off the line, on the cup. It recovered.
   - checked: on the straight 85° wall just before it, the load into the road was only 0.1–0.4 g at 819 km/h; the car was held on aero.
   - Builder: on bank over 60°, treat a climb rate as a turn (κg ≈ dθ/ds · sin bank) in the side-load check. Flag where the predicted load into a wall falls under about 1 g at design speed.
   - inferred: the 1 g figure is not measured as a failure; this replay survived −1.67 g.

The data does not support a cup rule (§0), or a rule on a load-onset rate. The ramp here, 22 → 61 g over about 1,100 m in about 2.3 s at about 17 g/s, has nothing to compare against.

## Corrections

- My first tool run passed a POSIX path through `node -e`, and the three tools failed with ENOENT. That is the same slip as in D505; I reran with a Windows path. speed.cjs then printed nothing under `-e`, because it runs only as `require.main`, so I ran it directly.
- `py -I` hid matplotlib, which lives in the user site-packages. I ran plots.py without `-I`; it is my own script, reading my own CSV.

## Process

- Every run was at BelowNormal (`os.setPriority`, or `Start-Process` with PriorityClass): no window, no game, each process ending on its own.
- No heavy-run lock was taken. The runs were single node processes of under 2 minutes each, and no timing session was named.

## For the landing that carries this: a private-term scan count

```
checked: the 13-term scan over this hand-back, its evidence and the map line → term 9 in 12 places, every other term 0, the keeper's two words 0
checked: term-at.js origin/main 9 → term 9 in 1,054 files, 7,622 lines at origin already
```

Term 9 is the game's track-model file extension: the file names `…test.<ext>`, a hash line, and "the <ext> road mesh". It is the same
class as term 8, which the librarian ruled public at 21ff1572. I did not reword around it, because the evidence names real files.
The landing's scan will count these 12, and the call on them is the librarian's.
