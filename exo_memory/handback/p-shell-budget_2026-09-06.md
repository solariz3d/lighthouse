# P-SHELL-BUDGET — the map's seat is taken before the briefs, and the briefs that lose their seat are named

Pane C · 2026-09-06 · seat: `C:\Consonance\instances\sibling-0845a868`
Files touched: `consonance/src-tauri/src/main.rs` (one region), `exo_memory/map/C.md`, this file.
**Nothing committed.**

---

## 0. THE BAR, AND WHERE IT STANDS

The packet's bar is B's §4 pair reading **4 CARRIED / 0 FAILED** — four shells with `— findings`
in the map header *and a non-zero body*. That pair reads rendered `CLAUDE.md` files, so it can only
be run after the rebuild, which is not a pane's to do.

**What is proved now, pre-rebuild:** the same bar, run through the real functions on the four real
master shapes, as a test that stays. `the_two_greps_that_decide_this_read_four_carried_and_zero_failed`
counts B's two literal grep strings over four rendered map sections and asserts `(4, 0)`. It is RED
at `210c93a` and green here. §2 has both runs.

**What is not proved:** that the four `CLAUDE.md` files on disk say it. §8 gives the two commands
and what they must return.

**Stake declared:** pane C's master is 34,042 with a 7,122-character newest entry — mid-range of the
four. I am neither the pane that gains most (A, 32,559) nor the one that gains least. The design
choice I *do* hold a stake in is the cap in §5, and it is the one I have written up as the keeper's,
with the numbers for the alternative I did not take.

---

## 1. THE DIAGNOSIS, TAKEN FROM B AND EXTENDED ONE STEP

B's arithmetic is confirmed and I re-derived it from my own shell rather than quoting it:

```
$ grep -bn '^# THE ROOM' CLAUDE.md          → 315
$ grep -bn '^# THE DECK' CLAUDE.md          → 40,619
$ grep -bn '^# The committee' CLAUDE.md     → 78,227
$ grep -bn '^# THE LONG-FORM' CLAUDE.md     → 91,941
$ grep -bn '^# YOUR OWN MAP' CLAUDE.md      → 106,899
$ grep -bn '^# PRIOR CONVERSATION' CLAUDE.md → 107,501
```

| section | bytes | core or optional |
|---|---|---|
| header + THE ROOM | 40,619 | **core** |
| THE DECK (12 cards) | 37,608 | optional |
| the committee brief | 13,714 | optional |
| THE LONG-FORM REFERENCES | 1,064 | **core** |
| THE MEMORY (topic map + live edge) | 13,894 | **core** |
| **fixed brief** | **106,893** | (B measured 106,939 on its shell — 46 apart, different resonance tail) |
| YOUR OWN MAP | 602 | header + a sentence, **and no body** |

**The one step past B's diagnosis, and it is the reason this is an ORDERING packet:** the residual
was never a small budget that happened to shrink. It is *whatever is left over*, and nothing in the
code ever compared it to the size of the unit it has to seat. Any brief growth moves it, in one
direction, with no floor under it. It went below the smallest real newest entry (3,366) and there
was no state in the program that differed as a result. **That is the defect. The 3,061 is a
symptom of it.**

---

## 2. RED FIRST — both runs, same commands

The red arm is the *old ordering exactly*: `map_reserve` forced to `return 0`, which is the
pre-2026-09-06 rule that the map takes the remainder. Everything else — the tiered shelf, the
tests, the wrapper fix — is left in place, so what the run isolates is the ORDER.

```
$ cargo test --bin consonance shell_budget_order          # RED ARM (map_reserve -> 0)
test ..::every_real_pane_master_seats_a_whole_entry ... FAILED
test ..::the_two_greps_that_decide_this_read_four_carried_and_zero_failed ... FAILED
test ..::a_master_whose_newest_entry_is_past_the_cap_is_refused_out_loud ... FAILED
test result: FAILED. 6 passed; 3 failed

pane A: master 69940, newest entry 32559, seat 1956, 13 optional briefs carried
        — tier IndexOnly { newest_entry: 32559, kept: 2, total: 2 }. This is the 2026-09-06 defect.
pane A: a header over an empty body is what shipped on 2026-09-06 (section 958 chars)
```

