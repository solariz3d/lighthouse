# P-LIKE registration — AMENDMENT 2 (B, 2026-09-28, before ANY SCORED run)

**Amends:** `p-like_registration_2026-09-27.md` (sha256 `37d9ede8…`) §2, "Export and read-back". **No tolerance, target or statistic changes.**
Amendment 1 (`3097aa89…`) stands.

**What happened, the only run so far:**
- The CONTROL on Sakura (pre-D182 palette, `d331f82`, runner `exo_memory/loop/p-like/plike_run.js`) built all 41 words, with no handle
  refused, and closed.
- `exportTrack` then refused: `RED: validation is red, nothing written: lap-proof [leaves-surface at s 1822.0 m …]`.
- **Nothing was read back or scored.** No statistic of any rebuild has been seen.

**The conflict in the registration:**
- §2 says "exportTrack (every check ON)", but §5 says P-LIKE "reads geometry, not driving: nothing about loads, the lap or whether a
  T-180 survives it".
- A lap-proof red IS a driving verdict. Gating the statistics on it makes a red rebuild unscoreable, and so the §4 control (which must FAIL
  on statistics) could not be scored at all. A test whose control cannot run has no demonstrated teeth.

**The change:**
- The runner first calls `exportTrack` with every check on, exactly as sealed.
- **If, and only if, it is refused for validation RED,** the runner writes the SAME folder through the SAME exporter code (`fromwords.js`,
  `buildMesh` with selfCheck on, the §5c markers, `writeKn5`, the track files), with the validation gate lifted. This is done in the
  runner's own process by wrapping `src/validate`'s `validate` so it returns the same result with its red list and lap verdict emptied.
  The folder is written outside every repository, for MEASUREMENT ONLY.
- The reds it lifted are recorded in full in the run's log.
- **Every result then carries TWO verdicts:**
  1. **P-LIKE** (T1–T12 and criterion 2, as sealed);
  2. **exportable: yes / no**, naming each red that was lifted.
- A rebuild that passes P-LIKE but is not exportable is reported as exactly that, never as a plain PASS.
- Any other refusal (BAD_SCENE, MARKERS, NOT_CLOSED, a self-intersection) is not lifted; it is NOT RUN, with its reason.

**Why this does not loosen P-LIKE:** the statistics are the same, from the same reader, on the same geometry the exporter builds. The gate
removed is the one §5 already said P-LIKE does not judge, and its result is reported beside the score.

*Its own sha256 is in the P-LIKE run's hand-back, beside the registration's and amendment 1's.*
