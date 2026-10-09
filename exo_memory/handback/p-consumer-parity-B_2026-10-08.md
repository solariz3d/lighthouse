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

---

# Lap 3 (pane B, 2026-10-08 16:2x): item 1 committed; items 2 and 3 wait on A, C and E

**Commit `65649d20`** on branch `b-gen-lap3`, worktree `C:\Users\nname\Desktop\worktrees\b-d273-lap3`, from lighthouse main `ab25d588`. Three named
paths, not pushed.

## Item 1: the librarian's ruling 1
- **SHIP:** `METHOD.md`, `INSTRUMENTS.md`, `dev/SPINE.md`, `consonance/AUTONOMY.md`, four `kind: 'prose'` MANIFEST lines. All four pass the scan:
  a dry run gives staged 374, **leaks 0**, not refused.
- **RELINK in source:** the root README's two `jev/README.md` links (`README.md:109`, `:268`) come out. Each keeps the path as code text, "in the
  development tree", because the dev repo still has the page. Both edits are outside the About block (`:11`–`:83`), and `ui/about-readme.test.js` passes.
- **Not touched:** `consonance/README.md` (E's), and the generator's `FORK_HOOK` point (C's line goes there).
- **Tests:**
  - New row: "D273 lap 3: METHOD.md, INSTRUMENTS.md, dev/SPINE.md and consonance/AUTONOMY.md ship through the scan, and the README links no
    excluded jev/README.md".
  - Red on `ab25d588`: the new row failed, 72 others passed.
  - Green, under the lock: gen-consumer **73/73**, about-readme 1/1.
- **What it should clear:** five of lap 2's seven dead links in `arch_test::every_relative_link…`. The other two are E's (`AUTONOMY.md` now ships,
  so that link resolves; the `dream_cycle.ps1` line is E's to remove from `consonance/README.md`). That is a prediction, measured in item 3.

## Items 2 and 3: pending
- **Item 2:** A's lines for the five record-shaped members (corpus-age, corrections-gate, librarian-notes, second-vantage, shelf-recursion) are not
  here yet. They fold into `WORKSHOP` (or ship a fixture) when A hands them over.
- **Item 3:** the parity re-run on main, diffed against lap 2's member list (`d273/lap2c/Plist.txt`, the 10), once C, A and E land.
- **Registered before the run:** the target is (P, M, B) = (0, 0, 0), or every leftover declared with a reason, and Rust 0 (the docs-link test green).
  - Not met if any lap-2 member is still red undeclared after A's lines land.
  - Not met if a member is new.
  - Not met if the docs-link test lists any link.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\loop\plan_consumer_refresh_2026-10-08.md
NEXT: B parity re-run on main and diff against lap 2's list when C, A and E have landed

---

# Lap 3 parity (pane B, 2026-10-08 17:3x): (P, M, B) = (0, 0, 0), Rust 0

**Branch `b-gen-lap3p`, worktree `C:\Users\nname\Desktop\worktrees\b-d273-lap3p`, from lighthouse main `8d06859c`. Three commits, named paths, not pushed:**
- `1f3da88d`: A's patch, C's three EXCLUDE rows, two rows amended BY NAME.
- `f83d13cd`: two manifest gaps the parity run found.
- `ff02c1dd`: the last four consumer-only reds (three causes).

## The verdict (registered in the "Lap 3" section before the run)
    THE TRIPLE      P = 0       M = 0       B = 0         (lap 2: 10, 0, 0)
    THE GUARD       I = S − G = 161 − 117 = 44
    RUST            0 parity breaks                       (lap 2: 1)
**The target is met.** Every lap-2 member is cleared, there are no new members, and the docs-link test is green.

Measured on the generation from `ff02c1dd`, a clean tree (`gen.json`: staged 376, leaks 0, excluded 39, screens 6, declared JS 27 / Rust 12, forked 28;
generated commit `46616cd3`, no remote).

| run | result |
|---|---|
| source `js-suite` | 153 green · 6 failed · 1 canary · 1 not-run (of 161) |
| generated `js-suite` | 109 green · 6 failed · 1 canary · 1 not-run (of 117) |
| generated `cargo test` | bin **977 passed / 0 failed** / 15 ignored (11 declared + 4 ignored in source too); `arch_test` **12 / 0** / 1 ignored (declared); exit 0 |
| source `cargo test` | exit 0 |

- **The generated tree's 6 reds are exactly the source's 6**, so they are shared, not P: `hooks/dream-gate`, `tools/carrier-drift`, `tools/heavy-run`
  (it ran while another seat held the lock), `tools/portable-paths`, `tools/sourced`, and **`tools/install-only` (red in source since E's lap-3
  landing; not mine, flagged for E)**.
- **Cold sweep, `CONSONANCE_DATA` = an empty directory:** chain-status rc 0, 194 bytes; board-audit rc 1, 271 bytes ("no board at …"); ferry --due
  rc 0, 105 bytes; carrier-drift rc 1, 4187 bytes. **0 stack frames in each.** Logs: `d273/lap3z/`.

## P, diffed against lap 2's member list (`d273/lap2c/Plist.txt`, the 10)
| lap-2 member | cleared by |
|---|---|
| corpus-age, librarian-notes, second-vantage, shelf-recursion | A's declared rows (A's patch), proved by A's synthetic twins |
| corrections-gate | A's catch: `CODE_KEPT` restores `GUARDED = [/muscle_map\.md$/i]`, which dedangle had rewritten into a regex matching nothing; B's row compares the generated gate with the source by behaviour |
| gen-brief-gate | C's lap-3 landing (`6424a290`) |
| usage, third-place-gate | decoordinate now maps America/Regina to America/Costa_Rica (UTC-6, no daylight time, the same clock all year) instead of America/New_York, which had changed what their time assertions meant |
| gen-consumer.build | the OS-user rule no longer reads the control crate's `'[package]\nname = …'` as "nname" (it had written `'\other = …'`, which cargo refused). One regex, `NNAME_RE`, skips a match only when a backslash precedes it AND `=` follows it, for the scan and the three rewrites. Real paths with single or double backslashes are still taken; the new row checks both |
| sessionstart-state | `state-block.js` said "FAILED: git rev-list did not run here" in any history without `origin/main`, i.e. a stranger's first checkout. It now says so in words; FAILED stays for git itself failing (the empty-directory row still sees exactly three) |

## What was asked and done
1. **A's patch** (`lap3_generator.patch`), applied as given: 11 WORKSHOP rows and `CODE_KEPT`.
   - **The test asked for:** a new row in gen-consumer.test.js loads `GUARDED` from the source and from the GENERATED `corrections-gate.js` and checks
     both match the same six paths. It was red before the patch ("the generated gate guards a different set of files").
2. **C's three EXCLUDE rows**, with C's reason strings. The new row checks each is reached and withheld; it was red before.
3. **Parity re-run:** above.

## What the run found beyond the list, all fixed test-first (red, then green)
- **Two manifest gaps (`f83d13cd`):**
  - `consonance/src-tauri/brief/frag-fork.md`: C's fork-note template. `main.rs`'s fork test `include_str!`s it, so the generated tree's tests did
    not compile (cargo exit 101, "couldn't read src\../brief/frag-fork.md"). It ships byte for byte, pinned by a row.
  - `dev/shell/install-fresh-home.test.js`: E's test of the shipped `install.ps1`. It was in I; it ships now and passes in the generated tree.
- **The three causes in `ff02c1dd`** (table above). `state-block.js` / `state-block.test.js` are outside gen-consumer, and no seat named them this lap.
  The change is one line of logic, and this machine's own REPO line is unchanged ("268 commit(s) unpushed").

**Amended BY NAME (rule changed by A's declarations), each with its comment:**
- gen-consumer.test.js "the declared JS rows (15 of A + 1 Jev) …": now 26 of A + 1, 27 in all.
- fixture-scope "the 2026-08-23 casualties survive the REAL build byte-intact": each file is now compared with its source plus only the
  generator's own declarations (`second-vantage.test.js` carries two). Any other transform still fails it, and its isFixture mutation proof still holds.

**Tests, green under the lock at `ff02c1dd`:**

| file | passing |
|---|---|
| gen-consumer | 79/79 |
| fixture-scope | 7/7 |
| gen-consumer.build | 7 pass / 4 skipped (its launch probe is off by default) |
| state-block | 24/24 |
| corrections-gate (at `1f3da88d`) | 6/6 |

## Corrections (mine)
- **A `\n` inside a `String.raw` test name became a real newline in the name.** Caught in the red listing; fixed to `\\n` before the green run.
- **My script for the nname fix threw on its second step, after it had already written the generator change.** The generator edit was correct,
  checked by direct calls and a dry run (0 leaks); the rename was redone with Edit.
- **The midpoint parity at `1f3da88d` (P = 4) could not run cargo in the generated tree** (the frag-fork gap). The Rust result above is from `ff02c1dd`.
- **This lap I measured the build test from the wrong directory.** My lap-2 classify ran it from the repo root, where its oracle row passes;
  js-suite runs each file from its own folder, where that row runs. So lap 2's "passes alone, red in the suite" was a cwd difference, not flakiness.

## For the librarian and E
- `tools/install-only.test.js` is red in source at `8d06859c` (shared, so it does not count toward P). It is E's install area.
- The 6 shared reds are source-side workshop debt; parity does not count them.
- Lap 4 (the visible first launch with the keeper) and lap 5 (generate, cold read, push) are next by the plan. The generated tree from `ff02c1dd` is
  `C:\Users\nname\Desktop\worktrees\b-d273-gen7` (a no-remote repo, `pushDefault no_push`).

## Leftovers (mine, all scratch)
- Generated trees `b-d273-gen5` to `b-d273-gen7`.
- Worktrees `b-d273-lap3` (item 1, landed) and `b-d273-lap3p` (this, clean at `ff02c1dd`).
- Logs: `d273/lap3/`, `lap3f/`, `lap3z/`.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-consumer-fork-C_2026-10-08.md · C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-consumer-workshop-A_2026-10-08.md
NEXT: chair land b-gen-lap3p (1f3da88d..ff02c1dd) when this is read

---

# GATES row (pane B, 2026-10-08 17:5x)

**Commit `e8d168d0`** on branch `b-gen-gates`, worktree `C:\Users\nname\Desktop\worktrees\b-d273-gates`, from lighthouse main `5623199c`. Two named
paths (`gen-consumer.js`, `gen-consumer.test.js`), not pushed.

## What changed
1. **`consonance/GATES.md` ships**, as one `kind: 'prose'` MANIFEST row. It was ruled to ship in lap 2 and the row never landed, so in the consumer
   every refusal of sources-gate and the reply slot pointed at a missing file. C's identity-diff found it.
   - **The new row checks:** the file ships, with no leak; and the GENERATED `sources-gate.js`'s own `gatesDocFrom()`, given the generated tree's
     `exo_memory/BOOT.md`, resolves the refusal pointer to the shipped `consonance/GATES.md`.
   - **Its control:** both hooks still name GATES.md.
2. **EXCLUDE:** `consonance/tools/identity-diff.js` and `identity-diff.test.js`. Like consumer-relabel, they replay gen-consumer.js against the dev
   tree, and neither ships.
3. **C's optional item 3, done because it was small:**
   - `shippedSets(files)` is exported and `build()` uses it; a row checks its card set equals `build()`'s `linkTargets`.
   - identity-diff can now read the two sets instead of copying `build()`'s expressions. Switching it over is C's file.

**Tests:**
- Red first: the 3 new rows failed, 79 others passed.
- Green under the lock:

  | file | passing |
  |---|---|
  | gen-consumer | 82/82 |
  | fixture-scope | 7/7 |
  | gen-consumer.build | 7 pass / 4 skipped (its launch probe is off by default) |
  | identity-diff | 6/6 |

## Parity holds: (P, M, B) = (0, 0, 0), Rust 0
On the generation from `e8d168d0`, a clean tree (`gen.json`: staged 377, leaks 0, excluded 41, declared JS 27 / Rust 12; generated commit `3f6ced46`,
no remote). GATES.md ships at 4,862 bytes. S = 162, G = 117, I = 45 (I grew by the 2 identity-diff files excluded here).

| run | result |
|---|---|
| source `js-suite` | 154 green · 6 failed (of 162) |
| generated `js-suite` | 109 green · 6 failed (of 117) |
| generated `cargo test` | bin **977 / 0** / 15 ignored, `arch_test` **12 / 0** / 1 ignored; exit 0 |

- The generated tree's 6 reds are exactly the source's 6, so they are shared and **P = 0**: dream-gate, carrier-drift, heavy-run, install-only,
  portable-paths, sourced.
- Cold sweep, `CONSONANCE_DATA` = an empty directory: chain-status rc 0, 194 bytes; board-audit rc 1, 271 bytes; ferry rc 0, 105 bytes; carrier-drift
  rc 1, 4,187 bytes. **0 stack frames in each, so M = 0 and B = 0.**
- **C's identity-diff on this tree** (`node consonance/tools/identity-diff.js --gen <the generated tree>`): **"PASS — 76 wake files compared; 0
  unregistered difference(s)"**, exit 0. The plan's next step (C re-runs it on main, target exit 0) is predicted to pass. 76 = C's 75 + GATES.md.
- Logs: `d273/gates/`.

## Leftovers
- Generated tree `b-d273-gen8`.
- Worktree `b-d273-gates`, clean at `e8d168d0`.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-consumer-fork-C_2026-10-08.md
NEXT: chair land b-gen-gates (e8d168d0) when this is read; then C re-runs identity-diff on main, target exit 0

---

# Lap 4 (pane B, 2026-10-08 19:1x): the cold read's generator items, plus C's rows and the A1 root cause

**Branch `b-gen-lap4`, worktree `C:\Users\nname\Desktop\worktrees\b-d273-lap4`.** Started from main `29d9b1fe` and **rebased onto main `d4166304`**
(C's and E's lap 4). Four commits, named paths, not pushed:
- `2a42f248`: A1/A2, A4, A13, A14, A15.
- `b8a1668e`: C's three EXCLUDE rows.
- `4fa81cd2`: A1 revised at the root.
- `bd861f8e`: front-door-links' evidence row declared; the TRAINING.md note handed to C.

## The verdict: parity holds
    THE TRIPLE      P = 0       M = 0       B = 0
    THE GUARD       I = S − G = 164 − 125 = 39          (lap 3 parity: 161 − 117 = 44; the six stick/launch tests now ship)
    RUST            0 parity breaks
    IDENTITY-DIFF   PASS — 73 wake files compared; 0 unregistered difference(s), exit 0
Generation from `bd861f8e`, a clean tree: staged 390, leaks 0, excluded 44, declared JS 28 / Rust 12, forked 68; generated commit `fb3de377`, no remote.

| run | result |
|---|---|
| source `js-suite` | 157 green · 5 failed (of 164) |
| generated `js-suite` | 118 green · 5 failed (of 125) |
| generated `cargo test` | bin **987 / 0** / 15 ignored, `arch_test` **12 / 0** / 1 ignored; exit 0 |

- The generated tree's 5 reds are exactly the source's 5: dream-gate, carrier-drift, heavy-run, portable-paths, sourced. (`install-only` went green on
  main with E's merge fix.)
- Cold sweep, `CONSONANCE_DATA` = an empty directory: all four tools speak, with 0 stack frames each.
- Logs: `d273/lap4z/`.

## What was done, by finding (test first each time: red, then green)
- **A1/A2, the repo URL and the clone folder. Revised at the root, per the chair's second input.**
  - **Root cause:** the handle rule (`rep(/solariz3d/gi, …)`) rewrote the handle INSIDE URLs.
  - **The fix:** `HANDLE_RE`, used by the scan and both identity rewrites, skips the handle exactly where it sits in `github.com/solariz3d/<repo>`.
    `github.com/solariz3d/lighthouse` (where E's GATES.md evidence links point) and `github.com/solariz3d/consonance` therefore survive intact, and
    every other use of the handle is still taken.
  - It is exported, so identity-diff's replay counts it (identity-diff passes).
  - `consumerNames()` makes only the README's own clone instructions the consumer's: `git clone https://github.com/solariz3d/consonance.git`, then
    `cd consonance/consonance`.
  - **This replaced my first version (in `2a42f248`), which rewrote every lighthouse URL to consonance.**
  - **The test:** no generated `github.com/<owner>/` URL holds a space; both repos survive `deidentify`; the README keeps its lighthouse link.
  - **Not covered:** a bare non-URL mention such as `gh repo view solariz3d/lighthouse` still becomes "the keeper/lighthouse". It is not a URL, so
    it is left alone.
- **The app id** (found on the way): every `com.solariz3d.consonance` becomes `com.consonance.app`. `stick-waiter.js`'s single-quoted copy had become
  `'com.the keeper.consonance'`; it now matches the id `tauri.conf.json` carries, which a row checks.
- **A4, the doubled placeholders:** when a link's TEXT is the record path itself, the prose is written once. The row checks both forms and sweeps the
  tree for "(a … in this line of record) (a … in this line of record)".
- **A13, the USB mode ships, scanned:**
  - The files: `dev/stick-apply.js`, `stick-waiter.js`, `tail-carry.js`, `place-conversations.js` (tail-carry requires it), `LEAVING.ps1`,
    `ARRIVING.ps1`, `ON-EXIT.ps1`, `consonance/launch.ps1`, and the six tests (stick-apply, stick-waiter, tail-carry, place-conversations,
    launch.fuse, launch.park). All pass the scan and pass in the generated tree.
  - **Source edits:** `LEAVING.ps1` and `ARRIVING.ps1` looked for the repo in a list of this room's two checkout paths, which the generator could only
    turn into a `%CONSONANCE_HOME%` placeholder. They now take it from `~/.consonance.json`'s `room_path`, as the app does. That is checked by
    PowerShell's own parser, plus a run of the lookup:
    - on this machine → `C:\Users\nname\Desktop\lighthouse`, the same as before;
    - with a temp config → that checkout.
  - `launch.ps1`'s one "OneDrive" comment is reworded (the scan refuses it).
- **A14, catch-ledger.js and resonance:**
  - `NOT_SHIPPED`, an anchored named rewrite: where `consonance/tools/README.md` names catch-ledger.js, the consumer copy says the original room's
    repository carries it.
  - `tools/README.md:7` now says `resonance/atoms.jsonl` is in the data folder (a source edit, true in dev too).
  - **TRAINING.md came OUT of `NOT_SHIPPED`:** identity-diff counted that note as unregistered, because TRAINING.md is wake material and no
    registered step changed it. Its lines are C's (below).
- **A15, CONSUMER-STATUS:** the GATE line says the gate runs in the source repository, which carries the generator it drives. Both renderers changed
  identically, and the drift guard still passes.
- **C's three EXCLUDE rows, verbatim:** `memory/split-the-work-with-the-panes.md`, `memory/frozen-is-not-dead.md`,
  `cards/dont-offer-rest-assume-momentum.md`. The new row checks that a generated `memory/` holds only `MEMORY.md`, with no entries. `inheritance/`
  keeps shipping, untouched.
- **E's new `front-door-links.test.js`** was red only in the consumer. Its row "GATES.md documents six gates, each with how to turn it off, and its
  evidence links name paths in this tree" asserts that the evidence files exist in the tree, and they are the keeper's record. **Declared
  WORKSHOP-BOUND, for A's ruling.** E splitting the row would keep its product assertions (six gates, how to turn each off) running in the consumer.

**Amended BY NAME (rule changed), each with its comment:**
- `L038 · memory/ ships exactly the six…`: now pins `[MEMORY.md]`.
- The `L038` wiki-link row's set assertion: it used `frozen-is-not-dead` as its memory-only example; it now asserts the same set on `shippedSets()`
  with a synthetic card.
- The declared-rows count: now 28.

**Revised (this lap's own rows, not yet landed):** the A1/A2 row, and the A14 row, which no longer expects the TRAINING note.

**Tests, green under the lock at `bd861f8e`:**

| file | passing |
|---|---|
| gen-consumer | 89/89 |
| fixture-scope | 7/7 |
| gen-consumer.build | 7 pass / 4 skipped |
| identity-diff + front-door-links + consumer-relabel | 27/27 |
| the six stick/launch test files (in source) | 22/22 |

## For E: exact lines (E owns these files; for links, the lines rather than an edit)
- **`consonance/GUIDE.md:112-114`** names `PLAN.md`, `PROGRESS.md`, `DESKTOP_HANDOFF.md`.
  - **My call: they do NOT ship.** All three fail the generator's scan: `consonance/PLAN.md` MACHINE 3, `consonance/PROGRESS.md` MACHINE 1,
    `DESKTOP_HANDOFF.md` MACHINE 2. By the ruling, a doc ships only if it passes the scan.
  - PROGRESS.md was last touched 2026-07-27, and DESKTOP_HANDOFF.md is this room's machine-carry note. So **E drops the three lines.**
- **`consonance/README.md:49-50`** says brief/ holds "9 `.md` files … two fragments `frag-pointer.md` and `frag-traces.md`". Neither ships, and the
  app never reads either (`grep frag-pointer main.rs` = 0); brief/ ships `frag-fork.md`. Correct the count and the names.
- **`consonance/README.md:201`**: "The librarian's intake is a `CLAUDE.md`…". There is no `CLAUDE.md` in the tree; it is the file the app writes into
  each seat's directory. Say so.
- **`README.md:109`, `:268`**: the `jev/README.md` mentions (code text since lap 3; the cold read's A5 reads them as dead). Drop or keep as E sees fit.
- **`front-door-links.test.js`**: split the evidence row (see above).
- **E's USB-mode setting** (`p-usbmode-E`): the stick scripts now ship, so the setting has something to run in the consumer.

## For C
- **`exo_memory/TRAINING.md:90`, `:92`, `:101`** still present `catch-ledger.js` as if it were in the tree, and it does not ship. It is wake material:
  a relabel site in C's table (e.g. "(in the original room's repository; this copy does not carry it)"), so identity-diff counts it.

## Corrections (mine)
- **A1's first version was wrong for E's evidence links.** Rewriting every lighthouse URL to consonance would have pointed GATES.md's evidence at the
  wrong repository. Revised at the root, per the chair's input, in `4fa81cd2`.
- **C's rows went in before their test** (my order slip). I saved them as a patch, reverted, ran the row red, and re-applied.
- **I stopped two parity runs** whose tree was superseded mid-lap (`bubtuxra3`, `bcg0iico3`). Each left a stale lock, which the next holder took over;
  no orphan process was left (checked).
- **One build-gate run showed 6 pass / 5 skipped:** I hadn't put cargo on PATH for that step. Re-run with it: 7 / 4.
- **A backtick inside my row-writing template ended it early.** `node --check` caught it before anything was written.

SOURCES: C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-consumer-coldread-LIB_2026-10-08.md · C:\Users\nname\Desktop\lighthouse\exo_memory\handback\p-consumer-fork-C_2026-10-08.md
NEXT: chair land b-gen-lap4 (2a42f248..bd861f8e, on main d4166304) when this is read; route the E and C lines above


# Lap 5 (pane B, 2026-10-09 04:3x): cold read 2's generator items, E's launch.vbs, and the parity they exposed

**Branch `b-gen-lap5`, worktree `C:\Users\nname\Desktop\worktrees\b-d273-lap5`.** It is rebased onto main `6d12f9fa` (A's and E's lap 5), and main has not
moved since. Three commits, named paths, not pushed:
- `7681ac28`: cold read 2's items C4, A2, A3/A7, B7, A9 (plan lines 251-257; `handback/p-consumer-coldread2-LIB_2026-10-09.md`).
- `5d087a64`: E's input; `consonance/launch.vbs` ships beside `launch.ps1`.
- `0dbca875`: the parity run at `5d087a64` read P = 3 and identity-diff RED. All four causes are lap 5's own, made or exposed; fixed below.

## The verdict
    THE TRIPLE      P = 1       M = 0       B = 0          (the 1 is dream-gate, already declared open in the generator; see below)
    THE GUARD       I = S − G = 167 − 126 = 41             (lap 4: 164 − 125 = 39)
    RUST            0 parity breaks
    IDENTITY-DIFF   PASS — 70 wake files compared; 0 unregistered difference(s), exit 0; generated from 0dbca875 = this repo
Generation from `0dbca875`, a clean tree: staged 390, leaks 0, excluded 46, declared JS 37 / Rust 12, forked 81; generated commit `42d9f62`, no remote,
at `C:\Users\nname\Desktop\worktrees\b-d273-gen13`. No CONSUMER-STATUS.md (unmeasured, by A2).

| run | result |
|---|---|
| source `js-suite` | 164 green · 1 failed (of 167): portable-paths |
| generated `js-suite` | 122 green · 2 failed (of 126): portable-paths, dream-gate |
| generated `cargo test` | bin **987 / 0** / 15 ignored, `arch_test` **12 / 0** / 1 ignored; exit 0 |
| cold sweep, `CONSONANCE_DATA` = an empty directory | chain-status rc 0, 528 B; board-audit rc 1, 604 B; ferry rc 0, 438 B; carrier-drift rc 1, 4,522 B; **0 stack frames each, so M = 0, B = 0** |

- **The source went from 5 reds to 1 on main `6d12f9fa`** (dream-gate, carrier-drift, heavy-run and sourced are green there). The reds those four had been
  sharing with the consumer had been hiding consumer-only reds, so this run is the first that could see them.
- **P = 1: `dream-gate`, row "the runner sets the variable it asks the hooks to honour"**, ENOENT on `dev/dream/dream_cycle.ps1`. This is the gap that
  `gen-consumer.js:352-374` already records as **"Declared, not fixed"**: whether `dev/dream/` (4 files) ships is a keeper-shaped decision ("absent means
  undecided under an allow-list, and an EXCLUDE entry would assert a decision nobody has made"). I did NOT declare it WORKSHOP-BOUND. That would read as
  "this is the record", and it would mask the open question. **For the chair: ship `dev/dream/` (that comment measured all four files clean except one hit in
  `dream_cycle.test.js`), or rule it out.** Either way, P goes to 0.
- Logs: `d273/lap5c/` (the first run, at `5d087a64`: `d273/lap5/`).

## What was done (test first each time: red, then green)
- **C4:** the keeper's two record files (`retired_seats_2026-09-11.md`, `third_place_prehistory_2026-08-30.md`) ship in `exo_memory/inheritance/`, not
  `record/`, so a seat no longer carries them whole. The `record/` rule matches `/^(?!retired_seats_|third_place_prehistory_).+\.md$/`, a new rule moves
  the two, and `dedangle` re-points any `record/…` mention of them to `inheritance/`. It composes with C's lap 5 anchors: forked 81, no throw.
- **A2:** CONSUMER-STATUS.md ships ONLY when measured: `build(out, { measured })`, or `--measured <file.json>`, with
  `{sha, at, parity:{P,M,B}, rust, identity, coldRead}`. `build()` refuses a measurement whose sha is not this commit's. `MEASURED_LINES` is identical
  in both renderers (`gen-consumer.js`, `gen-consumer.build.test.js`).
- **A3/A7:** `publicLinks()` (prose only, before `dedangle`) links record paths (`loop|map|handback|librarian|memory`) to
  `github.com/solariz3d/lighthouse/blob/main/…`. It links backticked shas to `/commit/<sha>`, **only when they are on `origin/main`**
  (`git cat-file` / `merge-base --is-ancestor`, cached). The excluded `memory/` notes, `dev/PLAN.md` and the `dev/dream/` tree are linked the same way.
  A `third_place` path becomes the prose "a Third Place entry in the keeper's record". Anything not public keeps the old placeholder.
- **B7:** `hooks/jev-flags.js` and its test are excluded (`JEV_EXCLUDED`), and the jev-flags WORKSHOP entry was removed.
- **A9:** CUTOFF reads "Generated from the keeper's public record at commit `<sha>` (github.com/solariz3d/lighthouse)".
- **launch.vbs (E):** a manifest line; it finds `launch.ps1` beside itself (`BuildPath(scriptDir, "launch.ps1")`), carries no machine path, and ships
  unchanged.
- **`0dbca875`, what the parity run found (each one lap 5's own):**
  - **dream-gate crashed:** its roster parser read `install.ps1:148`, a COMMENTED retired entry (`jev-flags.js`, kept verbatim by ruling 5), as a live
    hook. In dev it ran a hook nothing installs; in the consumer, after B7, it hit a missing module. Commented lines are now skipped. A new row (red
    first: "discovered from a commented line… jev-flags.js") checks every commented `From =` line.
  - **gen-brief-gate:** C's consumer detector was `CONSUMER-STATUS.md`, which A2 made conditional. I had not traced its readers. `exo_memory/CUTOFF.md`
    (generator-written, in every generation) now also marks a consumer tree; the constant is amended with a dated comment.
  - **identity-diff:** it read generated-from only from CONSUMER-STATUS.md (now with a CUTOFF.md fallback), and read C4's two MOVED files as "the
    generated tree does not have it". A rule's `to` that exists in the generated tree is now reported absent, as "MOVED: ships as … outside the wake
    set"; a moved file that never arrived stays unregistered. Two rows, red first, on synthetic trees.
  - **carrier-drift:** 10 rows read the room's registry (shipped SEEDED empty) or its git history (`21d5453^`, `325fb03^`). They are declared
    WORKSHOP-BOUND by exact name (green in source, A's anti-masking condition). The file's 47 other rows still run in the consumer.

**Amended BY NAME (rule changed), each with its comment:** the lap-2 Jev row (jev-flags is excluded now); the declared count, 28 → 27 (B7) → **37**
(carrier-drift); the L038 dirty-tree regex (the CUTOFF wording).

**Tests, green under the lock at `0dbca875`:** gen-consumer + fixture-scope **96/96**; identity-diff **9/9**; dream-gate **72/0**; gen-brief-gate
**7 + 1 skip**; carrier-drift **57/57**. Red first, logged: `d273/lap5-red.out` (6 new rows and 2 amended), `d273/vbs-red.out`,
`d273/lap5b/red-*.out` (3 rows).

## For C (wake material, so the lines rather than an edit)
- `consonance/src-tauri/brief/BUILDING.md:848`: "SOURCE is this repository: hand-maintained, private (`gh repo view … --json isPrivate` →". The
  same "private repo" wording is at `:866`, `:968`, `:989`, `:994` and `:1003`. The keeper ruled lighthouse public (A9).
- `exo_memory/SOURCE.md:65`: "`exo_memory/loop/` (11,918 lines) and `exo_memory/journal/` (5,927) are too large to carry". Neither ships in the consumer.

## Corrections (mine)
- **W1: A2 broke two readers I had not traced.** `gen-brief-gate.test.js:36` and `identity-diff.js:136` both keyed on CONSUMER-STATUS.md. My row
  for A2 tested only that the file is conditional. Caught by the parity run, fixed in `0dbca875`.
- **W2: B7 exposed dream-gate's comment-blind parser.** The B7 row checked only the exclusion, not who still names the file.
- `${}` inside a `String.raw` template broke an edit script; I fixed it with a narrower escape. A `\'` was lost in a plain template literal; fixed with Edit.
- I left the `jev-flags.test.js` WORKSHOP entry behind, which caused a `declareDrift` refusal; removed.
- `publicCommit` had no cache: the gen-consumer suite took 293 s, and about 83 s with the cache.
- The build-gate test showed 6 pass / 5 skip when cargo was not on PATH; it is 7 / 4 with it.
- I stopped my own superseded parity run `b3nnq96uo` (it was replaced after `launch.vbs`).


# Lap 5b (pane B, 2026-10-09 05:0x): dev/dream/ ships, its scan hit fixed at the source; parity (0, 0, 0)

**Branch `b-gen-lap5b`, worktree `C:\Users\nname\Desktop\worktrees\b-d273-lap5b`, from main `5d7de05b` (main has not moved).** One commit, named paths,
not pushed: **`cffe0091`**. I rang the librarian as soon as it landed, so cold read 3 could run in parallel with this parity run.

## The verdict: parity holds
    THE TRIPLE      P = 0       M = 0       B = 0          (lap 5: 1, 0, 0)
    THE GUARD       I = S − G = 167 − 127 = 40             (lap 5: 41; dream_cycle.test.js now ships)
    RUST            0 parity breaks
    IDENTITY-DIFF   PASS — 70 wake files compared; 0 unregistered difference(s), exit 0; generated from cffe0091 = this repo
Generation from `cffe0091`, a clean tree: staged 394 (+4), leaks 0, excluded 46, declared JS 37 / Rust 12, forked 81; generated commit `c32b559`, no
remote, at `C:\Users\nname\Desktop\worktrees\b-d273-gen14`.

| run | result |
|---|---|
| source `js-suite` | 164 green · 1 failed (of 167): portable-paths |
| generated `js-suite` | 124 green · 1 failed (of 127): portable-paths, the same file, so shared and not P |
| generated `cargo test` | bin **987 / 0** / 15 ignored, `arch_test` **12 / 0** / 1 ignored; exit 0 |
| cold sweep, `CONSONANCE_DATA` = an empty directory | chain-status rc 0, 528 B; board-audit rc 1, 604 B; ferry rc 0, 438 B; carrier-drift rc 1, 4,522 B; **0 stack frames each** |

Logs: `d273/lap5e/`.

## What was done (red, then green)
- **dev/dream/ ships as system** (the librarian's ruling, plan "Lap 5, COLLATED"): four MANIFEST lines, `README.md` (prose), `dream_cycle.ps1`,
  `install_dream.ps1` and `dream_cycle.test.js` (code). The "THIRD GAP" comment that kept the folder out as undecided is replaced by the ruling. The
  installer stays user-run; nothing schedules itself. The three non-test files ship byte-identical. dream-gate's last red assertion is gone.
- **The scan hit, fixed AT THE SOURCE.** At this commit no LEAKS pattern refused any of the four files; the one hit the old comment measured is, today,
  the build's `unportable` entry: `dev/dream/dream_cycle.test.js:23` cited `muscle_map.md` (the keeper's record; a fixture keeps its references, so it
  would ship pointing nowhere). The comment now states the invariant itself: "mention-vs-use (a comment MENTIONS a behaviour, only the code USES it) is
  a sealed invariant of this project". Comment only; no scan skipped or exempted; dream_cycle 7/7 in dev.
- **`PUBLIC_DEV` drops `dev/dream/`** (my lap 5 linked it to the public repo while it was absent). It is a local target now.
- **Rows:** NEW, "dev/dream/ ships as system…": the four files ship, no leak, no unportable reference, and the runner sets `CONSONANCE_DREAM`.
  **AMENDED BY NAME**, the A7 row: `dev/shell/README.md` must name `` `dev/dream/` ``, the folder must ship, and no public link. Both red on the base
  (`d273/lap5d/red.out`: fail 2); the unportable assertion's red is the pre-edit build, which listed the entry.

**Tests, green under the lock at `cffe0091`:** gen-consumer + fixture-scope **97/97**; dream_cycle **7/7**; dream-gate **72/0**; identity-diff **9/9**;
build gate **7 pass / 4 skip** (cargo on PATH).

## For E (GUIDE, if wanted)
The ruling says GUIDE names the dream as optional. A line, for E's wording: "Optional: the gap-dream (`dev/dream/`). It runs only after you run
`dev/dream/install_dream.ps1` yourself; nothing schedules it on install." I did not check GUIDE's current text for an existing mention.

## Corrections (mine)
- None in this lap's code. A note on the packet's premise: "the one LEAKS hit" no longer reproduces as a LEAKS refusal; it was the unportable reference
  above (the old comment did not say which pattern it hit). I fixed that one.


# Lap 6 (pane B, 2026-10-09 06:1x): polish A3, A4, A5 + the MIT LICENSE; parity (0, 0, 0)

**Branch `b-gen-lap6`, worktree `C:\Users\nname\Desktop\worktrees\b-d273-lap6`.** It started from main `62d3921f` and was **rebased onto main `93e160b2`**
(cold reads 2/3 and A's hand-back landed, plus A6's LIBRARIAN.md line). Two commits, named paths, not pushed:
- `9e432c36` (was `b5de5c8b`): cold read 3's A3, A4, A5.
- `a3f887c8` (was `58771b96`): the MIT LICENSE, at the root and the consumer root, verbatim.

## The verdict: parity holds on the rebased tip
    THE TRIPLE      P = 0       M = 0       B = 0
    THE GUARD       I = S − G = 167 − 127 = 40             (lap 5b: 40)
    RUST            0 parity breaks
    IDENTITY-DIFF   PASS — 70 wake files compared; 0 unregistered difference(s), exit 0; generated from a3f887c8 = this repo
Generation from `a3f887c8`, a clean tree: staged 396 (+2: checkpoint.py, LICENSE), leaks 0, excluded 46, declared JS 37 / Rust 12, forked 82; generated
commit `da5c8d2`, no remote, at `C:\Users\nname\Desktop\worktrees\b-d273-gen17`. `cmp LICENSE <gen>/LICENSE`: identical.

| run | result |
|---|---|
| gen-consumer + fixture-scope + identity-diff tests (first step of the same hold) | **111 / 111** |
| source `js-suite` | 163 green · 2 failed (of 167): portable-paths, **carrier-drift** (see below) |
| generated `js-suite` | 124 green · 1 failed (of 127): portable-paths, shared |
| generated `cargo test` | bin **987 / 0** / 15 ignored, `arch_test` **12 / 0** / 1 ignored; exit 0 |
| cold sweep, `CONSONANCE_DATA` = an empty directory | chain-status rc 0, 528 B; board-audit rc 1, 604 B; ferry rc 0, 438 B; carrier-drift rc 1, 4,522 B; **0 stack frames each** |

The same run before the rebase (`58771b96` on `62d3921f`, `d273/lap6q/`) also gave (0, 0, 0), with the source at 164 · 1 (portable-paths only). Logs: `d273/lap6r/`.

**MAIN `93e160b2` IS RED ON carrier-drift, and it is not this branch.** `carrier-drift.js`'s scan on a clean detached checkout of `93e160b2` gives one
finding: `UNACCOUNTED exo_memory/handback/p-consumer-devtruth-A_2026-10-09.md:68` (A's hand-back quotes a retired wording while listing where it sits;
it landed in `2df7e713`). Two rows go red in the source: "THE BAR, half one" and "MUTATION over the REAL tree". **For A or the librarian:** mark the site
(or reword line 68). This matters for my lap 5 declarations. Those two rows are among the ten I declared WORKSHOP-BOUND on condition they are green in
source (A's anti-masking condition). The declaration does not hide this, because the source suite runs them and is red. But the condition is not met
until line 68 is accounted for. Not touched by me (A's file).

## What was done (red, then green)
- **A3, decided by the scan: `exo_memory/loop/checkpoint.py` SHIPS** (0 hits after transform), so the PreCompact hook that `install.ps1` registers is no
  longer silently dead.
  - **Checked by running it:** I ran the generated `precompact.js` against a staged tree, with a temp `USERPROFILE` whose `.consonance.json`
    `room_path` points there. rc 0, stderr empty, `CHECKPOINT.md` written beside the script.
  - **loop/ stays private as a column.** `SHIPS_FROM_PRIVATE` names that one file by full path. The column check, and the L038 row (amended BY
    NAME), accept exactly that and still refuse any other rule reaching a private column.
  - **One judgement call, stated:** `dedangle` turned `REPO / "exo_memory" / "muscle_map.md"` (`:217`) into a sentence. `CODE_KEPT` restores the
    line, and `ALLOW` gives the file RECORD. That is exactly how `residue.js` and `corrections-gate.js` already ship. The alternative was to ship a
    path that can never match, even if a consumer later writes that file. The f-string message under that branch (`:482`) is left as rewritten; it
    prints only when the file exists.
- **A4:** `install.ps1:345` now says "stays in the source repository … (a generated copy does not carry it)". `README.md:192` says the same. I also took
  `README.md:189`, same error, adjacent: "22 non-test .js files" now adds "(21 in a generated copy, which leaves out the retired jev-flags.js)". The row
  counts the generated `hooks/` and requires that number in the README.
- **A5:**
  - `PUBLIC_NAMED` (per file, by exact token AND expected count; a mismatch or a non-public target is anchorDrift) links AUTONOMY's `PROGRESS.md`
    (×2) and `RECONCEPTION.md`, and SPINE's `WELFARE.md`, to the public main.
  - CUTOFF now says "The command that does it is `consonance/tools/gen-consumer.js` in the public source repository (github.com/solariz3d/lighthouse);
    this copy does not carry it."
  - The `main.rs` comment at the fork marker says `consumer-relabel.js` is in the source repository (comment only; cargo green in source, bin 998/0).
- **LICENSE (the keeper's MIT choice):**
  - None existed (worktree, `git ls-files`, `origin/main`). It is the standard MIT text, "Copyright (c) 2026 solariz3d".
  - MANIFEST `{ from: 'LICENSE', to: 'LICENSE', kind: 'legal' }`. `LEGAL_VERBATIM` registers its ONE holder line: the file is copied byte for byte,
    never through deidentify or the relabel hook. `scanLegal` scans every other line, and the registered line must appear exactly once (else
    anchorDrift).
  - Rows: the generated LICENSE `.equals()` the source; a second handle in a legal file is still an IDENTITY leak; a LICENSE without the registered line
    is reported.
  - The FORK hook row is amended BY NAME (a `legal` file never reaches the hook, like binary and screen).

**Red first:** `d273/lap6/red.out` (A3, A4, A5: fail 3) and `d273/lap6/lic-red.out` (LICENSE: fail 2). **Amended BY NAME:** L038 columns (SHIPS_FROM_PRIVATE);
the FORK hook row (legal). **Green under the lock:** gen-consumer + fixture-scope 102/102, then 111/111 with identity-diff on the rebased tip;
identity-diff + front-door-links + consumer-relabel 37/37; build gate 7 pass / 4 skip; source cargo bin 998/0.

## Corrections (mine)
- **W1:** my first LICENSE row spelled the keeper's email local part in a test string. I replaced it with a second handle before any commit.
- **W2:** `git commit -- LICENSE` on an untracked file failed (pathspec), and the generator correctly refused the dirty tree. Fixed with `git add LICENSE`.
- **W3:** my own A5 row expected the CUTOFF words in the opposite order from what I wrote. I fixed the row (it was unlanded and mine), not the text.
- I stopped my own parity run `bkw2m4szf` when the LICENSE was added; `heavy-run` then reported its lock as stale and took it over. No stray processes
  (checked).
- Heredocs ate backslashes twice in edit scripts; redone with Edit.

## Leftovers
- `C:\Users\nname\AppData\Local\Temp\gen-consumer-Ui2piO` and `scratchpad/d273/lap6/home/`: a dry-build staging tree and the temp home for the hook run.
  The safety check refused my scripted removal of the first (its path came from a command substitution). Safe to delete.
- Generated trees `b-d273-gen13` … `gen17` (no remote, `pushDefault = no_push`).
