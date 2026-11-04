# L134 L-CONVERGE — the builder's hand-back. B, on L, 2026-11-04 ~01:1x local

**Seat:** pane B (builder). **Packet:** chair L134 L-CONVERGE, plan `exo_memory/loop/plan_L_converge_2026-11-04.md`, "Builder (B)" steps 1–5.

**NOT PUSHED.** The shared checkout `C:\Consonance\lighthouse` was not touched, apart from the two writes the packet asked for: this file copied into its `exo_memory/handback/`, and one line appended to its `exo_memory/map/B.md`.

## THE MERGE

- **Worktree:** `<scratch>/lconv/wt` (B's scratchpad), made by `git worktree add -b converge-L-2026-11-04 <wt> 14f9495d` (L's HEAD).
- **Merge:** `git merge --no-edit origin/main`, with origin/main at `1809ab395fa96adfdb2c9dedee3a182dce1494bf`, the dispatch's sha.
  - Re-checked after the commit, read-only: `git ls-remote origin refs/heads/main` → `1809ab39…`, unchanged.
- **Merge commit: `880f237f255064f7e2078b5b8fe9a3bb2d50d831`** on branch `converge-L-2026-11-04`.
  - Parents: `14f9495d7a2da9efaf4185682e350ed6ccdcc54c` (L) and `1809ab395fa96adfdb2c9dedee3a182dce1494bf` (origin).
  - The commit body names the writer (pane B) and the 6 decisions.
- **Links:** `find . -type l` → 0; `cmd /c dir /AL /S /B` → "File Not Found". checked, after the commit.
- **Conflicts:** exactly the plan's 6. `git diff --name-only --diff-filter=U` listed main.rs, mcp.rs, trailer.rs, heavy-run.js, heavy-run.test.js and label_rule_watch_registration_2026-09-27.md. After resolving: 0 unmerged, 0 conflict markers.
- **The merge against origin, consonance/ only:** `git diff --stat 1809ab39 880f237f -- consonance/` → 5 files, +942/−29.
  - heavy-run.js, heavy-run.test.js and main.rs are my ports.
  - label-watch.js and label-watch.test.js are L-only files that merged clean.
  - mcp.rs and trailer.rs are byte-identical to origin.
- **Equivalence pre-check:** `git cherry -v origin/main 14f9495d` → every one of L's 7 consonance commits is `+`. No patch-equivalent exists on origin, so each decision below is from reading the code and its test, as the plan says.

## THE 6 DECISION ROWS

| # | file | L commit | decision | evidence |
|---|---|---|---|---|
| 1 | `consonance/tools/heavy-run.js` | 88278a11 (pid reuse) | **PORTED** | See row 1 below. |
| 2 | `consonance/tools/heavy-run.test.js` | 88278a11 | **PORTED** | See row 2 below. |
| 3 | `consonance/src-tauri/src/trailer.rs` | 9e47cb17 (warned hand-back tells the sender) | **already in origin at trailer.rs:292** (`sender_note`, D633) | Origin's note goes to the SENDER in its own tool result, after the delivery result: L's behaviour. Origin taken unchanged. |
| 4 | `consonance/src-tauri/src/mcp.rs` | 9e47cb17 | **already in origin at mcp.rs:4429** (`with_sender_note`), used at mcp.rs:633, 728 and 1077 (1077 is `call_librarian`, Verb::CallLibrarian) | See row 4 below. |
| 5 | `consonance/src-tauri/src/main.rs` | e3eadda2 + d592269f (intake_reserve) | **PORTED** | See row 5 below. |
| 6 | `exo_memory/loop/label_rule_watch_registration_2026-09-27.md` | L126/L127 doc edits (d6383d5b, 1194acb6) | **origin kept whole + L appended** | See row 6 below. |

