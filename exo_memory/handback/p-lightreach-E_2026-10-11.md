# p-lightreach-E · D297 part 4 (ledger D298): what light mode costs in reach · pane E, on D, 2026-10-11 · MEASURE ONLY, no verdict on the mode

Plan: `exo_memory/loop/plan_retrieval_next_d297_2026-10-11.md`, part 4 (main `5d5740b4`). I read only its parts list (`:1-28`). I read no seat's view on
light vs strict before or after these numbers.
**Result: lighthouse `1452aea4` on `5d5740b4`, branch `d297-e`, worktree `G:\worktrees\e-d297-wt`. Not pushed. Only the evidence folder
`exo_memory/handback/p-lightreach-E_2026-10-11_evidence/` is added; no repo code changed.** Each run went under the heavy-run lock, through main's
`heavy-run.js` by absolute path.

## Inputs (the as-dumped G: copies, not the committed CRLF-normalised ones)
- **corpus:** `G:/consonance-scratch/c-d296/snap`, C's D296 tar snapshot, third_place excluded: 2,105 `.md`, 342,732 lines.
- **light shelf:** `G:/consonance-scratch/c-d296/new2/librarian.light.md`, sha256 `98a71bc3b0e37c48…`.
- **strict shelf:** `G:/consonance-scratch/c-d296/new2/librarian.strict.md`, sha256 `5a846d091d6584d5…`.

## The numbers
`node lightreach.js --exo G:/consonance-scratch/c-d296/snap --shelf G:/consonance-scratch/c-d296/new2/librarian.<form>.md --form <form> --out out/<form>.json`
(outputs: `out/strict.json` sha256 `cb1ed98d0f0f227e…`, `out/light.json` sha256 `9fa7bcbbcfdc71d4…`)

**reach.js's unit (by file: in context = BOOT + carried in full; reachable = that + the files named by path):**

| | strict `new2` | light `new2` |
|---|---:|---:|
| carried in full | 15 files | 14 files |
| named by path | 412 files | 1 file (`librarian/LEDGER.md`, the note that did not fit) |
| **files reachable by path** (BOOT + carried + named) | **428** | **16** |
| in context | 587 lines, 0.17% | 583 lines, 0.17% |
| reachable | 32.08% | 0.26% |
| **unpointed share** | **67.92%** | **99.74%** |

**A second unit, NOT reach.js's and labelled so.** A file also counts when the shelf points at its DIRECTORY:
- strict names `ls exo_memory/loop/` and `ls exo_memory/journal/` in its window note;
- light's BY DIRECTORY list names the root, `record`, `memory`, `librarian`, `spread`, `research`, `map`, `journal` and `loop`.

"Top" means directly in the named directory, what `ls` prints. "Any depth" means anywhere below it. The root counts at its top level only.

| | strict | light |
|---|---:|---:|
| files reachable, top | 874 | 806 |
| unpointed share, top | 46.80% | 49.34% |
| files reachable, any depth | 1,138 | 1,082 |
| unpointed share, any depth | 44.53% | 46.65% |

**Where the unpointed lines sit (reach.js's unit):**
- **light:** handback/ 157,532 · loop/ 135,538 · librarian/ 16,547 · map/ 14,065 · journal/ 8,500 · (root) 4,794 · attic/ 1,889 · research/ 1,252 · record/ 697 · memory/ 273 · spread/ 266 · audit/ 265 · review/ 127 · astra/ 81.
- **strict:** handback/ 150,269 · loop/ 80,164 · attic/ 1,889 · audit/ 265 · review/ 127 · astra/ 81.
- **handback/ is named by neither shelf's directory list.** Strict names 56 unmapped hand-backs by path; light names none.

**Both shelves name a full-text search.** Light gives `grep -rl "<term>" <exo_memory>`; strict says "grep reaches inside" for loop/ and journal/. By search, every file is reachable under either. That ceiling is the same for both and carries no number here.

## What I changed to run it, and why the numbers stay comparable
- **reach.js cannot take the snapshot as its corpus.** It reads `<repo>/exo_memory`, and its 08-22 sections run `git` and `state-block.js` on that repo. The
  snapshot is an exo_memory tree, not a repo. So `lightreach.js` ports only reach.js's shelf section:
  - `walk`, `nl` and `pct` are reach.js `:42-44` and `:72-84`, verbatim;
  - the strict parser and the formulas are `:119-159`, verbatim, with their inputs passed in.
- **The one addition is a light parser.** The light shelf has no `## NOT CARRIED` per-file index and no `THE INDEX IS WINDOWED` line. reach.js on it would find
  neither and list nothing. The parser reads, into the same three sets:
  - "carried": the same `## <rel>.md` heading regex as reach.js `:124`. It finds 14, which matches the light header's "14 file(s) carried in full".
  - "named by path": the one `- \`<path>.md\`` bullet above BY DIRECTORY.
  - "directories": the BY DIRECTORY bullets. Their stated counts (21 / 4 / 13 / 44 / 2 / 8 / 17 / 36 / 924) equal the snapshot's own: the root at top
    level, `loop` recursive.
  - Then the formulas are the same for both forms.
- **Parity, checked.** The strict run on the snapshot reproduces C's committed `p-shelfbudget-C_2026-10-11_evidence/reach/new.json` in every field I
  compared: carried 15, indexed 412, corpus 2,105 files and 342,732 lines, in context 587, indexed lines 109,350, reachable 32.08%, dropped 464 files and
  73,026 lines (21.31%), unpointed 67.92%, and the by-top breakdown. C ran on the main checkout at 14:5xZ, so the snapshot and that checkout matched at
  the dump.
- **One field does not carry over.** reach.js's "dropped by the index window" (light: 731 files, 44.05%) means files left out of a per-file index by its byte
  window. Light has no per-file index and no window, so for light that field only says "index-tier file not named by path". Read it so; it is not
  a window loss.

## Not covered
- **This is one snapshot and the librarian's shelf only.** pane-C's light and strict dumps sit beside it in `new2`; I did not run them (not asked).
- **Reach is pointers on the shelf, not opens.** Whether a seat follows a directory pointer as often as a file pointer is not measured here.
  A's F1–F3 scorer counts opens.
- **No verdict on the mode,** as the packet says.

## Corrections to myself
None to report. The first strict run matched C's numbers, so the port needed no repair.

NEXT: librarian set the number beside H3 when this hand-back is read; the mode decision is the keeper's, at ~10-17
