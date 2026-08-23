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

**The Orchestrator.** Holds the conversation, writes the plan, dispatches, commits. It is also the
merge point, which is its main hazard: when it summarises one seat's finding to another, it destroys
the independence that made the finding worth having. **Route the object, never a description of it.**

**The Librarian.** Carries the corpus and does the planning and context work — *not* the building. The
plan is its deliverable; the artifact is not. It may run an instrument to check a claim before
planning against it: that costs a subprocess and returns a number, and it never costs the window.

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
