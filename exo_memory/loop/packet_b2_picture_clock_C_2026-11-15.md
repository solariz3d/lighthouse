# Packet for pane C: B2, one picture clock for every body; with it, the lean's two follow-ups from B1b

Written by the librarian on D, 2026-11-15, while F1 is still out, so that it is ready at F1's ring. It is dispatched when F1
is rung and `b1b-lean-limits-c` is on the game's main. Plan: `loop/plan_new_system_2026-11-14.md` ("B2, the picture clock").
Night's order: `loop/night_order_2026-11-14-D.md`. Tier: prove it (the fault cannot be seen by eye and sits beside the replay
path).

Written from the swarm's own section for this lap, L5 (`loop/animation_system_2026-11-13/00_build_path.md:306-331`, with its
second reader's bracketed correction at `:317-322`), the scout's first lap (`scout_performance_and_determinism.md:270-310`) and
its second reader (`:390-404`), and the critic's five checks (`00_critic.md:250-261`). All opened by me for this packet. Every
cite to the game below is re-based: read by me in his clone at main 13fd3db. Open both sides before you write a line, and ring
a mismatch back.

**SOURCE: what produces this, and what limits it.**
- **What a stride's phase is today, body by body** (three places advance one, by my grep at 13fd3db):
  - the hunter: `game/world/stage.cpp:275`, summed from the frame's time (`last_dt_`), in the stage;
  - the Dark: `game/world/stage.cpp:314`, the same line again with its own variable;
  - the player's body: `game/body.cpp:250` reads the camera rig's phase, which `game/camera.cpp:177` advances on the tick, by
    its own law (`stride_rate` times the square root of speed) and its own speed follower (`:176`);
  - the lesser kinds: none found. They are boxes.
- **What that produces, by reading, not yet run on today's main:** paused, the simulation takes no tick
  (`game/shell.cpp:161`) and the stage still draws with the frame's time, so the hunter's and the Dark's legs keep cycling in
  place; after a stall they run on for time the simulation never had; and their stride is a different sum at each frame rate.
- **What limits a test of it:** the phase lives in `WorldStage`, which only the D3D12 tools build. So the code moves first
  (step one below) and the rows are registered red on that commit, as the second reader asked.

## His words (verbatim in `briefs/dreamzone2_the_game.md`, items 227 and 159)

- "and remember, its not just for the hunter, but all mobs we will make and even the players character animations as seen from
  first person view, but also consistent from the outside as well."
- "the player animation needs to look smooth from first person perspective, when the player looks down at their legs and
  body/arms, they should move how a real person would"

## Part 1: the clock

**Step one, no change in what is drawn.** Today's two frame sums leave the stage unchanged in their arithmetic and become a
field on every chaser's pose in the app (the scout's `ChaserPose::stride_phase`; the struct is at
`game/world/world_app.h:84`). The stage's palette reads the field. `hunter_phase_` and `dark_phase_` are gone from the stage.
Its home is not under `ease_on_` (`set_ease_poses(false)` clears `ease_`, `game/world/world_app.h:148`, and the film tools turn
easing off on some passes), and it does not cycle while the chasers are frozen. Commit that alone, and run the rows below on
it: each is registered red there, and its printed number goes in the hand-back. A row that reads green there stops the lap and
says so.

