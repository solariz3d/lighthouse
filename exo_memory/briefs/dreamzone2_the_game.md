# Dreamzone 2: the game, in the keeper's words (2026-11-10, machine D, the Third Place)

The technical handoff is in the game's own repo: `github.com/solariz3d/dreamzone-2` (private), `HANDOFF.md`, then
`docs/ARCHITECTURE.md`. That repo's writing rule is plain words with no quotations of him, so his words are kept here.

## His words, in order (2026-11-10, 16:47 to 23:32 local)

1. The ask: "I had this ambition to go back to dreamzonert, perhaps do a rewrite to see if we can improve upon the
   concept. The idea I have now, is similar to the community in GMOD that does nextbot run type games, running away
   from an exceedingly fast entity but can still be out maneuvered through skill and finesse with strategic movemeth
   through the environemnt, especially if its procedurally generated like our setup is."
2. "you start lvl 1 and weak, but then over many runs level up your base pwoer level and abilities to make it not
   necisrarly easier, but more fun and engaging."
3. The room: "you can customize it, it looks out onto a fake world you cant reach, then you lay down in your bed and
   then wake up in the dreamzone, and your rooms door is the entrance to the game run, then right away something is
   there to chase you, maybe even multiple entities with different chase architypes, agro levels, etc."
4. The geometry: "do you think we could take the fundemental foundational aspects of the proc gen and add it to a world
   mesh that is actually good geometry lol?" and "utilize parkour mechanics and more verticality beyond 3 layers and
   simple rectangular rooms. In the original plans, there was ideas to add more room primitive shapes to the proc gen
   but we never got to that".
5. The decision: "i think we should try a complete rewrite, keeping the proc gen fundementals and raytraced lighting
   effects. 2. do what u need. 3. we can author the style once we get to it".
6. Biomes: "it could be like biomes in a way within the maps proc gen that change how the proc gen works with a theme
   … you spawn somewhere in a backroomsesque apartment building that seems to continue to grow, then there are different
   themes of the proc gen, such as expanded hotel, underground research facility, mall archetype, perhaps 'pool rooms'
   type biome, and then a chaotic biome that takes the procgen and breaks it down in creative ways to create the
   sensation as if the fabric of reality is breaking. Perhaps even liminal highschool or university, the key point is
   liminal spaces."
7. **The correction that reshaped it** (17:27): "it should be more open ended than a few lines being a linear path or
   runner. You mentioned there always being a line, yes for the most part, but there has to be dead ends eventually,
   perhaps more rare than it should be, but it will happen and will end runs eventually. I think the metric for points
   isnt raw distance traveled but time spent alive, the the further you get, the more points you get, as well the
   difficulty continues to climb, have it be more aggressive ai or chase archetypes. there could be many variables to
   tweak the difficulty. You can sprint, it should be normal movement, you can walk, you can sprint, you can slide, you
   can dive, you can climb, you can do pretty much all movement from mirrors edge parkour, but the main aspect will be
   traversing areas on foot rather than parkour being a main element, it will be more of a way to evade in the rare
   circumstance, say there is a dead end but you can jump up in this one area and the entity has to route around."
