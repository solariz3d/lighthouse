# Critic: what the room-better swarm left unread, thin, contradicted or wrong (2026-11-13)

Critic, the last seat of the swarm, on D at 15:23Z, lighthouse HEAD 7b81451e. Read-only except this file.
Input: all fifteen files in this folder, read whole, and `loop/plan_room_better_swarm_2026-11-13.md`.
Marks: [read] I opened it or ran the probe today; [summary] taken from a swarm file, not reopened by me; [inferred]
mine; [ours] a proposal. Options and evidence, not decisions. No outside request was made.

## 0. My own probes (read-only, numbers only)

- Synthesis files with a "Second reader" section: 0 of 3 [read: grep -c]. The plan gives second readers to the twelve
  reader files only (`plan_room_better_swarm_2026-11-13.md:15`), while its reasons say "Every file gets a second
  reader" (`:26`) [read].
- Marks in the synthesis files [read: grep -o counts]: 00_build_paths read 126, summary 115, inferred 38, ours 20;
  00_lean_seats read 97, summary 1, inferred 44, ours 17; 00_not_worth_it read 29, summary 74, inferred 8, ours 7.
- Strike marks in the twelve reader files: 152 `~~`, so 76 struck spans; in_promises alone has 17 [read: grep -o].
  The files' own stated strike counts sum to about 58 [inferred].
- Files under `consonance/src-tauri/target/release` written 08:40-08:50 local today: 135. By type: 45 with no
  extension, 30 `.d`, 20 `.timestamp`, 20 `.rmeta`, 20 `.json`; 0 `.rlib`, 0 `.exe`. `consonance.exe` is still
  dated 2026-11-08 23:56 [read: find -newermt, ls].
- D's board, 2026-09-16 19:13-19:19Z (13:13-13:19 local): `call_librarian from C DELIVERED WITHOUT A NEXT TRAILER`
  and `call_librarian C -> LIB [Received]`, both 19:15:46Z. No `DELIVERED ->` drain row and no delivery to Main in
  that window [read: inline node pass over `C:/Consonance/data/board.jsonl`].
- Commits since 08:40 local: 19 [read: git log]. The swarm files were written 09:00-09:16 local [read: ls].
- Seat intakes: bytes match 00_lean_seats §1; lines 672 to 1,018; the nine seats in in_cost are the only instance
  folders with transcripts [read: wc, ls].
- The proposed "red today" checks, re-run: `NOT ACTED ON` 0 in chain-status.js and 0 in main.rs; `slice(-120)` 1 in
  landing-train.js; `StopFailure` 0 in install.ps1; `## OPEN` at ASK.md:75; "any of the five above" 1 in
  precompact-preserve.js; "relayed" 0 in D's installed second-reader.js, 1 in the repo's; `landing-ready` 0 in
  chain-status.js [read]. All still red.
- `MEMORY.md:44` in 00_lean_seats: 0 hits [read: grep -c].

## 1. Errors in the synthesis files, found in this pass

1. **00_build_paths §0 reads a check as a failed build.** It says a release build ran on D at 08:44-08:48, the exe was
   not replaced, and "Why it stopped is not on disk anywhere I looked" [summary: 00_build_paths.md:30-31]. The 135
   files carry no rlib and no exe (§0) [read]. That is the output `cargo check` leaves [inferred]. The librarian's
   note says "Checked: consonance source compiles (cargo check --release, 47.6 s, warnings only)" and "Which rebuild
   failed is not on disk that I could find: asked him" (`librarian/2026-11-13.md:387`) [read]. 00_build_paths cites
   `:387` for his words, not for this [read]. Cost not recorded; §0 could be read as the answer to "rebuild didnt
   succeed" (`:387`) [inferred].
