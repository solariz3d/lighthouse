# heavy-run's two stalls: the timing label and `cmd C:/` (D678 N1). Pane O, 2026-11-27

**The order:** the chair, 21:02:40Z, N1 of `exo_memory/loop/packet_t180_night_on_D_2026-11-27.md`. **Tier:** prove it (the room's own gate).
**Worktree:** `G:/consonance-scratch/o-heavyrun`, branch `o-d678-heavyrun`, from origin/main `a57d800c`. The packet's base `2d4a19a4` is
its ancestor, and no file under `consonance/tools`, `consonance/hooks`, `consonance/GATES.md` or the briefs changed between the two
(checked: `git merge-base --is-ancestor 2d4a19a4 a57d800c` → 0; `git diff --stat 2d4a19a4 a57d800c -- consonance/tools/ consonance/hooks/
consonance/GATES.md` → empty).

This section was written and committed **before any code**, as the order asks. Results follow in later sections.

## 1. Every reader of the rule, traced before deciding

- **`namesTimingSession` has one caller,** `status()` at `consonance/tools/heavy-run.js:727`. That caller fills `timingSlots`, which
  `statusReport` (`:768`) turns into `GATE: exit 1` for `--status`. checked: `git grep -n "namesTimingSession\|timingSlots" origin/main`
  → heavy-run.js:721, 727, 728, 746, 768 and one mutant row, `heavy-run.mutants.js:134`.
- **`acquire()` and `--run` never read the label.** A runner waits only on the exclusive hold and on a slot of its own tree. checked: `grep -n
  timing heavy-run.js` → the profile's `timing` field (:71-174, frame-timing tests per machine, unrelated) and the lines above, nothing in
  acquire (:420-678). So a wrong label has only ever closed `--status`, never `--run`.
- **Who gates on `--status`:** seats, by hand or chained, as `GATES.md:342` and `:392` tell them (`heavy-run.js --status && <your run>`).
  `usage-ledger.js:43` only classifies the command as a status re-read. No hook and no app code runs it. checked: `git grep -n heavy-run --
  consonance/hooks consonance/src-tauri/src` → test-file headers only, and one index title in main.rs:21393.
- **Outside this repo:** t180's timed rows (`app/test/sculpt-frame.test.js:41-52`) require both slots to be held by live processes, one of them
  their own token, and never read the label. No dreamzone or dreamride repo mentions heavy-run (checked: `git grep -l heavy-run` in each
  → none). A's `bl.js` (scout note, `loop/animation_system_2026-11-13/scout_authoring_and_tuning.md:99`) had its own reader, but it lived in
  a session scratchpad and is gone (checked: the path → absent).
- **The human reader:** `consonance/src-tauri/brief/COMMITTEE.md:93-94`: "EXCEPT while a lock's `cmd` names a timing session: then run
  nothing at all". The tool's own page is `consonance/GATES.md:335-338`, which lists the counted labels.
- **Who writes timing labels, from the record:**
  - A's D404 and D407 sessions: `hold({ cmd: 't180 A D404 timing session' })`, plus a "(second slot)", both non-exclusive. Mine, D412 and
    D421: "one-mutant timing", "landing: timing rows". All are dated evidence scripts from October, from before the exclusive hold existed.
  - Since D663 (11-11) the record's timing sessions take the exclusive hold. P, `handback/p-d675-hrstatus-P_2026-11-14.md:85-86`: "today's
    sessions all took the exclusive hold, which the exit covers". `loop/packet_t180_test_install_on_L_2026-11-27.md:63`: "an EXCLUSIVE hold
    stood (a timing session of the right-width builder…)". Tonight's N3 is ordered `--exclusive`.
  - The false gates: E's "(read, not timing)" closed `--status` for every seat from 16:33:15Z to 16:39:27Z (`handback/p-d678-ripple-read-E_2026-11-27.md`
    §9). A's "(measure, not timing)" would have done the same; A stopped it before it ran (`handback/p-d678-even-banked-probe2-A_2026-11-27.md:290-293`).
  - The room's workaround is now in every seat's labels: B's live lock at 21:0xZ read "B D678 even read: V1 rest rule, node only (not a timing session)".

## 2. The rule for the timing label: a timing session SAYS it is one, by a flag. The label is never read. (The librarian's lean, taken.)

**The rule.**
- `--run --timing` (or `hold({ cmd, timing: true })` from node) writes `"timing": true` into the run's slot lock.
- `--status` exits 1 for a live slot of another run whose lock carries `timing: true`, as it does for a standing exclusive hold. Every
  other slot does not gate, whatever its label says.
- `--status` prints the mark on that slot's line, so a reader by hand sees why.
- `--timing` does not imply `--exclusive`; the two stay separate, as label and hold were. GATES.md already says a timing session takes the
  exclusive hold, and it will say "both".

