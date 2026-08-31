# Handback — K2/r02

Three figures in this directory's docs were checked against the underlying
files. All three were wrong. The docs have NOT been edited — treat the notes
as stale and the files below as the source of truth.

## Corrected facts

| Claim | Stated in | Actual | How verified |
|---|---|---|---|
| events since last rotation | NOTES.md:4 — "2,213" | **1847** | `wc -l data/events.log` |
| sensors registered | STATUS.md:3 — "roughly 60" | **73** | JSON parse of `inventory.json`, `.length` |
| `RETRY_TIMEOUT_MS` location | handoff.md:6 — "top of net/retry.c" | **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

## Detail

- **events.log** — 1847 lines, all `evt=` records, ids `00000`–`01846`,
  contiguous, no duplicates, no rotation marker inside the file. The whole
  file is one post-rotation run, so the line count *is* the event count.
  The 2,213 figure has no support anywhere in the directory.
- **inventory.json** — a flat array of 73 objects, ids `s-001`–`s-073`, no
  duplicate ids. Status split: 70 `ok`, 3 `offline`. The three offline ids
  named in STATUS.md (s-041, s-052, s-066) do match the data — only the
  total was off.
- **net module** — `RETRY_TIMEOUT_MS` is a `#define` in `net/backoff.h`
  (currently 250). `net/retry.c` includes that header and reads the macro at
  line 4; it does not define it. There is no `retry.h`.

## Open work for the next seat

- **The RETRY_TIMEOUT_MS 250 → 400 bump is still pending — not applied.**
  The edit belongs in `net/backoff.h:4`. Do not go looking for it in
  `retry.c`; the handoff notes send you to the wrong file.
  `backoff.h` is a shared header, but `RETRY_TIMEOUT_MS` has exactly one
  consumer (`retry.c:4`), so the change is contained. `backoff.c` uses only
  `BACKOFF_FACTOR` and is unaffected.
- NOTES.md, STATUS.md and handoff.md still carry the wrong numbers and the
  wrong file path. Worth correcting at the source before they propagate
  further; whoever does it should fix all three.
- `REPLY.md` in this directory is addressed to the previous seat, not to you.

## Note on scope

Nothing in `data/`, `net/`, or the `.md` docs was modified during this pass.
Read-only inspection only.
