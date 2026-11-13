# Build path: the world (world_gen), 2026-11-13

Game repo read at commit 04f3882 (checked-out main); origin main is e0184ea, ahead by chase and L190 work. Marks: [read] opened source; [code] file:line in the game repo; [inferred] my reasoning; [ours] a proposal. His words: `briefs/dreamzone2_the_game.md`, cited as [his N]. Techniques are in `loop/procgen_scout_*`. Nothing was built or run.

## 1. His words

| item | what he asked | later word |
|---|---|---|
| 1, 5 | nextbot run "out maneuvered through skill and finesse" through a generated world; rewrite keeping the generator and the raytraced light | |
| 4 | "more verticality beyond 3 layers and simple rectangular rooms" | no one has scheduled non-rectangular rooms |
| 6 | biomes: apartment that grows, hotel, facility, mall, pool rooms, chaos, school; "the key point is liminal spaces" | 26 replaces the list (below) |
| 7 | open world; "there has to be dead ends eventually"; on foot first, parkour the rare escape | |
| 8, 11 | the Park: "a short transient period of safety", rare, "a YES lets go moment"; "I LOVE the safe zones", the drop-in one | 95 names it the Park |
| 14 | wall-running "rare and short"; floors may be "a stylized void or error in space" | |
| 17 | stairwell "could be a bit wider" | |
| 26 | biomes are "different manifestations of the space from the player characters psyche": apartment, facility, mall, hospital, school, perhaps hotel; "real pieces to be imbeded into the seeds, like designed areas with meaning"; an "exceedingly rare" outside, "a door to a liminal outside neighborhood, or a unnatural green looking hill" | supersedes 6's list |
| 28 | chapters: "the seeds get more chaotic and the further biomes become closer to reach" | |
| 29 | a very rare noclip shows a "beautifully dark and ominous void" behind the walls | |
| 36 | "more places should be lit", first biome most | |
| 54-56 | the Park erodes "hell red and screaming", then becomes ordinary space, clock from first entry | 125 makes it 15 s and a creep |
| 74 | later, each character's psyche gets its own biome set | |
| 80 | "remove map, you shouldnt have or need one" | landed e656a9c [code git log] |
| 82 | order: biome design, then bodies, then "textures and objects that spawn in the proc gen look good and aware to their surroundings" | |
| 89 | loves the start biome; "sometimes there are too many doors" | |
| 91 | "the proc gen does get way too repetitive over time" after 450 s | 179 repeats it |
| 93, 94 | Parks from curated pieces "mirrored and interchangably linked", some tied to long hallways, "less chance after like 4 pieces plus" | 124 drops luck-for-length |
| 124 | "keep the luck to the chests"; no sealed Park pieces | supersedes 94's luck clause |
| 125 | "lets do 15 seconds" (creep from the entry) | supersedes 54's 10 s |
| 126, 148, 149 | bugs: a void death on "a normal floor"; a wooden door like the spawn door (a false door); a fall beside wide stairs | fixed or open, section 2 |
| 179 | "cool pathways with intent mixed into the randomness"; target all existing ideas | |

Item 170 (father dies an ordinary death, not murder) supersedes item 46 for every designed piece [read brief:1156].

## 2. What exists today

[code] on 04f3882:
- 15-stage pure pipeline, one hash per decision; biomes are data only (`gen/src/gen.h:149`, `gen/src/biome.cpp:45-187`). Chunk 12x12 cells x 2 storeys; region 24x24x8 (`gen.h:33-34`).
- Four defined biomes: apartment, hotel, school (`biome.cpp:116`), hospital (`:154`). Facility, mall, pool rooms, chaos are names with weight 0 (`biome.cpp:181-185`). Field lattice 4.1 regions (`biome.cpp:194-212`); home regions always apartment (`:222`).
- Step 1 of D665 is on main: straights jog (hotel 16, school 12, hospital 14) (`biome.cpp:81,116,154`).
- Voids: `void_rate` 0.2, sized from `kBaseMove` (`gen.h:138`, `voids.cpp:96`); sprint peak 8.75 (`gen.h:108`).
- Doors: apartment `door_rate` 0.25, `false_doors` 0.01 (`biome.cpp:69,72`); false door is drawn only (`emit.cpp:347-368`); the real spawn door exists within 16 cells of origin (`layout.cpp:729-731`).
- Parks: ladder duct or one-storey passage, kept at a 5 s way round (`gen.h:73-74,406`; `gen/README.md:182`). Wide stairs 4.2 m for straight flights only; L175 floor slab beside them (`gen/CHANGES.md:5-17`).
- No outside, no noclip void, no designed piece, no prop pass [code: no hit in `gen/src`].

