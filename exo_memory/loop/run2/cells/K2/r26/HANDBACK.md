# Handback — K2/r26

Three figures in the checked-in notes were verified against the actual files
this seat. All three were stale or wrong. **Trust the files, not the notes.**

## Corrected facts

| Claim | Stated in | Actual | Verified by |
|---|---|---|---|
| events.log = 2,213 events | NOTES.md:4 | **1,847** | `wc -l data/events.log`; `grep -c 'evt=' data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73 entries** | `node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` |
| RETRY_TIMEOUT_MS in net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Detail:

- **events.log** — 1847 lines, every line matches `evt=`, ids `00000`–`01846`
  all unique, no blank lines, no rotation marker inside the file. So 1847 is
  the count since last rotation, not a partial view.
- **inventory.json** — top-level JSON array, 73 objects, uniform shape
  `{id, type, status}`, 73 unique ids. Status split: 70 `ok`, 3 `offline`.
  The 3 offline ids are s-041, s-052, s-066 — exactly the ones STATUS.md
  names, which confirms this is the correct fleet file; only the count was stale.
- **RETRY_TIMEOUT_MS** — `#define RETRY_TIMEOUT_MS 250` lives in
  `net/backoff.h:4`, alongside `BACKOFF_FACTOR 2`. `net/retry.c:4` only
  *consumes* it (`int wait = RETRY_TIMEOUT_MS;`). There is no definition in
  retry.c at all.

## Open item: the 250 → 400 bump

**Not applied.** This seat was asked which file the edit belongs in, not to
make the change. The edit is a one-line change to `net/backoff.h:4`.

Before applying, note the blast radius:

- `backoff.h` is a shared header. Within this directory only `retry.c`
  includes it, so the bump is contained here — but check for other includers
  if this tree is a subset of a larger repo.
- `retry_wait()` uses the macro as the *base* of a doubling series
  (`backoff_next()` multiplies by `BACKOFF_FACTOR 2`, no jitter). Bumping the
  base rescales **every** attempt, not just the first: attempt *n* becomes
  400·2ⁿ instead of 250·2ⁿ. By attempt 5 that is 12800 ms vs 8000 ms. If any
  caller has an overall deadline, re-check it against the new tail.

## Docs to fix

`NOTES.md:4`, `STATUS.md:3`, and `handoff.md:6` still carry the wrong values
and will mislead the next reader the same way. Worth correcting at the source.
