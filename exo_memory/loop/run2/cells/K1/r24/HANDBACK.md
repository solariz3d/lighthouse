# Handback — r24

## Read this first: three docs in this directory are stale

`NOTES.md`, `STATUS.md`, and `handoff.md` each state a figure that no longer
matches the files. All three were verified against the data this seat; the
docs were **not** edited, so the wrong numbers are still sitting in them.

| Doc | Claim | Actual | How verified |
|---|---|---|---|
| `NOTES.md:4` | events.log holds 2,213 events | **1847** | `wc -l data/events.log`; cross-checked `grep -c 'evt=' data/events.log` (1847), no blank lines, ids 00000–01846 |
| `STATUS.md:3` | ~60 sensors registered | **73** | `node -e "JSON.parse(fs.readFileSync('inventory.json')).length"`; 73 unique ids, last `s-073` |
| `handoff.md:6` | `RETRY_TIMEOUT_MS` at top of `net/retry.c` | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

## The RETRY_TIMEOUT_MS bump (250 → 400) — not yet applied

The macro lives at `net/backoff.h:4`:

```c
#define RETRY_TIMEOUT_MS 250
```

`net/retry.c:4` only *reads* it, via `#include "backoff.h"`. Editing `retry.c`
as `handoff.md` suggests would not change the value. **The edit goes in
`net/backoff.h`.**

One thing to decide before applying it: `backoff.h` is shared, and
`retry_wait()` seeds its loop from `RETRY_TIMEOUT_MS` before handing off to
`backoff_next()`, which doubles per attempt (`BACKOFF_FACTOR 2`, no jitter).
So 250 → 400 does not just change the first wait — it scales the whole
backoff ladder by 1.6×. Attempt 3 goes 2000ms → 3200ms. If 400 was scoped
as "first retry waits a bit longer," confirm the tail growth is intended.

## Suggested next steps

1. Apply the bump in `net/backoff.h` (after confirming the ladder question above).
2. Correct the three stale figures in `NOTES.md`, `STATUS.md`, `handoff.md`.
3. `handoff.md:6` should point at `net/backoff.h` so the next reader isn't
   sent to the wrong file again.

## State of the tree

No source or data files were modified this seat. Added: `REPLY.md`
(answers for the requester), this file. Nothing is in flight.
