# T-180: a 90° turn does not come out straight, and the turns cannot be as sharp as Thunderhead's. Librarian, on D, 2026-10-09 18:5x. Lap D280.

The keeper, 18:52, with two screenshots of `TEST TRACK 3` (saved: `tracks/eq-TEST TRACK 3.t180track`): "have a subtle problem with 90 degree turns not coming out
straight, it should be but isnt … Look at the 90 degree turns on thunderhead raceway, i want to be able to make turns like that, currently with the
equation system, the 90 degree turns made are more curve than an abrupt turn … the turns after the jump".

## What the screenshots show
- A placed piece: 750 m, label "turn −90.0°". The ghost after it: turn 0 with "at start" ticked, yet the big readout says **turn −1.3°**. The road keeps
  curving after the 90°, so the exit is not straight.
- The 90° itself is a long, smooth arc. Thunderhead's post-jump turns are short and abrupt.

## The lap: two independent parts, in parallel
**Part 1 (E, who wrote Level/To floor in `src/core/level.js`): exactly θ, then straight.**
1. Reproduce on a COPY of TEST TRACK 3: why turn 0 "at start" after the 90° piece still turns −1.3°. Likely the C1 joint carries the curvature into the
   next piece (Extend's easing), as the climb did before Level. Name it with numbers.
2. Fix it the way Level fixed climb. A **"Turn by" exact**: the piece turns exactly the typed angle (90°) and ENDS with turn rate 0, its kh shape solved
   (close.js's least-norm step, joint C1 from the head, the last control points 0). So the next piece starts dead straight. Straight after it gives
   0.00° change. Bar, registered before code: after "Turn by 90", |heading − (head + 90°)| ≤ 0.01° and the end turn rate is 0 within the stored precision;
   a following Straight reads 0.0° change.

**Part 2 (C, who measured the T-180 test track's cross-section in D223): how sharp Thunderhead's turns are, and what stops us making them.**
1. From `C:\Users\nname\Desktop\t180-track-builder\reads\thunderhead_raceway__normal.read.json` (+ `.equation.json`) and the track itself
   (`Desktop\Assetto tracks\thunderhead_raceway`): the turns after the jump. For each: minimum radius, angle, arc length, entry/exit transition lengths,
   width and bank.
2. What in the builder prevents that shape, measured, not guessed: the Extend easing (transition length), any minimum radius or turn-rate cap, and the
   validator at 970 km/h design speed (D256's always-max-speed check may red a tight turn: lateral or leaves-surface). For each limit: the line, and the
   tightest 90° the builder will place today at width 45.
- Output: one file each. Then the librarian merges and writes the "sharp turn" change for the keeper (it may need a design call, e.g. judging a tight
  turn at its own speed rather than 970).

NEXT: chair dispatch D280 part 1 to E and part 2 to C when this plan is read

## The keeper's clarification, 18:55: ADD a turn type, don't replace one
"THERE is nothign wrong with the 90 degree curves that can be made now, as long as its straight it is a type of turn, but i also want to be able to make
thunderhead 90 degrees too". So: the broad 90° stays exactly as it is (part 1 only makes it exit straight). The Thunderhead-style abrupt 90° is a SECOND
turn type, offered beside it. Part 2's measurements feed the design of that option. Nothing about today's curves changes shape.