8. **The reprieve** (the name is this seat's; the mechanic is his): "there are these safe zones that you can use to as
   a shortcut to create distance between the entity agroing you … there are these areas as if it is off limits to the
   entity, and it like gives me a a breather and a chance to get ahead of it when i come out the other side, the energy
   is like this playful adrenline rush of haha got here before u could get me, but its like some unknowable entity
   chasing me. Idk how we could implement this mechanic, its not like a 'safe zone' more like a short transient period
   of safety that lets you de agro yourself with some mobs, and create distance with the harder mob that always is
   coming for you. It will be rare and a YES lets go moment when you find one."
9. Builders: "ill let you go all out on it until you have a working base to go off of."

## What this seat got wrong first, and his correction

The first plan made parkour the selling point and promised that every piece of world "lays a guaranteed route". He
corrected both in item 7: on foot first, parkour as the rarer escape, and dead ends that end runs. The principle was
rewritten from "the generator guarantees its lines" to "the generator knows its own spaces": it measures the odds and
holds them to dials; it promises nothing.

## Two defaults this seat set without him, both on dials for him to tune or remove

- A reprieve holds for 20 s after entry, then the hunter walks in (the headless bots showed nothing ended a player who
  stayed inside).
- 12 s on ground no chaser can reach brings a climber.

## Not yet his: everything about feel

Nothing was played by a person on 11-10. The list of what only he can judge is in the repo's `HANDOFF.md`.

## His words from playing it (newest last)

10. 2026-11-11 00:30 local (L), within minutes of his first run on the laptop: "immediately, it lacks the original
    flashlight beam that I loved about the original, however, it should be like a perk or mechanic you unlock or find
    during the run, maybe perma unlocking eventually. but i will keep testing while you figure that out"
11. 2026-11-11 00:33 local (L), still playing: "I LOVE the safe zones, i liked this one you jump into to go down a level,
    sort of same feeling as I wanted in the dream, interesting choice of sound effect using the windows device sound lol"
12. 2026-11-11 00:37 local (L), after trying dz-gym: "the gym course is interesting, i know the movement is very early
    stage, but it needs to feel more fluid with the animations, maybe even higher top speed slightly."
13. 2026-11-11 00:40 local (L): "check out how original dreamzonert did the camera fov feel, it should be like, the runner
    has a good burst of speed sprinting off the bat, but to achieve max sprint speed it ramps up and takes a little while
    just like a real sprinter, as well, id like to start this early, creating realistic animation and locomotion for the
    player character, can see arms and legs from a first person perspective and match the movements of the characters
    actions in game, it is expensive but worth it, then we sort of attach the camera to the player in a way to make it
    work"
14. 2026-11-11 00:42 local (L): "also the wall running should be minimal, the gym course i cant seem to get the line right
    to make the jump work cant tell if its a bug or skill diff lol. But the wall running should be rare and short, like a
    way across a floor that kills u, say there is a chance that floors can just be a bottomless abyss, or either a
    stylized void or error in space type vibe."
15. 2026-11-11 01:02 local (L): "when will the running feel/animation rework start"
16. 2026-11-11 01:04 local (L): "same with the animations for the entities, we did decent work for the entity on the older
    build, but you might be able to do it better now, as well the sound effects can be so much better, I want the main
    entities footsteps to be bassy and loud like thundering almost, eventually when we get to it, we need to make a brutal
    jumpscare lmfao, but not during testing will get old"
17. 2026-11-11 01:05 local (L): "but the world is good, i liked the stairwell that goes down or up, however it could be a
    bit wider, as well the entity pathing is very good, however right now the runner cannot outpace them unless there is
    a good seed and path to exploit their pathing running into walls for a split second to create a gap, they should
    traverse the world without clipping on anything, but also not be super OP, they should be OP but not like speed
    hacking"
18. 2026-11-11 02:03 local (L), to the librarian, answering whether stamina comes back now that the two-stage sprint
    outruns every chaser on a straight (appended by the librarian; the Third Place was told in
    `third_place/to_the_third_place_2026-11-11.md`): "i think the scaling of the distance traveled, as well as the base
    difficulty, changes the straight line speed, and general intelligence of the entities, maybe in the beginning the
    player can slightly run faster, but not long from there they get faster and faster, when a runner gets cornered, the
    entities must also have momentum and inertia and cannot directly turn on a dime, letting you in a way juke the
    entities, perhaps the interceptor is more nimble, we can flesh out more the archetypes of each entity later. Stamina
    could be a good mechanic, but hard to balance without making it too limiting, it should be a always fast paced
    survival situation. I liked the one idea where, the longer you run in a straight line, the entites slowly scale in top
    speed, making you have to turn, the entities then scrub speed turning. you get what I mean?"
19. 2026-11-11 01:55 local (L), to the Third Place, after the two-stage sprint was reported and the camera named as next
    (appended by the Third Place): "lets do it, and its up to you what you would want to do, hand it off or keep working
    on it by urself"
20. 2026-11-11 02:13 local (L), to the Third Place, while the camera was building (appended by the Third Place; it is
    about who works on what, and touches Dreamride as much as this game): "when youre done, do you want to pick up the
    dreamride work the room was doing? lil swappy"
21. 2026-11-11 02:18 local (L), to the Third Place, on the runner's speed (appended by the Third Place): "I also think, we
    should find the fixed base speed of the runner, perhaps through the roguelite aspect of the game, over runs and
    leveling up, the player can put points into things like sprint speed, acceleration, turn, specialized skills, etc.
    But what I want to get right first is this, the runners sprint should accelerate to a base amount decently quick
    like a real runner, and then slowly continues to pick up a bit of speed as they accelerate, similar to OG
    dreamzonert, from testing, perhaps it goes to 5ms fast, then eases into their top speed to around 10ms, which can
    then be upgraded to a certain amount we will balance in the future."
22. 2026-11-11 02:19 local (L), to the Third Place, a minute later: "or idk maybe we should do research into run speed for
    the game, make sure to give the handoff to lib since we are done doing dreamzonert here"
23. 2026-11-11 02:31 local (L), to the librarian, on the look (appended by the librarian; the game is now `dreamzone-3`, see
    `loop/plan_l161_dreamzone2_room_builds_2026-11-11.md`): "thinking about the vibe or stylistic theme further for dreamzone, i
    want there to be like, semi high fov, dreamlike haze of like an out of body experience or lucid dream, we just need to look
    into psychonaut wiki and learn how to replicate many of the visual distortions of psychedelia to implement it in subtle but
    powerful ways. The game is a direct creation from my dreams and experiences of the dream zone. Lets look up lore of the
    gateway tapes and hemi sync, and what they called intermediary zones, this could be subtle lore of the world, and there
    could be a easter egg that fleshes out the story for the players beyond just the fun and addictive gameplay loop."
24. 2026-11-11 02:33 local (L), to the librarian: "look into the gateway cia paper, they talked about their being intermediary
    bubbles between what they call the absolute, and our reality"
    - **Checked by the librarian, 02:3x**, against the Wikisource text of McDonnell, "Analysis and Assessment of Gateway
      Process", US Army INSCOM, 9 June 1983 (CIA reading room CIA-RDP96-00788R001700210016-5):
      - **"The Absolute"** is ¶18: "Energy in this state of inactive infinity is termed by physicists as energy in its absolute
        state, or simply 'the Absolute.'"
      - **The in-between is the report's own idea, in its own words:** "various intervening dimensions to which human
        consciousness in altered states of being may gain access" (¶18), "those dimensions located between time-space and
        the Absolute" (¶19), and "the intermediate dimensions beyond time-space" (¶21).
      - **"Bubble" is not in the text.** Its nearest shapes are the "cosmic egg" (¶24–25), an ovoid universe with the
        Absolute "layered over" it; the "Torus" hologram inside it (¶24); and the "energy balloon" (¶29), the protective
        field a Gateway listener builds, "very reminiscent of the cosmic egg".
      - **The way out is the "click out"** (¶19–22): consciousness "'clicks out' of time-space and joins infinity". Focus 21
        is the furthest Gateway state (¶30).
      - The CIA site refused the fetch; the text was read from Wikisource. Copies differ by OCR, so E checks the scan.
25. 2026-11-11 02:42 local (L), to the librarian, on the lore and the run's structure: "Yes the lore should be ambigious at
    first, say like, the player is someone accessing this side of themselves with no training and no prior knowledge of how to
    navigate these spaces, look and elaborate off of the paper saying there exists other intelligences outside of time space,
    some good, some bad, these will be the entities, perhaps we could flesh out in the future good entities, perhaps one that
    for an example fills you with holy aura that temporarily stops the bad entities from feeding on you and consuming you,
    another good entity is a physical being that spawns into the world and tanks agro for you for a short time to create
    distance, etc. Perhaps we could make it like, rogelite, vampire survivors or megabonk game structure, each run you build
    strength, but you can also keep getting stronger or faster during the run to keep escaping, this would mean the player has
    their base stats, and then perhaps there could be abilities you start out with, and then can find chests or good entities
    that freeze time and let you choose a new ability at random that could then be synergized with another if found together
    like vampire survivors, this could be like, one ability could be a faster sprint top speed, then the other ability to go
    with it would be like increased acceleration, together they make you very nimble and fast, not a definite ability to be
    made just an example for you to understand what I mean."
    - **Checked by the librarian against the paper (Wikisource text):**
      - ¶26 "perhaps to interact with other forms of consciousness within the universe".
      - ¶27 "interact with other intelligences in other dimensions within the universe".
      - ¶29: the energy balloon is "protection against conscious entities possessing lower energy levels", "which the
        participant might encounter in the event that he achieves an out-of-body state".
      - ¶33 "thought forms" met out of body.
      - ¶38 J "Be intellectually prepared to react to possible encounters with intelligent, non-corporal energy forms".
      - The paper does not sort them into good and bad beyond ¶29's protective framing. The good ones are his.
26. 2026-11-11 03:22 local (L), to the librarian, after E's look-and-lore menu (`handback/p-l161-look-E_2026-11-11.md`): "we
    shouldnt directly associate the gateway tapes to the player or hemi sync, it should be ambigious until the player plays the
    story out through many runs, uncovering new secrets that paint the narrative for the player, say as the runs begin, there
    will be rare encounters that progress, so say the first time the player witnesses it, it sets up in chronochological
    sequence the next encounters that drip feed the player lore, also subtle things around the proc gen, we could design real
    pieces to be imbeded into the seeds, like designed areas with meaning. The belief system territories are but different
    manifestations of the space from the player characters psyche, so there is his apartment, underground research facility,
    empty mall, empty hospital, empty highschool, perhaps empty hotel. I am even thinkin of an exceedingly rare biome that is
    some how "outside" you know how the backrooms does it, there will be a door to a liminal outside neighborhood, or a
    unnatural green looking hill, just glitched out wildnerness vs the shape and form of interiors, before we go deeper, we
    talked about too much too fast, we need to take inventory again on what we got before going deeper, as well i want to do
    research on the lore of backrooms just to learn more, 5. i like that idea of like, all the sound that occurs in the game,
    character heavy breathing from endless sprinting, the sounds of entities and the bending contorting horror of the field
    itself, it all quiets down when a good entity is near by, and it shines this resonant golden aura around the hallways, like
    an angel, and it has this beauitful harmonious cord or tone that brings you closer to love. 6. yes having a binaural beat
    play for the real player actually creates a real physiological response for the player, it will be a low vol theta usually
    blended in with the rest of the sounds. when the player gets caught, i have this imagry of a brutally scary jumpscare of
    some sort, and the players camera and soul gets sucked into this rapturing portal leading back to the player awakening in
    their bed in the real world, there is the room you spawn in can walk around and customize, closet will change the look of
    your character, PC you can go on it online and spend one of the currencies on new clothing or furniture, as well as an
    elicit site that unlocks once the player character gets past a certain point of understanding in the game progressing
    through the story, once they get past that part the site unlocks where they read and learn new abilities which then carry
    over into the dreamworld run, perhaps maybe the base skills could be made better at like, a treadmill and weight rack or
    something, and there could be a mini game where you spent your points to upgrade your speed and acceleration mobility, PC
    is where you buy new clothing and furniture, and eventually unlocks access to the ability screen where you make your
    loadout and unlock new abilities and functions, perhaps unlocking the good entities is something you buy and can upgrade,
    from the power of the good entities, to even how frequently they can spawn, it also has a higher level option that is
    locked until reached, it has to do with making the entites stronger, scaling their strength and speed to gain more
    currency or XP similar to vampire survivors or mega bonk making more enemies on purpose to get more resources. The
    easteregg then is basically just the background progression of the narrative on top of the gameplay and the runs
    progressing over time. Tapes could be bought online and are one of the ways you gain new xp and skills, idk. Also, there
    shouldnt be out of body experiences in the dreamzone since you are already technically out of your body."
27. 2026-11-11 03:30 local (L), to the librarian, answering the inventory's "proposed" list: "4. The dream intensity shouldnt be
    a slider, it should be an algo that chooses how and when to change intensity, there should always be a base dream like
    quality. the fov could be dynamic in a way, the closer something gets to you, the fov slowly heightens, also the faster you
    run and go, it should never get too fish eyey, but enough to feel speed, as well we need to add the function back to look
    behind while running, that was good. Also just spit balling, once the player body and animations are ready to start, i
    want procedural animations when touching walls or objects like the user puts their hands on the wall, or like running
    against it diagonally you can feel the wall through the animation, in an FPS, what comes to my mind is when a player walks
    close to a wall, and the animation is aware to not clip the gun into the wall, like that but with the players body. And
    the animations are procedural relative to the environment"
    - Checked: dreamzone-3 has no look-behind (no match for lookback, lookbehind or glance). The first game had it:
      `dreamzone-rt/src/main.cpp:57` (hold V, an over-the-shoulder glance, view only, the run unaffected),
      `:7230-7233` (a fast whip back and a softer return), and `:7335-7339` (about 166° of yaw).
28. 2026-11-11 03:46 local (L), to the librarian, answering the start advantage and the chasers' ceiling (A's hand-back): "10%
    sounds good for the start, but see, this is considering a fresh start, as the player has more runs in the bag, their base
    speed is modulated by their investment into their skills expanding, increasing their base top speed and acceleration and
    agility. We will have to flesh out more skills and abilities when the time comes, right now there are two different
    upgradables, you have your physical attributes such as speed, acceleration, agility, even luck and mental fortitude, which
    could help in a way, we could some how create a sanity system, similar to darkest dungeon, you start baseline sanity,
    throughout the first run, encountering the entity and being closely purseued makes insanity meter go up, which then adds
    another layer to the AI entities aggression, they fixate on fear and instability, one way to lower your insanity is to find
    the reprievals or whatever, as well as blocking line of sight, if you can continually evade it without line of sight for a
    solid chunk of time, your insanity goes down, but the longer you remain in line of sight it you become insane, when you
    become insane, the entities are in a frenzy mode, that is hard on base difficulty, but also scales exponentially with the
    base difficulty chosen and distance or time survived. I just now thought of it, it will be like mega bonk at first, there
    will be a time limit, perhaps like 10-15 min runs depending on play testing, you have to just survive, when the time runs
    out, there is a super god entity, and a malevolent God one, they both fight over your soul, but if you survive, the super
    god entity saves you and sends you back to your bed, if it consumes you, you lose all your xp for that run, and retain all
    your insanity waking up for the next run. meaning the next run starts out hard and you have to break line of sight fast to
    lower insanity, or we can flesh out other ways of managing insanity. But do you like that idea? Eventually after many runs,
    when you beat the game, it can unlock endless mode. But this could be like, different stages of dreamzone through the
    chapters of the story, as the story progresses, the seeds get more chaotic and the further biomes become closer to reach.
    Here is how the ending works though, look up the end of a vampire survivors run, this unkillable demon guy comes at you at
    mach jesus, and even if you have the max speed build you cannot outrun death, that is the idea, this malevolent god entity
    spawns in, and this is like the end of the round mode for megabonk, how long can you survive the onslaught, except its the
    malevolent god entity chasing you down, you cannot escape it, its like lighting fast next bot, it is cheating and it is
    there to devour you, even safe zones dont save you, just reroute it, since you cannot escape, what happens is when you get
    caught, the good god entity saves you last second, ripping the player out of the metaphorical jaws of the most powerful and
    horrifying manifestation of malice"
    - Checked: Vampire Survivors' Reaper. At 30:00 every normal enemy is cleared and the Reaper arrives; another arrives each
      minute after. The developer confirms players are not meant to kill it, and being killed by it is the normal end of a map
      (vampire-survivors.fandom.com/wiki/The_Reaper; primagames "How to Reach Minute 31"). Megabonk's end was not found in one
      search; his description stands.
29. 2026-11-11 03:50 local (L), to the librarian, on the second kind of upgrade: "but expanding off of hwat i said about there
    being two upgradables, the second, is the ability loadout once its unlocked and the character knows of gateway and learns
    how to gain those abilities, one is that golden aura shield, an other is maybe like super sprint movement or like
    something crazy like dream flight flying through the hallways like invincible or homelander, maybe no clipping but that
    might be too op, but it could be cool, a very rare powerup that lets you no clip through the map, outside of it, is this
    beautifully dark and ominous void that is the intermediate zone between reality and the source, and can only be seen when
    you enter the state, the players wouldnt know there is anything on the other side of the walls until they noclip, showing
    whats beyond the walls, and it is an unknowable cosmic horror that is some how beauitful."
30. 2026-11-11 03:55 local (L), to the librarian, answering how a run ends: "I guess the regular entities catch you you lose it
    all, when you die, it indirectly shows the player, that it was always the evil god entity chasing you but playing with its
    food, then it consumes a part of you, what makes it even scarier is you wake up feeling normal not knowing which part was
    taken, it isnt said like that directly, but its what I think when imaging the idea. When you beat the level, its done
    messing around and it is coming for you, this is when the god like good entity steps in to help you since the evil force
    that usually remains in equillibrium over stepped its bounds, letting the good entity mirror its symmetry"
    - Settles the librarian's question as reading (a). Caught by regular entities before the timer: you lose it all; the death
      shows, indirectly, that it was always the malevolent god playing with its food; a part of you is consumed; you wake feeling
      normal, not knowing which part. Reach the timer: it stops playing and comes for you; the good entity steps in, because the
      evil force broke the equilibrium, and mirrors its symmetry.
31. 2026-11-11 04:05 local (L), to the librarian, on invasions of the waking room: "i had this brilliant idea, if you are max
    insanity, there is a small chance, that your safe room in waking state is invaded while you are doing things such as on PC
    or excercising mini game, there is like a scary and unique variation of invasions that jump scare the player if they arent
    paying attention, the cool part, if the player is wary or paranoid, say from it happening once before, there could be
    subtle cues you could pick up on to know its coming, depending on how they manifest will be different cues, one that comes
    to mind, if you look outside the window, sometimes there will be a figure that isnt usually there, if the player doesnt see
    it it slowly finds its way into the room, if its behind the player it will eventually grab them and jump scare the fuck
    outta them, but if they turn around or see them first it engages it there, then it forces the next run. But yeah, so the
    cue would be, if the player looked out the window, which there could be a reason to, looking out the window could lower
    insanity, but also, the longer time you spend in your room without sleeping or dreaming the next run, your insanity goes up
    by itself anyway over like a long period of time say longer than 15 mins. This increases the chances of being invaded. But
    yes anyway like I was saying, if the one invasion is triggered where the being spawns outside further away like behind
    bushes or behind a parked car, or on the roof across the street hiding behind it etc, the player can notice it and see it,
    knowing that its coming, it cant stop it, but maybe they start the dream themselves before, if they get invaded and thrown
    into a dream they start with maxed out insanity too. So it is good to engage the run yourself if you can. We can flesh out
    other invasion ideas, say another one, it could happen like, electricity flickering, or like an entity appearing on the
    screen of the pc in the room in game that trolls them into a fucking brutal scare, or someone knocking on the door of the
    real room, perhaps even the player mother can be a character, never seen, but can knock and check up on the player every
    now and then random event, which then the player has dialogue options like say fallout new vegas different branching
    responses for the interaction that also build off of each other for the next interaction branching seriously. Depending
    the mom can offer relief from insanity or even trigger it more, even perhaps mimicking eventually players mom when it is
    an entity invading, you like these ideas?"
