# Build path: the waking room (key waking_room), 2026-11-13

Game repo `C:/Users/zackn/Downloads/dreamzone-3`, read at commit **04f3882** (main). Branches read without checkout: `origin/d673-frame` 8614983. Nothing was built or run. Marks: [read] opened and read, [code] file:line, [inferred] my reasoning, [ours] a proposal with no source. Brief = `exo_memory/briefs/dreamzone2_the_game.md`.

## 1. His words

| item (brief line) | what he asked for | short quotes |
|---|---|---|
| 3 (:14) | A room you customise, a view onto a world you cannot reach, a bed, the room's door is the run's entrance | "looks out onto a fake world you cant reach"; "your rooms door is the entrance to the game run" |
| 26 (:161) | A catch ends in a portal to bed. Closet, PC shop, treadmill and weight rack; an illicit site opens late | "rapturing portal"; "closet will change the look"; "treadmill and weight rack" |
| 31 (:253) | At max stress the safe room can be invaded; the window figure; flicker; a PC scare; a knock; the mother, never seen, with branching dialogue. An invaded start is at max stress | "invaded"; "electricity flickering"; "never seen"; "fallout new vegas" |
| 32 (:275) | The window lowers stress with a cap; stress, not insanity | "a cap how much looking out the window decreases" |
| 34 (:324) | Waking with a trinket is a first-person animation in bed | "taking the covers off" |
| 46 (:383) | A picture of the father on the desk, early dialogue with the mother | "picture of his father on the desk" |
| 48-51 (:392-421) | Room as a hamlet; the chair takes you out of body to a third-person void menu for abilities; meditating lowers stress; psychedelic beanbags | "like the forge and training room"; "baserate reduction of stress"; "funky cool psychedelic designs" |
| 68 (:539) | PC and gym upgraded part by part; time in the room raises invasion chance; later bigger rooms, other windows | "subtle pc part builder game"; "different windows looking out to different places" |
| 70 (:579) | A first-time tutorial; after the first successful run a cheque under the door; early to mid 2000s | "a random cheque comes under your door" |
| 79 (:652) | A distinct face, rarely seen | "a face for each character" |
| 98-99 (:803-840) | PC builder mini game, period prices, parody brands, a late sink | "mini game remember"; "resource sink for fun"; "simple yet comprehensive" |
| 103, 106 (:858, :879) | The Signal (a used PC); mother's night shifts, online friend, seller | "truue, 4"; "acf is good" |
| 117-118 (:957-976) | Accessories carry small buffs; shop items reroll; the chair's menu shows and locks cosmetic "enchantments" | "legendary glasses that make the dark a little more visible"; "can be gotten rid of or locked" |

**Superseded or settled** [read]:
- Item 70's payer on the cheque is superseded by item 84: the cheque names no payer (brief :697-704). Item 70's period is settled by item 103 as 2005.
- Items 68, 71, 96, 98 give the writer and operator rooms; item 101 sets them aside (brief :847). Only the kid's 2005 room is live; the 2026 desktop (items 98-99) is parked.
- Item 46's murder is superseded by item 170 (an ordinary death); item 114 makes the father's item a watch. Item 109: the kid starts in his own clothes.
- Item 52 corrects 51 (slight buffs from common up). Item 86: the base outfit has no buff. Item 117 overrides the librarian's "accessories look only".
- Item 118 moves quirk removal into the chair (`p-d668-wardrobe-E:620-629`). Item 119: one restock per night.

## 2. What exists today

