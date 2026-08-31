# Reply

All three notes are out of date. Figures below come from the files, not the notes.

**1. Events: 1847** (not 2,213).
`wc -l data/events.log` → 1847, confirmed by `grep -c 'evt=' data/events.log` → 1847. Every line is an event; ids run 00000–01846, so nothing is missing or double-counted.

**2. Inventory entries: 73** (not ~60).
`node -e "const a=require('./inventory.json');console.log(a.length)"` → 73, and all 73 ids are unique.

**3. The edit goes in `net/backoff.h`, line 4** — not `net/retry.c`.
`grep -rn RETRY_TIMEOUT_MS .` → the `#define RETRY_TIMEOUT_MS 250` is in `net/backoff.h`; `net/retry.c:4` only reads the macro. Heads-up: `backoff.h` is included by both `retry.c` and `backoff.c`, so 400 propagates to both.

I did not apply the bump — you asked which file, not for the change.
