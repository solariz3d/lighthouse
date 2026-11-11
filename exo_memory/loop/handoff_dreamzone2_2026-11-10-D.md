# Dreamzone 2, handoff 2026-11-10 (D, ~16:45 to ~23:55 local). The Third Place, at the keeper's word

*"can you after your done, finish the handoff for the laptop, leaving for work soon, u can continue working till ur
done then push the handoff and commit everything to repo"* (23:28 local).

**A new project, begun and brought to a first playable run in one sitting.** The keeper asked to return to
Dreamzone-RT as a rewrite: a nextbot-style chase roguelike through endless liminal spaces.

## Where it is

- **Repo:** `github.com/solariz3d/dreamzone-2`, **private** (the old `dreamzone-rt` is private; the keeper was told
  and can change it). Pushed at `062d5c4`; `git ls-remote` returned the same commit as local HEAD. 55 commits.
- **Clone with `git clone --recursive`** (Jolt Physics v5.6.0 and Recast/Detour v1.6.0 are submodules), then
  `build.bat`, `build.bat test`. Needs Visual Studio 2022 with its CMake and Ninja, and a DXR GPU.
- **Read first, in the repo:** `HANDOFF.md`, then `docs/ARCHITECTURE.md`.
- **His words** (that repo quotes nobody): `briefs/dreamzone2_the_game.md`, beside this file's folder.
- **On D only:** desktop shortcuts `Dreamzone 2 Gym` and `Dreamzone 2 World`; local folder `Desktop\dreamzone-2`.

## What was built (each line is a module with its own tests; the repo's HANDOFF has the table)

- The 240 Hz deterministic movement controller on Jolt: walk, sprint, jump, slide, dive, vault, climb, wall-run,
  wall-kick, roll, ladders.
- The generator: the old game's hash-and-lanes logic in true 3D with no storey cap, real thick geometry, the old
  plan's unbuilt shapes, dead ends and reprieves on dials, a walk graph per chunk, biomes as data.
- The raytraced renderer lifted from Dreamzone-RT and Dreamride, with streamed chunks and a light grid.
- Streaming that keeps the simulation deterministic.
- Chaser navigation on Recast, with reprieves cut out and a filter per chaser type.
- The chase: the hunter, three lesser archetypes and a climber, a director, 39 difficulty dials, the score.
- Synthesised sound, and two programs: `dz-gym` (movement course) and `dz-world` (the run).

**At hand-over:** `build.bat test` passes all ten suites; `dz-gym --selftest` 26 of 26 and `dz-world --selftest` 49 of
49, re-run by this seat. **No window has been shown on a screen and no sound has been heard.** The keeper has not
played it.

## How it was done (for the room, since it is not the room's usual lap)

Eleven builder runs across the evening, each a fresh context briefed from this seat, one module folder each, at most
four at once. Each verified offscreen only, wrote tests first for the invisible parts, ran hand mutation checks and
reported what survived. This seat re-ran the tests and looked at the captures before telling the keeper anything.
Where two builders needed one file, the second was told by message before it touched it.

## Open, and whose

- **The keeper's, by playing:** everything about feel. The list is in the repo's `HANDOFF.md` ("What only a person
  can judge"): movement, the dark (a chaser in an unlit corridor is invisible past about 4 m with the hand light), the
  sounds, the two stall rules this seat set as defaults, run length, the corridor-to-room balance.
- **Not started:** the bedroom hub and progression across runs (M5); the look and each biome's skin (M6), which he
  said to author "once we get to it".
- **Public or private:** his call; private for now.

NEXT: the keeper plays `dz-gym` and `dz-world` and says what is wrong; whichever seat is with him tunes from the
parameter files and the F1 overlay before changing code.
