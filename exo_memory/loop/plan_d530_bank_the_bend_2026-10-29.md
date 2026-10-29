# D530: bank the bend. The bank becomes a free swing along the road, laid across pieces. Librarian, 2026-10-29 08:1x

The user, 07:58, to the D527 question (is the tilted dish what you saw): "yes" ("lets make track builder baller we got this"). D527's finding stands: across the road our cross-section already makes the measured dish to within a centimetre; what the reference does that ours cannot is along the road. This lap builds that. (The study's data and names are in the private store; this plan carries figures only.)

## What the measurement says about the bank along a bend (eight bends, read every 4 m, the librarian's run of 08:0x on the private data)

- **The bank does not follow the turn.** Bank against curvature over each bend ±100 m: r² 0.10 to 0.49. The bank's peak sits anywhere from 128 m BEFORE the curvature's peak to 336 m AFTER it (five of eight before, by 8 to 128 m; the two long bends after, by 112 and 336 m). There is no formula tying bank to turn: the designer lays the bank as its own line along the road.
- **The swing is long and starts early.** The 10 % to 90 % rise of the bank into a bend runs 28 to 200 m (typically 40 to 120 m) and begins 56 to 96 m before the bend's start. The bank in and out of a bend differ (one bend enters at 41° and leaves at −13°; another enters at 18° and leaves at 29°): the swing continues through and past the bend.
- **The rates:** roll p90 per bend 0.29 to 1.14 °/m, max 0.36 to 1.41 °/m (20 m chord, bank only). The checker's bar today: amber above 0.9338, red above 1.2144 °/m (`src/validate/index.js:31-35`, measured on track B). Two of the eight bends sit above the amber at their peak and the track drives.

## What the builder has today (checked in t180-fresh c1396b9)

- **Extend lays bank as a RAMP from the joint to the piece's typed value, then holds it:** `src/core/extend.js:38-72` (D521 rounded-linear, BANK_ROUND_M 10, or the C2 quintic), over `transition` metres (default the piece's length). A piece is one value; a swing over a bend needs several pieces or the brush.
- **Sculpt's Twist moves the bank** (`app/core/panel.js:402`, channel phi, `src/core/sculpt.js` brush): a bump of Δ·f over the brush window, and a road-road joint is crossed only when the window covers it whole; a half-covered joint is left as it is (`sculpt.js:7-9`). On a flowing track of 100 m pieces a 120 m swing with the brush is several strokes and the user's own care at every joint: his words, 2026-10-28, "it was only on an independent piece, not a whole flowing track, there is definitely still a learning curve".
- **A channel edit across pieces with the joints kept exists as a pattern:** `src/core/pitflat.js` flattenUnder (shape channels scaled under [s0, s1], joints made C1 again as document.js builds them, checkDoc the last word, refused by name). `src/core/smoothramps.js` has the C2 re-lay on a piece's own knots (c2Ends, fitWithHold).
- **A preview-then-apply tool exists as a pattern:** the cut (`app/core/coreshell.js:1188-1204`, cutProposal → ghost → Apply with a 'pre-cut' backup, one undo step), and the selection of a run (`coreshell.js:946`, from/to/ids).

## The change: ONE tool, "Bank the bend"

The user picks a stretch of road, says how much bank at its peak and where the peak is, and the tool lays the bank over the whole stretch as one smooth swing, across every joint in it, the route untouched.

### Part 1 (pane E, PROVE IT: core maths): `src/core/bankswing.js`

    swingBank(doc, { s0, s1, peakS, peakDeg, exitDeg = null, shape = 'rounded' }) -> doc

- `s0`, `s1`, `peakS` in the adapter's lap distance (sculpt.js pieceOffsets, as pitflat takes them); `s0 < peakS < s1`. On a closed track s may wrap past the length (as rollRates wraps).
- The bank at s0 is read from the document as it is (phi there), the bank at s1 is `exitDeg` or, when null, the bank there as it is. The swing goes s0 → peak over [s0, peakS] and peak → exit over [peakS, s1], each half laid with the shape Extend uses for a bank (`shape` 'rounded': extend.js roundedLinear with roundOf; 'quintic': smoother), so the bank is C2 at s0, s1 and the peak.
- Across every road-road joint inside [s0, s1] the joints are C1 by the document's own rule (pitflat.js's loop: the next piece's first point is the previous one's last, its second from the end slope) and C2 where the piece has six or more points (smoothramps.js c2Ends); a joint the swing does not reach keeps its bytes.
- Only `phi` changes. Every other channel, every knot and length, and every non-road piece are the same bytes. The centreline does not move (phi rotates the section about T).
- Refused by name (CoreError): BAD_RANGE (order, or peak outside), NOT_ROAD (a jump or gap inside the stretch), TOO_SHORT (a half under one knot span of the piece it lands in), and checkDoc's own word last, as pitflat does (SWING_REFUSED with the cause).
- The returned document carries nothing else; the shell computes the message (Part 2) from the checker.

