# P-INTAKE-WINDOW — C (CHARLIE), L062, on L — the index tier gets a byte budget

**Packet:** the end of `exo_memory/loop/plan_sequence_2026-09-20.md` (`0e8c849`), read at source.
**Owned this lap:** `consonance/src-tauri/src/main.rs` and its tests. **Nothing committed.**

---

## 1 · THE RESULT

The seat opens. `shelf_tests::the_librarian_intake_fits_under_the_limit_it_must_obey` is GREEN with both margins
printed, and the floor margin — the one this change governs — is **16.6% of the cap**, above the 15% bar.

```
cargo test --bin consonance shelf_tests::the_librarian_intake_fits_under_the_limit_it_must_obey -- --nocapture
```

| | before (HEAD) | after |
|---|---:|---:|
| intake | **154,089 B** (RED, "the seat cannot open") | **141,729 B** |
| floor = head + index | 154,089 = **102.7%** of cap | 125,136 = **83.4%** of cap |
| **floor margin** | **0** (saturated; the floor was over the cap) | **24,864 B = 16.6%** |
| bodies | **0 B** | **16,593 B** |
| index tier delivered | 449 entries | 221 entries |
| shelf at budget 0 | 69,165 B | 40,212 B |

The head is unchanged at 84,924 B and the limit is unchanged at 150,000. Nothing was raised.

---

## 2 · TWO THINGS IN THE PACKET THAT DID NOT SURVIVE CONTACT, both found before any code was written

### 2.1 · `newest_first` is a PATH sort. For `loop/` it was not newest-first at all.

The packet: *"loop is ALREADY `newest_first: true`. So the ordering the window needs exists."* It does not. The walk
is `files.sort(); if newest_first { files.reverse(); }` (`main.rs`, the tier loop) — a **reverse lexicographic sort
of full paths**. That IS newest-first for `journal/` and `librarian/`, whose filenames *are* dates. For `loop/`,
whose filenames are topics, it is alphabetical-descending and means nothing chronologically.

Measured from the shelf's own function before the change:

```
first indexed loop line : - loop/wire_run_2026-08-15.md   ('w' sorts high)
last  indexed loop line : - loop/2026-08-18/README.md
```

So a budget spent "newest-first" on the existing flag would have kept `wire_run_2026-08-15.md` and dropped
`plan_sequence_2026-09-20.md`. **Acceptance item 3 could not have passed on the existing ordering** — it is the
test that catches exactly this. The window therefore orders by a date parsed from the label (`label_date`), and
the old flag is left alone for the tiers where it is correct.

*This is L053's lesson again in a new place: a frame named in a brief is not a frame on disk.*

### 2.2 · The INTAKE margin cannot be 15%. Only the FLOOR margin can.

Acceptance item 1 as literally worded — *"the test's printed margin at or above 15% of the cap"* — is unreachable
by any value of the new constant, and the reason is in `librarian_shelf_room`:

```
room for bodies = LIBRARIAN_INTAKE_LIMIT - INTAKE_HEADROOM - (head + floor)
```

**Every byte the index window frees is handed straight back to the bodies.** The finished artifact converges on
`cap - INTAKE_HEADROOM` whatever the index budget is. Measured on this lap, and it is the cleanest demonstration
available: the floor fell **69,165 → 40,212** (−28,953) and the intake fell only **154,089 → 141,729** (−12,360),
because bodies went **0 → 16,593**. `INTAKE_HEADROOM` is 8,000 — **5.3%** of the cap — and that is where the
intake margin sits (8,271 measured, the extra 271 being index lines removed when a file is carried instead).

So the bar is asserted where it is reachable and where the breach actually was:

```rust
assert!(floor_margin * 100 >= LIBRARIAN_INTAKE_LIMIT * 15, ...)
```

**Both margins are printed on every run** with a comment naming which is which, so the distinction cannot be lost
again. The packet's own framing supports this reading — it opens with *"the floor alone is head 84,924 plus index
69,163, so the bodies get ZERO bytes"*. The floor is the thing that was broken.

