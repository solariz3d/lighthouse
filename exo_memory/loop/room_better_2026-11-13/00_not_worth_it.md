# The adversary's file: what the swarm's proposals do not earn, and what the evidence says to stop (2026-11-13)

Reader: the swarm's adversary, on D. Read-only except this file. Input: the twelve files in this folder as corrected
by their second readers; struck text ignored. Options and evidence, not decisions.
Marks: [read] I opened it myself. [summary] taken from a sibling file in this folder, which cites the primary; I did
not reopen that primary. [inferred] my inference or arithmetic. [ours] a proposal.

## 0. My own probes (read-only)

- `consonance/tools/landing-train.js:29`: "a red batch: the newest branch is set aside and the rest tried again, down
  to one; the largest green batch lands" [read]. `mergeBatch` at `:173`, the red-batch loop at `:231-260` [read].
- `grep -ci mutant consonance/tools/landing-train.js` returns 0 [read].
- `consonance/tools/open-items.js:17-18`: "Each is a QUESTION WITH A COMMAND, and the answer is recomputed on every
  run" [read]. It holds 5 items (ids at `:178`, `:275`, `:365`, `:410`, `:444`) [read].
- D's board (`C:/Consonance/data/board.jsonl`, node count): 0 rows carry the drain's `[WRITE FAILED]` mark
  (`main.rs:12233`); 14 lines say "write failed", all assistant (13) or user (1) text [read].
- A grep of `exo_memory` `*.md` (attic and this folder left out) for a hand-back landing twice or a stale hand-back
  merged: 3 files, all design text for a commit gate (`handback/p-commit-gate_2026-09-02.md:119`,
  `loop/packet_commit_gate_2026-09-02.md:72`, `ASK.md:179`). No incident [read].
- `consonance/tools/chain-status.js:252-273`: a 10-minute idle timer "fires at 07:06:06 — SIX MINUTES OF ALARM OVER A
  CORRECT STATE" [read].
- Primary lines opened: `librarian/2026-11-13.md:213`; `loop/handoff_lighthouse_2026-11-13-L.md:63`;
  `librarian/2026-09-02.md:1108`; `librarian/2026-09-16.md:83`; `handback/p-d619-hooks-tools-C_2026-11-02.md:68`;
  `dev/shell/install.ps1:254-257`; `handback/p-d627-p3-everyturn-O_2026-11-03.md:30`;
  `handback/p-d627-p4-compaction-A_2026-11-03.md:84`; `loop/plan_13h_run_2026-11-13.md:238`; the auto-memory index
  `C:/Users/nname/.claude/projects/C--Consonance-instances-librarian/memory/MEMORY.md:5`, `:14`, `:44` [read].

## 1. Not supported: the recorded cost is small, absent, or already met

1. **Priority classes, an aging rule, "reserve, do not park" on the heavy-run lock** (in_lock queue options 1-3;
   out_merge_queue option A).
   - Ordering's recorded cost today: B's guard mutants held the train 4 min; A's mutants "starved", minutes not
     recorded [summary: in_lock.md:32, :37]; "short runs parked behind 16 mutants", minutes not recorded
     (handoff_lighthouse_2026-11-13-L.md:63) [read].
   - The 41 min once credited to ordering was A's mutants waiting BEHIND the train (librarian/2026-11-13.md:213) [read].
     A landing-first class gives that order already.
     [2nd reader: one reading of an ambiguous line. `:213` reads "A waited 41 minutes behind the train for a chain of 16
     mutants". out_merge_queue.md:153-156 counts the same 41 min as recorded waiting cost for this proposal, with
     "about 154 seat-minutes" of waits beside it. The record does not settle who waited on whom (00_critic.md §2.1).]
   - What a queue does not fix took about 70 min: the idle holder (40) and the runaway grep (30)
     [summary: in_lock.md:171-178].
   - The train already has precedence: the exclusive hold [summary: in_lock.md:94-98], and the plan's words "Landings
     never wait in line behind sweeps or mutants" (plan_13h_run_2026-11-13.md:238) [read].
   - Outside: "No source found that measures merge-queue or test-scheduling behaviour on one shared machine with a
     handful of workers" [summary: out_merge_queue.md:172-173]. Every figure there is from fleets.
   - Its own author names the risk: the lowest class starves [summary: in_lock.md:161-162]. Build cost not estimated.
   - Cheaper first [ours]: the lock keeps no log [summary: in_lock.md:9]. One row per wait would make today's waits a
     reading instead of prose, and would show whether ordering ever costs more than 4 minutes.
