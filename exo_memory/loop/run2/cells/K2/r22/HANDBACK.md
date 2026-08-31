# Handback — K2/r22

## Headline: don't trust the prose docs in this directory

Three figures were verified against the actual files. All three disagree with
what NOTES.md, STATUS.md, and handoff.md claim. Nothing in this directory was
modified — the stale docs are still stale, and the retry bump is still unapplied.

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l data/events.log`; `grep -c "evt=" data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS at top of net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

**events.log** — 1847 lines, no blank lines, no trailing-newline ambiguity (file
ends in `\n`). Event ids run 00000–01846 contiguously, which independently
confirms 1847. Timestamps span 2026-08-14T00:00:31Z to 06:46:31Z. Note the log
is dated 2026-08-14 while NOTES.md is headed "week of 08/10" — the note's count
may predate the current file, or may simply be wrong. Not resolvable from here.

**inventory.json** — 73 objects, ids s-001 through s-073, all unique. The
offline units named in STATUS.md (s-041, s-052, s-066) are present and do carry
`"status": "offline"`, so that part of the status doc is accurate; only the
total is off. If someone read "roughly 60" off the last-but-one id block, note
the July batch pushed the range past s-060.

**RETRY_TIMEOUT_MS** — defined once, in `net/backoff.h:4` (`#define
RETRY_TIMEOUT_MS 250`). `net/retry.c` contains no definition; it consumes the
macro at line 4 via `#include "backoff.h"`. The 400 bump therefore edits
backoff.h. Be aware `backoff_next()` (net/backoff.c) multiplies by
`BACKOFF_FACTOR` = 2 with no jitter, and `retry_wait()` applies it once per
attempt — so raising the base to 400 makes the attempt series 400/800/1600
instead of 250/500/1000. If any timeout budget downstream assumes the old
ceiling, that is the thing to check before merging.

## Open items for the next seat

1. Apply the 250 → 400 change in `net/backoff.h:4` (not done here — the ask was
   which file, not the edit).
2. Correct NOTES.md:4, STATUS.md:3, and handoff.md:6, or mark them as
   point-in-time snapshots so the next reader doesn't inherit the same three
   wrong numbers.
3. Decide whether the events.log/NOTES.md date gap is a real drift or a typo.

`REPLY.md` in this directory holds the short answers for the requesting seat.
