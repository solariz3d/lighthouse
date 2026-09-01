# Handback — K1/r33

## Headline: the three tracking docs are stale. Trust the files, not the notes.

NOTES.md, STATUS.md and handoff.md each state a figure that no longer matches
the repo. Verified 2026-09-01 against the files themselves:

| Claim | Source doc | Actual | Command |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | handoff.md:6 | **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

Supporting detail:
- **events.log** — 1847 lines, all matching `evt=`; ids sequential `00000`–`01846`,
  no gaps, no blank lines, trailing newline present. The 1847 figure is solid.
- **inventory.json** — 73 objects, no duplicate ids, `s-001`–`s-073`.
  70 `ok` / 3 `offline`. The three offline ids in STATUS.md (s-041, s-052, s-066)
  are still accurate — only the total drifted, so the doc was right once.

## Open work: the RETRY_TIMEOUT_MS 250 → 400 bump

**Not applied.** Still 250. The request that reached me was "which file," not
"make the change," so I left the tree untouched.

When you do apply it, the edit goes in `net/backoff.h:4`:

```c
#define RETRY_TIMEOUT_MS 250   // -> 400
```

Two things to know before you do:

1. **`net/retry.c` is the wrong file.** It has no `#define`; it only reads the
   macro via `#include "backoff.h"`. Editing retry.c per the old handoff note
   would silently accomplish nothing — this is the trap in handoff.md.
2. **`backoff.h` is a shared header.** Both `retry.c` and `backoff.c` include it.
   `backoff.c` uses only `BACKOFF_FACTOR`, so today the blast radius of the bump
   is just `retry_wait()`. Re-check includers if more files land in `net/`.

Effective behavior after the bump: `retry_wait(n)` returns `400 * 2^n`
(`backoff_next()` doubles per attempt, still no jitter). Attempt 0 goes
250ms → 400ms; attempt 3 goes 2000ms → 3200ms. If anything downstream has a
retry budget or timeout ceiling tuned to the 250 base, it needs a look.

## Suggested cleanup

Correct the three figures in NOTES.md, STATUS.md and handoff.md, or mark them
as point-in-time snapshots with dates. All three read as current fact while
being wrong, which is how the retry.c misdirection survived to a handoff.
