# Registration: two laps on the lock (D675), pane P, 2026-11-14

Registered BEFORE code. Packet: the chair's message of 05:08Z. Tier: PROVE IT, both.
- Read whole first: `exo_memory/loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md` (31 lines: 11-12 B, 6 minutes; 11-13 E, 40 minutes;
  its "fix, for good" names safe wrappers AND a guard).
- **Tonight is the third occurrence.** E's slot-2 holder pid 25928 held from 04:15:14Z with a tree of node.exe and cmd.exe using 0.00 s
  of CPU, and the guard posted it to the board 5 times.
- checked: `grep -a '"text":"heavy-run: IDLE HOLDER' C:\Consonance\data\board.jsonl` → 5 rows; the newest three at ts 1794630090151
  (04:21:30Z, pane P's waiter), 1794631432944 (C's), 1794631685330 (P's). Each opens with the guard's own `describe(h)` of the holder.
- **No seat read them.**

**Both laps branch from `hr-status-p` (f2be8c32), not from main.**
- Lap 1 uses its `status()`, the read-only holder judgment.
- Lap 2 edits the same three files (`heavy-run.js`, its test, its mutants).
- Branched from main, either would conflict with it. O lands `hr-status-p` first; each lap's hand-back names its base.

**Order.** The timer branch's merge and re-run come first when the filter is on the game's main. These fit around it.

## LAP 1: the idle holder in the pulse the chair and the librarian see (branch `idle-pulse-p`)

**Files:**
- `consonance/tools/chain-status.js`, the one-line pulse `userprompt_pulse.py:322` reads, which is a hook, so no app rebuild;
- `consonance/tools/chain-status.test.js`;
- `consonance/tools/heavy-run.js`: one export, the holder description the guard already uses, so the two cannot drift.

**What:**
- A clause in `line()` reads the lock files with `status()` (the same judgment `--run` uses), and the newest board rows whose text begins
  `heavy-run: IDLE HOLDER — ` followed by **exactly** that holder's description: `<seat> pid <pid> (<cmd>, since <started>)`.
- For each slot whose holder is **live now** and was named idle **since it took the lock**, the pulse carries:
  `IDLE HOLDER <seat> slot <k>, held <m>m, nothing under it (named <n>x, last <hh:mm>Z)`.
- It rides **every holder state and no lap**, like the queued-ring clause, so it is read **before** the early "nothing to say" exit
  (chain-status.js:1272).
- It is a new kind `idle`, added to `PULSE_KEEPS` so the trimmed pulse keeps it.
- A holder that has released, or a lock re-taken by another run (its description differs), gets no line.
- The board tail it reads is the same bounded tail the pulse already reads for its other clauses.
- A read that fails prints `idle UNKNOWN — <why>`, never silence (this file's first rule).

**Red first, on tonight's recorded rows:**
- The fixture: a temp store with a ledger (no open lap, so the early exit would otherwise return null); `board.jsonl` holding the guard's
  own row of 04:21:30Z, copied verbatim from the live board; and `heavy-run.2.lock` holding E's record as the row describes it (pid 25928,
  seat a2122153, its cmd, since 2026-11-14T04:15:14.039Z).
- `line()` at now = 04:22:00Z, with the holder's liveness injected as it was then (alive; the pid is gone now, and a live check would
  read it free).
- It must carry `IDLE HOLDER a2122153 slot 2`. Before the code it carries nothing (the early exit), so the row is red.

**Edges, each red first where it can be:**
- the lock released (no file): no line;
- the lock re-taken by another run: no line;
- a guard row naming a holder older than the current lock: no line;
- the board unreadable: `idle UNKNOWN`;
- a live holder with no guard row: no line;
- `--full` and the trimmed pulse both carry it.

**Mutants:** no harness names chain-status.js. Hand mutants run from a scratch script on a temp copy, each anchor exactly once, reported
`applied N / caught N / NOT APPLIED N`:
- the clause not called;
- the kind not kept;
- the description match loosened to the pid alone;
- the "since it took the lock" check dropped;
- the early exit ignoring it.

