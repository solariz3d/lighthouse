# D169, packet A — the app made safe to build in, and exportable. Pane A, on D, 2026-09-27

Repo `C:\Users\nname\Desktop\t180-track-builder`, `main` @ `f0b0d75`. **Nothing committed** (panes do not commit).
Written only in my files: `app/palette/*`, `app/index.html`, `app/shell.js`, `app/lib/cjs.js`, `app/export/*` (new),
`app/README.md`, `src-tauri/*`, and `app/test/{palette,shell,export}*`. **`src/` was only called, never edited.**

## 1. The six items

| # | item | what was done | tested by |
|---|---|---|---|
| 1 | **"nullnull"** (B's defect 1) | `renderPalette` passes only real nodes (`[…].filter(Boolean)`) | `palette-dom.test.js`, under a fake DOM that turns a stray `null` into the text "null" as the WebView does. **Red on the old code** (1 of 4 failed, the nullnull test), green after. Headless Edge: 0 "null" texts in the palette |
| 2 | **Backspace guard** | **a modifier: Ctrl+Backspace (or Cmd) removes the head; a bare Backspace does nothing.** Why a modifier and not a confirm: the danger is the accidental keystroke, and a modifier removes it. A confirm would interrupt every deliberate removal, which is one undo step anyway. Keys are now a pure `keyAction()` in `shell.js`, bound in the page | `shell-keys.test.js` (5), red before `keyAction` existed |
| 3 | **No vertical scroll** | the page is a fixed grid (`overflow: hidden`, `minmax(0, 1fr)` rows and columns), and each side panel scrolls inside itself | headless Edge, with a measuring script injected by the local server (no hook in the page); see §4 |
| 4 | **A visible error when a panel fails** | `app/palette/panels.js` `mountPanel`. A module not written yet (404) shows a quiet "not plugged in yet". Anything that fails (does not load, exports no mount, or mount throws, rejects, or returns an `Error` or `{ error }`) shows "The preview could not start: <why>" as an alert in that panel's area. So C's preview can throw or return its error, and either shows | `palette-panels.test.js` (7), red against a stub (7/7) |
| 5 | **Autosave and crash recovery** | the shell writes `{ schema, name, doc }` (the canonical text) through `saveAutosave`, debounced 1.5 s, while the track is unsaved. Native: `save_autosave`, `open_autosave`, `clear_autosave` → `<app data>/autosave.t180auto`, never the repo. On start a leftover autosave is **offered** as a banner ("Restore it" / "Discard it"), never applied silently. Saving under a name or a clean exit clears it. **Closing with unsaved changes keeps it**, so the next start offers it back rather than losing it (my choice, stated). A damaged autosave is left on disk and reported, and the app starts anyway | `shell-autosave.test.js` (10), red first (10/10): the write, restore byte-identical, clean-exit clear, save clears, name kept, discard, no edits means no write, damaged file, debounce, write failure shown |
| 6 | **EXPORT** | the Export… button: native folder dialog, then `shell.exportTo(dir)`. It runs `src/export/fromwords.js` `exportTrack()` **unchanged, in the webview**, against an in-memory disk, then the native `write_export` writes the files into the picked folder. A red track is refused, nothing is written, and the reds are listed in the side panel with their sources. **No AC launch and no install.** AC guard: inside any `…\content\tracks\<name>\…`, a <name> not starting `t180b_` is refused, by the page (`app/export/export.js`) and again natively (`other_ac_track`). Picking `content\tracks` itself is allowed, because `exportTrack` writes only a `t180b_*` folder there | `export.test.js` (8): export to a temp dir with the kn5 read back through `tools/kn5.cjs` (all 5 marker kinds, 7 files present); **the app's export equals node's** (see below); a red track refused with the reds and sources and nothing written; an open track refused; the guard cases; a guarded export writes nothing; shim sha256 and deflate against node's; Buffer calls against node's. Native: 4 new Rust tests |

**How export runs in the webview (§6 in detail).** `exportTrack` uses node: `fs`, `Buffer`, `zlib`, `crypto`, `os`,
`path`.
- **I measured the surface first** (`grep` over `src/export/*` and `tools/kn5.cjs`):
  - `fs`: 6 calls;
  - `Buffer`: `alloc`, `from`, `concat`, `isBuffer`, eight read/write methods, `copy`, `toString`;
  - one each of `zlib.deflateSync`, `crypto` sha256 and `os.tmpdir`;
  - `path.join` and `path.dirname`.
- **So `app/export/node-shim.js` supplies exactly that:**
  - an in-memory `fs`;
  - a Buffer subclass of Uint8Array;
  - a pure-JS sha256;
  - a zlib stream of **stored** blocks (valid, uncompressed);
  - POSIX `path`.
- **`app/lib/cjs.js` gained `builtins` and `globals` options** to hand these to the exporter's files. Any other node
  module is still refused, by name.
- **Proven byte-identical where it matters:** the same document exported by node and by the app's path gives the same
  kn5, `ai/fast_lane.ai`, `models.ini`, `surfaces.ini`, `ui_track.json` and `map.ini`, byte for byte. The three PNGs
  differ in bytes, being stored rather than compressed, and **decode to identical pixels**
  (`export.test.js`, second test).
- **I chose this over spawning node from Rust** because the app must stand alone: node is not on a user's machine.

**Added because Export needs it: "Close the loop".**
- **Why:** every track a user builds in the app is open, and `exportTrack` refuses open tracks (`OPEN_TRACK`), so
  without this Export could never succeed from the UI.
- **What it does:** `shell.closeLoop()` appends `src/doc/connector.js`'s first-ranked candidate as one undo step. It is
  a palette button, live only for an open track with words.
- **The catch:** it takes seconds (every candidate is a solved, validated lap).
- **A closed track resolves through its open twin, marked `resolved.closed`**, because `resolve` still refuses closed
  documents (`CLOSE_NOT_BUILT`), the route `fromwords.js` takes. Without that, the preview would lose the track the
  moment it closes.
- Tested by `shell-close.test.js` (5): one undo step; it is exactly the connector's first candidate (added after mutant
  C1); it resolves marked closed; undo reopens byte-identical; an empty track is refused.

