# Procgen scout 05: believable building interiors and liminal architecture (2026-11-13)

Read at game repo commit 04f3882 (main). Nothing was built or run. Marks: [read] opened and read; [code] file:line in the game repo; [inferred] my reasoning; [ours] a proposal with no source behind it. Generator context: `procgen_scout_00_generator_as_built_2026-11-13.md` (read whole).

## 1. What the sources do

| source | what it does | mark |
|---|---|---|
| Merrell, Schkufza, Koltun, "Computer-Generated Residential Building Layouts" (2010) | Learns a Bayesian network from 120 hand-encoded plans (room type, area, aspect ratio, adjacency, open wall or door), separate networks for one, two and three storeys. Samples an "architectural program", then optimises the plan with a cost that counts missing connections (accessibility), room dimensions, and shape, with halls and stairs exempt from the concavity penalty. Rooms joined by open walls count as one space. One illustrated plan took 35 s; all models "a few seconds to 7 minutes", single-threaded. Failures: about 1 in 20 two-storey and 1 in 5 three-storey runs, "chief cause" stairs and tall rooms that couple floors. https://www.cs.princeton.edu/courses/archive/spring11/cos598A/pdfs/Merrell10a.pdf | [read] |
| Mirahmadi and Shami, "A Novel Algorithm for Real-time Procedural Generation of Building Floor Plans" (arXiv 1211.5842) | A rectangle is cut by a squarified treemap into rooms whose areas are drawn per function (bedroom Uniform(8,18), other rooms Uniform(3,11)). A hierarchy tree becomes a connection graph with random extra edges and forbidden pairs (a bedroom does not open onto the kitchen). Doors go on shared walls. A corridor is built only for a room not adjacent to the living room, by shortest path, minimising its area. Scope: rectangular houses; no timings given. https://arxiv.org/abs/1211.5842 | [read] |
| Dormans, "Adventures in Level Design" (PCGames 2010) | Two stages: a graph grammar writes a mission (keys, locks, obstacles), a shape grammar then builds space for it. A double edge means "tight coupling": the subordinate must sit behind its superior. Rule weights shift with progress ("registers": many traps, then many monsters). After a rule is placed, a step joins two connections that are "in close proximity and in the correct alignment", and open connections can be closed so the end room is not short-circuited. https://pcgworkshop.com/archive/dormans2010adventures.pdf | [read] |
| Ilcik and Wimmer, "Challenges and Ideas in Procedural Modeling of Interiors" (2013, two pages) | Says Merrell's and Lopes's methods stay orthogonal and carry many parameters; floor planning is NP-hard; furniture needs global functional relations; a style can make a room look "inhabited or abandoned, used or new, tidy or messy". https://www.cg.tuwien.ac.at/research/publications/2013/ilcik-2013-cipmi/ilcik-2013-cipmi-draft.pdf | [read] |
| Boris the Brave, WFC tips | WFC "doesn't have any global structure"; a path constraint is what stops disconnected rooms; fixed tiles can hold entrances and pre-authored content; large maps look "samey" unless split into regions, as Caves of Qud does. https://www.boristhebrave.com/2020/02/08/wave-function-collapse-tips-and-tricks | [read] |
| Dalton, SSS13 paper (https://www.hvl.no/siteassets/hvl-internett/arrangement/2022/13sss/552dalton.pdf) | Defines total and mean depth of an access graph (text lines 104-133); used here only as a measurable number. | [read] |
| nyra.nyc, "Cancel the Corridor" (an essay) | Lists alternatives to the double-loaded corridor: courtyard, single-loaded arcade, room-to-room circulation (enfilade, shotgun). Opinion, not a standard. https://nyra.nyc/cancel-the-corridor | [read] |
| Wikipedia, "Liminal space (aesthetic)" | Reports Diel and Lewis: "deviations from familiar structural patterns can produce an uncanny-valley response"; unease from familiar settings without their usual context. Secondary. | [read] |

What the sources do NOT give: a method for an unbounded, streamed, 8-storey world. Merrell and Mirahmadi need a closed footprint and (Merrell) a global optimiser. [inferred] Our generator is a per-cell hash with no global pass, so what transfers is vocabulary (program, adjacency, depth, typology) and local rules, not the solvers.

## 2. What it would give a run, tied to his words

His ask: "way too repetitive" and "more fun elements for running like cool pathways with intent mixed into the randomness" [his 179]. His warning: "I do love the proc gen as it is now for the starting biome, but sometimes there are too many doors" [his 89], so the apartment stays as it is until measured. His interiors: "real pieces to be imbeded into the seeds, like designed areas with meaning" [his 26]; "the key point is liminal spaces" [his 6].

| technique | strongest | gives a runner | closes which sameness cause (scout 00 section 4) |
|---|---|---|---|
| A. Program-tagged rooms with a depth gradient | 1 | a room that is a reception, ward, classroom or store, so a run reads as a building and designed pieces have a place to stand | 3 (rooms have no purpose), 4 |
| B. Pass-through rooms and a circulation typology per wing | 2 | the route goes through lobbies and waiting rooms, and a wing is a ring, a spine or an enfilade, not always a double-loaded lane | 1, 2, 4 |
| C. Slice-and-dice room sizes inside a piece | 3 | rows of rooms of different widths, not one width per biome | 3 |
| D. Lane as a sentence, with registers and loop-back | 4 | a stretch has a beat: threshold, long run, release, event; intent without a fixed line | 2, 5 |
| E. A deviation budget: one broken rule against an established norm | 5 | a "real building gone subtly wrong" moment, rare, only after the norm is established | 8 |

[inferred] E depends on A and B: a deviation needs a norm to deviate from.

## 3. Where it attaches in our generator

| technique | attach point | what it must not break |
|---|---|---|
| A | layout.cpp:331-337 block(): gate, character and ceiling are one hash per block, so every piece in a block shares them. Move the choice to the piece (the piece hash `hp` exists at :386) from a per-biome purpose table; store a `uint8_t` in `BlockCell` (gen_impl.h:122-132; `Cell::flags` is full, gen.h:291-300). Emit a new Region kind beside kRegionVoid (core/scene.h:107-108; emit.cpp:611-657). | Face agreement (layout_tests.cpp:100): a piece never crosses a block, so a per-piece choice is local. A new Region kind is read only as `kRegionVoid` in game/world/world_app.cpp:37 [code, grep]. |
| B | layout.cpp:240 pre() and :176 col_off()/:189 row_off(): a low-frequency "wing" field picks typology and feeds lane offset and cut rate. Pass-through: where a lane meets a room piece, claim the room's cells as Lane for one stretch (precedent: lanes claimed beside junctions, :179-183). biome.cpp:48-178 holds the numbers. | Chaser and player connectivity bands (dial_tests.cpp:37-42, :75); lane pins beside junctions; stair columns (layout.cpp:70). |
| C | layout.cpp:343 `parted` (a global spacing, `r.partition`, hotel 3): make spacing and phase hashed per block, from a size list per biome. Doors already come two per room (:482-498, tip rule :500-515), so they follow the new rooms. | `door_stride` (hotel 3) assumes spacing 3 and must be 0 or follow; a one-way-out slice becomes mass (:390), which moves the mass share and the hotel band. |
| D | layout.cpp:240 pre(), a layer above lanes, as scout 00 section 5 says. Mission-style sequence per lane stretch from a per-biome rule table; "loop-back" is the existing cut and cross-corridor rule (:214, :231) judged by graph.cpp:77 detour_seconds, kept only if measured. | The walk proof stays per edge (walk_proof.cpp:266); sequence rules must not add edge kinds. |
| E | emit.cpp:358-367 false doors (apartment 0.01, biome.cpp:69), layout.cpp:390 dead ends and blind corridors, edge() :724. Rule: one deviation per wing, drawn from a list, only in a wing whose typology (B) has set a norm. | Geometry soundness (geometry_tests.cpp:79); a deviation that is only drawn (false doors are drawn only) cannot break the graph. |

## 4. The smallest first build step

Technique A, hospital and school only (the apartment is left alone by [his 89]).

1. Files: `gen/src/biome.cpp` (a `purposes[]` weighted table in the school and hospital kits), `gen/src/gen.h` (the table type), `gen/src/gen_impl.h` (`BlockCell::purpose`), `gen/src/layout.cpp` (block(): a piece takes a purpose by `hp`, and the purpose sets its ceiling and character where the block did before).
2. No geometry, region or edge change in step one: only ceiling and character become per piece, from the table. Regions follow as step two once the test below is green.
3. Test, red first, in `gen/tests/layout_tests.cpp`: `a_hospital_block_holds_rooms_of_more_than_one_purpose_with_their_own_ceilings`. Over 200 seeds in the hospital, count blocks whose ordinary room pieces (not blind corridors or ledge rooms, which already change ceilings) carry two or more distinct ceilings or characters. Today they share one (:331-337), so the count is 0 and the test is red; the green bound is set at the first green run and recorded beside the test.
4. Tests that must stay green: layout_tests.cpp:52 and :100 (order, face agreement), geometry_tests.cpp:79, walk_tests.cpp:59-159 (12/8/8/12 seeds), dial_tests.cpp:75 and :212, and the walk proof with purposes forced common.
5. Not claimed: that this reads differently to him. Rooms were 2 of 90 samples (p-d665-gen-data-B_2026-11-11.md:34-41), so A is seen only after B routes the lane through them.

Second step: B's pass-through (E's lever 2, p-d665-variety-E_2026-11-11.md:51); its red test is the rooms share rising above the 10% that p-d665-straights-B_2026-11-11.md:36 failed to hold.

