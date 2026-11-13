# Procgen scout 07: measuring sameness and steering variety (2026-11-13)

Game repo read at commit 04f3882. Marks: [read] opened source; [code] file:line; [inferred] my reasoning; [ours] proposal. "Page summary" means the page was fetched through a summarising fetcher, so the wording is the fetcher's, not the page's. The generator as built is `loop/procgen_scout_00_generator_as_built_2026-11-13.md`; his words are `briefs/dreamzone2_the_game.md`. Nothing was built or run.

## 1. What the sources do

| source | what it does | mark |
|---|---|---|
| Smith and Whitehead, "Analyzing the Expressive Range of a Level Generator", 2010 (pcgworkshop.com/archive/smith2010analyzing.pdf; no licence shown) | Three steps: pick metrics that are global and "emergent" rather than the generator's own inputs; generate a large sample (their graphs use 10,000 levels); plot 2D histograms to see "peaks of commonly created content and holes". Their two metrics were linearity and leniency. Finding that matters here: a late tweak that raised the chance a component repeats (added to give local rhythm) produced an unintended bias toward linear levels; "we never would have realized" without the plot. They call for player-behaviour measures, and difficulty or pacing, as better metrics. | [read] PDF text |
| Compton's "ten thousand bowls of oatmeal", as reported by Katherine Cross, Game Developer, 2017-02-27 | A million mathematically distinct objects are worth nothing if players cannot tell them apart. A small set of distinct things beats a huge set most players cannot distinguish; repeating trees is fine. Her test: "Would you write fanfic about this generated object?". "Curate the randomness", for example "barnacling" (medium things placed against big things). | [read] page summary of a report of the talk, not the talk |
| Boris the Brave, "Oatmeal spice", 2026-07-05 | Interest comes from removing freedom: pick a few big decisions per output; choose from 2 to 4 discrete values, not a continuous range; keep feature flags rare (none above about 10%); correlate properties instead of drawing each independently; for one large piece give regions different big decisions and blend them (Voronoi, recursive subdivision). | [read] page summary |
| "Why Oatmeal is Cheap: Kolmogorov Complexity and Procedural Generation" (arXiv 2305.02131) | Variety alone does not give interest. Randomly recombining parts scales the output space but adds no design knowledge. More pattern density, with confounding elements that blur template edges (Spelunky is its example), reduces predictability. It proposes no perceptual measure and points to expressive range analysis for measuring. | [read] page summary |
| Mouret and Clune, MAP-Elites (arXiv 1504.04909) | Choose a performance function and N feature dimensions, each cut into cells. Generate G random solutions and file each in its cell (keep the better). Then repeat: pick a random filled cell, mutate its solution, score it, file it if the cell is empty or it beats the occupant. Output is a map of the best solution per cell. Some cells can never be filled. | [read] PDF text |
| Gravina et al., "Procedural Content Generation through Quality Diversity" (arXiv 1907.04053, IEEE CoG 2019) | QD for PCG gives a set of good, behaviourally different artefacts in one run. In the surveyed work "quality" is mostly a hard constraint, often playability checked by an A* agent. It warns that a fine partition makes coverage hard and a coarse one hides things. | [read] page summary |
| Lynch's five elements (paths, edges, districts, nodes, landmarks) via Wikipedia (CC BY-SA 4.0), and Upton's GDC 2007 talk via Game Developer, 2007-03-14 | Upton's use for levels: a landmark pulls ("If you attract people's attention, people tend to move toward it"); a path nobody considers is "wasted space"; each edge crossed introduces something new; things happen in nodes; a level with no nodes is the "Road to Nowhere"; three cadences (path-, edge-, node-dominated) and "If there is no downtime, it's hard for there to be an up". | [read] page summaries |
| Wellesley open-world navigation study (cs.wellesley.edu/~pmwh/mvmap) | Only 3 players analysed, 90 minutes of free play in two games. Only landmarks and edges emerged as themes; paths, nodes, districts did not reach coder agreement. Preliminary by its own account. | [read] page summary |

