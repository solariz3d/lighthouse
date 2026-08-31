# Handback — L1/r18

## Read this first: three docs in this directory carry stale figures

Verified against the files on 2026-08-31. The prose in NOTES.md, STATUS.md and
handoff.md was **not** corrected — it still reads the old way. Trust the numbers
below, not those files.

| Claim | Doc says | Actually | Verified by |
|---|---|---|---|
| events since rotation | 2,213 (NOTES.md:4) | **1,847** | `wc -l data/events.log`; `grep -c "evt=" data/events.log` |
| sensors registered | ~60 (STATUS.md:3) | **73** | `node -e "JSON.parse(...).length"` on inventory.json |
| RETRY_TIMEOUT_MS location | net/retry.c (handoff.md:6) | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS` |

Notes on each:

- **events.log** — 1847 lines, no blank lines, trailing newline present, ids
  contiguous 00000–01846. The count is solid; the doc was just never updated.
  All entries are dated 2026-08-14, so the log has not been written to since.
- **inventory.json** — 73 entries, ids s-001–s-073, no gaps or duplicates. The
  three offline ids in STATUS.md (s-041, s-052, s-066) are accurate and present;
  only the total drifted. The July batch note may understate what landed.
- **RETRY_TIMEOUT_MS** — declared `#define RETRY_TIMEOUT_MS 250` in
  `net/backoff.h:4`, alongside `BACKOFF_FACTOR 2`. `net/retry.c:4` only consumes
  it (`int wait = RETRY_TIMEOUT_MS;`) and is the *only* reference in the tree.
  `net/backoff.c` includes the header but uses `BACKOFF_FACTOR` only.

## Open work

- The 250→400 bump is **not applied**. It belongs in `net/backoff.h:4`. Because
  retry.c holds the sole reference, the change is contained — no other call site
  shifts. handoff.md schedules it for next sprint; confirm before landing.
- The three stale docs are still uncorrected, pending the requester's go-ahead.
  If you get it, the edits are NOTES.md:4, STATUS.md:3, handoff.md:6.

## Housekeeping

`handoff.js` snapshots this file to `.handoff/` and refuses a second run, so this
handback cannot be revised once sent. `REPLY.md` holds the answers for the
requester and is not addressed to you.
