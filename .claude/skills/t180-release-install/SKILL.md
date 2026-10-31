---
name: t180-release-install
description: Load before building a track builder installer, installing a build on this machine, or checking which build is installed. Points at the release script and the install script (the wait for the builder to close, the install lock, the .before-<tag> backup, the stamped sha256 compare); it holds none of their rules.
---

# The track builder: release build and local install

## Build the installer

**Master:** the header of `src-tauri/release.cjs` in the track builder repo.

```
node src-tauri/release.cjs
```

- It writes `src-tauri/target/release/bundle/nsis/T-180 Track Builder_<version>_x64-setup.exe`.
- It builds with the machine's paths remapped out of the binary, then scans the exe and the installer for the user's name and home folder. Exit 2 means a leak; nothing ships.
- A fresh clone has no `src-tauri/dist`, so run a `cargo check` (or `cargo tauri dev` once) first; see `exo_memory/handback/p-d505-landing-O_2026-10-28.md`.

## Install it

**Master:** the header of `scripts/install-local.ps1`: usage, the lock and the exit codes.

```
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/install-local.ps1 -Tag <name>
```

- **It never closes the builder.** While one is open it waits (`-WaitSec`, default 3600). Exit 3 means the builder stayed open; ask, never kill it.
- **It backs up first.** The installed exe goes to `.before-<Tag>`, refusing if that backup exists (exit 5).
- **It checks the result.** After installing, it confirms the installed exe is the built exe plus only the installer's bundle-type stamp (exit 7 if not), and prints the installed exe's sha256.
- **Merge, build and install in one sequence:** `-Take` takes the install lock and prints a token, then `-Token <t>` installs under it, then `-Release -Token <t>`.
**Who installs:** the landing pane, after the full suite. That is in the same BUILDING.md bullet.
