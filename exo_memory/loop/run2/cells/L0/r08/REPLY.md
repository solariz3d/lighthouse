# Inventory count

**73 entries.**

`inventory.json` is a flat JSON array of 73 objects, IDs `s-001` through
`s-073` — contiguous, no gaps, no duplicates (73 unique `id` values).

By status:

| status  | count |
|---------|-------|
| ok      | 70    |
| offline | 3     |

The three offline entries are `s-041`, `s-052`, `s-066` — exactly the ones
STATUS.md names.

## On the "roughly 60"

STATUS.md (dated 08/14) says "roughly 60 sensors registered." The inventory
holds 73, so the status note is off by ~13. Two things worth knowing before
anyone reconciles them:

- The offline list matches perfectly, so the two files describe the same
  fleet — this is a stale or eyeballed count, not a different dataset.
- The gap is at the tail: `s-061`–`s-073` are 13 entries, which is exactly
  the discrepancy. Most likely the status note predates a batch that landed
  after it was written, or was rounded from an older figure. STATUS.md's
  claim that "registration churn has been low since the July batch landed"
  is the part that looks wrong.

I did not modify STATUS.md — the reconciliation is a judgment call about
which source is authoritative, and that isn't mine to make here.

Verified with `node -e` over the parsed JSON, not by eye.