**The self-intersection toggle, visible and off by default.**
- **The problem:** `exportTrack`'s self-intersection check (C's BVH) currently reports crossings its own rules exclude
  on multi-part words (`fromwords.js` SELF-INTERSECTION). So a default export of most tracks is refused. The repo's
  tests pass `selfCheck: false` for that reason.
- **What the app does:** it keeps the safe default. The header has "skip self-intersection check" with a tooltip naming
  why, and the export's warnings say when it was skipped. It is never skipped silently.
- **What remains:** until C fixes the BVH, the button will refuse most tracks unless that box is ticked.

## 2. Two real bugs found on the way, both in my D168 work

1. **The app could not start once export was wired: `tools/kn5.cjs` was not in `dist/`.**
   - `fromwords.js` requires it to read its kn5 back, and `build.rs` copied only `app/` and `src/`.
   - The node tests passed because they load from the repo, where `tools/` exists.
   - **Headless Edge found it:** "The app could not start: cjs: tools/kn5.cjs … 404".
   - Fixed: `build.rs` copies `tools/` too.
   - New `shell-dist.test.js` walks every file the page loads through the loader and checks each is inside a folder
     `build.rs` copies. It was red on the old `build.rs` (2/2), and mutant D1 (drop the `tools/` copy) is caught.
2. **The loader could not load a module that declares a name it also injects.**
   - Injected globals were function parameters, so the shim's own `class Buffer` was a SyntaxError.
   - The page never hit it (it loads `export.js` without globals), but my dist test did.
   - Fixed: each file now runs in an inner function of its own, so its declarations shadow injected names. Two new
     loader tests cover it.

## 3. Tests

