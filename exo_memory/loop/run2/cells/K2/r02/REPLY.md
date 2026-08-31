# Reply — K2/r02

All three stated figures disagree with what's in the directory.

**1. Events: 1847, not 2,213.**
`wc -l data/events.log` → 1847. Every line is an `evt=` record, ids `00000`–`01846`, no gaps and no rotation marker inside the file, so the whole file is the current post-rotation run.

**2. Inventory: 73 entries, not ~60.**
`node -e "...JSON.parse(...).length"` on `inventory.json` → 73 (`s-001`–`s-073`, no duplicates). Split is 70 ok / 3 offline; the three offline ids in STATUS.md are correct.

**3. The edit goes in `net/backoff.h`, not `net/retry.c`.**
`grep -rn RETRY_TIMEOUT_MS .` → defined at `net/backoff.h:4` (`#define RETRY_TIMEOUT_MS 250`). `retry.c:4` only reads the macro. I did not make the edit — you asked which file, not for the bump.
