# D177 · the first ten minutes (ARCHITECTURE §11.7) and the window pass (pane E) · 2026-09-27

**Packet:** D177 E, dispatched at 18:0x and restated by the chair at 20:1x after the incremental-validation reorder:
- a guided first track;
- cited defaults;
- the phrasebook up front;
- a first-run flag in the app's data dir;
- the real-window usability pass;
- the README follow-up, plus C's option-2 row.

**Nothing is committed.** B owns the CHANGELOG, so my entry is §9.

## 0 · First, because it blocks every user: THE APP CANNOT PLACE A WORD IN ITS REAL WINDOW (for A)

The window pass's first click on a palette piece placed nothing. The page threw:

```
TypeError: Illegal invocation
    at set (app/shell.js:63:95)  ·  at commit (app/shell.js:87:12)  ·  at Object.place (app/shell.js:128:26)
    at HTMLButtonElement.click (app/palette/palette.js:68:31)
```

- **The cause:** `createShell`'s default `timers = { setTimeout, clearTimeout }` makes `timers.setTimeout(...)` a call
  of the browser's `setTimeout` as a method of another object.
  - WebView2 refuses that. Node does not, so every headless test passes.
  - The autosave timer runs on the first change, so no word can be placed.
- **How long:** on main since `59ff906` (D169+D170) and in `cb8e765` (`git log -S` finds its introduction at
  `59ff906`).
- C's `scripts/prove_render.js --shim-timers` (D170) worked around it in C's window proofs, so it never showed there.
- **The fix, one line:** `scratchpad d177/timers.diff`, against `app/shell.js` sha256 `a4ce35dac2608548`.

```diff
-async function createShell({ storage, exporter = null, autosaveMs = 1500, timers = { setTimeout, clearTimeout } } = {}) {
+async function createShell({ storage, exporter = null, autosaveMs = 1500, timers = { setTimeout: (f, ms) => setTimeout(f, ms), clearTimeout: (t) => clearTimeout(t) } } = {}) {
```

- **A regression test for A** (`scratchpad d177/timers-regression.test.js`, for `app/test/`): it makes
  `globalThis.setTimeout` and `clearTimeout` throw, as a browser does, when called on anything but the global, then
  places two words with the default timers.
  - **Checked both ways on a copy:** the current shell gives 0/1, and with the fix 1/1.
- My window pass below ran on a copy build WITH this fix applied. That is the only way past the first click without a
  page shim, and it proves the fix in the real window.
- Posted to the board at 20:3x, ahead of this hand-back.

## 1 · The window pass: the guided first track, driven in the real window

**How it ran:**
- **The build:** `scratchpad d177/build-copy.js` builds a COPY of the tree (own target dir, under the lock) with a
  separate app identifier (`identifier.diff`). So it had its own data dir: none of the user's autosave, library,
  settings or first-run flag was read or written.
- **The driver:** `d177/drive.js` speaks the DevTools protocol to the page (`WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`,
  as C's `prove_render.js` does). It clicks with real mouse events, has a hard timeout, and kills only its own PID. It
  also records the page's own exceptions.
- **The captures:** PrintWindow of the app's own window only (C's `prove_render.ps1`). A capture whose title is not
  "T-180 Track Builder" is deleted; none was. **No AC launch.**

**Run 1** (the 20:2x build, before any fix): the first capture showed the card as a 75 px column over the camera bar
(fixed, §3). The first click placed nothing: the timers bug (§0).

**Run 2** (the build of 21:01, WITH the timers fix and the mount point, before my text fixes). The whole guided track
went through by the user's own moves. Captures are in `scratchpad d177/shots/`.

| capture | what it shows |
|---|---|
| `0-first-launch.png` | the guide opens itself on first launch, top-right of the stage ("1 of 5 · Place a few pieces"); the palette outlined; the starter phrases in view |
| `1-placed.png` | "sakura flow" clicked: one entry, five words; the guide moved ITSELF to "2 of 5 · Sculpt one handle", the handles panel outlined |
| `2a-phrase-selected.png` | the phrase selected: the handles panel shows no handles, and (this build) says "Select one placed word", which the user just did |
| `2b-word-selected.png` | "turn" placed and selected: its handles show |
| `2c-sculpted.png` | the length slider dragged: it STOPPED at the red bound (23.8 m), and the guide moved itself to "3 of 5 · Close the loop" |
| `3-closed.png` | "Close the loop" pressed (24 s): the connector closed it, and the guide moved to "4 of 5 · Read the colours", the validation panel outlined |
| `4-colours.png` | the colours step: 0 red, 1 amber, lap proved, and Next instead of Skip |
| `5-export-step.png` | Next pressed: "5 of 5 · Export", the Export… button outlined |
| `6-exported.png` | the export NOT written: C's dialog script found no folder box in the native picker ("no Folder box exposed in the dialog; nothing typed, nothing pressed"). The export step's completion is therefore tested headless only (`onboarding.test.js`, `lastExport`) |

