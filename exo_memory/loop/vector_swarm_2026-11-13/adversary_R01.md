# Adversary against R01 "A claim of fact is typed from memory, not copied from an instrument run"
Sonnet research agent, 2026-11-13. Read-only; this is the one file written.

Marks: [read] I opened it and saw it (path:line); [inferred] mine; [ours] a proposal. Counts marked "script" came from a
node pass over 00_ledger.md and 00_roots.md (parse each `Lnnnn |` row and each "- gN (n):" id list). The script lives in
my scratch folder, not the repo.

## VERDICT (one line)
TOO BROAD TO TEST. The room already built R01's fix twice and scored it on recorded cases; neither passed
(SOURCES gate: 0 catches in 383 refusals; point-of-claim check: ruled DON'T BUILD), and R01 as worded bundles
mechanisms that one fix cannot reach.

## 0. What I am attacking
R01 (00_roots.md:9) says: a figure, time, sha, count, line cite or "no X exists" enters a ring, hand-back or note
"with no command in the same call that printed it". Proposed by g1, g2, g3 (00_roots.md:19-21). Union of their
ids: 203 rows [read: script]. Rows named by all three groups: 74. Named by two or more: 139. Named by one group
only: 64 (g1 11, g2 2, g3 51) [read: script].

## 1. Is it a symptom of another root? (partly; not wholly)
Honest result first: I cannot name one root on the list that is wholly upstream of R01. D303 measured R01's
own habit as the largest cause: "check at hand, not run" 27 units, 61.4-72.7% of decidable claim errors
(plan_unchecked_claims_d303_2026-10-11.md:34-49, :51) [read]. So R01 is real. But three roots sit beside or
under parts of it.

**1a. R06 (carried copy trusted) takes more than half of R01's rows.** [read: script]
- 94 of R01's 203 ids are also in R06's union; that is 56% of R06's 168 ids.
- Blind group g4 did not propose R01. It put 88 of R01's 203 ids into its R06 (00_roots.md:91). It also put
  43 of the 74 rows all three proposing groups agree on into R06.
- Rows where this shows in the ledger: L0059/L0066 (a content hash relayed as a commit sha), L0197 (output
  cut at head -30, then relayed and dispatched), L1006 (260-character cut of a handoff), L0709 (measured at a
  later commit than the one cited). The failure there is a copy or partial read crossing a hop, not a typed
  number with no run behind it.
- So whether these 88-94 rows are "typed from memory" (R01) or "a copy carried across a boundary" (R06) is a
  choice of label, not of cause. The roots clerk said as much (00_roots.md:~143, merge notes) [read].

**1b. R09 (fix filed where its finder sits) explains why R01 recurs, for the time/sha sub-class.**
- stamp.js was built 2026-09-09 for the librarian's notes (L0214, 00_ledger.md:253; librarian/README.md:40
  "Stamps are read, never typed") [read].
- Hand-typed times then recurred in other writers: pane E (L0867, :906; L0868; L0905), the Third Place
  (L0883, :922, "a fifth on 11-13"), pane C (L1062, :1101), and the librarian itself (L1118, :1157) [read: ledger].
- That is 7 time rows in R01's union (L0214, L0867, L0868, L0883, L0905, L1062, L1118) with 1 before and 6 after
  the tool [inferred from dates in rows]. The upstream cause for those is "the fix did not travel" (R09), not a
  new typed-claim habit.

**1c. Rows that are not a typed fact at all.** g3's 51 single-group rows carry the widest reach (g3 named 183).
At least these are other roots' territory, from the ledger text [read: script + rows]:
- 14 rows are also in R10 (his meaning read wrongly): L0795 L0801 L0806 L0807 L0820 L0824 L0825 L0826 L0827
  L0919 L0924 L0927 L0993 L1023. A misread of his sentence is not a figure copied or not copied.
- Design or spec errors: L0229 (a spec not buildable), L0204 (plan named the wrong tell), L0182, L1098-L1101
  (swarm-proposed fixes and checks wrong as written). These are reasoning faults.
