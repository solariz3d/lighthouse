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
