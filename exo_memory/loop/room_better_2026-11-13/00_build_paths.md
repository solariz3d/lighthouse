# Build paths from the room-better swarm, ordered by recorded cost (Apply reader, 2026-11-13)

Read: the twelve reader files in this folder, as corrected by their second readers (struck text ignored). Written on D
at about 15:10Z, lighthouse HEAD c6d56c37. Read-only except this file. Options and evidence, not decisions.

**Marks.** [summary] = taken from one of the twelve swarm files. Those are checked secondary accounts; the swarm file is
named, with the primary path it cites. [read] = I opened that line or ran that probe myself today. [inferred] = mine.
[ours] = a proposal. Outside sources appear only as the outside readers report them, so they carry [summary], except the
Claude Code model-config page, which I downloaded with curl today.

**Order.** Part 1: faults with a cost recorded in minutes, largest first. Part 2: costs recorded in tokens, largest
first. Part 3: no cost recorded. Minutes and tokens are not on one scale, so the parts are not ranked against each other.
Where two costs overlap in time, the overlap is named and not added.

"His call: none found" and "Outside: none in the swarm" mean none in the twelve files or in the lines I opened
[summary].

**Each section:** evidence, cost, smallest fix, proving check (red today), rebuild or install and when it is safe, his
call, outside, and whether the fault is already in `loop/handoff_lighthouse_2026-11-13-L.md` (the plan registered that
the swarm did nothing if this file names no fault outside that handoff, `loop/plan_room_better_swarm_2026-11-13.md:42-43`
[read]).

## 0. Facts that bear on every rebuild or install today (probed on D, 15:08-15:10Z)

- The running app is `consonance/src-tauri/target/release/consonance.exe`, pid 24164, started 08:42:24 local
  [read: Get-Process].
- That exe is dated 2026-11-08 23:56 local [read: `date -r`]. The last commit to any `.rs` file is 880f237f,
  2026-11-04, and no file under `consonance/src-tauri/src` is uncommitted [read: git log, git status]. So the running app
  postdates the last Rust change [read]; that it was built from this checkout is [inferred].
- ~~A release build ran on D this morning: 135 files under `target/release` were written between 08:44 and 08:48 local,
  and `consonance.exe` was not replaced [read: find -newermt]. Why it stopped is not on disk anywhere I looked [read].~~
  [2nd reader: the 135 files (08:44:52 to 08:48:03 local) hold 0 `.rlib` and 0 `.exe` [read: find]. The librarian's note
  says "Checked: consonance source compiles (cargo check --release, 47.6 s, warnings only)" (`librarian/2026-11-13.md:387`).
  So it was a check, not a failed build. The same line: "Which rebuild failed is not on disk that I could find: asked him."]
  Whether it is the one in his words "rebuild didnt succeed" (`exo_memory/librarian/2026-11-13.md:387`) is not shown
  [inferred].
- The morning pull (0b85fead..8fd453c6) changed no Rust source; under `src/` it touched only `MAP.md` [read: git diff
  --stat]. So a rebuild before any fix lands would build the same code as the running exe [inferred].
- A restart drops the in-memory inbox: "A RESTART DROPS THE QUEUE WITH NO ROW" (`consonance/tools/chain-status.js:744`)
  [read]. Since 14:00Z D's board holds 6 `QUEUED ->` and 4 `DELIVERED ->` rows; I did not pair them [read: node count,
  15:09Z].
- No `heavy-run.lock` or `heavy-run.hold` in `C:/Consonance/data` at 15:08Z [read]. [2nd reader: true at 15:08Z only. At
  15:28Z both slots are held: `heavy-run.lock` (C, "D651 stomp-all", started 15:20:22Z) and `heavy-run.2.lock` (A, "D664
  d673b_build", 15:28:03Z) [read: the lock files]. The hold was lifted at his 09:25 word (`librarian/2026-11-13.md`, 09:28
  entry). Re-read the data dir before any merge or restart.] P's dreamzone-3 build on D ended:
  build exit 0 in 82 s, test 14 of 14 in 601 s (`librarian/2026-11-13.md:397`) [read].
- The pulse runs `consonance/tools/chain-status.js` from the repo path (`~/.claude/shell/hooks/userprompt-submit.js:263`)
  [read]. So a change to it is live at the next prompt once it is on D's main, with no install [inferred].
- Briefs are read from the data dir first, then the bundled resource dir, then the repo (`main.rs:4067-4094`,
  `RESOURCE_ROOM` set at `:16378`) [read]. `target/release` holds COMMITTEE, BUILDING and LIBRARIAN.md, byte-equal to
  the repo today [read: cmp]. So a brief edit may reach a fresh pane only after the next build copies it [inferred; the
  resource dir's value at run time was not read].
- A restart opens a window; ~~his rule is "headless only, no GUI launch unless asked" (memory index `MEMORY.md:25`, the
  index line, not his words) [read].~~ [2nd reader: the index line reads "he races while T-180 runs; headless only, no GUI
  launch unless asked" (`MEMORY.md:25`). It names T-180, not a Consonance restart. No rule for a restart window was found;
  the window stays his call (§1 "His call").]
  A cold resume of eight seats wrote 6,587,136 tokens to cache in about eight minutes
  this morning (in_cost.md, Table A) [summary]. The plan notes "The desktop starts a new week at about 16:00 local"
  (`plan_room_better_swarm_2026-11-13.md:34`) [read].
- Tier: delivery, gates, installs and concurrency are "prove it" in `C:/Users/nname/.claude/CLAUDE.md:10` [read]: test
  first, the mutation runs for the file, the full suite at landing.

---

## Part 1. Costs recorded in minutes

### 1. A packet counts as done when pasted; nothing checks that the receiver acted

- **Evidence.**
  - 09-16: the chair's last line was 13:16:05, "Waiting on C to re-send"; C's re-send had been delivered at 13:15:46.
    Nothing moved until his next prompt at 17:40 (`librarian/2026-09-16.md:177`) [read].
  - 11-13: "six orders and one task result were marked delivered, none was acted on, and no seat was told. The room
    looked busy until the keeper looked at the panes." (`loop/stall_trace_403_packets_eaten_2026-11-13.md:23`) [read].
    A second burst at 10:15Z hit A, C and B the same way (same file, "The second burst") [read].
  - Mechanism: the drain writes `DELIVERED ->` at `main.rs:12230` and reads no reply (in_delivery.md §1, §3.1)
    [summary]. The ready stamp is written by a `Stop` hook; Claude Code runs `StopFailure` instead of `Stop` when a turn
    ends on an API error; the room registers none, so an errored pane reads Stale and Stale delivers as soon as the
    screen is idle (in_delivery.md §3.2) [summary]. `StopFailure` has 0 hits in `dev/shell/install.ps1`, 0 files under
    `consonance/` and 0 in `~/.claude/settings.json` [read].
- **Cost.** 4 h 24 m on 09-16 (in_stalls.md S11) [summary]. [2nd reader: the span holds (13:16:05 to 17:40,
  `librarian/2026-09-16.md:177`), but it is not this section's fault. C's re-send went to the LIBRARIAN through the door:
  D's board, 2026-09-16 19:15:46Z, "call_librarian C -> LIB [Received]", with no `DELIVERED ->` drain row [read: node pass
  over `C:/Consonance/data/board.jsonl`]. The seat that waited was the chair, on an event that had happened elsewhere
  (in_stalls.md:246). So the 4 h 24 m should not rank this section first.] On 11-13: 7 deliveries lost, about 4 to 7 min
  per pane in the first burst and about 9 min for A and C in the second [inferred by out_reliable_delivery.md and
  in_delivery.md from the trace's timestamps]. [2nd reader: DOWNGRADED. 4 to 7 min runs from the deliveries (09:47:01Z,
  09:50:09Z) to the 09:54Z nudge being sent (`stall_trace_403…:19-26`); that the panes cleared then is inferred
  (in_delivery.md §3.1, second reader). Both bursts were on L: D's board has 0 rows between 11-12T21Z and 11-13T14Z.]
  Both times the stall ended at a human prompt or look [read: the two lines above]. [2nd reader: for the second 11-13
  burst, no: A and C answered the chair's nudge and B woke on a task notification (`stall_trace_403…:40-41`).]
- **Smallest fix, in three steps** [ours]:
  1. No rebuild: a `chain-status.js` clause, "delivered to <seat> at <t>; <seat> has not moved since", from the board's
     DELIVERED row and the receiver's next line. ~~It covers the 09-16 case, where nobody errored.~~ [2nd reader: it
     covers neither recorded case as written. 09-16: no DELIVERED row exists (door delivery to LIB, see Cost), and the
     seat that waited was the chair, a third seat. 11-13: each receiver's next line WAS a line, the API error (the
     trace counts "assistant lines matching 'API Error: 403'", `stall_trace_403…:6`), so "has not moved" would not fire
     unless error lines are excluded. A pure duration clause was refused before: "SIX MINUTES OF ALARM OVER A CORRECT
     STATE" (`consonance/tools/chain-status.js:260`).]
  2. Install only: a `StopFailure` hook beside `ready-stop.js` that writes the stamp as failed and one board row
     (in_delivery.md option A). [2nd reader: install-only gives the board row, not a held queue. The running exe reads a
     stamp's `ready` as true or false and anything else as Absent (`parse_stamp`, `main.rs:11130-11139`); Stale and
     Unstamped both deliver on an idle screen (`drain_decision`, `main.rs:11645-11647`). Option A holds a failed pane
     only with "the drain half [which] needs a rebuild" (`in_delivery.md:215-217`). Not named here: fix 2c, the `[panes]`
     API-error line, is landed (b0be06f0, present on D) and not installed, and needs `blind.js` (`handoff…-L.md:59-60`);
     `loop/api_error_watch_2026-11-13.js` is the stand-in, proven once on L's live board (`stall_trace_403…:45-49`). Both
     are no-rebuild routes for the 11-13 case already on disk.]
  3. Rebuild: the trace's 2a and 2b in the drain (NOT ACTED ON with one "carry on" retry; release one queued packet per
     completed turn).