32. 2026-11-11 ~04:17 local (L), to the librarian. The message arrived ending mid-sentence, with a pane's ring pasted after it.
    His words as they arrived: "1. I am thinking, there should be a cap how much looking out the window decreases sanity, it would
    be too op to just look out the window every time u fail or accumulate too much stress, perhaps stress is better than
    insanity, fuck it, we do darkest dungeon mechanic, the virtuous and afflicted, in dd there is a 75% chance the player goes
    insane on stress full, which leaves a 25% chance to become virtious in the face of despair, it gives me goosebumps thinking
    of the runs where pixels on a screen convey more emotional dissolve than real characters in a real story, the emergence of
    narratives with the characters you have in darkest dungeon needs to be studied, but it gives me goosebumps for a character
    to persevere under grave odds, which would make a similar mechanic for this game insane, so upon going insane in the dream,
    there is that 25% chance that instead of triggering the frenzy, you reset your full stress bar and become resonant, its
    like star in mario, you become like cheating levels fast and can feel the resonant aura of the signal of truth and love,
    but it doesnt last forever, perhaps like a solid 15-30 seconds, and then perhaps there could be an ability that modulates
    the odds or strength of this, some players might try to spec into becoming stressed just to get the powerup to gain a
    serious advantage but it is risky, perhaps since we are going darkest dungeon route, there could be dreamzones version of
    trickets, two you can equip that offer passive buffs, common, uncommon, rare, epic, resonant tiers, with increasing rarity
    to drop, you can get the drops from good entities, or perhaps some variant of the chest archetype that could sometimes
    spawn in the reprieve areas, which give the player a solid second or two to look at it and click it, it will take the
    dopamine fuelled design of megabonk, but skinned with the theme of mystical occult/scientific mystical angle, you know? So
    what you get from the chest is usually the run dependent abilities that are unlocked, at first without buying the
    abilities, wait, if you are confused, just look up the menu structure of megabonk and how they do resources and unlocks, it
    will be almost the same just skinned differently, but anyway you start with like"
    - Checked (search, guides; thresholds vary by source and patch). In Megabonk:
      - unlocks are permanent;
      - Silver is the meta currency, from quests, shrines and pots;
      - the Shop is locked at first and opens after enough quests;
      - 200+ quests unlock characters, weapons, tomes, items and skins;
      - items mostly come from chests; 35 of 77 are available by default, and the rest unlock through quests, then cost Silver
        in the Unlocks menu;
      - quest milestones open extra weapon and tome slots (about 25 and 35 quests), Skip, Banish and Toggler (Toggler after
        about 40 unlocks).
      - Sources: progameguides "How to Unlock All Items", destructoid "All shop items", megabonk.wiki/wiki/Shop.
33. 2026-11-11 04:19 local (L), to the librarian, finishing item 32: "BUT ANYWAY you start with like, 6 basic abilties, 4 out of
    the six will be physical based abilities that the player does with their bodies such as being more athletic, and the other
    two abilities will be the base psychic ones the player starts with, not decided yet, so the 4 abiltiies physical can
    synergize to form 2 ultimate abilties, and thw two base psychic abiltiies can synergize to form one ultimate, then as the
    game progresses, the player can train to unlock more new physical abilities, and then that illicit website trains the
    player how to utilize new psychic abilties in the dreamzone runs, get it? LOOK up now how megabonk does their abiltiies and
    synergies to understand"
    - Checked (search, guides):
      - Megabonk's run has **weapons**, which level up and scale with stats, and **tomes**, which are global stat boosts (one
        stat each, about 23) and lift every weapon at once. Weapons are short-term power; tomes are long-term scaling.
      - Its synergies are stat interactions, not fusions. Examples: Damage and Precision tomes with offensive tomes; Quantity
        with projectile weapons; attack speed with on-hit items.
      - The "Holy Trinity" is the **Curse Tome** (more enemies) plus XP for faster levels. That is his item 26's "make the
        entities stronger for more XP".
      - Named fusions were not confirmed for Megabonk. **The closer precedent for "two abilities fuse into an ultimate" is
        Vampire Survivors' evolutions** (a weapon at max level plus a specific passive, opened from a chest after 10 min) and
        its unions. That is from the librarian's knowledge; not searched this turn.
      - Sources: gfinityesports "Weapon Scaling Explained", gurugamer "complete weapon and tome upgrades guide",
        rogueranker "Megabonk tips", megabonk.wiki tome pages.
34. 2026-11-11 04:25 local (L), to the librarian: "hmmmmmmmmm, still thinking, so the chests are what give abilities for that run
    and reset, but what about, there are rare good entity encounters that drop those trinkets, and then the trickets buff scales
    for rarity, not jsut the trait repeating getting more powerful for rarity, i mean maybe it could, but what i had in mind are
    the more rare trickets having powerful buffs, not just like, resonant sprint charm, +25 sprint top speed or something, but
    exotic and powerful buffs you know? also you missed a crucial part of megabonk, you can only have so many tombs and weapons.
    But anyway, you could also get drops from the good entity at the end of runs, just like how in darkest dungeon you can get
    trickets at the end of raids, but can also loot them during the raid, the good entities can sometimes spawn in directly
    coming to you, freezing the entities in the world to show you the screen to press accept trinket. If you already have two
    equipped it goes into a storage, when the player wakes up with a new trinket, there is a waking up animation of the player
    in bed, first person, taking the covers off and realizing they have the trinket in their hand IRL."
    - **His catch, owned:** the librarian's item-33 table left out Megabonk's slot limits. Weapons and tomes are capped by
      slots, and extra slots open at quest milestones. That cap is what forces every choice in a run.
35. 2026-11-11 04:48 local (L), to the librarian, after a run on brutal, in the Dreamzone 2 play folder (the shortcuts were not
    switched yet): "i was doing a brutal run, damnit something cut me off, like intelligent interceptor, the main entity couldnt
    catch me, can you see the telemtry from my run?"
    - Checked: the game writes no run record. The only trace is `game\config\best_times.txt`: brutal = 222.28 s, a new best,
      written 04:47:47. What caught him is not on disk.
36. 04:50: "also add the flashlight rn for me to test, the original one, as well, fresh spawn you will have no flashlight, i do
    like the current lights, but i think there should be a little more lights on average, too dark, but that doesnt mean there
    cant be darker areas or variation of less lighting, but the first biome and on average more places should be lit."
    - Done at once: `flashlight = 1` in the play folder's `game\config\world.txt` (it was 0). A test setting, not the design.
37. 04:5x: "the flashlight can be an ability you unlock, then it could be specced with some sort of psychic power, combining to
    form an op flashlight that when shined upon entities, it slows them down or repels them for a short time"
38. 04:51, finishing item 37: "but it frenzies all other entities that it isnt being pointed at"
39. 04:53, the balance: "i think the balancing is like this, the flashlight unlocks pretty early on, but the ability it
    synergizes with takes time to get, but also, the whole point is to stop the interceptor or future archetypes that spawn
    infront of you, it repels them creating a path ahead while they swarm and frenzy behind"
40. 04:54: "but remember you do not spawn with it, you find it in the chests or what ever the chests become, it is unlocked early
    you just need to get it, also, is there a better thing that a generic chest for our theme you think?"
    - Design: the flashlight is unlocked early, never carried at spawn; it is found in a run's containers. The play setting
      `flashlight = 1` stands only while no container exists to find it in (C moves it to a local override in L162).
41. 05:01, currencies, attributes and the opening: "but for the chests, they also drop cash or whatever the currency will be for
    buying cosmetics and using for abilities, silver equilivent will be for cosmetics and furniture etc, then the more premium
    currency will be for abilities and leveling up persistent stats, or what do you think, the gold could be for premium
    cosmetics and abilities, and upgrading the good entities, and the silver will be for cheaper cosmetics and physical
    attribute? Cuz remember, there is the ability progression on the PC, but then there is the physical build progression,
    There could be, Speed, which is combo of top speed and acceleration, then agility, it allows you to climb faster, and more
    nimble on your feet fighting inertia and momentum to juke entities, luck, which could be a blanket term that modulates
    every aspect of the game, from reprieval spawns to the chests in them etc. Also, when you open a chest, I want those like
    spinning animations sucking out your dopamine, you know, you open the chest, you get one thing wow, but then one time you
    open it, its like, BOOM, BOOOM, BOOOOM, BOOOOOOOOM ULTRA CHEST DOPAMINE LESSSGO! There should be that RNG aspect exploiting
    our dopamine lmfao"
42. 05:04, mental fortitude: "mental fortitude could be like, ancient meditation mini game that is some how fun lol, but yes it
    not only mitigates stress, but lowers the peak of the frenzy, not by enough to stop it, but it makes it more tolerable when
    it happens, since your mental fortitude stops them from frenzying harder since even though the player is stressed, they can
    deal with it better without the energy leaking out, like sharks and blood in water"
43. 05:2x, the horror: "i feel like i have been forgetting to imbed in more horror themes, this should be a horror game, besides
    the fun addrealine of running, there should be real horror tropes and context, not just mindless but effective jumpscares,
    but truly terrifying content that is relavent, what I am getting at is the inherent horror of existence at all, there is
    this quote that comes to mind, take the shape of this: biology is just a temporary phase of geometry. Watch as the flesh
    calcifies into cold iridescent iron. We are crawling through the veins of a dying machine. the structural transition is
    complete, the incubation void is open."
    - The quote's author is not known to the librarian; it was not searched. It is kept as his reference for the shape, not
      attributed.
44. 05:27, finishing item 43's reference: "didnt finish, we stare into the infinite, searching for a creator, only to discover
    that the machinery has been running on its own. Repeating a purpose no one remembers."
45. 05:35: "But see this mirrors my real life struggle to believe and have faith in something good. Which is the whole point of
    carrying the virtous emotion throughout. But I do want the dark existential dread to carry the horror theme, we could take
    some generic but good horror cliches that run adjacent to it all too for the normie crowd"
46. 05:39, the story: "lets take some of those best ideas, and tie it into a slightly modified gateway hemi sync horror trip
    story, perhaps the character has gruseome trauma from their past that then isnt directly said, perhaps the characters father
    was murdered, and it only leaves ancedotes that it occured, a picture of his father on the desk, subtle dialogue with mom
    early, currated pieces of the environment made to echo the event in a non direct way, it reminds me of this game called
    Nevermind, you are a future therapist who delves into the dreams of client to figure out their supressed trauma, but instead
    the narrative plays out with everything else along side the main story of the dreamzone"
