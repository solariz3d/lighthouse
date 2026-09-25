# S1 — the practised-archetype census, 2026-09-14 → 2026-09-24 (pane C, D135, on D)

Plan: `loop/plan_pane_specialization_2026-09-24.md` S1, C's bullet (`89d7d91` + `4061210`). HEAD `cc921dc`. Pane C is one
of run 2's subjects. The battery draft, B's output this lap and `C:\Consonance\sealed\` were not opened.

## 1 · THE CLASS DEFINITIONS, written before any file was classed

A hand-back is classed by its **primary deliverable**: what its own opening, summary and closing say it delivers, and
what files it says it wrote. It is never classed by its title or filename.

- **BUILD** — the deliverable is a change to working behaviour: new or modified code, a tool, a test, a hook, a
  config or an installed artifact. Tests or measurements that verify that change are part of building it.
- **READ** — the deliverable is findings or a verdict about an EXISTING artifact the pane did not build this lap:
  a review, an attack, a cite-check, a blind or sealed read, or a verification of someone else's claim. Nothing is
  built, and no new numbers are produced beyond checking the artifact's own.
- **MEASURE** — the deliverable is NEW NUMBERS about the system or its data, produced by running an instrument, a
  census, a dry run, a count or a score. The numbers are the product. No code change is shipped, and it is not a
  verdict on someone's artifact.
- **RESEARCH** — the deliverable is an answer to an OPEN QUESTION that does not yet have an instrument or a build: a
  root-cause trace, a design, a registration or pre-registration, a proposal, or external documentation read to decide
  something. It produces an explanation or a plan, not a shipped change or a count.
- **AMBIGUOUS** — two classes carry comparable primary weight in the content, and the content does not settle which.
  It is recorded with both candidates and **not forced** into either.

## 2 · ATTRIBUTION, and the corpus

**The window.** It covers every file in `exo_memory/handback/` whose filename date is 2026-09-14 or later: **295
files** (`ls exo_memory/handback | awk -F_ '{d=$NF; sub(/\.md$/,"",d); if (d>="2026-09-14") print}' | wc -l`).

**How a file is attributed to a pane: by the FILENAME LETTER, then checked against the file's own header.**
- **The letter** is the pane suffix before the date: `-A`, `-B`, `-C` or `-E`. The variants `-readerC`, `-readerE`
  and `-A-correction` count under that letter.
- **The header check** looks at the first 6 lines of each file for "pane X", or X's call sign (ALPHA, BRAVO,
  CHARLIE or Around, ECHO).
  - Of the 284 attributed files, **241** name exactly the pane their letter says.
  - **42** name no pane in the header, so the letter stands.
  - **1** names two: `p-stick-A_2026-09-14.md`. Its first body line reads "**Pane A**, machine L". ECHO appears only
    as the pane building against A's contract, so it stays A.
  - **0 conflict.**
- **Not used, and why:** the map line and the board ring. The filename letter is set by the packet that dispatched
  the lap, and the header check already confirms it independently. The board ring was not needed to break any tie.

**Set apart, not classed (11 files):**
- **10 battery run-1 SUBJECT answers:** `t2-{alpha,charlie,echo}`, `t3-{alpha,bravo,charlie,echo}` and
  `t5-{alpha,charlie,echo}`, all `_2026-09-16`. These were the panes answering a set test, not choosing or doing
  practised work, and counting them would score the battery as practice. **By pane:** A 3, B 1, C 3, E 3.
- **1 not a pane:** `readme-audit_2026-09-14.md`, "hand-back from the Third Place".

**Classed: 284 files.** By pane: **A 78 · B 62 · C 78 · E 66**, one row per file, 284 in all. That includes `-A-correction`,
`-readerC` and `-readerE`. My first write of this line said 77/62/77/65, which sums to 281, because I had left the
three variants out. Caught on re-adding.

**How the classing was done.**
- The 284 files were split into six batches. Each batch was read by a subagent given **§1's definitions verbatim**,
  told to class from content and never from title, and **required to return a verbatim quote (≤25 words) as evidence
  for each call.**
- **I spot-checked the calls myself** against the files (§5).
- The quotes stay in the scratch output and not here, because they are the files' own text.
- **This is one classifier family's reading.** §5 says how far it was checked.

## 3 · THE COUNTS

Reproduce with `node <scratchpad>/d135/report.js`, which reads the six classifier outputs `out_00..05.jsonl`; `aggregate.js`
refuses unless every one of the 284 files has exactly one row.

**As classed (ambiguous is its own column, rates over each pane's n):**

| pane | n | BUILD | READ | MEASURE | RESEARCH | AMBIGUOUS |
|---|---:|---|---|---|---|---|
| A | 78 | 55 (71%) | 5 (6%) | 3 (4%) | 4 (5%) | 11 (14%) |
| B | 62 | 26 (42%) | 26 (42%) | 3 (5%) | 3 (5%) | 4 (6%) |
| C | 78 | 42 (54%) | 10 (13%) | 5 (6%) | 7 (9%) | 14 (18%) |
| E | 66 | 38 (58%) | 8 (12%) | 2 (3%) | 14 (21%) | 4 (6%) |

**Sensitivity check 1: ambiguous rows excluded.**

| pane | n | BUILD | READ | MEASURE | RESEARCH |
|---|---:|---|---|---|---|
| A | 67 | 55 (82%) | 5 (7%) | 3 (4%) | 4 (6%) |
| B | 58 | 26 (45%) | 26 (45%) | 3 (5%) | 3 (5%) |
| C | 64 | 42 (66%) | 10 (16%) | 5 (8%) | 7 (11%) |
| E | 62 | 38 (61%) | 8 (13%) | 2 (3%) | 14 (23%) |

**Sensitivity check 2: each ambiguous row split evenly across its candidates.**

| pane | n | BUILD | READ | MEASURE | RESEARCH |
|---|---:|---|---|---|---|
| A | 78 | 58.5 (75%) | 8.0 (10%) | 4.0 (5%) | 7.5 (10%) |
| B | 62 | 27.0 (44%) | 26.5 (43%) | 5.0 (8%) | 3.5 (6%) |
| C | 78 | 46.5 (60%) | 14.0 (18%) | 9.0 (12%) | 8.5 (11%) |
| E | 66 | 39.5 (60%) | 9.0 (14%) | 3.0 (5%) | 14.5 (22%) |

**The ambiguous rows, by candidate pair (all panes, 33 in total):**

| pair | count |
|---|---:|
| BUILD/READ | 10 |
| BUILD/MEASURE | 7 |
| MEASURE/RESEARCH | 5 |
| MEASURE/READ | 4 |
| BUILD/RESEARCH | 4 |
| READ/RESEARCH | 3 |

**Independence test.** Pane × class on the 251 unambiguous rows: **χ² = 44.9, df 9, p ≈ 1e-6.** It is computed in
`report.js`, with no dependency.
- **Caveat:** the MEASURE column's smallest expected cell is 3.0, under the usual floor of 5, so the p-value is
  indicative rather than exact.
- **The result does not rest on it.** The single largest contrast is readable without a test: **READ is 26 of 58 for
  B, against 23 of 193 for A, C and E together.**

## 4 · WHICH WAY IT READS, against the registered line

The line, from the plan: *"if S1's census shows the four panes' practised work is indistinguishable (every pane in every
class at similar rates), then specialization-by-practice has no signal."*

**The census does NOT show that. The practised work is distinguishable.** The registered falsifier does not fire, and
the difference survives both sensitivity checks.

- **B is the reader.** READ is 42–45% of B's work, against 6–18% for every other pane across the three views (C's split view is the 18%). BUILD is 42–45%, the lowest of
  the four.
- **A is the builder.** BUILD is 71% as classed and 82% with ambiguous rows excluded, the highest of the four. A has
  the least READ and RESEARCH.
- **E carries the most RESEARCH:** 21–23%, against 5–11% for the others.
- **C has no single lead.** C is second in READ (13–18%), second in RESEARCH (9–11%) and first in MEASURE (6–12%), and
  has the most ambiguous rows (18%). That is a MIXED profile, not a specialty. Said plainly, it is also the least
  specialized.
- **MEASURE is rare for everyone** (3–12% across all views). The 09-16 archetype sentences "E builds and
  measures" and "C researches, measures and reads" (`loop/pane_archetypes_idea_2026-09-16.md`) are **not supported on
  the measure half**. Measurement in this room mostly ships inside a build or a read, not as its own deliverable. That
  may also be my definition's doing: "no code change shipped" pushes measure-with-a-tool into BUILD.
- **Against the 09-16 archetypes:**
  - "A builds": **holds**.
  - "B reads against (10 of 10)": **holds, at 42–45% now, not 10 of 10**, because B also builds (26 of 62).
  - "E builds and measures": **builds holds; measures does not; research is E's second class.**
  - "C researches, measures and reads": **partly.** C is spread, and C's largest class is still BUILD.

**What "distinguishable" does NOT mean, and this is the main limit.** Panes do not choose their laps. **The chair
dispatches every packet**, so this census measures **what each pane was ASSIGNED**, not what it excels at or would
choose. And some of the assignment followed the very archetype labels the 09-16 file wrote from these same hand-backs.
So the signal is at least partly **the dispatcher's habit reflected back**: label → assignment → practice → label. The
census cannot separate a pane's aptitude from the chair's routing. **That is exactly the question S2–S4's blind battery
exists to answer.** So the census gives practice a signal, and says nothing about ability. It does not lighten S2–S4.

## 5 · HOW FAR THE CLASSING WAS CHECKED

**Spot-check by me: 16 rows**, 4 per pane, a seeded random draw of non-ambiguous rows (`sample.txt` in scratch).
- I read each file's opening against its class. **16 of 16 upheld.**
- **2 are borderline:**
  - `p-l089-jevflags-A` is READ, a verdict on A's own earlier recipe; RESEARCH is also arguable.
  - `p-suggestion-switch-B` is RESEARCH; MEASURE is also arguable.
- **16 rows at 16 of 16 bounds the error rate loosely.** It does not certify the other 268.

**Where the six readers disagreed with each other, named by them:**
- **Documentation edits** (README, AGENTS.md, in-place doc corrections): batches 01 and 04 classed them BUILD,
  "the file it changes is shipped". Batch 03 marked them BUILD/READ ambiguous. **§1 does not decide docs, and that is
  my definitions' gap, not the readers'.** The effect is confined to BUILD vs AMBIGUOUS within a pane. It cannot
  create the B-READ or E-RESEARCH contrasts, which is why §3's two sensitivity views are given.
- **Data operations** (the ledger union, the board compaction) were classed BUILD. §1 does not cover a data change
  either.
- **Blind reads that also compute agreement numbers** (kappa) were classed READ, as §1 names "blind/sealed read".
- **A root-cause trace followed by a shipped fix** was classed BUILD: the shipped change decides it.

**A process error of mine, disclosed.** My exclusion filter removed battery run-1 answers, the Third Place's file and
any `d135` file. **It did not remove two hand-backs about RUN 2:** `p-battery-run2-draft-B_2026-09-19.md` and
`p-battery-run2-attack-E_2026-09-19.md`. The batch-00 reader **opened both** and flagged them unprompted.
- **I did not open them.** Their evidence quotes were redacted in the scratch output without being printed.
- **What reached me is their two class labels:** READ for the attack and RESEARCH for the draft. Both are
  already given by their titles.
- **They stay in the census** because they are in the window and are practised work. Their classes come from a reader
  I did not check.
- **If the librarian judges that exposure material to run 2,** the fact to weigh is exactly this: C saw two filenames
  and two one-word labels, and no content.

## 6 · EVERY PATH, per pane, per class

### Pane A — 78 files
- **BUILD (55):** `p-address-refusal-pointer-A_2026-09-19.md` · `p-ask006-guard-A_2026-09-20.md` · `p-brace-counter-A_2026-09-19.md` · `p-d098-ringdigest-A_2026-09-21.md` · `p-d099-verifyrefuse-A_2026-09-21.md` · `p-d100-rules-A_2026-09-21.md` · `p-d105-overseersoff-A_2026-09-22.md` · `p-d107-pacing-A_2026-09-22.md` · `p-d108-l2only-A_2026-09-22.md` · `p-d111-archtest-A_2026-09-22.md` · `p-d123-consumer-A_2026-09-23.md` · `p-d130-hash-A_2026-09-24.md` · `p-d133-publishclose-A_2026-09-24.md` · `p-digest-at-ring-A_2026-09-20.md` · `p-diverged-A_2026-09-14.md` · `p-harness-A_2026-09-15.md` · `p-harness-revision-A_2026-09-16.md` · `p-l062-rc2-A_2026-09-21.md` · `p-l065-close-A_2026-09-21.md` · `p-l068-manifest-stick-A_2026-09-21.md` · `p-l069-ringdigest-A_2026-09-21.md` · `p-l070-fastforward-A_2026-09-21.md` · `p-l071-jevjudge-A_2026-09-22.md` · `p-l073-park-A_2026-09-22.md` · `p-l074-ten-A_2026-09-22.md` · `p-l077-thirdplace-A_2026-09-22.md` · `p-l078-skipfail-A_2026-09-22.md` · `p-l080-sweep-A_2026-09-22.md` · `p-l082-about-A_2026-09-22.md` · `p-l084-output-next-A_2026-09-23.md` · `p-l086-intake-A_2026-09-23.md` · `p-l092-agents-A_2026-09-23.md` · `p-l095-queued-A_2026-09-23.md` · `p-l097-readme-A_2026-09-23.md` · `p-l099-jevstandalone-A_2026-09-23.md` · `p-l105-jevstep2-A_2026-09-23.md` · `p-l114-prompt-A_2026-09-23.md` · `p-leave-A_2026-09-14.md` · `p-leave2-A_2026-09-15.md` · `p-leave3-A_2026-09-15.md` · `p-leave3-b7-A_2026-09-16.md` · `p-leave3-fixes-A_2026-09-16.md` · `p-mutant-harness-check-A_2026-09-19.md` · `p-no-console-A_2026-09-14.md` · `p-nul-guard-A_2026-09-16.md` · `p-r2-jssuite-summary-A_2026-09-21.md` · `p-refusal-keeps-pointer-A_2026-09-19.md` · `p-seal-gate-build-A_2026-09-16.md` · `p-second-instance-text-A_2026-09-18.md` · `p-stick-A_2026-09-14.md` · `p-stick-build-A_2026-09-14.md` · `p-stick-zombie-A_2026-09-16.md` · `p-suggestion-off-A_2026-09-19.md` · `p-track-pools-A_2026-09-17.md` · `step0-redact-A_2026-09-15.md`
- **READ (5):** `p-d113-unionattack-A_2026-09-22.md` · `p-d126-session-A_2026-09-23.md` · `p-l060-ch4-A_2026-09-21.md` · `p-l089-jevflags-A_2026-09-23.md` · `p-third-run-read-A_2026-09-20.md`
- **MEASURE (3):** `feasibility-label-A_2026-09-15.md` · `p-l109-jevr4-A_2026-09-23.md` · `p-t2-arm-c-feasibility-A_2026-09-19.md`
- **RESEARCH (4):** `p-d119-gaps-A_2026-09-22.md` · `p-l111-unitset-A_2026-09-23.md` · `p-leave-flush-A_2026-09-19.md` · `p-seal-gate-A_2026-09-16.md`
- **AMBIGUOUS (11):** `p-ask001-l3-A_2026-09-20.md` [READ/MEASURE] · `p-d101-pulse-A_2026-09-21.md` [RESEARCH/READ] · `p-d122-watchlist-A_2026-09-22.md` [BUILD/RESEARCH] · `p-d124-stranger-A_2026-09-23.md` [READ/BUILD] · `p-d127-live-A_2026-09-23.md` [READ/BUILD] · `p-d128-planted-A_2026-09-23.md` [READ/BUILD] · `p-d132-publish-A_2026-09-24.md` [RESEARCH/BUILD] · `p-holder-librarian-marks-A_2026-09-20.md` [RESEARCH/BUILD] · `p-l070-fastforward-A-correction_2026-09-21.md` [READ/RESEARCH] · `p-l103-drift-A_2026-09-23.md` [MEASURE/RESEARCH] · `p-launch-pull-A_2026-09-16.md` [BUILD/RESEARCH]

### Pane B — 62 files
- **BUILD (26):** `p-ask-provenance-B_2026-09-20.md` · `p-ask001-abstain-B_2026-09-20.md` · `p-carrier-rows-B_2026-09-22.md` · `p-chair-rule-in-brief-B_2026-09-19.md` · `p-d098-excluded-B_2026-09-21.md` · `p-d101-actorsev-B_2026-09-21.md` · `p-d101-pysort-B_2026-09-21.md` · `p-d123-install-B_2026-09-23.md` · `p-d124-mutants-B_2026-09-23.md` · `p-d129-isolation-B_2026-09-23.md` · `p-d130-drain-B_2026-09-24.md` · `p-d133-gate-B_2026-09-24.md` · `p-ferry-tests-B_2026-09-16.md` · `p-l060-carriers-B_2026-09-21.md` · `p-l061-refreeze-B_2026-09-21.md` · `p-l063-contamination-B_2026-09-21.md` · `p-l081-member-B_2026-09-22.md` · `p-l093-members-B_2026-09-23.md` · `p-l101-fuse-B_2026-09-23.md` · `p-l114-ask-B_2026-09-23.md` · `p-nul-repairs-B_2026-09-16.md` · `p-r3-ask-fixture-B_2026-09-21.md` · `p-text-rules-B_2026-09-16.md` · `p-trailer-briefs-B_2026-09-16.md` · `p-trailer-gate-B_2026-09-16.md` · `p-trailer-wiring-B_2026-09-16.md`
- **READ (26):** `anchor-registration-read-B_2026-09-15.md` · `anchor-registration-read2-B_2026-09-15.md` · `p-ask012-vantage-B_2026-09-20.md` · `p-battery-attack-B_2026-09-16.md` · `p-blind-write-read-B_2026-09-16.md` · `p-boundary-read-B_2026-09-16.md` · `p-d109-tj1v2attack-B_2026-09-22.md` · `p-d117-blindread2-B_2026-09-22.md` · `p-d118-outside-B_2026-09-22.md` · `p-d120-relayinjattack-B_2026-09-22.md` · `p-harness-read-B_2026-09-15.md` · `p-harness-read-B_2026-09-16.md` · `p-l080-tj1attack-B_2026-09-22.md` · `p-l108-reader-B_2026-09-23.md` · `p-l113-reader-B_2026-09-23.md` · `p-leave-read-B_2026-09-14.md` · `p-leave-read2-B_2026-09-14.md` · `p-leave2-read-B_2026-09-15.md` · `p-leave3-read-B_2026-09-16.md` · `p-leave3-reread-B_2026-09-16.md` · `p-six-reds-B_2026-09-19.md` · `p-step1-read-B_2026-09-19.md` · `p-stick-preflight-B_2026-09-14.md` · `p-t3-attack-B_2026-09-19.md` · `p-third-run-read-B_2026-09-20.md` · `p-track-pools-read-B_2026-09-17.md`
- **MEASURE (3):** `p-compaction-remeasure-B_2026-09-19.md` · `p-d103-census-B_2026-09-21.md` · `p-d132-union-B_2026-09-24.md`
- **RESEARCH (3):** `p-battery-run2-draft-B_2026-09-19.md` · `p-r5-carrier-B_2026-09-21.md` · `p-suggestion-switch-B_2026-09-19.md`
- **AMBIGUOUS (4):** `p-contamination-B_2026-09-20.md` [MEASURE/BUILD] · `p-d097-install1-B_2026-09-21.md` [MEASURE/READ] · `p-d115-board-B_2026-09-22.md` [MEASURE/RESEARCH] · `p-vicsek-phi-B_2026-09-20.md` [BUILD/MEASURE]

### Pane C — 78 files
- **BUILD (42):** `p-ask002-feeds-C_2026-09-20.md` · `p-cancel-overtake-C_2026-09-20.md` · `p-carry-dir-flush-C_2026-09-19.md` · `p-carry-exclude-C_2026-09-16.md` · `p-d096-boottail-C_2026-09-21.md` · `p-d098-dataseam-C_2026-09-21.md` · `p-d102-jevask-C_2026-09-21.md` · `p-d103-shadow-C_2026-09-21.md` · `p-d104-runner-C_2026-09-21.md` · `p-d106-union-C_2026-09-22.md` · `p-d108-runnertest-C_2026-09-22.md` · `p-d112-tripcheck-C_2026-09-22.md` · `p-d114-unionbuild-C_2026-09-22.md` · `p-d123-report-C_2026-09-23.md` · `p-d124-config-C_2026-09-23.md` · `p-d131-compact-C_2026-09-24.md` · `p-d132-ch4-C_2026-09-24.md` · `p-d133-ch4-ask007-C_2026-09-24.md` · `p-flush-before-done-C_2026-09-19.md` · `p-intake-window-C_2026-09-20.md` · `p-l062-rc3-C_2026-09-21.md` · `p-l063-rc4-C_2026-09-21.md` · `p-l064-plantrow-C_2026-09-21.md` · `p-l071-fold-C_2026-09-22.md` · `p-l071-unionwrite-C_2026-09-22.md` · `p-l072-statesource-C_2026-09-22.md` · `p-l074-capretain-C_2026-09-22.md` · `p-l075-nine-C_2026-09-22.md` · `p-l076-seven-C_2026-09-22.md` · `p-l079-shadowskip-C_2026-09-22.md` · `p-l080-tworeds-C_2026-09-22.md` · `p-l085-scribe-C_2026-09-23.md` · `p-l088-provenance-C_2026-09-23.md` · `p-l089-fixture-C_2026-09-23.md` · `p-l091-solid-C_2026-09-23.md` · `p-l098-heavylock-C_2026-09-23.md` · `p-l104-keepwarm-C_2026-09-23.md` · `p-l114-config-C_2026-09-23.md` · `p-lap-row-twocause-C_2026-09-22.md` · `p-r6-forget-C_2026-09-21.md` · `p-race-and-bytes-C_2026-09-19.md` · `p-stale-lap-C_2026-09-18.md`
- **READ (10):** `p-ask003-digest-C_2026-09-20.md` · `p-compaction-read-C_2026-09-19.md` · `p-composition-readerC_2026-09-22.md` · `p-diverged-read-C_2026-09-14.md` · `p-diverged-read2-C_2026-09-14.md` · `p-l102-rederive-C_2026-09-23.md` · `p-l108-reader-C_2026-09-23.md` · `p-l113-reader-C_2026-09-23.md` · `p-return-leg-replay-C_2026-09-19.md` · `p-stick-preflight-C_2026-09-14.md`
- **MEASURE (5):** `p-battery-cost-C_2026-09-16.md` · `p-d110-measure-C_2026-09-22.md` · `p-l110-jevr1-C_2026-09-23.md` · `p-nul-census-C_2026-09-16.md` · `p-t3-run-C_2026-09-19.md`
- **RESEARCH (7):** `p-blind-rows-C_2026-09-16.md` · `p-d111-solid-C_2026-09-22.md` · `p-diversity-c0-C_2026-09-15.md` · `p-l066-unplaced-C_2026-09-21.md` · `p-l069-ledger-C_2026-09-21.md` · `p-stick-fault-cause-C_2026-09-19.md` · `p-t3-readiness-C_2026-09-19.md`
- **AMBIGUOUS (14):** `p-d121-relaybuild-C_2026-09-22.md` [BUILD/READ] · `p-d122-pilot-C_2026-09-22.md` [READ/RESEARCH] · `p-deference-unit-C_2026-09-20.md` [BUILD/MEASURE] · `p-delivery-census-C_2026-09-19.md` [MEASURE/RESEARCH] · `p-diversity-c1-C_2026-09-15.md` [READ/MEASURE] · `p-l060-pilot-C_2026-09-21.md` [READ/BUILD] · `p-l061-reg44-C_2026-09-21.md` [READ/BUILD] · `p-l070-union-C_2026-09-21.md` [MEASURE/BUILD] · `p-l082-manual-C_2026-09-22.md` [BUILD/READ] · `p-l083-audit-C_2026-09-23.md` [READ/MEASURE] · `p-l087-writesite-C_2026-09-23.md` [MEASURE/BUILD] · `p-order-parameter-C_2026-09-20.md` [MEASURE/BUILD] · `p-r1-tailcarry-exit-C_2026-09-21.md` [READ/BUILD] · `p-return-leg-C_2026-09-16.md` [MEASURE/RESEARCH]

### Pane E — 66 files
- **BUILD (38):** `p-ask-unreadable-E_2026-09-20.md` · `p-blind-write-E_2026-09-16.md` · `p-boundary-fixes-E_2026-09-16.md` · `p-composer-tristate-E_2026-09-19.md` · `p-d098-keepwarm-E_2026-09-21.md` · `p-d100-vantagecell-E_2026-09-21.md` · `p-d105-readme-E_2026-09-22.md` · `p-d123-flags-readme-E_2026-09-23.md` · `p-d125-readme-E_2026-09-23.md` · `p-d130-blind-E_2026-09-24.md` · `p-d132-settings-E_2026-09-24.md` · `p-d133-tj1v2-E_2026-09-24.md` · `p-d134-leave-E_2026-09-24.md` · `p-diverged-E_2026-09-14.md` · `p-l062-rc1-E_2026-09-21.md` · `p-l063-writebaseline-E_2026-09-21.md` · `p-l064-trailergate-E_2026-09-21.md` · `p-l065-statesync-E_2026-09-21.md` · `p-l067-keepwarm-E_2026-09-21.md` · `p-l069-envname-E_2026-09-21.md` · `p-l070-keepwarm-activated-E_2026-09-21.md` · `p-l083-carriers-E_2026-09-23.md` · `p-l085-carrier3-E_2026-09-23.md` · `p-l096-roster-E_2026-09-23.md` · `p-l100-usage-E_2026-09-23.md` · `p-l106-schema-E_2026-09-23.md` · `p-l112-variants-E_2026-09-23.md` · `p-l114-flags-E_2026-09-23.md` · `p-launch-ghost-E_2026-09-18.md` · `p-launch-pull-E_2026-09-16.md` · `p-leave-E_2026-09-14.md` · `p-r4-actors-E_2026-09-21.md` · `p-ready-not-the-child-E_2026-09-19.md` · `p-scorer-into-repo-E_2026-09-19.md` · `p-scorer-portable-E_2026-09-19.md` · `p-shuffle-guard-E_2026-09-20.md` · `p-stick-build-E_2026-09-14.md` · `step0-phase-E_2026-09-15.md`
- **READ (8):** `p-battery-run2-attack-E_2026-09-19.md` · `p-composition-readerE_2026-09-22.md` · `p-d116-blindread-E_2026-09-22.md` · `p-diversity-c1-E_2026-09-15.md` · `p-harness-audit-E_2026-09-20.md` · `p-l060-consent-E_2026-09-21.md` · `p-third-run-audit-E_2026-09-20.md` · `p-third-run-read-E_2026-09-20.md`
- **MEASURE (2):** `p-harness-E_2026-09-15.md` · `p-l113-variants-E_2026-09-23.md`
- **RESEARCH (14):** `p-battery-blind-E_2026-09-16.md` · `p-d097-l3reg-E_2026-09-21.md` · `p-d109-tj1v2-E_2026-09-22.md` · `p-d113-unionlaunch-E_2026-09-22.md` · `p-d115-narrowing-E_2026-09-22.md` · `p-d120-relayinj-E_2026-09-22.md` · `p-diversity-c0-E_2026-09-15.md` · `p-l080-tj1-E_2026-09-22.md` · `p-l081-amend-E_2026-09-22.md` · `p-l089-solid-E_2026-09-23.md` · `p-l090-sheets-E_2026-09-23.md` · `p-l107-composition-E_2026-09-23.md` · `p-no-console-E_2026-09-14.md` · `p-stick-E_2026-09-14.md`
- **AMBIGUOUS (4):** `p-delivery-ack-E_2026-09-16.md` [MEASURE/RESEARCH] · `p-l082-readme-E_2026-09-22.md` [BUILD/READ] · `p-l094-carriers-E_2026-09-23.md` [BUILD/READ] · `p-step1-m-E_2026-09-19.md` [MEASURE/BUILD]
