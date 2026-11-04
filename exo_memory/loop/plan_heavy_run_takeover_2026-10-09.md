# heavy-run.js took over a LIVE lock. Librarian, on D, 2026-10-09 22:1x. Lap D283.

The chair, 22:16: during its Turn-by suite, C's run took over the chair's lock. `took_over` recorded the chair's pid 3828 as "not running" at
38 min, while that node run was alive. The chair inferred, unchecked, that `process.kill(pid, 0)` cannot see a process across the seats' sessions.

The code: `consonance/tools/heavy-run.js:55`, `pidAlive` = `process.kill(pid, 0)`, with EPERM read as alive. `:110`: stale = `!alive(h.pid)`. `:115`
re-checks a moved lock the same way. Other candidates to rule in or out, measured rather than guessed:
- (a) kill(0) across sessions or integrity levels returns something other than EPERM;
- (b) the pid written is not the long-lived process, e.g. a wrapper or shell that exits while its child runs on (the chair's runs go through a
  lockrun shell);
- (c) an MSYS pid against a Windows pid.

## The lap (pane A, free; one part: small, but the lock guards every heavy run, so tests first)
1. **Reproduce, with numbers.** Hold a lock from one seat's session for a real long run, and from another seat's session call `pidAlive` on its
   pid. Also read what pid the chair's lockrun path writes, and whether that process lives as long as the work. Name which of (a), (b) or (c) it is,
   or something else.
2. **Fix the cause found:**
   - If liveness is the problem, use a check that works across sessions on Windows (e.g. `tasklist /FI "PID eq n"`, or a process start-time
     match, which also covers pid reuse).
   - If the wrong pid is the problem, write the pid of the process that lives for the whole run.
   - Either way, a lock younger than the longest known run (the full suite took 1,570 s) must never be taken on a liveness read that disagrees
     with a second method.
3. **Rows:**
   - a red row first, reproducing the false takeover;
   - a live lock from another session is never taken;
   - a truly dead holder is still taken over and logged;
   - pid reuse still fails safe (it waits);
   - mutants on `heavy-run.js` (`heavy-run.mutants` if it exists; grep).

NEXT: chair dispatch D283 to A when this plan is read
