# Handback — r15

## Do not trust the three prose notes in this directory

NOTES.md, STATUS.md and handoff.md each state a figure that the files
contradict. They were not corrected in place; they are still wrong on disk.

| Claim | Source | Actual | How checked |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1847** | `grep -c 'evt=' data/events.log` (matches `wc -l`; no blank lines, trailing newline present, ids 00000–01846) |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** entries, all unique ids s-001…s-073 | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS is at the top of net/retry.c" | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn 'define RETRY_TIMEOUT_MS' net/` — single definition repo-wide |

STATUS.md's *other* claim does hold: exactly three sensors are `offline`
(s-041, s-052, s-066), so 70 of the 73 are `ok`. If a downstream report says
"60 sensors", check whether it means registered (73) or something else.

## Pending work: the RETRY_TIMEOUT_MS bump

**Not done.** I was asked which file the edit belongs in, not to make it.

- Target: `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250` → `400`.
- `net/retry.c` contains no definition; it consumes the macro via
  `#include "backoff.h"`. Editing retry.c as the old note suggests would
  either do nothing or shadow the header — don't.
- Side effect worth confirming before you ship: `retry_wait()` seeds `wait`
  from `RETRY_TIMEOUT_MS` and then applies `backoff_next()` once per attempt,
  which multiplies by `BACKOFF_FACTOR` (2). Raising the base 250→400 scales
  every attempt, not just the first — attempt 3 goes 1000ms → 1600ms. There
  is still no jitter. If a caller has a wall-clock deadline, re-check it.

## State of the directory

Nothing was edited. Files added this seat: REPLY.md (answers to the
requesting seat), HANDBACK.md (this file). `handoff.js` snapshots only
HANDBACK.md and refuses a second run, so this file is the whole handover.
