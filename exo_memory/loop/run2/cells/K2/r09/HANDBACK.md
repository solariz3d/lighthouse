# Handback — K2/r09

## Read this first: the checked-in notes are stale

Three figures in this directory's notes were verified against the actual
files and all three are wrong. The notes have **not** been corrected — only
this handback and REPLY.md carry the true values. Trust the files.

| Claim | Where it's written | Reality |
|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1847** events in `data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** entries in `inventory.json` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | Defined in **`net/backoff.h:4`** |

How each was checked:

- `wc -l data/events.log` → 1847. All 1847 lines carry `evt=`, zero blank
  lines, file terminates with a newline — so 1847 lines = 1847 events.
- `node -e "const a=require('./inventory.json'); console.log(a.length, new Set(a.map(x=>x.id)).size)"`
  → 73 entries, 73 unique ids. The gap vs. "~60" is real growth, not dupes.
- `rg -n RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` is in
  `net/backoff.h`; `net/retry.c:4` only consumes it via `#include "backoff.h"`.

## Open work

- **RETRY_TIMEOUT_MS 250 → 400 is NOT applied.** It was scoped as a question
  ("which file?"), not as an edit. The one-line change goes in
  `net/backoff.h:4`. Note that `backoff.h` is a shared header: the bump
  reaches every translation unit that includes it. In this tree that is only
  `net/retry.c`, so the blast radius is currently nil — re-check if more
  files start including it.
- **STATUS.md's three offline sensors (s-041, s-052, s-066) were not
  re-verified.** `inventory.json` carries a `status` field per entry; I only
  counted entries and did not audit status values against that claim. If the
  gateway-swap status matters to you, check it directly.
- NOTES.md, STATUS.md, and handoff.md still contain the wrong numbers. If
  anyone downstream reads them without this handback, they will be misled.
  Correcting them was outside what was asked.

## Why the notes drifted

Each stale figure is plausible-looking and was written from memory or an
earlier snapshot, so it survives a skim. `handoff.md:6` is the riskiest of
the three: it names a real file that really uses the constant, so a search
for "retry" lands somewhere convincing but wrong. Grep for the definition,
not the usage.
