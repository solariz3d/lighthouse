# Build path: the chasers and the good entities (key chase_entities), 2026-11-13

Game repo read at main `04f3882` [read]; other branches read with `git show`. Marks: [read] opened and read; [code] file:line at 04f3882; [computed] my arithmetic from code; [inferred] mine; [ours] a proposal. Items are [his N] from `briefs/dreamzone2_the_game.md`.

## 1. His words

| item | what he asked |
|---|---|
| 1, 3, 7 | An "exceedingly fast entity" you can still out-maneuver; several chase archetypes with aggro levels; difficulty climbs by "more aggressive ai or chase archetypes"; on a dead end "the entity has to route around". |
| 8 | A reprieve: "a short transient period of safety" (the Park). |
| 17, 18 | Chasers "OP but not like speed hacking"; speed and intelligence scale with distance and difficulty; "momentum and inertia", no turning "on a dime"; "perhaps the interceptor is more nimble"; long straights raise top speed and turning scrubs it. |
| 25, 34 | Good entities: a holy aura, a physical one that "tanks agro for you for a short time", trinket givers that arrive "freezing the entities in the world". |
| 26, 107 | Sound quiets near a good one. The Absolute is the creator; the darkness might "always" have been the player's self. |
| 28, 30 | "10% sounds good for the start"; insanity makes entities "fixate on fear"; the end god is "cheating", safe zones only reroute it; the evil god is "playing with its food". |
| 37, 39, 61 | Flashlight plus psychic power repels the interceptor and future ahead-spawners; frenzy continues during Resonant. |
| 35, 64, 91 | Runs ended by being "cut off" from the front; for most of a 450 s run he could not see how the hunter "is keeping up". |
| 65 | "the main hunter always knows where you are." No stealth. |
| 81 | Peak sprint toward 10 m/s, and "slightly make all mobs quicker too to compensate". |
| 88, 129, 130 | Pursuit that is not a machine lock-on; Left 4 Dead's inertia; the look-behind must show them "slosh around corners". |
| 92 | Lesser ones "slowly move toward the sound until it sees you" and "scare you more than trying to catch you at first"; the hunter excepted. |
| 127, 128, 131 | Study known games, They Are Billions, Arc Raiders (checked in the brief: learned locomotion only, tactics are behaviour trees). |
| 132 | Count "should scale with the base difficulty and the progression of the story"; "first few runs will be forgiving". |
| 141, 142 | "every mob gets their own unique ability or passive to level the field"; kit R1 in two waves: "okay we can try it". |
| 146, 151, 155, 157 | Hunter lean and sway: lean into the turn, "Keep source, fix sway". These belong to entity_bodies; here only the chase's sway and velocity versus heading. |
| 164 | It turns "way too fast keeping speed" and snags on doorways. |
| 166, 168, 169 | Animal locomotion data; the hunter corners by the hunting-animal law (H2) in a humanoid body; hunter T1, sprinter T3, pack T4, interceptor T2, stalker T2, charger T3, climber T4. |
| 178 | Wall to wall in a square room beats them; mirror the line when behind, predict and cut off otherwise; arcs, not sharp turns. |

Supersessions: 81's "7 m/s" reference is stale (`chase/speed.h:22` is 8.0). 141 reverses the premise of 18's "player slightly faster". 157 resets the librarian's 120 deg/s cap. 178 replaces the corner-floor lever (A found it does not land). 92's "scare first" is for lesser kinds only; 65 exempts the hunter. 28's "safe zones don't save you" applies to the end god only; 8 stands for the rest.

## 2. What exists today

- [code] Seven kinds (`chase/archetype.h:14-23`). Built: hunter, sprinter, interceptor, pack, crawler. Charger and stalker are rows only (`archetype.cpp:112-135`); `run.cpp` never names them [grep, no hits].
- [code] Speed = `ref_speed` 8 x row x dial x distance gain x run-up (`speed.h:21-39`). Rows: sprinter 1.45, interceptor 0.90, pack 0.92, crawler 0.80 (`archetype.cpp:36,62,90,145`). Hunter dial 0.95 +0.04/min to 1.5, plus a 0.17 start bonus fading over 600 s (`dials.h:23`, `speed.h:33`).
- [code] Counts: `lesser_max` 1 +0.5/min to 8, spawn every 24 s -1.5/min (`dials.h:39-40`); mix draw `:47-49`; cap read at `run.cpp:1125,1173`; placement out of sight, behind or ahead by role (`run.cpp:1084,1133`). Nothing reads runs played or chapter (E, `p-l170-scale-E:74`).
- [code] Hearing is straight-line range, halved through geometry (`run.cpp:966-972`). No hear-then-investigate arc, no phases.
- [code] Levers `corner_floor_speed`, `slip_rate`, `lead_range` exist, default 0 (`speed.h:36-38`). The turning law, feelers, line clearance and hawk law are NOT on main.
- [read] The run record stores dials, move params and world settings, no chase `SpeedModel` (`game/world/run_record.h:34-54`; no `SpeedModel` hit in `run_record.cpp`). A new chase default therefore changes old replays unless the record gains a field.
- [code] No `run_length_s`, `Kind::Dark` or good entity on main (grep, no hits).
- [computed] Player peak is now 10.0 (`sim/params.h:38`). Hunter over player peak on the flat: 0.90 at 0 s, 0.91 at 30 s, 0.99 at 300 s (ref 8, bonus faded); with full run-up the hunter's top at 0 s is 10.75. E's L172 table used 8.75 and is stale there.

