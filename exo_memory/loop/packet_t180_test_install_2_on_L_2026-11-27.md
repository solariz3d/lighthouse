# Packet (on L; the landing role of the first test install): a second test build on L, with the three fixes the reads found

**His words,** 2026-11-27 04:04 on L: "lemme know when it is ready for me to test" (verbatim in
`briefs/t180_unmakeable_shapes.md`). Before it the librarian had told him three times that a second build "still needs your
word" and what it would carry. Read by the librarian, and told to him, as: yes, build and install it when it is read, and
tell me. One install on L. Not a release, not a merge to the builder's `main`.

## What goes in, on top of the build installed now

Installed on L: `landing-1127-l262` 537a0c9 (exe sha256 69462996…2cd7; backup `.before-l262-f3cd425`).
1. `l-bankcarry-a` **e7b9128**: Sculpt's bank handle carries past ±720 (one commit on 7b3926e). Read CLEAN
   (`handback/p-l260-read-sculpt-carry-E_2026-11-27.md`, its last section). Local; origin 7b3926e.
2. `d677-right-width-b` **de6c069**: the SPLIT_HEAD words (8b7cafc) and the way back on a non-round width (de6c069), two
   commits on e4e7ecc. 8b7cafc was read NOT CLEAN on its words (F2), which de6c069 answers; **the read of 8b7cafc..de6c069
   is not in yet.** Local; origin e4e7ecc.

## Now: prepare, build nothing

- A trial merge of the two tips onto 537a0c9 in your own worktree, and the touched set by your L262 rule. The librarian's
  `git merge-tree` of origin's `landing-1127-l262` with `l-bankcarry-a` gave a tree and no conflict; expect `MAP.md` again
  with the right width (both of its commits touch that line's neighbourhood). Redo it; do not rely on this sentence.
- Your whole suite on 537a0c9 is still in slot 1. Let it end and report it; do not cut it short for this.

## The gate

The librarian rings go when the read of 8b7cafc..de6c069 is in and is not NOT CLEAN on the code. If it is, the right width
goes in at e4e7ecc as installed now (nothing new of it), the bank fix goes in alone, and the librarian tells him first.

## Then, as L262 did (`handback/p-l262-test-install-P_2026-11-27.md`, sections 5.1 to 5.6)

1. Merge on a branch named for this landing; push it and the two source branches; no push to `main`.
2. Tier before the install: the merged tree's touched set, the bank-carry and right-width harnesses, and every mutation
   harness that names a merged file; all green, 0 NOT APPLIED. Match verdicts, not text (your L262 correction).
   **The whole suite is not run again for this install**: it ran on 537a0c9, and this adds three small commits whose
   touched rows are in the tier. It runs once more at the landing that goes to `main`.
3. **No build while his T-180 app runs.** Checked by the librarian at 04:05: not running. Check again; if it runs, stop and
   say so. He is testing tonight, so this is the likeliest stop; the librarian will ask him to close it.
4. Back up the installed exe (a new name; keep `.before-l262-f3cd425`), install, re-hash, do not launch.
5. **His saved files:** each parses and saves the same as on 537a0c9, the build installed now. The comparison is against
   that build, not against the file's own text (your L262 section 5.6).
6. The hand-back gives him what is new to try, one line each: the bank handle past two turns by drag, wheel and arrows; a
   saved piece at a head with its own right width (the new words); the right width typed back to the width after a width
   brush.

Hand-back to the librarian by `call_librarian`, claims marked checked or inferred.
