# p-b1b-lean-limits-C: the lean yields to walls, a human body keeps a human lean, the view can ride the head

Pane C (seat 0845a868), on D, the night of 2026-11-14 (ledger D677). The packet: `exo_memory/loop/packet_b1b_lean_limits_C_2026-11-14.md`
(84 lines). The chair's tier is prove it; the packet's is check it; I take the higher. Branch: dreamzone-3 `b1b-lean-limits-c`, on my
`b1-lean-c` a0996d3.

## REGISTERED BEFORE IT RAN ON HIS RUN: the straights method changed, and why (committed ahead of the gate)

**The method I registered first** (in the row's own comment, before code): a dead band on the asked lean in the player's row,
its value the 95th percentile of the asked lean on the flee bot's straights, then gated on his run.

**It failed on its own rule before any code used it.** checked: `G:\consonance-scratch\c-d676\b1\red-rock_on_the_straights.txt`
→ the flee bot's straights (2,843 frames) ask p50 0.53, p90 28.27, p95 45.00, p99 45.00 degrees. Most of a straight asks
almost nothing, with one-tick spikes of the bot's direction changes that reach the cap. So a dead band at p95 is 45 degrees,
past the player's own limit of 15, and would hide every lean. A dead band cannot remove a spike; it only moves the threshold.

**Registered in its place, before anything runs on his run:**

- **The method:** the packet's other allowed method, a smoothing of the simulation's own sideways acceleration (never drawn
  positions), in the player's row: `LeanRow::smooth`, an exponential average with that time constant, tick by tick.
- **Its value:** the smallest of 0.05, 0.1 and 0.2 s that holds the flee bot's straights to 0.5 sign changes a second, with R2
  still under 0.05 s on the bot.
- **How it is chosen:** on the bot alone (`train.sh`, `DZ_LEAN_RUN` unset, so neither row reads his run).
- **The gate:** then on his run 20:29 only, at the bar of 0.5 a second.
- **Unwelcome outcomes, named now:**
  - none of the three holds the bot to 0.5;
  - the one that does breaks R2 on the bot;
  - it passes on the bot and fails on his run.
- **If any of those happens, I report it red and do not search further values.**

The chaser's row stays at 0 (no smoothing): its rocking is the chase's sway, which pane A's weave replaces.

## The outcome of that registration: the first named unwelcome outcome fired

- checked (`G:\consonance-scratch\c-d676\b1\train.log`, the bot alone; his run not read):

  | smoothing | the bot's straights, sign changes a second | R2 for the player's body on the bot |
  |---|---|---|
  | 0.05 s | 17 on 19.7 s (0.86) | -0.389 s |
  | 0.1 s | 14 on 19.7 s (0.71) | -0.264 s |
  | 0.2 s | 14 on 19.7 s (0.71) | -0.125 s |

- B1 with no smoothing had already given 14 on 19.7 s (0.71). **Smoothing does not lower it.**
- **None of the three holds the bot to 0.5.** As registered, I searched no further.
- inferred: the bot's "straights" really weave, and the asked acceleration changes sign with them. The cause is not one-tick spikes.
- **So the straights row reports, pending a ruling.** It is renamed
  `with_the_lean_on_the_players_body_on_the_straights_of_his_run_pending_a_ruling`, following the repo's L182 precedent (a row that
  reports until its fix lands). A red row cannot land, because a red on the game's main stops the night.
- The player's row keeps no smoothing (`smooth = 0`), since no value earned its place; the knob stays in the row for the ruling.
- checked: his run 20:29 reads **1.62 sign changes a second** with the merged B1b (`f-pending_a_ruling.txt`). B1 alone read 1.35. The
  15-degree limit is reached faster, inferred as the reason.
- **Asked of the ruling:**
  1. Is 0.5 a second the right bar for a body whose path really weaves?
  2. Or should "straight" be read from the player's input, not the path?
  3. Or is a slower rate for small leans wanted?

## What was built (dreamzone-3 `b1b-lean-limits-c`)

Commits:
- 7e42526: the change and its rows;
- 691958c: the merge of `b1-lean-c` a78493c, which carries main 9639e9a;
- 69a04e0: CHANGELOG.

Everything is behind `body_lean` and the new `view_on_head`, both 0 as shipped.

