27 rows
Ledger, instruments part. Written 2026-11-13 by a read-only research agent. Times in the data files are Z (UTC); local is UTC-6.
Marks: [read] opened and saw it, with path:line; [inferred] my inference or a count I did not derive with a command.
Every other count below was derived by a streamed node pass over C:/Consonance/data/*.jsonl (row types, counts, timestamps only; no text read).
"Line N" means the 1-based line number in that file, from grep -a -n. All ledgers are on D (this machine) [inferred, from the path].
Dollar figures in second-reader.jsonl were not taken. "cost not recorded" means the instrument stores no minutes or tokens for that event.

Files in C:/Consonance/data (bytes) [read, ls -l]: ask-ending 1546607; board 178981362; carrier-drift 572202; delete-gate 306484;
dispatch-gate 80863; ferry 8322; frames 31034572; heard 5418352; janitor 13419; lap 3515169; precompact 565667; push-gate 101037;
read_ledger 706; release-chime 11942; reply-slot 2436148; return_ledger 15258; second-reader 2293925; sessionstart-state 966431;
sourced_ledger 7752138; sources-gate 2899843; vantage_findings 2038501. There is no "mem", "landing-train" or heavy-run ledger there.

ROWS

1. 2026-10-02..2026-10-19 | D | sources-gate DENIED 430 rings (call_librarian 158, call_chair 171, chair_inject 101); 166 before mode "light", 264 after | each deny = a ring refused until redone; minutes not recorded; cost not recorded | an instrument (the gate itself) | C:/Consonance/data/sources-gate.jsonl:1 (first), :3236 (last)
2. 2026-10-20..2026-11-13 | D | sources-gate WARNED on 2467 rings that went through (call_chair 1020, chair_inject 734, call_librarian 713); deny count in this window is 0 | 1478 in Oct 20-31, 989 in Nov; Nov warn share 989 of 1294 gate rows (76%) [inferred from counts]; cost not recorded | an instrument; no seat recorded acting on the warns | C:/Consonance/data/sources-gate.jsonl:3242 (first warn), :6316 (last)
3. 2026-10-03..2026-10-10 | D | reply-slot BLOCKED 47 keeper-facing replies that named a token but lacked a Sources line (43 unmatched, 4 missing); 54 would-block rows before Oct 12 | each block = one turn redone once; minutes not recorded; cost not recorded | an instrument | C:/Consonance/data/reply-slot.jsonl:43 (first blocked:true), :1348 (last)
4. 2026-10-12..2026-11-13 | D | reply-slot logged 1023 would-block rows with zero blocked and zero pass-matched in the same window (1077 would-block in all: missing 1015+7, unmatched 55) | replies naming paths, shas or counts went out with no verified Sources line; cost not recorded | an instrument (shadow/light); nobody recorded acting | C:/Consonance/data/reply-slot.jsonl:22 (first would-block-missing), :6386 (last missing), :6354 (last unmatched)
5. 2026-08-15..2026-11-13 | D | sourced_ledger recorded 3293 turns with sourced=false of 17526 rows (18.8%); by month Aug 830/1986, Sep 1413/5688, Oct 758/7667, Nov 292/2185 | a turn that carried values with no matching tool call; per-turn cost not recorded; top panes librarian 631, third-place 551, main 541, consonance 490 | an instrument | C:/Consonance/data/sourced_ledger.jsonl:6 (first false), :17506 (last false)
6. 2026-10-01..2026-11-13 | D | second-reader returned flags on 1969 of 3761 ok rows (Oct 1484/2994, Nov 485/767), 4399 flags in all (Oct 3335, Nov 1064); 12 rows had 13 flags dropped | each flag = a quoted claim a reader doubted; whether each was wrong is not in the ledger [inferred]; reader time 26.4M ms (7.3 h) is the instrument's cost, not the room's | an instrument (second reader); acted-on rate not recorded | C:/Consonance/data/second-reader.jsonl (rows with "flags"; status ok rows; first ts 2026-10-01T16:14Z)
7. 2026-10-03..2026-11-13 | D | second-reader SKIPPED-BUSY on 242 rings (Oct 209, Nov 33) and skipped-no-text on 4 | 242 rings had no second reading; cost not recorded | an instrument | C:/Consonance/data/second-reader.jsonl:60 (first skipped-busy), :4003 (last)
8. 2026-10-10..2026-11-12 | D | second-reader ERRORED 4 times: 3 "bad-json: the answer is not a JSON object" (all in Nov, Nov 6 to Nov 12) and 1 "exit 1" (Oct 10) | 4 rings without a reading; cost not recorded | an instrument | C:/Consonance/data/second-reader.jsonl:756 (first error), :3938 (last)
9. 2026-10-12..2026-11-02 | D | ask-ending flagged 22 reply endings of the "want me to...?" shape in 7082 turn ends (15 on user-started turns, 7 on relay turns); shadow only, never blocked | 22 of 7082 = 0.31% [inferred]; cost not recorded | an instrument (shadow) | C:/Consonance/data/ask-ending.jsonl:1163 (first matched), :6037 (last)
10. 2026-10-06..2026-10-29 | D | delete-gate DENIED 5 deletes (a2122153 seat 4; seat 0c0c0c0b-...115b 1 on 2026-10-11) of 774 rows; 769 allowed | 5 attempted deletes stopped; what they would have lost not recorded | an instrument | C:/Consonance/data/delete-gate.jsonl:2 (first deny), :531 (last row with "hits")
11. 2026-10-06 | D | push-gate DENIED 2 pushes (rows with "found" exist: 2) of 349 rows | 2 pushes held back; cost not recorded | an instrument | C:/Consonance/data/push-gate.jsonl:4 (first deny), :7
12. 2026-10-06..2026-11-03 | D | push-gate failed OPEN 9 times with error "not a git repo" (7 in Oct, 2 in Nov); those pushes were allowed unscanned | 9 pushes with no credential scan; cost not recorded | an instrument wrote the row; nobody recorded acting | C:/Consonance/data/push-gate.jsonl:1 (first allow-error), :280 (last)
13. 2026-08-18..2026-11-13 | D | vantage_findings: 926 of 1667 rows UNLAUNCHABLE (55.5%) and 253 READER-FAILED (15.2%); together 1179 rows (70.7%) never got a verdict; 2 SKIPPED-LIVE-STATE | 1179 claim rows unchecked by the second-vantage instrument [inferred]; by month UNLAUNCHABLE 110/290/434/92, READER-FAILED 6/64/171/12 (Aug..Nov) | an instrument recorded it; a code comment records an earlier case of 6 of 7 findings UNLAUNCHABLE reported CLOSED | C:/Consonance/data/vantage_findings.jsonl:5 (first UNLAUNCHABLE), :1667 (last); consonance/tools/open-items.js:374 [read]
14. 2026-08-18..2026-11-01 | D | vantage_findings: 63 DISAGREE rows SURFACED (artifact tier 48, middle 14, floor 1); a further 54 DISAGREE disqualified as contaminated and 28 as world-moved | 63 claims a reader disagreed with; whether each was a true error is not recorded here; surfaced by month 5/41/16/1 (Aug..Nov) | an instrument (second vantage) | C:/Consonance/data/vantage_findings.jsonl:2 (first DISAGREE), :1582 (last)
15. 2026-08-18..2026-11-13 | D | vantage_findings: 102 rows CANNOT-SETTLE and 8 NO-CLAIM, of 1667 | 102 claims the readers could not settle; cost not recorded | an instrument | C:/Consonance/data/vantage_findings.jsonl (status CANNOT-SETTLE; first 2026-08-20T15:09Z, last 2026-11-13T15:05Z)
16. 2026-08-25..2026-09-22 | D | carrier-drift watch logged RED on 2050 of 4117 runs (49.8%): 1982 silent, 68 spoke; by month Aug 176, Sep 1874; by pane librarian 510, consonance 487, main 329, third-place 282 | a carrier file disagreed with its master 2050 times; only 68 said aloud; cost not recorded | an instrument; silence on repeat red is by design per the hook header | C:/Consonance/data/carrier-drift.jsonl:65 (first RED), :4110 (last); consonance/hooks/carrier-drift-watch.js:1-30 [read]
17. 2026-08-24..2026-09-09 | D | dispatch-gate outcome "asked" 73 times (call_chair 48, chair_inject 25); a code comment records that bypass-permissions mode DROPS the "ask" outcome | 73 asks possibly not honoured [inferred from the comment]; cost not recorded | an instrument and a commit (f8b64e8) per the comment | consonance/hooks/carrier-drift-watch.js:21 [read]; C:/Consonance/data/dispatch-gate.jsonl:1 (first asked), :521 (last)
18. 2026-08-24..2026-09-15 | D | lap.jsonl has 16 "void" rows (Aug 8, Sep 8): laps voided because open and map rows were seconds apart, map rows were chair-authored, or the guess was sealed after the map named the paths | 16 laps whose guess measurement was withdrawn; reasons are in the rows; minutes not recorded | the lap instrument and the librarian per the reason field | C:/Consonance/data/lap.jsonl:125 (first void), :598 (last)
19. 2026-09-22..2026-11-12 | D | lap.jsonl has 47 "skipped" rows: lap ids named in git commit subjects but never minted (Sep 1, Oct 43, Nov 3) | 47 lap ids used in commits with no lap row; cost not recorded | an instrument | C:/Consonance/data/lap.jsonl:1278 (first), :15644 (last)
20. 2026-08-16..2026-11-01 | D | return_ledger: 94 session rows with 58 surfaced ids in all and 68 misses (array lengths summed by my command); 6 "ledger-absent" rows Aug 16-18 | misses exceed surfaced, 68 against 58 [inferred]; per-miss cost not recorded | the instrument itself | C:/Consonance/data/return_ledger.jsonl:1..6 (ledger-absent); rows 7..100 carry surfaced/misses
21. 2026-08-19 | D | sessionstart-state logged 1 emit with failed=true among 471 emits | one session-start restore failed; cost not recorded | an instrument | C:/Consonance/data/sessionstart-state.jsonl:164
22. 2026-08-18..2026-11-13 | D | precompact: 3181 attempts (manual 1420, auto 1090, trigger null 671) against 471 session-start "emitted|compact" rows | up to 2710 compact attempts with no matching restore row [inferred; may be by design, cause NOT read]; a lead, not a confirmed fault | nobody; counted here | C:/Consonance/data/precompact.jsonl:1 (first row), C:/Consonance/data/sessionstart-state.jsonl:164
23. 2026-07-29..2026-10-30 | D [inferred] | board.jsonl "API Error" in 60 lines (Jul 2, Aug 18, Sep 31, Oct 9; Nov 0); biggest days Aug 24 (12 rows), Sep 9 (8), Oct 27 (8 rows, four seats, 12:42Z to 14:33Z) | turns hit by an API error; minutes lost not recorded | the board carried it; no instrument | C:/Consonance/data/board.jsonl:26685 (first line)
24. 2026-09-09..2026-09-23 | D | board.jsonl "UNDELIVERED" in 38 rows: Sep 9 14 rows (3 seats), Sep 11 4 rows, Sep 23 20 rows (3 seats); none in Oct or Nov | messages marked not delivered; cost not recorded | the board's delivery stamp | C:/Consonance/data/board.jsonl:46079 (first), :140384 (last)
25. 2026-07..2026-11-13 | D | board.jsonl "refused" in 5082 parsed rows (Jul 357, Aug 638, Sep 2630, Oct 1232, Nov 225) plus 30 in unparseable lines; Nov by day: 1st 20, 2nd 16, 3rd 42, 4th 6, 5th 25, 6th 34, 7th 1, 9th 10, 10th 33, 11th 19, 12th 4, 13th 15 | the word marks a gate or tool refusing something; kind not split (text not read) [inferred]; cost not recorded | the board's own post by mount | C:/Consonance/data/board.jsonl:58 (first match)
26. 2026-07..2026-11-13 | D | board.jsonl "MISSED" in 173 rows (Jul 17, Aug 28, Sep 66, Oct 40, Nov 22); Nov: chair 17, one other session 5; by day Nov 3 6, 5th 2, 7th 1, 9th 2, 10th 4, 11th 3, 13th 4 | meaning of each MISSED not read (text off limits); cost not recorded | board posts | C:/Consonance/data/board.jsonl:21821 (first)
27. 2026-11-13 | D | board.jsonl "IDLE HOLDER" in 13 rows, 15:34Z to 17:54Z, from P, chair, and four other seats; no row before Nov 13 | the heavy-run idle guard speaking 13 times in about 2h20m [inferred]; wait minutes not recorded | the guard; its fix is described in the handback | C:/Consonance/data/board.jsonl:199147 (first); exo_memory/handback/p-l202-fix-P_2026-11-13.md:45 [read]

COUNTS I TOOK BUT DID NOT TURN INTO ROWS (and why)
- board.jsonl "stale": 4389 parsed rows (Jul 529, Aug 1032, Sep 2017, Oct 700, Nov 111) plus 28 unparseable lines; Nov by day 1st 5, 2nd 14,
  3rd 21, 4th 3, 5th 3, 6th 10, 7th 7, 9th 3, 10th 3, 11th 19, 12th 2, 13th 21. The word has many meanings; the ledger cannot say
  which are faults, so I count it only [inferred]. First line 1596.
- board.jsonl "WRITE FAILED": 0 lines in the whole file (grep -c).
- board.jsonl unparseable lines: 799 of 199891 lines (lines 38671..163707) did not parse as JSON [inferred: possibly binary].
  Every board count above is therefore a floor. 21348 parsed rows also have no ts_source field.
- release-chime 73 rows (push chimed 44, release chimed 6, release debounced 23): design, not an incident.
- janitor 63 rows, 32 apply rows, errors 0 on all 32: no incident.
- lap.jsonl chain rows by gate: rung 5789, retake 5894, parked 246, null 1802, no gate 147: workflow, not faults.
- sessionstart-state: skipped on startup 8046 and resume 796 by design ("source not in compact"); 34 rows "third-place cwd".
- Ledgers whose last write is long past [inferred, cause not read]: dispatch-gate and ferry Sep 9; frames and heard Sep 21;
  carrier-drift Sep 22; read_ledger Aug 17; return_ledger Nov 1; release-chime Nov 10; push-gate Nov 12 (last row 05:32Z).
  If any was meant to keep running, this is "an instrument the record believes is running" (cf. carrier-drift-watch.js header).
- vantage_findings AGREE 231 rows: not an incident.

CAVEATS
- sources-gate, reply-slot and ask-ending changed mode (shadow, light, live) in the window; a "would-block" is not a refusal.
  Rows 1 to 4 keep them apart.
- Seat deny counts use seat uuids; I did not map uuids to names beyond what a hook comment says.
- The "pane" field in sourced_ledger and carrier-drift includes test and probe cwds (cwd-on, probe, sibling-*); not removed.

What I did not open
- Any message text in board.jsonl, heard.jsonl, frames.jsonl, or any transcript .jsonl (rule 4), so no row says what a
  refusal, MISSED, stale or API Error was about.
- heard.jsonl (43966 rows) and frames.jsonl: audio and frame logs, not outcome ledgers.
- Hook code beyond headers (reply-slot.js 1-40, ask-ending.js 1-30, carrier-drift-watch.js 1-30, second-vantage.js 20-50,
  open-items.js near 374): I did not trace what each outcome causes downstream.
- Any record of minutes lost for these events: none of the ledgers holds minutes, so no row has one.
- exo_memory journals, hand-backs and the librarian LEDGER (other parts of the swarm cover them), except
  handback p-l202-fix-P_2026-11-13.md:45 and the plan file.
- The dollar field costUsd in second-reader.jsonl (not taken).
- Whether any of the 3293 unsourced turns, 4399 second-reader flags or 63 surfaced disagreements was a true error.
