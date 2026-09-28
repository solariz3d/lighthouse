# D181 A: the `\\?\` fix under cargo, the rebuilt installer, and the installed app re-checked

Repo `C:\Users\nname\Desktop\t180-track-builder`. Nothing is committed. **No AC launch; the see-it button stayed disabled**
(read back in the session). Label rule: **checked** means a command is given; **inferred** means reasoned, not measured.
The scripts are in `scratchpad/d181/` (my session scratchpad): `locked_d181.js` for the cargo test, mutants and build,
under ONE hold of the heavy-run lock, with a progress line per step in `progress.log`; `fresh_eyes5.js` for the session.

## 0. E's jump-default diff, applied before the rebuild (the chair's D181 addition)

**My error first:** in D180 I wrote the CHANGELOG line for this fix, taken from E's proposed entry, without checking that
E's diff was in the code. It was not; B found it. My D180 hand-back now carries a dated correction (§8).

- **The diff:** E's `scratchpad d179/a.diff`, sha256 `7431c4c83cd3ef2b` (checked equal to E's §2), applied **unchanged**
  with `git apply`. Nothing was adapted.
- **Its bases:** `src/doc/vocab.js` `240d3d70…`, `src/doc/resolve.js` `974c0ffc…` and `test/doc-jump.test.js`
  `6ce32484…` were byte-identical to E's stated bases. `app/shell.js` was not (`498ebdb3…` against E's `5daa1945…`),
  because my D180 edits came after it. `git apply --check` placed hunks 2 and 3 at an offset of 2 lines, with no
  fuzz.
- **E's test** `app/test/validate-ui-jumpdefault.test.js` (sha256 `399fa7f5…`) was copied unchanged. **Red first,** before
  the diff: `node --test --test-concurrency=4 app/test/validate-ui-jumpdefault.test.js` → 8 tests · 1 pass · 7 fail.
- **After:** `node --test --test-concurrency=4 app/test/validate-ui-jumpdefault.test.js test/doc-jump.test.js
  test/doc*.test.js app/test/shell*.test.js` → **205 tests · 205 pass · 0 fail**.
- **My own files that go through the shell:** `node --test --test-concurrency=4 app/test/share-install.test.js
  app/test/export.test.js app/test/palette-dom.test.js app/test/timers-regression.test.js test/export-textures.test.js
  app/test/onboarding.test.js` → **52/52**.
- My first locked run was waiting for the lock when this arrived. I stopped it before it held the lock (its progress
  log reads only "asking for the lock"), so no installer was built without this diff.

## 1. cargo test --lib, and the `\\?\` fix

`node scratchpad/d181/locked_d181.js`, the lock held 04:48:35Z. Raw outputs: `cargo-test-lib.txt`, `mutant-P1.txt`,
`mutant-P2.txt`, `progress.log`.

- **`cargo test --lib`: 15 passed · 0 failed · 0 ignored**, exit 0. It compiled `t180-track-builder v0.2.1`. The
  new test `ac::tests::the_remembered_ac_folder_is_the_path_a_user_would_type_with_no_verbatim_prefix` is among the 15.
- **No red run before the fix exists.** In D180 the fix was written before any cargo run could happen (the run was
  stopped for low memory). The mutants stand in for the red, run in place on `ac.rs` and restored in a `finally`
  (`ac.rs restored: sha256 equal (c1384a48)`):
  - **P1**, `plain_path` keeps the verbatim prefix (`let s = String::new();`): **caught**, 7 pass · 1 fail;
  - **P2**, `remember_ac_root` skips `plain_path`: **caught**, 6 pass · 2 fail;
  - **2 applied · 2 caught · 0 NOT APPLIED.**
