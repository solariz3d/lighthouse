# Packet for pane C: the look back, what is left after his test (the border's noise, and a split-second slow-down)

Written by the librarian on D, 2026-11-15, at his words of 06:10. Two faults he reported, both on the look back, both in work
that is landed. One reproduction each, then one fix each. Nothing else is asked.

**SOURCE: what produces this, and what limits it.**
- **His test:** `game/runs/run-20261115-120644.txt` and `.dzr` in his clone (build 48ad21d, seed 1, brutal, 173.90 s, caught by
  the hunter; read by me). Copy both to G:; never run in his clone. At launch it had `light_filter = 3`,
  `light_filter_kernel = 3`, `light_filter_sigma = 4`, `flashlight = 1`, and the four body switches at 0. Whether he flipped a
  key in play is not in the record.
- **What is already measured, yours:** the border with the filter off and on, on a glance staged in a sprint: edges over the
  middle 2.63 and 2.79 off, 1.19 and 1.58 on; the worst edge 21.32 down to 2.42 (`handback/p-b1-lean-C_2026-11-14.md`, the
  scripted glance). Your own line then: the filter clears most of the border, not all. His eye now says the same.
- **What is already fixed, pane B's:** the mouse no longer turns the run while the look back is held
  (`handback/p-d676-lookback-green-B_2026-11-14.md`; main 781515b; `look_back_turns_run`, 0). He still sees a slow-down.
- **What limits it:** a replay shows the simulation and not frame times, and no frame-time figure is taken while a game of
  his runs. So the two halves of the slow-down are read by two instruments.

## His words (verbatim in `briefs/dreamzone2_the_game.md`, item 232)

- "the border noise is mostly gone, but noticed it is still there a perceptible amount when looking back"
- "the look back still does a weird like, slow down glitch for split second"

## 1. The slow-down: find which clock it is on, before any change

- **The simulation:** on his run, at every look back, the player's speed tick by tick from a quarter second before the key
  to half a second after it is let go. Does it dip, and by how much?
- **The picture:** on a look back staged in a sprint (your glance staging), each frame's time across it, beside the frames
  before. Taken with no game of his up; if one is up, taken anyway and labelled so, as a relative reading only.
- **Name which shows a split-second slow-down.** If neither does, say so, and read what else moves at that instant: the
  view's own swing, and the stride and bob that the view keeps time to.
- Then the fix at that cause. If it is in the simulation, his kept runs made before it will replay differently: say which,
  and it lands as the look back's fix did, as the default with the old way behind its switch.

## 2. The border: what is left, and the cheapest thing that removes it

- Which pixels still carry it and for how many frames after the view swings (new at the edge of the screen, or everywhere
  the swing uncovers).
- One fix, with its cost in frame time read on a quiet card.
- A film of his own look back from run 120644, the game today beside the fix, at real speed and three times slower.

## Registered with this packet

- **It failed on his terms if** it is called fixed on a number while his eye still sees a border or a slow-down in the film.
- **Unwelcome, named now:** the slow-down is in neither the simulation's speed nor the frame times. Then it is something the
  view does, and a slowed film of his own look back is what he judges.

## Rules that hold

A game of his running holds nothing but the build of his own Dreamzone copy while a Dreamzone of his runs. Trees and builds
on G:, through the lock's own wait. His words stay out of the game's repository. Pane B lands. One short hand-back.
