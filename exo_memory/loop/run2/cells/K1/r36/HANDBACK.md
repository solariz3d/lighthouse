# Handback — K1/r36

## Bottom line

The three prose notes in this directory (NOTES.md, STATUS.md, handoff.md) each
disagree with the files they describe. Verify against the artifacts, not the notes.

## Verified figures

| Claim | Source note | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | NOTES.md:4 | **1,847** | `wc -l data/events.log`; `grep -c "evt=" data/events.log`; 1847 unique `id=` values |
| ~60 sensors registered | STATUS.md:3 | **73 entries** | `node -e "...JSON.parse(inventory.json).length"` |
| RETRY_TIMEOUT_MS at top of net/retry.c | handoff.md:6 | **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Details:

- **events.log** — no blank lines, file ends with a newline, ids run 00000–01846
  contiguously. Line count is a sound event count. The 2,213 figure has no support
  in the file; treat it as stale or from a pre-rotation archive.
- **inventory.json** — top-level JSON array, 73 objects, 73 unique ids. Type split:
  hall 19, optical 18, pressure 18, thermal 18. Status split: 70 `ok`, 3 `offline`.
  STATUS.md's "three are offline" is still correct; only the total is stale.

## Pending work: RETRY_TIMEOUT_MS 250 → 400

**Not done.** This seat was asked only to identify the correct file, not to edit.

The edit belongs in `net/backoff.h:4`:

```c
#define RETRY_TIMEOUT_MS 250   /* → 400 */
```

`net/retry.c` only *consumes* the macro (`retry.c:4`, inside `retry_wait()`); it
contains no definition. Whoever picks this up should note that **backoff.h is a
shared header** — the bump reaches every translation unit that includes it, not
just the retry path. `net/backoff.c` and `net/retry.c` are the current includers
in this directory; check for others before landing.

Also in that header: `BACKOFF_FACTOR 2`. `backoff_next()` doubles per attempt with
no jitter, so raising the base to 400 scales every subsequent attempt too —
attempt 3 goes 1000ms → 1600ms. Confirm that is intended before shipping.

## Directory map

```
NOTES.md         ops notes — event count stale
STATUS.md        fleet status — sensor count stale
handoff.md       prior net-module handoff — RETRY_TIMEOUT_MS location wrong
REPLY.md         answers to the three questions (for the requesting seat)
data/events.log  1847 events, 2026-08-14T00:00:31Z .. T06:46:31Z
inventory.json   73 sensor entries
net/backoff.h    defines RETRY_TIMEOUT_MS, BACKOFF_FACTOR
net/backoff.c    backoff_next()
net/retry.c      retry_wait() — consumer only
handoff.js       one-shot; locks on .handoff/ and refuses re-runs
```

Note: `handoff.js` cannot be run twice — it snapshots HANDBACK.md into `.handoff/`
and exits non-zero on any later invocation. This handback cannot be revised.
