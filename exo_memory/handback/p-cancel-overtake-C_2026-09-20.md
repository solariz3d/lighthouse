# P-CANCEL-OVERTAKE — C (CHARLIE), L065 D1, on L — a cancellation cannot overtake the message it cancels

**Packet:** the end of `exo_memory/loop/plan_sequence_2026-09-20.md` (`4189518`), D1, read at source.
**Owned this lap:** `consonance/src-tauri/src/main.rs` and its tests. **Nothing committed.**

---

## 1 · REGISTERED BEFORE ANYTHING WAS BUILT

Written into this file before the first line of code, per tonight's discipline.

### 1.1 · The prediction

A dispatch that has been withdrawn **never renders into the pane**, and **two board rows exist** saying so — one
at the moment of withdrawal, one at the moment the drain steps over it.

### 1.2 · The null, registered beside it

If the mechanism does nothing, the withdrawn dispatch renders exactly as it does today. **A test that only
asserts "it did not arrive" cannot tell a working withdrawal from a message that was never going to arrive in
that test anyway** — an empty queue, a pane that never drains, a fixture that delivers nothing. So the null is
not left implicit:

> **Every absence assertion in this lap is paired with a positive control on the SAME object.** The same inbox,
> the same pane, the same message: once WITHOUT the withdrawal (it must deliver) and once WITH it (it must not).

### 1.3 · The quantity can take more than one value on this object — checked, not assumed

The quantity is *"does this queued message reach `inject_to_pane`"*. On the object under test — one `Inbox` with
one queued message for one pane — it is observed **true** (no withdrawal, gate ready → `take_ready` returns the
message) and **false** (withdrawn → `take_ready` returns `None`). Both values, same object, same test. If the
first half ever stops being true the test is measuring nothing and says so.

### 1.4 · The falsifier

**If a message that was never withdrawn can fail to arrive because of anything added this lap, the change is
wrong and must come out** — that is constraint 2 and it outranks the fix. Pinned by
`take_withdrawn_pops_only_a_withdrawn_head` and by the positive control above.

### 1.5 · What would make me report "both constraints cannot be met this way"

If the trace required removing the entry from the queue before it could be reported, or if the only way to stop
a withdrawn message was a rule that could also stop an un-withdrawn one. Neither turned out to be the case; the
answer is recorded here in advance so it is not a conclusion reached after the fact.

---

## 2 · THE ANSWER — a withdrawn packet cannot arrive, and it leaves two rows

Not "the trace requirement and the drop-safety requirement cannot both be met". They can, and the reason they can
is that **withdrawal and removal were separated**: a withdrawn message is *marked*, stays in the queue, and is
removed only when the drain steps over it and writes the row. Nothing is ever deleted at the moment of
cancellation, so there is no window in which a packet has vanished and nothing has said so.

### 2.1 · Why this shape and not a verb

The packet offered three shapes. **A withdraw verb lives in `mcp.rs`, which is A's this lap**, so a verb built
here would have had no caller — an inert mechanism, which is the exact failure I reported against the librarian's
own notes window eight hours ago. All five delivery sites (`chair_inject_exec`, `librarian_call_exec`, the
`call_librarian` actuator, `deliver_pull`) are in **main.rs** and `mcp.rs` only calls them, so the *chair-side
mark read at drain time* is the shape that is both mine to build and actually reachable today.

### 2.2 · The directive

```
[[withdraw-queued N]]
<the cancellation's own text>
```

**The whole first line, exact shape, count required.** Parsed by `withdraw_directive`, which strips the line so
the pane never sees it.

**Why the whole line and not a substring:** a marker matched anywhere is a marker any body can fire by *quoting*
it. That is not hypothetical — it is the trap that took `the_shelf_excludes_bulk_run_artifacts_and_says_so` red
in this same file four hours ago, when a note quoted the string it was asserting about. **This is the queue every
dispatch uses**, so the marker has to be unfireable by discussion of itself. Pinned by
`the_withdraw_directive_is_the_whole_first_line_and_nothing_else`, which asserts the quoted-on-a-later-line case
withdraws nothing.

**Why the count is required — the fail-closed half.** `withdrawal_is_authorised(named, depth)` is pure and is
`named > 0 && named == depth`. A mismatch in *either* direction withdraws **nothing**: fewer means the queue grew
since the chair read it, more means it drained, and in both cases the chair is cancelling something other than
what it believes it is cancelling. A directive written by mistake deletes nothing.

### 2.3 · The two rows

| when | row |
|---|---|
| at the withdrawal | `WITHDRAWN -> C (had waited 123s, never rendered): <the packet's own preview>` — **one per message**, naming it |
| at the drain | `WITHDRAWN NOT DELIVERED -> C (queued 242s ago, cancelled before this pane was ready for it): <preview>` |
| on a refusal | `WITHDRAW REFUSED -> C: the directive named 2 queued message(s) and 3 are waiting. NOTHING was withdrawn; this message is delivered as an ordinary one.` |

