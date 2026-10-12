# p-misssample-A — D301 part 2 (ledger D302): the sample, frozen; seat A, 2026-10-11

I gathered. **I labelled no unit miss, not-miss, stale or reasoning, and read none for that.** C classifies, blind, from B's definitions.

**Result: lighthouse `27fb0eea` on `2f2b3a6a`, branch `d301-a`, worktree `G:\consonance-worktrees\a-d301-wt`. Local, named paths, not pushed.** Everything is in `exo_memory/handback/p-misssample-A_2026-10-11_evidence/`: `sample.js`, `today.json`, `out/units.json` (the frozen sample), `out/units.tsv` (one row per unit), `out/digest.txt`.

## The digest
**`units.json` sha256 `07b840c05eb21d34595c47227d4fc40b96eba101efe7bebed8e2944e4738ed65`**. The function is sha256 over the UTF-8 bytes of `out/units.json`, as committed (checked: `sha256sum` of the file, and `digest.txt`).
checked: two full runs wrote byte-identical `units.json` (both printed that digest).

## One command
```
node exo_memory/handback/p-misssample-A_2026-10-11_evidence/sample.js --repo . --rev 2f2b3a6a \
  --rows exo_memory/handback/p-scoreboard-E_2026-10-11_evidence/out/rows.tsv --projects ~/.claude/projects \
  --today <evidence>/today.json --fallback-checkout <the main lighthouse checkout> --out <dir>
```
Defaults: `--seed d301-2026-10-11`, `--alloc keeper=12,instrument=12,unattributed=5,seat=31`, `--until 2026-10-11T21:36:00-06:00` (transcripts after that are ignored, so the digest does not move as panes keep talking). I ran it under `heavy-run.hold()` (read-only, 28 s). It needs the transcripts to exist under `~/.claude/projects`, and the two working-copy lines below to still read as they did.

## The draw (the draw function: rank = sha256(`seed|src|at|text[0:80]`); per finder stratum, ascending rank, first n)
Population: E's `rows.tsv` sources **W + H + L = 1,095 catches** (checked: `awk` over the file: W 101, H 985, L 9). **Source G (383 gate refusals) is out**: E scored every one "not a catch". Finder counts: keeper 17, seat 991, instrument 82, unattributed 5.
| stratum | in population | drawn | sources of the draw |
|---|---:|---:|---|
| keeper | 17 | 12 | W 11, L 1 |
| instrument | 82 | 12 | H 12 |
| unattributed | 5 | 5 (all) | L 4, W 1 |
| seat | 991 | 31 | H 28, W 3 |
| today | n/a | +2 | T1, T2 |
**60 drawn + today's 2 = 62 units.** I read "draw 60 … plus today's two" as 62. If 58 + 2 was meant, drop the last two seat rows by rank; the order is in `out/units.tsv` (S01…S60 are in stratum order, not rank order, so re-run with `--alloc seat=29`).
- **The allocation (12/12/5/31) is my choice; the packet gave none.** Taken so the three small finder strata are read in volume and the seat stratum, 90% of the population, still has 31. **Weighting back to the population is C's or the librarian's: every unit carries `stratum_pop` and `stratum_n`.**
- **Thin spot:** the seat stratum's W (librarian WRONG) entries are 86 of 991 but only 3 of 31 drawn, and the H hand-back corrections are 28. A "WRONG entry" share read off this sample is a 3-row read for the seat finder. Say so if a W-only figure is wanted, and I will draw W separately.
- The finder column is E's. For H it is lexical (E audited it, §4 of the scoreboard); I did not re-audit it.

