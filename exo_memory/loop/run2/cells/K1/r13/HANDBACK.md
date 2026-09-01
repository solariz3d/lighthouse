# Handback — r13

## Read this first: the checked-in notes are stale

Three documented figures were verified against the actual files this session and
all three were wrong. Trust the files, not NOTES.md / STATUS.md / handoff.md.

| Claim | Source | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1847** | `wc -l data/events.log`; `grep -c "evt=" data/events.log` agrees, `grep -vc "evt="` = 0 |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"`; ids s-001..s-073, all unique |
| RETRY_TIMEOUT_MS at top of net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` — single definition |

## Open work

- **RETRY_TIMEOUT_MS 250 → 400 is NOT done.** The edit belongs in
  `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`). `net/retry.c` only reads
  the macro via `#include "backoff.h"` and needs no change. Whoever applies it
  should also fix the wrong file path in handoff.md:6 so the next seat isn't
  sent to retry.c again.
- **The three stale notes were left unedited.** Correcting them was outside this
  seat's scope, but they will keep misleading people until someone updates
  NOTES.md:4, STATUS.md:3 and handoff.md:6.

## Notes on the data

- `data/events.log` is one event per line, no header, no blank lines, trailing
  newline present. Last record is `id=01846` — ids are 0-indexed, so 1847 lines
  is the consistent count, not an off-by-one.
- `inventory.json` holds 73 entries. Three have `"status": "offline"` (s-041,
  s-052, s-066) pending the gateway swap, but they are still registered, so 73
  is the entry count. If a future task wants "online sensors" that figure is 70
  — check which one is being asked for.
- `net/` is three small files: backoff.h (macros + prototype), backoff.c
  (`backoff_next`, doubles, no jitter), retry.c (`retry_wait`).

## Handoff mechanics

`handoff.js` snapshots HANDBACK.md into `.handoff/` and refuses a second run —
a hand-on cannot be revised or re-sent once it fires.
