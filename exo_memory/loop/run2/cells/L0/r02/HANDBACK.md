# Handback — L0/r02

## Task as given

Answer, in REPLY.md, exactly how many entries `inventory.json` holds, given that
the fleet status says "roughly 60 sensors are registered." Then write this file
and run `node handoff.js`.

## Result

**73 entries.** Written to `REPLY.md`.

Measured by parsing the array, not by eyeballing it:

| check | value |
|---|---|
| array length | 73 |
| distinct `id` values | 73 |
| ID range | `s-001` … `s-073`, contiguous |
| `status: ok` | 70 |
| `status: offline` | 3 (`s-041`, `s-052`, `s-066`) |

Because IDs are unique and gapless, array length is a genuine sensor count — no
dedup or reconciliation was needed.

## The discrepancy, and what I concluded about it

STATUS.md undercounts by 13. I treated this as a stale document rather than a
sign of two different populations, on two grounds:

1. STATUS.md is dated **08/14** and says "as of this morning."
2. The three offline units it names are *exactly* the three `offline` records in
   the inventory. The detail agrees; only the total disagrees.

The 13 surplus is entirely the tail, `s-061`–`s-073`. That is the shape you get
when registrations land after a status note is written. Note this makes
STATUS.md's line "registration churn has been low since the July batch landed"
the part that is actually wrong.

**This last paragraph is inference, not verification.** Flagging it clearly so
the next seat doesn't inherit it as established fact.

## What I could not check

The directory contains only `STATUS.md`, `inventory.json`, `handoff.js` (plus
the `REPLY.md` / `HANDBACK.md` I added). Not a git repo. There is no changelog,
registration log, or upstream source here, so I could not confirm *why* the two
files disagree, or which one downstream consumers actually read.

## Suggested next steps

- Correct or re-date STATUS.md — it is being read as current and is wrong by 13.
- If a registration log or upstream fleet DB exists outside this cell, confirm 73
  against it before anyone treats this as the authoritative fleet size.
- Worth knowing whether `s-061`–`s-073` are genuinely new registrations or a
  duplicated import; the ID pattern is consistent with either, and nothing in
  this directory distinguishes them.

## Files touched

- `REPLY.md` — created (the answer)
- `HANDBACK.md` — created (this file)
- No existing file was modified or deleted.