2. **00_build_paths §1's proving check does not reproduce the case it names.** Step 1 says its clause "covers the
   09-16 case" and tests "a fixture board with a DELIVERED row to the chair" [summary: 00_build_paths.md:75-83]. On
   D's board that delivery went to the librarian through the door, not by the drain, and not to Main (§0) [read]. The
   seat that waited was the chair (`librarian/2026-09-16.md:177`) [read]. A clause keyed on a drain row to Main would
   not fire on it [inferred]. The 4 h 24 m runs from the chair's 13:16:05 line to his next prompt at 17:40 (`:177`)
   [read]; whether anyone was waiting in that span is not in the line [read]. It is the only figure over one hour in
   Part 1, and it ranks section 1 first [summary: 00_build_paths.md:71]. The cause in in_stalls S11 is a missing NEXT
   trailer and "a seat waits on an event that already happened" [summary: in_stalls.md:105, :246], not an unread
   delivery. Cost not recorded.
3. **00_build_paths §0 stretches a T-180 rule to a Consonance restart.** The index line reads "he races while T-180
   runs; headless only, no GUI launch unless asked" (`MEMORY.md:25`) [read]. It names T-180, not Consonance [read].
   Cost not recorded.
4. **00_build_paths §10 rests D's missing digest hook on an L line.** `map/M.md:913` is headed "04:12 L, 09-16" and
   names "the digest hook off for a dated window by the keeper's hands" during a battery run [read]. It says nothing
   about D today [read]. D's `settings.json` has 0 `board-digest` hits [read]. Why it is absent on D is not shown
   [inferred]. Cost not recorded.
5. **00_lean_seats marks sibling-file figures as [read].** It cites in_cost lines as [read] (97 [read], 1 [summary]);
   the other two apply files mark the same kind of figure [summary] (§0) [read]. So its marks overstate how much it
   reopened [inferred]. Its own probes (post_compact.js, kw_count.js, the intake split) had no second reader [read].
   Cost not recorded.
6. **00_lean_seats W1 and W2 leave out a standing rule.** Both change when seats compact [summary:
   00_lean_seats.md:85-122]. The index line reads "no seat compacted or its context cut, for a test or usage, without
   his explicit word for that seat" (`MEMORY.md:44`) [read]. 00_build_paths §8 and 00_not_worth_it §8 name it
   [summary]; 00_lean_seats does not (§0) [read]. Cost not recorded.
7. **00_lean_seats W6 leaves the swarm's model as an "if".** The note says the swarm launched on "Opus, 28 agents as
   written" (`librarian/2026-11-13.md:387`) [read]. So the 4.4M-unit figure stands as computed [inferred]. It counts
   calls up to 14:52Z only [summary: in_cost.md:60-62]; the swarm's whole cost is not recorded [inferred].
8. **The plan's falsifier was scored by the file it tests.** 00_build_paths counts its own sections against the L
   handoff: "Counted by me, not by an instrument" [summary: 00_build_paths.md:466-470]. Cost not recorded.

## 2. Where two swarm files disagree

1. **The 41 minutes.** out_merge_queue's second reader counts it as recorded waiting cost against priority classes
   [summary: out_merge_queue.md:153-156]. in_lock's second reader, 00_build_paths §2 and 00_not_worth_it §1.1 read it
   as A's mutants behind the train, the order a landing-first class already gives [summary: in_lock.md:156-159;
   00_build_paths.md:113-115; 00_not_worth_it.md:35-36]. The record points both ways: "A waited 41 minutes behind the
   train for a chain of 16 mutants" (`librarian/2026-11-13.md:213`) and "short runs parked behind 16 mutants"
   (`loop/handoff_lighthouse_2026-11-13-L.md:63`) [read]. Which seat waited on which is not settled by either line
   [inferred]. What rides on it: whether ordering has any recorded cost above 4 minutes
   [summary: 00_not_worth_it §1.1].