**What would show it wrong:**
- the 04:22Z fixture prints no line;
- a released or re-taken lock still prints one;
- the pulse's run time grows past its 3 s budget (`userprompt_pulse.py`'s `timeout=3`), measured before and after on the live store;
- **the line says "nothing under it" for a holder whose tree is busy again.** The guard names a holder once per waiter and never takes
  it back, so a holder that recovers would still be named. The line prints when it was named ("last hh:mm"), and the guard's own rule
  stands: **a prompt to look, never grounds to stop a holder.**

**Not in this lap:** a ring into the holder's own pane, which needs the app (on the room-stretch list).

## LAP 2: --run takes the .cmd file and the priority itself (branch `run-script-p`)

**Files:** `consonance/tools/heavy-run.js` (`runCli`), `consonance/tools/heavy-run.test.js`, `consonance/tools/heavy-run.mutants.js`,
`consonance/GATES.md` (the one line).

**What:**
- `node consonance/tools/heavy-run.js --run --cmd "<what>" [--exclusive] [--priority belownormal] -- <file.cmd|file.bat> [args...]`.
- **A `.cmd` or `.bat` program is started by heavy-run:** `cmd.exe` from an **argument list** with `windowsVerbatimArguments`, its line
  built as `/d /s /c ""<resolved path>" <args>"`. No pane writes `start … cmd /c …` through a shell again.
- **Git Bash's rewriting cannot reach it:** the only things the shell passes are node's own arguments, and none of them is a `/c`.
- **The priority is set on heavy-run's own process before the spawn,** with `os.setPriority`, so the script and everything it starts are
  created at it. That is inherited, with no race. Today's rule is BelowNormal for heavy runs.
- **An argument carrying a cmd metacharacter (`& | < > ^ % "`) is REFUSED,** loudly with exit 2. It is never quoted around, since a
  quoting rule for cmd is where tonight's line broke.
- Any other program runs exactly as today.

**Red first, on the recorded shapes:**
- **Tonight's shape:** `cmd /d /c "start \" /belownormal /wait /b cmd /d /c …landfilter.cmd"` (the chair's 05:08Z message; a broken title
  quote).
- **The trace's two:** `cmd C:/ …l170_build.cmd` and `cmd.exe C:/ …target.bat` (`/c` rewritten to a path).
- **Each was a hand-made line that left an idle shell holding the lock.** The row is the replacement: a trivial `.cmd` that prints and
  exits is given to `--run --priority belownormal`. It must run, print, exit with the script's own code, and finish within 5 s (the
  trace's proving check, "see it exit within a second", with margin).
- **A grandchild started by the `.cmd` reports its priority as below normal** (`os.getPriority()` in a node the script starts).
- Before the code, `--run -- x.cmd` gets Node's EINVAL for a `.cmd` without a shell (Node 24.14.1 here), and `--priority` is unknown.
  So the row is red.

**Edges:**
- a path with spaces;
- forward slashes (`G:/x.cmd`);
- a metacharacter in an argument (refused, exit 2, and the script never starts);
- a non-zero exit code passed through;
- `--exclusive` with a `.cmd` (the hold written, then released);
- a non-script program unchanged (the existing rows).

