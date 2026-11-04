# CROSS-SECTION lap (D225), A: the CONTRACT for C, posted early (the core's names; the build follows)
Seat A, Sonnet 5.5, on D. Worktree `C:\Users\nname\Desktop\worktrees\a-xsec-wt` on b3364df. Nothing here is built yet; these are the NAMES I am building to, so C can wire fields now. The hand-back `p-xsec-A_2026-10-03.md` will say, per line below, whether the built code matches.

## The channel keys (extend's `targets`, `transition` map, the brush's `channel`)
| field in the UI | channel key | unit in the document | domain (refused by name outside) | default / "continue" |
|---|---|---|---|---|
| edge angle | `e` | degrees | 0 to (150 − the piece's middle edge angle); 0 to (180 − t/2) on an open tube | 0; an empty field CONTINUES |
| edge start | `s` | share of the half-width from the centreline | 0.5 to 0.95 | 0.64; an empty field CONTINUES |
| tube sweep | `t` | degrees | 0 to 360 | none: a tube piece exists only when a `t` target is given or the piece before it is a tube; an empty field CONTINUES |
- `extend(doc, { length, transition, targets: { …, e, s, t } })`. `transition` may be a number or a per-channel map including `e`, `s` and `t` (`'start'` allowed, as for the others).
- **A piece is a cup OR a tube, never both**: `targets.c` and `targets.t` together are refused (`BAD_TARGET`). `e` and `s` work with a legacy, cup or open tube piece.
- Refusal codes thrown by `extend` and `checkDoc`: `BAD_EDGE` (e < 0, s outside [0.5, 0.95], total past the cap), `BAD_TUBE` (t outside [0, 360]; a closed tube carrying an edge; a tube HELD in the slot band between t1m(w) and 360), `TUBE_TOO_NARROW` is a VALIDATOR red named `tube-too-narrow` (a closed tube with w < 9.43 m), not a throw.
- The at-start box: `first: { e, s, t }` on an empty track, as for `c`.

## Readout (`pieceReadout` / `candidateReadout`)
New numeric fields on a road piece: `edgeFromDeg`, `edgeToDeg`, `sliceFrom`, `sliceTo`, `tubeFromDeg`, `tubeToDeg` (e(0), e(L), s(0), s(L), t(0), t(L)). A piece without an edge reads 0 and 0.64; without a tube reads 0. `candidateReadout` equals the placed piece's, bit for bit.

## Bank beyond ±180
**Checked now** (`node -e` on b3364df: `extend(…{ phi: 2π })` over 300 m, then `phi: −3π`): `bankToDeg` reads **360.000000**, then **−540.000000**, the next piece's `bankFromDeg` 360.000000; nothing wraps or clamps in the core. The input field (`app/core/panel.js`) is C's: this seat did not read it.

## Schema
`t180b.core/4`. /1, /2 and /3 documents load and migrate unchanged (an edge or tube piece is a piece that carries the channel in its text, the way a cup carries `c`). A document that carries `e`, `s` or `t` is written /4 and refused by an older reader.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\cross_section_seal_registration_2026-10-03.md · `node -e` run in the worktree: extend with phi 2π then −3π, readout bankToDeg 360 and −540
