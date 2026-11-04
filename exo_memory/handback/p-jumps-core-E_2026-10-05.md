# p-jumps-core-E · D243 jumps, the CORE half (no UI) · pane E · 2026-10-05, on D

**Tree:** a fresh worktree, `C:/Users/nname/Desktop/worktrees/e-jumps-wt`, branch `d243-jumps-core`, on t180 main `12ab427`, with 0 links.
- **Commit `6d2ce0604e3fc36eb5203e98ad2e797d5ccf4ed7`** (`6d2ce06`), on `12ab427`: 9 files, +336/−15, by named paths.
- **Not pushed, and AC was not launched.**
- **Tier:** EXPORT. Targeted runs, fixtures 0 of 9, and the mutants of the touched src files, all under the heavy-run lock, one job at a time, with `--test-concurrency=1` and the serial shim.

## VERDICT: built, all three items. No part of the packet is wrong, with one correction to my own earlier finding (item 1's "too short").

| item | what | result |
|---|---|---|
| 1 | a core flight's gap is INTENDED; a hole outside one stays red; a missing or too-short landing is red | **done** |
| 2 | close() across jumps | **done: it closes.** NOT_YET is gone; one shape is refused by name |
| 3 | `jump(doc, { gap, drop, land })`, with a round-trip test | **done** |
| — | tests, fixtures 0 of 9, mutants | **all green** (run 3, below) |

## 1 · Validation: a jump is not a hole
**Before** (checked, my D243a finding at `12ab427`): every core flight was red `gap-in-road`.
- The reason: `src/validate/index.js` exempted only the word `'jump'`, and the core writes `word: 'core'` (`src/core/adapter.js:274`).

**Now:**
- A gap is a flight when the adapter wrote it as one: `word: 'core'`, `part: 'gap'`, and its own landing ramp next (`part: 'land'`, same id, road). That is the new `isCoreFlight`, beside the gap check.
- The word `'jump'` is exempt as before, so word documents are unchanged.
- **Any other gap is still a hole**, the core's included.
- **A flight whose landing is MISSING is red `gap-in-road`.** It is not a flight without its ramp (row 2).

**"Too short", defined, and why it is not a length:**
- The validator already checks a jump's landing (`checkJump`, then `landing-misses-zone`).
- The landing road is long enough when BOTH measured falls (MACH6 `jumpG`, 3.2 g and 6.3 g) touch down on road within the landing search, at the take-off speed validation computes for the lap.
- **The adapter sizes the ramp at the DESIGN speed, 460 km/h** (`MACH6.designSpeedKmh`). A jump taken faster, as on a long straight, flies past it.
- Measured on a 40 m, 2 m-down jump at the lap's 970 km/h (scratch `land.js`): the 6.3 g fall lands 98 m out, and the 3.2 g fall finds no road in the search, so the jump is red.
- A length threshold would pass that jump. The physics check is the right "too short", and it was already there.
- **Correction to myself:** in D243a I wrote that a flightPiece "always carries its landing ramp", so "no landing cannot happen". True for the core's own documents, but the ramp can still be too short for the speed. That is the case that matters.