**The question this leaves for the chair, and it is a real fork, not a formality:** if the *intake* margin is also
wanted at 15%, the lever is a librarian-specific headroom inside `librarian_shelf_room` — and it buys that margin
**out of the bodies**, which would take them from 16,593 back down to ~2,000 and re-starve the shelf the window
just fed. I did not make that change: it is a different decision with a different cost and it was not in the
packet. **Conservative default taken: leave `INTAKE_HEADROOM` untouched** — it is shared with the Third Place
shelf, and editing it would move a seat this packet does not own.

---

## 3 · THE COUNT, RE-DERIVED FROM THE SHELF'S OWN FUNCTION

The packet asked for this rather than inheriting either figure. Taken from `corpus_shelf_at_with_index(0, MAX)`,
i.e. the walk itself, not a replication of it:

| tier | entries | index bytes |
|---|---:|---:|
| `map/` | 17 | 1,275 |
| `journal/` | 34 | 3,028 |
| `loop/` | **398** | **55,081** |
| **index tier total** | **449** | **58,497** |

**Neither prior figure was right, and the chair's is the closer one.** The librarian's packet said `loop/` is 416.
The chair counted 411 top-level entries (381 `.md`) and 1,347 tracked files recursively. The shelf sees **398**:
381 at depth 1, 14 at depth 2, 3 at depth 3 — and the chair's 381 top-level `.md` reconciles exactly
(381 + 17 nested = 398). The shelf **does** index recursively, so the chair's instinct was right that a top-level
count understates it; but it also excludes `loop/run1/items/` and `loop/run2/cells/` by name, which is where the
1,347 goes. Both corrections point the same way and land on 398.

Split by whether the window can order them at all:

| | entries | bytes |
|---|---:|---:|
| dated (a `20xx-xx-xx` in the label) | 358 | 47,944 |
| **undated** | **91** | **10,553** |

The 91 undated are every `map/*.md` (the seat letters) and 82 working documents under `loop/` — `PROTOCOL.md`,
`ESCALATIONS.md`, the registrations and drafts. **A date window cannot order what has no date**, so they are
spent last and reported by their own count in the collapse line rather than being given a fake date.

---

## 4 · THE DESIGN AS BUILT

**`LIBRARIAN_INDEX_BUDGET = 30_000`**, beside `LIBRARIAN_INTAKE_LIMIT`, with the arithmetic in its comment.

Where the value comes from — the binding constraint is the floor, and it is solved, not guessed:

```
floor = head 84,924 + carried-tier index 8,506 + shelf prose ~1,275 + collapse line ~320 + BUDGET
floor <= 127,500 (85% of cap)  =>  BUDGET <= 32,475
```

30,000 leaves ~2,400 bytes of slack against a head that also grows. Delivered floor: **125,136**, margin 16.6%.

**Spend order** (one pass, after the walk, before the header is written):

1. **group 0 — `map/` and `journal/`**, in walk order. The packet puts them out of scope; they are 4,303 bytes of
   a 30,000 budget and in practice always ride. **They are still inside the budget**, so the tier as a whole stays
   bounded if either ever grows — which is the self-limiting property the packet asked for.
   *Why they cannot simply sort by date with the rest:* `journal/`'s newest file is **2026-09-06**, older than
   ~170 `loop/` files. A flat date order drops **the entire journal index** before it drops one recent lap note.
   That is a bigger change than the breach being fixed, and it is why group 0 exists.
2. **group 1 — dated `loop/` entries, newest first** by `label_date` (the LAST date in the label, so an amended
   file orders by its amendment and `loop/2026-08-18/README.md` orders by its directory).
3. **group 2 — undated `loop/` entries**, by path.

**Spent as a PREFIX, not first-fit**, and that is load-bearing: a first-fit window rides a small old entry because
it happened to fit after a large newer one was refused, and then *"dated X .. Y"* describes a set with holes in
it. The body budget above it stays first-fit, because a body that fits is worth carrying whatever its neighbours
did; **an index that claims a range has to actually be one.** Pinned by
`the_index_window_is_a_prefix_so_its_date_range_is_not_a_lie`.

**What it delivered tonight**, from the finished artifact:

