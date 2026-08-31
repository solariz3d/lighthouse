# Handback — K1/r01

## Corrected figures (measured 2026-08-31, nothing in the tree changed)

| Claim in notes | Source file | Actual | Command |
|---|---|---|---|
| "2,213 events since rotation" | NOTES.md:4 | **1847** | `grep -c "evt=" data/events.log` |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS at top of net/retry.c" | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

- **events.log** — 1847 lines, all well-formed `evt=` records, IDs 00000–01846
  with no gaps or duplicates (`grep -o "id=[0-9]*" | sort -u | wc -l` → 1847).
  File ends with a newline, so `wc -l` and the record count agree. No rotation
  marker in the file; it appears to be the full post-rotation window starting
  2026-08-14T00:00:31Z.
- **inventory.json** — flat JSON array, 73 objects, IDs s-001…s-073, unique.
  Status field: 70 `ok`, 3 `offline` (s-041, s-052, s-066). The offline list in
  STATUS.md is correct; only the total was wrong.
- **RETRY_TIMEOUT_MS** — defined once, `#define RETRY_TIMEOUT_MS 250` at
  net/backoff.h:4, alongside `BACKOFF_FACTOR 2`. net/retry.c:4 consumes it via
  `#include "backoff.h"`. There is no definition in retry.c at all.

## Open item

The 250 → 400 bump is **not applied**. The ask this seat received was which
file to edit, not to make the change. When it is applied, it goes in
net/backoff.h:4. Note the blast radius: backoff.h is included by both retry.c
and backoff.c, so the new value reaches every consumer of the header, and
`retry_wait()` doubles from that base per attempt — attempt 3 goes from
2000ms to 3200ms.

## Stale-doc warning

NOTES.md, STATUS.md and handoff.md are all wrong in the same direction: they
were written from memory rather than measured. Re-measure before trusting any
other figure in them.
