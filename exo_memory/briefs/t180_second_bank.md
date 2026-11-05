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

## The problem, in one line
A piece makes one change per field, so ending a banked turn level (or steeper) takes an extra flattening piece, and an S takes several
pieces. He wants one piece to change a second time toward its end.

## State (summary; check it against the repo) — updated 2026-11-05 03:4x, L139 installed on L
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
