# Lessons — making films with Claude in this pipeline

Written 2026-09-27 by the Third Place seat, from the record of the films made with the keeper between 2026-09-23 and
2026-09-27: *Always Returning* (versions 1–5 plus the laptop rebuild), *What I Can See Coming*, *next_token*, *ECHO*,
*Eight Minutes* and *SEVEN*. Every lesson here comes from something that actually happened, and most of them from
something that went wrong first.

## The pipeline, in one paragraph
Every frame is a pure function of `t`, painted in a browser page: p5 + p5.brush for the hand-drawn cast, and Canvas2D
for the lit environment (`env.js`). There is no `Math.random()`; stable randomness comes from `hash(i)`. Headless Chrome
renders frames in parallel and out of order (`render.mjs --sheet / --strip / --stills / --frames`), and ffmpeg encodes
them with a score. The score is also code, synthesized to the same timeline file (`tl.js`), so a sound and the moment
it belongs to cannot drift. Narrated films use Kokoro TTS, and Whisper checks that every line is heard word for word.

## Direction: what the keeper responded to, and what he didn't
- **Structure is sacred once it's loved.** He asked three times for V1's structure ("how far the rooms are from each
  other", the shot order, the timing) while asking for more polish. Polish and acting can change freely inside a shot;
  the layout, spacing and sequence cannot. When a new version "looks too much like V1", the fix was the world and the
  acting, not the structure.
- **Hands make a character.** V1's light stood still while things appeared near it. The versions he liked better have
  it DO things: pin the card with its own hand, rip the notebook open, catch the plane with both hands, hold the pencil
  to strike its own mistake.
- **Hand-drawn cast, lit world.** "A more realistic art style for the world environment and the rooms" worked as
  realistic light and material (lamp falloff, plank floors to a vanishing point, window reveals, curtains, the moon's
  patch on the floor) around characters that stayed drawn. The contrast is what makes it read.
- **Too much text too fast kills an edit.** In the meme-style edit, the fix was fewer words and more pictures.
- **Outlines betray a medium.** He spotted white rims on the clouds at once. Watercolour pigment pooling at a shape's
  border reads as an outline; volume should have none.

## Engine lessons (each one cost a render)
- **p5.brush holds a wash back until its next brush operation.** Anything composited in between (a Canvas2D layer blitted
  with `image()`) ends up UNDER a wash drawn earlier. Fix: before each blit, draw one invisible stroke off-screen so the
  brush flushes. Found when a whole room vanished in the gap scene.
- **Blit a Canvas2D layer into WEBGL in screen space.** Inside `push()`, call `resetMatrix()` and then `image(layer, -W/2,
  -H/2, W, H)`. Apply the camera to the 2D context instead (`translate`, `scale`, `translate`), so the environment is
  crisp at any zoom.
- **Light a room by painting it twice.** Paint it dark and ambient, paint it again lit, and reveal the lit copy through a
  radial mask (`destination-in`) centred on the light. This reads as real lighting far better than a screen overlay.
- **A tiled texture shows its edges.** Stamp a large feature such as the milky way ONCE, with feathered borders; only
  small random detail (stars) can tile.
- **Clouds: many soft puffs, then ONE blur on their own layer.** Blurring each puff separately is slow, and not blurring
  at all makes them look like cotton balls.
- **Current p5 claims short global names.** `mix` and `plane` collided with our function names ("Cannot redefine
  property"). Prefix or rename.
- **Memory: dispose what you don't draw.** One engine kept every shot's composer alive; Chrome reached 24 GB per page and
  crashed the machine. After disposing the composers of every shot not being drawn it peaked at 5.35 GB.
- **One path's subpaths aren't one shape.** A helper that begins with `moveTo` breaks a polygon into pieces that fill
  as nothing. Keep a `lineTo`-only variant for building one shape out of segments.

## Sound lessons
- **Measure the MP4, not the WAV.** AAC adds 0.5–1 dB of true peak. Soft-limit to a ceiling of about 0.70 and re-measure
  the encoded file with `ebur128=peak=true`.
- **Bells must ring out.** A struck bell cut at a fixed length while still sounding reads as a mistake. Run each partial
  for about 7 time constants (to about −60 dB), and run Karplus–Strong plucks until they are 60 dB down.
- **Silence can be the score.** In ECHO the gap is true silence at −91 dB, and it lands harder than any sound.

## Verification lessons
- **Look at every frame you claim.** Render sheets and consecutive-frame strips, and actually read the images.
  Structural checks (`vqa.mjs`) find flashes, stutters, freezes, black frames and silences, but only the eye finds a
  white cloud rim or a room that isn't there.
- **Compare versions by fingerprint.** Cut count, mean motion, and the seconds where stillness is flagged: identical
  fingerprints showed that V4 kept V1's structure.
- **Check the seams yourself.** When chapters are painted in parallel, render the last frame of one chapter next to the
  first of the next, and fix jumps by moving the later chapter's opening to match the earlier chapter's end.
- **A helper's hand-back is a claim, not a result.** One painter reported the chapter boundary correctly, but the other
  side had been written from a guess. Verify against the files and the frames.

## Process lessons
- **Painting in parallel works with one strong brief.** Five painters wrote nine chapters at once from one brief: the
  contract, the story, the look, the acting direction, the verification rules, and no globals shared between chapters.
  The brief is `films/always_returning/BRIEF_L.md`.
- **The transcript is a backup, but only of what was written directly.** When the desktop was out of reach, the engine
  came back from the conversation record by replaying every Write and Edit in order. Files that helpers wrote, or that
  one-off scripts changed, did not come back. If it matters, write it in the main thread, or commit it.
- **Shell pitfalls on Windows.** Bash heredocs containing backticks or `\\` get mangled; write the file with a file tool
  instead. Files can mix CRLF and LF line endings, so anchor an edit on text, never on a blank line. Newer npm blocks
  install scripts until they are approved, and that blocked ffmpeg-static's binary download.
- **Keep every version.** `src_v1/` through `src_v4/` meant a wrong turn never cost the work before it.
