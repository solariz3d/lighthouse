# p-l202-idle-holder-guard-B: the idle-holder guard in heavy-run.js (L202)

## WHERE IT STOPS (L, 13:5xZ)

- **Branch:** lighthouse `l202-idle-guard` **901d3c39**, pushed (checked: `git ls-remote origin refs/heads/l202-idle-guard`).
  **NOT merged and NOT live**, per the close-out rule: heavy-run.js goes live for every seat when it lands, so it waits for
  the desktop.
- **Green:**
  - `node --test consonance/tools/heavy-run.test.js`: 101 of 101 (96 rows and the 5 new), 54 s;
  - the 5 new mutants applied 5 / caught 5, control 101/0;
  - the board path proven once live (12:40Z, a test line through mount B, on the board as `[B] committee`).
- **Not finished:** the other 92 mutants. They ran on a scratch data dir from 13:07Z and were stopped at 13:29Z for the
  close-out.
  - Mutants 1–19 were applied and caught, 0 survived, 0 NOT APPLIED; the control was 101/0. Mutants 20–92 did not run
    (`scratchpad/l202_mut_rest.log`).
  - With the last train batch at 13:40Z and nothing to land after it, there was no time left to land the guard on L. It
    stays parked on its branch for the desktop (the chair, 13:27Z).
- **Next command, on the desktop:**
  1. In a worktree of `l202-idle-guard`: `set CONSONANCE_DATA=<a scratch folder>` then
     `node consonance/tools/heavy-run.mutants.js --only 1-92`. It holds that folder's lock, not the room's, and takes about
     80 min at 54 s a mutant.
  2. If none survives, merge into lighthouse main, push, and say on the board that it is live.
- **Only on L:** the worktree `Downloads\lh-wt-l202`; the scratch folder `l202_data` and the logs `l202_*.log` in my
  scratchpad. None is needed: the branch is complete.

## What it is

A runner WAITING on a heavy-run slot samples each holder's whole process tree once a minute, with one CIM query
(`idleSampleTree`).
- **When it fires:** when the tree used under `IDLE_CPU_S` (1 s) of CPU over `IDLE_WINDOW_MS` (5 min), the holder is
  named ONCE.
- **How:** a log line, and a board line posted by a detached child through the waiting seat's own MCP mount
  (`seatMountUrl`, `postBoardVia`; mount from `<data>\letters.json` and `<data>\mcp.consonance.<letter>.json`).
- **It only reports.** It never stops a process, never releases or takes a lock, and a fault in it leaves the wait
  exactly as it was (`watchIdle`'s catch).

**N, registered from real runs** (12:35Z, `l202_sample.js` over the two live holders, every 30 s for 6 min):
- A's sweep (node, cmd, dz-chase) used 55–57 s of tree CPU per 30 s; C's run (node, bash, world_app_tests) used 117–122 s.
- The two stalls used 0 s in 6 minutes (11-12) and 0.27 s in 40 (11-13).
- So under 1 s in 5 minutes is three orders of magnitude below any real run, and 5 minutes is far inside the waiter's
  30-minute give-up.
- **The whole tree, not the child:** a ctest or cmd parent idles while its children work (the chair's read at 12:32Z:
  cmd.exe 0.0 s, dz-chase.exe 131 s). A row pins it.

**The board path:** there was no script path to the board (a direct append to `board.jsonl` never reaches the app's ring
or `read_board`; a Sonnet reader checked `main.rs:1719`, `mcp.rs:2039-2077`). So the waiting seat posts through its own
mount, over loopback, through the app's own funnel. No pane, or no mount, means the log line only.

## Red first, then green

The rows are in `consonance/tools/heavy-run.test.js`:
- an idle holder named once within the window: **red before**, green after;
- a compiling holder never named, and a faulting guard leaving the wait as today: green before and after, as guards on the
  change; each is seen red by its mutant (93–97);
- the board line through the mount (a stub server sees initialize, the session echoed, then post_board): **red before**,
  green after;
- the sampler sums the whole tree.

`heavy-run.mutants.js` gained the five guard mutants, and `--only` now takes a range or a list, so a long set runs in units.

## My faults on the way, owned on the board

- 12:40Z: requiring `heavy-run.mutants.js` to check an anchor RAN it (the module starts itself), and it held slot 1. Stopped,
  and its stale lock removed after checking the pid was gone.
- 12:44–12:48Z: I ran the guard's mutants on the room's lock, testing idleness while the train waited. The chair caught it.
  They then ran on a scratch data dir.

## Could be wrong

- That `post_board` over the mount works when the app restarts mid-wait: the port in `mcp.consonance.<L>.json` is rewritten
  at each start, and it is read fresh at each report.
- That the guard never fires on a legitimately quiet run. None was seen, but a run that sleeps inside the lock for over
  5 minutes would be named. That is the point, but it would be a line on the board.
