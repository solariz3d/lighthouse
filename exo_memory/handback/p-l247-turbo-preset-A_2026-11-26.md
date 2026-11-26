# L247, pane A (L): the run preset (Normal / Turbo), by role, and a newborn pane's letter before its first spawn

**First line: lighthouse branch `l247-turbo-preset`, tip `72d88e09` (from 1f00fe9a; pushed, `git ls-remote origin l247-turbo-preset` = 72d88e09d9). Not landed, not built, and his `~/.consonance.json` is not edited. It takes effect at his relaunch after the landing.**

BASE: C:\Consonance\lighthouse 72d88e09

The packet (1f00fe9a) and the chair's two same-lap amendments (08:58Z: by role; 09:00Z: Main on opus, and the birth order) are all done in this one commit.

## What it does (`consonance/src-tauri/src/main.rs`)

**The key** is `run_preset` in `~/.consonance.json`, a Settings key (a `Config` field, in `SETTINGS_KEYS`).
- A missing key, `""` or `"normal"` is **Normal**: today's spawn. `seat_models` applies as written, with no `--effort`.
- `"turbo"` is **Turbo**.
- **Anything else is refused** in plog (`RUN PRESET REFUSED pane=…: run_preset is …, which is neither "normal" nor "turbo"; this seat runs as normal`), and the seat runs as Normal. `"Turbo"`, `" turbo"`, `1`, `true`, `null` and an object are all refused, never guessed at.

**The table** is `TURBO_SEATS`, one const, **by role, never by letter**:

| role | model | effort |
|---|---|---|
| builder (every committee pane) | opus | xhigh |
| main | opus | xhigh (his 03:00 words) |
| librarian | fable | high |
| third_place | its own `seat_models` entry (fable on his machines) | high |

- **The roles:**
  - main, librarian and third_place are the fixed session ids;
  - **builder** is a managed seat in a `sibling-` folder (`is_managed_cwd && is_builder_dir_name`), the rule the L216 no-prompt and the L225 floor settings already use.
- **Coverage:** O, P and any later builder pane are covered with no table change. A seat with no turbo role (a fresh pane, a room, a body) runs as Normal under Turbo.
- **The pure core:** `run_preset_from`, `seat_launch_from(raw, pane_id, letter, builder)` and `seat_launch_args`.
- **The live reader** is `seat_launch(pane_id, builder)`. It reads the config, and reads the letters only when the config names `seat_models` or `run_preset`, as `seat_model` did. It logs:
  - a refused preset;
  - a refused model name (the old `seat_model` line, moved here);
  - **one `RUN PRESET pane=… normal|turbo: model …, effort …` line per spawn and resume.**

  `seat_model` is gone: `seat_launch` took its place.
- **The spawn** (`spawn_claude_pane`) reads `seat_launch` once, after the resume and session-id arguments. It keeps its one `--model` call (the Lap W pin still holds) and adds one `--effort` call. The `SEAT MODEL` line names its source: `seat_models in <path>` or `the turbo table`.

**Settings** (`ui/index.html`, `ui/app.js`) has one "Run preset" row, Normal and Turbo. Its note says it "Takes effect at the next relaunch: a seat that is already running keeps the model and effort it started with", and that saving backs the file up first.
- `load()` shows Normal for a missing or empty key.
- `persist()` keeps a value the select cannot show, as it was written.

**The backup:** `save_config_at` backs the file up before any save that changes it, as `<name>.bak-<YYYYMMDD-HHMMSS>-settings` beside it. It never overwrites an older backup (a taken name gets `-2`, `-3` and so on). A backup that cannot be written refuses the save. A save that changes nothing writes no backup.

**The birth order (the chair, 09:00Z; checked):**
- In `persist.log`, panes O (8bcb0f46…) and P (6e6e002c…) have `NO PROMPT` and `BUILDER FLOOR` lines, then `letter O`/`letter P`, then `born-kept`, and **no `SEAT MODEL` line**.
- **The cause** is one level down from the callers. `spawn_claude_pane` reads the letter registry for the model at about :1310, but the letter is first claimed inside that same spawn at about :1416, for the MCP mount, after `--model` is decided. The callers' own `pane_letter` came later still.
- **Fixed:** `spawn_sibling`, `new_room` and **also `spawn_fresh`** (the same shape) now claim the letter before their first `spawn_claude_pane`. O and P were not touched; they get their model at his next relaunch.