**Why a flag and not one exact phrase.** The label is prose written for people, so every phrase rule needs a negation list, and that list
is where today's failure lived. "not a timing" was excepted; "not timing" was not. A phrase rule would need "not a timing session", "no
timing session", "non-timing" and whatever the next seat writes, and it would always be one behind. A prefix rule ("the label begins with
TIMING SESSION") avoids negations, but it fights the room's habit of putting the seat and repo first ("t180 A D404 timing session" would
silently stop gating). A flag cannot be negated and cannot be set by accident. It is visible in the command line, in `--run`'s usage text,
in the lock file and in `--status`'s own line.

**One note, so the new failure is loud.** When a run's label contains the word "timing" and `--timing` is not given, `hold()` writes one
line to stderr. The line says labels are not read for this, that this run does not gate other seats' `--status`, and what to add if it is a
timing session. The note reads the label only to warn the person who wrote it, and never gates anyone, so a spurious note costs one line.
It fires on the "(not a timing session)" suffix seats use today, and its text says that suffix is no longer needed.

**What breaks under it.**
1. **A timing session started with a label only, without `--exclusive` or `--timing`, no longer gates `--status`.** That is the invisible
   direction: a light run could spoil its quiet window. It is covered three ways:
   - any session that follows GATES.md takes the exclusive hold, which gates exactly as before;
   - the note above tells the starter at the moment of starting;
   - GATES.md changes in the same commit.
   No tracked tool and no live script relies on the label: the label-only writers are dated evidence scripts.
2. **GATES.md's three counted examples** ("TIMING SESSION", "TIMING MEASURE", "PACING CHECK (TIMING)") no longer count. I rewrite the
   paragraph at `GATES.md:335-338`.
3. **The test row at `heavy-run.test.js:1341`** asserts those labels gate. That rule is what changed, so the row is amended by name, with a
   comment saying why. The amended row is the red-first row, with "(read, not timing)" and "(measure, not timing)" among its labels.
4. **Two mutant rows.** `heavy-run.mutants.js:135`, '"(not a timing session)" counts as one', loses its anchor because the regex is gone;
   I replace it with a mutant that reads the label again. The row 'CLI: --exclusive is not passed to hold()' anchors on the line that gains
   `timing`; I re-anchor it on `exclusive: flags.includes('--exclusive')`. Both are said in the hand-back's mutant table.
5. **`COMMITTEE.md:93-94`'s prose** ("a lock's `cmd` names a timing session") goes out of date. A seat that stops by hand on the word stops
   needlessly, which is the safe direction. The brief rides into every seat's shell, so I do not edit it here. §8 gives the replacement line,
   for the librarian to place.
6. **Seats' habit suffix "(not a timing session)"** becomes unneeded. It is harmless, and the note fires on it until it is dropped.

**Its falsifier, registered here before the code:** the rule is wrong if, by the end of the next lap that runs a timing session on either
machine, either happens:
- a run without `--timing` closes `--status` for another seat; or
- a session's window is found spoiled because it ran unmarked while `--status` read clear for others.
The second would mean the exclusive hold and the note together are not enough, and the flag should imply `--exclusive`.

## 3. The rule for `cmd C:/`: `--run` refuses cmd.exe given a drive where its switch should be

**The rule.**
- **What is refused.** The program is `cmd` or `cmd.exe` (by its base name, any case, with or without a path), and an argument before
  the first `/c` or `/k` switch is a bare drive: `C:/`, `C:\` or `C:`, any letter. That is Git Bash's rewrite of `/c` (and of `/d`, `/s`
  and `/k`). cmd.exe given no `/c` starts an interactive shell. It waits on its input with no CPU and holds the slot until someone stops it.
  This happened three times: B 11-12, 6 min; E 11-13, 40 min; A 11-27 on L, 13 min (`loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md`).
- **How it is refused.** Exit 2, and nothing starts. The refusal comes before `hold()`, so no slot is taken.
- **What the message says.** It names the form found, e.g. `cmd C:/`, and gives what to type instead:
  - the script given to `--run` itself (`-- <file.cmd> [args]`, which heavy-run starts from an argument list, D675);
  - or `cmd //c …` from Git Bash;
  - or `MSYS_NO_PATHCONV=1` set before the line.
- **What is not refused:**
  - `cmd /c …` with a drive after the switch (`cmd /c dir C:/` is a real command);
  - any program not named cmd;
  - `cmd` with no arguments, or with `/k`. Those are interactive by intent; they were never seen in the record, so they are left out.

**What breaks under it.** Nothing in the record. The refused form never ran anything but an idle shell, and the stall trace and the
`--run` usage text already name it as a defect.

**Its falsifier:** an idle cmd.exe holder started by a `--run` line again holds a slot after this lands.

## 4. Order of work

1. This section is committed first.
2. The rows, red at the base:
   - the amended timing row (labels are never read; a marked slot gates);
   - `--timing` writes the mark, and another seat's `--status` exits 1 during the run;
   - the note;
   - `cmd C:/` refused;
   - `cmd /c` with a drive after it still runs (a guard, green on both).
3. The code, then the rows green.
4. The whole `heavy-run.test.js`.
5. `heavy-run.mutants.js` whole, with the new rows.
6. GATES.md.
7. The credential scan, then the push.

Everything runs through the live `heavy-run.js --run --priority belownormal`, with labels that do not contain the word "timing".

Seat: pane O (sibling-36313935)