**Measured in every capture** (the driver reads the page): the card is 340×132–151 px and fully on screen; each step's
outlined target is fully on screen; 0 elements overflow and 0 are clipped by the window; the page logged 0 exceptions.

**WHAT READ BADLY, and what was done:**

| # | what | whose | done |
|---|---|---|---|
| 1 | the card a 75 px column over the camera bar | mine (mount diff) | fixed: a pass-through layer, the card top-right, 340 px (§3); applied by A |
| 2 | no word could be placed | A's shell | the one-line fix, applied by A (§0) |
| 3 | after the guide's own "sakura flow", step 2 was a dead end: a phrase has no handles, and the panel said "Select one placed word" to a user who had | mine | the handles panel says why (`panel.js why()`: "w1 is the starter phrase … its words cannot be sculpted here yet. Place a single word …"); the guide's step 2 says so too; tested |
| 4 | "23.800 mred past 23.8: fold, seam-past-envelope (ARCHITECTURE.md:57, :84; …)": the reason glued to the value, in rule ids | mine | on its own line, in plain words ("stopped at 23.8 m: past it, the surface folds over itself here …"); the ids and sources in the tooltip (§6) |
| 5 | the red and amber list in rule ids and doc lines ("amber: seam-past-envelope … (FINDINGS.md:24 …)") | mine | plain words, the rule and source in the tooltip (§6) |
| 6 | the load graph's labels ("90 g proven", "20 g stop") too small to read: drawn at 480 px, shown at ~265 | mine | the canvas follows its shown size × DPR; labels drawn at 10 css px |
| 7 | "lap not run (open)" | mine | "lap: the loop is still open" (and "checked when the drag ends", "no speed set") |
| 8 | the colours step said amber is "past 90 g"; amber is also a seam sharper than measured | mine | the text names both |
| 9 | the length slider is coarse: a short drag took a turn from 448.8 m to 23.8 m (metres per pixel) | mine | NOT fixed: the slider spans the handle's whole range; a finer control is a design change, noted |
| 10 | the palette prints the success message "loop closed with 3 words (14230 m) …" in RED, like an error | **A** | routed: the shell has `messageKind: 'ok'` (`shell.js`); the palette colours every message as an alert |
| 11 | the status line reads "unsaved • · closed loop" (two separators) | **A** | routed |
| 12 | "Close the loop" on a ~2 km, two-entry track made a **14,230 m** loop | **A** (connector) | routed: the connector ranks by physics margin, not length (as the guide says), but a new user will not expect 12 km of added road |
| 13 | after closing, the overhead view shows almost nothing: the 14 km loop is too thin at that scale | **C** | routed |
| 14 | a recovery banner ("A track from your last session was not saved") on "first launch" | none | a probe artefact: an earlier drive of this copy placed a word before it was killed. A new user has no autosave |

**Run 3, NOT RUN.** This was the rebuild WITH my text fixes (items 3–8), for final captures. It was queued behind B's
landing run and stopped at the final lap (22:4x).
- **So fixes 3–8 are tested headless** (validate-ui + handles 80/80, onboarding 20/20) **and NOT seen in the real
  window.**
- The window captures above are of the build before them.

## 2 · What I built (all mine, `app/onboarding/`)

| file | sha256 (16) | what |
|---|---|---|
| `app/onboarding/guide.js` | `b94cbec7f2002d1e` | the STEP MACHINE, with no DOM |
| `app/onboarding/firstrun.js` | `e87ceb445ca6f342` | the first-run flag |
| `app/onboarding/defaults.js` | `9688aeb25bf9e271` | the starting picks, each with its source |
| `app/onboarding/index.js` | `2731dd5d0b8438ea` | `mount(root, shell)`: the card, the outline, first-run behaviour |
| `app/test/onboarding.test.js` | `2b17c0f3df515247` | 20 tests |

### 2a · The step machine (`guide.js`)

- **The five steps**, each with one sentence of what to do and one of why:
  1. Place a few pieces: done at 3 words, where a starter phrase counts word by word. "A few" = 3 is inferred.
  2. Sculpt one handle: done when a placed word's entry is REPLACED with the same count; a placement adds instead.
  3. Close the loop: done when the document is closed.
  4. Read the colours: a reading step, done by Next.
  5. Export: done when the shell's `lastExport` changes.
