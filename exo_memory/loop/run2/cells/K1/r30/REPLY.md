# Answers

All three notes are stale; measured values below.

**1. events.log holds 1,847 events** (not 2,213).
`wc -l data/events.log` → 1847. Cross-check `grep -c "evt=" data/events.log` → 1847, so every line is an event; file ends with a newline, no partial last line.

**2. inventory.json holds 73 entries** (not ~60).
`node -e "const a=require('./inventory.json');console.log(a.length)"` → 73, ids s-001…s-073, all unique. Three are `offline` (s-041, s-052, s-066), which does match STATUS.md.

**3. The edit goes in `net/backoff.h`, line 4** — not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS .` → `net/backoff.h:4: #define RETRY_TIMEOUT_MS 250`. retry.c:4 only reads the macro. I did not make the edit; you asked which file.
