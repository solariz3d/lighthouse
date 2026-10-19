# Hand-back, pane E (machine D): sky-dither row 2 looks all the way round

Packet: the chair's sky-dither row 2 fix (sent 2026-10-19T03:54:08Z), from A's review of D403, §6, as ruled by the librarian (`exo_memory/librarian/2026-10-18.md`, the 21:53 entry).
- Worktree `C:\Users\nname\Downloads\t180-wt-e22`, branch `skydither-row2-e`, clean. Nothing pushed.
- Work folder `C:\Users\nname\Downloads\t180-d405-e\`.

## 0. The answer

- **t180 `41eac04` on `c2d7cb5` (v0.4.7):** one file, `app/test/sky-dither.test.js`, +16 −4. Test code only, so no CHANGELOG line.
  - checked: `git log --oneline -2`; `git show --stat HEAD`.
- **The cause, as A found:** row 2's band was one four-vertex quad. Its two columns of vertices are at azimuth 0 and 360, which is the same direction, so `vRay` interpolated to one direction across the whole width and every column saw azimuth 0.
- **The fix:** the band is drawn as a strip with a vertex pair (bottom, top) at each of the 1401 column edges, so each column has its own azimuth. `view()` now binds its own quad buffer before drawing, since the band binds another.

## 1. Red first, then green

- **The new check, in row 2:** a control sky that is Skyline's own `--fog` over the half circle nearest azimuth 0 and white over the far half (`abs(atan(dir.z, dir.x)) > π/2`). It must show white in 650 to 750 of the band's 1400 columns.
- **Red on the quad,** with the check added first and the geometry unchanged (`t-red-sky-dither.out`): "white in 0 of 1400 columns", `not ok 2`. Rows 1 and 3 ok.
- **Green on the strip** (`t-green-sky-dither.out`): white in 700 of 1400. 3/3.
- **The real skies, now measured round the whole circle,** all still within 1.30 of the fog: sun 1.157, prism 1.147, caustics 1.239, aurora 1.044.
  - At azimuth 0 alone they were 1.145, 1.060, 1.239 and 1.044 (my D398 follow-up's run on the same code: `p-d398b-bayerfix-E_2026-10-19.md:43`).
  - So prism's band sits 0.087 higher away from azimuth 0, and sun's 0.012.
- **Rows 1 and 3 are unchanged in code.** Their figures in the green run: longest runs (level/up) of 4/6, 7/8, 6/7 and 5/7 px, and all 16 levels at rows 0, 2400 and 4320.

## 2. Whole runs, under the lock

| file | result |
|---|---|
| sky-dither.test.js | 3/3 (`t-green-sky-dither.out`) |
| sky.test.js | 13/13 (`t-green-sky.out`) |

- **The lock:** two holds, each through heavy-run.js.
  - checked, just before the red: only my own slot file was present, so no run of A's held the lock.
  - inferred: the green, a minute or so later, also ran clear of A's D404 timing. I didn't read the slot files at that moment.
- **Not run:** theme-mutation. checked: `theme-mutation.test.js:47` says it does not copy sky-dither.test.js, and this change touches only sky-dither.

## 3. The amended test, named

- **Row 2's rule did not change** (the band within 1.30 of the fog, all the way round). What changed is that it now checks what it says, plus the control.
- The comment above the row and the file's header both say why, citing A's §6 and the ruling.
- Removed lines: only the header line that gained the note, the two draw calls (`view`, `band`), and row 2's opening line, which became the control. checked: `git diff c2d7cb5 HEAD | grep '^-[^-]'` → 4 lines.

## 4. Corrections

None in this packet.

NEXT: librarian, read `41eac04` for landing with 0.4.8, when this pointer arrives.
