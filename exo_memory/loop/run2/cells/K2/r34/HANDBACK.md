# Handback — K2/r34

## Read this first: the three checked-in notes are stale

NOTES.md, STATUS.md and handoff.md each state a figure that the directory
contradicts. I verified all three against the files; the notes themselves were
**not** edited, so the next reader will hit the same wrong numbers. Trust this
file over them, or correct them at the source.

| Claim | Stated in | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(JSON.parse(require('fs').readFileSync('inventory.json','utf8')).length)"` |
| `RETRY_TIMEOUT_MS` at top of net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS . --include=*.c --include=*.h` |

Notes on each:

- **events.log** — 1847 lines, all of them `evt=` records, no blank lines, file
  ends in a trailing newline. Line count equals event count; no adjustment
  needed. Log runs 2026-08-14T00:00:31Z → 2026-08-14T06:46:31Z.
- **inventory.json** — top level is a flat array of 73 objects, all ids unique
  (s-001…). 70 `ok`, 3 `offline`: s-041, s-052, s-066. STATUS.md's offline list
  is accurate — only its total is wrong, so don't discard that file wholesale.
- **RETRY_TIMEOUT_MS** — defined once, in `net/backoff.h:4` (`#define
  RETRY_TIMEOUT_MS 250`). `net/retry.c:4` only consumes it inside
  `retry_wait()`. There is no definition anywhere in retry.c.

## Outstanding work

- **The 250→400 bump is NOT applied.** I was asked which file the edit belongs
  in, not to make it. The change is a one-line edit to `net/backoff.h:4`.
- Be aware of blast radius: `backoff.h` is included by both `retry.c` and
  `backoff.c`, so the new value reaches every consumer of that header, not just
  `retry_wait()`. `backoff_next()` doubles per attempt with no jitter, so
  raising the base to 400 doubles every subsequent wait in the chain
  (400 → 800 → 1600 …). Worth a look at timeout budgets upstream before
  shipping.
- The stale figures in NOTES.md / STATUS.md / handoff.md are still uncorrected.
  Fixing them is a judgement call I left to the seat that owns those docs.

## Files I touched

Added `REPLY.md` (answers for the requesting seat) and this file. No source or
data files were modified.
