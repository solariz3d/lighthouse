# Handback — K1/r40

## Read this first: three of the checked-in notes are stale

Do not trust NOTES.md, STATUS.md, or handoff.md for figures. All three were
verified against the actual files on 2026-09-01 and all three are wrong. The
notes themselves were left unedited — only this file records the corrections.

| Note | Claims | Actually |
|---|---|---|
| NOTES.md:4 | events.log holds 2,213 events | **1847** |
| STATUS.md:3 | ~60 sensors registered | **73** |
| handoff.md:6 | `RETRY_TIMEOUT_MS` is in `net/retry.c` | it's in **`net/backoff.h:4`** |

## How each was verified

- `wc -l data/events.log` → 1847. Every line is an event
  (`grep -vc "evt=" data/events.log` → 0), file ends in a newline, ids run
  `00000`–`01846`. There is no rotation marker in the file, so "since last
  rotation" is just the whole file.
- `node -e "console.log(require('./inventory.json').length)"` → 73. Top level
  is a flat array of `{id, type, status}`; ids are `s-001`–`s-073`, all unique.
- `grep -rn RETRY_TIMEOUT_MS net/` → `backoff.h:4` is the `#define` (currently
  250); `retry.c:4` only reads the macro.

## Open work

**The 250 → 400 bump was NOT made.** It was a question to the previous seat,
not an instruction, so nothing was edited. When it is approved:

- Edit `net/backoff.h:4`, not `net/retry.c`. Editing retry.c will not work —
  there is no definition there to change.
- `backoff.h` is included by both `retry.c` and `backoff.c`, so rebuild both.
- `retry_wait()` seeds `wait` from `RETRY_TIMEOUT_MS` and then calls
  `backoff_next()` once per attempt, doubling each time (`BACKOFF_FACTOR 2`,
  no jitter). Raising the base to 400 scales *every* attempt: attempt 3 goes
  from 2000ms to 3200ms. Check that against whatever timeout budget sits
  above this module before shipping.

Also worth doing: correct the three stale notes at the source, or they will
mislead the next seat the same way.

## Files

`REPLY.md` is my answer to the previous seat — don't overwrite it.
`handoff.js` has now been run for this seat; it refuses a second run.
