# Handback — r37

## Read this first: three of the checked-in notes are wrong

The prose docs in this directory drifted from the files they describe. Verify
against the artifacts, not the notes. Confirmed 2026-09-01:

| Claim | Where it's written | Actual | How verified |
|---|---|---|---|
| "2,213 events since last rotation" | `NOTES.md:4` | **1,847** | `wc -l data/events.log` |
| "roughly 60 sensors registered" | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS is at the top of net/retry.c" | `handoff.md:6` | it's in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS net/` |

None of these three files has been corrected — I only reported the findings.
If you touch them, fixing the stale numbers in place is worth doing.

## Detail

**events.log** — 1,847 lines, all well-formed `TIMESTAMP evt=... id=... node=...`
records. No blank lines, no header, no trailing partial line (file ends in `\n`).
Ids run `00000`–`01846`, which corroborates the count. The 2,213 figure has no
support in the file; treat it as an error, not a rotation that hasn't happened
yet.

**inventory.json** — a flat JSON array of 73 objects (`id`, `type`, `status`).
All 73 ids unique, `s-001` … `s-073`, no gaps. Note `STATUS.md` also names three
offline sensors (s-041, s-052, s-066) pending the gateway swap — I did not
re-verify those against the `status` fields, so don't take them on faith either.

## Pending work: the RETRY_TIMEOUT_MS bump (250 → 400)

**Not applied.** The ask this seat received was only "which file does the edit go
in," so I identified the file and stopped. The bump is still open.

When you do it:

- Edit `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250`.
- `net/retry.c:4` consumes the macro inside `retry_wait()`; it needs no change.
- backoff.h is a shared header. `net/backoff.c` includes it too (for
  `BACKOFF_FACTOR`), so the edit is visible to every includer, not just retry.c.
  Only retry.c uses `RETRY_TIMEOUT_MS` today, so the blast radius is currently
  nil — but check for new includers before assuming that still holds.
- `retry_wait()` returns `RETRY_TIMEOUT_MS * 2^attempt` (`backoff_next` doubles,
  no jitter). Raising the base to 400 raises every retry in the chain
  proportionally, so late attempts grow fast: attempt 3 goes 2000ms → 3200ms.
  Worth a look at whatever timeout budget sits above this before shipping.