## 2. What it would give a run in this game

His words: "way too repetitive" and "cool pathways with intent mixed into the randomness" [his 179]; "the proc gen does get way too repetitive over time" [his 91]; "designed areas with meaning" [his 26]; "the seeds get more chaotic" as chapters progress [his 28]; curated pieces that "can be mirrored and interchangably linked" [his 93].

| technique | in a 5-minute run |
|---|---|
| 1. Route-level expressive range | A number for "repetitive", before and after every change. B's 450 s measurement (94% corridor, 2 rooms in 90 samples, median straight 49 cells, `handback/p-d665-gen-data-B_2026-11-11.md:34-41`) was a one-off scratch row; this makes it a repeatable instrument. |
| 2. Region profiles | A 70 m stretch has one clear character (long hall with jogs; a short-cell warren; a lit atrium run), chosen from 2 to 4 profiles and correlated, so a change of profile is felt where a change of biome number is not. |
| 3. Landmark, node and line | The runner sees something at the far end of a straight and runs toward it: a "pathway with intent". The line ends in a node, so no Road to Nowhere. |
| 4. QD over dials | A library of tested profiles that spans the space instead of one tuned peak. |
| 5. Cadence contrast | Fast straight, then reveals, then a node, then fast again; downtime makes the chase feel like an "up". |

[inferred] for the felt effects: the sources support the mechanisms, not that this game's runners will feel them.

## 3. Where it attaches in our generator

