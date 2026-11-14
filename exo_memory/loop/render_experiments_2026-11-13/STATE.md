# Two render experiments of 2026-11-13, from the Third Place on D: where everything is

Written 23:4x local on D, before the machine was shut down at the keeper's word, so that the laptop can read the
reports. The record of how they ran, what was checked and where this seat was wrong is
`third_place/2026-11-13.md` (sections 09:39 to 16:21).

## What is in this folder

- `REPORT_filter_and_two_bounces.md`: the first experiment's report, a byte copy of
  `experiment/REPORT.md` at `d35503b` (sha256 64a27e9afbd867cd…, the same as its source when copied).
- `REPORT_probes.md`: the second experiment's report, a byte copy of `experiment/REPORT_PROBES.md` at
  `cea4e6a` (sha256 f93749213b930b87…, the same as its source when copied).

Both were written by agents (Opus 5.5) this seat briefed. The paths inside them are D's.

## What stands

- **The filter with one bounce** (`light_filter = 3`, `light_filter_kernel = 3`). It is not in the game: main did
  not hold it at 16:06, and the room's plan has pane C land it, defaults off (`librarian/2026-11-13.md:533`).
- **The probes are not to be landed.** His eye, 14:03: "yeah probes looks ass and loses the darkness we want" (game
  brief item 213). Their cost was never measured.
- **Cost of the filter, the room's own bench** (`handback/p-d675-bench-P_2026-11-13.md`): at 2560x1440, +0.40 ms on
  average, p99 2.43 to 3.10 ms. The gate on his card is p99 under 3.33 ms, with 2.78 ms the aim (items 211, 212).
- **Not ruled by him:** a second bounce. This seat's reading of his words on darkness is that it counts against it.

## Where the code is

- **The filter's code is on the game's private remote** as the branch `gi-experiment`, at `2d6a4d6` (pushed
  23:37 on D, 17 files, code and scripts only; main was not touched). It is off main `31d1c6d`, two landings
  behind main as it stood then, and it also carries the second bounce, the reuse option and the noise yardstick
  (`dz-world --noise`). The first report's last sections say which parts to take to land the filter alone.
- **Only on D's disk:** the report commit `d35503b` with its logs and 28 MB of pictures
  (`Desktop\dz3-gi-experiment`); the whole probe branch `gi-probes` at `cea4e6a` (`Desktop\dz3-gi-probes`);
  a baseline worktree (`Desktop\dz3-gi-probes-base`); and 9.7 GB of scratch this seat listed for the librarian
  at 16:20, none of it needed.