## What each unit holds (all gathered by command or file read; none judged)
- `correction_at` (path:line), `correction_text` (the item that starts there, to the next blank line or item, cap 3000 chars), `correction_text_source` (`rev` = the file at `2f2b3a6a`).
- Times: `correction_line_time` (git blame committer time of that line), `correction_file_first_commit` (`git log --diff-filter=A`), and the row's `day`.
- `cited_refs`: every path or path:line in the item, resolved against the tree at `2f2b3a6a` (exact, `exo_memory/` prefix, or a unique basename), each with `first_commit` (the oldest `--diff-filter=A` line for that path, sha beside it) and, for a path:line, `line_time` (blame). **53 refs in total; 32 resolved, and all 32 have a first-commit time.** The 21 unresolved are named in the unit with why (`ambiguous (8)` for a bare `main.rs`, `not tracked at rev`).
- **The erring claim:** the correction item carries it, quoted or in the sentence; it has no path:line of its own in 60 of 62 units. `claim_at` / `claim_text` are filled only for T1 and T2, where the chair gave the line. Elsewhere the claim is found, if at all, in the transcript (next).
- `transcript`, three statuses: **claim-located 23** (the earliest assistant-authored occurrence, text or tool_use input, of a quoted span of ≥ 30 chars, in the transcripts of A, B, C, E, librarian and main; **never third-place**), **correction-turn-located 29** (no quoted span matched, but the correction's own first line was found: that is the turn that WROTE the correction, not the claim), **neither-located 10** (S05 S06 S12 S26 S35 S36 S37 S45 S49 S52). For a located turn: `opened_before_claim_in_turn` and `opened_in_whole_turn` (the Read `file_path`s from the real user message to the next one); for a correction turn also `cited_paths_already_read_in_this_transcript`, with the first-read time.
- **`no-transcript` appears for 0 units, but that is not "all had one".** The 10 neither-located split three ways (checked: `units.json`). **S26, S36, S37, S45, S49, S52 (6):** the row names no seat (a journal line, or a hand-back file with no seat letter), and their days are 09-01 to 09-09, before the lettered seats' transcripts start (checked: `transcript_coverage`: A 09-12, B 09-09, C 09-09, E 09-12, librarian 09-01, main 06-30); inferred: there is no transcript of the author to find. **S05, S06, S12 (3):** librarian WRONG entries dated 09-01, inside the librarian's coverage, with no quoted span or own-line match. **S35 (1):** E's hand-back of 09-16, E covered, no match. I proved no absence in any of the 10.

## Limits C and the librarian must read before using the transcript fields
- **Only the `Read` tool counts as "opened".** A file seen through `grep`, a `cat` in Bash, a hook's injected text or the shell's own context is not in `opened_*`. **Of the 23 claim-located units, 20 show no Read at all before the claim in that turn.** That is a count of Reads, not of what the seat had in view.
- **A "claim" hit can be the correction quoting the claim.** The scan takes the earliest assistant occurrence across all transcripts, so a claim made in a laptop session or before 09-09 would be missed and a later quote taken. Each hit carries `after_correction_file_first_commit` and `after_correction_line_time`: **3 of 23 hit after the correction line was written**, so those 3 are probably the correction itself. For them, read the correction-turn fields instead.
- The seat is the transcript FOLDER the hit was found in, under the **current** seat map (A `sibling-3d57124e`, B `sibling-5bf9d657`, C `sibling-0845a868`, E `sibling-07b8a48f`, librarian, main = chair). Earlier eras may have had other panes in those letters (`persist.log` shows letters reassigned in July); I did not check which panes held a letter in September. Claim hits by seat: librarian 14, A 4, E 2, C 2, B 1.
- Laptop-column W entries (machine L) have no transcript here.
- `line_time` is the blame at `2f2b3a6a`, i.e. when the line was LAST written, not first. A line edited after the claim reads later than it was.

## Two units read from an uncommitted file
S32 (`librarian/2026-10-06.desktop.md:123`, E's `override:add` row) and T2's claim (`handback/p-soakclean-E_2026-10-11.md:109`) are lines that exist only in the main checkout's working tree at this moment (the files are modified there; `2f2b3a6a` has 117 and 91 lines). They are read through `--fallback-checkout` and marked `working-copy`; their time is the file's mtime. Their text is frozen in `units.json`, but a re-run from another machine cannot rebuild those two from git alone.

## Today's two (T1, T2; `today.json`)
- **T1:** claim `loop/plan_clean_up_after_ourselves_2026-10-10.md:97`, correction `loop/plan_queue_sweep_d300_2026-10-11.md:19`; the answer was `handback/p-heavyrunmut-B_2026-10-11.md` (first commit 2026-10-11T02:38-06:00, `b8b52bbd`). The `:97` line's blame time is 2026-10-11T03:02:05Z, and the librarian transcript hit is 03:02:05.643Z: the same instant, with 0 Reads before it in that turn (checked: `units.json` T1).
- **T2:** claim `handback/p-soakclean-E_2026-10-11.md:109`, correction `plan_queue_sweep_d300_2026-10-11.md:58`; the answer `map/A.md:1815` (the withdrawal). The claim-located turn is E's.
- Both are pointers the chair gave me. I gathered; whether either is a retrieval miss is C's.

## Not checked / not done
- I did not read the 62 units for meaning beyond spot checks of S13 and T1 to see the fields filled; no classification.
- The scoreboard's own rows (`rows.tsv` sha256 `259097951da7ab7d…`) were not re-derived; I used them as given.
- No tests: this is a measuring script with no row. Reproducibility is the two identical digests.
- `portable-paths` exit 0 (383 files in scope, 0 new), `carrier-drift` exit 0, after committing.

NEXT: librarian dispatch C's blind read with `p-misssample-A_2026-10-11_evidence/out/units.json` and digest `07b840c0…` once B's registration is committed