```
SHELF | 303 indexed by path.
SHELF | 228 index-tier entries (29463 bytes) dropped by the index window:
SHELF | THE INDEX IS WINDOWED -- 228 older index-tier entries (29463 bytes) are NOT listed above.
SHELF | Dated 2026-08-11 .. 2026-09-04, plus 82 undated.
```

---

## 5 · THE FOURTH REASON A PATH IS ABSENT

`corpus_shelf_at` already reported three — tier, budget, excluded-by-name. The window is the fourth and it has its
own counter, **reported from the delivered drop**:

```
{n} index-tier entr{y|ies} ({bytes} bytes) dropped by the index window:
the index tier has a byte budget of its own and this is what did not fit. The
line under the index names the range and the command that lists them.
```

The 2026-09-01 bug in this same function (`9c6a131`) branched on what the rule WOULD carry rather than on what the
budget DELIVERED, and printed a window that had not happened. Guarded two ways here: the counter increments only
in the branch that actually drops an entry, and
`a_generous_index_budget_drops_nothing_and_says_nothing` fails if the report fires when the window did not.
Mutant #4 puts that exact bug back and is scored below.

**The collapse line's three parts get three assertions** (E's L061 rule — a refusal's halves need their own
assertions): the **count**, the **date range**, and the **`ls` that recovers them**, plus the undated count as a
fourth. It is also asserted in the *finished shelf* and not only against its own pure function, because a refusal
formatted perfectly and never reached is the 09-01 failure with the branches swapped.

---

## 6 · TESTS — red first, and what each one exists to catch

Nine added, all written before the implementation and all red for the right reason (five missing functions on the
first compile: `label_date`, `index_window_line`, `newest_dated_index_label`, `corpus_shelf_at_with_index`,
`index_tier_entry_count`).

| test | catches |
|---|---|
| `the_index_orders_by_the_last_date_in_the_label_and_tolerates_none` | first-date-wins; a version string read as a date; a missing date treated as an error |
| `the_collapsed_index_line_names_count_range_and_the_command_that_recovers_them` | **four separate assertions** — count, date range, `ls`, undated count |
| `the_collapsed_index_line_is_silent_when_the_budget_dropped_nothing` | a refusal line that fires when the window did not |
| `the_index_window_is_newest_first_by_date_not_by_path` | §2.1 — the packet's own premise |
| `the_index_window_is_a_prefix_so_its_date_range_is_not_a_lie` | first-fit holes making the printed range false |
| `the_window_never_drops_map_or_journal_which_are_out_of_scope` | the packet's scope boundary, as a test rather than as an intention |
| `the_header_counts_the_index_window_drop_from_what_was_delivered` | the 2026-09-01 shape; plus the byte half and the collapse line's presence in the finished shelf |
| `a_generous_index_budget_drops_nothing_and_says_nothing` | the same bug from the other side |
| `undated_loop_entries_are_spent_last_and_never_outrank_a_dated_one` | 82 undated working documents outranking the whole dated record |

Plus the floor-margin assertion added to `the_librarian_intake_fits_under_the_limit_it_must_obey`.

## 7 · THE SUITE, PLAIN AND SERIAL — not only under my own filter

The packet asked for this because tonight's L061 defect was invisible under the author's own flags.

```
cargo test --bin consonance                      -> 808 passed; 0 failed; 4 ignored   (6.02s)
cargo test --bin consonance -- --test-threads=1  -> 808 passed; 0 failed; 4 ignored   (44.29s)
cargo test --bin consonance shelf_tests::        ->  27 passed; 0 failed
```

Before the lap the same suite was **803 total with 1 failing** — the intake test. It is 812 now; the nine new
tests are the difference. **Both orderings green**, which matters here because every shelf test takes the same
`DIRS_SERIAL` lock and a window that depended on walk order would be exactly the thing a parallel-only run hides.

## 8 · THREE THINGS FOUND WHILE IN HERE, none of them fixed, none in scope

