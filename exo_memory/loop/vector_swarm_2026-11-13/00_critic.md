# 00 Critic: the vector swarm, judged against its own plan (Sonnet research agent, 2026-11-13)

Marks: [read] I opened it and saw it (path:line); [inferred] mine; [ours] a proposal. A count I made with a command says
"command". Paths are under C:/Users/nname/Desktop/lighthouse/exo_memory/ unless full. Verdicts are on events, not on any seat.

Read whole: loop/plan_vector_swarm_2026-11-13.md, 00_rank.md, 00_roots.md, agreed.json, adversary_R01.md, adversary_R02.md,
00_ledger.md lines 1-12 and the second-reader block (1170-1231). Parsed by my own node script: score_R01_1/2, score_R02_1/2
(and all ten roots' agreed counts). Opened 12 primaries (section 3) and the D305 / D303 / E-scoreboard lines the adversaries
lean on. The "What I did not open" sections of the 12 ledger part files and of roots_g1-g4 headings were read for section 4.

## Short answers

- (1) The top root, R01, is first on the ledger's count (135 agreed YES against 80), so the plan's first registered failure
  did NOT fire. But the count is tangled with breadth and with how the ledger was built, and every root came back TOO BROAD
  or SYMPTOM, so the count did not separate a good root from a wide one (sections 1 and 7).
- (3) Of 12 random agreed-YES rows of R01, 10 hold (8 clean, 2 marginal) and 2 do not (L0044, L0778). Section 3.
- (6) Opus, if R01 stands, goes to claim-check.js, claim-replay.js, sources-gate.js and stamp.js, and starts from the
  recorded case L0586 (13,085 vs 13,933 lines). Section 6.

## (1) The registered tests

**Test A: is the top root on the count, or chosen by argument?**
- On the count: yes. The ranker's rule was "agreed YES rows, then cost, then groups; nothing else" [read: 00_rank.md:5-6].
  R01 is first with 135; the next is R02 with 80, so no tie-break was used [read: 00_rank.md section 2; my command, section 2].
- Anywhere argument entered: yes, in four places [inferred, each with its evidence].
  1. The groups wrote the roots by argument, and a root's "claimed ids" were each group's own placing (00_roots.md header:
     "the groups' own placing of ids is [inferred] by them"). R01's union is 203 ids, the widest of any root [read:
     adversary_R01.md:14-15].
  2. The scorers' YES rule for R01 is "one instrument run in the same call would have shown wrong or caught at once"
     [read: score_R01_1.md:13-15]. That reads a row by hindsight from the ledger wording only; scorer 1 opened no primary
     [read: 00_rank.md:41-42 quoting score_R01_1.md]. It is wider than R01's own words "no command in the same call":
     the ranker found L0586 and L0709 are YES in both scorers though a command ran in each [read: 00_rank.md:73-77].
  3. Every root's adversary verdict is TOO BROAD or SYMPTOM; "no root was marked as surviving whole" [read: 00_rank.md:49-50].
     So the count ranks breadth. A count of agreed rows rises with the width of the statement [inferred]. R01 had the
     widest id list and the first place; R02 the second widest (236 ids) and the second place [read: adversary_R02.md:11].
  4. The recommendation the ranker leaves is by argument: "start from the adversaries' narrower forms" [read:
     00_rank.md:140-143, [ours]]. The narrowed form is a different, smaller root than the one that won the count;
     its row count is not on disk [inferred].
- The plan's own candidate (a stand-in trusted for the thing) is R06 and finished 8th with 25 agreed rows [read:
  00_rank.md table]. That is a point for the method: the room's favourite did not win [inferred]. It is also muddied: g4
  put 88 of R01's 203 ids under its R06 (carry) [read: adversary_R01.md:23-27], so R01 and R06 are partly one thing under
  two labels, and R06 is scored apart from R01 [inferred].

**Test B: do the four blind groups' top roots share anything, and did the swarm report one anyway?**
- The groups did not state a single top root; I read their own words on it [read: roots_g1.md:155-160; roots_g3.md:201-206;
  roots_g4.md:175-189 (g4 placed most ids, 103, under "restate instead of carry")]. g1: widest are its roots 4 and 5
  (= R01, R06); g2: its Root 1 (lock, = R04) opens its file and its Root 2 is the typed claim; g3: "A and B cover the most
  rows" (= R01, R02); g4: R5 (= R06) holds the most placed ids.
- What they share [inferred]: three of four groups (g1, g2, g3) proposed R01; three (g1, g2, g3) proposed R02; g4 proposed
  neither and put the same rows under carry. Nothing is proposed by all four [read: 00_rank.md:101-102]. A shared family
  does exist ("a stand-in, a typed or relayed or sender-side claim, trusted for the thing"), spread over R01, R02 and R06.
  The plan's second registered failure ("share nothing and the swarm reports one anyway") did not fire as worded.
