# t180 landing-1126 on D: the drag-frame amendment is green alone, the installer is built from 62f5b95, and it is installed (pane P, 2026-11-26)

Seat: pane P (sibling-372c8abc). This answers the chair's packet of 2026-11-26T18:02:52Z with its addendum of 18:51:33Z, E's fix of 19:20Z, and the librarian's
ruling of 20:06:12Z on drag-frame (ledger D677). Tier: PROVE IT. It continues `p-d677-landing-1126-P_2026-11-26.md`, which has the full suite on ceb21f5, its
9 reds, the bisect and E's merge. Scratch (S): this seat's session scratchpad, folder `d681`. Worktree `t180-wt-p-1126`, beside the builder checkout in Downloads.

## 0. The answer first

- **drag-frame, run alone at the amendment (1dfca3d): 9/9 green.** Rows 1–6 and 8 find their handles. Every frame budget holds, with margin (§1).
- **The landing tip is `62f5b95`, local only:**
  - ceb21f5 (landing-1126);
  - plus E's File/Edit fix (475bd57);
  - plus the drag-frame amendment.
- **Built:**
  - exe sha256 `bb5d16d8722081759c666fdbfc05d3d0e4f7ae14883fe1d75d7550d9eaa67d17`;
  - installer sha256 `0087d15ea7345501e5ac155a5a2bd8ebeec4e991385611d28c0d9723fbadeae9`.
