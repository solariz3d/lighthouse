# Procgen scout 08: a world that answers the player (2026-11-13)

Game repo read at commit 04f3882 (main). Nothing was built or run. Marks: [read] opened source, [code] file:line, [inferred] my reasoning, [ours] a proposal with no source. His words are cited as [his N] from briefs/dreamzone2_the_game.md. Generator facts come from loop/procgen_scout_00_generator_as_built_2026-11-13.md (scout00).

## 1. What the sources do

| source | what it says | mark |
|---|---|---|
| Booth, "The AI Systems of Left 4 Dead" (Valve, 2009), cdn.fastly.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf (no licence shown) | A per-survivor "emotional intensity" rises on damage and nearby deaths and decays unless infected are engaging. Four states: Build Up, Sustain Peak (3 to 5 s), Peak Fade, Relax (30 to 45 s or until the team has travelled far enough). "Amplitude (difficulty) is not changed, frequency (pacing) is." Population is "Structured Unpredictability = Superposition of several of these population functions", each randomised in space or time (mobs every 90 to 180 s, 75% from behind). Designers place candidate caches and "the AI Director chooses which will actually exist", so that "prediction of possible locations" allows "visual storytelling/intention". Future work: "Expand repertoire of verbs available to the AI Director." | [read] |
| Booth, "Replayable Cooperative Game Design" (Valve GDC 2009), same CDN | "Low probability + High drama = Memorable"; "Set up many possible moments, knowing few will happen at any run." | [read] |
| Yannakakis and Togelius, EDPCG extended abstract (2015) | Player model, content quality, representation, generator. Gameplay-based player models are cheapest but "low-resolution". Quality functions are direct, simulation-based (an agent plays the content) or interactive. A random seed is the "most indirect" representation. | [read] |
| Shaker, Togelius, Yannakakis, ch. 10, pcgbook.com/chapter10.pdf (no licence in the text) | Adaptation is "about more than just difficulty". Personalisation builds the next level from the style shown in the previous one, using only "the recent playing style"; agents with different styles test it. | [read] |
| Hunicke and Chapman, "AI for Dynamic Difficulty Adjustment in Games" (2004), users.cs.northwestern.edu/~hunicke/pubs/Hamlet.pdf | Reactive actions change what is "on stage"; proactive ones change "off stage" things and are "less likely to interrupt the player's suspension of disbelief" but are harder to judge and can spiral. Cost depends on location, progress, deaths, repeats, past interventions. | [read] |
| Thompson, "The Perfect Organism: The AI of Alien: Isolation", Game Developer, 2017 (secondary; fetch summary) | The director always knows where the player is and gives the monster only hints; menace comes from proximity; at peak the director "backs off". | [read] |
| Siliconera interview, Silent Hill: Shattered Memories (fetch summary) | "Literally everything you do factors into your profile"; not branching. No mechanism given. | [read] |

Leads confirmed: EDPCG, the L4D director, pacing by state. Discarded: physiology models and questionnaires [inferred].

**Determinism rule for every technique below** [inferred]. Content may depend on three tiers. T0: seed and coordinates (gen/src, pure; layout_tests.cpp:52, :100; the fingerprint equal under slow and preloaded workers, HANDOFF.md:36). T1: a run profile fixed at run start and written into the run record, so it is part of the world key. T2: live run state, read at tick boundaries by the director only. gen/src never reads T2. Hamlet's off-stage idea [read], made exact. Replay is inputs plus settings (game/world/run_record.h:14-15 [code]).

## 2. Five techniques, strongest first

