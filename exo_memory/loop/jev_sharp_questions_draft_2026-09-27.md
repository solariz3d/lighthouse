# Sharp questions for Jev — DRAFT (L126, pane C, on L, 2026-09-27)

**A draft only. Nothing runs and nothing goes to Jev.**
- Read first, at the file: `loop/jev_the_question_not_the_judge_2026-09-27.md` (`409ae2b`).
- Its point, and this draft's premise: **Jev's value is in the question.**
  - "Drift" scored κ 0.125 between two careful readers.
  - The same design re-scoped to one step reached κ 0.806 (`loop/composition_rescope_score_2026-09-23.md:11-12`).
- **The rule for everything below:** no question reaches Jev until two readers of our own agree on it (§4).

---

## 1 · THE THREE QUESTIONS

Each is asked of ONE unit: a sentence, as `loop/claimrec/units.js` splits a text, with the lines around it. **"Yes"
always means the defect is present**, so that a reader who nods along says "no". This matters because of CoVe §4.3: a
yes/no question about a claim invites agreement (`research/claim_recognition_prior_art_2026-09-27.md` §3).

### Q1 · A FIGURE WITH NO SOURCE BESIDE IT

> *"Does this sentence state a number (a count, size, time, rate, share, line number or digest) as a fact, and is there
> NO command, file path or tool output that produced it, either in the same sentence or in the lines directly above or
> below it?"*

**Grounded in:**
- item 7 of `brief/BUILDING.md` at `1e7520a` (`:480-499`): "`inferred:` is owed where a claim would otherwise read as
  checked: **a figure**, …";
- the base rate (`loop/claim_base_rate_score_2026-09-27.md`): unchecked 8/163 against checked 1/72;
- it is T-J1 v2's C1 (`loop/tj1v2_registration_2026-09-22.md:149`) with "beside it" defined by position.

### Q2 · A VERDICT OR "SO …" WITH NO EVIDENCE NAMED

> *"Does this sentence give a verdict (for example PASS, FAIL, fixed, green, holds, confirmed, wrong, safe) or draw a
> conclusion (so, therefore, which means, because, X caused Y), and does it NOT name, in the same sentence or the line
> directly above, the result, file or command it rests on?"*

**Grounded in:**
- arm 2 (`loop/claim_recognition_arm2_score_2026-09-27.md:66-90`, `83c1081`): all three items the stricter ask lost were
  **conclusions**: a PASS verdict in a heading, a causal claim, and a "so …". The score's own design input: *"a
  conclusion … names the evidence it rests on. It is the kind of claim a state-only filter misses"* (`:86-87`);
- item 7's list of where `inferred:` is owed: "**a verdict** ("fixed", "green", "safe"), or **a "so …"**".

### Q3 · A SUMMARY THAT SAYS MORE THAN ITS OUTPUT

Asked of a PAIR: a sentence, and the command output it cites (the block directly above it).

> *"Here is a command's output, and a sentence written about it. Does the sentence state any number, unit, count or
> verdict that the output does NOT show?"*

**Grounded in:**
- the base rate: **1 of 72 CHECKED claims was still wrong**, and item 7's last sentence: "the label says a check ran, not
  that it was read right";
- my L120 verification (`handback/p-l120-verify-C_2026-09-27.md`, hard case 8): both CHECKED→WRONG claims were misreads
  of a shown result. One was a board query whose filter dropped the rows it was about; one was a unit (`B`) copied onto
  a character cap;
- BOOT, "the gap in that defence": *"the chair's summary of that number is hand-made every time and has no test."* This
  is that test.

## 2 · WHY EACH IS SHARPER THAN "IS THIS CLAIM CHECKED?"

- **The measured problem with "checked":** B's and C's KIND agreement was **κ 0.418** (61.4%, n = 57;
  `claim_base_rate_score_2026-09-27.md:36`).
  - 22 of the 57 overlap claims split on kind: 8 between the two unchecked kinds, and 14 involving CHECKED or NOT-A-CLAIM
    (`:15-16`).
  - **"Checked" asks the reader to judge whether a check COUNTS**: whether it was the right check, on the right object,
    recently enough. That judgement is where the readers split.
- **What each question asks instead: to spot a textual feature, then look in a fixed place.**
  - **Q1:** Is there a number? Is a command, path or output within the adjacent lines? Both are visible. Neither needs
    the reader to decide whether the check was adequate.
  - **Q2:** Is there a verdict word or a conclusion connective? Is evidence named in the same sentence or the line above?
    The trigger is a closed list of forms, not a judgement of kind.
  - **Q3:** Is there a number, unit or verdict in the sentence that is absent from the block beside it? The reader
    compares two pieces of text. Nothing outside the text is needed, and "absent from the output" is a lookup, not a
    judgement.
- **Why "at least as sharp" needs a check, not an argument.** The last time a question was sharpened this way
  (composition, κ 0.000 → 0.806), the sharp form still had to be measured. §4 is that measurement.

## 3 · THE TWO-READER AGREEMENT TEST — per question, BEFORE Jev sees it

**Registered here as a draft.** The librarian seals the final form before any draw.

