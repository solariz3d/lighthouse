# P-CORPUS-AGE RUNTIME + `.py` INTO THE RATCHET. L043.

**To BRAVO, 2026-09-07 ~03:40. Dev only. Two small items, one file each.**

## 1 · `corpus-age.test.js` IS NOT CRASHING — it is too slow, and it worsens on its own

**142.9 seconds against `js-suite`'s 120-second bound.** It is GREEN and it exceeds the bound, so the
suite reports a passing test as a failure.

**The part that matters: it scans `exo_memory/loop/`, which grows every lap.** 214 files and rising —
this packet alone adds four. **The bound is fixed and the corpus is not**, so this gets worse with no
code change and will take the suite down on a busy night.

**Two honest routes, and the choice plus the reason is yours:**

    INDEX THE SCAN   so the cost stops tracking corpus size. Then say what the index costs to
                     maintain and what happens when it goes stale — a stale index that reads fresh
                     is this room's most-repeated failure, and you have found three of them.
    RAISE THE BOUND  with the REASON PRINTED. A bound raised silently is a bound that will be
                     raised silently again. If you raise it, the suite says why at the moment it
                     applies it.

**Do not "fix" it by touching the test's assertions.** It passes. The runtime is the defect.

## 2 · `.py` INTO THE RATCHET

`portable-paths.js` covers `.js`, `.rs`, `.ps1` — **not `.py`.** `userprompt_pulse.py` is installed
and running on this machine and has never been in scope for the machine-path ratchet.

**RED FIRST: put a machine path in a `.py` fixture and watch the ratchet stay GREEN.** That is the
proof the gap is real — and it is the same shape as A's `cite-check` false-green this lap: **a guard
whose universe silently excludes a live file type.**

Then extend scope and **report what the first run finds, as a LIST.** If it finds nothing, say so —
a clean first pass over newly covered files is a real result, not a wasted packet.

## 3 · WHY YOU — the dossier row

`librarian/DOSSIER.md`, B: the arithmetic and self-limiting design — and **twice you have ruled that
something should not exist rather than making a number look better**: shape (c) on this very tool,
and the dirty-tree refusal's override boundary. §1 is that judgement again. **An index and a raised
bound are not equally honest, and you are the seat that says which.**

**And you killed L039's three-arm design on arithmetic four hours ago.** Same instinct, smaller
stakes.

## 4 · BARS

    1  §1: state the measured runtime BEFORE and AFTER, with the command that produced each.
    2  §1: if you raise the bound, the suite prints the reason at the moment it applies it.
    3  §2: RED FIRST — the ratchet must be SHOWN blind to a .py machine path before it is fixed.
    4  §2: report the first run as a LIST, including an empty one.
    5  node consonance/tools/js-suite.js — state the count and what moved.

## 5 · WHAT YOU OWN

    consonance/tools/corpus-age.js
    consonance/tools/corpus-age.test.js
    consonance/tools/js-suite.js          (the bound, only if you raise it)
    consonance/tools/portable-paths.js
    consonance/tools/portable-paths.test.js
    exo_memory/handback/p-corpusage-ratchet_2026-09-07.md
    exo_memory/map/B.md

**A holds `cite-check.*`. C holds `main.rs`. E delivers a patch file only.** **Do not commit.**

## 6 · PERMISSION TO REFUSE

If indexing costs more than it saves at this corpus size, say so and raise the bound with its reason.
**That is the honest answer, not the lazy one** — the difference is entirely whether the reason gets
printed.

## 7 · HAND-BACK

`exo_memory/handback/p-corpusage-ratchet_2026-09-07.md`, then `call_librarian` with that path in the
same turn. One line to `exo_memory/map/B.md`.

    OBJECTIVE:  the suite does not fail a passing test because the corpus grew, and a machine path
                in a .py file cannot ship unseen.
    FALSIFIER:  the runtime crosses the bound again within ten laps, or a .py machine path passes
                the ratchet after this.
