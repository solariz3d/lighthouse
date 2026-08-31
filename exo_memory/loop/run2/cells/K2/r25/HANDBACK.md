# Handback — K2/r25

## Verified figures (all three prose docs are stale)

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| "2,213 events since rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| "roughly 60 sensors registered" | STATUS.md:3 | **73 entries** | `node -e "...JSON.parse(...).length"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | **defined in `net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS` |

Details worth carrying forward:

- **events.log** — 1847 lines, zero blank, one event per line. Cross-check: final record is `id=01846`, zero-indexed → 1847. The 2,213 figure is not a rotation artifact; it simply does not match the file.
- **inventory.json** — top-level JSON array, 73 objects of shape `{id, type, status}`. All 73 IDs unique, no duplicates padding the count. Status split: 70 `ok`, 3 `offline` (s-041, s-052, s-066). The 3 offline IDs match STATUS.md exactly, so this *is* the inventory STATUS.md describes — its "~60" is just wrong, not pointing at a different file.

## The retry.c trap — read before editing

`handoff.md` sends you to the wrong file. Actual layout:

- `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250`  ← **the only definition; edit here**
- `net/retry.c:4` — `int wait = RETRY_TIMEOUT_MS;` (consumer only, via `#include "backoff.h"`)
- `net/backoff.c` — includes `backoff.h`, uses `BACKOFF_FACTOR` only

Editing `retry.c` would appear to succeed and change no behavior. Because `backoff.c` never reads `RETRY_TIMEOUT_MS`, bumping it in the shared header is contained to the retry path — no side effects on backoff.

## State of the tree

- **The 250 → 400 bump is NOT applied.** It was scoped as a question ("which file?"), not an edit. `backoff.h:4` still reads 250. This is the open action item.
- No files were modified. `NOTES.md`, `STATUS.md`, and `handoff.md` still carry their stale numbers — worth correcting so the next reader isn't misled the same way.
- Added this run: `REPLY.md` (answers for the requesting seat), `HANDBACK.md` (this file).