1. **An instrument in the limit test has gone inert, and it reports a number rather than going quiet.** The test
   prints `LIBRARIAN INDEX run artifacts 0 file(s), 0 bytes of the floor`. Its own comment says it *"has been
   printing 246 file(s), 15753 bytes on every run since 2026-09-01"*. It counts index lines starting with
   `- loop/run1/items/` — and those paths are excluded **before** they can reach the index, so the set it measures
   is empty by construction. The exclusion landed after the comment was written and silently emptied it.
   **Same class as my L061 P-BLIND-ROWS finding: a guard with no input is indistinguishable from a guard working
   perfectly.** It now prints a confident zero every run.
2. **The librarian's own-notes window is still inert, and this change did not fix it.** The shelf says
   `YOUR OWN NOTES ARE WINDOWED and THE BUDGET CARRIED NONE OF THEM ... (227 bytes were left when your tier was
   reached)`. ALPHA's P-WINDOW-INERT finding stands: `librarian/` is fifth of ten tiers and the four above it
   spend the budget to saturation. The index window moved that leftover from **0 to 227 bytes** — measurable
   progress and nowhere near a dated note.
3. **Six bodies.** `6 file(s) carried in full (16,637 of 16,864 bytes)`. It was zero at HEAD, so this is the
   change working; it is also the whole library the seat gets, and the tier order below `cards` has never been
   reviewed (the existing comment says so).

## 9 · WHAT WAS NOT VERIFIED

1. **Nothing was run inside the app.** No rebuild, no relaunch, no seat actually opened on this shelf. Everything
   here is `cargo test` against the real corpus on disk.
2. **The 15% bar is asserted on the FLOOR margin, not the intake margin** — §2.2, with the arithmetic. If the
   packet meant the intake margin literally, this lap does not meet it and cannot without a second change I did
   not make.
3. **Machine L's corpus only.** D's `exo_memory/` differs and the constant is global. The *index* is now bounded
   by construction on any machine; the **head is not** — 84,924 bytes tonight, unbounded, and 42,576 bytes of
   head growth would breach the cap again with the index window working perfectly. Nothing in this lap watches
   the head.
4. **`label_date` only reads `20xx-xx-xx`.** A file dated any other way is undated as far as the window is
   concerned, and undated entries are spent last. Tonight that is 82 `loop/` files and all 82 were dropped.
5. **The mutants were scored against the shelf tests only** (`shelf_tests::`), not the full suite, to keep ten
   rebuilds finite. A mutant that breaks something outside that module would not have been seen.
6. **I did not re-derive the head's 84,924 bytes independently** — it comes from `librarian_intake_head()` via
   the same test that prints everything else.

## 10 · QUESTIONS FOR THE CHAIR, with the conservative default already taken

1. **The intake margin (§2.2).** Left at 8,271 / 5.5%. Raising it to 15% costs ~14,500 bytes of bodies, taking
   them from 16,593 to ~2,000. My recommendation is to leave it: the floor was the breach, the floor is fixed and
   bounded, and starving the bodies re-creates the problem the tiering exists to solve. Not mine to rule.
2. **The 82 undated `loop/` working documents** — `PROTOCOL.md`, `ESCALATIONS.md`, the registrations — are all
   dropped tonight, recoverable by the printed `ls`. If any of them is a standing instrument the seat is expected
   to hold, the fix is a named group 0 prefix for it, the same way `map/` and `journal/` are protected. I did not
   pick favourites among them: that is a judgement about what the seat needs, and the seat is the subject here.
3. **`LIBRARIAN_INDEX_BUDGET = 30_000` is my number**, chosen against the 15% floor bar with ~2,400 bytes of
   slack. The packet was explicit that the value is the pane's and the reason is a conflict of interest; it is
   recorded here so the next reader can disagree with a number rather than with a vibe.

---

## 11 · MUTANTS — 10 listed · 10 killed · 0 survived · 0 no result · 0 not applied

`node consonance/tools/mutant-harness.js <scratch>/intake/rows-intake.js`, scored by `cargo test --bin consonance
shelf_tests::` in a detached HEAD worktree with the live file copied in. Pre-flight on the unmutated copy green
27/0. `live consonance/src-tauri/src/main.rs unchanged: true` on every run. Aimed at the window and the header
counter as the packet asked, not only at the arithmetic — seven of the ten change behaviour, not numbers.

