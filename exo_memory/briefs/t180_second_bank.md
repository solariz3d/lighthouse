# Brief: T-180, the second bank (and the second change for every field)

## His words (verbatim, never summarized; newest last)
- 2026-11-03 00:43Z (D), with the picture `t180_second_bank_sketch_2026-11-02.jpeg` beside this file: "I HAD AN EPIPHANY FOR TRACK BUILDER, A
  SECOND BANKING FUNCTION THAT IN ONE PIECE CAN BANK A TURN EITHER EVEN MORE OR BACK TO LEVEL: … look where the red marks are for where they
  should be, but you get what I mean right, there is the normal banking but then an extra function that bends the banking again towards the
  end of it."
  - The picture: a 750 m piece, turn 270°, climb −6°, bank −28.47° early, cup 15° early, width 30, after a 1,000 m straight. The red marks
    sit near the piece's end.
- 2026-11-03 12:30Z (D), from the librarian's 06:30 note: the idea widened to a second change toward a piece's end for EVERY field (bank,
  length, width, climb, turn, cup), unlocked once the first is set.
- 2026-11-03 12:38Z (D): "this will also fix the problem where if you wanted to make a snaking turn into another turn, it would be janky
  only being able to make one curve at a time, now with a lengthy piece, you can turn it once, and then expand it and turn it again to make
  a more fluid set of turns as one piece"
- 2026-11-04 (L): "so once you do banking once, there is another mark towards the end you can bank again that can let the end of the piece
  bank more in one direction or back to level in one piece, instead of having to place it, then flatten it with the next piece"
- 2026-11-05 06:34Z (L), asked whether to release 0.4.39 first: "We could just build the second move feature before. Remember its more than just the banking, its the turns, climb, etc."
- 2026-11-05 06:37Z (L), a second picture, saved beside this file as `t180_second_bank_red_marks_2026-11-05.png`. His file name is his words: "after using the first banking look where red marks are it unlocks the ability to then say keep banking it or level it all in one piece". The piece in it: turn −90° as a corner (ends straight), bank +66.14°, cup 15.5. The red marks sit across the road near the piece's end, where the second change starts.
- 2026-11-05 06:41Z (L), on the picture: "but then imagine the same for the turn and climb, even the cupping, etc"
- 2026-11-05 06:43Z (L), on one mark or one per field: "this is the difficult part design wise, say if you are making a multi banked turn where you also want to change the turn twice even the climb twice, each one needs to carry the same color of the original move, but it has be like around somewhere on the piece that makes sense"
- 2026-11-05 06:49Z (L): "but see the reason I want the turn and climb is the same reason, what if i want the climb to change more than once per piece, the same with turns? With turns you can create multiple snaking curves with one piece, the same with the climb if you are inverted or upside down."
- 2026-11-05 06:53Z (L): "but that would mean you could do more than two movements, maybe they keep getting placed the more you place down, because if you look at what happens to the drag locations when you keep making the piece longer, they get like inflated in between each other, meaning more and more room keeps getting made inbetween, giving room for the next drag icon to show itself to allow the next manipulation"
- 2026-11-05 07:00Z (L), on whether to raise the bank minimum so a second bank cannot bump: "why is that even a question, we dont want the bumps, we want the transmutations to be smooth all around the board"
- 2026-11-05 10:06Z (L), after driving the L139 build (35feaf9): "also the test, i swear it is broken and doesnt work in the way i want, it is glitchy and non intuitive here is a screenshot of a turn i tried to make, TEST BANKING". He then said: "there was no screen shot i meant look at the track itself through the save". His save is `AppData\Roaming\com.solariz3d.t180-track-builder\tracks\eq-TEST BANKING.t180track` (4,688 B, 04:00:39).
- 2026-11-05 10:15Z (L), on the L139 build's UI: "also the UI design isnt there and is confusing, that is what is the worst part. when you drag turn, it is in the front of the piece, so after the first turn, it adds something called extra turn, and its like the same ui as the first grab turn, just added below it or around it in a way to be intuitive"
- 2026-11-05 11:10Z (L), on the before/after page (L139 as driven vs L140 Part 1): "thanks for showing me how off you are, the road I drove is better in the way that it flows more how i want, but how it got there was lucky from how unfunctional the UI is."
- 2026-11-05 11:43Z (L), drawing on the page's sketch, saved as `t180_extra_handles_where_2026-11-05.png`. His file name: "look for my drawn on lines to indicate the corresponsing color of the type of movement move everything to where i drew". In chat: "look for where my drawing of lines are indicating where I want you to move each drag zone for the second one, you see how i want it". Read from the drawing, with the road from 0 at the start to 1 at the front: every extra handle sits ON the road, on its own field's line, just ahead of its base handle. Extra bank on the edge at ~0.60 (bank 0.50); extra climb on the centre line at ~0.74 (climb 0.50); extra turn on the edge at ~0.89 (turn at the front); extra width on the edge at ~0.11 (width at the start). Not outside the edge.
- 2026-11-05 12:15Z (L), on round 2 of the extra-handle renders: "the artifact looks good to me, but now its time for me to try it"
- 2026-11-05 13:29Z (L), trying the L140 build (c42f985), with two pictures saved beside this file: `t180_extra_turn_before_2026-11-05.png` (his file name: "90 degree turn before doing the second turn") and `t180_extra_turn_after_2026-11-05.png` ("adding second turn morphs the turn to sharper 90 degrees, and only changes the second curve up to the second turn where i marked red"). In chat: "i first tried to add a piece that does a simple S turn as one piece, it doesnt work right, and every time you click turn it auto adds another turn too close to the new one added, it needs to auto move to make room so they do not overlap … the second turn only engages for the marked red area and not the rest of the turn which should ease half way through, and every subsequent click adds another one, perhaps we should only do two per action on the piece you know? Until we figure out how to make it work right"
- 2026-11-05 13:43Z (L): "but yes, i dont have time to extensively test the newest build, so push it all to the repo anyway just no release yet, need to test it more at home after"

