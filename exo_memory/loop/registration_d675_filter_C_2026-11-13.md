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

## The margin, filled in before the filter's first run (22:21Z)

checked: `dz-world --selftest` with a temporary block measuring the defaults twice in each view (the branch at e4b056f
plus the burst measure, 960x540; scratchpad `filter/spread.txt`, machine recorded in `filter/spread-machine.log`). The
two runs of each view agree to the last printed digit:

| view | darkest tenth, levels | over 8 levels, per frame |
|---|---|---|
| still, hand light | 4.5179, 4.5179 | 0.9977%, 0.9977% |
| still, lamps alone | 1.4112, 1.4112 | 0.7686%, 0.7686% |
| sprint, hand light | 11.9535, 11.9535 | 3.1109%, 3.1109% |

The spread is 0, so by the rule above **the margin is 0.25 levels.** Nothing with the filter on has been drawn yet.

## RE-REGISTRATION, 23:58Z, after the ruling (librarian 17:18 entry, lighthouse 66f9946a; the chair's 23:19Z packet). Written before any of the parts below is run.

**First, as registered: both rows FAILED** (A 0.77 against 0.75; B +0.48, +0.22, +0.35 against 0.25), and **"the filter
lifts the dark" HOLDS by the registered measure.** That leads every report. The filter stays off by default, and the
pictures go to him.

### Row B, replaced by name: against the SETTLED picture

- **"Settled"** is the harness's own held reference, `play(..., ref_at, ...)` in `game/world/offscreen_burst.cpp`. The
  burst runs to that shot's moment, then holds still (no tick), starts a fresh history and draws `kSettle` (72) frames;
  the last is the picture. The same for every view and both settings.
- **The still views** (the spawn by the hand light; by the lamps alone), 960x540, seed 1:
  1. the filter-on darkest tenth as row B measured it (the 24-frame burst from a forgotten history) is no brighter than
     the **settled defaults'** darkest tenth of that view by more than 0.25 levels;
  2. **settled-on** against **settled-off**: the same.
- **The sprint:** it has no settled form, so its reference is **four** of its 24 poses: **shots 6, 12, 18 and 23**, the
  harness's own `kRefShots`, chosen on 2026-11-11 (bf83136), before this lap. Each is held and settled with the
  defaults. The bar: the mean darkest tenth of those four shots in the filter-on burst, in motion, is no brighter than
  the mean of the four settled-default pictures by more than 0.25 levels. The 24-shot mean is printed beside it.
- **Unseen until run:** the sprint's four settled references, and the settled-on still pictures. So the row can still
  fail.
