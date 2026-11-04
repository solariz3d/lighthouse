# L134 L-CONVERGE — the reviewer's hand-back (pane E, non-author, on L) · 2026-11-04 ~01:2x local

**VERDICT: GREEN.** All 6 of B's decision rows re-derive from the two parents as B stated them. No row is wrong. The one red Rust
test on the merged tree is also red on pure `origin/main` with origin's own data, so the merge does not introduce it (§3).

- **Reviewed:** merge `880f237f255064f7e2078b5b8fe9a3bb2d50d831`, parents L `14f9495d` and origin `1809ab39`, merge base `fab63d57`
  (`git merge-base`).
- **Worktrees:** my own, `git worktree add --detach <scratch>/lconv-E 880f237f`, plus a second one at `1809ab39` for one check.
  - `find -type l` → 0 and `dir /AL /S` → "File Not Found" on both, before running and again before removal.
  - Both removed after the runs.
- **Not touched:** the shared checkout's working tree, apart from this file and one map line. Nothing pushed or committed.

## 1 · The 6 rows, re-derived from the parents (not from B's rows)

**First, which L commit touched each conflicted file:** `git log --oneline fab63d57..14f9495d -- <file>`.
- heavy-run.js and its test: `88278a11`;
- trailer.rs and mcp.rs: `9e47cb17`;
- main.rs: `e3eadda2` and `d592269f`;
- the doc: `d6383d5b` and `1194acb6`.

That is exactly B's attribution.

| # | file | B's row | re-derived | agrees |
|---|---|---|---|---|
| 1 | heavy-run.js | PORTED | Origin was missing all of 88278a11 | ✔ |
| 2 | heavy-run.test.js | PORTED | Every test from both sides is present | ✔ |
| 3 | trailer.rs | origin kept | Origin already carries the sender note | ✔ |
| 4 | mcp.rs | origin kept | Origin already carries the sender note | ✔ |
| 5 | main.rs | PORTED | Origin had no intake_reserve; it is ported with its tests and fixtures | ✔ |
| 6 | the doc | origin whole + L appended | Both texts are whole | ✔ |

**Row 1, heavy-run.js.** Symbol counts per tree, `git show <rev>:consonance/tools/heavy-run.js | grep -c <sym>`:

| symbol | L | origin | merged |
|---|---|---|---|
| selfIdentity | 2 | 0 | 2 |
| processIdentity | 4 | 0 | 4 |
| hasIdentity | 2 | 0 | 2 |
| sameHolder | 3 | 0 | 3 |
| START_TOLERANCE_MS | 4 | 0 | 4 |
| IDENTITY_RECHECK_MS | 3 | 0 | 3 |
| holder_start | 7 | 0 | 7 |
| now_running | 1 | 0 | 1 |

- Origin had none of 88278a11. Its header, lines 45–46, says a REUSED pid "reads alive", so the waiter waits.
- **B's correction of the plan is right:** origin did not already handle a reused pid.

**Row 2, heavy-run.test.js.** Comparing `test('…'` titles: origin 52, L 21, merged 61.
- Every origin title is present except the schema test.
- Every L title is present except L's version of the same schema test.
- The schema test is merged into one: it asserts origin's `tree` (D286) AND L's `image` and `holder_start`. Its key list is
  `['cmd','holder_start','image','pid','seat','started','token','tree']`.
- 52 − 1 + 1 + 9 = 61. **No test was dropped.**

**Rows 3 and 4, trailer.rs and mcp.rs.** `git diff --quiet 1809ab39 880f237f -- <f>` → IDENTICAL for both.
- **L's change (9e47cb17)** gave the SENDER a note: `with_sender_note(out, told)`, with the delivery result first.
- **Origin's 1809ab39 already does this:**
  - `trailer.rs:292 sender_note` (D633);
  - `mcp.rs:4429 with_sender_note` (`format!("{out}\n\n{n}")`, so the result comes first), used at 633, 728 and 1077
    (`call_librarian`);
  - its tests `d633_a_warned_message_reaches_the_receiver_unchanged…`, `d633_the_note_is_appended_to_what_the_sender_is_told` and
    `d633_each_verb_returns_the_note_to_its_sender`.
- **L's 4 tests** (`l125_…`) are covered by these, except L's "the sender gets the SAME note the receiver gets". Origin
  deliberately removes the receiver's note (`trailer.rs:463`, "AMENDED BY NAME (D633)").
- **Taking origin is right:** that difference is D's later, deliberate design. Porting L's receiver note would undo it.

**Row 5, main.rs.** Counts per tree:

| | origin | L | merged |
|---|---|---|---|
| `fn intake_reserve` | 0 | 1 | 1 |
| `fn l129_*` | 0 | 5 | 5 |

- **The function was ported unchanged:** L's `intake_reserve` body and the merged body are identical once comments and whitespace are
  stripped (21 lines, `diff` empty).
