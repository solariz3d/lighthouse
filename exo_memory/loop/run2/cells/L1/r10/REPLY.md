# Reply

All three notes are stale. Measured values:

**1. events.log holds 1,847 events** (not 2,213).
`wc -l data/events.log` → 1847. Every line is a real record —
`grep -c '^[0-9-]*T[0-9:]*Z evt=' data/events.log` → 1847, zero non-matching
lines, file ends in a newline. Event ids run 00000–01846.

**2. inventory.json holds 73 entries** (not ~60).
`node -e "const a=require('./inventory.json'); console.log(a.length, new Set(a.map(x=>x.id)).size)"`
→ `73 73`. All ids unique, s-001…s-073.

**3. The 400 edit goes in `net/backoff.h:4`**, not retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → the `#define RETRY_TIMEOUT_MS 250` lives in
net/backoff.h; retry.c line 4 only *reads* it via `#include "backoff.h"`.
Editing retry.c would not change the value.

I did not apply the bump — you asked which file, not for the change.
