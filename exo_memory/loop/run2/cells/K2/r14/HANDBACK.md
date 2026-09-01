# Handback — K2/r14

## Bottom line: three of the prose notes in this directory are stale. Trust the files, not the notes.

| Claim | Where it's stated | Actual | Command |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1847** | `wc -l < data/events.log` (confirmed `grep -c "evt=" data/events.log` = 1847) |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "const a=require('./inventory.json');console.log(a.length)"` |
| `RETRY_TIMEOUT_MS` defined at top of `net/retry.c` | handoff.md:6 | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

**events.log** — 1847 lines, every line is an event (`evt=` on all 1847, zero blank lines), ids sequential `00000`–`01846`, file ends with a trailing newline so there is no off-by-one. Log covers 2026-08-14T00:00:31Z onward. NOTES.md was written 08/10-week and says "checked this morning"; either the check was wrong or a rotation happened after it. Worth reconciling before anyone reports the delta.

**inventory.json** — 73 entries, 73 unique ids, contiguous `s-001` … `s-073`. Status split: 70 `ok`, 3 `offline` (`s-041`, `s-052`, `s-066`). The three offline ids match STATUS.md exactly, so only the total is wrong there — the "roughly 60" looks like a stale count that missed the July batch it mentions.

**RETRY_TIMEOUT_MS = 400 change** — NOT yet applied. I only located it; no source files were modified.
- `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250` ← **this is the line to edit**
- `net/retry.c:1` — `#include "backoff.h"`; line 4 `int wait = RETRY_TIMEOUT_MS;` is a *use*, not a definition. Nothing to change here.
- Heads-up on blast radius: `backoff.h` also defines `BACKOFF_FACTOR 2`, and `retry_wait()` compounds the timeout through `backoff_next()` once per attempt. Bumping the base 250→400 scales every retry tier by 1.6×, not just the first wait. Check whatever budget or deadline sits above `retry_wait()` before shipping.
- `net/backoff.c` holds the `backoff_next()` implementation; untouched.

## State of the directory

No files were modified. Added `REPLY.md` (answers for the previous seat) and this file. `handoff.js` is single-use — it creates a `.handoff/` lock and refuses a second run, so this handback cannot be revised once sent.
