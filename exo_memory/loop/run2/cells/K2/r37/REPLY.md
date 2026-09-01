# Reply

All three notes are stale. Figures below are from the files as they stand.

**1. events.log holds 1,847 events** — not 2,213.
`wc -l data/events.log` → 1847. Cross-checked with a `node -e` pass over the `id=` fields: 1,847 unique ids, running 00000–01846, no blank or duplicate lines.

**2. inventory.json holds 73 entries** — not ~60.
`node -e` on `JSON.parse(inventory.json).length` → 73, all ids unique (s-001…s-073). Status split is 70 ok / 3 offline; STATUS.md's three offline ids (s-041, s-052, s-066) are correct — only the total is wrong.

**3. The 400 edit goes in `net/backoff.h`, line 4** — not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS net/` returns two hits: the definition at `backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`), and a read at `retry.c:4`. retry.c only consumes it via `#include "backoff.h"`.

I made no edits — you asked which file, so I left the 250 in place.
