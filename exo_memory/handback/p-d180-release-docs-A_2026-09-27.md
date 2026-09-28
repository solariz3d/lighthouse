# D180 A: the release docs, and a first-time run of the INSTALLED app

Repo `C:\Users\nname\Desktop\t180-track-builder`. Nothing is committed. **No AC launch; the see-it button stayed
disabled throughout** (read back in every session). Label rule: **checked** means a command is given; **inferred** means
reasoned, not measured.

## 0. A correction to my D178 hand-back, first

D178 §4 said the installed app "renders fully", and it did, but I only LOOKED at it. **Placing a word did not work in the
real window**; E found it (`p-d177-onboarding-E` §0).
- The shell's default timers were `{ setTimeout, clearTimeout }`, called as methods of another object. WebView2 refuses
  that ("Illegal invocation"), Node allows it, so every headless test passed.
- It has been on main since `59ff906`, so **the 0.2.0 installer I built in D178 could not place a word.**
- Applied here (§2), red first with E's own test. This lap's rebuilt installer carries the fix, and the first-time run
  below placed words with it.

## 1. The release docs

**CHANGELOG.md**, built from HEAD's (`e6b4362`), never from this checkout's working copy. The working copy was STALE:
it was 266 lines against HEAD's 360. B lands from a separate worktree, which moves `main` without rewriting these files,
so they show as "modified" with B's entries missing. Building on it would have erased them. So:
`git show HEAD:CHANGELOG.md` → `scratchpad/d180/make_changelog.js` → `CHANGELOG.md`.
- `[Unreleased]` is now empty, above **`[0.2.0] - 2026-09-27`**, with a two-line summary of the release. It adds a
  Semantic Versioning line and says 0.1.0 was only a version string, never released.
- **Room vocabulary removed:** the seven "(packet A/C/E)" and the "found by B's read of T1, fixed by A".
  `grep -n -i -E "packet|\bpane|hand-?back|librarian|seat\b|\bchair\b|\bD1[0-9]{2}\b" CHANGELOG.md` → none. The remaining
  "panel" and "lap" hits are the app's own UI panels and racing laps.
- **Lines 0.2.0 makes untrue, corrected:** the phrasebook "Not yet in the palette"; the texture panel and the texture
  maker "not yet mounted in the page"; the texture tools "not yet used by … the preview or the export".
- **Added for the work landing with 0.2.0** that HEAD does not carry yet (each from its author's own proposed line,
  reworded plainly):
  - C's AC-look preview;
  - E's guided first track;
  - the texture export (§3);
  - the timers fix;
  - my JUMP_PAST_VERTICAL fix and the refused edit returning null (D179);
  - E's jump-default fix (the ramp sized for the design speed);
  - the success message no longer red (§3).
- **B's bench figures are NOT added:** B's D178 read holds them back until one bench runs on the landed tree. When B's
  read lands, its entries merge into this file without duplicates. Every entry above is worded so it can be matched
  one to one.
- The diff against HEAD is only these changes: 45 insertions, 16 deletions (`git diff --stat HEAD -- CHANGELOG.md`).

**README.md**, E's version: the working copy equals HEAD (`git diff --stat HEAD -- README.md` was empty before my
edits). Every row of E's is kept. The changes (`git diff HEAD -- README.md`):
- a new **Install** section: the installer's name, per-user install, not code-signed (SmartScreen), how to build it,
  where the user's data lives, and that uninstalling leaves it;
- **Status:** "0.2.0, and it is the track only". "How to read the table" now says it was judged against the 0.2.0 code
  and the installed app;
- **§1, two new rows:** the guided first track (tested, `app/test/onboarding.test.js`), and the app working in its real
  window (tested, `app/test/timers-regression.test.js`);
- **§5 row 2**, AC's shader set: not yet → **tested** (C's `app/preview/acshaders.js`, `aclook.js`,
  `app/test/aclook.test.js`), naming C's own caveat that the `ksMultilayer` blend is inferred;
- **§5b:**
  - the slots row names the textures panel;
  - a new row: "drawn by the preview and written by the export alike" (tested, `test/export-textures.test.js`), with its
    limit stated: only the FLOOR slot reaches the road mesh; walls, lines, kerbs and edge glow are stored but not drawn;
  - "Materials mapped onto AC's shaders" stays not yet: the preview has all three, the export writes `ksPerPixel` only;
