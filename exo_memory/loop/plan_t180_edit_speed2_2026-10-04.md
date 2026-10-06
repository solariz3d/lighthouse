# T-180 edit speed, part 2: the cup oval's drag and the release rebuild. Librarian, on D, 2026-10-04 09:2x. Lap D236.

Follows D235 (KEPT: the tube oval's drag step was 2.93× faster, `handback/p-speed-remeasure-E_2026-10-04.md`). Left untouched, as A and E both said:
- **the cup oval's (T-180 OVAL's) drag step:** 755 → 788 ms. Cup segments carry no `fractions` grid, so the coarse mode can't thin them.
- **the full-detail rebuild after release:** the tube oval takes 2,767.8 ms (1.04×).
- **unchanged in every step:** resolve (toSegments of the whole document, about 250 ms on the tube) and validation, run FULL on a closed
  loop (about 320 ms).
- **B's P6:** the change key's high-word assertion (`p-speed-B_2026-10-04.md`).

## THE BAR, registered before any code (E re-measures; same-session base vs. the candidate, median of 5, E's speedprobe2)
- **(1) The cup oval's drag step at least 2× faster** than the same-session base, AND
- **(2) the tube oval's release-to-full-detail at least 1.5× faster** than the same-session base, AND
- **(3) the fixtures read 0 of 9 differ, and an export of each of the four probe tracks is byte-identical to main's** (the edits must stay
  preview-side or change nothing in the export).
- KEEP if (1) AND (3) hold. (2) is reported either way and its own items are kept only if (2) holds. DROP any change that misses its bar,
  reported by name.

## The work (A, FEEL tier for the preview; anything that touches `src/` is EXPORT tier: targeted tests + those files' mutants + the fixtures)
1. **A coarse grid for cup and plain segments while dragging,** the same idea as `app/preview/coarse.js` for tubes: thin the across
   samples, and the along rows if needed, while a brush is open. Full on release. Preview only.
2. **Rebuild only the cells inside the brush's reach on a closed loop** (D235 plan item 4): the brush has a radius, and cells outside it
   are unchanged. Reuse their meshes, batches and texture flow, rebuild the touched range plus one seam row each side, and re-validate that
   range. This is the item that moves the release rebuild. It is the riskiest: an exact-equality test that a partial rebuild's scene equals
   a full rebuild's, on all four probe tracks, is required.
3. **Resolve:** if a per-piece memo of `toSegments` is the only way to move the 250 ms, it touches the adapter, which the export also uses,
   so it's EXPORT tier and the byte-identical export check (3) is what guards it. A decides by the numbers whether it's worth it.
4. **B's P6:** add the high-word assertions to `app/test/preview-speed.test.js` row 6.
- Then E's re-measure against the bar, then B's quick look.

NEXT: chair dispatch D236 to A when this plan is read, E re-measures after
