# Registration: the lighting filter's landing (D675), pane C, 2026-11-13

Registered BEFORE any measurement with the filter on. The packet: the chair's consolidated message of 14:06 (and its
rebase note of 14:09, the order of 16:08). His words: item 203 ("there is still too much static or noise"), items 211
and 212 (the frame rate: "i want it as close to 360 as we can get it for true ultra, but i can settle for a solid
300+"), item 213 ("yeah probes looks ass and loses the darkness we want").

The object: the GI experiment's code commit 2d6a4d6 (its experiment/REPORT.md), cut on dreamzone-3 branch
`d675-filter-c` to the filter (`light_filter`, `light_filter_kernel`, `light_filter_sigma`) and `gi_bounces`, each off by
default; nothing of the probes; the experiment's other knobs left out. Rebased on main d002b65.

## The rows (dz-world --selftest, 960x540, his run's world at seed 1; the setting under test: light_filter 3, kernel 3)

- **A, the flicker (the 11-11 measure).** The sprint along the bench's tour (the burst's C1: the hand light, the body
  shown), 24 frames 1/144 s apart after 432 of moving: the mean share of pixels whose largest channel changes by more
  than 8 levels from the frame before. **Bar: with the filter on, at most 0.75 times the defaults'.** Why 0.75: the
  experiment's own figures are 0.42 times at 1920x1080 and about 0.6 at 1280x720; 0.75 asks for a clear cut at the
  self-test's smaller size without taking the experiment's number as given. Red first: the same row with the filter's
  passes not dispatched (on equals off) must fail it.
- **B, the darkness ("the darkness we want").** Three views: the view at the spawn held still from a forgotten history,
  by the hand light; the same by the lamps alone; and the sprint of row A. In each, the mean over its 24 frames of the
  darkest tenth of the pixels' luminance (Rec. 709 weights, 8-bit levels). **Bar: with the filter on, no brighter than
  the defaults by more than the margin, in every view.** **The margin, registered now as a rule:** max(2 x the largest
  run-to-run spread of the defaults' own darkest tenth over two runs of each view, 0.25 levels), the spread measured
  before anything with the filter on is drawn, and the number written here before the filter's first run. **If the filter
  lifts the dark past it, that goes to him with the pictures, and the filter does not go on by default.** Red first: the
  row run against a deliberately lifting setting (light_filter_sigma 64: the stop opened so the filter smooths across
  light and dark) must fail it; if it does not, the row cannot see a lift and says so.
- **The defaults unchanged:** `--capture-walk` from main d002b65's exe and from the branch with defaults, byte-identical
  but for the overlay shot (it lists the settings) and anything the experiment found to differ by the shader compiler's
  arrangement, each named.

## C, the cost (his RTX 5080; P's method)

`dz-world --bench 30 --chasers --seed 1 --size 2560 1440`, three repeats of each arm, the defaults first and last, under
the exclusive hold, the card's other users recorded at each run's start and end (nvidia-smi: compute apps, utilisation,
clocks; the dz- programs); **a run that had company voids itself.** No run while a game of his is on the card.
- **Gate: p99 under 3.33 ms** (a 300 Hz frame). Reported beside it: **2.78 ms** (360, the aim) and the **worst single
  frame**. Reading "solid" as the slowest 1% of frames is the librarian's reading, not his.
- The arms: defaults; the filter (3 passes, 3x3); two bounces; and any cheaper form tried for the aim, each named.

## To find, with what would count

- **Why the filter's p99 was two-valued in P's bench** (2.433 against 3.055 and 3.097, the same seed and route). The
  candidates, registered: (1) the card's clocks or power state differing between runs; (2) company on the card (the
  void rule above); (3) where in the run the slow frames fall (a few long stalls against a shifted body of frames);
  (4) memory and residency from the five new trace-sized targets. Measured by: the clocks sampled through each run, and
  the frame times' shape (the slowest frames' places and the share over 2.78 and 3.33 ms). **A cause is named only when
  one candidate separates the runs and the others do not; otherwise it is "open", with what each candidate showed.**
- **The dark capture of 11-13 18:13Z** (a stretch whose lit room came out dark and then recovered): open after seven
  clean repeats (CPU load added; another dz-world on the card). The filter lap's captures are guarded instead: each
  capture's straight stretch must match the known track before it is used.

## The unwelcome outcomes, in the words that would make them true

- "The filter lifts the dark": row B fails for any view.
- "It does not hold 3.33": the filter's p99 is 3.33 ms or over in any valid run.
- "No cheaper form holds 2.78": named with the table.
