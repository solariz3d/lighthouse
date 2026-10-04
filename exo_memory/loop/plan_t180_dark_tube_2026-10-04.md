# T-180: the closed tube leaks daylight; it should be enclosed and pitch black. Librarian, on D, 2026-10-04 02:2x. Lap D230.

The keeper, 02:22, with a screenshot (`C:\Users\nname\Pictures\Screenshots\during day light leaks into the tube it should be inclosed and
pitch black.png`): two bright sunlit bands run along the INSIDE of the closed tube oval. Also: "turning sharply clips car, but that just means
the tube needs to be slightly wider" (his call, by width; not this lap).

## Checked (t180 main a334a18, worktree `lib-tex-build`)
- Every road mesh casts shadows: `src/geom/mesh.js:209` sets `castShadows: true`, and it's written per node at `src/export/kn5write.js:83`.
  **So the leak is not a missing flag.**
- The road material's ambient is `ksAmbient 0.45` (`src/texture/set.js:52`). The ambient term lights the inside of a closed tube as brightly
  as an open road.
- **inferred (strong, not reproduced):** the tube is ONE single-sided shell with normals facing in.
  - From the sun's side, the shadow pass sees its back faces, and with shadow bias a zero-thickness shell lets light through.
  - The striped edges of the bands in the screenshot look like shadow-map aliasing on a thin caster.
  - The usual cure on AC tracks is a caster with thickness, or a separate outer skin.

## The lap (A, export tier: targeted tests, the fixtures, the tube's own mutants; B's quick look; the librarian's re-export; the keeper's eyes)
1. **An outer skin for every CLOSED ring cell** (ψ reaches ±180° at both edges, the same test as `src/texture/flow.js`'s ring):
   - a second surface offset OUTWARD by a fixed thickness (start at 0.5 m, a named constant), normals facing out, `castShadows: true`;
   - its own plain dark material, never the road set;
   - it is not a drivable surface (not a physics surface, no `1ROAD` prefix), so it doesn't change grip or collisions.
   - The tube becomes a thick-walled pipe from the sun's side. (It also stops being invisible from outside.)
2. **A dark interior:** the closed ring cells' material gets a low ambient (a named constant, start at `ksAmbient 0.02`, `ksDiffuse` as now),
   so with the sun blocked the inside goes nearly black. Open road, cups and open tubes keep 0.45.
   - **inferred:** the T-180 car's lights, or CSP's, are then the only light inside, which is what the keeper asked for. Say in the
     hand-back what lights the inside, if anything, and whether a fully black interior needs anything beyond this in AC or CSP.
3. **The slot zone** (a closing or opening tube): skin and dark material only where the ring is closed. Say what the transition looks like.
- **Tests:** a closed tube export has the skin nodes (outward normals, offset = the constant, castShadows) and the dark material on ring
  cells only; a plain road / cup / open tube export is byte-identical (fixtures 0 of 9 differ, plus B's untextured byte probe); the skin is
  not a physics surface (its node name / surface ini).
- **Then:** B's quick look; land; the librarian rebuilds, installs and re-exports T-180 TUBE OVAL. The keeper checks it at daytime in AC.

NEXT: chair dispatch D230 (dark tube) to A when this plan is read
