# Build path: tech_foundation (determinism, replays, saves, instruments, the landing train, render cost). Research worker, 2026-11-13

Game repo read at main **04f3882** (`git log -1`). Marks: [read] opened and read, [code] file:line, [inferred] my reasoning, [ours] a proposal. No machine process was run; nothing was built or replayed.

## 1. His words (brief `briefs/dreamzone2_the_game.md`)

| item | what he asked | short quote |
|---|---|---|
| 5 | Rewrite, keeping the generator's hash basis and the lighting | "keeping the proc gen fundementals and raytraced lighting effects" |
| 9 | Builders get room until a base works | "go all out on it until you have a working base" |
| 35 | Wants telemetry from a run; there was none (only best_times.txt) | "can you see the telemtry from my run?" |
| 63 | Lighting noise and shimmer | "too much noise by the raytraced lighting" |
| 64 | Wants his run's data read | "u see the data" |
| 83 | Blender and Python for Blender work only | "its on steam" |
| 86 | Yes to the five waiting questions, among them Git LFS and textures on a fresh clone | "do all waiting on me" |
| 91 | Repetition over five minutes, and what kept up with him | "how is the data" |
| 122 | Stop opening threads, then a gap sweep | "get back to fundementals quick" |
| 126 | A void death on a floor | "i swear it says i fell into a void" |
| 133 | The ordered list is cleared to run | "feel free to do all of it in the order you made" |
| 148, 149 | Runs read from a record and a full replay (no loop; a stair shaft) | "did i some how loop back" |
| 158 | A physics engine under the procedural animation | "a physics engine itself that drives the procedural animations" |
| 165 | Standing rule | "they have to link to the research" |
| 179 | The swarm scouts and does not build | "They do not build, but either research or devise" |

Supersession: 133 (01:01, 11-12) lets the queue run, which 122 (18:13, 11-11) had paused for a sweep; the sweep is the queue's source (`loop/queue_dreamzone3_2026-11-12.md:3-8`). 165 hardens his 154 (research first, quoted inside item 158). Item 35's "no run record" is superseded by L162 (section 2). Item 63 was answered by L162's lighting landing (`handback/p-l168-setup-B_2026-11-12.md:58`); whether the noise is gone is his eye's to say.

## 2. What exists today

**The deterministic sim**
- Fixed tick 240 Hz: `core/time.h:9`. Architecture principle 3: `docs/ARCHITECTURE.md:55`.
- Float discipline: `/fp:precise` (`CMakeLists.txt:19-20`), Jolt built without FMA or fast-math (`third_party/CMakeLists.txt:6`), trig from `core/det_math.h:1-7` (add, multiply, divide, floor only).
- The fingerprint: `sim/world.cpp:1132-1155` folds position, velocity, timers and states each tick. The ladder fields join only after a ladder is held (`:1142`), so older replays still prove themselves.
- Hazard [inferred]: `std::acos` in a bot's policy (`chase/bots.cpp:383`) and `std::pow`/`std::log` in lamp colour (`gen/src/biome.cpp:29-34`) use the C runtime. Recorded inputs make the first harmless for replay; the second is likely colour only. Neither was tested across machines.

**Replays and run records** (L162, `handback/p-l162-runs-C_2026-11-11.md:111-133`)
- `.dzr` input record, magic "DZRP", version 1, 12 bytes a tick, final hash (`sim/replay.cpp:11,37,68`).
- `game/world/run_record.{h,cpp}`: a `.txt` with build, seed, level, dials, movement params, world settings, events, both fingerprints; `replay_run` (`run_record.cpp:281`) plays it headless; `dz-world --replay-run FILE|last` (`game/world/main.cpp:310-330`) exits 0 only when both fingerprints match.
- Gaps [code]:
  1. The `.txt` has **no format or law version** (`run_record.cpp:101-120`). It stores the build commit (`:106`) and movement, world and dial values, but nothing from `chase/` levers or the generator.
  2. The replay never compares `record.build` with the running build (`main.cpp:326-330`). A mismatch is just exit 1.
  3. `kRunsKept = 20` (`run_record.h:35`; prune `run_record.cpp:259`). In today's folder, 6 of 20 runs are "left" after under 2 s (`game/runs/run-20261113-0822*.txt`). The runs behind items 64, 91 and 126 are already pruned; only `best_times` (brutal 312.57) survives. [read: ls and grep of `game/runs`]
  4. No committed fixture run; `game/runs/` is git-ignored.
  5. A mid-run F5 parameter reload is not flagged (`p-l162-runs-C:199`).