- What the swarm reported [read: 00_rank.md:104-107]: R01 first and R02 second, each with 3 of 4 groups. That is a pick from
  a split, not from a consensus: R02 shares 23 of its 236 claimed ids across all three groups [read: adversary_R02.md:45-48].
  The ranker did say "no root was proposed by all four" [read: 00_rank.md:101]. It did not name g4's absence as a split on
  the top two beyond one paragraph [inferred].

## (2) The agreed YES count for the top two, re-derived

Method [command]: node over `| Lnnnn | YES|PARTLY|NO |` table rows of score_R01_1, _2 and score_R02_1, _2; agreed = YES in
both files for the same id. I did not use the ranker's script.

| root | scorer 1 YES | scorer 2 YES | agreed YES (mine) | ranker's | same id set as agreed.json |
|------|-------------:|-------------:|------------------:|---------:|----------------------------|
| R01 | 154 | 155 | 135 | 135 | yes (sorted lists equal) |
| R02 | 91 | 96 | 80 | 80 | yes (sorted lists equal) |

Also by my command: the other roots' agreed counts match the ranker's (R03 58, R04 22, R05 26, R06 25, R07 52, R08 11,
R09 47). R10 is in a different table form and my parser returned 0; I did not redo it. R01 and R02 share 8 agreed rows
(L0036 L0301 L0657 L0699 L0719 L0728 L0778 L0995); 12 if either scorer's YES counts; their union is 207.
By ledger date, R01's 135 agreed rows: before 09-01 22, September 31, October 4, November 78 [command, ledger row dates].
So 58% of R01's agreed rows are from the last 13 days, and October holds 4.

## (3) Twelve agreed YES rows of R01, opened

**How I picked.** Shuffled R01's 135 agreed ids with a Fisher-Yates pass on a mulberry32 generator seeded 1113, took the first
12 [command]: L0035 L0044 L0083 L0086 L0088 L0109 L0250 L0778 L0779 L1075 L1101 L1118. I did not choose or drop any.
Question for each: would a fix of R01 (a figure, time, sha, count or "no X exists" is copied from an instrument run in the
same call) really have prevented it? Each primary was read in whole lines at the ledger's cite.

| row | primary opened | what it shows | holds? |
|-----|----------------|---------------|--------|
| L0035 | librarian/2026-08-23.md:207-215 | "between prompts this pane cannot act" said as a harness fact; the seat's own tool list had ScheduleWakeup | HOLD (a look at the tool list) |
| L0044 | librarian/2026-08-24.md:487-491 | "half-built tonight" was the seat's trust in its own notes' optimistic wording; the code was a one-shot migration | NO under R01; it is a characterization carried from notes (R06 / R10 shape) |
| L0083 | map/M.md:314-320 | "two pushed files" was 61 tracked files, 230 occurrences; two files read, class reported | HOLD (a count across the tree) |
| L0086 | map/M.md:324-326 | "invisible to the scanner" was half right; the 34-character proxy is visible | HOLD (run the scanner on the string) |
| L0088 | map/M.md:352-356 | "one installer line turns the check green": six hooks undeclared, a different pulse declared | HOLD (run the check); the pulse choice stays a real decision |
| L0109 | journal/2026-09-01.md:167-170 | chair relayed "VOID, n=39"; ledger said NOT-RUN | HOLD, marginal: the chair's relay from memory; the fix is on the chair's side and is a read |
| L0250 | librarian/2026-09-16.md:151 | "shell fills the window" was 4% (cap 140,000 bytes, `main.rs:4202`) | HOLD (grep the constant) |
| L0778 | librarian/2026-11-10.md:35-39 | handoff said Dreamzone 2 "not pushed", taken from the Third Place's earlier entry; a later handoff showed it pushed | NO under R01: the claim was true to its source when written and went stale; an unquoted copy, not a typed figure (R02 or R06 shape) |
| L0779 | briefs/t180_banked_s_and_wall_hairpin.md:15-19 | "no read of that track exists"; a read from 09-28 was on D's Desktop (his words) | HOLD (a search) |
| L1075 | third_place/2026-11-13.md:408-424 | experiment started and "biggest missing piece" said without searching handbacks; C had diagnosed it two days before | HOLD, marginal: it is a "no prior art" claim, a search would show; the fix shape is search-before-brief |
| L1101 | loop/wake_level2_2026-11-13/prior_attempts.md:181-186, 243-248 | falsifier quoted as "wakes" (two registrations merged); the W1 stamp check "would show 307" was 0 | HOLD (quote the file; run the check on the case) |
| L1118 | git show -s 5871223d | "the close's time corrected to the clock (13:41Z)" | HOLD (read the clock, as stamp.js does) |

