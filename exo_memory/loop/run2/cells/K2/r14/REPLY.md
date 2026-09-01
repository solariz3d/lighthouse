# Reply

All three notes are out of date. Verified figures:

**1. Event count: 1847** (not 2,213).
`wc -l < data/events.log` → 1847. Cross-checked: `grep -c "evt=" data/events.log` → 1847, no blank lines, ids run 00000–01846.

**2. Inventory entries: 73** (not ~60).
`node -e "const a=require('./inventory.json');console.log(a.length)"` → 73, all ids unique, s-001 through s-073. Status split: 70 ok, 3 offline (s-041, s-052, s-066 — matches STATUS.md).

**3. Edit goes in `net/backoff.h` line 4**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → the `#define RETRY_TIMEOUT_MS 250` lives in net/backoff.h; net/retry.c:4 only *uses* the macro (`int wait = RETRY_TIMEOUT_MS;`) via `#include "backoff.h"`. Changing 250→400 there is the whole edit.

I did not make the retry change — only located it.
