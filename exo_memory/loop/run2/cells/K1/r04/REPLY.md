# Answers

**1. events.log — 1847 events, not 2,213.**
`wc -l data/events.log` → 1847. Every line is an event: `grep -vc "evt=" data/events.log` → 0, and the file ends with a newline, so lines = events. Last record is `id=01846` (ids are 0-based, consistent with 1847).

**2. inventory.json — 73 entries, not ~60.**
`node -e "const a=require('./inventory.json');console.log(a.length, new Set(a.map(x=>x.id)).size)"` → 73 entries, 73 unique ids (s-001…s-073). No duplicates padding the count.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn "RETRY_TIMEOUT_MS" .` → defined once, at `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`). `net/retry.c:4` only reads it. I did not make the edit — you asked only where it goes.

NOTES.md, STATUS.md, and handoff.md are all stale on these points.
