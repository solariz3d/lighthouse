# p-usbmode-E · D273: the USB mode as an opt-in setting · pane E, on D, 2026-10-08 · DONE

**Commit `81310efc`** on lighthouse main `c6d46629`, branch `d273-usbmode`, my own worktree `C:/Users/nname/Desktop/worktrees/e-usb-wt`.
- 4 files, +164/−1. Not landed. **The live `~/.consonance.json` was NOT edited.**
- B's `gen-consumer.js` and C's identity diff are not touched.

## FOR THE CHAIR, AT LANDING (read first)
- **The key and value:** `"usb_mode": true`, at the top level of `~/.consonance.json`.
- **A config WITHOUT the key means OFF**, as for a stranger (your lean, and the code's). Only a JSON `true` turns it on. Anything else (`"true"`, `1`, `[true]`) reads OFF and is named in `~/.consonance.log` ("CONFIG PROBLEM … usb_mode").
- **So OUR key must be written BEFORE the first launch of a build with this code.** Otherwise that launch skips the launch sync and the close skips the stick: the silent stop you named.
- **The order, and why it matters:** today's `save_config` writes the whole `Config` struct, so the RUNNING (old) app drops any key its struct lacks the moment Settings is saved. `usb_mode` is one such key for the old build. So:
  1. build the new exe and close the running app;
  2. add `"usb_mode": true`;
  3. launch the new build.
  - After that the new struct carries the field, and a Settings save keeps it (row 2).
- **Pre-existing, flagged, not fixed:** the same whole-struct save already drops this machine's other unknown keys (`machine_tag`, `state_dir`, `base`, `flags`, `instances`, `dream_model`, `dream_times`) whenever Settings is saved. Read only: those keys are in the live file and not in `Config`. Whether anything reads them is outside this lap.

## What it does
- **The setting:** Settings → a checkbox, "Move seats between computers with a USB drive", OFF unless turned on. The one-line note says what it does and what a drive needs, which is exactly what `find_stick` checks: a `consonance-transfer` folder with its `MANIFEST.json`, at the drive's top level or one folder down. The setting takes effect at the next launch.
- **OFF runs none of the four paths** (`main.rs`; every gate line is tagged `// D273 usb`):
  - **launch sync:** `sync_at_launch` returns `Verdict::Standalone` (documented as "the only verdict that changes nothing") before any pull, so no `STICK_ARRIVAL` is recorded;
  - **stick waiter:** `start_exit_waiter` logs "STICK WAITER not started — the USB mode is off (Settings: …)" and returns. Its CALL at setup stays unconditional (L059 §3, an existing guard);
  - **stick at close:** `leave_run` gets `StickFind::None` instead of scanning the volumes, so `run_leave` exits as a no-stick close does today: no Leave screen and no "Saving to the stick" phase. `ui/leave.js` is untouched, since it only shows what this path emits;
  - **stick_state:** returns the window's keys empty (`held: false`, `stick: "none"`, `handshake: absent`, `result: null`, `applier_on_disk: false`, plus `usb_mode: false`), so no apply-result file is read. `ui/stick.js` opens only when `held`.
- **ON is today, exactly.**

## THE ON-EQUALS-TODAY PROOF
- **Method:** scratch `usb/on_proof.js`, output `on_proof.txt`, sha256 `2ee96a4f…`. Each of the four bodies has its `D273 usb` lines taken out, with `leave_run`'s one `if` read as its ON arm, and is compared with `c6d46629`'s body. Every `plog` line is listed.
- **Why not the real app:** running the real app with a temp config would open a window while the keeper may be at the PC, so this proof reads the code that runs when ON.
```
fn sync_at_launch() ->       ON-arm vs c6d46629: SAME BYTES (4615 chars) · tagged lines 3 · plog lines base 3, ON 3, same true
fn start_exit_waiter() {     ON-arm vs c6d46629: SAME BYTES (835 chars) · tagged lines 4 · plog lines base 2, ON 2, same true
fn leave_run(                ON-arm vs c6d46629: SAME BYTES (6043 chars) · tagged lines 1 · plog lines base 9, ON 9, same true
fn stick_state() ->          ON-arm vs c6d46629: SAME BYTES (1696 chars) · tagged lines 4 · plog lines base 0, ON 0, same true
launch call site (200 chars from the sync call): SAME BYTES
```
- **Same code, same log lines:** with the setting ON, every line that runs, and every `plog` line on the launch and close paths, is today's.
- **The tag discipline is a test:** `usb_mode_tests::every_mode_line_is_tagged_so_on_is_todays_code`, so stripping the tag cannot leave a mode line behind.

## Tests (all under the lock)
- **`main.rs` `usb_mode_tests`, 4 rows:**
  1. fresh, absent and wrong-typed are OFF (the wrong-typed one named), and only `true` is ON;
  2. it persists through `save_config`'s serialisation and reads back;
  3. OFF runs none of the four paths;
  4. every mode line is tagged.
- **Red first on `c6d46629`:** the base with this module appended does not compile ("no field `usb_mode` on type `Config`", ×7). `usb/cargo-red.txt`.
- **`cargo test` (full, `--no-fail-fast`):**
  - branch: the main binary 992 passed, 0 failed, 4 ignored; base `c6d46629`: 988 passed, 0 failed, 4 ignored (the difference is my 4 rows);
  - every other target identical: 22, 77 (3 ignored), 22, 77, 0, 22, 0, 0, 0, 13, all passed.
  - `usb/cargo-branch.txt` sha256 1a04fa5b…, `cargo-base.txt` 33b8e913….
- **`ui/usb-mode-wiring.test.js`, 3 rows:**
  - the checkbox and note are in `index.html`;
  - `load()` ticks it only for `true`;
  - `persist()` writes it back as a boolean before `save_config` (run on a fake checkbox in a VM).
  - **Red on `c6d46629`** 0/3; branch 3/3.
- **The UI tests that read `index.html` / `app.js`, plus `leave` and `stick`:** usb-mode-wiring 3, scripts-load 4, about-readme 6, librarian-wiring 11, third-place-wiring 10, gate-card-routing 12, chain-indicator 93, leave 24, stick 19, pane-reopen 6, all passing.
- **My own fixes on the way:**
  - my runner first spawned `cargo` without its path (ENOENT, nothing ran);
  - two `"C:\\d"` strings lost a backslash in a heredoc and became `"C:\d"` (now raw strings);
  - my row 1's JSON `"C:\d"` was itself invalid JSON;
  - my row 3's literal `start_exit_waiter();` became a SECOND match for the existing guard that counts the call (that guard was right; my line is now split with `concat!`).
- **Not done:** a run of the real app (a window), and the generated consumer tree (B's).

## save_config merge (the chair's 17:3x packet, on lighthouse main 9b172cb5): BEFORE the install
**Commit `c6522f52`** on `9b172cb5`, branch `d273-cfgmerge`, my own worktree `C:/Users/nname/Desktop/worktrees/e-cfgmerge-wt`. 2 files, +180/−4. Not landed.
- **The live `~/.consonance.json` was never touched:** every row works on a temp file.

**The fix (`consonance/src-tauri/src/main.rs`):**
- **The merge:** `save_config` → `save_config_at(path, cfg)` reads the existing file (a leading BOM read past, as the hooks' readers do), sets ONLY the keys the Settings tab owns, and keeps every other key and its value.
  - The owned keys are `SETTINGS_KEYS`: room_path, instances_dir, data_dir, ambient_lat, ambient_lon, ambient_label, ambient_tz, usb_mode. A row holds them equal to `Config`'s fields, so a field added later is owned by construction.
- **The refusal:** a file that exists but is not a JSON object, or cannot be read, is REFUSED by name and left untouched. The message is "SETTINGS NOT SAVED to <path>: it is not valid JSON (…), so it was NOT overwritten. Fix the file by hand (or move it aside), then save again." It goes to stderr, to `~/.consonance.log`, and to the Settings tab: `save_config` now returns `Result<(), String>`, and the tab already shows "could not save settings: <why>".
- **A side effect:** serde_json here has no `preserve_order`, so a merged file's keys are written in sorted order. Every value is kept; only the order moves. I did not turn on a crate-wide serde feature for that; say if the order matters.

**Rows, `config_merge_tests` (6, temp files only):**
1. a save keeps D's seven keys (base, flags, instances, dream_model, dream_times, machine_tag, state_dir) plus an unknown nested one, each equal in value AND in JSON text, and the key count is unchanged;
2. an owned key changes as asked, and the untouched owned keys stay;
3. a corrupt file (not JSON, or a JSON array) is refused by name and left byte for byte as it was;
4. `usb_mode` survives two saves, and a fresh machine gets exactly the tab's keys;
5. a BOM file is merged, not refused;
6. the owned keys equal `Config`'s fields.

**Red first:** `9b172cb5` with the OLD save shimmed in as `save_config_at` (scratch only). Rows **1, 2, 3 and 5 FAIL** ("base changed or was dropped: left None"; "no entry found for key" for machine_tag; "a corrupt file was overwritten"). Rows 4 and 6 pass on both: the old struct already carried `usb_mode`. `cfgmerge/cargo-red.txt` sha256 `ed09504f…`.

**`cargo test` on the branch:** the main binary **998 passed, 0 failed, 4 ignored** (992 + my 6); every other target as before (22, 77 with 3 ignored, 22, 77, 0, 22, 0, 0, 0, 13). `cfgmerge/cargo-branch.txt` sha256 `d5c4affd…`.

**Also owed, done: `consonance/tools/install-only.test.js` was red because of MY lap 3.**
- I dropped jev-flags' file copy but left `consonance/hooks/jev-flags.js` on no list, so `-Check` named it UNDECLARED ("installable … nobody has ruled") and the test's POSITIVE CONTROL failed.
- `dev/shell/install.ps1` now declares it UNMANAGED with its reason ("RETIRED, not unruled: Jev is off since D164, and D273 ruling 5 …"). That is the list `-Check` reads for "deliberately not installed".
- **install-only: every row ok** (positive control included, 0 UNDECLARED), `cfgmerge/install-only2.txt` sha256 `465c3b60…`. install-fresh-home 3/3; usb-mode-wiring 3/3.

**For the install (the plan default):** build, close the app, write `"usb_mode": true`, launch the new build. With this fix, later Settings saves keep usb_mode AND machine_tag, state_dir and the rest. The usb_mode write itself must still follow the order above, because the RUNNING old app's save is the old one.
