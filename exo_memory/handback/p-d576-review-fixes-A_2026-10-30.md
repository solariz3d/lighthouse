# D576: the outside review's fixes, items 4–9 (A, 2026-10-30)

Plan: `exo_memory/loop/plan_t180_outside_review_2026-10-30.md` (read whole).
- Branch **d576-a** off `492a264` (land-0431 `a6af8cf` plus row 17).
- Worktree `C:\Users\nname\Downloads\t180-wt-a576`. Not pushed. One commit per item, by path.
- Messages are one-liners with the two attribution trailers. **No seat line**: the order's "no room words" overrides my usual seat naming in the body.
- S = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad`.

    checked: git log --oneline 492a264..d576-a →
      acd45ae (4) Describe the app as it is in Cargo.toml and tauri.conf.json
      7a7a96b (6) sculpt-frame test: read the lock folder from CONSONANCE_DATA only, no file in the home folder
      c12bdf4 (5) README: a screenshot of the builder in place of the placeholder
      25dd897 (8) Add an MIT licence for the builder's own code; the actools port keeps its Ms-PL
      6d484d3 (9) README: say the numbers the checker uses were measured from community tracks
      5bcb728 (7) A content security policy: scripts from the app only, the export host's relay by its hash
    checked: grep of every added line and every message for D-numbers, keeper, exo_memory, seat, librarian, chair, pane, lap → 0

## (4) Descriptions (just do it)

- **Cargo.toml:** "T-180 Track Builder: shape Assetto Corsa tracks piece by piece, for normal cars and the T-180s, and export a folder AC can load".
- **tauri.conf.json shortDescription:** "Build Assetto Corsa tracks for normal cars and the T-180s".
- No test pins either. The JSON parses.

## (6) sculpt-frame.test.js (check it)

**The change:** `dataDir()` reads `CONSONANCE_DATA` only. The `~/.consonance.json` read and the `os` import are gone, and the skip reason says what to set. The track fixture was already the test's own: it is built in the test by the shell.

    checked: node --test app/test/sculpt-frame.test.js → 6 tests, pass 1 (row 5), skipped 5 (rows 1–4b: "not timed: CONSONANCE_DATA does not name the heavy-run lock folder…"), fail 0

**For the room's timed runs:** heavy-run.js passes on only its token, not the data folder. So a run that wants sculpt-frame's timed rows must now set `CONSONANCE_DATA` itself. On this machine that is `C:\Consonance\data`, where the lock files are (inferred from the lock files being there).

## (5) The screenshot (just do it)

**`media/builder.png`**, 1920 × 1080, 354,661 B. In the README it replaces the placeholder, with alt text.
- It shows Sigil, Build view: an 8-piece, 800 m track laid with the page's own Extend and typed turns. The Extend ghost shows with its drag handles, and the checker reads 0 red 0 amber. No one's track is in it.
- Made by `S\d576\shot.js` at BelowNormal with --mute-audio, title zz-headless-test. Page errors none. TabProxyWindow 289 → 289.
- **I tried two other views and a banked track.** Overhead hid the ghost under the values strip. The banked track showed 5 reds, a poor first picture. The plain one is used. All shots: `S\d576\shot1.png` (used), `shot-Overhead.png`, `shot-Chase.png`, `shot-bank.png`.
- I chose `media/` over `docs/` because the review already flags comments that point at a `docs/` the repo lacks.

## (8) Licence

**`LICENSE`:** the MIT text, "Copyright (c) 2026 solariz3d". After it, one note: `app/preview/acshaders.js` is ported from actools and stays under the Ms-PL, whose text is `app/preview/ACTOOLS-MS-PL.txt` (untouched).
- **Only that one file is a port carrying the Ms-PL notice:**

      checked: grep Ms-PL → acshaders.js:4 "LICENCE OF THIS FILE: Microsoft Public License"
      ailine.js and kn5write.js say they FOLLOW AcTools' byte layouts (not copied code); aclook.js and renderer.js only mention the port

- **README:** there is no Credits section on this branch, so a two-line "## Licence" section sits above the essay and names both files.

## (9) The measured-numbers line

The line was inside the essay, so I changed **only that clause**. The order asked for this edit; the essay is otherwise untouched.

> no one's track, model or texture is in it or in anything it makes (the numbers it checks against, such as road widths, grips and lap statistics, were measured from existing community tracks, and only the numbers were kept);

No names. "Lap statistics" is the order's own word. The README holds both items' edits, so they went in as two commits by restoring the file in between.

## (7) The content security policy (check it)

**The policy** (`src-tauri/tauri.conf.json` app.security). Each source beyond `'self'`, and why:

| directive | sources | why |
|---|---|---|
| default-src | 'self' | |
| script-src | 'self' 'unsafe-eval' 'sha256-IMCbbzL2…zMU=' | eval: `app/lib/cjs.js`'s `new Function` and the export worker's `(0, eval)`; the hash: see below |
| style-src | 'self' 'unsafe-inline' | inline `style` attributes: `index.html:327,368` and every `el(…, { style })` in `app/core/panel.js` (:227, :285, :430, :768, :769) |
| img-src | 'self' data: | two SVG data URIs in index.html's CSS (`:185` spin buttons, `:278` the like-pick arrow) |
| worker-src | 'self' blob: | the checker, overlap and close workers load from files; the export's worker is a blob (`exportrunner.js` RELAY) |
| connect-src | 'self' ipc: http://ipc.localhost | Tauri's IPC, as Tauri's own example has it |
| object-src | 'none' | stricter than 'self'; the app has no plugins |
| base-uri | 'self' | |

Plus `"dangerousDisableAssetCspModification": ["style-src"]`. **Why:** at build time Tauri adds a nonce to style-src, and a nonce switches `'unsafe-inline'` off, which would break the inline style attributes.
- Checked in Tauri's own source, at the versions in Cargo.lock: tauri-utils 2.10.0, `html.rs` `inject_nonce_token` calls `can_modify("style-src")`; tauri-codegen 2.7.0, `context.rs:82`.
- Scripts stay strict. The build hashes index.html's two inline scripts itself (`inject_script_hashes`, with CRLF normalised to LF).

**THE FINDING: the export would have broken.**
- The export runs in a sandboxed iframe whose page is a `srcdoc` string with an inline script (`exportrunner.js` RELAY).
- A srcdoc frame inherits the page's policy, and the build hashes only scripts in .html files. So under `'self' 'unsafe-eval'` alone, that script is refused, and the export host never boots.
- The headless run caught it: `script-src-elem`, blocked-uri inline, document `about` (srcdoc), during File ▸ Export….
- **The fix:** name that one script's sha256 in script-src. A new test pins it.

**`app/test/csp.test.js`, 4 rows, plain node:**
- there is a policy, default-src 'self';
- no inline script but the hashed one, and nothing remote;
- **the relay's hash is in script-src**;
- style-src is left alone by the build.

    checked: with 492a264's tauri.conf.json (csp null) → 4 of 4 fail; at 5bcb728 → 4/4
    checked: one space added inside RELAY's script → row 3 fails and prints the new hash to put in; file restored

**The headless launch, every page** (`S\d576\csp.js`).
- **How it is served:** the policy from tauri.conf.json, the inline-script hashes added as the build does, and a `report-uri` the server collects. Console CSP lines and page errors are counted too.
- **What it drives**, in Chrome at BelowNormal with --mute-audio and title zz-headless-test, with a stand-in for the IPC:
  - Extend ×8 (checker and overlap workers) and Close the loop (close worker);
  - **File ▸ Export… through to `write_export`** (the sandboxed frame and its blob worker);
  - all six looks; Sculpt (Tab) and back; every menu opened; the save ask.
- Then `app/preview/smoke.html` ("SMOKE OK").
- **A control at the end:** a cross-origin image, which must be reported.

    checked: S\d576\csp-run.json → index.html: reports 0, CSP console lines 0, page errors [] (export: "exported t180b_untitled to C:\csp-test\out"); control: 1 report (img-src); smoke.html: 0
    checked: S\d576\all\csp-run.json (the policy sent on EVERY response, so the file-loaded workers run under it too) → the same: 0, and the control 1
    TabProxyWindow 289 → 289 over every run

**Every app test.** All of `app/test/*.test.js` except the 6 mutation harnesses (check it), under the heavy-run lock at BelowNormal.

    checked: S\d576\app.tap → tests 1,338, pass 1,325, fail 7, skipped 5, todo 1

**The 7 failures:**
- 1 is the known TODO row (the preview's material list).
- 5 are frame-timing rows: drag-frame rows 2, 3, 7 and 8, and release-frame row 1. They ran while C's and E's heavy runs held the other slot.
- 1 is export-isolated-page row 1, `EXPORT_LOST: … stopped before it started`. That test applies no policy (no CSP in it).

      checked: export-isolated-page.test.js alone, at d576-a and at the d575 tree (492a264 + CSS) → 3/3 and 3/3

  So it is a slow host boot under load, not this change (inferred: the same file is green alone on both trees).

**Not done:** a real Tauri build and a launch under WebView2. The headless check stands in for it, by the build's own rules. **The installed app is the true check of (7), and the landing pane should open the built app once before the release.**

## Also found (for the comment sweep)

The export's warnings show room words to a user. This run's export message read "… (D515 bands.txt (the box reaches the road mesh at about 47 g) and peaks.txt …)". It belongs to the comment-and-words sweep (item 8 of the plan). Not touched here.

leftovers.js, as it printed:

    worktrees            Desktop/lighthouse 35 linked + main
    strays               not scanned (give --strays <folder> --prefix <name>-)
    fake roots           0
    orphan browsers      0 headless roots whose parent is gone
    our long-running     2 (older than 120 min, infrastructure left out)
      pid 27764  2h 54m  bash.exe  …
      pid 46360  2h 54m  bash.exe  …

**Those two are not mine.** They are a replay watcher started at 20:47 by another session (it looks for new AC replays). I left them alone.

## Corrections

- **My first item-4 commit carried a seat line in its body.** It was amended to the one-liner before anything else (acd45ae).
- **A shell heredoc with backticks made bash run `app/preview/acshaders.js` and `ACTOOLS-MS-PL.txt` as shell scripts.** Both stopped at syntax errors on their first lines, which are comments and the licence title. `git status` shows both unchanged. The README line it mangled was fixed with Edit.
- **My first CSP launch never reached the export:** its track's straights were too short for a grid, so the export was refused. The second launch also stopped early, because my wait read the wrong element. The third waited for `write_export`.

SOURCES: the chair's D576 packet and its additions; plan_t180_outside_review_2026-10-30.md; v2.tauri.app/security/csp and /reference/config; tauri-utils 2.10.0 html.rs, html2.rs; tauri-codegen 2.7.0 context.rs, embedded_assets.rs; S\d576\csp-run.json, all\csp-run.json, app.tap, sculpt test tap; S\d576\shot1.png; leftovers.js
NEXT: librarian — read it; the landing pane takes d576-a (6 commits) into the next release and opens the built app once for (7); A takes the comment sweep's last pass (app/preview and the rest) when the chair rings after E's and C's passes.
