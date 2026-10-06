# T-180: Space flies the camera up, Left Ctrl flies it down. Librarian, on D, 2026-10-06 11:4x. Lap D252.

The keeper, 11:36: "space bar to go up, lft control to go down?"

## What exists (read at t180 `eeec787`, `app/preview/preview.js`)
- Flying is W/S forward and back, A/D left and right, **Q/E down and up**, Shift sprints (`:18`). Held keys are keyed by the physical key
  (`heldKey`, `e.code`), and every held key is dropped on blur.
- **Ctrl is already used:** Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z / Ctrl+S / Ctrl+Backspace (`app/core/keys.js`), Ctrl+wheel is the lens
  (`preview.js` `onWheel`), and Ctrl snaps a handle drag (`app/core/handles.js`).
- Space on a focused button would click that button.

## The lap (B; FEEL tier, targeted tests + a real window on its own app data)
1. **Space = up, Left Ctrl = down**, as held keys beside Q/E (Q/E stay). By physical key: `Space` and `ControlLeft` only; Right Ctrl does
   not fly.
2. **Left Ctrl flies only while it is the ONLY key down.** The moment another key (Z, Y, S, Backspace, …) or the wheel joins it, or a handle
   drag is in progress, the descent stops for that press, so Ctrl+Z never moves the camera.
3. **Space never clicks a focused button** when the canvas has the keys: the preview takes it (preventDefault) unless a text field has
   focus (the existing `swallowsKeys` rule).
4. The help line at `:18` and the guide say it.

## Checks
- Rows red on `eeec787` first: Space rises, Left Ctrl alone descends, Ctrl+Z does not move the camera and still undoes, Ctrl+wheel is still
  the lens, Space in the track-name field types a space.
- Real window: fly up with Space, down with Left Ctrl, then Ctrl+Z with the camera unmoved.
- No harness by the author; the librarian runs the touched ones once at install.

NEXT: chair dispatch D252 to B when this plan is read

## Second item for B, the keeper, 11:38: "Why is there export to assetto corsa, but then AC folder. why two export buttons"
Today's row (`app/index.html` after D250 item 1): **Export…** (any folder), **Export to Assetto Corsa** + **AC folder…** + **See it in
Assetto** (`app/install/index.js`), and **TEST export**. The librarian's ruling (reversible UI tidy):
1. **Export to Assetto Corsa** is the one main button.
2. **AC folder…** stops being a button: the result line after an export carries a small "change folder" link (the same picker), and the
   not-found message still opens the picker.
3. **Export… (any folder)** and **TEST export** go into a small "more" menu (⋯) beside it; **See it in Assetto** and its setting move there too.
- Tests that pin the buttons by name are amended by name; the install and export guards are untouched.

## Second item REVISED (the keeper, 11:39), replaces point 2 above
> "it shouldnt be there, creates too much clutter, the AC folder, instead, in the EXE startup, the user can choose where the track folder is
> in the beginning, freeing up UI space"
2'. **No AC-folder control on the main screen at all**, and no "change folder" link in the result line.
   **At startup**, when no AC folder is remembered (first run, or the remembered one is gone): a one-time setup card says
   "Assetto Corsa found at <path> (through Steam)", with **Use it** / **Choose another…**; if Steam finds nothing, it asks to pick the folder
   holding content\tracks. The answer is remembered; later startups say nothing.
   To change it later: one entry, "Assetto Corsa folder…", inside the ⋯ menu (no main-screen space).
Points 1 and 3 stand (one Export to Assetto Corsa button; Export…, TEST export and See it in Assetto in the ⋯ menu).
