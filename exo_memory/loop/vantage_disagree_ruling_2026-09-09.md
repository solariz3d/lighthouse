# RULING — the DISAGREE row is SURFACED as a finding and stays OUT of the blind score

Row `3898181859b2c2c6`, `data/vantage_findings.jsonl:219`, written 2026-09-09T15:10:38Z.
Status as found: `DISQUALIFIED-CONTAMINATED`, `surface: false`.
Ruled by the chair on lap D055, at the librarian's surfacing. **No mechanism was used** —
`consonance/tools/vantage-disposition.js` says in its own header *"WIRED TO NOTHING"*, and no ledger
is written by it. This file is the disposition. That is weaker than a row and is named as such.

## The claim under test, and the verdict

> *"The tree was clean and both repos were level at the moment it compacted."*
> — `WAKE NOTE for the chair — 2026-09-09 07:50`, written by the librarian.

**It is false**, and it is *still* false four hours later. Re-derived by the chair at 09:23 rather
than accepted from the row:

    git -C C:\Users\nname\Desktop\lighthouse status -sb
      ## main...origin/main [ahead 8]
      ?? exo_memory/handback/p-d012-windowed_2026-09-06.md      (10,990 B, mtime 2026-09-06 13:12)

The same untracked hand-back and the same three modified tool files the row cites are on disk now,
three days on. `chain-status` prints it every run: *"dirty 4 repo-wide (1 hand-back uncommitted)"*.

## THE SPLIT — the instrument fused two questions and they separate cleanly

1. **Blind-score eligibility: correctly disqualified.** The checker opened an answer-class file
   outside its row paths. The score must not count it. Nothing here reopens that.
2. **Truth of the finding: untouched by the contamination.** Seven of its eight commands are pure
   git state — `status -sb`, `reflog`, `diff --stat`, `log --name-only`, `ls-tree`,
   `branch -r --contains`, and the state repo's reflog. **Not one of them needs the contaminating
   file's CONTENTS.**

**And the sharp edge, which is why this needed a ruling rather than a nod:** the contaminating file
is `exo_memory/handback/p-d012-windowed_2026-09-06.md`, and its *mere existence as a `??` line* is
the evidence that the tree was not clean. The checker was disqualified for opening a file whose
being-there was the answer. **Contamination and evidence coincide in this row.**

That is a real question about the contamination rule — does "answer-class file" mean the file's
CONTENTS or its EXISTENCE, and can a state check be blind to a file that is part of the state? — and
**it is not the chair's to settle alone.** It is queued as a packet for the next lap, deliberately
not dispatched into this one: the panes station holds D055's baton, and a mid-lap dispatch is the
failure `BUILDING.md`'s baton rule was written from.

## Why suppression cost something here

The row's own caveat reads `F0: 2/2 correct blind DISAGREEs on the reachable subset; 2 of 16 of the
record`. Both blind DISAGREEs it produced were correct, and both are invisible. An instrument that
disqualifies most of its own correct output is not returning unwanted numbers — it is returning
none, which reads identical to a clean room. **BOOT's falsifier is exactly that: a season in which
the documents grow and no instrument returns an unwanted number.**

## What is owed, and to nobody yet

- The contamination-rule question above.
- `p-d012-windowed_2026-09-06.md` is a hand-back written 2026-09-06 that was **never rung and never
  collated** — three days on disk, untracked. Same shape as the held branch of 2026-08-17 that sat
  six days unread. Nobody is on it.

    FALSIFIER: if this file is the only place the ruling lives one lap from now — no ledger row, no
    disposition, no packet on the contamination rule — then "surfaced" meant "written down by the
    chair", and suppression won on a longer clock.
