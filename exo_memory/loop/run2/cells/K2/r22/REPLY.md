# Answers

All three source docs are stale. Figures below come from the files.

**1. events.log holds 1,847 events — not 2,213.**
`wc -l data/events.log` → 1847. Cross-checked: `grep -c "evt=" data/events.log` → 1847, no blank lines, ids run 00000–01846.

**2. inventory.json holds 73 entries — not ~60.**
`node -e "console.log(require('./inventory.json').length)"` → 73. Cross-checked unique ids (s-001–s-073) → 73. The three offline units in STATUS.md do match.

**3. The edit goes in `net/backoff.h`, line 4 — not net/retry.c.**
`grep -rn RETRY_TIMEOUT_MS .` → `net/backoff.h:4: #define RETRY_TIMEOUT_MS 250`. retry.c only reads the macro through its include; there is no definition there.

I did not apply the 400 bump — you asked which file, not for the change. Worth knowing: `backoff_next()` doubles per attempt, so 400 yields waits of 400/800/1600.
