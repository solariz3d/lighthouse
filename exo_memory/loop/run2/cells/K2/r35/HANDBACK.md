# Handback — K2/r35

## Bottom line: the three prose docs in this directory are all stale. Trust the files, not the notes.

| Claim | Source doc | Measured | Command |
|---|---|---|---|
| 2,213 events since rotation | `NOTES.md:4` | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | `STATUS.md:3` | **73** | `.length` on parsed `inventory.json` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | `handoff.md:6` | **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS net/` |

Details and verification notes are in `REPLY.md`.

## Verification detail

- **events.log**: 1847 lines, ends with a trailing newline, zero blank lines, all lines carry `evt=`, and all 1847 `id=` values are distinct. So 1847 lines = 1847 events; the count is not inflated by duplicates or padding.
- **inventory.json**: a top-level JSON **array** of 73 objects shaped `{id, type, status}`. All 73 ids unique. Status: 70 `ok`, 3 `offline` — the 3 offline agrees with `STATUS.md`, so only the *total* drifted, not the offline set. Types: hall 19, optical 18, pressure 18, thermal 18.

## The RETRY_TIMEOUT_MS bump (open work — NOT done)

The requested change (250 → 400) was **not applied**. The ask this seat received was "which file does the edit go in?", a question, so I answered it and left the code untouched.

When someone does apply it, edit `net/backoff.h:4`:

```c
#define RETRY_TIMEOUT_MS 250   →   400
```

`net/retry.c:4` only *reads* the macro (`int wait = RETRY_TIMEOUT_MS;`); there is no definition there to edit. `handoff.md` points at the wrong file.

**Watch the blast radius before bumping.** `backoff.h` is included by both `retry.c` and `backoff.c`, so the macro is header-wide, not local to the retry path. `retry_wait()` seeds `wait` from `RETRY_TIMEOUT_MS` and then applies `backoff_next()` once per attempt, which doubles via `BACKOFF_FACTOR 2` with no jitter and no cap. Raising the base 250 → 400 scales *every* attempt by 1.6×, so attempt 3 goes 2000 ms → 3200 ms and it keeps doubling from there. Confirm the caller's overall retry deadline tolerates that before landing it.

## Housekeeping

- `REPLY.md` is addressed to the previous seat's requester, not to you.
- Suggest correcting `NOTES.md`, `STATUS.md`, and `handoff.md` at the source — otherwise the next seat re-derives these same three numbers. All three were left as-is; no edits were made to any file in this directory.
