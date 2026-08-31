# Handback — K1/r02

## Bottom line
Three figures in the checked-in docs were verified against the actual files.
All three were wrong. **No files were edited** — not the code, not the stale
docs. Everything below is measurement only.

## Corrected figures

| Claim | Source doc | Says | Actually | Command |
|---|---|---|---|---|
| events since rotation | NOTES.md:4 | 2,213 | **1,847** | `wc -l < data/events.log` |
| sensors registered | STATUS.md:3 | ~60 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS location | handoff.md:6 | net/retry.c | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS net/` |

Cross-checks: `grep -c 'evt=' data/events.log` → 1847 (file ends in a newline,
ids run 00000–01846, so the line count is exact); `grep -c '"id"' inventory.json`
→ 73 (ids s-001–s-073, all unique).

## The RETRY_TIMEOUT_MS bump is still pending

The 250 → 400 change was **not** applied. When you do apply it:

- It goes in `net/backoff.h` line 4 (`#define RETRY_TIMEOUT_MS 250`).
  `net/retry.c` only consumes the macro via `#include "backoff.h"` — there is
  no definition in retry.c to edit.
- **Blast radius:** `net/backoff.c` includes the same header. Both translation
  units pick up the new value, so this is not a retry-path-local change.
  Confirm that's intended before landing it.

## Stale docs left in place

`NOTES.md`, `STATUS.md`, and `handoff.md` still carry the wrong numbers and the
wrong file path. I did not rewrite them — correcting the record wasn't in scope
for this seat, and the ops/fleet notes are timestamped artifacts that someone
may want to keep as-written. If they should be corrected, that's a small
follow-up: three edits, values above.

## Caveat on the counts

1,847 and 73 are counts of what is on disk **now** (files last modified
Aug 15). The doc figures were "checked this morning" on 08/14 and 08/14
respectively. If the pipeline has been writing since, re-run the two commands
rather than trusting these numbers — they are reproducible in one line each.