- 37 of the 203 rows have no digit anywhere in the event text [read: script]; they are state or reading
  claims ("told him it was not running", "critic hasn't been run").

## 2. Rows the proposers claim that R01 does not explain
R01's definition needs "no command printed it". Rows where a command DID run, and the number was still wrong:
- L0034 (00_ledger.md:73): the count came from a grep that missed two filename patterns. I opened the primary:
  librarian/2026-08-23.md:106-110 says 21 came from `grep -ci registration`, 25 from the broader pattern [read].
- L0413 (:452): "69 hard-coded hexes in 14 files". Primary librarian/2026-10-17.md:5-7: "My grep counted every
  app/**/*.{html,js}; the 14 files hold 51" [read]. A grep ran; its scope was wrong.
- L0586 (:625): "main.rs 13,085 lines". Primary p-d627-p1-flags-P_2026-11-03.md:45: PowerShell
  `Measure-Object -Line` drops blank lines; the file has 13,933 [read]. An instrument ran; the unit was wrong.
- L0709 (:748): "119 lines" was 119 matches across 38 files. Primary p-l141-B_2026-11-06.md:97-102: the
  git grep was run and printed it; the unit word and the commit were wrong [read].
- L0754 (:793): P "misread one output line" (p-d644-land-P_2026-11-07.md:13-14) [read].
These five are in the 74-row core that all three groups named (script). Copying from an instrument run would
not have prevented any of them. [inferred] a text scan of the 74 flags about 20 more with a run or hand
arithmetic in the event text (e.g. L0084, L0485, L0566, L0897); I did not open those primaries.

Also, the room's own measurement of its wrong claims (check_precedes_claim_score_2026-09-26.md:32-34): 18 of
23 located wrong claims "carry no path, no number with >= 2 significant digits, and no backticked command.
They are assertions about state" [read]. R01 as worded (figure, sha, count, cite) names the 5 of 23, not the 18.
The state half (L0485 "builder not running", L0657, L0728, L1009, L1010) fits R02's read-the-target idea, or
none of the listed roots cleanly.

## 3. Could a fix be shown to work on a recorded case?
There is a test, and it has been run. The replay harness `consonance/tools/claim-replay.js` plus frozen lists
(census-units 7a31cfc5, right-claims 68a4a1d1) over 27 CN + 5 CU recorded erring turns
(plan_claim_check_d305_2026-10-11.md:28, :51-53) [read]. So R01 is NOT untestable in principle.
What fails is a fix of the shape "a figure must have been in a tool result of this turn":
- First replay: catch 9 (+1 borderline) of 32, low 28.1-31.3% against a 50% bar; no class passes
  (plan_claim_check_d305:35-46) [read].
- Revision, held out: 5 of 16 = 31.3% against a 40% floor; "second miss is don't build"; ruled DON'T BUILD
  (plan_claim_check_d305:48-54) [read].
- The ruling's own finding: "Presence of a figure is not evidence of a check." It also dropped four real
  unbacked seat-status claims along with the misfires (same file, :52) [read]. That is exactly my section 2:
  a figure can appear in a tool result and still be the wrong figure.
A fix for R01 therefore needs a form no one has yet shown passing a recorded case. "Do not type claims from
memory" as behaviour cannot be replayed at all.

## 4. Has the room tried a fix of this kind? Yes, three times
1. **check-precedes-claim, 2026-09-26: DEGENERATE.** D4 fired, 18 of 23 (78%) scored rows had no extractable
   token. "It cannot read the claims it is meant to test." Hypothesis left: the failing step is "recognising a
   sentence as a claim that needs a check" (check_precedes_claim_score_2026-09-26.md:9-15, :59-61) [read].
