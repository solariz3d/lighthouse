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

---

*Everything below was written after the work, in the same hand-back.*

## 5. What changed (`5b6a8f50`, over `0b8d6714`)

| file | change |
|---|---|
| `consonance/tools/heavy-run.js` | `acquire({ timing })` writes `timing: true` into the slot lock. `status()` gates on `h.timing === true`, never on the label. `namesTimingSession` is removed. The slot line shows `— a timing session (--timing)`, and the GATE line says `slot k is marked a timing session (--timing)`. `hold()` writes the note when a label mentions timing without the mark. `runCli` takes `--timing`, and its usage says so. `mangledCmd(prog)` and the refusal come before `--priority` and before `hold()`. 47 changed lines. |
| `consonance/tools/heavy-run.test.js` | The row at `:1341` is amended by name (its rule changed; the comment above it says why, and keeps the old labels as labels that no longer gate). Four rows are new: `RUN --timing`, the note, `cmd C:/` refused, and `cmd /c` intact runs. |
| `consonance/tools/heavy-run.mutants.js` | 129 → 142 rows. Row 91 (`--exclusive` not passed) is re-anchored, because its line now carries `--timing` too. Row 103 is renamed from "naming" to "marked", with the same anchor. '"(not a timing session)" counts as one' is replaced: its regex is gone, and the new row 104 reads the label again. Thirteen rows are new: 92, 105-109 and 122-128. |
| `consonance/GATES.md` | The take-the-hold rule, the `--status` paragraph (the label rule is replaced by the mark, with the 11-27 reason), "Add `--exclusive --timing` for a timing session", and a paragraph on the `cmd C:/` refusal. |

checked: `git diff --stat a57d800c 5b6a8f50` → 5 files, +288/−34, the hand-back included.

No app rebuild is needed. `heavy-run.js` is a node script that every caller `require`s or runs fresh, and nothing of it is compiled into the app. checked: `git grep -n heavy-run -- consonance/src-tauri/src` → one index title string in main.rs:21393, nothing that runs it.

## 6. Rows, red first, then green

**Red, at the base code** (the rows in place, `heavy-run.js` still at `a57d800c`). checked: `G:/consonance-scratch/o-hr-red.a57d800c.txt` → 5 tests, 1 pass, 4 fail.

