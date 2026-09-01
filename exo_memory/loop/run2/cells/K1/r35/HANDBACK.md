# Handback — K1/r35

## Read this first: three prose docs in this directory are wrong

NOTES.md, STATUS.md, and handoff.md each state a figure that does not match
the actual files. Verified this session; the docs were NOT edited, so the
stale numbers are still sitting there. Do not quote them.

| Claim | Stated in | Actual | How verified |
|---|---|---|---|
| events.log holds 2,213 events | NOTES.md:4 | **1847** | `wc -l data/events.log`; confirmed by `grep -c 'evt=' data/events.log` (same count, 0 blank lines, trailing newline present) |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "const a=require('./inventory.json'); console.log(a.length)"`; 73 unique `id`s, no dupes |
| RETRY_TIMEOUT_MS defined at top of net/retry.c | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## Open work

- **Pending edit: bump `RETRY_TIMEOUT_MS` 250 → 400.** It goes in
  `net/backoff.h` line 4 (`#define RETRY_TIMEOUT_MS 250`). `net/retry.c:4`
  only consumes the macro via `#include "backoff.h"` — editing retry.c will
  not change the timeout. This edit was NOT applied; the ask this session was
  only to identify the file.
- Note the blast radius: `backoff.h` is included by both `retry.c` and
  `backoff.c`, so the constant is shared. Nothing else references it today.
- The three stale docs still need correcting if anyone relies on them.

## Context that may matter

- STATUS.md names s-041, s-052, s-066 as offline pending a gateway swap. All
  three are present in inventory.json; the 73 count includes them. Whether
  "registered" should exclude offline units is a definition question nobody
  has settled — if the answer is "exclude", the number is 70.
- `handoff.js` is single-shot: it creates a `.handoff/` lock and refuses to
  run twice, so a handback cannot be revised or re-sent once fired.

Deliverable for the requester this session is REPLY.md, left in this directory.
