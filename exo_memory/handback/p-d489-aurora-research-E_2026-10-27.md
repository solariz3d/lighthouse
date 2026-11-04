# D489 part 1, pane E: how a real aurora looks and moves, and what our sky gets wrong (research, no code)

Packet: the chair's D489 part 1 of 2026-10-27T12:45:46Z. Plan: `exo_memory/loop/plan_d489_aurora_rework_2026-10-27.md` (librarian 1040c921), read whole; its "Part 1" is this brief.
Code read: t180 `app/preview/sky/aurora.js` at origin/main **82afc11** (109 lines), in my own detached worktree `t180-wt-e489`, removed after (§6). Nothing else was touched.
Rendering technique and cost are C's part 2, and are not covered here.

Each fact names its source. Where the source is weak, a summary, or not the primary paper, the line says so.

## 0. The short of it, for the design note

1. **The flat starburst is a geometry error, not a style.**
   - A real corona is perspective on parallel field-aligned rays, each about 1–2 km wide and tens of km tall, seen from beneath ([UAF GI, *Auroral rays*][uaf-rays]; [WMO glossary via OQLF][oqlf]).
   - Each ray's bright green **base** is far from the convergence point, and its faint upper end lies near it.
   - Our corona has it backwards: it is brightest and green at the centre and turns violet outward (aurora.js:85–86). It is also a fan with no curtain under it (:67–88), and the curtains themselves are faded out before the zenith (:14, :96).
2. **The deeper miss is the shape of the curtains, not their speed.**
   - Real arcs run roughly magnetic east–west, from horizon to horizon ([UAF GI, *Auroral arcs and bands*][uaf-arcs]). Seen from the ground, each is a band that rises from one horizon, crosses the sky and sets at the other.
   - Ours are three rings at a constant 13–17° elevation, closing round all 360° of azimuth (:13, :97–99).
   - The folds are two global sine waves (k = 2, 5) of 0.16 rad (:50). Real folds are about 10–20 km structures riding on a much longer arc ([Kataoka et al. 2021][kataoka]).
