# L239: push the room's main, and a release build on L (pane B, 2026-11-26, 06:3xZ)

## 1. Push (checked)

- Before: main b78dc852, 3 ahead of origin/main 71b1c7b3, 0 behind (`git rev-list --count`). The three are f0439227, 2926c028 (the merge) and b78dc852: exo_memory notes only.
- Credential scan (gatescan 71b1c7b3..b78dc852): allow, found []. The privacy grep over the added lines matched 0.
- `git push origin main`: 71b1c7b3..b78dc852, exit 0.
- Read back with `git ls-remote origin main`: **b78dc85250eef23fde963ef9d921519afc070038**.
- push-gate.jsonl row **2026-11-26T06:31:08.972Z, decision allow**.

## 2. Build (checked)

- `node consonance/tools/heavy-run.js --status` (no hold, both slots free), then `cargo build --release --manifest-path consonance\src-tauri\Cargo.toml`, the command at launch.ps1:807.
- It ran from HEAD b78dc852, at BelowNormal (`start "" /belownormal /wait /b`), in the background.
- **The build's exit code: 101.** Cargo compiled `consonance v0.2.0` and linked it, then:
  `error: failed to remove file C:\build\lighthouse-target\release\consonance.exe` / `Caused by: Access is denied. (os error 5)`.
  This is the same failure D had (p-d677-land-lh-P_2026-11-25.md:60-67). The running app holds the file.
- I did not stop the app, move its exe or copy over it.

## 3. Which exe holds what (checked: `ls -la --time-style=full-iso`, `sha256sum`)

| path | size | mtime (local) | sha256 | code |
|---|---|---|---|---|
| `C:\build\lighthouse-target\release\consonance.exe` | 16,340,992 B | 2026-11-26 00:17:37.93 | b538e7de4265d8bae91be16363435f28c26375bb242990195f45d52dab3ca671 | launch.ps1's build at his 00:17 launch, from f0439227; **the running app** (pid 23556, started 00:17:41 by Get-Process) |
| `C:\build\lighthouse-target\release\deps\consonance.exe` | 16,342,528 B | 2026-11-26 00:32:30.79 | **dd3f14b876fb91b08d7956a14c11ecac29f55b2b90569af0838aa7800d2186bb** | **the new code**: this build's link output, from b78dc852 |

What the new code adds over the running build (`git diff --stat f0439227 b78dc852 -- consonance/`):
- 859fa5a5, the ring's Enter waiting for its paste to be drawn: main.rs `deliver` and `submit_step`, plus tests.
- No string literal was added to that code, so I found no string that tells the two binaries apart. That deps\consonance.exe is b78dc852's code is **inferred**: it is this build's only link output (00:32:30), and the log names the compile.

## 4. Would ⟳ Restart start the new binary? **No** (read from the code, not run)

1. `restart_app` (main.rs:15511) takes `exe = std::env::current_exe()`, which is `release\consonance.exe` (Get-Process prints that path for pid 23556).
2. It refuses unless `newer_build(exe_mtime(&exe), process_start())`, which is the file's mtime later than the process start. That file is 00:17:37.93 and the app started 00:17:41, so it **refuses**: "no build newer than the running one is at …, so nothing was restarted".
3. `next_move_facts` reads the same fact (`newerBuild` false), so the button is not shown or lit.
4. Even past that check, relaunch.js opens the path it is given (`--exe`, main.rs:15539-15540; relaunch.js:34 and `defaultLaunch`). That path holds the OLD binary.

So the new code sits only in `release\deps\consonance.exe`, and nothing the app does will open it. Putting it at `release\consonance.exe` means moving the running exe aside and the new one into its place, which was done in past landings while the app ran. Not done here: the order says do not copy over the exe and do not improvise. His call or the librarian's.

## Left as found

- Nothing of his removed or moved.
- No cargo or rustc process left running (`Get-Process cargo,rustc`: 0).
- His Consonance (pid 23556) still runs.

NEXT: librarian rule whether the new exe is moved into release\consonance.exe (running one aside) before he presses ⟳ Restart, when this is read; as it stands Restart refuses and would open the old build
