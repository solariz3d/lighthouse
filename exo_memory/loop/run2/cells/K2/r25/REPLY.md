# Answers

All three figures in the notes are stale.

**1. Log holds 1,847 events** (not 2,213).
`wc -l data/events.log` → 1847. No blank lines, one event per line; last record is `id=01846`, zero-indexed, which independently confirms 1847.

**2. Inventory holds 73 entries** (not ~60).
`node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` → 73, all IDs unique, no duplicates. 70 `ok` + 3 `offline` (s-041, s-052, s-066 — matches STATUS.md).

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS` → the `#define RETRY_TIMEOUT_MS 250` is at `backoff.h:4`. `retry.c` only *reads* it (line 4) via `#include "backoff.h"`, so editing retry.c would change nothing. `backoff.c` includes the same header but uses only `BACKOFF_FACTOR`, so the bump to 400 stays contained to the retry path.

I did not apply the 400 bump — you asked which file, not for the edit.
