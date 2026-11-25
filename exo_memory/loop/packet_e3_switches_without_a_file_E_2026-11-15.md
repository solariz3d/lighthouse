# Packet for pane E: the new switches without opening a file (E3)

Written by the librarian on D, 2026-11-15, at his word of 03:13. After the clips of pane B's films, before anything else of
yours. Night's order: `loop/night_order_2026-11-14-D.md`. Tier: check it, with the rows below.

**SOURCE: what produces this, and what limits it.**
- **Why he has to open a file today** (read by me in his clone at ae74f0c): a world setting is read once at the start, from
  `game/config/world.txt` and then his own `world.local.txt` (the row `world_local_txt_is_read_over_world_txt...`,
  `game/tests/run_record_tests.cpp:273`). `dz-world` takes a text for the chase's dials at launch (`--chase-speed`,
  `game/world/main.cpp:22`, `:108`) and nothing for a world setting (its options are listed at `:316-364`). In play, one key
  reloads `params.txt` (`WorldApp::reload_params`, `game/world/world_app.cpp:267`) and none changes a world setting.
- **What the night's order said, and what was built:** "One launch line turns the whole new system on." Every builder named a
  switch that only a file can set. That gap is mine: I asked for the line and did not ask for the way to give it.
- **What limits it:** `game/config/world.local.txt` is his and no tool writes it. A kept run must still replay the same.

## His words (verbatim in `briefs/dreamzone2_the_game.md`, item 228)

- "so iam ready ot test?"
- "why do i have to open the txt file lol"

## What to build

1. **In play, by key.** The new picture switches are flipped while he plays, each by its own key, with the game's own notice
   on screen saying what is now on. Tonight's are `body_lean`, `view_on_head`, `soft_upper_body`, and `body_look` once pane O
   has landed it. He is testing by feel, and old beside new in the same run is the comparison he needs.
   - **Only switches the simulation does not read.** A switch that changes a run (the chase's dials) is not flipped in a run;
     it keeps its launch text.
   - The list of switches a key may flip is data in one place, so the next lap's switch is one line.
   - The keys are yours to propose from those not in use. Print them in `--help` and name them in the hand-back; they are his
     to change.
   - A flip is for this launch only. Nothing is written to any file.
2. **At launch, by one text.** `--world "name=value;name=value"`, read over `world.txt` and his `world.local.txt` for that
   launch, in the grammar `--chase-speed` already has, refused the same way (the message, then no start). The launcher passes
   it through as it passes `--chase-speed` (`launch.ps1:94`).

## Rows, each seen red first where it can be

- A flip by key changes the world setting the app reads on the next tick, and the notice names it. Red today: no such key.
- **A kept run replays the same whichever way the keys were flipped while it was made,** on his seven kept runs' own method.
  If one does not, that switch is read by the simulation: stop and ring, and it comes off the list.
- A switch the simulation reads is refused by the key list at build or at start, not in play.
- `--world "body_lean=1"` gives the same world settings as his file with that one line added. A wrong name or value is
  refused with its message. Nothing is saved into `world.txt` or `world.local.txt` (the existing row's second half, run with
  the text).
- Off means off: with no key pressed and no text, his kept runs and the self-test are main's.

## Registered with this packet

- **This lap is wrong if** a flip in play can change what a kept run replays, or if any tool writes his settings file.
- **It failed on his terms if,** after it lands, trying one of tonight's switches still needs him to open a file.

## Rules that hold

Trees and builds on G:, through the lock's own wait. His words stay out of the game's repository. No build and no
fast-forward of his copy while a game of his runs. Pane B lands it. One hand-back with its digest and a `BASE:` line, rung
once.
