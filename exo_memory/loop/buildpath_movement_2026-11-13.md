# Build path: movement tech (the base kit, the surge, wall-runs, the endgame bhop, speed feel). Swarm worker, 2026-11-13

Game repo read at dreamzone-3 `04f3882` (main). Marks: [read] opened; [code] file:line in the game repo; [inferred] my reasoning; [ours] a proposal with no source. Nothing was built or run. Items are [his N] from `briefs/dreamzone2_the_game.md`.

## 1. His words

| item | what he asked | short quote |
|---|---|---|
| 1, 4 | A chase beaten by movement and verticality | "out maneuvered through skill and finesse"; "utilize parkour mechanics and more verticality" |
| 7 | On foot first, parkour as the evasion | "traversing areas on foot rather than parkour being a main element" |
| 12, 15, 22 | More fluid, slightly higher top speed; asks when the running rework starts | "maybe even higher top speed slightly"; "when will the running feel/animation rework start"; "research into run speed" |
| 13 | A burst off the line, then a slow ramp to max | "ramps up and takes a little while just like a real sprinter" |
| 14 | Wall-runs rare, short, a way across a killing floor | "the wall running should be rare and short" |
| 18 | No stamina; chasers have inertia; a long straight makes them faster, so you must turn | "it should be a always fast paced survival situation"; "the entities then scrub speed turning" |
| 21 | Fixed base speed, raised by upgrades; about 5 m/s then about 10 | "perhaps it goes to 5ms fast, then eases into their top speed to around 10ms" |
| 27 | FOV that feels speed but never fish-eyed; look-behind back; procedural hands on walls | "never get too fish eyey, but enough to feel speed" |
| 53 | Chains and a held straight earn points; base moves need no skills | "sprinting in a straight line for extended time" |
| 57 | Bhop exists in the base game but is very hard; a late endless perk loosens it; a view-steered dive roll | "very hard to accumulate momentum"; "a dive into a roll that moves with the head" |
| 81 | Peak about 10 m/s earned by holding sprint; mobs get quicker to match | "then upgrading it from there makes you a speed demon" |
| 134 | A COD-like slide cancel and sprint reset; a "fun and addicting" system | "slide cancelling and sprint reset" |
| 135, 136 | Mostly real physics, bent for the setting; a bend shows through the distortion layer | "mostly realistic, but it can be bent stylistically" |
| 137, 138 | Base kit is sprint, slide, dive, wall run; a surge fed by close passes and overtakes, compounding and decaying | "surge is like overtake, not near miss, but i am saying a fusion of the sort" |
| 139, 140 | Not cooldowns; the base limited; abilities lift the limits | "diminishing returns"; "nutty speed lines" |
| 141 | Player now too fast; fix chaser pathing, give every mob a unique edge | "level the field" |
| 161, 162 | Physics may drive camera and controls; his pick (a) plus a K3 inertia dial (recorded by the librarian) | "physics could control the camera and controls" |

Supersessions [read]:
- 21's peak is overtaken by 81; D657 landed 10 (`handback/p-d657-d656-land-P_2026-11-11.md:7-12`).
- 134's per-slide reset is overtaken by 137 to 140 (surge, diminishing returns, no cooldowns).
- 18 (no stamina) stands; a sprint that tires after 10 s contradicts it (`handback/p-l171-movement-tech-E_2026-11-12.md:15-20`).
- 162 strikes L185's "never" for physics on the player.

## 2. What exists today

