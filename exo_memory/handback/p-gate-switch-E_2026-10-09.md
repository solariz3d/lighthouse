# p-gate-switch-E · D277 part 2: the paperwork gates behind one switch · pane E, on D, 2026-10-09 · DONE

**Commit `3fb3116f`** on lighthouse main `738f9115`, branch `d277-gate-switch`, my own worktree `C:/Users/nname/Desktop/worktrees/e-gsw-wt`. 6 paths: 5 edited (+214/−14)
and the new `gate-mode.test.js`. Not pushed, not landed. **The live installed hooks are untouched.**

## FOR THE KEEPER AND THE CHAIR (read first)
- **The switch:** `"gates_mode": "light"` at the top level of `%USERPROFILE%\.consonance.json`.
  - Absent, unreadable, not JSON, or any other value means **strict, which is today's behaviour**.
  - Only the string "light" (trimmed, any case) turns it on.
- **The three gates read it differently:**
  - **SOURCES and the reply slot** are hooks and read the key on every run.
  - **The NEXT trailer** is in the app, which reads the key on every message, but only from a build that has this code.
- **To make it reachable, in this order, after the keeper's yes:**
  1. land `3fb3116f`;
  2. `install.ps1 -Only sources-gate.js,reply-slot.js`;
  3. rebuild the app.
  - Steps 1–3 change nothing by themselves: with the key absent, all three gates behave exactly as now.
  - Then the keeper sets the key, and removes it to go back.
- **Light mode does not touch** the dispatch, push or delete gates.

## What light mode does
- **SOURCES** (`sources-gate.js` `lightMatch`) is tried only AFTER the strict match fails, so it accepts everything strict does, plus:
  - a command quoted WITH its `cd <dir> &&` / `Set-Location <dir>;` chain, or a chain containing a segment that ran;
  - a command DESCRIBED: its first word is the program of an opening segment that ran, and a file name in the item (`x.ext`, 5+ characters) is in that segment;
  - a WebSearch query (`WebSearch: <query>` or the bare query);
  - a fetched URL given by a prefix of 8 or more characters.
  - **It still refuses:** an item nothing in the turn touched, a program named with no file, and a missing or empty line.
- **Reply slot:** the same verdict, but it returns `warn` (a `systemMessage` shown to the person) instead of the Stop block.
  - The ledger row is the same row: `blocked: !!v.output` now reads false, because nothing blocked.
  - Every row of a light room carries `"mode": "light"`. In strict mode that field is empty and the rows are byte-identical to today's.
- **NEXT trailer:** `trailer::policy_in(verb, GateMode::Light)` warns and delivers on every verb. A board line that strict would have refused says
  `DELIVERED WITHOUT A NEXT TRAILER (gates_mode light; strict would refuse)`, so (a) stays countable. `call_librarian`'s line is unchanged.
- **SOURCES rows of a light room carry `"mode": "light"`**, so every measurement (a) needs is still in the same ledgers.
- **GATES.md** documents the switch in "Turning a gate off". The six numbered sections are unchanged.

## Tests (all under the lock, except as said)
- **New, written first:**
  - `consonance/hooks/gate-mode.test.js`, 6 rows:
    - the switch's parse;
    - SOURCES strict equals today's decide;
    - light matches the chain, the described command, the query and the URL;
    - light still refuses the untouched item, the bare program, and the missing and empty lines;
    - reply slot strict equals today;
    - reply slot light warns with the same fields.
  - Rust: `trailer::gate_mode_tests` ×2 and `mcp::trailer_gate_tests::d277_*` ×3:
    - the parse, including a temp-file read;
    - strict refuses as today;
    - light delivers with the marked line.
- **Red first on `738f9115`:**
  - JS: 4 of 6 fail, and the 2 STRICT rows pass, which is the point: today's behaviour is pinned before the change (`gsw/red2.tap`).
  - Rust: the rows don't compile there (no `policy_in`, no `gates_mode_from`).