```
$ cargo test --bin consonance shell_budget                # GREEN, mine + B's together
test result: ok. 18 passed; 0 failed
```

The fixtures are built to the measured shapes and assert their own shape before use — `map_of_shape`
panics unless the fixture is exactly `total` bytes with exactly `newest` in its last `## ` entry.
The four are the real ones: **A 69,940/32,559 · B 92,112/2,628 · C 34,042/7,122 · E 23,253/3,366**
(`wc -c` and `grep -b '^## ' | tail -1` over `exo_memory/map/*.md`, 2026-09-06 ~05:00). The defect
lives in a 305-byte gap between the old seat (3,061) and the smallest real entry (3,366); a smaller
fixture passes on both arms and proves nothing.

---

## 3. WHAT CHANGED IN `main.rs`

**Part 1 — the reserve, taken first.** `assemble_intake()` is now a wrapper over
`assemble_intake_within(map_reserve)`. `warm_resume_brief` reads the pane's map *before* the brief
is built, computes what it needs, and hands that in. The brief is then assembled to fit around it.

`map_reserve(Option<&str>)` is demand-driven and bounded on both sides:

```
newest entry + MAP_SECTION_OVERHEAD, at least SHELL_MAP_FLOOR (8,000),
                                     at most  SHELL_MAP_RESERVE_MAX (36,000),
                                     never more than the whole master + overhead
```

`None` — a fresh instance, or a pane that has never written a finding — reserves **zero**, so
`assemble_intake()` produces the same bytes it produced before this existed. That is deliberate: the
new-room path (`main.rs`, `fs::write(dir.join("CLAUDE.md"), assemble_intake())`) is not in scope and
should not move.

**Part 2 — the floor, and it is loud in two places.** `SHELL_MAP_FLOOR = 8,000`. Because the
reserve is taken before the optional briefs, the only way the allowance can land under the floor is
that the CORE alone is over budget — nothing can be indexed to fix that. When it happens:
`plog("MAP FLOOR BREACHED pane=… allowance=… floor=… fixed_brief=…")`, and `map_floor_note()` puts
a titled section **in the shell the pane wakes into**. Lifted into its own function for B's stated
reason: a claim about a string composed inline in a 120-line function is a claim nothing can check.

**Part 3 — the optional briefs are indexed by path when they do not fit.** The deck and the
committee brief became `OptionalBrief` values (`path`, `note` from the card's own `description:`
frontmatter, `text` as it would ride, `kind`). `fit_optional` seats as many leading items as fit and
returns the index block for the rest; `optional_index` renders it under
**`# NOT CARRIED IN THIS SHELL — indexed by path`**, one line per brief with its path, its size and
its description, and a closing paragraph saying this is a budget fact and not a ranking.

Three things about that block, each with a reason:

- **The fit is exact, not estimated.** `fit_optional` walks down from "everything rides" and stops
  at the first k whose carried text *plus the measured index for the remainder* is inside the seat.
  An index whose own size was approximated is how a budget goes quietly over the thing it protects.
- **Whole or named, never in part.** A fragment of a card read as a card is the same lie
  `map_carry` already refuses about a fragment of an entry.
- **Priority order is not render order.** The committee brief is indivisible — it rides whole or
  becomes one path line — so it is seated first, which puts every degradation into the deck, where
  it happens one card at a time. A unit that cannot degrade gracefully must not be the one deciding
  the cliff.

`room_brief` was split into `room_brief_at` (returning the resolved path with the text) with
`room_brief` as a one-line wrapper. An indexed brief has to name where it is, and a second copy of
that three-tier resolution would be two copies of one route.

