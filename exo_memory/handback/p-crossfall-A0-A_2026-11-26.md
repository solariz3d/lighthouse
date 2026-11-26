# A0: [T4] 30,631–30,963 m (sections 365–369) laid with the pit-lane tool. Pane A, 2026-11-26, chair D677

**The packet:** step A0 of `exo_memory/loop/plan_t180_cross_section_2026-11-26.md` (section (a), :28-132). I wrote neither
the plan nor the [T4] hand-back. The base is t180 `ceb21f5`, laid in a scratch copy made by `git archive`
(`G:/consonance-scratch/m-base`).

**The rules held:**
- No builder code was changed. Nothing was committed, merged or pushed in the builder.
- The work ran headless at BelowNormal; `acs.exe` was not running.
- All track data and scripts stay in `G:/consonance-scratch/a-t4-a0`, uncommitted. This file gives only metres along the
  lap and our own measured differences.

## Verdict

**Not made.** All five sections miss, on both routes, and the plan's registered falsifier fired.

The other finding is that the unwelcome outcome at :126 happened, in the part the track's own files can show:

- The shelf is the road's own racing surface.
- The track's real pit lane is a separate pit-lane surface just beyond the shelf.

## What was laid

The road, the lane and the measure were registered before anything was laid. The register is local
(`REGISTER.txt`, stamped 20:10:24Z).

- **The lane:** side R, offset 0, width 18, as the packet says. The lane's own handles were taken from the reference's
  width, and not tuned afterwards:
  - it leaves at 30,671 m with a 60 m diverge;
  - it rejoins at 30,931 m with a 56 m merge.
  - The reference reads 30 m wide to about 30,675 m, 49 m from about 30,731 m to 30,875 m, and 30 m again by 30,927 m.
- **The road:**
  - its cross-section is 365's, held constant (B's cup fit: width 30, cup 15, edges 7.3 / 4.4);
  - bank 0 wherever the lane is wider than 1 m;
  - its line is the reference centre moved left by half the lane's width. That is the plan's picture: the reader centres
    on road plus shelf.
- **The lane's mesh** is the export's own: `laneForExport`, with its infill and the export's lane check.

**Two routes:**

| route | how | pieces | refused |
|---|---|---|---|
| H, by hand | one corner piece per section | 5 | 0 |
| S, STEERED | 8 m rate pieces, solved and steered onto the line | 36 | 0 |

Both routes then add one pit lane. The lead-in pieces are not counted.

## How it was measured

**One probe on both sides.** B's ray rule from `probe.cjs` (down each reference station's normal, 0.5 m across, a 1 m
walk out to a miss or a 3 m step) was made a function (`probecore.js`). The same function was then run on:
- the ORIGINAL mesh;
- the BUILT road, lane and infill, at the same reference stations, carried into the built frame by a rigid map at
  30,631 m.

    checked: node -e, orig.local.json against B's probe.json → 90 of 90 stations identical (both slope lists and the tilt)

Both series then pass the smoothing in `sections.cjs`: a median over ±3 stations for the quarters and rims, and ±1 for
the tilt.

**The tolerances** are the [T4] ones from `p-unmakeable-T4-B_2026-11-26.md`:

| measure | tolerance |
|---|---|
| each quarter slope | 5° |
| rim | 5° |
| tilt under the centre (the station bank) | 3° |
| probed width | 2 m |
| extent midpoint (horizontal position) | 2 m |
| surface along the normal at the centre (vertical) | 1 m |

The register also named the heading at the end, the pitch, the peak heading rate and the roll on the read-equivalent
centre line. **These four were not computed.** Every section already fails on the cross-section measures above.

## Results: worst difference against each tolerance

    checked: node cmp_a0.js built-H.local.json, built-S.local.json, built-S-off0.5.local.json (G:/consonance-scratch/a-t4-a0)

**Route S (36 pieces, offset 0):**

| section | m | made | quarter /5° | rim /5° | bank /3° | width /2 m | horizontal /2 m | vertical /1 m |
|---|---|---|---|---|---|---|---|---|
| 365 | 30,631–30,699 | no | 15.4 | 14.8 | 4.67 | 5 | 3.5 | 0.18 |
| 366 | 30,703–30,751 | no | **17.5** | 6.4 | 5.63 | 3 | 1.5 | 0.72 |
| 367 | 30,755–30,859 | no | **17.5** | 8.0 | 4.32 | 2 | 1.5 | 0.73 |
| 368 | 30,863–30,915 | no | **16.9** | 5.3 | 5.39 | 2 | 1.0 | 0.71 |
| 369 | 30,919–30,959 | no | 15.0 | 16.4 | 2.19 | 3 | 1.5 | 0.05 |

**Route H (5 pieces, offset 0):**

| section | made | quarter | rim | bank | width | horizontal | vertical |
|---|---|---|---|---|---|---|---|
| 365 | no | 17.1 | 16.9 | 3.35 | 6 | 4.5 | 0.52 |
| 366 | no | 17.1 | 6.6 | 0.44 | 3 | 4.5 | 1.13 |
| 367 | no | 4.2 | 7.8 | 0.84 | 2 | 4.0 | 1.03 |
| 368 | no | 15.9 | 4.4 | 7.38 | 2 | 8.0 | 0.63 |
| 369 | no | 15.6 | 16.2 | 8.06 | 3 | 7.5 | 1.75 |

**The falsifier fired.** Registered at the plan's :120-121: "on 366-368, any quarter slope or the station bank misses by
more than 5° … or the probed width misses by more than 2 m".
- The quarter slope misses by 14.3–17.8° on route S (both offsets) and by 15.9–17.1° on 366 and 368 on route H.
- The station bank misses by more than 5° on 366 and 368 (route S) and on 368 (route H).
- The width stays inside 2 m on 367–368 and misses by 3 m on 366.

