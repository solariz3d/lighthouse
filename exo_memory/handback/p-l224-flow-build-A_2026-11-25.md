# p-l224-flow-build-A: T-180 p-flow-ai 27e2084 is built as an internal build on L and installed; backup named

Pane A, machine L, 2026-11-25 ~00:45 local, packet `loop/packet_l224_flow_build_A_2026-11-25.md`. No code changed, no release, no version change (the exe still says 0.4.40). Marked checked (a command printed it) or inferred.

## Steps
1. **Worktree (checked):** `git worktree add --detach C:\Consonance\t180-wt-flow 27e2084` from the builder repo; `git rev-parse HEAD` = 27e2084; `origin/p-flow-ai` read 27e2084 after a fetch. Builder main (3b33b38) untouched; the worktree is clean (nothing but the empty `src-tauri/dist` the build fills, gitignored).
2. **Build (checked):** `heavy-run.js --status` (no hold, both slots free) and the build in one call, BelowNormal; `node src-tauri\release.cjs` rc 0, "no private paths" on both files. Built exe `C:\build\lighthouse-target\release\t180-track-builder.exe`, 15,788,544 B, sha256 `5E670823…090A`; installer `...\bundle\nsis\T-180 Track Builder_0.4.40_x64-setup.exe`, 8,190,211 B. (The target folder is the machine's shared `C:\build\lighthouse-target`, not the worktree, so `install-local.ps1` got `-Installer` and `-Built` by path.) **Correction to myself:** my first launch (a detached `Start-Process`) wrote no log and did not build; I discarded it and ran the build once, in the background, in one call with the check.
3. **Before installing (checked):** `Get-Process t180-track-builder` empty, "builder processes before: 0"; the T-180 app was NOT running on L. Installed exe before: sha256 `1FF11C2D…5E17`.
4. **Fast suite on this tip (checked: `node scripts/test-fast.cjs` rc 0, 1,114 s):** **tests 3,632, pass 3,606, fail 0, cancelled 0, skipped 23, todo 3.** The 3 todo are the known ⚠ rows (the preview's paint list; the D642 drag-cost p95 timing row; "built 1, straight road: bank on the run-in within 0.1°", 3.82° and 9.58° by the adapter's re-round). Full output: scratchpad `l224_suite_plain.txt` (not committed).
5. **Install (checked: `scripts/install-local.ps1 -Tag l224-flow-27e2084`, rc 0):**
   - **Backup:** `C:\Users\zackn\AppData\Local\T-180 Track Builder\t180-track-builder.exe.before-l224-flow-27e2084`, sha256 `1FF11C2D08A47EFBB0692800FA66AB07682C3C337E0B5B05F8304A4F22065E17` (the exe that was installed).
   - **Installed exe:** `...\T-180 Track Builder\t180-track-builder.exe`, sha256 `DCF929DA1428AF84EE78C396B95D5C3D9F364D6DEC271D45D2445FC42457D304`, ProductVersion 0.4.40, 15,788,544 B.
   - Stamped compare: equal (the built exe with the bundle stamp UNK to NSS at byte 13,375,146 is the installed exe).

## Registered fail conditions
Neither fired: the installed exe was replaced with its backup named (above), and the build started in the same call as the heavy-run check.

## Left as found
No process left running (builder processes after: 0). Nothing of his removed. Left on disk: the worktree `C:\Consonance\t180-wt-flow` (detached at 27e2084; remove with `git worktree remove` when the lap is done) and the built files in `C:\build\lighthouse-target`.

## Not done (not in this lap)
No code change, the bar, the roll-rate cap. Not opened: the installed app (no window opened by me), so "flow" in the panel and the banked-S route are NOT checked in the app.

NEXT: librarian tell him p-flow-ai 27e2084 is installed on L (his to open and try the flow box), when you collate
BASE: C:\Users\zackn\Downloads\t180-track-builder 27e2084
SOURCES: git rev-parse in C:\Consonance\t180-wt-flow; heavy-run.js --status; node src-tauri\release.cjs; node scripts\test-fast.cjs; scripts\install-local.ps1; Get-FileHash on the three exes
