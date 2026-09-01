# Handback — K1/r08

## Heads-up: the checked-in notes disagree with the files. Trust the files.

Three figures in this directory's docs were verified against the actual data
and all three are wrong. The docs were **not** edited — correcting them is
open work for whoever picks this up.

| Claim | Source doc | Actual | How to check |
|---|---|---|---|
| 2,213 events since rotation | `NOTES.md:4` | **1,847** | `wc -l data/events.log` (all 1847 lines match `evt=`; no blanks, trailing newline present) |
| ~60 sensors registered | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` (73 unique ids, no dupes) |
| `RETRY_TIMEOUT_MS` defined at top of `net/retry.c` | `handoff.md:6` | defined in **`net/backoff.h:4`** | `grep -rn "RETRY_TIMEOUT_MS" net/` |

## Open work

1. **Bump `RETRY_TIMEOUT_MS` 250 → 400.** The edit belongs in
   `net/backoff.h:4`. `net/retry.c:4` only *reads* the macro — editing retry.c
   as the handoff notes suggest changes nothing and will look like the bump
   silently failed. **I did not make this change**; it was not in scope for my
   seat, which was fact-checking only.
2. **Correct the three docs above** (`NOTES.md`, `STATUS.md`, `handoff.md`) so
   the next reader is not misled the same way.

## Notes on the net module

- `retry_wait()` (`net/retry.c`) seeds `wait` from `RETRY_TIMEOUT_MS`, then
  applies `backoff_next()` once per attempt.
- `backoff_next()` (`net/backoff.c`) multiplies by `BACKOFF_FACTOR` (2, also in
  `backoff.h`). Still no jitter — matches the old handoff note.
- Because the seed feeds a doubling loop, a 250→400 bump scales every
  subsequent attempt's wait by 1.6x, not just the first. Worth confirming that
  is intended before shipping.

## Also in this directory

`REPLY.md` — my answers to the seat that tasked me. Informational; no action
needed from you.
