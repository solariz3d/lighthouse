# Build paths 00: the item index, 2026-11-13

How to read it: each row is one numbered item from `briefs/dreamzone2_the_game.md` (his words, items 1 to 179); the gist is the writer's own paraphrase, so open the item before quoting it.
The keys are the fifteen aspect keys of the build-path handoffs (run_frame, chase_entities, entity_bodies, player_body, movement, abilities, stress, meta_loop, waking_room, world_gen, look_fear, sound, story_lore, frontdoor_onboarding, tech_foundation); an item with several keys feeds several handoffs.
Items marked none are about how the room works, another project or the parked Roblox idea; find any item in the brief by the line in the second column.

| item | brief line | gist | aspect keys |
|---|---|---|---|
| 1 | 8 | Rewrite as a nextbot-style run: flee a very fast entity, beat it by skill and movement through a procedural world. | chase_entities, movement, world_gen |
| 2 | 12 | Start level 1 and weak; levelling over many runs makes play more fun, not just easier. | meta_loop |
| 3 | 14 | A customisable room looking on a fake world; lie in bed, wake in the dream; the room door starts the run and something chases at once, maybe several archetypes. | waking_room, run_frame, chase_entities |
| 4 | 17 | Put the generator fundamentals on real world geometry; more verticality than three layers; room shapes beyond rectangles. | world_gen, movement |
| 5 | 21 | Decision: full rewrite keeping the generator fundamentals and raytraced lighting. | tech_foundation, world_gen, look_fear |
| 6 | 23 | Biomes inside the generator: growing apartment building, hotel, research facility, mall, pool rooms, chaos, liminal school; liminal spaces are the point. | world_gen |
| 7 | 29 | Correction: open-ended world with rare dead ends that end runs; points are time alive; difficulty climbs; full movement kit but on foot first, parkour as the rare escape. | world_gen, meta_loop, movement, chase_entities |
| 8 | 38 | The reprieve: rare transient safety the hunter cannot enter, a playful got-here-before-you shortcut that de-aggros lesser mobs. | world_gen, chase_entities |
| 9 | 45 | Builders may go all out until a working base exists. | tech_foundation |
| 10 | 66 | Original flashlight is missing; wants it as a perk found or unlocked in a run, perhaps permanent later. | abilities, look_fear |
| 11 | 69 | Loves the safe zones, especially the drop-in one; amused by the system sound used. | world_gen, sound |
| 12 | 71 | Gym course: movement needs more fluid animation and maybe slightly higher top speed. | movement, player_body |
| 13 | 73 | Copy the first game camera FOV feel; burst start then a ramp to max sprint; realistic first-person arms and legs with the camera attached. | movement, player_body, look_fear |
| 14 | 79 | Wall-running should be rare and short, a way over a lethal floor; floors may be an abyss or a stylised void. | movement, world_gen |
| 15 | 83 | Asks when the running feel and animation rework starts. | player_body, movement |
| 16 | 84 | Better entity animation, thunderous bassy footsteps for the main entity, and eventually a brutal jumpscare (not in testing). | entity_bodies, sound, look_fear |
| 17 | 88 | World is good, stairwells wider; entity pathing very good but unbeatable without exploiting wall scrapes; OP but not speed-hacking. | world_gen, chase_entities |
| 18 | 93 | Chaser speed and intelligence scale with distance and difficulty, with inertia so they can be juked; interceptor nimbler; long straights raise their speed, turning scrubs it; stamina doubtful. | chase_entities, movement |
| 19 | 103 | Go-ahead to build the camera; the Third Place may hand off or keep working (process). | none (out of scope) |
| 20 | 106 | Offers a swap to the Third Place: pick up the Dreamride work (another project). | none (out of scope) |
| 21 | 109 | Sprint accelerates quickly to a base (about 5 m/s), then eases to about 10 m/s; upgrades via points in sprint speed, acceleration, turn. | movement, meta_loop |
| 22 | 116 | Research run speed for the game; hand over to the librarian. | movement |
| 23 | 118 | Look: semi-high FOV, dreamlike haze, replicate psychedelic distortions subtly; the game comes from his dreams; Gateway tapes and Hemi-Sync as subtle lore and an easter egg. | look_fear, story_lore |
| 24 | 125 | Look into the CIA Gateway paper intermediary bubbles between the Absolute and reality; librarian checked the text. | story_lore |
| 25 | 140 | Lore ambiguous at first; good and bad intelligences outside time-space; good entities (aura, tank); roguelite structure with chests, freeze-time ability picks and synergies. | story_lore, chase_entities, abilities, meta_loop |
| 26 | 161 | Big message: lore never tied to Gateway directly, rare ordered encounters, designed pieces in seeds, biomes as the psyche, rare outside, sound that quiets near a good entity, binaural theta, the catch as a portal jumpscare, the room (closet, PC, illicit site, treadmill), currencies, tapes. | story_lore, world_gen, sound, look_fear, run_frame, waking_room, meta_loop, abilities, chase_entities |
| 27 | 193 | Dream intensity chosen by an algorithm, dynamic FOV, bring back look-behind, procedural body animation against walls. | look_fear, player_body, movement |
| 28 | 205 | 10% start advantage; physical attributes and a Darkest Dungeon style stress system that feeds chaser aggression; 10-15 min timer; two gods fight at the end; endless mode; chapters make seeds chaotic; base difficulty chosen. | run_frame, stress, chase_entities, meta_loop, story_lore, world_gen, frontdoor_onboarding |
| 29 | 235 | Second upgrade track is the ability loadout: golden aura shield, super sprint, dream flight, a very rare noclip that shows the void behind the walls. | abilities, world_gen |
| 30 | 243 | Caught before the timer you lose it all and learn it was always the evil god playing; at the timer the good god steps in. | run_frame, story_lore, chase_entities |
| 31 | 253 | At max stress the waking room can be invaded (window figure, flicker, PC scare, knock); the mother as an unseen branching-dialogue character; window lowers stress. | waking_room, stress |
| 32 | 275 | Window relief capped; stress replaces insanity; at full stress 75% frenzy, 25% virtue/Resonant; two equipped trinkets in five tiers; containers in reprieves. | stress, meta_loop, waking_room, abilities |
| 33 | 305 | Start with six abilities: four physical fusing to two ultimates, two psychic fusing to one; training and the site unlock more. | abilities |
| 34 | 324 | Containers give run abilities; rare good entities drop scaling exotic trinkets; slot limits; wake-up-in-bed trinket animation. | meta_loop, chase_entities, waking_room |
| 35 | 336 | Asks for telemetry of a brutal run where an interceptor cut him off; only a best-time file exists. | tech_foundation, chase_entities |
| 36 | 341 | Add the original flashlight for testing but not at spawn; more lights on average, first biome lit. | abilities, look_fear, world_gen |
| 37 | 345 | Flashlight fused with a psychic power slows or repels entities. | abilities, chase_entities |
| 38 | 347 | The fused flashlight frenzies every entity it is not pointed at. | abilities, stress |
| 39 | 348 | Flashlight unlocks early, its partner ability late; it repels front-spawning interceptors so they swarm behind. | abilities, chase_entities |
| 40 | 351 | Flashlight is found in containers, not carried at spawn; wants a more thematic thing than a generic chest. | meta_loop, abilities |
| 41 | 355 | Containers drop currency; two currencies; attributes speed, agility, luck, fortitude; slot-machine chest opening. | meta_loop |
| 42 | 366 | Mental fortitude: ancient-meditation mini game; mitigates stress and lowers the frenzy peak. | stress, meta_loop |
| 43 | 370 | Wants real horror content: existential dread, quote about biology as a phase of geometry. | story_lore, look_fear |
| 44 | 378 | Finishes the quote: staring for a creator, the machinery running on its own. | story_lore |
| 45 | 380 | The horror mirrors his struggle to believe in something good; dark dread plus classic horror cliches. | story_lore |
| 46 | 383 | Story: the character grief for his father told by anecdote, photo on the desk, mom dialogue, curated environment echoes; reference game Nevermind. | story_lore, waking_room |
| 47 | 389 | Trinkets as lore items (Dad watch); the god entity may be love for the father. | story_lore, meta_loop |
| 48 | 392 | Trinket collections (family, personal, Monroe Institute); the room as a Darkest Dungeon hamlet; the chair for abilities. | meta_loop, waking_room, abilities |
| 49 | 403 | The chair: sit, meditate, go out of body into a cosmic-void menu in third person, focus level decides abilities. | waking_room, abilities |
| 50 | 419 | Meditating while tweaking abilities gives a base stress reduction, upgradable. | stress, abilities, waking_room |
| 51 | 421 | Beanbag designs for sale; cosmetics carry slight buffs. | meta_loop, waking_room |
| 52 | 424 | Cosmetics of all rarities carry slight buffs (like league runes); trinkets are the strong ones. | meta_loop |
| 53 | 426 | XP from distance, multipliers, frenzy, entity proximity, Parks, evasion, chests and movement chains; limited ability slots; overtime bonus. | meta_loop, movement, abilities, stress, run_frame |
| 54 | 438 | Safe zones erode over 10 s into hell red with screaming effects. | world_gen, look_fear, sound |
| 55 | 443 | An eroded safe zone becomes ordinary dream space. | world_gen |
| 56 | 444 | The erosion clock starts at first entry and runs whether he stays or leaves. | world_gen |
| 57 | 448 | Movement research wanted (Mirror's Edge, nextbot parkour); super slide and dive-roll; bhop as an endgame perk, allowed by the base movement system. | movement, meta_loop, abilities |
| 58 | 459 | Points come from movement you do more often, not extra pay; psychic abilities (aura, shroud that costs stress, speed spell, flashlight fusion). | meta_loop, abilities, stress |
| 59 | 474 | Virtues and afflictions like Darkest Dungeon, with persistent buffs; build our own versions. | stress |
| 60 | 489 | Best virtue is simply Resonant: ultra rare (about 1-2% on top of 25%), all buffs, stress cannot rise. | stress |
| 61 | 495 | Resonant star lasts 2-3 min while the evil entity throws frenzy at you but cannot get you; buffs and no-stress stay after. | stress, chase_entities |
| 62 | 503 | Names it Recognition; asks why a player cannot always embody it. | stress |
| 63 | 506 | Raytraced lighting is too grainy and leaves shimmering ghost trails off the player model. | look_fear, tech_foundation |
| 64 | 509 | Run data from a brutal run: cut off from the front by a pack that heard him; hunter never closed. | tech_foundation, chase_entities |
| 65 | 519 | No stealth; the hunter always knows where you are; only lesser entities hear and see. | chase_entities |
| 66 | 523 | Overtime settled: caught before the timer loses everything; after the timer the evil god always catches you and the good god always saves you. | run_frame, meta_loop |
| 67 | 532 | Two currencies: cash (PC) and energy (meditation, illicit site mix). | meta_loop |
| 68 | 539 | Room as a PC/gym builder; several characters with stories, saves and buffs that intertwine; global level beside run level. | waking_room, meta_loop, story_lore |
| 69 | 572 | Lost runs give crumbs of global XP; energy comes from escapes and chests; why does a dream pay cash. | meta_loop |
| 70 | 579 | First-run tutorial; a cheque with the Monroe Institute name arrives after the first success; early-2000s period. | story_lore, waking_room, frontdoor_onboarding |
| 71 | 589 | Second character, the writer: rich, no energy, learns by tapes in a modern loft. | story_lore |
| 72 | 608 | Order of work: game feel first, then the kid arc, then other characters (about four). | story_lore |
| 73 | 614 | First play on D: fell in a void, fun, likes safe zones; needs refined animation and style; everything is boxes. | entity_bodies, player_body, look_fear |
| 74 | 620 | Look refs: liminal creepypasta and nostalgia bait; each character psyche gets its own biomes later. | look_fear, world_gen, story_lore |
| 75 | 628 | Rejects camera or tape look; fear from psychedelic effects; target pseudo-photoreal stylised hyperrealism like Night Runners. | look_fear |
| 76 | 638 | Keeps the look page light, surfaces, composition and sound. | look_fear, sound |
| 77 | 643 | Wants an in-depth ray-traced style audio system, citing Bodycam. | sound |
| 78 | 648 | Clarifies the reference game: Night-Runners racing game. | look_fear |
| 79 | 652 | A detailed distinct face per character, rarely seen. | player_body, waking_room |
| 80 | 660 | Remove the map; the player should not have one. | world_gen |
| 81 | 667 | Sprint top speed about 10 m/s earned by holding it with good lines; mobs a little faster too. | movement, chase_entities |
| 82 | 676 | Order while asleep: biomes for the kid, then player model and entities in detail, then textures and props that fit their surroundings; camera attached to a real model face. | world_gen, player_body, entity_bodies, look_fear |
| 83 | 692 | Blender and Python for Blender work are approved. | tech_foundation, entity_bodies |
| 84 | 697 | Queue lore theorycrafting on Monroe and Hemi-Sync; real names may be referenced. | story_lore |
| 85 | 705 | Widen lore work to character life paths and intertwining; entities are built fully detailed, not low-detail. | story_lore, entity_bodies |
| 86 | 716 | Yes to all waiting questions; the kid design needs to be more designed with a no-buff base outfit. | player_body, meta_loop, tech_foundation |
| 87 | 725 | Clothing slots: shoes, pants, shirt/jacket, accessories. | meta_loop, player_body |
| 88 | 731 | After a corner the chaser locks onto him in a dead straight line, reads as machine. | chase_entities |
| 89 | 736 | Asks about other biomes; loves the start biome but there are too many doors. | world_gen |
| 90 | 744 | The sounds themselves need work. | sound |
| 91 | 748 | Long run: the generator is far too repetitive over five minutes; nothing kept up with him for seven minutes. | world_gen, chase_entities, tech_foundation |
| 92 | 756 | Lesser entities ahead should hear him, move toward the sound, scare before they catch; the hunter is the exception. | chase_entities, sound |
| 93 | 764 | Reprieves are mostly short ladder drops; wants more shapes, some tied to long hallways, built from curated mirrorable pieces. | world_gen |
| 94 | 774 | Reprieve passages of varying length with falling odds past about four pieces; luck and upgrades could lengthen or enrich them. | world_gen, meta_loop |
| 95 | 786 | The safe zones are renamed the Park. | world_gen, story_lore |
| 96 | 792 | Third character: a Russian operator trained by the KGB in a barracks. | story_lore |
| 97 | 797 | Time is non-linear there, so characters can come from different eras. | story_lore |
| 98 | 803 | Each character room and progression: kid and writer have PCs of their eras, operator has fliers and a bunker. | waking_room, story_lore, meta_loop |
| 99 | 826 | PC builder with era-realistic prices, parody brands, full part list, a late-game resource sink. | waking_room, meta_loop |
| 100 | 841 | Operator text reads Russian until the player focuses it, then English. | story_lore, frontdoor_onboarding |
| 101 | 847 | Scope cut: one great playable character, the kid. | story_lore |
| 102 | 854 | The kid story is reopened; father death no longer required. | story_lore |
| 103 | 858 | Picks the story premise The Signal: a used 2005 PC with Gateway rips on it, something answers. | story_lore, waking_room |
| 104 | 865 | Add KGB and CIA findings as found lore. | story_lore |
| 105 | 872 | The previous PC owner is a connected stranger; the good god needs a new name. | story_lore |
| 106 | 879 | Kid waking life: working mother, an online best friend, the seller who watches. | story_lore, waking_room |
| 107 | 887 | The good god is the Absolute; the central mystery is why there is darkness, perhaps the player own self. | story_lore, chase_entities |
| 108 | 894 | The father death stays in the story; the dark one name did not land. | story_lore |
| 109 | 900 | The base outfit is his regular clothing; the father item is a late unlock. | player_body, story_lore, meta_loop |
| 110 | 906 | Story accepted for now; the dark one name open among four. | story_lore |
| 111 | 910 | Wardrobe: mid-2000s style, parody brands, haircuts under hats, a dozen items per slot, buffs that rub off on worn clothing. | meta_loop, player_body |
| 112 | 926 | Legendary clothing drops in the dream arrive kitted with buffs; quirks can be locked or removed. | meta_loop |
| 113 | 934 | Dream drops are unique lore-based legendary cosmetics not sold in stores. | meta_loop, story_lore |
| 114 | 939 | The father late-game item is his watch, found in the dreamzone, a trinket. | meta_loop, story_lore, player_body |
| 115 | 944 | Clothing brands should parody real big brands of 2005. | meta_loop |
| 116 | 950 | Keep clothing, accessories and the two carried trinkets sharply separate. | meta_loop |
| 117 | 957 | Accessories carry small buffs; shop items reroll their buffs each restock; research mini buffs. | meta_loop, waking_room |
| 118 | 972 | Cosmetic enchantments are removed or locked in the chair cosmic menu. | meta_loop, waking_room |
| 119 | 977 | The shop rerolls once per day-night cycle between runs. | meta_loop |
| 120 | 980 | Parody brand names should read as believable, not jokes. | meta_loop |
| 121 | 983 | A trinket that triggers after Recognition ends makes no sense since stress stays zero. | stress, meta_loop |
| 122 | 989 | Stop opening new threads; finish work in motion then a comprehensive gap sweep. | tech_foundation |
| 123 | 993 | Father watch is a trinket, his bomber a legendary jacket, his sunglasses a legendary accessory. | meta_loop, story_lore |
| 124 | 999 | No sealed Park pieces: luck only affects chests, not Park length. | world_gen, meta_loop |
| 125 | 1006 | Park erosion creeps along the passage and starts 15 s after first entry. | world_gen |
| 126 | 1010 | Bug: fell into a void shown while standing on a normal floor. | tech_foundation, world_gen |
| 127 | 1015 | Look into pathing of known games and open source; Left 4 Dead is the ideal reference. | chase_entities |
| 128 | 1019 | Possibly They Are Billions as another reference for mass pathing. | chase_entities |
| 129 | 1022 | L4D infected had momentum and inertia, not a straight optimal line. | chase_entities, entity_bodies |
| 130 | 1025 | What matters is the look-behind view: pursuers sloshing around corners. | chase_entities, player_body |
| 131 | 1029 | Arc Raiders trains robot locomotion with reinforcement learning under behaviour trees. | chase_entities, entity_bodies |
| 132 | 1036 | Chaser counts scale with difficulty and story; first runs forgiving even at brutal. | chase_entities, meta_loop, frontdoor_onboarding |
| 133 | 1039 | Approves doing the librarian whole ordered list. | tech_foundation |
| 134 | 1041 | Wants a COD style slide-cancel and sprint-reset movement mechanic; research it. | movement |
| 135 | 1046 | Physics mostly realistic, bent stylistically where lore allows. | movement, look_fear |
| 136 | 1049 | Movement bends show through the psychedelic distortion layer, not yet built. | look_fear, movement |
| 137 | 1052 | Base movement list plus a corner and near-miss speed surge, like Galactic Racer. | movement |
| 138 | 1061 | Surge is earned by overtaking fused with Burnout near-miss. | movement |
| 139 | 1065 | Asks what the surge cooldowns are for. | movement |
| 140 | 1066 | Diminishing returns replace cooldowns; base surge limited, abilities raise limits. | movement |
| 141 | 1073 | Player getting too fast, so every mob gets a unique ability to level the field. | chase_entities, movement |
| 142 | 1075 | Go-ahead on the chaser kit R1 in two waves. | chase_entities |
| 143 | 1078 | A friend says a Roblox port could make money (parked). | none (out of scope) |
| 144 | 1079 | Likes microtransactions on Roblox, kept in mind (parked). | none (out of scope) |
| 145 | 1080 | Roblox monetisation: document only, research later (parked). | none (out of scope) |
| 146 | 1085 | Hunter animation is not smooth, glitches into turns, seems tied to pathing. | entity_bodies, chase_entities |
| 147 | 1087 | First-person body needs work; look-back clips into neck and shoulder. | player_body |
| 148 | 1089 | Check a run: he did not loop back; the wooden door was a false door. | world_gen, tech_foundation |
| 149 | 1097 | Stair bug: a drop beside wider stairs. | world_gen, tech_foundation |
| 150 | 1102 | Research open-source animation to learn from, not use. | entity_bodies, player_body |
| 151 | 1104 | Hunter turns then leans; was the L4D pathing insight implemented? No. | entity_bodies, chase_entities |
| 152 | 1107 | Overall animation needs a hard rework, including the looking-down body. | entity_bodies, player_body |
| 153 | 1109 | Why do research then ignore it; remove the home-made lean. | entity_bodies |
| 154 | 1111 | Learn how Valve animated before building. | entity_bodies |
| 155 | 1113 | Picks: tilt first then slide lean, hunter faces you while sliding, climb uses procedural grips. | entity_bodies, chase_entities |
| 156 | 1114 | Bring back the first game kinetic-linking whole-body animation for all entities and the player. | entity_bodies, player_body |
| 157 | 1117 | Keep the sourced lean, fix sway; remove the straight-line rocking. | entity_bodies, chase_entities |
| 158 | 1118 | Physics engine driving procedural animation; Jolt ragdoll exists. | entity_bodies, player_body, tech_foundation |
| 159 | 1120 | Player body must look smooth looking down: criss-crossing legs, hands touching walls. | player_body |
| 160 | 1122 | Mesh reactions-only and physics-balanced locomotion in a unique way. | entity_bodies, player_body |
| 161 | 1124 | Physics could control the camera and controls. | player_body, movement |
| 162 | 1127 | Pick: physics owns what he sees (eye on a simulated head, reactions), aim and root unchanged, small inertia dial. | player_body, movement |
| 163 | 1128 | Hunter legs cannot keep up, needs longer strides and swinging torso; player sideways look needs head-first twist. | entity_bodies, player_body |
| 164 | 1131 | Hunter snags on walls and turns too fast keeping speed. | chase_entities, entity_bodies |
| 165 | 1133 | Standing rule: check each of his ideas against research before planning. | tech_foundation, entity_bodies |
| 166 | 1138 | Use locomotion data from wild animals and humans. | entity_bodies, chase_entities |
| 167 | 1143 | Entities mix animal traits with human form for an uncanny effect. | entity_bodies |
| 168 | 1150 | All entities humanoid with their own uncanniness; hunter corners by the animal law; shapes come from the psyche. | entity_bodies, chase_entities, story_lore |
| 169 | 1154 | Picks per-kind uncanny traits from E table. | entity_bodies, chase_entities |
| 170 | 1156 | Father died an ordinary death young; grief too large to understand. | story_lore |
| 171 | 1159 | Grief and stress as the gateway to attunement; no real case named. | story_lore, stress |
| 172 | 1165 | The thesis: run from death, hope that something good saves you; love must shine through the horror. | story_lore, run_frame |
| 173 | 1175 | Picks on first-person body: shoulder sliver on look-back, loose fist, leading leg in slide. | player_body |
| 174 | 1176 | Lore stays on the surface, abundant only for those who dig, using real research in a fictional frame. | story_lore |
| 175 | 1180 | Hunter animation better, arms need to swing more with the body. | entity_bodies |
| 176 | 1188 | Arms: bigger swing at speed and more torso twist, with his eye as the bar. | entity_bodies |
| 177 | 1189 | Arms still too close to the sides; use the real research on arm shape. | entity_bodies |
| 178 | 1197 | Wall to wall in a square room the chasers cannot catch him; wants hawk-like mirror and cut-off states, arcs not sharp turns; footsteps matter. | chase_entities, sound |
| 179 | 1203 | Asks for a research-only swarm to scout build paths for richer, personalised procedural generation and a handoff per idea. | world_gen, tech_foundation |
