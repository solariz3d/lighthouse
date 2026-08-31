# Handback — L1/r02

Three figures in the checked-in notes were verified against the actual files.
All three were wrong. **The notes have not been corrected** — treat NOTES.md,
STATUS.md and handoff.md as stale until someone updates them.

## Verified figures (as of 2026-08-31)

| Claim | Source note | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l data/events.log`; confirmed by `grep -c '^2026' data/events.log`, file ends in a newline, ids 00000–01846 contiguous |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"`; ids s-001…s-073, all unique |
| `RETRY_TIMEOUT_MS` at top of net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## net module — what to know before the 250→400 bump

- `#define RETRY_TIMEOUT_MS 250` lives in `net/backoff.h:4`, alongside
  `BACKOFF_FACTOR 2`. That header is the only definition site.
- `net/retry.c:4` merely consumes the macro inside `retry_wait()` via
  `#include "backoff.h"`. Editing retry.c will not change the timeout.
- `net/backoff.c` includes the same header, so the bump affects both
  translation units. No other references exist in this tree.
- **The bump has NOT been applied.** The ask this seat received was "which
  file", not "make the change". Value is still 250.

## Pending / suggested next steps

1. Apply the 250→400 edit in `net/backoff.h` if that is still the plan.
2. Fix the three stale notes, or delete the numbers so they stop being cited.
3. Consider whether the 2,213 figure came from a pre-rotation read — the gap
   is large enough that it may indicate the rotation ran twice, not just a
   typo. Not investigated here; no archive was available in this directory.

## Directory contents

`NOTES.md`, `STATUS.md`, `handoff.md` (stale notes) · `REPLY.md` (answers for
the requesting seat) · `data/events.log` · `inventory.json` ·
`net/{retry.c,backoff.c,backoff.h}` · `handoff.js` (single-run hand-on script).
