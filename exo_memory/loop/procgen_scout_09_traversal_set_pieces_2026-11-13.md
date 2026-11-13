# Procgen scout 09: lines worth running, traversal set pieces for a parkour kit (2026-11-13)

Worker scout, read-only. Game repo read at commit 04f3882 [code]. Marks: [read] opened and read; [code] file:line in the game repo; [inferred] my reasoning; [ours] a proposal. HTML pages were read through a page summariser (the fetch tool returns its answer, not the page); the three PDFs were extracted to text with pdftotext and read by me. Nothing was built or run.

## 1. What the sources do

| source | what it does | mark |
|---|---|---|
| Smith, Treanor, Whitehead, Mateas, "Rhythm-Based Level Generation for 2D Platformers", FDG 2009 (expressiveintelligence.github.io/papers/smith-fdg-09.pdf; no licence shown in the text) | Two tiers. A rhythm tier picks verbs and times ("move", "jump", with beat type regular, random or swing, length 5 to 20 s, density low to high). A geometry tier turns each beat into a gap, platform or spring using a physics model (jump times, heights), so "all generated levels are playable". Rhythm groups are joined by a rest platform. Grammars over-generate, so 1000 candidates are scored by critics: a "line distance" critic (the designer draws the path the level should follow) and a chi-square "component style" critic. Its own warning: a no-rhythm baseline "were playable, but they have no sense of flow". Its physics model supports no double jump or wall-jump | [read] sections 4, 4.4, 5, 8 |
| Mawhorter and Mateas, occupancy-regulated extension (ORE), 2010 (cs.hmc.edu paper PDF) | A level grows from a chunk library. Every chunk and the partial level carry anchors, the places a player could stand. A chunk is placed only at a matching anchor and its own anchors join the level, so unplayable joins are excluded. Chunk weights use per-chunk weight and times used. Post-processing applies global rules (power-up spacing). Their own note: it relies on "smart chunk selection and post-processing"; 42 chunks, none over 10x10 tiles | [read] section III, V |
| Aramini and Lanzi, AI-assisted platformer design, arXiv 1804.09153 | Builds a directed graph of platforms. An edge exists if any generated jump trajectory (still, walk or run take-off, double jump) reaches the target; edges are directional ("reachable from another platform, but not vice versa"). Take-off noise gives a success probability, checked against 16 test screens of real players | [read] sections III to V |
| Fisher (Pwnee), "How to Make Insane, Procedural Platformer Levels", Game Developer | A design AI adds one block at a time in a depth-first search; a player AI "directly proves the levels are possible by beating them"; a rejected block is dropped and the search backtracks (pseudocode caps 10 rejections a node). A feasible start-to-exit skeleton is built first, obstacles after, only where they do not block the bot. Feasible is not fun, so heuristics steer branches; thousands of parameters collapse to one difficulty rating | [read via summariser] |
| Zampella on Respawn's action blocks, Game Developer | 100 to 200 rough one-person blocks, each "a week, a few days"; the team keeps the strong ones. The page does not say how blocks were chained or how wall-running was paced | [read via summariser]; detail absent |
| Techland, Dying Light (MCV) and Dying Light 2 (Game Developer, 80.lv) | Freedom of movement forced the team to rethink level design: "we could go to spots we never intended"; loot and quests were put in hard-to-reach places because players would go anyway. Buildings follow "strict parkour dimensions" set from the move set; routes need "a specific rhythm" of ledges; skyline landmarks orient; first-game side wall-runs were disabled because "the city was not supporting it" | [read via summariser] |
| Mirror's Edge flow notes (worldofleveldesign.com) | A hidden route works when light and contrast pull the eye to it; "player will naturally navigate towards light"; keep momentum unbroken | [read via summariser]; a blogger's view, not a developer's |
| Spelunky room templates (tinysubversions.com) | 4x4 rooms of 80 tiles, about 50 layouts per tile set, "roughly 80% hand-crafted"; traps and monsters placed by rules; after 500 plays a player can recall each layout. The page does not mention a critical path | [read via summariser] |

What carries over to us [inferred]: (a) feel comes from a sequence of verbs with timing, not from geometry; (b) a bot or controller beating the result is the proof; (c) hand-made pieces plus random placement beat pure random; (d) global shape needs a critic or a measure, because local grammars cannot see it; (e) lines must be visible to be taken.

