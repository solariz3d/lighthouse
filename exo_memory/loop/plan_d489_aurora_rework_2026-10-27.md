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

## Added, 06:47, at the keeper's word: "how about, the aurora can slowly change colors over like 10mins"

- **A design requirement:** the aurora's colours drift slowly through a cycle of about 10 minutes.
- **Part 1 (E) adds:** which colour shifts real aurora make, and over what time. For example, green-dominant to red-topped as activity rises, and pink/purple lower edges in bursts. Where would a 10-minute cycle be true to life, and where would it be invention? Either is fine; the note says which.
- **Part 2 (C) adds:** colour today comes from the skin tokens (`--sky-a` green, `--sky-b` violet, red-pink derived from `--sky-b`; aurora.js:15–16). Say how a cycle fits: blend between token sets over time, or a hue path in the shader. Name what that means for the road and panel colours that share those tokens. The cycle should cost nothing measurable.
- The design note offers the cycle's palette as a choice (for example, green to teal to violet to rose and back).

## Part 3: the design note, 07:05 (E f8248c83 + c287bd05, `p-d489-aurora-research-E_2026-10-27.md` §0, §4, §7; C f3db6db1 + 7499edbb, `p-d489-C_2026-10-27.md` §1–§10; read)

OUTPUT → NEXT: changed. E: the corona is inverted (bright green at the centre, aurora.js:85–86), the curtains are rings where real arcs cross the sky horizon to horizon, and "fluid" means motion at several scales, not speed. C: a GPU-timed row has to gate the build, because the frame rows cannot see GPU cost; and a colour cycle driven from JS costs nothing measurable.

**Common to every option (from E's sources):**
- Arcs run roughly east–west from horizon to horizon, instead of three rings at 13–17°.
- Motion in layers: the arc drifts barely at all; folds and curls run along the hem; the fine rays flicker, low in contrast; now and then a patch pulses. The big shapes stay slow, which keeps it quiet behind the work.
- The corona is right way round: green ray bases away from the centre, faint tops converging. Reduced motion freezes it.
- **The gate is a GPU-timed sky row** (C's skypass.js): at most 1.5 ms p95 at 2560×1440 looking up. If the timer query is missing, the row skips and says why. The frame rows stay as they are.
- A fallback for weaker GPUs: if the measured sky time is over budget, it drops to option 1.

**The look, three options (the keeper picks):**
1. **A reworked flat sky.** The same technique as today, with new shapes, layered motion and a corrected corona. About 0.15 ms. Looking straight up it is still flat.
2. **One real 3D curtain in front, flat bands behind (recommended).** The near curtain is drawn in a volume (C's technique B, 24 steps, full resolution, about 1.1 ms p95). Its rays converge overhead with real depth, and near rays move faster than far ones as you turn. The far bands stay cheap.
3. **Fully 3D, three curtains, drawn at half resolution and scaled up** (B 48×3, about 1.1 ms p95). The most lifelike and the softest. The stars stay sharp in the full-resolution pass.

**The colour cycle, two options** (driven once a frame from JS: about 25 ns, nothing on the GPU; `--sky-c` stays equal to `--fog`):
- (a) **Lifelike:** over about 10 minutes, red tops and pink lower edges swell and fade, not on an exact clock, while the hem stays green. Red follows with a lag of a minute or two.
- (b) **Stylised:** a cycle through green → teal → violet → rose and back every 10 minutes. E notes it is invention, not physics.
- Either way the panel stays its own green by default. Having the panel's glows follow in slow steps costs about 1.1 ms of main thread per step, and is a later choice.

**Licence:** the build writes its own code for the technique and copies none from the Shadertoy "Auroras" (CC BY-NC-SA). C also notes t180 has no LICENSE file. That is the keeper's call, named and not pressed.

**Recommendation:** 2 + (a). When he picks, the build is one pane (check it; prove it for the GPU row and the fallback). Its gate is the GPU row, plus a look at screenshots looking up and at the horizon in free view.

## The keeper's pick, 07:11: "+" (read as a yes to the recommendation, 2 + (a); told him so he can veto)

## D490, the build: one pane, C (C measured the techniques and wrote the GPU probe). Tier: check it for the look; prove it for the GPU row and the fallback.
1. **The GPU row first, red where it should be.** It is a test made from C's skypass.js: the sky pass alone, 2560×1440, pitched 0/40/85, timer query, p95 ≤ 1.5 ms. It skips with a reason when `EXT_disjoint_timer_query_webgl2` is missing. It must be red on a sky deliberately over budget (C's B 64×3 at full res), and green on today's aurora.
2. **The sky** (app/preview/sky/aurora.js and, for the cycle, the renderer/preview side). It is our own code for the technique, with nothing copied from CC BY-NC-SA sources.
   - Arcs run east–west from horizon to horizon, tilted to a fixed field direction.
   - The near curtain is in a volume (technique B, about 24 steps, full resolution), with the corona arising from its rays by perspective: green bases outward, faint tops converging.
   - Far bands stay 2D.
   - Motion in layers: the arc drifts at about 0.1 km/s equivalent; folds and curls run along the hem at km/s, low in contrast; rays flicker; an occasional pulsating patch of 2–20 s. The big shapes stay within D403's quiet pace.
   - Colour, from E §7: a drift of about 10 minutes, not exactly periodic, in which red tops and pink lower edges swell and fade while the hem stays green. Red lags by a minute or two. It is driven once a frame from JS through the existing uSkyA/uSkyB uniforms (C §10 way 2). `--sky-c` stays equal to `--fog`.
   - Under reduced motion, everything holds at t = 0 in the skin's own colours.
   - The stars are kept as they are (D416 sizing).
3. **The fallback:** if the measured sky time on the user's machine is over budget, it drops to a reworked 2D version of the same arcs, with a test.
4. **The look:** headless screenshots (muted, titled) in free view looking up, at 40°, and at the horizon, at t = 0 and at t = 5 min, plus a short frame sequence of the hem moving. These go to the librarian, who shows them to the keeper.
5. The existing sky tests (sky-caustics-aurora, sky-crisp, sky-aurora-look), updated only where they pin the old shapes. Each such update is named with its reason in the hand-back. The touched tests. CHANGELOG line, 0 "keeper". It rides the next batch.