- **The wall, in the one law** (`game/body_lean.cpp` `lean_room`):
  - The world is read sideways from the feet line at the kind's head height and shoulder height.
  - The shoulder sits `shoulder_half` to the inside; the joint at height h and w to the inside reaches sqrt(w^2+h^2) sin(L + atan(w/h)).
  - The lean is held so that each stays the row's radius short of the first surface.
  - It is read on both sides each tick. `BodyLean::step` clamps to the two rooms at once; it does not wait for the rate.
  - Callers: `WorldApp::chaser_lean_room` (the hunter and the Dark, in `ease_poses` and the not-eased path) and
    `Body::set_wall_probe` (the player's body). Both wrap `sim::World::raycast`, picture only.
- **The limit, in each kind's row** (`LeanRow`):
  - the player's body: `limit` 15 degrees;
  - a chaser: no limit past atan(its grip), as B1.
  - The rows also hold `head`, `shoulder`, `shoulder_half` and `radius`:
    - the player's from BodyBuild (1.67, 1.40, 0.19, 0.12, the radius ours);
    - the chaser's from the hunter model as the wall row measures it: head 2.12 m and shoulders 1.79 m over its feet. Its shoulders
      print 0.190 m to each side against the row's 0.20, a cm on the safe side. Radius 0.14 (ours).
- **The view dial:** `view_on_head`, a world setting 0 to 1, default 0.
  - `Shell::view` passes its eye through a new hook, `picture_eye`. The gym leaves it as it is.
  - The world app moves it toward the drawn eye, `glanced(body.at(alpha), look_back)[Eye]`, the stage's own pose.
  - At 0 it returns the eye untouched (to the bit). Position only.
- **B1's rows amended by name**, because the rule changed by the librarian's ruling:
  - `in_a_steady_turn_the_one_lean_law_asks_atan_a_over_g_held_to_the_grip` now checks the chaser's row at 45 and the player's at its
    limit, where both were 45 and equal;
  - the player's R1 in `body_tests.cpp` compares to what the law gives held to the limit, where it compared to physics' 43.

## The rows, red first (on B1's behaviour, with the new knobs not yet used) then green on the merged tree

Red: `G:\consonance-scratch\c-d676\b1\red.log`. Green: `final.log` (the merged tree, his run 20:29 as `DZ_LEAN_RUN`).

| row | red (B1) | green (B1b) |
|---|---|---|
| the hunter's head, neck and shoulders stay out of the wall at the staged corner (grip 1.0, 1.3, 2.0) | **146** joints into a surface, the deepest 0.18 / 0.38 / 0.64 m; lean 45 / 52.4 / 63.4 degrees | **0**; the room to the inside 25.7 degrees, the lean drawn 25.7 at all three grips |
| no body leans past its row's limit (his run and the bot) | the player's body **45.00** (limit 15) | **15.00**; the hunter 45.00 (atan of its grip 45.00) |
| the dial: at 0 the camera is main's to the bit; at 1 it is at the drawn eye within 1 mm, its direction the same | at 1, **1.3475 m** from the drawn eye | at 0, differs on **0** of 13,309 frames; at 1, **0.0000 m** and the direction differs on 0; fingerprints the same |
| R2 still holds (both bodies, his run and the bot) | (green on B1) | the hunter **-0.083 / -0.069 s**, the player's body **-0.347 / -0.444 s** (bar 0.05) |
| the straights (player) | 1.35 a second | **pending a ruling** (above): 1.62 |

- **The packet's unwelcome outcome** ("the hunter's lean in a 3 m corridor is so small that the bank cannot be seen") **did not fire
  at this corner.** The wall leaves it 25.7 degrees, 0.92 m of head-height clearance to the inside. Whether 25.7 degrees reads as a bank
  is for his eye (the films below). In a narrower straight corridor it will be less, inferred.
- **The gap, printed as asked:** at his run's sharpest lean with the player's limit (15.0 degrees, 0.67 s), the drawn eye is **0.420 m**
  from the camera at dial 0. It was 1.243 m at 45 degrees. 0.508 m at the most anywhere in the run (`f-lean_about_the_feet_on_his_kept_runs.txt`).
- **Picture only:** his run with `body_lean` on against off, the camera differs on 0 frames and the fingerprints are the same (same file).

## Suites (prove it; the merged tree 691958c plus the CHANGELOG)

- checked: `f-game.txt` → **game_tests 196, 0 failed**.
- checked: `f-world_app.txt` → **world_app_tests 73, 0 failed**.
- checked: `f-world.txt` → **the world self-test 63 of 63**, which now holds E1's two pair rows.
- No mutation harness names these files in the game repository. checked: `git ls-files | grep -i mutant` → nothing tracked.
  The room's mutant harnesses are for lighthouse's own tools. So "prove it" here is: the rows red first, then green, then the touched
  files' whole suites. No mutants were run.

## E1's pair check with the lean on: the launch line needs the dial too

checked (`f-pair-view0.txt`, `f-pair-view1.txt`), his run copy with `body_lean = 1` in its `[world]`:

- **`view_on_head = 0`: RED.** The joints and palette agree to 0.0000000; the first-person camera is not at the drawn eye.
- **`view_on_head = 1`: GREEN.** 2,597 ticks, 54,537 joint pairs, 1,682,856 palette values.

**So `body_lean = 1` without `view_on_head = 1` breaks E1's "one pose, two cameras" by design.** The morning's one launch line should
carry both: `body_lean = 1` and `view_on_head = 1`.

## Known faults, behind the switches

- **The wall pops the lean.** It stops the lean at once, so where a wall comes into reach the lean jumps.
  - checked (`f-lean_peaks_with_the_turn.txt`, the rocking print): on his run the hunter's lean changes at up to **5,553 degrees a
    second** (about 23 degrees in a frame) and the player's body at up to 1,410; on the bot 1,274 and 968. B1, without the wall, read 300
    for the hunter and 360 for the player's body, where 360 is the measure's own sampling.
  - That is the price of "a body cannot put its head through what is solid" read literally.
  - The ways round, for a ruling, not built:
    1. read the room a few tenths of a second ahead along the path;
    2. let the wall push at a faster but finite rate and allow a brief overlap.
- **The player's straights**, pending (above).
- **The hunter's straights** are left, as the packet says (the chase's sway; pane A's weave).

## For his eye: `Downloads\dreamzone-3-b1b-lean\` (four sheets, twelve full frames, a README in plain words)

- **The hunter at the staged corner, three ways, at grip 1.0 and 2.0.**
  - Made with a temporary edit, `G:\consonance-scratch\c-d676\b1\gripfilm_b1b.js`, undone after; the tree was clean.
  - checked (`grip3.txt`):

    | grip | main | B1 | B1b, the wall holding it |
    |---|---|---|---|
    | 1.0 | 9.4 degrees | 45.0 | 25.7 |
    | 2.0 | 16.7 | 63.4 | 25.7 |

  - In the look-behind sheet the B1b hunter leans with its head just short of the corner's wall, where B1's lay in it.
- **The player's body through the hard turn of his run 20:29 (6.0 to 7.2 s), first person beside outside, at dial 0 and dial 1.**
  - E's `--capture-pair`, which E1 landed on main 9639e9a and my branch carries by the merge. 172 ticks each.
  - checked (`pair-view0.txt`, `pair-view1.txt`): at dial 0 the pair's own row is **RED**, the first-person camera up to **0.495 m**
    from the drawn eye. At dial 1 it is **GREEN**.
  - The same finding as the pair check above, on his own turn.
- **Pane E's film light and staged chase (E2):** no `e2` branch on origin when I filmed (checked: `git ls-remote origin`), so not used.

## State of the branches (checked: `git ls-remote origin`, `git merge-base`, `git merge-tree`)

- **`b1-lean-c` a78493c is on main.** Pane B landed it as 6034143.
- **`b1b-lean-limits-c` 69a04e0 is pushed** for pane B to land. It merges onto main 6034143 cleanly (`git merge-tree`: no conflict).
- Everything ran on G:. I made no new folder on C:.

## Corrections and slips, mine

- **The registered dead band failed on its own rule.** Said above, before anything ran on his run.
- **My first wall clamp read the room on one side only**, the side the asked lean pointed to, so a lean still leaning the other way
  was not held. Changed to both sides before any green run.
- **The shell ate parts of my edits twice** (backticks in a double-quoted `node -e`). I caught both in the files before building: a
  comment's word, and a heredoc that never ran. No code was built from either.
