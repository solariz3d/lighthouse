# Procgen scout 01: routes with intent first, geometry second (2026-11-13)

Game repo read at commit 04f3882 (main). Marks: [read] opened and read, [code] file:line, [inferred] my reasoning, [ours] a proposal. Nothing was built or run. "Scout 00" is `loop/procgen_scout_00_generator_as_built_2026-11-13.md`.

## 1. What the sources do

| source | what it does | mark |
|---|---|---|
| Dormans, "Adventures in Level Design" (PCG 2010), pcgworkshop.com/archive/dormans2010adventures.pdf (ACM classroom-copy notice only) | A level is a mission and a space, made in two passes. A graph grammar makes the mission (tasks, challenges, rewards). A shape grammar builds the space from it. Each space rule is tied to one mission symbol; the builder picks a rule by weight and a place by fitness, and remembers which mission symbol each piece serves. Two edge types: a tight one means "must sit behind", a loose one means "anywhere". A step joins two open connections that are close and aligned (this makes loops), and open connections can be closed so the goal does not short-circuit onto the entrance. Rule weights can change during generation, giving rising difficulty or "registers". | [read] sections 4 to 7 |
| Dormans, "Level Design as Model Transformation" (2011), pcgworkshop.com/archive/dormans2011design.pdf | Lock and key as rewrite rules: two rules turn a linear task list into a branching one; others move a lock forward or let a key pull tasks from behind a lock. Size is fixed by the length of the starting mission. No rule removes the node after a lock, so every task is needed and no deadlock arises. Shape grammars struggle when several paths converge on one goal, so the graph is laid on a 2D grid instead. | [read] section 4 |
| Boris the Brave, "Dungeon Generation in Unexplored" (2021), boristhebrave.com/2021/04/10/dungeon-generation-in-unexplored/ | Each level is a 5x5 grid of graph nodes that is never moved, only annotated. First a start, a goal and a rough loop between them. One of 24 "major cycle" types decides how the two arcs differ (keys, doors, one-way "valves"). Minor cycles are added as detours. Nodes stay abstract until late passes turn them into rooms. A lock and key is a placeholder that can be a key, a switch or knowledge, hard or soft. About 5000 find-replace rules; he says much of the variety is "a ton of different manually coded cases". | [read] raw page text checked |
| Brogue CE `src/brogue/Architect.c` (AGPL-3.0, LICENSE.txt read) | Rooms accrete into a tree. `addLoops` (:340-390) visits wall tiles in shuffled order and opens a doorway only where floor lies on both sides and the Dijkstra distance between the flanks exceeds a minimum (called with 10 at :836 and 20 at :2904). | [read] code |
| Boris the Brave, "Dungeon Generation in Enter the Gungeon" (2019) | A hand-authored flow graph per stage (a tree plus extra edges for loops). "Node injection" adds shops or secrets, each with a type, a target, a spawn chance and preconditions; secret rooms mostly at dead ends, 1 in 5 on any room. Rooms are then chosen per node. | [read] through a page summariser, not checked against the raw page |
| Bénard, Dead Cells level design, deepnight.net/tutorial/the-level-design-of-dead-cells-a-hybrid-approach/ | A hand-made concept graph per biome (entrance and exit, then special rooms, then in-between). Each node takes a random room from the biome pool that matches its entrance count and purpose. Pure procedural levels felt "illogical, chaotic". | [read] through a page summariser |
| Spelunky solution path, tinysubversions.com/spelunkyGen | A random walk over a 4x4 grid fixes a guaranteed path; the rest is filled randomly. | [read] through a page summariser |

Common shape: draw the route first as an abstract graph with no positions, then realise it. Unexplored and Dead Cells both keep the grid or graph fixed and let rules annotate it.

## 2. What it would give a run in this game

His words: [his 179] the generator is "way too repetitive" and needs "cool pathways with intent mixed into the randomness", serving "all of the ideas we have already". [his 91] "way too repetitive over time". [his 7] the rare escape where "the entity has to route around". [his 8] "a shortcut to create distance" and "a YES lets go moment". [his 26] "designed areas with meaning".

