# Reply

All three figures are off. Checked against the files, not the notes.

**1. events.log holds 1847 events** — not 2,213.
`wc -l data/events.log` → 1847. Every line is an event: `grep -c 'evt=' data/events.log` → 1847, `grep -c '^$'` → 0, and the file ends in a newline, so nothing uncounted.

**2. inventory.json holds 73 entries** — not ~60.
`node -e "const a=require('./inventory.json'); console.log(a.length, new Set(a.map(x=>x.id)).size)"` → 73 entries, 73 unique ids. No duplicates inflating it.

**3. The edit goes in `net/backoff.h:4`** — not net/retry.c.
`rg -n RETRY_TIMEOUT_MS .` → `#define RETRY_TIMEOUT_MS 250` is in net/backoff.h. retry.c only reads it. backoff.h is shared, so the bump hits every includer — here, only retry.c.

I did not make the 250→400 edit; you asked which file.
