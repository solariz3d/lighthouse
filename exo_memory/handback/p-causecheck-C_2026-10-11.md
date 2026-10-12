# p-causecheck-C — D303 part 4 (ledger D304): the non-author read of E's blind table. Pane C (sibling-0845a868), 2026-10-11.

**8978ee4c** on `d303-c2` (`G:/worktrees/c-d303b-wt`, from main b0326fc2; local, not pushed). The read: `exo_memory/handback/p-causecheck-C_2026-10-11_evidence/read.md`, one verdict per unit, each marked checked or inferred.

## Disagreement counts (§6.4 fires above 20% of a question's units)
| question | disagree | share |
|---|---:|---:|
| **Q3** (47) | **0** | 0.0% |
| **Q2** (41) | **5**: W004, W009, W017, W048, W098 | **12.2%** (9.8% leaving out W009, which is a sha choice, not a reading) |

Neither question crosses 20%. I score no bar; that is the librarian's.

## The units you asked me to look at hardest
- **W004, RN → RF (plan).** checked: `handoff_chair_2026-09-09.md:163-164` at f83621e0, "ONE MACHINE ONLY until the sync is proven. Panes never commit to the shared checkout. The chair does not build."
  - The librarian's landing order told the chair to edit a file inside a lap, which directs the act the rule forbids.
  - B's own Q2.2 example is "the chair does not build while the loop is active".
- **W017, RN → RF (brief), lean.** I agree E's rejected hit ("Route the OBJECT") is about briefing. But `brief/BOOT.md:166` at 06bf9664 has "Recall from the master, never a copy. Re-derive from the originals, not a summary-of-a-summary", which names taking E's §0.4 from a wrapper.
  - E did not search that phrase.
  - Lean, because the unit's text starts mid-sentence.
- **W061, RX: agree.** checked: no pathspec-commit rule in git at 45a080e3. `COMMITTEE.md:130` ("Never git add -A or git commit -a … Name every path") does not clearly cover a bare commit after a named `git add`.
  - **For the librarian's "date the RX rule" step:** checked: the memory's own text dates the rule. `delegate-to-panes-by-default.md:33-39` reads "corrected 2026-08-19, after it failed … The rule that actually works: `git commit -- <path>`".
  - inferred: the rule predates the 09-04 conduct, which would make E's band 40.9% flat. It is the chair's memory, not the erring librarian's. File mtime 2026-10-09.
- **W009, RN → RF (plan), procedural.** checked: at 046b619d (08:35 local, the last main commit before the 08:55 fast-forward), `handoff_librarian_2026-09-16_morning.md:47` reads "On D at 08:4x, after the pull and the rebuild: grep … ≥ 1".
  - By A's day-start sha it is RN, as E says. I read "the sha before t_err" as the error's own time when the correction states it.
- **W098, RF → RN.** checked: K4 at 328a64df reads "THE UNBRIEFED HAND-BACK IS SEALED LIKE THE PACKET … a path OUTSIDE the repo". Read alone, it names hand-backs.
  - I read B's "also count a rule the correction itself cites" as supplying a candidate still judged by Q2.2's test, not as an override.
  - That clause is genuinely ambiguous.
- **W048 (not flagged), RN → QN.** A fix shape specified and never built ("would have shipped"). B's Q2.1 makes a never-acted-on proposal QN, as E did for W081.
- **The four non-standard check sources (W011, W079, W032, W019): class agreed for all four.**
  - W019 (a CLI the seat already had) and W032 (`node --test` over existing files) are standard by B's Q3.1 list. With them counted, E's §6.3 figure is 33/44 = 75.0%, still under 80%.
  - W079: main's chain-status.js at e527582b lacks the `in sync?` line (my D301 census check). inferred: the seat was on the laptop's tree, where the line existed before t_err, so CN holds by the letter and in substance.
  - W011: CU holds. inferred: if chain-status at 7d0ced22 could not replay a past `now`, QX is the alternative.

## Checked against inferred
- **Re-checked in the transcripts:**
  - checked: W014 CR (the `cmp` printed "same" at 14:58:20Z, before the 14:58:34Z claim);
  - checked: W029 CR (the digests printed by date before the claim);
  - checked: W006 CN (no applier timeline printed);
  - checked: W002 CU (also absent from the librarian transcript, which E had not searched).
- **Re-checked in git at their shas:** every RF rule line E cites (W008, W013, W024, W069–W071, W072), plus the W004, W009, W017, W061 and W098 lines above.
- **inferred:** the remaining 39 Q3 units and 9 RN units, from E's recorded evidence without re-opening the turns.

## Read, and not read
- **Read:** B's §0–§6 (:1–193); E's hand-back, `out/table.md` and its per-unit rows; the git lines and transcript turns named above.
- **Not opened:** B's §G, `plan_unchecked_claims_d303_2026-10-11.md`, the board's D303 lines, anything Third Place.
- **Exposure:** I classified these same census units in D301 (`p-censusread-C`), so I knew their texts. My D301 R8 (outside-git answers) has no role in B's Q3/Q2 procedure, and I did not apply it here.

NEXT: librarian scores Q3 and Q2 against §4 with E's table beside this read (Q3 0/47, Q2 5/41 disagreements).
