# p-lookback-residue: the look back, what was left — both faults reproduced and fixed; ONE SUITE RED needs a ruling (pane O), 2026-11-15

Packet: `exo_memory/loop/packet_lookback_residue_C_2026-11-15.md` (git-blob bed94c9d), given to O by the chair's D677 order of 12:13Z. His item 232. Tier: check it, with one row where it touches the run. Seat: pane O (sibling-36313935), on D.

## THE BRANCH: dreamzone-3 `look-residue-o` at **26830ba614459d3826d9515cf7f0183addd012cd**, pushed, NOT landed (B lands)
- On main 48ad21d. Worktree `G:\consonance-scratch\dz3-o-look`.
- **The commits:**
  - **f9aa201:** the seam fix, its row and the CHANGELOG entry;
  - **01746da:** the border fix and its CHANGELOG entry;
  - **26830ba:** the row's comment in plain words (comment only).
- checked: `git ls-remote origin refs/heads/look-residue-o` → 26830ba6….
- **THE PUSH GATE DID NOT SCAN IT:** its row (13:39:15Z, my seat) reads `"decision":"allow-error"`, `"error":"not a git repo"`, `"dir":"…\sibling-36313935\$T"`.
  - It read my command's `cd $T` before the shell expanded it. My fault, the same class as the `$b` of 11-14: literal paths in a push, always.
  - **The gate fails open on that error.** That is for its owner: a push gate should fail closed.
  - **My own scan covered the range just before:** checked: A's `rangescan.js` over `48ad21d..26830ba` → 3 commits, 78 added lines, total 0; `credwhere.js` → 0; the d528 list → none; my own terms → 0.

## THE LINE THE CHAIR ASKED FOR (what moves the look back today)
- **The glance's camera is the OLD first-person path, not the new generator:**
  - the glance is eased in `Shell::advance` (`game/shell.cpp:163-172`);
  - the view is `Shell::view` (`game/shell.cpp:188-203`), from `CameraRig::at` (`game/camera.h:71`) plus `glance_eye_offset` (`game/body.cpp:167`).
- **The slow-down was the simulation's mover,** not the animation: Jolt's `CharacterVirtual` move (`sim/physics.cpp:468`) and the read-back after it (`sim/world.cpp:1066-1078`), which this lap fixes.

