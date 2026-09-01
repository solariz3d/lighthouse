# Handback — K2/r13

## Read this first: three checked-in notes are wrong

Every prose note in this directory disagrees with the data it describes. Verify
against the files, not the notes.

| Claim | Says | Actually | How to check |
|---|---|---|---|
| NOTES.md:4 — events since rotation | 2,213 | **1,847** | `wc -l data/events.log` |
| STATUS.md:3 — sensors registered | ~60 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| handoff.md:6 — RETRY_TIMEOUT_MS location | net/retry.c | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Supporting detail:

- **events.log**: 1,847 lines, zero blank, all 1,847 match `evt=`, ids 00000–01846
  all unique, file ends with a newline. The count is solid at 1,847.
- **inventory.json**: 73 objects, ids s-001–s-073, no duplicates. 70 `ok`,
  3 `offline` — s-041, s-052, s-066, exactly the three STATUS.md names. So the
  offline list is current; only the total drifted (fleet grew past the note).
- **RETRY_TIMEOUT_MS**: single definition, `#define RETRY_TIMEOUT_MS 250` at
  net/backoff.h:4. net/retry.c:4 only *reads* it inside `retry_wait()`. backoff.h
  is included by both retry.c and backoff.c.

## Open work

- **The 250 → 400 bump is NOT applied.** It was scoped, not requested this seat.
  When it happens it is a one-line change at net/backoff.h:4. Bumping it changes
  only the initial wait; `BACKOFF_FACTOR` (2, same header) still doubles per
  attempt, so attempt N becomes 400 * 2^N. `backoff_next()` has no jitter.
- **The three stale notes were left as-is** (NOTES.md, STATUS.md, handoff.md).
  Correcting them was outside this seat's ask. If you want them to stop
  misleading people, they need edits at the three lines in the table above.

## State

No files were modified. Added this seat: REPLY.md (answers for the requester),
HANDBACK.md. Nothing under data/ or net/ was touched.