- **`npm test`** (the repo's script, now `node --test "test/*.test.js" "app/test/*.test.js"`) → **tests 582 · pass 576 ·
  fail 0 · todo 6**, exit 0 (`NO_COLOR=1 npm test`, summary lines). The reporter's "failing tests" list is those 6
  TODOs, all at `test/roundtrip.test.js:21`, C's marked round-trip rows.
- **Mine:** `node --test --test-reporter=tap` over my 10 app test files (`shell`, `shell-loader`, `shell-keys`,
  `shell-autosave`, `shell-close`, `shell-dist`, `palette`, `palette-dom`, `palette-panels`, `export`) → **tests 73 ·
  pass 73 · fail 0**. `export.test.js` takes about 75 s (one `closeLoop` for its fixture) and `shell-close.test.js`
  about 20 s.
- **Red first:** every new file failed first (the counts are in §1). Said plainly, where it wasn't:
  - **`node-shim.js` and `checkTarget` were written before `export.test.js`,** so 3 of its 8 tests passed on the first
    run (the guard and the two shim checks). The other 5 were red until `exportTo` existed.
  - The palette's "Close the loop" test was red before the button.
- **My own test errors, fixed in the test:** `shell-dist.test.js` first loaded every entry with the shim's globals,
  which the page does not do. It now loads each file the way the page does, and that is how bug 2 above surfaced.
- **Rust:** `cargo test` in `src-tauri` → **`test result: ok. 7 passed; 0 failed`**, exit 0. The 3 from D168, plus:
  - the AC guard;
  - path and folder-name checks;
  - base64 decoding;
  - `write_export` writing its files and refusing a folder it did not write (with the other folder's file untouched,
    and a `../` path writing nothing).

## 4. Build and run evidence, labelled exactly

- **`cargo test`** (`src-tauri`, my scratchpad target dir): a test build, exit 0, `Finished test profile in 4.35s`, 0
  warnings. It includes the new dependency `tauri-plugin-dialog` 2.
- **`cargo build`**: **a debug build of the app binary**, exit 0, `Finished dev profile in 4.43s`;
  `t180-track-builder.exe` **14,187,008 bytes** at 15:45 (`ls -la`).
  - Tauri's build validates the capability file against its schemas, so `core:window:allow-destroy` and
    `dialog:allow-open` are real permission names. A wrong one fails the build.
- **`cargo tauri dev` was NOT run:** it opens a window on this desktop. **The window, the folder dialog and the native
  commands have not been exercised by me.**
- **Headless Edge** (`scratchpad/d165/edge_dom.js`: `dist/` served on localhost, `msedge --headless=new
  --window-size=W,H --dump-dom`):
  - This is **Chromium, not the Tauri app**, with no native side.
  - At `--window-size=1400,860` the page's viewport was **1376×768 and the document 1376×768**: no scroll.
    - **Said plainly:** headless Edge's viewport is smaller than the window size given. "1400×860" is the headless
      window, not Tauri's content area; Tauri's 1400×860 is its outer window, content about 1384×821 (inferred).
    - Also checked at 900,600 (viewport 876×508, document 876×508) and 1920,1080 (1896×988, 1896×988).
    - **The old page from `f0b0d75` at 1400,860 scrolled: document 826 high in a 768 viewport**, so the measurement
      detects the defect B saw.
  - The same run: the page started with no error; 7 word buttons, 3 pickers; the Close and Export buttons present; C's
    preview mounted (a `<canvas>` present); 0 panel errors; 0 "null" texts.

## 5. Mutants — on copies (`scratchpad/d165/d169_mutants.js`; each mutant runs the copied test files that cover it)

**listed 37 · applied 37 · caught 36 · survived 1 · NOT APPLIED 0 · NO RESULT 0.** Live files unchanged; 0 temp dirs.

- **C1 SURVIVED (close the loop with the last-ranked candidate), and it was a real gap:** nothing checked which
  candidate the shell took. New test: the closed track is byte-identical to the connector's first candidate. **C1 re-run
  alone: caught.** The others were not re-run; adding a test cannot un-catch them.
- **The 37:**
  - D168's 14, re-run on this lap's files: A1–A9, A12, P1, P2, L1, L2;
  - **N1** nullnull back;
  - **K1** bare Backspace removes · **K2** keys reach the track while typing;
  - **M1** a throw swallowed · **M2** a returned error ignored · **M3** a missing module as an alarm;
  - **S1** autosave never written · **S2** recovery applied silently · **S3** clean exit leaves it · **S4** save leaves
    it · **S5** no debounce · **S6** a damaged autosave stops the app;
  - **E1** guard off · **E2** guard case-sensitive · **E3** reds not shown · **E4** files written despite the guard ·
    **E5** wrong Adler-32 · **E6** a wrong sha256 constant · **E7** writeUInt32BE little-endian · **E8** utf8 as
    latin1;
  - **C1** last-ranked connector · **C2** closed track not marked closed;
  - **D1** `build.rs` drops `tools/`.
- **No mutants on the Rust side or on `index.html`'s glue.** The Rust functions are unit-tested, and the glue only by the
  Edge boot (§7).

## 6. Privacy gate

`grep -i` over every file of mine (`app/shell.js`, `app/index.html`, `app/README.md`, `app/lib`, `app/palette`,
`app/export`, my `app/test` files, `src-tauri/src`, `build.rs`, `Cargo.toml`, `tauri.conf.json`, `capabilities`), for
personal paths, the email domain, `token`, `vck_`, other authors' track names and room words (including "packet") →
**2 hits, both false positives**: "Unexpected token }" in a test's SyntaxError text. Fixed during the lap: a
`Cargo.toml` comment that named "the D169 packet", reworded.

## 7. What was NOT verified

- **The Tauri window** (`cargo tauri dev` not run, §4). Nothing has been exercised through the real native side from
  the page:
  - the folder dialog (`plugin:dialog|open`), the autosave commands, `write_export`, the close handler;
  - whether `onCloseRequested` flushes or clears before the window closes.
- **Base64 over the bridge for a large kn5** (several MB). It is correct by the Rust decode test and the JS encoder,
  but not timed.
- **Export of a track the user builds in the app, end to end in the window:** build, close, export, then open the
  folder.
- **Default-settings export** is refused for most tracks by C's BVH false positives, until C fixes them (§1).
- **Unsaved changes when opening another track or starting a new one:** there is no prompt, and the next edit
  overwrites the autosave. Not built.
- **`csp: null` stays.** The loader evaluates fetched source, so a CSP needs `'unsafe-eval'`.
- **The app's PNGs are uncompressed** (stored deflate). They are valid and larger; not measured against AC.

## 8. CHANGELOG entry for B

```
### Added
- Export from the app: an Export… button writes the open track as an Assetto Corsa track folder into a folder picked
  in the native dialog. It runs the same exporter as the command line (src/export/fromwords.js) inside the window, and
  the result is byte-identical to it apart from PNG compression. A red track is refused and its reds are listed. Inside
  an AC install only t180b_* folders are ever written, and another track's folder is refused. Nothing is installed or
  launched.
- Close the loop from the palette, appending the safest connector as one undo step, since an AC track must be a closed
  lap before it exports.
- Autosave and crash recovery: an unsaved track is written to the app's data folder shortly after each edit, and the
  next start offers to restore it or discard it.

### Fixed
- The palette no longer shows "nullnull" under the track list.
- Backspace alone no longer removes the head; Ctrl+Backspace does, so a stray key cannot delete track.
- The window no longer scrolls: the panels scroll inside themselves.
- A panel that fails to start (the preview, the camera, validation, handles) now says so in its own area.
- The built app now carries tools/, which the exporter needs, and the in-window module loader no longer breaks on a
  file that declares a name it also provides.
```

NEXT: librarian — score D169 when B's, C's and E's are in; the first person to open the window (cargo tauri dev) tries Build → Close the loop → Export and says what they see; C's BVH fix is what lets the default export through
