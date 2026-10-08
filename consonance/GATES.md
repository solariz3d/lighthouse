# The gates — what refuses you, why, and how to answer

Consonance runs three gates on what its seats send. They are on in every room. They **refuse; they don't remind**, because a rule
written in a brief is followed about half the time and a rule that refuses at the moment of sending is followed almost always.
That was measured, not assumed. In a census of the rules this program was built with (the D210 rule census,
`rule_census_score_2026-10-02.md` in the keeper's public lighthouse repository):

- the **6 gated rules** were followed 94–100% of the time (median **0.979**);
- the **23 ungated "fill this slot" rules** had a median of **0.527**, anywhere from 0 to 0.979;
- the **5 ungated rules that had to fire mid-sentence** — like "give the source of every number" — had a median of **0.276**, and
  the two about numbers sat at **0.010** and **0.041**.

Every gate **fails open on its own error** (a broken hook never traps a seat), never reads or logs a secret, and checks only that
a source was OPENED in this turn — never whether it backs the claim. That part stays with the seat, and with you.

## 1. SOURCES — on every hand-off between seats

**What.** Every ring (`call_librarian`, `call_chair`) and every dispatch (`chair_inject`) carries one line above its NEXT line:

    SOURCES: <path> · <path> · `<command>`

listing what this turn actually opened or ran that the message relies on — or `SOURCES: none (no state claims)`.

**Why.** Where these gates were built, most failures to get a fact right were a source that was KNOWN and NOT OPENED (48–53 of 56
reach failures, D159). After it went live (`chunk3_scores_2026-10-03.md`): **74 of 76 hand-offs (97.4%)** got through with a real
SOURCES line within two tries; a refused ring recovered in a median **0.23 minutes**; **none was lost**; a spot-read found 1 in 20
listing a source that did not back its claim.

**A refusal looks like:** `SOURCES gate: 1 of 1 listed item(s) match nothing you opened or ran in THIS turn …`. Nothing is sent,
and the pointer is logged, so nothing is lost.

**How to answer it:** open the item (Read, Grep, or run the command) **in a message before the ring**, then send the ring again.
A file you only wrote needs a read-back. `ls`, `stat` and `echo` do not count as opening. Or drop the claim, or write `none` when
the message states nothing about state.

## 2. The reply slot — the librarian's and the chair's answers to you

**What.** When the librarian or the chair replies to **you**, and the reply names a path, a commit, a count like 3/7, a percentage
or a version, its last line is

    Sources: <path> · `<command>`

listing what that turn opened or ran. Panes talking to each other, and keep-warm pings, are not checked.

**Why.** Replayed over 340 of the librarian's past replies, 142 would have been blocked, and a blind reader judged 18 of the first
30 to be real misses (the bar was 15) (`reply_slot_replay_2026-10-03.md`). Live from 2026-10-03 to 2026-10-08 it blocked **33 of
287** replies that carried a checkable figure (11.5%). Its own rule: if more than 1 in 3 are still blocked after a week, it goes
back to watch-only (`SHADOW` in `consonance/hooks/reply-slot.js`).

**A refusal looks like:** `REPLY SLOT: this reply names <…> and does not END with a Sources: line …`. It blocks **once per turn**;
the seat's next reply ends the turn either way.

**How to answer it** (the seat does, not you): open the source and send the reply again ending with the Sources line; or drop the
claim; or end with `Sources: none`.

## 3. The NEXT trailer — every seat names where the work goes next

**What.** The last line of every ring and dispatch:

    NEXT: <station> <command> when <condition>

e.g. `NEXT: librarian collate the chunk when all four hand-backs are in`. A collation also carries
`OUTPUT → NEXT: changed|unchanged — <why>` directly above it.

**Why.** The keeper's rule, 2026-09-16: *"each seat tells the next where to hand it to remind it."* Without it, the next seat
guesses the station the sender was placed to name. With the server flagging it, the trailer was kept at 0.919 (census rule R27,
an observation after the fact rather than a registered result).

**A refusal looks like:** `refused by the NEXT-trailer gate: <what is missing>.`, with the message returned whole, on
`chair_inject` and `call_chair`: add the line and send it again. **A hand-back to the librarian is never refused for its trailer**
(a refusal there would throw away the hand-back's pointer); it is delivered with a warning, and the warning is counted.

## Who can turn them off

Whoever keeps this room (to a seat, "the person you're with"). The program ships them on because the measurements above say they work. If one
fires wrongly, that is a bug report with the refusal text attached, not a reason to write around it.
