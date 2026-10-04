# T-180: a width reference drop-down, from the known tracks' measured widths. Librarian, on D, 2026-10-04 04:5x. Lap D232.

The keeper, 04:40: "how wide are the t-180 tracks you see? I wonder if there could be like a list somwhere like a drop down that tells you
the width of different known t-180 tracks, suich as thunderhead, aurora, nordic".

## Checked: the reads already hold each track's width per station
From `C:\Users\nname\Desktop\t180-track-builder\reads\*.read.json` (`stations[].width`, 1 m steps), by a node one-liner that took the median
and the p10–p90 over each read's stations. The reads are the D182 corpus's own (`docs/FINDINGS.md` §7f; made with `tools/read_track.cjs`).

| track (read) | median m | p10–p90 m |
|---|---|---|
| Thunderhead (normal) | 24 | 21–28 |
| T-180 Bowl Track | 22 | 21–25 |
| Test Track (ohyeah2389) | 29 | 28–31 |
| Hazen Loop | 29 | 28–32 |
| Eagleton / short | 30 / 31 | 29–34 / 29–36 |
| The Bowltrack | 30 | 30–33 |
| Centrifuge | 31 | 29–36 |
| Sakura Speedway | 32 | 31–35 |
| Coast | 33 | 32–38 |
| Serpents Spiral | 34 | 32–38 |
| Nordic | 38 | 29–53 |
| Onuris long / medium / short | 39 / 39 / 41 | 36–45 / 36–46 / 36–48 |
| Rainbow Road | 45 | 35–90 |
| Miandros (its read doesn't close, §7f) | 21 | 18–25 |
- **Aurora Cryopticon is not read** (outside the learning library, §7f). Reading its width needs one `read_track.cjs` run on
  `content\tracks\cash_auroracryopticon` (READ-ONLY).
- **Caveat:** these are the reader's width (ray hits left to right). §7f lists the reader's known biases, and the reads' widths are
  whole metres.
- **A unit trap for the keeper:** on these tracks "width" is the flat road across. In the builder, a closed tube's `w` is the
  CIRCUMFERENCE (u runs −w/2..+w/2 round the ring, `src/texture/flow.js`), so a 31 m tube is about 9.9 m across. Say this in the UI.

## The lap (A, FEEL tier: targeted tests + the keeper's eyes; no mutations)
1. **A "width like…" drop-down beside the width control** (on the piece being extended, and the new-track default if one exists). Each entry
   reads e.g. `Thunderhead, 24 m (21–28)`. Picking one sets w to the median. Numbers only, in a small JSON generated from the reads by a
   script (`tools/`), committed with a test that rebuilds it from the reads and requires it byte-equal when the reads are present (the
   `corpus.json` pattern, §7f). The reads themselves stay out of the repo, as now.
2. **For a tube piece (t = 360),** the entry also shows the tube's diameter at that width, w/π, plus a line noting that w is the distance
   round the tube.
3. **(C, parallel, read-only) read Aurora Cryopticon's width** with the same command, add it to the JSON's source if it closes, and report
   it either way.
- Then B's quick look; land; rebuild and install with the next build.

NEXT: chair dispatch D232 (width drop-down) to A, and the Aurora read to C, when this plan is read
