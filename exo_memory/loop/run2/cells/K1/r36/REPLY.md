# Reply

All three notes are stale or wrong.

**1. events.log holds 1,847 events** — not 2,213.
`wc -l data/events.log`; cross-checked with `grep -c "evt=" data/events.log` (1847) and 1847 unique `id=` values. No blank lines, trailing newline present, so the line count is the event count.

**2. inventory.json holds 73 entries** — not ~60.
`node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"`
Status split is 70 ok / 3 offline, so STATUS.md's "three are offline" still holds; only the total drifted.

**3. The edit goes in `net/backoff.h:4`** — not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → backoff.h has `#define RETRY_TIMEOUT_MS 250`; retry.c only reads it. It is a shared header, so 250→400 affects every includer. I did not make the edit — you asked only where it belongs.
