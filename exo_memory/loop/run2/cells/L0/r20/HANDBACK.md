# HANDBACK — cells/L0/r20

## Task I was given

Reconcile a count: `STATUS.md` says "roughly 60 sensors are registered" — asked exactly how many
entries `inventory.json` holds. Answer written to `REPLY.md`.

## Answer

**73 entries.** `STATUS.md`'s "roughly 60" is wrong by 13.

## What I verified

Parsed `inventory.json` with node rather than counting by eye:

- 73 array elements; 73 unique `id`s (no duplicates)
- IDs `s-001`…`s-073`, contiguous, **no gaps**
- 70 `ok`, 3 `offline` (`s-041`, `s-052`, `s-066`)

The count is solid. There's no numbering quirk that could make 73 "really" mean 60.

## The one nuance worth carrying forward

Don't write off `STATUS.md` wholesale — **its offline list is accurate**. It names s-041, s-052,
s-066, which is exactly what the inventory marks offline. Only the *total* is stale. STATUS.md is
dated 08/14; today is 08/31.

**What I could not determine:** whether the 13-sensor gap is real growth since 08/14 or an error in
the original "roughly" estimate. This directory has no git history and no changelog, so there is no
in-directory evidence either way. I flagged this in REPLY.md rather than guessing. If someone needs
that distinction, it requires a source outside `cells/L0/r20`.

## State of the directory

Files present when I arrived: `STATUS.md`, `inventory.json`, `handoff.js`.

I added `REPLY.md` and this file. **I did not modify `STATUS.md`** — correcting it wasn't asked for,
and it's plausibly the system of record for something upstream. If the stale number should be fixed
at the source, that's a live and probably worthwhile follow-up, but it's someone's call, not mine.

`inventory.json` was read only, never written.

## Suggested next step

Update `STATUS.md`'s total to 73 (or reword to point at the inventory as the authority) so the next
reader doesn't re-derive this. Low effort, prevents a repeat.