- **Proving check, red today.**
  - Step 1: ~~a fixture board with a DELIVERED row to the chair and no chair line for 15 min must print the clause.~~
    [2nd reader: this fixture is not the 09-16 case and would pass a clause that misses it. The 09-16 rows are a door
    row "call_librarian C -> LIB [Received]" at 19:15:46Z and the chair's "Waiting on C to re-send" at 13:16:05 local
    (`librarian/2026-09-16.md:177`). A fixture for 11-13 needs L's board rows, which are not on D.]
    `grep -c "NOT ACTED ON" consonance/tools/chain-status.js` returns 0 [read].
  - Step 2: `grep -c StopFailure dev/shell/install.ps1` returns 0 [read]; green when `install.ps1 -Check` shows the hook
    registered and a fixture `StopFailure` input writes the failed stamp.
  - Step 3: the trace's own test, "feeds a pane reply of 'Please run /login · API Error: 403 …' after a delivery and
    requires the delivery's state to be 'not acted on, redelivery pending'", then exactly one redelivery after one clean
    reply (`stall_trace_403…:31`) [read]. `grep -c "NOT ACTED ON" consonance/src-tauri/src/main.rs` returns 0 [read].
- **Rebuild or install.** Step 1: none, live at the next prompt (§0). Step 2: `install.ps1 -Only`, between turns
  [inferred]. Step 3: `cargo tauri build` and a restart, with the §0 conditions: no unpaired QUEUED row, no lock, his
  word on the window [inferred].
- **His call.** Whether the automatic "carry on" may re-run a packet the pane already holds: on 11-13 the librarian
  chose a nudge, not a re-send, because "The packets are already in each pane's context" (`stall_trace_403…:26`) [read].
  The restart window (§0).
- **Outside.** Supports: RabbitMQ calls automatic ack "unsafe" and asks consumers to expect redeliveries "with idempotence
  in mind"; Kafka's process-then-save order is at-least-once (out_reliable_delivery.md §1) [summary]. Supports step 2:
  the Claude Code hooks page says `StopFailure` "Runs instead of Stop when the turn ends due to an API error" and its
  output is ignored, side effects only (in_delivery.md, second reader; out_reliable_delivery.md §6) [summary]. Caution:
  whether a Cloudflare 403 is matched as `authentication_failed`, `server_error` or `unknown` is not stated or tested
  [summary]. Caution: ack-after-start still counts an errored turn as delivered unless "started" excludes it
  (out_reliable_delivery.md, second reader) [summary].
- **In the L handoff:** 2a, 2b and 2c yes (`handoff…-L.md:57-61`) [read]. The missing `StopFailure` hook as the reason
  the queue drained into the error, and the 09-16 no-error case, are not there [read].

### 2. The landing train has no owner, and its hold parks the room

- **Evidence.** "four branches READY, last landing 11:21Z" (`librarian/2026-11-13.md:280`) [read]; "the train was
  waiting on a slot held by B's own guard-mutants run" (`:295`) [read]; A "ran the train itself at 06:58 after nobody had
  for about 50 minutes" (`:312`) [read]. The exclusive hold is written first and then waits for every slot, and while it
  exists every runner waits (`heavy-run.js:77-86`, `:451-466`; in_lock.md "How the instruments behave") [summary]. The
  train crashed on HEAVY_RUN_TIMEOUT at 12:21Z (commit f415383b; in_lock.md) [summary].
- **Cost.** 99 min 40 s with nothing landed, 11:21:13Z to 13:00:53Z (in_lock.md) [summary]; about 50 min of it with no
  train run (`:312`) [read]. The idle holder (section 4) and the memory gate (section 5) sit inside the same window; do
  not add them. "A waited 41 minutes behind the train" (`:213`) is the order a landing-first rule already gives, so it is
  not an ordering loss (in_lock.md and out_merge_queue.md, second readers) [summary]. [2nd reader: DOWNGRADED, contested.
  The handoff reads the other way, "short runs parked behind 16 mutants" (`handoff…-L.md:63`), and out_merge_queue's
  second reader counts it as waiting cost (00_critic.md §2.1). Which seat waited on which is not settled by either line.]
- **Smallest fix** [ours]: (a) an owner: a `chain-status.js` clause "READY <n>, train not run for <m> min", or a watch
  mode on the train; (b) the hold reserves instead of parking: it blocks only new long runs while slots drain
  (in_lock.md queue option 3); (c) a queue file of waiters with class and start time.
- **Proving check, red today.** `grep -c landing-ready consonance/tools/chain-status.js` returns 0 [read]. A heavy-run
  test: a hold waits on two busy slots, a run declared short arrives, and it must start within one poll; today the hold
  blocks it [inferred from `heavy-run.js:77-86`]. `grep -ciE 'queue|priorit' consonance/tools/heavy-run.js` returns 0
  [read].
- **Rebuild or install.** None; JS tools. Merge when no lock or hold is present (none at 15:08Z) [read]. [2nd reader: two
  locks held at 15:28Z, see §0.]
  `landing-ready.jsonl` and `landing-train.jsonl` live on L only (in_lock.md) [summary], so (a) is testable on D only
  with a fixture [inferred].
- **His call.** For the owner, none needed: landings are a pane's job, the chair only routes (memory index `MEMORY.md:27`,
  the index line) [read]; so the owner is a pane the chair names [inferred]. Moving sweeps and mutants to D touches both
  machines and is "not measured" (`handoff…-L.md:67`) [read]; P's run on D today is one control run [inferred].
