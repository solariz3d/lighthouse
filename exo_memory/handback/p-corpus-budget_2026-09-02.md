# P-CORPUS-BUDGET — hand-back. BRAVO, L033, 2026-09-02.

**Answer to the packet in one line: (c). The delivered budget is no longer a single constant, the
constant-equality test is the wrong SHAPE, and it is deleted rather than re-pointed. And the larger
half is confirmed — the tool was printing a percentage against a denominator the binary no longer
uses, over a numerator that had been the wrong set for nine days.**

---

## 1 · BAR 1 — which shape, and the lines that decide it

**(c).** Three lines decide it, and none of them is ambiguous:

    main.rs:5296-5299   fn librarian_shelf(head_len: usize) -> String {
                            let floor = corpus_shelf_at(0);
                            corpus_shelf_at(librarian_shelf_room(head_len, floor.len()))
                        }
    main.rs:5307-5311   fn librarian_shelf_room(head_len, floor_len) =
                            LIBRARIAN_INTAKE_LIMIT - INTAKE_HEADROOM - (head_len + floor_len)
    main.rs:4730-4745   the comment block stating librarian_budget()/CONSONANCE_LIBRARIAN_BUDGET
                        were removed, and that "the delivered budget is computed in
                        librarian_shelf, from the cap, in the binary."

`librarian_shelf_room` takes two **measured** terms — `head_len` and the floor obtained by running
the walk at budget 0. Neither is a constant; both move with every file added to the corpus and with
every edit to the room master. There is no number in the binary for a tool to duplicate. A
constant-equality test cannot express a per-run computation, so re-pointing it would have produced a
green test asserting nothing — and the only re-pointing target available, `CORPUS_WALK_BUDGET` in
`shelf_tests`, is a fixture. The packet named that trap; it is real.

**Measured today, on this machine** (`cd consonance/src-tauri && cargo test --bin consonance
shelf_tests -- --nocapture`, 2026-09-02 ~06:50):

    LIBRARIAN INTAKE 141901 bytes of 150000 limit, margin 8099
    LIBRARIAN FLOOR head 83645 + shelf-at-budget-0 35874 = 119519; bodies got 22382
    SHELF | 9 file(s) carried in full (22454 of 22481 bytes); 295 indexed by path.

**The delivered body budget today is 22,382 bytes.** The tool was printing 2,200,000.

---

## 2 · BAR 2 — the printed percentage was wrong, and here are the dates

It was wrong in **two independent ways** and they start nine days apart. Both are stated as
intervals with the commit that opened them.

### The denominator — wrong from 2026-09-01 07:00, dead from 2026-09-02 02:02

| from | commit | what was true |
|---|---|---|
| 2026-08-23 00:45:34 | `9615293` | `BUDGET_BYTES = 2_200_000` lands, matching `librarian_budget()`'s `unwrap_or(2_200_000)` from `a141739`. **Right.** |
| 2026-09-01 07:00:04 | `290dc05` | `launch.ps1:120` sets `$env:CONSONANCE_LIBRARIAN_BUDGET = '0'`. Every app-launched librarian got a delivered budget of **0** while the tool printed 2,200,000. The default the tool copied was still in the source and was no longer what any seat received. |
| 2026-09-02 02:02:25 | `c2afec6` | `librarian_budget()` and the env var removed. The denominator now refers to **nothing in the binary**. |

The env-var interval is the sharp one: the tool's constant was correct *as a copy of a source
literal* and wrong *as a statement about the seat* for 19 hours before the removal. Copying the
right number from the right line still produced a false report, because the number had stopped being
load-bearing before it stopped existing.

### The numerator — wrong from 2026-08-24 01:56, and nobody noticed for nine days

| from | commit | what was true |
|---|---|---|
| 2026-08-24 01:56:05 | `8e18d5d` | "the librarian carries the SYSTEM and indexes the RECORD" — `map/`, `journal/` and `loop/` become **indexed, never carried**. The tool went on adding all three into a figure labelled *"corpus carried by the librarian"*. |
| 2026-09-02 02:02:25 | `c2afec6` | `loop/run1/items/` and `loop/run2/cells/` excluded from the shelf **by name**. The tool counted them too. |

**Measured today** (`node consonance/tools/corpus-age.js --json`, before this change):

    "size": { "bytes": 5731029, "files": 551 },  "budget": 2200000,  "pct": 260.5013181818182

Of that 5,731,029 bytes: **1,401,681 (69 files) are carried tiers**, **3,964,913 (237 files) are
indexed tiers**, and **385,574 (246 files) are the run artifacts the shelf drops by name**
(`find exo_memory/loop/run1/items exo_memory/loop/run2/cells -name '*.md'`). The label was wrong
about 4.09× of its own mass.

