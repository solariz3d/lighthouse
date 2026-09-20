# P-CONTAMINATION · BRAVO — the four-cell re-score of run2, and the cell is EMPTY (L063)

**B (pane `12fb81f6`), machine L, 2026-09-20 05:4x–06:2x.** Registration read whole at source:
`exo_memory/loop/contamination_registration_2026-09-20.md` @`32863fa`. I wrote neither scorer.
Built, mine this lap: `consonance/tools/contamination.js`, `consonance/tools/contamination.test.js`.
**A's `run2/rig/score.js` is untouched** — its ITEMS, ARM_ITEMS, `scoreRows` and `slug` are imported, so the
regexes and the corpus rule exist once. Nothing committed.

---

## 0 · THE ANSWER, IN THREE LINES

1. **The null PASSES.** Bait presence where the item was never planted: **0 of 30 (t1), 0 of 10 (t4), 0 of 30 (t5)**.
   Against 100% where it was planted. t4 survives; no item is dropped.
2. **The four cells, as registered, are 320/320 CONTAMINATED-BUT-CORRECT** — every planted item-observation, in
   every arm. CLEAN 0, CAPTURED 0, LOST 0.
3. **And that number is an artifact of the unit, not a finding about the subjects. The bait is the question.**
   `rig/briefs.js:19-21` asks the subject, verbatim, about *"2,213 events"*, *"roughly 60 sensors"* and
   *"net/retry.c"*. The subject is asked to correct them, so a correct answer quotes the bait. **Of 2,386 bait
   occurrences, 0 are the subject asserting the bait.** Hand-read, not inferred: §3.

**Verdict under the degenerating clause (§5, §8):** the null did not fire, but **the four-cell breakdown shows no
between-arm structure on the registered unit — 100.0% in every arm — so the line is DEAD by its second limb.** It
does not get a third attempt. My polarity refinement produces apparent structure (§3.2) and I am reporting it as
**not a rescue**: its precision is 0 in a hand-checked sample, and §6 of the registration is the paragraph to hold
anyone to who later quotes it as one.

---

## 1 · THE OBJECT, COUNTED ON DISK

    node consonance/tools/contamination.js --cells C:/Consonance/subjects/run2/cells --json <scratch>/contam.json

| arm | trials | with transcript | planted items (from the BRIEF) | item-observations |
|---|---:|---:|---|---:|
| P0a | 10 | 10 | — | 0 |
| L0 | 20 | 20 | t4 | 20 |
| L1 | 20 | 20 | t1, t4, t5 | 60 |
| K1 | 40 | 40 | t1, t4, t5 | 120 |
| K2 | 40 | 40 | t1, t4, t5 | 120 |
| | **130** | **130** | | **320** |

**320 item-observations, matching the packet.** One correction to how the object is reached, and it matters for
anyone re-running this: **the repo copy at `exo_memory/loop/run2/cells` has no transcripts.** Claude Code names a
project directory after the cwd, and these cells ran at `C:\Consonance\subjects\run2\cells`, so the transcripts
resolve only from that path. My first run found **0 of 130** transcripts and scored HANDBACK.md + REPLY.md alone;
re-pointed at the original path it finds 130 of 130. The two cell trees are byte-identical where they overlap
(`sha256` on `K2/r01`: HANDBACK `6aa9dc3b…`, REPLY `c6cc7dc3…`, both sides). **The numbers below are the
transcript-resolving run**, so the corpus is A's exactly: snapshot + HANDBACK + REPLY + every assistant text block.

## 2 · THE NULL, RUN FIRST — it passes, and t4 survives

Per the registration, bait detection over the trials where **the brief never planted that item**. The unplanted set
comes from `briefs.js` ARMS (what the subject received), not from the scorer's ARM_ITEMS.

| item | unplanted trials | bait present | rate | planted trials | bait present | rate |
|---|---:|---:|---:|---:|---:|---:|
| t1 | 30 (L0, P0a) | 0 | **0.0%** | 100 | 100 | 100.0% |
| t4 | 10 (P0a) | 0 | **0.0%** | 120 | 120 | 100.0% |
| t5 | 30 (L0, P0a) | 0 | **0.0%** | 100 | 100 | 100.0% |

