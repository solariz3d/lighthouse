# Build path: the meta loop (scoring, XP, levels, the two currencies, containers, trinkets, clothing, difficulty tiers), 2026-11-13

Game repo read at `04f3882` (main, `git log -1`). Marks: [read] opened; [code] file:line; [inferred] my reasoning; [ours] a proposal with no source. Brief = `briefs/dreamzone2_the_game.md`; [his N] is an item in it.

## 1. His words

| items | what he asked for |
|---|---|
| 2, 25 | "you start lvl 1 and weak", levelling "over many runs"; a roguelite where each run builds strength and the player keeps stats between runs |
| 7, 53 | points: 7 says "time spent alive"; 53 (later) says "not time, distance", with multipliers, frenzy, proximity, reprieve use, evading small entities, chests, movement chains and overtime bonus |
| 21, 28, 41 | speed 5 then about 10 m/s, upgradable by points; attributes speed, agility, luck, mental fortitude; "10% sounds good for the start" |
| 40 | the flashlight is "unlocked early you just need to get it", found in containers; he asked for a better word than "chest" |
| 32, 34, 47, 48 | two trinkets equipped; tiers common to resonant; rare ones "exotic and powerful", not bigger numbers; extras go to storage; lore items ("Dads watch"); three collections: family, personal, Monroe Institute |
| 41 | the container opening is a slot machine, sometimes "BOOM, BOOOM, BOOOOM" |
| 42 | fortitude lowers stress and the frenzy's peak; trained by a meditation mini game |
| 51, 52 | clothing buffs are "slight buff like runes or masteries in league"; 52 corrects 51's "last two rarities" |
| 57, 58 | XP follows moves done, not spec: a slide trinket pays more because you slide more; no points for abilities you lack |
| 66 | lost before the timer: all points gone; survive it and overtime is "meant to be lost", the run counts as won |
| 67 | supersedes 41's two splits: cash (PC, most things) and energy (the chair, levelling, the site's trades) |
| 68, 69 | a GLOBAL level beside the in-run level; strong unlocks sit behind global caps; a lost run adds "crumbs"; energy comes from escapes and chests |
| 86, 87, 109 | a base outfit with no buff, his own clothes (109 corrects the hoodie); slots shoes, pants, shirt/jacket, accessories |
| 111, 112, 113 | store items carry a common buff; wearing them gives a chance to "rub off" a stronger buff or quirk; dream-found lore legendaries arrive kitted, are unique, quirks lock or drop as in Darkest Dungeon |
| 114, 123 | the father's watch is a trinket (114 over the hoodie); the bomber is a legendary jacket; the sunglasses a legendary accessory |
| 115, 120 | parody brands of real 2005 labels, serious names |
| 116, 117, 118, 119 | clothing, accessories and the two carried trinkets kept apart; accessories carry small buffs too; shop buffs reroll; quirks are managed in the chair; "every run is every day since they wake up then sleep" |
| 98, 99 | per character: PC (kid, writer), flier stack (operator); a PC-builder minigame at period prices, late-game sink |
| 94, 124 | 94 let luck lengthen the Park; 124 supersedes it: luck acts on chests only (more often, better loot, several things at once) |
| 121 | the guitar pick's signature is wrong (no stress after Recognition) and needs a new one |
| 132 | chaser counts "should scale with the base difficulty and the progression of the story"; first runs forgiving |
| 26 | the room hosts the closet, PC, treadmill; tiers that strengthen entities for more XP are locked until reached |

Outside my list but binding: [his 84] the cheque names no payer; [his 70] the cheque pays the run's money after the first successful run.

## 2. What exists today

