# Build path: story and lore (key story_lore), 2026-11-13

Game repo read at commit 04f3882 (main), checked out, nothing built or run. Marks: [read] I opened it (room files as path:line); [code] game-repo file:line; [inferred] my reasoning; [ours] a proposal with no source. His words are [his N], from `briefs/dreamzone2_the_game.md`. This is the story bible's path into code; the design is the deliverable, and the code is a thin seam under it.

## 1. His words

| items | what he asked for |
|---|---|
| 23-26 | "subtle lore of the world" with an easter egg [his 23]; the paper's in-between and the Absolute [his 24]; "the lore should be ambigious at first" [his 25]; not tied to Gateway "until the player plays the story out through many runs", rare encounters in sequence, "designed areas with meaning" in seeds, psyche biomes, a rare outside [his 26] |
| 28, 30 | "the good god entity saves you last second" [his 28]; death shows it was "playing with its food", you wake "not knowing which part was taken" [his 30]; chapters; beating the game "can unlock endless mode" [his 28] |
| 43-45 | Real dread; "biology is just a temporary phase of geometry" [his 43]; "Repeating a purpose no one remembers" [his 44]; his "struggle to believe and have faith in something good" [his 45] |
| 46, 47 | A trauma never said, only anecdotes: photo on the desk, mom's dialogue, curated pieces [his 46]; lore trinkets with meaning, "Dads watch"; the god may be love for the father or him "in a way" [his 47] |
| 68, 70-72 | Several characters with intertwined stories [his 68]; the first cheque with no explanation [his 70]; the writer [his 71]; game feel first, "Worry about the narrative after" [his 72] |
| 74, 84, 85 | Each psyche its own biomes [his 74]; real things may be referenced, the cheque names no payer [his 84]; life paths and intertwining [his 85] |
| 95-98, 100 | The Park [his 95]; a KGB operator [his 96]; "time is non linear there" [his 97]; rooms [his 98]; text that "becomes english to read" on focus [his 100] |
| 101-110 | "what if we make just one great one?" [his 101]; The Signal, "truue, 4" [his 103]; agency findings as found lore [his 104]; the Absolute; the darkness maybe "the players self" [his 105, 107]; "acf is good" [his 106]; father's death kept [his 108]; "they are good for now" [his 110] |
| 113, 114, 123 | Unique lore legendaries [his 113]; the father's watch, not a hoodie [his 114]; bomber jacket and sunglasses too [his 123] |
| 168, 170-172, 174 | Every entity humanoid with its own uncanniness, also a psyche manifestation [his 168]; the murder is "melodramatic", an ordinary young death whose grief "never makes sense" [his 170]; grief as a "gateway to naturally awakening an attunement" [his 171]; love must "shine through the horror of life" [his 172]; "the game should be on the surface not that deep" [his 174] |

**Superseded:** 46's murder by 170; the whole multi-character cast (68, 71, 96-98) by 101 (set aside as traces, not deleted); 108's hoodie by 109 then 114 (the watch); 26's "never tie Gateway" is in tension with 103 (see section 4).

## 2. What exists today

- Nothing of story in code. `HANDOFF.md:143`: "nothing is kept between runs"; `HANDOFF.md:103` lists the run's frame (M5) as unstarted [code]. A search for story, lore, chapter and cheque in `game/ chase/ gen/ world/ sim/ content/` finds no hits [code].
- A run starts at a closed bedroom door in a corridor and ends at a catch or a void, with a results card (`game/world/hud.cpp:6`, `:598`) [code].
- The only persisted file is `best_times.txt`, read and written with `for_each_pair` and `write_text_file` (`game/world/world_app.cpp:588-615`, `game/textfile.h:26-45`, `:48`). A profile file copies it [code].
- `RunResult` (`game/world/world_app.h:64-76`) has `counted`, `best`, no "won". Main's `chase/run.h` has no `saved()` or `run_length_s` (zero hits) [code].
- The hospital biome is defined (`gen/src/gen.h:244-252`, `gen/src/biome.cpp:146-152`); `GenParams` has no `chapter` or biome `depth` field (no hits in `gen/src/gen.h`) [code].
- `docs/BIOMES.md:238` says the hospital's end door "is never opened in any run". That contradicts his 114 (below) [code].
- No prop or designed-piece type in `gen.h`; chasers are boxes (`game/world/figures.h:1`) [code].
- **In flight:** `origin/d673-frame` 8614983 and `origin/d673-chase` db8e557 carry `Run::saved()` and `kept_score()` (`chase/run.h:122-194` on that branch). `a-d673-overtime` d07d351 and `origin/d673-chase-wip` fc8206d are untested WIP. The generator scout's authored-pieces stage A (`loop/procgen_scout_03_authored_pieces_assembled_2026-11-13.md:42`) is a plan, not code [read].

