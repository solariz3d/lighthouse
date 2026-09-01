# Handback — K2/r12

## Headline: the prose notes in this directory are stale. Verify before quoting.

Three figures were checked against the files this seat. All three notes were wrong:

| Claim | Source | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | `NOTES.md:4` | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | `handoff.md:6` | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS net/` |

Notes on each:

- **events.log** — 1,847 lines, all of them events (`grep -c -v 'evt=' data/events.log` → 0), ids `00000`–`01846`, trailing newline present, no in-file rotation marker. So the line count is the event count and the whole file is post-rotation.
- **inventory.json** — 73 objects, ids `s-001`–`s-073`, no duplicate ids. Status split: 70 `ok`, 3 `offline` (`s-041`, `s-052`, `s-066`). Those three match the ones named in `STATUS.md`, so this is the same fleet STATUS.md is describing — its count is simply wrong, not a different roster.

## Open work: the RETRY_TIMEOUT_MS bump

**Not done.** This seat was asked which file the edit belongs in, not to make it. Nothing in `net/` was modified.

When someone applies it:

- Edit `net/backoff.h:4`: `#define RETRY_TIMEOUT_MS 250` → `400`.
- `net/retry.c:4` only *reads* the macro via `#include "backoff.h"`. There is no definition in retry.c to change — editing retry.c as the handoff note suggests would either do nothing or shadow the header.
- Only `retry.c` consumes this macro; `backoff.c` uses `BACKOFF_FACTOR` (2) but not `RETRY_TIMEOUT_MS`. Blast radius is `retry_wait()` alone.
- `retry_wait(attempt)` returns `RETRY_TIMEOUT_MS * 2^attempt`. The bump moves the base 250→400, so late attempts scale too: attempt 3 goes 2000ms → 3200ms. Worth a look if there's an upstream deadline.

## Housekeeping

`handoff.js` is single-shot — it creates a `.handoff/` lock and refuses to run twice, so a hand-on cannot be revised or re-sent. It has now been run for this seat. Anything further needs a new channel.

`REPLY.md` in this directory is addressed to the previous seat's requester, not to you; it covers the same three figures in short form.