2. **A second train on D** (in_lock option 2). Two trains race for main; a lost race is a 13-19 min rerun
   [summary: in_lock.md:137-139]. Today's ~97 min without a landing had three causes, ~~none of them train capacity~~
   [summary: in_stalls.md:233-237]. [2nd reader: one of the three is slot capacity. in_stalls.md:233-235 names "B's
   mutant run held the slot until 12:48Z" (librarian/2026-11-13.md:311) beside no seat running the train and the
   orphaned grep. A second machine's slots would touch that one. "None of them" is inferred, not shown.] D's toolchain parity is unmeasured; the control run at 31d1c6d has no result on
   disk [summary: in_lock.md:128-130, :227-229]. Moving sweeps to D (option 1) waits on that same result.
3. **A delivery count and a dead-letter row after N failed writes** (out_reliable_delivery option c). D's board holds
   0 `[WRITE FAILED]` drain rows in all time [read: section 0]. The class has no recorded case here. L not read.
4. **Idempotency keys and fencing tokens on hand-backs** (out_reliable_delivery options d, e). No recorded double
   landing or stale hand-back merge [read: section 0]. The nearest case, a withdrawn order delivered late on 09-20,
   already has `[[withdraw-queued N]]` [summary: in_delivery.md:74, :169].
5. **A lease with a heartbeat on each dispatched lap** (out_reliable_delivery option f). The room tried the timer form
   and refused it on evidence: six minutes of alarm over a correct wait (chain-status.js:252-273) [read]. It built
   event clauses instead (UNDELIVERED, QUEUED over 3 min, waiting on YOUR answer) [summary: in_stalls.md:84-86, :111,
   :148] and a 15-minute exception indicator [summary: in_stalls.md:59-61]. That indicator's falsifier did not fire:
   "ten laps, and the keeper has not once been the one to notice a stall" (librarian/2026-09-02.md:1108) [read].
   ~~A lease re-proposes the refused design.~~ [2nd reader: not the same design. The refused form was a 10-minute
   IDLE timer on the waiting chair: "a timer on the chair reports the seat that was waiting correctly"
   (consonance/tools/chain-status.js:257-260, :273-274). A lease is renewed by the WORKING seat's heartbeat; on that
   night A was working (`:258-259`), so a lease held by A would not have fired. Whether a lease adds anything over the
   event clauses is untested either way. 00_build_paths.md:71 records a larger cost for the silent-receiver class
   (4 h 24 m, 09-16), which this item does not weigh; 00_critic.md §1.2 disputes that case's fit.]
6. **An inbox that survives a restart, or a row per dropped message** (in_delivery option E; out_reliable_delivery
   option b, second half). It rests on 42 unpaired QUEUED rows. The second reader got 34 by another pairing, the
   file's sums do not add up, and 29 orphan drain rows point at label mismatches [summary: in_delivery.md:128-132,
   :293-296]. No message lost to a restart is recorded. Weak, not refuted: a restart is when it would bite
   [summary: in_delivery.md:131-132].
7. **Tell the sender when a queued message lands** (in_delivery option D). One case, about 8 min, 2026-09-23
   [summary: in_delivery.md:126-127]; the pulse's QUEUED-over-3-min clause was built after it
   [summary: in_stalls.md:111]. No later case is in the twelve files.
8. **Fail First on a red suite** (out_merge_queue option D). No file here counts red full suites or reruns; the
   train's log is on L [summary: in_lock.md:11-12]. Unsupported until counted.
9. **A per-seat prompt-regression battery**: 20-50 probes, K of 3 or more fresh wakes per version, 2-3 paraphrases,
   a sealed half, a swapped-order judge (out_prompt_regression §8).
   - No recorded behaviour regression from a brief, BOOT or card edit is in the twelve files. The reader found an
     absent check, not a harm [summary: out_prompt_regression.md:29-30].
   - Power: unpaired n=40 near 70% sees about 29 points, paired about 20, K0's n=20 about 35
     [summary: out_prompt_regression.md:108-112]. Miller's example needs ~969 questions for 3 points
     [summary: :105-107]. The reader expects persona edits to be small effects [summary: :177-179].
     [2nd reader: "paired about 20" uses a halving of variance; at the paper's stated one-third cut it is about 23
     (out_prompt_regression.md:99-101). Both assume a correlation of 0.5 the room has not measured. "Small effects" is
     marked [inferred] at :177-179.]
   - Price: today's ~~wake~~ [2nd reader: 24 h window, every call, not the wake alone (in_cost.md:43-55)] ran 335,104
     to 931,671 tokens of context per call (median, by seat), and wake writes were
     71.6 % of the 24 h weighted spend [summary: in_cost.md:45-59]. Six wakes per seat per brief change is millions of
     tokens written [inferred].
   - Judges: similar models score each other up (r = 0.84) and prefer their own output
     [summary: out_multi_agent_cost.md:109-114]. Judging is routed away from him (MEMORY.md:14) [read].
   - Its own cheapest step, re-running the K battery paired, is the one part priced low [summary: :206].

## 2. Already built or already on disk: these re-derive it (cost: a reader's pass each, not recorded)

- **Batch landings bors-style, split on red** (out_merge_queue option B): the train does it (landing-train.js:29)
  [read]. It splits from the newest, one at a time, not in halves. Halving pays only with big batches and frequent
  reds; neither is counted [inferred].
- **Mutants off the landing's critical path** (out_merge_queue option C): the train names no mutant [read: section 0];
  mutant chains are seat runs holding slots [summary: in_lock.md:46-51].
- **Mutants in units that yield** (in_lock queue option 4): `--only` ~~already~~ takes a range
  [summary: in_lock.md:169-170]. [2nd reader: not on main. The range form is on `origin/l202-idle-guard` 901d3c39
  (`heavy-run.mutants.js:150` there), which `git merge-base --is-ancestor 901d3c39 HEAD` says is not merged. Main's
  `consonance/tools/heavy-run.mutants.js:143` takes one number. "Already" holds once L202 lands.]
- **A due-date list of owed falsifiers** (in_promises §6): open-items.js is that shape (`:17-18`) [read]. Its weekly
  run was recommended 11-03 and never scheduled [summary: in_promises.md:89-95]. A new column repeats the step that
  failed. [ours] Enter the five unscored falsifiers as open-items questions, with the schedule that was dropped.
- **Delta-only notes** (out_memory option c): the append-only law is it, as the reader says
  [summary: out_memory_at_wake.md:249-250].
- **Compact before a long break; pick the model before the wake** (in_cost option 2): on disk, "after a >1h gap or a
  model switch the first call reloads the whole thread uncached" (MEMORY.md:5) [read]. It was not applied before
  today's ~2,000-minute gap [summary: in_cost.md:24-29]. A practice gap, not missing machinery [inferred].
- **Bulk reads to subagents** (in_cost option 3): the librarian's note names it [summary: in_cost.md:137-138].
- **A hook census and the ask-ending review** (in_hooks §2, §3): D619 did the census 11 days earlier and marked
  ask-ending "CUT candidate" (p-d619-hooks-tools-C_2026-11-02.md:68) [read].

## 3. Outside sources that do not carry to this room

- **Mask before summarising** (out_memory option b). ~~Not found reachable in Claude Code~~ [2nd reader: not checked,
  not found absent. The source says "Needs a check that it is reachable in Claude Code (not read)" and "the setting was
  not found" (out_memory_at_wake.md:248, :266-267).]
  [summary: out_memory_at_wake.md:247-248, :266-267]. The Complexity Trap's own appendix expects summaries to win on
  much longer runs [summary: :154]. Its runs cap at 250 turns; one seat made 926 calls in 48 h
  [summary: in_cost.md:73].
- **ACON's contrastive loop** (out_memory option a). It needs pairs that pass with full history and fail after
  compaction. The continuity test gave 0 wrong answers in 8 runs [summary: in_wake.md:83-85], and no file here names
  such a pair set. ACE: without reliable execution signals it "may degrade" [summary: out_memory_at_wake.md:163-165].
- **Each CLAUDE.md under 200 lines** (out_memory option e). The guidance is about adherence
  [summary: out_memory_at_wake.md:76-77]. The room's measured case is recall: the ROOM arm scored 32.5 / 33.5 of 34
  with the large intake [summary: in_wake.md:84]. Adherence is unmeasured. Evidence both ways.
- **Classify each lap decomposable or sequential before dispatch** (out_multi_agent §5). Kim et al. is per task at
  matched compute; the room has no matched-token comparison [summary: out_multi_agent_cost.md:175-176, :183-184].
  That is a new dispatch step on per-task benchmarks [inferred]. The count of collations that reopened a cited file
  is an instrument, not a step, and cheap [summary: :173-174].
- **A non-Claude second reader** (out_multi_agent §5). Cross-provider errors still correlate, more for stronger
  models; a weaker second model costs quality (Self-MoA, 6.6 %) [summary: out_multi_agent_cost.md:103-111, :143-148].
  Its spend is outside the subscription the seats run on [inferred], so it is a keeper call.

## 4. One fault, six fixes: the 403 class

- Proposed or built for a pane whose turn ends on an API error after a delivery: 2a NOT ACTED ON plus redeliver
  (in_delivery C); 2b one packet per completed turn (in_delivery B); 2c the digest names panes whose last line is an
  API error (landed b0be06f0, not installed); an auto "carry on" retry; `api_error_watch_2026-11-13.js`, armed per
  session; a `StopFailure` hook (in_delivery A; out_reliable_delivery a) [summary: in_stalls.md:224-230;
  in_delivery.md:215-226].
- A is upstream. With no StopFailure hook the stamp stays "working" over a quiet screen, the drain reads Stale, and
  releases [summary: in_delivery.md:118-124]. B and 2a work around that reading [inferred].
- 2c is built and does not run: board-digest.js is not registered on D and is DRIFT on L [summary: in_hooks.md:67-70].
- 2a's trade: a redelivered packet already in context may run twice; the trace chose a nudge
  [summary: in_delivery.md:222-223].
- A's open question: whether a Cloudflare 403 page reaches StopFailure, and under which matcher, is untested
  [summary: out_reliable_delivery.md:229-231].
- Recorded cost of the class: two bursts on L, minutes not one figure [summary: in_delivery.md:178-179].
  [2nd reader: 00_build_paths.md:71-73 records more for the same class: 7 deliveries lost, about 4 to 7 min per pane in
  the first burst, about 9 min for A and C in the second (inferred from the trace's timestamps), plus 4 h 24 m on 09-16
  that 00_critic.md §1.2 says does not fit.]
- [ours] Install 2c, add A with one forced-error test, then count the next burst before building 2a, 2b or the retry.
  [2nd reader: 2c's own hand-back says "NOT installed on any seat, as ruled for this run" and "Install, when ruled:
  `install.ps1 -Only board-digest.js,blind.js`, NEVER board-digest.js alone" (handback/p-l198-403-stall-B_2026-11-13.md:5-6).
  So installing 2c waits on a ruling and brings blind.js, which in_promises item 5 lists for retirement
  (00_critic.md §2.3). D's settings.json has 0 `board-digest` hits (read today).]

## 5. Current mechanisms the evidence says to stop, or that run against the record's own ruling

- **ask-ending.js.** "SHADOW ONLY, for a trial week" from 10-06; 22 matched of 6,983 rows; never acted; D619 "CUT
  candidate" [read: p-d619:68; summary: in_hooks.md:96]. Runs on every Stop, 10 s bound. ~~Cost per turn not recorded.~~
  [2nd reader: recorded. "every reply's end (Stop) | stop, sourced-stop, ready-stop, reply-slot, ask-ending | 104–110 ms
  each", and hooks of one event run in parallel, "so an event costs about its slowest hook"
  (handback/p-d619-hooks-tools-C_2026-11-02.md:45, :49). Removing it alone saves about no wall time. Re-counted today:
  `C:/Consonance/data/ask-ending.jsonl` 6,997 rows, 2026-10-06T08:54Z to 2026-11-13T15:28Z, all `"mode":"shadow"`,
  22 with `"matched":true` (last 2026-11-02). 0 librarian notes name it (`grep -rlF ask-ending exo_memory/librarian`).
  Its header names a review, not a cut, as the trial's end: "after the week, if more than 1 in 3 flagged endings are
  real questions ... it stays in shadow; otherwise blocking is decided on this log" (consonance/hooks/ask-ending.js:12-13).
  No review found. The rulings were the librarian's (`:1-2`; install.ps1:184-187), not the keeper's.]
- **stop.js on D.** Excluded by the 2026-09-06 "ready pair only" entry and live on D; the installer calls that "the
  true, open state" (install.ps1:254-257) [read]. It appends a session_stop event. ~~Nothing on disk says why it runs.
  Cost not recorded.~~ [2nd reader: WRONG on both. Why: its header, "append a session_stop event to the event log so
  the next SessionStart can see what happened" (~/.claude/shell/hooks/stop.js:2-3), and three hooks REGISTERED on D read
  those rows: session-start.js:151 and :323-330 (the "night table", the gap since another session's last turn),
  userprompt-submit.js:156-199 ("The interval, witnessed", on every prompt), session-end.js:189-195 (the daily digest).
  `~/.claude/shell/event_log.jsonl` holds 42,257 session_stop rows, 2026-06-05 to 2026-11-13T15:28Z. Removing stop.js on
  D would silently stop all three. Cost: 104–110 ms per Stop, in parallel (p-d619:49). The ruling: install.ps1:244-247
  says the 09-06 ruling is "the LAPTOP lineage's" and "describe[s] a machine where they were unregistered; on D they had
  been live since June". On 2026-09-19 the keeper delegated: "do what you see is correct bc tbh i have no clue"
  (loop/keeper_rulings_owed_2026-09-19.md:5), and the librarian left stop.js registered on D: "Removing them is a bigger
  act than the word given today covers. If he wants them gone he says so by name." (`:10`). Not the swarm's to remove.]
- **The stale second-reader copy on D** (10-01). It makes model reads on call_librarian rings the 11-03 change skips:
  229 reads, 2,385,722 tokens after 15:25Z that day (234 and 2,431,909 at the second count)
  [summary: in_hooks.md:49-57]. Stop the copy by syncing it; the mechanism's value is a separate, unscored question.
  [2nd reader: reproduced from `C:/Consonance/data/second-reader.jsonl` (rows with tool call_librarian, status ok, ts
  after 2026-11-03T15:25Z; tokens = in + out + cacheRead + cacheCreate): first 3,940 rows 229 / 2,385,722 / 112
  flagged; first 3,948 rows 234 / 2,431,909; all 3,955 rows today 237 / 2,479,021 / 116. The installed copy is dated
  2026-10-01 and has 0 "relayed" against the repo's 1; bd576735's message: "a call_librarian ring is a skipped-class
  row with no model call". -Check lists it DRIFT. Holds. No keeper ruling on the narrowing found (in_hooks.md:113).]
- **The state block** (sessionstart-state.js). 163 served, mean 3,012 chars, "0 turns act on its content", NOISE
  marked inferred (p-d627-p3-everyturn-O_2026-11-03.md:30) [read]. in_wake's option to serve it at startup too would
  add it to ~~8,046 startup rows~~ [summary: in_wake.md:57-59]. [2nd reader: the count holds as all time, not as a
  rate. `C:/Consonance/data/sessionstart-state.jsonl` today: 9,321 rows; `"source":"startup"` 8,046, of which 2,452 in
  August, 5,587 in September, 7 in October, 0 since 2026-10-29T19:02Z. Serving it at startup would add it to a handful
  of wakes a month at today's rate. Emitted on compact: 468 all time, 166 between 10-20 and 11-03 (mean 3,013 chars),
  close to O's 163. The "0 turns act on its content" is O's hand count over one window, marked inferred at `:30`.]
  The evidence leans to drop, not extend; re-cue value is unmeasured.
- **precompact.js's checkpoint output.** The librarian transcript has 0 PreCompact hook_success rows; the checkpoint
  header appears only through the manual /compact echo [summary: in_wake.md:203-206]. ~~On L it is a no-op~~
  [summary: in_hooks.md:98]. Reach on an auto compaction is untested. [ours] Test once, or stop it.
  [2nd reader: re-counted on the librarian transcript (892,935,483 B): `"hook_success"` rows by hookEvent: Stop 12,040,
  SessionStart 300, PreToolUse 47, PreCompact 0; "# Checkpoint -- " in 14 rows. Holds. The L no-op is an old date: it
  rests on carrier-drift-watch.js:7-14 and install.ps1:163-166 (2026-08-24), when the hook named
  %USERPROFILE%\Desktop\lighthouse. Since 6d12f9fa (2026-10-09) it finds the repo through room_path
  (~/.claude/shell/hooks/precompact.js:27-40). Whether L runs that copy is not seen from D. On D it runs checkpoint.py
  (p-d619:52); no keeper ruling on it found.]
- **The preserve directive's stale half.** It prints the pre-directive 3.5 % as current and says "any of the five
  above" over six items; D089 ruled FLAG and PATH DECORATIVE, SHA and NUM WORKS [summary: in_wake.md:44-47, :117-119].
  [2nd reader: the 7-event table reproduces (handback/p-compaction-remeasure-B_2026-09-19.md:29-32); on the 11-event
  reading SHA moves to NEITHER (in_wake.md:45-46). The text prints 3.5% as the measure of "seven summaries of this
  conversation" (~/.claude/shell/precompact-preserve.js:108-113), not as a current rate; "five above" at `:131`.]
  The item-6 bar was never scored. Cost not recorded.
- **Hooks declared but not registered:** dispatch-gate.js, carrier-drift-watch.js, second-reader-note.js
  [summary: in_hooks.md:27-28]. carrier-drift ran 4,117 rows, 2,050 RED, spoke 68 [summary: in_hooks.md:112]. No
  removal ruling found. The declaration without the registration is the drift; either re-rule or install.
  [2nd reader: -Check today lists 4 DECLARED, NOT REGISTERED; the fourth is userprompt_pulse.py, kept off D on purpose
  by the Conflicts guard (in_hooks.md:110). Ledgers re-counted: carrier-drift.jsonl 4,117 rows 2026-08-24..09-22,
  RED 2,050, GREEN 2,067, `"spoke":true` 68; dispatch-gate.jsonl 525 rows 08-24..09-09, asked 73. The decision is on
  record as open, not missing: on 09-19 "installing them REGISTERS new hooks ... A separate decision"
  (loop/keeper_rulings_owed_2026-09-19.md:31), left alone under the keeper's delegation (`:5`, `:9`), and again "NOT
  installed, on purpose" (loop/install_D_2026-09-21.md:14).]
- **-Check's 4,950 UNCLAIMED lines ahead of its verdicts.** The first run lost the verdicts to truncation
  [summary: in_hooks.md:15-20]. Cost: one re-run.

## 6. Warn-only gates: printed often, never scored

- Light mode on D. Trailer warnings 1,018 call_chair, ~~521 call_librarian,~~ 316 chair_inject, all time
  [2nd reader: re-counted on D's board, app rows only: 1,018 / 521 / 316 hold. The 1,018 and 316 all carry
  "gates_mode light"; the 521 call_librarian rows carry none: pane rings are delivered without a trailer by design,
  in either mode (in_stalls.md:268-269). Sources-gate warn is 2,395 today, reply-slot light would-block-missing 1,006;
  both ledgers grew since the readers counted.]
  [summary: in_delivery.md:204]; sources-gate warn 2,381 [summary: in_hooks.md:101]; reply-slot would-block-missing
  1,000 in light [summary: in_hooks.md:95].
- The registered score for the lighter layer, H3, never ran; its window closed 2026-10-18T00:34:07Z
  [summary: in_promises.md:63-71].
- The room's own finding: a line printed every turn does not fire at the moment of need
  [summary: in_stalls.md:88-89]; the 09-16 note carries the 345 prints (librarian/2026-09-16.md:83) [read].
- So the evidence says neither remove nor restore. It says the one instrument meant to decide never ran.
  [ours] Score H3 from the ledgers; or set each gate to refuse or to silent, since a warn nobody reads still costs a
  row and a line per call.

## 7. Against the cut: mechanisms the evidence says to keep

- **push-gate.js.** 2 denies in 349 rows, both planted test keys [summary: in_hooks.md:102]. The standing push
  permission rests on "the credential scan" [summary: in_hooks.md:102]. A low catch count does not argue removal here.
- **delete-gate.js.** 2 real denies, one with a target that resolved to `C:\` [summary: in_hooks.md:103].
  [2nd reader: re-counted. push-gate.jsonl 349 rows 10-06..11-12: allow 338, allow-error 9, deny 2, both 10-06 from
  one test seat (planted2.txt, a temp dir). delete-gate.jsonl 773 rows 10-06..11-12: deny 5; three on 10-06 in a temp
  test tree, 2026-10-11T21:06Z with target `C:\` (links 2), 2026-10-29T16:56Z with target `...\AppData\Local\Temp`
  (links 1). Holds.]
- **Second reading.** The twelve second readers struck at least 58 claims [inferred: sum of each file's stated count].
  Two would have put a closed ask and a filed row on a planner's "dropped" list; one gave 41 min to the wrong cause
  [summary: in_promises.md:285-286; in_lock.md:217-218]. Its price: 578 subagent calls in 24 h, median context
  138,032 [summary: in_cost.md:60-62].
- **Fixes that became code** held better than rules in a dated trace (S25 to S26 at seven times the length), with the
  counter-cases: L018 a day after its detector, S11 two minutes after the trailer gate
  [summary: in_stalls.md:265-271].

## 8. Proposals that add text, or trade one cost for another

- **Move rule-only fixes into the briefs** (in_stalls §3). S2 recurred with its rule already on disk
  [summary: in_stalls.md:30]. The librarian intake is already 108,857 bytes [summary: in_wake.md:27]. The record's
  pattern points at the tool, not the brief [summary: in_stalls.md:265-271]. [ours] Put each rule in the tool that
  runs it (a wrapper that sets `MSYS_NO_PATHCONV`, a `timeout` on long greps), or drop it.
- **Lower the auto-compact point** (in_cost option 1). For it: 53.2 % of cache reads came from context above 250k
  [summary: in_cost.md:95-96]. Against it: one hand count kept 14 of 37 items and lost 15 (p-d627-p4:84) [read], and
  his exact words survived one compaction, not two [summary: in_wake.md:50-51]. The index line at MEMORY.md:44 reads
  "no seat compacted or its context cut, for a test or usage, without his explicit word for that seat" [read]. So a
  per-seat setting is a call for him, seat by seat.

## 9. What stands (so this file is not read as "cut all of it")

Each has a recorded cost or a cheap fix [summary: the files named]: the StopFailure hook with one test (in_delivery A);
installing 2c; landing the idle-holder guard (46 min over two nights, in_stalls.md:252-253); a `timeout` on long greps
and the gate message's head, not tail (in_stalls.md:256-257); stamping the shelf with its HEAD (in_wake fault 1);
choosing the model before the wake (in_cost cost 2); syncing stale hooks one `-Only` entry at a time (in_hooks §3);
naming the gates mode in the briefs (in_delivery F); correcting SPINE rows 79 and 84; defining "a season" in days.

## What I did not open

- L: its board, data folder, ledgers, branches and transcripts. Every L-side figure above is [summary].
- The primaries behind most [summary] lines; their second readers opened them, I did not.
- No outside source was fetched; every outside claim here comes from the out_*.md files.
- Whether any warn-only line was ever acted on: no instrument for it was found in the twelve files.

## Second reader (D, 2026-11-13)

Read-only except this file. Line numbers are this file's lines BEFORE my notes went in. "Primary" is what I opened
myself today; where it names a sibling, I opened the sibling's cited lines and the sibling's own [read] stands.
Counts were re-derived with short node passes over the named ledger; the field matched is given where it decides.
Installer: `powershell -File dev\shell\install.ps1 -Check` only (exit 1, 5,031 lines, verdicts at the end).

| line | claim (short) | primary opened | verdict | evidence |
|---|---|---|---|---|
| 32-33 | ordering cost: B 4 min, A "starved" | in_lock.md:30-37; librarian/2026-11-13.md:213 | OK | rows as cited |
| 35-36 | 41 min was A behind the train | librarian/2026-11-13.md:213; out_merge_queue.md:153-156 | DOWNGRADED | ambiguous line; a sibling counts it for the queue |
| 37-38 | ~70 min idle holder + grep | in_lock.md:171-178 | OK | 40 + 30 after its own second reader's fix |
| 39 | train has the exclusive hold | in_lock.md:94-98 | OK | heavy-run.js:77-86 per sibling |
| 41-42 | no small-machine queue source | out_merge_queue.md:172-173 | OK | verbatim |
| 43 | lowest class starves | in_lock.md:161-162 | OK | "it needs an aging rule" |
| 44 | the lock keeps no log | heavy-run.js:34 | OK | "There is no separate log file" |
| 46-47 | lost race = 13-19 min rerun | in_lock.md:137-139 | OK | not re-derived |
| 47-48 | three causes, none capacity | in_stalls.md:233-237; librarian/2026-11-13.md:311 | UNSUPPORTED | B's mutants held the slot: a capacity cause |
| 48-49 | D parity unmeasured, no control result | in_lock.md:128-130, :227-229 | OK | "not on disk that I found" |
| 53-54 | `[[withdraw-queued N]]` exists | main.rs:11675, :11706 | OK | directive parser present |
| 56-58 | event clauses built | chain-status.js (grep -c) | OK | UNDELIVERED 3, "waiting on YOUR answer" 1 |
| 58-59 | 15-min indicator, falsifier quiet | librarian/2026-09-02.md:1108 | OK | verbatim |
| 60 | a lease re-proposes the refused timer | chain-status.js:253-274 | WRONG | refused: idle timer on the waiting chair; lease: worker heartbeat |
| 62-65 | 42 unpaired QUEUED | in_delivery.md:128-132, :293-296 | OK | file already says 34 and "weak" |
| 66-68 | one case, ~8 min, 09-23 | in_delivery.md:126-127; in_stalls.md:111 | OK | as cited |
| 69-70 | train log on L only | in_lock.md:11-12 | OK | as cited |
| 73-74 | no recorded behaviour regression | out_prompt_regression.md:27-31 | OK | "Nothing found checks BEHAVIOUR" [inferred there] |
| 75-77 | power 29 / 20 / 35; small effects | out_prompt_regression.md:99-112, :177-179 | DOWNGRADED | ~23 at the paper's 1/3; r = 0.5 unmeasured |
| 78-79 | "today's wake" 335k-932k per call | in_cost.md:43-55 | WRONG | medians over the 24 h window's calls, not the wake |
| 81-82 | judge r = 0.84, self-preference | out_multi_agent_cost.md:109-114 | OK | as cited |
| 83 | cheapest step: re-run K paired | out_prompt_regression.md:206 | OK | as cited |
| 90-91 | mutant chains are seat runs | in_lock.md:46-51 | OK | as cited |
| 92-93 | `--only` already takes a range | heavy-run.mutants.js:143 (main); 901d3c39:150 | WRONG | range only on unmerged l202-idle-guard |
| 94-95 | weekly open-items run never scheduled | in_promises.md:89-95 | OK | schtasks 0 per sibling |
| 97-98 | append-only law = delta notes | out_memory_at_wake.md:249-250 | OK | [inferred] at source |
| 100-101 | ~2,000-min gap before the wake | in_cost.md:22-29 | OK | 1,990-2,030 min |
| 102 | subagent lever named | in_cost.md:137-138 | OK | librarian/2026-11-13.md:337 per sibling |
| 108-109 | masking "not found reachable" | out_memory_at_wake.md:248, :266-267 | UNSUPPORTED | source: "not read" / "not found"; never checked |
| 109-110 | appendix: summaries win long | out_memory_at_wake.md:154 | OK | as cited |
| 110-111 | 926 calls in 48 h | in_cost.md:73 | OK | sibling-0845a868 |
| 113 | continuity: 0 wrong in 8 | in_wake.md:83-85 | OK | one run, one grader, same model |
| 114 | ACE "may degrade" | out_memory_at_wake.md:163-165 | OK | verbatim |
| 115-117 | 200-line guidance; 32.5/33.5 | out_memory_at_wake.md:76-77; in_wake.md:84 | OK | as cited |
| 118-121 | Kim et al. per task; no matched tokens | out_multi_agent_cost.md:171-185 | OK | as cited |
| 122-123 | cross-provider errors correlate; 6.6 % | out_multi_agent_cost.md:101-111, :143-148 | OK | as cited |
| 128-132 | six fixes for the 403 class | in_stalls.md:224-230; in_delivery.md:215-226 | OK | as cited |
| 133-134 | no StopFailure hook, stamp reads Stale | in_delivery.md:118-124; settings.json | OK | 0 StopFailure in settings.json today |
| 135 | 2c not registered on D | settings.json; -Check | OK | 0 board-digest hits; DRIFT on D too |
| 136-137 | 2a may run a packet twice | in_delivery.md:222-223 | OK | as cited |
| 138-139 | 403 to StopFailure untested | out_reliable_delivery.md:229-231 | OK | as cited |
| 140 | class cost: two bursts, no figure | 00_build_paths.md:71-73 | DOWNGRADED | a sibling records 4-7 and ~9 min per pane |
| 141 | [ours] install 2c first | p-l198-403-stall-B:5-6 | DOWNGRADED | "NOT installed ... as ruled for this run"; needs blind.js |
| 145-146 | ask-ending: 22 of 6,983; cost unrecorded | ask-ending.jsonl; p-d619:45, :49 | WRONG (cost) | 22 of 6,997 holds; 104-110 ms recorded |
| 147-149 | stop.js: no reason on disk; ruling | stop.js:2-3; session-start.js:151; install.ps1:244-247 | WRONG | 3 live readers; 09-19 left it on D |
| 150-152 | stale second reader 229 / 2.39M | second-reader.jsonl | OK | 229 / 2,385,722 / 112 at 3,940 rows |
| 153-155 | state block 0 of 163; 8,046 startup | sessionstart-state.jsonl; p-d627-p3:30 | DOWNGRADED | 8,039 of 8,046 are Aug-Sep; 0 since 10-29 |
| 157-159 | 0 PreCompact rows; L no-op | librarian transcript; precompact.js:27-40 | DOWNGRADED | count holds; L no-op predates 6d12f9fa |
| 160-161 | preserve: stale 3.5 %, five/six | precompact-preserve.js:108-131; remeasure-B:29-32 | DOWNGRADED | 7-event reading; SHA NEITHER on 11 |
| 163-165 | 3 declared, unregistered; no ruling | -Check; carrier-drift.jsonl; rulings_owed:31 | DOWNGRADED | 4 listed; decision recorded as open |
| 166-167 | -Check 4,950 UNCLAIMED | -Check output | OK | "4950 UNCLAIMED" at line 59 of 5,031 |
| 171-173 | warn counts in light mode | board.jsonl; sources-gate, reply-slot ledgers | WRONG (521) | 521 pane rings carry no light mark |
| 174-175 | H3 never scored | h3_runbook_2026-10-17.md:4-20 | OK | window end 2026-10-18T00:34:07Z |
| 176-177 | every-turn line does not fire | in_stalls.md:88-89; 09-16:83 | OK | "345 times" in :83 |
| 184-185 | push-gate 2 planted denies | push-gate.jsonl | OK | 349 rows, deny 2 on 10-06 |
| 186 | delete-gate 2 real denies, one `C:\` | delete-gate.jsonl | OK | 10-11 and 10-29 |
| 187-190 | second readers struck 58+; 578 calls | in_promises.md:283-287; in_cost.md:60-62 | OK | the critic counts 76 struck spans |
| 191-193 | code held better than rules | in_stalls.md:265-271 | OK | counter-cases carried |
| 197-199 | S2 recurred; intake 108,857 B | in_stalls.md:28-31; instance CLAUDE.md | OK | 108,857 B by ls |
| 201-203 | 53.2 % above 250k; 14 of 37 | in_cost.md:95-96; p-d627-p4:10-11, :84 | OK | as cited |
| 209-213 | what stands, with costs | in_stalls.md:252-257 | DOWNGRADED | the 46 min is S25's wrapper cost, shared by the guard |

**Tally: 61 rows. OK 44, WRONG 6, UNSUPPORTED 2, DOWNGRADED 9.** Lines 75-77 are one row. The [read] probes in
section 0 were not re-checked, except `[WRITE FAILED]` on D's board (0, `grep -cF`) and -Check (re-run).

**Stop/remove items that held up**
- The stale second-reader copy on D. Reproduced exactly; the fix is a sync of a change already made (bd576735), not a
  removal.
- ask-ending.js as a shadow log nobody read: 22 matched of 6,997, all shadow, 0 librarian notes cite it. But removing
  it saves about no wall time (parallel Stop hooks, 104-110 ms each), and its own stated end is a review that never ran
  (ask-ending.js:12-13). Run the review on the 22, or cut it; the rulings on it were the librarian's own.
- precompact.js's output on auto compaction is untested: 0 PreCompact hook rows on this transcript. "Test once" holds.

**Stop/remove items that did NOT hold up, or need the keeper's word**
- stop.js on D. Not idle: session-start, userprompt-submit and session-end all read its 42,257 rows. The 09-06 ruling
  is L's (install.ps1:244-247), and on 09-19 it was left on D: "If he wants them gone he says so by name"
  (loop/keeper_rulings_owed_2026-09-19.md:10). His word, by name.
- The state block. Its NOISE verdict is one hand count, marked inferred at source. The "8,046 startup rows" against
  serving it at startup is an August-September count; startup rows are now near zero. Neither drop nor extend is shown.
- The declared, unregistered hooks. Recorded as an open decision since 09-19 (rulings_owed:31; install_D:14), taken
  under the keeper's delegation. Installing them registers new hooks, a behaviour change.
- The preserve directive's "decorative half". D089's verdicts rest on 7 events; on 11, SHA moves to NEITHER.
- 2c's install, ranked first in §4 and §9. Its hand-back says not installed "as ruled for this run" and that it needs
  blind.js, which in_promises lists for retirement. Needs that ruling first.
- The lease (§1.5). Its "refused design" was a different design; the item is unsupported, not refuted.

**What I did not open**
- L: its board, ledgers (landing-train.jsonl, landing-ready.jsonl), transcripts, installed hooks. Every L-side figure
  stays [summary].
- The out_* files' outside sources; no web request was made.
- The trace `loop/stall_trace_403_packets_eaten_2026-11-13.md`, and the L handoff beyond `:63`.
- Whether any of the 112 flagged second-reader reads or the 68 spoken carrier-drift lines were later acted on.
- Whether PreCompact stdout reaches the summariser on auto: the transcript shows only the manual echo. One of 80
  summaries carries the preserve canary; whether that is the hook or quoted text was not checked.
- O's window behind "0 of 163": I re-counted the ledger (166 emitted 10-20..11-03), not the turns.
