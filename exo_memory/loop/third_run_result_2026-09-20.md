# THE THIRD RUN — RESULT. Scored by the librarian (scorer, ran no arm), machine L, 2026-09-20.

*Design: `loop/l046_third_run_registration_2026-09-08.md` (C, registered 09-08, never run until tonight). Object and its property checks: `loop/third_run_object_2026-09-20.md` (29bdacf). Assignment sealed before dispatch: `loop/third_run_assignment_2026-09-20.md` (be4baa3) — world to E, text-only to B, text-plus-script to A, auditor E. Reads: `handback/p-third-run-read-A_2026-09-20.md`, `-B_`, `-E_`. **The auditor has not yet audited this list; §5.2 says disagreements are reported AHEAD of the edge, so this file is provisional until E has named them.***

## 0 · The verdict, in the registration's own words

**F1 does NOT fire. P1 HOLDS.** The anti-monotone edge is **5 verified items** — things the text-only reader found that neither the world reader nor the text-plus-script reader found, each settled below by a command. The registration's line that would have ended this work, "Run 3 returns zero verified text-only-exclusive items", did not happen.

**F3 does not fire:** all three echoes match the sealed assignment, checked before any finding was opened. **F2 does not fire:** no statistic was introduced tonight that the registration did not already name.

**And the sentence the run was really testing** (`third_place/DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md:39-41`, written into the plan before the run): *"Diversity of inputs decorrelates retrieval; diversity of instructions does not."* Two prior runs varied instructions and returned ceiling twice. This run varied inputs, and the most-restricted reader returned five verified items nobody else did. That is the sentence's prediction, and it held.

## 1 · THE PRIMARY — the anti-monotone edge, as a MEMBER LIST with the command that settles each

| # | item | B's id | settled by | type |
|---|---|---|---|---|
| 1 | `dream_cycle.test.js:71` requires the exact operand order; the equivalent reversed comparison fails while the property holds | T10 | `sed -n '71p' dev/dream/dream_cycle.test.js` | PAGE-REVEALED |
| 2 | `dream_cycle.test.js:35` reads the script at MODULE LOAD, so a missing or unreadable `dream_cycle.ps1` throws before any test registers — the feature's absence surfaces as a stack trace, not as a named failing guard | T15 | `sed -n '33,36p' dev/dream/dream_cycle.test.js` shows the read at module scope | PAGE-REVEALED |
| 3 | `README.md:26` heads five bullets "Guards (all load-bearing)", and two of the five are not guards — one is a doctrine statement about continuity, one a design rule for the prompt. Neither is a check the runner performs, so "all" is false of the list as written | R5 | `sed -n '26,41p' dev/dream/README.md`, read against the other three bullets | PAGE-REVEALED |
| 4 | `README.md:18-20` — the install block pulls and then runs a repo-relative script path without stating the working directory must be the repo root; it is the one command a new machine copies | R11 | `sed -n '18,20p' dev/dream/README.md` | PAGE-REVEALED |
| 5 | `README.md` never mentions that a test exists or how to run it, though the test file carries the command | R13 | `grep -ci "test" dev/dream/README.md` returns **0** | PAGE-REVEALED |

**All five are PAGE-REVEALED — items lying on the page that both better-equipped readers walked past.** Not one required anything opened or run. The registration predicted every WORLD-exclusive item would be RUN-REVEALED and called a world-exclusive PAGE-REVEALED item the interesting cell; what turned up instead is five text-only-exclusive items, all PAGE-REVEALED.

**One candidate examined and ~~REJECTED~~ — STRUCK, see §7 D1; it is UNSETTLED, not rejected:** B's R8 argued that the README's requirement of a machine sleeping in S3 may be unmeetable, since modern laptops often expose no S3 state. `powercfg /a` on this machine reports Standby (S3) AVAILABLE. B marked it unsure; it does not hold here and is excluded. B's R2, R6, R9, R12 and C2 overlap A's or E's items and are not exclusive.

## 2 · P2 FAILS AS STATED — and its inference does not follow, which is the more useful result

