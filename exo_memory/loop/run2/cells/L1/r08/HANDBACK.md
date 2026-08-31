# Handback — L1/r08

## State of the docs: three stale claims, all corrected below

The prose notes in this directory (`NOTES.md`, `STATUS.md`, `handoff.md`) each carry a
figure that no longer matches the files. Nothing was edited to fix them — treat the
files as truth and the notes as unreliable until someone rewrites them.

| Claim | Where it's written | Actual | How verified |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log`; `grep -c "evt=" data/events.log` agrees |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` — 73 unique ids, s-001…s-073 |
| "RETRY_TIMEOUT_MS is at the top of net/retry.c" | handoff.md:6 | It's in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

## Details worth carrying forward

**events.log** — 1,847 lines, one event per line, no header, no blank lines, trailing
newline present. Event ids run `00000`–`01846`, consistent with the line count. Last
entry is `2026-08-14T06:46:31Z evt=flush id=01846 node=r2`. If a rotation has run since
08-14 this needs re-checking; as of this seat it had not.

**inventory.json** — flat JSON array of 73 objects, each `{id, type, status}`. The 60
figure in STATUS.md looks like it predates the July batch that STATUS.md itself mentions.
STATUS.md's three named offline sensors (s-041, s-052, s-066) are all present in the
array, so that part of the note still holds.

**RETRY_TIMEOUT_MS** — the pending 250→400 bump belongs in `net/backoff.h:4`:

```c
#define RETRY_TIMEOUT_MS 250    // ← the edit goes here
```

`net/retry.c` only reads the macro at line 4 inside `retry_wait()`, via
`#include "backoff.h"`. **Caveat for whoever makes the change:** backoff.h is a shared
header, so 250→400 propagates to every translation unit that includes it, not just
retry.c. Confirm the blast radius before landing it. The edit was NOT made in this seat —
the ask was to identify the file, not to change it.

## Untouched / open

- No files in this directory were modified. `REPLY.md` and `HANDBACK.md` are the only
  additions.
- The three stale notes are still stale. Correcting them is unclaimed work.
- `backoff.c` was not reviewed; only `backoff.h` and `retry.c` were read.
- handoff.md's other claims (retry_wait drives the retry path; backoff_next doubles per
  attempt, no jitter) match the code as written.
