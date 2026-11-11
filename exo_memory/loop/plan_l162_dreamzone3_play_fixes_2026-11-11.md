# L162: what his first brutal run asked for. Librarian, 2026-11-11 04:5x (L)

His words: `briefs/dreamzone2_the_game.md` items 35–37. **Base:** dreamzone-3 main after B's L161 landing
(`handback/p-l161-land-B_2026-11-11.md`). Dispatch it when that lands, not before.

**C: the run record (item 35).**
- dz-world saves every run, keeping the last 20, to `game\runs\` (gitignored), each with:
  - the seed, level, dials and parameters, and the build commit;
  - the player's input record. The sim is deterministic, so the input record replays the run exactly, headless (the flee bot's
    record already does this, HANDOFF :40);
  - a summary: time survived, what ended the run (`caught_by` with its archetype, or the void), the close calls, and the
    chasers' events.
- A `dz-chase` (or dz-world) replay mode that takes a run file and prints who was where in the last 20 s. That answers "what cut
  me off" from disk.
- **Test:**
  - a recorded run replays to the identical fingerprint;
  - a run caught by the interceptor names it.
- Also: the play setting `flashlight = 1` (set by the librarian in dreamzone-2 at 04:50) carries to the dreamzone-3 play config
  while he tests. The design default stays 0: you spawn without it (item 36).

**E: more light, varied (item 36).**
- Today lamps are `lamp_density` 0.06 per walkable cell (`gen/src/gen.h:77`), weighted per kind of place (`emit.cpp:494`).
- His ask:
  - more places lit on average;
  - the first biome brighter;
  - darker stretches still possible.
- **Build:**
  - a per-biome lamp weight, with the apartments (the first biome) brighter;
  - a low-frequency "lit region" field, so light comes in pools and dark stretches, not evenly salted.
- **Measure** `lamps_per_100_cells` (`measure.h:66`) before and after, and the share of walkable cells within lamp range.
- Seeds change, so this is a new world, as the base-movement change would be. Say it in the hand-back.
- Captures of three corridors, before and after, for his eye.

**Not in this lap:**
- the flashlight as an unlockable ability that fuses with a psychic power into a beam that slows or repels entities (item 37);
- the loadout itself.

Both go into the design document (L163).

## Added 04:5x, at dispatch
- **Base:** dreamzone-3 main `8b04508`, landed by B (`handback/p-l161-land-B_2026-11-11.md`). Local only; his shortcuts now open
  dreamzone-3.
- The librarian set `flashlight = 1` in dreamzone-3's tracked `game\config\world.txt` for his testing. **It is uncommitted on
  main.** C gives play settings a git-ignored local override (for example `world.local.txt` read after `world.txt`), moves the
  flashlight line there, and restores `world.txt` to 0, so main stays clean and the design default stays "spawn without it".
- **A:** its braking-lever round (L161 continuation, `l161-chase` past 4191b09) carries on as L162's A part. It hands back to the
  same file's continuation section.
- His item 39, for the design doc only: the flashlight unlocks early. Its psychic partner comes late. The pair repels what is
  AHEAD (interceptors and future front-spawners), clearing a path while the rest swarm and frenzy behind.
