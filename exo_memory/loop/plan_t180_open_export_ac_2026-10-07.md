# T-180: Export to Assetto Corsa on an UNFINISHED track says "close it first". Librarian, on D, 2026-10-07 01:3x. Lap D264.

The keeper, 01:34: "it still says the loop is not closed: close it first (one click), then export when i am trying to export the test that isnt finished".

## Why (read at t180 `e17a73e`)
- The main button **Export to Assetto Corsa** (`app/install`) goes through `exportDoc` without `opts.test`, so an open track is refused
  `OPEN_LOOP` (`app/core/coreshell.js:647`).
- The TEST export of an unfinished track exists (D243a), but only as **⋯ → Test export (unfinished)…** (`app/index.html:92`, `:264`), and it
  asks for a folder with a picker instead of going into AC like the main button does.

## The fix (B, who built the ⋯ menu and the Steam export; FEEL tier, rows and fake hosts only)
1. **Export to Assetto Corsa on an OPEN track does the test export into AC**, not a refusal: written to `<AC>\content\tracks\t180b_<name>_test`
   (the test export's own folder name), same guards as the install (t180b_ only, never over a folder the builder did not make), and the
   result line says plainly: "this track is not closed, so it was exported as an unfinished TEST: the road ends in a run-off and a wall;
   reds are listed as warnings". A closed track exports as today.
2. **⋯ → Test export (unfinished)…** also goes into AC through the same path (the folder picker only if AC is not known), so both routes
   agree. ⋯ → Export… (any folder) is unchanged.
3. The guide and README lines follow.
- Rows red on `e17a73e` first: an open track + Export to Assetto Corsa writes `t180b_<name>_test` into a FAKE AC tree and says so; a closed
  track still writes `t180b_<name>`; the guards hold.

NEXT: chair dispatch D264 to B when this plan is read
