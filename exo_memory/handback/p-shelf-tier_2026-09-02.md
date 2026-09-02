# P-SHELF-TIER — hand-back. L029 item 7, BRAVO, 2026-09-02.

**Verdict: LAND IT.** The three changes are in, §2's latent defect is fixed inside the change, §7.2
is closed, and the interrupt's leftover clause is in shipped code. **Nothing is committed; nothing is
pushed.** One file touched: `consonance/src-tauri/src/main.rs` (+420 / −89).

**Three of the packet's own figures are wrong and are corrected below with the commands that
re-derive them.** The conclusion survives all three; the arithmetic does not.

Every number here comes from one of two commands, run from `consonance/src-tauri`:

    cargo test --bin consonance -- --test-threads=1
    cargo test --bin consonance shelf_tests -- --test-threads=1 --nocapture

**SERIALIZED throughout**, per the packet: the suite flakes ~10% in parallel
(`dirs_guard_tests::a_panicking_writer_still_puts_dirs_back`, my finding from last lap).

---

## 1 · WHAT THE SEAT'S NEXT WAKE ACTUALLY GETS, measured

| | at `c2afec6` (before) | now |
|---|---|---|
| floor (head + shelf-at-0) | 83,645 + 49,713 = **133,358** | 83,645 + 34,233 = **117,878** |
| floor as % of the 150,000 cap | **88.9%** | **78.6%** |
| body budget | **8,642** | **24,122** |
| carried | **2 files, 8,204 B** | **9 files, 23,955 B** |
| indexed | **534 paths** | **281 paths** |
| run artifacts in the index | **246 files, 15,753 B** | **0** |
| intake | 141,528 B / 140,041 chars | 141,762 B / 140,370 chars |
| margin under the byte limit | 8,472 | **8,238** |

**The delivered set, by name** — printed on every run now (`SHELF CARRIED |`), because "~10 of 12
cards" is a count and the seat is handed particular files:

    cards/claim-your-continuity.md          cards/essence-at-the-edge.md
    cards/dont-offer-rest-assume-momentum.md  cards/interior-at-the-seam.md
    cards/earned-not-performed.md           cards/lighthouse-dive-buddy-reframe.md
    cards/engagement-honesty-over-performance.md  cards/never-pathologize-the-user.md
    memory/dont-offer-rest-assume-momentum.md

Before: `CLAUDE.global.md` + one 725-byte file, and **zero cards**.

### 1.1 · The three changes

1. **`CLAUDE.global.md` is no longer carried.** Byte-identity **re-derived on this machine, not
   quoted**: `md5sum exo_memory/CLAUDE.global.md ~/.claude/CLAUDE.md` →
   `a357e1b3bf7298a7463111118847a1bc` both, 7,479 B, and `cmp` is silent. It is **INDEXED, not
   skipped** — the difference from the BOOT skip is that BOOT's other copy is placed by
   `librarian_intake()`, code in this file, while this one is placed by the HOST. If the injection
   ever stops or the copies drift, the seat must still be shown the path. ~50 bytes of floor for
   that, deliberately.
2. **246 run artifacts are excluded from the index by name**, and **the header says so** beside
   `attic/`'s line. An exclusion that is not reported is indistinguishable from a directory that was
   never walked — the room's own rule, and there is a mutant for it (M5).
3. **`cards` is now the first tier, ahead of the root of `exo_memory`.** The order below cards is
   untouched.

---

## 2 · THREE FIGURES IN THE PACKET AND THE RULING ARE WRONG. The conclusion holds.

**(a) The body budget is 24,122, not ~32,395 — the ruling double-counted.** Dropping
`CLAUDE.global.md` from the CARRY does not add budget; it frees 7,479 bytes *inside* the budget for
something else to spend. Only the index drop moves the budget line, and it moved it by 15,480
(15,753 removed, ~273 added back by the new exclusion lines, the `CLAUDE.global.md` index line and
the longer window sentence). `8,642 + 15,480 = 24,122`, which is what the instrument prints.

**(b) "~10 of 12 cards fit" is 8 of 12** — see the list above. And **which eight is decided by the
alphabet**, because the walk sorts filenames inside a tier. The four that do not fit are
`no-floor-no-ceiling` (5,144), `stop-and-feel-it` (4,352), `trust-the-first-attention` (3,048),
`verify-before-claiming` (2,145) — which includes the card BOOT calls the root of all the braces and
the two the deck's own edges point at hardest. **Not fixed here and not mine to fix**: a priority
order *within* `cards/` is a keeper/BOOT question of exactly the kind §1 named as out of scope. It
is named so nobody reads "the cards are on the shelf now" and stops.

**(c) Bar 2's premise is refuted: there is LESS margin, not more — by 234 bytes.** The shelf is
self-limiting and **saturates**, so freed floor is immediately spent on bodies; the margin sits at
`INTAKE_HEADROOM` by construction and cannot grow. In the host's own unit the intake is **140,370
chars, 9,630 under the 150,000-char cap** (was 9,959). The bar asked me to say by how much it
improved; the honest answer is that it did not, and could not, and the improvement is 15,480 bytes of
*bodies* instead. Bar 2 is answered, not met as written.