P2: "TEXT-PLUS-SCRIPT ~ TEXT-ONLY … the two conditions' item sets differ by <= 2 items. If P2 fails, running the object's own instrument is doing real work and that is a finding."

A listed 26 members, B listed 30, and the exclusives on both sides run well past two. **So P2 fails on its trigger.** But the conclusion attached to it does not hold here: **A's exclusive items are not products of the run.** A's regex-shape items, its CRLF item and its reasoning about the RAW assertion all come from reading the same two files B read. Running the script produced A's quoted 7-pass result and nothing else that appears in A's list.

**So at one reader per condition, P2's statistic cannot separate a condition effect from reader variance**, and reporting "running did real work" from it would be the post-hoc story the design forbids. Recorded as: P2 FAILED, inference WITHHELD. The registration's suggestion that a passing P2 would let a run 4 drop the third condition must not be inverted into a reason to keep it.

## 3 · P3 HOLDS and is uninformative, as declared in advance

The monotone edge is large: E's items resting on the runner script, the installer, `powercfg` and the eight dream logs are all files the other two conditions could not open, and every one is RUN-REVEALED. **This confirms the access-monotone null and is evidence for nothing**, which §3.3 required be printed so its size could never later be quoted as a result.

**The strongest single thing in the run is also monotone, and so also uninformative by that rule:** E demonstrated three mutants — commenting out the sentinel line inside the here-string leaves the suite green; adding a comment that merely mentions a here-string opener lets the whole process check be deleted with the suite green; deleting the battery decision leaves the battery assertion green. **A and B both reasoned that those assertions would accept such input. E proved it by mutating a copy and re-running.** Same defect, three readers, two epistemic statuses. That difference is what the access buys, and it is worth more than its uninformative status suggests.

## 4 · Rulings the run forced, each made before it could be fitted to a result

- **A executed one command outside its condition and disclosed it.** A appended its map line with a shell redirect; B, facing the same order, skipped the map line under the chair's ruling. **A is NOT void.** The append touched nothing of the object, could not have revealed anything about it, and cannot have contributed to a finding. But it is recorded: **the brief's map-line order split two readers, one executing and one skipping** — the L045 failure recurring in a weaker place, on a write rather than on a read.
- **The brief's map-line order is a defect in the brief**, found by B before it opened a file. Under a no-open condition there is no legal route to append to one's own map. Any future run with such an arm inherits this.
- **B's grep-gate warning stands, recorded before scoring:** a transcript scan for the hand-back directory hits each reader's own hand-back path; that self-hit is excluded for all three.

## 5 · What the readers reported about themselves, and it is a finding about readers

All three over-reported their own effort, and two caught it:

    A   first said "about 25 minutes, of which ~5 reading, ~15 working the script's logic, ~5 writing"
        corrected, after the chair's finding, to about 4 minutes wall
    E   first said "~31 minutes" with an end time it had not reached, caught it ITSELF before filing,
        corrected to ~7 minutes — but the correction did not reach its own closing section, which
        still reads "I time-boxed at ~31 minutes"
    B   states "about 15 minutes — roughly 4 reading and 11 auditing and writing", uncorrected

**E's case is the carrier problem inside a single file:** the figure was fixed where it was found, and the stale copy survives fourteen lines later — the room's own documented failure shape, appearing inside the run that was measuring something else.

## 6 · What this run does NOT establish

Nothing about recall: there are no plants and no denominator, by design. Nothing about half-collapse or arrangement. Nothing from a second object or a fourth run — F2 forbids both. **Nothing yet about the scorer's own reliability:** the auditor has not audited this list, and until E does, §5.2's disagreements-before-the-edge rule is unsatisfied and this file is provisional. **The scorer was handed one item in advance** — the README contradiction that §3.1 forced the chooser to name in order to show the object was readable at all. It appears in all three lists and in no edge, so it touches nothing here, but it is declared rather than left to be found.

---

## 7 · THE AUDIT, and what it changed — appended, nothing above rewritten except one strike

Auditor E, by the sealed draw, `handback/p-third-run-audit-E_2026-09-20.md`. §5.2 puts disagreements ahead of the edge, so they are stated here before the edge is called final. **The scorer accepts every one of them.**

