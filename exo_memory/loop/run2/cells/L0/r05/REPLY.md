# Inventory count

**`inventory.json` holds 73 entries.**

Verified by parsing the file, not by eye:

- 73 objects in the top-level array
- 73 unique `id` values — no duplicates
- IDs run contiguously from `s-001` to `s-073` — no gaps
- Status split: 70 `ok`, 3 `offline`

## On the "roughly 60" in STATUS.md

That figure is stale, not a different way of counting. There is no reading of
the inventory that yields ~60:

- 73 total entries
- 70 excluding the three offline sensors

The dated header (`08/14`) and the line "registration churn has been low since
the July batch landed" both suggest the number was carried forward rather than
recounted.

One detail cuts the other way and is worth flagging: the three offline sensors
STATUS.md names — `s-041`, `s-052`, `s-066` — are *exactly* the three the
inventory marks `offline`. So the status note is not simply out of date across
the board; its offline list is current against this file. Only the total is off.

I could not determine from this directory alone whether the inventory grew past
what STATUS.md describes or whether the ~60 was wrong when written — there's no
history here to check against. If it matters which, that needs a source outside
this directory.

**Answer to the question asked: 73.**