[code] Controller and params (`sim/params.h`, `sim/world.cpp`):
- Sprint: 3.0 to 7.0 m/s in 0.6 s (`params.h:34-36`); a long build to `sprint_peak_speed` 10.0 over 8 s, curve `1-(1-l)^2` (`:38-39`, `world.cpp:170`). The build rises only on the ground at 0.9 of top speed and is held in the air and through turns (`world.cpp:843-851`).
- Slide boost +2.0, cooldown 1.5 s, halved when repeated within 3 s (`params.h:72-74`, `world.cpp:1110-1128`). A slide-hop keeps the speed (`world.cpp:929`). Dive +1.0 forward along the velocity, not the view (`start_dive`, `world.cpp:772-775`).
- Wall-run 1.6 s max, speed building toward 1.3 x entry (`params.h:101-102`); wall-kick 6 up (`:109`).
- Momentum tier: `flow_enabled` 0, `flow_cap` 10 (`params.h:47-48`), fed by `flow_transition()` on slide, roll, vault, mantle and wall-kick (`world.cpp:163-167`).
- Air: Quake accelerate capped along the wish only, `air_accel` 2.0, `air_strafe_gain` 0.0 (`params.h:67-69`, `world.cpp:196-211`). A jump buffered 0.12 s fires before friction (`world.cpp:897`), pinned by `a_buffered_jump_on_landing_keeps_speed_that_a_plain_landing_loses` (`sim/tests/jump_tests.cpp:203`). Soft cap 14, hard cap 20 (`params.h:55-57`).
- Camera: the FOV widening is `fov_speed_add x clamp((speed-3)/(7-3), 0, 1.5)` (`game/camera.cpp:149-152`), so it stops growing at 9 m/s. The stride, bob and lean already read the peak (`camera.cpp:168`). Look-behind on V (`game/bindings.cpp:22,106`).
- The generator sizes voids from `kBaseMove`, whose `sprint_peak_speed` is still 8.75 (`gen/src/gen.h:108,138`), while the player's is 10.

Findings from my own read [inferred, not run]:
1. At defaults the momentum tier adds nothing once the peak is built: `top_speed()` takes the larger of the peak rise and `flow` (`world.cpp:172-176`), and `flow_cap` 10 equals the peak 10. The surge must be an additive term, not a third source in that `max`.
2. `briefs/dreamzone3_design.md:286` still says 8.75; the code says 10. A stale carrier.

Not built: the surge, overtake and near-miss detection, slide cancel, the landing-friction window, view-steered dive (a grep for near_miss, overtake and slide_cancel in sim, game, chase and gen finds only chase speed-model test names). Of the branches, only `l185-skeleton` touches `sim/` (`physics.cpp`, `jolt_start.h`, 11 lines, picture-only physics).

In flight tonight [read] (`loop/plan_13h_run_2026-11-13.md`): A's chase law and exploit search, B's body and landing train, C's arms and run frame, E's skeleton. Movement is a gate, queue step 9 (`loop/queue_dreamzone3_2026-11-12.md`).

## 3. What the room already knows

- Human sprint data and E's 6 / 9 / 4 s set against his 5 then 10 (`handback/p-l161-speed-E_2026-11-11.md:9-22`). D657 took 7 / 10 / 8 s, chasers at 8.0 (`handback/p-d657-speed-B_2026-11-11.md:57-75`).
- No turn spends the peak (`p-d657-speed-B:36-55`).
- A slide into the edge, then a jump, crosses the flat void gap at the 10 m/s peak and mantles the far ledge (`p-d657-speed-B:102-108`). Open.
- Bhop exists mechanically; a landing-friction window, `air_strafe_gain` and the soft cap are the dials (`handback/p-l164-movement-E_2026-11-11.md:12-22,98-138`); six questions to him at `:168-175`.
- COD's reset became a chore and was nerfed (`p-l171-movement-tech-E:22-50`).
- The surge design: overtake +0.8 m/s, chaser near miss +0.5, edge near miss +0.2; cap +2.0 and at most 12.4 m/s; hold at most 10 s; decay 0.6 m/s per s; repeat curve 1, 0.5, 0.25, floor 0.15 over 20 s; abilities lift the limits (`p-l171-movement-tech-E:280-362`). Its farm example never passes 0.20 (`:340-347`).
- Cues: tracers and colour work now as per-frame nudges; breathing, stretching and slicing wait for the distortion layer (`:155-183`).
- Physics on the player: K1 and K2 first, the K3 inertia dial last and off by default; tests: replay byte-identical, eye equals today's at effects 0, aim equals input (`handback/p-l186-physics-player-E_2026-11-12.md:60-75`).

Unresearched: wall-run set pieces in real games.

## 4. Contradictions and calls that are his