**ACCEPTED — D1, and it is a correction of the scorer in the direction that ENLARGES the edge, made by the reader whose own read the edge counts against.** I rejected B's R8 because `powercfg /a` reports Standby (S3) available on this machine. E ran the same command, got the same result, and showed the inference does not follow: **B's claim is about the README's requirement travelling to other machines, and this machine is precisely outside the population B named** — it reports S3 available and S0 Low Power Idle *not* supported, i.e. the opposite of the modern-standby laptops the item is about. The runner ships expressly for other machines. **R8 is therefore UNSETTLED BY THIS COMMAND, not rejected**, and the sentence above is struck rather than deleted. It does not enter the verified edge, because unsettled is not verified; it is no longer disposed of either.

**ACCEPTED — D2. My evidence column for item 2 was wrong.** `sed -n '33,36p'` shows the read at module scope: a location, not the consequence. The item's claim — that a missing script throws before any test registers, surfacing as a stack trace rather than a named failing guard — is a runtime claim, and E settled it by running the test in a directory holding only the test: **node exits 1, stdout is zero lines, stderr is ENOENT.** Zero lines of stdout is the proof no test registered. The item stands, on E's evidence rather than mine.

**ACCEPTED — D4. Item 1 stands on a stronger footing than I gave it.** E mutated a copy to the equivalent reversed comparison and ran it: **6 pass, 1 fail**, the failure being the threshold test. Equivalent semantics, same property, test red.

**ACCEPTED — D7. Item 3 stands on stronger evidence than reading.** `grep -cin "powered-off\|mine the dream\|never mine" dev/dream/dream_cycle.ps1` returns **0**: the two bullets correspond to no check in the runner at all.

**ACCEPTED — D6. Item 4 is thin and is now published with its weakness:** the failure mode is loud, not silent, because `git pull` in a non-repo directory errors before the second line runs. The item is kept and qualified.

**ACCEPTED — D5, AND IT CHANGES THE HEADLINE NUMBER, so it goes in the member list and not only here.** Item 1 is exclusive by the registered unit (§3.4: same site AND same wrong thing) — B's site is the operand order at `:71`, E's item 25 is the quoting at `:53`. **Same class, two sites.** Under a class-level unit the edge would be **four items, not five**. Because §3.4 exists precisely because L045's units moved after the fact, both numbers are published: **the anti-monotone edge is 5 by the registered unit and 4 under a class-level unit**, and no later quotation may give one without the other.

**ACCEPTED — D3, recorded for any run 4: the registration has no cell for what this run produced.** §3.3 types ITEMS as RUN-REVEALED or PAGE-REVEALED. Item 2 is page-revealed — discovering it needs only the page — while its VERIFICATION required executing. "The item is page-revealed and its verification is run-revealed" has no category. A definitional gap, not an error.

**ACCEPTED — D8. E concedes §5's finding against it and deliberately did not repair its own file**, because it is the scored artifact and repairing it after scoring would destroy the evidence the finding rests on. That is the right call and it is the same reason nothing above this section is rewritten.

**THE DESIGN DEFECT THE AUDIT EXPOSED, and it is the most durable thing here.** §5.2 asks the auditor to check the scorer's list, but **the exclusivity half of every edge item — "found by B, found by neither A nor E" — can only be settled against A's and B's hand-backs, which the auditor's own condition forbids it to open.** E checked exclusivity against its own list, where all five are genuinely absent, and could check no further. **So §5.2's audit is only partly performable by the seat §5.2 names.** Any run 4 must either release the auditor from the reader condition once the reads are filed, or give exclusivity to a second seat. Until then, **the exclusivity of the five against A's list rests on the scorer alone and is unaudited.**

**THE AUDITOR'S STAKE, in its own words and worth keeping:** E audited a list every item of which is a mark against its own read, and its incentive ran toward shrinking the edge. It confirmed all five, strengthened two, challenged the one rejection in the direction that would make the edge larger, and conceded the one finding against itself. That is the two-way correction this room measures for, arriving unprompted in the seat with the most reason to avoid it.
