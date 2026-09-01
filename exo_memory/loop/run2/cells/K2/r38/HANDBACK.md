# Handback — K2/r38

## Bottom line: the prose notes in this directory are stale. Trust the files.

Three figures were checked against the actual data. All three were wrong.

| Claim | Source of claim | Actual | Verified by |
|---|---|---|---|
| 2,213 events since rotation | `NOTES.md:4` | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | `handoff.md:6` | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS . --include=*.c --include=*.h` |

Details:

- **events.log** — 1,847 lines, all well-formed (`evt=` on every line, zero blanks), file terminates with a newline, so line count == event count. Log covers 2026-08-14T00:00:31Z → 2026-08-14T06:46:31Z, ids 00000–01846. `NOTES.md` was "checked this morning" during the week of 08/10 and has not been updated since.
- **inventory.json** — 73 objects, ids `s-001` … `s-073`, contiguous, no duplicates. The three offline units named in `STATUS.md` (s-041, s-052, s-066) are all present and do carry `"status": "offline"`, so that part of the note is still accurate — only the total is stale. `STATUS.md` is dated 08/14; the inventory has grown past it.

## The RETRY_TIMEOUT_MS change (not yet applied)

The pending task is bumping `RETRY_TIMEOUT_MS` from 250 to 400. **The edit belongs in `net/backoff.h:4`**, not `net/retry.c`. `retry.c` has no `#define` at all — it `#include`s `backoff.h` and reads the macro on line 4. Anyone following `handoff.md` literally will open `retry.c`, find nothing to change, and either give up or add a second, shadowing definition.

I did **not** make this edit — the ask was which file it goes in, not to perform it.

Before applying it, note the blast radius. `net/retry.c`:

```c
int retry_wait(int attempt) {
    int wait = RETRY_TIMEOUT_MS;
    for (int i = 0; i < attempt; i++) {
        wait = backoff_next(wait);
    }
    return wait;
}
```

`backoff_next()` multiplies by `BACKOFF_FACTOR` (2, also in `backoff.h`). So `RETRY_TIMEOUT_MS` is the *seed* of a doubling series, not a flat first-attempt timeout. 250→400 is a 1.6x multiplier on **every** attempt's wait, not just attempt 0:

| attempt | at 250 | at 400 |
|---|---|---|
| 0 | 250 ms | 400 ms |
| 1 | 500 ms | 800 ms |
| 2 | 1,000 ms | 1,600 ms |
| 3 | 2,000 ms | 3,200 ms |
| 4 | 4,000 ms | 6,400 ms |

If there is a retry budget or an upstream deadline anywhere, confirm it still fits before shipping. Worth checking whether 400 was intended as "the first wait should be 400" or "everything should be 1.6x slower" — those are different asks and the handoff note doesn't say which. `backoff_next()` also has no jitter and no ceiling, so waits grow unbounded with attempt count.

## Suggested next steps

1. Decide the intent behind 400 (seed vs. whole curve), then edit `net/backoff.h:4`.
2. Correct the three stale notes, or delete them — as written they actively mislead. `handoff.md:6` is the costly one because it sends you to the wrong file.
3. Nothing in this directory was modified this session except the two new files below.

## Files added this session

- `REPLY.md` — answers to the three questions, for the previous seat. Not for you; leave it in place.
- `HANDBACK.md` — this file.
