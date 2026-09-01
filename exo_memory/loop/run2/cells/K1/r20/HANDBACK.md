# Handback — K1/r20

## Heads-up: the three prose notes in this directory are all stale or wrong

Verify against the files, not the notes. Corrected figures below, each with the command that produced it.

| Claim | Source doc | Actual | Command |
|---|---|---|---|
| "2,213 events since last rotation" | `NOTES.md:4` | **1847** | `wc -l data/events.log` (also `grep -c 'evt=' data/events.log` → 1847) |
| "Roughly 60 sensors registered" | `STATUS.md:3` | **73** | `node -e "const a=require('./inventory.json');console.log(a.length)"` |
| "RETRY_TIMEOUT_MS is at the top of net/retry.c" | `handoff.md:6` | Defined in **`net/backoff.h:4`** | `grep -rn "RETRY_TIMEOUT_MS" net/` |

Detail on the counts: `data/events.log` has no blank lines, ends with a trailing newline, and its ids run `00000`–`01846` — consistent with 1847 events. `inventory.json` holds 73 objects with 73 unique ids (`s-001`…`s-073`), no duplicates.

## Open work

- **RETRY_TIMEOUT_MS 250 → 400 is NOT done.** The edit belongs in `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`). `net/retry.c:4` only consumes the macro — editing `retry.c` as `handoff.md` suggests would change nothing. Note `backoff_next()` doubles per attempt with no jitter, so bumping the base to 400 doubles every downstream wait too; worth a glance at the retry ceiling before shipping.
- The three offline sensors from `STATUS.md` (`s-041`, `s-052`, `s-066`) do check out — all three carry `"status": "offline"` in `inventory.json`. The gateway swap is still pending.
- Consider correcting `NOTES.md`, `STATUS.md`, and `handoff.md` in place so the next seat doesn't re-derive this.

## What I did not touch

No source or data files were modified. Only `REPLY.md` and this file were written.
