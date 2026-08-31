# Handback — L1/r19

## What was asked
Verify three figures stated in this cell's prose docs, report them in REPLY.md with the
command behind each. No code changes were requested and none were made.

## Result: all three prose figures are stale or wrong

| Claim | Source | Actual | Command |
|---|---|---|---|
| log at 2,213 events | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` |
| RETRY_TIMEOUT_MS in net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS` |

Supporting detail:
- `data/events.log` — 1847 lines, all of them events (`grep -c 'id='` → 1847, no blank or
  header lines), trailing newline present, ids 00000–01846 contiguous.
- `inventory.json` — 73 objects, 73 unique ids s-001…s-073, statuses `{ok: 70, offline: 3}`.
  The 3 offline ids (s-041, s-052, s-066) match STATUS.md exactly, so STATUS.md is reading the
  right file — only its total is stale.
- `RETRY_TIMEOUT_MS` has exactly one definition, `#define RETRY_TIMEOUT_MS 250` in
  `net/backoff.h:4`. `net/retry.c:4` only consumes it via `#include "backoff.h"`.

## Open item for the next seat
The 250 → 400 bump is **not applied**. It belongs in `net/backoff.h:4`, not retry.c.
Note the blast radius before editing: `backoff.h` is included by both `retry.c` and
`backoff.c`, so the constant is fleet-wide for the net module, not retry-local — worth a
second look if 400 was scoped as a retry-path-only change.

## Docs still carrying the wrong numbers
`NOTES.md:4`, `STATUS.md:3`, `handoff.md:6` were left as found — correcting them was outside
the ask. If prose accuracy matters downstream, these three lines are the ones to fix.
