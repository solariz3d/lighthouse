# Adversary for R06, "a carried copy is trusted in place of the original across a boundary" (Sonnet, 2026-11-13)

Marks: [read] I opened it and saw it, with path:line; [inferred] mine; [ours] a proposal. A count I got by a command says
which command. Ids are the ledger's (L0001 to L1123). Ledger parsed by a node script; rows for R06's ids read by me.
Dates are local (UTC-6) unless a Z follows.

## Verdict in one line

SYMPTOM OF R01. Strongest reason: the room's own measure of where wrong beliefs come from finds a carried copy in 2 of 42
(CARRY 2), and finds the largest cause is "check at hand, not run" (27, three times the missed lookups); that is R01's
mechanism, and R06's own count is 56% R01 rows.

## 1. What produces R06? R01 does, and the counts show it

**1a. Overlap by script.** R06's three proposers named 168 distinct ledger ids. [read: node script over 00_roots.md, ids
extracted from the "Claimed ledger ids" lines; 168 is the union of g1 61, g3 42, g4 103]

- 137 of the 168 are also claimed by another root; only 31 are claimed by R06 alone. [read: same script]
- 94 of the 168 (56%) are also in R01's list. The next largest are R10 (20), R08 (13), R02 (22). R03 overlap is 0.
- The blind groups barely agree on R06. Only 9 ids are named by all three groups; 20 by exactly two; 139 by one group. [read: script]
  g1 and g3 share 20 ids, g1 and g4 share 17, g3 and g4 share 10.

**1b. Group 4 had no R01 on its list, and it shows.** g4's roots are R1 to R6 and none is "a figure typed from memory"
[read: roots_g4.md:175-181, the placement table]. Its R5 mechanism says so: "numbers from a grep (L0034, L0116, L0413)",
"cut reads", "the librarian's reading of his words" [read: roots_g4.md:128-136]. Of g4's 103 ids, 85 are named by g4 alone
and 79 of those 85 are also in R01 by another group [read: script]. Groups 1 and 3 had an R01-shaped root (their Root 4,
Root A) and put only 61 and 42 ids in the carried-copy root [read: roots_g1.md:78, :98; roots_g3.md:22, :141]. So the
bulk of R06's size is group 4's lump, not agreement.

**1c. Read the 54 rows only R06 has, and the 85 g4-only rows.** Typical row, not a boundary:
L0116 "Hand-counted loop/run1/items as 7; it holds 6" and L0117 "a nonexistent `stale` from a grep of two words" and L0507
"about 18 deg lean from one gap; measured 9.4 to 10.6" [read: 00_ledger.md rows]. One seat, one head, one miscount. No copy
was carried across anything. These are R01.

**1d. My hand sort of all 168** [inferred; ids per class are in the script I ran, listed below]:

| class | rows | what it is |
|---|---|---|
| carried copy or stale original really trusted | 53 | L0043 L0109 L0634 L0629 L0915 L1006 L0268 L0467 and the like |
| claim typed from memory or a grep, no boundary | 54 | L0013 L0033 L0116 L0507 and the like (R01) |
| nothing was carried; the original was untracked, unpushed or never written | 19 | L0487 L0705 L0708 L0322 L0955 L0133 |
| plan or reading of the keeper's words, or questions that were the seat's own calls | 22 | L0098 L0824 L0993 L1028 (R10 and conduct) |
| token cost of a wake or compaction | 9 | L1093 L1094 L0010 L1013 (R08) |
| a fix spec or proposed check wrong as written | 8 | L1098 to L1105 (R03) |
| a measurement, not an incident | 2 | L0024 L0346 |
| the launcher fetch, the recorded case (L1005) | 1 | see 2a |

So about one row in three (53 of 168) is the thing the statement says. [inferred: my sort; a second sorter would move
some by a few]. Group lists: COPY = L0043 L0047 L0109 L0262 L0268 L0467 L0629 L0634 L0788 L0794 L0915 L1006 L0031 L0551 L0610
L0061 L0191 L0233 L0282 L0341 L0396 L0410 L0449 L0392 L0644 L0645 L0737 L0958 L1083 L0125 L0750 L1090 L0194 L1071 L0781 L0014
L0197 L0275 L0301 L0587 L0801 L0807 L0930 L0939 L0699 L1011 L1070 L1106 L1107 L0985 L0986 L1097 L0995.

