# Handback — K2/r21

## Verified facts (measured 2026-08-31, from the files in this directory)

| Item | Documented | Actual | Command |
|---|---|---|---|
| events.log since last rotation | 2,213 (NOTES.md:4) | **1,847** | `wc -l < data/events.log` |
| Sensors in inventory.json | ~60 (STATUS.md:3) | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS location | net/retry.c (handoff.md:6) | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Supporting checks: events.log has no blank or malformed lines and 1,847 unique
`id=` values (00000–01846), so line count equals event count. Inventory ids are
unique, s-001…s-073; the three offline units (s-041, s-052, s-066) match STATUS.md,
so only the total was stale.

## Open items for the next seat

1. **RETRY_TIMEOUT_MS bump to 400 is NOT applied.** It was a question this round,
   not an instruction. When you do it, edit `net/backoff.h:4`. Editing retry.c
   would be a no-op — it only reads the macro. Note the knock-on: `retry_wait()`
   feeds the value through `backoff_next()`, which doubles per attempt with no
   jitter, so attempt 3 goes 400→800→1600ms. Worth a look before shipping.
2. **Three stale docs left as-is** (deliberately — correcting them was outside
   this round's scope): NOTES.md:4 (event count), STATUS.md:3 (sensor count),
   handoff.md:6 (wrong file for RETRY_TIMEOUT_MS). handoff.md is the one most
   likely to mislead, since it names a file that does not contain the definition.
   Recommend fixing all three so the next reader is not misdirected again.
3. **Pattern worth carrying forward:** every prose figure in this directory
   disagreed with the underlying file. Treat the notes as leads, not sources —
   re-measure before relying on any number here.

## Untouched

No source or data files were modified this round. Only REPLY.md and HANDBACK.md
were added.
