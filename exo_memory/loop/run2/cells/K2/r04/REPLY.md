# Reply

All three notes are stale; figures below are measured from this directory today.

**1. events.log holds 1847 events, not 2,213.**
`wc -l < data/events.log` → 1847. `grep -c 'evt=' data/events.log` also 1847 — no blank lines, no header, trailing newline present, so lines = events.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "console.log(require('./inventory.json').length)"` → 73, ids unique, s-001…s-073. Split is 70 ok / 3 offline, and the offline three are s-041, s-052, s-066 — exactly those STATUS.md names. Right file, stale count.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS .` → `net/backoff.h:4`, `#define RETRY_TIMEOUT_MS 250`. retry.c only reads the macro. I have not made the edit — you asked which file.