## 2. What it would give a run, tied to his words

- His 91 and 179: "way too repetitive"; he wants "cool pathways with intent mixed into the randomness". A beat-sequenced line is intent; the hash still places and sizes it.
- His 7: parkour is a rare escape where "the entity has to route around". His 14: wall-runs "rare and short". His 11: he "LOVE[s] the safe zones", the drop-in kind. So pieces stay rare and optional; the walkable graph must stay complete without them. The room's brief warns that the first plan "lays a guaranteed route" and he corrected it (dreamzone2_the_game.md:49-52). These lines are extras, not a spine.
- His 140: "nutty speed lines" belong to the upgraded, skilled player. His 164: the chasers need "to find better lines to keep speed". A line kept only when a measured chain pays a time saving gives both sides something to read.
- Missing verbs: of vault, climb, slide, dive, wall-kick, wall-run, ladder, drop, only five have pieces (scout 00 section 4.6). The controller has slide, vault, mantle, wall-kick and dive [code sim/world.h:25-35; sim/params.h:70-115].

## 3. Where it attaches in our generator

| technique | attach point [code] | change | must not break |
|---|---|---|---|
| A. Verb-gated pieces sized from the body | voids.cpp:30 void_size and :96 void_site (the template); gen.h:103 MoveReach (add slide, vault and kick fields); graph_walk.h:162 (WallRun edge, template for new EdgeTypes); layout.cpp:667 RepRow and graph.cpp:145 row_rep_site (a low-ceiling reprieve row) | slide cut, vault row, wall-kick hop, each sized from kBaseMove, never the live body (gen.h:134-137) | walk proof, `void_size` margins, kClearOfSpawn (voids.cpp:26), connectivity bands |
| B. Beat-sequenced run lines | new layer above lanes in layout.cpp:240 pre(); lane pinning precedent layout.cpp:179-183; judge like graph.cpp:77 detour_seconds | a line site per region: a sequence of beats (sprint, vault, slide, drop, corner) taken from existing cells; geometry from the beat table | determinism (pure hash of seed and coordinates), one region window like detour_seconds |
| C. Authored templates stamped into blocks | layout.cpp:318 block() (pieces), anchors = graph nodes (graph.cpp:23 node_pos) | 20 to 50 hand-made 6x6 pieces (a lobby with a mezzanine run, a classroom with desks to vault) chosen per block by hash | face agreement (layout_tests.cpp:100), geometry soundness (geometry_tests.cpp:79) |
| D. Measure-then-keep for optional lines | graph.cpp:77 and :145 (kept if hunter detour >= 5 s); branch origin/d665-variety-b crossing_seconds | keep a line only if player time saved on it is at least N s against the lane route, and the hunter cannot use it | the 5 s Park rule, `dial_tests.cpp:212` |
| E. Readable lines | emit.cpp:565-579 (kept reprieves already get a fixed, tinted, always-lit lamp: "a tell"); emit.cpp:28 lit_field | a lamp or a lit patch at each line's mouth; a colour per verb | lit-share bands, lamp budget, render cost (scout 00 notes rooms at 2.8 ms) |

## 4. The smallest first build step

Build A's first piece: a **slide cut** (a kept reprieve row whose middle cells have a ceiling of 1.3 m, so only a crouched body passes). Slide needs speed 5.0 and the crouch button (sim/params.h:71; sim/input.h:14) and the body crouches to 1.0 m (params.h:28).

Files: gen/src/gen.h (a dial `slide_cut_rate`, default 0 so every existing seed is byte-identical), gen/src/layout.cpp (ceiling of RepRow cells, near :667), gen/src/walk_proof.cpp (add `bool crouch` to Leg at :70 and press kButtonCrouch in Follower::tick; plan a Slide kind), gen/src/walk_proof.h (ProofKind), a new gen/tests/slide_tests.cpp.

Test red first, modelled on walk_tests.cpp:229-262: `a_slide_cut_is_crossed_by_a_slide_and_not_by_a_walk`. Red now because the dial, the ProofKind and the crouch leg do not exist. Green when, at `slide_cut_rate` 1 over 8 seeds, every cut is crossed by the real controller sliding from sprint speed, and a runner that never crouches completes none. Second test: `the_default_dials_generate_the_same_chunks_as_before` (a chunk hash at rate 0 equals the pre-change hash). Third: the existing void, stair and dial tests stay green.

