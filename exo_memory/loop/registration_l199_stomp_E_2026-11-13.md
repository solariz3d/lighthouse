# Registration: L199's third voice, "the heavy stomp" (his item 184). Pane E, 2026-11-13 05:0x local, BEFORE any render

**His word** (item 184, `briefs/dreamzone2_the_game.md:1335`): "the deeper bassy thud is better idea i think for the
hunters sound, it should be like, heavy, like SCARY bassy stomps".
**The chair's packet:** 11:04:41Z. Voice B's direction (the deep boom), made heavier and scarier, with a layer that
carries over his own sprinting steps without thinning the weight.

## The rows, registered before the first render

1. **Heard coming (the chair's row).** At 12 to 20 m, each stomp weight that is offered clears his sprinting steps on
   **at least 7 of 14** footfalls, in at least one band (above 150 Hz, 150-600 Hz or 600-1200 Hz).
   - The measure is L199's, unchanged: `glimpse199.js`, the same run, the same no-hunter render. Each footfall is taken
     at the instant its foot comes down, against everything else sounding in the same 60 ms.
2. **The weight is not thinned (mine, so the row above cannot be passed by thinning the boom).** At 12 to 20 m, each
   weight's footfall level **under 150 Hz** (the hunter alone, the median of the 60 ms windows) is **at least voice B's**
   as he heard it (`r/B_notone.wav`, gain 0.73).
   - Voice B's own figure is measured with the same script before any stomp is rendered, and written in the hand-back
     beside the stomps'.

## What would fail, said now

- A weight that clears his steps only by losing low end fails row 2.
- A weight that keeps the low end but sits under his steps fails row 1.
- **If no weight holds both,** the hand-back says so with the numbers, and the clip still carries the closest weights,
  marked as failing.
- Nothing is tuned to pass after a render without the change being named in the hand-back.

## Held fixed

The run (L192's clip: him sprinting at 7 m/s, the hunter closing from 28 m at 9.5 m/s, legs at 2.15 strides a
second), the timing, force and mix layer, the bed and levels, and the calm duck's depths. CC0 only, and no GPL tool.

---

# Second pass: "a footstep, not a drum" (his item 190; the chair's 13:11:15Z packet). Registered 07:2x local, BEFORE any render

**His word** (`briefs/dreamzone2_the_game.md:1497`): "stomp 1 heavy is the best, but its still sounding like a drum more
than loud heavy footsteps of a monster. But its getting better. Stomp 3 Giant is good too, but sounds even more like a
drum which isnt good".

**The build:**
- stomp one's boom underneath, shortened;
- a RECORDED contact (Sonniss, CC0 or credited items; offline only);
- several close hits in one footfall;
- no two steps the same.

## The rows

1. **Heard coming (stands, unchanged):** at 12 to 20 m, each version offered clears his steps on at least 7 of 14, in
   some band (`glimpse199.js`).
2. **No less bass than voice B (stands, unchanged):** under 150 Hz at 12 to 20 m, at least -33.3 dB (`weight.js`).
3. **No two steps the same (new):** the same foot's footfalls at 2-6 m are less alike than stomp one's. The peak
   normalised cross-correlation over 0-150 ms (`stomp2rows.js`, "same foot") is below **0.90**.
   - Stomp one reads 0.998.
   - Voice A's eight recorded takes in rotation read 0.776.
4. **Rings less than stomp one (new; his "more like a drum" tracked the ring):** under 150 Hz, the level 120-180 ms
   after a landing, relative to its first 60 ms (`stomp2rows.js`, "ring"), at or below stomp one's **-10.6 dB**.
   - The giant, which he heard as more of a drum, reads -0.6.
   - Voice B reads +0.5.

## Measured and NOT used as a row

- **Spectral flatness** (how noise-like the first 100 ms are) ran AGAINST his ear on the one pair he judged: the giant
  0.003 against stomp one 0.001, though he heard the giant as more of a drum. It is reported for each version, not
  gated.
- checked: `node stomp2rows.js r/none.wav ...` at 07:2x local (B, A, H1, H3).

## The timing inside a footfall

- **Fukuchi 2017 cannot give it:** its force was "filtered using a fourth-order, low-pass Butterworth filter with the same
  cut-off frequency of 10 Hz" (`fukuchi2017_PMC5426356.xml`, data processing). No impact peak survives in any of its
  31-39 runners (checked: `scratchpad/l199/grf_timing.js`).
- A source read for sub-event timing is out. **If it returns no open source, the hit timing is OURS and marked so.**
  Every hit fits inside the 233 ms a footfall has at 4.3 a second.

## What would fail, said now

- A version that repeats fails row 3, and a boom that still sings fails row 4.
- A contact loud enough to carry but with no weight under it fails row 2.
- **If no recording under the allowed licences can be fetched without a login, the second pass stops and says so.** A
  synthetic contact is not substituted quietly.
- Anything tuned after a render is named in the hand-back, with the render that prompted it.
