# Procgen build path: one merged path from three proposals (2026-11-13)

Game repo read at commit 04f3882 (main), read-only. Nothing was built or run. Marks: [read] opened by me (his brief, the scouts and their second readers, hand-backs); [code] file:line in the game repo; [inferred] my reasoning; [ours] a proposal with no source. Outside sources are cited through the scouts; I opened none myself. Scouts are `loop/procgen_scout_NN_*_2026-11-13.md`. The three proposals are called INTENT, CHASE and VARIETY.

## 1. The ask, in his words

- [his 179] The generator is "a damn good base" but "way too repetitive" and needs "cool pathways with intent mixed into the randomness"; the swarm should hand over how to start each idea, how it connects and where it expands.
- [his 91] "the proc gen does get way too repetitive over time", after a 450 s run.
- [his 7] "more open ended than a few lines", with dead ends that "will end runs eventually" and parkour as the rare escape where "the entity has to route around". The brief records he corrected a plan that promised a guaranteed route (briefs/dreamzone2_the_game.md:49-52). So intent means extras laid over the open lattice, never one forced line.
- [his 8] a Park is "a shortcut to create distance" and "a YES lets go moment". [his 93] and [his 94]: shapes "currated designed that can be mirrored and interchangably linked", "less chance after like 4 pieces plus". [his 124]: luck touches chests only.
- [his 26] "designed areas with meaning". [his 28] "the seeds get more chaotic" with chapters. [his 80] no map. [his 89] he loves the starting biome but finds "too many doors".

## 2. Where the sameness comes from today

- His 450 s route: 79 corridor, 6 cross-corridor, 3 reprieve, 2 room of 90 samples; median straight 49 cells; no exact repeat of any 7x7 layout; 8 of 9 Parks the same ladder duct [read handback/p-d665-gen-data-B_2026-11-11.md:34-58]. So the sameness is stationarity, not copies.
- Independent hashes on a fixed 18 m lattice: lane offset per segment, cuts, block gate, void per window [code gen/src/layout.cpp:176-193, :214-236; gen.h:30]. A long run is a stationary stream; the only slow fields are the biome field and lit_field (emit.cpp:28).
- Rooms have no purpose and no interior; nothing authored exists (no landmark, piece or prop) [read scout 00 s4].
- A stale baseline. His numbers are from build b212ae8, an ancestor of lever 1 (277361f), which is on main [code git merge-base]. After lever 1 the bots read a median straight of 27 then 23 cells and rooms fell 10% to 7%, so E's rooms check failed [read handback/p-d665-straights-B_2026-11-11.md:29-41]. His route cannot be replayed in a changed world (same file s2). "Now" needs a new baseline.

## 3. The path: eleven laps

Every generator lap ships behind a dial that defaults to 0, with a test that every chunk equals the Lap 1 pin at 0. Layout-deciding code lives in one new file, gen/src/intent.cpp, so profiles, jogs and rings do not fight over layout.cpp:240 pre(). New salts are appended after kSaltFalseDoor (gen_impl.h:41), never reusing kSaltPiece (:31).

**Lap 1. Register the measure and pin today's world (no generator change).** Lenses: all three.
- Goal: [his 91] "how is the data" and "way too repetitive".
- Technique: expressive range on emergent route metrics, not dial inputs (Smith and Whitehead 2010: a late tweak biased their whole range; PDF read by scout 07, second reader confirmed). Per 60 s window: M1 corridor share, M2 room share, M3 median and p90 straight, M4 open-side share (path nodes with a lateral walk edge) [ours], M5 sameness run (seconds since the place signature of kind, straight, ceiling, kit and lit buckets last changed) [ours], M6 distinct signatures, M7 landmarks per 45 s, M8 Park shape share. Runners: a deterministic forward runner on the assembled graph for 450 s, and the existing bots (`dz-chase run --world --trace`, chase/tools/dz-chase/main.cpp:116, :357). Measure on 04f3882 and on 151aead (a throwaway worktree). E's falsifiers V1 to V8 stand [read handback/p-d665-variety-E_2026-11-11.md:23-32]. Source: scout 07 s4.
- Files: new gen/src/route_profile.{h,cpp}, gen/tests/range_tests.cpp, gen/tests/pin_tests.cpp; gen/tests/dial_tests.cpp (school and hospital rows in kExpect, :37-42); gen/tools/dz-gen/main.cpp (a `range` subcommand, beside `walk` at :167); gen/CMakeLists.txt (:65-70); gen/CHANGES.md (the register, committed first).
- Red first: range_tests does not build today. Green: a corridor-only line scores corridor 1.0 and a sameness run equal to the window; a line through an atrium scores below 1; one seed gives the same profile in any order and on two threads (shape of layout_tests.cpp:52). pin_tests: the default world equals fingerprints of 96 chunks for seeds 1 to 4, captured on 04f3882. Thresholds come from the baseline.
- Degenerating, named now: after Laps 3 to 5 the bots' rooms are still under 10%, or the share of windows with a sameness run over 40 s [ours, from baseline] has not fallen. Then the sameness is in looks (props, textures, D660), as E wrote [read variety-E:34-35], and generator laps stop.
- He sees: one page per biome. Serves: every later lap, run_frame.