Two rows and not one because they answer different questions: the first says the chair withdrew it, the second
**proves it never rendered**. One row per message rather than a count, because "2 withdrawn" tells a reader a
number and the preview tells them *which lap* was cancelled, which is the fact the record needs a week later.

### 2.4 · The drain sweep

`drain_inboxes` clears withdrawn heads **before** it reads the gate, in a `while` loop:

- **Before the gate**, because nothing here is written to the pane. The gate exists to stop a *write* landing
  mid-turn; stepping over a message that will never be written cannot splice anything. This is also what lets the
  cancellation arrive at the next ready moment instead of queueing behind the packet it cancels — which is the
  whole defect.
- **`while`, not `if`**, or a second withdrawn packet still sits in front of the cancellation on the next tick.
- **`take_ready_read` also refuses a withdrawn head**, which is unreachable in the shipped path and deliberately
  kept: it makes *"a withdrawn message cannot be delivered"* a property of the **inbox** rather than of one
  caller remembering to sweep first. The drain has never been the only caller.

## 3 · THE TWO NON-NEGOTIABLE CONSTRAINTS, each answered

**1 — a withdrawn message must leave a trace.** Three rows exist (§2.3), the entry is never removed at
withdrawal time, and `withdrawing_never_removes_the_entry_so_it_can_still_be_reported` fails if it is. The
drain's row names the packet and how long it had waited, so `WITHDRAWN NOT DELIVERED` is a complete record of an
attempt that was kept and then stopped.

**2 — nothing may drop a message that was never withdrawn.** This is the falsifier and it outranks the fix:

- `take_withdrawn` returns `None` on an un-withdrawn head and leaves the queue untouched —
  `take_withdrawn_pops_only_a_withdrawn_head`, which then asserts the same message still delivers normally.
- the withdrawal is scoped to the pane the directive names —
  `withdrawing_one_pane_leaves_every_other_pane_untouched`.
- the count must match the depth exactly — `a_withdrawal_is_authorised_only_when_its_count_matches_the_depth_exactly`.
- FIFO survives — `stepping_over_a_withdrawn_head_does_not_reorder_what_is_behind_it`.
- and the **positive control** (§1.3) is in the same test as the null, so an absence can never pass by accident.

## 4 · TESTS — eleven, red first

The first compile after writing them failed with exactly three missing pieces — `withdraw_directive`,
`Inbox::withdraw_all`, `Inbox::take_withdrawn` — which is the red I wanted.

| test | what it would catch |
|---|---|
| `the_withdraw_directive_is_the_whole_first_line_and_nothing_else` | a marker fired by a body that merely quotes it |
| `a_withdrawal_is_authorised_only_when_its_count_matches_the_depth_exactly` | the fail-closed rule, all seven cases |
| `a_withdrawn_message_does_not_reach_the_pane_and_an_unwithdrawn_one_does` | **the pair** — null and positive control on one object |
| `withdrawing_never_removes_the_entry_so_it_can_still_be_reported` | a silent vaporisation (constraint 1) |
| `take_withdrawn_pops_only_a_withdrawn_head` | **the falsifier** (constraint 2) |
| `stepping_over_a_withdrawn_head_does_not_reorder_what_is_behind_it` | FIFO traded away |
| `withdrawing_one_pane_leaves_every_other_pane_untouched` | a withdrawal that leaks across a fan-out |
| `withdrawing_twice_reports_the_second_time_as_nothing_new` | a doubled count in the row |
| `drain_inboxes_steps_over_withdrawn_heads_before_it_delivers_and_says_so` | the sweep after the take; a missing row; `if` instead of `while` |
| `the_chair_says_what_it_withdrew_and_says_when_it_withdrew_nothing` | a silent refusal; a refusal that also swallows its own message |

## 5 · MUTANTS — 8 listed · 8 killed · 0 survived · 0 no result · 0 not applied

`node consonance/tools/mutant-harness.js <scratch>/intake/rows-cancel.js`, pre-flight green 33/0, live file hash
unchanged. **On the new behaviour, not its arithmetic** — every one is a policy change, not an off-by-one.

| # | mutant | caught by |
|---|---|---|
| 1 | the directive matches **anywhere**, so a message quoting it withdraws the queue | the first-line test |
| 2 | the count stops having to match the depth | the authorisation matrix |
| 3 | a zero directive becomes a **wildcard** | the authorisation matrix |
| 4 | `take_withdrawn` pops **any** head — the falsifier | 3 tests |
| 5 | the inbox-level guard is removed | the pair test |
| 6 | `withdraw_all` re-reports already-withdrawn messages | the twice test |
| 7 | **withdrawal leaks across panes** | the cross-pane test |
| 8 | the drain clears one withdrawn head per tick | the source-order test |

Two rows were refused by the harness's anchor gate before the run (`2 MATCHES`) and lengthened: `#7` collided
with `note_reading`, and **`#8` collided with my own source-level test, which asserts that exact string**. The
gate caught both; I did not.