- Nothing of the room. `HANDOFF.md:101-105` lists the bedroom hub under "Not started". Branch search (`git branch -a | grep -i -E "room|hub|bed|meta|cheque|profile|save|window|wake|pc|chair|gym"`) found none [code].
- **The door.** `Generator::Impl::spawn()` picks a lane cell with mass behind one wall (`gen/src/graph.cpp:223-262`); `home_door()` marks that wall (`:266-272`); `edge()` returns `EdgeKind::HomeDoor` for it within 16 cells of the origin (`gen/src/layout.cpp:728-731`); `emit.cpp:409-410` draws a closed leaf. `layout_tests.cpp:456-495` proves the spawn rule over 200 seeds. A cell is 3.0 m, a storey 3.5 m, clear height 3.2 m (`gen/src/gen.h:24-27`).
- **The run's phases.** `RunPhase { Free, Start, Running, Ended, Results }` (`game/world/world_app.h:52-58`). `make_world()` places the player at the spawn (`world_app.cpp:136-171`); `start_run()` (`:368`); `begin_run()` on the first tick (`:389`, called at `:715`); `end_run()` keeps the record (`:411-436`). The results card's Enter calls `next_seed_run()` (`:316`, `:373`), so today a run is followed by another run, not by a bed.
- **The prompt** is ImGui (`hud.cpp:311-366`); the title still says "Dreamzone 2: the world" (`main.cpp:48,102`).
- **Persistence** is `best_times.txt` only (`world_app.cpp:589`); no profile (`p-d669-sweep-E:186-189`).
- **Pieces for a hand-built room** [code]: `sim::World::add_piece(StaticPiece, origin, order)` (`sim/world.h:104`); the renderer takes `LoadedChunk{data, scene}` (`world/stream.h:84-87`); the gym is a hand-built scene (`sim/gym.h`, `game/course.h`). Whether the world stage can draw a scene that is not a streamed chunk is [inferred], not checked.
- **In flight** [read `loop/plan_13h_run_2026-11-13.md`]: no lane touches the room. `origin/d673-frame` 8614983 adds `RunEnd::Saved` and `kept_score` to the run record (C, lane 4), which the cheque needs.

## 3. What the room already knows

