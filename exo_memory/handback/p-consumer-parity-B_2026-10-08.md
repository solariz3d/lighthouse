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

---

# Lap 2 (pane B, 2026-10-08 15:5x): the generator and the manifest, with A's workshop ruling folded in

**Branch `b-gen-lap2` in my lighthouse worktree `C:\Users\nname\Desktop\worktrees\b-d273-src`, from `ea4f5bcf`. Four commits, by named paths, not pushed:**
- `d01955a4`: fresh-history git output; `state-manifest.json` and the root `README.md` ship; the 15 `consonance/tools/jev-*` files are excluded; ferry, board-audit and chain-status fixed; FORK hook point.
- `8c0797fc`: A's ruling. `githooks/pre-commit` and the six composer screens ship, the screens as a scanned `screen` kind; contamination and tj1-k-render excluded; the WORKSHOP declarations.
- `4c9adb78`: an existing row, amended BY NAME (below).
- `ff0b96fe`: dedangle no longer leaves a link pointing at prose.

Every generated tree is a scratch directory, a git repo with no remote and `remote.pushDefault = no_push`. Nothing went to `solariz3d/consonance`.

## The verdict
    THE TRIPLE      P = 10      M = 0      B = 0          (lap 1: 32, 1, 1)
    THE GUARD       I = S − G = 155 − 113 = 42           (lap 1: 154 − 121 = 33)
    RUST            1 parity break                        (lap 1: 24)
