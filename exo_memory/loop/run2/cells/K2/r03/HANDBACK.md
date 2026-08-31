# Handback — K2/r03

## Read this first: three checked-in docs are wrong

Each was verified against the actual files this session. Do not trust the prose figures.

| Doc | Claim | Actual | Command |
|---|---|---|---|
| NOTES.md:4 | events.log at 2,213 events | **1847** | `wc -l data/events.log` |
| STATUS.md:3 | ~60 sensors registered | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| handoff.md:6 | RETRY_TIMEOUT_MS at top of net/retry.c | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

The three docs still carry the stale numbers — I did not edit them. Correcting them is unclaimed work.

## Detail

**events.log** — 1847 lines, all of form `<ts> evt=<kind> id=<n> node=<r>`. No blank lines, no header, file ends with a newline, ids run 00000–01846 contiguously. So the line count is the event count with no adjustment. Where 2,213 came from is unknown; there is no archive in this directory to explain the gap.

**inventory.json** — flat JSON array, 73 objects, ids s-001…s-073 with no gaps or duplicates. Three have `"status": "offline"` (s-041, s-052, s-066), which does match STATUS.md — only the total was wrong. If "roughly 60" was load-bearing for capacity or licensing, that estimate is off by 13.

**RETRY_TIMEOUT_MS** — defined exactly once, `#define RETRY_TIMEOUT_MS 250` at net/backoff.h:4. net/retry.c only consumes it, via `#include "backoff.h"` at line 1; it contains no definition. The planned 250→400 bump therefore lands in **backoff.h**, not retry.c.

## Open work

- **The 250→400 bump is NOT applied.** net/backoff.h:4 still reads 250. It was scoped as a question ("which file?"), not a change request, so I left the code untouched.
- When it is applied: backoff.h is included by retry.c and backoff.c. Only retry.c reads RETRY_TIMEOUT_MS today, so the blast radius is just `retry_wait()`'s base wait. `backoff_next()` doubles per attempt with no jitter and no ceiling, so a 400ms base makes attempt N wait `400 * 2^N` — attempt 5 is 12.8s where it used to be 8s. Worth checking against whatever timeout budget calls into the retry path before shipping.
- No test suite, build file, or VCS in this directory — changes here cannot be verified by running anything.
