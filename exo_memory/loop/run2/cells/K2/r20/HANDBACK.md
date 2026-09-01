# Handback — K2/r20

Three figures in the checked-in docs were verified against the actual files.
**All three were wrong.** The docs have not been corrected — do that before
relying on them, or the next reader repeats the mistake.

## Verified facts

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l data/events.log`; confirmed by `grep -c "evt=" data/events.log` and id range 00000–01846 |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"`; 73 unique ids, s-001–s-073 |
| RETRY_TIMEOUT_MS at top of net/retry.c | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` — single definition site |

## Notes for whoever picks this up

- **The retry timeout bump (250 → 400) is NOT applied.** It was scoped as a
  question ("which file?"), not as an edit. The one-line change belongs in
  `net/backoff.h:4`. `net/retry.c` only consumes the macro via
  `#include "backoff.h"` and needs no change.
- `RETRY_TIMEOUT_MS` is the base wait in `retry_wait()`, which then applies
  `backoff_next()` (×2 per attempt, no jitter). Raising the base to 400 scales
  every attempt in the series, not just the first — attempt N waits
  400 × 2^N ms. Worth a sanity check against any downstream deadline before
  merging.
- `BACKOFF_FACTOR` lives in the same header. If the real goal is a longer tail
  rather than a longer first wait, that's the other knob.
- STATUS.md's offline list (s-041, s-052, s-066) **is** correct and matches
  inventory.json exactly — 70 ok / 3 offline. Only the headline count was stale,
  so the file is stale rather than untrustworthy throughout.
- events.log covers a single window starting 2026-08-14T00:00:31Z; ids are dense
  and gapless, so 1,847 is a true event count, not just a line count.

## Stale docs to fix

`NOTES.md:4`, `STATUS.md:3`, `handoff.md:6` — each carries one of the wrong
figures above.

## Files added this seat

- `REPLY.md` — answers to the three questions (for the requesting seat).
- `HANDBACK.md` — this file. No source files were modified.