- 2026-11-05 15:09Z (D), trying round 2 (d91227f) at home, with a picture saved beside this file as `t180_extra_bank_bug_2026-11-05.png` (his file name: "banking bug"): "the extra turn works, but the extra banking breaks will send screen shot and save the track for u to see". The picture is of the piece being laid, not yet placed: the HUD reads length 2040.48 m, turn +90.00° (corner, ends straight), bank **−294.70°**, cup 15.5, width 31, bank to gravity 0.00° → +65.30°. The road rolls past a full turn and folds over itself near the front. His save `eq-banking bug.t180track` (1,532 B, 09:09:06) holds only the placed 1,000 m straight p1; the broken piece was the unplaced next one, so the HUD numbers are the repro.

- 2026-11-05 19:54Z (D), trying d641-c df62d6f, with three pictures saved beside this file. His words: "its still not what I want, there is one bug first, so here is a basic 1km turn 90 degrees by itself: [picture 1] now look what happens to it when I try the second turn even a little bit, even turnin it to 0: [pictures 2, 3] The first part of the turn bankes correctly, but then for the second 180 section i cant even add extra banking back to the other way it is inverted".
  - Picture 1, `t180_extra_turn_alone_2026-11-05.png` (his file name: "by itself no extra turn"): 1,000 m, turn -90, no extra. He drew a red line: a wide loop that keeps sweeping round past the piece end and back toward the start.
  - Picture 2, `t180_extra_turn_reshapes_2026-11-05.png` ("it makes it more sharp and takes the original shape away"): the same piece with extra turn 0 from 500. The first corner is squeezed into the first half and the second half runs straight.
  - Picture 3, `t180_extra_bank_inverted_2026-11-05.png` ("then besides that bug i wanted to see if the extra banking at least worked it didnt for the turn i wanted and you can see that in the testturn2 save what is wrong with the banking"): the save `eq-turntest2.t180track` (13:53:41 local). p2 is 1,000 m: -90 corner, then an extra +180 from 500 (net +90), bank +88.45 rising linearly over the whole piece. The checker shows red: the car leaves the road at 1550-1960 m.