## 5. Costs, risks, conflicts

- **Optimisation is out.** Merrell's 35 s to 7 minutes and its 1-in-5 failure on three storeys (stairs coupling floors) cannot run per chunk at a streamed 240 Hz world. Keep the program idea, drop the solver [inferred].
- **Treemap needs a closed rectangle.** Our pieces are leftovers between lanes; only the slicing idea fits (C).
- **Mass share.** Changing room widths (C) or purposes (A) can turn pieces into mass (:390) and move dial bands. Measure before and after; bands exist for apartment and hotel only (dial_tests.cpp:37-42), so school and hospital changes have no band to fail against. Add bands first. [code]
- **Conflicts.** B (lane routing, offsets) collides with the unmerged `origin/d665-variety-b` (7 files differ both sides, scout 00 section 6); do not start B before that lands or is rebased. D and B both claim the claim-order slot above lanes: one intent layer, not two.
- **Drop harness.** Any new room floor, step or ledge from A or C must pass origin/l189-drops (229 unintended drops found on pre-L175 main). Not re-run.
- **Liminal evidence is thin.** Only a secondary report of Diel and Lewis was read. Treat E as a design bet.
- **Lore rule.** Purposes feed designed pieces (his 26) but must keep "absence shaped like a person", never a body or a named loss (docs/BIOMES.md section 2). [read]