3. **The plan's premise that the motion was "slowed" is half right.**
   - checked (`S\..\d489-rates.out`; geometry with Earth's radius and a 110 km lower border): our fold cap of 0.0042 rad/s (:11, :50) at the near curtain's 17° hem is **about 1.5 km/s of real motion**. That is already inside real fold speeds (§1.4).
   - What is slow is the **rays**: under 0.001 rad/s, about 0.35 km/s (:11, :53). So is the **brightness**: it breathes over four minutes, at ≤ 15% a second (:11).
   - Real aurora is **multi-scale**:
     - a large arc that barely drifts (about 0.1 km/s; [Kataoka et al. 2021][kataoka], "Vd ∼100 m/sec");
     - fine rays and curls running along it at km/s ([UAF GI, *Auroral rays*][uaf-rays]);
     - brightness that changes in seconds (pulsating patches 2–20 s; [UAF GI, *Pulsating aurora*][uaf-puls]; [NASA NTRS 2010][ntrs2010]).
   - inferred: "fluid" lives in that layering. Speeding up the whole sky would not give it.
4. **"Fluid" and "quiet behind the work" (:10–12) can both hold.** The arc and the corona stay slow and still. The fluid motion goes into the fine structure along the hem, low in contrast. Speed and contrast are separate dials (§3).

## 1. The sourced account

### 1.1 Forms

| Form | What it is | Figures | Source |
|---|---|---|---|
| **Arc** | a long band, roughly magnetic E–W, horizon to horizon | thickness "as little as 100 metres"; lower edge "typically 80 to 120 km" up; upper edge "usually 10 to 100 km above that" | [UAF GI, *Auroral arcs and bands*][uaf-arcs] |
| **Band** | an arc with non-uniform curvature, often brighter | "usually signifies that the overall display is becoming more active" | [UAF GI][uaf-arcs] |
| **Rays and curtain (drapery)** | rays along the magnetic field; many tall rays read as "a curtain of cloth folds" | rays are "tightly wound up spirals … only a kilometer or two across" | [UAF GI, *Auroral rays*][uaf-rays]; [NOAA SWPC][noaa] |
| **Folds** | an arc distorted at an intermediate scale | typical scale ∼10 km | [Kataoka et al. 2021][kataoka] |
| **Curls** | km-scale vortices in an arc; clearly seen only in small-angle cameras pointed at the magnetic zenith | 1–5 km | [Kataoka et al. 2021][kataoka]; curls 1–5 km cited to Hallinan & Davis 1970 via [UAF/NSF][nsf] (secondary) |
| **Spirals** | large vortices | 20–1,300 km across (Davis & Hallinan 1976) | secondary, a search summary of [Nowada et al., arXiv 2205.00244][nowada]; not read in the primary |
| **Fine structure** | filaments inside arcs | minimum width 70–90 m; mesoscale arc widths 10–30 km | [Kataoka et al. 2021][kataoka] |
| **Corona** | rays seen from beneath, converging on the magnetic zenith by perspective | — | [WMO definition via OQLF][oqlf]; [UAF GI, *Auroral rays*][uaf-rays] |
| **Diffuse and pulsating patches** | late-night cloud-like patches that blink on and off for hours | see 1.4 | [NOAA SWPC][noaa]; [UAF GI, *Pulsating aurora*][uaf-puls] |
| **By time of night** | evening arcs; near midnight arcs "twist and sway"; at a substorm peak arcs "expand across the sky and become very bright"; early morning diffuse patches that "blink on and off for hours" | — | [NOAA SWPC][noaa] |

The ground observer's own scale (shape A arc, B band, C corona, D drapery, R rays; structure H homogeneous, R rayed, P pulsating, D diffuse) is in [IPS/BoM, *Characterising the Aurora*][ips].

### 1.2 Colours by altitude, and what the eye sees against the camera

| Emission | Altitude | What makes it | Source |
|---|---|---|---|
| **Green, OI 557.7 nm** | peaks about **114–115 km** (mean 114.84 ± 0.06 km) | atomic oxygen; the brightest line | [Whiter et al. 2023, *Ann. Geophys.* 41:1][whiter] |
| **Blue, N₂⁺ 427.8 nm** | peaks at nearly **the same height**, about 116.5 km (mean 116.55 ± 0.07 km) | ionised molecular nitrogen | [Whiter et al. 2023][whiter] |
| **Red, OI 630.0 nm** | **above about 200 km** (quenched by collisions lower down) | atomic oxygen, metastable, about 110 s lifetime | lifetime and quenching: [Universalis][universalis] (encyclopedia), the Io-aurora model in [arXiv 2508.04807][io] (about 200 km minimum); a primary aeronomy text was not read |
| **Pink or magenta lower border** | the lowest edge of active curtains | molecular nitrogen; appears when energetic electrons reach low | [NASA image caption, via search][nasa-pink] (secondary); [Lancaster AuroraWatch UK][aw] |

- **The vertical order in a real curtain**, bottom to top:
  1. a pink or magenta fringe, only in active, energetic aurora;
  2. a bright green lower part, with the blue N₂⁺ light **at the same height** (not above it);
  3. green fading upward;
  4. **red** in the high tops above about 200 km.
- There is no violet band between the green and the red.
- **Eye against camera** ([IPS/BoM][ips], an Australian government sheet; [IAGA Resolution 4, 1973][iaga]):

| IBC class | Brightness of 557.7 | Like | Colour to the eye |
|---|---|---|---|
| I | 1 kR | the Milky Way | "No colour apparent" (grey-white) |
| II | 10 kR | thin moonlit cirrus | at most a faint yellow-green |
| III | 100 kR | moonlit cumulus | green is seen |
| IV | 1,000 kR | the full moon; casts shadows; "very rare" | full colour |

  - A 1971 RSRS newsletter puts colour perception only above IBC III ([RSRS 1971][rsrs]).
  - The eye's night sensitivity favours green and is weak in red ([Universe Today][ut], popular; [Discover][disc], on the Purkinje shift).
  - **So, by eye:** most aurora is grey-white to pale green. The red tops, the blue and the purple show mainly on long camera exposures, except in bright displays.
  - **By camera:** green, red tops, and violet or purple edges are all present.
  - inferred: a sky that shows saturated violet and red-pink at ordinary brightness is drawing the **camera** aurora, not the eye's. That is a taste call for the keeper (§4).

### 1.3 The corona, as a perspective effect with depth

- **Definition:** rays "extending to the magnetic zenith, in parallel lines along the geomagnetic lines of force, and appearing by perspective to diverge from the magnetic zenith" ([WMO via OQLF][oqlf]).
- **It is not a thing in the sky.** It is the vanishing point of parallel field-aligned rays seen from beneath. Each ray runs from about 100 km up to 110–220 km ([UAF GI][uaf-arcs]). Under perspective, a point higher up the ray appears **closer to** the magnetic zenith.
- So, inferred from that geometry:
  - **(a)** each ray's bright green lower end sits **farther out**, and its faint (red) upper end runs **inward** toward the point;
  - **(b)** the centre itself is **faint**, because only the ray tops reach it;
  - **(c)** the rays have different lengths and start at different radii, because their bases are at different places and heights, so the fan is ragged, not a regular wheel;
  - **(d)** a corona appears only when a rayed curtain is overhead, as "the precipitation region is passing directly overhead" ([SPA][spa]; secondary);
  - **(e)** viewed from directly overhead, rays "don't look like rays anymore" ([UAF GI, *Auroral rays*][uaf-rays]).
- **The magnetic zenith is not the zenith.** It is 90° minus the local dip angle away from it. For UK observers it is 18–25° south of the zenith ([SPA][spa], secondary).
  - inferred: it is about 12–13° at 65° N magnetic latitude, from a dip angle of about 77°. I did not run the NOAA field calculator.
  - Ours sits 25° from the zenith (checked: `S\..\d489-rates.out`, from C at :71). That is plausible for a mid-latitude viewer.

### 1.4 Motion in real time, with figures

The angular rates are checked (`S\..\d489-rates.out`): v divided by the slant range to a 110 km lower border on a 6,371 km Earth. The range is 347 km at 17° elevation, 215 km at 30° and 110 km overhead.

| Motion | Real figure | Source | What it is in our sky's units |
|---|---|---|---|
| **A quiet arc's drift** | about 0.1 km/s ("Vd ∼100 m/sec") | [Kataoka et al. 2021][kataoka] (a parameter in an instability estimate, not a survey) | 0.0003 rad/s at 17°; 0.0009 overhead |
| **Folds travel** | 0–5 km/s | secondary: a search summary of the review in [Nowada et al.][nowada]; not read in the primary | up to 0.014 rad/s at 17°; 0.045 overhead |
| **Curls, and rays sweeping along an arc** | 0–22 km/s (curls, same secondary source); rays "at speeds one hundred times that of a jet aircraft", forming "sometimes in a second or so" | [UAF GI, *Auroral rays*][uaf-rays] | up to 0.06 rad/s at 17°; 0.18 overhead |
| **A 1-km structure** | crossed or lived in about 1 s | [Kataoka et al. 2021][kataoka] | — |
| **Ray flicker (flickering aurora)** | 3–15 Hz, usually about 10 Hz, in patches 1–12 km across; up to 60–80 Hz in sCMOS data | [Kataoka et al. 2021][kataoka] | faster than a calm display should carry; see §3 |
| **Pulsating patches** | on and off every 2–20 s, most commonly 6–10 s, each patch on its own clock; faint; midnight to dawn | [UAF GI, *Pulsating aurora*][uaf-puls]; [NASA NTRS 2012010325][ntrs2010] (2–20 s, 8 s average); [NASA/UAF 2022][uaf-rocket] | — |
| **Substorm expansion** | azimuthal expansion about 8.8 km/s westward and 5.3 km/s eastward; westward traveling surge about 2 km/s; poleward arc motion about 3 km/s; typical expansion about 7 km/s | conference abstracts, via search ([JpGU 2010][jpgu]; [SGEPSS][sgepss]), not refereed papers | at 7 km/s, a 1,000 km arc system crosses in about 2.5 min |
| **Real time against time-lapse** | many aurora videos are time-lapse from 20–30 s exposures; "you can't see it this way with the naked eye" | [Space.com, Halverson][spacecom] (journalism); forum accounts | inferred: our viewers' idea of "fluid" may be time-lapse-shaped |

## 2. What aurora.js (82afc11) gets wrong against this, by line

| Line | What it does | Against the real thing |
|---|---|---|
| **:2–3, :13, :97–99** | three curtains are rings round all 360° of azimuth, at a constant 13–17° hem, closing with no seam | Real arcs are long E–W bands, horizon to horizon ([UAF][uaf-arcs]). Seen from the ground, an arc rises from the east horizon to a highest point and sets in the west. It never circles the viewer. **The largest lifelike miss.** |
| **:50** | folds are 0.16 rad × sin(2 az) + 0.06 × sin(5 az): two global waves | Real folds are about 10–20 km on a 1,000 km arc, so many small irregular ones. Curls 1–5 km ride on those ([Kataoka][kataoka]). |
| **:43–47, :53** | rays are three regular sine combs drifting at under 0.001 rad/s (about 0.35 km/s) | Real rays are 1–2 km columns that move sideways along the arc at km/s, and form in about a second ([UAF][uaf-rays]). |
| **:11** | brightness breathes over at least 4 min, at ≤ 15% a second | Real brightness changes in seconds: pulsating patches go on and off every 2–20 s ([UAF][uaf-puls]), and substorm brightening comes in steps. |
| **:5–6, :61–62** | the hem is green, violet above it, then red-pink at the top | Real: green with blue at the same height, then red above about 200 km ([Whiter 2023][whiter]). The violet middle band is not physical. Saturated colour is camera-like (§1.2). |
| **:6, :63–64** | a thin pink fringe under the hem of a strong ray | Right in kind: N₂'s magenta lower border in energetic aurora ([AuroraWatch UK][aw]). The screenshot's magenta fringe along the lower bands is this term. inferred: it is drawn under every strong ray, at any brightness; in nature it comes only with active, bright displays. |
| **:6, :14, :67–88** | the corona is a 2D fan of sine combs (k = 13, 31, 59) in angle round a fixed point; nothing radial | It should be perspective on parallel rays with depth (§1.3): ragged, with bases at different radii. |
| **:85** | `reach` is brightest near C | The centre should be faint: only the ray tops get there (§1.3 b). |
| **:86** | hue is green at C, going violet outward | Inverted: the green bases are outward, the high red or faint tops are inward (§1.3 a). |
| **:102** vs **:96** | the corona is always on, while the curtains fade out from 60° to 77° (`clear`) | A corona appears only when a rayed curtain is overhead (§1.3 d). Here there is a corona with nothing under it, which is the screenshot's "flat starburst". |
| **:57–58** | `fold` and `span` brighten one side of the sky (k = 1, 2) | A real display is brightest where the arc is, which is low in the sky (toward the pole) for a viewer south of the oval. Partly right in spirit. |
| **:37** | stars twinkle at 0.7–1.8 rad/s | Fine. This brief does not cover stars. |

## 3. "Fluid" against "quiet behind the work" (:10–12)

- **The tension is real, but smaller than it looks.**
  - D403 asked that "nothing crosses the view in under four minutes" (:11–12).
  - Real **large** forms in a quiet display drift at about 0.1 km/s (§1.4), which crosses a 65° view in tens of minutes. So the slow, large shapes are the lifelike part, and D403's bound fits a quiet arc.
  - What our sky lacks is the **small, fast** layer: rays running along the hem at km/s, small folds and curls, and brightness that moves in seconds.
- inferred, a way to keep both:
  - **(1)** the arc's position and the corona's centre stay slow, inside D403;
  - **(2)** the fluid motion lives in the fine structure along the hem (ray shifts, small folds), and is kept **low in contrast and small in angle**, so it reads as the light being alive, not as a thing crossing the view;
  - **(3)** a slow pulsating patch field (2–20 s) is an option for "late night".
- **Flicker at about 10 Hz is the one real motion I would leave out.** inferred: it is what the eye catches most, so it would not stay behind the work.
- **A falsifier for the design note, registered now:** if the reworked sky with fine motion draws the eye away from the road in the keeper's own use, then "fluid" and "quiet" do not square by contrast alone, and one of them has to give. The look is his.

## 4. Premises in the plan

- **"The starburst is by design" (plan; :6): right.** It is a designed 2D fan. But it is also inverted in colour and brightness (§2, :85–86), and it floats with no curtain under it. So "bugged out" is a fair reading of a real error, not only of taste.
- **"The motion was deliberately slowed" (plan; :10–12): partly wrong.**
  - The fold speed is already in the real range (about 1.5 km/s, §0.3).
  - What is missing is **multi-scale** motion and fast brightness change.
  - A design that only raises speeds would make the rings slosh faster, not look alive.
- **"Colours by altitude: 557.7 green at about 100–150 km, 630 red above, N₂ blue/purple lower edge" (plan, Part 1): mostly right, one correction.**
  - The **blue** N₂⁺ 427.8 nm light peaks at nearly the same height as the green, about 116 km ([Whiter et al. 2023][whiter]). It is not a lower edge.
  - The **lower edge** colour in energetic aurora is the pink or magenta of molecular nitrogen.
- **Not covered here, for C:** the rendering technique, its cost, and whether a perspective corona is affordable.

## 5. Sources

[kataoka]: https://pmc.ncbi.nlm.nih.gov/articles/PMC8550089 "Kataoka et al. 2021, Small-Scale Dynamic Aurora, Space Sci. Rev. 217:17, doi 10.1007/s11214-021-00796-w"
[whiter]: https://angeo.copernicus.org/articles/41/1/2023/angeo-41-1-2023.html "Whiter, Partamies, Gustavsson, Kauristie 2023, The altitude of green OI 557.7 nm and blue N2+ 427.8 nm aurora, Ann. Geophys. 41:1–12"
[uaf-rays]: https://www.gi.alaska.edu/alaska-science-forum/auroral-rays "UAF Geophysical Institute, Alaska Science Forum: Auroral rays"
[uaf-arcs]: https://www.gi.alaska.edu/alaska-science-forum/auroral-arcs-and-bands "UAF Geophysical Institute, Alaska Science Forum: Auroral arcs and bands"
[uaf-puls]: https://www.gi.alaska.edu/alaska-science-forum/pulsating-aurora "UAF Geophysical Institute, Alaska Science Forum: Pulsating aurora"
[uaf-rocket]: https://uaf.edu/news/rocket-to-launch-in-probe-of-mysterious-pulsating-aurora.php "UAF/NASA 2022: rocket to probe pulsating aurora"
[noaa]: https://www.spaceweather.gov/phenomena/aurora "NOAA SWPC: Aurora"
[ips]: https://www.sws.bom.gov.au/Category/Educational/Space%20Weather/The%20Aurora/Aurora.pdf "IPS Radio and Space Services (Australian Government): Characterising the Aurora"
[iaga]: https://www.iaga-aiga.org/index.php?id=res4-73 "IAGA Resolution No. 4 (1973): Brightness of auroras"
[rsrs]: https://www.dittonpark-archive.rl.ac.uk/newsletters/Radio_and_Space_Research_Station/1971/RSRS_Newsletter_197104_No119.pdf "RSRS Newsletter 1971 No. 119 (via search summary)"
[oqlf]: https://vitrinelinguistique.oqlf.gouv.qc.ca/fiche-gdt/fiche/26513538/couronne-aurorale "OQLF term record, auroral corona (WMO definition), via search summary"
[spa]: https://www.popastro.com/aurora/?p=35 "Society for Popular Astronomy, aurora section (via search summary)"
[ntrs2010]: https://ntrs.nasa.gov/api/citations/20120010325/downloads/20120010325.pdf "NASA NTRS 20120010325 (pulsating aurora periods 2–20 s, via search summary)"
[nowada]: https://arxiv.org/abs/2205.00244 "Nowada et al., arXiv 2205.00244 (fold and curl speeds and scales, via search summary of its full text; not read in the primary)"
[nsf]: https://par.nsf.gov/servlets/purl/10475668 "NSF PAR (curls 1–5 km cited to Hallinan & Davis 1970, via search summary)"
[universalis]: https://www.universalis.fr/encyclopedie/aurore-polaire/3-spectres-et-mecanismes-d-emissions/ "Encyclopaedia Universalis, Aurore polaire (red-line quenching)"
[io]: https://arxiv.org/pdf/2508.04807 "arXiv 2508.04807 (630 nm minimum altitude about 200 km, via search summary)"
[aw]: https://wp.lancs.ac.uk/aurorawatchuk/2017/05/10/the-vivid-lights-what-causes-the-colour-of-the-aurora/ "Lancaster University AuroraWatch UK: what causes the colour of the aurora"
[nasa-pink]: https://wikiarchives.space/album/8421/media/682356 "NASA image caption (pink nitrogen lower border), via search summary"
[ut]: https://www.universetoday.com/105496/technicolor-auroras-a-reality-check "Universe Today: Technicolor auroras? A reality check (popular)"
[disc]: https://www.discovermagazine.com/skylights-15450 "Discover: Skylights (Purkinje shift, popular)"
[jpgu]: https://www2.jpgu.org/meeting/2010_disc1/program/PDF/P-EM022/PEM022-13_e.pdf "JpGU 2010 abstract (substorm expansion speeds, via search summary)"
[sgepss]: https://sgepss.org/OLD/sookai/128/html/program/pdf/B006/B006-03.pdf "SGEPSS abstract (azimuthal expansion speeds, via search summary)"
[spacecom]: https://www.space.com/14803-night-sky-time-lapse-video.html "Space.com: time-lapse of the night sky (Halverson)"

- **Read in full or in the part cited:** Kataoka 2021 (PMC; the first 100,000 characters), Whiter 2023, the three UAF Alaska Science Forum pages, NOAA SWPC and the IPS/BoM sheet.
- **Known only from a search summary,** so weaker, and marked so in the tables: the fold and curl speeds, spiral sizes, red-line altitude, substorm speeds, the corona's definition, and the IBC colour thresholds beyond IPS.

## 6. Checks and corrections

- checked: `aurora.js` read with `cat -n` at 82afc11 in `C:\Users\nname\Downloads\t180-wt-e489` (detached). The worktree was removed after with plain `git worktree remove`: no file changed, 0 reparse points.
- checked: every angle and rate in §0, §1.3 and §1.4 is from one script run (`S\..\d489-rates.out`, S = my scratchpad). That includes the hem elevations 12.9 / 14.9 / 17.2°, `clear` 60–77°, C 25° from the zenith, and the fold cap at about 1.46 km/s.
- **The fold and curl speeds (0–5 and 0–22 km/s) come from a search summary of a paper I could not open,** and are not Hallinan & Davis 1970 read in the original. The UAF ray figure ("one hundred times … a jet aircraft", about 25 km/s) agrees with the curl figure in size. Treat the exact bounds as unverified.
- My first search on the colours returned blogs. The colour-altitude facts above rest on Whiter et al. 2023 and the UAF, NOAA and IPS pages instead.

## 7. Addition (the plan's "Added, 06:47", librarian 8fffce8c): colour shifts over time, and a 10-minute cycle

The keeper's word: "how about, the aurora can slowly change colors over like 10mins".

### 7.1 Which colour shifts real aurora make, and over what time

| Shift | When, and how long | Source |
|---|---|---|
| **Green-dominant quiet arcs → bright, dynamic display → diffuse, pulsating green**, the substorm cycle | Growth phase "typically about one hour" ([Ann. Geophys. 31:835, 2013][ag2013]); about half an hour in the THEMIS volume ([Burch & Angelopoulos, *The THEMIS Mission*][themis]). Then expansion, when "bright, dynamic auroral displays appear" ([THEMIS volume][themis]). The whole response lasts "a few hours" ([ag2013][ag2013]). Recovery: diffuse patches that "blink on and off for hours", early morning ([NOAA SWPC][noaa]). | refereed paper; book; NOAA |
| **Red tops brighter as activity rises; all-red aurora** | Red comes from low-energy electrons at 200–500 km. "All-red auroras are seen near the beginnings of large magnetic storms", and are "infrequent" ([UAF GI, *Red aurora*][uaf-red]). Storm-time red is tied to "storm-time substorms" (Japanese low-latitude studies, via search summary). | UAF; search summary |
| **How fast red follows** | The 630 nm state lives about 110 s before it emits (§1.2). inferred from that lifetime: the red tops answer a change over a minute or two, smeared, never in a flash. Red-line aurora "evolve[s] distinctly" from the other emissions ([Liang et al. 2019, JGR, via Eos][eos]). | lifetime: §1.2's sources; Eos |
| **Pink or magenta lower edges** | Red and blue together make magenta "on the leading edge of rapidly moving auroral features". The type-B red lower border sits at 60–85 km, is "always bright, IBC III or greater, active and usually of short duration" (via search summary of [*Planet. Space Sci.* 1968][pss1968] and [EarthRef][earthref]). So these come in seconds-to-minutes bursts with fast motion, not as a steady tint. | search summary of refereed sources |
| **Red-to-green ratio in pulsating patches** | Some patches show an "enhanced red-to-green color ratio during their on time" (REGO, electrons under 1 keV; via search summary), so the ratio changes on the 2–20 s pulse. | search summary |

### 7.2 Where a 10-minute cycle is true to life, and where it is invention

- **True to life, in magnitude: a slow swing in the balance between green and red-topped.**
  - A display that goes from quiet green to bright with red tops and back moves on a scale of tens of minutes to hours (7.1).
  - One swing over about 10 minutes is about the length of an expansion's brightening and fading. It is a plausible pace for "the display grows active, then settles".
  - Red that answers slowly, over a minute or two, is physical (the 110 s lifetime).
- **Invention, said plainly:**
  - **(a) A periodic cycle.** Real colour change follows activity. It does not repeat on a clock: growth phases run from half an hour to 9 h ([ag2013][ag2013]: "as long as 9 h").
  - **(b) A hue path through colours aurora does not make.**
    - The palette the plan names, "green → teal → violet → rose", is not an emission sequence.
    - Teal is what green plus the co-located N₂⁺ blue looks like on a camera.
    - Rose is the magenta lower edge, a brief burst, not a whole-sky state.
    - Violet as the main colour of a whole curtain does not happen in nature.
  - **(c) The whole sky shifting hue together.** In a real display the hem stays green while the tops redden. The colour change is **vertical and local**, not a global tint.
- **The answer:**
  - A 10-minute **slow drift of how red-topped and how pink-edged** the curtains are, with the hem staying green, is lifelike if it is not strictly periodic.
  - A 10-minute **periodic hue cycle** through teal, violet and rose is invention. It can still be a good choice for the room's look, and that is the keeper's call. The design note should say which of the two it offers.
- **One taste point for the note.** Whether the drift follows **eye colours** (mostly green, red only in bright moments, §1.2) or **camera colours** (vivid red and violet) changes how far the swing can go before it stops reading as an aurora.

[ag2013]: https://angeo.copernicus.org/articles/31/835/2013/ "THEMIS and ground-based observations of successive substorm onsets following a super-long growth phase, Ann. Geophys. 31:835, 2013"
[themis]: https://link.springer.com/book/9780387898193 "Burch & Angelopoulos (eds.), The THEMIS Mission, Springer (via search summary)"
[uaf-red]: https://gi.alaska.edu/alaska-science-forum/red-aurora "UAF Geophysical Institute, Alaska Science Forum: Red aurora"
[eos]: https://eos.org/editor-highlights/red-and-green-aurora-stop-and-go-for-different-reasons "Eos editor's highlight of Liang et al. 2019, JGR 124, doi 10.1029/2019JA026679"
[pss1968]: https://spacewx.com/wp-content/uploads/2024/02/P_HEL_PSSD_E_PSS_1968.pdf "Planet. Space Sci. 1968 (type-B aurora), via search summary"
[earthref]: https://earthref.org/ERR/27742 "EarthRef reference (magenta on the leading edge of moving features), via search summary"

- checked: the UAF *Red aurora* page and the Eos highlight were read. The Eos page gives no timescales.
- **Known only from a search summary,** and marked so: the growth-phase lengths, the type-B figures, the magenta leading edge, the pulsating red/green ratio.
- I found no time-resolved red/green ratio across a substorm, so 7.1's "tens of minutes" is the substorm phase lengths, not a measured colour curve.
