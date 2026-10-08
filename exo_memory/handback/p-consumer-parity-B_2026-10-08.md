# D273 lap 1, items 1–2: consumer parity re-run + a contained stranger install (pane B, 2026-10-08 13:1x)

Measure only. Nothing committed, nothing pushed, no consumer checkout was made (the generated tree is not a git repo, so there is no push URL to set).
No window opened, no Windows account made, the keeper's `~/.claude` and `C:\Consonance\data` were never written by anything I ran (one READ by a shipped
tool, `board-audit.js`, is reported below as the defect it is).

## 0 · The window: one commit, a clean tree
- Source: a fresh detached worktree of lighthouse at **`ea4f5bcf`** (`C:\Users\nname\Desktop\worktrees\b-d273-src`), `git status --porcelain` empty, so
  the dirty main checkout (other seats' uncommitted hand-backs) is out of the measurement by construction.
- Generated: `node consonance/tools/gen-consumer.js --out C:\Users\nname\Desktop\worktrees\b-d273-gen --json`, run FROM that worktree:
  `commit.sha ea4f5bcf…, dirty:false, changes:0`; staged 376, missing 0, **leaks 0**, excludeDrift 0, seedDrift 0, unresolved 0, unclassified 0;
  dangling 430 (rewritten), identity 140 (neutralised), machine 16, unportable 32, orphaned 57. Excluded 17. (`gen.json` in my scratchpad `d273/`.)
- Every number below is from that one commit.

## 1 · The verdict
    THE TRIPLE      P = 32      M = 1      B = 1          (09-04: 18, 1, 1)
    THE GUARD       I = S − G = 154 − 121 = 33            (09-04: 74 − 66 = 8)
**REFUTED, and past the registered line.** The plan registered: "if the parity P count is ≤ 18 and the install reaches a first wake, the estimate (2–4
laps) stands. If P > 30 or the install cannot reach a first wake, the estimate is wrong and is re-made from the list, not defended." **P = 32 > 30, and
no first wake was reached** (§5: parked, and blocked on a precondition this run found). Both branches say the same: **the 2–4-lap estimate is wrong.**
The re-made estimate is §6.