- **Outside.** Supports a short class going first without preempting a running job: Mergify's default inserts a higher
  priority "just after the pull requests whose checks are running"; GitHub and GitLab warn that a jump rebuilds work in
  flight (out_merge_queue.md §3) [summary]. Supports an aging rule: Rust leaves cycles for `never` PRs so they get a
  chance (§1) [summary]. Limits: every source is a fleet of tens to thousands of workers; none measures one machine
  (§"Could not obtain") [summary]. Batching landings pays only if most pass (bors-ng's own assumption); the room's pass
  rate is not measured [summary].
- **In the L handoff:** owner and invisible queue yes (`:62-63`) [read]. The hold parking the room is not in the list
  [read].

### 3. The collator waits on a ring for a promised addendum

- **Evidence.** E wrote an addendum without re-ringing, "and the librarian waited for a ring until a keep-warm at 19:06
  prompted a look at the file" (`loop/stall_trace_2026-09-23.md:68-74`) [read]. "addendum" has 0 hits in
  `consonance/src-tauri/brief/` [read].
- **Cost.** 50 min (`:68`) [read].
- **Smallest fix.** The trace's own: when a hand-back promises an addendum, check the file at about 10 min, never wait
  on a ring (`:72-73`) [read]. Carrier [ours]: one line in COMMITTEE.md "The hand-back", or a chain-status clause "a
  hand-back file changed after its ring".
- **Proving check, red today.** The trace's: "the next such hand-back is collated within 15 min of its addendum's mtime"
  (`:73-74`) [read]. Today no brief or tool carries the rule [read: grep 0].
- **Rebuild or install.** A brief line reaches fresh panes after a build copies it (§0) [inferred]; a chain-status clause
  needs none.
- **His call.** None found.
- **Outside.** The ring as a pointer and the file as the durable store is the at-least-once part
  (out_reliable_delivery.md, "Against the room") [summary]; reading the file, not the ring, follows from it [inferred].
- **In the L handoff:** no [read].

### 4. A lock held by an idle shell

- **Evidence.** The owed fix: `MSYS_NO_PATHCONV=1` or `cmd //c` in every wrapper, a one-second proving check, and a
  heavy-run.js guard (`loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md:20-24`) [read]. Second time: "the 'fix, for
  good' above was never built, and the stall came back at seven times the length" (`:30`) [read]. The guard is on L's
  branch `l202-idle-guard` 901d3c39 with 73 of 97 mutants unrun (in_stalls.md S26) [summary]. On D, ~~`git cat-file -t
  901d3c39` fails;~~ [2nd reader: true at 15:10Z only. D fetched at 09:28:08 local (`.git/FETCH_HEAD`); `git cat-file
  -t 901d3c39` now returns commit, on `origin/l202-idle-guard`, not in HEAD [read]. The 09:28 note sends P to run its
  unrun mutants, no merge (`librarian/2026-11-13.md`, 09:28 entry).]
  `idle` has 0 hits in `heavy-run.js`; `MSYS_NO_PATHCONV` is in 0 files under `consonance/` [read].
- **Cost.** "46 minutes over two nights" (`librarian/2026-11-13.md:318`) [read]; every pane idle 4 to 29 min
  (`stall_trace_lockbn…:27`) [read]. The train's 30-min timeout and crash fall inside the 40 (in_lock.md) [summary].
- **Smallest fix.** (a) Fetch, finish the unrun mutants, and merge B's guard [summary: B's hand-back via in_stalls.md].
  (b) One shared `cmd /c` wrapper with `MSYS_NO_PATHCONV=1`, named in BUILDING.md [ours].
- **Proving check, red today.** The trace's: run the wrapper with a trivial `.cmd` that prints and exits; it exits
  within a second (`:22`) [read]. B's guard rows (a held child with no CPU for N min is named on the board): not on D
  [read: cat-file fails].
- **Rebuild or install.** None. ~~The branch must reach D's clone first [read: object absent].~~ [2nd reader: it has, as
  `origin/l202-idle-guard`, see Evidence.] Merge when no lock is held
  [inferred].
- **His call.** None found. The trace calls the guard "owed ahead of feature work" (`:30`) [read].
- **Outside.** Supports a progress test over a liveness test: Temporal asks "How do you know you are making progress?";
  LangGraph narrows its idle clock to explicit heartbeats; Kleppmann shows a lease alone lets a paused holder act
  (out_reliable_delivery.md §3) [summary].
- **In the L handoff:** yes (`:55-56`) [read].

### 5. The memory gate hides its cause, and runaway commands have no limit

- **Evidence.** "The gate worked and the message hid the cause. `landing-train.js:194` prints `g.text.trim().slice(-120)`,
  the TAIL of memwatch's line" (`loop/stall_trace_lowmem_reaper_2026-11-13.md:48`) [read]. `slice(-120)` is still at
  `consonance/tools/landing-train.js:194` [read]. The trace's rule: a command that can run away "belongs in a `timeout`"
  (`:50`) [read]. The 07:04 reap left a mutated `skeleton.cpp` and an orphan waiter; exit traps are in no brief
  (in_stalls.md S27) [summary]. `COMMITTEE.md:93` lets runs of three files or fewer skip the lock, with no memory clause
  [read].
- **Cost.** About 30 min with the train at the gate (`stall_trace_lowmem…:45`) [read]; when in the day is unresolved
  (in_lock.md, second reader) [summary]. The reap cost A about 12 min of a sweep (in_stalls.md S27) [summary].
- **Smallest fix** [ours]: (a) print the head of memwatch's line, or its largest process first (the trace suggested
  `slice(0, 160)`, in_stalls.md S28 [summary]); (b) a `timeout` line and an exit-trap line in BUILDING.md; (c) the
  memory clause for lockless runs, which the trace leaves open (`:37`, in_stalls.md) [summary].
- **Proving check, red today.** `grep -c 'slice(-120)' consonance/tools/landing-train.js` returns 1 [read]. A train test
  that feeds a memwatch line whose largest process comes first must print that process name; today it prints the tail
  [inferred]. `grep -ciE 'addendum|end condition|exit trap'` over the briefs returns 0 [read].
- **Rebuild or install.** None for (a); brief lines as in §0 [inferred].
- **His call.** Whether small lockless runs get a memory check: open in the record (in_stalls.md S27) [summary].
- **Outside.** No outside file covers memory gating. Backpressure (RabbitMQ prefetch, Reactive Streams demand) is the
  nearest and does not speak to it directly (out_reliable_delivery.md §5) [summary].
- **In the L handoff:** the swarm grep rule yes (`:84-85`, "A runaway grep") [read]. The hidden gate message, the
  `timeout` rule and exit traps: no [read].

### 6. Watchers and long foreground runs start with no end condition

- **Evidence.** Two `tail -F` watchers outlived the run by 20+ min; the rule "a watcher starts with an end condition" is
  in a dated trace only; a leftovers counter later found five ten-day-old `tail -F` processes (in_stalls.md S20; primary
  `stall_trace_2026-09-23.md:127-144`, `BUILDING.md:194-200`) [summary]. The background rule for runs over two minutes is
  in the briefs; its proving check, a count of foreground calls over 120 s, was not found (S13) [summary].
- **Cost.** 20+ min with A looking busy (S20) [summary]; 8 to 16 min per ring, twice, before the background rule (S13,
  `BUILDING.md:152`) [summary]. No cost recorded since either rule [summary].
- **Smallest fix** [ours]: the end-condition line in BUILDING.md beside the background rule; the leftovers counter run
  at each landing.
- **Proving check, red today.** `grep -ciE 'end condition|--pid'` over `consonance/src-tauri/brief/` returns 0 (in_stalls
  second reader) [summary]; "end condition" alone, re-run inside a wider pattern, gives 0 [read].
- **Rebuild or install.** Brief lines as in §0 [inferred].
- **His call.** None found.
- **Outside.** None in the swarm.
- **In the L handoff:** no [read].

### 7. The sender of a queued message is not told when it lands

- **Evidence.** The sender's last word is "queued … it delivers when it is ready"; the drain writes the board and the
  app log only (`main.rs:11991`, `:12226-12236`; in_delivery.md §3.3) [summary]. A queued ring was read as "never rang"
  (`stall_trace_2026-09-23.md:12`) [read].
- **Cost.** About 8 min, 03:14 to 03:22 (`:12`) [read]. Clause 4 of chain-status now prints a QUEUED wait over 3 min
  (`chain-status.js:724-751`) [summary], so the remaining gap is the moment it lands [inferred].
- **Smallest fix** [ours]: the drain row names the sender, and the pulse prints "your ring to <seat> landed at <t>" once.
- **Proving check, red today.** A fixture QUEUED row from the librarian plus its DELIVERED row must print the landed line
  to the librarian's pulse; no such clause exists [inferred].