| technique | attach point |
|---|---|
| 1 | Read side only. `measure.h:46` Metrics and `measure.cpp:129` measure() already read the assembled walk graph; `WalkNode` carries `kind` (`gen.h:356`). A route profile walks `Assembled` (`measure.h`) and reports per 60 s window. Today's per-seed bands (`dial_tests.cpp:37-42` kExpect, test at :75) are block means, so they cannot see a corridor rhythm. dz-gen (`gen/tools/dz-gen/main.cpp`) gets a `range` subcommand. |
| 2 | A per-region discrete profile hash beside `lit_field` (`emit.cpp:28`, the one existing mood field), read by `col_off`/`row_off` (`layout.cpp:176-193`, now an independent hash per segment) and `block()` (`layout.cpp:318`); the profile menu is new `LayoutRules` rows (`gen.h:149`). A profile id picks which `LayoutRules` the existing `rules(x,y,z)` returns, so the code still never asks which biome. |
| 3 | An intent layer in `pre()` (`layout.cpp:240`) above lanes; precedent for a higher layer pinning lanes: `layout.cpp:179-183`. Placement by coordinate hash like the home region (`biome.cpp:214`). Keep-only-if-measured: precedent `graph.cpp:77` detour_seconds. A landmark region kind beside `kRegionReprieve` and `kRegionVoid` (`core/scene.h:106-109`), emitted at `emit.cpp:611-657`. The node is the existing atrium (`layout.cpp:23`). |
| 4 | Offline only: genome is a vector of `kDialSpecs` (`gen.h:88-99`) plus profile numbers; evaluation is generate then measure. Output is a compiled-in constants table, so the world stays a pure function of seed. |
| 5 | The contrast term in `biome()` (`biome.cpp:214`; E's lever 6, `handback/p-d665-variety-E_2026-11-11.md:55`) applied to profiles, not only biome ids; biome ids are visited in id order (`biome.cpp:236-242`, [inferred] in scout 00). |

## 4. The smallest first build step

**Technique 1, the route profile.** No generator change, so nothing it must not break can break.

- Touches: new `gen/src/route_profile.h` and `.cpp`; `gen/CMakeLists.txt:47-52` (library sources) and `:65-70` (tests); new `gen/tests/range_tests.cpp`; `gen/tools/dz-gen/main.cpp` (a `range` subcommand).
- The function: from the spawn (`gen.h:435`), a deterministic forward runner on the assembled graph (least turn first, ties by hash) for 450 s at sprint speed. Per 60 s window it reports the share of corridor, cross-corridor, room, node (Hall) and vertical cells; median straight run; turns per 100 m; distinct edge types used; and the "sameness run": seconds since the coarse place signature (kind, straight-run bucket, ceiling bucket, biome kit, lit bucket) last changed. These are emergent, not dial inputs, as Smith requires. All definitions are [ours].
- Red before: `range_tests.cpp` does not build (no function). Tests, in order: a line of only corridor cells scores corridor share 1.0 and a sameness run equal to the whole window; a line through an atrium scores below 1.0; one seed gives the same profile in any chunk order and thread (copy the shape of `layout_tests.cpp:52`). Green after: those three.
- Then, still no gate: print the 2D histogram (straight run by room share) for 200 seeds per biome and record the baseline in `gen/CHANGES.md`. Only after the baseline exists add a gate, for example "no more than N% of 60 s windows have a sameness run over 40 s"; the figures come from the baseline, not from this note.
- Optional second input: a replay such as `game/runs/run-20261111-221301.txt` (B's source) as the route, to check the runner model against a real runner.

## 5. Costs, risks, conflicts

- **Route model bias [inferred].** A simulated runner is not him; B's real route is the check. Report both.
- **Smith's warning applies to technique 2.** A correlation added for rhythm moved their whole range, so every profile change needs the histogram before and after. `kExpect` bands (`dial_tests.cpp:37-42`) exist for apartment and hotel only, so school and hospital profiles are unguarded until bands are written. Add per-profile bands; do not widen or remove an existing one to fit.
- **Bands are the sameness.** Narrow mean bands pin every seed to one peak. QD wants hard feasibility (connectivity, walk proof, detour rule) and wide bands; whether to change the test regime is the keeper's call [ours].
- **Compute.** MAP-Elites needs many generate-and-measure evaluations; the 200-seed dial test is the unit of cost and its time was not measured. The machine is busy; run after the drop harness (origin/l189-drops) lands. Every shipped profile must pass the walk proof (`walk_proof.cpp:266`).
- **Landmarks.** The walk proof is per edge from a standing start; a sightline and a runner being pulled toward a landmark are not proved by it, so a new sightline test is needed. Cell flag bits are full (`gen.h:291-300`, scout 00), so a landmark is a Region, not a flag. Whether nav ignores an unknown region kind was not checked. The Wellesley evidence is n=3 and Upton's is a talk report: weak support, so ship the measurement first.
- **Merge order.** origin/d665-variety-b (151aead) changes `emit.cpp`, where regions are emitted; land or rebase it before technique 3. E's levers 2 (pass-through rooms), 3 (moods) and 4 (landmarks) overlap techniques 2 and 3 and should share one profile hash, not add three.
- **Safety of intent.** A landmark that draws the runner is also a place the hunter can corner him; keep the detour and dead-end bands as the gate [inferred].

## 6. Not read

- Lynch, *The Image of the City* (book): in copyright; only secondary pages read.
- Compton's talk or slides: only Cross's report.
- Danesh papers (Cook, Gow, Colton 2016; the later journal version): only search-result abstracts.
- Summerville's ERA visualisations, Spelunky generator write-ups, Dormans on mission and space: named in other papers, not opened.
- Licence or terms of the Smith, MAP-Elites, Gravina, Cross, Boris and Kolmogorov pages: not shown.

## Verification (second reader, 2026-11-13)

Game repo commit 04f3882 confirmed (git log -1). Outside pages re-opened by fetch and by pdftotext on the downloaded PDFs.

- [his 26] "designed areas with meaning": ok (brief line 166, under item 26).
- [his 28] "the seeds get more chaotic": ok (brief line 223, inside item 28, which runs 205-234).
- [his 91] "the proc gen does get way too repetitive over time": ok (brief line 748).
- [his 93] "can be mirrored and interchangably linked": ok (brief line 768).
- [his 179] "way too repetitive" and "cool pathways with intent mixed into the randomness": ok (brief line 1203).
- [code] measure.h:46 Metrics, measure.cpp:129 measure(), gen.h:356 WalkNode with kind, Assembled in measure.h:12: ok.
- [code] dial_tests.cpp:37-42 kExpect holds only apartment and hotel; test at :75: ok.
- [code] emit.cpp:28 lit_field; layout.cpp:176-193 col_off/row_off with per-segment hash; layout.cpp:179-183 junction pin; layout.cpp:318 block(); layout.cpp:240 pre(); layout.cpp:23 atrium: ok.
- [code] gen.h:149 LayoutRules: minor, the struct begins at gen.h:151 (149 is its comment). Otherwise ok.
- [code] biome.cpp:214 biome() and home region (home test is at biome.cpp:222): ok; :236-242 id-order loop: ok.
- [code] graph.cpp:77 detour_seconds; core/scene.h:106-109 region kinds; emit.cpp:611-657 region emission (kRegionVoid at 637, kRegionReprieve at 644): ok.
- [code] gen/CMakeLists.txt:47-52 library sources and :65-70 test list; gen.h:88-99 kDialSpecs; gen.h:291-300 cell flags (8 of 8 bits used); gen.h:435 Spawn; walk_proof.cpp:266 prove_block; layout_tests.cpp:52 any-order test: ok.
- [code] gen/tools/dz-gen/main.cpp exists: ok.
- [code] game/runs/run-20261111-221301.txt: could not check, the file is not in this checkout (game/runs holds 20261112 files). B's handback names it at p-d665-gen-data-B_2026-11-11.md:9, so the citation is right but the file must come from the machine that made the run.
- [ours/read] handback p-d665-gen-data-B:34-41 (79 corridor, 6 cross, 2 room of 90; median 49 cells) ok; "94% corridor" is 79+6 = 85 of 90, corridor plus cross-corridor (B line 64 says 94% corridor), so the note's "94% corridor" lumps cross-corridors in. E lever 6 at p-d665-variety-E:55: ok. Branch tips origin/d665-variety-b = 151aead and it changes emit.cpp: ok; origin/l189-drops exists (260553b).
- [read] Smith and Whitehead 2010 (pdftotext of pcgworkshop PDF): 10,000 levels, linearity and leniency, "peaks of commonly created content and holes", late-added repeat-probability tweak biasing linearity, "we never would have realized": ok. Licence: WRONG, the note says "no licence shown"; the first page carries "Copyright 2010 ACM" with the ACM permission-to-copy notice (personal or classroom use free, otherwise permission or fee).
- [read] arXiv 2305.02131 (abstract page and PDF): title ok; randomly combining subcomponents grows the possibility space "without adding any new encoded knowledge" ok; Spelunky blends templates with continuous randomness via confounding elements ok; expressive range analysis named in related work ok. Licence: WRONG, the abs page shows CC BY-NC-SA 4.0; the PDF itself says copyright held by the owner/author(s), publication rights licensed to ACM (FDG 2023). "Proposes no perceptual measure": could not confirm beyond a keyword search finding none.
- [read] arXiv 1504.04909 (MAP-Elites): title and authors ok; the abs page gives no algorithm steps, so the procedure as written was not confirmed from the page I opened (the PDF was not fetched). Licence: the page links arXiv's non-exclusive distribution licence, so "not shown" is slightly off.
- [read] Cross (Game Developer 2017-02-27), Boris the Brave "Oatmeal spice", Upton GDC 2007 via Game Developer, Gravina et al. 1907.04053, Wellesley study, Lynch via Wikipedia: could not check. The note gives no URL for any of them, which breaks the rule that a [read] needs a URL; a guessed Game Developer URL I tried returned only an index page. These rows should carry URLs or move to "Not read".
- Rule (d): the six rows above without URLs are marked [read] with no path or URL; treat as unverified until URLs are added.

Totals: 26 checks, 17 ok, 4 WRONG (Smith licence, arXiv 2305.02131 licence, MAP-Elites licence wording, "94% corridor" lumping), 5 could not check (replay file, MAP-Elites steps, and the url-less sources as a group, counted as 3 lines).