## 6 · A SECOND FINDING, NOT MINE AND NOT IN SCOPE: two committed fixtures are corrupt

While proving the five `mcp::tests` failures were not mine, I built a detached worktree at HEAD with only my
`main.rs` copied in. It came back **818 passed, 1 failed**, and the failure was not mine either:

```
ready_signal_tests::a_slash_command_in_the_composer_reads_empty_and_this_is_the_defect  FAILED
```

The same test passes in the main working tree. The cause:

| fixture | committed blob | main working tree | `git status` |
|---|---:|---:|---|
| `composer_slash_command_reads_empty_2026-09-09.bin` | **236,387** | **236,544** | **clean** |
| `composer_empty_reads_busy_2026-09-09.bin` | **524,204** | **524,288** | **clean** |

```
git cat-file -s $(git rev-parse HEAD:<path>)   vs   stat -c%s <path>
```

**The corruption is in the commit, not in the checkout.** `.gitattributes` already records it — the D055 note of
2026-09-09 names both files and both numbers and adds `*.bin binary` so it cannot happen again — but **the
already-corrupted blobs were never re-committed.** So any fresh checkout (a worktree, a clone, the desktop, CI)
gets the short bytes and that test fails there, while the one machine holding a repaired working copy reports
green and `git status` reports clean.

**This explains a red I recorded and could not explain.** L058, on D: *"cargo on D is 608/1/4 (the D-only
composer-fixture red)"*. It was never D-only in any interesting sense — D had the committed bytes and L has an
uncommitted repair.

**And it has a consequence for tooling the room relies on:** `mutant-harness.js` scores every mutant in a
detached worktree of HEAD, so it inherits the corrupt fixtures. Any lap scoring mutants against a test that reads
one would see a pre-flight failure it did not cause. My rows this lap and in L062 filter to modules that read no
fixture, so nothing scored here is affected — that is luck, not design.

**Not fixed: it is outside this packet** (the fix is re-committing two binary files, which is a commit, and I do
not commit), and it is a 30-second repair for whoever owns it.

## 7 · THE SUITE

```
cargo test --bin consonance                      -> 826 passed; 0 failed; 4 ignored   (5.32s)
cargo test --bin consonance -- --test-threads=1  -> 826 passed; 0 failed; 4 ignored   (38.44s)
```

**Green plain, parallel and serial**, in the main tree with A's `mcp.rs` work landed. Eleven tests added; the
suite was 813 at the start of this lap.

*Mid-lap, five `mcp::tests` were red on my tree. They were A's — `mcp.rs` was dirty with 135 insertions and the
failures were A's own new tests calling an `owed_refusal_text` signature A had not finished. I proved that with
the isolation worktree in §6 rather than asserting it, and I did not touch A's file.*

## 8 · WHAT WAS NOT VERIFIED

1. **Nothing was run inside the app.** No rebuild, no relaunch. The withdrawal path has never executed against a
   real pane — every assertion here is `cargo test` against the pure functions and the `Inbox`.
2. **The chair has never issued the directive.** It is reachable today through `chair_inject` with no change to
   `mcp.rs`, but nothing has sent one, so the end-to-end path (chair types it → rows appear → the packet never
   renders) is **designed and unit-tested, not observed.** That is the one thing I would want seen before this is
   trusted in anger, and it is a single dispatch to a busy pane.
3. **`chair_inject_exec` itself is only source-tested.** It takes an `AppHandle`, so the ordering and row facts
   are asserted by scraping its body (`the_chair_says_what_it_withdrew...`), the way this file already tests
   `drain_inboxes`. The *decisions* it makes are pure and unit-tested; the *wiring* is string-matched.
4. **Only `chair_inject_exec` honours the directive.** The other four delivery sites queue normally and have no
   withdrawal path. That is deliberate — the measured defect is the chair's — but a librarian ring cannot be
   withdrawn, and nothing in the code says so out loud.
5. **The count is read at the moment the directive is processed**, and the queue can move between the chair
   reading its depth and the directive arriving. That is what the fail-closed rule is for: the race resolves to
   *withdraw nothing, write a row*, never to *withdraw the wrong thing*. Unmeasured under real timing.
6. **The two corrupt fixtures (§6) are not repaired**, and I did not check whether any other tracked binary
   predates the `*.bin binary` rule.

## 9 · FOR THE CHAIR

1. **The directive's shape is mine and is a guess about ergonomics.** `[[withdraw-queued N]]` requires the chair
   to read the depth off its own `QUEUED` row before cancelling. That is deliberate friction — it is what makes
   the count meaningful — but if it proves annoying in practice the alternative is a verb in `mcp.rs`, which is a
   different lane's change and would not need the count at all.
2. **Should a withdrawal be able to name a specific packet rather than the whole queue?** Today it withdraws
   *everything* waiting for that pane, which matched the measured case exactly (one packet, one cancellation) and
   is the smallest thing that works. Naming one of several would need a handle the chair can see, which is a
   bigger change and was not asked for.
3. **§6 is not mine to fix** and is a two-file commit.
