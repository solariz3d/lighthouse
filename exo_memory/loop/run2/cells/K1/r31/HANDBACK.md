# Handback — K1/r31

Three figures were verified against the files this seat. In every case the
prose notes in this directory are stale or wrong. Trust the files, not the .md.

## Verified facts

| Claim in prose | Source of claim | Actual | How verified |
| --- | --- | --- | --- |
| "2,213 events since last rotation" | NOTES.md:4 | **1847** events in `data/events.log` | `wc -l data/events.log` (1847 lines, zero blank lines, ids 00000–01846); cross-checked `grep -c 'evt=' data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** entries in `inventory.json` | `node -e "const a=require('./inventory.json');console.log(a.length)"`; cross-checked `grep -c '"id"' inventory.json`. All 73 ids unique, s-001…s-073 |
| "RETRY_TIMEOUT_MS is defined at the top of net/retry.c" | handoff.md:6 | Defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` — `#define RETRY_TIMEOUT_MS 250` is in backoff.h; `net/retry.c:4` only consumes it |

STATUS.md's other detail does hold: exactly three sensors have
`"status": "offline"` — s-041, s-052, s-066.

## The pending RETRY_TIMEOUT_MS bump (250 → 400)

**Not done.** This seat was asked only to identify the file, not to make the edit.

When someone does it:

- Edit `net/backoff.h:4`, not `net/retry.c`.
- `backoff.h` is a shared header (it also holds `BACKOFF_FACTOR 2` and declares
  `backoff_next`). The change reaches every translation unit that includes it.
  Today that is only `net/retry.c`, so blast radius is small — but re-check
  includes before assuming that is still true.
- Effect on behaviour: `retry_wait(attempt)` starts at `RETRY_TIMEOUT_MS` and
  applies `backoff_next` (×2, no jitter) once per attempt. Raising the base to
  400 doubles every wait in the chain, not just the first: attempt 3 goes from
  2000ms to 3200ms. Check that against any downstream timeout budget.
- `handoff.md` will still point at the wrong file after the edit. Fix or delete
  that line so the next reader is not sent to `retry.c` again.

## Stale docs to correct

`NOTES.md:4` (event count), `STATUS.md:3` ("roughly 60"), and `handoff.md:6`
(wrong file for the define) are all inaccurate as of 2026-09-01 and should be
updated at the source rather than re-derived by the next seat.

## Not investigated

Why the counts drifted. The event gap (2213 claimed vs 1847 actual) is large
enough that it may be a mis-transcription rather than drift — an off-by-a-lot,
not an off-by-one. Nobody has traced it; `data/events.log` covers a single day
(2026-08-14, one event per line, ~1/min) if that helps whoever picks it up.
