# Reply

All three notes are out of date. Measured figures:

**1. events.log — 1,847 events** (not 2,213).
`wc -l data/events.log` → 1847. Verified every line is an event:
`grep -c "evt=" data/events.log` → 1847, no blank lines, file ends with a
newline, so no partial last line.

**2. inventory.json — 73 entries** (not ~60).
`node -e "const d=require('./inventory.json'); console.log(d.length, new Set(d.map(x=>x.id)).size)"`
→ 73 entries, 73 unique ids. No duplicates inflating the count.

**3. Edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn "RETRY_TIMEOUT_MS" net/` → defined at `net/backoff.h:4`
(`#define RETRY_TIMEOUT_MS 250`); `net/retry.c:4` only *reads* it. Editing
retry.c would be a no-op. I did not make the change — say the word and I will.
