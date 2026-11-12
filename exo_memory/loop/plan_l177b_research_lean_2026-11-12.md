**SUPERSEDED 03:3x by `loop/plan_l180_animation_from_the_sources_2026-11-12.md` (his picks, brief 155). Kept as the trace.**

# L177b: remove L173's home-made lean; build the lean the research found (his items 151–153). Librarian, on L, 2026-11-12 03:1x local

**His words:**
- (153) "well why the fk did we do all the research just to ignore it and do our own thing????????????????"
- then "get rid of it".

**The research is the spec** (`handback/p-l176-openanim-C_2026-11-12.md` §1, §3, §5). The pane implements it as written. It does not invent a substitute. If the research cannot be followed somewhere, the pane stops and says where, with the measurement, before doing anything else.

## The work (C)
1. **Remove L173's chain.** Take out `WorldApp::ease_poses`'s turn-rate unpicking, dead zone, two springs and the 100°/s hard cap (`game/world/world_app.cpp` ~:550-581, as landed in c83f8dc).
2. **In its place, Overgrowth's method** (`aschar.as:7921-7940`, `:4236-4241`, Apache-2.0, learned from, not copied):
   - the target tilt comes from the body's velocity and its **acceleration** (the per-frame velocity change, low-passed by `pow(0.95, frames)` at 120 fps, about 0.16 s);
   - the drawn tilt eases toward it by `pow(0.9, frames)`, about 0.08 s;
   - the time constants are kept in seconds at our 240 Hz tick;
   - it also leans back when braking and forward when starting.
3. **Holden's springs where a spring is needed** (`spring.h` damper_exact by half-life; `doublespring.c`), never a hard rate clamp.
4. **The sway, if it still shows:** a soft knee in the picture, per L176 §1. If it must change at its source, flag it for A (`chase/`).

## Tests (registered before code; L173's row kept)
- **Kept:** sign changes on straights ≤ 0.5/s, lean rate ≤ 120°/s, corners reach their full lean.
- **New:** the lag from the lean's peak to the heading's peak turn rate at each corner turning ≥ 45° within 1 s. It must be **shorter than on c83f8dc** (record both), measured on his run `run-20261112-080014` and the bot's run.
- **Fingerprints unchanged** (picture only).

## Land, show, then he plays
- Land as L173 did: exclusive hold, ctest, both selftests, stamp, scan, push-gate, push.
- Then `lean_over_his_run.svg` with the heading's turn rate on the same axis, and a lit corner if one exists.
- Hand-back `p-l177b-research-lean-C`.