**Step two, the clock.** One function advances any body's stride phase on the simulation's tick from the body's speed and
numbers in its kind's row, beside the lean's row. It is held per drawn id, before and after, and drawn at the frame's alpha.
- A chaser's row gives today's law (`gait_phase_per_metre` from the model's rest, `game/model_rig.h:350`).
- The player's row gives the camera's law and its follower, so that the body's legs and the view's bob stay one phase to the
  bit, and the camera row (`the_camera_moves_exactly_as_it_did_without_a_body_over_the_whole_gym_run`) stays green.
- A lesser kind has a phase from its first tick, whether or not its box has legs. The sprinter's body must need no clock of
  its own when it comes.
- **If the camera cannot call the one function without changing the view, stop and ring before code.** That is the plan's
  registered line about a clock for one body alone, and the ruling is mine to make from what you found.

**Its switch.** By the night's rule everything new lands switched off: one world setting, off by default, chooses the tick
clock; off, the chasers' legs are advanced by step one's unchanged rule and the picture is main's. You name it. When he says
so the default flips and the old rule's lines are removed.

**Rows, registered before code. Each names how many frames or instants it judged.**
1. **`paused_the_drawn_legs_stand_still`:** 2 s of paused frames move every drawn body's phase by 0. Red on step one for the
   hunter and the Dark.
2. **`the_drawn_stride_is_the_same_at_144_240_and_360_frames_a_second`:** his first kept run and the flee bot's record, each
   played through `advance` at the three rates, the frame schedule built from round(i x 1e9 / rate). Compared at every instant
   two of the rates share. That includes instants between ticks: 144 and 360 share every 1/72 s, which is 10/3 of a tick, so
   two in three of them fall inside a tick (my arithmetic; check it). The phase must have moved at least one radian in the
   stretch compared.
   - **The bar, changed by me from the scout's before any run: 1e-4 rad, not 1e-6.** A float near 6.28 resolves about 5e-7, so
     1e-6 sits on the number's own grain. 1e-4 is about a four-hundredth of one tick's motion at a sprint. Print the worst
     difference at each pair of rates, on step one and after.
3. **A stall:** after one frame of 0.25 s, every body's phase has advanced by the ticks the simulation ran and no more. Red on
   step one.
4. **The stage reads the field:** no line in `game/world/stage.*` advances a stride phase, and a mutant that leaves the clock
   at 0 fails row 2.
5. **One function:** the count of places that advance a stride phase, printed before and after. Three today. The player's
   body's phase equals the view's bob phase at every tick of the gym run (green today; it stays).
6. **Off means off:** with the switch off, his kept runs replay the same and the self-test and the pair check are main's. With
   it on, his kept runs still replay the same (the clock is picture only). Name the set of runs replayed; they are git-ignored
   and are copied into your tree.
7. **Kept green:** every `model_rig` row (`gait_pose` is not changed), the yardstick rows, the camera row.

**Printed, not gated:** what each body's legs do when the body stops (the camera's follower lets the view settle over a step
or two, `game/camera.cpp:173-176`; a chaser has none); and the clock's cost a chaser a tick if a quiet card is to hand (the
scout's guess is under 0.2 microseconds, not measured). No timing while a game of his runs.

**For pane E, named in your hand-back:** the field its footsteps branch (`origin/l192-footsteps`) is to read after this lands.

## Part 2: the lean's two follow-ups, both under `body_lean`, in the one law (ruled at B1b; `loop/packet_b1b_lean_limits_C_2026-11-14.md:90-97`)

**A. A body sees a wall coming.** The room the lean is held to is read ahead along the body's own velocity, by the time the
lean needs to come upright at the row's rate (the row's limit over its rate). The hard clamp stays underneath. For every body.
- The row you made green holds: the head, neck and shoulders never enter a surface.
- Printed again on his run 20:29 and the bot: the lean's fastest change for the hunter and the player's body (5,553 and 1,410
  degrees a second on his run today, by your print), with the count of frames on which the hard clamp acted, before and after.
- **Registered, mine and marked ours:** the clamp's frames fall by more than half on his run. **Unwelcome, named now:** they
  do not, which would say walls come into reach by the body turning and not by its travel, and then the read-ahead reads the
  wrong thing. Report it red; do not search for another predictor.

**B. A lean changes over a step, not inside one.** `LeanRow::smooth` for the player's body is one step of its own stride at
that speed, read from the clock's row, not chosen from a list. The chaser's row stays at 0.
- A report, no gate: on the straights of his run 20:29, with it and without: sign changes a second, the median and the 95th
  percentile of the drawn lean, and the lag of the lean's peak behind the turn's.
- A first-order smoothing lags a peak by up to its own time, so the lag will read near one step. That is said now so the
  number is not a surprise; whether it looks right is his to judge from the film.

## For his eye

By pane E's tools on main (`--capture-pair`, the film light labelled as lit): his body on a straight of run 20:29 with the
view on the head, smoothing off beside on; and the hunter and his body coming up to a wall, read-ahead off beside on. The
clock needs no film; its rows prove it.

## Registered with this packet

- **This lap is wrong if** the hunter, the Dark and the player's body end with more than one function that advances a stride,
  or if a number of the clock lives in the function and not in a kind's row.
- **It is wrong if** row 1, 2 or 3 goes green while any line still sums the frame's time into a stride, or on a phase that did
  not move.
- **Unwelcome, named now:** rows 1 to 3 read green on step one. Then the fault the swarm read is not in today's game, and the
  lap stops there and says so.

## Rules that hold

Runs start from G: through the lock's own wait. His words stay out of the game's repository. `game/config/world.local.txt` is
his. The settings list: your new line goes at the end; pane B keeps both sides' added lines at landing. Pane B lands. One
hand-back with its digest and a `BASE:` line, rung once.
