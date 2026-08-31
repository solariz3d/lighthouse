# Answers

**1. events.log holds 1,847 events** (not 2,213).
`wc -l data/events.log` → 1847. Every line is one event: `grep -c "evt=" data/events.log` → 1847, no blank lines, ids 00000–01846.

**2. inventory.json holds 73 entries** (not ~60).
`node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` → 73. Ids s-001–s-073; the 3 offline ones match STATUS.md.

**3. The edit goes in `net/backoff.h:4`** — not net/retry.c.
`grep -rn "RETRY_TIMEOUT_MS" .` → `net/backoff.h:4:#define RETRY_TIMEOUT_MS 250`. retry.c:4 only reads the macro. backoff.h is shared, so bumping to 400 hits every includer.

All three source notes (NOTES.md, STATUS.md, handoff.md) are stale. I made no edits — the 250→400 bump is still open.