**Persistence:** `game/config/best_times.txt` with a `.bak` and tmp-then-rename (`game/textfile.cpp:56-68`; `world_app.cpp:587-628`); `world.local.txt` over `world.txt`; bindings and gym settings. Nothing else is kept between runs; the meta loop is not started (`HANDOFF.md`, "Not started").

**Instruments** [code]
- Suites: 11 ctest suites registered in `tests/CMakeLists.txt:6-11`; `build.bat test` runs `ctest --test-dir build` **serially** (`build.bat:29`). Two self-tests: `dz-gym --selftest` 26/26 and `dz-world --selftest` 52/52 (`handback/p-d663-loader-land-P:138-140`).
- Bots: `chase/bots.h:33` `Policy {Flee, Line, Still, Juke, JukeAll, Cutback}`; `sim/bot.h` waypoint runner.
- Chase sweeps: `dz-chase` with `--slosh`, `--csv` (A's scorer, B's CSV, landed in 764fd39, `p-l170-instr-B:54-66`). B's control: 62.7 % and 60.0 % of flee runs never caught over two 150-seed blocks (`:26-29`).
- Drop harness: on branch `l189-drops` d9eb1b5 only (`gen/src/drop_proof.cpp`, `gen/tests/drop_tests.cpp`). Red on 0389b0a: 229 unintended drops in 24 seeds, all the wide-well strip (`p-l189-drops-C:162-175`). Not run on current main.
- Motion yardstick: **no code exists** (grep over every branch). `game/skeleton.*` and `game/ragdoll.*` exist on `l185-skeleton` b226b95 only.
- Landing train: **no code exists.** Today's pieces: `consonance/tools/heavy-run.js` hold (D663), B's `dzrunning.cmd` guard, `launch.ps1` stamp (`launch.ps1:26,90`), the scan and push gate.

**Assets:** `content/models/*.glb` in Git LFS (`.gitattributes:2`); cgltf and DirectXTex submodules (`.gitmodules`); without the files the boxes stay with the reason on stderr (`CHANGELOG.md:124`). `assets/` is git-ignored (`.gitignore:12`) and textures are baked by `art/tools/textures.py` under headless Blender 5.2.3 (his yes, item 83).

**Render cost:** budget 2.78 ms (`docs/ARCHITECTURE.md:57`); after D651 p99 1.49 ms at 1440p (`CHANGELOG.md:511-514`). `dz-world --bench` exists (`main.cpp:12`); timing runs go to D only (`queue:18`).

**Branches in flight:** `l189-drops`, `l185-skeleton` (mutants owed), `l188-fpbody`, `l182-hawk` d0751af (not compiled), `a-d673-overtime` d07d351 (untested), `l192-footsteps`. The 13-hour plan (`loop/plan_13h_run_2026-11-13.md:124-132`) names 260553b for `l189-drops`; the branch tip is now d9eb1b5.

## 3. What the room already knows

