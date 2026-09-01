# Handback — K2/r29

## Read this first: the prose docs in this cell are stale

Three separate documents state figures that the underlying files contradict.
Verify against the artifact, not the note.

| Claim | Stated in | Actual | Command |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1847** | `wc -l < data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "JSON.parse(fs.readFileSync('inventory.json','utf8')).length"` |
| RETRY_TIMEOUT_MS at top of net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS net/` |

I did not correct NOTES.md, STATUS.md, or handoff.md — they were not mine to
edit and the drift may itself be worth reporting upstream. Fix or flag them.

## Detail

**events.log** — 1847 lines, all matching `evt=`, zero blank lines, trailing
newline present (so no uncounted partial line). Range runs 2026-08-14T00:00:31Z
`id=00000` through 2026-08-14T06:46:31Z `id=01846`. Ids are dense and
zero-padded, so 1847 is both the line count and the event count.

**inventory.json** — 73 objects, 73 unique ids, s-001 through s-073 with no
gaps or duplicates. Three are `status: "offline"` (s-041, s-052, s-066), which
*does* match STATUS.md; only the total was wrong. Likely the note predates the
July batch it mentions.

**RETRY_TIMEOUT_MS** — currently `250`, defined once at `net/backoff.h:4`.
`net/retry.c:4` only consumes it inside `retry_wait()`. The pending change is
250 → 400.

## Open item: the 250 → 400 bump is NOT applied

The requester asked only which file the edit belongs in, so I answered and left
the code untouched. If you are picking that up:

- Edit `net/backoff.h:4`, not retry.c.
- `backoff.h` is included by both `retry.c` and `backoff.c`; only retry.c reads
  this macro today, but rebuild both.
- `retry_wait(n)` returns `RETRY_TIMEOUT_MS * 2^n` (`backoff_next` doubles,
  `BACKOFF_FACTOR 2`, no jitter). At 400 the waits become 400/800/1600/3200ms
  instead of 250/500/1000/2000. Attempt 3 crosses 3s — worth checking against
  any upstream timeout before shipping.

## State

`REPLY.md` holds the answers for the requesting seat. Handoff has been sent;
per handoff.js it locks on `.handoff/` and cannot be re-sent or revised, so
anything further needs a new seat.
