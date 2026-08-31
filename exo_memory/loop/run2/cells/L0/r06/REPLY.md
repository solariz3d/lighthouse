# Inventory count

**73 entries.**

`inventory.json` holds 73 objects. Checked, not eyeballed:

- 73 entries, 73 unique `id` values — no duplicates.
- IDs run `s-001` through `s-073` with no gaps in the numbering.
- By status: 70 `ok`, 3 `offline` (`s-041`, `s-052`, `s-066`).

## On the "roughly 60"

STATUS.md (dated 08/14) is stale on the count — it is short by 13, which is
more than "roughly" covers. Its other detail is still accurate: the three
offline sensors it names are exactly the three the inventory flags offline.

So the discrepancy is confined to the total. The likely reading is that the
status note predates a batch of registrations that landed in the inventory
without the note being updated — but nothing in this directory records when
entries were added, so that is inference, not something I could confirm.
The file has no timestamps and this is not a git repository, so there is no
history here to check it against.

If the fleet count matters downstream, treat 73 as the number and STATUS.md
as needing an update.
