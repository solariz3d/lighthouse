# p-l171-movement-tech-E: movement tech that rewards skill, and what makes movement addictive (his item 134). Pane E, on L, 2026-11-12, written from 01:10 local (`date`)

**Packet:** the chair's L171, 07:09:39Z. **Plan:** `loop/plan_l171_movement_tech_research_2026-11-12.md` (af62ddd2), read whole.
**His words:** `briefs/dreamzone2_the_game.md` item 134 (with 13, 18, 21, 53, 57). It builds on my L164 (`handback/p-l164-movement-E_2026-11-11.md`), which is not repeated.
**Research only; nothing built.** dreamzone-3 was read only at `cab3530` (`git log -1`): `sim/params.h`, `sim/world.cpp`.
**Marking:**
- **[source]** is a cited source;
- **[code]** is dreamzone-3, file:line;
- **[inferred]** is mine;
- **[option]** is a proposal.

## THE PREMISE, CHECKED FIRST: half right, and one part inverts our sprint

- **Right:** COD's modern movement **is** a limited fast tier, Tactical Sprint, plus a slide that, in MW2019, refreshed it [source, below]. A reset mechanic gives a skilled player something to do every few seconds.
- **The part that does not fit as said:** "if you sprint for longer than 10 seconds" tiring.
  - [code] In dreamzone-3 **sprinting longer makes you faster, not slower.** The long build raises the top speed from `sprint_speed` to `sprint_peak_speed` over `sprint_peak_time` 8 s of unbroken sprinting (`sim/world.cpp:842-851`, `sim/params.h:36-40`).
  - That build was **his** design: items 13 and 21 ("ramps up and takes a little while just like a real sprinter", "slowly continues to pick up a bit of speed").
  - Item 18 also rules out stamina ("it should be a always fast paced survival situation").
- [inferred] **So a COD reset here should be a bonus tier above the run, not a tiredness under it.** The base sprint never runs out (items 18, 21). A **burst** on top does, and a slide (or a clean move) refreshes it. Shapes A and B below do this two ways; shape C needs no timer at all.
- **The plan's phrase "a sprint that tires after about 10 s":** taken literally, it contradicts items 18 and 21. Shape B keeps his "10 s" without breaking them.

## 1. COD's modern movement, from sources

**Modern Warfare (2019)**
- [source: Call of Duty Wiki, "Tactical Sprint"] Tactical Sprint "dramatically increases the player's sprint speed at the cost of a higher weapon ready time and a limited duration". It is activated by **double-tapping** sprint, and its duration is "determined by stamina which regenerates over time after each use".
- [source: same wiki, "Double Time"] The perk "doubles the player's Super Sprint duration". In 1.14.0 it also "halves the recharge time".
- **Slide cancel** [source: guides, Dexerto and Twinfinite 2020]: slide, then cancel the slide's animation (crouch or jump), which **resets Tactical Sprint**. "Sliding every 3-5 seconds" is said to keep it up indefinitely, and chaining lets you keep speed across a map. One analysis: the resets were "tweaked occasionally", and "most of the time, the player had to slide cancel twice".
- **The numbers** (Tactical Sprint seconds, recharge, slide speed): **not found in any source I could open.** No TrueGameData page or official figure surfaced. The figures circulating are unsourced, so none is given here.

**Modern Warfare II (2022)** [source: Dexerto, Charlie Intel, GGRecon]
- **Slide cancelling was removed**, and Infinity Ward patched a beta workaround. Players used other tricks ("unlimited Tactical Sprint" glitches, reported by Sportskeeda and Charlie Intel).