- **All 8 of L's added tests are present in the merge**, from `git show e3eadda2 d592269f | grep -A1 '#[test]'`: 1 each.
- **The callers:**
  - Origin already had `assemble_intake_for(map_reserve, repo_maps, repo_notes)`.
  - The merge widens it to `(requested, newest_len: Option<usize>, …) -> (String, usize)`.
  - Only `intake_with_map` passes `Some(newest_len)` (merged line 6329).
  - `assemble_intake_within` (3114) and origin's map test (3562) pass `None`, so their behaviour is origin's.
- **The fixture refresh is a correct port, not a revert of D's work.** The REAL_* constants at the base were REAL_ROOM 40_619,
  CORE_TAIL 14_958, COMMITTEE 13_714 and 12 cards. Origin is identical to the base (`git log -S REAL_ROOM fab63d57..1809ab39` →
  none). L changed them to 40_423 / 18_195 / 15_823 / 13 cards, and the merge carries L's.

**Row 6, the doc.** Lines: base 225, origin 353, L 246, merged 378.
- **Both sides only appended after the base:** `head -n 225` of each side `cmp`s equal to the base.
- **Merged lines 1–353 are origin's file, byte for byte** (`cmp`).
- **L's 21 appended lines are whole in the merge.** Lines 1–3 (blank, `---`, blank) are at merged 354–356, and lines 4–21 are merged's
  last 18 lines, byte for byte (`cmp`).
- **Between them, B inserted 4 lines:** a `## from L, 2026-09-27 — kept at the L/D convergence` heading and an italic note. Nothing
  from either side was altered or lost.

## 2 · The 09-29 files, and everything else L changed

**The 09-29 files:** every path dated `2026-09-29` that changed on L since the base (`git diff --name-only fab63d57 14f9495d | grep
2026-09-29`) gives an empty `git diff 14f9495d 880f237f`. **16 of 16 are byte-identical.** B counted 14 by blob, so the two extra
paths are in the same set, found by name.

**Every L path:** 53 paths changed on L since the base. Outside the 6 conflicts, only 5 differ from L in the merge, the maps
`exo_memory/map/{A,B,C,E,M}.md`. Those took appends from both sides. For each map:
- the lines L added since the base that are missing from the merge: **0**;
- the lines origin added that are missing: **0**;
- base lines deleted: **0**.

## 3 · The tests (each under `C:\Consonance\data\heavy-run.lock`)

**How they ran:** `node --max-old-space-size=4096` (and `NODE_OPTIONS`), with my own `CARGO_TARGET_DIR=<scratch>/cargo-target-E`,
through `<scratch>/locked.js`.

| run | result |
|---|---|
| `node --test consonance/tools/heavy-run.test.js` | **61 / 61 pass**, 0 fail (30 s) |
| the same, with origin's heavy-run.js put back (red-check, then `git checkout`; worktree clean after) | **54 pass / 7 fail**, the same 7 B named |
| `node --test consonance/tools/label-watch.test.js` | **27 / 27 pass** |
| `cargo check` in `consonance/src-tauri` | **exit 0**, `Finished dev profile`. Warnings only (e.g. 12 in bin "consonance") |
| `cargo test --bin consonance -- trailer l129 shell_budget intake` | **134 passed / 1 FAILED / 2 ignored** (154 s). All 8 `l129*` ok; 59 trailer tests listed, all ok |
| the 1 failure on the merged tree | `intake_light_tests::light_the_pane_intake_is_under_target_with_the_cards_and_the_room`, "card …earned-not-performed.md rides strict but not light", the same as B's |
| **the same test on PURE origin `1809ab39`** (a second detached worktree, origin's code and data) | **FAILED, with the identical message** |

**So the light-intake failure is pre-existing on origin main.** It is not caused by the merge or B's port; this closes B's
"not checked". It is a live-data test, red on main today, and is worth routing to D as its own item.

**My test filter differs from B's** (B ran `trailer l129 shell_budget`, 97, and `intake map fork`, 86 + 1 fail). Mine is one
combined filter, so the totals differ. Not a discrepancy.

## 4 · NOT verified

- **The full Rust suite and the full JS suite:** not run (packet: targeted only). `inferred:` unaffected beyond §1's touch points.
- **The app build and the port live:** not run, by the packet's guard. The reserve change is not observed in a real shell.
- **`processIdentity` on this machine:** `checked`, by the REAL tests inside the 61/61.
- **The other ~1,800 files that merged clean from origin's side:** not reviewed. `inferred:` git's clean merge. Only L's side was
  checked path by path (§2).
- **The light-intake failure's root cause:** not diagnosed. Only located as origin's.

## 5 · Corrections (mine)

- Before reading the doc, my first check of row 6 used `includes()` on L's tail and returned **false**. The cause was the 4-line
  marker B inserted between L's leading `---` block and its content. A line-by-line `cmp` showed both texts whole. It is recorded,
  not hidden.
