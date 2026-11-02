# p-d613 — TEST 10 as a 0.4.38 preview, installed beside his own (O), 2026-11-02

Packet: the chair's D613 (16:57Z). Export his TEST 10 headless from t180 d609-a `6f0969e` through the app's own export route, textured as the page exports, and record the export's refusals. Install it as a NEW folder `content\tracks\t180b_test_10_0438`, with ui_track.json's name "TEST 10 (0.4.38 preview)". Never launch AC. Tier: PROVE IT (an install). Seat: O.

## The folder
**`G:\SteamLibrary\steamapps\common\assettocorsa\content\tracks\t180b_test_10_0438`**: new, beside his `t180b_test_10`. In AC's track list it reads **"TEST 10 (0.4.38 preview)"**.

## The export
- **Tree:** t180 `6f0969e` (d609-a), checked out detached in `C:\Users\nname\Downloads\t180-wt-o613`; nothing committed there.
- **His track:** `%APPDATA%\com.solariz3d.t180-track-builder\tracks\eq-TEST 10.t180track`, sha256 `b6f62b8a8daaa61b2d57fa655a8cee56697bf6ad7280bd09c0e80beffe0d1a89`.
  - Read from a copy only (`S\d613\his\test10.t180track`, the same sha256). His file was never written: the same sha256 after the install.
- **The route:** `app/core/coreshell.js` `buildExport`, the call the page's Export and Install to AC both make, through `app/export/export.js` `makeExporter`, headless in node. checked: `S\d613\export613.js`.
- **The name.** The page exports under the name the track is saved as; his file's own name field is "untitled". It was exported under "TEST 10 0438", whose folder is exactly `t180b_test_10_0438` (`fromwords.js` folderName), so the exporter named the folder, the kn5 and models.ini alike (`FILE=t180b_test_10_0438.kn5`).
  - Then ui_track.json's `name` alone was set to "TEST 10 (0.4.38 preview)". Its other fields are his installed copy's: length 11484 m, width 25 m, 4 pit boxes, author t180-track-builder.
- **Textured as the page exports:** the asphalt surface, edge fit OFF.
  - The page keeps the edge fit off unless it was chosen, and that choice lives in the app's own storage. So I exported both ways and compared with his installed `t180b_test_10.kn5` (copied to `G:\Consonance-tools\scratch-O-d613\his\`).
  - Edge off gives his texture exactly (`t180b_made-993b5297d4ad20a5-1024.dds`); edge on gives `…c5e045c72db12fa3…`.
- **Refusals: 0** (both exports). Files: 10. checked: `S\d613\x613-0.out`, `G:\Consonance-tools\scratch-O-d613\stage0\export-t180b_test_10_0438-edge0.json`.

## The install
checked: `S\d613\install613.js` → `S\d613\install613.json`.
- **Before writing,** it checked that acs.exe was not running (0), that the folder is a t180b_ name, and that the target did not exist.
- **It copied** with errorOnExist and no overwrite, then re-hashed every installed file.
- **Folders:** added `t180b_test_10_0438`, removed none. His `t180b_test_10` still lists ai, data, extension, map.png, models.ini, t180b_test_10.kn5, ui.
- **Every file is the same after the copy as before it** (staged = installed):

| file | bytes | sha256 |
|---|---|---|
| .t180b-builder.json | 420 | 05cc62afb7bfa2e2207c0009be7afc20e4bde59b91b536a884a1b0c0e07c6a61 |
| ai/fast_lane.ai | 176204 | d6e6838bbd479931cc089cd4927112a0f064733c21a1d608df75dfaf4a302ac4 |
| data/map.ini | 114 | 9e5035b8713d3d9154d9194b2b5a217c77e013e87e574fb8d44ad5c84564da16 |
| data/surfaces.ini | 772 | 039e54dad3f8f1c0bc9990187cf70819f0841dae74350e5da928657427ff62fb |
| map.png | 7658193 | b3e2b5c7f5cf14de7959a1b304da6513b6b204161f5a7b21ffe128405987851c |
| models.ini | 68 | 3c9b5bf9b877f6c023bb985ed46bb88cb75f3bada942004de8fdf2762b7f0681 |
| t180b_test_10_0438.kn5 | 69380590 | 8ed8fd81d389bb8bb91944f40aebd96592513629e1cfff4bf13e0d2cd3cedee2 |
| ui/outline.png | 280600 | f1a499d465a34d10a003211bd3de58c7ea9fabffd78115d4504dac03979e3659 |
| ui/preview.png | 284288 | 808eb342146389bed7c713c0bbe62fe1f701fbe94653fbcdb907e1a79a513eb0 |
| ui/ui_track.json | 389 | 562dd652b7faa69f809b217aa35042da442ea2fcd5209b6ec1abec08789ca44d |

- **Not copied:** his own folder has an `extension` folder this export does not make. The preview has none.
- **AC was never launched.** Headless node only; every child process hidden (`S\winhide.js`).

## Corrections
- The first export landed in `t180b_untitled`, because his file's own name field is "untitled". A `folder` option does not reach the shell's export. It was redone under the name above, and nothing from the first run was installed.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

SOURCES: `S\d613\export613.js`, `S\d613\x613-0.out`, `S\d613\x613-1.out`, `S\d613\install613.js`, `S\d613\install613.json`, `ls` of content\tracks and of t180b_test_10, sha256 of his track file
NEXT: the librarian tells the keeper it's ready to drive when this ring is read
