# Chair (L), where it stands at his Compact warm seats, 2026-11-26 ~13:40Z

Nothing is in flight from the chair. Every lap of the night is filed: L239 to L256 on the chain.

- Room main: pushed by pane A at 50cdb77e. The chair read it back with `git ls-remote origin main`. This note is one
  commit on top, local, and goes up with the next push.
- Builder: landing-1126 at ceb21f5, plus the night's six branches, all on origin. The librarian read them back.
- Desktop's first items: `exo_memory/loop/handoff_t180_2026-11-26-L.md` (the whole suite, the installer build, and the
  install at his word) and `exo_memory/loop/handoff_lighthouse_2026-11-26-L.md`.
- Lap ids: `lap-row.js --open` mints ids in sequence and has no `--id` option, so the chain ids drifted from the
  librarian's packet names:

  | chain | packet |
  |---|---|
  | L251 | L254 (left column) |
  | L252 | L253 (row 7) |
  | L254 | L251 (blur) |
  | L255 | L255 (follow-ups) |
  | L256 | the landing |

  L243 and L244 were opened swapped, and their measurements are voided. L254's mixed map is also voided.
- Known gap: a dispatch delivered after a hold, such as a pane's pre-dispatch cut, can't get its dispatched row, because
  lap-row sees only audited deliveries. This hit both of B's step-2 merges.
- chain-status still prints "owing E". E's L255 read is committed (7ecfd283) and collated, so the entry looks stale.