## 2 · close() across jumps: it closes (my call, with reasons)
**The packet asked me to close across a jump if the core can.** It can: a flight carries the road's state (bank, width, rise, cup, edge, tube carried; the road after it starts level). What the close needed, in `src/core/close.js`:
1. **The joint across a jump.**
   - The road after a jump starts with κh, κv, h and l at 0, value and slope (checkDoc's `afterFlight` joint).
   - So those first two control points are HELD, not linked across the flight.
   - Every other channel joins C1 across it, as before.
2. **The model's Jacobian (`positionJacobian`):**
   - a jump is one heading step, `H·∂T/∂θ`, with H = gap + the ramp's horizontal length;
   - in pitch it CUTS the chain, except through the ramp: the ramp's length depends on the take-off pitch.
3. **The net-pitch row (`netRows`/`residual`):** the pitch is counted again from each jump's landing pitch. `kvBase` is the landing pitch minus the start pitch.
4. **Refused by name, the one shape:** a lap that ENDS in a jump, `FLIGHT_AT_END`. Its seam would join the landing ramp to the start; extend road after the landing first.

**B's local-window Close (`95ee245`) keeps working**, checked:
- `core_close_local` passes;
- B's `core-close-mutation` passes 32/32;
- a jump lap closes through the default local window, with every piece outside the window the same object (row 4).

**What closes**, checked in scratch `probe.js`:
- the open jump lap closes in 6 steps to 0.016 mm;
- protecting the take-off road (`edited: [0]`), in 5 steps;
- a jump landing on −2° and 2 m down closes in pitch too, with a measured tangent under 1e-6 rad (row 4).

**An unwelcome one, found and fixed: my model was wrong across a jump, and a mutant showed it.**
- My first model cut the pitch at a jump completely, assuming the ramp's dependence on take-off pitch was weak.
- **Mutant J8, which removed the cut, SURVIVED.** The close still converged, because its residual is the adapter's exact path.
- I measured the model against the adapter (scratch `jac.js`). For a kv control point BEFORE the jump it was **96% off**: the adapter moves the end [0, 4,623, 16,509] per unit, the model [0, 5,200, 0]. The ramp's length moves about 16.5 m along per mrad of take-off pitch.
- **Fixed:** the flight now carries ∂(ramp length)/∂(take-off pitch), by a central difference of `landingRamp` itself, along the ramp's direction.
- **A row-4 test now pins the model:** it bumps one heading and one pitch control point before and after a jump, and requires a relative error under 1e-3.
- After the fix, J8 is caught, and so are two new mutants: J8b (the ramp's pitch dependence dropped) and J8c (the ramp left out of H).

## 3 · `src/core/jump.js`: `jump(doc, { gap, drop, land })`
- **What it does:** appends a flight at the open end and returns the new document. `land` is in rad, as `flightPiece` takes it; the UI converts from degrees.
- **Refusals, by name:**
  - an empty track: `NO_TAKEOFF`;
  - a closed track: `CLOSED`;
  - a jump straight after a jump: `JUMP_AFTER_JUMP`, my call: land on road first;
  - a bad number: `BAD_JUMP`;
  - a flight the adapter cannot fly: `JUMP_PAST_VERTICAL` or `JUMP_UNSOLVABLE`, solved at the click by the adapter's own `toSegments`;
  - an offset not faded at the lip: `FLIGHT_OFFSET`, from `checkDoc`.
- **Round trip** (row 1): append, serialize, parse, serialize is byte-identical. The pieces are equal, they build the same segments, and the reopened file extends the same.

## Tests: `test/core_jump.test.js`, 13 tests, rows 1–5

| row | what it checks |
|---|---|
| **1** | the helper; the round trip; the refusals |
| **2** | no red inside a flight's span (non-vacuous: the no-landing case's red IS inside the span, so the filter can see one); a real hole outside it is red at its own s; no landing is red |
| **3** | the too-short landing is red (`landing-misses-zone`), with a both-falls-caught control |
| **4** | whole-lap close; local-window close; the sloped landing; the model across a jump; `FLIGHT_AT_END` |
| **5** | a closed jump lap exports through the app's shell (`buildExport`: kn5 and AI line) and through `buildFromSegments`; an open one still refuses `OPEN_LOOP` |

**Two existing tests changed, because the packet changed what they assert.** Both keep their rule; each carries a comment saying so.
- **`test/core_close.test.js`:** "a track with a jump is refused (NOT_YET)" now reads: the same track, which has no turn, is refused as any turnless track is (`CLOSE_SINGULAR`), and never NOT_YET.
- **`test/export_test_unfinished.test.js`**, my own D243a test: it used F7's jump red as its example of a red the TEST export lists. That red is gone by design, so the row now plants a real hole in F7's landing road.

## The runs (run 3, on the final tree)

| run | result |
|---|---|
| targeted, 23 files (core_jump, the four close files, core_cup_fixtures, adapter, doc, cup, xsec, doc-jump, all eight validate files, cup_export, export_words, export_test_unfinished, app core-shell, core-close-preview) | **360 pass, 0 fail, 1 skipped** |
| **fixtures row 5a** | **"0 of 9 differ"**, passes |
| `test/core_jump_mutation.test.js` (new): control + 15 mutants of `validate/index.js`, `close.js` and `jump.js` | **16/16**, every mutant applied and caught |
| `test/core_cup_mutation.test.js` (it mutates close.js) | **51/51** |
| `app/test/core-close-mutation.test.js` (B's, it mutates close.js) | **32/32** |

- **The skip is not this lap's:** "a real track from reads/ opens as a LOCAL example". There is no local fit in reads/.
- **The equivalent mutant, removed with its code.** J10 dropped a hold on the last two h/l control points before a jump. It survived because NO closing row reaches them: the seam rows touch only the lap's first and last road pieces, and a lap ending in a jump is refused. So the hold was dead code. It is gone from `close.js`; if a row ever did reach those points, the closed document's `checkDoc` refuses it by name (`FLIGHT_OFFSET`).
- **The harness now refuses a mutant that does not parse.** My first J10 replacement left a syntax error, and the crash read as "caught" (296 ms, in run 2). Caught by its time.
- Runs 1 and 2 are kept as `run1/` and `run2/`, with their failures: the D243a row in run 1, then J8 and J10 in run 2.

## What this does NOT establish
- **No UI.** There is no Add-jump control, and the dashed preview arc is not drawn; that's A's half.
- **AC was not launched.** Nothing is known about how a jump drives in AC.
- **The design-speed ramp is a choice I did not change.** Whether the ramp should be sized at the lap's own speed is the keeper's call. Today validation reds it, which is honest.
- **The closed jump lap that exports is a small jump:** 10 m gap, 0.3 m down, level landing, closed with the take-off road protected. The 40 m jump closes but reds, correctly.
  - Without protection, the whole-lap close takes the start straight below the grid's 67.4 m (`NO_START_STRAIGHT`).
- **inferred, not run here:** the merged full suite and machine L.

## Evidence (scratchpad `…\scratchpad\jumps\`)

| file | sha256 |
|---|---|
| `probe.js` | `a799525e…` |
| `exp.js` | `d2930c1f…` |
| `exp2.js` | `c0b4b22d…` |
| `land.js` | `2ef4174a…` |
| `jac.js` | `285c6bd8…` |
| `run.js` | `2addf24b…` |
| `targeted.tap` | `5e98824f…` |
| `mut-jump.tap` | `7bd059b5…` |
| `mut-cup.tap` | `f3bd8fe7…` |
| `mut-close.tap` | `dc660082…` |
| `run.jsonl` (run 3, every result fsynced as it landed) | `542bbe34…` |

## My own slips
- **Two tests read `x.s` on validate's reds, which are ranges (`s0`, `s1`).** One failed; the other, "no red in the flight's span", passed **vacuously**. Both are fixed, and the span check is now shown able to fire.
- **The weak-dependence assumption in the model.** Measured and fixed, above.
- **The J10 replacement that did not parse.** The harness is guarded now.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_jumps_open_export_2026-10-05.md · scratchpad jumps/run.jsonl
