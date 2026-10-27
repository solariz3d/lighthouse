# D502: the track builder's UI read against the Third Place's reference. Librarian, 2026-10-27 17:3x

The Third Place rang at 17:24 with `exo_memory/research/ui_unslop_guide_2026-10-27.md` (git-blob 0cf8113e, filed 3acd1f46): eight passes read frame by frame from a 10-second before/after of a dashboard, "the keeper asked for it as a reference for the librarian". The reference is a record and travels as one; nothing about its uptake goes back to the Third Place (its guard 4).

The builder's UI today, checked: base styles are the one inline `<style>` in `app/index.html` (585 lines; the frameless title bar `#winctl` at :288, `#status` at :262); five themes in `app/themes/` (aqua, aurora, glass, skyline, skyline-night); the menubar in `app/menubar/` (menubar.js, items.js, layoutsdialog.js, layoutsexport.js). Nobody has measured its spacing, icon edges or copy against a scale.

## Part 1, pane C (just do it: a note and screenshots, no code change)

Read the guide whole first. Then, on the installed 0.4.25 (headless, `--mute-audio`, BelowNormal, never a visible window), at 2560×1440 in each of the five themes:
1. **Spacing.** Screenshot the main screen, the Sculpt panel, the menubar with one menu open, the Layouts dialog, and the status line. Overlay the vertical and horizontal gaps as the guide's pass 1 does (measured from the DOM, `getBoundingClientRect`, not by eye) and list which values repeat and which are one-offs. Propose one scale (the guide's lands on 16/18/24/32/36; ours may differ) and show the same screenshots with the gaps snapped to it (a CSS override injected for the render only; nothing committed).
2. **Edges and icons.** Guide lines down the left edge of every icon+label row in the menubar, panels and dialogs: which rows start text at a different x, and why (emoji, mixed icon widths, inset differences). Count emoji and mixed-set icons in the UI strings (`app/menubar/items.js` and index.html) and name a single line-icon set that already exists in the repo if one does.
3. **Colour.** Per theme: where colour is decoration (gradients, glows, coloured pills, gradient text) and where it carries data (mode, selection, warnings, the sculpt band's cyan). Show each theme with decoration-colour removed and data-colour kept, as the guide's pass 3.
4. **Copy.** Every label, badge, delta and heading the user reads: all-caps tracked labels, exclamation marks, emoji, greetings, counts in pills. Propose the sentence-case form beside each, and for every number say what it is compared with.
5. **The note.** `exo_memory/handback/p-d502-C_<date>.md`: the measurements, the proposals in the guide's order (spacing first, then colour, then content), each with a before/after render path, and a one-line cost (which file, roughly how many lines). Renders to `C:\Users\nname\Downloads\t180-d502-renders\` as PNG, named `<theme>-<region>-<before|after>.png`. The librarian publishes them as one artifact page for the keeper to pick from (visuals as artifacts), so name every file and say in the note what each shows.

No code is committed in Part 1. No change to how the builder looks ships from it.

## Part 2 (check it), after the keeper picks
The picked changes as one branch, installed on his machine with the usual backup and sha256 compare, NO release until he has judged it in the app (looks ship to the keeper first). Then it rides the next batch.

Kept out: the previewer's 3D view and the sky (D489's line); fonts (the guide could not identify them either). Tier: Part 1 just do it; Part 2 check it. surfaced: the guide (research/), index.html:262/:288, app/themes/, app/menubar/.