- Exclusive hold: 96/96 rows, 92 mutants caught, and five older mutant anchors had never applied (`p-d663-hold-E:136-264`). Landing guard check was inert for L161 to L168 because Git's `find` shadowed Windows' (`p-l168-setup-B:57-60`); fixed by `dzrunning.cmd` (`:67-93`).
- A suite's red can be another file's side effect: gen-brief-gate deleted a tracked file and turned 8 files red (`p-d663-land-P:63-75`); fixed in D670 (`p-d670-genbrief-E:20-50`).
- Loader landing: LFS pointers verified on origin; 11 suites; 424 s (`p-d663-loader-land-P:123-159`). Setup on L: 11/11 in 479.93 s; chase_tests 204.65 s, gen_walk 96.97 s, world_app 68.82 s (`p-l168-setup-B:26-40`). [inferred] a parallel run's floor is about 205 s if nothing collides.
- Selftest fall row measures the machine as well as the code (`HANDOFF.md`, "Checks that fail under load").
- A test of a measuring tool must use known answers (`p-l170-instr-B:66-75`); B's control slip floor was about 10 degrees from the estimator alone (`:138-143`).
- The harness once stood blind to the bug it was built for; it was fixed and registered in the open (`p-l189-drops-C:130-160`).
- The void kill's box was too deep; fixed at b2231b5 with 0 of 58 floors inside a box (`p-d671-void-B:223-260`).
- Low-memory reaper: lockless `world_app_tests` was 1.1 GB; scripts that mutate files need an exit trap (`loop/stall_trace_lowmem_reaper_2026-11-13.md`; `memwatch_2026-11-13.js`).
- [read] CTest: tests sharing a `RESOURCE_LOCK` "are guaranteed not to run concurrently" (cmake.org prop_test/RESOURCE_LOCK); `-j` without a level uses processors or 2, whichever is larger (cmake.org ctest manual, first 100,000 characters).

**Unresearched:** how other games keep replays valid across patches (versioned rules, or replay on the recorded build); `-j` safety of each suite (GPU, port, file use); the CMU and Fukuchi data's terms are L193's pane to read.

## 4. Calls that are his, or need a ruling

1. **Kept runs that stop replaying.** Gen or chase changes alter old worlds, so a record from build X may not replay on build Y. (a) Add a law version and keep old laws selectable: exact, grows the code. (b) Replay on the recorded build in a scratch worktree by commit: no code change, a build per replay. (c) Only warn on mismatch and keep a few pinned runs with their build: cheapest, honest. [ours] Recommend (c) now, (b) as a tool. The 13-hour plan assumes (a) ("behind the run record's version", `plan_13h_run:150`), but no version field exists.
2. **Run retention.** 20 runs with no pin lets a 285 s run fall out of the folder. Options: pin runs over a time he names; keep 60 and drop under-5-second "left" runs; leave. Cost of a larger keep: about 0.7 MB per 4 minutes of `.dzr` (`p-l162-runs-C:200`), unmeasured.
3. **Textures on a fresh clone.** `assets/` is ignored and made by Blender. Options: commit the baked DDS in LFS (about 4 maps, size unmeasured); keep generating (needs Blender); let the game draw without them. His item 86 says "do all", but the librarian's pick is not on disk for this.
4. **Train strictness.** Merge a batch only when every suite is green, or land green branches and drop the red one (the L194 plan chooses the second, `plan_l194:55-56`). Unclear whether he accepts a batch that lands without a pane watching.

## 5. The build path

**Lap 1 (small, visible to him: a run he played can be trusted and kept).** All in `game/world/`.
- Files: `run_record.{h,cpp}`, `main.cpp`, `game/tests/run_record_tests.cpp`, one small committed fixture (`game/tests/fixtures/run-fixture.{txt,dzr}`), `CHANGELOG.md`.
- Steps: add `record_format = 1` to the text; on replay print a loud line and exit code 3 when `record.build` differs from `DZ_BUILD_COMMIT` and the fingerprints differ; skip "left" runs under 5 s; add `pinned` (a file the player can mark, or auto for runs over 180 s).
- Red first: (a) a fixture record with its build changed reads "build differs"; (b) 30 runs incl. 6 short ones keep the 20 longest and never prune a pinned one; (c) an old text with no `record_format` still reads. Green after.
- Bar: all 11 suites, both self-tests, `dz-world --replay-run` on the fixture exits 0.

**Lap 2: landing train step 1 (L194).** `build.bat`, `tests/CMakeLists.txt` (`RESOURCE_LOCK` where two suites share a file or the GPU, `PROCESSORS`), `HANDOFF.md`. Red first: a row that lists suites with a fixed path or port (a grep test); then the same 11 pass under `ctest -j 4` with counts unchanged and both self-tests green. Record wall time before and after (reported only).

