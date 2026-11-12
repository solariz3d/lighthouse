# L170: the chase's feel, built and measured; the scaling of chasers, designed. Librarian, 2026-11-12 00:5x (L)

His word: `briefs/dreamzone2_the_game.md` item 132 ("1. do it."). **Masters:** L169's three hand-backs:
- `handback/p-l169-code-A_2026-11-12.md` (levers P1–P7, the common instrument, its §3)
- `handback/p-l169-games-E_2026-11-12.md`
- `handback/p-l169-anim-C_2026-11-12.md`

**Base:** dreamzone-3 main `cab3530`, after B's L168 setup (submodules, build, suites, stamp). One worktree and branch per pane.
Builds queue on the heavy-run lock. **No timing runs.** Nobody quoted in dreamzone-3. Nothing lands or pushes without the
collation.

## A: chase/, in this order (A's own §5)
1. **The two instrument gaps** (A §3):
   - a per-run CSV from `dz-chase sweep` (`seed, policy, survival_s`), so a lever arm can be paired against the control;
   - the lever fields, each default 0 = the chase as it is.
   - **First run the control** at both seed blocks (`--first 1`, `--first 151`) and show it matches E's sweep within noise (flee never
     caught near 62 of 96).
2. **P3, a corner-speed floor** (`corner_floor_speed`, NextBot's 0.5). Register its catch test and its cutback price before the run.
3. **P2, side friction** (`side_friction`, NextBot 3.0), with its mechanism row: lateral distance 1 s after a 90° corner, at least
   1.0 m on and under 0.4 m off. **P1, the hunter's lead** (`lead_range`, `lead_base_s`). Arms: `P1`, `P2`, `P1+P2`, `P3+P2`.
- **Every arm:** two disjoint 150-seed blocks; a bar counts only when both blocks clear it with the same sign. The organic-pursuit
  guards stay green (`pursuit_tests.cpp:92`, `:117`), and the wall-hit rate stays at most twice the control's.
- **Also score his look-behind measure** (item 130): the lateral overshoot past a corner's inside line, as seen from the runner.
- Ideas from Valve's code are written as our own code; no Source SDK code is copied (Valve licence; A §2).
- **Hand-back:** `handback/p-l170-chase-A_2026-11-12.md`. Nothing defaults on until he has felt it.

## C: game/, the look of the momentum (C's options, cheapest first)
1. **Wire the lean and the look** the chase already computes (`world_app.cpp:510-512`, `chaser.cpp:430-434`) into the hunter's
   `gait_pose` (`stage.cpp:271`):
   - roll the body about its travel direction from the feet;
   - set the outside foot wider;
   - turn the head and chest by `look − heading`.
   - Make the comment at `world_app.h:86-88` true.
2. **Feet on the floor** (C's option A): a per-foot floor probe for the hunter's gait and for the player's body (`body.cpp:218`),
   with the plant and the hip sink.
3. **If time:** pass `link_from/to` and the link's progress into `ChaserPose` (C's option B groundwork). No climb poses yet.
- **Proof:**
  - a test that the simulation's fingerprints are unchanged (animation never drives the sim);
  - captures from the look-behind of a chaser rounding a corner, before and after;
  - stills only, no timing.
- **Hand-back:** `handback/p-l170-anim-C_2026-11-12.md`.

## E: design, not build. How many chasers (his item 132)
- Read the current scaling: `chase/dials.h` (`lesser_max` and its per-level numbers, the spawn interval, the four levels), and the
  director.
- **Propose a table:** chasers alive, group size and spawn interval against **(a) the chosen difficulty** and **(b) progress**. That
  is runs played or story chapter (items 28, 66, 122 and the D673 run frame).
- **The forgiving start:** his "the first few runs will be forgiving", even on brutal.
- **L4D's placement as the shape:** groups, mostly behind (75%), out of sight, by flow distance, from E's L169 §1.
- Say what the bots could measure and what only his play can.
- Options, with the trade-offs marked. **Hand-back:** `handback/p-l170-scale-E_2026-11-12.md`.

## Registered by the librarian before dispatch
- **A:** P3 passes the catch bar (A's §3 numbers) in both blocks. P2's mechanism row passes.
  - **Falsified if** no arm restores the catch bar without breaking a pursuit guard.
  - The cutback may stay unproven by bots. That is a known outcome and is said plainly, not chased with a sixth lever.
- **C:** the fingerprints are unchanged with the lean and feet on, and the look-behind captures show the hunter leaning into a
  corner.
