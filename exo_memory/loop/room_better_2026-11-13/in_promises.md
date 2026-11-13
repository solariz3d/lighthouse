# Inside the record: promises the room made to itself and has not kept (swarm reader, 2026-11-13)

Read-only. Marks: [read] opened and seen; [summary] secondary; [inferred] my inference; [ours] a proposal.
Repo root C:/Users/nname/Desktop/lighthouse; paths below are relative to it. "Due" uses the record's own clock where it
has one. "A season" is never given a length anywhere I searched (0 hits for a day count beside it) [read: grep over
exo_memory]; where I date a season I use about 90 days and mark it [inferred].

## 0. The size of the search, in numbers

Word-bounded, case-insensitive, `*.md` under exo_memory (attic included in these counts) [read]:

| term | files | lines |
|---|---|---|
| owed | 478 | 1,171 |
| falsifier | 818 | 2,786 |
| registered | 1,226 | 4,348 |
| not yet | 384 | 710 |
| never built | 53 | 61 |
| parked | 214 | 423 |
| to fix | 162 | 222 |
| TODO (case-sensitive) | 65 | 95 |

- Unbounded "owed" matched 1,308 files because it hits "followed", "allowed", "showed" [read: 1,308 vs 478 word-bounded].
- TODO is mostly test-runner text ("non-TODO not-ok"), ~~55 of 65 files under handback/~~ [read]. It is not a promise channel.
  second reader: 59 of 65 are under handback/ (55 at its top level, 4 in evidence subfolders) [read: grep -rlw TODO,
  2026-11-13 08:56]. The conclusion stands.
- "never built" (61 lines) is the densest promise channel. I read every line of it. The other terms I read only in the
  November notes, the November handoffs, the room brief, BOOT, ASK and the two result files.

## 1. Open promises whose condition has come due

| # | promise | registered | path | due? | status found |
|---|---|---|---|---|---|
| 1 | The idle-holder guard in heavy-run.js: a lock held by a child with 0 CPU for N minutes is named on the board, with its proving check | 2026-11-12 | loop/stall_trace_lockbn_cmd_c_mangled_2026-11-12.md:20-24 | yes, the fault recurred 11-13 | not on main here |
| 2 | The H3 score: is the lighter rule layer at least as accurate; revert if (b) is worse than 4.9% beyond its interval | 2026-10-11 | loop/h3_runbook_2026-10-17.md:6-11 | yes, window closed 2026-10-18T00:34:07Z | no score found; quietly dropped |
| 3 | Bring installed hooks up to the room's source (audit rec D) | 2026-11-02 | loop/room_audit_result_2026-11-02.md:36 | yes | ~~grew from 7 stale to~~ 15 DRIFT + 8 ABSENT on L; second reader: 7 is D's count, still 7 on D today [read] |
| 4 | Run text-census and open-items weekly (value rec 2) | 2026-11-03 | loop/room_value_result_2026-11-03.md:51 | yes | ran once (D629); no weekly run exists |
| 5 | Retire the NEITHER list to attic after he has seen it (value rec 7; audit rec B) | 2026-11-02/03 | loop/room_value_result_2026-11-03.md:58; room_audit_result:34 | condition unclear | ~~all 8 tools~~ second reader: the list's 6 named tools, plus rec A's 2, all still in place; no later mention |
| 6 | The letter's falsifier: first reply to an open question after each of the next two wakes | 2026-11-12 | librarian/TO_THE_NEXT_ONE_go_to_the_source.md:64-66 | first wake came 11-13 03:45 (L) | not scored |
| 7 | BOOT's curated-auditor falsifier: a season with documents growing and no unwanted number | 2026-08-02 | exo_memory/BOOT.md:66 | about 2026-11-02 [inferred] | never formally scored |
| 8 | BOOT's chair-figures falsifier: a season where figures are re-derived and none found wrong means strike it | 2026-08-02 | exo_memory/BOOT.md:152 | about 2026-11-02 [inferred] | never formally scored |
| 9 | ASK-001 abstain change: score P1-P3 after install; then re-measure L3 and decide its retirement | 2026-09-20 | exo_memory/ASK.md:80 | install happened [read below] | no score file found |
| 10 | ASK-007 cold read: stages 1-2 then 3; "the registration's month ends 2026-09-29" | 2026-09-24 | exo_memory/ASK.md:149 | yes, 2026-09-29 | stage 1 and 2 scores exist; ~~no stage 3 file~~ second reader: stage 3 declined 09-26 by ruling (below) |
| 11 | The chair's D644 ledger row, so the pulse stops printing "HANDBACKS IN, NOT COLLATED" hourly | 2026-11-06 | exo_memory/briefs/lighthouse_the_room.md:147-151 | yes | ~~open in the brief; last mention 11-07~~ second reader: a D644 "filed" row is in D's lap ledger, 11-07 15:11Z |
| 12 | "Integrate the wager" as a question any seat runs ("played to win, or to keep the play going?") | 2026-11-07 | exo_memory/briefs/lighthouse_the_room.md:172-175 | no date set | no card, BOOT or seat brief carries it |
| 13 | Measure the keep-warm visits' cost per idle seat and ask his word | 2026-11-05 | exo_memory/briefs/lighthouse_the_room.md:140-141 | no date set | the 11-13 measure covers the librarian only |

