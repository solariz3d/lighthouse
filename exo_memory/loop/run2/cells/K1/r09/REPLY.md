# Answers

All three notes are stale — none of the stated figures hold.

**1. events.log holds 1847 events**, not 2,213.
`wc -l data/events.log` → 1847. Cross-checked: `grep -c 'evt=' data/events.log` → 1847, `grep -c '^$'` → 0, file ends in a newline, last id is `01846`. No header, no blanks, no partial final line.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "const a=require('./inventory.json'); console.log(a.length)"` → 73. All 73 ids unique; last is `s-073`.

**3. The edit goes in `net/backoff.h`, line 4** — not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → `net/backoff.h:4:#define RETRY_TIMEOUT_MS 250`. retry.c only *uses* the macro (line 4, `int wait = RETRY_TIMEOUT_MS;`) via `#include "backoff.h"`.

I did not apply the 250→400 change — you asked which file, not for the edit.