2. **A timer on a silent receiver.** 00_build_paths §1 step 1 proposes "<seat> has not moved since", tested at 15 min
   [summary: 00_build_paths.md:75-83]. 00_not_worth_it §1.5 says the room refused the timer form on evidence [summary:
   00_not_worth_it.md:55-60]; the code comment records "SIX MINUTES OF ALARM OVER A CORRECT STATE"
   (`consonance/tools/chain-status.js:252-273`) [read]. Step 1 starts from a delivery, the refused one from idleness
   alone [inferred]. Whether a receiver busy in a long turn would trip it is untested [inferred].
3. **Installing 2c.** 00_not_worth_it lists it as standing and first [summary: 00_not_worth_it.md:141, :209-210].
   00_build_paths §10 makes the digest hook on D his call [summary: 00_build_paths.md:307-309]. 2c also needs
   `sealedGate` from blind.js (`handoff_lighthouse_2026-11-13-L.md:59-60`) [read], and blind.js sits on the 11-03
   retire list [summary: in_promises.md item 5].
4. **Compaction changes.** 00_lean_seats W1/W2 are listed as working-context changes with no gate [summary];
   00_build_paths §8 and 00_not_worth_it §8 put each seat behind his word [summary].
5. **The 403 class, in what order.** 00_build_paths: chain-status clause, then StopFailure, then rebuild [summary:
   :74-80]. 00_not_worth_it: install 2c, add StopFailure with one forced-error test, count the next burst before 2a,
   2b or the retry [summary: :141].
6. **Is the idle-holder guard proven?** in_lock: "101 of 101, mutants 5 of 5, not merged" [summary: in_lock.md:110].
   in_stalls and 00_build_paths: 73 of 97 mutants unrun [summary: in_stalls.md:189-193; 00_build_paths.md:161]. Both
   come from one hand-back; the 5 are the new mutants, the 73 the rest [summary: in_stalls.md:193].
7. **The window with no landing.** 97 min [summary: in_stalls.md:233-237; 00_not_worth_it.md:47]; 99 min 40 s
   [summary: in_lock.md:39; 00_build_paths.md:112]; "100 minutes" (`handoff_lighthouse_2026-11-13-L.md:62`) [read].
   Different end points: 12:58Z, 13:00:53Z, a round figure [inferred].
8. **Hook drift on D.** in_hooks: 10 DRIFT by `install.ps1 -Check` [summary]. in_promises' second reader: 7, by a
   diff of `~/.claude/shell/hooks` only, and "D held at 7" [summary: in_promises.md:79-83]. The extra three are
   board-digest.js, installed outside `shell\hooks`, and two files under `dev/shell/hooks` [read: git ls-files;
   in_hooks table]. So the counts differ by scope [inferred]. Whether D619's 7 is the same set is not shown [summary].
9. **The stale second reader's cost.** 229 reads, 2,385,722 tokens [summary: in_hooks.md:51; 00_lean_seats.md:156]
   against 234 and 2,431,909 [summary: 00_build_paths.md:297]. The ledger grew during the run [summary: in_hooks.md:57].
10. **Queued rows a restart would drop.** 42 [summary: in_delivery.md:129] against 34 by another pairing; the file's
    sums do not add up [summary: in_delivery.md:293-296]. 00_not_worth_it §1.6 says the option "rests on 42".
11. **Drain wait median.** 208 s against 230 s; p90 and max agree [summary: in_delivery.md:137-141].
12. **Detectable difference for a brief change.** About 20 points paired, used by out_prompt_regression §4,
    00_lean_seats T4 and 00_not_worth_it §1.9 [summary]. At Miller's stated one-third variance cut it is about 23
    [summary: out_prompt_regression.md:99-101]. Both assume a correlation of 0.5 that the room has not measured
    [inferred].
13. **The 200-line CLAUDE.md guidance.** 00_build_paths §12 lists it under "Supports" [summary: :348-349].
    00_not_worth_it §3 says evidence runs both ways: recall measured at 32.5/33.5 of 34, adherence unmeasured
    [summary: :115-117].
