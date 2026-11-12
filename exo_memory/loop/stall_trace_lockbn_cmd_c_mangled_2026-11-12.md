# Stall trace: a pane's build held the heavy-run lock for 6 minutes doing nothing. Librarian, 2026-11-12 01:1x (L)

**Seen:** A reported its L170 build "queued on the heavy-run lock behind B's L139" at 01:14.

**Checked:**
- `C:\Consonance\data\heavy-run.lock` held by pid 13192, seat 12fb81f6 (B), started 07:08:31Z. Its cmd label still read
  "B L139 …", an old label carried in B's wrapper.
- 13192 was `node lockbn.js cmd C:/ …\l170_build.cmd`. Its only child, cmd.exe 37364, had **0 s CPU and no children**.

**Cause (inferred from the arguments):**
- Git Bash's path conversion rewrote `cmd /c` into `cmd C:/`, so cmd.exe started as an interactive shell and waited.
- The lock wrapper waited on it, and B's turn waited on the wrapper. B's pane therefore could not take its queued messages
  ("QUEUED B … receiver busy since 01:03").
- This is the same family as B's 11-11 "`'build.bat' is not recognized`" false start, and E's L162 note: "`/c` was rewritten to a
  path by Git Bash".

**Fix, now:** the librarian stopped cmd.exe 37364 (B's own process; the hang checked first). The wrapper exited, and the lock
passed to the next in line (C, 07:14:46Z). B reruns its build.

**Fix, for good (owed):**
- Every pane wrapper that calls `cmd /c` from Git Bash sets `MSYS_NO_PATHCONV=1`, or uses `cmd //c`.
- **The proving check:** run the wrapper once with a trivial `.cmd` that prints and exits, and see it exit within a second.
- **A guard in `consonance/tools/heavy-run.js` (lockbn's base):** if the held child has used 0 CPU for N minutes, say so on the
  board. A lock held by an idle shell should never be silent.
