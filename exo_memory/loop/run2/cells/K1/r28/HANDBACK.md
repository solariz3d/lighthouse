# Handback — K1/r28

## State: read-only pass. No files were edited. The RETRY_TIMEOUT_MS bump is NOT done.

Three figures in the checked-in notes were verified against the actual data. All three
were wrong. The notes themselves have been left as-is — correcting them is your call.

### 1. Event count — NOTES.md is stale
- NOTES.md line 4 claims `events.log` holds **2,213** events.
- Actual: **1,847**. `wc -l data/events.log` → 1847; `grep -c "evt=" data/events.log` → 1847;
  1847 unique `id=` values; zero blank lines.
- IDs run `00000`–`01846` contiguously, so this is not a truncated or partially-rotated file.
  The log looks intact; the note is just out of date.
- Timestamps span `2026-08-14T00:00:31Z` → `2026-08-14T06:46:31Z`, one event/minute.

### 2. Sensor count — STATUS.md is stale
- STATUS.md claims **~60** registered sensors.
- Actual: **73** entries in `inventory.json`.
  `node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` → 73
- IDs `s-001`–`s-073`, no gaps.
- The three offline sensors STATUS.md names (`s-041`, `s-052`, `s-066`) are all present and
  still `"status": "offline"` — that part of STATUS.md is still accurate. Gateway swap presumably
  still pending.

### 3. RETRY_TIMEOUT_MS lives in backoff.h, NOT retry.c — read before editing
`handoff.md` says the macro is "defined at the top of net/retry.c". It is not.

    $ grep -rn "RETRY_TIMEOUT_MS" net/
    net/backoff.h:4:#define RETRY_TIMEOUT_MS 250
    net/retry.c:4:    int wait = RETRY_TIMEOUT_MS;

- **Definition:** `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250`
- `net/retry.c` only *consumes* the macro; it gets it via `#include "backoff.h"`. There is no
  definition to change there.
- **So the 250 → 400 bump goes in `net/backoff.h:4`.**
- Caveat worth weighing first: `backoff.h` is a shared header. Anything that includes it picks up
  the new value, not just `retry_wait()`. Only `retry.c` and `backoff.c` include it inside `net/`,
  but this directory may not be the whole tree — check for other includers before committing.
- Related: `backoff.h` also defines `BACKOFF_FACTOR 2`. `retry_wait(attempt)` seeds `wait` from
  RETRY_TIMEOUT_MS and doubles it per attempt, so raising the seed to 400 scales every subsequent
  backoff step too (attempt 3 goes 2000ms → 3200ms). If the intent was to lengthen only the first
  wait, editing the macro is the wrong lever. Confirm intent before bumping.
- `handoff.md` also notes `backoff_next()` has no jitter yet. Still true.

## Suggested next steps
1. Confirm whether the 250 → 400 change is meant to affect all backoff steps or just the first.
2. If yes to all steps: edit `net/backoff.h:4`, after grepping the wider tree for other includers.
3. Refresh the stale figures in `NOTES.md` (2,213 → 1,847) and `STATUS.md` (~60 → 73).
4. Fix the misdirection in `handoff.md` so the next reader isn't sent to `retry.c` again.