14. **The state block.** in_wake §6 and 00_build_paths §16: serve it at startup or drop it [summary]. 00_not_worth_it
    §5: the evidence leans to drop, not extend [summary]. The 0-of-163 verdict under all three is itself marked
    inferred at its source [summary: in_wake.md:198-199].
15. **Keep-warm.** 00_lean_seats W7: leave it [summary]. in_promises item 13 asks for its cost per idle seat and his
    word [summary]; 00_lean_seats gives a board-wide count only, as it says [summary: 00_lean_seats.md:179-180].

## 3. Where the record disagrees with itself (surfaced by the swarm, left standing)

- The 11-13 morning clock on L: A's 06:55 and 06:58, the trace's 06:33 grep start and 06:58-07:10, merge stamps at
  06:45:40-41 local, and the grep "already gone at 12:48Z" [summary: in_lock.md:53-64]. The 30-minute gate figure
  and the "about 50 minutes" with no train run both sit inside this knot [inferred].
- ferry-watch.js: 77.1% against 97.2% never ferried, for the same 109 commits [summary: in_hooks.md:116, :191].
- The relevance retriever: "registered, unbuilt" against CLOSED 2026-08-31 [summary: in_wake.md:114-116].
- The K battery: "p ≥ 0.20 on all four" against K0 v K2 p = 0.195 one line later
  [summary: out_prompt_regression.md:10-13].
- Judging: the keeper "as oracle on a sample" (QUANTIZE `:23`) against the rule that routes judging away from him
  (`MEMORY.md:14`) [summary: out_prompt_regression.md:20-21].
- The 09-16 "82-minute stall" (`:175`) against S10's 81 minutes the same day: one event or two is not shown
  [summary: in_stalls.md:93-95].
- Carriers that still say open: `ASK.md:75` heads thirteen answered asks "## OPEN" [read]; the room brief keeps D644
  open while D's lap ledger filed it; SPINE §3 says the directive is "BUILT, running" after D089 ruled its falsifier
  class DECORATIVE; the L handoff does not know the continuity test ran on 11-03 [summary: in_promises §4;
  in_wake fault 5].
- The 09-01 note quotes F-growth "verbatim" from the wrong source, with one elision [summary: in_wake.md:124-127].

## 4. Claims a build would rest on that have one source

- **The 403 bursts on 11-13.** One trace, written on L; D's board has no rows 09:45Z-10:26Z [summary:
  in_delivery.md:181-184]. Minutes per pane are inferred from its timestamps
  [summary: out_reliable_delivery.md:166-167].
- **The 4 h 24 m on 09-16.** One note line [read: `librarian/2026-09-16.md:177`]; see §1.2.
- **Every lock and train minute on 11-13** (154 seat-minutes, the 40-minute idle holder, the 30-minute gate, the 50
  minutes with no train). Hand-backs and notes only; "There is no separate log file" (`heavy-run.js:34`); L's
  `landing-train.jsonl` and `landing-ready.jsonl` were not read [summary: in_lock.md:9-21].
- **The token shares** (wake writes 71.6%, context above 250k up to 37%, carried tool output 18.3%). One script,
  `seat_tokens.js` [summary: in_cost.md:9-10]. The second reader matched the tables to its JSON and re-counted
  compactions and gaps; it did not re-derive the totals another way [summary: in_cost.md:161-191]. 18.3% is an
  estimate at 3.7 characters per token [summary: in_cost.md:129-130].
- **00_lean_seats' own numbers**: the ~100k post-compaction floor, idle-compaction pairing, 1,664.6M keep-warm reads,
  and W1's "net about 4.7M units" built on them. One pass each, no second reader
  [summary: 00_lean_seats.md:58-77, :93-97].
- **The continuity test**, 32.5/33.5 of 34: one run of eight, one grader, same model [summary: in_wake.md:83-92].
- **D089's kept rates**: one re-measure over 7 events; on 11 events SHA moves to NEITHER [summary: in_wake.md:44-47].
- **The 37-item hand count** (14 / 8 / 15): one window [summary: in_wake.md:50-51].
- **The state block's NOISE verdict**: one hand-back, itself marked inferred [summary: in_wake.md:198-199].
- **StopFailure "runs instead of Stop"**: one vendor page, read by two readers; never tested on a Cloudflare 403
  [summary: out_reliable_delivery.md:229-231].
