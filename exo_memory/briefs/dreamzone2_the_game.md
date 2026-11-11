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
