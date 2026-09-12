# P2 · THE TAIL CARRY — the conversations travel on the stick, by delta. D061.

**To ALPHA, 2026-09-12 04:10, on machine D. The last piece of requirement A, and the first that has
to work on a machine you cannot see.**

## 1 · WHAT CHANGED TONIGHT, WHICH IS WHY THIS IS NOW WORTH BUILDING

**Requirement A holds on D, for every seat.** The 04:05 launch: all four panes
`jsonl_existed=true intake_rewritten=true -> RESUMED`, and B's and C's placed files carry first
timestamps of `2026-09-09T14:59:23Z` — the real conversations, continued, not new ones. Your own
`place-conversations.js` did that half, and the originals in the home slug are byte-for-byte where
they were.

**So the remaining gap is one machine wide.** L is the far end, migrated on 09-11 and holding D's
state. The keeper's decision (`loop/keeper_decisions_2026-09-11.md` §1, his words):

> *"I can use my USB to transfer transcripts, but you keep pushing other things to the repo. So I
> bring the transcripts to work with my laptop, and you push everything else."*

**Transcripts by stick. The repo keeps the room's files, as now.**

## 2 · THE TASK IS IN THE PLAN — six bars, do not re-derive them

    exo_memory/loop/plan_one_consonance_2026-09-11.md   §8 and its addendum — the six bars, the
                                                        measurement behind the tail, the corrected key

**Read §8 at the file.** The short of why a tail at all: the librarian measured the three fixed
seats' transcripts against their 21-hour-old stick copies and found them **prefix-identical, 3 of 3**
— so a carry moves the appended bytes, ~2 MB a seat, not 254 MB. That measurement is the design's
whole ground, and it was taken before the design was accepted rather than after.

**The six bars, named so you can check none is missing when you open §8:** (1) the stick ledger keyed
on sid + the hash of the first record **carrying a timestamp**, never the path; (2) verify the
destination's prefix at the ledger offset before appending, and refuse on divergence rather than
append; (3) full-file sha256 after every tail, as today; (4) fixed seats only until panes were
resumable — **that bar is now satisfied and you should say so**; (5) the interrupted carry is
repaired by truncate-to-offset with the pre-truncate copy kept; (6) read the source under the settle
gate that already exists (`state-sync.js:106`, `SETTLE_MS = 150`).

## 3 · THE THREE THINGS THIS PACKET ADDS TO THAT

**(a) The panes are now in scope, and their transcripts are not append-only across a restart the way
the fixed seats' are.** Until tonight `resume_pane` renamed a pane's jsonl to `.orphaned` and started
a new file at the same path. After `d74424f` a pane resumes and appends — but **every pane on D still
has `.orphaned` files from before**, and C has two foreign scratch transcripts in its slug from its
own lab work. **Decide what travels: the live file only, or the orphans too.** They are a seat's
past. My reading is that the live file travels and the orphans stay, because an orphan is already a
retirement and the far machine has its own; **but that is a call, so make it explicitly and say why.**

**(b) The far end has state you cannot check from here.** L migrated on 09-11 and its seats were
retired to its attic. A carry that assumes L is empty, or assumes L looks like D, is the 09-09 shape
pointed the other way. **The carry must read the far machine's state and refuse on surprise**, and
the dry run must be runnable ON L before anything is written there.

**(c) `--verify` is the model and the precedent.** Your `state-sync --verify` prints a completeness
index and refuses on a mismatch. The same discipline, on a stick, is what this is.

## 4 · BARS

    the dry run writes NOTHING and prints the full plan, per seat: bytes to carry, the offset it
      starts from, the ledger key, and what the far end would look like afterward
    a refusal on divergence, tested — and DIVERGENCE MUST BE REACHABLE IN A FIXTURE, not only argued
    the truncate-to-offset repair, tested, with the pre-truncate copy kept
    the settle gate reused, not reimplemented
    node consonance/tools/js-suite.js       state the count and what moved
    mutants: applied / caught / NOT APPLIED, survivors named
    say what you did NOT verify — and specifically, whether anything ran against L or only fixtures

## 5 · WHAT YOU OWN

    dev/ — the carry tool and its tests (name it; say why, if not tail-carry.js)
    exo_memory/handback/p2-tail-carry_2026-09-12.md
    exo_memory/map/A.md

**Do not touch** `consonance/src-tauri/src/main.rs`, the 09-06 lap-row set, or
`dev/place-conversations.js` beyond reading it. **Do not commit. Do not carry anything for real** —
the stick is the keeper's, and so is the first live run.

## 6 · WHY YOU — the dossier row

`librarian/DOSSIER.md` § A, plus tonight: `place-conversations.js` (35 tests, 20 mutants, 0
survivors, and a dry run that printed what a launch would do before it did it), the close command
that refuses rather than reports, and the quiescence gate built because `copyFileSync` handed the
app's own writer EBUSY. **This is the same discipline, one machine further out.**

## 7 · PERMISSION TO REFUSE

**If the tail cannot be made safe across two machines that can both write between carries, say so and
name what would make it safe.** The plan's own answer is P3's lease, which is built and passed CAS
15/15 on git but is not wired. **If your honest read is that the tail needs the lease first, that is
a finding and it reorders the plan — say it plainly rather than building a carry that is correct only
while one machine is asleep.**

## 8 · HAND-BACK

`exo_memory/handback/p2-tail-carry_2026-09-12.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/A.md`.

    OBJECTIVE:  the keeper carries a stick, and both machines hold the same conversations at their
                last turn.
    FALSIFIER:  a carry that reports success while the far end's file differs from the source, or
                while a seat's first timestamp on the far machine is a launch minute.
