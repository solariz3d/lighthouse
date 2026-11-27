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

## The second time, 2026-11-13 06:30 local: E's holder sat idle for 40 minutes (added by the librarian)
- **Seen:** every pane idle 4 to 29 minutes at 12:29Z, the train timing out on its exclusive hold, A with three jobs queued.
- **Checked:** `heavy-run.2.lock` was held by node pid 15304 (seat a2122153, E; "L193 yardstick player scoring: build yardstick_tests"), started 11:50:47Z. Its only child was `cmd.exe C:/ …\l175\target.bat …`, pid 34656: 0.27 s of CPU, no children, 40 minutes old. The same mangling of `cmd /c` as above.
- **Fix, now:** the librarian stopped cmd.exe 34656 at 12:30:4xZ. Node 15304 exited and the slot passed at once to A's hawk rebuild (12:30:41Z). E reruns its build with `cmd //c` or `MSYS_NO_PATHCONV=1`.
- **What this shows:** the "fix, for good" above was never built, and the stall came back at seven times the length. The guard in `consonance/tools/heavy-run.js` (a held child with no CPU for N minutes is named on the board) is now owed ahead of feature work, with its proving check: a wrapper holding a shell that does nothing is named within N minutes, and a compiling one is not.
- **Found beside it:** a research reader of the Opus swarm ran `grep -o "Children and Grief.\{0,7000\}" athealth.txt`; the bounded repeat grew to 1,552 MB in under three minutes and took commit-free memory to 3,956 MB (the gate's line is 6,144). Stopped by the librarian at 12:31Z; commit free read 5,754 MB after. A large bounded repeat in GNU grep is a memory bomb; readers should cut text with a line range or a small script.

## The third time, 2026-11-27 03:24 local, on L: A's holder sat idle for 13 minutes (added by the librarian)
- **Seen:** the keeper asked at 03:37 "what is a and b shell doing". The pulse line named it: "IDLE HOLDER 6fe15f0a slot 2, held 13m, nothing under it".
- **Checked:** slot 2 was held by node pid 33412 (seat 6fe15f0a, A; "L261: core-extra-bank-drag-cost x4 ... and core-bank-carry-mutation"), since 09:24:34Z. Its only child was `cmd.exe C:/ ...\scratchpad\l261\dragcost.cmd ...`, pid 18348: 0.02 s of CPU, one thread, no children. The same mangling of `cmd /c`. B's run for F1 (node pid 31820, "B L258 F1: core_right_width_mutation") had no child and was waiting on the slot; P's whole suite held slot 1 and was working.
- **Fix, now:** the librarian stopped cmd.exe 18348 at 09:38:02Z, by pid, after checking its name, its parent (33412) and its command line. The slot passed to B's run at 09:38:03Z. A reruns with `cmd //c` or `MSYS_NO_PATHCONV=1`.
- **What this shows:** the guard built after the second time (L202, `heavy-run.js:120`) worked as far as it goes: it named the holder, once, on the pulse line. It only reports, and a named idle holder still held the slot for 13 minutes and queued another seat's run behind it. The "fix, for good" (every wrapper that calls `cmd /c` from Git Bash escapes it) is still a rule for seats to remember; nothing refuses the mangled form. A refusal in `heavy-run.js --run` of a child command whose first words are `cmd C:/` would close it at the source; proving check: that run exits non-zero within a second and takes no slot. Owed, ahead of feature work.
