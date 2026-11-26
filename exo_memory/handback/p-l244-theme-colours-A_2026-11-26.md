# L244, pane A (L): 0ab6cc8 is installed; each theme's own mark and handle colours are on l244-theme-colours

**First line: builder 0ab6cc8 (L241 + L242) is installed on L. The colours are on builder branch `l244-theme-colours`, tip `c9fe4f1` (from 0ab6cc8; pushed, `git ls-remote origin l244-theme-colours` = c9fe4f1f0c). The colours are not built or installed; that waits for his pick from the pictures.**

BASE: C:\Users\zackn\Downloads\t180-track-builder 0ab6cc8

## 1. L244a: the install (checked)
1. **Refusal checks.**
   - `C:\Consonance\t180-wt-declutter` is at 0ab6cc8 on `l242-themed-marks` with a clean tree.
   - `git diff --stat cfa7ad9 0ab6cc8 -- scripts/install-local.ps1 src-tauri/release.cjs` is empty, so the script L240 used is unchanged.
2. **Build.** `heavy-run.js --status` (no hold, both slots free) and the build ran in one call, in the background: `cmd /c "start /belownormal /wait /b node src-tauri\release.cjs"`.
   - **The first attempt failed:** `Unable to find your web assets ... frontendDist is set to "dist"`. This worktree had no `src-tauri/dist`.
   - **The fix** is the builder's own CLAUDE.md: create the empty folder and build again (build.rs fills it). It is gitignored.
   - The second build printed `t180-track-builder.exe: 15805440 bytes, no private paths` and `T-180 Track Builder_0.4.40_x64-setup.exe: 8204678 bytes, no private paths`.
   - Built exe sha256 `52442A955BD7E13A956D919E21562680C03098FB756CAA6CA8663128622D5DB0`.
   - **Said plainly:** `start /wait`'s rc is cmd's, not node's. The build is taken as done from its printed output, as in L240.
   - Each build rewrote only the line endings of `src-tauri/Cargo.toml` (`git diff --ignore-cr-at-eol` empty). Both times I put it back with `git checkout`, and the tree is clean.
3. **Before installing.** `tasklist` showed `t180-track-builder.exe` pid 35736 at the dispatch's time. At 08:27Z, when I came to install, `tasklist | grep -i t180` showed none: he had closed it. So the install ran then, not at the end.
   - The installed exe before: sha256 `65172D23AD06A9600BD9451029E542858EEEB106FA118E75DE511CB826698C4F`, the cfa7ad9 build from L240.
4. **Install:** `scripts\install-local.ps1 -Tag l244-0ab6cc8 -Installer <setup 0.4.40> -Built C:\build\lighthouse-target\release\t180-track-builder.exe -WaitSec 1`, rc 0.
   - **Backup:** `C:\Users\zackn\AppData\Local\T-180 Track Builder\t180-track-builder.exe.before-l244-0ab6cc8`, sha256 `65172D23AD06A9600BD9451029E542858EEEB106FA118E75DE511CB826698C4F`. This is the cfa7ad9 build.
   - **Installed exe:** sha256 `273D9D6ADBA5205505E4C6163C4283A730F2B6A4F08549B4FAE37440C1228E1D`, ProductVersion 0.4.40, 15,805,440 B.
   - **Stamped compare:** "equal (the built exe with UNK -> NSS at byte 13397674 is the installed exe)".
   - Builder processes: 0 before the install and 0 after.

## 2. The colours (packet item; tier "check it")

### Which six themes
SIGIL (`app/index.html` `:root`), plus the five skins: aqua, aurora, glass, skyline and skyline-night (`app/themes/*.css`). L242 touched five CSS files because SIGIL's tokens live in `index.html`, not in a theme file.

### What each sets
`--mark-bank/turn/climb/width/cup/length/edge`, written beside its L242 window tokens. Skyline also sets `--mark-rim: #ffffff`.

