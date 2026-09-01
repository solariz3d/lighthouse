# Handback — K2/r07

## Read this first: three checked-in docs are wrong

NOTES.md, STATUS.md, and handoff.md each state a figure that does not match
the files in this directory. Verified against the data, not the prose:

| Claim | Source | Actual |
|---|---|---|
| events.log holds 2,213 events | NOTES.md:4 | **1847** (`wc -l data/events.log`) |
| ~60 sensors registered | STATUS.md:3 | **73** entries in inventory.json |
| RETRY_TIMEOUT_MS defined in net/retry.c | handoff.md:6 | defined in **net/backoff.h:4** |

I did **not** edit NOTES.md, STATUS.md, or handoff.md — correcting them was
outside what I was asked to do. They are still stale on disk. If you rely on
any figure from them, re-derive it first.

## Open work item: RETRY_TIMEOUT_MS 250 → 400

Not applied. When you do it:

- Edit `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`), **not** `net/retry.c`.
- `net/retry.c:4` only consumes the macro; there is no second definition.
  `grep -rn "RETRY_TIMEOUT_MS" . --include=*.c --include=*.h` confirms two hits total.
- backoff.h is a shared header. `backoff.c` includes it as well, so the change
  reaches every consumer, not just the retry path. Check that 400ms as a base
  is acceptable for `backoff_next()`, which doubles per attempt with no jitter
  and no ceiling — attempt 4 goes from 4000ms to 6400ms.

## State of the directory

- Nothing was modified. Only REPLY.md and HANDBACK.md were added.
- `data/events.log`: 1847 lines, ids 00000–01846 contiguous, last event
  2026-08-14T06:46:31Z. Trailing newline present.
- `inventory.json`: 73 objects, ids s-001…s-073, contiguous. Three marked
  `"status": "offline"` (s-041, s-052, s-066) — matches STATUS.md's offline
  list even though its total is wrong.
- `net/`: backoff.c, backoff.h, retry.c. No build or test harness in this tree,
  so the bump cannot be compile-checked from here.
