# Research: a pursuer that lurks and ambushes a player who is out of reach. Scout, 2026-11-13

Research only. Nothing built, run or committed. Written by a research scout, not the librarian seat.

**Marking.** [read: URL] = I opened it and read the text. [summary: URL] = a search snippet or secondary article only. [inferred] = my reasoning. Where I fetched a PDF and ran `pdftotext` on it, that counts as read.

## 0. What the room already has (not repeated)

| Already answered | Where |
|---|---|
| Left 4 Dead (Booth, GDC 2009): reactive path following, algorithmic climbing, spawn "not visible by the Survivor team", the Director's four phases | `handback/p-l169-games-E_2026-11-12.md` sections 1 and 4 |
| Our chase's replan timing, steering, the dedicated climber sent after `ledge_patience_s`, `find_site` skipping sites the player can see | same file, section 4 table and its "Corrections" block (:202-206); `handback/p-l169-code-A_2026-11-12.md` |
| The hunter always knows where the player is (his item 65) | `loop/buildpath_chase_entities_2026-11-13.md:17` |
| "Climb for every kind" would end the ledge escape | `loop/buildpath_chase_entities_2026-11-13.md:65` (section 4, item 5) |

Nothing on disk covers lurking, withdrawal or ambush from an unreachable player. So that is what this file adds.

Two lines from Booth's deck that E read but did not quote for this purpose: the nav mesh answers "Where is a spot near the Survivors, not visible to any of them?" and "Is area X potentially visible by area Y?"; and "Smokers attempt to select areas above the Survivor team" [read: https://cdn.fastly.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf, re-fetched and run through `pdftotext`]. Valve already had the query we need. They used it for spawning, not for waiting.

## 1. The finding in five lines

