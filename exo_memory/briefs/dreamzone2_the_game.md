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