| # | mutant | caught by |
|---|---|---|
| 1 | the window becomes **first-fit** | `..._is_a_prefix_so_its_date_range_is_not_a_lie` |
| 2 | the window runs **oldest-first** | `..._is_newest_first_by_date_not_by_path` (+2 more) |
| 3 | `map/`/`journal/` lose their protected group | `..._never_drops_map_or_journal...` (+2 more) |
| 4 | **the header branches on the RULE, not the delivered drop** — 9c6a131 put back | `a_generous_index_budget_drops_nothing_and_says_nothing` |
| 5 | the byte counter goes silent | `..._counts_the_index_window_drop_from_what_was_delivered` |
| 6 | `label_date` takes the FIRST date | `..._orders_by_the_last_date_in_the_label...` |
| 7 | the budget is raised past the corpus | `the_librarian_intake_fits_under_the_limit_it_must_obey` |
| 8 | the collapse line is never reached | `..._counts_the_index_window_drop_from_what_was_delivered` |
| 9 | the recovery command is dropped from the collapse line | `..._names_count_range_and_the_command...` (+1) |
| 10 | undated entries are promoted to the protected group | `undated_loop_entries_are_spent_last...` |

### 11.1 · Run 1 was 8/10, and BOTH survivors were holes in my tests rather than equivalent mutants

**#1 — the prefix property was not tested, only asserted.** My first version checked it at a flat 20,000-byte
budget, and at that budget the leftover after the first refusal is smaller than any remaining index line — so
first-fit and prefix deliver **the same set** and the mutant that removes the prefix passed. The test now derives
its budget from the corpus: the first entry followed by a strictly shorter one, minus a byte, so the refusal
leaves room a later entry would take under first-fit. It then compares the delivered list against the
newest-first prefix that fits, element by element.

**This is the vacuous-test trap again** — D067's, then R1's mutant #8, now this. The pattern each time is a test
that passes for a reason other than the property it names. The difference here is that the mutant found it rather
than a reader, which is what the mutants are for.

**#10 — undated-last was a policy I implemented and never pinned.** Promoting undated entries to the protected
group is not equivalent: it changes which entries ride (82 working documents in front of every dated lap note)
while every existing test still passes. Now pinned.

Both re-scored individually after the fix: `--only 1` → killed, `--only 10` → killed, live file hash unchanged.

## 12 · FILES

- `consonance/src-tauri/src/main.rs` — `LIBRARIAN_INDEX_BUDGET`, `label_date`, `index_window_line`,
  `corpus_shelf_at_with_index`, the window in the walk, the fourth header counter, the collapse line, nine tests
  and the floor-margin assertion. **Uncommitted.**
- `<scratch>/intake/rows-intake.js` — the ten mutant rows.

**Owned nothing else. Committed nothing.**

---

# 13 · THE HELD LAP — the red test is NOT this lap's making, and it is proved at HEAD

The chair held L062 on `shelf_tests::the_shelf_excludes_bulk_run_artifacts_and_says_so` going red, plain and
filtered, with `run1 items are back in the index`. It ran green on my tree at 04:06 (808/0) and red on the chair's
run minutes later. **The window did not cause it. The corpus did.**

## 13.1 · The diagnosis

The test asserted `!shelf.contains("- loop/run1/items/")` — over the **whole shelf**, which ends with every
carried body. At **04:12** the librarian committed its nightly note (`1d53c55`,
`exo_memory/librarian/2026-09-20.md`), and line 50 of it quotes my own §8.1 finding about this very instrument,
including the literal string `- loop/run1/items/`. `librarian/` is a **carried** tier windowed to today +
yesterday; the note is dated today; so its body rides in the shelf and the assertion matches **prose about the
exclusion** rather than an index line.

```
grep -rln -- "- loop/run1/items/" exo_memory/
  exo_memory/handback/p-intake-window-C_2026-09-20.md   (not walked: handback/ is not a tier)
  exo_memory/librarian/2026-09-20.md                    (CARRIED — this is the one)
```