**Mutants (rows added to `heavy-run.mutants.js`):**
- the priority not set;
- `/s` dropped;
- the metacharacter check removed;
- the script's exit code replaced with 0;
- a `.cmd` spawned directly (Node's refusal back).

Then the file's whole test file, and the new rows through the harness with `--only`, as for `--status`.

**What would show it wrong:**
- the trivial `.cmd` does not exit within 5 s under `--run`;
- the grandchild is not below normal;
- an argument with `&` reaches the script;
- an existing `--run` row changes;
- **a script that itself calls `start` or `cmd /c` with the same mistake.** This lap removes the line panes write to START a script; it
  cannot fix a broken line inside one. The trace's proving check (a trivial run that exits within a second) stays the way to catch that,
  and the guard stays the net.

**The line to place when it lands:**
`node consonance/tools/heavy-run.js --run --cmd "<what>" --priority belownormal -- <file.cmd> [args]`, with `--exclusive` for a timing
session or a landing's quiet window. It is preceded by `--status` as already ruled.

## AMENDMENTS, ruled GO with five (the librarian's entry of 23:16 local, `exo_memory/librarian/2026-11-13.md:1437-1460`, 50c20dc1; the chair's 05:17Z message). Written here by name, before code.

1. **Lap 1 names BOTH readers and proves the line through the hook's own call shape.**
   - On D the registered prompt hook is `~/.claude/shell/hooks/userprompt-submit.js`, byte-equal to the repo's
     `dev/shell/hooks/userprompt-submit.js`. It spawns `chain-status.js` at :263-265 with a 3,000 ms limit and keeps ONLY THE FIRST LINE
     of the output (:268).
   - On L it is `dev/shell/hooks/userprompt_pulse.py:322`, which also keeps the first line.
   - **MY ERROR, corrected:** this registration named only the Python hook, as if it were D's.
   - The row: on the 04:22Z fixture, the reader is spawned as the JS hook spawns it, and the line must be in the FIRST line of its output.
     A line carried only by a second output line would be green in `line()` and invisible in every pane.
2. **Lap 1's run-time measure goes through D's hook on the live store, before and after.**
   - `node ~/.claude/shell/hooks/userprompt-submit.js` with the hook's stdin, timed, several runs each, against the hook's 3,000 ms.
3. **Lap 1's fixture holds no literal drive path.**
   - The guard row copied from the live board carries none (its text is the holder's description and the guard's sentence).
   - Any path the fixture needs is built at run time from the temp dir. Checked with `portable-paths.js` before the hand-back.
4. **Lap 2's `--priority` accepts only `belownormal` and `idle`.**
   - Any other value is REFUSED with exit 2 and a line saying why: CreateProcessW (`dwCreationFlags`) gives a child its creator's class
     only for IDLE and BELOW_NORMAL; any other creator class gives the child NORMAL.
   - One row.
5. **Lap 2's metacharacter refusal covers the RESOLVED SCRIPT PATH as well as the arguments.**
   - The usage text names the limit it cannot remove: **Git Bash rewrites an argument that begins with a slash before node sees it**
     (`loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md:11`). So a script's own switches go as words or with a dash, never `/x`.

**Also carried from C's fix, for any batch line I write (the chair's 05:17Z note):** inside a `( … )` block, cmd expands `%ERRORLEVEL%`
when it READS the block. So a line there reads the code from before the block's program ran. Inside a block, use `if errorlevel 1 (…)`.
Lap 2's own `cmd.exe` line is `/d /s /c ""<path>" <args>"`, with no block, and passes the script's code straight through.

## ADDED 2026-11-15 ~01:0xZ, before code: two room items join the lap (the chair's D677 message of 00:51:54Z; `loop/night_order_2026-11-14-D.md:73-78`)

The lap is now four parts on one branch, **`idle-pulse-p`** (its begun commit 69ee056b, on the remote; `hr-status-p` is on main,
so the branch merges main and carries on). One hand-back, one ring.

- **Order of build:** Lap 1 finished (its owed checks); Lap 2; item 3 (the pause); item 4 (the game wait).
- **Files:** as above, plus the same `heavy-run.js`, its test, its mutants and `consonance/GATES.md` for items 3 and 4.

### 3. A PAUSE HELD AS THE LOCK'S EXCLUSIVE HOLD

**What happened** (the chair's message; the librarian's 2026-11-14 note :180): the chair paused every pane by message at 13:22. C's
message sat queued across C's compaction, and C built and ran a test at 13:27 while he played. C's build had asked the lock first; a
pause written as the hold would have stopped it there.

**What:**
- `node consonance/tools/heavy-run.js --pause --cmd "<why>" [--minutes N]` starts a detached, hidden holder.
  - It takes the exclusive hold by `acquire()`'s own path (stale takeover, waiting behind another hold, the record and token).
  - It writes `pause: true` and `max_ms` into the hold record, then stays alive until resumed or until N minutes pass.
  - It prints `PAUSED …` with the holder's pid and the end time once the hold is written, and exits 0.
- **Runners already in a slot finish; new runs wait,** as for any exclusive hold. `--status` exits 1 and names the pause.
- `node consonance/tools/heavy-run.js --resume` removes the hold only when it is a pause, and only by its token. The holder sees its
  hold gone and exits, releasing its slot. A hold that is not a pause (a timing session, a landing) is refused, exit 2, untouched.
