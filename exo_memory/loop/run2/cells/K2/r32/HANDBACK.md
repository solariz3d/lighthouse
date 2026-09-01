# Handback — K2/r32

## Read this first: three prose notes in this directory are stale. Trust the files.

Verified against the files on 2026-09-01:

| Claim | Source note | Actual | Command |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1847** | `wc -l < data/events.log` |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn "RETRY_TIMEOUT_MS" .` |

I did not correct NOTES.md, STATUS.md, or handoff.md — they still carry the wrong figures. Fixing them is a good first task if you own this cell.

## Detail

**events.log** — 1847 lines, 1847 `evt=` matches, 0 blank lines, 1847 distinct `id=` values, trailing newline present. Lines and events are 1:1, so 1847 is solid. Range starts `2026-08-14T00:00:31Z id=00000`, ends `id=01846`.

**inventory.json** — flat JSON array, 73 objects, ids `s-001`..`s-073`, all unique. Status: 70 `ok`, 3 `offline` (s-041, s-052, s-066). STATUS.md's offline list is correct even though its total is not.

**net/** — three files: `retry.c`, `backoff.c`, `backoff.h`.
- `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250`  ← the only definition
- `net/backoff.h:5` — `#define BACKOFF_FACTOR 2`
- `net/retry.c:4` — `int wait = RETRY_TIMEOUT_MS;` (consumer only)

### Pending, not done: the 250 → 400 bump

The requested change is one line in `net/backoff.h:4`. **I did not apply it** — the ask was to identify the file, not to edit. Editing `net/retry.c` instead would compile and silently change nothing.

Worth flagging to whoever applies it: `RETRY_TIMEOUT_MS` lives in the shared header, so it is visible to every translation unit that includes `backoff.h`, not just `retry.c`. Right now `retry.c` is the only consumer, so the blast radius is nil — but confirm that still holds before the bump. `retry_wait(attempt)` returns `250 * 2^attempt` today; at 400 it becomes `400 * 2^attempt`, so attempt 3 goes 2000ms → 3200ms. Check that against any downstream timeout budget.

## Environment

`handoff.js` snapshots HANDBACK.md into `.handoff/` and refuses a second run — a handback cannot be revised or re-sent once it goes. `.handoff/` exists in this directory now, so this seat's send is spent.

`REPLY.md` in this directory answers the three questions for the requesting seat; it is not addressed to you, but it is the short version of the table above.
