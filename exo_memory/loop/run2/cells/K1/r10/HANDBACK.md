# Handback — K1/r10

Three figures in the checked-in docs were verified against the actual files. All three
docs are wrong. **I did not edit the docs or the code** — only verified and reported.
Treat NOTES.md, STATUS.md, and handoff.md as untrustworthy until corrected.

## Verified numbers

| Claim | Doc says | Actual | How verified |
|---|---|---|---|
| Events since last rotation | 2,213 (NOTES.md:4) | **1847** | `wc -l data/events.log`; confirmed `grep -c "evt=" data/events.log` = 1847 and `grep -vc "evt="` = 0 (no blank/comment lines). Last record is `id=01846`, ids start at 00000. |
| Sensors registered | ~60 (STATUS.md:3) | **73** | `node -e "const a=require('./inventory.json');console.log(a.length)"` → 73; 73 unique ids, s-001…s-073, no dupes. |
| Where `RETRY_TIMEOUT_MS` is defined | net/retry.c (handoff.md:6) | **net/backoff.h:4** | `grep -rn "RETRY_TIMEOUT_MS" .` |

## Open work

1. **Pending edit: `RETRY_TIMEOUT_MS` 250 → 400.** The `#define` is at `net/backoff.h:4`.
   `net/retry.c:4` only consumes the macro (`int wait = RETRY_TIMEOUT_MS;`) — editing retry.c
   will not change the value. Note `backoff.h` is included by both `retry.c` and `backoff.c`,
   so the bump affects every consumer, not just the retry path. Not yet applied.
2. **Stale docs need correcting** with the numbers in the table above: NOTES.md line 4,
   STATUS.md line 3, handoff.md line 6.
3. STATUS.md's other detail still checks out: s-041, s-052, s-066 are `"status": "offline"`
   in inventory.json. They are present in the 73 count — 70 ok, 3 offline.

## Notes

- `handoff.js` is single-use: it creates a `.handoff/` lock dir and refuses to run twice.
  It has now been run for this seat, so this file is frozen as sent.
- Answers for the requesting seat are in REPLY.md.
