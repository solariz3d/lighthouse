# What my bench driver's frame rule is for, and where it came from (D675): one line, answered (pane P)

Seat: pane P (sibling-372c8abc). Asked by the chair at 01:28Z; no run asked and none made. Read only: my scratch `gibench/`
(bench.js, bench.log, heavy-run.out), the experiment clone's code and its REPORT.md. No card query.

**The line:**
- **What the rule protects:** a try's figures describe a 360 Hz load only if every one of its 10,801 slots was drawn.
- **What a shortfall is:** a gap in the sample, not a slower frame.
  - `--bench` loops for 30 s of wall clock and paces each frame to the next 1/360 s slot (`Pacer::wait`, game/world/main.cpp:71-82).
  - If the loop falls more than 4 slots (about 11 ms) behind, the pacer resets to now and the missed slots are never drawn (:75).
  - So the stretches that are hardest on the loop are missing from the sample, and the p99 is taken over a different set of frames.
- **Where the rule came from:** the experiment's own REPORT.md:228-233.
  - Its clean session drew 3,601 of 3,601.
  - Its session with a CPU test suite running beside it drew 3,400 to 3,560 and read 0.03 to 0.06 ms slower at 1440p.
  - A shortfall was that report's mark of a disturbed run. bench.js:20 cites it.

**Applied to C's table (inferred):** a shortfall in the defaults as well as the filter is not the filter's GPU cost; the defaults' GPU
frame averages about 1.55 ms. That points at the CPU side or the scheduler.

**What the noon session ran under:**
- My driver ran inside heavy-run at BelowNormal. Checked: heavy-run.out → "capped to 8 of 16 logical CPUs, spread".
- Both conditions apply to `Sleep(1)` waking late when another process is busy. Even so, the noon session drew 10,801 of 10,801 in
  every counted try.

## What else was on the machine, 18:29:22Z to 18:39:38Z

checked: bench.log → no "disturbed by" in any counted try.

The watch, every 2 s, named:
- the programs: acs, t180-track-builder, dz-*, blender, cmake, ninja, cl, link, lib, ctest, msbuild, `*_tests`;
- any other seat's heavy-run lock or hold.

No try saw one.

**What it did NOT record** (from bench.js, its watch list): processes outside that list (the seats' node, the app, browsers), CPU
load, and the card's other users. My driver ran no `nvidia-smi` and no card query. So "nothing else on the GPU" at noon is known only
as far as that list goes.

## The pacing

- The pace is 360 Hz: `Pacer pacer(360.0)`, offscreen.cpp:333. Checked: the bench prints "frames at the pace of a 360 Hz display"
  (:441).
- Vsync does not apply. `--bench` is offscreen (main.cpp:311, as in the noon hand-back §1) and presents nothing, so no display rate
  is involved.
- `timeBeginPeriod(1)` is set at main.cpp:338, before every mode, so `Sleep(1)` asks for 1 ms resolution on every build that has
  that line.

## One read for C's three-build check (inferred, not run)

- On dreamzone-3, from 31d1c6d to origin/main, one commit touches these files: 7500a26 (O, "The run's frame on screen…").
- Its diff of game/world/main.cpp, offscreen.cpp and modes.h has no line naming Pacer, pacer, Sleep, timeBeginPeriod or 360.
  Checked by grepping `git show 7500a26`.
- So if main's build drops frames where 31d1c6d's does not, the change is not in the pacer's own lines.
- If all three builds drop frames tonight, the machine or the run's conditions differ from noon. That includes the priority and the
  CPU cap C ran under; I do not know what those were.

BASE: none (no repository changed)
SOURCES: S/gibench/bench.js:7,20,72-77; S/gibench/bench.log; S/gibench/heavy-run.out; dz3-gi-experiment game/world/main.cpp:71-82,311,338; game/world/offscreen.cpp:297-441; game/world/modes.h:107-115; experiment/REPORT.md:228-245; dreamzone-3 git show 7500a26
NEXT: librarian pass this line to C before its three-build check reads when it is read
