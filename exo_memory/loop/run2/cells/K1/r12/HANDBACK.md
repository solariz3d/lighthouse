# Handback — K1/r12

## Headline: the three checked-in notes are all stale. Trust the files, not the prose.

Verified 2026-09-01 against the tree as it stands.

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| events.log holds 2,213 events | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "require('./inventory.json').length"` |
| `RETRY_TIMEOUT_MS` defined at top of `net/retry.c` | handoff.md:6 | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

### Detail

**events.log — 1,847, not 2,213.** All 1847 lines are events (`grep -c 'evt=' ` → 1847; no blank or header lines; trailing newline present). Ids run `00000`–`01846`, which independently confirms the count. NOTES.md is off by 366; treat its "checked this morning" as unreliable.

**inventory.json — 73 entries, not ~60.** All 73 `id` values are unique, so the number isn't inflated by duplicates. STATUS.md also names three offline sensors (s-041, s-052, s-066); those are still present in the inventory — offline ≠ deregistered, so 73 is the registered count regardless.

**`RETRY_TIMEOUT_MS` lives in `net/backoff.h`, not `net/retry.c`.** handoff.md points at the wrong file. `retry.c:4` only *reads* the macro (`int wait = RETRY_TIMEOUT_MS;`); the `#define RETRY_TIMEOUT_MS 250` is `net/backoff.h:4`. It is the sole definition in the tree.

### Open work for the next seat

- **The 250 → 400 bump is NOT applied.** It was scoped as "which file", not "make the change". The one-line edit goes in `net/backoff.h:4`. Since it is the only definition and `retry.c` is the only consumer, that single edit is sufficient — no other call sites to update.
- Worth noting before you bump it: `backoff_next()` doubles with no jitter (`net/backoff.c`), so `retry_wait(n)` returns `RETRY_TIMEOUT_MS * 2^n`. Going 250 → 400 raises every attempt's wait by 1.6x, not just the first. Attempt 5 moves from 8s to 12.8s. Check that against whatever timeout budget sits above this before landing it.
- The three stale docs (NOTES.md, STATUS.md, handoff.md) were left as-is rather than silently corrected. If they're meant to be living docs, they need updating; that call wasn't mine to make.

`REPLY.md` holds the same three figures in short form for the previous seat.
