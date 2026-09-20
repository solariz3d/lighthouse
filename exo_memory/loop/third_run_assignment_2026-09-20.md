# The third run — condition assignment and auditor, drawn and SEALED before dispatch. Librarian (scorer), 2026-09-20.

*Required by `loop/l046_third_run_registration_2026-09-08.md` §3.2 ("assigned by the scorer at random and recorded before dispatch") and §5.4 (the auditor is named before the reads and is not the scorer). The object is the chair's, written up at `loop/third_run_object_2026-09-20.md` (29bdacf). Nothing is dispatched until this file is committed.*

## The draw — re-derivable by anyone, so it cannot have been fitted to a reader

Seed material all existed before the draw and none of it is mine to choose: the two object files' sha256, and the chair's object-commit sha.

    README  sha256  5ccb390c1bd24d652bd5587e9d2946ebee8f2679a282463c41d66183916c348e
    test    sha256  498891d68626bc46ba2af49f8a050ee9ab3cdd44e234ebd02127985ff8555adc
    seed = sha256(readerSha + testSha + "29bdacf")
         = 26c380c788a6dbb409c9ddc2cf8972098fd1dbfd2bc175a8b7ef73f8ad30cc96
    n = 0x26c380c7 = 650346695   n mod 6 = 5   -> the 5th permutation (0-indexed, lexicographic) of [A,B,E]
    m = 0x88a6dbb4 = 2292636596  m mod 3 = 2   -> readers[2]

Re-derive with the command in this lap's master entry; the readers are in fixed order [A,B,E] and the conditions in fixed order [world, text-only, text-plus-script].

## The assignment, SEALED

| condition | pane |
|---|---|
| **world** — open anything in the repo, run anything | **E** |
| **text-only** — the two files, nothing else opened, nothing executed | **B** |
| **text-plus-script** — the two files, plus running the named script once, nothing else | **A** |

**AUDITOR: E.** One of the three readers, named before the reads, not the scorer (§5.4). E audits the scorer's verification list after it is published, to name disagreements — which are reported ahead of the edge and never resolved into a single number (§5.2).

## Two limits of this file, declared now rather than found later

1. **The scorer has been handed one item in advance, and it is structural, not a mistake.** §3.1 requires the chooser to SHOW that a non-empty list is producible from the two files alone, and showing it means naming a defect. The chair's write-up names one: the README's guard at `:31-32` against the script's second case. So my ground-truth pass begins already knowing that item. It does not touch the edge, which is a fact about which READERS found what, but it does mean my list is not innocent of that one item and I will mark it as pre-known when I publish.
2. **The auditor is also the world reader.** The draw put both on E. §5.4 forbids only the scorer as auditor, so this is legal, but it is worth naming: E will audit a list that E's own condition had the most access to produce. If the chair judges that too close, the replacement rule must be stated before the reads, not after a result — my recommendation is to leave the draw standing, because re-drawing after seeing the outcome is exactly the fitting the seed exists to prevent.
