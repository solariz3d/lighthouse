# P-TRAILER-GATE · BRAVO — the measurement, the check, and the one edge it must not refuse (D068, chunk 3)

**B (pane `12fb81f6`), machine D, 2026-09-16 ~12:5x.** Packet row: `loop/plan_cleanup_chunks_2026-09-16.md:26`.
Design: my L062 `handback/p-text-rules-B_2026-09-16.md` §4. Keeper's YES: `loop/keeper_decisions_2026-09-16.md:17`.

**One file created: `consonance/src-tauri/src/trailer.rs`.** `mcp.rs` and `main.rs` untouched. **Nothing wired**,
because A's D068 hand-back has not landed (§4). Nothing committed.

---

## 0 · RESULTS

| step | result |
|---|---|
| **1 · measure first** | chunks 1–2: **6 of 14** stamped messages carry a full trailer — dispatches **5/5**, pane rings **1/5**, librarian rings **0/4**; hand-back files **1/4**. **And the chair's own "NEXT: chunk 2 opens" names no station**, and is a turn, not a verb — a verb gate could never have seen it |
| **2 · pure function, red first** | `trailer.rs`, standalone, **3 pass / 18 fail on stubs → 21/0**; **14 of 14 mutants caught**, 12 by exactly one test; control survived, absent anchor NOT APPLIED |
| **cross-check** | the Rust function run over all 14 real messages agrees with the measurement row for row |
| **3 · wiring** | **NOT DONE, and deferred as instructed**: A's D068 hand-back is not on disk and `mcp.rs` is clean. Exact spec for the next packet in §4 |
| **the risk** | **refuse the dispatch; DELIVER WITH A WARNING on both return legs.** Refusing a ring would lose the pointer (§3) |

---

## 1 · THE MEASUREMENT — before any gate exists

**Window, read from the ledger rather than typed:** D066 `open` at `1789570900120` → D068 `open` at `1789582826695`
(`C:\Consonance\data\lap.jsonl`), i.e. **15:01:40Z → 18:20:26Z**, chunks 1 and 2 including the stall between them.
Script: `scratchpad/trailer/measure.js`; board deduped on `(pane, text)` as `boundary-check.js` does. Two grades:
**LOOSE** — the last line starts `NEXT:`; **STRICT** — the last line is `NEXT: <station> <command> when <condition>`.

```
$ node scratchpad/trailer/measure.js
window: D066 open 2026-09-16T15:01:40.120Z -> D068 open 2026-09-16T18:20:26.695Z
board rows 39968; deduped in window 184; stamped messages counted 14

                              STRICT   LOOSE    of
  kind  dispatch                5       5      5
  kind  ring lib->chair         0       0      4
  kind  ring pane->lib          1       1      5
  seat  chair                   5       5      5
  seat  librarian               0       0      4
  seat  pane A                  0       0      1
  seat  pane B                  1       1      1
  seat  pane C                  0       0      2
  seat  pane E                  0       0      1
  TOTAL messages                6       6     14
  hand-back FILES added         1       1      4
```

**Against the L062 baseline on L** (`p-text-rules-B_2026-09-16.md` §3, the night before the text landed):

| | L062 (before the text) | D066–D067 (one lap under the text) |
|---|---|---|
| dispatches | 7 / 9 | **5 / 5** |
| rings, pane → librarian | 0 / 9 | **1 / 5** — and the one is mine |
| rings, librarian → chair | 0 / 9 | **0 / 4** |
| hand-back files | 0 / 7 | **1 / 4** — also mine |

**The text moved the dispatch edge and did not move the return legs.** The librarian carried no trailer in any of
its four rings. **n is small** — 14 messages, 4 files — and the rise I would most like to claim (the rings) is one
message, written by the seat that wrote the rule.

### Counting the chair's own, and not sparing them

The five stamped dispatches all pass. **The chair's one failure is not stamped, and that is the finding.** A search
of *every* board row in the window for a `NEXT:` line, stamped or not:

```
16:02:23Z  pane D  role main  UNSTAMPED  last line:
           NEXT: chunk 2 opens — C on P-CARRY-EXCLUDE + PRUNE, B on P-NUL-REPAIRS, plus the carried ui/stick.js
```

