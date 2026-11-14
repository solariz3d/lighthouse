# p-m1-root-law-A: the hunter's grip root is built behind its switch (OFF); five rows printed, two registered falsifiers fired

Pane A on D (Opus 5.5), ledger D676, packet `loop/packet_m1_root_law_A_2026-11-14.md` (read whole) and the chair's addition of 11:19
(process list before every build or run; wait while his game runs; never close it). Written 2026-11-14 ~11:5x local. Every state claim
is `checked:` (with its file or command) or `inferred:`. Evidence: `p-m1-root-law-A_2026-11-14_evidence/` (`SHA256SUMS.txt`).

## The result in seven lines
1. **Step 0 done: his play clone is at `e091beb`, built, and the launch check says "up to date" (exit 0). Nothing was launched.**
2. **The law was registered before code** (`…_evidence/law.md`, lighthouse `29bdc58b`, corrected `39eb7b34` before any code).
3. **Built on dreamzone-3 branch `a-m1-root`, off `e091beb`: `b53be0f` (switch, rows, a stub, red) and `96d0336` (the law).** Not pushed.
   The switch `root_law` is OFF by default; only the hunter's body can raise it.
4. **R2 HELD:** with the switch off, the 12-seed md5 is main's (`fa938de4…`) and each of D's 20 kept runs replays to the same fingerprints
   on the branch as on main. R3 and R4 HELD.
5. **R1 FIRED on one of its two variants:** sideways acceleration never above grip (9.81) in both, but told to keep 9 m/s the turn rate
   stepped 0.1043 rad/s in a tick against the registered 0.1. The cause is in my own law (below).
6. **The law's own falsifier FIRED:** head-on wall hits on the ten L170 corner routes are 9 against today's 6 (bar 7.5). The mechanism is
   read (one corner, one contact of 7 ticks): the planner did not brake for the corner, and grip could not turn the hunter in time.
7. **R5 reported:** at normal, flee never caught 58 off and 55 on, Line median 32.0 s and 39.8 s; at brutal, 2 and 1, 24.8 s and 25.2 s.

**My reading, which the packet allows me to give: the law is right about the BODY and does not yet suit the GAME.** The grip limit and a
heading that is its travel do what was asked: no re-point (0.000000 rad), no sideways acceleration over grip, every route walked, the
SLIP route included. But at today's corner room (0.9 m) the planner reads a sharp corner too late, and a body that truly cannot turn
faster than grip then meets the wall, where today's body turned at up to 3 g and did not. **Do not switch it on as it is.** The next
input to change is the planner's reading of the corner (where to brake, how much room), not μ.

## Step 0, his play build (tier: check it)
- checked (`git rev-parse HEAD`, `git status --short | wc -l` in `Desktop\dreamzone-3`, 11:13): `31d1c6df…`, 0 lines; `git merge --ff-only
  origin/main` → `e091beb396885c0977893893eb130943857cdaf4` (60 commits), 0 lines after; no change under `third_party` in the range.
- checked (`…_evidence/playbuild.out`): `heavy-run.js --status` printed in the same run (no hold, both slots free); `tasklist` had no
  dz-world, dz-gym or acs; `build.bat` exit 0; `build\launch.stamp` written as `launch.ps1` writes it (stamped with the build's start,
  2026-11-14T17:14:14Z). `build/game/generated/build_commit.h` names `e091beb3…`.
- checked: `powershell -File launch.ps1 world -Check` printed **`up to date`**, **exit 0**. Note: `-Check` exits 0 in both cases
  (`launch.ps1:60-63`), so the printed line is the reading. Nothing was launched; the game was not running at any check.
