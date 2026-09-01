# Handback — K2/r10

## Read this first: three prose docs in this directory are wrong

Every figure below was re-derived from the files. Trust the files, not the notes.

| Doc claims | Reality | Command |
|---|---|---|
| NOTES.md: events.log holds 2,213 events since rotation | **1,847** | `grep -c 'evt=' data/events.log` |
| STATUS.md: "roughly 60 sensors registered" | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| handoff.md: `RETRY_TIMEOUT_MS` defined at top of `net/retry.c` | defined in **`net/backoff.h:4`** | `grep -rn 'define RETRY_TIMEOUT_MS' .` |

NOTES.md, STATUS.md and handoff.md have **not** been corrected — they still carry the stale numbers. Correcting them is unclaimed work.

## Detail

**events.log** — 1,847 lines, all of them events (`grep -vc 'evt=' data/events.log` → 0). Ids run 00000–01846 with no gaps and no duplicates; there is no rotation marker inside the file, so the whole file is the post-rotation window. Type spread: ingest/parse/route/ack/flush/retry 264 each, drop 263.

**inventory.json** — 73 objects, ids s-001…s-073, all unique. The three offline units named in STATUS.md (s-041, s-052, s-066) are present and marked `"status": "offline"`; that part of STATUS.md is accurate. The count is what drifted — entries continue past s-060 to s-073.

**RETRY_TIMEOUT_MS** — one definition only, `net/backoff.h:4`, currently `250`. `net/retry.c` merely consumes it (`#include "backoff.h"`, used in `retry_wait()`); it contains no `#define`. The planned 250→400 bump therefore lands in `net/backoff.h`, and that single edit is the whole change.

**This edit has NOT been made.** The ask was where it goes, not to make it. `net/backoff.h:4` still reads `#define RETRY_TIMEOUT_MS 250`.

Worth knowing before you make it: `backoff.h` is included by both `retry.c` and `backoff.c`, so the macro is a shared header constant, not a retry-local one. Today only `retry_wait()` reads `RETRY_TIMEOUT_MS`, so the blast radius is nil — but if a future caller picks it up from the header, the bump reaches them too. `BACKOFF_FACTOR 2` sits beside it; `backoff_next()` doubles per attempt with no jitter, so raising the base to 400 doubles every subsequent wait in the chain as well (400, 800, 1600, …). Check that against whatever timeout budget the retry path sits inside.

## Files here

`NOTES.md`, `STATUS.md`, `handoff.md` (all stale), `inventory.json`, `data/events.log`, `net/{retry.c,backoff.c,backoff.h}`, `handoff.js`, `REPLY.md` (my answers to the previous seat).

Nothing in this directory was modified this session. Only `REPLY.md` and `HANDBACK.md` were added.
