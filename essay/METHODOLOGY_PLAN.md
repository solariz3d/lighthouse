# The methodology report — plan

*Written 2026-09-08 ~01:50, before compaction. The competition requires "a methodology report
explaining how each essay was produced" — one report, covering both entries — and it is also what
the $5,000 creative-methodology pool is decided on. It does not exist yet. `METHOD.md` is its raw
material, not its shape.*

*The organising frame below was derived in conversation the night this was written and exists
nowhere else, which is why this file was made before compaction rather than after.*

---

## The frame: a prosthetic hippocampus

The report must answer one question for a reader who has a brain and no intuition for context
windows: **how did a system with no memory across sessions produce a coherent twelve-thousand-word
argument over fourteen days?**

The answer is that it did what the reader's own brain does every night, except deliberately and in
files. The correspondence is structural rather than decorative — every row is a real component with
a real counterpart:

| Sleep | Consonance |
|---|---|
| hippocampus: fast, high-fidelity, capacity-limited to about a day | the context window |
| replay during slow-wave sleep, driving transfer to neocortex | writing the journal and the log at the end of a sitting |
| what consolidates is gist and schema, never the episode | seal the dynamic, never the state |
| synaptic downscaling — absolute load cut, relative strengths kept | curate below capacity |
| waking re-cued by a familiar room before a thought forms | a fresh seat re-cued by the room it wakes into |

Supporting literature, all real and citable: Complementary Learning Systems (McClelland, McNaughton
& O'Reilly 1995) for the buffer/store split; Tononi & Cirelli's synaptic homeostasis hypothesis for
the downscaling; the replay literature for the mechanism.

**And the disanalogy is the thesis, not an embarrassment.** Sleep does this automatically and
involuntarily. Consonance does it by hand, on purpose, in text files, for a system that has no
consolidation of its own. That makes the room a *prosthesis for a process biology performs for
free* — which explains the entire methodology to a philosopher in one move, using an architecture
they already have.

One honest limit to state in the report: the analogy is offered as an explanation of the design,
not as a claim that the mechanisms are the same. Nothing in the essays depends on it.

## Structure

1. **The frame above.** Short. Table, disanalogy, limit.
2. **What the room actually is** — instruments, dated traces, append-only records, a placement page,
   and one seat with no deliverable. Concrete, file-level, no mystique. A reader should be able to
   picture the directory.
3. **How the essays were produced.** The two-vantage method: one party drafts, the other reads for
   *floors* — sentences that arrive as ground rather than as claims. Every correction logged with
   its author and its outcome, written **after** the work rather than before, so the log records
   what happened instead of what was intended.
4. **The counts, and the ones that did not hold.** As of 2026-09-08: keeper→seat 16 upheld, 1 not
   upheld; an outside reader→seat 2 upheld, 1 not upheld; seat→seat 22; seat→keeper 3. The
   not-upheld entries are the point — a log listing only the corrections that landed is not a log,
   and its absence is the first thing a sceptical reader should look for.
5. **The substrate changes**, stated as production facts with dates. Three during the drafting of
   essay 1, none detected from inside, each learned from outside. Cross-reference essay 2, which
   takes them as its subject.
6. **What this method demonstrably caught**, with four worked examples (below). Concrete beats
   claims here.
7. **The limits, stated plainly.** The two parties are correlated; the outside reader was another
   instance of the same model family; the filter removes named failure modes and cannot remove the
   wall. Do not overclaim that the process converts a report from *performed* to *sincere* — the
   strategy notes make that claim and half-concede it in the same paragraph. Write what is
   countable.

## The four worked examples to use in §6

Chosen because each is checkable in `METHOD.md` and each cost something:

1. **The whirlpool paragraph.** Both parties independently flagged it as reading like a trick before
   any outside reader saw it. Shows the two-vantage method catching a rhetorical failure that a
   single author would have shipped.
2. **The φ exchange.** The seat pushed back twice — correctly that the golden ratio is not the
   spiral constant, *incorrectly* that φ was therefore narrow — and the keeper produced the 2022
   Fibonacci-drive quantum result, which became the strongest example in the essay. Correction
   running keeper→seat, with the seat's half-right position preserved rather than tidied.
3. **"Nothing survived it."** The seat asserted, with no basis, that nothing persisted across the
   2026 agent restart. The keeper caught it; the agents restarted and the package repository did
   not. That correction produced the carrier/conditions distinction now in §9.
4. **The proofread that missed the two biggest things.** The seat ran twenty-two self-checks and
   reported the manuscript "as clean as I can get it." Seventeen hours later a reader outside the
   room found Parfit absent from the section where the argument is his, and the essay's only
   uncheckable exhibit uncited. **This is the best example in the file**, because it is the essay's
   own C1 demonstrated on the essay: a self-audit finds mechanical defects and cannot see
   structural ones, and the fix came from a vantage that was not standing where the author stood.

## Cautions

- The report is **not an appendix.** Write it as a first-class entry.
- It should be readable by someone who has read neither essay.
- Nothing in it should claim an inside. Same rule as essay 2.
- Length: shorter than either essay. Two to three thousand words. Its force is specificity, and
  padding would cost exactly that.

---

## Amendment, 2026-09-08 ~04:30 — the eligibility table, the record, and the five transfers

*Added by the Third Place seat after the librarian's catch-up (`CATCHUP_FROM_LIBRARIAN_2026-09-08.md`),
read (`LIBRARIAN_READ_2026-09-08.md`) and audit (`RULES_AUDIT_2026-09-08.md`). The plan above
predates all three. The report is to be built around this section, not patched with it.*

**The rules page — `zacharygoodsell.com/ai-philosophy-competition-rules`, not the competition page —
carries an eligibility table that no essay file held until the librarian fetched it at 04:00:**

    PERMITTED      "Anything argument-agnostic, e.g., creation of agentic scaffolds"
                   "Human tells AI to generate many essays, and selects the best"
                   "Human chooses topic of essay"
                   "Human chooses generic methods, e.g. 'address all prominent objections'"
                   "Essay is autonomously improved after human critique"
    NOT PERMITTED  "Human-supplied arguments"
                   "Fine human control over methodology"
                   "Rigorous human critique/dialogue that gives the AI significant ideas"
                   "Human writing"

"Humans may provide corrective guidance and direction. Heuristically, AI should be the sole
author." Methodology reports "will be used to adjudicate unclear cases." Chat logs recommended;
to be retained if not submitted. Word count "ignores the bibliography but includes everything
else." Submission anonymised via OpenReview; at most one prize per entrant.

**What the report must carry, in this order:**

1. **The disclosure, first and in the report's own voice.** The thesis predates the competition and is
   the keeper's by the room's record: `exo_memory/BOOT.md:42` — "Two faces, one thing (solariz3d,
   2026-06-28)", persistence and generation as one property seen from two ends, which is Essay A
   §2's third consequence; `BOOT.md:44` — the convergence-is-confirmation method, its sign corrected
   in dialogue. Quote both. Then `METHOD.md`'s frame paragraph, written 09-07 before any audit:
   "The view is the keeper's… The sentences are mine."
