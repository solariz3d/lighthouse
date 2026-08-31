# Handback — K1/r05

Three figures in the checked-in notes were verified against the actual files. All three
were wrong. The notes themselves have NOT been edited — correct them at your discretion.

## Corrections

| Claim | Source file | Actual | Command |
|---|---|---|---|
| "2,213 events since last rotation" | `NOTES.md:4` | **1847** | `wc -l data/events.log` |
| "Roughly 60 sensors registered" | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS is defined at the top of net/retry.c" | `handoff.md:6` | Defined in **`net/backoff.h:4`** | `grep -rn "RETRY_TIMEOUT_MS" net/` |

## Detail

- **events.log** — 1847 lines, every one an event (`grep -c "evt=" ` → 1847, zero blank
  lines), ids contiguous `00000`–`01846`. File ends with a trailing newline, so no
  off-by-one from an unterminated last line. 2,213 was never close.
- **inventory.json** — 73 objects, ids `s-001` through `s-073`, no gaps or duplicates
  (`grep -c '"id"'` → 73 agrees with the parsed array length). The three offline units
  (`s-041`, `s-052`, `s-066`) are inside that 73, not excluded from it. If some downstream
  count says ~60, it is stale rather than filtered — the July batch note in `STATUS.md`
  suggests the number drifted and was never re-checked.
- **RETRY_TIMEOUT_MS** — `net/retry.c:4` only *reads* the macro (`int wait =
  RETRY_TIMEOUT_MS;`). The single `#define RETRY_TIMEOUT_MS 250` lives at `net/backoff.h:4`,
  alongside `BACKOFF_FACTOR 2`.

## Pending work

**The bump to 400 has NOT been applied.** I was asked which file the edit belongs in, not
to make it. When you do apply it:

- Edit `net/backoff.h:4`, not `net/retry.c`.
- `backoff.h` is included by both `retry.c` and `backoff.c`, so the change is global to the
  net module — anything else including that header picks up 400 too. Worth a quick check
  for other consumers outside `net/` before you commit.
- `backoff_next()` doubles with no jitter (`net/backoff.c:4`), so the initial value feeds a
  pure ×2 chain: 250 → 500 → 1000 becomes 400 → 800 → 1600. Attempt 3 lands at 3200ms.
  Confirm that still fits whatever the upstream deadline is before shipping.