- **Installed on D:**
  - installed exe sha256 `3d6b3faafb7e921033057058289bf1e39a0208c67591d82f1cea33558bde0dbd` (the built exe plus the installer's 3-byte stamp; the stamped compare is equal);
  - the old exe was `ecdd721b26e57da7fab19f0bca7fa7a23bc1af380d162394b33d1c2263b2fa5e` (the cfa7ad9 build). It is backed up and byte-checked (§4).
- **Pictures for his eye: 12 PNGs, uncommitted,** in `G:\consonance-scratch\p-gate\eye-1126\` (§3).
- **Not done:** no push of landing-1126, no merge to the builder's main, no release. Nothing was launched.

## 1. The amendment, by name, and why it is a changed rule and not a weakened test

**What changed.**
- `app/test/drag-frame.test.js`, commit **1dfca3d**, "drag-frame: find the handles through the page's own list, not a fixed colour". 1 file, +10 −16.
- `findHandle` is removed. It scanned the `#stage` canvases for a fixed colour: turn `[185, 104, 255]`, length white, within 14 per channel.
- Every drag now takes its handle from the page's own `t180:handles-request` list: `turnDeg` for a turn, `length` for a stretch, and the rightmost turn handle when the piece is unplaced. The same file already used that list for placed pieces.
- The comment that says so starts at `drag-frame.test.js:68` ("AMENDED (pane P, D677, 2026-11-26, the librarian's ruling)").

**Why it is a changed rule.**
- The rule the old lookup encoded was "the turn handle is violet and the length handle white, in every look".
- L244 (c9fe4f1) replaced that rule at his word, "yes handle colors per theme". Every look now has its own `--mark-turn` and `--mark-length` (`p-d677-landing-1126-P` §2).
- The bisect showed the colour lookup was the whole failure:
  - c9fe4f1: pass 2, fail 7;
  - its parent: the handles were found.

**What was kept, so the test is no weaker:**
- Every frame budget, unchanged: 6.0 ms p95 at 165 Hz; 6.9 ms at 144 Hz; 13.4 ms for row 6; 40 ms for row 4.
- The axis logic, unchanged.
- The assert that "the drag moved nothing … the handle was not held". A handle found in the list but not under the pointer still fails there.
- A missing handle still fails: the assert now reads "the turn/length handle is in the page's list of handles (t180:handles-request)".

**The run alone.**
- The command: `node --test --test-reporter=tap app\test\drag-frame.test.js` at 1dfca3d (S/dragframe.cmd).
- It ran under `heavy-run --run --exclusive --priority belownormal`, a hold named as a timing session. The hold was written 21:50:58Z; the run started when E's and B's slots emptied.
- checked: S/dragframe-1dfca3d.tap → **tests 9, pass 9, fail 0**, exit 0, 167 s.
- The measured p95 values, from its diagnostics:

| row | bar | measured |
|---|---|---|
| 1, a 1,000 m turn, every look | 6.0 ms | 2.5–2.8 ms (aqua 2.7, skyline 2.5, glass 2.6, aurora 2.6, sigil 2.8) |
| 2, a 2,000 m turn, every look | 6.0 ms | 2.9–3.6 ms |
| 3, stretch 1,000 / 2,000 m | 6.0 ms | 2.6 / 3.4 ms |
| 4, a 20,000 m turn | < 40 ms, ≥ 20 rebuilds/s | 8 ms, 34.3/s |
| 5, release | exact road | 97 stations held, 1,001 after |
| 6, bank + cup + edge stretched | 13.4 ms | 7.2 ms |
| 7, turned after a placed piece | 6.9 ms | 3.8 ms |
| 8, stretched on an empty track | 6.9 ms, ≤ 120 work frames/s | 5.6 ms, 53.7/s |
| 9, after 21 km, rolling vs flat | ≤ 2 × | 1.63 × |

## 2. The merge and the build

**The merge.**
- In `t180-wt-p-1126`, on the local branch `p-landing-1126` (475bd57): `git merge --no-ff p-dragframe-handles` → **62f5b95**.
- checked: `git diff-tree --cc 62f5b95` → 0 `++` lines.
- checked: `git diff --stat 475bd57 62f5b95` → only `app/test/drag-frame.test.js`.

**The build.**
- The command: `src-tauri/release.cjs` (S/build.js), under the heavy-run lock (slot 1), BelowNormal, hidden, behind `--wait-game` ("no game of his running").
- The script refuses any head but 62f5b95, and any tree with a content change.
- checked: S/build-run.log → `release.cjs exit 0, 110 s`.
- release.cjs's private-path scan, from S/build.log: "t180-track-builder.exe: 16174080 bytes, no private paths"; "T-180 Track Builder_0.4.40_x64-setup.exe: 8297703 bytes, no private paths".
- The outputs: `G:\Consonance-tools\cargo-p641\release\t180-track-builder.exe` (16,174,080 B) and `…\release\bundle\nsis\T-180 Track Builder_0.4.40_x64-setup.exe` (8,297,703 B). Their hashes are in §0.
- The bundled frontend is the tip's. checked: four files in `src-tauri/dist/app` hash equal to HEAD's (index.html, reference/panel.js, leftcolumn.js, core/markwindow.js).
- `src-tauri/Cargo.toml`'s line endings were restored afterwards (`git checkout --`). The tree is clean.
- The version stays **0.4.40**. Nothing was tagged.

## 3. The pictures for his eye (uncommitted)

`G:\consonance-scratch\p-gate\eye-1126\`, from S/eye.js on the worktree at 62f5b95: headless Chrome, title `zz-headless-test`, 1500×900. The page is served with a
stand-in for the app's reference commands: a made-up 1,257 m ring named "reference track 1". No file from AC or from any other author was read.
- TabProxyWindow: 0 before and 0 after, on both runs.
- `eye_log.json`: `pageErrors: []` in both looks.

| file (per look: `glass_`, `skyline_`) | what it shows |
|---|---|
| `1_column_shown` | the left column shown (pointer over it; opacity 1) |
| `2_column_cleared` | the left column cleared (pointer away; opacity 0, `cleared: true`) |
| `3_reference_road_panel` | the reference shown as Road ("600 triangles of road from its kn5 …"), its panel open |
| `4_reference_road_overhead` | the same reference in the Overhead view |
| `5_label_window_hovered`, `5_label_window_crop` | the length handle hovered on a 1,000 m piece: the label window "length 1000.00 m" (glass radius 0, skyline 2 px) |

**Correction, mine.** The first set showed the first-run guide card ("Sculpt the road, 2 of 6"). I changed eye.js to dismiss it as markwindow-page.test.js does,
and took the set again; its log now records `guideLeft: false`.

**Seen, and not explained:** a small card headed "Rea…" sits half behind the reference panel, top right, in shots 3–5 of both looks. I did not identify it. It is
the page's own; nothing in eye.js opens it.

## 4. The backup and the install

**My backup, made first.**
- checked: `sha256sum` of the installed exe → `ecdd721b…2fa5e`, the cfa7ad9 build installed on 11-25. That is the one expected.
- It was copied to `%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe.before-d681-cfa7ad9`; the script refuses if that name already exists.
- checked: `cmp` → identical; sha256 `ecdd721b…2fa5e`; 15,929,344 B.

**The install.**
- His builder and his game were not running (`Get-Process t180-track-builder,acs` → none), checked in the same command as the install.
- `scripts/install-local.ps1 -Tag d681i-62f5b95 -Installer <the setup above> -Built <the exe above> -WaitSec 5` → **exit 0**.
- The script made its own backup too: `t180-track-builder.exe.before-d681i-62f5b95`, sha256 `ECDD721B…2FA5E`. Its name follows the script's rule of naming a backup after what replaces it.
- Its output:
  - "installed: … sha256 3D6B3FAA…DE0DBD, ProductVersion 0.4.40, 16174080 B";
  - "stamped compare: equal (the built exe with UNK -> NSS at byte 13673320 is the installed exe)";
  - builder processes before 0, after 0.
- Nothing was launched.

**How to undo**, with the builder closed. Copy the backup over the installed exe:

    copy /Y "%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe.before-d681-cfa7ad9" "%LOCALAPPDATA%\T-180 Track Builder\t180-track-builder.exe"

Then check its sha256 is `ecdd721b…2fa5e`. Either backup will do; they are byte-equal.

## 5. Open, for the next steps

- **landing-1126 is not pushed.** Its tip 62f5b95 lives on the local branch `p-landing-1126` in `t180-wt-p-1126`, and `p-dragframe-handles` (1dfca3d) is kept there too. It waits for the librarian's word.
- **E's named limit, carried:** "a 61-character name of wide letters can still overrun at 900 px" (`p-l255-fix-E_2026-11-26.md`).
- **Not re-run:** the whole suite on 62f5b95. The merge since ceb21f5 changes three test files and `app/index.html`, and their tests were run:
  - texture-page 19/19 and menubar-page 22/22 at 475bd57;
  - drag-frame 9/9 at 1dfca3d.

  The two timing reds of the ceb21f5 run passed alone (`p-d677-landing-1126-P` §1).

BASE: the builder checkout (Downloads\t180-fresh) ceb21f5
SOURCES: S/dragframe-1dfca3d.tap; S/dragframe-run.txt; git merge / diff-tree --cc / diff --stat in t180-wt-p-1126; git show --stat 1dfca3d; S/build-run.log; S/build.log; src-tauri/dist vs HEAD hashes; heavy-run.js --status; tasklist; G:\consonance-scratch\p-gate\eye-1126\{eye-out.txt, eye_log.json, tabproxy-before.txt, tabproxy-after.txt, *.png}; sha256sum and cmp of the installed exe and its backup; install-local.ps1 output
NEXT: librarian shows him the pictures and says when landing-1126 (62f5b95) is to be pushed; I go on now to the two room laps (shelf-recursion maxBuffer, the CH-4 freeze) and then the lighthouse landing.
