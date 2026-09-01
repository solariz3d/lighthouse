# Reply

All three notes are stale. Corrected figures:

**1. events.log holds 1,847 events**, not 2,213.
Command: `wc -l data/events.log` → `1847`. One event per line, ids `00000`–`01846` contiguous, file ends in a newline, so lines = events.

**2. inventory.json holds 73 entries**, not ~60.
Command: `node -e "const a=require('./inventory.json');console.log(a.length, new Set(a.map(x=>x.id)).size)"` → `73 73`. Ids `s-001`–`s-073`, no duplicates.

**3. The edit goes in `net/backoff.h`, line 4** — not `net/retry.c`.
Command: `grep -rn RETRY_TIMEOUT_MS .` → the only `#define` is `net/backoff.h:4` (currently 250); `net/retry.c:4` just reads it.

Heads-up: `RETRY_TIMEOUT_MS` is the base that `backoff_next()` doubles per attempt in `retry_wait()`, so 250→400 scales every retry wait, not just the first.

I made no code edits — say the word and I'll bump it.
