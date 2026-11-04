# p-d628 — a visit to a seat that is owed an action becomes a work turn (O), 2026-11-03

Packet: the chair's D628 (14:12Z), PROVE IT, at the keeper's word (08:12): *"yes to fix 1, but make sure u dont lobotomize urself guy"*. Source: `exo_memory/loop/room_value_result_2026-11-03.md` recommendation 1; my D627 part 3, rows 1b, 1c and 3. Seat: O.

## What landed
- **Lighthouse branch `d628-o`** off origin/main 21819167: one commit, **`82da03fc`**, NOT pushed.
  - 3 paths: `main.rs`, `chain-status.js`, `chain-status.test.js`; 336 insertions, 4 deletions.
  - The base already contains D621's 846df413 (`git merge-base --is-ancestor` → yes), so the build folds it in.
- **Built, NOT installed, the app NOT restarted:**
  - checked: `cargo tauri build --no-bundle` → `S\d628\release-build.out`: exit 0 in 95 s, "Built application at: G:\Consonance-tools\cargo-o621\release\consonance.exe".
  - **Staged copy:** `C:\Consonance\staged\d628-82da03fc\consonance.exe`, sha256 **ff9fa00a0170d862f094be899433399c2fa7e005b9e1c93a51ba0081f8de59f8**, equal to the built exe.
  - The swap waits for his word.
  - inferred: the build tree equals 82da03fc. It started a minute before the commit, and no file changed between them.

## The change
**When.** The keep-warm timer comes due for a seat exactly as today: `keep_warm_decision` is not touched, nor who is visited or when. Then `keep_warm_send` asks the pulse's own code who is owed.

**How it asks.** It runs `node consonance/tools/chain-status.js --owed-json` (new `owedVisit`), hidden (`NO_WINDOW`), with an 8 s bound, read-only.
- `owedVisit` uses the same `collation()` and the same anchor as the pulse line, and answers only when the head lap's holder is `panes`, exactly when the pulse prints a hand-back count.
- So the visit and the pulse cannot disagree.
- checked, live, read-only: `--owed-json` → `"state":"owing","owing":["O"],"in":4,"examined":5` while the pulse printed `handbacks 4 of 5 (owing O)`; 0.19 s.

**What it sends** (`owed_work_text`, pure):
- **A committee pane named in `owing`:** "[work turn — from the room, not the keeper, and not a keep-warm] Lap D…: the pulse has you owing a hand-back (k of n in). Finish the packet's work, write the hand-back to the path your packet names, append your map line, and ring call_librarian with the pointer. If you are blocked or waiting on something, ring call_librarian saying what."
- **The librarian on all-in** (`HANDBACKS IN, NOT COLLATED`): the lap, n of n and the round, how long since the last, and **each letter's hand-back pointer**. Those come from its newest `call_librarian` row since the anchor (`collation(withPointers)`), or "no pointer on the board". Then "Collate them and ring the chair with call_chair."
- **Every other seat and state** (not owed, the chair, the Third Place, a human-driven pane, unknown, holder not panes): **today's text, byte for byte** (`owed_visit_choice(normal, None)` returns it unchanged).
- **A work turn is not a Third Place letter.** It carries no letter nonce, its reply is not harvested, and the seat's waiting answer stays in the book for its next real visit.
- **An unreadable owed state changes nothing:** the usual visit goes, and a board row says why.

## THE GUARD (his words), as a test
`owed_visit_tests::the_guard_the_visit_path_only_changes_what_a_visit_says` reads the visit path's source: `keep_warm_send` plus the four new functions. It asserts:
- none of `/compact`, `/clear`, `/resume`, restart, respawn, relaunch, `kill_pane`, `close_pane`, `spawn_claude_pane`, `remove_file`, `fs::write`, truncate, `CLAUDE.md`, `MEMORY.md` or shelf appears on it;
- the pane gets exactly ONE `inject_to_pane(…, &text, …)`, as before;
- the only new step is `let (text, visiting) = owed_visit_choice(text, work);`;
- the reader only runs `--owed-json`, hidden;
- neither work text can start with `/` or name a clear or compact.

## Tests (red first)
- **Red on the current tree:**
  - checked: Rust, `S\d628\rust-red.out` → the 5 new rows do not compile (`cannot find function owed_work_text / owed_visit_choice / owed_state_from_json`, `type OwedState`: 15 errors);
  - checked: JS, `S\d628\js-red.out` → all 5 new D628 rows fail (`owedVisit is not a function`; `--owed-json` printed the pulse line, not JSON).
- **Rust rows, `owed_visit_tests` (5):**
  - `an_owed_pane_gets_a_work_turn_naming_its_lap_and_the_action`;
  - `the_librarian_with_every_hand_back_in_gets_a_collation_turn_with_the_paths`;
  - `a_seat_not_owed_keeps_its_keep_warm_byte_for_byte` (8 cases);
  - `an_unreadable_owed_state_changes_nothing`;
  - the guard row.
- **JS rows, in `chain-status.test.js` (6).** Each reads owedVisit against `line()` on the same fixture:
  - owing B;
  - all-in with the newest pointer;
  - holder chair is n/a;
  - an unreadable board is unknown;
  - `--owed-json` prints the object;
  - **a pointer rung before the anchor does not count**, added after mutant J4 survived (below).
- **Green:**
  - checked: `cargo test --bin consonance` → `S\d628\cargo-full.out`: **1186 passed, 0 failed, 6 ignored** (was 1181), 169 s.
  - checked: `node --test chain-status.test.js` → 155/155.
  - checked: the other consumers of chain-status: `ask.test.js` 42/42 and `lap-row.test.js` 142/142.
  - The pulse hook's default output is unchanged: only the new `--owed-json` flag answers differently, and `collation()`'s extra field appears only with `withPointers`.
  - The compile warnings at main.rs:16617 and :16875 and in cochlea.rs pre-exist and are outside my hunks.
- **Mutants:**
  - checked: `S\d628\mut628.js` → `S\d628\mutants.json`: **applied 13 / caught 13 / NOT APPLIED 0**.
  - Each was caught by a named test failure, not a compile error: R1-R8 on `owed_work_text`, `owed_visit_choice`, `owed_state_from_json` and the send wiring; J1-J5 on owedVisit's holder check, pointers (asked for, newest, since the anchor) and the CLI.
  - Every file was restored and checked byte for byte.

## Corrections
- **First mutant run:** applied 11 / caught 10 / NOT APPLIED 2.
  - R6 and J1 had anchors occurring twice: R6's in the guard row's own text, J1's in another function. Both anchors were made unique.
  - **J4 (pointers from before the anchor) SURVIVED**, a real gap: no row covered a pointer rung on an earlier, filed lap. Added the row; it is red on J4.
  - The second run is the figure above.

## What it does not do
- It does not change keep-warm timing. An owed seat is reached only when its keep-warm comes due (about 50 min idle), as before.
- It does not wake the chair, which is not in fix 1. The chair keeps its plain visit.
- It does not drop or change any pulse item. That is recommendation 5, not this lap.

`S` = `C:\Users\nname\AppData\Local\Temp\claude\C--Consonance-instances-sibling-36313935\c88002b1-74d8-4036-8cc0-f64aefbeabff\scratchpad`.

SOURCES: room_value_result_2026-11-03.md; main.rs keep_warm_decision, keep_warm_send, visit_text_noting; chain-status.js collation, line; S\d628\{rust-red.out, js-red.out, cargo-full.out, mutants.json, release-build.out}; sha256sum of the staged exe
NEXT: librarian checks 82da03fc, the red-first rows and the mutants when this ring is read; landing and the swap wait for the keeper's word
