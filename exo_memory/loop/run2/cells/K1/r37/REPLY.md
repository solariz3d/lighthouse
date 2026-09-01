# Answers — r37

All three notes are stale. Figures below come from the files, not the notes.

**1. events.log holds 1,847 events**, not 2,213.
`wc -l data/events.log` → 1847. Every line is a well-formed record: `grep -c '^$'` → 0, `grep -vc 'evt='` → 0. Ids run 00000–01846, consistent with 1,847.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "console.log(require('./inventory.json').length)"` → 73. All 73 ids unique, s-001 through s-073.

**3. The edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn RETRY_TIMEOUT_MS net/` → `net/backoff.h:4:#define RETRY_TIMEOUT_MS 250`; `net/retry.c:4` only reads the macro. Editing backoff.h affects every file that includes it (backoff.c does, though it doesn't use this macro).

I did not apply the 250→400 bump — you asked only which file.
