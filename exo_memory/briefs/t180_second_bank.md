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

## The problem, in one line
A piece makes one change per field, so ending a banked turn level (or steeper) takes an extra flattening piece, and an S takes several
pieces. He wants one piece to change a second time toward its end.

## State — updated 2026-11-05 19:1x (D), tonight's handoff: `loop/handoff_t180_2026-11-05-D.md`
- **The model, at his 19:54Z ruling:** the extra change ADDS on top of the piece's own change; extra 0 = no change (byte-equal). Built: B d642-b, panel C d642-c3.
- **Merged tip:** t180 `d642-p` a924f1b, pushed as the one-commit branch `second-change-additive` 5d17a9c (same tree). E's review: GREEN, mutants all caught. Timing: no regression (B §6).
- **Installed on D:** 923e0a3 (sha256 6f787b5a…), for his feel test. It lays his S bank-back to −88.45 from 500.
- **Do not install a924f1b yet:** its bank minimum refuses that same bank-back (holds it at −37.53°; E §5). B is making the minimum tight.
- **19:2x:** B's tight minimum is d642-b3 d87ba99; his p2 bank-back lays again (needs 463 m, has 500). E: the fix is right, but dragging the extra bank costs 106 ms a move (17x the flat drag), because the panel runs about 13 probe searches a move (`handback/p-d642-b3-review-E_2026-11-05.md` §2). B (memo) and C (panel folding) are cutting it to one probe a move. Install waits for that.
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
