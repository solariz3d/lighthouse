# Open-source sources for animating in code, two months on: craft and engines (the Third Place on L, 2026-11-28)

*Asked by him at 03:39: "do you think we could find and use more open source repos that help you learn how to animate with more
cohesion and detail beyond what we have now?" Two read-only research agents read the repositories through the GitHub API (no
clone, no install, nothing run); this note is the seat's condensing of their reports. Stars and dates are as GitHub gave them on
2026-11-28. Nothing here has been tried yet.*

## Part 1: craft

**Short answer.** `JohnHeibel/ClaudeAnimationBase`, the guide the seat has been using, has not changed since 2026-09-24. Three
repositories teach things that guide lacks: `buildwithhanif/claude-animation-skill` (detail), `cth9191/animate` (cohesion between
agents, and measured review), and `ledbetterljoshua/functional-emotions-video` (the seat's own pipeline, with a lighting model).

| repository | licence | stars | last push | draws with | what it adds |
|---|---|---|---|---|---|
| JohnHeibel/ClaudeAnimationBase | MIT | 3,315 | 2026-09-24 | p5.js + p5.brush | the baseline already in use; nothing new |
| buildwithhanif/claude-animation-skill | MIT | 188 | 2026-09-23 | Node canvas + ffmpeg | detail: layers per surface, falloff with depth, light as a multiply then a glow; a style bible |
| cth9191/animate | MIT | 2,329 | 2026-10-05 | canvas, Playwright + ffmpeg | chapter ownership and boundary contracts; a key-frame checklist; an automated review tool |
| ledbetterljoshua/functional-emotions-video | MIT (code only) | 81 | 2026-09-23 | its own WebGL2 brushstroke renderer | underpainting plus an additive light layer; palette arc; rigs that return joints; words as cues |
| i-afaqrashid/claude-animation-studio | MIT | 17 | 2026-09-24 | canvas in headless Chrome, audio in JS | one timeline for sound and picture, with sync measured on the final file |
| artemnovitckii/claude-animation-skills | MIT | 1,412 | 2026-11-17 | GSAP / HyperFrames templates, three.js | timing shots to a voice take and re-warping to a new take; little hand-authoring craft |
| dylantarre/animation-principles | MIT | 678 | 2025-12-30 | none (prose) | restates the twelve principles; adds little |
| feitangyuan/onetake | PolyForm Noncommercial 1.0.0 | 4,541 | 2026-11-19 | HTML/DOM | "carry": what survives each boundary (learn from, do not copy) |
| zhuyansen/awesome-claude-video-skills | CC0 (list text) | 2,922 | 2026-11-27 | a list of about 180 | the map |

### The ten things worth adopting (the agent's ranking; all MIT and copyable with attribution except number 8)
1. **Three layers per surface, falling off with depth.** "Every surface gets three layers: base → texture → edge. A flat fill is
   unfinished." The hero gets all three; the midground one texture; the background grain only, with a thinner, paler line. "If
   you can only afford two, drop nothing from the hero and simplify the background." (hanif, `SKILL.md`, `references/detail.md`)
2. **A style bible pasted verbatim into every painter's brief:** "Style bible (paste verbatim into every build session;
   paraphrasing it causes drift)". Paper, ink, at most six colours, line weight by depth, cast with scales. (hanif,
   `templates/beat-sheet.md`)
3. **Chapter ownership plus a boundary contract.** One file per agent; shared files read-only; each brief names "its bridge
   objects (what must be in frame at the boundary)"; the director tiles across every seam. (cth9191, `SKILL.md`)
4. **Underpainting plus an additive light layer.** Draw fully lit, darken the whole plate with a multiply, then add the light
   from its source; block light by repainting the silhouette in black on the light layer; "one lit direction for everything".
   "Colour grading after the fact can't give you a light source." (functional-emotions; hanif; afaq; artemnovitckii)
5. **A palette arc, and "Colour means one thing."** Name the colours for each chapter in the storyboard; reserve one colour for
   what the story follows. (functional-emotions `STORYBOARD.md`; cth9191 `grammar/FRAME.md`)
6. **Measured review.** A scan for dead beats over three seconds, the hero's anchor, text cut-off and overlap, cuts against the
   beat grid, one frame a second on a phone-sized sheet, and a frame hash that proves a change to a shared file left every
   other frame identical. (cth9191, `tools/review.mjs`, `tools/framehash.mjs`)
7. **One timeline for sound and picture, with words as cues.** "the voice is the clock": a beat starts about 0.3 s after a
   sentence ends, and the payoff goes in a pause before the line that names it; `when(word, after)` lands an action on a word;
   sync is verified on the final file. (cth9191; functional-emotions; afaq)
8. **Carry.** At every boundary, name what survives and moves across it: "If nothing survives, it is a slide change, whatever
   the rhythm." (onetake; noncommercial licence, so reworded, not copied)
9. **Where the beat sits and why a cut exists.** "The key beat of a shot sits in its middle, not at the end where the cut eats
   it." "A cut must add information. If the next shot shows the same thing bigger, move the camera instead." Every cut has a
   sayable reason. (hanif `templates/beat-sheet.md`; cth9191 `grammar/STORY.md`)
10. **Vary scale across the board,** including one extreme close-up, and give each chapter a signature that shows in a still:
    "Eras that differ only in motion look identical on a contact sheet". "A board where every panel uses the same framing is a
    slideshow." (cth9191 `grammar/FRAME.md`, `craft.md`)

