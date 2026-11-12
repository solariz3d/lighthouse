# p-l170-abilities-E: options for the six starting abilities and the three ultimates (queue step 8). Pane E, on L, 2026-11-12, written from 01:02 local (`date`)

**Packet:** the chair's second L170 part for E, 07:01:53Z. **Carrier:** `loop/queue_dreamzone3_2026-11-12.md` (e4a0f3d5), step 8, gated on him.
**His words:** `briefs/dreamzone2_the_game.md` items 25, 29, 33, 34, 37–40, 53, 57, 58, 65. **Mine:** `handback/p-l164-movement-E_2026-11-11.md` (the movement map), `handback/p-l170-scale-E_2026-11-12.md` (the scaling), `briefs/dreamzone3_design.md` §4.
**Options only; nothing decided, nothing built.**
**Marking:**
- **[his N]** is his item;
- **[code]** is dreamzone-3 at `cab3530`, file:line;
- **[inferred]** is mine;
- **[option]** is a proposal.
**Cost scale:**
- **S**: parameters only, in `sim/params.h`;
- **M**: a new rule inside one module;
- **L**: crosses modules (sim with chase, or sim with gen);
- **+V/A**: needs visuals or sound of its own.

## 0. What is underspecified or contradictory, first (a valid answer, per the packet)

1. **What "starting" means.**
   - [his 33] "you start with like, 6 basic abilities, 4 out of the six will be physical… the other two… psychic… not decided yet".
   - [his 25, 34] Abilities also come from **containers during a run, and reset after it**.
   - [his 29] The psychic loadout opens only "once the character knows of gateway".
   - **So: are the six owned from run 1, or the first pool a run's containers draw from? And are the two psychic ones available before the Gateway reveal?** Each option below works either way. The cost of the psychic two rises if they must be hidden until the reveal.
2. **Six fixed, or slots** [his 33 against his 53]: "tons of base physical abilities or use the megabonk limited slots". Still open (design document, contradiction 3).
3. **The shroud against item 65.**
   - [his 58] The shroud "temporarily makes the entities lose your location".
   - [his 65] "the main hunter always knows where you are".
   - The librarian's note reads the shroud as **the one rule-breaker**, which is why it costs heavy stress. That reading is the librarian's, not his. **Does the shroud blind the hunter, or only the lesser chasers?**
4. **The flashlight cannot be a starting ability as described.**
   - [his 40] It is "unlocked early… you do not spawn with it, you find it in the chests".
   - [his 39] Its psychic partner "takes time to get".
   - It is a found tool, not one of the six. Its fusion is a late ultimate candidate, not a starting one.
5. **Bhop is not a starting ability.** [his 57] It is an "end game perk… for endless", with the mechanic in the base game "very hard". It is excluded from the six, and listed as context only (L164).
6. **Points** [his 58]: physical abilities pay by making you do the move more, not by paying extra. Psychic abilities pay only if you own them. Every option below is shaped to that.

## 1. Physical (he picks four)

| # | option | what it does | chase | generator | cost |
|---|---|---|---|---|---|
| P1 | **Quick Start** (acceleration) | Shorter climb to top speed: `sprint_peak_time` 8 s → ~5 s, and a faster surge [code: `sim/params.h:39`]. His 25 example: "increased acceleration". | [inferred] reaches the chasers' ceiling sooner after every corner. A's fresh-player margin (`chase/SPEED_MODEL.md:289`) shrinks after a juke. My scaling is untouched (counts, not speeds). | none: voids are sized from the unupgraded body, `kBaseMove` (`gen/src/gen.h:138`) | **S** |
| P2 | **Long Stride** (top speed) | A higher `sprint_peak_speed` (+0.5–1.0 m/s at base). His 25 example: "a faster sprint top speed". | [inferred] the straight-line lead grows. The hunter's top is a multiple of the reference speed (`chase/dials.h:22`), not of the player, so this outruns it on straights. His 18 rule (they gain on straights) is the counterweight. | none (`kBaseMove`) | **S** |
| P3 | **Long Slide** (his 57 "super slide") | A bigger slide boost, no fatigue halving, lower deceleration, more steer [code: `params.h:72` slide block]. A slide under a closing grab. | [inferred] more cutbacks through low gaps. Chasers do not slide, so a slide line is a juke line. | none | **S** |
| P4 | **Dive Roll** (his 57 "a dive into a roll that moves with the head") | The dive and the roll steer by the **view**, not the run [code: the dive launches along velocity, `sim/world.cpp:774`]. | [inferred] a sharp direction change without the turn-rate cost: the strongest juke tool here. A's corner levers (P2 side friction, P3 floor) set how much it buys. | none | **M** (dive and roll steering) **+V/A** (C's roll animation) |
| P5 | **Over the Top** (his 57 "diving over top of the shorter enemies like summersault") | A vault over a shorter chaser, as over a low wall. | **L.** The sim does not know chaser bodies; the chase must hand their positions and heights to the controller each tick (L164 §4). Catch reach must exempt the vault's arc. | none | **L** **+V/A** |
| P6 | **Sure Feet** (his 41 "agility") | A faster turn under speed, less speed lost per radian turned, a quicker plant on a reversal. Also faster climbs and mantles [his 41]. | [inferred] the player's turning circle shrinks against the chasers' (`chase/chaser.h:8-11`), which is the juke in his 18. | none | **S** |
| P7 | **Long Wall** (a longer wall-run) | `wallrun_max_time` 1.6 s → 2.5 s [code: `params.h:101`]. | little | **Against his 14** ("the wall running should be minimal… rare and short"). Longer runs make voids easier. The world does not change (`kBaseMove`), so the void is crossed more easily, not removed. | **S**. **Flagged: against item 14.** |

