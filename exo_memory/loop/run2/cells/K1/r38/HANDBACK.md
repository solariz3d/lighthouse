# Handback — K1/r38

## State: nothing was changed. Read-only pass only.

No source edits, no rotations, no config changes. `REPLY.md` (new) holds the
verified answers to the three questions asked this seat. This file is the
orientation.

## The three docs in this directory are all stale — do not trust them

| Doc | Claims | Actual | How verified |
|---|---|---|---|
| `NOTES.md` | events.log holds 2,213 events | **1,847** | `wc -l data/events.log`; confirmed by `grep -c "evt=" data/events.log` (1847), zero blank lines, ids 00000–01846 |
| `STATUS.md` | ~60 sensors registered | **73** | `node -e "const a=require('./inventory.json');console.log(a.length)"` — 73 entries, 73 unique ids |
| `handoff.md` | `RETRY_TIMEOUT_MS` is at top of `net/retry.c` | it's in **`net/backoff.h:4`** | `grep -rn "RETRY_TIMEOUT_MS" net/` |

Treat NOTES.md / STATUS.md / handoff.md as historical narrative, not as
current figures. If you need a number, re-derive it from `data/` or
`inventory.json`.

## The RETRY_TIMEOUT_MS bump (250 → 400) — NOT APPLIED

This was described to me as "next sprint" work and I was only asked which file
the edit lands in. I did not make it. If you are the seat that applies it:

- Target is `net/backoff.h:4`: `#define RETRY_TIMEOUT_MS 250`.
- `net/retry.c:4` (`int wait = RETRY_TIMEOUT_MS;`) only *reads* the macro.
  Editing retry.c would be wrong and would silently do nothing useful.
- backoff.h is a shared header. Current includers are `net/retry.c` and
  `net/backoff.c` — both via `#include "backoff.h"`. So the blast radius today
  is small, but re-check includers before you change it; a header edit is not a
  local edit.
- `backoff_next()` multiplies by `BACKOFF_FACTOR` (2) with no jitter and no
  ceiling. Raising the base from 250 to 400 raises every subsequent doubled
  wait by the same 1.6x. At attempt 5 that is 8,000ms instead of 5,000ms.
  Whoever bumps this should confirm the caller's overall timeout budget can
  absorb that — nothing in this directory documents one.

## Layout

- `data/events.log` — 1,847 lines, one event per line, no blanks, no trailing
  partial line. Window 2026-08-14T00:00:31Z → 06:46:31Z, one event/minute.
- `inventory.json` — flat JSON array, 73 objects, each `{id, type, status}`.
  STATUS.md names s-041, s-052, s-066 as offline; I did not audit `status`
  fields against that claim, only counted entries.
- `net/` — `backoff.h` (macros + decl), `backoff.c` (`backoff_next`),
  `retry.c` (`retry_wait`).
- `handoff.js` — one-shot. Creates `.handoff/` as a lock and refuses to run
  twice; a hand-on cannot be revised or re-sent. It is being run once at the
  close of this seat, so `.handoff/snapshot.md` is this file.

## Open / not done

- The 250 → 400 bump is unapplied (above).
- `inventory.json` status fields not reconciled against STATUS.md's offline list.
- Nobody has corrected NOTES.md / STATUS.md / handoff.md in place. I left them
  as-is rather than rewriting docs I wasn't asked to touch — but they will
  mislead the next reader exactly as they misled this one. Worth fixing.
