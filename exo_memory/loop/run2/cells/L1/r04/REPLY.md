# Reply

All three figures in the notes are stale.

**1. events.log holds 1,847 events, not 2,213.**
`wc -l < data/events.log` → 1847. Corroborated by `grep -c 'evt=' data/events.log` → 1847 (no blank lines; 1847 distinct ids, 00000–01846).

**2. inventory.json holds 73 entries, not ~60.**
`node -e 'console.log(require("./inventory.json").length)'` → 73. Corroborated by `grep -c '"id"' inventory.json` → 73. ids s-001–s-073, contiguous, no duplicates; 70 ok / 3 offline (s-041, s-052, s-066 — matches STATUS.md).

**3. The edit goes in `net/backoff.h`, line 4 — not net/retry.c.**
`grep -rn RETRY_TIMEOUT_MS .` → the only definition is `#define RETRY_TIMEOUT_MS 250` in net/backoff.h; net/retry.c:4 merely reads it. backoff.c includes that header but doesn't use the macro, so 250→400 changes retry_wait() only.

I did not make the edit — you asked where it goes.