**Two physical ultimates** [his 33: the four fuse into two]. Options, each a pair:
- **U-Phys-A, "Nimble"** = P1 + P2 [his 25 example, nearly word for word: "together they make you very nimble and fast"]. Briefly, on activation, the peak speed and the acceleration go together **past the soft cap** (`soft_cap_speed` 14). Cost **S–M**: parameters plus a timed state.
- **U-Phys-B, "Flow"** = P3 + P4. While the ultimate lasts, every slide, dive and roll **keeps speed** (no friction, no roll loss). It is the momentum tier (`flow_enabled`, `sim/params.h`, L164 §3) switched on, and a chain of movement XP (item 53) that is easy to keep. Cost **M**.
- **U-Phys-C, "Leapfrog"** = P5 + P6: somersault and land facing back, turned, on a chosen line. It carries P5's **L** cost.

## 2. Psychic (he picks two)

| # | option | what it does | chase | generator | cost |
|---|---|---|---|---|---|
| Ψ1 | **Aura** (his 25, 29, 58: "your own lesser version", "more fleeting than the good god giving it to you", "upgraded to god levels") | For a few seconds chasers **cannot touch you**. They still know where you are [his 58]. | **M:** the catch rule (`run.cpp`, catch reach) gains an exception while it lasts. Chasers keep pursuing, so it buys distance, not invisibility. | none | **M** **+V/A** (the golden light of his item 26 pick 5, a lesser version) |
| Ψ2 | **Shroud** (his 58) | Entities **lose your location** for a while. Heavy stress, and the dream turns "even more scary and horrifying". | **M–L:** the lesser chasers fall to Investigate (`run.h:108`). **The hunter: see §0 item 3.** It needs stress (queue step 5) to have its cost at all. | none | **M** (lesser only), **L** (the hunter too, against item 65) **+V/A** |
| Ψ3 | **Overclock** (his 58 "a spell… that increases max speed by a ton for a little while") | A short burst far above `sprint_peak_speed`, for a psychic build that has no physical speed. | [inferred] like U-Phys-A on a cooldown. The chasers' straight-line gain [his 18] meets a short burst, so a well-timed Overclock is a sprint out of a closing pack. | none | **S–M** |
| Ψ4 | **Lure** (his 58 "an ability that distracts or tricks the entities") | A false trace: the lesser chasers hear or see you where you are not. | **M:** a decoy entry in what a group knows (`Knowledge`, `run.h:253`), which they investigate. [inferred] the hunter is omniscient [his 65], so it fools only the lesser chasers, unless he rules otherwise. | none | **M** **+A** |
| Ψ5 | **Steady** (his 42 fortitude, as an ability) | A meditation in the run: briefly, stress gain halves. | **M:** it needs stress (step 5). | none | **M** |

**One psychic ultimate** [his 33: the two fuse into one]. Options by pair:
- **Aura + Shroud → "Unseen"**: untouchable and unknown for a moment. [inferred] **It must not become Recognition** [his 60–62: Recognition is the rare virtue, not an ability]. If it lasts long, it is.
- **Aura + Overclock → "Carried"**: untouchable and very fast for a few seconds. It is the good god's rescue in miniature (items 28, 30).
- **Shroud + Lure → "Vanishing Act"**: every lesser chaser goes to a false trace while you slip away.
- **The flashlight fusion** [his 37–39: repels what it shines on, frenzies the rest] as the psychic ultimate. **Not a starting ultimate per item 40/39** (§0 item 4). Listed so it is not lost.

**Item 29's ideas, as rare finds, not starters** [his 29]: super sprint (≈ Ψ3 at full), dream flight, and noclip "very rare… too op". [inferred] Noclip crosses the generator's voids and walls and shows the void beyond (item 29's "intermediate zone"). It is **L** in sim, gen and render, and is best as a rare container find.

## 3. What every option leaves unchanged, and what it moves [inferred]

- **The world never moves.** gen sizes voids from `kBaseMove` (`gen/src/gen.h:138`), the unupgraded body, so no ability changes a seed. Abilities make the same voids easier.
- **My scaling (`p-l170-scale-E`) is counts and placement**, not speeds. Abilities move the **catch rate**, so G2's grace steps and M2's mobs should be measured with the six **off** (run 1) and **on** (later), in the paired 150-seed blocks.
- **A's levers** (P1 lead, P2 side friction, P3 corner floor) set how much P4, P6 and U-Phys-C buy at corners. Measure the jukes after A's levers land.
- **Bots can score the S options at once** (parameters). M and L options need their rule built first. **Only his play** says which feel like his game.

## 4. A cheapest first build, if he wants one before choosing [option]

- **P1, P2, P3, P6 + Ψ1, Ψ3**, with ultimates **Nimble** (P1+P2), **Flow** (P3+P6, a variant of the above) and **Carried** (Ψ1+Ψ3).
  - All are S or M.
  - None needs sim and chase coupling.
  - None needs stress, the Gateway reveal or the flashlight.
- **Cost of this set:** about a lap for the parameters and timed states, plus C's visuals for the aura.
- **What it leaves out:** the three he named most vividly. The dive roll that follows the head (M), the somersault (L) and the shroud (M–L, with stress).

## Corrections

- None.

NEXT: librarian put the sheet to him with step 8 when this pointer is read.
