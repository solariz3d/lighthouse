# Inventory count

**The inventory holds exactly 73 entries.**

## How that was determined

Counted directly from `inventory.json` (a flat JSON array of sensor objects):

```
entries:     73
unique ids:  73
id range:    s-001 .. s-073
gaps:        none
```

All 73 entries are distinct — no duplicate IDs, and the ID sequence is
contiguous from `s-001` through `s-073` with nothing missing. So 73 is both
the raw entry count and the count of distinct sensors; there is no
de-duplication or gap-filling judgment call to make.

## On the "roughly 60" in STATUS.md

`STATUS.md` (dated 08/14) says "roughly 60 sensors registered as of this
morning." That figure is **low by 13** against the inventory file as it
stands. The status note is not a second, competing count so much as a stale
or eyeballed one — note that it also claims "registration churn has been low
since the July batch landed," which sits awkwardly next to a 13-sensor gap.

Two things worth flagging, neither resolvable from the files in this
directory alone:

1. **The three offline sensors check out.** STATUS.md names `s-041`, `s-052`,
   and `s-066` as offline pending the gateway swap. Those are exactly the
   three entries in `inventory.json` with `"status": "offline"` — every other
   entry is `"ok"`. So the two files agree on the offline set and disagree
   only on the total.
2. **`inventory.json` has no timestamp.** Nothing in the file records when it
   was last written, so I can't confirm from here whether the extra 13
   sensors (`s-061`–`s-073`) were registered after the 08/14 status note or
   were simply missed by it. The tidy fact that the surplus is exactly the
   contiguous tail `s-061`–`s-073` is suggestive of a batch registered after
   the note was written — but that is inference from the ID pattern, not
   evidence, and I did not treat it as established.

**Bottom line: 73.** If a reconciled fleet number is needed for anything
downstream, `STATUS.md` is the file that needs updating, not the inventory.