**Lap 2. Land what is already built.** Lenses: CHASE and VARIETY lead; INTENT calls it a precondition.
- Goal: [his 93] more Park shapes; [his 149] the stair drop.
- Technique: merge origin/d665-variety-b 151aead (hunter model in the generator, Parks kept by the hunter's way round minus the player's crossing, a one-way Chute of 1 to 7 storeys) and origin/l189-drops 260553b (drop harness; adds only drop_proof.{cpp,h}, drop_tests.cpp and CMake lines [code git diff --stat]). Measured on the branch: horizontal Parks buy under 3 s at 0 of 891 sites; chutes pay best [read handback/p-d665-parks-rated-B_2026-11-11.md:119-133].
- Files: whole branches. Overlap with main is 9 files, counted by me from merge-base 955c4e1 (among them gen/src/emit.cpp, gen/src/biome.cpp, gen/tests/dial_tests.cpp, gen/tests/layout_tests.cpp). Seeds change once, on purpose, and four salts go in before any later lap's.
- Red first: the branch's rows in dial_tests.cpp fail on main. drop_tests.cpp:28 was red on 0389b0a (229 unintended drops, two classes, both straight-well Stair cells [read handback/p-l189-drops-C_2026-11-12.md:68-104]); it has not been run on current main. Fix any remaining class in gen/. Two rows red at the branch tip need an owner's ruling: the chase sprinter margin, and nav way-back 22.9% against a 20% bound [read p-d665-parks-rated-B:186-189]. If 3-storey chutes leave the hunter's nav window (3 of 21 Parks, cause inferred), cap chutes at 2 storeys by a dial.
- He sees: chutes of several depths instead of eight ladder ducts in nine; no drops beside wide stairs. After the merge, rerun Lap 1 (V6 shape share). Serves: Parks, containers in Parks.

