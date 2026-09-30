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
