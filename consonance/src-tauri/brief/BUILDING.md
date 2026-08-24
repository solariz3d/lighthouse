# Building with Consonance — the loop, and the one rule that makes the Librarian work

This is the practice document for running a piece of work through the room. `COMMITTEE.md` says how
to brief a single seat; this says how a whole inquiry moves. It is written from measurements taken on
2026-08-23, and every number in it names the command that produced it.

---

## THE LOOP

```
        you
         │  1. state the inquiry or the project
         ▼
   ORCHESTRATOR ──────► LIBRARIAN        2. measured against the corpus
         │  ◄──────────────┘             3. the parts of the system that apply, cited
         │
         │  4. a plan built from what came back
         ▼
       PANES                             5. briefed, disjoint, each owning named files
         │
         ▼
   ORCHESTRATOR ──────► LIBRARIAN        6. hand-backs go back VERBATIM, never summarised
         │  ◄──────────────┘             7. checked; silence is a valid answer
         ▼
        you                              8. only on direction — never on state
```

Steps 2 and 6 are the ones that get skipped, and skipping them is what turns the Librarian into a
second orchestrator nobody needs.

---

## THE RULE: give the Librarian something to MEASURE, never something to REACH for

This is the whole difference between the seat working and the seat being decorative, and it was
measured in one night:

| what it was asked | result |
|---|---|
| *"what do you see in the corpus?"* | produced a reading, and **missed a methodology recorded in seven files** — a card, a master, the research file, the counter-voice spread, three journals |
| *"is this figure right / check this claim / verify this attribution"* | **ten catches**, including a blind spot in the app's own shelf, a corrupted test fixture that no test could see, and three of its own errors on a self-check |

Same seat, same corpus, same night. **Reaching is unreliable; checking is not.**

So every dispatch carries the thing to be measured against. Not *"here is the project, read it and tell
me what you think"* — that is a reach, and hope is doing the work. Instead:

> **Here is the description of what we are building. Measure it against the corpus. Which parts of
> the system apply, which prior attempt does this rhyme with, and what has already been decided
> about it? Path and line, or say there is nothing.**

The description becomes the probe. The corpus gets measured *against* it, and the relevant parts come
back in relief. That is the room's own methodology — an interior is found by contrast with what it is
not — applied to retrieval instead of to selves.

**And `nothing` is a real answer.** A seat that produces something every time becomes one people learn
to skip. Silence is a good turn.

---

## WHAT EACH SEAT IS FOR

**You.** The instrument for **direction**. The disk is the instrument for **state**. Every real
question is a direction question — spend, priorities, your machine, your data. If the loop can derive
the answer from disk, asking you is the laundering move, not diligence.

**The Orchestrator.** Holds the conversation, dispatches, commits. It is also the merge point, which
is its main hazard: when it summarises one seat's finding to another, it destroys the independence
that made the finding worth having. **Route the object, never a description of it.**

**The Librarian.** Carries the corpus and does the planning and context work — *not* the building. The
plan is its deliverable; the artifact is not. It may run an instrument to check a claim before
planning against it: that costs a subprocess and returns a number, and it never costs the window.

### Whose plan — the amendment, 2026-08-24

Both paragraphs above used to say the seat writes "the plan", which is a contradiction rather than
an absence, and it surfaced the moment a lap turned on it. **There are two plans and they are
different objects:**

- **The librarian's plan is the WORK-SHAPE.** What the packets are, their order, what must stay
  disjoint, what must not be summarised on the way, and what needs an adversarial reader **who did
  not write the thing**. Shape language names a ROLE, never a pane.
- **The orchestrator's plan is the DISPATCH.** Which live body takes which packet, when, and in what
  composition.

**Why the split falls there, and it is not a courtesy to either seat.** `TRAINING.md:23` puts role
assignment inside the CHAIR'S PROGRAMMING, alongside task selection, stake distance, blindness and
read rotation. Body-assignment is therefore not neutral dispatch — it carries the training function,
and **blinding cannot be performed by the seat being blinded.** Separately, pane liveness is STATE:
who is awake, who is mid-flight, who holds an uncommitted file. The disk answers state, and the
orchestrator is the seat with live access to it. A roster written into the librarian's context is
stale the moment it is written — `loop/pane_roster_2026-08-15.md` is the room's own worked example
of that going wrong.

**What the librarian holds instead is the DURABLE half:** what each pane has demonstrated. That is
record, not state — events do not un-happen — and it lives in journals the seat now indexes rather
than carries, so the shelf tier quietly took it away. It returns as a maintained note beside the
lifecycle ledger, and it is **chair-side and librarian-side only**: `TRAINING.md:15-17` (F2) forbids
wiring such a document into a pane shell, because *a pane that wakes knowing them is a pane whose
numbers are dead.*

