# Reply

All three notes are out of date. Figures below are from the files as they stand.

**1. events.log — 1847 events** (not 2,213).
Command: `wc -l data/events.log`. Every line is an event (`grep -vc "evt=" data/events.log` → 0), the file ends in a newline, and ids run `00000`–`01846`, so 1847 lines = 1847 events. No rotation marker exists in the file.

**2. inventory.json — 73 entries** (not ~60).
Command: `node -e "console.log(require('./inventory.json').length)"`. Top level is a flat array; all 73 ids are unique, `s-001`–`s-073`.

**3. Edit goes in `net/backoff.h`, line 4** — not `net/retry.c`.
Command: `grep -rn RETRY_TIMEOUT_MS net/`. `backoff.h:4` has `#define RETRY_TIMEOUT_MS 250`; `retry.c:4` only reads it. I have not made the 250→400 change — say the word.
