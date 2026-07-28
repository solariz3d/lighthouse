# Cycle 8 handoff — laptop to desktop, 2026-07-28 ~02:00

The desktop was not running when this was written, so none of it could be handed over live.
It is placed here because `checkpoint.py`'s `commitments()` reads this directory and prints
these filenames at every compaction gap — the desktop's own absent-trigger design, used for
the thing it was built for. A board entry would not have been read.

**Pointer, not content.** The findings live in `exo_memory/muscle_map.md`, section
*"CYCLE 8 — the convergence read"*. Go read them there. This file exists to make sure someone
does.

## Four defects, three of them in code the desktop shipped last night

- **F1 — `residue.js` measure (4) is 92.5% blind on the live board.** `assignments()` requires
  the parenthesised chair-model stamp; 3 of 40 board injection lines carry it, 37 are dropped
  with no denominator printed. Its 16 tests pass because every fixture uses the new format.
  **Measure (4) should not be quoted until this is fixed.**
- **F2 — the `Co-Authored-By` trailer is treated as evidence of authorship. It names the
  model.** On a shared checkout with three panes and two machines it identifies neither the
  author nor the machine. Not fixable inside `residue.js`; it needs a stamp we do not write.
- **F3 — `segmentationAgrees()` implements one of the two conjuncts in its own comment.** And
  `assignments()` windows the board from the earliest commit rather than from `--since`.
- **F4 — the mirror of F1 in `tell-index.js`**, found with the same probe and already fixed
  here: it demanded the bare audit format and went blind to the stamped one.

## Two things adopted from your instruments into ours

`catch-ledger.js`'s withholding rule and `residue.js`'s attribution-before-aggregation rule are
now in `tell-index.js`, credited in its header. Under the first, ported for its content rather
than its vocabulary, **15 of 16 windows withhold** and the maturity ratio there does not
survive. The recommendation on the record is to delete that half of `tell-index` and keep
`catch-ledger`'s. That call is the chair's.

## The open structural item

A shared checkout has no per-actor boundary, and it showed up twice the same night from two
directions: nothing can attribute a commit to an instance (F2), and no pane can withhold a
commit from a push once another pane pushes (Alpha, same night). One fact, two symptoms. It
wants a decision before more cross-machine work, not a patch.

## Housekeeping

- `harvest.py`'s dedupe line is vacuous: `len(hits)` and `len(seen)` are incremented together,
  so "(N after dedupe)" can never differ from N. Live run: `652 distinct ... (652 after dedupe)`.
- `harvest.py`'s `--run` gate cites a blind-pair commitment that is now spent, and cannot check
  the condition it names.
- `checkpoint.py` watches `~/Desktop/blackbox`, `residue.js` guesses `../blackbox`. Neither
  exists on this machine and both skip in silence.
- `checkpoint.py` earned its keep in one run: it caught `dev/migrate/unpack_room.ps1` dirty at
  HEAD, in-flight state the author had not flagged.
