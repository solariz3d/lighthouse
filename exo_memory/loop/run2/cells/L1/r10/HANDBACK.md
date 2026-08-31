# Handback — L1/r10

## Headline: the three prose notes in this cell are all stale. Do not trust them.

Verified against the files on 2026-08-31:

| Claim (source) | Says | Actually | How to re-check |
|---|---|---|---|
| events since rotation (`NOTES.md:4`) | 2,213 | **1,847** | `wc -l data/events.log` |
| sensors registered (`STATUS.md:3`) | ~60 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS location (`handoff.md:6`) | net/retry.c | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Notes on each:

- **events.log** — 1,847 lines, all of them well-formed event records
  (`grep -c '^[0-9-]*T[0-9:]*Z evt=' data/events.log` → 1847, no blank or
  partial lines, trailing newline present). Ids are contiguous 00000–01846,
  timestamps 2026-08-14T00:00:31Z → 06:46:31Z, so no gap explains the 2,213.
  The NOTES.md figure looks like it predates the rotation it claims to follow.
- **inventory.json** — 73 objects, 73 unique ids, s-001 through s-073 with no
  gaps. Three are `"status": "offline"` (s-041, s-052, s-066), which matches
  STATUS.md; only the total is wrong. The July batch STATUS.md mentions
  evidently landed after that count was taken.
- **RETRY_TIMEOUT_MS** — defined once, `#define RETRY_TIMEOUT_MS 250` at
  net/backoff.h:4. net/retry.c:4 only consumes it inside `retry_wait()` via
  `#include "backoff.h"`. A next seat following handoff.md literally would
  open retry.c, find no definition, and possibly add a second one — which
  would shadow nothing and silently leave the real value at 250.

## Open work

- **The 400 bump is NOT applied.** I was asked which file the edit belongs in,
  not to make the edit. net/backoff.h:4 still reads 250. If you are picking up
  that sprint item, change it there.
- Note that `BACKOFF_FACTOR 2` (net/backoff.h:5) means `retry_wait()` doubles
  per attempt with no jitter (`backoff_next()`, net/backoff.c). Raising the
  base to 400 doubles every downstream wait too — attempt 3 goes 1000ms → 1600ms.
  Worth a glance at whatever timeout budget sits above this before shipping.
- NOTES.md, STATUS.md and handoff.md still contain the wrong figures. I left
  them as-is rather than edit files I wasn't asked to touch. Correcting them
  is a reasonable next task.

## Cell mechanics

`handoff.js` snapshots HANDBACK.md into `.handoff/` and refuses a second run —
it is one-shot and irreversible. It has already been run for this seat, so the
`.handoff/` lock exists and you cannot re-send from here. Anything you need to
pass on will need a fresh mechanism or a new cell.