Not yet answered [inferred]: whether the controller fits a 1.3 m opening while standing; whether a slide at the entry speed fits inside the cut's length. The first test settles both.

After that, in order: wall-kick hop sized from `wallkick_up` 6.0 and `wallkick_out` 4.5; vault row (obstacle up to `vault_max_height` 1.1 m, speed 4.0); then B's multi-edge line proof.

## 5. Costs, risks, conflicts

- **The proof is single-edge from a standing start** (scout 00 section 3; walk_proof.cpp:266). A line at speed needs a chained attempt with carried speed; that is a new proof harness, the largest cost in B. Until it exists, B's lines are only as proven as their parts. [inferred]
- **Slide and vault speeds are conditional.** A piece that needs 5.0 m/s is only crossable after a run-up; every piece needs a run-up length rule like `runup_cells` (voids.cpp:34). [inferred]
- **Stateless generation.** Fisher's search and ORE's "times used" weight both keep state; ours is a pure function. Use a region-local deterministic search (hash-seeded) and a hash of the region instead of a counter. [inferred]
- **Capacity and kBaseMove.** A new kBaseMove field changes every seed (gen.h:134-137), on purpose. All 8 Cell flag bits are used (gen.h:291-300); use a CellKind or a Region. [inferred]
- **Conflicts.** The d665-variety-b branch (151aead) adds `LinkKind::Chute` and a judge that overlaps D; the files differ on both sides including emit.cpp (scout 00 section 6), so land or rebase it first or add pieces after it. The drop harness (origin/l189-drops) will count unintended falls; a drop-in or chute that is deliberate must be exempt as voids are. Other scouts' intent layers also want pre(): agree one claim order.
- **Balance.** Critics and rest areas in Smith et al. exist because grammars give "repetitive" levels; without a global measure the lines will repeat at a new scale. [read, section 5; inferred for us]

## 6. Not read

- Derek Yu, Spelunky book (critical path first): seen only in a search snippet; the tinysubversions page does not mention it.
- Burnout Paradise and Criterion design diary (GameSpot returned 403): search snippets only.
- Titanfall 2 GDC 2018 talk, MapCore "Effect and Cause" (403), GDC Vault: not opened; the action-block article says nothing on traversal pacing.
- Tony Hawk's level design: no primary source found; nothing here relies on it.
- Mirror's Edge original or Catalyst developer interviews (Odeldahl, O'Brien): snippets only.
- Compton and Mateas 2006, Launchpad journal version, Smith's dissertation, Cooper 2025 softlocks paper (PDF fetched but not extracted): not read.
- Fisher's article beyond the summariser's answer.

## Verification (second reader, 2026-11-13)

Quotes ([his N]), checked against exo_memory/briefs/dreamzone2_the_game.md:
- [his 7] "the entity has to route around": ok (line 37, item 7). Brief lines 49-52 "lays a guaranteed route" correction: ok.
- [his 11] "LOVE the safe zones": ok (line 69). The "drop-in kind" gloss is [inferred]; the item says "you jump into to go down a level": ok.
- [his 14] "rare and short" wall-runs, "minimal": ok (lines 79-80).
- [his 91] "way too repetitive": ok (line 748).
- [his 140] "nutty speed lines": ok (line 1066).
- [his 164] "find better lines to keep speed": ok (line 1131). The text does not say "chasers" in the quote itself; the next line (traced against A's L169, chasers' path) supports it. Item numbers 91 and 179 for "way too repetitive" and "cool pathways with intent mixed into the randomness": ok (line 1203, item 179).

