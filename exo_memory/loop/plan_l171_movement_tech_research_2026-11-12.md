# L171: movement tech that rewards skill: COD's slide cancel and sprint reset, and what makes a movement system addictive. Librarian, 2026-11-12 01:0x (L)

His words: `briefs/dreamzone2_the_game.md` item 134. **E, research only, nothing built.** It builds on E's own L164
(`handback/p-l164-movement-E_2026-11-11.md`: parkour games, Source bhop, our controller), which is not repeated. It runs beside the
queue (`loop/queue_dreamzone3_2026-11-12.md`), not in it: it informs steps 7–9.

1. **COD's modern movement, from sources** (developer statements, patch notes, measured community data, marked as such):
   - MW2019's **tactical sprint**: its limited duration and how a **slide cancel** reset it;
   - the slide cancel itself (the input sequence; why it was strong; how later games nerfed or kept it);
   - MW2 and MW3 (2022–23) changes;
   - **Black Ops 6's omnimovement** (sprint, slide and dive in any direction).
   - Give numbers where published: tactical sprint seconds, the slide's speed and cooldown.
2. **Others that reward skill, briefly:**
   - Apex Legends (the slide jump; the tap-strafe and its nerf);
   - Titanfall 2 (slide-hop, the wall-run chain; covered in L164, so only what's new);
   - ULTRAKILL (the slide, the dash, the slam);
   - Mirror's Edge (the momentum reward; L164);
   - Neon White (movement as a resource).
3. **What makes movement addictive, from game-feel sources:**
   - Steve Swink's *Game Feel*, and GDC talks on movement feel;
   - the shape of a skill ceiling: easy floor, deep ceiling, discovered tech;
   - rhythm and micro-decisions every second;
   - readable feedback (sound, FOV kick, screen effects, a counter);
   - a reward loop that pays the next move.
   - "Built by someone with ADHD" (his phrase): read it as **high stimulation, constant small decisions, instant feedback, no dead
     time**. Find designers who have spoken to that, if any. Do not diagnose anyone.
4. **Against Dreamzone's controller:**
   - read `sim/params.h` and `sim/world.cpp` at main, read only;
   - say what exists (sprint stages, slide boost and its fatigue, slide-hop keeping speed, the momentum tier `flow_enabled`, off);
   - say what his idea needs: a sprint that tires after ~10 s, a slide that resets it, a cancel window.
   - Then the **options**, each with its parameters, what it does to the chase (A's model) and the voids (`kBaseMove` stays), and
     how it ties to XP from movement (items 53, 57) and the abilities sheet (`handback/p-l170-abilities-E_2026-11-12.md`).
5. **A menu for him:** 2–4 movement-system shapes, from "COD-like reset" to "Titanfall-like flow". Each says what a new player
   feels in minute 1 and what a skilled one does at hour 20.

Hand-back: `handback/p-l171-movement-tech-E_2026-11-12.md`. Sources cited; [source] and [inferred] kept apart. Quote nobody in
dreamzone-3.

**Added 01:10 (his item 135), the design rule for the menu:** "mostly realistic, but it can be bent stylistically for gameplay
purposes that make sense for the setting and lore". It is a dream, the in-between. So for each tech in the menu, say:
- whether it is realistic as it stands, or a bend;
- if a bend, what in the dream justifies it, and how the game could show the bend as dream-logic rather than a bug (a visual or
  sound cue).

COD's slide cancel is a bend (an exploit made a feature). Item 57's late bhop is one too.
- **Added 01:11 (his item 136):** a bend's cue IS the psychedelic-distortion layer (`handback/p-l161-look-E_2026-11-11.md`), not a
  new effect. For each bend, name which of those effects marks it (e.g. a tracer smear on a slide cancel, the haze breathing on a
  sprint reset). That layer is not built (queue step 14), so say which bends need it to read and which work without it.

**Added 01:1x (his item 137): the base kit, and the near-miss surge.**
- **The base movement without abilities:** list what exists today (sprint stages, slide, dive, roll, vault, climb, wall-run, rare
  and short, wall-kick, ladders, jump), and say which of shapes A–D (§5) belongs in the base. Abilities then spec around them: "do
  all movement mechanics and you can change how you play or spec your character".
- **The near-miss surge** (his: getting close to corners, doorways or walls raises speed; it compounds and decays). Design it
  against the controller:
  - **What counts as a near miss.** In 3 m corridors the player is ALWAYS within 1.5 m of a wall, so parallel wall proximity cannot
    count. Propose: passing a **convex edge** (a corner, a door frame) within X m at ≥ Y m/s, and passing a **chaser** within Z m
    (the juke made countable, item 53's proximity). Reward the pass, not the hug.
  - **Compounding and decay:** add per near miss, a cap (the 12.4 m/s human line, item 135's rule for when it becomes a bend),
    decay per second, and a cooldown per edge so one doorway can't be farmed.
  - Its **bend** and its **cue** from the distortion layer (items 135–136).
  - How it reads in the 3D generated world: the walk graph knows corners and doors (gen).
  - Its tie to movement XP (items 53, 57).
- Sources: Burnout's near-miss boost (Criterion), and Galactic Racer's Afterburner/Ramjet (Fuse Games), as checked above.
- **Correction 01:17 (his item 138):** Galactic Racer's surge comes from **overtaking**, not near misses. His idea is a **fusion**:
  - an **overtake**, getting past a chaser ahead of you (an interceptor or a pack flanker, which spawn ahead) without being caught;
  - a **near miss**, cutting close past a convex edge or a chaser.
  - Both feed one compounding, decaying surge. Check Galactic Racer's surge from sources, and weight the overtake above the near
    miss (it is rarer and riskier).
- **Ruled 01:22 (his items 139–140):** the surge's per-source cooldowns become **diminishing returns**: a repeat source pays less
  within a window, never zero. **The base surge stays limited**, by its cap (+2 m/s, ≤ 12.4 m/s) and its hold (≤ 10 s). **Abilities
  raise them**, so "nutty speed lines" are the upgraded player's. E: in §8.4, propose the decay curve per repeat and which abilities
  lift which limit (the abilities sheet's P1, P2, P3, P6, Ψ3, and the burst as an ability).