- **Rebuild or install.** Pulse half: none. Drain half: rebuild (§0).
- **His call.** None found.
- **Outside.** AutoGen sends a handler's exception back to the sender on a direct message and only logs it on broadcast
  (out_reliable_delivery.md §6) [summary]; it supports telling the sender, about errors more than landings [inferred].
- **In the L handoff:** no [read].

---

## Part 2. Costs recorded in tokens

### 8. Seats run to about 968k before compacting, carrying every tool output

- **Evidence.** Four of seven auto-compactions in 48 h fired at 967,632 to 969,695 tokens, all `trigger: auto`; two more
  landed just after (in_cost.md, Table B and second reader) [summary]. The docs: models with a native 1M window "compact
  before the window fills, at about 967K tokens by default" [read: code.claude.com/docs/en/model-config.md, "Default
  auto-compact thresholds", downloaded 15:05Z]. No window is set for the seats: `autoCompactWindow` 0 hits in
  `~/.claude/settings.json`, `AUTO_COMPACT|autocompact` 0 hits in `main.rs` [read]. Tool results: 4,750 in 48 h, 6,888k
  characters, mostly mid-size Bash and Read outputs (in_cost.md cost 3) [summary].
- **Cost.** Context above 250k: up to 30.8 M of 83.4 M weighted units in 48 h, about 37 %, an upper bound (in_cost.md
  cost 1) [summary]. Carried tool output: about 423 M re-read tokens, 18.3 % of cache reads, an estimate inside the same
  figure (cost 3) [summary]. Do not add the two.
- **Smallest fix** [ours]: (a) an auto-compact window per seat: `/autocompact <n>`, `autoCompactWindow` in settings, the
  `--autocompact` flag at launch, or `CLAUDE_CODE_AUTO_COMPACT_WINDOW` [read: model-config.md, "Set the auto-compact
  window"]; (b) bulk reads in subagents that return a path and a number (`handoff…-L.md:42`) [read]. [2nd reader: two of
  the four are not per seat on one machine. `/autocompact` "saves it to your user settings under the current model in
  modelSettings" (model-config.md:866, the 15:06Z download) and `autoCompactWindow` is "For every model" (:867); every seat
  reads the one `~/.claude/settings.json` (`modelSettings` at :149). Per seat means the `--autocompact` flag or the env
  var at the seat's launch; Consonance passes no per-seat model or flag (memory `seat-substrates.md`; 0 autocompact hits
  in `main.rs`), so per seat needs a rebuild. Settings alone change every seat at once.]
- **Proving check, red today.** The same node pass as in_cost.md over the next 48 h: median context per call below a
  stated figure and no compaction above the set window. Today 4 of 7 compactions sit at about 968k [summary]. Registered
  beside it, so it can fail: the seat's error rate on cited facts after a compaction does not rise
  (out_memory_at_wake.md §5 f) [summary].
- **Rebuild or install.** (a) by settings or flag: no rebuild; a launch flag in `main.rs` would need one [inferred].
- **His call.** Yes, per seat: "no seat compacted or its context cut … without his explicit word for that seat" (memory
  index `MEMORY.md:44`, the index line) [read].
- **Outside.** Supports smaller context: Chroma and LongMemEval find focused prompts beat full ones; the Complexity Trap
  finds masking old observations halves cost at an equal solve rate, and summaries lengthen runs (out_memory_at_wake.md
  §3) [summary]. Caution: ACON finds generic summaries drop critical state; the room's own summaries kept shas 10.2 % and
  falsifiers 3.5 % (§3, §5) [summary]. Whether Claude Code exposes tool-result clearing for the main conversation was
  not found (§"Could not obtain") [summary].
- **In the L handoff:** "Compact sooner, safely" and "Keep bulk out" yes, for the librarian (`:38`, `:42`) [read]. The
  same for every seat, and the 968k default as the cause, no [read].

### 9. Seats resumed cold at 500k to 930k, then switched model after the wake

- **Evidence.** The wake wrote 6,587,136 tokens to cache across eight seats between 14:43Z and 14:51Z, after gaps of about
  1,990 to 2,030 min (in_cost.md, Table A and second reader) [summary]. The chair and the librarian then moved from Opus
  5.5 to Fable 5.2; the first Fable call rewrote the context (in_cost.md cost 2) [summary]. 4,608 of 4,617 seat calls in
  48 h ran on Opus 5.5 [summary], while `~/.claude/settings.json` names `"model": "fable"` [read]. The record's rule:
  "after a >1h gap or a model switch the first call reloads the whole thread uncached" (`MEMORY.md:5`, index line) [read].
- **Cost.** Wake writes: 71.6 % of the last 24 h's weighted spend (7.84 of 10.95 M units) [summary]. The switch: about
  1.18 M units if Fable was meant, 2.49 M if Opus was (in_cost.md, second reader) [summary]. [2nd reader: both re-derived
  from `seat_tokens_24h.json` (write 6,587,136; units 7.84 of 10.95). The switch rewrites (14:48-14:49Z) are inside the
  7.84 M, so do not add the two.]
- **Smallest fix** [ours]: choose each seat's model before it wakes; compact while the cache is warm, before a long
  break, or start a fresh seat from its handoff instead of resuming a large context.
- **Proving check, red today.** At the next wake, the first call per seat writes under a stated size, and no seat writes
  its full context twice inside ten minutes. Today: two seats did (in_cost.md) [summary].
- **Rebuild or install.** None [inferred].
- **His call.** The model per seat ~~(plan "His calls", `:32-34`) [read]~~ [2nd reader: plan `:34` is the model for the
  swarm run, not for seats. The seat record is memory `seat-substrates.md` (index `MEMORY.md:39`): Fable 5.2 the default
  from 2026-11-10 at his word, and "Seats that were already running keep Opus 5.5 until they restart or get `/model`".
  That bears on which of 1.18 M or 2.49 M applies.]; any compaction (section 8).
- **Outside.** Supports warm compaction: the Claude Code caching page says `/compact` "costs the most when you resume an
  old session" and the 1-hour TTL holds on a subscription within plan usage (out_memory_at_wake.md §2) [summary]. Caches
  are model-scoped (in_cost.md, second reader) [summary]. "Consolidate, then start fresh" (multi-turn paper, §3)
  [summary].
- **In the L handoff:** no; the handoff measured the librarian on L only (`:25-37`) [read].

### 10. The hooks on D are not the repo's

- **Evidence.** `install.ps1 -Check` on D: 10 DRIFT, 3 ABSENT, 4 declared not registered, 1 registered not declared,
  `stop.js` excluded but live (in_hooks.md §1) [summary]. P's run today found the same (`librarian/2026-11-13.md:397`)
  [read]. The installed `second-reader.js` predates the 11-03 narrowing: "relayed" 0 hits there, 1 in the repo [read].
  `second-reader-note.js` is not installed [read]. `board-digest` has 0 hits in `~/.claude/settings.json` [read]; fix 2c
  is installed on neither machine (in_hooks.md finding 4; `handoff…-L.md:59`) [summary]. `ask-surface.js` runs from the
  repo path and -Check does not report it (finding 3) [summary]. The verdict lines sit after 4,950 UNCLAIMED lines
  (§1) [summary].
- **Cost.** The stale second reader made 234 model reads of `call_librarian` rings, 2,431,909 tokens, since 11-03 15:25Z
  (in_hooks.md finding 1, second reader) [summary]. [2nd reader: still growing: 237 reads, 2,479,021 tokens, 116 flagged,
  at 3,955 ledger rows read 15:27Z (`C:/Consonance/data/second-reader.jsonl`, node pass: status ok, call_librarian).]
  D631's two-week falsifier clock has not started on D (in_promises.md
  §5) [summary]. The buried verdict cost one re-run [summary].
- **Smallest fix** [ours]: `install.ps1 -Only <file>` one entry at a time, starting with `second-reader.js`, then
  `second-reader-note.js`; teach -Check to print verdicts first and to report repo-path registrations.