- **Green:**
  - gate-mode + sources-gate + reply-slot: **100/100**;
  - front-door-links, gen-consumer, dream-gate, second-reader and carrier-drift: **198/198**;
  - `cargo test --no-fail-fast`: main binary **1003 passed, 0 failed, 4 ignored** (998 + my 5), and every other target as before;
  - `trailer.rs` built ALONE with `rustc --edition 2021 --test`: 39/39, so it is still standalone. That one ran directly, not under the lock: one small file, under 10 s.
  - portable-paths: **green, 0 new**.
- **Mutation harnesses:**
  - `sources-gate.mutants.js`: **80 applied, 80 caught, 0 not applied**;
  - `reply-slot.mutants.js`: **58 applied, 58 caught, 1 not applied**. That one is #43 ("main does not pass the seat to the verdict"): its anchor
    `live: !SHADOW, seat });` is found 0 times on the BASE too (`git show 738f9115:consonance/hooks/reply-slot.js | grep -cF`), so it was disarmed before this lap
    (D273's `gates:` argument, I think). **For whoever owns that harness:** re-anchor it.

## My corrections on the way
- **My first draft disarmed four harness mutants** by editing or duplicating their exact anchor lines: sources-gate #44, and reply-slot #10, #15 and #54.
  I found that on the first harness run. The fix keeps every anchor whole:
  - the segment split is written in another order;
  - the warning is reworded;
  - the ledger line is restored byte for byte;
  - the `mode` field moved into `record()`.
- **Two of my first fixtures were wrong, and one taught something about strict mode:**
  - **An UNQUOTED `node -e (…)` item already passes strict today.** `parseSources` strips a trailing `(…)`, and the bare `node -e` matches any `node -e` call.
    Found and left as it is; the fixture now quotes the paraphrase. **Worth a ruling:** strict lets a bare program name through when it is unquoted.
  - The reply-slot figure "1,084 rows" is not a token kind the slot checks, so it is now "3 of 5".
- **portable-paths went red** on my `"data_dir":"C:/d"` fixtures in `mcp.rs`. They are now `"some/data"`; no baseline change.
- **Under `cargo test` the app does not read the live `~/.consonance.json`.** A thread-local defaults to Strict and is set per test, so the suite never depends on the
  keeper's switch. The file read is tested through `gates_mode_at` on temp files. The running app reads the file.

## Not done
- **No live run of light mode.** No hook was installed and no app was rebuilt.
- **No re-measure yet.** Re-measuring (a) needs a week in light mode (the plan's order); the light rows say which mode wrote them.

## Addendum (~12:1x): portable-paths RED on main, the chair's hold · FIXED
- **The branch is rebased onto main `776e96f4`:**
  - `ad3103b5` is the switch; it replaces `3fb3116f` and its content is unchanged;
  - **`1f38da03`** is this fix.
- **Reproduced first.** On `776e96f4`, `node consonance/tools/portable-paths.js` printed RED with 4 sites, all in `consonance/hooks/gate-mode.test.js`. My own run on
  `738f9115` had been green, so main scans more than my base did; I did not dig into why.
- **:16, FATAL-TEST-READ:** the fixture command text named `C:/Consonance/data/sources-gate.jsonl`, the keeper's real data dir. It now reads
  `data/sources-gate.jsonl`; the gate only matches the command TEXT, so the row tests the same thing.
- **:19, :33 and :65, BENIGN-TEST** (a fake `C:\Users\x\repo` path, a fake `data_dir`, a fake reply path): baselined with `--update`. Checked row by row, old keys against new:
  **+3 BENIGN-TEST rows, all from gate-mode.test.js; 0 removed; 0 verdicts changed on kept rows.**
- **After:** `portable-paths: green — 369 files in scope, 410 known sites, 0 new`.
  portable-paths.test.js + gate-mode + sources-gate + reply-slot: **143/143, 0 fail** (under the lock, `gsw/pp.tap`).
- **Carry, again:** run portable-paths before ringing, on the tip of MAIN, not just on my base.