**Tests first, red before green** (`test/core_bankswing.test.js`): on a track of three 100 m road pieces, phi 0 throughout: a swing s0 50, peak 150 at 40°, s1 250: phi at 50 and 250 within 0.001° of 0, phi at 150 within 0.01° of 40, C1 at both joints (value and slope from both sides within 1e-9), C2 where six points, every other channel byte-equal, the path's centreline positions unchanged to 1e-9; a swing whose exit is 20° ends at 20°; a swing into a track already banked 30° at s0 starts from 30°; boundaries: s1 ≤ s0, peak at s0, peak at s1 → BAD_RANGE; a jump inside → NOT_ROAD; a half of 3 m → TOO_SHORT; a closed track with s1 past the length wraps and the joint at the seam is C1. Mutation: `test/core_ramp_mutation.test.js` is the harness that reaches extend.js; E adds bankswing.js to it (or a sibling `core_bankswing_mutation.test.js` on the same frame) and hands back applied / caught / not-applied, the whole harness run. Full suite at landing (the landing pane).

### Part 2 (pane A, CHECK IT: the tool in the window)

- In the Sculpt panel, a tool **Bank the bend** beside Twist. The stretch: the selected run (coreshell selection from/to), or, with nothing selected, the piece under the pointer with a lead-in and run-out either side. Fields: **peak bank** (°), **peak at** (a share of the stretch, 0 to 1, default 0.5), **lead-in** and **run-out** (m, default 80 each: the measured swings begin 56 to 96 m before a bend), **exit bank** (blank = as it is), the shape following the Extend bank setting.
- **Preview first, as the cut does:** `state.bankProposal` (base, the proposed document, its resolved), drawn as the ghost over the placed track; the message quotes the checker's roll-rate read on the proposed stretch ("peak roll 0.84 °/m over 196 m; amber above 0.93"), so the user sees the trade before Apply. Apply: 'pre-swing' backup, one undo step, the proposal dropped on any other change (as cutProposal is, coreshell.js:296). Cancel.
- The road moves on screen as a preview mesh of the proposal (model.proposalGhost, as the close and the cut use).
- Tests: the touched panel/zonegrab/handles tests run once; one new test on the shell: Apply is exactly one undo step, the proposal drops when the document changes under it, a refusal's message is the core's words. A once-over of the panel headless (`--mute-audio`, no focus) or A says it did not.
- Words in the panel: plain ("Bank the bend", "peak bank", "peak at", "lead-in", "run-out", "exit bank"); no lap ids in new comments; CHANGELOG [Unreleased] one line.

Parts 1 and 2 run in parallel on the interface above; A stubs `swingBank` until E's lands, then takes E's commit. Both branch from `C:\Users\nname\Downloads\t180-fresh` main (c1396b9) in their own worktrees; d529-c (7f21962 + the D517 patch 8392f63, local) is NOT landed yet and is not their base. Landing (a pane the chair names, after my read of both): merge d529-c, d530-e, d530-a on t180-fresh main, the full suite under the lock, the installer, `.before-d530`, sha256; the user judges; release in the next batch on his yes. Commit messages plain, the Claude co-author line allowed, nothing about the study's source anywhere.

## Kept out, and the falsifier

- Any change to the checker's roll bar (0.9338 / 1.2144 °/m): two measured bends exceed the amber and drive, but the bar came from a whole lap's read and one track's two bends do not move it. The tool shows the read; the user decides.
- A lip at the road's edge (the other D527 finding): its own lap on his word.
- A rule tying bank to turn: the data says there is none.
- Per-side anything: closed by D527.

**Falsifier, registered now:** if, on the user's own bend, the default swing (80 m in, peak at the middle, 80 m out) at the bank he actually wants reads amber on the roll rate, the DEFAULTS are too short, not his bank: lengthen them from the measurement (the swings ran to 200 m) before anyone touches the amber. And if he lays a swing with the tool and the ghost shows the centreline moved, Part 1 is wrong, whatever the tests said.

surfaced: extend.js:38-72, sculpt.js:7-9/:80-86/:173, pitflat.js (whole), smoothramps.js (c2Ends, fitWithHold), coreshell.js:946/:991-997/:1188-1204, panel.js:402/:574, validate/index.js:31-35/:63-83, core_ramp_mutation.test.js.
