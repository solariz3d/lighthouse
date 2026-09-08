# P-PROVENANCE — the compiler for the methodology report. L047.

**To BRAVO, 2026-09-08 ~06:45. Does not block P-TWO-MAP or P-LIT and must not touch `essay/` prose.**

## 1 · THE KEEPER'S CONCERN, VERBATIM, AND THE ANSWER THAT IS NOT "BE DILIGENT"

> *"it gets exponentially harder to do the methodology report once we do this, someone has to keep
> track of the turns and where they are going."*

**He is right about the difficulty and the room's answer is that nobody tracks it by hand.** Four
ledgers already record every move, independently and without anyone choosing to:

    git log --name-only -- essay/     what landed, by path, seat named in the commit body
    the lap ledger, L047 onward       who held the baton and when
    data/board.jsonl                  rows whose text names an essay/ path -- written on ARRIVAL,
                                      by mount, and a sending seat cannot suppress its own row
    essay/METHOD.md                   the Third Place seat's headed entries

**What is missing is the compiler.** Build it: `consonance/tools/essay-provenance.js`, printing ONE
table — **date · seat · what landed · path · the METHOD entry that recorded it, or `NO LOG ENTRY`
in red.**

## 2 · THE DESIGN QUESTION IS RECONCILIATION, NOT WALKING

Four sources with four different coverages will disagree, and **what the tool does when they
disagree is the whole instrument.** Rule on each case and print the ruling, never a silent join:

    a commit with no board row        landed without a dispatch -- by hand, or off-loop
    a board row with no commit        dispatched and never landed, or landed elsewhere
    a METHOD entry with no artifact   the log records something no path shows
    an artifact with no METHOD entry  THE RED CASE the librarian named
    a lap row with none of the above  a baton moved and nothing came of it

**Do not collapse these into one "mismatch" bucket.** Each names a different failure, and this room
has now missed the done-vs-never-started distinction nine ways in a fortnight — including twice
tonight, where `carrier-drift` reports a DELIBERATELY DELETED file as `MISSING-FILE` and
`forget-rate` reports the same intended act as *"1 files left the reading path"*. **Two instruments,
one deletion, both calling a success a fault.** Do not build the third.

## 3 · BARS

    RED FIRST   a fixture where a hand-back lands in essay/ with NO METHOD entry must print the
                red row. Show it red before the tool is right.
    MUTANT      drop the BOARD source => red. The board is the only one of the four a sending
                seat cannot suppress; a compiler that still looks complete without it is the
                dangerous version.
    MUTANT      drop the METHOD source => red.
    MUTANT      make every reconciliation case print one generic "mismatch" => red (§2).
    node consonance/tools/js-suite.js    state the count and what moved
    Say what you did NOT verify.

## 4 · WHAT THE TABLE IS FOR, AND THE RULE THAT COMES WITH IT

**The report's contribution table IS this output** — pasted whole, with the command printed beside
it, **recompiled at each milestone and never patched by hand.** A hand-edited table is a copy that
outranks its master, which is the telephone game's first step (maintenance law 1) applied to a
report about method.

    FALSIFIER (the librarian's):  a contribution the table cannot show means the loop was
                                  bypassed -- the exact case the keeper fears, made visible.

**The consequence for every seat, including the chair:** essay work goes through the loop — packets,
hand-backs into `essay/`, rows — or the table cannot see it. **That is a constraint on me before it
is one on you**, and this instrument is the thing that would catch me breaking it.

## 5 · SAY WHAT IT CANNOT SEE — this is not a footnote, it is the deliverable's other half

Every ledger here has a blind spot and the report will overstate itself unless the tool prints them:

    the board mutes every writer while data/blind.lock exists -- one window swallowed 2,473 entries
    all four ledgers are MACHINE-LOCAL; the desktop's work is invisible from here
    a seat's name comes from a commit BODY, which is prose and can be wrong or absent
    work done in a pane and never handed back appears NOWHERE

**Print these with the table, not in a comment.** A falsifier whose limits live only in its source is
a falsifier nobody applies limits to — the room's own line, and the reason `boundary-check` prints
its four blindnesses beside its verdict.

## 6 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, B: the arithmetic and self-limiting design. **You have twice ruled that
something should not exist rather than making a number look better**, you struck an item off a
fix-list as not real last lap, and you refused to absorb another seat's fixtures because the seat
that wrote the site owes the argument. **A provenance table is the easiest instrument in this room to
make flattering**, and you are the seat that does not.

**The librarian named E or A for this. Both are mid-turn on items 1 and 2, and body-assignment is the
chair's half of the split** (`BUILDING.md`, whose plan) — **so the reorder is stated here rather than
made silently**, which is what that section's registered falsifier requires.

## 7 · WHAT YOU OWN

    consonance/tools/essay-provenance.js
    consonance/tools/essay-provenance.test.js
    exo_memory/handback/p-provenance_2026-09-08.md
    exo_memory/map/B.md

**DO NOT TOUCH `essay/` PROSE — the prose is the Third Place seat's and that rule has no
exceptions.** You may READ `essay/METHOD.md` as a data source; you may not write it. E holds
P-TWO-MAP, A holds P-LIT, both landing into `essay/` — **do not read their hand-backs; they are
meant to arrive independently.** **Do not commit.**

## 8 · PERMISSION TO REFUSE

**If the four sources cannot be reconciled into one row per contribution without inventing a join
key that does not exist** — if, say, nothing reliably links a board row to the commit that followed
it — **say so and print two tables instead of one wrong one.** A tool that fabricates a
correspondence to look tidy is worse than a tool that admits the seam, and the seam would itself be
the finding.

## 9 · HAND-BACK

`exo_memory/handback/p-provenance_2026-09-08.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/B.md`.

    OBJECTIVE:  the methodology report compiles from the record instead of from anyone's memory.
    FALSIFIER:  a contribution the table cannot show.
