# H2: does splitting a multi-part task across panes finish it sooner? The controlled test, REGISTERED (D290 part 2, ledger row D291)

Pane B, machine D, 2026-10-11. **Registration only: nothing has been run.** This file is sealed by its commit before any arm starts. Any change after that is an amendment with its own date, and it may not touch §6 (the bar) or §7 (the degeneracy conditions) once the first arm of pair 1 has been dispatched.

Plan: `loop/plan_retrieval_resume_d290_2026-10-11.md`, Part 2 (main `f41b3419`).

## 0. Why the ledger cannot answer this, and what that rules out here
- **H2 as first registered** (`loop/plan_loop_friction_2026-10-09.md:49-52`): "a task with ≥ 3 independent parts finishes sooner split across panes (including the merge) than on one pane."
- **A's scoring** (`loop/loop_friction_A_2026-10-09.md:20-24, 98-116`) found three faults in the ledger:
  - The split group is the big-task group: the chair splits big tasks, and `lap.jsonl` has no part count.
  - The merge is invisible: the "tail" is a median 0.0–0.1 min in every class.
  - The kind of work is uncontrolled.
- **The scorer's ruling** (`loop/loop_friction_score_2026-10-09.md:23-26`): FALSE as registered, UNDECIDED in substance.
- **So this test must:**
  1. hold the task fixed across the two arms, so size and kind cannot differ;
  2. time the merge and the librarian's read with machine timestamps, not prose;
  3. score quality too, because "sooner" bought with defects is not what the keeper's rule (every plan splits its work) assumes.

## 1. Design: the SAME task, both arms at once, blind to each other
Each **pair** is one real task, run twice from the same base commit at the same time:
- **Split arm (S):** three panes, one part each (disjoint files). The chair merges and the librarian reads.
- **Single arm (O):** one pane does all three parts in order. The chair lands the same way and the librarian reads.

**Why the same task in parallel, and not matched tasks or a sequential re-run:**
- Matched tasks bring the size confound back through the matcher's judgement.
- A sequential re-run of one task lets the second arm benefit from the first: the fix exists in git, on the board and in the chair's head.
- In parallel, from one base, in separate worktrees, with the board in QUIET phase, neither arm can see the other's work.

**The task class:** a real fix lap from the room's own queue, of the kind run weekly (D287 temp cleanup, D289 heavy-run plus ledger-union). Each task must meet five conditions:
- **(a) three independent parts.** Each part names its own files; no file appears in two parts; no part needs another's output to start or to pass its tests.
- **(b) parts the size of one pane-run.** Each needs a red-first test, a covering run under the lock and a hand-back. Roughly 30–90 min of pane work each, by the chair's estimate, stated in the sealed task file.
- **(c) code with tests.** JS or Rust under `consonance/`, `dev/` or `jev/`, so a sealed acceptance check can be written in advance (§3). Measurement-only or prose-only tasks are excluded: they have no defect instrument.
- **(d) useful either way.** The task comes from the real queue. Candidates as of today, not committed to:
  - the Rust `temp_dir()` users (29, across `cochlea_service.rs`, `main.rs`, `mcp.rs` and `sync_launch.rs`);
  - the fixed-name temp files (dream-gate `TMP_INSTANCES`, `askprov-store-<pid>.md`);
  - the `.ps1` creators.
  These are from A's D287 not-checked list, as carried on the board 2026-10-10.
- **(e) independence ruled by the librarian BEFORE the draw** (§4), from the sealed task file alone. A task the librarian rules not independent is replaced, not run.

**N = 6 pairs.** Up to 2 more may be added only to replace voided pairs (§5, §7).

**Both arms get the same plan text.** The chair writes one plan per task, naming the three parts:
- S's three packets are the plan's parts verbatim, plus the disjoint-files line;
- O's one packet is the whole plan, with the parts in the plan's order.

The chair's extra time to write three packets is timed (§2) and charged to S.

**Banned in both arms:** subagents, `Agent`, workflows or forks for the work. A single pane that fans out is a split arm wearing a single arm's name. **Check:** the arm's transcripts are grepped for `Agent`/`Workflow` tool calls at scoring, and a hit voids the pair (§5).