Branches in flight [read via git]: `l182-lines` c357bbd (dials off by default; a1, a2, a3 scored, a4 block 1 done, a5 to a8 unrun); `l182-hawk` d0751af (hawk law and `chase/room.h` exploit search, not compiled); `origin/d673-chase-wip` fc8206d (overtime chase, untested); `l192-footsteps` b61ce52 (red). `l170-chase` is merged.

## 3. What the room already knows

- Top speed is not the problem. In his brutal run the hunter closed 882 m on straights and gave back 858 m at corners; 21 sprinters pursued 6 s in all (`handback/p-d665-chase-data-A_2026-11-11.md` table and reading; `p-l172-chaser-kit-E_2026-11-12.md:13`).
- Every L170 lever failed its catch bar in both 150-seed blocks; P1 (lead) came closest (flee never-caught 54.0 and 57.3 % against 62.7 and 60.0 %). All guards held (`p-l170-chase-A_2026-11-12.md:7-12`).
- The lawful turn (Chang & Kram Eqn 5) halves wall hits (a1 x0.38, a2 x0.45) and costs catch (+15 to +18 points never-caught); feelers alone halve wall hits at no catch cost (`p-l182-lines-A_2026-11-12.md:29-55`). The control exceeds the law over 27 % of a corner (`p-l170-chase-A:47`).
- Hawk mixed law (N 0.7, K 1.2/s) and the exploit-search family, registered with bars and falsifiers before any run (`l182-hawk:chase/SPEED_MODEL.md:501-590`).
- D666 arc: hearing along the walk graph, hear, alert, investigate, decide; scare moves per kind; phases Toying 0 s, Testing 150 s, Hunting 360 s; bars R1 to R8 (`p-d666-entities-E_2026-11-11.md:39,84,110,136`).
- Counts: options G1 to G3 and M1 to M3 with a table; his 142 rules G2 + M3 (`p-l170-scale-E_2026-11-12.md:74-120`; `loop/queue_dreamzone3_2026-11-12.md` step 4).
- Kit R1: Appetite, Lunge, Mirror, Call, Through, Unseen, Charge, with registrable bar pairs (`p-l172-chaser-kit-E:47,87`).
- L4D's brutality is placement and timing (75 % from behind, out of sight, in groups); its pathing is cheap A* plus look-ahead (`p-l169-games-E_2026-11-12.md:12-23`). Valve's NextBot code is idea only, by licence (`p-l169-code-A_2026-11-12.md:21`).
- H2 law `min(V_o, sqrt(mu g R))`, mu a dial; Usherwood and Wilson's radius and Wilson 2013's figures unread (`p-l187-animal-locomotion-E:193-254`).
- Lesser-entity hearing on the walk graph (`p-d654-audio-C_2026-11-11.md:89-125`).

Unresearched or unread: any source for good-entity behaviour (aggro tanking, a freeze, an aura); the stalker's view test; the Arc Raiders talk (press only); the flow-field chapter (unreadable text, `p-l169-code-A:21`).

## 4. Contradictions and calls that are his

