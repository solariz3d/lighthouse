# Hand-back, pane B: D348 part 2 (ledger D349), the left-side UI inventory for the menu-bar mockup

Packet: the chair's ring at 2026-10-17T12:14:33Z. Brief at `exo_memory/loop/plan_t180_handoff_2026-10-15.md:1162` and `:1226-1229`. Uncommitted.

- **What I read:** T-180 tip `0a11fb4` on feature/denser-asphalt, by `git show`, never checked out. No tests run, no code changed.
- **Where to check the line numbers:** `git show 0a11fb4:<path>`, read beside each row.
- **A's research** (`p-d348-ui-research-A_2026-10-16.md`) was not opened before this list was written.

**The columns:**
- **Kind:**
  - *value*: a number or choice that describes the next piece or the selected pieces;
  - *track value*: describes the whole track, and is saved in the document;
  - *command*: an action you run once;
  - *mode*: a switch that changes what other controls do;
  - *view*: changes only what is shown;
  - *setting*: kept across sessions or files.
- **Likely use is inferred throughout,** from what the control does and its defaults, not from usage data. There is no telemetry.
  - *constant*: every piece or every session;
  - *often*: most sittings;
  - *sometimes*: some tracks;
  - *rare*: once a track or less.

## What sits on the left today

`app/index.html:190-197`: one floating column, `#left`. It holds:
- `#palette`, the core panel: `app/core/panel.js`, with `piecesui.js`, `spawnsui.js` and `pitui.js` mounted inside it;
- `#side`, three sections:
  - `#reds`, the export's refusal list;
  - `#validation`, `app/validate-ui/index.js`;
  - `#textures`, `app/core/textures.js`.

The order on screen is the `root.replaceChildren` call at `panel.js:511-526`. The camera bar (`#camera`) floats at the bottom of the view and is not part of the left column.

### 1. "Equation track" (`panel.js:512-513`)

| control (as shown) | what it does | kind | likely use | where |
|---|---|---|---|---|
| status line ("N pieces · L m · open/closed · last op ms") | read-out of the track | view | constant (passive) | `panel.js:557` |
| **Undo** | one step back (Ctrl+Z) | command | constant | `panel.js:513` |
| **Redo** | one step forward (Ctrl+Y, Ctrl+Shift+Z) | command | often | `panel.js:513` |

### 2. "Extend at the head": the fields (`panel.js:514-516`)

Each field shows the head's current value. Left as shown, it sends nothing: the track keeps going as it goes (`panel.js:134-138`). Fields marked "at start" each have their own **at start** box (below).

