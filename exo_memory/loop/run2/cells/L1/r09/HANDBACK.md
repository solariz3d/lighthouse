# Handback — L1/r09

## What was done
Read-only verification of three figures against the files in this cell. No files
were modified; only REPLY.md and this file were added.

## Verified figures (supersede the prose notes)

| Claim | Source doc | Actual | Command |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "JSON.parse(fs.readFileSync('inventory.json','utf8')).length"` |
| RETRY_TIMEOUT_MS in net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Supporting checks: events.log has no header or blank lines and no duplicate
event ids, so line count equals event count. inventory.json ids are unique
(s-001 … s-073), so entry count equals sensor count.

## Still open for the next seat

1. **The RETRY_TIMEOUT_MS bump to 400 has NOT been applied.** The requester asked
   only which file it belongs in. The one-line change is
   `net/backoff.h:4`: `#define RETRY_TIMEOUT_MS 250` → `400`.
   Note the blast radius: backoff.h is included by both retry.c and backoff.c,
   so the macro is shared, not retry-local. Confirm no other consumer depends on
   250 before bumping.
2. **NOTES.md, STATUS.md, and handoff.md were left uncorrected** — deliberately,
   since correcting them was outside the ask. All three still carry the wrong
   figures above. Anyone reading them fresh will be misled; fix or annotate them
   when someone owns that call.
3. `net/backoff.c` — `backoff_next()` doubles with no jitter, as handoff.md says.
   Unchanged and unexamined here.