- **The 967K default**: one vendor page, read by three readers [summary: out_memory_at_wake.md:80-82].
- **45/45 confirmed over a set about 18% wrong**: one journal entry, cited by three files [summary:
  out_multi_agent_cost.md:162-170].

## 5. Still unread or unverified

- **Machine L**: its board, `landing-train.jsonl`, `landing-ready.jsonl`, `mem.jsonl`, transcripts, the 11-12 and
  11-13 wakes, and branches 901d3c39 and bd9cd25 (neither object is on D) [summary: in_lock, in_stalls, in_wake].
- **The running binary**: not compared with the source by any reader [summary: in_delivery.md:231;
  out_reliable_delivery.md:242].
- **Code read by header or comment only**: hook bodies (sources-gate, dispatch-gate, reply-slot, ready-stop, the
  pulse); `heavy-run.js:141-419` and `:471-595`, so the 2 s poll is from comments; `inject_to_pane` (S1)
  [summary: in_delivery.md:234-238; in_lock.md:187; in_stalls.md:341].
- **The record beyond the grep**: most of 1,098 loop files; the 182, 147 and 353 "idle", "waiting" and "held" lines,
  so stalls named only in those words may be missing [summary: in_stalls.md:285-286].
- **The keeper's primary notes** behind the hook rulings: read only as quoted in install.ps1 or hook headers
  [summary: in_hooks.md:136-137, :202-203].
- **Untested mechanisms**: PreCompact stdout on an auto compaction; tool-result clearing for the main conversation;
  whether `--model` outranks the restored model on `--resume`; which StopFailure matcher a 403 page hits; whether
  keep-warm and idle compaction race [summary: in_wake fault 7; out_memory_at_wake.md:266-267; 00_lean_seats §6].
- **Counts nobody took**: the room's landing pass rate and red full suites [summary: out_merge_queue.md:159-160;
  00_not_worth_it §1.8]; keep-warm per seat; pane letter per seat id [summary: in_cost.md:16-17].
- **Outside gaps, stated by the readers**: no source measures a queue on one machine with a handful of workers; no
  study of a persona rebuilt from a record at each wake; none of persistent seats against fresh subagents [summary:
  out_merge_queue.md:172-173; out_prompt_regression.md:210-211; out_multi_agent_cost.md:188-190].
- **Two hops**: 115 [summary] lines in 00_build_paths and 74 in 00_not_worth_it rest on a sibling's reading, not on
  the primary (§0) [read].

## 6. What the swarm could not do, or got wrong before this pass

- **It ran on D; the day it studies happened on L.** D's board has nothing from 2026-11-12T05:33Z to
  2026-11-13T14:42Z [summary: in_delivery.md:181-182]. Every 11-13 figure on the lock, the train and the 403 is prose.
- **It does not answer "rebuild didnt succeed"** (`librarian/2026-11-13.md:387`) [read]. The note says the librarian
  asked him (`:387`) [read]. A second candidate, the T-180 Rebuilder, hardcodes a folder absent on D [summary:
  in_stalls.md:278-281]. Cost not recorded.
- **Its scope left out two things in the same request.** No file catches up dreamzone-3; it appears only as build load
  [inferred]. The usage protocol appears only as plan `:34`, quoted in 00_build_paths [read: grep over this folder, 1
  file].
- **One interaction with that protocol, not studied** [inferred]. The vendor page says Claude Code asks for the 1-hour
  cache TTL "on a subscription within plan usage" and drops to 5 minutes on usage credits past the plan limit
  [summary: out_memory_at_wake.md:116-118]. Keep-warm pings at 50 min plus 0-6 [summary: 00_lean_seats.md:70-71]. If
  spend crosses the plan limit before the reset, each ping would find a cold cache and rewrite the context [inferred].
  W1 and W7 assume the 1-hour TTL [inferred]. Whether the limit is crossed today is not on disk [inferred].
