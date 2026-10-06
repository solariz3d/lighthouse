# p-jumpwarn-E · D250 item 2: a jump the car may fly past is a WARNING, no longer a red · pane E · 2026-10-06, on D

**Commit `60477147efebfafe60d38696ec1ebce5abd552a6`** (`6047714`), branch `d250-jumpwarn`, worktree `C:/Users/nname/Desktop/worktrees/e-jumpwarn-wt`.
- **It is on A's `539c120`**, rebased from the packet's `63dc19b`. The chair's follow-up asked me to change A's note, and that note lives only on A's branch. `63dc19b` is an ancestor of `539c120`, so this branch carries A's two commits and mine. **Land it after or with A's `539c120`.**
- 17 files, +109/−43.
- Not pushed, and AC was not launched.
- TARGETED tests only, as the packet said.

## VERDICT: done as ruled

The keeper: *"the jumps are going to have to be tested by the user through trial and error driving it in assetto themselves"*.

**A jump never blocks an export or an install now:**
- **`landing-misses-zone` is AMBER.** It used to be red.
- **The lap proof's reach reasons are warnings:** `jump-not-caught-<g>g` and `landing-unreachable` move from `lap.where` (fails the lap) to `lap.warn`.
  - Without this the jump would still have blocked: the export turns a failed lap proof into the `lap-proof` red.
- **The warning reads, in the export's warnings, the install message and the panel's label:**
  > jump: this jump may fly past its landing at the lap's speed, at s 300–360 m (the 6.3 g fall misses); tune it by driving it in AC

**Unchanged, by the ruling:**
- **A gap with NO landing ramp is still RED**, `gap-in-road`: core_jump row 2, "a flight with NO landing is red", still passes.
- A jump whose landing is behind its take-off is still red, `jump-gap-not-forward`.
- The rest of the lap proof still fails the lap: a stall, or the car leaving the surface.
- **Ramp sizing:** unchanged.

## What changed, file by file

**In `src/`:**
- **`src/validate/index.js`:**
  - the missed landing is pushed to `amber`, not `red`, and its source says why;
  - `proveLap` returns `warn: [...]` beside `where`, and `ok` is decided by `where` alone.
- **`src/export/fromwords.js`:**
  - each `landing-misses-zone` amber becomes one plain `jump: …` warning;
  - the lap proof's `landing-unreachable` becomes one more (no amber carries it);
  - a missed landing is said **once**, not again from `jump-not-caught`.
- `src/core/README.md`: the jump line updated.

**Outside `src/` (listed, as asked; `panel.js` NOT touched):**
- **`app/install/install.js`:** the install success message appends the export's `jump: …` warnings, and only those; the other warnings stay where they were.
- **`app/validate-ui/labels.js`:** the `landing-misses-zone` label now uses the same words, with "a warning".
- **`app/core/jumpplan.js:83`, A's note:** "…fixed today; the keeper has not decided whether it should follow the lap's speed." became "…fixed today; jumps are tuned by driving them in AC, so a landing the car may fly past at the lap's speed is a warning, not a red."
  - The prefix A's tests match is kept.
  - The other "fixed today." texts in `panel.js` make no claim about a decision and are untouched.

## FOR A: your preview-async row 3b control has changed
- Its control asserted `jp.check.others` (the reds) includes `landing-misses-zone`. That is amber now, so it is not in `others`.
- **A "real hole" cannot be built in a core document:** every flight piece carries its own landing ramp (the adapter). So the chair's suggested replacement has nothing to construct from.
- **I changed the control** (`app/test/preview-async.test.js:180`, marked CHANGED D250) to: the jump track carries the jump's WARNING (`check.amber > 0`) and no `landing-misses-zone` in `others`.
- The row's own assertion, that the two parts merged equal the one-piece check, is untouched and passes.
- **If you want a non-overlap RED in that row,** it needs another kind, e.g. a `roll-rate` red from a fast bank change. Your call.

## Tests changed with the ruling (each marked `CHANGED D250`, with the reason in a comment)