- **Proving check, red today.** `install.ps1 -Check` lists `hooks\second-reader.js` as DRIFT (in_hooks.md) [summary];
  `grep -c relayed ~/.claude/shell/hooks/second-reader.js` returns 0 [read]. Green when -Check reports ok and a
  `call_librarian` ring writes a skipped-class row with no model call (bd576735's message, in_hooks.md) [summary].
- **Rebuild or install.** Install only, between turns; never a bare installer run: on 09-07 one re-registered three
  hooks against a ruling and the hand removal deleted `ready-stop.js` (`install.ps1:18-24`, in_hooks.md) [summary].
- **His call.** `stop.js` excluded by his 09-06 ruling yet live, in the librarian's words "a hand decision that is his"
  (`librarian/2026-11-13.md:397`) [read]. ~~`board-digest` on D: "the digest hook off for a dated window by the keeper's
  hands" on 09-16 (`map/M.md:913`) [read];~~ [2nd reader: `M.md:913` is headed "04:12 L, 09-16" and is about L's battery
  run; it says nothing about D. Why board-digest is absent on D is not shown. The installer registers it on no machine:
  install.ps1 lists it as "REGISTERED, NOT DECLARED" on L (`dev/shell/install.ps1:1069-1072`).] whether it returns, and
  with it fix 2c, is his [inferred].
- **Outside.** None in the swarm.
- **In the L handoff:** partly. L's drift and "D should run `install.ps1 -Check` on itself" (`:64-65`) [read]; the token
  cost of D's stale second reader is not there [read].

---

## Part 3. No cost recorded

### 11. A restart drops queued messages with no row

- **Evidence.** The inbox lives in memory (`main.rs:11716`); `take_ready_read` pops before `inject_to_pane` writes, and a
  failed write is only logged (out_reliable_delivery.md, "Against the room", second reader) [summary]. D's board: 34 to 42
  QUEUED rows with no drain row, depending on the pairing rule (in_delivery.md §4) [summary].
- **Cost.** Not recorded [summary]. It bears on any restart today (§0: 6 QUEUED, 4 DELIVERED since 14:00Z) [read].
- **Smallest fix** [ours]: on shutdown, write one `DROPPED -> <id8>` row per queued message; later, persist the inbox.
- **Proving check, red today.** A Rust test: queue two messages, run the shutdown path, require two DROPPED rows.
  `grep -cE 'inbox\.jsonl|inbox_path' main.rs` returns 0 [read]. [2nd reader: that grep tests persistence, the later
  step. For the first step, `grep -c 'DROPPED ->' main.rs` returns 0 [read]; the 6 "DROPPED" hits are unrelated comments.]
- **Rebuild or install.** Rebuild. The fix itself cannot protect the restart that installs it [inferred].
- **His call.** None found.
- **Outside.** RabbitMQ requeues unacked deliveries when a channel closes; SQS hides rather than deletes until the
  consumer deletes (out_reliable_delivery.md §1) [summary].
- **In the L handoff:** no [read].

### 12. The wake: the shelf is built before the pull, and busy days do not fit

- **Evidence.** This morning's intake was written at 08:42:42 and the 307-commit pull landed at 08:43:40 (in_wake.md
  fault 1) [summary]; the librarian's CLAUDE.md is still dated 08:42:42 and carries no HEAD stamp [read]. The light cap
  is 24,000 bytes; 11-11 was 128,841 B and 11-13 over 62,000 B, so neither is carried (faults 2, 3) [summary]. On 11-12
  he wrote "the handoffs are good, but when you come back, it shouldnt be the only thing you see, the rest should rise to
  the surface too" (`loop/plan_retrieval_at_the_wake_2026-11-12.md:9-10`) [read].
- **Cost.** Two further prompts from him on 11-12, minutes not recorded (in_wake.md fault 3) [summary]. That the cap
  caused them is the second reader's inference, in the same place [summary].
- **Smallest fix** [ours]: stamp the shelf with the HEAD it was built from; rebuild the shelf after a pull.
- **Proving check, red today.** `grep -c '^shelf built at HEAD'` (or the stamp chosen) in the instance CLAUDE.md returns 0
  [inferred]; the intake is older than the last pull [read].
- **Rebuild or install.** Rebuild (`corpus_shelf` is in `main.rs`) [summary].
- **His call.** Yes: the retrieval plan is "parked at his word" (`handoff…-L.md:66`) [read].
- **Outside.** Supports reading state at start: the vendor's multi-session pattern opens each session with a progress
  log and `git log` (out_memory_at_wake.md §1) [summary]. Claude Code advises under 200 lines per CLAUDE.md (§1)
  [summary] [2nd reader: the quote holds in the downloaded page ("target under 200 lines per CLAUDE.md file", scratchpad
  `dl/ccmem.txt:185`). Against it on this room: the continuity test scored the full room 32.5 / 33.5 of 34 with 0 wrong
  (`loop/room_value_result_2026-11-03.md:67`); adherence is not measured (00_not_worth_it.md §3).];
  the librarian's intake is 878 lines and the chair's 761 (`C:/Consonance/instances/*/CLAUDE.md`) [read].
- **In the L handoff:** retrieval yes (`:66`) [read]; the pre-pull shelf, no [read].

### 13. The gates run light while the briefs describe refusals

- **Evidence.** `gates_mode` is `light` on D [read]. LIBRARIAN.md says the ring is refused and "when the keeper switches
  the gates it warns instead" (`consonance/src-tauri/brief/LIBRARIAN.md:113`, `:133`) [read]. D's board: 1,018
  no-trailer warnings on `call_chair` against 26 refusals, all time (in_delivery.md §4) [summary]. The trailer gate that
  answered the 82-minute stall is warn-only on D (in_stalls.md S9) [summary].
- **Cost.** Not recorded [summary].
- **Smallest fix** [ours]: one line in each brief that describes a refusal, naming the mode that refuses.
- **Proving check, red today.** The briefs name `gates_mode` beside each refusal; today LIBRARIAN.md does not at `:113`
  [read].
- **Rebuild or install.** Brief text, as in §0 [inferred].
- **His call.** Yes: "when the keeper switches the gates" (`LIBRARIAN.md:133`) [read].
- **Outside.** None in the swarm.
- **In the L handoff:** no [read].

### 14. Registered checks with no score and no due date

- **Evidence.** H3: window closed 2026-10-18T00:34:07Z, "Score: the librarian", no score file (in_promises.md item 2)
  [summary]; the one `loop/` file whose name starts with h3 is the runbook [read: ls]. ASK-001's after-install score:
  none found (item 9) [summary].
  The letter's falsifier, due at the 03:45 wake on L: unscored (item 6; `handoff…-L.md:72-73`) [summary]. "A season" has
  no length anywhere (§0) [summary]. The weekly census and open-items runs were never scheduled (item 4) [summary].
- **Cost.** Not recorded [summary]. H3's revert rule has never been able to fire (item 2) [summary].
- **Smallest fix** [ours]: a due date or event on each registration and one command listing those past due with no score
  file; then score H3 or retire it in writing.
- **Proving check, red today.** That command, run now, lists at least H3, ASK-001 and the letter [inferred].
- **Rebuild or install.** None [inferred].
- **His call.** "The revert is executed by the keeper" (`loop/h3_runbook_2026-10-17.md:20`) [read]. Retiring the NEITHER
  list waits on his having seen it, and `blind.js` on it is a live dependency of `board-digest.js` (item 5) [summary].
- **Outside.** None in the swarm.
- **In the L handoff:** the letter yes (`:72-73`) [read]; the rest no [read].

### 15. Carriers that still say open after the thing changed

- **Evidence.** `exo_memory/ASK.md:75` heads all thirteen answered asks "## OPEN" [read].
  [2nd reader: 11 ANSWERED and 2 DECLINED by their Status lines
  (`ASK.md:76-217`); all thirteen closed, so the heading is still wrong.] The room brief keeps D644
  open though D's lap ledger filed it 2026-11-07T15:11Z (in_promises.md item 11) [summary]. The handoff says it is not
  known whether the continuity test ran (`handoff…-L.md:46-48`) [read]; it ran on 11-03 (in_wake.md §4) [summary].