- What the test pins: a remembered folder does not start with `\\?\`, is absolute, and still holds `content\tracks`;
  the file holds the same string; and `\\?\UNC\server\share\ac` becomes `\\server\share\ac`. `recall_ac_root` also
  cleans a folder remembered before the fix. **No test pins that recall.** It does not matter for the keeper: their app data
  holds no `ac_root.txt` (one file, the autosave; `before-roaming.txt`).

## 2. The rebuilt installer

**THE INSTALLER FOR THE KEEPER:**

    C:\Users\nname\Desktop\t180-track-builder\src-tauri\target\release\bundle\nsis\T-180 Track Builder_0.2.1_x64-setup.exe

**2,340,538 bytes · sha256 `0294af9a287d9668374037db4bc09456138871ca6985c6843f98303e45a007c2`.** It is the path
`docs/RELEASE.md` names, and it is **gitignored** (`src-tauri/.gitignore:1 /target/`; `git status` shows nothing), so no
installer binary can be committed from it. It was built in my own target folder and copied there, sha256 checked equal:
`scratchpad/d178/target/release/bundle/nsis/`.

- **Version 0.2.1** in `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json` and `src-tauri/Cargo.lock` (the chair's
  FINAL-LAP change), and in `docs/RELEASE.md` (the title and installer name). Cargo compiled `t180-track-builder v0.2.1`.
- **The build:** `node src-tauri/release.cjs` under the lock, `CARGO_TARGET_DIR` my own, 4 jobs. It exited 0 after
  45 s, an incremental build (`release.txt`).
- **The private-path scan** (`release.cjs`): `t180-track-builder.exe: 9839616 bytes, no private paths` and
  `T-180 Track Builder_0.2.1_x64-setup.exe: 2340538 bytes, no private paths`.
- **What is inside.** The exe stores its frontend compressed, so a raw grep of it finds nothing (all 0; I checked). So I
  checked the build's own frontend copy, `src-tauri/dist`, written at 22:49:03 during this build. Each of these appears
  there (`grep -c -F`, per file):
  - the timers fix `(f, ms) => setTimeout(f, ms)` 1;
  - `exportDoc()` 2;
  - `name the track first` 1;
  - E's `setDesignSpeed` 2 and `BAD_DESIGN_SPEED` 1;
  - `withTextureSet` 2;
  - `JUMP_PAST_VERTICAL` 3;
  - the tooltip's `content\tracks, always` 1.

  That this copy is the one embedded is **inferred** from the build order; §3 checks the behaviour in the installed app.
- **The working tree holds other seats' uncommitted work too**, and the build took all of it, as D178's did. The
  installer is this tree, not HEAD.

## 3. The installed app, re-checked, following the guide's own steps

`node scratchpad/d181/locked_session.js` runs `fresh_eyes5.js` under ONE hold of the heavy-run lock (04:54:19Z to
04:58:46Z), so no other seat's window could write the app data while the keeper's was set aside. The installer is the
final 0.2.1 one at the path in §2. The log is `fresh_eyes5.log`; the shots `41`–`46` are PrintWindow captures of the
app's own window (I looked at `46`: the app only).

The guide's own five steps, done the way it words them:

| step | what the guide says | what happened |
|---|---|---|
| start | "1 of 5, place a few pieces (try "sakura flow")" | the guide opened on a fresh start; 0 page errors |
| 1 | place "sakura flow" | **placed** (the timers fix, in the real window); **0 reds**; the guide moved itself to 2 of 5 |
| 2 | place a single word (e.g. "turn"), select it, drag a handle | "turn" placed and selected (`w2  turn`); its first slider `length` dragged with pointerdown / input / pointerup, 448.8 m → **30,314 m**; **0 reds**; the guide moved to 3 of 5 |
| 3 | Close the loop | "loop closed with 3 words (31934 m), worst load on the connector 1.2 g", shown as `role=status`, **not red**; 0 reds; lap proved |
| 4 | read the colours, Next | Next pressed; 5 of 5 |
| name | (not a guide step) | named "Guided First" + Save → status "Guided First · closed loop" |
| 5 | Export… | the dialog opened; C's `prove_render_dialog.ps1` again found **no Folder box** (`ok:false`), so nothing was typed and nothing exported. **EXPORT IS UNVERIFIED END TO END** in the installed app. C's seam is not in the page yet (`app/index.html:175` still calls `plugin:dialog\|open` directly) |
| Install to AC | (not a guide step) | `set_ac_root` returned the **plain path** `C:\Users\…\d181\fake-ac`, **no `\\?\`** (the fix, live). The install itself **FAILED: "not installed: Invalid string length"**; nothing reached the fake AC folder |
| tooltip | | "Install to AC writes into Assetto Corsa's content\tracks, always as a t180b_ folder" (the fix, live) |
| see-it | | disabled `true`; AC never launched |

**The new first-time trips, both routed (not fixed: the chair's final lap is "no new work"):**
- **The `length` slider runs from 0.001 m to 100,000 m.** A 30% move of it made a 30 km turn, and nothing warned. The
  slider is E's handles panel; the range comes from the word's handle info. Routed to E.
- **Install to AC fails on that 31.9 km track: "Invalid string length".** Measured headless
  (`node scratchpad/d181/bigtrack.js`, the same doc rebuilt): the loop closes the same way (31,934 m, 1.2 g, 190 s), and
  **the export succeeds in Node: 106.9 MB, of which the kn5 is 104.2 MB**, so about 143 M base64 characters. That is
  well under V8's string limit. My first guess (too big to base64) is **not confirmed, and the cause is not
  established.** Candidates, inferred and untested:
  - the app's in-window exporter (a different path from Node's);
  - WebView2's IPC payload limit;
  - the binary-string build in `app/index.html:94`.

  **What the keeper would see:** an ordinary-length track installs. D180's session installed a 765 m loop through this
  same path. A track tens of km long does not, and the message says why only in engine words. Routed to whoever takes
  the install path next.

## 4. Clean-up

From `session.progress`, inside the same lock hold:
- the keeper's app data, hashed and set aside: roaming 1 file, local 205 files;
- install: exit 0, the exe present, 1 uninstall entry (0 before);
- uninstall: exit 0, the exe gone, **0 uninstall entries**;
- **RESTORE roaming: before 1, now 1, missing 0, extra 0, changed 0 · RESTORE local: before 205, now 205, missing 0,
  extra 0, changed 0**;
- `throwaway/` and `fake-ac/` removed; no t180 process running afterwards.

## 5. What is NOT verified

- **Export in the installed app, end to end.** The dialog cannot be answered by automation yet (§3).
- **Install to AC for a long track fails**, cause not established (§3). A short loop installing through 0.2.1
  specifically was **not** run this lap. That it still works is **inferred**: D180's 0.2.0 run installed a 765 m loop,
  and since that build the install route changed by the saved name, the unnamed refusal and `plain_path`, while every
  export changed by E's ramp sizing.
- **The full suite was not run** this lap. What ran: E's test and the doc and shell tests (205/205), my shell-facing files
  (52/52) and `cargo test --lib` (15/15).
- **`recall_ac_root`'s cleaning of an old `\\?\` path has no test** (§1).
- **That the embedded frontend is the `src-tauri/dist` copy I checked** is inferred from the build order (§2).
- **Nothing is committed.** Changed this lap:
  - `src-tauri/Cargo.toml`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.lock` (0.2.1);
  - `docs/RELEASE.md`, `README.md`, `CHANGELOG.md` (the `[0.2.1]` section; `[0.2.0]` put back to HEAD's
    wording except for the room words, the phrasebook line and one sentence saying 0.2.0 cannot place a word);
  - E's diff: `src/doc/vocab.js`, `src/doc/resolve.js`, `app/shell.js`, `test/doc-jump.test.js`, and the new
    `app/test/validate-ui-jumpdefault.test.js`.
- **The installer binary is not in git:** `src-tauri/target/` is ignored.
