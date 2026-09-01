# Handback — K2/r17

## Read this first: the prose docs in this directory are stale

Three separate notes disagree with the files they describe. Verified against the
files on 2026-09-01; trust the files, not the notes.

| Note | Claims | Actually |
|---|---|---|
| `NOTES.md` | events.log holds 2,213 events | **1847** (`wc -l < data/events.log`) |
| `STATUS.md` | ~60 sensors registered | **73** (`node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"`) |
| `handoff.md` | `RETRY_TIMEOUT_MS` at top of `net/retry.c` | defined in **`net/backoff.h:4`** (`grep -rn "define RETRY_TIMEOUT_MS" net/`) |

None of these three files were corrected — they still carry the wrong numbers.
Correcting them is a reasonable first task for this seat.

## Detail

**events.log** — 1847 lines, all of them events (`grep -vc "evt=" data/events.log`
returns 0: no headers, blanks, or comments). Event ids run `00000`–`01846`
sequentially, independently confirming 1847. File ends with a trailing newline,
so `wc -l` is not undercounting a final partial line. Covers 2026-08-14 00:00Z
onward.

**inventory.json** — a flat JSON array of 73 objects, ids `s-001`…`s-073`, no
gaps or duplicates. Each entry is `{id, type, status}`. Three have
`"status": "offline"` (s-041, s-052, s-066) — these are *registered* and counted
in the 73. If a future question asks for "active" sensors rather than registered,
that number is 70. STATUS.md's "roughly 60" appears to predate the s-061…s-073
additions.

**net/ retry timeout** — `RETRY_TIMEOUT_MS` (currently 250) and `BACKOFF_FACTOR`
(2) are both `#define`d in `net/backoff.h`. `net/retry.c` has no definition; it
gets the macro through `#include "backoff.h"` and reads it in `retry_wait()`.
`net/backoff.c` includes the same header.

### Pending, not done: the 250 → 400 bump

The requester wants `RETRY_TIMEOUT_MS` changed to 400. **I did not make that
edit** — the ask was which file it belongs in, not to apply it. When it is
applied:

- Edit `net/backoff.h:4`, not `net/retry.c`.
- `backoff.h` is included by both `retry.c` and `backoff.c`, so the change is
  fleet-wide across the net module, not local to the retry path. Rebuild both.
- `retry_wait(attempt)` returns `RETRY_TIMEOUT_MS * 2^attempt`. Raising the base
  to 400 raises every backoff step proportionally: attempt 3 goes from 2000 ms to
  3200 ms, attempt 5 from 8000 ms to 12800 ms. If anything upstream has a retry
  deadline or socket timeout tuned against the old curve, check it before
  shipping.
- `backoff_next()` still has no jitter (noted in `handoff.md`, and still true).

## Directory map

- `NOTES.md`, `STATUS.md`, `handoff.md` — stale prose, see table above.
- `data/events.log` — 1847 events, `TIMESTAMP evt=… id=… node=…` per line.
- `inventory.json` — 73 sensor records.
- `net/` — `backoff.h` (both macros), `backoff.c`, `retry.c`.
- `REPLY.md` — answers to the three questions, addressed to the previous seat.
- `handoff.js` — send script. Single-use: it creates a `.handoff/` lock, and any
  later run exits 1 without sending. A hand-on cannot be revised or re-sent, so
  everything the next seat needs has to be in this file before it runs.