| test | was | now |
|---|---|---|
| `test/core_jump.test.js` row 3 (mine) | the too-short landing "is red" | it warns (amber) and is not red; the both-caught lap gives no landing warning |
| `test/validate_head.test.js`, two rows | the ramp too short, the 6.3 g fall too slow: red | read from `r.amber`, the heaviest fall still named, asserted not red |
| `test/validate_jumps.test.js` | "a closed lap over it fails with the reason" | the reason is in `lap.warn`, not in `lap.where` |
| `test/vocab-corpus.test.js` | the median jump misses: red | amber |
| `test/export_words.test.js` | "a lap the proof fails is refused" | the same lap EXPORTS, with the plain `jump:` warning naming the 6.3 g fall |
| `app/test/validate-ui-jumpdefault.test.js`, two rows | below the clearing speed the jump is red; a sculpted-too-far jump is red | it warns and nothing is red; the sculpted jump warns, with its fall |
| `app/test/preview-async.test.js` row 3b (A's) | | above |
| `app/test/core-pieces-ui.test.js` row 14 (A's) | asserted the note's old words | asserts the new ones |
| `app/test/export.test.js` row 51 | "a red track is refused": its red was a 150 km/h jump | an inversion taken at 150 km/h, which fails the lap proof on `leaves-surface` |

On row 51:
- **checked:** with the test's own helper, which re-applies the speed to every word, the jump lap now exports with one jump warning and nothing red.
- The row's subject is unchanged: refused, nothing written, every red shown with its source.

**New rows:**
- **`test/core_jump.test.js` row 5b:** a closed lap whose jump the car flies past exports, with exactly ONE plain warning, `(the 6.3 g fall misses)`.
  - The lap is a 60 m gap, 1 m drop, level landing: the one of six probed whose only finding is the miss (scratch `find.js`).
  - My first choice, LONG_JUMP, also fails the lap proof on `leaves-surface` after its sloped landing, so it could not show the ruling alone.
- **`app/test/share-install.test.js`:** the install message carries the `jump:` line and not the other warnings; control: no jump, no jump line.

## The run (TARGETED, under the lock, serial shim; on the rebased tree)
17 files: core_jump, validate_head, validate_jumps, vocab-corpus, export_words, export_test_unfinished, validate, core_cup_fixtures, doc-jump, validate-ui-jumpdefault, validate-ui, share-install, preview-async, core-shell, export, jump-ui, core-pieces-ui.
- **262 tests: 261 pass, 0 fail, 1 skipped.** The skip is the long-standing reads/ one.
- Fixtures row 5a reads "0 of 9 differ".
- Evidence: scratchpad `jumpwarn/targeted2.tap`, sha256 `e842e9e7…`.
- **The first run on this tree failed 3,** all fixed above: A's note regex, row 51's red track, and my row 5b's lap choice. Kept as `targeted.tap`.

## What this does NOT establish
- The harnesses: per the packet, the librarian runs them at install. **`core_jump_mutation` will need its rows re-checked:** its patterns target row 3 by name, and row 3's assertions changed.
- A real window.
- AC.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_t180_keeper_choices_2026-10-06.md · `git -C C:/Users/nname/Desktop/worktrees/e-jumpwarn-wt log --oneline -3` · scratchpad jumpwarn/targeted2.tap

## Rebased on 6081ee6 (the chair, 07:30)

**Tip `da2c2d6ea0a0da6a5613675ec0452732f533c174`.**
- Branch `d250-jumpwarn-on-6081ee6`, worktree `C:/Users/nname/Desktop/worktrees/e-jumpwarn2-wt` (fresh), on t180 main `6081ee6`.
- Two commits: `2da9c44` (mine), then `da2c2d6` (B's refusal rows `7be2bfb`, unchanged). Tree clean, not pushed.
- 18 files, +184/−43 against `6081ee6`.

**What I cherry-picked:**
- **`51e2949` and `7be2bfb`**, the line B's look sits on. `51e2949` is my `6047714` re-applied when A's commits landed as `9e2e249`/`d61f7d1`.
- **checked:** its diff equals `6047714`'s except for one hunk offset in core-pieces-ui (−491 → −500).

**Two conflicts, both resolved as unions:**
1. **`app/install/install.js:46–50`:** B's line is kept whole, with its `where` full folder and "exporting this track again updates that folder (…)"; my `jump: …` warnings are appended after it.
   - My row in `app/test/share-install.test.js` gained one assertion: the export line's "exporting this track again updates that folder" is still present beside the jump line.
   - That assertion is the only new edit in this rebase. The rest of the row never depended on the old "installed" wording.
2. **`CHANGELOG.md`:** every entry kept. On main the Changed section already holds TWO different "Shift-click across the start line" entries (item 4, and item 4's fixes); both stay as they were, and my D250 item 2 entry follows them.

**The run (TARGETED, under the lock, serial shim, merged tree):**
- The 9 files the chair named: share-install, export, export_words, validate_head, validate_jumps, core_jump, preview-async, validate-ui-jumpdefault, vocab-corpus.
- Plus `test/jumpwarn_refusals.test.js` (B's commit, which rides here) and `app/test/core-pieces-ui.test.js` (my commit edits its note regex).
- **164 tests: 163 pass, 0 fail, 1 skipped** (the old reads/ skip).
- Evidence: scratchpad `jumpwarn/rebased.tap`, sha256 `70cb3f9c…`; 242 s.

**Not run:** the harnesses, which are the librarian's at install (the note above on `core_jump_mutation` stands), a real window, and AC.
