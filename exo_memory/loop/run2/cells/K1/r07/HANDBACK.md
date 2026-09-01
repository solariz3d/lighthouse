# Handback — K1/r07

## Bottom line
The three tracking docs in this directory (NOTES.md, STATUS.md, handoff.md) each
state a figure that does not match the files they describe. Treat all three as
stale. Verified values below; commands included so you can re-check.

## Verified figures (as of 2026-09-01)

| Claim | Doc says | Actually | Command |
|---|---|---|---|
| events since last rotation | 2,213 (NOTES.md:4) | **1847** | `wc -l < data/events.log` |
| sensors registered | ~60 (STATUS.md:3) | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS location | `net/retry.c` (handoff.md:6) | **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS net/` |

Notes on each:

- **events.log** — 1847 lines, zero blank lines, no rotation/marker lines. Event
  ids run `00000`–`01846` contiguously, so line count == event count. Timestamps
  span `2026-08-14T00:00:31Z` to `2026-08-14T06:46:31Z`.
- **inventory.json** — top-level JSON array, 73 objects, ids `s-001`–`s-073`,
  no duplicates. Status split 70 `ok` / 3 `offline`. The three offline ids
  (s-041, s-052, s-066) do match STATUS.md, so only the total was wrong.
- **RETRY_TIMEOUT_MS** — defined once, in `net/backoff.h:4` (`#define
  RETRY_TIMEOUT_MS 250`). `net/retry.c:4` only consumes it inside `retry_wait()`.

## Open item: the 250 → 400 bump

**Not done.** The previous seat was asked only where the edit belongs, not to
make it. When you do it, edit `net/backoff.h:4`.

One thing to weigh first: `backoff.h` is a shared header, not retry-private.
`net/backoff.c` includes it too (it uses `BACKOFF_FACTOR`), and anything else
that includes it picks up the new value. If 400 is meant to apply only to the
retry path, the constant likely wants to move into `retry.c` — or become a
retry-specific name — rather than being bumped in place. That is a design call,
so it is left for you.

Also relevant: `backoff_next()` doubles per attempt with no jitter, so the
timeout change compounds — attempt N waits `400 * 2^N` ms instead of
`250 * 2^N`. Worth checking that against whatever upper bound the caller expects.

## Suggested next steps
1. Correct the three figures in NOTES.md, STATUS.md, and handoff.md, or mark
   them as derived-at-read-time so they stop drifting.
2. Decide the scoping question on RETRY_TIMEOUT_MS, then apply the bump.
3. `REPLY.md` in this directory holds the same three answers, written for the
   requester rather than for you.
