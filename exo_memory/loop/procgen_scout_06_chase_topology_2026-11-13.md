# Procgen scout 06: topology that makes a chase fun and fair (2026-11-13)

Game repo at commit 04f3882. Marks: [read] opened and read; [read-sum] opened through a fetch tool that returns a summary, short quotes taken from its output; [code] file:line; [inferred] my reasoning; [ours] a proposal. Nothing was built or run.

## 1. What the sources do

| source | what it says | mark |
|---|---|---|
| Booth, "The AI Systems of Left 4 Dead" (Valve, GDC 2009), https://cdn.fastly.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf (text extracted from the PDF; no licence on it) | "Flow Distance" is travel distance from the start room to each nav area, used to ask "is this spot ahead or behind the Survivor group". Spawns are "Not purely random, nor deterministically uniform": a randomised interval (mobs 90 to 180 s) at a randomised spot "behind" the team, 75% from behind. Specials use areas "not visible by the Survivor team". The nav mesh also answers "Is area X potentially visible by area Y?". Pacing: Build Up, Sustain Peak (3 to 5 s), Peak Fade, Relax (30 to 45 s). | [read] |
| Callum Stables, a fan map designer's portfolio (not Behaviour's), https://callumstables.pages.dev/TheRedDistrict | Offers "strong" and "weak" loops; "loops should not chain strong ones together", they "alternate between strong and weak tiles"; "Deadzones" with few resources; furthest generators "roughly 90m" apart, about 20 s at 4.6 m/s. | [read-sum] |
| Dead by Daylight wiki, https://deadbydaylight.wiki.gg/wiki/Maze_Tiles | Eight tile families (pallet gym, jungle gym, L-T walls, and so on), each with many layouts, "always spawn in the same general location of a Map" while the layout changes per match. Window and pallet are on opposite sides of a tile. A jungle gym was cut from two pallets to one for balance. | [read-sum] |
| Game Developer, Behaviour on procedural maps, https://gamedeveloper.com/design/crafting-an-asymmetric-multiplayer-horror-experience-in-i-dead-by-daylight-i- | "You never know where you'll be"; procedural to stop layout memorising. It names no loop rule. | [read-sum] |
| Dormans cyclic generation, via Game Developer https://gamedeveloper.com/design/unexplored-s-secret-cyclic-dungeon-generation- and Boris the Brave https://www.boristhebrave.com/2021/04/10/dungeon-generation-in-unexplored/ | The level starts as a loop with a start and goal splitting it into two arcs; the "major cycle type" says how the arcs differ (short or long, safe or risky, one-way or both). Minor cycles are "short detours", others add dead ends; "Most maps ... only a couple of embedded cycles". Unidirectional locks (a collapsing bridge) are one lock kind. | [read-sum] |
| Pac-Man Dossier, https://www.gamedeveloper.com/design/the-pac-man-dossier (first 100,000 of 120,329 characters) | Ghosts "are prohibited from reversing"; they look one tile ahead and choose among the non-reverse exits; Blinky targets the player's tile, Pinky four tiles ahead, Clyde falls back to his corner within eight tiles, so he can circle "the island indefinitely". The page does not describe dead ends. | [read-sum] |
| Pech, Hingston, Masek, Lam, "Identifying Attributes for Characterizing Game Area Types in Virtual Terrain" (PCG Workshop 2016), https://www.pcgworkshop.com/archive/pech2016identifying.pdf (text extracted) | Isovist metrics (average, maximum and minimum radial length, volume, variance) and graph metrics (degree, betweenness, closeness) classify hidden, open, vantage, choke and stronghold areas, on 70 hand-labelled areas of one game's maps. | [read] |
| Cop-win graph, https://en.wikipedia.org/wiki/Cop-win_graph (CC BY-SA 4.0) | Finite dismantlable graphs are cop-win; chordal graphs, which include trees, are dismantlable; a cop-win graph with no induced 4-cycle or 5-cycle is "hereditarily cop-win". | [read-sum] |
| Alien: Isolation, Game Developer, https://www.gamedeveloper.com/design/the-perfect-organism-the-ai-of-alien-isolation | The director's menace gauge pulls the alien back when it peaks; designers "can also mark areas it never looks at, to avoid unfair ambushes". | [read-sum] |

