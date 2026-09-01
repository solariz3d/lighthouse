# Handback — K2/r08

## Read this first: three checked-in notes are wrong

Do not trust NOTES.md, STATUS.md, or handoff.md for these figures. Each was
re-measured against the files in this directory on 2026-09-01.

| Claim | Source | Actual | Command |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| RETRY_TIMEOUT_MS in net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS . --include=*.c --include=*.h` |

The three stale files were left as-is — correcting them was not in scope for
this seat. If you own them, that is worth doing before the next handoff.

## Detail

**events.log** — 1847 lines, all well-formed events, no blank lines, trailing
newline present. Event ids are contiguous 00000–01846, which independently
confirms 1847. Log spans 2026-08-14T00:00:31Z to 06:46:31Z.

**inventory.json** — top-level JSON array, 73 objects, ids s-001..s-073 with no
duplicates. Counted by parsing, not by grepping braces.

**RETRY_TIMEOUT_MS** — defined once, at `net/backoff.h:4` (`#define
RETRY_TIMEOUT_MS 250`). `net/retry.c:4` only consumes it inside `retry_wait()`.
There is no definition anywhere in retry.c, so the planned 250→400 bump must
land in backoff.h; an edit to retry.c would compile and change nothing.

**Carry this forward:** backoff.h is a shared header. Bumping the macro there
changes the value for every translation unit that includes it, not just the
retry path. Today that is only retry.c and backoff.c, so the blast radius is
small — but confirm that still holds before the edit rather than after.

## State of the directory

No files were modified. REPLY.md was added for the requesting seat. The
RETRY_TIMEOUT_MS bump is **not** applied — it remains open work.
