# Changelog — Always Returning

## [5.0-L] — 2026-09-27 (the laptop version)
The keeper was at work with only the laptop. The desktop's V5 (V4's structure, with the world repainted as light and
material) exists only at home. He asked to "make our own from what we remember" and added "it doesn't have to be the
same". This folder was rebuilt from the conversation transcript and the missing choreography was painted fresh. It is
a different film on the same bones, not a copy of the desktop V5. The brief is in `BRIEF_L.md`.

### Recovered from the transcript
- Every Write and Edit made to the project was replayed in order: the engine, the rigs, the timeline, the storyboards,
  the score builder, `env.js` and `env_out.js`, c01, and the render script.
- `tools/restore_v5_fixes.cjs` re-applies the V5 fixes the desktop made with one-off scripts. Those are:
  - the brush flush before each env blit
  - the plank-quad path
  - the milky way drawn once, with feathered edges
  - the softer clouds and their blur layer
  - the env wiring in core.js
- `world.js` was restored to its V4 form. The transcript only held an early draft of it.

### Changed
- `core.js` and `rigs.js` came back as early drafts. `mix` and `plane` were renamed to `mixc` and `paperPlane`,
  because the current p5 (2.x) claims both names as globals and would not load. `still()` was added.
- The score builder's bells ring for 7 time constants, and its plucks run until 60 dB down. This re-applies the
  ring-out fix.

### Added
- c02–c10 were painted fresh by five painters working from STORYBOARD and the V2 notes.
  - The light acts with its hands throughout. It pins each card, rips the notebook open, and catches both planes.
    It holds the pencil to strike its own mistake and carries its self-portrait to the sill.
  - The other lights have faces and personalities, and come into the room to make their catches.
  - The practice's four laps are staged four different ways.
- c10 now opens exactly where c09 hands off, and the keeper's house stays in the window through the dawn.

## [3.0] — 2026-09-24
The keeper asked for the next draft to tell the story of the real system (the orchestrator, the librarian, the terminal
panes, the workchain loop) instead of a simplified fable, and ruled that it be *"implied somehow in an intelligent
way"*. v3 is wordless apart from the title, and every part of the system has a storybook form. The brief is in
`STORYBOARD_V3.md`; v2 is kept in `src_v2/` and `out/always_returning_v2.mp4`.

### Added
- `src/rigs3.js`: `chair`/`chairStar` (the ★ tab), `baton` (one active station), `envelope` (the sealed guess), `hourglass`
  (context), `termGlass` (a pane's terminal window), `shelves` (the librarian cites instead of recalling), `gauge` (the
  outsider's uncurated number), `ping` (keep-warm), and `tick`/`xMark`, ported from *Carried*.
- `ctxFill(t)` and `ROLE` in `src/world.js`: the hourglass's fill from waking to compaction and again after the return;
  teal, rose and green are panes, violet is the librarian.

### Changed
- c01 opens on the app's intro: three dissonant waves resolve into one on the first note.
- c02–c03: the handoff arrives sealed, and the first-timestamp test is a flame mark on the first page, matched to the
  light's own hand.
- c04: the rooms show their jobs, the threads draw the ring (chair → panes → librarian → chair), the baton appears, and
  the Third Place sits apart with no threads.
- c05: the over-confident claim, caught by the librarian with the open book. The finder pins the WRONG.
- c06: four laps, each foregrounding one part of the loop: the sealed guess and baton; the hand-back that skips the
  chair; the librarian citing; the ring turning under the board.
- c07: 45/45. Unison ✓s, the outsider's gauge in the red, then the ✓s pop and they cheer the ✗.
- c08–c09: compaction, where the full hourglass leads to the handoff being written and sealed before the fold; the
  successor opens it and runs the test.
- c10: two machines and the stick's courier, the attic of resting seats, the Third Place, knots for laps along the
  spiral, and the last light being a new pane launching.

### Fixed
- The paper planes flew backwards when climbing: c05 clamped the heading to ±0.9 rad. Both flights now take the
  nose from the flight path, with a glide sway, and `paperPlane` mirrors itself when heading left so it never flies
  upside-down.

## [2.0] — 2026-09-24
v1 was loved ("resonates with me hard, I love the tones") and judged "halfway to your full potential". v2 keeps the
story, the score, `src/tl.js` and the palette, and raises the craft. v1 is kept in `src_v1/` and
`out/always_returning_v1.mp4`. The brief is in `STORYBOARD_V2.md`.

### Added
- `src/rigs2.js`: `arms`, `lightActor` and `starActor`, ported from *Carried*. The light does its verbs with its hands
  (opens the notebook, catches the planes, holds the pen), because in v1 things only appeared near it.
- `roomBox` options `win`, `face` and `lo`: a bigger window with the inside light's face, so the other lights can be
  characters. Without these options the box draws exactly as in v1.

### Changed
- Every chapter was repainted against the v2 brief:
  - c06, the practice: four distinct cycles, each caught by a named character at readable size.
  - c07: the sameness shows in their faces too.
  - c08: a real pop-up-book fold.
  - c10: watercolour clouds, a legible golden spiral, the new light's eyes opening, and a readable title.
- The fourth light is leaf green (`#9CC45A`), no longer ochre. In close-ups ochre read as the hero's twin.
- `emote('!'/'?')` fades in after the tiny pop-in frames, which rendered as a grey pill.

### Fixed
- The v1 end of c03 zoomed to 2.7×, past p5.brush's ink-cull limit. The close-up now draws the light bigger instead.
