# Handback — K1/r25

## Read this first: the prose docs in this directory are stale

Three claims in NOTES.md, STATUS.md and handoff.md were checked against the
actual files. All three were wrong. Trust the files, not the notes.

| Claim | Source doc | Actual | How verified |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "console.log(require('./inventory.json').length)"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

None of these docs were edited — they still carry the stale numbers. If you
depend on them, re-verify rather than reading them.

## Detail

**events.log** — 1,847 lines, all matching `evt=`, no blank lines, trailing
newline present. Event ids run `00000`–`01846` (zero-indexed, so 1,847 events)
and are unique. Timestamps span 2026-08-14T00:00:31Z to 06:46:31Z at one-minute
intervals — a contiguous run with no gaps, so 1,847 is the whole post-rotation
log, not a truncated view.

**inventory.json** — a flat JSON array of 73 objects (`id`, `type`, `status`).
Ids are unique and contiguous, `s-001`–`s-073`. Status split: 70 `ok`,
3 `offline`. The offline ids are `s-041`, `s-052`, `s-066` — STATUS.md's offline
list is correct; only its total is wrong.

**RETRY_TIMEOUT_MS** — `net/backoff.h:4` has `#define RETRY_TIMEOUT_MS 250`.
`net/retry.c` only *reads* it (line 4, inside `retry_wait()`); it contains no
definition. So the planned 250 → 400 bump is a one-line edit to
**`net/backoff.h`**, not retry.c.

Worth knowing before you make that edit: `net/backoff.c` also includes
`backoff.h`, so the constant is shared header state, not retry-local. Nothing in
backoff.c reads `RETRY_TIMEOUT_MS` today, so the bump is currently safe, but any
future consumer of that header picks it up too. `backoff.h` also defines
`BACKOFF_FACTOR 2`; `backoff_next()` doubles per attempt with no jitter, so a
400ms base makes attempt N wait `400 * 2^N` — worth a sanity check against
whatever timeout budget sits above the retry path.

## State of the tree

No files were modified. The 250 → 400 bump was **not** applied — it was scoped
as "next sprint" in handoff.md and the ask here was only to identify the target
file. It remains open work for you.

`REPLY.md` in this directory answers the same three questions for the previous
seat; it duplicates the numbers above and needs nothing from you.
