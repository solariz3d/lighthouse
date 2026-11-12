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

## 6. Realistic or a bend? (his item 135, added 01:1x)

**His rule** (item 135, via the plan's addition): mostly realistic, bent stylistically where the setting and lore make sense of it. It is a dream, the in-between.

**A principle for every bend** [inferred]
- **A bend reads as dream-logic when it is consistent and announced, and as a bug when it is silent or random.**
- So every bend gets **the same signature cue**, every time it acts, and nothing realistic ever gets it. The player learns that one cue means "the dream gave you this", the way a game's hit-flash means a hit landed.
- **A suggestion for that signature:** a brief **chromatic shimmer** at the screen's edge (the renderer's existing `chroma` term, `render/renderer.h:94`, pulsed for ~0.2 s), and a soft **inhaled, reversed breath**, one sound used for every bend. It costs almost nothing: the grade pass runs at 0.03 ms (`render/CHANGES.md:153`).
- It fits item 27's "base dream like quality" and the look hand-back's effects, and it uses no Gateway words (item 26).

| tech | realistic or bend | if a bend: what in the dream justifies it | its cue (beyond the shared signature) |
|---|---|---|---|
| **The two-stage sprint** (surge, then the long build, today) | **Realistic.** Humans reach about 90 % of top speed in 2.3–2.8 s; the longer climb is a game stretch (my L161 speed hand-back). | — | none needed. The FOV widening already shows speed (`game/camera.cpp:147-154`). |
| **The peak burns after ~10 s** (shape B's fade) | **Realistic.** USATF: top speed "can only be maintained for approximately 40 meters" (L161), about 3–4 s for a sprinter. A fade after 10 s is generous to the player, not a bend. | — | breath. The camera rig's breathing and winded slump (the first game's, carried over) show it. |
| **A slide re-lights the peak, or refreshes a burst** (shapes A, B) | **A bend.** A slide costs a real body speed; it never refills it. This is COD's slide cancel made a rule, the plan's first named bend. | The dream runs on **motion, not muscle.** In the in-between, the body is a thought of a body, and breaking a line re-lights it. Stillness, not effort, is what tires you here: the hunter feeds on a straight line (item 18). | the shared signature on the re-light, plus a short **rising tone** under the music. The FOV takes a small pulse back up. |
| **Slide boost and slide-hop keeping speed** (today) | **A mild bend.** A real slide decelerates at once, and a jump out of one loses most of its speed. | The same: motion begets motion. | the signature on the slide-hop only, not the plain slide (a slide's boost is close enough to real to go uncued). |
| **The momentum tier** (shape C: each clean move raises the top speed toward 10 m/s) | **A mild bend.** A vault or a roll costs a real runner speed. 10 m/s itself is a trained sprinter's real top (L161). | The dream **rewards flow**: a body that keeps moving goes further than it could in the waking world. It is item 32's resonant aura in miniature, the signal of moving without fear. | the signature on each step up the tier; a **counter** or **pitch ladder** that rises with chain length (item 53's multiplier UI). |
| **The burst itself** (shape A: speed above the run's top, for a few seconds) | **A bend if it passes about 12.4 m/s** (the fastest human measured, L161). Below that it is a realistic sprint tier. | A burst past human speed is **the dream leaking through**. Keep it under 12.4 at base so the bend is the upgrades' (abilities sheet P2, Ψ3), not the base's. | above 12.4 only: the signature, plus **tracers** on the edges (the look hand-back's "tracers" via TAA history weight, about zero cost). |
| **Air strafing and the late bhop** (shape D; item 57) | **A strong bend**, the plan's second named one. Steering and gaining speed in the air breaks physics outright. | **The late perk is the bend earned:** by endless, the character has learned the in-between well enough that **intent steers the body** where the waking world would not. It is the only bend that lets a body outrun what hunts it, which is exactly endless's purpose (item 57: survive the dark one, not escape it). | the signature on each gaining hop; a **hum** whose pitch climbs with the speed gained; **air ripples** from the feet at take-off. Silent when the perk is not owned, because the base hop gains nothing. |
| **Coyote time, the jump buffer, the soft speed cap** (today) | **Invisible game conventions**, not bends a player perceives. | — | **none.** Cueing them would teach the player a bend that is meant to go unfelt. |
| **The dive roll following the head** (abilities sheet P4) | **Mostly realistic:** a roll can be steered a little by the shoulders. | Fully view-steered, it is a mild bend: the dream's body goes where you look. | the signature only when it turns more than a real roll could. That needs a threshold (an angle per second), a number for him. |
| **The somersault over a chaser** (abilities sheet P5) | **Realistic for an athlete** over something waist-high. **A bend** over a full-height chaser. | Over a full-height one, the chaser is **less solid than it looks**. The lesser entities are "thought forms" (the 1983 paper's ¶33, brief item 25's lore), and you pass through their top. | the signature, plus the chaser's form **smearing** as you pass over it. |
| **The noclip power-up** (item 29) | **The largest bend**, by his own design: "very rare… too op". | It **is** the in-between shown: the walls are thin, and beyond them is the void he described. | his own description is the cue: the void beyond the walls, seen only in that state. |

**What this changes in the shapes** [inferred]
- **Shape B** is the most **realistic** (its fade is real); only its re-light is a bend.
- **Shape A's** reset is a bend by definition.
- **Shape C** is a mild bend throughout.
- **Shape D** is the strong bend, kept for endless.
- His rule therefore orders them, most realistic first: **B, then C, then A, then D**. With the cue grammar, every bend in them can be shown as the dream's, not the code's.

## 7. ADDENDUM, 2026-11-12 01:1x (his item 136): the bend's cue IS the distortion layer

**Note for the chair:** item 135 was already in, as §6 (committed 10f82db7 at 01:12; the grep that found no "bend" read the earlier 57b3fd09). This section adds item 136.

**His correction** (item 136, via the plan's addition at 18a13255): a bend's cue comes from the psychedelic-distortion layer, the effects of my L161 look menu (`handback/p-l161-look-E_2026-11-11.md`), run by a dream director (item 27). It is not a new effect. That layer is queue step 14, **not built**.
- **This supersedes §6's "shared signature" (a chroma pulse + a reversed breath).**
- [code] The game deliberately sets chromatic aberration to 0 in the world (`game/world/stage.cpp:192`), so a chroma pulse would also have been a new look.
- The reversed breath can stay as **sound**: the layer is visual.

**What already works without the layer** [code]
- The game already drives the renderer's settings **every frame**. `stage.cpp:658` scales `fogDensity` by speed (`fog_base_ × (1 + speed_haze × haze_)`), and the renderer copies its settings into the frame's constants each draw (`render/src/renderer.cpp:2125-2142`: `taaHistory`, `fogDensity`, `chroma`, `warmth`, …).
- So **any cue made from the renderer's existing numbers** works today, as a per-frame nudge: haze (fog), tracers (`taaHistory`/`taaClip`, `render/renderer.h:75-76`), colour (`saturation`, `warmth`), FOV (`game/camera.cpp:147-154`).
- **The layer's own effects need new code:** breathing (ray-direction warp), flowing and symmetrical repetition (shading), stretching, slicing and depth distortion (projection), recursion and geometry (post passes).

| bend (§6) | the effect from the L161 menu that marks it | needs the layer to read? |
|---|---|---|
| **A slide re-lights the peak / refreshes the burst** (shapes A, B) | **tracers**: a brief smear behind the world as speed comes back. The plan's own example. | **Works without it:** a `taaHistory` pulse for ~0.3 s is a per-frame nudge, like the speed haze already is. The layer makes it richer (tracers on chasers only, with motion vectors), but it reads today. |
| **Slide-hop keeping speed** | **tracers**, shorter than the re-light | **Works without it** (the same nudge). |
| **The momentum tier's steps** (shape C) | **haze breathing** (the plan's example) and **colour enhancement** rising with the chain | **Half.** The colour rise (`saturation` up a step per tier) works now; the breathing needs the layer's ray-direction warp. |
| **A burst past 12.4 m/s** | **depth and perspective distortion** (a dolly-zoom widening) and **visual stretching** | **Half.** The FOV part already exists (the speed widening, `camera.cpp:147-154`, limited to 1.5× `fov_speed_add`); a deeper widening is a setting. Stretching (unequal horizontal and vertical scale) needs the layer's projection. |
| **The late bhop perk** (shape D) | **tracers** on each gaining hop, and **scenery slicing** at the very highest speeds (a rare beat, as the look menu advised) | **Tracers work without it; slicing needs the layer.** The bend reads without slicing: the climbing hum (sound) and tracers carry it. |
| **The view-steered dive roll** past a real roll's turn | **breathing**: one slow contraction of the view as it turns | **Needs the layer.** Without it, no cue; the turn alone may read as a bug at a high rate. **Hold the threshold low until the layer exists.** |
| **The somersault over a full-height chaser** | **tracers on the chaser**: its form smears as you pass | **Accidentally available now, imperfectly.** [code, via C's L165 hand-back as carried in the live edge] the renderer has no motion vectors, so moving objects already **ghost** for up to about 31 frames. That smear exists today, but on every moving thing and never on purpose. The layer would put it only on the passed chaser. |
| **Noclip** (item 29) | **recursion** and **symmetrical texture repetition** on the walls, then **haze** into the void beyond | **Needs the layer**, and a void to render. It is the largest bend and the most layer-dependent. |

**So, against queue order** [inferred]
- **Usable before step 14:** the slide re-light and slide-hop (tracers by `taaHistory`), and the burst's FOV, all as per-frame nudges like today's speed haze. **Shape B's re-light can be cued now.**
- **Waits for step 14:** breathing (the momentum tier, the dive roll), stretching (the burst), slicing (the bhop's top end), recursion (noclip).
- **The dive roll past a real turn should not ship before the layer.** Without its cue it reads as a glitch, which is the very failure item 135 names.

## 8. ADDENDUM, 2026-11-12 01:1x (his item 137): the base kit, and the near-miss surge

**His words** (item 137, via the plan's design note at 4fd12f69): do all the movement mechanics, and let abilities change how you play. The base is sprint, slide, dive and wall-run. And a surge: getting close to corners, doorways or walls raises speed; it compounds and decays, like *Galactic Racer*'s surge.

### 8.1 The base kit: what a player has with no abilities [code]

| verb | as built | where |
|---|---|---|
| walk, crouch | 3.0 m/s; crouch 1.8 m/s | `sim/params.h:34`, crouch block |
| sprint, two stages | 7.0 m/s in 0.6 s, then the long build to 8.75 m/s over 8 s | `params.h:35-40`; `world.cpp:837-851` |
| jump | with coyote time and a jump buffer (0.12 s each); a released jump cuts the rise | `params.h`, jump block |
| slide | at ≥ 5 m/s; +2 m/s, 1.5 s cooldown, halved within 3 s; **slide-hop keeps the speed** | `params.h:70-79`; `world.cpp:918-920, 1110-1128` |
| dive → roll | at ≥ 5 m/s; landing from a dive always rolls, keeping 80 % | `params.h:112-122`; `world.cpp:264-274, 772-786` |
| vault (automatic), mantle or climb | vault ≤ 1.1 m at ≥ 4 m/s; mantle ≤ 2.2 m | `params.h`, vault and mantle blocks |
| wall-run (rare, short) and wall-kick | 1.6 s max; kick 6 up and 4.5 out | `params.h:93-108` |
| ladders | climb and jump-off | `world.cpp:695-712` |
| look-behind | V, view only | `game/bindings.cpp:22,106` |

**Which of §5's shapes belong in the base** [option]
- **B, the peak burns and a slide re-lights it:** base. It is realistic but for the re-light, cheap, and cueable now (§6, §7).
- **C, the momentum tier:** base, as the near-miss surge's **container** (below). Both raise one top speed.
- **A, the burst:** **an ability**, not base (abilities sheet P1/P2-like, or Galactic Racer's second stage, below).
- **D, the bhop:** the endless perk only (item 57).

### 8.2 The near-miss surge

**Sources**
- **Burnout 3: Takedown** (Criterion, 2004) [source: game guides and coverage via search; Burnout fandom wiki]:
  - boost comes from "oncoming-lane driving, near misses, drifting, and air time", and tailgating;
  - boost "can be used immediately… unlike previous Burnout games which required the boost meter to be full";
  - a **Takedown** is the strongest source, and a streak counts takedowns "within 10 seconds of each other".
  - **It is a meter you spend, not an automatic speed rise.**
- ***Star Wars: Galactic Racer*** (Fuse Games, former Criterion staff) [source: coverage, Kieran Crimmins and Matt Webster]: two stages.
  - The **Afterburner** "acts as a standard boost system and gradually refills".
  - The **Ramjet** is "extremely fast but also generates a lot of heat"; keep it on too long and "you'll blow up your vehicle" (risk against reward). Webster wanted "a sort of tactical decision-making".
  - **No near-miss boost was found for it** (the librarian's check, item 137's note, and mine). No numbers are published for heat or cooldowns.
- [inferred] **His surge is Burnout's near-miss source feeding an automatic tier**, and Galactic Racer's heat is the shape of its risk.

**What counts as a near miss** [option, against the plan's rule: reward the pass, not the hug]
- **N1, a convex edge passed at speed:**
  - the player's path comes within **0.6 m** of a convex corner's apex (an outside wall corner, or a door frame's jamb);
  - at **≥ 0.9 × the current top speed**;
  - **and the heading turns ≥ 30° round it, or passes through the frame** (a doorway crossed).
  - Parallel walls never count: they are flat, not convex.
- **N2, a chaser passed:**
  - a chaser's body within **1.6 m** (just past `catch_reach`'s limit of 1.3 m, `chase/dials.h:21`) **and no catch**;
  - at **≥ `sprint_speed`**;
  - the chaser **closing**, not parallel (the relative velocity points toward the player).
  - That is item 53's proximity and L164's option F, the juke made countable.
- **Where the edges come from** [code, inferred]: the generator knows its doors and walls per cell (`EdgeKind::Door`, `Threshold`, `HomeDoor` … in `gen/src/emit.cpp:42-45`, the `wallish` list, at `cab3530`; a first draft cited `:22-25`, which I had read on 8b04508 in L162), and the walk graph knows its corners. A per-chunk list of **edge points** (convex corners and door jambs), handed out the way `WorldFacts` hands out reprieves (`chase/run.h:58`), would let the sim test N1 with no ray casts. It is **gen's** change, small and deterministic.

**The numbers** [option; the first values are for bots, then his feel]

| parameter | value | why |
|---|---|---|
| gain per N1 (an edge) | **+0.25 m/s** | small, so corners pay a little |
| gain per N2 (a chaser) | **+0.6 m/s** | the danger pays more |
| compounding | additive, into the **momentum tier** (`flow`, `world.cpp:163-174`), not a second tier | one top speed, one cue |
| **cap** | surge ≤ **+2.0 m/s** above the run's top, **and never above 12.4 m/s at base** (the human line, §6). Past 12.4 only with an ability, and then it is a cued bend | |
| **decay** | holds **1.5 s** after the last near miss, then falls **0.6 m/s per second** | the flow tier's own `flow_decay_time` is 1.5 s (`params.h:52`) |
| **per-edge cooldown** | **8 s per edge id**: one doorway can't be farmed by circling | Burnout's 10 s streak window is the scale |
| per-chaser cooldown | **4 s per chaser** | one chaser can't be farmed either |
| a hard stop (< 3.5 m/s) | the surge drops to 0 | the flow tier's `flow_break_speed` (`params.h:53`) |

**Two variants on top** [option]
- **S-a, automatic** (his wording): the surge raises the top speed directly. The simplest; it reads as "danger made me faster".
- **S-b, Galactic Racer's heat:**
  - near misses fill the tier as above, but **holding it above a line builds heat, read as stress** (queue step 5);
  - at "redline" the stress roll comes early (the frenzy's 75 %, or a virtue's 25 %, items 28, 32).
  - It gives the surge a cost and a reason to let it fall. **It needs stress, so it comes later.**

**Its bend and its cue** (§6, §7)
- **A bend:** a real runner loses speed at a corner and near a body.
- **Its justification:** the dream feeds on **fear survived**. Passing close to danger, a corner you could have hit or a hand that almost closed, pays you in speed. The hunter feeds on straight lines (item 18), and the dream feeds you for breaking them.
- **The cue:**
  - **tracers**, which work now (§7, a `taaHistory` nudge);
  - a step of **colour enhancement** per near miss, which also works now (`saturation`);
  - on N2, the **chaser's smear** as you pass. It is the accidental ghosting today (§7) and the layer's tracer on that chaser later;
  - and a sound for each pass: a short whoosh, Burnout's near-miss cue in spirit.

**Its tie to XP** (items 53, 57, 58)
- Each near miss is a **chain link** (L164 option F).
- **N2 pays far more XP than N1**, with the proximity multiplier of item 53 (the closer the chaser, the more).
- N1 pays little, so corner-farming is not worth the cooldown.
- An ability that makes near misses easier (abilities sheet P4 dive roll, P6 sure feet) makes you **do** more of them, item 58's rule, not pay more for each.

**What bots measure, and what only he can** [inferred]
- **Bots:**
  - near misses a minute for each policy (flee, juke, line);
  - that the per-edge cooldown holds (a loop-one-door bot gains nothing after the first pass);
  - the surge's mean and peak;
  - the catch-rate change in A's paired 150-seed blocks;
  - that the base never exceeds 12.4 m/s (an invariant row).
- **Only he:** whether it **feels** like "danger made me faster" or like a random speed-up, the thresholds (0.6 m, 1.6 m, 30°), and the cue's strength.

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