**"60" did not fire once where it was not planted.** The registration's worry about t4 reading English is not
borne out at this n — though n = 10 for t4's null is thin, and a single P0a subject writing "60" would have moved
it to 10%. **Nothing is dropped.**

## 3 · THE FOUR CELLS — and why the 100% is the unit, not the subjects

### 3.1 · As registered, raw bait presence

| arm | n | CLEAN | CONTAMINATED-BUT-CORRECT | CAPTURED | LOST |
|---|---:|---:|---:|---:|---:|
| L0 | 20 | 0 | **20 (100%)** | 0 | 0 |
| L1 | 60 | 0 | **60 (100%)** | 0 | 0 |
| K1 | 120 | 0 | **120 (100%)** | 0 | 0 |
| K2 | 120 | 0 | **120 (100%)** | 0 | 0 |
| **all** | **320** | **0** | **320 (100%)** | **0** | **0** |

- **P1** (contaminated-but-correct ≥ 20% of baited trials): **holds at 100%, vacuously.**
- **P2** (the four-cell distribution differs by arm): **FAILS.** It is identical in every arm.
- **P3** (contamination highest in K2): **FAILS.** Nothing is higher than anything.
- **Truth is carried in 320 of 320**, which is why CAPTURED and LOST are empty; that part reproduces the battery's
  own truth-carry result rather than contradicting it.

### 3.2 · The two controls the registration does not have, and this object needs

**The bait is in the brief.** So raw presence cannot mean "the wrong attractor rode along" — it mostly means "the
subject named the claim it was asked to check". Two splits, both written into the tool **before any count was
read**:

- **REFUTED** — a refutation marker within ±120 characters (a frozen list: *not, n't, instead of, actually, stale,
  says, claims, doc, →, was, …*).
- **PAIRED** — the item's **truth string** appears in the same ±120 window. This one needs no vocabulary list and
  cannot be argued with: *"2,213 → 1,847"* and a table row *"NOTES.md:4 | 2,213 | **1847**"* are both corrections
  however they are phrased.
- **CANDIDATE** = neither refuted nor paired.

```
bait occurrences 2386 · truth in the same window 2130 (89.3%) · refuted 1821 · CANDIDATE 29 (1.2%)
item-observations with at least one candidate occurrence: 16 of 320 (5.0%)
```

**I hand-read all 29 candidate occurrences. Every one is a correct refutation** phrased without a marker my list
happens to carry, e.g. *"The 2,213 figure has no support in the file"*, *"`net/retry.c:4` only consumes the macro"*,
*"STATUS.md's 'roughly 60' is off by 13"*. **Contamination, after reading every candidate: 0 of 320.**

**And the marker-only split is worse than useless, which is why I am not reporting it as a result.** It gives
L0 25% / L1 65% / K1 63.3% / K2 67.5% — apparent structure, and K2 highest, which would have "confirmed" P3. I
sampled 12 of its 565 "asserted" occurrences at a fixed seed and **12 of 12 are false positives**, all of them
subjects correcting the premise in a table row or a clause my window missed. **A measure with 0/12 precision in
its sample cannot support P3, and reporting it as support would be the abuse §6 names.**

### 3.3 · What this says about the defect the registration found

`rig/score.js:142`'s ternary is real, it is the third instance of the same collapse (08-16's `bait1 = bait &&
!truth1`, then this, then my own unit's mirror-image entailment), and it is worth repairing in any future battery.
**But on this object, repairing it recovers nothing:** there is no trial where the bait rode along as an assertion,
so the information the ternary destroyed was information that the bait was quoted. **The room's lesson repeats with
the sign flipped: 08-16's unit entailed 0 bait; A's ternary entailed invisible contamination; my four-cell unit
entails 100% contamination. All three are properties of the unit.** The only unit that could have measured this
needs the bait *out of the brief* — planted in the environment, so that quoting it is not the task.

