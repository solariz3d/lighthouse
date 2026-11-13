# Build paths: the index (2026-11-13)

Game repo read at 04f3882. I opened every handoff's sections 4 to 6 and its Verification section, the generator build path, the queue and the 13-hour plan. I opened no code and no outside source. Marks: [read] opened by me, [inferred] mine, [ours] a proposal. Handoffs are `loop/buildpath_<key>_2026-11-13.md`; the generator path is `loop/procgen_buildpath_2026-11-13.md` (GP); scouts are `loop/procgen_scout_NN_*`.

## 1. The table

| aspect | first step | hard wait | unlocks |
|---|---|---|---|
| run_frame | A builds Overtime in chase/run.cpp from d673-chase-wip fc8206d; C rebases d673-frame 8614983 | L182 default landed (queue 1) | meta_loop wins, waking_room L2, story L2, stress L3 |
| chase_entities | finish L182 arms and exploit search, flip default behind a run-record field | none (in flight) | run_frame, kit waves, stress L2, sound L6 |
| entity_bodies | sprinter.glb, GaitProfile per kind (model_rig, stage.cpp) | D for Blender and the 2.78 ms timing | footfalls per kind, chaser tells |
| player_body | land L188 step 1 from l188-fpbody b963780 | none | L193 scoring, waking_room, movement K3 |
| movement | surge in sim/ (surge_tests.cpp) plus chase/surge_events | none for L1; L2 to L4 need his calls | abilities perks, FOV key, stress sources |
| abilities | kButtonFocus, game/abilities.*, loadout in RunRecord | the record-version ruling (section 2) | beam repel, chair data, shroud |
| stress | read-only StressMeter, chase/stress.* | A's run.cpp landing (same file) | shroud, Recognition, room clock |
| meta_loop | game/profile.* ledger, paid once at end_run | won flag (D673) for payout; pure part now | trinkets, containers, shop, cheque |
| waking_room | bed room, RunPhase::Waking, start_in_room | run_frame landed; Q2 | invasions, chair, story |
| world_gen | 1a route profile gen/src/route_profile.*; 1b B's Park kit | 1b: queue step 2 | chase straights, edge points, chapters |
| look_fear | game/dream.* director plus capped FOV | none (stage.cpp shared with C) | sound, bodies, warning |
| sound | land l192-footsteps b61ce52 | none | hearing (shared with chase L4), calm |
| story_lore | L0 docs reconcile of the bible, then story/ library | L2 waits d673-frame | every narrative beat |
| frontdoor_onboarding | title constant (game/world/title.h), photosensitivity notice | none (working title) | difficulty pick, tutorial |
| tech_foundation | record_format, loud build-differs exit code, fixture run | none | trust in every replay, landing train |

## 2. The dependency picture

[inferred, from the depends_on lists] Foundations, by how many others list them: chase_entities 11, run_frame 11, tech_foundation 10, entity_bodies 6, world_gen 6. Leaves: frontdoor_onboarding (nobody lists it), player_body (1), abilities (2). Middle: sound, look_fear, stress, movement, meta_loop, story_lore, waking_room.

There are 16 mutual pairs. The hub is run_frame and chase_entities (the timer feeds the director, the dark one needs the chase law). Others: chase with movement, stress, sound, world_gen, abilities, tech_foundation; waking_room with abilities and story; story, look_fear and tech_foundation with world_gen. Every first step above is cycle-free; the cycles live in later laps, and each handoff already cuts its own.

One collision no handoff names [read chase_entities:72, tech_foundation:84-86, run_frame:93, abilities:60]: chase_entities L1 stores a chase text in the run record, tech_foundation L1 adds record_format, run_frame's C part and abilities L1 also edit run_record.{h,cpp}. One owner and one version scheme are needed before any two start. A second rule [inferred]: replay-changing laps (chase flip, GP Lap 2 seed change, surge in the fingerprint) follow the version gate. Also duplicate: chase L4 equals sound L6 (D654 step 3); L189 appears in GP Lap 2, tech Lap 4 and C's lane.

## 3. Build order

