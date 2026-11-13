# Build path: the name and the front door (key frontdoor_onboarding). Research worker, 2026-11-13

**Game repo read at** `04f3882` (main, `git log -1`). Marks: [read] opened and read; [code] file:line; [inferred] my reasoning; [ours] a proposal with no source. Nothing was built, run or modified.

## 1. His words
Four items bear on this. Few; the aspect is mostly gaps, not wishes.

| item | what he asked | verbatim |
|---|---|---|
| 28 | Difficulty is chosen up front and feeds the chase. Beating the game unlocks endless. | the frenzy "scales exponentially with the base difficulty chosen and distance or time survived"; "it can unlock endless mode" |
| 70 | A tutorial for the first playthrough; a cheque after the first successful run; a period for the look. | "a first time tutorial that goes along for the first playthrough"; "early mid 2000s aesthetic" |
| 100 | Text reads Russian at a glance and becomes English when held at screen centre. The librarian's note adds: real Russian, never fake Cyrillic, a letter morph, and an accessibility setting that shows English at once. | "all text at first glance is russian, but when the player focus middle of screen on it, it becomes english to read" |
| 132 | Chaser counts scale with difficulty and story progress; a new player must not meet brutal's full weight. | "it should scale with the base difficulty and the progression of the story"; "the first few runs will be forgiving" |

