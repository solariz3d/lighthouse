# Dreamzone 3: the kid's biomes (brief copy of dreamzone-3 `docs/BIOMES.md`, branch `d658-biomes-e`)

This brief is the lighthouse copy. The master is the dreamzone-3 file on branch d658-biomes-e (then main once landed); change both together.


Pane E, machine D, 2026-11-11. Design only; B and C build from it, one biome at a time.

- **Branch:** `d658-biomes-e`, off `main` e656a9c.
- **Copy:** the same text is in lighthouse `exo_memory/briefs/dreamzone3_biomes.md`.
- **His words:** lighthouse `exo_memory/briefs/dreamzone2_the_game.md` items 6, 26, 28, 36, 45-47, 74, 76, 78 and 82.
- **Labels:** each line says whether it is **his** (an item number) or **proposed** (mine, for him to change). Everything
  proposed is a starting number for the gym, not a ruling.

## 0. The set, and what is parked

- **The kid's biomes (item 26):** "his apartment, underground research facility, empty mall, empty hospital, empty highschool,
  perhaps empty hotel".
- **Parked, the librarian's reading** (stated to him; it is not his ruling): **pool rooms** and **chaos** belong to other
  characters' psyches or to deeper layers (item 74: "every other character could have their own style of biomes"). They keep
  their names in `BiomeId` and stay undefined, so they are never chosen.
- **The rare "outside"** (item 26, "a door to a liminal outside neighborhood, or a unnatural green looking hill") is not part of
  this phase.
- **The hospital is new to the code.** `BiomeId` has no hospital today (`gen/src/gen.h:221-230`). proposed: add
  `kBiomeHospital` just before `kBiomeCount`, so the existing ids keep their numbers.
  - inferred: any newly defined biome changes every seed's world beyond the home regions. `biome()` shares the region field out
    by the defined weights (`biome.cpp`, `Generator::Impl::biome`). A reviewer should expect each biome's landing to move
    seeds; that is on purpose, not drift.

## 1. How a biome is said to the generator (its own terms)

"Biomes are data. The generator's code never asks which biome it is in, only what the numbers are" (`gen.h`).

| part | what it sets | where |
|---|---|---|
| **cells** | 3 m square, 3.5 m storey; kinds Lane, Cut, Room, Landing, Stair, Shaft, Well, Hall, Void, Ledge, Reprieve, Abyss | `gen.h` `CellKind` |
| **LayoutRules** | lanes (segment, offsets, `wide_share`), blocks (`block_open`, `merge`, `partition`, `bay_share`, `sealed_share`, `door_rate`, `door_stride`, `grand_share`), ceilings, the per-biome dial scales (`loops`, `dead_ends`, `vertical`, `big_spaces`, `lamps`, `reprieves`), the lamp field (`lamp_dark`, `lamp_bright`), `blind_share`, `split_share`, `ramp_share` | `gen.h` `LayoutRules` |
| **TemplateSet** | stairs (`switchback_share`, `spiral_share`), shafts and wells (`shaft_rate`, `well_share`), atria (footprint, storeys, `mezzanine_share`) | `gen.h` `TemplateSet` |
| **KitPalette** | material ids by kit and role, and the lamp colour | `gen.h` `KitPalette`, `core/scene.h` roles 0-11 (12-15 free) |
| **MovementCharacter** | ledge and rail heights | `gen.h` |
| **the field** | 24 × 24 cells × 8 storeys per region; the home regions are always the apartment; the apartment thins with distance | `biome.cpp` `Generator::Impl::biome` |

**Two things this design needs that the code does not have yet** (both proposed):
1. **Depth per biome:** a `float depth` on `Biome`, in region rings from the origin. Section 9 gives the rule.
2. **A sound row per biome:** the acoustic numbers of C's D654 (lighthouse `handback/p-d654-audio-C_2026-11-11.md` :104-125). They
   sit beside the lamp numbers, as C proposed.

## 2. The psyche, and the one rule over every biome

