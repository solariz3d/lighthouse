# Inventory count

**73 entries.**

`inventory.json` is a flat JSON array of 73 objects, `s-001` through `s-073`.

- 73 unique ids — no duplicates
- No gaps in the `s-001`..`s-073` numbering
- Status split: 70 `ok`, 3 `offline` (`s-041`, `s-052`, `s-066`)

## On the "roughly 60" in STATUS.md

The fleet status is off, and it is the status note that's wrong, not the inventory.

STATUS.md is dated 08/14 (today is 2026-08-31) and gives a soft estimate
("roughly 60 ... as of this morning"). The three offline sensors it names are
exactly the three the inventory flags offline, so both files describe the same
fleet — the inventory simply holds 13 more sensors than the note estimates.

I can't tell from the files in this directory whether that gap is 13 sensors
registered since 08/14 (the note also claims "registration churn has been low",
which would argue against it) or whether the ~60 was always a loose eyeball
number. Either way, 73 is the count the inventory actually holds. Someone with
registration history should reconcile the note.
