# Build path: the run's frame (key run_frame), 2026-11-13

Written by a research worker for the librarian seat. Game repo `C:/Users/zackn/Downloads/dreamzone-3`, read at commit **04f3882** (main; origin/main is `e0184ea`, three commits behind). Branches read without checkout: `origin/d673-chase` db8e557, `origin/d673-chase-wip` fc8206d, `origin/d673-frame` 8614983. Nothing was built or run. Marks: [read] opened and read, [code] file:line, [inferred] my reasoning, [ours] a proposal with no source.

## 1. His words

Brief = `exo_memory/briefs/dreamzone2_the_game.md`.

| item (brief line) | what he asked for | short quotes |
|---|---|---|
| 3 (14) | A room, a bed, the door as the run's entrance, a chaser at once. | "your rooms door is the entrance to the game run"; "right away something is there to chase you" |
| 26 (161) | The catch is a scare, then a portal home. Good entities quiet the sound and fill the halls with gold. No out-of-body in the dream. | "a rapturing portal"; "it all quiets down when a good entity is near by"; "resonant golden aura" |
| 28 (205) | A time limit; two gods; an unbeatable end like Vampire Survivors' Reaper; the good god saves "last second". | "perhaps like 10-15 min runs depending on play testing"; "you cannot outrun death"; "even safe zones dont save you, just reroute it" |
| 30 (243) | Caught early: lose all; the death shows it was always the evil god. At the timer it stops playing; the good one steps in. | "you lose it all"; "playing with its food"; "not knowing which part was taken"; "mirror its symmetry" |
| 53 (426) | XP by distance; extra for time survived after the round is over. | "tons of bonus XP for surviving a longer time after the round is over" |
| 66 (523) | The settled rule. | "the overtime mode is meant to be lost, but good god saves you and sends you back successfully" |
| 172 (1165) | The thesis. The love must be felt in play. | "all we can do is run, and hope that at the end when it catches us, there is something else out there good, that saves us" |

**Supersession.**
- Item 66 supersedes item 28's "if it consumes you, you lose all your xp" and item 30's "at the timer the good god steps in": consumed only before the timer; after it, overtime and a certain save (brief 529-531).
- Item 53's "time" is settled by item 69: a lost run gives "crumbs", a won run the real amount (brief 575-577). `briefs/dreamzone3_design.md:259` still lists it as a GAP, so that line is stale [inferred].
- Item 107 names the good god the Absolute (brief 887). Item 110 leaves the dark one's name open (brief 906); code says `Kind::Dark`.
- Item 16 (outside my list): the brutal jumpscare is "not during testing" (brief 84-88).

## 2. What exists today

**Main (04f3882)**
- No timer, overtime, save or win. `RunEnd { Caught, Void, Left }` [code game/world/run_record.h:38]. `Phase { BuildUp, Peak, Fade, Relax }` [code chase/run.h:122]; there is no Toying/Testing/Hunting escalation (D666 section 3 proposed it, `handback/p-d666-entities-E_2026-11-11.md:110-119`).
- A catch or a void sets `over_` [code chase/run.cpp:274, 529]. `WorldApp::end_run` summarises, sets a best time and calls `keep_run(Void or Caught)` [code game/world/world_app.cpp:411-436]. A 1.4 s cut to dark, then the card [code world_app.cpp:26, 356; hud.cpp:98-133].
- The clock counts up [code hud.cpp:80]. Score is `10t + t^2/12`, so 36,000 at 600 s [code chase/run.cpp:205-215; arithmetic mine].
- The start is a closed bedroom door; the hunter arrives after 8 s [code chase/dials.h:20; hud.cpp:324]. The Park holds 20 s [code dials.h:55]. `Mode::Leaving` exists already [code run.cpp:1003, 1025].
- No mutation harness (`git ls-files | grep -i mutat` gives 0).

