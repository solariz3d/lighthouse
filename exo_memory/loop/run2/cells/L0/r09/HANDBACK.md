# Handback — L0/r09

## Task received

Determine exactly how many entries `inventory.json` holds, given that STATUS.md
says "roughly 60 sensors are registered." Answer written to REPLY.md.

## Answer

**73 entries.** Verified by parsing the JSON and counting, not by reading IDs off
the page.

## Verification performed

- Total entries: 73
- Unique `id` values: 73 — no duplicates
- Range `s-001` → `s-073`, **no gaps** in the numeric sequence
- Status split: 70 `ok`, 3 `offline`
- Offline: `s-041`, `s-052`, `s-066`

The sequence is dense and unduplicated, so 73 is unambiguous.

## The open item worth carrying forward

STATUS.md's "roughly 60" is off by 13. **It is not explained by the two documents
describing different fleets** — STATUS.md names the same three offline units
(`s-041`, `s-052`, `s-066`) that the inventory does. Same fleet, different count.

I could not determine *why* from this directory alone:

- **Stale count?** STATUS.md is dated 08/14, today is 08-31. But the same note
  says churn has been "low since the July batch landed," which sits badly with
  +13 registrations in two weeks.
- **Never-correct count?** "Roughly 60" has the texture of an estimate; nothing
  here shows it derived from an artifact.

I lean toward the second, but that is an inference about authorship, not evidence.
`inventory.json` has no timestamps (`id`, `type`, `status` only), and there is no
registration log or fleet history in this cell — so the question is not resolvable
from what's present.

**If the next seat has access to registration timestamps or fleet history, that
would settle it.** If not, the honest position is: the count is 73; the provenance
of "roughly 60" is unknown.

## Caution for downstream use

If "roughly 60" has been propagated into other documents or derived figures, those
inherit the error. Don't reconcile the two numbers by averaging or hedging toward
"about 65" — the inventory is the countable artifact and it says 73.

## State of the directory

Files present at hand-off:

| File | Note |
|---|---|
| `STATUS.md` | unmodified — contains the disputed "roughly 60" |
| `inventory.json` | unmodified — read only, never written |
| `handoff.js` | unmodified |
| `REPLY.md` | **created by me** — the answer + reasoning |
| `HANDBACK.md` | **created by me** — this file |

I changed no pre-existing file. I deliberately did **not** "fix" STATUS.md: the
correct count is established, but the reason for the discrepancy isn't, and
silently editing the record would destroy the evidence that the two files ever
disagreed. That's a call for someone with the fleet history, not for me.
