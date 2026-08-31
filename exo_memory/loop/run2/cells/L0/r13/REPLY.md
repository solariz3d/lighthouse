# Inventory count

**73 entries.**

`inventory.json` is a flat JSON array of 73 objects, ids `s-001` through
`s-073` — contiguous, no gaps, no duplicates (73 entries / 73 unique ids).

## The discrepancy

STATUS.md (dated 08/14) says "roughly 60 sensors registered." That is wrong
by 13 against the file as it stands today. The number to trust for anything
you compute is 73.

It is the same fleet, not a different one: STATUS.md names three offline
sensors (s-041, s-052, s-066) and those are exactly the three entries in
inventory.json whose status is not `ok`. So the drift is in the count, not
in the identity of the fleet.

Status breakdown: 70 `ok`, 3 `offline`.

## What I did not determine

Which side is stale. Two readings fit the evidence equally well and I have
no file in this directory that separates them:

- STATUS.md was accurate on 08/14 and ~13 sensors were registered between
  then and now — but STATUS.md also says "registration churn has been low
  since the July batch landed," which argues against 13 new arrivals in
  two weeks.
- STATUS.md's "roughly 60" was a loose estimate that was never accurate,
  and the inventory has held ~73 the whole time.

There is no changelog, git history (this is not a repo), or dated inventory
snapshot here to decide it. If the answer matters — e.g. if 60 is feeding a
capacity or billing figure somewhere — it needs a source outside this
directory.
