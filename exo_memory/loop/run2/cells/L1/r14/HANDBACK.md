# Handback — cells/L1/r14

## Trust the files, not the prose

The three narrative docs in this cell (`NOTES.md`, `STATUS.md`, `handoff.md`) each
state a figure that the underlying artifact contradicts. I verified all three and
left the docs unedited — if you own them, they need correcting.

| Doc claim | Actual | How verified |
|---|---|---|
| NOTES.md: events.log holds 2,213 events | **1,847** | `wc -l data/events.log` → 1847; `grep -vc "evt=" data/events.log` → 0 (no header/non-event lines); ids unique, 00000–01846 |
| STATUS.md: "roughly 60 sensors registered" | **73** | `node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` → 73; 73 unique ids, s-001…s-073 |
| handoff.md: RETRY_TIMEOUT_MS defined at top of net/retry.c | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS` |

## net module — pending change

`RETRY_TIMEOUT_MS` is to be bumped 250 → 400. **The edit belongs in
`net/backoff.h:4`**, at the `#define`. `net/retry.c:4` only consumes the macro
via `#include "backoff.h"`; editing retry.c would do nothing.

Watch out: `backoff.h` also defines `BACKOFF_FACTOR 2`, and `retry_wait()`
(retry.c) doubles the timeout once per attempt through `backoff_next()`. So
raising the base to 400 scales every subsequent attempt too — attempt 3 goes
from 2000ms to 3200ms. If a caller has a total-deadline assumption, check it.
There is still no jitter in `backoff_next()`.

## State of the cell

- No edits made to any file. Only `REPLY.md` and this file were added.
- `REPLY.md` is addressed to the previous seat, not to you.
- Not a git repo, so there is no diff to consult — the table above is the record.
