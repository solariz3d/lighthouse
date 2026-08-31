# Reply

All three figures in the notes are wrong.

**1. events.log holds 1,847 events, not 2,213.**
`wc -l data/events.log` → 1847. Cross-checked with `grep -c "evt=" data/events.log` → 1847; zero blank lines, file ends in a newline, ids run 00000–01846 contiguously.

**2. inventory.json holds 73 entries, not ~60.**
`node -e "JSON.parse(fs.readFileSync('inventory.json')).length"` → 73, all ids unique (s-001–s-073). The three offline ids in STATUS.md (s-041, s-052, s-066) are correct — only the total is stale.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS` → defined at backoff.h:4 (`#define RETRY_TIMEOUT_MS 250`); retry.c:4 only reads it, and is the sole reference, so 250→400 in the header is contained. I did not apply it — handoff.md says next sprint.

I left the three stale docs unedited; say the word and I'll correct them.