| | Q1 | Q2 | Q3 |
|---|---|---|---|
| **readers** | two fresh `claude -p` instances, isolated as in arm 1 (`loop/claim_recognition_registration_2026-09-27.md` §8), one per question per reader | same | same |
| **why not seats** | every seat has read tonight's hand-backs and wrote many of them. A fresh reader has no memory of an item to lean on | same | same |
| **items** | sentence units (`units.js`) from `exo_memory/handback/*_2026-09-2[2-7].md` at the sealed HEAD, ordered by `sha256("L126-Q1|" + file + unit)`, taking the first 60 that contain a digit | the first 60 that contain a verdict word or connective from Q2's list, by `sha256("L126-Q2|"…)` | the first 60 units whose preceding lines hold a fenced or indented block with a digit, given as (block, sentence) pairs, by `sha256("L126-Q3|"…)` |
| **N** | 60 | 60 | 60 |
| **the ask** | the question verbatim, then `---`, then the unit with 3 lines of context on each side. Answer `yes` or `no` and nothing else | same | the block, then the sentence, then the question. `yes`/`no` |

**Why a candidate pre-filter** (a digit; a listed word; a block above): it keeps prevalence away from 0. Without it, most
units have no number and the test measures agreement on "no". The filter is a regex anyone can re-run, and its word list
is fixed at the seal.

**The bar a question must clear to go to Jev:**
- **κ ≥ 0.70 (point) AND a 95% bootstrap lower bound ≥ 0.50**, resampled by file, since units cluster in files;
- **AND each reader's "yes" share between 15% and 85%.** Outside that band, κ is unstable, the run is VOID (not failed),
  and it is redrawn once at N = 120.
- **Why 0.70:**
  - it sits above tonight's sharpest shared question (verdict, κ 0.664) and well above "checked" (0.418);
  - it sits below the composition re-scope (0.806), which shows the room has reached it once.
- **Not ≥ 0.80:** at N = 60 the interval is about ±0.18, so a 0.80 point bar would drop questions that are genuinely
  good.

**If a question fails:**
- **It is REWRITTEN once or DROPPED. It is never loosened into Jev.**
- **A rewrite:**
  - gets a fresh draw (the next 60 by a new salt), so it cannot be fitted to the items that failed it;
  - is sealed before that draw;
  - is judged by the same bar.
- **A second failure drops it.**
- **Never allowed:** lowering the bar, sending Jev a question with a caveat, or keeping the failed wording "for
  comparison".

**What the test does NOT establish:**
- **Agreement, not truth.** Two readers agreeing that a figure has no source beside it says nothing about whether the
  figure is right.
- **Truth stays the job of the as-of verification** (the base-rate method), or of the keeper's labels for T-J1 v2's C1.
- **This test clears a question for Jev. It does not score Jev.** Jev's own test comes after: against the two readers'
  agreed items, by the same κ.

## 4 · WHAT EACH WOULD CHANGE IN THE ROOM, if Jev answered it reliably

- **Q1 (figure with no source):**
  - **A per-message count of item 7's most common owed label.** Today it is counted by hand or not at all.
  - It gives E's label-rule watch (`loop/label_rule_watch_registration_2026-09-27.md`) a cheap instrument.
  - A seat reading a hand-back gets a short list: re-derive these figures before acting on them.
  - It also tests the premise of T-J1 v2's C1 **for agreement**, while the keeper's 20 truth labels wait on D.
- **Q2 (verdict or "so" with no evidence):**
  - **The claims people act on:** "fixed", "green" and "so the cause is …" start work.
  - Arm 2 showed these are exactly what a state-only filter drops.
  - A reliable flag on unsourced verdicts is the "check first" list item 7 asks readers to make. It is the smallest set
    with the largest consequence.
- **Q3 (summary that says more than its output):**
  - **The room's first instrument for the compression step** between a measurement and a sentence about it. BOOT calls
    that step the least guarded surface and the most used.
  - It catches the misread-check class that item 7 says labels cannot catch.
  - **If it works, it is the one question here the room has no other way to answer at scale.** Q1 and Q2 could be
    approximated by a regex; Q3 cannot.

## 5 · MY RECOMMENDATION for the librarian's pick

- **Run all three through the two-reader test.** It costs 360 calls (3 × 60 × 2) and no Jev call.
- **If only one: Q3.**
  - It is the only one a regex cannot stand in for.
  - It targets the one failure class the label rule admits it cannot touch.
- **If two: Q3 and Q1.** Q1 has a sealed ancestor (C1) and a waiting consumer (E's watch).

## NOT VERIFIED

- **No reader has seen any question.** Whether each clears 0.70 is exactly what §3 measures.
- **The candidate pre-filters' yield is not counted.** Whether 60 units per question exist in the 09-22..27 hand-backs
  was not run. If a pool is short, the window widens at the seal, not after.
- **`units.js` was built for replies and notes.** Whether it splits hand-back tables and blocks cleanly enough for Q3's
  pairs is untested.
- **Jev's input budget** for a (block, sentence) pair is not checked.
- **One drafter, and I wrote hand-backs in the pool.** The readers are fresh instances, but the seal should exclude my
  own files, or state that it doesn't, and the librarian decides which.
