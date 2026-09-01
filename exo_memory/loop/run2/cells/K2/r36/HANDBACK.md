# Handback — r36

## Headline: the three stale docs in this directory all disagree with the files

Nothing was modified. Verified figures, with the command that produced each:

| Claim | Doc says | Actual | Command |
|---|---|---|---|
| events since last rotation | 2,213 (`NOTES.md:4`) | **1847** | `wc -l data/events.log` |
| sensors registered | "roughly 60" (`STATUS.md:3`) | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` location | `net/retry.c` (`handoff.md:6`) | **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

Details:

- **events.log** — 1847 lines, every one matching `evt=`; no blank lines, no comment/header lines, trailing newline present, so line count equals event count. Ids run `00000`–`01846` contiguously, consistent with 1847. The `NOTES.md` figure appears to predate the current file.
- **inventory.json** — a flat top-level array of 73 objects, ids `s-001` through `s-073`, no gaps and no duplicate ids. `STATUS.md` also names s-041/s-052/s-066 as offline; note every entry in the file currently has `"status": "ok"`, so the offline state is tracked somewhere else, not here.
- **RETRY_TIMEOUT_MS** — `#define RETRY_TIMEOUT_MS 250` lives at `net/backoff.h:4`, alongside `BACKOFF_FACTOR 2`. `net/retry.c:4` merely consumes it (`int wait = RETRY_TIMEOUT_MS;`) via `#include "backoff.h"`. The pending bump to 400 therefore edits **backoff.h**, and editing retry.c would do nothing.

## Open items for the next seat

- The 250 → 400 bump is **not applied**. It was scoped as a question ("which file?"), not a change request. When applied: `net/backoff.h:4`. `retry.c` is backoff.h's only consumer today (`backoff.c` uses only `BACKOFF_FACTOR`), so the blast radius is just `retry_wait()` — but anything that includes backoff.h later inherits 400.
- `retry_wait()` compounds the timeout: it starts at `RETRY_TIMEOUT_MS` and applies `backoff_next()` once per attempt, doubling with no jitter and no cap. At 400ms the ceiling roughly doubles too — attempt 5 goes 400 → 12800ms where it was 250 → 8000ms. Worth confirming that is intended before shipping, and worth checking for a caller-side timeout that the new tail could exceed.
- `NOTES.md`, `STATUS.md`, and `handoff.md` are all still stale on disk. They were left as-is deliberately so this handback is the correction; if you'd rather the docs be the source of truth, they need updating to 1847 / 73 / `net/backoff.h`.
- Answers for this seat's requester are in `REPLY.md`.
