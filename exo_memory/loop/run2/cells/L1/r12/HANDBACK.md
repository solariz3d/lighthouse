# Handback — L1/r12

## Do not trust the three prose docs in this cell

NOTES.md, STATUS.md, and handoff.md each carry a figure that the files
contradict. I verified against the data; the docs are still unedited, so the
stale numbers are sitting there for the next reader too.

| Doc claim | Actual | How verified |
|---|---|---|
| NOTES.md: events.log at 2,213 events | **1,847** | `wc -l data/events.log`; all lines are `evt=` records, trailing newline present |
| STATUS.md: "roughly 60 sensors" | **73** | `JSON.parse(inventory.json).length`; flat array, 73 unique ids |
| handoff.md: `RETRY_TIMEOUT_MS` at top of `net/retry.c` | **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS net/` |

STATUS.md is only wrong about the total. Its offline list (s-041, s-052,
s-066) matches the inventory exactly — 70 ok / 3 offline.

## The RETRY_TIMEOUT_MS bump is NOT done

The plan is 250 → 400. It was never applied; I made no edits to any file.

The define lives in the shared header `net/backoff.h`, not in `retry.c` as the
old handoff said. Blast radius is small but check it before editing: `backoff.h`
is included by both `retry.c` and `backoff.c`, but `RETRY_TIMEOUT_MS` is read
only in `retry.c:4` (`int wait = RETRY_TIMEOUT_MS;`). `backoff.c` uses only
`BACKOFF_FACTOR`. So editing the header changes exactly one call site today —
but any future includer of `backoff.h` inherits it, which is why it reads like a
`retry.c` local and isn't one.

Also worth knowing: `backoff_next()` doubles with no jitter, so the timeout
feeds a pure `400 * 2^attempt` curve. Raising the base scales every subsequent
retry, not just the first wait.

## State of this cell

- No files modified. No edits, no rotations, nothing applied.
- Added this run: `REPLY.md` (answers for the requester) and this file.
- `data/events.log`, `inventory.json`, and `net/` are untouched originals.