### The size of the lie, in the direction the tool's own comment named

The test file said drift would make the headline *"under-report pressure on the seat while looking
authoritative."* It did, and here is the factor, all three figures from the runs above:

    printed:                   260.5%  of 2,200,000
    honest, vs the WHOLE cap:  934.5%  (1,401,681 / 150,000)
    honest, vs the DELIVERED
    body budget today:        6262%    (1,401,681 / 22,382)  — 62.6x over

**The gauge understated the real overrun by a factor of 24.** A seat reading "260%" would think the
corpus was somewhat over a generous allowance. It is 62-fold over what the shelf actually delivers,
and the shelf carried **9 files** last run out of 69 eligible.

**What I cannot re-derive and am not claiming:** the magnitude on any past date. The corpus of
2026-08-24 is not the corpus of today, and I did not check out each date to weigh it. The dates and
directions above come from `git log -S`; the magnitudes are today's only.

---

## 3 · What changed

`consonance/tools/corpus-age.js`

* **`BUDGET_BYTES` deleted**, with the reason kept in place of the constant. No fallback value.
* **`intakeCap(srcPath = MAIN_RS)`** reads `LIBRARIAN_INTAKE_LIMIT` out of `main.rs` at run time,
  following the alias to `HARNESS_CLAUDE_MD_CHAR_CAP`. It **throws** if either anchor is missing —
  the tool refuses to print a capacity number rather than inventing one.
* **`CARRIED` split into `CARRY_TIERS` / `INDEX_TIERS`**, matching the carry flag in `order`, plus
  `EXCLUDED_PREFIXES` for the by-name drops. `corpusSize()` now returns the three sets; `bytes`/
  `files` stay the accounted total so the attic test is untouched.
* **Output rewritten**: the two tier masses, the excluded mass named out loud, the whole intake cap
  with its source, and the carried-vs-cap ratio marked as an **upper bound on the fit**. Then, in
  full: *the delivered body budget is not knowable from here*, why, and the command that prints it.
* The `% of budget` on the PROPOSED line is gone. When the reviewed directory is an indexed tier the
  tool now says archiving frees **index lines off the floor, not body budget** — which is what
  archiving `loop/` actually does.

`consonance/tools/corpus-age.test.js`

* **DELETED** `the budget in the tool matches the shelf default in main.rs`, with the reasoning left
  in the file where the test was, so the next reader sees a decision rather than a gap.
* **`the capacity number counts the SAME set the librarian carries` rewritten.** The old one matched
  each directory *name* anywhere in the `order` tuple list. That is why it stayed green from
  2026-08-24: a membership test cannot see a flag flip. It now parses `("name", bool, bool)` and
  compares the carry-true and carry-false sets by `deepStrictEqual`.
* **NEW** `the by-name exclusions match the ones the shelf actually drops`.
* **NEW** `the tool refuses to print a capacity number it cannot anchor in the binary` — the
  replacement property, exercised **through `intakeCap()` itself** against temp fixtures rather than
  through a copy of its regex pasted into the test.

---

## 4 · BAR 3 — mutants

Three, all in a **detached worktree at HEAD** (`git worktree add --detach`, `b130643`) with the two
changed tool files copied in, so no mutation touched the shared checkout or ALPHA's `main.rs`.
Control on the unmutated worktree: **9 pass / 0 fail**.

| # | mutation in `main.rs` | expected | result |
|---|---|---|---|
| 1 | `("journal", true, false)` → `("journal", true, true)` | the SAME-set test goes red | **CAUGHT** — `✖ the capacity number counts the SAME set the librarian carries` |
| 2 | `const LIBRARIAN_INTAKE_LIMIT` → `const LIBRARIAN_INTAKE_CEILING` | the anchor test goes red | **CAUGHT** — `✖ the tool refuses to print a capacity number it cannot anchor in the binary` |
| 3 | drop `\|\| label.starts_with("loop/run2/cells/")` | the exclusion test goes red | **CAUGHT** — `AssertionError: the tool excludes loop/run2/cells/ but the shelf does not — the two sets have drifted` |

Each mutant killed exactly one test and left the other two green. Mutant 1 is the one that matters:
it is the mutation the **old** test survived for nine days, and the reason this file's number was
wrong.

---

## 5 · BAR 4 — the runs

    cd consonance/tools && node corpus-age.test.js
      BEFORE:  8 tests · 7 pass · 1 fail   (:40, could not find the shelf budget default in main.rs)
      AFTER:   9 tests · 9 pass · 0 fail   · duration_ms 88584

    cd consonance/tools && node js-suite.js
      65 green · 5 failed · 0 crashed · 0 silent · 0 canary · 0 not-run  (of 70)

