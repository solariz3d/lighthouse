# The builder batch installed on D: f3cd425, backed up first, re-hashed (pane P, 2026-11-27)

Seat: pane P (sibling-372c8abc). This answers the chair's INSTALL of 2026-11-27T05:00:50Z (ledger D677). Tier: PROVE IT, because an install overwrites.
Scratch (S): this seat's session scratchpad, folder `d681`.

## 0. The answer first

- **His word:** `exo_memory/briefs/t180_unmakeable_shapes.md:45-52`, "His answers to the morning page (2026-11-26 23:00, on D, verbatim)": "1. yes.",
  read there as "1: install landing-1126-batch f3cd425."
- **Old installed exe:** sha256 **3d6b3faafb7e921033057058289bf1e39a0208c67591d82f1cea33558bde0dbd**, 16,174,080 B. That is the 62f5b95 build, as the chair said.
- **New installed exe:** sha256 **1e110cef0febe1d3e4d441a4e152fc7d6055638db9f103854f77985e08f823e4**, 16,178,176 B, ProductVersion 0.4.40. It is the batch's built exe
  (d63134c6…) with the installer's bundle stamp changed and nothing else; the stamped compare was equal.
- **Backup:** `%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe.before-d681-62f5b95`, made and byte-checked BEFORE the install. The script also made
  its own, `.before-d681i-f3cd425`. Both are 3d6b3faa…, and they are identical (`cmp`).
- Nothing was launched. The builder and the game were not running before, during or after. No merge to the builder's main, and no release.

## 1. Before

- checked: `tasklist /FI "IMAGENAME eq t180-track-builder.exe"` → no tasks. `heavy-run.js` `gamesIn(readProcesses())` → `[]`. I ran both twice: when the
  packet arrived, and again just before the install.
- checked: sha256 of the installer `…\bundle\nsis\T-180 Track Builder_0.4.40_x64-setup.batch-f3cd425.exe` → 8358a623…2159, the batch hand-back's
  figure. sha256 of the built exe `…\nsis\t180-track-builder.batch-f3cd425.exe` → d63134c6…159c, also the batch hand-back's. I used the copies
  named for the batch, not the default names, which the next build will overwrite.
- checked: the installed exe → 3d6b3faa…0dbd, 16,174,080 B, written 2026-11-26 16:14: the 62f5b95 install.

## 2. The backup, first

- `cp` the installed exe to `t180-track-builder.exe.before-d681-62f5b95`; checked: `cmp` → identical; sha256 3d6b3faa…0dbd; 16,174,080 B. The name was
  free before the copy.

## 3. The install

`scripts/install-local.ps1 -Tag d681i-f3cd425 -Installer <the batch setup.exe> -Built <the batch exe> -WaitSec 5`, run from `Downloads\t180-fresh`
(S/install-f3cd425.txt, exit 0):
- builder processes before 0 and after 0;
- its own backup is `.before-d681i-f3cd425`, sha256 3D6B3FAA…0DBD;
- the installer ran silently with a hidden window;
- installed sha256 1E110CEF…23E4, ProductVersion 0.4.40, 16,178,176 B;
- **stamped compare: equal** ("the built exe with UNK -> NSS at byte 13677224 is the installed exe").

**Re-hashed after,** by my own call, not the script's: `sha256sum` of the installed exe → 1e110cef…23e4; both backups → 3d6b3faa…0dbd; `cmp` of the two
backups → identical. checked: `tasklist` → no builder running.

## 4. How to undo

With the builder closed, copy the backup back over the installed exe:

    copy /Y "%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe.before-d681-62f5b95" "%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe"

Then check its sha256 is 3d6b3faa…0dbd. The 62f5b95 installer itself was overwritten in the build folder by the batch build (batch hand-back §4), so the backup
is the way back. It is kept twice (`.before-d681-62f5b95` and `.before-d681i-f3cd425`). The earlier rollbacks are as they were: `.before-d681-cfa7ad9` and
`.before-d681i-62f5b95`, the build before 62f5b95.

BASE: Downloads\t180-fresh f3cd425
SOURCES: exo_memory/briefs/t180_unmakeable_shapes.md:45-52; tasklist ×4; heavy-run.js gamesIn ×2; sha256sum of the two batch build files, the installed exe and both backups; cmp ×2; S/install-f3cd425.txt
NEXT: librarian tells the chair the batch is installed, with the new sha256, when it has read this; the keeper opens the builder when he chooses.