- **Red first: sigma 64 must fail it.** My own figures already on disk say that may not happen on the still views:
  sigma 64's grainy values were 5.28 and 1.82, which are within 0.25 of the settled-off values 5.09 and 1.71 that
  `settled.js` measured (432 frames, not this harness's 72). If sigma 64 does not fail the row, the row is NOT shown
  able to see a lift. That is reported as it is, and the row is not tuned until it fails.
- **The unwelcome outcome, in words:** "the filter lifts the dark past the game's own settled picture". True if the row
  fails for any view with the filter as built (3 passes, kernel 3).

### Row A, read at his size; the self-test row becomes a guard

- **Not moved to 1280x720.**
- **The claim at his size:** the same statistic as row A, over 8 levels averaged over the sprint burst's 23 frame changes
  (`D675_sprint`, hand light, seed 1), filter on (3 passes, kernel 3) against off, at **2560x1440** on this branch
  (ba127dd). **The bar is 0.75, as first registered.** Run once, as a temporary block in the self-test (as
  `settled.js` was), never committed; its script is kept. If the harness cannot draw 2560x1440, 1920x1080, and said.
- **The unwelcome outcome:** "the filter does not cut the flicker by a quarter at his size": the ratio is over 0.75.
- **The 960x540 row becomes a guard**, amended by name. Its comment carries the old bar (0.75), the measured 0.77, and
  the rule: at most midway between the measured ratio and no effect, **0.89**. It catches the filter not dispatched, or
  most of its cut lost, and says that is all it does.

### Both amendments are read by pane P before landing (the ruling).

### Also owed (the ruling)

- **The exit crash** (0xC0000005, with the rows placed last) becomes an open item with its reproduction in the hand-back.
- **Row C:** no ring awaited (the probe experiment's GPU runs ended at 14:10). Its only condition is that no game of his
  is on the card, checked at each run's start and end; a run that had company voids itself.
- **The pictures:** OFF and ON, grainy and settled, of the three views, as PNGs in one folder on G:, with the darkest
  tenth of each.

### ADDITION to row B, by name (the chair's 23:53Z message), written 00:10Z before any result of the amended row is read

The red/green run of the amended rows was already queued on the lock when this arrived. Its log has NOT been opened;
this section is written first.

- **If the red control (sigma 64) passes a view, that view is reported as "THE ROW CANNOT SEE A LIFT HERE"**, and
  counts neither for nor against the filter.
- **Then one more view is drawn,** registered here before it is drawn with the filter on: a dark area bordering a lit
  one in the same frame, where smoothing across an edge would lift the dark.
  - **The view: the spawn, still, by the flashlight**: the burst harness's own `flashlight` view (`Burst::flashlight`
    true, the stage's focus as the harness sets it, `staged_focus` 0; the hand light on; seed 1; 960x540). A disc of
    beam with the dark round it, edge to edge in one frame.
  - **The same rule as the other still views:** the grainy filter-on darkest tenth, and the settled-on, are each no
    brighter than the settled-off by more than 0.25 levels.
  - **The same red control** (sigma 64) is run on it first.
- **The margin is not changed** to make a control fail (0.25 levels).
- **His eye on the pictures decides the darkness** either way.
- **My own doubt, said now:** the darkest tenth is the frame's darkest 10% of pixels. Round a beam that may be the far
  dark, not the ring next to the edge, so even this view may not see edge bleed. If its red control passes too, it is
  reported the same way, and the pictures carry it.

### P's seven lines, taken by name (pane P's read, `handback/p-filter-read-P_2026-11-13.md`, dated 23:54Z; the chair's 23:55Z message). Written 00:12Z, before any result of the amended rows is opened. They bind every run, including the one already queued.

1. **Row B, the still views: the bar is SETTLED-ON against SETTLED-OFF, 0.25 levels.** The grainy-on against
   settled-off figure is printed beside it and is NOT the bar: grain pulls the darkest tenth 0.30 to 0.57 levels low, so
   that comparison can pass a real lift of that size.
2. **Row B, the sprint:** the four `kRefShots` poses (6, 12, 18, 23) are held and settled with the filter ON as well. The
   bar is the mean of the four settled-on against the mean of the four settled-off, 0.25. The in-motion mean is printed
   beside it, NOT the bar.
3. **The red control is judged per comparison.** A view counts as one where the row can see a lift only when sigma 64
   FAILS that view's settled-on against settled-off comparison. A view whose control passes is reported as "the row
   cannot see a lift here", and counts neither for nor against the filter. A control that passes the grainy comparison
   only says the grainy part is blind, and that is said.
4. **Row B's comment carries the old rule** (grainy on against grainy off, 0.25) **and its measured fail** (+0.48,
   +0.22, +0.35).
5. **Row A: one red run at 2560x1440** (the passes not dispatched) must FAIL 0.75 there. Then the row at his size is
   shown able to fail.
6. **The 960x540 guard at 0.89 stands** as written.
7. **The edge view** (the flashlight still, registered above) gets its own red control and the settled-on against
   settled-off comparison. I draw it in every run, so it is never chosen after a result; it counts under line 3 like
   the others.

**What this does to the run already queued:** that run was built before these lines. Its code's bar for the still views
was the grainy-and-settled pair, and it had no settled-on for the sprint. It is read for what it measured. The row is
then rebuilt to these lines and run again, red then green; that rerun is the one that counts.