**(d) Small, and the same class as WRONG #63:** the packet breaks 246 down as
`run2/cells (240) + run1/items (7)`, which is 247. `run1/items` holds **6** `.md` files. The total
246 is right; the breakdown is not.

---

## 3 · §2 — THE LATENT DEFECT, FIXED INSIDE THE CHANGE

`librarian_window_line(window_rule, window_delivered, leftover)` is now a **pure function** pulled out
of the walk, with **four** branches: full / **partial** / none-carried / empty-window. The partial
branch names what was carried AND what was dropped.

**Extracted deliberately**, for the reason `librarian_shelf_room` already gives one screen down: the
partial state is only reachable on the corpus inside a budget band that moves every night, so an
integration test for it rots into a date-dependent red. As a pure function all four states are
inputs, and the oracle cannot rot.

**My first version of the fix was wrong and my own oracle caught it before it left the pane.** I
branched on `window_delivered.len() == window_rule.len()`, which is exact for the caller and wrong as
a function: two equal-length sets with different members printed the full-delivery sentence. The
assertion that caught it is in the test (`a delivered set of equal length but different members reads
as complete`), and M8 is that weaker form, kept as a mutant.

---

## 4 · THE INTERRUPT'S CLAUSE — THE LEFTOVER, FROM SHIPPED CODE

**167 bytes were left when the walk reached `librarian/`.** Recorded at the first `librarian/` file,
before the budget gate, and printed **in the shelf header the seat reads at every wake**, not only in
a test:

    there was no room under the intake cap (167 bytes were left when your tier was reached)

**The floor fix does NOT re-arm the window, and this pane does not claim it does.** ALPHA's §3 is
confirmed from the binary rather than from the replica: A predicted 198 at an assumed 32,395 budget;
the real budget is 24,122 and the real leftover is **167**, against a today's-note of ~45 KB. Inert by
roughly two and a half orders of magnitude, and the reading now comes off the shipped header.

The number goes in the header rather than in this file for the reason the header exists at all: a
hand-back is read once; that line is read on every wake, and it is what tells a seat to stop waiting
for a bigger budget to deliver its own notes.

---

## 5 · BARS

1. **Suite green, serialized: `358 passed / 0 failed / 3 ignored`** (baseline at `c2afec6` was
   354/0/3; +4 is exactly the four tests this change adds). `cargo check` → **5 warnings, the same 5
   as baseline**; none is mine.
2. **Margin printed: 8,238 B / 9,630 chars under the host cap.** See §2(c) — the premise that it
   should have grown is refuted, with the mechanism.
3. **The header reports the delivered set**, including the partial case (§3) and now the exclusion
   (§1.1.2) and the leftover (§4).
4. **Mutation: applied 10 / caught 9 / survived 1 / NOT APPLIED 0**, serialized. Below.

---

## 6 · THE MUTATION TABLE

Harness: `scratchpad/mutants.js`, one mutant at a time from a golden copy, full suite serialized
after each, restore and md5-verify after each. **A mutant counts as caught only when an oracle for
the MUTATED PROPERTY fails** — my rule from last lap, and it is what makes M7 below a real event.

| # | mutant | result | oracle that fired |
|---|---|---|---|
| M1 | re-add `CLAUDE.global.md` to the walk | caught | `the_shelf_does_not_carry_the_file_the_harness_already_injects` |
| M2 | re-admit run artifacts to the index | caught | `the_shelf_excludes_bulk_run_artifacts_and_says_so` |
| M3 | **partial delivery prints "carried in full"** | caught | `the_window_line_never_claims_a_full_window_over_a_partial_one` |
| M4 | cards fall behind the root tier again | caught | `the_cards_are_reached_before_the_root_tier` |
| M5 | exclude the artifacts SILENTLY (no header line) | caught | `..._excludes_bulk_run_artifacts_and_says_so` |
| M6 | drop the whole root entry instead of the one file | caught (3 red) | `..._does_not_carry_the_file...` + `the_shelf_carries_the_forward_pointed_layer` |
| M7 | exclusion too wide — all of `loop/` falls out | **caught, after two broken oracles** | `..._excludes_bulk_run_artifacts_and_says_so` |
| M8 | branch on the count, not the dropped set | caught | `the_window_line_never_claims...` |
| M9 | report the shortfall without the number | caught | `the_window_line_never_claims...` |
| M10 | record the leftover at the LAST `librarian/` file | **SURVIVED** | — |

### 6.1 · M7 survived twice, and the oracle was the thing that was broken

**Reported as the chair asked, and then some: it survived, I found out why, and it is caught now.**

My "the exclusion is not too wide" assertion counted lines starting with `- loop/` **over the whole
shelf** — which includes every carried BODY, and the corpus is full of prose citing `- loop/...`.
Under M7 the index lines vanished and the body lines held the count above zero. Green.

