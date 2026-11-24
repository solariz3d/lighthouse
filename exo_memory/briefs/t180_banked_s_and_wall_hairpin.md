# Brief: T-180, two shapes to reach: the banked S in one section, and the wall hairpin

Written 2026-11-10 (D) by the librarian. Nothing here is built yet. It is the next lap after D650.

## His words (verbatim; newest last; all 2026-11-10, on D, to the librarian)

Three track names in his sentences are other authors' tracks. Their names stay out of this public repo, so each is replaced by a
bracketed stand-in and nothing else in the sentence is changed. He knows which they are; ask him, or see the pictures.

- 16:32, with a picture (`t180_banked_s_reference_2026-11-10.png`, his red arrows on the two turns): "also analyze this image and look
  at [reference track A]s first turn, do you see how its like two 90s together, but the banking levels out before banking into the next
  one, effectively being 4 banking changes in the one section in quick succesion, can we do this?"
- 16:35: "also one piece i knew we couldnt make, dont have a screen shot, but you will see it, go to [reference track B], or even the
  top of [reference track C], the upside U turn variations, the best one in my head is the [reference track B] one, its like a Inverted
  U you drive on like a wall and its a hairpin, you know? Look at [reference track B] and find the inverted U wall turn hairpin"
- 16:37: "find the highest point and thats where the turn is on [reference track C]"
- 16:38, when the librarian said no read of it existed: "The [reference track C], there has to be, we have recordings" (he was right:
  a read from 2026-09-28 was on D's Desktop).

Earlier the same day, the two limits he hit on the way to these shapes (both fixed; `briefs/t180_second_bank.md` has them):
- 13:56, picture `t180_extra_turn_held_2026-11-10.png`: the extra turn stopped near 2.64° on a 125 m −90° piece.
- 15:42, picture `t180_extra_bank_held_2026-11-10.png`: "it jumps to -5 degrees and then stops", on the extra bank.

## The problem, in one line
He wants to build, by hand in the builder, two shapes real T-180 tracks have: an S whose bank goes in, level, the other way, level
inside one short section; and a hairpin made by riding up and over an arch on a steeply banked wall.

## What the shapes are (measured by the librarian from existing local reads; coarse numbers only, no layout)

**The banked S** (from his picture): a right turn banked into the turn, the road levels, a left turn banked the other way, level
again. Four bank changes after level: in, level, the other way, level.

**The wall hairpin on reference track B**: about 13.3 km into its lap, the only stretch of that track whose centre is banked 60° or
more. About 300 m end to end.
- Run-in, about 130 m: climbs to about 46° of pitch while rolling to about 65° of bank.
- The top, about 80 m: pitch goes from about +46° to about −41°, the map heading turns about 100°, bank held near 65°.
- Run-out, about 100 m: comes down and unrolls.
- It rises about 85 m and turns about 140° on the map in all. Width 28 to 32 m.

**The wall hairpin on reference track C**: at that track's highest point (about 1,180 m above its lowest).
- Comes in banked about 40°.
- The climb, about 200 m: pitch up to about 78°, bank to 70–77°, rising about 170 m.
- The crest, about 120 m: pitch from about +78° to about −55°, bank about 95° (past vertical).
- Down at about −50°, bank easing back to about 40°. Width 30 to 43 m, widest at the crest.
- No map-turn figure: at that steepness the heading read from the forward vector jumps about.

So both hairpins are an arch ridden on a wall; most of the turn comes from going up and over.

The reads are on D only and are gitignored (they are other authors' layouts): the first in `Downloads/t180-track-builder/reads/`,
the second in `Desktop/t180-track-builder/reads/` and, re-read 2026-11-10, in `Downloads/t180-fresh/reads/`. On L, read them again
with the track-equations skill if the tracks are installed there.

## State (2026-11-10 17:4x, D): not started

What the builder can and cannot do today, t180 main `3b33b38`:
- The core takes a list of changes per field. One node run laid a 600 m piece with turn −90°, an extra turn +90° at 300 m and three
  extra bank changes at 150, 300 and 450 m. Its bank control points read max 2.5° and min −22.5° where about +20° and −20° were
  expected, so **the shape is not confirmed**; read the bank along the built road before believing it.
- The panel gives ONE extra handle per field. That is his own word of 2026-11-05 (`app/core/panel.js`, the comment at "ONE extra
  handle per field": "perhaps we should only do two per action on the piece … until we figure out how to make it work right").
- As two pieces the S is close today: each half is a 90° turn whose extra bank brings it back to level, which D649 and D650 freed.
- The wall hairpin has not been tried in the builder. No claim that it can or cannot be made.

## The next lap (planned, not dispatched; one pane, prove-it tier)
1. Prove the four-change bank in one piece on the BUILT road (the bank read along the road, not the control points).
2. Let the panel carry more than one extra per field, so the changes can be added by hand. This moves his 11-05 limit: tell him.
3. Lay each wall hairpin from the numbers above through the core, headless, and report every refusal by name. Do not fit the other
   authors' layouts; use the coarse numbers.
4. The drag-cost cache from D650 (below), with a row that asserts it.

## Open, his calls
- Quick banks on a STRAIGHT road, the same way as the bank before: still refused, because the builder of the road mesh smooths a
  fast roll back (his 2026-11-05 "we dont want the bumps" ruling, living in the adapter's bank plan). Freeing it changes how the road
  is built.
- More than one extra per field in the panel (item 2 above).

## Added 2026-11-24 00:5x (D, the librarian): he names the turn he wants, and it is measured

The track and its author are another creator's, so both names stay out of this file (the rule at the top). It is the track of his screenshot of tonight, taken by me to be reference track A; the read is on D only, gitignored: `Desktop/t180-track-builder/reads/` (2026-09-28).

**His words, 00:44, with a screenshot** (on D: `Pictures\Screenshots\double banked 90 degree turn the first turns are close to the same just reversed in a way but i want the system to be able to make this.png`; his red outline round the two turns, an arrow at the join):
"the extra turn works in the way it has, but it isnt how I want it, the perfect turn I want to be able to make with it is in the track [reference track A], should be on disk, made by [its author], look for the starting straight, then the first two turns, and the last two turns, they are like this banked two 90 degree turns, I will send a screenshot too: you see how the first banking starts for the turn, then the second banking connects with the extra turn smoothly and so nice"

**Measured by me from the read** (one run; `scratchpad/t180/sturn.js <read> 340 720 16 20100 20440 16`: heading from each station's forward vector, bank from its normal; stations every 4 m; coarse, and the heading comes in steps of the mesh's own faces):

| stretch (m from the start line) | turning | bank |
|---|---|---|
| 372 to 452, about 80 m | none: straight | ramps from about 5 to 22 degrees, INTO the coming turn, before any turning |
| 452 to 516, about 64 m | about 78 degrees one way | peaks about 27 mid-turn, down to about 9 by the turn's end |
| 516 to 564, about 48 m | none: straight | goes THROUGH level (0 at about 532) to about 20 the other way; no stretch is held level |
| 564 to 596, about 32 m | about 67 degrees the other way | peaks about 26 |
| 596 to 700, about 100 m | none: straight | eases from about 25 back to level |

- Width 32 to 34 m throughout. The road drops about 9 m through the first turn and is near flat after.
- The last two turns of the lap (about 20,100 to 20,440 m) are the same shape with the hands swapped: about 110 m of bank ramp on the straight (6 to 25 degrees), a turn of about 90, the bank through level at about 20,280 with no hold, about 26 the other way through a turn of about 85, then eased out.
- **Against his words of 11-10 above** ("the banking levels out before banking into the next one, effectively being 4 banking changes"): by this read the bank does not hold level between the two turns; it passes through level on a short straight. So the shape is three bank moves, not four: in (on the straight, early), across (between the turns), out (after). The two records stand side by side; the read is one instrument at 4 m.
- **What the shape asks of the builder, as I read it (not checked against the code):** (1) the bank may START on straight road, about 80 m before the turn it belongs to (this file's 'Open, his calls': quick banks on a straight are refused today); (2) the bank crosses from one side to the other in about 50 m, without a level hold; (3) the second turn begins while the bank is already most of the way over; (4) the bank eases out over about 100 m of straight after.

**Sent, one pane, no code landed:** build this shape headless through the core from the numbers above, read heading and bank along the BUILT road, set the two profiles side by side, and name every refusal or smoothing that stands between them; then a render of the built attempt beside his screenshot's view for his eye.

## Added 2026-11-24 01:0x (D, the librarian): the four tracks he names as the look to learn, measured together

**His words, 00:54:** "if you want a refresher for how I want the tracks to look from the system we make, look at [reference track A], [a second], and even [reference track C], and [a fourth], all of those have the design philosophy we need to learn to adopt" (four other creators' tracks; names kept out as above; all four have reads on D in `Desktop/t180-track-builder/reads/`, 2026-09-28).

**Measured by me, one run** (`scratchpad/t180/style.js` over the four reads; aggregates only, no layout). A turn is a run tighter than a 143 m radius adding up to 30 degrees or more, on road flatter than 35 degrees of pitch; turn rate is taken over about 32 m. Rows are the four tracks in the order he named them:

| | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| lap, km | 20.7 | 31.0 | 34.4 | 21.0 |
| width, m (median; 5th to 95th) | 33; 32-38 | 29; 28-33 | 31; 28-36 | 32; 31-36 |
| share of the lap banked over 5 / 20 / 45 degrees, % | 81 / 46 / 2 | 80 / 55 / 10 | 95 / 82 / 22 | 93 / 70 / 15 |
| turns counted | 60 | 92 | 119 | 66 |
| turn radius, m (median; tightest tenth) | 51; 42 | 52; 41 | 49; 42 | 49; 41 |
| turns that lean into the turn, % | 98 | 93 | 97 | 98 |
| peak bank in a turn, degrees (median; 90th) | 29; 40 | 33; 50 | 40; 43 | 36; 55 |
| **bank already on when the turning starts, degrees (median)** | **23** | **27** | **34** | **32** |
| **lead-in: metres of bank before the turn (median; 75th)** | **72; 140** | **64; 140** | **72; 152** | **88; 184** |
| ease-out: metres of bank after the turn (median; 75th) | 56; 136 | 48; 100 | 72; 160 | 84; 144 |
| bank change, degrees per 10 m (median; 90th; 99th) | 0.9; 3.1; 6.1 | 1.5; 4.7; 8.7 | 0.7; 3.9; 11.3 | 1.1; 4.6; 13.2 |
| S pairs (opposite turns under 150 m apart) | 11 | 17 | 4 | 7 |
| longest level hold between an S pair's turns, m (median) | 4 | 4 | 8 | 4 |
| the bank crossing from 10 one way to 10 the other, m (median) | 40 | 32 | 40 | 36 |

**What the four share, read from the table:**
1. **The bank comes first.** In every one, the road is already banked 23 to 34 degrees (medians) when it starts to turn, and that bank began 64 to 88 m back on straight road. Most of a turn's bank is therefore laid on the straight before it.
2. **Almost nothing is level.** 80 to 95 % of each lap is banked over 5 degrees; level road is the exception, a passing-through.
3. **An S does not stop at level.** Between two opposite turns the longest level hold is one or two stations (4 to 8 m); the bank swings from 10 one way to 10 the other in 32 to 40 m.
4. **The bank moves gently most of the time and fast when it must:** about 1 degree per 10 m typically, 3 to 5 at the 90th percentile, 6 to 13 at the fastest hundredth.
5. **One corner radius.** The median turn is 49 to 52 m in all four and the tightest tenth 41 to 42 m, which reads as a shared kit of corner pieces, not four authors' free choices. Inferred.
6. **Width 28 to 38 m.**

**His own words already say the first one from the builder's side** (`briefs/t180_second_bank.md:51`, 2026-11-07): "for the extra turn the banking cant catch up in time, as if it needs to start eating into the original banking to smoothen the transition". In the four tracks the bank is never asked to catch up, because it starts before the turn.

**Caveats:** one instrument, stations every 4 m; the heading is read from the map direction and is not trusted on road steeper than 35 degrees, so wall turns and loops are left out of the turn count; 'lead-in' stops at the previous turn, so it is a floor where turns come close together.

## Added 2026-11-24 01:2x (D, the librarian): pane O's attempt, and two corrections to my measurements above

Hand-back: `handback/p-dbl90-O_2026-11-24.md` (git-blob 306586c4, read whole by me), with 14 renders; three looked at by me. His page: https://claude.ai/artifact/VUx18bkmRYNi6T5KyEyZ9C

- **Correction 1, pane O's, to the five-stretch table of 00:5x:** my heading came from the reader's forward vector, which is faceted in 8 degree steps. Read from the centre POSITIONS: the first turn is about 85 degrees (not 78), the second about 80 (not 67), the straight between them about 30 m (not 48), the second turn about 56 m long (not 32). The bank figures stand. The bank runs in ONE move from 27 one way to 26 the other over about 90 m, starting at the first turn's peak: two bank moves after the first ramp, not three. O's outside check: built to my numbers the road folds over itself at the second turn; built to the corrected ones it does not.
- **Correction 2, mine, to the four-track table of 01:0x:** the same faceted heading fed its turn rows. Re-run from centre positions (`scratchpad/t180/style2.js`, one run): turns counted 45 / 62 / 48 / 38; **turn radius, median 70 / 73 / 85 / 82 m, tightest tenth 45 / 51 / 41 / 49 m. So point 5 above ('one corner radius', 'a shared kit') is WITHDRAWN: it was the facets.** What holds on the re-run: turns leaning in 98 to 100 %; bank already on when the turning starts 22 / 22 / 30 / 33 degrees (median); lead-in 68 / 44 / 80 / 148 m (median); ease-out 76 / 60 / 88 / 136 m; the S pair's longest level hold 4 / 4 / 8 / 8 m; the bank crossing 10 to 10 degrees in 40 / 32 / 40 / 40 m. Points 1 to 4 and 6 stand.
- **O's finding, in one line:** the core lays the shape as ONE piece within about 3 degrees of the read, with no red from the builder's own checker, once the as-built bank check is skipped (`src/core/extend.js` `bankAsBuilt` :775); as five pieces a user can lay it today; as one piece today every bank change after the first is refused, so the second turn leans out.
- **And against this file's 'Open, his calls':** a bank on a straight did NOT block this shape; the 122 m ramp lays. The 11-05 refusal is of a same-way quick change at a straight's end.
- **What O names as the smallest change (not built), each needing his word:** (A) the as-built check judges a change by its own effect and by 'reached and smooth' (never leaving the range between its start and its target), where it now demands the built bank match the typed one within 0.5 degrees over 250 m: this relaxes his 11-10 rule; (B) the panel carries two extras per field, moving his 11-05 limit of one; plus two small panel rules (a turn of 0 may carry extra turns; a trailing extra of 0 means straight from here) and a refusal text that names a mark no one can set (`extend.js` :798).
- **Put to him 01:2x; my lean yes to A and B.**

## Added 2026-11-24 01:1x (D, the librarian): his eye on the page: not good enough, and why he is right

**His words, 01:10:** "did you even look at the artifact pics? all the ones you made are bad, like the closest one is \"close\" but i think the scaling for the turn isnt big enough for how big [reference track A] does it, also look at how smooth the banking changes on [reference track A], compared to ours on the artifact, there are bumps, whereas on [reference track A] the car can smoothly flow without ramping. Today five pieces one is even worse, one piece as the builder lays it now doesnt even second bank"

- **Mine:** I looked at three renders and passed them for having the shape's parts (banked in, across, banked out). I did not set them beside his picture and ask whether they look like it. And I passed on pane O's 'within about 3 degrees at every stretch mark' without reading it against O's own table, which is in the same file: at the end of the stretch between the turns the read has the bank at about 12 degrees over and every built attempt has it at 20 or 21. That is 9 degrees off, at the place he is pointing.
- **The bumps, from O's table (`handback/p-dbl90-O_2026-11-24.md` section 2):** between the turns the real road rolls about 20 degrees in 30 m (about 0.67 degrees per metre); the built ones roll 28 degrees in the same 30 m (about 0.93), and the builder's own checker marks 1.04 to 1.22 there. The real road spreads its crossing over about 90 m, from the first turn's peak to inside the second turn; ours packs it into the gap.
- **The scale: NOT checked.** No plan view of the real road has been laid over a built one at one scale.
- **The pictures are not the builder's road.** O's renders draw a flat 33 m ribbon from the path; the real road in his picture is cupped, with raised kerbs, and the builder's own export has a cup too. So the renders cannot show how the built road would look or drive.
- **Sent:** one lap to pane O: lay the real and built roads over each other from above at one scale; plot bank against distance for both on one chart, with the roll rate; fit the one piece to the real bank CURVE every 4 m (not to five marks) and state the largest gap; render with the builder's real road mesh.