- **Size of the gap.** E ranks "nothing carries between runs" third, XL, and says rank 1 (the run's frame) should land first (`p-d669-sweep-E:58-64, 238-291`). `queue_dreamzone3_2026-11-12.md:28` puts the bedroom hub inside step 7, after the stress and bodies steps.
- **Design sort.** `briefs/dreamzone3_design.md:186-213`: the room's decided lines and GAPs; `:105` the PC-against-chair contradiction; `:212` whether the room is a full 3D space.
- **The room's events.** `p-d667-story-E_2026-11-11.md:90-101` tabulates note, knock, cheque, chat, forum, program, invasions, chair; `:103-109` the mother's arc; `:360-363` the room's objects (father's photo, empty guitar stand). All E's proposals, not his.
- **The shop.** Rolls by price tier, once per night, hashed from (save seed, restock index, item id) so a replay is the same (`p-d668-wardrobe:559-576`); buff catalogue per slot (`:578-612`); movement buffs capped under +10 % per parameter (`:610`). Chair quirk costs "lock 40, remove 25" energy are E's proposal (`:624-626`). Brands are serious parodies with original marks, legal review before release (`:675-720`).
- **The hub, from outside** [read https://en.wikipedia.org/wiki/Darkest_Dungeon, summary only]: the hamlet is where stress is reduced and upgrades bought; Town Events give random rewards on return, and players can lower or turn them off. A precedent for item 31's random visits and an off switch [inferred].
- **Unresearched:** staging lying down and waking in first person; fake window exteriors in a raytraced room; PC-builder minigame structure; real 2005 part prices (item 99); the hamlet's building list (Fandom returned HTTP 402).

## 4. Contradictions and calls that are his

**Q1. Where are abilities bought: PC or chair?** Item 26 says the PC; items 48-49 say the chair, and item 98 has the kid "meditating to unlock abilities" (later).
- (a) Chair only; the PC is shop, builder, cheques. Cheapest.
- (b) PC and chair: two screens to build and balance.
- (c) PC sells, chair upgrades: needs a link between them.
Default: (a) [ours]; items 48-49 are later than 26.

**Q2. Is the room a walked 3D space in first person?** The design GAP (`dreamzone3_design.md:212`). Items 3, 34, 49 imply yes.
- (a) Full room, walked: a scene, collision, the body in it. Lap 1.
- (b) A static picture with menus. Cheap; loses the bed, window and invasion beats.

**Q3. Does a lost run pay cash?** Item 69: a lost run gives crumbs of global XP; item 70: the cheque follows the first *successful* run.
- (a) No cash on a loss; risk of grind stall. (b) Crumbs of cash too. (c) Cash every run, cheque only after a win.

**Q4. Does cash arrive only by cheque?** (a) Every win posts a cheque next morning. (b) Only the first; later cash lands at once.

**Q5. What is the gym minigame (rhythm, timing, hold), and is "ancient meditation" (item 42) the chair?** Design GAP `:213`. His call.

**Q6. Does the PC build change play?** Item 68 says "better and spiffier"; item 99 says "for fun". (a) Cosmetic plus a small cash or luck buff; (b) none.

## 5. The build path

Tier: prove it. Each lap is red first, then green, then the suite. Gate every lap on `start_in_room` (a new world setting) so today's door-start and every kept run replay unchanged.

**Lap 1: the bed (what he sees: a small bedroom he walks in; lie down; the dream starts; a catch wakes him in the bed).** One builder.
- Files: new `game/world/room.h/.cpp` (a hand-built bedroom: bed, door, window card, desk block, 3 m by 3 m or two cells, from `StaticPiece`s placed far from the dream world); `world_app.h/.cpp` (new `RunPhase::Waking`; Results Enter goes to Waking; lying down calls `start_run()`); `world_settings.h` and `game/config/world.txt` (`start_in_room`); `hud.cpp` (a "lie down" prompt); `game/CMakeLists.txt:79` tests list; new `game/tests/room_tests.cpp`; a capture mode `run_capture_room` beside `run_capture_look` (`main.cpp:339`).
- Red tests first: `with_start_in_room_the_player_begins_in_the_bed_room`; `lying_down_begins_a_run_at_the_home_door`; `after_results_enter_the_player_wakes_in_bed_not_in_a_new_run`; `a_run_started_from_the_room_has_the_same_fingerprint_as_one_started_at_the_door` (this proves the room never touches the sim; `add_piece` order must not enter the run's hash); the shipped-file test at `world_app_tests.cpp:101` must be updated by name.
- Step 0, a spike: render one hand-built scene through `WorldStage` headless. If it cannot draw a non-streamed scene, fall back to a bedroom carved from the mass behind the home door (`gen/src/graph.cpp:240-244`), a generator change in every seed [inferred].

**Lap 2: the profile, the cheque, the first-night tutorial.** Needs `RunEnd::Saved` and `kept_score` from `d673-frame` landed.
- Files: new `game/profile.h/.cpp` (plain-text file beside `best_times.txt`, read and written like `textfile.h`; fields cash, energy, global XP, night count, flags); `world_app.cpp` (end of run writes); `room.cpp` (an envelope at the door when a saved run is on record); `hud.cpp` (prompts).
- Red: `a_profile_written_and_read_back_is_the_same`; `a_profile_with_a_mistake_is_reported_and_not_obeyed` (the pattern at `world_app_tests.cpp:416`); `a_saved_run_posts_one_cheque_and_a_caught_run_posts_none` (per Q3); `the_cheque_has_a_name_and_an_amount_and_no_payer`.

**Lap 3: the window, the stress clock, the mother.** Needs the stress meter (stress aspect).
- Files: `room.cpp` (a pure `room_step(state, ticks)`: window relief capped per night, a rise after 15 minutes awake, `dreamzone3_design.md:206`); `game/room_events.cpp` (the mother's notes and knock as a data table with branching flags); `sound` for the knock.
- Red: `window_relief_stops_at_its_cap`; `stress_rises_only_after_fifteen_minutes_awake`; `the_room_clock_counts_sim_ticks_not_wall_time`; `a_mother_reply_changes_the_next_visit`.

**Lap 4: the PC shop and the closet.** Needs the meta loop's item tables.
- Files: `game/meta/shop.cpp` (rolls hashed from save seed, restock index, item id), an original 2005-styled desktop in ImGui in `room.cpp`, brand data under `content/`; the closet uses the body's outfit slots.
- Red: `the_same_night_shows_the_same_stock`; `the_next_night_rerolls`; `a_bought_item_keeps_its_roll`; `an_outfit_cannot_lift_one_parameter_over_ten_percent`; `no_brand_name_or_mark_is_in_the_banned_list` (a data check against the room's list).

**Lap 5: the gym and the chair.** The chair is gated on his abilities (queue step 8) and Q1.
- Files: gym pieces; `game/meta/attributes.cpp`; the chair as a camera path in `room.cpp` (rise to third person, the room fades, the Focus table, quirk lock and remove in energy).
- Red: `training_changes_only_its_own_attribute`; `the_chair_is_locked_until_the_gateway_flag`; `a_locked_quirk_survives_a_new_one`.

**Lap 6: invasions.** An `invasion_director` as a pure state machine: input (stress at max, minutes in the room, what the player is doing), seeded by the save. Variants in cost order: knock, flicker, PC scare, the window figure (needs a body from entity_bodies).
- Red: `no_invasion_below_max_stress`; `a_player_who_turns_first_meets_the_figure_at_the_window`; `an_invaded_start_begins_at_max_stress`; `scare_off_removes_the_jumpscare_only`.

## 6. Connections

| key | needs from it | gives it |
|---|---|---|
| run_frame | `saved`, `kept_score`, the end event, the card | the bed that a run starts from and returns to |
| chase_entities | nothing | none |
| entity_bodies | a figure for the window and the PC scare | none |
| player_body | first-person body in bed, a third-person kid, the face (item 79), outfit slots | the closet, the chair camera |
| movement | the base kit the gym trains | attribute values |
| abilities | Focus table, ability list | the chair as the place they are bought |
| stress | the meter, its rise and fall rules | window, clock, chair and mother as inputs |
| meta_loop | cash, energy, XP, trinket and shop tables | the room as the place they are spent; the profile file |
| world_gen | nothing, unless the bedroom is carved behind the home door | the room's piece |
| look_fear, sound | window card, chair dissolve, knock, flicker | cue points |
| story_lore | the notes, the cheque text, the program's readme, the photo | the places they land |
| frontdoor_onboarding | the title, a menu | the first-night tutorial |
| tech_foundation | the landing train | a save format to version |

## 7. Where it is going

Room upgrades, bigger rooms and other windows (item 68); the PC builder with period parts and parody brands (items 98-99); the chat's friend and the forum (`p-d667-story-E:90-101`); psychedelic beanbags (item 51); the face on the pick screen. The writer's and operator's rooms are parked (item 101).

## 8. Not verified

- Nothing built or run. Test names are proposals. Whether the world stage can draw a hand-built scene is not checked.
- The Wikipedia fetch is a summary; hamlet building details are unread.
- The shop, cap and cost figures are E's proposals, not his. Item 32's "75 %/25 %" Darkest Dungeon split was not checked here.
- Item 171 (about real persons) is outside this aspect and was not used.
- Items skipped: none.

## Verification (second reader, 2026-11-13)

- (a) Quotes, items 3, 26, 31, 32, 34, 46, 48, 51, 68, 79, 98, 99, 103, 106, 117, 118: ok, each phrase found verbatim in the brief under that item (some wrap across two lines).
- (a) Item 49 "baserate reduction of stress": WRONG item. It is in item 50 (brief :419-420), not 49 (:403-418). The table row "48-51" covers it, but a reader will look under 49.
- (a) Item 70 "a random cheque comes under your door": ok, wraps across brief :581-582.
- (a) Item 68 "different windows looking out to different places": ok, wraps across brief :543-544. Item 106 "acf is good" ok (:881); item 103 "truue, 4" ok (:859).
- (a) Item 26 phrase "closet will change the look": ok (:179). Item 31 "never seen" ok (:270). Item 32 phrase is "a cap how much looking out the window decreases" ok (:276).
- (a) Settled/superseded notes: items 84, 101, 103 (2005), 109, 114, 117, 119, 170 and 86 all ok as stated. Item 70 itself says the period is "not yet decided"; 103 settles it by the kid buying a PC "in 2005". ok.
- (b) [code] gen/src/graph.cpp:223-272 (spawn, home_door), gen/src/layout.cpp:728-731, gen/src/emit.cpp:409-410, gen/src/gen.h:24-27, game/world/world_app.h:52-58, world_app.cpp:136/368/389/715/316/373/589/411, hud.cpp:311-366, sim/world.h:104, game/world/stream.h:84-87, game/CMakeLists.txt:79, world_app_tests.cpp:101 and :416, gen/tests/layout_tests.cpp:456-495, HANDOFF.md:101-105: ok, all show what is claimed.
- (b) main.cpp:48,102,339: ok on content, but the path is game/world/main.cpp (the doc gives bare "main.cpp"; there is no game/main.cpp). Likewise "stream.h" exists twice (nav/stream.h, world/stream.h); the doc's `world/stream.h` is right.
- (b) d673-frame 8614983: `RunEnd::Saved` is in game/world/run_record.h:38 and `kept_score()` in chase/run.h:194 on that branch; ok. Doc calls them both "the run record"; kept_score is on chase::Run, not the record struct (the record test only reads a kept_score field). Minor.
- (b) "start_in_room" does not exist anywhere (git grep empty); doc presents it as new. ok. Branch search for room-like branches: ran the same pattern, no match. ok.
- (b) E's sweep rank: WRONG for the FINAL. Doc says "nothing carries between runs" is ranked third. FINAL table (p-d669-sweep-E_2026-11-11.md:265-270) says rank 3; the draft table (:215) says rank 4. Doc's ":58-64, :238-291" span both, so third is right for the FINAL, but the doc should say FINAL. ok with that caveat.
- (b) Brief-side cites: dreamzone3_design.md:105, :186-213, :206, :212, :213 ok; queue_dreamzone3:28 step 7 ok; sweep :186-189 profile ok; story-E :90-101, :103-109, :360-363 ok on content; wardrobe-E :559-576, :610, :624-626 ok on content.
- (b) "C, lane 4 ... d673-frame": plan_13h_run_2026-11-13.md:79 is item 4 of the lane list and names d673-frame 8614983 but does not name pane C there (C is named at :63). Weak; could not confirm "C".
- (b) Claim "no lane touches the room": plan_13h has no match for room/bedroom/hub except an unrelated "square room" bot test (:16, :61). ok.
- (c) Darkest Dungeon Wikipedia, re-fetched: says facilities cure and reduce stress, upgrade stats, Town Events give random rewards, some can be turned off or made rarer in options. ok. Licence not stated in the doc (Wikipedia text is CC BY-SA; the doc did not claim a licence). The doc marks it as summary only, which is honest.
- (d) Nothing marked [read] is plainly from memory. The Darkest Dungeon row has a URL. Item 32's "75 %/25 %" is correctly marked not checked: the brief has 25% base and 75% total at :486 (item for invasions/quirks), not the window; unverified against item 32 as the doc says.
- (e) Coverage, assigned items 3, 26, 31, 32, 34, 46, 48, 49, 50, 51, 68, 70, 79, 98, 99, 103, 106, 117, 118: all addressed in table section 1 (50 only via the "48-51" row). Item 50's meditation quote is the only one filed under the wrong number. Doc says "Items skipped: none": ok.
- (e) Open Q1 says "item 98 has the kid meditating to unlock abilities (later)": ok (brief :805-806 area, "eventually meditating to unlock abilities").
- Not checked: the test names and lap file lists are proposals; that the world stage cannot/can draw a hand-built scene (doc flags it unchecked); E's cost figures beyond the cited lines.

Totals: 32 checks, 28 ok, 2 WRONG (item 49/50 quote number; bare main.cpp path), 2 weak or could not check (pane C on lane 4; kept_score location nit).