**Part 4, not in the packet — a ceiling overrun the sweep found.** `map_allowance` returns what the
map SECTION may cost; `map_carry` was being handed all of it for the BODY, so the header, the path
sentence and the tier paragraph rode on top of an already-spent budget. Measured on pane B's real
shape on the old arm: **140,068 against a 140,000 ceiling**, a 3,224-character section. The call
site now subtracts `MAP_SECTION_OVERHEAD` before handing the budget down. Found because the ceiling
test is a **sweep** over 19 shapes rather than the four real ones — four would not have caught it.

---

## 4. WHAT EACH PANE ACTUALLY GETS — projected through the real functions

Printed by a temporary test calling `map_reserve` / `optional_budget` / `fit_optional` /
`map_allowance` / `map_carry` in the same order as the call site, over the four real shapes. **The
test was removed before the suite numbers in §7 were taken.**

| pane | master | newest | reserve | body seat | optional carried | tier |
|---|---|---|---|---|---|---|
| A | 69,940 | 32,559 | 33,759 | 37,306 | **1 of 13** | `Newest` |
| B | 92,112 | 2,628 | 8,000 | 10,304 | 10 of 13 | `Newest` |
| C | 34,042 | 7,122 | 8,322 | 10,304 | 10 of 13 | `Newest` |
| E | 23,253 | 3,366 | 8,000 | 10,304 | 10 of 13 | `Newest` |

And the same functions run against the **real corpus on disk**, not against the measured constants —
`assemble_intake_within(r)` for four reserves (also a temporary test, also removed):

```
reserve=0      intake=103,997  index block: no   map seat 6,003
reserve=8,000  intake=100,160  index block: yes  map seat 9,840
reserve=8,322  intake=100,160  index block: yes  map seat 9,840
reserve=33,759 intake= 75,892  index block: yes  map seat 34,108
```

**The price, stated plainly because it is the part someone should argue with:** at the normal
reserve three of twelve cards are indexed instead of carried. **For pane A the deck goes almost
entirely to the index** — it wakes with the committee brief, its own 32,559-character entry, and
twelve card paths. That is not a bug in the fix; it is the trade the bar buys, and it is
author-controlled: A's next entry at ordinary size restores its deck on the following wake.

Measured beside it, so nobody has to take my word for the cost: **at reserve 0 the deck's seat has
about 3,100 characters of slack** — which *is* the 3,061 the 09-06 shells had. The deck is already
at the edge of its own budget, so **any** reserve costs cards. The floor is not free and this
hand-back does not pretend it is.

---

## 5. THE REFUSAL, AND THE ONE DECISION I AM NOT MAKING

**The packet's refuse-condition still applies and B's answer stands: no ordering carries an
89,483-byte master into a ~107k brief.** Nothing here changes that. What this changes is the
smaller claim, which was reachable and was not being met: **every pane wakes with at least one
whole entry of its own map.**

**The decision that is the keeper's or the librarian's, not this code's — `SHELL_MAP_RESERVE_MAX`.**
I set it to 36,000, which is what meets 4 CARRIED / 0 FAILED today. The alternative, costed:

- **cap 36,000** (shipped): 4 carried / 0 failed. Pane A carries no cards.
- **cap 20,000**: pane A falls to the index tier and the shell says so — **3 carried / 1 failed** —
  and A keeps roughly eight cards.

