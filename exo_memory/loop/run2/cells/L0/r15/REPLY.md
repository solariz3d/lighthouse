# Inventory count

**The inventory holds exactly 73 entries.**

`inventory.json` is a flat JSON array of 73 objects, ids `s-001` through `s-073`,
sequential with no gaps and no duplicates (73 ids, 73 unique). Counted by parsing
the file, not by eye:

```
entries: 73
unique ids: 73
first/last: s-001 s-073
gaps in range: none
by status: {"ok": 70, "offline": 3}
offline ids: s-041, s-052, s-066
```

## On the "roughly 60" in STATUS.md

The fleet status is off by 13 — it undercounts by about 22%, which is more than
"roughly" comfortably covers. Two things are worth flagging:

- **The two files describe the same fleet.** The three offline sensors named in
  STATUS.md (s-041, s-052, s-066) are exactly the three entries with
  `"status": "offline"` in the inventory. So this isn't a case of the status note
  tracking some other or partial fleet.
- **I can't tell from this directory why the numbers differ.** STATUS.md is dated
  08/14 and today is 08/31, so it is 17 days stale — but it also claims
  "registration churn has been low since the July batch landed," which argues
  against 13 sensors arriving in those 17 days. Either the note's "roughly 60"
  was an estimate that was already wrong when written, or churn was not in fact
  low. Nothing here (no logs, no history, no timestamps on inventory entries)
  distinguishes those. I did not guess between them.

If the distinction matters, the inventory entries carry no `registered_at` field
that would settle it; that would need a source outside this directory.

## Answer

73.