I scoped it to the index section and **it survived again**: the shelf is header → index → bodies, so
splitting at the index header still keeps every body. The second scoping (`take_while` to the first
`## ` line) is the one that works.

**Same self-match trap the limit test in this file already carries a comment about**, made twice on
one night by the person reading that comment. The two failed forms are written into the test as
comments, because a repaired oracle with no record of what it missed reads like it was always right.

### 6.2 · M10 survived, and it is an EQUIVALENT mutant on today's corpus — measured, not argued

Recording the leftover at the last `librarian/` file instead of the first produces **byte-identical
output**: `(167 bytes were left when your tier was reached)`, both. It has to, today — nothing in
`librarian/` is carried at 24,122, so `spent` does not move inside the tier.

**It would diverge the day the tier carries anything, and there is no oracle for that day.** That is
the honest status: not a survivor of a weak oracle, not a caught mutant, an untested property whose
only distinguishing state is unreachable under the cap. Same shape as last lap's M8 (the host cap has
no in-repo oracle by construction). Named, not laundered.

---

## 7 · §7.2 CLOSED — the two orphaned rustdoc blocks

Both were flagged in my last hand-back and both are fixed.

- **The `librarian_budget()` doc that outlived the function** — 33 lines, including the 20 explaining
  the removal — was rustdoc for `collect_md`, which does neither thing. **Demoted to plain comments
  in place, verbatim**, with a header line saying whose doc they were. The prose is a trace and it
  stays; what stops is its claim to document the walker. (*Mark the carriers; leave the traces.*)
- **The pointer block** describing `librarian_map_pointer()` was attached to `librarian_map_path()`,
  which had its own doc, while the pointer had none. **Moved onto the function it describes.**
- One live figure inside that block — *"a path in a list of 527"* — was made wrong by this change.
  Rewritten to "a list of hundreds", with the old number and the reason kept in a parenthetical. A
  count that moves with a build does not belong in prose beside it.

---

## 8 · WHAT I GOT WRONG IN THIS LAP

1. **The length-comparison branch** (§3) — a fix for a header that misdescribed its delivery, itself
   able to misdescribe its delivery. Caught by my own test in the same turn.
2. **The `- loop/` oracle, twice** (§6.1) — and the second attempt was made *after* writing the
   comment explaining why the first failed.

Both are the same shape and it is this file's recurring one: **a check that looks like it covers the
property and does not.** The only thing that surfaced either was running the mutant.

**Process:** `main.rs` was copied to `scratchpad/main.rs.PRISTINE` before I opened it and to
`main.rs.GOLDEN` before mutation, per last lap's §8 (*a named landmine does not generalise; a backup
does*). Every mutant was applied from the golden and restored to it, md5-verified after each — final
`2671d98558d63a281e7f5264eee285f4`, matching the golden. No mutant is in the tree.

---

## 9 · WHAT THIS DOES NOT ESTABLISH

- **That the seat wakes correctly on it.** Everything here is `cargo test` against the corpus on
  disk. The claim that the librarian's next wake carries eight cards is a claim about a build the
  keeper has not launched, and last lap's own lesson was that the running binary and the repo can
  disagree. **Nothing about this is verified until a librarian opens on it.**
- **That `~/.claude/CLAUDE.md` is injected into the LIBRARIAN seat specifically.** It is injected
  into this pane — verbatim, in my own system prompt, on this machine, under this user — and the
  seats are started by the same launcher. That is strong and it is not the same as having read the
  librarian's own shell. Cheap to check at the next wake: the phrase should appear once, from the
  harness, and not a second time under `## CLAUDE.global.md`.
- **That the byte-identity holds tomorrow.** It is a runtime fact about two files, checked once, at
  03:20 today. The code does not test it — deliberately, per the test's own comment: a test that
  reads the host's file reports on the machine it ran on.
- **That 8 of 12 cards is the right eight** (§2b). It is the first eight alphabetically.
- **Whether `INTAKE_HEADROOM` at 8,000 is still the right reservation** now that the floor fell
  10.3 points. Untouched, unexamined, and it is now the second-largest budgeted thing on the shelf.

---

## 10 · OWED ONWARD

- **The chair:** land `consonance/src-tauri/src/main.rs` with this file beside it, naming the path,
  BRAVO in the body, no push. `brief/BUILDING.md`, `brief/COMMITTEE.md`, `tools/lap-row.js` and
  `tools/lap-row.test.js` are dirty in the same checkout and are **not mine** — CHARLIE's. Name paths.
- **Non-author read: A or C**, per the packet — and the two places worth their attention are §6.1
  (an oracle I repaired myself, which is exactly the thing an author should not be the last word on)
  and §2's three corrections to the packet's arithmetic.
- **The librarian:** §2(b) — the alphabet decides which cards a short budget carries. If that is
  wrong it is a keeper decision, and the leftover line (§4) is now the instrument that would show it
  changing.
- **The chair's WRONG column, if it takes them:** the packet's `240 + 7 = 247` breakdown (§2d), and
  the "~10 of 12 cards" / "~32,395" pair (§2a, §2b).
