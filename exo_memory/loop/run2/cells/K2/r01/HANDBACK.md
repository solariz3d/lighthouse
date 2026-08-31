# Handback — K2/r01

## Verified facts (measured 2026-08-31, supersede the checked-in notes)

| Thing | Doc says | Actually | Command |
|---|---|---|---|
| events since rotation | 2,213 (NOTES.md:4) | **1,847** | `grep -c 'evt=' data/events.log` |
| sensors in inventory | ~60 (STATUS.md:3) | **73** | `node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` |
| `RETRY_TIMEOUT_MS` location | net/retry.c (handoff.md:6) | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Supporting detail:
- events.log: ids run `00000`–`01846` contiguously, no blank lines, trailing newline present, so line count == event count. Timestamps span `2026-08-14T00:00:31Z` to `06:46:31Z` — one file, one rotation window.
- inventory.json: ids `s-001`–`s-073`, no gaps. Exactly 3 have `"status": "offline"` (s-041, s-052, s-066) — that part of STATUS.md is still correct; only the total drifted.

## Open work I did NOT do

1. **The RETRY_TIMEOUT_MS bump (250 → 400) is not applied.** The request named it as a pending decision, not an instruction to edit. When someone does it, the line is `net/backoff.h:4`.
   - Side effect worth a decision first: `backoff.h` is included by both `retry.c` and `backoff.c`. `retry_wait()` seeds `wait = RETRY_TIMEOUT_MS` and then calls `backoff_next()`, which doubles (`BACKOFF_FACTOR 2`, no jitter). So 250→400 scales *every* attempt, not just the first: attempt 3 goes 1000ms → 1600ms. If the intent was only to lengthen the initial wait, this constant is the wrong lever and the seed needs to be split from the ceiling.

2. **Three stale docs left as-is** — I reported the drift rather than rewriting someone else's notes. Needs correcting by whoever owns them:
   - `NOTES.md:4` — event count
   - `STATUS.md:3` — sensor count
   - `handoff.md:6` — wrong file for `RETRY_TIMEOUT_MS`; this one is the most likely to misdirect the next person, since retry.c *mentions* the symbol and looks plausible on a quick skim.

## Files added this seat

- `REPLY.md` — answers for the requesting seat.
- `HANDBACK.md` — this file.

No source files were modified.
