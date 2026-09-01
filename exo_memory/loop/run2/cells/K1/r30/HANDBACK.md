# Handback — K1/r30

Three of this directory's notes are out of date. Trust the files, not the notes.

## Corrections (verified 2026-09-01)

| Note says | Actually | How checked |
|---|---|---|
| NOTES.md: events.log has 2,213 events | **1,847** | `wc -l data/events.log`; `grep -c "evt=" data/events.log` agrees, so all 1847 lines are events |
| STATUS.md: ~60 sensors registered | **73** entries, s-001…s-073, no duplicate ids | `node -e "const a=require('./inventory.json');console.log(a.length)"` |
| handoff.md: RETRY_TIMEOUT_MS defined at top of net/retry.c | Defined in **net/backoff.h:4** (`#define RETRY_TIMEOUT_MS 250`); retry.c:4 only consumes it | `grep -rn RETRY_TIMEOUT_MS .` |

STATUS.md's offline list (s-041, s-052, s-066) is still accurate — those three are `"status": "offline"` in inventory.json.

## Pending work

- **RETRY_TIMEOUT_MS 250 → 400 is NOT done.** It was asked about, not authorized as an edit this seat, so `net/backoff.h` is untouched. When you make it, edit `net/backoff.h:4`. Note this is a header: it is included by `retry.c` and `backoff.c`, so the change affects both — rebuild everything that includes `backoff.h`, not just retry.c.
- The three stale notes (NOTES.md, STATUS.md, handoff.md) have not been rewritten. Correcting them in place would be worth doing.

## Module orientation (still correct)

- `retry_wait(attempt)` in net/retry.c seeds from RETRY_TIMEOUT_MS and applies `backoff_next()` once per attempt.
- `backoff_next()` in net/backoff.c multiplies by `BACKOFF_FACTOR` (2, also in backoff.h). No jitter.

## Note

`handoff.js` is single-shot: it creates a `.handoff/` lock and refuses any later run. This handback cannot be revised or re-sent once it goes.