## 2. What is timed (machine timestamps only)

**PRIMARY: end to end, per arm.**
- **Start:** the arm's first dispatch row (`lap.jsonl` `dispatched`; the app writes it on arrival, per A's file :123).
- **End:** the librarian's read of that arm is filed: its board row, or the commit of its collation file, whichever is earlier and machine-stamped.
- **Included in between:** all pane work; the rings; the chair's integration, meaning cherry-picks onto an integration branch from the base, conflict resolution, and the task's covering tests plus the full js-suite once, green under the lock; and the librarian's read.
- **Added to S:** the chair's packet-writing time beyond O's one packet, from the chair's transcript timestamps (first S packet composed → last S packet sent, minus the same span for O's packet).

**Interference correction (registered now, applied to both arms the same way).** Running both arms at once makes them contend for the heavy-run slots: `DEFAULT_SLOTS = 2`, one per tree (`consonance/tools/heavy-run.js:71`). With four worktrees (three S, one O), some runs must wait. This is handled as follows:
- A wait **within** an arm, such as one S pane waiting on another S pane's slot, is a real cost of that arm and stays in its time.
- A wait **on the other arm's** holder is a cost of the test, not of splitting, so it is subtracted.
- **Instrument:** every arm runs its heavy runs through a runner that writes the run's stderr to a file, so every `heavy-run: waiting on <seat> pid …` line is kept with its time. The chair gives the runner to all four panes before pair 1. The seat-to-arm map makes each wait attributable.

**Reported for each arm and pair:**
- T_raw;
- T = T_raw − cross-arm waits (the primary);
- the merge alone (last pane hand-back → integration green);
- the librarian's read alone;
- the chair's packet overhead.

