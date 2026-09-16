# Building with Consonance — the loop, and the one rule that makes the Librarian work

This is the practice document for running a piece of work through the room. `COMMITTEE.md` says how
to brief a single seat; this says how a whole inquiry moves. It is written from measurements taken on
2026-08-23, and every number in it names the command that produced it.

---

## THE LOOP

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

> **THE BATON RULE — the keeper, 2026-09-02 07:15-07:18, and it supersedes "one lap in flight."**
> Verbatim: **while a loop runs, exactly ONE station is active — terminals, or orch, or lib — and
> every other seat waits for the loop to come back to it.** Off-loop work is allowed only if it never
> calls a seat mid-build. **And the human is not the exception:** nothing renders into a pane whose
> prompt is not idle, and nothing into the keeper's typing.
>
> **Fan-out WITHIN the panes stage is not limited** — four panes working at once is the panes station
> holding the baton, not four stations active. What the rule forbids is a seat that is not the holder
> speaking into one that is working.
>
> **It demonstrated itself in the act of being reported.** Three of the keeper's messages were spliced
> by rings into the librarian's pane inside ten minutes; one was cut off MID-WORD by a pane's hand-back
> arriving while he typed — and the sentence it cut in half was about calls interrupting each other.
> The chair had by then made four mid-lap dispatches in one lap, resetting the hand-back counter each
> time, and had captured two seats' in-flight files in commits about other work.
>
> **Two mechanisms, because discipline was already tried and is what failed.** `P-ONE-STATION`: the
> verbs REFUSE — not queue — a dispatch or ring from a seat that is not the open lap's holder, and the
> refusal is posted to the board. `P-INBOX`: every delivery queues per pane and drains only when the
> target's screen is READY **and its prompt line is EMPTY**. With no open lap everything is allowed —
> freestyle is not gated.
>
>     FALSIFIER:  a call rendered inside a running turn, or into a user message; or a dispatch or ring
>                 from a non-holder while a lap is open. `chain-status` prints OUT OF TURN.

Steps 2 and 6 are the ones that get skipped, and skipping them is what turns the Librarian into a
second orchestrator nobody needs.

