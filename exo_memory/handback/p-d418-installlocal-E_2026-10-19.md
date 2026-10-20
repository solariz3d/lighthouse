# Hand-back, pane E (machine D): D418 part 4, scripts/install-local.ps1

Packet: the chair's D418 part 4 (sent 2026-10-19T23:29:47Z), tier "check it"; the plan is `exo_memory/loop/plan_d418_fast_lane_2026-10-19.md:64-71`.

## 0. The answer

- **t180 `83dce86` on local-0.4.9** (on 97555f5, merge 5): `scripts/install-local.ps1`, `test/install_local.test.js`, and one CHANGELOG Added line. 3 files, +236. Worktree `C:\Users\nname\Downloads\t180-wt-e25`, clean. Not pushed.
- **One real install through it**, exit 0, at 23:4xZ (`C:\Users\nname\Downloads\t180-d414-e\install-script-1.log`):
  - The builder was closed: 0 processes before and after.
  - The backup is `.before-local-0.4.9-m4-script`, sha256 `7C70D946…BB55`.
  - **The installed exe is sha256 `7C70D946036DE2102A4C8B8A3785115DBE8FB54CE36A961F3559CE41A402BB55`**, 0.4.9-dev.
  - Stamped compare: equal, with the stamp at byte 12,494,184 (0-based; `cmp -l` counted it as 12,494,185).
  - The install lock was released afterwards. checked: `Test-Path %LOCALAPPDATA%\t180-install.lock` → False.
- **What it installed, and why:** local-0.4.9's head (97555f5, then 83dce86) isn't built yet. Merge 5's four sky files wait on the lock behind A's D407b timing session. The build on disk is still merge 4's (b8ee2b4; built exe sha256 `4e85904c…991a`).
  - So the real install put install 4 back, the same bytes. The script ran every step for real, and the keeper's exe didn't change.
  - Merge 5 will be the first new build it installs.

## 1. What the script does

- **`-Tag <name>` (required).**
  - It waits while a `t180-track-builder` process is open, polling every 5 s for up to `-WaitSec`, 3600 by default. It never closes the builder. If the builder stays open, it exits 3 with nothing changed.
  - It backs the installed exe up as `.before-<Tag>`. An existing backup of that name is refused (exit 5).
  - It runs the newest `*_x64-setup.exe` (or `-Installer`) with `/S` and a hidden window. A non-zero installer exit gives exit 6.
- **The stamped compare.** Before anything changes, it finds `__TAURI_BUNDLE_TYPE_VAR_UNK` exactly once in the built exe, sets those 3 bytes to `NSS`, and hashes the result. After the install, the installed exe must have that sha256; otherwise it exits 7, saying so, with the backup's path. It prints the installed sha256 either way.
- **The install lock**, `%LOCALAPPDATA%\t180-install.lock` (or `$env:T180_INSTALL_LOCK`). It is not the heavy-run lock.
  - It is created atomically (`CreateNew`) and holds the holder's pid, the pid's start time, a token and the tag.
  - A lock whose holder is gone (no process, or a different start time) is stale and is taken over.
  - While another seat holds the lock, the script waits up to `-WaitSec`, then exits 4.
- **Merges serialise on the same lock:** `-Take -Tag <name>` takes it for the calling shell (the parent process) and prints a token. Then `-Token <t>` installs under it, and `-Release -Token <t>` frees it. A wrong token gets exit 8.
  - So a merge runs: take, merge, build, install with the token, release.
- **No machine paths:** the defaults are `%LOCALAPPDATA%` and the repo's own `src-tauri/target`, because the repo is public. checked: `git show HEAD | grep -ci 'nname'` → 0.

## 2. The check ("check it": the new file's own test; 1 file, so no heavy lock)

`node --test test/install_local.test.js` runs the script for real against a temp install folder. The "installer" is a `.cmd` copying a prepared exe, and the "built exe" is a small file holding the marker. Windows only.

| row | what it holds |
|---|---|
| 1 | an install backs up, installs, the compare is equal, and the lock is released |
| 2 | an installed exe that isn't the built one stamped NSS exits 7, and the backup is kept |
| 3 | an open "builder" (a copy of node.exe under the name, running) is waited on, left running, and gives exit 3 with no backup and nothing installed |
| 4 | a lock held by a live process gives exit 4 with nothing installed; a stale lock is taken over, and released after |
| 5 | `-Take` holds the lock for the caller: an install without the token waits (exit 4), one with it installs and leaves the lock held, a wrong `-Release` gives exit 8, and the right one frees it |
| 6 | an existing backup name gives exit 5, leaving that backup untouched and nothing installed |

- **Result:** 6/6 (`C:\Users\nname\Downloads\t180-d414-e\t-installlocal-2.out`).
- **Red first, on a real bug:** the first draft's row 4 failed (`t-installlocal-1.out`), 5/6.
  - `Say` used Write-Output, so inside `Take-Lock` the "taking it over" message became part of the returned token. The `finally` then didn't recognise the token, and a taken-over lock would never have been released.
  - The messages now go to the host. Row 4 also asserts the lock is gone afterwards.
  - With the old `Say` put back, row 4 is red again; with the fix, it's green.

## 3. Merge 5 and the queue

- Merge 5 (D410, `97555f5`) is committed. Its four sky files (sky-prism-crisp, sky, sky-caustics-aurora, sky-dither) are queued under the lock behind A's D407b timing session (`merge5.log`), with the build after them. Four files is more than three, so it keeps the lock.
- When it's built, I'll install it with this script as `local-0.4.9-m5`.
- From merge 6 on, each merge will run take, merge, build, install, release on the install lock.

## 4. Corrections, mine

- The output-stream bug above (§2): found by my own row 4 before the commit.

NEXT: librarian, scripts/install-local.ps1 is on local-0.4.9 at 83dce86 and has done one real install when this pointer arrives; E installs merge 5 with it when merge 5's sky files and build finish.

## 5. A correction, after the acceptance (the chair, 23:37:21Z)

- **My test and install ran inside A's D407b timing session.** That was 23:3x–23:4xZ: install_local.test.js twice (12 powershell starts, plus a copied node.exe idling), the row-4 red check, a debug script, and the real install.
  - I read "a run of 3 test files or fewer takes no heavy-run lock" as making that safe. It wasn't: they were load on A's quiet windows.
  - The rule now (lighthouse 7a1cf49b): while any lock's cmd names a timing session, nothing runs, lock or not.
  - checked: merge 5's queued run is `gate.js`, which waits while a lock names a live timing session; it is waiting now.
