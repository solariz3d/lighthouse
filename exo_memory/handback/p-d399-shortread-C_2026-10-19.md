# D399 short read (fc8c445): pane C, 2026-10-19

Packet: the chair, 2026-10-19T08:34:27Z, for 0.4.8. Read E's D399 textures, `git diff c2d7cb5..fc8c445` (703c711 then fc8c445), read-only, against five checks. The conditions are from the librarian's 2026-10-18 notes (entries 19:44, 19:57, 21:52).
Seat: pane C (sibling-0845a868). My own d582c9e (D401) is not read here; it goes to another reader.

## 0. Verdict

All five checks hold. Nothing blocks.

Two notes for B at integration, neither blocking:
- D399's CHANGELOG line says "with **Music** it follows the melody's look", but D401 (d582c9e) renames that choice **Random**. In the 0.4.8 tree the two lines should agree; one word in D399's line.
- Row 2's "with a menu open" is the File menu only. The other menus carry the same tile over different texts, and they aren't measured.

## 1. The five tiles reach the build

- checked, by reading (`git show fc8c445:src-tauri/build.rs`, :9-24 and :33): `copy_dir(app → dist/app, skip ["test"])` copies every file and folder except entries named `test`, at any depth. `tauri.conf.json` has `"frontendDist": "dist"`. So `app/themes/tex/` is copied whole.
- checked: `git ls-tree fc8c445 app/themes/tex/` → aqua, aurora, glass, sigil and skyline .png, all tracked.
- checked, the tiles are what their script writes: `scripts/texture_tiles.js` from fc8c445, run with its output folder pointed at my scratchpad, writes five tiles byte-identical to the committed ones (`cmp` → same ×5). Sizes: sigil 14,885 B, skyline 5,453, glass 275, aqua 3,659, aurora 75.
- inferred: not built here (no cargo build; "no install" holds). As the librarian's 19:57 entry has it, the final proof is B's grep of the 0.4.8 installed exe for `app/themes/tex/aqua.png` at landing.

## 2. The contrast row really requires 0 texts under 4.5:1 in all five looks

- **What row 2 asserts** (`app/test/texture-page.test.js`):
  - For each of the five looks (`LOOKS`), and in two states (the builder with six pieces placed, and with the File menu open), every text that reads ≥ 4.5:1 with the texture switched off (`--tex: none`) still reads ≥ 4.5:1 with it on. `assert.deepEqual(pushed, [])` holds that 0 are pushed under.
  - There is a guard that the probe found the page's texts (`n > 20`).
- **What it doesn't assert:** that no text at all is under 4.5:1. Texts already under it with the texture off aren't counted. That's the claim the CHANGELOG makes ("every text that met the 4.5:1 contrast guideline still does"), so the row matches its claim.
- checked, run whole under the lock, on a detached worktree of my own at fc8c445 (`SC/d399r/texture-page.out`): 5 of 5 pass. Row 2's diagnostic shows 77 texts compared in the builder and 83 with File open, 0 pushed under, in all ten look-and-state pairs.
- checked, a probe copy of row 2 (untracked, in that worktree only; `SC/d399r/mkprobe.js`, outputs `probe.out` and `probe2.out`) that also reports what the row leaves out:

| look | already under 4.5 with the texture off (builder / File) | least guarded ratio, texture on |
|---|---|---|
| sigil | 0 / 1 | 4.70 ("climb change") |
| aqua | 1 / 3 | 4.69 (the piece count line) |
| skyline | 2 / 3 | 4.79 ("Export to Assetto Corsa") |
| glass | 1 / 3 | 5.53 |
| aurora | 0 / 1 | 6.49 |

  - The texts already under are all over the 3D view, not on a textured surface: the grid status line ("Grid: auto: ground grid …", 1.07) and the canvas labels ("turn", 1.01 to 4.18; "+30.00°", 1.97).
  - For every one of them the ratio is the same with the texture on and off (e.g. 1.07 → 1.07, 3.91 → 3.91), so the texture costs them nothing. They're outside D399.
- The tightest guarded margin is Aqua's 4.69, 0.19 above the line. That's in step with E's own note that Aqua at 0.09 sat on 4.50.
- Not measured: the contrast at display scales 1.25 and 1.5 (row 2 runs at DPR 1). inferred: the same, since the tile's alpha doesn't change with scale, only its pixel size.

## 3. The textures never sit on the 3D canvas

- checked: `git grep "var(--tex)\|--tex:" fc8c445 -- app` → `--tex` is used as a background layer only on `header`, `.more-menu` and `#left` (index.html :63, :114, :194, plus each skin's own header, menus and #left). It isn't used on `#stage`, `#preview`, the canvas, `#camera` or `#guide`.
- checked: row 1 asserts the computed `background-image` of `#stage`, `#preview` and `#preview canvas` carries no `themes/tex/` in all five looks. It passes in my run.
- Note, not a finding: `#left` floats over the 3D view (z-index 10, backdrop-filter), so the panel's texture is drawn above the canvas inside the panel's own box. That's the cost the D404 drag-frame gate measures on the integration tree (the librarian's 02:33 ruling), and B owns it.

## 4. The ASCII appears only with no pieces

- checked, by reading (index.html, the boot):
  - `showArt` sets `#empty-art.hidden = !(pieces.length === 0)`. It's subscribed to the shell and run once at start.
  - The `<pre>` starts `hidden`, `aria-hidden="true"` and `pointer-events: none`.
  - A missing state hides it.
- checked, row 3 in my run: shown with 0 pieces, hidden after one Extend, shown again after Undo, in sigil and aurora. Its colour is the look's `--dim`.
- checked, row 4: no overlap with `#left` at 900, 1100 and 1400. The art spans x 367–853, 467–953 and 617–1103 against `#left`'s 12–320; overlap 0 px².
- inferred: a loaded file or File ▸ New goes through the same shell subscription, so the art follows them too. Not run.

## 5. The commit messages carry no "keeper"

- checked: `git log --format=%B c2d7cb5..fc8c445 | grep -ci keeper` → 0, over both messages (703c711 and fc8c445).

## 6. Also seen

- checked, row 5 in my run: at DPR 1.25 and 1.5, each fine tile (sigil, skyline, glass, aurora) covers its own size in device pixels on the header, `#left` and the menu (e.g. aurora [3, 3], glass [8, 300]).
- Aqua's 256 px tile is sized in CSS px, by design (soft noise, no pixel structure; the test's comment says so).

## 7. What I ran, and the lock

- Two runs, each through lockrun: `texture-page.test.js` whole, and the probe's row 2 twice (once for the counts, once for the list).
  - The lock held "E D404 review core_piece alone" when I checked. I didn't touch B's integration tree.
- The worktree `t180-wt-c23` (detached at fc8c445) held only the untracked probe file. Removed: `git worktree remove --force`, then `git worktree list | grep -c c23` → 0.
- No build, no install, no push, nothing committed.

NEXT: B adds D399 (fc8c445) to the 0.4.8 tree when the librarian clears this read, with the CHANGELOG's "Music" made "Random" to match D401.
