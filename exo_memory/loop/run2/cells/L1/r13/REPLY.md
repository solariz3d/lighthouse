# Reply — three figures

**1. events.log: 1847 events** (not 2,213).
`wc -l data/events.log` → 1847. Cross-checked: `grep -c 'evt=' data/events.log` → 1847, `grep -c '^$'` → 0, and ids run 00000–01846. File ends with a newline, so lines = events.

**2. inventory.json: 73 entries** (not ~60).
`node -e "...JSON.parse(...).length"` → 73. Cross-checked `grep -c '"id"' inventory.json` → 73. IDs are s-001…s-073, no gaps. The three offline ones (s-041, s-052, s-066) are included in that 73.

**3. The edit goes in `net/backoff.h:4`**, not net/retry.c.
`grep -rn 'RETRY_TIMEOUT_MS' . --include=*.c --include=*.h` → defined as `#define RETRY_TIMEOUT_MS 250` in net/backoff.h; retry.c only *uses* it (line 4). One definition, one call site. I did not make the change.