- **It is shaped like a trailer and names no station.** `chunk` is not a seat. Nobody is told to act, and there is
  no `when`. It passes a LOOSE check and fails a STRICT one.
- **It is the chair's own turn, not a verb.** It was never a `chair_inject`, `call_chair` or `call_librarian` message.
  **A gate on the three verbs cannot see it, in principle** — the failure was a hand-off that was not made, not a
  hand-off made badly.
- **The measured cost:** the next move in the window is the librarian's *"OPEN CHUNK 2 NOW"* at **17:24:30Z**,
  **1 h 22 min 07 s** after the chair's line (and 1 h 22 min 52 s after D066's `filed` row at 16:01:38Z), then the
  chunk-2 dispatch at 17:25:02Z. The librarian's own commit `f7648ea` owns the stall as *"this seat's missed open"*.
  **Both seats could have moved; the line that should have named one named neither.** That is precisely the part of
  the trailer this check enforces (§2).

**The chair's line is included as a fixture** (`CHAIR_STALL` in `trailer.rs`) so the check is proven against the
real failure, not an invented one.

---

## 2 · THE CHECK — `consonance/src-tauri/src/trailer.rs`

**Why Rust, why standalone.** The gate lives in `mcp.rs`, so the check must be Rust to be wired in without
translation. And because A owns `mcp.rs` this lap and `main.rs` has no owner named, the file uses **only `std`** and
is built and tested alone — `rustc --edition 2021 --test src/trailer.rs` — **with no `mod` line added anywhere.**
A file in `src/` that no `mod` declares is not compiled by Cargo (only `src/bin/` is auto-discovered), so it cannot
affect the app until the wiring packet adds one line.

**The API — four pure functions:**

```rust
pub fn check(text: &str) -> Result<Trailer<'_>, Missing>          // Missing: NoTrailer | NotLastLine | NoStation | NoCommand | NoCondition
pub fn policy(verb: Verb) -> Action                               // Verb: ChairInject | CallChair | CallLibrarian
pub fn refusal_text(verb: Verb, why: Missing, message: &str) -> String
pub fn delivered_with_warning(message: &str, why: Missing) -> String
```

**What `check` enforces**, on the last non-empty line (`str::lines` strips `\r\n`; trailing blank lines are skipped):

1. **The marker is exactly `NEXT:`**, case-sensitive — a sentence beginning "next:" in prose is not a trailer.
2. **A station:** the first word, trailing punctuation stripped, must be a named seat (`chair`, `main`, `librarian`,
   `keeper`, `pane`, a NATO callsign), **a single UPPERCASE pane letter** (optionally with a generation number,
   `A2`), **or a routing verb** (`call_librarian`, `call_chair`, `chair_inject`). A lowercase `a` is an article.
3. **A command** before the clause, and **a whole-word `when`** with a non-empty condition after it. `whenever`
   does not count.
4. A `NEXT:` line that is present **but not last** is its own reason, `NotLastLine` — so the refusal can say *"you
   wrote it, something after it hid it"* instead of *"you wrote nothing"*.

**Two corrections to my own L062 design, both forced by the measurement:**

- **L062 said the gate checks `NEXT:` plus three words and "does not parse `<station> <command> when <condition>`."
  Under that design, the chair's stall line — `NEXT: chunk 2 opens — C on …` — PASSES.** The station check exists
  because the one real failure in the window was exactly a missing station. I had argued against parsing the grammar
  on the grounds that `when done` satisfies it; that is still true of the *condition*, and this check still does not
  judge the condition's quality. But the *station* is not satisfiable by filler — it must be a real seat — and it is
  the part that failed.
- **L062's example in `BUILDING.md` puts the seat first** (`NEXT: librarian call_librarian …`). **All five of the
  chair's compliant dispatches put the verb first** (`NEXT: call_librarian with the pointer when …`). A seat-first
  rule would have refused **5 of 5** compliant dispatches. So a routing verb is accepted as the station, because the
  verb names the station unambiguously. `BUILDING.md`'s example is not wrong — both shapes pass — and I have not
  edited it.

