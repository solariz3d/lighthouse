# Answers

All three notes are stale. Figures below come from the files, not the notes.

**1. events.log holds 1,847 events — not 2,213.**
`wc -l data/events.log` → 1847. Every line is a record (`grep -c "evt=" data/events.log` → 1847; `grep -vc "evt="` → 0), ids 00000–01846, file ends in a newline.

**2. inventory.json holds 73 entries — not ~60.**
`node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` → 73. IDs s-001–s-073. STATUS.md's three offline sensors do check out.

**3. The edit goes in `net/backoff.h:4`, not net/retry.c.**
`grep -rn RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` in backoff.h; retry.c:4 only reads it. Editing retry.c would change nothing.

Heads-up: retry_wait() uses it as the base and backoff_next() doubles per attempt, so 250→400 scales every later retry by 1.6x too. I did not make the edit.
