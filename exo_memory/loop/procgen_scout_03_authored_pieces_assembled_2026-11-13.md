# Procgen scout 03: designed pieces assembled procedurally with a guaranteed path (2026-11-13)

Game repo read at commit 04f3882 (main). Marks: [read] I opened the source; [code] file:line in the game repo (gen/src/ unless stated); [inferred] my reasoning; [ours] a proposal with no source. Keeper words are cited as [his N] from briefs/dreamzone2_the_game.md. Nothing was built or run.

## 1. What the sources do

| source | what it does | limit it states |
|---|---|---|
| Spelunky solution path, Kazemi's walk-through [read https://tinysubversions.com/spelunkyGen] | 4x4 grid of rooms; a random walk from the top row (1 or 2 left, 3 or 4 right, 5 down; drop at an edge); path rooms typed by their exits; every other room a random type 0 with no guaranteed exit | no licence text; a community reading of the game |
| Spelunky templates, same author [read https://www.tinysubversions.com/spelunkyGen2/index.html] | each room type has "typically 8 to 16" hand-made 10x8 templates; tiles are static or probabilistic (a 25% pushblock, a 50/50 block); marked spots take a 5x3 "obstacle block" from its own template; rooms sometimes mirrored; regeneration levels keep types, templates, or only the dice | nothing on seams or repetition |
| Dead Cells, Benard [read https://deepnight.net/tutorial/the-level-design-of-dead-cells-a-hybrid-approach/] | hand-made frame; hand-made room tiles tagged by entrances, exits, purpose; per biome a hand-made concept graph (entrance and exit first, special rooms, then fill) sets length and distance to the nearest exit; the generator tries random rooms per node, "mostly brute-force" | no word on seams, loops or exit matching; a reader comment (not the article) says it later moved to a WFC-style matcher; copyright reserved |
| Chasm, Petruzzi [read https://gamedeveloper.com/design/designing-i-chasm-i-a-procedurally-generated-metroidvania] | hand-made room libraries per area; "paths between known points"; rooms tagged to the section that suits the difficulty; the same room is kept from recurring too often in a row | pacing "was the hardest problem" |
| Shattered Planet, Short [read https://gamedeveloper.com/design/level-design-in-procedural-generation] | critical path first, side rooms after, alternate paths last; 4 to 5 room definitions per level set; each capped in how often it appears | names "samey content" as the risk; no whole-level solvability check |
| Dormans, FDG 2010 [read PDF, pcgworkshop.com/archive/dormans2010adventures.pdf] | a graph grammar makes a mission (keys, locks); a shape grammar grows a space for it, each space rule tied to a mission symbol; a "tight coupling" edge forces a room behind another; rule weights shift with progress; near, aligned connections are joined so the space reconnects | grammars "must be build with a clear vision of what the final game will be like"; need expert designers |
| Boris the Brave on WFC [read https://www.boristhebrave.com/2020/02/08/wave-function-collapse-tips-and-tricks/ and /2021/10/31/constraint-based-tile-generators/] | WFC has "no global structure", so big outputs look "very samey"; a path constraint forces a route between marked tiles but not a short one; fixed pre-placed tiles integrate; Caves of Qud splits the map into areas with their own settings | backtracking "can still get stuck"; restarts work only if contradictions are rare |
| Model synthesis in blocks [read https://www.boristhebrave.com/?p=1134] | each block fixes all its borders to a "known good" arrangement so a block can be solved alone; a failed block restarts alone and can fall back to the known good | needs a pre-specified known-good arrangement |
| Hades, Gorinstein's thread [read https://threadreaderapp.com/thread/1311777010239193088] | rooms hand-built; the whole map is flipped so exits keep their direction; smaller rooms early, larger later | never says which part is procedural |

The common shape [inferred]: authors make the pieces, a rule makes the sequence, and the join is guaranteed by a contract at the piece boundary (tagged exits, fixed borders, a flip).

## 2. What it would give a run here

- A room with a purpose and an interior, which the room measured as missing: "2 rooms in 90 samples", rooms 10% to 7% after shorter straights [read exo_memory/handback/p-d665-straights-B_2026-11-11.md:29-41]. His words: "way too repetitive" and "more fun elements for running like cool pathways with intent mixed into the randomness" [his 179].
- A place to put meaning: "real pieces to be imbeded into the seeds, like designed areas with meaning" [his 26]. The designed pieces in docs/BIOMES.md are shape only [read BIOMES.md:58-61].
- Lines with a shape (pass-through hall, pillar field, balcony drop), not one forced route: "more open ended than a few lines being a linear path or runner" [his 7].
- Homes for verbs with no piece (slide, dive, wall-kick). Wall-run stays "rare and short" [his 14].

## 3. Where it attaches in our generator

Hard fact first [inferred]: Spelunky and Dead Cells build a bounded level and make a global path first. Ours is infinite and every cell is a pure function of (seed, salt, coordinates). So the guarantee must be a local contract at the piece boundary plus the existing proofs. The base graph already connects (dial_tests.cpp:75, per scout 00).

| step | file:function | change |
|---|---|---|
| site | layout.cpp:23 atrium(): one site per region, kept 2 cells inside it [code :36-47] | a piece site by the same rule; a salt appended after kSaltFalseDoor [code gen_impl.h:41] |
| claim | layout.cpp:240 pre(): atrium claims first, then junction, then lanes [code :250-262] | a piece claims its cells before lanes; its ports are fixed border cells |
| ports | layout.cpp:179-183: a lane is pinned to offset 1 beside an active junction | the same pin: a lane beside a port takes the port's offset. This is Merrell's "known good" border and Dead Cells' entrance tag, in our terms [inferred] |
| interior | layout.cpp:318 block(), :597 cell_base() | template cells become Room, Solid, Stair, Ledge from an ASCII grid per storey |
| edges | layout.cpp:724 edge(); graph_walk.h:55 edges_from() | no new edge kind for first pieces, so the walk proof sees every edge |
| reject | graph.cpp:77 detour_seconds() drops a Park whose measure fails | a piece site that clashes with a junction or atrium falls back to the base block: Dead Cells' retry, Merrell's fallback [inferred] |
| list | biome.cpp:214; gen.h:183 TemplateSet | a piece list per biome, a table like TemplateSet |

## 4. The smallest first build step (technique 1, stage A)

[ours] One pass-through hall, apartment and hotel, no new connectivity. A 6x6 block where a column lane runs straight through (col_off equal at both ends, layout.cpp:176) takes a template that widens the lane into a hall: an ASCII grid says which other cells are open floor and which are pillars or alcoves. The lane cells are untouched, so the ports are the lane itself and connectivity cannot drop.

Files: gen/src/gen.h (a `piece_rate` dial, default 0.0 so no seed moves), gen/src/gen_impl.h (one salt, last), gen/src/layout.cpp (pre() or block()), new gen/src/pieces.cpp (the ASCII table), gen/tests/layout_tests.cpp, gen/tests/walk_tests.cpp.

Red before, green after:
1. layout_tests.cpp, new `a_stamped_hall_matches_its_template_and_keeps_its_lane_open`: piece_rate 1.0; a block with a straight lane equals one template variant and its lane entry and exit are walk-connected. Red first: the dial does not exist.
2. walk_tests.cpp:114 (rare pieces common) with piece_rate 1.0: every edge of 12 seeds completes. Red if a template makes an edge the controller cannot do.
3. Stay green: layout_tests.cpp:52, :100 (order, threads), :115 (faces), geometry_tests.cpp:79.
4. A digest check at piece_rate 0.0: every chunk equals main's, so no existing seed moves.
5. After l189 lands, run drop_tests.cpp on piece-heavy seeds: a template may hold a drop only if declared. Unverified; that harness (origin/l189-drops 260553b) was not run.

Stage B: region-level sites, 3 to 5 templates, mirror by hash (Hades' flip, Spelunky's mirror), the first non-lane template (a plaza with a balcony drop).

## 5. Other techniques from this family, strongest first after stage A

2. Variation layer on templates [ours, from Spelunky part 2]: static plus chance cells, 5x3-style obstacle slots filled from sub-templates, mirror by hash. Anti-repeat as in Chasm and Shattered Planet, made order independent by checkerboard: sites of one parity pick freely, the other parity excludes its four neighbours' picks, so no site depends on order [ours]. Attaches to pieces.cpp and the site hash.
3. Role by depth, Dormans' rule weights [ours]: biome.cpp:214 already knows distance; a piece list weighted by depth and by chapter (his 28 asks for seeds to get "more chaotic" over chapters) gives the ramp without a stored mission.
4. A spine of set-piece regions, Spelunky's solution-path walk [ours]: a monotone random walk of region columns per region row (pure function, a few dozen steps per 3 km) marks where the biggest pieces cluster. Weakest fit: a spine reads as a line, against [his 7]. Use it for placement density only.
5. WFC inside a piece footprint [ours]: fixed border tiles, interior solved, for furnishing later. Its solve is order dependent, so it may not cross chunks.

## 6. Costs, risks, conflicts

- Templates add a second kind of sameness. Yu is reported, in a search snippet I could not confirm at source, as saying players "quickly begin to recognize certain repeating landmarks". [his 91] is the same complaint, so technique 2 must ship with stage B, not after.
- A piece must not call pre() for cells it claims, or the layers cycle [inferred]. Its site check may read only upstream layers (atrium, junction, biome).
- Merge: origin/d665-variety-b 151aead adds four salts and touches gen.h and emit.cpp, 7 files shared [read scout 00 s.6]. Salt order sets the hash, so whichever lands second appends after the first, and seeds change: say so before landing.
- Cell::flags has 8 of 8 bits used [code gen.h:291-300]; tags beyond kind need a widening first.
- The proof is per edge from a standing start; it cannot show that a line through a hall is good to run. Judge feel from the chase's run log [inferred].
- Authoring cost is the price: Dormans says expert designers; Yu made 8 to 16 per room type. Who writes the templates is for him [ours].

## 7. Not read

- Derek Yu's book text on Spelunky; the Game Developer excerpt I opened lacks the "repeating landmarks" lines.
- The Game Maker's Toolkit Spelunky video and transcript (search result only).
- Hades: no developer text on how rooms are chosen; a fan page claiming about 30 rooms per biome was not opened; the "12,000 rooms from 400 pieces" figure is unverified.
- Galak-Z (blurb only), Bucklew's Caves of Qud WFC talk and GDC Vault pages (video), Dormans' 2011 IEEE paper, Merrell's papers beyond Boris's summary.
- Our code: cell_base() (layout.cpp:597) and the full atrium claim path; tests were read by name only.

## Verification (second reader, 2026-11-13)

- [his 179] "way too repetitive", "more fun elements for running", "cool pathways with intent mixed into the randomness": ok (brief line 1203, item 179).
- [his 26] "real pieces to be imbeded into the seeds, like designed areas with meaning": ok (brief lines 161-166, item 26; the phrase wraps across two lines).
- [his 7] "more open ended than a few lines being a linear path or runner": ok (brief lines 29-30, item 7; wraps across a line break).
- [his 14] "rare and short": ok (brief line 80, item 14, about wall running).
- [his 28] "more chaotic": ok (brief line 223, item 28). Section 5 item 3 paraphrase "seeds to get more chaotic over chapters" matches.
- [his 91] "way too repetitive over time" complaint: ok (brief line 748, item 91).
- Game repo commit 04f3882: ok (git log -1).
- [code] layout.cpp:23 atrium(), one site per region, 2 cells kept inside (:36-47): ok (comment at :41-42 says at least two cells stay outside the footprint).
- [code] gen_impl.h:41 kSaltFalseDoor is the last salt: ok (last enum entry). Note: an earlier kSaltPiece already exists in the enum (gen_impl.h:31), so a "piece" salt name may collide in meaning; not an error in the cited claim.
- [code] layout.cpp:179-183 lane pinned to offset 1 beside an active junction: ok (actual lines 177-182).
- [code] layout.cpp:240 pre() / :250-262 atrium first, then junction, then lanes: WRONG in order. pre() sets c.lanes first (:247-248), then atrium kinds, then junction claims; lanes are computed before, not claimed after, the junction. Read gen/src/layout.cpp:240-262.
- [code] gen.h:291-300 Cell flags 8 of 8 bits used: ok (kCellFloor..kCellRamp, uint8_t, bits 0-7).
- [code] gen.h:183 TemplateSet, biome.cpp:214 biome(), layout.cpp:318 block(), :597 cell_base(), :724 edge(), graph_walk.h:55 edges_from(): ok (each signature is at the cited line).
- [code] graph.cpp:77 "detour_seconds() drops a Park whose measure fails": WRONG/imprecise. detour_seconds is a bounded Dijkstra returning seconds; the callers (graph.cpp:137, :158) set s.kept = detour_s >= reprieve_min_detour_s on a reprieve site. No "Park" is named in graph.cpp, and a failed measure marks the site not kept, it does not fall back to a base block.
- [code] dial_tests.cpp:75 as proof "the base graph already connects": WRONG. Line 75 is the start of a test named the_default_dials_land_in_their_ranges_over_200_seeds_in_each_biome; it checks chaser_connected and player_connected against ranges (dial_tests.cpp:84), a range check, not a guarantee of full connection.
- [code] walk_tests.cpp:114 rare pieces common, 12 seeds, check_all_completed: ok (line 114, seeds 101-112).
- [code] layout_tests.cpp:52 (order), :100 (threads), :115 (faces), geometry_tests.cpp:79 (no thin solids): ok (test names at those lines).
- [read] exo_memory/handback/p-d665-straights-B_2026-11-11.md:29-41 "rooms 10% to 7%": ok (V1 rooms row, FAILED).
- [read] same citation for "2 rooms in 90 samples": WRONG attribution. That phrase is not in p-d665-straights-B; the nearest source is handback/p-d665-variety-E_2026-11-11.md:40 ("2 rooms entered in 450 s") and scout 00 line 69 repeats "2 rooms in 90 samples". The "90 samples" figure was not found in the handback.
- [read] docs/BIOMES.md:58-61 designed piece is shape only, quotes item 26: ok.
- [read] tinysubversions spelunkyGen2: ok (8 to 16 templates, 10x8 grid, 25% pushblock, 5x3 obstacle blocks, mirroring); no licence text, as stated.
- [read] deepnight Dead Cells article: ok (concept graph per biome, entrance/exit/purpose tags, "mostly brute-force" is Benard's 2021 comment reply, copyright all rights reserved, WFC named only in a 2022 commenter's reply). Doc's "later moved to a WFC-style matcher" slightly overstates: Benard confirmed modification but did not name WFC.
- [read] gamedeveloper Shattered Planet article: ok (critical path, then side rooms, alternate paths last; 4-5 room definitions; min/max counts; "samey").
- [read] Boris the Brave WFC tips page: partly ok. "no global structure" (page wording "doesn't have any global structure"), "very samey", and path constraint confirmed; the "backtracking can still get stuck" and restart claims are NOT on that page (may be on the /2021/10/31 page; not re-opened). Licence: none stated, doc makes no licence claim.
- [read] Dormans FDG 2010 PDF, Merrell blocks page (?p=1134), Chasm, Hades thread, Boris 2021 page: could not check (not re-opened within this pass's limit of six outside sources).
- (d) Nothing marked [read] appears to be from memory; the Yu "repeating landmarks" quote is correctly flagged as an unconfirmed search snippet in section 6 and listed in Not read.

Totals: 28 checked, 20 ok, 4 WRONG (pre() order, detour_seconds Park claim, dial_tests.cpp:75 connectivity, "2 rooms in 90 samples" attribution), 2 partly ok (Dead Cells WFC overstatement, Boris backtracking claim), 5 could not check.
