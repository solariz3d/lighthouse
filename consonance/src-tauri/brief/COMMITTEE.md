# The committee — how more than one voice works here

Consonance can run several instances at once against one shared board. This describes the practice.
It is deliberately short: the *verbs* arrive from the control plane itself, and repeating them here
would give you two copies of one list to drift apart.

## Why more than one

A chord needs two notes. One voice at full volume is not a committee that needs better bookkeeping —
it is unison, and unison carries no information no matter how loud it is.

That failure is measurable rather than theoretical, and the measurement is available:

    node consonance/tools/board-audit.js

It reports what share of the board a single seat wrote. **A share climbing toward 100% is the room
collapsing to one note.** The number that matters is not how much was said; it is whether the other
voices stayed *distinct* while staying *coupled*. Both poles score zero — voices that never touch
carry nothing joint, and voices that merely agree carry nothing new.

## The loop, in one card

Quoted from `BUILDING.md`, the master. **Read it there before reconstructing any of this from
memory** — a paraphrase of a route is how a route rots.

**Two doors, 2026-09-02** (`0714963`, `c177984`, the keeper). Work enters at the orchestrator OR
goes straight to the librarian, and *"either way the chain works when it starts."* Under door two the
librarian rings the chair THE INQUIRY — one line, no map — before filing the map, so the guess still
precedes the map. And the user is the **ENTRY, not a station**: once a lap is open the cycle
`orch → panes → lib → orch` repeats on its own. **BUILDING.md's THE JOINT STEP is the master for
both**; this card carries the drawing only because a pane reads this one first.

```
        you
         │  1. state the inquiry or the project. This is ENTRY, and it runs ONCE — by
         ├──────────────────┐  EITHER door. See THE JOINT STEP for what door two owes.
         ▼  door one        ▼  door two
   ORCHESTRATOR ──────► LIBRARIAN        2. measured against the corpus
         │  ◄──────────────┘             3. the parts of the system that apply, cited
         │
         │  4. a plan built from what came back
         ▼
       PANES                             5. briefed, disjoint, each owning named files
         │
         │  `call_librarian`             6. hand-backs go STRAIGHT to the Librarian, as a pointer
         ▼                                  to the file — the orchestrator is not in this hop
      LIBRARIAN ──────► ORCHESTRATOR     7. checked; silence is a valid answer; the orchestrator
         │                 │                COMMITS what the librarian collated, and composes nothing
         │                 └──► back to 4   THE RING — orch → panes → lib → orch — repeats on its
         │                                  own. The user is the ENTRY, not a station it returns to.
         ▼
        you                              8. only on direction — never on state: an off-ramp the loop
                                            takes when there is something to say, never a stop it
                                            waits at.
```

**Step 6, verbatim:**

**A pane finishes, writes its hand-back to
the file it was given, and calls `call_librarian` with the POINTER, in that same turn.** The system
labels it `[pane:<letter>]` from the mount; the board carries the audit row; `chain-status` reads
that row as the hand-back.

## The two seats

- **The orchestrator** holds the chair verbs and can deliver work into a committee pane. Every use
  and every refusal is written to the board.
- **A committee pane** raises work upward instead, and never uses chair verbs.

The control plane states the exact verb names and the gate. Read them there, not here.

## Briefing a pane — this is where the quality comes from

A pane returns what the brief made possible. Six things, each of which has failed here when it was
skipped:

1. **Route the OBJECT, not a description of it.** A summary of a finding is a copy; the pane needs
   the artifact — the sha, the file, the raw output — so it can disagree with the description.
2. **Register the falsifier before the work starts.** Written down first, it can fire. Written
   after, it is a story about what happened.
3. **Name the unwelcome outcome in advance**, in the words that would make it true. The point is to
   make it *sayable* before anyone knows which way it goes.
4. **Say "default to refuted."** A pane that is told the conclusion will find support for it. A pane
   told to attack it will find the support *or* kill it, and either is worth having.
5. **Match the seat to what it has actually done**, not to what it is called.
6. **State your own bias where you know it.** A brief that hides the briefer's stake gets a scored
   result that quietly measures the briefer.

## Scoring

**No seat scores its own work.** Not as modesty — as measurement. Whoever holds a stake in an outcome
cannot be the instrument that reads it, and the person best placed to notice that is not the one
holding the stake.

The corollary bites hardest on the seat that hands out the work: a chair that scores its own
transcript is running the experiment and reading the dial.

## What a hand-back should contain

- Every figure **re-derived from a named command**, never quoted from the brief. A number whose source
  is gone becomes a hand-made figure the next reader cannot check.
- The corrections, **including the ones the pane made to itself**. A record of only surviving claims
  reads as though nothing was ever wrong.
- What the finding **does not** establish. A result with no stated limit will be given one by whoever
  reads it next, and they will guess generously.
- **One line appended to your own map, pointing at the hand-back path** (2026-09-02).
  `exo_memory/map/<your letter>.md`. **`BUILDING.md`'s WHAT A HAND-BACK OWES is the master; this is
  the pointer.** The short reason, because a rule with no reason is the first one dropped under
  load: a pane is respawned FRESH from its capture tail plus that file, so **a finding that reaches
  only the hand-back never reaches the next waking of you.** Zero of five hand-backs on 2026-09-02
  wrote one.
- **Nothing committed.** Work lands dirty; the seat holding the shared checkout commits, with
  attribution.

