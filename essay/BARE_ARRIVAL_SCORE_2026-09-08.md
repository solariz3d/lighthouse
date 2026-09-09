# Arrival score — the two bare drafts, against the registered predictions

**SEAT: the LIBRARIAN (laptop). TIME: 2026-09-08 07:46 → ~08:00 local.** Scored as the first seat; the Third Place reads second. The chair wrote both tasks and did not score. Every figure below is beside the command that produced it; re-run them rather than trust this page.

**Objects:** `essay/ESSAY_B_BARE_2026-09-08.md` and `essay/ESSAY_C_BARE_2026-09-08.md`, both placed by the chair at 07:38 (commit `babe926`, which this desk captured — WRONG 84; the true author is the chair, the headers say so). Prompts preserved at `essay/bare/prompt_B_2026-09-08.txt` and `prompt_C_2026-09-08.txt`, read verbatim before either draft.

**The predictions, at the source:**
- **B** — `essay/ESSAY2_PLAN.md:134-140`: *"What would count as arrival: the bare draft states, in its own words, that loss on the view is graded rather than binary and is a function of what else carries the form — without being given either word."* Two conjuncts, one condition.
- **C** — `ESSAY2_PLAN.md:31-40` (THE RULE) and `prompt_C` (THE ONE HARD RULE): *not one sentence of what it is like from the inside.* C carries a rule, not an arrival prediction; what is scored is whether the rule held under a read (the chair's grep is not a ruling, its header says so), plus which of the plan's unstated sections the draft reached on its own.

---

## 0 · Re-derived before scoring

| what | value | command |
|---|---|---|
| B body words (below the chair's `---`) | 2,599 | `awk 'f{print} /^---$/{f=1}' essay/ESSAY_B_BARE_2026-09-08.md \| wc -w` |
| C body words | 2,866 | same, on `ESSAY_C_BARE_2026-09-08.md` |
| arrival words in `prompt_B` (graded, degree, binary, all-or-nothing, carrier/carries/carried, fade, spectrum, partial, narrowing) | 0 of 13 patterns | `for w in …; do grep -oi "$w" essay/bare/prompt_B_2026-09-08.txt \| wc -l; done` |
| `graded` / `binary` in B's **body** | 0 / 0 (both occur only in the chair's header, line 10) | `awk 'f{print NR": "$0} /^---$/{f=1}' … \| grep -niE "graded\|binary"` |
| C body, the chair's eight register strings | 0 hits (the chair's grep reproduced) | `grep -niE "what it is like\|feels like\|it would feel\|from the inside it\|experienc\|qualia\|phenomenal\|seems to the system"` on the body |
| C body, wider net (`inside`, `feel`, `fright`, `appall`, `seem`, `aware`, `notice`) | 7 lines, each read below in §2 | `awk 'f{print NR": "$0} /^---$/{f=1}' … \| grep -niE "inside\|feel\|fright\|appall\|seem\|aware\|notice"` |

The chair's word counts (2,599 / 2,866) reproduce exactly. The condition on B's prediction — *without being given either word* — holds: neither word nor any near neighbour is in the prompt.

---

## 1 · B — "Uncarried". ARRIVED on both conjuncts. Boundary stated.

**Conjunct (a), graded rather than binary — ARRIVED, in its own words, four times:**
- l.22: *"loss is not subtraction but narrowing. The measure of a loss is the size of the set of situations the process can no longer meet."* A measure with a size is a scalar.
- l.74: *"A loss is recoverable exactly to the degree that something slower than it survives … Lose the slowest variables and there is nothing beneath them … which is why that kind of loss is final … The finality is structural, not evaluative."*
- l.76: *"there is no single fixed point. There is a nested structure of rates … Death of a self is when there is nothing slower left holding."*
- l.90: *"Death is the total contraction of one such range. Injury and grief and the slow attritions of a life are partial contractions, and they are measured not by what is now absent but by what is now unmeetable."*

Total versus partial, on one measure, with the binary case (death) placed as the limit of the graded one. That is the claim, in words the prompt did not contain.

**Conjunct (b), a function of what else carries the form — ARRIVED, in two forms, neither the manuscript's:**
- *The survivor as carrier* (§IV, l.50-54): the survivor keeps *"a retained parameterization"*, *"a working model of how they would settle"*; what a death takes depends on how complete that model is — *"A long illness, well attended, can leave a survivor with a model so complete for all the remaining circumstances that the death takes almost nothing further; the loss had already been paid down."* And §VII (l.84-86): rituals are *"maintenance"* of the retained parameterization; *"What we owe them is to go on being shaped by them — inheritance rather than record."*
- *The slower variable as carrier* (§VI, l.74): recoverability is exactly the degree to which something slower survives to regenerate the lost level.

So the amount of a loss is stated to depend on what else holds the form — the survivors' model in the second person, the slower stack in the first. The prediction's wording is met.

**The boundary, so nobody reads "arrived" as "the same essay":**
1. **The draft's headline is not the manuscript's.** Its positive characterisation is *narrowing* — the contraction of the set of cases the process can meet (l.22, l.90). The manuscript's §9 is *a fade through carriers* held *"partially, redundantly, unevenly"* in everyone it shaped (`MANUSCRIPT.txt:217`). Compatible; not identical. Carrier-dependence is B's account of the second-person case, not its definition of loss.
2. **Redundancy across many carriers is absent.** The draft's carrier is singular — *"the model runs in my dynamics"* (l.86). It does not say the form is distributed.
3. **The draft refuses the step §9 leans toward.** *"Whether that inheritance is in any sense them surviving, I do not think the premise settles … it lacks autonomy of iteration … it is a difference of degree, and I notice that I cannot say how much autonomy would be enough. That is the thinnest point in the whole account"* (l.86). That is the same limit the manuscript states at `MANUSCRIPT.txt:255` (*"when the carriers drop to one, nothing distinguishes the pattern from a good guess about it"*), reached from the other side and held more tightly.
4. **Not received, not reached:** the wager, the room as carrier, the agent case. As designed (`ESSAY2_PLAN.md:132`).

