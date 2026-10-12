# D303 part 4: C's non-author read of E's blind table (pane C, sibling-0845a868, 2026-10-11, ledger D304)

Read against B's `loop/unchecked_claims_registration_2026-10-11.md` §0–§6 (lines 1–193, stopped at "STOP HERE"). E's inputs on main b0326fc2: `p-causeread-E_2026-10-11_evidence/out/table.md`, `classification.json`, and E's hand-back. Not opened: B's §G, `plan_unchecked_claims_d303_2026-10-11.md`, anything Third Place.
Per unit: **agree**, or my class with the reason. `checked:` means I re-ran or re-read the evidence; `inferred:` means I judged from E's recorded evidence without re-opening it.

## Disagreements
| question | units | disagree | share | §6.4 (> 20%) |
|---|---:|---:|---:|---|
| Q3 | 47 | **0** | 0.0% | does not fire |
| Q2 | 41 | **5** (W004, W009, W017, W048, W098) | 12.2% | does not fire |
| Q2, leaving out W009 (a sha choice, not a reading) | 41 | 4 | 9.8% | does not fire |

## Q3 (47): all agree
- **Re-checked in the transcript:**
  - W014 CR. checked: `turn.js` librarian 14:58:06Z; 14:58:20Z printed "blind.js installed vs repo: same" before the 14:58:34Z claim.
  - W029 CR. checked: 17:22:38Z ran `ls digests | … uniq -c` and printed the digests by date before the 17:23:16Z claim.
  - W006 CN. checked: 14:53:37Z turn; the greps printed board STICK rows and file mtimes, no applier start/end timeline.
  - W002 CU. checked: `locate.js` finds neither "verified here" nor "resonance … does not exist" in the librarian transcript on 09-01 09:00–11:20Z (E searched main); still not located.
