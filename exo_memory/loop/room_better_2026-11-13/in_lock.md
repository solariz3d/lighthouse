# Machine time on 2026-11-13: the heavy-run lock, the memory gate and the landing train (inside reader)

Research only. Times are UTC (Z) unless marked local. L's local clock is UTC-6: E's L185 build "started at
03:59:36.69 local" (`exo_memory/handback/p-l185-skeleton-E_2026-11-12.md:154`) and its merge commit 682e699 is stamped
`2026-11-13T03:59:36-06:00` (dreamzone-3 `git log`) [read].

## Where the numbers come from, and the gap in them

- The lock keeps no log. "There is no separate log file" (`consonance/tools/heavy-run.js:34`). Waits exist only where a
  seat wrote them down [read].
- The train's log and READY list live on L only: `C:\Consonance\data\landing-ready.jsonl` and `landing-train.jsonl`
  (`exo_memory/handback/p-l194-landing-train-B_2026-11-13.md:18-22`) [read].
- This machine (D, `machine_tag "D"` in `~/.consonance.json`) has neither file in `C:\Consonance\data`, no lock or hold
  file from 11-13 (only four `heavy-run.lock.stale-*` files from September and October), and 11 board lines dated 11-13,
  all from 14:42Z on, none about the lock [read: `ls`, a node count over `board.jsonl`].
  second reader: true only before 14:47:45Z. At ~14:57Z D's data dir holds `heavy-run.lock` started 14:47:45Z, pid 18080
  alive in `tasklist`, cmd "dreamzone-3 P on D: build.bat and build.bat test at 31d1c6d (not a timing session)"; the board
  then has 164 lines in 11-13 UTC, 16 naming the lock or hold, and 12 (not 11) before 14:46Z [read: `cat`, `tasklist`,
  a node count over `ts`]. The 11 is not reproduced; the probe time is not in the file.
- So every wait below is from a hand-back, the librarian's notes, a commit message or dreamzone-3 commit times.
  Nobody's instrument measured total wait for the day [inferred].

## How long seats waited on 2026-11-13, and what held the lock or the gate