- **What's here:** `texmaker/`, `src-tauri/` (with `release.cjs`), `docs/RELEASE.md`.

## 2. E's two diffs, applied (they were routed to me)

- **The timers fix** (`app/shell.js createShell`), with **E's regression test** copied unchanged into
  `app/test/timers-regression.test.js`. **Red first:** 0/1 on the current shell, exactly as E measured; 1/1 after.
- **The guide's mount point** (`app/index.html`): E's `mount.diff` applied with `git apply` (it checked clean).
- **Checked:** `node --test --test-concurrency=4 app/test/shell*.test.js app/test/palette*.test.js
  app/test/onboarding.test.js app/test/timers-regression.test.js app/test/share-install.test.js` → 106/106.

## 3. FRESH EYES: the installed app, used as a first-time user

**Setup.** The keeper's app data was renamed aside, so the app started as it would for a new user:
`%APPDATA%` and `%LOCALAPPDATA%\com.solariz3d.t180-track-builder` became `….aside-d180`. The before-hashes are in
`scratchpad/d180/before-roaming.txt` (1 file) and `before-local.txt` (205 files). The installer went into
`scratchpad/d180/throwaway/app` (`/S /D=`). The DevTools port 9471 was checked free before each start, and its owner was
checked to descend from the started pid. Screenshots were PrintWindow of the app's own window only
(`scratchpad/d180/shot.ps1`), in `scratchpad/d180/shots/`.

**Session 1**, the D178 installer plus the timers fix (`fresh_eyes.js`, `fresh_eyes.log`, shots `01`–`07`):
- the guide showed step 1;
- words placed;
- **after the four starter phrases, 2 reds:** `stacked-within-2m` at s 476–521 m and s 2513–2559 m.
  Reproduced headless, one phrase at a time: sakura flow gives 888 m and 0 reds; the bowl hairpin 2055 m and 0; the S
  2431 m and 0; the **spiral climb 4137 m and 2**. The spiral's loop passes within 2 m of the earlier road;
- close loop: "loop closed with 3 words (13684 m)", **shown in red as an alert** (trip, fixed in §2/CHANGELOG);
- 0 page errors.

**Sessions 2–3:** tried to answer the Export dialog from the page. The `__TAURI__.core.invoke` stub and the
`__TAURI_INTERNALS__` stub both failed: the object is frozen, and the dialog plugin does not route through the stub. So the
export did not run.
- My error in session 2: a 110 s timeout killed node mid-wait and left an orphan msedgewebview2 (pid 18064, port 9471).
  I checked that its command line was ours, then killed it.

**Session 4, the FINAL installer.** It is 2,334,339 B, sha256 `18939afb670f71f676b3b0425a1fd9493d194c942455339b98f0836dfb83b4f0`;
the exe is 9,837,568 B; `release.cjs` reported "no private paths". Script `fresh_eyes4.js`, output `s4.out`, shots `31`–`34`:
- the textures panel is on the page;
- close loop: "loop closed with 3 words (765 m), worst load on the connector 6.9 g", with role `status`, colour
  `rgb(230, 233, 239)`, **not red**;
- **Export:** the dialog opened. C's `scripts/prove_render_dialog.ps1` refused: "no Folder box exposed in the dialog;
  nothing typed, nothing pressed". **The Export button was not run end to end in the installed window**; it is checked
  headless (`app/test/export.test.js`);
- **Install to AC**, into a stand-in AC folder `scratchpad/d180/fake-ac` (set through `set_ac_root`): the message was
  `installed "untitled" as t180b_untitled in \\?\C:\…\fake-ac\content\tracks (…)`, and the fake AC's content/tracks
  holds `t180b_untitled`;
- 0 page errors; see-it disabled `true`; the killed tree was not running afterwards.

**The first-time trips, and where each went:**

