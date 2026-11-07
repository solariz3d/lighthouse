# Stall trace: the T-180 installer turns the desktop shortcut away from the rebuilder. Librarian, on L, 2026-11-07 00:4x

**Seen:** every install of T-180 points `OneDrive\Desktop\T-180 Track Builder.lnk` back at `t180-track-builder.exe`:
- 11-05: the installer reset it (`briefs/t180_second_bank.md`, the 11-05 state, "point his desktop shortcut back at the rebuilder (the installer reset it to the exe)");
- 11-06: C reset it after the 0.4.39 install (`handback/p-l144-C_2026-11-06.md`, § the shortcut);
- 11-07: C reset it again after the fc3cc63 install (`handback/p-l146-C_2026-11-07.md` § 5; the .lnk mtime falls inside the /S install).

**Source, checked:** `C:\Users\zackn\AppData\Local\T-180 Rebuilder\Rebuilder.cs`. Main() runs the NSIS setup with `/S` (:67), writes built-head (:69) and launches. Nothing restores the .lnk afterwards (grep "lnk|shortcut" → none).

**Why it is a stall and not a nuisance:** when the rebuilder installs a new build itself, the shortcut then points at the app. His next click skips the rebuilder, so later pushes to main are never built on that machine, and nothing says so. Each seat install has hidden this, because the seat put the shortcut back by hand.

**Fix (L147, C):**
- After a successful install, Rebuilder.cs rewrites the desktop .lnk to target its own exe (WScript.Shell, the same path, its own icon kept).
- Recompile `T-180 Rebuilder.exe`.
- Keep a copy of the source in the lighthouse repo so the other machine gets the fix. `Rebuilder.cs` is in no repo today (`git status` there: not a repository).

**Proving check:**
- Point a COPY of the .lnk at the app exe, run the new restore routine against the copy, and read back the TargetPath = Rebuilder.exe.
- No real install and no launch.
- D's rebuilder is the same file: carry the fix in the handoff.