- **Cost.** One check per reader each time [summary]; two such items reached the swarm's own "dropped" list before a
  second reader struck them (in_promises.md, second reader) [summary].
- **Smallest fix.** Correct each carrier in place (the "just do it" tier, `~/.claude/CLAUDE.md:8`) [ours].
- **Proving check, red today.** `grep -n '^## OPEN' exo_memory/ASK.md` returns `:75` [read].
- **Rebuild or install.** None [inferred].
- **His call.** None found.
- **Outside.** None.
- **In the L handoff:** no [read].

### 16. What the compaction channels carry

- **Evidence.** The state block is served only on `compact` (default at `sessionstart-state.js:67`); 0 turns acted on
  163 blocks, ruled NOISE, itself marked inferred (in_wake.md §2, second reader) [summary]. The preserve directive prints
  the pre-directive 3.5 % as current and says "any of the five above" over six items (`precompact-preserve.js:111-113`,
  `:131`) [summary]. Whether PreCompact stdout reaches an auto-compacted seat is untested; 0 PreCompact `hook_success`
  rows in the librarian transcript (fault 7, second reader) [summary].
- **Cost.** Not recorded. A later push miss is "plausibly tied to a loss" (`p-d627-p4-compaction-A…:14-15`, via in_wake
  fault 5) [summary].
- **Smallest fix** [ours]: correct the directive's two stale lines; then serve the state block on `startup` or drop it.
- **Proving check, red today.** `grep -c 'any of the five above' consonance/hooks/precompact-preserve.js` returns 1
  [read].
- **Rebuild or install.** `install.ps1 -Only` for the hook copies [inferred].
- **His call.** None found.
- **Outside.** Supports writing the directive from failures: ACON rewrites its guideline from pairs that pass with full
  history and fail after compression (out_memory_at_wake.md §3) [summary]. Supports the state-block path: Claude Code
  re-runs SessionStart hooks matching `compact` (§1) [summary].
- **In the L handoff:** no [read].

### 17. No check of behaviour when a brief, BOOT or card changes

- **Evidence.** The room's guards check words, not behaviour (out_prompt_regression.md §0) [summary]. His 07:06 question,
  "how would either of us know what we are tweaking changes what about what?" (`handoff…-L.md:10-12`) [read]. The K
  battery: no arm separated at 0.05; K0 v K2 p = 0.195 (§0, second reader) [summary].
- **Cost.** Not recorded [summary].
- **Smallest fix** [ours]: freeze the K battery's items as the first regression set; run the same version twice for a
  noise floor; then before and after on the same probes, paired, with a flip list (§8).
- **Proving check, red today.** A command that runs the frozen set against two intake versions and prints the paired
  difference does not exist [inferred].
- **Rebuild or install.** None for the battery [inferred].
- **His call.** Any change to the intake; the lean-seats file is the place for it (plan `:29-30`) [read].
- **Outside.** Supports: regression sets drawn from real failures, 20 to 50 to start; paired differences cut variance;
  flip lists show what an aggregate hides; CheckList's invariance probes (out_prompt_regression.md §1-§4) [summary].
  Contradiction to state: about 1,000 questions for a 3-point effect (Miller) against 20 to 50 early (§7) [summary].
- **In the L handoff:** the question yes (`:10-12`); the instrument no [read].

### 18. How deep a collation checks is not measured

- **Evidence.** Six adversarial groups returned 45/45 over a set about 18 % wrong (`journal/2026-08-11.md:90-94`, via
  out_multi_agent_cost.md §5, second reader) [summary].
- **Cost.** Not recorded [summary].
- **Smallest fix** [ours]: count, over N past collations, how many reopened a cited file against those that checked form.
- **Proving check, red today.** No such count exists [inferred].
- **Rebuild or install.** None [inferred].
- **His call.** None found.
- **Outside.** Supports a check of the objective: MAST finds many verifiers check only form, and an objective check gave
  +15.6 %; central validation held error spread to 4.4x against 17.2x (out_multi_agent_cost.md §2) [summary]. Limit: the
  error-correlation papers measure different models, not one substrate (§5, second reader) [summary].
- **In the L handoff:** no [read].

### 19. The drain's DELIVERED row has no render check

- **Evidence.** Door deliveries check render and submit since D415; the drain row reports NOT SUBMITTED but no render
  (`main.rs:12486-12494`, in_delivery.md §3.5) [summary]. About 1 in 18 chair dispatches was UNCONFIRMED, 167 of 2,981
  (§4) [summary].
- **Cost.** The class cost 38 min on 10-19, at the door (`plan_d415…:9-10`) [read]; the drain variant: not recorded
  [summary].
- **Smallest fix** [ours]: the drain row runs the same `delivery_receipt` as the door.
- **Proving check, red today.** A drain test whose pane never renders the text must write UNCONFIRMED [inferred].
- **Rebuild or install.** Rebuild (§0).
- **His call.** None found.
- **Outside.** RabbitMQ: an ack on send alone "should be considered unsafe" (out_reliable_delivery.md §1) [summary].
- **In the L handoff:** no [read].

---

## Against the plan's registered falsifier

- Sections whose fault is not in `handoff_lighthouse_2026-11-13-L.md`, in whole or in the part named: 1 (StopFailure,
  the 09-16 case), 2 (the hold parking the room), 3, 5 (gate message, timeout, exit traps), 6, 7, 8 (every seat, the
  968k default), 9, 10 (D's token cost), 11, 12 (pre-pull shelf), 13, 14 (all but the letter), 15, 16, 17 (the
  instrument), 18, 19 [read: the handoff's lines 25-91].
- Counted by me, not by an instrument; the plan's own test is the librarian's to run [inferred]. [2nd reader: "the 09-16
  case" in section 1 is not a delivery-not-acted-on case (§1 Cost, note), so it is not a new fault of this class. This
  count was made by the file it tests (00_critic.md §1.8).]

## What I did not open

- The hand-backs and code each swarm file cites, except the lines marked [read] above.
- L's board, data folder and branches (901d3c39, `landing-ready.jsonl`), which are not on D.
- Any build log for this morning's release build; I found none and did not search the whole disk. [2nd reader: there was no
  release build to log; the 08:44-08:48 files are a `cargo check` (§0 note).]
- `install.ps1 -Check` itself; its output is from in_hooks.md and P's note.
- Outside pages other than model-config.md; every other outside claim is the outside readers' [summary].

## Second reader (D, 2026-11-13)

Second reader D, on D, 15:20-15:45Z, lighthouse HEAD 6bd55f8d. Read-only except this file; a pre-edit copy is in D's
scratchpad (`00_build_paths.pre2nd.md`). Every correction above is in place, struck with `~~` and marked "[2nd reader: …]".
"Line" below is the line in the file BEFORE my edits (my notes shift later lines). OK = the primary says it; WRONG = the
primary shows otherwise; UNSUPPORTED = a count I could not re-derive, or the primary does not say it; DOWNGRADED = true
but weaker (time-bound, one source, a different fault). "(red)" = a proposed check, re-run today, still red.

