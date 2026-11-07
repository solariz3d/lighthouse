# T-180 Rebuilder

The launcher his desktop shortcut runs instead of the track builder itself. On each click it:
1. pulls `t180-track-builder` (`git pull --ff-only`);
2. rebuilds and reinstalls it when main has moved past `built-head.txt`;
3. opens it.

This folder is a copy kept in the repo so every machine gets the same fix. The rebuilder itself runs from outside any repository.

## Where it installs (on each machine)
- `%LOCALAPPDATA%\T-180 Rebuilder\Rebuilder.cs`, the source.
- `%LOCALAPPDATA%\T-180 Rebuilder\T-180 Rebuilder.exe`, the compiled launcher.
- `%LOCALAPPDATA%\T-180 Rebuilder\built-head.txt`, the commit last built and installed (40 hex characters, no newline).
- The desktop shortcut `T-180 Track Builder.lnk`:
  - target `T-180 Rebuilder.exe`;
  - working folder the rebuilder's own;
  - icon the app's, `…\T-180 Track Builder\t180-track-builder.exe,0`.

`Rebuilder.cs` names the repository checkout at its top (`Repo`). Change that line on a machine whose checkout is elsewhere.

## How to compile it
With the .NET Framework's own compiler, which ships with Windows (no SDK needed). From this folder:

```
C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe -nologo -win32icon:rebuilder.ico -out:"T-180 Rebuilder.exe" Rebuilder.cs
```

Then copy `Rebuilder.cs` and `T-180 Rebuilder.exe` into `%LOCALAPPDATA%\T-180 Rebuilder\`, with the old ones backed up first.

- **`rebuilder.ico`** is the icon the first build carried, taken back out of that exe (4 images).
- **Same command as the first build:** compiling the first `Rebuilder.cs` this way gives the same size (12,800 bytes), the same sections and the same resources as the exe built on 2026-09-29.

## What changed on 2026-11-07 (L147)
- **The bug:** the track builder's installer (NSIS, run with `/S`) points the desktop shortcut at the app exe every time it installs. So after the rebuilder installed a build itself, the next click opened the app directly, and later pushes to main were never built on that machine. Nothing said so.
- **The fix:**
  - Before installing, it reads the shortcut's working folder and icon.
  - After a successful install, it points the shortcut back at itself with those.
  - If the shortcut is missing, or cannot be written, it says so in plain words and carries on; it does not fail the run.
- **A check-only switch** runs that routine on any shortcut and prints what it reads back. It installs and launches nothing:

  ```
  "T-180 Rebuilder.exe" --restore-shortcut <shortcut to read the look from> <shortcut to point at the rebuilder>
  ```

The hand-back with the proving check is `exo_memory/handback/p-l147-C_2026-11-07.md`.
