# p-l172-chaser-kit-E: a kit for every chaser, against the new movement (his item 141). Pane E, on L, 2026-11-12, written from 01:28 local (`date`)

**Packet:** the chair's L172, 07:27:04Z. **Plan:** `loop/plan_l172_chaser_kit_design_2026-11-12.md` (01085bfd), read whole.
**His words:** `briefs/dreamzone2_the_game.md` item 141 (with 18, 25, 29, 30, 64, 65).
**Design only; nothing built.** dreamzone-3 read only at `cab3530` (`git log -1`): `chase/speed.h`, `chase/archetype.cpp`, `chase/dials.h`, `chase/run.{h,cpp}`, `chase/SPEED_MODEL.md`. A's levers are read from `handback/p-l169-code-A_2026-11-12.md` §4.
**Marking:**
- **[code]** is file:line;
- **[computed]** is the code's own formula, evaluated by me (not a run);
- **[measured]** is a bot run or his run record;
- **[inferred]** is mine;
- **[option]** is a proposal.

## THE PREMISE, CHECKED: the base player is NOT too fast; the upgraded one is, early, on the easy levels

**The chasers' top on the flat** [code, `chase/SPEED_MODEL.md`; `speed.h:22-35, 52-61`]:

    top = ref_speed (8) × row × dial(t) × (1 + distance_gain) × (1 + run_up ≤ 0.20 on a straight)

- The hunter's row is its dial, `hunter_speed` (0.95 + 0.04/min, to 1.50; `dials.h:22`), plus `hunter_start_bonus` 0.17, fading over 600 s (`speed.h:52-55`).
- Lesser rows: sprinter 1.45 (`archetype.cpp:36`), interceptor 0.90 (`:62`), pack 0.92 (`:90`), crawler 0.80 (`:145`), each × `lesser_speed` (1.0 + 0.01/min to 1.12).
- `distance_gain` = 0.05 per km, to 0.30. I assume the player covers about 8 m/s on average; [inferred], to be measured.

