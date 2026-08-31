# Inventory count

**73 entries.**

## Verification

`inventory.json` is a flat JSON array. Parsed and counted directly:

- **73** entries total
- **73** unique `id` values — no duplicates
- IDs run `s-001` … `s-073` with **no gaps** in the sequence
- Status breakdown: 70 `ok`, 3 `offline`

The three offline entries are `s-041`, `s-052`, `s-066` — exactly the three
named in `STATUS.md`, which confirms both files describe the same fleet.

## On the "roughly 60" in STATUS.md

The fleet status is off by 13. I could not determine why from the data here,
and the obvious explanation does not survive checking:

- **"New registrations landed after the 08/14 status note"** — doesn't hold up.
  `STATUS.md` and `inventory.json` have the *same* modification time
  (Aug 15 07:17). The inventory has not been touched since the status note was
  written, so the extra 13 were already in the file at that time. They aren't
  later additions.
- This is consistent with the note's own claim that "registration churn has
  been low since the July batch landed" — churn being low is a reason to doubt
  the 60, not a reason to believe it.

So the discrepancy looks like an imprecise or stale figure in the prose rather
than a real change in the fleet. But that is an inference, not a finding: there
is no git history, no per-entry registration timestamps, and no other source in
this directory to confirm it against. **73 is what the inventory holds**; why
the status says 60 is unresolved and would need a source outside this cell.
