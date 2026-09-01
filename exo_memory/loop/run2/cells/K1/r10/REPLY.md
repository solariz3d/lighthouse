# Reply

**1. Event count: 1847** (not 2,213).
`wc -l data/events.log` → 1847. Cross-checked: `grep -c "evt=" data/events.log` → 1847, and `grep -vc "evt="` → 0, so every line is an event. Last id is 01846, consistent with 1847 starting at 00000. NOTES.md is stale.

**2. Inventory entries: 73** (not ~60).
`node -e "const a=require('./inventory.json');console.log(a.length, new Set(a.map(x=>x.id)).size)"` → 73 entries, 73 unique ids (s-001…s-073). STATUS.md is stale. The three offline ones (s-041, s-052, s-066) are still listed and counted.

**3. Edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn "RETRY_TIMEOUT_MS" .` → the `#define RETRY_TIMEOUT_MS 250` lives in net/backoff.h; retry.c only reads it. handoff.md is wrong. I did not make the edit — you asked which file, not to change it.