Evidence, one item at a time:

1. Idle-holder guard.
   - [read] stall_trace_lockbn:20-24 lists the "Fix, for good (owed)": `MSYS_NO_PATHCONV=1` or `cmd //c`, a one-second
     proving check, and the heavy-run.js guard.
   - [read] :26-30: on 2026-11-13 E's holder sat idle 40 minutes; "the 'fix, for good' above was never built, and the
     stall came back at seven times the length."
   - [read] loop/handoff_lighthouse_2026-11-13-L.md:55-56: "B's branch has it committed (lighthouse 901d3c39 at 07:08)".
   - [read] in this clone `git branch -a --contains 901d3c39` returns "malformed object name": the commit is not here.
     The last commits to consonance/tools/heavy-run.js on HEAD are 2026-11-11 (54e681cb, 7335c9ae), neither the guard.
   - Cost [read]: 6 minutes the first time ~~(stall_trace:3-8)~~, 40 minutes the second ~~(:27)~~, with every pane idle 4 to 29
     minutes and A's three jobs queued ~~(:26)~~.
     second reader: figures right, lines off by one. "6 minutes" is :1 (07:08:31Z at :6 to 07:14:46Z at :18); "40 minutes"
     is :26 and :28; the idle panes and A's queue are :27 [read]. Handoff :55-56 checked and right.

2. H3 score.
   - [read] h3_runbook:6-7: H3 and its revert rule. :11: window end 2026-10-18T00:34:07Z. ~~:21~~: "Score: the librarian".
     second reader: that line is :18 [read]. :20 adds "The revert is executed by the keeper".
   - [read] map/M.md:994: "the next numbers need live time: the H3 score after 2026-10-18T00:34:07Z (runbook ..., mine
     to trigger)".
   - [read] loop/claimrec/draw.js has 2 lines matching "h3", so the window prerequisite was added.
   - [read] no `h3` score file in loop/ (only the runbook); `grep -w H3` over librarian/2026-10-17 .. 2026-11-13 returns 0.
   - [inferred] The change it scores is still live: this run's shelf header reads "gates_mode light".
   - Cost: not recorded. What is at stake is a revert rule that has never been allowed to fire.