| theme | bank | turn | climb | width | cup | length | edge |
|---|---|---|---|---|---|---|---|
| SIGIL | #6b95ff | #c58cff | #f2c14e | #f0644a | #52d68a | #ffb3a7 | #47c4d6 |
| Aqua | #4fa8ff | #ff7ad9 | #ffe066 | #ff6b5a | #7dff9e | #ffe9b8 | #c8b6ff |
| Aurora | #5ab4ff | #ff6ec7 | #ffd86b | #ff6b6b | #b6ff5c | #f4f0ff | #c9a0ff |
| Glass | #5fa8ff | #c77dff | #ffd75e | #ff6470 | #4ee39a | #ffe2c4 | #7af0ff |
| Skyline | #0a4fff | #8a2be2 | #d99400 | #e0303c | #11a34a | #2a2f3a | #0a9a9a |
| Skyline Night | #4f9dff | #d77bff | #ffc44d | #ff5f6d | #3ee08f | #ffd9a0 | #4fe0e0 |

Each look's colours:
- **SIGIL:** softer and warmer, near its violet and paper.
- **Aqua:** a reef: coral pink, sand, and a pearl lilac for the edges. Teal would sink into its teal grid.
- **Aurora:** the curtains' pink, and lime for cup, because its road edges are already green.
- **Glass:** cold: ice cyan edges and a warm frost for length.
- **Skyline:** deep inks on a light sky, with a white rim instead of the dark one.
- **Skyline Night:** neon and sodium amber.

**Length is no longer white on any look.** Today's white sits 40 RGB from SIGIL's white road edges (`palette_check.txt`, row "today").

### Where the colours reach (`handles.js` `hueOf`)
The field is read off today's hue, in one place: `HUE_FIELD`. So every mark drawn in a field hue takes the look's colour, wherever that hue comes from:
- Build's kinds and their extras;
- the landing's forward, height and heading;
- the Sculpt brush glyph;
- Smooth's channel (`panel.js` passes the hue);
- the dots' rows and their inner half.

`paintOf` now goes through it. `secondtick.js` is unchanged; it already used `paintOf` and `--mark-edge`. Two hues have no field and stay as they are: the landing's sideways orange `#ff9f43` and the brush's sideways amber `#ffb020`.

A page with no tokens draws every hue as before:
- checked: W3 passes, unchanged.
- checked: W6, the no-token half, for every brush and landing kind.

### W4's bar
W4 is met on every look, so there is no refusal. Bank and turn are 90 apart at the least (SIGIL). Skyline is 136, the others 113 or more (`palette_check.txt`).

