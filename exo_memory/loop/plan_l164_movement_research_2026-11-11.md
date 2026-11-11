# L164: movement research. Parkour runners, the nextbot genre, and Source-style bhop against our controller. Librarian, 2026-11-11 06:4x (L)

His words: `briefs/dreamzone2_the_game.md` item 57 (also 12–14 and 53). **E, research only. Nothing built.**

1. **Games where you run from something, and parkour runners.** For each: its movement verbs, how it chains them, how momentum
   is kept or lost, and what makes it feel finessable. Cite sources and give numbers where they are published.
   - Mirror's Edge (and Catalyst).
   - GMod's nextbot servers, and the parkour SWEP mods used there. Find which one he likely means by its common use on nextbot
     servers, and say how sure.
   - Titanfall 2, Dying Light, Ghostrunner, Neon White; others if they teach something.
2. **Source and Quake air movement.**
   - The air-strafe acceleration rule (wishdir, `sv_airaccelerate`, the projection cap) and why it lets speed grow.
   - Friction on landing, and the frame window that bhop exploits.
   - Auto-hop against manual timing.
   - Give the formulas from primary or well-sourced references.
3. **Our controller against it.** Read `dreamzone-3` main `sim/` (the 240 Hz controller, `sim/params.h`, `sim/world.cpp`), read
   only.
   - Does its air control allow speed to grow by strafing? What caps it? Is ground friction applied on the landing tick?
   - What would have to change for bhop to exist in the base game but be hard to build momentum with, and for a late perk to
     loosen it (his design)?
   - Name the parameters and the code places. Say what it would do to determinism and the existing tests.
4. **His ability ideas, mapped to the controller:**
   - a super slide;
   - a dive into a roll that follows the head;
   - a somersault over a shorter entity.
   - For each, what exists (dive, roll and vault exist) and what is new.
5. **XP from movement (item 53, 57):** what counts as a chain, from the precedents (skate-game combos, Titanfall's speed),
   offered as options.

Hand-back: `handback/p-l164-movement-E_2026-11-11.md`, with a menu for him and sourced numbers. Quote nobody in dreamzone-3.