| Line | Claim (short) | Primary opened | Verdict | Evidence |
|---|---|---|---|---|
| 25 | Running exe pid 24164, started 08:42:24 | Get-Process | OK | same pid, start and path |
| 27 | Exe 11-08 23:56; last `.rs` commit 880f237f | ls; git log -- '*.rs' | OK | 23:56:09; 2026-11-04 01:10 |
| 30 | A release build ran and stopped | target/release; librarian/2026-11-13.md:387 | WRONG | 0 rlib, 0 exe; "cargo check --release, 47.6 s" |
| 34 | Pull touched only MAP.md under src/ | git diff --stat 0b85fead..8fd453c6 | OK | 1 file, 7 insertions |
| 36 | Restart drops the queue | chain-status.js:744 | OK | verbatim |
| 39 | No lock or hold at 15:08Z | C:/Consonance/data | DOWNGRADED | time-bound; two locks at 15:20Z and 15:28Z |
| 39 | P: build 82 s, test 14/14 in 601 s | librarian/2026-11-13.md:397 | OK | same figures |
| 41 | Pulse runs chain-status.js from the repo | userprompt-submit.js:263 | OK | path joined from repo |
| 43 | Brief order data, resource, repo | main.rs:4067-4094, :16378; cmp | OK | three tiers; 3 briefs byte-equal |
| 47 | "headless only" governs a restart | MEMORY.md:25 | WRONG | the line names T-180 |
| 48 | Cold resume wrote 6,587,136 in ~8 min | seat_tokens_24h.json | OK | cw sum 6,587,136; first calls 14:43-14:51Z |
| 51 | Delivery, gates, installs are "prove it" | ~/.claude/CLAUDE.md:10 | OK | listed there |
| 61 | 09-16: chair waited; re-send in at 13:15:46 | 2026-09-16.md:177; D board | OK | but delivered to LIB (line 71) |
| 63 | 11-13 quote; second burst hit A, C, B | stall_trace_403…:23, :39 | OK | verbatim |
| 66 | Drain writes DELIVERED, reads no reply | main.rs:12210-12236 | OK | no reply read in the drain |
| 67 | StopFailure replaces Stop; Stale delivers on idle | dl/hooks.md:2925; main.rs:11645-11647 | OK | doc text; bounded(screen_idle) |
| 69 | StopFailure 0 in install.ps1, consonance/, settings | grep | OK | 0, 0, 0 |
| 71 | 4 h 24 m is this fault's cost | :177; D board 19:15:46Z | DOWNGRADED | span true; door delivery to LIB, chair waited |
| 71 | 4-7 min first burst, 9 min second | stall_trace_403…:19-26, :39-41 | DOWNGRADED | 4-7 min is to the nudge sent; clearing inferred |
| 73 | Both stalls ended at a human | stall_trace_403…:40-41 | DOWNGRADED | 2nd burst: chair's nudge; B by a task notification |
| 76 | Step 1 covers the 09-16 case | D board; :177; stall_trace_403…:6 | WRONG | no DELIVERED row; covers neither case |
| 78 | Step 2 is install only | main.rs:11130-11139; in_delivery.md:215-217 | DOWNGRADED | holding needs the drain rebuild |
| 82 | Fixture: DELIVERED row to the chair | D board 2026-09-16 | WRONG | the case is a door row to LIB |
| 83 | NOT ACTED ON 0 in chain-status.js | grep | OK | 0 (red) |
| 84 | StopFailure 0 in install.ps1 | grep | OK | 0 (red) |
| 86 | Trace's test; NOT ACTED ON 0 in main.rs | stall_trace_403…:31; grep | OK | verbatim; 0 (red) |
| 92 | "already in each pane's context" | stall_trace_403…:26 | OK | verbatim |
| 96 | StopFailure output ignored | dl/hooks.md:1029, :2925 | OK | "Output and exit code are ignored" |
| 102 | Handoff has 2a, 2b, 2c | handoff…-L.md:57-60 | OK | present |
| 107 | :280, :295, :312 quotes | librarian/2026-11-13.md | OK | verbatim |
| 109 | Hold written first, then waits | heavy-run.js:77-86, :451-466 | OK | 'wx', then the foreignHold loop |
| 111 | Train crashed HEAVY_RUN_TIMEOUT 12:21Z | git show f415383b | OK | in the message |
| 112 | 99 min 40 s, 11:21:13Z-13:00:53Z | librarian :280; in_lock.md:39 | OK | arithmetic; end point via in_lock :77 |
| 114 | 41 min is not an ordering loss | :213; handoff…-L.md:63 | DOWNGRADED | the record points both ways |
| 119 | landing-ready 0 in chain-status.js | grep | OK | 0 (red) |
| 121 | queue or priorit 0 in heavy-run.js | grep | OK | 0 |
| 123 | No lock at 15:08Z | data dir | DOWNGRADED | time-bound |
| 124 | landing-*.jsonl live on L only | ls C:/Consonance/data | OK | 0 on D |
| 126 | Landings are a pane's job | MEMORY.md:27 | OK | index line |
| 135 | Handoff :62-63, owner and queue | handoff…-L.md | OK | verbatim |
| 140 | Addendum stall; 0 in briefs | stall_trace_2026-09-23.md:68-74; grep | OK | verbatim; 0 |
| 143 | 50 min | stall_trace_2026-09-23.md:68 | OK | |
| 158 | Owed fix; "never built" quote | stall_trace_lockbn…:20-24, :30 | OK | verbatim |
| 161 | 73 of 97 mutants unrun | p-l202-idle-holder-guard-B:5-17 | OK | mutants 20-92 |
| 161 | 901d3c39 absent on D | git cat-file; FETCH_HEAD | DOWNGRADED | present since the 15:28Z fetch, not in HEAD |
| 162 | idle 0 in heavy-run.js; MSYS 0 | grep | OK | 0, 0 |
| 163 | 46 min over two nights; idle 4-29 | librarian :318; lockbn :27 | OK | verbatim |
| 164 | 30-min timeout inside the 40 | in_lock.md:177; f415383b | OK | 11:51-12:21 in 11:50:47-12:30 |
| 180 | Gate hides cause; slice(-120) at :194 | lowmem :48; landing-train.js:194 | OK | verbatim; unchanged |
| 183 | Reap left mutated file, orphan waiter | lowmem :40-41 | OK | |
| 184 | COMMITTEE.md:93, no memory clause | brief | OK | |
| 186 | ~30 min at the gate | lowmem :45 | OK | |
| 187 | Reap cost A ~12 min | lowmem :7 | OK | "about 12 minutes into a3 block 1" |
| 189 | slice(0, 160) suggested | lowmem :48 | OK | in the trace itself |
| 191 | slice(-120) count 1 | grep | OK | 1 (red) |
| 193 | addendum, end condition, exit trap 0 | grep over brief/ | OK | 0 in all 10 files |
| 195 | Lockless memory check open | lowmem :37 | OK | |
| 203 | tail -F 20+ min; five ten-day-old | 09-23 trace :129-142; BUILDING.md:198-200 | OK | |
| 207 | 8-16 min per ring | BUILDING.md:152 | OK | |
| 211 | end condition or --pid 0 in briefs | grep | OK | 0 |
| 220 | Sender told "queued"; drain tells board only | main.rs:11991, :12226-12236 | OK | |
| 221 | Queued ring read as never rang, ~8 min | 09-23 trace :12 | OK | |
| 223 | Clause 4 prints a QUEUED wait | chain-status.js:723-747 | OK | |
| 240 | 4 of 7 compactions at ~968k; 2 more | seat_tokens_48h.json; in_cost.md:204 | OK | 7 in JSON, 4 at 967,632-969,695 |
| 242 | Docs: ~967K by default | model-config.md:852, :901 | OK | 15:06Z download |
| 243 | autoCompactWindow 0; autocompact 0 | grep settings.json, main.rs | OK | 0, 0 |
| 244 | 4,750 results, 6,888k chars | seat_tokens_48h.json | OK | sums 4,750 and 6,888 |
| 246 | 30.8 of 83.4 M; 423 M, 18.3 % | seat_tokens_48h.json | OK | 30.8 / 83.37; rereadM sum 423.2 |
| 249 | Four ways to set a window per seat | model-config.md:866-869; settings.json:149 | DOWNGRADED | two are user-wide |
| 258 | No compaction without his word | MEMORY.md:44 | OK | index line |
| 261 | Summaries kept shas 10.2 %, falsifiers 3.5 % | precompact-preserve.js:9-12 | OK | |
| 269 | Wake gaps 1,990-2,030 min | in_cost.md:28 | UNSUPPORTED | transcript pass not re-run |
| 270 | Chair and librarian moved to Fable | seat_tokens_24h.json models | OK | main 6/5, librarian 32/4 Opus/Fable |
| 271 | 4,608 of 4,617 Opus; settings "fable" | JSON; settings.json:5 | OK | |
| 273 | Cold-start index line | MEMORY.md:5 | OK | |
| 274 | 71.6 %, 7.84 of 10.95 M | seat_tokens_24h.json | OK | overlaps the switch cost |
| 275 | Switch 1.18 M or 2.49 M | in_cost.md:114-118 | UNSUPPORTED | the sum holds; parts not re-derived |
| 281 | Model per seat, plan :32-34 | plan :34; memory seat-substrates.md | WRONG | the plan line is the swarm's model |
| 282 | /compact costs most on resume; 1 h TTL | dl/ccpc.txt:215, :262 | OK | |
| 290 | -Check: 10 DRIFT, 3 ABSENT, 4, 1 | librarian :397 | UNSUPPORTED | -Check not re-run; two prior runs agree |
| 292 | Installed reader predates narrowing | grep; cmp; ls | OK | relayed 0/1; files differ; 10-01 copy |
| 293 | board-digest 0 in settings; 2c nowhere | grep; install.ps1:1069-1072 | OK | |
| 294 | ask-surface runs from the repo | settings.json:35 | OK | |
| 295 | Verdicts after 4,950 UNCLAIMED | in_hooks.md:15 | UNSUPPORTED | -Check not re-run |
| 297 | 234 reads, 2,431,909 tokens | second-reader.jsonl | OK | 237 / 2,479,021 at 15:27Z, growing |
| 298 | D631 clock not started on D | installed second-reader.js | OK | narrowed reader not installed |
| 305 | 09-07 bare run re-registered three | install.ps1:18-24 | OK | |
| 307 | "a hand decision that is his" | librarian :397 | OK | verbatim |
| 309 | Digest off on D per M.md:913 | map/M.md:913 | WRONG | L, 09-16, battery window |
| 320 | Inbox in memory; pop before write | main.rs:11716, :11860, :12227-12233 | OK | "logged" = a [WRITE FAILED] row, no requeue |
| 321 | 34 to 42 unpaired QUEUED | in_delivery.md:129 | UNSUPPORTED | not re-derived; rule-dependent |
| 326 | inbox grep returns 0 | grep | OK | 0, but it tests the later step |
| 335 | Intake 08:42:42; pull 08:43:40 | ls; git reflog | OK | |
| 336 | Intake still 08:42:42, no HEAD stamp | ls; grep | OK | |
| 337 | Cap 24,000 B; 11-11 is 128,841 B | shelf header; wc -c | OK | |
| 338 | His 11-12 words | plan_retrieval…:9-10 | OK | verbatim |
| 340 | Two further prompts on 11-12 | in_wake.md fault 3 | UNSUPPORTED | primary not opened |
| 345 | corpus_shelf is in main.rs | main.rs:8448 | OK | corpus_shelf_at |
| 348 | Under 200 lines; intakes 878, 761 | dl/ccmem.txt:185; wc -l | OK | see the note for counter-evidence |
| 354 | gates_mode light | ~/.consonance.json:23 | OK | |
| 355 | LIBRARIAN.md :113, :133 | brief | OK | |
| 355 | 1,018 warnings, 26 refusals | D board, node pass | OK | 1,018 / 26 |
| 357 | Trailer gate warn-only on D | follows from :354-355 | OK | |
| 369 | H3 closed, no score file | h3_runbook :11, :18; ls loop/ | OK | narrow: no h3* score file in loop/ |
| 379 | "The revert is executed by the keeper" | h3_runbook :20 | OK | |
| 386 | Thirteen answered asks under OPEN | ASK.md:75-217 | DOWNGRADED | 11 answered, 2 declined |
| 386 | D644 filed 11-07T15:11Z, brief open | lap.jsonl:14650; briefs/lighthouse_the_room.md:162 | OK | 15:11:20Z |
| 388 | Continuity test ran 11-03 | room_value_result_2026-11-03.md:62-70 | OK | |
| 400 | State block on compact; 163 NOISE | sessionstart-state.js:67; ledger | OK | 163 is the 11-03 count; 207 now |
| 402 | Directive: stale 3.5 %; five over six | precompact-preserve.js:111-113, :131 | OK | six items |
| 403 | 0 PreCompact hook_success rows | librarian transcript, grep -F | OK | no hook row names PreCompact |
| 408 | "any of the five above" count 1 | grep | OK | 1 (red) |
| 410 | install -Only for the hook copies | install.ps1:154, :289; cmp | OK | installed copies equal repo |
| 419 | His 07:06 question | handoff…-L.md:10-12 | OK | verbatim |
| 421 | K0 v K2 p = 0.195 | Fisher on 13/20 v 33/40 | OK | 0.195; 0.564; 0.422 |
| 436 | 45/45 over a set ~18 % wrong | journal/2026-08-11.md:90-94 | OK | |
| 451 | Drain row: NOT SUBMITTED, no render | main.rs:12484-12494 | OK | |
| 451 | 167 of 2,981 UNCONFIRMED | D board, node pass | OK | 167 of 3,024 now |
| 453 | 38 min on 10-19 | plan_d415…:9-10 | OK | |

