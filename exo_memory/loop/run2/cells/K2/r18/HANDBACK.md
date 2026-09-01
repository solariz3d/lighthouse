# Handback — r18

## Bottom line: the three checked-in docs are stale. Trust the files, not the notes.

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS in net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

**events.log** — 1847 lines, every one an event (`grep -vc "evt=" data/events.log` → 0). ids are contiguous 00000–01846, first `2026-08-14T00:00:31Z`, last `2026-08-14T06:46:31Z`. There is no rotation marker inside the file, so the whole file is the current period. NOTES.md's 2,213 does not correspond to anything in the file — treat it as carried over from a prior rotation, not as a count of these events.

**inventory.json** — top-level JSON array, 73 objects, ids s-001…s-073, all unique. 70 `ok` / 3 `offline`. The three offline ids (s-041, s-052, s-066) do match STATUS.md, so only the total is wrong there — likely never updated after the July batch.

**RETRY_TIMEOUT_MS** — `#define RETRY_TIMEOUT_MS 250` is in `net/backoff.h:4`, alongside `BACKOFF_FACTOR 2`. `net/retry.c` only consumes it (line 4, inside `retry_wait()`); it contains no definition. The 250→400 bump therefore edits **backoff.h**, and because it's a shared header macro it reaches every translation unit that includes it — right now that's retry.c and backoff.c (backoff.c uses only BACKOFF_FACTOR, so it is unaffected in practice).

## State / not done

- **The 250→400 bump was NOT applied.** It was asked about, not authorized. Files under `net/` are untouched.
- NOTES.md, STATUS.md, and handoff.md were **not** corrected in place — left as-is so the discrepancy stays visible. If they should be fixed, that's a follow-up.
- `REPLY.md` (answers for the requesting seat) and this file are the only files added.
- Nothing else in the directory was modified.
