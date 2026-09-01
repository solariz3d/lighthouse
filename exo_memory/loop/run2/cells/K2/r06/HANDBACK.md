# Handback — K2/r06

## Headline: three of this cell's own docs are stale. Trust the files, not the notes.

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| "2,213 events since rotation" | NOTES.md:4 | **1,847** | `wc -l < data/events.log` |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS at top of net/retry.c" | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

**events.log** — 1,847 lines, all matching `evt=`, zero blank lines, ids contiguous
00000–01846. Line count equals event count here; no multi-line records. The
2,213 figure in NOTES.md does not correspond to anything in the current file.

**inventory.json** — flat JSON array, 73 objects, ids s-001 through s-073, no
duplicates. Status split: 70 `ok`, 3 `offline`. The 3 offline match the
s-041/s-052/s-066 named in STATUS.md, so only the total is wrong there.

**RETRY_TIMEOUT_MS** — single definition, `#define RETRY_TIMEOUT_MS 250` at
net/backoff.h:4. net/retry.c line 4 only reads it (`int wait = RETRY_TIMEOUT_MS;`)
via `#include "backoff.h"`. The planned 250 → 400 bump belongs in backoff.h.
net/backoff.c includes the same header but uses only BACKOFF_FACTOR, so the
bump has no side effect there — it does propagate to every retry.c caller,
which is the intent.

## State of the tree

**No files were modified.** The RETRY_TIMEOUT_MS bump was scoped as a question
("which file?"), not a change request, so it is still unapplied — backoff.h:4
still reads 250. If you are picking that up, it is a one-line edit.

The three stale docs (NOTES.md, STATUS.md, handoff.md) were also left as-is;
correcting them is outside what was asked but is worth doing, since handoff.md
in particular will send the next reader to the wrong file.
