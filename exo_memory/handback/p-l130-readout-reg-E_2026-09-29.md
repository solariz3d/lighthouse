# L130 · the readout check, REGISTERED before C builds (pane E, on L) · 2026-09-29 01:4x

**SEALED:** `exo_memory/loop/readout_check_registration_2026-09-29.md`,
**sha256 `57448e2af8eb1670f45f96a0c54f0602254877b069bd34e188169b43e571f961`**, at 2026-09-29 01:47:37 local.

**It predates any display code** (checked at the seal):
- `src/core` holds no `readout.js` (`ls src/core`);
- no file in `app/` or `src/` names `pieceReadout` or `labels()` (`grep -rln`).

**Nothing committed. No code written. No AC launch.**

## What it registers (the file is the master; this is the index)

- **G, THE GOVERNING CHECK, verbatim from the plan:** "if the keeper still cannot tell a piece's degrees while adjusting, the
  display failed whatever the tests say."
  - The tests are necessary, never sufficient.
  - His first words on using the landed build are recorded verbatim, and a "no" fails L130's readout at 100% on everything else.
  - Until he speaks, every report says **UNVERIFIED BY ITS GOVERNING CHECK**.
- **M1 MATCH:** every DISPLAYED number, parsed from the drawn text (never C's internal state), is within 0.05 of A's
  `pieceReadout`: "to 0.1°/0.1 m" read as the display rounding A's value. Signs match, and units are shown. It covers 43 placed
  pieces and 12 fixed Extend sets. The sets include the sign, a 720° turn with no wrap, both sides of the 0.05 rounding, and
  near-vertical bank.
- **M2 LIVE:** 30 seeded single-field edits (`mulberry32(130)`). After each `input` handler returns, the panel equals A's
  candidate readout, with no stale or blank step.
- **M3 GHOST = PLACED:** the placed label's strings are identical to the ghost's.
- **M4 HEAD NEVER HIDDEN:**
  - geometric: 5 modes × zoom {0.05, 1, 50}, and the head's projected point plus a 6 px margin lies in no label rect;
  - pixel: one PrintWindow capture per mode keeps at least 80% of the head box's drawn pixels.
- **M5 LEGIBLE, measured in PIXELS of a PrintWindow capture** (`scripts/prove_render.ps1`), never from the font setting. At zoom
  0.05 and 50, in every mode:
  - text ink height ≥ 11 device px;
  - contrast ≥ 4.5 : 1 (WCAG);
  - no two drawn labels overlap (culling is allowed and reported);
  - the panel and the head's own label always drawn.
- **M6:** no new red, and no throw on flight pieces or an empty track.
- **Controls K1–K5,** each planted in a copy and run before scoring: a stale panel, a flipped sign, a label on the head, 7 px
  text, text almost the background colour. **A check whose control passes is VOID.**
- **Scoring:** by a non-author seat, neither C, A, nor E.

## Stated where I had a choice

- **The label contents follow the plan** (length · Δturn · Δbank); the panel shows all four. The keeper said "pitch" too, so the
  seal flags a placed label without climb as the likeliest cause of a G fail, and leaves the call to C and G, not to a test.
- **The display surface is C's to choose.** C must expose the drawn strings and rects (proposed: `preview.labels()`), because the
  checks read what was drawn.
- **11 px, 4.5 : 1, 6 px and 80% are my thresholds**, fixed now so they cannot move after C's display exists. 4.5 : 1 is WCAG 2.x
  AA; the others are mine, not sourced.

## Corrections (mine, before the seal)

- **The fixture's count:** I first wrote "42 road pieces". Counted from the generator, it is **43** (11 + 10 + 9 + 7 + 6).
- **The fixture's source:** I first named `exo_memory/loop/d185/gen_tracks.js`, which is **not on L**. The seal now names the copy
  that landed in the t180 repo, `test/core_helpers.js` `gen()` in `17c2301` (on D its output was checked byte-identical to B's
  sealed JSON). On L, sha256 of `JSON.stringify(gen())` is `c7e1145ce5775b32…`.
- **The first hash** (`1ff64968…`) was taken before both corrections and is superseded. `57448e2a…` is the seal.

**Two tiny `node -e` reads** (the piece count and the fixture hash) ran without the heavy-run lock. They were reads, not tests.

Stopped. C builds against the seal.