1. **Does the slide reset anything?** (a) The surge alone, as ruled in 137 to 140. (b) Surge plus "the peak burns after 10 s unless a slide re-lights it" (E's shape B). (c) A COD burst as an ability. Cost: (a) lowest; (b) a timer and a chore risk; (c) a second timed state.
2. **Which sources feed the surge first?** (a) Overtake and chaser near miss only (no gen change). (b) Add edge near misses (a per-chunk edge list from `gen/`, small and deterministic).
3. **Does contact end the surge?** A stagger or wall hit ends it, halves it, or nothing (`p-l171-movement-tech-E:305-310`). "Ends" makes clean running the skill.
4. **The base ceiling.** 12.4 m/s (the human line) or lower; lower leaves less room for "nutty speed lines" before upgrades.
5. **Voids and the 10 m/s peak.** (a) Raise `kBaseMove` peak to 10 (changes every seed's world and every kept replay). (b) Keep 8.75 and accept slide-jump-mantle crossings. (c) Cut the mantle reach. Cost: (a) is a deliberate generator change, `gen.h:134-138`.
6. **The first stage, 7, 6 or 5 m/s?** His 21 says 5; E says 6; main has 7. Also the long build's 8 s against E's 4 s. Needs play, not research.
7. **Bhop at base** (E's menu 1 to 3): friction window of 1 to 3 ticks or today's free hop; `air_strafe_gain` 0 or 0.1 to 0.25; soft cap 14 or 18 to 20 for the perk. Each base change moves existing tests (`params_tests.cpp:19`, `jump_tests.cpp:203,273`).
8. **Dive and roll steer by the view or the run** (E's menu 6): view-steered is a mild bend that needs the distortion layer's cue or it reads as a bug.
9. **Item 14 against 137 and the 12.6 m/s wall-run exit** (`HANDOFF.md:55`): the base kit lists a wall-run yet it must stay rare. Is rarity a generator dial, as I propose?

## 5. The build path

Every step ends with the stamp, the scan and a "for his eye" note. Tests named are red first.

**Lap 1 (two disjoint parts, then a join): the tier above the run, measured and visible.**
- 1a, sim core. Files: `sim/params.h` (surge params), `sim/world.h` (`World::report_surge(kind, source_id, weight)` called between steps, like `add_piece`; `PlayerState::surge`), `sim/world.cpp` (additive term in `top_speed()`, hold, decay, repeat curve, hard-stop drop, 12.4 ceiling, surge in `fingerprint()` at `:1135`), new `sim/tests/surge_tests.cpp`. Red first: `a_surge_event_raises_top_speed_above_the_peak`; `a_repeat_source_pays_less_but_never_zero`; `one_door_looped_never_exceeds_the_first_pass`; `the_base_never_exceeds_12_4`; `a_hard_stop_ends_the_surge`; `the_state_hash_notices_a_surge`. Also `the_momentum_tier_adds_nothing_above_the_peak_at_defaults` (green now; it documents finding 1).
- 1b, the feed. Files: new `chase/surge_events.{h,cpp}` (pure, per tick: an overtake is a chaser going from ahead to behind within 3 m, same storey, no catch; a near miss is within 1.6 m closing), `chase/tests/surge_events_tests.cpp`, the dz-world wiring in `game/world/`, the HUD line in `game/gym/hud.cpp`. Red first: `an_interceptor_passed_without_a_catch_is_one_overtake`; `a_parallel_corridor_is_not_an_overtake`; `a_catch_cancels_the_overtake`.
- Join: red `the_view_keeps_widening_to_the_top_speed` in `game/tests/camera_tests.cpp` (extend the test at `:165`), then `game/camera.cpp:149-152` keyed to the peak plus surge. He plays dz-world with interceptors and watches the number.
- Bots, in A's paired 150-seed blocks: surge off against on, and the exploit search's loop-one-door policy.

**Lap 2: the cue.** Per-frame nudges that exist today (haze, `taaHistory` tracers, saturation), a rising sweep for an overtake, a whoosh for a near miss, a minimal counter. Files: `game/world/stage.cpp`, `game/camera.cpp`, `audio/`. Red: `a_surge_step_raises_the_cue_and_a_hard_stop_clears_it`. Needs call 3.

**Lap 3: edge near misses.** `gen/src/emit.cpp` emits per-chunk edge points (convex corners, door jambs), carried like reprieves. Red: `every_door_jamb_and_convex_corner_has_an_edge_point` in `gen/tests/walk_tests.cpp`; the fingerprint row `one_seed_is_the_same_world_whatever_the_players_movement_numbers` stays green. Needs call 2(b).

**Lap 4: the bhop base and the perk.** `sim/params.h` (`landing_friction_window_ticks`, base `air_strafe_gain`), `sim/world.cpp:897,915-920,963`. Red: `a_hop_pressed_outside_the_window_pays_friction`; `the_perk_set_widens_the_window`. Amend `params_tests.cpp:19`, `jump_tests.cpp:203,273` by name. The perk is a parameter set fixed at run start, so replays carry it. Needs call 7.

**Lap 5: the void and wall-run rarity.** Settle call 5, then a `gen/` row `a_void_is_not_crossed_by_slide_jump_and_mantle` (B's probe made permanent); wall-run frequency as a generator dial.

**Lap 6 (after the body lands): the K3 inertia dial** (off by default, reversals only; bots against bar 1) and the view-steered dive (call 8).

## 6. Connections

| key | movement needs | movement gives |
|---|---|---|
| run_frame | the run's timer and overtime | surge and peak as the run's pacing |
| chase_entities | chaser positions per tick; pace that tracks the player (81, 141, `chase/speed.h`) | overtakes and near misses as events |
| entity_bodies | chaser heights, for a later somersault | a passing moment for a smear cue |
| player_body | stride, FOV and roll keyed to speed; K1 and K2 (162) | the speeds the body must match |
| abilities | P1, P2, P3, P6 lift the limits (`handback/p-l170-abilities-E_2026-11-12.md:40-45`) | the limits, as parameters |
| stress | the heat variant | a speed-linked stress source |
| meta_loop | chain and straight-line XP (53) | the events XP counts |
| world_gen | edge points; void sizing; wall-run rarity; lines that suit 10 to 12 m/s | none |
| look_fear | the distortion layer for bend cues (136); proximity FOV (27) | the speed signal it reads |
| sound | a sweep, a whoosh, a bhop hum | the same events |
| tech_foundation | bots, A's paired blocks, replays carrying the perk | determinism rows |
| story_lore, frontdoor_onboarding, waking_room | the dream-logic reason for each bend; teaching the base kit; nothing else | none |

## 7. Where it is going

Abilities lifting each limit (a cash-in burst, an Overclock past the soft cap); the endless bhop and a super slide; the somersault over short chasers; the noclip bend; chaser passives (141); a stress heat cost for the surge; the K3 dial if his hands like it; chain scoring (53, 57).

## 8. Not verified

- Nothing was run; finding 1 and the stale carrier are read from code and docs only.
- All surge values are options for bots, not measured; COD figures were never found.
- Not read: L193, the first game's code, most of `docs/research/03_movement_chase_research.md`, the chasers' code beyond greps.
- Item 162's text is the librarian's record of his pick, not his words.
- How the run record would replay game-fed surge events is unread; check it first.
- No outside research was done.
- items_skipped: none.

## Verification (second reader, 2026-11-13)

Game repo at `04f3882` (main); read-only. Quotes checked with a whitespace-normalised search of `briefs/dreamzone2_the_game.md` split by item number.

- (a) Quotes for items 1, 4, 7, 12, 13, 14, 15, 18 (both), 21, 22, 27, 53, 57 (both), 81, 134, 135, 140, 141, 161: ok, each verbatim under the item cited.
- (a) Quotes for "137, 138" and "139, 140" rows: ok. "surge is like overtake..." is under item 138 and "diminishing returns" under item 140, both inside the pair the table names. Item 137 and 139 text was not matched on its own.
- (a) Item 162 is not quoted (stated as the librarian's record): ok, no check needed.
- (b) `sim/params.h:34-39` (sprint 3/7, build 0.6, peak 10, 8 s), `:47-48` (flow_enabled 0, flow_cap 10), `:55-57` (soft 14, hard 20), `:67-69` (air_accel 2.0, air_strafe_gain 0.0), `:72-74` (slide boost 2.0, cooldown 1.5, fatigue 3), `:101-102`, `:109`: ok.
- (b) `sim/world.cpp:163-167`, `:170`, `:172-176` (top_speed takes the max of peak rise and flow), `:843-851`, `:929`, `:772-775` (dive +1.0 along velocity, `dive_boost` 1.0 at `params.h:114`), `:1110-1128`, `:1135`: ok.
- (b) `sim/world.cpp:897` "a jump buffered 0.12 s fires before friction": the line is only `jump_wanted = can_act && jump_press_age <= t.jump_buffer`; the 0.12 s is `params.h:65`. The "before friction" ordering was not read. Partly ok.
- (b) `game/camera.cpp:149-152` (FOV formula; `fov_speed_limit` 1.5 at `game/settings.h:41`, so growth stops at 9 m/s): ok. `:168` (peak read): ok. `game/bindings.cpp:22,106` (look-behind V): ok. `gen/src/gen.h:108,138` (8.75; `kBaseMove`): ok. `jump_tests.cpp:203,273`, `params_tests.cpp:19`, `camera_tests.cpp:165`, `HANDOFF.md:55` (12.6 m/s): ok.
- (b) "only `l185-skeleton` touches `sim/` (`physics.cpp`, `jolt_start.h`, 11 lines)": branch list ok (`git diff --numstat main...<b> -- sim` over all branches). WRONG on size: `jolt_start.h` +9, `physics.cpp` +7 -4, so 20 changed lines in total; 11 is only `physics.cpp`.
- (b) "a grep for near_miss, overtake, slide_cancel finds only chase speed-model test names": mostly ok. It also hits prose in `chase/SPEED_MODEL.md:312-356` about the hunter overtaking the player; not a mechanic.
- (c) No outside source is marked [read]; the document says no outside research was done: nothing to check. Licences: not applicable.
- (d) [read] items cite room paths, not memory. WRONG: "D657 landed 10 (`handback/p-d657-d656-land-P_2026-11-11.md:7-12`)": those lines are about a heavy-run slot overlap and do not mention the peak. The 10 m/s peak and chasers scaled 7 x 10 / 8.75 = 8.0 are in `handback/p-d657-speed-B_2026-11-11.md:57-60`.
- (d) `p-l171-movement-tech-E:15-20` (stamina contradiction), `:280-362` surge values (+0.8, +0.5, +0.2 at `:303-305`; cap 2.0 and 12.4 at `:309`; hold 10 s; repeat curve floor 0.15 at `:325`), `:340-347`, `p-l170-abilities-E:40-45`, `p-l186-physics-player-E:60-75`, `p-l164-movement-E:168-175` (six questions), `p-d657-speed-B:102-108`, queue step 9: ok. Earlier numbers at `p-l171:240-241` (+0.25, +0.6) are superseded by §8.3; the document uses the later set, correctly.
- (d) `briefs/dreamzone3_design.md:286` as a stale 8.75 carrier: the file is not under the game repo; the line it cites reads "`sprint_peak_speed` 8.75" in the librarian's briefs copy: ok.
- (d) Not rechecked in full: `p-l161-speed-E:9-22` (opened lines 9-12 only, a table with "now / his guess / recommended base"); `p-d657-speed-B:36-55` (36-38 only); `p-l171:22-50` (COD section opened at its head only); `plan_13h_run` content beyond the A items. Could not check the "COD reset was nerfed" claim without reading more.
- (e) Coverage: items 1, 4, 7, 12, 13, 14, 15, 18, 21, 22, 27, 53, 57, 81, 134-141, 161, 162 are all addressed in section 1. Skipped: none. Item 14's "killing floor" gloss was not matched to the brief.

Totals: checked 44, ok 41, WRONG 2 (the `l185-skeleton` line count; the D657 landing citation), partly ok or could not check 3 (`world.cpp:897` ordering, COD nerf claim, item 14 gloss).