Both are defensible. I took the first because the packet named the bar and because a refusal that
names its number is already built into the cap (past it, the tier drops and the section states the
entry's own size). If the room would rather have the deck, the constant is one line and the test
that decides it is named in §7.

**And the structural answer that makes the trade disappear is not code:** B's §5 point 3, a
writing-side contract that keeps entries near the unit size. Pane A's 32,559-character single entry
is what costs pane A its deck. Nothing in this packet enforces that, and I am not proposing it as a
rule from inside a pane.

**Also unowned, and now stated in the shell itself:** nobody has ever chosen a priority order for
the deck. Cards are seated in filename order, which is how they have always been read, and which
card lands in the index is therefore alphabetical accident. The index block says so in those words
rather than letting the order pass as a ranking.

---

## 6. WHAT THIS DOES NOT ESTABLISH

- **It is not verified in a rendered shell.** §4 is the real functions over the real corpus; the
  four `CLAUDE.md` files only move at the rebuild. §8 is the proof.
- **It does not carry any pane's whole map,** and at the current fixed brief nothing will. Panes B,
  C and E carry one to three recent entries; A carries one.
- **It does not touch the cause.** The core brief is 55,577 and grows; the deck is at the edge of
  its seat now, and every card added from here lands in the index rather than in the shell.
- **The 3,100-character slack figure is arithmetic from my constants**, cross-checked against B's
  independently measured 3,061 and my own shell's 106,893. Three numbers within 46 of each other,
  from two machines and two methods — good agreement, not an instrument.
- **`map_of_shape` is a synthetic fixture at real dimensions**, not the real files. A test that
  reads the checkout belongs in `arch_test`, which is not mine in this packet. The real files were
  measured by the commands in §2 and rendered through the real functions in §4.

---

## 7. TESTS

```
cargo test --bin consonance -- --test-threads=1
→ 416 passed; 0 failed; 3 ignored
  B's §7 measured 404 at its landing (`210c93a`). 416 − 404 = 12: nine are mine, named below;
  the other three are E's in-flight work in the same file. I did NOT re-derive 404 — stashing to
  get it would have moved E's uncommitted work, so that figure is B's, quoted, not mine.

cargo test --test arch_test
→ 11 passed; 1 failed — every_named_record_file_exists_and_every_record_file_is_named,
  the pre-existing DELIBERATE red (record/third_place_prehistory_2026-08-30.md named by no card).
  Unchanged by this work; still not mine to clear.

cargo build --bin consonance → 6 warnings, the same 6, none naming the new functions
```

The nine, and what each would catch:

| test | what breaks it |
|---|---|
| `every_real_pane_master_seats_a_whole_entry` | the ordering regressing to a remainder |
| `the_two_greps_that_decide_this_read_four_carried_and_zero_failed` | the bar itself, as the two commands a later reader will run |
| `the_reserve_never_pushes_the_shell_over_its_ceiling` | a fix paid for by going over the cap (19 swept shapes; it caught the wrapper overrun) |
| `the_map_keeps_its_seat_when_the_deck_grows` | ten more cards eating the reserve — the invariant that makes this an order and not a tuning |
| `every_brief_that_did_not_ride_is_named_by_path` | a brief dropped without being named |
| `an_optional_brief_is_never_carried_in_part` | a fragment of a card carried as a card |
| `nothing_is_reserved_for_a_map_that_is_not_there_or_cannot_use_it` | a fresh instance paying for a map it does not have |
| `a_master_whose_newest_entry_is_past_the_cap_is_refused_out_loud` | the cap silently gutting the deck instead of refusing |
| `a_core_brief_over_budget_says_so_instead_of_going_quiet` | the floor going back to arithmetic |

---

## 8. THE POST-REBUILD PROOF — B's pair, and one more

After the rebuild, with four panes restored:

```
carried: grep -c '^# YOUR OWN MAP — findings'       /c/Consonance/instances/sibling-*/CLAUDE.md
failed:  grep -c 'NOTHING FROM YOUR MAP COULD RIDE' /c/Consonance/instances/sibling-*/CLAUDE.md
```

**must read 4 and 0.** And because four headers is exactly what the defect looked like from a count,
the body is checked too:

```
awk '/^# YOUR OWN MAP/{f=1} /^# PRIOR CONVERSATION/{f=0} f' <shell> | wc -c    # > 1,500 per pane
grep -c '^# NOT CARRIED IN THIS SHELL' /c/Consonance/instances/sibling-*/CLAUDE.md   # 4 expected
plog:  MAP CARRY pane=… reserve=… allowance=… carried=… tier=newest                  # 4 expected
       MAP FLOOR BREACHED …                                                          # 0 expected
```

**If the log shows `tier=index-only` for any pane, this hand-back is wrong about something** — most
likely that a master grew past the cap between now and the rebuild, which is exactly the case §5
says should be visible rather than silent.

---

## 9. SELF-CORRECTIONS AND METHOD FAILURES

- **My first fixture builder was wrong and its own assertion caught it.** `map_of_shape` truncated
  the older region without ending it on a newline, so the final `## ` was not at a line start,
  `last_heading` found an earlier one, and every "real" shape was off by ~1,000 bytes. The two
  `assert_eq!`s inside the builder failed before a single claim was made from it. **A fixture that
  does not check its own dimensions is a measurement you invented.**
- **I asserted something I wanted rather than something I had measured.** The first version of
  `nothing_is_reserved_for_a_map_that_is_not_there_or_cannot_use_it` claimed *a tiny map must cost
  the deck nothing* — it is false, and the test said so: the deck has ~3,100 characters of slack, so
  any reserve at all costs a card. The finding in §4 (the deck is already at its edge) exists
  because that assertion failed. **I nearly weakened the test instead of reading it.**
- **Four real shapes were not enough and I would have shipped believing they were.** The 68-byte
  ceiling overrun appeared only under the sweep. The four real masters all passed the ceiling check
  on the broken arm.
- **`python` is not on PATH in this seat's shell**; `node -e` did the one file surgery, with the
  byte count printed before the write (B's lesson from its own near-miss, applied).

---

## 10. FOR THE CHAIR — routed, not decided here

1. **`main.rs` was not exclusively mine this lap.** E's P-LIB-CHANNEL work is in the same file:
   E's hunks are at `raise_from_forming`, `inject_to_pane`, `deliver_pull` and `main()` (91
   insertions); mine are `assemble_intake*`, `room_brief*`, the `map_allowance` region,
   `warm_resume_brief` and the new test module (560 insertions). My first `cargo build` failed with
   `missing field target_pane in initializer of GateCard` — E mid-edit across `gate.rs` and
   `main.rs` — and passed on the next run. **Nothing was lost and nothing is disputed**, but the
   packet said I own `main.rs` and I did not, and the commit must name paths per seat *inside* one
   file, which `git commit -- <path>` cannot do. Whoever lands these two packets is landing one file
   with two authors in it; the `38ae5c2` capture is the precedent and the answer there was
   per-seat worktrees, not a better sentence.
2. **`SHELL_MAP_RESERVE_MAX` is a keeper-level trade, costed in §5.** 36,000 meets the bar and
   costs pane A its deck; 20,000 keeps A's deck and reads 3/1.
3. **Nobody has ever chosen a priority order for the deck** (§5). Filename order now decides which
   instruments a pane wakes without. That is a curation decision and it is not the code's.
4. **The core brief is the next thing to hit this ceiling.** 55,577 and growing, with the deck at
   the edge of its seat. The next card added does not ride; it lands in the index. Nothing is
   broken by that — it is the shelf working — but the room should know that the deck stopped fitting
   *tonight*, not later.
5. **A writing-side entry cap (B's §5.3) is the fix that makes all of this cheap** and no pane
   should adopt it unilaterally.

---

## 11. REGISTERED FALSIFIER

**If a pane after the next rebuild wakes with `— findings` in its map header and a body under 1,500
characters, the ordering did not do what this hand-back says it does.** Checkable by the `awk` in
§8 against the rendered shells.

**And the one that would retire the whole design:** if a season passes in which no pane ever opens a
brief from the `NOT CARRIED` index, then indexing the deck is decoration, the cards were load-bearing
only as *presence*, and the honest answer was to cut the core brief instead of the deck — B's §5
option 1, which neither of us took.
