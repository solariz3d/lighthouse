# Plan: T-180, the floors and the bank wrap that [T1] ran into (pane A, 2026-11-26 19:58Z; no code)

Chair D677, same lap, from the [T1] hand-back (`exo_memory/handback/p-unmakeable-T1-A_2026-11-26.md`). Base: builder
`landing-1126` **ceb21f5**, read only. Every file:line below is at ceb21f5. No track's name, coordinates or read appear
here; [T1] figures are our own measured differences.

**My bias, stated:** I wrote the hand-back that blamed these floors, and two of those blames were marked `inferred:`.
This plan's first job is to find out whether they were right, before anything is moved.

## Summary

| limit | where | what it guards | does [T1] show it blocks? | plan |
|---|---|---|---|---|
| a corner piece needs at least 21 m | `src/core/turnby.js:147` TURN_TOO_SHORT | a free control point between the joint's two kept points and the two that end it straight | **not shown.** Rate pieces have no such floor and still missed the switchback. | measure first (M-A0). Shorten only if M-A0 says so |
| the bank's fit floor, 26 m | `src/core/extend.js:364` BANK_FIT_FLOOR_M, refused at `:563-568` (BAD_SECOND; `:520` is the same code's options-form check) | the road holds its bank before the mark (his D642 ruling: an extra "never squeezes") | **not shown.** The hairpin's misses come from rate pieces, which this floor does not touch. | measure first (M-B0). The likelier limit is the 3 g roll bar (below), which is his to move |
| the width floor, 40 m (cup and edges 26 m) | `src/core/extend.js:356` CHANGE_FLOOR_M | no overshoot of the width, and the road holds before the mark | **no.** No [T1] section asks for a short width change. The jogs are a side offset, not a width change (inferred). | **keep.** No change proposed |
| the bank kept within one turn | `app/core/panel.js:429-434`, `:475`; `app/core/coreshell.js:61` | his 2026-10-06 rule (quoted in full below) | **yes, checked** (`roll2.js`, `roll3.js`, `twist.js`). 2 sections, 228 m | **his call.** The ruling and its trade are set out below. Not decided here |

**Tier for every row in this plan: prove it.** The rows touch core maths, stored data and a past ruling.

## (a) The floors

### A. The corner piece floor: at least 21 m (TURN_TOO_SHORT)

**Why it exists** (code and record):

- `turnby.js:5-7`: a corner piece turns exactly the typed angle and "ENDS STRAIGHT: turn rate 0 and its slope 0". It is
  "Refused by name (TURN_TOO_SHORT) when the piece is too short to have a free turn control point".
- Its joint keeps the head's first two control points, so the piece continues C1 from the head
  (`turnby.js:20-21`, `src/core/README.md`). The last two are 0. Interior knots fall every `KNOT_M = 20` m
  (`document.js:61`, `:80`), so a piece of 20 m or less has one span and four control points, and none of them is free.
- The record has no angle in this rule. `loop/l139_registration_2026-11-05.md:108-111`, checked: `shortestTurnBy`
  returns 21 m "for a second corner of every size tried (5° to 270° turn …). The solve converges on two knot spans,
  whatever the angle."
- `turnby.js:22-23` says the floor is not a ride limit: "THE LIMIT: none but having a free control point. Neither the
  document nor the validator bounds the turn rate … how sharp a builder turn can be is still to measure."

**So it guards three things:**

1. C1 from the head;
2. an exact typed angle;
3. ending straight.

It is not a comfort rule. **Nobody has ruled that a corner must be 21 m.** It falls out of the knot spacing.

**What a shorter floor would break.** The likely route is finer knots for a short corner piece; pieces store their own
knots (`document.js:514`), so old files read unchanged (inferred: from the serialiser line, not tested).

- **Anything that assumes one knot span is 20 m.** That covers:
  - `SECOND_FLOOR_M = 20` (`extend.js:347`, "one knot span … the panel's reveal floor");
  - the panel's `AT_START_M = 20` (`panel.js:54`);
  - the knot filter of `secondRamp` (`extend.js:290-292`, `k < L − 0.5`);
  - `CORNER_SUB = 8` knots inserted per extra corner (`turnby.js:189`).

  Each needs reading against a piece whose span is under 20 m.