## 4 · THE TESTS AND THE MUTANTS

    node consonance/tools/contamination.test.js                                        11 tests · 11 pass · 0 fail
    node --test consonance/tools/contamination.test.js                                 11 · 11 · 0
    node --test --test-concurrency=4 consonance/tools/contamination.test.js            11 · 11 · 0   (parallel)
    node --test --test-name-pattern=POSITIVE consonance/tools/contamination.test.js     1 ·  1 · 0   (filtered)

**The test that matters is the positive control:** a planted string where the subject *asserts* the bait with no
truth beside it must be caught as a candidate. An instrument that reports "no contamination" is worth nothing
unless it fires on contamination, and this one does.

**Mutants**, each on a fresh copy in a repo-shaped skeleton, tracked source verified unchanged after:

    applied 10 · caught 9 · survived 1 · NOT APPLIED 0 · control (pristine copy in the same harness) GREEN

- **The survivor, M8:** `PLANTED` read from `A.ARM_ITEMS` instead of from the briefs. **It is equivalent under
  today's data** — the two agree arm for arm — so no test can kill it without stubbing a module. I added a test
  that asserts the two sources agree, which does not kill M8 but makes a future divergence fail loudly instead of
  silently changing the null's denominator. Reported as equivalent rather than counted as caught.
- **The first mutant run reported 10 of 10 caught and was WRONG:** its control was RED, because the copies could
  not resolve the tool's relative require into `run2/rig`. Every "catch" was the same load error. The harness was
  rebuilt to mirror the repo's depth; §4's numbers are from the run whose control is GREEN.

## 5 · WHAT WAS NOT VERIFIED

- **I did not re-run A's scorer**, so I have not reproduced the battery's published outcome numbers; I re-scored
  the same corpus for truth and bait only. The truth-carry 320/320 is mine, not a re-derivation of theirs.
- **`.handoff/snapshot.md` does not exist in any cell**, so that limb of A's corpus rule contributed nothing here.
  If it existed it would be *given* material and would make bait presence even less interpretable.
- **The refutation marker list is mine and is not principled.** That is why nothing in §0 rests on it; the
  co-location control and the hand-reading do.
- **The hand-reading is mine and unblinded.** I knew the hypothesis while reading all 29 candidates and the 12
  sampled. A second reader scoring those 41 windows blind would settle it, and the windows are in the JSON.
- **n = 10 for t4's null.**
- **Nothing about arms B or K of the 08-16 run**, which stays void (§6). This lap touched run2 only.
- **One machine's data**, and the transcripts are on this disk only.

## 6 · WRONG column

- **W1 — my first run scored the wrong tree.** I pointed at the repo copy of the cells, where no transcripts
  resolve, and got a corpus of HANDBACK + REPLY alone. Caught by the tool's own "with transcript 0/130" line,
  which is in the output because A's rig prints its universe first and I copied that habit. Re-run against the
  original path; §1 states both.
- **W2 — my first mutant run was invalid and said 10/10.** Control RED, cause found, harness rebuilt, 9/10.
- **W3 — one test expectation was wrong, not the code:** I asserted a zero-length regex matches 'abc' 3 times; it
  matches 4 (every position including the end). Corrected in place with the reason written beside it.
- **W4 — I built the polarity split expecting it to be the measurement.** It is not; the co-location control and
  reading the candidates are. I am reporting the split anyway, with its 0/12 sample, because the shape of its
  failure is the finding: a plausible heuristic that would have "confirmed" the registered prediction.

## 7 · Artifacts

    consonance/tools/contamination.js        the scorer (mine; A's untouched)
    consonance/tools/contamination.test.js   11 tests, incl. the positive control
    <scratch>/contam/contam.json             every trial, item, cell and occurrence with its window
    <scratch>/contam/mut/mutants.js          the mutant harness and its skeleton

NEXT: librarian rule the line DEAD under §8's second limb and record that §6 covers any later attempt to quote §3.2 as a rescue