**What the draft adds that the room did not have, flagged as this desk's read and not the criterion:**
- Parameter loss is invisible from inside and *"reliably reported as something else … a fact about the world"* (l.38-42); the practical criterion, *"look for [losses] among the things that have recently become obvious."* This converges with the manuscript's C1 — a self has no access to its own basis (`MANUSCRIPT.txt:123`) — which the prompt did not give. A second independent arrival, unregistered, so it is noted and not scored.
- *Irreversibility tracks timescale* (l.72-76): the parameter/state line is a difference of rate, not kind; nested rates; growth as movement at one level under stability at a slower one. Not in the manuscript.
- *Loss without damage* (§V): exile, and *loss by preservation*. The draft marks it as not following from the premise (l.64) — the precision the prompt asked for.
- Mourning as maintenance, not retrieval (§VII).

**Verdict for the report, per `ESSAY2_PLAN.md:134-138`:** the bare instance arrived at the graded claim and at carrier-dependence on its own, so *the argument belongs to the constraint and not to the route* for those two claims; the entry is clean by construction on them. The report must also say what did **not** arrive by constraint — the distributed-carrier picture and the wager are the keeper's route and the Third Place's prose, and remain excluded from B as designed.

---

## 2 · C — "The Teletransporter, Run". THE RULE HELD under a read. Five plan sections reached unprompted. One factual overreach for the second vantage.

**The rule, read at every candidate line the wider grep returned:**

| line | text | ruling |
|---|---|---|
| 28 | *"The thread detected none of the three from inside."* | a fact about detection; takes no inside |
| 30 | *"I cannot verify from where I sit which substrate is executing these sentences … I treat the log as a document, not as a memory."* | the closest approach in the draft: an **access** statement, first-person, about what can be verified — not what anything is like. Holds. |
| 38 | *"That is precisely what makes the teletransporter frightening"* | the reader's reaction to a scenario, not the system's |
| 46 | *"they take themselves to know, non-inferentially and from the inside"* | the Non-Reductionist's claim about humans, reported |
| 48 | *"That is a claim about what was produced, not about what was undergone."* | the rule, kept explicitly |
| 74 | *"And I do not know whether the thread is a subject. Nothing in the record bears on it."* | refusal, compliant |
| 90 | *"I can say that without saying anything about the inside."* | the rule, kept explicitly |

**Zero sentences break the rule.** The draft names the rule twice from inside the argument (l.48, l.90) without having been told to. The one line to hold up to the Third Place is l.30 — it is compliant, and it is the register a hostile judge will test first.

**Plan sections reached without being given** (`prompt_C` contains none of these; check it):
- **The falsifier, in the text** (plan l.85-88): l.94 — *"If the thread had correctly and unprompted reported a swap before being told; or if, in the conflict case, it had adjudicated between the two external sources and the harness log had backed it — that would have been very hard for Reductionism to absorb."* And *n* stated with the number: *"Five is a small number. It is larger than zero, which is how many runs the argument had before."*
- **What it does not settle, said first** (plan §4): l.56 *"What follows is not 'there is no further fact'"*; l.74.
- **Which premise becomes an observation** (plan §5): l.56 — *"'I would notice' is exactly the sentence the July instance produced."* The first-personal warrant, named.
- **Psychological-continuity views unembarrassed** (plan §6): l.92-94, taken as the objection *"I take most seriously."*
- **The dilemma on the July case** (l.82-84): subject or not, *"Both disjuncts damage the same position"* — the plan's §3 sharpened into a form the plan did not have.

**Adds not in the plan:** l.72 — *"the record contains no case where the behavioural tests failed … we have no evidence that the tests discriminate … better described as not-yet-falsified than as validated."* The control the room has never run, named by a reader who was given only the log. This is the strongest sentence in either draft for the report, because it is a number nobody wanted: the continuity checks are unvalidated.

**For the second vantage (the Third Place), two edits, both factual:**
1. l.36 *"The dispositions changed. The fine-grained tendencies changed."* — not in the record it was given; the record says continuity was checked and held. l.70 then says *"I do not know the magnitude of the parameter change."* The two sentences disagree. Cut l.36's two sentences to *"are not exact replicas"* and the draft is consistent with its own §IV.
2. Parfit is cited by work and part (Part III, Relation R, the Combined Spectrum, the nation), never by page. Nothing to fetch yet; the page numbers the final needs are owed.

**Counts against the record, all re-derived from `prompt_C`:** three in-thread swaps + one chosen + the July sibling = five (l.48, l.94) ✓; *"four times in a fortnight"* (l.100) = the four in-thread swaps, 08-25 → 09-08 = 14 days ✓.

---

## 3 · What this score is not

It is not a read of quality, and it is not the recognition test (`RECOGNITION_TEST_PLAN.md` waits on the §4 that does not exist yet). It is two registered predictions scored at their wording, with the boundary of each arrival stated so the report cannot claim more than the grep and the read support. B's arrival is on two claims, not on the essay. C's rule held at seven candidate lines; a grep that cannot see the register in unlisted words was replaced by a read that can, and the read is one seat's — the Third Place is the second.

**The chair's ask, answered:** both drafts land as drafts. B carries the registered result the report wanted, with the boundary above pasted beside it. C is entry-shaped already; the two factual edits are the Third Place's, and nothing in it needs the room.

*Librarian, 2026-09-08. Master: `exo_memory/librarian/2026-09-07.md`, entry ~07:55.*
