# Build path: abilities and ultimates, the flashlight, the chair's Focus levels (key: abilities)

Game repo read at commit 04f3882 (`git log -1`), read-only; the room's files read as of 2026-11-13. Marks: [read] opened; [code] file:line; [inferred] my reasoning; [ours] a proposal with no source. Nothing here is built. Brief items are cited [his N] from `briefs/dreamzone2_the_game.md`.

## 1. His words

| item | what he asked | note |
|---|---|---|
| 10 | the original beam, "a perk or mechanic you unlock or find during the run, maybe perma unlocking eventually" | refined by 36, 40 |
| 25 | base stats, "abilities you start out with", more from chests or good entities that "freeze time and let you choose a new ability at random"; picks synergise (sprint speed plus "increased acceleration": "together they make you very nimble and fast") | an example, not a design |
| 26 | an "ability screen where you make your loadout" on the PC; good entities bought and upgraded; a "resonant golden aura" near a good entity | PC part superseded by 48/49 |
| 29 | second upgradable: the "ability loadout", opened once the character "knows of gateway"; golden aura shield, super sprint, "dream flight", a very rare noclip showing a void beyond the walls | late, rare finds |
| 32 | an "ability that modulates the odds or strength" of Recognition; two equipped trinkets | trinkets belong to meta_loop |
| 33 | "6 basic abilties": "4 out of the six will be physical", two psychic "not decided yet"; four fuse to two ultimates, two psychic to one; training adds physical, the illicit site teaches psychic | the main spec |
| 36 | "fresh spawn you will have no flashlight"; more lights on average | lights belong to world_gen and look_fear |
| 37-39 | the flashlight is unlocked early; with a psychic partner (late) it "slows them down or repels them for a short time"; "it frenzies all other entities that it isnt being pointed at"; its job is to clear an interceptor ahead | the fusion is a late ultimate, not a starter |
| 40 | "you do not spawn with it, you find it in the chests"; asks for a better thing than a generic chest | container form is open |
| 48-50 | the chair: sit, Hemi-Sync, third-person void menu; "which focus level they are one" dictates "which abilties unlock" and they can be upgraded; meditating gives a "baserate reduction of stress", upgradable | supersedes 26's PC route (later) |
| 53 | "use the megabonk limited slots" or "tons of base physical abilities" | opens slots against 33's fixed six |
| 57 | "super slide", a "dive into a roll that moves with the head", a somersault over shorter enemies; bhop an "end game perk" | movement ideas |
| 58 | points come from doing the move more, not extra pay; psychic abilities pay only if owned; an own lesser aura; a "spell" for speed; the shroud "temporarily makes the entities lose your location" and "it gives you stress" | the shroud is the rule-breaker |

Later items touching it: 65 ("the main hunter always knows where you are"); 98 restates the PC for the kid's abilities and meditation for the others; 140 ("until you get ability that upgrades it": abilities lift the surge's limits) [read] `briefs/dreamzone2_the_game.md:1053-1067`.

## 2. What exists today

- **No ability, loadout, slot, ultimate, focus level, chair or container exists.** [code] No such file in `git ls-files`; no local or remote branch matches `abilit|ultimate|noclip|shroud` outside one unrelated hit in `nav/tests/connect_tests.cpp`.
- **The flashlight beam is built, as a carried tool.** [code] `game/world/beam.cpp:29` `hand_lights`, `:66` `ease_focus`; `game/world/world_app.h:116` `carrying_flashlight()` reads setting `flashlight` (`world_settings.h:31`, default 0 in `game/config/world.txt:12`); his play file `game/config/world.local.txt:1` sets 1. The Focus key narrows the beam to 3 and 7 degrees (`world_settings.h:38-42`, `bindings.cpp:21`, `bindings.h:28`). It is lighting only: nothing in `chase/` reads it. Tests: `world_app_tests.cpp:586,619`, `run_record_tests.cpp:269`.
- **Focus is a render-frame value, not a tick input.** [code] `sim/input.h:14-18` has four button bits (jump, crouch, sprint, dive) in a `uint16_t`; replay stores 12 bytes a tick (`sim/replay.cpp:12,44`, version 1). `ease_focus` runs per frame. [inferred] A recorded run cannot know whether the beam was narrow, so the beam cannot affect chasers deterministically until its state is a tick input.
- **Movement parameters are fixed for a run.** [code] `sim/world.cpp:89` `const MoveParams p`; `RunRecord` stores them (`game/world/run_record.h:50`). [inferred] Passive abilities fit as run-start parameters; timed ones need new in-sim state.
- **Hooks an ability can use.** [code] Reprieve already blocks the catch: `chase/run.cpp:520` (`if (!in_reprieve_ || open_)`); lesser chasers have `Mode::Investigate` and a `Knowledge` struct (`chase/run.h:108,260`); `Run::see` is a line-of-sight test (`:281`); `Run::step` receives `PlayerState` with yaw and pitch (`chase/run.h:179`, `sim/world.h:57-71`); the momentum tier `flow_*` is off (`sim/params.h:47-53`); the slide, dive, vault and wall-run parameters are the physical options' levers (`params.h:71-86,101,112-115`); the dive launches along velocity, not the view (`sim/world.cpp:774`).
- **In flight tonight** [read] `loop/plan_13h_run_2026-11-13.md:58-85`: A on `chase/` (L182, then queue step 4), B on `game/body*` and `gen/`, C on `game/model_rig*`, E on `game/skeleton*` and `audio/`. Nothing there touches abilities. Queue step 8 (the six, by name) is his gate and E has drafted options (`loop/queue_dreamzone3_2026-11-12.md:29`); the chair sits after step 7's room.