**1e. The room measured this exact split before, and R01's cause won.**

- D303, claims that went out wrong, 47 units: "check at hand, not run" 27, missed lookup 9, nothing at hand 9, read and
  misread 3. "'Check at hand, not run' is the largest cause, three times the missed lookups." Its own next step:
  "enforcement at the point of claim, not another rule." [read: loop/plan_unchecked_claims_d303_2026-10-11.md:35-46,
  the SCORE section; "the joint table" and "What changes next"]
- D307, where 42 wrong beliefs came from: PROXY 14, RING 14, INFER 5, DIGEST 4, **CARRY 2**, OWN-NOTE 1, NONE 1, NT 1.
  "NO DOMINANT ORIGIN ... No carrier fix is supported by this measure." [read: loop/plan_belief_origin_d307_2026-10-12.md:33-34]
  CARRY is the class that matches R06's wake, compaction and hand-off wording; it was 2 of 42 (4.8%).
  [inferred: that CARRY maps to R06; the file does not say so]
- D301/chunk 1 of the retrieval work: of 56 reach misses, 48 were KNOWN-UNOPENED (source known, no check before the claim),
  53 under the second reader. [read: loop/plan_retrieval_next_2026-09-26.md:91-92, :124-125] And of the wrong claims, 18 of 23
  "carry no path, no number ... They are assertions about state" [read: loop/check_precedes_claim_score_2026-09-26.md:30-33].
  Its reading: "the failing step is recognising a sentence as a claim that needs a check" (:61, quoted in
  wake_level2_2026-11-13/prior_attempts.md, [summary]). That is R01's step, upstream of which copy was used.

So "a carried copy is trusted" is the surface; "the seat did not run the check that was at hand" is what the data
say is under it. The seat's own two notes of this morning say the same: "What opened the letter was his question, not the
cue" [read: librarian/2026-11-13.md:385, entry 08:52] and "the summary and the handoffs carried work; what turned the seat
was his question" [read: :401, entry 09:08].

## 2. Rows its proposers claim that it does not explain (primaries opened)