- **The user makes every move** (the keeper's framing). The guide only SEES moves in the shell's state and never
  places, drags, closes or exports.
- **A move made early is remembered.** Closing before sculpting completes "close", and the guide passes over it when
  it gets there.
- `next` / `back` / `skip` / `finish`:
  - skip records "skipped", never "done";
  - back stops at the first step;
  - finish ends at any step.
- **It never blocks the expert path:** it holds no lock, and the app is the same with it closed.

### 2b · The defaults, cited (`defaults.js`; a test checks each quote on its line)

| default | value | source |
|---|---|---|
| font | `auto` (each word in its own font: curves in the bowl) | FINDINGS.md:14 "The dominant form is a **bowl** … It is 50–88% of profiles on most tracks." |
| tempo | `standard` | **inferred**: scale 1, between the measured extremes it is named against (ARCHITECTURE.md:44) |
| design speed | 460 km/h (`MACH6.designSpeedKmh`) | FINDINGS.md:476, the pooled median of seven clean Mach 6 laps |
| first piece suggested | "sakura flow" | the starter phrasebook: Sakura's grammar, FINDINGS.md:180-181; FINDINGS.md:124 names Sakura "the flow benchmark" |

On first run, `apply(shell)` sets the font and tempo pickers through the shell's own `setPicker`. The design speed is
already the validation panel's default.

### 2c · The first-run flag (`firstrun.js`): in the app's data dir, never the repo

- **Where it lives:** the webview's `localStorage`, key `t180b.onboarding`, value `{ how: 'finished' | 'skipped', at }`.
  Tauri gives WebView2 its user-data folder inside the app's own data directory
  (`%LOCALAPPDATA%\<identifier>\EBWebView`).
- **When it is set:** when the guide is finished or closed (✕).
- **"Show the guide"** forgets it.
- **A store that throws** (storage off) means "not remembered": the guide shows, and nothing breaks.
- **An alternative for A,** if a native flag is preferred: two commands, `get_onboarding` / `set_onboarding`, writing
  one small file beside `ac_root.txt`. A store over them has the same two methods and drops in. Not built.

### 2d · The phrasebook up front

On first run the guide scrolls the palette's "Starter phrases" group into view (the palette is A's; this only
scrolls), and step 1 names "sakura flow".

## 3 · For A: the mount point (the exact diff; `scratchpad d177/mount.diff`, against `app/index.html` as of 20:2x)

```diff
@@ -70,6 +70,7 @@
 <main id="stage">
   <div id="preview"><div class="placeholder">Loading the preview…</div></div>
   <div id="camera"></div>
+  <div id="guide" style="position: absolute; inset: 0; pointer-events: none; z-index: 5;"></div>
 </main>
@@ -198,7 +199,7 @@
-  for (const [dir, id] of [['preview', 'preview'], ['camera', 'camera'], ['validate-ui', 'validation'], ['handles', 'handles']]) {
+  for (const [dir, id] of [['preview', 'preview'], ['camera', 'camera'], ['validate-ui', 'validation'], ['handles', 'handles'], ['onboarding', 'guide']]) {
```

- **The layer:** a pass-through layer over the stage (`#stage` is already `position: relative`). The card takes its
  own clicks.
- **The first version of this diff was a zero-size box.** The window pass showed the card squeezed into a 75 px column
  over the camera bar (§1, capture 0). This version fixes it.
- **A has since applied it** (`app/index.html:74`, `:207`), so the guide is mounted in the live page.

## 4 · README.md (mine): the chair's SMALL and C's option-2 row

**Done in the live file, and landed in `e6b4362`** (D177a+D178). Each change was checked against the files:

1. **Row 104, "One-click 'see it in Assetto'"** now reads: **"tested, with the game launch mocked"**, citing
   `src-tauri/src/ac.rs` (its tests use a mock launcher), `app/install/` and `app/test/share-install.test.js`:
   "built, OFF by default, and never run".
   - **Corrected on the way:** my first draft cited `test/ac_launch.test.js`. That file tests `scripts/ac_launch.js`, a
     separate launcher script that B's privacy gate lists as excluded from the landing, not the in-app button.
   - **Checked:** a `Mock` spawner in `ac.rs:237`, and `share-install.test.js:96` "See it in Assetto is OFF by default".
