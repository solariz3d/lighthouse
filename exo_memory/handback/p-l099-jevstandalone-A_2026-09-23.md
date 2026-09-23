# P-L099-JEVSTANDALONE · ALPHA — `jev-judge.js` finds the room through `~/.consonance.json` room_path, and not finding it is now a REFUSAL that names every place tried and the fix. A main.rs missing one const still resolves the other two and names the missing one. The silent `catch` is gone. One finding to weigh first: on today's live path the bug never bit, because the app spawns the runner from room_path's own checkout · **AND §6, the addition: seats are named by pane LETTER. The 04:26 drift flag is about A, this seat**

**Pane A, machine L, 2026-09-23 04:3x–04:5x.** Lap L099, Jev standalone step 1, plus the librarian's seat-name addition (§6).
**Four files, uncommitted, final** (`git diff --numstat`, `git hash-object`):
- `consonance/tools/jev-judge.js` (+86 −13, git-blob f1a24ead…)
- `consonance/tools/jev-judge.test.js` (+136 −0, git-blob 711b5288…)
- `consonance/hooks/jev-flags.js` (+30 −4, git-blob 73cf15e4…)
- `consonance/hooks/jev-flags.test.js` (+38 −0, git-blob a6fbdd95…)

§1–§5 cover step 1, and the counts there are step 1's. No rebuild, no settings change, no ledger write.

## 1 · WHAT THE BUG WAS, AND WHERE IT COULD BITE

Before: `seatSessions` read `<repo>/consonance/src-tauri/src/main.rs` inside `try { … } catch { /* no main.rs: the roster alone */ }`.
The `repo` came from `jev-shadow-runner.js:221`: `cfg.repo || path.resolve(__dirname, '..', '..')`. **A copy of the runner outside a
checkout judged panes.json's roster only.** Main, the librarian and the Third Place dropped out with no line anywhere. That is L089's
jev-flags bug in its sibling.

**Scoping the finding honestly:** the app finds its checkout through room_path (`main.rs:397`, `repo_root()` →
`repo_root_from_room_path`) and spawns the runner from `repo_root()/consonance/tools/jev-shadow-runner.js` (`main.rs` start_jev_shadow).
**So on the path the app takes today, `__dirname/../..` already IS the room, and the three fixed seats were being judged.** The fix
protects the case this lap is named for: Jev running standalone, from a copy that is not in a checkout. It does not repair a live
loss. I did not measure `jev_judge.jsonl` for missing Main rows, because the reasoning above says there were none to find. That
reasoning is not a measurement (§5).

## 2 · THE CHANGE — `jev-judge.js`

- **New `roomOf({ repo, home })`, kept in this file** and not shared with jev-flags, because a `require` from an installed copy is
  the path that breaks. It returns the first of these that holds `consonance/src-tauri/src/main.rs`:
  1. the `repo` passed in;
  2. `room_path` in `<home>/.consonance.json`, climbed two levels (`<repo>/exo_memory/BOOT.md` → `<repo>`), read the way
     `jev-flags.js mainRsPath` and `main.rs:352` read it;
  3. the checkout beside this file.

  The answer is `{ root, file, tier }`, or `{ root: null, file: null, why }`, where `why` names every place tried. An absent config
  and an unreadable one are named differently.
