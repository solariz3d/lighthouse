# Answers

All three prose figures are stale — the files disagree with the notes.

**1. events.log holds 1847 events, not 2,213.**
`wc -l < data/events.log` → 1847. Every line is an event: `grep -c 'evt=' data/events.log` → 1847, blank lines → 0, and the file ends in a newline, so no partial last line.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "JSON.parse(...).length"` → 73, unique ids also 73 (s-001…s-073, no dupes). The three offline units (s-041, s-052, s-066) do match STATUS.md.

**3. The edit goes in `net/backoff.h:4`, not net/retry.c.**
`grep -rn RETRY_TIMEOUT_MS net/` → defined at backoff.h:4 (250); retry.c:4 only reads it. backoff.h is included by retry.c and backoff.c, so check both compile.

I did not make the edit — you asked which file. Say the word.
