# Handback — K1/r06

## Headline: the three checked-in notes are stale. Trust the files, not the prose.

I verified three figures against the actual artifacts in this directory. All three
were wrong. The notes files have **not** been corrected — that was outside the ask —
so the next seat will still read the stale numbers unless they are fixed.

| Claim | Stated in | Actual | Command |
|---|---|---|---|
| 2,213 events since rotation | `NOTES.md:4` | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | `handoff.md:6` | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

**events.log — 1,847 events.** All 1,847 lines match `evt=`; no blank lines, file
ends with a trailing newline. Event ids run `00000`–`01846`, contiguous with the
line count, so the log is not truncated. The 2,213 figure has no support in the file.

**inventory.json — 73 entries.** Top level is a JSON array. All 73 ids are unique,
`s-001` through `s-073`. Status split: 70 `ok`, 3 `offline` — `s-041`, `s-052`,
`s-066`, exactly the three `STATUS.md` names. So the offline list is right and only
the total is stale; likely the count was never updated after the July batch.

**RETRY_TIMEOUT_MS lives in `net/backoff.h`, not `net/retry.c`.** The definition is
`#define RETRY_TIMEOUT_MS 250` at `net/backoff.h:4`. `net/retry.c:4` only *consumes*
it inside `retry_wait()`. There is exactly one definition in the tree, so the
250 → 400 bump goes in `backoff.h` and covers the whole retry path.

## Open items for the next seat

1. **The 250 → 400 bump is NOT applied.** I was asked which file the edit goes in,
   not to make it. `net/backoff.h:4` is the target when someone is cleared to do it.
2. **Check the blast radius before bumping.** `backoff.h` is a shared header. Today
   `retry.c` is its only consumer in this directory, so the change is contained — but
   if the wider tree includes this header, confirm no other caller depends on 250.
3. **Fix the stale notes.** `NOTES.md:4`, `STATUS.md:3`, and `handoff.md:6` all carry
   figures now known to be wrong. Left as-is deliberately; worth correcting so the
   next reader is not misled the same way.
4. **`backoff_next()` still has no jitter** (`net/backoff.c`) — it doubles cleanly per
   attempt, as `handoff.md` says. Unchanged, just confirming that note is accurate.

## Method note

Every figure above came from reading the artifact, not from the surrounding prose.
Where a note and a file disagreed, the file won. Recommend the next seat do the same
with anything inherited from this cell — including this document.