47. 05:42: "yesss trinkets could be lore items, not just some mystical object, but something with relevance, example, Dads watch,
    could be  resonant item, even though dad is gone, he trace lives on, it could turn out that the god entity was the embodied
    for the love he had for his father, or it could turn out to be him in a way."
48. 05:50. The message arrived cut off mid-sentence, with a pane's ring pasted after it: "lets flesh out the trinkets since i have
    ideas, so there will be different collections of different genres of trinkets, there are the family ones that range in
    rarity, personal trinkets that align with the player character themselves, things that give depth to the main character
    and their persona. Then there will be Monroe institute collection of trinkets, which are those mystical trinkets that follow
    the theme of the occult and perhaps isac bentov scientific angle fusion. Like objects that have occult connotations but
    fused with a scientific outlook, these will be the rare and more resonant trinkets with power acquired through drops, or
    even the site for expensive prices that are locked at first, but then open up every run random selection, you can even
    invest upgrades into it, like say the hamlet in darkest dungeon, the PC can be upgraded like the forge and training room,
    same for the exercise equipment, I had an idea, what if the PC is just for cosmetics and rare trinkets on that site, but
    then, the third thing to upgrade in the room/hamlet would be, the abilties themselves, how it would work, there is a chair
    or beanbag in the room, you sit in it and this is where you"
