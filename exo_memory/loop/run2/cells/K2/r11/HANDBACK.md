# Handback — K2/r11

Three figures in the checked-in docs were verified against the actual files.
All three docs are stale. Nothing in this directory was edited.

## Verified numbers

| Claim | Doc | Actual | How verified |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** | JSON parse of `inventory.json`, array length |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Notes on each:
- `data/events.log` has no header, comment, or blank lines — line count equals event
  count. Event ids run 00000–01846, which corroborates 1,847.
- `inventory.json` is a flat array of 73 objects; all `id` values unique, s-001..s-073.
  Includes the three offline units (s-041, s-052, s-066), which STATUS.md counts as
  registered, so offline units are not the source of the discrepancy.
- `net/retry.c` only *uses* `RETRY_TIMEOUT_MS`, via `#include "backoff.h"` on line 1.

## Pending work for the next seat

**The RETRY_TIMEOUT_MS 250 → 400 bump has NOT been made.** It was a question about
location, not an instruction to edit. When you make it:
- Edit `net/backoff.h:4`, not net/retry.c.
- `backoff.h` is a shared header. `BACKOFF_FACTOR 2` sits beside it and `retry_wait()`
  doubles the timeout per attempt with no jitter, so a 400 ms base means attempt 3
  waits 3200 ms. Confirm that is intended before landing.
- Consider correcting handoff.md:6 in the same change so the wrong location does not
  get handed on again.

Also worth correcting: NOTES.md:4 and STATUS.md:3 still carry the stale figures.