**Row 1, heavy-run.js: why it was missing, and what was ported.**
- **The plan's premise is wrong here.** Origin's own header at heavy-run.js:45 says the opposite of handling it: "A pid the OS has since REUSED reads alive — the waiter then waits and, at the max wait, fails loudly".
- Origin's `takeIfStale` judges by `kill(0)` and D283's tasklist witness only, both of which read a reused pid as running. checked: `git show origin/main:consonance/tools/heavy-run.js`, its lines 45 and 184–226.
- **Ported into origin's per-slot `takeIfStale`:**
  - `selfIdentity`, `processIdentity` (with spawnSync and an injectable runner, origin's `pidGone` idiom; a non-integer pid never reaches PowerShell), `hasIdentity`, `sameHolder`, `START_TOLERANCE_MS` and `IDENTITY_RECHECK_MS`;
  - the lock record gains `image` and `holder_start`;
  - a live pid whose identity differs is stale, with reason `pid_reused`, and `took_over.now_running` is recorded;
  - `took_over.reason` is recorded as `dead`, `unreadable` or `pid_reused`;
  - the probe is cached per token, since origin has slots.
- **Unchanged from origin:** slots and trees (D286), D283's second witness for a dead young lock, D289's put-back, and the disk guard. An old lock without identity is never probed; an unknown identity counts as held. The header now says so.

**Row 2, heavy-run.test.js: what was ported and changed.**
- Origin's 52 tests are kept.
- **One existing test was changed, because the record changed:** the schema test now expects `holder_start` and `image`, and asserts their values (L's own two assertions).
- L's 9 tests were appended. One was adapted: the dead-pid case injects `confirmGone: () => true`, because origin's D283 witness would otherwise ask the real tasklist about pid 27836.

**Row 4, mcp.rs: what origin already does, and the one difference.**
- The sender gets the result FIRST, then the note.
- **The one difference is deliberate and kept:** D633 REMOVED the note from the receiver's copy, which L still appended (`delivered_with_warning`), on D's measurement in the trailer.rs:288–291 doc comment: "935 notes received, 0 rings changed".
- L's 4 tests are covered by origin's: mcp.rs:4599–4612 cover no extra text when the trailer is fine, the result first, and the wiring at every verb. Origin taken.

**Row 5, main.rs: why it was missing, and what was ported.**
- **Missing:** origin still has `map_reserve` capped at 36,000 with no runtime cap; `grep -n "fn intake_reserve" origin main.rs` → none. So L129's bug class is live on origin: a newest entry past ~34.8K, or in B's ~28.9–34.8K band, pushes the committee brief and the deck out.
- **Ported in origin's shape:**
  - `intake_reserve` is verbatim, with comments trimmed.
  - `assemble_intake_for(requested, newest_len: Option<usize>, maps, notes) -> (String, reserve taken)`. Some = intake_reserve, decided at the seating from the real committee and index sizes. None = the reserve as asked (origin's behaviour).
  - **Only the pane path passes Some:** `intake_with_map`, the MAP CARRY site. `assemble_intake_within` and the light-intake tests pass None and are byte-for-byte origin's.
  - L's 8 tests were inserted into `shell_budget_order_tests`. Their source-scan test was re-pointed from `assemble_intake_within(` to `assemble_intake_for(`, and from `optional_budget(core_len, reserve)` to origin's `optional_budget_mode(core_len, map_reserve, light)`.
  - **L's fixture refresh was ported too:** REAL_ROOM 40,423, REAL_CORE_TAIL 18,195, REAL_COMMITTEE 15,823, REAL_CARDS ×13. Origin still carried the 2026-09-06 values that B's L128 read found stale. Without the refresh the band test's CONTROL failed: "control: B's band — the old reserve drops the committee", because on the stale fixtures 32,200 did not drop it. That is a fixture fact, recorded in run 1 below. The constants are private to this test module, and their only reader is `real_optional`, as on L.
- **Named, not changed:** D585's packet maps are seated AHEAD of the committee by origin's design, and `intake_reserve`'s bound does not count them. So a pane with packet maps can still lose its committee to the maps. That is origin's choice, and it is stated in the fn's doc.

**Row 6, the doc: how the two sides were joined.**
- Both sides only APPENDED after the common ancestor: L +21 lines (two CLARIFICATIONs, L126 and L127); origin +128 (AMENDMENT A, D201).
- Origin's file is kept byte for byte. checked: `diff <(head -n <origin length> merged) origin` → identical.
- L's block is appended VERBATIM after a `## from L, 2026-09-27 — kept at the L/D convergence` marker, with one italic line saying what it is. checked: `diff` of L's tail against the merged tail → identical.
- Neither side is dropped. `grep -c "CLARIFICATION, 2026-09-27"` on origin → 0, so D never carried them.

## THE CHECKS (each under `C:\Consonance\data\heavy-run.lock`)

Every run went through `node --max-old-space-size=4096 <scratch-old>/l130/locked.js …`, which calls `hold()` from the shared checkout's `consonance/tools/heavy-run.js`. Every cargo run used my own `CARGO_TARGET_DIR=<scratch>/lconv/target`.

1. **heavy-run (JS)**, `node … --test consonance/tools/heavy-run.test.js` in the worktree → **61 tests, 61 pass, 0 fail**.
   - **Red-check:** the same tests with origin's heavy-run.js put back temporarily (`git show origin/main:… > file`, then my port restored; `cmp` → identical) → **54 pass / 7 fail**. The 7 failures are the schema test, both PID REUSED cases, the dead-pid reason, the recheck count, and both REAL processIdentity tests. The 3 that pass either way are hold-the-lock guards (same holder, old format, unknown identity), as they should be.
2. **label-watch (JS)**, `node … --test consonance/tools/label-watch.test.js` → **27 / 27 pass**. It is an L-only file, merged clean.
3. **cargo check**, in `consonance/src-tauri` → `Finished dev profile`, **CHECK_EXIT=0**, with 12 warnings. The warnings are existing ones, e.g. an unused `last_attempt_ms`. Not counted against origin.
4. **trailer + intake (Rust)**, `cargo test --bin consonance -- trailer l129 shell_budget`:
   - **Run 1, before the fixture refresh:** 84 pass / 1 FAIL. `l129_band_case…` failed its control, as above.
   - **Run 2, final:** **97 passed / 0 failed** (`test result: ok. 97 passed; 0 failed; 0 ignored; 1106 filtered out`). All 8 l129 tests are ok, as are trailer::tests and mcp::trailer_gate_tests.
5. **intake / map / fork (Rust)**, `cargo test --bin consonance -- intake map fork` → **86 passed / 1 FAILED / 2 ignored**. The failure is `intake_light_tests::light_the_pane_intake_is_under_target_with_the_cards_and_the_room`: "card …\exo_memory\cards\earned-not-performed.md rides strict but not light", with strict 109,395 B and light 91,454 B.
   - **It is not from the port, checked:** the same test with ORIGIN's main.rs put back gives the identical failure at the same sizes (109,395 / 91,454) and the same card. Then I restored the port; `cmp` → identical.
   - The test calls only `assemble_intake_within` (the None path, origin's code) and reads the worktree's own room, cards and `exo_memory/map/C.md`, which now holds L's and D's entries merged.
   - `inferred:` the merged data, not the code, trips origin's light-mode seat cap (`LIGHT_OPTIONAL_CAP`). **Not checked:** whether it also fails on pure origin/main with origin's own data. **For E and the chair: this is a live-data test; it is red on the merged tree with or without my port.**

## THE 09-29 SPOT-CHECK (step 3)

`git rev-parse 14f9495d:<f>` vs `git rev-parse :<f>` (the merged index) → **SAME for 14 of 14**. None of the 14 exists on origin; they are L-only.
- `loop/plan_t180_camera_readout_2026-09-29.md` 088150a0
- `loop/handoff_librarian_2026-09-29_close_L.md` 4f06eff5
- `loop/sonnet_pane_A_trial_registration_2026-09-29.md` e2b663e1
- 11 hand-backs dated 2026-09-29: p-l130-camera-read-B, p-l130-readout-A, -display-C, -reg-E, p-l130r-assemble-A, -review-E, -score-B, p-l131-ui-E, p-l131-water-B, p-l131r-review-C, p-l132-camera-A.

## sha256 of the resolved files (worktree, first 16)

- `consonance/tools/heavy-run.js` 157fa15003de86f6
- `consonance/tools/heavy-run.test.js` 73934f037f69f36a
- `consonance/src-tauri/src/main.rs` 1c78b4c71d43c207
- `exo_memory/loop/label_rule_watch_registration_2026-09-27.md` e35c6dacc5d3a877
- mcp.rs and trailer.rs are origin's blobs exactly.

## NOT VERIFIED

- **The full Rust suite and the full js-suite:** not run (the packet: targeted only). The other ~1,100 Rust tests are unrun on the merged tree. inferred: they are unaffected; the port touches one fn signature, whose 3 callers are updated, and private test constants.
- **A build of the app and the port live:** not run, by the packet's guard. The pane path's MAP CARRY reserve now reports the reserve taken. Not observed in a real shell.
- **PowerShell `processIdentity` on this machine:** checked, by the REAL tests in run 1 (61/61 includes them on win32).
- **The light-intake failure on pure origin with origin's data:** not checked (see check 5).
- **The other 1,800+ files merged as git did:** not reviewed beyond the 09-29 spot-check and the consonance/ diff stat.
- **E's re-derivation:** pending, as the plan's next step.

## CORRECTIONS

- **The plan said "origin's heavy-run.js already handles a REUSED pid (its line 45 comment)".** That is wrong: the comment says a reused pid reads alive and the waiter waits. So row 1 is PORTED, not "already in origin". checked by reading origin's file, and by the 7 red tests on origin's code.
- **My own (W1):** the first targeted cargo run failed the band control on origin's stale fixtures. I ported L's refresh rather than weaken the control.

NEXT: librarian call_librarian with the hand-back pointer when the hand-back is written — plan default after it: E's non-author review, unless the output says otherwise
