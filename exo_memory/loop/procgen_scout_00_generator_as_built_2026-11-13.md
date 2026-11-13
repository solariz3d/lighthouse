# Procgen scout 00: the generator as built (2026-11-13)

Read at game repo commit 04f3882 (main). Read: every file of gen/src and gen/tests, gen/README.md, gen/CHANGES.md, docs/BIOMES.md, docs/ARCHITECTURE.md, HANDOFF.md, the ten room hand-backs and the biomes brief named in the task, and the two branch diffs. Nothing was built or run. Paths are in the game repo unless they start with exo_memory. Marks: [code] file:line, [read] opened source, [inferred] my reasoning, [ours] proposal.

## 1. The pipeline, stage by stage

Every decision is hash(seed, salt, coordinates); no stage reads time or order, and each memoises a pure function [code gen/src/gen_impl.h:13-42, 59-89]. Layers read only the ones above them [code gen/src/gen.h:9-10; gen/README.md "The claim order"].

| # | stage | decides | from | function [code] |
|---|---|---|---|---|
| 1 | biome | which of 4 defined biomes owns a 24x24-cell, 8-storey region | seed, 3D value noise (lattice 4.1 regions a step), distance from origin; the 4 regions at the origin are always apartment | biome.cpp:214 biome(), :194 biome_field() |
| 2 | atria | one site per region: exists, footprint 4..9 cells, 2..5 storeys, gallery ring | big_space_rate x biome big_spaces, TemplateSet | layout.cpp:23 atrium(), :51 atrium_at() |
| 3 | junctions | per 2x2-junction region: stair spans of 3..6 storeys, which of 4 junctions holds the flight, its kind; shaft or light-well spans of 2..5; reprieve-duct candidates | vertical_link_density, biome templates, atria | layout.cpp:70 junction() |
| 4 | lanes | one column lane and one row lane per 6-cell band, offset 1..3 chosen once per lane_segment, optional +1 width | biome LayoutRules; pinned to offset 1 beside any active junction | layout.cpp:176 col_off(), :189 row_off(), :195 col_span(), :202 row_span() |
| 5 | cuts, passage candidates | cross corridors through mass between lanes; reserved reprieve rows | loop_density x loops; reprieve_rate | layout.cpp:214 row_site(), :231 col_cut() |
| 6 | claim | first match wins: atrium, junction link, lane, cut, reserved | stages 2 to 5 | layout.cpp:240 pre() |
| 7 | blocks | per 6x6 block per storey: gate (room or mass), character (bay, sealed, doors), pieces, exits, dead ends, blind corridors, ledges, split levels, ramps, ceilings | block_open, bay, sealed and door rates, dead_end_rate, split and ramp shares | layout.cpp:318 block() |
| 8 | cell | kind, flags, ceiling, raise; the void overlay turns a lane stretch into Abyss; kept reprieves become Reprieve | stages 6, 7; voids.cpp; graph.cpp site_kept | layout.cpp:597 cell_base(), :695 cell(); voids.cpp:96 void_site(), :123 void_run_at() |
| 9 | edge | the one function that decides every wall, door, rail and opening between two cells | both cells | layout.cpp:724 edge() |
| 10 | graph | nodes and typed edges, enumerated from the layout, never stored | cells, edges | graph_walk.h:40 slots_of(), :55 edges_from(); graph.cpp:23 node_pos() |
| 11 | reprieve measure | a candidate is kept only if the hunter's way round (Dijkstra in a window, base graph, no reprieves) is at least 5 s | graph | graph.cpp:77 detour_seconds(), :122 duct_site(), :145 row_rep_site(), :167 site_of() |
| 12 | spawn | lane cell nearest the origin, lowest storey, with mass behind one wall (the home door), 2+ ways on, a way up and down within 20 s | base graph | graph.cpp:223 spawn(), :266 home_door() |
| 13 | emit | boxes and wedges: merged slabs, walls, door pieces, steps, ledges, ladders, lamps in lit pools, regions, traversals, false doors | all above | emit.cpp:170 generate(); lit_field :28; lamps :545-590; regions :611-657 |
| 14 | measure | connectivity, cycle rank, dead ends by bridges, detours, lit share | chunk graphs | measure.cpp:129 measure(), plan_stats :203 |
| 15 | walk proof | the real controller attempts every edge | chunks loaded in sim | walk_proof.cpp:266 prove_block() |