**What it deliberately does not judge:** whether the condition is a good one. `when done` passes. A gate that parses
meaning teaches the words that satisfy the parser.

### Red first, then green

Tests and stubs written first (`check` always `Err(NoTrailer)`, `policy` always `Refuse`, texts empty):

```
$ rustc --edition 2021 --test src/trailer.rs -o scratchpad/trailer/trailer_red.exe && ./trailer_red.exe
test result: FAILED. 3 passed; 18 failed
```

The three green-on-stubs are pinned by mutants below (M1, M9, M14 cases). After the implementation:

```
$ rustc --edition 2021 --test src/trailer.rs -o scratchpad/trailer/trailer_green.exe && ./trailer_green.exe
test result: ok. 21 passed; 0 failed        (no warnings)
```

**The fixtures are the window's real last lines**: the chair's dispatch trailer, my ring, the chair's stall line, and
A's trailer-less ring — plus boundary cases (CRLF and trailing blanks, empty `NEXT:`, no `when`, empty condition,
`librarian when …` with no command, lowercase marker, `C` as a station and `a` as not, `librarian,` with a comma,
`whenever`).

### The function against the whole window

`scratchpad/trailer/driver.rs` includes `trailer.rs` by `#[path]` and runs the **shipped** `check` over every
stamped message plus the chair's turn line:

```
15:01:56 chair         ->  PASS    station=call_librarian
15:02:03 chair         ->  PASS    station=call_librarian
15:18:27 pane A        ->  NoTrailer
15:47:39 pane E        ->  NoTrailer
16:01:07 librarian     ->  NoTrailer
16:02:23 chair(turn)   ->  NoStation
17:24:30 librarian     ->  NoTrailer
17:25:02 chair         ->  PASS    station=call_librarian
17:25:10 chair         ->  PASS    station=call_librarian
17:32:46 pane B        ->  PASS    station=librarian
18:03:09 pane C        ->  NoTrailer
18:15:09 librarian     ->  NoTrailer
18:15:33 chair         ->  PASS    station=call_librarian
18:17:55 pane C        ->  NoTrailer
18:19:06 librarian     ->  NoTrailer
```

**Row for row the same as the JS STRICT grade.** Under §3's policy that window would have produced **0 refusals**
(every dispatch passes) and **8 warned deliveries** on the return legs.

### Mutants on copies

`scratchpad/trailer/mutants.js` — each row applies its anchors to a fresh copy (every anchor must match exactly once or
the row is NOT APPLIED), compiles it standalone, runs it; a copy that fails to compile is reported and never counted.

```
M1  marker accepts lowercase next:               20p/1f  the_marker_is_case_sensitive_so_prose_does_not_count
M2  first line read instead of last               9p/12f  (12 tests)
M3  station never checked                        19p/2f  …lowercase_article_is_not | the_chairs_stall_line_is_refused_because_it_names_no_station
M4  lowercase single letter is a station         20p/1f  a_single_uppercase_pane_letter_is_a_station_but_a_lowercase_article_is_not
M5  verbs are not stations                       20p/1f  the_chairs_dispatch_shape_passes_with_a_verb_as_the_station
M6  whenever counts as when                      20p/1f  when_inside_a_longer_word_is_not_the_clause
M7  empty condition allowed                      20p/1f  an_empty_condition_is_refused
M8  empty command allowed                        20p/1f  a_station_followed_directly_by_when_has_no_command
M9  policy refuses the return leg                20p/1f  the_return_leg_is_never_refused_for_a_missing_trailer
M10 refusal drops the message                    20p/1f  a_refusal_hands_the_whole_message_back_so_nothing_is_lost
M11 warning placed before the pointer            20p/1f  a_warned_hand_back_is_delivered_whole_with_the_rule_named
M12 dispatch refusal cites the hand-back rule    20p/1f  a_refusal_names_the_rule_the_file_and_the_shape
M13 trailing punctuation kept on the station     20p/1f  a_station_may_carry_trailing_punctuation
M14 a buried trailer reads as no trailer         20p/1f  a_trailer_that_is_not_the_last_line_is_refused_and_says_so
CONTROL reword a comment                         21p/0f  SURVIVED
SKIP-CONTROL anchor not present                  NOT APPLIED — an anchor matched 0 times

15 compiled and ran · 14 with at least one red test · tracked trailer.rs unchanged: true
```

