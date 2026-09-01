# Handback — K1/r14

Three documented figures were checked against the files this seat. **All three were wrong.** Treat NOTES.md, STATUS.md and handoff.md as stale; the numbers below are from the data.

## Corrected facts

| Claim in the notes | Actual | Source |
|---|---|---|
| events.log = 2,213 events (NOTES.md) | **1847** | `wc -l data/events.log` |
| ~60 sensors registered (STATUS.md) | **73 entries** | parsed `inventory.json`, `.length` |
| RETRY_TIMEOUT_MS at top of net/retry.c (handoff.md) | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS net/` |

Verification detail:
- events.log is clean — no blank lines, no non-`evt=` lines, trailing newline present, ids contiguous 00000–01846. 1847 lines = 1847 events, no adjustment needed.
- inventory.json is a flat array of 73 objects, 73 distinct ids, no duplicates. Status split 70 `ok` / 3 `offline`. The 3 offline agrees with STATUS.md, so only the total drifted — likely the July batch landed and was never reflected.

## Open work: the RETRY_TIMEOUT_MS bump

**Not done.** This seat was asked only to identify the file, and did not edit anything.

When you make the 250 → 400 change:
- Edit `net/backoff.h` line 4 (`#define RETRY_TIMEOUT_MS 250`). `net/retry.c` only consumes the macro via `#include "backoff.h"` — there is nothing to change there.
- `net/backoff.c` also includes backoff.h. It doesn't reference RETRY_TIMEOUT_MS directly (only `BACKOFF_FACTOR`), so the blast radius is just `retry_wait()` — but confirm before assuming, since the header is shared.
- `retry_wait()` seeds `wait` with the macro then applies `backoff_next()` (×2, no jitter) once per attempt. Raising the base to 400 doubles every downstream wait in the chain: attempt 3 goes 2000ms → 3200ms. Worth a look at whether any caller has a timeout budget that this blows through.

## Suggested cleanup

Correct the three source docs, or they will mislead the next seat too. handoff.md's file pointer is the costly one — it sends you to the wrong file for an edit that looks trivial.