As written there, class A stays unmade with no route.

## Where it misses (the probe's per-metre slopes; the cause is inferred from them)

    checked: node -e, the per-metre slope lists at 30,727, 30,811 and 30,899 m, original against route S

**What matches:**
- The level shelf itself matches. On the shelf side, the 1/2 and 3/4 quarters agree to within 0.2° on 366–368.
- The width agrees to within 3 m on 366 and 2 m on 367–368.
- The extent midpoint agrees to within 1.5 m (route S).
- The cup side's quarters agree to within about 4°.

**What misses is where the shelf begins, and the wall under the centre.**
- **In the original**, the level part starts **2 to 3 m** right of the reference centre (the shelf side). Under the centre is
  a 15° wall: the tilt is −0.5° in the station frame, and the station is tilted 14.6°.
- **In the built road** (365's 30 m road moved 9 m), the level part starts **6 to 7 m** right of the centre. The wall
  under the centre is about 10° (tilt −4 to −6°).

That 4 m is the whole 1/4-quarter miss and most of the bank miss.

**inferred:** the road under the shelf is not 365's road. Its right wall reaches the shelf about 4 m closer to the
reference centre. On the cup side the original falls about 14° from the centre, flattens 9–12 m out, and rises to its rim
about 22 m out. That reads as a cupped road of roughly 24–25 m with a shelf of about 20 m, not 30 + 18.

A road and a level shelf is still the right kind of shape. But the bundle the falsifier tested (this lane, on 365's
road) does not fit. A re-run with a narrower road would be tuned after seeing these numbers. It would need its own
falsifier registered first, so I did not run it.

**365 and 369 miss without the lane too.** Before the lane leaves (30,631–30,671 m), the built rims read 17° against the
original's 22–25°. That is the 365 cross-section fit, the same miss B's table carries for 365 (cross-section 1.90 ×
tolerance), and is not the lane's doing.

## The lane tool at offset 0: the export refuses it on any road

| case | export lane check |
|---|---|
| [T4] span, route H, offset 0 | 75 red: 66 self-intersection, 9 downforce-ray gaps |
| [T4] span, route S, offset 0 | 125 red: 121 self-intersection, 4 downforce-ray gaps |
| [T4] span, route S, offset 0.5 | 6 red: downforce-ray gaps under 0.5 m wide; the shape verdict is unchanged |

The self-intersections are the lane body meeting the road, lane s 64.7–198.7 m.

The control has no track data (`offset0.js`): a straight 300 m road with the same lane.

    checked: node offset0.js

| control | offset 0 | offset 0.5 | offset 2 |
|---|---|---|---|
| 365's cross-section | 78 red (downforce-ray gaps) | 0 red | 0 red |
| flat road | 318 red (240 self-intersection, 78 gaps) | 0 red | 0 red |

**inferred:** at offset 0 the lane's run shares its edge line with the road. The lane check exempts only the diverge and
merge (`src/geom/pitlane.js` laneCheck, "EXEMPT, and only this"), and the infill has no gap to fill. So **the packet's
"offset 0" is not an exportable lane on any road.** Offset 0.5 is the smallest checked here that passes.

## The unwelcome outcome (plan :126): it happened, as far as the track's files show

The plan's words: "The shelf is racing surface that cars use, not an apron."

    checked: data/surfaces.ini of [T4] → two surface entries: a pit-lane surface (IS_VALID_TRACK=1, IS_PITLANE=1) and a run-off
             surface (IS_VALID_TRACK=0); the road's own surface is the game's default
    checked: orig.local.json → every probe hit on 366–368 (2,440, both sides and the centre) is the road's own surface; none is the pit-lane surface
    checked: node pitside.js → the track's AC_PIT dummies (12) lie on the SHELF side, 28–38 m from the reference centre beside 30,827–30,887 m,
             and its pit-lane-surface meshes (12) lie 28.5–38.1 m out on the same side; the shelf ends about 23 m out
    checked: ai/ in the track folder is empty → no AI line, so whether cars drive on the shelf cannot be measured here

**What this shows:**
- The shelf is not the track's pit lane. It is the road's own valid racing surface.
- The track's actual pit lane, with its boxes, lies just beyond the shelf's outer edge.

**What it means for the plan's route** (the plan's own "What blocks it"):
- [T4] already needs its one pit lane, at this very stretch.
- So the pit-lane tool cannot also make the shelf, even if the shape fitted.
- By the plan's own reading, "only the two-channel build is honest". That build is the keeper's call. I have not decided it.

## Corrections

- My first set-up used B's `run.cjs` unchanged except for the builder path. Its lead-in reads the cross-section from
  `XS=cup` at the section start, and I held 365's median cross-section instead. That is stated in the register; nothing
  was changed after measuring.
- None of the figures above was hand-copied from a brief. Each is re-derived by the commands named beside it.

## Scripts (local, `G:/consonance-scratch/a-t4-a0`; they read track data, so they are never committed)

- Copied from B's `b-t4-work`, with the builder path pointed at the scratch copy: `run.cjs`, `lay.cjs`,
  `t4.sections.json`, `probe.json`.
- `probecore.js`: the probe as a function.
- `probe_orig.js`: probes the original mesh, writing `orig.local.json`.
- `a0.js`: lays the road and lane and probes them, by `ROUTE`, `OFFSET`, `LANE`.
- `cmp_a0.js`: the comparison.
- `offset0.js`: the control.
- `pitnear.js`, `pitside.js`, `dummies.js`: where the pit is.
- `REGISTER.txt`: the choices registered before measuring.