3. Installed hooks vs the repo.
   - [read] room_audit_result:18: "7 installed hooks are older than their room source". :36: rec D, "Recommend yes,
     after A and B".
   - [read] loop/plan_room_fixes_2_5_2026-11-03.md:41: "The seven hooks D619 found older than their source are NOT
     reinstalled in this pass, since that was recommendation D, not asked."
   - [read] handoff_lighthouse_2026-11-13-L.md:~~65-66~~: "The hooks on L are not the repo's: 15 DRIFT, 8 ABSENT".
     second reader: :64-65 [read]. And the 7 and the 15 are two machines. D619's 7 (p-d619-hooks-tools-C:128) were read on D;
     on D today a CR-stripped diff of ~/.claude/shell/hooks against consonance/hooks/*.js (tests left out) gives 7 DRIFT
     (ask-ending, delete-gate, push-gate, release-chime, second-reader, second-reader-worker, sources-gate), 1 same, and
     17 repo hooks with no installed copy [read; my diff, not install.ps1 -Check, so ABSENT is not comparable to L's 8].
     Nothing shows the count grew; D held at 7, L was never counted on 11-02 in what I opened.
   - [read] map/M.md:1031: precompact-preserve.js, sessionstart-state.js, session-start.js and precompact.js are all DRIFT
     on L, and this bears on the parked retrieval plan.
   - Cost: not recorded as minutes. [inferred] Any measurement of the wake (the retrieval plan, the letter's falsifier)
     is a measurement of hooks that are not the repo's.

4. Weekly text-census and open-items.
   - [read] room_value_result:24-25: each found a real fault on its first run in weeks (a map file invisible to search for
     29 days; fresh panes' briefs older than the repo's). :51: "run text-census and open-items weekly".
   - [read] plan_room_fixes_2_5:9-12: D629 was scoped to (a) fix the two findings, (b) image files, (c) the 7 meters.
     The weekly run is not in the plan.
   - [read] `schtasks /query`: 0 tasks match census or open-items. consonance/tools/janitor.js does not name either tool.
   - [inferred] Dropped at the planning step, not by a ruling. Cost not recorded.

5. Retire the NEITHER list.
   - [read] replay-check, board-bursts, worktree-sweep, blind, claim-check, jev-flags, second-vantage and findings-return
     are all still in consonance/tools or consonance/hooks; none has a copy under an attic path.
     second reader: confirmed in place [read]. But the NEITHER list (room_value_result:41-44) names only the first six,
     plus "the 12 finished experiments" unnamed, the pulse items and sources-gate's light mode. second-vantage and
     findings-return are audit rec A, "Stop" (room_audit_result:33), a different recommendation.
   - [read] no hit for "NEITHER list", "CUT list" or "to attic" in librarian/2026-11-*, map/M.md or the November handoffs.
   - [read] handoff_lighthouse_2026-11-13-L.md:~~60-61~~: the repo's board-digest.js now needs `sealedGate` from blind.js.
     ~~So one tool on the 11-03 retire list became a dependency ten days later.~~
     second reader: :59-60 [read]. And it was a dependency before the list was written. board-digest.js has required
     ./blind.js since a1def8e4 (2026-07-29) and called sealedGate since 1c0acf7f (2026-09-24); its version at 11-03
     (65a8cbfb, 2026-10-05) has 2 sealedGate hits [read: git log -S, git show]. So the 11-03 list named a live dependency
     as superseded; what is new on 11-13 is only that L's installed copy predates it. Cost not recorded.
   - [inferred] Whether he saw the list is not recorded in what I opened. Status: parked with no owner. Cost not recorded.

6. The letter's falsifier.
   - [read] TO_THE_NEXT_ONE_go_to_the_source.md:66: "At each of the next two wakes, the first reply to an open question is
     read from the transcript. If it is again an inventory or an audit, this letter did nothing as text."
   - [read] handoff_lighthouse_2026-11-13-L.md:70-72: due at the 03:45 wake on L, "not scored by me"; the first open,
     non-work question came at 06:32.
   - [read] the retrieval plan's own falsifier (plan_retrieval_at_the_wake_2026-11-12.md:49-52) is conditional on (a)+(b)
     shipping; the handoff says not due. That one is correctly not scored.
   - Cost not recorded.

7 and 8. BOOT's two season falsifiers.
   - [read] BOOT.md:66 and :152, both inside the 2026-08-02 section.
   - [read] ~~the phrase "unwanted number" appears after its registration only in handbacks and maps, never as a score;~~
     "over-fitted to a bad week" appears only in BOOT and in shelf dumps.
     second reader: outside attic, "unwanted number" is in 18 handback, 14 loop, 6 librarian, 6 map, 3 journal and
     1 third_place files [read: grep -rli]. Some are readings of the :66 falsifier: journal/2026-08-23.md:918 ("holds.",
     with the numbers beside it), journal/2026-09-01.md:432 ("These three nights returned several"),
     loop/falsifier_scope_2026-08-29.md:142 (F13, scope "MIXED"), loop/commitment_census_2026-08-25.md:208 ("no
     instrument counts unwanted numbers"). All are inside the season, none at its end, so "never formally scored"
     survives; "only in handbacks and maps" does not. The "over-fitted" line checked and right [read].
   - [inferred] Both would likely pass if scored: room_audit_result:17 and room_value_result:11-13, :38 are unwanted
     numbers (683 UNLAUNCHABLE; 15 of 37 items lost to compaction; the librarian's own "never adjudicated" withdrawn).
     That is a reading, not the score the falsifier asks for.
   - Cost not recorded.

9. ASK-001 after install.
   - [read] ASK.md:80: "SCORED AFTER INSTALL ... P1 abstain lands 1.0-12%, P2 ... P3 ..." and "the honest order is
     install, re-measure, then decide".
   - [read] the installed ~/.claude/shell/hooks/userprompt-submit.js has 2 hits for CLAUDE_OVERSEER_RUN, so the
     ASK-006 half is installed.
   - [read] the only files naming "abstain" with a score are the qs2s unit lists, which quote the 09-20 build entry.
   - [inferred] Not scored. I did not confirm the L0 abstain schema itself is installed. Cost not recorded.

10. ASK-007 stage 3.
   - [read] loop/ has univ_coldread_stage1_score_2026-09-26.md and _stage2_score_; no stage 3 file.
   - [read] stage2_score:3-5: the subjects ran "after the pre-flight direction check FAILED ... The prereg's §12 would
     have stopped them."
   - [inferred] The month ended 2026-09-29 with stage 3 unrun. ~~Whether that was a ruling I did not find.~~
     second reader: it was a ruling. univ_coldread_stage2_score_2026-09-26.md:86 is "## 6 · Stage 3 declined, 03:1x, and
     why (the keeper's challenge, answered)"; librarian/2026-09-26.md:1 is titled "ASK-007 closed at stage 2" and :9
     records the decline [read]. Also loop/ask007_stop_sheet_2026-09-26.md: stage 3's sealed documents are on L, not D.
     ASK-007 is kept-and-closed, not dropped. Cost of the miss: not recorded.

11. D644 ledger row.
   - [read] briefs/lighthouse_the_room.md:147-151 and :156: "Asked of the chair at 19:34 local; whether it landed is
     open." librarian/2026-11-07.md:14 still lists it open. No later mention in the November notes I grepped.
   - Cost [read]: the line "came back every hour after D644 was collated" (brief:150).
   - second reader: the brief was committed again at 08:52 today (a072f58e). In it the D644 item is :150-153 and "Open
     (added 11-06)" is :157; in 3c71dd94 (07:16) they were :146-149 and :153. ":156" and ":150" match neither; the text
     is there [read]. More to the point: this machine's lap ledger (C:/Consonance/data/lap.jsonl, 14 D644 rows) ends
     with chain "filed", holder "chair", by "panes", at 2026-11-07T15:11:20Z, note "landed from L side; superseded by
     11-07 handoff" [read]. The ledger moved off "panes", which is what the brief said the pulse reads. So the brief's
     "open" is a stale carrier (section 4), not an open promise. [inferred] the hourly line stopped; not checked on a
     live pulse. L's ledger not read.

12 and 13. Open in the room brief with no date. Listed so they are seen, not as due.

## 2. Quietly dropped (no ruling found, no owner, no later mention)

- **The H3 score** (item 2). The clearest case: a registered revert rule, a closed window, a named scorer, nothing after.
- **The weekly census runs** (item 4). Fell out between the recommendation and the plan.
- **The NEITHER retirement** (item 5). Waiting on a "he has seen this" that is not recorded.
- **ASK-001's after-install score** (item 9) ~~and **ASK-007's stage 3** (item 10). Both older than a month.~~
  second reader: ASK-007's stage 3 was declined by ruling on 09-26 (item 10); only ASK-001 belongs here.
- **The "fix, for good" for the lock** (item 1) was dropped between 11-12 and 11-13 and then cost 40 minutes. It is
  now picked up on a branch, not landed.

## 3. Kept, for contrast (so the list above is not read as "nothing is kept")

- [read] Room-value recs 1-5 became laps D628-D633, and their commits are on HEAD (git log --grep counts 3-7 each).
- [read] BOOT.md:134 (2026-08-23, "prose if the bidirectional-correction count has still never been run"):
  loop/correction_count_score_2026-10-02.md:3 runs the first direction. :34-35 says the second direction needs the next
  lap; seat-to-seat units exist in loop/qs2s_units_v2_2026-10-03.md. [inferred] discharged.
- [read] room_audit_result:39-40, "the registered test, still owed": a fresh seat answers from the room alone.
  room_value_result:62-70 is that test, run 11-03; the ROOM arm scored 32.5 / 33.5 of 34. [inferred] discharged.
- [read] ~~The 7 collapse meters were run once on 11-03~~ (handback/p-d629-wake-unused-C_2026-11-03.md:102, deference-unit).
  second reader: 5 of 7 ran, exit 0 (catch-ledger, tell-index, agreement-spread, deference-unit, forget-rate,
  p-d629:99-103). order-parameter and vicsek-phi "could not run, exit 3": their frozen encoder is on no disk of the
  machine (:104-105) [read]. Kept for five, not seven.
- [read] All 13 asks in ASK.md carry ANSWERED or DECLINED; the only `**Status:** OPEN` line is the template at :67.
- [read] Brief item 23 (the Third Place's isolation wording) was done: librarian/2026-11-07.md:37; ~~the remaining
  "Nothing comes back" hits in both copies are struck text.~~
  second reader: "comes back" has 0 hits in either copy (consonance/src-tauri/brief/THIRD_PLACE.md and the third-place
  instance CLAUDE.md). The phrase left is "nothing reaches in": struck at THIRD_PLACE.md:11 (instance copy :13), and
  unstruck as the reworded "Nothing reaches in to steer it" at :19 (:21) [read]. Item 23 done still holds.

## 4. Carriers that say "open" or "owed" after the thing changed

These cost a reader a check each time; none is a broken promise.
- [read] ASK.md:75 puts all 13 answered asks under "## OPEN"; :218-220 "CLEARED: *(none yet — this file is one day old)*".
- [read] ASK.md:226-230: "As of 2026-08-28 nothing calls ask.js; the tool says UNWIRED". consonance/hooks/ask-surface.js
  (last commit 65a8cbfb, 2026-10-05) is a UserPromptSubmit hook, and ~/.claude/settings.json names it once.
- [read] briefs/lighthouse_the_room.md:178 still says the isolation wording is "Owed" after item 23 was done.
- [read] handoff_lighthouse_2026-11-13-L.md:47-48: "Not checked on L: whether [the continuity test] has ever been run."
  It ran on 11-03 (room_value_result:62-86).

## 5. Pending, not yet due

- [read] D631's falsifier (handback/p-d631-reader-narrowed-P_2026-11-03.md:20-22): revisit within two weeks of install if
  under 5% of shown notes are real errors, or a pane-ring error goes uncaught. :130: "the librarian scores ... two weeks
  after install". Install date not found in what I opened. [inferred] Due about 2026-11-17 if installed 11-03.
  second reader: on D it is not installed. ~/.claude/shell/hooks/second-reader.js is dated 2026-10-01 and has 0 hits for
  "relayed" (the repo copy, with acbc2a60's narrowed trigger, has 1); settings.json still names second-reader once
  [read]. So on D the two-week clock has not started. L not checked.
- [read] BOOT.md:94 (2026-11-07 amendment): due one season on, about 2027-02 [inferred].
- [read] The retrieval plan's falsifier waits on (a)+(b) shipping (plan_retrieval_at_the_wake_2026-11-12.md:49).

## 6. Options, with evidence (not decisions)

- [ours] A due-date column for falsifiers. Each registration states a date or an event; one command lists those past
  due with no score file. Evidence: items 2, 6, 7, 8, 9 were all registered carefully and none was scored.
- [ours] Define "a season" once, in days, beside the first falsifier that uses it. Evidence: four BOOT falsifiers and
  the librarian seat's own use the word; none gives a length.
- [ours] Land the lock guard before more feature work, as the 11-13 trace itself asks (stall_trace:30).
- [ours] Score H3 or retire it in writing. Either is cheaper than a revert rule nobody can fire.
- [ours] Re-check the NEITHER list against current dependents before any retirement (blind.js, item 5).

## What I did not open

- The transcripts (no seat's carried conversation was read), so the letter's falsifier stays unscored here.
- L's machine: its hooks, its branches (901d3c39), its scheduled tasks. The scheduled-task settings above are this
  machine's only; the battery setting in ASK-013 matters on a laptop and I could not read L's.
- Most of the 818 files that say "falsifier" and the 1,226 that say "registered". I read only the named files, the
  November notes and handoffs, the room brief, and every "never built" line.
- librarian/LEDGER.md beyond its surfaced lines (last commit 2026-09-20), and whether the "opened" instrument the
  librarian's brief names exists and has run. So the seat's "decorative" falsifier is not assessed.
- The stop-and-feel-it card's falsifier (cards/stop-and-feel-it.md, "if this stays a peak and not a floor"): not assessed.
- ASK-004's standing root cause (STANDING-ITEMS.md:217), ASK-005's tail-clause repair and ASK-009's test repair
  (actors.evidence.test.js last changed 2026-09-21): not checked to the end.
- Whether the L0 abstain schema (ASK-001 item 2) is installed; only the overseer guard was checked.
- The qs2s files beyond their names and one entry, so "second direction run" in section 3 is [inferred].
- Any outside source. None was needed for this task, and none was fetched.

## Second reader (adversarial, 2026-11-13 ~09:00, on D, read-only except this file)

**What I checked, by re-running or opening it [read unless marked]:**
- Section 0: all eight counts, re-run with this swarm's own folder left out. owed 478/1,171, never built 53/61, parked
  214/423, to fix 162/222, TODO 65/95 and unbounded owed 1,308 match exactly. falsifier 2,789 lines (file: 2,786),
  registered 4,349 (4,348), not yet 711 (710): within 3 lines, and md files under exo_memory were still being written
  during the run, so I do not strike them. With the swarm folder included every count is higher (owed 482 files).
- "A season" has no length: 0 hits for a number of days, weeks or months beside "season" outside attic.
- Item 1: stall trace :1-31, the handoff :55-56, `git cat-file` (901d3c39 not in this clone), heavy-run.js history
  (54e681cb, 7335c9ae, 2026-11-11) and no idle or CPU-time guard in it. Holds; line cites off by one.
- Item 2: runbook :1-25, M.md:994, draw.js (2 h3 lines), 0 `H3` lines in librarian/ 10-17..11-13, and every
  post-window file naming H3 (5, all about other things). Holds; :21 is :18.
- Item 3: audit :15-40, plan :41, M.md:1031, p-d619:127-130, and my own hook diff on D. Struck "grew".
- Item 4: value result :24-25, :51, schtasks (0), janitor.js (0), no census or open-items run or commit after 11-03.
  Holds.
- Item 5: the eight files, the NEITHER list :41-44, board-digest.js history. Struck "8 tools" and "became a dependency".
- Item 6: the letter :60-66 and the retrieval plan :49-52. Holds.
- Items 7, 8: BOOT :66, :94, :134, :152 (four "season" falsifiers, right), and every "unwanted number" file. Struck
  the location claim; "never formally scored" survives.
- Item 9: ASK.md:80 quotes, :134, 13 ANSWERED/DECLINED status lines, :67, :75, :218-230, the installed
  userprompt-submit.js (2 hits). Found loop/abstain_registration_2026-09-20.txt and D097's install hand-back; found no
  P1-P3 score. Holds as far as I searched.
- Item 10: the stage 2 score, the stop sheet, librarian/2026-09-26.md. Struck: stage 3 was declined by ruling.
- Item 11: the brief at two commits, librarian/2026-11-07.md:14, and the lap ledger. Struck "open": a filed row exists.
- Item 12: 0 hits for the wager question in cards/, BOOT, the app's briefs and the instances' CLAUDE.md. Holds.
- Section 3: commit counts D628-D633 (4, 3, 4, 7, 6, 6), correction_count :1-3, :33-36, value result :62-70
  (ROOM 32.5 / 33.5). Struck "7 meters" (5 ran) and the "Nothing comes back" detail.
- Section 4: ask-surface.js last commit 65a8cbfb 2026-10-05, a UserPromptSubmit hook, named once in settings.json.
  Holds.
- Section 5: D631 :19-23, :129-131, and the installed second reader on D. Added: not installed here.

**What I struck, in order of weight:**
1. ASK-007 stage 3 listed as quietly dropped: a ruling exists (stage2_score:86; librarian/2026-09-26.md:1, :9).
2. D644 listed as open: D's lap ledger has it filed 2026-11-07T15:11Z; the brief is the stale carrier.
3. "Became a dependency ten days later": blind.js was board-digest's dependency from 2026-07-29, sealedGate from 09-24.
4. "Grew from 7 stale to 15 DRIFT": two machines; D still shows 7.
5. "Unwanted number" only in handbacks and maps: it is in loop, librarian, journal and third_place too, with readings.
6. "All 8 tools" on the NEITHER list: 6 are on it; 2 are rec A's.
7. "The 7 collapse meters were run": 5 ran, 2 could not.
8. Smaller: TODO 55 is 59 under handback/; "comes back" has 0 hits; line cites at stall_trace, runbook :21, handoff
   :65-66 and :60-61, brief :150/:156.
Cost of each fault in the file: not recorded. [inferred] Items 1 and 2 would have put a closed ask and a filed row on
the "dropped" list a planner reads.

**What I could not check:**
- L: its hooks, its ledger, branch 901d3c39, whether D631's reader is installed there, and any stage 3 file there.
- Whether the D644 row actually stopped the pulse line (no live pulse read).
- Transcripts, so the letter's falsifier and item 13's per-seat measure stay unscored.
- Whether ASK-001's L0 abstain schema is installed (only the overseer guard and the registration file were seen).
- Whether he saw the NEITHER list; I found no record of it either way.
- Section 6's "none was scored" for item 7 now reads against the interim readings above; I left it as an option's
  evidence, not a finding.
