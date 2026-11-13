# Adversary against R03 (control accepted without a run on a recorded real failing case). Sonnet, 2026-11-13

Marks: [read] I opened it (path:line); [inferred] mine; [ours] a proposal. Counts below were made by node scripts over
00_roots.md and 00_ledger.md in this session; a count I did not derive that way is marked [inferred].
I read whole: plan_vector_swarm_2026-11-13.md, 00_roots.md, the ledger rows for the ids named below, roots_g4.md R1
(:36-58, :175-190). I opened two primaries in whole lines: librarian/2026-08-25.md:907-918 and
handback/p-l202-check-P_2026-11-13.md:44-50.

## Verdict

TOO BROAD TO TEST. Strongest single reason: the fix as worded ("a recorded real failing case, on the installed copy,
machine and mode in use, before the control counts") has no single check that runs on a recorded case. Its two best
rows (L1015/L1064 and L0058/L0065) are cases where no recorded real failing case existed before the control ran, so the
rule is circular on them. It is also half a symptom of R02 (installed-copy drift).

## (1) Is it a symptom of another root?

Ask "what produces this?". Two answers on the list.

**Half of its rows are R02 rows, by its own proposers.** 163 ledger ids are claimed for R03 across g1, g2, g4 (union)
[read: script over 00_roots.md]. 82 of those 163 (50%) are also claimed under R02 by some group [read: script]. The
overlap is not spread evenly. Group 4 claimed 64 ids for its R1; 54 of those 64 are also in R02's lists, and 33 of its 64
are claimed by neither g1 nor g2 [read: script]. The merge note in 00_roots.md says the same: "Group 4 R1 mixes R03 (no
positive control) with R02 (installed copy older than repo)". g4's own mechanism text names the installed copy as one of
three causes (roots_g4.md:41-43: "the installed copy is older than the repo (L1088, L0996)").
Those rows are not "a control green on its author's fixtures". They are "the control was never running":
- L0020 installed board-digest.js predated its dependency; L0021 stop.js had no dream gate; L0023 hooks shipped with no
  registration; L0092 "landed is not shipped for hooks, third time"; L0613 narrowing never reached D; L0996 push gate never
  installed on L; L1044, L1087, L1088 the same absence on D and L. [read: 00_ledger.md rows]
For these a green suite is irrelevant, because the thing under test was not the thing in use. The producing cause is R02:
the done-state is read off the author's side (landed, committed, "-Check"), and the running copy is not asked. A
"recorded failing case run on the installed copy" is R02's read-back wearing R03's name. If R02's read-back were built
(close.js already does it for pushes, per the plan), about half of R03's id list would stop being a separate finding.

**The other half has an upstream cause too: the author writes the bar and the fixtures from one picture.** That is a
claim-from-the-writer's-head problem (R01) one level up. L0058 and L0065 are the librarian's own bar
(2026-08-25.md:907-918: "My bar for P-ROOT could not prove what it claimed ... the defect it was written to catch, one
coat over"). The bar was typed, not measured. Only 7 of R03's 163 ids are also in R01's lists [read: script], so this link
is weak by the groups' own placing; I call it [inferred] and do not lean on it.

## (2) Rows its proposers claim that it does not explain

I sampled rows claimed by one group only (114 of 163 ids, 70%, are claimed by exactly one group; 31 by two; 18 by all
three [read: script]). Rows that are not "a control green on fixtures":
- L0342 (g1) Signal's gravity warp passed the seat's still-frame test and the keeper rejected it by eye. A taste miss,
  not a gate that went green on fixtures.
- L0568 (g1, g2) the deference screen's 24.8 per 1k turns: 33 of 37 cases were false positives. That is a rate quoted
  before its cases were read, which is R01.
- L0266 (g2) registered a line on the word "bait" without opening the brief. That is R10 or R01, not a control.
- L0383 (g2) a ledger-union writer test red 5 of 40 under load: a flaky test; the fix was pacing the writer.
- L0670 and L0746 (g1) a scan that dropped "file"-rule terms; a push of the name main, not the scanned sha. The scan was
  a control, but the fault is no receipt of what was scanned (R05/R06 shape).
- L0020, L0021, L0023, L0051, L0092, L0112, L0296, L0613, L0996, L1044, L1084, L1086-L1088 (g4): installed-copy or mode
  drift (R02), listed above.
- L0026 (g1): 1,179 of 1,667 second-vantage rows (70.7%) never got a verdict; the instrument is the real-case control,
  and it is itself unlaunchable. It supports the root's difficulty, not its explanation.
Counting only the 18 ids all three groups agree on (L0058 L0065 L0138 L0145 L0151 L0165 L0178 L0180 L0259 L0284 L0360
L0564 L0665 L0838 L0884 L0888 L1015 L1064), R03 is a root of about 18 rows, 1.6% of the 1,123 ledger rows [read: 18/1123].
The union of 163 is 14.5% [read: script], but 82 of those are shared with R02 and 70% have a single proposer.

**Cost.** Only 11 of the 163 R03 rows carry a numeric cost, and 44 say "cost not recorded" [read: script]. Recorded costs I
found: L0012 (blank window, 267 Rust tests and six JS suites silent, found by the keeper by eye), L0259 (2,500 lines
unguarded), L0613 (2,385,722 tokens, which is the R02 install-drift row), L0237 (days of work voided). The largest
recorded costs sit in R02, R04 and R05, not here [inferred from the group files; I did not rank costs].

**Many core rows are the control working.** L0151 and L0165 (mutation caught them), L0145 (pane J's attack), L0884 (the
seat's own mutation runs), L0284 (the count floor fired), L0838 (pane A's sweep). The ledger's "caught by" field names a
mutation harness, a falsifier run, a sweep or a pane's own check in 18 rows by a narrow keyword count [read: script,
regex on that field; not exact]. Those are rows where the room's existing control-checking found the fault before landing.
They show the habit exists and works on the cases it reaches.