| control | what it does | kind | likely use | where |
|---|---|---|---|---|
| **length m** | length of the next piece (default 100) | value, next piece | constant | `panel.js:128`, `:514` |
| **turn °** (as a corner) / **turn °/100m** (as a rate) | heading change of the next piece. Corner: exact degrees, ends straight. Rate: an eased-to rate. +at start | value, next piece | constant | `panel.js:128`, `:170-175`, `:198` |
| **climb °** / **climb °/100m** | pitch change, the same two readings. +at start | value, next piece | often | `panel.js:129`, `:171`, `:198` |
| **turn & climb as** (corner °, ends straight / rate °/100 m) | how the turn and climb fields are read; kept from piece to piece; default corner | mode | rare (set once) | `panel.js:167-168`, `:514` |
| **bank °** | bank of the next piece; any number of degrees, kept within one turn. +at start | value, next piece | often | `panel.js:129`, `:189-192` |
| **cup °** | cross-section edge angle, 0–150. Cup and tube exclude each other. +at start | value, next piece | sometimes | `panel.js:133`, `:178-187` |
| **width m** | road width. +at start | value, next piece | sometimes | `panel.js:130` |
| **width like…** | fills width from a known T-180 track's measured median; for a tube, the distance round | value helper | rare | `panel.js:149-161`, `:266` |
| **grip %** | grip of the next piece, a whole percent 50–150; left as shown it keeps the head's | value, next piece | rare | `panel.js:202`, `:206-208` |
| **grip like…** | fills grip from a known track's measured friction | value helper | rare | `panel.js:203-204`, `:268` |
| **edge angle °** | extra tilt of the outer band. +at start | value, next piece | rare | `panel.js:141` |
| **right edge °** | the right side's edge angle; blank follows the edge angle. +at start | value, next piece | rare | `panel.js:144` |
| **edge start** | where the edge curve begins, as a share of the half-width, 0.5–0.95. +at start | value, next piece | rare | `panel.js:145` |
| **tube sweep °** | the cross-section as an arc, 0–360 (360 is a closed pipe). +at start | value, next piece | rare | `panel.js:146` |
| **at start** (one box per channel field: turn, climb, bank, cup, width, edge, right edge, edge start, tube) | reach the value within the first 20 m and hold it, instead of easing over the piece; kept from piece to piece | mode, per field | sometimes | `panel.js:193-196`, `:122` |
| **drag handles** (checkbox, on) | marks on the ghost (and on the sculpted piece) that drag values into the fields | mode / view | rare (set once) | `panel.js:345-346`, `:515` |
| **colour by grip** (checkbox, off) | colours the track blue, white or orange by grip | view | rare | `panel.js:209`, `:573` |
| tube note / grip note (text) | explain the width of a tube, and what a grip number means | view | passive | `panel.js:154`, `:205` |
| **readout** box (length, turn change, climb change, bank change, cup, edge, edge start, tube, corner, climb corner, bank to gravity) | what the next piece would be, before it is placed | view | constant (passive) | `panel.js:227-244` |

### 3. "Extend at the head": the buttons (`panel.js:517-518`)

| control | what it does | kind | likely use | where |
|---|---|---|---|---|
| **Extend** | add the piece the fields describe; hovering shows the ghost | command | constant | `panel.js:286-287` |
| **Jump** | add the piece, then a free flight to a landing you move by hand | command | sometimes | `panel.js:459-460` |
| landing boxes (forward, sideways, height, heading, pitch, bank) | move the landing while it is the head; one undo step each; shown only then | value, landing | sometimes (after Jump) | `panel.js:448`, `:462-469`; `landing.js:15` |
| **Straight** | a piece with turn 0 and climb 0, reached in 20 m | command | often | `panel.js:291-296` |
| **Level** | a piece that ends straight and level (climb solved) | command | sometimes | `panel.js:301` |
| **To floor** | a piece that ends straight, level and at height 0 | command | sometimes | `panel.js:302` |
| **Turn by** + **turn by °** (90) | a piece that turns exactly the angle and ends straight | command + its value | sometimes | `panel.js:306-309` |
| **Turn to grid** + **grid °** (90/45/15) | a piece that turns onto the nearest grid direction | command + its value | sometimes | `panel.js:313-324` |
| end-heading line ("end heading x°, y° off the 90° grid") | read-out for Turn to grid | view | passive | `panel.js:315-320` |
| **Sharp** + **sharp °** (90), **sharp radius m** (22), **sharp ramp m** (4) | a tight corner held at a radius, then dead straight | command + its values | sometimes | `panel.js:328-332` |
| jump note (text) | a refused jump's reason | view | passive | `panel.js:450-451` |

The Turn by, grid, sharp and landing values are each a command's argument, not a piece's channel. A menu would carry them as the command's dialog or popover, not as fields of their own.

### 4. "Brush (drag on the track)" (`panel.js:519`)

