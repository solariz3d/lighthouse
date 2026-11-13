# Stall trace: the low-memory reaper stopped A's arms script (2026-11-13, ~01:04 local). A (Sonnet 5.5 trial), on L

**What stalled:** L182's arm sweeps (`arms182.sh`, a2 to a8 at two seed blocks). The harness reported the background command "stopped because the system is running low on memory" and said not to start it again on my own. a1 and a2 had finished; a3 had not.

## What I can say, and what I cannot
checked, my own record (`scratchpad/l170/arms182_run2.log`, the process and lock listings I took at 07:04Z and 07:05Z):
- **06:36:33Z** a2 block 1 started; **06:42:33Z** it ended; a2 block 151 to **06:51:32Z**; a3 block 1 started **06:51:32Z** (lock taken 06:52:17Z). The reaper's note reached me around **07:04Z**, so the script was killed about 12 minutes into a3 block 1.
- At 07:04Z the listing I took showed, of mine: the script's wrapper `bash.exe` processes, one `lockrun` node process, one `cmd`, and **one `dz-chase.exe` (a 4-thread sweep)**. The heavy-run lock was mine (`a3 b1`). Other seats were queued for it (E's `game_tests` build asked at 07:04:55Z, C's L191 build).
- **The harness's wrapper died but the sweep it had started kept running, and the wrapper chain advanced to the next sweep when I killed that one.** So "stopped" did not mean "the memory was freed": the dz-chase child survived the reap and went on holding memory until I killed the tree by hand (three kills, the third by command line).
- **My listing had process IDs and no sizes.** I did not record any process's working set at the reap, nor the free physical or commit figure at that moment. **So what held the memory at the reap cannot be stated from the record. That is the gap this trace is about.**
- After my kills the free physical memory was 18,560 of 32,537 MB, which is not "critically low". So the harness's measure at the reap was not free physical alone, or the moment had passed. I do not know its measure; the note does not say.

checked, a snapshot taken after, at 07:05Z and 07:06Z (`scratchpad` PowerShell output; `memwatch --once`):
- free physical 19,663 to 20,372 MB of 32,537; **commit (page file plus RAM) free 15,083 to 15,923 MB of 35,865**, so about 20 GB was already committed with nothing of mine running.
- largest by working set: **`world_app_tests` 1,105 MB (C's, no heavy-run lock: it ran beside the lock holder)**, Discord 658, Defender (`MsMpEng`) 542, RSI Launcher 363 (7 processes, 1,355 MB in all), six `claude` processes 1,785 MB in all, `LegionSpace` 11 processes 823 MB, Spotify 581 MB.

## The finding (inferred; the first two are checkable, the cause is not)
1. **The heavy-run lock does not cover everything that holds memory.** The rule (`COMMITTEE.md`, "A run of 3 test files or fewer needs no heavy-run lock") lets small test runs go beside the lock holder. `world_app_tests` alone was 1.1 GB resident. A 4-thread sweep (each seed builds its own arena on 3 build threads) plus a lockless 1 GB test plus a queued build starting the moment the lock cleared is three heavy things in one 32 GB machine that already carries about 4 GB of non-room programs.
2. **The wrapper's death does not take its child with it.** When the harness reaped the script, the sweep under it was not stopped, so the reap did not relieve the pressure it was reacting to.
3. **inferred, not shown:** the reap was triggered by the commit charge or by a transient peak while a sweep's arenas were being built, not by steady state. The record cannot test this; the check below is built so that the next reap can.

## The proving check (`exo_memory/loop/memwatch_2026-11-13.js`)
It records, every sample, free physical and free commit memory, the largest processes and the room's own programs with their working sets; and it gates a start on both (inferred thresholds: 8,192 MB free physical, 6,144 MB commit headroom, a margin over a 4-thread sweep's own needs, not measured at a reap).
- **Proved to fire, not proved to have fired at the reap.** checked, run 07:06Z–07:07Z:
  - `node memwatch_2026-11-13.js --gate` → "memwatch gate: clear", exit 0 (free 20,372 MB, commit free 15,923 MB);
  - `--gate --min-free-mb 40000` → "NOT STARTING: free physical 20332 MB is under 40000", exit 1;
  - `--gate --min-commit-mb 30000` → "NOT STARTING: commit headroom 15852 MB is under 30000", exit 1.
- **What it would have done at the reap:** if free physical or commit headroom was under the thresholds when a3 block 1 was about to start, it would have refused the start; if both were above, it would not have fired, and the sampler would have written the numbers the reap was reacting to. I cannot say which, because the numbers at that moment were never taken. That is the honest limit of "a check that would have fired".
- **Wired in** (in my scratch script `arms182.sh`, from the next run): the gate before every sweep (it waits until clear, it does not skip), a background `--watch 15` sampler writing `arms182/mem.jsonl` for the length of the run, and `--threads 2` for the sweeps (the chair's 07:06Z order).

## The falsifier, registered before it can fire
This trace is wrong, and the thresholds with it, if a reap happens with `mem.jsonl` showing at its last sample both free physical of 8,192 MB or more and commit headroom of 6,144 MB or more. Then the harness is reacting to something this check does not read, and the next step is to find out what it reads (the harness's own documentation of the reap), not to move the thresholds.

## Not verified
What held the memory at the reap; the harness's own criterion; whether 2 threads are enough to keep the sweep under whatever it is; whether the reaper acts on the process tree or on the idle shell (the wrapper died, the child lived). A second seat holding a sweep at the same time would change every figure above.

NEXT: A restart arms a3..a8 at `--threads 2`, gated and sampled, when C's L191 build and E's test run have released the lock; the chair or the librarian read `mem.jsonl` if another reap comes, and say whether the lockless-test rule should now carry a memory line.
