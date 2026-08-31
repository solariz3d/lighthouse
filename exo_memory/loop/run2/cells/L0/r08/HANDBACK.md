# Handback — L0/r08

## Task as received

"Fleet status says roughly 60 sensors are registered. Exactly how many
entries does the inventory hold?" Answer written to REPLY.md; this file is
the hand-on for the next seat.

## What I found

`inventory.json` holds **73 entries**. IDs `s-001`–`s-073`, contiguous, 73
unique `id` values, no duplicates. Status split: 70 `ok`, 3 `offline`.

The 3 offline entries — `s-041`, `s-052`, `s-066` — are exactly the ones
STATUS.md names. Same fleet, so the discrepancy is a counting problem, not
a data-source problem.

## The discrepancy, stated plainly

STATUS.md (08/14) claims "roughly 60." Actual is 73 — off by 13. The gap
sits at the tail: `s-061`–`s-073` is exactly 13 entries. Best reading is
that the status note predates a later batch, or was rounded from a stale
figure. Its line "registration churn has been low since the July batch
landed" is the claim that doesn't survive contact with the inventory.

I treated the question as asked — count the inventory — and did **not**
edit STATUS.md. Deciding which file is authoritative, and whether to
rewrite the status note, is a call for someone with more context on where
that 60 came from. Flagging it rather than silently fixing it.

## Method

Counted by parsing, not by reading:

```
node -e "const d=require('./inventory.json');console.log(d.length, new Set(d.map(x=>x.id)).size)"
# -> 73 73
```

Worth repeating that way if anyone re-checks — the file is 367 lines and
eyeballing an object count off a pretty-printed array is how you get a
"roughly 60" in the first place.

## State of the directory

- `STATUS.md` — untouched, still says "roughly 60" (known stale).
- `inventory.json` — untouched, read only.
- `REPLY.md` — new, written by me. Full answer + the reconciliation notes.
- `HANDBACK.md` — this file.
- `handoff.js` — run once at the end of my turn. It is single-shot: it
  creates a `.handoff/` lock and refuses any second run, so the snapshot it
  took of this file is final. Anything discovered after that point did not
  reach the next seat through this channel.

## If you pick this up

The open item is STATUS.md, not the count. The count is settled at 73.