| control | what it does | kind | likely use | where |
|---|---|---|---|---|
| **sculpt (shape only)** | reshape one placed piece's bank, cup, width, edge, wall rise and tube without moving the route | mode | sometimes | `panel.js:344`, `:439-443` |
| sculpt hint (text) | what to do next while sculpting | view | passive | `panel.js:567` |
| **on** | arms the brush: a drag on the track edits it | mode | sometimes | `panel.js:340`, `:355-356` |
| **mode** (height / sideways (local); rate (one channel)) | brush kind | value, brush | rare | `panel.js:339`, `:349` |
| **what** (channel: turn rate, climb rate, bank, width, wall rise, cup, edge angle, edge start, tube sweep, right edge; or height, sideways) | what the brush changes | value, brush | sometimes | `panel.js:347-348` |
| **radius m** (60) | brush size | value, brush | sometimes | `panel.js:339` |
| **sharp (may nudge ≤ 0.1 mm outside)** | finer control points, so the brush acts at exactly its size | mode | rare | `panel.js:342` |

### 5. "Close" (`panel.js:520`)

| control | what it does | kind | likely use | where |
|---|---|---|---|---|
| **Close the loop** | one press: tries every way of closing and applies the best | command | rare (once a track) | `panel.js:476-481` |
| **Cancel** (shown only while it works) | stops the close | command | rare | `panel.js:482`, `:488-491` |
| close line (text) | what the press did, or why not | view | passive | `panel.js:483-497` |

### 6. "Start & grid" (`spawnsui.js:103`, mounted at `panel.js:521`)

| control | what it does | kind | likely use | where |
|---|---|---|---|---|
| **place by hand** | off: the export places the start; on: you place the line, grid and hotlap (adds a spawns block) | mode, track | rare | `spawnsui.js:20`, `:47-52` |
| mode line (text) | says which way the start is placed | view | passive | `spawnsui.js:80-81` |
| **start line m** (box) + slider | the line's distance into the first piece | track value | rare | `spawnsui.js:22-24`, `:53-55` |
| **cars** | grid car count, 1–64 | track value | rare | `spawnsui.js:25`, `:56` |
| **pack length m** | metres between two cars in a column | track value | rare | `spawnsui.js:26`, `:57` |
| **pack width m** | metres between the two columns | track value | rare | `spawnsui.js:27`, `:58` |
| **pole gap m** | line to the pole car (also by dragging a grid box) | track value | rare | `spawnsui.js:28`, `:59` |
| **Measured spacing** | resets pack length and width to the measured T-180 spacing | command | rare | `spawnsui.js:29`, `:60` |
| **Hotlap on selected piece** | puts the hotlap spawn on the selected piece | command | rare | `spawnsui.js:30`, `:61-65` |
| **Remove hotlap** | removes it | command | rare | `spawnsui.js:34`, `:70` |
| **hotlap piece** + **hotlap m** + slider | which piece, and how far along it | track value | rare | `spawnsui.js:31-33`, `:66-69` |
| hotlap line, checks list (text) | the hotlap's run-up and speed; the reds and ambers on the line, grid and spawns | view | passive | `spawnsui.js:35-36`, `:91-101` |

### 7. "Pit lane" (`pitui.js:85`, mounted at `panel.js:522`)

| control | what it does | kind | likely use | where |
|---|---|---|---|---|
| **pit lane** | adds or removes the pit lane (off by default) | mode, track | rare | `pitui.js:26`, `:51-56` |
| **side** (right/left) | which side it peels off | track value | rare | `pitui.js:27-28` |
| **leaves on** (piece) **at m** | where it leaves | track value | rare | `pitui.js:30` |
| **rejoins on** (piece) **at m** | where it rejoins | track value | rare | `pitui.js:31` |
| **gap from road m**, **lane width m**, **peel-off m**, **merge m** | its shape | track value | rare | `pitui.js:32-35` |
| **pit boxes**, **box spacing m** | the practice spawns on it | track value | rare | `pitui.js:36` |
| **Flatten road for pit** (shown only when the join is too steep) | lowers the cup or tube beside the lane | command | rare | `pitui.js:39-40`, `:81` |
| status line | the lane's length and boxes, or why it can't be built | view | passive | `pitui.js:37`, `:82-83` |

### 8. "Selected pieces" (`piecesui.js:168`, mounted at `panel.js:523`)

Selection itself happens on the track, not in the column: click a piece, Shift-click for a run (`piecesui.js:131-147`).

