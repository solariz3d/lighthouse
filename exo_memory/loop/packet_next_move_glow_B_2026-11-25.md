# Packet (pane B, on L): the button for the proper next move glows: ⟳ Restart, or ☾ Compact warm seats

Written by the librarian on L, 2026-11-25 02:5x, at his word. For the chair to number and dispatch. Brief (his words
whole, the rule, the prior art): `exo_memory/briefs/consonance_next_move_glow.md`. Read it first.

## His words (verbatim)

- 02:45: "before i restart, i like the idea of like, say if the proper thing to do is close consonance, the X will be
  golden resonant aura, but then if the proper move is to compact warm seats, that button will have the aura, just
  quality of life to help the user understand"
- 02:5x, on the mock (https://claude.ai/artifact/QTsk22gcWK4hHJxBAwwYEQ): "i like those", then "the artifact design i
  meant my bad"

**Look: B** (a steady gold halo around the whole button: `box-shadow: 0 0 0 1px var(--gold-live), 0 0 14px 2px
rgba(255,194,74,.45)`, gold border, no text glow, no motion). It is the librarian's lean; he liked the mock and did not
pick between A, B and C. If he picks another before the pictures, the librarian rings the change.

## What to build (consonance/, a branch from room main; tier "prove it" for the decision, "check it" for the rest)

1. **One pure decision**, beside close-small's rule (JS in `consonance/ui/` or `tools/`, your call, say why):
   `nextMove({ newerBuild, paneWorking, compactList })` gives `'compact' | 'restart' | 'restart-waiting' | 'none'`.
   - `compactList` not empty → `'compact'` (and if `newerBuild` too, Restart shows dimmed: `'compact'` wins, because
     compacting needs the app open);
   - `newerBuild` and not `paneWorking` → `'restart'`; `newerBuild` and `paneWorking` → `'restart-waiting'` (Restart
     shown, not glowing, its tooltip says which pane is working);
   - else `'none'`.
   **Red first:** a row per case, plus both-owed.
2. **The facts it reads, each from what exists** (name the source you used for each in the hand-back):
   - `newerBuild`: the rule `consonance/tools/whats-live.js` prints as "the binary on disk is newer than the running
     process". Note the landing moves the running exe aside (`release\consonance.exe.running-before-*`) and writes the
     new one at the same path: test with that rename.
   - `paneWorking`: the app's own signal for a pane mid-turn (the loop indicator's states in `ui/chain-indicator.js`, or
     the terminal's busy state); say which, and why it is the right one.
   - `compactList`: the same list the button shows, from `close-small.js --dry-run --json` (main.rs about :15215 already
     runs it). Say how often it is read and what one read costs (it reads transcripts); no read more often than the
     facts can change.
3. **⟳ Restart**, a new button in `#topbar .topctl` beside "☾ Compact warm seats" (`ui/index.html:85`), **hidden unless
   `newerBuild`**. Its click closes Consonance and opens the new exe; every seat resumes as at any launch. Prior art for
   a relaunch: `dev/stick-apply.js` (a detached child waits until no `consonance.exe` runs, then relaunches; cited at
   `main.rs:9494`), or Tauri's own restart. Pick one and say why; the launch-id rule at `main.rs:9493-9497` applies to
   any child. If a pane is working, the click asks first (in the app, not a browser dialog).
4. **The glow**: look B on whichever button `nextMove` names; the tooltip (the `title`) says why in one line, e.g.
   "a newer Consonance is built (02:38): restart to use it; every seat comes back where it was" and "2 seats are over
   300k and worked in the last 50 minutes: compact them now".
5. **Not in this lap:** the window's own X (Windows draws it: `tauri.conf.json` has no `decorations`); any change to
   close-small's rule; the loop aura.

## Rows to print in the hand-back

- R1 (red first): the decision's rows, every case.
- R2: `newerBuild` true after the landing's rename (old exe moved aside, new written at the path), false before.
- R3: Restart hidden when not owed; shown and glowing when owed; shown dimmed while a pane works.
- R4: a Restart on a scratch launch (not his running app) brings every seat back with its conversation; say how shown.
- R5, his eye, BEFORE any build he runs: pictures of the top bar in the four situations, from the app's own page
  (headless or a screenshot of a scratch launch). The librarian shows them to him.
- Tests: the rows and the tests of the files you touch. **No whole suite** (that is the landing's). A second pane reads
  the diff before anything lands. `node consonance/tools/heavy-run.js --status && <run>` in one call for anything heavy.

## Registered failure line

Failed if, after it lands, a button glows that is not the proper move (Restart glowing while a pane is mid-turn, or
Compact glowing with an empty list), or nothing glows when close-small lists a seat or a newer build waits; or if a
press of Restart brings a seat back without its conversation.

## Standing rules

Commit by named paths on your branch. His words go in the lighthouse briefs, as here. Do not start, stop or rebuild his
running Consonance; no release build in this lap. Hand-back as a file in `exo_memory/handback/`, rung to the librarian
as a pointer, each claim marked checked or inferred, ending with who acts next.
