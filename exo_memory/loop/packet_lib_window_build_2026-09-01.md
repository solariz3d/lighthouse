# P-LIB-WINDOW — build the librarian window, rule (a). URGENT: the seat is DOWN.

**Dispatched to CHARLIE, 2026-09-01 ~06:25. Chair-written.**
**You did not author the registration (ALPHA did) and did not attack it (ECHO did). That is why you
have it.**

---

## 0 · WHY THIS IS URGENT AND NOT A TIDY-UP

**The librarian cannot respond to anything.** Its pane returns, to every message including the
keeper's:

    ⎿  Context limit reached · /compact or /clear to continue

Measured, not inferred:

    ls -l C:/Consonance/instances/librarian/CLAUDE.md      ->  1,305,657 bytes
    shelf header, same file line 443:
      "66 file(s) carried in full (1179734 of 2200000 bytes); 450 indexed by path."

It was **1,075,876 carried** earlier tonight. It grew **~104k in one night**, and the 06:11 rebuild
made it worse (1,258,634 -> 1,305,657) because BRAVO's intake cut reached the SIBLING panes only.

**Its own shell predicted this, at `:7008`, in its own words:**
> *"F-GROWTH FIRED — post-compact landings 358k -> 417k -> 501k, +60k/compaction; target 270k never
> reached; the seat's own notes are the growth (carried in full, newest-first). Fix = librarian-tier
> forgetting: carry today+yesterday full, index older."*

That fix is this packet. It was registered, priced, picked by the keeper, and not built — the chair
held it out of the 06:11 rebuild to avoid confounding a UI reading, and the cost was the seat.

## 1 · THE OBJECT — open it, do not take my description of it

    git show c0b2af9        # the keeper's pick, the amendment, and the corrected numbers
    exo_memory/loop/librarian_window_registration_2026-09-01.md    # ALPHA's registration + amendment

**The keeper picked (a) BY DATE.** (b) and (c) are registered as amendment conditions and are NOT
what you build.

## 2 · THE RULE, verbatim from the registration §3

> **(a) BY DATE — today + yesterday, by filename date prefix, machine-local calendar.**
> Carries every `YYYY-MM-DD[.suffix].md` whose date is today or yesterday. Everything older is
> INDEXED (path + line count + first heading), never carried.

**Shared constraints, both from §3 and binding:**
- **Whole files only** — a note is carried entire or indexed entire, **never truncated**
  (`forgetting_registration.md` §2 refuses a cut note).
- **Newest-first by filename date.**
- **`LEDGER.md` + `README.md` are carried OUTSIDE the window** (37,289 bytes today).

**Where it goes:** the shelf tier table at `main.rs:4690-4696`. Today `("librarian", true, true)` —
carried in full, recursive. Note `main.rs:4700`: **named directories are walked RECURSIVELY**, so a
subdirectory does not escape the window; do not solve this by moving files.

## 3 · THE SECOND HALF, and it is the reason this recurred

**The librarian intake has NO test that it fits under any limit.** Compare, from `cargo test`:

    shelf_tests::the_third_place_intake_fits_under_the_limit_it_must_obey        <- a LIMIT
    shelf_tests::the_librarian_intake_size_is_recorded_and_not_silently_doubling <- only RECORDED

So the growth was watched faithfully and never stopped. **Add the missing test**, in the shape of the
Third Place's: the librarian intake must fit under a stated limit, and the test must FAIL if the
window is removed. A test that records a number cannot catch a number getting worse.

## 4 · THE BARS — all four, or it does not land

1. **`shelf header` drops by ~390,968 bytes.** Registration §4 reading (i), re-derived at 06:00 and
   unchanged by the night's growth: `dated 567,176 - carried 176,208 = indexed 390,968`. Today the
   window carries `2026-09-01.md` (87,431) + `2026-08-31.md` (88,777) = **176,208**.
   **This is checkable in seconds and needs no compaction.**
2. **`cargo test --bin consonance` green.** It was **348 passed / 0 failed / 3 ignored** at `a7bec4b`.
3. **Mutation-proven**, reported as `applied N / caught N / NOT APPLIED N`. A NOT APPLIED mutant
   proves nothing. At minimum: remove the window -> red; carry three days instead of two -> red;
   truncate a file instead of indexing it -> red; drop LEDGER/README from the carried set -> red.
4. **The librarian intake fits its new limit**, by the test from §3.

## 5 · WHAT YOU OWN

    consonance/src-tauri/src/main.rs        (the shelf tier + its tests)
    exo_memory/handback/p-lib-window_2026-09-01.md

Nothing else. **Do not commit** — write, test, hand back; the chair commits.

## 6 · PERMISSION TO REFUSE, and it is real

Say so plainly if: rule (a) cannot be built where I have pointed you; the ~390,968 figure does not
re-derive on your machine; the limit test in §3 cannot be written honestly; or **the window is not
what is killing the seat** and I have misdiagnosed it. **"This is wrong, do not build it" is a
complete and welcome answer.** The chair has been wrong twice tonight in the sentence about the work
rather than in the work.

## 7 · THE HAND-BACK

Write it to `exo_memory/handback/p-lib-window_2026-09-01.md`, then ring the librarian with
`call_librarian` carrying **the POINTER and one line of orientation — never the finding**.

**EXCEPTION, stated because it is a real deviation and not an oversight: the librarian is context-dead
and may not receive it.** If `call_librarian` fails or you have reason to think it landed nowhere,
say so in the hand-back and tell the chair directly. **The exception is this lap only, and it exists
because the seat this edge points at is the seat being repaired.**

## 8 · WHAT A HAND-BACK OWES

1. Mutation results as counts, `applied / caught / NOT APPLIED`.
2. Every number re-derivable by a command printed beside it.
3. **What you did NOT verify** — that sentence is worth more than a clean summary.

    OBJECTIVE:  the librarian wakes, answers a message, and its shell header shows the carried
                figure down by ~390,968 bytes with LEDGER/README still present.
    FALSIFIER:  if the window ships and the seat still returns "Context limit reached" on its next
                wake, the shell was not what was killing it and this diagnosis was wrong.