## 2 · S, G and I, by name
- `find … -name '*.test.js'` in source → **S = 154**; `git ls-files '*.test.js'` → 154; the two lists are identical (diff empty).
- In the generated tree → **G = 121**.
- `comm -23` → **I = 33**: `consonance/launch.fuse.test.js`, `consonance/launch.park.test.js`, `consonance/tools/catch-ledger.test.js`,
  `consonance/tools/gen-consumer.fixture-scope.test.js`, `consonance/tools/gen-consumer.test.js`, `dev/diversity/{phase-window,redact,s40-strip,score-portable}.test.js`,
  `dev/dream/dream_cycle.test.js`, `dev/headwatch/install_headwatch.test.js`, `dev/place-conversations.test.js`, `dev/stick-apply.test.js`,
  `dev/stick-waiter.test.js`, `dev/tail-carry.test.js`, `dev/vantage/install_vantage.test.js`, `exo_memory/loop/claimrec/{asof,claimrec,score_q3,units}.test.js`,
  `exo_memory/loop/d121_relay/harness.test.js`, `exo_memory/loop/run2/rig/score.test.js`, and all 11 of `jev/test/*.test.js`.
  Since 09-04, **I grew by 25**: the whole `jev/` module (11) and the stick/launch layer (7) were added to source and never to the MANIFEST. (`dev/shell/**`
  now ships, so 09-04's two crash gaps `install.ps1` and `userprompt-submit.js` are CLOSED.)

## 3 · P = 32, every member, by first cause
`node consonance/tools/js-suite.js` (NODE_OPTIONS=--max-old-space-size=4096, under the lock):
- **source** `147 green · 5 failed · 0 crashed · 0 silent · 1 canary · 0 sang · 1 not-run (of 154)`
- **generated** `82 green · 34 failed · 3 crashed · 0 silent · 1 canary · 0 sang · 1 not-run (of 121)`
- Shared reds, not counted: `hooks/dream-gate`, `tools/carrier-drift`, `tools/heavy-run` (it ran while the librarian's harness held the lock), `tools/portable-paths`,
  `tools/sourced`. Canary `targetless-pull` and NOT-RUN `actors.evidence` are the same both sides (amendment 3).
- **P = 37 − 5 = 32.** Each file was then run alone in the generated tree (`d273/classify.out`) and filed by its FIRST cause:

**A · the generated tree is not a git checkout (7)**: `tools/attached` ("test requires the repo to be a git checkout"), `tools/corrections-gate`,
`tools/corpus-age`, `tools/jev-variants`, `tools/librarian-notes` (`git ls-files` fatal), `tools/second-vantage` ("repo has a parent commit to pin"),
`tools/shelf-recursion` ("git unavailable"). *Fix in the generator: init the output as a fresh-history repo (the last lap does this anyway).*

**B · the workshop record, absent by design (12)**: `hooks/reply-slot` and `hooks/sources-gate` ("PLAN: the plan the hook cites exists"), `hooks/second-reader`
(`loop/plan_second_reader_d203_2026-10-01.md`), `tools/ask` (`exo_memory/ASK.md`, a fixture), `tools/commit-gate` (real `loop/packet_*.md`; also
`consonance/githooks/pre-commit` not shipped), `tools/contamination` and `tools/tj1-k-render` (CRASH: `exo_memory/loop/run2/rig/score.js`),
`tools/librarian-cite` ("no dated librarian notes"), `tools/pair-ledger` (16 seed pairs), `tools/forget-rate`, `tools/shelf-tier` (the record is 524 B
against a 345,097 B system), `dev/shell/hooks/l2-overseer-worker` (a registry entry). *These test the room's record, not the product: they need a declared
WORKSHOP-BOUND class (the JS suite already has MACHINE-BOUND), or their fixtures shipped — never a softer bar.*

**C · files the MANIFEST does not ship (7)**: `consonance/state-manifest.json` → `tools/ledger-union`, `tools/state-manifest`, `tools/state-sync`;
the `jev/` module → `tools/jev-judge`, `tools/jev-module`, `tools/jev-shadow-runner` (`jev/lib/config.js`, `jev/lib/prompt.js`, `consonance/jev-room/.jev/config.json`);
the root `README.md` → `ui/about-readme` (CRASH).

**D · the generator's rewrite changed behaviour, or unexplained (6), each needs its own look**: `tools/gen-brief-gate` (**"gen-brief REFUSED against the
current exo_memory/BOOT.md — the installer build will fail"**: the shipped BOOT trips gen-brief's own guard), `tools/gen-consumer.build` (its control crate no
longer parses: "unexpected key or value, expected newline, `#`"), `tools/state-block`, `tools/usage`, `hooks/sessionstart-state` ("the live generator must
not be reporting FAILED"), `dev/shell/hooks/third-place-gate` (the pulse text differs).

## 4 · M = 1, B = 1: the cold sweep inside the generated tree, `CONSONANCE_DATA` = an empty directory
Universe unchanged: the five names in `consonance/README.md`'s table.

| tool | rc | bytes | stack frames | class |
|---|---|---|---|---|
| `chain-status.js` | 0 | **0** | 0 | **MUTE** (unchanged since 09-04) |
| `board-audit.js` | 0 | 340 | 0 | SPEAKS, **FALSE-COLD**: "board: 146512 rows parsed … (C:\Consonance\data\board.jsonl)" with an empty CONSONANCE_DATA |
| `ferry.js --due` | 1 | 1566 | **4** | **BROKEN** |
| `carrier-drift.js` | 1 | 4185 | 0 | SPEAKS (red on its own findings; the `undefined of them inside the scanned corpus` key is still there) |
| `js-suite.js` | 1 | (the run above) | 0 | SPEAKS |

**B's root cause, found this time** (09-04 recorded only the symptom): `ferry.js:55` returns `process.env.FERRY_REPO || '%CONSONANCE_HOME%'`. The generator
rewrote a machine path into a **Windows env placeholder that nothing in JS expands**, so `execSync` gets a cwd that does not exist and Node reports it as
`spawnSync C:\WINDOWS\system32\cmd.exe ENOENT`. The same literal is live in the hook `consonance/hooks/ferry-watch.js:47`. It reproduces outside my runner.

## 5 · The stranger install, step by step (contained)
Containment, all measured, not assumed: the app takes home, data, instances and rooms from `USERPROFILE` (`main.rs:64` `home()`, `:739` `default_data()` =
`%USERPROFILE%\.consonance`, `:736`, `:3442`); `install.ps1` writes only under `$env:USERPROFILE\.claude`; `claude auth status` reported its
`configDirectory` as the scratch home. Scratch home = `d273\stranger\home`, data = `d273\stranger\data`. **My own shell carries the keeper's `AMBIENT_*`,
`CONSONANCE_*` and Claude session variables**; the first hook run showed "Regina, SK" from them, so every later stranger step ran with them scrubbed (the code's
default is Greenwich, and that is what a scrubbed run printed).

1. **Front door.** The generated root has **no `README.md`**, only `CONSUMER-STATUS.md` ("STATE: UNMEASURED … Run the GATE line"). `consonance/README.md`
   links `../README.md` (absent). The new-user path is `consonance/GUIDE.md`.
2. **Prerequisites (GUIDE §1)**: Rust 1.96.0, tauri-cli 2.11.3, WebView2 154, VS 2022, Claude Code 2.1.292, Node 24 were all present here. **GUIDE does not
   list Python or Node**, and a registered hook runs under Python (`userprompt_pulse.py`); `install.ps1` finds `python.exe` under `%LOCALAPPDATA%\Programs\Python`,
   and with none it writes the placeholder `'<path to python.exe — none found outside the Store stub>'` (`install.ps1:758`).
3. **Build (GUIDE §1)**: `cargo tauri build --no-bundle` in `consonance/` → **exit 0, 1 m 43 s, `consonance.exe` 15,575,552 B**, with BOOT/SEED/the briefs,
   GUIDE, README, cards, spread, research and record copied beside it. (The NSIS bundle was not built.) **Builds.**
4. **Hooks: GUIDE never mentions them.** A stranger following GUIDE gets **no hooks and no gates**. Running `dev/shell/install.ps1` (named only in
   `consonance/README.md`) as the stranger:
   - (a) fresh home → copied 35 files into `~/.claude/shell`, then **refused: "NO settings.json … refusing to create one"**, exit 1. A fresh Claude Code
     install has no `settings.json` until a setting is changed, so a new user is stopped here.
   - (b) with `{}` as `settings.json` → **19 hooks added across 6 events, 3 excluded by ruling**, a backup written, exit 0.
   - (c) `-Check` → exit 0: 35 of 35 files in place, 19 registered, 0 declared-not-registered.
   - **The gates registered on day one**: `sources-gate` (PreToolUse on call_librarian|call_chair|chair_inject), `second-reader`, `dispatch-gate`, `push-gate`,
     `delete-gate`, the reply slot `reply-slot` (Stop), plus `sourced-stop`, `ask-ending`, `carrier-drift-watch`, the ready pair, session-start/-end, precompact ×2,
     `sessionstart-state`, `findings-return`, `jev-flags`, the Python pulse.
5. **THE BLOCKER for a contained first launch: five registered hooks default to the keeper's paths**, not to the app's data dir:
   `sessionstart-state.js:42` (`CONSONANCE_DATA || 'C:\\Consonance\\data'`, and it APPENDS a ledger there), `findings-return.js:81-84`, `sourced-stop.js:88`
   (appends `sourced_ledger.jsonl`), `precompact-preserve.js:66`, and `session-start.js:50` (`INSTANCES_DIR` = `C:\Consonance\instances`). The app REMOVES
   `CONSONANCE_DATA` from the panes it spawns (D098, `main.rs:12744`), so in a real pane these always fall back. **On this machine a stranger's first pane would
   write into the keeper's `C:\Consonance\data`; on a stranger's machine they write to a `C:\Consonance` the app never reads (its data is
   `%USERPROFILE%\.consonance`).** I fired only the two SessionStart hooks, with every seam pointed at scratch: `session-start.js` gives the ambient block
   (Greenwich default, shown with local times, so "Sunrise 12:12 AM"); `sessionstart-state.js` printed nothing and ledgered `skipped: source not in compact`.
6. **Login**: `claude auth status` under the stranger config → `"loggedIn": false, "authMethod": "none"`. Every pane needs the user's own interactive
   `claude` login first. Not done (it is the person's).
7. **What the first wake would read** (from code, the app not run): with no `~/.consonance.json`, `default_room()` (`main.rs:420`) picks the **bundled
   `SEED.md`** (beside the exe; 9,715 B). GUIDE §2 tells the user to set the Startup brief to `exo_memory/BOOT.md`, which makes `repo_root()` take the repo and
   the wake read **BOOT.md** (39,631 B, the keeper's room). Which of the two a new user should wake into is C's fork question, not mine to decide.
8. **PARKED for the keeper's say-so: the visible first launch.** What it needs, in order:
   (i) the five hook defaults fixed (§5.5) OR a machine with no `C:\Consonance` (both D and L have one), else a pane writes into the keeper's data;
   (ii) a stranger `claude` login under the scratch home;
   (iii) then `consonance.exe` from `d273\target-gen\release\` launched with `USERPROFILE`/`HOMEDRIVE`/`HOMEPATH` = `d273\stranger\home`, the
   `AMBIENT_*`/`CONSONANCE_*`/`CLAUDE_*` variables scrubbed, off-screen while the keeper is at the PC: Settings (§2 of GUIDE), Spawn briefed, one turn,
   then read what the hooks wrote.
   It opens a window and takes focus, so it was not run.

## 6 · The estimate, re-made from the list (not defended)
- **Lap 2, the generator and the manifest (mechanical, ~14 of P plus B and part of the install):** output a fresh-history git repo (A, 7); ship
  `state-manifest.json`, `jev/` (or exclude it with its tests, by ruling), a root `README.md` (C, 7); replace `%CONSONANCE_HOME%` with real resolution (`ferry.js`,
  `ferry-watch.js`: B → 0); `chain-status` MUTE and `board-audit` FALSE-COLD (M → 0).
- **Lap 3, the install path:** the five hook defaults resolve the data dir as the app does (§5.5); `install.ps1` creates an empty `settings.json` with a
  clear line, or GUIDE says to; GUIDE gains the hooks step and Python and Node as prerequisites; the four D items that are the generator's (gen-brief-gate,
  gen-consumer.build, state-block/usage) looked at one by one.
- **Lap 4, a WORKSHOP-BOUND class on both suites:** the 12 B files and about 20 of the 24 Rust parity breaks (below) test the room's record, not the product.
  Declared, not deleted, with the composer/ready screen fixtures SHIPPED (they are product fixtures).
- **Lap 5, with the keeper:** the visible first launch and a first wake (§5.8), and C's fork paragraph in place.
- **Lap 6, the plan's last lap:** generate, a cold stranger read, push with fresh history.
- **So 5 laps, range 4–6**, where the plan said 2–4. Lap 4 is the uncertain one: a declared class is fast, but each of the 12 needs a ruling that it is
  workshop and not a product defect hiding behind the label.
- *Registered for the next run of this instrument, as 09-04 asked:* the member list above IS the measurement, and the next run diffs against it.

## 7 · The Rust side (not in the triple)
`cargo test --no-fail-fast` (its own target dirs):
- **source**: bin 979 passed / 0 failed, `arch_test` and the rest green, exit 0.
- **generated**: bin 957 passed / **22 failed**, `arch_test` 11 / **2 failed**. **24 Rust parity breaks**, all green in source:
  - composer/ready screen fixtures missing (11): `composer_tristate_tests::*` (7) and `ready_signal_tests::*` (4), "the real-screen fixture: … cannot find the path";
  - the workshop corpus (9): `shelf_tests::*` (journal index, loop/, map/, librarian notes);
  - `managed_cwd_tests::the_map_walk_reaches_the_repo_maps_when_no_data_dir_map_exists` (no `exo_memory/map`: by design, as on 09-04);
  - `publish_at_close_tests::the_unattended_exit_waiter_never_publishes` (reads `dev/stick-waiter.js`, not shipped);
  - `arch_test::every_relative_link_in_the_docs_exists_in_a_fresh_clone` (the README's links) and
    `arch_test::the_master_keeps_one_pointer_line_and_the_dated_tail_lives_in_the_journal_index`.
  - 09-04's `repo_root_tests::the_checkout_resolves_wherever_this_source_actually_is` (the generated binary resolving to the private tree) is **no longer red**.

## Leftovers, all mine, all scratch
Worktrees: `b-d273-src` (lighthouse, detached at ea4f5bcf, clean; remove with `git worktree remove`) and `b-d273-gen` (not a repo). In my scratchpad `d273/`:
the logs (`suite-*.out`, `cargo-*.out`, `classify.out`, `sweep-*.out`, `install-[ABC].out`, `hook-*.out`, `claude-auth.out`), two target dirs and the stranger
home and data. Nothing was written outside them.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_consumer_refresh_2026-10-08.md · C:\Users\nname\Desktop\lighthouse\exo_memory\loop\consumer_parity_2026-09-04.md
NEXT: chair re-plan D273 from §6 when this is read