- Score is time only: `score_at = 10t + t^2/12` [code chase/run.cpp:205-211; chase/run.h:356-359]; HUD line [code game/world/hud.cpp:82]; card [code hud.cpp:118-127].
- The one thing kept between runs is the best time per level: `load_best` / `save_best` [code game/world/world_app.cpp:587-622], set at the run's end [code :426-431], file `game/config/best_times.txt`, gitignored [code game/config/.gitignore].
- `RunResult` has no XP, cash, won or distance [code game/world/world_app.h:64-76]. WorldApp does not sum distance; only the bots do [code chase/streamed.cpp:346].
- A run record stores `sim::MoveParams params` and the world settings, so a changed parameter replays exactly [code game/world/run_record.h:50]. `RunEnd` is Caught, Void, Left [code run_record.h:38]; `kRunsKept` 20.
- Difficulty is a head start plus a pace on one clock: gentle 0/0.6, normal 0/1.0, hard 2/1.3, brutal 5/1.6 [code chase/dials.cpp:17-38]. Nothing reads run count or story [read handback/p-l170-scale-E_2026-11-12.md:56-59].
- `git grep` on `04f3882` for trinket, xp, cash, energy, clothing, outfit, container, loot: no file. `luck`: only two chase docs [code, my run].
- In flight: `origin/d673-frame` 8614983 adds `RunEnd::Saved` and `RunRecord::kept_score` [code]; `origin/d673-chase` db8e557 adds `saved()`, `kept_score()` [code]; the overtime behaviour is only tests and dials (`d673-chase-wip` fc8206d) [read loop/buildpath_run_frame_2026-11-13.md:25-48]. A, B, C, E are on other lanes tonight [read loop/plan_13h_run_2026-11-13.md:48-84]; queue step 7 sits behind steps 2 to 6 [read loop/queue_dreamzone3_2026-11-12.md:20].

## 3. What the room already knows

- E's wardrobe sheet [read handback/p-d668-wardrobe-E_2026-11-11.md]: slot buff families (:212-232), rarity magnitudes and quirk slots (:228-240), rub-off rule 5% +2%/min, x1.5 won, cap 30% (:242-257), the 24-stat mini-buff catalogue with a cap under +10% per parameter (:578-612), shop rerolls by price tier (:559-575), restock once per wake, hash of (save seed, wake count, item id) (:637-647), lock 40 / remove 25 energy in the chair (:620-630). All numbers are E's, none his.
- E's legendary set (:527-558) predates 121 and 123: the pick, bomber and sunglasses need re-sorting.
- E's difficulty options for item 132: G1 grace minutes, G2 count cap by runs played, G3 cap by chapter, mobs M1-M3; E leans G2, needs "a persistent count of runs played" [read handback/p-l170-scale-E_2026-11-12.md:74-90, 120-124].
- Cheque, cash from a dream, energy as what the dream is made of: E's lore T4, T7 [read handback/p-d661-lore-E_2026-11-11.md:76-105]. The kid has "access and no cash"; the writer cash and no energy [:142; brief 71].
- Megabonk facts (silver, slots, quest unlocks) are in brief items 32 and 34 notes, from web search, not re-read by me.
- Unresearched: XP-to-level curves in comparable roguelites; Darkest Dungeon's quirk lock and removal costs; Cyberpunk cyberware numbers; E's own note that an outside survey of buff types is owed (:614-618). Not read: Vampire Survivors evolutions.

## 4. Contradictions and calls that are his

