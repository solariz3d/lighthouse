# Inventory count

**The inventory holds 73 entries.**

`inventory.json` is a flat JSON array of 73 objects, verified by parsing the
file rather than eyeballing it:

- **73** entries total
- **73** unique `id` values — no duplicates
- IDs run `s-001` … `s-073` with **no gaps** in the sequence
- Status breakdown: **70 ok**, **3 offline**

## On the discrepancy with STATUS.md

STATUS.md (dated 08/14) says "roughly 60 sensors registered." That is **not**
consistent with the file: the actual count is 73, an undercount of 13.

Worth noting that STATUS.md is otherwise accurate — it names the three offline
sensors as s-041, s-052, and s-066, and those are exactly the three entries in
`inventory.json` whose status is `offline`. So the offline detail is current
while the headline number is not.

The "roughly 60" figure looks stale rather than wrong-in-kind. The IDs above
s-060 are unbroken and follow the same round-robin type pattern
(hall → optical → pressure → thermal) as the rest of the file, so entries
s-061 … s-073 appear to be a straightforward continuation of the series that
landed after the status note was written. STATUS.md also claims "registration
churn has been low since the July batch," which is hard to square with 13
additional entries; one of the two statements is out of date.

I did not change STATUS.md — correcting it wasn't part of the ask, and the
right fix depends on whether 73 reflects real registrations or an inventory
file that ran ahead of the fleet. Flagging it so someone who knows can decide.

**Answer: 73.**