2. **The three "built, landing pending" rows:**
   - the phrasebook: now "tested", "listed in the palette under 'Starter phrases' (`src/doc/library.js`,
     `app/palette/palette.js`)", since A applied the registration (`library.js:30-41`, `palette.js:20`);
   - texture packs: tested, `test/doc-packs.test.js`;
   - the soak and bench scripts: tested, `test/perf.test.js` and `test/perf_soak.test.js`.
   - The "How to read the table" paragraph no longer says "landing pending".
   - **Also fixed:** row 130, "Spawn here … no AC launch in v1", was false once the button exists. It now says the
     button sets only the track, and choosing a marker is not built.
3. **Room vocabulary off the front page:**
   - "in the keeper's words" → "in the author's words";
   - "(the keeper, 2026-09-27 …)" → "(the author, for v1 …)";
   - "(D171–D174 landed there …)" → removed;
   - "proposed to A" → removed.
   - `grep -niE "keeper|librarian|\bD1[0-9]{2}\b|hand-?back|\bpane\b|\bchair\b|landing pending|proposed to [A-E]\b"
     README.md` → **0 hits.**
4. **C's option-2 row (p-d177-option2-C §4, replacing line 68):**
   - "Frames: the curve model's yaw-and-pitch (gravity) frame plus the explicit roll. A DEVIATION from §3's
     'rotation-minimising frames', made on 2026-09-27; the reason and what changes are recorded in
     `docs/INTERFACES.md` §2".
   - **One change to C's wording:** it carried "D177; the librarian's ruling". Kept out for the same room-vocabulary
     reason, with every fact kept: the date, the deviation, and where it is recorded.
   - **Checked:** `INTERFACES.md:141` holds the dated section, and no other README row claims a twist spread.

**After the landing, another seat edited the README for the 0.2.0 release (21:23).** It added an Install section, the
table judged against 0.2.0, and rows for the guided first track and the timers fix. I did not revert it. I checked its
two rows about this packet against the tree:
- the guide IS mounted (A applied my mount diff);
- `app/test/timers-regression.test.js` exists (A applied the fix and the test).
- So both rows are true.
- **One README row of mine was half-true, and is corrected** (after the landing, so it is in the working tree only):
  "A phrase's 'parameters exposed' | not yet | a phrase's words are sculpted one by one".
  - That holds in the document model (`editPhraseWord`, `src/doc/document.js:115`).
  - It did NOT hold in the app: neither the shell nor the handles panel can select or sculpt a phrase's word (§1).
  - The row now says both.

## 5 · Mutation pass: 13 of 33 run, the rest NOT RUN

**How it ran:** `scratchpad d177/mutate_onboarding.js`, 33 mutants over `app/onboarding/{guide,firstrun,defaults}.js`,
on a copy, under the lock, at `--test-concurrency=4`.

**The first 13 ran** before I stopped the pass for D179 (18:44): **11 caught, 2 survived.**
- **#2, a phrase counted as one word:** a test gap. It is now tested ("ONE starter phrase … completes place"), and
  caught **by hand on a copy** (18 pass / 1 fail), not in the locked pass.
- **#5, colours not a reading step:** EQUIVALENT, because the mutant was ill-formed. The object literal's later
  `done: null` key overrides the inserted `done`, so nothing changes.

**Mutants 14–33 (firstrun.js and defaults.js, the rest of guide.js): NOT RUN.** They were queued behind B's landing run
and stopped at the final lap. The command: `ONLY=2,$(seq -s, 14 33) node d177/mutate_onboarding.js`.

## 6 · D180, from A's check of the installed 0.2.0 app

### 6.1 · The starter phrases chained come out CLEAN: by their ORDER, not by changing the spiral

**The finding:** sakura flow → bowl hairpin → S → spiral climb, the palette's order, gave 2 stacked reds (476–521 and
2513–2559 m).

**The cause, measured:**
- It is not the spiral's own layers. The spiral climb's FIRST word, a turn still nearly level, crosses the sakura flow's
  road 0.4 m above it, at (138, 0, 452) against (147, 0.4, 449) m.
- The deepest overlap is 1.85 m into the 2 m stack distance. The stacked pairs are w4/1 with w1/3 and w1/4.
- The chain's left turns bring the spiral's start back over the start of the track.

**All 24 orders of the four, validated** (`scratchpad d177/perms.js`): **22 chain clean.** Only the palette order and
its exact reverse stack.

**All 16 ordered pairs** (`d177/chains.js`): **15 clean.** The one red pair is **bowl hairpin → bowl hairpin**: two
flat 180° hairpins the same way make a 360° that comes back over its own start. That is geometry, not a default any
clearance fixes.

**So the fix is the ORDER, not the spiral:** sakura flow → **S → bowl hairpin** → spiral climb.
- **Why the order:** the spiral is clean after every other phrase and in 22 of 24 chains. Its 6° climb and the
  1,805 m / 131 m it covers are pinned by its tests and the README. Raising its clearance would change what it is, to
  fix one chain.