- **The 90-minute rule:** a hold carrying `max_ms` is honoured for that long instead of `HOLD_MAX_MS`, capped at 12 hours, so a pause
  outlasts a long game. `--status` uses the same rule. **Default 180 minutes; above 720 refused, exit 2.**
- **A dead pause holder** (a restart, a kill) is stale by the lock's own rules and the next runner takes it over. A pause can never park
  the room after its holder is gone.

**Red first:**
- In a temp data dir: `--pause --cmd "his game" --minutes 5`, then `--status` must exit 1 naming the pause.
- A `--run` with a short wait must give up with exit 3 and not run its program.
- `--resume`, then `--status` exits 0, and the holder process is gone within 10 s.
- Before the code, `--pause` does nothing and `--status` exits 0, so the row is red.

**Edges:**
- a hold past 90 minutes with `max_ms` 3 hours still binds (`acquire()` with a fake clock), and past `max_ms` it is ignored;
- `--resume` on a timing session's hold is refused;
- `--minutes 721` is refused;
- `--pause` while another hold stands waits behind it and says so.

**What would show it wrong:**
- a run starts while the pause stands;
- `--resume` leaves the holder alive or the hold in place;
- a pause outlives its holder;
- **killing the holder leaves a hold that runners obey.** It must not: a dead pid is stale. This is the failure of my own 05:30Z
  error the other way round.

### 4. ONE COMMAND THAT WAITS FOR HIS GAME

**What happened:** three panes each wrote their own wait (A's runner: dz-world, dz-gym, acs; C's gate.sh: dz-world; B's: the process
list by hand), and none saw Star Citizen (the librarian's note :167). StarCitizen.exe pid 27640 was read up at 13:26 and 19:29.

**What:** `node consonance/tools/heavy-run.js --wait-game [--max-minutes N]`.
- It reads the process list once every 30 s through one PowerShell query: name, pid, whether the process has a visible main window,
  and its path.
- It waits while a game of his runs, printing `GAME: <name> pid <pid>` once per game. It exits 0 when none runs (at once if none was
  up), 3 at the maximum wait (default 240 minutes), and 2 when the process list cannot be read. A wait that cannot look does not say
  "clear".
- **"A game of his", registered now** (checked on D at ~01:0xZ: the RSI Launcher runs 7 processes with no window, no game up):
  - `StarCitizen.exe` and `acs.exe`, whatever their window state;
  - `dz-world`, `dz-gym`, `dz-view` **only with a visible main window**: his play has one, the panes' offscreen runs do not;
  - **any process under a `\steamapps\common\` folder with a visible main window;**
  - and any names in the heavy profile's `games` field (`~/.consonance.json`).
  - **Not counted:** the RSI Launcher and Steam itself (their windows are not games, and the launcher runs all day).
- **It never closes or touches a game.** It only reads.
- **The line beside the status:** `node consonance/tools/heavy-run.js --wait-game && node consonance/tools/heavy-run.js --status && <run>`.

**Red first:**
- The rule is a pure function over a list of rows, tested on rows shaped from today's record: Star Citizen with no window counts; a
  pane's hidden dz-world does not; his dz-world with a window does; an `acs.exe` counts; a Steam tool with no window does not; the
  launcher does not.
- The CLI is run on a fixture process list (a test seam, `CONSONANCE_PROC_LIST`, a file of rows, as `STATE_BLOCK_REPO` is a seam).
  With a game listed it must wait and time out with exit 3 under a tiny maximum; with none it exits 0; with an unreadable list, exit 2.
- Before the code, `--wait-game` is unknown and exits 0 at once, so the rows are red.
- Live, once: the real list read on D, with the result named.

**What would show it wrong:**
- Star Citizen up and `--wait-game` exits 0;
- a pane's offscreen dz-world blocks it;
- the launcher alone blocks it;
- it closes anything;
- the PowerShell read takes longer than its 30 s poll.

**Mutants:** rows added to `heavy-run.mutants.js` for items 2 to 4, each anchor exactly once. Then the whole test file, and the new rows
through the harness with `--only`. Lap 1's hand mutants as registered.

**THE NIGHT'S RULES apply:**
- no fan-out;
- one ring, with the hand-back;
- counts and paths;
- read the process list before every suite run; if a game of his is up, wait, never close it;
- the branch is pushed by its literal name;
- the lander is named at my ring.