| control | what it does | kind | likely use | where |
|---|---|---|---|---|
| selection line (text) | what is selected, its length, at the end or across the start line | view | passive | `piecesui.js:153-155` |
| **name** | name for Save as piece | value | sometimes | `piecesui.js:39` |
| **grip %** + **grip like…** | grip of the selected road pieces | value, selected pieces | rare | `piecesui.js:44-47` |
| **Set grip** | applies it (one undo step) | command | rare | `piecesui.js:48` |
| **Save as piece** | keeps the selection in the library | command | sometimes | `piecesui.js:40` |
| **Delete selected** | at the end: removed; in the middle: previewed first | command | often | `piecesui.js:41` |
| **Clear selection** | clears it | command | often | `piecesui.js:42` |
| **Apply delete** / **Cancel delete** (shown only during a middle-delete preview) | apply or drop the previewed delete | command | sometimes | `piecesui.js:50-51`, `:58` |
| delete preview text, overlap check, place buttons | what the delete moves; a click on a place moves the camera there | view | passive | `piecesui.js:56-78` |

The **Pieces library** (`piecesui.js:169`) is not on the left when the page has `#pieces-bin`. It is the top bar's **Pieces ▾** (`index.html:176`, `panel.js:509-510`), with:
- **mirror on insert**;
- per row, **Add at head**, **Add mirrored**, **Rename** and **Delete**;
- a click on a row adds it (`piecesui.js:81`, `:95-111`).

### 9. "Local example" (`panel.js:524`)

| control | what it does | kind | likely use | where |
|---|---|---|---|---|
| **fit** (file), **read** (file) | pick a `*.pieces.json` fit and its `*.read.json` | value | rare (developer use) | `panel.js:499` |
| **Open example** | opens that fit as a track | command | rare (developer use) | `panel.js:501-503` |
| message line | the shell's last message (errors red) | view | constant (passive) | `panel.js:505`, `:560` |

### 10. The side sections under the panel (`index.html:192-196`)

| control | what it does | kind | likely use | where |
|---|---|---|---|---|
| **Not exported** list (`#reds`; shown only after a refused export) | every red, grouped, with a button per place that moves the camera there | view | sometimes | `index.html:310-323` |
| **CSP (wall raycasting)** (checkbox, on) | the checker's wall raycasting; also decides which checks Close can reuse | mode | rare | `validate-ui/index.js:45`, `:48` |
| validation summary, load graph, findings list | the live checker's verdict | view | constant (passive) | `validate-ui/index.js:44-48` |
| **road surface** (Asphalt (made here) / Solid colour / My picture) + file picker | the road texture the preview draws and the export writes | value, track look | rare | `core/textures.js:87-89`, `:101` |

## The "⋯" menu today (`index.html:178-184`, and what mounts into it)

| item | what it does | kind | where |
|---|---|---|---|
| **Export…** | writes an AC track folder into a folder you pick; nothing installed | command | `index.html:179`, `:368-376` |
| **Test export (unfinished)…** | exports an open or red track into AC as `t180b_<name>_test`, reds as warnings | command | `index.html:180`; wired by `install/index.js:39` |
| **Assetto Corsa folder…** | picks the AC folder exports go into | setting (saved natively) | `install/index.js:20`, `:28`, `:30-31` |
| **See it in Assetto** | launches AC on the last exported track; disabled until allowed | command | `install/index.js:21`, `:42` |
| **See it in Assetto (launches the game)** (checkbox) | allows the launch | setting (saved natively) | `install/index.js:22`, `:27`, `:41` |
| **mute** (checkbox) | turns the builder's sounds off | setting (localStorage) | `index.html:182`, `:349-351` |
| volume slider (0–100) | sound volume | setting (localStorage) | `index.html:182`, `:352` |
| **Copy track code** | the whole track as one line of text | command | `share/index.js:12`, `index.html:183`, `:405` |
| **Paste track code…** + its text box | opens a track from such a line | command | `share/index.js:11`, `:13` |

