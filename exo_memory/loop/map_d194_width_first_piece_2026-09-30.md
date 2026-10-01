# D194 map — "the whole first piece the same width", and keeping the blend. Librarian, on D, 2026-09-30 02:4x.

The keeper, 02:39 (via the chair, verbatim): "when I change width of the first piece, the standard width stays the same while toward the
front it grows bigger instead of the whole first piece width growing ... there could be the ability to still do what it does ... transition
to a thicker width, but it also needs to do what I want making the whole piece the same width instead of starting at the base and
transitioning it, would alway make a bottle neck of width at the start of the track".

## Checked at main 6ed0b4f
- **The first piece:** `src/core/extend.js` builds an empty track's start from `first` when given, else from defaults:
  `{ kh:0, kv:0, phi:0, w: WIDTHS[fam], r: RATES[fam], … , ...(first||{}) }`, then blends to the typed targets over `Lt`.
- **The panel never passes `first`:** `app/core/panel.js` `extendOptions()` returns `{ length, targets }` only (lines 40–51).
- **So the bottleneck is not width alone. EVERY channel of the first piece starts at the default and ramps:**
  - width 31 m → typed;
  - bank 0 → typed (a first piece typed "bank 30" starts flat);
  - turn and climb from 0;
  - cup from the bowl's edge.
- **`transition` (Lt) is ONE value for all channels**, and the panel never sets it, so it is always the whole piece (extend.js:
  `Lt = transition === undefined ? length : transition`). The UI has no transition control at all.
- **Later pieces:** every road joint must be C1 in every channel (`src/core/document.js` `jointProblem` / `JOINT`, doc:160–206), and the
  seal's 1 mm seam rule forbids a surface step. So "the whole piece at the new width" after a joint cannot be a jump; it can only be a
  SHORT ramp at the start of the piece.
- **The shortest ramp the channels can carry:** the spline knots are every `KNOT_M = 20` m (document.js:34). A ramp much shorter than
  one knot span is not representable by the least-squares fit and would ring. D190's V5 showed the same thing for cup: a 10 m transition
  on a 30 m piece overshoots.

## The work, in two pieces
1. **D194a: the FIRST piece takes the typed values as its START (FEEL tier, UI only; the core already supports `first`).**
   - On an empty track, `extendOptions` also passes `first` = the typed values (in the channel units: w in m, phi in rad, kh/kv in
     rad/m, c in °). So the first piece is the typed width, bank and cup along its whole length. No bottleneck, in any field.
   - Files: `app/core/panel.js` (extendOptions gets a "track is empty" flag) and its test. The ghost and the readout must show the same.
   - Owner: C (C owns the panel).
2. **D194b: per-field "ease in" (GEOMETRY tier, small).**
   - Keep today's blend over the whole piece as the default ("ease over the piece"). Add a per-field option "at the start": that
     channel reaches its target within a SHORT ramp (≈ one knot span, 20 m, or the piece length if shorter), then holds for the rest
     of the piece.
   - Core: `src/core/extend.js` accepts `transition` as a number (as now) OR a per-channel map `{ w: 20, phi: 20, … }`;
     `channelFn(from[ch], targets[ch], Lt[ch])`.
   - The fit's ringing must be checked and clamped (as D190's V5 did for cup): no overshoot past the target in w; width must stay > 0
     and within the validator's bounds.
   - UI: a small per-field toggle (or one "ease: whole piece / at start" switch for all).
   - Owners: A (core), C (UI); a non-author check on the joints and the ringing (B), then land.
- **Absent today, and needed by neither:** a way to jump a channel at a joint. It is forbidden by design (C1 joints, 1 mm seams). The
  short ramp is the honest version of "the whole piece at the new width".

## Recommendation
Do D194a now (it removes the bottleneck the keeper saw, for every field, with no core change). D194b follows as its own small lap,
because it changes how pieces are shaped and needs the ringing check.

