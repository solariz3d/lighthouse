# L135: the second bank (one piece banks twice). Librarian, on L, 2026-11-04 04:2x, at the keeper's "go"

## The ask, in his words
- 11-04 04:0x (on L): "once you do banking once, there is another mark towards the end you can bank again that can let the end of the
  piece bank more in one direction or back to level in one piece, instead of having to place it, then flatten it with the next piece".
- The design he was shown on D, 2026-11-03T00:43Z (D librarian tail on the stick, `0c0c0c0b…800308795.tail`; notes
  `librarian/2026-11-04.md` 04:0x): two new settings under bank, **end bank °** (steeper, or back to 0) and **end bank from** (where along
  the piece the second bend starts; his drawing `EXTRA BANK FUNCTION FOR END OF PIECE.png`, on D only, marks about the last 15% of a 750 m,
  270° turn). It blends like the existing ramp; mirror and "at start" work on it as on bank now.
- 11-03 06:30 / 06:38 (`librarian/2026-10-18.md:1768, :1770`): later, the same for every field (turn, climb, width, length, cup), which
  makes an S one piece. **Not in this lap.** This lap builds the mechanism generally and turns it ON for bank only.

## Prior art, checked on L at t180 main `d10eacf` (0.4.39)
- `src/core/extend.js:1-34` header: a new piece's channels continue the last piece's end; a target is reached by a blend; the bank (phi)
  uses the C2 quintic / rounded-linear / two-share shapes (`roundedLinear` :50, `rampShape` :73, `channelFn` :104); `transition` per
  channel, 'start' = short ramp then HOLD (`startRampM` :115, `rampControl` :146, `fitWithHold` :230). `extend()` is at :268.
- `app/core/panel.js`: bank field and its "at start" box (:153-169 `bankShape`, `transition`; :221, :307 the boxes).
- Mirror = `mirrorOnInsert`, `src/core/piece.js:9` `insert(doc, piece, { mirror })` negates turn and bank: the second bank must negate too.
- Joint and ramp tests to extend, not replace: `test/core_bank_ramp`, `core_extend`, `core_extend_at_start`, `core_joint_c2`,
  `core_joint_feel`, `core_ramp`, `core_ramp_mutation`.
- Roll-rate amber 0.9338 °/m (panel.js :57 comment; the checker's limit).
- No second-change code exists on main (grep, 04:0x).

## The contract (so B and C can work at once)
`extend(doc, { …, second: { phi: { from, target } } })`
- `from`: metres from the piece's start where the second ramp begins, `0 < from < length`, and at or after the first ramp's end
  (the first transition, or `from` itself when the first bank eases over the whole piece: then the first ramp is laid over `[0, from]`).
- `target`: the absolute bank (rad) at the piece's end.
- Over `[from, length]` the bank goes from the first target to `target` with the bank's own shape (the same shape the first ramp used, the
  swell when "at start" is ticked, rounded otherwise), value AND slope AND curvature continuous at `from` (C2), and the piece ends with slope
  0, so the next piece continues as today.
- A `second` key for any channel other than `phi` is refused (`BAD_TARGET`, "a second change is bank only for now"). A `from` out of range
  is refused (`BAD_SECOND`), with the allowed range in the message.
- No `second` → the document is byte-identical to today's (old saves open unchanged).
- If the piece remembers its fields for re-edit (check `piece.js` / the panel's re-open), it remembers `second` too, and save/open
  round-trips it.

## The packet
**B (core, `src/core/extend.js` + tests):** implement the contract. Tests written FIRST, each red before the change:
1. 750 m, bank 30° (default ease), second `{ from: 637.5, target: 0 }`: bank holds 30° ± 0.1 from the first ramp's end to 637.5 m, is 0 at 750
   m with slope 0, monotone on each ramp, C2 at 637.5 (second-derivative jump under the tolerance `core_joint_c2` uses).
2. The steeper case: 30° → 50° from 85%.
3. "at start" ticked: first ramp is the swell, the hold, then the second ramp.
4. The next piece after it continues with no joint bump (the `core_joint_c2` / `core_joint_feel` measures).
5. Roll rate on each ramp under the 0.9338 °/m amber for his 750 m case, or the checker's existing warning fires.
6. Refusals: `from` ≤ first ramp end, ≥ length; a `second` on `kh`.
7. No `second`: byte-identical document on the existing fixtures.
8. Mirror on insert negates both banks.
9. A mutation row in `core_ramp_mutation` for the second ramp (drop its C2 end) that a test catches.
**C (panel, `app/core/panel.js` + UI test), in parallel against the contract:** under the bank field, two fields, **then bank °** and
**from (m)**, disabled until the bank field has a target; default `from` = 85% of the piece's length, updating when the length changes until
the user types one. A small tick on the next-piece ghost at `from`. Undo restores both. Plain labels, same style as the bank row. C stubs the
core call until B's branch lands, then rebases onto it.
**Merge (B):** one branch `l135-second-bank` off main, C's commits on top; CHANGELOG `[Unreleased]` Added entry (what and why: one piece can
bank again toward its end, so a turn exits steeper or level without a flattening piece).
**E (non-author review):** re-derive the C2 claim at `from` by sampling the built bank (not by reading B's test), run the targeted tests
plainly, try one case B didn't (a 100 m piece; a negative bank to +). GREEN or not.
**Then (C):** build the installer from the branch and install it on L for the keeper's drive, builder closed first, the current 0.4.39
install backed up. **No push to main, no release**, until he has driven it.

Rules: heavy-run lock with `--max-old-space-size=4096`; own CARGO_TARGET_DIR per build; targeted tests in review, one full suite at the
merge; commit by named paths; no AC launches (he drives).

NEXT: chair dispatch L135 to B (core) and C (panel) now; E reviews when B rings the merge; librarian collates