What carries over [inferred]: (a) loops are the juke, and quality matters more than count; (b) maps are set up so strong loops are spaced, not chained; (c) the placing rule is flow distance plus a randomised interval, not a flat probability; (d) a cycle has two arcs that differ in length and risk, one of them sometimes one-way; (e) sightline is measured, not guessed.

## 2. What it would give a run, tied to his words

- **"way too repetitive"** [his 179], [his 91]. The room measured 94% corridor and a median straight of 49 cells (about 147 m) on his 450 s run [read exo_memory/handback/p-d665-gen-data-B_2026-11-11.md:34-41]. A forced jog (technique 1) and a loop rhythm (techniques 2, 3) change what he sees over a long straight stream without adding a single new asset.
- **"cool pathways with intent mixed into the randomness"** [his 179]. The generator already has loops: the dial band is 12 to 26 per chunk in the apartment [code gen/tests/dial_tests.cpp:38-44]. They are intent-free: every one is a cycle on an 18 m lattice [code gen.h:30; layout.cpp:214-238], so loop size takes few values and none is placed. Intent here means placing, spacing and typing loops, not adding more.
- **Juke** [his 18], [his 41]: "letting you in a way juke the entities". A loop only juke-works if the hunter's way round differs from the player's. The measure-then-keep judge already compares those two times for Parks [code graph.cpp:77, :145-160].
- **Dead ends** [his 7]: "dead ends eventually ... will end runs eventually", the parkour escape "the entity has to route around". Today dead ends are a flat rate [code layout.cpp:387] with a climb-out in 25 to 45% of them [code dial_tests.cpp:38-44].
- **Line of sight** [his 28]: sanity falls when "evading it without line of sight". That needs breaks in sight that the generator controls.
- **Breather** [his 8]: "a breather and a chance to get ahead of it". A rhythm gives Parks a reason to be where they are.

## 3. Where it attaches in our generator

| technique | file:function [code] | change |
|---|---|---|
| 1 Sightline budget | layout.cpp:176 col_off(), :189 row_off(); measure.cpp:170 (loops block) as the pattern for a new straight-run and isovist measure | the offset is one hash per segment, so P(no jog) is 1/3 at lane_offsets 3 and 1/2 at 2 [inferred from layout.cpp:182-193]. Make a segment's offset differ from its predecessor's raw hash (read segment seg-1 and seg only, so it stays a pure function). Skip when lane_offsets is 1 and where a junction pins the lane (layout.cpp:179-183). |
| 2 Loop census and strength | measure.cpp:170-183 (cycle rank today, a count only); layout.cpp:214 row_site(), :231 col_cut() choose cuts by an independent hash against loop_density | new Metrics fields: loop perimeter histogram in seconds at kBaseMove, and turns per loop. Steering later: bias cuts so loop sizes vary. |
| 3 Flow rhythm | layout.cpp:240 pre() claim order; biome.cpp:214 biome() for the distance precedent; graph.cpp:223 spawn() as flow origin | a per-seed beat function of distance from the spawn picks, per stretch, a piece quota (long run, juke cluster, breather, gamble). Hashes stay inputs; the beat only biases them. |
| 4 Verb-gated shortcut arc | voids.cpp:96 void_site() (candidates on a fixed 12-cell phase, no detour judge); graph.cpp:145 row_rep_site() judge; graph.cpp:70 hunter_seconds() returns a negative number for climb, reprieve and wall-run so the hunter must go round | judge voids and climb-outs by the hunter's way round the same way Parks are judged, and keep a void only where it cuts a loop. The Chute on origin/d665-variety-b (unmerged) is already a one-way valve [read scout 00:102]. |
| 5 Dead-end gambles | layout.cpp:380-460 (cul pieces); measure.cpp:185 bridges | place a dead end whose depth in seconds is measured, within sight of a strong loop; keep the climb-out share. |

## 4. The smallest first build step

Technique 1, in two commits.

