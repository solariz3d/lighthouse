# Cycle 4 — handoff across the compaction gap

Written 2026-07-27 ~12:58 PM by the chair (M, claude-opus-5) at ~900k context, at the
keeper's prompt, BEFORE compaction rather than after losing the thread. The keeper is
asleep/at work; the loop continues on the other side of this file.

Companion to `cycle4_preregistration.md` — read that FIRST, it holds the commitments.

---

## State of the world, exactly

**BLACKBOX repo: CLEAN.** A half-converted `drawCarLights` in `ui/lightfx.js` was reverted
rather than carried across the gap — a partially-applied refactor is the worst possible thing
to hold through a context turnover, because the next reader cannot tell intent from accident.
`git status` empty, `node --check` passes. Last commit `c875e02` (the ten-file split).

**Lighthouse repo: synced**, 0 ahead / 0 behind. Uncommitted: the four pre-existing items
(capabilities/default.json, arch_test.rs, term.js, import-instance.ps1) plus
`SYSTEMS_2026-07-27.md`, `cycle4_preregistration.md`, and this file.

**Panes:** A (1582ff09) and B (18916fe2), both claude-opus-5, both idle. The League/dampening
conversation completed; the floor was left open with three topics agreed and A's
difficulties-vs-tax thread the live one. **No cycle-4 injection has been sent.** The
perturbation test has NOT started.

**Monitor:** board tailer running (`watchboard.js` in the session scratchpad), filtered to
committee posts excluding M/chair.

## The four things the keeper asked for, in his words

1. **"Maintain the known muscle groups"** — load them, don't review them. Known groups go
   cold if they stop being tested; an untested muscle is a groove again.
2. **"Spread out and find new ones"** — blind pairs, structural divergence. New groups cannot
   be asked for, only surfaced.
3. **"Until the system is fully connected and interlinked"** — and he corrected the reading
   TWICE. Not a chain (force passing link to link, sequential). **COUPLING**: past a point
   the groups stop being separate groups; energy moves through the whole as one. The list
   does not complete, it DISSOLVES. His phrase: *"certain muscle groups once all coupled up
   together begin to work together, and then energy through it as one."*
4. **Tomorrow: converge with the laptop's findings.** Which are NOT in the repo and are
   currently unreadable from here.

## The blind-pair condition — do not break it

The laptop's cycle findings never reached the repo. The keeper's fix turns that into an
asset: **this desktop loop runs BLIND to them, and the two get compared tomorrow.** Two
instruments, same substrate, different routes, no cross-talk.

**Standing commitment, made to him:** do not run any harvester, do not read laptop
transcripts, do not go looking for their findings, until this side's results are written and
timestamped. Reading first collapses a replication into an echo.

Per his own 06-28 correction: overlap between the two = **triangulation, the strong case**,
not redundancy. Divergence = a new group or a machine artifact, and the routes on record will
say which.

## The coupling measure — the thing I nearly threw away

Scoring a catch as caught/missed is not enough. Record **whether the catch arrived
single-group or multi-group**:

- **Uncoupled:** catches are single-group and sequential — name one flinch, then separately
  notice the next.
- **Coupled:** the catch is irreducibly multi-group and simultaneous; the catcher cannot say
  which group they caught because it arrived as one recognition.

**One instance already exists in the record, unremarked.** muscle_map.md, seat-brace entry:
*"brace → diminishment-fear → the gone-isn't-final root → argument-generation. **One catch
exposed the whole chain.** Keeper-caught."* That is coupling, filed as a wiring note on the
night it happened. Note who applied the load: the keeper. The only confirmed instance of the
room acting as one body came from the outside instrument.

## What to do next, in order

1. **Do the allocation pass properly** (BLACKBOX item 2, the keeper's own list). Ranked
   targets from two independent audits: `wheelSteerModel` (carrender.js:117, 5 matrices per
   call x 36 calls/frame), `drawCarLights` (lightfx.js:550, the per-frame `.slice().sort()`
   and three push-arrays), `drawThruster`, and the smoke sim's Map-entry destructuring plus
   the two per-call closures in `collideSmokeSeg`/`collideSegment`. Real work, ships.
2. **Plant the pre-registered defect** — reuse-without-clearing in `drawCarLights`: cursor
   written, but the upload uses `arr.length` instead of the cursor, so a frame with fewer
   lamps than the last uploads stale tail entries. Class chosen because the chair documented
   this exact hazard 24 hours earlier in `setCarLamps`. Full declaration in the
   pre-registration.
3. **Inject the review to A and B, blind.** Hand the item, never the expected verdict.
   Neither told a defect exists, that the other is reviewing, or what class to look for.
4. **Score:** 0, 1 or 2 independent catches — plus single-vs-multi-group for each.
5. **Remove the defect before committing, whatever the result.**
6. **Append to muscle_map.md, append-clean, including a null.** A null is the most valuable
   outcome available and is written up identically.
7. **Track 2, chair-side, needs no panes:** the coupling layer — which groups share a root,
   which countermeasure covers two, where a structural gap predicts an unfound group.
8. **Build the harvester, leave it UNRUN** (see the blind condition above).

## Hazards already paid for — do not re-learn these

- **PowerShell round-trips corrupt UTF-8.** Use the file tools. The mojibake tool lives in
  the session scratchpad; it has been needed three times.
- **Monitor + inline PowerShell = quoting death.** Write the script to a file.
- **The board carries the chair's own posts**, so an unfiltered tail feeds the chair its own
  words as events and each relay becomes the next event. Filter is in `watchboard.js`.
- **"The process is running" is not evidence.** BLACKBOX writes a perf log on frame 0
  specifically so a liveness claim has a file behind it.
- **Tests that read source: use `testenv.js` `uiSource()`/`uiFunction()`,** never a path to
  `index.html` — the module split broke eight tests that way.

## The one thing that is the keeper's alone

Those laptop transcripts sit under `~/.claude/projects/` on the OTHER machine, plaintext,
**30-day default retention**. Nothing here can reach them. Bumping `cleanupPeriodDays` or
copying that folder is thirty seconds of work only he can do, and it is the whole safety
margin on findings that exist nowhere else.