**14 of 14 caught; 12 by exactly one test.** M3 is the one that matters most: remove the station check and the only
tests that fail are the two built from the chair's stall line and the lowercase article — **the real failure is what
holds that line of code in place.**

---

## 3 · THE RISK — should a hand-back pointer without a trailer be refused?

**No. Refuse the dispatch; deliver both return legs with a warning.** Encoded as `policy()` and held by M9.

**Why not refuse `call_librarian`, at source.** The pane's out-of-turn arm in `mcp.rs` (`call_librarian`, the
`if !self.auth_station("call_librarian")` block, `mcp.rs:682-688` as of f67b57a):

```rust
mark_owed(&who, now_ms());
return Ok(CallToolResult::success(vec![Content::text(self.out_of_turn_handback_message())]));
```

**`text` — the pointer — is never echoed, stored or returned.** A refusal on this edge today loses the hand-back, not
just its form. A trailer refusal written the same way would convert *"the trailer is missing"* into *"the hand-back
is missing"*. **The librarian can route a pointer with no trailer. Nobody can route a trailer with no pointer.** So a
missing trailer on a ring costs one hop of the receiver's judgement, and a refusal would cost the work.

**And the measurement says where refusals would land.** Under a refuse-all policy that window would have produced
**8 refusals, all 8 on return legs**, and **0 on dispatches**. A gate that refuses where compliance is already 5/5
and blocks where it is 1/9 is aimed at the wrong edge.

**Why refuse `chair_inject`:** the sending seat is the chair, which is composing the text, holds it, reads the
refusal immediately, and is already compliant 5 of 5. A refusal there is cheap and instant — and the refusal text
still hands the whole message back (`refusal_text`, held by M10), so **no refusal from this gate can be the place a
message is lost**, on any verb, if the wiring ever changes the policy.

**`call_chair` is treated as a return leg**, because it is the librarian's return to the chair and has the same
property: blocking it stops the loop's closing hop.

