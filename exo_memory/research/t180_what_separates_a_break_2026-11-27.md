# What separates a pass where the car goes under the road from one that holds

*2026-11-27, D. Written by the writer of a seven-agent run (one census builder, three blind modellers, one scorer, this
writer, one checker). I wrote none of the census, the rules or the scores; I read them whole and re-ran one script
(`score.js`, see "How to re-run it").*

*Working folder: `G:/consonance-scratch/fable-break/` (below: `S/`). Copies of the scripts and small results:
`research/t180_what_separates_a_break_2026-11-27_evidence/` (below: `E/`). Each claim is marked **checked** (with the file
that holds it) or **inferred**.*

## The answer, as far as these replays give one

**Mostly they do not give one.** In 1,786 km of his own T-180 driving that could be measured, the car went under a road it
was riding on six times, and only four of those are on a road whose surface is known exactly (all four on Elysium's soft
road, three of them at one corner on two nights). Six is too few to separate anything firmly, and that outcome was
registered before the run as the one that would mean "nothing can be separated".

What the six, and the 105 other passes around them, do show:

- **Where the car is on the road does not decide it.** Two rules built on position (distance from the edge, distance from
  the middle, how steeply the road is banked) fitted the first half of the passes well and failed on the second half, at
  the same corner: four passes held on the same bank, at the same distance from the edge, where three had broken.
- **How fast the car's floor is sinking into the road, while the car is heavily loaded, is the one thing left standing,
  and thinly.** On a loaded road pass, every one that held was sinking at 1.57 m/s or slower when its floor reached 11 cm
  under the surface, and every one that broke at 1.82 m/s or faster. That rests on three breaks, and a replay cannot say
  whether the fast sink caused the break or was its first frame.
- **A fast sink alone does not mean a break.** Counting landings and edge passes too, 19 of the 30 new passes that sank
  at 1.66 m/s or faster held.
- **The Type A's clip on [T1] is not a pass under the road at all, as far as the replay can see.** It is a sudden loss of
  54 km/h with nothing measured under the surface, followed by a slide off the road's right-hand edge.

All of the above: **checked**, `S/score_out.txt`, `S/summary.txt`, `S/t1_typea_event_frames.tsv`; details below.

## What was measured

Definitions were fixed from H563 (`handback/p-d563-wheel-under-O_2026-10-30.md`) in `census.js` before any replay was run;
`census.md` section 1 has them in full. In short:

- **The floor box:** the car's floor collision box, the same on all 14 cars; only the centre of its bottom face is measured.
- **A pass:** above 80 km/h, the box at or under the road surface, at least 2 cm under, for 3 frames or more.
- **Broke:** the box more than 40 cm under (or a wheel centre more than 5 cm under), and then the car left the road or
  lost 20 km/h or more in one frame. **Held:** everything else.
