# Dreamzone 3: the design, organized from his items 1–53. Pane E, on L, 2026-11-11, written from 06:3x local (`date` read 06:29:55)

**What this is:** his words from `briefs/dreamzone2_the_game.md`, items 1–53, sorted by system. It stays in lighthouse because it quotes him; nothing here goes into the game repo.
**How each line is marked:**
- **[decided N]** is his, with the item number;
- **[proposed: who]** is a seat's, not chosen;
- **[GAP]** is a question for him.
- **Contradictions** between items are named with both numbers and left for him.
**Built today** is read from `dreamzone-3` main at **c2efcf3** (`git log -1`, 05:02 local). L162's landing (the run record, the lighting) was still running when I read it, so it is not counted here.

---

## 1. Pillars and tone

**Built today:**
- the grade has a horror look (`render/renderer.h:87-96`: vignette, contrast, grain, chromatic aberration, split tone);
- nothing else of tone, faith or story is in code.

- [decided 1] A nextbot-style chase: something exceedingly fast, which can still be out-manoeuvred by skill and movement, through a procedural world.
- [decided 6] The key point is liminal spaces.
- [decided 43] "this should be a horror game": real horror tropes and content, not mindless jump scares. The horror is "the inherent horror of existence at all". His reference shape is the quote in item 43, finished in item 44 ("the machinery has been running on its own. Repeating a purpose no one remembers"). Its author is not known; it is kept as his reference, not attributed.
- [decided 45] It mirrors his "real life struggle to believe and have faith in something good", "which is the whole point of carrying the virtuous emotion throughout". Dark existential dread carries the horror.
- [decided 45] Some "generic but good horror cliches that run adjacent to it all too for the normie crowd".
- [decided 7, 8] The feel of the chase: always fast-paced survival, and the "YES lets go" playful adrenaline of a reprieve found.
- [decided 18] "it should be a always fast paced survival situation."
- [proposed: E, Backrooms hand-back] Suggestion over explanation: artifacts not exposition, unnumbered places, a story spine the player can doubt. The Backrooms' decline came from explaining.
- [GAP] Which cliches, by biome? Item 45 names the category, not the list. One menu would be: the hospital (gurneys, a PA voice), the school (a bell, lockers), the mall (muzak, mannequins), the hotel (room service at a door). Which fit "adjacent", and which are too generic?
- [GAP] Where does the faith thread show in play, beyond the good god's rescue (item 30) and Resonant (item 32)? Is it ever spoken, or only felt?

## 2. The run, minute by minute

**Built today:**
- a run starts at a closed bedroom door in a corridor (`HANDOFF.md:78-80`);
- the hunter comes through the door after `head_start_s` 8 s (`chase/dials.h:20`);
- a director paces pressure, peak and relief (`chase/run.h:121`);
- a run ends at a catch or a fall into a void (`chase/run.h:91`, `run.cpp:272`), with a results card (`game/world/hud.cpp:6`);
- **no timer, no end gods, no rescue.**