**Lap 3. District profiles, with the pace field inside them.** Lenses: VARIETY (its Lap 3), INTENT (its Laps 2 and 8), CHASE (its Lap 8).
- Goal: [his 179] "intent mixed into the randomness"; [his 36] "more places should be lit", with darker stretches.
- Technique: one smooth value-noise field of about 40 cells [ours], cut into 3 or 4 profiles; each profile multiplies existing LayoutRules (loops, dead_ends, block_open, big_spaces, vertical, lamps, lamp_dark, lamp_bright, lamp_dead, lane_segment). Adjusted tables are built once per biome and profile so rules() (gen_impl.h:165) keeps its signature. A separate pace field would be a second copy of this one. Source: scout 08 s4 step 2; scout 07 technique 2 (few discrete, correlated decisions; Booth's L4D director, re-opened by second readers).
- Files: gen/src/intent.cpp (new), gen_impl.h, gen.h (Dials, kDialSpecs :88-99: `intent_strength`), biome.cpp (a profile row per biome; apartment identity), layout_tests.cpp, dial_tests.cpp.
- Red first: with_intent_off_every_chunk_equals_the_pin (green before and after); profiles_make_a_long_walk_non_stationary (8 seeds; variance of room share across 200 m windows on a 3 km line larger at strength 1 than 0; margin not measured); the order, thread and face tests (layout_tests.cpp:52, :100, :115) at 1; every kExpect band holds at 1.
- He sees: stretches of about 120 m with their own character inside one biome. Serves: lighting, chapters (Lap 11 weights profiles), the director.

**Lap 4. Pass-through rooms.** Lenses: all three.
- Goal: [his 6] "liminal spaces"; fixes the one registered check that failed (rooms 7%).
- Technique: a hash-chosen share of lane stretches in hotel, school and hospital runs through a block room with a doorway at each end; the lane cells and edges stay, so the graph keeps its shape. Source: scout 05 technique B; scout 03 stage A; E lever 2 [read variety-E:51].
- Files: layout.cpp block() :318, cell_base :597, edge() :724; new gen/src/through.cpp; gen.h (`through_rate`). First, read cell_base and edge(); no proposal opened them.
- Red first: a_through_stretch_keeps_the_graph (node and edge counts and types equal at rate 0 and 1, 12 seeds a biome); rooms_are_met_on_a_run (bots: rooms at least 10%, corridor at most 80%); walk proof at rate 1 (walk_tests.cpp:114 pattern); geometry_tests.cpp:79; the drop harness. Count doors per minute, against [his 89].
- He sees: running through a lobby or ward. Serves: chase space ([his 178]), Lap 9.

**Lap 5. Beacons and Region kinds (landmarks and sites).** Lenses: VARIETY early and small; INTENT and CHASE later.
- Goal: [his 179] "pathways with intent"; [his 80] no map; [his 26] encounters need places.
- Technique: emit-only. A fixed-colour lamp at the node ending a straight of N cells or more (precedent: emit.cpp:565). New RegionKinds landmark and site with a tag byte beside kRegionVoid (core/scene.h:105-108), emitted at emit.cpp:611-657. Sites are seed-fixed slots (container, encounter, good entity); luck and the director choose which are live, and geometry never reads luck [his 124]. Evidence is weak (a talk via a summary; a 3-player study), so this stays small. Cell::flags is full (gen.h:291-300).
- Red first: a_beacon_ends_every_straight_of_N_and_nowhere_else; the_graph_is_identical_with_beacons; every_site_sits_on_a_reachable_cell; luck_never_moves_site_geometry (copy walk_tests.cpp:309); a game test that nav and world_app.cpp:37 ignore an unknown kind (unverified). Gate: V3, one landmark per 45 s on bot routes; degenerating if the place signature does not change at beacons.
- He sees: a light at the far end of a hall.

**Lap 6. Lane jogs and boulevards (conditional on Lap 1).** Lenses: INTENT, CHASE, VARIETY.
- Goal: [his 18] long straights make "you have to turn" (the speed scaling is chase-side).
- Technique: skip unless the Lap 1 baseline on main fails V2 (median straight over 25 cells). Segment s must differ from s-1 (col_off :176 and row_off :189 read both hashes; the junction pin at :179-183 stays first). Today the repeat chance is 1/3 hotel, 1/2 school and hospital [code layout.cpp:186, :192; biome.cpp:82, :117, :155]. A boulevard is a chosen profile: one offset for a district, ending at a node.- Red first: a_lane_jogs_at_every_segment_boundary (200 seeds, unpinned lanes); a_boulevard_lane_runs_at_least_24_cells; void counts before and after (voids need a straight run, voids.cpp:110-117); the hotel loops band amended by name if it moves (dial_tests.cpp:32-34).
- Dependency: corners snag the chasers [his 164]; land chase-side corner clearance first or keep the dial at 0. He sees: fewer endless straights, a long run on purpose.

**Lap 7. Dead ends with an answer.** Lenses: INTENT (build), CHASE (census first).
- Goal: [his 7] "dead ends eventually" that end runs, fairly.
- Technique: census first: each dead end's depth in seconds, whether it is seen from its mouth, whether a climb or drop leaves it (measure.h:40-45, measure.cpp:185). Only if a deep, unseen, no-exit one exists, keep climb-outs where the hunter's way round is at least a dial; the hunter's graph already refuses Climb edges (graph.cpp:67-75). A dead end with no answer stays legal and rare. The brief records no run ended by a dead end (grep: item 7 only).
- Red first: every_deep_dead_end_is_seen_or_has_a_way_out (200 seeds; budget from the census; if none is found, it ships green as a guard); every_kept_climb_out_beats_the_hunter_by_the_dial. Bands stay (dial_tests.cpp:38-44). He sees: almost nothing unless the census finds a trap.

**Lap 8. Ring districts and payoff spacing (conditional).** Lenses: INTENT only; CHASE and VARIETY made it conditional.
- Goal: [his 8] the Park as the short arc of a loop whose long arc the hunter must walk.
- Technique: a ring profile in the Lap 3 menu: cuts inside the ring off, a Park or chute on the chord, kept only if the hunter's way round minus the player's crossing meets the dial (judge on 151aead; Brogue's addLoops flank test, idea only, AGPL-3.0). Payoff spacing: a payoff is kept if no eligible neighbour within S cells has a higher hash; a district with none promotes its best site [ours]. Limits: loops are not scarce (apartment 12 to 26, hotel 18 to 36, dial_tests.cpp:39, :42), and a horizontal chord cannot pay (0 of 891 under 3 s), so the chord is vertical or the lap is struck. Gate: Lap 1 shows loop perimeters bunch.
- Red first: a_ring_has_no_cut_inside; every_ring_payoff_beats_its_long_arc (reprieve_min_detour_s 5.0, gen.h:74); the connectivity bands hold (0.975, 0.99). He sees: a ring with a Park on one side. Serves: chase (the juke, [his 18]).

**Lap 9. Designed passages (templates).** Lenses: all three; INTENT Lap 5, VARIETY Lap 10, CHASE Lap 6.
- Goal: [his 93] curated pieces "mirrored and interchangably linked"; [his 26].
- Technique: an ASCII table per storey with fixed ports (Merrell's known-good border; Spelunky and Hades mirroring, scout 03). A lane beside a port takes its offset (precedent :179-183). Mirror by hash; anti-repeat by checkerboard parity [ours]. Stage A stamps halls (pillars, alcoves) into Lap 4's rooms. Stage B builds Park passages from entry, run, turn, drop, rise, room, exit, with length chance 0.7 then 0.35 past about 3 middle pieces (the chute already uses it, 151aead layout.cpp:160), luck-free [his 124]. If V4 and V6 hold after Lap 2, shrink stage B to the turn piece and the curve. Templates risk a second sameness (scout 03 s6).
- Files: gen/src/pieces.cpp, layout.cpp pre() :240 and block() :318, gen.h (`piece_rate`), a new salt kSaltTemplate.
- Red first: a_stamped_piece_matches_its_template_and_keeps_its_lane_open; the_same_template_is_never_its_own_neighbour (200 seeds); a k-piece passage is walkable end to end and beats its crossing; P(5 or more pieces) under 10% [ours]; walk proof and drop harness on piece-heavy seeds. He sees: a hall with pillars, a Park that turns.

**Lap 10. Verb lines (slide cut first).** Lenses: INTENT, CHASE.
- Goal: [his 140] "nutty speed lines"; [his 14] "rare and short".
- Technique: a Park-style row with a 1.3 m ceiling that only a slide crosses, sized from the body as voids are (voids.cpp:30, :96), then a wall-kick hop and a vault row (scout 09; Smith et al. 2009 rhythm-first, second reader confirmed). Registered falsifier: if no slide cut clears 5 s at any site it is texture; join it to a hall or vertical piece, or stop. A chained proof of a two-piece line at carried speed is the largest cost.
- Files: gen.h MoveReach :103; walk_proof.cpp :70, :266; sim/input.h:14; new gen/tests/slide_tests.cpp.
- Red first: a_slide_cut_is_crossed_by_a_slide_and_not_by_a_walk; dials at 0 change no chunk; every kept cut beats 5 s. Settle first: MoveReach says 8.75 m/s (gen.h:108), the controller 10.0 (sim/params.h:38).
- He sees: a low gap that pays a slide taken at speed.

**Lap 11. Run profile: chapters.** Lenses: all three.
- Goal: [his 28] "the seeds get more chaotic" and far biomes "closer to reach".
- Technique: WorldProfile {chapter, stress}, identity default, in GenParams (gen.h:257); biome() scales its distance term by 1 + k*chapter (biome.cpp:226-232); the profile goes into the run record (game/world/run_record.h:41-48) so replays stay exact. Live state never enters gen/ (scout 08 s1).
- Red first: the default profile equals the pin; apartment share at chapter 3 is below chapter 0 (margin not measured); the order test at chapter 3; the record round-trips and a replay gives the same state_hash. He sees: later chapters reach far biomes sooner.

## 4. Where the lenses disagreed, and what I chose

- **First laps.** CHASE landed the built work first; VARIETY measured first. I measure first, on both commits, since it changes nothing, then land Lap 2.
- **Intent layer.** VARIETY left it out unless the path degenerates. He asked for intent, so rings, boulevards and dead-end answers are laps, behind measured gates (6 to 8).
- **Pace field.** One field serves pace and profiles (Lap 3); scout 07 says share one hash.
- **Straight cap.** Conditional: lever 1 already moved the bots and his 49-cell median predates it.
- **Ring.** INTENT only. Kept, late, because a horizontal chord cannot pay.
- **Dead ends.** Census first.
- **Verb lines.** INTENT high, VARIETY absent. Late: the pay-off is unproven and the proof gap is large.
- **Facts.** Overlap is 9 files, not 7. Loops are 12 to 36. layout_tests.cpp:115 is face agreement, :100 the thread test. dial_tests.cpp:75 is a range check, not a connection proof.

## 5. Choices that are his

1. Apartment: (a) frozen, new laps in hotel, school, hospital first [his 89]; (b) low-strength profiles; (c) every biome. I assumed (a).
2. Payoff rarity: (a) today's rate, cut the longest gaps; (b) one a minute; (c) separate rarer kinds.
3. Horizontal Parks pay under 3 s here: (a) keep Parks vertical; (b) a long-hallway district; (c) accept short Parks as places.
4. Designed pieces: (a) the room drafts shape-only ASCII and he judges renders; (b) he sketches; (c) wait for D660.
5. Long straights: (a) cap everywhere; (b) boulevards on purpose; (c) leave alone.
6. Old runs: (a) dials at 0, each flip announced; (b) also record a generator version in the run record (not checked whether one exists).
7. Five minutes of his play on the pinned build, saved as a .dzr, to check the runner model.

## 6. What must stay true throughout

- Walk proof: walk_tests.cpp:59-159 (12, 8, 8, 12 seeds) and the void crossing :229.
- Determinism, one seed one world: layout_tests.cpp:52, :100, :115; walk_tests.cpp:309; geometry_tests.cpp:79.
- Dial bands never widened silently: dial_tests.cpp:37-42, :212.
- The drop harness on every lap that adds floor, steps or ledges.
- Replays: dials at 0 change nothing; a landing with a dial above 0 is announced.
- No build, sweep or test while he plays or while the machine is busy.

## 7. Not verified

- Nothing was run. Every [ours] rate, span and margin is a starting guess; the "red first" tests may already be green.
- I opened no outside source. Several rest on summaries: Upton, Boris the Brave's oatmeal page, Stables, Mirror's Edge, the Wellesley study (3 players). The strong and weak loop rule is a fan designer's.
- Not opened by anyone: cell_base and edge(), nav's handling of an unknown Region kind, the l182 branches, where dz-world builds GenParams. His route file run-20261111-221301.txt is not in this checkout.

## Verification (second reader, 2026-11-13)

Game repo read at 04f3882. No source was edited; only this section was appended.

- [his N] quotes (items 6, 7, 8, 14, 18, 26, 28, 36, 89, 91, 93, 94, 124, 140, 179): ok. Each phrase is in briefs/dreamzone2_the_game.md under that item (whitespace across wrapped lines normalised). Item 93 holds "currated designed that can be mirrored and interchangably linked"; item 94 holds "less chance after like 4 pieces plus". Item 124 says "keep the luck to the chests".
- [his 7] correction not a forced line (briefs:49-52): ok.
- "no run ended by a dead end (grep: item 7 only)": ok. "dead end" appears only at briefs:30, :37, :50.
- [his 80] "no map": ok in substance (item 80: "remove map, you shouldnt have or need one"); it is a paraphrase, not a quote.
- code layout.cpp:176-193 (col_off, row_off, junction pin :179-183), :214-236: ok.
- code gen_impl.h:31 kSaltPiece, :41 kSaltFalseDoor, :165 rules(): ok.
- code gen.h:30 kBand, :88-99 kDialSpecs, :103/:108 MoveReach 8.75, :257 GenParams, :291-300 flags full, :74 reprieve_min_detour_s 5.0: ok.
- code emit.cpp:28 lit_field, :565 fixed_lamp, :611-657 void and reprieve regions; core/scene.h:105-108 kRegionReprieve/kRegionVoid: ok.
- code sim/params.h:38 sprint_peak_speed 10.0 against MoveReach 8.75: ok.
- code biome.cpp:82 (hotel lane_offsets 3), :117 (school 2), :155 (hospital 2), :226-232 distance term: ok. Repeat chance 1/3 and 1/2 follows from the % n at layout.cpp:186, :192: ok.
- code layout.cpp :240 pre, :318 block, :597 cell_base, :724 edge: ok. 151aead layout.cpp:160 (want < 3 ? 0.7f : 0.35f): ok.
- code voids.cpp:30 void_size, :96 void_site, :110-117 straight run: ok. graph.cpp:67-75 (hunter_seconds returns -1 for Climb): ok. measure.h:40-45 DeadEnd, measure.cpp:185: ok.
- code layout_tests.cpp:52 (order), :100 (threads), :115 (faces); walk_tests.cpp:114, :229, :309; geometry_tests.cpp:79; dial_tests.cpp:32-34, :39, :42, :75, :212; run_record.h:41-48; sim/input.h:14; walk_proof.cpp:70, :266; dz-gen main.cpp:167; CMakeLists.txt:65-70; dz-chase main.cpp:116, :357: ok.
- walk_tests.cpp:59-159 "12, 8, 8, 12 seeds": could not check the seed counts in the time given. The range starts at :59 and ends near :160.
- git: b212ae8 is an ancestor of 277361f, and 277361f is on main: ok. merge-base of main and d665-variety-b is 955c4e1; overlap is 9 files, the list matches the doc (CHANGELOG.md, chase/tests/proof_tests.cpp, speed_tests.cpp, dz-chase main.cpp, biome.cpp, emit.cpp, dial_tests.cpp, layout_tests.cpp, void_tests.cpp). The doc names only five of them, which is consistent. origin/l189-drops 260553b adds only gen/src/drop_proof.{cpp,h}, gen/tests/drop_tests.cpp and 6 lines in gen/CMakeLists.txt: ok. drop_tests.cpp:28 is the test: ok.
- hand-backs: p-d665-gen-data-B:34-58 (79/6/3/2 of 90, median 49, 8 of 9 ladder ducts): ok. p-d665-straights-B:29-41 (27 then 23, rooms 10% to 7%, V1 FAILED): ok. p-d665-parks-rated-B:119-133 (0 of 891), :186-189 (22.9% against 20%): ok; "3 of 21 Parks" is at :206, ok. p-l189-drops-C:68-104 (229 unintended, 2 classes): ok. p-d665-variety-E:23-32 (V1 to V8) and :51 (lever 2): ok.
- WRONG (minor, wording): section 1 says "[read]" for the Smith and Whitehead PDF and the Booth talk while line 3 says the author opened no outside source. These are second-hand through scouts 07 and 08, so they should be read as [read by scout], not [read] by this author.
- [read] outside, Brogue addLoops (via scout 01): ok. I re-opened raw Architect.c: addLoops opens a doorway only if the walking distance across the wall exceeds minimumPathingDistance (the call passes 10). Note it is an absolute path-distance threshold, not a ratio to straight distance; the doc's "flank test" is a fair label. I could not get line numbers from the fetch tool, so scout 01's :340-390 is unchecked. Licence AGPL-3.0: ok (LICENSE.txt title "GNU AFFERO GENERAL PUBLIC LICENSE", Version 3).
- [read] outside, Smith and Whitehead 2010, Booth L4D, Smith et al. 2009: could not check. I did not re-open them. Scouts 07, 08 and 09 record their own second-reader checks of these (scout 07 lists the Smith licence as WRONG in its own totals, so the doc's "no licence shown" is the scout's corrected form).
- [read] with no URL or path, or memory only (d): none found. Upton, Boris the Brave, Stables, Mirror's Edge and the Wellesley study are listed in section 7 as summary-only, which is honest.
- could not check: the 3-storey chutes leaving the hunter's nav window ("cause inferred", marked as such); world_app.cpp:37 ignoring an unknown Region kind (:37 is the regions loop, behaviour unverified, doc says unverified).

Totals: 62 checks, 59 ok, 1 WRONG (minor wording), 5 could not check (walk_tests seed counts, Smith 2010, Booth, Smith 2009, Brogue line numbers); the nav-window and world_app items are already marked unverified by the doc.