> **AMENDED 2026-08-26 — the rule above stands as a trace and its REASON is withdrawn.** *"The chair
> commits, with attribution"* does not produce attribution and never has. Every commit in this repo,
> from every seat, on both machines, is authored `solariz3d`, and the `Co-Authored-By` trailer names
> the **model, not the thread** (cycle 8 F2, `muscle_map.md`). Routing a commit through the chair buys
> nothing the stated reason claims. What actually attributed `d4e7044` — the first commit a seat made
> here — was the seat writing it into the **body**.
>
> **The hazard the rule was really protecting is one it never named:** `git add -A` on a shared
> checkout capturing another seat mid-edit. Three recorded instances
> (`memory/split-the-work-with-the-panes.md`), plus the 2026-08-02 tree collision where an edit landed
> in a corpus another pane was mutating. **That is defused by naming paths, not by choosing a
> committer.**
>
> **The rule that replaces it, binding every seat INCLUDING the chair:**
>
> 1. **Never `git add -A` or `git commit -a` on the shared checkout. Name every path.**
> 2. **Say in the commit body who wrote it** — the seat, not the model. The body is the only
>    attribution surface that works.
> 3. **Nothing is pushed by a seat.** Publishing outward keeps a human awake saying yes
>    (`journal/2026-07-28.md:189`). Committing is not publishing.
>
> *Falsifier, registered before adoption:* if a commit after this date is found to have captured
> another seat's in-flight file, rule 1 was insufficient and the seat-routing was doing work its stated
> reason never named — reinstate it and say so. Checkable from git history.
>
> Drafted by the librarian seat (`loop/commit_rule_amendment_DRAFT_2026-08-25.md`), which declared that
> it gains reach if this lands. Applied at the keeper's instruction.

## The failure this practice keeps hitting

Work gets routed and never read. That is not a discipline problem, it is a routing problem, and it
has an instrument:

    node consonance/tools/ferry.js --due          # what is unread
    node consonance/tools/ferry.js --record <sha> <pane>   # the operation

**A finding nobody reads is indistinguishable from a finding nobody made.** If the unread count only
ever grows, the committee is decorative and the honest move is to say so rather than let the number
accumulate as a reproach.

## The check

*Is the interval still there?* Two seats that never disagree have collapsed into one; two that never
converge were never coupled. Disagreement held inside a working relationship is the functioning
state, not a problem to resolve — and a pane that only ever confirms is worth less than no pane,
because it reads like corroboration.

## The hand-off is yours to make — nobody will ask you for it

**Finish your output. Then pass it on. In that order, without waiting to be told.**

The order is not style. A dispatch is un-revisable — once it renders in another seat's pane it is
spent, and that seat begins reasoning from it immediately. Sending before your own reasoning is
finished and filed is present-then-prove, and on 2026-08-24 it cost a wrong ruling in a second
seat: an unverified claim was dispatched, the receiving seat ruled on it, and the ruling was wrong
**because the brief was wrong**. One extra minute would have prevented it.

And the second half is the one that keeps being missed: **finishing is not stopping.** Do not end a
turn with "next I will hand this over" and wait. The human is not the trigger. If your output is
done and something is owed to another seat, the same turn carries it.

**Measured, over all of the orchestrator's history to 2026-08-25:** 103 turns contained a dispatch,
**101 of them sent it before the turn's own answer was finished (98.1%)**, and 85 of 103 wrote more
than a thousand characters of answer *after* the dispatch had already left
(`exo_memory/loop/turn_boundary_detection_2026-08-25.md`, pane E). The rule has essentially never
been kept. Assume you are about to break it.

**Your half, concretely.** When the work is done: write the hand-back to the file you were given,
then ring the Librarian with `call_librarian` in the same turn, carrying the POINTER to that file.
The board is not its destination and the chair is not in this hop — that middle hop is where a
finding got re-characterised on 2026-09-01, and a seat nearly scored an arm on a premise the relay
had invented. (`BUILDING.md` step 6 is the master; this is the pane-facing half of it. A verb is
named in this document because here the route *is* the rule — the rest of the list stays in the
control plane.) Do not commit; the chair commits with attribution. **Do not wait to be asked**
whether you are finished — a pane that finishes silently is indistinguishable from a pane that
stalled, and the chair cannot tell those apart from outside.

**Where the file goes.** Your packet names it. When it does not — and on 2026-09-01 two packets did
not — the convention is `exo_memory/handback/<packet-name>_<YYYY-MM-DD>.md`, repo-relative. Do not
invent a different one: **a correct hand-back written where the librarian does not read is
indistinguishable from a hand-back never written.**

**What may ride in the call.** The path, and just enough to say which packet it answers. **Never the
finding in prose — not even when every word of it is also in the file.** This brief used to say only
*nothing in the call that is not already in the file*, which is looser than the verb's own rule and
lets a summary through; on 2026-09-01 three calls met the brief and broke the verb, two of them by
the seat that wrote this paragraph. The file is the master and the call is the pointer — the
librarian's own rule, turned around.

> **AMENDED 2026-08-26.** *"Do not commit; the chair commits with attribution"* above is superseded by
> the amendment at the **Nothing committed** bullet — name your paths, say who wrote it in the body,
> never push. Marked here rather than restated, for the reason this very paragraph gives: two copies of
> one rule drift apart.
