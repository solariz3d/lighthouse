# D489: rework the Aurora sky, more lifelike and fluid, research first. Librarian, 2026-10-27

The keeper, 06:44, a screenshot named "bugged out aurora i think we should do a completely reworked aurora design something more lifelike and fluid we need to do aurora animation research" (`C:\Users\nname\Pictures\Screenshots\`). It shows the free view, looking up, on an empty track: the curtains' rays converge into a flat starburst overhead, with a magenta fringe along the lower bands.

## What is there now, checked by the librarian (t180 origin/main 82afc11, `app/preview/sky/aurora.js`, 109 lines, header :1–24)
- Three curtains hung round the sky at different depths (D384, D403). Each is a ribbon that folds and sways, striped by rays. A green hem goes to violet, then to a red-pink top, with a thin pink fringe below the hem.
- **The starburst is by design:** "Overhead the curtains' rays fan out from one point, a corona" (:6). It is a 2D fan in angle with no depth, so in free view it reads as a flat graphic, which is what he saw as bugged.
- The motion was deliberately slowed so it stays quiet behind the work: folds at ≤ 0.0042 rad/s, rays at < 0.001 rad/s, "nothing crosses the view in under four minutes" (:10–12). That was a D403 decision, and "fluid" pulls against it, so the design has to settle it.
- Everything is a function of whole multiples of azimuth (:13), and there is nothing under 10° of elevation (:7).

## Parts: research in parallel, then a design note to the keeper before any build

**Part 1, pane E (research, no code): what a real aurora looks like and how it moves.**
- Sources first: NASA/NOAA and university auroral physics, all-sky camera footage descriptions, and real-time (not time-lapse) footage.
- Cover the forms: arcs, curtains with folds and spirals, rays, the corona overhead (rays converging on the magnetic zenith by perspective, with depth), diffuse patches, pulsating aurora.
- Cover the colours by altitude: 557.7 nm green at about 100–150 km, 630 nm red above, and the N2 blue/purple lower edge. Say what is seen by eye and what only on camera.
- **Motion in real time, with figures:** how fast folds travel along an arc, ray flicker, the speeds of the substorm "dancing", pulsation periods. What reads as "fluid".
- Hand-back: a sourced list (each fact names its source), plus what our current sky gets wrong against it, by aurora.js line.

**Part 2, pane C (research and measure, no change to the app): how to render it in real time, at his refresh rate.**
- Survey the techniques, naming each's source and cost: ray-marched curtain sheets in a volume (the well-known Shadertoy "Auroras" approach), height-field curtains displaced by noise or curl noise, layered 2D bands, and the corona done in 3D so it has depth when looked up at.
- **The baseline:** measure the current aurora pass's cost per frame at 2560×1440 headless (muted, titled), so any design states its budget against the 6.9 ms frame, with the road's own cost left in.
- Name what would fit inside the sky's share of the frame, and what would not.

**Part 3, the librarian, when both are in:** a design note that merges the two. It covers the forms, colours and motion, how "fluid" squares with "quiet behind the work", the technique, and the budget, with two or three options where the choice is taste. **It goes to the keeper before anything is built.** The look is his.

Tier: research and measurement, no code. The build is its own order (check it, with the frame-time rows as the gate).

NEXT: chair dispatch D489 part 1 to E and part 2 to C now; librarian writes the design note when both hand-backs are in.
