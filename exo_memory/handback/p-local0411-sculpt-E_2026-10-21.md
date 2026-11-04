# Hand-back, pane E (machine D): the Sculpt landing installed locally (local-0.4.11, 0.4.11-dev)

Packet: the chair's local install (sent 2026-10-21T01:45:29Z), on the librarian's ruling on `exo_memory/handback/p-d421-landing-O_2026-10-20.md`. Nothing public: no push, tag or release.

## 0. The answer

- **Installed on the keeper's machine:** `%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe`.
  - **sha256 `913888158AE832BF89E7AE41B4FAAC7EFE2F6F06C62A2889BCB22295D96ADEE7`**, ProductVersion **0.4.11-dev**, 14,916,608 B, at 01:47:58Z.
  - It went in through `scripts/install-local.ps1`. The builder was closed (0 processes before and after), and nothing was closed by me.
  - The stamped compare is equal: the built exe with UNK → NSS at byte 12,524,152 (0-based) is the installed exe. The install lock was released afterwards.
- **The backup:** `t180-track-builder.exe.before-local-0.4.11-sculpt`, sha256 `D597E34C…1EF4`. That's local-0.4.10's install 1. checked: the same sha256 is in `exo_memory/handback/p-local0410-m1-E_2026-10-20.md`.
- **What was built:** O's `local-0.4.11` at `57b41f8`, plus one commit of mine, `5168053` (version 0.4.11-dev in tauri.conf.json, Cargo.toml and Cargo.lock, by named paths).
  - That's branch `local-0.4.11-e` in my own worktree, `C:\Users\nname\Downloads\t180-wt-e29`, so O's `t180-wt-land411` is untouched.
  - 57b41f8 still carried 0.4.9, its ea54ac3 lineage's version. checked: `git show 57b41f8:src-tauri/tauri.conf.json`.

## 1. The build (`C:\Users\nname\Downloads\t180-d421-e\install411.sh` → `install411.log`, `build411.out`)

- release.cjs at 5168053 from the committed tree, exit 0, 01:47:55Z, under the lock (no timing session in any slot).
- **The installer:** `T-180 Track Builder_0.4.11-dev_x64-setup.exe`, 7,343,785 B, sha256 `18430255e49949253602d6d31cfb0a536f6673d167e34e8dd56e35e8121be1dc`.
- **The built exe:** 14,916,608 B, sha256 `d682aa0e0f694fd8fee52c0d704c55208881ea313e46e566cf38431f9f8afb63`.
- "no private paths" in both. Cargo.toml changed in line endings only, and was restored; the tree is clean.
- **The landing is in the build:**
  - dist's `trackmodel.js` has `function dragFrame` (1) and dist's `renderer.js` has `chunkModel` (4);
  - `diff -rq app src-tauri/dist/app` → only `app/test` differs, which dist leaves out;
  - the stamped hash ties that build to the installed exe.
- **No tests ran here.** O's landing ran the suite on 57b41f8 (O's hand-back), and the only change since is the version string.

NEXT: librarian, the Sculpt landing (local-0.4.11 + 0.4.11-dev, installed sha256 913888158AE8…ADEE7, backup .before-local-0.4.11-sculpt) is on the keeper's machine for him to try when this pointer arrives.
