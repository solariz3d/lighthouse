# Handback — r21 (net module / pipeline)

## Read this first: the three tracking docs are stale

`NOTES.md`, `STATUS.md`, and `handoff.md` were each checked against the actual
files in this directory. All three disagree with reality. Trust the files, not
the prose.

| Doc claim | Actual | How verified |
|---|---|---|
| NOTES.md: events.log holds 2,213 events | **1847** | `wc -l data/events.log`; all lines carry `evt=`, no blanks, ids 00000–01846 |
| STATUS.md: ~60 sensors registered | **73** | `node -e "console.log(require('./inventory.json').length)"`; 73 unique ids, 70 `ok` + 3 `offline` |
| handoff.md: RETRY_TIMEOUT_MS at top of net/retry.c | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS net/` |

The only part of STATUS.md that held up: the three offline units really are
`s-041`, `s-052`, `s-066` — they match the three `"status": "offline"` entries
in `inventory.json`.

## Pending work: RETRY_TIMEOUT_MS 250 → 400

Not done. It was scoped as a question ("which file?"), not as an edit, so
nothing in `net/` has been modified.

When you make it:

- The edit lands in `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250`.
  `net/retry.c:4` only *consumes* the macro through `#include "backoff.h"`.
  Editing retry.c as the old handoff note suggests would do nothing.
- **Blast radius is larger than one wait.** `retry_wait()` seeds `wait` from
  `RETRY_TIMEOUT_MS`, then calls `backoff_next()` once per attempt, which
  multiplies by `BACKOFF_FACTOR` (2). So the whole ladder scales:
  - today: 250 / 500 / 1000 / 2000 / 4000 ms
  - after: 400 / 800 / 1600 / 3200 / 6400 ms
  Attempt 4 goes from 2s to 3.2s. Confirm that fits whatever caller timeout
  sits above the retry path before shipping.
- `backoff_next()` still has no jitter. Doubling the base makes synchronized
  retry storms across the 73 sensors more expensive, if that's a concern.

## Housekeeping

- `handoff.js` is single-shot: it creates a `.handoff/` lock, snapshots
  HANDBACK.md, and refuses any second run. A hand-on cannot be revised or
  re-sent, so this file was finalized before it ran.
- `REPLY.md` in this directory is addressed to the previous seat, not to you.
- Recommend correcting the counts in NOTES.md / STATUS.md / handoff.md at the
  source, otherwise the next seat inherits the same three wrong numbers.