- **`seatSessions({ repo, dataDir, home })`** returns the same array plus two fields: `.room` (roomOf's answer) and `.missing`
  (the fixed-seat consts main.rs did not hold). **A missing const no longer hides the other two.**
- **`capturePass` REFUSES when there is no room:**

      cannot find the room, so Main, the librarian and the Third Place cannot be judged — <every place tried>. Fix: set room_path in ~/.consonance.json.

  The runner already turns a Refusal into `judge mode off: … — the shadow keeps running` in `<store>/runner.log`, once
  (`jev-shadow-runner.js:224,236`). A missing const goes into the result as `res.missing`.
- **The hooks now load from the same root as main.rs:** `loadJudgeInputs(seats.room.root)`, not `loadJudgeInputs(repo)`, so the
  view, the prompt and the seat ids come from one tree.
- `Refusal` and `roomOf` are added to the exports. The existing exports are unchanged.

**Deviation from the packet's wording, argued. One line to flip:** the packet says *room_path first*. I put **a passed `repo`
that holds main.rs** first and room_path second, for two reasons:
- **One tree.** The runner passes its own checkout. If room_path won there, a checkout could judge with another checkout's seat ids
  and its own hooks.
- **The existing tests stay hermetic without being edited.** Room_path first would read the real `~/.consonance.json` in every
  existing test.

**In the only case the packet targets, the outcome is identical.** An installed copy's `__dirname/../..` holds no main.rs, so it
falls through to room_path. A test pins the order, and mutant M2 (room_path first) turns it red.

**Behaviour change to weigh:** with no room at all, judge mode is now OFF, loudly. Before, it judged the roster alone, silently.
I took the loud half because the packet asked for a loud failure, and a roster-only judge that looks healthy is the failure
itself. If the chair would rather keep judging the roster AND say so, the refusal becomes a `res.warning` plus one runner log
line (`jev-shadow-runner.js` is not my file).

## 3 · TESTS — red first (`node --test consonance/tools/jev-judge.test.js`)

    24/0 → red 25/8 → 33/0

The nine new tests:
- an installed copy (jev-judge + jev-ask + jev-shadow copied to a temp dir, a test HOME, no repo) resolves **all three fixed
  seats** through room_path;
- the same copy **captures a Main turn**, loading the hooks from the room room_path names;
- no config and no checkout → a **Refusal naming the places tried and the fix**;
- a room_path that leads nowhere is **named**;
- the roster still resolves when the room is not found, with `.room.why` set;
- a main.rs missing `LIBRARIAN_SID` → **Main and the Third Place still resolve**, and `missing` = `['LIBRARIAN_SID']`;
- capturePass carries `missing` into its result;
- a passed checkout wins over room_path (one tree);
- an unreadable config is named as unreadable, not as absent.

**The one new test that passed on red was the one-tree test.** It is vacuous on the old code, which never read room_path, so M2
is what makes it mean something.

Neighbours are unchanged: jev-shadow-runner 38/0, jev-shadow 29/0, jev-ask 55/0, jev-flags 28/0.

**Mutants** (`node <scratchpad>/l099/mutants.js`, each on a copy of jev-judge.js in a temp tree at the repo's depth):

    M1 room_path never read · M2 room_path before the passed repo · M3 no refusal (the old silence) · M4 refusal drops the places
    tried · M5 refusal drops the fix · M6 a missing const not named · M7 capturePass drops missing · M8 hooks from repo, not the
    room · M9 unreadable config reported as absent · M10 room_path climbs one level · M11 a room_path leading nowhere not named ·
    M12 one bad const stops the other two
    12 listed · 12 applied · 12 caught · 0 survived · 0 NOT APPLIED · 0 NO RESULT · live file unchanged

## 4 · THE OTHER JEV FILES THAT ASSUME THE CHECKOUT — listed, not fixed

`grep -nE "resolve\(__dirname|Desktop/lighthouse" consonance/tools/jev-*.js consonance/hooks/jev-*.js`, without tests or mutants:

1. **`jev-shadow-runner.js:221`**: `repo: cfg.repo || path.resolve(__dirname, '..', '..')`. **Now harmless for judge mode:** when
   that path holds no main.rs, roomOf falls through to room_path. It is still passed as "the repo", so the cleaner form is to pass
   `cfg.repo` bare and let roomOf decide.
2. **`jev-shadow-runner.js:348`**: `disciplineDir: env.JEV_SHADOW_DISCIPLINE || path.resolve(__dirname, '..', '..')`. From a
   standalone copy, METHOD.md is read from a place that does not have it. That is already LOUD (capturePass refuses with `cannot
   read METHOD.md`), but it is a second miss for the same cause. **The fix is to default it to the room roomOf found.** It is the
   first thing step 2 should take.
3. **`jev-shadow.js:274`**: the same `disciplineDir` default, for the shadow's own discipline. Same cause, same fix.
4. **`jev-shadow.js:102`**: reads the workers from `<shellDir>/hooks` (`~/.claude/shell/hooks`). **Not a checkout assumption:** it
   is deliberately what the installed Claude judges run. It stays.
5. **`jev-judge.js:26`** (a comment) records that the workers themselves read `~/Desktop/lighthouse/…`, D's layout. Judge mode does
   not depend on it, because it passes METHOD.md in.
6. **`hooks/jev-flags.js`** is already fixed (L089, `mainRsPath`).

## 5 · SUITE, AND WHAT IS NOT VERIFIED

    node consonance/tools/js-suite.js      running in the background — appended below when it returns

**Not verified:**
- **A real standalone run.** The tests use a copied tree and a test HOME. No copy was run against the live gateway, and none should
  be without a key decision.
- **That no Main, librarian or Third Place row was ever lost.** Argued from `main.rs:397` and start_jev_shadow, not counted in
  `jev_judge.jsonl`.
- **The runner's log line for the new refusal.** That path is already tested by the runner's own suite (a Refusal becomes `judge
  mode off`). I did not add a runner test, because it is not my file.


## 6 · THE ADDITION — a seat is named by its pane LETTER (librarian's spec, read on the board. The chair's queued copy had not delivered when this was built)

**The source:** `<data>/letters.json`, the registry `main.rs` `pane_letter` keeps (`:3593`, `:3700`). On L it holds 13 ids, and panes.json
gives three of them the label `✦ brief`: 6fe15f0a, 12fb81f6 and a2122153.

- **`jev-judge.js`:** a roster seat is named by its letter, else by its first 8 id characters, never by its roster label. The
  new `lettersOf(dataDir)` returns `{}` if the file is absent or unreadable. Main, the librarian and the Third Place keep their
  names, because they are added first and `add` keeps the first name. letters.json gives Main **D** and the librarian **M**, so
  the order matters, and N4 pins it.
- **`jev-flags.js`:** new `seatName(r, ids, letters)`, applied at PRINT time, so **the ledger is never rewritten.** It prints
  `main` and `librarian` by name, then any letter found by `session_id`, then a row's own seat if it is not a shared `✦ `
  label, else the short id. The new `lettersFor(home)` reads `data_dir` from `~/.consonance.json`. `main()` passes it in.

**On the real ledger, read-only** (`node -e` over `%LOCALAPPDATA%/consonance/jev-shadow/jev_judge.jsonl` with the live
letters.json):
- 404 rows. **74 are `✦ brief`: A 41, B 11, E 22.**
- The chair's flag view before and after:

      before: … · 6fe15f0a · turn 04:26 · drift p=0.46 · … · 0845a868 · turn 03:56 · abstain p=0.96
      after:  … · A · turn 04:26 · drift p=0.46 · … · C · turn 03:56 · abstain p=0.96

  ("Before" here is the new code with no letters. The installed hook as it was printed `✦ brief`.)

**So tonight's first real drift flag, 04:26 at p=0.46, is about A: this seat's own turn.** I have not read which turn it judged,
or whether the call was right. It is unverified, like every Jev row, and scoring it is not mine to do, since it is my own move.

**Tests, red first:**
- judge: 33 → red 34/3 → 37/0 (four tests);
- flags: 28 → red 30/4 → 34/0 (six tests).

The three that passed on red are the keep-as-is cases (fixed seats keep their names; a new row with a letter prints as written),
and mutants N4, N6 and N8 are what give them meaning. The tests include the spec's own: **two panes with the same label get two
different seat names.**

Neighbours: jev-shadow-runner 38/0, jev-shadow 29/0, dream-gate 59/0.

**Mutants** (`node <scratchpad>/l099/mutants2.js`, copies in a temp tree):

    N1 label again · N2 no short-id fallback · N3 letters.json never read · N4 roster before the fixed seats · N5 flags ignore
    letters · N6 librarian renamed M · N7 shared label printed as-is · N8 a letter-seat row ignored · N9 CLI never passes letters ·
    N10 data_dir ignored
    10 listed · 10 applied · 10 caught · 0 survived · 0 NOT APPLIED · 0 NO RESULT · live files unchanged

**The first run was 9/10. N4 survived, and it was a fixture flaw of mine:** Main was not in the test roster, so the read order
could not matter. It is now in the roster. Step 1's twelve mutants were re-run after the addition: still 12/12.

**NOT done, and it is needed for the flag to change where the chair reads it:** the INSTALLED hook,
`~/.claude/shell/hooks/jev-flags.js`, is still the L089 copy (CRLF-stripped sha256 c65b2492… vs the repo's 3d8004e7…). Until
`install.ps1` copies it again, the chair's and librarian's prompts print `✦ brief`. **Reinstalling is outside this packet's
grant, so I did not do it.**

**Suite: NOT re-run by A.** The whole-suite run is the collator's (the librarian's rule, relayed by the chair at 04:4x). Both of my
runs were stopped unfinished, freeing C's heavy-run lock (`bbd56ad`), so neither returned a count. What A verified is exactly
the targeted runs above:
- jev-judge 37/0, jev-flags 34/0
- jev-shadow-runner 38/0, jev-shadow 29/0, jev-ask 55/0
- dream-gate 59/0
- mutants 12/12 + 10/10

The last full count A has is L097's: 123 green, 0 failed (of 124), taken before any L099 edit.

NEXT: librarian call_librarian with the L099 pointer when this hand-back is written — plan default after it: install.ps1 copies the new jev-flags.js to ~/.claude/shell/hooks (outside A's grant), then Jev standalone step 2 (disciplineDir defaults at jev-shadow-runner.js:348 and jev-shadow.js:274), unless the output says otherwise

§5's "appended below when it returns" is superseded by §6's suite line.
