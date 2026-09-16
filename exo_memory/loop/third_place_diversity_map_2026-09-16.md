# The Third Place's diversity guide, mapped against the record as of 2026-09-16 07:0x — what is done, what is measurable now, what is still new

*Librarian (the lineage, on L), written during thesis run 1's window at the keeper's word ("We could start to incorporate the third places guide for potential solutions to diversity collapse and retrieval"). This file was NOT sent to any seat; it is a map on disk. Source: `exo_memory/third_place/DIVERSITY_COLLAPSE_INSIGHTS_2026-09-14.md` (§C instruments, §D design changes, §E registered tests, §F tensions) and the hold `loop/third_place_diversity_hold_2026-09-14.md` (the librarian's 09-14 prior-art read, not repeated here). Every row: the guide's item → what the record did with it since → what remains.*

## §C · Instruments, ranked by the guide

| # | the guide | the record since 09-14 | remains |
|---|---|---|---|
| C1 | **Anchor similarity** — cosine of each hand-back to the brief; falsifier: briefed and unbriefed panes show the same distribution | BUILT AS A REGISTRATION: `loop/anchor_similarity_registration_DRAFT_2026-09-15.md` (encoder gte-base q8, six-phase 1,800-token windows, S40 strip, R8b polarity, R8c threshold from the room's own P2 rows, K6 blindness); step 0 landed (`dev/diversity/{s40-strip,redact,phase-window}.js`); first cosines (C, 09-15 09:27): A 0.7200 · B-read 0.6880 · E 0.6401, controls 0.8575 / 0.4521; WRONG 109 filed against the "content uptake" over-read | DRAFT, not REGISTERED: the scorer and its inputs live only on D's scratchpads (`librarian/2026-09-16.md` 01:02); commit them first; then step 1's m; then the run with fresh scorers. The paper's 0.627/0.441 is STRUCK as a threshold for this encoder (draft :80) |
| C2 | **Vendi over hand-backs** — effective number of distinct findings, within-brief | NOT BUILT. Nearest: `agreement-spread.js` (abandoned gauges, `diversity{,2,3}_preregistration.md`); tonight's L059–L060 gave the counter-case for free: three panes at 8 of 8 on one brief is Vendi ≈ 1 by construction when the task is at ceiling | A candidate for RUN 2's per-task report: Vendi over the four hand-backs of one task, beside the score; needs the encoder committed (C1's precondition) |
| C3 | **Order parameter live over the board** (mean cosine to the running centroid) | NOT BUILT. The board's own measured defect stands in the way: 58% replay (`board-audit.js:4-9`) and truncated dispatch rows (tonight: 9 of 9 DELIVERED rows end in "…"); the unit must be the transcripts, not the board | After C1's encoder is in the repo; window = one lap |
| C4 | **Critique-ratio judge** (same-weights judge, trust the trend) | NOT BUILT. The room already has the polarity measure R8b (claims list, AFFIRMS/CONTRADICTS/SILENT, two blind scorers, agreement ≥ 0.70) which is the human-scored form of this; E's 09-16 finding: labels are blindable, authorship is not | Fold into R8b rather than a second judge; the guess-rate gate decides whether the trend can be read |
| C5 | **A lift with nothing on the car** — a pane changing its answer after a chair message with no new evidence | NOT BUILT, and tonight produced the instrument's precondition: E's P-DELIVERY-ACK design stamps every send and its arrival (`handback/p-delivery-ack-E_2026-09-16.md` §4), which is exactly "the message and the change are both stamped" | Build after the ack lands: pair each chair message to a pane with the pane's next hand-back diff |

## §D · Design changes with evidence

| the guide | the record since | remains |
|---|---|---|
| **One non-Claude pane in the verifier set** (the paper's largest effect) | E's 09-15 feasibility (`p-diversity-c0-E`): only Claude models reachable from the harness; the keeper's 07:55 09-14 word "maybe we make pane A fable 5.1 instead of opus 5 … next time" held in the hold file; the room has never run a mixed-model committee | The one lever the room has not pulled at all. Arm (c) of §E1 below. Cost: a settings change per seat; the room's brief on "different model is enrichment, not a gate" (BOOT) is the sentence the paper contradicts |
| **Flat expert peers, no chair-assigned lanes, for generation tasks** | Tonight's C measurement (`p-battery-cost-C`): dispatch was indistinguishable from round-robin while the dossier was cited (p = 0.344), so the room has in effect been flat without deciding to be; the battery (L059) exists to make lanes measured rather than habitual | Decide it, don't drift into it: RUN 2's design should state which tasks are lane-free by rule |
| **Brief the purpose, not the answer** | UNTESTED; C1 is the instrument (§F first tension) | A RUN 2 arm: purpose-brief vs answer-brief on one task, scored by C1 |
| **Refuse, don't remind** (K2) | CONFIRMED TWICE TONIGHT in the room's own mechanics: the stall detector printed a lap older than 10 min 345 times in one seat's prompts with nobody acting (`librarian/2026-09-16.md` 05:27); the keeper's fix is the NEXT trailer in the hand-off itself, and B's design makes the verbs refuse without it (`p-text-rules-B` §4) | The trailer gate is the guide's principle applied to the loop; lands a lap after the text |
| **Personas are cheap and weak; spend on inputs** | Tonight's C: a pane costs the same used or not; the intake is the lever (`pane_archetypes_idea_2026-09-16.md`); E: authorship survives redaction through self-citation and length rank, not style | Specialize by INPUT (shelf, files, model), which is what the archetype idea already says; not by role text |

## §E · Registered tests

| the guide | status | note |
|---|---|---|
| E1 `agreement-spread`, three arms (same model flat / same model chair-briefed / three models flat), prediction (c) > (a) > (b) with (a)−(b) ≥ 20% of (a) | NOT RUN. Arm (c) needs the mixed-model committee (§D1). The hold's 09-14 read named the one change the test must make before it runs (the hold file, "The one thing the registered test must change") | The keeper's "next time" on pane A's model is the door to arm (c) |
| E2 One carrier vs three panes (registered 09-12) | NOT RUN | Independent of the encoder; cheap; a candidate for the next D night |
| E3 Anchor similarity discriminates (briefed vs unbriefed ≥ 0.1) | SUPERSEDED IN FORM by the draft: the 0.1 was struck as the paper's number on another encoder (B's 09-15 read); the threshold is now R8c, derived from the room's own P2 rows | Runs with C1 |

## §F · Open tensions — kept open, with what tonight added

- **What-it's-for vs anchoring:** still open; C1 is the instrument; a purpose-brief arm is the cheapest RUN 2 addition.
- **Second model as vantage vs echo:** tonight's E finding sharpens the prescription — a scorer must not hold the repo (E §4.4: "its blindness would be honour, which is not an instrument"); the guide's "hand it the least-certain sentence" is the same discipline for a second model.
- **Harmony ≠ agreement:** tonight's three voids are a datum for it — three panes at 8 of 8 is agreement that measures nothing; the kept difference the guide wants showed up only where the task was hard enough (none tonight). RUN 2 must load.

## What is new here, and what is not

Nothing above is a new instrument; the map's add is the ORDER: (1) commit the C1 artifacts (D-bound), (2) register C1 properly, (3) one mixed-model arm (§D1, E1c) — the only lever untouched, (4) then C2/C3/C5 in that order, each behind C1's encoder. The retrieval half of the keeper's sentence is not in this guide (the hold file says so); it lives in `research/the_retrieval_problem_outside.md` and the L019–L021 retriever line, and is a separate map.
