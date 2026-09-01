# Reply

All three notes are stale. Figures below come from the files themselves.

**1. events.log holds 1,847 events**, not 2,213.
`wc -l data/events.log` → 1847. Cross-checked: no blank lines, 1847 lines match `evt=`, 1847 unique `id=` values (00000–01846).

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73, ids s-001–s-073, all unique. STATUS.md's "three offline" still holds: s-041, s-052, s-066.

**3. The edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → the only definition is `#define RETRY_TIMEOUT_MS 250` in net/backoff.h:4; retry.c:4 merely reads the macro. Change 250 → 400 there; retry.c needs no edit.

I did not make that edit — you asked which file, so I treated it as scoping.