- **The adapter integrates heading on 2 m segments** (`turnby.js:30`, SEG_M). A 10 m corner is 5 segments, and the
  rounding `TURN_TOL` was sized on long pieces (`turnby.js:31`). That needs measuring, not assuming.
- **The ride.** 90° in 10 m peaks near 1,800°/100 m. The validator does not bound turn rate (`turnby.js:22`), so
  nothing would stop a corner no car can take. The open question in `turnby.js:23` becomes live.

**The measurement first (M-A0), local, before any red row.** [T1]'s switchback was laid whole by rate pieces, which have
no 21 m floor. The best form still missed: position p95 3.7 m against 3, bank 9.2° against 5, exit 8.9°, peak turn 271
against 387 °/100 m (hand-back §2). So the floor is **not shown** to be the blocker.

M-A0 lays the zone in a scratch copy with the 21 m floor removed: a corner per bend at the bend's own length, no other
change. Read it against the same tolerances.

- **Falsifier, registered now:** if that copy does not bring position p95 under 3 m and the exit under 2°, the corner
  floor is not what blocks the switchback. Then this floor stays, and the switchback goes back to the catalogue as its
  own class (a bank reversal inside a short bend).
- **The unwelcome outcome, in the words that would make it true:** "the floor was never the blocker".

**Red-first rows (only if M-A0 passes).** Synthetic shapes only, never [T1]'s.

