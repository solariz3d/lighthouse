# Registration: the timer control in the game (D675), pane P, 2026-11-14

Registered BEFORE code. Packet: the chair's message of 02:40:49Z. Tier: PROVE IT. Evidence it rests on:
`exo_memory/handback/p-d675-sleep-P_2026-11-14.md`. In arms A to D, 42.6 to 47.6% of `Sleep(1)` calls ran to the 15.6 ms tick and the
pacer dropped slots. In arm E, with the control, 0 of 9,000 went over 4 ms and every slot was drawn.

## The change, and where

- **Branch:** `d675-timer-p` in my build tree on G:. It is cut from dreamzone-3 main once fall-row-b (0a277863) has landed: read with
  `git ls-remote origin refs/heads/main`, and the branch starts at that sha, which the hand-back will name. A lander lands it, not me.
- **One helper in the render library**, because all three programs link `dz_render` and already reach `render/renderer.h`
  (game/gym/main.cpp through `game/gym/stage.h:13` and `window.h:20`; game/world/main.cpp through `game/gym/window.h` and
  `game/world/stage.h:21`; render/view/main.cpp directly at :38):
  - `bool HonorTimerResolution(std::string* error = nullptr);`, declared in `render/renderer.h` beside `ReadDds` and `WritePng`;
  - defined in a new `render/src/timer.cpp`, added to `render/CMakeLists.txt`'s source list.
  - It calls `SetProcessInformation(GetCurrentProcess(), ProcessPowerThrottling, …)` with `ControlMask =
    PROCESS_POWER_THROTTLING_IGNORE_TIMER_RESOLUTION` and `StateMask = 0`, the documented form ("Always honor Timer Resolution Requests",
    SetProcessInformation, Remarks, updated 2025-07-01).
- **One line at each site, directly after the existing `timeBeginPeriod(1);`:**
  - game/world/main.cpp:336;
  - game/gym/main.cpp:220;
  - render/view/main.cpp:1166.
  - Nothing else changes in the gym and view files. In game/world, only that one line.
- **The check's surfaces, in the world only:**
  - `game/world/offscreen.cpp`, `run_bench`: one printed line, **`frames drawn N of M paced at 360 Hz`**, where M is
    `floor(took × 360) + 1` and `took` is the bench's own measured seconds. The 30 s bench paces 10,801 slots, the count my driver held
    it to at noon.
  - `game/world/selftest.cpp`: one row, **"the 1 ms timer is asked to be honoured"**. It reads the process's own state back with
    `GetProcessInformation(ProcessPowerThrottling)`, which the page lists as a supported class. It requires
    `PROCESS_POWER_THROTTLING_IGNORE_TIMER_RESOLUTION` set in `ControlMask` and clear in `StateMask`. That is deterministic: no timing in
    the row.
- **The record:** CHANGELOG.md (the game's) and render/CHANGES.md (the render library's).

## When the call fails (an older Windows, a refusal)

- The helper never throws and never exits.
  - It finds `SetProcessInformation` with `GetProcAddress` on kernel32. So a Windows without it still loads the program, where a static
    import would not.
  - On a missing function, or a call that returns FALSE (for example `ERROR_INVALID_PARAMETER` where Windows does not know the flag), it
    returns false and writes one line to stderr. stderr is where each of the three already reports (dz-world's `std::fprintf(stderr, …)`;
    dz-view re-opens stderr on the parent's console at :1158-1163):
    `timer: Windows was not asked to honour the 1 ms timer (<SetProcessInformation not found | error N>); frames may fall behind their pace`.
- The call sites ignore the return, and the program starts as it does today.
- The self-test row reports a failed call as its own failure, with the error, so a machine that refuses it is seen and not passed.

## Red first, then green

1. **Commit 1, the checks before the fix:** the bench line and the self-test row, no control.
   - Build on G:. `dz-world --selftest`: the new row must FAIL (ControlMask reads 0).
   - The bench under the exclusive hold, three runs: `dz-world --bench 30 --chasers --seed 1 --size 2560 1440`, as C's row C, from this
     build. Expected to print fewer drawn than paced.
   - **If this build draws every slot,** the red is NOT shown by the bench. That goes in the hand-back as it is, and the self-test row is
     then the only red.
2. **Commit 2, the control:**
   - Build. The row passes.
   - The same three bench runs: each must print drawn = paced.
   - I keep commit 1's dz-world.exe beside it, and interleave the two builds' runs in one session (1, 2, 1, 2, 1, 2), so the machine's
     state is the same for both.
3. **Hand mutants on commit 2**, each built and run with the self-test row; each must turn the row red:
   - StateMask set to the flag (ignore, not honour);
   - ControlMask 0;
   - the world's call line removed.
   - Reported as `applied N / caught N / NOT APPLIED N`.
4. **Builds:** dz-world, dz-gym and dz-view all build.
   - `dz-gym --selftest` runs (it executes the gym's line at start-up).
   - dz-view is built and NOT run: its lane is C's, and its line is the same call.
5. The whole suite is the lander's at landing.

**No run while a game of his is on the card.** I check that acs, dz-world, dz-gym and dz-view are absent, and run nothing while
another seat's timing session holds.

## What would show the fix wrong

- **With the control,** any of the three bench runs prints drawn < paced. Then the control does not cover the bench's slot loss, and
  the claim from arm E does not carry to the game.
- **The self-test row passes but the bench still falls short:** the call takes effect and does not help. The cause is elsewhere.
- Any of the three programs fails to start, or its self-test regresses, on this machine.
- **inferred, a cost, not a defect:** with the control, the game keeps its 1 ms timer when minimised or hidden. Windows' default exists
  to save power there. On this desktop the cost is power, not frames. It is named so that it is a decision, not a side effect.

## ONE OPEN THING THE TABLE DOES NOT EXPLAIN, kept open

- My noon bench, started hidden, most likely at Normal (my correction, the sleep hand-back §4), with heavy-run's 8-of-16 cap, drew
  10,801 of 10,801 in every counted run, 18:29 to 18:39Z.
- Tonight arm D, in those conditions, loses 4 to 5% of its slots.
- The fix's success does NOT explain that. A control that always honours the timer would draw every slot in both states, so it cannot
  tell them apart.
- **Open, with the candidates as registered there:**
  - something at noon that made Windows honour windowless requests (a foreground game, a visible renderer, audio playing);
  - the power plan or power source;
  - a Windows update or reboot since noon.
- **What would close it:** the probe's arm D run again in a state where one candidate is present and the others are not. That is not
  in this lap.

## The unwelcome outcomes, in the words that would make them true

- "The control does not make the bench draw every slot": any green-build run prints drawn < paced.
- "The bench draws every slot without it tonight": the red build's three runs print drawn = paced. Then the bench's red is unshown, and
  the self-test row carries the proof alone.
