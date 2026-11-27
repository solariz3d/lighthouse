# L258, track 1, pane A (L, Opus 5.5): the bank past a full turn, continued on L. Steps 1 to 3 green; the branch unchanged

The order of 06:26:39Z; the packet `exo_memory/loop/packet_t180_resume_on_L_2026-11-27.md` (room befda277), "Track 1". I read it first, then `loop/handoff_t180_2026-11-26-D.md` and D's `handback/p-bankcarry-A_2026-11-26.md` whole.

BASE: C:\Users\zackn\Downloads\t180-track-builder 2067c88 (`l-bankcarry-a`, on `landing-1126-batch` f3cd425)

**The branch is right.**
- checked: `git ls-remote origin l-bankcarry-a landing-1126-batch` → 2067c88a2b…, f3cd425a4d….
- checked: `git merge-base --is-ancestor f3cd425 2067c88` holds, and `git log f3cd425..2067c88` is the one WIP commit.

**What I did not change.** Nothing was committed to the builder; the branch's tip is still 2067c88 on origin. I ran in two detached worktrees, `Downloads\t180-wt-l258-tip` (2067c88) and `-base` (f3cd425), both removed at the end.

## What did not travel from D (checked on L)

- **L has no `G:` drive**: `Get-PSDrive -PSProvider FileSystem` → `C` only. So nothing under `G:\consonance-scratch\` is here, namely:
  - D's `panelfiles.txt` (the 34);
  - `tracks.js` and the 27 track copies with 16 undo sidecars;
  - `w1fig.js` and `sculptwound.js`;
  - the TAP files (`panel34.tap`, `six.tap`, `mutation.tap`, `xsec-mutation.tap`, `red4-f3cd425.tap`, `green.tap`).
- **D's figures that rest on those stay D's**, unreproduced here:
  - W1's steepest roll, 2.21 against 0.37 °/m;
  - t13's −350 laid at −710;
  - the Sculpt drag −366 → −16.
  - L's tracks cannot reproduce t13's case either: none is wound past a turn (step 3).
- **My lists are made fresh by a stated rule** (step 1), not recovered from D's.

## Step 1: the test files that load panel.js, by a rule (checked)

`evidence/panelrule.js <tree>` counts the app's test files (`app/test/*.test.js`) by three rules:
- **(a) direct**: a `require()` of a string that resolves to `app/core/panel.js`;
- **(b) graph**: `app/core/panel.js` is in the file's static require closure, over every `.js` in the tree;
- **(c) source**: the file reads or mutates the text of `app/core/panel.js`.

| | f3cd425 | 2067c88 |
|---|---|---|
| test files | 162 | 164 |
| plain grep `panel\.js` | **49** | **51** |
| (a) direct | 31 | 32 |
| (b) graph | 31 | 32 |
| (c) source | 4 | 5 |

**The packet's 49 is the base's count.** The plain grep on the branch finds 51: the 49 plus D's two new files.

The grep is wider than panel.js-the-module. Of the 51, 15 never execute `app/core/panel.js`. They are:
- files that name a different `panel.js` (`validate-ui/`, `markers/`, `texture/`, `reference/`);
- files that mention it in a comment;
- two that read its text only (`keys-anywhere` by `readFileSync`, `theme` in a token scan).

Graph equals direct: no module between a test and the panel loads it.

**A rule that gives 34: "the test file executes `app/core/panel.js`"**, either by requiring it, or as a mutation harness that runs tests on a rewritten copy of it.
- At f3cd425 that is **34**: 31 direct, plus `core-mutation`, `core-xsec-mutation` and `core-close-mutation` (`evidence/rule34_base.txt`).
- At 2067c88 it is **36**: the same 34 plus D's two new files, `core-bank-carry` and `core-bank-carry-mutation` (`evidence/rule36.txt`).
- inferred: this is D's list, either made at the base or with D's own two new files left out (D ran those separately). `panelfiles.txt` did not travel, so I cannot compare.

**What I ran: the 51**, which hold the 36, the 34 and both text readers. The command:

`node heavy-run.js --status && node heavy-run.js --run --priority belownormal --cmd "A L258: the 51 …" -- node evidence/run_touched.js <tip worktree> <out> <the 51>`

It ran in the background in slot 2, with B's whole suite in slot 1. Output: `evidence/tip51.jsonl` (one row a file) and `evidence/tip51_tap/`.

| set at 2067c88 | files | tests | pass | fail | skipped | todo |
|---|---|---|---|---|---|---|
| all 51 | 51 | 797 | 791 | **0** | 5 | 1 |
| the 36 (the rule) | 36 | 630 | 624 | **0** | 5 | 1 |
| the 34 (the rule at f3cd425) | 34 | 615 | 609 | **0** | 5 | 1 |
| the 15 outside the rule | 15 | 167 | 167 | **0** | 0 | 0 |

- **The 5 skipped** are `sculpt-frame.test.js` rows 1 to 4b, its frame-timing rows. Each skips itself with "not timed: CONSONANCE_DATA does not name the heavy-run lock folder, so the two slots cannot be read". **They were not timed, which is not a pass.**
  - inferred: the change cannot move them. `git diff f3cd425 2067c88 -- app/core/panel.js` touches the typed bank, the extra bank rows and the extra-bank offer bases. None of these is a Sculpt drag path.
  - They are the landing's to time, on a quiet machine.
- **The 1 todo** is `core-extra-bank-drag-cost`'s own todo row, as at L251.

## Step 2: the rows and the harness after the comment-only edit (checked, in the same run at 2067c88)

- **`core-bank-carry.test.js`: 7 of 7**: W1 −, W1 +, W2, W3, W4, G6 and G7 (`tip51_tap/core-bank-carry.test.tap`).
- **`core-bank-carry-mutation.test.js`: 8 of 8** (`tip51_tap/core-bank-carry-mutation.test.tap`):
  - the control;
  - the D352 crash stand-in;
  - **applied 6 / caught 6 / NOT APPLIED 0**. Each mutant is caught by its own row: B1 by W1, B2 by W3, B3 by W1, B4 by W2, B5 by W4, and B6 by D641 (f).
- **inferred:** 2067c88 is the tree after the comment-only edit. D's hand-back says its paraphrase was made "before the commit", and 2067c88 is that commit. I did not diff it against an earlier tree, which stayed on D.
- **The other harnesses that rewrite panel.js**, in the same run, each with its control and stand-ins green:

| harness | mutants applied and caught | not ok |
|---|---|---|
| `core-xsec-mutation` | 31 of 31, X32 included (D's 31) | 0 |
| `core-mutation` | 65 of 65 | 0 |
| `core-close-mutation` | 59 of 59 | 0 |

## Step 3: his saved tracks on L, from copies (checked)

**L's count:** his `tracks` folder holds **16 `.t180track`** and **13 `.t180undo`** files. His `track-backups` folder holds 11 more `.t180track`, which I ran as a second set.

**How I copied them.**
- `cp -p` into my scratchpad, under neutral names: `t01`…`t16`, `b01`…`b11`, with each sidecar beside its track.
- The copies' sha256 list equals the folder's (one hash of the per-file hashes, both `310461…`).
- His folder was read once for the copy and never written.
- The name map stays in my scratchpad and is not committed.
- No track name is in this file or the evidence. Scanned: 0 hits. One builder test title, `core-extra-handles` X8, names one of his tracks. It is already in the builder's own source; I redacted it in my copy of that TAP.

**The probe:** `evidence/tracks258.js <tree> <copies> <out>`, run once per tree and set. Per track it:
- parses the file;
- re-serializes it and a second round;
- opens it by the app's own `shell.open`, with its sidecar;
- saves it by `shell.save` under another name;
- mounts the panel (the bank rows' fake DOM) and reads the shown bank, the head's bank and the untouched `panel.options()`;
- types the bank at the shown value + 10 with 150 m and presses Extend.

`evidence/cmp258.js` compares every recorded field, base against tip.

**Result:**
- **16 of 16 tracks the same in every field on f3cd425 and 2067c88, and 11 of 11 backups the same** (`rt_tracks_*.json`, `rt_backups_*.json`).
- **2 of the 16 are not track documents** (`BAD_DOC` on both trees). They are the two files without the `eq-` prefix, which the shell does not list.
- **14 open, and their re-serialization is stable on both trees.**
  - 12 are byte-identical to the file.
  - t02 is written from `core/2` as `core/4`, and t03 (`core/5`) is written back differently. The same on both trees.
- **The app's own save** writes exactly the re-serialized bytes for all 14.
  - 13 of the 14 have a sidecar. The saved sidecar equals the copy's for 12 of them.
  - t03's differs on both trees, inferred because its body is rewritten.
- **Typed +10:**
  - 12 of the 14 lay identically on both trees.
  - 2 are closed laps, refused by name ("CLOSED: a closed track has no open end") on both trees.
  - The 11 backups: 9 byte-identical to their file and all 11 stable; 9 lay, and 2 closed laps are refused the same way. None has a sidecar.
- **None of L's tracks is wound past a turn.** Every head's bank is within one turn (0, 4.58, 26, 28.6, −50), so the typed check cannot show the change on L's set. D's t13 (wound to −720) is not on L.
- Not used: none of the files was opened in his installed app (L has the 0ab6cc8 build), and none was exported.

## Step 4: no change to typing or drags

- Nothing was changed; no commit at all.
- His two questions stand, as D's hand-back and the handoff put them:
  - (a) "type the whole number" (on a head at −340, −392 rolls on and −32 means −32), or the nearest-equivalent reading D259 refused on 10-06;
  - (b) should a Sculpt drag on a piece already wound past a turn carry on as typing now does, instead of unwinding a turn by his 10-06 rule?
- The build waits on him only for those two behaviours.

## Owed, and not mine at this tier

- The whole suite: the landing's, once.
- `sculpt-frame`'s 5 timing rows: not timed here.
- The read by a seat that wrote none of it: the packet's next step.
- The packet's falsifier (b) on [T5] stays owed to D (the key is on D).

## The machine

- **Headless Chrome:** 2 of the 51 start it (`markwindow-page`, `sculpt-frame`). The tree's own launcher (`--mute-audio`) and the tests' own titles were used; I wrote no page script this lap.
- **Leftovers**, `node consonance/tools/leftovers.js` before (06:29:41Z) and after (06:54:30Z): tab proxies UNCALIBRATED 0 → 0, 0 orphan browsers, 0 fake roots (`evidence/leftovers_*.txt`).
- **heavy-run:** every run of the 51 went through `heavy-run.js --run --priority belownormal` after `--status`, in the background.
  - The track probe ran directly: four short node runs, reading copies only (one track took 0.3 s in the smoke run).
  - The smoke runs (one track each) also ran directly.
- **Untouched:** his app, his AC folder, his saves (read only, for the copy), `~/.consonance.json`, and B's tree and slot.
- No landing, build, install, merge or release.

SOURCES: exo_memory/loop/packet_t180_resume_on_L_2026-11-27.md (befda277); exo_memory/loop/handoff_t180_2026-11-26-D.md; exo_memory/handback/p-bankcarry-A_2026-11-26.md; builder git diff f3cd425 2067c88; evidence/panelrule.js; evidence/rule34_base.txt; evidence/rule36.txt; evidence/grep51.txt; evidence/tip51.jsonl; evidence/tip51_tap/; evidence/tracks258.js; evidence/cmp258.js; evidence/rt_tracks_base.json; evidence/rt_tracks_tip.json; evidence/rt_backups_base.json; evidence/rt_backups_tip.json; evidence/leftovers_before.txt; evidence/leftovers_after.txt
NEXT: librarian call_chair with this pointer when you have read it; the read of l-bankcarry-a 2067c88 by a seat that wrote none of it is the packet's next step, and his answers to (a) and (b) are what the build waits on
