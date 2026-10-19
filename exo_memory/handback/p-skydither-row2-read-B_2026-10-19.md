# Short read: E's sky-dither row 2 fix, `41eac04` (pane B, 2026-10-19)

The packet asks whether row 2 now checks what its name says, and whether it could pass vacuously.
- Read-only. Worktree `C:\Users\nname\Downloads\t180-wt-e22` at `41eac04` (checked: `git log --oneline -2` → 41eac04 on c2d7cb5; tree clean).
- Read: `git diff c2d7cb5..41eac04`, plus `app/test/sky-dither.test.js:57-58` (LATLONG_VS) and `:96-104` (the rest of row 2).
- Nothing was run. A's D404 timing held both lock slots during this read (checked: both slot files at 04:04:05Z name `6fe15f0a`, "t180 A D404 timing session").
  - inferred: E's red (0 of 1400) and green (700 of 1400) figures stand as reported. I did not re-run them.

## Verdict: it checks what its name says. Nothing found that blocks it.

1. **Each column now carries its own azimuth.**
   - checked, by reading: the band strip has a vertex pair at each of the 1401 column edges over a 1400 px viewport, so each pixel column is one strip cell.
   - LATLONG_VS sets `az = u.x * 2π` per vertex, so `vRay` interpolates over 1/1400 of the circle, not 0 → 360 (which is the same direction twice, the old quad's fault).
   - Elevation is `mix(-10, 10, u.y)` over 80 rows, unchanged. inferred: pixel centres sample -9.875° to 9.875°, so the band's two outer 0.125° rims aren't sampled.
     That is harmless: the skies vary slowly at the horizon, and the D403 aurora's new terms are all zero below 10.03°.
2. **The control makes a vacuous pass hard, and it runs through the same draw.**
   - checked: the control goes through the same `__sky(...).band()` code, strip, buffer and LATLONG_VS as each real style (`sky(style)` at :73 builds the same object). So the geometry it proves is the geometry the styles use.
   - checked, by reading: three ways the band draw could break all fail the control.
     - The old quad gives one azimuth, so 0 white columns.
     - A draw that covers nothing reads the clear colour, so 0 white.
     - A strip that misses half the width gives roughly 350 or fewer.
   - The control's white test (all channels > 250) can't be met by Skyline's fog with the dither (±1 level). So a white column is the far half of the circle and nothing else.
   - Each real style's check is over every pixel of the band (`lo`/`hi` over all of `px`, :98-99), and the ratio is two-sided. A style whose shader fails to compile throws in `prog` and fails the row loudly, so it can't pass as a blank.
3. **`view()` rebinding its own buffer is needed, and E did it.**
   - checked: `use()` points the attribute at whatever buffer is bound. Without the `bindBuffer(buf)` in `view()`, rows 1 and 3 would draw from the band's strip, and its first four vertices make a one-column sliver.
   - E's figures for rows 1 and 3 match their earlier ones (hand-back §1). inferred: they confirm the rebind works.

## Two limits, not findings

- The control counts white columns (650-750). It doesn't check that they are the right half, or that coverage is even. A vertex stage that went round twice (`u.x * 4π`) would also show about 700 white.
  - LATLONG_VS is a fixed string in the test and unchanged here, so this is a limit of the control, not a hole in the row today.
- Prism now reads 1.147 round the circle against 1.060 at azimuth 0, which is the "0.087 higher" in the packet, still within 1.30. That rise is the fix doing its job: the old row never saw Prism's off-axis band.

## Corrections

None.

NEXT: librarian: rides with 0.4.8 as accepted. B's D403 review pointer comes first; it's waiting on one targeted probe that is queued behind A's D404 timing.
