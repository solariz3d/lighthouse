# D176 A: shareable track codes, install to AC, and a launch path built but never run

Repo `C:\Users\nname\Desktop\t180-track-builder`. Nothing is committed. **No AC launch was made, by any test or by me.**
The launch path's only exercised spawner is a mock. Label rule: **checked** means a command is given; **inferred** means
reasoned, not measured.

## 1. Files

NEW
- `src/doc/code.js`: codes for a track, a piece or phrase, and a pack.
- `src/texture/deflate.js`: a raw DEFLATE encoder, see §2.
- `app/share/share.js` and `app/share/index.js`: Copy code / Paste code.
- `app/install/install.js` and `app/install/index.js`: Install to AC / See it in Assetto.
- `src-tauri/src/ac.rs`: remember the AC folder, install, and the launch plan with its backup and restore.
- Tests: `test/doc-code.test.js` (9) and `app/test/share-install.test.js` (6), plus 7 Rust tests in `ac.rs`.

CHANGED
- `src/texture/inflate.js`: an optional `maxOut` cap, so a small hostile code cannot demand a large buffer.
- `src-tauri/src/lib.rs`:
  - `mod ac;` and the header list;
  - six commands: `get_ac_root`, `set_ac_root`, `install_track`, `get_see_it_setting`, `set_see_it_setting`, and
    `see_it_in_assetto` (declared `async`, because it waits for the game);
  - registration in `generate_handler!`.
- `app/shell.js`: `importPieceText(text)` (a pasted piece joins the library and its file). `commitDoc` is from D175.
- `app/index.html`: an `#install` span in the toolbar, a `#share` section in the side panel, and the native bridge for
  the six commands; the exporter is now shared with the installer.
- `app/palette/panels.js`: titles for the two new panels.

## 2. Shareable codes (checked: `node --test --test-concurrency=4 test/doc-code.test.js` → 9/9)

The format is `t180<kind><version>.<payload>.<check>`:
- kind: `d` track, `p` piece or phrase, `k` pack;
- version: 1;
- payload: the canonical text, UTF-8, raw DEFLATE, in base64url (A–Z a–z 0–9 - _, no padding);
- check: CRC-32 of the canonical text, 8 hex digits.

**Where I differ from the packet, and why.** The packet says "deflate (node zlib)". The app's webview has no compressor:
its zlib shim writes STORED blocks only (`app/export/node-shim.js`). So a code made in the app would be several times
larger than one made in node, and one track would have two codes. `src/texture/deflate.js` is one small encoder (LZ77,
32 KiB window, fixed Huffman codes, deterministic), run by both. The price is size: on the rich test document, 496 bytes
against zlib -9's 431 (measured by a throwaway `node -e` during development, not preserved; a comparable figure can be
re-derived with `zlib.deflateRawSync(buf, { level: 9 })`). The test "the encoder is DEFLATE any inflate reads" checks
**node's own zlib** inflating my output for empty, 1 byte, 1,000 repeating, a real document, and 100 kB of mixed noise.

Tests:
- **Round-trip byte-exact:** a track (with a phrase, a jump, texture overrides, a pit lane and non-ASCII text), and the
  same track giving the same code; a piece and a phrase into another library; a pack (and through `importPack`).
- **The sample track: 647 characters of code for 2,230 of canonical text, against a bound stated before the first run
  of 1,200.** The test prints this as a diagnostic: `node --test --test-name-pattern=sample test/doc-code.test.js`.
  "The sample track" is `test/export_words.test.js`'s Sample Loop, closed by the connector; the app has no built-in
  sample (grep for sample in app/ and src/doc found none). That test takes ~38 s, for the `closeLoop`.
- **Refused whole, by name, with nothing imported:**
  - a flipped payload character, a cut payload, or a wrong check → CODE_CORRUPT;
  - a cut check, or not a code at all → CODE_MALFORMED;
  - after a corrupt piece code, the library's serialisation is unchanged.
- Pasted spaces and line breaks are ignored.
- A track code where a piece goes → CODE_KIND; format 2 → CODE_TOO_NEW; format 0 → CODE_VERSION; kind `x` → CODE_KIND.
- **Old schemas:** a code holding a schema-2 document migrates to schema 3 as `parse` does; schema 9 → SCHEMA_TOO_NEW.
- **The limit:** MAX_CODE = 262,144 characters, **inferred** (a copy-paste bound, not measured). Pack sizes (a throwaway
  `node -e` during development; the 398,316 refusal is also asserted in the test):
  - a pack with a 16² image: 2,103 characters;
  - with a 128² noise PNG (56,235 B): 99,900;
  - with a 256² noise PNG (224,494 B): refused, "this texture pack's code would be 398,316 characters, over the 262,144 a
    code may be; share the pack file instead".
