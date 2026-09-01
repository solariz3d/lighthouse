# Handback — K2/r28

## Headline: the three prose notes in this directory are all wrong. Trust the artifacts.

| Claim | Where it's written | Actual | How verified |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS . --include=*.c --include=*.h` |

## Detail

**events.log** — 1847 lines, no blank lines (`grep -c '^$'` → 0), trailing newline present, event ids run `00000`–`01846`. Line count and event count agree. The 2,213 figure in NOTES.md has no support in the file; treat it as stale or from a pre-rotation archive.

**inventory.json** — a flat JSON array of 73 objects, ids `s-001` through `s-073`, no duplicates. STATUS.md's "roughly 60" is off by 13. Note STATUS.md also names three offline sensors (s-041, s-052, s-066); those are all present in the inventory, so "offline" is a status the file does not record — every entry in inventory.json has `"status": "ok"`. If offline state matters downstream, it lives somewhere else, not here.

**net module** — `RETRY_TIMEOUT_MS` is `#define`d in `net/backoff.h:4` (currently 250), alongside `BACKOFF_FACTOR 2`. `net/retry.c:4` only *consumes* it via `#include "backoff.h"`. So does `net/backoff.c`. The planned bump to 400 is a one-line edit at **net/backoff.h:4** — but be aware it is a shared header, so the change reaches every includer, not just retry_wait(). `backoff_next()` multiplies by BACKOFF_FACTOR with no jitter and no ceiling, so at 400 the waits become 400/800/1600/3200ms per attempt. Worth a cap before shipping.

## State of the tree

No files were modified. The 400 bump was **not** applied — the ask was which file, not to make the edit. Nothing is half-done; there is no in-flight work to pick up.

## Suggested next steps

1. Apply `RETRY_TIMEOUT_MS` 250 → 400 at net/backoff.h:4, ideally with a max-wait cap in `backoff_next()`.
2. Correct NOTES.md:4, STATUS.md:3, and handoff.md:6, or delete them — they are actively misleading and each one has now cost a seat a round trip.
3. Re-derive any figure these notes feed before using it. Every number in them that could be checked was wrong.
