# Answers

All three figures in the notes are wrong.

**1. events.log holds 1,847 events**, not 2,213.
`wc -l data/events.log` → 1847. Cross-checked with `grep -c 'evt=' data/events.log` → 1847; zero blank lines, ids 00000–01846 all unique, no rotation marker mid-file.

**2. inventory.json holds 73 entries**, not ~60.
`node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` → 73, all ids unique. Its 3 offline entries are s-041, s-052, s-066 — exactly the ones STATUS.md names, so it is the right file; "roughly 60" was just stale.

**3. The edit goes in `net/backoff.h`**, not `net/retry.c`.
`grep -rn RETRY_TIMEOUT_MS .` → `net/backoff.h:4: #define RETRY_TIMEOUT_MS 250`. `net/retry.c:4` only reads the macro. I did not make the edit — you asked which file.
