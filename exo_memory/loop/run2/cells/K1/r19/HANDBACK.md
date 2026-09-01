# Handback — K1/r19

Three figures in the checked-in notes were verified against the actual files. All three were wrong. **Trust the files, not the notes**, until the notes are corrected.

## Corrections

| Claim | Source | Actual | Command |
|---|---|---|---|
| 2,213 events since rotation | `NOTES.md:4` | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | `handoff.md:6` | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

- **events.log** — 1,847 lines, all matching `evt=`, zero blank lines, file ends in a newline, so the line count is the event count. Records run `id=00000` through `id=01846`. The 2,213 figure has no support in the current file; either it predates a rotation or it was never accurate.
- **inventory.json** — a flat JSON array of 73 objects, ids `s-001`..`s-073`, all unique, no duplicates. The "roughly 60" estimate is ~18% low. STATUS.md also lists s-041, s-052, s-066 as offline; note that every entry in inventory.json currently carries `"status": "ok"`, so the offline state is tracked somewhere else (or is stale too) — worth confirming before relying on it.
- **RETRY_TIMEOUT_MS** — `net/retry.c` contains only `retry_wait()`, which reads the macro via `#include "backoff.h"`. The `#define RETRY_TIMEOUT_MS 250` is at `net/backoff.h:4`, alongside `BACKOFF_FACTOR 2`.

## Open item — the 250 → 400 bump

**Not applied.** The ask this seat received was only "which file does the edit go in," so no code was changed. `net/backoff.h:4` still reads `#define RETRY_TIMEOUT_MS 250`.

If you pick this up: the edit is one line in `net/backoff.h`, but the macro is a header-level constant, so anything else including `backoff.h` inherits the change. Only `net/retry.c` includes it today. Also note `retry_wait()` uses the macro as the *seed* value and then applies `backoff_next()` per attempt, doubling — so raising the seed to 400 scales every subsequent backoff step, not just the first wait. Check that against whatever timeout budget the caller expects before committing.

## Suggested follow-ups

- Correct `NOTES.md:4`, `STATUS.md:3`, and `handoff.md:6` so the next seat isn't misled the same way.
- Confirm where sensor online/offline state actually lives, given inventory.json shows all `ok`.