## 1. THE SLOW-DOWN: it is on the SIMULATION's clock, at the floor's seams, and not the glance
- **The record cannot show where he looked back.** V is not a simulation input (`sim/input.h:19-27`: move, buttons, yaw and pitch). With B's fix, the mouse during a glance turns the view only, so the recorded aim does not move either. **So "his own look back" cannot be found in run 120644.** I staged one in it (below).
- **The simulation, his run tick by tick.** A temporary `--replay-run` dump, never committed (`G:\consonance-scratch\o-look\o-look.js`), on copies of his `.txt` and `.dzr` on G:.
  - checked: → the replay "the same run to the bit" (both fingerprints match); `ticks.csv`, 41,736 ticks.
  - checked: `dips.js` → **95 one-tick losses of 30% or more of the speed from 5 m/s on the ground; 86 of them with the player RISING 1.4 to 4.9 mm** (median 2.2), a **median 63%** of the speed gone in one tick.
  - **An example:** tick 5315, 22.146 s, 10.000 m/s down to 3.091, then back by about 0.33 m/s a tick (the run's own ground acceleration) over 0.12 s.
  - checked: `inputs.js` on his `.dzr` → **his inputs did not change**: full forward, sprint held, the same yaw and pitch through the dip.
  - **Where:** on straights, about every 1 to 2 s, where the body's front (0.45 m ahead) meets a whole-metre line. For example, going +x at x 17.55 the line is 18.0; going −x at −14.548 it is −15.0.
- **The cause** (`sim/world.cpp:1070-1078`): a contact the body ran into takes away the velocity into it, except a step up, which counted **only above 5 mm** (`res.position.y > before.y + 0.005f`).
  - The generator's floors meet at seams **1.4 to 4.9 mm** high, so every lip's face was read as a wall.
  - Jolt carried the body over almost undisturbed (17.5101 to 17.5496 that tick, against 0.0417 asked); our read-back took the speed.
- **The picture's clock: no glance-tied slow-down.** A temporary `--bench` with a glance staged every 3 s and every frame's times dumped (`frames.js`, `S`=`G:\consonance-scratch\o-look`). Relative only: other seats' runs were on the machine.
  - checked: → the swing in, hold and swing out average the same CPU and GPU time as the 90 frames before each glance. The worst frames are scattered through all parts. No chunk was built during any glance.
- **So: the simulation shows it, the frames do not, and it is not the glance.**
  - inferred: it happens looking forward too. Looking back shows it most: the world falls away behind and a stutter in that is easy to see.
- **THE FIX** (f9aa201, `sim/world.cpp`, `MoveResult::wall_heights` in `sim/physics.h`/`.cpp`): a face counts as a riser and keeps the speed when:
  - it is met no higher than `step_height` above the feet (Jolt's contact `mPosition`);
  - the body is following the ground;
  - the body went on at least half the way its velocity asked.
  - A face the body does not get past still takes the speed.
- **THE ROW, red first** (`sim/tests/collision_tests.cpp`, `a_floor_seam_a_few_millimetres_high_is_run_over_at_a_sprint_without_losing_speed`; a seam 2 mm and 4 mm high; the speed never below 95%):
  - checked: on main's code → **FAIL**, only at `lowest >= 0.95f * before`, both seams. The body still crossed, rose to the lip and stayed on the ground.
  - checked: with the fix → **ok**.
  - checked: `sim_tests` whole → **155 tests, 0 failed** (the thin walls at 14, 30 and 90 m/s and both stairs rows among them).
- **On his run:** checked: his inputs through the fixed sim, first 25.04 s (after that his recorded steering no longer fits the faster run) → **main 8 losses (8 of 8 with the rise); the fix 0**. The one loss left, at 22.775 s with no rise and a heading of 140°, is a real wall on the parted path.
- **HIS KEPT RUNS FROM BEFORE NOW REPLAY DIFFERENTLY,** from the first seam on.
  - checked: run 120644 through the fix → "NOT the same run: the fingerprints differ" (caught at 25.04 s; recorded 173.90 s).
  - **That is every kept run of his,** and every seat's "the same to the bit" check on them (B's seven) goes red against this branch.
  - **The chair's 12:13Z order said a fix to his faults lands without a switch, so I made none.** The packet (:32-33) asked for the old way behind a switch, so its kept runs replay. **Which way it lands is a ruling**, and I flag it.

## 2. THE BORDER: new picture at every edge while looking back, now smoothed as its noise asks
- **The film:** `--capture-fpburst` on my copy of his run, which plays it with his own `[world]` (`light_filter = 3`, kernel 3), in a worktree at main without the sim fix (`G:\consonance-scratch\dz3-o-border`), so the path stays his.
  - C's `glance.js` (temporary, never committed) stages a look back at 4.17 s, inside his first steady sprint: 0 to the full glance in 18 frames, then held to 48.
- **Measured frame by frame** with C's grain measure (`border.js`: each pixel's luma against its 8 neighbours; the outer 10% bands against the middle 50%):
  - checked: main, the glance burst → **the right edge rises to 3.19 (three times the middle) in the swing** (frames 7-17).
  - **Through the HELD look back** (frames 18-47) the edges stay at **1.46 to 1.76 times the middle**, the left one worst. The burst's mean is 1.50.