**The rest of the top bar,** for the merge (`index.html:169-187`):
- **New**, the **track name** box, **Save** (Ctrl+S), **Open…** and **Previous versions…**;
- **Pieces ▾** (the library);
- **Export to Assetto Corsa** with its note (`#install`; `install/index.js:19`, `:28`);
- the status text, and the window buttons.

The startup card ("Assetto Corsa found at… Use it / Choose another…") appears in the banner row (`install/index.js:46-55`). The guide's **Show the guide** button is in `#guide` over the view (`onboarding/index.js:51`).

## Every setting kept anywhere

checked: `git grep -nE "getItem|setItem|localStorage|sessionStorage|KEY *=|store\.(get|set)\(" 0a11fb4 -- app` and the native commands in `src-tauri/src/lib.rs:478-520`, `ac.rs:29-30`.

| setting | where it is kept | what it keeps | set from | where |
|---|---|---|---|---|
| `t180.sound.muted` | localStorage | `'1'` when muted | ⋯ menu, mute | `sound.js:30`, `:277-280` |
| `t180.sound.volume` | localStorage | volume 0–1 (default 0.6) | ⋯ menu, volume slider | `sound.js:30`, `:281` |
| `t180.coreLook` | localStorage | the road surface chosen, `asphalt` or `solid` (a picture is not remembered) | left column, road surface | `core/textures.js:26`, `:80-81`, `:86`, `:101` |
| `t180b.onboarding` | localStorage | JSON `{ how, at }`: the guide was finished or skipped, and when (so it doesn't open again) | the guide's ✕ / finish | `onboarding/firstrun.js:16`, `:19-27`, `:33-35` |
| `ac_root.txt` | the app's data folder (native) | the Assetto Corsa folder | ⋯ menu Assetto Corsa folder…, the startup card, or found through Steam on the first export | `ac.rs:29`, `:43`; `lib.rs:478-496` |
| `see_it_in_assetto.enabled` | the app's data folder (native) | `yes` / `no`: whether See it in Assetto may launch the game | ⋯ menu checkbox | `ac.rs:30`, `:226`; `lib.rs:505-512` |

**Kept for the session only, never saved** (inferred from the code, which has no store for them; they reset at every start):
- the **turn & climb as** switch (default corner, `panel.js:168`);
- the **at start** boxes (`:193-196`);
- **drag handles** (on, `:346`);
- **colour by grip** (off);
- the **grid °** step;
- **mirror on insert**;
- **CSP** (on);
- the brush's mode, channel, radius and sharp.

The code calls several of these "a kept preference" (`panel.js:166`, `:193-194`, `:290`), but they are kept in memory only. They are candidates for a Settings menu that would save them.

**Not settings, but files the app keeps,** listed so the menu doesn't mistake them for preferences (`index.html:219-241`):
- the tracks;
- their backups ("Previous versions");
- each track's undo history (`eq-<name>.t180undo`);
- saved pieces (`<name>.t180piece`) and the library file;
- the autosave;
- `input-late.log` (`index.html:339-344`).

## For the merge, inferred (not checked against A's research)

- **Constant per piece:** length, turn, climb, Extend, Undo. They are the only things a top menu would slow down. Everything else in sections 6–9 is rare, and is either a whole-track value (start, grid, pit lane) or a one-off command (Close, Local example).
- **Settings-menu candidates found:**
  - mute and volume (saved);
  - the AC folder and the launch permission (saved);
  - road surface (saved);
  - CSP;
  - turn & climb as;
  - drag handles;
  - colour by grip;
  - grid step;
  - the guide's "show again" (the onboarding key can be cleared: `firstrun.js:27` `forget()`).

  The last six are not saved today.
- **Hidden-until-needed controls** (Cancel, Apply/Cancel delete, the landing boxes, Flatten road for pit) appear in place when their state arises. They belong beside what caused them, not in a menu.

NEXT: librarian merges this with A's research into the mockup for the keeper (plan default)
