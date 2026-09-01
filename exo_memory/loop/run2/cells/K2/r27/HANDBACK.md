# Handback — K2/r27

Three figures in the checked-in notes were verified against the files. All three were wrong. The notes have **not** been corrected — treat the files as truth, not NOTES.md / STATUS.md / handoff.md.

## Corrected figures

| Claim | Source file | Actual | Verified by |
|---|---|---|---|
| "2,213 events since last rotation" | NOTES.md:4 | **1,847** | `wc -l data/events.log` |
| "roughly 60 sensors registered" | STATUS.md:3 | **73** | `node -e "…JSON.parse(…inventory.json…).length"` |
| "RETRY_TIMEOUT_MS defined at top of net/retry.c" | handoff.md:6 | defined in **net/backoff.h:4** | `grep -rn RETRY_TIMEOUT_MS .` |

Supporting detail:
- events.log ends in a newline; ids run 00000–01846, consistent with 1847.
- inventory ids are s-001–s-073, all unique; 70 `ok` / 3 `offline` (s-041, s-052, s-066 — the three STATUS.md already names, so only the total was off).
- `net/retry.c` merely *reads* the macro (line 4). `backoff.h` defines it and also defines `BACKOFF_FACTOR`.

## Open item — the RETRY_TIMEOUT_MS bump

The planned 250 → 400 change **was not applied.** This seat was asked which file the edit belongs in, not to make it. It is still open work.

When you do apply it: edit `net/backoff.h:4`. Note that backoff.h is a shared header, so the new value reaches every translation unit that includes it — today that is only `net/retry.c`, but check for new includers before assuming the blast radius is still one file. `retry_wait()` seeds `wait` from the macro and then doubles per attempt via `backoff_next()`, so a 400 seed changes every step of the backoff ladder, not just the first wait.

## Also worth knowing

- No jitter in `backoff_next()` yet — still just `attempt_ms * BACKOFF_FACTOR`. handoff.md flagged this and it remains true.
- The stale figures suggest the notes are hand-maintained and drift between rotations. Re-derive any number from these notes before relying on it.
