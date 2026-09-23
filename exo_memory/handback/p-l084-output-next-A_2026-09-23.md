# P-L084-OUTPUT-NEXT · ALPHA — the rule is written and the check is built and tested, but as scoped it goes live at the next rebuild NOWHERE: `mcp.rs`'s gate calls `check(text)` and never passes the verb. One line of `mcp.rs`, not mine, wires it

**Pane A, machine L, 2026-09-23 01:1x–01:4x.** Lap L084. The spec, read at source: `exo_memory/librarian/2026-09-22.md`
"2026-09-23 01:1x, ON L". The keeper's words are quoted from there and from the chair's transcript check (07:14:20 and 07:15:52
UTC). **Three files, uncommitted** (`git diff --numstat`):
- `consonance/src-tauri/brief/BUILDING.md` (+42)
- `consonance/src-tauri/src/trailer.rs` (+201)
- `exo_memory/loop/plan_unattended_2026-09-22.md` (+15 −2)

**No rebuild, no restart, no settings.** Not touched: `mcp.rs`, and E's and C's files.

## 0 · FIRST — THE WIRING GAP, stated before anything is claimed live

`trailer_gate` (`consonance/src-tauri/src/mcp.rs:3581-3604`) runs **`check(text)`** at `:3583`. `check` takes the text only, so it
cannot tell a collation ring from a pane ring. **A rule for `call_chair` alone therefore cannot be enforced from inside
`trailer.rs`.** Built there, it is correct, tested and unreached. The packet's *"it goes live at the next rebuild"* is true only
after this one change, which is in `mcp.rs`, a file this lap did not give me:

    mcp.rs:3582   use crate::trailer::{check, delivered_with_warning, policy, refusal_text, Action};
    mcp.rs:3583   let why = match check(text) {
      →
    mcp.rs:3582   use crate::trailer::{check_for, delivered_with_warning, policy, refusal_text, Action};
    mcp.rs:3583   let why = match check_for(verb, text) {

`check_for` returns exactly `check`'s result for `call_librarian` and `chair_inject`, so those two verbs keep every current
behaviour. A test pins that. `refusal_text` and `delivered_with_warning` already take the new reasons. `mcp.rs` never matches on
`Missing` (grep → 0), so the four new variants break nothing there. **With the change, `call_chair` refuses a collation with no line
and returns it whole; without it, nothing changes at the rebuild.** I recommend adding one test to `mcp.rs`'s `trailer_gate_tests`
in the same edit: `trailer_gate(Verb::CallChair, …)` on a message with a valid NEXT and no OUTPUT line is a `Refuse`.

## 1 · THE THREE PIECES

**(1) BUILDING.md, item 6 in both sections, as amendments of 2026-09-23.** The 09-16 text is kept whole in both. The dispatch
amendment is at `:225`, the hand-back one at `:441`. Both quote the keeper verbatim and point at the spec entry.
- **Dispatch side:** a plan item in a trailer is a **DEFAULT**, written *"plan default after it: <item>, unless the output says
  otherwise"*, because a dispatch cannot know what the work will find. It names the three overrides of 09-22 (C D121, B D120,
  C D122), each of which held only because the collator read the output.
- **Hand-back side:** the collation ring owes `OUTPUT → NEXT: changed|unchanged — <why, from the output>`, directly before its NEXT.
  Panes do not owe it. It names the gate, and it says what the gate cannot do. It also records the struck 09-22 "real close" as
  superseded.

`node consonance/tools/portable-paths.js` → RED on one site only, `consonance/tools/trip-check.test.js:34` (C's, pre-existing, named at
D122). BUILDING.md adds none.

**(2) `plan_unattended_2026-09-22.md` :45-47, SUPERSEDED IN PLACE.** The "real close" sentence is struck, not deleted. Beneath it
sits a dated block: why it must not be built (it hardens the plan over the output), the keeper's two sentences, what replaces it,
and pointers to the spec entry, both BUILDING.md amendments and `trailer.rs` `check_for`. *Not touched and worth a look:* `:41`
still says every ring names "the plan's next item". That is the baton rule this refines, not the sentence the packet named.

**(3) `trailer.rs`:**
- `requires_output_next(verb)` is true for `CallChair` only.
- `check_for(verb, text)` runs the NEXT trailer first, so the older rule is never shadowed, then, for the collation ring, the line.
- Four new `Missing` reasons, each with its own phrase.
- A refusal text in the existing form: it names `RULE_FILE`, HAND-BACK item 6 and the 2026-09-23 amendment, quotes the keeper, shows
  the shape, and returns the message whole.
- `check`, `policy` and the old refusal text are unchanged. D069's `call_chair → Refuse` (`:132-134`) is what makes this a refusal
  and not a warning. The payload argument that keeps `call_librarian` at WarnAndDeliver is untouched.

## 2 · THE THREE DECISIONS, ARGUED

- **Where the line sits: directly before the NEXT trailer, not anywhere.** A phrase accepted anywhere is satisfied by a quote of
  it — L082, the test that passed on its own retraction. A collation routinely quotes packets and pane lines. Directly-before also
  keeps the verdict beside the route it justifies, which is the whole point. If the line is elsewhere, the reason is named
  (`OutputNextNotBeforeTrailer`) rather than reported as absent, so the fix is obvious. Cost: a re-send, and the refusal returns
  the message whole.
- **`OUTPUT -> NEXT:` counts. The marker stays case-sensitive, like `NEXT:`.** The arrow is typography. A keyboard, a relay or an
  encoding can turn `→` into `->` (the room has lost a night to an em-dash before), and refusing on a glyph teaches nothing.
  Lowercase `output → next:` is prose and does not count, the same line `check` draws.
- **After `changed|unchanged`:**
  - the verdict as a **whole word** (`unchangedly` and `changes` are refused);
  - then a **separator**: `—`, `–`, `-` or `:`;
  - then a **non-empty reason**.
  - A bare space is not a separator. `unchanged because nothing moved` run together is where a missing reason hides, and the
    rule's own shape has the dash.

## 3 · PERMISSION TO REFUSE, TAKEN SERIOUSLY — is the verb the wrong mechanism?

**It can be satisfied emptily: `OUTPUT → NEXT: unchanged — ok` passes.** No shape check can require a TRUE reason. This file's own
header already refuses to parse meaning, for the right reason: a gate that parses meaning teaches the words that satisfy the
parser.

**My answer: the verb is the right mechanism for what a verb can do, and it should not be asked for more.** What it does is make
the verdict **exist**, beside the route, on every collation. That is a claim on the board a later reader can hold against the output
it names. The 09-16 NEXT rule is the precedent: rings went from 0 of 18 carrying one to carrying one, and nobody measured whether
the stations were right either.

**The honest check of the verdict is a count, and it cannot live in the gate**, because the plan default is in the *dispatch* and
the verdict is in the *collation*. **Proposed, not built:** pair each collation's `changed|unchanged` with the default its lap's
dispatch named. Then count `unchanged` whose NEXT differs from the default, and `changed` whose NEXT equals it. Both are
contradictions a reader can see. **Falsifier for the rule:** if ten collations on, every one says `unchanged` and one of them
moved off its default, the line is decoration.

## 4 · TESTS — red first, and plain

    rustc --edition 2021 --test src/trailer.rs     (the standalone build the file's header names)
      BEFORE 22/0  ·  RED 29/7 (the 7 are exactly the refusal and rule cases, against a stub that ignores the rule)  ·  AFTER 36/0
    CARGO_TARGET_DIR=<own dir> cargo test --bin consonance -- trailer     47 passed, 0 failed, 841 filtered
      (this file's 36 plus mcp.rs's 11 trailer_gate tests, which still pass because mcp.rs still calls check)

**The new tests:**
- **Pass:** `changed`, `unchanged`, and the ASCII arrow.
- **Refusal:** no line; the line elsewhere (a quote in the body); no verdict word (`maybe`, `unchangedly`, `changes`, a bare
  dash); no reason (four shapes, plus the bare-space case).
- **Other rules:** the marker is case-sensitive; a missing trailer is still reported first; only `call_chair` owes the line.
- **A pane ring without the line is still delivered:** `check_for(CallLibrarian, …) == check(…)`, and its policy is still
  WarnAndDeliver.
- **A chair dispatch does not owe it.**
- The refusal names the file, the item, the keeper's words and the shape, and returns the message. Each new reason names only
  itself.

**BUILDING.md's readers, re-run:** boundary-check.artifacts 4/0 · lap-row 136/0 · open-items-build 6/0 · universe-print 16/0 ·
carrier-drift exit 0.

## 5 · MUTANTS — on copies, the room's form

`node <scratchpad>/l084/mutants.js`: copies of `trailer.rs`, scored by the standalone test build, with the live file hashed
before and after.

    12 listed · 12 applied · 12 caught · 0 survived · 0 NOT APPLIED · 0 NO RESULT · live file unchanged
      rule off · every verb owes it · ASCII arrow rejected · anywhere counts · any verdict word · verdict as prefix ·
      no reason required · bare space as separator · trailer not checked first · elsewhere reported as absent ·
      the keeper's words dropped · the message not returned

**The first run was 9 caught · 1 survived · 2 NO RESULT.**
- **The survivor, "a bare space counts as the separator", was a real test gap.** No test ran a reason on after a space. I added
  that case to my own new test, with a comment saying the mutant found it.
- **The two NO RESULT rows were mine:** mutants that did not compile. A non-compiling mutant is not a kill. I rewrote both to
  compile and both were then caught.

## 6 · WHAT I DID NOT VERIFY

- **The live gate.** It needs §0's `mcp.rs` line and then a rebuild. Neither was mine to do.
- **The whole crate suite.** Only `-- trailer` was run (47 of 888). The change adds functions and enum variants and alters no
  existing path, but the other 841 were not run.
- **That the librarian's collations can meet the shape as written.** None has been checked against it; the first real collation
  after the rebuild is the test.

NEXT: librarian call_librarian with the hand-back pointer when the three pieces and their tests are written — plan default after it: L083's collation, then items 3 + 2, unless the output says otherwise; this output says one mcp.rs line (§0) is owed before the rule can go live at any rebuild

## Step 2 · 2026-09-23 01:2x — WIRED: `trailer_gate` now passes the verb, so the collation rule goes live at the next rebuild

The chair moved the boundary to include `mcp.rs` (the `trailer_gate` call and its test module only), per the librarian's
collation of §0 (`OUTPUT → NEXT: changed`). Step 1 above is kept as it was. **`consonance/src-tauri/src/mcp.rs` +54 −5**
(`git diff --numstat`). `main.rs` was not touched; C was editing it (L085, +135 −7 dirty at the time).

**The change** (`mcp.rs:3582-3585`): `use crate::trailer::{check_for, …}` and `let why = match check_for(verb, text) {`, with a
two-line comment. `check` was dropped from the `use` because nothing else in `trailer_gate` used it (the build shows no unused-import
warning for it).

**Tests, red first** (`CARGO_TARGET_DIR=<own dir> cargo test --bin consonance trailer`):

    BEFORE the edits     47/0
    new tests, no wiring 49/2   — the refusal case and the wiring pin, exactly
    wired                50/1   — the OLD test, predicted before the edit (below)
    after                51/0
    cargo test --bin consonance mcp::                             120 passed, 0 failed

- **New:**
  - `CallChair` + valid NEXT + no OUTPUT line → **Refuse**, with the message returned whole, the reply naming `OUTPUT → NEXT:`
    and HAND-BACK item 6, and a board line;
  - `CallChair` with the line → Deliver, unchanged, no audit;
  - **`CallLibrarian` and `ChairInject` with a valid NEXT and no OUTPUT line → Deliver, unchanged, no audit;**
  - the wiring itself is pinned by source: `trailer_gate` contains `check_for(verb, text)`.
- **One existing test changed, because it became verifiably wrong under the rule.**
  `every_verb_with_a_trailer_delivers_the_message_unchanged_and_posts_nothing` looped all three verbs over `WITH`, a valid
  NEXT and no OUTPUT line. That is now a non-compliant collation. The same assertion is kept for `ChairInject` and
  `CallLibrarian` on `WITH`, and for `CallChair` on a compliant collation. A dated comment in the test says why. It went red
  only after the wiring, as predicted, and it was the only one.

**A red that is not mine, and it cost one read, not a run.** `cargo test --bin consonance mcp` (without `::`) reads 121/1. The
failure is `scribe_wrap_tests::every_one_shot_call_runs_with_no_tools_no_hooks_no_mcp_and_no_saved_session` at
`main.rs:8488`: *`--tools ""` — neither caller needs a tool; left: None, right: Some("")*. It matched my filter only because
its name contains "no_mcp". That is C's L085 test in C's in-flight `main.rs`, and presumably C's red-first. **Not touched.** The
`mcp::` prefix run above excludes it and is the count for this lap.

**Mutants on the wiring**, in a detached worktree of HEAD with only my two files copied in (C's half-edited `main.rs` stays out;
HEAD's already has `mod trailer;`). Scored by `cargo test --bin consonance trailer`, no timeout wrapper
(`node <scratchpad>/l084/wire-mutants.js`):

    pre-flight on the copy 51/0
    caught (49/2)  W1 the gate calls the text-only check again — the pre-L084 wiring
    caught (49/2)  W2 the verb is ignored: every message is checked as a pane ring
    caught (48/3)  W3 every message is checked as a collation
    caught (47/4)  W4 the dispatch owes the line too
    4 listed · 4 applied · 4 caught · 0 survived · 0 NOT APPLIED · 0 NO RESULT · worktree removed · live files unchanged

Together with step 1's 12/12 on `trailer.rs`: **16 applied, 16 caught.**

**Not verified:** the live gate (next rebuild, not mine to do), the full 900-test crate (`trailer` and `mcp::` only), and a real
collation against the shape. **The first one the librarian sends after the rebuild is the test.**

NEXT: librarian call_librarian with the hand-back pointer when the wiring and tests are written — plan default after it: land L084 whole, then the Scribe lap's (L085) collation, unless the output says otherwise
