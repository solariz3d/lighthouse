# Build path: stress, frenzy, Recognition, virtues and afflictions, fortitude (key: stress), 2026-11-13

Game repo read at commit **04f3882** (`git log -1`), read only. Brief = `briefs/dreamzone2_the_game.md`. Marks: [read] opened, [code] file:line in the game repo, [inferred] my reasoning, [ours] a proposal with no source.

## 1. His words
| item | what he asked for |
|---|---|
| 28 (brief :205) | A Darkest Dungeon style meter. Being "closely purseued" raises it; staying in line of sight raises it; "evade it without line of sight for a solid chunk of time" lowers it; so do reprieves. At full, entities go into "frenzy mode", hard on base difficulty and scaling "exponentially" with difficulty and with distance or time. The AI "fixate on fear and instability". Consumed before the timer: lose the XP, keep the insanity. |
| 31 (:253) | At max stress the waking room can be invaded (window figure, flicker, PC scare, knock, mother). Looking out the window "could lower insanity"; staying awake over 15 min raises it. An invaded start is at max stress. |
| 32 (:275) | Supersedes 28's name: "perhaps stress is better than insanity", the Darkest Dungeon "virtuous and afflicted". At full: 75% frenzy, 25% Resonant, reset the bar, "15-30 seconds". Window relief needs "a cap". An ability may change the odds. |
| 38 (:347) | The fused flashlight "frenzies all other entities that it isnt being pointed at". |
| 42 (:366) | Mental fortitude: an "ancient meditation mini game"; lowers stress and the frenzy's peak, "not by enough to stop it", "like sharks and blood in water". |
| 50 (:419) | Meditating while tweaking abilities gives "a baserate reduction of stress", upgradable. |
| 53 (:426) | Frenzy pays more XP per second; proximity to entities is a UI multiplier. |
| 58 (:459) | The shroud (entities lose your location) "gives you stress, when you use it". |
| 59 (:477) | Virtues give a persistent buff for the rest of the run "or until you lose your sanity again". Make our own virtues and afflictions; frenzy is one of "a plethora" of effects. |
| 60 (:486) | Top virtue is "simple Resonant", "ultra rare": the 25% first, then "1-3%" (he then says 1-2) on top. All buffs for the rest of the run and "your stress cannot increase". |
| 61 (:490) | Supersedes 32's length: "a solid 2-3 mins". Frenzy still happens during it, but "the signal then cannot be destroyed". After: passive buffs and no stress remain. |
| 62 (:497) | Name: "recognition". Open question: "Why cant the player constantly embody that state". |
| 121 (:983) | Once Recognition happens "there is no stress for the rest of the run", so "after recognition ends" buffs make no sense. The guitar pick needs a new signature. |
| 171 (:1159) | Grief or stress as a gateway to "awakening an attunement". The real case stays out; fiction only. |

Superseded: 28's "insanity" by 32's "stress"; 32's 15-30 s by 61's 2-3 min; 32's reset-the-bar by 60-61's stress frozen for the rest of the run.