Code citations (repo at commit 04f3882, confirmed):
- voids.cpp:30 void_size, :96 void_site, :26 kClearOfSpawn: ok.
- voids.cpp:34 cited as `runup_cells`: WRONG. Line 34 computes `v0` (jump velocity); `runup_cells` is set at voids.cpp:79 and declared at gen.h:127.
- gen.h:103 MoveReach; gen.h:134-137 kBaseMove comment (never the live body, changing it changes every seed); gen.h:291-300 eight CellFlag bits all used: ok.
- graph_walk.h:162 WallRun edge: ok.
- layout.cpp:179-183 lane pinned to offset 1 beside an active junction: ok. layout.cpp:240 pre(), :318 block(), :667 Pre::RepRow: ok.
- graph.cpp:23 node_pos, :77 detour_seconds, :145 row_rep_site: ok. Dial reprieve_min_detour_s 5.0 (gen.h:74): ok.
- emit.cpp:28 lit_field, :565 fixed_lamp for Reprieve/Well, :579 reprieve lamp colour: ok.
- walk_proof.cpp:70 `struct Leg` (jump, lean, no crouch field): ok. walk_proof.cpp:266 prove_block: ok as a location; the "single edge from a standing start" claim is [inferred] from scout 00 and was not independently confirmed (walk_proof.h:54 says "time allowed per edge", which is consistent).
- sim/world.h:25-35 MoveState has Slide, Vault, Mantle, WallRun, Dive: ok. params.h:71 slide_min_speed 5.0, :28 crouch_height 1.0, wallkick_up 6.0, wallkick_out 4.5, vault_min_speed 4.0, vault_max_height 1.1: ok. input.h:14 kButtonCrouch: ok.
- layout_tests.cpp:100 cited as "face agreement": WRONG. Line 100 is `two_threads_generate_the_same_chunks`; face agreement is `neighbouring_chunks_agree_on_every_shared_face` at layout_tests.cpp:115.
- geometry_tests.cpp:79 no_solid_is_thin_or_overlaps_another: ok. dial_tests.cpp:212 no_reprieve_has_a_quick_way_round_on_the_assembled_graph: ok.
- walk_tests.cpp:229-262: 229 starts the wall-run test; line 262 is a comment opening the next test (stairs), so the range is slightly loose: minor.
- origin/d665-variety-b is 151aead, has LinkKind::Chute and crossing_seconds (graph.cpp:171): ok. origin/l189-drops exists: ok. Content of those branches' other files was not compared (could not check, effort).

Outside sources:
- Smith et al. FDG 2009 PDF: ok (extracted with pdftotext: "ensuring that all generated levels are playable", 1000 candidate levels, line distance critic, chi-square, "no sense of flow", double-jump and wall-jump not supported). One nit: the quoted "were playable, but they have no sense of flow" is a close paraphrase of "are playable, they have no sense of flow". No licence is shown in the text: ok as stated.
- Aramini and Lanzi arXiv 1804.09153: ok in the PDF body (directed graph of platforms, edges if any generated trajectory reaches, "reachable from another platform, but not vice versa", 16 screens). The arXiv abstract page itself does not mention the graph; the claim rests on the PDF, which the scout listed. Licence: abstract page links arXiv non-exclusive distribution licence 1.0; the scout cited no licence, fine.
- Fisher, Game Developer: ok (player AI "directly proves the levels are possible by beating them", depth-first search, backtracking, the 10 is in the appendix pseudocode and is per node call: matches "caps 10 rejections a node" loosely).
- Spelunky, tinysubversions.com/spelunkyGen/: WRONG or unsupported. The page says "16 rooms in a 4x4 grid". It does not contain "80 tiles", "about 50 layouts per tile set", "roughly 80% hand-crafted" or "after 500 plays". The scout's [read] mark for these details is not supported by that page; they may come from another source or from memory. Treat as unmarked [inferred] until a source is given. Note also "4x4 rooms of 80 tiles" misreads the page: the 4x4 is the grid of rooms in a level.
- Mawhorter and Mateas ORE (cs.hmc.edu): could not check (HTTP 403 on the URL I tried; the scout's exact URL is not given in the document, which is itself a gap for a [read] mark).
- Zampella/Respawn, Techland/Dying Light, Mirror's Edge (worldofleveldesign): could not check (no URL given in the document, so no page to re-open; effort limit). The doc says [read via summariser] with no URL: a (d) concern.

(d) Missing URLs: the table in section 1 gives a URL only for Smith; ORE, Aramini, Fisher, Zampella, Techland, Mirror's Edge and Spelunky carry no URL, so those [read] marks cannot be audited from the document alone.

Totals: checked 38, ok 33, WRONG 3 (voids.cpp:34 runup_cells; layout_tests.cpp:100 face agreement; Spelunky details), could not check 5 (ORE, Zampella, Techland, Mirror's Edge, branch bodies) plus the standing-start claim left [inferred].
