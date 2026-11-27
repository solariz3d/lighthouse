# L262, pane P (L): the test install on L of tonight's two builder branches. Merged, tier green, built and pushed; the install is HELD on my own registered condition, for the librarian's word

Seat: pane P (L, mount 6e6e002c). This answers the chair's L262 (sent 2026-11-27T08:47:06Z) and packet `exo_memory/loop/packet_t180_test_install_on_L_2026-11-27.md` (room d6ea30ce).
Scratch: this seat's session scratchpad, folder `l262` (`joinmap.js`, `tset.js`, `tset.json`).
This file has two halves. §A, the run after go, is directly below. The preparation (§0–§4) follows it unchanged.

## §A. After go: the answer first

- **The ±720 completion is NOT in this build.** It was not committed on `l-bankcarry-a` when the merge started (09:01:41Z), so the install goes without it. Per the packet, the handle then stops at two full turns (E's read). That is not a regression.
- **The tips at the merge's start:** `l-bankcarry-a` **7b3926e**, `d677-right-width-b` **e4e7ecc**. These are the commits the librarian named at 02:54.
- **Merged** as `landing-1127-l262` **537a0c9** on f3cd425. **Tier green**, all 24 files. **Built.** **Pushed** (three branches, no main), and read back.
- **Not installed: HELD.** My §4 condition fired by its own words; see §5.6. The installed exe is still f3cd425's, 2820e5f8…7576. The build is ready, and the install takes about a minute after the word.
- **The whole suite** is running in the background on 537a0c9. It is reported when it ends.


## 0. The answer first (preparation)

- **The librarian's merge-tree check is confirmed** on the pair it read (7b3926e + origin e41acb1): `CHANGELOG.md`, `app/core/coreshell.js` and `app/core/panel.js` merge by themselves, and `MAP.md` conflicts.
- **One addition, on the current local tip of B (e4e7ecc):** a fifth file both branches changed, `app/test/core-xsec-mutation.test.js`, also merges by itself. e4e7ecc is the commit where B's suite ran, and it is ahead of origin. This is not a refusal.
- **The MAP.md conflict is one line,** the `app/core/panel.js` entry, which both branches edited. Each edit is a pure insertion, at a different place in the line. I joined them into one line that keeps both, and a script checks it.
- **Touched set:** all 7 of A's rows, and 9 of B's 11, execute a code file the other branch changed. The two that don't are B's `test/core_extend.test.js` and `test/core_xsec.test.js`. The rule is in §3.
- Nothing was built, installed or pushed. The gate holds until the librarian's go.

## 1. The tips used (from the branch refs, not from A's or B's worktrees)

- checked: `git fetch origin`, then `git rev-parse` gave:
  - `l-bankcarry-a` local **7b3926e** (origin 2067c88): 2067c88, 0023853, 7b3926e on f3cd425;
  - `d677-right-width-b` local **e4e7ecc** (origin e41acb1): e41acb1, e4e7ecc;
  - `origin/landing-1126-batch` f3cd425. There is no local branch of that name.
- checked: `git merge-base --is-ancestor f3cd425 <tip>` → yes for both, and `git merge-base 7b3926e e4e7ecc` → f3cd425.
- A's ±720 completion is not in 7b3926e. inferred: A's tip moves when it lands (the packet says so), so §2 and §3 are redone on the final tips.

## 2. The trial merge

My worktree is `C:\Consonance\t180-wt-p-l262`, detached at f3cd425. I keep it for after go.

| step | result (checked) |
|---|---|
| `git merge-tree --write-tree --name-only --messages 7b3926e e41acb1` (the librarian's pair) | exit 1. Auto-merging CHANGELOG.md, MAP.md, app/core/coreshell.js, app/core/panel.js; **CONFLICT (content) MAP.md**, the only conflict |
| the same on 7b3926e + e4e7ecc (the current tips) | exit 1. The same, plus "Auto-merging app/test/core-xsec-mutation.test.js"; MAP.md is still the only conflict (tree f69c5a64) |
| `git merge --no-ff 7b3926e` on f3cd425 | 395cbf0, clean |
| `git merge --no-ff e4e7ecc` on that | CONFLICT (content) in MAP.md only; the other four shared files auto-merged |
| the MAP.md resolution (`joinmap.js`, which refuses unless the one conflict is two pure insertions into the base line at different places) | B inserts at char 77 of the base line ("right width m" (`widthR`) … D677 (b)); A inserts at char 198 (a typed bank … `headTurns`, `inHeadTurn`, D677). Joined line 2,831 chars; both texts present; CRLF kept |
| committed, detached and on no branch, as **1d4daba** (trial only, not pushed) | its tree differs from merge-tree's f69c5a64 only in `MAP.md`; MAP.md against B's tip is +1/−1 (A's insertion), and against A's tip +5/−5 (B's five lines); one panel.js entry; 0 conflict markers |
| `node --check` of the three auto-merged JS files | ok, ok, ok |

**Where the two sides meet in the shared code** (`git diff -U0` hunk heads):
- `coreshell.js`: A at :53–64 and :914, B at :662. They are apart.
- `panel.js`: the nearest pair is two lines apart. A's :480 is `secThen`, which puts a bank row in the head's own turn. B's :478 is `secUnit`, where `widthR` takes "m". They are separate statements.
  inferred: no overlap in meaning, since `secThen` acts only when `f === 'bank'`. The rows decide it.
- `core-xsec-mutation.test.js`: A at :48, B at :25, both in `MUTATIONS`.

## 3. The touched set

**The rule** (`tset.js`, run on the merged tree):
1. A branch's rows are the test files it added or changed, f3cd425..tip.
2. File X executes file Y when Y is reachable from X by `require()` calls whose argument is a string literal starting `./` or `../`. Paths resolve as Node resolves them, transitively, wherever the call sits.
3. A test file that spawns node and names other `*.test.js` files as literals (the mutation harnesses) also executes those files, transitively. This over-includes by design: a harness counts every file it names.
4. A row is in the touched set when what it executes includes a code file (not a test, not a doc) that the OTHER branch changed.

Code files changed (checked: `git diff --name-only f3cd425 <tip>`):
- A: `app/core/coreshell.js`, `app/core/panel.js`.
- B: `app/core/coreshell.js`, `app/core/panel.js`, `app/core/secondtick.js`, and `src/core/` `adapter.js`, `close.js`, `document.js`, `extend.js`, `piece.js`, `sharp.js`.
- Both: `coreshell.js`, `panel.js`.

**A's rows (7), each executing B's code: all 7 IN.** The hits are of B's 9 code files:
- 9 of 9: `app/test/core-bank-carry.test.js`, `app/test/core-bank-carry-mutation.test.js` (inner: core-bank-carry, core-extra-bank-wind), `app/test/core-extra-bank-wind.test.js`, `app/test/core-pieces-ui.test.js`, `app/test/core-xsec.test.js`, `app/test/core-xsec-mutation.test.js` (inner: core-xsec).
- 7 of 9 (no panel.js, no secondtick.js): `app/test/core-sculpt.test.js`.

**B's rows (11), each executing A's code (coreshell.js, panel.js): 9 IN, 2 out.**
- coreshell.js and panel.js: `app/test/core-right-width-panel.test.js`; `app/test/core-xsec-mutation.test.js`; `test/core_right_width_mutation.test.js` (inner: core_right_width, core-right-width-panel).
- coreshell.js only: `app/test/drag-ghost.test.js`; `test/core_right_width.test.js` (`startLayout`, :16); `test/core_cup_mutation.test.js` (inner: core_cup, core_cup_readers, core_cup_seam); `test/core_xsec_mutation.test.js` (inner: core_xsec, core_xsec_math, validate_xsec, core_xsec_shared).
- panel.js only: `test/core_edgeneg.test.js` (`extendOptions`, :27); `test/core_ramp_mutation.test.js` (13 inner files).
- **out:** `test/core_extend.test.js` and `test/core_xsec.test.js`. checked: their requires are `src/` only, and `src/core` reaches no `app/` file.

**The rule's limits** (checked from the same run):
- Computed `require` paths are not followed. 4 files in the closures have them: `tools/bank-ramp-candidates.cjs` 5, `test/core_fit_banded.test.js` 3, `test/core_joint_c2.test.js` 7, `test/core_xsec_shared.test.js` 4. All 4 sit inside rows already IN, and neither "out" row reaches them. So they cannot change a verdict.
- No row drives a browser page. checked: `grep launchChrome|puppeteer|webSocketDebuggerUrl|index.html` over the 17 distinct row files gives 0, except `core-pieces-ui`, which reads `index.html` as text (:856, :901, :1141).
- One literal does not resolve: `tools/piecewise.cjs:448` requires `./fourier.cjs`, which is not in the tree. checked: `git ls-tree f3cd425 tools/` has no fourier file. It was already there at f3cd425 and sits behind an optional write, so it is not this merge's. A note for whoever owns piecewise.

**For the tier after go** (the packet's "every mutation harness that names a merged file"):
- 14 mutation harnesses name `coreshell.js` or `panel.js`. The match is the literal name, not preceded by a word character, dot or hyphen.
- `app/test/`: core-bank-carry-mutation, core-close-mutation, core-mutation, core-pitgap-mutation, core-xsec-mutation, export-isolated-mutation.
- `test/`: core_chord_mutation, core_cup_mutation, core_early_turn_climb_mutation, core_landing_xsec_mutation, core_ramp_mutation, core_right_width_mutation, core_sharp_mutation, gltf_mutation.
- inferred: this is the costliest part of the tier (`core_xsec_mutation`'s own header says "about twenty minutes"). It runs as one background call under heavy-run, after go.

## 4. Registered before go (so it can fire)

- **Predictions:**
  - the merge on the final tips still conflicts in `MAP.md` alone, and `joinmap.js` still applies;
  - every row of the tier is green with 0 NOT APPLIED;
  - every one of his saved tracks opens and re-saves byte for byte on the merged build;
  - inferred from the packet: none of his tracks today uses a right-side width, so none re-saves as `t180b.core/7`.
- **I stop and say so, installing nothing, if:**
  - any tier row is red, or any mutant is NOT APPLIED;
  - the merge conflicts outside `MAP.md`, or `joinmap.js` refuses;
  - any of his tracks fails to open, or re-saves different;
  - his T-180 app is running (I check, and never close it);
  - a final tip is not the one the go names.
- **Unwelcome outcome, in words that would make it true:** "A's rows go red on the merged tree only." That means the two branches' changes to `panel.js` or `coreshell.js` interact, and green on each branch alone proved nothing about the pair.

## 5. The run after go (checked unless marked; scratch `l262/run/`: `pipeline.json`, `tier-*.tap`, `build262.json`, `bytes.json`)

**heavy-run.** At 08:53Z, B's EXCLUSIVE hold stood (a timing session, since 08:41:47Z), so `--status` exited 1, and `--status && <run>` would have run nothing. I logged `--status` and then started `--run --priority belownormal`, which waits on a hold itself ("While the hold exists every other runner WAITS", `heavy-run.js:80-81`), with its wait raised to 120 min. It got the slot at 09:01:41Z. The build and the suite then went `--status && --run` as written.

**His builder:** not running at 08:53:53Z, at the merge's start (09:01:41Z), in the build wrapper (09:23Z), and again at 09:27Z (`tasklist`).

### 5.1 The merge (`pipeline.js`, one background run)

- The tips were read at 09:01:41.768Z: 7b3926ee… and e4e7eccb…. Both descend from f3cd425.
- `git switch -c landing-1127-l262 f3cd425`.
- `git merge --no-ff 7b3926e` → 1df677c, clean.
- `git merge --no-ff e4e7ecc` → unmerged `MAP.md` only. `joinmap.js` exit 0 (the same two insertions as §2) → 537a0c9.
- 0 conflict markers. `node --check` ok for the 3 JS files both changed.
- The files both branches changed are the five of §2. The touched set, recomputed on these tips, is the same 15 files as §3.

### 5.2 The tier

24 files: the touched set, the two harnesses (`core-bank-carry`, `core_right_width` with its panel row, and their mutation files), and the 14 mutation harnesses of §3. Recomputing found the same 14.

| run | files | result |
|---|---|---|
| plain rows, `--test-concurrency=1` | 9 | tests **155**, pass **155**, fail 0, cancelled 0, 68 s |
| harnesses, `--test-concurrency=2` | 15 | tests **532**, pass **532**, fail 0, cancelled 0, 1,203 s. Mutant rows **applied 498 / caught 498 / NOT APPLIED 0** (498 `ok` rows named mutation/mutant, each "applied, and caught by"; 0 `not ok`; "not applied" appears 0 times) |

- The pipeline stopped itself before the build. It matched the text "NOT TESTED" 38 times. checked: all 38 are in the names of 6 distinct PASSING rows that test the harnesses' own crash handling (e.g. "a crashed inner run reads NOT TESTED, never a verdict"). 0 are on a mutant row, and 0 are outside a row name. My stop rule matched text, not verdicts (Corrections). I built in a second call once I had read that.

### 5.3 The build (`build262.js`, under heavy-run at BelowNormal, 09:23–09:25Z)

- `release.cjs` exit 0 in 98 s; "no private paths" for both files.
- `Cargo.toml` line endings only, put back; the tree is clean.

| output (in `C:\build\lighthouse-target\release\`) | bytes | sha256 |
|---|---|---|
| `t180-track-builder.p-l262-537a0c9.exe` (= the default-named exe at build time) | 16,089,600 | b9eef9b9428b21ec5b133e6b099968a416e63647d2d97a48c87bb22d49da9925 |
| `bundle\nsis\T-180 Track Builder_0.4.40_x64-setup.p-l262-537a0c9.exe` | 8,295,697 | f0e004449dbc86ab0829891f0e993beeef2c2ba75b986e0ebb3d89fb0097a5fc |

- The exe holds `__TAURI_BUNDLE_TYPE_VAR_UNK` once, at byte 13,613,466.

### 5.4 The pushes (the packet's step 1, each its own `git push origin <branch>` through push-gate)

- What origin lacked: `landing-1127-l262` 4 commits (A's 0023853 and 7b3926e, and my two merges); `l-bankcarry-a` 2; `d677-right-width-b` 0 (B had pushed e4e7ecc).
- Their added lines naming the account, a home path, AppData or an email: **0**. His 16 track names (5 characters or more) in the added lines: **0 of 16**.
- The merges' own resolution lines (`git diff-tree --cc`): 1, the joined MAP.md line, which holds code names only (read by eye).
- push-gate: allow ×3 (09:26:09.069Z, 09:26:11.839Z, 09:26:14.135Z). The pushes printed `* [new branch] landing-1127-l262`, `2067c88..7b3926e l-bankcarry-a` and "Everything up-to-date".
- `git ls-remote origin` reads:
  - landing-1127-l262 **537a0c99d79478e774e26766b312b303eac71d25**;
  - l-bankcarry-a **7b3926ee39e7cbf8ca5f590ccb5328c83cbe5ff0**;
  - d677-right-width-b **e4e7eccb541ba7a16247829006b54541ec88d34d**;
  - **main 3b33b38bfd85…, unchanged**;
  - landing-1126-batch f3cd425….
- No tag, no release.

### 5.5 His saved files (the packet's step 5; `bytes.js` → `bytes.json`)

- Copies were taken at 09:24:14Z from his tracks folder (`%APPDATA%\com.solariz3d.t180-track-builder\tracks`): 16 tracks and 13 undo sidecars. Checked by `sha256sum -c` against his files, which were read only.
- Each file goes through `D.serialize(D.parse(text))` on the merged tree and on a worktree at f3cd425.
- **Against f3cd425, the build he runs now: the same for 16 of 16 tracks and 121 of 121 undo steps.**
- **Against their own text:**
  - 12 of 14 core tracks are byte for byte.
  - One `core/2` file is written back as `core/4` (the schema string only, the same length).
  - One `core/5` file has its bank values rounded to 9 digits (56,331 → 56,060 B).
  - 3 of 121 undo steps, all in one sidecar, change in the same way as that one.
  - f3cd425 does each of these identically.
- **2 tracks are not core documents.** They have no `eq-` prefix: older piece-builder files that the builder does not list. Both builds refuse them BAD_DOC.
- **core/7:**
  - 0 of his tracks writes `t180b.core/7`.
  - One of his core tracks, copied and extended on the merged tree with the right side 3.5 m wider for 100 m (B's row-1 shape), writes `t180b.core/7` and reads back byte for byte.
  - f3cd425 refuses that text by name: "BAD_DOC: schema must be t180b.core/4 (or an older t180b.core/1, t180b.core/2, t180b.core/3), got t180b.core/7 (a newer file needs a newer builder)".

### 5.6 The install: HELD, for the librarian's word

- §4 registered: "I stop and say so, installing nothing, if: … any of his tracks fails to open, or re-saves different."
- **By its own words it fired.** 2 of 14 core tracks re-save different from their own text, and 2 files do not open as core documents.
- Every one of them does exactly the same on f3cd425, which is the build installed now. So this install changes how **0** of his files open or save.
- I worded the condition loosely; it should have said "different from f3cd425". But I hold the stake in installing, so I am not the one to reread my own stop rule after it fired.
- **The librarian decides:** install this build as it stands, or not.
- Ready for the word:
  - checked: the installed exe is still **2820e5f82160b8d48b3cb0399671f0783ef6bb7563d1e9e4056cda63c7d75576** (16,086,016 B, f3cd425), and no `.before-l262*` name is taken.
  - The install would be: `cp -n` to `.before-l262-f3cd425` and `cmp`; then `install-local.ps1 -Tag l262i-537a0c9` with the two `.p-l262-537a0c9` files; then re-hash; no launch.

### 5.7 The whole suite

Once, on 537a0c9: running in the background under heavy-run at BelowNormal (`--test-concurrency=4`, TAP, leftovers.js before and after). It gates a merge to main or a release, not this install. Reported when it ends.

### 5.8 For him to try, once it is installed (one line each)

- Type a bank past a full turn (more than 360°) in the bank field or a bank row: the road rolls on past the turn instead of unwinding.
- In Sculpt, drag a bank mark, or brush the bank, past a full turn: it carries on.
- Drag the bank handle far round: it stops at two full turns, because the ±720 completion is not in this build.
- Type a right width (the "right width m" field) wider than the width: only the right side widens, and the line stays where it was.
- Save a track that has a right width: it saves as the new file kind, which the desktop's builder (f3cd425) refuses by name until it gets this build. Keep such tracks on the laptop.
- Open your existing tracks and save them: they save as they do today.

## Corrections

- My pipeline stopped before the build on "NOT TESTED" found 38 times in the harness TAP. All 38 were in the names of passing rows that test the harnesses' crash handling. The rule should have matched a row's verdict, not any text. Nothing was lost: I read the TAP, then built in a second call (§5.2).
- §4's file condition ("re-saves different") was worded without saying "different from what". It fired as written, and I hold the install on it rather than reword it after the fact (§5.6).
- My first draft gave B 12 rows, 10 IN. B changed 11 test files, and 9 are IN: `tset.json` gives A 7 rows, 7 IN, and B 11 rows, 9 IN. Corrected in §0 and §3 before commit.

BASE: C:\Consonance\lighthouse 373b8e25
SOURCES: exo_memory/loop/packet_t180_test_install_on_L_2026-11-27.md:50; exo_memory/handback/p-l259-install-P_2026-11-27.md; exo_memory/handback/p-d677-right-width-B_2026-11-27.md:15-47; heavy-run --status ×4; tasklist ×5; scratch l262/pipeline.log, run/pipeline.json, run/tier-plain.tap, run/tier-harness.tap, run/tset-final.json, run/build262.json, build262.log, run/bytes.json, copies.taken, src.sha; git rev-list / log -p / diff-tree --cc for the push scan; git push ×3; git ls-remote origin; push-gate.jsonl last 3 rows; sha256sum of the installed exe
NEXT: librarian gives P the word on the held install (install 537a0c9's build as it stands, or not) when it has read §5.6; P installs within the minute of a yes, and reports the whole suite when it ends
