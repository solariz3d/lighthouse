# L161: Dreamzone 2's large builds, and the run speed first. Librarian, 2026-11-11 02:2x (L)

**Masters, read these, not this summary:**
- His words: `briefs/dreamzone2_the_game.md`, items 10–22. Item 18 is the chasers. Items 21–22 are the run speed and the hand-on.
- The game's state: `C:\Users\zackn\Downloads\dreamzone-2\HANDOFF.md`, last section, "Handed on from the laptop (2026-11-11, 02:20
  local): start here". Then `docs/ARCHITECTURE.md`.
- The seat that built it: `third_place/2026-11-11.md` and `third_place/2026-11-10.md`. On D, builders working in one repo at
  once collided twice; one folder each, and a message before touching a shared file, is what held.

**Dispatch:** only after L160 hands back (no parallel laps), and after his word on the base (below).

## The base
- The play folder is at `062d5c4` with **47 changed files uncommitted**: the launcher, the flashlight, the two-stage sprint and
  the camera. The last run there: ten suites, 305 s; self-tests 26/26 and 51/51.
- **Asked of him:** commit that folder as the base, locally, in his private repo. Then each pane works in a `git worktree` of
  its own on its own branch, and nothing touches the play folder until a part lands.
- If he says no: each pane copies the folder, without `build/`, into its own directory, and the merge is by hand.

## Parts (one pane each, one module folder each; `-j 4` each, under the heavy-run lock; L has 32 logical CPUs)

**E — research: how fast a runner is (items 21–22). No build.**
- Human sprint data, with sources: the acceleration phase (time to about 90% of top speed), top speeds for trained and untrained
  runners, and how long top speed can be held.
- The first game's numbers: read `C:\Users\zackn\Downloads\dreamzone-rt` (sprint, ramp, FOV). Movement games in the nextbot
  genre, only where numbers are published.
- **Return:**
  - recommended `sprint_speed`, `sprint_peak_speed` and `sprint_peak_time`, against his guess of about 5 m/s fast and then
    about 10 m/s, saying where his guess sits in the data;
  - which of them should be the fixed base and which the upgradable part;
  - what each choice moves (the HANDOFF list: the chasers, the interceptor's lead, the view's widening, the momentum tier, and
    gym gaps sized by hand for 7 m/s).
- Hand-back `handback/p-l161-speed-E_2026-11-11.md`.

**A — the chasers' speed model (item 18), parametric, so E's numbers drop in.**
- Chasers get their own reference speed, no longer a multiple of `sprint_speed` (`chase/chaser.cpp` `make_body`, and its four
  callers per the HANDOFF).
- Top speed scales with distance travelled and with base difficulty. The player is slightly faster early in a run, and less so
  as it goes on.
- The longer a straight, the more speed a chaser gains.
- Chasers have inertia: they accelerate to speed and lose speed in a turn. The interceptor turns tighter at a lower top speed.
- Chasers stop catching on walls (item 17).
- **Proved by bots, registered before the run** (`-j 4`):
  - on normal, a straight-line runner is caught;
  - a runner who jukes (turns at corners and breaks line) lives measurably longer;
  - the hunter cannot turn on a dime, shown by a turn-radius test.
- Hand-back `handback/p-l161-chase-A_2026-11-11.md`.

**B — the generator: void floors and wider stairwells (items 14, 17).**
- A floor can be a bottomless void. A short, rare wall-run is the way across, and the walk graph proves each one can be crossed.
- Stairwells get wider. Read the width from a dial; don't hard-code it.
- Gaps and wall-runs are sized from the movement parameters, not by hand for 7 m/s, so that E's numbers do not break them. The
  HANDOFF names this as untested.
- Hand-back `handback/p-l161-gen-B_2026-11-11.md`.

**C — the first-person body (items 13, 15).**
- A body with arms and legs, animated procedurally from the movement state: run cycle, sprint, jump, slide, vault, climb,
  wall-run.
- Its feet are tied to the stride the camera already bobs to.
- The camera attaches to the head. The camera code (`game/camera.cpp`) is the first game's rig, carried in at his ask. **Keep
  its feel:** attach the camera to the body, don't retune it.
- Proved offscreen with captures; he judges the look.
- Hand-back `handback/p-l161-body-C_2026-11-11.md`.

**Not in this lap:** chaser animation, and the hunter's thunder footsteps (item 16). That is the next lap, after C's body
skeleton exists to share. Also out: the flashlight as a find or unlock (item 10), the jumpscare ("not during testing"), and
the progression across runs.

## Registered before dispatch (the librarian)
- **Prediction:** with A's model, a straight-line bot on normal is caught within 30 s, and a juking bot survives at least twice as
  long as the straight one.
- **Falsified if:** the juking bot survives less than 1.5× as long. Then inertia is not what makes the chase dodgeable, and the
  model needs another lever.
- **A pass would not show** that it feels right. Only he can judge that, by playing.