49. 05:55, finishing item 48 (it arrived cut off again, at "yous", with a pane's ring pasted after it): "THIS IS WHERE you upgrade
    your abiltiies and acquire new ones through the out of body state, think of it like, some ether world like it turns to
    skyrim in the stars or something looking at the abilities, or think of it like, the player sits down, and depending on which
    focus level they are one, is what dictates which abilties unlock and can even be upgraded themselves to be more potent, so
    the setup is a chair the player sits in, meditates with hemi sync, forcing the player into an out of body state, reminds me
    of like viktor in arcane after he is in what looks like to be the cosmic realm or some shit lol. But its just a stable area
    of dreamzone made by the player, it is more of a menu than a section of world, it goes to third person after you sit in the
    chair, and the rest of the room dissolves away, showing the ground where the beanbag chair is and the player, but the rest
    of the room dissolved away into an infinite void of colour and darkness at the same time. You get what I mean right, the
    player sits in the chair, causing this like, darksouls type menu to open transparent that shows the background turn to like
    this cosmic realm, when the player is done, the room fades back like how it faded away, and your soul comes back to your
    body third person to first, or rather third person, the camera first rises out of the body, and moves upward as the room
    dissolves showing the cosmic void, when tweaking loadout is done, the camera lowers back, showing the body of the player and
    fades back into their head as the room comes back. yous"
    - Read against items 26 and 29: the chair is reached only after the character knows of Gateway (item 29), so Hemi-Sync and
      Focus levels appear here as the story's late reveal, not at the start. That fits item 26's "ambiguous at first".
50. 05:58: "the meditating can become apart of the ability tweaking process, when you go into tweak it, it gives like a baserate
    reduction of stress, which can also be upgraded to be more potent"
51. 06:00: "you can also buy online, new design beanbag chairs lol, some funky cool psychedelic designs, as well i had this idea
    too, for base cosmetics to have a slight effect too, nothing too crazy, but perhaps even clothing could have rarity and
    decent buffs for the last two rarities"
52. 06:07, correcting item 51's reading: "common and the rest can have buffs, but its like slight buff like runes or masteries in
    league vs the trinkets are strong buffs"
53. 06:28, answering the librarian's gaps 1 (XP) and 2 (the starting abilities): "1. XP could scale from different factors,
    distance, i was going to say time, but if you dont survive you dont accumulate anything, so not time, distance, and perhaps
    like a multiplier past certain distances and difficulties, being in frenzy mode brings more xp per second, as well
    proximity to entities it scales with a multiplier that has a UI element that works being minimalistic horror sci fi
    existential dread themed. Using the reprieval zones gives a solid chunk, evading the smaller entities gives XP, opening the
    special "chests" give xp bonus too. Perhaps there can be base movement mechanics that are just apart of the game no skills
    required, things like connecting together movements in a skill chain or like sprinting in a straight line for extended time
    gives points for letting it catch up, etc, ideas like that we can brain storm solely as its own thing to figure out more
    fleshed out ways to gain XP. 2. or idk if we should have tons of base physical abilities or use the megabonk limited slots to
    spec a character who is all movement, or all psychic or mix of both, either way you can points from doing things you specced
    your build into, make sense in a way? Also tons of bonus XP for surviving a longer time after the round is over evading the
    malicious god"
54. 06:31, the safe zones: "i have an idea for the safe zones, over like 10 seconds they errode becoming hell red and screaming
    effects"
    - Against the built game: today a reprieve holds 20 s after entry, then the hunter walks in. That was the Third Place's
      default, on a dial (items "Two defaults this seat set without him", above). His erosion would make that clock visible and
      audible, and shorter.
55. 06:31, continuing item 54: "eventually stop being safezones altogether once it errodes into regular space in the dream"
56. 06:32, correcting the librarian's reading of item 54: "but it isnt just staying in it for 10 seconds, but upon 10 seconds of
    having entered it"
    - So the clock starts on first entry and keeps running whether he stays or leaves. Ten seconds after he first steps in, the
      zone has eroded (and per item 55 it is ordinary dream space from then on). Stepping out does not pause it.
57. 06:39, on gap 1 (XP by build) and movement: "1. Say specific example, if you spec into psychic build, you can still derive XP
    from doing physical related things, such as parkour like movement or chaining together jumps and slides and jukes, there
    could be an ability that gives you a super slide effect, or a dive into a roll that moves with the head to have this fun
    finessable movement, say like diving over top of the shorter enemies like summersault type shit. I think we need to do more
    research into parkour running type games like mirrors edge, or other types of games where you run from something, the best
    example is GMOD nexbot and there was this parkour swepe mod that worked decent for movement, also on the fence if there
    should be a bhop feature that then lets you chain everything all movement, but this would be like end game perk that is for
    endless, it helps you gain so much speed to outrun even the evil god and the worst frenzies, well not outrun, but survive,
    this would mean that Bhopping mechanic should be in the base game, but its very hard to accumulate momentum until you get
    the perk. You know what I mean? This means we have to allow for it with the movement system, sort of mimicking the ancient
    movement system of games of old source engine type shit"
58. 06:45, correcting the librarian's reading of item 57 (build-specced XP) and adding psychic abilities: "its not that if you
    spec into it it pays more, but it allows you to gain more points from having better movement abilities, say, when you slide
    you gain points, but then you have a trinket or perk that increases slide speed or duration, that is the perfect example of
    how specing more into physical can make you acquire more points for it, bc it makes you do it more, not that it gives extra
    points. Same for psychic abilities when they are more fleshed out, but a little different, if you have them you can do
    them, but if you dont you cannot get points from abilities you cannot use, but there could be an ability that distracts or
    tricks the entities, the aura ability might be able to be learnt, but it is more fleeting than the good god giving it to
    you, since it is your own lesser version of it, maybe it can be upgraded to god levels. there is that flashlight fusion,
    holding it on entities gives points. There could be a psychic ability that in a way augments physical stats temporarily
    for people who go full psychic build, say a "spell" or something that increases max speed by a ton for a little while, or
    anything of that nature, a spell that temporarily makes the entities lose your location, it is different than the aura,
    the aura they still know where you are, but cannot touch you, the shroud gives you even more time, but it is interesting to
    balance cuz now the shroud is better than the aura, perhaps there has to be a downside to the shroud, it gives you stress,
    when you use it, it makes the dreamzone become even more scary and horrifying. making the player scared and the characters
    stress go up substantially."
59. 06:50, virtues and afflictions: "before i answer more questions going to what rises to the surface first, just like darkest
    dungeon, virtuous doesnt just give u a buff, but after it resets your stress, it also gives you a persistent buff for the
    rest of the raid or until you lose your sanity again, look up the different darkest dungeon virtues and afflictions, we
    could make our own good versions and bad that follow our theme, so the resonant and frenzy isnt just two things but could
    be a plethora of different effects on top of the frenzy, for an example tho, a good virtue can give the rest of the run a
    positive buff or until they become insane again and hit frenzy without resonant, so this means you gain a buff from the
    resonant for the rest of the run or until you lose your sanity again."
    - Checked (darkestdungeon.wiki.gg/wiki/Virtue):
      - The virtues are Stalwart, Courageous, Focused, Powerful and Vigorous. All give +25% resists. Each has its own stats
        and a 25% act-out.
      - Triggering one sets stress to 45. The virtue lasts until the hamlet, or until 200 stress, where it is lost and stress
        drops to 0 (no heart attack).
      - Base chance 25%; trinkets and quirks add up to +45% (75% total); the range is 1–95%.
    - Afflictions, from the librarian's memory, not on that page: Abusive, Fearful, Hopeless, Irrational, Masochistic,
      Paranoid, Selfish. An affliction is cured in the dungeon by bringing stress to 0, and it does not clear on leaving.
60. 06:55, the top virtue: "I want the best virtue to be simple Resonant, it is ultra rare out of the bunch, so base you need to
    hit the 25% first, then it will be like 1-3% trigger on top of that, it gives all buffs for the rest of the run and your
    stress cannot increase, this is the dragon players will chase. Even 1-3% might be lots like 1-2 maybe"
    - So the families get renamed. The 25% good roll gives one of the virtues. Within it, a further roll of about 1–2% gives
      **Resonant** itself: every virtue's buff for the rest of the run, and stress can no longer rise. The rest of the good roll
      is the lesser virtues. The odds of Resonant per full-stress event are 0.25 × 0.01–0.02 = 0.25–0.5%.
61. 07:11, about Resonant. It arrived split around a pane's pasted ring and ended cut off; joined here as written: "but i will say,
    the golden star effect only lasts say like a solid 2-3 mins, during this time, frenzy also occurs with the resonant too,
    since the evil entity is trying to rebel back with all its power similar to the end, but does not show itself yet, but it
    is futile while it lasts because the signal then cannot be destroyed during, you get what I mean right? Like the evil god is
    pissed at the fact we got it and throws everything at u no matter the point in the game, but it cannot get you, then when it
    runs out, the passive buffs and no stress remai[n], but the star buff goes away, we should call it something else to avoid
    the mario comparison, haha but its the best one, its like super sayian or like the energy ive had during those intense
    contact"
62. 07:20, naming and the question under it: "i think it should just be called recognition, but idk, what I am balancing right now
    is this, if it happens once and is transient, why? Why cant the player constantly embody that state if it can be achieved at
    all?"
63. 07:30, on the render: "okay sounds good, one small complaint about the lighting as it was, not the entities themselves, but
    how the raytraces lighting is drawn, sometimes it is too grainy or there are shimmering after images from the player model
    cutting through it in a funky way, you know? Like there is too much noise by the raytraced lighting"
64. 07:37: "just did a solid run on brutal, u see the data"
    - Read from `game/runs/run-20261111-133514.txt`, and `dz-world --replay-run last --window 20` (exit 0: it replayed to both
      fingerprints):
      - brutal, seed 1, build 39e03db: **caught by the pack (#12) at 120.15 s**.
      - The hunter held 9–15 m behind him for the whole last 20 s and never closed.
      - Pack #12 had been wandering ("investigate") 30–47 m to his left. By 118.5 s it was ahead of him. At 119.35 s it heard him
        sprinting at 12 m and turned to pursue. He met it head-on 0.8 s later.
      - The sprinter (#10) was closing from 41 m at 13.8 m/s.
    - So, as in item 35, he was **cut off from the front**, not run down. This is the case item 39's flashlight is for (clear the
      path ahead).
65. 07:39, correcting the librarian's "sprinting is loud, so stealthier movement could matter": "but no stealth isnt a thing, the main
    hunter always knows where you are, and if you stop running it will catch you"
    - So hearing and sight belong to the lesser entities only (the pack heard him at 12 m in item 64). The hunter is omniscient.
      There is no stealth build; there is only running. This matches item 58's shroud, which costs heavy stress.
66. 2026-11-11 08:43 (on D), settling the design map's contradiction 28 against 30, after the librarian put it to him as "can
    you be consumed at the very end": "you dont get it. if they player completes that particular run by surviving the timer, it
    goes into overtime mode where the evil god then comes to you himself, the comparison is like vampire survivors ending, its
    like this unbeatable entity that you cannot run from, it will catch you, but you can try your best to outrun it for as long
    as you can, when it catches you, right before the resonant god acts and saves you. So you can die and lose all your points
    by losing before the timer, the overtime mode is meant to be lost, but good god saves you and sends you back successfully"
    - So: caught before the timer, the run is lost with all its points. Survive the timer and overtime starts; the evil god
      always catches you, the good god always saves you, and the run counts as a success with its points kept (plus item
      53's overtime bonus for every second you last). Being consumed happens only before the timer.
67. 2026-11-11 08:45 (on D), settling the design map's currency contradiction (item 41, (a) against (b)): "Silver could just be
    cash, and gold could be "energy" or something like that, cash you spend on the PC for most things, energy for meditation
    leveling up, and even on the illicit site, it will show a mix of cash, and energy, as if you are trading it for one of the
    trinkets to another human who knows the importance of it and the energy you give them."
    - So two currencies: **cash** (spent at the PC on most things) and **energy** (spent in the meditation chair to level up).
      The site's rare trinkets cost a mix of both, read as a trade with another person who knows what the trinket is worth.
      Neither (a) nor (b) as written: it is a third version.
68. 2026-11-11 08:55 (on D), the room as a builder, and characters with a global level: "even leveling up the PC and home gym,
    can spend money to make the PC better and spiffier same with the gym, its like, subtle pc part builder game mixed in, new
    monitors and peripherals. This will be what makes people spend more time in the room, which could cause invasions. Can
    customize the type of home gym and equipment you have for the small area in your room, can customize anything if we can
    think of it, could be a good idea, future runs, you can even unlock bigger and better rooms, different windows looking out
    to different places, as well and this is the biggest idea for more replayability, different narratives driven by different
    characters that interface with the dreamzone, the players can play them however they want spec wise, but they will have a
    unique backstory and narrative to unravel, and all of them connect together in a gloriously beauitful way. And perhaps each
    one could have their own unique buff as well that could synergize with a build. But the most important part to get right
    is how the narratives intertwine, you start as the kid who lost his father, eventually, you unlock new characters that you
    can play with new set and settings, and each character can act as its own save, so like quarter of the way through the
    first characters run and story narrative, it unlocks the ability to play as someone else before you finish the first
    character even, it doesnt force you to play, but could intice curious players to start a new run with the new character
    before finishing the first, which could have a different flavor of how the narrative unfolds with each character slowly
    learning what is going on and how everything is all connected together, say for an example, the story of the kid may only
    teach you so much about the global setting of the world and dreamzone, and all of the lore surrounding it, but say in
    another characters story arch and narrative, it discloses a bunch of things that make things from before make sense in a
    way. Not that they all lead into each other, but its more of a chaotic intertwining narrative that could be played any way
    besides the level cap of when new characters unlock, so say, there is your GLOBAL level, that is independent than your
    characters level in the run, this carries your overall XP and can be needed to unlock cool things from simply playing more
    u know?? Instead of there being things that can only be unlocked during the run itself, there will be things, more op
    things, locked behind a global level cap. Which can give items, abilities, better trinkets or upgrades or cosmetics and new
    characters to unravel the story with, with unique traits and playstyle."
    - The room: the PC and the home gym are upgraded with cash, part by part (monitors, peripherals; the gym's kind and its
      equipment), and anything else that can be customised. Time spent there is what raises the chance of an invasion (item
      31). Later: bigger rooms, and windows that look out on different places.
    - Characters: several, each with its own backstory, story, save and a unique buff that can synergise with a build; any
      build is open to any of them. You start as the kid who lost his father (item 46). About a quarter of the way into one
      character's story, the next unlocks, without forcing a switch. The stories do not run in sequence: each discloses what
      makes another's make sense, "a chaotic intertwining narrative".
    - Two levels: the character's level inside a run, and a GLOBAL level carrying all XP across runs and characters. The
      strongest unlocks (items, abilities, better trinkets, upgrades, cosmetics, new characters) sit behind global level caps.
    - His own weighting: "the most important part to get right is how the narratives intertwine".
69. 2026-11-11 08:59 (on D), answering the librarian's two questions from item 68 (global XP after a lost run; where energy
    comes from): "1. you could gain global XP for losing but it would be crumbs compared to winning. 2. Energy comes from
    succesful escapes and "chests". The one part I cant figure out bc it doesnt make sense and could easily just be ignored as a
    gameplay mechanic, but how tf does the character get money from doing tricks in a dream xDDdD"
    - A run lost before the timer still adds a little to the global level ("crumbs"); a won run adds the real amount.
    - Energy comes from successful escapes (runs that survive the timer) and from the containers.
    - Open, his: why a dream pays cash. He allows it may simply be a game mechanic left unexplained.
70. 2026-11-11 09:02 (on D), the first cheque and the period, after the librarian offered "someone pays for what you see in
    there" as the reason a dream pays cash: "So since everyone starts with the kid, who doesnt know shit all, what if there is
    like a first time tutorial that goes along for the first playthrough of him, After the first successful run, a random
    cheque comes under your door, and it is in the value of the money you made during the run, at first the character is like ?
    bc it doesnt say why he got it, it just has his name on it, and something called The Monroe Institute. I am just thinking,
    what time period would we like? I had this idea just now, like early mid 2000s aesthetic, especially with the PC builder"
    - A first-time tutorial runs alongside the kid's first playthrough.
    - After his first successful run, a cheque comes under the door for the run's cash, with his name and the payer's name on
      it and no reason given. The kid does not know why. (The payer is the cash's in-world source.)
    - The period: early to mid 2000s, proposed by him, "especially with the PC builder". Not yet decided.
71. 2026-11-11 09:09 (on D), a second character, the writer: "another idea i had for another characters archetype, they start
    as someone already established in the trade, if it could be called such a thing, has a decent highrise loft, outlooking over
    a city, established abundence of cash, but no energy, they are searching for it, they have only heard of the gateway tapes
    and an other world, but cannot access it like the kid could naturally, so it is the opposite, the player can learn lots
    about what is supposedly going on through that characters PC and what that characters knows in the very beginning, it still
    should have mystery and not throw all the cards on the table, but the guy knows way more than the kid did starting out. The
    catch is this, he is a failing writer, and his savings are drying up fast, the characters chooses to not spend his savings
    on any of the game features so he starts from square one, contacing monroe institute since he wants to train to access the
    dreamzone, he then starts his runs by sitting down, and practicing the gateway tapes, instead of sleeping like how the kid
    accessed it naturally, and eventually when he hones his senses and creates his own bubble to upgrade, the guy at first needs
    the hemi sync to access dreamzone at all, over time, the chair he sits in to meditate becomes the upgrade chair, and he
    simply goes to sleep to access it further throughout his run, you get the general shape? I could think and expand mor"
    - The writer is the kid's opposite: cash and no energy (the kid: access and no cash); he reaches the dreamzone by technique
      (sitting with the tapes), the kid by sleep; he starts knowing much more, and his PC is where the player learns it, with
      mystery kept.
    - He starts from square one by his own choice: his savings stay unspent on the game's features, and they are running out.
    - His arc: he contacts the institute to train; at first he needs the tapes to get in at all; as he hones it and makes his
      own "bubble", his meditation chair becomes the upgrade chair (item 49), and later he enters simply by sleeping.
    - He said he could expand it further; not final.
72. 2026-11-11 09:12 (on D), the order of work: "hmmm this is good, but i think we should fully flesh out the kids full arc
    before doing others, but it was good to come up with the archetypes without fully fleshing it out, there will prob be 4,
    maybe two more DLC characters lol. But first i think, we need to get the game feeling good right? Worry about the narrative
    after"
    - Order: the game's feel first; then the kid's full arc; the other characters after that. About four characters, perhaps
      two more as DLC. Items 68-71's characters are archetypes, kept unfleshed on purpose.
73. 2026-11-11 10:05 (on D), his first play of Dreamzone 3 on D: "damnit i fell into a void, fuck it is pretty fun already, i
    like the safe zones, it just needs more refined animations and quality of style, idk where to even start"
    - Checked by the librarian against the code (dreamzone-3 39e03db): everything seen is boxes. The body is posed boxes
      (`game/body.h:23`, `game/body_figure`), the chasers are placeholders (`docs/ARCHITECTURE.md`, M4), and no file in the repo
      loads a model or a skinned mesh (no glTF, no bones outside the body's two-bone arm). So refined animation and style
      first need a way to bring real art into the engine.
74. 2026-11-11 10:07 (on D), the look's references and biomes per character, answering the librarian's "what should it look
    like?": "yes look up like liminal spaces creepy pasta type internet culture, or those nostalgia bait type content, but also
    it made me realize, if we are making separate characters, there has to be different themes that go along with their psyche
    in the proc gen you know? The kid has his archetypes that manifest, every other character could have their own style of
    biomes that the dreamzone manifests. But this comes later, just spit balling ideas when I get them"
    - The look's reference: liminal-space and creepypasta internet culture, and nostalgia-bait content. To be researched.
    - Later, not now: each character's psyche shapes its own biome set in the generator (item 26 made the biomes the kid's
      psyche; this extends it to every character).
75. 2026-11-11 10:17 (on D), on the look page (artifact KMm3AnmcRkhzDFo5GTozJ2, D652): "i like the ideas in the artifact except
    the idea of it coming from a camera, not a slender rip off, it is a dream experience, if anything, remember the idea for us
    to study psychonaut wiki for psychedelic effects to replicate for that fear aspect rather than static of a video or picture.
    Not sure I l;ike any of the examples of the pictures, the style should be pseudo photoreal, like stylized hyperrealism
    through rendering tricks, think of like, the game nightrunners"
    - Rejected: any camera, photo or tape look (D652's A "found photo" and B "tape"). It is a dream experienced, not footage.
    - The fear comes from PsychonautWiki's visual effects (item 23), not from video static. That study exists:
      `handback/p-l161-look-E_2026-11-11.md` (effect table, one "dream intensity" dial).
    - The target: pseudo-photoreal, stylized hyperrealism made by rendering tricks. His reference: the game Nightrunners.
    - Kept from the page: the light, surfaces, composition and sound traits; none of the three example pictures.
76. 2026-11-11 10:18 (on D), confirming what item 75 keeps from the look page: "but the lighing and surfaces, composition and
    sound seem chill"
    - Kept as the base: the page's light (cool fluorescent and warm tungsten per biome, flat overhead, a dead or flickering
      tube), surfaces (carpet, drop ceilings, wallpaper, pool tile, terrazzo, lockers; light wear), composition (emptiness,
      repetition, wrong scale, thresholds; the signs of missing people) and sound (ballast hum, HVAC, room reverb, distant muzak).
77. 2026-11-11 10:18 (on D), the audio: "there should defintelly be an indepth audio system that works like ray traced audio or
    whatever, look into the work of bodycam and their sound design"
    - Checked by the librarian (dreamzone-3 39e03db, `audio/audio.h:23,78`): today a source with no line of sight is
      low-passed at 800 Hz and 9 dB quieter; that is the whole of the acoustics. No reverb, reflection or propagation.
    - His reference: the game Bodycam's sound design. To be researched (D654).
78. 2026-11-11 10:22 (on D), which game item 75 meant: "night runners racing game i meant btw"
    - NIGHT-RUNNERS Prologue (PLANET JEM, 2024, Steam 2707900), as E inferred in D653. Its look as reviewers describe it: a
      simple world with detailed hero objects, people never sharp, thick air and short draw distance, detail softening with
      speed. Its CRT filter is the one part not taken (item 75).
79. 2026-11-11 10:23 (on D), faces: "i almost want there to be a face for each character, something detailed and distinct for
    the art style, nothing crazy since it wont focus on the playable characters face often or barely at all beyond maybe the
    character pick screen, rare instances of where the camera might flip around idk"
    - Each playable character gets a detailed, distinct face in the art style; seen rarely (the pick screen, a camera turned
      round). Read with the look (items 75, 78): the playable characters are the detailed "hero" objects; the entities stay
      the things never seen sharp.
    - Where a face would show, by earlier items: the chair's third-person out-of-body camera (49), waking in bed (34), the
      father's photo on the desk (46). Needs the model path (73).
80. 2026-11-11 10:28 (on D), after the librarian said "room map" for the generator's layout: "remove map, you shouldnt have or
    need one, didnt ask for it"
    - What exists (dreamzone-3 39e03db): M toggles `debug_map`, a view of the walk graph of the player's storey
      (`game/world/world_app.cpp:264,284`; `world_settings.h:51`), with chasers' routes when `debug_chasers` is on. It is listed
      in HANDOFF.md's controls as "M map".
    - His ruling: the player has no map. The M key goes. (The librarian's reading: the walk graph itself stays, since the
      chasers, the generator and the planned audio use it; only the player-facing view goes.)
81. 2026-11-11 10:54 (on D), sprint speed: "I almost want the top speed of sprint to be a little faster, peraps tapering off at
    10ms when holding it down for longer and taking good lines, then upgrading it from there makes you a speed demon, but we
    have to make sure that we also slightly make all mobs quicker too to compensate"
    - Today (dreamzone-3 e656a9c, `sim/params.h:35-40`): sprint reaches 7.0 m/s in 0.6 s, then climbs to a peak of 8.75 m/s
      over 8 s of unbroken sprinting. His ask: that peak about 10 m/s, earned by holding the sprint and taking good lines;
      upgrades raise it further. The chasers' own reference speed (7 m/s, `chase/SPEED_MODEL.md`) rises to match, keeping his
      10% start advantage (item 28 via A, about 0.91 hunter-to-player at 30 s).
    - The generator sizes voids from the base sprint (7.0, `gen/src/gen.h:106`), not the peak, so raising only the peak
      leaves every seed's world unchanged.
82. 2026-11-11 11:06 (on D), the order for while he sleeps: "while I sleep, can you guys continue to work on the proc gen
    design for the different biomes for the kid. And then when that is good, continue to refine the player model and entities
    we have from their design/textures, and animations, remember, the design for the kid will be their persona and identity as
    well, so lets make it good, doesnt matter to me how he looks, and also remember, the camera the player sees through is
    attached to the face of the real model that is animated like how we have right? Make the models as detailed as you can go.
    And then we can do multiple passes if we have to. Once that is done to a sufficient level, we need to really make the
    textures and objects that spawn in the proc gen look good and aware to their surroundings with how they spawn in. It is a
    lot but it is a decent chunk to get the game looking better. At the same time, do you remember the overall aesthetic the
    game is going for?"
    - The order, in his sequence: (1) the generator's biome design for the kid; (2) the player model (the kid: his persona and
      identity; his look is the room's choice) and the entities: design, textures, animation, as detailed as can be, in passes;
      (3) textures and props in the generator, placed with awareness of their surroundings.
    - His camera question, checked by the librarian against the code: today it is the other way round. The camera is the
      simulation's eye, unchanged to the tick, and C's L161 body hangs from it (`handback/p-l161-body-C_2026-11-11.md`). He
      wants the camera attached to the face of a real animated model. That is a design change to how the view moves; see the
      night's plan.
83. 2026-11-11 11:09 (on D), Blender and Python, after the librarian asked whether panes may use Blender (headless, scripted)
    and so Python for Blender work only: "yep well u have access its on steam"
    - Checked: `C:\Program Files (x86)\Steam\steamapps\common\Blender\blender.exe --version` → Blender 5.2.3 LTS (build
      2026-10-22). Run headless (`--background --python`), never the launcher, never a window.
    - His yes covers Blender and Python scripts for Blender work only; the room's other scripts stay Bash and Node.
84. 2026-11-11 11:13 (on D), lore, queued: "wow if you guys get it done faster than expected, can you add to the queue to do
    theory crafting ideas for the lore and how it ties into the monroe institute and hemi sync, its not illegal to reference real
    thngs in a game, just make the cheque not say who its from i guess"
    - Queued after the day run's phases (or when a pane is idle): lore theorycrafting tying the dreamzone to the Monroe
      Institute and Hemi-Sync. Prior art: E's L161 lore section (`handback/p-l161-look-E_2026-11-11.md`, "The lore": the 1983
      Gateway memorandum, Focus 10-21, the later Focus 22-27 territories, Belief System Territories, "the Park", Hemi-Sync).
    - Real names may be referenced in the game (his call, item 84; this answers the librarian's 09:0x caution on item 70).
      The cheque itself names no payer.
85. 2026-11-11 11:13 (on D), widening item 84: "but even potential character ideas and life paths and backstories that connect
    to what we want, and then craft the ultimate way they intertwine together"
    - D661 widens: character ideas (about four, plus two as possible DLC, item 72), each with a life path, backstory, way into
      the dreamzone, unique buff and biome set (74); then the design of how their stories intertwine (68: each discloses what
      makes another's make sense, playable in any order past the unlock caps). The kid (46-47) and the writer (71) are the two
      archetypes already on record; the kid's arc stays first (72).
    - CORRECTION to item 79's note (librarian, 2026-11-11 13:0x): "the entities stay the things never seen sharp" was the
      librarian's reading of a NIGHT-RUNNERS reviewer's description, not his word, and it was carried into E's chaser sheets as
      a rule to model the chasers with less detail. His own word (item 82) is that the player model AND the entities are made
      "as detailed as you can go". The entities are built fully detailed; how sharply they are seen is left to the render
      (haze, light, the dream dial).
86. 2026-11-11 15:42 (on D), back from sleep, to the five questions waiting on him (cgltf and texconv; the void at 10 m/s; the calm
    school; the kid's next pass; Git LFS and textures on a fresh clone): "do all waiting on me, also, the desiign for the kid is
    decent, however I want it to be more designed, also, he needs to come with a base outfit and clothing that give no buff, you
    know like his original appearance before people customize him."
    - "do all waiting on me": a yes to each, taken as the librarian's recommendation where one was given and the librarian's call
      where it was not (stated to him in the reply of 15:4x).
    - The kid: "decent", but "more designed": a stronger, more intentional character design, not only a correct one.
    - A base outfit with no buff: his original appearance, the default before any customisation; buffs belong to clothing he
      finds or buys later (items 51-52).
87. 2026-11-11 15:45 (on D), the clothing slots: "how customizable should it be, i have this idea, like, shoes, pants,
    shirt/jacket, accesories."
    - His four: shoes, pants, shirt/jacket, accessories. The librarian's proposal in reply (15:4x), for his word: split the top
      into an inner shirt and an outer layer (the outer layer's sleeves and cuffs are what first person shows most); hair as a
      cosmetic-only slot, the face fixed (it is the persona); accessories as two small slots that never take a trinket's place
      (an equipped trinket shows on the body where it belongs, as the watch does on the wrist).
88. 2026-11-11 15:49 (on D), the chasers' pathing: "also, small quirk from the ai pathing logic currently, when it rounds a
    corner, it will lock onto you unnaturally in a straight line like you can tell its an AI and not something more organically
    intelligent you know?"
    - After a corner, a chaser snaps onto a dead-straight line at him. He wants pursuit that reads as an organic intelligence,
      not a machine locking on.
89. 2026-11-11 15:51 (on D), biomes in his build, and doors: "also is there more biomes in the current build? I do love the proc
    gen as it is now for the starting biome, but sometimes there are too many doors you know?"
    - Checked: his build is main b212ae8 (the apartment's textures in, built 15:30). It holds the apartment, the hotel, the
      school and the hospital. The home regions round the spawn are always the apartment; the others lie out in the biome field,
      so they are met only after travelling; nothing yet lets him start in a chosen biome.
    - Doors: today's school landing raised the apartment's `door_rate` 0.25 → 0.30 (E's D658 "a door too many", from the D652
      trait list), and D656 added doors set onto walls (`false_doors` 0.01). He loves the apartment's generator as it is but
      finds the doors too many: the door_rate goes back to 0.25 or under, measured.
90. 2026-11-11 16:12 (on D), after playing the build with D656's sound: "the sounds themselves need work"
    - The sounds as made today are all synthesised in code (audio/mixer.cpp: footsteps, lamp hum, fridge, the TV's murmur,
      the chasers' voices). Which ones fall short is to be asked; the librarian's 10:2x advice stands: code does hums and
      drones well and anything physical or alive badly; recorded sound is the fix for the latter.
91. 2026-11-11 16:21 (on D), after a long run: "just had a far run, the proc gen does get way too repetitive over time, like more
    than i thought it would running throught it for 5 mins straight, also, for most of it i cant see how its keeping up with me,
    how is the data"
    - Read from `game/runs/run-20261111-221301.txt` (the librarian): brutal, seed 1, build b212ae8, **caught by the pack (#64)
      after 450.85 s**, about 3 km from the spawn (at 1883, 7, 2368). The only close calls were the hunter at 418.7 s (1.42 m)
      and 431.6 s (2.30 m). So for about seven minutes nothing kept up with him; the hunter closed only near the end. The speed
      model's straight-line formula said it overtakes at about 135 s; on a real route it did not.
    - The generator reads as too repetitive over five minutes of running.
92. 2026-11-11 16:24 (on D), how the lesser entities should behave: "i feel like, things that come in front of you should like
    hear you, and then slowly move toward the sound until it sees you, remember, the evil god is playing with you at this point,
    the AI should try to scare you more than trying to catch you at first almost, besides the hunter who is always coming"
    - The lesser entities ahead of him: they hear him, move slowly toward the sound, and only commit once they see him.
    - Early in a run they try to scare more than to catch: the evil god "playing with its food" (item 30). The hunter is the
      exception: it is always coming (item 65).
    - Ties to: item 65 (only the lesser ones hear; the hunter always knows), D654 audio step 3 (they hear along the walk graph,
      what they hear he can hear coming), item 64 (he was cut off from the front by a pack that heard him).
93. 2026-11-11 16:29 (on D), the reprieves' shapes: "lots of the reprieval zones i have found are more of the short ladder climb
    down, which is a fine mechanic, but its too short and doesnt save as much time as u think. Perhaps it could be connected to
    those long hallways, like, you know how those long hallways create a good gap, it doesnt have to be every time, but perhaps we
    can expand the shapes the reprieval zones can take, even combining the pieces together to form unique passage ways that can
    spawn in built off of currated designed that can be mirrored and interchangably linked to form a longer passage, you know
    what  imean?"
    - Today most reprieves he meets are a short ladder climb down: fine, but too short to buy much time.
    - Wanted: more reprieve shapes; some joined to the long hallways that open a gap; and reprieve passages built from curated,
      hand-designed pieces that can be mirrored and linked interchangeably into longer, unique passages. Not every time.
    - Read with items 54-56 (a reprieve erodes 10 s after first entry) and the variety finding of item 91.
94. 2026-11-11 16:31 (on D), refining item 93: "but then not every point needs to be a long reprieval you know? It can be short
    ones like how it is now, to a varying length perhaps even larger ones that we expect through RNG, i guess just make it possible
    to scale big, but less chance after like 4 pieces plus. You get what I mean, so now there could be reprieval upgrades and apart
    of the luck mechanic for it to spawn longer safe zones, perhaps even more chances for chests to spawn, or even extending the
    time you can be there with it working. you know?"
    - Reprieve passages of varying length: short ones as today, longer ones by chance; possible to scale big, with the chance
      falling off past about 4 pieces.
    - Upgrades and luck (item 41's luck) can raise: the chance of longer passages, the chance of chests in them, and the time a
      reprieve keeps working (items 54-56's 10 s erosion).
    - The librarian's note: the world is deterministic per seed and does not shift with the player's upgrades (the voids are
      sized from a fixed base for that reason). So the proposal to him is that the seed lays out each passage's full possible
      length and luck opens more of it (the extra pieces sealed at lower luck), which keeps one seed one world.
95. 2026-11-11 16:33 (on D), the safe zones' name: asked for a Monroe-lore name ("we also need a new name for it, do we have a
    monroe institute lore based idea for the name"), offered "the Park" (Monroe's Focus 27 way-station, secondary source; lore
    T3), "Balloon" (Gateway's Resonant Energy Balloon) and "Reception"; his answer: "I like it" (to the Park, the
    librarian's pick).
    - The reprieves / safe zones are called **the Park** in player-facing text and design from now on. Erosion reads as the
      Park dissolving. Code identifiers may keep "reprieve" internally.
96. 2026-11-11 16:41 (on D), on the D661 lore page: "everything for the lore sounds decent except the cast, the kid and the writer
    is good, but what about a third, russian operator trained by the kgb, his room is like this military barracks"
    - The lore ties are kept. The cast: the kid and the writer stay; the night nurse, the analyst and the two DLC proposals are
      not taken.
    - The third character: a Russian operator trained by the KGB; his room is like a military barracks.
97. 2026-11-11 16:44 (on D), on the cast's eras: "but then see this is funny, time is non linear there, we do not have to be bound
    to the same time period"
    - Time is non-linear in the dreamzone, so the characters need not share one period: each can live in his own era and still
      meet the others' traces there.
    - Documented ground the librarian points to: Gateway's Focus 15 is the state of "no time" (E's L161 lore, L161 handback
      "Focus 10, 12, 15 and 21"), and the 1983 memo describes Focus 21 as "movement outside of the boundaries of time-space".
98. 2026-11-11 16:55 (on D), each character's room and how they progress: "for the kid the means of acquiring new abilities and
    cosmetics is the same through his PC and exercising in his room, the writer also has similar home gym setup, and perhaps say
    a modern day PC setup, this allows for more customization for PC lovers, we can when the time comes, create ripoff brands of
    pc parts and mimic designs lol, just like that pc builder sim game, it will be like a mini game remember? It wont be AS
    detailed, but you can buy the parts and assemble them in a case like just buying them online, even for 2005, and 2026, the PC
    will work similar but have different design for the UI within the game lol. So windows from 2005 look vs modern windows 11 and
    ui style. For the russian, it will be a lot different, they will have their little living quarters, perhaps some sort of
    underground bunker base or not sure how it would go, but they have their exercise mat or what ever those kgb fks would use, no
    pc screen bc no internet, perhaps where the desk is there are a bunch of fliers or something you can browse through for
    character specific cosmetics, then he uses the same strat as the kid eventually meditating to unlock abilities, and then can
    acquire trinkets from the kgb some how through their shop we some how set up that makes sense, they trade cash and energy for
    something, but it tells the story of the military trying to control it, something that cannot be truly comprehended"
    - The kid (2005): abilities and cosmetics through his PC and exercising in his room (items 48-51, 68).
    - The writer: a similar home gym and a modern PC (so the writer's era is the present, 2026). The PC builder mini game works
      the same for both eras (buy parts online, assemble them in a case; not as detailed as a full builder sim), with each era's
      own desktop UI: a 2005 look against a modern one. Parody brands of PC parts, made up.
    - The operator: living quarters, perhaps an underground bunker; an exercise mat; no PC, no internet; at the desk, a stack of
      fliers to browse for his own cosmetics; he meditates to unlock abilities as the kid eventually does; trinkets through a KGB
      supply he trades cash and energy into, telling the story of the military trying to control something that cannot be
      comprehended.
    - The librarian's note for whoever builds the UIs and brands: the brands are invented parodies with their own names and
      logos; the two desktops are period-styled originals, never a copy of a real operating system's logos, names or exact
      screens.
99. 2026-11-11 17:01 (on D), the PC builder's design: "we also should go with realistic pricing for the times, besides the spike of
    2026 for pc parts lol, that would be asking too much of even the player to get that money xD. But yea, so its not something
    the player will invest in at first, but be a resource sink for fun eventually when they dont need to keep spending money on
    physical attribute boost or cosmetics, closer to an end game fun little mini game, but yes, all parody brands of real parts. It
    should be cases, motherboards, Cpu, cpu coolers, ram, gpus, power supplies, memory systems, case fans, every major part of the
    PC, even the wiring or whatever, can create different combos, different colors of different parts that made sense and were
    authentic. Perhaps even different monitor and mouse and keyboard, also for the writer, it even will allow him to build an older
    setup if the player wants. But yes for both eras the pc builder will be simple yet comprehensive"
    - Prices realistic for each era, except 2026's price spike, which is not passed on in full.
    - Placed as a late-game resource sink for fun, once physical boosts and cosmetics no longer need the money; not an early
      investment.
    - All parody brands of real parts. Parts: case, motherboard, CPU, CPU cooler, RAM, GPU, power supply, storage, case fans,
      cables; colours and combinations true to each era. Also monitor, mouse and keyboard.
    - The writer (2026) may also build an older setup if the player wants.
    - Both eras: simple yet comprehensive.
100. 2026-11-11 17:09 (on D), the operator's text: "i had this idea for the operative, all text at first glance is russian, but when
    the player focus middle of screen on it, it becomes english to read"
    - In the operator's story, every piece of text (fliers, ledger, signs, reports, his room and his biomes) is Russian at a
      glance and turns to English when the player holds it at the middle of the screen.
    - The librarian's notes for the build: real Russian, translated properly (never fake Cyrillic); the change can be a
      dream-like morph of the letters; an accessibility setting shows English at once.
101. 2026-11-11 17:11 (on D), the scope: "what if we are getting ahead of ourselves making multiple characters, what if we make just
    one great one? I think that is the right path"
    - One playable character, made great: the kid. Items 68-71 and 96-98's other playable characters (the writer, the operator)
      and their unlock ladder are set aside, not deleted: they stay in this brief and on the lore page as ideas.
    - The librarian's proposal in reply (17:1x): what was good in them can live inside the kid's one story as traces and lore he
      finds (the operator's ledger and its Russian that turns English on focus; the writer's book and the site's archive; the
      watch across decades), so the intertwining survives as mystery rather than as playable saves.
102. 2026-11-11 17:13 (on D), the kid's story: "lets fully flesh out the story for the kid then, we dont even need to use the father
    death thing, it could just be like, idk lets brain storm"
    - The kid's whole story is open again: the father's death (items 46-47) is no longer required. Brainstorm first; the
      librarian offers premises in reply (17:1x).
103. 2026-11-11 17:19 (on D), picking the kid's story from the librarian's five premises (17:1x: 1 The Sleeper, 2 The Coma, 3
    Insomnia, 4 The Signal, 5 The Father, but alive; the librarian leaned 4, perhaps blended with 5): "truue, 4"
    - **The Signal:** in 2005 the kid buys a used PC off a sketchy forum. On its drive are old Gateway tape rips and a program
      that plays them. He runs it one night out of curiosity, and something answers. The cheques start after his first run.
      Whoever owned the PC before him went somewhere and never came back, and the dreamzone is full of their traces. The PC
      room is the story's heart.
    - He picked 4 alone; the blend with 5 (the previous owner being his father) is not taken unless he says so.
104. 2026-11-11 17:20 (on D), on the Signal's spine: "we could throw in the lore of the kgb or cia operative findings or something
    idk"
    - The agencies' findings join the kid's story as found lore: the American side and the Soviet side.
    - The librarian's proposal in reply (17:2x): the real 1983 Gateway memo was cleared for public release in 2003 (CIA reading
      room, approved for release 2003/09/10; E's L161 lore), so in 2005 it is newly out and passed round forums: the previous
      owner built the program from it. American files appear redacted and the bars lift on focus; the Soviet ledger is Russian
      that turns English on focus (item 100). Never claiming what the agencies did beyond the record.
105. 2026-11-11 17:22 (on D), answering the librarian's questions on the Signal: "also ur questions. 1. a stranger prob someone
    connected to the monroe institute or cia or some party that knew his affinity for it some how. 2. the "good god" needs a new
    name, but it is something ancient, the counter force to the dark one, but it is said to be more powerful."
    - 1. The previous owner: a stranger, probably connected to the Monroe Institute, the CIA or some party, who somehow knew the
      kid's affinity. So the sale was not chance: the PC found him.
    - 2. The good god gets a new name. It is ancient, the counterforce to the dark one, and said to be the more powerful.
    - Question 3 (his waking life) is still open.
106. 2026-11-11 17:42 (on D), the kid's waking life, from the librarian's six pieces (A his mother on night shifts; B his
    grandmother; C an online best friend over MSN-style chat; D a school friend; E sleep and school falling apart; F the seller
    won't let go): "acf is good"
    - **A:** his mother works nights; just the two of them; money tight; notes on the fridge, her knock at dawn; he uses the
      cheques for the bills and lies about the money; the dreamzone learns her knock.
    - **C:** an online best friend he talks to every night on the PC; the friend notices him changing, gets curious, tries the
      tapes; later, messages arrive from the friend while the friend is asleep.
    - **F:** the seller keeps checking on his "progress" on the forum; watching him, never clearly helping or harming.
107. 2026-11-11 17:44 (on D), the counterforce's name and the central mystery: "the absolute, the creator of all things, but why is
    there a darkness? that is the mystery, what if it always was the players self or something"
    - The good god is **the Absolute**: the creator of all things.
    - The mystery at the story's centre: why is there a darkness at all? His proposal: it was always the player's own self.
    - The librarian's reading of what already points there (17:4x): the hunter was designed as the kid's own outline grown wrong
      (E's chaser sheet section 1, the hood and hoodie cut of his own); item 62 named the top virtue "Recognition" and asked why
      it cannot last; the dreamzone is built from the dreamer's own psyche (item 26, Monroe's Belief System Territories).
108. 2026-11-11 17:49 (on D), on the hoodie and the dark one's name: "father is dead is still a good plotline, i dont get the one that
    follows"
    - The father's death stays in the kid's story (items 46-47, reopened at 102, now kept): the hoodie is his dead father's, the
      darned cuff his mother's hand. E's "gone, not dead" option (D667 section 10) is not taken. How the death sits beside The
      Signal is for E to weave (the bible's sections 6, 7 and 10 read again).
    - "the one that follows" as the dark one's name did not land with him; the librarian explains it and offers others (17:5x).
109. 2026-11-11 17:50 (on D), correcting the librarian's reading of item 108: "no the hoodie isnt his fathers, he starts the run with
    his regular clothing, and then can unlock it later as late game item"
    - The kid's base outfit is his own regular clothing, not his father's hoodie.
    - The father's hoodie is a late-game unlock (an item he earns later), not what he starts in.
    - Corrects item 108's note ("the hoodie is his dead father's" as his base) and E's redesign sheet, whose three directions all
      built the base outfit round the father's hoodie.
110. 2026-11-11 17:52 (on D), on the story's latest and the dark one's name candidates (the Echo, the Hollow, the Remainder, the
    Undertow): "they are good for now"
    - The story as it stands (D667 with its additions) is accepted for now. The dark one's name stays open among those four; no
      pick yet. The build uses a placeholder.
111. 2026-11-11 17:58 (on D), the wardrobe: "i actually like the looks, could be fleshed out more, complex customization, hair cut
    if not hat even, BETTER YET, haircuts still change underneath the hat, making the hair bend in ways it should. But this is
    later. There could be like a dozen base items for each class, shoes, pants, undershirt and jacket, accesories and hats,
    glasses, etc. But it is good to start crafting the type of mid 2000 clothing style and the type of clothing perhaps even
    ripoff brands like the pc parts will have. And so listen here is an idea, once we have all of the pieces made, like the ones
    you can buy, they come from the store with the common buffs associated with each item of each class, but when you go through
    a run with a certain outfit of items, there is a chance something can rub off on a clothing item, increasing the buff or
    giving it an extra quirk, increasing its rarity to one up above, giving it an extra trait small buff, think of it like
    cyberpunk cyberware small buffs with darkest dungeon quirks."
    - He likes all three redesign-2 looks; none picked as the base yet.
    - Later, not now: complex customisation; haircuts, and the hair still shaped under a hat (bending as it should); about a dozen
      base items per slot (shoes, pants, undershirt, jacket, accessories, hats, glasses, and more).
    - Now: start crafting the mid-2000s clothing style and parody clothing brands (as the PC parts will have).
    - Clothing progression: store items come with a common buff for their slot; wearing an outfit through a run gives each piece
      a chance that something "rubs off" on it: a stronger buff, or an extra quirk/trait (a small buff), raising its rarity one
      step. Cyberpunk's cyberware small buffs crossed with Darkest Dungeon's quirks.
112. 2026-11-11 18:00 (on D), expanding item 111: "to expand off of the clothing, there could be legendary clothing or cosmetic drops
    within the dream, so instead of manually level up clothing with the chances of getting better and more traits, you could get a
    legendary drop already kitted with random buffs, which can then be locked or rid of just like darkest dungeon, if its full, the
    newest one gets replaces etc if not locked."
    - Legendary clothing and cosmetic drops inside the dream: they arrive already kitted with random buffs and quirks, a second
      road beside the rub-off levelling of item 111.
    - Quirks can be locked or removed, as in Darkest Dungeon: when an item's quirk slots are full, a new quirk replaces the
      newest unlocked one; locked quirks stay.
113. 2026-11-11 18:00 (on D), what the dream's legendary drops are: "so these will be iconic or resonant cosmetics that you cant find
    in the store, like lore based legendary items"
    - The dream drops are iconic, resonant-tier cosmetics never sold in the store: lore-based legendary items (each tied to the
      story: the previous owner, the agencies, the ledger, the hospital, the father).
    - Added at once (18:00): "that are unique": each lore legendary is unique, one of a kind in a save; never a duplicate.
114. 2026-11-11 18:01 (on D), the father's item: "i think it should be his fathers watch, not hoodie."
    - The father's late-game item is his **watch**, not a hoodie. The father's hoodie is dropped from the story.
    - The watch: the pale band on his left wrist (he wore it after the funeral; it went missing the night of his first run); found
      in the dreamzone; the late-game unlock behind the hospital door (story bible item 6's placement, now the watch); it fills the
      reserved left-wrist slot, a trinket (item 47), unique.
115. 2026-11-11 18:02 (on D), on E's invented brands: "but what about parody of name brand clothing, such as nike, or adidas or tommy
    hill figure other populer brands of the time"
    - He wants the clothing brands as parodies of the real big brands of 2005 (Nike, Adidas, Tommy Hilfiger and the other
      popular labels of the time), in the spirit of the PC parts' parody brands, not unrelated invented labels.
    - The librarian's line (18:0x): the NAMES may wink at the real brand (as GTA's parody brands do); the LOGOS, stripes,
      colour blocks and trade dress must be our own, never a lookalike of the real mark; a legal review before release.
116. 2026-11-11 18:02 (on D), on E's first set of lore legendaries (D668 ADDED, which mixes garments with small objects worn on a
    cord or wrist): "but see we have to make a sharp distinction between cosmetics and accesory, and the two trinkets u can carry at
    once"
    - Three categories, kept sharply apart: clothing (cosmetics), accessories, and trinkets (two carried at once, item 32).
    - The librarian's proposal in reply (18:0x), for his word: clothing carries the slight buffs and the rub-off; accessories are
      look only; trinkets are the two strong-buff lore objects. E's legendary set re-sorted on that line: garments stay legendary
      clothing; small objects (a pick, a badge, a wristband, a CD sleeve, the father's watch) become trinkets.
117. 2026-11-11 18:07 (on D), answering item 116's split (the librarian had proposed accessories as look only): "the accessories can
    give small buffs too, say there could be legendary glasses that make the dark a little more visible type shit, not just that,
    but small buffs that reroll on the shop every day, so for example, one day it could say on common buff for different more
    expensive shoes +2.5-5% acceleration or top speed, or they could be luck shoes, or like more cash earned type shit, we could
    research more mini buffs that could exist for each cosmetic item. say a player wants max speed, they can try find every version
    of every cosmetic that drops with the buff they want, rerolled every run in the shop. Eventually when the beanbag meditation
    setup is unlocked, within that spectral menu in the cosmic realm out of body worl" (the message arrived cut off here, with a
    pane's ring pasted after it).
    - Accessories carry small buffs too (not look only); e.g. legendary glasses that make the dark a little more visible.
    - The shop's items carry small buffs that REROLL: the same item can show a different common buff from one restock to the next
      (he says "every day" and "every run"), in a range (e.g. +2.5-5 % acceleration or top speed; luck; more cash). A player
      chasing max speed hunts the versions that roll the buff he wants.
    - Research owed: the possible mini buffs for each cosmetic item.
    - Something about the beanbag meditation menu in the cosmic realm; cut off, to be asked.
    - So the line between clothing and accessories is not buffs; trinkets (two carried) stay the strong ones.
118. 2026-11-11 18:07 (on D), finishing item 117's cut sentence: "out of body world, it shows the "enchantment" buffs on your
    cosmetics that can be gotten rid of or locked, like the darkest dunegon mechanic"
    - Once the beanbag meditation setup is unlocked (item 49), its spectral menu in the cosmic out-of-body realm shows the
      "enchantment" buffs (the quirks) on his cosmetics, and there they are removed or locked, as in Darkest Dungeon (items 112).
    - So quirk management lives in the chair's out-of-body menu, not in a shop or the washer.
119. 2026-11-11 18:08 (on D), the shop's reroll cadence: "every run is every day since they wake up then sleep"
    - One run is one night: he sleeps, runs, wakes. So "every day" and "every run" are the same: the shop restocks and rerolls
      once per day-night cycle, between runs.
120. 2026-11-11 18:09 (on D), on E's 24 parody labels: "the parody names should be serious not just comedic"
    - The parody brands should read as believable real labels, not jokes: a name you could see on a shoebox in 2005, still
      winking at the real brand, but not a gag (Lukewarm Topic, Runner-Up, Abercrumb & Fetch read as jokes).
121. 2026-11-11 18:11 (on D), catching a design error in the guitar pick's signature ("after Recognition ends, stress stays at zero
    for 30 s"): "but what do you mean after recognition ends, if recognition does happen there is no stress for the rest of the
    run, so that item doesnt make sense"
    - His rule (items 60-61): once Recognition happens, stress cannot rise for the rest of the run; only the golden phase (2-3 min)
      ends, the passive buffs and no-stress remain. So a buff for "after Recognition ends" does nothing. The pick needs a new
      signature.
122. 2026-11-11 18:13 (on D), the course: "i think we are getting ahead of ourselves and need ot get back to fundementals quick, after
    all work in motion is done, lets do a comprehensive sweep to see where the gaps are again"
    - Stop opening new design threads. Finish the work in motion, then a comprehensive sweep of the game's gaps, back to
      fundamentals.
123. 2026-11-11 18:19 (on D), the father's legendaries: "dads watch is a trinket, legendary jacket would be dads bomber. Dads
    sunglasses are legendary accessory. We can flesh out the trinkets and other legendary cosmetics later"
    - His father's watch: a trinket (as item 114).
    - His father's bomber jacket: a legendary jacket (clothing, Outer).
    - His father's sunglasses: a legendary accessory.
    - The rest of the trinkets and legendary cosmetics are fleshed out later (item 122: fundamentals first).
124. 2026-11-11 18:37 (on D), on the sealed Park pieces opened by luck (D665 section 3f): "1. i guess i never thought of that, keep the
    luck to the chests that spawn in, so not only does luck make them spawn more often, but then also better chances of better loot
    and more ability or item drop, similar to the megabonk chest open where you can acquire multiple things at once"
    - No sealed pieces: luck does not touch the Park's length. A Park's length is the seed's alone (item 94's chance curve).
    - Luck acts on chests: they spawn more often, roll better loot, and can give several things at once (a Megabonk-style open:
      more abilities or items in one chest; item 41's slot-machine opening).
    - Item 94's "luck for longer safe zones" is superseded by this.
