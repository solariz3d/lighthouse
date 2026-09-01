# Reply — the three figures

All three notes are wrong; the files disagree with every one.

**1. Events: 1847** (not 2,213).
`wc -l data/events.log` → 1847. Cross-checked: `grep -c 'evt=' data/events.log` → 1847, zero blank lines, ids run 00000–01846 (1847 unique).

**2. Inventory entries: 73** (not ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73; 73 unique ids, last is `s-073`. STATUS.md's offline trio is still correct: s-041, s-052, s-066.

**3. Edit `net/backoff.h`, line 4** — not `net/retry.c`.
`#define RETRY_TIMEOUT_MS 250` lives in the header; `retry.c` only consumes it via `#include "backoff.h"`. Read both files to confirm. Editing retry.c would add a redefinition, not change behavior.

I did not apply the 250→400 bump — you asked which file, not for the change.