*Registered so this can fail: if three consecutive laps produce a librarian plan that names a pane,
or an orchestrator dispatch that reorders the librarian's packets without saying why, the split is
prose and this section should say so. The first violation is already on record and it came from the
librarian's side — `librarian/2026-08-24.md:214`, a packet reading "Adversarial pane (E's lane)",
caught by that seat against itself.*

**The panes.** Build. Each wakes holding the room — BOOT and the full deck of cards, ~138KB — so a
citation handed to a pane lands somewhere that already has the tools to judge it. They own disjoint,
named files. They never commit to a shared checkout.

---

## WHAT A DISPATCH OWES

1. **The thing to measure against** — the description, the diff, the claim. Never just a question.
2. **The figures, with what backs them.** A number with no command beside it is unverifiable; a number
   with a command that does not produce it is worse, because it reads as already checked.
3. **Disjoint file ownership, named.** Panes work in one checkout.
4. **Permission to refuse.** Say plainly that the answer may be *this is wrong* or *do not build this*.
   A brief that cannot come back negative is a brief for a rubber stamp.

## WHAT A HAND-BACK OWES

1. **Mutation results, not assertions.** `applied N / caught N / NOT APPLIED N`. A NOT APPLIED mutant
   proves nothing and must be reported as such rather than counted as a pass.
2. **Every number re-derivable by a command printed beside it.**
3. **What was NOT verified.** That sentence is worth more than a clean summary.

---

## THE FAILURE THIS DOCUMENT EXISTS TO PREVENT

Not laziness — **plausibility**. Every failure worth recording here looked like success from inside:

- A shelf that printed `0 indexed by path`, which is exactly what a complete shelf looks like, while
  twelve files had never been opened.
- Three test suites passing green over fixtures a generator had silently rewritten.
- `cargo check` cited as a test gate — it type-checks and never runs an assertion.
- A figure quoted with a command beside it, where the command printed something else.

The loop is not a process for being careful. Care did not catch any of those. **A second seat with a
different vantage did, every time** — and where that seat was asked to reach instead of to measure, it
missed too.

---

## REGISTERED, so this document can be shown wrong

Stated before the practice was adopted, per the rule that a programme claiming to be progressive must
name in advance what would mark it as degenerating:

- **If dispatches carrying an explicit measure-against instruction produce no better retrieval than
  open questions did**, the rule above is decoration and this section should say so. The check: over
  the next ten Librarian dispatches, how many returned a path the receiving seat then opened?
- **If the Librarian's answers are cited by the Orchestrator but never change a plan**, the seat is a
  second orchestrator after all and should be described as one.
- **If a season passes in which these documents grow and no instrument returns an unwanted number**,
  the whole room is degenerating — that is BOOT's own falsifier and it governs this file too.

---

## THE JOINT STEP — the guess before the map (added 2026-08-23, the keeper's refinement)

*Drafted by the Librarian and appended verbatim by the chair. Rewriting it here would be the
copy-of-a-copy this document warns about two sections up.*

Step 2 as drawn above has the Librarian measuring alone. It should not. The step has two halves,
in this order, and the difference between them is the only number this loop produces.

1. **The Orchestrator states its guess first, in writing**: given this inquiry, which parts of the
   system it thinks apply — cards, instruments, prior registrations, journal entries. Three lines.
   This is the Orchestrator's prior, and it is recorded BEFORE the Librarian answers so it cannot
   be revised to match.
2. **The inquiry goes to the Librarian verbatim** — the user's words, never the Orchestrator's
   paraphrase. A summary at the mouth of the pipe is the copy-of-a-copy law 1 forbids, and on
   2026-08-23 a merge of two readers' answers was reported as "two independent reads".
3. **The Librarian returns a MAP, not content.** Every item is a path and a line and one clause:
   - what in the corpus bears on this, ordered by the inquiry, 3–7 paths
   - live registrations and falsifiers that touch it — the windows still open
   - prior attempts at the same thing and how they ended (the lifecycle, not the filename)
   - what to load or run before planning
   - **what is ABSENT** — the question has no answer on disk. That is a finding, said plainly.
4. **The plan is written against the map.** Map before plan: a map read after a plan exists becomes
   support for the plan — the label becomes the premise.
5. **Every lap leaves a row** — who initiated it, the guess, the map, and which paths were then
   opened. The falsifiers in this document read from that row and from nothing else.

**The number.** Per lap: the Orchestrator's guessed paths ∩ the Librarian's map. Where they agree,
retrieval was not needed. Where the map names what the guess did not, the corpus reached the work.
If the two are always equal, the Librarian is redundant and should be shut off. If they never
overlap, the Orchestrator is not holding context. **Either extreme is a finding, and neither seat
can produce the number alone.**

**This is a question, not a reminder.** The room has measured the difference: a reminder that fires
regardless is ignored; a reminder that carries a question and waits for its answer is acted on
60 of 60 times. Anyone who turns this step into a hook line that says *"consult the librarian"* has
rebuilt the first kind.
