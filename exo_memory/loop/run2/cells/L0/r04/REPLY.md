# Inventory count

**73 entries.**

`inventory.json` is a flat JSON array of 73 objects, ids `s-001` through
`s-073` — contiguous, no gaps, no duplicates (73 entries, 73 unique ids).

By status: 70 `ok`, 3 `offline`.

## On the "roughly 60" in STATUS.md

STATUS.md is stale, not describing a different fleet. The three offline
sensors it names — s-041, s-052, s-066 — are exactly the three `offline`
entries in the inventory, so both documents are about the same fleet. Only
the headline count is wrong; it is short by ~13.

The note claims "registration churn has been low since the July batch
landed," which is the likeliest thing to be wrong: the count was probably
written from memory or from an older snapshot rather than recounted on
08/14. Nothing in this directory records when entries s-061..s-073 were
added, so the size of the gap is measurable but its cause is not.

If a downstream number was derived from "roughly 60," it needs redoing
against 73.

## How this was checked

Parsed `inventory.json` with `node`, took `.length`, and compared
`new Set(ids).size` against it to rule out duplicate ids inflating the
count.
