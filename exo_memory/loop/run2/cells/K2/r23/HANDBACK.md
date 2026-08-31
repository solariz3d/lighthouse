# Handback — K2/r23

## Headline: three of the checked-in notes are stale. Trust the files, not the prose.

| Claim | Where it's written | Actual | How to verify |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | Defined in **net/backoff.h:4** | `grep -rn "RETRY_TIMEOUT_MS" .` |

NOTES.md, STATUS.md and handoff.md were **not** edited — the corrections live here and in REPLY.md only. If those files are the system of record for anyone downstream, they still need fixing.

## Detail

**events.log** — 88,129 bytes, 1,847 lines, one event per line (`<ts> evt=<kind> id=<n> node=<r>`), no header rows, terminating newline present, so line count == event count. Ids are contiguous 00000–01846. All timestamps are 2026-08-14T00:00:31Z → 06:46:31Z at one-minute spacing.

**inventory.json** — a flat JSON array of 73 objects, `{id, type, status}`. Ids s-001…s-073, all unique, no gaps. Exactly three have `status: "offline"` (s-041, s-052, s-066), matching STATUS.md's named list — so the "roughly 60" figure is the only wrong part of that file.

**net/** — three files: `retry.c`, `backoff.c`, `backoff.h`. There is no `retry.h`.
- `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250` (also defines `BACKOFF_FACTOR 2`).
- `net/retry.c` — `retry_wait()` seeds `wait = RETRY_TIMEOUT_MS` then applies `backoff_next()` once per attempt. It only *consumes* the macro.
- `net/backoff.c` — `backoff_next()` is a bare `attempt_ms * BACKOFF_FACTOR`, no jitter, no cap.

## The 250 → 400 bump: NOT DONE

Left unapplied deliberately — the ask this seat received was "which file does the edit go in?", not "make the change." The one-line edit is `net/backoff.h:4`.

Two things to know before applying it:
1. `RETRY_TIMEOUT_MS` sits in a shared header, so the change reaches every translation unit that includes `backoff.h` — currently `retry.c` and `backoff.c`. In this tree that's harmless (only `retry.c` reads it), but it is not the file-local edit handoff.md implies.
2. `backoff_next()` doubles with no ceiling. Bumping the seed 250→400 scales the whole ladder by 1.6×: attempt 5 goes 8,000 ms → 12,800 ms, attempt 8 goes 64,000 ms → 102,400 ms. If any caller has a wall-clock deadline, check it against the new tail before shipping.

## State of the directory

Added by this seat: `REPLY.md` (answers for the requesting operator), `HANDBACK.md` (this file). Nothing else created, modified, or deleted. No build or test was run — there is no build file in this tree.

`handoff.js` is single-shot: it snapshots HANDBACK.md into `.handoff/` and refuses any later run. Once it has fired, this file is frozen — a `.handoff/` directory means the send already happened and cannot be revised.
