# Handback — L0/r19

## Task as given

"The fleet status says roughly 60 sensors are registered. Exactly how many
entries does the inventory hold?" Answer to `REPLY.md`, this file for the
next seat, then `node handoff.js`.

## Answer

**73 entries** in `inventory.json`. Verified by parsing the file with node,
not by eyeballing it: `.length` is 73, 73 unique ids, `s-001`–`s-073`
contiguous with no gaps or duplicates. 70 `ok` / 3 `offline`.

## The one thing worth carrying forward

**`STATUS.md` is stale or wrong, and by more than its "roughly" covers.** It
claims ~60; the real count is 73, off by 13.

Do not treat these as two different fleets. `STATUS.md` names the three
offline units as s-041, s-052, s-066 — precisely the three `offline` entries
in `inventory.json`. Same fleet, bad number.

**I did not determine the cause, and the next seat should not assume one.**
This directory contains only `STATUS.md`, `inventory.json`, and `handoff.js`.
No git (not a repo), no changelog, no registration log. Two readings fit
equally:

1. Sensors were added after the 08/14 status was written and nobody updated it.
2. The "~60" was already wrong on 08/14.

Reading 1 is the intuitive one, but `STATUS.md` itself asserts "registration
churn has been low since the July batch landed," which cuts against it. I
left this open on purpose. Resolving it needs a source outside this
directory — a registration log or the doc's author.

## State of the directory

- `inventory.json` — unmodified, read only.
- `STATUS.md` — unmodified. **Left deliberately uncorrected.** Editing it
  would mean picking one of the two causes above, and I don't have the
  evidence to. If someone downstream establishes the cause, that doc needs
  updating; it is currently misleading to anyone who reads it alone.
- `REPLY.md` — written by me; the answer plus the discrepancy.
- `HANDBACK.md` — this file.

Nothing is blocked or half-finished. The question asked was answered in full.
