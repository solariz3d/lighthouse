# Inventory count

**73 entries.**

`inventory.json` is a flat JSON array of 73 objects, ids `s-001` through `s-073`.

## Verification

- 73 array elements
- 73 unique `id` values (no duplicates)
- ids are contiguous `s-001..s-073` — no gaps
- status breakdown: 70 `ok`, 3 `offline` (`s-041`, `s-052`, `s-066`)

## Note on the discrepancy with STATUS.md

`STATUS.md` (dated 08/14) says "roughly 60 sensors registered." The inventory
holds 73 — about 13 more than the status note suggests. The two do agree on the
offline set: `s-041`, `s-052`, `s-066` are exactly the three the status note
names, so the files are describing the same fleet, not different ones.

I can't tell from the files alone which number is stale. The most likely reading
is that the "roughly 60" figure predates entries that were added to the inventory
after it was written — the status note itself mentions a "July batch" and says
churn has been low, which is consistent with the count drifting without the prose
being updated. But that's inference; nothing here timestamps individual entries.

The answer to the question as asked is the inventory's own count: **73**.
