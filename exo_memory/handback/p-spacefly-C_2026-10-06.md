# p-spacefly-C — B's D252 (4d58b99 + 44c7b5f): a SHORT note. The look was CANCELLED by the librarian's FEEL-tier rule; this is only what was already found

SOURCES: exo_memory/handback/p-spacefly-B_2026-10-06.md · `git log --oneline -3 b-spacefly` (44c7b5f amends 33cf6ab) · my scratchpad `sf/` reports named below

**Nothing blocks.** D252 is landed (44c7b5f). The runs below are in a REAL Tauri window on its own app data (`T180_TEST_APP_DATA`).
- Steam was FAKE: first through a fake `reg.exe` beside my test build, then through B's seam.
- The keeper's folder was unchanged in every run (`keeperChanged: []`). There was no AC launch. Every builder process and the fake `reg.exe` were removed after.

## Checked and fine (on 44c7b5f unless named)
- **The 200 ms Ctrl hold** (`sf/keys2/report.json`):
  - Left Ctrl alone: 0 m at 50 and 150 ms, descending from about 200 ms (−13.7 m at 600 ms). A 90 ms tap: 0. Right Ctrl: never.
  - Ctrl+Z / Y / Backspace after 100 ms: **no dip**, the shortcut ran.
  - After 400 ms: a −6.2 m dip, then back exactly (the backstop).
  - Ctrl+S saved into the run's own folder. Ctrl+wheel changed the lens only (fov 1.047 → 0.911, the eye unmoved).
  - Space on a focused Extend button did not click it (pieces 3 → 3) and flew up 15.2 m. Space in the name field typed ("a b").
- **The startup card**:
  - Through B's seam, with my fake `reg.exe` never asked: first run shows it; Use it remembers it; a restart is silent (banner 0 px); the remembered folder's `content\tracks` gone → the card again.
  - Export to Assetto Corsa **without answering the card** found the fake AC, remembered it and installed `t180b_c_look` with the marker. Another author's folder was untouched.
  - **With no Steam find, Export opens the real folder picker:** the app's visible windows included "Your Assetto Corsa folder (the one with content\tracks)". Nothing was remembered or written. (`sf/card4/report.json`)
- **The ⋯ menu:** Export…, Test export (unfinished)…, Assetto Corsa folder…, See it in Assetto (disabled) with its setting.
- **Targeted JS on 44c7b5f:** preview, share-install, keys-anywhere, undo-guard, core-eqonly, onboarding, camera, guides, layout-css, shell-layout → **210 / 210**. `cargo test ac::` → **16 / 16**.
- **B's tests:** additive only; no existing test line was removed or changed in 4d58b99..44c7b5f (`git diff … -- app/test | grep "^-"` → none).

## Found (small; for whoever next touches these lines)
1. **The card stays up after Export already found AC.** Pressing Export without answering found and remembered the folder, but the card still read "Assetto Corsa found at … Use it / Choose another…" until the next start. Cosmetic.
2. **The open ⋯ menu can run past the window.** After Use it, the install note puts the full AC path in the header row, which pushes ⋯ right.
   - At the app's default 1400 px, with my ~150-character scratch path, the open menu sat at x 1301–1561: **161 px off the right edge**.
   - With the menu closed, the header fits (overflow 0, head and base alike).
   - inferred: the keeper's real path is shorter, so it may fit; not measured.
3. **The seam's one leak path** (by reading `ac.rs:163-167`): `std::env::var` returns `Err` for a value that is not valid Unicode, and that falls through to the REAL registry. Unset → registry, and set-to-missing or relative → nothing, both hold as written.
   - inferred: a set-but-non-Unicode value is the only way through. `env::var_os` would close it. Not run live (the leak check was queued and cancelled).
4. **UNVERIFIED, worth one look: a page-error flood.** In one key run, switching to the OVERHEAD view after Space/Ctrl/E flights threw "lookAt: up is parallel to the view direction" every frame (~1,500 page errors: renderer, labels, handles).
   - Whether B's change causes it or it predates it is NOT known: the repro on head vs base was queued and cancelled.
   - The other key runs, which never switched to overhead, had 0 errors.
5. **UNVERIFIED: a Ctrl-snapped handle drag.** By reading, `handles.js` calls `preventDefault()` on `pointerdown`, which in a real browser suppresses the compatibility `mousedown` that `preview.js`'s `onAnyDown` listens for.
   - So "a button joins Left Ctrl" may never fire on a handle drag. Ctrl pressed after the press (held more than 200 ms) could then fly the camera mid-drag.
   - My window drags missed the handle (the near-end length handle was off-screen), so this is neither confirmed nor refuted.

## Corrections, mine
- Card phases C and D first stopped at "name the track first" and "the loop is not closed": my own setup. They were re-run with a saved, closed lap.
- My recorder for the picker never installed (`__TAURI__.core.invoke` is not writable). The real picker opened instead, which is the evidence above.
- One `node -e` patch was mangled by bash backticks; it was redone with a script file.

NEXT: chair — nothing owed; items 4 and 5 are the ones worth a check when someone next touches the camera or the handles
