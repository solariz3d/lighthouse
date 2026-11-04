# Hand-back, pane E (machine D): the D421c landing installed locally (local-0.4.12, 0.4.12-dev)

Packet: the chair's local install (sent 2026-10-21T11:16:21Z), tier "check it", on the librarian's acceptance of B's landing. Nothing public: no push, tag or release.

## 0. The answer

- **Installed on the keeper's machine:** `%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe`.
  - **sha256 `8FD1D056492B8FDA030223462BF7062BC025066EA42C1910E09C4A7CF8F46F43`**, ProductVersion **0.4.12-dev**, 14,921,728 B, at 11:19:23Z.
  - It went in through `scripts/install-local.ps1`. The builder was closed (0 processes before and after), and nothing was closed by me.
  - The stamped compare is equal: the built exe with UNK → NSS at byte 12,529,016 (0-based) is the installed exe. The install lock was released afterwards.
- **The backup:** `t180-track-builder.exe.before-local-0.4.12-sculptc`, sha256 `91388815…ADEE7`. That's the 0.4.11 Sculpt install. checked: the same sha256 is in `exo_memory/handback/p-local0411-sculpt-E_2026-10-21.md`.
- **What was built:** B's `local-0.4.12` at `a795359`, plus one commit of mine, `b6a616c` (version 0.4.12-dev in tauri.conf.json, Cargo.toml and Cargo.lock, by named paths).
  - That's branch `local-0.4.12-e` in my own worktree, `C:\Users\nname\Downloads\t180-wt-e31`, so B's tree is untouched.
  - a795359 still carried 0.4.9. checked: `git show a795359:src-tauri/tauri.conf.json`.

## 1. The build (`C:\Users\nname\Downloads\t180-d421-e\install412.sh` → `install412.log`, `build412.out`)

- release.cjs at b6a616c from the committed tree, exit 0, 11:19:21Z, under the lock (no timing session in any slot).
- **The installer:** `T-180 Track Builder_0.4.12-dev_x64-setup.exe`, 7,346,851 B, sha256 `9ca934e0c8e6ff2086fc838a5764bb37c9bd71b68d88732873c853ae0ec75222`.
- **The built exe:** 14,921,728 B, sha256 `d157d10e85cd6a87260c2101ff5d21e6add1339d39e6f9ed2c289f897910f15a`.
- "no private paths" in both. Cargo.toml changed in line endings only, and was restored; the tree is clean.
- **D421c is in the build:** dist's `src/geom/mesh.js` has `rampShape` and `reuseMeshSteps`, dist's `preview.js` has `startExact`, and dist's `trackmodel.js` has `updateSteps`. `diff -rq` of `app` and `src` against dist → only `app/test` differs. The stamped hash ties that build to the installed exe.
- **No tests ran here.** The landing ran its checks on a795359, and the only change since is the version string.

NEXT: librarian, the D421c landing (local-0.4.12 + 0.4.12-dev, installed sha256 8FD1D056…6F43, backup .before-local-0.4.12-sculptc) is on the keeper's machine for him to try when this pointer arrives.