## 3. What the room already knows

- **The bible:** `handback/p-d667-story-E_2026-11-11.md` is the working bible. Premise `:22-31`; chapters and Focus levels `:67-88`; the room's events `:90-101`; the three people `:103-123`; the owner (Elias Wren, invented) `:125-142`; found objects `:144-155`; four endings `:157-174`; the twist's reveal table `:258-274` (PLANT, TURN, LANDS); the father's death woven in `:344-396`; the watch `:432-456`. [read]
- **Documented ground:** the memo's words (the Absolute ¶18, click out ¶19-20, Focus 10/12/15/21 ¶30, ¶38 J) and what is not in it ("no time", the Park, Belief System Territories are later Monroe usage): `handback/p-l161-look-E_2026-11-11.md:62-120`. [read]
- **Real-world limits:** never claim the tapes work (`handback/p-d661-lore-E_2026-11-11.md:28-29`, `:53`); no invented act given to a real person or agency (`:13-16`). [read]
- **Delivery craft:** suggestion over explanation, artifacts not exposition, an official account the player can doubt, each encounter adds a question, no numbered places, an empty outside (`handback/p-l161-backrooms-E_2026-11-11.md:61-88`). [read]
- **Operator ledger as found lore:** `handback/p-d661-operator-E_2026-11-11.md:99-132`. [read]
- **Legendary tables:** `handback/p-d668-wardrobe-E_2026-11-11.md:527-557` (Wren's glasses, the watch "Still running", guitar pick, F21 sleeve). Written before item 123, so the bomber and sunglasses are not in them. [read]
- **Biome rule:** the loss held by absence; one designed piece each; chapters lower a `reach` (`docs/BIOMES.md:44-61`, `:282-298`). [code]
- **Unresearched:** the grief literature (170 says read the chapter before use); the Jenkins essay; Monroe's books; page 25 (`p-d667:55`); legible text-on-focus design; beat pacing per hour of play.

## 4. Contradictions and calls that are his

| # | question | options and cost |
|---|---|---|
| 1 | **How does the father die?** 170 removes the murder; D667's weave (`p-d667:348`) still says "Sudden. Unsolved" | (a) long illness: fits the mother's hospital nights; heavier. (b) sudden and ordinary: fits "never makes sense". (c) never stated, only marks: cheapest. All three delete "unsolved" |
| 2 | **Does the hospital door open?** `docs/BIOMES.md:238` "never opened"; his 114 puts the watch behind it | (a) it opens in chapter 4 after N Recognitions (D667 proposes 3); (b) it never opens and the watch is found elsewhere. (a) needs the stress aspect's Recognition count |
| 3 | **Gateway: when is it named?** 26 says do not tie it until many runs; 103 puts Gateway rips on the PC from night one | (a) the rips exist from run 1, unexplained; names appear from chapter 2 (matches D667's PLANT beats); (b) nothing Gateway-named before chapter 2 (cheaper) |
| 4 | **Real names on screen.** 84 allows real references | (a) only inside found documents (the memo, quoted); (b) the institute also named in the world; (c) invented names throughout. Legal risk not assessed |
| 5 | **The dark one's name** is open (110); the bible plans five source names and a last-folder landing | Keep it unnamed in player text until chapter 5 (no call needed until the reveal lap), or pick from Echo, Hollow, Remainder, Undertow now |
| 6 | **How "understanding" is measured** (26, `briefs/dreamzone3_design.md:278`) and N for chapter gates | wins only (simplest); wins plus Recognitions; wins plus beats seen |
| 7 | **Lore for each lesser entity** (design GAP) against the Backrooms finding to avoid a page per entity | (a) one line per kind in the dream's own terms (168's uncanniness) shown only as ledger text; (b) none, they stay unexplained |

Also: the brief's note on item 97 calls Focus 15 "no time" documented ground; it is Monroe usage, not the 1983 memo (`p-l161-look-E:88`). Fiction may use it; it must not be quoted as the memo's.

## 5. The build path

Order follows his word: feel first, then the kid's arc (72, 122); queue step 15 (`loop/queue_dreamzone3_2026-11-12.md:36`) is late, so lap 1 needs no other aspect first. All numbers [ours].

**Lap 0 (E, docs only, before any code): reconcile the bible.** Files: `briefs/dreamzone3_story_bible.md` (new, in lighthouse because it quotes him). One table of beats: id, chapter, kind (PLANT, TURN, LANDS, found object, room event), trigger, text, item cited, mark. Apply 170 and 123, and calls 1-3 once answered. A small script fails if a beat lacks an item or a mark. No game test.

**Lap 1 (the smallest step he could play): the first rare find, and the profile it rests on.** What he sees: with `story_demo 1` in `world.local.txt`, a run's corridor holds a note on a wall. Look at it for about 1.5 s and its letters morph from a blur into a line (placeholder from `p-d667:220`: "Don't stay in the Park past ten. It forgets it was safe."). The next run shows the next beat; a fresh profile starts at beat 1.
- New `story/` library: `beats.h/.cpp` (table, first six beats from `p-d667:76`, `:219-220`, `:307`); `profile.h/.cpp` (runs, wins, recognitions, beats seen; `name = value` text via `for_each_pair` and `write_text_file`); `focus_reader.h/.cpp` (pure: view angle, distance, dwell in, 0 to 1 reveal out; an `instant` flag for accessibility, item 100's note); `CMakeLists.txt`; `tests/story_tests.cpp`.
- Wiring: `game/world/world_settings.h` (`story_demo`), `world_app.cpp/.h` (load the profile beside `load_best`, pick the beat at run start), `stage.cpp` (one lit box near the first corridor cell from `spawn()`), `hud.cpp` (the revealed text), `game/config/world.txt`, `game/CMakeLists.txt`.
- Placement is a pure function of (seed, profile), never a clock; with `story_demo 0` nothing moves.
- Red first, green after (all in `story/tests/story_tests.cpp` unless named):
  1. `a_fresh_profile_is_due_beat_one` (red: no table).
  2. `a_seen_beat_is_never_due_again_and_the_chain_advances`.
  3. `a_beat_whose_prerequisite_is_unmet_is_never_due`.
  4. `a_profile_written_and_read_back_is_the_same` and `a_profile_with_a_mistake_names_the_line_and_changes_nothing` (copy of `world_app_tests.cpp:416`'s shape).
  5. `the_reveal_needs_the_gaze_held_and_never_runs_backward_in_distance`; `instant_shows_the_line_at_once`.
  6. `placement_is_the_same_for_the_same_seed_and_profile`.
  7. In `game/tests/world_app_tests.cpp`: `with_story_demo_off_a_run_keeps_the_golden_fingerprint` (a guard, green before and after).
- Hand-back: one still of the note and one clip of the reveal.

**Lap 2: the cheque and the card.** Waits on `d673-frame` landing (the won-run flag). Files: `story/beats.cpp`, `game/world/hud.cpp:118`, `world_app.cpp`. After a saved run the card shows his name, the run's cash, no payer, a scrawl that never resolves [his 70, 84]. Tests: `a_cheque_follows_a_saved_run_and_never_a_lost_one`; `the_cheque_names_no_payer`; `the_amount_is_the_run_cash`.

**Lap 3: found pages and redaction.** Real memo paragraphs, numbered, page 25 never (`p-d667:148-150`); redaction bars and Russian-to-English text reuse lap 1's reader [his 100, 104]. Files: `story/pages.*`, the beats table. Tests: `every_russian_string_carries_its_english_twin`; `page_25_is_never_due`. Real Russian needs a checked translation first [inferred].

**Lap 4: chapters.** Needs the generator scouts' `chapter` and `depth` fields and authored-pieces stage A. Files: `story/chapter.*` (a pure function of the profile), `gen/src/gen.h`, `biome.cpp`, `gen/tests/`. Tests: `chapter_one_moves_no_seed`; `the_same_seed_and_chapter_give_the_same_world`; `a_later_chapter_brings_the_hospital_nearer` (`docs/BIOMES.md:282-298`).

**Lap 5: the hospital piece, the door, the father's items.** Files: the waiting-room piece in the pieces table, `story/beats.cpp`. Door open only in chapter 4 with Recognitions at least N (call 6); the watch granted on waking, plus the bomber and sunglasses (123). Tests: `the_door_is_shut_below_the_recognition_count`; `a_father_item_is_granted_once_and_is_unique_per_profile` [his 113]. Needs stress and meta_loop.

**Lap 6: the landing and the endings.** The chapter 5 camera turn, the last folder, endings from the profile (Recognitions above all, `p-d667:298-302`). Files: `story/endings.*`, `hud.cpp`, the dark one's model. Tests: `no_recognitions_allows_only_sell_or_destroy`; `many_recognitions_allow_rescue`.

## 6. Connections

| key | story_lore needs | story_lore gives |
|---|---|---|
| run_frame | `saved()`, `kept_score`, the won-run flag, the timer | the cheque and card text; the frame where reveals land |
| stress | the Recognition count; recognition as "meeting the darkness" | the meaning of Recognition [his 62] |
| meta_loop | a profile file shared with kept points; trinket grants; the wake | the beat and chapter state; the legendary list |
| waking_room | the bed, desk, PC, fridge | the notes, the photo, the forum, the chat, the knock |
| world_gen | authored pieces, `chapter` and `depth`, a lore-site hook | the designed pieces' content and the chapter ladder |
| chase_entities, entity_bodies | the hunter as his own outline; the dark one's model; mirrored idle pose | humanoid-with-uncanniness lines per kind [his 168] |
| look_fear, sound | the golden aura, the click out, found-text morph | cue points: reveal, rescue, mother's knock |
| frontdoor_onboarding | the first-run tutorial [his 70] | the premise lines for the title |
| abilities | the chair's Focus levels | none |
| movement, player_body, tech_foundation | none found | none |

## 7. Where it is going

Endless mode after any ending [his 28]; the set-aside characters as traces in the kid's story (the ledger, the writer's book) [his 101], later perhaps as playable with their own biome sets [his 74]; deep lore for those who dig [his 174]; each lesser entity's uncanniness [his 168]; grief research in the mother's notes once read [his 170].

## 8. Not verified

- Nothing built, run or timed. Test names are proposals; lap 1 test 7 is a guard, not a red test.
- The lit-box note and HUD text for lap 1 are [inferred] from how figures are uploaded (`figures.h`); the renderer was not read for a static prop slot.
- The memo's release date and page 25 come from search summaries (`p-d667:222-225`). Grief research and the Jenkins essay were not read. D667's proposals stand only "for now" (his 110).
- The memo's public-domain status and the game's use of real names were not checked; call 4 is his.
- Items skipped: none. Touched lightly (other aspects own them): 28, 30, 68's room and level parts, 74, 123, 168.

## Verification (second reader, 2026-11-13)

- (a) his-word quotes, 25 phrases grepped in `briefs/dreamzone2_the_game.md`: ok for 23, 24-26, 28, 30, 43-45, 47, 72, 97, 100, 101, 103, 106, 107, 110, 170-172, 174, all verbatim and under the cited item (some wrap across lines; found on the flattened text). The "Dads watch" quote is at :389 under item 47. "the players self" is at :888, which is item 107; the table cites 105 and 107 together, ok.
- (a) item 70/84 cheque: item 70 as he wrote it says the cheque has "something called The Monroe Institute" on it; item 84 ("just make the cheque not say who its from") overrides it. The document cites [his 70, 84] for "no payer" without saying that 84 reverses part of 70. Not wrong, but a builder reading 70 alone gets the opposite. Lap 2 should cite 84 as the controlling item.
- (b) [code] HANDOFF.md:143 "nothing is kept between runs": ok. HANDOFF.md:103 M5 line: ok.
- (b) `docs/BIOMES.md:238` "It is never opened in any run": ok, it is the hospital's waiting-room piece; contradiction with item 114 (watch "behind the hospital door") is real.
- (b) `game/textfile.h:26-45` (`for_each_pair`) and `:48` (`write_text_file` area): ok. `game/world/world_app.cpp:588-615` load_best/save_best pair: ok.
- (b) `game/world/world_app.h:64-76` RunResult has `counted`, `best`, no won flag: ok.
- (b) `gen/src/gen.h:244-252` biome ids with hospital last: ok. `gen/src/biome.cpp:146-152` hospital defined: ok. No `chapter`/`depth` in `gen.h`: ok (grep empty).
- (b) `game/world/figures.h:1` chasers are boxes: ok. `hud.cpp:6`, `:598` (results card), `:118` (survived/points text): ok. `world_app_tests.cpp:416` best-times-with-a-mistake test: ok.
- (b) "no hits for story, lore, chapter, cheque" in game dirs: ok in substance; a raw case-insensitive grep matches only "TextColored" (contains "lore") in `game/world/hud.cpp` and `game/gym/hud.cpp`, no story code.
- (b) `chase/run.h` on main has no `saved()` or `run_length_s`: ok (zero hits). On `origin/d673-chase`, `saved()` at `:193` and `kept_score()` at `:194` exist (range `:122-194` ok).
- (b) Repo commit `04f3882` on main: ok. `origin/d673-frame` 8614983, `origin/d673-chase` db8e557, `origin/d673-chase-wip` fc8206d: ok.
- (b) WRONG: "`a-d673-overtime` d07d351" is stale. Tip of `a-d673-overtime` (local and origin) is 9671a90; d07d351 is its second-newest commit. Read via `git log -3 a-d673-overtime`. Whether 9671a90 is still untested WIP was not checked.
- (b) `docs/BIOMES.md:44-61` and `:282-298` cited for "the loss held by absence; one designed piece each; chapters lower a `reach`": the `reach` and per-biome `depth` rule is at `:284-290` (ok). `:44-61` is the section 2 psyche rule, ok as far as read.
- (b) `loop/queue_dreamzone3_2026-11-12.md:36` step 15 "The story ... waiting": ok.
- (c) outside [read] sources: the document cites none; all [read] marks are room files. Nothing to re-open.
- (d) room-file [read] citations: `p-d667-story-E` section line ranges (:22, :67, :90, :103, :125, :144, :157, :258, :344-396, :432-456), `:348` "Sudden. Unsolved", `:55` page 25, `:76`, `:148-150`, `:219-220` placeholder, `:307`, `:127` Elias Wren invented: ok. `p-l161-look-E:62`, `:88`, `:120`, `p-d661-lore-E:13`, `:28`, `:53`, `p-l161-backrooms-E:61-88`, `p-d661-operator-E:99-132`, `p-d668-wardrobe-E:527-557`, `briefs/dreamzone3_design.md:278`, `p-d667:298-302` (ending 4 "how often he reached Recognition"): ok. Minor: "memo release date and page 25 ... `p-d667:222-225`" points at the NOT verified header; page 25 itself is at `:55`.
- (d) Nothing marked [read] looks like it came from memory; the memo date is honestly labelled as from search summaries. Lap 1 placeholder line is correctly marked as D667's.
- (e) coverage of 23, 24, 25, 26, 28, 30, 43-47, 68, 70-72, 74, 84, 85, 95-98, 100-110, 113, 114, 123, 168, 170-172, 174: all addressed or named in section 1; 102 is covered only by the "101-110" row with no own content (the kid's story pick is implied, not stated). 171 and 172 appear. None skipped without being named; "Items skipped: none" is accurate.
- Totals: 38 checks, 36 ok, 1 WRONG (stale a-d673-overtime commit), 1 caveat (item 70 vs 84), 0 could not check; `chase/run.h:122` exact line content not matched to a specific claim.
