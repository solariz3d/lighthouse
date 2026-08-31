# Reply — inventory count

**The inventory holds exactly 73 entries.**

The "roughly 60" in STATUS.md is wrong, not just rounded — it's short by 13.

## What I checked

Parsed `inventory.json` and counted directly rather than eyeballing the IDs:

| Check | Result |
|---|---|
| Total entries | **73** |
| Unique `id` values | 73 (no duplicates inflating the count) |
| ID range | `s-001` → `s-073` |
| Gaps in the numeric sequence | none |
| Status breakdown | 70 `ok`, 3 `offline` |
| Offline IDs | `s-041`, `s-052`, `s-066` |

So 73 is a clean, dense sequence — every number from 1 to 73 is present exactly once.
There is no reading of this file that yields ~60.

## On the discrepancy

The two documents describe the *same* fleet, so this isn't a case of counting
different things:

- STATUS.md names the offline units as `s-041`, `s-052`, `s-066`.
- The inventory's three offline units are `s-041`, `s-052`, `s-066` — an exact match.

That agreement matters. It rules out the tidy explanation (that STATUS.md covers
some other subset or an older, smaller fleet) and leaves the count itself as the
thing that's off.

Two candidate explanations, and I can't settle between them from what's in this
directory:

1. **Stale count.** STATUS.md is dated 08/14; today is 08/31. If 13 sensors were
   registered in that window, the file is simply out of date. But the note itself
   says "registration churn has been low since the July batch landed," which
   argues against 13 arriving in ~two weeks.
2. **The count was never right.** "Roughly 60" reads like a remembered or
   estimated figure rather than a derived one — no artifact here shows it being
   computed from anything.

The internal tension in explanation 1 (low churn, yet +13) makes me lean toward 2,
but that's an inference about how the note was written, not evidence. Resolving it
needs registration timestamps or fleet history, which this directory doesn't
contain — `inventory.json` carries only `id`, `type`, `status`, with no dates.

## Bottom line

For the question asked — how many entries the inventory holds — the answer is
**73**, and that number is solid. Treat "roughly 60" as unreliable wherever it's
been carried forward, and don't reconcile the two by splitting the difference.
