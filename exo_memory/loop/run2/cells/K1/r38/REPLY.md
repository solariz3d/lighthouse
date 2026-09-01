# Reply — three answers

All three notes are stale. Figures below come from the files themselves.

**1. Event count: 1,847** (not 2,213).
`wc -l data/events.log` → 1847. Cross-checked: `grep -c "evt=" data/events.log` → 1847, `grep -c "^$"` → 0 blank lines, and ids run 00000–01846 (= 1,847).

**2. Inventory entries: 73** (not ~60).
`node -e "const a=require('./inventory.json');console.log(a.length)"` → 73. All 73 ids unique.

**3. Edit goes in `net/backoff.h`, line 4** — not retry.c.
`grep -rn "RETRY_TIMEOUT_MS" net/` → the `#define RETRY_TIMEOUT_MS 250` is in `net/backoff.h:4`; `net/retry.c:4` only reads it.

Caveat: backoff.h is a shared header. Today only retry.c and backoff.c include it, so bumping to 400 is contained — but it's a header change, not a local one.

I made no edits; the 400 bump is unapplied.
