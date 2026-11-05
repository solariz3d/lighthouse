# L139: the second change for every field (turn, climb, width, cup, edges), before the release. Librarian, on L, 2026-11-05 00:3x

**Brief (read first, his words):** `exo_memory/briefs/t180_second_bank.md`. The newest line, 06:34Z: "We could just build the second move
feature before. Remember its more than just the banking, its the turns, climb, etc." So 0.4.39 is not released until this lands in it.

## What it is
One mark per piece, **from (m)**, shared by every field. From that mark to the piece's end, each field that has a "then" value changes a
second time: steeper or back, more turn or the other way, up or down. That makes an S-turn one piece (turn left, then right), and a banked
turn can end level.
- His sketch and his 11-04 words describe ONE mark ("another mark towards the end"), so it is one shared `from`, not one per field. A
  per-field mark is a later option if he asks.
- Fields: turn (kh), climb (kv), bank (phi, built), width (w), cup (c), left/right edge (e, er). Length is not a field that can change twice;
  his 11-03 list named it, and this plan reads that as "the piece is long enough for two changes".

## Prior art (t180 `l135-second-bank` 0df08db; check before building)
- `src/core/extend.js` holds the bank-only version:
  - `second: { phi: { from, target } }` (:13, :367-376);
  - `secondRamp` (:301) inserts knots in [from, L] and refits with a `keep` set so the first part holds;
  - `endC2` (:292);
  - `SECOND_MIN_K` = 15 (:291), the minimum second ramp 15·√Δ° measured for BANK on the built road (adapter bankPlan);
  - `BAD_TARGET` "bank only for now" (:368). This is the line that widens.
- Route channels (kh, kv, w, r) blend with the Bloss cubic; cross-section ones (phi, c, e, er) use the C2 quintic (`extend.js:1-10`). The
  second ramp uses the channel's own blend.
- Turn and climb as a CORNER (`src/core/turnby.js` `extendCorner` :156; `turnDeg` / `climbDeg`): in corner mode the panel's turn is degrees
  of heading. A second turn there is a second corner over [from, L], with each corner exact (first part turnDeg, second part thenTurnDeg),
  ending straight. In rate mode it is a second rate target.
- D637 (`briefs/t180_joint_bumps.md`, state): an early turn or climb eases over a length sized to its change (≥ 20 m, ≤ half the piece). The
  second turn/climb ramp needs its own measured minimum, as bank's did. Do not reuse 15·√Δ for kh/kv/w/c unmeasured.
- Panel: `app/core/panel.js` `extendOptions` (:144, thenBank/bankFrom :171-172), the fields (:330-331), C's clamp `secondFromOf`, and the
  tick `app/core/secondtick.js`.
- The bank's open finding: a second ramp near its minimum peaks over BANK_BAR at the piece-end joint (`loop/l136_registration_2026-11-04.md`
  M5). The same check applies to every field's second ramp at the end joint.

## The packet
**E first (registration, read-only, on 0df08db):**
- For turn (rate and corner), climb (rate and corner), width and cup, measure the shortest second ramp at which the built road follows the
  document within its tolerance. Use the same method as B's bank scan (built against the same piece without the second change, over the
  span before `from`; `p-l135-B` §ROW-6).
- Use the joint-feel measures at the end joint (`test/core_joint_feel.test.js`).
- File the pass bar and the degenerating signature. The signature includes: an S-turn piece (corner +90 then −90 over a 600 m piece) that
  does not end straight on the map heading it started on; any change to a piece with no `second` (byte-identical); his sketch piece
  changing.

**B (core, after E files):** branch `l139-second-change` off `0df08db`.
- Widen `second` to `{ kh, kv, phi, w, c, e, er }`, all sharing one `from` (refuse two different `from`s by name).
- Each channel gets its own minimum from E's table, and each refusal names the field and its minimum.
- Corner mode: `turnDeg2` / `climbDeg2` on extendCorner, exact.
- Tests written first, red on 0df08db:
  - the S-turn piece (corner +90 then −90) ends at the start heading and straight;
  - a climb 0 → +4°/100m → 0 piece ends level;
  - width 30 → 40 → 30;
  - a second change on a field with no first target is refused;
  - no `second` stays byte-identical (the golden file from L135 row 7);
  - mirror on insert negates turn and bank second targets, not width or cup;
  - save and open round-trip it.
- One mutation row per new channel family.

**C (panel, in parallel against the contract above):**
- A "then" box beside each field's row (turn, climb, bank, width, cup, edges), each disabled until its field has a target.
- One **from (m)** for all of them (today's bank `from` moves up to sit under length).
- The default from = min(85%, length − the largest minimum among the fields with a "then"). One tick.
- Undo restores all the boxes.
- Rename the bank's "then bank °" to match the row style.
- Rows red first, against B's contract; stub the core until B lands, then rebase.

**E (non-author review)** against its registration, and it varies: one S into a banked turn that ends level, on one piece.
**Then:**
- C installs on L for his drive (no auto-launch);
- after his drive, the release of 0.4.39 with the second change, at his word.

Rules: heavy-run lock at 4096; own CARGO_TARGET_DIR per build; targeted tests in review, one full suite at the merge; commit by named paths;
no AC launches; no push without his word. **Update `briefs/t180_second_bank.md`'s state half in the same turn as each landing.**

## AMENDED 2026-11-05 00:4x, at his 06:43Z words (brief): one mark PER FIELD, in that field's colour
- **Supersedes "one shared from" above.** Each field with a second change has its own **from**: . B: no shared-from refusal; each channel is checked against its own minimum.
- **The marks:** each field's mark is drawn across the road in that field's handle colour (: turn #b968ff, climb #ffd23d, bank #4d86ff, width #ff5a5a, cup #3ddc6e). It sits at that field's handle position across the road (each handle's ), so marks at the same distance do not cover each other. Bank's is at both edges (lat 1), climb's at the centre (lat 0), cup's at 0.3.
- **"Somewhere on the piece that makes sense":** each mark is a handle you drag along the piece. Its default is after that field's own first change has finished, at min(85%, length − that field's minimum), and never before its first ramp ends. In the panel, each field's row has its own **then** and **from**.
- C: the tick layer () draws one mark per field, coloured, and the drag moves that field's from (one undo step, like the handles).
- E: the registration adds a piece with three second changes at three different marks (bank at 70%, turn at 55%, climb at 80%) and requires each to hold its first value up to its own mark.

NEXT: chair dispatch E (L139 registration on 0df08db) now; B and C start when E's registration is filed; librarian collates