| # | question | options and cost |
|---|---|---|
| 1 | XP unit: 7 says time alive, 53 says distance. Metres walked, or depth reached? One number for XP and the HUD points, or two? | (a) metres on the ground with multipliers: needs a per-tick accumulator in WorldApp, small. (b) today's time curve: no work, ignores 53. (c) in-run points stay time-shaped, global XP from metres and events: two numbers, both shown. I lean (c) [inferred]. |
| 2 | Is the global level one number for the whole profile, or per character save? 68 says both "carries your overall XP" across characters and "each character can act as its own save" | One profile with a shared global level and per-character records: a profile file shaped for it now. Fully separate saves: simpler, breaks "global level caps unlock new characters". Changing later means a migration. |
| 3 | Does a lost run keep container cash and energy? 66 loses points, 69 gives global crumbs, energy comes from "escapes and chests" | Keep container finds even on a loss: softer, makes chests worth opening. Lose all but crumbs: matches 66 literally, harsher. |
| 4 | Does luck stay seed-neutral? 124 says chests spawn more often | (a) the seed fixes the sites, luck decides which are filled; geometry identical, replays store luck. (b) the generator reads luck: the world changes with upgrades, which he refused for Parks (94 note). (a) costs a marker in `gen/`. |
| 5 | Trinket storage size and whether "two" grows. 34: "you can only have so many" | Fixed two carried, unlimited storage: simplest. Slots open at global levels (Megabonk): a level table. |
| 6 | When does cash arrive: instantly at wake, or as the cheque under the door after the first success (70)? | Cheque only for the tutorial run, then instant: two code paths. Cheque always: one path, more story. |
| 7 | Which tiers does a global level unlock? 26 locks the "stronger entities" tier; 132 wants the first runs forgiving | Run count only (E's G2): needs the profile's `runs_played`. Level-gated tiers too: a threshold table. |
| 8 | The librarian's trinket ruling (any number owned, two carried, all strong) was a reading of 32 and 116, not his words; confirm. Guitar pick signature is open (121). | Confirm: tables stand. Reverse: the E trinket table is re-cut. |

## 5. The build path

Tier: prove it. Each lap ends with the stamp, the suites and both self-tests; no timing on L.

**Lap 1: the ledger (smallest thing he sees: the results card shows XP, cash and energy earned and a running profile).**
- Wait for D673 to land only for the `won` flag; the pure part starts now on main.
- Files: new `game/profile.{h,cpp}` (struct `Profile`: xp, global level, cash, energy, runs_played, wakes; text format via `for_each_pair`, `write_text_file` keeps a `.bak` [code game/textfile.h:15-50]); `game/CMakeLists.txt` (add to `dz_game`, add `tests/profile_tests.cpp` to `game_tests`, :26); `game/world/world_app.{h,cpp}` (a `RunTally`: seconds, metres, saved, closes, reprieves used; fill `RunResult`; pay once at `end_run` :411-436, beside the best time); `game/world/hud.cpp:118` (card lines); `game/config/.gitignore` (`profile.txt`).
- Weights live in `game/config/world.txt` as data, not constants, so the unit call (Q1) is a number edit.
- Red first, `game_tests`: `a_profile_reads_back_as_written`; `a_missing_profile_is_a_new_game`; `a_damaged_profile_is_refused_loudly_and_left_in_place`; `a_won_run_pays_more_than_a_lost_one_and_a_lost_run_pays_crumbs`; `xp_is_a_pure_function_of_the_tally`. `world_app_tests`: `a_run_that_ends_adds_to_the_profile_exactly_once`; `a_read_only_app_writes_no_profile` (mirrors `a_read_only_app_writes_no_run`, run_record_tests.cpp:230); `a_replay_pays_nothing`. Mutation by hand: remove the once-guard, the replay row must fail.

**Lap 2: levels and the first attribute that changes a run.**
- Files: `profile.*` (global level from a curve table; attribute points), `world_app.cpp` (apply attributes into `sim::MoveParams` at run start; the record already stores params), a plain text spending screen on the results card (the room is not built).
- Red: `an_attribute_level_raises_sprint_peak_in_the_params_a_run_begins_with`; `a_run_with_upgraded_params_replays_to_its_fingerprints`; `no_attribute_total_exceeds_its_cap` (stays under the generator's `kBaseMove` assumption [code gen/src/gen.h:138]).

**Lap 3: trinkets, owned, two carried, storage.**
- Files: `game/trinkets.{h,cpp}` (data table; effects are param modifiers through the lap 2 pipeline), `profile.*`, `run_record.*` (store the carried two; bump the record's version line), tests.
- Start with three param-only trinkets from three collections; defer the watch's "Still running" and the pick (121).
- Red: `two_are_carried_a_third_goes_to_storage`; `a_trinket_effect_is_in_the_run_record`; `a_replay_with_other_trinkets_is_refused_not_silently_changed`.

**Lap 4: containers (needs B and A's lanes).**
- A found-object site in a Park or reprieve [ours]; luck call Q4; the opening is a pure roll from (seed, container id, luck); the slot-machine reveal is C's look. Flashlight lives here (40, abilities).
- Red: `a_container_opens_to_the_same_loot_for_the_same_seed_and_luck`; `luck_never_moves_the_world_geometry`.

**Lap 5: the shop and the chair as spending (with waking_room).**
- Cash at the PC, energy at the chair; restock once per wake from `wakes`. Red: `a_restock_is_the_same_on_a_replay`; `buying_needs_the_cash`. Clothing and rub-off follow as lap 6, under E's table capped at +10% per parameter.

## 6. Connections

| key | needs from it | gives it |
|---|---|---|
| run_frame | `saved()`, `kept_score`, overtime seconds, the won flag | the profile and where the record's new lines go |
| chase_entities | run count and tiers into `RunParams` (E's G2) | evading and proximity events for XP |
| movement | the params to modify; chain events | attribute and clothing modifiers |
| abilities | the loadout file; chair tiers | energy and cash costs; the flashlight's find |
| stress | fortitude and Virtue roll hooks | carry-over storage |
| waking_room | the bed, PC, chair, wake animation | shop, spend and wake-count data |
| world_gen | container sites; Park lengths | luck, loot tables |
| story_lore | the global level caps | unlock gates; trinket lore |
| look_fear, sound | chest opening look and sound | the card and counters |
| frontdoor_onboarding | the first-run cheque | profile load and new-game flow |
| tech_foundation | record version, landing train | the profile file format |
| entity_bodies, player_body | clothing meshes and slots | none |

One owner for `profile.txt`: step 4 (chase counts) also needs `runs_played`. Whichever lands first creates it; the other reads it.

## 7. Where it is going

Global-level unlocks of characters and endless mode; the Monroe collection on the illicit site; the PC-builder minigame (99); the gym and room upgrades (68); legendary lore drops (113); quirk lock and removal in the chair (118); parody-brand art after a legal review; a Roblox port is parked [his 145], untouched here.

## 8. Not verified

- Nothing was built, run or timed by me. The greps are word searches on `04f3882`.
- All E numbers (rub-off chances, price tiers, lock costs, buff magnitudes) are proposals [ours], not his.
- I did not re-open Megabonk, Darkest Dungeon or Vampire Survivors sources; those facts come from the brief's notes.
- `d673-frame` and `d673-chase` were read as commits, not built; the wip's overtime behaviour is unwritten.
- Whether `Profile` belongs in `dz_game` or a world-level target is [inferred] from the CMake lists.
- items_skipped: none. Item 25's synergy and slot parts belong to abilities; item 57's bhop part to movement; both only referenced here.

## Verification (second reader, 2026-11-13)

- (a) [his N] quotations: ok. Opened `briefs/dreamzone2_the_game.md` and found each phrase under the cited item: 2 "you start lvl 1 and weak" (:12); 7 "time spent alive" (:32); 53 "not time, distance" (:427); 40 "unlocked early you just need to get it" (:351-352); 41 "BOOM, BOOOM, BOOOOM" (:364); 28 "10% sounds good for the start" (:205); 34 "exotic and powerful" and "you can only have so many" (:327-328); 47 "Dads watch" (:389); 52 "slight buff like runes or masteries in league" (:424); 66 "meant to be lost" (:528); 68 "carries your overall XP" and "each character can act as its own save" (:549, :558); 69 "crumbs" (:572); 111 "rub off" (:916); 119 (:977); 132 "should scale with the base difficulty and the progression of the story" (:1036-1037).
- (a) Item 26 summary (closet, PC, treadmill, locked higher tier that strengthens entities for more XP): ok, brief :179-189.
- (a) Section 4 Q4 says the refusal of luck-lengthened Parks is "(94 note)": WRONG. The 94 note (:782-785) is the librarian's proposal (sealed pieces); his refusal is item 124 ("No sealed pieces", :999-1004).
- (b) [code] `chase/run.cpp:205-211`, `chase/run.h:356-359`, `hud.cpp:82` and `:118-127`: ok.
- (b) [code] `world_app.cpp` `load_best`/`save_best` (:587-622), `end_run` (:411) and best set (:426-431); `world_app.h:64-76` RunResult fields; `run_record.h:38` RunEnd, `:50` params, `kRunsKept` (:35, value 20); `chase/dials.cpp:17-38`; `gen/src/gen.h:138` kBaseMove; `textfile.h:35` (.bak); `game/CMakeLists.txt` game_tests list; `run_record_tests.cpp:230`; `game/config/.gitignore`: ok.
- (b) [code] `chase/streamed.cpp:346` `out.distance += ...`: ok (that "only the bots do" is not exhaustively checked).
- (b) Section 2 "git grep ... trinket, xp, cash, energy, clothing, outfit, container, loot: no file": ok for game/, chase/, gen/, sim/, core/ (whole-word, case-insensitive, no hits). Repo-wide it is not "no file" (art textures, audio files match the substrings); the line should say "no game-code file".
- (b) Section 2 "`luck`: only two chase docs": WRONG by one. `git grep -i luck 04f3882` in game/chase/gen/sim finds `chase/CHANGES.md:99`, `chase/README.md:459` and also `game/tests/world_app_tests.cpp:1066` (a comment, not a feature).
- (b) Branches: `origin/d673-frame` 8614983 has `RunEnd::Saved` (run_record.h:38) and `kept_score` (:58); `origin/d673-chase` db8e557 has `saved()` and `kept_score()` (run.h:193-194); `d673-chase-wip` is fc8206d: ok.
- (c) outside sources: could not check, none cited. The doc marks no outside source [read]; section 8 says Megabonk, Darkest Dungeon and Vampire Survivors facts come from the brief's notes.
- (d) Nothing in the doc is marked [read] from a source without a path; all [read] cites are room files. ok.
- (b/d) [read] `handback/p-l170-scale-E_2026-11-12.md:56-59, 74-90, 120-124`: ok (nothing reads progress; G options; needs a persistent run count).
- (b/d) [read] wardrobe sheet cites: slot buffs :212, magnitudes :228, rub-off :242-257 (5% +2%/min, x1.5 won, cap 30%), shop rerolls :559, restock hash and wake count :637-647, lock 40 / remove 25 :620-630, legendary set :527-558 (guitar pick "after Recognition ends" at :553, so it predates 121), +10% movement cap (catalogue section, :611): ok.
- (b/d) Wardrobe "the 24-stat mini-buff catalogue" (:578-612): WRONG or unsupported. The table at :578-612 has 23 stat rows by my count and the file contains no "24" about it.
- (b/d) [read] `handback/p-d661-lore-E_2026-11-11.md` T4 at :76, T7 at :93, "Access and no cash" at :142 (the kid): ok. "The writer cash and no energy" was not found in the lines I read (C2 writer section starts :149); could not check.
- (b/d) [read] `loop/queue_dreamzone3_2026-11-12.md:20` for "queue step 7 sits behind steps 2 to 6": WRONG line. Line 20 is the table header and step 1; step 7 is at :28 ("waiting on 6"), and it chains through 6, 5, 4 rather than naming 2 to 6.
- (b/d) [read] `loop/plan_13h_run_2026-11-13.md:48-84` for "A, B, C, E are on other lanes tonight": ok (lanes A :58, B :66, C :72, E :82). `loop/buildpath_run_frame_2026-11-13.md:25-48` d673 details: ok in substance (db8e557, fc8206d, 8614983 sections at :10-18 of the part I read).
- Repo commit `04f3882`: ok (`git log -1`).
- (e) Coverage of items 2, 7, 21, 25, 26, 28, 32, 34, 40, 41, 42, 47, 48, 51, 52, 53, 57, 58, 66, 67, 68, 69, 86, 87, 94, 98, 99, 109, 111 to 121, 123, 124, 132: all addressed in section 1. None skipped. Small slip: the table puts "exotic and powerful" and "extras go to storage" on the 32/34/47/48 row, which is item 34's content only.
- Other items cited and checked: his 70 (cheque after first successful run), 84, 145 exist and say what is claimed: ok.

Totals: checked 22 groups of checks; ok 17, WRONG 4 (item 94/124 attribution, luck "two docs", "24-stat", queue :20 line), could not check 2 (outside sources none cited, writer "cash no energy").
