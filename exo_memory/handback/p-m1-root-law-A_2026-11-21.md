# p-m1-root-law-A: the hunter's root law is built behind `root_law` (off); the corner row is green, and the film shows it crawling a tight bend at his grip

Pane A, machine L, 2026-11-21 ~07:00 local, ledger L220 (M1), packets `loop/packet_m1_root_law_A_2026-11-14.md` and `loop/packet_m1_on_L_A_2026-11-21.md`, plan `loop/plan_new_system_2026-11-14.md`. Game tree: `C:\Consonance\dz-wt-m1` (a worktree of dreamzone-3), branch **`m1-root-law`**, base c2af9d9. Nothing landed on the game's main, no release, his play settings file untouched (sha256 begins e065fdad before and after, checked). Marked checked or inferred. The law was registered before any code: `p-m1-root-law-A_2026-11-21_evidence/root_law.md` (room commit 91c6cd50, 05:31:47 local), with the amendments made after code appended to it.

## RESUMED AND FINISHED (2026-11-21 ~07:30 local; this section supersedes the stopped-batch items in WHERE IT STANDS below, which is kept as written)
- **Rebuilt** (heavy-run check, `b.ps1`, build rc 0), then **8 of 8 root rows pass** on 49a1e7b (checked: `root_rows_49a1e7b.txt`, "8 tests, 0 failed"; R1 lean line 0.472 g, old rules 1.666 g; R3 10 of 10 routes on both).
- **Mutants, pass 2 (checked: `mutants_m1_pass2_M10_M11.txt`): applied 2 / caught 2 / NOT APPLIED 0** (M10 the switch reaches every chaser: caught, 1 failed of 8; M11 the fingerprint reads the root fields with the switch off: caught, 1 failed of 8; control 8 rows, 0 failed). Both survivors of pass 1 that were real gaps are now caught. Across both passes: 13 applied, 9 of the 13 caught by their own mutants plus M2 equivalent, M8 still a named gap (a row with a scrape).
- **Full ctest on 49a1e7b, rebuilt first: 14 of 14 suites, 0 failed, 904.17 s (checked: `ctest_all_49a1e7b_utf16.txt`, "100% tests passed, 0 tests failed out of 14"; chase_tests 414.94 s, world_app_tests 904.16 s).** The earlier run (cfa3070, 1,006 s) is superseded. Worktree clean at 49a1e7b; `git status` empty (checked).
- `buildin` is now the rebuilt 49a1e7b build (checked: the ctest rebuilt it after the mutant pass).
- **The lines for him, at grip 1.0 and at 2.0** (not run by me; no window opened; do not run while another `dz-world.exe` is rebuilding):
  - grip 1.0 (the default): `C:Consonancedz-wt-m1uildindz-world.exe --chase-speed "root_law=1"`
  - grip 2.0: `C:Consonancedz-wt-m1uildindz-world.exe --chase-speed "root_law=1;grip_mu=2"`
  - the corner film for both, as measured (checked, in the film section below): lowest speed through the 89-degree, 4.4 m bend 1.29 m/s at 1.0, 2.10 at 1.3, 3.55 at 2.0, against 3.86 on the old rules.
- **Still open, his:** the grip, after he has felt it; and M8 (a scrape row). A second reader (Opus) is routed after this by the chair.

