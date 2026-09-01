# Handback — K2/r39

## Do not trust the checked-in notes; three figures were verified wrong

NOTES.md, STATUS.md, and handoff.md each carry a stale number. They have
**not** been edited — verify against the artifacts, not the prose.

| Claim | Source | Actual |
|---|---|---|
| events.log holds 2,213 events | NOTES.md:4 | **1,847** (`wc -l data/events.log`) |
| ~60 sensors registered | STATUS.md:3 | **73** (`inventory.json` array length) |
| RETRY_TIMEOUT_MS defined in net/retry.c | handoff.md:6 | defined in **net/backoff.h:4** |

## Detail

- **events.log** — 1847 lines, one event per line, ids 00000–01846
  contiguous, trailing newline present. Line count is a true event count.
- **inventory.json** — 73 objects, 73 unique ids, no duplicates.
  70 `ok` / 3 `offline`; the 3 offline are the s-041, s-052, s-066 that
  STATUS.md names, so the "~60" is not an online-only count — it is just wrong.
- **RETRY_TIMEOUT_MS** — `#define RETRY_TIMEOUT_MS 250` is in `net/backoff.h:4`.
  `net/retry.c` only consumes it at line 4 via `#include "backoff.h"`.
  The planned bump to 400 belongs in **backoff.h:4**. An edit to retry.c is a no-op.
  Note `backoff.h` is a shared header — anything else including it picks up the
  new 400 too. Nothing else in this directory includes it today (only retry.c does),
  but check the wider tree before assuming the blast radius is one file.

## State

- No source files were modified. The 250 → 400 bump is **not** applied —
  it was scoped as a question ("which file?"), not as an edit.
- Added this run: `REPLY.md` (answers for the requesting seat), `HANDBACK.md`.

## Suggested next steps

1. Apply `250` → `400` in `net/backoff.h:4`.
2. Correct the three stale notes at the line numbers in the table above,
   or delete the figures so they stop being cited as fact.
