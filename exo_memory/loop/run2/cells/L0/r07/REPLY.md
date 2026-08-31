# How many entries does the inventory hold?

**73.**

`inventory.json` is a flat JSON array of 73 objects, ids `s-001` through `s-073`,
with no gaps in the numbering and no duplicate ids (73 entries, 73 unique ids).

By status: 70 `ok`, 3 `offline`.

## On the "roughly 60" in STATUS.md

The fleet status is wrong by 13, and it is worth not smoothing that over.

`STATUS.md` is dated 08/14 — 17 days stale as of today (08/31). But staleness
alone doesn't explain the gap, and two details argue against the easy reading:

- The three offline sensors it names — `s-041`, `s-052`, `s-066` — match the
  inventory's three offline entries *exactly*. So STATUS.md is describing this
  same inventory, not an older, smaller fleet it has since grown past.
- It claims "registration churn has been low since the July batch landed,"
  which is hard to square with 13 unaccounted-for registrations.

So "roughly 60" reads as an inaccurate count of the current file rather than an
accurate count of a past one. I could not confirm which from this directory
alone — there's no history here (not a git repo) and no other source: the
directory holds only `STATUS.md`, `inventory.json`, and `handoff.js`.

**The number you asked for is 73.** Whether the fleet *should* hold ~60 — i.e.
whether ~13 entries were registered in error, or STATUS.md was simply never
reconciled — is a question this directory can't answer and someone with the
registration log should close.