| when (Z) | who waited | on what | how long | source |
|---|---|---|---|---|
| ~07:04 | A's arm sweep; E's mutant rerun | the low-memory reaper, not the lock; E's was waiting for the lock when reaped | A lost ~12 min of a3 block 1; E left a mutated file and an orphan waiter | `loop/stall_trace_lowmem_reaper_2026-11-13.md:7`, `:40` [read] |
| 08:45-08:54 | C's L191 hand landing | A's a4 block 151 sweep | 9 min | `handback/p-l191-arm-shape-C_2026-11-13.md:112` [read] |
| from ~08:50 | E's L185 head-row proof | A's arms, "back to back" | end not in what I opened; second reader: bounded, L185 lands only after this proof (`:203`) and its merge 682e699 is 09:59:36Z, so at most ~70 min [inferred] | `handback/p-l192-footsteps-E_2026-11-13.md:202-203` [read] |
| 11:02:16 on | the train (batch c9d520e) | the exclusive hold, behind C's and E's runs | not split out; whole landing 18 min 57 s | `p-l194-landing-train-B:156`, `:159` [read]; arithmetic [inferred] |
| ~~to ~11:52~~ second reader: end not at `:213`; the line sits under the "05:4x" local heading (`:207`), so it ended by ~11:49Z [inferred] | A's chain (build, 7 rows, 16 mutants); second reader: `:213` names only "a chain of 16 mutants" | the train | 41 min | `librarian/2026-11-13.md:213` [read] |
| 11:52 | A's mutants, one slot each | C's L200 run, E's yardstick build, the train's hold | "starved between them"; minutes not recorded | `librarian/2026-11-13.md:220` [read] |
| 11:50:47-12:30 | everyone needing slot 2 | E's build wrapper whose only child was an idle `cmd.exe C:/` | 40 min | `handback/p-l193-yardstick-E_2026-11-13.md:251-256`; `librarian/2026-11-13.md:254` [read]; second reader: the times 11:50:47Z to 12:30Z are at E's `:248`, not in `:251-256` (which says "about 11:47Z") [read] |
| ~11:51-12:21 | the train | the exclusive hold not free (slots held) | 30 min, then the train CRASHED on HEAVY_RUN_TIMEOUT | commit f415383b message [read]; 30 min is `MAX_WAIT_MS`, `heavy-run.js:107` [read]; second reader: the message gives only "at 12:21Z"; 11:51 is 12:21 less 30 min [inferred] |
| 12:2x-12:23:06 | C's L195 and L200 checks | the memory gate: commit headroom 5,895 / 5,993 MB under 6,144 | minutes; cleared 12:23:06 | `handback/p-l195-arm-variants-C_2026-11-13.md:254-255`; `p-l200-legs-C:89-90` [read] |
| 12:26 | C's landing check | the memory gate: commit free 5,387 MB | not recorded | `librarian/2026-11-13.md:250` [read] |
| 12:44-12:48 | the train | B's guard mutants run on the room's lock | 4 min | `handback/p-l202-idle-holder-guard-B_2026-11-13.md:65`; `librarian/2026-11-13.md:295` [read] |
| ~30 min, ~~before ~12:48~~ second reader: the grep "started 06:33" local (`stall_trace_lowmem_reaper:46`), 12:33Z at UTC-6, so 30 min of it cannot end by 12:48Z; window unresolved [inferred] | the train | the memory gate: an orphaned `grep -o` with a 16000-wide repeat, 6.3 GB commit | ~30 min | `loop/stall_trace_lowmem_reaper_2026-11-13.md:46-47`; `p-record-owner-A_2026-11-13.md:79` [read] |
| 11:21:13-13:00:53 | four READY branches | all of the above, and no seat owning "start the train" | 99 min 40 s with nothing landed | `loop/handoff_lighthouse_2026-11-13-L.md:62`; `librarian/2026-11-13.md:280` [read]; arithmetic [inferred] |
| ~~after 13:00~~ second reader: time not stated; `:62`, written before the landing section, already says the rows had not run because "the train held the exclusive heavy-run hold", so before the 13:00:53Z landing [inferred] | A's re-run of Lap R's 7 rows | "other seats' holds" | gave up at the wait limit (30 min) | ~~`p-record-owner-A_2026-11-13.md:77`~~ second reader: the quote is at `:78`; `:77` is the heading [read]; the limit [inferred from `heavy-run.js:107`] |
| 13:27:16-13:27:50 | the train (batch 31d1c6d) | the exclusive hold | 34 s | `handback/p-d673-overtime-A_2026-11-13.md:61` [read] |

Sum of the waits I can put minutes on (9 + 41 + 40 + 30 + 4 + 30) is about 154 seat-minutes. Several overlap in time,
so this is not wall-clock [inferred]. The waits with no minutes recorded are not in that figure.

**What held the machine, by kind** [inferred from the table]:
- a sweep or a mutant chain holding slots back to back (A's arms 08:45-08:54; A's 16 mutants; B's guard mutants);
- a holder doing nothing (E's idle shell, 40 min; the 11-12 trace is the same fault, `loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md`);
- memory that no lock covers (a runaway grep from a research swarm, 6.3 GB; a lockless 1.1 GB `world_app_tests` at the
  07:04 reap, `stall_trace_lowmem_reaper:15`, `:18`);
- nobody starting the train ("nobody had run it for about 50 minutes", `p-record-owner-A:79`) [read].

**A conflict in the record, left standing.** A writes that it ran the train "at 06:58" local and ended the grep "at
06:55" (`p-record-owner-A:79`); the stall trace places the grep "~06:58 to 07:10 local" (`stall_trace_lowmem_reaper:45`).
The train's merge commits for that batch are stamped `06:45:40-06:45:41 -06:00` (15f7c58 to cc8eea8, dreamzone-3
`git log`), and the librarian found the 6.3 GB grep already gone at 12:48Z (`librarian/2026-11-13.md:293`) [read].
A train cannot merge before it is started, so one of the local times is off. Which one is not shown [inferred].
second reader: two more times sit in the same knot. The grep "started 06:33" (`stall_trace_lowmem_reaper:46`), and
B's waiter "started 12:43Z" (`librarian/2026-11-13.md:280`) [read]. The train merges BEFORE the gate (`landing-train.js:234`
`mergeBatch`, then `:241` `check`, whose gate is `:188-196`) [read], so the run that landed spent at most 15 min 12 s at the
gate and hold (12:45:41 to 13:00:53Z). If the gate held a train for half an hour, it was an earlier attempt [inferred].
The gate was also already short before this grep: 12:2xZ and 12:26Z (rows above), "nothing of the room's running"
(`p-l195-arm-variants-C:255`), and a first runaway grep (1,552 MB, repeat 7,000, commit free down to 3,956 MB) is at
`librarian/2026-11-13.md:255` [read]. Cost of the knot: not recorded.

