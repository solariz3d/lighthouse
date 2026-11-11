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
