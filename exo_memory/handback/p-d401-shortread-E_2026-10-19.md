# Hand-back, pane E (machine D): D401 short read (C's Random rename, d582c9e)

Packet: the chair's D401 short read (sent 2026-10-19T08:34:42Z). `git diff c2d7cb5..d582c9e` (4 files +50 −9) read whole; C's hand-back `p-d401-random-C_2026-10-19.md`. Read-only. One pure-node check of the pick expression (milliseconds, no lock needed); nothing else run.

## Verdict: nothing blocks; one wording note

- **Old saves load the same:** checked, by the diff.
  - The stored value stays `"music"`, and `app/settings.js`, `app/lib/theme.js` and the head script (`index.html:7-19`) are not in the diff.
  - So a saved `music`, a fixed theme, `sigil`, nothing saved, or unreadable text reach the same head-script branch and the same `settings.on` behaviour as at c2d7cb5.
  - The only `index.html` change is inside the `settings.on('theme', …)` handler, which runs only on a change made in the menu.
- **The live pick can't land on the current look:** checked.
  - `index.html:538` draws from `THEMES.filter((t) => t !== data-theme)`, and `THEMES` is the four melody looks (`theme.js:12`, no `sigil`). So the pick always has a melody for `setMelody`.
  - The expression, run 30,000 times from each current look: **0 picks equal to the current look**, from Aqua, Skyline, Glass and Aurora; the other three each about 1 in 3.
  - From SIGIL (`data-theme` absent, `null`): all four reachable, about 1 in 4 each.
  - So two Random choices in a row (with a fixed theme or SIGIL between them) never land on the look you're on. Whether the next start's head-script pick can repeat the last session's look is outside this change: that pick is untouched, and it can.
- **The skin and the melody agree:**
  - `skinFor('music', pick)` returns `pick` (`theme.js:23-26`), and `setMelody(pick)` follows when the sound is on, through the same path as a fixed theme.
  - With no sound, the look still changes. C names that case as inferred and untested; it is the `pick || …` on line 540, which by reading holds.
- **The wording note.** Random's tooltip says "picked again when you choose this". But `settings.set` fires the listeners only on a change (`app/settings.js`, `if (before !== value)`).
  - So clicking Random while Random is already ticked does nothing: no re-pick.
  - A re-roll needs another theme chosen first, then Random again, which is what row 18 does (Glass, then Random).
  - Either the tooltip says "…when you switch to this", or Random re-picks on every click. Small; the keeper's or C's call. It doesn't block 0.4.8.
- **C's other two named items** (the stale example in `sound-samples.test.js:334`, and no test of the no-sound path) stand as C wrote them; I saw no reason to differ.

NEXT: librarian, D401 (d582c9e) is clear on my side for 0.4.8, with the tooltip note for C or the keeper, when this pointer arrives.