| row | today | after |
|---|---|---|
| A1: a corner of 58.7° in 20 m from a straight head is laid, turns 58.7° ± 0.01°, and ends with turn rate 0 and slope 0 | red (TURN_TOO_SHORT "needs at least 21 m", checked: `node corner.js`) | green |
| A2: the same at 10 m, and 90° in 12 m | red | green |
| A3: a synthetic switchback (bends of 60-115° every 20-30 m, the bank reversing ±37° between them), laid as one corner per bend, matches its own generating curve within 3 m and 2° | red | green |
| G1, guard: every corner of 21 m or more lays byte-identical documents to ceb21f5 (the test tracks round-tripped through the serialiser) | green | green |
| G2, guard: a short corner continues C1 from a head still turning (kh and its slope match at the joint) | n/a | green |
| G3, guard: the existing TURN_TOO_SHORT rows (and Turn by's `needM`) still refuse what has no free point, now at the new shortest | green | green, amended by name |

Mutation runs: on `turnby.js` and `document.js` whole (prove it).

### B. The bank's fit floor: 26 m (BANK_FIT_FLOOR_M, BAD_SECOND)

**Why it exists** (code and record):

- **Measured, not chosen.** D650, pane A, 2026-11-10 (`handback/p-d650-extra-change-A_2026-11-10.md:27-43`). On the
  built road, a bank change of 5° or more needs 26 m (20 m for 1°, 23 m for 2°). "At 25 m the fit moves the road
  before the mark by 0.15° a degree of change." `extend.js:362-363` states the same.
- **What it protects is his ruling.** `turnby.js:183-186` (D642, the keeper 2026-11-05 19:54Z: "now look what happens
  to it when I try the second turn even a little bit … it makes it more sharp and takes the original shape away"): an
  extra **adds** and never squeezes the piece's own shape. A change shorter than the fit floor moves the road before
  its mark, which is the very thing he caught.
- **Above the floor sits the comfort length,** 31.5·√(degrees) (`extend.js:294-298`). That is his L139 ruling, the
  keeper 2026-11-05 07:00Z: "we dont want the bumps, we want the transmutations to be smooth all around the board". The
  code says of it "ONE constant: the keeper's to move" (`:297`).
- **On a straight road's end the built floor IS the comfort length:** 211 m for 45° (D650 hand-back `:42-43`).
- **The adapter holds the built road to the same bar.** Wherever the roll accelerates past `BANK_BAR` (3 g at a wheel
  10 m out at 170 m/s; `src/core/adapter.js:402`, `:442`), it re-rounds the built bank. On turning road it may move the
  bank by no more than 4° (`BANK_TURN_KEEP`, `:406`).

**What [T1] shows.**

- The hairpin after the roll (4579–4851) missed on every rate form: built peak roll 0.69–1.16 against the read's
  1.91 °/m, exit heading 15.8–27°. Rate pieces lay the bank as each piece's FIRST ramp, not as an extra change, so the
  26 m floor is not in their path. The hand-back's naming of BANK_FIT_FLOOR_M there was `inferred:` and is likely wrong.
  **Correction to the hand-back, said here.**
- The one BAD_SECOND that route met was the flowing bank's shape check ("needs more room than the piece's 16.1 m").
- **The likelier clip is the adapter's 3 g bar.** Checked with a scratch estimate (the read's bank smoothed ±2 stations,
  second difference, p95):

  | stretch | roll acceleration p95 | × BANK_BAR (0.0058 °/m²) | made? |
  |---|---|---|---|
  | switchback zone | 0.088 °/m² | 15 | no |
  | the full roll | 0.025 °/m² | 4 | yes |
  | the hairpin | 0.019 °/m² | 3 | no |
  | a made steeply banked corner (368–624) | 0.015 °/m² | 3 | yes |

  These are noisy second differences: an order of magnitude, not a measurement to quote as exact. They say the bar
  alone does not separate made from unmade, except at the switchback.

**The measurement first (M-B0), local.** In a scratch copy, lay the hairpin three times by its best rate form, and read
the built peak roll and exit each time:

1. as is;
2. with the adapter's bank re-rounding off;
3. with the 26 m fit floor off.

- **Falsifier, registered now:** if neither (2) nor (3) brings the built peak roll within 30% of 1.91 °/m, neither limit
  is the blocker. The cause is in the rate-piece route (each piece's bank ramp starting and ending at rest, so a chain
  halts at every joint, as `extend.js` THE FLOWING BANK comment describes). Then the hairpin is a route gap, the flowing
  bank is its tool, and this floor stays.
- **The unwelcome outcome:** "the 26 m floor never mattered on [T1]".

**What a shorter fit floor would break:** the hold before the mark. That is his D642 "takes the original shape away",
0.15° per degree of change at 25 m. The only way under it without breaking the hold is a finer fit across the change
(more knots than `SECOND_SUB = 8`, `extend.js:283`). That is the same knot question as A.

**Moving the comfort bar is not a pane's change.** It is his L139 constant, sized at 170 m/s (612 km/h). If M-B0 shows
the adapter's bar is the clip, the question goes to him with the number: the reference tracks roll faster than a bar
sized for 612 km/h allows, and where.

**Red-first rows (only if M-B0 names the fit floor):**

| row | today | after |
|---|---|---|
| B1: on a turning 300 m piece, an extra bank change of 35° over 20 m is laid, and the road holds within 0.5° before its mark | red (BAD_SECOND, 26 m) | green |
| G4, guard: `test/core_extra_change.test.js` rows 1-6 (his 125 m piece; the hold before the mark; the refusals by name) | green | green |
| G5, guard: the D650 rows L135 6b/6c, L139 5a/5b and C13 (hand-back `:128-145`) | green | green, any amendment by name with its reason |

Mutation runs: `extend.js` and `adapter.js` whole.

### C. The width floor: 40 m (cup and edges 26 m)

- **Why it exists:** measured, D650 (`:35-36`). At 39 m the width fit overshoots by up to 0.2 m; the cup and edges at
  25 m move the road before the mark. It is taken as the shorter of the floor and the comfort length, so a small change
  keeps 20 m (`extend.js:357-361`). `test/core_extra_change.test.js` row 6 re-reads it.
- **[T1]: no section needs it.** The jogs (5 sections, 140 m) are one edge moving while the other stays: a side shift
  of the centre. The panel has no field for that, and a width change would not make it.
- **Plan: the width floor stays.** No row is proposed. If a later track's table shows a width change under 40 m, M-C0 is
  the D650 instrument re-run at a finer knot spacing.

## (b) A bank continuing past −360°

**The behaviour, checked** (`roll2.js`, `roll3.js`, `twist.js` in my scratch): from a head at −340°, a typed −392 lays
−360 / −195.2 / −32 at 230/280/330 m. That is the road unwinding a full turn at up to 6.13 °/m. The core given the same
target lays −360 / −375.2 / −392, at most 0.62 °/m.

A flow mark and an extra row unwind too, and an extra row alone is refused (BAD_SECOND). The Twist brush wraps
(`coreshell.js:61`). [T1] needs it on 2 sections, 228 m (4267–4471, 4527–4551).

**The ruling it would reverse: D259, 2026-10-06.** His words, as the record holds them:

- **18:21:** "it continues after 360 forever instead of resetting back to 0"
- **18:22:** "like say with the dragging feature"
- **18:24, his FINAL rule:** "same for -360 if it banks the other way ... it should reset back to 0"

Sources:

- `exo_memory/handback/p-bankwrap-B_2026-10-06.md:9`, `:78`;
- the code comment `app/core/panel.js:429-431`;
- builder commit `89b1859` (2026-10-06): "The bank keeps within one full turn, its sign kept (370 -> 10, -370 -> -10),
  shown and applied".

The "..." is in the record. I did not find his unelided 18:24 message on disk.

**What the rule built** (`p-bankwrap-B_2026-10-06.md:78-87`):

- The bank lives in (−360, +360) and keeps its sign, shown **and applied**: in the Extend field, the ghost handle,
  Sculpt's handle and the bank brush.
- "**No nearest-equivalent rewrite.** The stored winding of existing tracks is untouched."
- Its first build was the opposite design: wrap to ±180 and roll the short way, the nearest equivalent (`4aba04d`). The
  chair ruled it out when his 18:24 rule arrived, and it never landed (`:5`).

**Its one amendment, which he asked for, and which leans the other way.**

- **2026-11-03 01:06Z** (`briefs/t180_joint_bumps.md:9`): "when you make the track go all the way around say -360
  degrees, it only hits 359.99 and then glitches out, so if you make a spiral it wont go all the way around without
  glitching".
- Builder `51f3a82` (2026-11-02, as the commit is dated) then made exactly ±360 a full turn (`panel.js:432-433`). Past
  one turn it still wraps.

**The tension, for him to weigh, not resolved here.** On 10-06 he asked for a bank that resets after a full turn. On
11-03 he asked for a spiral that goes all the way around. [T1] has a roll that goes on past one full turn (to about
−392°). Today only a winding of exactly ±360 can be typed, and nothing past it.

**What each answer costs** (consequences, not a recommendation):

| if he… | then | rows that change |
|---|---|---|
| keeps D259 | [T1]'s 228 m stay unmade from the panel; the core can lay them, so it is a panel gap only | none |
| reverses it for **typed** values only (the field still shows one turn) | a typed −392 rolls on. His 10-06 complaint returns for typing only; a drag still wraps | the D259 typed rows: `app/test/core-pieces-ui.test.js:918`, `app/test/core-xsec.test.js:280`, amended by name |
| reverses it everywhere | the 10-06 behaviour returns for drags too ("it continues after 360 forever") | the above plus `core-pieces-ui.test.js:923`, `app/test/core-sculpt.test.js:195`, `:204` |

Whatever he picks, these guards stand:

- stored winding is untouched;
- Close joins modulo whole turns (`p-bankwrap-B_2026-10-06.md:15`);
- existing tracks keep their bytes (TEST 1 at −4π).

**Red-first rows, written only after his word:**

| row | today | after |
|---|---|---|
| W1: from a head at −340°, a typed −392 lays the road −340 → −392 monotonically, peak roll within 10% of the core's own (0.62 °/m on the same piece) | red (unwinds to −32, 6.13 °/m) | green |
| W2: an extra bank row past −360 is laid, not refused | red (BAD_SECOND) | green |
| G6, guard: Close on a wound lap gives the same seam as at ceb21f5 | green | green |
| G7, guard: TEST 1 at −4π and every test track round-trip byte-identical | green | green |

Mutation runs: on `panel.js` and `coreshell.js`, the harnesses that name them.

## Order, if any of this goes ahead

1. M-A0 and M-B0, local, one pane, no code: are the floors the blockers at all?
2. His word on (b).
3. Then only the rows whose measurement or word says go. Each gets its own branch and prove-it landing.
4. C stays as it is.

## Falsifier for this plan

This plan failed if:

- M-A0 or M-B0 shows a limit this plan did not name as the blocker of the switchback or the hairpin; or
- a floor is shortened without its guard rows (G1-G5) staying green.
