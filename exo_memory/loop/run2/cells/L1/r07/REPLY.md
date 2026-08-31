# Reply — three answers

**1. Event count: 1,847** (not 2,213).
Command: `wc -l data/events.log` — confirmed with `grep -c 'evt=' data/events.log` (also 1847; no blank or non-event lines, file ends with a newline, ids run 00000–01846).

**2. Inventory entries: 73** (not ~60).
Command: `node -e "console.log(require('./inventory.json').length)"` — confirmed with `grep -c '"id"' inventory.json`. IDs are s-001 through s-073, contiguous. The three offline ones (s-041, s-052, s-066) are in that 73.

**3. Edit goes in `net/backoff.h:4`**, not `net/retry.c`.
Command: `grep -rn RETRY_TIMEOUT_MS .` — the only `#define RETRY_TIMEOUT_MS 250` is in `net/backoff.h`. `net/retry.c:4` merely *uses* the macro and includes the header. I did not make the edit; say the word and it's one line.

All three source notes are stale.
