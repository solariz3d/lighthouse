# D556: "bank over … m", the user sets the at-start ramp's length himself. Librarian, 2026-10-30 16:5x

Why now: D550's registered falsifier ("if he looks at the four and says none is right, the next move is a live handle, not a fifth guess by us") and E's D552 §1 and §4: "between B and C" is a length, not a shape; G at 300 m is F within 0.45° of bank and 0.04 °/m of roll, so a render of it tells him nothing; a length that LOOKS different from F has to differ by tens of metres, which is a number he should set by eye. Four laps (D532, D535, D540, D550) have guessed the length by formula and none met his eye on both sides at once. This lap gives him the number.

## The change

On the Extend panel, when the "at start" box is ticked for a bank (and the cup and edge, which share the ramp), a field **bank over [ 300 ] m** appears beside it, prefilled with the length the formula would choose today (so nothing changes for a user who does not touch it), floor 20 m, cap half the piece as today, step 10 m by the arrow keys. The value is stored on the piece (a saved track reopens with it), travels with copy and paste, and is NOT a track-wide setting. The ramp shape stays the chosen default (F's: a 20 m rise as laid, then the fade; or whatever he names from the page). The ghost redraws live as the number changes (the sliced preview build of D529 already handles a drag; a field change goes through the same path). The checker's roll read for the piece appears beside the field as it is today in the values band, so a length that would cross the amber shows amber there and then.

## Parts

**Part 1 (pane E, PROVE IT: core geometry and the document format).** `src/core/extend.js`: the at-start ramp length takes the piece's stored `bankOverM` when present, else the formula; the document field (name E's call, in the piece's handle record), its default-equals-formula rule (a piece without the field lays byte-identically to today: the nine fixtures 0 of 9, the goldens), floor and cap applied at lay time with the stored value kept as typed; save and load round-trip; copy and paste carries it. Tests first, red before green: a piece with bankOverM 400 is done by about 300 m as laid (the ¾ rule) and one with 150 by about 115; a saved track with the field reopens with it; the ramp harness whole with new mutants (the stored value ignored; the cap dropped; the field lost on save).

**Part 2 (pane A, CHECK IT, after Part 1): the field.** `app/core/panel.js` (crossStartM's neighbourhood): the field shown only when "at start" is ticked, prefilled with the formula's length, Bahnschrift number per D547 item 1, the roll read beside it; arrow keys ±10; the ghost rebuilds through the sliced path; the touched files' tests (core-pieces-ui, panel's own) and a headless once-over with `--mute-audio` in two looks. CHANGELOG one line in a player's words: "When a bank starts at the piece, you can type how many metres it ramps over; the default is what the builder chose before."

Branch from d550-e df8e440 (the fit and the cap are its base). Rides 0.4.31 (his 16:32: the whole queue before the release).

Falsifier: if he sets a length by eye and the laid ramp still reads as a kink on both sides, the LENGTH was never the lever and the shape is; then the next lap is a shape handle (rise metres), not a longer list of lengths.

surfaced: plan_d550 (the falsifier), p-d552-ramp-E_2026-10-30.md §1 and §4, extend.js rampControl (the ¾ rule), panel.js crossStartM / START_SPREAD / SWELL_SPREAD, plan_d529 (the sliced preview build), D547 item 1 (the number's type).