## 2. What exists today
- Nothing of stress. [code] Greps of `chase game gen` for `stress|sanity|insanity|frenzy|resonant|recognition|virtue` hit only prose (`chase/SPEED_MODEL.md`, docs). No branch of the repo carries any (all local and origin branches grepped).
- The nearest: the director's pressure `intensity_`, 0 to 1, rises from lesser chasers pursuing or within 3.5 m, falls over 10 s ([code] `chase/run.cpp:1158-1161`), drives BuildUp, Peak, Fade, Relax (`run.cpp:1171-1191`), is hashed (`run.cpp:554`). It ignores the hunter on purpose (`run.cpp:1148-1151`) and is not tied to the player's fear. It shows only in the debug HUD line (`game/world/hud.cpp:235`).
- Facts a stress meter can read: `Agent::contact` (a chaser sensed the player; the hunter's is sight range plus a clear line, `run.cpp:738`), `Run::see` (`run.cpp:289`), `in_reprieve_` (`run.cpp:585,602`), `out_of_reach_s()` (`run.h:198`), events `Sighted` and `Heard` (`run.h:66-67`), `Run::draw(salt,n)` (`run.cpp:285`, the deterministic roll).
- Difficulty: 39 dials driven by time survived only, with a written rule that no dial reads distance, "no rubber-banding" (`chase/dials.h:6-7`). Levels 0 to 3 via `start_minutes` and `pace` (`dials.h:85-91`).
- Branches in flight: `origin/d673-frame` 8614983 (`run_length_s` as a setting, run record knows a saved run) and `origin/d673-chase-wip` fc8206d (overtime chase, untested). Neither touches stress. Queue step 5 waits on step 4, which waits on 3 and 2 (`loop/queue_dreamzone3_2026-11-12.md:26`); tonight's lanes reach step 4 at most (`loop/plan_13h_run_2026-11-13.md:64`).

## 3. What the room already knows
- Design sorted: `briefs/dreamzone3_design.md:110-129` (section 5), `:201-206` (invasions, mother, window), `:324-325` (stress blocks frenzy, Resonant, invasions). Open there: carry-over after a regular catch; shown or felt.
- Sweep ranks it 5, size L, "not built" (`handback/p-d669-sweep-E_2026-11-11.md:216,271`); the run's frame must land first because the Virtue roll keys off "a won run" (`:290`).
- Story's reading of Recognition: the moment the kid recognises the darkness as himself; frenzy during it is the self refusing to be seen; how often he reached Recognition picks the ending; the hoodie door wants 3 Recognitions (`handback/p-d667-story-E_2026-11-11.md:276-281,299-300,407-408`). These are E's [MINE], not his. Mother's note lowers stress (`:94`); invasions start in chapter 3 (`:100`).
- Abilities that charge stress: shroud (hunter or only lessers?), Steady halves gain (`handback/p-l170-abilities-E_2026-11-12.md:28,58,61`); the surge's heat reads as stress (`handback/p-l171-movement-tech-E_2026-11-12.md:252-254`).
- Gear and character hooks: stress gain, stress out of sight, Virtue roll as stats (`handback/p-d668-wardrobe-E_2026-11-11.md:221-222,392-397`); a character buff of 25% slower stress and a 35% roll (`handback/p-d661-operator-E_2026-11-11.md:85-86`). The pick's old signature (`p-d668:372,553`) is dead by his 121.
- Darkest Dungeon, [read] `darkestdungeon.wiki.gg/wiki/Affliction` and `/wiki/Stress` (licence not shown by the fetch): gauge 0 to 200; at 100 an affliction or, base 25% decided before affliction weights, a virtue; virtue sets stress to 45 and is lost at 200 (stress to 0, no heart attack); eight afflictions (Fearful, Paranoid, Selfish, Masochistic, Abusive, Hopeless, Irrational, plus DLC Rapturous and Refracted) with stat penalties, an act-out chance of about 29 to 42% per turn and refusals; cured by stress 0; stress-damage reduction capped at 80%. The five virtues come from item 59's check. Not on the pages: the resolve check and virtue effects.
- Unresearched: how horror games pace a fear meter that feeds AI; whether the chase's fairness bars survive an exponential frenzy.

## 4. Contradictions and calls that are his
1. **Which line of sight raises stress?** (a) a chaser has a clear line to you, any kind (the hunter then keeps it high much of the time; item 65 says it is omniscient); (b) you see a chaser in your view; (c) both, weighted. Cost: (a) is a few lines on `contact`; (b) needs the view cone and a look-back bot, and rewards not looking; (c) doubles the tests.
2. **Does frenzy break the "time survived only, no rubber-banding" rule** (`dials.h:6-7`)? Item 28 wants aggression to follow fear. (a) amend the rule: stress may feed one named frenzy scale; (b) keep the rule, and frenzy changes only the director (spawn rate, hints, lesser sense), never speeds; (c) frenzy as a timed burst on any chaser. Cost: (a) touches every fairness bar; (b) is weaker than 28 reads; (c) needs an end rule.
3. **How does a frenzy end, and what is stress after it?** Not in 28, 32 or 61. (a) stress resets to a floor (Darkest Dungeon's 45); (b) frenzy lasts while stress is full and bleeds off; (c) a fixed length. Also its ceiling: "exponentially" with no cap may make runs certain; a cap is [ours].
4. **Recognition's frequency (his item 62).** His odds are 0.25 to 0.5% per full-stress event ([inferred] from 60), so about 200 to 400 events on average, while E's story gate wants 3 Recognitions. (a) keep the dragon and loosen the story gate; (b) raise the odds by abilities and gear (32 allows it); (c) a second, non-random route to the same state. Cost: (a) rewrites a story step; (b) feeds the "spec into stress" exploit he accepts; (c) breaks "ultra rare".
5. **Does Recognition stop catches** ("cannot be destroyed")? It must also meet D673's overtime save. (a) yes, no catch for its 2-3 min; (b) a catch is a save, score kept. Cost: (a) is a catch-rule exception shared with the Aura; (b) lets a lucky player skip the timer.
6. **Meter shown or felt**, and whether a regular catch carries stress over. Both open in the design doc. Shown: a bar. Felt: screen and sound only. Lap 1 shows it in the debug line either way.

## 5. The build path
Rule: new behaviour sits behind a default-off switch so every old record and fingerprint is unchanged (D673's F5 pattern, `loop/plan_d673_run_frame_2026-11-11.md:72`). All numbers below are [ours] until he plays.

**Lap 1: the meter, read-only (the smallest thing he can see).** A pure `StressMeter` in `chase/` that the run feeds each tick, shown as a number and bar in the debug HUD line. It changes nothing in the chase.
- Files: new `chase/stress.h`, `chase/stress.cpp`; `chase/run.h`, `chase/run.cpp` (a `StressParams` in `RunParams`, default off; an accessor; the update beside `direct()`); `chase/CMakeLists.txt`; new `chase/tests/stress_tests.cpp`; `game/world/hud.cpp:235`.
- Rule: rises while any chaser's `contact` is true; a hold of a few seconds after contact ends, then it falls; falls faster inside a reprieve; clamped 0 to 1. Not hashed while read-only.
- Tests, written first against an accessor that returns 0, so red by assertion, green after: `stress_rises_in_sight`; `stress_holds_then_falls_out_of_sight`; `stress_falls_in_a_reprieve`; `stress_stays_between_0_and_1`; `stress_is_the_same_for_the_same_seed`; `stress_off_leaves_every_fingerprint_unchanged` (golden hashes taken on 04f3882). Hand mutants: flip the sight test, drop the clamp, drop the hold.
- Hand-back: a bot clip with the bar, and where the bot was in sight.

**Lap 2: the full roll and frenzy** (after calls 2 and 3). At full: 75% frenzy, 25% virtue, drawn with `Run::draw`. Frenzy is a per-agent scale, so item 38's flashlight can later set it per entity. Files: `stress.*`, `run.cpp` where dials are read, `game/world/run_record.*` (replays carry the params). Tests: `full_stress_rolls_the_same_for_a_seed`, `roll_is_75_25_over_2000_seeds`, `frenzy_scales_lesser_speed`, `frenzy_is_capped`; the existing chase rows unchanged with the switch off. Switch on only in `world.txt`.

**Lap 3: Recognition** (after calls 4 and 5, and D673). 1 to 2% inside the good roll; 120 to 180 s golden phase; stress frozen for the rest of the run; frenzy still on; no catch during it if call 5 is yes. A `force_recognition` setting so he can see it without hundreds of runs. Tests: `recognition_freezes_stress`, `recognition_window_ends_and_buffs_stay`, `no_catch_during_recognition`, `recognition_odds_match_the_two_rolls`.

**Lap 4: virtues and afflictions as data.** A table of effects (his five virtue names are not given; Darkest Dungeon's are a [read] reference only), the rule that a buff lasts until the next full-stress without a virtue (59), a themed affliction set on top of frenzy. Test: `virtue_persists_until_a_failed_roll`.

**Lap 5: fortitude, sources, carry-over.** `add_stress(amount, source)` for the shroud, the surge and gear; fortitude scales gain and lowers the frenzy peak but never to zero (Darkest Dungeon caps reduction at 80%, [read]); a serialisable `StressState` for carry-over (call 6). Tests: `fortitude_lowers_peak_not_to_zero`, `shroud_cost_adds_stress`.

**Lap 6: the room's side** (waits on meta_loop and waking_room): window relief with a cap, the 15 min rise, the chair's base reduction, mother, invasions at max stress.

## 6. Connections
| key | needs from it / gives to it |
|---|---|
| run_frame | needs D673's timer, `saved()` and the won-run flag (the Virtue roll keys off it); gives the Recognition catch exception |
| chase_entities | needs a per-agent scale hook; gives frenzy as late-run pressure |
| abilities | gives the `add_stress` cost for shroud and surge; needs per-entity frenzy for the flashlight (38) and Steady |
| meta_loop | needs a profile save for carry-over, fortitude training, gear stat hooks |
| waking_room | window, chair, mother and invasions all read and write the meter |
| story_lore | gets the Recognition count for the ending and the hoodie door; needs call 4 |
| look_fear, sound | need the meter as the director's input (design doc GAP) and the golden phase look and chord |
| player_body, movement | virtue buffs on movement params |
| world_gen, entity_bodies, tech_foundation, frontdoor_onboarding | none found |

## 7. Where it is going
Invasion variants and the mother's branching dialogue; the full virtue and affliction catalogue; fortitude training in the chair; frenzy-fed XP and the proximity multiplier (53); story gates on Recognition; stress as the director's single "dream intensity" read.

## 8. Not verified
- No code was built or run; every test above is a plan, and all rates are [ours].
- The all-branch grep used word patterns; a system under another name would be missed.
- Whether `Agent::contact` suits the hunter's line-of-sight meter: read at `run.cpp:738` only.
- I found no version field in the run record ([inferred] from `run_record.h` text); D673's default-off pattern is assumed to apply.
- The Darkest Dungeon pages came through a summarising fetch, not read whole; virtue effects and resolve checks were not on them.
- Item 31's invasion detail is from the brief and design doc; no game code exists for it.
- items_skipped: none.

## Verification (second reader, 2026-11-13)
- (a) [his N] quotes: items 28, 31, 32, 38, 42, 50, 53, 58, 59, 60, 61, 62, 121, 171 all opened in the brief; every quoted phrase ("closely purseued", "fixate on fear and instability", "evade it without line of sight for a solid chunk of time", "scales exponentially", "could lower insanity", "perhaps stress is better than insanity", "virtuous and afflicted", "15-30 seconds", "a cap", "not by enough to stop it", "like sharks and blood in water", "baserate reduction", "gives you stress, when you use it", "plethora", "ultra rare", "1-3%", "stress cannot increase", "solid 2-3 mins", "cannot be destroyed", "Why cant the player constantly embody that state", "awakening an attunement") is present verbatim under that number: ok.
- (a) Item 28's "frenzy ... frenzies other entities not pointed at" (38) and 53's frenzy/proximity XP: ok.
- (a) Brief line numbers in section 1 table: 28 :205, 31 :253, 32 :275, 38 :347, 42 :366, 50 :419, 53 :426, 58 :459, 121 :983, 171 :1159 ok. WRONG: 59 is at :474 (doc :477), 60 at :489 (doc :486), 61 at :495 (doc :490), 62 at :503 (doc :497). Read in briefs/dreamzone2_the_game.md.
- (a) Item 60 "(he then says 1-2)": ok ("1-3% might be lots like 1-2 maybe"). Item 61 "Frenzy still happens during it": ok.
- (b) [code] chase/run.cpp:1158-1161 (intensity rises/falls, clamp): ok; note `pressed` also fires when a lesser chaser is within 15 m (run.cpp:1155), not only pursuing/3.5 m (the doc's summary is slightly narrower).
- (b) run.cpp:1148-1151 ignores hunter on purpose: ok. run.cpp:554 hashed: ok. run.cpp:738 hunter contact = sight range plus see(): ok. run.cpp:285 draw, :289 see: ok. run.cpp:585,602 in_reprieve_: ok. run.cpp:1171-1191 phases: ok.
- (b) chase/run.h:66-67 Sighted/Heard: ok. WRONG: `out_of_reach_s()` is run.h:200; run.h:198 is `reprieve_open()`.
- (b) chase/dials.h:6-8 "no rubber-banding" rule: ok (the sentence runs lines 6-8). 39 dials: ok (DZ_CHASE_DIALS counted 39). dials.h:85-91 Difficulty start_minutes/pace: ok. game/world/hud.cpp:235 intensity in debug line: ok.
- (b) Branch heads origin/d673-frame 8614983 and origin/d673-chase-wip fc8206d: ok. HEAD 04f3882: ok. Claim "no stress/frenzy code in any branch": git grep over branch heads returned nothing; ok. Prose hit in chase/SPEED_MODEL.md is only the word "sanity" (a sanity check), not stress design: ok.
- Room citations: queue_dreamzone3:26 (step 5 waits on 4), plan_13h_run:64, plan_d673_run_frame:72, dreamzone3_design.md:110-129/201-206/324-325, p-d669-sweep :216,271,290, p-d667-story (:94,:100,:276-281), p-l170-abilities :28,:58,:61, p-l171 :252-254, p-d668 :221-222,:392-397, p-d661 :85-86: ok.
- (c) darkestdungeon.wiki.gg/wiki/Affliction re-fetched: base 25% virtue before affliction history, 7 base plus Rapturous and Refracted DLC afflictions, act-out 29.4 to 41.67%, cure at stress 0: ok. WRONG: the doc says "licence not shown by the fetch"; both pages state Creative Commons Attribution-Non-Commercial-ShareAlike 4.0 (pages before Aug 2023 adapted from the Fandom wiki).
- (c) darkestdungeon.wiki.gg/wiki/Stress re-fetched: gauge 0 to 200, 100 threshold, 200 virtue lost and reset to 0, 80% reduction cap: ok. Virtue-to-45 is there but the page itself gives both "40-45" and 45; the Affliction page does not state it. "Base 25%" is not on the Stress page (it says "small chance"); it is on the Affliction page.
- (d) Nothing marked [read] lacks a source; the two DD pages carry URLs. The doc's eight-afflictions list actually names nine including DLC: minor count slip ("eight ... plus DLC" lists seven base plus two DLC).
- (e) Coverage: items 28, 31, 32, 38, 42, 50, 53, 58, 59, 60, 61, 62, 121, 171 all addressed in section 1; none skipped. Item 31's knock/mother detail is from the design doc, not item 31 text: fine, as the doc states.
Totals: checked 38, ok 31, WRONG 6 (four brief line numbers, run.h:198, licence statement), could not check 0; one minor miscount noted.
