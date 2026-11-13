# Research: how low-poly assets read as realistic (scout, 2026-11-13)

Research only. Nothing built or run. Marks: [read: URL] I opened and read it. [summary: URL] a search snippet or secondary article only. [inferred] my reasoning. [ours] no source. "Read" for PDFs means I downloaded the PDF and ran `pdftotext` on it (the Inside slides and the Team Fortress 2 paper).

## 0. What the room already has (not repeated)

- `briefs/dreamzone3_design.md:18` says the grade already has vignette, contrast, grain, chromatic aberration, split tone. `:244` says effects map to renderer passes and add no rays; the worst rooms are at 2.8-2.9 ms against 2.78.
- `loop/buildpath_look_fear_2026-11-13.md:20` (his item 75): "pseudo photoreal, like stylized hyperrealism through rendering tricks"; `:44` grain, chroma, VHS and flash are out under 75; noise lives on surfaces only. `:19` (item 63): the raytraced light was "too grainy". `:46`: the dither is interleaved gradient noise, not true blue noise. `:30`: lamp kelvin per place, dead lamps, lamp-coloured fog, halation, procedural surfaces, render scale 0.75 already on main.
- `loop/buildpath_entity_bodies_2026-11-13.md:25,30`: the hunter is 138,048 triangles, the made sprinter 105,788; kid plus hunter cost 0.39 ms average and about 0.45 ms left at the worst frame. `:42` (call 2): "the nearest two or three skinned at full detail, the rest a lite copy", with a pop risk. `:39`: LOD for several skinned bodies is listed unresearched. `:36`: uncanny sources, "a clear mismatch between a human body and its motion is the supported cue".
- Both buildpath files carry second-reader verification notes with a few wrong line numbers; I used them only for what they say about the team, not as outside sources.

## 1. Techniques: cost, art need, and how each reads in the dark

Costs are what the sources give; where none is given I say so. The game's budget is 2.78 ms for the whole frame, so "cheap" must be read against that.

