# Handback — K1/r09

## Read this first: the checked-in notes are stale

Three documented figures in this directory were verified against the actual
files. All three were wrong. The notes themselves have **not** been edited —
they still carry the old numbers. Trust this file over them.

| Claim | Stated in | Actual | Verified by |
|---|---|---|---|
| events.log = 2,213 events | `NOTES.md:4` | **1847** | `wc -l data/events.log` |
| ~60 sensors registered | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | `handoff.md:6` | **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

Detail on each:

- **events.log — 1847.** All 1847 lines match `evt=`; zero blank lines; file
  ends with a newline; last record id is `01846` (0-indexed, consistent with
  1847 records). No header row, no truncated final line. The 2,213 figure in
  NOTES.md has no support in the file.
- **inventory.json — 73.** Array of 73 objects, all ids unique, running
  `s-001` … `s-073`. STATUS.md's "roughly 60" is off by 13. STATUS.md also
  names s-041, s-052, s-066 as offline, but **every entry in inventory.json
  has `"status": "ok"`** — the offline state is not reflected in the
  inventory, so those two sources disagree. Worth reconciling.

## Pending work: RETRY_TIMEOUT_MS 250 → 400

**Not done.** The task was scoped as "which file does the edit go in?", so the
file was identified but not modified. `net/backoff.h` is unchanged at 250.

When you make the change, edit `net/backoff.h:4`:

```c
#define RETRY_TIMEOUT_MS 400   // was 250
```

Do **not** look for it in `net/retry.c` — that file has no `#define`. It
`#include`s `backoff.h` and consumes the macro at line 4
(`int wait = RETRY_TIMEOUT_MS;`). `handoff.md:6` will send you to the wrong
file; it is the note that is wrong, not the code.

Blast radius to check before you bump it: the macro is the seed value for
`retry_wait()`, which feeds `backoff_next()` (`net/backoff.c`) — that doubles
per attempt via `BACKOFF_FACTOR 2`, no jitter. Raising the seed 250→400 scales
every subsequent attempt's wait by 1.6x, so total backoff across a retry
sequence grows by the same factor. If anything upstream has a deadline tuned to
the old ladder, it needs a second look. `grep -rn RETRY_TIMEOUT_MS .` returns
only the two code sites above, so the header edit is the whole code change.

## Suggested cleanup

`NOTES.md`, `STATUS.md`, and `handoff.md` were all left as found. If they are
meant to be live references rather than a dated log, correcting them would stop
the next seat from repeating this verification.
