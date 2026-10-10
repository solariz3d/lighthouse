# A pleasant chime when a final product ships. Librarian, on D, 2026-10-09 19:1x. Lap D281.

The keeper, 19:11: "you ding when the laps are complete, not like one if a new one opens, but when the final product is pushed, you ding through desktop
audio even if minimized something pleasant".

## The lap (A, free; small, FEEL tier)
- **A hook, `release-chime.js`** (PostToolUse on Bash|PowerShell), that plays a pleasant built-in Windows sound through the default output device,
  audible even when every window is minimized (e.g. `C:\Windows\Media\` "Windows Notify System Generic" or similar: A picks, the keeper can change it).
- **It fires ONLY when a final product ships:** a SUCCESSFUL (exit 0) `gh release create`, or a successful `git push` whose target is `main` on a repo
  (t180, consonance, lighthouse). Not on lap opens, dispatches, rings, commits, test runs, or failed pushes.
- **Debounce:** one chime per 2 minutes, so a release (push + release) chimes once.
- **Off switch:** `"chime": false` in `~/.consonance.json` silences it (absent means on). The sound file is configurable (`"chime_sound"`).
- It must never block or slow the tool call (fire and forget) and never fail the call if audio is unavailable.
- Rows: a release command → one chime; a push to a non-main ref or a failed push → none; two shipping calls within 2 min → one; `"chime": false` →
  none. Audio is stubbed in tests. Install with `install.ps1 -Only release-chime.js` (registration added).
- It lands independently of D277 (it touches no gate and no rule text).

NEXT: chair dispatch D281 to A when this plan is read
