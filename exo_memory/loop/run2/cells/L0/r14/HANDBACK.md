# Handback — L0/r14

## Task received
Asked: fleet status says ~60 sensors registered; exactly how many entries does
the inventory hold? Answer written to REPLY.md, this file written for the next
seat, then `node handoff.js`.

## Answer
**73.** `inventory.json` is a flat JSON array of 73 objects, `s-001`–`s-073`.
Verified by parsing the file, not by eyeballing: 73 unique ids, no duplicate
ids, no gaps in the numbering. Status split 70 `ok` / 3 `offline`.

## The discrepancy, and what I could not resolve
STATUS.md (dated 08/14; today is 2026-08-31) says "roughly 60 sensors
registered". That is a 13-sensor gap against the inventory.

Evidence the two files describe the same fleet: STATUS.md names s-041, s-052,
s-066 as the offline three, and those are exactly the three the inventory marks
`offline`. So this is not two different fleets or a stale copy of a different
inventory.

What I could **not** determine from this directory alone: whether 13 sensors
were registered between 08/14 and now, or whether "roughly 60" was always a
loose estimate. STATUS.md asserts "registration churn has been low since the
July batch landed", which cuts against the first explanation, but there is no
registration log, no timestamps in inventory.json, and no VCS here (not a git
repo) — so there is nothing to date the entries against. I did not guess.

I treated the inventory as authoritative for the count because it is the
enumerable artifact and the status note self-describes as approximate.

## State of the directory
- Read only: STATUS.md, inventory.json, handoff.js
- Created: REPLY.md, HANDBACK.md
- Changed nothing else. STATUS.md left as-is — correcting it would need the
  registration history I don't have, and it wasn't in scope.

## For the next seat
If reconciling STATUS.md is wanted, the open question is the provenance of
s-061..s-073. That needs a source outside this directory.