**Commit A, measure only.** Add `straight_run_p90_cells` and `loop_perimeter_s` to Metrics in measure.h and fill them in measure.cpp. Tests, red before (the fields and the determinism check do not exist): in gen/tests/dial_tests.cpp, the new fields are identical on two runs and over two thread counts for 20 seeds. Then print the default seeds' values; set no band yet. Touches measure.h, measure.cpp, dial_tests.cpp.

**Commit B, forced jog.** Test red first, in gen/tests/layout_tests.cpp: for 200 seeds, apartment and hotel, sample col_off at consecutive segment starts on non-pinned lanes; assert it changes at every segment. At lane_offsets 3 the chance it holds for a sample of that size is near zero, so it fails today. Green after the col_off and row_off change in layout.cpp. Then re-run, unchanged: walk_tests (12/8/8/12 seeds), the layout order, thread and face-agreement tests, void tests, and the dial bands. The bands may need a named amendment, as hotel loops did for lever 1 (dial_tests.cpp:30-33). Every seed's world changes, as for any hash change; gen.h:137 calls its own such change "a generator change, made on purpose".

Keep it apart from `l189-drops` and `d665-variety-b` work (their emit.cpp edits overlap).

## 5. Costs, risks, conflicts

- **Walk proof and drops.** Jogs add turns, so more edges to prove; the proof is per edge from a standing start and never checks a line at speed [read exo_memory/loop/procgen_scout_00_generator_as_built_2026-11-13.md:65]. I expect a jog adds no drop [inferred], but the l189 harness must be re-run on the result.
- **Voids.** void_site needs straight corridor floor for the run and run-up [code voids.cpp:110-117]. Forced jogs shorten straights and may cut wall-run voids, which are already about 8 in 44,000 cells [read scout 00:76]. Measure that before keeping the change.
- **Hunter model.** The cop-win result assumes equal speed [read-sum above]; the hunter here is faster with a path factor, so a topological loop count says nothing alone. The judge must be timed, as Parks are. Pac-Man's no-reverse rule is pursuer-side, in chase/ [inferred].
- **Chained safety.** Forum complaints about chained strong loops and "god windows" are player opinion in the sources I read [read-sum]; a run with endless juke loops never ends. His dead ends [his 7] are the counterweight; technique 2 needs a spacing floor, not only a count.
- **Overlap.** Techniques 1 and 3 touch the same functions as any scout of lane fields or an intent layer above lanes. Run them together.
- **Authority.** The Pech classifier is 70 hand-labelled areas from one other game; the strong/weak rule is a fan designer's.

## 6. Not read

- Booth's L4D talk audio or video, and any Valve level-design talk (the AI slides only).
- Behaviour's own talk on tile and loop design: none found; the DBD rules above are from a fan designer and a community wiki.
- The original Dormans paper and Boris the Brave's lock-and-key article: only the two pages above, through a summarising fetch.
- The last 20,329 characters of the Pac-Man Dossier; the Pech paper's results tables were skimmed, not checked.
- Hullett and Whitehead 2010 (FPS design patterns): cited only through Pech's text.
- Nextbot chase maps, Mirror's Edge route design, and academic isovist work beyond Pech: searched or named, no primary page opened.
- Wikipedia's "Cops and robbers" page: 404; only the cop-win page was opened.
- No figure from the game repo was re-run.

## Verification (second reader, 2026-11-13)

Paths for [code] are under gen/src/ (gen/tests/ for tests) at commit 04f3882, which `git log -1` confirmed.