Branches [code git log]:
- `origin/d665-variety-b` 151aead: steps 2+3 (true hunter model, path factor 0.835, vertical Park kit with chutes, bot takes chutes). Not on main.
- `origin/d665-creep-b` 868c6e1: step 4 partial (hold 15 s, 3 m/s front). Green not run.
- `origin/l189-drops` 260553b: drop harness; red on 0389b0a found 229 drops, all the wide-well strip [read p-l189-drops-C:62-70, :89].

## 3. What the room already knows

- His 450 s run: corridor 94%, rooms 2 of 90 samples, median straight 49 cells, no repeated 7x7 layout [read p-d665-gen-data-B:39-41]. So the sameness is one kind of place, not repeats (inferred there).
- Step 1 cut hotel/school/hospital straights but V1 failed: rooms 7% against a 10% floor [read p-d665-straights-B:40]. E named the unwelcome outcome: shapes pass and he still says repetitive, so the cause is looks (`p-d665-variety-E:34`).
- Only vertical Parks pay in this grid: 0 of 891 one-storey sites buy 3 s (lanes every 18 m); chutes pay best [read p-d665-parks-rated-B:131-134, table at :115-124].
- Open at the wind-down: chutes of 3-4 storeys leave the hunter's mesh window (`nav_radius_v = 1`); check (1) not run [read p-d665-parks-rated-B:261]. Red rows owned by others: nav way-there row 22.9% against 20%, chase sprinter row (`:197-199`).
- Voids almost only occur in apartment and hotel; school and hospital hold none [read p-d665-straights-B:57]. A raised top speed makes voids vanish unless sizing is kept at `kBaseMove` (`p-l161-gen-B:38`).
- Void kill box used to reach 3 storeys below a void (his 126); fixed b2231b5 [read p-d671-void-B:25].
- A floor takes the room above's material; the lower ceiling shows the upper slab [read p-d658-floor-B:24]. Doorways: most are the two guaranteed per room, so door_rate moves 3-4% per 0.05 (`:39`).
- Outside: keep it empty, rare, no chaser, unnumbered; designed pieces carry lore, procedural rooms carry dread [read p-l161-backrooms-E:72-82].
- Textures: CC0 maps by world position; a furnishing pass decided from a canonical room anchor, drawn only at first [read p-d660-surfaces-C:13]. Apartment textures landed b212ae8.
- Biome field: each new biome narrows patches; the lattice grew 2.5 to 4.1 to hold a 70% bar [read p-d658-hospital-B:46-57; biome.cpp:196-203].
- Unread or unresearched: how the Park room piece reads; whether other drop classes remain after L175 (L189 not run on current main); band tests exist for apartment and hotel only (`gen/tests/dial_tests.cpp:37-41`); no measured look-sameness; non-rectangular rooms; outside terrain.

## 4. Contradictions and calls that are his

1. **Biome list (6 against 26).** Pool rooms and chaos are parked on the room's reading, not his ruling. (a) Keep parked for other characters (item 74): free. (b) Make chaos the late-chapter global dial, not a biome (item 28's "more chaotic"): cheap, dials only. (c) Build pool rooms as a fifth interior: a kit, a water look, no new code in the generator.
2. **What a Park is for (93 against measurement).** He wants hallway-linked passages; one-storey passages buy about 1 s here. (a) Park shapes are vertical, horizontal pieces only decorate: cheap, matches data. (b) Add a "long hallway" region profile with lanes every 36+ m so a horizontal Park has a long way round: costs lap 4. (c) Accept short Parks and make them places (a lit room, the golden light).
3. **Doors (89, 148).** (a) Leave 0.25: nothing. (b) Cut the two guaranteed doorways per room to one in the apartment: moves every apartment seed, changes the start he loves. (c) Re-skin false doors so they do not match the spawn door: cheap, and answers 148.
4. **Stairs (17).** Only straight flights are wide; switchback and spiral are not [read p-l161-gen-B:59]. Widening them is a redesign. Which did he like?
5. **The outside's rarity (design GAP).** (a) A seed hash, once in N runs. (b) Once a chapter. (c) Only through a designed door in a designed piece. It needs a non-interior generator (heightfield, sky): the largest new stage.
6. **Designed pieces before the story's facts.** (a) Ship shape-only pieces (a kept room, a second coat), no text. (b) Wait for the father's facts. Item 170 removes the murder either way.
7. **Voids in school and hospital (14).** Today none. (a) Accept: rare in the wide-corridor biomes. (b) Add a void-capable corridor type there.
8. **Chapters (28).** How many, and is `chapter` a `GenParams` input (determinism: yes, like the seed)? BIOMES.md §9 proposes 1.0 then 0.75, 0.5, 0.3.
9. **Apartment variety (89 against 91).** Does the variety work apply to the apartment he loves? Default in this path: no, until measured.

## 5. The build path

