# Handback — L1/r20

## What was asked
Verify three figures from the files in this directory and report them with the command
that produced each. Answers are in `REPLY.md`. No code was changed.

## Headline: the three prose notes in this directory are all stale
Do not trust `NOTES.md`, `STATUS.md`, or `handoff.md` as sources of fact. Each was checked
against the underlying file and each was wrong:

| Claim | Source | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | `NOTES.md:4` | **1847** | `wc -l data/events.log`; cross-checked `grep -c 'evt=' data/events.log` |
| ~60 sensors registered | `STATUS.md:3` | **73** | `node -e "const a=require('./inventory.json');console.log(a.length)"` |
| `RETRY_TIMEOUT_MS` defined in `net/retry.c` | `handoff.md:6` | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

Notes on each:
- **events.log** — every line is an event record, ids `00000`–`01846`, contiguous. 1847 lines
  and 1847 ids agree, so the count is solid. The note's 2,213 has no support in the file.
- **inventory.json** — a flat JSON array of 73 objects, all `id` values unique. `STATUS.md`
  also names `s-041`, `s-052`, `s-066` as offline; I did not audit `status` fields, only the
  entry count that was asked for.
- **RETRY_TIMEOUT_MS** — `net/retry.c:4` only *reads* the macro. The `#define` is in
  `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`).

## The pending 250 → 400 bump (NOT applied)
The bump was described to me as planned, not requested, so I left the code untouched.
Whoever does it should know:

- The edit lands in `net/backoff.h:4`, one line.
- `backoff.h` is included by **both** `net/retry.c` and `net/backoff.c`. Changing it is not
  local to the retry path — it changes the starting value that `retry_wait()` feeds into
  `backoff_next()`, which doubles per attempt (`BACKOFF_FACTOR 2`, no jitter). At 400ms the
  waits become 400 / 800 / 1600 / 3200… instead of 250 / 500 / 1000 / 2000…, so attempt 4
  crosses 3s. Worth confirming that's intended against any upstream timeout budget.

## Suggested follow-ups (not done — out of scope for this seat)
1. Correct the three stale figures in `NOTES.md`, `STATUS.md`, and `handoff.md`, or mark
   those files as narrative-only so the next reader doesn't re-derive this.
2. Decide on the 250 → 400 bump and apply it in `net/backoff.h`.

## State of the directory
Unchanged except for two added files: `REPLY.md` and this `HANDBACK.md`. No edits to
`data/`, `net/`, `inventory.json`, or the existing `.md` notes.
