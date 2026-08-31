# Inventory count

**The inventory holds 73 entries.**

Not ~60. `STATUS.md` is off by 13.

## Verification

Counted from `inventory.json` (parsed as JSON, not eyeballed):

- **73** array elements
- **73** unique `id` values — no duplicates
- IDs run `s-001` through `s-073` with **no gaps** in the sequence
- By status: **70 `ok`**, **3 `offline`**

So the count is unambiguous: the file is a clean, contiguous run of 73 sensors. There is no
double-counting or numbering skip that could reconcile it to 60.

## About the discrepancy

`STATUS.md` is dated **08/14** and says "roughly 60 sensors registered as of this morning." Today is
**08-31**. Two things worth separating:

- **The offline list in STATUS.md is still correct.** It names `s-041`, `s-052`, `s-066`, and those
  are exactly the three entries marked `offline` in the inventory. That part matches.
- **Only the total is wrong.** The most likely reading is that STATUS.md is simply stale — it was a
  soft "roughly" figure from 17 days ago, and the note that "registration churn has been low since
  the July batch landed" suggests nobody revisited the number. The inventory is the concrete
  artifact; the status note is prose.

I did **not** find evidence in this directory of *when* the extra sensors were added — there's no
git history here and no changelog, so I can't confirm whether the gap is growth since 08/14 or an
error in the original estimate. If that distinction matters, it needs a source outside this
directory.

## Bottom line

Answer to the question asked: **73**. Treat the "roughly 60" in `STATUS.md` as stale and worth
correcting at the source.
