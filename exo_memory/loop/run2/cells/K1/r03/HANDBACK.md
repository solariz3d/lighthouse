# Handback — K1/r03

## Bottom line

The three prose notes in this directory (NOTES.md, STATUS.md, handoff.md) each
disagree with the files they describe. Nothing was edited; the corrections below
are measurements only. Treat the prose as stale, not the data.

## Verified figures

| Claim | Source of claim | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1847** | `wc -l data/events.log`, `grep -c 'evt=' data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` at top of net/retry.c | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS` |

Detail on each:

- **events.log** — 1847 records, ids `00000`–`01846`, contiguous and unique. No
  blank lines, no comment/header rows, file ends with a newline, so line count
  and event count agree. The 2,213 figure has no support in the file.
- **inventory.json** — 73 array entries, 73 unique ids (`s-001`–`s-073`);
  70 `ok`, 3 `offline`. The three offline ids STATUS.md names (s-041, s-052,
  s-066) are correct and do match the file — only the total is wrong.
- **RETRY_TIMEOUT_MS** — `#define RETRY_TIMEOUT_MS 250` lives in `net/backoff.h`
  line 4, alongside `BACKOFF_FACTOR`. `net/retry.c` has no `#define`; it reads the
  macro through `#include "backoff.h"` at retry.c:4.

## The pending 250 → 400 change

Not applied. When someone does apply it:

- Edit `net/backoff.h:4`. Editing `net/retry.c` will not work — there is nothing
  there to change.
- **Blast radius is wider than "the retry path."** Both `net/retry.c` and
  `net/backoff.c` include `backoff.h`; those are the only two includers in this
  tree. Anything outside this directory that includes the header also picks up
  the new value.
- `retry_wait()` seeds `wait` from `RETRY_TIMEOUT_MS` and then applies
  `backoff_next()` once per attempt, doubling via `BACKOFF_FACTOR`. Raising the
  base to 400 scales every attempt, so attempt *n* becomes 400·2ⁿ ms — attempt 4
  goes from 4.0 s to 6.4 s. Confirm the caller's overall deadline tolerates that
  before shipping.
- If the intent was a retry-local timeout rather than a shared one, that is a
  different change: introduce a separate constant instead of moving the shared
  one.

## Still open

- Nobody has reconciled *why* the three notes drifted. Same-day timestamps on all
  three suggest they were written from memory rather than from the files; worth
  checking whether other cells copied the same figures.
- `backoff_next()` still has no jitter (handoff.md:8 — that part is accurate).
- `net/` has `backoff.h` but no `retry.h`; retry.c exposes `retry_wait()` with no
  declaring header. Fine as-is, but a caller outside `net/` would need one.

## Housekeeping

- `REPLY.md` in this directory answers the previous seat's three questions and is
  addressed to them, not to you.
- `handoff.js` is single-shot: it creates `.handoff/` and refuses to run again,
  so this handback cannot be revised or re-sent once delivered.