**Computed** (`node -e` over those formulas; the four levels' `start_minutes` and `pace`, `dials.cpp:17-38`), in m/s, flat (straight with full run-up):

| level, time | hunter | sprinter | interceptor | pack | crawler |
|---|---|---|---|---|---|
| normal, 0 min | 9.0 (10.8) | 11.6 (13.9) | 7.2 | 7.4 | 6.4 |
| normal, 2 min | 9.8 (11.7) | 12.4 (14.9) | 7.7 | 7.9 | 6.8 |
| normal, 5 min | 11.1 (13.3) | 13.6 (16.4) | 8.5 | 8.7 | 7.5 |
| normal, 10 min | 13.4 (16.1) | 15.8 (19.0) | 9.8 | 10.0 | 8.7 |
| brutal, 0 min | 10.6 (12.7) | 12.2 (14.6) | 7.6 | 7.7 | 6.7 |
| brutal, 5 min | 13.9 (16.7) | 14.6 (17.5) | 9.0 | 9.2 | 8.0 |
| gentle, 0 / 5 min | 9.0 / 10.3 | 11.6 / 13.4 | 7.2 / 8.3 | 7.4 / 8.5 | 6.4 / 7.4 |

**The player's top** [code + L171 §8.4]:
- **Base:** the run's peak 8.75 m/s (`sim/params.h:38`); with the full surge +2.0 → **10.75**; never past 12.4.
- **Upgraded** (Long Stride and the §8.4 stack): peak about 9.75, surge +3.0 → **12.75**, ceiling 13.5; Overclock briefly about 14.

**What that shows** [computed → inferred]
- **The base player is slower than the hunter at the start of every level.** On normal, 8.75 against 9.0 flat and 10.8 on a straight. **The full surge (10.75) only matches the hunter's straight.** The sprinter out-runs everyone on a straight.
- **The upgraded player** (12.75) out-runs the hunter on normal until about 5 min (11.1 flat, 13.3 straight), and every lesser kind except the sprinter, the whole time. On brutal, only for the first minute or so.
- **[measured] Real chases are not decided by top speed.**
  - His brutal run (item 64): the hunter "held 9–15 m behind" at about 8.8 m/s and never closed. **The pack ahead caught him**, at 120 s.
  - A's sweep: the flee bot is never caught in about 62 of 96 runs on normal. Catch power is lost **at corners** ("858 m given back at corners", A §5), not on straights.
- **So the premise, corrected:** the player is not too fast; **the chasers are too slow round corners, and none of them answers a technique.** The kit should be about **answering techniques** (what item 141 asks for), and A's corner levers about **catch power**. More top speed would not fix either.

## 1. One signature per kind (options; each answers ONE technique, costs it, does not cancel it)

| kind | lore | signature [option] | answers | tell | cost to build |
|---|---|---|---|---|---|
| **Hunter** (the malevolent god at play, item 30; omniscient, item 65) | it feeds on fear | **Appetite:** while the player's **surge** is above +1.0 m/s, the hunter's run-up builds at twice `straight_rate` (`speed.h:25`). Speed feeds it. | **the surge held on straights** (L171 §8) | its thunder footsteps (item 16) **quicken** as it feeds; one slow breath of the distortion layer (L171 §7) | **S–M** (a multiplier read from the player's surge) |
| **Sprinter** (careless, `corner_care` 0.5, `archetype.cpp:42`) | a thought form of pure pursuit | **Lunge:** within 6 m on a straight, a 0.4 s burst of +15 % (the first game's lunge was ×1.12, `dreamzone-rt/src/main.cpp:5796`), then it overshoots and swings wide | **the long straight / Long Stride** | a half-second crouch and a hiss before the lunge | **M** |
| **Interceptor** (spawns ahead, `Aim::Ahead`, `archetype.cpp:61`) | it waits where you will be | **Mirror:** at under 8 m ahead it matches your side of the corridor (your lateral offset), so a straight overtake meets it head-on | **the overtake** (L171 §8.3). A slide-under or a dive-roll still passes it | it turns its head to track you; a tick, faster as it mirrors | **M** (a lateral target in its steering) |
| **Pack** (three bodies, one group, `run.h:141`) | lower-energy beings that hunt together (item 25) | **Call:** when one hears a **sprint** (the loud straight), it shares your position with **every** lesser chaser alive, not only its own group | **the loud sprint, and Lure/Shroud** (abilities Ψ4, Ψ2): a pack sniffs a decoy out after 3 s | a rising call that the others answer | **M** (shared knowledge across groups) |
| **Climber / crawler** (sent to unreachable ground, `run.h:12-15`) | a thought form that ignores the waking world's rules | **Through:** once per spawn, it passes one thin wall (a cell edge, never a slab) toward you | **the safe corner, the ledge** | the wall **slices** (L171 §7's scenery slicing) a second before it comes through | **L** (a nav link through a wall edge; gen and chase) |
| **Stalker** (a row only: `blink_telegraph_s` 1.5, `blink_cooldown_s` 4, `blink_min_distance` 12; `archetype.cpp:127-134`) | it moves only between your glances | **Unseen:** it advances (the row's blink) **only while you are not looking at it**, behind you or through V; seen, it freezes | **the look-behind (V)**: looking costs time, not looking costs ground | each glance shows it **nearer**; a breath when it blinks | **M–L** (a view test per tick from the player's camera, which the sim does not have today) |
| **Charger** (a row only: windup 0.6 s, ×3 speed for 1 s, a 2 s stun on a wall; `archetype.cpp:112-123`) | a blunt hunger | **Charge:** in open space (an atrium or a hall) it winds up and charges your line; a wall stuns it | **the open room crossed in a straight line**; a cut behind a pillar makes it hit the wall | a rising roar during the windup (the first game's `[CHARGE]`, `dreamzone-rt/src/main.cpp:4963`) | **M** (the row's numbers exist) |

### Each signature against the player's abilities (abilities sheet ids)

| player ability | countered by | beats |
|---|---|---|
| Long Stride (P2) | Hunter's Appetite, Sprinter's Lunge | the interceptor and pack (they are slower) |
| Quick Start (P1) | Charger (a quick start into an open room meets the charge) | the stalker (more ground per glance) |
| Long Slide (P3) | — (the slide is the answer to Mirror) | the interceptor's Mirror |
| Dive Roll (P4) | the pack's Call (it gives your position away anyway) | Mirror, and the sprinter's Lunge (turn inside it) |
| Sure Feet (P6) | — | the sprinter (it cannot turn), the charger (cut behind a pillar) |
| Aura (Ψ1) | the stalker (an aura stops a touch, not a blink closer) | the Lunge, the Charge |
| Shroud (Ψ2) | the pack (it sniffs after 3 s); the hunter if he rules it omniscient (abilities sheet §0.3) | the interceptor, the stalker |
| Overclock (Ψ3) | **the hunter's Appetite**: Overclock is the biggest surge, so it feeds the hunter most | everything else, briefly |
| Lure (Ψ4) | the pack (decoy sniffed) | the interceptor, the sprinter |

## 2. Pathing: which of A's levers each kind carries (A §4: P1 lead, P2 side friction or "slip", P3 corner floor)

| kind | P1 lead | P2 side friction (low = it slips wide, the slosh of item 130) | P3 corner floor | so it moves like |
|---|---|---|---|---|
| hunter | medium (it is told where you are, item 65) | medium | **high** (it keeps speed through corners: the catch power) | a heavy thing that does not slow down at corners |
| sprinter | none | **low** (high slip: the widest slosh) | low | fast, careless, overshooting every corner |
| interceptor | **high** (it goes where you will be) | high (it holds its line) | medium | precise, cutting you off |
| pack | low | medium | medium | three bodies spreading (with A's P6 separation) |
| crawler | none | high | low | slow and deliberate |
| stalker | none | — (it blinks) | — | still, then nearer |
| charger | **straight line** at the charge (no lead after the windup) | none during the charge | — | a battering ram |

[inferred] This gives each kind a **different motion**, which is what item 141's "make the ai pathing good" can mean in play, as well as different numbers.

## 3. Registrable bot tests (A's paired 150-seed method; register each before it runs)

For each signature: **(a) it costs the matching technique**, and **(b) the technique still pays.**

| signature | (a) costs | (b) still pays |
|---|---|---|
| Appetite | a surge-holding bot's survival falls ≥ 15 % against the control | the surge-holding bot still outlives a bot with no surge |
| Lunge | the Line bot's median catch time falls ≥ 20 % | the juke bot's survival changes ≤ 5 % (a turn beats a lunge) |
| Mirror | overtakes of interceptors a minute fall ≥ 30 % | the overtake still pays, and the slide-under arm overtakes ≥ 70 % of the control |
| Call | the sprint-everywhere bot's survival falls ≥ 15 % | a bot that sprints only on corners changes ≤ 5 % |
| Through | the ledge-sitter's survival falls ≥ 30 % | no catch ever comes through a slab (an invariant row) |
| Unseen (stalker) | **needs a bot that looks back**, which no policy does today: a look policy must be written first | — |
| Charge | the straight-across-the-room bot is caught more in atria | a pillar-cut bot changes ≤ 5 % |

## 4. A short menu for him

- **R1, one answer per kind** (the table above, all seven). It is the fullest; the stalker and the crawler's Through are the costly two.
- **R2, the hunter carries the answer** (Appetite only) plus A's corner floor, with the lesser kinds kept plain. The cheapest. It answers the surge and nothing else.
- **R3, horror first:** the stalker (Unseen), the crawler (Through) and the hunter (Appetite). It trades speed answers for fear, closest to items 43–45, and costs the most per kind.

## NOT verified

- **The speed table is computed from the code's formulas, not measured.** The distance gain assumes an average of 8 m/s. A bot sweep that logs each chaser's speed against the player's would replace it. A's `dz-chase` already has the arms for it; not run here (no runs in this lap).
- **"The hunter held 9–15 m behind at ~8.8 m/s"** is item 64's replay (brief), not re-run.
- **A's "858 m given back at corners"** is quoted from his hand-back §5.
- The stalker's view test and the crawler's wall link are costed by reading, not by trying.

## Corrections

- None.

NEXT: librarian put the menu to him, with the corrected premise first, when this pointer is read.