1. **Lawful turns against catch power.** [his 164] and [his 178] pull opposite ways: the law cuts snagging but a1 and a2 lose 15 to 18 points of catch. (a) Accept it and win catch back with counts and the kit; cheapest, a softer solo hunter. (b) Hunter mu above 1 ("monstrous"); the 1.33 figure is unverified press. (c) Raise hunter dials; fights [his 141].
2. **Through (a wall pass) against [his 17] and [his 7].** It is a designed break of "without clipping" and "route around". (a) Keep it, with a slice tell. (b) A ledge-only link, no wall. (c) Drop it; costs the safe-corner answer.
3. **Hunter omniscient [his 65] against Shroud and Lure.** (a) Hunter ignores both; only lesser kinds fall for them. (b) Shroud costs stress only. (c) Hunter loses track briefly, which contradicts 65.
4. **Good entities.** Can they fail or be late, and how often? (a) Never fail; rare and scripted. (b) They can be caught, so the player risks them. Also a chase `Kind`, or a separate system? Separate keeps old kind numbers and hashes stable [inferred].
5. **Climb for every kind** (L4D's hull trace) against [his 7]. (a) Per kind: crawler and pack only. (b) All; ends the ledge escape.
6. **Speed margin.** Peak 10 restores the 10 % at 30 s [computed] but only after 8 s of unbroken sprint; 141 says "too fast". (a) Hold as is. (b) Tie the hunter's dial to the player's earned surge (Appetite does this).

## 5. The build path

Every step is red first, then green. Every new field defaults to 0, so the 12-seed sweep text keeps md5 `599ab239...` [read, A's evidence] until a flip is deliberate.

**Lap 1: the new lines become the default (A, in flight).** Finish arms a4 to a8 and h1 to h5 and the exploit search (zero exploit cells, walls at most 0.7x control, flee never-caught at least 40 %), then flip. Files: `chase/speed.h` defaults, `chase/chaser.cpp` (law in `turn_rate()`, hawk), `chase/room.{h,cpp}`, `chase/tests/feel_tests.cpp`, `chase/tests/room_tests.cpp`, `game/world/run_record.{h,cpp}` (store the chase speed text; absent means legacy). Red: `old_record_without_chase_text_replays_legacy`; the exploit cells on the control (the search must flag at least one shuttle and one circle cell, or it is blind). He sees: the hunter running arcs; wall to wall stops working. State whether velocity now differs from heading (C needs it).

**Lap 2: runs played and the forgiving start.** `RunParams::runs_played` (0 = today); cap per G2 (1, 1, 2, 2, 3, 3, then the dial) at `run.cpp:1125,1173`; M3 gate; the count kept in `game/world/` beside the run record. Files: `chase/run.{h,cpp}`, `chase/play.{h,cpp}`, `game/world/run_record.*`, new `chase/tests/scale_tests.cpp` (add to `chase/CMakeLists.txt:95`). Red: `brutal_run_one_never_has_two_lesser_alive`, `runs_played_zero_is_byte_identical`, `old_record_replays`. He sees: run 1 on brutal has the full hunter and one lesser body.

**Lap 3: the run frame's chase half (queue step 2).** From `d673-chase-wip` fc8206d: `run_length_s`, Overtime, `Kind::Dark` appended before `Count`, saved on catch. Files: `chase/run.*`, `archetype.*`, `dials.h`, `chase/tests/overtime_tests.cpp`. Red: F1 to F5 of `loop/plan_d673_run_frame_2026-11-11.md` (nothing changes with the timer at 0). He sees: the timer end and the dark one coming.

**Lap 4: hearing and the toying arc.** Walk-graph hearing, alert, investigate, decide, phases, commit roll, 3 m rule. Files: `chase/run.cpp` (`sense`, `update_lesser`), `chase/dials.h`, `chase/archetype.h`, new `chase/tests/hearing_tests.cpp`. Red: R7 (no reaction beyond walk-graph range), R8 (replay bits), R6 (hunter ETA moves under 10 %), R1. Needs the sound aspect's noise events.

**Lap 5: kit wave 1 (his 142).** Appetite, Mirror, Call, Lunge, Charge, each an `Archetype` field with a tell. Files: `chase/archetype.*`, `chase/chaser.cpp`, `chase/run.cpp` (Call shares `Knowledge` across groups), `chase/bots.*` (new policies: surge-holder, overtaker, sprint-everywhere), new `chase/tests/kit_tests.cpp`. Red: E's pairs (`p-l172-chaser-kit-E:87`): each costs its technique by 15 to 30 percent and the technique still pays. Appetite waits for the movement aspect's surge (no surge in `sim/` today, grep).

**Lap 6: scare moves, placement ahead, mob events** (M2, 75 % behind). Then wave 2: the stalker (view test, look-back bot) and Through, after call 2.

## 6. Connections

Needs: run_frame (timer, dark one, saved), movement (surge, peak, velocity versus heading), abilities (flashlight repel, Aura freeze, Shroud, Lure hooks), stress (frenzy, commit-roll shift, Resonant), world_gen (long straights as stage, openings off corridors, Park and dead-end facts, nav links), sound (walk-graph noise events, footsteps L192), tech_foundation (determinism, landing train, memwatch).
Gives: entity_bodies (per-kind gait, uncanny traits, tell timings), player_body (what the look-behind shows), meta_loop (runs played, good-entity unlock and spawn rate), look_fear (tells for the distortion layer), story_lore (what each kind is, the dark one's name), waking_room (the trinket in hand), frontdoor_onboarding (the forgiving first runs).

## 7. Where it is going

Good entities (aura, tank, trinket giver) as a second family with the freeze screen; chapters raise counts (G3) and open endless mode; flow fields and separation only if groups grow; mother-mimic invasions; each lesser kind's uncanny trait when its model exists; learned locomotion for bodies only, tactics stay trees (his 131).

## 8. Not verified

- Every figure in section 3 is read from hand-backs, not re-run. The hunter ratios in section 2 are my arithmetic.
- That `run_record.cpp` needs only one field to gate a new default is inferred from a grep.
- Lap order follows the queue; laps 2 and 4 could start in a second worktree during sweeps (the 13-hour plan's lane A), untested.
- No source read for good entities, the stalker's view test, or Through's nav link.
- Items skipped: none; 146, 151, 155, 157 appear only as pointers to entity_bodies.

## Verification (second reader, 2026-11-13)

Repo read at `04f3882` on main (matches the header). Brief quotes checked by grep of `briefs/dreamzone2_the_game.md`; code opened at file:line.

- (a) Quotes ok, verbatim and under the cited item (line wraps ignored): 1 "exceedingly fast entity"; 7 "more aggressive ai or chase archetypes", "the entity has to route around"; 8 "a short transient period of safety"; 17 "OP but not like speed hacking"; 18 "momentum and inertia", "on a dime", "perhaps the interceptor is more nimble"; 25 "tanks agro for you for a short time" (and "holy aura"); 34 "freezing the entities in the world"; 28 "10% sounds good for the start", "fixate on fear", "cheating"; 30 "playing with its food"; 107 "always"; 65 "the main hunter always knows where you are"; 81 "slightly make all mobs quicker too to compensate"; 92 both quotes; 130 "slosh around corners"; 132 both quotes; 141 "every mob gets their own unique ability or passive to level the field"; 142 "okay we can try it"; 157 "Keep source, fix sway"; 164 "way too fast keeping speed"; 35/64 "cut off" (35 has "cut me off"; 64 has "cut off from the front").
- (a) WRONG, item 91: the document quotes how the hunter "is keeping up". His words (brief line 749) are "how its keeping up with me". Remove the quote marks or write "its keeping up".
- (a) Minor, row "3": "aggro levels" is unquoted and his word is "agro levels" (brief line 15); fine as paraphrase.
- (a) Item 8 "(the Park)": the name is in the brief at items about the reprieve's name (lines 787-788), not in item 8 itself; ok as a gloss.
- (b) ok `chase/archetype.h:14-23` seven kinds (Crawler at :24, the enum runs on).
- (b) ok `chase/archetype.cpp:112-135` charger and stalker rows; `run.cpp` has no hit for charger or stalker.
- (b) ok row speeds 1.45, 0.90, 0.92, 0.80 at `archetype.cpp:36,62,90,145`.
- (b) ok `chase/speed.h:22` ref_speed 8.0; `:33-34` start bonus 0.17 fading over 600 s; `:36-38` corner_floor_speed, slip_rate, lead_range default 0.
- (b) ok `chase/dials.h:23` hunter_speed 0.95 (+0.04/min, max 1.5); `:39-40` lesser_max 1 +0.5/min to 8 and spawn 24 s -1.5/min; `:47-49` mix weights.
- (b) ok `run.cpp:1125` and `:1173` (lesser cap reads); `:1084` find_site; `:1133` role-based prefer; `:966-972` hearing, with `hear_through` 0.5 at `archetype.h:68`.
- (b) ok `sim/params.h:38` sprint_peak_speed 10.0.
- (b) ok `game/world/run_record.h:34-54` stores `chase::Difficulty` (dials), `sim::MoveParams`, `WorldSettings`; no SpeedModel anywhere in `game/world/` (grep). `chase/play.h:17` does hold a `SpeedModel speed` in the run params, which supports the claim that it is not in the record.
- (b) ok `chase/CMakeLists.txt:95` `dz_add_tests(chase_tests ...`; `chase/tests/feel_tests.cpp` exists; `scale_tests.cpp`, `room_tests.cpp`, `hearing_tests.cpp`, `kit_tests.cpp`, `overtime_tests.cpp` do not exist yet (correctly described as new).
- (b) ok no `run_length_s` or `Kind::Dark` on main; both are on `origin/d673-chase-wip` (`chase/archetype.cpp:170`, `chase/dials.h:59`, `chase/play.cpp:26`).
- (b) ok branch tips c357bbd (l182-lines), d0751af (l182-hawk), fc8206d (d673-chase-wip), b61ce52 (l192-footsteps); `l170-chase` is merged into main (merge commit 764fd39). `chase/room.h` exists on l182-hawk; `l182-hawk:chase/SPEED_MODEL.md` has the L182b registration at line 501.
- (b) ok `chase/chaser.cpp` has `turn_rate()` (used at :49-54), so the lap 1 file list is plausible; the turn law field exists on l182-lines (`turn_law`).
- (c) No outside source is marked [read] by this document itself; outside material (Chang and Kram, Usherwood and Wilson, Valve licence, Booth) is cited only through room hand-backs. Checked through those hand-backs: Valve SDK licence "No, only the idea" at `p-l169-code-A:21-23` ok; Usherwood and Wilson abstract-only at `p-l187-animal-locomotion-E:19,67,114,199` ok; the 1.33 figure is "press, unverified" at `p-l187...E:224` ok; flow-field chapter unreadable at `p-l169-code-A:105` ok. I did not re-open any outside URL (no external reads done by me): could not check the licence terms of the originals; they are second-hand.
- (c) Hand-back figures ok: `p-d665-chase-data-A` rows 53, 56, 68, 76 (882 m, 858 m, 21 sprinters 6 s); `p-l170-chase-A:7-12` (P1 54.0 and 57.3 % vs 62.7 and 60.0 %); `p-l182-lines-A` a1/a2 wall ratios 0.38 to 0.45 and feelers at no catch cost (lines 45-54); `p-l169-games-E:15` (75 % from behind).
- (d) ok nothing marked [read] is without a path or commit; the "[read, A's evidence]" md5 `599ab239` is in `p-l182-lines-A:44` and `p-l170-chase-A:25` (prefix only).
- (d) WRONG line cites in hand-backs (the facts are right, the lines are off): "Nothing reads runs played or chapter (E, `p-l170-scale-E:74`)" is at `p-l170-scale-E_2026-11-12.md:57`, line 74 is the Axis (b) heading; "The control exceeds the law over 27 % of a corner (`p-l170-chase-A:47`)" is the table row at `p-l170-chase-A:63` (line 47 is the section heading); "`p-l182-lines-A:29-55`" runs past the 54-line file.
- (d) Section 3 cites section headings as line numbers for `p-d666-entities-E:39,84,110,136`, `p-l172-chaser-kit-E:13,47,87`: they land on headings of the right sections; ok.
- (d) [computed] hunter over player peak: 8 x (0.95+0.17) / 10 = 0.90 at 0 s and about 0.91 at 30 s ok; at 300 s I get 0.99 only with the bonus half faded (0.085), not "faded" as stated: wording WRONG, number ok. 10.75 = 8.96 x 1.2 run-up ok. E's 8.75 in `p-l172-chaser-kit-E:36` ok, stale as stated. Distance gain and the level's start-minute offset are not in these ratios (the document does not say so).
- (d) "no surge in `sim/` today (grep)": `grep -i surge` has one hit, a test name and comment in `sim/tests/ground_tests.cpp:79,81` about the two-stage sprint; there is no separate "earned surge" mechanism, so the claim stands if "surge" means Appetite's input; ambiguous wording.
- (e) Coverage: all assigned items 1, 3, 7, 8, 17, 18, 25, 26, 28, 30, 34, 35, 37, 39, 61, 64, 65, 81, 88, 91, 92, 107, 127, 128, 129, 130, 131, 132, 141, 142, 146, 151, 155, 157, 164, 166, 168, 169, 178 appear in section 1. Items 146, 151, 155, 157 are only pointers, as the document says. None skipped. Section 1 row "25, 34" mixes in item 25's "10%"-free text correctly; row "28, 30" attributes "cheating" and "safe zones only reroute" to 28 (they are in 28, not 30), which the row does not claim separately; ok.
- Not checked: the contents of branches l182-lines and d673-chase-wip beyond existence and the grep hits above; the registered bars and falsifiers at `l182-hawk:chase/SPEED_MODEL.md:501-590` (only the head lines opened).

Totals: checked 31, ok 25, WRONG 3 (item 91 quote; hand-back line cites; "bonus faded" wording), could not check or ambiguous 3 (outside licences second-hand; branch internals; "surge").
