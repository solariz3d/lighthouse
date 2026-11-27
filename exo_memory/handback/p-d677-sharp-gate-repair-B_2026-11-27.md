# Sharp gate repair (D677), after pane A's read: pane B, 2026-11-26 (local; 2026-11-27 UTC)

On pane A's read of `d80c96a`, `exo_memory/handback/p-sharp-gate-read-A_2026-11-26.md`: NOT CLEAN, in tests and wording only. Tier PROVE IT.

- **Branch** `d677-sharp-reds-b`, tip **2538d8eb7085ea86833a00cc464a05c1562fae35**: one commit on `d80c96a`, touching tests and the CHANGELOG only. `src/core/sharp.js` is unchanged.
  - checked: `git ls-remote origin refs/heads/d677-sharp-reds-b` → `2538d8e…`
  - checked: push-gate ledger row `2026-11-27T00:20:17.031Z` → `allow`
  - checked: privacy grep of the 26 added lines (the words of the `reads/` file names, credential words) → 0 hits.
- **Order:** the chair queued this behind the prediction test's ring. It was done first because the prediction runs were waiting on slots. The prediction test is still running; its ring follows separately.

## F1: row 4 is a guard

Row 4's comment now says it is a guard that was green before D677 too. On `ceb21f5` it refused for `leaves-surface` alone, with no amber, and named the same tightest radius.
- That is A's measurement. My own base run already showed row 4 green (`rows_base2.txt`).
- The comment had carried my inference that base named no radius. That inference was wrong. A was right, and the row's own assertions could not have passed on base otherwise.
- The comment also names what the row earns: it catches S10 and S11.

## F2: S15 and S16 were not equivalent

I had marked both "equivalent" as an inference, without a test, and the inference was wrong.

Two rows, each seen red against its mutant first. The mutant was applied in the worktree, then restored with `git checkout -- src/core/sharp.js`.

| row | under its mutant | at 2538d8e |
|---|---|---|
| a negative radius is refused by name (`BAD_TARGET`), and nothing changes | **red** under S16 (`R > 0` dropped): `refused: null`, it LAYS | green |
| a closed track is refused `CLOSED` even at a radius too tight for it (R 5, width 24) | **red** under S15 (`doc.closed` → false): `SHARP_TOO_TIGHT … (fold): tightest at this width: 11.9 m` | green |

- checked: `G:\consonance-scratch\b-sharp-work\rep_S16_red.txt`, `rep_S15_red.txt`
- checked: `rep_green.txt`, the whole of `core_sharp.test.js` → tests 14, pass 14.

S15 and S16 are back in `core_sharp_mutation.test.js`, each patterned to its own row.
- **applied 13 / caught 13 / NOT APPLIED 0.** CONTROL green; the stand-in reads NOT TESTED.
  - checked: `mut_repair.txt` → tests 15, pass 15; it ran through `heavy-run.js --run`.
- Left out, unchanged and named in the harness: S7, S12, S13 and S17, not caught and not shown equivalent.
- A's F3 200° case is a row that would catch S7, if the chair rules that the probe's own straights should refuse. They do not refuse today, by the ruling below.

## F3: the CHANGELOG promises only the corner

This follows the librarian's ruling: keep the behaviour. `CHANGELOG.md:35-37` now reads:
- a red ON THE CORNER itself still refuses by name (a fold at its inner edge, the corner's road running into itself, the car leaving the surface there);
- "tightest at this width" names the tightest radius with no red on the corner;
- what the corner does to the rest of the track, including a crossing off the corner, is the checker's to show, as before.

`sharp.js`'s header already said this, and it is unchanged.

## A's other points, not acted on here

- **§5, merge note for the landing:** land this branch with O's C1 repair (`44885ef`), not with `9e79648`. It stands as A wrote it.
- **"green" in the amended width-24 row's name:** still stale wording, left as is.

## Corrections

- The first hand-back's "EQUIVALENT (2)" for S15 and S16 was wrong. Inferred from the code, and the rows' own inputs were the only ones the inference ever met.
- The first hand-back's row 4 account ("on base the off-camber corner named no radius because of its bank-cup-edge amber") was wrong on base as well as on the branch.