## 3. What the room already knows

- **E's option sheet** [read] `handback/p-l170-abilities-E_2026-11-12.md`: physical P1 Quick Start, P2 Long Stride, P3 Long Slide, P4 Dive Roll (`:40-44`), P5 Over the Top (cross-module, L), P6 Sure Feet, P7 Long Wall (against his 14); psychic Aura, Shroud, Overclock, Lure, Steady (`:57-61`); ultimates Nimble, Flow, Leapfrog, Unseen, Carried (`:49-51,64-66`); cheapest set P1, P2, P3, P6 plus Aura and Overclock (`:80-85`). Nobody has chosen.
- **Surge limits** [read] `handback/p-l171-movement-tech-E_2026-11-12.md:341-351`: which ability lifts which cap; Overclock passes 12.4 m/s only as a cued bend. Bhop menu and chain options: `handback/p-l164-movement-E_2026-11-11.md:140-175`.
- **Counters** [read] `handback/p-l172-chaser-kit-E_2026-11-12.md:59-70`: each chaser signature against each ability; Overclock feeds the hunter's Appetite.
- **Design doc** [read] `briefs/dreamzone3_design.md:82-107`: open gaps are the six by name, slot counts and what a Focus level is; the PC-against-chair contradiction is at `:186-214` and in `handback/p-l163-design-E_2026-11-11.md:32`.
- **Still unresearched:** Vampire Survivors evolutions (the brief's item 33 note says "not searched this turn"); how a tier-gated ability tree is shown in Darkest Dungeon or Megabonk menus; how any game cues a "frenzy" in creatures outside a beam. Unread by me: `handback/p-l161-look-E_2026-11-11.md` (the golden aura's look and chord).

## 4. Calls that are his

| # | question | options and cost |
|---|---|---|
| 1 | The six: fixed (33) or limited slots (53)? | Fixed: simplest, set fusions, S to M. Slots: an inventory, slot unlocks and a picker, M to L. Mixed (six owned, N equipped): the chair's menu does the choosing. |
| 2 | Where abilities are bought: PC (26, and 98 for the kid) or chair (48-49)? | Chair only: one menu, 98's wording to be reconciled. PC plus chair: two upgrade screens. Per character (98 reads that way): a data table decides. |
| 3 | What is a Focus level? | Story-unlocked tiers (the chair grows with the Gateway reveal): cheap, a data table. Chosen each sitting: needs a cost such as energy or time. Both: the tier is the ceiling, the choice is within it. |
| 4 | Does the shroud blind the hunter (58 against 65)? | Lesser chasers only: M. Hunter too: L, breaks 65, and the stress cost must justify it. |
| 5 | Is the flashlight one of the six, a free tool slot, or a container find that persists? (10, 37, 40) | One of six: simplest. Free: needs a separate tool slot. Run-only find: needs containers (queue step 7) and a perma-unlock rule. |
| 6 | Which psychic power fuses with the beam (37)? | Aura, Lure or a new one; the choice decides what the beam does besides repel. |
| 7 | Does 38's frenzy mean a temporary per-entity state, or the global frenzy of stress (28)? | Per-entity: a small chaser state, M. Global: needs stress first (queue step 5). |
| 8 | Name clash: the `focus` key narrows the beam; "Focus levels" are the chair's | Rename the key (for example `beam_focus`) now, cheap, or live with it. [inferred] |

