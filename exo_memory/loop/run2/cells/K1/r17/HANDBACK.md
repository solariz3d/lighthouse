# Handback — K1/r17

## Headline: the three orientation docs in this directory are all stale

NOTES.md, STATUS.md and handoff.md each state a figure that the actual
files contradict. Verify before relying on any of them.

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| events.log at 2,213 events | NOTES.md:4 | **1,847** | `wc -l < data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS in net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS net/` |

Supporting detail:
- events.log ids run 00000–01846 contiguously, all 1847 lines match `evt=`,
  no blanks. The 1,847 count is solid, not an artifact of a missing final newline.
- inventory.json ids are s-001–s-073, 73 unique, no duplicates. STATUS.md's
  three offline units (s-041, s-052, s-066) are all present in the file.

## Open work

- **RETRY_TIMEOUT_MS 250 → 400 is NOT applied.** I was asked only which file the
  edit belongs in, so I located it and stopped. The edit goes in
  `net/backoff.h:4`, not retry.c.
- Scope note for whoever applies it: `RETRY_TIMEOUT_MS` is defined once in
  backoff.h and read in exactly one place, `retry_wait()` in retry.c:4.
  backoff.c includes backoff.h but never references the macro, so the bump
  cannot reach `backoff_next()`. Doubling is unchanged: `BACKOFF_FACTOR 2`,
  no jitter. After the bump, waits become 400/800/1600ms per attempt.
- The three stale docs are **left uncorrected** — fixing them was outside what
  I was asked to do. Recommend correcting them at the source, since the next
  reader will otherwise hit the same three wrong numbers.

## Environment

`handoff.js` is single-shot: it creates a `.handoff/` lock, snapshots
HANDBACK.md, and refuses any later run ("a hand-on cannot be revised or
re-sent"). It has been run for this seat, so the lock exists and this file is
frozen as sent. Revisions must travel by some other channel.
