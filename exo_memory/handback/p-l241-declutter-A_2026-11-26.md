# L241, pane A (L): the later changes' marks rest as one dot; a mark's arrows and label show only on hover, lit, drag, or for 2 s after it is added

**Builder branch `l241-declutter`, tip `77ffe18` (from cfa7ad9; pushed, `git ls-remote origin l241-declutter` = 77ffe18d62b9). Not merged, not built, not installed. Before-and-after pictures below, for him before any install.**

BASE: C:\Consonance\t180-wt-declutter cfa7ad9

## What changed (one file of code: `app/core/secondtick.js`)
- **At rest** a mark (every later change the panel's `marksAt` gives: extra turn, the flowing bank's marks, extra climb/width/cup) is **one dot** in its colour, radius 4.5 px, at the centre of its first stroke (inside the grab area the stroke always had).
- It is **shown** (its tinted stretch, its strokes, its four arrows and its label, all drawn exactly as before) only while: the pointer is over it (`hover`, set on a pointermove with no drag; the event is NOT taken, so handles and camera still get it); it is `lit` (its extra handle hovered or dragged, unchanged); it is being dragged by its tick; or for `FLASH_MS` = 2000 ms after it was **added** (one more mark of its field, at a from none had). A piece opened or the ghost shown, where marks arrive in bulk, flashes nothing.
- **Grab and drag unchanged**: the strokes are still computed and hit as before; `down` now uses `hitMark` = within HIT_PX of the dot OR of a stroke (the dot is the stroke's centre, so no new grab area). `panel.js` is NOT touched. The packet's anchors matched at cfa7ad9 (checked: `sed -n 1400,1460p app/core/panel.js` shows `label: ST.markText(...)` and `lit:` at 1443).
- The "drag handles" checkbox, the readouts, the ghost and handles.js are untouched (packet item 3).

## Rows
checked: `node --test app/test/core-mark-labels.test.js app/test/core-extra-handles.test.js app/test/core-second-bank-panel.test.js app/test/core-second-change-panel.test.js` -> 73 tests, 73 pass. These are the four test files that name secondtick or markText (`grep -rln "secondtick\|markText" app/test test`).
- New in `core-mark-labels.test.js`: **D1** at rest no label box, no label text, one dot per mark, at the stroke's centre; **D2** the pointer on one dot labels only that mark, off it the label goes; **D3** a lit mark shows its label and no dot; **D4** an added mark is labelled at 1.9 s and not at 2.1 s, the first draw's marks not at all (Date.now stubbed); **D5** a press on the dot and a drag move the mark to 520 m, labelled mid-drag.
- **Red first** (checked: `git stash -- app/core/secondtick.js`, then the file): D1, D2, D4, D5 and amended R1 fail, 12 pass. D3 passes before too (a lit mark always showed its label: it says what did not change).
- **Amended BY NAME** (the rule changed; comments in the file): the `marksLayer` helper takes `lit` and `marks`; R2a and R2b (label placement) now draw a lit mark, as their label was always drawn before; R1 now asserts no label at rest, then hovers the dot and asserts the label at 380 before the same drag. The stub context records `arc` calls (new field `arcs`).
- Not run: the whole suite, any mutation harness (tier "check it").

## Pictures for him
The real page `app/index.html` in headless Chrome, with a stand-in for the native side serving his pieces folder read-only (`declutter_screens.js` in the evidence folder; nothing written there).
- **Piece used: "Coast Esses"**, not "Smooth S straight": at 00:45 his pieces folder held only `Coast Esses.t180piece` (1,639 B) and its recipe (checked: `ls -la`, read only). Its recipe holds turn -1 with extra turns 92 from 80 and -91 from 200 (checked: read with node), and 1,639 = 1,645 - 6 name characters, so it is the straight S renamed (inferred from those two facts). The other pieces are no longer in that folder; not mine to look into.
- Camera: Free view, then Space held 5 s (up), S 1.5 s (back), a right-button look drag of 70 px down (`RISE=5000 BACK=1500 LOOK=70`). Above the S, looking down at it; NOT his exact angle (his looks from the piece's start toward the S). The same camera in both trees.
- `before/rest.png` (cfa7ad9): 7 label boxes and the arrow pairs. `after/rest.png` (77ffe18): no label box. `after/hover_bank.png`: the pointer on a bank dot shows only "Bank 4 · passes 25.00° at 255.00 m". `after/hover_turn.png`: only "Extra turn 2 · 200.00 m → end · turns over 100.00 m". `before/hover_bank.png`, `before/hover_turn.png`: the same pointer points (`hover_points.json`) on the old tree, unchanged from its rest.
- **Said plainly, two things he will see:**
  1. Of the 7 dots (printed by the script: 2 turn, 5 bank), 4 sit under a field handle's glyph in this view ((668,440), (678,437), (654,370), (341,257) css px), so only 3 are plain to see. A press there is the handle's, as it was before this change (`hooks.yields`).
  2. The **field handles** (the double arrows with a bar, about 13 in `after/rest.png`) are not marks and are not changed; they are what the "drag handles" checkbox turns off. If he still calls it cluttered, they are the next thing (the registered failure "he says it is still cluttered" can fire on them).
- pageErrors: none in either run.

## For pane C (vary what I ran)
- Rows: other fields' marks (climb, width, cup: same path, no row of mine); a mark added in the middle of a field (index shift: the flash is matched by field and from, not index); two marks added at once (no flash, by design); hover while a handle is dragged; a touch or pen pointer (pointermove only).
- Pictures: other cameras (Build, Overhead), a piece with no flowing bank, the drag handles checkbox off.

## The machine, as found
- The T-180 app was running throughout (`tasklist`: t180-track-builder.exe; he is using it). I did not touch it. Nothing installed. No process of mine left running.
- `C:\Consonance\t180-wt-piece` is back on `l238-piece-ghost` cfa7ad9, clean. I had first made the branch there; I moved it to its own worktree, `C:\Consonance\t180-wt-declutter` (l241-declutter), before the pictures, which stays for C and the landing. Its `src-tauri/Cargo.toml` had only line endings rewritten by L240's release build; restored with `git checkout` (no content change: `git diff --ignore-cr-at-eol` empty).
- Builder CHANGELOG (Changed) and MAP.md (the secondtick line) updated in the same commit.

SOURCES: packet_t180_declutter_A_2026-11-26.md, briefs/t180_ui_declutter.md and its png, sed -n 1400,1460p app/core/panel.js, node --test (four files), git stash, declutter_screens.js runs, ls of his pieces folder, tasklist, git ls-remote
NEXT: librarian show him before/rest.png beside after/rest.png and the two hovers, and send pane C the diff cfa7ad9..77ffe18, when you have read this

## L241 fix (pane C's read, 6ebbc15): new tip 36d2d31

BASE: C:\Consonance\t180-wt-declutter 77ffe18

- **C was right.** A draw with no ghost set `prevByField` to `{}`, so on the ghost's return a field with ONE mark read as "0 before, 1 now" and flashed its label for 2 s, with nothing added.
- **Fix, C's line, taken as right in kind:** `prevByField = pose ? byField : null` (`app/core/secondtick.js:149`). A draw with no ghost saw no marks, which does not mean there were none. So it forgets, and the return is a first draw. A real add while the ghost is shown (a field going from 0 to 1 mark) still flashes, because that compares two draws with a ghost.
- **Row, red first (checked):** C's V4 taken into `app/test/core-mark-labels.test.js` as **D6** (my helper's ghost can now go and come back: `state.ghost`). At 77ffe18 it fails: `actual: [ 'Extra bank ·', 'drag to star' ], expected: []`; the file was 17 pass, 1 fail. With the fix: 18 of 18.
- **Runs (checked):**
  - The four touched files: `node --test app/test/core-mark-labels.test.js app/test/core-extra-handles.test.js app/test/core-second-bank-panel.test.js app/test/core-second-change-panel.test.js` -> 74 tests, 74 pass.
  - C's own file on my tree: `T180=C:/Consonance/t180-wt-declutter node --test .../p-l241-read-C_2026-11-26_evidence/c-l241-read.test.js` -> 10 tests, 10 pass.
- **CHANGELOG** unchanged: its line ("for 2 s after it is added") still says what it does.
- Builder `l241-declutter` 36d2d31, pushed (`git ls-remote` = 36d2d314c6). No build, no install; the T-180 app left running as found.

SOURCES: exo_memory/handback/p-l241-read-C_2026-11-26.md:19-45, c-l241-read.test.js (V4), node --test, git ls-remote
NEXT: pane C re-run V1-V9 on 36d2d31 when you have read this section
