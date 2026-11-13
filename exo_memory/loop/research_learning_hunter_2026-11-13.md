# Research: a hunter that learns the individual player (scout, 2026-11-13)

Research only. Nothing built, run or committed.

**Marks.** [read: URL] = I opened the page with the fetch tool. Caveat: the fetch tool answers through a small model, so "read" means the page was opened and queried; the wording below is that tool's report, not a verbatim copy, and a "quote" is what it returned. [summary: URL] = a search snippet or secondary article only. [inferred] = mine.

**Prior research not repeated (cite, do not redo):**
- L4D's Director, placement and reactive path following: `handback/p-l169-games-E_2026-11-12.md` (short answer :8-23; section 1, Director). That is pacing, not a player model.
- What the hunter aims at now (a reaction-delayed observation, `run.cpp:731-737`; only the interceptor and pack lead): `handback/p-l169-code-A_2026-11-12.md:13-14, 45-47`.
- Lead and pursuit family from NextBot (P1, lead the position): `handback/p-l169-code-A_2026-11-12.md:45`; the lead lever came closest in L170 (`loop/buildpath_chase_entities_2026-11-13.md` section 3).
- Guidance laws, mirrored line, hawk law and exploit search: `handback/p-l182-lines-A_2026-11-12.md` (work in progress, no arm has a number) and `loop/buildpath_chase_entities_2026-11-13.md` section 2.
- His items 178 (mirror the line when behind, predict and cut off otherwise), 141-142 (per-kind ability; Mirror and Appetite in kit R1), 65 (hunter always knows where you are), 132 (first runs forgiving): `loop/buildpath_chase_entities_2026-11-13.md` section 1 and section 3 (kit R1: `handback/p-l172-chaser-kit-E_2026-11-12.md:47,87`).
- The run record stores dials, move params and world settings, no chase model: `loop/buildpath_chase_entities_2026-11-13.md` section 2 (`game/world/run_record.h:34-54`).
- A search of the five named files for "learn", "adapt", "profile" found no earlier work on a player-learning hunter beyond the kit's Appetite and Mirror rows. This is new ground for the room.

## 1. Shipped games, one at a time