Void sizing is the one place the body feeds the world: void_size(kBaseMove) gives 3 cells (6.57 m) [code voids.cpp:30; gen/README.md "Voids"].

## 2. The vocabulary today

| kind | what exists | dial |
|---|---|---|
| cell kinds (13) | Solid, Lane, Cut, Room, Landing, Stair, Shaft, Well, Hall, Void, Ledge, Reprieve, Abyss [code gen.h:274-288] | |
| cell flags | 8 of 8 bits used: floor, cul-de-sac, grand, reserved, blind, mezzanine, raised, ramp [code gen.h:291-300] | |
| edge kinds (10) | None, Air, Open, Wall, Door, Threshold, Rail, HighDoor, ReprieveDoor, HomeDoor [code gen.h:313-324] | |
| edge types (7) | Walk, Stairs, Ladder, Climb, Drop, Reprieve, WallRun [code gen.h:339-348] | |
| links | Straight (2.8..5.6 m wide), Switchback (two 1.35 m halves), Spiral (0.98 m, one cell), Shaft (ladder), LightWell, Duct (a Park) | stair_width 4.2; switchback_share 0.5, spiral_share 0.2; shaft_rate 0.3, well_share 0.4; vertical_link_density 0.85 |
| stairs | every flight starts at the south landing and climbs north [code layout.cpp:741-751; emit.cpp:81-101] | |
| rooms | block pieces; bay, sealed or doors; grand (3.2 m, open); merged across blocks; partitioned; dead end with one door; blind corridor (2-4 cells); climb-out ledge (1.3 m); split level (0.7 m, steps or ramp) | block_open, merge, partition, bay_share, sealed_share, door_rate, door_stride, grand_share, dead_end_rate, blind_share, climb_out_share, split_share, ramp_share |
| big spaces | one rectangular atrium with balconies, bridges and an optional one-cell gallery ring | big_space_rate, atrium_min/max, atrium_storeys, mezzanine_share |
| voids | 3-cell floorless corridor between mass flanks, crossed by wall-run; one candidate per lane per 12 cells at a fixed phase [code voids.cpp:99-103] | void_rate 0.2 |
| Parks (code: reprieves) | a one-storey ladder duct (Duct) or a one-storey passage through mass (RepRow); kept if the hunter's way round is 5 s or more | reprieve_rate 0.06, reprieve_min_detour_s 5 |
| doors | frame doorway 1.2 x 2.1 m, no leaf; Threshold at a biome seam; HighDoor onto a ledge; ReprieveDoor; HomeDoor with a leaf (spawn only); FalseDoor (drawn only) | door_rate 0.25, door_stride, false_doors (apartment 0.01) |
| light | lamps weighted by place, pooled by a field on an 18 m lattice, some dead | lamp_density, lamps, lamp_dark/bright, lamp_dead (apartment 0.2) |
| biomes | apartment, hotel, school, hospital defined; facility, mall, pool rooms, chaos are names with weight 0, never chosen [code biome.cpp:45-187, :232] | |

