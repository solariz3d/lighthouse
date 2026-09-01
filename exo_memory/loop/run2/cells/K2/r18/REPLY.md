# Reply — the three figures

All three notes are stale. Measured values:

**1. Events: 1,847** (notes say 2,213).
`wc -l data/events.log` → 1847. All lines are events (`grep -vc "evt=" data/events.log` → 0); ids run 00000–01846, no rotation marker in-file.

**2. Inventory: 73 entries** (status says ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73. All ids unique; 3 offline (s-041, s-052, s-066), which does match STATUS.md.

**3. The edit goes in `net/backoff.h:4`, not retry.c.**
`grep -rn RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` lives in backoff.h; retry.c only reads it at line 4. It's a shared-header macro, so 400 reaches every includer — today that's only retry.c.

I did not apply the 250→400 change; say the word and I will.
