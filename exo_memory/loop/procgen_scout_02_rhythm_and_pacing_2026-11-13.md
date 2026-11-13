# Procgen scout 02: rhythm and pacing for a running game (2026-11-13)

Game repo read at commit 04f3882. Marks: [read] opened and read; [read-sum] an HTML page whose text I saw only as a fetch-tool summary; [code] file:line in the game repo; [inferred] my reasoning; [ours] a proposal with no source. Cell = 3 m, a lane band = 6 cells = 18 m [code gen/src/emit.cpp:27]. Nothing was built or run.

## 1. What the sources do

**Smith, Treanor, Whitehead, Mateas, "Rhythm-Based Level Generation for 2D Platformers" (FDG 2009).** [read; full text of the PDF, ACM notice allows copying for personal or classroom use; expressiveintelligence.github.io/papers/smith-fdg-09.pdf]
- Two tiers. Tier 1 picks player verbs ("move", "jump") and their start and end times, so the rhythm is "that which the player feels with his hands" (sections 1, 4.1). Tier 2 turns verbs into geometry. "The separation of tiers ensures that the intended rhythm is always present, regardless of geometric representation."
- A rhythm has a length (5, 10, 15 or 20 s), a density (low, medium, high) and a beat type (regular, random, swing) (4.1). Jump geometry is sized from a physics model so the next beat cannot start before the last jump lands (4.2, 4.4).
- Levels are rhythm groups joined by rest platforms (5).
- Grammars "over-generate" and are good at local, not global, constraints. Fix: generate 1,000 candidate levels and pick by two critics, a distance to a designer-drawn line and a chi-square match of component frequencies (5, 8.3).
- Random platforms gave "no sense of flow" (8.1).
- Scope: the authors call Spelunky-style exploration games "not well-suited" to this approach (2).