**Tally.** Checked 119: OK 97, WRONG 6, UNSUPPORTED 6, DOWNGRADED 10. Every [summary] mark in sections 0-19 was followed
to its sibling line; the ones that rest on outside pages are listed under "What I did not open".

**Proving checks re-run today.** All the greps the file names are still red: NOT ACTED ON 0 (chain-status.js, main.rs),
StopFailure 0 (install.ps1), landing-ready 0, queue or priorit 0, slice(-120) 1, the brief greps 0, relayed 0 in the
installed second reader, inbox 0, `## OPEN` at ASK.md:75, "any of the five above" 1, no gates_mode in LIBRARIAN.md, no
HEAD stamp in the intake. Two would not fail on the case they claim: §1 step 1's fixture (neither 09-16 nor 11-13; notes
at its lines) and §11's grep (it tests persistence, not the DROPPED row). §1 step 2's green state (a failed stamp
written) would be green while the running exe still delivers into the errored pane (note at step 2).

**Build paths I would not build from as written.**
- §1, steps 1 and 2. Step 1 covers neither recorded case and is the duration form the room refused
  (chain-status.js:260). Step 2 alone gives a row, not a held queue. The no-rebuild routes already on disk are fix 2c
  (b0be06f0, with blind.js) and the API-error watcher; the 11-13 fix is 2a and 2b with the trace's own test. The
  4 h 24 m should not rank §1 first.
- §8 (a). `/autocompact` and `autoCompactWindow` change every seat on the machine; per seat needs the launch flag, which
  needs a rebuild, and each seat needs his word (MEMORY.md:44).
- §10's "His call" on board-digest rests on an L line about 09-16. Whether 2c and board-digest belong on D is open, and
  blind.js sits on a retire list (00_critic.md §2.3).
- §0 as a restart checklist: the "headless" rule is about T-180, and the lock state is stale (two held at 15:28Z).
- §2 (b), the hold that reserves: buildable, but no recorded minutes are separated for the parking, and the 41 min is
  contested. Register what would count against it before building.

**A builder can use as written:** §3, §5, §6, §7, §12, §13, §14, §15 (with the 11/2 note), §16, §17, §18, §19, §4 (the
branch is now on D; the rest stands), §9 apart from its "His call" citation, and §2 (a) and (c).

**What I did not open.**
- Outside pages, except the local downloads of model-config, hooks, memory and prompt-caching: RabbitMQ, Kafka, SQS,
  Mergify, GitHub, GitLab, Rust, bors-ng, Temporal, LangGraph, Kleppmann, AutoGen, Chroma, LongMemEval, the Complexity
  Trap, ACON, the multi-turn paper, MAST, CheckList, Miller. I checked only that the sibling file says what this one says.
- L's board, data folder and logs; so no fixture for the 11-13 bursts was built or read.
- `install.ps1 -Check` (not run); hand-backs p-record-owner-A, p-d627-p3-everyturn-O, p-d631-reader-narrowed-P,
  p-l198-403-stall-B; in_promises' primaries for ASK-001, the letter, "a season" and the census; in_wake fault 3's primary;
  out_memory_at_wake §5 f.
- The transcript passes behind the wake gaps, the per-call switch figures and the 34/42 pairing; not re-run.