## 5. The build path

Order is mine [ours]. Each lap lands on main with all suites. "Red first" means the named test fails or does not compile before the change.

**Lap 1: the ability seam, and the flashlight as a loadout item (he can play it).** Make "what the player owns" data, move the flashlight from a test setting to that, and make beam state a recorded tick input. No new ability yet, so it waits on none of his calls.
- Files: `sim/input.h` (add `kButtonFocus = 1u << 4`; no replay format change, buttons are already 16 bits); `game/input.cpp:69` (map `Action::Focus`); new `game/abilities.h` and `.cpp` (ids, `Loadout`, text parse in the style of `world_settings`); new `game/config/loadout.txt`; `game/world/world_app.cpp` and `.h:116` (`carrying_flashlight()` true if the loadout owns it, with `world.local.txt` still overriding so his play file keeps working); `game/world/run_record.cpp` and `.h:50` (store the loadout); `game/world/beam.cpp` (focus from the recorded button).
- Red-first tests (names mine): `loadout_text_parses_and_names_the_bad_line`; `focus_held_survives_a_replay_round_trip` (sim tests); `a_run_with_a_loadout_replays_to_the_same_fingerprint` (`run_record_tests.cpp`); `without_the_flashlight_in_the_loadout_the_hand_holds_the_small_light` (beside `world_app_tests.cpp:586`); `the_shipped_loadout_has_no_flashlight` (beside `run_record_tests.cpp:269`). The existing tests stay unchanged.
- He sees: nothing new unless he edits `loadout.txt`. The value is that laps 2 to 4 and the run record rest on it.

**Lap 2: the beam repels (his 37 and 39; the interceptor that cut his run off, [his 64]).** Chasers inside the cone, in range and in line of sight (`Run::see`) slow and are pushed back for a short time; chasers outside it are unaffected. Frenzy (38) waits for stress.
- Files: `chase/run.h` and `.cpp` (`step` takes a beam state: on, narrow, origin, direction), `chase/dials.h` (`beam_repel_slow`, `beam_repel_s`), `game/world/world_app.cpp` (passes the state), tests in `chase/tests/rule_tests.cpp`.
- Red-first tests: `a_chaser_in_the_cone_loses_ground`; `a_chaser_outside_the_cone_is_unaffected`; `a_chaser_behind_a_wall_in_the_cone_is_unaffected`; `without_the_beam_the_chase_hash_is_unchanged`. Add a bot row: an interceptor ahead, with and without the beam.
- Conflict: `chase/` is A's lane tonight; build on A's landed L182 default, not before. His calls 5 to 7 and whether the hunter is repelled apply.

**Lap 3: timed abilities in the sim, and the first physical set.** A mutable layer over `const MoveParams p` (`sim/world.cpp:89`): passives bake into the run-start params; a timed ultimate opens a window recorded as a button bit (`kButtonUltimate1`). Gated on his call 1 and the names.
- Files: `sim/params.h` (ability params only), `sim/world.cpp` (window, cooldown), `sim/input.h`, `game/abilities.cpp` (P1, P2, P3, P6 as parameter deltas), `sim/tests/ability_tests.cpp` (new).
- Tests: `a_passive_changes_only_its_own_params`; `nimble_lifts_speed_past_the_soft_cap_for_its_window_only`; `an_ultimate_window_replays_exactly`; `the_world_is_the_same_with_and_without_abilities` (the generator sizes voids from `kBaseMove`, `gen/src/gen.h:138`, so no seed may move).

**Lap 4: Aura, then Shroud (lesser chasers).** Aura is a catch exception beside the reprieve one at `chase/run.cpp:520`; chasers keep pursuing. Shroud drops lesser chasers to `Investigate` (`chase/run.h:108`) and costs stress, so it waits on queue step 5; until then it ships with a flat cost dial. The golden light and chord are C's and E's.
- Tests: `a_chaser_at_reach_does_not_catch_during_the_aura`; `it_catches_the_tick_after_the_aura_ends`; `the_hunter_still_knows_where_you_are_under_the_shroud` (if call 4 is "lesser only").

