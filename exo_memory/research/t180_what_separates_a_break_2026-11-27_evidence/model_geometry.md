# Model, lens "geometry" (modeller, blind to the other two), 2026-11-27

Scripts: `geo_explore.js` (lists the 61 training rows), `geo_score.js` (scores the candidate rules); output `geo_score.txt`. All in `G:/consonance-scratch/fable-break/`. Only `split=train` rows of `passes.csv` were loaded by either script.

**Said plainly first (a leak, small):** `census.md` prints test-side figures. I read its section 4 counts (test: 44 held, 6 broke, and the by-kind counts) and one test row's line in its "road-kind crossers" list (`c74e4fd35558`, held, rate 0.11) before I stopped reading that list. I did not read the rest of the list. No threshold below was chosen from any of it.

## 1. The rule

**In words.** A pass is predicted BROKE when either:

- (a) **outer part of a steep bank at speed:** the box centre is within 4.1 m of the road's edge (`near_edge_m <= 4.1`), on a road banked between 15 and 90 degrees (`|road_roll_deg|`), the car upright to the road (`up_dot_normal >= 0.5`), at 600 km/h or more (`speed_kmh >= 600`); or
- (b) **a kink in the roll:** the roll's second derivative along the path is 0.03 deg/m2 or more in size (`|roll_acc_deg_per_m2| >= 0.03`).

**As JavaScript** (NaN compares false, so it does not throw):

```js
((r.near_edge_m <= 4.1 && Math.abs(r.road_roll_deg) >= 15 && Math.abs(r.road_roll_deg) <= 90 && r.up_dot_normal >= 0.5 && r.speed_kmh >= 600) || Math.abs(r.roll_acc_deg_per_m2) >= 0.03)
```

## 2. Score on the 61 training rows (checked: `geo_score.txt`, rule `A_final`)

| | predicted broke | predicted held |
|---|---|---|
| broke (9) | 6 | 3 |
| held (52) | 1 | 51 |

Wrong rows:
- missed break: `065789823b52` t 62.655 (aftermath, krysha, 2.7 s after its own first break)
- missed break: `480905fbac85` t 85.83 (landing, 244 km/h, mid-road, flat-ish)
- missed break: `6eee6c19cb18` t 216.42 (landing, talon, 10.8 m from the edge)
- false alarm: `480905fbac85` t 95.58 (road, roll acc 0.126; its `how_broke` says the box went through, but it did not leave the road or lose speed)

Which clause caught what (checked, same file, rule `C_edgeonly` against `A_final`): clause (a) alone catches 4 breaks and flags 0 held passes: the three t180b_elysium road breaks at about 748 km/h on the 66-degree bank (krysha, grx, mach6; edge 3.13, 2.38, 4.00 m) and the t180b_elysium_gates_stiff landing (edge 0.06 m). Clause (b) adds 2 breaks (`480905fbac85` t 160.26, roll acc 0.032; `4b3acff96fc6` t 1023.75, roll acc 0.439, a closed section) and the one false alarm.

**What did NOT separate (checked, `geo_score.txt`):**
- `roll_load_g >= 6`: 4 of 9 breaks, 5 of 52 held flagged. On the Elysium bank itself the breaks read 12.1, 6.5, 3.4 g and held passes in the same place read 10.1, 7.8, 3.4, 3.0 g. Roll load does not tell them apart.
- `|roll_rate_deg_per_m| >= 0.3`: 3 of 9 breaks, 6 of 52 held flagged.
- Inversion: every pass on a road rolled past 90 degrees (14 training rows, up to 173 degrees; checked by a one-line count over the training rows) HELD. On this table loops and inverted road are not where the breaks are. (checked by reading `geo_explore.js` output; inferred that this says anything about corkscrews in general, since the one corkscrew test track has no passes at all.)

## 3. Registered now, before any test row is scored

The rule is wrong if, on the test rows, **it catches fewer than 3 of the 6 breaks, or flags more than 6 of the 44 held passes (about 1 in 7).**

Clause by clause, also registered:
- clause (a) is wrong if it flags more held passes than broken ones on the test rows;
- clause (b) is wrong if it flags two or more held passes for each break it catches, or catches none.

My own expectation, stated so it can be held against me: clause (a) is one corner of one track seen three times plus one landing; I expect it to carry over only where the test rows include that same bank. Clause (b) rests on two breaks. A result of 2 of 6 would not surprise me, and would mean geometry at the pass is not what decides it.

## 4. What a track builder could do if it is true

On any bank of 15 degrees or more that will be taken above 600 km/h, treat the outer 4 m of the road as not load-bearing: either widen the road so the racing line sits more than 4 m in from the edge, or flatten the bank's outer strip. Refuse (or soften over a longer run) any place where the roll's second derivative reaches 0.03 deg/m2, which is a bank that starts or stops abruptly rather than easing in. The Elysium bank is the worked case: same road, same speed, same roll; the passes that held were 4.25 to 6.25 m from the edge, the ones that broke 2.4 to 4.0 m.

## 5. What I could not tell from this table

- **Why the edge matters, or whether it does.** 4.00 m (broke) against 4.25 m (held) is a gap of 25 cm, measured by a walk whose last step is 6 cm, and the box's corners are not measured. The edge distance may stand in for something else that grows toward the outside of that bank (a seam in the mesh, the cross-section's shape, the car's line and its load), none of which is a column. inferred.
- **The three Elysium road breaks are three different cars (krysha, grx, mach6); the ten held passes there are mach6 nine times and augury once.** The car and the edge distance cannot be pulled apart on these rows.
- **Landings.** Two of the three misses are landings in the middle of a plain road. Geometry under the car says nothing about them; how the car came down does, and that is another lens.
- **Low speed.** On [other-7fa3a2] (200 to 300 km/h) 2 passes broke and 4 held with the same geometry columns; the rule gets one by a hair (0.032 against a bar of 0.03) and misses the other.
- **The local shape of the surface under the box** (a crest, a step between triangles, a seam) is not in the table. `roll_rate` and `roll_acc` are fits over 20 m and would smooth a seam away.
- **Weakness, overall:** 9 breaks, 5 thresholds in clause (a). It is fitted. The speed bar of 600 is there only to drop two held passes on [other-83cd9b] at about 495 km/h (without it: 3 false alarms, `geo_score.txt` rule `B_nospeed`).
