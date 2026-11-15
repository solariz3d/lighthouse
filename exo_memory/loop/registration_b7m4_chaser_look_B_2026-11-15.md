# Registration: a row that reads a chaser's look through the law, red on M4 (pane B, D677; before any code runs)

**Packet.** The chair's order of 09:01:30Z: "A ROW THAT READS A CHASER'S LOOK THROUGH THE LAW, red on M4 … The setup: the hunter in a
kept run of his, or a staged turn, with the law on. Its chest trails its head's look as the kind's row says. With M4 in place, the row
FAILS." Tier: prove it. On a branch from the game's main once b7-look-b `bab74f9` is landed. Until then, written and registered
only. Pane O lands it.

**Why M4 survived** (`exo_memory/handback/p-b7-look-B_2026-11-15.md` §10.5): the law reaches a chaser's drawn pose only at
`WorldStage::place_figures` (`game/world/stage.cpp`: `motion.look_law = p.look_on ? &p.look_law : nullptr;`, once for the hunter and
once for the Dark). No row draws a chaser with the law on. game_tests and world_app_tests never build a stage.

## Where the row lives, and why

- **A world self-test check** (`dz-world --selftest`, `game/world/selftest_run.cpp`). It must pass through `place_figures`, which runs
  only inside `WorldStage::draw`, so the row needs a stage. game_tests cannot reach it.
- **A staged turn, not a kept run.** In his runs the hunter mostly looks where it runs, so its look and its heading rarely part long
  enough to tell the law from M4. A staged turn sets the difference.
- **What the stage does with a staged pose:** it takes it as given (`stage_figures`), and the law is not stepped by `ease_poses`. So
  the row steps `BodyLook::step` itself with `kChaserLook`, as `ease_poses` does, and hands its answer to the stage in
  `ChaserPose::look_law` with `look_on`.
- **What it tests:** the stage's own line, which is the line M4 cuts.

## The staged turn

- **Who:** the hunter and the Dark, each on its own (`stage_figures` with one pose), standing (speed 0, `moving` false). Standing keeps
  the stride's counter-rotation out of the shoulders. With the travel along the heading, the hips stay on the heading (the look is
  within their 45 degrees).
- **The turn:** the look starts on the heading, and the law is primed there and stepped 240 ticks. Then the look steps 40 degrees to
  the right of the heading and stays there. Forty degrees is under the chest's 50-degree limit.
- **Read twice,** each by one `stage->draw` of the staged pose:
  - **A, the first tick after the look's step:** the law stepped once at 1/240 s;
  - **B, settled:** the law stepped 240 ticks (1 s, over 15 of the spring's time constants).
- **The drawn chest:** the yaw of the drawn ShoulderL→ShoulderR line in `drawn_bodies().hunter_pose` (or `dark_pose`). The drawn head is
  read from Head→Eye and printed.

## The row: "its chest trails its head's look as the kind's row says"

- **A:** the drawn chest has turned LESS THAN A QUARTER of the 40 degrees from the heading (the spring has barely begun).
- **B:** the drawn chest is within 2 degrees of the look (the spring has arrived, as the guard bar of §8).
- **Both, for the hunter and for the Dark.** Printed: the drawn chest and head, from the heading, at A and at B.

**What M4 makes of it, computed now from the code, so the red is predicted, not found.** The chain keeps its own share,
`kLookChestShare` 0.4225 of the look, at once.
- At A the chest has turned 16.9 degrees, 42 % of the step: A FAILS.
- At B it still trails the look by 23.1 degrees: B FAILS.
- Mutant M4 (both sites, as in `G:\consonance-scratch\b-b7-mutants.js`) must turn the row RED. A one-site mutant (the hunter's line or
  the Dark's) is also run, each.

## Falsifiers, before it runs

- **This row is wrong if** it is GREEN with M4 in place, or RED with the law.
- **The unwelcome outcome, named now:** with the law on, B is red. That would mean the drawn chest does not arrive at the look: the
  chain's twist does not carry the whole of the law's chest to the shoulders.
  - Then it is a fault in how the law reaches the hunter's bones, not a band to widen. I ring it with the numbers.
- **No band is added after the result.**

## Run

The new check's line, the whole world self-test (count +1), and the mutants M4 (both sites), M4a (the hunter's line) and M4b (the
Dark's line): applied / caught / NOT APPLIED. Then the suite as at any prove-it lap, under the lock, BelowNormal, on G:. One hand-back,
rung once.

## My bias

The law is mine, and I want it to reach the hunter. The 2-degree and quarter bars are set here, before the first reading.
