# D250 item 1: find AC through Steam, no picking (pane B, build; EXPORT tier for the native part, TARGETED)

**Commit `8292269`** on branch `b-steamac`, worktree `C:\Users\nname\Desktop\worktrees\b-steamac-wt`, on t180 main `63dc19b`. 9 paths, named on the commit. Not pushed. No AC launch, and the real AC install was never read.

## What it does
**Native side (`src-tauri/src/ac.rs`, new section "found through Steam"):**
- `steam_path_from_reg_output(out)` reads `SteamPath` from `reg query` output. It handles `REG_SZ` and `REG_EXPAND_SZ`, and gives None for an error, another value, or an empty value.
- `library_paths_from_vdf(text)` reads every library: the `"path"` values of the current format, plus the old format's numbered values that look like paths. It skips app ids and sizes (`"244210" "38123"`) and undoes `\\` escapes.
- `find_ac_in_steam(steam)` searches Steam's own folder first, then each library, and returns the first `steamapps\common\assettocorsa` that holds `content\tracks` (the existing `tracks_of` check).
- `root_or_find(data, steam_path)`:
  - a remembered folder wins, and the registry isn't read;
  - otherwise AC is found through Steam and remembered via the existing `remember_ac_root`, the same as a picked folder;
  - otherwise None, and the app opens the picker as before.

  A remembered folder that has since gone is looked up again.
- `steam_path_from_registry()` runs Windows' own `reg.exe query HKCU\Software\Valve\Steam /v SteamPath` with no console window. **No new dependency:** there is no registry crate in Cargo.toml, and I didn't add one. It returns None if the query fails. **No test calls it.**

**`lib.rs`:** `get_ac_root` calls `root_or_find(…, &ac::steam_path_from_registry)`. `install_track` and `see_it_in_assetto` are unchanged; they read the folder `get_ac_root` has just remembered.

**JS (`app/install`):**
- The button is **"Export to Assetto Corsa"** (it was "Install to AC").
- The result line: `exported "Monza" into Assetto Corsa as t180b_monza in <AC>\content\tracks\t180b_monza; exporting this track again updates that folder (the builder names every track t180b_…, so it can never overwrite a track it did not make)`.
- With no AC found: `Assetto Corsa was not found through Steam: pick your Assetto Corsa folder (…); it is remembered`. The picker opens, as before.

**All guards are unchanged.** `install_to` / `write_export_to` still allow only `t180b_` folders, never write over a folder without the builder's marker, and never write outside `content\tracks`. The new Rust row checks that a found folder still refuses another author's folder name.

## Lines touched outside app/install and ac.rs (A is in panel.js and coreshell.js; I touched neither)
- `app/index.html:80-82`: the `#install` span moves from after the TEST export button to **directly after Export**, and its title follows the new name. One line moved, one title changed.
- `app/onboarding/guide.js:42`: the guide's Export step names "Export to Assetto Corsa", found through Steam.
- `app/README.md:87`: the install paragraph.
- `src-tauri/src/lib.rs`: the header comment line, and `get_ac_root`.
- `CHANGELOG.md`: Added.

## Tests: red first, then green (all under the heavy-run lock, own CARGO_TARGET_DIR)
**Red on `63dc19b`** (log `steamac/red.out` in my scratchpad):
- `share-install`: 11 pass, 3 fail. The failures are the button row (renamed) and the 2 new rows.
- `cargo test ac::`: **did not compile, 18 errors**, all "cannot find function" for the 4 new functions. A Rust red for new functions can only be a compile failure.

**The rows:**
- **Rust (5 new),** on a FAKE Steam tree (`<scratch>/steam` plus a second library `<scratch>/lib2` holding AC, linked by a real-format `libraryfolders.vdf`) and a FAKE registry (a closure):
  - reg output parsing;
  - vdf in both formats, with nothing else counted;
  - AC found in any library, and only where it has `content\tracks`, including no vdf at all;
  - no folder remembered: found and remembered. Registry None or Steam without AC: None, nothing written. A remembered folder wins without the registry being read. The install guards hold in the found folder;
  - a picked folder wins over Steam, and a gone one is looked up again.
- **JS (2 new),** plus the button row amended BY NAME with a comment (the keeper's rename):
  - with AC found, the button exports with **0 picker calls**, and the line names the full folder and says re-exporting updates it;
  - not found: `needsRoot`, with the "not found through Steam" words.

**Green on `8292269`** (logs `steamac/green.out`, `green2.out`):
- **cargo 30/30**, the whole lib (25 existing + 5 new);
- `share-install` **14/14**, `core-eqonly` **31/31**, `onboarding` **14/14**, `guides` **23/23**.

## Corrections (mine)
- My first green run had 2 JS failures, both my own:
  - my new row's expected path had lost a level of escaping when I generated it (single `\`, so `\t` became a TAB). Fixed in that row;
  - my new message put a colon right after the folder name, which broke the EXISTING row 4's `/as t180b_monza .*never overwrite/`. I changed the message ("as t180b_monza in <folder>") and left the test alone.
- My README edit dropped a backslash in `steamapps\libraryfolders.vdf`. Fixed before commit.
- This lap was interrupted by the priority jump-control look (`p-jumpui-B_2026-10-06.md`). The red run waited behind other seats' lock holds meanwhile.

## Not established
- **No real Steam or registry read:** the packet forbids reading the real AC install, and `steam_path_from_registry` is untested on purpose. Its parsing half is tested on real-format text; the `reg.exe` call itself is not.
- No real window or Tauri build. The button's position beside Export is a markup change only. Nothing ran in a window.
- No library on a network share (UNC paths are only matched by the `\\\\` prefix rule).
- The `appmanifest_244210.acf` check (AC's Steam app id) is not used. The folder test (`assettocorsa\content\tracks`) decides, as the packet named it.
