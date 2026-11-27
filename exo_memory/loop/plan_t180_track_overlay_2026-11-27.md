# Plan: the "Track overlay" window (L260 track 6, pane O, 2026-11-27): a plan and a mock, no build

- **The order:** the chair's of 07:13:15Z.
- **The packet:** `loop/packet_t180_overlay_and_sculpt_carry_2026-11-27.md` (room 40e922ab), "Track 6".
- **His words,** 2026-11-27 01:11 on L, answer 4: *"Maybe it has its own window on the top that says track overlay, and you can choose from tracks you have already made and ones from the assetto corsa folder too."*
  - With answers 1 and 2: *"We do not build it, merely generate the geometry of the track itself within the previewer ... you should be able to use it as reference or even to trace the real track the equation builds."* and *"it must only act as a guide."*
- **Base:** builder `landing-1126-batch` f3cd425, read only (`git show`, and an archive in my scratchpad). No builder branch or commit.
- **Hand-back with the evidence:** `exo_memory/handback/p-l260-overlay-O_2026-11-27.md`. The pictures sit in its evidence folder, **untracked**.
- **Names:** placeholders only. His saved tracks are "made 1" to "made 14", in the order the Open list sorts them. Assetto Corsa layouts are "reference N".

## My bias, stated first

- **I wrote** the kn5 road reader Road draws through, and the follow-tool plan his 01:11 words closed. So I hold a stake in the overlay carrying weight.
- **The unwelcome outcome, named:** *"the window adds a second way into one panel and a crowded bar, for a list of his own tracks he could as well open with File ▸ Open."* §8 weighs it.

## The answer, in seven lines

