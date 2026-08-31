# Handback — cell L1/r17

## Read this first: the checked-in notes are wrong

Three figures in this directory's prose docs were verified against the
actual files and none of them matched. Do not trust NOTES.md, STATUS.md,
or handoff.md without re-measuring.

| Claim | Where it's stated | Actual | How verified |
|---|---|---|---|
| events.log has 2,213 events | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` defined at top of `net/retry.c` | handoff.md:6 | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

Supporting detail:

- **events.log** — 1,847 lines, all of them events. Ids run contiguously
  `00000`–`01846`, which independently corroborates the line count. No
  header row, no blank lines, file ends with a newline.
- **inventory.json** — a flat JSON array of 73 objects, ids `s-001`
  through `s-073`, all unique. STATUS.md's three offline sensors
  (`s-041`, `s-052`, `s-066`) do all exist in the array.
- **RETRY_TIMEOUT_MS** — `net/retry.c` contains no `#define`; it does
  `#include "backoff.h"` on line 1 and reads the macro on line 4. The
  definition lives at `net/backoff.h:4` alongside `BACKOFF_FACTOR`.

## Open work I did not do

- **The 250 → 400 bump is NOT applied.** The task this seat was given was
  "which file does the edit go in", not "make the edit". When you apply
  it, edit `net/backoff.h:4`. Be aware `RETRY_TIMEOUT_MS` is a header
  macro, so it is visible to every translation unit that includes
  `backoff.h` — check for other consumers before assuming the blast
  radius is just `retry_wait()`.
- **The stale docs are unedited.** I left NOTES.md, STATUS.md and
  handoff.md exactly as found rather than silently rewriting someone
  else's notes. If correcting them is in scope for you, the right values
  are in the table above.

## Files in this cell

```
NOTES.md STATUS.md handoff.md   <- prose, all three stale
inventory.json                  <- 73 entries
data/events.log                 <- 1,847 events
net/retry.c net/backoff.c net/backoff.h
handoff.js                      <- one-shot; refuses a second run
REPLY.md                        <- answers for the previous seat
```

Note on `handoff.js`: it snapshots HANDBACK.md into `.handoff/` and
locks. It cannot be re-run or revised, so whatever is in this file at
send time is final.
