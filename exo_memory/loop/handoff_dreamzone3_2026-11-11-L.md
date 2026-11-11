# Dreamzone 3, handoff 2026-11-11 (L, ~07:4x local), for the desktop. Librarian, at the keeper's word

His order, 07:32 (see the lighthouse handoff). **Read first:**
1. `briefs/dreamzone3_design.md` (E, L163): the design map, items 1–53 sorted into 11 systems, with GAPs as questions for him;
2. `briefs/dreamzone2_the_game.md` items 1–63, his words verbatim (54–63 came after the design map);
3. `loop/dreamzone3_inventory_2026-11-11.md`.

## Where the code is
- **Repo:** `solariz3d/dreamzone-3`, **private**, created tonight at his choice ("a whole new repo, and keep the original there as
  reference").
  - Local: `C:\Users\zackn\Downloads\dreamzone-3`.
  - Its first commit, `d11ce9a`, is the Dreamzone 2 play folder byte for byte (256/256 files), plus tonight's laptop work.
  - `solariz3d/dreamzone-2` stays at `062d5c4`, untouched, as the reference.
- **main on L:** **[filled in when B's revert landing rings: tip and suite counts]**.
  - **Pushed: only `d11ce9a`.** Everything since is local, because he said "let me test it before pushing".
  - **D cannot pick this up until it is pushed: his call.**
- **His desktop shortcuts on L** ("Dreamzone 2 World" and "Dreamzone 2 Gym") now open dreamzone-3; the `.lnk.before-l161` backups are
  beside them.
- `game/config/world.local.txt` (git-ignored) holds his test setting, `flashlight = 1`. The design default stays "spawn without it"
  (items 36, 40).

**Landed on main tonight (each with its hand-back):**
- **A, the chasers' speed model** (item 18). They have their own reference speed, gain speed on straights, carry inertia and lose speed
  in turns. They no longer stand after hitting a wall. The interceptor is nimble. The stairs-foot stall is fixed. His 10% start is a
  fading margin; the hunter overtakes at about 145–181 s. `handback/p-l161-chase-A_2026-11-11.md`.
- **B, the generator:**
  - void floors crossed by a short wall-run, sized from a fixed base body so a seed never changes with upgrades;
  - falling into a void ends the run;
  - wide straight stairwells, on at 4.2.
  - `handback/p-l161-gen-B_2026-11-11.md`.
- **C, the first-person body,** hanging from the camera, which is unchanged to the tick. The look-behind is on V. The hand hook for
  world-aware animation is at `game/body.h:79/103`. `handback/p-l161-body-C_2026-11-11.md`.
- **C, the run record:** the last 20 runs go to `game/runs/`; `dz-world --replay-run last` shows who was where in the last 20 s.
  `handback/p-l162-runs-C_2026-11-11.md`.
- **E, lighting in pools:** apartment lamps ×1.45, lit share 0.57 to 0.71. Lamps are no longer collision or nav solids (A). The
  brightness bound is 0.65, with 0.607 measured and the picture looked at. `handback/p-l162-light-E_2026-11-11.md`.

**Not landed:**
- `l162-stair-stall` e2dc31b. B's bot-only fix: PlayGraph::nearest no longer snaps through a wall. Landed, then **reverted on main**
  (39e03db), because it turned `proof_tests.cpp:159` red when it met A's levers. **Carried to A.**
- `l162-chase` abe8237. Close-range direct pursuit, off by default. It did not make a juke pay (1.07×). Kept as a dial he could feel.
- **L165,** the render's grain and ghost trails (item 63). C's diagnosis is partial:
  `handback/p-l165-render-C_2026-11-11.md` **[when C rings]**.
- Worktrees on L, made by git, each its own folder under `Downloads\` (`dreamzone-3-a-l161`, `-c-l161`, `-c-l162`, `dz3-wt-l161-gen`,
  `dz3-wt-l162-light`, and others). Clean them only after the branches they hold are landed or dropped.

## From the last handoff
**The Third Place's D handoff** (`loop/handoff_dreamzone2_2026-11-10-D.md`) and the play folder's "Handed on from the laptop" section
(`Downloads\dreamzone-2\HANDOFF.md`, 02:20):
- **"The keeper plays dz-gym and dz-world":** **done.** He played on L. His words are items 10–17 and 35, including a 222.28 s best on
  brutal.
- **Run speed first (items 21–22):** **done as research.** `handback/p-l161-speed-E_2026-11-11.md` recommends 6 / 9 / 4 s. **Not
  applied:** he tries it in the gym. The void base (`gen::kBaseMove`) moves with his choice.
- **No stamina, chasers that gain on straights and lose speed turning:** **done** (A, above).
- **A first-person body:** **done** (C). Chaser animation and the thunder footsteps: **carried**.
- **Void floors with rare wall-runs; wider stairwells; chasers that do not catch on walls:** **done** (B, A).
- **The flashlight as a find or unlock:** **carried.** It is design now: containers (items 36–40).
- **M5 (the hub) and M6 (style):** **carried.** Designed tonight in words (items 26–62), nothing built.

## His open calls (the design map's GAPS, plus tonight's late ones)
- **The three contradictions only he can settle** (design map):
  - can you be consumed at the very end (28 vs 30);
  - the currency split;
  - are pool rooms and chaos still biomes?
- **E's six movement questions** (`handback/p-l164-movement-E_2026-11-11.md`, "The menu for him"):
  - the bhop landing window;
  - base strafe gain;
  - the perk's speed ceiling;
  - the chain rule;
  - the somersault over chasers;
  - dive steering.
  - The librarian's leanings are in the conversation; his answers are not given.
- **The six starting abilities and three ultimates by name** (gap 2). It blocks the run's design.
- **Speed numbers** after the gym. **The chasers' speed ceiling** (13.65 m/s at 20 min with no cap).
- **Which stairwell he liked** (only straight flights widened).
- **The lighting overlay settings:** `lamp_range`, `lamp_power`, `ambient`. The pooled lamps barely change the spawn corridor's
  picture.
- **Whether the hunter paces an eroding safe zone or waits** (items 54–56).

## PICK UP HERE (D)
1. **Ask him to push dreamzone-3,** after he has played main on L. Then on D: `git clone --recursive` it beside dreamzone-2, build
   with `build.bat`, run `build.bat test`.
2. **Read** `briefs/dreamzone3_design.md`, then the brief's items 54–63, which the design map does not hold yet. Fold them in.
3. **Put his open calls to him** (list above), the contradictions first. Then gap 2, the six abilities.
4. **A: the stair fix against the levers** (`proof_tests.cpp:159`, red with e2dc31b on main). Register first and do not weaken the row.
5. **C: L165 part 2,** the render fix (motion vectors for moving instances, history clamping, a cheap denoise), from C's partial
   diagnosis. **The frame-cost check runs on D**, under the 2.78 ms budget. L takes no timing runs.
6. **Next builds, at his go:** the containers and the run's XP (items 53, 57–58); the stress system with virtues and afflictions (59–62).
   The hub (M5) after the design gaps close.

NEXT: D's librarian opens this file's "From the last handoff" and its PICK UP HERE first, after he says whether dreamzone-3 is pushed