- **A 16 MiB + 10 byte "bomb"** that fits in a legal code is refused as CODE_TOO_LARGE by the inflate cap, not buffered.

**Fixture bugs of mine, found and fixed** (the tests, not the code, were wrong):
- my "random" PNG generator used `x * 1103515245`, which loses precision in doubles and cycles; so its "noise"
  compressed about 70-fold and never reached the limit. It now uses `Math.imul`, and the sizes above are real noise;
- the 256² → 512² change came before that fix. With real noise, 256² already passes the limit.

**App:** "Copy code" and "Paste code" (`app/share`). Paste detects the kind:
- a track REPLACES the open one as ONE undo step (`shell.commitDoc`; Ctrl+Z brings the old one back);
- a piece joins the palette and the library file;
- a pack goes to the textures panel's `importPack`.

Checked (`node --test --test-concurrency=4 app/test/share-install.test.js` → 6/6): copy writes the clipboard; paste
into another session gives the same document text byte for byte, and undo restores the previous one; a corrupted code
leaves both the document and the history length unchanged; a piece code adds "hook" to the palette; a pack code
reaches `onPack`.

## 3. Install to AC

- **Native** (`src-tauri/src/ac.rs`, checked by `cargo test`, 7 new tests, on a temp fake AC tree built in the test:
  `ac/content/tracks/somebody_elses/keep.kn5` and `docs/cfg/race.ini`):
  - **the remembered path:** none at first; `remember_ac_root` then `recall_ac_root` gives it back; a folder without
    `content\tracks` is refused;
  - **the first install** writes the files; **a re-install over our own folder** (the marker is there) replaces them;
  - **a foreign folder** refused untouched: a `t180b_theirs` with no marker (still 1 file in it), and `somebody_elses`
    (its `keep.kn5` still `theirs`);
  - **outside content/tracks refused:** a root without it; a folder name with `/../`; a file path `../../escape.txt`
    (nothing written outside).
  - It reuses `write_export_to`, so the marker check and the path guards are the export's own, not a second copy.
- **The t180b_ prefix:** every folder is `t180b_<slug of the name>` (`fromwords.js folderName`), added automatically. The
  message says so: `installed "Monza" as t180b_monza in …\content\tracks (the builder names every track t180b_…, so it
  can never overwrite a track it did not make)`. That is checked in the app test, with the real exporter against a fake
  native side.

## 4. See it in Assetto: built, never run

- `launch_plan(root, docs, track, layout)` gives `acs.exe`, run in the AC folder with **no arguments**, after
  `docs/cfg/race.ini` is set. Only an installed `t180b_` track can be planned.
- `launch_with(plan, spawner, stamp)` does the following:
  1. copies race.ini to `race.ini.bak-t180b-<stamp>` (and refuses if that backup already exists);
  2. writes race.ini with ONLY `[RACE] TRACK` and `CONFIG_TRACK` changed, so the user's car and settings stay;
  3. calls the spawner with the 10-minute hard timeout;
  4. **in the finally**, restores race.ini byte-exact, or removes it if there was none.

  The backup is kept, as the run's record.
- **Tested headless with the spawn boundary mocked** (the `Spawner` trait; the mock records and reads race.ini WHILE
  "running"):
  - it WOULD run `<ac>\acs.exe` with args `[]`, cwd `<ac>`, timeout 600 s;
  - while running, race.ini says `TRACK=t180b_mine` and still `MODEL=my_car`, with CRLF kept;
  - afterwards it is byte-exact and the backup equals the original;
  - a mock that fails leaves race.ini restored;
  - no race.ini before means none after;
  - an existing backup of that stamp refuses before anything is written.
- **Gated:** the setting `see_it_in_assetto.enabled` is OFF unless its file says `yes` (tested off by default). The
  command refuses while it is off. The app's button is disabled, and the checkbox is labelled "See it in Assetto
  (launches the game)", unchecked by default; the app test asserts the native launch is never asked for while it is
  off. `RealSpawner` is compiled and reachable only from `see_it_in_assetto`. **No test, and no seat, turned it on or
  called it.**

## 5. Mutants

**JS:** `node scratchpad/d172/d176_mutants.js` (its list: `d176_list.js`), on copies of app/src/test/tools,
`--test-concurrency=4`.
- **First run: 20 listed · 20 applied · 18 caught · 2 survived · 0 NOT APPLIED · 0 NO RESULT · live files unchanged.**
- The survivors:
  - C8 (an impossible payload length accepted): still refused as CODE_CORRUPT through inflate or the CRC, but not for
    its named reason;
  - C9 (non-fatal UTF-8): invalid bytes with a MATCHING check were never tried.
- One test was added covering both. **My first version of it was wrong** (its "impossible length" slice was not 4k + 1),
  so it failed on the real code as well, and the two "caught" it produced meant nothing. It was fixed, passes on the real
  code, and then **C8 and C9: 2 applied · 2 caught.**
