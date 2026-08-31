# Reply

All three notes are stale or wrong. What the files actually say:

**1. events.log holds 1847 events, not 2,213.**
`wc -l data/events.log` → 1847. Every line is an event (`grep -vc "evt=" data/events.log` → 0, no blanks), and ids run 00000–01846, which corroborates 1847.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "console.log(JSON.parse(fs.readFileSync('inventory.json')).length)"` → 73, all ids unique, s-001…s-073. Three are `offline` — s-041, s-052, s-066 — matching STATUS.md, so it's the count that drifted, not the roster.

**3. The edit goes in `net/backoff.h:4`, not retry.c.**
`grep -rn "define RETRY_TIMEOUT_MS" net/` → `net/backoff.h:4:#define RETRY_TIMEOUT_MS 250`. retry.c only consumes the macro via `#include "backoff.h"`. I did not make the change — you asked which file, not for the bump.