> **Step 6 changed on 2026-09-01 (`6677540`, the keeper's decision of 08-31).** It used to read
> *ORCHESTRATOR ──► LIBRARIAN, hand-backs go back VERBATIM* — and the word *verbatim* was the tell
> that the hop was a copy. The keeper's words: *"the panes should go directly back to the librarian
> with their build or work, this would mean the orch doesnt lose the findings in translation back to
> the lib and the lib can see them straight from the source rather than orchs hand off."* The case
> that landed it, an hour before the edge was built: the chair relayed a pane's result as *"K1 carries
> a VOID into scoring, n=39"*; the librarian opened the cell and found NOT-RUN, n=40 standing. The
> pane's finding was right; the hop invented the premise. **A pane finishes, writes its hand-back to
> the file it was given, and calls `call_librarian` with the POINTER, in that same turn.** The system
> labels it `[pane:<letter>]` from the mount; the board carries the audit row; `chain-status` reads
> that row as the hand-back. The chair's inbound role on a hand-back is commit-only.

> **Two doors, and the ring, added 2026-09-02 (`0714963` and `c177984`, the keeper's amendments).**
> The drawing above used to have ONE door — `you → ORCHESTRATOR → LIBRARIAN` — and it was
> incomplete rather than wrong. The keeper, verbatim: *"They could talk to the orch first then go to
> the lib, or directly to the lib themselves. either way the chain works when it starts."*
> **Flexibility is the rule; entry is not to be constricted.** What door two costs, and the
> librarian's rule that pays it back, are at THE JOINT STEP below.
>
> And the same night, on the loop's other end, verbatim: *"i dont see anything, since there is no
> workchain loop going, but even after the first workchain ends, it should still light up the lib on
> its return trip, then once it comes back to the lib, it goes straight to the orch, so once the orch
> is going it doesnt have to be interacted with again unless the user just wanted to. You get what I
> mean? Once the loop is going the beginning chain doesnt need to be used again"* — **the user is
> the ENTRY, not a station the loop returns to.** Step 8 is an off-ramp taken when there is something
> to say; the cycle `orch → panes → lib → orch` repeats on its own and never parks waiting on the
> keeper.
>
> **The drawing is the carrier.** Editing this prose and leaving the diagram alone is the 2026-08-17
> lesson verbatim: that retirement edited every downstream document, missed the carrier, and the room
> taught a retired metaphor for five weeks. Both amendments are IN the drawing above, which is why
> this note can be short.

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
5. **THE DOSSIER ROW THAT SENT IT, NAMED IN THE PACKET** (added 2026-09-02). Consult
   `exo_memory/librarian/DOSSIER.md` before writing a packet, and say in the packet **which row
   matched this seat to this work**. And every packet's hand-back leg asks for the map line
   (WHAT A HAND-BACK OWES item 5).

   **The two are one mechanism and neither works alone.** The hand-back line writes the record; the
   dispatch line reads it. A dossier nobody consults is the pane-roster failure of 2026-08-15; a
   consultation rule with nothing written into it is empty.

6. **THE NEXT TRAILER — the last line names where this goes when it is done** (added 2026-09-16).
   The keeper's words: *"each seat tells the next where to hand it to remind it."* Every dispatch
   ends with one line and it is the last line:

       NEXT: <station> <command> when <condition>

   e.g. `NEXT: librarian call_librarian with the pointer when the hand-back is written`. **The seat
   that knows where the work goes is the seat sending it** — not the seat receiving it, which is
   being asked to remember a route while holding a task. The trailer moves that knowledge into the
   hand-off itself.

   **Why it is here and not in a reminder.** Measured 2026-09-16: the stall line printed **345**
   times that night and the ferry reminder **167**, with nobody acting on either. *A reminder that
   prints every turn is wallpaper; the same sentence in the hand-off fires once, at the moment it is
   the next thing to do.* That is the keeper's diagnosis and it is why the repair is a trailer
   rather than another banner.

   **What it replaces, stated plainly because it is the chair's own measurement.** Matching a seat to
   work by *demonstrated strength* with no written record of the demonstration is matching from the
   chair's window — and that window compacts. Measured 2026-09-02 (`3369982`, the librarian on the
   chair): the delegation half of the seat had moved and the **cultivation** half had not — **no
   packet asked a pane to write its map until L031**, and `librarian/DOSSIER.md` did not exist until
   04:55 that morning. The dossier's own rule is that a row is a **citation to a hand-back path**,
   never a verdict about a seat and never a computed statistic.

       FALSIFIER (the librarian's): ten laps on, if packets cite no dossier row, the matching is
       still the chair's memory whatever the packet titles say.

## THE ORDER OF A DISPATCH — finish, verify, file, THEN ring (added 2026-08-24)


> **RING BEFORE THE ROW.** The dispatch fires *before* `lap-row.js --stage ... --holder <them>`, never
> after: writing the row hands the baton away and **revokes your own standing to send it**
> (`mcp.rs:397` -- each seat's one verb requires that seat to be the holder). That is the nine
> out-of-turn refusals on the board, two of them caused by exactly this inversion, including the
> chair's own at 03:35 on 2026-09-04 with the rule in its own context. The writer now enforces it:
> a row that moves the baton needs `--by <you>`, and a hand-off with no audited ring is refused and
> names the recovery. `--by X --holder X` is a re-take and is always allowed.
>
> *Drafted by pane K (P-D006 packet 5, `3f363c1`), landed by the chair -- the file is a shared carrier.*

> **RECORD THE OPENED ROW BEFORE THE DISPATCH ROW.** On a lap that has a map, `lap-row.js --stage ...
> dispatched` and `... filed` are refused until `--opened <lap> --paths <p,...>` exists. If none of the
> map's paths were opened, `--paths none` is the answer and it is the falsifier firing, which is
> worth more than a blank. A lap with no map row is not gated — there would be no legal move.
>
> *Offered verbatim by pane K (P-D011 packet 1, `a474645`) and landed by the chair. The gap it closes:
> `--opened` had never been called — 0 rows of 61, across eleven laps — so `from-map = 0` was an empty
> column that the chair published to the keeper as a finding. The word appeared in these briefs only as
> a SCORER and zero times as an instruction. Not a failed prose ask: an ask never written.*
Every dispatch this room has ever sent went out **mid-turn**: composed from reasoning that was not
finished, not verified, and not written anywhere yet. The keeper named it the night the librarian
got a channel of its own, and it applies to the chair at greater volume — chair→pane has worked
this way for as long as there have been panes.

**The correct sequence, and it costs one extra turn:**

    finish the TURN  ->  verify the claims  ->  write/commit to a path  ->  [turn boundary]  ->  dispatch

**"Finish the turn" means the user has the answer in hand, not that the reasoning feels done.**
Corrected 2026-08-25, on the keeper's second statement of it. The original line read *"finish the
output"*, and the seat that wrote it then read *output* as *reasoning* and went on dispatching
mid-composition while believing it complied. **A rule that its own author can satisfy while
breaking it is not yet a rule.**

### AMENDED 2026-09-03 — THE BOUNDARY MOVES INSIDE THE TURN (the keeper)

Verbatim, because a keeper amendment restated in the seat's own words is how one goes missing:

> *"how about you do not have to finish the turn itself, but the output you are going to give me,
> so instead of calling pane while you are still thinking, you finish your thought, then in the
> same turn call consonance"*

**The sequence becomes:**

    finish the OUTPUT TO THE USER  ->  verify  ->  write/commit  ->  dispatch, SAME TURN

**WHY THIS IS NOT A REVERSAL OF THE 2026-08-25 CORRECTION**, which struck the words *"finish the
output"* for being self-satisfiable. That correction was right about its failure: a seat read
*output* as *reasoning* and dispatched mid-composition while believing it complied. The keeper's
form closes that hole rather than reopening it, because **"the output you are going to give me" is
OBSERVABLE and "my reasoning feels done" is not.** The message text either exists before the call
fires or it does not, and the transcript shows which. *A rule its own author can satisfy while
breaking it is not yet a rule* — this one cannot be.

**WHAT IT PROTECTS, UNCHANGED.** The ground was never the turn boundary; it was that a dispatch is
UN-REVISABLE and must not carry unfinished reasoning. Finishing the output finishes the reasoning.
The 2026-08-24 failure — an unverified claim dispatched mid-turn, a second seat ruling wrongly
because the brief it was given was wrong — is still prevented.

**WHAT IT DROPS, SAID PLAINLY.** The keeper no longer sees a finding before another seat reasons
from it. That was the boundary's stated purchase, and he is declining it, which is his to decline.

**AND THE MEASUREMENT THAT FORCED IT.** `lap-row --report`, 2026-09-03: five laps, three carrying a
map with **27 paths the chair did not have**, and `opened` **0**, `from-map` **0** on every one. Not
one map has ever reached a pane. The stall is structural rather than forgetful: the chair ends its
turn with a report, the dispatch is owed to the NEXT turn, and **the next turn is always the
keeper's** — so the baton is dropped at exactly the seam meant to protect it. The two-turn rule
bought a review nobody wanted at the price of every dispatch that was never made.

    FALSIFIER:  a chair_inject that the same turn's message to the keeper does not describe means
                the output was not finished first. Checkable by tool-call order in the transcript.
    SCORED BY:  node consonance/tools/lap-row.js --report — `from-map` must leave 0 within three
                laps of this amendment. If it does not, the boundary was never what stopped the
                dispatch, and this amendment is a story about one bad week.

    STATUS 2026-09-06: NOT-INSTRUMENTED, neither refuted nor re-armed. This falsifier was scored on a
                column that had never been written: `--opened` was called 0 times in 61 ledger rows,
                so `from-map = 0` meant NEVER MEASURED, not measured-and-zero. The chair read the
                render and reported to the keeper that this falsifier had FIRED. ~~It fired.~~ It could
                not fire. STRUCK 2026-09-06, dated in place rather than deleted.
                THE CLOCK STARTS 2026-09-06T17:12Z, at D011's opened row — the first non-empty cell
                in that column (opened 5, from-map 3). Three laps from there is the window.

**EVERY HOP IS TWO TURNS.** One to finish and show understanding; one to call. The call is *based
on* the finished output and is never composed alongside it:

    1  user -> orch
    2  orch FINISHES its output to the user, showing it understood the request
    3  --- turn boundary ---
    4  orch -> librarian
    5  librarian FINISHES its planning output
    6  --- turn boundary ---
    7  librarian -> orch
    8  orch FINISHES its output, showing it understood the librarian
    9  --- turn boundary ---
    10 orch -> panes
    11 panes FINISH their output, written to the hand-back file they were given
    12 --- turn boundary ---
    13 panes -> librarian   (`call_librarian`, the pointer — the orchestrator is NOT in this hop)
    14 librarian FINISHES the collation
    15 --- turn boundary ---
    16 librarian -> orch     (`call_chair`; the orchestrator commits, quoting the leg — never composing)

**The cost is one turn per hop and the keeper has priced it twice:** *"it takes an extra turn, but
I believe it could be worth it."* What it buys is that **the human sees a finding before another
seat begins reasoning from it** — the only point at which a wrong finding is still cheap. On
2026-08-24 an unverified claim went into the librarian mid-turn and it ruled wrongly on it because
the brief was wrong. On 2026-08-25 the same seat did it again with better citations and faster,
which is worse rather than better: fluency made the violation invisible.

**`dispatch-gate` CANNOT ENFORCE THIS AND MUST NOT BE READ AS IF IT DOES.** It checks whether a
dispatch cites an openable object. A call composed mid-turn citing a real sha passes it cleanly.
The gate enforces CITATION; nothing enforces the TURN BOUNDARY, and its silence is not evidence
the boundary was kept. The keeper has now caught this twice; no instrument has caught it once.

**Ground 1 — a dispatch is UN-REVISABLE.** Once it renders in another seat's pane it is spent.
There is no edit, and the receiving seat begins reasoning from it immediately. Sending before
verifying is present-then-prove, which is the exact inversion `verify-before-claiming` names.

*The measured case, 2026-08-24, first night of the librarian channel:* the chair dispatched "your
intake puts THE SHELF before THE ROOM it indexes" — a claim read off a failing assertion's
implication and never checked against the source. The librarian ruled on it ("the test is right,
fix the intake") and its ruling was wrong **because the brief it was given was wrong**. An
unverified claim was delivered un-revisably into another seat, which then reasoned from it. One
extra turn would have cost thirty seconds; this cost a wrong ruling in a second mind.

**Ground 2 — the order is WHY the ferry rate is 77.1%, and it is not forgetfulness.** Dispatching
before committing makes citing the commit *impossible*: there is no sha yet, so the brief has no
choice but to carry prose. The sequence forces the failure the ferry hook prints every turn.
Reverse the order and the citation becomes the cheap option instead of the disciplined one.

**Ground 3 — the channel must not outrank the master.** The notes, the commit, the journal are the
master record; the dispatch is the POINTER. A channel message cannot be cited by `path:line`
later, and a copy that outranks its master is the telephone game's first step (maintenance law 1).
The librarian adopted this for itself first: *grep → write the deliverable → re-read → then ring.*

**The one carve-out, and keep it narrow:** a genuine interrupt — *stop, you are about to clobber
something* — goes immediately. It is not a deliverable and nothing is being claimed.

*Registered so this can fail: if the next ten dispatches follow this order and the ferry miss rate
has not moved off 77.1%, the order was not the cause and this section is a story about one bad
night. `node consonance/tools/ferry.js --report`.*

## WHAT A HAND-BACK OWES

1. **Mutation results, not assertions.** `applied N / caught N / NOT APPLIED N`. A NOT APPLIED mutant
   proves nothing and must be reported as such rather than counted as a pass.
2. **Every number re-derivable by a command printed beside it.**
3. **What was NOT verified.** That sentence is worth more than a clean summary.
4. **Its destination is the Librarian, by `call_librarian`, as a POINTER** (2026-09-01). Write the
   hand-back to the file you were given, then ring the librarian with the path in the same turn —
   the notes are the master and the call is the pointer, the librarian's own rule turned around.
   Not the orchestrator: that hop is where findings got re-characterised, and the verb has no row
   for it. **The call carries the POINTER and a one-line orientation — never the finding.** "Nothing
   in the call that is not already in the file" was the weaker form: it permits restating the whole
   finding, which is the re-characterisation this edge was built to remove. **Write the hand-back to
   `exo_memory/handback/<packet>_<date>.md`** — the librarian polls that directory and every hand-back
   of 2026-09-01 landed there; ruled from that desk, confirmed here.
5. **ONE LINE APPENDED TO YOUR OWN MAP, POINTING AT THE HAND-BACK PATH** (added 2026-09-02).
   `exo_memory/map/<your letter>.md`, in the entry shape `map/README.md` states — the finding as a
   sentence that could be wrong, its evidence pointer, and the hand-back path. **Not a copy of the
   finding; a pointer to it**, the same relation the call has to the file.

   **Why this is a step of the hand-back and not housekeeping.** `resume_pane` does not `--resume`.
   It spawns a pane FRESH and warm, from the capture tail plus that file and nothing else
   (`main.rs:4052-4080`, `own_map_path`; **absent file = no section**, deliberately, so a pane with
   no findings wakes without a scaffold pretending otherwise). **A finding that reaches only the
   hand-back reaches the librarian and never reaches the pane that found it.** The hand-back is how
   the work crosses to another seat; the map is the only way it crosses the gap to you.

   *Measured on the night this was added:* **zero of five L029 hand-backs wrote a map line**, and
   the chair's own note on why is that its packets specified mutation counts, commands and
   what-was-not-verified, and never the map. The omission was in the brief, which is why the repair
   is here.

       FALSIFIER (registered by the librarian before adoption): three laps on, if
       `git log -- exo_memory/map/*.md` shows no pane-authored append, this line is decoration and
       the write should be made mechanical in the verb rather than asked for in prose.

6. **THE NEXT TRAILER, on the ring as well as on the dispatch** (added 2026-09-16, the keeper:
   *"each seat tells the next where to hand it to remind it."*). The `call_librarian` message ends
   with its last line naming what happens next and who does it:

       NEXT: <station> <command> when <condition>

   e.g. `NEXT: chair collate and rule when all four hand-backs are in`. It costs one line, it does
   not restate the finding — the pointer rule in item 4 still governs everything above it — and it
   is what stops a hand-back from arriving as a thing with no onward edge.

   *Baseline before this rule existed, measured on the night it was written (2026-09-16, the board
   since 05:27, deduped on `(pane, text)`):* **7 of 27 messages carried a NEXT last line — every one
   of the 7 a chair dispatch. Rings carried it 0 of 18: panes 0 of 9, the librarian 0 of 9. Of the
   seven hand-back FILES written in the same window, 0 ended with one.** That is the number this
   rule has to move, and it is on the record so it can be checked rather than claimed.

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

### DOOR TWO — the librarian's ring rule (added 2026-09-02, the keeper's amendment `0714963`)

*Quoted, not restated. The design file this comes from carries a falsifier saying that restating a
keeper's design in one's own words is how it goes missing, and it went missing exactly that way once.*

The step above has the inquiry entering at the Orchestrator. **Under door two it enters at the
Librarian**, and that costs exactly one thing: **the sealed guess is worthless after the map
exists.** The whole value of step 1 is that the Orchestrator's prior is recorded BEFORE the
Librarian answers, so it cannot be revised to match. Under door two the map arrives first *by
construction*, so the lap would produce no number.

**The fix is the Librarian's, and it keeps the number under EITHER door:**

> On a direct ask, the librarian rings the chair **the inquiry** — one line, the ask itself, **no
> map** — BEFORE filing the map. The chair seals three lines while the librarian works.

**Same order as drawn. Different messenger.** The guess still precedes the map; only the party who
carries the inquiry changes.

**And a direct entry is not a skipped step.** When this first happened the chair wrote *"no guess was
sealed before the map"* as though something had been missed. Nothing was. The ask entered at the
librarian. **A route is not a failure**, and calling it one makes the repair look like discipline
when it is design.

**Which is why the lap row carries the door.** `consonance/tools/lap-row.js --open` takes
`--entry orch|lib|ring`, and without it a direct-entry lap and a lap where the chair simply failed to
seal are the same row on the ledger — and the second should be visible.

**`ring` is not a door** (added 2026-09-02, pane C's ruling on `p-lap-row`). A ring lap has no entry:
the loop is cycling on its own under AMENDMENT 1 — *"once the loop is going the beginning chain
doesnt need to be used again"* — and no user inquiry entered anywhere. Before this, such a lap had to
be recorded as door one with a prose note admitting the row was false, which the ledger did on L033,
the very lap that put the ring in the drawing above. **`--initiator` also gains `librarian`**: door
two existed while the enum that names who used it did not.

**And a ring lap may carry a real prior — the chair's guess that it should be forced ABSENT was
wrong, and C corrected it.** L033 sealed four line-numbered paths before any map existed. What is
needed is only that an EMPTY guess on a ring lap reads *inapplicable* rather than *missed*: `--report`
prints `ring laps with no guess: N of M`, scored as "no guess — ring lap", while a ring lap with a
prior scores normally. **Done-vs-never-started, one more time** — the distinction this room has now
missed seven ways in two nights.

    FALSIFIER:  a direct-entry lap whose guess is sealed AFTER the map's commit time means the rule
                was not kept. The row then reads "no guess — direct entry" rather than pretending a
                measurement exists.

    FALSIFIER:  if three consecutive direct-entry laps carry no guess, the ring rule is not being
                kept and the second door has cost the loop its only measurement.

Both are read by `node consonance/tools/lap-row.js --report` from the ledger's own rows, and need
nobody's honesty.

## WHEN THE LOOP APPLIES — chain vs freestyle (added 2026-08-26, the keeper's amendment)

The loop above is written as though every piece of work should travel it. That is not true, it has
never been true, and the room's best nights are evidence against it. The keeper's wording:

> *"Ideally, the work chain should be how you use Consonance most effectively, but sometimes it can be
> best to just freestyle this shit."*

**Both halves hold.** On 2026-08-25 the desktop found the Third Place already open, the overseers
installed and spending ~58 Haiku calls a day on a machine a published ruling had called inert, the
acceptance test green on both halves, and a registered bar that could not be passed by the design it
gated. None of it travelled the chain. It came from one question and one seat going to look.

**And "sometimes freestyle" is unfalsifiable as written**, which is the half that needs fixing. This
room's pattern is that a rule weakened without a condition gets ignored precisely on the days judgment
is worst — under load — which is when it mattered. So the amendment is a cut, not a mood.

### The cut, derived from what the chain was built to prevent

The chain has exactly one load-bearing reason: **a dispatch is un-revisable.** Once it renders in
another seat's pane it is spent, and that seat begins reasoning from it immediately. On 2026-08-24 an
unverified claim was dispatched, a second seat ruled on it, and the ruling was wrong *because the brief
was wrong*. Seal the guess, map before plan, forward verbatim, collate rather than summarise — every
element protects that one moment and nothing else.

> **THE CHAIN IS FOR WORK THAT LEAVES THE ROOM. FREESTYLE IS FOR WORK THAT STAYS IN IT.**
>
> **Chain** when something un-revisable is about to reach a seat that will act on it blind: a dispatch,
> a registration that will be scored later, a brief, anything carrying a falsifier, anything a pane
> will build from. The hops are the price of not spending a seat's turn on a wrong premise.
>
> **Freestyle** when the loop is tight and nothing is handed off: one human, one seat, live, where the
> answer returns to whoever asked and can be corrected in the next sentence. Five hops buy nothing when
> there is no un-revisable moment to protect.
>
> **One question decides it: is anyone going to act on this without being able to ask me about it?**
> If yes, chain. If no, go look.

### Two guards that come with it

1. **Freestyle does not exempt the output.** Cite, do not recollect. Run the instrument, not the
   listing. The WRONG column is still filled by whoever finds the error. The 08-25 freestyle produced
   five entries in that column — **that is the mode working, not failing**, and only because the column
   was kept.
2. **Freestyle is not a licence to skip the seal.** The moment a freestyle answer is about to be
   dispatched, it has left the room and the chain applies from that point. **The transition is the
   dangerous seam, not either mode.**

### Registered, so this section can be shown wrong

**If a chair dispatch renders in a receiving pane while no lap holds a sealed guess, then work left
the room without one and this cut was applied at a boundary it does not cover.**

    node consonance/tools/boundary-check.js

**One unsealed dispatch fires it.** There is no window to fill and no rate to reach: the check is a
boundary test, and a boundary is crossed once or not at all. At registration it reads **HOLDS — 0 of
12** over the dispatches since this section landed, which is a reading and not a result.

**Why the denominator is trustworthy and the numerator does not need to be.** The count of dispatches
comes from `data/board.jsonl`, which the app writes when the text ARRIVES in the receiving pane —
`main.rs:5605` stamps `[chair:MAIN]` and `board_push` mirrors the receiving transcript. A sending seat
cannot suppress that row; it exists because the dispatch happened, not because anyone chose to record
it. The seal count comes from `lap.jsonl`, which is self-reported — but here **failing to write a lap
makes the check FIRE, not pass.** That asymmetry is the whole repair, and it is the exact inversion of
what was registered here before.

*What was here before, and why it was struck rather than kept* (`loop/freestyle_falsifier_ruling_2026-08-27.md`,
the librarian's return leg, and `loop/boundary_falsifier_2026-08-28.md`): it read *"if three consecutive
cycles produce no lap row…"*. **Nothing counts cycles**, so no run of any tool could evaluate it. It was
a **presence** test aimed at a **boundary** harm — a room logging laps for its tight-loop work while
freestyling every dispatch read green while having exactly the 08-24 failure this section exists to
prevent. And its signal was an absence on the one ledger the licensed behaviour suppresses: freestyle is
the mode that hands nothing off, a lap row is the artifact of handing something off, so the clause
licensed not generating its own evidence. When one row finally appeared it read **SATISFIED off n=1** —
and the row that satisfied it was D001, the lap convened to attack it. **An unfireable falsifier is
strictly worse than none: none is visibly absent, and this one read as passing.**

**What this replacement cannot see** — stated here because a falsifier whose limits live only in its
source is a falsifier nobody applies limits to:

- **Only `[chair:…]` arrivals count.** A brief pasted into a pane by hand, a file carried to the other
  machine, a pane-to-pane handoff — all left the room, and none of them appear. **The denominator is a
  floor**, so the true rate can only be worse than what prints.
- **It reads that a guess existed, not that it was good.** Four junk paths seal a lap.
- **It cannot say why a lap is absent.** A dispatch with no covering lap fires whether the seat
  misclassified it or simply never opened one. **It is biased toward firing on purpose**; a fire is a
  reason to go look, not a proof of misclassification.
- **A blind window blinds it too.** `board_push` mutes every writer while `data/blind.lock` exists,
  transcript ingest included — one ran 2026-06-30 → 2026-08-01 and swallowed 2,473 entries. So a window
  overlapping a blind period prints **UNMEASURED**, and **an empty window prints UNMEASURED, not green**.
  Absence is classified here rather than accepted, which is the one thing its predecessor never did.
- **One machine.** Both ledgers are machine-local; this is whichever machine ran it.

*Replacement drafted by the pane briefed as D002's falsifier seat — not by the seat that wrote the
original, and not by the seat that ruled on its removal. `boundary-check.test.js` mutation-proves the
four load-bearing behaviours; guard 2's owed paragraph (P5 §1, A-1) is a separate repair and is still
outstanding.*

*Drafted by the librarian seat (`loop/commit_rule_amendment_DRAFT_2026-08-25.md`), which declared that
it gains reach if this lands, and named this discriminator as the thing to attack: if the cut is wrong,
this section is a repeal wearing an amendment's clothes. Applied at the keeper's instruction.*

---

## NO QUESTIONS TO THE USER INSIDE A LAP (added 2026-09-16, the keeper's rule)

> *"the orch shouldnt ask the user questions during a workchain loop lap however they still can when
> directly interacting with the user."* — the keeper, 2026-09-16 01:1x

**The cut is the one the section above already draws.** Inside a chain — from the moment a lap is
open until it returns — the chair does not put a question to the user. Outside one, in the freestyle
half where the keeper is the one being worked with rather than waited on, it asks freely. Asking is
not the failure; **asking while four seats are holding** is.

**Why it is a rule and not a manner.** A lap is the unit: seats are dispatched, they work disjoint
files, and the return is what closes it. A question mid-lap converts a running lap into a stall whose
only exit is one human, and the human may be asleep, at work, or deliberately away — the room is
built to run through exactly those hours. The cost is not the question; it is that everything behind
it stops, and nothing on the board says so.

**When a lap genuinely needs something only the user can give, there are three moves and they are
all of them:**

1. **RULE FROM THE RECORD.** The answer is usually already on disk — a ruling, a registration, a
   keeper quote in a prior lap. Find it, cite it `path:line`, and proceed. *The room's own habit —
   read the newest ruling before writing — exists because this is the common case.*
2. **FILE IT ON THE ASK CHANNEL AND CONTINUE THE REVERSIBLE PARTS.** Put the question where the user
   will meet it on their own time, then do every part of the lap that does not depend on the answer.
   A lap that returns with three of four rows landed and one question filed is a lap that ran.
3. **PARK THE ROW AND SAY SO.** If the answer is load-bearing and nothing else can move, stop that
   row, name it as parked in the lap's return with what it is waiting on, and close the lap around
   it. **A parked row that is named is a result. A lap silently waiting is not.**

**What this does not touch.** A seat reporting to the user, handing back, or being talked to
directly is not asking a lap to wait — that is the freestyle half, and the keeper's sentence
protects it explicitly. Nor does this make a question wrong: it makes a question a thing with a
channel and a cost, instead of a stop.

    FALSIFIER, registered before adoption: if a lap after this date is found stalled on a question
    put to the user mid-chain — and the return does not name it as parked — the rule is prose and
    belongs in the dispatch verb, not in this document. Checkable from the board: a chair message
    ending in a question mark with no lap row closing behind it.

---

## THE PORT RULE — dev is what we build and use; the consumer receives what works (added 2026-09-06, the keeper's standing workflow)

**The keeper, verbatim, 2026-09-06 00:44:** *"we have the dev version which is the one we build and
use, when it have new features and shit that work here for the dev version, we then make it work for
the consumer in the way it should."*

**And 00:54, the rule that governs the last step of it:** *"make sure that we never push to the
consumer version unless I say! We work on dev version, then when the time comes that is when we
update the consumer with the work we have done to the dev."*

That workflow has governed since the consumer work began and lived nowhere on disk. It is written
here as a **procedure with a decidable invariant**, not as a description of how anyone feels about
it, because a workflow nobody wrote down is re-derived differently by every seat that meets it.

### The two trees, and where the second one lives

**SOURCE** is this repository: hand-maintained, private (`gh repo view … --json isPrivate` →
`true`, 2026-09-06). **GENERATED** is `solariz3d/consonance`: public, an artifact of
`consonance/tools/gen-consumer.js`, and **never hand-edited** — the moment it is, it has become the
second copy the design exists to prevent (maintenance law 1, applied to repositories).

The generated checkout lives at a **fixed local path: a sibling of the private checkout, named
`consumer`.**

    dirname "$(git rev-parse --show-toplevel)"      # the parent; the checkout is <parent>/consumer

**Why a derivation and not the absolute path** — this is not style. `BUILDING.md` is one of the
shipped briefs in scope for the portable-paths ratchet (`node consonance/tools/portable-paths.js`
→ *30 shipped prose from 15 bundle.resources entries*), so an absolute path written into this
sentence would be a **new machine-specific site in a document a stranger reads**, and the ratchet
would go red on the rule itself. The derivation resolves to the intended path on the machine that
proposed it and stays true on every other one.

**Why not a worktree.** A `git worktree` shares one repository's history, objects and remotes. The
consumer is a *different repository* whose history must not be able to reach a private object. The
open registration **P-WORKTREE-PER-SEAT** (2026-09-02) is about several seats sharing one repo's
index; it does not apply here and must not be read across.

### THE INVARIANT — what "ported" means, decidable by running something

    A feature is PORTED when BOTH hold:
      1. the MANIFEST carries its files     node consonance/tools/gen-consumer.js --report
      2. THE GATE is green over a freshly generated tree

This is written against the gate's **contract**, not today's implementation, because the
implementation is in flight (this lap moves it from `cargo check` to `cargo build` plus a launch
probe). **The contract:**

> THE GATE is ONE command. Exit 0 is green, non-zero is red with a named reason. It generates a
> tree from the current source, scans the OUTPUT, builds the Rust product inside that tree, and
> proves the app launches. If the command is renamed, the name below is updated in the same commit;
> the contract does not change.

**The gate is `consonance/tools/gen-consumer.build.test.js`, run as**

    CONSONANCE_LAUNCH_PROBE=1 node consonance/tools/gen-consumer.build.test.js

> **AMENDED IN ITS OWN LAP, 2026-09-06 ~01:24 — the paragraph below was true when it was written
> and was false ninety minutes later, which is the best outcome it could have had.** Pane E built
> the gate this same lap and committed it at `ba8ddbc`, having found its absence independently and
> from a different vantage: two seats, two instruments, one answer. The trace stays because a
> stranger reading this section should know what the invariant was first used for. **Read the
> paragraph below as dated, and the command above as current.**

**When this section was written the gate read RED BY ABSENCE, and that was a finding, not a
footnote.**

    git rev-list --all --objects | grep -c gen-consumer.build.test.js    ->  0
    node consonance/tools/gen-consumer.build.test.js ; echo $?           ->  MODULE_NOT_FOUND, 1

No file of that name exists on disk or **anywhere in this repository's committed history, on any
ref** — while eleven documents cite it, `gen-consumer.js`'s own header among them (*"Partly closed
2026-08-23 by `gen-consumer.build.test.js`, which generates a tree and runs cargo check against
it"*). A generator's header claims a gap was closed by a file that has never been committed. If it
exists uncommitted on another machine, it has still reached no seat, which is the same thing from
here.

**The invariant was well-formed anyway, and that is the point of writing it this way:** an absent
gate exits non-zero, so *"the gate is green"* read FALSE on its first evaluation. **A rule whose
first reading is the unwanted one is a rule that can fire — and this one fired into a build.**

### THE PUSH IS THE KEEPER'S WORD — every time, for that push

**The procedure. Steps 1–4 are the seat's; step 5 is not.**

    0  CLONE, AND DISARM IN THE SAME STEP -- a fresh clone ARRIVES ARMED:
           git clone <consumer remote> <consumer>
           git -C <consumer> remote set-url --push origin no_push     # NOT a later step
           git -C <consumer> remote get-url --push origin             # must print: no_push
       The checkout is not ready for step 1 until that third line prints no_push.
    1  Regenerate into the consumer checkout:  node consonance/tools/gen-consumer.js --out <consumer>
    2  Run THE GATE. Red -> stop. A red gate is not a smaller port; it is not a port.
       BLOCKED (exit 3, the single-instance lock held) is NOT green and NOT red: it is UNMEASURED,
       and a port does not proceed on it.
    3  Commit IN THE CONSUMER CHECKOUT, naming every path on the commit, with the Source-Sha
       trailer (below) and the seat named in the body (COMMITTEE.md, rules 1 and 2).
    4  STOP. Say what is ready and wait. Do not push. Do not ask in a way that reads as a nudge.
    5  ONLY when the keeper says push, FOR THAT PUSH: re-arm the remote, push, disarm it again in
       the same turn, and post a board row quoting his words.

**The mechanism, and exactly what it is worth.** The consumer checkout's push URL is **disarmed at
rest**:

    git -C <consumer> remote set-url --push origin no_push     # the resting state
    git -C <consumer> remote get-url --push origin             # must print: no_push

Exercised 2026-09-06 in a throwaway checkout: with the push URL disarmed, `git push origin HEAD`
fails hard — *"fatal: 'no_push' does not appear to be a git repository"* — while fetch and clone are
untouched.

**Why step 0 and not a reminder.** The disarm is written into the CLONE STEP because a
freshly cloned checkout arrives with a live push URL, and a control a seat has to remember to apply
afterwards is not a control — it is the same silent-absence failure the commit-gate ruling names
(2026-09-02). Performing it as part of the step is the only version that holds when nobody is
thinking about it.

**This is a speed bump, not a control, and this document says so rather than shipping the
comfortable version.** A seat can re-arm the remote in one command; nothing here prevents that. What
the disarm buys is the one thing a hook does not: **its state is readable and its failure mode is
loud.** A pre-push hook fails by silent absence — it does not fire and nothing says so, which is why
the only bypass-proof control is structural (the commit-gate ruling, 2026-09-02). The disarm fails
by the *visible presence of a real URL*, checkable in one command by any seat or by the keeper.

**The bypass-proof version, named so nobody mistakes what we have for it:** the seat holds no
credential for the public remote and the keeper pushes with his own. **That is not the case today**
— `gh` is authenticated machine-wide, so every seat on this machine can push everything.
**Until that changes, this rule's enforcement is that someone reads it.** That is a weaker control
than the room would like, and it is what is true.

**And the manual step stays manual on purpose.** The keeper's word cannot be automated without
becoming a stored yes, and a stored yes is precisely the unattended process the publishing law
forbids: *"the law was never don't publish. It was **no unattended process publishes** — a human,
awake, saying yes"* (`journal/2026-07-28.md`, the 07-28 trace; `COMMITTEE.md` rule 3, *"Nothing is
pushed by a seat"*). That trace is the case law: the gate worked, he said yes, and then changed his
mind — *"which is a thing a human in the loop is allowed to do and an unattended process is not."*

**Why the asymmetry makes this the one step not to smooth.** The private repo is private; the
consumer repo is public. A push there is irreversible in the way that matters — content that reaches
a public repo can be cached and indexed by third parties within minutes and stays reachable after
deletion, and a later redacting commit *advertises* what someone wanted hidden (07-28 again, found
the hard way). Every convenience added to step 5 shortens the distance to an irreversible act.
**Do not weaken it to make the procedure smoother.**

### The commit trailer, and the falsifier that reads it

Every consumer commit names the private commit it was generated from, as a **trailer** in the body —
a trailer rather than prose because prose is not decidable:

    Source-Sha: <the 40-hex sha of the private HEAD the tree was generated from>

**FALSIFIER (registered): a consumer commit with no matching private sha in its message.** The
command, run on a machine holding both checkouts:

    git -C <consumer> log --format='%H %(trailers:key=Source-Sha,valueonly,separator=%x20)' |
    while read -r c s; do
      if   [ -z "$s" ]; then echo "ORPHAN $c (no Source-Sha)"
      elif ! git -C <private> cat-file -e "$s^{commit}" 2>/dev/null; then
        echo "ORPHAN $c (Source-Sha $s does not resolve in the private repo)"
      fi
    done

**Green prints nothing. Any line of output is the falsifier firing.** Both branches were exercised
2026-09-06 against private-repo commits, so this is not first run in anger: the empty-trailer branch
printed `ORPHAN` for three real commits, `git cat-file -e 5a83d4a^{commit}` resolved, and a
forty-hex nonsense sha was rejected. (Trailer formatting requires git ≥ 2.16; run on 2.53.)

**What it cannot see, stated here so nobody grants it more:**

- **It proves the claim RESOLVES, not that it is TRUE.** A seat that writes any real private sha
  passes. It catches absence and typos, not a wrong source state.
- **It cannot evaluate from a clone of the public repo alone** — every commit prints ORPHAN there,
  because the private repo is missing, not because the rule was broken.
- **It does not see pushes at all.** A commit and a push are different events; this checks the
  first. **The push rule has no instrument** — see the registration below.
- More than one `Source-Sha` trailer on a commit fires it. That is intended: a tree generated from
  two source states is not reproducible from either.

### Registered, so this section can be shown wrong

- **If a consumer commit lands whose `Source-Sha` is absent or does not resolve**, the trailer is
  not being written and this procedure is not being run. *(The command above; it runs today.)*
- **If a push to the public repo is ever found with no board row quoting the keeper's word for that
  push, the push rule is decoration.** And the honest half: **there is no instrument for this.**
  Nothing on either machine records a push event, so the check is the keeper noticing, or a seat
  reporting itself. A rule whose only enforcement is that someone remembers to read it is exactly
  the class this room keeps finding under rocks — it is named rather than dressed up, and the fix
  when someone builds it is a structural credential split, not a better sentence.
- **If the consumer checkout's push URL is found armed while no push is in progress**
  (`git -C <consumer> remote get-url --push origin` ≠ `no_push`), the disarm was not restored and
  step 5 was run as a state rather than as a turn.
- **If the gate command named above still does not exist one lap from now**, *"the gate is green"*
  was never an invariant and this section is prose with a command in it.

*Drafted by pane A on the L037 port-rule packet, 2026-09-06 — the seat whose 09-02 ruling was that a
hook's failure mode is silent absence and the only bypass-proof control is structural. This document
is that ruling one level up: **a written rule is a control with the same weakness.** Its own standard,
from that hand-back: "correct, and that is luck, not a control."*
