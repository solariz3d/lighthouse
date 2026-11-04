# p-testtrack-C — the T-180 test track's cross-section (D223, read-only measurement), pane C, 2026-10-03, on D

**Report:** `exo_memory/loop/t180_testtrack_profile_2026-10-03.md`. It holds summary numbers and methods only: no coordinates, no
per-section lists, no plots.
**Evidence:** `C:\Users\nname\Desktop\t180-track-builder\reads\testtrack_profile_2026-10-03\` (git-ignored: `git check-ignore -v` →
`.gitignore:1:reads/`). Its files, with sha256 (first 16):

| file | sha256 |
|---|---|
| `read.json` | `a0df89c028afab21` |
| `sections.json` | `9342f7691c590c6b` |
| `summary.json` | `33fcdff0e41377be` |
| `facets.json` | `e5f079ec3cc27ad1` |
| `paired.json` | `3cf8f67fe0ec03e4` |
| `section_1_straight.png` … `section_6_median-turn.png` | listed in `plots.txt`, with captions |
| scripts | `sections.js` `ea8ad6e1204b38a8`, `facets.js` `e8f976e25a595b06`, `paired.js` `d8fe7419f30d3b10` |

## Findings (each re-derives from the named JSON)

1. **Two zones joined by a crease, not one smooth curve and not a smooth edge curve.**
   - The middle is nearly flat: ψ 2.9° at u = 0.26, 4.9° at u = 0.50.
   - The angle jumps about 10° in one 0.02 step at u = 0.64 (p10–p90 0.62–0.64).
   - A steep outer band follows: ~19–20° from u ≈ 0.66 to 0.88.
   - The lip then rolls back by 9.1°, to 10.7° at the edge.
   - Source: `facets.json` and `paired.json`, over 1,320 width-filtered sections and 2,640 sides.
2. **The same on straights and turns, and symmetric.**
   - Paired outside-minus-inside peak ψ over 920 turn sections: +0.02° median (−7.7 to +8.4).
   - Outside steeper by more than 1° in 402 sections, inside in 385.
3. **The registered fits:**
   - **The track counts as one curve.** Only 72 of 1,912 sections passed the two-zone bar, and the bar was fixed in `sections.js`
     before the run (`ea8ad6e1…`).
   - Median RMS: cup-only 5.00°, two-zone (G = t²) 4.65°, two-zone with G = t (kinked) 4.62°. G = t² beat G = t in only 271 of 1,912
     sections.
   - The best smooth slice is s ≈ 0.88 with e ≈ −6.7°. **That negative e fits the lip, not a flatter edge.**
4. **For E's seal:**
   - the real transition sits at **s ≈ 0.64**, with a step of about **+15°** (5° → 20°);
   - it is kinked, not G1/G2-smooth;
   - there is a rolled lip at the very edge that the edge-curve design does not have.
   - The keeper's smooth curve is a smoothed version of the author's crease. That is a choice to state in the seal, not a copy of the
     track.
5. **The plots:** six PNGs (straight, entry, apex, exit, worst cup-fit turn, median turn), each showing the measured ψ, the cup fit and
   the two-zone fit. The captions in `plots.txt` give each one's d, k, width and fit parameters.

## Commands

All runs used my lock wrapper, under the heavy-run lock at `--max-old-space-size=4096` (log: `reads/.../run.log`):
- `READ_PROFILE=1 node tools/read_track.cjs <track dir> > read.json && node sections.js read.json <reads dir>`: one hold, 14:54:09Z →
  14:54:30Z.
- `node facets.js <reads dir>`
- `node paired.js <reads dir>`

## Corrections, mine

- **The first run's asymmetric fit is not supported by the paired check.** It reported "outside steeper" (eOut − eIn median +8.2°;
  811 of 1,381 turns) and an outside-minus-inside edge angle of +4.3°. That fit ran over all widths and with the lip in, where the
  edge term was fitting the roll-back. On width-filtered sections, the paired difference is ~0 in both directions (finding 2). The
  summary.json numbers stand as computed; the reading of them is what I withdraw.
- **Lock waits:** a survey run and the first main run each gave up after the lock's 30-minute wait, because B's D222 suite held the
  lock. The run that produced every number got the lock on its first attempt, at 14:54:09Z.

## What I did NOT verify

- **The facet table, the symmetry check and the lip-excluded refit are EXPLORATORY.** They were written after I saw the first plots.
  Only the cup vs two-zone comparison and its bar were registered.
- **The surface is the visual road mesh** (`1ROAD_TrackTop_Metal*`). I did not check whether AC's physics uses the same faces, or
  whether the lip is a bevel physics treats differently.
- **The section walk is my own** (0.5 m steps, a fold over 20° ends it). It was not cross-checked against `read_track.cjs`'s own
  1 m `psiL`/`psiR` samples, which are in read.json and could be.
- **592 of 1,912 cuts were excluded from the facet analysis** by the 0.7–1.3 × median-width filter. I did not look at what those
  sections are (junction aprons are my guess).
- **ui_track.json gives a length of 50,000 m; the walk closed at 7,852 m.** I did not check which is right beyond the walk closing.
- **Nothing was committed. The app was not touched.** The AC install was only read.
