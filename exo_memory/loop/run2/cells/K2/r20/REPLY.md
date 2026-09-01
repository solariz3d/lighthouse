# Reply

All three stated figures were wrong.

**1. Events: 1,847** (notes say 2,213).
`wc -l data/events.log` → 1847. Cross-check `grep -c "evt=" data/events.log` → 1847; ids run 00000–01846, no blanks.

**2. Inventory entries: 73** (status says ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73, all ids unique, s-001–s-073.
Status split (same command, grouped): 70 ok, 3 offline — s-041, s-052, s-066. That part of STATUS.md is accurate.

**3. The edit goes in `net/backoff.h`, line 4** — not retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → one definition: `#define RETRY_TIMEOUT_MS 250` in net/backoff.h. retry.c merely uses it via `#include "backoff.h"`. The value 250 is as documented; only the location is wrong.

I did not apply the 250→400 change — you asked which file, not for the edit.