**Lap 3: the train script (L194 steps 2 and 3).** `tools/train/` (or `consonance/tools/`), READY list, own worktree, exit trap. Red first: the plan's four tests (red branch in three, conflict, stand-in game process, killed train; `plan_l194:67-71`). It must also refuse to promote while `dzrunning.cmd` reports a game.

**Lap 4: the drop harness to green (L189).** Rebase `l189-drops` onto main, run the 24 seeds, report each class, fix in `gen/` (`plan_l189`). Add the harness to a suite (`gen/tests/drop_tests.cpp`) and a fixed seed block.

**Lap 5: the motion yardstick (L193).** `tools/yardstick/` outside the shipped game; BVH/ASF reader and forward kinematics; first test: a clip scored against itself reads 0, and with arms pinned reads large (`plan_l193:28-31`). Stands on E's `skeleton` branch, so it waits for L185's landing.

**Lap 6: seed sweeps as rows.** Run the replay, drop and exploit sweeps weekly on D; render noise and frame cost (item 63) stay D's, as timing runs.

## 6. Connections

| key | needs from this | gets from this |
|---|---|---|
| run_frame | replay version and fixture, so the run's length and overtime stay replayable | run records, `PlayParams` |
| chase_entities | pinned runs, sweeps, bots as exploit finders | a record of exploits |
| entity_bodies | yardstick, Jolt pin (item 158) | nothing back |
| player_body | yardstick for first-person | landing train |
| movement | `.dzr` and the fingerprint's hash list | tests |
| abilities | any new sim state must join the fingerprint behind a flag (ladder precedent) | replays |
| stress | meta state needs a save format with version | `textfile` atomic writes |
| meta_loop | saves beyond best_times; a save version | persistence |
| waking_room | frame cost per new set | bench |
| world_gen | drop harness, seed sweeps | `l189` |
| look_fear | frame cost budget, noise item 63 | bench |
| sound | none | none |
| story_lore | none | none |
| frontdoor_onboarding | fresh-clone texture and LFS route | install checks |

## 7. Where it is going

- A versioned save for the meta loop (XP, memory containers, outfits) next to the run record; cloud-free.
- Ghosts and the practice course use the same `.dzr`.
- A nightly sweep trio (replays, drops, exploits) with a memory gate (`memwatch`).

- Texture and model packs by LFS or a first-run bake.

## 8. Not verified