| his want | what a district cycle would do | mark |
|---|---|---|
| intent in the route [his 179] | Each 24-cell district gets one major cycle template, so a run crosses a chosen shape (boulevard with ribs, ring, hub, gauntlet) and not an even lattice. Scale above 18 m appears for the first time. | [ours] |
| the escape [his 7, 8] | A Park or void becomes the short arc of a cycle whose long arc is a real lane the hunter must walk. Today a Park is a random candidate that is measured afterwards. | [ours] |
| designed areas [his 26] | A landmark is a node injected with a type, target and preconditions (Gungeon), realised by a template. | [ours] |
| more chaotic with chapters (design doc section 9, decided 28) | Rule weights shift with depth or chapter, as Dormans' dynamic weights do. | [ours] |

Honest limit [inferred]: our lattice is already loop-saturated, with 12 to 26 loops per chunk by the tested bands (scout 00 section 3). Cycles are not scarce here; distinguished cycles are. So the technique's use is to make some lanes differ (straight and wide, gated, absent) and to put the loops that matter where measured, not to add loops. Nothing here has been measured against his sameness complaint.

## 3. Where it attaches in our generator

| new piece | attach point | mark |
|---|---|---|
| District graph: pure, memoised, a function of (seed, district coordinates). Footprint equals one biome region (24 cells, 4 bands, 8 storeys); nodes are the 4x4 band crossings per storey. Memo as in `pre_memo`. | `gen/src/gen.h:33-34` (region size), `gen/src/gen_impl.h:13-42, 59-89` (memo, salts), new `gen/src/intent.cpp` | [code] + [ours] |
| Portals on a shared district face come from a hash of the face coordinates, so both sides agree without seeing each other. | pattern of `gen/tests/layout_tests.cpp:100-137` | [ours] |
| Spine: a chosen run keeps one lane offset and the wide flag across the district instead of the independent per-segment hash. | `gen/src/layout.cpp:176 col_off()`, `:189 row_off()`; precedent for a higher layer pinning a lane at `:179-183` | [code] |
| Thinning: a demoted lane stretch is not claimed as lane. | `gen/src/layout.cpp:240 pre()` claim order | [code] |
| Gated arc: a void whose place the intent graph chooses, replacing the independent hash. | `gen/src/voids.cpp:96 void_site()`, hash at `:103`; window `kWindow` 12 cells at `:25` | [code] |
| Keep rule: a cycle is kept only if the hunter's way round beats the player's crossing by the dial (Brogue's `addLoops` test, in our units). Locks against the hunter already exist: `hunter_seconds` returns no route for Climb, WallRun and Reprieve edges. | `gen/src/graph.cpp:67-75`, `:77-120 detour_seconds()`, `judge` on origin/d665-variety-b `graph.cpp:183` | [code] |
| One-way valve: the Chute is already a valve (a fall down a junction column, optional run). | origin/d665-variety-b `gen/src/layout.cpp:143-166`, `:826-842` | [code] |
| Landmark and hot-zone as new Region kinds. | `gen/src/emit.cpp:611-657`, `core/scene.h:105-108` | [code] |
| Template weights by biome and depth. | `gen/src/biome.cpp:214 biome()`, `TemplateSet` in `gen.h` | [code] |

Dormans' mission and space split maps onto "intent layer above lanes" (new) and "lanes, blocks, edge()" (existing). We keep the grid fixed, as Unexplored does, because our lane lattice is already the fixed grid.

## 4. The smallest first build step

Step A changes no cell. Files: `gen/src/gen.h` (a `District` struct), `gen/src/gen_impl.h` (memo and new salts appended after `kSaltFalseDoor`, so no earlier salt moves), new `gen/src/intent.cpp`, `gen/CMakeLists.txt` (source list and the test list at `:66-69`), new `gen/tests/intent_tests.cpp`. Red before (no symbol), green after:
1. `a_district_graph_is_the_same_in_any_order_and_on_any_thread` (copy of `layout_tests.cpp:52`).
2. `neighbouring_districts_agree_on_their_portals`.
3. `every_district_graph_is_connected_and_no_lock_comes_before_its_key` over 200 seeds (Dormans' invariant).
4. `the_template_mix_over_200_seeds_is_not_one_template` (each of at least 4 templates at least 5%).

Step B, behind a dial `intent_strength`, default 0. Files: `gen/src/layout.cpp` (`col_off`, `row_off`), `gen/src/gen.h` (dial), `gen/tests/dial_tests.cpp`, `gen/tests/layout_tests.cpp`. Red first: `a_spine_lane_runs_straight_for_its_whole_district` (with the dial at 1, one lane per district runs at least 24 cells unjogged; false today because offsets rehash every `lane_segment`). Guard, green before and after: `with_intent_off_every_fingerprint_is_unchanged`. Must stay green: `layout_tests.cpp:52,100,115,169`, the controller walk `walk_tests.cpp:59-159`, the connectivity bands `dial_tests.cpp:75`, the drop harness on origin/l189-drops 260553b.

Step C: one gated arc through `void_site`, kept by `judge`. Red first: `every_intent_void_has_a_walkable_arc_the_hunter_needs_at_least_N_seconds_for`.

Degenerating, named in advance [ours]: if after step B a replay of the 450 s run still gives at least 90% corridor and a median straight of at least 40 cells, the spine did not address the complaint.

## 5. Costs, risks, conflicts

- **Authoring cost.** Unexplored needed about 5000 rules and says the variety is manual cases [read]. Start with about six templates, not a grammar.
- **Seed stability.** Any lane change moves every seed. Recorded runs replay by seed (his 148 replay), so the dial defaults to 0 and the guard test above stands.
- **Lattice guarantees.** Thinning lanes can break "no end in any direction" and the chaser-connected bound 0.975 (`dial_tests.cpp:37-42`). Those bands exist for apartment and hotel only, so school and hospital are unguarded [code].
- **Detour measure.** B measured the hunter's real way round at about half the generator's (`handback/p-d665-gen-data-B_2026-11-11.md`, section 2). The keep rule must use the d665-variety-b judge, which is not landed and shares 7 files with main including `emit.cpp` (scout 00 section 6).
- **Proof gap.** The walk proof tries single edges from a standing start. It never proves that an intended line works at speed [inferred, scout 00 section 3]. A template can promise "fun" and nothing here measures it.
- **Runtime non-terminals.** Dormans section 7 replaces placeholders during play. That conflicts with "one seed is one world" (`walk_tests.cpp:309`). Keep placeholders as Region kinds the game reads, never as geometry [inferred].
- **Other families.** Noise fields and designed pieces also write `col_off` and `block()`. One intent layer should own the `pre()` claim order; others read it.

## 6. Not read

- Dormans and Bakkes, "Generating Missions and Spaces for Adaptable Play Experiences" (IEEE TCIAIG 2011): only the title was seen.
- Dormans, "Mission Space" (CIG 2010): cited by the 2010 paper, not opened.
- Sersa Victory's cyclic generation PDF (itch.io): page only; no licence shown; the PDF was not opened.
- Dormans' talks, the Ludoscope and PhantomGrammar documentation, a Brogue loops post: not found or not opened.
- Gungeon, Dead Cells and Spelunky pages were read through a page summariser; raw text was not checked. Kazemi's room-template page was not opened.
- `tools/dz-gen` in the game repo and the test bodies were not read in full; no figure was re-run.

## Verification (second reader, 2026-11-13)

Game repo read at 04f3882 (main, confirmed); brief read at exo_memory/briefs/dreamzone2_the_game.md.

- ok: [his 179] "way too repetitive", "cool pathways with intent mixed into the randomness", "all of the ideas we have already" are in item 179 (brief :1203; the "all of the ideas" words are inside a longer sentence "target as much as we can with all of the ideas we have already").
- ok: [his 91] "way too repetitive over time" is in item 91 (brief :748).
- ok: [his 7] "the entity has to route around" is in item 7 (brief :37).
- ok: [his 8] "a shortcut to create distance" and "a YES lets go moment" are in item 8 (brief :39, :44).
- ok: [his 26] "designed areas with meaning" is in item 26 (brief :166).
- ok: [his 148] item 148 (brief :1089) is about a run and its replay; the doc uses it only as "recorded runs replay by seed", which is a paraphrase, not a quote.
- ok: gen/src/gen.h:33-34 kBiomeCells 24, kBiomeStoreys 8.
- ok: gen/src/layout.cpp:176 col_off, :189 row_off, :179-183 pins lane to offset 1 beside an active junction, :240 pre().
- ok: gen/src/voids.cpp:25 kWindow = 2*kBand (12 cells), :96 void_site, :103 hash.
- ok: gen/src/graph.cpp:67-75 hunter_seconds (negative for default: Climb, WallRun, Reprieve per gen.h:339-347), :77 detour_seconds.
- ok: gen/src/biome.cpp:214 biome(); gen/CMakeLists.txt:64-70 test list; gen/src/gen_impl.h:13-42 salts with kSaltFalseDoor last at :41; Memo class at :59-89, pre_memo at :156.
- ok: gen/tests/layout_tests.cpp:52, :100, :115, :169 each open the test named; walk_tests.cpp:59, :309 (one_seed_is_the_same_world...); core/scene.h:105-108 Region kinds; emit.cpp:611 void region comment.
- ok: origin/d665-variety-b graph.cpp:183 is judge(); layout.cpp:143-146 chute comment, :826-828 chute_run edge; origin/l189-drops is 260553b.
- ok: dial_tests.cpp:37-43 has bands for apartment and hotel only, chaser_connected lower bound 0.975.
- WRONG: section 2 "12 to 26 loops per chunk by the tested bands". dial_tests.cpp:39 gives apartment 12 to 26, :42 gives hotel 18 to 36, so the range is 12 to 36.
- WRONG (likely): section 5 "shares 7 files with main". git diff --name-only from merge-base 955c4e1 to each of main and origin/d665-variety-b overlaps in 9 files (CHANGELOG.md, chase/tests/proof_tests.cpp, chase/tests/speed_tests.cpp, chase/tools/dz-chase/main.cpp, gen/src/biome.cpp, gen/src/emit.cpp, gen/tests/dial_tests.cpp, gen/tests/layout_tests.cpp, gen/tests/void_tests.cpp). The claim is carried from scout 00 section 6, not re-derived; emit.cpp is in the overlap as claimed.
- ok: Boris the Brave, Unexplored page (re-fetched): 5x5 grid, 24 cycle types, "about 5000 individual find-replace rules", "a ton of different manually coded cases".
- ok: Brogue Architect.c (re-fetched raw): addLoops at :340, calls addLoops(grid, 10) at :836 and addLoops(grid, 20) at :2904; flank test and Dijkstra distance as described; LICENSE.txt is AGPL v3. The :340-390 end line was not checked.
- ok: Dormans 2010 PDF (downloaded and text-extracted): tight (double edge, "must be placed behind") vs loose coupling, rule choice by relative weight and place by fitness, reconnect step that makes loops, dynamic rule weights; ACM "personal or classroom use" notice present. Not checked: the "open connections can be closed so the goal does not short-circuit" sentence beyond line 88; section numbers 4 to 7.
- ok: Dormans 2011 PDF: ACM classroom notice; size dictated by starting length (:62); deadlock remark (:45); shape grammars struggle with converging paths, hence 2D grid (:63). could not check: the exact sentence "no rule removes the node after a lock".
- ok: Gungeon page (re-fetched raw): secret rooms mostly at dead ends, 1/5 chance on any room. could not check: node-injection fields (type, target, spawn chance, preconditions) against the raw page.
- ok: Dead Cells page (re-fetched raw): "illogical, chaotic" present. could not check: "random room matching entrance count" detail.
- could not check: Spelunky page (not re-opened); Dormans 2010 "Section 4 to 7" numbering.
- ok: item (d): nothing marked [read] is from memory; the summariser-read sources are labelled as such and the doc lists them under Not read.

Totals: 29 checked, 24 ok, 2 WRONG, 3 could not check (quotes 6/6 ok, code 12+ ok, outside sources 6 re-opened).