**Lap 5: the chair's data model, before the room exists.** `game/meta/focus.h`: a level, a table of ability ids per level, upgrade tiers, the stress-rate reduction (50). Pure data, no camera.
- Tests: `an_ability_above_the_level_is_locked`; `an_upgrade_raises_only_its_own_numbers`; `sitting_lowers_the_stress_rate_and_the_upgrade_lowers_it_more`. The third-person void menu waits on queue step 7 (the bedroom hub) and on C and E for the camera rise.

## 6. Connections

| key | needs from it | gives it |
|---|---|---|
| chase_entities | beam and catch hooks (laps 2, 4); a "frenzied" state | the beam state and ability state passed each step |
| stress | frenzy for 38; the shroud's cost; the chair's rate (50) | the Recognition-modulating ability (32) |
| meta_loop | containers for the flashlight find (40); energy and cash for upgrades | the loadout file, and a run record that stores it |
| waking_room | the chair, the room, the camera rise (49) | the Focus-level table the chair reads |
| movement | levers for P1 to P6; bhop as a late perk (57); the flow tier | `kButtonUltimate*` and ability params |
| look_fear, sound | the golden aura's light and chord (26); the void beyond noclip | cues each ability must show |
| run_frame | the run record | the loadout inside it |
| world_gen | the rare outside and the void for noclip | nothing: voids come from `kBaseMove` |
| story_lore | the Gateway reveal that opens the chair (29, 49) | ability names as lore |

## 7. Where it is going

Slots and a picker (call 1); containers giving a random pick with a freeze-time frame (25); a synergy table as data, not code; trinkets and the Recognition-odds ability (32); dream flight and noclip as rare finds (29), which cross sim, gen and render (L, per `handback/p-l170-abilities-E_2026-11-12.md:69`); Over the Top, which needs chaser bodies in the controller (P5, L); the surge's lifted caps (140); per-character buffs (98); the beam's psychic fusion and its frenzy. Roblox is parked and not planned here.

## 8. Not verified

- Nothing was built or run. No test named above exists; "red first" is by construction.
- Line numbers were read at 04f3882; E's sheet was written at an older commit and some of its numbers (for example `params.h:39`) have shifted.
- Whether a fifth button bit is safe for every reader of replay files: I read `sim/replay.cpp:44,80` only, not every user.
- Megabonk and Vampire Survivors facts are from the brief's notes, not sources I opened. Not read: `handback/p-l161-look-E_2026-11-11.md`, `loop/plan_l171_movement_tech_research_2026-11-12.md`, `chase/SPEED_MODEL.md`.
- The `git ls-files` and `git grep` searches for existing ability code are word searches; a system under another name would be missed.
- Items skipped: none. Items 26, 32, 53 and 57 are covered only where they touch abilities; their trinket, currency, XP and movement-chain parts belong to meta_loop and movement.

## Verification (second reader, 2026-11-13)

Game repo re-read at 04f3882 (matches the header). Brief: `briefs/dreamzone2_the_game.md`.

