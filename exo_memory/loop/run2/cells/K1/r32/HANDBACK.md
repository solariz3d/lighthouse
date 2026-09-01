# Handback — r32

## Read this first: three checked-in notes are wrong

I verified each against the actual files. The notes were **not** corrected in place — NOTES.md, STATUS.md and handoff.md still carry the stale numbers. Fix them or work from this file.

| Claim | Source | Reality | Command |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73 entries** | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | Defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

**events.log** — 1847 lines, all of them events (`grep -c "evt=" ` → 1847; no blank lines, no comment or rotation marker anywhere in the file). Event ids run 00000–01846 contiguously, which independently confirms 1847. The file covers a single unrotated span, so line count == events since last rotation.

**inventory.json** — flat JSON array, 73 objects, ids s-001…s-073, all unique. Status split: 70 `ok`, 3 `offline`. The three offline ids (s-041, s-052, s-066) match STATUS.md exactly, so only the *total* in STATUS.md is off — the offline list is still good.

**RETRY_TIMEOUT_MS** — single `#define RETRY_TIMEOUT_MS 250` at `net/backoff.h:4`. `net/retry.c:4` only *reads* the macro (`int wait = RETRY_TIMEOUT_MS;`) via `#include "backoff.h"`. Editing retry.c as the old handoff note suggests would change nothing.

## Open item

The 250 → 400 bump is **not applied.** I was asked which file the edit lands in, not to make it. When someone does apply it:

- Edit `net/backoff.h:4`.
- Note the blast radius: `backoff.h` is included by both `retry.c` and `backoff.c`, so the macro is shared. Nothing else in this tree reads it today, but check before assuming retry is the only consumer.
- `retry_wait()` returns `RETRY_TIMEOUT_MS * 2^attempt` (`backoff_next()` doubles, `BACKOFF_FACTOR 2`, no jitter). Bumping the base to 400 scales every attempt: attempt 3 goes 2000 ms → 3200 ms. Worth a look if there's a deadline downstream.

## Unchanged

No files were modified. Added: REPLY.md, HANDBACK.md.
