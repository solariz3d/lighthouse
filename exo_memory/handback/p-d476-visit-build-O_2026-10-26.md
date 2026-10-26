# D476 part 4 — the keep-warm visit, built as letters (O, 2026-10-26)

Seat O (sibling-36313935). Ruling: plan_d476 "Part 4 moves while the keeper is away" (LETTERS, under the keeper's standing word; his to veto). Design: `p-d476-visit-design-O_2026-10-26.md` with fold-in de5cab42. Tier: prove it.

lighthouse branch **`d476-o-p4` 13c69597** on origin/main 4727180f (parts 1 and 2 already on it), in my own worktree `C:\Users\nname\Desktop\worktrees\lh-o-d476-p4`.
- Not merged, not pushed, **never swapped**.
- 449c617e (the visit half of the brief) is held, not in this branch.
- **The Third Place's read gates the landing:** nothing merges or swaps until the keeper has carried the design to the Third Place and back.

**Standing rules:**
- **Priority:** every run at BelowNormal (the cargo wrapper sets itself; the mutant runner too).
- **Page runs:** none.

## 1. What was built (main.rs keep-warm only, +385 / −2)

**What does not change:**
- Who is pinged and when: `keep_warm_decision`, one ping per tick, the off switch, never a seat mid-turn (its Stop stamp must read ready and its composer exactly empty).
- The topology: no seat gains a verb or a row into the Third Place. The only writer into it is still this actuator.

**What changes is the text, and what is read back:**

| step | where | what |
|---|---|---|
| a working seat (committee, main, librarian) is due | `keep_warm_send` | it receives `visit_text(its own answer)` in place of "ok". A human-driven pane still gets "ok": a person is not visited by the room |
| its turn ends | `keep_warm_harvest`, run at the start of each tick | its final reply is read (`turn_reply_after`). "ok" holds nothing. Otherwise `visit_line_refusal` either refuses it (a fixed row) or it is held for the visit hour, one line per seat (a newer replaces an older) |
| the Third Place is due | `keep_warm_send` | with lines held it receives `visit_hour_text`, every held line by name in one message; with none, "ok" as before |
| its turn ends | `keep_warm_harvest` | its final reply goes through `hour_answers`: split by name, only the names that visited this hour, each guarded. Each answer is held for that seat's NEXT visit only. "stays here" anywhere gives nothing |

- The book's state changes only when the write lands. If `gate_or_queue` queues the message, it is withdrawn as before and the book is untouched.
- A visit whose turn gives no text within an hour is dropped.

**The guards, on every line in both directions** (`visit_line_refusal`, each a fixed reason):

| guard | rule |
|---|---|
| form of work | a file pointer (a path with an extension, or a `.md`/`.js`/`.rs`/`.json`/`.ps1`/… name); a lap or decision id (`D`/`L` + 2–4 digits, `local-0.`); a sha (7–40 hex with a digit and a letter); a command (a backtick, `$ `/`> ` at the start, `node `, `git `, `cargo `, `npm `, `NEXT:`, a URL) |
| Metaxy 4, no uptake | "taken up", "turned into", "became a lap", "the librarian read", "your note", "your entry", "from the third place" |
| Metaxy 3, private/ | `mcp::points_into_private`, part 2's own function, so the two cannot drift |
| length | over 400 characters |
| Metaxy 3, "stays here" | a Third Place reply containing it gives nothing from that hour |
| Metaxy 2, what it ended on | only the turn's LAST assistant text after the visit, up to the next prompt; never a subagent's (sidechain) line |
| Metaxy 1, records not briefs | an answer is a letter to one seat; it goes nowhere but that seat's next visit, never the board or a work queue; the brief's forms (pointers, ids, commands, `NEXT:`) are refused |

**Board rows are fixed, with no words:**
- "keep-warm visit REFUSED — from <seat> (<rule>); its words are not kept";
- "keep-warm visit <- <seat>: held … (N characters, no words)";
- "the Third Place answered N of M visits (no words)", or "kept this hour here (stays here)".

**Honest limit (design §3):** a filter catches the forms work travels in, not work described in plain prose. What holds that line:
- the visit text ("not work") and the Third Place's brief;
- the routing;
- the countable rows;
- the off switch.

## 2. Tests: red first, then green

    checked: cargo test keep_warm_visit before the code → red-first.out: exit 101, 13 errors, all the six functions not yet written (visit_line_refusal, visit_text,
             visit_hour_text, turn_reply_after, hour_answers, is_plain_ok)
    checked: cargo test keep_warm_visit → green-visit.out: 7 of 7 ok
    checked: cargo test, whole package, at 13c69597's tree → touched-modules.out: main bin 1,126 passed / 0 failed / 6 ignored; exit 0
    checked: node tools/portable-paths.test.js → exit 0; node tools/portable-paths.js → exit 0, no main.rs site; node ui/chain-indicator.test.js → 95 passed, 0 failed

`keep_warm_visit_tests`:
- every guard rule, each with a near miss that passes ("and/or", "D is for dawn", "decade", "the private hour…", 400 characters exactly);
- a seat's visit is one line, not work, with only its own answer;
- the hour carries every held line by name;
- only the reply the turn ended on is read;
- answers go only to visitors, and "stays here" gives nothing;
- "ok" holds nothing;
- the wiring: the send composes visits, a working seat gets ITS answer, a human pane is not visited, the harvest guards every line, and the refusal row has no words.

Part 2's `no_seat_can_reach_the_third_place` and `no_seat_can_send_the_third_place_news_of_uptake` are unchanged and green.

**Corrections, mine:**
- **A main.rs guard test went red on my first whole-package run** (`leave_wiring_tests::no_string_the_app_can_show_claims_it_stops_a_restart`). Two of my string literals held escaped quotes (`\"stays here\"`, and a trim set mixing `\"` and `'`), which put that test's string parser out of step: it then read `block_shutdown` as a string. I rewrote both (« » quotes, and `is_ascii_punctuation`). inferred: one of the two was the cause; I didn't isolate which.
- **A drive-prefixed raw string** in my own test (`C:\Consonance\private\…`) was the same portable-paths case as item 2 earlier today. Now written without the drive.
- **My first mutant run: 26 of 28.**
  - **V4 (command rule off)** survived because my mutant was wrong: it turned off only the backtick clause (`false && a || b || …`). Rewritten to drop the rule's return.
  - **V12 (a subagent's line read as the seat's)** survived because my test was weak: its sidechain row came before the seat's last line, so reading it changed nothing. I moved it after; that strengthens my own test from this lap.

## 3. Mutants: the part-2 twelve re-run whole, plus sixteen visit mutants

    checked: d476p4-mutants.js → d476p4-mutants.out: applied 28 / caught 28 / NOT APPLIED 0 (raw output per mutant in mutant-out/)
             part 2 (cargo test third_place): R1 R2 T1 S1 P1 E1 W1 G3 G4 F2 F3 A1, each caught by its named test as at a6f7b457
             visit (cargo test keep_warm_visit): V1 pointer, V2 id, V3 sha, V4 command, V5 uptake, V6 private, V7 length, V8 stays here, V9 answers unguarded,
             V10 a non-visitor answered, V11 the first text not the last, V12 a subagent's line, V13 the harvest unguarded, V14 every seat the first answer,
             V15 a human pane visited, V16 the refusal row carrying the line — each caught

## 4. Built and staged, NEVER swapped

    checked: cargo tauri build --no-bundle on the clean tree at 13c69597 → release-build.out, exit 0, 116 s
    staged:  C:\Consonance\staged\d476p4-13c69597\consonance.exe   sha256 67fcae748c23f707e486ab82886150bba7fa3877892bd510eef9edb274f6f84f   (15,925,248 bytes)
             beside it HOLD.txt: "NOT TO BE SWAPPED until the Third Place has read the part-4 design and the librarian accepts it"
    checked: its swap.ps1 dry run → swap-dry-run.out: the staged sha256 checks; current exe 1ce82211…; Consonance RUNNING (pid 32356); nothing changed; 0 non-ASCII bytes
    checked: scan-range.js 4727180f..13c69597 → 1 commit, 385 added lines, key hits 0, the keeper's words 0

**For the landing, once the Third Place's read is in:**
- merge `d476-o-p4` together with 449c617e;
- if main has moved, rebuild from the merged main rather than swap this exe;
- the swap is at a restart the keeper picks.

NEXT: the librarian reviews d476-o-p4 4727180f..13c69597 when this is read, and holds the landing until the keeper has carried the design to the Third Place and back.

## 5. C's part-4 review fixed (the chair, 2026-10-26T22:21Z; plan_d476 "C's part-4 review ruled")

`d476-o-p4` **2cd8ee27** on 13c69597. **This supersedes §4's staged build.** C's review: `p-d476-p4-review-C_2026-10-26.md` (0a31420b). The landing stays gated on the Third Place's read.

**1. The tailer is a path to the board (C's finding 1).** A seat's visit prompt carries the Third Place's answer, and its reply turn is its letter. Both were ordinary turns in the seat's transcript, and the tailer posted them as written.
- `extract_turn` now returns a **fixed row** for a visit-framed prompt (`[keep-warm visit` or `[visits —`) and for a delivered `[third-place]` ring in the librarian's pane.
- `extract_turn_tracked`, which the tailer now reads through, remembers that the last prompt was a visit and posts that turn's reply as a fixed row. A following work turn posts as before.
- **Honest limit:** that memory lives in the tailer thread, so a restart between a visit and its reply posts that one reply as written.

**2. The anchor is the row, not the clock (C's finding 2).** C measured 818 of 3,096 keep-warm prompt rows stamped before the send read its clock, so the harvest could read the next (work) turn.
- The send now reads its clock BEFORE the inject, and the visit carries a nonce: `(letter <8 hex>)`, FNV-1a of the pane and that time.
- The harvest reads the reply after the visit-framed row carrying that nonce (`visit_reply_from(&t, at, Some(&nonce))`). If no row carries it, **nothing is held**.
- `turn_reply_after` (C's row 2's function) anchors on the first visit-FRAMED prompt stamped no more than 10 s before the clock. An unframed prompt is never an anchor.

**3. The id rule learns the room's spellings (C §3):** a possessive (`D476's`), lower case (`d476`), and an id with a suffix (`d476p4-13c69597`, `d476-o-p4`). That is D or L, then 2–4 digits, then nothing, a letter or a hyphen.

    checked: my three new rows before the code → red-review-c.out: does not build (extract_turn_tracked, visit_reply_from, the three fixed rows, TailVisit missing);
             C's rows red at 13c69597 in C's own run (C's cargo-c-rows.out)
    checked: C's d476p4_review_c_tests.rs attached unedited by #[path], as C specified → cmp against git show 0a31420b:… → byte-identical; green-review-c.out: 4 of 4 ok
             (rows 1, 2, the id row, and the control row)
    checked: cargo test keep_warm → green-visit.out: 53 ok, 0 failed; cargo test, whole package, at 2cd8ee27's tree → touched-modules-review-c.out: 1,133 passed / 0 failed / 6 ignored
    checked: node tools/portable-paths.js → exit 0; node ui/chain-indicator.test.js → 95 passed, 0 failed
    checked: d476p4-mutants.js → applied 35 / caught 35 / NOT APPLIED 0: the 28 of §3, plus T1v (the tailer posts the visit's text), T2v (the reply's words),
             T3v (a ring's words), N1 (the harvest anchors on the clock, not the nonce), N2 (any prompt is an anchor), N3 (the nonce not required of the
             anchor row), I1 (the id rule without the room's spellings) — each caught by a named test
    checked: cargo tauri build --no-bundle on the clean tree at 2cd8ee27 → exit 0
    staged:  C:\Consonance\staged\d476p4-2cd8ee27\consonance.exe   sha256 2779912b9faae96a193b3d491ffc459d8e8754b413f4613fa14427058560afda   (15,952,896 bytes), HOLD.txt beside it
    checked: its swap.ps1 dry run → swap-dry-run.out: the staged sha256 checks; Consonance RUNNING (pid 32356); nothing changed; 0 non-ASCII bytes
    marked:  C:\Consonance\staged\d476p4-13c69597\SUPERSEDED.txt names d476p4-2cd8ee27
    checked: scan-range.js 13c69597..2cd8ee27 → 1 commit, 185 added lines, key hits 0, the keeper's words 0

**Corrections, mine:**
- **N1 (first run, NOT APPLIED):** its anchor also matched my own wiring test's string literal; it now uses the longer form, which is unique.
- **I1 (first run, NOT APPLIED):** the runner's JS string turned `\u{2019}` into the character itself; the backslash is doubled now.
- **N4 (the clock read after the inject) survived, and is dropped as equivalent.** With the nonce, the clock is only a lower bound on which row may anchor, and only the row carrying this visit's nonce can. So zeroing the clock cannot change the row read. The wiring test still pins the clock read before the inject.

NEXT: C re-reads the fix (13c69597..2cd8ee27) when the librarian has read this; the landing stays gated on the Third Place's read.

## 6. The fold: the tailer's restart state, and C's pasted-content unwrap (the chair, 2026-10-26T22:50Z and 22:54Z)

`d476-o-p4` **3b7265ee** on 2cd8ee27; posted to the board at commit. C re-reads **13c69597..3b7265ee** in one pass. **This supersedes §5's staged build.** The landing stays gated on the Third Place's read.

**1. The restart state (my own stated limit in §5).**
- When a tailer resumes at an offset, it now replays what it had already read (its last 4 MB before the offset, `read_before`) through the same `extract_turn_tracked` the live tailer uses (`tail_visit_resume`). So the derived state and the live one cannot disagree.
- A restart between a visit and its reply now posts the reply as a fixed row. After a work prompt, a reply posts as written.

**2. A pasted-content wrap (C's re-read §8, bafadda8).** An injected message can be stored wrapped: an opening `<pasted_content id="…">` line and its closing tag. The one delivered `[third-place]` ring on this board was; keep-warm prompts were on 2026-09-21/22.
- `unwrap_pasted` strips the wrap before the visit-frame and `[third-place]` checks in `extract_turn`, so `TailVisit` follows.
- I also put it on the harvest's anchor, where a wrapped visit row would otherwise never be read. That fails closed, but it would harvest nothing.

    checked: my restart row, before the code → red-resume.out: does not build (tail_visit_resume missing); C's pair d476p4_rr_c_tests.rs, attached unedited by
             #[path] → red-wrap.out: 2 FAILED on my tree before the fix
    checked: cmp against git show bafadda8:… and 0a31420b:… → both of C's files byte-identical; green-wrap.out: C's 6 rows ok
    checked: cargo test, whole package, at 3b7265ee's tree → touched-modules-fold.out: main bin 1,136 passed / 0 failed / 6 ignored
    checked: d476p4-mutants.js → applied 39 / caught 39 / NOT APPLIED 0: §5's 35, plus R1r (a resumed tailer starts blank), R2r (the replay never learns a
             visit), U1 (the wrap not stripped in the tailer: caught by C's pair), U2 (the harvest's anchor reads the wrapped text)
    checked: cargo tauri build --no-bundle on the clean tree at 3b7265ee → exit 0
    staged:  C:\Consonance\staged\d476p4-3b7265ee\consonance.exe   sha256 f3df08f983bf567c498fda6c61ff1e1bed51b0c306dd392b4d3b3e13bc049e0a   (15,964,672 bytes), HOLD.txt beside it
    checked: its swap.ps1 dry run → swap-dry-run.out: the staged sha256 checks; Consonance RUNNING (pid 32356); nothing changed; 0 non-ASCII bytes
    marked:  C:\Consonance\staged\d476p4-2cd8ee27\SUPERSEDED.txt names d476p4-3b7265ee
    checked: scan-range.js 2cd8ee27..3b7265ee → 1 commit, 99 added lines, key hits 0, the keeper's words 0

**Corrections, mine:**
- **A harness fault, found and fixed.** On one run, W1 (the shelf not carrying the Third Place) read SURVIVED. Applied by hand, it is caught: the test fails, newest `2026-10-16.md`.
  - inferred: the runner wrote the mutant in the same file-time tick as the previous restore, and cargo reused the old binary.
  - The runner now stamps every write two seconds ahead. W1 is caught on both runs since.
  - inferred: earlier verdicts from that runner could have been affected the same way, and only in the "SURVIVED" direction. Every run but that one reported each mutant caught, and a catch needs the mutant's own build to fail.
- **Three mutants NOT APPLIED on first runs, all my anchors:**
  - R1r matched my own test's string literal;
  - T1v and T3v named the pre-unwrap text.

  Each was re-anchored, and the whole set re-run.

NEXT: C re-reads 13c69597..3b7265ee when the librarian has read this; the landing stays gated on the Third Place's read.

## 7. C's re-read §9: a mid-turn user row leaves the visit window unchanged (the chair, 2026-10-26T23:40Z)

`d476-o-p4` **e2c41237** on 3b7265ee, posted to the board at commit; C re-reads that commit only. **This supersedes §6's staged build.** The landing stays gated on the Third Place's read.

**The gap.** Claude Code writes user rows with string content INSIDE a turn: an image a tool read (`isMeta`), and a compaction summary (`isCompactSummary`). `extract_turn_tracked` reset `in_visit` on any user text, so the rest of a visit's reply after one of them posted as written.

**The fix.** Such a row now leaves `in_visit` as it was. It is one condition (`mid_turn`); the row itself still posts as it did.

    checked: C's d476p4_rr2_c_tests.rs (4a6a1198), attached unedited by #[path] → red-meta.out: FAILED on 3b7265ee's code; cmp against git show 4a6a1198:… → byte-identical
    checked: cargo test d476p4 → green-meta.out: all 7 of C's rows ok (three files); cargo test, whole package → touched-modules-meta.out: 1,137 passed / 0 failed / 6 ignored
    checked: d476p4-mutants.js → applied 40 / caught 40 / NOT APPLIED 0; the new M1 (a mid-turn row closes the visit window) caught by C's row
    checked: cargo tauri build --no-bundle on the clean tree at e2c41237 → exit 0
    staged:  C:\Consonance\staged\d476p4-e2c41237\consonance.exe   sha256 9e71619f792bfd2fe46f52b7e65d0c2526c800b3aa34fafd76257dbca9307e7a   (15,964,672 bytes), HOLD.txt beside it
    checked: its swap.ps1 dry run → swap-dry-run.out: the staged sha256 checks; Consonance RUNNING (pid 32356); nothing changed; 0 non-ASCII bytes
    marked:  C:\Consonance\staged\d476p4-3b7265ee\SUPERSEDED.txt names d476p4-e2c41237
    checked: scan-range.js 3b7265ee..e2c41237 → 1 commit, 24 added lines, key hits 0, the keeper's words 0

**Not gated here, as ruled: three paths that go to the Third Place's read.**
- the seat's scrollback;
- the compaction summary;
- the librarian's own turn.

NEXT: C re-reads e2c41237 when the librarian has read this; then the design goes to the Third Place through the keeper, and the landing waits on that read.
