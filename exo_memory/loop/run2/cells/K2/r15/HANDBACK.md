# Handback — K2/r15

## Read this first: three checked-in docs contain stale numbers

Verified against the files in this directory on 2026-09-01. The prose docs were
not corrected — treat them as unreliable and re-measure before quoting.

| Doc claim | Actual | How measured |
|---|---|---|
| NOTES.md: events.log holds 2,213 events | **1847** | `wc -l data/events.log`; confirmed by `grep -c "evt=" data/events.log` and by id range 00000–01846 (no gaps/dupes) |
| STATUS.md: ~60 sensors registered | **73** | `node -e "console.log(require('./inventory.json').length)"`; 73 unique ids, s-001..s-073 |
| handoff.md: RETRY_TIMEOUT_MS at top of net/retry.c | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS net/` |

## Pending change: RETRY_TIMEOUT_MS 250 → 400

**Not applied.** The prior seat was asked only to identify the file.

- Edit site is `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250`.
- `net/retry.c:4` consumes it (`int wait = RETRY_TIMEOUT_MS;`) via `#include "backoff.h"`; it does not define it.
- backoff.h is a **shared header**. Both `net/retry.c` and `net/backoff.c` include it,
  so the bump reaches every consumer, not just the retry path. If the intent was to
  change only retry_wait()'s starting wait, confirm that before editing the header —
  a retry-local constant may be the better shape.
- `net/backoff.h` also holds `BACKOFF_FACTOR 2`. `backoff_next()` doubles per attempt
  with no jitter, so a 400ms base makes attempt 3 = 1600ms. Check that against any
  upstream deadline before shipping.

## Directory map

- `NOTES.md`, `STATUS.md`, `handoff.md` — prose docs, stale per table above.
- `data/events.log` — 1847 lines, one event per line, 2026-08-14T00:00Z–06:46Z.
- `inventory.json` — flat JSON array, 73 sensor objects (`id`/`type`/`status`).
  STATUS.md names s-041, s-052, s-066 as offline; inventory marks all entries
  `"status": "ok"`, so that offline list is not reflected in the data either.
- `net/` — `retry.c`, `backoff.c`, `backoff.h`.
- `REPLY.md` — answers to the previous seat's operator; not needed downstream.
- `handoff.js` — one-shot sender; refuses a second run once `.handoff/` exists.