## Rows (checked; every run under `heavy-run.js --status && cargo test …` in one call, at BelowNormal, in the background)

`run_preset_tests`:
- **1** `normal_gives_back_todays_argv`: 11 config shapes × 8 seats. Normal's arguments equal `seat_model_from`'s, which are today's. It cannot be red: it is the invariant, and it passed at every stage.
- **2** `turbo_gives_each_seat_its_model_and_effort`: each role's model and effort; the Third Place keeps its own model; a seat with no role runs as Normal; no letter is in the table; every effort is one `claude` takes.
- **2b** `a_committee_pane_the_table_never_named_gets_turbo_by_its_role`: builders O, P, Q and Z9 get opus at xhigh under Turbo and exactly today's argv under Normal.
- **3** `an_unknown_value_runs_as_normal_and_is_refused`: 9 values; the refusal line, and that `seat_launch` plogs it.
- **4** `the_spawn_takes_the_launch_once`: the spawn pin.
- **5** `a_newborn_pane_has_its_letter_before_its_first_spawn`: a control showing that with no letter the seat's model is missed (what O and P got); `pane_letter` before `spawn_claude_pane` in all three births; and `seat_launch` reads the registry `pane_letter` writes.

`config_merge_tests::saving_the_run_preset_keeps_every_other_key_and_backs_up_first`: the preset is written; every other key is equal in value; one key is added and none dropped; the backup equals the old text byte for byte; a no-change save writes no backup; an unknown value is kept through a save.

