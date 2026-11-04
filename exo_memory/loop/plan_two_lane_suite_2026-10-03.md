# Two-lane test suite: faster full runs without the load that crashed the PC. Librarian, on D, 2026-10-03 11:1x. QUEUED behind D225.

The keeper, 11:14: "is there a way to make shells go faster, without crashing my pc" · 11:15: "just do what you think".

## Why
- Since the 09-30 crash, the t180 full suite runs at `--test-concurrency=1` with the mutation suites serialized
  (`librarian/2026-09-29.desktop.md`, the crash section). Safe, but every geometry landing waits a long serialized run (D222's, D225's).
- **The load that matters is a few HEAVY files:** the mutation harnesses spawn big children at `--max-old-space-size=4096`, plus the
  export, real-window and long-lap checks. Most files are small unit tests.

## The lap (instrument tier; E, who builds the room's instruments; only after D225's suite has released the lock)
1. **Measure once, serially** (under the heavy-run lock, nothing else running), on t180 main: each test file's wall time and PEAK memory,
   counting its child processes (`process.memoryUsage` is not enough; sample the process tree, e.g. `wmic`/`Get-Process` by parent, every 250 ms).
   Output `loop/suite_profile_2026-10-03.md`: per file, the time, the peak MB and whether it spawns children.
2. **Classify by the numbers, not by name:** HEAVY = it spawns children, OR peak > 1 GB, OR it is a mutation harness. LIGHT = everything else.
3. **A runner, `tools/suite2.cjs` in t180** (one new file, no test edited):
   - the LIGHT lane runs at concurrency N = min(4, floor((free RAM − 8 GB headroom) / the max LIGHT peak)), read at start;
   - then the HEAVY lane runs strictly one at a time;
   - it holds the heavy-run lock for the whole run;
   - **a memory guard:** if system free RAM drops below the headroom mid-run, it finishes the running files and drops to serial for the rest.
4. **Prove it equals the serial run:** run both on the same tree. The pass/fail/skip set must be IDENTICAL, test by test, and the two-lane
   run's peak system memory must stay above the headroom.

## Registered now
- **KEEP if:** identical results AND ≥ 40% less wall time AND the free-RAM floor is never crossed.
- **DROP (back to serial, reported) if:** any result differs, OR the floor is crossed, OR it saves < 40%.
- **Not changed:** feel-tier laps keep targeted tests only (memory `match-checking-to-risk`). The mutation harnesses stay serialized. The
  hardware question (RAM profile / CPU tuning to stock, a memory test) stays the keeper's, and would be the bigger win if it is the cause.

NEXT: chair dispatch the two-lane suite lap to E when D225's suite has released the heavy-run lock

## Amendment (librarian, 11:2x), before any run: sized to the machine
The keeper: "we have a beefy cpu and 64gb of ddr5 ram but not infinity". Checked (`Get-CimInstance`): Ryzen 7 9850X3D, 8 cores / 16 threads,
61.4 GB visible, 40.7 GB free WHILE B's serialized suite runs. **The light lane's cap becomes N = min(cores − 2 = 6, floor((free − 8 GB) / max
light peak))**, not 4. Tests are CPU-bound, so beyond the physical cores adds little and costs heat. The 8 GB floor and the memory guard stay.
The 09-30 dumps pointed at instability under load more than at RAM running out, so the heavy lane stays serial however much RAM is free.