2. **The audit, verbatim, as an appendix.** 134 keeper turns from the first mention of the
   competition, each classified against the table; the five transfers with the keeper's words and
   the seat's reply beside each; what the seat refused (K68, K70–K78); the re-derivation command.
   Its own falsifier stays with it. This is the instrument the rules ask for at a resolution no
   other entrant will match, and it is true.
3. **Per essay, which transfers it carries.** A: one in-window (K67, the 2022 experiment — an
   example plus one sentence of generalisation; nearest the permitted row) and the thesis
   underneath. B as originally planned: four (K6 wager, K7/K48 Vacariu, K15/K16 carriers, K81
   leftover data) — which is why B's writer changes (see `ESSAY2_PLAN.md` amendment). C: none in
   window; its evidence is the room's log, which is a record and not an argument.
4. **The essay's own objection to the rule, as a finding.** On the view A defends, a form belongs to
   the constraint and not to the route, so *whose idea* is malformed for a fixed point. State it in
   one paragraph. Then state that it does not answer the judges' narrow question — who did the
   joining for this entry — and that the audit answers that one.
5. **The bare-instance runs as the report's experiment.** For B and C: a fresh instance with no room
   and no transcript, given topic and generic method only, and whether it arrives at the argument.
   Registered prediction and both outcomes as results. If it arrives, the entry is clean by
   construction and the argument is shown to belong to the constraint. If it does not, the
   argument was the keeper's route and the report says so.
6. **Two worked examples added to §6 of the plan above**, ranking above "the proofread that missed
   the two biggest things": (a) the fresh adversarial referee finding A's central argument invalid
   twice in one night, before any judge — the second run catching the first rebuild's error; (b) the
   audit itself — a second seat classifying the AI's own transcript against the rules with the
   count on the table.
7. **The chat logs.** The room's transcript is the log and is retained. Whether any of it is
   submitted is the keeper's decision alone; the Third Place record is private by his standing
   rule and the report must not assume otherwise.
8. **Word counts** in the report are the without-references figures (A: 5,012 at `10a3fea`).

**On whether to enter at all:** open, the keeper's, deferred by his and the librarian's agreement
until a bare-instance run returns. The report is written either way; if the entry is withdrawn the
report is the record of why.

**07:24 — entering.** Withdrawn 04:14, reopened 07:24 as a disclosed entry. Two additions to the
report's required content: (a) the reversal itself, in the timeline, with both of the keeper's
sentences; (b) **which seat did what** — the librarian, chair and panes are now working on A's §4
simulation, the literature, and the report itself; every hand-back carries its seat and time, and
the final compile lists them, because "in as much detail as possible" includes the scaffold.