- **JS total: 20 applied · 20 caught.**

**Rust:** `node scratchpad/d172/d176_rust_mutants.js`. These run IN PLACE on `src-tauri/src/ac.rs`, because `build.rs`
copies `../app`, `../src` and `../tools` by relative path, so a copied crate would not build. Each mutant is restored in
a `finally`, and the sha256 is checked at the end: **"ac.rs restored byte-exact"** on both runs. `cargo test ac::`
under the lock, `-j 4`.
- **8 listed · 8 applied · 7 caught · 1 survived.** R6 (a foreign track name can be planned) survived because the
  "installed?" marker check also refuses such a name.
- The case the name check alone guards is a foreign folder that CARRIES a marker file (copied or planted). That
  assertion was added, and **R6: 1 applied · 1 caught.**
- **Rust total: 8 applied · 8 caught.**
- `cargo test` (all native tests): **14 passed · 0 failed**, twice, the second time with the R6 assertion.
- The comment in `ac.rs` line 12 was reworded afterwards ("no seat" → "no automated run"). That is a comment-only change
  after the last cargo run.

## 6. Full suite

**Checked, and RED: `node --test --test-concurrency=4 "test/*.test.js" "app/test/*.test.js"` under the heavy-run lock
(`scratchpad/d172/locked_suite.js`; it took over a stale lock E's pid 18672 had left, as `heavy-run.js` logged) → 996
tests · 965 pass · 22 FAIL · 9 todo, exit 1.** All 22 were traced, and **none is in a D176 or D175 file**:

- **21 are `app/test/mutation.test.js`** (the preview's mutation harness): its control, plus 20 mutants that fail because
  the control does.
  - Cause: the harness's temp copy (`mutation.test.js:118-120`: app/{camera, preview, testhook, texmaker}, src/, one
    script) has **no `tools/`**. The new `app/test/aclook.test.js` (untracked, in flight) loads `src/export/fromwords.js`,
    which has always required `../../tools/kn5.cjs` (it is in HEAD at `fromwords.js:70`).
  - Reproduced by hand: the copy fails with `Cannot find module '../../tools/kn5.cjs'`. In the live tree
    `aclook.test.js` passes (29 pass, 1 todo).
  - HEAD's `mutation.test.js` does not run `aclook` at all (`git show HEAD:app/test/mutation.test.js | grep -c aclook`
    → 0); the working copy's uncommitted edit adds it.
  - Both files are in-flight work that is not mine. My read is that they belong with D177's preview work; I did not
    touch them.
- **1 is `test/join.test.js`** "sculpt: an edited word restarts the path at its first segment, and path and mesh equal a
  full rebuild": the path differs by 5.4e-12 where it expects 0.
  - **Bisected on temp copies:** live tree 5 pass / 1 fail; the live tree with **HEAD's `src/geom`** 6/6 pass; the live
    tree with **HEAD's `src/doc`** (removing all my document changes) still 5/1.
  - The cause is the **uncommitted change to `src/geom/path.js`** (`git status` shows ` M src/geom/path.js`), not mine.

**My own files, green:** `test/doc-code.test.js` 10/10 (9 plus the C8/C9 test), `app/test/share-install.test.js` 6/6,
`node --test --test-concurrency=4 app/test/shell*.test.js app/test/palette*.test.js app/test/share-install.test.js` →
79/79, and `cargo test` → 14/14.

**This lap should NOT land on this suite as it stands.** The two in-flight causes above need their owners first. My
files are separable (the list in §1).

## 7. What is NOT verified

- **Nothing was launched, and nothing was installed into the real AC folder.** The install was tested on temp fake
  trees; the launch, with a mock.
- That AC reads a race.ini changed only in TRACK/CONFIG_TRACK, and starts on our track with the user's own car, is
  **inferred** from `scripts/ac_launch.js`'s notes and AC's key names; it was not run.
- The buttons' DOM (the clipboard, the folder dialog, the checkbox) is load-tested only, not driven in headless Edge.
- The app's capability file was not changed: the new commands are the app's own, like `write_export`, which works
  without an entry. Not verified in a built exe this lap.
- A 262,144-character code limit and the fixed-Huffman encoder's size cost are stated, not measured against real sharing
  channels.

## 8. CHANGELOG lines for B

- Added: shareable codes (one line of text) for a track, a piece or phrase, and a texture pack, importing byte-exact;
  a corrupted, cut or foreign code is refused whole and nothing changes. The sample track's code is 647 characters.
- Added: "Install to AC": pick the Assetto Corsa folder once (remembered), and the track is exported straight into
  content\tracks as t180b_<name>; it never writes over a folder the builder did not make.
- Added: a "See it in Assetto" launch that backs up and restores race.ini around the game, off by default behind a
  labelled setting, and never run by the builder's own tests.
