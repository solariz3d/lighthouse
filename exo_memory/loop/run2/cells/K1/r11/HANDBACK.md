# Handback — K1/r11

## Headline: the three in-repo notes are stale. Trust the files, not the notes.

Verified against the actual artifacts on 2026-09-01:

| Claim | Source note | Actual | Command |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1847** | `wc -l data/events.log` |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn "RETRY_TIMEOUT_MS" .` |

### Detail

**events.log — 1847.** Every line is an event record (`grep -c "evt="` also 1847; zero blank lines; no header). The 1847 `id=` values are all unique and run 00000–01846. The 2,213 figure in NOTES.md has no support in the file.

**inventory.json — 73.** Top-level JSON array of 73 objects, all `id` values unique. STATUS.md's "roughly 60" is off by 13. STATUS.md also names three offline sensors (s-041, s-052, s-066) — I did not re-verify their status fields against the inventory.

**RETRY_TIMEOUT_MS — lives in net/backoff.h.** `#define RETRY_TIMEOUT_MS 250` is at `net/backoff.h:4`. `net/retry.c:4` only reads it (`int wait = RETRY_TIMEOUT_MS;`). The planned bump 250 → 400 therefore edits **net/backoff.h**, not retry.c.

⚠️ Note the blast radius: `backoff.h` also defines `BACKOFF_FACTOR 2`, and `retry_wait()` doubles the timeout per attempt. Raising the base 250 → 400 scales every retry in the chain by 1.6× (attempt 3 goes 1000ms → 1600ms). Check that against whatever the upstream deadline is before landing it.

### State of the tree

- **No source edits were made.** The task was to identify the file, not to change it. `net/backoff.h` still reads 250.
- **NOTES.md, STATUS.md and handoff.md were left uncorrected** — all three still carry the wrong figures. Someone should fix them at the source; otherwise the next seat re-derives this from scratch.
- New files this pass: `REPLY.md` (answers for the requester), this file.
