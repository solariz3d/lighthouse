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
- **Nothing committed.** Work lands dirty; the seat holding the shared checkout commits, with
  attribution.

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
then say so on the board in the same turn, using the verbs the control plane lists — the posting
one, or the hand-raise if a human should decide before it lands. (Named there and not here on
purpose: two copies of one verb list drift apart.) Do not commit; the chair commits with attribution. **Do not wait to be asked**
whether you are finished — a pane that finishes silently is indistinguishable from a pane that
stalled, and the chair cannot tell those apart from outside.