## D195 collated (librarian, 03:2x): C's UI half (`p-d195-C`, commit 2966f01) and A's core half (`p-d195-A`, commit b7c7676)
- A: a per-channel `transition` (a number or a map; `'start'` = the first knot span, ≤ 20 m). The fit rings (a 20 m ramp is 1.05 m past
  the target), so A subdivides and clamps. Targeted regression 351/0; fixture row 5a still "0 of 9 differ".
- **A's finding, NOT MET: legacy pieces draw width as a STAIRCASE.** `adapter.js` draws each 2 m legacy segment with ONE profile at its
  mid-width.
  - The 'start' ramp w 31→12: the joint gap is 262 mm (451 mm on 30 m) and the steps between segments reach 4.8 m.
  - Today's whole-piece blends already step: 0.29 m (fixture F4), 0.86 m (F8).
  - Cup pieces (D190 chords) have no such steps.
- **RULING (the librarian): option (b).**
  - Legacy segments whose width (or r) changes are drawn as CHORDS (the profile at the segment's end, blended from its start), like
    the cup's chord segments.
  - This re-baselines ONLY the fixtures whose render changes (expected F4, F8), each with a before/after measure showing the steps gone.
  - Why re-baseline and not gate: the seal's "legacy renders as before" guarded against UNINTENDED change; this change is intended and
    removes an existing visible defect. A gate on a step threshold would be a hack (A's word).
  - **D195 does NOT land alone** (its ramp would look stepped). It lands together with this fix.
- **D196 (GEOMETRY tier), to A:**
  - legacy width/r chords in `src/core/adapter.js`, with the readers evaluating the blend as for cup;
  - the fixture re-baseline, with the diff measured: the steps → 0, the joint gaps ≤ 1 mm, the unchanged fixtures still byte-identical;
  - the seal row 5 amended by name in the hand-back.
  - Then **B** combines D195 (A + C) + D196, checks the joints, the ringing and the seams (1 mm), runs ONE full suite, and lands.
- **Owed at the D195+D196 combine (B):** E's CHANGELOG line for the lag fix (`handback/p-d195-E-lag_2026-09-30.md` §6, line 92), since A held CHANGELOG. The combine rebases onto dbb92b6 (the lag fix landed there); the files are disjoint, and B confirms.

## D196 collated (librarian, 03:5x): `handback/p-d196-A_2026-09-30.md`, commit d1f60fd on b7c7676
- Legacy segments whose width or binding r changes are drawn as chords; the readers evaluate the blend (readsBlend = cup || chord).
- D195's ramp: joint 262 mm → ≤ 1 mm; steps 4.8 m → 0.
- Fixtures: F4, F6 and F8 change in segs/mesh/meshParts (F6 was not expected: its r brush binds the cap = "r changes", inside the
  ruling). F1 F2 F3 F5 F7 F9 are identical in every digest; the PATH is identical in all 9. The seal's kit files are untouched; the
  amendment is a new record `test/fixtures/manifest.d196.json`, and row 5 is amended by name.
- **Queued, not in this lap:** F8's bowl → half-pipe FAMILY joint steps 239 mm (a different cross-section by design, unchanged by
  D196). A family change has no morph. It is the same class as the cup morphs (D190), for a later lap if the keeper meets it.
- **OUTPUT → NEXT: unchanged.**
  - B combines D195 (A b7c7676 + C 2966f01) + D196 (d1f60fd) onto main dbb92b6, adding E's CHANGELOG line
    (`p-d195-E-lag` §6, line 92).
  - B checks: joints (C1), ringing (short ramps within bounds), seams (≤ 1 mm, same-family), the first piece (D194a) with the ramp;
    then ONE full suite plus the core mutation. Land.
- **UPDATED 03:5x:** A amended D196 to commit **90e8ebf** (parent b7c7676), which includes E's CHANGELOG line. B's combine uses 90e8ebf, not d1f60fd.
