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

## 07:20: the librarian's sketch rejected; real prototypes ordered

- The keeper, 07:16, on the artifact the librarian drew by hand (https://claude.ai/artifact/33cirtL2qeyqiLcPPq9r3U): "I do not like it at all … looks worse than the one from before".
- That sketch was the librarian's own: a few minutes' work, sine-wave curtains, none of C's technique, and never seen running. The miss is the librarian's. It says nothing about E's or C's research. Lesson: a look is shown with renders made by a pane in the real code, never with a hand sketch.

## D490: prototypes, not the build. Pane C (check it; no commit to main, a branch only)

- Build looks 1, 2 and 3 as real sky styles inside t180's sky pass, on a branch from 82afc11. Use E's sources (arcs from horizon to horizon, layered motion, a corona the right way round) and C's own techniques (B with proper fbm/curl noise and a soft volume; nothing copied from CC BY-NC-SA).
- Keep what the current sky does well: its softness, its palette tokens and its calm.
- **Show, side by side with today's aurora**, from the same cameras (horizon, 40°, straight up, free view): stills at 2560×1440, plus a 10 s frame sequence of each. Show cycle (a) and (b) as stills at t = 0, 3, 6 and 9 min. All headless, muted, titled.
- Measure the GPU time of each with C's skypass probe.
- Hand-back: the image paths and the timings. The librarian shows them to the keeper, who picks from real renders.

## D495, the build, 07:48. The keeper: "lets try it, to see how it looks in track builder, build time"

He named no number, so it is the recommendation, **look 2 with cycle (a)**, told to him so he can veto. Pane C builds (it has the prototypes); tier: check it for the look, prove it for the GPU-timed row and the fallback.

1. **The GPU row first, red where it should be.** From C's skypass probe: the sky pass alone at 2560×1440, pitched 0/40/85, GPU timer query, p95 ≤ 1.5 ms. It skips with a reason when `EXT_disjoint_timer_query_webgl2` is missing. Red on a deliberately heavy sky (B 64×3 full res), green on today's aurora and on the new one.
2. **The sky:** d490-c's `aurora2` becomes the Aurora look's sky, with cycle (a) driven once a frame from JS through uSkyA/uSkyB (C §10 way 2); `--sky-c` stays `--fog`. Our own code throughout, nothing from CC BY-NC-SA sources.
   - **Fix list from the renders:** (i) straight up, the hard dark gap between the two curtains near the magnetic zenith reads like a mouth; soften it (a third faint curtain, a wider emission tail, or a gentler cut), judged by a render from the up camera; (ii) the faint horizontal step banding in the near curtain (looks 2/3, up and free cameras): more steps where the ray is near edge-on, jitter, or the SDF skip, judged by a render; (iii) the 1.46 ms reading C saw once looking up: the row's margin must hold over 5 runs.
   - Reduced motion holds everything at t = 0 in the skin's colours. The stars stay as they are (D416).
3. **The fallback:** if the measured sky time on the user's machine is over budget, the Aurora look drops to d490-c's `aurora1` (the reworked flat sky), with a test. Looks 1 and 3 ship as code only if the fallback needs them; nothing else of the prototypes ships.
4. **The look check:** stills from the four cameras and a 10 s clip, before and after the two fixes, to the librarian as an artifact update for the keeper.
5. The existing sky tests (sky-caustics-aurora, sky-crisp, sky-aurora-look) updated only where they pin the old shapes, each named with its reason. Touched tests. CHANGELOG line, 0 "keeper".
6. **Then it ships so he can see it:** when C's hand-back is accepted, landing pane E (after D494) merges d486-a + the build onto main, full suite, scans, releases 0.4.24, installs with the builder closed, a `.before-0.4.24` backup and a sha256 compare. If he dislikes look 2 in the app, switching to 3 is a small lap, since d490-c keeps all three.

## D495 read, 08:55 (C 4b56d693 / t180 d495-c 60e9d12; hand-back read whole, the up and free strips viewed by the librarian)

**Accepted for the landing.** The prove-it parts hold: the GPU row is green 5/5 at p95 1.304–1.305 ms looking up against 1.5, red on the heavy control every time; the fallback is proven through the real renderer with a forced budget (121–122 frames, said once); theme-mutation 65/65/0, mutation 104/104/0, touched 212/0/1 todo; the frame rows alone 8/8, 4/4, 6/6; scans 0. The prototypes are removed from the shipped tree and the style list is 0.4.23's seven again. Reduced motion holds at t = 0 in the skin's colours.

**The look, said plainly for the keeper, who judges it in the app:**
- (ii) the banding is gone, as ordered;
- (i) the overhead gap is softened, not filled; C tried a third curtain and a zenith glow, both worse, and refused to force one. Right call. It stays an open look item;
- the fix pressed the highlights, so the free view lost some of the edge-on filament character D490 had, and the large shapes drift slower than D490 (the shimmer along the hem is the moving layer now). The 10 s clips are where he judges whether it is alive enough.
- Two real findings fixed on the way: D403's 15%/s rule had broken on the D490 code (98%, now 12.5%), and the corona was still inverted near the zenith (now bases 2–3× the tops, row 7).

**The next look pass, if he wants one after seeing it live:** the filled centre needs a different idea (E's physics: rays converge on the magnetic zenith because they are parallel and tall; a single tall curtain crossing the zenith, seen from inside, might give it without a glow); and a middle setting between D490's drift and D495's.

## D497, the landing: pane A (prove it: release). E is on D496.
- Merge t180 d495-c 60e9d12 onto main fd4c8ea (d486-a is already on main) --no-ff. Full suite; frame rows alone if red; the GPU row alone under the lock. Scans. Release notes: the Aurora sky redrawn (arcs horizon to horizon, a corona the right way round, a slow colour drift), the X hover fix, and the known limit that the gap overhead is still visible. 0 "keeper".
- Release 0.4.24, push, install with the builder closed, a `.before-0.4.24` backup and a sha256 compare.
- Hand-back: the five lines as at 0.4.22/0.4.23.

## D497 stopped at the review, ruled 09:04 (A cce3b401, `p-d497-A_2026-10-27.md` §0 and §3 read)

A ran the periodic review as the landing's first step, as the rule puts it: 147 commits since the last tagged release, 36 "just do it"/"check it" read in full, 111 prove-it left to their own suites. It stopped on (a), rightly.

- **(a) rides 0.4.24.** Since 0.4.20 every export tells the user `Turn off "T-180 track" to export without it`, and no such control exists (exportwords.js:18, shown by install.js:66). A drops that sentence, keeps the CSP warning, runs the tests that pin the string, commits on rel-0.4.24, then the suite once on the whole. Tier: just do it. One line in the release notes' Fixed.
- **Nothing else joins 0.4.24.** The rest becomes D498 (below) so the release is not held on a list.

## D498, the review's fixes, next batch: one pane, the first free after D496/D497 (check it; the checker item is prove it)
1. **Tab after a click toggles Sculpt** (keys.js:41, :82–84): any focused control other than body or the stage counts as a field for Tab only. A keyboard test row.
2. **The live checker keeps a stale `low`** on a stacked entry when the partner that set it changed (validate/index.js:249, :635–641). Reproduce in a test first; prove it (validate is core).
3. **The closed-lap seam hatch** picks first/last segments where the seam tries pick first/last road pieces (preview.js:503 vs coreshell.js:413): a lap ending on a flight gets the cue on the gap. Align them; a test on a lap that ends on a flight.
4. The (c) rows: drag() asserts its typed fields read back; a scan row for the headless-title rule; the stale comments in core-pieces-ui.test.js:549 and aurora.js:4/:8; renderer.js's `next` program deleted when a fallback check throws.
5. The (d) tidies: hover.alt cleared on blur; the 0x08 bytes in sound.js/sound-samples.test.js comments; the CHANGELOG's "five looks" → six; coreshell.js:69–70's comment.
6. CHANGELOG lines, 0 "keeper". It rides the batch after 0.4.24.

## D497 stopped again, ruled 09:52 (A f6fbe630, §7 read whole)

A's stop was right: drag-frame row 8 is red alone (7.6 / 8.6 ms against 6.9) on 86b92f1, where it read 6.0–6.6 at D484 and 6.1–6.5 at the 0.4.23 landing. But the machine was not quiet (CPU 37% with nothing of A's running; E is on D498 and a lockless run of three files or fewer is allowed), so red-alone does not yet separate a regression from load.

**Ruled: A's way 2, in a quiet window.**
- The chair asks E to hold every test run for the window and say when it has stopped; A takes the lock as a timing session.
- A runs row 8 at 82afc11 (0.4.23) and at 86b92f1 back to back, three rounds each, alternating, same harness, same priority. Reports the six p95s.
- **If both read alike** (within about 0.5 ms of each other, and the tip under 6.9 in at least two of three): load, not a regression; the release continues at step 3 and the landing note says so.
- **If the tip reads over 0.4.23 by more than noise in every round:** a regression in d495-c's per-frame path (drawSky runs on every look; the one new per-frame call is `CYCLE.colours`, and the timer queries should not run for a look without a fallback). Then the release stops, A hands the six figures to C, and C finds and fixes it on d495-c before the landing resumes. No bar ruling: the bar is the keeper's 144 Hz.
- sculpt-frame row 3 (8.0 / 7.3 against 6.0 in the suite): run it alone with both slots held in the same window, as C did in D495 (`bothslots.js`). If red alone and quiet, it joins C's list.

## D497 A/B read, ruled 09:58 (A 01de41b8, §8 read whole)

The six figures: 0.4.23 reads 9.8–12.5 ms and the tip 10.1–12.0 ms in the same window, with no consistent sign (round 2 the tip is 1.5 under, round 3 mixed). CPU was 54% from the keeper's own applications, none of them a seat's, the builder or AC. So:
- **Not a regression.** The instrument that separates code from load is the A/B, and it shows base and tip alike. 0.4.23, which met the bar at 6.1–6.5 when quiet, reads 10–12 under this load; the tip reads the same.
- **The absolute bar cannot be measured while the machine is in use**, by any build. My ruling's "tip under 6.9 in two of three" assumed a quiet machine, which no seat can make.

**Ruled: the release continues at step 3.** The landing note states that drag-frame row 8 and sculpt-frame row 3 were red under the keeper's own load with 0.4.23 red beside them, and green alone at the 0.4.23 landing. **A re-runs the A/B (`ab497.js`, `bothslots.js`, kept) at the first idle window** (CPU under 10% for three minutes with no seat running, as A's quiet check does), after the release. If the tip then reads over 0.4.23 by more than noise, that is a regression and a point release follows; if both are green, the note is closed.

Told to the keeper, with the veto: if he would rather have the clean number before the install, an idle machine for five minutes is all it takes.

## ALL-CLEAR on 0.4.24, 10:06 (A f1c9167d, §9 read; verified on disk by the librarian)

- Installed exe sha256 56abd274…f620, ProductVersion 0.4.24. `.before-0.4.24` is sha256 12911ad6…d49c, the 0.4.23 exe.
- origin main and the v0.4.24 tag are both at 86b92f1. `releases/latest` is v0.4.24, not a draft; the asset is 8,025,959 B, sha256 cd5c1355…c86a. Push-gate allow at 16:02:25Z.
- In it: the Aurora sky redrawn (D495), the X hover (D486), the Credits and the renders removed (D487/D488), the AI note (D491), the export wording fix (D497 (a)).
- **Owed:** A's idle-window A/B of drag-frame row 8 and sculpt-frame row 3 (CPU under 10% for three minutes, no seat running). The tip worse than 0.4.23 by more than noise means a point release. D489–D497 otherwise CLOSED.
