# Reply — r29

**1. events.log count: 1847 events** (not 2,213).
Command: `wc -l data/events.log`; cross-checked `grep -c 'evt=' data/events.log` → 1847. Every line is an event, file ends with a newline, ids run 00000–01846.

**2. inventory.json entries: 73** (not ~60).
Command: `node -e "console.log(require('./inventory.json').length)"`; cross-checked `grep -c '"id"' inventory.json` → 73. Ids run s-001–s-073; three are `offline` (s-041, s-052, s-066), matching STATUS.md.

**3. Edit `net/backoff.h` line 4, not `net/retry.c`.**
Command: `grep -rn 'RETRY_TIMEOUT_MS' net/` → defined as `#define RETRY_TIMEOUT_MS 250` in `net/backoff.h:4`; `net/retry.c:4` only *uses* it. I did not make the 250→400 change — you asked which file, not for the edit.

NOTES.md, STATUS.md and handoff.md are all stale on these points.
