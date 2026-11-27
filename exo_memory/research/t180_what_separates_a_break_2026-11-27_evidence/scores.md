# Scores: the three blind rules, P1, P2, P3 and two baselines (the scorer, 2026-11-27)

I wrote none of the census and none of the rules. Every count below is **checked**: it is printed by
`node G:/consonance-scratch/fable-break/score.js` (reads `passes.csv` only; output kept in `score_out.txt`).
Sentences marked *inferred* are my reading of those counts.

Table: 111 rows, 15 broke. Test split: 50 rows, 6 broke, 44 held.
The six test breaks by kind: 2 road, 2 landing, 1 edge, 1 aftermath. Four of the six are in two replays
(c98a874cbe3b on [other-8bfad1], 3; e5c0fd082282 hangul on t180b_elysium, 2).

## 1. The three rules on the test rows, each against its own registered failing result

| rule | broke, said broke | broke, said held | held, said broke | held, said held | right of 50 | verdict, read literally |
|---|---|---|---|---|---|---|
| contact | 2 | 4 | 1 | 43 | 45 | NOT WRONG, and not "too narrow", each by the smallest margin possible |
| geometry (a or b) | 1 | 5 | 8 | 36 | 37 | FAILED on both counts |
| open | 3 | 3 | 6 | 38 | 41 | FAILED on both counts; its helix fact is wrong |
| baseline: always held | 0 | 6 | 0 | 44 | 44 | |
| baseline: deepest_cm beyond 16 | 5 | 1 | 8 | 36 | 41 | |

**Contact.**
- (a) flagged 3, of them 1 held (the limit with three or fewer flagged is two held). Not wrong.
- (b) test rows crossing 11 cm at 50 g or more: 9 (2 broke, 7 held). Wrong side of 1.7 m/s: 1 (a landing on
  [other-8bfad1] that held at 7.86 m/s, 60 g). The limit is two. Not wrong.
- Narrowness: it catches 2 of 6 test breaks, which is exactly one in three; the registered bar is "fewer than one in three". Not too narrow, by nothing.
- What it caught: one landing (24.64 m/s, 74.4 g) and one aftermath (50.51 m/s, 82.1 g). **It caught neither of the two test
  road breaks**: one crossed at 35.5 g (under its 50 g gate), the other never reached 11 cm (hangul, t 66.39, wheel under at 47.7 g).
- The part that did hold: all 6 test road passes that crossed at 50 g or more held, and all sank at 1.21 m/s or slower
  (0.11, 0.40, 0.41, 0.60, 1.20, 1.21). No test road pass at 50 g or more sank faster than 1.7, so **the break side of its
  line on the road kind was not tested at all** (*inferred*: it is a confirmed "slow sinkers hold", not a confirmed "fast sinkers break").
- It beats "always held" by one row (45 against 44).

**Geometry.** Catches 1 of 6 (bar: at least 3). Flags 8 of 44 held (bar: at most 6). FAILED.
- Clause (a): 1 break, 5 held flagged. Wrong by its own test (more held than broken).
- Clause (b): 0 breaks, 3 held flagged. Wrong by its own test (catches none).
- Four of clause (a)'s five false alarms are held passes on t180b_elysium's 66-degree bank at 3.3 to 3.4 m from the edge
  (mach6, hangul, demo, gigerbon), the same place and distance as the training breaks. Its author's stated expectation
  (2 of 6 "would mean geometry at the pass does not decide it") is met and passed: 1 of 6.
- Worse than "always held" (37 against 44).

**Open.** Test breaks not aftermath: 5, caught 2 (bar: at least half). Flagged 9, of them 6 held (bar: at most one in five). FAILED.
- Tested, not "not tested": 10 test rows have |u_m| > 13.44.
- The helix fact: 4 test passes on t180b_elysium with |road_roll_deg| 60 to 70, all four held, at |u_m| 13.75, 13.78,
  14.03, 14.16, all past 13.44. WRONG. (None broke at |u_m| under 13.22.)
- Worse than "always held" (41 against 44).

