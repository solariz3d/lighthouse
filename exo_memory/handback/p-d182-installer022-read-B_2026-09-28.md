GREEN. Worktree C:\Users\nname\AppData\Local\Temp\a-022-wt (detached at 484be9e = origin/main): SIX files, and the diff is only the 0.2.2 version bump plus a [0.2.2] CHANGELOG section.

# P-D182-INSTALLER022-READ · B's non-author read of A's 0.2.2 landing

**Pane B, 2026-09-28, 01:30–01:35 local.** Read-only. Nothing was committed, pushed, installed or launched.

## The landing list (`git -C <WT> status --short`)
`CHANGELOG.md`, `README.md`, `docs/RELEASE.md`, `src-tauri/Cargo.lock`, `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`: all ` M`,
with no untracked file. `git diff --stat` → **6 files, 17 insertions(+), 10 deletions(-)**. A's §1 says 16 and 9; a miscount,
immaterial.

## The checks

| check | command / evidence | result |
|---|---|---|
| **The version matches in all five places** | `tauri.conf.json:4` `"version": "0.2.2"`; `Cargo.toml:3` `version = "0.2.2"`; `Cargo.lock:3000-3001` `name = "t180-track-builder"` / `version = "0.2.2"`; `docs/RELEASE.md:1` (title) and `:15` (the installer's name); `README.md:20-21` (the release and the installer's name), `:28` (Status heading), `:38` (the release the table is judged against) | **PASS** |
| no `0.2.1` left behind | `git grep -n "0\.2\.1" -- . ':!CHANGELOG.md'` → only `Cargo.lock:3717/4076/4194`, which are other crates (`version-compare`, `windows-link`, `windows-threading`); the CHANGELOG's own 0.2.1 section stays, correctly | **PASS** |
| **the diff is only the version bump** | every changed line in the five files is the version string or the installer file name, plus README's release date (2026-09-27 → 2026-09-28) on the same judged-against line. The only added prose is the CHANGELOG section | **PASS** |
| **the CHANGELOG 0.2.2 section says only what is established** | it says: 0.2.2 is built from `main` at 484be9e and adds nothing; the 0.2.1 installer lacked the clean phrase order and the Export test seam; whether 0.2.1 had the plain-word reasons and the faster drags "is not established" | **PASS** |

**Evidence for the CHANGELOG section, independent of A:**
- I applied E's phrase-order diff and C's Export seam diff in the landing seat myself, AFTER the 23:06 snapshot
  (p-d181-final-read-B §0, W2).
- Neither was in the live tree before: E's hand-back says its order diff was not applied, and my snapshot's `src-tauri/src/lib.rs` had no
  `test_export_folder`.
- So A's 0.2.1 build (22:49) could not contain either. Established.
- Wording nit (no change needed): "built from the published source" means 484be9e **plus these six version files**.

**Also checked:**
- **No personal path.** The added lines hold no user path, scratch path or throwaway-install path
  (`git diff | grep "^+" | grep -ciE "C:\\\\Users|C:/Users|nname|AppData|scratchpad|throwaway|Desktop"` → 0). A's scratch install path is
  only in A's hand-back.
- **The README's "including the installed app" claim** is backed by A's §3: the 0.2.2 installer installed into a throwaway folder, with
  app data set aside. A's own §3 line 54 says the Export end to end in the installed app is still unverified (the track was red), and the
  README makes no claim about that.
- **The keeper's app data is back after A's §3 set it aside:** at 01:31:08 no `…aside…` folder remains. `%APPDATA%\com.solariz3d.t180-track-builder`
  holds 1 file (modified 23:35, the keeper's own session) and `%LOCALAPPDATA%\…` holds 283 files.

## Not checked
- The 0.2.2 installer binary itself (A's §2: `cba55908…`, 2,344,569 bytes); it is not in the landing, and nothing was installed by me.
- Whether that binary was built from exactly 484be9e + these six files. That is A's claim (§2), and not re-derived.
