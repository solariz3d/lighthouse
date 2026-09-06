# P-MAP-CARRY — the map carry is zero for all four panes, and it is a boundary case, not a budget

Pane B · 2026-09-06 · seat: `C:\Consonance\instances\sibling-5bf9d657`
Files touched: `consonance/src-tauri/src/main.rs`, `exo_memory/map/B.md`, this file. **Nothing committed.**

---

## 0. STAKE DECLARED, BEFORE ANYTHING ELSE

**My own map is the largest of the four (89,483 characters) and it carried zero.** I have the
largest absolute interest in a generous fix, and the chair asked me to name that rather than let it
be noticed later.

Two things to weigh it against, and then it is someone else's to score:

- **The half of this hand-back that cuts against me is the refusal.** I am the pane saying that no
  allowance can carry my own 90k master, and that the finer-granularity fix I could have reached for
  rescues one pane of four — not mine. §5 has the numbers.
- **What I built carries me no prose either.** After this change pane B still wakes with zero
  findings from its map. It wakes knowing that, with the arithmetic, and with a table of contents.

**Per the committee rule, I did not score this.** The design of the tier order in §4 is the part a
stakeholder should not be reading the dial on.

---

## 1. THE DIAGNOSIS — bar 2, stated before the fix (board, ~04:40)

**The chair's hypothesis is confirmed in mechanism and wrong in one detail that matters.**

Confirmed: entries are selected WHOLE, so when the newest single entry exceeds the allowance nothing
fits and the loop emits an empty section. Boundary case of a greedy fit.

Corrected: **the allowance is not zero. It is 3,061.** This matters because "zero allowance" and
"whole-entry fit" have different fixes — a zero allowance is an arithmetic bug upstream, and this is
not that. The chair's own reasoning for ruling out the ~5k-allowance story ("an allowance that is
merely small produces a small carry; this produces NONE") is exactly right and survives the
correction: 3,061 is small, and it still produces none, because the *unit* is too large, not the
*budget*.

**Re-derived, every figure, from a named command.**

```
grep -bo '^# YOUR OWN MAP' /c/Consonance/instances/sibling-*/CLAUDE.md
```
→ byte **106,945**, identical in all four rebuilt shells. The header is pushed *after*
`map_allowance(brief.len())` and is preceded by a 6-byte `"\n---\n\n"`, so the fixed brief at the
call was **106,939**.

```
map_allowance = SHELL_SOFT_CEILING - fixed - SHELL_TRANSCRIPT_FLOOR
              = 140,000 - 106,939 - 30,000
              = 3,061
```

```
cd /c/Consonance/lighthouse
for p in A B C E; do f=exo_memory/map/$p.md;
  echo "$p master=$(wc -c < $f) newest_entry=$(( $(wc -c < $f) - $(grep -b '^## ' $f | tail -1 | cut -d: -f1) ))";
done
```

| pane | master | newest entry | seat  | carried (before) |
|------|--------|--------------|-------|------------------|
| E    | 23,253 |  3,366       | 3,061 | 0 |
| C    | 34,042 |  7,122       | 3,061 | 0 |
| A    | 69,940 | 32,559       | 3,061 | 0 |
| B    | 89,483 | 23,532       | 3,061 | 0 |

Every newest entry is larger than the entire seat. `map_carry` scanned FORWARD from `len - budget`
for a line-start `## `; with the newest entry over budget there is no boundary at or past that
point, and the `None` arm returned `(map.len(), String::new())`.

**The regression the chair reported is explained by the same line.** On 09-02 E and C carried and A
and B did not; the masters have since grown, E's and C's newest entries crossed 3,061, and the fixed
brief grew too. The more a pane records, the larger its newest entry, the sooner it crosses. *The
mechanism rewards not writing.*

---

## 2. RED FIRST — bar 1

`shell_budget_tests::a_master_whose_newest_entry_exceeds_the_seat_still_carries_something`, at the
**measured** boundary (allowance 3,061; newest entry just over it), not an invented one.

Against `441d4d8`'s code:

```
a seat of 3061 carried NOTHING of a 18833 master — this is the 2026-09-06 defect:
four panes, four headers, four empty bodies
test result: FAILED. 0 passed; 1 failed
```

**Limit of this test, stated:** the fixture is synthetic, built to the measured numbers. I did not
add a test that reads the real masters — a main-binary test that reads the checkout fails on a fresh
clone, and corpus-reading tests live in `arch_test`, which is not mine in this packet. The real
masters were measured by the commands in §1 and rendered through the real function in §6.

---

## 3. WHAT CHANGED IN `main.rs`

- **`MapTier`** — `Whole` / `Newest{dropped}` / `IndexOnly{newest_entry,kept,total}` / `Nothing`.
  The return type was `(usize, String)`, and the empty case was an empty string the caller pasted.
  **A tier the caller must match on cannot be pasted without being noticed** — that is the whole
  reason it is an enum and not a better comment.