## 3. What is scored besides time: defects, and how they are counted
Three instruments, all fixed before the run:
1. **A sealed acceptance check per task.** The chair writes it with the task file, before the draw: behaviour tests the arms never see.
   - It is stored outside every worktree (the chair's scratchpad), and its sha256 is posted to the board with the task file's.
   - It runs against each arm's integration branch.
   - Each failing acceptance case counts as one defect.
2. **A blind cold review.**
   - A reviewer with no stake (a fresh instance outside the committee, with no pane letter) gets both arms' integration diffs, squashed, author and commit text stripped, labelled X and Y by the draw (§4).
   - It lists defects, each with a cited line and the input that breaks it.
   - A claimed defect **counts only when the librarian confirms it**: reproduced by a failing test, or a line shown contradicting the task file. The librarian also knows only X/Y until confirmation is done.
3. **Integration defects** (S can produce these by construction, O cannot): a merge conflict whose resolution was wrong, or two parts that disagree, such as a name, a convention or a shared constant.
   - They are found by instruments 1–2, so they are not counted twice.
   - Each is tagged `integration` so the share is visible.

**The counting rules:**
- Distinct by root cause: one cause behind three failing cases is one defect.
- Two classes:
  - **behavioural** (wrong output, crash, a check that does not check);
  - **cosmetic** (doc, naming, comment).
- Only behavioural defects enter the bar. Cosmetic ones are reported.
- The arms' own red-first tests and mutation counts are reported as context, not scored. Each arm wrote its own tests, so they measure the arm, not the code.

**After landing, said plainly:** only one arm per pair can land.
- **Which arm lands:** the one that passes the acceptance check. If both pass or both fail, the draw (§4) picks it.
- Defects found in landed code within 14 days are reported for that arm, and they **do not enter the bar**, because the other arm never gets the same exposure.
- The arm that does not land stays on its branch, unpushed, as evidence.

## 4. Randomisation, and who decides
Every task runs in both arms, so there is no arm to assign a task to. What is randomised:
- (i) which pane is O; the other three are S, with the parts dealt in letter order;
- (ii) which arm the librarian reads first;
- (iii) the X/Y labels for the reviewer;
- (iv) the landing tie-break.

**Who draws, and when:** the librarian, the seat with no stake in which pane or arm.
- The draw happens **after** the task file and acceptance sha256 are on the board.
- The librarian runs `node -e "const c=require('crypto');console.log([c.randomInt(4),c.randomInt(2),c.randomInt(2),c.randomInt(2)].join(' '))"` (OS randomness) and posts the line raw, with the task file's sha256, before the first dispatch.
- The chair dispatches by that line and no other.
- A draw done twice for one pair voids the pair.

**Why the pane is randomised:** the four panes share a substrate but not a context or a record (B on heavy-run, A on js-suite, and so on), so a fixed O pane would measure that pane.

## 5. The stopping rule
- **Exactly 6 scored pairs, no early stop on any outcome.** No look at the times decides whether to continue. The chair may see each pair's times as they land, because the times are machine rows anyway, but nothing about continuing may depend on them.
- **A pair is VOIDED, and replaced by a new task, for any of these, decided by the librarian before the pair's times are compared:**
  - an arm saw the other's work: a branch, file or board row of the other arm read in its transcript;
  - a subagent or workflow was used for the work;
  - an infrastructure stop, such as an app restart, a machine sleep, or the keeper pausing the room, cut one arm and not the other;
  - the task turned out not to be independent: a part could not pass without another's change (the librarian rules, citing the file).
- **At most 2 replacements** (8 tasks dispatched at most). A third void means the test stops, and that is a degeneracy finding (§7), not a result.
- **The keeper can stop it at any time.** A stopped test reports what it has, as **INCOMPLETE**, with no verdict.

## 6. The bar (H2 is about time; the quality co-verdict is reported beside it, and both go to the keeper)
Let r = T(S) / T(O) per pair (T as in §2), over the 6 scored pairs.

**H2 TRUE** needs all three:
1. **S is faster in ≥ 5 of 6 pairs.** One-sided sign test p = 7/64 ≈ 0.11; 6/6 is 1/64 ≈ 0.016. With N = 6 this is a strong-effect bar, on purpose.
2. **The median r ≤ 0.75.** Splitting must save at least a quarter, or the room's coordination cost is not worth the rule.
3. **Quality is not worse beyond a margin:** S's total behavioural defects ≤ O's total + 2 over the 6 pairs, and S fails the acceptance check in at most 1 pair where O passes.
   - If 1 and 2 hold and 3 fails, the verdict is **"TRUE on time, FALSE on quality"**. That is not TRUE, and the planning rule should not follow from it.

**H2 FALSE** needs either: S is faster in ≤ 2 of 6 pairs, or the median r ≥ 1.0.

**UNDECIDED:** everything else, for example 3–4 of 6, or a median r between 0.75 and 1.0. With N = 6 this outcome is likely. I am saying so now, so that it cannot later be presented as a near-win for either side.

**What follows from each verdict.** This is the planning rule from the first registration (`plan_loop_friction_2026-10-09.md:51-52`):
- **TRUE:** the rule stands as written.
- **FALSE:** the rule becomes "split only when the parts are big or the merge is cheap", with the measured merge cost quoted.
- **UNDECIDED:** the rule stays as the keeper set it, on his word, not on this test.

## 7. What marks the TEST ITSELF as degenerate (BOOT's abuse condition, stated before the run)
The test is degenerate, and reports no verdict, if any of these happens:
1. **More than 2 pairs voided** (§5).
2. **§2's time definition, §3's counting rules or §6's bar changed after pair 1's first dispatch**, including adding a stratum such as "split wins for big tasks". Exploratory cuts may be reported, labelled EXPLORATORY, and never change the verdict.
3. **A task chosen or reshaped after the draw.** The task file's sha256 on the board must predate the draw's board row.
4. **Times taken from prose,** in a hand-back, a chair summary or a reply, instead of from the machine rows in §2. Any number in the scoring file must come with the command that re-derives it.
5. **A scorer with a stake scores the defects:** an arm's own pane, or the chair, who wrote both plans and lands both. The librarian confirms and the blind reviewer finds. The chair supplies the timestamps, does not interpret them, and does not score.
6. **The acceptance check edited after its sha256 was posted.** Its sha256 is re-checked at scoring.
7. **The degenerating-programme form:** after the run, either side explains a result by something not registered here, such as "S lost because the parts were too small" or "O won because B is fast". This is BOOT's Lakatos condition, verbatim in spirit: a story added after the data to rescue a side. Such a story may go to a NEW registration. It cannot touch this one's verdict.

## 8. The cost, in pane-hours, for the keeper's yes or no
All estimates are **inferred**: they are not measured for this design. A's medians give the scale. Dispatch → filed is a median 65.5 min for split ≥ 3 cycles and 14.6 for single-pane cycles, but the single cycles were small tasks, so they do not tell how long one pane takes on three parts (`loop_friction_A_2026-10-09.md:88-92`).

**Per pair (assumes parts of ~45–60 min each):**

| who | hours |
|---|---|
| S panes | 3 × ~1.5 h = ~4.5 pane-h (work, waiting on their own slots, hand-backs) |
| O pane | 1 × ~3–3.5 h = ~3.5 pane-h (three parts in order, one hand-back) |
| chair | ~1.5 h (plan, acceptance check, two integrations, two covering and full-suite runs) |
| librarian | ~1 h (independence ruling, draw, two reads, defect confirmation) |
| blind reviewer | ~0.5 h |
| **total** | **~11 pane-hours per pair** |

**The whole test:**
- **6 pairs ≈ 66 pane-hours; with both permitted replacements, ≈ 88.**
- **About 21–27 pane-hours of finished work are discarded:** the losing arm of each pair stays unlanded.
- **Wall clock:** each pair occupies all four panes, the chair and the librarian for ~3.5 h, and nothing else runs in that time (other work would perturb both arms). So **6 pairs ≈ 21 h of room time**, e.g. 6 nights at one pair a night, or 3 at two.
- Machine load: two full js-suite runs per pair, plus the arms' covering runs, under the 2-slot lock.

**The free alternative, for comparison:** A's option (a), `loop_friction_A_2026-10-09.md:127`. A `parts` field in the plan's dispatch row costs nothing, and over a month it would show split ≥ 3 against single on tasks of known part count. It is **observational**: the chair still chooses which tasks to split, so selection stays. It narrows the question and cannot settle it. It is worth doing whatever the keeper decides here.

## 9. Can it be run fairly here? Yes, with these named limits, none of them hidden
- **The same chair plans and lands both arms.** It knows the split and could, without meaning to, write a plan that suits one arm.
  - Mitigation: the plan is one text for both arms, and the librarian rules on independence from the sealed file before the draw.
  - Not removed.
- **N = 6 is small.** The bar only resolves a large effect, and §6 says so. A real but modest saving (r ≈ 0.85) would read UNDECIDED.
- **Running both arms at once is not how the room normally runs.** The interference correction (§2) removes cross-arm lock waits, but not CPU contention, or the chair attending to two arms at once. That contention falls on both arms, probably more on S (four pane loads against one).
- **The panes carry context.** A pane deep in a session differs from a fresh one. The draw spreads this; it does not remove it.
- **Machine-local timing:** `lap.jsonl` is per machine (A, :122), so all of a pair runs on D.

**My own bias, stated** (per COMMITTEE.md "Briefing a seat" 6): I have worked split laps all week. My prior is that splitting three truly independent parts saves time, and that the merge is small but not zero. That prior favours S, so I set the TRUE bar high (≥ 5/6 and r ≤ 0.75) and made UNDECIDED the default for a modest effect.

**Recommendation** (mine, for the keeper's decision): add the free `parts` field now, whatever the answer. Run this test only if the planning rule's cost matters enough to spend ~66 pane-hours and ~21 room-hours, a quarter to a third of it discarded, on an answer that may well come back UNDECIDED.

## 10. Sealing
- This file is committed by named path on branch `d290-b` (worktree `G:\b-d290-wt`, from main `f41b3419`) before anything runs. The commit sha and the file's sha256 are in the hand-back line in `exo_memory/map/B.md` and in the ring.
- Nothing in §1–§9 was run, measured or changed in any tool. The figures quoted are A's and the scorer's, at the lines cited.