- [decided 3] You lie down in your bed and wake in the dream zone. Your room's door is the run's entrance, and something chases you at once, maybe several entities with different archetypes.
- [decided 7] Dead ends exist, rarer than they might be, and will end runs.
- [decided 28] A time limit, "perhaps like 10-15 min runs depending on play testing". You just survive.
- [decided 28] When the time runs out, a super god entity and a malevolent god entity fight over your soul.
- [decided 28] The end is like Vampire Survivors' Reaper: "you cannot outrun death". The malevolent god is "like lighting fast next bot, it is cheating", and "even safe zones dont save you, just reroute it".
- [decided 28, 30] When it catches you at the end, the good god saves you "last second". Item 30 gives the reason: the evil force "over stepped its bounds", "letting the good entity mirror its symmetry".
- [decided 53] Tons of bonus XP for surviving a longer time after the round is over, evading the malicious god (the overtime).
- [decided 30] Caught by regular entities before the timer, "you lose it all".
- [decided 30] Death shows, indirectly, that it was always the evil god "playing with its food". It consumes a part of you; you wake feeling normal, not knowing which part was taken. It is never said directly.
- [decided 26] The catch: a brutal jumpscare, then "the players camera and soul gets sucked into this rapturing portal leading back to the player awakening in their bed".
- [decided 16] A brutal jumpscare, "but not during testing".
- [decided 28] Being consumed loses all your XP for that run, and you keep your insanity (stress, item 32) waking up for the next run.
- **Contradiction, 28 against 28/30:** item 28 says "if it consumes you, you lose all your xp", and also "when you get caught, the good god entity saves you last second". Item 30 reads it as: caught by regulars before the timer, you lose it all; at the timer the good god always saves you. Then **is being consumed at the end possible at all?** Left for him.
- [decided 66, settles the contradiction above] No. Caught before the timer: the run is lost with all its points. Survive the timer: overtime, the evil god comes himself (Vampire Survivors' ending), it always catches you, the good god always saves you "and sends you back successfully", points kept plus the overtime bonus (53). Being consumed is a before-the-timer loss only.
- [proposed: chase SPEED_MODEL, A] A fresh player's start advantage of about 10% (`chase/SPEED_MODEL.md:289`). [decided 28] "10% sounds good for the start".
- [GAP] What "the part taken" does in play. Is it only felt, or does a run's loss remove something real (a trinket, an ability slot, a memory of the story)?
- [GAP] The timer: one length, or per difficulty (10–15 min is his range)? Is the timer shown, and how?
- [GAP] Item 26's "rapturing portal" after a catch, and item 30's "part taken": the same sequence, or two?

## 3. XP and scoring

**Built today:**
- the score is time-based: `score_at(t) = 10t + t²/12` (`chase/run.cpp:205-208`), shown on the HUD and the results card (`game/world/hud.cpp:82`);
- no XP and no multipliers.

- [decided 7] "the metric for points isnt raw distance traveled but time spent alive."
- [decided 53] "not time, distance": "if you dont survive you dont accumulate anything".
- **Contradiction, 7 against 53:** the unit of points (time alive in 7, distance in 53). Item 53 is later and gives a reason, but it is still his to confirm. The game today scores time (above).
- [decided 53] Multipliers past certain distances and difficulties.
- [decided 53] Frenzy mode brings more XP per second.
- [decided 53] Proximity to entities scales a multiplier, shown by a UI element that is "minimalistic horror sci fi existential dread themed".
- [decided 53] Using a reprieve gives "a solid chunk"; evading the smaller entities gives XP; opening the special containers gives an XP bonus.
- [decided 53] Base movement, with no skills required: chaining movements gives points, and so does sprinting in a straight line for an extended time ("for letting it catch up"). "brain storm solely as its own thing."
- [decided 53] "you can points from doing things you specced your build into": XP follows the build.
- [decided 26] A locked higher tier makes the entities stronger and faster for more currency or XP (the Vampire Survivors or Megabonk curse).
- [decided 30, 28] Caught by regulars, you lose the run's XP.
- [GAP] Is XP one number, or XP (levels) and currency (shop) apart? Item 41 has the containers drop currency; item 53 has them give XP.
- [GAP] What counts as "evading" a smaller entity: breaking line of sight, a near miss, outlasting a chase?
- [GAP] The movement-chain list (item 53 asks for its own brainstorm): which moves chain, and how is a chain broken?
- [GAP] Does "distance" mean metres travelled, or depth reached (storeys or biomes from the start)?

## 4. Abilities

**Built today:**
- no abilities, slots or loadout in code (`grep -i abilit` over chase, game, sim, gen and audio: no matches);
- the flashlight exists only as a carried tool switched by a setting (`HANDOFF.md:110-117`; `game/bindings.cpp:21`).

- [decided 2] You start at level 1 and weak. Over many runs you level up your base power and abilities, "not necisrarly easier, but more fun and engaging".
- [decided 10] The flashlight: "a perk or mechanic you unlock or find during the run, maybe perma unlocking eventually". Items 37–40 refine this, below.
- [decided 25] Base stats; abilities you start with; more found during a run, from containers or good entities that freeze time and offer a random pick. Picks synergize, Vampire Survivors style (his example: top sprint plus acceleration).
- [decided 34] Containers give the abilities for that run, and they reset after it.
- [decided 33] You start with six basic abilities: four physical and two psychic.
- [decided 33] The four physical synergize into two ultimates; the two psychic into one ultimate.
- [decided 33] Training unlocks new physical abilities; the illicit site teaches new psychic ones.
- [decided 53] "or idk if we should have tons of base physical abilities or use the megabonk limited slots to spec a character who is all movement, or all psychic or mix of both."
- **Contradiction, 33 against 53:** a fixed starting six (four plus two, with set fusions) against Megabonk-style limited slots specced freely. Left for him. Item 34 also notes Megabonk's slot caps ("you can only have so many tombs and weapons"), his catch.
- [decided 29] The second upgradable is the ability loadout, once the character "knows of gateway". His examples: the golden aura shield; super sprint; dream flight through the hallways; a very rare noclip.
- [decided 37, 38, 39, 40] The flashlight:
  - an ability unlocked early, never carried at spawn, found in a run's containers (40);
  - paired late with a psychic power, it repels the entities it shines on, to clear the interceptor and front-spawners ahead (37, 39);
  - it frenzies every entity it is not pointed at (38).
- [decided 48, 49] **The chair (or beanbag):** you sit, meditate with Hemi-Sync, and go out of body. The camera rises to third person, the room dissolves into a cosmic void, and a transparent Dark Souls-like menu opens. "depending on which focus level they are one, is what dictates which abilties unlock and can even be upgraded".
- [decided 50] Meditating in the chair gives a base-rate reduction of stress, upgradable.
- [decided 49, librarian note] The chair is reached only after the character knows of Gateway (29), so Focus levels appear as the story's late reveal.
- **Contradiction, 26 against 48/49:** item 26 has the PC carrying "the ability screen where you make your loadout and unlock new abilities". Items 48–49 have the PC "just for cosmetics and rare trinkets", with abilities in the chair. Left for him (49 is later).
- [GAP] The starting six, by name. Item 33 says "not decided yet" for the psychic two; the physical four are unnamed too. Their three ultimates?
- [GAP] Slot counts, if Megabonk-style: how many active, how many passive, and what opens more?
- [GAP] What are Focus levels in the chair: tiers that unlock as the story goes, or a level the player chooses each time?

## 5. Stress (affliction and Resonant)

**Built today:**
- none (`grep -i "stress|insanity"` finds only `sim/physics.cpp:88`, a physics contact class, not this);
- the director's intensity exists (`chase/run.h:121`), but it is not tied to the player.

- [decided 28] A meter in the style of Darkest Dungeon. It starts at a baseline, and being closely pursued by an entity raises it.
- [decided 28] It feeds the AI: the entities fixate on fear and instability.
- [decided 28] It lowers by finding reprieves and by breaking line of sight. A solid chunk of time evading out of sight lowers it; staying in sight raises it.
- [decided 28] At full: the entities frenzy. Frenzy is hard on base difficulty and scales exponentially with difficulty and with distance or time survived.
- [decided 32] "perhaps stress is better than insanity": the Darkest Dungeon mechanic, afflicted or virtuous.
- [decided 32] At full stress: 75% frenzy, and **25% Resonant**. Resonant resets the stress bar and you become "cheating levels fast", feeling "the resonant aura of the signal of truth and love", for about 15–30 s.
- [decided 32] An ability could change the odds or the strength of Resonant. Some players will spec into stress for it; that is a risk, and fine.
- [decided 42] Mental fortitude, an attribute: it mitigates stress and lowers the frenzy's peak, "not by enough to stop it", "like sharks and blood in water". It might be trained by an ancient-meditation mini game "that is some how fun".
- [decided 28] Stress carries over: you keep it waking up after being consumed.
- [decided 31, 32] In the waking room: looking out the window lowers it, but **with a cap** (32: otherwise too strong). It rises by itself the longer you stay awake without dreaming (over 15 min).
- [decided 50] The chair gives a base-rate reduction, upgradable.
- **Contradiction, 28 against 32:** the name (insanity, then stress). Item 32 is the later wording; the brief reads it as stress.
- [GAP] Does a regular catch (lose it all, item 30) also carry stress over, or only being consumed (28)?
- [GAP] The stress meter's UI: shown, or felt through the screen and the sound only?

## 6. Entities

**Built today:**
- seven archetypes named (`chase/archetype.cpp:6`):
  - **built:** hunter, sprinter, interceptor and pack (`:15`, `:32`, `:59`, `:86`);
  - **parameter rows only:** charger and stalker (`:110-114`), and the crawler as a roamer (`HANDOFF.md:82`);
- placeholder dark-box figures (`HANDOFF.md:81`);
- the chasers' own speed model: inertia, braking and a fresh player's margin (`chase/SPEED_MODEL.md`).

- [decided 1, 3] Multiple entities with different chase archetypes and aggro levels.
- [decided 17] They traverse the world without clipping, "OP but not like speed hacking".
- [decided 18] Their straight-line speed and intelligence scale with distance and base difficulty. The player is slightly faster at first, and soon less so. They have momentum and inertia, so they can be juked. The interceptor is more nimble. On a long straight they gain speed and must scrub it to turn.
- [decided 16] Far better entity animation. The main entity's footsteps are bassy and loud, like thunder.
- [decided 25] Bad entities feed on you and consume you. "other intelligences outside of time space, some good, some bad" (from the 1983 paper's encounters, ¶26–27, ¶38 J; the good and bad sorting is his).
- [decided 25] Good, the holy aura: stops the bad entities feeding on you for a while.
- [decided 25] Good, the tank: a physical being that spawns and draws aggro for a short time.
- [decided 34] Good, the trinket giver: rare good entities drop trinkets. They can come straight to you, freeze the world and show an accept screen.
- [decided 26, his pick 5] When a good entity is near, all sound quiets (breathing, entities, the field's contortion), a resonant golden aura fills the hallways "like an angel", and a harmonious chord "brings you closer to love".
- [decided 28, 30] The end gods: the malevolent god (unescapable, cheating, the overtime's hunter) and the good god (the rescuer, mirroring its symmetry).
- [decided 26] Unlocking good entities is bought and upgradable: their power, and how often they spawn.
- [decided 47] "it could turn out that the god entity was the embodied for the love he had for his father, or it could turn out to be him in a way."
- [decided 31] An entity can mimic the player's mother in an invasion.
- [proposed: A, L161] The chase's levers: a stairs-foot lift, the fresh player's margin, finite braking (main c2efcf3's merge message).
- [GAP] Lore for each bad archetype (hunter, sprinter, interceptor, pack, charger, stalker, crawler): what each is in the story, and whether they keep these names.
- [GAP] The good entities' frequency, and whether they can fail (be caught, be too late).

## 7. Items: containers, trinkets, clothing, currencies

**Built today:** none. There are no containers, trinkets or currencies in code. ("chest" in `chase/run.cpp:16` is a chaser's chest height.)

- [decided 40] A better thing than a generic chest, for the theme: his open question.
- [decided 41] Containers drop cash (currency) as well.
- [decided 41] The opening is a dopamine slot machine: usually one thing, sometimes "BOOM, BOOOM, BOOOOM… ULTRA CHEST".
- [decided 32] Containers sometimes spawn in reprieves, giving "a solid second or two to look at it and click it". The theme is "mystical occult/scientific".
- [decided 32] Trinkets: two equipped, passive buffs. Tiers: common, uncommon, rare, epic, resonant, each rarer to drop.
- [decided 34] Rarer trinkets carry exotic, powerful buffs, not just a bigger number. Extras go to storage.
- [decided 34] Drops come mid-run from good entities, or from the good entity at the end of a run (like Darkest Dungeon's end-of-raid loot).
- [decided 34] Waking with a new trinket plays an animation: first person in bed, taking the covers off, finding it in your hand.
- [decided 47] Trinkets are lore items. Example: Dad's watch, a resonant item ("even though dad is gone, he trace lives on").
- [decided 48] Three collections:
  - **family**, across rarities;
  - **personal**: the main character's own;
  - **Monroe Institute**: occult objects fused with a scientific outlook ("isac bentov"), the rare and resonant ones, through drops or the site at high prices, locked at first, then a random selection each run, and upgradable.
- [decided 51, 52] Clothing can carry buffs: common and up, slight, "like runes or masteries in league", while trinkets are the strong buffs.
- **Superseded, 51 by 52:** 51 said buffs only for "the last two rarities"; 52 corrects it to common and up, slight.
- [decided 41] Two currencies, in two versions he weighed in one message:
  - (a) silver for cosmetics and furniture, a premium one for abilities and persistent stats;
  - (b) gold for premium cosmetics, abilities and upgrading good entities, silver for cheaper cosmetics and physical attributes.
- **Contradiction, inside 41:** (a) against (b). Left for him.
- [decided 67, settles the contradiction above] Neither as written. **Cash** (the silver) is spent at the PC on most things; **energy** (the gold) is spent in the meditation chair to level up. The illicit site prices trinkets in a mix of cash and energy, read as trading with another person who knows the trinket's worth and the energy you give them.
- [proposed: E, look hand-back] Containers in the world's language: a found cassette, a typed memo page, an object in a reprieve's light. Not chosen; item 40 asks for exactly this.
- [GAP] The container's form (item 40). One per biome, or one kind everywhere?
- [GAP] Currency (a) or (b)?
- [GAP] Does luck (item 41) weight container quality, trinket rarity, or both?

## 8. The waking room

- [decided 68] The PC and the home gym are upgraded with cash, part by part (monitors, peripherals; the gym's kind and its equipment): "a subtle pc part builder game". Anything that can be customised, is. Time spent in the room is what raises the chance of an invasion (31). Later unlocks: bigger rooms, windows looking out on different places.

**Built today:**
- none: `HANDOFF.md:78-80`, "M5, the run's frame", not started;
- a run starts at a closed bedroom door in a corridor.

- [decided 3] A room you customize. It looks out onto a fake world you can't reach. You lie in the bed to enter.
- [decided 26] The closet changes your character's look.
- [decided 26] The PC: an online shop for clothing and furniture. An illicit site unlocks once the story reaches a point of understanding, and there you learn abilities. Tapes are bought there ("idk").
- [decided 26] A treadmill and weight rack: a mini game to spend points on speed, acceleration and mobility.
- [decided 48] The room is the hamlet (Darkest Dungeon): the PC, the exercise equipment and the chair each upgradable, like the forge and the training room.
- [decided 48, 49] The chair: abilities (section 4).
- [decided 51] Beanbag designs are bought online ("funky cool psychedelic designs").
- [decided 31] **Invasions** at max stress: a small chance while on the PC or exercising, scary and varied.
  - The window figure: behind bushes, a parked car, a roof across the street. If you don't see it, it works its way in and grabs you from behind. If you see it first, it engages there, then forces the next run.
  - Also: flickering electricity; an entity on the PC screen; knocking.
  - Starting a dream yourself before it reaches you is the safe play. If you are invaded into a dream, you start with stress maxed.
- [decided 31] Mom: never seen. She knocks and checks on you at random, with branching dialogue that builds across visits ("fallout new vegas"). She can relieve stress or raise it. An invading entity may eventually mimic her.
- [decided 31, 32] The window lowers stress, with a cap. Staying awake over about 15 min raises it.
- [decided 46] A picture of his father on the desk, and subtle dialogue with mom early.
- [decided 41] The physical attributes trained here: speed (top speed plus acceleration), agility (faster climbing, more nimble against inertia), luck (a blanket modulator: reprieve spawns, the containers in them, and more), and mental fortitude (42).
- [decided 28] Physical attributes: speed, acceleration, agility, luck, mental fortitude. (Item 41 folds acceleration into speed.)
- [decided 29, 33] A second track: the ability loadout, after the character knows of Gateway.
- **Contradiction, 26 against 48–49:** the PC's role (section 4).
- [GAP] Is the room a full 3D space walked in first person, the same engine as the run? (Item 49's camera moves imply it is.)
- [GAP] Exercise as a mini game: what is the play (rhythm, timing, a hold)? Is "ancient meditation" (42) a separate mini game from the chair's meditation (50)?

## 9. World

**Built today:**
- the generator: lanes, three kinds of stairs, shafts, atria, dead ends, reprieves and void floors (`HANDOFF.md:28-40`; `chase/run.h:91`);
- seven biomes declared (`gen/src/gen.h:219-226`). The apartment is built; the hotel is a parameter proof. Facility, mall, pool rooms, school and chaos are empty (`HANDOFF.md:81`);
- lamps at `lamp_density` 0.06 (`gen/src/gen.h:77`). L162's pooled lighting is on branch `l162-light` 25dc5e7, landing;
- FOV 100° horizontal, widening +5° with speed (`game/settings.h:29,40-42`);
- the flashlight as a setting (`HANDOFF.md:110-117`).

- [decided 4, 5] Keep the procedural fundamentals and the raytraced lighting. Real geometry, more verticality, room shapes beyond rectangles.
- [decided 7] On foot first. Parkour is the rare escape (a dead end where you can jump up and the entity must route round).
- [decided 8, 11] Reprieves: rare transient safety, a "YES lets go" find; the drop-in kind especially loved.
- [decided 14] Wall-runs rare and short: a way across a floor that kills, such as a bottomless abyss or "a stylized void or error in space".
- [decided 17] Wider stairwells.
- [decided 6] Biomes: an apartment building that seems to grow; an expanded hotel, an underground research facility, a mall, pool rooms, a chaotic biome where "the fabric of reality is breaking", a liminal high school or university.
- [decided 26] Biomes are the character's psyche ("the belief system territories are but different manifestations of the space from the player characters psyche"): his apartment, an underground research facility, an empty mall, an empty hospital, an empty high school, perhaps an empty hotel.
- **Contradiction, 6 against 26:** the lists differ. Pool rooms and chaos (6) are not in 26; the hospital (26) is not in 6. Left for him.
- [decided 26] An exceedingly rare "outside": a door to a liminal neighbourhood, or an unnatural green hill, glitched wilderness against the interiors.
- [decided 26] Designed pieces embedded in seeds: designed areas with meaning.
- [decided 28] As chapters progress, seeds get more chaotic and further biomes come closer.
- [decided 36] More light on average, the first biome brighter, darker stretches still possible.
- [decided 23] Semi-high FOV, and a dreamlike haze; psychedelic visual distortions from PsychonautWiki, "subtle but powerful".
- [decided 27] Not a slider: an algorithm chooses how and when the intensity changes, over an always-present dreamlike base.
- [decided 27] The FOV is dynamic: it widens slowly as something comes closer and the faster you go, enough to feel speed, never fish-eyed.
- [decided 26] "there shouldnt be out of body experiences in the dreamzone since you are already technically out of your body."
- **Contradiction, 23 against 26:** item 23's "dreamlike haze of like an out of body experience" against item 26's "no out of body experiences in the dreamzone". Read together it may be "the haze yes, the OBE moment no", but that is a reading; left for him.
- [decided 29] A very rare noclip power-up. Beyond the walls is "this beautifully dark and ominous void that is the intermediate zone between reality and the source", seen only in that state, "an unknowable cosmic horror that is some how beautiful".
- [decided 26] A low-volume theta binaural beat, blended into the mix.
- [proposed: E, L162] Pooled lighting: the apartment never darker, the deep pools and dark stretches in other biomes (`handback/p-l162-light-E_2026-11-11.md`).
- [proposed: E, look hand-back] Effects mapped to the renderer's passes, none adding rays (the worst rooms are already at 2.8–2.9 ms against 2.78). Base FOV 100°. A single "dream intensity" read from game state, which item 27 turns into a director algorithm.
- [proposed: E, Backrooms hand-back] Keep the outside empty, rare and unexplained, with no chaser; don't number the places.
- [proposed: librarian, inventory §6] A seizure warning at launch, and a reduce-flashing setting (his "we could also just have a seizure warning lol"); the binaural beat needs stereo headphones, and the game should claim no effect.
- [GAP] Which visual effects first, and how strong at the base?
- [GAP] What does the director read to set intensity (chase tension, stress, depth, the timer)?
- [GAP] The outside's rarity: once in N runs, once a chapter, or tied to the story?

## 10. Story

**Built today:** none (no story, encounters or chapters in code; `grep -i "story|lore|chapter"` finds nothing relevant).

- [decided 68] **Several playable characters**, each with its own backstory, story, save and a unique buff that can synergise with a build; any build is open to each. You start as the kid who lost his father (46). About a quarter of the way into one story the next character unlocks, never forced. The stories are not in sequence: each discloses what makes another's make sense ("a chaotic intertwining narrative"). His weighting: the intertwining is "the most important part to get right".
- [decided 68] **Two levels:** the character's level inside a run, and a GLOBAL level carrying all XP across runs and characters. The strongest unlocks (items, abilities, better trinkets, upgrades, cosmetics, new characters) sit behind global level caps.
- [GAP, from 68 against 28/30] Does a run lost before the timer still add its XP to the global level, or is it lost there too?

- [decided 23] Gateway tapes and Hemi-Sync as subtle lore; an easter egg that fleshes out the story beyond the gameplay loop.
- [decided 24] The 1983 paper's in-between ("intermediary bubbles" in his words; the paper says "intervening dimensions" ¶18 and "intermediate dimensions" ¶21; "bubble" is not in the text).
- [decided 25] The player is someone accessing this side of themselves with no training and no prior knowledge. The lore is ambiguous at first.
- [decided 26] Never directly tied to the Gateway tapes or Hemi-Sync until the player has played the story out over many runs.
- [decided 26] Rare encounters in chronological order: the first sighting sets up the next, drip-feeding the lore.
- [decided 26] The easter egg **is** the background narrative, layered over the runs.
- [decided 29] The second upgrade track opens once the character "knows of gateway".
- **Contradiction, 23 against 26:** Gateway as the world's lore (23) against never tying it directly (26). Item 49's librarian note reads 26 as "late reveal". Left for him.
- **Contradiction, 26 against 48–49:** a "Monroe institute collection" of trinkets, and meditating "with hemi sync" in the chair, against item 26's "shouldnt directly associate". These are late-game pieces; is that the line?
- [decided 170, supersedes 46's trauma] His father died an ordinary death, young. No murder ("melodramatic"). The story is the hole left in the kid's life, and grief too large to understand, which "never makes sense" even later. Research link: Klass, Silverman & Nickman 1996, *Continuing Bonds* (brief 170).
- ~~[decided 46] … gruesome trauma, never said directly: perhaps his father was murdered.~~ (struck 2026-11-12 at his item 170; kept as the trace)
- [decided 46, still standing] A "slightly modified gateway hemi sync horror trip story". It is never said directly. Only anecdotes: a picture on the desk, subtle dialogue with mom early, curated environment pieces echoing the event. ("Nevermind" as a reference.)
- [decided 47] The god entity may be the embodiment of his love for his father, or his father "in a way".
- [decided 26] The illicit site unlocks once the character passes "a certain point of understanding".
- [decided 28] Chapters: as the story progresses, seeds get more chaotic and further biomes come closer. Beating the game unlocks endless mode.
- [proposed: E, Backrooms hand-back] One story spine behind every encounter, delivered as artifacts. An official account the player can doubt. Each encounter adds a question rather than answering one.
- [proposed: E, look hand-back] The memo with a missing page, and the found tapes, as easter-egg shapes. After item 26 these survive at most as pieces inside the story.
- [GAP] **How "understanding" is measured** (item 26): encounters witnessed, trinkets found, runs survived, the timer beaten?
- [GAP] How many chapters, and what ends each?
- [GAP] Who is the player character (a name, an age, a time period)? Do the father's story's facts need fixing before any designed piece is built?

## 11. Movement and feel

**Built today:**
- the 240 Hz controller: walk, sprint, jump, slide, dive, vault, climb, wall-run, wall-kick, roll and ladders (`HANDOFF.md:28-40`);
- the two-stage sprint at `sprint_speed` 7.0, `sprint_peak_speed` 8.75 and `sprint_peak_time` 8 s (`sim/params.h:35-39`);
- the first game's camera rig (`game/camera.h:7-20`);
- the first-person body (`game/body.h:49-54`);
- look-behind on V (`game/bindings.cpp:22,106`; `game/body.cpp:142`).

- [decided 7] Mirror's Edge movement, but on foot first.
- [decided 12] It should feel more fluid, maybe a slightly higher top speed.
- [decided 13] A good burst off the bat, then a ramp to max over a while, "just like a real sprinter".
- [decided 21] A fixed base speed, raised over runs. "perhaps it goes to 5ms fast, then eases into their top speed to around 10ms".
- [decided 13, 15] A first-person body, with arms and legs seen and matching the actions; the camera attached to it. "expensive but worth it."
- [decided 27] Procedural animation aware of the world: hands on walls; feeling a wall when running along it diagonally; nothing clipping (like an FPS gun near a wall).
- [decided 27] Look-behind while running comes back. (Built: V.)
- [decided 18] No stamina. Juking works on the entities' inertia.
- [decided 28] A player's base speed rises with investment in skills (speed, acceleration, agility).
- [proposed: E, speed hand-back] `sprint_speed` 6 (fixed), `sprint_peak_speed` 9 (upgradable toward 10 for trained and 12.4 for elite), `sprint_peak_time` 4 s. His 5 then 10 is human-shaped, with the timing stretched.
- **Contradiction, numbers:** his guess (21: 5 then 10), E's proposal (6 / 9 / 4 s) and main today (7 / 8.75 / 8 s). Unresolved by play.
- [proposed: E, look hand-back] Key the view's widening to the peak, not `sprint_speed`, so that the long climb is seen.
- [GAP] The speed numbers, after he has felt them in the gym.
- [GAP] Agility's numbers: turn rate, climb speed, or inertia against juking?

---

## GAPS, ordered by what blocks building first

1. **XP's unit and sources** (sections 3, 2).
   - Distance or time (contradiction 7 against 53). Is "distance" metres or depth?
   - XP and currency, one or two?
   - The movement-chain list, and what counts as "evading".
   - *Item 53 answered the sources; what is still open is these.*
   - It blocks the HUD, the score code (`chase/run.cpp:205`) and every reward.
2. **Abilities: the six, or slots** (section 4).
   - Contradiction 33 against 53.
   - The starting six by name and their three ultimates; slot counts; the Focus level's role in the chair.
   - The PC against the chair (26 against 48–49).
   - *Item 53 opened the slots question; nothing is named yet.*
   - It blocks every ability build, including the flashlight's pairing.
3. **The run's timer and end** (section 2): its length and whether it is shown; whether being consumed at the end is possible (28 against 30); what "the part taken" does.
   - It blocks the end gods, the overtime XP and the round.
4. **Stress** (section 5): does stress carry over after a regular catch? Is it shown or only felt?
   - It blocks the frenzy and Resonant, and the room's invasions.
5. **Containers and currencies** (section 7): the container's form, per biome or one kind (40); currency (a) or (b) (41); luck's reach.
   - It blocks the economy and the flashlight's find.
6. **Speed numbers** (section 11), after the gym. A's chase model takes them as dials, so this blocks tuning, not code.
7. **Biome list** (section 9): 6 against 26 (pool rooms and chaos, against the hospital). It blocks the M6 biome work.
8. **The look** (section 9): which effects first, what the director reads, and OBE haze against no OBE (23 against 26).
9. **The waking room** (section 8): a full 3D room or not; the mini games.
10. **Story** (section 10): how understanding is measured; chapters; the character's facts; Gateway's line (23 against 26, and 26 against 48–49).
11. **Tone** (section 1): which cliches; where faith shows.
12. **Entities' lore** per archetype, and the good entities' frequency and failure (section 6).