## (3) Could a fix be shown to work on a recorded case?

The proposers offered shapes. g4's "one recorded case" is L0971: feed the recorded 11-13 board rows to the INSTALLED
board-digest.js on D and L; today it hides the error row, after install it must print it [read: roots_g4.md:55-57]. That
check is real and runs on a recorded case. But it tests R02 (is the fix installed), and it tests one control. R03 as a root
is "accept a control only with a recorded failing case ... re-run when the repo or install changes" (roots_g4.md:52-54):
a standing rule over every control in the room. There is no single test for a rule of that scope. Specifically:

- **Circular on its best rows.** L1015/L1064: the guard went wrong because "no row had a child exit inside the window"
  (p-l202-check-P_2026-11-13.md:47). Before the live window no recorded failing case with a child exit existed; the live
  run made it. A rule "show it fires on a recorded real failing case first" would have blocked the guard from ever
  running, or been met by a synthetic case, which is the author's fixture again. What caught it was a live run in shadow
  (it only reports) before landing, which is a different fix: shadow first, then land on real windows [inferred].
- **Same on L0058/L0065.** The bar for a foreign-path portability fix could not use a recorded real case: the fault is a
  hardcoded path that only shows off this machine's layout (2026-08-25.md:907-918). The fix there was a forced
  `SystemDrive=Z:`, a constructed case. So "recorded real" cannot be the criterion for that class; "constructed with the
  fault forced on" is.
- **A weaker, testable form exists but is not R03.** "Every control brief names its red-first case, and the landing pane
  runs it on the installed copy" could be checked by script over briefs and landing packets. That is a gate on briefs,
  and its own acceptance would face the same question (a gate green on its author's fixtures) [inferred].
- I name no test that shows the root, as worded, is fixed. I can name the narrow test for L1064 (red first: a child that
  used CPU exits inside the window, the holder must not be named idle), but it is P's fix, already ruled
  (librarian/2026-11-13.md:443), not a test of R03.

## (4) Has the room tried a fix of this kind?

Yes, four times; the ledger's own rows record how each ended.
1. **Mutation harnesses and the count floor** (from about 2026-09-03: L0151, L0165, L0884). They catch edits to code.
   They did not catch case coverage: "97 of 97 mutants caught and the first live window was wrong: the mutants prove the
   rows catch edits to the code, not that the rows cover the case" (librarian/2026-11-13.md:443 [read]; ledger L1015).
   The fix has run two months and has a known blind side; R03 adds the live-case step.
2. **Positive control on an instrument.** L0237 (2026-09-15; ledger cites map/M.md:896-905): the anchor-similarity gauge was
   "not registrable (no polarity control, positive control 100% stripped)"; days of work voided. The demand was applied and
   the cost fell on the work, not on a shipped fault [ledger text; I did not open M.md].
3. **A second-vantage instrument that reads real claims** (loop/second_vantage_registration_2026-08-31.md, ledger L0026):
   70.7% of 1,667 rows never got a verdict. This is "run it on the real case", built, and it mostly could not run.
4. **"Each part with a failing check taken from a recorded case"** is already registered for level two
   (loop/plan_wake_level2_swarm_2026-11-13.md, "Registered before it runs"; room_better_2026-11-13/00_critic.md:237
   "Make each proving check fail on the recorded case first") [read]. And the keeper's standing practice in
   ~/.claude/CLAUDE.md already reads "reproduce it in a test first ... watch that test pass" and sets mutation runs for
   "prove it" work. So the room holds this rule for bug fixes and for level-two specs. What it lacks is a rule for new
   controls with no recorded case; see (3).
Search: grep over loop/, research/ and record/ found 59 files naming "positive control" [read: count by command; I opened
none of the 59].

## In fairness: what survives the attack

- The 18-row core (all three blind groups agree) is a real class, and L1015/L1064 shows it at its sharpest: 97 of 97
  mutants caught, wrong on the first live window, two false board lines, a live holder stopped by hand on such a reading.
- No other root on the list explains "green and blind" directly; R02 explains "never installed", R01 "typed not measured".
  A fix that keeps a recorded or forced case beside each new control, run in shadow on a real window before it can act, is
  cheap [ours]. But as a root for an Opus swarm it should be cut to that core and separated from R02.

## What I did not open

- Any primary other than librarian/2026-08-25.md:907-918, handback/p-l202-check-P_2026-11-13.md:44-50 and the lines cited
  from librarian/2026-11-13.md:443; the other ledger rows are read only as ledger text, not against their primaries.
- roots_g1.md and roots_g2.md R03 sections (I used 00_roots.md's summary and g4's R1).
- The 59 files that mention "positive control"; second_vantage_registration beyond its ledger row; map/M.md.
- Group 3's reasons for placing its own ids in R02 rather than R03.
- No transcripts or jsonl files.
