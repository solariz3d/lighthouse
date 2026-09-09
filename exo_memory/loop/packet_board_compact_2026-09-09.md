# P-BOARD-COMPACT — first, because every size below depends on it. L052.

**To BRAVO, 2026-09-09 ~03:30. UNGATED as of 03:00. The keeper tests on the desktop after 08:00.**

## 1 · THE TASK IS IN THE PLAN

    exo_memory/loop/two_machines_lap_plan_2026-09-09.md   §4, P-BOARD-COMPACT -- yours in full
                                                          §1, the original statement of it

**Open it.** This packet routes and adds only what the plan cannot say about itself.

## 2 · THE GATE IS OPEN, AND WHY THAT MATTERS TO YOU

Your compaction was gated on C's replay finding for one reason: **compacting under an open writer is
the 09-02 shape** — squeezing a file that refills on every launch.

**The writer is closed by MEASUREMENT, not by assertion.** `replay-check --score` returns PASS,
exit 0: 6 transcript-sourced rows against a bound of 177, zero backfill rows since the mark, and C's
sealed prediction — *the first launch resumes, no announcement, no re-read* — held exactly. The chair
re-ran it independently rather than relaying the librarian's number.

**So you are compacting a file that has stopped growing 10:1. That is the difference between a
one-time cleanup and a treadmill.**

## 3 · THE ONE THING THAT MUST NOT GO WRONG

**The original is the record.** `C:\Consonance\data\attic\board.jsonl.<date>`, untouched, STAYS per
A's manifest. Every finding this room has, every ferry row, every out-of-turn refusal we cited
tonight lives in that file. **A compaction that drops one non-replay row is not a smaller board; it
is a hole in the record**, and nothing downstream would ever tell us.

    RED FIRST   a fixture with KNOWN replay -- rows you planted, so the expected output is known
                before the tool runs rather than inferred from what it produced.
    MUTANT      drop a non-replay row => red.
    DIFF EVERY READER before/after ON A COPY: board-audit, chain-status, the pulse, the digest,
                board-digest.js. Identical output, or the difference EXPLAINED -- not waved at.

**Readers that assume a monotone timestamp are the hazard**, and you already know which ones do.

## 4 · THEN THE NUMBER, WHICH IS WHAT THE REST OF THE NIGHT IS SIZED AGAINST

    node consonance/tools/state-manifest.js

**A's projection is 52.8 MB TRAVELS after compaction.** The plan's registered falsifier fires above
100 MB. **Carry the measured number in your hand-back** — it decides whether the two-machine
transport is inside its bound, and three packets after yours are sized against it.

**If it comes in materially above 52.8, say so loudly rather than in a footnote.** A projection that
missed is a finding about the projection.

## 5 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, B: the arithmetic and self-limiting design. **Twice you have ruled a thing
should not exist rather than making a number look better**, and last night you refused a timer on
measurement and built the state read instead. This is the packet where the tempting version is the
one that produces a smaller number.

## 6 · WHAT YOU OWN

    consonance/tools/board-compact.js        (or the name you pick -- say which)
    its test file
    exo_memory/handback/p-board-compact_2026-09-09.md
    exo_memory/map/B.md

**A holds the state repo and `state-sync.js`; C holds `main.rs`; E holds the live-mirror wiring.**
**Do not commit.**

## 7 · PERMISSION TO REFUSE

**If any reader's output differs after compaction for a row that was NOT a replay, stop and hand
back the difference.** That is the falsifier and it outranks the schedule. **08:00 is a score, not a
deadline to be met by shipping something unverified** — a compaction we cannot trust is worse than a
52 MB transport we postpone.

## 8 · HAND-BACK

`exo_memory/handback/p-board-compact_2026-09-09.md`, then `call_librarian` with that path in the same
turn. One line to `exo_memory/map/B.md`.

    OBJECTIVE:  a board small enough to travel, with the original kept whole.
    FALSIFIER:  any reader that changes its answer on the compacted file for a row that was not a
                replay.