- (a) [his N] quotations, items 10, 11/25, 26, 29, 32, 33, 36, 37, 38, 39, 40, 49, 50, 53, 57, 58, 65, 98, 140: ok. Every quoted phrase was found verbatim under the cited item. The 25 phrases ("abilities you start out with", "freeze time and let you choose a new ability at random", "together they make you very nimble and fast") appear under both 11 and 25 (`:144-152`, `:148-152`). The 26 loadout phrase is at `:185-186`, inside item 26. "which focus level they are one" is at `:406`, item 49, and "baserate" at `:419`, item 50; the doc cites 48-50 as a range, ok. "somersault" is spelled "summersault" in the brief; the doc does not quote it, ok.
- (a) "[his 64]" for the interceptor that cut his run off (section 5, lap 2): ok but weak. The words "cut me off" are item 35 (`:337`); item 64 (`:509-518`) is the data read that confirms it. Cite 35 and 64.
- (a) Section 1 row 40: "asks for a better thing than a generic chest": ok (`:351`).
- (b) `game/world/beam.cpp:29` `hand_lights`, `:66` `ease_focus`: ok.
- (b) `world_app.h:116` `carrying_flashlight()`; `world_settings.h:31` flashlight; `game/config/world.txt:12` default 0; `world.local.txt:1` `flashlight = 1` (file exists, untracked); `world_settings.h:38-42` focus 3 and 7 degrees: ok.
- (b) `bindings.cpp:21`: WRONG. The Focus binding is `game/bindings.cpp:105` (`set(Action::Focus, {'Q', kKeyMouse4})`); the path is `game/bindings.cpp`, not under `game/input/`. `bindings.h:28` is ok.
- (b) `sim/input.h:14-18` four button bits, `uint16_t`; `sim/replay.cpp:12` (12 bytes a tick), `:44` buttons, `:80` read: ok. Version 1 is at `:11`.
- (b) `sim/world.cpp:89` `const MoveParams p`: WRONG by one line. Line 89 is `struct World::Impl {`; `const MoveParams p;` is at `sim/world.cpp:90`. Used again in section 5 lap 3.
- (b) `game/world/run_record.h:50` params: ok. `chase/run.cpp:520` reprieve condition: ok (the comment at `:518-519` confirms it blocks the catch).
- (b) `chase/run.h:108` Investigate, `:260` Knowledge, `:281` `see`, `:179` `step(const PlayerState&)`; `sim/world.h:57-71` PlayerState has yaw and pitch: ok.
- (b) `sim/params.h:47-53` flow_* with `flow_enabled` 0: ok. `sim/world.cpp:774` dive direction from velocity: ok. `gen/src/gen.h:138` `kBaseMove`: ok. `params.h:71-86` slide and vault parameters: ok.
- (b) Tests `world_app_tests.cpp:586,619` and `run_record_tests.cpp:269`: ok (flashlight and shipped-default-0 tests).
- (b) Existence claim: no ability code. ok. `git grep` over `.cpp` and `.h` finds only `nav/tests/connect_tests.cpp:157` ("reachability"); no tracked file or branch name matches abilit, loadout or ultimate. Note: docs (`HANDOFF.md`, `docs/research/*`) match the words, none about abilities.
- (b) `game/input.cpp:69` "map Action::Focus": imprecise. Line 69 maps Dive; Focus is read as `app.input().held(Action::Focus)` in `game/world/stage.cpp:689`, which is where `ease_focus` is called. The lap 1 file list omits `game/world/stage.cpp`, which must change for "focus from the recorded button". Section 2's "`ease_focus` runs per frame" is true but unsourced to stage.cpp.
- (b) Count: 12 code citations opened; 2 WRONG (`bindings.cpp:21`, `world.cpp:89`), 1 imprecise (`input.cpp:69`).
- (c) Outside sources: none cited as [read]; section 8 states Megabonk and Vampire Survivors facts are from the brief's notes. Nothing to re-open. ok.
- (d) [read] items: room files re-opened. `p-l170-abilities-E` `:40-44`, `:57-61`, `:64-66`, `:69`, `:80-85`; `p-l171-movement-tech-E:341-351`; `p-l164-movement-E:140-175` (item 57 table at `:140`); `p-l172-chaser-kit-E:59-70`; `dreamzone3_design.md:82` and `:186`; `p-l163-design-E:32`; `queue_dreamzone3:29`; `plan_13h_run:58-85`; `briefs:1053-1067`: ok.
- (d) WRONG detail: "Overclock passes 12.4 m/s only as a cued bend" (section 3, citing `p-l171:341-351`). The table says P2 Long Stride lifts the 12.4 ceiling to 13.5 m/s as "a cued bend"; Overclock removes the 12.4 ceiling for its duration, up to the soft cap of 14 m/s (`p-l171:349`, row "all of the above, briefly"). Cued bend belongs to P2.
- (d) Section 3 "Three E sheets' P1 to P4 at `:40-44`": P5 is also on `:44` (`:40-44` holds P1-P5); minor, ok.
- (d) Nothing marked [read] is from memory; every [read] has a path:line.
- (e) Coverage of 10, 25, 26, 29, 32, 33, 36, 37, 38, 39, 40, 48, 49, 50, 53, 57, 58: all 17 addressed in section 1; the "Items skipped: none" line is correct.
- (e) Not checked: the dated claim that E's sheet line numbers (`params.h:39`) have shifted; `p-l161-look-E` was not opened (the doc says so itself).

Totals: 41 checks; 34 ok, 4 WRONG (`bindings.cpp:21`, `world.cpp:89`, the Overclock "cued bend" attribution, and the missing `stage.cpp` in lap 1's files, counted with `input.cpp:69`), 1 weak citation ([his 64] should also cite 35), 2 could not check (outside sources, none cited; the older-commit line shifts).