- 2026-11-06 07:37Z (L), on the fb5b91c renders (his S with the bank-back): "i think that artifact looks good, continue to finish the rest and then update current build on the shortcut when done"
- 2026-11-06 07:46Z (L), "testurn1", with three new pictures (t180_testurn1_a/b/c_2026-11-06.png; his file names: "1000m straight into a 1000m right 90 degree with no extra turn function", "1000m turn after the second turn moves the turn before any real value changes its still 90 degrees but tighter", "The second turn only goes as far as the red lines and where the second turn purple goes"): "Two bugs in one, the first bug is adding the extra turn onto one piece makes the turn tighter without even adding a new value as can see from the first two pics, adding a second turn shouldnt make the original turn tighter, the second bug is that the extra turn only fits within the picture where i drew those red lines, it goes as far as the location of the second turn drag purple, you see?" Librarian, checked: these were taken at 01:41-01:44 on the OLD round-1 build (c42f985). It was installed and running (pid 21124) from C's rollback at ~01:40 until he closed it; fb5b91c went back in after.
- 2026-11-06 08:28Z (L), on a523589 (installed 08:08Z), with two pictures plus a third he took at 08:07Z but didn't attach: "I managed to make it work but it is glitchy. Also: [picture 1] from another track, this one is testturn1, first pic is testturn2. testturn 1 image shows that the extra turn needs to start earlier in the piece where the green mark is labelled."
  - Picture 1, `t180_testturn2_ramp_2026-11-06.png` (his file name: "the banking might work but look where red circle is it is like a subtle ramp"): save `t180_saves_2026-11-06/eq-testturn2.t180track` (08:26Z). p2 is a 1,000 m S with bank 0 → +50° → −80°; p3 is a straight 405.66 m that banks back from −80° to 0 over about 225 m. The red circle is where the road comes back from 80°.
  - Picture 2, `t180_testturn1_start_2026-11-06.png` (his file name: "turn starts after the red line but should start half way through"; taken 08:02Z, on fb5b91c, which builds the same road as a523589): the ghost of a 1,000 m +90° corner with an extra turn. His red line is drawn through the handle cluster, and the extra turn's bend begins after it. Not saved. His message points at "where the green mark is labelled", and the only green on the picture is at the piece start; his file name says "half way". Both mean earlier than now.
  - Picture 3, `t180_testbank2_order_2026-11-06.png` (his file name: "extra banking needs to be done a certain way you have to do the banking on the first turn before adding the extra turn"): save `t180_saves_2026-11-06/eq-testbank2.t180track`. The extra bank only worked when the first bank was set BEFORE the extra turn was added.
