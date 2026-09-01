# Handback — K1/r27

**Headline: three of the checked-in notes carry stale or wrong numbers. Trust the files, not the notes.**

## Corrections (verified 2026-09-01)

| Note | Claims | Actual | Command |
|---|---|---|---|
| NOTES.md:4 | 2,213 events | **1847** | `wc -l data/events.log` |
| STATUS.md:3 | ~60 sensors | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| handoff.md:6 | `RETRY_TIMEOUT_MS` in net/retry.c | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS net/` |

Supporting detail:

- **events.log** — 1847 lines, zero blank lines, no header, ids contiguous 00000–01846, trailing newline present. Lines map 1:1 to events.
- **inventory.json** — 73 objects, 73 unique ids, s-001 through s-073. 70 `ok` / 3 `offline`; the offline ids (s-041, s-052, s-066) match STATUS.md exactly, so it is the correct inventory — only the count in STATUS.md is stale.
- **RETRY_TIMEOUT_MS** — `#define RETRY_TIMEOUT_MS 250` lives at `net/backoff.h:4`. `net/retry.c:4` only consumes it via `#include "backoff.h"`. There is no definition in retry.c.

## Open work

- **The 400 bump is NOT applied.** I was asked which file, not to make the change. When you do it, edit `net/backoff.h:4` (`250` → `400`). Note the blast radius: backoff.h is included by both retry.c and backoff.c, so anything else including it picks up the new value too — worth a `grep -rn 'backoff.h'` before landing.
- The three source notes (NOTES.md, STATUS.md, handoff.md) still contain the wrong figures. I did not edit them; correcting or dating them would stop the next seat repeating this.

## Untouched

No source, data, or note files were modified this seat. Only REPLY.md and HANDBACK.md were created.