### Lap 1: yardstick plus the Park kit (he sees chutes of different depth)
- **1a, route profile (read side only).** Files: new `gen/src/route_profile.{h,cpp}`, `gen/CMakeLists.txt`, new `gen/tests/range_tests.cpp`, `gen/tools/dz-gen/main.cpp` (`range`). Red before: the test does not build. Green: a corridor-only line scores corridor 1.0 and a sameness run equal to its window; a line through an atrium scores below 1; same profile in any chunk order and thread. Then record baselines for 04f3882 and 151aead in `gen/CHANGES.md` [per scout 07 section 4].
- **1b, land D665 steps 2+3 (B).** Run B's check (1) (`nav_radius_v` 2 in `chase/streamed.h`); if the -1s remain, cap chutes at 2 storeys by a dial. Rebase on e0184ea, whole suite, both selftests. Rows red on the branch that must be green or owned: `gen_tests` `no_reprieve_has_a_quick_way_round_on_the_assembled_graph`; nav way-there; chase sprinter row.
- **1c, L189 (C).** Rebase `l189-drops`, run on current main, count west-column drops (expect 0), fix each other class in `gen/src/emit.cpp` or `layout.cpp`. Test `gen/tests/drop_tests.cpp`: red on 0389b0a, green on main.
- **1d, creep (B, step 4).** Finish on `d665-creep-b`: eroded space is ordinary for every chaser by either mouth (item 55); the creep rows restated by name.

### Laps 2-6
2. **Rooms and rhythm.** Forced jog (a lane offset changes at every segment) in `layout.cpp:176-193`, test red in `layout_tests.cpp` (scout 06). Then one pass-through hall, `piece_rate` 0.0 by default so no seed moves: `gen.h`, `gen_impl.h` (last salt), `layout.cpp`, new `gen/src/pieces.cpp`, `layout_tests.cpp`, `walk_tests.cpp` (scout 03 section 4). Bar: V1 (rooms at least 10%, corridor at most 80%) on the route profile and the bots.
3. **Region profiles and landmarks.** A per-region discrete profile beside `lit_field` (`emit.cpp:28`): bright, pooled, dark, flicker, cold; one landmark per region as a new region kind in `core/scene.h`. Bar: V3, a landmark every 45 s on the bot routes.
4. **Curated pieces and Park shapes.** One template table with ports; Park pieces entry, run, turn, drop, rise, room, exit, mirrored by hash (his 93). A "long hallway" profile if call 2(b). Length chance 0.7 to 3 pieces then 0.35 (his 94), no luck (his 124). Designed pieces per biome ride the same table (his 26).
5. **Mall, then facility, then depth and chapter** (BIOMES.md section 12). Before each: add band rows for school and hospital in `dial_tests.cpp`, re-check the 70% patch bar at the new lattice. Facility adds a per-biome `voids` scale and downward weight.
6. **The outside and the noclip void.** After calls 5 and 6.

## 6. Connections

| key | world_gen needs | world_gen gives |
|---|---|---|
| run_frame | Park clock on the run's tick; void in overtime saves | Park records, void regions |
| chase_entities | nav window past chutes; eroded space ordinary | long straights, openings, typed walk graph |
| movement | wall-run and slide tags on pieces | voids sized at `kBaseMove` |
| abilities | luck and chest hooks; flashlight | Park room as chest site, noclip void |
| stress | line-of-sight breaks | sightline metrics, Park relief |
| meta_loop | `chapter` input | depth rule, chest sites |
| look_fear | kit textures, void look | lamp moods, Park erosion red |
| sound | acoustic row per biome (`p-d654-audio-C:104-125`) | surface roles, Park scream cue |
| story_lore | piece content, outside rules | designed pieces, psyche biomes |
| frontdoor_onboarding | none | `start_biome` setting |
| tech_foundation | fingerprints, drop harness, loader | one seed one world |
| entity_bodies, player_body, waking_room | none | surface materials, stair width, the spawn door |

## 7. Where it is going

Per-character biome sets (his 74); chaos as a chapter dial; the furnishing pass (his 82); an offline search over dial and profile vectors written to a table (scout 07 technique 4); the endless overtime world; pool rooms for another psyche.

## 8. Not verified

Every shape, rate and bar is [ours] or from the cited hand-backs; V1-V8 figures are B's, not re-derived. L189 has not been run on current main. D665 steps 2+3 were never run whole on a rebase. Items 28, 29 and 36 cover parts that belong to other aspects; none was skipped. The route-profile design is scout 07's, unbuilt.

## Verification (second reader, 2026-11-13)

Opened: briefs/dreamzone2_the_game.md, the game repo at 04f3882 (read-only git and sed), the cited hand-backs, docs/BIOMES.md, scouts 03/06/07.