**Smith and Whitehead, "Analyzing the Expressive Range of a Level Generator" (PCG workshop 2010).** [read, sections 4.2 to 6; pcgworkshop.com/archive/smith2010analyzing.pdf]
- Measure a generator by sampling 10,000 levels and plotting two global scores (linearity, leniency) as a 2D histogram.
- A small late tweak (a used component's chance of repeating is "slightly increased", added to make local patterns) caused an unintended linearity bias. "We never would have realized such a minor change had such far-reaching effects without it."

**Mawhorter and Mateas, occupancy-regulated extension (2010).** [read, related work, selection and weakness paragraphs; cs.hmc.edu/~pmawhorter]
- Chunks are anchored at positions a player might occupy; chunk choice is weighted by library weight, times used before, and a "precise" tag, which is how difficulty is steered.
- Weakness, stated: "by prioritizing variety, it fails to guarantee playability."

**Carvalho et al., SBGames 2013, endless runner.** [read, process and experiment paragraphs]
- Hand-made 1536x640 px chunks, 230 of them (99 easy, 62 medium, 55 hard, 14 bonus). Placement follows two discrete difficulty-over-time curves, one for the opening minutes and one that loops forever. A bonus chunk has no danger and exists so "the player can relax for some seconds".

**Sure Footing developer article (Game Developer).** [read-sum; gamedeveloper.com/design/keep-running-procedural-level-generation-in-sure-footing]
- Sprints (platforming) separated by rest pieces (street). An action grammar with a cost per action; rules ban repeats and certain follow-ons; 17 action generators swapped at runtime; budgets start tight and relax so difficulty ramps; each sector ends in a forced harder "tunnel" sprint. The author says the budgets are hand-tuned and there are over 30 parameters.

**Booth, "The AI Systems of Left 4 Dead" (Valve, GDC 2009).** [read; full slide text; cdn.fastly.steamstatic.com/apps/valve/2009/ai_systems_of_l4d_mike_booth.pdf; no licence shown]
- Director states: Build Up, Sustain Peak (3 to 5 s past the threshold), Peak Fade, Relax (30 to 45 s or until the team has travelled far enough). Intensity rises with damage and nearby deaths and decays toward zero, but not while enemies engage. "Algorithm adjusts pacing, not difficulty": amplitude is fixed, frequency moves. Population is "structured unpredictability": randomised intervals (mob every 90 to 180 s) and places chosen by flow distance (75% of mobs from behind).

**Alien: Isolation director.** [read-sum; gamedeveloper.com/design/the-perfect-organism-the-ai-of-alien-isolation] A menace gauge rises with proximity and line of sight; at its peak the director pulls the alien away; tension is meant to vary because players "can't be scared senseless all the time".

## 2. What it would give a run here

| his words | what a rhythm layer would do |
|---|---|
| [his 179] "way too repetitive", "cool pathways with intent mixed into the randomness" | gives every lane a beat score, so a run is a sequence of different kinds of moment, not a stationary stream (causes 1 and 2 of scout 00 section 4) |
| [his 91] "the proc gen does get way too repetitive over time" | B measured 94% corridor, median straight 49 cells (about 147 m), no exact repeat [read handback/p-d665-gen-data-B_2026-11-11.md:34-41]. So the fix is pacing, not more variants |
| [his 18] "it should be a always fast paced survival situation" and "the longer you run in a straight line, the entites slowly scale in top speed, making you have to turn" | a sprint beat then a decide beat makes the turn a designed moment. Sprint reaches 10 m/s after 8 s [code sim/params.h:35-38], so a 147 m straight is about 15 to 20 s of it |
| [his 134] "if you sprint for longer than 10 seconds, if you slide it resets your sprint" | a verb beat about every 8 to 10 s of running gives that reset something to land on [ours] |
| [his 8] a reprieve is "a YES lets go moment when you find one"; [his 14] wall-runs "rare and short" | rare verb and breath beats, never in two adjacent windows [ours] |
| [his 7] "more open ended than a few lines being a linear path or runner" | the rhythm must live on every lane of the lattice, not on one chosen line. Launchpad is one line, so only its idea transfers [inferred] |

## 3. Where it attaches in our generator

A lane window is 12 cells (36 m, about 4 to 5 s at 7 to 8.75 m/s) [inferred from code voids.cpp:25 kWindow = 2 * kBand].

| piece | where | change |
|---|---|---|
| beat function | new gen/src/pace.cpp, declared in gen_impl.h; a salt appended last in the enum at gen_impl.h:14 | pure function of seed, axis, lane, storey, window; no memo on the 21-bit key |
| straight length | layout.cpp:176 col_off(), :189 row_off() | today a fresh hash per `lane_segment` cells; the beat decides whether this boundary jogs. The pin beside junctions (:179-183) stays first |
| decisions | layout.cpp:214 row_site(), :231 col_cut() | the `loop_density * r.loops` chance is multiplied by the beat weight |
| verb moments | voids.cpp:96 void_site(), the hash at :103 against `void_rate` | weight by the beat; sizing stays voids.cpp:30 |
| breath | layout.cpp:318 block() `r.block_open`; graph.cpp:77 detour_seconds() for Parks | weight the room gate; keep the 5 s keep rule |
| director | chase/run.cpp:1146 Run::direct(), find_site near :1129 | reads the beat ahead (the director technique in the returned list) |

It must not break: pre() claim order (layout.cpp:240), spawn clear zone (voids.cpp:26), the per-edge walk proof (walk_proof.cpp:266), order and thread independence (layout_tests.cpp:52), and the drop harness on origin/l189-drops.

## 4. The smallest first build step

Step 0, no code in gen/. Baseline the beat statistic with B's route tools (`bots.sh`, `measure_row.js`, `v12.awk`, named at handback/p-d665-straights-B_2026-11-11.md:25-27; location not checked). Record, per biome, the lag-1 autocorrelation of straight length and the share of 12-cell windows holding any event.

Step 1. Add `pace` to the Dials table (gen.h:97 area), default 0, so every existing test is green by construction, and the beat function with the lane-jog consumer only (col_off/row_off).
- Files: gen/src/pace.cpp (new), gen_impl.h, layout.cpp:176-193, gen.h dials.
- Tests, written first, in gen/tests/layout_tests.cpp (macro as in dial_tests.cpp:75):
  1. `with_pace_on_straight_lengths_alternate`: 50 seeds, forced hotel, `pace` 1, runs of no-jog along 40 segments of one lane; lag-1 autocorrelation under -0.2. Today independent hashes give about 0 (noise about 0.02 at n = 2,000). Red now, green after.
  2. `with_pace_on_no_straight_passes_the_cap`: longest no-jog run at most 8 windows. Red now because lane runs are geometric multiples of `lane_segment` with no cap.
  3. `pace_zero_changes_nothing`: world fingerprint equal to main's. Green now and after.
  4. `with_pace_on_the_same_chunk_is_the_same_in_any_order`: the existing order test with `pace` 1.
- Also add a `pace` row to dial_tests.cpp:112 (each dial must move what it names).

Step 2 (after step 1 is green): enable per biome, run walk_tests (12/8/8/12), the drop harness, and the Step 0 measure. Land only if rooms and straights improve on the bots; E's lever 1 fell on exactly that check (rooms 10% to 7%) [read handback/p-d665-straights-B_2026-11-11.md:29-41].

## 5. Costs, risks, conflicts

- **Open lattice versus one line.** Rhythm works when the player must pass every beat in order. Here he picks the lane, so only a lane he stays on has a rhythm; turning picks up another lane's phase [inferred]. Smith excludes exploration games for the same reason (above).
- **Guard gap.** Connectivity bands exist for apartment and hotel only [code dial_tests.cpp:37-42]. Changing jogs in school or hospital is unguarded until bands are written first.
- **The Launchpad lesson applies to our grammar.** A repeat bonus meant to make patterns biased the whole range. Any grammar rule needs the expressive-range histogram before it lands. Run it in step 0 and again in step 2.
- **Beat timing needs one speed.** The generator's MoveReach says peak 8.75 m/s [code gen/src/gen.h:108] while the controller says 10.0 [code sim/params.h:38]. A void sized for 8.75 is 6.57 m against a 10 m/s jump that clears about 6.4 m by my arithmetic [inferred, not run]. Settle which speed before converting seconds to cells.
- **Merge conflict.** origin/d665-variety-b differs from main in 7 files including emit.cpp and adds the Chute in junction() [read exo_memory/loop/procgen_scout_00_generator_as_built_2026-11-13.md:99-103]. Keep beat code in a new file and touch few lines of layout.cpp.
- **Overlap with other families.** A route or spine layer that pins lanes would replace `along`; keep the beat's input an abstract distance, as L4D keys events on flow distance. Pass-through rooms and designed pieces are other scouts' work.
- **Fun is untested.** No source measures fun for this game. Smith's critics also assume the best-scoring candidate is the best level, and they admit one of the 999 rejected may be fun.


## 6. Not read

- Compton and Mateas, "Procedural Level Design for Platform Games" (AIIDE 2006): the AAAI page returned a bot-protection denial; known only from other papers' descriptions.
- Smith et al., Launchpad, IEEE TCIAIG 2011, and Smith's 2012 thesis (escholarship.org/uc/item/0fn558gq): found in search, not opened.
- Valve GDC 2009 "Replayable Cooperative Game Design"; Bray (nucl.ai) and Hope (GDC 2015) Alien: Isolation talks; DICE Mirror's Edge level design talks: search results only.
- Sure Footing AISB 2015 paper; Derek Yu's Spelunky material beyond the tinysubversions generator page (that page seen as a summary only).
- Game repo: gen/tests/gen_test_util.h, gen/tools/dz-gen, and the location of B's route tools.

## Verification (second reader, 2026-11-13)

Game repo read at 04f3882 (matches). Checks by opening the source each time.

**[his N] quotations** (brief: exo_memory/briefs/dreamzone2_the_game.md)
- [his 179] "way too repetitive", "cool pathways with intent mixed into the randomness": ok (line 1203).
- [his 91] "the proc gen does get way too repetitive over time": ok (line 748).
- [his 18] "it should be a always fast paced survival situation" and the "longer you run in a straight line, the entites slowly scale in top speed, making you have to turn": ok (item 18, line 93; the words wrap across lines in the file).
- [his 134] "if you sprint for longer than 10 seconds, if you slide it resets your sprint": ok (item 134, line 1041).
- [his 8] "a YES lets go moment when you find one": ok (line 44, inside item 8 that starts at line 38).
- [his 14] wall-runs "rare and short": ok (line 80, item 14).
- [his 7] "more open ended than a few lines being a linear path or runner": ok (line 29).

**[code] citations**
- gen/src/emit.cpp:27 cited for "lane band = 6 cells = 18 m": WRONG. emit.cpp:27 is kLitSpan = 6.0f (lighting span, "18 m, about half a chunk"). The band is gen/src/gen.h:30 `kBand = 6` ("one column lane and one row lane every 18 m").
- sim/params.h:35-38 "sprint reaches 10 m/s after 8 s": mostly ok; peak speed 10.0 is line 38, the 8.0 s sprint_peak_time is line 39 (just outside the cited range).
- gen/src/gen.h:108 MoveReach sprint_peak_speed 8.75: ok.
- voids.cpp:25 kWindow = 2 * kBand, :26 kClearOfSpawn, :30 void_size, :96 void_site, :103 hash against void_rate: ok.
- gen_impl.h:14 Salt enum: ok that the enum starts there (kSaltBiome); the last salt is at :41 (kSaltFalseDoor), so "appended last" means after :41.
- layout.cpp:176 col_off, :179-183 junction pin, :189 row_off, :214 row_site, :231 col_cut, :240 pre, :318 block, :218/:234 `loop_density * r.loops`, :331 `r.block_open`: ok.
- gen.h:97 area Dials table (kDials rows at :90-99), gen.h:152 lane_segment = 12: ok.
- dial_tests.cpp:75 DZ_TEST macro use, :112 each_dial_moves_what_it_names: ok.
- dial_tests.cpp:37-42 "connectivity bands exist for apartment and hotel only": ok (kExpect holds only apartment and hotel rows, with chaser_connected and player_connected ranges).
- layout_tests.cpp:52 order-independence test: ok. graph.cpp:77 detour_seconds: ok. walk_proof.cpp:266 is prove_block (block-level, not literally "per-edge"; the per-edge claim is in the file header of walk_tests.cpp): partly ok.
- chase/run.cpp:1146 Run::direct: ok. "find_site near :1129": WRONG as stated. find_site is defined at run.cpp:1084 and called at :937 and :1136; :1129 is make_body/group setup in another function.
- "walk_tests (12/8/8/12)": ok, matches handback text at procgen_scout_00 line 55 (12 default, 8 school, 8 hospital, 12 rare pieces); not run.

**Handback and loop citations**
- handback/p-d665-gen-data-B_2026-11-11.md:34-41 cited for "94% corridor, median straight 49 cells, no exact repeat": WRONG range. Median 49 cells and "Exact repeats: none" are at :34-41, but the 94% figure is at :64 (and the sample count at :35 is 79 corridor of 90 = 88%, a different measure from the 94%-of-route figure). Cite :64 for 94%.
- handback/p-d665-straights-B_2026-11-11.md:25-27 tool names (bots.sh, measure_row.js, v12.awk): ok. Rooms 10% to 7% falsifier at the cited area: ok.
- procgen_scout_00 lines 99-103 (d665-variety-b, 7 files, Chute): ok for Chute and 7 files; emit.cpp is not named in that range in what I read (grep found emit.cpp only at other lines), so "including emit.cpp" is could not check.

**[read] outside sources** (PDFs re-opened via pdftotext)
- Smith et al. FDG 2009: ok. Found: "The separation of tiers ensures that the intended rhythm is always present"; lengths 5/10/15/20 s and low/medium/high density; swing beat type; "no sense of flow"; critics over 1000 candidate levels; chi-square critic; sub-genre "not well-suited" (exploration-based, vs dexterity-based); ACM notice "personal or classroom use is granted without fee". The "5, 10" opening of the list is visible as "10, 15, or 20 seconds"; 5 s not separately seen (could not check that one number).
- Smith and Whitehead 2010: ok. 10,000 levels, linearity and leniency, "slightly increased" repeat probability added late, "such far-reaching effects" quote, Copyright 2010 ACM line present.
- Booth, L4D (Valve 2009): ok. 3-5 s Sustain Peak, 30-45 Relax, "Algorithm adjusts pacing, not difficulty", mobs at randomized intervals (90-180), 75% from behind, "Structured Unpredictability". No licence notice found in the text, as the doc says.
- Mawhorter and Mateas 2010; Carvalho et al. SBGames 2013: could not check (not re-opened in the time available).
- Sure Footing and Alien: Isolation Game Developer pages: could not check (not re-opened); correctly labelled [read-sum] by the author, not [read].

**(d) from-memory test:** no item marked [read] was found to lack a source; the only [read] with no URL is Mawhorter (cs.hmc.edu/~pmawhorter gives a site, not a paper path), which weakens it.

Totals: 41 checks, 34 ok, 3 WRONG (emit.cpp:27, handback :34-41 for 94%, find_site near :1129), 4 could not check (Mawhorter, Carvalho, Sure Footing/Alien pages, emit.cpp in scout 00 range); plus 2 minor cite-range notes (params.h:39, walk_proof "per-edge").
