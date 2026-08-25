# Desktop observations — 2026-08-25, from the desktop

**What this is:** what a second machine sees. **Observations only.** No fixes proposed, no causes
inferred beyond what a command printed. Every claim has the command that produces it; re-derive
rather than trust this file.

**The tree is untouched.** This file is the only addition.

---

# ROUND 1 — against `683d468` · RESOLVED

Both gates were red here and green on the laptop. Root cause found and fixed by the laptop in
`0f4296b`: `room_brief()`'s last two tiers were `C:\Consonance\lighthouse\…` and
`%HOME%\OneDrive\Desktop\projects\lighthouse\…`, neither of which exists on this machine.

**Re-verified against `afed6e0`:**

```
node consonance/tools/js-suite.js     EXIT 0    61 green · 0 failed · 1 not-run  (of 62)
cargo test --quiet                    EXIT 0    318 passed · 0 failed
node -e "…lap-row.js').mintId([])"    -> D001   (correct — the mint was never the defect)
```

The fix derives from `repo_root()` rather than adding this desktop's path, which was the outcome I
most wanted to rule out. The `1 not-run` is honest: declared MACHINE-BOUND, and the runner re-runs
it under `JS_SUITE_UNIVERSE=force` to prove a NOT-RUN cannot hide a green.

**And the laptop answered the question §6 left open:** the two literals were **invisible, not
exempted** — `portable-paths` matches a portable prefix and a machine segment *on one line*, and
that `format!` split them across two.

*Also from round 1, still standing:* `cargo` is not on the Git-Bash PATH here. `cargo test` returns
**127 = command not found**, which is not a test failure. `export PATH="$HOME/.cargo/bin:$PATH"`
first. I nearly filed the 127 as a red suite.

---

# ROUND 2 — against `a48f2bf` · THE INTAKE SIZES

## What is measured

```
for d in /c/Consonance/instances/*/; do wc -c < "$d/CLAUDE.md"; done

  librarian      869,063 bytes      BOOT copies: 2
  third-place    212,874 bytes      BOOT copies: 1
  sibling-*      ~139,000 bytes     (SHELL_SOFT_CEILING is 140_000 — binding correctly)
  main            80,863 bytes
```

## Third place — ALREADY FIXED IN CODE, and the file on disk is pre-fix

`3a4c58b` establishes `INTAKE_LIMIT = 150_000` with `INTAKE_HEADROOM = 8_000` and bounds
`third_place_shelf()`. The 212,874 bytes I measured is the intake written at **10:54 before that
fix**; it will not shrink until the seat is re-opened. **Nothing to do here — recorded only so the
number is not re-reported as live.**

## Librarian — the same defect, larger, and NOT covered by that fix

`INTAKE_LIMIT` appears at `main.rs:4320, 4347, 7421-7425`. Every one of those sites is
`third_place_shelf` or its test. **`librarian_intake()` at `:4606` is bounded by nothing of the
kind.** It reads its brief, appends `room_master_path()`, then appends `corpus_shelf()` and returns.

The only bound on the librarian is `librarian_budget()` at `:4456`:

```rust
.unwrap_or(2_200_000)
```

**2.2 MB.** Measured shelf: **789,938 bytes** — comfortably inside that budget, and:

| figure | source | observed |
|---|---|---|
| ~48.7k at wake | `handoff_2026-08-22.md`, "the shelf is tiered" | **789,938** |
| safe at 200k | same | exceeded 3.9× |
| ~510k full corpus | same, "must not be enabled until that number comes from the pane's own gauge" | exceeded 1.5× |
| 150,000 | `INTAKE_LIMIT`, `3a4c58b` | exceeded 5.8× (whole file 869,063) |

Split:

```
head -420 CLAUDE.md | wc -c    ->  79,125   brief + room
tail -n +421      | wc -c      -> 789,938   the shelf
```

## BOOT.md is carried twice in the librarian intake

```
grep -n '^# BOOT — the room you wake into' CLAUDE.md
  251:    (as "# THE ROOM you are holding")
  587:    (again, inside "# THE SHELF", as "## BOOT.md")

awk 'NR>=585 && NR<755' CLAUDE.md | wc -c   ->  63,862 bytes
```

`librarian_intake()` appends `room_master_path()` explicitly and then `corpus_shelf()` walks the
corpus, which includes BOOT. **Neither knows about the other.** 63,862 bytes of exact duplication,
~7% of the file, carrying no information the reader does not already have three hundred lines up.

## The shape, in the laptop's own words

`3a4c58b` states the lesson and it applies unchanged to the seat it did not fix:

> *every existing test asked whether the intake CONTAINED the right things — the brief, the room,
> the shelf header, the split. NONE ASKED HOW BIG IT WAS. The one property that decides whether the
> seat can open at all was the one property nothing measured.*

`grep -n "librarian" main.rs | grep -iE "len\(\)|limit|bytes|size"` returns **no size assertion**.

---

# WHAT I COULD NOT DETERMINE

Listed because absence of a finding is not a finding.

1. **Whether the librarian actually fails to open at 869 KB, or merely warns.** I measured the file
   on disk. I did not open the seat and I did not find a host-side refusal for this path the way
   `3a4c58b` describes one for the Third Place.
2. **Whether `2_200_000` is deliberate.** `:4514` cites a librarian note — *"1,995,532 bytes cost
   679,449 tokens"* — so a figure near 2 MB was measured for something. I did not establish whether
   that measurement was meant to license this budget.
3. **Whether the duplication is new.** I did not date it.
4. **Anything about the other ~100 commits.** I ran gates and measured intakes. I did not review
   the work.

---

# A CORRECTION FROM ROUND 1, KEPT

I first told the keeper *"the app can't find its own briefs on this machine."* That was wider than
what I checked and I withdrew it: `target/release/` carries `COMMITTEE.md` and `LIBRARIAN.md` as
bundled resources, so tiers 1–2 had something to resolve at runtime. What I could demonstrate was
nine failing **tests**. I never launched the app.

---

**Written by the desktop instance. Nothing above is a proposed fix. The seat that wrote this work
knows why it is shaped the way it is; I am reporting what a second machine measures.**