| trip | fixed or routed |
|---|---|
| A success message ("loop closed…") shown in red, as an alert | fixed, mine: `messageKind` (§4 K1–K4) |
| A textured floor showed in the preview and was missing from the kn5 | fixed, mine: `withTextureSet` (`test/export-textures.test.js`) |
| **A track saved as "Monza" still exported and installed as `t180b_untitled`**: `save` names the file, and the folder came from the doc's own name ("untitled", `app/shell.js` createShell) | fixed, mine: `shell.exportDoc()` used by Export and Install; red first, 3 of 20 red → 20/20 |
| An unnamed track installs as `t180b_untitled`, **and a second unnamed install replaces the first** without a word | fixed, mine: `install.js` refuses an empty or "untitled" name and asks for one |
| The install message and the remembered AC folder read `\\?\C:\…` (`fs::canonicalize`) | written, **NOT COMPILED, NOT TESTED**: `ac.rs plain_path` (§5) |
| The Install to AC tooltip read "content<TAB>racks" (a `\t` in the HTML attribute) | fixed, mine: a test that no tooltip carries a tab or a line break |
| The four starter phrases placed in the guide's order give 2 reds (the spiral climb stacks on earlier road) | routed to E (phrasebook and guide) |
| The red list shows internal names: `stacked-within-2m … (ARCHITECTURE.md:85)` | routed to E |
| `prove_render_dialog.ps1` finds no Folder box in this dialog | routed to C |

## 4. Mutants

`node scratchpad/d180/d180_mutants.js` (its list: `d180_list.js`), on copies, `--test-concurrency=4`:
- **First run: 11 listed · 11 applied · 9 caught · 2 survived · 0 NOT APPLIED · 0 NO RESULT · live files unchanged.**
- The survivors got a test each: W2 (every set material appended, used or not) and W5 (Install to AC drops the set).
  **Re-run of W2 and W5: 2 applied · 2 caught. Total: 11 applied · 11 caught.**
- **The second set, for the name, tooltip and install fixes (`node d180_mutants.js '^N'`):** N1 an unnamed track is
  installed; N2 `exportDoc` ignores the saved name; N3 the install panel wires the doc instead of the saved name; N4 the
  tooltip's tab comes back; N5 Export ignores the saved name.
  - First run: **5 listed · 4 applied · 3 caught · 1 survived (N3) · 1 NOT APPLIED (N4)**.
  - N4 was MY harness error: its source string was a tab where it needed a backslash-t, so it matched nothing. Fixed in
    the list, re-run: caught.
  - N3 survived because no test mounted the install panel. I added one that clicks the real "Install to AC" button in
    the fake DOM after a save as "Monza"; re-run: caught.
  - **Total, second set: 5 applied · 5 caught.**
- Covered: the timers back as methods; every message a refusal; a stale "ok" colouring a refusal; the palette alerting
  on every message; close-the-loop reported as a refusal; a made floor not exported; the export ignoring the set; the
  app exporter and the installer dropping it; every cell wearing w1's floor.

## 5. Tests

