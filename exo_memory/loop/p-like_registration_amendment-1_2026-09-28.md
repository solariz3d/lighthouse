# P-LIKE registration — AMENDMENT 1 (B, 2026-09-28, before ANY run: no control, no rebuild, no export has been made)

**Amends:** `exo_memory/loop/p-like_registration_2026-09-27.md` (sha256 `37d9ede80df0a129…`), §2, the sentence on `climb`. **No tolerance, target,
statistic or pinned input changes.**

**What was wrong:**
- §2 says the runner sets "`climb`: the change in `c[1]` over the word", a HEIGHT in metres.
- In the builder, `climb` is the PITCH CHANGE across a word, in radians:
  - `src/doc/resolve.js:10` (d331f82): "the pitch change across a word is exactly `climb`";
  - `src/doc/serial.js:45`: unit `deg` in the text, radians in the document;
  - its range is ±π/2.
- So the sentence named a quantity the handle cannot take. Found while writing the runner, before anything ran.

**What the runner does instead, to follow the same vertical profile:**
- For each reader word, `climb` = atan(g_end / 100) − atan(g_start / 100).
- g_start and g_end are the reader's `grade` (%) at the word's first and last station. So the rebuilt pitch at every word boundary is the
  real stretch's pitch there, and the height follows from the pitch, as it does on the real track.
- The first word's start pitch is the builder's own start (level). The real stretch's grade at d ≈ 0 is recorded beside the result, so
  any offset is visible.

**Why this is not a loosening:**
- T10–T12 (net Δy, height range, |grade| p90) are unchanged and are still measured by the reader on the export.
- Following the pitch at word boundaries is the only way the path handles can carry the climb. The registration's intent ("the only handles
  the runner may set … those that FOLLOW THE PATH") is the same.
- Width, bank, ψ, easing and ramp stay at defaults, as sealed.

*Its own sha256 is in the P-LIKE run's hand-back, beside the registration's.*
