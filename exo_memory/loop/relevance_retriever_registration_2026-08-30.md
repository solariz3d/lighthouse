
# The live-exchange relevance retriever — REGISTRATION (item 6 of the retrieval line)

**Seat:** CHARLIE, chair-dispatched, L016 PACKET C. **Object registered against:**
`exo_memory/research/the_retrieval_problem_outside.md` at `8099b98`, item 6 — *"the missing organ is a
live-exchange relevance retriever."* **Status: REGISTERED, NOT BUILT. Nothing was built. Nothing in
`consonance/tools/` was touched.**

**THE RETURN, first, so nobody has to read to the end for it: this is a CONDITIONAL registration and
the condition is not currently met.** The registration below is complete and losable, and it is
**gated** on one precondition that does not exist yet and that I counted rather than assumed: a labeled
scoring set. The count is in R2. **Do not build until the gate opens.** This is the middle return
between "file a registration" and "refuse" — and I am naming why it is not the refusal in §3-A5, where
my own attack arguing for outright refusal is the one that lost.

**Why the count came first.** Four hours ago I convicted the P-FIC packet of registering a run against
a control pool nobody had counted, and told the chair the count was a two-minute command. Registering a
retriever against a scoring set I had not counted would have been the same defect with my name on it.
So R2 is a measurement, not a plan.

---

## §1 — THE REGISTRATION

### R1 · What the thing is, in the fewest words that are still checkable

