# Model, lens "contact" (2026-11-27, blind to the other two modellers)

Inputs: `passes.csv`, train rows only (61 rows: 9 broke, 52 held). Scripts and outputs, all in this folder: `contact_train.js` to `contact_train.txt` (the rows), `contact_search.js` to `contact_search.txt` (1,052 one- and two-threshold rules tried), `contact_score.js` to `contact_score.txt` (the chosen rule's score).

**Said first, about blindness to the test rows:** I did not open, count or score a test row from `passes.csv`. But `census.md` section 4, which I was told to read whole, prints 20 road-kind crossers with their rates, outcomes and split, 10 of them test rows. I saw them before choosing. The thresholds below were set from the training gaps only (script outputs named), and I did not move them toward or away from those ten lines. A reader should still count that as a leak.

## 1. The rule

**In words:** a pass is predicted to BREAK when the box reaches 11 cm under, is still sinking there at 1.7 m/s or faster (`sink_rate_at_11cm`, the three-frame figure), and the car is under a heavy load, `peak_load_g` of 50 g or more. Everything else is predicted to hold.

```js
r.crosses_11cm === 1 && r.sink_rate_at_11cm >= 1.7 && r.peak_load_g >= 50
```
(NaN in either column compares false, so a pass that never reaches 11 cm is predicted held; nothing throws.)

Where the thresholds sit (checked, `contact_score.txt`):
- Among the 7 training crossers at 50 g or more, the 3 that held sank at 0.16, 1.50 and 1.57 m/s; the 4 that broke at 1.82, 2.14, 2.30 and 64.26. The gap is 1.57 to 1.82; 1.7 is its middle. This is H563's separator again (its gap was 0.63 to 1.66), with the held side now pushed up to 1.57 by two held passes at 84 and 90 g on [other-0e0103]. **The margin is 0.25 m/s, and census.md section 7 puts the reading error of a rate at about that size.**
- Load: among the 18 training rows that sink at 1.7 m/s or more, the largest load on one that held is 41.3 g and the smallest on a break the rule catches is 57.7 g; 50 sits in that gap. One break lies inside it at 44.3 g (a 112 km/h fall at 28.75 m/s), which the rule misses on purpose rather than move the line to 42 with 1 g of margin either side.

## 2. Score on the training rows (checked, `contact_score.txt`)

| | predicted broke | predicted held |
|---|---|---|
| broke | 4 | 5 |
| held | 0 | 52 |

Wrong (all five are missed breaks, none is a false alarm):

| replay_id | t_start | kind | car | rate at 11 cm (m/s) | peak load (g) | km/h |
|---|---|---|---|---|---|---|
| 263aaf1bf2aa | 205.65 | landing | mach6 | 3.72 | 15.1 | 739 |
| 480905fbac85 | 85.83 | landing | mach6 | 2.73 | 4.8 | 244 |
| 480905fbac85 | 160.26 | road | mach6 | 1.56 | 3.6 | 200 |
| 4b3acff96fc6 | 1023.75 | landing | mach6 | 28.75 | 44.3 | 112 |
| 6eee6c19cb18 | 216.42 | landing | talon | 8.98 | 15.0 | 565 |

Caught: the three loaded helix breaks on t180b_elysium (krysha 065789823b52 t 59.94, grx 0805d953319d t 59.415, mach6 1ca5e0b40e3c t 868.335) and the krysha's aftermath row (t 62.655).

**Why it is weak, plainly.** It catches 4 of 9. The other five are low-load events (four landings and one 3.6 g road pass on [other-7fa3a2]), and no contact column separates them from the held landings: held landings sink at 1.6 to 15.4 m/s, broken ones at 2.7 to 28.8 (`contact_train.txt`). The widest rule, "crosses 11 cm at 1.7 m/s or more" with no load condition, catches 8 of 9 but flags 10 held passes (`contact_search.txt`, candidate A). The best two-threshold rule in the whole search scores 8 caught with 4 false alarms and uses distance from the edge, which is not a contact quantity. So contact kinematics separates break from hold only inside the loaded, on-the-road class, on 7 rows, 6 of them from two tracks.

**What did not separate (checked, `contact_train.txt`, `contact_score.txt`):**
- Distance per physics tick. The three loaded breaks travel 62 to 63 cm per 333 Hz tick; the three loaded crossers that held travel 62 to 63 cm. Speed alone says nothing.
- Load alone. The held crossers carry 63.7, 84.0 and 90.5 g; the breaks 57.7 to 64.2 g. More load did not break more.
- Depth. Held passes reach -28.1, -30.0 and -34.7 cm at 0.16 to 1.57 m/s and come back.

## 3. Registered now, before any test row is scored

The rule is WRONG if, on the test rows, any one of these holds:
- (a) of the rows it flags, more than one in three held (with three or fewer flagged: any two held flagged);
- (b) among test rows with `crosses_11cm` 1 and `peak_load_g` 50 or more, two or more have the outcome on the wrong side of 1.7 m/s (a break under it, or a hold over it), or, if that class has four rows or fewer, more than one in four.

The rule is TOO NARROW TO BE THE ANSWER (true or not) if it catches fewer than one in three of all the test breaks. Train's 4 of 9 says expect under half; under a third means the question "what separates a break from a hold" is mostly decided by something this lens does not see.

If the test set holds no crosser at 50 g or more, the rule is untested, not confirmed.

## 4. What a track builder could do if it is true

The break is not a speed limit or a load limit: the same road holds a car at 90 g and 750 km/h if the box is sinking slowly. What the builder can check is where the road's shape drives the floor down fast while the car is already loaded: any stretch where the predicted load is 50 g or more and the surface closes on the car's floor at about 1.5 m/s or more (a change in curvature, bank or cross-section along or across the path, read over a few metres at the car's speed) is a place to warn on, soften, or lengthen the transition. A firmer road shortens the contact, so the same check with a tighter rate would be needed there; this table has one firm-road pass and cannot set it.

## 5. What I could not tell from this table

- **Cause against first frame.** At 66.7 Hz a break develops in 2 to 4 frames, so 1.8 to 2.3 m/s at 11 cm may be the break already under way and not what preceded it (census.md section 7). `peak_load_g` has the same doubt in reverse: a road that gave way never loaded the car, so "low load" on a broken landing may be a result.
- **Which geometry produces the sink.** The box centre only; corners, roll and the side the car sits on belong to another lens.
- **Landings and low-load passes.** Five of nine training breaks. Nothing here separates them; the passes on [other-7fa3a2] at 2 to 5 g with wheels 0.5 to 2.4 m under that still "held" look like overlapping meshes rather than this event (inferred, frames not opened).
- **Firm road.** One training pass at cfm 0.00005 (a landing, broke at 15.1 g). No loaded crosser on a firm road in train.
- **Cars.** The three caught road breaks are three different cars (krysha, grx, mach6); every held loaded crosser is a mach6. Car and sink rate cannot be pulled apart on 7 rows.
- **The margin.** 1.57 against 1.82 m/s, with a rate read to about 0.2 m/s and two formulas (three-frame, one-frame) that disagree by up to 0.7 on one pass (1ca5e0b40e3c: 2.30 and 1.61). On the one-frame figure the rule would not separate.