## How long suites and landings take

| run | wall | source |
|---|---|---|
| 11 suites one after another, quiet machine (L174) | 644 s | `p-l194-landing-train-B:79` [read] |
| 12 suites one after another at 682e699 (E's landing) | 1,087.7 s | `p-l194-landing-train-B:78-79` [read] |
| 11 suites serial, busy machine (L188) | 1,092.05 s; chase 360.9, world_app 503.1 | `handback/p-l188-fpbody-B_2026-11-13.md:121-123` [read] |
| 12 suites at `ctest -j 3` (c9d520e) | 520.55 s | `p-l194-landing-train-B:78` [read] |
| `chase_tests` alone (A) | 385 s | `p-record-owner-A_2026-11-13.md:62` [read] |
| hand landing L185: merge to "LANDING GREEN" | 20 min 57 s (09:59:36 to 10:20:33) | `p-l185-skeleton-E_2026-11-12.md:154`, `:159` [read]; arithmetic [inferred] |
| train c9d520e: start to scan row (includes hold wait and a first full build, 354 steps at 4 jobs) | 18 min 57 s | `p-l194-landing-train-B:156-159` [read]; arithmetic [inferred] |
| train cc8eea8: merge commit to landed (includes any gate and hold wait after the merge) | 15 min 12 s | dreamzone-3 merge stamps 06:45:41 -06:00; landed 13:00:53Z, `p-record-owner-A:77` [read] |
| train 31d1c6d: start to landed | 12 min 51 s; 12 min 17 s under the hold | `p-d673-overtime-A:61` [read]; arithmetic [inferred] |
| `heavy-run.test.js` with the idle guard (101 rows) | 54 s | `p-l202-idle-holder-guard-B:9` [read] |
| `landing-train.mutants.js` | "about 6 min", holds the tree's lock | `p-l194-landing-train-B:11-12` [read] |

- A train landing today is about 13 to 19 minutes, all of it under the exclusive hold once the hold is taken; the
  suites are about 9 of those [inferred from the rows above].
- The 520 s against 1,088 s "compares two different moments of a shared machine", not a timing run
  (`p-l194-landing-train-B:169-170`) [read].
- Memory at `-j 3`: peak seen ~3.9 GB (chase 2,556 + world_app 1,219 + gen_walk 137); estimated 5,017 MB for the three
  largest together, under the gate's 6,144 MB commit floor (`p-l194-landing-train-B:68-70`, `:83`) [read].

## How the instruments behave (from the code)

- **Slots, not a queue.** Two slots by default, one run per git tree; a waiter polls every 2 s, says whom it waits on
  once a minute, and fails loudly after 30 min (`heavy-run.js:14-23`, `:107-109`) [read]. Among waiters there is no
  order: whoever claims a free slot first wins [inferred from the claim-and-recheck at `:18-20`].
- **The exclusive hold is written first, then waits.** `hold({exclusive:true})` writes `heavy-run.hold` with `'wx'` and
  only then waits for every slot to empty; while it exists every other runner waits (`heavy-run.js:77-86`, `:451-466`)
  [read]. So a train waiting for slots parks the room. B names this: "the train's exclusive hold parks the room while it
  waits for slots" (`p-l194-landing-train-B:16-17`) [read]. Cost: not separated in the record; it is inside the 11:51-12:21
  window [inferred].
- **The train takes the hold per attempt** (~~`landing-train.js:44-45`~~ second reader: `:45-46`, `:44` is a blank comment line [read]; `:391`) and runs BelowNormal (`:413-414`) [read].
- **The memory gate is checked before the hold, every 30 s, for up to `gate_wait_s` (default 1,800 s)**
  (`landing-train.js:188-196`) [read]. It is checked at start only; a run that has started is not stopped
  (`p-l194-landing-train-B:167-168`) [read].
- **The gate's message still prints the tail** of memwatch's line: `say(\`memory gate short; waiting:
  ${g.text.trim().slice(-120)}\`)` at `landing-train.js:194` at HEAD a081de4f [read]. The stall trace says the tail cut
  off the one process that mattered for half an hour (`stall_trace_lowmem_reaper:48`) [read]. Cost: about 30 min of a
  hidden cause.
- **The lock does not see memory.** A run of 3 test files or fewer takes no lock
  (`consonance/src-tauri/brief/COMMITTEE.md:93`) [read], and a 1.1 GB `world_app_tests` ran beside a holder at the 07:04
  reap (`stall_trace_lowmem_reaper:15`, `:18`) [read].
- **The idle-holder guard is built and not live:** lighthouse `l202-idle-guard` 901d3c39, 101 of 101, mutants 5 of 5, not
  merged (`p-l202-idle-holder-guard-B:6-9`, second reader: the branch and sha are at `:5` [read]; `loop/handoff_dreamzone3_2026-11-13-L.md:117`) [read].
- Test rows today: `landing-train.test.js` 17 `test(` calls, `heavy-run.test.js` 96 [read: grep count]. second reader: a plain `grep -c "test("` returns 108 for
  `heavy-run.test.js`; a line-start `test(` pattern returns 96, matching B's "96 rows" (`p-l202-idle-holder-guard-B:9`)
  [read]. 17 for `landing-train.test.js` reproduces either way. The 21st train
  mutant (12832fad) is "written and NOT yet run" (`p-l194-landing-train-B:9-10`) [read].

## What a second machine would change

Facts in hand:
- L: 32,537 MB physical (`stall_trace_lowmem_reaper:11`); "about 20 GB was already committed with nothing of mine
  running" (`:14`) [read]. heavy-run.js calls it "a 32-thread laptop" (~~`heavy-run.js:70`~~ second reader: `:71` [read]) [read].
- D (this machine, probed now with node `os`): 16 logical CPUs, AMD Ryzen 7 9850X3D, 62,885 MB total, 41,830 MB free at
  the probe [read]. D's profile caps heavy runs at 8 CPUs (`~/.consonance.json`, `"heavy": {"cpus": 8}`) [read].
- The lock and the gate are per machine: the lock lives in that machine's data dir (`heavy-run.js:10-11`) [read].
- "Whether D can take builds and tests for L's panes is not measured" (`loop/handoff_lighthouse_2026-11-13-L.md:67`);
  the librarian calls it "the largest single gain I can name and I have not measured it" (`librarian/2026-11-13.md:321`)
  [read].
- second reader: a run of that kind is under way on D now: the lock above names a dreamzone-3 `build.bat` and
  `build.bat test` at 31d1c6d, the sha of L's last train landing (`p-d673-overtime-A:60`) [read]. Its result is not in
  anything I opened. Note its tree reads "(not in a git tree)", so it shares the one non-git bucket (`heavy-run.js:17`).

Options, with what each would and would not have touched today [ours, all inferred]:
1. **Move sweeps and mutants to the second machine; keep the train on the machine with his game.** Today's slot
   contention from A's arms, A's 16 mutants and B's guard mutants (9 + 41 + 4 min, plus the starved minutes) leaves L.
   Needs the branch on origin and a worktree and submodules on D (the recipe is `p-l194-landing-train-B:23-25`). Does not
   touch the idle holder (40 min) or the runaway grep (30 min); those happen on whichever machine runs them.
2. **A second train on D.** Two trains would race for main. The train already lands nothing when "main moved under the
   train" (`landing-train.js:37`) [read], so the cost of a race is one rerun of 13-19 min, not a bad landing. Promotion to
   his game folder is one machine's job.
3. **Memory headroom.** D has about twice L's RAM. Today's gate refusals (commit 5,387-5,993 MB against 6,144) might not
   happen on D, but D's commit baseline has not been measured, so this is not shown.
4. **What it costs.** A result from D is about a sha built on D's toolchain; whether D builds dreamzone-3 the same way is
   not measured. Timing tests are a per-machine field (`heavy-run.js:73-74`). The keeper's request for this run says
   "rebuild didnt succeed" ~~on the desktop~~ second reader: his words do not say where; verbatim at
   `librarian/2026-11-13.md:387`, under a heading the librarian wrote, "BACK ON D" [read]; what failed is not in what I opened. Before D carries work, one control run of
   the same sha on both machines would say whether D's suites agree with L's.

## What a queue with priorities would change

Today: no order among waiters, a 30-min limit then failure, and the hold claims the room while it waits. The handoff
lists "The lock's queue is invisible: short runs parked behind 16 mutants" (`handoff_lighthouse_2026-11-13-L.md:63`)
[read].

Options [ours]:
1. **Classes: landing > a pane's rows > sweeps and mutants, first-come within a class.** On today's record the train and
   A's 7 Lap R rows would have gone ahead of A's 16 mutants ~~(41 min)~~ and B's guard mutants (4 min). second reader: the
   41 min was A's mutants waiting BEHIND the train ("A waited 41 minutes behind the train for a chain of 16 mutants",
   `librarian/2026-11-13.md:213`) [read], the order a landing-first class already gives; a queue saves none of it. The
   ordering case is "short runs parked behind 16 mutants" (`handoff_lighthouse_2026-11-13-L.md:63`), minutes not recorded. The run plan already
   says so in words: "Landings never wait in line behind sweeps or mutants" (`loop/plan_13h_run_2026-11-13.md:238`)
   [read]; a queue would make the words a mechanism [inferred]. Risk: the lowest class starves, as A's mutants did at 11:52;
   it needs an aging rule.
