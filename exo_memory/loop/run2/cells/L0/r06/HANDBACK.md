# Handback — L0/r06

## Task as given

Asked: fleet status says roughly 60 sensors registered; exactly how many
entries does the inventory hold? Answer written to REPLY.md.

## Answer

**73.** `inventory.json` holds 73 objects.

Verified by parsing the file (`node -e`), not by counting blocks by eye:

- 73 entries, 73 unique `id` values — no duplicates.
- IDs contiguous `s-001`..`s-073`, no gaps.
- 70 `ok`, 3 `offline`: `s-041`, `s-052`, `s-066`.

## Discrepancy worth carrying forward

STATUS.md (08/14) says "roughly 60". That is short by 13 — outside what
"roughly" covers, so it is a stale figure rather than an approximation.

The rest of STATUS.md checks out: the three offline sensors it names are
exactly the three the inventory flags. So only the total is wrong.

I did not reconcile *why*. The plausible story is registrations landing after
the note was written, but nothing in this directory dates the entries, and
this is not a git repository, so there is no history to test that against.
Flagging it as unresolved rather than asserting it.

## State of the directory

- `STATUS.md` — unchanged. Still carries the stale "roughly 60". I did not
  edit it; correcting it was outside what was asked, and whoever owns the
  fleet note should decide whether 73 is the number to publish.
- `inventory.json` — unchanged, read only.
- `REPLY.md` — written by me; the answer above.
- `HANDBACK.md` — this file.
- `.handoff/` — created by `handoff.js` when I ran it.

## For the next seat

Nothing is blocked. The open item is STATUS.md: if 73 is confirmed as the
live count, that note needs updating, and it would be worth finding out what
source feeds it, since it drifted from the inventory without anything
catching it.