1. **Not refused. Build it,** with his look at the mock first.
2. **At the top:** a door of its own, a header button **"Track overlay"** beside Export, or a menu title **"Overlay ▾"** after View.
   - **Neither fits every width as mocked** (§1, row 17's own measure). "Track overlay" overflows by 71, 31 and 33 px at 900, 1000 and 1100 px; "Overlay ▾" by 38 and 6 px at 900 and 1100.
   - **My lean is the button, its label folding with the bar:** "Track overlay" from 1280 px, "Overlay" from 980 px, hidden under 980 px, where View ▸ Track overlay… is the door.
3. **A made track is drawn from its saved file, read only:**
   - **Line** is its centre line at its own width and bank, about 0.2 s for his longest (13.2 km).
   - **Road** is its road as the builder builds it, 2.35 s there.
   - A file the builder refuses is marked "(cannot be read)" with its words, and never drawn in part.
   - An unsaved track has no file to read; the open track's last save can be picked.
4. **The two kinds are told apart** by two groups in the one list, **Your tracks (saved)** and **Assetto Corsa (installed)**. Each kind has its own key, its readout and its mode words.
5. **What stays the same:** Line and Road, the nudge, Show, Clear, the placement (its start on your start), the colour and the depth rule.
6. **Nothing of an overlay reaches a save, an undo step or an export.** R1 to R4 of `reference-panel.test.js` run for a made track too. The panel's native calls grow by exactly two reads, `list_tracks` and `open_track`.
7. **Cost:** tier **check it**, about 22 rows.
   - one new file, `src/reference/made.js`;
   - changes to `app/reference/panel.js`, `app/menubar/items.js` (or the header markup in `index.html`), `menubar-page.test.js` row 1 (amended by name), `reference-panel.test.js`, CHANGELOG and MAP;
   - no core, no stored data, no native command.

## 1. Where "at the top" it sits

**Today:** View ▸ "Reference track…" (`app/menubar/items.js:60`) sends `t180:reference-panel` (`app/index.html:465-468`). That opens the panel at the top right, under the bar (`app/reference/panel.js` CSS: `top: 44px; right: 10px`). The window is already at the top. What he asks for is its own door, named for it.

**Two doors, both mocked** in SIGIL and Skyline (`sigil_A_*`, `sigil_B_menu.jpg`, `skyline_A_*`, `skyline_B_menu.jpg`):
- **A, a header button "Track overlay"** before Export. It is pressed while the window is open. It is literally *"its own window on the top that says track overlay"*.
- **B, a menu title "Overlay ▾"** after View. Its menu holds Track overlay…, Show it and Clear it.

**Does each fit?** checked: menubar row 17's own measure (its `BAR` expression, copied verbatim) at row 17's twelve widths, in both looks (`node o_fit.js <tree>` → `fit.json`):

| door | fits row 17's measure at (px) | fails at (px: overflow) |
|---|---|---|
| none (today) | all 12: 900, 979, 980, 999, 1000, 1099, 1100, 1279, 1280, 1319, 1320, 1400 | none |
| A, "Track overlay" | 979, 980, 999, 1099, 1279, 1280, 1319, 1320, 1400 | **900: 71; 1000: 31; 1100: 33** |
| A2, the same button saying "Overlay" | all but 900 | **900: 39** |
| B, "Overlay ▾" | all but 900 and 1100 | **900: 38; 1100: 6** |

- The same in SIGIL and Skyline, to the pixel.
- At every failure the grab strip had already shrunk to its 24 px floor and the bar then overflowed.
- Not measured: row 17's second half, the 125% frames at 979.2 to 1319.2 px.

**So neither door fits as mocked.** Each must fold with the bar, as its titles do (D396).

**My lean, from these numbers: door A, its label folding.**
- **"Track overlay"** from 1280 px, his usual width (row 8 holds the bar at 1400). It fits at 1280, 1319, 1320 and 1400.
- **"Overlay"** from 980 to 1279 px. It fits at 980, 999, 1000, 1099, 1100 and 1279.
- **Hidden under 980 px.** View ▸ Track overlay… is the door there.
- inferred: this fits all twelve widths, because each label was measured alone at its own band. Row 17 holds the combination in the build.
- **Door B needs a fold at 1100 for 6 px as well as at 900,** so it folds in more places for the same result, and is my second choice.
- The literal "says track overlay" is then what he sees at his own width.

**The View entry stays** as a second door, renamed "Track overlay…". Row 3's rule ("the moved controls work from their new place") and his habit both keep it.

## 2. A made track, drawn from its saved file, read only

**Where his tracks are:**
- the native `list_tracks` (`<app data>/tracks/<name>.t180track`, `src-tauri/src/lib.rs:17`, `:110`);
- filtered to `eq-` names as the shell's Open list does (`app/core/coreshell.js:1733`, `PREFIX = 'eq-'` at `:102`). The old piece builder's tracks are not listed, as in Open.

**How it is read:**
- the native `open_track` (the text, `lib.rs:252`), then the core's own `D.parse`;
- **never the shell's `open()`**, which would replace his document (`coreshell.js:1718-1731`);
- no undo sidecar, no autosave, no recent list;
- nothing is written anywhere. The file is read once a pick, as an AC line is.

**checked, his 14 saved tracks on L at f3cd425** (`node o_made_probe.js <tree> <his tracks folder>` → `made_probe.json`, read only, names never printed):
- **14 of 14 parse.** The 2 old piece-builder files are not listed.
- **Lengths:** 650 to 13,233 m.
- **All 14 start at the origin, heading 0** (`made_starts.txt`).

**The cost of drawing each,** in node at BelowNormal:

| what | the longest (13,233 m, 39 pieces, closed) | the other 13 |
|---|---|---|
| parse | 4.5 ms | under 1.3 ms |
| segments | 128 ms | |
| path at 2 m | 56 ms | |
| a ribbon of its width | 20 ms | |
| the builder's own road mesh (`buildMesh`, lean, as the overlap check builds it) | 2,348 ms | at most 369 ms |

**Line and Road for a made track:**
- **Line** = its centre line as a ribbon at its own width (the width channel at each sample) and banked as built, about 0.2 s at 13 km. It is the same shape `ribbonOf` returns for an AI line (`batches`, `edges`, `lengthM`, `width`, `closed`, `start`). So `placeAt`, the nudge, the preview's `setReference` and the depth rule take it unchanged.
- **Road** = its road as the builder builds it: cup, edges and tube, the road-surface batches only of the lean mesh. It is read once a pick, showing "reading…" as a kn5 Road does. 2.35 s at 13 km, measured.
  - inferred: about 4.3 s and more memory on a 24 km track. None of his 14 is that long.
- **The mode words follow the kind:** "Line (its centre and width)" and "Road (its road as built)" for a made track. "Line (its AI line)" and "Road (its kn5)" stay for Assetto Corsa. The mock still shows today's words, because only the list and the title were injected.

**Placement:** its start on your start, as for an Assetto Corsa layout (`placeAt`).
- All 14 of his start at the origin, heading 0. For his tracks, start-on-start is also where the file puts them, so nothing is moved that would mislead.
- A track saved with another start would be moved onto his start like any reference, and the readout says so.

**A file the builder refuses:**
- `D.parse` throws `BAD_JSON` (not JSON) or `BAD_DOC` (`src/core/document.js:547`: "schema must be … (a newer file needs a newer builder)"). It also throws the CoreErrors `checkDoc` raises.
- B's right-width build writes `t180b.core/7` (`handback/p-d677-right-width-B_2026-11-27.md`). f3cd425 refuses that by this same line. That is the likeliest real case: a track saved by a newer build, overlaid in an older one.
- **The rule is the panel's own:**
  - refused in words: "cannot be read: a newer builder saved it", or the parse's words;
  - its entry is marked "(cannot be read)";
  - whatever was shown before is taken down;
  - never drawn in part.
- A track with no pieces says "it has no road yet" and draws nothing.

**The open track:**
- **Unsaved and never named:** there is no file, so it is not in the list. His road is already drawn.
- **Named, with unsaved edits:** its saved file is listed as **"<name> (open now: its saved file)"**. Picked, it draws the last save under his edits, a way to see what changed since.
  - His document, its dirty mark, its name and its undo history do not change. That is a row.
- **Named and unchanged:** the same, and it lies exactly under his road.
  - checked, D1 at f3cd425: the reference goes down first and writes no depth, so his road covers it.

## 3. Telling the two kinds apart

- **One list, two groups:** **Your tracks (saved)** first, then **Assetto Corsa (installed)** (`<optgroup>`). Shown in `sigil_list.jpg` and `skyline_list.jpg`, the list opened inline for the picture.
- **Keys of their own:** a made track's is `made` + `\u0001` + name; an Assetto Corsa layout's stays track + `\u0000` + layout (the panel's `keyOf` today). A made track named like an installed track never collides.
- **The readout says which:**
  - "your track "<name>", from its saved file: 13,233 m, closed, 31 m wide";
  - against "<n> m along its line … read N ms" for Assetto Corsa.
- **The note under it says what it is drawn from**, as Line's and Road's notes do today.
- **The API:** `pick(track, layout)` stays for Assetto Corsa; `pickMade(name)` is new; `state()` gains `source: 'made' | 'ac'`.

## 4. What stays as it is

- **Line and Road:** the two modes, and switching while a pick reads (P6 to P11's rules).
- **The nudge:** x, z, up, turn; no scale.
- **Show and Clear:** Show off keeps the pick and the nudge; Clear drops both.
- **A later pick wins** over one still reading (P5). Picks are one stream whatever their kind.
- **The look:** one class on the page's tokens (L1, L2), the menus' ground in every look.
- **The depth and colour rules:** D1, D2.
- **The internal names stay:** `createReferencePanel`, `.reference-panel` (six skins style it in `.more-menu, .reference-panel`), the `t180:reference-panel` event, `window.__t180Reference`, `src/reference/`.
  - Renaming them touches six theme files and every test for no change he can see.

## 5. Nothing of an overlay reaches a save, an undo step or an export

`app/test/reference-panel.test.js` R1 to R4 prove it today for Line and Road, through the real core shell and preview:
- **R1** the document (`:482-492`): the very same document object, its text, no shell emission. Its native-call assertion `['list_reference_tracks', 'read_reference_line', …]` is the one that names reads.
- **R2** a save: the track and its undo file byte for byte.
- **R3** an undo step.
- **R4** an export: every file byte for byte.

**Extended:**
- `everything()` gains made picks: a made track, a refused one, and the open track's own saved file.
- **R1 to R4 run for a made track in both modes.** Four more rows from the same loop over `['line', 'road']`.
- **R1's call assertion grows by exactly `list_tracks` and `open_track`.** It also asserts, by name, that `save_track`, `backup_track`, `save_undo`, `open_undo` and `save_autosave` are never called.
  - That amends R1 by name, with a comment: its rule changed from "only AC lists and reads" to "only lists and reads".
- **R5 (new):** the open track's saved file picked while he has unsaved edits. His document, dirty mark, name and history are unchanged. A later save writes his edits, not the file the overlay read.

## 6. The rename's reach (checked: `git grep` over `app`, `src`, `test`, `MAP.md` and `CHANGELOG.md` at f3cd425)

| place | today | becomes |
|---|---|---|
| `app/menubar/items.js:60` | label "Reference track…", and its title text | "Track overlay…", the title naming his tracks and the installed ones |
| `app/reference/panel.js:67` | the window's title "Reference track" | "Track overlay" |
| `app/reference/panel.js:66` | dialog `aria-label` "reference track" | "track overlay" |
| `app/reference/panel.js:70` | the list's `aria-label` "the installed track to show" | "the track to show: yours, or one installed in Assetto Corsa" |
| `app/reference/panel.js:81` | the nudge's `aria-label` "move the reference: …" | "move the overlay: …". **N1** (`reference-panel.test.js:412`) matches it, and is amended by name, one line |
| `app/index.html:467` | status "Reference track: <error>" | "Track overlay: <error>" |
| comments | `items.js:7`, `panel.js:1`, `index.html:463`, `markwindow-page.test.js:133`, `reference-panel.test.js:2` | the new words |
| `MAP.md:37`, `:109` | "View ▸ Reference track…" | the new door and words, and `src/reference/made.js`'s line |
| `CHANGELOG.md` | `:23` (L243/L250's entry) keeps its words as history | a new entry under [Unreleased]: Changed (the name, the door) and Added (his tracks in the list) |

- **No test asserts the old visible words** (checked: `git grep` of "Reference track", "Line (its AI line)", "Road (its kn5)" and the list's label in `app/test` and `test` → only comments). N1's `aria-label` is the one match.
- `menubar-page.test.js` **row 1** asserts the bar reads exactly File … Settings then Export (`:100`). Either door changes that list, so row 1 is amended by name. Row 8 (1400 px) and **row 17 (every fold from 900 px)** must stay green unamended (§1).
- `texture-page.test.js` row 17 (every open menu inside the window from 900 px) runs if B is chosen.
- checked: none of the 36 mutation test files at f3cd425 names `app/reference/*`, `menubar/items.js`, `menubar-page` or `reference-panel` (a grep of each file's text). So no harness is owed.

## 7. Rows and tier

**Tier: check it.**
- behaviour a person sees (a door, a list, a drawing), with no stored data, no core and no native command;
- read-only is invisible, so R1 to R5 are rows, not eyes.
- **Red first** for the new rows that can be: the list, the refusals, R5.

| file | rows |
|---|---|
| `test/reference_made.test.js` (new, about 8) | a made track's Line from OUR OWN document text lies on its own path within 1 mm, at its own width; Road is the builder's own road surface; its start pose; refused in words: not JSON, a newer schema (a `t180b.core/7` text), a `checkDoc` failure; an empty track; nothing is written (a storage double that throws on any write) |
| `app/test/reference-panel.test.js` (about 10 new, 2 amended) | M1 the list has both groups, his saved tracks first, the old piece-builder files left out; M2 a made pick draws it start on start, in both modes, with the mode words of its kind; M3 a refused made file is marked "(cannot be read)" with its words, and the one shown before is taken down; M4 a made track and an installed track of the same name are two entries; M5 a later pick wins across kinds; R1 to R4 for a made track (4 rows from the loop); R5 the open track's saved file; R1's call assertion **amended by name**; N1's label **amended by name** |
| `app/test/menubar-page.test.js` (row 1 amended, 1 new) | row 1 reads the new door; a new row: the door opens and closes the window, pressed while open, and in B its menu's three items act. Rows 8 and 17 run, unamended |

**Run:** these three files, plus `markwindow-page.test.js` (the panel over the handles) and `texture-page.test.js` rows 13 to 18 (the looks), as the touched files.

## 8. Would the window mislead him? (the refusal question)

**Not refused.** What I checked for:
- **Placement:** all 14 of his tracks start at the origin, heading 0. Start-on-start is where their files put them, so no made overlay sits anywhere but where it would.
- **Road for an Assetto Corsa layout** still draws every surface the layout counts as track: pit lane, run-off, other layouts' roads (L handoff item 6). That is unchanged by this plan.
  - My L259 survey measured it: the mesh runs more than 2 m past the AI line's side on 18.8% of side readings over 44 layouts (`handback/p-l259-follow-plan-O_2026-11-27.md`).
  - Road's note already says so. The rename must not drop that sentence.
- **Line for an Assetto Corsa layout** is a racing line, not the centre (`src/reference/ribbon.js:25-26`). Unchanged; its note says so.
- **A made track is drawn from its last save,** never his unsaved edits. The open one says "(open now: its saved file)", so he cannot mistake it for what he is editing.
- **At 900 px** the window already covers the right end of the values band by 143 × 50 px (L handoff item 3). A door at the top does not change that. It is still open.

**The unwelcome outcome:** File ▸ Open already reaches his tracks, but it *replaces* his road. The overlay shows another of his tracks *under* the one he is editing, which nothing does today. So it is not a second Open.

## 9. The mock

In the hand-back's evidence, **untracked**: 12 pictures from `node o_mock_overlay.js <tree> <out>`.
- **The page:** the real page at f3cd425, headless, with a stand-in native side.
- **Injected and marked "mock · not built":** the door, the window's title, and its grouped list with placeholder names.
- **The drawn made track is our own shape.** It goes through today's Line path (its centre line as an AI line), which is how a made track's Line would look. The build draws it from the saved file instead.

| picture | what |
|---|---|
| `sigil_A_window.jpg`, `skyline_A_window.jpg` | Overhead: the made track under his road, the window titled Track overlay, door A pressed |
| `sigil_A_header.jpg`, `skyline_A_header.jpg` | the bar with door A at 1500 px |
| `sigil_B_menu.jpg`, `skyline_B_menu.jpg` | door B, its menu open |
| `sigil_list.jpg`, `skyline_list.jpg` | the list, open: Your tracks (saved), Assetto Corsa (installed), a refused file, the open track's saved file |
| `*_A_header_900.jpg`, `*_B_header_900.jpg` | each door at 900 px, where the bar overflows (§1) |

## 10. His calls

1. **The door:** the header button (A, my lean, its label folding: "Track overlay", then "Overlay", then hidden under 980 px), or the menu title (B).
2. **Road for a made track:** its road as built, about 2.35 s at 13 km and more on a longer track; or Line only for his own tracks.
3. **Whether the open track's saved file belongs in the list.**
