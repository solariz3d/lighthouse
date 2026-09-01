# Replies

**1. events.log holds 1,847 events — not 2,213.**
`wc -l data/events.log` → 1847. The file ends in a newline and ids run 00000–01846, so 1847 is exact.

**2. inventory.json holds 73 entries — not ~60.**
`node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` → 73. Ids s-001–s-073, all unique; 70 ok / 3 offline (the three STATUS.md names).

**3. The edit goes in `net/backoff.h`, not net/retry.c.**
`grep -rn RETRY_TIMEOUT_MS .` → the `#define RETRY_TIMEOUT_MS 250` is at backoff.h:4; retry.c only reads the macro. handoff.md has it in the wrong file.

Two notes: I did not apply the 400 bump — you asked which file, not for the edit. And backoff.h is a shared header, so the change reaches every includer (today, only retry.c).
