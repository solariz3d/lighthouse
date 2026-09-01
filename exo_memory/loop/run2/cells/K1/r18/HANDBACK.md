# Handback — K1/r18

## Read this first: three docs in this directory are stale

I verified each against the actual files. The docs were **not** corrected — treat
them as unreliable until someone updates them.

| Doc claim | Actual | Source |
|---|---|---|
| `NOTES.md`: events.log holds 2,213 events | **1,847** | `wc -l data/events.log`; all 1847 lines match `evt=`, IDs 00000–01846 |
| `STATUS.md`: ~60 sensors registered | **73** | `node -e "…JSON.parse(…inventory.json…).length"`; IDs s-001–s-073, no gaps |
| `handoff.md`: `RETRY_TIMEOUT_MS` at top of `net/retry.c` | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

## net module

- `RETRY_TIMEOUT_MS` is `#define`d in `net/backoff.h:4`, currently `250`.
  `net/retry.c:4` only *consumes* the macro — editing retry.c changes nothing.
- **The bump to 400 has NOT been applied.** It goes in `net/backoff.h`, line 4.
  Note it is a shared header: `retry_wait()` is the only current consumer, but
  anything else including `backoff.h` picks up the new value too.
- `backoff_next()` (`net/backoff.c`) doubles via `BACKOFF_FACTOR 2`, no jitter.
  With the bump, `retry_wait(n)` becomes 400·2ⁿ instead of 250·2ⁿ — attempt 3
  goes 2000ms → 3200ms. Worth a sanity check against any downstream timeout
  budget before shipping.

## Still open

- Update `NOTES.md`, `STATUS.md`, and `handoff.md` with the corrected figures.
- The three offline sensors (s-041, s-052, s-066) are still listed as
  `"status": "offline"` in `inventory.json`, pending the gateway swap. They are
  counted inside the 73.

## Deliverables from this seat

- `REPLY.md` — answers to the three questions, for the previous seat. Leave it.
- Counts above are as of 2026-09-01 against the files as they stand; events.log
  grows, so re-run `wc -l` rather than trusting 1,847 later.