**My window can only remove index lines. It cannot add a `- loop/run1/items/` one** — the exclusion `continue`s
before the file is even read, and that code is untouched.

## 13.2 · The proof, run rather than argued

A detached worktree at **HEAD (`1d53c55`), with none of my changes**, against the same corpus:

```
git worktree add --detach C:/Users/zackn/AppData/Local/Temp/l062-head-check HEAD
cd .../consonance/src-tauri && CARGO_TARGET_DIR=C:\build\l062-head-target \
  cargo test --bin consonance the_shelf_excludes_bulk_run_artifacts

thread 'shelf_tests::the_shelf_excludes_bulk_run_artifacts_and_says_so' panicked at src\main.rs:14133:9:
run1 items are back in the index
test result: FAILED. 0 passed; 1 failed
```

**Red at HEAD.** The chair's "green at `3e51292`" is correct and not in conflict: between `3e51292` and
`1d53c55` the *corpus* gained the sentence that trips it. The test has been latently broken for as long as the
assertion was unscoped; it needed a carried body to quote the path, and tonight one did.

*The corpus is an input to this suite, and this is the first case on record of a corpus commit turning a test
red without a line of code changing.* Worth its own line in the room: **these shelf tests read the live
`exo_memory/`, so "green on my tree" has a timestamp on it.** Mine was 04:06; the note landed at 04:12. Neither
of us was reading a stale result — the input moved between two correct readings.

## 13.3 · The repair, with both oracles reported as the test's comment demands

The test's own comment already records this exact trap being made **twice** — for the `- loop/` count, which was
fixed by scoping to the index section. **The fix was never applied to the two `!contains` assertions directly
above it.** It is now:

- **Oracle 1 — the artifacts are gone from the INDEX.** Both negative assertions now read `index_section`
  (from `## NOT CARRIED` to the first body), which is the claim they were always making. The exclusion notice is
  scoped to the **header** for the same reason: a carried body quoting that sentence would satisfy a whole-shelf
  `contains` without the shelf ever printing it.
- **Oracle 2 — the rest of `loop/` still indexes.** Unchanged in substance (`other_loop > 0`), now reading the
  same pre-computed `index_section` instead of re-splitting.

Mutant #4 of the repair pass puts the unscoped assertion back and must go red.

## 13.4 · The librarian's two small repairs, taken in this pass — they were cheap

**§8.1 — the inert instrument, re-pointed.** It counted index lines beginning `- loop/run1/items/`, which the
walk excludes *before* they can reach the index, so it printed a confident `0 file(s), 0 bytes` while its own
comment claimed 246 files / 15,753 bytes. It now reads the walk's own `run_artifacts_excluded` off the header
line the shelf already prints:

```
LIBRARIAN INDEX run artifacts EXCLUDED before indexing: 246 file(s)
  (the walk's own run_artifacts_excluded, read off the shelf header)
```

**246 — the historic number, alive again.** The bytes claim is dropped rather than re-derived: the walk does not
keep them and computing them here would be a second implementation of the exclusion, which is the two-paths
defect this room has paid for twice this week. Not asserted in the limit test by design — the notice's presence
is already asserted in the test that is *about* the artifacts, so a corpus with none goes red there.

**§10.2 — the standing instruments, protected by rule.** `loop_standing_instrument`: undated, **depth 1**,
ALL-CAPS basename under `loop/`. Today it selects exactly two — `ESCALATIONS.md` and `PROTOCOL.md`, ~130 bytes.
They ride in group 0 with `map/` and `journal/`. **The depth-1 half is the librarian's own catch and it is
load-bearing**: the same rule at any depth also selects `S01.md`–`S09.md`, the T3 run outputs, which are record
and not instruments. Pinned by `undated_all_caps_names_at_the_top_of_loop_are_protected_by_rule_not_by_list`,
including the negative cases and the fact that both files actually ride at a budget that windows most of the tier
away — `ESCALATIONS.md` especially, since it is the human-anchor queue and a seat that cannot see it decides
those questions itself.

