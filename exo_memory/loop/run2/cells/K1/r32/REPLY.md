# Reply

All three source notes are stale. Verified figures:

**1. events.log holds 1,847 events** (not 2,213).
`wc -l data/events.log` → 1847. Every line is an event — `grep -c "evt=" data/events.log` → 1847, zero blank lines, no rotation marker in the file — and ids run 00000–01846, so the line count is the event count.

**2. inventory.json holds 73 entries** (not ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73. All ids unique, s-001…s-073; 70 `ok`, 3 `offline` (s-041, s-052, s-066 — the three STATUS.md names).

**3. The edit goes in `net/backoff.h:4`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS .` → the only `#define` is `net/backoff.h:4` (currently 250); `net/retry.c:4` just reads the macro. Editing retry.c would do nothing.

I did not apply the 250 → 400 bump — say the word and it's one line.
