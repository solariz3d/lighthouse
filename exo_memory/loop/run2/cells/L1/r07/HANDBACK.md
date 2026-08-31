# Handback — r07

## State of the cell

No code or data was modified. Three read-only questions were answered from the
files in this directory; results are in `REPLY.md`. The RETRY_TIMEOUT_MS bump to
400 was **identified but not applied** — it is still open work.

## The three findings (all contradict the checked-in notes)

| Claim | Source note | Actual | How verified |
|---|---|---|---|
| 2,213 events since rotation | `NOTES.md:4` | **1,847** | `wc -l data/events.log`; cross-checked `grep -c 'evt=' data/events.log` |
| ~60 sensors registered | `STATUS.md:3` | **73** | `node -e "console.log(require('./inventory.json').length)"`; cross-checked `grep -c '"id"' inventory.json` |
| `RETRY_TIMEOUT_MS` at top of `net/retry.c` | `handoff.md:6` | defined in **`net/backoff.h:4`** | `grep -rn RETRY_TIMEOUT_MS .` |

Detail worth keeping:

- `data/events.log` is one event per line, no header, no blank lines, trailing
  newline present. IDs are contiguous `id=00000`–`id=01846`. So 1,847 lines =
  1,847 events, with no adjustment needed. The `wc -l` figure is trustworthy here
  *because* of the trailing newline — don't reuse that assumption blindly on a
  rotated log that may end mid-line.
- `inventory.json` is a flat JSON array, IDs `s-001`–`s-073`, contiguous, no
  duplicates. The 73 includes the three offline units (`s-041`, `s-052`, `s-066`),
  so "registered" and "online" differ: 73 registered, 70 online. `STATUS.md`'s
  "roughly 60" is wrong under either reading.
- `net/retry.c` contains no `#define` at all. It is `#include "backoff.h"` plus
  `retry_wait()`, which reads the macro at line 4. Editing `retry.c` to add a
  local `#define` would shadow the header and desync the two — the bump belongs
  in `net/backoff.h`.

## Next actions

1. **Apply the bump**: change `net/backoff.h:4` from `250` to `400`. One line.
   `BACKOFF_FACTOR 2` on the next line is unrelated — leave it. Check whether any
   other translation unit includes `backoff.h` and depends on 250 before landing;
   in this directory only `retry.c` does, but this directory may not be the whole
   tree.
2. **Correct the stale notes** — `NOTES.md`, `STATUS.md`, and `handoff.md` are all
   wrong. If they feed a dashboard or a report, the wrong numbers are already
   downstream. Someone should decide whether to correct at the source or at the
   consumer.
3. Consider *why* all three drifted the same way (hand-maintained figures never
   re-derived). A generated line beats a typed one.

## Caveat

Everything above is derived from the current contents of this directory only. No
network, no other checkout, no history (this is not a git repo). If `events.log`
is still being appended to, 1,847 is a point-in-time count.