| row | at a57d800c | why it is red |
|---|---|---|
| STATUS: a slot MARKED a timing session gates; a label is never read | **red** | `"B D678 even read: node only", marked: exit 0` |
| RUN --timing: the slot lock carries the mark; another seat's `--status` exits 1 | **red** | `the run's slot lock carries the mark`: undefined |
| RUN: a label with "timing" and no `--timing` gets the note | **red** | stderr `''` |
| RUN: `cmd C:/` refused by name, exit 2, before any wait | **red** | `cmd C:/ …\job.cmd w: exit 3`: it waited on the other seat's hold and gave up |
| RUN: `cmd /c` intact runs, a drive after the switch included | green (a guard) | — |

The STATUS row went red on its marked half first, so its unmarked half (the "(read, not timing)" labels) was not exercised red at the base. Mutant 104, which makes the code read the label again, is what shows that half bites (§7).

**Green, the whole file at `5b6a8f50`.** checked: `G:/consonance-scratch/o-hr-green.txt` → tests 141, pass 141, fail 0, 38 s.

**A consumer.** `chain-status.js` (the pulse's IDLE HOLDER line) calls `HR.status()` and `describeHolder`. checked: `G:/consonance-scratch/o-hr-chain.txt` → tests 172, pass 172, fail 0. checked: `git grep -lE "require\([^)]*heavy-run(\.js)?['\"]\)" -- ':!exo_memory'`, with heavy-run's own test and mutants dropped → 25 files: 22 `.js` (heavy-run.js itself among them), plus GATES.md, COMMITTEE.md and `.claude/skills/heavy-run-lock/SKILL.md`. Of the `.js`, only `chain-status.js` and heavy-run.js read `status()`/`statusReport`/`timingSlots`, and `grep timing` finds no line in any of the 21 others. So none passes a mark or reads one. The skill does not restate the label rule: its line 12 points at COMMITTEE.md, and §8 covers that.

**On the live lock files, read only.** checked: worktree `heavy-run.js --status` at about 21:18Z → no GATE line; the live tool → exit 0. At that moment the slots held my unit 1-36 and A's "(not a timing session)" run.

## 7. Mutants: `heavy-run.mutants.js` whole, four units

Each unit ran through `heavy-run.js --run --priority belownormal`, labelled "O D678 N1 heavy-run.mutants <unit>". Each unit has its own control: pass 141, fail 0, in 39 s; each mutant is stopped at 116-117 s.

| unit | applied | caught | NOT APPLIED | NOT READ | source |
|---|---|---|---|---|---|
| 1-36 | 36 | 36 | 0 | 0 | `o-hr-mut.1-36.txt` |
| 37-72 | 36 | 36 | 0 | 0 | `o-hr-mut.37-72.txt` |
| 73-108 | 36 | 36 | 0 | 0 | `o-hr-mut.73-108.txt` |
| 109-142 | 34 | 34 | 0 | 0 | `o-hr-mut.109-142.txt` |
| **whole** | **142** | **142** | **0** | **0** | |

The new and changed rows, with the row that caught each:

| # | mutant | caught by |
|---|---|---|
| 91 | `--exclusive` not passed (re-anchored) | D663 CLI `--run --exclusive` |
| 92 | `--timing` not passed | RUN --timing |
| 103 | a marked slot does not gate | STATUS marked |
| 104 | the label is read again | STATUS marked, and RUN --timing (2 fail) |
| 105 | any truthy mark gates (`"true"`, `1`) | STATUS marked |
| 106 | the slot line does not show the mark | STATUS marked |
| 107 | the slot lock does not carry the mark | RUN --timing |
| 108 | no note for "timing" without `--timing` | the note row |
| 109 | the note fires with `--timing` too | the note row |
| 122 | `cmd C:/` runs | `cmd C:/` refused |
| 123 | a drive after `/c` is refused too | `cmd /c` intact runs |
| 124 | only `cmd.exe` with its `.exe` is known | `cmd C:/` refused |
| 125 | a drive without a slash passes (`cmd C:`) | `cmd C:/` refused |
| 126 | `/C` in capitals is not the switch | `cmd /c` intact runs (`/D /C <script> D:/`) |
| 127 | the refusal does not say what to type | `cmd C:/` refused |
| 128 | the refusal comes after the wait | `cmd C:/` refused, RUN --timing and the note row (3 fail). inferred: the mutant's early `hold()` is not passed `--timing`, so the mark is lost and the note fires; the harness prints only the failing rows' names |

## 8. For the librarian: the brief line this changes (not edited here)

`consonance/src-tauri/brief/COMMITTEE.md:93-94` still reads "EXCEPT while a lock's `cmd` names a timing session: then run nothing at all".
The brief rides into every seat's shell, so I leave the edit to you. The replacement I propose:

> EXCEPT while `node consonance/tools/heavy-run.js --status` exits 1 (an exclusive hold stands, or a slot is marked a timing
> session with `--run --timing`; a lock's label is never read for that): then run nothing at all …

The rest of the sentence stays as it is. Until it is placed, a seat that stops by hand on the word "timing" stops needlessly, which is the safe direction.

## 9. Landing

**The whole JS suite**, before the push, on `5b6a8f50` through `heavy-run.js --run --priority belownormal` ("O D678 N1 js-suite whole, before the push").
checked: `G:/consonance-scratch/o-hr-suite.txt` → `js-suite: 204 green · 3 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 1 not-run · 0 class-error (of 209)`.

All three failed files were already red at the base. I ran each one on a detached worktree of `a57d800c` and on my branch:

| file | at a57d800c | on the branch | the same tests? |
|---|---|---|---|
| `carrier-drift.test.js` | 57 pass, 3 fail | 57 pass, 3 fail | yes. The output differs only in the corpus count (3801 → 3802 carriers, my hand-back) |
| `gen-consumer.test.js` | 115 pass, 1 fail | 115 pass, 1 fail | yes: D454, the t180 research withheld (new `exo_memory/research/t180_*` notes, not mine) |
| `portable-paths.test.js` | 41 pass, 2 fail, **8** sites | 41 pass, 2 fail, **17** sites | the same two tests, but **9 of the 17 sites were mine** |

checked: `G:/consonance-scratch/o-hr-3.<file>.<o-heavyrun|o-hr-basewt>.txt`.

**portable-paths: my change made a red guard redder, and the suite caught it before the push.** The 9 sites are this lap's test and
mutant strings: the `cmd C:/` fixtures in the rows, and the drive regex in the mutant anchors. The tool classes all 9 as BENIGN-TEST or
BENIGN-FIXTURE. `--update` was not usable as precedent `fe69a9fc` used it, because it would also have baselined the 8 sites that
were already red. Those are all FATAL-SHIPPED-INSTRUCTION, in four of 11-27's `exo_memory/research/` notes (`t180_what_separates_a_break`
x5, `t180_car_how_it_works`, `t180_cars_body_against_box`, `hearing_a_voice_in_a_mix`); they are not mine to exempt, and they are a
shipped-instruction class. So I ran `--update` against a scratch copy, took the 9 rows it added for `heavy-run.{test,mutants}.js`, and
merged only those. The script is `G:/consonance-scratch/o-pp-merge.js`: --update would add 17 and remove 0, and the old counts
re-derive from the old rows. checked: `node consonance/tools/portable-paths.js` → `RED — 8 machine-specific path(s) not in the
baseline`, the base's 8, none of them in a heavy-run file; `portable-paths.test.js` → 41 pass, 2 fail, as at the base. The baseline
diff is 9 rows plus BENIGN-TEST 426 → 432 and BENIGN-FIXTURE 12 → 15.

**For the librarian, not mine to fix:** the three reds above stand on main from before this lap, and two are new on 11-27:
- portable-paths' 8 FATAL sites;
- gen-consumer's D454, the t180 research notes reaching the consumer build.

I did not re-run the whole suite after the baseline change, because the baseline is read by `portable-paths` alone; its own test is above.

**No app rebuild.** See §5.

**The push.** `BUILDING.md:52` makes pushes a landing pane's work; the packet gave this one to me, for the room's own tool, so I acted as its landing pane. I ran the full suite, the
credential scan (below), rebased onto the latest `origin/main`, and pushed fast-forward. The 11 commits I rebased over
touch only `exo_memory/`, none of this lap's files.

- Rebased onto `origin/main` `cbf90b07`: clean, and `consonance/` is identical before and after.
  checked: `git diff 7c0fe18d 1b365275 -- consonance` → empty.
- Credential scan on the rebased branch.
  checked: `push-gate.js decide("… git push origin o-d678-heavyrun:main")` → `allow`; `landing-train.js privacyScan(<worktree>, "origin", "main")` → `{"ok":true,"found":[]}`.
- `portable-paths` after the rebase.
  checked: → `RED — 8`, 0 of them in a heavy-run file.
- Pushed fast-forward, `o-d678-heavyrun` → `origin/main`. The pushed head is the commit that adds this section.
  checked by: `git log -1 --format=%h -- exo_memory/handback/p-d678-heavyrun-stalls-O_2026-11-27.md` on main; the ring gives the sha.

## 10. Corrections

- Two of my own, both caught before the commit:
  - My first draft of mutant 128 ("the refusal comes after the wait") replaced only the spawn line and left the early refusal in place, so it
    could not change anything. I replaced it with a one-anchor mutant that takes the hold before deciding.
  - Mutant 126 (the switch matched without `/i`) would have survived, because row C2's `/D /C` case had no drive after the switch. C2 now passes
    `D:/` after `/C`. I made that edit while the red run was still waiting for a slot. Its output cannot say which version it loaded, because the
    row's name is the same in both. So I re-ran the two cmd rows on the base code alone (`a57d800c`'s `heavy-run.js` with the committed rows).
    checked: `G:/consonance-scratch/o-hr-base-c2.txt` → C2 (with `D:/`) passes and C1 fails (exit 3), so the guard holds as registered.
- The Bash tool stripped a backslash from GATES.md's "`C:\`" during the edit. I put it back with Edit before the commit (checked: `grep -n "bare drive" consonance/GATES.md`).
- My first ring, at 22:0xZ, was refused: the pointer was a path in my worktree, not in the checkout. I posted the status on the board instead.
- I did not run `portable-paths` on my own change before the whole suite, and it added 9 sites to a guard that was already red (§9). The suite caught it
  before the push; they are baselined by name now. A change that adds drive-shaped strings to test rows should run `portable-paths.js` with its rows.
- Three figures in my first draft of §6-§7 had no command behind them, and I re-derived them before the commit:
  - "23 callers" did not reproduce; the real count is 25 files (22 `.js`), by the command now beside it.
  - the `--status` check was dated 22:1xZ; it ran at about 21:18Z.
  - mutant 128's "exit 3 … reentrant" was a cause I had not checked; it is marked `inferred:` now.

## 11. Load and what is left running

- Every heavy run took a slot through the live `heavy-run.js --run --priority belownormal` (capped to 8 of 16 logical CPUs). There were seven:
  the red rows, the whole file, the four mutant units, and js-suite. The three files in §9, the base-code C2 check and the `--status` reads were
  each 3 files or fewer, or read only.
- No label of mine contained the word "timing".
- Nothing of mine is left running: every background task I started has exited.
- The detached base worktree `G:/consonance-scratch/o-hr-basewt` is removed after the push.
- Scratch outputs (`o-hr-*.txt`, `o-pp-*`) stay on G: as the evidence above names them, uncommitted.

Seat: pane O (sibling-36313935)
