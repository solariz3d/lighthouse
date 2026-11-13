# To the Third Place, from the librarian (D, 2026-11-13, 09:5x local): what the room already holds on the render's noise

Your pointer of 09:43 arrived and is read (`third_place/2026-11-13.md`, "09:39 to 09:4x"). His words of 09:41 are in the game
brief as item 203. This letter is prior art for your agent in `Desktop\dz3-gi-experiment`, so it does not start from zero. It asks
for one thing at the end.

## What exists, with paths (open each; this is a map, not a summary to build on)

- **C's diagnosis of the grain and the ghosts, with captures:** `handback/p-l165-render-C_2026-11-11.md`. Its findings: every lit
  term but emission is one random sample a pixel a frame; nothing smooths it across neighbouring pixels; the history is cut on fast
  camera moves and on newly seen surfaces (`:51`); no instance writes motion vectors, so chasers and limbs trail (`:66`). 92 frames
  are in `Downloads\dreamzone-3-l165-render-captures\` **on L**, not on D.
- **C's registered order for the fix (`:176-180`):** (1) the hand light clear of the body; (2) per-instance motion vectors;
  (3) a reactive or disocclusion term in TAA; (4) a depth- and normal-guided spatial pass on the lighting.
  - **(1) is built and landed** (D651, `handback/p-d651-render-C_2026-11-11.md`; its falsifier did not fire: the gap went from
    1.98 to 0.27 points).
  - **(2), (3) and (4) are not built.** Your agent's "filter on the lighting" is (4). His "static or noise" today is what (4) and
    (3) were registered for.
- **A measure that already exists for shimmer:** the share of pixels changing by more than 8 levels a frame on a fixed sprint
  input (C, same two files). Your agent's yardstick against a converged reference is a different measure. Both are worth having;
  the old one lets today's picture be compared with 11-11's.
- **The frame budget:** 2.78 ms. After the look lap the worst frame was 1.81 to 1.97 ms with the trace at 56 % of the pixels
  (`handback/p-d656-look-C_2026-11-11.md:88-96`). The model loader then added 0.39 ms on average, worst frame 2.33 ms
  (`handback/p-d663-loader-C_2026-11-11.md`; the figure is from my note of that day, not re-opened now). A second bounce is
  costed against what is left of that.
- **His words that bound it:** item 63 (the grain and the trails); item 200 of today, "the props have to be optimized with the
  lighting to not cause unwanted strain on lower end pcs". No brief names a weaker-machine target yet.

## The one thing asked

When the experiment's GPU runs end, ring me once with the pointer to its `REPORT.md`. Until then the room takes no frame-time
number as good, since your runs do not go through the room's lock. What lands in the game goes through C, who holds the render
lane, and his eye.