| Technique | GPU / CPU cost | Art pipeline needs | In near-darkness | Source |
|---|---|---|---|---|
| Lighting-first (hand-placed light, fog, decals on simple rooms) | Inside used decals for bounce, specular, rim, AO and cast shadow, "no global illumination or even automated AO". Cost not stated. | A lighting artist placing effects by hand; detail tuned by distance and importance | Strong: the simple room "owes everything to detailed lighting" | [read: https://blog.playdead.com/articles/the_lighting_of_inside/lighting_of_inside.html] |
| Fog as the main mood tool | Inside: "simple linear fog", clamped to a maximum so bright lights bleed through; early scenes were "literally just fog + silhouettes". Local fog volumes added later for control (light caught in a box volume, half-res buffer). Cost: volumetric version was slow until blue-noise sampling cut samples; a 128-sample case was too slow; ~3.2 ms in one case before the fix. | Artists set fog colour per area | Strong: depth falls off, silhouettes read against it | [read: https://loopit.dk/rendering_inside.pdf] |
| Normal maps baked from high poly | Texture sample and a tangent-space transform per pixel; no number found | High-poly sculpt, UVs, cage and bake; match the tangent basis between baker and engine; a flat test bake first | Needs a light to show; in the dark only lit patches show detail. Normal maps do not change the silhouette | [summary: https://docs.marmoset.co/?p=1383] and Polycount posts (search results) |
| Strong silhouettes | None (it is design) | Distinct proportions per class; checked by viewing flat black | Best-sourced rule for the dark: TF2 characters are readable "even when viewed only in silhouette with no internal shading" | [read: https://www.cs.princeton.edu/courses/archive/fall07/cos597B/papers/mitchell-team-fortress.pdf] |
| Rim light / kicker | TF2: a rim term in the lighting formula, broad highlights masked by a Fresnel term, plus a dedicated rim term for characters away from lights. No ms given in what I read. | A rim mask texture per material (optional) | The paper's point is readability in difficult lighting; it "adds indirect light" look when the character is out of the lights | [read: same TF2 paper] |
| Limited palette | None | Palette authored per place | [inferred] fewer hues keeps contrast in the dark; no source read | [inferred] |
| Texel density choices | None found | One rule per asset class | Chunky low-res texture reads as "charming" and "super visible against the backgrounds" (Crow Country) | [read: https://www.nme.com/features/crow-country-ps1-horror-silent-hill-resident-evil-3617003] |
| Vertex-colour AO | Cheaper than a texture bake and a simple shader; only as smooth as the mesh is dense; texture AO is more accurate but costs more to bake and store. No runtime benchmark found. | Bake in the DCC; Blender 3.1/3.2 had a bug report for baking to vertex colour | Gives grounding in shadow; shows mainly in shadow when separate | [summary: Unity docs, VRED docs, Polycount (search results)] |
| Vertex lighting glow on one side | Per-vertex, cheap | None extra | Gives low-poly characters a lit side without lighting reliance | [read: https://www.dreadcentral.com/interviews/488403/inside-the-dollhouse-of-horrors-alisa-dev-casper-croes-shares-some-low-poly-tips-and-dishes-on-the-future-of-his-games/] (one developer's tip) |
| Dither (as quantisation fix) | Add noise before 8-bit write; Inside says "almost always dither any 8bit write"; triangular noise removes noise-modulation bands. Blue noise about 5% slower than interleaved gradient noise but needed far fewer samples. | Shader only | Dark gradients band badly without it | [read: https://loopit.dk/rendering_inside.pdf] |
| Dither / posterise as visible style | Obra Dinn: dithering gave tone from two colours, flickered in motion, so Pope moved from Bayer to his own blue-noise variant and remapped the pattern on a sphere to stay stable | Whole look built around it | [inferred] a visible pattern fights TAA and the team's complaint about grain | [summary: https://www.pcgamer.com/lucas-pope-on-the-challenge-of-creating-obra-dinns-1-bit-aesthetic] |
| Film grain | No source I read gives a cost. Buckshot Roulette is said to use a CRT shader with grain and vignette that hides low-poly flaws. | Post pass | Hides banding; conflicts with his items 63 and 75 | [summary: https://foro3d.com/en/2026/mayo/como-buckshot-roulette-recrea-el-terror-industrial-de-los-90-en-godot.html] (translated blog, weak) |
| Raytraced or baked GI on simple geometry | Not found in a developer source for a low-poly horror game. | | | not found |

## 2. Shipped examples: confirmed, partly confirmed, or dropped

| Game | What I could verify | Verdict |
|---|---|---|
| Inside | Primary: Playdead lighting article and the GDC 2016 slides (above). Hand-placed lighting, simple fog, blue-noise sampling for volumetric light, dither on every 8-bit write. Slides do not mention film grain. | CONFIRMED, primary [read] |
| Team Fortress 2 (added; not on the list) | Primary paper: distinct silhouettes, rim highlights instead of dark outlines, warped diffuse lighting. Not low-poly horror, but the best source on readability. | CONFIRMED, primary [read] |
| Crow Country | Developer quotes in NME: chunky models are "super visible against the backgrounds"; "less is more"; photoreal characters leave no "room for the imagination". Sourcegaming: models inspired by Final Fantasy VII field models. A review says they are animated more smoothly than the PS1 could manage. No lighting method found. | PARTLY: the why is confirmed [read], the how is not |
| Signalis | Reviews say blocky models with modern lighting and a CRT mode, Unity engine (Wikipedia via search). The Vice interview I opened has no visual content; the Zwerger interview URL returned 404. | NOT CONFIRMED beyond engine and a CRT mode [summary] |
| Buckshot Roulette | Developer's own 80.lv interview: Blender, Paint.NET, Texture Ripper, photographed textures; nothing on lighting or shaders [read: https://80.lv/articles/buckshot-roulette-developer-on-making-the-game-solo-feedback-success]. MagicaVoxel and the CRT shader come from one translated blog only. | PARTLY; the voxel and shader claims are single-source |
| Iron Lung | Reviews: low-resolution camera, single porthole, chunky polygons; a translated blog says Blender and Aseprite. No developer account found. | NOT CONFIRMED as a technique source [summary] |
| Lethal Company | Reviews describe low-poly assets with modern rendering, deep shadows and fog limiting what you see; the developer rarely gives interviews. | NOT CONFIRMED; drop as a technique source, keep only as a look reference [summary] |
| Dollhouse-style indie (Alisa) | One developer's tips: vertex lighting, blob shadows, environment must not be more detailed than characters, no IK, animate "almost like stop-motion". | Read, but one developer's opinion |

Cross-check of the list: nothing on it was proven false, but only Inside has the talk-level evidence the owner's direction needs. Inside is also 2D-plane side-scrolling with a fixed camera; its decal lighting leans on a known camera (the article says so), which a first-person game does not have [inferred].

## 3. Level of detail for groups of characters

| Item | What a source says | Source |
|---|---|---|
| Hide a swap with a hysteresis margin | Godot: with fade off, a begin/end margin stops rapid back-and-forth switching near a boundary; best performance because no transparency | [read: https://docs.godotengine.org/en/stable/tutorials/3d/visibility_ranges.html] |
| Hide a swap with a dither cross-fade | Faster than alpha blending, no sorting glitches; drawback: visible noise during the fade, less visible at high resolution or with TAA; each material fades in one direction so it suits two LODs | same Godot page [read] |
| LOD cross-fade with ray tracing | Ray Tracing Gems II ch. 26: rasterization and ray tracing use the same random number and a per-object transition factor f in [0,1] so both agree on which LOD shows | [summary: search result, link.springer.com chapter 10.1007/978-1-4842-7185-8_26, paywalled redirect] |
| Animation update rate by tier | Lowest LOD at 4 fps (EPFL crowd paper); every 2nd, 4th or 8th frame (practitioner guide); reduced rates for characters in the periphery of view without users noticing (Leeds whitepaper); bones from about 120+ near to 8-12 far (plugin guide) | [summary: https://infoscience.epfl.ch/record/99010/files/Heras_and_al_VSMM_05.pdf, https://mocaponline.com/blogs/mocap-news/animation-lod-performance-guide, https://eprints.whiterose.ac.uk/id/eprint/233099] |
| Share work across identical bodies | Instancing, baked vertex-animation textures | [summary: same mocaponline guide] |
| Perception | The only user-study claim: peripheral agents can be slowed to a stop unnoticed. Not tested on a chaser the player is fleeing. | [summary] |

[inferred] A hunter that is the only high-detail body, plus lesser kinds at lower detail, matches "nearest few at full detail" in structure. The sources do not say how many bodies a budget of a few ms allows; that is a measurement for the team.

## 4. What makes a low-poly humanoid uncanny in a good way

- Mismatch of realism between parts is the supported cue: eye and face with different realism "especially prone to make a character eerie", and "similar levels of eye photorealism and face photorealism were rated more positively than dissimilar levels" [read: https://pmc.ncbi.nlm.nih.gov/articles/PMC4264966; first 100,000 of 145,497 characters read].
- Enlarging the eyes 50% made faces eerier and less natural, most on photoreal skin [read: same page].
- The same paper: "a CG face is not necessarily eeriest when it looks nearly human", and backing away from photorealism "can sometimes make a CG character less eerie" [read: same].
- Motion and appearance mismatch disturbs perception of android-like characters (Saygin 2010, via a review) [summary: https://www.tara.tcd.ie search result]; a 2026 preprint says the effect depends on cue reliability, so it is not universal [summary].
- Animation flaws are tolerated less on realistic characters than on stylised ones [summary, same results].
- Developer view: no face detail "leaves room for the imagination" [read: NME, Crow Country].
- Caveat: these studies are of faces on screen, not of a figure seen for a moment in a dark corridor. No source tested a short, dim, fast encounter [inferred gap].

## 5. Style guide draft: 8 to 12 rules

1. Design the hunter's silhouette first and test it flat black at 10 m; the lesser kinds must each differ from it and from each other in black silhouette. [read: TF2 paper] (Inside article and TF2 both lean on this idea.)
2. Spend the detail budget on light and fog, not polygons: simple geometry plus carefully shaped light, fog and shadow is what Inside shipped with. [read: Playdead article and slides]
3. Fog is a design tool, not a fix: simple, clamped so bright sources punch through, tinted by the nearest lamp. [read: Inside slides] The team already has lamp-coloured fog (`buildpath_look_fear:30`).
4. Give every character a rim or kicker term so it separates from a dark wall even when no lamp is near; keep it broad and low, masked by a Fresnel term, rather than a dark outline. [read: TF2 paper]
5. Bake high-poly detail into normal maps for the hunter only; keep the silhouette in the mesh because a normal map cannot change it. [summary: Marmoset docs, Polycount]
6. Keep eyes and skin at the same level of realism, and do not enlarge the eyes on a realistic skin. [read: PMC paper]
7. Do not let the environment be more detailed than the characters. [read: Dread Central, one developer; check against our own scenes]
8. Dither every 8-bit write to stop banding in dark gradients; if sampling noise is used, prefer blue-noise-like patterns to interleaved gradient noise or Bayer, which show structure. [read: Inside slides] This is a quality rule, not a visible-style rule.
9. Use dither or posterise as a visible style only if the owner picks it; sources say it flickers in motion unless built for stability. [summary: Pope] [ours]: not recommended given his items 63 and 75.
10. Swap detail by distance with a hysteresis margin and, for two-LOD cases, a dither cross-fade; fade the animation rate down the tiers, not just the mesh. [read: Godot docs] [summary: EPFL, mocaponline]
11. Keep lesser chasers one step less detailed but the same material and rim language as the hunter so they read as one family. [ours]
12. Let a body's one wrong motion or one wrong feature carry the uncanny, and keep the rest consistent. [read: PMC paper for the mismatch cue] [ours: the single-trait rule]

## 6. Six reference frames to show the owner (official pages only; I did not open images)

1. Inside, official page with screenshots and trailer: https://playdead.com/games/inside/
2. Crow Country, official: https://www.crowcountry.com/ (confirm it carries trailer and screenshots)
3. Signalis, official: https://signalis-game.com/
4. Lethal Company, Steam page trailer and screenshots: https://store.steampowered.com/app/1966720/Lethal_Company/
5. Iron Lung, Steam page: https://store.steampowered.com/app/1846170/Iron_Lung/ (the Steam link appeared in search results)
6. Team Fortress 2, for the silhouette and rim reading (not horror): https://store.steampowered.com/app/440/Team_Fortress_2/

I did not fetch these pages. The Iron Lung Steam link came from my search results; the others are from memory and [inferred] to exist. Check each before showing it.

## 7. What this means for our build

| Option | Cost | Needs |
|---|---|---|
| A. Keep the hunter at full detail; add a rim/kicker term and a silhouette test (flat black view at set distances) | Small shader term; rim cost not measured by any source I read; must be timed by D against the 0.45 ms left at worst frame (`buildpath_entity_bodies:30`) | Edit `render/` lighting for the body ray group; a capture row for the silhouette test |
| B. Reduce the lesser kinds by tier: mesh LOD with hysteresis plus animation update-rate tiers | Saves GPU skinning and CPU pose time; pop risk handled by margin and dither if two LODs | A lite mesh per kind (Blender); LOD logic in `stage.cpp`; timed run |
| C. Move detail from triangles to light and fog: more hand-set fog and lamp work, fewer polygons | Fog volumes were slow in Inside until blue noise cut the sample count | Their fog is already lamp-coloured; this option extends it |
| D. Replace interleaved gradient noise with a blue-noise-like pattern for the dither | Inside measured about 5% slower than IGN per sample but far fewer samples needed | A small shader change; the room already flags IGN (`buildpath_look_fear:46`) |
| E. Make a decision on how many triangles "low-poly" means for the hunter | None: it is a call | His call; see section 8 |

## 8. Where the sources disagree with the idea

- "Low-poly" against what the team has: the hunter is 138,048 triangles and the sprinter 105,788 (`buildpath_entity_bodies:25,30`). The sources are about deliberately chunky models. The owner's phrase "intelligent low-poly" fits the sources; the current assets do not. The sources do not say these counts are wrong, but they do not support high counts as the way to look realistic here.
- "Entities as detailed as can be" (his item 82, `buildpath_look_fear:22`) pulls the other way from the Crow Country developer, who says detail "doesn't leave room for the imagination" [read]. This is a tension, not a rule.
- Normal-map detail, which the owner's direction implies, does nothing in near-darkness except where light lands, and cannot fix a weak silhouette [summary]. Rim light and silhouette have the better source support for readability in the dark.
- Visible grain and dither are named as style options in the brief, but his items 63 and 75 reject grain on the world (`buildpath_look_fear:19,44`). Pope's dither needed special stability work [summary].
- The lighting-first approach in Inside rests on hand-placed decals and a known camera (the article says so). A first-person game with a raytraced renderer has neither; the sources do not cover raytraced light on simple geometry [inferred].
- Uncanny studies on faces suggest less realism can be less eerie; the owner wants uncanny on purpose. The studies say mismatch makes eeriness; they do not give a recipe for a scare [inferred].

## 9. Not read

- GDC 2016 Inside talk video (only the slides were read; slides have no film grain section).
- Signalis developer interviews (Zwerger URL 404; Vice read, no visuals); no Signalis rendering talk found.
- Crow Country lighting method; Iron Lung developer account; Lethal Company developer account; Buckshot Roulette shader details (translated blog only).
- Ray Tracing Gems II chapter 26 (paywalled; snippet only), Unity and Unreal LOD docs, any shipped crowd animation LOD talk.
- Zell and Botsch review and Saygin 2010 (via search snippet); Obra Dinn devlog (snippet only); Marmoset and Polycount pages (snippet only).
- PMC uncanny paper: last 45,497 characters not read.
- Official reference pages in section 6; nothing in section 6 was opened.
- The Dread Central page was read in full by the fetch tool's summary, but the exact developer quotes are the tool's paraphrase; treat the quotes as paraphrase until checked.
- Costs: no source gave millisecond figures for rim lighting, normal maps, vertex AO or grain; all such costs are unmeasured.