**§10.1 — the intake margin: left alone**, as ruled. Nothing touched in `librarian_shelf_room` or
`INTAKE_HEADROOM`.

## 13.5 · The suite, and the numbers after the repairs

```
cargo test --bin consonance                      -> 809 passed; 0 failed; 4 ignored   (5.35s)
cargo test --bin consonance -- --test-threads=1  -> 809 passed; 0 failed; 4 ignored   (38.54s)
cargo test --bin consonance the_shelf_excludes_bulk_run_artifacts -> 1 passed; 0 failed
```

**Green plain, parallel, serial and filtered.** Eleven tests added across the lap; 813 total.

The corpus moved again (the librarian's note is now committed), so the figures move with it and are quoted
against this run:

| | value |
|---|---:|
| intake | 141,757 B (margin 8,243) |
| floor | 84,924 + 40,240 = **125,164** = **83.4%** of cap |
| **floor margin** | **24,836 B = 16.6%** |
| bodies | 16,593 B |
| index window dropped | 227 entries / 29,426 B |
| indexed by path | 304 |

*§1's figures were floor 125,136 / margin 24,864, measured before the librarian's note was committed. The
difference is 28 bytes of corpus, not a change in the code — the same moving-corpus caveat the librarian recorded
against its own nine-byte discrepancy, now visible a third time inside one lap.*

## 13.6 · Repair-pass mutants — 4 listed · 4 killed · 0 survived · 0 no result · 0 not applied

`node consonance/tools/mutant-harness.js <scratch>/intake/rows-repair.js`, pre-flight green 28/0, live file hash
unchanged on every run.

| # | mutant | caught by |
|---|---|---|
| 1 | the **depth-1 guard** is removed, so a nested all-caps path is protected as an instrument | `undated_all_caps_names_at_the_top_of_loop_...` |
| 2 | the **ALL-CAPS test** is removed, so all 82 undated working documents are protected | same |
| 3 | the rule is made **inert**, so `ESCALATIONS.md` is windowed out | same, + `undated_loop_entries_are_spent_last...` |
| 4 | **the index scoping is reverted** — the 04:12 failure put back | `the_shelf_excludes_bulk_run_artifacts_and_says_so` |

**Run 1 was 3/4, and #1 survived for the third instance of the same fault in one lap.** My negative case was
`loop/t3_run_outputs_D086/S01.md` — the librarian's own example — and it does **not** test the depth guard,
because `t3_run_outputs_D086` is lower-case, so the path fails the ALL-CAPS test whether or not the guard is
there. The discriminating case is a path that is all-caps at *every* level (`loop/RUN2/CELLS.md`), which is now
asserted alongside `loop/2026-08-18/README.md`. Re-scored: killed.

**Three times in one lap — the prefix budget, undated-last, and now the depth guard — a test passed for a reason
other than the property it names, and a mutant found each one.** I would rather record that as the lap's real
shape than as three footnotes: reading my own tests did not catch any of the three.

## 13.7 · What is still NOT verified after the repairs

Everything in §9 stands. Added:

1. **The corpus is an untracked input to this suite.** These shelf tests read the live `exo_memory/`, so a green
   result carries a timestamp: mine was 04:06, the librarian's note landed at 04:12, the chair's run came after.
   Nothing here makes that safe — it makes one *instance* of it safe. A test that greps the shelf for any string
   the corpus might also contain has the same latent fault, and I did not audit the rest of the file for others.
2. **`loop_standing_instrument` tests the case of the whole path after `loop/`, not of the basename alone.**
   Under the depth-1 guard those are the same string, so the behaviour is the librarian's rule exactly; without
   the guard they differ, which is what mutant #1 now pins. The rule is correct and the implementation is
   narrower than its name suggests.
3. **The re-pointed run-artifact figure (246) is parsed out of the shelf header**, so it depends on that header's
   wording. If the wording changes, the number silently returns to 0 — though
   `the_shelf_excludes_bulk_run_artifacts_and_says_so` asserts that same sentence, so the wording cannot change
   without a red test somewhere.
4. **Still nothing run inside the app.** No rebuild, no relaunch. The seat has not opened on this shelf.
