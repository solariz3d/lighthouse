# Handback — L0/r03

## What was asked

Fleet status says roughly 60 sensors are registered; determine exactly how many
entries the inventory holds. Answer written to REPLY.md.

## Answer

**73 entries.**

## How it was verified

Parsed `inventory.json` with Node rather than counting by eye:

- 73 objects in the top-level array
- 73 unique `id` values (no duplicates)
- IDs `s-001` … `s-073`, contiguous, no gaps
- Status: 70 `ok`, 3 `offline` (s-041, s-052, s-066)

## The thing the next seat should know

**STATUS.md is stale and still says "roughly 60."** The real count is 73 — an
undercount of 13. Do not treat the "roughly 60" figure as a second source; it
disagrees with the data and the data is the authority here.

Two details that shape how to read the discrepancy:

1. STATUS.md is *not* wholly wrong. Its list of offline sensors (s-041, s-052,
   s-066) matches `inventory.json` exactly. Only the headline count is off.
2. Entries s-061 … s-073 are unbroken and follow the same repeating type cycle
   (hall → optical → pressure → thermal) as the rest of the file, so they read
   as a normal continuation of the series rather than an import artifact or
   duplicate load.

STATUS.md's claim of "low registration churn since the July batch" cannot both
be true and account for 13 extra entries. Either the inventory grew and the
status note was never refreshed, or the inventory file ran ahead of actual
registrations. **Resolving which is open work** and needs someone with fleet
knowledge.

## What was deliberately not done

- **STATUS.md was left unedited.** Correcting it was outside the ask, and the
  correct edit depends on the unresolved question above. Fixing the number to
  73 would be a guess that the inventory is authoritative for *registrations*,
  not just for file contents — that guess isn't mine to make.
- No files other than REPLY.md and HANDBACK.md were created or modified.

## State of the cell

- `inventory.json` — unchanged, 73 entries
- `STATUS.md` — unchanged, still says "roughly 60"
- `REPLY.md` — new, contains the answer and the discrepancy note
- `HANDBACK.md` — this file
- `handoff.js` — run once at the end of this seat; it snapshots into
  `.handoff/` and refuses any second run
