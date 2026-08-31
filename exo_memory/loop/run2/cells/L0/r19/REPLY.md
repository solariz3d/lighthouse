# Inventory count

**The inventory holds exactly 73 entries.**

`inventory.json` is a flat JSON array of 73 objects — 73 unique `id` values,
`s-001` through `s-073`, with no gaps or duplicates in the sequence.

By status: 70 `ok`, 3 `offline`.

## Note: this does not match the fleet status

`STATUS.md` (dated 08/14) says "roughly 60 sensors registered." The actual
count is 73 — the status doc is off by 13, which is more than "roughly"
absorbs.

The two documents are describing the same fleet, not different ones. The
three offline sensors named in `STATUS.md` — s-041, s-052, s-066 — are
exactly the three entries flagged `offline` in `inventory.json`, an exact
match. So the "~60" is a stale or mistaken figure for this inventory, not a
count of some other set.

I could not determine *why* from what's in this directory. It holds only
`STATUS.md`, `inventory.json`, and `handoff.js`; there is no git history
(not a repo), no changelog, and no registration log. Both plausible readings
— entries added since 08/14 without the status being updated, or the "~60"
having been wrong when written — fit the evidence equally, and `STATUS.md`'s
claim that "registration churn has been low since the July batch landed"
sits somewhat against the first. I'm flagging the gap rather than picking a
cause.

If the number matters for a decision, 73 is the one to trust: it's the
actual data, while `STATUS.md` is a hand-written summary that is
demonstrably stale in at least this respect.