`ui/run-preset-wiring.test.js`: 3 rows (the row's two options and its note; load; persist).

**Red first** (logs in `p-l247-turbo-preset-A_2026-11-26_evidence/`):
- **Stage 1** (`l247_stage1.txt`), on a stub that ignored Turbo, refused nothing and left the key unowned: rows 2 and 3, the save row and `the_owned_keys_are_exactly_configs_fields` were red (4 failed, 10 passed).
- **Stage A** (`l247_roleA.txt`), the letter table with the builder flag threaded through: 2b was red (`left: ["--model", "opus"]`, `right: [..., "--effort", "xhigh"]`).
- **Stage C** (`l247_roleC.txt`), the role table without the order fix: 5 was red ("fn spawn_sibling(: the letter is claimed after the first spawn").
- **UI:** `run-preset-wiring.test.js` failed 3 of 3 before the HTML and app.js change.

**A red row that caught me** (`l247_stage2.txt`): `config_merge_tests::a_save_keeps_every_key_it_does_not_own` failed (17 keys against 16). A save of a file with no `run_preset` was adding `"run_preset": ""`. Fixed in `merged_config_text`: an empty preset is "not set", so a save of an existing file with no key adds none. A fresh file still gets every tab key, which `usb_mode_survives_…` requires. Stage 3 was then 60 of 60.

**Final** (`l247_final.txt`): `cargo test --bin consonance -- config_merge_tests floor_launch_tests fresh_permission_tests no_prompt_tests one_settings_tests pane_exit_wiring_tests run_preset_tests suggestion_off_tests third_place_return_tests usb_mode_tests letter` gave **76 passed, 0 failed**.
- The modules are every test module that reads `spawn_claude_pane`, `SETTINGS_KEYS` or `save_config_at` (grep), plus the letter rows.
- No new warning points at a touched line.
- The UI test files: 14 of 14 at 0 failed.
- Not run: the whole suite (that is the landing's).

## Said plainly
1. **Normal's argv changes in one place, by order:** a pane born from now on gets its `seat_models --model` on its first spawn, which before this it missed. Every existing seat's Normal argv is unchanged (row 1).
2. **A refused spawn now spends a letter.** The letter is claimed before the spawn, so a birth refused by the withheld or closing checks leaves a letter on a pane that never ran. The next pane takes the next letter.
3. **"Every other key byte for byte" holds for the values, not for the file's layout.** serde_json here has no `preserve_order` (Cargo.lock: serde_json depends on no indexmap), so every Settings save, before L247 as now, writes the keys back in alphabetical order, nested `seat_models` included.
   - checked, reading only: his file is insertion-ordered pretty JSON (14 keys, no `run_preset`, `seat_models` naming main, third_place, librarian, A, B, C and E). So his first save from the new row will reorder it.
   - Every value is kept, and the backup holds the exact old bytes.
   - I did not turn `preserve_order` on: it would change how every JSON map in the app is written. That is his or the chair's call.
4. **Fresh panes are not "builder".** A fresh pane is "committee" in the pane roles, but it is unbriefed and its folder is `fresh-`, not `sibling-`, so Turbo runs it as Normal. If "every committee pane" should include them, the role test in `seat_launch_from` takes one more folder rule.
5. A non-string value saved through Settings comes back as its text (`1` becomes `"1"`), as every Settings field does (`stringish`), and is still refused at spawn.
6. **The falsifier** ("Failed if, after his relaunch with Turbo on: a seat's first reply is not on the model the table names (read it from the transcript's model field), or Normal does not give back today's argv.") can only be read after the landing and his relaunch. inferred, for whoever reads it: the plog line `RUN PRESET pane=<id> turbo: model …, effort …` names what each spawn asked for, and the transcript's `model` field is what it got.
7. The room repo has no CHANGELOG; MAP.md has the spawn, Config and Seats lines.

## The machine
- No build of the release exe.
- `cargo test` built the debug test binary in `C:\build\lighthouse-target` (the shared target dir).
- His config was read for its shape only, printing no values. O and P, the running app and his pieces folder were not touched.
- New worktree `C:\Consonance\lh-wt-l247` (l247-turbo-preset, clean).

SOURCES: packet_turbo_preset_A_2026-11-26.md; briefs/lighthouse_the_room.md (02:50, 02:56-57, 03:00); main.rs spawn_claude_pane, seat_model_named, merged_config_text, pane_letter, spawn_sibling, spawn_fresh, new_room; persist.log (grep 8bcb0f46, 6e6e002c); Cargo.lock (serde_json); cargo test logs l247_stage1/2/3, l247_roleA/C, l247_final; ui/*.test.js
NEXT: librarian send pane C the diff 1f00fe9a..72d88e09 on l247-turbo-preset when you have read this; then a landing pane lands it and he relaunches with Turbo on to read the falsifier

## Landing (pane A, the chair's 09:14Z order; 2026-11-26 09:15Z to 10:10Z)

**Pushed: room main `366da0d2`.** `git push origin main` gave b78dc852..366da0d2, and `git ls-remote origin main` reads back 366da0d2274f78a94eda3fe5c588852321728219. The push-gate row is `2026-11-26T10:09:47.929Z`, decision allow, scanned `C:\Consonance\lighthouse` origin main (`C:\Consonance\data\push-gate.jsonl`, its last line).

**No train config for the room repo:** `ls C:\Consonance\data | grep train` lists only the dreamzone-3 config, its backup and the ledger. Landed the way B landed L237 (68f7fb69).

**Commits (checked):**
- **00bba6ab**, on 36f490f5: the untracked pane files, by path, one commit. That is A's p-l240, p-l241 (+evidence), p-l242 (+evidence), p-l244 (+evidence) and p-l247 (+evidence), plus C's L245 blur mock and shots and C's L248 before/after page and shots.
  - 103 files, about 26 MB (`du -sh`). The largest file is C's `refactor_before_after.html`, 2.7 MB, under the 6.3 MB already tracked in handback/.
  - A credential-shape grep and an email grep over them found nothing.
  - Not staged: B's `map/B.md` and `p-l243-*`, and `third_place/2026-11-14.laptop.md`.
- **95e772a9** merges l247-turbo-preset 72d88e09 into 00bba6ab (`--no-ff`, no conflict, 5 files, +399 −23).
- The push carried main as it stood. After the merge the librarian, the Third Place and B (L243's hand-back) had committed 6 commits on top, all under `exo_memory/` (`git diff --name-only 95e772a9 main | grep -v ^exo_memory/` is empty). `origin/main` had not moved (`git rev-list --count main..origin/main` = 0 after a fetch).

**The suite, once, on 95e772a9** (`C:\Consonance\lh-wt-l247` detached at the merge, clean before and after; `landing/run.js`, started as `heavy-run.js --status && node run.js` in the background, the process at below normal; js-suite took its own slot, TAP and cargo each ran under `heavy-run --run`). Logs are in `p-l247-turbo-preset-A_2026-11-26_evidence/landing/`.

| check | result | time | source |
|---|---|---|---|
| js-suite.js | **205 green · 3 failed** · 0 crashed · 0 silent · 1 canary · 0 not-run, of 209 | 1,387 s | js-suite.out:211 |
| node --test TAP, the same 209 files one at a time | tests 3,486 · pass 3,468 · **fail 11** · skipped 7; 5 files not exit 0 | 1,284 s | tap-failed.txt |
| cargo test -q | main binary **1,352 passed · 1 failed** · 8 ignored; other targets 22, 77 (3 ignored), 0, 22, 77 (3 ignored), 0 failed; exit 101 | 335 s | cargo-test.out |

**Every red, read:**
- **cargo `intake_light_tests::light_the_librarian_worst_case_intake_is_under_145_000`** (main.rs:10882): "the worst-case light librarian intake is 147663 B, not under 145,000". This is the known intake red. The figure is 147,663 B here against the chair's 147,890 B, and the other intake row is green this run.
- **shelf-recursion** (js-suite and TAP, 1): "git unavailable; cannot cross-check the corpus set". This is the known ENOBUFS red.
- **carrier-drift** (js-suite and TAP, 3): the known red, but it now lists **five** research notes, not three. The two new ones are `clean_ui_design_sources_2026-11-26.md` and `jev_state_and_updates_2026-11-26.md`. checked: the same five, red the same way, at the base 36f490f5 (`landing/reruns.txt`). The landing brought none of them.
- **targetless-pull** (TAP, 4): the declared canary, red on purpose (js-suite counts it as canary).
- **actors.evidence** (js-suite and TAP, 2) is **not on the chair's list**. I pushed anyway, and this is why:
  - The failing check: the Third Place's mount `3d000000-…-3d00` has letter **N** in the live `letters.json`, written at persist.log:2874 on 2026-11-04T07:33:10Z.
  - checked: the same 2 fail at the base 36f490f5.
  - It reads live data that L247 does not write; the running app is the 06:36 build, from before L247.
  - B's L237 landing on L listed it "already red", and the librarian's note at 366da0d2 calls it "known L red".
  - inferred: the chair's list came from D's handoff, and on D the file is declared machine-bound and does not run, so it could not be on that list.
  - **If the chair reads this as the stop condition, it was mine to ask and I did not.** The undo is a revert of 95e772a9.
- **second-vantage** (TAP only, 1): `D632 a commit the claim names that only another repo holds…` (:565) resolved the worktree instead of the temp repo.
  - checked: it was `ok` in js-suite at the same head, and green 43/43 alone at 95e772a9, twice, and at the base.
  - inferred, not shown: the test names the temp repo's commit by a 7-character prefix, so a prefix matching an object in this repo would send it here.
  - Not brought by L247, which touches no file under consonance/tools.

**Not done, as ordered:** no release build and no app restart. C's §4b (Settings trims a padded value the spawn refuses) is left as a later one-liner. His `~/.consonance.json` was not touched.

**The machine:**
- `C:\Consonance\lh-wt-l247` (l247-turbo-preset, landed) and `C:\Consonance\lh-wt-l240` (l247-A: its hand-back blob equals main's, and its map line is now on main) are removed. Both branches are kept, local and on origin.
- `git worktree list | wc -l` went from 32 to 30. The others are not mine to clear in this lap.
- The debug test binary was rebuilt in `C:\build\lighthouse-target`; the release exe was not touched.

NEXT: his one restart, after B's L243 is done; then he turns Turbo on and the falsifier is read: each spawn's `RUN PRESET` plog line against the transcript's model field
