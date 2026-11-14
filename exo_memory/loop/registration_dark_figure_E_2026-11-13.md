# Registration: the Dark drawn, in the hunter's shape (pane E, machine D, 2026-11-13, before any code)

Ruling: the chair's D675 item 3 (23:43Z), "THE DARK'S FIGURE IS YOURS NOW ... Tier: PROVE IT. Its own branch off main
... RED FIRST: a self-test row from the STAGE'S OWN COUNT ... THE FIX, as A's design words it: the Dark drawn 'IN THE
HUNTER'S SHAPE', as a figure of its own from the hunter's model ... ONE CAPTURE with the Dark in open view ... Kept runs
replay as before (picture only); show it. ITS LOOK AND NAME STAY HIS; design nothing. C HANDS YOU ITS OVERTIME CAPTURE
SCRIPT, and C READS YOUR DIFF to stage.cpp before it lands."

## The finding being fixed

C's capture on main `b08f25e` (`handback/p-d675-filter-C_2026-11-13.md` section 5): in overtime, 3 poses and 2 figures
drawn.
- `kFigureSlots` has seven entries for eight kinds, so the Dark's is 0 (`game/world/figures.h:28`).
- `place_figures` skips a pose whose kind has no slot (`game/world/stage.cpp:283`).
- Only `Kind::Hunter` takes the model (`:267`).

A's design words (`handback/p-d673-overtime-A_2026-11-13.md:62`, `:64`): "the dark one (`Kind::Dark`, the hunter's
shape ...)"; "one dark creature in the hunter's shape".

Branch `dark-figure-e` off `b08f25e` (on the remote), in a worktree with its build tree on `G:\consonance-scratch`.

## What is built

1. **The instrument, in the red commit:**
   - the stage counts, per kind, the poses it was given and drew nothing for, in the last frame
     (`WorldStage::undrawn()`, beside `figures_drawn()`);
   - it changes nothing drawn.
2. **The red row** (`game/world/selftest_run.cpp`), from the stage's own count:
   - a flee bot's run at level 1 with a 45 s timer, the first of seeds 1 to 12 that is saved in overtime (O's and C's
     method, `offscreen_frame.cpp` `start_timed`), played through the app;
   - the stage drawing every 12th frame from the timer to the save;
   - **"in overtime, every chaser pose has a drawn figure":** passes when, over every overtime frame drawn, the stage's
     undrawn count is 0 for every kind and at least one of those frames had a Dark pose.
   - It fails naming the kinds left undrawn and in how many frames, or "no Dark was posed".
   - Expected red on `b08f25e`: the Dark undrawn in every overtime frame.
3. **The fix:**
   - a second model figure, `dark_`, loaded from the same `hunter.glb` with the hunter's own kit (its material);
   - posed for the first `Kind::Dark` pose by `gait_pose`, as the hunter is, with its own stride phase and the pose's
     own lean, pitch, follow and look;
   - put away when no Dark is out.
   - **Nothing new is designed:** the same mesh, the same material, the same gait. Its look and name stay his.
   - If the model cannot load, the Dark is left undrawn and the row says so. No box is invented for it.

## Additions by name (the chair, 23:51Z), written before the code they touch

**Addition 1: the Dark's cost while it is away.** The Dark is absent for the first ten minutes of every run.
- **One more row,** green on the fix: **"while no Dark is out, the stage neither poses nor draws `dark_`"**, from the
  stage's own counts.
  - The instrument, in the fix: the stage counts the frames in which it posed `dark_` by the gait, and the times it set
    `dark_`'s palette at all (pose or put away).
  - Over the frames before the timer in the overtime row's run: `dark_` is posed in 0 of them, and its palette is set
    at most once (the first put-away). No Dark pose is given in those frames, and `figures_drawn()` never counts it.
  - Red for this row is shown by a hand mutant: `dark_` posed every frame whether a Dark is out or not. It must turn the
    row red.
- **The frame-time read:** the defaults at 2560x1440, base `b08f25e` against the branch tip.
  - It is taken **when the card is free**: no game of his on it, read at each run's start and end.
  - It goes in the hand-back. If the card is not free when the rest is green, the branch lands on the row, and the read
    is **named as owed**.

**Addition 2: a wrong condition corrected** at the second unwelcome outcome (below). Frame-time figures were not closed
by "the other experiments' GPU runs". The only condition is that no game of his is on the card.

## Checks (prove it)

- **Red first:** the row on the red commit (the instrument and the row only) fails as expected; green on the fix.
- **The world self-test, whole,** on the branch: every row as on `b08f25e`, plus this one.
- **Hand mutants, each must turn the row red:**
  - the Dark's pose matched to `Kind::Hunter` instead of `Kind::Dark`;
  - `dark_` never loaded;
  - the undrawn count not incremented for a skipped pose. The control: the row then passes falsely on red, so this
    mutant is run on the red commit and must turn it green there, showing the instrument is what the row reads.
- **Kept runs replay as before (picture only):**
  - the 16 kept runs in his `game/runs/` (copied, never written) replayed with `--replay-run` on `b08f25e` and on the
    branch;
  - each run's printed fingerprints (simulation and chase) must be equal, side by side.
- **One capture for his eye:**
  - C's overtime method, on `G:\consonance-scratch`;
  - the Dark in open view (a frame looking straight at it at a place where no wall stands between, chosen by the
    stage's own ray test, or the nearest frame where it is in view), every frame of a short stretch, lit;
  - each side's commit named (before `b08f25e`, after the branch tip), the exe's own build stamp checked.

## Falsifiers, before the run

1. **The row is wrong** if, on the fix, it passes while the capture's frame looking at the Dark shows no figure where
   its pose stands.
2. **"Picture only" is false** if any of the 16 kept runs prints a different fingerprint on the branch than on
   `b08f25e`.
3. **The instrument is wrong** if, on `b08f25e`, the row's undrawn count is 0 in an overtime frame where the stage was
   given a Dark pose (C's count: 3 poses, 2 figures).

## The unwelcome outcomes, in the words that would make them true

- **"Drawn, and still unseen":** the figure stands where the pose is, but in his view the Dark is a black shape in the
  dark, as the hunter is. Being drawn does not make it visible; that is his look to decide, not mine.
- **"A second hunter costs every frame":** a second skinned model of about 127,000 vertices may cost frame time even
  while put away.
  - ~~Frame-time figures are closed to me while the other experiments' GPU runs hold, so this is not measured here.~~
    **Corrected (the chair, 23:51Z):** that condition was wrong. Those runs ended at 14:09:22
    (`third_place/2026-11-13.md:839`). The one condition is that **no game of his is on the card**, read by me at each
    run's start and end; a run that had company voids itself. The read is in Addition 1 below.
  - It is said, not hidden, and goes to the cost read.

## My bias

I want the row green and the Dark visible. Falsifier 1 is there because a green row on a count can still be a figure no
one can see.