- **Kind:** *road* (riding the road, H563's kind of event), *landing* (came down from the air), *edge* (within 1 m of the
  road's edge), *aftermath* (within 6 s of an earlier break).
- **Split:** by replay id, half for the modellers (train), half for the scorer (test).

| | count | file |
|---|---|---|
| replays in the folder / that do not parse | 106 / 7 | `census.md` s.3 |
| replays covered / left out | 71 / 24 | `S/summary.txt` |
| km of his own T-180 driving covered | 1,786 | `S/summary.txt` |
| passes: all / held / broke | 111 / 96 / 15 | `S/summary.txt` |
| the 15 breaks by kind: road / landing / aftermath / edge | 6 / 6 / 2 / 1 | `S/summary.txt` |
| road breaks: on Elysium / on other authors' tracks | 4 / 2 | `S/summary.txt` |
| test half: rows / broke (road, landing, edge, aftermath) | 50 / 6 (2, 2, 1, 1) | `S/score_out.txt` |

All **checked**. Six road breaks in 1,786 km is about one in 300 km (**checked**, 1786 / 6).

The reader was validated on H563's own passes: five of its seven were found, with the same outcomes and frame heights
equal to the millimetre; the other two are in a replay the parser does not open (**checked**, `census.md` s.5).

## What was registered, and how each came out

Registrations: `loop/plan_fable_researchers_2026-11-27.md`, from "A third run, proposed on D at 13:3x". Verdicts are the
scorer's, read literally (`scores.md`; every count **checked** in `S/score_out.txt`).

### The degenerating outcome: MET, for the event the question is about

- Registered: fewer than about ten broken passes means nothing can be separated; the finding is then how rare a break is.
- The table has 15 broken rows, but they are three different events. **Road breaks: 6.** In the test half: 2.
- So: **about one road break per 300 km of his own driving**, 4 of the 6 on Elysium's soft road (three pass-throughs at
  its helix by the grx, the krysha and a mach6; and the hangul's wheel going under, which H563 reads as an edge event),
  2 on other authors' tracks at 3.6 g and 35.5 g whose frames nobody read (**checked**, `census.md` s.7).

### P1, the sink-rate separator: FAILED as written

- Registered: of passes that reach 11 cm under, the ones that hold cross at 0.63 m/s or slower, the ones that break at
  1.66 m/s or faster. It fails if more than one new pass in five is on the wrong side, or most cross between.
- **43 new passes reached 11 cm. 19 held while sinking at 1.66 m/s or faster. The limit was 8.6. FAILED.**
- Not failed on "most between": 10 of 43.
- The 19: ten landings, six edge passes, three road passes on other authors' tracks at 4 to 33 g.

| set of new crossers | n | wrong side (limit) | between (limit) | verdict |
|---|---|---|---|---|
| all (the registration as written) | 43 | 19 (8.6) | 10 (21.5) | **FAILED** |
| road only | 16 | 3 (3.2) | 8 (8) | held, exactly at both limits |
| road, one-frame rate instead of three-frame | 16 | 4 (3.2) | 9 (8) | FAILED |
| road, 50 g or more | 8 | 0 | 4 (4) | held, at the limit |
| landings | 18 | 10 (3.6) | 2 | FAILED |

- What is left of it (**checked**, `S/score_out.txt`, `S/summary.txt`):
  - 11 of 12 new breaks did cross at 1.66 m/s or faster. Breaks cross fast.
  - 0.63 is too low for the hold side. Loaded road passes held at up to 1.57 m/s (at 90.5 g).
  - Among road crossers at 50 g or more: held 0.11 to 1.57 m/s, broke 1.82, 2.14, 2.30 m/s. A gap of 0.25 m/s, on three
    breaks, all on Elysium's helix, two of them H563's own.
- A caution: this census's rates differ from H563's on H563's own passes by up to 0.23 m/s, the size of that gap
  (**checked**, `census.md` s.5: the hangul's held pass is 0.40 here, 0.63 there, and 1.06 over one frame).

### P2, the roll: not failed by the letter; cannot be read

- Registered: breaks are commoner in the top quarter of the roll load (distance from the roll axis x roll acceleration x
  speed squared). It fails if they are no commoner there.
- Top quarter (3.38 g or more): 4 broke of 28 (14.3%). The rest: 11 of 83 (13.3%). By the letter, not failed.
- That difference is one break. Luck gives it or more 0.556 of the time. It reverses in the test half (0 of 13 against
  6 of 37) and is level on Elysium alone (2 of 7 against 4 of 14).
- **These replays show no link between roll load and breaking, and cannot show its absence.** Why:
  - the roll-load column is not validated, and its noise (about 2 g) is near the size of the cut (3.4 g);
  - only the box's centre is measured, and the idea is about a corner of the box;
  - the Type A event on [T1] that P2 was registered around is not a row (next section).
- On Elysium's bank itself, roll load does not sort breaks from holds: breaks at 12.1, 6.5 and 3.4 g, holds in the same
  place at 10.1, 7.8, 3.4 and 3.0 g (**checked**, `S/geo_score.txt`, `model_geometry.md` s.2).

### P3, the cars: cannot be read; not failed

- Registered: on the same track at the same sink speed, no car breaks more than another. It fails if one car breaks where
  the others hold, on at least three passes.
- Only Elysium has several cars. Its five helix road passes that reached 11 cm, in order of sink rate:

| car | sink rate (m/s) | outcome |
|---|---|---|
| mach6 | 0.11 | held |
| hangul | 0.40 | held |
| grx | 1.82 | broke |
| krysha | 2.14 | broke |
| mach6 | 2.30 | broke |

- No car is out of line, and the mach6 is on both sides. Five passes agree with "the cars are alike" and cannot confirm it.
- No car but the mach6 has three passes anywhere, so the failing result could not have been reached.
- **The typea: 0 rows.** On Elysium today (firm road) the box's least height in 190 s was -0.1 cm; on [T1] +1.2 cm
  (**checked**, `S/typea_elysium_min.txt`). Whether the typea clips worst is not something this table speaks to.

### The three blind rules, on the half they did not see

Each modeller registered its own failing result before the test rows were scored. All three say they saw some test-side
lines in `census.md` section 4 before choosing; each says so at the head of its file. Count that as a small leak.

| rule | in words | breaks caught of 6 | held passes flagged of 44 | right of 50 | verdict by its own failing result |
|---|---|---|---|---|---|
| contact | reaches 11 cm, sinking 1.7 m/s or faster, load 50 g or more | 2 | 1 | 45 | **not wrong, not "too narrow"**, each by the smallest margin |
| geometry | outer 4.1 m of a 15 to 90 degree bank at 600 km/h or more, or a kink in the roll | 1 | 8 | 37 | **FAILED** on both counts; both clauses wrong by their own tests |
| open | more than 13.44 m from the middle on a road rolled more than 21.5 degrees | 3 | 6 | 41 | **FAILED** on both counts; its helix fact is wrong |
| baseline: always "held" | | 0 | 0 | 44 | |

**Checked**, `S/score_out.txt`.

- **Geometry failed where it was fitted.** Four of its false alarms are held passes on Elysium's 66-degree bank, 3.3 to
  3.4 m from the edge (mach6, hangul, demo, gigerbon), the place and distance of the training breaks.
- **Open failed the same way.** It registered: no pass on that bank holds past 13.44 m from the middle. Four of four test
  passes there held, at 13.75 to 14.16 m.
- **Contact survived by one row, and not on a road.** Its two catches are a landing and an aftermath. It caught neither
  test road break (one at 35.5 g, under its 50 g gate; the other never reached 11 cm). Two catches of six is exactly one
  in three; "fewer than one in three" would have made it too narrow.
- **What did hold in it:** all six test road passes that reached 11 cm at 50 g or more held, sinking at 0.11 to 1.21 m/s.
  No such test pass sank faster than 1.7 m/s, so "fast sinkers break" was **not tested** on a road. It is a confirmed
  "slow sinkers hold" (**inferred**, the scorer's reading).
- Only the contact rule beats saying "held" every time, by one row. Both position rules do worse than saying nothing.

### What did not separate, in the training half (checked, `S/contact_score.txt`, `S/geo_score.txt`, `S/open_score.txt`)

- **Speed.** The loaded breaks and the loaded holds travel the same 62 to 63 cm per physics step.
- **Load.** Holds at 63.7, 84.0 and 90.5 g; breaks at 57.7 to 64.2 g. More load did not break more.
- **Depth.** Held passes went 28 to 35 cm under and came back.
- **Inverted road.** All 14 training passes on a road rolled past 90 degrees held.
- **Road stiffness.** One firm-road pass in the training half; cannot be read.

## The Type A on the corkscrew

Replay c4632e4efc5b, the typea on [T1]. Every figure: **checked**, `S/t1_typea_event_frames.tsv` (a table of the frames is
in `census.md` s.6 and `S/t1_event_table.md`).

**By the census's definition there is no pass: the box's centre never went under the road.** Its least height in the whole
replay is +1.2 cm.

| time (s) | what the frames show |
|---|---|
| 64.20 to 64.56 | Coming down the inverted part, 379 to 405 km/h, 15 to 21 g. All four wheels at 0.245 to 0.27 m over the surface, which is the suspension at its stop. Box 10 to 13 cm **above** the road. 9.6 to 11.9 m from the edge on its right, already drifting right at about 6 m/s. |
| 64.560 | The car's up axis is level with the horizon (world y -0.01): the road here is on its side, turning from inverted to upright. 397.6 km/h. |
| 64.560 to 64.650 | **397.6 to 343.4 km/h: 54 km/h in 0.09 s.** The right-side wheels rise (front 0.247 to 0.318 m, rear 0.249 to 0.362 m); the left stay down. The box rises to 21 cm above the road. **Nothing measured is under the surface.** 9.6 m inside the right edge. |
| 64.65 to 64.80 | It settles back onto four wheels (box +7 to +11 cm, 20 to 23 g), now sliding right at about 22 m/s. |
| 64.920 | The box's closest approach in this stretch: +1.6 cm, at 28 g, 2.25 m from the right edge. |
| 64.950 | The front-right wheel loses the surface. |
| 64.995 | The whole car has no surface under it. The nearest meshes are the right-hand kerb, and nothing beyond. |

- **So the last contact is t 64.98, not 64.6, and the car left over the road's right-hand edge**, 0.4 s after something
  took 54 km/h from it while it was 9.6 m inside that edge.
- **What the road was doing:** rolling from inverted through vertical to upright as it comes down (the car's up axis goes
  from world y -0.47 at t 64.41 to +0.88 at t 64.92, half a second). The road-roll reading itself jumps from 132 to 48
  degrees between two frames at t 64.575 to 64.590; that is the kerb meshes entering the sideways walk, not a step in the
  road (**inferred** by the census builder; not checked against the mesh).
- **What took the 54 km/h is not in the replay.** At 66.7 Hz no wheel and no box centre is under the surface. The right
  side lifting and the car being thrown right fits a contact on the right side of the car between frames: the box's
  right-hand corners (not measured) or the car's collision mesh, which reaches past the box (**inferred, unchecked**).
- **For P2:** the registered "Type A break on a fast roll" is, as measured, a hit of unknown cause on a fast roll, then
  an edge departure. It is on the fastest-rolling piece of road in the run, which is what P2 pointed at, but it is one
  event with no measurement of its cause; it neither supports nor weakens P2.

## What a track builder could do with this

**Supported by the scored results (little):**

- **Do not add a rule that refuses or warns by position alone** (the outer metres of a bank, distance from the middle,
  bank angle, half-width). Both such rules were fitted to Elysium's helix and failed on Elysium's helix.
- **Do not use speed, load or inverted road by themselves as a break warning.** None separated breaks from holds here.
- **Do not present breaks as common.** About one road break per 300 km in his own driving, with these cars, offline.

**Leads, not results:**

- **The floor's sink speed under load.** If the 1.57 / 1.82 m/s gap is real, the place to look is where the road's shape
  drives the floor down fast while the car is already loaded 50 g or more: a change of curvature, bank or cross-section
  over a few metres at the car's speed (`model_contact.md` s.4). The builder cannot check this today: it needs a
  prediction of the floor's sink speed from the track's shape, and nothing here validates one. Three breaks.
- **Elysium's helix as the test corner.** In the training half its ten passes nearest the middle held and its three
  farthest out broke; in the test half four passes just as far out held. One corner, 17 passes, both outcomes at the same
  place: the best place to record more laps on purpose, soft road and firm.
- **The corkscrew's side-on moment.** The typea lost its speed as the road passed through vertical while the car drifted
  sideways. A second recording of that corner, with the box's corners measured, would say whether a corner of the floor
  touches there.
- **A firm road.** This run has one firm-road break (a landing) and no loaded firm-road crosser, so it says nothing on
  whether the firmer road setting helps.

## What this cannot tell

- **Cause against first frame.** Replays are 66.7 Hz; the game's physics is 333 Hz. A break develops in 2 to 4 frames, so
  a fast sink at 11 cm may be the break already under way. The two ways of reading the rate differ by up to 0.7 m/s on
  one held pass, and P1 on road passes flips from held to failed on that choice (**checked**, `census.md` s.7,
  `S/score_out.txt`).
- **The box's corners.** Only the centre of the floor is measured. P2 and the corkscrew event are both about a corner.
- **Coverage.** 24 replays left out and 7 that do not parse: nine mach6 replays on [T1] (the model on disk does not fit
  those laps), the 10-17 Elysium reference lap with two of H563's seven passes, and the active Mach 6 on a soft-road
  test track among them (**checked**, `S/coverage.txt`).
- **Other authors' tracks.** 8 of the 15 breaks and all of P1's wrong-side road holds are there. Their surfaces were
  taken as every digit-named mesh, with only a wheel-height fit as a check; no frame of those breaks was read.
- **The re-exported surface.** Elysium's folder was re-exported on 2026-10-31T22:56Z, after the other cars' laps. Those
  laps were measured against the gates copy instead; all fit (wheels find the surface on 0.91 to 1.00 of frames). Their
  road stiffness is written 0.0002 from H563, **inferred** for the file as it then was. That copy also holds a catch
  layer about 0.30 m under the road top, left out of the surface; whether it was in the road driven that night is not
  checked.
- **Rows are not independent.** Three of the six test breaks are one replay; four are two replays.
- **Offline only.** Every replay is his own session. Nothing here is about online play.
- **The Type A.** Two replays, no pass in either. Nothing on whether it clips more than the others.
- **The modellers were not fully blind** (above).

## How to re-run it

All in `S/` (`G:/consonance-scratch/fable-break/`). `E/` holds copies of the scripts and the small results, but not
`replays.json`, `heads.json`, `run.log` or `out/`, which carry other authors' track names; `E/census.js` and `E/near.js`
differ from `S/` in one line each for the same reason (the [T1] name test is by hash; the track folder is an argument).
A census run prints real folder names to the console.

| step | command (from `S/`) | writes |
|---|---|---|
| list the replays | `node list.js` | `replays.json` |
| the census, per replay | `node C:/Users/nname/Desktop/lighthouse/consonance/tools/heavy-run.js --run --priority belownormal --cmd "fable break study: census (not a timing session)" -- node census.js <id,id,...>` (ids in `order.txt`) | `out/<id>.json` |
| one event's frames | the same with `--dump <t0> <t1>` after the ids | to the console |
| merge | `node merge.js` | `passes.csv`, `summary.txt`, `heads.json`, `dropped_duplicates.txt` |
| coverage and the [T1] table | `node cov.js` | `coverage.txt`, `t1_event_table.md` |
| the three rules on the training rows | `node contact_score.js`, `node geo_score.js`, `node open_score.js` | `contact_score.txt`, `geo_score.txt`, `open_score.txt` |
| every score in this note | `node score.js > score_out.txt` (reads `passes.csv` only, under a second) | `score_out.txt` |

**Checked by me:** `node score.js` run in `E/` gives output identical to `E/score_out.txt` (diff, no difference). I did
not re-run the census or open a replay; every figure here inherits the census's doubts (`census.md` s.7).

## The checker's section

*2026-11-27, D, 14:26 to 14:45. I wrote none of the above. Everything of mine is in `S/chk/` (`G:/consonance-scratch/fable-break/chk/`): `score_rerun.txt`, `csv_checks.txt`, `names.txt`, `rederive2.js` (my own surface reader: the nearest road triangle along the car's up axis, by brute force, sharing no code with `census.js` beyond the two parsers) and its outputs `r_1ca5.txt`, `q_64ac.txt`, `q_168d.txt`, `q_typea.txt`, `q_grx.txt`, `q_krysha.txt`, `q_9093.txt`, `q_c74e.txt`. One fault of mine: my first two runs of the reader were not put through the room's lock, and one hung until its timeout.*

**Count: 31 claims checked. 22 hold, 5 hold in part, 4 do not hold.**

### 1. The scores, re-run

- **holds.** `node score.js` on `S/passes.csv` gives output identical to `S/score_out.txt` and `E/score_out.txt`; `E/passes.csv` and `E/score.js` are identical to the `S/` copies (`diff`, no difference; `chk/score_rerun.txt`).
- **holds (19 counts).** Against that output and `S/summary.txt`: 111 / 96 / 15; breaks by kind 6 / 6 / 2 / 1; road breaks 4 on Elysium, 2 elsewhere; test 50 rows, 6 broke (2, 2, 1, 1); 71 covered, 24 left out; 1,786 km; P1's five table rows (43: 19 and 10; road 16: 3 and 8; one-frame 16: 4 and 9; 50 g 8: 0 and 4; landings 18: 10 and 2); the 19 as ten landings, six edge, three road; 11 of 12 new breaks at 1.66 or faster; 19 of 30; P2's 4 of 28, 11 of 83, 0.556, 0 of 13 against 6 of 37, 2 of 7 against 4 of 14; P3's five-row table; the three rules' rows (2/1/45, 1/8/37, 3/6/41, baseline 44); the four held helix passes at 13.75 to 14.16 m; six loaded test road crossers held at 0.11 to 1.21 m/s; the helix's 17 passes (ten nearest held, three farthest broke in train; four held in test); the 14 inverted training passes all held (`chk/csv_checks.txt`).
- **does not hold.** "Three of the six test breaks are one replay; four are two replays." Five are two replays (3 and 2); the sixth is a third replay (`chk/csv_checks.txt`, last line).
- **does not hold.** "No car but the mach6 has three passes anywhere." The hangul has 3 rows (2 reach 11 cm) and the talon has 3 rows, all three reaching 11 cm, on a track it shares with the mach6 (`S/score_out.txt`, "== P3 =="). So "the failing result could not have been reached" is too strong. It was not reached: the talon broke once, a landing, at 8.98 m/s where a mach6 landing held at 15.37.
- **does not hold.** "Replays are 66.7 Hz." 27 of the 71 covered replays are sampled every 0.03 s (33.3 Hz), 44 every 0.015 s; 998 of the 2,162 km covered and 26 of the 48 passes that reach 11 cm are from the 33.3 Hz ones (`S/heads.json`, field `dt`; `chk/csv_checks.txt`). Neither the note nor `census.md` says so. The census counts in frames (3 frames for a pass, the three-frame rate, a one-frame speed loss of 20 km/h, a 10-frame bridge), so each of those means twice as long on those replays, and a rate there is a mean over 0.09 s. Two of the nine loaded road holds (1.50 and 1.21 m/s) are 33.3 Hz rows.
- **holds in part.** "106 entries / 7 do not parse": 7 entries of `S/replays.json` have no track, yes; the folder lists 109 names today and `replays.json` has 108 entries. Not chased.
- **holds in part.** P3, "no car is out of line": `score_out.txt` itself counts one road break each for the krysha and the grx "at a rate another car held at or above" (the mach6's edge pass that held at 5.06 m/s). One pass each, under the three the registration asks, so the verdict stands; the note leaves the line out.

### 2. Four rows re-derived from the replays (and four more rates)

| pass | the table says | my reader says | |
|---|---|---|---|
| typea on [T1], t 64.2 to 65.0 | no pass; least box height +1.2 cm at t 63.135; 397.6 to 343.4 km/h from t 64.560 to 64.650; closest +1.6 cm at t 64.920; surface lost at t 64.995 | the same, each figure (`chk/q_typea.txt`) | **holds** |
| mach6 on Elysium, 1ca5e0b40e3c, t 868.335 | broke; deepest above -40 cm is -31.7; rate 2.30 (one-frame 1.61) | crossing at t 868.890, 2.30 and 1.61; -31.7, then -56.7, -93.9, -143.0, -218.4 cm, then no surface; a wheel 220 cm under (`chk/r_1ca5.txt`). This replay's speed column is empty (NaN), so the census's km/h for it comes from positions | **holds** |
| mach6 on [other-0e0103], 64ac1f991be9, t 42.255 (the 1.57 m/s hold at 90.5 g) | held; -34.7 cm; 1.57 (one-frame 2.69) | 1.57 and 2.69 exactly; the box comes back out. The deepest I can read is -29.5 cm: on the frames before it an opposite-wound layer is nearer than the road top, so my reader loses the top there (`chk/q_64ac.txt`) | **holds in part** (depth not reproduced, by 5 cm) |
| mach6 on t180b_crazy_test_test, 168d45c76583, t 89.595 | held; -28.1 cm; 0.16 (one-frame 0.29); ends t 98.880 | the same, each figure (`chk/q_168d.txt`) | **holds** |

Also **hold**, rates only: grx 1.82 / 1.91, krysha 2.14 / 2.09, mach6 on [other-0e0103] at t 42.165 1.20 / 1.06, mach6 on Elysium 0.11 / 0.17 (`chk/q_grx.txt`, `q_krysha.txt`, `q_9093.txt`, `q_c74e.txt`).

### 3. The verdicts against the registration's words

- **The degenerating outcome, "MET": holds in part.** The words are "fewer than about ten broken passes". By the definition fixed before the run there are 15. It is met only for road-kind breaks (6), and `kind` is a column added after the first replays were opened (`census.md` s.1 says so). Read by the words: not met as written; met for the kind of event H563 studied, a division made afterwards.
- **P1, "FAILED as written": holds.** 19 of 43 against a limit of 8.6. Not softened in its own heading.
- **P1 softened elsewhere: does not hold.** The second bullet of "The answer" ("the one thing left standing": every loaded road hold at 1.57 m/s or slower, every break at 1.82 or faster) is kinder than the evidence allows, for the reason in item 6. The table rows "road only: held" and "road, 50 g or more: held" are subsets chosen after the result; the registration names no such subsets.
- **P2, "not failed by the letter; cannot be read": holds.** 14.3% against 13.3% is "commoner" by the words, and the note says beside it that this is one break and reverses in the test half.
- **P3, "cannot be read; not failed": holds**, with the two corrections in item 1.
- **The three rules' verdicts: hold.** Each read against its own registered failing result in `model_*.md`: contact flagged 3 with 1 held (two would fail it), 1 of 9 on the wrong side (two would fail it), 2 of 6 caught (fewer than one in three would make it too narrow); geometry 1 of 6 caught and 8 holds flagged; open 2 of 5 non-aftermath breaks caught and 6 of 9 flagged rows held.
- **Not verified by me, so not counted as holding:** that H563 reads the hangul's wheel-under as an edge event; the firm-road and catch-layer lines; the 0.556 beyond the script printing it; the coverage reasons for the 24 left out.

### 4. Was the test half blind

- **holds:** every modeller script takes `split === 'train'` rows only (`contact_train.js`, `contact_search.js`, `contact_score.js`, `geo_explore.js` which `geo_score.js` imports, `open_dump.js`, `open_search.js`, `open_score.js`); the word "test" is in none of them, and their training counts are 61 (9 broke, 52 held).
- **holds in part: "a small leak" is too kind for the contact rule.** `model_contact.md` says its author saw, before choosing, the list in `census.md` section 4 of road crossers with rate, outcome and split, ten of them test rows. That list is the class the rule's own test (b) is scored on, and the one result the note keeps from it ("all six loaded test road crossers held, 0.11 to 1.21 m/s") was readable on it before 1.7 was chosen. For geometry and open the leak is small, as said.

### 5. The names rule

- **holds.** 78 search strings (every track folder on disk and in `replays.json` that does not start `t180b_`, and their first words) against the note and all 33 evidence files: 2 hits, both the English word "drift" in the note's own prose, which is also a stock folder name. Author-prefixed car ids: 0. Positive control: the same search on `S/replays.json`, `S/heads.json` and `S/run.log` gives 984 hits on 26 strings (`chk/names.txt`).

### 6. Where the whole study is most likely wrong

**The one thing it says is left standing, the 1.57 / 1.82 m/s gap, is made by the rate's formula, and it closes under H563's own.**

- `census.js` reads the rate as the height two frames before the crossing minus the height one frame **after** it. For a pass that breaks, the frame after is already the break.
- H563's figures are reproduced exactly by a rate that looks back only, the height three frames before the crossing minus the height at it: grx 1.66 and krysha 1.96, its two published breaks, and 0.15 for its mach6 hold (`chk/q_grx.txt`, `q_krysha.txt`, `q_c74e.txt`, the "frames ci-3..ci" figure). That is the difference of 0.04 to 0.23 m/s that `census.md` s.5 could not explain. **Inferred** that this is H563's formula; three of three match to the second decimal.
- With it, on the seven loaded road passes I re-read (**checked**, the same files and `r_1ca5.txt`, `q_64ac.txt`, `q_9093.txt`, `q_168d.txt`):

| pass | outcome | census rate (m/s) | looking back only (H563's) | only frames before the crossing |
|---|---|---|---|---|
| mach6, t180b_crazy_test_test | held | 0.16 | 0.04 | 0.24 |
| mach6, Elysium | held | 0.11 | 0.15 | 0.48 |
| mach6, [other-0e0103], t 42.165 | held | 1.20 | 1.23 | 1.25 |
| mach6, [other-0e0103], t 42.255 | held | 1.57 | **1.63** | 1.04 |
| mach6, Elysium, t 868 | **broke** | 2.30 | **1.09** | 0.83 |
| grx, Elysium | broke | 1.82 | 1.66 | 1.29 |
| krysha, Elysium | broke | 2.14 | 1.96 | 1.64 |

- A break at 1.09 m/s sits under holds at 1.23 and 1.63. The mach6 that broke was sinking no faster before it broke than two passes that held. So on these replays the fast sink reads as the break's first frame, which the note names as a possibility and does not test.
- **What would show it either way:** re-run the census with the looking-back rate for all 48 crossers and re-score P1 and the contact rule (one line in `census.js`, then `merge.js` and `score.js`). I did seven rows, not 48; five loaded road holds are unread by me (0.40, 0.41, 0.60, and the 33.3 Hz rows at 1.21 and 1.50). If the gap stays closed, the answer these replays give to his question is the note's first sentence and nothing more: they do not give one.

## The librarian's check (2026-11-27, D, after the checker's section; nothing above is edited)

- **`score.js` re-run by me** in `S/`: output identical to `S/score_out.txt` (`diff`). checked.
- **The checker's item 6, run on every crossing pass, not seven.** A copy of the census (`G:/consonance-scratch/fable-break-back/`,
  `census.js` with one added column, `sink_rate_back3` = the box's height three frames before the crossing minus its height at
  the crossing, over three frames: the rate that reproduces H563's figures) was run through the room's lock on the 21 replays
  that hold a crossing pass. 46 of the 47 crossers matched their rows, and on all 46 the census's own rate came out identical
  to `passes.csv`, so the copy reads the same passes. checked: `E/librarian_back3_rows.json`.
- **The gap closes.** Road passes at 50 g or more that reach 11 cm, by the looking-back rate (m/s):
  - held (9): 0.04, 0.15, 0.63, 0.92, 0.99, 1.03, 1.19, 1.23, 1.63;
  - broke (3): 1.09, 1.66, 1.96.
  A break at 1.09 sits under three holds (1.19, 1.23, 1.63). With the census's rate the same twelve read held up to 1.57 and
  broke from 1.82; that gap was the frame after the crossing. checked.
- **What is left:** two of the three breaks are the two fastest sinkers of the twelve, and the third is seventh. That is a
  lean, on three breaks, not a separator. The note's second bullet under "The answer" ("the one thing left standing") does
  not stand as written; its first sentence does: these replays mostly do not give an answer.
- The hangul's hold reads 0.63 and the mach6's 0.15 by this rate, H563's own figures to the digit, so this is H563's
  formula (the checker inferred it from three rows; these are two more). checked, the same file.
- Not done by me: P1 and the contact rule were not re-scored on the looking-back rate for landings and edge passes; the
  33.3 Hz rows were not separated out.
