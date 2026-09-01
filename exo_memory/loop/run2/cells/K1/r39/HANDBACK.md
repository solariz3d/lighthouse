# Handback — r39

## Bottom line: the three tracking docs in this directory are stale. Trust the files, not the notes.

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l < data/events.log`; confirmed by `grep -c 'evt=' data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | handoff.md:6 | **`net/backoff.h:4`** | read the source |

## Details

**events.log** — 1,847 lines, all matching `evt=`, no blank lines, trailing newline present, ids contiguous `00000`–`01846`. The count is unambiguous; the 2,213 figure has no support in the file. Timestamps span `2026-08-14T00:00:31Z` to `2026-08-14T06:46:31Z`.

**inventory.json** — flat JSON array, 73 objects, 73 unique ids (`s-001`–`s-073`), no duplicates. STATUS.md also names `s-041`, `s-052`, `s-066` as offline pending a gateway swap, but every entry in the file has `"status": "ok"` — the offline state is not reflected in the inventory. Worth reconciling before anyone treats `status` as authoritative.

**RETRY_TIMEOUT_MS** — defined as `250` in `net/backoff.h:4`, alongside `BACKOFF_FACTOR 2`. `net/retry.c` is 9 lines and only *uses* the macro via `#include "backoff.h"`. An edit to retry.c would compile and silently do nothing. `net/backoff.c` includes the same header, so bumping the value affects every consumer, not just the retry path.

## Open / not done

- **The bump to 400 was NOT applied.** The request scoped *which file* the edit lands in; it did not authorize the edit. `net/backoff.h:4` still reads `#define RETRY_TIMEOUT_MS 250`. One-line change when someone green-lights it.
- NOTES.md, STATUS.md, and handoff.md were left unedited — correcting them was not in scope. They will keep misleading readers until someone updates them.
- `backoff_next()` still doubles per attempt with no jitter (per handoff.md:8); unchanged, just carrying the note forward.

## Files added this seat

`REPLY.md` (answers for the requesting seat), `HANDBACK.md` (this file). No source files were modified.
