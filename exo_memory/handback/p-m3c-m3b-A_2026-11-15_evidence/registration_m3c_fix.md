# M3c's fix, registered before its code (2026-11-15 01:25, seat A)

## What the read found (checked, files beside this one once copied in)
- **My corner routes** (`m3c_read.txt`): the snapped-short step drained the body (kScrapeLoss, 5.17 to 0.62 m/s in 0.15 s). M3c (dreamzone-3
  `a-m1-root` e191f60) makes it a contact; that row and H2 are green. Newly red: the crawl guard (way (b) 1.300 times today's, bar 1.25) and
  the new-kind row (9 of 10 routes).
- **Pane E's 22 degree bend, staged as E stages it** (`dz-world --film-corner --corner 22`, E's build ff6151c, my copy reproduces E's figures:
  grip only 4.437 in, lowest 0.545, 2.049 s; slows 4.430, 0.873, 2.160 s). Two causes, read tick by tick:
  1. **The path flips sides of a door-frame post at the replan of the hunter's tick 691, in every arm** (today's law not yet read on this):
     before it the path runs north of the post to (-83.35, 50.98); after it, south of the post through its corners (-74.84, 40.66) and
     (-75.19, 40.66) to the player standing at (-85.57, 46.57). The body is 0.3 to 0.5 m north and swings back. This is the planner's, not
     the contact's.
  2. **On aad376b** the body then turns about 90 degrees at the post's corner in contact with the frame, and snapped steps drain it to 0.546.
     **On M3c** the snapped step keeps its speed (lowest 1.253 and 1.266, the 1.2 bar met), but a contact at tick 836 (kept share 0.979)
     starts a slide during which **the aim waits**: about 60 ticks with the heading easing from -117 toward the edge's -131.8 while the path
     is at -90, so it carries past the corner and turns back: 1.646 and 1.632 s between the gates against 0.889.

## The fix
While a body on the root slides (`c.slide` set), **its velocity turns toward the aim**, no faster than its grip allows at its speed
(`min(turn_slow, mu g / max(speed, kRootWalk))`), with its rate of turn eased in as the heading's is (`kTurnEase`), in a field of its own
(hashed on the root). The heading eases toward the velocity as now, and the slide ends when they are within 3 degrees, as now. A turned
velocity that points into an edge meets it on the next step and is put along it again (M3a/M3c's contact). Nothing moves the body by hand;
the creep floor is not touched; no row's bar moves.

## Registered, before the run
- **The fix is wrong if** on E's 22 degree bend the slide that begins at the contact near the post still runs 30 ticks or more with the
  velocity more than 20 degrees off the aim; or if any root body's velocity, sliding, turns faster than its grip allows (printed as the worst
  share of grip over the corner routes and the scripted bends).
- **Expected, and it may fail:** the crawl guard green again for both ways (at most 1.25 times today's); the new-kind row 10 of 10; H2 and the
  snapped contact still green; E's bend lowest still at least 1.2 m/s and its time under M3c's 1.646 s. **Not expected:** E's bend under
  0.889 s, because cause 1 (the flip) is untouched; if it does go under, say so and do not credit the fix with cause 1.
- **The M3c falsifier stands:** wrong if H2 goes green because the body is moved away from the wall by hand, or the creep floor is lowered.
- **Off means off:** the 12-seed md5 fa938de4..., D's 20 kept runs replay as on main.