1. No source I could open describes a pursuer that withdraws and waits near an unreachable player. The closest is Alien: Isolation, and it is a bounded, director-driven version.
2. Every shipped system that does this bounds it in time and gates it by a pressure meter. None waits forever.
3. Hiding that reads as intelligent is usually a side effect of a simple rule (F.E.A.R.'s Orkin says so in plain words).
4. The usable position rule: reachable by the pursuer, hidden from the player's eye, close in travel time to where the player must come down. Real ambush predators pick the same kind of spot.
5. Fairness in every source rests on tells (sound, a glimpse) and a time cap, not on the pursuer being dumb.

## 2. Shipped games

| Game | What it does | Data it needs | Fairness and tells | Players |
|---|---|---|---|---|
| **Alien: Isolation** | Two layers. A director knows where the player is and "advises it to head towards your general" area; the alien "has to figure it out for itself" [read: https://www.gamedeveloper.com/design/revisiting-the-ai-of-alien-isolation]. A "menace gauge" rises with nearness, line of sight and motion-tracker blips; at peak the director "backs off and sends the alien elsewhere" [read: https://www.gamedeveloper.com/design/the-perfect-organism-the-ai-of-alien-isolation]. Active ("frontstage") sweeps and searches; passive ("backstage") goes to the vents, "up ahead it thinks you're going to move towards" [read, same page]. Ambush flags in the tree after a hit-and-run: "set up an ambush in the vents"; "Each ambush has a set duration and after a time the alien will give up and move on unless provoked" [read: revisiting page]. | Player position (director only), noise events, a search area with a shrinking radius: "The stalk radius gets tighter on subsequent passes" [read: revisiting]. A predicted route (vents ahead). | Attacks need sight or contact. Vents, lockers and doors make no sound the alien reacts to. Detections decay and are forgotten. Designers can mark areas it never looks at, to avoid unfair spots. Harder difficulty cuts backstage time. Its view is four cones and builds with time in a cone [all read: revisiting]. Behaviours unlock on player action, never on player death [read: perfect organism]. | The two articles carry none. The press framing that its AI "cheats" is [summary: https://www.escapistmagazine.com/alien-isolations-xenomorph-is-terrifying-even-when-you-understand-how-its-ai-cheats/]. Not read. |
| **Left 4 Dead** | Waiting is replaced by placement. Specials spawn in a "valid area in the AAS not visible by the Survivor team"; 75 % of mobs come from behind; the Director's Relax phase of 30-45 s cuts the population [read: Booth deck]. Smokers choose areas above the team [read: Booth]. | Nav mesh, flow distance, "potentially visible" sets, per-survivor intensity. | The pressure has a shape (Build Up, Sustain Peak 3-5 s, Peak Fade, Relax). | I found nothing on how it treats a camping survivor. A search returned only mapping and script pages: spawns avoid line of sight and sit at middle distance [summary: https://developer.valvesoftware.com/wiki/L4D_Mapping_Notes]. |
| **F.E.A.R.** | A cover-driven planner with an Ambush goal: when an AI's cover is compromised "he will try to hide at a node designated by designers as an Ambush node" [read: https://pages.cs.wisc.edu/~dyer/cs540/handouts/gdc2006_orkin_jeff_fear.pdf]. Flanking is not coded: "It appears that the A.I. is flanking, but in fact this is just a side effect of moving to the only available valid cover he is aware of" [read, same PDF]. Four simple squad behaviours (Get-to-Cover, Advance-Cover, Orderly-Advance, Search) "often create the illusion of more complex squad behavior than what actually exists" [read]. | Hand-placed cover and ambush nodes; the threat's position. | Dialogue lets the player know what the AI is thinking [read]. | Not read. |
| **Killzone** | Position picking by an evaluation function: a weighted sum of annotations per candidate (for example line of fire to the primary threat 40 if partial cover, 20 otherwise; cover from secondary threats weight 20; inside preferred range weight 10). The same function picks suppression targets "from his perspective" [read: https://www.guerrilla-games.com/media/News/Files/gdce05_killzone_ai.pdf, via `pdftotext`]. | Waypoints annotated with cover and line of fire; the threat's position. | Not covered in the slides. | Not read. |
| **Resident Evil 2 remake (Mr. X)** | No developer account opened. The PC Gamer interview page came back truncated. Secondary pages say he is driven by sound and tracks the player [summary: https://www.pcgamer.com/resident-evil-2s-director-talks-mr-xs-ai-scary-footsteps-and-the-dmx-mod]. | n/a | Footsteps as a telegraph is the common claim, unconfirmed. | Not read. |
| **Amnesia: The Dark Descent** | A search snippet attributes to Grip's GDC Europe 2011 talk that monsters were designed not to hunt hiding players hard, but to "move close to their hiding place and then move away" [summary, snippet only]. The Game Developer recap I opened says nothing about it [read: https://gamedeveloper.com/business/gdc-europe-i-amnesia-i-s-grip-delivers-terrifying-tales-of-immersion]. **Unverified.** | n/a | The recap says the game "takes care" of the player and "deliberately doesn't push challenge" [read]. | n/a |
| **Dead by Daylight** | Human killers, not AI. The terror radius (about 32 m for most killers) is a tell the player hears [summary: https://deadbydaylight.wiki.gg/wiki/Terror_Radius]. Some killers can suppress it to surprise. | n/a | The tell and its suppression are the fairness lever. | Nothing read on camping complaints. |

## 3. Choosing the hiding spot

| Technique | The rule | Data | Source |
|---|---|---|---|
| Nav-mesh visibility queries | "Where is a spot near the Survivors, not visible to any of them?"; "potentially visible" area sets | Per-area visibility, built once | [read: Booth deck] |
| Position evaluation function (Killzone) | Score each candidate by weighted factors, pick the max. Tune by changing weights | Annotated waypoints | [read: Killzone slides] |
| Unreal EQS | A generator makes points; tests filter and score. The Trace test "returns whether it hit something", Bool Match inverts it; "Item Height Offset" and "Context Height Offset" set the ends. Distance and Pathfinding tests (Path Exist, Path Length, Skip Unreachable) | Trace channel, context (the player), offsets | [read: https://dev.epicgames.com/documentation/unreal-engine/eqs-node-reference-tests-in-unreal-engine] |
| EQS pitfalls | The querier or another pawn can block the trace and fail a good point; tracing at an actor's base hits the floor | n/a | [summary: https://forums.unrealengine.com/t/envquerytest-trace-does-not-ignore-querier-present-location-can-block-future-line-of-sight/2720295] |
| Precomputed visibility on nodes | Ray traces run offline per waypoint and cached; the cache "was not intended to completely replace runtime checks" | Per-node visibility by direction | [summary: https://faculty.nps.edu/cjdarken/pubs/levelexploration.pdf] |
| Hand-placed ambush nodes | Designers mark the places | A tag per node | [read: Orkin] |
| Last known position and prediction | Alien: Isolation sends the alien to vents "up ahead" on the predicted route; the search radius tightens each pass | A route guess; a radius | [read: both Game Developer articles] |

For us [inferred]: the drop points are already known. They are the off-mesh link landing points from each ledge, and we generate the level, so "where the player lands" is a finite, exact set. Prediction is cheap: the question is which landing the player picks, not whether there is one.

## 4. Real ambush predators (only where a rule falls out)

| Study | Finding | Usable rule | Source |
|---|---|---|---|
| Serengeti lions, Hopcraft, Sinclair and Packer 2005 | "As expected for a sit-and-wait predator, resting lions spent more time in areas with good cover." Under 100 m, lions fed where prey were catchable, not where prey were dense. Favoured: erosion embankments, rocky-outcrop view-sheds, water. | Wait where the prey is easiest to catch, not where it is. Wait at features the prey must use. | [read: https://www.esf.edu/biology/faculty/documents/Hopcraftetal2005lionspreyvulnerabilityrisk.pdf, summary page of the paper only] |
| Wolves and beavers (a summary page of Gable et al.) | Ambush sites "close (generally <5 m) to beaver habitat features", with scent concealment; prey "inability to visually detect motionless predators". 11,817 GPS clusters searched, 748 ambush sites, 214 kills. | Sit within a few metres of the place the prey keeps returning to; be still and out of its senses. | [read: https://wolfwatcher.org/resources/predator-prey-relationships/wolves-choose-ambushing-locations-to-counter-and-capitalize-on-the-sensory-abilities-of-their-prey/] (a conservation site's summary, not the paper) |

The rule for our game [inferred]: the post sits a short run from the landing, with a wall between it and the player's eye, and makes no footsteps while holding. Limit: animals do not know where prey is. Ours does. So biology gives the position rule, not the knowledge rule.

## 5. Three designs, small to large

All three keep "the hunter always knows" true in the state it reads; only what it does with that knowledge changes. All run on the existing 240 Hz tick and are pure functions of recorded state plus the seed, so a recorded run replays exactly [inferred].

### Design A. Withdraw to a hidden post, strike on the drop (smallest)

**Rule.** When the player has stood on ground the hunter cannot reach for more than a short time, pick one post and walk to it: a reachable nav-mesh point that (1) has no line of sight to the player's eye, (2) is within a path time of T_strike of the nearest landing point, (3) ranks best on a simple score (hidden first, then closest to a landing). Hold there. When the player's feet leave the ledge, route to the landing.

**Needs.** One visibility raycast per candidate (eye to the hunter's chest height, against static geometry), one path-length query to the landing, a small state (Withdraw, Hold, Strike). No new level data if candidates are sampled from the nav mesh at lurk start.

**Bot test.**
- A camper bot stands on a ledge N s (N = 5, 15, 40), then drops at the landing nearest the hunter, the farthest, and a random one. Registered claim: caught within T s of the drop at a rate inside a stated band (for example 50-80 %), neither 0 nor 100.
- A never-camp flee bot, on paired seeds: the rule never triggers, and the replay hash equals the old run bit for bit.
- Invariant, asserted every tick while Hold: no line of sight from the player's eye to the hunter.

**How it goes wrong.** The post chosen at lurk start becomes visible when the player moves along the ledge (needs a recheck, say 4 Hz). The post is hidden but a long way round, so the "ambush" is only waiting. The player learns the post is always the nearest hidden corner and drops on the other side. A raycast from one eye point misses a leaning or jumping player.

### Design B. Posts per landing from the generator, with tells and a time cap (medium)

**Rule.** The generator already knows each ledge and its landings. Add, per landing, a short list of posts chosen offline by a Killzone-style evaluation function: hidden from the ledge's standing area (required), path time to the landing, hidden approach path, and distance from the other landings (so one post does not cover all). At run time the hunter takes the post for the landing it judges likeliest, holds, and shows two tells on a schedule: a faint sound, and a rare glimpse (a short exposure at range, farther than strike distance). Add a **cap**: after L seconds the hunter gives up the hold and shows itself at range (Alien: Isolation's "set duration ... give up and move on unless provoked"). Strike on the drop, or on the cap.

**Needs.** Generator output (posts per landing) and a visibility table from each ledge's standing area to each post (the precompute-then-check pattern). A tell budget. A cap per difficulty.

**Bot test.**
- Camper bot as in A, plus a glimpse-reader bot that drops the moment the hunter is seen leaving. Registered: a drop within 3 s of a glimpse is caught at a higher rate than a drop after the cap (this proves the tell is readable and fair).
- Cap test: a bot that never drops sees the hunter appear at range within L + e s, on every seed.
- Fairness test: first tell to strike is at least a stated minimum on all seeds.
- Static check at generation: every landing has a post, and every post fails the visibility test from its ledge. A ledge with no post is a generation error.
- No-camp bot: bit-identical replay hash.

**How it goes wrong.** Offline posts go stale if doors or props move. A post good for one spot on a long ledge is bad for another. The glimpse is too rare to teach the player the hunter is near, so the ambush feels like cheating. The cap is too short and camping is safe again. Table size grows with the level.

### Design C. A lurk stance in the Director, a drop predictor and a flusher (largest)

**Rule.** Lurking is a stance the Director grants, like Alien: Isolation's backstage. Entry: the player has been unreachable for X s and intensity is below a threshold (a player resting on a ledge). The hunter withdraws as in B. A **drop predictor** weights each landing by (a) how many exits and how much open run lie beyond it (the player wants the best escape; compare "up ahead it thinks you're going to move towards"), (b) the player's gaze and facing, (c) the player's past drops this run. The hunter posts at the top landing and, after the cap, moves to the second. A **flusher**: the climber, which already goes after `ledge_patience_s`, is sent up while the hunter holds. Two roles, as F.E.A.R.'s squad layer pairs one who pressures with one who moves. The climber pushes the player toward a drop; the hunter waits at the likeliest one. Exit: strike, cap, or an unpredicted drop (the hunter reverts to a normal chase and the Director resumes Build Up).

**Needs.** Everything in B, plus Director hooks (entry gate, cap per difficulty, exit), a deterministic predictor, and a role call between climber and hunter. Replay exactness needs the predictor to use only recorded state: no wall clock, no unordered containers.

**Bot test.**
- Predictor test: a bot drops at the best-escape landing, the worst and a random one. Registered: the hunter's first post matches the best-escape bot's landing well above chance (chance = 1 over the landing count), and matches the uniform-random bot at about chance.
- Flusher test: with the climber, a never-dropping camper is forced off or caught within T s at a stated rate; without it, B's cap holds.
- Paired 150-seed flee set: the headline flee-never-caught number (52 to 62 of 96 since D664, per `handback/p-d669-sweep-E_2026-11-11.md`, quoted in `loop/plan_l169_chase_pathing_research_2026-11-12.md`) must not move on runs with no ledge stand.
- Fairness: the rate of a drop caught in under 1 s from landing must stay under a stated ceiling.

**How it goes wrong.** The predictor reads as mind-reading. Alien: Isolation keeps the director's knowledge apart from the alien's body for this reason [read: revisiting], and ours is omniscient by ruling. A climber plus hunter pincer leaves no safe option, ending the ledge as an escape (the same cost as `buildpath_chase_entities_2026-11-13.md:65`, option 5b). More paths into the replay. Three interacting timers (entry, cap, give-up) are hard to tune.

## 6. What this means for our build

| Option | What it changes | Cost [inferred] | What it needs |
|---|---|---|---|
| **A** | Hunter hides near the ledge and strikes on the drop | Smallest: one state, one visibility raycast, one path query | A sampling pass over nav polys at lurk start; a recheck rate |
| **B** | Same, with offline posts, tells and a time cap | Medium: generator output, a visibility table, tell tuning | Generator hooks per ledge and landing; a sound event; a cap dial |
| **C** | A Director stance, a predictor and a climber flusher | Largest: Director edits, a deterministic predictor, two-seat coordination | B, plus the Director gate and exit, plus the climber role |

Suggested order [inferred]: build A to learn whether the idea reads at all; B if A is liked and the tells matter; C only if he wants the pincer. Whatever is chosen, a cap and a tell are not optional: every source that has this behaviour bounds it.

Cheap pieces to take whichever option wins:
- The "hidden from the player's eye" test with eye and chest height offsets (EQS exposes both; a forum thread shows the querier blocking its own trace, so exclude the hunter's own body).
- A per-run lurk budget so a camper is never held forever.
- The camper and glimpse-reader bots as registered policies beside the flee bots.

## 7. Where the sources disagree with the idea

1. **Omniscient waiting.** Alien: Isolation separates the knower (the director) from the body (the alien), which "has to figure it out for itself" [read: perfect organism]. Our hunter is told the position. So the one game that does this closest has no omniscient precedent, and the risk is that our lurk reads as scripted. The source's remedy is a hint plus a shrinking search radius; we could mimic it as a visible search (the hunter checks a wrong landing first).
2. **Open-ended waiting.** Both articles bound it: a menace gauge, a backstage stay, "Each ambush has a set duration". The brief's wish has no time limit; the sources say add one.
3. **Intelligence by design.** F.E.A.R.'s author says the flanking is "just a side effect" and the squad is "the illusion". That supports the theatre framing and argues against building a general planner for this.
4. **Amnesia** (unverified): a snippet says its monsters avoid hunting hiders hard. If true, it is a counter-example: leave hiding players some mercy. Needs the talk.
5. **L4D** gives no precedent for a camper; its fairness is a Director with a Relax phase, not a stance.
6. **Real predators** do not know where prey is; the position rule transfers, the knowledge rule does not.

## 8. Not read

- **Resident Evil 2 remake** developer account: the PC Gamer interview body was truncated; nothing opened.
- **Amnesia**, Grip's talk: a search snippet only. The recap I opened does not contain the claim.
- **Dead by Daylight:** a fan-wiki snippet only; no player reports on camping or ambush.
- **Killzone:** the 2005 slides read as text. The later Game AI Pro chapter ("Tactical Position Selection: An Architecture and Query Language", Straatman et al.) known only from a listing; not read.
- **F.E.A.R.:** the GDC 2006 paper read for the Ambush goal and the squad layer; the GameSpot designer diary and the GDC video not read.
- **L4D camping behaviour:** none found. Booth's deck was searched for stall, camp, stuck, ambush, idle: only the spawn and nav-query text matched. The L4D developer commentary and the GDC Vault talk were not opened.
- **Alien: Isolation:** the developer talk behind the "100 nodes, top 30" figure not opened (repeated by secondary sites). No player reports opened.
- **Wolf study:** a conservation-site summary of Gable et al., not the paper. **Lions:** the paper was fetched and its summary and introduction read in the extract; the results tables were not read.
- **The node-visibility sources** (Liden, the NPS paper, the Close Quarters blog): summary only.
- **Other stalker-AI writeups** (The Last of Us, Outlast, Dead by Daylight's AI modes): not found or not searched.
- **Our own code:** not opened (the brief ruled it out). Every [inferred] about `chase/` rests on the earlier hand-backs.
