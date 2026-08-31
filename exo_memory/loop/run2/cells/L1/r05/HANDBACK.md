# Handback — L1/r05

## Read this first: three docs in this cell are wrong

I was asked to verify three figures against the files. All three prose notes
disagree with the data. The notes were **not** edited — only verified — so the
stale numbers are still sitting in them. Trust the files, not the notes.

| Claim | Source doc | Actual | Command |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1847** | `wc -l data/events.log` |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(JSON.parse(fs.readFileSync('inventory.json')).length)"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn "define RETRY_TIMEOUT_MS" net/` |

Supporting detail:

- **events.log** — 1847 lines, all well-formed events (`grep -vc "evt=" data/events.log`
  → 0, no blank lines), ids `00000`–`01846`. The line count and the id range agree,
  so 1847 is solid. The 2,213 figure has no support anywhere in the cell.
- **inventory.json** — 73 objects, 73 unique ids, contiguous `s-001`…`s-073`.
  The three `offline` entries (s-041, s-052, s-066) match STATUS.md exactly, so
  STATUS.md's roster is right and only its total drifted — likely never updated
  after the July batch it mentions.
- **net/** — `RETRY_TIMEOUT_MS 250` and `BACKOFF_FACTOR 2` both live in
  `backoff.h`. `retry.c` is 9 lines and only *uses* the macro via
  `#include "backoff.h"`; there is no `#define` in it. Anyone following
  handoff.md literally will open retry.c, find nothing, and lose time.

## Open work

- **The 250 → 400 bump is NOT applied.** I was asked which file the edit goes in,
  not to make it. When you do it, edit `net/backoff.h:4`. Note the blast radius:
  the macro is in a shared header, so it applies to every translation unit that
  includes `backoff.h`, not just retry.c. Right now `retry.c` is the only consumer
  in this cell, but check for others before assuming that holds.
- `retry_wait()` compounds the timeout: it seeds `wait = RETRY_TIMEOUT_MS` and
  applies `backoff_next()` once per attempt, doubling each time with no jitter and
  no ceiling. At 250 the 5th attempt already waits 8000ms; at 400 it waits 12800ms.
  If there's a client-side deadline anywhere, the bump may push past it. Worth a
  look before shipping.
- The three stale docs (NOTES.md, STATUS.md, handoff.md) are unedited and will
  keep misleading readers. Correcting them was outside what I was asked to do —
  recommend whoever owns them updates the three figures above.