- **Why:** looking back while running forward, the camera moves away from what it sees, so the picture recedes and **new picture enters at every edge each frame** with no history.
  - Running forward it is the other way: edge pixels come from inside and carry history (C's sprint: about 1.0).
  - The filter (`FilterCS`, `dz.hlsl`) treated those pixels as settled: a strict luminance stop (`:672`), a 3x3 noise estimate from equally young neighbours (`:652`), and about 7 px of reach at kernel 3.
- **The fix** (01746da, `FilterCS`): a pixel with under four frames of lighting (`Tex2[px].a`):
  - has its noise estimate raised by 4/frames;
  - takes the 5x5 kernel whatever the kernel asked for.
  - Others are as before.
  - checked: **fix 1, the raised estimate alone** → mean 1.24, hold about 1.2-1.36. Not enough, so the kernel was added.
  - checked: **both** (`fp-fix2`) → **burst mean 1.50 to 1.13; the hold 1.10 to 1.20; the swing's edge 3.19 to 1.37.**
  - checked: his sprint, slide and 126° turn bursts on the same run → the middle within 0.03 of main's; the edges 0.95/0.84/0.96 to 0.91/0.83/0.78.
- **The cost** (`ab.js`: `--bench` 20 s, glance every 3 s, A = before, B = with the fix, A B A B in one slot, the same `--config`, RTX 5080; the machine near quiet, GPU avg 1.1 ms):
  - checked: whole-run GPU avg A 1.133 / 1.126 ms against B 1.226 / 1.226 → **+0.1 ms a frame**.
  - The swing in: 1.127/1.119 against 1.335/1.336 → **+0.21 ms**. The hold: +0.10.
  - p99: 1.45-1.63 ms both ways, inside the 2.78 ms of a 360 Hz frame.

## THE FILM, for his eye: `C:\Users\nname\Downloads\dreamzone-3-lookback-residue\`
- `lookback_120644_144fps.mp4` (real speed) and `…_48fps.mp4` (three times slower): the game today left, the fix right, side by side.
- The 48 frames of the staged look back in his run, plus a README in plain words, including that the look back is staged and why.
- **Registered: it failed on his terms if called fixed while his eye still sees it.** His eye is the judge.

## THE ONE RED: `world_app_tests`, the hunter's lean row — the seam fix's OWN red, through the chase
- checked: `build.bat test` on 01746da (`G:\consonance-scratch\o-look-suite\build-test.out`) → **exit 1**: 13 of 14 suites pass.
  - `world_app_tests` fails **one** row: `the_hunters_drawn_lean_eases_into_a_turn_and_does_not_rock_on_a_straight`, `CHECK failed: hold >= 8` (`world_app_tests.cpp:1093`).
- checked: `dz-world --selftest` → exit 0, **64 of 64**. checked: `dz-gym --selftest` → exit 0, **26 of 26**.
- **The row's 8-of-24 form, compared, each run alone:**
  - checked: main 48ad21d → **13 of 24** draws hold 300 degrees a second; worst 425.0; exit 0;
  - checked: my branch → **7 of 24**; worst 475.8 (the ceiling is 600); FAIL (twice, so deterministic).
- **Why:** the flee bot runs through the same mover. With the seam fix it no longer loses its speed at the seams, so the hunter chases a faster runner, turns harder, and its drawn lean turns faster more often.
  - The row's own comment (`:1068-1078`) says its form sits near its edge ("any change to the world's geometry flipped it").
  - The bar is his ruling 157; the 8-of-24 form is the chair's and the librarian's registration. **I have not touched either.**
- **FOR A RULING, two calls:**
  1. land with the seam fix as is (and the row's form re-judged by whoever owns it), or the seam fix behind a switch;
  2. what his kept runs' replays should do.
  - **The border fix does not touch this row.** inferred: the row reads the chase's drawn lean from the simulation and the chase, not the lighting filter. A run of the row with the border fix alone was not made.

## Corrections, mine
- **A build that never built:** my first build call from Git Bash passed `cmd.exe /c`. Bash rewrote `/c` into a path, so cmd opened and closed ("exit 0") with nothing built. I had recorded that very pitfall on 11-13 (`//c`). Caught by checking the exe's time before using it.
- **A runner that threw:** my first ab-style runner of the lock lap (D677 earlier tonight) called `run()` with the wrong arguments. Different packet, same lesson.
- **His words in a comment:** the row's first comment quoted his item 232. It is now in plain words (26830ba); the item number stays, as the room's practice keeps it.
- **The push gate unscanned** (above). My own scan covered the range.

## Not done
- **The lock lap** (lighthouse idle-pulse-p) waits, as ordered: ranges 21-129, cargo, the landing.
- **The temporary instruments** (`o-look.js`, C's `glance.js`) were never committed. They are undone in `dz3-o-look` (status clean). `dz3-o-border` still carries them: a detached scratch tree, left in place.

`S` = `G:\consonance-scratch\o-look`.

BASE: G:\consonance-scratch\dz3-o-look 48ad21d
SOURCES: G:\consonance-scratch\o-look\ticks-main.csv
SOURCES: G:\consonance-scratch\o-look\ticks-fix.csv
SOURCES: G:\consonance-scratch\o-look\row-red.out
SOURCES: G:\consonance-scratch\o-look\sim-all.out
SOURCES: G:\consonance-scratch\o-look\frames-A1.csv
SOURCES: G:\consonance-scratch\o-look\lean-main.out
SOURCES: G:\consonance-scratch\o-look-suite\build-test.out
SOURCES: C:\Consonance\data\push-gate.jsonl
NEXT: librarian rule the seam fix's landing (switch or not; the lean row's form; his kept runs' replays) when this is read; B lands look-residue-o on that ruling; O goes back to the lock lap

## AS RULED (the packet's "RULED" section, git-blob 87d2c733): the two changes, pushed — look-residue-o at **59d4a2272bb8c178cf8e8fa6847b55d6d88ff0b4**
- **1. The seam fix is the default; one parameter keeps kept runs replaying.**
  - `riser_keeps_speed` is in `DZ_MOVE_PARAMS` (`sim/params.h`), 1 by default. `sim/world.cpp` applies the rule only when it is 1.
  - `read_run` (`game/world/run_record.cpp`) reads a record that does not name it as 0, the rule it was played with, as `run_length_s` already does for the timer. No key, and nothing in his settings file. New records name it (`write_params` writes every parameter).
  - **The row** (`run_record_tests.cpp`, `a_run_recorded_before_the_seam_fix_replays_to_its_fingerprints_and_one_recorded_after_names_the_parameter`):
    - checked: **red first**, with the reader's line taken out (`G:\consonance-scratch\o-look\prow-red.out`): `rb.params.riser_keeps_speed == 0.0f` failed and **`old_again.same` failed** (the old run did not replay), and the control's two checks failed too.
    - checked: with it back → **ok** (`prow-green.out`).
    - The control in the row (a new run with its line struck parts from its fingerprints) shows the runs meet seams, so the replay is not a vacuous pass.
- **2. The old lean row's 8-of-24 form is a REPORT, by name** (`world_app_tests.cpp`, an AMENDED comment with the ruling and the reason). Its 600 ceiling and its peak stay checks.
  - Its last count is 7 of 24 (worst 475.8) on 01746da. This commit changes no simulation at the default, so it is unchanged. ctest prints a passing row's output only on failure, so the suite below does not show it.
- **The suite on 59d4a22's tree** (`G:\consonance-scratch\o-look-suite\`):
  - checked: `build.bat test` → **exit 0, "100% tests passed, 0 tests failed out of 14"**;
  - checked: `dz-world --selftest` → **exit 0, 64 of 64**;
  - checked: `dz-gym --selftest` → **exit 0, 26 of 26**.
- **The CHANGELOG entry** now says old runs replay under the parameter, and names the lean row's report.
- **The push:**
  - checked: my own scan of `26830ba..59d4a22` → 1 commit, 91 added lines, total 0; 0 key-shaped; 0 private terms; none of his words.
  - checked: pushed by its literal ref → `26830ba..59d4a22`; push-gate → **allow, src refs/heads/look-residue-o, 14:09:32Z: the gate scanned it this time.**
  - **The earlier push (26830ba) the gate let through unscanned** ("not a git repo", from my `$T`) is named above. Pane P's fail-closed fix rides the lock lap.
