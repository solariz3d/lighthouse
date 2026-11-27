# Model "open": the simplest rule the training rows support

Modeller, lens open, blind to the other two. Training rows only (61 of `passes.csv`: 9 broke, 52 held).
Scripts: `open_dump.js`, `open_search.js`, `open_score.js`. Every figure below is checked in `open_score.txt` unless marked inferred.

**One thing said first.** I was told to read `census.md` whole, and its section 4 prints counts over both splits and a list of
road-kind crossers that includes test rows (rate, outcome, replay). I read it before I saw what it held. My rule uses neither
the sink rate nor the car nor the track, and that list shows no `u_m` or `road_roll_deg` per row except `near_edge`, so I do
not think it steered the rule; it is not a clean blind all the same.

## 1. The rule

**BROKE is predicted when the car is more than 13.44 m from the middle of the road mesh AND the road is rolled more than 21.5
degrees from level** (either sign of each).

```js
Math.abs(r.u_m) > 13.44 && Math.abs(r.road_roll_deg) > 21.5
```

NaN in either column gives false, no throw. Two thresholds. It uses nothing measured after the pass begins (no depth, no
wheel column, no speed loss), and not `crosses_11cm`.

## 2. Score on the training rows

| | predicted broke | predicted held |
|---|---|---|
| **broke** | 6 | 3 |
| **held** | 0 | 52 |

By kind: road 3 caught, 1 missed, 32 held right; landing 3 caught, 1 missed, 16 held right; edge 4 held right; aftermath 1 missed.

Wrong rows (all three are misses, no false alarm):
- `065789823b52` t_start 62.655, krysha, t180b_elysium, aftermath: the car was already through the road 2.7 s earlier (sink 64 m/s). Not a separate event.
- `480905fbac85` t_start 85.83, mach6, [other-7fa3a2], landing, 244 km/h, 4.8 g.
- `480905fbac85` t_start 160.26, mach6, [other-7fa3a2], road, 200 km/h, 3.6 g. That replay also has four held rows with the box or a wheel through; the census did not read its frames and doubts its surface (census.md section 7).

The six it catches: the three Elysium helix pass-throughs (krysha, grx, mach6; |u| 13.47 to 15.09 m, roll 66 to 67 degrees,
748 to 755 km/h, 58 to 64 g), the mach6 landing on the stiff copy (|u| 17.41, roll 23.3, at the mesh's edge), and two
landings on other authors' tracks (|u| 17.97 and 16.0 m on meshes 27 m to a side, roll 24.6 and 36).

## 3. Is it a real separator? Mostly no; one part of it may be.

- **Both thresholds sit in gaps a few centimetres or degrees wide.** 13.44 m lies between a held row at 13.41 and a broken one
  at 13.47. 21.5 degrees lies between a held row at 20.0 and a broken one at 23.3, and those two are the same place on Elysium
  (the mesh edge, |u| 17.3 to 17.4): one counted held because a reset came 0.22 s after the box went 46 cm under. Against flat
  wide road the roll threshold has room (held rows at |u| 15.59 and 13.47 have roll 3.5 and 1.9).
- **Leave one replay out, refit, score the one left out:** 5 caught, 4 missed, 2 false alarms, 50 held right. The same two
  columns are picked in 17 of 18 refits, so the shape is stable; the cut points are not.
- **|u| over 13.44 m is only possible on a mesh wider than 27 m.** So the rule is partly "a wide banked road", and it cannot
  fire at all on a narrow track. It says nothing about the two breaks on the narrow slow track.
- **The part that looks real, on one corner.** On Elysium's helix (roll 65 to 67 degrees, 704 to 775 km/h, 54 to 64 g) there
  are 13 training passes. Sorted by distance from the middle, the ten nearest (11.22 to 13.22 m; nine mach6, one augury) all
  held and none sank past 11 cm; the three farthest (13.47, 14.34, 15.09 m; that is 4.0, 3.1 and 2.4 m from the edge) all
  broke. A perfect sort of 3 against 10 happens by chance 1 time in 286 (inferred: 1 over 13-choose-3). Speed and load do not
  sort them (the breaks are at 58 to 64 g, the held at 54 to 62). The roll-load column does not sort them either (held at
  10.08 g, broke at 3.35 g).
- **What the table does not support, on the training rows:** the sink rate by itself (`sink_rate_at_11cm >= 1.66`: 8 caught,
  11 false alarms; road-kind only: 3 caught, 2 false alarms, 1 missed, with held road passes at 1.50, 1.57, 1.69 and 17.64 m/s
  and a break at 1.56); the car (not-mach6: 4 caught, 3 false alarms, 5 missed, and the three other cars that broke on the
  helix were the three farthest out); road stiffness (one firm-road row in the whole training half).

So: **a description of six rows, with one real-looking fact inside it: on that helix, the outer four metres break and the rest
holds.**

## 4. Registered now, before any test row is scored

The rule is wrong if, on the test rows, **it catches fewer than half of the breaks that are not `aftermath`, or more than one
in five of the rows it flags is a held pass.** If fewer than four test rows have |u| over 13.44 m at all, the test half
cannot judge it and the result is "not tested", not "held".
Separately, for the helix fact: it is wrong if any test pass on t180b_elysium (or its copies) with roll 60 to 70 degrees holds
at more than 13.44 m from the middle, or breaks nearer than 13.22 m.

## 5. What a builder could do if it is true

Where a road is banked more than about 20 degrees and carries high load, the outer lane is where the car goes under: on the
helix, the last 4 m of a 17.5 m half-width. The builder could warn on any banked high-load stretch whose half-width is over
about 13 m, and offer to narrow it there or to ease the corner (a larger radius or less speed into it), so the lane that
breaks is not on the road. It should not be a refusal on this evidence: one corner, three breaks.

## 6. What I could not tell from this table

- **Why the outer lane breaks.** Distance from the middle on a helix goes with a different radius, a different local load
  under the outer side of the box, and nearness to the edge; `u_m`, `near_edge_m` and the lane are one number here. The box's
  corners are not measured.
- **Whether 13.44 m is a distance from the middle, a distance from the edge (4.0 m), or a place on that one corner.** Only a
  second wide banked corner would say.
- **Whether the three cars matter.** The grx and krysha were the two farthest out and the only passes of theirs in the helix;
  a car effect and a lane effect cannot be separated with one pass each.
- **Stiffness.** One training row on a firm road.
- **Cause against first frame.** The rule avoids the sink rate for this reason, but |u| and roll are read at the reference
  frame, which for a break can already be inside it (census.md section 7); at 750 km/h the sideways position moves little
  in three frames (inferred).
- **The two breaks on [other-7fa3a2]** (200 to 244 km/h, under 5 g): nothing in the table marks them off from that replay's
  four held rows.