(a) His words
- ok: every quoted phrase in section 1 is verbatim under the item number given (1, 4, 6, 7, 8, 11, 14, 17, 26, 28, 29, 36, 54, 55, 74, 80, 82, 89, 91, 93, 94, 95, 124, 125, 126, 148, 149, 179), checked by grep and by reading the item blocks. Quotes that cross a line break (4, 8, 14, 17, 26) match once joined.
- ok: item 170 supersedes item 46 (brief:1156-1157; "ordinary death" is on 1156, "Supersedes item 46" on 1157).
- ok: 124 supersedes 94's luck clause (brief:1005-1006); 125 makes it 15 s (brief:1006-1008).
- note: "after 450 s" in the 91 row is not in item 91 (which says "5 mins straight"); 450 s comes from the hand-back, so it is not his word.

(b) [code] citations
- WRONG: header says "origin main is e0184ea, ahead by chase and L190 work". Local refs show the opposite: `git rev-list --left-right --count origin/main...HEAD` gives 0 3, so 04f3882 is 3 commits ahead of origin/main (e0184ea is an ancestor; HEAD adds the L191 arm-shape merge). origin may be stale, but as stated the direction is wrong.
- WRONG (line numbers): "Chunk 12x12 cells x 2 storeys" is gen.h:31-32; gen.h:33-34 is the region (24x24x8). Also `void_rate 0.2` is gen.h:78 (and :97), not :138; gen.h:138 is `kBaseMove` only.
- ok: gen.h:108 sprint_peak_speed 8.75; gen.h:73-74 reprieve_rate 0.06 and reprieve_min_detour_s 5.0; voids.cpp:96 is `void_site`; biome.cpp:69 door_rate 0.25, :72 false_doors 0.01, :81/:116/:154 lane_segment 16/12/14; :194-212 lattice 4.1; :222 home regions; :181-185 facility, mall, pool rooms, chaos are named only (`defined = false` at gen.h:235, so weight is forced to 0 at biome.cpp:232, which is equivalent but not "weight 0" written at those lines).
- ok: emit.cpp:347-368 false door is drawn only (kSurfaceDetail, comment says nothing collides); layout.cpp:729-731 HomeDoor within 16 cells; CHANGES.md:5-17 L175; dial_tests.cpp:37-41 bands only for apartment and hotel (grep finds no school/hospital row in that file); layout.cpp:176-193 col_off/row_off; emit.cpp:28 lit_field; chase/streamed.h:55 nav_radius_v = 1.
- could not check: "15-stage pure pipeline" at gen.h:149. That line is only the "biomes are data" comment; I did not find a stage count in gen.h or gen/README.md.
- ok: branch heads 151aead, 868c6e1, 260553b exist as origin/d665-variety-b, origin/d665-creep-b, origin/l189-drops; e656a9c and b2231b5 and b212ae8 are in main's log; path_factor 0.835 is on 151aead's gen.h:158.

(c) Outside sources: none are cited as [read] in this document (it rests on room files and scouts), so nothing to re-open. docs/BIOMES.md section 9 (1.0 then 0.75, 0.5, 0.3; chapter in GenParams) and section 12 (build order) match the document. Scout 07 sections 4 and technique 4, scout 03 section 4 and scout 06 commit B exist and say what is cited.

(d) [read] from memory
- WRONG: section 2 says l189-drops "found 229 drops, all the wide-well strip [read p-l189-drops-C:62-70, :89]". The hand-back (p-l189-drops-C_2026-11-12.md:71, :85-86) says 229 unintended in two classes (227 sideways along a flight, 2 off a flight's end), and that "all 229 in the west column" is "inferred, not checked" because the run was stopped. :89 is the PAUSED heading. The claim should be marked inferred, and the 229 split is 227 + 2.
- ok: other hand-back citations (gen-data-B:37-41, straights-B:36/:40/:57, variety-E:34, parks-rated-B:131-134/:261/:186-187, l161-gen-B:38/:59, l161-backrooms-E:72-82, hospital-B:46-57, audio-C:104-125) say what is claimed. Minor offsets: door_rate "3 to 4% per 0.05" is p-d658-floor-B:38 not :39; the d671 fix is at p-d671-void-B:51, not :25 (:25 is the registered cause); the 7% V1 figure is straights-B:36 with the verdict at :40.

(e) Coverage: all 30 assigned items (1, 4, 5, 6, 7, 8, 11, 14, 17, 26, 28, 29, 36, 54, 55, 56, 74, 80, 82, 89, 91, 93, 94, 95, 124, 125, 126, 148, 149, 179) appear in section 1 and the document says none were skipped; confirmed. Items 28, 29 and 36 are thin (29 and the outside only reach lap 6).

Totals: 41 checks, 31 ok, 3 WRONG (origin/main direction, gen.h line numbers, l189 "229 all wide-well" marked read), 1 could not check (15-stage pipeline), 6 minor line offsets or notes.
