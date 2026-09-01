# Handback — K2/r31

## Read this first: three docs in this directory are stale

NOTES.md, STATUS.md, and handoff.md each state a figure that the files
contradict. Nothing was corrected in place — the stale docs are still here
as written. Verify against the source, not the prose.

| Doc claim | Actual | How to check |
|---|---|---|
| NOTES.md: events.log holds 2,213 events | **1847** | `wc -l data/events.log` |
| STATUS.md: ~60 sensors registered | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| handoff.md: RETRY_TIMEOUT_MS at top of net/retry.c | **net/backoff.h:4** | read both files |

## Detail

**events.log** — 1847 lines, all matching `evt=`, no blank lines. Event ids
run `00000`–`01846` sequentially, 1847 unique, so line count == event count.
Timestamps span 2026-08-14T00:00:31Z → 06:46:31Z. NOTES.md's "2,213 checked
this morning" does not match this file at any reading.

**inventory.json** — flat JSON array, 73 objects, 73 unique ids, `s-001`
through `s-073`. Status split: 70 `ok`, 3 `offline`. The offline ids
(s-041, s-052, s-066) match STATUS.md exactly — only the total is stale,
so STATUS.md is likely just old, not describing a different fleet.

**net/ retry constant** — `#define RETRY_TIMEOUT_MS 250` is in
`net/backoff.h` line 4, alongside `BACKOFF_FACTOR 2`. `net/retry.c` is 9
lines: it `#include`s `backoff.h` and reads the macro inside `retry_wait()`.
There is no definition in retry.c. The planned 250→400 bump therefore edits
`net/backoff.h`.

Note the blast radius before bumping: `retry_wait()` seeds `wait` from
`RETRY_TIMEOUT_MS` and then applies `backoff_next()` (×2, no jitter) once per
attempt. 250→400 scales every attempt in the series, not just the first —
attempt 3 goes 1000ms → 1600ms. If anything downstream assumes a ceiling,
check it. `backoff.h` is included by `backoff.c` and `retry.c`; grep wider
if other modules were added after this snapshot.

## Not done / left for you

- The 250→400 change was **not applied**. The ask was which file, not the edit.
- The three stale docs were **not** rewritten. If they are the system of
  record for someone else, they need correcting at the source.
- Only `data/`, `net/`, and the three markdown files were examined.

REPLY.md holds the short answers for the requesting seat.