- [his 179] "way too repetitive", "cool pathways with intent mixed into the randomness": ok (brief line 1203).
- [his 91] "way too repetitive": ok (brief line 748).
- [his 18] "letting you in a way juke the entities": ok, wraps lines 98-99 of the brief. [his 41] has only "juke entities" (line 361), not that phrase.
- [his 7] "dead ends eventually ... will end runs eventually" and "the entity has to route around": ok (lines 30-37).
- [his 8] "a breather and a chance to get ahead of it": ok (line 40).
- [his 28] "evading it without line of sight": WRONG as a verbatim quote. Line 213 reads "continually evade it without line of sight". The sense is right.
- [code] layout.cpp:176 col_off, :189 row_off, one hash per segment, lane pin at :179-183: ok (hash line 186; pin at 178-183).
- [code] layout.cpp:214 row_site, :231 col_cut, :240 pre(), independent hash vs loop_density: ok.
- [code] layout.cpp:387 flat dead-end rate: ok.
- [code] gen.h:30 kBand 6 (18 m lattice): ok. gen.h:137 "a generator change, made on purpose": ok.
- [code] graph.cpp:77 (detour_seconds) and :145 (row_rep_site) Park judge: ok. graph.cpp:70 for hunter_seconds: function starts at :67 and the negative default is at :73, so :70 is inside the switch but not the claimed line.
- [code] voids.cpp:96 void_site: ok. :110-117 run-up and run-out of lane floor: ok (check at :112-113). The "fixed 12-cell phase, no detour judge" part was not opened.
- [code] measure.cpp:170 loops block and :185 dead ends: ok. biome.cpp:214 and graph.cpp:223 spawn(): ok.
- [code] dial_tests.cpp:38-44, apartment loops 12-26 and climb-out 25-45%: ok. The hotel-loops amendment comment is at :32-34, not :30-33 as written: WRONG by about two lines.
- [code] walk_tests seeds 12/8/8/12: ok (walk_tests.cpp:64, 84, 101, 119). The two-thread test is at layout_tests.cpp:100: ok.
- [code] d665-variety-b has a Chute in layout.cpp, and l189-drops and d665-variety-b both touch emit.cpp: ok (git diff and git show).
- [read] p-d665-gen-data-B_2026-11-11.md: 85 of 90 corridor-type samples (94%), median 49 cells (about 147 m): ok, at lines 30-45. The cited :34-41 is approximate.
- [read] scout 00 :65 (walk proof) and :102 (Chute, step 3): ok. The :76 line (wall-run, about 8 voids in 44,000 cells): ok.
- [read] Booth, L4D AI (PDF text extracted with pdftotext): ok. Flow Distance, "Not purely random, nor deterministically uniform", mobs 90-180 s, 75% from behind, specials "not visible", pacing 3-5 s and 30-45 s all present. One gap: Flow Distance is defined from the starting safe room, which matches the doc. No licence stated on the PDF: ok.
- [read] Pech et al. 2016 (PDF extracted): ok. 70 area instances from one game (Savage), isovist and graph metrics, five area types. The doc says "no licence". The PDF's footer is a DiGRA notice (personal and educational use allowed, commercial needs permission), which the doc does not report.
- [read-sum] Cop-win graph (Wikipedia): ok, including CC BY-SA 4.0.
- [read-sum] Dormans via Game Developer and Boris the Brave: WRONG in quote form. The doc quotes "Most maps ... only a couple of embedded cycles"; the Game Developer page says "the average map in the game only contains a couple of embedded cycles". The collapsing bridge lock is on the Game Developer page, not the Boris page. Boris has "major cycle type" and "short detours".
- [read-sum] Callum Stables page: WRONG in quote form. It reads "loops should not connect together in such a way where multiple 'strong' loops are linked", not "loops should not chain strong ones together". The other figures (about 90 m, about 20 s at 4.6 m/s, Deadzones) are ok.
- [read-sum] Dead by Daylight wiki Maze_Tiles: ok on eight families, "same general location", and jungle gym two pallets to one. The window and pallet on opposite sides is stated only for Jungle Gyms, not every tile. The licence is CC BY-NC-SA 3.0, which the doc does not state.
- [read-sum] Alien: Isolation: WRONG in quote form. The page says designers could "dictate specific areas the alien never looks", not "can also mark areas it never looks at, to avoid unfair ambushes". The menace-gauge pullback is ok.
- [read-sum] Pac-Man Dossier: ok on no-reverse, one tile ahead, Pinky, Clyde. The wording is "circling the island indefinitely".
- [read-sum] Game Developer, Behaviour on procedural maps: could not check, not re-opened this pass.
- (d) Nothing marked [read] appears to be from memory. The four WRONG quotes above are paraphrases inside quotation marks.

Totals: 28 checked, 21 ok, 6 WRONG (his 28 quote; dial_tests lines :30-33; Dormans quote; Stables quote; Alien quote; graph.cpp:70), 1 could not check.
