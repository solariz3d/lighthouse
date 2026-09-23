# "Solid" — one decision, one read (for the keeper, 2026-09-23)

*Written by pane E from `loop/solid_registration_2026-09-22.md` (C, D111, filed at `9bd7ce0`, landed `e4f00ef`), and
re-measured on L tonight instead of quoted. E did not write the registration. Every number below has the command
beside it that produced it.*

## What "solid" means

**The tests pass on both machines, moving between machines loses and garbles nothing for a whole week, and keeping
seats warm doesn't push us over the weekly usage limit.** (The registration's three criteria, `:13–19`.)

## What saying yes commits the room to

- **The word "solid" may only be used as a claim when all three have a reading.** Until then it is "not yet measured",
  never "passed" (`:137–140`, `:154–155`).
- **The three checks get run and their results written down:**
  1. the test suites on both machines, at the same commit;
  2. the trip checker;
  3. a usage reader, which does not exist.
- **The registration does NOT say who runs them or how often.** That is a gap, and it matters: without a named owner a
  standard quietly stops being checked. The natural fit is the librarian, at every machine switch, because that is when
  trips happen and it already re-checks everything the room lands. This is my suggestion, not the registration's.
- **A deadline is already written in** (`:164–172`): by **2026-10-22**, if the word is in use while a criterion still has
  no instrument, the line of work counts as going nowhere, and an unmeasurable criterion must be dropped rather than
  carried as a pass.

## What can be measured today — and what can't

| | criterion | today | backed by |
|---|---|---|---|
| **1** | **tests pass on both machines** | **measurable. L tonight is NOT green, by one file:** JS **122 passed · 1 failed** (+1 expected-red check, of 124); Rust **925 passed · 0 failed**. The one failure is a test fixture's placeholder path (`trip-check.test.js:34`, `'C:/nowhere'`) that the portable-paths check hasn't been told is harmless, not a fault in the app. But the registration counts any failed file (`:63`). **D's last reading is 119/0 JS and 870/0 Rust at `9bd7ce0` (09-22)**: from before tonight's work, and not re-runnable from L | `node consonance/tools/js-suite.js` · `cargo test --bin consonance -- --test-threads=1` (L, `99bfcda`) · `node consonance/tools/portable-paths.js` names the site |
| **2** | **a week of clean machine trips** | **measurable since the registration was written.** It said "no instrument" (`:18`, `:77`), but the trip checker was built the next lap (C, D112, `0b8e84f`). **L tonight: 11 trips in 7 days, 11 clean, 0 bad, but "clean week: false"**, because only **2** of the 7 days had a trip | `node consonance/tools/trip-check.js --report` |
| **3** | **usage under the weekly limit, with keep-warm on** | **not measurable. No instrument, and none is planned.** Searching the code finds only the word "quotation", 6 times | `grep -rlniE "ccusage\|weekly limit\|usage limit\|quota" consonance/tools/*.js consonance/hooks/*.js consonance/src-tauri/src/*.rs dev/*.js` |

**What criterion 3 would need, and how big a job that is:** the **used** side looks like about one lap of work (my
estimate, not measured) — every call's token counts are already written into the local transcripts. **The limit** side is the unknown. **Nothing on this machine holds the
weekly limit itself**, so either the tool would have to read it from the account, which I have not checked is
possible, or you would type it in. **Until someone finds out which, criterion 3 cannot be built, and "solid" cannot
be declared.**

## Two places where the registration is honestly ambiguous — each changes the answer

- **"The tests" — the two named suites, or every test target?** The registration leaves this for you (`:47–59`). The
  one extra target is `arch_test`: **13 passed · 0 failed on L tonight** (`cargo test --test arch_test`, `99bfcda`).
  It was red on both machines when the registration was written; A repaired it the next lap. **Today the choice
  changes nothing**, since `arch_test` is green. It matters the next time `arch_test` goes red on its own.
- **"A clean week" — a trip every day, or no bad trip for seven days?** The registration says *"seven consecutive
  days in which every trip row shows nothing lost"* (`:98`), which fits either reading. **The checker, as built,
  takes the strict one:** a week is clean only with a clean trip on each of 7 separate days (`trip-check.js:184`,
  `days.size >= 7`). **Trips only happen when you switch machines**, so under that reading the answer can stay "no"
  forever **even if nothing ever goes wrong.** Under the other reading, **tonight's record would already read clean**:
  0 bad trips in 7 days. **But most launches leave no trip row at all.** Each launch overwrites the last launch's
  record, so only the latest install survives (C, D112, `handback/p-d112-tripcheck-C_2026-09-22.md` §5 item 2). So
  "no bad trip seen" is partly "no trip seen". **Neither reading is honest until every launch leaves a row**, and that
  is a fix to `state-sync.js`, not something to settle by choosing a wording.

## If you say no, or not yet

**Nothing breaks.** The test suites and the trip checker keep existing and keep working. The registration stays on
file as a draft. The only difference is that nobody uses "solid" as a claim. The 2026-10-22 clause only bites if the
word is in use, so "not yet" costs nothing.

## The one question

> **Should "solid" mean these three things, with the usage one counted as "not yet measured" until someone builds a
> way to read it?**  **yes / no / not yet**
>
> *Only if yes, two small choices:*
> **(a)** "the tests" = **the two named suites**, or **every test target** (which adds `arch_test`)?
> **(b)** "a clean week" = **a clean trip on each of seven days** (the checker as built), or **seven days with no bad
> trip** (days without a trip don't count against it)?

## THE KEEPER'S ANSWER — 2026-09-23 ~02:5x, on L (AskUserQuestion in the librarian's seat)
**Yes.** (a) "the tests" = **every test target** (the two named suites plus `arch_test`). (b) "a clean week" = **seven days
with no bad trip** (days without a trip don't count against it). The librarian runs the checks at every machine
switch. Criterion 3 (usage) stays **not yet measured**; the 2026-10-22 clause applies. Owed so that (b) is honest: every
launch leaves a trip row (`state-sync.js`, C's D112 §5 item 2), and `trip-check.js:184`'s `days.size >= 7` is changed to
the reading the keeper chose. **Right now L is not solid on criterion 1:** JS 122/1 (the `portable-paths` red), being
fixed in L089.
