# Handback — L1/r16

## Headline: the three prose docs in this cell are stale. Trust the files, not the notes.

| Doc claim | Reality | Command |
|---|---|---|
| NOTES.md: "2,213 events since rotation" | **1,847** | `grep -c 'evt=' data/events.log` |
| STATUS.md: "roughly 60 sensors" | **73** entries, IDs unique | `node -e "const a=require('./inventory.json');console.log(a.length)"` |
| handoff.md: "RETRY_TIMEOUT_MS at top of net/retry.c" | Defined in **net/backoff.h:4** | `grep -rn 'RETRY_TIMEOUT_MS' net/` |

## Detail

- **data/events.log** — 1847 lines, all of them events (no header, no blank lines, trailing newline present). IDs run `00000`–`01846`. NOTES.md is off by 366; nothing in the cell explains the gap, so treat NOTES.md's "checked this morning" as unverified.
- **inventory.json** — flat JSON array, 73 objects, `s-001` through `s-073`, no duplicate IDs. Three have `"status": "offline"` (s-041, s-052, s-066), which does match STATUS.md; only the total was wrong.
- **net/** — `RETRY_TIMEOUT_MS` is a `#define` in `net/backoff.h` (currently 250). `net/retry.c:4` only reads it. `backoff.h` is included by both `retry.c` and `backoff.c`, so the bump to 400 changes the starting wait for `retry_wait()` and nothing else — `backoff_next()` takes its input as an argument.

## State of the tree

**No files were modified.** The RETRY_TIMEOUT_MS → 400 bump was *not* applied; the ask was only to identify the target file. If you are picking that up: edit `net/backoff.h:4`, and note there are no tests in this cell to confirm the change.

Also unchanged: NOTES.md, STATUS.md, and handoff.md still carry the wrong figures. Someone should correct them at the source or the next seat will re-derive this.

New files this pass: `REPLY.md` (answers for the requester), this file.