- `node --test --test-concurrency=4 app/test/*.test.js test/export-textures.test.js test/texture*.test.js
  test/export_words.test.js` → **428 tests · 427 pass · 0 fail · 1 todo** (C's "list" todo in `aclook.test.js`). That
  was before the two survivor tests.
- After them: `test/export-textures.test.js` and `app/test/share-install.test.js` → 11/11.

- **The name, install and tooltip fixes, red first:** `node --test --test-concurrency=4 app/test/share-install.test.js
  app/test/export.test.js` → 16 pass · 3 fail before the fix (the export wrote `t180b_untitled` after a save as
  "Monza"; the unnamed install went through; `exportDoc` did not exist). After: 20/20. The tooltip test was red 0/1,
  then green.
- **Last run, after every change:** `node --test --test-concurrency=4 app/test/share-install.test.js
  app/test/export.test.js app/test/palette-dom.test.js app/test/timers-regression.test.js app/test/shell*.test.js
  test/export-textures.test.js` → **90 tests · 90 pass · 0 fail**.
- **Rust, `ac.rs`: NOT RUN.** The red run (`scratchpad/d172/locked_cargo.js`) queued behind C's lock, then E's, and
  was **stopped by the system for low memory** while it waited. The notice said not to start it again unasked, so I
  stopped the waiter, which had survived its wrapper (pid 12996, mine by its command line). The test
  `the_remembered_ac_folder_is_the_path_a_user_would_type_with_no_verbatim_prefix` and `plain_path` are written but
  **neither compiled nor run**, so this fix has **no red and no green**. `recall_ac_root` also passes a folder
  remembered before the fix through `plain_path`.
- **Full suite: NOT RUN** this lap, for the same memory reason, and the lock was held by other seats throughout.

## 6. Routed

Routed through this hand-back (the librarian places them; I have not written to E's or C's files):
- **To E, the starter phrases:** all four placed one after another (sakura flow → bowl hairpin → S → spiral climb)
  give **2 stacked reds**: `stacked-within-2m` at s 476–521 m and s 2513–2559 m, after the spiral climb only. Headless
  reproduction numbers are in §3. Whether the guide leads a user into exactly this sequence I did not check.
- **To E, the red list's words:** it shows `stacked-within-2m … (ARCHITECTURE.md:85)`, an internal rule name and a doc
  line. A first-time user does not know either.
- **To C, the dialog script:** `scripts/prove_render_dialog.ps1 -ProcId <pid> -Dir <folder>` refused on the installed
  0.2.0 app's Export dialog: "no Folder box exposed in the dialog; nothing typed, nothing pressed". The dialog's UI
  Automation tree was the list view only ("Name | Date modified | Type | Size", repeated). So the Export button has no
  automated end-to-end check in the installed window.
- **To C, disclosed:** C's D179 window runs (lock 03:48Z and 04:01Z) ran while the keeper's roaming app data was renamed
  aside for this run, so they started against MY fresh folder (it held a stand-in `ac_root.txt`). C's own autosave
  guard put that folder back as it found it (checked: its newest file stayed at my 21:53 write). Nothing of the
  keeper's was touched, but C's runs were not against the keeper's usual app data.

## 7. What is NOT verified

- **The `\\?\` fix in `src-tauri/src/ac.rs`:** not compiled, not tested (§5). It needs one cargo run under the lock
  when memory allows: `node scratchpad/d172/locked_cargo.js`. If it does not compile, that is on me.
- **The full suite** on this tree (§5).
- **The installer is NOT rebuilt with this lap's last fixes** (the saved name, the unnamed refusal, the tooltip,
  `plain_path`). The 0.2.0 installer I checked (sha256 `18939afb…`) still has all four trips. Rebuilding needs cargo:
  `node src-tauri/release.cjs` under the lock.
- **The Export button in the installed window** was never run end to end (§3, routed to C). Its path is tested headless.
- **The README and CHANGELOG are not re-read by anyone but me.** The CHANGELOG's three new Fixed entries describe
  fixes that ship only after a rebuild.
- **Clean-up, checked:**
  - `uninstall.exe /S` exited 0; the install folder is empty; no uninstall registry entry and no `*t180*.lnk` remain;
  - the fresh session folders were deleted only after both `.aside-d180` folders were confirmed present;
  - the keeper's folders were renamed back and re-hashed against the before-lists: **roaming 1/1, local 205/205,
    0 missing, 0 extra, 0 changed**;
  - `throwaway/` and `fake-ac/` were removed;
  - 0 t180 processes and nothing on port 9471 afterwards.
- **Not attributable:** before the uninstall, one t180 process was running that I could not tie to a session of mine;
  it was gone after the uninstall.
- **Privacy gate** over every changed file: no personal path, email, key, private-project word or room word. Three hits
  on "nname" were inside "u*nname*d".

## 8. Correction, 2026-09-27 22:45 (added during D181)

- **§1 listed E's jump-default fix among the work landing with 0.2.0, and I wrote its CHANGELOG line, but the code
  never had it.** I took the line from E's proposed CHANGELOG entry and did not check that E's diff was applied. B found
  it missing. It is applied now, in D181 (`p-d181-installer-A_2026-09-27.md` §0): red 1/8 → green, E's diff unchanged.
- **§3's `ac.rs` row (NOT COMPILED, NOT TESTED)** is taken up in D181 §1.
- **Placeholders:** `grep -nE "\b[A-Z][A-Z_]{4,}\b"` over this file finds no placeholder left; every hit is a word in
  running text (INSTALLED, CHANGELOG, NOT COMPILED, JUMP_PAST_VERTICAL…). SESSIONS, FULLSUITE, ROUTED and NOTVERIFIED were
  filled at 22:2x, before the call to the librarian.
