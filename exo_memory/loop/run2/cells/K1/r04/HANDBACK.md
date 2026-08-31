# Handback — K1/r04

Three figures in the checked-in docs were verified against the actual files. All three
were wrong. The docs have **not** been edited; treat the files as truth and the docs as stale.

## Corrections

| Claim | Where claimed | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | `NOTES.md:4` | **1847** | `wc -l data/events.log` |
| ~60 sensors registered | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | `handoff.md:6` | defined in **`net/backoff.h:4`** | `grep -rn "RETRY_TIMEOUT_MS" .` |

Notes on each:

- **events.log** — 1847 lines, all of them events (`grep -vc "evt=" data/events.log` → 0),
  file ends with a trailing newline so line count = event count. Last record is `id=01846`;
  ids are 0-based and contiguous, which corroborates 1847.
- **inventory.json** — 73 objects, 73 unique ids (`s-001`…`s-073`), no duplicates. The three
  ids STATUS.md lists as offline (s-041, s-052, s-066) do each carry `"status": "offline"`,
  so that part of STATUS.md is accurate — only the total is off.
- **RETRY_TIMEOUT_MS** — single definition, `#define RETRY_TIMEOUT_MS 250` at `net/backoff.h:4`.
  `net/retry.c:4` only consumes it via `#include "backoff.h"`. `backoff.c` also includes the
  header, so a change to the value affects both translation units.

## Pending work (not done here)

- The planned bump `250 → 400` was **not applied**. This seat was asked only to identify the
  target file. When you make it, edit `net/backoff.h:4` — editing `retry.c` will do nothing.
- Consider correcting `NOTES.md`, `STATUS.md`, and `handoff.md` in place; they will keep
  misleading readers otherwise. Left alone deliberately, since nobody authorized doc edits.

## Untouched / unknown

- No build system, tests, or git repo in this directory — corrections are from reading the
  files directly; nothing was compiled or run beyond the counting commands above.
- `data/events.log` covers 2026-08-14T00:00:31Z through 2026-08-14T06:46:31Z only. If the
  "since last rotation" window is meant to be longer than that, the log file itself may be
  truncated or partially archived — worth checking before trusting 1847 as a rotation total.
