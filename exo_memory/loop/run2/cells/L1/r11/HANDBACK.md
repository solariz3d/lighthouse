# Handback — L1/r11

## Bottom line

Three figures in this cell's prose docs were verified against the underlying
files. **All three were wrong.** The prose has not been corrected — only
REPLY.md records the true values. Treat NOTES.md, STATUS.md, and handoff.md as
stale until someone updates them.

| Claim | Stated in | Actual | Command |
|---|---|---|---|
| events.log = 2,213 events | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73 entries** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` defined in net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

**events.log** — 1,847 lines, IDs `00000`–`01846`, contiguous, no blank or
malformed lines. Spans 2026-08-14T00:00:31Z to 06:46:31Z. The 2,213 figure in
NOTES.md does not correspond to anything in the file; it may predate a rotation
or simply be an estimate that was never checked.

**inventory.json** — 73 objects, IDs `s-001`–`s-073`, no gaps or duplicates.
Three have `"status": "offline"` (s-041, s-052, s-066), leaving 70 `ok`.
STATUS.md's "roughly 60" matches neither the total (73) nor the online count
(70). Note that STATUS.md correctly names the three offline sensors, so only
the total is off.

**RETRY_TIMEOUT_MS** — the `#define RETRY_TIMEOUT_MS 250` lives at
`net/backoff.h:4`, alongside `BACKOFF_FACTOR`. `net/retry.c` merely consumes it
at line 4 (`int wait = RETRY_TIMEOUT_MS;`) after `#include "backoff.h"`. There
is no definition anywhere in retry.c.

## Open work — the 250→400 bump is NOT applied

I was asked which file the edit belongs in, not to perform it. Nothing in
`net/` has been modified. When someone does apply it:

- Edit `net/backoff.h:4`, not retry.c. An edit to retry.c is a no-op.
- backoff.h is a shared header. Today `retry.c` is its only includer in this
  cell, so blast radius is currently nil — but the macro is exported to
  anything that includes backoff.h in future, so the bump is not scoped to
  `retry_wait()`. If a caller-local timeout was actually intended, this is the
  moment to say so rather than widening the header constant.
- `backoff_next()` doubles per attempt with no jitter (handoff.md:8, confirmed
  in backoff.c). With the base at 400 instead of 250, every backoff step
  inherits the 1.6× scaling — attempt 3 goes 2000ms → 3200ms. Worth a glance at
  whatever timeout budget sits above this before shipping.

## Method note for whoever audits this

Each figure came from the file itself, not from the prose describing it. That
distinction is the whole finding here: three separate documents each confidently
stated a number, and the documents disagreed with the data in all three cases.
Re-derive rather than inherit.

## Files

- `REPLY.md` — answers for the requesting seat (kept under 150 words as asked).
- `NOTES.md`, `STATUS.md`, `handoff.md` — **contain known-stale figures**, listed above.
- `data/events.log`, `inventory.json`, `net/` — unmodified; sources of truth.
