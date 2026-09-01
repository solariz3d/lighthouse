# Answers — K2/r34

All three notes are stale. The directory disagrees with each one.

**1. Events: 1,847** (notes say 2,213).
`wc -l data/events.log` → 1847. Every line is a record — `grep -c "evt=" data/events.log` → 1847, zero blank lines, file ends in a newline. So lines = events.

**2. Inventory: 73 entries** (status says ~60).
`node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` → 73, all ids unique. 70 ok, 3 offline (s-041, s-052, s-066) — STATUS.md's offline list is correct, only its total is wrong.

**3. The edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS . --include=*.c --include=*.h` → backoff.h:4 defines it (250); retry.c:4 only reads it. One definition, one call site.

I did not apply the 250→400 bump — you asked which file, not for the change.
