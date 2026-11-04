# vantage SURFACE 11/37 · id b98a1a31cb9fddf8 · 2026-09-07T07:10:12.537Z

source: {"session":"6fe15f0a","pane":"sibling-3d57124e","turn_ts":"2026-09-06T10:00:33.221Z","head":"5ebf2cd735f93660a3a58e7ebcfb99078df54a7a"}
tier: artifact  verdict: DISAGREE  status: SURFACE

## claim (excerpt the reader checked)
**The wiring is done** — `seat_alias::candidates` is live at `main.rs:6137` and the test checking *that* is green. … done** — `seat_alias::candidates` is live at `main.rs:6137` inside `resolve_from`, and the test that … recorded by my rule as though it were clean, and my falsifier would pass over it silently.

## reader commands
- `find . -name main.rs -not -path "*/target/*"` → `./consonance/src-tauri/src/main.rs` (the only main.rs; 12337 lines)
- `grep -n "seat_alias" src/main.rs` → `29: mod seat_alias;`, `7016: !seat_alias::candidates(upper)...`, `7179: for key in seat_alias::candidates(t) {` — no occurrence anywhere near 6137
- `grep -n "fn resolve_from" src/main.rs` → `7172: fn resolve_from(names: &HashMap<String, String>, live: &[String], target: &str) -> Result<String, String>` — so the live call site is line 7179, seven lines into `resolve_from`
- `sed -n '6130,6140p' src/main.rs` → line 6137 is `// shelf got, to name paths no seat has ever cited.` — a comment inside the librarian intake directory walk, unrelated to seat resolution
- `cargo test resolve` → `20 passed; 0 failed`, including `resolve_pane_tests::resolve_pane_delegates_and_never_matches_prefixes_itself`, `resolve_pane_tests::a_pane_cannot_register_any_word_that_reaches_a_seat_address`, and `seat_alias::tests::mike_never_resolves_to_the_orchestrator`

## reader evidence
The wiring and green tests are real — `seat_alias::candidates` is called inside `resolve_from` and all 20 matching tests pass — but the cited location is wrong: the call is at `main.rs:7179` (inside `resolve_from`, which begins at 7172), while `main.rs:6137` is a comment line in the librarian intake walk.

## audit
{"clean":true,"reason":""}

## caveat
"F0: 2/2 correct blind DISAGREEs on the reachable subset; 2 of 16 of the record"

## return_ledger rows naming this id (1)
{"ts":"2026-09-08T07:32:19.282Z","pane":"sibling-3d57124e","session":"6fe15f0a","surfaced":["3d2cbbec366643aa","b98a1a31cb9fddf8","f50dfa20882b4270"],"misses":[{"id":"e5e68e2df6abfcbb","reason":"held-unaudited"},{"id":"abda3668c7aee0bd","reason":"held-unaudited"},{"id":"b0f40c8c8b173321","reason":"held-unaudited"}]}