Measured on the final generation from `ff0b96fe`, from a clean tree (`gen.json`: staged 367, leaks 0, excluded 36, screens 6, declared JS 16 / Rust 12,
dirty false; generated commit `102d5ebb`). The P list from `ff0b96fe` is identical to the one from `8c0797fc`; the source JS suite was run at `8c0797fc`
(147 green, 6 red: lap 1's 5 shared reds plus `gen-consumer.test.js`, fixed by `4c9adb78`, see "Corrections"). I grew because the 7 Jev and 2 run2
test files are excluded by ruling (`d273/lap2b/I.txt`).

## P, diffed against lap 1's member list (the registered measurement)
- **New members: 0.**
- **Cleared: 22.** reply-slot, second-reader, sources-gate, ask, commit-gate, librarian-cite, pair-ledger, forget-rate, shelf-tier, l2-overseer-worker
  (declared rows, A); attached (git output); contamination, tj1-k-render (excluded, A); jev-judge, jev-module, jev-shadow-runner, jev-variants
  (excluded, ruling 2); ledger-union, state-manifest, state-sync (state-manifest.json ships); state-block (cleared by the git output); about-readme (the
  root README ships).
- **Still P: 10**, every one already on lap 1's list. By first cause, each run alone in the final generated tree (`d273/lap2c/classify.out`):
  - **Need the room's record or its history, even in a git repo (5): candidates for A's workshop class, not ruled yet.**
    - `corpus-age`: "attic is empty", "nothing in loop/ is referenced".
    - `corrections-gate`: its three RED/GREEN cases need correction commits.
    - `librarian-notes`: "exo_memory/librarian/ is missing".
    - `second-vantage`: "repo has a parent commit to pin"; a fresh history has one commit.
    - `shelf-recursion`: "no nested .md files exist".
  - **Product or generator questions (5):**
    - `gen-brief-gate`: gen-brief REFUSES the shipped `exo_memory/BOOT.md`, "the installer build will fail". The shipped BOOT is C's fork material
      this lap, so I left it alone.
    - `sessionstart-state`: "the live generator must not be reporting FAILED".
    - `usage`: deep-equal mismatches, not looked into.
    - `third-place-gate`: the pulse text differs.
    - `gen-consumer.build`: passes alone (exit 0) and is red inside the suite. Not resolved.

## M = 0, B = 0: the cold sweep, CONSONANCE_DATA = an empty directory
| tool | rc | bytes | stack frames | lap 1 | now |
|---|---|---|---|---|---|
| `chain-status.js` | 0 | 192 | 0 | MUTE | SPEAKS: "chain-status: silent — no ledger at <empty dir>\lap.jsonl" |
| `board-audit.js` | 1 | 269 | 0 | FALSE-COLD (read the keeper's board) | SPEAKS: "board-audit: no board at <empty dir>\board.jsonl …"; reads nothing else |
| `ferry.js --due` | 0 | 103 | 0 | BROKEN (`cmd.exe ENOENT`) | SPEAKS: lists the generated repo's own commit as never ferried |
| `carrier-drift.js` | 1 | 4185 | 0 | SPEAKS | unchanged |

## Rust: 24 → 1
`cargo test --no-fail-fast` in the final generated tree: bin **968 passed / 0 failed / 15 ignored** (the 11 declared plus 4 already ignored in source);
`arch_test` 11 / **1 failed** / 1 ignored (the declared one).
- All 11 composer/ready tests pass on the scrubbed screens, and the six screens equal A's acceptance hashes (`sha256sum` printed at generation).
- The 1 left is `every_relative_link_in_the_docs_exists_in_a_fresh_clone`, with **7 dead links, all ship-or-relink decisions**:
  - in the root `README.md`: `jev/README.md` (×2; jev/ is excluded by ruling, so the README needs a relink in source), `METHOD.md`, `INSTRUMENTS.md`,
    `dev/SPINE.md`;
  - in `consonance/README.md`: `AUTONOMY.md` and `../dev/dream/dream_cycle.ps1`, A's line 50.
  - Before `ff0b96fe` it listed 20. The other 13 were the generator's own defect: dedangle rewrote a link's target to prose and kept the link
    syntax, so the README linked to "(a registration in this line of record)". Fixed: such a link becomes its text followed by the prose.

## What changed, by file (all tests first, red on the unchanged code)
- **gen-consumer.js:**
  - **Git output:** `commitFresh()`: `git init -b main`, one commit by `consonance-generator <generator@consonance.invalid>`, dated to the source
    commit, no remote, `remote.pushDefault = no_push`. A directory that already holds a history is refused before anything is written.
  - **MANIFEST:** adds `state-manifest.json`, the root `README.md`, `githooks/pre-commit` (LF; `100644` in the source index too, so there was no exec
    bit to keep) and the screens (`kind: 'screen'`).
  - **The screens:** `descreen()` is A's same-length latin1 map. `scan()` then reads the scrubbed text, so anything the map misses refuses the build,
    and `fixtureKind()` is `'whole'` for the screens directory.
  - **EXCLUDE:** adds the Jev family (15) and the run2 pair with their tests (4).
  - **WORKSHOP:**
    - A's 15 JS rows: `{ skip: "WORKSHOP-BOUND: why" }` in node:test files, and a printing wrapper in the two own-runner files.
    - A's 12 Rust tests: `#[ignore = "WORKSHOP-BOUND: why"]`.
    - One more JS row, `jev-flags.test.js` "L105 PARITY …", which compares with the now-excluded `jev-room.js`, labelled `EXCLUDED-WITH-JEV`.
    - An anchor not found exactly once, or a declared file that does not ship, refuses the build. Applied to the OUTPUT only, so the source suite
      keeps running every declared row.
  - **`FORK_HOOK.apply`:** C's hook point. Not wired: no line from C has arrived.
  - **dedangle:** the link pre-pass described above.
- **ferry.js, ferry-watch.js:** both defaulted to `C:\Consonance\lighthouse`, which **exists on neither machine**: ferry was broken on D too, and the
  suite stayed green only because its tests set `FERRY_REPO`.
  - ferry.js now uses `FERRY_REPO`, else its own checkout.
  - The installed hook uses `FERRY_REPO`, else `~/.consonance.json` `room_path`; with neither, it stays silent.
  - Both find the ledger as `<data dir>/ferry.jsonl`, the data dir taken the app's way (`CONSONANCE_DATA`, then `data_dir`, then `~/.consonance`).
  - On D, `data_dir` = `C:\Consonance\data`, so the ledger path is unchanged here.
  - `ferry-watch.test.js` is new; the hook had no test.
- **board-audit.js:** the same data-dir resolution; a missing board is said in words, exit 1.
- **chain-status.js:** the CLI says why it is silent, on stderr. Stdout, which both pulse hooks read (they read stdout only, checked), is unchanged.

**Tests, green under the lock:**

| file | passing |
|---|---|
| gen-consumer | 72/72 (clean and dirty tree) |
| fixture-scope | 7/7 |
| gen-consumer.build | 7 pass / 4 skipped (its launch probe is off by default) |
| chain-status | 147/147 |
| board-audit | 8/8 |
| ferry | 21/21 |
| ferry-watch | 3/3 |

**Amended BY NAME (rule changed), each with its comment:**
- `chain-status.test.js` "reader: WITHOUT a ledger it prints nothing, writes no stderr, and exits 0".
- `chain-status.test.js` "a ledger with chain rows and NOTHING unwitnessed still exits 0 in silence".
- `gen-consumer.test.js` "L038/A · a dirty tree is REFUSED…": its override build now uses its own directory.

## A's mechanism: adopted, with one difference
- **node:test rows and Rust:** A's mechanism exactly (a skip option in the output; an injected `#[ignore]`).
- **The two own-runner files (forget-rate, l2-overseer-worker):** a generator-side rewrite instead of A's source-header marker. Every declaration
  then lives in ONE list beside EXCLUDE, with the same two-way drift refusal, and no test file changes in the source (I own neither file).
- **A's anti-masking condition (declared only while green in source):** not enforced by the generator, which cannot run tests. The parity run checks
  it: none of the declared rows' files is red in the source suite.
- **A's optional source splits (the arch master-pointer test, the second-reader QS row):** not made; they are source edits outside my files.

## Corrections (mine)
- **The midpoint parity at `d01955a4` (P = 23) was not a clean window.** My uncommitted A-input rows were in the worktree while the source suite ran
  (it showed `gen-consumer.test.js` red). It is reported only as a midpoint; the verdict above is from committed trees.
- **`gen-consumer.test.js` was red in the source suite at `8c0797fc`** (70 of 71). The L038/A row generates twice into one directory; on a CLEAN tree
  the first write now makes a git history, so the second was refused by my own fresh-history rule. It passed in my earlier runs only because my
  worktree was dirty then. Fixed in `4c9adb78`, run green on both a dirty and a clean tree.
- **Three times this lap a heredoc collapsed my `\\` into `\`.**
  - Two test strings and a RegExp in gen-consumer.test.js: caught before any run.
  - The ferry.test path regex: weaker than intended, found by checking it against the old ferry.js.
  - A planted test leak: the scan had exempted it as a SYNTHETIC test path, so I switched it to an identity leak.
  - Backslash files are now written with Write/Edit only.
- A ferry-watch row first passed on base vacuously (no repo, so silence proved nothing). It now asserts the hook speaks before asserting it is silenced.
- **My own script bugs,** caught by `node --check` or by the first run:
  - a misplaced `]` in the WORKSHOP table;
  - an apostrophe-unsafe single-quoted skip reason, switched to JSON double quotes;
  - a node:test row check that expected the call to vanish, when it is kept with the skip option.
- **Two runs outside the lock:** one light single-file `node --test` of jev-flags in the generated tree, and the dry-run checks (no tests).

## Not mine to decide: for the librarian and the keeper
1. **Ship or relink the 7 dead links:**
   - `dev/dream/dream_cycle.ps1` and `consonance/AUTONOMY.md` (A line 50: A would ship AUTONOMY.md);
   - `METHOD.md`, `INSTRUMENTS.md`, `dev/SPINE.md` (lighthouse root docs the root README links);
   - `jev/README.md` ×2 (jev/ is excluded, so the root README needs a relink in source).
2. **The ASK channel** (A line 77): `ask.js` and `ask-surface` ship with no store. ASK is addressed to "the keeper"; whether a new user gets one is the
   keeper's call.
3. **The five record-shaped P members** above (corpus-age, corrections-gate, librarian-notes, second-vantage, shelf-recursion) need A's ruling,
   workshop or product, before a declaration.
4. **`gen-brief` refuses the shipped BOOT** ("the installer build will fail"). That is the shipped BOOT, i.e. C's fork lap, and the installer path.
5. **E's area:**
   - `install.ps1` registers `hooks/jev-flags.js` with Jev retired.
   - `consonance/README.md` still has a Jev section describing tools that no longer ship.
6. **C:** `FORK_HOOK.apply` is the hook point; its one require/call line goes in when C's module lands.

## Leftovers (mine, all scratch)
- Generated trees: `b-d273-gen` (lap 1), `b-d273-gen2`, `b-d273-gen3`, `b-d273-gen4` (the final one).
- `b-d273-src` is on `b-gen-lap2` at `ff0b96fe`, clean.
- In my scratchpad `d273/`: `lap2/`, `lap2b/`, `lap2c/` (the logs) and three target dirs.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_consumer_refresh_2026-10-08.md · C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-consumer-workshop-A_2026-10-08.md
NEXT: chair land b-gen-lap2 (d01955a4..ff0b96fe) and rule the six decisions above when this is read
