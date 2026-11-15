# Hand-back: the look back, built as amended (the view only, a switch to flip), and the seed row's detail line (pane B, D676/D677)

**Packet.** `exo_memory/loop/packet_lookback_hitch_B_2026-11-14.md`, "AMENDED 18:5x" (`:57-64`): ruled without his answer, as a default
he can flip. The seed line is the chair's D677 order of 01:50Z: its own small commit on this branch. Tier: check it, with the one row.
**O lands it; I do not.**

**THE BRANCH: dreamzone-3 `d676-lookback-b` at `07fe969667a2763ed5749b185e29adb5ee05c197`**, pushed (checked: `git ls-remote
origin refs/heads/d676-lookback-b` → that sha; scan: push gate allow, privacy 0 hits), in `G:\consonance-scratch\b-yardstick-land`'s worktree
`G:\consonance-scratch\dz3-lookback-b`. It was based on `e091beb`, with main `32b9126` merged in. The commits:

| commit | what |
|---|---|
| `4a5bb8a` | the row, RED on `e091beb` |
| `2aa479f` | the change, its two further rows, `gym.txt`, the CHANGELOG |
| `9ecf82b` | the seed row's detail line, its own commit |
| `07fe969` | main `32b9126` merged in: clean, CHANGELOG and `selftest.cpp` auto-merged, 0 conflict markers |

## 1. For his eye

- **What caused it.** The look back turned only the picture, but **the mouse kept steering the run while V was held**. Looking round
  behind at a sprint turned the run, and at top speed a turn costs speed or puts you into a wall.
- **Now.** While V is held the mouse turns only the view, and the run keeps its heading. On letting go, the view comes back to where
  you are running.
- **The switch.** `look_back_turns_run` in `game\config\gym.txt` (shared by the world and the gym): 0, the view only, is the default;
  1 gives the old way back.
- **The two speed tracks, before and after.** These are the row's own numbers: a sprint at 7.29 m/s, a three-quarter-second glance, and
  the mouse turning 30 degrees.

      before (e091beb): the run parts from the no-glance sprint at the glance's first tick and ends 8.51 apart (metres + m/s)
      after:            the run never parts: first tick that differs -1, most apart 0.0000

## 2. The row, red then green

**What it does.** `game/tests/body_tests.cpp`, `looking_back_while_the_mouse_moves_turns_the_view_and_leaves_the_run_tick_for_tick_as_it_was`
(in game_tests), played the way a player plays:
- keys and mouse counts go into the shell, since a playback would bypass both;
- R restarts to face the course, then W and Shift;
- at 1.0 s (7.29 m/s) V goes down for 0.75 s while the mouse turns 30 degrees left;
- the run goes on to 2.5 s;
- beside it, the same sprint with no glance and no mouse;
- it compares position and speed every tick, then the state hash.

    checked: G:\consonance-scratch\b-lookback-out\red4_row.txt (e091beb + the row, 4a5bb8a) → FAIL: "600 ticks; first tick the run
             differs 240; most apart 8.5089 (metres + m/s); speed when the glance began 7.29 m/s"; first_apart 240 and the state
             hashes differ
    checked: green_row.txt (2aa479f) → ok: "first tick the run differs -1; most apart 0.0000"

**Three quarters of a second, not the packet's one second.** The gym's opening straight stops a sprint at 13.6 m (z 13.63 from 1.9 s
on, read by a debug print removed before commit). One second at top speed does not fit before it ends. The row's comment says so.

**My fixture's own faults, found before green:**
1. 1e9/240 ns is not whole, so 1,440 frames gave 1,439 ticks. Fixed with 4,166,667 ns.
2. The speed was read at the end of the run, where the plain sprint has stopped.
3. No restart, so the aim started at yaw 0.

Each was fixed in the row before its red commit. Each red reading was red at `first_apart` for the mouse's reason.

## 3. The two further rows, and the glance rows

    checked: chk_game_tests.txt → ok, "with look_back_turns_run = 1: the run first differs at frame 240 (the glance began at 240)"
             (the row retimed to the main row's window; its first run, green_switch.txt, glanced at 720 after the stop)
    checked: green_long.txt → ok (a 250 ms frame looking ahead: 0 counted; one turned behind: 1; an ordinary frame: 0)
    checked: green_glance_rows.txt → 5 tests, 0 failed (the existing glance rows and the new row)

## 4. What else moved: nothing

    checked: chk_game_tests.txt (2aa479f, e091beb base) → 192 tests, 0 failed (189 + 3 new); exit 0
    checked: chk_world_app_tests.txt → 67 tests, 0 failed; exit 0
    checked: chk_gym.txt → "selftest: passed (26 of 26 checks passed)", exit 0
    checked: chk_world.txt → "selftest: passed (61 of 61 checks passed)", exit 0
    checked: chk_replays.txt → his seven kept runs of e091beb (run-20261114-180616, -184242, -184654, -184848, -184949, -185306,
             -185333; copies in G:\consonance-scratch\b-lookback-runs, his files opened for reading only) → each "the same run to
             the bit (both fingerprints match)", exit 0
    checked: chk_tasks_start.txt and chk_tasks_end.txt → no dz-world, dz-gym or StarCitizen

**The same checks on the merge with main `32b9126` (`07fe969`, the tip to land):**

    checked: mrg_game_tests.txt → 192 tests, 0 failed, exit 0; mrg_world_app_tests.txt → 67 tests, 0 failed, exit 0
    checked: mrg_gym.txt → 26 of 26, exit 0; mrg_world.txt → 61 of 61, exit 0
    checked: mrg_replays.txt → 7 of 7 "the same run to the bit", every exit 0 (on the merged tree, with the light filter on: the
             filter is the picture's, and the runs agree)

**Who else was running.** The merge checks ran beside other seats' runs: `mrg_tasks_start.txt` and `mrg_tasks_end.txt` each show a
dz-world (pids 26184 and 27376), both gone when I looked.
- inferred: they were seats' self-tests, not his game. The one running when I looked was pane C's, from
  `G:\consonance-scratch\c-d675-pacing\wt-31d1c6d` (`Get-CimInstance`).
- My waiter reads for any dz-world before it starts, not during the run. The readings above are green either way.

The whole suite (`build.bat test`) is the landing pane's, at O's landing.

## 5. The second suspect, measured and not fixed, and what is owed

- **Counted:** frames over `FixedStep`'s 100 ms limit (`game/loop.h`; the rest of their time is lost to the run) while the view is
  turned more than half behind, in `Shell::glance_long_frames()`.
- **Not yet in the run record.** `game/world/run_record.h` says "The owner of this file adds fields; nobody else edits it", and the
  owner is pane A (`handback/p-record-owner-A_2026-11-13.md`).
- **OWED, to the record's owner:** an optional field, for example `glance_long_frames = N` in the text record, read from
  `app.glance_long_frames()` when the run ends. Until it is there, his next hitch does not name itself in the record.

## 6. The seed row's detail line (the chair's D677 order)

**What changed.** `game/world/selftest.cpp`: the row "a new seed replaces the whole world, and the player stands at its spawn" now
prints:
- the stage's drawn count;
- whether the player is on the ground (or the state's number);
- the builds still pending.

    checked: seed_world.txt (9ecf82b) → "seed 2: 245 chunks loaded, 245 drawn (245 by the stage); the player on the ground; 0 builds
             pending"; selftest passed 61 of 61, exit 0

## 7. Corrections

- **The debug print** used to find the 13.6 m stop was in the row for one run and was removed before the red commit.
- **A scripted edit missed** on CRLF line endings. It threw before writing anything, and I redid it with the Edit tool.