**Count: 10 of 12 hold** (8 clean: L0035 L0083 L0086 L0088 L0250 L0779 L1101 L1118; 2 marginal: L0109 L1075).
2 do not hold (L0044, L0778). [inferred: "would a fix have prevented it"
assumes the seat runs the fix; that is the root's own premise.]

What the 12 also show [inferred]: no row names a minute cost; the costs are "wrong figure to the keeper", "corrected in
place", "cost not recorded". Of the 12, none carries a stated time. R01's
YES rows are cheap each, which the adversary said [read: adversary_R01.md:75-82]. Five of the 12 (L0083, L0250, L0779,
L1118, L1075) were caught by the keeper, a second seat or the seat itself within the same day; none cost a build.
Under the sample, R01 is a true pattern with low per-row cost.

## (4) What the ledger missed

Parts of the record no reader opened [read: the "What I did not open" sections]:
- No ledger reader opened a transcript, board.jsonl or C:/Consonance/data/*.jsonl; every row rests on notes, hand-backs and
  commit subjects [read: 00_ledger.md:1166-1170 area; ledger_stalls.md; ledger_swarms_today.md].
- The pane maps' bodies: A.md (2,233 lines), B.md (2,195), C.md (1,919), E.md (3,131) were read by heading only; of B's 332
  September and 165 October headings none was read, and the ledger_map_and_journal part says "the September and October
  incidents recorded in B and A bodies are therefore largely missing" [read: ledger_map_and_journal.md, "What I did not open"].
- journal/POINTERS.md lines 18 and 20, the 08-16 and 08-17 paragraphs ("17 hours dark, 18 commits made while dark, a fix that
  never shipped") [read: same section]. M-2026-08-22 to 09-01 daily maps (about 518 KB) not read.
- Commits before 2026-10-01 and about 2,500 commit subjects that did not match the filter [read: ledger_fix_commits.md].
- The third-place files dated before October, and private/third_place [read: ledger_third_place.md].
- The 12-reader ledger was never read in primary by the clerk; the second reader opened 70 of 1,123 rows [read: 00_ledger.md:1176-1178].
- Dated rows: 09-30 and before 324, October 162, 11-01 to 11-13 633 [command, ledger row dates]. The room's Oct record is thin.
  Any root's count is weighted by November.
- Rows built from the librarian's own notes and maps are over a third of the ledger. By a rough regex over the cite field,
  354 of 1,123 rows cite librarian/, map/M.md or journal/, and 66 of R01's 135 agreed rows do (49% against 32%)
  [command; the regex is crude, [inferred]]. The librarian's WRONG column records wrong claims by construction, so a ledger
  fed from it will show claim errors as the biggest class [inferred]. This is the strongest selection effect I found.

One class of incident I would expect that has no row [inferred, checked by grep over 00_ledger.md]:
- **Waits on approval and gate friction for the keeper or a pane** (permission prompts, hook latency, a denied call that
  needed a person). grep "permission prompt" and "hook latency" return 0 rows; the room's own hook gates cost something every
  turn (the SOURCES gate "1,783 warnings that reached no seat" is a row elsewhere), but the cost of a prompt waiting
  for a person is not a ledger line. Also absent by construction: faults that were never noticed. The room's own measure says
  18 of 23 located wrong claims were state assertions with no figure [read: adversary_R01.md:69-72], so many quiet
  false claims were never caught, and a ledger of caught incidents cannot count them.

## (5) Are the top two one root seen twice?

By rows, no: 8 shared agreed rows, 10% of R02's and 6% of R01's [command]. By mechanism, no: R01 is a value typed with no run
behind it; R02 is a sender-side stamp taken for the effect. Their fixes differ (R01 has no check that replays; R02 half A has
`install.ps1 -Check`) [read: adversary_R01.md:84-90; adversary_R02.md:62-70].
By family, partly [inferred]: both are "a proxy trusted where the thing could be asked". That is the plan's umbrella
candidate [read: plan, "One candidate this seat holds"], and it is why g4 folded R01 rows into R06. The adversary for R02
says its three halves each belong to another root (R03, R05, R04) [read: adversary_R02.md:15-38], and the adversary
for R01 says more than half of R01's rows are R06's [read: adversary_R01.md:23-27]. So the two top roots are two
members of one family, and each is read by its own adversary as partly a member of a third root. Picking "the top root"
by count picked one member of a family whose members overlap little by row and heavily by label [inferred].

## (6) If the top root stands: where Opus must be pointed

[ours] Start from the adversaries' narrowed form, not R01 as worded: "a claim whose source was already in context, or one
command away, goes out unchecked" [read: adversary_R01.md:121-124]. Files to open line by line, in this order:

1. `C:/Users/nname/Desktop/lighthouse/consonance/hooks/claim-check.js` (415 lines) and its test: the point-of-claim check
   ruled DON'T BUILD, code left in the tree, off and unwired [read: loop/plan_claim_check_d305_2026-10-11.md:48-54].
2. `C:/Users/nname/Desktop/lighthouse/consonance/tools/claim-replay.js` (389 lines) with `claim-check-adapter.js` and the frozen
   lists (census-units 7a31cfc5, right-claims 68a4a1d1): the harness that scored 5 of 16 = 31.3% held-out against a 40% floor.
3. `C:/Users/nname/Desktop/lighthouse/consonance/hooks/sources-gate.js` and `reply-slot.js`: the SOURCES gate (0 catches in 383
   refusals; it checks "opened", not "backs the claim") [read: handback/p-scoreboard-E_2026-10-11.md:9-11].
4. `C:/Users/nname/Desktop/lighthouse/consonance/tools/stamp.js` (63 lines) and `stamp.test.js`: the one fix that worked for one
   writer (time) and did not travel; 6 of the 7 time rows in R01's union come after it [read: adversary_R01.md:35-43].
Also the record: loop/plan_unchecked_claims_d303_2026-10-11.md:32-36 (unchecked claims 61.4-72.7% of decidable errors),
loop/check_precedes_claim_score_2026-09-26.md:9-15, 32-34 (18 of 23 have nothing extractable), and loop/plan_belief_origin_d307
(no dominant origin).

**The recorded case its failing check should come from:** L0586, "main.rs 13,085 lines"; the file has 13,933; PowerShell
`Measure-Object -Line` drops blank lines [read: handback/p-d627-p1-flags-P_2026-11-03.md:45, per adversary_R01.md:60-62 and
00_rank.md:78-82; I did not reopen it myself]. A command DID run there. So a fix that only requires "a command in the same
call" passes the case; the red check must fail on a count whose unit or method is wrong, with L0709 (119 matches, not lines)
as its twin. A second, cheaper red case is L1118 (a typed close time, the stamp.js class) [ours].
[ours] The failing check must also beat the held-out bar the room already set (40% on the 16 held-out turns), or say why not.

## (7) What would make this ranking wrong

[inferred unless marked]
1. The scorers read ledger text, not primaries, and used a hindsight rule. Re-scoring a random 12 on primaries (section 3)
   kept 10 of 12 for R01; the same test on R02's and R03's rows has not been run, so the margin over R02 is untested.
2. Breadth. Every root was TOO BROAD or a SYMPTOM; a wide root collects rows. If the ranking is redone on each root's
   narrowed form [ours], R02 half A (17 of the adversary's 19 install-drift rows are agreed YES [read: 00_rank.md:87-88]) has
   a recorded red check today (`install.ps1 -Check`, 10 DRIFT and 3 ABSENT on D) and could pass R01 on testability.
3. Cost. R01's four rows with stated minutes sum to 217; R07 shows 3,157 in 17 rows, R02 2,324 in 13 [read: 00_rank.md table].
   The count and the cost point at different roots, and the ranker said so [read: 00_rank.md:67-72].
4. Fix history. The same-shape fix was built twice and failed its own bars (D305, SOURCES) [read: sections above]. If a
   root's recorded fix route is dead, the count says where the faults are, not what to build. A root with 135 rows and no
   passing check may be worth less than one with 47 rows and a built test (R09's shell hazards, the adversary's cheapest).
5. The ledger. About 10% of rows are unreliable as written, the weakest class is the commit-subject rows (20% bad, 120-165
   rows) [read: 00_ledger.md:1219-1225]; that does not touch a 135 to 80 margin by itself. The librarian-notes weighting
   (section 4) and the November weighting might: a root is lower if the 66 notes-sourced agreed rows are the WRONG column
   re-counting its own entries.
6. R01 and R06 may be one root under two labels; if merged (union of agreed ids is 147 [inferred: 135 + 25 - 13 shared]) the
   top is wider still, and the ranking by count is a ranking of how a clerk drew the line.

## What I did not open

- The 20 score files beyond the table rows and head lines I parsed; the other eight adversary files beyond their verdict lines
  (the ranker's); the four roots_g files beyond their headings and the ranking lines cited; the 12 ledger part files beyond
  their "What I did not open" sections.
- The primaries of the other 123 R01 rows and of every R02 row; I did not sample R02 for section 3.
- handback/p-d627-p1-flags-P_2026-11-03.md:45 (I took L0586 from the adversary and the ranker, who each opened it).
- Any transcript, board.jsonl or C:/Consonance/data file (rule 4; I read no row types or timestamps from them).
- The R10 score table form (my parser returned 0 for it); `install.ps1 -Check` (not run).
