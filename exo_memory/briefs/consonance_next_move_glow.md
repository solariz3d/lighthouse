# Consonance: the button for the proper next move glows (close, or compact warm seats)

One brief for this thing. His words go in verbatim in the turn they arrive; the state half is updated with the work.

## His words

- 2026-11-25 02:44 (L), before a restart: "do i press compact warm seats instead of closing for proper etiquette?"
- 2026-11-25 02:45 (L): "before i restart, i like the idea of like, say if the proper thing to do is close consonance, the
  X will be golden resonant aura, but then if the proper move is to compact warm seats, that button will have the aura,
  just quality of life to help the user understand"

## What he is asking for (the librarian's reading)

The app shows which of its two end-of-stretch moves is the right one now, by a golden glow on that button: the window's
X when a restart is what is owed, "☾ Compact warm seats" when cutting large seats is. Neither glows when neither is owed.

## What exists (checked by the librarian, 02:4x, room main)

- "Compact warm seats": `consonance/ui/index.html:85` (`#closesmall`), `ui/close-small.js`; its rule lives in one place,
  `consonance/tools/close-small.js` (`--dry-run`): a seat is listed when its last call is under 50 min old AND its
  context is over 300k. At 02:44 it listed 0 of 7 seats (A 190k, B 180k, C 146k, E 160k, chair 226k, librarian 234k,
  Third Place 119k).
- "A restart is owed": `consonance/tools/whats-live.js` already says it ("the binary on disk is newer than the running
  process — rebuilt but not restarted"), from the release exe's time against the process's start.
- **A collision to put to him:** gold already means "the committee loop is working". The tab bar's loop aura uses
  `--gold-live` #FFC24A, breathing (`ui/app.css:1-60`), and amendment 4 of the loop indicator
  (`loop/loop_indicator_design_2026-09-02.md`, cited at `ui/index.html:47`) took the aura OFF the buttons so the logo is
  the one indicator. A gold glow on a button for a different meaning may read as the loop. The mock shows it both ways.

## The rule proposed (the librarian's; for him to change)

- **X glows** when the exe on disk is newer than the running process AND no pane is mid-work (a restart cuts a working
  pane off).
- **Compact warm seats glows** when its own list (close-small's rule) is not empty.
- **Both owed:** Compact glows first and the X after the cut ends, because the cut needs the app running; the other
  order loses it.
- **Neither:** nothing glows.
- The glow's tooltip says why, in one line (e.g. "a newer Consonance is built: restart to use it").

## State

- 02:4x: brief written. Next: a mock as an artifact for him (the two buttons in each state, his gold beside a variant
  that cannot be read as the loop aura) before any pane builds it.

## State, 2026-11-25 02:5x (L)

- Found before the mock: the X is Windows' own title bar (`consonance/src-tauri/tauri.conf.json` sets no `decorations`),
  so the app cannot make it glow. The mock proposes a `⟳ Restart` button in the app's own top bar, shown only when a
  newer build waits, that closes and reopens in one click.
- Mock published: https://claude.ai/artifact/QTsk22gcWK4hHJxBAwwYEQ (the top bar at the app's size and tokens; four
  situations; three looks: A the loop aura's own glow on the button, B a steady gold halo, C a steady aqua halo; a
  switch to put the loop's gold tab beside it). Waiting on his pick. No pane build yet.
