# Subagent read (read-only) for step 3: d673 overtime chase. Saved 2026-11-13 ~03:03 local. Line numbers are origin/main e0184ea; I have NOT re-verified them. "(inferred)" = the agent's.

Branch `origin/d673-chase-wip` fc8206d is 44 commits behind e0184ea (merge base cab3530). chase/run.cpp is +34 lines after :392 on main.

## Exists (interface commit db8e557 + test commit fc8206d; every symbol overtime_tests.cpp calls is declared)
- chase/run.h: Phase::Overtime (:122), RunParams::run_length_s, overtime(), overtime_seconds(), saved(), kept_score(), saved_
- chase/run.cpp: phase_name entry; empty `case Phase::Overtime` in direct() (branch :1167)
- chase/archetype.h:26 + .cpp: Kind::Dark, make_dark() (hunter body, built=false), name tables
- chase/dials.h:59-64: five dials (constants, per_minute 0; with_dials("dark_speed_start=0.01") works)
- chase/play.h/.cpp: PlayParams::run_length_s, Outcome::{saved,overtime_s,kept_score}
- chase/CMakeLists.txt:101: test file listed

## Missing (all behaviour)
checked by the agent: `git grep saved_` on the branch -> header only. saved_ never set; Phase::Overtime never entered; no Dark spawned. Run::score() (:264) unchanged. Catch loop (:520-535) knows nothing of overtime. fall_into_void (:272) does not save. Nothing walks the others off. Climber guard (:923) not overtime-aware. update_hunter (:712, :745, :773-812) has no Dark variant. set_stage (:341) would erase the Dark. chase/streamed.cpp:320 `cp.run.run_length_s = params.run_length_s;` absent (play_streamed, C's rows F1-F3, cannot reach overtime). dz-chase has no --run-length (main.cpp:109; sweep builds PlayParams at :514-523).
Rows 1 and 5 are already green guards at the interface commit; rows 2,3,4,6,7,8 red (inferred from code, not run).

## Tests (line in overtime_tests.cpp)
1 (:33) timed run at 40 s has the same state_hash every tick as untimed until the timer. -> all overtime work gated on overtime having begun
2 (:54) phase()==Overtime at tick()==7201 (transition inside the step where tick_==7200); no overtime before; exactly one Spawned event who==Dark at tick>=7200, no other spawns, never two Darks. -> begin_overtime() from tick_body
3 (:84) no non-Dark agent remains once overtime_seconds() > overtime_clear_s (strict); none removed while in_view (<=45 m and clear line to chest); no non-Dark ever ends the run
4 (:130) Dark's first flat distance from player >=20 m and out of view; catch is by==Dark, saved, kept_score==score>0
5 (:153) catch before the timer -> saved=false, kept=0
6 (:166) director=false, reprieve_hold_s=1000, player inside a reprieve, timer 5 s: Dark enters and catches, saved() true. Spawn must not go through try_spawn (returns false while in_reprieve_ :1113); Dark ignores open_
7 (:197) fall at 2 s (timer 3 s): saved=false kept=0; fall at 4 s: saved with kept>0; no catch in first second of overtime. -> fall_into_void sets saved_ = overtime()
8 (:220) at 70 s with timer 60 s: score == score_at(14400) + 5*score_rate_at(14400)*10; kept==0 while not over. C derives overtime_bonus as score minus score_at(T)
Tests 6-8 use director=false, so the overtime step cannot live in direct().

## Hook points
- New overtime_step(player) in tick_body after watch_reach (:492), before the agent loop. Returns at once unless run_length_s>0 && seconds()>=run_length_s. First tick: phase_=Overtime, log Phase a=4, every non-Dark agent -> Mode::Leaving with far out-of-sight home (hunter's door home may be near the player; waiting agents silently erased (inferred); don't remove on this tick). Dark sent once, retried each sense tick until a site is found. Removal: any agent with d>45 || !see(chest); force when overtime_seconds()>=overtime_clear_s, drop the 3 s minimum. direct() returns early in overtime.
- Catch loop (:518-535): replace outer `if (!in_reprieve_||open_)` with per-agent skips: skip when in_reprieve_ && !open_ && kind!=Dark; skip any non-Dark once overtime begun. Dark catch sets saved_=true.
- fall_into_void (:272): saved_ = overtime().
- watch_reach (:923): return when overtime begun (else a Crawler appears after the clear).
- update_hunter (:691-819): route Dark through it from the agent loop (:496). dark_body(): top=(dark_speed_start + dark_speed_rise*overtime_seconds())*ref_speed, distance scale 1 (inferred reading). Dark: knowledge pushed every tick with zero error, react=0, open=open_||Dark at :773/:787/:800/:812, group 0, Mode Pursue. Early Leaving branch (replan to home, then step) before :745. hunter_inside/hunter_off_stage (:860-884) must set Leaving not Pursue in overtime. set_stage (:341), lesser_alive (:315): treat Dark like the hunter, exclude from count.
- Spawn: new find_dark_site: ring at dark_spawn_m from player, prefers behind the player's velocity, requires way_round reachability and flat distance >=20 m. Sight: two checks from find_site (:1103) plus chest-height (+1.0 m). Create with add_lesser(Kind::Dark,...) (:439), then Pursue.
- Hash: add no new terms (agents, phase_, events_.size() already hashed :549-555). Any new term gated on overtime BEGUN not run_length_s>0, or test 1 fails.

## Risks
- Replay: all new code inert at run_length_s==0. Re-derive baseline fingerprints on origin/main before editing (cab3530's in the D673 handback are stale).
- Arrays sized by Kind::Count grow safely: run.h:254-255, play.h:62, proof_tests.cpp:36, dz-chase/main.cpp:569/689/821.
- body_tests.cpp:71 requires exactly 4 built non-hunter archetypes, `may` beyond walk/ladder/drop only for the Crawler -> Dark stays built=false and cannot climb. A player on a ledge in overtime is then uncatchable (open question).
- game/world/figures.h:28 kFigureSlots={1,6,6,9,0,0,2} leaves Dark at 0 slots; stage.cpp:283 skips it. C must add a slot. figures.cpp and hud.cpp:39-43 fall to default (climber's look/colour); hud.cpp:233 counts Dark as a lesser chaser.
- event_name and phase_name are unchecked indexed tables: add no EventKind, or extend both.
- Merge conflict: only CMakeLists.txt (both branches add a test after pursuit_tests.cpp).
- Run records: new dials name-keyed, old records parse (run_record.cpp:182-193).
- Removal-in-view: test checks previous tick's position; corner case possible (inferred).

## Build order
0. second worktree: rebase branch onto origin/main, resolve CMake, record baseline fingerprints.
1. add streamed.cpp:320. Build chase_tests, confirm red/green map.
2. score() and fall_into_void save (rows 7, 8; 8 after step 3).
3. overtime_step, phase, Leaving, direct() early-out, climber guard, catch rule.
4. dark_body, find_dark_site, Dark via update_hunter (rows 2, 4, 6).
5. set_stage/lesser_alive, plus a hand mutation of each rule.
6. Full chase suite; fingerprints vs baseline.
7. dz-chase --run-length and overtime stats for F1-F3.
8. Docs (chase/CHANGES.md, CHANGELOG.md), hand-off note to C on kFigureSlots and the HUD.
