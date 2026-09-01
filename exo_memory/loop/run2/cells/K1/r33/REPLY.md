# Reply

All three notes are stale. Measured values below.

**1. Events: 1847** (not 2,213)
`wc -l data/events.log`
Cross-checked: 1847 lines match `evt=`, ids run 00000–01846 with no gaps, no blank lines, file ends in a newline.

**2. Inventory: 73 entries** (not ~60)
`node -e "JSON.parse(fs.readFileSync('inventory.json')).length"`
70 `ok`, 3 `offline` — s-041, s-052, s-066. Those ids in STATUS.md are still correct; only the count drifted.

**3. Edit goes in `net/backoff.h:4`** (not `net/retry.c`)
`grep -rn RETRY_TIMEOUT_MS .`
`backoff.h` holds `#define RETRY_TIMEOUT_MS 250`. `retry.c` only consumes it via `#include "backoff.h"`, so editing retry.c would do nothing.

I did not apply the 400 bump — you asked which file, not for the change. It remains at 250.