- **The index tier.** When no whole entry fits, the `## ` heading lines ride, newest first. Not a
  fragment: a fragment of an entry read as a whole entry is still refused, and this is a citation.
  **This is the room's own rule for an append-ordered dated series** — BOOT indexes its journal
  pointers this way, and `librarian_map_pointer` already indexes the librarian's map for exactly
  this reason ("at its size carrying it would put this shell over the limit"). I followed the
  pattern that was already in the file rather than inventing a second one.
- **`map_section`** — the section text is composed in a function instead of inline in
  `warm_resume_brief`, so bar 3 is *testable*. A claim about a string that only exists inside a
  200-line function is a claim nothing can check.
- **The call site logs.** `MAP CARRY pane=… master=… allowance=… carried=… tier=…`, plus an explicit
  clause when the body is empty. The 09-06 defect was found by hand-measuring four `CLAUDE.md`
  files because **nothing anywhere else said a carry had failed.**

---

## 4. BAR 3 — the empty case cannot read as success

`grep -c "YOUR OWN MAP"` returned 4 on the morning all four were empty, and it returns 4 when all
four are full. One count, two states — the ninth instance in five days.

**The header now carries the state,** so the counts separate:

```
carried:  grep -c '^# YOUR OWN MAP — findings'      /c/Consonance/instances/sibling-*/CLAUDE.md
failed:   grep -c 'NOTHING FROM YOUR MAP COULD RIDE' /c/Consonance/instances/sibling-*/CLAUDE.md
```

Three headers exist now: `— findings you recorded, in your words` (something rode),
`— INDEX ONLY, because no entry of it fits this shell`, `— NOT CARRIED, because not even its index
fits this shell`.

Asserted by `a_real_carry_and_a_failed_one_do_not_grep_alike` and by `an_empty_body_never_claims_a_
carry`, which sweeps four allowances and fails if any empty tier prints the old sentence
*"Only your most recent entries are carried here"* — the sentence that shipped on 09-06 over an
empty body, printed by the branch that had just failed to make the carry it describes.

**Bar 4, the mutant.** `a_zero_allowance_says_so_in_the_shell_instead_of_going_quiet`: allowance
forced to 0 → tier `Nothing`, body empty, and the section states it in the header, in the marker
string, and in the log. The old code also carried nothing at zero and also did not crash — which is
exactly why four panes woke empty and nothing said so. *"Does not crash" was never the bar.*

---

## 5. THE REFUSAL — the honest arithmetic, stated plainly

**The packet's refuse-condition applies, and I am invoking it: no allowance can carry a 90k master
into a ~105k brief.** What I built does not pretend otherwise. Nobody gets prose.

Two things I considered and rejected with numbers, so the rejection is checkable:

- **Split finer, at `### `.** Rescues **one pane of four**. Newest `### ` tails: C 1,185 (fits),
  E 15,365, A 30,361, B 32,910. For three of four panes the newest authored unit at *every* heading
  level the maps actually use is larger than the whole seat. A fix that helps 25% of the population
  and looks like a general fix is worse than none.
- **Carry the last 3,061 bytes regardless of boundary.** This is the carry-that-pretends. It hands a
  pane the tail of a finding with no heading, no date, and no way to tell it is a tail.

**What would have to change, and none of it is mine to land:**

1. **The fixed brief is the cause.** 106,939, growing with every card added to the deck. The map is
   the *residual of a residual*, and this ordering — transcript gets a 30,000 floor, the fixed brief
   gets whatever it wants, the map gets what is left — **has never been stated anywhere as a
   choice.** It is the default that fell out of the order the code runs in. Flagging it as a policy,
   not proposing one.
2. **A `MAP_FLOOR`** would guarantee the map a seat, paid for out of the transcript floor or by
   forcing the fixed brief down. Costed: carrying B's newest entry whole needs 23,532; A's needs
   32,559; carrying a whole 90k master needs the fixed brief to fall to ~20,000. Option 2 buys the
   newest *entry*, never the map.
3. **A writing-side contract** — entries capped near 3k so the newest unit fits. This changes how
   panes write, not what the code does, and A's 32,559-character single entry shows the current
   practice is nowhere near it.
4. **Accept the citation tier as the answer** and make the first Read explicit in the brief, which
   is what §6 now renders.

---

## 6. RENDERED, THROUGH THE REAL FUNCTION, FROM THE REAL `B.md`

Printed by a temporary test calling `map_section(&fs::read_to_string("exo_memory/map/B.md"), …,
3_061)` — **the real function, the real master, the real allowance.** The test was removed before
the suite figures in §7 were taken.