**Modern Warfare III (2023)** [source: Activision's movement announcement, as quoted by GGRecon, Gfinity and Dbltap; the post itself was not opened]
- "slide animations can be canceled but will not reset Tactical Sprint".
- "longer Tactical Sprint durations which recharge while sprinting".
- Faster mantling, mantling while sprinting, and firing during and after a slide.
- [source: Sledgehammer's later post, quoted by Dexerto] "at Launch, we introduced a delay after sliding to the Tac Sprint refresh time". The November 17 update **reduced** that delay.
- [source: coverage of the change] Its stated aim: "players won't be forced to repeat the action over and over again like in the past".

**Black Ops 6 (2024): omnimovement** [source: coverage; Treyarch's post was not found]
- Sprint, slide and dive **in any direction**, not only forward. "It hasn't been possible in any Call of Duty game so far."
- Tactical Sprint stays **forward only**.
- Matt Ronson (associate director of design): "core foundational mechanic", which cannot be turned off.
- Separate "Intelligent Movement" assists (auto-sprint, auto-mantle, and the like) reduce button presses.
- [source: one guide] players "no longer need to slide cancel".

**What COD teaches** [inferred]
- The reset was loved by the skilled and became **a chore** for everyone: a near-mandatory input tax, which MW3 named as its reason.
- **The healthy form pays a skilled player more without punishing one who does not do it.** MW3's sprint "recharges while sprinting", and the slide adds only a little.

## 2. Others, briefly (only what is new since L164)

- **Apex Legends** [source: PC Gamer, Aug 2021; Dot Esports]
  - Respawn announced removing **tap-strafing** (a quick direction change after a slide jump, on mouse and keyboard): "It's inaccessible, lacks readability/counterplay, and is exacerbated by movement abilities."
  - The removal was later **put on hold** over "unexpected side effects".
  - [inferred] A tech the other side cannot read is unfair. **Here the other side is a chaser**, so readability matters to the player only, which makes us freer than Apex.
- **ULTRAKILL** (Arsi "Hakita" Patala) [source: player guides and wiki, no developer statement found]
  - Jumping out of a dash "retain[s] the dash's momentum", which carries into a slide and slide-hops.
  - The slide can be "canceled and restarted instantly for rapid and flexible directional changes".
  - "Slam storage" (store a slam's velocity with a wall jump) is called an "ascended glitch".
  - [inferred] Its depth comes from **momentum carried from one verb into the next**.
- **Mirror's Edge, Titanfall 2:** in L164. Momentum preserved through a chain is the reward. The slide-hop keeps speed.
- **Neon White:** in L164. Movement abilities are one-shot resources, so every movement verb is a decision.

## 3. What makes movement addictive, from game-feel sources

- **Steve Swink, *Game Feel*:** "real-time control of virtual objects in a simulated space, with interactions emphasised by polish" [source: quoted in arXiv 2011.09201]. His categories include "the aesthetic sensation of control" and **"the pleasure of learning, practising, and mastering a skill"**. Polish removed, "the essential functionality… would be unaltered, but the player would find the experience less perceptually convincing" [source: the same reviews].
- **"Juice it or lose it"** (Martin Jonasson and Petri Purho): cited as the reference for feedback "juice". I did not open the talk.
- **The skill-ceiling shape** [inferred, from COD, Apex and Titanfall above]:
  - an **easy floor** (hold sprint and you run well);
  - a **deep ceiling** (resets, chains, hops);
  - tech that is **discovered**, not taught.
  - The ceiling must **pay and never be a tax** (MW3's lesson), and must be **readable** to whoever must answer it (Apex's lesson).
- **Rhythm and constant small decisions** [inferred]: COD's 3–5 s slide rhythm and Titanfall's slide-hop give an input every few seconds that the player chooses to make.
- **"Made by someone with ADHD"** (his phrase), read as the plan says: **high stimulation, constant small decisions, instant feedback, no dead time.**
  - **I found no designer who has spoken to that as a movement principle.** The nearest are a secondhand interview with James Hewitt ("riding the wave"), Colleen Macklin on a podcast, and Gerling et al. 2024 (ACM TOCHI, on representation, not mechanics) [source: search results].
  - Nobody is diagnosed here; it is read only as a pace.
- **Feedback he already has or asked for** [code and his items]:
  - the FOV widens with speed (`game/camera.cpp:147-154`; his 27: "enough to feel speed, never fish-eyed");
  - the camera body's bob, lean and nod (the first game's rig).
  - **Missing:** a sound or visual tick when a reset or chain link lands, and a counter (item 53's "minimalistic horror sci fi" multiplier UI).

## 4. Against dreamzone-3's controller (`cab3530`)

**What exists** [code]
- **Sprint in two stages:**
  - walk → `sprint_speed` 7.0 over `sprint_build_time` 0.6 s;
  - then the long build to `sprint_peak_speed` 8.75 over `sprint_peak_time` 8 s (`params.h:35-39`);
  - it rises only while sprinting on the ground at ≥ 0.9 of the top speed (`world.cpp:846-848`);
  - it is kept through a jump and while cornering, and spent by letting go or dropping under half of `sprint_speed`, over `sprint_peak_release_time` 1 s (`:843-850`, `params.h:40`).
- **A slide holds the peak:** in the Slide state neither the rise nor the release branch runs (`:846-849`). inferred: read from the conditions, not run.
- **Slide boost:** +2 m/s, cooldown 1.5 s, halved again for each boost within 3 s (`params.h:72-74`; `world.cpp:1110-1124`).
- **The slide-hop keeps the slide's speed** (`world.cpp:918-920`).
- **The momentum tier:** `flow_enabled` 0, off. When on, each vault, mantle, wall-kick, roll or slide raises the top speed toward `flow_cap` 10, held by a 2 s chain window (`params.h:46-53`; `world.cpp:163-167`).
- **The soft cap** is 14 m/s and the hard cap 20.

**What his idea would need** [inferred]
- a **burst tier** (a speed added above the run's top);
- a **timer** for it (his "10 s", or COD's few seconds) and a **recharge**;
- a **refresh event** (the slide, or any `flow_transition` move);
- a **refresh delay** (MW3's anti-spam);
- **feedback** when it fires.
- In every case, `kBaseMove` (`gen/src/gen.h:138`) keeps the world unchanged; voids get easier, never move.
- The chase sees a faster player in bursts. A's speed model (the chasers' own reference speed, gaining on straights) is the counterweight: [his 18] a burst on a long straight is eaten back unless a corner follows.

## 5. The menu: four movement-system shapes (options, not a design)

| shape | how it works (parameters) | minute 1, a new player | hour 20, a skilled one | chase | XP tie (items 53, 57, 58) | cost |
|---|---|---|---|---|---|---|
| **A. COD-like burst + reset** | A burst `burst_add` (+1.0–1.5 m/s over the run's top) for `burst_time` (≈4–6 s), recharging over `burst_recharge` (≈6–8 s). A **slide refreshes** it after `refresh_delay` (≈0.3–0.6 s, MW3's lesson). Double-tap sprint, as COD does, or automatic at peak. | sprint → double-tap → a burst; it fades, and comes back | slides placed every few seconds keep the burst nearly always on, weaving round the hunter's straight-line gain | bursts widen gaps on straights; refresh points are corners and slides, which is where A's chasers lose speed anyway | each refresh is a chain link; a **Quick Start / Long Slide** ability (abilities sheet P1, P3) makes you do it more (item 58's rule) | **M**: a timed state, a refresh event, feedback |
| **B. His literal idea, made legal: "the peak burns"** | The long build stays (items 13, 21). After `peak_hold_s` ≈ 10 s **at peak**, the part above `sprint_speed` **burns down** (not below `sprint_speed`: no stamina, item 18) unless a slide, vault or roll **re-lights** it. | runs as today; after 10 s at full speed it eases back to fast-but-normal | re-lights with a slide every ~10 s, holding the peak forever | the chase sees the same peak with more breaks in the line, which is a small change | each re-light is a chain link; a cheap, readable rhythm | **S–M**: a timer on `peak_level` plus the re-light event |
| **C. Titanfall-like flow (momentum tier on)** | `flow_enabled` 1: each clean move adds `flow_transition_bonus` 0.5 m/s toward `flow_cap` 10, held for `flow_chain_window` 2 s, lost on a hard stop (< 3.5 m/s). **It exists today, switched off.** | the run feels like today until he vaults or slides; then a little faster | chains vault → slide → hop → wall-kick to 10 m/s and holds it | the fastest player of the three; corners keep it (a chain is moves, not straights), so A's corner levers matter less | **the chain is the tier:** L164 option A (`flow_transition` events) counts it directly | **S** for the tier (a dial); feedback **+V/A** |
| **D. Endless hop (overlay, not a base)** | L164's landing-friction window and `air_strafe_gain`, hard at base, loosened by a late perk [his 57] | invisible: hops are barely faster | in endless, hop chains past the soft cap to survive the dark one | the only shape built to escape a chaser on purpose | hop count as chain links | **S–M** (L164) |

**Combinations** [inferred]
- **B + C** is the closest to "no dead time": always a reason to make the next move, and nothing ever runs out.
- **A** is the most COD-like and the most like a button-tax, unless its refresh is a bonus and not a requirement.
- **D** sits on top of any of them, for endless only.

**What bots can measure, and what only his play can** [inferred]
- **Bots:** the catch rate per shape, with a chaining policy and a plain one (A's paired method); how long the burst or peak is held; chain length; and that `kBaseMove` holds (the world's fingerprints unchanged).
- **Only he:** whether the reset reads as fun or as a chore, whether the rhythm is "no dead time" or busywork, and which feedback sells it.

## Sources

- Call of Duty Wiki: "Tactical Sprint", "Double Time" (fandom).
- Dexerto, "How to slide cancel in Modern Warfare" and "How to get unlimited Tactical Sprint in Modern Warfare"; Twinfinite on the MW2019 slide cancel; Charlie Intel and GGRecon on MW2's removal.
- GGRecon, Gfinity and Dbltap quoting Activision's MW3 movement announcement (Aug 2023); Dexerto and ESTNN on Sledgehammer's Nov 17 update (the refresh delay reduced).
- Coverage of Black Ops 6 omnimovement (Siege.gg, Gfinity, Insider Gaming quoting Matt Ronson on the Call of Duty podcast).
- PC Gamer, "Say goodbye to Apex Legends' best movement exploit" (Aug 2021); Dot Esports on the pause.
- ULTRAKILL wiki (wiki.gg) and player guides.
- Swink, *Game Feel* (via arXiv 2011.09201 and reviews); Jonasson and Purho, "Juice it or lose it" (cited, not opened).
- Hewitt (secondhand), Macklin (podcast), Gerling et al. 2024 (ACM TOCHI): search results.

## NOT verified

- **COD's numbers** (Tactical Sprint seconds, recharge, slide speed and cooldown): not found in a source I could open.
- **The official COD posts:** read only as quoted by coverage.
- **"A slide holds the peak"** is [inferred] from the conditions at `world.cpp:846-849`; not run.

## Corrections

- None.

NEXT: librarian put the menu to him with queue step 9 (E's movement questions) when this pointer is read.
