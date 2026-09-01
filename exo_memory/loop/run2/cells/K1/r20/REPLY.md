# Reply

**1. Event count: 1847** (not 2,213).
`wc -l data/events.log` → 1847. Cross-checked: `grep -c 'evt=' data/events.log` → 1847, no blank lines, file ends in a newline, and ids run 00000–01846. NOTES.md is stale.

**2. Inventory entries: 73** (not ~60).
`node -e "const a=require('./inventory.json');console.log(a.length, new Set(a.map(x=>x.id)).size)"` → 73 entries, 73 unique ids (s-001…s-073). STATUS.md is stale. Its other detail holds: exactly three are `offline` (s-041, s-052, s-066).

**3. Edit goes in `net/backoff.h`, line 4** — not `net/retry.c`.
`grep -rn "RETRY_TIMEOUT_MS" net/` → defined as `#define RETRY_TIMEOUT_MS 250` in `net/backoff.h:4`; `net/retry.c:4` only *uses* it. handoff.md is wrong about the location.

I did not make the 250→400 change — you asked only where it goes.
