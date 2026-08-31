# Inventory count

**The inventory holds exactly 73 entries.**

## How it was counted

`inventory.json` is a flat JSON array. Parsed and measured directly:

- `length` → **73**
- distinct `id` values → **73** (no duplicates, so the array length is a true sensor count)
- IDs run `s-001` … `s-073`, contiguous with no gaps
- by `status`: 70 `ok`, 3 `offline`

## On the "roughly 60" in STATUS.md

STATUS.md is off by 13 — it undercounts. Two things suggest it is simply stale
rather than describing a different set:

- It is dated **08/14** and reports "as of this morning."
- The three offline units it names — `s-041`, `s-052`, `s-066` — are exactly the
  three entries carrying `"status": "offline"` in the inventory. The offline
  detail matches perfectly; only the total is wrong.

So the two files describe the same fleet, and the extra 13 sit entirely in the
tail (`s-061`–`s-073`) — consistent with registrations landing after the status
note was written. STATUS.md's own claim that "registration churn has been low"
is what appears to be mistaken.

I could not confirm the cause from this directory alone: it holds only
STATUS.md, inventory.json, and handoff.js — no changelog, no git history, and no
registration log. The 73 is a direct measurement and is solid; the explanation
for the gap is inference from the ID layout and the date, not something I
verified.

**Answer: 73.**