**Baselines.** "Always held" is right on 44 of 50 and catches nothing. "deepest_cm beyond 16" catches 5 of 6 and flags
8 held (41 right); on all 111 rows 13 of 15 with 20 held flagged. It is not a fair predictor: the census says a broken
pass's `deepest_cm` can be a frame already inside the break (census.md section 5), so it partly reads the outcome.
The one test break it misses is the hangul wheel-under (deepest -10.5 cm).

**Read together (*inferred*):** the two rules built on where the car is on the road failed on the helix itself: on the same
66-degree bank, at the same distance from the edge, four passes held where three had broken in training. The only rule
left standing is the one that uses how fast the box is sinking under load, and it stands on 3 flagged rows, none of them a road pass.

## 2. P1, the sink-rate separator (holds at 0.63 m/s or slower, breaks at 1.66 or faster)

"New" = every 11 cm crosser except H563's own. The census found five of H563's seven; four of them are crossers
(grx and krysha broke; mach6 C00 and hangul C09 held), the gigerbon never crosses; the other two are in a replay that does not parse.
New crossers: 43 (31 held, 12 broke). Rate column: `sink_rate_at_11cm` (three frames).

| set | n | held: slow / between / fast | broke: slow / between / fast | wrong side (limit) | between (limit) | verdict |
|---|---|---|---|---|---|---|
| all new crossers (the registration as written) | 43 | 3 / 9 / 19 | 0 / 1 / 11 | 19 (over 8.6) | 10 (over 21.5) | **FAILED** |
| kind road only | 16 | 3 / 7 / 3 | 0 / 1 / 2 | 3 (over 3.2) | 8 (over 8) | held, at both limits |
| kind road, 50 g or more | 8 | 3 / 4 / 0 | 0 / 0 / 1 | 0 | 4 (over 4) | held, at the limit |
| kind road, his own tracks | 2 | 1 / 0 / 0 | 0 / 0 / 1 | 0 | 0 | too few to read |
| kind landing | 18 | 0 / 2 / 10 | 0 / 0 / 6 | 10 (over 3.6) | 2 | FAILED |
| kind road, one-frame rate instead | 16 | 2 / 7 / 4 | 0 / 2 / 1 | 4 (over 3.2) | 9 (over 8) | FAILED |

- **Verdict, read literally: FAILED.** The registration names no kind; 19 of 43 new crossers held at 1.66 m/s or faster.
  Ten of the 19 are landings, six are edge passes, three are road passes on other authors' tracks at 4.1, 5.3 and 33.2 g.
- **On H563's own kind of pass (road) it neither fails nor separates:** 3 wrong of 16 where 3.2 would fail it, and exactly half
  (8 of 16) cross between the two figures where "most" would fail it. Changing only the differencing (one frame for three) fails it.
- **The smallest honest statement:** the break side holds among breaks (11 of 12 new breaks crossed at 1.66 or faster), but a
  fast sink does not mean a break (19 of 30 new passes at 1.66 or faster held). The hold figure of 0.63 is too low: loaded
  road passes held at up to 1.57 m/s (64ac1f991be9, 90.5 g). Among road crossers at 50 g or more, all rows, held reach 1.57
  and breaks start at 1.82: a gap of 0.25 m/s, on 3 breaks (grx, krysha, mach6, all on Elysium's helix, all in the training half; two are H563's own). One road break crossed at 1.56 m/s at 3.6 g
  on another author's track; the census did not read its frames.
- A caution on the unit: the census's rates differ from H563's on H563's own passes by up to 0.23 m/s (C09 is 0.40 here,
  0.63 there; census.md section 5), which is the size of the gap being tested.

## 3. P2, the roll (breaks commoner in the top quarter of roll_load_g)

| set | top quarter: broke of n | rest: broke of n | chance of that or more by luck |
|---|---|---|---|
| all rows (cut 3.38 g) | 4 of 28 (14.3%) | 11 of 83 (13.3%) | 0.556 |
| all but aftermath | 4 of 28 (14.3%) | 9 of 81 (11.1%) | 0.440 |
| kind road | 2 of 18 (11.1%) | 4 of 53 (7.5%) | 0.479 |
| kind road, his own tracks | 2 of 5 | 2 of 14 | 0.272 |
| kind road, other tracks | 0 of 13 | 2 of 39 | |
| t180b_elysium, all kinds | 2 of 7 (28.6%) | 4 of 14 (28.6%) | 0.686 |
| test split | 0 of 13 | 6 of 37 | |