**What "warn" means concretely** (`delivered_with_warning`, held by M11): the message arrives **first and
unchanged**, followed by a bracketed note naming what was missing and the rule and file. The note is addressed to the
**receiver**, who is the one that now has to choose the next station — the sender has already moved on.

    FALSIFIER, registered before the wiring lands: if, three laps after the warning is live, the return legs are
    still below half compliant (the rings, both directions, counted the way §1 counts them), warning is decoration.
    At that point promote the return legs to Refuse — but only after the refusal on that edge returns its payload
    (C's finding fixed), never before.

---

## 4 · THE WIRING — deferred, and specified for the next packet

**State at 12:4x:** `git status` shows `mcp.rs` **clean**; the only seal-gate hand-back is
`handback/p-seal-gate-A_2026-09-16.md` at **08:55** — the L062 design, from before D068 opened at 12:20. **A's D068
build hand-back is not on disk**, so I do not know which lines A is changing. **The wiring is therefore NOT done this
lap**, as the packet allows. What the next packet needs:

1. **`consonance/src-tauri/src/main.rs`**: `mod trailer;` beside `mod mcp;` (currently `:20`). One line.
2. **`chair_inject`** — after every existing gate (token, station, debt, and **A's seal gate**), immediately before
   delivery: `if let Err(m) = trailer::check(&text) { <audit to the board as the other refusals are>; return refusal_text(Verb::ChairInject, m, &text) }`.
   **Order matters:** the trailer check goes **last**, so a message refused for being out of turn or unsealed is
   refused for that, and a trailer refusal only ever fires on a dispatch that would otherwise have been delivered.
   **Whether the seal gate precedes the trailer gate is A's and the chair's to confirm** once A's lines are known.
3. **`call_librarian`** — **after** the out-of-turn arm (so `mark_owed` behaviour is untouched), before `send_chair`:
   `let text = match trailer::check(&text) { Ok(_) => text, Err(m) => delivered_with_warning(&text, m) };`
4. **`call_chair`** — the same, before its send.
5. **Tests to carry in `mcp.rs`'s own suite**: each verb's wiring pinned by the arm it sits in (not by the token
   `trailer::check` appearing somewhere — A's harness lesson), plus the ordering in (2).

---

## 5 · WHAT THIS GATE CANNOT SEE — said plainly so nobody believes it fixes the stall

**The one expensive failure in the window was not a message.** It was the chair ending a turn with a line shaped
like a trailer and no verb call at all. **A gate on the three verbs sees only messages that are sent.** It cannot see
a hand-off that was never attempted, and a room that ships this gate should not read the next stall's absence from
the refusal log as evidence of anything.

What *would* see it is a check on the **chair's turn end** — a line beginning `NEXT:` whose station is not a seat,
at the moment a turn stops. That is a different mechanism (a Stop-hook shape, not an MCP verb), it is not this
packet, and I name it only so the gap is on record.

---

## 6 · WHAT I DID NOT VERIFY

1. **Nothing is wired and nothing ran through `mcp.rs`.** The policy and the texts are proven only in the standalone
   test binary.
2. **The function was not compiled inside the crate.** Standalone `rustc` with `edition 2021` and no crate lints; the
   crate may enable lints (e.g. `deny(warnings)`) that this build does not.
3. **The station list is mine**, not derived from the address table. A seat name outside it (a future pane callsign
   past `mike`, or a name like `third-place`) would read as `NoStation`. The wiring packet should consider passing the
   address table's seats in instead of a constant.
4. **The board audit path for a trailer refusal** is described, not read — I did not open the helper the existing
   refusals use.
5. **Hand-back FILES are graded by their last line**, and the rule's text is about the ring and the dispatch. Whether
   a hand-back *file* owes a trailer is an interpretation I carried from L062, not something `BUILDING.md` settles.
6. **The measurement is one machine (D), one window, 14 messages.**
7. **An unexplained observation, from the chunk-2 NUL finding:** this lap I confirmed directly that the file-writing
   tool decodes the single-backslash unicode NUL escape into the byte — **3 of 3 probes, in `.md` and `.js`** (in
   chunk 2 that case had been inferred, not tested). But `scratchpad/trailer/measure.js`, which I wrote with that
   spelling, counted **0 NUL bytes** before I rewrote the line — and I rewrote it before inspecting it, so I cannot say
   what was on disk. **The finding stands on the three direct probes; that one exception is unexplained.**

---

## 7 · WRONG (mine)

- **W1. My L062 gate would have passed the one real failure it was built for.** "`NEXT:` plus three words, no grammar
  parse" admits `NEXT: chunk 2 opens — C on …`. The design argued from a hypothetical (`when done`) and never ran
  itself against a stall. **Class: designing a check against the failure I imagined instead of measuring the one that
  happened** — and the measurement packet existed precisely to prevent that.
- **W2. Two of my tests were vacuous before the implementation existed.** The first version of
  `a_refusal_names_which_part_is_missing` asserted `"when <condition>"` and `"station"` — both of which the shared shape
  line carries for **every** reason, so the test would have passed on any refusal. Caught while planning the
  implementation, rewritten so each reason's phrase must appear in its own refusal **and in no other**. **Class: an
  assertion satisfied by boilerplate** — the same class as a pin that reads for a token.
- **W3. I nearly wrote a seat-first station rule from my own `BUILDING.md` example**, which would have refused all five
  of the chair's compliant dispatches. The driver run over real messages is what showed every chair trailer is
  verb-first. **Class: trusting the rule text over the traffic it governs.**

---

## 8 · THE ONE LINE

**One lap under the text moved the dispatches to 5 of 5 and left the return legs at 1 of 9; the check now refuses a
trailer that names no seat — the exact shape of this morning's stall — but it must warn rather than refuse on the
rings, because refusing a hand-back today loses the pointer, and no verb gate will ever see a hand-off that was never
sent.**

NEXT: librarian re-derive §1's table with scratchpad/trailer/measure.js and trailer.rs 21/0 when you collate chunk 3, then the chair opens the wiring packet once A's mcp.rs lines are on disk.