### Echo (Ultra Ultra, 2017): confirmed, with a correction
- **Learned:** nothing statistical. A rule: anything the player did in the previous lights-on cycle becomes available to the copies; actions not used are removed. [read: https://en.wikipedia.org/wiki/Echo_(2017_video_game)] (quote: "anything En does during the previous lights-on period"; copies "will not be able to use any unused actions").
- **Signals:** the action set (sprint, open doors, vault, weapon, stealth). **Stored:** the set, per cycle. **Speed:** one cycle. **Tell:** the blackout between cycles; actions during the blackout are not recorded, which gives the player a window that teaches nothing. Killed copies are revived at each blackout. [read, same page]
- **Fairness:** the developer framing is that the copies are deliberately imperfect mimics [summary: https://www.gamesradar.com/these-ex-hitman-devs-are-messing-with-your-assumptions-about-enemy-ai-in-echo/]; I could not open the article body (the fetch returned only the headline).
- **How it felt:** reviews split. Some say mirroring makes the game predictable and repetitive and that the adaptive enemies lose their luster before the end; another says tough but not unfair; PC Gamer blames level design leaning on enemy numbers [summary: search results over PC Gamer, Trusted Reviews and a PS4 review; PC Gamer URL https://www.pcgamer.com/echo-is-a-stealth-game-with-the-right-idea-but-all-the-wrong-moves, not opened].
- **Lesson [inferred]:** a capability-copy rule is readable and deterministic, but the player can starve it ("do not use that action") and then there is nothing left to adapt to.

### Alien: Isolation (Creative Assembly, 2014): the two layers are right; the "learning" is mostly scripted
- **Two layers, confirmed:** a director that always knows where the player is, and a creature that must find the player by senses. Quote: "the director always knows where you are, the alien has to figure it out for itself." The director uses a menace metric of how much it is pressuring the player; once it peaks, the alien is pulled back to nearby areas or vents. [read: https://www.gamedeveloper.com/design/the-perfect-organism-the-ai-of-alien-isolation]
- **Not a learner:** locked branches of the behaviour tree open as conditions are met, "so the alien seems to learn"; none of the conditions come from events that lead to the player's death; some unlocks are at set campaign points. [read, same page]. A second analysis agrees: locker searches and vent crawling activate after repeated escapes, "the illusion that the creature is learning"; the alien records whether it has interacted with the flamethrower; "These are state-based triggers, not adaptive learning." It also notes the tree can trap the player in a corner or lose them. [read: https://www.gamedeveloper.com/design/revisiting-the-ai-of-alien-isolation]
- **Numbers the sources give:** sensing within about 1.5 m (footsteps, gunshots, tracker); the alien teleports only twice in a 12-18 hour campaign; designers can mark areas it never searches. [read, first page]. What is stored and how fast unlocks fire: not given by either source.
- **Fit to us [inferred]:** the cheapest shipped model of "learns the player" is a few counters (escapes used, tools used) that unlock pre-authored counter-behaviours.

### Forza Drivatar (Microsoft Research Cambridge, Turn 10)
- **Learned:** how this player drives each corner type and car: line, speed and how consistent they are, recorded over the whole race, track segments and each turn; 12 turn types; Road Atlanta alone has 27 segments. On a track and car the player has used it mimics the line closely; otherwise it approximates by turn-type averages. Data is timestamped and older readings get less confidence. Rewind discards training data until the segment is cleared. [read: https://gamedeveloper.com/design/how-forza-s-drivatar-actually-works]
- **Stored:** Forza 1-4 on the console disk; from Forza 5 in the cloud, small because it is mostly network weights. Laps needed: not stated. [read, same]
- **What went wrong:** it inherits the player's bad habits (spinning out, bashing cars), which designers suppress in races; it tracks one car at a time, so others can still bump you; rubber banding is applied to performance, not to the AI, with limits to keep cars drivable. The original Bayesian version struggled on new tracks and cars. Modern internals are not public; "deep learning" is an unconfirmed remark. [read, same]
- **Lesson [inferred]:** the useful pieces are the unseen-situation fallback (average by corner type), the recency weighting, and discarding bad data.

### Killer Instinct Shadow AI (Iron Galaxy, 2015)
- **Learned:** by case-based reasoning: retrieve, reuse, revise, retain. Nearest-neighbour retrieval over more than 40 metrics; every action in every match is logged, combos to the animation frame, plus state (health, meters, distance, time). Candidates ranked by perceived value, with a small chance to pick a lower-ranked one to bluff. [read: https://gamedeveloper.com/programming/the-killer-groove-the-shadow-ai-of-killer-instinct]
- **Numbers:** three dojo sessions give base competence; each match yields 400-700 patterns; up to 40 matches kept per opponent (28,000 patterns per matchup upper bound). Stored online. [read, same]
- **Speed and limits:** a behaviour must be observed several times to be learned reliably; within a match it lowers the priority of actions it keeps being punished for; the lead admits 40 matches may be too few; the metrics need a designer with deep game knowledge; timing needs frame-accurate data or it "almost never works". The article is silent on fairness and readability. [read, same]
- **Lesson [inferred]:** the strongest shipped "learn the individual" model, and it needs hundreds of samples per behaviour and a training session. Our chase gives far fewer samples per run.

### Metal Gear Solid V (Kojima Productions, 2015)
- **Learned:** a gradual counter-measure ladder: too many headshots, helmets; too many night infiltrations, night-vision goggles; heavy tranquilizer use, gas masks. A fan wiki gives a helmet chance of 20 % at a low level and 70 % at a high one; level and decay figures may be community testing. [summary: https://metalgear.fandom.com/wiki/Revenge_System_(enemy_preparedness)] (page returned 402; figures are from the search result only).
- **Tell:** each adaptation has levels shown by map-icon colour (white, then pink, red), so the player can check whether enemies are adapting. Dispatch missions can temporarily counter them; some missions are exempt. [read: https://www.gamerguides.com/metal-gear-solid-v-the-phantom-pain/guide/the-basics-6/gameplay-9/dynamic-difficulty]
- No developer statement on intent or decay found. [summary]
- **Lesson [inferred]:** the readable version: a few named counters, tiered, visible, reversible. It makes a habit less rewarding rather than cheating.

### Left 4 Dead Director
Pacing by an intensity estimate, not a model of the player's habits; already covered in `handback/p-l169-games-E_2026-11-12.md` section 1. Bosses are not affected by adaptive pacing (same file).

### Rubber banding (the cheap cousin)
- Claim: it keeps the player in the "flow channel"; used "to a very low level" in hardcore games because those players "care about the rules of the game and their skill should never be unrewarded or nullified" and would be "very annoyed" at an advantage being nullified. Example: the trailing car goes faster though its shown speed is the same. No data cited. [read: https://gamedeveloper.com/design/the-value-of-rubber-banding-an-engagement-driver-]
- Anecdotal dislike: it reads as cheating; one studio reportedly received so many complaints about "AI catch-up" that it changed the AI [summary: https://www.avclub.com/5-games-totally-ruined-by-rubberbanding-ai]. I found no measured study of why players dislike it; two academic leads (an ICGA Journal paper and a user-study poster with seven balancing mechanisms) are unopened [summary].
- **Fit to (b) [inferred]:** a hunter that gains a speed bonus when the player earns one is a rubber band tied to the player's own skill signal. The sources' warning is that players resent nullified skill, and the surge bonus is exactly the skill reward.

### Racing ghosts
No source opened. [inferred] A ghost is the player's own recorded line replayed: no learning, fully deterministic, and it feels fair because it is exactly what the player did.

## 2. Published research

| Source | What it gives | Mark |
|---|---|---|
| Yannakakis, Spronck, Loiacono, Andre, "Player Modeling", Dagstuhl 2013 | player modelling as detection, modelling, prediction and expression of player traits; a taxonomy of approaches | [summary: https://drops.dagstuhl.de/opus/volltexte/2013/4335/] |
| Holmgard, Liapis, Togelius, Yannakakis, "Evolving Personas for Player Decision Modeling" | evolved agents used as player models | [summary: https://mail.antoniosliapis.com/papers/evolving_personas_for_player_decision_modeling.pdf] |
| King and Edwards (GameOn 2015), n-gram plus fuzzy defender in a hockey game | an N-gram recognizer "predicts the next action of the attacking player"; reported as not prohibitively expensive in complexity or overhead; no accuracy figures in the abstract | [read: https://rke.abertay.ac.uk/en/publications/a-simple-hybrid-algorithm-for-improving-team-sport-ai/] |
| Mealing and Shapiro (ICAISC 2013), opponent modelling by sequence prediction and lookahead | sequence prediction models opponents with memory; lookahead is needed to beat them | [summary only; the DOI page was not reached] |
| Imitation learning surveys (arXiv 2106.12177, 2309.02473) | behavioural cloning is supervised and falls short on unseen states; DAgger addresses it; newer methods use cloning as a bootstrap | [summary only] |

Gap: I found no published figure for how many player samples a simple counter or n-gram needs before it beats chance in a chase. [inferred] That is a number our own bots can measure (section 3).

## 3. Designs for this game, smallest to largest

All designs share one rule [inferred]: the learner is a pure function of recorded events (positions, ticks, ability uses), updated at fixed ticks, with integer or fixed-point counts and no wall-clock use and no random draws except the sim's seeded stream. Then a replay rebuilds the same counters from the same inputs, and only learned state that carries over between runs must be saved, with a version, in the run record. `run_record.h` holds no chase model today (`loop/buildpath_chase_entities_2026-11-13.md` section 2).

### D1. Habit counters inside one run (smallest)
- **Stores:** a few small integers per run: after a cloak, did the player keep heading, double back, or stop; which side at a fork; dodge side at a near miss; which escapes they use (cloak, decoy, parkour link). Decay: halve counts at a fixed tick interval.
- **Effect:** biases the hunter's aim point. Today it aims at a delayed observation (`run.cpp:731-737`). After a cloak the counters pick among "continue heading" (today's behaviour), "doubled back" and "stopped"; the hunter commits to one with probability equal to its count share, drawn from the sim's seeded stream so a replay agrees. Shipped relatives: Alien: Isolation's unlock-by-repeat and an n-gram next-action predictor (both read above).
- **Determinism and replay:** counters rebuild from the replayed inputs; nothing to save. Needs a fixed update order and integer or fixed-point math.
- **Bots:** a bot with a fixed habit (always doubles back after a cloak) must be caught sooner as counts grow within one run, measured by paired seeds as in L170 (flee never-caught percentage; `loop/buildpath_chase_entities_2026-11-13.md` section 3). A bot with no habit (uniform random choices) must see no change within noise; a bot that switches habit mid-run must not be punished forever (decay test). Expect a learning curve, not a step.
- **Goes wrong:** feels like cheating if the hunter goes to the exact spot right after a cloak at no cost (answer: keep the cloak's delay and let the learned bias only choose which branch it searches first); punishes a first-time habit from a tiny sample (require a minimum count, like Killer Instinct's "observed several times"); a one-trick player gets stuck in a counter loop (the decay). It does not conflict with item 65: the hunter already knows where you are; this changes where it heads, not whether it knows.

### D2. Counter-measure ladder across runs (small to medium; the MGSV and Alien shape)
- **Stores (profile):** a tier 0-3 per habit class (cloak-then-continue, double-back, decoy reliance, parkour shortcuts), raised when the habit is seen across runs and lowered over a few runs without it.
- **Effect:** each tier unlocks an authored hunter response with a tell (it pauses and checks the direction the cloak would have sent it; it looks behind after a cloak). Readable if a mark or a distinctive animation says it noticed (MGSV shows its tiers on the map, read above).
- **Determinism:** the profile is saved with the player's profile and copied into the run record at start (a few bytes), so a replay starts from the same tier.
- **Bots:** a habitual bot should climb the tier over N runs and be caught earlier; a no-habit bot stays at 0; a bot that drops the habit decays. Output: catch time against run number.
- **Goes wrong:** "my trick got nerfed" frustration; counters can read as punishing skill, so they need a visible tell and a decay. Echo shows the dead end: the player learns to starve the learner.

### D3. A follower that replays the player's own best lines (medium; item 178's "mirror the line")
- **Stores:** per level seed, the player's best clean lines as waypoints at fixed spacing, with the surge-earning segments flagged. The run record is already deterministic and holds inputs, so a line can be extracted from it rather than stored anew.
- **Effect:** when the hunter is behind the player it steers along the nearest stored line through the same geometry (the guidance and mirrored-line work in `handback/p-l182-lines-A_2026-11-12.md`), and gains a surge only when it holds that line cleanly, so the bonus is earned by the rule the player earns it by. Shipped relatives: Drivatar copies the line on a track the player has used and falls back to averages elsewhere (read above); racing ghosts.
- **Determinism:** lines are data keyed by seed, so replay is exact if the loaded data or its hash is in the run record. Cross-seed use needs a Drivatar-style fallback (average by corner type), because a line from one procedural interior means nothing in another [inferred].
- **Bots:** a bot that takes one racing line on a seed must be caught sooner on that seed over runs; a bot whose line differs each run must see little change; a bot on a new seed must see no change (the fallback).
- **Goes wrong:** copies the player's mistakes (Drivatar inherits spinning and bashing, read above); an earned surge can push the hunter past the player's peak (`loop/buildpath_chase_entities_2026-11-13.md` section 2 computes hunter speed at 0.90 to 0.99 of the player peak on the flat from 0 to 300 s, so a surge crosses that line), so it needs a cap; "its bonus is my bonus" can feel like punishment for skill, the rubber-banding complaint of the hardcore-player source (read above). Snowball: the better the player, the faster the hunter; needs a cap and a per-run reset.

### D4. A profile-level case-base model across runs (largest; the Shadow AI shape)
- **Stores:** a small case base per player: (situation features, player choice) pairs, such as distance to the hunter, heading change, ability off cooldown, room type, with a cap on cases and recency weights; nearest-neighbour retrieval predicts the next choice. Shipped relative: Killer Instinct (40+ metrics, up to 40 matches per matchup, three sessions to base competence, read above).
- **Determinism:** the case base is saved in the profile, versioned, and copied into the run record at start (kilobytes, not bytes); retrieval must use fixed-order fixed-point distance with a tie-break rule. Any feature change breaks old records, so each record needs a model version.
- **Bots:** a bot with a fixed habit must be predicted better as cases accumulate (hit rate against run number); a random bot must stay near chance; a bot that changes habit must recover.
- **Goes wrong:** Killer Instinct's own limits apply: it needs repeats, a designer-tuned feature set, and far more samples than our chase gives per run (400-700 per match there). Most likely to feel like cheating because the reason is invisible. Do this only if D1 and D2 show measurable catch gains.

Rough cost [inferred]: D1 days; D2 about a week with tells and profile save; D3 weeks and depends on the l182 guidance work landing first; D4 weeks plus a model version policy.

## What this means for our build

| Option | Cost | Needs |
|---|---|---|
| D1 habit counters, within a run | smallest; touches the hunter's aim point and cloak branch | an event hook for cloak, dodge and fork; seeded stream; bot habit scripts; a paired-seed sweep like L170's |
| D2 counter-measure ladder in the profile | small to medium | profile save plus a run-record field (the record has none today); authored tells; a visible mark for the player |
| D3 replay-your-best-line follower with earned surge | medium to large | the guidance and mirror-line work (`handback/p-l182-lines-A_2026-11-12.md`, in progress); line extraction by seed; a surge cap |
| D4 case-base profile model | largest | sample-count evidence from D1; a versioned model in the run record; fixed-point retrieval |

Suggested order [inferred]: D1 first, because it needs no saved state (it rebuilds from inputs), bots can measure it, and it tests the core claim cheaply; D2 once a tell design exists, because the shipped sources point to the tell as what makes it fair; D3 for part (b); skip D4 unless the sample rate proves enough.

Must-haves the sources share: a visible tell (MGSV icons, Echo's blackout); recency decay (Drivatar); a minimum sample (Shadow AI); keep the learner imperfect (Echo's copies); keep the director's full knowledge separate from the creature's (Alien: Isolation).

## Where the sources disagree with the idea

1. **"Learns from the player"** in the best-known horror case (Alien: Isolation) is authored unlocks, not learning [read: revisiting article]. The one that really learns per player (Shadow AI) needs hundreds of samples and a training period [read: Killer Instinct article].
2. **Echo shows the learner can be starved.** Idea (a) assumes the hunter should catch up with a player who learned the trick; Echo's reviews suggest this can turn predictable and repetitive rather than tense [summary: reviews].
3. **Idea (b), earning the same speed bonus as the player,** is rubber banding in a skill-linked form. The one source that discusses it says hardcore players resent nullified skill and that it is used to a very low level there [read: rubber-banding article; it cites no data].
4. **Drivatar** copies lines only on tracks the player has used and averages elsewhere; our interiors are procedural, so a mirrored line from one seed does not carry to the next [read].
5. **Hidden models read as cheating;** the fair shipped versions show a tell (MGSV tiers, Echo's blackout). The idea does not yet name a tell.
6. **Alien: Isolation's fairness rule** (the director knows, the creature must find) is the opposite of item 65 (the hunter always knows). That does not break the idea, but the learning layer should change where the hunter goes, not whether it knows.

## Not read

- Echo developer interviews (GamesRadar body returned only a headline, GameSkinny returned 403, the Unreal Engine interview and Road to the IGF were not opened).
- Any GDC talk or slides: Alien: Isolation (Hope, 2015), Killer Instinct (Neal and Hayles, 2016), Drivatar (Microsoft Research papers), Booth's L4D companion talk.
- The MGSV wiki page (402) and any Konami statement; the decay and level numbers are unverified.
- Mealing and Shapiro (DOI page not reached); King and Edwards full text (only the abstract page); the Dagstuhl chapter; the Holmgard persona paper; the imitation learning surveys; the ICGA and Entertainment Computing rubber-banding papers; the AI and Games Drivatar video.
- Killer Instinct fairness and player reception (the article does not address them); Drivatar player reaction (the article does not cover it).
- Any source on a stealth chase that learns escape routes per player in procedural interiors, and any measured count of how many events a counter needs. [inferred] Our own bots are the only way to get that.
- Racing ghosts: no source opened.