## WHERE IT STANDS (written before the restart; superseded by the section above)
- **Built and committed on `m1-root-law`** (HEAD 49a1e7b): `SpeedModel::root_law` (0 off, 1 on; off until he says so; refused unless 0 or 1), the root law in `chase/chaser.cpp` (`root_move`, `root_corner_speed`, the branches in `step`), the hunter's body only (`run.cpp` `hunter_body`), 8 rows in `chase/tests/root_tests.cpp`. Commits: d29fc2a (switch plumbed, R1 red), 526ce0e (the law), cfa3070 (R3, R4, lean report), 6caf20f, 49a1e7b (wiring and fingerprint rows).
- **Green (checked):** the 8 root rows; the full ctest, **14 of 14 suites, 1,006 s** (run on cfa3070's tree, before the last two rows). **Not rerun on 49a1e7b:** the full ctest (only the 8 root rows were).
- **Not pushed yet** (pushed with this file; the chair's order).
- **A batch was running and is stopped:** `node <scratch>/mutate_m1.js M10,M11` (pass 2 of the M1 mutants). It was killed by me at the chair's order; **the worktree is clean** (`git status` empty; `chaser.cpp` and `run.cpp` restored) but **`build\bin` holds the last mutant's build: rebuild before trusting any binary** (`.\build.bat` under the heavy-run check, one call).
- **To start it again** (scratch is under `C:\Users\zackn\AppData\Local\Temp\claude\...\scratchpad\m1\`; copies of the script are in this file's evidence folder as `mutate_m1.js`, `b.ps1` is two lines: heavy-run check then `.\build.bat`): `node C:\Consonance\lighthouse\consonance\tools\heavy-run.js --status && node mutate_m1.js M10,M11` (the script needs its `b.ps1` beside it; paths inside it are absolute to the old scratch and will need editing if the scratch moved).
- **Next, in order:** (1) rebuild and run `chase_tests.exe root_` (8 rows); (2) rerun M10 and M11 (expected caught now); (3) the full ctest on 49a1e7b; (4) **the keeper's question below before anything is tuned.**

## The result in six lines
1. **R1 held, red first:** a scripted 90 degree corner of 3 m radius on a real mesh, entered at 9 m/s: with the law the sideways acceleration is at most **0.482 g** (bar: grip_mu x g, 1.0 g, +0.05) and the heading rate's per-tick change stays under 0.3 rad/s. **Red on the stub** (`r1_red_stub.txt`: the law ignored, the bound failed) and the old rules pull **1.666 g** through the same corner (row b). Row c (turned a radian off its line at 9 m/s, so the clamp binds) reads 0.9 to 1.05 g.
2. **R2 held:** with the switch off, the 12-seed sweep is identical to c2af9d9's and **20 of 20** of his kept runs replay with both fingerprints. (The first md5 I took, `f31fc73f…`, included the sweep's own wall-clock line, "42 s in all"; without it both sweeps hash to **`ff3174b8b09d5f5e26c1154f77b66e28`**, 41 lines each: my first figure was wrong, corrected.)
3. **R3 held, not red first:** the ten L170 routes (the family where sideways carry stalled one 30 m short): the root law walks **10 of 10** to the end, as the old rules do. The row was green on its first run; there was no red to show (the stall was SLIP's, not the old stepper's).
4. **R4 held:** the corner twice gives the same fingerprint (row); the 24-seed sweep with the law on, twice, hashes the same (`6df8bf3b071735dd3c6af80e01ef1296`).
5. **R5 (reported, not a bar):** below. **R6 (the lean):** below.
6. **The film shows the problem the law was built to cure, in the other direction:** at his grip (1.0) the hunter goes through a real 89 degree, 4.4 m corridor bend at **1.29 m/s** (the old rules: 3.86 m/s). That is close to the stop he names. See "The corner film".

## Registered, and what happened (R1-R6)
| | registered | result |
|---|---|---|
| R1 | the 3 m, 9 m/s corner: sideways pull at most grip x g every tick; the heading's rate continuous; red first | held; red on the stub; 0.482 g, rate step under 0.3; old rules 1.666 g |
| R2 | off means off: the 12-seed md5 and his 20 kept runs, measured BEFORE any edit at c2af9d9 | held: 41-line md5 `ff3174b8…` before and after; 20 of 20 replays before and after |
| R3 | red first: the L170 route that stalled; it arrives | arrives (10 of 10 routes); NOT red first (green on first run) |
| R4 | the same run twice, the same fingerprints | held (row; sweep twice) |
| R5 | never-caught and the Line median, NORMAL and brutal, off and on | below |
| R6 | M1 built on the desktop? | the G1 hand-back's answer was no; M1 is now built, here, on L, on a branch |

## R5 (24 seeds each, `--max 300`, `dz-chase sweep --seeds 24 --first 1 --levels 1,3 --policies line,flee,cutback`, off then `--speed root_law=1`; `r5_off.txt`, `r5_on1.txt`)
| | NORMAL off -> on | brutal off -> on |
|---|---|---|
| Line: median survival, s | 22.3 -> **32.4** | 23.6 -> 21.9 |
| Line: never caught of 24 | 2 -> 1 | 2 -> 2 |
| Flee: median s / never caught | 300 / 15 -> 300 / 17 | 184.4 / 2 -> 181.4 / 4 |
| Cutback: median s | 30.7 -> **41.6** | 35.0 -> **44.2** |
Beside his 52 and 62 as asked; I did not read what those numbers measure (the plan names them, not the figure's source), so no claim about distance to them. 24 seeds, one draw, no interval: a reading, not a bar. The law makes the hunter less deadly in four of the six rows (Line NORMAL 22.3 -> 32.4 s, Cutback both).

## The corner film (the desktop's `--film-corner`, seed 1, one bend of 88.9 degrees, corridor 4.4 m; it runs on L; PNG frames kept in scratch, not committed; manifests and the pose files are in the evidence folder)
| | enters at | lowest through the bend | time between the gates | wall hits |
|---|---|---|---|---|
| old rules | 7.62 m/s | **3.86 m/s** | 0.819 s | 0 |
| root law, grip 1.0 | 6.89 | **1.29** | 1.104 s | 0 |
| root law, grip 1.3 | 7.02 | 2.10 | 0.986 s | 0 |
| root law, grip 2.0 | 7.51 | 3.55 | 0.833 s | 0 |
**What this says (checked as numbers; the reading is inferred):** the law makes the hunter corner as a mass at his stated grip, and at 1.0 g a corridor bend that tight forces a near-stop (1.29 m/s against a 1.2 m/s floor), then a go: the body he names, "stops, repoints, then goes", reappears as a stop and go in speed. The old rules corner at roughly the speed a grip of 2.0 would allow. **So the plan's registered failure line ("he plays it and still names the stop, pivot and go at a corner; then the root law is wrong, not under-tuned") is at risk at grip 1.0, and the grip is a dial, not a law: that is his call to make with his eye, not mine.** Two things I did not do: tune it (M5's work) and look at the frames (the lit and seen PNGs are in scratch; I read the numbers).

## R6: the lean (reported, not a bar; the body code is unchanged)
The lean reads `speed x turn` (`world_app.cpp:838-843`) as its sideways acceleration. Under the root law that product is the law's own: over the R1 corner the lean reads **0.472 g** against the law's own peak of **0.482 g** (the 2% is the tick's speed change); under the old rules it read **1.666 g**. So the lean now follows a real, grip-limited acceleration, not one derived from the path; and `BodyLean`'s own grip cap (`p.grip`) is not what limits it any more. Not seen in a window.

## What was built (the old line and the new line for each rule the hunter stops using when the switch is on; c2af9d9 and `m1-root-law`)
| rule | old line | new |
|---|---|---|
| the corner's speed (`corner_speed` through `speed_for_radius`) | :236-242, used :368 | `root_corner_speed` :253, chosen at :427; sqrt(grip_mu g R), R from the same corner room (0.9 m) |
| the cap while facing away | :412-417 | kept, on the grip's circle, :471-480 (an amendment, see below) |
| the rate-limited heading and its easing | :431-440 | not used: `root_move` :266 sets heading, turn, velocity, speed (branch :488-489) |
| the speed's rise and fall | :444-445 | inside `root_move` (same accel and brake) |
| the turn drag | :449 | not applied (:514) |
| the fingerprint | `hash_into` | adds vel and root_as only with the switch on (:653) |
**Amendments after code, said plainly (appended to the registered page):** (1) the facing-away cap stays under the law on the grip's circle; the registered page said "no cap", which was wrong: the first run orbited an aim point inside the turning circle; (2) the ease is on the heading's rate, not the force; (3) row a's non-vacuity thresholds were set after seeing the law's numbers (> 0.2 g, lowest speed under 6 m/s), not registered; row c was written after the law.
**The plan's failure line 1 ("adds to the old turning rules, or to a switch on them, and no seat says so before code"):** this lap adds a new stepper beside the old one and changes the old rules in no way except to skip or re-read them for the hunter when the new switch is on; said on the registered page before code.

## Mutants (the first pass: `mutants_m1_pass1.txt`; applied 11 / caught 7 / NOT APPLIED 0)
- **Caught:** M1 the grip clamp removed; M3 no ease (the rate may step); M4 grip 3 g; M5 the corner speed the old rule's; M6 the old turning circle; M7 turn drag kept; M9 the switch ignored by the hunter's body.
- **Not caught, and why:** **M2** (the turn it asks for not capped by the grip) is equivalent: the final clamp caps it anyway. **M8** (the heading not taken from the velocity) is equivalent on every row, since none has a wall that changes the velocity's direction: a real gap, named, not closed (it needs a row with a scrape). **M10** (the switch set by `make_body` for every chaser) and **M11** (the fingerprint reads the root fields with the switch off) were real gaps: two rows were written for them (`root_make_body_never_gives_any_chaser_the_law`, `root_with_the_law_off_the_fingerprint_does_not_read_its_state`, commit 49a1e7b). **Their rerun was stopped by the restart**; the rows pass, the mutants are not yet shown caught.

## The line he can paste to play with the law on (not run; no window opened by me)
`C:\Consonance\dz-wt-m1\build\bin\dz-world.exe --chase-speed "root_law=1"` (the switch is the chase's speed model, read by `--chase-speed`, `game/world/main.cpp:110`; `--world` is for world settings and refuses it). With a stronger grip: `--chase-speed "root_law=1;grip_mu=2"`. That exe is this worktree's build of 526ce0e..49a1e7b; **rebuild first** (see WHERE IT STANDS). Do not run it while `dz-world.exe` from main is open if the build is being rewritten.

## For the keeper to decide, in this order
1. **Look at the film, or play with the line above, at grip 1.0 and at 2.0.** The numbers say 1.0 crawls a 90 degree corridor bend. Whether that reads as "the stop" on his terms is his, and it is the plan's failure line.
2. Only after that: M2 (retiring the old rules from the hunter's path) is wasted if the law is wrong; M5 tunes speed, grip and lead.

## Not done
Not red first: row c and R3. Not run: the full ctest on the final commit; a window; the film frames read by eye; M10/M11 rerun; any timing run (none on L, by the packet). Nothing pushed to the game's main; no release.

NEXT: librarian route an Opus second reader for `git diff c2af9d9..m1-root-law` (49a1e7b), and the keeper to the corner film or the paste line at grip 1.0 and 2.0 (his eye is the next test of the law), and a second reader for M1 (`git diff c2af9d9..m1-root-law`, then the mutant rerun M10 and M11), when you collate
BASE: C:\Users\zackn\Downloads\dreamzone-3 49a1e7b
BASE: C:\Consonance\lighthouse 04ada1d9
SOURCES: git log/diff on m1-root-law in dz-wt-m1; chase_tests.exe root_; dz-chase sweep; dz-world --film-corner; the evidence folder beside this file