2. **A visible queue file** (who waits, since when, for what class). This would have shown the train behind B's mutants
   without the chair having to find it (`librarian/2026-11-13.md:295`) [inferred].
3. **Reserve, do not park.** Let the train's hold block only NEW long runs while slots drain, so a 1-minute row run is not
   parked behind a 30-min wait. B's scratch `l194_waitfree.sh` does a version of this outside the train
   (`p-l194-landing-train-B:16-17`) [read]. second reader: B's script waits for both slots free, no hold and the gate clear
   BEFORE it starts the train (`:16-17`) [read]: it avoids parking but reserves nothing, so the train gets no priority.
4. **Mutants in units.** `heavy-run.mutants.js --only` now takes a range (`p-l202-idle-holder-guard-B:59`) [read], so
   a chain can yield between units to a higher class [inferred].
5. **What a queue does not fix:** the idle holder (needs L202 live), memory outside the lock (needs the gate on every heavy
   start and a `timeout` on long greps, `stall_trace_lowmem_reaper:50`), the gate message tail (`landing-train.js:194`),
   and no owner for starting the train (`handoff_dreamzone3_2026-11-13-L.md:16`). By minutes, those four account for more
   of today's 100-minute gap than ordering does [inferred from the table: ~~40 + 30 + 30~~ named against 4 + the starved
   minutes]. second reader: 40 + 30. The gate-message tail's half hour IS the runaway grep's half hour
   (`stall_trace_lowmem_reaper:48`: "For half an hour the train said ...") [read], so the 30 was counted twice. And the
   train's 30-min hold timeout (11:51-12:21) sat inside the idle holder's 40 (11:50:47-12:30), one cause [inferred].
   The conclusion survives (70 against 4 + the starved minutes); the margin is smaller.