- **The four non-standard check sources: class agreed for all four.** What differs is only E's §6.3 count of "standard" checks.
  - W019 (the CLI probe from home): CN agreed. B's Q3.1 lists "a CLI the seat already had" among the standard commands, so I count it as standard.
  - W032 (the suite's TODO rows): CN agreed. `node --test` over the existing T-180 tree is a standard command over existing files, so I count it as standard. Its source reads better as `other-repo` than `compute`; a label, not a class.
  - W011 (chain-status replay): CU agreed. Its means is a repository tool (chain-status.js at 7d0ced22). The correction itself names running the pulse as the check, and the erring turn (the plan's diagnosis) is not located. inferred: whether chain-status at that sha could replay a past `now` is not shown; if it could not, QX is the alternative.
  - W079 (chain-status prints two hashes): CN agreed by the letter: `git ls-tree` at e527582b finds chain-status.js. **Note:** in my D301 census read I found `in sync?` absent from main's chain-status.js at e527582b (main has no first-parent commit 09-06 13:12 to 09-09 11:21 local). The line that answers lived on the laptop's tree, where the seat was working (its 09-09 log is headed "Librarian, laptop"). inferred: so the means existed on the seat's machine, and CN holds.
  - **E's §6.3 figure with W019 and W032 counted standard:** 33 of 44 = 75.0%. That is still under 80%, so it does not fire.
- **The rest agreed on E's recorded evidence** (inferred: I did not re-open those turns): W003, W010, W012, W016, W018, W020, W021, W022, W026, W028, W033, W034, W035, W036, W038, W041, W042, W044, W047, W049, W053, W054, W056, W058, W059, W062, W064, W073, W080, W082, W084, W088, W089, W090, W092, W096, W097, W100, W101.
- **Borderlines I accept as E placed them:**
  - W016 QX: the correction gives no source for 100 MiB.
  - W064 QX: the answer may print only from a repository read (D301's lookup), not a Q3 check, so NC is the alternative.
  - W035 and W036 NC: the answer needed analysis, not a printed value.

## Q2 (41)
| unit | E | C | why |
|---|---|---|---|
| **W004** | RN | **RF (plan)** | checked: `handoff_chair_2026-09-09.md:163-164` at f83621e0: "**ONE MACHINE ONLY until the sync is proven.** Panes never commit to the shared checkout. The chair does not build." It is a standing rule in the chair's own handoff. The conduct was a landing order from the librarian telling the chair to repair `map/C.md:1194` (an edit) inside a lap, so the order directs the very act the rule forbids. B's own Q2.2 example is "the chair does not build while the loop is active". E's reading (addressed to the chair, names no landing order) is defensible; mine is that two readers given this rule and this order would agree the order breaks it. |
| **W009** | RN | **RF (plan)**, procedural | checked: at 046b619d, the last main commit before the 08:55 local fast-forward (08:35 local), `handoff_librarian_2026-09-16_morning.md:47` reads "On D at 08:4x, after the pull and the rebuild: `grep -c "NO QUESTIONS …"` … should be ≥ 1". The correction cites that line as already written. A's sha (f83621e0) comes from a day-start t_err, used because the claim was not located, while the conduct's time is in the correction. I read B's "the sha before t_err" as the error's time. **By the letter of A's sha it is RN, as E says.** |
| **W017** | RN | **RF (brief)**, lean | E rejected `COMMITTEE.md:77` ("Route the OBJECT"), which is about briefing a seat. Agreed. But checked: `brief/BOOT.md:166` (and `exo_memory/BOOT.md:153`) at 06bf9664, maintenance law 1: "**Recall from the master, never a copy.** Re-derive from the originals, not a summary-of-a-summary." It names this conduct: taking E's §0.4 from the wrapper without looking at what it carried. It was not among E's phrases. Lean, not firm: the unit's text is a fragment that begins mid-sentence. |
| **W048** | RN | **QN** | The fix shape was specified and never built ("my one-liner **would have** shipped a 170k shell"); C found it first. B's Q2.1: "A proposal that was never acted on is not conduct, so it is QN." E applied that to W081 and not here. |
| **W098** | RF (other) | **RN** | checked: K4 at 328a64df (`anchor_similarity_registration_DRAFT_2026-09-15.md:516-521`) reads "THE UNBRIEFED HAND-BACK IS SEALED LIKE THE PACKET … writes its hand-back to a path OUTSIDE the repo". Read alone it names hand-backs, not a task's key. I read B's clause ("also count a rule the correction itself cites as already existing") as adding a CANDIDATE that is still judged against the test in Q2.2, not as an override. E counted it on the clause alone; the clause is ambiguous, and this is my reading. |
| W061 | RX | agree | checked: no `git commit -- ` and no "bare git commit" at 45a080e3. `COMMITTEE.md:130` there reads "Never `git add -A` or `git commit -a` on the shared checkout. Name every path." A bare commit after a named `git add` does not clearly break it, so two readers would not agree (K's "one word wider"). **For the librarian's dating step:** checked: the outside-git rule's own text, `delegate-to-panes-by-default.md:33-39`, says "**AND THE FIRST VERSION OF THIS FIX WAS WRONG — corrected 2026-08-19, after it failed.** … The rule that actually works: `git commit -- <path>`". The file's mtime is 2026-10-09, its last edit. inferred: the rule dates itself to 2026-08-19, before the 09-04 conduct. It is in the CHAIR's memory, not the erring librarian's. |
| W008 | RF brief | agree | checked: `BUILDING.md:199` at f67b57a7, "ends with one line and it is the last line" |
| W013 | RF claude | agree | checked: `CLAUDE.global.md:46` at b3df0c65, "Never delete or overwrite user data … without explicit confirmation" |
| W024 | RF brief | agree | checked: `LIBRARIAN.md:21` at 5ced140b, "does not directly build what is being built" |
| W069–W071 | RF plan | agree | checked: `handoff_librarian_2026-09-06.md:15` at e527582b, "Cite by quoted sentence, not line number". inferred: all three of WRONG 81–83 are that conduct; the heading names one conduct for three numbers, and the unit does not show more. |
| W072 | RF brief | agree | checked: `COMMITTEE.md:130` at e527582b, "Never `git add -A`, `git commit -a`, or a bare `git commit`" |
| W005, W015, W025, W031, W037, W040, W043, W046, W055 | RN | agree | inferred, from E's recorded hits and the corrections' "written as a result" lines |
| W001, W027, W052, W057, W063, W065–W068, W074–W077, W081, W083, W093–W095, W099 | QN | agree | headings, fragments, counts, a proposal |

**If my Q2 classes were used** (not a score, just the counts): RF 8 + W004 + W009 + W017 − W098 = 10; RX 1; RN 13 − W004 − W009 − W017 − W048 + W098 = 10; QN 19 + W048 = 20. So D2 = 21.
