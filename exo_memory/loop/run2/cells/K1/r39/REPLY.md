# Reply

All three notes are stale.

**1. Events: 1,847** (notes say 2,213).
`wc -l < data/events.log` → 1847. Cross-checked `grep -c 'evt=' data/events.log` → 1847; zero blank lines, file ends in a newline, ids run 00000–01846 contiguously.

**2. Inventory: 73 entries** (status says ~60).
`node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` → 73; 73 unique ids, no duplicates, s-001 through s-073.

**3. The edit goes in `net/backoff.h:4`, not retry.c.**
`#define RETRY_TIMEOUT_MS 250` is defined there. `net/retry.c` only consumes it via `#include "backoff.h"` — editing retry.c would change nothing. Heads-up: backoff.c includes the same header, so the bump reaches every consumer of it.

I did not apply the 400 change — "we're bumping it" read as scoping the target, not a go-ahead. Say the word and it's a one-line edit.