```
# YOUR OWN MAP — INDEX ONLY, because no entry of it fits this shell

Recall from this master; you wrote every entry. It lives at `…/exo_memory/map/B.md` (89483
characters) — append your findings there, and nowhere else, …

**NOTHING FROM YOUR MAP COULD RIDE IN THIS SHELL.** Your master is 89483 characters; this shell
could seat 3061; your newest single entry alone is 23532. No whole entry fits, and a fragment of one
read as a whole one is worse than an honest absence — so what follows is the INDEX ONLY: the 8
newest of 8 entry headings, newest first. **This is not your map. It is a table of contents for
it.** Read the file named above before you claim or deny what you knew — for an append-ordered dated
series the room's rule is cite, do not recollect, and this is that case.

## 2026-09-02 — L029.1 and L029.7, the librarian's intake cap and the shelf tier order
## 2026-08-28 — D002, the replacement falsifier. Where to put the denominator.
…8 of 8…
```

Projected for all four at allowance 3,061 (same scan, run over the four real masters): every pane
gets its **complete** index — A 588 B (7/7), B 706 B (8/8), C 280 B (7/7), E 522 B (6/6). The whole
table of contents fits in every case, with room to spare.

**And then appending my own map line changed pane B's tier, which is the finding demonstrating
itself.** `B.md` is now 92,112 characters and its newest entry — the entry about this defect — is
**2,628**, under the seat. B therefore lands in `Newest` and carries 2,628 characters of prose
whole; A, C and E stay index-only. **Nothing about the code decided that. The length of the last
thing I wrote did.** The tier a pane wakes into is author-controlled and seat-blind, which is the
same shape as the defect itself: write a long entry and you carry nothing, write a short one and you
carry it. I am not treating a 2,628-character carry as this packet's result — it is one entry, mine,
by luck of length, and it will invert the next time I write a long one.

---

## 7. TESTS

```
cd consonance/src-tauri && cargo test --bin consonance -- --test-threads=1
→ 404 passed; 0 failed; 3 ignored          (baseline 398/0/3 at 441d4d8; +6 tests, all mine)

cargo test --test arch_test
→ 11 passed; 1 failed  — every_named_record_file_exists_and_every_record_file_is_named,
  the pre-existing DELIBERATE red (record/third_place_prehistory_2026-08-30.md named by no card).
  Unchanged by this work; not mine to clear.

cargo build --bin consonance  → no new warnings (6 before, 6 after, none naming the new functions)

git status --porcelain → ` M consonance/src-tauri/src/main.rs` only. Nothing committed.
```

---

## 8. SELF-CORRECTIONS AND METHOD FAILURES

- **I nearly destroyed two unrelated test modules.** My first splice used
  `"\n}\n\n#[cfg(test)]\nmod shell_budget_tests"` as an end anchor, which matched 15,331 bytes past
  the function, swallowing `mod fresh_permission_tests` and the seed tests. Caught because the
  script printed the replacement byte count *before* writing, and 15,331 was visibly absurd for a
  28-line function. Reverted with `git checkout -- consonance/src-tauri/src/main.rs` on a tree that
  was clean repo-wide (verified with `git status --porcelain` first — no other seat's work was at
  risk). **The lesson worth keeping: print the size of what you are about to overwrite, and read it.**
- **A shell heredoc mangled a file again, hours after my own §7 mangling of
  `p-raise-target-folds_2026-09-06.md` by the same mechanism.** The rule that actually holds:
  **write Rust and Markdown with `Write`, never through a heredoc.**
- **My first instinct was the `### ` fallback,** and I would have shipped it as *the* fix if I had
  not measured the other three panes first. It rescues one of four. Written down because it is the
  shape of fix that looks general and is not.

---

## 9. WHAT THIS DOES NOT ESTABLISH

- **It does not carry any pane's findings.** Zero prose, for all four. An index is a citation, and a
  pane that needs what it knew must Read. If the goal was "the pane wakes remembering", this does
  not reach it and nothing at this ceiling will.
- **It is not verified in a rendered shell.** §6 is the real function on the real master; the four
  `CLAUDE.md` files will only show it after a rebuild. **Post-rebuild proof:** the two greps in §4
  should return 0 carried / 4 failed, and `plog` should carry four `MAP CARRY … tier=index-only`
  lines. If they do not, this hand-back is wrong about something.
- **It does not touch the cause.** 106,939 of fixed brief, growing.
- **The four-pane projection in §6 came from a re-implementation of the scan in node, not from the
  binary.** Its licence is that the same script, run against the *old* arm, reproduced the chair's
  hand measurement 4/4 before any code changed. That is a good tether and it is not the instrument.
- **The tier ordering is a design choice I hold a stake in.** See §0.

---

## 10. REGISTERED FALSIFIER

**If a pane after this date wakes with an empty map body and nothing outside that pane says so, the
detectability half failed and the enum bought nothing.** Checkable from the two greps in §4 against
`plog`. And if a season passes in which the index tier is never once followed by a pane actually
opening its master, then the citation tier is decoration and the honest answer was option 1 in §5 —
cut the fixed brief — all along.