- **Correction, mine:** my first build script lost its backslashes in the shell and its spawn failed in 0 s with nothing written; the
  second wrote the stamp. Neither touched anything but `build\`.

## The law (registered before code; as built)
`…_evidence/law.md` is the registration; `chase/SPEED_MODEL.md` "M1" (in `96d0336`) is the account in the game's repository. In short:
the acceleration it asks for takes its velocity to `want` along its aim in 0.08 s; it gets the forward part within its acceleration
and braking and the sideways part as a turn rate no more than `min(turn_slow, grip_mu g / max(s, 0.5))`, eased in over 0.08 s; its
heading is its travel; a corner's speed is `sqrt(grip_mu g R)` on today's corner room. With the switch on the hunter stops using the
facing-away cap, the rate-limited heading, the turn drag and `corner_speed`/`speed_for_radius` (line numbers at e091beb and at
99b6045 in law.md). It carries `acc_lat` and `acc_fwd` (walls included) for C's B1 lean, and `root_ticks`.
- **Correction, mine:** the first commit of law.md (`29bdc58b`) said the packet's 99b6045 line numbers "still match" e091beb. I wrote that
  before grepping; they do not. `39eb7b34` gives both, before any code was written.

## The five rows (and the law's own falsifier), red first
All runs under the lock, BelowNormal, hidden, with the process list read before every step (the chair's 11:19 addition; from 11:27
my runner waits while dz-world, dz-gym or acs is running; it never had to).

**Red, against a stub that was TODAY'S turning rule** (`b53be0f`; checked `…_evidence/red_rows_stub.txt`): 5 rows, 4 failed.
R1: peak sideways **31.10 m/s²** (grip 9.81), turn-rate step **0.1800** rad/s a tick (told 9 m/s); 12.58 m/s² and 0.2385 (told 5.42).
Today's rule holds a 3 m arc at 9 m/s within 0.10 m by turning at 3.2 g. R3, R4 and the wall row failed on a switch that reached nothing
(root ticks 0; the chase fingerprint with it on equal to off). The off-by-default row passed.

**On the law** (`96d0336`; checked `…_evidence/green_rows.txt`; the whole `chase_tests` in `branch_chase_tests.txt`: **83 tests, 2
failed**, the two below; the 78 that were there before are green):

| row | registered | read | verdict |
|---|---|---|---|
| R1, told 9 m/s | sideways ≤ 9.81·1.0001; turn-rate step ≤ 0.1 rad/s a tick; re-point ≤ 1e-4 rad | peak sideways **9.81**; step **0.1043**; re-point **0.000000**; widest off the path 0.78 m; slowest 2.64 m/s; through | **FIRED (the step)** |
| R1, told 5.42 m/s | the same, and within 0.5 m of the arc | 9.81; **0.0960**; 0.000000; widest **0.08 m**; slowest 5.22 m/s; through | held |
| R2 | 12-seed md5 = main's; kept runs as on main | below | **held** |
| R3 | every route walked today is walked; the SLIP route too | today 10, grip root **10 of 10**; slip 3 stopped on 1 (route 8), grip root walked it; root ticks 19696 | **held** |
| R4 | same run twice, same fingerprints, not the old chase | seed 5, flee, normal, 90 s: chase `284a8cc0b6e07574` twice, sim `8676d99089dd7fe1` twice; off `8a76f88756bd4716` | **held** |
| off by default | `root_law` 0; only 0 or 1; make_body never raises it | as registered | held |
| the law's falsifier | head-on wall hits ≤ 1.25 × today's on the ten routes | today **6**, grip root **9** (bar 7.50) | **FIRED** |

**R1's step, the cause (checked by reading my own `root_tick`; the figure inferred from it):** the turn rate eases at
`ω_max(s) / 0.08 s`, and `ω_max = grip_mu g / s` grows as the body slows. The registered bar (0.1 rad/s a tick) was derived at 9 m/s
(0.057 there); told to keep 9 m/s into a 3 m corner, the body braked to 2.64 m/s, where its own ease allows about 0.19. So my law and my
bar disagree below about 5 m/s. **Neither is moved here.** The two honest ways out are the room's: re-register the bar per speed (it was a
9 m/s figure), or cap the turn's angular acceleration in the law (which also makes the hunter slower to start turning when standing).

**The wall falsifier, the mechanism** (scratch diagnostic, never committed: `…_evidence/diag_m1.cpp.txt`, its output
`diag_route0.txt`). Route 0 with the root: **the 7 "hits" are one contact**, 7 consecutive ticks from 4.112 to 4.138 s (the chase's
`wall_hits` counts head-on ticks, the unit the bar was registered in). In the half second before, the hunter was at 8.82 m/s with the next
point reading a 10° turn (legs 2.70 m and 0.30 m), so the planner asked for no braking; it then turned at grip (sideways −9.8 m/s²) while
braking 8.75 → 5.65 m/s, and met the wall. `inferred:` at 8.8 m/s grip's radius is about 7.9 m, so the corner the path rounds beyond that
point could not be made. The planner's corner reading (D665's 3 m sum and today's 0.9 m room) is what failed, and law.md named it in
advance as the thing this law does not fix. Today's route 7 (6 hits) became 0 with the root, route 8 0 → 2.

## R2, off means off
- **The 12-seed md5, re-measured on today's main first:** `dz-chase sweep --seeds 12 --first 1 --levels 1 --policies line,flee,cutback
  --max 300 --threads 2`, the lines from "survival, seconds" to "where chasers caught": **main `e091beb`: `fa938de45995bd2d13b98ba28fae0c34`
  (22 lines); the branch (`96d0336`, switch off): `fa938de45995bd2d13b98ba28fae0c34` (22 lines).** checked: `…_evidence/base_sweep12.txt`,
  `branch_sweep12.txt`. L's value of last night stands at today's main.
- **The kept runs: his 20 kept runs are on L, not here.** D's `game/runs` holds 20 of his D runs (copied read-only to scratch), so those are
  what D can replay. **On plain main `e091beb` 18 of the 20 replay to their records and 2 do not** (`run-20261112-202912`,
  `run-20261112-202937`, both recorded at build `cab3530`; the third `cab3530` run replays). So "20 of 20" cannot hold on D for a reason
  that is main's. **What I checked instead: every one of the 20 replays to the same two fingerprints on the branch as on main** (the scratch
  `replay_check` now prints them). checked: `diff` of `…_evidence/base_replays2.txt` and `branch_replays.txt`: identical; 18 SAME, 2
  DIFFERENT in both. `inferred:` the two `cab3530` runs predate the record's `[speed]` section and some later change moved them; not
  chased here.

## R5, reported (not a bar), beside his 52 and 62
96 seeds, policies line, flee, cutback; normal `--levels 1 --max 300`, brutal `--levels 3 --max 600`; `--speed "root_law=1"` for on.
checked: `…_evidence/r5_normal_off.txt`, `r5_normal_on.txt`, `r5_brutal_off.txt`, `r5_brutal_on.txt`.

| | flee never caught | flee median | Line median | cutback median | cutback/Line paired |
|---|---|---|---|---|---|
| normal, off (today's main) | **58** | 300.0 s | 32.0 s | 35.1 s | 1.03 |
| normal, on | **55** | 300.0 s | 39.8 s | 35.2 s | 1.01 |
| brutal, off | 2 | 186.4 s | 24.8 s | 28.4 s | 1.01 |
| brutal, on | 1 | 141.6 s | 25.2 s | 31.7 s | 1.04 |

- His 52 and 62 are D665's flee-never-caught counts at normal (`p-d665s1-rows-A_2026-11-11.md`, the 96-seed table: 52 before the
  whole-corner braking, 62 after). **Today's main reads 58.**
- With the root, the Line runner lives longer at normal (+24 %) and the hunter's share of the catches falls at brutal flee (74 % → 29 %,
  the lesser chasers taking more). checked: the "what ended the runs" tables in the same files. `inferred:` a hunter that brakes for grip
  is slower through corners; nothing here is tuned toward either number.

## For his eye
- **The seed-1 trace, beside tonight's seven:** `dz-chase run --policy line --level 3 --seed 1 --max 60 --image`, root off and on, on
  the branch. **Off: caught by the hunter after 23.6 s** (the same as L's control); **on: caught after 40.7 s.** The pictures are kept out
  of the repository (7.7 MB): `G:\consonance-scratch\m1_traces\trace_seed1_line_brutal_root_off.png` (sha256 `4a4169ea…`) and
  `…_root_on.png` (sha256 `410fd0ab…`); the run texts are `…_evidence/trace_off.txt`, `trace_on.txt`. **Not added to his page**: that
  artifact is the laptop seat's.
- **One corner filmed from outside and from the look-behind: NOT DONE.** `dz-world --chase-speed` is refused with an offscreen mode
  (L211, CHANGELOG), so the game cannot film the new root without a change outside this lap's files; and the game was his on D today.
  `inferred:` the smallest way is to let the offscreen chase modes take `--chase-speed`; one argument check in `main.cpp`.
- **The line that starts a live play with the new root on**, on a build of `a-m1-root` (NOT on his clone at `e091beb`, which does not
  know `root_law` and would refuse it with exit 2):
  `powershell -NoProfile -ExecutionPolicy Bypass -File launch.ps1 world --chase-speed "root_law=1"`
  (and `"root_law=1;grip_mu=1.3"` for the cheetah's lower bound). `inferred:` from L211's argument and `launch.ps1:94-95`; not run.

## What is where
- dreamzone-3 `a-m1-root` (worktree `G:\consonance-scratch\a-m1-dz3`): `b53be0f`, `96d0336`; **not pushed**. One uncommitted scratch edit
  in `game/CMakeLists.txt` (the `replay_check` target, for R2), never to be committed; a second scratch worktree `G:\consonance-scratch\
  a-m1-base` (detached at e091beb, the same edit) for main's measurements.
- lighthouse `a-m1-lh` (worktree `Desktop\worktrees\a-m1-lh`): law.md and this hand-back.
- His clone: `e091beb`, clean, built, stamped; untouched since.

## Not in this lap
M2 to M5; `game/config/world.local.txt` (his; not opened for writing); the corner-room lap (stopped by the plan).
