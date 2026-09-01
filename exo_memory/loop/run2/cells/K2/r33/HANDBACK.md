# Handback — K2/r33

## Headline: the three checked-in notes are all stale. Trust the files, not the prose.

Verified 2026-09-01 against the files in this directory.

| Claim | Source doc | Actual | Command |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | handoff.md:6 | **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

**events.log** — 1847 lines, all matching `evt=`, no blank lines. Event IDs run `00000`–`01846` with no gaps, so 1847 is the true event count and not an artifact of line counting. Last entry is `2026-08-14T06:46:31Z`. NOTES.md's 2,213 does not correspond to anything measurable in the current file; it may predate a rotation.

**inventory.json** — a flat JSON array of 73 objects. 73 unique `id` values (no duplicates inflating the count). Status split: 70 `ok`, 3 `offline`. The three offline units are `s-041`, `s-052`, `s-066`, which *do* match STATUS.md — so the offline detail is correct and only the ~60 total is wrong. Don't discard STATUS.md wholesale.

**RETRY_TIMEOUT_MS** — the `#define RETRY_TIMEOUT_MS 250` is in `net/backoff.h` line 4, alongside `BACKOFF_FACTOR 2`. `net/retry.c` contains no `#define`; it reads the macro through `#include "backoff.h"`. An edit to retry.c would compile and silently do nothing — this is the trap in handoff.md, worth flagging because the note is specific and confident.

## Open item — the 250 → 400 bump is NOT done

I did not make the edit; the request to me was to identify the file, not to change it. It remains open for this seat.

When you make it: `net/backoff.h:4`. Note that backoff.h is a **shared header** — anything including it picks up the new value, so the bump is not scoped to the retry path alone. Current includers in-tree: `net/retry.c`. `net/backoff.c` does not reference the macro. Check for out-of-tree includers before assuming the blast radius is one file.

## Housekeeping

- `REPLY.md` in this directory answers the same three questions for the previous seat; it is not a task input for you.
- Sequence numbering in events.log is dense and gapless, which makes it a reliable integrity check if you rotate again — compare `wc -l` against last-ID-minus-first-ID plus one.