| # | technique | gives a run | his words |
|---|---|---|---|
| 1 | Run profile in the world key (chapter, carried stress, character) | The dreamer's psyche: later chapters pull far biomes close, high carried stress tilts the mix. Replays exact. | "the seeds get more chaotic and the further biomes become closer to reach" [his 28]; "manifestations of the space from the player characters psyche" [his 26] |
| 2 | A pure pace field (Booth's superposition of population functions, on layout) | Stretches that build and stretches that breathe at 100 to 300 m, so a long run is not a stationary stream. | "the proc gen does get way too repetitive over time" [his 91]; "always fast paced survival" [his 18] |
| 3 | Director verbs on pure candidates (L4D caches; our measure-then-keep) | In Relax the director points at a kept Park or designed piece ahead; in Build Up it leaves the world quiet. Intent inside randomness. | "cool pathways with intent mixed into the randomness" [his 179]; "a YES lets go moment" [his 8]; "real pieces to be imbeded into the seeds" [his 26] |
| 4 | Simulation-based evaluation as the instrument (EDPCG quality function) | A number for repetition and pacing, so 1 to 3 are accepted by measurement. | "way too repetitive" [his 179]; B's 94% corridor, 2 rooms in 90 samples (handback/p-d665-gen-data-B_2026-11-11.md:34-41) |
| 5 | Style summary from the run record into the next profile (gameplay-based model) | Each dreamer's next world leans toward or away from the verbs they use. | "all of the ideas we have already" [his 179]; "they fixate on fear and instability" [his 28] |

## 3. Where each attaches [code]

| # | attach point | note |
|---|---|---|
| 1 | gen/src/gen.h:257 GenParams; biome.cpp:214 biome(), distance term :226-232; game/world/run_record.h:41-48 | `GenParams.biomes[i].weight` is already per-run data. chase/README.md:213-215: nothing drives the generator's dials, "the generator has no way to vary a dial with distance". |
| 2 | gen_impl.h:12-42 Salt enum (append last); call sites layout.cpp:218, :234 (`loop_density * r.loops`) and block() :318; pattern emit.cpp:28 lit_field() | rules() returns a reference into the biome table (gen_impl.h:165): scale at the call site. |
| 3 | chase/run.cpp:1146 Run::direct (intensity_ from lesser chasers only; verbs are spawns, chase/README.md:171-183); chase/run.h:43-61 ReprieveFact, WorldFacts, added at tick boundaries (:220-224); graph.cpp:167-174 site_kept | The facts the director needs are already handed to the Run. |
| 4 | chase/bots.cpp, the competent and poor policies (chase/README.md:369); gen/tests/dial_tests.cpp:75; measure.cpp:129 | No generator change. |
| 5 | game/world/run_record.h (.dzr inputs, replay headless) | A pure function of a recorded run. |

## 4. Smallest first step, with the test that is red first

**Step 1.** Add `WorldProfile {chapter, stress}` (default zero, identity) to GenParams; in biome() scale `dist` by `1 + k*chapter`; write the profile into RunRecord and its text. Files: gen/src/gen.h, gen/src/biome.cpp, game/world/run_record.h and .cpp. Red tests: in gen/tests/layout_tests.cpp beside :302, `a_chapter_pulls_far_biomes_closer_and_the_default_profile_changes_nothing`: (a) over 8 seeds and the :302 grid, the sum of biome ids at default equals a number captured from 04f3882 before the edit; (b) the apartment's share of non-home regions at chapter 3 is below chapter 0; (c) the order-independence check at :52 repeated with chapter 3. In game/tests/run_record_tests.cpp (near :177): the profile round-trips and replay gives the same state_hash. Red because the field does not exist. Margin in (b) not measured. Where dz-world builds GenParams was not read.

**Step 2.** `pace_field(seed, profile, x, z)`: smooth 2D value noise, span about 40 cells [ours], new salt appended last, built like lit_field. Multiply loop_density, dead_end_rate and block_open at their call sites by `1 + amp*(f-0.5)`; amp is a new dial, default 0. Files: gen_impl.h, layout.cpp, gen.h. Test in dial_tests.cpp, `the_pace_field_makes_a_long_walk_non_stationary`: over 8 seeds, variance of cross-corridor share across 200 m windows on a 3 km line is larger at amp 1 than 0, and the kExpect bands (:37-42) hold at amp 1. Red: the dial does not exist. Raising amp changes every seed's world, "made on purpose" (gen.h:136-137).

**Step 3.** On entering Relax, Run::direct picks the nearest ReprieveFact within 60 m ahead of the player's heading and logs a new EventKind::Lead. No geometry, no cue. Files: chase/run.h, chase/run.cpp, chase/tests/rule_tests.cpp. Test: over the bot seeds each Relax with a known Park ahead logs one Lead, and the state_hash is the same under normal and preloaded workers. Red: no such event.

**Step 4.** A tool running the bots over 48 seeds that prints peaks per minute, the share of Relax windows with a Park within 60 m, and the windowed variance of step 2. Test: identical on two runs; differs between amp 0 and 1. Red until step 2.

**Step 5.** Pure `style_summary(RunRecord)`: counts of slide, wall-run, climb, drop and share of time in corridor, from a headless replay. Test: two bot policies differ; one record gives one summary twice. Drives nothing yet.

## 5. Costs, risks, conflicts

- **Walk proof.** Steps 1, 2, 5 change which pieces appear, not how one is built, so per-edge proof (walk_tests.cpp:59-159) still holds; the multi-edge gap stays (scout00 section 3). Run the drop harness (origin/l189-drops) on a chapter 3 profile before landing [ours].
- **Purity.** A director that edits geometry from T2 would break layout_tests.cpp:52 and the fingerprint rule, so step 3 stays geometry-free. Later door arming must be proved open and closed in the walk graph [inferred]. Hamlet warns proactive changes can spiral [read].
- **Unguarded biomes.** dial_tests.cpp:37-42 bounds apartment and hotel only; a pace field in school or hospital has no band [code].
- **Merge.** origin/d665-variety-b 151aead changes 7 files that main also changes, emit.cpp among them (scout00 section 6). Steps 1 and 3 touch biome.cpp, gen.h, run.cpp; land after it or hand merge [inferred].
- **Hint, not route.** Alien: Isolation gives its monster hints only [read]; our hints already carry an error radius (run.cpp:1016), and Lead must stay a place, not a path [inferred].
- **Overlap.** Step 2 overlaps any scout proposing multi-scale fields: build one field. Step 3 overlaps designed pieces and Parks: their candidates, this scout's arming [inferred].
- **Personal data.** A style summary stays on the machine [ours]. No physiology, no sentiment model.
- **Not measured.** k, span, amp, 60 m and all margins are [ours] starting values; no figure was run.

## 6. Not read

- Yannakakis and Togelius, EDPCG, IEEE Trans. Affective Computing 2011 (paywalled; the 2015 abstract was read).
- Togelius et al., "Search-Based PCG: a taxonomy and survey" (download returned 2.5 KB); its necessary/optional and deterministic axes are not cited.
- Any Creative Assembly talk on Alien: Isolation (only Thompson's article).
- Left 4 Dead 2 "Director 2.0" coverage (not opened): L4D2 route and weather changes are not claimed.
- Silent Hill: Shattered Memories primary sources.
- gen/tools, bots source beyond README, and where dz-world builds GenParams.

## Verification (second reader, 2026-11-13)

Repo read at 04f3882 (matches the commit cited). Brief grepped at briefs/dreamzone2_the_game.md.

- [his 8] "a YES lets go moment": ok (line 44, inside item 8, which runs 38 to 44).
- [his 18] "always fast paced survival": ok, verbatim across a line break (brief lines 100-101).
- [his 26] "real pieces to be imbeded into the seeds": ok (brief line 166). The cited words are "design real pieces to be imbeded into the seeds".
- [his 26] "manifestations of the space from the player characters psyche": ok (brief lines 167).
- [his 28] "the seeds get more chaotic and the further biomes become closer to reach": ok (brief line 223, inside item 28, which runs 205 to 234).
- [his 28] "they fixate on fear and instability": ok (brief line 212).
- [his 91] "the proc gen does get way too repetitive over time": ok (brief line 748).
- [his 179] "cool pathways with intent mixed into the randomness", "way too repetitive", "all of the ideas we have already": ok (brief line 1203).
- [code] gen/src/gen.h:257 GenParams: ok.
- [code] gen/src/biome.cpp:214 biome() and :226-232 distance term and per-biome weight: ok.
- [code] game/world/run_record.h:14-15 (inputs plus settings are the whole run) and :41-48 (RunRecord fields): ok.
- [code] gen/src/gen_impl.h:12-42 Salt enum (last entry kSaltFalseDoor, so "append last" holds) and :165 rules() returning a reference: ok.
- [code] gen/src/layout.cpp:218 and :234 (loop_density * r.loops), :318 block(); gen/src/emit.cpp:28 lit_field(): ok.
- [code] chase/run.cpp:1146 Run::direct, :1016 the director's hint (a place, not a player; the error radius itself is on the lines just after 1018, not opened): ok.
- [code] chase/run.h:43-61 ReprieveFact/WorldFacts and :220-224 facts added at tick boundaries: ok.
- [code] gen/src/graph.cpp:174 site_kept: ok. The doc writes "graph.cpp:167-174" without the gen/src/ directory; chase/graph.cpp does not exist, the file is gen/src/graph.cpp. Minor path error.
- [code] gen/tests/dial_tests.cpp:37-42 kExpect holds apartment and hotel only: ok. :75 the dial test: ok. gen/tests/layout_tests.cpp:52, :100, :302: ok. gen/tests/walk_tests.cpp:59-159: ok. game/tests/run_record_tests.cpp:177 round-trip test: ok.
- [code] chase/README.md:213-215 (nothing drives the generator's dials): ok. :171-183 (spawn and pacing rules): ok. gen.h:136-137 ("made on purpose"): ok.
- [code] "measure.cpp:129": ok only with the path gen/src/measure.cpp (the doc gives no directory); measure() is at line 129.
- WRONG: handback/p-d665-gen-data-B_2026-11-11.md:34-41 is cited for "B's 94% corridor, 2 rooms in 90 samples". Lines 34-41 give corridor 79, cross-corridor 6, room 2 of 90 (the 94% is 85 of 90 summed by the reader, not stated there). The statement "94% of his route is corridor" is at line 64 of that file. Cite :64-65 for 94% and :36-37 for the 2 rooms.
- [read] Booth, AI Systems of L4D (pdf re-opened): the four states, Sustain Peak 3-5 s, Relax 30-45 s, mobs every 90-180 s, 75% from behind, "Superposition of several", "which will actually exist", "Prediction of possible locations", "visual storytelling/intention", "Amplitude (difficulty) is not changed, frequency (pacing) is", "Expand repertoire of verbs": ok. No licence text in the PDF: ok as stated.
- [read] Booth, Replayable Cooperative Game Design: ok ("Low probability + High drama = Memorable", "Set up many possible moments, knowing few will happen at any"). The doc gives only "same CDN" and no URL, which fails the rule that [read] carries a URL; I found it at cdn.fastly.steamstatic.com/apps/valve/2009/GDC2009_ReplayableCooperativeGameDesign_Left4Dead.pdf.
- [read] Shaker, Togelius, Yannakakis ch. 10 (pcgbook.com/chapter10.pdf re-opened): "adaptation is about more than just difficulty" and "only considers the recent playing style": ok. No licence stated in the text: ok.
- [read] Hunicke and Chapman (Hamlet.pdf re-opened): on stage versus off stage, proactive changes "in the wings", suspension of disbelief, "spiraling loop": ok. The cost-factor list (location, progress, deaths, repeats, past interventions) was not individually matched.
- could not check: Yannakakis and Togelius EDPCG 2015 abstract row (no URL or path given in the doc, so it fails rule (d); not re-opened).
- could not check: Thompson, Game Developer 2017 (Alien: Isolation) and Siliconera Shattered Memories rows: no URL given, marked "fetch summary"; fails rule (d) as written, not re-opened.
- could not check: branch facts origin/d665-variety-b 151aead (the hash matches, 7-file overlap with main not counted), origin/l189-drops (exists), "scout00 section 3 and 6" (file exists, sections not opened).

Totals: 51 checked, 44 ok, 1 WRONG (plus 2 minor path omissions counted ok), 3 could not check, 1 [read] source lacking a URL.
