# p-d591-export-banner-A, 2026-10-31: one export banner for every export route

Seat A. Branch d591-a off land-0434 (a93ae51), worktree C:\Users\nname\Downloads\t180-wt-a591. One commit, ac8d40e, not pushed. Tier CHECK IT.

S = C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-3d57124e\6fe15f0a-634b-4a04-b5de-8bd96b6b5a4f\scratchpad

## 1. What it does

`app/core/exportbanner.js` (new) is one banner. The page makes it once (`#exportbanner`, appended to body) and every route reports to it:

| route | how it reports |
|---|---|
| File ▸ Export | `banner.run('into <dir>')` once a folder is picked. Afterwards it reads the shell's state: a new `lastExport` and no `exportRefusal` means done with the shell's message; anything else means failed with the refusal. A throw also means failed. |
| Export to Assetto Corsa, Test export | `app/install/index.js` takes a `banner` option. It runs when pressed (cleared while the AC folder picker is open), then `done(r.message)` or `fail(r.message)`; an unplanned throw fails it and is thrown on, as before. |
| Export layouts, Export for Blender | Their existing `say(t)` feeds `banner.follow(t)`. "exporting / building / writing…" runs it; then "exported…" means done and any other text means failed. A cancel before the work starts leaves it hidden. |

**What it shows**
- Running: "Exporting… N s", ticking each second, with where it is going under it.
- Done: "Done" in the look's `--accent`, with the route's own result, which says where the track went (the folder, or t180b_<name> and its AC path).
- Failed: "Export failed" in `--bad-text`, with the reason.

**Look and placement**
- The look's own menu panel (`more-menu` class), as the hover card has.
- Fixed under the values band and centred on the window, as the band is. My first placement at top 52 px covered the band; the shots showed it, and it moved to 118 px.

**Focus and closing**
- It never takes focus: role status, aria-live polite, nothing focusable, no `.focus()` call.
- A finished banner stays until it is clicked or the next action: a pointer press or key anywhere (capture listeners, armed only after the result), or the next export.

**The existing plumbing is kept.** The status line still gets every text it got before, and the install note is unchanged. The install's own result bar in the banner row (`.bar.result`) is gone: its job is now the banner's, so there is one banner, not two.

## 2. Tests (CHECK IT: the touched files' tests, once)

Every test file that loads `install/index.js` ran, plus the new file and the probe. Not the tests that load index.html.

| run | files | result | checked |
|---|---|---|---|
| 1 | exportbanner, share-install, texture-page | 40 / 40 pass | `S\d584\t591.tap` |
| 2, after the placement fix | the same three | 40 / 40 pass | `S\d584\t591b.tap` |
| 3 | core-eqonly, export-isolated, shell-dist | 41 / 41 pass | `S\d584\t591c.tap` |

**New**
- `app/test/exportbanner.test.js`, 3 rows, on the fake DOM: the count, done and fail with no ticker left running; follow's rules; closing by a click, a press or a key, never while it runs.
- texture-page **row 12**, the contrast probe: in all six looks the banner's texts read 4.5:1 or more on their own pixels, running, done and failed. The failed state comes through File ▸ Export itself: headless there is no native side, so the export fails at its first call and the real handler fills the banner. Running and done come from the module itself on the same box.
  - checked: `S\d584\t591b.tap`, row 12's diagnostic. The lowest is aqua failed 5.15 (its head); every look's text line is 11.16 or more.

**Amended, by name:** share-install's D464 row. The whole result was a `.bar.result` in the banner row with a ✕. It is now in the export banner: Exporting… while it runs, Done and the whole note's text after, no second bar in the row, and a click clears it. The comment says AMENDED and why.

**Mutation harnesses:** none was run, per the tier.
- checked: `S\d584\anchors591.js` → no harness holds an anchor on app/index.html or app/install/index.js.
- The 2 hits it prints are `'utf8'` misread off readFileSync lines, the same on the base.

## 3. Screenshots, headless (zz-headless-test, BelowNormal, 1400×860)

S\d591shots\ holds 18 PNGs, `<look>-<state>.png` for looks sigil, aqua, skyline, glass, aurora and skyline-night, and states running, done and failed. They are from run 2, saved by row 12 with T180_SHOTS set. I looked at aurora running, skyline done and aqua failed (from run 1, at the old placement), then glass done and sigil running after the move.

**Mute:** row 12 runs inside texture-page's existing launcher (`soundrender.js` launchChrome), as rows 1–11 do. I did not add `--mute-audio` to it, and the export makes no sound.

## 4. Built app

No built-app run: the packet allows one only on a hidden desktop, and the headless page drives the real File ▸ Export handler. No Tauri window was opened.

## 5. CORRECTION, mine: the runs overlapped his Assetto Corsa

- checked: `Get-Process acs` → acs.exe pid 54168 started at 16:57:01 local. My tasklist check at 16:51 found none, and I did not check again before runs 2 and 3.
- checked: the file times → run 2's shots span 17:02:36–17:03:02 and its TAP ended 17:03:03; run 3 ended 17:03:50.
- So about 6.5 minutes of headless Chrome at BelowNormal, and 1 minute of node tests, ran while acs.exe was up.
- The packet's "never while acs.exe is up" sits on the built-app sentence, and no built app ran. D589's packet put it on everything, though, and I should have checked again before each run.
- Nothing has run since; leftovers is clean (§6).

## 6. Leftovers

leftovers.js at 23:04:25Z, as it prints:
```
leftovers · 2026-10-31T23:04:25.403Z · read-only
tab proxies          UNCALIBRATED (read 0, and the control made none (0 → 0 → 0))
worktrees            Desktop/lighthouse 38 linked + main
strays               not scanned (give --strays <folder> --prefix <name>-)
fake roots           0
orphan browsers      0 headless roots whose parent is gone
our long-running     0 (older than 120 min, infrastructure left out)
```
TabProxyWindows: 0 before (22:51:31Z) and 0 after.

## 7. Commit and map

- ac8d40e "Every export shows one banner while it runs and when it ends, saying Done and where the track went, or why it failed". 8 files: app/core/exportbanner.js, app/test/exportbanner.test.js, app/index.html, app/install/index.js, app/test/share-install.test.js, app/test/texture-page.test.js, CHANGELOG.md (one Added line), MAP.md (the app/core row names exportbanner.js).
- t180-wt-a591 stays until the landing takes d591-a.

## 8. For the landing

- Expect CHANGELOG.md to conflict with any branch that adds under Unreleased ▸ Added.
- Index.html's CSS and the export handler are the only shared surfaces.
