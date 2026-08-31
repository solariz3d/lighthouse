# Handback — K2/r04

## Headline: every prose note in this directory is stale. Measure, don't read.

Three figures were checked against the actual files today. All three disagreed
with the notes that describe them.

| Claim | Source | Actual | How measured |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1847** | `wc -l < data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS in net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

**events.log — 1847.** Every line is a well-formed `evt=` record: `grep -c 'evt='`
returns 1847, blank-line count is 0, there is no header row, and the file ends in a
newline (so `wc -l` does not undercount a final partial line). Lines = events, 1:1.

**inventory.json — 73.** Parsed as JSON, not grepped. 73 array entries, 73 unique
ids, contiguous s-001…s-073. Status split 70 `ok` / 3 `offline`. The three offline
are s-041, s-052, s-066 — precisely the ids STATUS.md lists. So STATUS.md is
describing this same file; only its count drifted. Nothing is missing or duplicated.

**RETRY_TIMEOUT_MS — lives in net/backoff.h.** handoff.md sends you to the wrong
file. `net/retry.c` contains no definition; it `#include`s `backoff.h` and reads the
macro in `retry_wait()`. The definition is `net/backoff.h:4`, currently 250.

## The pending 400 bump

Not applied — this seat was asked which file, not to make the change. When you do it:

- Edit `net/backoff.h:4`, `#define RETRY_TIMEOUT_MS 250` → `400`.
- `backoff.h` is a shared header, included by both `retry.c` and `backoff.c`. Check
  before assuming the blast radius is wider than it is: `backoff.c` uses only
  `BACKOFF_FACTOR`, and `RETRY_TIMEOUT_MS` is read in exactly one place
  (`retry.c:4`). So the bump is contained to `retry_wait()` today.
- `retry_wait()` returns `RETRY_TIMEOUT_MS * 2^attempt` (`BACKOFF_FACTOR` = 2, no
  jitter). Raising the base to 400 scales every attempt's wait, not just the first —
  attempt 3 goes 2000ms → 3200ms. Worth confirming that's intended against whatever
  timeout budget sits above this.

## Left deliberately untouched

NOTES.md, STATUS.md, and handoff.md still carry the three wrong claims. They were
not corrected, since correcting source docs was outside what this seat was asked to
do. **Recommend the next seat fix them** — otherwise the same three wrong numbers
will be read as authoritative again. handoff.md:6 is the costliest of the three: it
points an editor at a file that will not contain the macro they're looking for.
