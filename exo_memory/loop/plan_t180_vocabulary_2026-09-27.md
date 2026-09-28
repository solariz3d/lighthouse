# T-180 Builder: the pieces, rebuilt from the measured library. Librarian, on D, 2026-09-27 23:4x. Lap D182.

**The keeper, 23:36, after launching the 0.2.1 build:** *"it works but the pieces are nowhere near what I want them to
be, they arent good for t-180s........"* and *"they couldnt build a dogeish track"*.

**Diagnosis (checked against the code and FINDINGS, 23:3x):** the built-in words (`src/doc/vocab.js`) were hand-set,
partly from the milestone-1 platform test, not seeded from the 4,020 words the reader measured (FINDINGS §7b).

| | vocab.js now | FINDINGS |
|---|---|---|
| widths | 8–20 m | 10–50 m (Sakura half-pipe 32 m, Rainbow 47 m) |
| font on straight/sweep | flat | flat is 5–20% of road; the bowl is 50–88% (§1) |
| bank | 0 | road centre 16–50°, steepest 43–82° (§1) |
| wall-ride | R 30 m, 180° | Sakura median turn radius 454 m (§7) |
| jump gap | 12 m | 29–133 m (§7b) |
| flow | free | `sweep → turn → tight → turn → sweep` (§7) |

**My miss, recorded:** the plan tested that the pieces WORK, never that they are RIGHT for T-180s. No acceptance test
asked "can a user build a T-180-like track with this palette?"

## The acceptance test (registered before any change)

**P-LIKE:** using ONLY the palette's built-in words, fonts and tempos, at default handles plus the sculpt handles, the
loop rebuilds a stretch that reads like a real T-180 track.
- The stretch is B's pick: the first ~3 km of Sakura and of Centrifuge.
- The rebuild follows the reader's word sequence for that stretch (`read_track.cjs`).
- `read_track.cjs` then reads the export back, and its statistics match the real stretch's within tolerances stated
  BEFORE the run: width, cross-section class shares, bank, radius distribution and climb.
- **It FAILS if** any statistic is outside its stated tolerance, or if a built-in piece at default handles falls outside
  the library's 10th–90th percentile for its class.

## Rules

- **Measurements only go into the repo:** medians, percentiles and profile shapes as numbers, each with the command
  that produced it (FINDINGS style). **No other author's mesh, texture, or verbatim layout** (README; ARCHITECTURE
  §11.6). Starter phrases are PATTERNS from the grammar, not copies of Sakura's sequence.
- **No AC launch.** The full suite runs under the heavy-run lock at concurrency 4.

## The lap (strict wait-for-all)

| seat | job |
|---|---|
| E | Re-read every T-180 layout installed on D with `tools/read_track.cjs`, written to `reads/` (gitignored). Per word class: length, radius, heading change, width, profile ψ shape, bank, climb; jump gap and drop. Median plus p10/p90 per class, written as FINDINGS §7f with commands, and as `src/doc/corpus.json` (numbers only). |
| C | The fonts, from measured cross-sections: the bowl (the dominant one), the half-pipe (Sakura, 32 m), the flat banked ribbon (Rainbow, 47 m at ~30°). Widths up to 50 m and real wall heights. The geometry and the preview must hold these at T-180 scale (radii of hundreds of m, pieces of hundreds of m). |
| A | `vocab.js` generated from `corpus.json`: default = median, and TEMPO = the library's percentile bands. The default font per word is the one the library uses most for that class, so straights and sweeps are not flat. The grammar suggests the next word (never forced). Starter phrases as grammar patterns. |
| B | P-LIKE: registration of the tolerances FIRST, then the run and screenshots of the rebuilt stretches in the real window. Then the non-author read and privacy gate. |
