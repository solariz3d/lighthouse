# Reply

All three notes are off.

**1. events.log holds 1847 events**, not 2,213.
`wc -l data/events.log` → 1847. All 1847 lines match `evt=`; no blank or comment lines, file ends with a newline, so lines = events.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "const a=require('./inventory.json'); console.log(a.length, new Set(a.map(x=>x.id)).size)"` → 73 objects, 73 unique ids (s-001…s-073).

**3. The edit goes in `net/backoff.h`**, not `net/retry.c`.
`grep -rn RETRY_TIMEOUT_MS .` → defined at `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`). `net/retry.c:4` only reads it via `#include "backoff.h"`.

I did not apply the bump — you asked which file. Note backoff.h is a shared header; retry.c is its only consumer today, so 400 is contained, but future includers inherit it.