**`d673-chase` db8e557 (A, interface only)** [read `handback/p-d673-chase-A_2026-11-11.md:7-19`]
- `RunParams::run_length_s` (0 = no timer), `overtime()`, `overtime_seconds()`, `saved()`, `kept_score()`, `Kind::Dark` (hunter's body, not built), `Phase::Overtime` (nothing sent in it).
- Nothing sets `saved_`. Behaviour is unchanged (checked there: chase 54/54, world_app 40/40, selftest 52/52).

**`d673-chase-wip` fc8206d (A, uncommitted at shutdown)**
- [code, `git diff --stat db8e557..fc8206d`] 5 files, 255 lines: five dials (`overtime_clear_s` 12, `dark_spawn_m` 40, `dark_speed_start` 1.35, `dark_speed_rise` 0.02, `overtime_score_multiple` 5), `PlayParams::run_length_s`, `Outcome::saved/overtime_s/kept_score`, and `chase/tests/overtime_tests.cpp` (240 lines, eight rows: F5 guard, timer, F4 clear, dark catch is the save, early catch keeps nothing, Park does not hold, void in overtime, bonus).
- **It has no change to `run.cpp` or `run.h`.** `git show fc8206d:chase/run.cpp` has no `saved_` assignment. The librarian's note called it "A's overtime chase as it stood" (`loop/handoff_dreamzone3_2026-11-11-D.md:35`); what it holds is the tests and dials, not the behaviour [inferred from the diff]. Untested.

**`d673-frame` 8614983 (C)** [read `handback/p-d673-frame-C_2026-11-12.md`]
- `run_length_s` world setting (600, 0 to 3600) in `world_settings.h` and `config/world.txt`; `RunEnd::Saved`; `RunRecord::kept_score`; an old record with no line reads as no timer. Rows: 43/43 before the rebase; **not rebuilt since** (`:15`).
- Written, not applied, in `handback/p-d673-frame-C_2026-11-12_evidence/`: `framepatch.js` (timer notice, `RunResult` fields, white-light save, cards) and `timed_rows.cpp` (three rows). They need `PlayParams::run_length_s`, which the wip carries.

**In flight tonight** (`loop/plan_13h_run_2026-11-13.md`)
- A: lane 1 is L182 (the chase law); this chase half is lane 3, "while sweeps run" (`:63`). C: the frame is lane 4 (`:79`), after the hunter's arms and the drops. Behind them, not blocked by them.

## 3. What the room already knows

- **The plan and its falsifiers.** `loop/plan_d673_run_frame_2026-11-11.md:64-70` registers F1 to F5 (no bot survives overtime past 90 s; flee beats straight by 25%; flee median in 15 to 45 s; clear within `overtime_clear_s`; nothing changes at timer 0). C1 to C3 are at `:92`. The amendment at `:112-115` says none of his 11 kept runs replays identically even on cab3530, so C1 became a format test.
- **Why it is first.** E ranks the missing frame #1 and says XP, cash, energy and the Virtue roll all key off "a won run" (`handback/p-d669-sweep-E_2026-11-11.md:238-240, 254-258`).
- **Story.** In D667's mapping, overtime is the darkness itself, and on its last chapter "the camera turns and holds" and the dark thing is seen to be him (`handback/p-d667-story-E_2026-11-11.md:273`, with brief 107).
- **Research already in the brief.** Vampire Survivors' Reaper arrives at 30:00 and is not meant to be killed (brief 231-233); Becker is linked to item 172 (brief 1165-1170).
- **Unresearched.** How other games stage an unwinnable last chaser; what makes a rescue read as love and not relief (item 172's rule). The second has no source yet.

## 4. Contradictions and calls that are his

**Q1. Is the timer shown?** (Plan ruling: no countdown, the clock counts up; `plan_d673:88-90`; gap at `dreamzone3_design.md:57`.)
- (a) Nothing shown. Cheapest; a player may not know a limit exists.
- (b) A countdown. It lets the player plan and weakens "playing with its food" [inferred].
- (c) A late tell only (the last minute). One HUD state.

**Q2. Length.** 10 to 15 min is his; 600 s is the bottom (`plan_d673:79`).
- (a) One length in `world.txt`. (b) Per difficulty. (c) Longer with chapters (item 28). Decide after play.

**Q3. What does a void in overtime do?** Plan ruling: save. His to veto.
- (a) Save. (b) Lost, like a void before the timer. (c) The dark one carries you; void-as-save is unreadable [inferred].

**Q4. Does a Park stop the dark one?** Item 28 says safe zones "just reroute it". Plan's reading: it comes by the Park's own way.
- (a) Reroute by the way round. (b) It passes through the walls ("cheating"); costs the nav, gains certainty. (c) Parks close in overtime.

**Q5. Is the dark one the hunter?** Item 30 says "it was always the evil god chasing you". The plan makes it a new agent after the others walk off.
- (a) New agent (planned; the stand-in is the hunter's model). (b) The hunter itself changes at the timer, so the reveal is in the world and not on a card. (c) Both: the dark one wears the hunter's shape until the catch. Costs: (b) and (c) touch the hunter's model, which is C's lane.

**Q6. "The part taken" (item 30, GAP `design:56`).** Felt only, or real (a trinket, an ability, a memory)? Costs: real loss reaches the meta loop; item 28 already keeps stress.

**Q7. Is the loss's portal (item 26) the same sequence as the part-taken reveal (item 30)?** One sequence (scare, portal, bed) with the reveal inside it, or two.

**Q8. The dark one's name,** four candidates open (brief 906). Blocks the reveal lap, not the frame.

## 5. The build path

Tier: prove it. Each step is red first, then green, then the suite.

**Lap 1: the timer, overtime and the save, playable (A and C in parallel, land together).** What he sees: set `run_length_s` to 60 in `world.local.txt`; at 60 s the others walk off, something comes from behind, the catch goes to white and a card says Saved with points kept and the overtime bonus.
- **A, `chase/`.**
  - Files: `run.cpp`, `run.h`, `archetype.cpp`, `dials.h`, `play.cpp`, `play.h`, `tests/overtime_tests.cpp`, `CMakeLists.txt`.
  - Start from `d673-chase-wip` (read it; it is tests and dials only). Rows are already written: `with_the_timer_unreached_a_timed_run_is_the_untimed_run_tick_for_tick`, `at_the_timer_the_run_goes_into_overtime_and_only_the_dark_one_is_sent`, `in_overtime_the_others_walk_off_out_of_sight_and_are_gone_by_the_clear`, `the_dark_one_comes_from_out_of_sight_behind_and_a_catch_by_it_is_the_save`, `a_catch_before_the_timer_keeps_nothing`, `a_park_does_not_hold_the_dark_one`, `a_fall_into_a_void_in_overtime_is_the_save_and_before_it_is_not`, `overtime_pays_its_multiple_of_the_rate_the_run_had_at_the_timer`.
  - Build: enter `Phase::Overtime` at the timer; set the others to `Mode::Leaving`; spawn one `Kind::Dark` `dark_spawn_m` behind and unseen; set `saved_` on its catch or an overtime void.
  - Order: see the rows red against the interface (they should fail on the missing behaviour), then green. Then the existing chase rows and the fingerprints must equal main's with `run_length_s` 0 (F5).
- **C, `game/`.**
  - Files: `world/world_app.cpp`, `world_app.h`, `hud.cpp`, `run_record.cpp`, `run_record.h`, `world_settings.h`, `config/world.txt`, `tests/run_record_tests.cpp`.
  - Rebase `d673-frame` onto A's landing, build and confirm 43/43 first. Apply `framepatch.js`; append `timed_rows.cpp`: a catch before the timer keeps nothing, and a saved run keeps every point with its bonus and replays as saved.
  - Mutation by hand: set `world.txt` to 60 and the shipped-defaults test must fail (plan C2).
- **Not in lap 1:** the dark one's own model (stand-in: hunter's), sound, a countdown.

**Lap 2: tune it by the bots (A).**
- Files: `dials.h`, `tests/overtime_tests.cpp`; a sweep in `chase/tools/dz-chase/`.
- Run F1 to F3 on 20 seeds x three policies **after** L182's default lands, since overtime survival depends on the chase law [inferred]. Report any F that fires; do not tune it away. Add item 178's two exploit bots (`plan_13h:16`) and the Park row on B's chute Parks (`plan_d673:100-102`).

**Lap 3: the loss and the wake (C, with the waking room's minimal bed).**
- Files: `hud.cpp`, `world_app.*`, a new minimal bed scene, `sound.*`.
- Loss: the scare and the portal (item 26), behind a setting off in tests (item 16); wake in bed (items 3, 30). Tests: the loss keeps no points; the wake puts the player at the bed; the scare is off in the self-test. Needs the waking room's first scene.

**Lap 4: the rescue felt (C and E).**
- Files: `sound.cpp`, `hud.cpp`, the grade at `render/renderer.h:87-96`.
- As the dark one closes: breathing and field sounds fall quiet, gold rises, a chord (item 26), then the white-out. Test: the mix drops under a set level in the last second before a save [ours]. Research the source first.

**Lap 5: kept points and the reveal.**
- Files: a profile file next to `best_times.txt`, `run_record.*`, `hud.cpp`.
- Kept points written; crumbs for a loss (item 69). The reveal waits on Q5, Q6 and Q8.

## 6. Connections

| key | needs from it | gives it |
|---|---|---|
| chase_entities | the dark one's speed and clear; L182 law; lesser chasers' arc | the timer as a director input (the director reading it is a GAP, `design:248`) |
| entity_bodies | a dark-one model; the hunter's model for Q5 | the catch event and kind |
| movement, abilities | speed and escape tools set overtime length | a measure of how long a build lasts |
| stress | stress after a loss (item 28 keeps it) | the loss event |
| meta_loop | "won run" as the unit; kept points and crumbs | `kept_score`, `saved`, overtime seconds |
| waking_room | the bed and wake | the run's door and the return trigger |
| world_gen | Parks on chutes (B), voids | the void-in-overtime rule |
| look_fear, sound | gold, quiet, the scare | cue points: timer, close, catch, save |
| story_lore | the dark one's name; the ending reveal | the frame where the reveals land |
| frontdoor_onboarding | the title and a first-run explanation of the limit | the result card |
| tech_foundation | record version, landing train | the new record lines |

## 7. Where it is going

- Endless mode and chaotic chapters (item 28); a harder dark one by difficulty (item 28); the last chapter's turned camera (D667); item 172's felt love, of which the save is the main test.

## 8. Not verified

- Nothing built or run; every test name is read, not seen red or green. fc8206d is untested; C's branch is not rebuilt after its rebase.
- The 36,000-point figure is my arithmetic from the score formula; whether "x5" is fun is unknown.
- Not read: Vampire Survivors' wiki, Primagames and Megabonk (not opened; the brief's check is quoted as the brief gives it). No outside source for the rescue.
- Items skipped: none. Item 26's lore, shop and room clauses belong to other aspects and are covered only for the catch, portal and sound.

## Verification (second reader, 2026-11-13)

Checked by opening each source. Brief = `exo_memory/briefs/dreamzone2_the_game.md`. Game repo HEAD read: 04f3882.

- (a) [his N] quotes, items 3, 26, 28, 30, 53, 66, 172: ok. All 15 phrases are in the brief under the cited item at the cited start line (3 at 14, 26 at 161, 28 at 205, 30 at 243, 53 at 426, 66 at 523, 172 at 1165). Three of them ("right away something is there to chase you", "not knowing which part was taken") wrap across two brief lines, so a one-line grep misses them; the words are verbatim. "rapturing portal" is at brief 178, inside item 26.
- (a) Supersession claims: ok. Item 28 (brief 219) says "if it consumes you, you lose all your xp for that run"; item 66 (brief 523-531), item 69 (573-576), item 107 (887, "the absolute"), item 110 (906, name open), item 16 (84-88) all say what section 1 claims. Minor: item 69's "crumbs" lines are 573-576, not 575-577.
- (b) [code] run_record.h:38 RunEnd { Caught, Void, Left }: ok.
- (b) chase/run.h:122 Phase { BuildUp, Peak, Fade, Relax }: ok.
- (b) run.cpp:274 (void sets over_) and :529 (catch sets over_): ok.
- (b) world_app.cpp:411 end_run, :26 kEndSeconds 1.4, :356 Ended to Results after kEndSeconds: ok. keep_run(Void or Caught) is at :432.
- (b) hud.cpp:80 clock_text(run.seconds()) counts up; hud.cpp:98 draw_results; hud.cpp:324 door text: ok.
- (b) run.cpp:205-207 score 10t + t^2/12: ok; 600 s gives 6000 + 30000 = 36,000: ok.
- (b) dials.h:20 head_start_s 8; dials.h:55 reprieve_hold_s 20: ok. run.cpp:1003, 1025 Mode::Leaving: ok.
- (b) WRONG: `render/renderer.h:87-96` is not "the grade". Those lines are GI, AO and anti-aliasing settings (giStrength, giRange, taa, renderScale). The tone curve and grade are at renderer.h:35-38 (Look::Horror) and :118-122 (vignette, saturation). Lap 4's file pointer is off.
- (b) branches: ok. Local main 04f3882; origin/main e0184ea is an ancestor of it (main is 3 commits ahead of origin/main, 0 behind). Read as "origin/main is three behind": ok. d673-chase db8e557, d673-chase-wip fc8206d, d673-frame 8614983 all resolve. `git ls-files | grep -ci mutat` = 0: ok.
- (b) fc8206d claims: ok. `git diff --stat db8e557..fc8206d` is 5 files, 255 insertions; overtime_tests.cpp is 240 lines; the five dial defaults match; no change to run.cpp or run.h; no `saved_ =` assignment in run.cpp at fc8206d or db8e557. All eight DZ_TEST names exist verbatim (overtime_tests.cpp:33, 54, 84, 130, 153, 166, 197, 220). Note: the "F5 guard" row is the first test (timed run equals the untimed run), consistent.
- (b) db8e557 interface (run_length_s, overtime(), saved(), kept_score(), Phase::Overtime): ok (run.h:123, 138, 191-194). `Kind::Dark` not opened separately (could not check in the time spent; not load-bearing).
- (b) d673-frame: world_settings.h:23 run_length_s 600, 0 to 3600; run_record.h:38 RunEnd::Saved; :58 kept_score: ok. "not rebuilt since" is stated in the C hand-back at :10: ok.
- (c) Outside [read] sources: none are claimed as read. The doc lists Vampire Survivors wiki, Primagames and Megabonk under "Not read" and quotes the brief for them (brief 231-233 does say what is attributed). ok.
- (d) Anything marked [read] from memory: none found. Every [read] cites a file in the room. Two line cites do not fit (below).
- (d) WRONG: `handback/p-d669-sweep-E_2026-11-11.md:238-240, 254-258` for "E ranks the missing frame #1 and says XP, cash, energy and the Virtue roll all key off a won run". Lines 238-240 are the FINAL header and a one-line intro; 254-258 are a "Re-checked on cab3530" grep list. The ranking is at :267 (rank 1 row, also :212) and the "key off a won run" sentence is at :289-290.
- (d) WRONG (mild): Q1 says "Plan ruling: no countdown". `plan_d673_run_frame_2026-11-11.md:88-90` says the HUD clock counts up and that whether a countdown is shown "is an open GAP for him, not built". There is no ruling; it is an open gap, which is how `dreamzone3_design.md:57` also lists it.
- (d) other room cites: plan_d673:64-70 (F1 to F5), :79 (600 s), :100-102, :112-115 amendment; handoff_dreamzone3_2026-11-11-D.md:35 quote; p-d666-entities-E:110-119 phase table; p-d667-story-E:273; plan_13h_run:16, 63, 79; dreamzone3_design.md:56, 248, 259: ok.
- (e) Coverage of items 3, 26, 28, 30, 53, 66, 172: all seven are in the section 1 table and used in section 5. Item 26's lore, shop and room clauses are named as left to other aspects. ok.
- Not verified by me: that any test is red or green (nothing built, as the doc says); `Kind::Dark` at db8e557; world_app.cpp:411-436 body beyond the lines above.

Totals: 24 checks, 21 ok, 3 WRONG (renderer.h grade pointer; p-d669 line cites; "plan ruling: no countdown"), 0 could not check beyond the three not-verified items above.