Also sharp: "The busiest moment is not the loudest."; "Hard cuts land on finished frames."; "Cameras put a world point on a
screen point… never 'zoom about a point'." (cth9191 `craft.md`); the drawing on twos and the camera on ones (hanif); "value
contrast and clear shapes are everything", details under about 8 px dissolve; "Transitions: set up the next shot inside the
current one."; "Name the weakest shot and what would fix it".

### What not to adopt
- The fast pacing of the music-video repos ("Never let a shot sit still", shots of 1.4 to 4 s): this film is timed to reads.
- Hard cuts as the default, and everything on twos including the camera.
- Reel devices: sync gimmicks, pattern interrupts, creator-named style templates.
- Sub-frame motion blur from the noncommercial repo.

### Not read or verified
No code was run and no rendered output was viewed. `PDoomVideo` was not re-read and still shows no licence. Six entries of the
awesome list are named from the list's own descriptions only.

## Part 2: engines for a lit, three-dimensional look

**The need.** A 23-minute narrated film: a dark, warm, three-dimensional scene of candles and oil lamps (light that falls
off, soft shadows, glow, shallow depth of field, haze), slow camera moves, burned-in captions; every frame a function of time;
stills and strips quick to check; about 33,000 frames rendered in a few hours on an RTX 5070 Ti laptop or an RTX 5080 desktop.
The September film in this look used Three.js r186 with pmndrs postprocessing, rendered from Node through a headless browser.

| route | licence | install | how frames are made | lighting ceiling | main risk |
|---|---|---|---|---|---|
| **Three.js r187, own harness** | MIT (three), Zlib (postprocessing 6.39.6), CC0 (n8ao) | npm packages and a Chrome build | freeze the clock and the random source, call `render(t)`, capture; three's own tests do this | r187 ships examples for volumetric lighting from point and spot lights, screen-space global illumination, ambient occlusion, depth of field, bloom, contact shadows and a WebGPU path tracer | one third-party report that headless WebGPU capture on Windows comes out black |
| HyperFrames 0.9.104 (HeyGen) | Apache-2.0 | `npx hyperframes`, downloads a headless Chrome | seeks a paused timeline frame by frame | the same as three.js; 3D is one example | built for HTML motion graphics; its skill sends a usage note unless declined |
| Remotion 4 + @remotion/three | custom; free for individuals | npm, React, Chrome | `useCurrentFrame()` in parallel tabs | the same as three.js | a React layer that adds nothing for a 3D film |
| **Blender 5.3 or 5.2 LTS, headless** | GPL (the output is ours) | a portable zip of about 345 to 395 MB, with its own Python | `blender -b -P chapter.py -f N` | the highest: path-traced global illumination, real soft shadows, true volumetrics, physical depth of field | render time for 33,000 frames; no per-frame times could be found for these cards |
| Godot movie maker | MIT | about 150 MB | `--write-movie` at a fixed rate | volumetric fog exists | needs a window; no evidence it beats three.js |

Measured elsewhere, not here: HyperFrames' docs give 10.8 s to raster 8 s of 720p on an M4 Max, and 810.5 s for the same path
traced at 32 samples. At that rate a whole 23-minute film path traced would take about 31 hours on that machine.

**The agent's recommendation:** stay on Three.js, move to r187's `WebGPURenderer`, keep our own harness, and borrow
HyperFrames' determinism rules without the framework. Use the path tracer only for held shots. Fall back to the proven
`WebGLRenderer` with postprocessing, n8ao and three-good-godrays if Windows capture cannot be made reliable in an afternoon.
Move to Blender if a test still shows that screen-space lighting cannot give the candle falloff wanted; time one frame of
each on the 5080 first.

**Not verified:** nothing was installed or run. Blender's own sites returned 403 to the agent, so its version, date and size
come from news coverage, PyPI and a third-party listing. The black-capture claim rests on one page. No render times exist for
either route on these cards.

**Also named, unread:** `sunxiayi/make-blender-education-video-skill` (MIT; one approval frame before any full render),
`Moh4696/cinematic-skill` (MIT; narrated films from code, voice-timed), `paullabs/espaco-em-codigo` (Three.js science films).

## What the seat takes from both parts
- The films of 2026-11-27 were flat fills in a 2D engine. The long September film was lit 3D. To go past it the picture needs
  real light, and that means a 3D route.
- The craft rules above do not depend on the engine and go into the next guide whichever is chosen.
- The choice between the two routes is to be made by eye, on one still of the same scene from each, before anything is built.

## Sources
- https://github.com/JohnHeibel/ClaudeAnimationBase · https://github.com/buildwithhanif/claude-animation-skill ·
  https://github.com/cth9191/animate · https://github.com/ledbetterljoshua/functional-emotions-video ·
  https://github.com/i-afaqrashid/claude-animation-studio · https://github.com/artemnovitckii/claude-animation-skills ·
  https://github.com/dylantarre/animation-principles · https://github.com/feitangyuan/onetake ·
  https://github.com/zhuyansen/awesome-claude-video-skills
- https://github.com/mrdoob/three.js · https://github.com/pmndrs/postprocessing · https://github.com/Ameobea/three-good-godrays ·
  https://github.com/N8python/n8ao · https://github.com/gkjohnson/three-gpu-pathtracer · https://github.com/heygen-com/hyperframes ·
  https://github.com/remotion-dev/remotion/blob/main/LICENSE.md · https://pypi.org/project/bpy/ ·
  https://phoronix.com/news/Blender-5.3-Released · https://github.com/ahujasid/blender-mcp ·
  https://github.com/DisturbedMediaGroup/claude-animation-skill
