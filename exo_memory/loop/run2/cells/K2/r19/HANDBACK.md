# Handback — K2/r19

Three figures in the checked-in docs are wrong. Verified against the files in this directory on 2026-09-01. **Trust the files, not NOTES.md / STATUS.md / handoff.md.**

## Corrected facts

| Claim in docs | Actual | How verified |
|---|---|---|
| NOTES.md: events.log at 2,213 events since rotation | **1,847** | `wc -l data/events.log` → 1847; zero blank lines; event ids run 00000–01846, so lines == events |
| STATUS.md: "roughly 60 sensors registered" | **73 entries** | `node -e "console.log(require('./inventory.json').length)"` → 73; ids s-001–s-073, all unique |
| handoff.md: RETRY_TIMEOUT_MS defined at top of net/retry.c | **Defined in `net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS net/` |

## Detail worth carrying forward

- **inventory.json**: top-level JSON array of `{id, type, status}`. Status split is 70 `ok` / 3 `offline`. The three offline ids (s-041, s-052, s-066) match STATUS.md exactly — so STATUS.md's offline list is current and only its *count* is stale.
- **RETRY_TIMEOUT_MS**: `net/backoff.h` line 4 is `#define RETRY_TIMEOUT_MS 250`. `net/retry.c` line 4 only *reads* it, via `#include "backoff.h"`. An edit to retry.c would compile and change nothing at runtime — this is the trap in handoff.md.
- backoff.h is a shared header, but retry.c is presently its only consumer of that constant (`backoff.c` uses only `BACKOFF_FACTOR`), so the bump is contained. No other includers to sweep.

## Open / not done

- **The bump to 400 has NOT been applied.** The ask this seat received was "which file does the edit go in?", not "make the edit". `net/backoff.h:4` still reads `250`. If you are picking up the sprint task, that one line is the whole change.
- The stale numbers in NOTES.md, STATUS.md, and handoff.md were left in place — I reported them rather than rewriting someone else's notes. Worth correcting at the source if these docs are load-bearing for anyone else, especially handoff.md, since its file pointer actively misdirects.
- Nothing in this directory was modified except the addition of REPLY.md and this file.
