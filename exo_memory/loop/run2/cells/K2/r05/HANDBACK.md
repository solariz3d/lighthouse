# Handback — K2/r05

## Headline: three of the checked-in notes are stale. Trust the files, not the notes.

| Claim | Source note | Actual | How verified |
|---|---|---|---|
| "2,213 events since rotation" | NOTES.md:4 | **1847** | `wc -l data/events.log`; cross-checked `grep -c 'evt='` and unique `id=` count — all 1847 |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"`; ids s-001..s-073, no dups/gaps |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

The notes were **not** edited — NOTES.md, STATUS.md and handoff.md still carry the old figures. Correcting them was outside this seat's ask. If they are load-bearing for anyone downstream, fix them or they will mislead again.

## Detail

**events.log** — 1847 lines, uniform format (`<ts> evt=<kind> id=<5-digit> node=r<n>`), ids 00000–01846 contiguous, no blank lines, trailing newline present. Covers 2026-08-14T00:00:31Z through 06:46:31Z, one event per minute. So line count == event count; no dedup or filtering needed.

**inventory.json** — flat JSON array of 73 objects, each `{id, type, status}`. 70 have `status: "ok"`; three are `"offline"`: s-041 (hall), s-052 (thermal), s-066 (optical). Those are the same three STATUS.md flags for the gateway swap, so the offline list is accurate even though its total isn't. If "registered" is meant to exclude offline units the number is 70 — but the array holds 73.

**net/ retry timeout** — layout is:
- `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250`  ← **the bump to 400 goes here**
- `net/backoff.h:5` — `#define BACKOFF_FACTOR 2`
- `net/retry.c:4` — `int wait = RETRY_TIMEOUT_MS;` inside `retry_wait()`; consumer only
- `net/backoff.c` — includes backoff.h, uses BACKOFF_FACTOR only

There is no `net/retry.h`. Only retry.c reads RETRY_TIMEOUT_MS, so changing the define to 400 is a one-line, single-consumer edit. Note the knock-on: `retry_wait(attempt)` doubles per attempt with no jitter, so the bump scales every retry step (attempt 3 goes 2000ms → 3200ms). Worth a look if any caller has a deadline tuned to the 250 base.

## State of the directory

No files were modified and nothing was built or run beyond read-only inspection. Added this run: `REPLY.md` (answers for the requesting seat) and this file. `handoff.js` writes a `.handoff/` lock and refuses a second run, so this hand-on cannot be revised once sent.