- No replay, build, test or suite was run. All timing figures are the hand-backs'.
- Whether every kept run in `game/runs` still replays on main: not run.
- Cross-machine determinism of colour and bot code: not tested.
- Parallel safety of the 11 suites: inferred from temp-path naming (`game/tests/*:30-43`), not run.
- The textures' size and the fresh-clone route: not measured.
- The CMU and Figshare licences: not read (L193's pane reads them).
- The ctest manual's resource-allocation section: not read (offset 100,000 onward).
- Items skipped: none.

## Verification (second reader, 2026-11-13)

Game repo read at 04f3882 (matches the header).

- (a) [his N] quotes, items 5, 9, 35, 63, 64, 83, 86, 91, 122, 126, 133, 158, 165, 179: ok, each phrase found verbatim (whitespace-joined across wrapped lines) under that item number in `briefs/dreamzone2_the_game.md`.
- (a) Item 148/149: the quote "did i some how loop back" is verbatim under item 148 (line 1089); item 149 (line 1097) does not contain it. The table row groups them, so it is not strictly WRONG, but the quote belongs to 148 only.
- (a) Item 126 and 133 descriptions "void death on a floor", "cleared to run": ok on the quotes; the paraphrase column was not checked further.
- (b) `core/time.h:9` kTickHz = 240: ok.
- (b) `docs/ARCHITECTURE.md:55` (deterministic principle) and `:57` (2.78 ms budget): ok. Note :57 is "360 fps is a hard budget"; the doc's "Architecture principle 3" at :55 is correct.
- (b) `CMakeLists.txt:19-20` /fp:precise, `third_party/CMakeLists.txt:6` Jolt no FMA/fast-math, `core/det_math.h:1-7`: ok.
- (b) `sim/world.cpp:1132-1155` fingerprint and `:1142` ladder: ok (the ladder comment is on :1142, the `if (ladder_used)` on :1143).
- (b) `chase/bots.cpp:383` std::acos and `gen/src/biome.cpp:29-34` pow/log: ok.
- (b) `sim/replay.cpp:11,37,68`: partly WRONG. Magic "DZRP" is at :10 (kMagic), kVersion :11, kTickBytes :12; :37 is `put kVersion`, not the magic; :68 is the version-mismatch error, not a "final hash". Substance (magic DZRP, version 1, 12 bytes a tick) is true.
- (b) `run_record.cpp:101-120` has no format or law version: ok. `:106` build line: ok. `:281` replay_run: ok. `:259` prune loop: ok. `run_record.h:35` kRunsKept = 20: ok. `main.cpp:310-330` and no build comparison: ok (exit 0 only if error empty and `replay.same`; note it checks one `same` flag, the doc says "both fingerprints", not confirmed here).
- (b) `tests/CMakeLists.txt:6-11` "11 ctest suites registered": WRONG citation. Those lines are the `dz_add_tests` function. The 11 registrations are in `audio/`, `chase/`, `core/`, `game/` (two: game_tests, world_app_tests), `gen/` (two), `model/`, `nav/`, `sim/`, `world/` CMakeLists; I counted 11 `dz_add_tests(` calls there, so the count is ok.
- (b) `build.bat:29` serial `ctest --test-dir build`: ok (no -j on that line).
- (b) `.gitattributes:2` as the LFS rule: WRONG. Line 2 is `*.bat text eol=crlf`; the LFS rule `content/models/*.glb filter=lfs` is line 3. `.gitignore:12` `assets/`: ok.
- (b) `game/textfile.cpp:56-68` tmp then rename with .bak: ok. `launch.ps1:26,90` stamp: ok.
- (b) `game/runs` claim "6 of 20 runs are 'left' after under 2 s": WRONG. 20 `.txt` runs exist, but only 4 say "left the run" (0.91, 1.62, 0.56, 0.39 s), read with grep of the `result` lines. The lap-1 test fixture ("30 runs incl. 6 short ones") rests on the same number but is the doc's own design, not a claim. Also run-20261112-080329 (item 148's run) is still on disk, so only "runs behind 64, 91, 126" being pruned is plausible; 64/91 are dated 11-11 and are absent; 126 not checked.
- (b) `game/runs/best_times` brutal 312.57: ok (`game/config/best_times.txt`).
- (b) Room citations: WRONG line numbers. `p-l162-runs-C_2026-11-11.md` has 121 lines but is cited at `:199` and `:200`. `plan_l194_landing_train_2026-11-13.md` has 34 lines but is cited at `:55-56` and `:67-71`. `plan_13h_run_2026-11-13.md` has 93 lines but is cited at `:124-132` and `:150`; the "behind the run record's version" sentence is actually at line 62. `p-d663-hold-E_2026-11-11.md` has 145 lines but is cited `:136-264`. The wrong anchors are unusable for the build steps that lean on them (laps 2 and 3, decision 1). Other path:line cites in sections 2 and 3 were not individually opened (could not check, budget).
- (c) cmake.org prop_test/RESOURCE_LOCK "guaranteed not to run concurrently": ok, re-read.
- (c) cmake.org ctest manual `-j` omitted level = processors or 2, whichever is larger: ok, re-read in the first 100,000 characters. Licence not stated in the doc and none is needed for these. Only these two outside sources are cited; nothing else to re-open.
- (d) Marked [read] without source: none found among the outside sources; the "[read: ls and grep of game/runs]" mark on gap 3 is a local read but its figure (6 of 20) is wrong, see above.
- (e) Coverage of 5, 9, 35, 63, 64, 83, 86, 91, 122, 126, 133, 148, 149, 158, 165, 179: all appear in the section 1 table. The doc says "Items skipped: none", which is correct by presence. Items 9, 122, 133 and 165 get one row each but little follow-through in the build path; that is a depth issue, not a skip.

Totals: 36 checks, 21 ok, 6 WRONG (sim/replay.cpp lines; tests/CMakeLists.txt cite; .gitattributes line; 6-of-20 "left" count; four room-file line numbers; 148/149 quote split counted partial), 9 could not check or partial.