## What I did not open

- L's data folder: `landing-train.jsonl`, `landing-ready.jsonl`, the 11-13 lock and hold files, `push-gate.jsonl` rows,
  memwatch's `mem.jsonl`. They are on L, not on D. Every wait above is therefore from prose, not from a log.
- L's board for 11-13. D's board has 11 lines that day, none on the lock.
- Seats' scratchpads: A's `train_run_A.txt`, `train_run_A2.txt`, `l170/chain_lapr/`; C's `land.log`; B's
  `l194_waitfree.sh`; E's `scratchpad/l185/`.
- `heavy-run.js` lines 141-419 and 471-595 (slot scan, takeover, CPU cap); the bodies of `heavy-run.test.js`,
  `landing-train.test.js` and both `.mutants.js` files (counted, not read); `landing-train-dz3-check.cmd`,
  `landing-train-dz3-guard.cmd`; `memory-sweep.js`; `exo_memory/loop/memwatch_2026-11-13.js`.
- The L202 branch (901d3c39) and its hand-back beyond lines 1-72.
- The end of E's L185 proof wait, and the start time of the train run that merged cc8eea8.
- Why the desktop rebuild failed.

## Second reader

Read-only, 2026-11-13 ~14:50-15:05Z on D. Strikes and notes are in place above, each marked "second reader:".