- **His frame:**
  - "the belief system territories are but different manifestations of the space from the player characters psyche" (26);
  - the father's death "isnt directly said… it only leaves ancedotes that it occured… currated pieces of the environment made
    to echo the event in a non direct way" (46);
  - "Dads watch… even though dad is gone, he trace lives on" (47);
  - the god entity may be "the embodied for the love he had for his father, or… him in a way" (47).
- **The rule (proposed):** every biome is a place a boy goes to in life. Each holds the loss **by what is missing**, never by what
  is shown.
  - No body, blood or crime scene.
  - No words naming it.
  - The echo is always an absence shaped like a person: a place set for one more, a coat, a seat kept.
  - This is kenopsia (D652: "show the signs of the missing people… never the people") turned on one person.
- **Each biome gets one "designed piece"** (item 26: "real pieces to be imbeded into the seeds, like designed areas with
  meaning"). It is rare (proposed: once in a few runs), hand-made, and placed by the seed. Its content waits on the story's facts,
  which are a GAP for him (`dreamzone3_design.md`: "Do the father's story's facts need fixing before any designed piece is
  built?"). This file names only each piece's *shape*.

## 3. The apartment, his home (where every run begins)

**Psyche (proposed):** the present tense. Grief as it lives in an ordinary home: everything still where it was put.

**Layout grammar.** The built defaults stay; it is the template the others differ from.
- Corridors dog-leg every block or two, rooms open into one another without doors, mixed ceilings, both kinds of stair
  (`biome.cpp`).
- proposed, one change: `door_rate` 0.25 → 0.30. D652's "a door too many": a second door where one would do.

**Look (D652 §5, kept by item 76):**
- warm tungsten, a ceiling fixture per room, some dead;
- carpet, beige paint, popcorn ceiling;
- the wrong thing is "rooms that open into rooms, a door too many".
- With D653's target: light and air first, the soft picture.

**Brightest biome (item 36: "the first biome and on average more places should be lit"):**
- built at L162: `lamps 1.25`, `lamp_dark 0.8`, `lamp_bright 1.6`, so the apartment is never darker than before.
- It stays the brightest of the six (section 10).

**Sound (C's D654):**
- carpet: dead air, short reverb, damped high;
- D652's "fridge hum, a TV left on somewhere";
- floor role slab = carpet footsteps.

**Kenopsia props (phase 3):**
- shoes by a door;
- a TV glowing in an empty room;
- a kettle;
- a table laid for a meal with a chair pulled out;
- a coat on a hook.

**The designed piece (shape):** a doorway he has walked past a hundred times, into a room kept as it was. A second coat on the
hook. The photo on the desk (46) belongs to his real room, not the dreamzone; the dreamzone only rhymes with it.

## 4. The hotel ("perhaps", item 26)

**Psyche (proposed):** the in-between of a family away from home. Nights spent somewhere that was never theirs. It is the most
neutral of the six: transience, not loss. It is the first place to go after home.

**Layout grammar:** as built, a parameter proof.
- `lane_segment 36`, `merge 0`, `partition 3`, `door_stride 3`, one ceiling of 2.7 m;
- switchbacks 0.9;
- a tall lobby atrium often (`big_spaces 2.5`, atria 6-9 cells × 3-5 storeys).

**Look:**
- warm sconces in pairs, long and dim between (kit 1 has it, lamp 1.0/0.78/0.50);
- patterned corridor carpet, room numbers;
- the wrong thing is "the corridor that does not end, number order wrong".

**Sound:** carpet, short and damped; the atrium long and dark with pre-delay (C); HVAC, an ice-machine clunk (D652).

**Kenopsia props:**
- a room-service tray at a door;
- a "do not disturb" on a handle;
- a luggage cart in the corridor;
- an unmade bed through an open door.

**The designed piece (shape):** a room booked for three, with two beds slept in.

## 5. The high school

**Psyche (proposed):** the self that had to keep going: being looked at, the empty desk, the day he was taken out of class. The
school is where other people knew.

**Layout grammar (proposed numbers):**
- **corridors:** double-loaded and long.
  - `lane_segment 24`, `lane_offsets 1` (straight halls on a grid);
  - `wide_share 0.6` (lockers along both walls need the width).
- **classrooms:** one size, side by side, always behind a door, never merged.
  - `block_open 0.85`, `merge 0.0`, `partition 3` (9 m rooms);
  - `door_stride 3` (a door per classroom);
  - `bay_share 0.0`, `sealed_share 0.0`.
- **ceilings:** `ceil_corridor {2.7}`, `ceil_room {3.2}` (classrooms tall, halls lower).
- **gym and auditorium:** the atrium. `big_spaces 1.5`, atria 6-9 cells × 2 storeys, `mezzanine_share 0.3` (bleachers read
  as a gallery).
- **stairs:** switchbacks in stairwells (`switchback_share 0.9`, `spiral_share 0.0`).
- **loops:** `loops 1.3` (schools loop: two ways round every block).
- **dead ends and reprieves:** `dead_ends 0.5` (fewer cul-de-sacs); reprieves as is.

**Look:**
- cool fluorescent, one tube flickering, daylight through wire glass;
- lockers, lino, a bulletin board;
- the wrong thing is "a hallway of classrooms set up for a class that never comes".
- Lit evenly and brightly but cold: lamps 1.1, a shallow field (`lamp_dark 0.6`).

**Sound:**
- lino footsteps;
- classrooms medium and bright, halls long and slappy;
- the gym is the long atrium;
- PA crackle, a clock tick, "a bell at the wrong time" (D652).

**Kenopsia props:**
- chairs up on desks except one;
- a backpack under a desk;
- a chalkboard half wiped;
- a locker standing open.

**The designed piece (shape):** a classroom where one desk is turned to face the door. Or the office, with a chair outside it
where a boy waited.

## 6. The mall

**Psyche (proposed):** the family outing. The weekends, the hand he held in a crowd, being lost for a minute and found. It is the
warmest memory of the six, emptied.

**Layout grammar (proposed numbers):**
- **concourses:** wide.
  - `wide_share 0.7`, `lane_segment 18`, `lane_offsets 2`.
- **storefronts:** open to the concourse along their whole edge (shopfronts and gates).
  - `block_open 0.75`, `bay_share 0.7`, `merge 0.3`, `partition 4`, `sealed_share 0.05`.
- **atria:** often, two or three storeys, with galleries round them.
  - `big_spaces 3.0`, atria 6-9 cells × 2-3 storeys, `mezzanine_share 0.9`;
  - `grand_share 0.15` (department-store fronts at full height).
- **escalators:** read as straight flights. `switchback_share 0.1`, `spiral_share 0.0`, the global wide stair (`stair_width
  4.2`) fits.
- **wells:** light wells as skylights. `shaft_rate 0.35`, `well_share 0.8`.
- **ceilings:** concourse high (`ceil_corridor {3.2}`), shops lower (`ceil_room {2.7, 3.2}`).
- **service corridors:** the back of the mall is the mass. `blind_share 0.8` makes its dead ends service corridors, not rooms.

**Look:**
- skylights (white, blown out) plus warm storefronts, many dark;
- terrazzo, brass, planters, a fountain;
- the wrong thing is "stores shuttered with labelscars, escalators running".
- Pooled: `lamp_dark 0.3`, `lamp_bright 2.4` (lit fronts, dark shuttered ones).

**Sound:**
- terrazzo footsteps;
- concourse and atrium long, dark, with pre-delay;
- far muzak through the ceiling, fountain water (D652).

**Kenopsia props:**
- a stroller by a bench;
- a shopping bag left on a chair;
- a carousel with no riders;
- a food-court tray.

**The designed piece (shape):** a bench outside a store where a father would wait, with a coat over the back.

## 7. The hospital

**Psyche (proposed):** the waiting. Corridors where news is given, a room not allowed into. The hospital is the closest to the
event and must say the least.

**Layout grammar (proposed numbers):**
- **corridors:** long and straight, wide enough for two beds.
  - `lane_segment 30`, `lane_offsets 1`, `wide_share 0.5`.
- **wards:** small rooms in rows, each behind its door, never merged.
  - `block_open 0.8`, `merge 0.0`, `partition 2` (6 m rooms), `door_stride 2`;
  - `bay_share 0.1` (nurse stations open to the corridor at junctions).
- **ceilings:** one low height (`ceil_corridor {2.7}`, `ceil_room {2.7}`).
- **lifts:** many. `shaft_rate 0.45`, `well_share 0.1` (shafts read as lift cores). Stairs `switchback_share 1.0`.
- **big spaces:** few (`big_spaces 0.3`). A waiting hall is the only tall room.
- **dead ends:** `dead_ends 1.3`. Wings end. `blind_share 0.7`.
- **reprieves:** proposed, `reprieves 1.3`. A chapel or a quiet room is the hospital's reprieve; the place that holds the good
  entity's light (item 26's golden aura) most naturally.

**Look:**
- the coolest white, the hardest flat light;
- wipe-clean everything, a curtain track;
- the wrong thing is "beds made, a monitor still beeping".
- Bright and even but colourless: lamps 1.0, `lamp_dark 0.5`.

**Sound:**
- vinyl floor footsteps;
- rooms short and bright, corridors medium;
- monitor beep, ventilation (D652);
- the ballast hum heard most here (C).

**Kenopsia props:**
- a made bed with the curtain half drawn;
- a wheelchair facing a window;
- a vending machine lit;
- flowers on a sill.

**The designed piece (shape):** a waiting room with every chair empty, one coat on one chair. A door at its end the kid cannot
open. It is never opened in any run.

## 8. The underground research facility (the deepest)

**Psyche (proposed):** where the adult world took the event over: files, procedure, questions without answers. It is also where
the Gateway thread meets his psyche (items 23-24): the institute's world seen from inside a dream. It is underground because it is
the deepest layer.

**Layout grammar (proposed numbers):**
- **corridors:** low and long, few lanes, heavy doors.
  - `lane_segment 24`, `lane_offsets 1`, `wide_share 0.1`;
  - `ceil_corridor {2.4}`, `ceil_room {2.7, 3.2}` (labs taller).
- **rooms:** sealed.
  - `block_open 0.45`, `merge 0.2`, `sealed_share 0.7`, `door_rate 0.1`, `partition 4`.
- **vertical:** ducts and shafts. `shaft_rate 0.6`, `well_share 0.0`, `vertical 1.2`, `spiral_share 0.0`.
- **voids:** the facility carries the abyss crossings. proposed: a per-biome `voids` scale, 1.5. That is new: `void_rate` is a
  global dial today.
- **dead ends:** `dead_ends 2.0`, `climb_out_share` as is (the ledge out matters most here).
- **loops:** `loops 0.6`. Fewer ways round; it should feel like it closes.
- **big spaces:** `big_spaces 0.6`. A rare containment hall: an atrium 4-6 cells × 3 storeys, `mezzanine_share 1.0`, a catwalk
  round it.
- **downward:** proposed, the facility is weighted to the storeys below the start (`ry < 0` in `biome()`), so it is reached by
  going *down*.

**Look:**
- cool fluorescent tube grids, green-tinged, emergency red at times;
- lino, painted block, drop ceiling;
- the wrong thing is "a lab still running for no one".
- The darkest biome: lamps 0.75, `lamp_dark 0.1`, `lamp_bright 2.0` (deep pools, dark between).

**Sound:**
- lino and metal stair footsteps;
- rooms short and hard, shafts a ringing column (C);
- ballast hum, server whine, a door buzzer (D652).

**Kenopsia props:**
- a clipboard on a chair;
- a coffee cup by a monitor still on;
- a lab coat over a stool;
- a door propped with a fire extinguisher.

**The designed piece (shape):** a filing room with one drawer pulled out and empty. Or a viewing window onto a room that is only
the kid's own bedroom, seen from outside.

## 9. The chapters bring the further biomes closer (item 28)

- **His words:** "as the story progresses, the seeds get more chaotic and the further biomes become closer to reach".
- **Proposed rule:** each biome has a `depth`, the region-ring distance at which it starts to appear.
  - Chapter 1 depths: apartment 0, hotel 1, school 2, mall 2, hospital 3, facility 4. The facility is also weighted downward.
  - The order from near to far: home, then away from home, then other people's places, then the waiting, then the deep.
- **How depth is used:** in `biome()`, a biome's weight is multiplied by `smooth((dist − depth·reach) / 1.0)`, where `dist` is the
  existing ring distance.
- **The chapter sets `reach`:** chapter 1 = 1.0; each later chapter lowers it (proposed 0.75, 0.5, 0.3), so the deep biomes reach
  toward the start.
  - In the last chapter, a hospital or the facility can sit one region from home.
  - The home regions stay the apartment always.
- **"More chaotic":** the chapter also scales the global dials a little: `loops`, `void_rate` and `dead_end_rate` up by
  proposed +10 % a chapter, within each `DialSpec` range.
- **Determinism:** the chapter is an input like the seed. It goes in `GenParams` (proposed `int chapter = 1`), so (seed, chapter)
  always gives the same world. A chapter is not read from save state inside the generator.
- **Open for him:** how many chapters (a GAP in `dreamzone3_design.md`). The rule works for any count.

## 10. Brightness across the set (item 36)

| biome | lamps | lamp_dark | lamp_bright | how it reads |
|---|---|---|---|---|
| apartment | 1.25 (built) | 0.8 (built) | 1.6 (built) | the brightest; warm; never darker than before L162 |
| school | 1.1 | 0.6 | 1.6 | bright, even, cold |
| hospital | 1.0 | 0.5 | 1.8 | bright, colourless, flat |
| hotel | 1.0 (default) | 0.15 (default) | 2.1 (default) | warm pools, dim between |
| mall | 1.0 | 0.3 | 2.4 | lit fronts, dark shutters, white skylights |
| facility | 0.75 | 0.1 | 2.0 | the darkest; deep pools |

All proposed except the apartment's. Each is a starting number for the gym.

## 11. Kits (the material and lamp numbers)

| biome | kit | lamp colour (proposed, linear) | floor | wall | footstep surface (C) |
|---|---|---|---|---|---|
| apartment | 0 | 1.0 / 0.86 / 0.62 (built, warm tungsten) | carpet | beige paint | carpet |
| hotel | 1 | 1.0 / 0.78 / 0.50 (built) | patterned carpet | wallpaper | carpet |
| school | 2 | 0.86 / 0.95 / 1.0 (cool white, a touch green) | lino | painted block, lockers | lino |
| mall | 3 | 1.0 / 0.90 / 0.75 (fronts); skylights white | terrazzo | storefront | terrazzo |
| hospital | 4 | 0.92 / 0.97 / 1.0 (cold white) | vinyl | wipe-clean paint | vinyl |
| facility | 5 | 0.80 / 0.95 / 0.88 (green fluorescent); emergency red reserved | lino, grating | painted block | lino, metal |

- Kits 6 and 7 stay free for the parked pool rooms and chaos, or for other characters (item 74).
- A kit's surface look (patterns, then textures) is D653's step 2, and phase 3 (D660). This table only names them.

## 12. Build order (for B and C)

proposed: one biome per landing, each with:
- its numbers, and new fields only where named here (`depth`, `voids`, `chapter`, the hospital id, the acoustic row);
- a capture set per biome (`force_biome`);
- the generator's determinism suite and the chase suites green.

**The order:**
1. **The school.** It needs no new fields: numbers only, the closest to the hotel's proof.
2. **The hospital.** It adds one id.
3. **The mall.** It leans hardest on atria and wells.
4. **The facility.** It adds `voids` and the downward weighting.
5. **Depth and chapter.** Last, once there is more than one far biome to bring closer.

The apartment changes only `door_rate`, with the school.

## NOT verified

- **Every proposed number is untested.** They come from the code's existing ranges (`DialSpec`, the hotel's proof), not from a
  run. The walk proof and the chasers' speed model decide whether each holds.
- **The psyche readings are mine,** offered for him to correct. Only the frame is his (26, 46-47).
- **The designed pieces are shapes only.** The story's facts are his GAP.
- **The hospital id, `depth`, `voids` and `chapter` are proposed code changes.** None is built.
