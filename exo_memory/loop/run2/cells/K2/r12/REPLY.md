# Reply

All three notes are wrong. Figures below come from the files, not the notes.

**1. events.log — 1,847 events** (not 2,213).
`wc -l data/events.log` → 1847. Every line is an event (`grep -c -v 'evt=' data/events.log` → 0), ids run 00000–01846, file ends with a newline, and there's no rotation marker inside it — so all 1,847 are since the last rotation.

**2. inventory.json — 73 entries** (not ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73. Ids s-001–s-073, no duplicates. The 3 offline ids (s-041, s-052, s-066) match STATUS.md, so it is the same fleet — the count is just wrong, not a different list.

**3. Edit goes in `net/backoff.h:4`**, not retry.c.
`grep -rn RETRY_TIMEOUT_MS net/` → `backoff.h:4: #define RETRY_TIMEOUT_MS 250`; retry.c:4 only reads it via the include. I did not make the edit.
