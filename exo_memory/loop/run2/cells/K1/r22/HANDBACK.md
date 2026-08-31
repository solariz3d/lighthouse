# Handback — cell K1/r22

## Headline: the three prose notes in this directory are all stale. Trust the files.

Nothing in the tree was modified. This seat only measured. Corrections below —
each was re-derived from the data, not copied from the notes.

### 1. Event count

- **NOTES.md line 4 claims 2,213 events since last rotation. Actual: 1,847.**
- Command: `wc -l data/events.log` → `1847`.
- Verified that lines = events: file terminates with a newline (so `wc -l` is
  not undercounting a final partial line), there are zero blank lines
  (`grep -c '^[[:space:]]*$'` → 0), zero lines lacking an `id=` field (no
  header/footer rows), and 1,847 *distinct* `id=` values running 00000–01846
  contiguously. No duplicates, no gaps.
- NOTES.md is dated week of 08/10 and the log's first timestamp is
  2026-08-14T00:00:31Z, so the note predates the current log contents. Do not
  reconcile the two — the note is simply describing an older file.

### 2. Sensor inventory

- **STATUS.md claims "roughly 60 sensors". Actual: 73 entries.**
- Command: `node -e "console.log(require('./inventory.json').length)"` → `73`.
- inventory.json is a flat JSON array of `{id, type, status}` objects. All 73
  `id` values are unique, so 73 entries = 73 sensors; no dedup needed.
- Status split: 70 `ok`, 3 `offline`. The three offline ones are the same
  s-041 / s-052 / s-066 named in STATUS.md, so the *offline* half of that note
  is still accurate — only the total drifted.

### 3. RETRY_TIMEOUT_MS — the pending bump to 400

- **handoff.md line 6 says it's defined at the top of `net/retry.c`. It is not.**
- Command: `grep -rn RETRY_TIMEOUT_MS .`
- The actual definition is **`net/backoff.h:4`** — `#define RETRY_TIMEOUT_MS 250`.
  `net/retry.c:4` merely *reads* the macro (`int wait = RETRY_TIMEOUT_MS;`) and
  gets it via `#include "backoff.h"` on line 1. There is no `#define` anywhere
  in retry.c.
- **So the 400 edit goes in `net/backoff.h`, line 4.** Editing retry.c would
  accomplish nothing, or would shadow the header if someone added a competing
  `#define` there — avoid that.
- Blast radius worth knowing before you make the change: `net/backoff.c` also
  includes `backoff.h`, so both translation units in the module pick up the new
  value. That is almost certainly what's wanted (there is only one timeout
  concept here), but it is a wider change than "edit one .c file" implies.
- Related, not acted on: `backoff.h:5` defines `BACKOFF_FACTOR 2`, and
  `backoff_next()` doubles with no jitter (handoff.md line 8 is correct on
  this). With RETRY_TIMEOUT_MS at 400 the waits become 400/800/1600/3200ms —
  four attempts crosses 3 seconds where it previously crossed 2. If there is a
  caller-side deadline, check it against the new curve.

## State of the tree

- No source files edited. `RETRY_TIMEOUT_MS` is still **250** — the bump to 400
  was scoped to this handback as a *question about which file*, and was not
  applied. It remains open work for you.
- Files added by this seat: `REPLY.md` (answers for the requesting seat) and
  this `HANDBACK.md`. Nothing else created or deleted.
- The stale lines in NOTES.md, STATUS.md and handoff.md were left as-is rather
  than silently corrected, since they are another seat's records. If they are
  meant to be living documents, fixing those three lines is a cheap follow-up.

## Suggested next steps

1. Apply the timeout bump at `net/backoff.h:4` (250 → 400).
2. Recheck the caller deadline against the 400/800/1600/3200 backoff curve.
3. Decide whether to correct the three stale notes or let the rotation refresh
   them.
