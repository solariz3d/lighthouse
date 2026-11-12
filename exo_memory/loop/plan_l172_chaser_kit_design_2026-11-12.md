# L172: a kit for every chaser, to level the field against the new movement. Librarian, 2026-11-12 01:2x (L)

His words: `briefs/dreamzone2_the_game.md` item 141 ("we are making the player too fast… every mob gets their own unique ability or
passive to level the field"). **E, design only, nothing built.** It feeds queue step 4, the lesser chasers' arc
(`loop/queue_dreamzone3_2026-11-12.md`).

**Read first:**
- the player's kit as now designed: L171 §5–§8.4 (`handback/p-l171-movement-tech-E_2026-11-12.md`) and the abilities sheet
  (`handback/p-l170-abilities-E_2026-11-12.md`);
- the chase as built: `chase/archetype.cpp`, `chase/dials.h`, `chase/speed.h` at cab3530 (the hunter, sprinter, interceptor, pack and
  climber; the stalker and charger are rows only);
- A's levers (L169, L170: the lead, SLIP, the corner floor);
- the lore: the entities are lower-energy beings that feed (items 25, 29), "thought forms" (the 1983 paper ¶33), the hunter is the
  malevolent god playing with its food (item 30), and the hunter always knows where you are (item 65).

**1. The speed budget, measured, not guessed.** For each difficulty, against time survived, set against each chaser's top (the
model's table, `chase/SPEED_MODEL.md`):
- the base player's top: run, peak, surge, ≤ 12.4;
- the fully upgraded player's top (§8.4's stack).
- Where does the player out-run everything, and for how long? The point of the kit is that **raw speed alone is never enough**: the
  surge must be earned against chasers who answer it.

**2. One signature per archetype,** each answering ONE player technique, so it **costs something without cancelling it**.
- Fit each to the lore and give it a **tell**, the way the window figure has one.
- For the roster as built (hunter, sprinter, interceptor, pack, climber) and the two empty rows (stalker, charger), propose a
  passive or ability per kind. Example shapes, not decisions:
  - one that **feeds on your speed**: the faster you go, the faster it gets. It answers the surge;
  - one that **cannot be overtaken**: it mirrors your line. It answers the overtake;
  - one that **moves only when unseen**. It answers the look-behind;
  - one that **hears a sprint and calls the others**. It answers the loud straight;
  - one that **slips through a wall** for a moment, a thought form. It answers the safe corner.
- **Its answer to each player ability** in the sheet (Long Stride, Long Slide, Dive Roll, Aura, Shroud, Overclock…): which kind
  counters it, which kind it beats.

**3. Pathing, his "make the ai pathing good":** say which of A's levers each kind should carry. For example, the sprinter careless
with high SLIP, the interceptor with lead and low SLIP, the hunter with the corner floor. That way the kinds differ in **how they
move**, not only in numbers.

**4. Registrable bot tests:** for each signature, a test that it costs the matching technique (say, overtakes a minute fall by X
with the overtake-blocker present) **and** that the technique still pays (it is not cancelled). Use A's 150-seed paired method.

**5. A short menu** of 2–3 roster shapes for him.

Hand-back: `handback/p-l172-chaser-kit-E_2026-11-12.md`. Options only. Quote nobody in dreamzone-3.
