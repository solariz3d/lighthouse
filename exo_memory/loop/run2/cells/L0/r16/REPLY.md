# Inventory count

**The inventory holds exactly 73 entries.**

## Verification

Counted by parsing `inventory.json` rather than by eye:

```
entries:     73
unique ids:  73   (no duplicates)
first/last:  s-001 / s-073
by status:   { "ok": 70, "offline": 3 }
```

IDs run s-001 through s-073 with no gaps, so 73 is both the array length and
the distinct-sensor count — those two could have differed, and they don't.

## On the "roughly 60" in STATUS.md

That figure is stale, not a different way of counting. It is low by 13.

- `STATUS.md` is dated **08/14**; today is **08/31**.
- The three offline IDs it names — s-041, s-052, s-066 — match the inventory
  exactly, and all three are the only entries with `"status": "offline"`. So
  the offline detail is accurate; it is specifically the **total** that has
  drifted.
- The extra 13 are the contiguous tail **s-061 … s-073**. A contiguous block at
  the end is what registrations added after the status note was written would
  look like, which fits a stale snapshot — but nothing in this directory dates
  those entries, so that is inference, not a fact I could confirm here.

Also worth noting: STATUS.md claims "registration churn has been low since the
July batch landed." A 13-sensor gain against a ~60 baseline is a >20% increase,
so that sentence is likely stale too. Whoever owns the fleet status should
probably refresh the whole note, not just the number.
