# Reply

All three notes disagree with the files. The files win.

1. **events.log holds 1847 events**, not 2,213. `wc -l data/events.log` → 1847; no blank lines, ids run 00000–01846, and `grep -c 'evt=' data/events.log` agrees.

2. **inventory.json holds 73 entries**, not ~60. `node -e "const a=require('./inventory.json');console.log(a.length)"` → 73, all ids unique (s-001…s-073). `grep -c '"id"' inventory.json` agrees. Three are offline (s-041, s-052, s-066), matching STATUS.md.

3. **The edit goes in `net/backoff.h:4`**, not net/retry.c. `grep -rn RETRY_TIMEOUT_MS .` → the `#define RETRY_TIMEOUT_MS 250` is in backoff.h; retry.c:4 only reads it. backoff.h is shared, so 250→400 hits every includer (currently only retry.c).

I did not make the 400 edit — you asked only which file.