- 2026-11-06 08:47Z (L), on the L142 page (https://claude.ai/artifact/EknNj2pTybBRuAkh8dMVcf v2, with E rulings: the ramp is geometry and its lateness is the parked L136 first-ramp issue; the late start works as designed; the order bug is not reproduced): "if it works it works". Read as: leave all three as they are. No L136 reopen, the extra turn stays at the 0.5 start with the same swell, and no build.
- 2026-11-06 08:55Z (L): "ready", answering the list (land on main, shortcut back to the rebuilder, release 0.4.39). L144.
- 2026-11-06 09:03Z (L), asked "release now with the 2.48x drag-speed row failing and named in the notes, or fix the speed first": "yes its good". Read as: release now, with the row kept red and named as a known issue (not skipped or loosened).
- 2026-11-06 10:28Z (L): "after all is done, write the handoff for the track builder repo, and lighthouse, ending tonights work to simply chill, almost out of our weekly limit till 4pm this afternoon so its chill we will be back after that"

- 2026-11-06 18:58Z (D), trying 0.4.39 (installed sha256 3d1a971e..., the release asset): "the turn from needs to be placed on the actual purple line and not on the turn part for the extra turn. i mean where you click to drag the length of the extra turn or where it kicks in u know"
- 2026-11-07 05:24Z (D), on the D644 page (the extra turn grab on the purple line), after "see u later": "wait yes do it and put it as newest build but not released ,will be testing it at work". Read as: build D644; land it on t180 main with no tag and no release, so the rebuilder on L builds it at his next click at work.
- 2026-11-07 08:17Z (L), trying fc3cc63 (D644, the extra-turn grab on the purple line), with one picture saved beside this file as `t180_extra_turn_bank_catchup_2026-11-07.png` (his file name: "extra turn leading into extra banking needs to take more from the original banking to smoothen out") and two saves in `t180_saves_2026-11-07/`. His words: "have good news and bad news, I figured out how to make a smooth banked 90 degree turn and then it unbanks back to level, check banking turn into unbanking save. Then there is extra turn into banking error, it works, bit its almost like, when you add both an extra turn with the extra banking, for the extra turn the banking cant catch up in time, as if it needs to start eating into the original banking to smoothen the transition, if you look at the pic maybe u can see"
  - The good save `eq-banking turn into unbanki.t180track` (sha256 eff48ade…): p1 a 1,000 m straight; p2 a 1,000 m −90° corner whose bank rises from 0 to about 0.47 rad (27°) near mid-piece and comes back to about 0 at the end.
  - The error save `eq-extra turn with banking error.t180track` (sha256 f84e4d73…) holds only the placed 1,000 m straight p1; the broken piece is the unplaced ghost in the picture, as with the 11-05 banking-bug save. The picture's HUD is the repro: length 1000.00 m, turn +90.00° (corner, ends straight), climb 0, bank −34.78°, cup 15.5, edge 0, edge start 0.64, tube 0, bank to gravity 0.00° → −34.78°. Free view, drawn round in red: the whole piece, an S whose second bend is the long one.
- 2026-11-07 08:3xZ (L), during L150, on how he made the good save: "also, the correct sequence for the banked turn, is you make the turn, then the banking, then the extra banking to straighten it". Read: the order is turn, then the first bank, then the extra bank. This is the step list the 11-06 testbank2 order finding was waiting on (not reproduced then by type, drag or the real page).
- 2026-11-07 11:35Z (L), driving the test build l153-test dabf7bf (way 1 + the mirror refusal message; installed 05:20 local, not released), with one picture saved beside this file as `t180_extra_bank_length_drag_ui_2026-11-07.png` (his file name: "THE extra banking length drag needs to be more understood wtf it is doing i figured it out but i bet new users will hate it"). His words: "it works, and is good, the only problem is UI: TEST TURN AND BANKING". The picture: a 1,000 m piece, HUD turn +90, bank −50, an S; red arrows drawn left and right beside the upper blue bank handle pair, and red arrows drawn along the road both ways from a blue tick mark on the road past the yellow handle (read: the extra bank's from mark, which sets where its roll starts and so how long it is).
- 2026-11-07 11:37Z (L), on the L154 mock page (https://claude.ai/artifact/DJuUpGT155EpNHm7RLq4iW), answering what his red arrows beside the upper blue bank handles meant: "yes i drew the red arrows, when you move the mouse right and left when clicking the point i marked, it drags the other point up and down the track, defintelly needs labels". Read: grabbing that bank handle and moving the mouse sideways slides the OTHER point (the extra bank's start tick) along the road, and nothing says so.
- 2026-11-10 13:56 (D), testing 0.4.40, through the librarian (`librarian/2026-11-10.md`, its third entry): "making a short turn, say a 90 degree, you cannot then add the extra turn to bend it 45 degrees ahead to then make a straight, it doesnt let you go past 2.64ish degrees". His screenshot's name: "a short 125m turn cannot add an extra turn beyond around 3 degrees it should be free to continue bending even on a shorter section which it doesnt". His track: `eq-extra turn bug.t180track` (a 1,000 m straight and the 125 m −90° piece), copied into t180 as `test/fixtures/extra-turn-short-2026-11-10.t180track`.
- 2026-11-10 15:42 (D), through the librarian (`librarian/2026-11-10.md`, 15:43): "hmmm now the same thing happens when I want to bank the turn that u fixed, it jumps to -5 degrees and then stops"; and: "its the extra banking btw". His track: `eq-bankingbug1.t180track` (a 1,000 m straight and 125 m: turn −90°, extra turn +90° from 62.5 m, bank 0.13°, extra bank −5.49° from 47.5 m), copied into t180 as `test/fixtures/extra-bank-short-2026-11-10.t180track`.

## The problem, in one line
A piece makes one change per field, so ending a banked turn level (or steeper) takes an extra flattening piece, and an S takes several
pieces. He wants one piece to change a second time toward its end.

## State — updated 2026-11-10 17:4x (D), by the librarian: D649 and D650 are LANDED on t180 main `3b33b38` and installed on D; not released
- t180 main: `313b95a` (D649, the extra turn and climb), then `33c54aa` and `3b33b38` (D650, the extra bank, width, cup and edges, and its mirror amendment). Version still 0.4.40; no tag. Held for the next release batch.
- Installed on D 17:34: exe sha256 98493084c133c785…, 15,895,040 B; backup `t180-track-builder.exe.before-d650-313b95a`. **L has none of this until it is built from main there.**
- Landing run (P): test-fast tests 3569, pass 3551, fail 0, todo 2, skipped 16; ramp harness 106 of 106; turnby harness 22 of 22. Hand-backs: `handback/p-d649-land-P_2026-11-10.md`, `handback/p-d650-land-P_2026-11-10.md` (the stop on two mirror-refusal rows), `handback/p-d650-mirror-amend-A_2026-11-10.md`, `handback/p-d650m-land-P_2026-11-10.md`.
- His pictures for the two reports: `t180_extra_turn_held_2026-11-10.png` (13:56) and `t180_extra_bank_held_2026-11-10.png` (15:42).
- NOT yet seen by him: the extra turn dragging to 45° on his 125 m piece, the extra bank past −5°, and the held drag's reason label.
- Open: the slow drag into the hold (D650, below); the held box sits under the camera bar's grid label; the comfort length lays 78 and 79 m for −5° though the built road misses its hold by about 1° (A's finding); on a straight road a same-way quick bank is still refused (his call, see `t180_banked_s_and_wall_hairpin.md`).
- Next: `briefs/t180_banked_s_and_wall_hairpin.md`.

## State — updated 2026-11-10 (D), D650, pane A: t180 branch `extra-change-free` at e5b3cd0 on 313b95a, not pushed, not landed
- An extra bank, width, cup or edge change is refused only where the road as built cannot carry it: the width under 40 m, the cup and edges under 26 m (each, or its old comfort length where shorter), the bank under 26 m or where this piece's built bank (the adapter's rounding) leaves the hold or the target by over 0.5°. A change the comfort length passed is laid as before.
- On his piece the extra bank goes to −20°, −45° and −90° from 47.5 m. Two things free it there: the piece turns (the builder keeps a turning road's bank) and his extra bank goes back the other way from his first 0.13° (the builder pins the bank's turn). At a straight road's end, a short change on the same way is still refused, with its reason.
- The held drag's reason, drawn in a real page: `t180_extra_bank_held_reason_2026-11-10.png`.
- Open: a drag of the extra bank past its comfort length now lays the piece each move (24-29 ms p95 a move on his 1,000 m p2 against 6-9 before).
- Hand-back: `handback/p-d650-extra-change-A_2026-11-10.md`.

## State — updated 2026-11-10 (D), D649, pane A: t180 branch `extra-corner-free` on b977eeb, not pushed, not landed
- An extra turn or climb (the corner lists) is now refused only below the knot floor (21 m on the bowl), as the first corner laid over that span would be; the comfort bar no longer holds it. On his 125 m piece −90° with an extra −45° or +45° from 62.5 m is laid, exact, and ends straight. Bank, width, cup and edge changes keep their bars.
- A drag held at the edge of what fits says why, in the handle's box. A preview refusal no longer outlives the next preview (the BAD_LENGTH line in his screenshot).
- Hand-back: `handback/p-d649-extra-corner-A_2026-11-10.md`.

## State — updated 2026-11-06 23:1x (D), tonight's handoff: `loop/handoff_t180_2026-11-06-D.md`
- **Released:** 0.4.39 = origin main = tag v0.4.39 = f2884fa (L, overnight). Installed on D from the release asset, sha256 3d1a971e… (same as L). Backup `t180-track-builder.exe.before-d643-064ecd5`. The shortcut targets the exe.
- **D643, the two forks compared (E, `handback/p-d643-forks-E_2026-11-06.md`):** L's f2884fa and D's 376ddc2 (d603090 + the row-9 median of three, local, not pushed) build the same road: 5 roads and 4,248 core answers have identical sha256. The only speed difference is the into-the-hold drag, where D is 10% faster (p95 9.10 against 10.05 ms). Page: https://claude.ai/artifact/69MBZZBwMr9Fz9PRkxwcZ2. After his "are u sure", the call is: stay on 0.4.39 and fold D's probe into the next feature batch. The A/B exe of 376ddc2 is built, not installed (P, `handback/p-d643-install-ab-P_2026-11-06.md`).
- **D644, his 18:58Z word (the extra turn's grab on the purple line):** renders only, nothing built (C, line below). Page: https://claude.ai/artifact/6BMn9w6QDCE64EPd4ByvSy. **His yes, 05:24Z 11-07: build it, put it on main as the newest build, no release.** C builds on f2884fa (red rows first), E reviews, P runs the touched set, pushes main (no tag, no release), and installs on D. **LANDED 05:4xZ 11-07: t180 main = fc3cc63 (no tag, no release); E GREEN; for his eye, the unused grab stands mid-piece before any extra turn exists (`loop/handoff_t180_2026-11-06-D.md`, end).**
- **2026-11-07 05:5x (C), D644 built:** t180 `fa2efef` on f2884fa, branch `d644-c` in `worktrees/t180-d644-c2`, not pushed, not installed. The extra turn grab stands on its purple from mark; the bank and climb step back by clearExtras. The red row was red on f2884fa and is green now. The touched set (55 files): 874 pass, 1 fail, the D642 drag-cost timing row, which is over 2 × on f2884fa too (5 of 6 interleaved). The 8 built views match the mock-up exactly (tightest 36.3 px). The diff hash is the one E reviewed green. For his eye (E): the unused grab already stands mid-piece before any extra turn is made. `handback/p-d644-build-C_2026-11-07.md`.

## State — updated 2026-11-05 19:1x (D), the handoff then: `loop/handoff_t180_2026-11-05-D.md`
- **2026-11-06 19:2x (C), D644, his 18:58Z word, renders only, nothing built:** on 0.4.39 the extra turn handle (the grab whose along-drag slides where the extra turn kicks in) stands at 0.89 by the turn handle; the purple from mark is at 500 on the bank/climb handles. Moved onto the mark alone it lands ON the bank handle (0 px); with bank and climb stepping back by the clearExtras rule it clears ≥36.3 px in all 8 views rendered (half piece 220-378 px). Renders + table: `handback/p-d644-from-grab-renders-C_2026-11-06.md`. Waiting on his look.
- **The model, at his 19:54Z ruling:** the extra change ADDS on top of the piece's own change; extra 0 = no change (byte-equal). Built: B d642-b, panel C d642-c3.
- **Merged tip:** t180 `d642-p` a924f1b, pushed as the one-commit branch `second-change-additive` 5d17a9c (same tree). E's review: GREEN, mutants all caught. Timing: no regression (B §6).
- **Installed on D:** 923e0a3 (sha256 6f787b5a…), for his feel test. It lays his S bank-back to −88.45 from 500.
- **Do not install a924f1b yet:** its bank minimum refuses that same bank-back (holds it at −37.53°; E §5). B is making the minimum tight.
- **19:2x:** B's tight minimum is d642-b3 d87ba99; his p2 bank-back lays again (needs 463 m, has 500). E: the fix is right, but dragging the extra bank costs 106 ms a move (17x the flat drag), because the panel runs about 13 probe searches a move (`handback/p-d642-b3-review-E_2026-11-05.md` §2). B (memo) and C (panel folding) are cutting it to one probe a move. Install waits for that.
- **20:2x:** the drag cost is fixed on d642-c4 212e78d (the extra-bank drag runs 1.6-1.9x a plain drag; it still reaches -88.45). E found two more things (`handback/p-d642-c4-review-E_2026-11-05.md`): (1) sliding the extra bank's mark a metre off 500 can make the piece vanish (15 of 121 positions on his p2; already in d87ba99); B makes the shortest monotone. (2) A drag carried past what fits runs about 2.5-3x; C makes the hold reuse its edge. Install waits for both.
- **21:0x:** the vanishing piece is fixed on d642-c5 57cf0a0 (the probe bar raised to 1.0, plus a panel walk that skips any mark that would spike; 0 refused across 420-540 on his p2). Cause, B section 9: the extra bank starting while the first bank still rises makes two turning points about 10 m apart, and the bank rounding spikes there (up to 2.15x). So his bank-shape call (turn back cleanly at the mark?) now also removes that cause. E: one shortcut past the ceiling still lays a 1.059x spike on his picture; B fixes it next, then install. The mark slide runs about 2.1x a plain drag (interim, queued with the probe-cost lap).
- **21:3x, INSTALLED on D for his test:** t180 d642-b7 064ecd5 (installed sha256 6c265ca3...), pushed as second-change-additive fb5b91c (tree equals 064ecd5). E GREEN on correctness: no kept span over 1.05 in six cases. Known: the bank-back drag is 3.1-3.5x a plain drag (p95 about 13 ms) because every span is now probed. B's probe-cost lap is running (bankPlan work kept across probes, plus the window cache).
- **His call:** the bank's rise past the mark (44→47°) and overshoot near the end (−91°), page https://claude.ai/artifact/7k2BGKPX45vMBdYy5733zH.
- Also includes the 0.4.39 preview fix (`briefs/t180_joint_bumps.md`).

## State (summary; check it against the repo) — updated 2026-11-05 07:4x, the handoff at his word
**Where it stands, in one paragraph.** The core of "one piece changes again toward its end" works for every field. The second-change SHAPE
he likes is L139's (`35feaf9`): it flows. What fought him was the UI. L140 replaces the L139 faint rings with **extra handles**: the same
look as the field's own handle, placed where he drew them (`briefs/t180_extra_handles_where_2026-11-05.png`). Round 1 (`c42f985`) is
installed on L, and he tried it. Round 2 fixes what he found (two per field, the extra change starting halfway, no overlapping handles).
It is rendered and waiting for his look before the install.

**The branch chain (t180, none on main, no release):**
- `l135-second-bank` `0df08db`: the bank only (on origin).
- `l139-second-change` `35feaf9`: any number of changes on every field, smooth all around. **The shape he likes.** The branch tip is
  `e20f865`, L140 Part 1, PARKED: its "first change holds, marks toward the end" changed the flow he liked (his 11:10Z words). Don't land it.
- `l140-extra-handles`, off `35feaf9`:
  - `c42f985`: round 1, the extra handles plus fixes for B's G1–G10 glitches. **Installed on L** (exe sha256 af3b5a90…). E: G1–G10
    green.
  - Round 2: one extra handle per field, the extra change starting at 0.5 by default (the handle stays where he drew it, and a mark shows
    the start), `clearExtras` keeping every extra handle ≥ 36 px from the others. Rows R1–R3 went red on c42f985, then green (38/38).
    Committed at the handoff as `d91227f` (its touched test set not re-run yet). NOT installed.
- Renders shown to him: https://claude.ai/artifact/CgeimWxjovDpXKNnzGeiPR (v3 = round 2, his S as one piece).
- D641, his 15:09Z "the extra banking breaks" (2026-11-05, C): `d641-c` `19ef575` off `d91227f`, not installed, not pushed. The extra bank's drag
  had no stop: its handle stands where its own change has hardly rolled the road, so the axis never turned it away the way the base bank's does; it wound
  through −329°, jumped round, and wound on. His −294.70 was a point on that wind. It now holds at one turn (±360°, the base bank's range). The road
  at −294.70 is a smooth twist past a full turn, not a broken mesh (no frame jump, no edge running backward). Hand-back:
  `exo_memory/handback/p-d641-extra-bank-C_2026-11-05.md`.
  - Widened at the chair's word, from E's review: `d641-c` head `df62d6f`.
    - The extra width and cup clear the other handles at 1.6×; NOT at 2.4×, a design call (no room on a piece that small on screen).
    - The edges get one later change each.
    - A fast flick holds where it fits.
    - The S snaps exactly straight.
    - A typed bank past a turn shows what is laid.
    - E's "reversal past 180°" was the wrap, which the extra hold fixes.
    - The BASE bank's winding (it stalls about 180° from where it starts in one drag) waits for his ruling.
    - Touched set 63 files, 821/0. Not installed.

**What to do next, in order:**
1. His look at round 2's renders. The open question there: should the turn drag move faster? (+90° is about 1,000 px at 0.083°/px.)
2. C runs the full touched set on round 2 and installs on L (back up first, no launch). He tries it.
3. E reviews round 2 against B's G1–G10 and his three items (brief :29).
4. At his word: land on main, then release 0.4.39 with it, and point his desktop shortcut back at the rebuilder (the installer reset it to
   the exe).

**Still open, not this lap:**
- first ramps (L136: a fast first bank is built late, and the joint design call is his);
- the cup profile's ¾-knot corner (1.6× the bar when a steep narrow cup widens);
- the branch's author on l135 (`zackn@localhost`; re-author on landing).

**How we work now (his rules from these two nights):**
- show him an artifact before a build and renders of the real result before the install;
- when he names the worst part, fix that part;
- smooth all around (every change under the 3 g bar);
- his words and pictures go into this brief in the turn they arrive.

## State at 2026-11-05 03:4x (L139 installed), kept as a trace
- **Every field, any number of changes: BUILT, reviewed GREEN, installed on L for his drive.** t180 branch `l139-second-change` at `35feaf9` (not pushed, not on main). Installed exe sha256 65eb4636…; not launched; built-head.txt still d10eacf.
  - Contract: `changes: { kh|kv|phi|w|c|e|er: [{from,target}] }`; corners `changes.turnDeg/climbDeg: [{from,deg}]`. In the panel, the next change is a faint offer in the field's colour that appears once the piece has room (2× the 20 m floor), and dragging it makes the change. Marks are short strokes in the field's colour; they keep their share of the piece when it lengthens.
  - Smooth all around (his 07:00Z ruling): every change blends by the quintic; minimums: bank 31.5·√Δ°, corners max(21, 31.5·√Δθ°), turn/climb rate max(20, 3|Δκ|/ROUTE_BAR), width ∛-rule, cup/edges a proven bound. His picture and his sketch, laid through the panel, read 0.995× the bar on the built road.
  - Plan `loop/plan_l139_second_change_every_field_2026-11-05.md`; registration `loop/l139_registration_2026-11-05.md`; hand-backs `handback/p-l139-{B,C,E}_2026-11-05.md`. Backups: `AppData\Local\T-180 Backups\` (the L135 build and 0.4.39).
- **Open:** his drive; the release of 0.4.39 with it, at his word; an offer may show, then refuse a big bank change (it reveals at 40 m, but a 30° bank needs 172.5 m), for his drive to judge; the cup profile's ¾-knot corner (1.6× when a steep narrow cup widens); first ramps (L136, bank arrives late; the first rounded ramp reads 1.6× built when early); the branch's author (re-author on landing).

## Earlier state (L135, 2026-11-04), kept as a trace
- **Bank: built.** t180 branch `l135-second-bank` at `0df08db`, on origin and not on main. Installed on L for his drive.
  - Fields: **then bank °** and **from (m)** under bank. The default from is min(85%, length − 15·√Δ°).
  - A second ramp shorter than 15·√Δ° is refused by name.
  - Reviewed GREEN. The full record: `loop/handoff_t180_L_to_D_2026-11-04.md`.
- **Every other field: not built.** It is the next lap on this brief, his 11-03 ask.
- **Open:**
  - his drive of 0df08db;
  - his sketch's second ramp peaks at 2.1× BANK_BAR at the piece-end joint (`loop/l136_registration_2026-11-04.md` M5);
  - whether the second bank should ride Level / Turn by / Turn to grid (it does now);
  - the branch's author is `zackn@localhost` (re-author on landing, his call);
  - L136, the late bank and its joint design call, parked for D.