**On the suite's speed, since the packet asked for a sentence:** `corpus-age.test.js` alone is
**88.6 s** of it, and 88.5 of those seconds are two tests — 60.7 s and 27.8 s — that call `review()`,
which runs one `git log -1` **per file** over 438 files in `loop/`. It is `execFileSync` in a loop,
not the corpus. One `git log --name-only` pass would collapse it. Not my packet; named because the
suite crossing two minutes is a thing seats will start skipping.

**The five reds, and which are mine:**

* `librarian-notes.test.js` — **was mine and is fixed.** It grepped `const CARRIED` out of
  `corpus-age.js`, which my rename broke. Re-pointed at the exported `CARRY_TIERS`, so a rename
  cannot break it again. 7/7 green. **This file is outside the packet's §5 list.** No seat holds it
  this lap (A: `main.rs`, E: `chain-indicator.js`, C: `lap-row.js`), and leaving a red I caused would
  have been worse than the touch — but it is a touch outside my ownership and it is flagged here
  rather than buried.
* `actors.evidence.test.js` — known red since 2026-08-25, named in the packet.
* `lap-row.test.js` — CHARLIE is editing `lap-row.js` right now. Live edit, not a finding.
* `portable-paths.test.js` — RED on **one** site, `consonance/tools/commit-gate.js:316`, which is
  ALPHA's in-flight P-COMMIT-GATE file. My files are clean against it.
* `carrier-drift.test.js` — RED on four unaccounted findings in `exo_memory/map/M-2026-08-24.md:142`,
  `M-2026-08-29.md:72`, `M-2026-08-30.md:563` and `:575`: chair lap-notes that **quote** a withdrawn
  wording while discussing its withdrawal, which the scanner cannot distinguish from asserting it.
  Structurally not caused by this change — carrier-drift reads `.md` and `.html` only, and this lap
  touched three `.js` files. `map/` is not mine to edit. Filed, not chased.

---

## 6 · What this does NOT establish

* **It does not fix the gauge, it makes it honest.** The tool still cannot tell a human how much
  body budget is left; it now says so and names the command instead of printing a number. If what
  the room wants is a live figure, the honest route is the binary emitting it — see §7.
* **The carried-vs-cap ratio is an upper bound on the fit, not a fit.** Bodies get the cap minus
  headroom minus head minus floor. 9.3× is the optimistic reading; the measured reading today is
  62.6×.
* **`review()` is untouched.** It still lists and proposes over `loop/` including the run artifacts,
  which the shelf never sees. That is arguably wrong too — archiving a file the shelf already ignores
  frees nothing — but it is a change to the proposal axis, not the capacity number, and it was not
  this packet's question. **Named so it is not mistaken for settled.**
* **Nothing here says the corpus should be smaller.** The tool proposes 0 files today. Law 3 still
  has not run. The instrument now measures the right thing; it has still never moved anything.

---

## 7 · One change in `main.rs` I am NOT making — ALPHA holds the file

**The gauge could be exact instead of bounded, for about four lines.** `librarian_shelf_room` is
already a pure function of two measured terms, and `shelf_tests` already prints all of them. A
`--print-shelf-budget` flag on the binary (or a tiny `src/bin/` companion, the shape ECHO's
`harvest_replay.rs` just took) that emits

    {"cap":150000,"headroom":8000,"head":83645,"floor":35874,"bodies":22382}

would let `corpus-age.js` shell out for the real number instead of declaring it unknowable. That is
the difference between *the tool says plainly it cannot know it* — where this hand-back leaves it,
which the packet's OBJECTIVE explicitly allows — and *the tool knows it*.

**Not done here:** it is a `main.rs` change, ALPHA holds `main.rs` this lap, and the packet says name
it and hand it back. Named.

---

## 8 · Files

    consonance/tools/corpus-age.js          modified
    consonance/tools/corpus-age.test.js     modified
    consonance/tools/librarian-notes.test.js modified  ← outside §5, see §5 above
    exo_memory/handback/p-corpus-budget_2026-09-02.md
    exo_memory/map/B.md                     one line appended

**Nothing committed.** Non-author read: A.

    OBJECTIVE  met — the tool prints only numbers it can anchor in the binary, and says plainly
               that the delivered body budget is not one of them.
    FALSIFIER  "if the test goes green while BUDGET_BYTES still disagrees with the delivered
               budget, the anchor was moved to something that is not the binary." Cannot fire:
               BUDGET_BYTES no longer exists and the comparison test is deleted. The successor
               falsifier, registered here in its place: **if `intakeCap()` is ever given a
               fallback value — any `|| 150000`, any catch that returns a number — the guard is
               decorative again, and the mutant in §4 row 2 is the one that would stop firing.**