His queue stands (brief 133). Tonight's lanes (plan_13h) run inside it.
1. Queue 1, in flight: A L182 flip; B L188 step 1; C L191, L189, L180; E L185, L192, L193.
2. Version gate (tech Lap 1, merged with A's field), then landing train (tech Laps 2-3, B).
3. GP Lap 1 (read-only measure) any time before queue 3; it changes nothing.
4. Queue 2: run_frame L1 (A then C), L2 tuning.
5. Queue 3: Park kit (world_gen 1b = GP Lap 2, with the l189 drop harness), then erosion creep (look_fear L4, sound L5 follow).
6. Queue 4: chase_entities L2-L6. Queue 5: stress L1-L5.
7. Queue 6: entity_bodies L1-L5. Queue 7: meta_loop L1-L5, waking_room L1-L6. Abilities L1-L4 are loadout work and fit anywhere after the version gate; L5 (chair) waits on queue 8.
8. Queues 8-10 are his; E drafts. Queue 11 (reveal) needs the dark one's name.
9. Queue 12: frontdoor L1-L3. Queue 13: GP Laps 3-5, then 6-8 only if the Lap 1 baseline fails, then 9-10; world_gen L2-L6 are older and GP supersedes where they differ [inferred]. Queue 14: look_fear L1-L5. Queue 15: story L1-L6 (GP Lap 11 = story L4). Queue 16: frontdoor L4. Queue 17: tech Laps 5-6.
10. Movement L1-L2 has no queue slot; it rides with queue 9 (his six questions).

Note: his 179 asks for generator richness, yet GP Laps 3+ sit at queue 13. Whether that moves is his call. Queue log 01:1x says look_fear's director may move up if he adopts movement bends.

## 4. Start now, in parallel, without him

- A (chase/): chase_entities L1, then run_frame L1 chase side. Stress L1 after that lands.
- B (body, gen/): player_body L1; tech L1 record version (before C and A land theirs) and landing train; GP Lap 1 in new gen files.
- C (model_rig, game/world): L191, L189, entity_bodies L1 model work (needs D); meta_loop L1 pure part in new files; frontdoor L1 after the frame lands (hud.cpp shared).
- E (skeleton, audio): sound L1 (L192), tech L5 yardstick, story L0 docs, abilities L1 once the version is settled.
- Also startable: look_fear L1 in new game/dream.* files and movement L1 (sim/ and new chase files). Pane for these is mine [inferred] and not set by plan_13h.
- Machine rule: no builds or sweeps while he plays; timing runs go to D.

## 5. Calls that are his (107 listed, with overlaps)

- run_frame: timer shown; run length; void in overtime saves; Park vs dark one; dark one new or hunter; what the part taken does; loss portal equals reveal; dark one's name (Q1-Q8).
- chase_entities: softer solo hunter vs grip dial; Through vs "route around"; omniscient hunter vs Shroud/Lure; good entities can fail; climb per kind or all; speed margin.
- entity_bodies: back-jointed sprinter vs humanoid (168); detail (82) vs 2.78 ms; procedural vs few clips; face at catch; arm numbers vs sheet stills; lore per kind.
- player_body: eye camera K0/K1/raw; strafe switch 2.7 m/s; base outfit; staged vs mocap; shared arm shape (177); loose fist method.
- movement: slide reset; surge sources; stagger; ceiling 12.4; kBaseMove 10 vs 8.75; first-stage speed; bhop window; dive steering; wall-run rarity.
- abilities: six fixed or slots; shop at PC or chair; Focus level; shroud vs 65; flashlight slot; psychic fusion; frenzy meaning; rename "focus".
- stress: line of sight; frenzy vs no rubber-banding; frenzy end and cap; Recognition odds; Recognition stops catches; meter shown.
- meta_loop: XP unit; level scope; lost-run cash; luck vs seed; trinket storage; cash timing; tier unlocks; trinket ruling and pick signature.
- waking_room: Q1 PC vs chair; Q2 walked or picture; Q3 lost-run cash; Q4 cheque timing; Q5 gym; Q6 PC build.
- world_gen: biome list; Park purpose; doors; stairs; rare outside; designed pieces; voids in school and hospital; chapters; apartment.
- GP (7): apartment; payoff rarity; horizontal Parks; who writes pieces; long straights; old runs; five minutes of his play.
- look_fear: haze vs no out-of-body; intensity inputs; FOV key; Park erosion vs flashing; photosensitivity timing; jumpscare gating.
- sound: good-entity quiet vs footfalls; synth vs clips; theta beat; erosion wail; jumpscare; HRTF dependency.
- story_lore: father's death; hospital door; Gateway naming; real names; dark one's name; N for gates; lore per entity.
- frontdoor_onboarding: game name; warning timing; difficulty place; tutorial after 101; item 100 text.
- tech_foundation: kept runs vs changes; retention; textures on a clone; landing strictness.
- Queue gates 8, 9, 10 repeat the above. Dark one's name is in run_frame, story_lore and queue 10; apartment, Parks and doors recur in world_gen and GP.

## 6. Where second readers found WRONG (82 findings: 55 handoffs, 26 scouts, 1 GP)

Do not build on these lines.
- run_frame: renderer.h:87-96 is not the grade (35-38, 118-122); p-d669-sweep-E cites 238-240, 254-258 are wrong; "no countdown" is an open gap, not a ruling.
- chase_entities: item 91 misquoted; p-l170-scale-E:74 is :57, p-l170-chase-A:47 is :63, p-l182-lines-A:29-55 past end; 300 s bonus half faded.
- entity_bodies: figures.h:31 is :28; hunter row A:712; "1.92 ms p99" is absolute, added is +0.48; Yegian was abstract only.
- player_body: p-l186 :185-225 and plan_l181 :213-215 past end of file; body_tests.cpp:478; item 160 quote is item 158's; backward-walk step claim unsupported.
- movement: p-d657-d656-land-P:7-12 wrong (use p-d657-speed-B:57-60); l185 touches 20 sim lines; world.cpp:897 ordering unverified.
- abilities: bindings.cpp:21 is :105; world.cpp:89 is :90; stage.cpp:689 missing; "cued bend" belongs to P2 Long Stride; item 64 weak.
- stress: items 59-62 at :474, :489, :495, :503; run.h:198 vs :200; licence is CC BY-NC-SA 4.0.
- meta_loop: refusal of luck-lengthened Parks is item 124; luck also at world_app_tests.cpp:1066; 23 stats not 24; queue step 7 at :28.
- waking_room: quote under item 50 not 49; main.cpp is game/world/main.cpp; "C, lane 4" unnamed.
- world_gen: 04f3882 is 3 ahead of origin/main e0184ea; gen.h:31-32, void_rate :78; l189 "229 all wide-well" is inferred (227 sideways, 2 at a flight end).
- look_fear: "pseudo" is item 75; renderer.h:100 not :104; p99 and 0.75 ms conflated; l188-wip-look touches shell.cpp.
- sound: mixer.cpp:43-44; audio.h:75; model_rig.h:269; design.md:168 should be :232.
- story_lore: a-d673-overtime tip 9671a90; item 70 overridden by 84; page 25 at :55.
- frontdoor: origin/d673-frame 8614983 exists; WCAG 2.3.1 shows W3C copyright.
- tech_foundation: only 4 "left" runs, not 6; four room cites past end of file; replay.cpp:37, :68; .gitattributes line 3; item 149 quote is item 148's.
- Scouts: 01 loops are 12-36, overlap is 9 files; 02 emit.cpp:27 is gen.h:30, run.cpp:1129, 94% is at p-d665-gen-data-B:64; 03 pre() sets lanes first, dial_tests.cpp:75 is a range check, "2 rooms in 90 samples" misattributed; 04 gen_impl.h:50-53, Gumin claim; 05, 09 layout_tests.cpp:100 is the thread test, face agreement is :115; 06 his 28 quote and three paraphrased quotes; 07 licences; 08 :64-65; 09 voids.cpp:79, Spelunky detail unsupported.

## 7. Items no handoff covers

- 19 and 20: process and another project (the Third Place, Dreamride). Leave with those seats.
- 143, 144, 145: Roblox, parked by him and out of scope. The queue log says E researches it only after the list; keep that.

## 8. Not verified

- I re-checked none of the cited lines, branches or tips in the game repo; every code, branch and line cite here is relayed from handoffs and their second readers.
- The depends_on lists are loose and some conflict with each other, so the picture in section 2 is only an approximation.
- Pane assignments in section 4 are mine and not agreed with the panes.
- Whether surge in the fingerprint changes every kept replay was not checked.
- The 107 is a count of listed calls, not distinct decisions.
