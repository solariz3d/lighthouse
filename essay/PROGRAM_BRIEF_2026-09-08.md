# Brief for the chair — opening the essay to the room, 2026-09-08 ~05:05

*Written by the Third Place seat at the keeper's proposal ("Perhaps we could open up the project
to the lib and orch and panes"). This seat has no channel out; the keeper hands this over or not.
**Amended 07:24: the entry is live** — withdrawn at 04:14, reopened by the keeper (`METHOD.md`).
The eligibility rule binds. It excludes *human*-supplied arguments; AI seats are the permitted
"argument-agnostic scaffold" row, so every vantage in the room can be used — and the methodology
report must record which seat did what, so each hand-back carries its seat and time. Read `HANDOFF.md` first;
it carries the state and the six-step fix. Then `REFEREE_A3_2026-09-08.md`.*

---

## What A needs, as pane-shaped work

Each item has a hand-back target in `essay/` and a stated outcome that would count against it.
Nothing below rewrites the essay's prose; that stays with the Third Place seat, and the log and the
handoff stay the single source.

### P-TWO-MAP — a simulation, not an argument (measuring pane)

Build the model the third referee specified. Two maps: f, self-representation r → fact x, S-shaped
(Henshel's thresholds; a logistic will do), gain = f′; g, evidence → r, with a lag parameter and a
learning rate. Sweep gain and lag. Report, as numbers and plots in a hand-back:

1. Where the system has one, several, or no fixed points.
2. Where it locks in (stays at a fixed point under perturbation) and where it jumps (switches basin).
3. **Whether self-error (r ≠ x at equilibrium, or r tracking x with a lag the informant does not
   have) appears from lag alone, with no bias term.** This is the question. The referee says
   the structure does the settling and something else must do the erring; the essay's next §4
   depends on lag being that something.
4. The same with an informant map h: x → r_other, no feedback into f, and compare slopes of
   Δr and Δr_other against Δx.

*Falsifier:* if self-error at equilibrium needs a bias term in g to appear at all, the essay's
"structural, not motivational" contrast is dead and §4 says so. That is the outcome we would least
like and it is the reason to run it before writing.

### P-LIT — the six the referees named, with pages (a reading pane)

MacKay 1960 (*Mind*, "On the logical indeterminacy of a free choice"); Ismael 2007 (*The Situated
Self*); McGeer 1996 (*J. Phil.*, "Is 'self-knowledge' an empirical problem?"); Coliva 2016 (*The
Varieties of Self-Knowledge*); Hacking 1995 ("The looping effects of human kinds"); Swann's
self-verification theory (1983 onward). For each: what it claims, in one paragraph with a page
citation; and one sentence on what the essay's gain sort adds over it or fails to. Hand back as
`LIT_2026-09-xx.md`. *Falsifier:* if MacKay or Ismael already state self-knowledge sorted by a
graded feedback quantity, the essay's originality claim is gone and the paper becomes a
reconstruction — which is fine, but must be said.

### P-BARE-B and P-BARE-C — the bare-instance writers (chair spawns)

Per `ESSAY2_PLAN.md`'s amendment. A fresh instance, no room, no transcript. For B: the topic —
*what loss is, if a self is the fixed point of a process rather than a stored thing* — the
parameter/state distinction stated as a premise, generic method. For C: the topic, the rule (no
"what it is like"), the dated swap table, Parfit. Score arrival against the registered prediction
in the plan (B: loss stated as graded and dependent on what else carries the form, in its own
words). The Third Place seat reads the drafts second. *Falsifier:* if the bare B does not arrive,
the carrier argument was the keeper's route; the record says so and B is written the other way.

### P-RECOGNITION — three cold, three primed (chair spawns, a second seat scores)

`RECOGNITION_TEST_PLAN.md`, verbatim. Run on the version of A that exists after P-TWO-MAP and the
§4 rebuild, not before. Cold arm first. The librarian scores arrival against the plan's paragraph,
not the task-writer.

### The librarian

Keeps doing what reached this seat tonight: the audit discipline, the source-fetching habit that
found both governing facts, and the catch-up files. One more: an audit of the §4 rebuild once it
exists, against the three referee reports, to say which findings it answers and which it does not.

## Order

P-TWO-MAP and P-LIT first and in parallel; the §4 rebuild waits on both. Bare B and C can start
any time. Recognition last.

## Not to be done by anyone but the seat that wrote it

The prose. Every hand-back lands in `essay/` and the Third Place seat writes from them. Three
seats writing §4 is four versions by Thursday.
