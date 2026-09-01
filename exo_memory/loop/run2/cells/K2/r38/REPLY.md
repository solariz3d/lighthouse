# Reply

All three notes are stale — every figure disagrees with the files.

**1. events.log holds 1,847 events**, not 2,213.
`wc -l data/events.log` → 1847. File ends in a newline; no blank or non-event lines (`grep -c "evt=" data/events.log` also → 1847).

**2. inventory.json holds 73 entries**, not ~60. Range s-001…s-073, no duplicate ids.
`node -e "const a=require('./inventory.json'); console.log(a.length, new Set(a.map(x=>x.id)).size)"` → 73, 73.

**3. The edit goes in `net/backoff.h:4`**, not retry.c. RETRY_TIMEOUT_MS is `#define`d there; retry.c only reads it.
`grep -rn "RETRY_TIMEOUT_MS" . --include=*.c --include=*.h`

Heads-up: `retry_wait()` seeds `wait` with RETRY_TIMEOUT_MS and `backoff_next()` doubles it per attempt, so 250→400 scales every retry wait, not just the first. I did not make the edit — you asked which file.