2. **SOURCES gate (D212), live 2026-10-02.** Passed its own bars (P1 97.4% reach ALLOW, 0 lost; chunk3_scores
   _2026-10-03.md:43-44, "KEEP") [read]. But measured later on what it changed:
   - 0 catches in 383 gate refusals; of 174 re-sends that changed, 20 dropped or softened a claim, none was
     shown wrong (handback/p-scoreboard-E_2026-10-11.md:11) [read].
   - SOURCES refusals: 127 paired, 42 (33.1%) changed content, 17 (13.4%) changed a claim, 4 fixed, 13
     removed or blurred (loop_friction_measure_2026-10-09.md:30) [read]. Pooled: 4.0% fixed, 10.0% dropped (:33).
   - The gate checks "opened", not "backs the claim" (chunk3_scores:47-ish, "known gap"; GATES.md intro) [read].
   - It was then set to warn in light mode: "1,783 warnings that reached no seat" (room_value_result_2026-11-03.md:43);
     "light mode has denied none since 11-06" (hooks_drift_D_2026-11-13.md:327) [read].
3. **Point-of-claim check (D305), 2026-10-12: DON'T BUILD** (section 3 above). Code left in the tree, off.
Also stamp.js (section 1b): a real fix for one writer, which did not travel.
After the gate went live the rows did not stop. Rows per period in R01's union, by script (all dated rows):
09-30 and before 83 of 321 (26%); October 9 of 162 (6%); 11-01 to 11-13 111 of 633 (18%). [inferred] October's
dip may be gate effect or thin ledger coverage (162 rows); I cannot separate them. November is back near the old
level while the gate was warn-only. That cuts both ways and is not proof either way.

## 5. Cost, from the ledger's own cost fields
Crude script read of each row's cost text (minutes or hours named), [inferred; regex, not exact]:
R01's 203 rows name about 4 minutes in total and no row of an hour or more. R02 names 17 rows of an hour or
more, R04 22, R05 11, R07 13, R08 3. Cost "not recorded" on R01: 39 of 203. R01 is the biggest count but its
typical cost line is "wrong figure to X, corrected". Its few costly rows are L0301/L0307 (a 3 h "delivery
stall" that was the librarian's own open question, A and C dispatched on it; 00_ledger.md) and L0775 (a
redundant read). [read] for those two rows' text; the cost comparison across roots is [inferred].
Count versus cost is the very mismatch the plan warns of (plan_vector_swarm_2026-11-13.md, "A root that explains
one loud incident loses to one that explains twelve quiet ones") - and here the quiet twelve are cheap each.

## 6. What survives the attack
- Big and real: 74 rows named by all three blind-ish groups, about 60 of them genuine typed or unrun claims,
  and D303's 61-73% unchecked-share backs it from a separate measurement. It is not a symptom of any single other root.
- The surviving form is narrower: "a claim whose source was already in context, or one command away, goes out
  unchecked". Cut it to that and the 5 instrument-ran rows and the keeper-meaning rows fall away.

## Verdict again
TOO BROAD TO TEST. Strongest single reason: the point-of-claim fix for exactly this was built, replayed on 32
recorded erring turns and 16 held-out ones, and ruled DON'T BUILD (31% held-out catch; plan_claim_check_d305
:48-54), while the SOURCES gate showed 0 catches in 383 refusals (p-scoreboard-E:11). If R01 is picked, the Opus
level should be told to start from the narrowed form in section 6, not from R01 as worded.

## What I did not open
- The primaries of 69 of the 74 core rows; I opened the five in section 2 plus the two time-class rows' rows only
  at the ledger level (I read the ledger text, not handback/p-l161 or third_place files for L0867/L0883/L1062).
- The scorers' files for any root (if they exist yet), and roots_g1 to roots_g4 (I read only the clerk's merge).
- The cost figures behind L0301/L0307 beyond the ledger rows; the stall_trace_2026-09-23.md primary.
- handback/p-causeread-E_2026-10-11.md and the claimrec census; I took D303's numbers from the plan's SCORE block.
- claim_check_design_2026-10-11.md (311 lines) and reply_slot_replay_2026-10-03.md (3,494 lines).
- Whether stamp.js's tests or install cover other seats; I read only the README and the ledger rows.
- Any transcript or C:/Consonance/data file. October's drop in R01 rows was not checked against ledger coverage.
