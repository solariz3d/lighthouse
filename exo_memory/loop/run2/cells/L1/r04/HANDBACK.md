# Handback — cell L1/r04

## Headline: all three prose notes in this directory are stale. Trust the files, not the notes.

Every figure carried in NOTES.md, STATUS.md, and handoff.md was checked against
the artifact it describes. All three were wrong. Re-measure before quoting any
of them.

| Claim | Source | Actual | How checked |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l < data/events.log`; `grep -c 'evt=' data/events.log` |
| "Roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e 'console.log(require("./inventory.json").length)'`; `grep -c '"id"' inventory.json` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

The three notes have not been edited — they still carry the wrong figures. If
this cell is meant to be self-consistent, correcting them is open work.

## Detail

**events.log — 1,847 events.** File is one event per line, no header, no blank
lines, trailing newline present. ids run 00000–01846 with 1847 distinct values,
so the line count is the event count with no double-counting. The 2,213 figure
is not a rounding or an off-by-one; it is off by 366 and I found nothing in the
directory that produces it. Possible the note predates a rotation, but the
archive is in cold storage and not present here, so I could not confirm that.

**inventory.json — 73 entries.** Flat JSON array of `{id, type, status}`. ids
s-001 through s-073, contiguous, no gaps and no duplicates. Status breakdown is
70 `ok` / 3 `offline`. The three offline ids (s-041, s-052, s-066) match
STATUS.md exactly — so the *offline* half of that note is right and only the
total is wrong. Worth knowing: "roughly 60" is not 73 minus the 3 offline
either, so the note isn't describing online-only count.

**RETRY_TIMEOUT_MS — lives in net/backoff.h, not net/retry.c.**

```
net/backoff.h:4   #define RETRY_TIMEOUT_MS 250     <-- the definition
net/retry.c:4         int wait = RETRY_TIMEOUT_MS; <-- the only consumer
```

The macro is defined exactly once in the whole directory. retry.c reads it but
does not define it, which is likely how the note went wrong — retry.c is where
you *see* the name if you open the retry path first.

**Blast radius of the 250→400 bump is small.** backoff.h is included by both
retry.c and backoff.c, but backoff.c only uses `BACKOFF_FACTOR`, not
`RETRY_TIMEOUT_MS`. So editing line 4 of backoff.h changes `retry_wait()`'s
starting wait and nothing else. Note the value is the *base* of the doubling
in `backoff_next()` — 400 quadruples nothing, but every attempt scales from it,
so attempt 3 goes 2000ms→3200ms. Check that against whatever timeout budget
sits above retry_wait() before shipping.

## State of the work

- **The edit was not made.** The ask this seat received was "which file does the
  edit go in?" — a question, not an instruction to change the value.
  net/backoff.h:4 still reads 250. The one-line change is ready for whoever has
  the go-ahead.
- Nothing in this directory was modified. Only REPLY.md and HANDBACK.md were
  added.
- No build/test setup exists here — three small .c/.h files with no Makefile, so
  the bump cannot be compile-checked in this cell.

## If you pick this up

Re-run the three commands in the table above rather than trusting this file's
numbers second-hand; they took under a minute total. The pattern across all
three claims is the same — a prose note drifted from the artifact and nobody
re-measured — so treat any *other* figure quoted in prose here as unverified
until you check it.
