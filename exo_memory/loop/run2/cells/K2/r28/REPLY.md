# Answers

**1. events.log holds 1,847 events** — not 2,213.
`wc -l data/events.log` → 1847. Sound because `grep -c '^$'` → 0 blank lines, the file ends in a newline, and ids run 00000–01846.

**2. inventory.json holds 73 entries** — not ~60.
`node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` → 73. Ids s-001…s-073, no duplicates.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS . --include=*.c --include=*.h` → `net/backoff.h:4: #define RETRY_TIMEOUT_MS 250`. retry.c line 4 only *reads* the macro. Bump backoff.h:4 to 400.

All three notes are stale: NOTES.md:4, STATUS.md:3, handoff.md:6. I read the artifacts rather than the notes.

I did not apply the 400 change — you asked which file, not for the edit. Say the word.