## 6. Not read

- Lopes, Tutenel, Smelik, de Kraker, Bidarra, "A Constrained Growth Method for Procedural Floor Plan Generation" (GAME-ON 2010): graphics.tudelft.nl refused the connection (ECONNREFUSED) twice. Known only from Ilcik and Wimmer's description.
- Diel and Lewis, "Structural deviations drive an uncanny valley of physical places": orca.cardiff.ac.uk returned 403 to fetch and curl. Its experiment 3 result came from a search snippet and is not cited.
- Auckland Design Manual page on apartment access arrangements (HTTP 406) and brandondonnelly.com (404): single- and double-loaded corridor widths and uses are not verified. Typology claims in B are [inferred] plus the nyra essay.
- Space syntax rings (Hillier and Hanson 1984): search snippet only; a UCL paper returned 403.
- Alexander (A Pattern Language), Stiny, furniture-placement papers: not opened.
- Game postmortems on interiors: searched, none found.


## Verification (second reader, 2026-11-13)

Game repo checked at 04f3882 (main), same as the document states. Checks by opening each source.

- [his 179] "way too repetitive", "cool pathways with intent mixed into the randomness": ok (briefs/dreamzone2_the_game.md:1203). The document's "more fun elements for running like cool pathways with intent mixed into the randomness" is verbatim.
- [his 89] "I do love the proc gen as it is now for the starting biome, but sometimes there are too many doors": ok (briefs file :736-737; the quote runs across a line break).
- [his 26] "real pieces to be imbeded into the seeds, like designed areas with meaning": ok (item 26, briefs file :165-166, across a line break; "imbeded" is his spelling).
- [his 6] "the key point is liminal spaces": ok (item 6, briefs file :27-28).
- [code] layout.cpp:331-337 (gate, grand, character, nceil per block hash): ok.
- [code] layout.cpp:386 piece hash `hp`; :343 `parted` lambda using r.partition; :390 mass rule: ok.
- [code] layout.cpp:240 pre(), :176 col_off, :189 row_off, :214 row_site, :231 col_cut, :724 edge(): ok (all are those function heads). :179-183 lanes claimed beside junctions: ok.
- [code] layout.cpp:70 "stair columns": ok-ish; :70 is junction() and the comment :62-69 describes the stairs.
- [code] gen_impl.h:122-132 BlockCell and gen.h:291-300 CellFlag with all 8 bits of a uint8_t used: ok.
- [code] core/scene.h:107-108 kRegionVoid; world_app.cpp:37 reads regions and tests only kRegionVoid (:38); emit.cpp pushes kRegionVoid in the 611-657 span: ok.
- [code] biome.cpp apartment false_doors 0.01 at :69; hotel/school partition 3 and door_stride 3, hospital 2 and 2: ok. emit.cpp:358-367 false doors: ok.
- [code] dial_tests.cpp:37-42 bands exist for apartment and hotel only (two entries in kExpect): ok. :75 and :212 are the named tests: ok.
- [code] layout_tests.cpp:52 order test: ok. "face agreement (layout_tests.cpp:100)": WRONG. :100 is `two_threads_generate_the_same_chunks`; face agreement is `neighbouring_chunks_agree_on_every_shared_face` at layout_tests.cpp:115. The same wrong line is repeated in section 3 row A and section 4 item 4 ("layout_tests.cpp:52 and :100 (order, face agreement)"); the correct pair is :52 and :115.
- [code] geometry_tests.cpp:79, graph.cpp:77 detour_seconds, walk_proof.cpp:266 prove_block: ok.
- [code] walk_tests.cpp:59 starts a walk test; the "12/8/8/12 seeds" and the range :59-159: could not check (not opened past line 59).
- handback p-d665-gen-data-B_2026-11-11.md:34-41 "room 2 of 90": ok. p-d665-straights-B_2026-11-11.md:36 rooms share 10% target, 7% result, FAILED: ok. p-d665-variety-E_2026-11-11.md:51 lever 2 pass-through rooms: ok. docs/BIOMES.md:56 "absence shaped like a person": ok (section number 2 not checked).
- [read] Merrell 2010 (re-read via pdftotext): 40+50+30 = 120 training programs, separate networks for single/two/three storey, 35 s illustrated optimisation, "a few seconds to 7 minutes", failures 1 in 20 two-storey and 1 in 5 three-storey, "chief cause" present: ok. "hand-encoded" and "stairs and tall rooms" wording not separately confirmed (could not check).
- [read] Mirahmadi and Shami (arXiv PDF): squarified treemap, Uniform(8,18) bedroom, Uniform(3,11) other, corridor placed for rooms not adjacent to the living room: ok. The "forbidden pairs, bedroom not onto kitchen" detail: could not check.
- [read] Dormans 2010: double edge = tight coupling, registers (traps then monsters), "close proximity and in the correct alignment": ok.
- [read] Boris the Brave WFC tips: no global structure, path constraint vs disconnected rooms, fixed entrance tiles, "samey", Caves of Qud subdivision: ok.
- [read] Ilcik and Wimmer 2013: orthogonal shapes, NP-hard, "abandoned, used or new, tidy or messy": ok.
- [read] Dalton SSS13: total depth and mean depth defined: ok; the "text lines 104-133" locator: could not check.
- [read] Wikipedia Diel and Lewis, nyra.nyc essay: could not check (not re-opened).
- (d) Memory-sourced [read] claims: none found among the sources checked. Licence or terms are not stated for any outside source, which the brief asked for when the page shows them (not checked whether pages show them).

Totals: checked 29, ok 24, WRONG 1, could not check 6 (counted as separate lines above where noted).
