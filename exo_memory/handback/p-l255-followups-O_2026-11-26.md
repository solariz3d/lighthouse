# L255, pane O: the chrome refactor's follow-ups from P's read of L249 (2026-11-26, 12:3xZ)

**Branch:** builder `l255-chrome-followups` at **a64c625**, on 40e931e (`l249-chrome-refactor`), in the worktree `C:\Consonance\t180-wt-o-l255`.
Committed by named paths, **not pushed**, nothing merged, built or installed. His app was not touched.
**Packet:** `exo_memory/loop/packet_t180_chrome_followups_O_2026-11-26.md` (7682e056), from P's CLEAN read `handback/p-l249-read-P_2026-11-26.md`
(rows 11 to 13, "Two of A's lines", "Older than the range"). Tier: check it.
**No markup change.** Every item held on to an existing rule, so nothing was refused.

## The seven items

| # | item | what changed (checked unless marked) |
|---|---|---|
| 1 | Export hovers | One rule per look, in aurora, skyline and skyline-night: `[data-theme=X] header #install > button:hover:not([disabled]) { background: var(--accent-hover); }` (1,3,2, which outranks the look's own Export rule, 1,1,2). **Not one rule for all six:** in SIGIL, aqua and glass Export is an outline button, not a solid fill, and it already hovered (P: 18%, 81%, 5% of its pixels). Step 10, "solid fill, hovered", has nothing to mean there; one rule for all six would have filled SIGIL's Export with its light accent under light words. The text keeps each look's own colour on the fill. |
| 2 | the 999 px capsule lines | Deleted: `skyline.css:49` and `skyline-night.css:47`. Export's capsule is now `index.html:180`'s formula on the factor alone. No visible change today (both looks are at factor 1). |
| 3 | SIGIL's titles hover | `index.html:165` (new): `:root:not([data-theme]) .more > summary:hover { background: var(--hover); }`. SIGIL is the look with no `data-theme` (`index.html:26`), so no skin's title changes. |
| 4 | the File menu in the window | `index.html:194-197` (new, beside D396's own `width < 1000px` query): `@media (width < 1000px) { header :is(#m-file, #m-edit) > .more-menu { right: auto; left: 0; } }`. See "Item 4" below: the probe found more than the packet said, and **Edit is included**. |
| 5 | one frame on a focused field | The accent border on `:focus` dropped in all six places: `index.html:231` (the rule replaced by a two-line comment at :236-237), and one rule in each skin (`aqua.css:90` and `aurora.css:73` keep their `box-shadow`, which is not a frame; `glass.css:71`, `skyline.css:64` and `skyline-night.css:62` deleted). The ring (`index.html:232`) is the one mark. |
| 6 | the values strip's corner | `app/core/valuesoverlay.js:34`: `border-radius:8px` → `border-radius:var(--r3)`, one token in one line. checked (`evidence/pics_after.json`, `stripCorner`): it computes to each look's r3: sigil 4, glass 0, aurora 6 (all three were 8), aqua 8, skyline 8, skyline-night 8 px. |
| 7 | the CHANGELOG line | Two entries under [Unreleased]. **Changed:** L249's refactor, what and why, with his word on the draft, and how to roll back. **Fixed:** these four. |

**index.html lines touched** (the chair's ask, for A's left-column change in the same file). In 40e931e's numbering:
- **:165**, one line added after `.more[open] > summary` (old :164);
- **:194-197**, four lines added after D396's `@media (width < 1000px)` line (old :192);
- **:231**, the `input:focus` rule replaced by a two-line comment (new :236-237).

All three are header and menu rules, nowhere near `#left`. checked: `git diff -U0 40e931e a64c625 -- app/index.html | grep ^@@`.

### Item 4: the probe found more than the packet said

checked (`node evidence/filemenu_probe.js <tree>` → `evidence/filemenu_base.json`, every 10 px from 900 to 1400, all six looks):
- **The File menu is off the window from 900 to 950 px, not only at 900:** −55, −45, −35, −25, −15, −5 px. From 960 it fits.
- **The Edit menu is off at 900 too, by 2 px** (−2..258), in every look.
- The other five menus fit at every width.

**What I chose:** under 1000 px (the bar's narrowest fold, D396's existing query), File and Edit hang from their titles' left edges.
- At 900 File spans 158..418 and Edit 209..469.
- From 1000 up every menu opens leftwards, as before, so nothing he sees at 1400 changes.
- 1000 leaves 40 px above the last width File needed it (960), and it covers a 979.2 px window at 125% scaling.
- **Edit goes past the packet's word "File"**: same defect, same width, same rule. If that is not wanted, drop `#m-edit` from the `:is()`.
- The alternative, File opening rightwards at every width, would also be robust, but it changes the menu at his usual width for no gain there.

## Rows: red first, then green

Four new rows in `app/test/texture-page.test.js`, rows 15 to 18, after row 14, on its own six-look harness with a real pointer and a real click:

| row | what it holds | red at 40e931e (checked) |
|---|---|---|
| 15 | a real pointer over Export changes 1% or more of its pixels, every look | skyline, aurora, skyline-night 0.0% (`evidence/red_rows15_18.txt`) |
| 16 | the same for the File menu's title | sigil 0.0% |
| 17 | every open menu on the bar lies inside the window at 900, each 10 px to 1000, both sides of each wider fold, and 1400 | File at 900-950 and Edit at 900, all six looks (`evidence/red_row17_amended.txt`; run against the base page with only `index.html` set aside by `git stash` and put back) |
| 18 | a clicked field wears the 2 px accent ring, and its border keeps its resting colour | all six looks: the border turned the accent |

**Green at a64c625** (checked):
- `node --test --test-name-pattern="row 1[3-8] " app/test/texture-page.test.js` → **6 of 6 pass** (`evidence/green_texture_13_18.txt`).
- `node --test app/test/theme.test.js` → **14 of 14** (the glow and scale rows among them; `evidence/green_theme.txt`).
- `app/test/menubar-page.test.js` rows 1, 2, 8 and 17 → **4 of 4** (`evidence/green_menubar_1_2_8.txt`, `green_menubar_2_17.txt`): the bar, a menu opening and closing, the bar at 1400, and the bar at every width from 900.
- **Row 15's figures:** Export changes sigil 18.7%, aqua 80.3%, skyline 69.4%, glass 16.7%, aurora 71.5%, skyline-night 72.2% of its pixels.
- **Row 16's figures:** File title sigil 80.4%, aqua 79.0%, skyline 14.2%, glass 13.3%, aurora 80.5%, skyline-night 81.5%.
- **The hovered Export reads well above 4.5:1** (row 14's check, on its own pixels): aurora 14.31, skyline 7.67, skyline-night 9.54 : 1.

Tier "check it": no mutation harness was run, and none anchors on a line I moved (checked: `grep` of every `*mutation*.test.js` for the selectors and values touched → no match).

## For his eye (local, not committed)

`C:\Consonance\t180-wt-o-l255\out\l255-pictures\` (gitignored, `.gitignore:2:out/`), 20 pictures from the real page in headless Chrome
(`evidence/pics.js`, `pics2.js`), `before_*` at 40e931e and `after_*` at the tip:
- **A clicked field:** `*_field_skyline_rest/clicked.png` and `*_field_aurora_rest/clicked.png`. Before, the accent border and a gap and the ring;
  after, the ring alone with the field's own faint border inside it.
  - checked (`pics_after.json`): skyline's border stays `rgb(166, 200, 234)`, aurora's `rgba(150, 200, 255, 0.24)`.
  - inferred by eye: neither look reads worse.
- **Export hovered:** `*_export_{aurora,skyline,skyline-night}_rest/hovered.png`. Before, the hovered picture equals the rest; after, the flat step-10
  fill (aurora `#7ef5c8`, skyline `#0751a6`, skyline-night `#89cdff`).
  - **For his eye, named:** in the two skylines the resting fill is a gloss gradient. Hovered, it is flat (the top highlight line stays). It reads as a
    hover; whether he wants the gloss kept on hover is his call.

## Said plainly (what this does not do)

- **`--accent-hover` is still drawn nowhere in SIGIL, aqua and glass**, because Export is not a solid fill there. Not checked: whether any other solid
  fill in those looks (a dialog's main button) should hover on step 10.
- **inferred, not checked in the page:** a `select` opened by mouse now shows no focus mark while open. Chrome does not match `:focus-visible` there,
  and before, its border turned the accent. Its open list is on screen at that moment. Buttons work the same way.
- **The values strip is the element A's L254 calls the values band** (`[aria-label="piece values"]`). My change is only its corner, inside
  `valuesoverlay.js`'s inline style; A's rules are in `index.html`. An `index.html` corner rule of A's would lose to the inline style unless
  `!important`.
- **Rows 15 to 18 are appended to `texture-page.test.js` after row 14.** If A or C also append rows there, the landing meets a conflict at the file's
  end. It resolves by keeping both.

## Leaving the machine

- **No process of mine is running.** checked: no chrome, node or cargo process names this worktree, the profile prefix `t180l255o-` or this session.
  No `t180l255o-*` or `t180tex-*` profile folder is left in `%TEMP%`.
- **`git stash` was used once**, for row 17's red run: `index.html` set aside, the row run, popped.
  - The stash list is shared by every worktree of the repo. checked: the popped diff was my own 8 lines of `index.html`, and the list holds only its
    older entry ("On main: L leftovers 2026-09-29").
  - **Not again:** a pop in a shared repo could take another pane's stash.
- **Kept:** the worktree and its gitignored `out/l255-pictures/`.

## Corrections in this lap

- **My first row 17 tested 900 and then 999 and up**, so it would have passed a fix that left 910 to 950 off the window. The probe showed the band, and
  the row now steps every 10 px to 1000 and checks all seven menus.
- **My first menubar run named rows "2" and "17" with a pattern that needed a space after the number**, so row 2 never ran. It was run again with rows
  1 and 8: 3 of 3.

## Evidence

`p-l255-followups-O_2026-11-26_evidence/` (42 KB, 13 files):
- the scripts `run_l255.ps1`, `filemenu_probe.js`, `pics.js`, `pics2.js`;
- the probe and picture outputs `filemenu_base.json`, `pics_before.json`, `pics_after.json`;
- the test outputs `red_rows15_18.txt`, `red_row17_amended.txt`, `green_texture_13_18.txt`, `green_theme.txt`, `green_menubar_2_17.txt`,
  `green_menubar_1_2_8.txt`.

BASE: C:\Consonance\t180-wt-o-l255 40e931e

NEXT: pane P reads `l255-chrome-followups` (a64c625) when the librarian routes it; the pictures in `out/l255-pictures` are for him before any install.
