# D533: the File menu's Open and Previous versions lists draw themselves, not as native pop-ups. Librarian, 2026-10-29 10:5x

The user, 10:46: "big visual bug, when you click file, then open, then hover mouse down the list, it picks up the background layer of what would be behind it, example previous versions export test export etc".

## What it is (checked in t180-fresh 9e6a249)

- `app/index.html:276` `<select id="open">` and `:278` `<select id="versions">` are NATIVE selects inside the File menu (`.more-menu`, index.html:121). A native select's open list is a pop-up window drawn by the WebView, not by the page. In this frameless window (`tauri.conf.json:20` `decorations: false`) WebView2 paints that pop-up over the page and, as the pointer moves down it, the list's rows show the page content behind them (the menu's own buttons: Previous versions, Export, Test export) in place of the list's background. The page's CSS cannot reach a native pop-up, so no stylesheet fixes it.
- Every other list in the menus is drawn by the page (the Pieces menu's `.piece-row`, index.html:156; the tick rows; the panels), and none of those shows the bug.

## The change (pane A, CHECK IT: a menu flow a person sees)

Replace the two native selects with lists the page draws, in the look the menus already have:
- "Open…" becomes a menu entry that unfolds a list of the saved tracks as rows (as the Pieces menu lists pieces: one row per track, name, hover highlight, click opens), built when the menu opens as menubar.js builds every entry, keyboard-reachable (arrows and Enter), Escape closes; the menu closes on a pick as it does today. The same controller code that filled the select (`app/core/trackmenu.js` or wherever `#open` is filled: A finds the one place by grepping `#open` / `'open'`) now fills the rows.
- "Previous versions…" the same way, with each row's date as the select's option text had it; its tooltip stays.
- The ids `#open` and `#versions` keep working for the tests that drive them (A checks which tests dispatch `change` on them and amends those to click a row, saying so), or the rows carry the same ids on a wrapper; A's call, the smaller change.
- No native `<select>` left inside any `.more-menu` (grep in the test).

Tests: the touched files' tests run once (menubar, trackmenu, core-shell where it drives Open); one new row: the File menu holds no `<select>`, the Open rows list the saved tracks, a click opens that track, Escape closes; a headless once-over of File ▸ Open with `--mute-audio`, no focus, or A says it did not. CHANGELOG [Unreleased] one line in a player's words. Branch from t180-fresh main 9e6a249; plain commit message, co-author line allowed, no lap ids in new comments.

Kept out: the Width like and Grip like selects in the left column (not in a menu, not reported; if they show the same the user says so).

surfaced: index.html:121/:156/:276/:278, tauri.conf.json:20, menubar.js:3-17/:64-98.
