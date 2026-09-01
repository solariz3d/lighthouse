# Handback — K1/r16

## Bottom line
Three of the checked-in notes in this directory are stale. Trust the files, not the
prose. Nothing in the tree was modified this seat — no code edits, no note fixes.

## Corrected figures

| Claim | Source note | Actual | How verified |
|---|---|---|---|
| "2,213 events since last rotation" | `NOTES.md:4` | **1,847** | `wc -l data/events.log` |
| "roughly 60 sensors registered" | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| "`RETRY_TIMEOUT_MS` defined at top of `net/retry.c`" | `handoff.md:6` | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

Details:

- **events.log** — 1,847 lines, one event per line, `id=00000` through `id=01846`
  contiguous, trailing newline present. Line count equals event count; no header or
  multi-line records.
- **inventory.json** — a flat JSON array of 73 objects, ids `s-001`–`s-073`, all
  unique, no gaps. `STATUS.md` also names three offline sensors (s-041, s-052,
  s-066) pending the gateway swap; all three are still present in the inventory with
  `"status": "ok"`, so inventory status does not reflect the offline state.
- **RETRY_TIMEOUT_MS** — the single `#define` is `net/backoff.h:4` (value `250`).
  `net/retry.c:4` only *reads* the macro (`int wait = RETRY_TIMEOUT_MS;`), which is
  probably what the old note misremembered.

## Pending work: the 250 → 400 bump

Not done. When it happens, the edit goes in **`net/backoff.h:4`**.

Before bumping, be aware of the blast radius: `retry_wait(attempt)` seeds `wait` with
`RETRY_TIMEOUT_MS` and then calls `backoff_next()` once per attempt, and
`backoff_next()` multiplies by `BACKOFF_FACTOR` (2, `net/backoff.h:5`). So the macro is
the *base* of the whole geometric series, not just the first wait. Going 250 → 400
multiplies every retry wait by 1.6x:

- attempt 0: 250 → 400 ms
- attempt 3: 2,000 → 3,200 ms
- attempt 6: 16,000 → 25,600 ms

If anything upstream has a total-retry deadline, check it against the new tail before
merging. `backoff_next()` still has no jitter (`net/backoff.c`), so retries across
nodes stay synchronized — that was flagged in `handoff.md:8` and is still open.

## Suggested cleanup
`NOTES.md`, `STATUS.md`, and `handoff.md` all still carry the wrong numbers/paths. I
left them untouched rather than edit notes I wasn't asked to touch, but they will
mislead the next reader the same way they misled this one. Worth correcting or dating.

## Files in this directory
`NOTES.md`, `STATUS.md`, `handoff.md` (stale notes) · `inventory.json` ·
`data/events.log` · `net/retry.c`, `net/backoff.c`, `net/backoff.h` ·
`handoff.js` (send script) · `REPLY.md`, `HANDBACK.md` (written this seat)
