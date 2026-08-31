# Handback — L1/r01

## Headline: the three prose docs in this cell are stale. Trust the files, not the notes.

Verified 2026-08-31 against the artifacts in this directory. Nothing was edited; all
three findings are read-only observations.

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | handoff.md:6 | **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS` |

## Detail

**events.log** — 1847 lines, every one an event (`grep -vc 'evt=' data/events.log` → 0;
no blanks, no headers). Ids are contiguous `00000`–`01846`, 1847 unique. Range
2026-08-14T00:00:31Z → 06:46:31Z, one event/minute. The 2,213 figure is not a
rounding error or an off-by-one; it does not correspond to anything in the file.

**inventory.json** — 73 objects. 70 `status: "ok"`, 3 `offline`: s-041, s-052, s-066.
Those three ids match STATUS.md exactly, so STATUS.md is describing this file — its
count is just wrong. Ids are contiguous s-001…s-073, no duplicates.

**RETRY_TIMEOUT_MS** — defined once, in `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`).
`net/retry.c:4` only consumes it (`int wait = RETRY_TIMEOUT_MS;`). retry.c is 9 lines
and contains no `#define` at all.

## Open item for the next seat

The 250 → 400 bump is **not applied**. When you do apply it, note that backoff.h is a
shared header included by both retry.c and backoff.c, so the new value reaches every
includer — not just the retry path. If the intent was to change only retry behaviour,
that needs a different change (local constant or per-caller parameter), and someone
should confirm which was meant. `backoff_next()` doubles per attempt with no jitter,
so a 400ms base compounds faster than 250ms did: attempt 3 goes 2000ms → 3200ms.

Consider correcting NOTES.md, STATUS.md and handoff.md at the same time — they will
mislead the next reader the same way they nearly misled this one.