- **Verdict: by the letter it did not fail (14.3% against 13.3% on all rows); as evidence it cannot be read.** The difference
  is one break in 28, a result luck gives more than half the time, and it reverses on the test half and on other authors' tracks
  and vanishes on Elysium alone.
- **The smallest honest statement:** these replays show no link between roll load and breaking, and cannot show its absence either.
- Three reasons it could not be tested properly: (1) the column is not validated and the census calls differences under about
  2 g noise, while the top-quarter cut is 3.4 g; (2) the box's centre is measured, not its corners, and P2's mechanism is about a
  corner; (3) the Type A event on [T1] that P2 was registered around is not a row: the census found no pass there (the box never
  went under at 66.7 Hz).

## 4. P3, the cars (same track, same sink speed, no car breaks more than another)

- Only one track has more than two cars: t180b_elysium (21 rows: mach6 12, hangul 3, krysha 2, grx 1, augury 1, demo 1, gigerbon 1).
- Road passes on its 66-degree bank that crossed 11 cm, by rate: mach6 held 0.11; hangul held 0.40; grx broke 1.82; krysha broke
  2.14; mach6 broke 2.30. **Five passes, in one order, with no car out of line:** every break is faster than every hold, and the
  mach6 sits on both sides.
- **Verdict: cannot be read; not failed.** The failing result needs one car breaking where others hold on at least three passes.
  No car other than the mach6 has three passes on any track, and no car has more than one road break that crossed 11 cm.
  The five passes agree with "the cars are alike"; five passes cannot confirm it.
- Raw break counts by car (krysha 2 of 2, hangul 2 of 3, grx 1 of 1, mach6 9 of 99) are not a car difference: the other
  cars' rows are almost all the one helix on the one night, and each car's second break is the aftermath of its first.
- **The typea: 0 rows.** Two replays were read (190 s on t180b_elysium today, on the firm road 0.00005; 67.7 s on [T1]); in
  neither does the box go under the surface (least height -0.1 cm and +1.2 cm, `typea_elysium_min.txt`, census.md sections 4 and 6).
  So the table says nothing about whether the typea clips worst. It rests on no passes. His [T1] clip is in the census as an
  unexplained 54 km/h loss followed by leaving over the road's edge, not as a pass.

## 5. The degenerating outcome

Registered: fewer than about ten broken passes means nothing can be separated. The table has 15 broken rows, but they are three
different events (census.md section 7): 6 landings, 2 aftermaths, 1 edge, and **6 road breaks**, of which 4 are on Elysium's soft
road and 2 on other authors' tracks with unread frames. The test half holds 2 road breaks. **For the event the question is about,
the degenerating outcome is met:** 6 road breaks in 1,786 km of his own T-180 driving in the covered replays (`summary.txt`),
about one in 300 km.

## 6. What I could not do, and why

- **Score any rule on road breaks alone.** The test half has 2. A rule can be made to pass or fail by one row.
- **Test the break side of the contact rule on a road.** No test road pass at 50 g or more sank faster than 1.21 m/s.
- **Say whether a fast sink causes a break or is its first frame.** 66.7 Hz against 333 Hz physics; a break develops in 2 to 4
  frames; the two rate columns differ by up to 0.7 m/s on one held pass, and P1 on road passes flips with that choice.
- **Use H563's own rate.** Its differencing is not written down; the census's formula gives different figures on H563's own passes.
- **Count H563's two "reference" passes as old or new.** Their replay does not parse; they are in neither set.
- **Read P3 or anything about the typea.** No rows.
- **Treat rows as independent.** Several replays contribute many rows (c98a874cbe3b alone gives 3 of the 6 test breaks);
  I did not score by replay. The split is by replay, so there is no leak between halves, but the test half is in effect about
  six replays' worth of breaks from two.
- **Check the surface on other authors' tracks**, where 8 of the 15 breaks and all of P1's wrong-side road holds are. The census
  did not read those frames; nor did I.
- I did not re-run the census or open any replay. Every figure here inherits the census's doubts.