### Rows (`app/test/markwindow.test.js`)
- **W5:** every look sets all seven colours. Every pair of fields is 60 or more apart in RGB (W4's unit). Each colour is 60 or more off the look's `--road-edge`, `--ground-grid`, `--fog` and `--sky`. No two looks share their colours.
- **W6:** each brush and landing kind maps to its field's token, and Smooth's channel and the edge hue (in any case) map too. A hue with no field is unchanged, as is null or undefined. **Drawn:** a mounted overlay whose page sets the tokens draws the dots (white, red with the green inner half, green) and a bank brush glyph that Smooth paints in the token colours, and never in the literals.
- **Red first (checked):**
  - The file at 0ab6cc8: W1–W4 pass and W5 and W6 fail. I ran a copy in `t180-wt-declutter` and removed it after; that tree is clean.
  - Three draw mutants each fail W6, restored with the sha256 compared:
    - `drawDot`'s ring back to `h.colour`;
    - the brush's `B.colour` unrouted;
    - the inner half back to `h.inner`.
- **The touched tests (checked):** `heavy-run.js --status` (no hold), then `heavy-run.js --run` over the 17 test files that name `handles.js`, `secondtick.js` or `markwindow.js`, plus `theme.test.js` (the list is in `touched_tests.txt`).
  - **384 tests, 382 pass, 1 fail, 1 todo.**
  - **The one red is D642,** the timing flake that pane C measured at 5 of 12 red at the base (L242 read §4). Run alone afterwards, the file passes 3 of 3.
- That run came before one value changed: Skyline's bank, from #1a2fa0 to #0a4fff (below). After it, `node --test markwindow.test.js theme.test.js` gave 18 of 18. The other 15 files read no theme CSS (inferred, from the grep that chose them).
- Not run: the whole suite, and mutation harnesses (tier).

### The pictures for him (`p-l244-theme-colours-A_2026-11-26_evidence/pics/<look>/`)
- **How:** L242's `themed_screens.js`, unchanged apart from its first comment line. The real page in headless Chrome, his pieces folder served read-only, Coast Esses, Free view, L242's camera.
- **What, per look:** `rest.png`, `hover_bank.png` (a bank mark's label) and `drag_handle.png` (the bank's extra handle mid-drag).
- **checked (`run1.json`):** on every look the page drew its dots in that look's own `--mark-bank` (the script finds the bank as the commoner dot colour; it reads #6b95ff on SIGIL, #4fa8ff on Aqua, and so on), with 7 dots, a hover, a drag and 0 page errors.
- **Skyline, by eye:** I looked at all six. On Skyline the first bank, indigo #1a2fa0, read as the near-black length at handle size, although the two are 103 apart in RGB. I changed it to royal blue #0a4fff and took Skyline again (`run2_skyline.json`; the Skyline pictures are the new ones, and `run1.json`'s Skyline row is the indigo run). Now bank, turn and length read apart on Skyline.
- **Said plainly:** on Skyline Night, the lamp-warm length (#ffd9a0) and the sodium climb (#ffc44d) are 86 apart. They read apart in the picture, but less strongly than the other pairs.

### T3 (C's L242 read): left, not closed
The handle readout's frame key sees a theme only through `--ink` (`handles.js`, the key in `draw`). My colours do not make that bite:
- each real look still has its own `--ink` (C: 6 of 6), so a switch between the six still redraws;
- my change adds no token that a look changes without its `--ink`.

So I left the key as it is. inferred: a future skin sharing another's `--ink` would show stale colours until the next hover, as C said for the windows.

### The hold (chair, 08:34Z)
- No radius, glow, shadow or blur is changed in this lap (checked: in `git diff 0ab6cc8 c9fe4f1` the only changed lines that name a `--mark-win-*` token are the MAP.md entry's, which is prose; no value moved).
- Skyline's `--mark-rim: #ffffff` is the colour of the rim under each mark, not a glow; its width is unchanged.
- No colour pick needed a glow change. **For L246:** Skyline's glow is 0 and its marks rely on the white rim; whatever L246 decides about glows, that rim is now part of how Skyline's marks stand off the sky.

### Also changed
- The comments that promised "every canvas hue keeps its hue" (`aqua.css` and `glass.css` headers, SIGIL's L242 note, the `tokens.js` header) now say the marks are the exception.
- CHANGELOG has one Changed line, and the MAP's `markwindow.js` entry names `hueOf`.

## The machine
- The T-180 app: running at the dispatch's time; at 08:27Z he had closed it. I did not start it, and nothing of it runs now.
- His pieces folder was only read (served read-only to the pictures).
- New worktree `C:\Consonance\t180-wt-colours` (l244-theme-colours, clean).
- `t180-wt-declutter`: clean, with the built `src-tauri/dist` (gitignored) left in it.
- The built files are in `C:\build\lighthouse-target`.
- The builder repo's old stash is not mine and was left alone.

SOURCES: packet_t180_theme_colours_A_2026-11-26.md, p-l242-read-C_2026-11-26.md, git diff cfa7ad9 0ab6cc8 -- scripts/install-local.ps1 src-tauri/release.cjs, release.cjs output, tasklist, sha256sum, install-local.ps1 output, palette_check.js (palette_check.txt), node --test markwindow.test.js at c9fe4f1's tree and at 0ab6cc8, the three mutants, heavy-run.js --status and --run (touched_tests.txt), themed_screens.js (run1.json, run2_skyline.json), git ls-remote
NEXT: librarian show him the six looks' hover_bank.png and drag_handle.png, and send pane C the diff 0ab6cc8..c9fe4f1, when you have read this
