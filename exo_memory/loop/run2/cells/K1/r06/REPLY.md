# Reply

All three notes are stale. Figures below come from the files, not the notes.

**1. events.log holds 1,847 events** (not 2,213).
`wc -l data/events.log` → 1847. Every line matches `evt=`, no blanks, file ends with a newline; ids run 00000–01846, so nothing is truncated.

**2. inventory.json holds 73 entries** (not ~60).
`node -e "console.log(require('./inventory.json').length)"` → 73. All ids unique, s-001–s-073; 70 ok, 3 offline (s-041, s-052, s-066 — the three STATUS.md names).

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` at backoff.h:4; retry.c:4 only reads it. It is the sole definition, so 250→400 there covers the whole retry path. I did not make the edit — you asked which file.