**Checked and held** (opened the file at the line, or ran the command) [read]:
- `p-l185-skeleton-E_2026-11-12.md:154`, `:159`; dreamzone-3 stamps of 682e699 (03:59:36-06:00), 15f7c58 (06:45:40),
  cc8eea8 (06:45:41), c9d520e (05:02:19), 31d1c6d (07:27:18), all `git log -1 --format=%cI`.
- `heavy-run.js:10-11`, `:14-23`, `:34`, `:73-74`, `:77-86`, `:107-109`, `:451-466` (the hold is written with 'wx' at
  `:464`, before the slot wait).
- `landing-train.js:37`, `:188-196`, `:194` (unchanged since f415383b, so also at a081de4f), `:391`, `:413-414`.
- Commit f415383b message: "it crashed on HEAVY_RUN_TIMEOUT at 12:21Z".
- `librarian/2026-11-13.md:213`, `:220`, `:250`, `:254`, `:280`, `:293`, `:295`, `:321`.
- `stall_trace_lowmem_reaper_2026-11-13.md:7`, `:11`, `:14`, `:15`, `:18`, `:40`, `:45-48`, `:50`.
- `p-record-owner-A_2026-11-13.md:62`, `:77`, `:79`; `p-d673-overtime-A_2026-11-13.md:61`.
- `p-l194-landing-train-B_2026-11-13.md:9-12`, `:16-25`, `:68-70`, `:78-83`, `:156-159`, `:167-170`.
- `p-l191-arm-shape-C:112`; `p-l192-footsteps-E:202-203`; `p-l195-arm-variants-C:254-255`; `p-l200-legs-C:89-90`;
  `p-l202-idle-holder-guard-B:5-9`, `:59`, `:65`; `p-l188-fpbody-B:121-123`.
- `handoff_lighthouse_2026-11-13-L.md:62`, `:63`, `:67`; `handoff_dreamzone3_2026-11-13-L.md:16`, `:117`;
  `COMMITTEE.md:93`; `plan_13h_run_2026-11-13.md:238`.
- D: `machine_tag` "D", `heavy` {"cpus":8}; node `os`: 16 CPUs, Ryzen 7 9850X3D, 62,885 MB total.
- Every subtraction and sum in the file: 20:57, 18:57, 15:12, 12:51, 12:17, 34 s, 99:40, 154, 3,912, 5,017, 1.93x RAM.

**Struck** (5):
1. Option 1 of the queue: "(41 min)" credited to ordering. `librarian:213` says A's mutants waited BEHIND the train.
   Cost: the queue case reads 41 min stronger than the record supports.
2. The last option's "40 + 30 + 30": the gate-tail half hour and the grep half hour are one interval. Cost: 30 min
   counted twice in the case against ordering.
3. Row "after 13:00" for A's re-run: not stated; `:62` places it before the landing. Citation `:77` is `:78`.
4. Row "~30 min, before ~12:48": the grep's own start, 06:33 local, makes both together impossible.
5. Row "to ~11:52": not in `:213`; the note's heading bounds it at ~11:49Z.
Also struck: "on the desktop" (not in his words), and two off-by-one citations (`heavy-run.js:70` is `:71`;
`landing-train.js:44-45` is `:45-46`). Citation fixes added, not struck: E's yardstick times at `:248`; B's branch at `:5`.

**Updated, not struck:** D's data dir and board changed after the author's probe (a live lock from 14:47:45Z, P's
dreamzone-3 build and test at 31d1c6d on D). That run is the control run option 4 asks for; its result is not on disk
that I found.

**Could not check:** the author's board count of 11 (the probe time is not stated; 12 before 14:46Z now); anything in
L's data folder (`landing-train.jsonl`, `landing-ready.jsonl`, `mem.jsonl`), which is not on D; which of A's 06:55 /
06:58, the librarian's 12:48Z or the merge stamps is off; the 2 s poll and "once a minute" behaviour at run time (read
in comments only, not in the code body `:141-419`); what "rebuild didnt succeed" refers to.
