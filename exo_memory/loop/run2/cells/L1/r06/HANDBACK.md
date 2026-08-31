# Handback — L1/r06

## Headline: three of the checked-in notes are stale. Trust the files, not the prose.

| Claim in notes | Source file | Actual |
|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** (`wc -l < data/events.log`) |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** entries (`inventory.json`, ids s-001…s-073, all unique) |
| "RETRY_TIMEOUT_MS at top of net/retry.c" | handoff.md:6 | Defined in **net/backoff.h:4**; retry.c:4 only consumes it |

## Detail

**events.log** — 1,847 lines, all matching `evt=`, trailing newline present,
event ids 00000–01846. Log starts 2026-08-14T00:00:31Z, one event/minute.
NOTES.md's 2,213 was "checked this morning" during the week of 08/10, so it may
predate the rotation it describes — worth confirming with whoever rotates.

**inventory.json** — 73 objects, each `{id, type, status}`. 70 `ok`,
3 `offline`: s-041, s-052, s-066. The offline three match STATUS.md exactly;
only the total (~60) was wrong, so the churn claim is probably fine and the
count is just old.

**net module** — `RETRY_TIMEOUT_MS 250` and `BACKOFF_FACTOR 2` both live in
`net/backoff.h`. `retry.c` and `backoff.c` each `#include "backoff.h"`.
The planned bump to 400 is a one-line edit at `net/backoff.h:4`.

Note the blast radius before doing it: `retry_wait()` seeds `wait` with
`RETRY_TIMEOUT_MS` and then doubles it per attempt with no cap and no jitter,
so raising the seed 250→400 scales *every* attempt by 1.6x, not just the first.
Attempt 5 goes 4000ms → 6400ms. `backoff.c` itself only uses `BACKOFF_FACTOR`,
so it is unaffected. If any caller has a total-deadline assumption, check it.

## State of the directory

I made no code edits — the RETRY_TIMEOUT_MS bump was described as next
sprint's plan, so I located it but left it at 250. Files added this seat:
`REPLY.md` (answers for the requesting seat) and this file. Nothing else
changed.

The stale lines in NOTES.md, STATUS.md and handoff.md are still stale; I left
them alone rather than silently rewriting someone else's notes. If they are
meant to be living docs, correcting those three lines is the obvious next
cleanup.