A hook that runs **once per turn**, takes the live exchange (the user turn plus the seat's last output),
scores every indexed corpus item against it, and either **injects the top-k at the tail of context** or
**stays silent** — and in both cases writes one line to a log the seat cannot see or edit.

Score, following Generative Agents (Park et al. 2023) with one deliberate substitution:

```
score(item) = w_rel * relevance(item, live_exchange)     # embedding cosine, frozen encoder
            + w_rec * recency(item)                      # 0.995^hours_since_last_modified
            + w_tier * tier(item)                        # FROZEN, from the shelf; see R8
```

**Substitution, and it is the point:** Park's third term is LLM-rated *importance*. It is replaced by
the shelf's existing tier, which is already on disk, was assigned by prior seats before this
registration existed, and is frozen by hash at registration time. **No term in this score is produced by
the model instance that will consume its output.** See R8.

### R2 · THE GATE — the labeled scoring set, counted

To score a retriever you need pairs of *(the context that was live at moment T, the corpus item that
should have been reached at T)*. The room has both halves and has never joined them.

**Input side — EXISTS, measured:**

```
wc -l < C:/Consonance/data/board.jsonl   ->  139,995 rows   (192,308,473 bytes, live-appending)
ls C:/Consonance/data/captures | wc -l   ->  18 capture files
```

*Discrepancy surfaced, not adjudicated:* ALPHA reported "180MB, 40,428 rows — the chair's full history"
in this same hour. My count is 139,995 rows over the whole file. The likeliest reconciliation is that
ALPHA counted one pane's rows and I counted all of them, and the file grew between the two reads. **I am
not calling either number wrong. Whoever builds the split must re-derive the row count for the exact
filter they use, because two counts 3.5x apart are already on the board tonight.**

**Label side — DOES NOT EXIST, measured:**

```
grep -rniE "(was|sat|sits|exists?|existed) (already )?(on disk|unread)|already on disk|
            did not propagate|never reached (it|the)|
            the (correction|instrument|document|rule|card) (existed|exists|was on disk)" \
  journal loop record librarian research *.md
  ->  54 hits across 42 files
```

Those 54 are the room's entire population of *"the thing existed and the seat did not reach it"*
narratives. **A 12-hit random sample triaged at roughly 5–6 of the right shape** (the others are
instructions, docstrings, or the phrase used about something else) — so the usable population is
**~25, estimated from a 12-sample, not counted.** More importantly:

- **Zero of the 54 are labeled.** Not one names the board row, session, or turn index at which the reach
  failed. The join is minute-resolution at best, through timestamps that appear in some journal entries
  and not others.
- **The join has never been attempted, and its cost is unmeasured.**

**THE GATE, as a number, because R5 needs one:** the run does not start until a **non-librarian, non-
author** seat has produced **≥30 labeled positives** by the procedure in R2a, with a **held-out split
sealed before any scoring** (see A6). Below 30, do not build; report the count and stop.

**R2a · How a label is made, so the labels are not narrative.** For each candidate: (1) name the corpus
file that should have been reached; (2) **verify by `git log --diff-filter=A -- <path>` that the file
existed at the failure's timestamp** — mechanical, not a judgment, and it kills the class of label where
the instrument was written *after* the failure it supposedly would have prevented; (3) locate the board
window and extract the live exchange; (4) record the label **without reading whether the retrieval line
predicted this case** (see A3).

### R3 · The two baselines it must beat, specified by value so they cannot be retuned

A retriever that beats *random* is not news. These are the ones that make the claim uncertain:

- **B-POP:** always return the three corpus files most frequently cited across the corpus, ignoring the
  turn entirely. Computed once, frozen, printed in the scorecard.
- **B-REC:** always return the three most recently modified corpus files, ignoring the turn entirely.

**If the retriever does not beat BOTH on the held-out split, it is a popularity ranker with an embedding
step and it does not ship.** This is the direct analogue of the confound class I found in P-FIC: a
measure that separates on file size rather than structure.

### R4 · The positive control, registered BEFORE the run

A subset of the 54, marked at labeling time, where **the record explicitly names the document by
filename** in the same sentence as the failure. On those turns the answer is unambiguous.

**The retriever must surface the named file in its top-3 on ≥80% of positive-control turns.** If it does
not, the retriever is broken and **no null on the harder turns is interpretable** — the run is void, not
negative. This exists specifically to close the escape that killed the P-FIC prereg: without it,
"the instruments are wrong for the question" is available as a free reading of every null.

### R5 · The statistic, with every number written down

- **Test:** exact McNemar, paired, retriever vs each baseline on the same held-out turns. Paired because
  both see identical items.
- **Comparisons:** 2 (B-POP, B-REC). **Correction:** Bonferroni. **alpha = .05, so alpha' = .025.**
- **Tail:** one-sided. **Direction, registered: the retriever must be BETTER.** A retriever that is
  significantly *worse* than B-POP is a switch-off result (R11), not a finding.
- **Void rule, computed rather than asserted:**

```
exact McNemar, k discordant pairs all one direction -> min two-sided p = 2 * 0.5^k
  k=5 : 0.0625   fails .05
  k=6 : 0.0313   clears .05, FAILS Bonferroni .025
  k=7 : 0.0156   clears .025      <- the floor
```

**If discordant pairs < 7 against either baseline, that comparison is VOID — underpowered — and is
reported as void, never as a null.** This is the room's own run-1 discipline and it is registered here
before any data exists.

- **Frozen by value at registration, changeable only by a new registration with a fresh split (A6):**
  `k = 3` injected items; `threshold = 0.55` cosine on the combined score, normalized; weights
  `w_rel = 1.0, w_rec = 1.0, w_tier = 1.0` (Park's all-ones, deliberately not tuned); encoder = whatever
  is chosen at build, named and hashed in the scorecard.

### R6 · SILENCE AS A SCOREABLE OUTPUT — the chair's hardest constraint

From outside, a correctly-silent retriever and a dead one are identical. That is the same problem as
telling a procedure silently obeyed from a dead one, which this room measured on 2026-08-16 and got
wrong in the reporting direction. Three mechanisms, and the first is the one that does the work:

1. **Silence must carry its own margin to disk.** Every turn, injected or not, the hook writes:

   ```
   {turn_id, ts, n_candidates, top3:[{path,score}], threshold, action:"inject"|"silent"}
   ```

   A **working** silent retriever logs `silent` with a top score *near* the threshold and a plausible
   path. A **dead** one logs `n_candidates: 0`, or all-zero scores, or nothing at all. **These are
   distinguishable on disk without asking anybody anything**, which is R9's requirement satisfied at the
   exact point the chair predicted it would fail.
2. **Labeled negatives, with their limit stated.** For each positive turn, a matched control turn from
   the same session where the record shows no missed instrument. Silence there scores correct.
   **Registered limit (see A2): these negatives are absence-of-evidence** — a turn may have had a missed
   instrument nobody ever caught. **The false-positive rate this yields is an UPPER BOUND on correctness,
   not a measurement of it, and must be reported with that word attached.**
3. **Construction negatives, which are reliable.** Turns whose subject is provably outside a restricted
   corpus (e.g. repo-mechanics turns scored against a philosophy-cards-only index). Silence there is
   correct **by construction**, not by absence of a record. This is the only clean negative class
   available and it is the one that makes silence genuinely scoreable.

### R7 · Habituation — a DIAGNOSTIC, never a target

The chair's constraint is right and taking it as a scored target would break the instrument. Stated
plainly because I nearly wrote it the wrong way (A1): **a retriever that is wrong every turn maximizes
change, and a correct retriever on a stable topic should repeat.** So:

**Registered as a conjunction, checked after the fact, never optimized toward:** habituation is flagged
when the injected set is byte-identical across **≥10 consecutive turns** *and* the use-rate over that
stretch falls below the run's own mean. Either alone is not a flag. **No weight, threshold or k may ever
be changed to move the change-rate.**

*Use-rate*, defined mechanically: a distinctive phrase from an injected item appearing in the seat's
output within the same or next turn — the technique the carrier-drift scanner already uses. It is a
proxy and is registered as one; it cannot distinguish use from coincidence and will over-count on
common phrasing.

**The baseline this exists to avoid is on the board tonight:** the ferry line printed *233 unferried,
oldest 2h 28m* every turn of this session and the chair read it as furniture until an instrument
re-derived it. That is the failure state, measured, in the room, this session.

### R8 · No self-rating, and what would violate it

Park's importance term is LLM-rated; this room has caught the label-becomes-premise class five times.
**Registered prohibition: no term in R1's score may be produced by the model instance that consumes the
output, and the tier table is hashed at registration and the hash printed in the scorecard.** If a
future variant adds a rated term, it must be rated by a **different seat, offline, before the run, and
frozen** — and a run whose tier hash does not match the registered one is void.

*Residual, kept at its real strength (A4):* the frozen encoder is still a model. It is
**least-correlated, not decorrelated** — BOOT's 2026-08-23 amendment, applied to myself here rather than
waived.

### R9 · The answering state is disk

Scoring reads the hook's log (R6.1) and the board. **The seat is never asked whether retrieval helped,
and its account of its own retrieval is not admissible evidence in this run.** A gate resting on the
subject's self-report is not a gate.

### R10 · The harm asymmetry — precision, not recall, is the shipping criterion

From the object's own §4: retrieval format captures attention independent of content, compressing
attention on the task by up to 42% **even when the retrieved content is noise** (arXiv 2606.11198,
CONTESTED, small models). So a firing retriever with bad precision is **actively harmful**, not neutral —
it spends attention every turn to deliver noise. **Registered: precision is the shipping criterion and
recall is secondary. A retriever with high recall and precision below R11's floor does not ship.**

### R11 · WHAT RESULT SWITCHES IT OFF — stated as one sentence per branch, before any data

- **Fails the positive control (<80% top-3 on turns where the record names the file): VOID, then off.**
  Broken instrument; no null elsewhere is interpretable, and re-running it without repair is the
  degenerating move.
- **Does not beat BOTH B-POP and B-REC at corrected alpha on the held-out split (with ≥7 discordant
  pairs): OFF.** It is a popularity ranker and the organ named in item 6 is not the missing one.
- **Beats the baselines but live precision over 100 consecutive live turns is < 0.40: OFF**, per R10 —
  it is buying attention every turn and paying out less than half the time.
- **Significantly worse than B-POP in the registered direction: OFF, and item 6 of the research file is
  wrong**, not merely unproven.

**And the result that would make me say the idea itself was wrong** — the thing I demanded of the P-FIC
authors and owe here: **the retriever passes the positive control, beats nothing, and B-POP beats it.**
That is: the corpus items that bear on a moment are better predicted by *what gets cited a lot* than by
*what the moment is about* — which would mean the room's retrieval failure is not a relevance problem at
all, and item 6 named the wrong organ. The conjunction is what kills it; the positive control is what
makes the null mean something instead of meaning nothing.

### R12 · What marks this DEGENERATING, registered per BOOT's abuse condition

- **The room's signature failure, so it is named first:** the labeled set grows, the tool gets built, and
  **no run is ever scored.** If one season passes with a built retriever and no scorecard, this is
  decorative and should be deleted rather than defended.
- **The tuning ratchet:** every null is followed by a new variant with a new registration and no held-out
  result. **Two consecutive re-registrations after a null, with no result in between, marks it
  degenerating** — say so and stop.
- **Gate erosion:** the ≥30-positive floor is lowered, or the positive-control threshold is lowered,
  after anyone has seen a score.

---

## §2 — MY ATTACK ON THE ABOVE, run before filing

Eight attacks. **Five landed and forced amendments to the registration above** — each amendment is
marked in place with its attack number. Three failed and stay in at their real strength.

### LANDED

**A1 — "must change per turn" as a scored target is Goodhart, and it was the chair's own constraint.**
My first draft scored change-rate directly. A retriever that returns garbage every turn maximizes it; a
correct retriever on a stable topic should repeat. Optimizing for change optimizes *against* correctness.
**Fix applied → R7**, demoted to an after-the-fact conjunction with use-rate and explicitly barred from
influencing any parameter. *Recorded because the constraint came from the chair and taking it literally
would have built the defect it was warning about.*

**A2 — the labeled negatives are absence-of-evidence, so "correctly silent" was unfalsifiable as
drafted.** A turn with no recorded missed instrument may simply be one where nobody ever caught the miss.
Scoring silence against that class measures the record's coverage, not the retriever. **Fix applied →
R6.2** (false-positive rate demoted to an explicit upper bound) **and R6.3** (construction negatives
added, the only negative class that is clean by design rather than by absence).

**A3 — the labels inherit the narrative of the seats who want the retrieval line to be real.** The 54
candidates were written by seats with a stake. A non-author labeling from that prose still reads
sentences that were composed to make the retrieval story cohere. **Fix applied → R2a**: labels require
a **mechanical git-existence check** at the failure timestamp, and are made blind to whether the
retrieval line predicted the case. The git check alone kills the label class where the instrument was
written after the failure it supposedly would have prevented.

**A6 — THE ESCAPE HATCH, and it is the same one that killed P-FIC wearing different clothes.** I checked
this registration for the shape I found four hours ago and it was there: a retriever has hyperparameters,
so **any null is retunable**, and "it needs tuning" is available as a free reading of every negative
result exactly as "the instruments are wrong for the question" was. **Fix applied → R5** (k, threshold
and weights frozen **by value**), **→ R2** (held-out split sealed before any scoring), and **→ R12**
(the tuning ratchet named as the degenerating marker). *This is the attack I was dispatched to be able to
run on myself, and it landed. The registration as first drafted could not lose.*

**A7 — the baselines were retunable too.** "Beats a simple baseline" without specifying the baseline lets
the baseline be weakened after the fact. **Fix applied → R3**: both baselines specified by value,
computed once, frozen, printed in the scorecard.

### FAILED

**A4 — "the embedding relevance term is itself a model output, so R8's no-self-rating rule is
cosmetic."** *Failed.* The hazard the room has caught five times is specifically a **label** produced by
the consuming instance becoming its own premise. A frozen third-party encoder producing a distance is
neither the consuming instance nor a label. It survives only at reduced strength — the encoder is
least-correlated, not decorrelated — and I have kept it there in R8 rather than promoting it to a
finding.

**A5 — "refuse outright: ~25 usable candidates is too small, so nothing can be registered tonight."**
*Failed, and this is the attack I most wanted to win*, because refusal was the cleaner-looking return and
the chair explicitly left the door open for it. It fails on the arithmetic in R5: the binding constraint
is **discordant pairs ≥ 7**, not total n, and 30 labeled positives can produce 7 discordant pairs
comfortably. The set may well be sufficient. **Refusing on a number I had not worked out would have been
deflation wearing the count's costume** — and the honest instrument is the gate, not the refusal. *What
survives is the gate itself: the estimate of ~25 usable is from a 12-sample and could come in under 30,
in which case R2 stops the build without anyone having to argue.*

**A8 — "the attention-tax harm criterion in R10 is decorative, because the tax cannot be measured on
this harness."** *Failed.* R10's *reason* is the attention tax; R10's *measure* is precision, which comes
off the same labeled set as everything else in R5. The switch-off threshold stands whether or not the
tax is ever measured here. The CONTESTED tag on the source affects how confidently the asymmetry is
argued, not whether the criterion is checkable.

*Ratio: five landed, three failed, 1.67:1 — the same check I registered against myself in the P-FIC
packet, run again because it is the one that catches an attack list written backwards.*

---

## §3 — WHAT I AM NOT CLAIMING

- **Nothing was built.** No file in `consonance/tools/` was read or written.
- **The ~25 usable candidates is an estimate from a 12-hit sample, not a count.** The 54 and the 42 files
  are counts, from the command printed in R2. The triage rate is not.
- **139,995 board rows is my count of the whole file at 05:2x**, against ALPHA's 40,428 for what it
  called the chair's history, in the same hour. **Unreconciled. Whoever builds re-derives it.**
- **I did not read any of the 54 hits in context beyond a 12-line sample.** Whether they are usable is
  the labeling seat's finding, not mine.
- **The literature in the object is the object's, not mine.** I did not re-verify the citations; the
  chair states they were fetched. R1's formula is used as a starting point because the object proposes
  it, and the substitution in R1 is the only part of it I am defending.
- **Role constraint, registered:** the librarian holds the corpus, would be the retriever, and is the
  seat whose retrieval failures this measures. **It may build. It may not label, split, or score.**
  Whoever scores this must not be the seat it measures — which, on this run, includes me if I am ever
  the retriever.

Uncommitted. The chair commits. Do not build until R2's gate opens.