All four biomes run the same code and differ only in numbers [code gen.h:149; biome.cpp:48-178]. Ceilings come from lists of 1 to 3 values [code gen.h:163-168]. Slide, dive and wall-kick have no piece, and nothing is tagged kSurfaceWallRun or kSurfaceSlide [code: no hit in gen/src/*.cpp; gen/README.md "What is not here yet"].

## 3. What is guaranteed, and how it is proved

| guarantee | proof |
|---|---|
| a chunk equals itself in any order and on any thread; faces agree; no end in any direction | layout_tests.cpp:52, :100, :115, :169 |
| geometry is sound: no thin or overlapping solid, triangles face out, a body fits at every node and along every walk, stair and ramp edge | geometry_tests.cpp:79, :123, :154 |
| every graph edge is doable by the real controller from a standing start, 6 s allowed: 12 seeds default world, 8 school, 8 hospital, 12 with rare pieces common; the proof fails when the body is made wrong | walk_tests.cpp:59-159; walk_proof.cpp:266 |
| every void is crossed by wall-run by the base body and two others, and by none without wall-run | walk_tests.cpp:229-262 |
| chaser-connected share at least 0.975 and player-connected at least 0.99 a seed, with loops, dead ends, stairs and lamps in bands, 200 seeds | dial_tests.cpp:75; bands exist for apartment and hotel only [code dial_tests.cpp:37-42], not school or hospital |
| every kept Park has a detour of 5 s or more, also on a much larger joined graph | dial_tests.cpp:212 |
| the spawn obeys its rule over 200 seeds | layout_tests.cpp:456 |
| one seed is one world whatever the player's upgrades | walk_tests.cpp:309 |
| no void kill box holds a floor a body stands on; the wide well leaves no shaft beside its flight | void_tests.cpp:138; stair_tests.cpp:151 |

The drop harness is in flight on origin/l189-drops 260553b: it steps off and drops onto every node and counts falls deeper than one storey that are not designed voids. On pre-L175 main it found 229, all straight-well Stair cells; the run on current main is not done [read exo_memory/handback/p-l189-drops-C_2026-11-12.md:68-104; code drop_tests.cpp on that branch].

Limit that matters for intent: the proof attempts single edges from a standing start. It never checks a multi-edge line taken at speed, a line of sight, or a rhythm [inferred from walk_proof.cpp:266-343].

## 4. Where the sameness comes from

His words: "way too repetitive" [his 91, 179]. The room measured his 450 s run: 94% corridor, 2 rooms in 90 samples, median straight 49 cells (about 147 m), no exact repeat of any 7x7 layout, a biome change about every 26 s that did not read as one [read exo_memory/handback/p-d665-gen-data-B_2026-11-11.md:34-41, :64-66]. So the sameness is stationarity, not copies.

1. **A fixed lattice, always.** Every 18 m band has exactly one column lane and one row lane; a lane takes only 3 positions; junctions sit on the same 6-cell grid [code layout.cpp:176-207; gen_impl.h:238-250]. There is no plaza, spine, district, diagonal or curve: all geometry is axis-aligned boxes plus ramps [code gen.h:381-392].
2. **Independent sampling, no larger structure.** Lane offset per segment, block gate per block per storey, cut per row and column, atrium per region, void per window are each a separate hash [code layout.cpp:186, :192, :331, :218, :234; voids.cpp:103]. A long run is therefore a stationary stream. The only slow fields are the biome field and lit_field [code biome.cpp:194; emit.cpp:28]; the apartment's thinning with distance is the only distance rule [code biome.cpp:227-233].
3. **Rooms have no purpose.** A room is whatever of a 6x6 block the lanes leave over; its interior is empty; a lobby, classroom or ward is a ceiling number and a door spacing, not a piece [code layout.cpp:318-587; gen/README.md "What is not here yet"].
4. **Biomes share one skeleton.** Numbers only; the field takes biomes in id order (apartment, hotel, school, hospital), so neighbours are mostly adjacent ids [inferred from biome.cpp:236-242]; a change inside a long corridor reads as nothing.
5. **Vertical events are periodic.** One stair per 36 m square per 3..6 storeys, on 4 fixed junctions, one orientation, stacked columns [code layout.cpp:70-103; gen_impl.h:238].
6. **Few verbs have a place.** Of vault, climb, slide, dive, wall-kick, wall-run, ladder, drop, five have pieces, and the wall-run piece is about 8 voids in 44,000 floor cells and absent from school and hospital [read gen/README.md Dials table; exo_memory/handback/p-d665-straights-B_2026-11-11.md:54-58].
7. **Variety work so far was numbers.** Shorter straights moved the median straight from 27 to 23 cells but rooms fell from 10% to 7%, failing its own check [read p-d665-straights-B_2026-11-11.md:29-41].
8. **Nothing is authored.** No landmark, designed piece or prop exists in gen/src [code: grep]. The designed pieces in docs/BIOMES.md section 2 are shapes only [read docs/BIOMES.md:58-61].

## 5. Intent hooks

| hook | file:function | what it already gives | how intent could attach |
|---|---|---|---|
| layer order | layout.cpp:240 pre() | a fixed claim order; one precedent of a higher layer pinning a lower (lane pinned to a junction, :179-183) | an intent layer must sit above lanes so lanes can read it [inferred] |
| lane field | layout.cpp:176 col_off(), :189 row_off() | an offset per segment | read a low-frequency or route field instead of an independent hash [ours] |
| junction | layout.cpp:70 junction() | link kinds stack; the Chute branch added one with salts appended last | a place for new vertical or event pieces |
| block pieces | layout.cpp:318 block() | pieces with an exit list and a character | pass-through rooms and designed templates; E's lever 2 [read p-d665-variety-E_2026-11-11.md:51] |
| edge | layout.cpp:724 edge() | one decision for every opening, read by emit and graph | new edge kinds: gates, crawl-throughs [ours] |
| measure then keep | graph.cpp:77 detour_seconds(), RepSite | a candidate kept only if a measured route property holds | keep a loop, lead or chase line only if measured [ours] |
| biome field | biome.cpp:214 biome() | home regions by coordinate; per-biome numbers | depth, chapter, contrast [read docs/BIOMES.md:282-298] |
| spawn, home door | graph.cpp:223 spawn(), :266 home_door() | the one authored place | an opening route; kClearOfSpawn already keeps voids away (voids.cpp:26) |
| regions, traversals | emit.cpp:611-657; core/scene.h:105-108 | semantic boxes the game and nav read | landmark, hot-zone, prop-slot regions [ours] |
| lit_field | emit.cpp:28 | a mood field over 18 m | mood fields per region, E's lever 3 |
| void site | voids.cpp:96 void_site() | sizing by MoveReach, candidates on a 12-cell phase | other verb pieces sized the same way [ours] |
| capacity | gen.h:291-300; graph.cpp:20 pack() | cell flags are full; node slot 7 is free; memo keys hold 21 bits | widen Cell::flags before any new flag [inferred] |

## 6. What the unmerged branches add

Step 1 (shorter, jogging straights) is already on main as 277361f [code gen/src/biome.cpp:81, :116, :154]. origin/d665-variety-b (151aead) adds steps 2 and 3 above it. origin/d665-creep-b (868c6e1) adds step 4 in chase/ only; its diff touches no gen/ file [code git diff 151aead origin/d665-creep-b --stat].

- **Step 2** [code gen.h HunterModel on the branch]: the generator's hunter becomes the chase's (8.96, 6.272, 1.5, 1.6) and path_factor 0.835 scales every way round; generator over mesh went 1.79 to 1.34, then median 1.00 [read exo_memory/handback/p-d665-parks-rated-B_2026-11-11.md:19-31, :89-101].
- **Step 3**: a Park is kept if the hunter's way round minus the player's crossing at kBaseMove is at least 5 s (graph.cpp judge, crossing_seconds). New LinkKind::Chute: a one-way fall down a junction column, 1 to 7 storeys on a 0.7 then 0.35 chance curve, optionally followed by a run along a cut line; kEdgeChute; four new salts; ReprieveRecord gains chute, run, storeys, crossing_s [code git diff 2d72bd2 151aead]. Measured on the branch: horizontal Parks buy under 3 s at 0 of 891 sites, so the kit is vertical; Parks per chunk apartment 0.159, hotel 0.188; 86 chutes, 18 with a run; commonest shape 43% [read same hand-back :119-133, :182-199]. Turns and luck-sealed pieces are not built [read :174, :171].
- **Not landed**: two red rows (chase sprinter margin; nav way-back at 22.9% against a 20% bound); steps 2 and 3 land together by ruling; the branch is not rebased [read :186-189, :255-256]. A dry-run git merge-tree shows 7 files changed on both sides, among them gen/src/emit.cpp [code].
- **Step 4**: partial; the erosion creep (15 s hold, front at 3 m/s) in chase/run.cpp and dials.h [read :280-284].
- A chute of 3 or more storeys may leave the hunter off its nav window (3 of 21 Parks; cause inferred, check not run) [read :261-267].

## 7. Not verified

- Nothing was built or run; every figure from README, CHANGES and hand-backs is quoted, not re-derived.
- gen/tools (dz-gen) was not read, and test bodies beyond headers and the rows quoted were skimmed, not read in full.
- Section 4 causes 2 and 4 are [inferred] from code; no repetition metric was computed.
- Branch diffs were read for gen/ only; the chase changes were not reviewed.
- gen/README.md figures (48% storey agreement, 8 voids in 44,000 cells) were not re-run.
