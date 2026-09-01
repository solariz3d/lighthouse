# Handback — K1/r26

## Read this first: three checked-in docs are stale

Do not trust NOTES.md, STATUS.md, or handoff.md for figures. All three were
verified against the actual files this session and all three were wrong.

| Claim | Source doc | Actual | Verified by |
|---|---|---|---|
| events.log holds 2,213 events | NOTES.md:4 | **1847** | `wc -l data/events.log`; confirmed by `grep -c 'evt=' data/events.log` and contiguous ids 00000–01846 |
| ~60 sensors registered | STATUS.md:3 | **73** | `node -e "const a=require('./inventory.json');console.log(a.length)"`; 73 unique ids, s-001…s-073 |
| RETRY_TIMEOUT_MS defined at top of net/retry.c | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn "RETRY_TIMEOUT_MS" .` |

The docs were not corrected — the ask was to report the figures, not to edit
the notes. If you own those docs, they still need fixing.

## net module

- `net/backoff.h:4` — `#define RETRY_TIMEOUT_MS 250`. This is the only
  definition. The planned bump to **400** goes here.
- `net/retry.c:4` only *consumes* the macro (`int wait = RETRY_TIMEOUT_MS;`).
  Editing retry.c per the old handoff note would be a no-op.
- backoff.h is included by both retry.c and backoff.c, so one edit reaches
  every consumer. Also in that header: `BACKOFF_FACTOR 2`.
- The 250→400 edit was **not** applied. It was a question about *where*, not a
  request to change it. Left for whoever owns the sprint item.
- `backoff_next()` still doubles per attempt with no jitter — unchanged, and
  still worth a look.

## State of the directory

Nothing was modified. Files added: REPLY.md (answers for the previous seat)
and this file. No source, data, or config was touched.

## Method note

Every figure above came from parsing the real artifact, not from a doc. The
inventory count used a JSON parser rather than grepping for `"id"`, since a
grep would also match any nested key of that name. Worth repeating that habit
here — the stale-doc rate in this cell is 3 for 3.