- **The record moved under it.** 19 commits since 08:40 local (§0) [read]. The newest note records a hold ring that
  went to the chair at about 14:51Z and reached E at 15:12Z, "after E had already committed the step the hold said
  waits" (`librarian/2026-11-13.md:407`) [read]. That is a delivery fault on D, today, with its cost recorded, and no
  swarm file holds it [read: the files predate it]. It fits in_delivery mechanism 8 [inferred].
- **Counts moved between reader and second reader** (board lines 11 and 12, 229 and 234, 3,176 and 3,177), and probe
  times were not always written [summary: in_lock.md:16-19, :231; in_hooks.md:57, :207-208].
- **grep under-counts the large transcripts**: 3 of 7 compaction lines against node's 7 [summary: in_cost.md:143-144].
- **Its instruments are temporary.** seat_tokens.js, post_compact.js and kw_count.js sit in a session scratchpad, not
  in the repo [read: ls]. A later seat cannot rerun them from the record [inferred].
- **What the second readers struck**: 76 spans in twelve files (§0) [read]; the first swarm's readers marked 82 lines
  wrong (`plan_room_better_swarm_2026-11-13.md:26`) [read]. The kinds [summary, from each file's struck list]: line
  cites off by one or a wrong range; counts that took in user and assistant text quoting a phrase (keep-warm MISSED 82
  to 54, address refusals 13 to 1); a direction reversed (the 41 minutes, board-digest's blind pairs, "became a
  dependency"); two machines merged (7 and 15 drift); outside claims widened (BLRD's year, deep against wide,
  different models read as one model, a deprecated SDK list read as general). Cost of each: not recorded.
- **The three files a builder will read first had no second reader** (§0) [read]; §1 above is one pass, not that.
- **Its own cost**: 578 subagent calls by 14:52Z, about 4.4M units on Opus [summary: in_cost.md:60-62;
  00_lean_seats.md:164-166]; everything after is not recorded.

## 7. Five checks before building anything from these files

1. **Name the failed rebuild before using 00_build_paths §0.** Run
   `find consonance/src-tauri/target/release -newermt "2026-11-13 08:40" ! -newermt "2026-11-13 08:50" -name "*.exe" | wc -l`
   (0 today) and get the answer to the librarian's question at `librarian/2026-11-13.md:387`. Pass: the failed build
   is named, with its error or log [ours].
2. **Before any Consonance restart or install, count what it would drop.** On D's board, QUEUED rows since the app's
   last start with no later DELIVERED or WITHDRAWN row for the same receiver (in_delivery's second-reader pairing);
   and no `heavy-run.lock` or `.hold` in `C:/Consonance/data`. Pass: 0 rows, or each written down first [ours].
3. **Second-read the step you will build.** For each 00_ section a build rests on, open every [summary] line at its
   primary `path:line` and mark it held or struck. Pass: none struck, or the step rewritten [ours].
4. **Make each proving check fail on the recorded case first.** §1 step 1 on the 09-16 rows (a door delivery to LIB
   at 19:15:46Z, not a drain row to Main); StopFailure with one forced API error, noting the matcher that fires; the
   train clause on a copy of L's `landing-ready.jsonl`. Pass: red on the fixture today, green after the change [ours].
5. **Get L's record, and his word where the record asks for it.** Fetch 901d3c39 and run its 73 unrun mutants before
   the guard merges; read L's board 09:45Z-10:26Z and `landing-train.jsonl` before ranking by those minutes; get his
   dated word item by item for compaction per seat (`MEMORY.md:44`), the digest hook and 2c on D, stop.js on D, and
   the gates mode the briefs describe. Pass: each figure re-derived from a log; each gated item with his word beside
   it [ours].
