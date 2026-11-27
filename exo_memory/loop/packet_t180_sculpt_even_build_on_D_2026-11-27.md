# Packet (on D, 2026-11-27): Sculpt's Even tool, stage 2, the build. Amends `loop/packet_t180_sculpt_even_build_2026-11-27.md`

Written by the librarian on D after three probes: `handback/p-l267-sculpt-even-build-A_2026-11-27.md` (stage 1, failed),
`handback/p-d678-even-banked-probe2-A_2026-11-27.md`, `handback/p-d678-even-banked-probe3-A_2026-11-27.md` (git-blob a129269e,
run 2 and the answers read whole). His word is unchanged: 2026-11-27 06:01, "do what you think is best"
(`briefs/t180_sculpt_even.md`). The calls below are the librarian's under that word. Everything in the first packet's "Stage 2"
stands (base c522ea6, own branch, red first, his saved files the same, the tier, the CHANGELOG, the reader after) except where
this file says otherwise. Tier: PROVE IT. No build of the app, no install, no merge, no release: the install is his word after
he has seen pictures.

## Calls 10 and 11, replaced by what was measured (do not work them out again)

- **Call 10, the centre.** The level moves the centre within the road's own plane, and that plane is the road AS BUILT: the
  bank plan's roll (`src/core/adapter.js` `bankPlan`), not the document's bank channel (probe 3: the two differ by up to
  2.4286 degrees where a bank ramps, and reading the channel drew the reds at the ramp's ends). On a flat road this is E5 to the
  byte (probe 2, K2), and on a bank constant over the stretch it is the same bytes as reading the channel (probe 3).
- **Call 11, the bank.** The level does not touch the bank. It is kept as found.
- **The centre's fit.** The probes set the height at control points and sat 0.0151 to 0.0156 m off the in-plane target (between
  the 0.01 and 0.05 m bars). Use the least-squares centre the planner registered as its cure (Alt F), with its row registered
  first: within 0.01 m on B-, B-0 and Bhold. If it does not get there, say by how much; do not widen the bar.

## The banked rows (register them, with what fails each, before any run)

- Starts on a banked road are made with the WIDTH BRUSH, which does not turn the bank, and from the untouched road. From
  those, on Bhold, B- and B-0: no red the base lacks, the held rim across within 0.01 m, the centre within 0.01 m of its
  in-plane target on the built bank, nothing outside the window changed.
- **Reported, not a gate:** the same rows from today's grab (T1, T2b). They will show what the grab leaves and the level
  cannot take back (probe 2: the bank 4.9984 and 5.0209 degrees off, the held rim 0.0964 and 0.0968 m off). That table goes to
  him with the pictures.
- **A road whose bank rolls away from the turn (B+, B+0):** the level is laid, not refused. Where the built road already reads
  red along the new centre's line and did not at its old centre (probe 3: B+0 from 210), the tool says so at the red in plain
  words, with the three figures the planner named (the shift, that line's load on the road as it stood, the old centre's load).
  Wording is the builder's; no jargon, no channel names.

## Not in this packet

- **The grab.** A grab that pulls along the section's chord was measured (probe 2, C3a and C3b) and is NOT built. It changes
  his daily tool on banked roads; it waits on his word, asked at 11:2x.
- The bank plan's own roll acceleration over its bar (0.00055 against 0.0001 rad/m2 on B+), and the checker's side lines
  leaving out the roll rate (+6.98 g where the line itself reads -0.66 g). Both are findings for him, recorded in
  `briefs/t180_sculpt_even.md`; neither is changed here.

## Pictures for him, before anything is installed

True scale, before and after: a flat turn, a turn banked into its centre with a width-brush bump, and the same turn after
today's grab (so the bank the grab flattened is seen beside the level's result). Untracked.

NEXT: chair dispatch this to the planner-builder of the Even tool when a pane is free; that pane call_librarian with its hand-back