**2a. L1005, the 20-second fetch (claimed by all three groups; it is the plan's lead case).**
[read: wake_level2_2026-11-13/launch_and_pull.md:6-18]. No seat trusted a copy. The launcher's fetch was cut while
receiving 2,138,111 B of a 90,516,246 B pack; the shelf was built from the tree as found; "no line said the pull failed".
The pull 53 to 58 s later was the seat's own first tool call (wake_level2/first_dispatch_gate.md:25-27, [read]). The fault is
a pipeline step whose "pull block ran" was read as "origin moved" (R02), with no receipt (R05) and a time-out. The proposed fix
F1b (wait longer) "nothing shows it would have fixed it" at 113.7 KB/s over a 120 s cap, about 13.6 MB of 90.5 MB
[read: wake_level2/00_critic.md:35-43, E2]. R06's own fix kind (a stamp compared with the source) is one of the three W5
parts, so it is testable here, but the cause is not "a copy trusted".

**2b. L0551 and L0610, the compaction that lost 15 of 37 items (claimed by all three).**
[read: handback/p-d627-p4-compaction-A_2026-11-03.md:5-20]. The file says the link from the loss to the premature push is
"a contributing cause, not proven to be the cause" and "**The costliest misstep of the window was not a compaction loss.**"
The D617 misroute happened while the keeper's word was in the carried summary and was "outweighed" by a bolded rule. So here
the carried copy was there and was not the failure. The two rows also describe the same compaction window (L0551 and
L0610 were not merged in the ledger), so they count once. [inferred]

**2c. L0024 and L0346 (claimed by all three).** These are measurements of how little a summary keeps (3.5% of
predictions, 5 of 1,759 correction sentences), not incidents, and their recorded cost is "cost not recorded" and "The
directive changed" [read: 00_ledger.md rows L0024, L0346]. Two of the nine ids all three groups agree on are not incidents.
The nine are L0024 L0346 L0551 L0610 L0629 L0634 L0915 L1005 L1006; L0551 and L0610 are one event, so the agreement is
6 events, five of them in 11-03 to 11-13, all librarian or chair. [read: script and rows; inferred: "one event"]

**2d. Nothing was carried (19 rows).** L0487, L0705, L0708: 17 finished hand-backs and a HANDOFF.md sat untracked, so L
never saw them (the_room.md:189-191, :164-166 via ledger cites). L0322, L0955: a sitting never recorded. L0133, L0070:
the checkout was 217 and 25 commits behind. There was no copy to trust and no original anyone could open from the other
machine. This is "landed or pushed" read off the sender (R02) and an absent record, the opposite of a copy replacing an
original. The room already holds its fix shape in `consonance/tools/close.js` (the plan says it asks the remote after a push)
[read: loop/plan_vector_swarm_2026-11-13.md:57-59].

**2e. Cost and design rows.** L1093, L1094, L0010, L0048, L0257, L0371, L1013, L0614, L0398 (9) are the token and idle
cost of wakes (R08; the roots clerk lists 13 R06 ids in R08, [read: script]). L0098, L0106, L0797, L0988, L1021, L1028, L1033,
L0650, L0793, L0824 to L0828, L0919, L0993, L1000 (about 22) are plans that missed his item or questions asked that were the
seat's calls; the roots clerk says R10 "Close to R06 ... kept separate" [read: 00_roots.md, R10]. L1098 to L1105 (8) are
errors in a proposed spec or check: the swarm's own fixes were wrong as written (R03 shape; the overlap with R03 is 0 in
the proposers' lists, which is itself a gap: R03 was not asked about them).

## 3. Could a fix be shown to work on a recorded case?

**As stated, no.** "Stop trusting copies across any boundary" names no one check. The three proposed fix kinds differ:
g1 a stamp compared at the first step after a boundary [roots_g1.md:104-106]; g3 a restore step that checks the keeper's
originals and open list are in the window plus a commit-or-warn on untracked hand-backs [roots_g3.md:150-152]; g4 a dispatch
refused unless the sender's transcript shows the cited primary opened in whole lines [roots_g4.md:140-143]. Three roots'
worth of mechanism under one name. [read]

**Narrow slices can be tested, and the room has written those tests.** Lap W's spec has red checks on recorded cases: a
`tmp_pack_*` probe and a large-blob test for W5, a fixture of the 14:42:47Z wake for W3, the 14:46:27Z ring rebuilt as
JSONL for W4 [read: wake_level2_2026-11-13/00_lap_w_spec.md:44, :104-117, :342, :416-422]. But the second readers found holes in
them: the W4 test passes if `decide()` always denies (:428); only 3 of 154 wakes can test the handoff half of W4
(first_dispatch_gate.md:19-24 [read]); W5 test (ii) "stays red after F1b as written" (spec:96-97); the W5 check "would
never pass" (ledger L1100). And gates_mode on D is "light", so a gate only warns; the trailer gate has warned 1,335 times
since 10-09 [read: prior_attempts.md:6-7, 2nd reader's count; [summary] of a command I did not rerun].

**The part of R06 that would be new to test is not testable with the room's power.** Lap W already holds the wake, which is
R06's sharpest cases (L1005, L1006, L0915). Choosing R06 for the Opus level would redo Lap W. [inferred]
The plan says the Lap W panes are "dispatched, not started" [read: plan_vector_swarm_2026-11-13.md:63].

## 4. Has the room tried a fix of this kind? Yes, five times, and none was scored a success

1. **The compaction preserve directive** (`consonance/hooks/precompact-preserve.js`, 08-18). Re-measure D089: "VOID AS WRITTEN";
   "There is no untreated compaction after 2026-08-18"; FLAG kept 6.4% to 8.25% against a bar of 8.39%, "the descriptive
   picture does not flatter it" [read: loop/compaction_survival_remeasure_result_D089.md:5-25, :29-31]. 10-05: 5 of 1,759
   correction sentences kept verbatim, 0.28% (ledger L0346, [read]). Still open: W2 of Lap W is the same directive again.
2. **A relevance retriever** at the turn (08-30 registration, 08-31 closing). "CLOSED ON THIS MACHINE ... Honestly killed":
   13 distinct turns against the 30 it needed [read: loop/retriever_closing_2026-08-31.md:1-4, :46-56].
3. **A check at the point of claim.** D305: "DON'T BUILD", held-out catch 5/16 = 31.3% against 40% [read: map/M.md:993];
   the citation-precedence instrument ruled DEGENERATE [read: check_precedes_claim_score_2026-09-26.md:61-70; ledger L0310].
4. **Cues and reminders.** K0 65.0% to K2 82.5%, no cue moved it (Fisher p 0.195 to 0.564); 60 of 75 rule breakers recited
   the rule in the sentence before [read: wake_level2/prior_attempts.md:44-50, [summary] of research/the_retrieval_problem_outside.md:62-72, :85-88;
   ledger L0093 [read]]. The seat's own letter predicts its own miss (:58 of that file).
5. **Gates.** The sources gate caught 0 of 383 because it asks what was OPENED, not whether the claimed STATE was checked
   [read: plan_unchecked_claims_d303_2026-10-11.md, the "What changes next" item 1]. After a refusal 38.3% of re-sends changed
   and 4.0% fixed a claim (prior_attempts.md:55-56, [summary]). g4's fix is exactly a gate on the OPEN; the room's measure
   says that is the gate that caught 0.
6. **Stamps** (D309: the state block says when it was generated; rings end `[sent ...]`; ledger L0392). Whether the stamps cut
   errors: "no registration yet" [read: map/M.md:995]. 1,381 starts read the status line, none quoted a digest time
   (prior_attempts.md:51, [summary]).
7. **Carrier drift** (carrier-drift.js): 41 of 43 carrier files still carry the withdrawn wording, and the tool reads `.md`
   and `.html` only [read: loop/carrier_halflife_2026-09-22.md:9-21, :23-26]. Fix tools aimed at copies did not reach the
   channel with the widest reach.

None of the seven has a scored success on a recorded case. Whatever the Opus level builds under R06 enters this history
unless its test is named before the build.

## 5. In fairness: what survives the attack

1. A real core stays: 53 rows (about a third) are a carried copy or a stale original treated as primary, and the cheapest
   test on the whole ledger is a narrow one, the wake (L1005 by a tmp_pack probe, L1006 by a replayed ring), already specified.
2. The split R06 makes (what a boundary drops: his words in a second compaction, an open list from L, a shelf from the old tree)
   is a different place to fix than R01's "run the check" and the room's own D303 row says carrying, not enforcing, is the next
   step for rules in plans (6 of 10 never loaded): R06's narrow half stays worth a part in a build, but not as the one root.

## Commands I ran (so the counts reproduce)

- `node` script over 00_roots.md and 00_ledger.md that parses `^(L\d{4}) \| ...` rows and the "- gN (count): ids" lines.
  Union 168; per group 61 / 42 / 103; claimed by 1, 2, 3 groups: 139 / 20 / 9; overlap with R01 94, R02 22, R10 20, R08 13,
  R07 9, R05 6, R04 3, R09 2, R03 0; ids only in R06: 31. By month R06: 08 20, 09 45, 10 14, 11 89 (all ledger 11: 633 of 1,123).
- Sorting of the 168 into classes is mine, by reading each row's first four fields.

## What I did not open

- 00_ledger.md I did not read line by line; I read the rows of R06's 168 ids by script and the header. The other ~955 rows I did not read.
- score_R06_1.md and the other adversaries' files (adversary_R02 to R04) and every score file.
- The primaries behind most single rows (the_room.md, librarian/2026-09-20.md, map/M.md outside :993 and :995, journal files).
- The session transcripts and C:/Consonance/data; I took no numbers from them.
- research/the_retrieval_problem_outside.md and the K0 to K2 data, handback/p-d627-p4c-grades-P_2026-11-03.md, handback/p-scoreboard-E_2026-10-11.md:
  I cite them through the files that quote them, marked [summary].
- consonance/hooks/*.js, launch.ps1, close.js: not opened; what they do is as the files that cite them say.
- Whether R01 is itself a symptom of a root further up (R08's cost of reopening, for example): I did not test it.