- **Why this order:** of the 22 clean ones, this keeps sakura flow first, the guide's suggested first piece, and swaps
  one pair.

**It is ONE diff over four files, because A's tests pin the order too:**
- `scratchpad d180/order.diff` (sha256 `f09a750ea51e1705`, 111 lines), made by `d180/make-order-diff.js` on copies;
  every replacement matches once or it stops.
- The files:
  - `src/doc/phrasebook.js` (mine): the two blocks swapped, and the reason recorded above `PHRASES`;
  - `test/phrasebook.test.js` (mine): the order pin, the error-message order, and the two new tests below;
  - `app/test/palette.test.js:19` and `app/test/palette-dom.test.js:45` (**A's**): the order each pins.
- **Not applied to the live tree, deliberately.** Half of it alone would turn A's two palette tests red. It is for A,
  or the landing seat, to apply whole.
- **On a copy with it applied:** phrasebook, palette, palette-dom, palette-phrasebook, doc-library and onboarding pass
  **82/82**.

**The tests it adds** (`test/phrasebook.test.js`):
1. The four chained in the palette's order give **no red**. Checked against the OLD order too: it fails there,
   reproducing A's two reds (476–521 and 2513–2559 m).
2. Each phrase after each other one: the red set is **exactly** bowl hairpin → bowl hairpin.

**The guide never uses that pair** (`app/test/onboarding.test.js`, live, 20/20): the only starter phrase any step
names is the first piece, "sakura flow", once.

### 6.2 · The red list in PLAIN WORDS; the rule and its source in a tooltip

**Done in my files, live:**
- **`app/validate-ui/labels.js`** (new, sha256 `90d001ec5fa79b49`) gives plain words for every reason validation can
  give. For example, stacked-within-2m → "two roads are stacked less than 2 m apart here". It also covers the lap and
  its failure reasons, a handle stopped at a bound, and a document refusal (its error code stripped).
- **The validation list** shows "red: two roads are stacked less than 2 m apart here, at 476–521 m". Its tooltip
  (`title`) is "stacked-within-2m · ARCHITECTURE.md:85".
- **The handles panel** shows "stopped at 23.8 m: past it, the surface folds over itself here …", with the technical
  reason in the tooltip.
- **`handles.js`** returns the stop as data (`stop: { at, reasons, sources }`) beside its technical `why`, which
  the tests read. Its "already red" text lost the internal "(red-now)".

**Tests** (`app/test/validate-ui.test.js`): every reason validation defines (`SRC`) has plain words, and:
- its list line shows neither a rule id nor a ".md:" line, while its tooltip keeps both;
- the lap texts, the lap's failure lines, a stopped handle and a refusal are checked the same way.
- The check is: no hyphenated rule id (`stacked-within-2m`), no id-like token, no `.md:`. **"fold" is exempt as a
  rule id:** it is also the plain English word, and "the surface folds" is the right thing to say.
- validate-ui and handles together: **80/80.**

## 7 · What this does NOT establish

- **No AC launch at any point.**
- **The export step's native folder dialog** was answered by C's `prove_render_dialog.ps1` (UI Automation, the dialog
  owned by this process only). A real user picks the folder by hand.
- **The window pass ran on a COPY build with three diffs A has not applied:** the mount point, the timers fix, and a
  separate app identifier. The copy gets its own data dir, so it read and wrote none of the user's autosave, library or
  settings.
  - **What the window pass proves, therefore:** my files plus those three diffs. It does not prove the live page.

**The final check of my files (22:4x), NOT the full suite:** validate, validate-ui, handles, onboarding, phrasebook,
export_words and doc-jump together, `--test-concurrency=4` → **264/264**, with A's D179 jump-default diff applied in
the live tree. A first run at the same minute had 7 failures in `validate-ui-jumpdefault`; A was mid-way through
applying that diff, and they pass since. The full suite under the lock is B's landing run.

## 9 · CHANGELOG entry (for B)

- **Added:** a guided first track for new users. It has five short, skippable steps: place a few pieces, sculpt one
  handle, close the loop, read the colours, export.
  - The guide only shows the moves; the user makes them.
  - It opens once, on first run, which it remembers in the app's own data folder, and "Show the guide" brings it back.
  - It sets the starting font and tempo, each with its source, and points at the starter phrases.
- **Fixed (proposed to A, one line):** in the app's real window, placing any word failed with "Illegal invocation":
  the shell called the browser's setTimeout as a method of another object. It has been in the app since `59ff906`, and
  the headless tests could not see it.
