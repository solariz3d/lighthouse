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

**One candidate examined and REJECTED, so the edge is not inflated:** B's R8 argued that the README's requirement of a machine sleeping in S3 may be unmeetable, since modern laptops often expose no S3 state. `powercfg /a` on this machine reports Standby (S3) AVAILABLE. B marked it unsure; it does not hold here and is excluded. B's R2, R6, R9, R12 and C2 overlap A's or E's items and are not exclusive.

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