**Superseded or weakened:**
- **101** ("just one great one") sets aside the other playable characters. 70's premise "since everyone starts with the kid" and 100's operator are no longer a character's story. 101 keeps the Russian text only as the librarian's proposal (the operator's ledger as found lore); his answer to that proposal is not recorded there.
- **103** puts the kid's PC purchase in 2005, which answers 70's open period for the story. It does not say how the menus should look.
- No item of his names the game, a title screen, a menu or a settings screen. The seizure warning is not in the brief's 179 items: it is quoted only from the librarian's inventory (`loop/dreamzone3_inventory_2026-11-11.md:119`, "we could also just have a seizure warning lol"). Whether it is his own item was not found.

## 2. What exists today [code]
- **Title:** "Dreamzone 2: the world" is typed three times in `game/world/main.cpp` (:48 `kTitle`, :102 window, :356 error box) and once in `game/world/hud.cpp:322`. `launch.ps1:67,86` says "Dreamzone 2". Config headers carry it: `game/world/world_settings.cpp:62`, `game/config/world.txt:1`, `game/world/world_app.cpp:616` (best times), `game/bindings.cpp:195`. The gym has its own title, untouched here.
- **A pinned coupling:** `game/tests/world_app_tests.cpp:101` requires `game/config/world.txt` to equal `write_world_settings(WorldSettings{})` byte for byte. A header rename must regenerate that file in the same commit.
- **The only front screen** is the pause prompt, `draw_prompt` (`hud.cpp:311-369`), drawn when `mode()==Paused` and no results card (`hud.cpp:600`). It holds the title, one line of story, the four levels as keys 1-4 with the level's best time (`:328-341`), a key table, and "Click the picture or press Enter to play. Esc: quit."
- **Quit:** Esc while paused quits (`game/shell.cpp:92`), pinned by `game/tests/app_tests.cpp:96`. Losing focus pauses (`shell.cpp:85`). The shell is shared with the gym.
- **Difficulty:** four levels, `chase::kLevelCount` 4 (`chase/dials.h:98`); keys 1-4 call `set_level` (`world_app.cpp:321`, `:485`); the level is saved as `level` in `world.txt` (`world_settings.h`). Best time per level is `best_times.txt`.
- **Settings:** no player screen. The F1 overlay already edits and saves everything: world settings (`hud.cpp:520-550`, `save_world_settings` at `world_app.cpp:266`) and gym settings (`hud.cpp:555-579`, `save_settings`, `shell.h:84`). Sensitivity, invert_y, fov, fullscreen, camera_effects, body_motion, sound_volume, bed_volume, mute and render_scale all exist as fields (`game/settings.h`, `game/world/world_settings.h`). Keys are remapped only by editing `bindings.txt`.
- **Not in code:** a seizure or photosensitivity notice (grep of `.cpp .h .md` in the repo outside third_party and build: nothing); a first-run flag or any profile save (`handback/p-d669-sweep-E_2026-11-11.md:191-195`); a tutorial. The text face is `C:\Windows\Fonts\segoeui.ttf` at 17 px (`game/world/stage.cpp:229-234`); no glyph range is set, so Cyrillic in the HUD is unverified [inferred].
- **In flight:** nothing on this aspect. C's `d673-frame` (the results card, timer, overtime; `loop/plan_d673_run_frame_2026-11-11.md:33,83-90`) edits `hud.cpp` and `world_app.cpp` and is queue step 2, ahead of this aspect. The repo's branch list has only `a-d673-overtime` (d07d351, chase side, untested); `d673-frame` was not found as a branch there.

## 3. What the room knows
- The sweep ranks this aspect rank 8 (S for the title, M for menus) and onboarding rank 12 (M), both "not built"; the tutorial and bed entry "ride on the room" (items 3, 70): `handback/p-d669-sweep-E_2026-11-11.md:55`, `:71`, `:195`, `:274`, `:278`. Harm: "low for him; high for anyone else" (:196).
- The queue gates step 12 on "the game's player-facing name" and lists step 16 with no gate (`loop/queue_dreamzone3_2026-11-12.md:33,37`); the seizure warning sits in step 14 (`:35`).
- Difficulty and a new player: `handback/p-l170-scale-E_2026-11-12.md:17-24` (levels are a head start on one clock), `:58` ("The forgiving start does not exist"), `:74-80` (G1 grace minutes, G2 a count cap by runs played, G3 by chapter; E leans G2), `:115` (whether the forgiving start feels forgiving or patronising only his play can say), `:120-122` (a persistent run count lives nowhere yet).
- Photosensitivity and binaural caveats: `loop/dreamzone3_inventory_2026-11-11.md:119-125` (most effects drift; slicing and recursion are the ones to soften; the beat needs headphones; the game should claim no effect).
- **Outside, small:** [read] W3C WCAG 2.2, Understanding 2.3.1, https://www.w3.org/WAI/WCAG22/Understanding/three-flashes-or-below-threshold.html (the fetched text showed no licence): no more than three general flashes in any one second, or flashing under 0.006 steradians (about a 341 x 256 CSS pixel area); a flash is a 10 percent or greater luminance swing with the darker state under 0.80; red flashes are held to three per second. This is the budget for the later reduce-flashing setting.
- **Unread or unresearched:** how skill-movement games teach (queue backlog item 8, `librarian/2026-11-13.md:27`); menu design for horror games; review of real Russian strings; what fits "2000s" menus.

## 4. Contradictions and calls that are his
1. **The name (gates step 12).**
   - (a) Keep "Dreamzone", drop "2: the world". Cost: nearly nothing; the repo is already `dreamzone-3`.
   - (b) A new title now. Cost: every header, shortcut and exe name moves once, and the lore (the Park, the Absolute) may want the title to agree.
   - (c) A working title behind one constant, the real name later. Cost: one more rename and a second regeneration of `world.txt`.
   - [inferred] Avoid the real marks his lore cites (Gateway, Monroe): items 26 and 174 keep them ambiguous or "fictious".
2. **When the seizure warning shows.**
   - (a) Every launch. Cost: a few seconds each time; no file needed.
   - (b) First launch, then only in Settings. Cost: a per-person flag, and no profile save exists (meta_loop owns it).
   - (c) First launch and whenever a strong new effect ships. Cost: version tracking.
3. **Where difficulty is chosen.** Item 28 says "chosen"; 132 says a new player is forgiven.
   - (a) Four levels on the title screen, brutal always pickable, G2's run-count cap easing the chaser count silently. Cost: the cap must be shown or it reads as rubber-banding (`p-l170-scale-E:115`).
   - (b) Brutal locked until N runs. Cost: cuts against his own brutal runs (items 35 and 64 are brutal runs).
   - (c) The level is chosen in the waking room (bed or PC). Cost: needs the room (XL).
4. **Does the tutorial stand under 101, and where?**
   - (a) In-dream hints on the player's first slide, ladder and Park, off after the first win. Cost: M; only part of what 70 describes.
   - (b) It waits for the room (the first night, the PC). Cost: nothing ships until the room does.
   - (c) None; the door card and a Help page. Cost: his 70 is not met.
5. **The Russian text under 101.**
   - (a) Found lore only: a few signs and the ledger. Cost: a string table and a focus test.
   - (b) Every text in the game. Cost: large, and hard on first-read clarity.
   - (c) Parked. Cost: none.
   - Whichever: real Russian, reviewed; the English-at-once toggle ships with the first Russian string.

## 5. The build path
**Lap 1: the name behind one constant, a notice, and a title card he can see (S).**
- Touches `game/world/main.cpp`, `game/world/hud.cpp` (only `draw_prompt`), new `game/world/title.h`, `game/world/world_settings.cpp`, `game/config/world.txt`, `game/world/world_app.cpp:616`, `launch.ps1`, `launch.vbs`. Works under call 1(c), so the name does not block it.
- Red first, in `game/tests/world_app_tests.cpp`: (i) `the_written_headers_carry_the_games_title` (settings, best-times and run-record headers begin with `game_title()`), red until the constant exists. (ii) `a_first_launch_shows_the_photosensitivity_notice_until_it_is_accepted` on `WorldApp` state.
- The shipped-file test (:101) stays and goes red until `world.txt` is regenerated with `dz-world --print-settings`; do not edit it.
- Green: the title in one place; a first-run notice on the prompt, kept in a small `config/seen.txt` [ours] until the profile save exists.

**Lap 2: the front door as a real state (M).**
- New `game/world/front_door.{h,cpp}` and `hud_front.cpp`, a small `Screen` on `WorldApp` (Title, Settings, Paused, Playing), a one-line dispatch at `hud.cpp:600`, and `game/CMakeLists.txt`'s source list.
- Title: Play, Settings, Quit, the level picker, the best time. Esc in play opens a pause menu (Resume, Settings, Quit to title). The shared shell's Esc-twice quit stays for the gym, so `app_tests.cpp:96` is untouched.
- Red first: Enter on Title starts a run on the chosen level; Esc in play pauses and a second Esc does not quit; the level keys still work (`world_app_tests.cpp:424`); losing focus keeps the choice.
- Land after C's `d673-frame`, which also edits `hud.cpp` and `world_app.cpp`.

**Lap 3: the player settings screen (M).**
- Reuses `apply_settings`, `save_settings`, `apply_world_settings`, `save_world_settings`. Shows sensitivity, invert, FOV, fullscreen, sound volume, bed volume, mute, camera effects, body motion, render scale, and the key list.
- Red first: a change in the screen writes `gym.txt` or `world.txt`; a bad value is refused with the existing line-naming error. Rebinding keys is a second step (`bindings.cpp:97-114`).

**Lap 4: onboarding v0, in the dream (M, gated by call 4).**
- Hints keyed to the run's first events (`chase::EventKind`), shown once, replayable from a Help page in the pause menu.
- Red first: a hint fires on its event, only once per profile, and Help shows it again. Hints read the run and never steer it, so kept runs still replay [inferred].

**Lap 5: difficulty and progress (S-M, with chase_entities and meta_loop).**
- Persist a run count in the profile, pass it into the run as G2 needs (`p-l170-scale-E:120-122`), show the effective cap on the title card.
- Red first: the run count survives a restart; run 1 on brutal has fewer lesser chasers than run 7 (E's G2 numbers).

**Lap 6: accessibility with its consumers (S each).** Reduce-flashing arrives with the first strong effect (look_fear), tested against the WCAG numbers in section 3. English-at-once arrives with the first Russian string.

## 6. Connections
| key | this aspect needs | this aspect gives |
|---|---|---|
| run_frame | the won/lost result and overtime card, so "again" can return to the Title | the Title and the Esc menu |
| meta_loop | the profile save (seen flag, run count, the cheque after a first win, item 70) | the title and continue shell |
| waking_room | the room may replace the Title (items 3, 70) | a placeholder that Play and Settings already satisfy |
| chase_entities | G2 and the run count | the level picker and the shown cap |
| look_fear | consumers for reduce-flashing; dynamic FOV | the setting and the warning |
| story_lore | the name, the period, Russian strings | the text hook |
| sound | volume and mute | the sliders and the headphone note |
| tech_foundation | config files, launch scripts | one title constant, one profile file |
| movement, abilities, stress | their controls and rules to teach | hint slots |
| player_body, entity_bodies, world_gen | nothing | nothing |

## 7. Where it is going
The title becomes the bedroom: a door, a bed, the PC (items 3, 70, 103); the cheque under the door; the kid's 2005 look on menus; a chapter screen and endless mode (28); Russian-to-English text across the world; per-effect photosensitivity profiles; a Help page that replays any hint.

## 8. Not verified
- That regenerating `world.txt` is the only fix for the pinned test: I read the test, not ran it.
- `game/CMakeLists.txt` was read only to line 90; the source-list edit is inferred.
- Cyrillic coverage in the HUD font and in raytraced world text: not checked.
- WCAG was read through a fetched summary of the page, not the standard's own text. Not read: gameaccessibilityguidelines.com (the page I tried returned 404), the Xbox accessibility guidelines and a cognitive-accessibility blog (a web search returned only summaries of them). Nothing above relies on them.
- The seizure quote is not in the brief; it is the inventory's.
- No game was run; the lap order against C's landing is a reading of the plan, not of merge state.
- Items skipped: none. Item 28's stress, frenzy and ending text belongs to other aspects; only "base difficulty chosen" and the endless unlock are used here.

## Verification (second reader, 2026-11-13)
- (a) [his 28] "scales exponentially with the base difficulty chosen and distance or time survived" and "it can unlock endless mode": ok (brief lines 205-222; the first quote spans a line wrap).
- (a) [his 70] "a first time tutorial that goes along for the first playthrough", "early mid 2000s aesthetic", "since everyone starts with the kid": ok (brief lines 579-584).
- (a) [his 100] "all text at first glance is russian, but when the player focus middle of screen on it, it becomes english to read": ok (brief line 841-842, wrapped). The "real Russian, never fake Cyrillic, morph, accessibility" part is correctly attributed to the librarian's notes (lines 843-846).
- (a) [his 132] "it should scale with the base difficulty and the progression of the story" and "the first few runs will be forgiving": ok (brief lines 1036-1038).
- (a) [his 101] "just one great one": ok (brief 847-848, wrapped). [his 103] 2005 PC purchase: ok (brief 858-860). [his 174] "fictious": ok (brief 1176). [his 26] "ambiguous": could not check (no "ambig" in the item 26 line; the claim is paraphrase, not a quote).
- (b) [code] main.cpp:48,102,356; hud.cpp:322, :600; world_app.cpp:321, :485, :616, :266; world_settings.cpp:62; world_app_tests.cpp:101, :424; shell.cpp:85, :92; app_tests.cpp:96; chase/dials.h:98 (repo-root chase/, not game/chase/); stage.cpp:229-234; hud.cpp:311-341 and :520, :555; shell.h:84; launch.ps1:67,86; bindings.cpp:195; settings/world_settings fields: all ok.
- (b) Seizure notice absent from the code (grep outside third_party/build): ok. Seizure quote absent from the brief: ok; but note `loop/dreamzone3_inventory_2026-11-11.md:119` attributes it to him ("his, 03:3x"), so "whether it is his own item was not found" slightly understates the inventory.
- (b) WRONG: section 2 "d673-frame was not found as a branch there" and "the branch list has only a-d673-overtime". `git branch -a` in the game repo lists remotes/origin/d673-frame (tip 8614983), also origin/d673-chase and d673-chase-wip; the local branch list also holds many l161/l162/l170 branches. Lap 2's ordering against C's landing can therefore be checked against that branch (it exists and edits hud.cpp, read via git show origin/d673-frame:game/world/hud.cpp).
- (b) Repo commit: `git log -1` gives 04f3882, ok.
- (c) WCAG 2.2 Understanding 2.3.1, re-fetched: thresholds ok (three flashes per second, 0.006 sr, 341 x 256 CSS px, 10 percent luminance with darker state below 0.80, red flash held to three). WRONG on terms: the document says the text showed no licence; the page shows "Copyright 2026 World Wide Web Consortium", with W3C permissive-licence and "Permission to Use WAI Material" links. Also the area limit is an alternative to the temporal limit (either passes), and red flash is defined by R/(R+G+B) at or above 0.8; the document's "red flashes are held to three per second" is correct but thin.
- (c) Other outside sources: none relied on ([read] only WCAG); the "Not read" list is honest. ok.
- (c) Room citations (queue :33,35,37; sweep :55,71,195-196,274,278; p-l170-scale-E :17-24,58,74-80,115,120-122; inventory :119): ok. `librarian/2026-11-13.md:27` exists; the item-8 line was seen, ok.
- (d) Nothing marked [read] is from memory; the one outside [read] has a URL. ok.
- (e) Coverage: 28, 70, 100, 132 all addressed in section 1 and the build path; "Items skipped: none" is true.
Totals: checked 31, ok 28, WRONG 2 (d673-frame branch claim; WCAG licence statement), could not check 1 (item 26 "ambiguous").
